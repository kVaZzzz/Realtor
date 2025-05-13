<template>
  <main>
    <section class="head_main">
      <div class="decription">
        <div class="decription1">
          <div>Найдите жилье</div>
          <div>для новой поездки в Томске</div>
        </div>
        <div>
          <img src="./icons/TOMSKZONE.svg">
        </div>
        <div class="decription2">
          <div>Ищите спецпредложения </div>
          <div>на квартиры, дома и другие варианты</div>
        </div>
      </div>
    </section>
    <div class="main">
      <p>ОСОБЕННОСТИ СЕРВИСА</p>
      <p class="text">Создаём безопасный, прозрачный <br>
        и удобный процесс аренды квартир <br>
        в Томске для обеих сторон</p>
      <div class="advantages">
        <div class="advantage1">
          <div>
            <div>Аренда для собственника</div>
            <div><img src="./icons/01.svg"></div>
          </div>
          <div>
            <p>Сдадим квартиру<br> безопасно</p>
            <p>Найдем жильца, гарантируем платежи, <br> починим сломанную мебель и технику</p>
          </div>
        </div>

        <div class="advantage2">
          <div>
            <div>Аренда для собственника</div>
            <div><img src="./icons/02.svg"></div>
          </div>
          <div>
            <p>Профессиональная<br> поддержка</p>
            <p>Наша служба поддержки всегда готова <br> помочь вам с любыми вопросами,<br>
              связанными с арендой квартир в <br> Томске</p>
          </div>
        </div>

        <div class="advantage3">
          <div>
            <div>Гарантия платежей</div>
            <div><img src="./icons/03.svg"></div>
          </div>
          <div>
            <p>Прямое взаимодействие <br> с арендодателем</p>
            <p>Оплата за аренду осуществляется <br> непосредственно арендодателю.
              Мы не <br> участвуем в финансовых транзакциях</p>
          </div>
        </div>
      </div>

      <div class="title-name">
        <h2 class="name">ТОП КВАРТИР НА СЕГОДНЯ</h2>
      </div>
      <div class="listings-container">
        <div
            v-for="(listing, index) in listings.slice(0,3)"
            :key="listing.id"
            class="listing"
            @click="goToAnnouncement(listing.id)"
        >
          <div class="listing-image-container">
            <img
                :src="listing.images[0]"
                alt="Квартира"
                class="listing-image"
                @error="handleImageError"
            />
            <span
                v-if="listing.old_price"
                class="good-price"
            >Хорошая цена</span>
            <img
                class="heart-on-image"
                @click.stop="toggleFavorite(listing.id, index)"
                :src="listing.is_favorite ? fullShape : shape"
                alt="Добавить в избранное"
            />
          </div>
          <div class="listing-info">
            <span class="price">{{ formatPrice(listing.price) }} ₽ / мес</span><br>
            <span class="old-price" v-if="listing.old_price">{{ formatPrice(listing.old_price) }} ₽</span>
            <p class="details">{{ formatRooms(listing.count_rooms) }} {{ listing.total_square }} м² {{ listing.floor }}/{{ listing.total_floors }} эт.</p>
            <p class="address">{{ listing.address }}</p>
          </div>
        </div>
        <button class="view-all" @click="$router.push('/filters-search')">СМОТРЕТЬ ВСЕ</button>
      </div>

    </div>
  </main>

  <AppInteresting
      :listings="listings"
      :image-url="imageUrl"
      :shape="shape"
      :full-shape="fullShape"
      @toggle-favorite="toggleFavorite"
  />

  <AppLastViews
      :listings="listings"
      :image-url="imageUrl"
      :shape="shape"
      :full-shape="fullShape"
      @toggle-favorite="toggleFavorite"
  />
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
import AppInteresting from "@/components/AppInteresting.vue"
import AppLastViews from "@/components/AppLastViews.vue"

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
    // Перемешиваем полученные объявления
    listings.value = shuffleArray(response.data.listings || []);
  } catch (err) {
    error.value = 'Не удалось загрузить топовые предложения';
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

onMounted(() => {
  fetchTopListings();
});
</script>

<style scoped>
body {
  margin: 0;
}

main {
  background-color: rgba(242, 238, 235, 1);
  width: 100%;
}

.head_main {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 760px;
  background-image: url("./icons/Banner_main (1).svg");
  background-size: cover;
  background-position: center;
  justify-content: space-between;
  width: 100%;
}

.decription {
  margin: 0 160px;
  margin-top: 15%;
  width: 100%;
  max-width: 1600px;
  box-sizing: border-box;
}

.decription1 {
  color: white;
  font-size: 24px;
}

.decription2 {
  display: flex;
  flex-direction: column;
  color: white;
  flex-wrap: wrap;
  align-content: center;
  font-size: 24px;
  margin-left: 123px;
}

.decription img {
  max-width: 100%;
  height: auto;
}

.main {
  margin-right: 160px;
  margin-left: 160px;
  margin-top: 128px;
}

.main:nth-child(1) {
  margin-top: 129px;
  font-size: 24px;
}

.text {
  display: flex;
  justify-content: end;
  font-size: 53px;
  font-weight: bold;
}

.advantages {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 128px;
}

.advantages > div {
  height: 389px;
  width: 520px;
}

.advantage1 {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: white;
}

.advantage1 div:first-child {
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
  font-size: 13px;
  margin-top: -12px;
}

.advantage1 > div:nth-child(2) > p:nth-child(1) {
  text-transform: uppercase;
  font-size: 21px;
}

.advantage1 > div:nth-child(2) > p:nth-child(2) {
  font-size: 16px;
}

.advantage1 > div:nth-child(2) {
  margin-left: 20px;
}

.advantage2 {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: white;
}

.advantage2 div:first-child {
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
  font-size: 13px;
  margin-top: -13px;
}

.advantage2 > div:nth-child(2) > p:nth-child(1) {
  text-transform: uppercase;
  font-size: 21px;
}

.advantage2 > div:nth-child(2) > p:nth-child(2) {
  font-size: 16px;
}

.advantage2 > div:nth-child(2) {
  margin-left: 20px;
  margin-bottom: -30px;
}

.advantage3 {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: black;
}

.advantage3 div:first-child {
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-right: 20px;
  font-size: 13px;
  margin-top: -13px;
  color: white;
}

.advantage3 > div:nth-child(2) > p:nth-child(1) {
  text-transform: uppercase;
  font-size: 21px;
  color: white;
}

.advantage3 > div:nth-child(2) > p:nth-child(2) {
  font-size: 16px;
  color: white;
}

.advantage3 > div:nth-child(2) {
  margin-left: 20px;
  margin-bottom: -12px;
}

.title-name {
  margin-bottom: 20px;
}

.name {
  color: rgba(17, 17, 17, 1);
  font-weight: 500;
  font-size: 21px;
  text-align: left;
}

.listings-container {
  border-radius: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
}


.name {
  color: rgba(17, 17, 17, 1);
  margin-bottom: 20px;
  font-weight: 500;
  font-size: 21px;
  text-align: left;
}

.listing {
  display: flex;
  background: rgba(253, 253, 253, 1);
  border-radius: 5px;
  margin-bottom: 30px;
  overflow: hidden;
  height: 370px;
  width: 100%;
  flex-shrink: 0;
  transition: transform 0.3s ease;
  cursor: pointer;
}
.listing:hover {
  transform: translateY(-5px);
}

.listing-image-container {
  position: relative;
  width: 50%;
  height: 100%;
}

.listing-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.listing-info {
  display: flex;
  flex-direction: column;
  padding: 15px;
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
  color: rgb(255, 110, 66);
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
  margin-bottom: 10%;
}
.address {
  font-weight: 400;
  font-size: 16px;
}



.view-all {
  width: 220px;
  height: 40px;
  border-radius: 5px;
  padding: 10px 16px;
  border: 1px solid rgb(255, 110, 66);
  font-weight: 600;
  font-size: 13px;
  color: rgba(17, 17, 17, 1);
  cursor: pointer;
  transition: all 500ms ease;
  margin: 0 auto;
  margin-bottom: 4%;
}

.view-all:hover {
  background-color: rgba(255, 110, 66, 1);
}

.app-section {
  margin-top: 128px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: #ffffff;
  border-radius: 5px;
  height: 277px;
  padding-left: 16px;
  margin-bottom: 28px;
}

.app-text {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.app-text-desc {
  margin-top: 20px;
}

.app-text-desc-selection {
  font-weight: 600;
  font-size: 40px;
  color: rgba(17, 17, 17, 1);
}

.app-text p {
  font-weight: 400;
  font-size: 16px;
  color: rgba(17, 17, 17, 1);
}

.app-stores {
  display: flex;
  gap: 16px;
  margin-bottom: 17px;
}

.store-icon {
  width: 140px;
  height: 40px;
  transition: transform 0.3s ease;
}

.store-icon:hover {
  transform: scale(1.1);
}

.qr-code {
  background-color: #ff6e42;
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.qr-code img {
  width: 179px;
  height: 179px;
}

/* Адаптив для 1366px */
@media (max-width: 1366px) {
  .head_main {
    height: 600px;
  }

  .decription {
    margin: 0 40px;
    margin-top: 10%;
    max-width: 1286px; /* 1366px - 40px с каждой стороны */
  }

  .decription1,
  .decription2 {
    font-size: 20px;
  }

  .decription2 {
    margin-left: 80px;
  }

  .main {
    margin: 80px 40px;
    max-width: 1286px;
  }

  .text {
    font-size: 40px;
  }

  .advantages > div {
    width: 400px;
    height: 340px;
  }

  .advantage1 > div:nth-child(2) > p:nth-child(1),
  .advantage2 > div:nth-child(2) > p:nth-child(1),
  .advantage3 > div:nth-child(2) > p:nth-child(1) {
    font-size: 18px;
  }

  .advantage1 > div:nth-child(2) > p:nth-child(2),
  .advantage2 > div:nth-child(2) > p:nth-child(2),
  .advantage3 > div:nth-child(2) > p:nth-child(2) {
    font-size: 14px;
  }

  .listing {
    height: 300px;
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

  .app-section {
    height: 220px;
    margin-top: 80px;
  }

  .app-text-desc-selection {
    font-size: 32px;
  }

  .store-icon {
    width: 120px;
  }

  .qr-code img {
    width: 140px;
    height: 140px;
  }
}

/* Адаптив для 360px */
@media (max-width: 360px) {
  .head_main {
    height: 400px;
  }

  .decription {
    margin: 0 10px;
    margin-top: 20px;
    max-width: 340px; /* 360px - 10px с каждой стороны */
  }

  .decription1,
  .decription2 {
    font-size: 16px;
  }

  .decription2 {
    margin-left: 0; /* Убираем смещение, чтобы не выходило за пределы */
  }

  .main {
    margin: 40px 10px;
    max-width: 340px;
  }

  .text {
    font-size: 24px;
  }

  .advantages {
    margin-bottom: 40px;
  }

  .advantages > div {
    width: 100%;
    height: auto;
    margin-bottom: 20px;
    padding: 15px 0;
  }

  .advantage1 > div:nth-child(2),
  .advantage2 > div:nth-child(2),
  .advantage3 > div:nth-child(2) {
    margin-left: 10px;
  }

  .listing {
    height: auto;
    margin-bottom: 20px;
  }

  .listing-image-container {
    height: 200px;
  }

  .listing-info {
    padding: 10px;
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
  }

  .app-section {
    height: auto;
    margin-top: 40px;
    padding-left: 10px;
    margin-bottom: 20px;
  }

  .app-text-desc-selection {
    font-size: 20px;
  }

  .app-text p {
    font-size: 14px;
  }

  .app-stores {
    gap: 10px;
    margin-bottom: 20px;
  }

  .store-icon {
    width: 100px;
  }

  .qr-code img {
    width: 120px;
    height: 120px;
  }
}
</style>