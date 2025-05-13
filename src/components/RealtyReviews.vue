<template>
  <div class="feedback-container">
    <h1>Отзывы о {{ realtyTitle }}</h1>

    <div class="rating-summary">
      <div class="overall-rating">
        <span>Общая оценка</span>
        <div class="stars">
          <span v-for="i in 5" :key="i" :class="{ 'filled': i <= Math.round(averageRating) }">★</span>
        </div>
        <span class="rating-value">{{ averageRating.toFixed(1) }}</span>
      </div>
    </div>

    <h2>{{ feedbacks.length }} отзыва</h2>

    <div class="feedback-list">
      <div v-for="feedback in feedbacks" :key="feedback.id" class="feedback-item">
        <div class="feedback-header">
          <strong>{{ feedback.user.name }}</strong>
          <span>{{ formatDate(feedback.created_at) }}</span>
        </div>

        <div class="feedback-rating">
          <span v-for="i in 5" :key="i" :class="{ 'filled': i <= feedback.rating }">★</span>
        </div>

        <p class="feedback-comment">{{ feedback.comment }}</p>

        <button
            v-if="isAuthenticated && feedback.user.id === currentUserId"
            @click="deleteFeedback(feedback.id)"
            class="delete-feedback"
        >
          Удалить отзыв
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { thisUrl } from '../url.js';

const props = defineProps({
  realtyId: {
    type: Number,
    required: true
  },
  realtyTitle: {
    type: String,
    default: 'недвижимости'
  }
});

const feedbacks = ref([]);
const averageRating = ref(0);
const totalFeedbacks = ref(0);
const error = ref(null);
const isAuthenticated = ref(false);
const currentUserId = ref(null);

const fetchFeedbacks = async () => {
  try {
    const response = await axios.get(`${thisUrl()}/feedback/outputFeedback/${props.realtyId}`);

    feedbacks.value = response.data.feedbacks;
    averageRating.value = response.data.average_rating;
    totalFeedbacks.value = response.data.total;
  } catch (err) {
    error.value = err.response?.data?.message || 'Не удалось загрузить отзывы';
    console.error('Ошибка при загрузке отзывов:', err);
  }
};

const deleteFeedback = async (feedbackId) => {
  try {
    const token = Cookies.get('authToken');
    if (!token) {
      error.value = 'Необходима авторизация';
      return;
    }

    await axios.delete(`${thisUrl()}/feedback/delete/${feedbackId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await fetchFeedbacks();
  } catch (err) {
    error.value = err.response?.data?.message || 'Не удалось удалить отзыв';
    console.error('Ошибка при удалении отзыва:', err);
  }
};

const formatDate = (dateString) => {
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('ru-RU', options);
};

const checkAuth = () => {
  const token = Cookies.get('authToken');
  if (token) {
    isAuthenticated.value = true;
  }
};

onMounted(() => {
  checkAuth();
  fetchFeedbacks();
});
</script>

<style scoped>
.feedback-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
}

h2 {
  font-size: 20px;
  margin: 30px 0 15px;
  color: #333;
}

.rating-summary {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.overall-rating {
  display: flex;
  align-items: center;
  gap: 15px;
}

.stars {
  color: #ccc;
  font-size: 18px;
}

.stars .filled {
  color: #FF784F;
}

.rating-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.feedback-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.feedback-item {
  padding: 20px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.feedback-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.feedback-header strong {
  font-size: 16px;
}

.feedback-header span {
  color: #666;
  font-size: 14px;
}

.feedback-rating {
  margin-bottom: 10px;
  color: #FF784F;
  font-size: 16px;
}

.feedback-comment {
  margin: 10px 0;
  line-height: 1.5;
  color: #333;
}

.delete-feedback {
  background: none;
  border: none;
  color: #ff4a2b;
  cursor: pointer;
  padding: 5px 0;
  font-size: 14px;
}

.delete-feedback:hover {
  text-decoration: underline;
}

.error-message {
  color: #ff4a2b;
  text-align: center;
  padding: 20px;
}

/* Адаптив для 1366px */
@media (max-width: 1366px) {
  .feedback-container {
    max-width: 100%;
    padding: 15px;
  }

  h1 {
    font-size: 20px;
    margin-bottom: 15px;
  }

  h2 {
    font-size: 18px;
    margin: 20px 0 10px;
  }

  .rating-summary {
    margin-bottom: 20px;
    padding-bottom: 15px;
  }

  .overall-rating {
    gap: 10px;
  }

  .stars {
    font-size: 16px;
  }

  .rating-value {
    font-size: 20px;
  }

  .feedback-item {
    padding: 15px;
  }

  .feedback-header strong {
    font-size: 14px;
  }

  .feedback-header span {
    font-size: 12px;
  }

  .feedback-rating {
    font-size: 14px;
  }

  .feedback-comment {
    font-size: 14px;
  }

  .delete-feedback {
    font-size: 12px;
  }
}

/* Адаптив для 360px (мобильные устройства) */
@media (max-width: 360px) {
  .feedback-container {
    padding: 10px;
  }

  h1 {
    font-size: 18px;
    margin-bottom: 15px;
  }

  h2 {
    font-size: 16px;
    margin: 15px 0 10px;
  }

  .rating-summary {
    margin-bottom: 15px;
    padding-bottom: 10px;
  }

  .overall-rating {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .stars {
    font-size: 14px;
  }

  .rating-value {
    font-size: 18px;
  }

  .feedback-list {
    gap: 15px;
  }

  .feedback-item {
    padding: 10px;
  }

  .feedback-header {
    flex-direction: column;
    gap: 5px;
  }

  .feedback-header strong {
    font-size: 14px;
  }

  .feedback-header span {
    font-size: 12px;
  }

  .feedback-rating {
    font-size: 12px;
    margin-bottom: 5px;
  }

  .feedback-comment {
    font-size: 12px;
    margin: 5px 0;
  }

  .delete-feedback {
    font-size: 12px;
    padding: 5px 0;
  }

  .error-message {
    font-size: 12px;
    padding: 10px;
  }
}
</style>