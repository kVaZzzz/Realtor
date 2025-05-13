<template>
  <div class="realties">
    <h2>Избранные объявления</h2>

    <div v-if="error" class="error-message">{{ error }}</div>
    <div v-else-if="favorites.length === 0" class="empty-message">
      У вас пока нет избранных объявлений
    </div>

    <div v-else class="realties-list">
      <div v-for="realty in favorites" :key="realty.id" class="realty-card">
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
          <button class="favorite-btn" @click="showRemoveModal(realty.id)">
            <img src="@/assets/full_shape.png" alt="Удалить из избранного">
          </button>
        </div>

        <div class="realty-info">
          <h3 class="price">{{ formatPrice(realty.price) }} ₽ / МЕС</h3>
          <p class="details" v-if="realty.count_rooms && realty.total_square && realty.floor">
            {{ getRoomCountText(realty.count_rooms) }} · {{ realty.total_square }} м² · {{ realty.floor }} этаж
          </p>
          <p class="address">{{ realty.address }}</p>
          <div class="actions">
            <button class="view-reviews" @click="goToAnnouncement(realty.id)">Перейти к объявлению</button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h3>Подтверждение удаления</h3>
        <p>Вы уверены, что хотите удалить это объявление из избранного?</p>
        <div class="modal-actions">
          <button class="modal-canc el" @click="hideRemoveModal">Отмена</button>
          <button class="modal-confirm" @click="confirmRemove">Удалить</button>
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

const favorites = ref([]);
const error = ref(null);
const showModal = ref(false);
const realtyToRemove = ref(null);
const router = useRouter();

// Добавляем метод goToAnnouncement
const goToAnnouncement = (id) => {
  router.push(`/announ/${id}`);
};

const showRemoveModal = (realtyId) => {
  realtyToRemove.value = realtyId;
  showModal.value = true;
};

const hideRemoveModal = () => {
  showModal.value = false;
  realtyToRemove.value = null;
};

const confirmRemove = async () => {
  if (realtyToRemove.value) {
    await removeFavorite(realtyToRemove.value);
    hideRemoveModal();
  }
};

const fetchFavorites = async () => {
  try {
    const token = Cookies.get('authToken');
    if (!token) {
      error.value = 'Для просмотра избранного необходимо авторизоваться';
      return;
    }

    const response = await axios.get(`${thisUrl()}/favorite/show`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    favorites.value = response.data.favorites || [];
  } catch (err) {
    error.value = err.response?.data?.message || 'Не удалось загрузить избранное';
  }
};

const removeFavorite = async (realtyId) => {
  try {
    const token = Cookies.get('authToken');
    if (!token) return;

    await axios.delete(
        `${thisUrl()}/favorite/destroy/${realtyId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
    );

    favorites.value = favorites.value.filter(item => item.id !== realtyId);
  } catch (err) {
    error.value = 'Не удалось удалить из избранного';
    console.error('Ошибка при удалении из избранного:', err);
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

onMounted(fetchFavorites);
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

.favorite-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
}

.favorite-btn img {
  width: 24px;
  height: 24px;
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

.original-price {
  text-decoration: line-through;
  color: #888;
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

.view-reviews {
  background: none;
  border: 1px solid #FF784F;
  color: #FF784F;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 300ms ease;
}

.view-reviews:hover {
  color: white;
  background-color: #FF784F;
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
</style>