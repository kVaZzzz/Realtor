<template>
  <div class="container">
    <div class="content-container">
      <h1 class="title">Разместить объявление</h1>

      <!-- Кнопка "Назад", отображается только на втором шаге -->
      <a href="#" class="back-link" v-if="step === 2" @click.prevent="prevStep">← Назад</a>

      <!-- Шаг 1: Информация о недвижимости -->
      <div v-if="step === 1">
        <div class="section">
          <label for="rent-type" class="label">Тип аренды</label>
          <select id="rent-type" class="select" v-model="form.type_rent_id" @blur="validateField('type_rent_id')">
            <option value="">Выберите тип аренды</option>
            <option v-for="option in rentTypeOptions" :key="option.id" :value="option.id">
              {{ option.title }}
            </option>
          </select>
          <div class="error-message" v-if="errors.type_rent_id">{{ errors.type_rent_id }}</div>

          <label for="property-type" class="label">Тип недвижимости</label>
          <select id="property-type" class="select" v-model="form.type_realty_id" @blur="validateField('type_realty_id')">
            <option value="">Выберите тип недвижимости</option>
            <option v-for="option in propertyTypeOptions" :key="option.id" :value="option.id">
              {{ option.title }}
            </option>
          </select>
          <div class="error-message" v-if="errors.type_realty_id">{{ errors.type_realty_id }}</div>
        </div>

        <!-- Параметры квартиры -->
        <div class="section">
          <h3 class="subtitle">Параметры квартиры</h3>
          <div class="form-group">
            <label for="rooms" class="label">Количество комнат</label>
            <select id="rooms" class="select" v-model="form.count_rooms" @blur="validateField('count_rooms')">
              <option value="">Выберите количество комнат</option>
              <option v-for="option in roomOptions" :key="option" :value="option">{{ option }}</option>
            </select>
            <div class="error-message" v-if="errors.count_rooms">{{ errors.count_rooms }}</div>
          </div>
          <div class="form-group">
            <label for="repair" class="label">Ремонт</label>
            <select id="repair" class="select" v-model="form.repair_id" @blur="validateField('repair_id')">
              <option value="">Выберите тип ремонта</option>
              <option v-for="option in repairTypeOptions" :key="option.id" :value="option.id">
                {{ option.title }}
              </option>
            </select>
            <div class="error-message" v-if="errors.repair_id">{{ errors.repair_id }}</div>
          </div>

          <!-- Площади и этаж -->
          <div class="form-group-row">
            <div class="form-group area">
              <label for="total-area" class="label">Общая площадь</label>
              <div class="input-wrapper">
                <input
                    id="total-area"
                    type="number"
                    class="input area"
                    placeholder="25"
                    v-model="form.total_square"
                    @blur="validateField('total_square')"
                    min="1"
                />
                <span class="unit">м²</span>
              </div>
              <div class="error-message" v-if="errors.total_square">{{ errors.total_square }}</div>
            </div>
            <div class="form-group area">
              <label for="living-area" class="label">Жилая площадь</label>
              <div class="input-wrapper">
                <input
                    id="living-area"
                    type="number"
                    class="input area"
                    placeholder="25"
                    v-model="form.living_square"
                    @blur="validateField('living_square')"
                    min="1"
                />
                <span class="unit">м²</span>
              </div>
              <div class="error-message" v-if="errors.living_square">{{ errors.living_square }}</div>
            </div>
            <div class="form-group area">
              <label for="kitchen-area" class="label">Площадь кухни</label>
              <div class="input-wrapper">
                <input
                    id="kitchen-area"
                    type="number"
                    class="input area"
                    placeholder="25"
                    v-model="form.kitchen_square"
                    @blur="validateField('kitchen_square')"
                    min="1"
                />
                <span class="unit">м²</span>
              </div>
              <div class="error-message" v-if="errors.kitchen_square">{{ errors.kitchen_square }}</div>
            </div>
          </div>

          <!-- Этаж и год постройки -->
          <div class="form-group-row">
            <div class="form-group small">
              <label for="floor" class="label">Этаж</label>
              <input
                  id="floor"
                  type="number"
                  class="input small"
                  placeholder="2"
                  v-model="form.floor"
                  @blur="validateField('floor')"
                  min="0"
              />
              <div class="error-message" v-if="errors.floor">{{ errors.floor }}</div>
            </div>
            <div class="form-group small">
              <label for="year-built" class="label">Год постройки дома</label>
              <input
                  id="year-built"
                  type="number"
                  class="input small"
                  placeholder="1943"
                  v-model="form.year_construction"
                  @blur="validateField('year_construction')"
                  min="1800"
                  :max="new Date().getFullYear()"
              />
              <div class="error-message" v-if="errors.year_construction">{{ errors.year_construction }}</div>
            </div>
          </div>
          <!-- Адрес и цена -->
          <div class="form-group">
            <label for="address" class="label">Адрес</label>
            <input
                id="address"
                type="text"
                class="input"
                placeholder="Адрес"
                v-model="form.address"
                @blur="validateField('address')"
            />
            <div class="error-message" v-if="errors.address">{{ errors.address }}</div>
          </div>
          <div class="form-group">
            <label for="price" class="label">Цена</label>
            <input
                id="price"
                type="number"
                class="input"
                placeholder="Цена"
                v-model="form.price"
                @blur="validateField('price')"
                min="1"
            />
            <div class="error-message" v-if="errors.price">{{ errors.price }}</div>
          </div>
        </div>
        <!-- Кнопки -->
        <div class="actions">
          <!-- Кнопка "Продолжить", переход на следующий шаг -->
          <button @click.prevent="validateStep1" class="button primary">Продолжить</button>
        </div>
      </div>

      <!-- Шаг 2: Фотографии, описание и условия аренды -->
      <div v-if="step === 2">
        <div class="section">
          <h3 class="subtitle">Как выглядит недвижимость</h3>
          <div class="photo-upload">
            <div class="photo-previews">
              <div class="photo-preview" v-for="(photo, index) in form.photos" :key="index">
                <img :src="photo" alt="Фото квартиры" />
                <div class="photo-actions">
                  <a href="#" @click.prevent="setMainPhoto(index)">↑ Поставить фото первым</a>
                  <a href="#" @click.prevent="rotatePhoto(index)">⟳ Повернуть</a>
                  <a href="#" @click.prevent="removePhoto(index)">🗑 Удалить</a>
                </div>
              </div>
              <div class="add-photo">
                <input type="file" @change="addPhoto" ref="photoInput" style="display: none" accept="image/*" />
                <button @click="openFileSelector">ДОБАВИТЬ</button>
              </div>
            </div>
            <div class="error-message" v-if="errors.photos">{{ errors.photos }}</div>
          </div>
        </div>

        <div class="section">
          <label for="description" class="label">Описание</label>
          <textarea
              id="description"
              class="textarea"
              placeholder="Расскажите, что есть в квартире и рядом с домом, опишите состояние жилья."
              v-model="form.description"
              @blur="validateField('description')"
          ></textarea>
          <div class="error-message" v-if="errors.description">{{ errors.description }}</div>
        </div>
        <div class="actions">
          <button @click.prevent="validateAndPublish" class="button primary">Опубликовать</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { thisUrl } from '../url.js';
import Cookies from 'js-cookie';
import router from "@/router/index.js";

const step = ref(1);
const photoInput = ref(null);

const form = reactive({
  type_rent_id: '',
  type_realty_id: '',
  address: '',
  price: '',
  count_rooms: '',
  total_square: '',
  living_square: '',
  kitchen_square: '',
  floor: '',
  repair_id: '',
  year_construction: '',
  description: '',
  photos: [],
});

const errors = reactive({
  type_rent_id: '',
  type_realty_id: '',
  address: '',
  price: '',
  count_rooms: '',
  total_square: '',
  living_square: '',
  kitchen_square: '',
  floor: '',
  repair_id: '',
  year_construction: '',
  description: '',
  photos: '',
});

const rentTypeOptions = ref([]);
const propertyTypeOptions = ref([]);
const repairTypeOptions = ref([]);
const roomOptions = ref(['студия', '1', '2', '3', '4', '5', '6+', 'свободная планировка']);

const validationRules = {
  type_rent_id: (value) => !value ? 'Выберите тип аренды' : '',
  type_realty_id: (value) => !value ? 'Выберите тип недвижимости' : '',
  count_rooms: (value) => !value ? 'Укажите количество комнат' : '',
  repair_id: (value) => !value ? 'Выберите тип ремонта' : '',
  total_square: (value) => {
    if (!value) return 'Укажите общую площадь';
    if (isNaN(value) || value <= 0) return 'Площадь должна быть положительным числом';
    return '';
  },
  living_square: (value) => {
    if (!value) return 'Укажите жилую площадь';
    if (isNaN(value) || value <= 0) return 'Площадь должна быть положительным числом';
    if (parseFloat(value) > parseFloat(form.total_square)) return 'Жилая площадь не может быть больше общей';
    return '';
  },
  kitchen_square: (value) => {
    if (!value) return 'Укажите площадь кухни';
    if (isNaN(value) || value <= 0) return 'Площадь должна быть положительным числом';
    if (parseFloat(value) > parseFloat(form.total_square)) return 'Площадь кухни не может быть больше общей';
    return '';
  },
  floor: (value) => {
    if (!value && value !== 0) return 'Укажите этаж';
    if (isNaN(value) || value < 0) return 'Этаж должен быть неотрицательным числом';
    return '';
  },
  year_construction: (value) => {
    if (!value) return 'Укажите год постройки';
    if (isNaN(value) || value < 1800 || value > new Date().getFullYear())
      return `Год должен быть между 1800 и ${new Date().getFullYear()}`;
    return '';
  },
  address: (value) => !value ? 'Укажите адрес' : '',
  price: (value) => {
    if (!value) return 'Укажите цену';
    if (isNaN(value) || value <= 0) return 'Цена должна быть положительным числом';
    return '';
  },
  description: (value) => {
    if (!value) return 'Напишите описание';
    if (value.length < 30) return 'Описание должно содержать минимум 30 символов';
    return '';
  },
  photos: (value) => value.length === 0 ? 'Добавьте хотя бы одно фото' : '',
};

const validateField = (fieldName) => {
  const value = form[fieldName];
  errors[fieldName] = validationRules[fieldName](value);
};

const validateStep1 = () => {
  const step1Fields = [
    'type_rent_id', 'type_realty_id', 'count_rooms', 'repair_id',
    'total_square', 'living_square', 'kitchen_square',
    'floor', 'year_construction', 'address', 'price'
  ];

  let isValid = true;

  step1Fields.forEach(field => {
    validateField(field);
    if (errors[field]) isValid = false;
  });

  if (isValid) {
    nextStep();
  }
};

const validateAndPublish = () => {
  validateField('description');
  validateField('photos');

  if (!errors.description && !errors.photos) {
    publishAd();
    router.push('/filters-search')
  }
};

const fetchData = async () => {
  try {
    const response = await axios.get(`${thisUrl()}/realty/filter`);
    setSelectOptions(response.data);
  } catch (error) {
    console.error('Fetching data error:', error);
  }
};

const setSelectOptions = (data) => {
  propertyTypeOptions.value = data.propertyTypes;
  rentTypeOptions.value = data.rentTypes;
  repairTypeOptions.value = data.renovationTypes;
};

const openFileSelector = () => {
  photoInput.value.click();
};

// Навигация по шагам
const nextStep = () => {
  step.value = 2;
};

const prevStep = () => {
  step.value = 1;
};

const addPhoto = (event) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          form.photos.push(e.target.result);
          validateField('photos');
        };
        reader.readAsDataURL(file);
      }
    }
  }
};

const setMainPhoto = (index) => {
  if (index > 0) {
    const photo = form.photos.splice(index, 1)[0];
    form.photos.unshift(photo);
  }
};

const rotatePhoto = (index) => {
  console.log('Rotate photo', index);
  // Здесь должна быть реализация поворота фото
};

const removePhoto = (index) => {
  form.photos.splice(index, 1);
  validateField('photos');
};


const publishAd = async () => {
  try {
    const formData = new FormData();

    // Добавляем текстовые поля
    Object.entries(form).forEach(([key, value]) => {
      if (key !== 'photos' && value !== null) {
        formData.append(key, value);
      }
    });

    if (form.photos && form.photos.length > 0) {
      form.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          formData.append('images[]', photo);
        } else if (typeof photo === 'string' && photo.startsWith('data:image')) {
          const byteString = atob(photo.split(',')[1]);
          const mimeString = photo.split(',')[0].split(':')[1].split(';')[0];
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: mimeString });
          const file = new File([blob], `image_${index}.${mimeString.split('/')[1]}`, { type: mimeString });
          formData.append('images[]', file);
        }
      });
    }

    const token = Cookies.get('authToken');
    const response = await axios.post(`${thisUrl()}/realty/store`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
    });

    console.log('Success:', response.data);

  } catch (error) {
    console.error('Error:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      alert(`Ошибка: ${error.response.data.message || 'Неизвестная ошибка сервера'}`);
    }
  }
};


onMounted(fetchData);
</script>

<style scoped>
.container {
  display: flex;
  background-color: rgba(242, 240, 238, 1);
}

.content-container {
  margin-top: 10%;
  margin-right: 160px;
  margin-left: 160px;
  margin-bottom: 17%;
  font-family: Arial, sans-serif;
  background-color: rgba(242, 240, 238, 1);
}

.title {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
}

.subtitle {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

#rent-type{
  margin-bottom: 2%;
}
.section {
  margin-bottom: 30px;
}

.label {
  display: block;
  font-size: 16px;
  margin-bottom: 10px;
}

.input,
.select,
.textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
}

.actions {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.button {
  padding: 15px 30px;
  border-radius: 5px;
  font-size: 18px;
  cursor: pointer;
  border: none;
}

.button.primary {
  background-color: #ff6b00;
  color: white;
}

.button.secondary {
  background-color: #f2f2f2;
  color: #333;
}

.form-group {
  margin-bottom: 2%;
}

.form-group-row {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
}

.form-group.small {
  flex: 1;
  width: 100%;
  max-width: 200px;
}

.input.small {
  width: 100%;
}

.form-group.area {
  flex: 1;
  position: relative;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input.area {
  width: 100%;
  padding-right: 35px;
  box-sizing: border-box;
}

.unit {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 16px;
  color: black;
}

.photo-upload {
  margin-bottom: 20px;
}

.photo-previews {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}

.photo-preview {
  width: 150px;
  border: 1px solid #ccc;
  border-radius: 5px;
  overflow: hidden;
  position: relative;
}

.photo-preview img {
  width: 100%;
  height: auto;
  display: block;
}

.photo-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  font-size: 12px;
}

.photo-actions a {
  color: white;
  text-decoration: none;
}

.add-photo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 150px;
  border: 1px dashed #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
  color: #888;
  cursor: pointer;
}

.textarea {
  height: 150px;
  resize: vertical;
}

.back-link {
  display: block;
  margin-bottom: 20px;
  color: #007bff;
  text-decoration: none;
}

.error-message {
  color: #ff0000;
  font-size: 14px;
  margin-top: 5px;
  margin-bottom: 2%;
}

.input.error,
.select.error,
.textarea.error {
  border-color: #ff0000;
}
</style>