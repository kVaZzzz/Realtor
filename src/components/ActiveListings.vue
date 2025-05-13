<template>
  <div class="realties">
    <h2>Мои объявления</h2>

    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="realties.length === 0" class="empty-message">
      У вас пока нет объявлений
    </div>

    <div v-else class="realties-list">
      <div v-for="realty in realties" :key="realty.id" class="realty-card">
        <div class="listing-image-container">
          <img
              v-if="getImageUrl(realty.images)"
              :src="getImageUrl(realty.images)"
              alt="Фото недвижимости"
              class="realty-image"
          />
          <div v-else class="no-image-placeholder">
            Нет изображения
          </div>
        </div>

        <div class="realty-info">
          <h3 class="price">{{ formatPrice(realty.price) }} ₽ / мес</h3>
          <p class="details" v-if="realty.count_rooms && realty.total_square && realty.floor">
            {{ getRoomCountText(realty.count_rooms) }} · {{ realty.total_square }} м² · {{ realty.floor }} этаж
          </p>
          <p class="address">{{ realty.address }}</p>
          <div class="actions">
            <button class="view-reviews" @click="goToAnnouncement(realty.id)">Перейти к объявлению</button>
            <button class="delete-btn" @click="showDeleteModal(realty.id)">Удалить</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Подтверждение удаления</h3>
        <p>Вы уверены, что хотите удалить это объявление?</p>
        <div class="modal-actions">
          <button class="modal-cancel" @click="hideDeleteModal">Отмена</button>
          <button class="modal-confirm" @click="confirmDelete">Удалить</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Cookies from 'js-cookie';
import { thisUrl } from '../url.js';
import { useRouter } from 'vue-router';

const realties = ref([]);
const error = ref(null);
const showModal = ref(false);
const realtyToDelete = ref(null);
const router = useRouter();

const showDeleteModal = (realtyId) => {
  realtyToDelete.value = realtyId;
  showModal.value = true;
};

const hideDeleteModal = () => {
  showModal.value = false;
  realtyToDelete.value = null;
};

const confirmDelete = async () => {
  if (realtyToDelete.value) {
    await deleteRealty(realtyToDelete.value);
    hideDeleteModal();
  }
};

const goToAnnouncement = (id) => {
  router.push(`/announ/${id}`);
};

const fetchRealties = async () => {
  try {
    const token = Cookies.get('authToken');
    if (!token) {
      error.value = 'Для просмотра объявлений необходимо авторизоваться';
      return;
    }

    const response = await axios.get(`${thisUrl()}/user/userRealty`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    realties.value = response.data.listings || [];
  } catch (err) {
    error.value = err.response?.data?.message || 'Не удалось загрузить объявления';
  }
};

const deleteRealty = async (realtyId) => {
  try {
    const token = Cookies.get('authToken');
    if (!token) return;

    await axios.delete(`${thisUrl()}/realty/delete/${realtyId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    realties.value = realties.value.filter(item => item.id !== realtyId);
  } catch (err) {
    error.value = 'Не удалось удалить объявление';
  }
};

const getImageUrl = (images) => {
  if (!images) return '';
  try {
    let imagePath = '';
    if (typeof images === 'string') {
      const parsedImages = JSON.parse(images);
      imagePath = parsedImages[0] || '';
    } else if (Array.isArray(images)) {
      imagePath = images[0] || '';
    }
    const baseUrl = thisUrl().replace('/api', '');
    return `${baseUrl}/${imagePath}`.replace(/([^:]\/)\/+/g, "$1");
  } catch {
    return '';
  }
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price);
};

const getRoomCountText = (count) => {
  if (count === 'студия') return 'СТУДИЯ';
  if (count === '6+') return '6+ КОМН';
  if (count === 'свободная планировка') return 'СВОБ. ПЛАНИРОВКА';
  return `${count} КОМН`;
};

onMounted(fetchRealties);
</script>

<style scoped>
.realties {
  background-color: #F2F0EE;
  padding: 20px;
  border-radius: 8px;
  min-height: 300px;
}

.error-message {
  color: #ff4a2b;
  text-align: center;
  padding: 20px;
}

.empty-message {
  text-align: center;
  padding: 40px;
  color: #666;
}

.realties-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 20px;
}

.realty-card {
  display: flex;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 10px 10px 5px rgba(204, 204, 204, 0.5);
}

.listing-image-container {
  position: relative;
  width: 320px;
  height: 200px;
}

.realty-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  color: #666;
  border: 1px dashed #ccc;
}

.realty-info {
  padding: 15px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.price {
  font-size: 18px;
  font-weight: bold;
  margin: 0 0 5px 0;
}

.details {
  color: #666;
  margin: 5px 0;
  text-transform: uppercase;
  font-size: 14px;
}

.address {
  color: #333;
  margin: 5px 0 10px 0;
}

.actions {
  margin-top: auto;
  display: flex;
  gap: 10px;
}

.view-reviews,
.delete-btn {
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 300ms ease;
}

.view-reviews:hover,
.delete-btn:hover {
  color: white;
  background-color: #FF784F;
}

.view-reviews {
  background: none;
  border: 1px solid #FF784F;
  color: #FF784F;
}

.delete-btn {
  background: none;
  border: 1px solid #ff4a2b;
  color: #ff4a2b;
}

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

.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal h3 {
  margin-top: 0;
  color: #333;
}

.modal p {
  margin: 15px 0;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.modal-cancel,
.modal-confirm {
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.modal-cancel {
  background: none;
  border: 1px solid #ccc;
  color: #333;
}

.modal-confirm {
  background: #ff4a2b;
  border: 1px solid #ff4a2b;
  color: white;
}

/* Адаптив для 1366px */
@media (max-width: 1366px) {
  .realties {
    padding: 15px;
  }

  .realty-card {
    flex-direction: row;
  }

  .listing-image-container {
    width: 250px;
    height: 150px;
  }

  .realty-info {
    padding: 10px;
  }

  .price {
    font-size: 16px;
  }

  .details {
    font-size: 12px;
  }

  .address {
    font-size: 14px;
  }

  .view-reviews,
  .delete-btn {
    padding: 5px 10px;
    font-size: 12px;
  }

  .modal {
    max-width: 350px;
    padding: 15px;
  }
}

/* Адаптив для 360px (мобильные устройства) */
@media (max-width: 360px) {
  .realties {
    padding: 10px;
    min-height: auto;
  }

  h2 {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .empty-message {
    padding: 20px;
    font-size: 14px;
  }

  .realty-card {
    flex-direction: column;
    width: 100%;
  }

  .listing-image-container {
    width: 100%;
    height: 180px;
  }

  .realty-info {
    padding: 10px;
  }

  .price {
    font-size: 16px;
  }

  .details {
    font-size: 12px;
  }

  .address {
    font-size: 12px;
    margin-bottom: 15px;
  }

  .actions {
    flex-direction: column;
    gap: 5px;
  }

  .view-reviews,
  .delete-btn {
    width: 100%;
    padding: 8px;
    font-size: 12px;
  }

  .modal {
    max-width: 90%;
    padding: 15px;
  }

  .modal h3 {
    font-size: 16px;
  }

  .modal p {
    font-size: 14px;
  }

  .modal-actions {
    flex-direction: column;
    gap: 5px;
  }

  .modal-cancel,
  .modal-confirm {
    width: 100%;
    padding: 10px;
    font-size: 12px;
  }
}
</style>