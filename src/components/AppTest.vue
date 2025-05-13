<template>
  <header>
    <div class="listings-container">
      <!-- Добавляем кнопку для запроса данных -->
      <button @click="fetchAds">Загрузить объявления</button>

      <!-- Добавляем цикл для отображения всех объявлений -->
      <div v-for="ad in ads" :key="ad.id" class="listing-info">
        <span class="price">{{ ad.price }} ₽ / мес</span>
        <p class="complex-name"><strong>Тип аренды: {{ ad.type_rent }}</strong></p>
        <p class="details">Тип недвижимости: {{ ad.type_realty }}</p>
        <p class="address">Адрес: {{ ad.address }}</p>
        <p>Комнат: {{ ad.count_rooms }}</p>
        <p>Общая площадь: {{ ad.total_square }} м²</p>
        <p>Этаж: {{ ad.floor }}</p>
        <img v-if="ad.image" :src="ad.image" alt="Фото" style="max-width: 200px;">
      </div>
    </div>
  </header>
</template>

<script setup>
import axios from "axios";
import { thisUrl } from "../url.js";
import { ref } from "vue";

// Используем одну реактивную переменную для хранения объявлений
const ads = ref([]);

const fetchAds = async () => {
  try {
    const response = await axios.get(`${thisUrl()}/index`);

    // Сохраняем полученные данные в реактивную переменную
    ads.value = response.data;

    console.log('Данные успешно получены:', ads.value);
  } catch (error) {
    console.error('Ошибка при выполнении запроса:', error);
  }
};
</script>
