<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">✖</button>
        <div v-if="step === 1" class="step-1">
          <h2 class="modal-title">Новый отзыв</h2>
          <div class="rating-section">
            <div class="rating-item">
              <p>Общая оценка</p>
              <div class="stars">
                <span v-for="star in 5" :key="star" @click="setRating(star)">
                  <img :src="star <= rating ? starFill : starEmpty" alt="star">
                </span>
              </div>
            </div>
          </div>
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <div class="modal-buttons">
            <button class="btn-back" @click="closeModal">Назад</button>
            <button class="btn-next" @click="nextStep">Дальше</button>
          </div>
        </div>
        <div v-else class="step-2">
          <h2 class="modal-title">Новый отзыв</h2>
          <p class="modal-subtitle">Напишите пару строк о своих впечатлениях</p>
          <textarea
              v-model="reviewText"
              placeholder="Всё понравилось"
              class="review-textarea"
          ></textarea>
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          <div class="modal-buttons">
            <button class="btn-back" @click="prevStep">Назад</button>
            <button class="btn-submit" @click="submitReview">Опубликовать</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { thisUrl } from '../url.js';
import starFill from '@/assets/star_fill.svg';
import starEmpty from '@/assets/star_empty.svg';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  realtyId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['update:isOpen', 'review-submitted']);

const step = ref(1);
const rating = ref(0);
const reviewText = ref('');
const errorMessage = ref('');

const submitReview = async () => {
  try {
    errorMessage.value = '';

    if (rating.value === 0) {
      errorMessage.value = 'Пожалуйста, поставьте оценку';
      step.value = 1;
      return;
    }

    if (!reviewText.value.trim()) {
      errorMessage.value = 'Пожалуйста, напишите отзыв';
      return;
    }

    const token = Cookies.get('authToken');
    if (!token) {
      errorMessage.value = 'Требуется авторизация';
      return;
    }

    const response = await axios.post(
        `${thisUrl()}/feedback/create`,
        {
          realty_id: props.realtyId,
          rating: rating.value,
          comment: reviewText.value.trim(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
    );

    emit('review-submitted');
    closeModal();
  } catch (error) {
    console.error('Ошибка при отправке отзыва:', error);
    errorMessage.value = error.response?.data?.message ||
        'Не удалось отправить отзыв';
  }
};

const closeModal = () => {
  emit('update:isOpen', false);
  resetForm();
};

const resetForm = () => {
  step.value = 1;
  rating.value = 0;
  reviewText.value = '';
  errorMessage.value = '';
};

const setRating = (value) => {
  rating.value = value;
};

const nextStep = () => {
  if (rating.value === 0) {
    errorMessage.value = 'Пожалуйста, выберите оценку';
    return;
  }
  step.value = 2;
  errorMessage.value = '';
};

const prevStep = () => {
  step.value = 1;
  errorMessage.value = '';
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  padding: 30px;
  width: 650px;
  min-height: 350px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  padding: 5px;
}

.modal-title {
  font-family: Noto Sans;
  font-weight: 400;
  font-size: 24px;
  text-align: center;
}

.modal-subtitle {
  font-family: Noto Sans;
  font-weight: 400;
  font-size: 16px;
  text-align: center;
  margin-top: 20px;
}

.rating-section {
  display: flex;
  flex-direction: column;
  margin: 20px 0;
  align-items: center;
}

.rating-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  width: 100%;
}

.rating-item p {
  font-family: Noto Sans;
  font-weight: 400;
  font-size: 19px;
}

.stars {
  display: flex;
  gap: 10px;
}

.stars img {
  width: 64px;
  height: 64px;
  cursor: pointer;
  transition: transform 0.3s;
}

.stars img:hover {
  transform: scale(1.1);
}

.review-textarea {
  width: 100%;
  height: 120px;
  border: none;
  border-radius: 8px;
  padding: 15px;
  font-size: 16px;
  resize: none;
  margin: 20px 0;
  background-color: #F2F0EE;
}

.review-textarea:focus {
  border: 1px solid #FF784F;
  outline: none;
}

.error-message {
  color: #ff4a2b;
  margin: 10px 0;
  text-align: center;
  font-size: 14px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: auto;
  gap: 16px;
}

.btn-back {
  background: none;
  border: none;
  color: #FF784F;
  font-size: 16px;
  cursor: pointer;
  padding: 10px 20px;
  font-family: Noto Sans;
  font-weight: 600;
  text-transform: uppercase;
}

.btn-next,
.btn-submit {
  background-color: #FF784F;
  color: black;
  border: none;
  padding: 12px 24px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-next:hover,
.btn-submit:hover {
  background-color: #fa6841;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.step-1, .step-2 {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  height: 100%;
}

.step-1 {
  justify-content: center;
}

/* Адаптив для 1366px */
@media (max-width: 1366px) {
  .modal-content {
    width: 500px;
    padding: 20px;
    min-height: 300px;
  }

  .modal-title {
    font-size: 20px;
  }

  .modal-subtitle {
    font-size: 14px;
    margin-top: 15px;
  }

  .rating-item p {
    font-size: 16px;
  }

  .stars img {
    width: 48px;
    height: 48px;
  }

  .rating-section {
    margin: 15px 0;
  }

  .review-textarea {
    height: 100px;
    padding: 10px;
    font-size: 14px;
    margin: 15px 0;
  }

  .modal-close {
    font-size: 18px;
    top: 10px;
    right: 10px;
  }

  .btn-back {
    font-size: 14px;
    padding: 8px 15px;
  }

  .btn-next,
  .btn-submit {
    padding: 10px 20px;
    font-size: 14px;
  }

  .error-message {
    font-size: 12px;
  }
}

/* Адаптив для 360px (мобильные устройства) */
@media (max-width: 360px) {
  .modal-overlay {
    align-items: flex-start;
  }

  .modal-content {
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 15px;
    border-radius: 0;
    min-height: 100%;
  }

  .modal-title {
    font-size: 18px;
  }

  .modal-subtitle {
    font-size: 12px;
    margin-top: 10px;
  }

  .rating-section {
    margin: 10px 0;
  }

  .rating-item {
    gap: 10px;
  }

  .rating-item p {
    font-size: 14px;
  }

  .stars {
    gap: 5px;
  }

  .stars img {
    width: 32px;
    height: 32px;
  }

  .review-textarea {
    height: 150px;
    padding: 10px;
    font-size: 12px;
    margin: 10px 0;
  }

  .modal-close {
    font-size: 16px;
    top: 10px;
    right: 10px;
  }

  .error-message {
    font-size: 12px;
    margin: 5px 0;
  }

  .modal-buttons {
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }

  .btn-back {
    font-size: 12px;
    padding: 8px;
    width: 100%;
  }

  .btn-next,
  .btn-submit {
    padding: 10px;
    font-size: 12px;
    width: 100%;
  }

  .step-1, .step-2 {
    justify-content: flex-start;
  }
}
</style>