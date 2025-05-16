<template>
  <div class="container">
    <div class="content-container">
      <section class="apartment-details">
        <div class="image-gallery-container">
          <div class="main-image-wrapper">
            <img
                :src="currentImage || defaultImage"
                alt="Apartment photo"
                class="main-image"
            />
          </div>

          <div class="thumbnails-scroll-container">
            <div class="thumbnails-wrapper">
              <div
                  v-for="(image, index) in apartment.images"
                  :key="index"
                  class="thumbnail-container"
                  @click="selectImage(image)"
              >
                <img
                    :src="image || defaultImage"
                    alt="Thumbnail"
                    class="thumbnail"
                    :class="{ 'active-thumbnail': currentImage === image }"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="details">
          <div class="detail">
            <div class="rating">
              <div>
                <span>{{ averageRating.toFixed(1) || 'Нет оценок' }}</span>
                <span v-for="i in 5" :key="i" :class="{ 'filled': i <= Math.round(averageRating) }">⭐</span>
              </div>
              <a href="#" class="leave-review-link" @click.prevent="openReviewModal">Оставить отзыв</a>
            </div>
            <div class="price">
              {{ formattedPrice }} ₽ / мес
            </div>
            <div class="views-counter">
              <span>👁️ {{ viewsCount }} просмотров</span>
            </div>
            <div class="details-grid">
              <div class="detail-item">
                <div class="data">{{ apartment.count_rooms }} комн.</div>
                <div class="detail-label">{{ apartment.type_realty?.title || 'Тип не указан' }}</div>
              </div>
              <div class="detail-item">
                <div class="data">{{ apartment.total_square }}</div>
                <div class="detail-label">общая пл</div>
              </div>
              <div class="detail-item">
                <div class="data">{{ apartment.floor }}{{ apartment.max_floor }}</div>
                <div class="detail-label">этаж</div>
              </div>
            </div>

            <div class="address-text">{{ apartment.address || 'Адрес не указан' }}</div>
            <button class="show-phone-button" @click="togglePhone">
              {{ showPhone ? apartment.owner.phone : 'ПОКАЗАТЬ НОМЕР ТЕЛЕФОНА' }}
            </button>
          </div>

          <div class="author">
            <span v-if="apartment.owner">{{ apartment.owner.name }} {{ apartment.owner.patronymic }}</span>
            <span v-else>Автор не указан</span>
          </div>
          <div class="export-buttons">
            <button class="generate-pdf-button" @click="generatePDF">
              Скачать PDF отчёт
            </button>
            <button class="generate-docx-button" @click="generateDOCX">
              Скачать DOCX отчёт
            </button>
            <button class="generate-excel-button" @click="generateExcel">
              Скачать Excel отчёт
            </button>
            <button class="generate-csv-button" @click="generateCSV">
              Скачать CSV отчёт
            </button>
          </div>
        </div>
      </section>

      <section class="description">
        <h2>Описание</h2>
        <p>{{ apartment.description || 'Описание отсутствует' }}</p>
      </section>

      <section class="general-info">
        <h2>Общая информация</h2>
        <ul>
          <li>Тип аренды: {{ apartment.type_rent?.title || 'Не указано' }}</li>
          <li>Тип недвижимости: {{ apartment.type_realty?.title || 'Не указано' }}</li>
          <li>Кол-во комнат: {{ apartment.count_rooms || 'Не указано' }}</li>
          <li>Общая площадь: {{ apartment.total_square || 'Не указано' }} м²</li>
          <li>Жилая площадь: {{ apartment.living_square || 'Не указано' }} м²</li>
          <li>Площадь кухни: {{ apartment.kitchen_square || 'Не указано' }} м²</li>
          <li>Ремонт: {{ apartment.type_repair?.title || 'Не указано' }}</li>
          <li>Этаж: {{ apartment.floor || 'Не указано' }}</li>
          <li>Год постройки дома: {{ apartment.year_construction || 'Не указано' }}</li>
        </ul>
      </section>

      <section class="reviews-section">
        <div class="reviews-header">
          <h2>Отзывы о квартире</h2>
          <div class="rating-summary">
            <div class="average-rating">
              <span>Средняя оценка:</span>
              <div class="stars">
                <span v-for="i in 5" :key="i" :class="{ 'filled': i <= Math.round(averageRating) }">★</span>
              </div>
              <span class="rating-value">{{ averageRating.toFixed(1) }}</span>
            </div>
          </div>
        </div>

        <div class="reviews-list">
          <div v-for="review in apartment.reviews" :key="review.id" class="review-item">
            <div class="review-header">
              <div class="review-author">
                <span>{{ review.user.name }}</span>
              </div>
              <div class="review-actions">
                <button
                    v-if="isReviewAuthor(review.user.id)"
                    @click="openDeleteModal(review.id)"
                    class="delete-review-btn"
                >
                  Удалить
                </button>
              </div>
            </div>
            <div class="review-rating">
              <span v-for="i in review.rating" :key="i" class="filled">★</span>
              <span v-for="i in (5 - review.rating)" :key="'empty-'+i" class="empty">★</span>
            </div>
            <p class="review-text">{{ review.comment }}</p>
          </div>

          <div v-if="apartment.reviews && apartment.reviews.length === 0" class="no-reviews">
            Пока нет отзывов. Будьте первым!
          </div>
        </div>
      </section>
    </div>

    <ReviewModal
        v-if="apartment.id"
        :isOpen="reviewModalOpen"
        :realtyId="apartment.id"
        @update:isOpen="reviewModalOpen = $event"
        @review-submitted="handleReviewSubmitted"
    />

    <!-- Модальное окно для удаления отзыва -->
    <div v-if="deleteModalOpen" class="modal-overlay">
      <div class="modal-content">
        <h3>Удаление отзыва</h3>
        <p>Вы уверены, что хотите удалить этот отзыв?</p>
        <div class="modal-actions">
          <button class="modal-cancel" @click="closeDeleteModal">Отмена</button>
          <button class="modal-confirm" @click="confirmDeleteReview">Удалить</button>
        </div>
      </div>
    </div>
    <section class="similar-ads" v-if="similarListings.length > 0">
      <h2>Похожие варианты ({{ currentAd.count_rooms }} комн. в этом же ценовом диапазоне)</h2>
      <div class="similar-listings">
        <div
            v-for="listing in similarListings"
            :key="listing.id"
            class="similar-listing"
            @click="goToAnnouncement(listing.id)"
        >
          <img :src="listing.images[0] || defaultImage" alt="Фото" class="similar-image">
          <div class="similar-info">
            <div class="similar-price" :class="{ 'lower-price': listing.price < currentAd.price }">
              {{ formatPrice(listing.price) }} ₽/мес
              <span v-if="listing.price < currentAd.price" class="price-diff">
                (дешевле на {{ calculatePriceDiff(listing.price) }}%)
              </span>
            </div>
            <div class="similar-details">
              <span>{{ listing.total_square }} м²</span>
              <span>{{ listing.floor }}/{{ listing.max_floor }} эт.</span>
            </div>
            <div class="similar-address">{{ listing.address }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { thisUrl } from '../url.js';
import Cookies from 'js-cookie';
import ReviewModal from '/src/components/AppReviews.vue';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Paragraph, TextRun, Packer, HeadingLevel } from 'docx';
import * as XLSX from 'xlsx';

const route = useRoute();
const router = useRouter();
const apartmentId = route.params.id;
const reviewModalOpen = ref(false);
const deleteModalOpen = ref(false);
const selectedReviewId = ref(null);
const defaultImage = ref('/images/default-apartment.jpg');
const currentUserId = ref(Cookies.get('userId'));
const viewsCount = ref(0);
const cookieName = `ad_${apartmentId}_viewed`;
const similarListings = ref([]);


const currentAd = ref({
  id: null,
  price: 0,
  count_rooms: '',
  images: []
});

const apartment = ref({
  id: null,
  images: [],
  price: 0,
  count_rooms: '',
  total_square: 0,
  living_square: 0,
  kitchen_square: 0,
  floor: 0,
  max_floor: 0,
  address: '',
  rating: null,
  contact_phone: '',
  description: '',
  year_construction: 0,
  type_rent: null,
  type_realty: null,
  type_repair: null,
  reviews: [],
  owner: {}
});

const currentImage = ref('');
const showPhone = ref(false);

const formattedPrice = computed(() => {
  return new Intl.NumberFormat('ru-RU').format(apartment.value.price);
});

const averageRating = computed(() => {
  if (!apartment.value.reviews || apartment.value.reviews.length === 0) {
    return 0;
  }
  const sum = apartment.value.reviews.reduce((acc, review) => acc + review.rating, 0);
  return sum / apartment.value.reviews.length;
});

const openReviewModal = () => {
  reviewModalOpen.value = true;
};

const handleReviewSubmitted = () => {
  fetchApartmentData();
};
const incrementViews = () => {
  if (!Cookies.get(cookieName)) {
    // Устанавливаем куку на 30 дней
    Cookies.set(cookieName, 'true', { expires: 30 });
    viewsCount.value += 1;

    // Можно сохранить в localStorage для надёжности
    localStorage.setItem(cookieName, 'true');
  }
};

const fetchApartmentData = async () => {
  try {
    const response = await axios.get(`${thisUrl()}/realty/show/${apartmentId}`, {
      params: {
        with_user: true
      }
    });

    if (response.data) {
      apartment.value = response.data;
      viewsCount.value = apartment.value.views || 0;
      incrementViews(); // Увеличиваем счётчик при загрузке

      if (Array.isArray(apartment.value.images) && apartment.value.images.length > 0) {
        currentImage.value = apartment.value.images[0];
      } else {
        currentImage.value = defaultImage.value;
      }

      if (!apartment.value.reviews) {
        const reviewsResponse = await axios.get(`${thisUrl()}/feedback/outputFeedback/${apartmentId}`);
        apartment.value.reviews = reviewsResponse.data.feedbacks || [];
      }

      apartment.value.rating = averageRating.value;
    } else {
      router.push('/not-found');
    }
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error);
    router.push('/not-found');
  }
};

const selectImage = (image) => {
  currentImage.value = image || defaultImage.value;
};

const isReviewAuthor = (reviewUserId) => {
  return currentUserId.value && parseInt(currentUserId.value) === reviewUserId;
};

const openDeleteModal = (reviewId) => {
  selectedReviewId.value = reviewId;
  deleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  deleteModalOpen.value = false;
  selectedReviewId.value = null;
};

const confirmDeleteReview = async () => {
  try {
    const token = Cookies.get('authToken');
    if (!token) {
      alert('Необходима авторизация');
      closeDeleteModal();
      return;
    }

    await axios.delete(`${thisUrl()}/feedback/delete/${selectedReviewId.value}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    await fetchApartmentData();
    closeDeleteModal();
  } catch (error) {
    console.error('Ошибка при удалении отзыва:', error);
    alert('Не удалось удалить отзыв');
  }
};

const togglePhone = () => {
  showPhone.value = !showPhone.value;
};
const generatePDF = async () => {
  try {
    // 1. Создаем контейнер для PDF
    const pdfContainer = document.createElement('div');
    pdfContainer.className = 'pdf-report';
    pdfContainer.style.width = '800px';
    pdfContainer.style.padding = '20px';
    pdfContainer.style.background = 'white';

    // 2. Добавляем заголовок
    const title = document.createElement('h1');
    title.textContent = `Отчёт по объявлению #${apartment.value.id}`;
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    pdfContainer.appendChild(title);

    // 3. Добавляем дату
    const date = document.createElement('div');
    date.textContent = `Дата создания: ${new Date().toLocaleDateString()}`;
    date.style.textAlign = 'right';
    date.style.marginBottom = '20px';
    pdfContainer.appendChild(date);

    // 4. Копируем основное содержимое
    const content = document.querySelector('.content-container').cloneNode(true);

    // 5. Удаляем ненужные элементы
    const elementsToRemove = [
      '.leave-review-link',
      '.show-phone-button',
      '.delete-review-btn',
      '.thumbnails-scroll-container',
      'button',
      'a'
    ];

    elementsToRemove.forEach(selector => {
      content.querySelectorAll(selector).forEach(el => el.remove());
    });

    // 6. Добавляем основной контент
    pdfContainer.appendChild(content);

    // 7. Временно добавляем в DOM
    document.body.appendChild(pdfContainer);

    // 8. Генерируем PDF
    const canvas = await html2canvas(pdfContainer, {
      scale: 2,
      useCORS: true
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = canvas.height * imgWidth / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`apartment_report_${apartment.value.id}.pdf`);

    // 9. Удаляем временный контейнер
    document.body.removeChild(pdfContainer);

  } catch (error) {
    console.error('Ошибка генерации PDF:', error);
    alert('Не удалось создать PDF отчёт');
  }
};
const generateDOCX = async () => {
  try {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({
              text: `Отчёт по объявлению #${apartment.value.id}`,
              heading: HeadingLevel.HEADING_1,
              alignment: "center",
              spacing: { after: 200 },
            }),
            new Paragraph({
              text: `Дата создания: ${new Date().toLocaleDateString()}`,
              alignment: "right",
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: "Основная информация",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 600, after: 200 },
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `Адрес: ${apartment.value.address || 'Не указан'}`,
                  bold: true,
                }),
              ],
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `Цена: ${formattedPrice.value} ₽ / мес`,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `Тип аренды: ${apartment.value.type_rent?.title || 'Не указано'}`,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `Тип недвижимости: ${apartment.value.type_realty?.title || 'Не указано'}`,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `Количество комнат: ${apartment.value.count_rooms || 'Не указано'}`,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `Общая площадь: ${apartment.value.total_square || 'Не указано'} м²`,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: `Этаж: ${apartment.value.floor || 'Не указано'} из ${apartment.value.max_floor || 'Не указано'}`,
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: "Описание",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 600, after: 200 },
            }),
            new Paragraph({
              text: apartment.value.description || 'Описание отсутствует',
              spacing: { after: 400 },
            }),
            new Paragraph({
              text: "Отзывы",
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 600, after: 200 },
            }),
            ...(apartment.value.reviews && apartment.value.reviews.length > 0
                    ? apartment.value.reviews.map(review =>
                        new Paragraph({
                          children: [
                            new TextRun({
                              text: `${review.user.name} (${review.rating}★): `,
                              bold: true,
                            }),
                            new TextRun({
                              text: review.comment,
                            }),
                          ],
                          spacing: { after: 200 },
                        })
                    )
                    : [new Paragraph({ text: "Пока нет отзывов", spacing: { after: 200 } })]
            ),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `apartment_report_${apartment.value.id}.docx`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Ошибка генерации DOCX:', error);
    alert('Не удалось создать DOCX отчёт');
  }
};

const generateCSV = () => {
  try {
    // Подготовка данных
    const data = [
      ["Параметр", "Значение"],
      ["ID объявления", apartment.value.id],
      ["Адрес", apartment.value.address || 'Не указан'],
      ["Цена", `${formattedPrice.value} ₽ / мес`],
      ["Тип аренды", apartment.value.type_rent?.title || 'Не указано'],
      ["Тип недвижимости", apartment.value.type_realty?.title || 'Не указано'],
      ["Количество комнат", apartment.value.count_rooms || 'Не указано'],
      ["Общая площадь", `${apartment.value.total_square || 'Не указано'} м²`],
      ["Жилая площадь", `${apartment.value.living_square || 'Не указано'} м²`],
      ["Площадь кухни", `${apartment.value.kitchen_square || 'Не указано'} м²`],
      ["Этаж", `${apartment.value.floor || 'Не указано'} из ${apartment.value.max_floor || 'Не указано'}`],
      ["Год постройки", apartment.value.year_construction || 'Не указано'],
      ["Ремонт", apartment.value.type_repair?.title || 'Не указано'],
      ["Просмотры", viewsCount.value],
      ["Средний рейтинг", averageRating.value.toFixed(1)],
      ["Количество отзывов", apartment.value.reviews?.length || 0],
      ["Контакты", showPhone.value ? apartment.value.owner.phone : 'Скрыто'],
      ["Описание", apartment.value.description || 'Отсутствует'],
    ];

    // Добавляем отзывы, если они есть
    if (apartment.value.reviews && apartment.value.reviews.length > 0) {
      data.push([]); // Пустая строка для разделения
      data.push(["Отзывы", "", "", ""]);
      data.push(["Автор", "Оценка", "Комментарий", "Дата"]);

      apartment.value.reviews.forEach(review => {
        data.push([
          review.user.name,
          review.rating,
          review.comment,
          new Date(review.created_at).toLocaleDateString()
        ]);
      });
    }

    // Конвертируем в CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    data.forEach(row => {
      csvContent += row.map(field => `"${field}"`).join(",") + "\r\n";
    });

    // Создаем ссылку для скачивания
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apartment_report_${apartment.value.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Ошибка генерации CSV:', error);
    alert('Не удалось создать CSV отчёт');
  }
};

const generateExcel = () => {
  try {
    // Подготовка данных для Excel
    const data = [
      ["Параметр", "Значение"],
      ["ID объявления", apartment.value.id],
      ["Адрес", apartment.value.address || 'Не указан'],
      ["Цена", `${formattedPrice.value} ₽ / мес`],
      ["Тип аренды", apartment.value.type_rent?.title || 'Не указано'],
      ["Тип недвижимости", apartment.value.type_realty?.title || 'Не указано'],
      ["Количество комнат", apartment.value.count_rooms || 'Не указано'],
      ["Общая площадь", `${apartment.value.total_square || 'Не указано'} м²`],
      ["Жилая площадь", `${apartment.value.living_square || 'Не указано'} м²`],
      ["Площадь кухни", `${apartment.value.kitchen_square || 'Не указано'} м²`],
      ["Этаж", `${apartment.value.floor || 'Не указано'} из ${apartment.value.max_floor || 'Не указано'}`],
      ["Год постройки", apartment.value.year_construction || 'Не указано'],
      ["Ремонт", apartment.value.type_repair?.title || 'Не указано'],
      ["Просмотры", viewsCount.value],
      ["Средний рейтинг", averageRating.value.toFixed(1)],
      ["Количество отзывов", apartment.value.reviews?.length || 0],
      ["Контакты", showPhone.value ? apartment.value.owner.phone : 'Скрыто'],
      ["Описание", apartment.value.description || 'Отсутствует'],
    ];

    // Создаем книгу Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(data);

    // Настраиваем ширину колонок
    worksheet['!cols'] = [
      { wch: 20 }, // Ширина первой колонки
      { wch: 40 }  // Ширина второй колонки
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Отчёт");

    // Добавляем лист с отзывами, если они есть
    if (apartment.value.reviews && apartment.value.reviews.length > 0) {
      const reviewsData = [
        ["Автор", "Оценка", "Комментарий", "Дата"]
      ];

      apartment.value.reviews.forEach(review => {
        reviewsData.push([
          review.user.name,
          review.rating,
          review.comment,
          new Date(review.created_at).toLocaleDateString()
        ]);
      });

      const reviewsSheet = XLSX.utils.aoa_to_sheet(reviewsData);
      XLSX.utils.book_append_sheet(workbook, reviewsSheet, "Отзывы");
    }

    // Генерируем и скачиваем файл
    XLSX.writeFile(workbook, `apartment_report_${apartment.value.id}.xlsx`);
  } catch (error) {
    console.error('Ошибка генерации Excel:', error);
    alert('Не удалось создать Excel отчёт');
  }
};
const fetchData = async () => {
  try {
    // Загружаем текущее объявление
    const adResponse = await axios.get(`${thisUrl()}/realty/show/${route.params.id}`);
    currentAd.value = adResponse.data;

    // Загружаем похожие объявления
    await fetchSimilarListings();
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);
  }
};

// Загрузка похожих объявлений
const fetchSimilarListings = async () => {
  try {
    const params = {
      count_rooms: currentAd.value.count_rooms, // То же количество комнат
      min_price: Math.floor(currentAd.value.price * 0.85),  // -15%
      max_price: Math.ceil(currentAd.value.price * 1.15),   // +15%
      exclude_id: currentAd.value.id,
      limit: 4,
      sort: 'price'
    };

    const response = await axios.get(`${thisUrl()}/realty/filter`, { params });
    similarListings.value = response.data.listings || [];

    // Если результатов мало, расширяем поиск
    if (similarListings.value.length < 2) {
      await loadAlternativeOptions();
    }
  } catch (error) {
    console.error('Ошибка загрузки похожих объявлений:', error);
  }
};

// Загрузка альтернативных вариантов
const loadAlternativeOptions = async () => {
  try {
    const roomsRange = getRoomsRange(currentAd.value.count_rooms);
    const response = await axios.get(`${thisUrl()}/realty/filter`, {
      params: {
        count_rooms: roomsRange,
        min_price: Math.floor(currentAd.value.price * 0.7),  // Расширяем диапазон
        max_price: Math.ceil(currentAd.value.price * 1.3),
        exclude_id: currentAd.value.id,
        limit: 4 - similarListings.value.length
      }
    });

    similarListings.value = [...similarListings.value, ...(response.data.listings || [])];
  } catch (error) {
    console.error('Ошибка загрузки альтернативных вариантов:', error);
  }
};

// Определение диапазона комнат
const getRoomsRange = (rooms) => {
  if (rooms === 'студия') return ['студия', '1'];
  if (rooms === '1') return ['студия', '1', '2'];
  if (rooms === '6+') return ['5', '6+'];
  const num = parseInt(rooms);
  return [`${num-1}`, `${num}`, `${num+1}`];
};

// Форматирование цены
const formatPrice = (price) => {
  return new Intl.NumberFormat('ru-RU').format(price);
};

// Расчет разницы в цене
const calculatePriceDiff = (price) => {
  return Math.round((currentAd.value.price - price) / currentAd.value.price * 100);
};

// Переход к объявлению
const goToAnnouncement = (id) => {
  router.push(`/announcement/${id}`);
};

onMounted(() => {
  fetchApartmentData();
  fetchData();
});
</script>

<style scoped>
main {
  background-color: rgba(242, 240, 238, 1);
}
.generate-csv-button {
  background-color: #28a745;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
  transition: background-color 0.3s;
}

.generate-csv-button:hover {
  background-color: #218838;
}
.similar-ads {
  margin-top: 40px;
  padding: 20px 0;
  border-top: 1px solid #eee;
  margin-left: 8%;
}

.similar-ads h2 {
  font-size: 22px;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
}

.similar-listings {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.similar-listing {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
}

.similar-listing:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.similar-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
  border-bottom: 1px solid #eee;
}

.similar-info {
  padding: 15px;
}

.similar-price {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 8px;
  color: #333;
}

.lower-price {
  color: #2e7d32;
}

.price-diff {
  font-size: 13px;
  color: #388e3c;
  margin-left: 5px;
  font-weight: normal;
}

.similar-details {
  display: flex;
  gap: 15px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
}

.similar-address {
  font-size: 14px;
  color: #555;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.views-counter {
  margin: 8px 0;
  color: #666;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.container {
  display: flex;
  background-color: rgba(242, 240, 238, 1);
  width: 100%;
  min-height: 100vh;
  flex-direction: column;
}

.content-container {
  margin-top: 6%;
  margin-right: 23px;
  margin-left: 160px;
}
.export-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.generate-docx-button {
  background-color: #2b579a;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.generate-docx-button:hover {
  background-color: #1e3f6f;
}

.generate-excel-button {
  background-color: #217346;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.generate-excel-button:hover {
  background-color: #1a5c3a;
}
.generate-pdf-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-top: 10px;
  transition: background-color 0.3s;
}

.generate-pdf-button:hover {
  background-color: #c0392b;
}

/* Стили для PDF */
.pdf-report {
  font-family: Arial, sans-serif;
  color: #333;
  line-height: 1.5;
}

.pdf-report h2 {
  color: #2c3e50;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
  margin-top: 20px;
}

.pdf-report .details-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin: 15px 0;
}

.pdf-report .main-image {
  max-width: 100%;
  height: auto;
  margin-bottom: 15px;
  border: 1px solid #ddd;
}
.apartment-details {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.image-gallery-container {
  flex: 1;
  min-width: 0;
  width: 790px;
}

.main-image-wrapper {
  position: relative;
  margin-bottom: 10px;
}

.main-image {
  width: 100%;
  border-radius: 8px;
  max-height: 450px;
  object-fit: cover;
}

.thumbnails-scroll-container {
  overflow-x: auto;
}

.thumbnails-wrapper {
  display: flex;
  gap: 10px;
  padding-bottom: 10px;
}

.thumbnail-container {
  cursor: pointer;
}

.thumbnail {
  width: 150px;
  height: 90px;
  object-fit: cover;
  border-radius: 4px;
  border: 2px solid transparent;
  transition: border-color 0.2s;
}

.active-thumbnail {
  border-color: #ff6600;
}

.details {
  flex: 1;
  width: 790px;
}

.detail {
  background-color: black;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 1%;
  color: white;
  height: auto;
  min-height: 449px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.3s ease;
}

.rating {
  margin-bottom: 3%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.rating div {
  display: flex;
  gap: 10px;
  align-items: center;
}

.leave-review-link {
  color: #ff6600;
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s ease;
}

.leave-review-link:hover {
  text-decoration: underline;
}

.price {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 15px;
}

.details-grid {
  display: flex;
  gap: 15px;
  margin: 20px 0;
  flex-wrap: wrap;
}

.detail-item {
  width: 120px;
  height: 62px;
  text-align: center;
  border: 1px solid rgba(67, 67, 67, 1);
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
}

.data {
  font-size: 21px;
}

.detail-label {
  font-size: 17px;
  color: #6c757d;
  margin-top: 5px;
}

.address-text {
  margin: 15px 0;
  font-size: 16px;
  flex-grow: 1;
}

.show-phone-button {
  width: 100%;
  max-width: 750px;
  height: 56px;
  padding: 10px;
  background-color: rgba(255, 120, 79, 1);
  color: black;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  font-size: 13px;
  transition: background-color 0.3s ease;
}

.show-phone-button:hover {
  background-color: #ff6600;
}

.author {
  display: flex;
  gap: 10px;
  padding: 2%;
  background-color: black;
  color: white;
  border-radius: 5px;
}

.author-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

section {
  margin-bottom: 30px;
}

h2 {
  font-size: 20px;
  margin-bottom: 15px;
  color: #343a40;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 8px;
}

.reviews-section {
  margin-top: 40px;
  background-color: white;
  border-radius: 8px;
  padding: 25px;
}

.reviews-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.reviews-header h2 {
  font-size: 24px;
  margin: 0;
}

.rating-summary {
  display: flex;
  align-items: center;
}

.average-rating {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stars {
  color: #ccc;
  font-size: 18px;
}

.stars .filled {
  color: #FF784F;
}

.rating-value {
  font-size: 18px;
  font-weight: bold;
}

.reviews-list {
  margin-top: 20px;
}

.review-item {
  padding: 20px;
  margin-bottom: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
}

.review-author {
  display: flex;
  align-items: center;
  gap: 10px;
}

.review-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.delete-review-btn {
  background: none;
  border: none;
  color: #ff4a2b;
  cursor: pointer;
  font-size: 14px;
  padding: 5px;
  transition: color 0.2s ease;
}

.delete-review-btn:hover {
  text-decoration: underline;
}

.review-rating {
  font-size: 16px;
  margin-bottom: 10px;
}

.review-rating .filled {
  color: #FF784F;
}

.review-rating .empty {
  color: #ccc;
}

.review-text {
  line-height: 1.5;
  margin: 0;
}

.no-reviews {
  text-align: center;
  padding: 20px;
  color: #666;
}

/* Стили для модального окна */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-content h3 {
  font-size: 20px;
  color: #343a40;
  margin-bottom: 15px;
}

.modal-content p {
  font-size: 16px;
  color: #666;
  margin-bottom: 20px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-cancel {
  background: none;
  border: 1px solid #6c757d;
  color: #6c757d;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
}

.modal-cancel:hover {
  background-color: #f8f9fa;
}

.modal-confirm {
  background-color: #ff4a2b;
  border: none;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.modal-confirm:hover {
  background-color: #e6391a;
}

/* Адаптивные стили */
@media (max-width: 1366px) {
  .apartment-details {
    margin-top: 50px;
  }

  .content-container {
    margin: 4% 20px 0 40px;
  }

  .image-gallery-container,
  .details {
    max-width: 600px;
  }

  .main-image {
    max-height: 400px;
  }

  .thumbnail {
    width: 120px;
    height: 70px;
  }

  .detail {
    min-height: 400px;
    padding: 15px;
  }

  .price {
    font-size: 22px;
  }

  .details-grid {
    gap: 10px;
  }

  .detail-item {
    width: 100px;
  }

  .data {
    font-size: 18px;
  }

  .detail-label {
    font-size: 15px;
  }
}

@media (max-width: 768px) {
  .content-container {
    margin: 3% 15px 0 20px;
  }

  .apartment-details {
    flex-direction: column;
    gap: 15px;
  }

  .image-gallery-container,
  .details {
    max-width: 100%;
  }

  .main-image {
    max-height: 350px;
  }

  .thumbnail {
    width: 100px;
    height: 60px;
  }

  .detail {
    min-height: unset;
    padding: 15px;
  }

  .details-grid {
    justify-content: space-between;
  }

  .detail-item {
    width: 30%;
    min-width: 90px;
  }

  .address-text {
    margin-bottom: 15px;
  }

  .show-phone-button {
    height: 48px;
  }

  .reviews-section {
    padding: 15px;
  }

  .reviews-header h2 {
    font-size: 20px;
  }

  .review-item {
    padding: 15px;
  }

  .modal-content {
    max-width: 90%;
  }
}

@media (max-width: 360px) {
  .content-container {
    margin: 2% 10px 0 10px;
  }

  .main-image {
    max-height: 250px;
  }

  .thumbnail {
    width: 80px;
    height: 50px;
  }

  .detail {
    padding: 10px;
  }

  .price {
    font-size: 20px;
  }

  .details-grid {
    flex-direction: column;
    gap: 8px;
  }

  .detail-item {
    width: 100%;
    height: auto;
    padding: 10px 0;
  }

  .data {
    font-size: 16px;
  }

  .detail-label {
    font-size: 14px;
  }

  .address-text {
    font-size: 14px;
    margin: 10px 0;
  }

  .show-phone-button {
    height: 40px;
    font-size: 12px;
  }

  .author-avatar {
    width: 32px;
    height: 32px;
  }

  h2 {
    font-size: 18px;
  }

  .reviews-header h2 {
    font-size: 18px;
  }

  .stars {
    font-size: 16px;
  }

  .rating-value {
    font-size: 16px;
  }

  .review-item {
    padding: 10px;
  }

  .review-text {
    font-size: 14px;
  }

  .modal-content {
    max-width: 85%;
    padding: 15px;
  }

  .modal-content h3 {
    font-size: 18px;
  }

  .modal-content p {
    font-size: 14px;
  }

  .modal-cancel,
  .modal-confirm {
    padding: 6px 12px;
    font-size: 12px;
  }
}
</style>