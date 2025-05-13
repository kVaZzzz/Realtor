<template>
  <div class="container">
    <div class="content-container">
      <div class="title">Долгосрочная <br>и посуточная аренда</div>
      <div class="adv">
        <span class="label"> {{ totalItems }} ОБЪЯВЛЕНИЯ</span>
      </div>
      <div class="search-and-sort">
        <input
            type="text"
            v-model="searchQuery"
            placeholder="Q Адрес, район, улица"
            class="address-search-input"
            @input="handleSearch"
        />
        <button @click="toggleSortOrder">
          Сортировка:
          <span v-if="sortOrder === 'random'">Случайный порядок</span>
          <span v-else-if="sortOrder === 'asc'">По возрастанию цены</span>
          <span v-else-if="sortOrder === 'desc'">По убыванию цены</span>
        </button>
      </div>
      <div class="main-content">
        <!-- Фильтры -->
        <div class="filters">
          <div class="filter-container">
            <div class="filter-header">
              <h3 class="filter-title">Фильтр</h3>
              <button class="clear-btn" @click="resetFilters">Сбросить</button>
            </div>

            <div class="filter-group">
              <label>Тип аренды</label>
              <div class="rent-type-buttons">
                <button
                    v-for="type in rentTypes"
                    :key="type.id"
                    :class="{ active: filters.type_rent_id == type.id }"
                    @click="setRentType(type.id)"
                >{{ type.name }}</button>
              </div>
            </div>

            <div class="filter-group">
              <label>Тип недвижимости</label>
              <div class="property-types">
                <button
                    v-for="type in propertyTypes"
                    :key="type.id"
                    :class="{ active: filters.type_realty_id == type.id }"
                    @click="selectPropertyType(type.id)"
                    class="property-type-item"
                >{{ type.title }}</button>
              </div>
            </div>

            <div class="filter-group">
              <label>Цена</label>
              <div class="price-range">
                <div class="slider-container">
                  <div class="slider">
                    <div class="slider-track" :style="sliderTrackStyle"></div>
                    <input
                        type="range"
                        :min="priceRange.min"
                        :max="priceRange.max"
                        v-model.number="filters.price_min"
                        @input="updateRange"
                        class="slider-input min"
                    />
                    <input
                        type="range"
                        :min="priceRange.min"
                        :max="priceRange.max"
                        v-model.number="filters.price_max"
                        @input="updateRange"
                        class="slider-input max"
                    />
                  </div>
                </div>
                <div class="price-inputs">
                  <input
                      class="input"
                      type="number"
                      v-model.number="filters.price_min"
                      placeholder="От"
                      @change="applyFilters"
                  />
                  <input
                      class="input"
                      type="number"
                      v-model.number="filters.price_max"
                      placeholder="До"
                      @change="applyFilters"
                  />
                </div>
              </div>
            </div>

            <div class="filter-group">
              <label>Кол-во комнат</label>
              <div class="rooms-selection">
                <button
                    v-for="room in availableRooms"
                    :key="room.id"
                    :class="{ active: filters.count_rooms.includes(room.id) }"
                    @click="toggleRoom(room.id)"
                    class="room-item"
                >{{ room.name }}</button>
              </div>
            </div>

            <div class="filter-group">
              <label>Общая площадь</label>
              <div class="area-inputs">
                <div class="area-input-container">
                  <input
                      class="input"
                      type="number"
                      v-model.number="filters.total_square_min"
                      placeholder="От"
                      @change="applyFilters"
                  />
                  <span class="area-unit">м²</span>
                </div>
                <div class="area-input-container">
                  <input
                      class="input"
                      type="number"
                      v-model.number="filters.total_square_max"
                      placeholder="До"
                      @change="applyFilters"
                  />
                  <span class="area-unit">м²</span>
                </div>
              </div>
            </div>

            <div class="filter-group">
              <label>Жилая площадь</label>
              <div class="area-inputs">
                <div class="area-input-container">
                  <input
                      class="input"
                      type="number"
                      v-model.number="filters.living_square_min"
                      placeholder="От"
                      @change="applyFilters"
                  />
                  <span class="area-unit">м²</span>
                </div>
                <div class="area-input-container">
                  <input
                      class="input"
                      type="number"
                      v-model.number="filters.living_square_max"
                      placeholder="До"
                      @change="applyFilters"
                  />
                  <span class="area-unit">м²</span>
                </div>
              </div>
            </div>

            <div class="filter-group">
              <label>Этаж</label>
              <div class="floor-inputs">
                <input
                    class="input"
                    type="number"
                    v-model.number="filters.floor_min"
                    placeholder="От"
                    @change="applyFilters"
                />
                <input
                    class="input"
                    type="number"
                    v-model.number="filters.floor_max"
                    placeholder="До"
                    @change="applyFilters"
                />
              </div>
            </div>

            <div class="filter-group">
              <label>Ремонт</label>
              <div class="renovation-types">
                <button
                    v-for="type in renovationTypes"
                    :key="type.id"
                    :class="{ active: filters.repair_id == type.id }"
                    @click="selectRenovationType(type.id)"
                    class="renovation-type-item"
                >{{ type.title }}</button>
              </div>
            </div>

            <button class="apply-filters-btn" @click="applyFilters">
              Применить
            </button>
          </div>
          <div class="pagination" v-if="totalPages > 1">
            <!-- Кнопка "Назад" -->
            <button
                :disabled="currentPage === 1"
                @click="changePage(currentPage - 1)"
                class="pagination-button"
            >
              <img
                  src="./icons/Arrow-left.svg"
                  alt="Назад"
                  class="arrow-icon"
                  :class="{ disabled: currentPage === 1 }"
              />
            </button>

            <!-- Номера страниц -->
            <div class="page-numbers">
              <button
                  v-for="page in visiblePages"
                  :key="page"
                  :class="{ active: page === currentPage }"
                  @click="changePage(page)"
                  class="page-number"
              >
                {{ page }}
              </button>
              <span class="dots" v-if="showEllipsisAfter">...</span>
              <button
                  v-if="showLastPage"
                  @click="changePage(totalPages)"
                  class="page-number"
              >
                {{ totalPages }}
              </button>
            </div>

            <!-- Кнопка "Вперед" -->
            <button
                :disabled="currentPage === totalPages"
                @click="changePage(currentPage + 1)"
                class="pagination-button"
            >
              <img
                  src="./icons/Arrow-right.svg"
                  alt="Вперед"
                  class="arrow-icon"
                  :class="{ disabled: currentPage === totalPages }"
              />
            </button>
          </div>
        </div>

        <!-- Объявления -->
        <div class="listings-container">
          <template v-if="listings.length > 0">
            <div
                v-for="(listing, index) in listings"
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
                <span class="price">{{ formatPrice(listing.price) }} / мес</span>
                <div class="listing-details">
                  <div class="detail-row">
                    <span class="detail-value">{{ formatRooms(listing.count_rooms) }}</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-value">{{ listing.total_square }} м²</span>
                  </div>
                  <div class="detail-row">
                    <span class="detail-value">{{ listing.floor }}</span>
                    <span class="detail-label">этаж</span>
                  </div>
                </div>

                <p class="address">{{ listing.address }}</p>
                <p class="complex-name" v-if="listing.complex">
                  <strong>{{ listing.complex }}</strong>
                </p>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="no-listings">
              <p>Нет объявлений, соответствующих вашим критериям.</p>
            </div>
          </template>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';
import { thisUrl } from "../url.js";
import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';
import shape from "@/assets/shape.png";
import fullShape from "@/assets/full_shape.png";

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
const searchQuery = ref('');
const sortOrder = ref('asc');
const currentPage = ref(1);
const itemsPerPage = ref(9);
const loading = ref(false);
const error = ref(null);
const totalItems = ref(0);

const goToAnnouncement = (id) => {
  router.push(`/announ/${id}`);
};

const rentTypes = ref([
  { id: 1, name: 'Долгосрочная' },
  { id: 2, name: 'Посуточная' }
]);

const propertyTypes = ref([]);
const renovationTypes = ref([]);

const priceRange = ref({
  min: 0,
  max: 1000000,
});

const availableRooms = ref([
  { id: 'студия', name: 'студия' },
  { id: '1', name: '1' },
  { id: '2', name: '2' },
  { id: '3', name: '3' },
  { id: '4', name: '4' },
  { id: '5', name: '5' },
  { id: '6+', name: '6+' },
  { id: 'свободная планировка', name: 'свободная планировка' }
]);

const filters = ref({
  type_rent_id: null,
  type_realty_id: null,
  price_min: 0,
  price_max: priceRange.value.max,
  count_rooms: [],
  total_square_min: null,
  total_square_max: null,
  living_square_min: null,
  living_square_max: null,
  floor_min: null,
  floor_max: null,
  repair_id: null,
});

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value);
});

const sliderTrackStyle = computed(() => {
  const minPercentage = ((filters.value.price_min - priceRange.value.min) / (priceRange.value.max - priceRange.value.min)) * 100;
  const maxPercentage = ((filters.value.price_max - priceRange.value.min) / (priceRange.value.max - priceRange.value.min)) * 100;
  return {
    left: `${minPercentage}%`,
    width: `${maxPercentage - minPercentage}%`,
  };
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5; // Максимальное количество видимых номеров страниц
  let start = 1;
  let end = totalPages.value;

  if (totalPages.value > maxVisible) {
    start = Math.max(1, currentPage.value - 2);
    end = Math.min(totalPages.value, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = end - maxVisible + 1;
    }
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return pages;
});

const showEllipsisAfter = computed(() => {
  return visiblePages.value[visiblePages.value.length - 1] < totalPages.value - 1;
});

const showLastPage = computed(() => {
  return visiblePages.value[visiblePages.value.length - 1] < totalPages.value;
});

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const params = {
      page: currentPage.value,
      per_page: itemsPerPage.value,
      ...filters.value,
      search: searchQuery.value,
      sort: sortOrder.value === 'random' ? 'asc' : sortOrder.value, // Отправляем стандартную сортировку
    };

    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === undefined || params[key] === '') {
        delete params[key];
      }
    });

    if (params.count_rooms && params.count_rooms.length === 0) {
      delete params.count_rooms;
    }

    const response = await axios.get(`${thisUrl()}/realty/filter`, { params });

    // Применяем рандомизацию только если выбран соответствующий порядок
    listings.value = sortOrder.value === 'random'
        ? shuffleArray(response.data.listings || [])
        : response.data.listings || [];

    propertyTypes.value = response.data.propertyTypes || [];
    renovationTypes.value = response.data.renovationTypes || [];
    totalItems.value = response.data.total || 0;

    if (response.data.priceRange) {
      priceRange.value = {
        min: Math.floor(response.data.priceRange.min),
        max: Math.ceil(response.data.priceRange.max),
      };
      filters.value.price_min = priceRange.value.min;
      filters.value.price_max = priceRange.value.max;
    }
  } catch (err) {
    error.value = 'Не удалось загрузить данные.';
  } finally {
    loading.value = false;
  }
};

const applyFilters = () => {
  currentPage.value = 1;
  fetchData();
};

const handleSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    fetchData();
  }, 500);
};
const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};
let searchTimeout = null;

const resetFilters = () => {
  filters.value = {
    type_rent_id: null,
    type_realty_id: null,
    price_min: 0,
    price_max: priceRange.value.max,
    count_rooms: [],
    total_square_min: null,
    total_square_max: null,
    living_square_min: null,
    living_square_max: null,
    floor_min: null,
    floor_max: null,
    repair_id: null,
  };
  searchQuery.value = '';
  applyFilters();
};

const setRentType = (typeId) => {
  filters.value.type_rent_id = filters.value.type_rent_id === typeId ? null : typeId;
  applyFilters();
};

const selectPropertyType = (typeId) => {
  filters.value.type_realty_id = filters.value.type_realty_id === typeId ? null : typeId;
  applyFilters();
};

const toggleRoom = (roomId) => {
  if (filters.value.count_rooms.includes(roomId)) {
    filters.value.count_rooms = filters.value.count_rooms.filter(id => id !== roomId);
  } else {
    filters.value.count_rooms.push(roomId);
  }
  applyFilters();
};

const selectRenovationType = (typeId) => {
  filters.value.repair_id = filters.value.repair_id === typeId ? null : typeId;
  applyFilters();
};

const updateRange = () => {
  if (filters.value.price_min > filters.value.price_max) {
    filters.value.price_min = filters.value.price_max;
  }
  if (filters.value.price_max < filters.value.price_min) {
    filters.value.price_max = filters.value.price_min;
  }
};

const toggleSortOrder = () => {
  // Циклическое переключение между вариантами сортировки
  const sortOptions = ['asc', 'desc', 'random'];
  const currentIndex = sortOptions.indexOf(sortOrder.value);
  sortOrder.value = sortOptions[(currentIndex + 1) % sortOptions.length];
  fetchData();
};

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    fetchData();
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

watch(currentPage, fetchData);

onMounted(() => {
  fetchData();
});
</script>

<style scoped>
.dots {
  color: white;
  font-size: 18px;
  margin-top: 7%;
  margin-right: 3%;
}

.title {
  font-size: 40px;
  color: white;
  margin-bottom: 2%;
}

.adv {
  margin-bottom: 2%;
}

.label {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
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

.heart-on-image:hover {
  opacity: 0.8;
}

.heart-on-image:active {
  opacity: 0.2;
}

.container {
  display: flex;
  background-color: black;
}
.floor-inputs{
  display: flex;
  gap: 5px;
}
.content-container {
  margin-top: 6%;
  margin-right: 160px;
  margin-left: 160px;
}

.search-and-sort {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.address-search-input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  width: 300px;
  margin-right: 10px;
}
.sort-icon {
  width: 24px;
  height: auto;
  cursor: pointer;
}

.main-content {
  display: flex;
  flex-grow: 1;
}

.filters {
  display: flex;
  margin-right: 20px;
  flex-shrink: 0;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 4%;
}

.filter-container {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 427px;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filter-title {
  font-size: 22px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.clear-btn {
  background: none;
  border: none;
  color: #777;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.3s ease;
}

.clear-btn:hover {
  color: rgba(255, 120, 79, 1);
}

.filter-group {
  margin-bottom: 20px;
}

.filter-group label {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #444;
  margin-bottom: 0.5rem;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  box-sizing: border-box;
  margin-bottom: 5px;
}

button {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: #fff;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  box-sizing: border-box;
}
.pagination-button{
  width: 21%;
  height: 90%;
  padding: 0px 0px;
}
.page-numbers{
  display: flex;
}
.page-number{
  width: 21px;
  height: 31px;
  border-radius: 2px;
  font-size: 13px;
  padding: 1px;
  margin-right: 8px;
}
button.active {
  background-color: rgba(255, 120, 79, 1);
  color: #fff;
  border-color: rgba(255, 120, 79, 1);
}
.pagination{
  display: flex;
  justify-content: space-between;;
}
.rent-type-buttons,
.property-types,
.rooms-selection,
.renovation-types {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.price-range {
  margin-top: 15px;
}

.slider-container {
  position: relative;
  width: 100%;
}

.slider {
  position: relative;
  width: 100%;
  height: 6px;
  background: #eee;
  border-radius: 3px;
}

.slider-track {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(255, 120, 79, 1);
  border-radius: 3px;
}

.slider-input {
  position: absolute;
  top: -8px;
  width: 100%;
  height: 22px;
  margin: 0;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 120, 79, 1);
  border: none;
  cursor: pointer;
  pointer-events: auto;
}

.price-inputs {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
}

.price-inputs input {
  width: 45%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.area-inputs {
  display: flex;
  gap: 5px;
  align-items: center;
}

.area-inputs .area-input-container {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 5px;
  overflow: hidden;
}

.area-inputs .area-input-container input {
  border: none;
  border-radius: 0;
  padding: 8px;
  font-size: 14px;
}

.area-inputs .area-input-container span.area-unit {
  padding: 8px;
  border-left: 1px solid #ddd;
  font-size: 14px;
}

.apply-filters-btn {
  width: 100%;
  padding: 12px;
  background-color: rgba(255, 120, 79, 1);
  color: #fff;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.apply-filters-btn:hover {
  background-color: rgba(255, 120, 79, 0.8);
}

.listings-container {
  border-radius: 5px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 20px;
  flex-grow: 1;
}

.listing {
  display: flex;
  flex-direction: column;
  background: rgb(253, 253, 253);
  border-radius: 5px;
  overflow: hidden;
  height: 540px;
  width: 360px;
  box-sizing: border-box;
  flex-grow: 0;
  flex-shrink: 0;
  transition: transform 0.3s ease;
}
.listing:hover {
  transform: translateY(-5px);
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
  font-family: Noto Sans, sans-serif;
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
}

.heart-on-image:hover {
  opacity: 0.8;
}

.heart-on-image.active {
  opacity: 0.2;
}

.price {
  font-family: Noto Sans, sans-serif;
  font-weight: 500;
  font-size: 32px;
}

.old-price {
  font-family: Noto Sans, sans-serif;
  font-weight: 200;
  font-size: 24px;
  text-decoration: line-through;
}


.address {
  font-family: Noto Sans, sans-serif;
  font-weight: 400;
  font-size: 16px;
}

.complex-name {
  font-family: Noto Sans, sans-serif;
  font-weight: 600;
  font-size: 19px;
}

.no-listings {
  color: #fff;
  padding: 20px;
  text-align: center;
}

.slider-container {
  position: relative;
  width: 100%;
}

.slider {
  position: relative;
  width: 100%;
  height: 6px;
  background: #eee;
  border-radius: 3px;
}

.slider-track {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: rgba(255, 120, 79, 1);
  border-radius: 3px;
}

.slider-input {
  position: absolute;
  top: -8px;
  width: 100%;
  height: 22px;
  margin: 0;
  background: none;
  pointer-events: none;
  -webkit-appearance: none;
}

.slider-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 120, 79, 1);
  border: none;
  cursor: pointer;
  pointer-events: auto;
}
.listing-details{
  display: flex;
  gap: 25px;
  font-size: 24px;
}
.listing {
  cursor: pointer;
}
@media (max-width: 1366px) {
  .filter-container {
    background-color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 360px;
    padding: 20px;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
  }

  .listing {
    display: flex;
    flex-direction: column;
    background: rgb(253, 253, 253);
    border-radius: 5px;
    overflow: hidden;
    height: 500px;
    width: 323px;
    box-sizing: border-box;
    flex-grow: 0;
    flex-shrink: 0;
    transition: transform 0.3s ease;
  }
}
</style>