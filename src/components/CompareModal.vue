<template>
  <div class="compare-modal-overlay" @click.self="close">
    <div class="compare-modal">
      <button class="close-btn" @click="close">×</button>
      <h2>Сравнение объявлений</h2>

      <div v-if="loading" class="loading">Загрузка данных для сравнения...</div>

      <div v-else class="compare-content">
        <div class="compare-table-container">
          <table>
            <thead>
            <tr>
              <th>Параметр</th>
              <th v-for="ad in ads" :key="ad.id" class="compare-column">
                <div class="compare-header">
                  <img :src="ad.images[0] || '/images/default-apartment.jpg'"
                       alt="Фото"
                       class="compare-thumbnail"
                       @error="handleImageError">
                  <div class="compare-header-info">
                    <div class="compare-price" :class="{ 'best-value': ad.price === bestValues.minPrice }">
                      {{ formatPrice(ad.price) }} ₽/мес
                    </div>
                    <div class="compare-address">{{ ad.address }}</div>
                  </div>
                </div>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td>Тип недвижимости</td>
              <td v-for="ad in ads" :key="ad.id">
                {{ ad.type_realty?.title || '—' }}
              </td>
            </tr>
            <tr>
              <td>Количество комнат</td>
              <td v-for="ad in ads" :key="ad.id" :class="{ 'best-value': ad.count_rooms === bestValues.mostRooms }">
                {{ formatRooms(ad.count_rooms) }}
              </td>
            </tr>
            <tr>
              <td>Общая площадь</td>
              <td v-for="ad in ads" :key="ad.id" :class="{ 'best-value': ad.total_square === bestValues.maxTotalArea }">
                {{ ad.total_square }} м²
              </td>
            </tr>
            <tr>
              <td>Жилая площадь</td>
              <td v-for="ad in ads" :key="ad.id" :class="{ 'best-value': ad.living_square === bestValues.maxLivingArea }">
                {{ ad.living_square || '—' }} м²
              </td>
            </tr>
            <tr>
              <td>Площадь кухни</td>
              <td v-for="ad in ads" :key="ad.id" :class="{ 'best-value': ad.kitchen_square === bestValues.maxKitchenArea }">
                {{ ad.kitchen_square || '—' }} м²
              </td>
            </tr>
            <tr>
              <td>Этаж</td>
              <td v-for="ad in ads" :key="ad.id">
                {{ ad.floor }}/{{ ad.max_floor }}
              </td>
            </tr>
            <tr>
              <td>Тип ремонта</td>
              <td v-for="ad in ads" :key="ad.id">
                {{ ad.type_repair?.title || '—' }}
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { thisUrl } from '../url.js';

const props = defineProps({
  adIds: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['close']);

const ads = ref([]);
const loading = ref(true);

const bestValues = computed(() => {
  if (ads.value.length === 0) return {};

  return {
    minPrice: Math.min(...ads.value.map(ad => ad.price)),
    mostRooms: Math.max(...ads.value.map(ad => parseRoomsCount(ad.count_rooms))),
    maxTotalArea: Math.max(...ads.value.map(ad => ad.total_square || 0)),
    maxLivingArea: Math.max(...ads.value.map(ad => ad.living_square || 0)),
    maxKitchenArea: Math.max(...ads.value.map(ad => ad.kitchen_square || 0))
  };
});

const parseRoomsCount = (count) => {
  if (count === 'студия') return 0;
  if (count === '6+') return 6;
  if (count === 'свободная планировка') return 0;
  return parseInt(count) || 0;
};

const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price);
};

const formatRooms = (count) => {
  if (count === 'студия') return 'Студия';
  if (count === '6+') return '6+ комн.';
  if (count === 'свободная планировка') return 'Своб. план.';
  return `${count} комн.`;
};

const handleImageError = (e) => {
  e.target.src = '/images/default-apartment.jpg';
};

const close = () => {
  emit('close');
};

onMounted(async () => {
  try {
    const responses = await Promise.all(
        props.adIds.map(id =>
            axios.get(`${thisUrl()}/realty/show/${id}`)
        )
    );
    ads.value = responses.map(r => r.data);
  } catch (error) {
    console.error('Ошибка загрузки данных для сравнения:', error);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.compare-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.compare-modal {
  background: white;
  border-radius: 8px;
  padding: 24px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
  color: #777;
}

.compare-content {
  margin-top: 20px;
}

.compare-table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

th, td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  vertical-align: top;
}

th {
  background: #f5f5f5;
  position: sticky;
  top: 0;
}

.compare-column {
  min-width: 200px;
}

.compare-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.compare-thumbnail {
  width: 120px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
}

.compare-header-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.compare-price {
  font-weight: bold;
  font-size: 16px;
  color: #333;
}

.compare-address {
  font-size: 14px;
  color: #666;
  text-align: center;
}

.loading {
  padding: 40px;
  text-align: center;
  color: #666;
}

.best-value {
  background-color: #e8f5e9;
  position: relative;
  font-weight: bold;
}

.best-value::after {
  content: '✓ Лучшее';
  position: absolute;
  top: -8px;
  right: -8px;
  background: #4caf50;
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 10px;
  font-weight: normal;
}
</style>