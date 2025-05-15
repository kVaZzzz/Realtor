<template>
  <section class="black-main">
    <div class="wrapper">
      <div class="title-name">
        <h2 class="name">ВАМ БУДЕТ ИНТЕРЕСНО</h2>
      </div>
      <div v-if="loading" class="loading">Загрузка...</div>
      <div v-if="error" class="error">{{ error }}</div>
      <div v-if="!loading && !error" class="listings-container">
        <div
            v-for="(listing, index) in listings.slice(0, 3)"
            :key="listing.id"
            class="listing"
            @click="goToAnnouncement(listing.id)"
        >
          <div class="listing-image-container">
            <img
                :src="listing.images[0] || imageUrl"
                alt="Квартира"
                class="listing-image"
                @error="handleImageError"
            />
            <img
                class="heart-on-image"
                @click.stop="toggleFavorite(listing.id, index)"
                :src="listing.is_favorite ? fullShape : shape"
                alt="Добавить в избранное"
            />
          </div>
          <div class="listing-info">
            <span class="price">{{ formatPrice(listing.price) }} ₽ / мес</span><br>
            <p class="details">{{ formatRooms(listing.count_rooms) }}, {{ listing.total_square }} м²</p>
            <p class="complex-name"><strong>{{ listing.complex_name }}</strong></p>
            <p class="address">{{ listing.address }}</p>
          </div>
        </div>
      </div>
      <button class="view-all" @click="$router.push('/filters-search')">СМОТРЕТЬ ВСЕ</button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { thisUrl } from "../url.js";
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import imageUrl from "@/assets/appartment.png"
import shape from "@/assets/shape.png"
import fullShape from "@/assets/full_shape.png"

const router = useRouter();
const getToken = () => Cookies.get('authToken') || '';

axios.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

const listings = ref([]);
const loading = ref(false);
const error = ref(null);

// Функция для перемешивания массива (алгоритм Фишера-Йетса)
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const fetchTopListings = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await axios.get(`${thisUrl()}/realty/filter`);
    // Перемешиваем объявления перед сохранением
    listings.value = shuffleArray(response.data.listings || []);
  } catch (err) {
    error.value = 'Не удалось загрузить топовые предложения';
    console.error('Ошибка загрузки:', err);
  } finally {
    loading.value = false;
  }
};

const formatPrice = (price) => {
  if (!price) return '';
  return new Intl.NumberFormat('ru-RU').format(price);
};

const formatRooms = (count) => {
  if (count === 'студия') return 'Студия';
  if (count === '6+') return '6+ комн.';
  if (count === 'свободная планировка') return 'Своб. план.';
  return `${count} комн.`;
};

const toggleFavorite = async (listingId, index) => {
  const token = getToken();
  if (!token) {
    alert('Пожалуйста, войдите в систему, чтобы добавить в избранное');
    router.push('/login');
    return;
  }

  try {
    const listing = listings.value[index];
    let response;

    if (listing.is_favorite) {
      response = await axios.delete(`${thisUrl()}/favorite/destroy/${listingId}`);
      if (response.status === 200) {
        listings.value[index].is_favorite = false;
      }
    } else {
      response = await axios.post(`${thisUrl()}/favorite/addToFavorite/${listingId}`);
      if (response.status === 200) {
        listings.value[index].is_favorite = true;
      }
    }
  } catch (err) {
    if (err.response) {
      if (err.response.status === 400) {
        alert(err.response.data.error);
      } else if (err.response.status === 401) {
        alert('Сессия истекла. Пожалуйста, войдите снова.');
        router.push('/login');
      }
    }
  }
};

const goToAnnouncement = (id) => {
  router.push(`/announ/${id}`);
};

const handleImageError = (e) => {
  e.target.src = imageUrl;
};

onMounted(() => {
  fetchTopListings();
});
</script>

<style scoped>
body {
  margin: 0;
}

.black-main {
  background-color: rgb(17, 17, 17);
  background-image: none;
}

.wrapper {
  margin-right: 160px;
  margin-left: 160px;
  color: rgb(253, 253, 253);
}

.title-name {
  padding-top: 100px;
  margin-bottom: 40px;
}

.name {
  color: rgb(253, 253, 253);
  font-weight: 500;
  font-size: 21px;
  text-align: left;
}

.listings-container {
  background: rgba(17, 17, 17, 1);
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.listing {
  display: flex;
  flex-direction: column;
  background: rgb(253, 253, 253);
  border-radius: 5px;
  overflow: hidden;
  height: 540px;
  width: 520px;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.listing-image-container {
  position: relative;
  width: 100%;
  height: 284px;
}

.listing-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.listing-info {
  padding: 15px;
  flex: 1;
  color: rgb(17, 17, 17);
}

.good-price {
  position: absolute;
  top: 16px;
  left: 16px;
  width: 107px;
  height: 22px;
  border-radius: 5px;
  padding: 5px 3px 2px 3px;
  font-weight: 300;
  font-size: 13px;
  text-align: center;
  background-color: #fff;
  color: rgba(255, 110, 66, 1);
}

.heart-on-image {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: auto;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.heart-on-image:active {
  opacity: 0.2;
}

.price {
  font-weight: 500;
  font-size: 32px;
}

.old-price {
  font-weight: 200;
  font-size: 24px;
  text-decoration: line-through;
}

.details {
  font-weight: 400;
  font-size: 24px;
}

.address {
  font-weight: 400;
  font-size: 16px;
}

.complex-name {
  font-weight: 600;
  font-size: 19px;
}

.view-all {
  width: 220px;
  height: 40px;
  border-radius: 5px;
  padding: 10px 16px;
  border: 1px solid rgb(255, 110, 66);
  font-weight: 600;
  font-size: 13px;
  color: rgb(253, 253, 253);
  cursor: pointer;
  transition: all 700ms ease;
  background-color: rgb(17, 17, 17);
  margin-left: 690px;
  margin-top: 25px;
  margin-bottom: 132px;
}

.view-all:hover {
  background-color: rgb(255, 110, 66);
}

.loading, .error {
  color: white;
  text-align: center;
  padding: 20px;
}
.listing:hover {
  transform: translateY(-5px);
}
@media (max-width: 1366px) {
  .wrapper {
    margin-right: 40px;
    margin-left: 40px;
    height: 704px;
  }

  .title-name {
    padding-top: 60px;
  }

  .listings-container {
    gap: 15px;
  }

  .listing {
    width: 400px;
    height: 450px;
  }

  .listing-image-container {
    height: 220px;
  }

  .price {
    font-size: 28px;
  }

  .old-price {
    font-size: 20px;
  }

  .details {
    font-size: 20px;
  }

  .complex-name {
    font-size: 17px;
  }

  .address {
    font-size: 14px;
  }

  .view-all {
    margin-left: auto;
    margin-right: auto;
    display: block;
    margin-bottom: 80px;
  }
}

@media (max-width: 360px) {
  .wrapper {
    margin-right: 10px;
    margin-left: 10px;
  }

  .title-name {
    padding-top: 30px;
    margin-bottom: 20px;
  }

  .name {
    font-size: 18px;
    text-align: center;
  }

  .listings-container {
    flex-direction: column;
    gap: 10px;
  }

  .listing {
    width: 100%;
    height: auto;
    min-height: 400px;
  }

  .listing-image-container {
    height: 180px;
  }

  .listing-info {
    padding: 10px;
  }

  .good-price {
    width: 90px;
    font-size: 11px;
    padding: 4px 2px;
  }

  .heart-on-image {
    width: 20px;
    top: 10px;
    right: 10px;
  }

  .price {
    font-size: 20px;
  }

  .old-price {
    font-size: 16px;
  }

  .details {
    font-size: 16px;
  }

  .complex-name {
    font-size: 15px;
  }

  .address {
    font-size: 12px;
  }

  .view-all {
    width: 100%;
    margin: 20px 0;
    display: block;
  }
}
</style>