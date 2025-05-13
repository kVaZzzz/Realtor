<template>
  <section class="section-profile">
    <div class="user-profile">
      <div v-if="error" class="error-message">Авторизуйтель для начала</div>
      <div v-else class="accept-profile">
        <div class="user-info-block">
          <div class="user-info">
            <img src="../assets/avatar.png" alt="User avatar" class="user-avatar"/>
            <h2 class="user-name">{{ user.name || 'Неизвестный' }} {{ user.surname || 'Крол' }}</h2>
          </div>
          <nav class="user-links">
            <ul>
              <li>
                <a
                    href="#"
                    :class="{ active: activeMenu === 'listings' }"
                    @click.prevent="activeMenu = 'listings'"
                >
                  МОИ ОБЪЯВЛЕНИЯ
                </a>
              </li>
              <li>
                <a
                    href="#"
                    :class="{ active: activeMenu === 'favorites' }"
                    @click.prevent="activeMenu = 'favorites'"
                >
                  ИЗБРАННОЕ
                </a>
              </li>
              <li>
                <a
                    href="#"
                    :class="{ active: activeMenu === 'edit-profile' }"
                    @click.prevent="activeMenu = 'edit-profile'"
                >
                  РЕДАКТИРОВАНИЕ ПРОФИЛЯ
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div class="content-block">
          <component
              :is="currentComponent"
              @update-user="updateUserData"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {ref, shallowRef, watch, onMounted} from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import {thisUrl} from '../url.js'
import ActiveListings from './ActiveListings.vue'
import Favorites from './Favorities.vue'
import EditProfile from './EditProfile.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const activeMenu = ref('listings')
const currentComponent = shallowRef(ActiveListings)
const user = ref({
  name: '',
  surname: '',
  patronymic: '',
  phone: ''
})
const error = ref('')
const token = Cookies.get('authToken')

const axiosInstance = axios.create({
  baseURL: thisUrl(),
  headers: {
    Authorization: `Bearer ${token}`
  }
})

onMounted(async () => {
  try {
    const response = await axiosInstance.get('/user/profile')
    user.value = {
      name: response.data.user.name || '',
      surname: response.data.user.surname || '',
      patronymic: response.data.user.patronymic || '',
      phone: response.data.user.phone || ''
    }

    if (route.query.tab === 'edit-profile') {
      activeMenu.value = 'edit-profile'
    } else if (route.query.tab === 'favorites') {
      activeMenu.value = 'favorites'
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Не удалось загрузить данные пользователя'
  }
})

watch(activeMenu, (newMenu) => {
  if (newMenu === 'listings') {
    currentComponent.value = ActiveListings
  } else if (newMenu === 'favorites') {
    currentComponent.value = Favorites
  } else if (newMenu === 'edit-profile') {
    currentComponent.value = EditProfile
  }
})

const updateUserData = (updatedUser) => {
  user.value = {...user.value, ...updatedUser}
}
</script>

<style scoped>

.section-profile {
  background-color: #F2F0EE;
  width: 100%;
  padding: 100px 140px 100px 160px;
}

.accept-profile {
  display: flex;
  gap: 20px;
}

.user-profile {
  min-height: 50vh;
}

.user-info-block {
  width: 300px;
  background: #1a1a1a;
  color: white;
  padding: 20px;
  border-radius: 8px;
  min-height: 500px;
  max-height: 500px;
}

.user-info {
  text-align: center;
  margin-bottom: 30px;
}

.user-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-bottom: 10px;
  background: #333;
}

.user-name {
  font-size: 18px;
  margin: 0;
  font-family: 'Noto Sans', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
}

.user-links ul {
  list-style: none;
  padding: 0;
}

.user-links a {
  color: white;
  text-decoration: none;
  display: block;
  padding: 10px 0;
  font-size: 14px;
  font-family: 'Noto Sans', sans-serif;
  font-weight: 400;
  text-transform: uppercase;
}

.user-links a.active {
  color: #ff6b00;
}

.content-block {
  flex: 1;
  width: 100%;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-message {
  text-align: center;
  color: #ff4444;
  font-size: 16px;
}

/* Адаптив для 1366px */
@media (max-width: 1366px) {
  .section-profile {
    padding: 60px 40px;
  }

  .user-info-block {
    width: 250px;
    min-height: 400px;
    max-height: 400px;
  }

  .user-avatar {
    width: 80px;
    height: 80px;
  }

  .user-name {
    font-size: 16px;
  }

  .user-links a {
    font-size: 12px;
    padding: 8px 0;
  }

  .content-block {
    padding: 15px;
  }
}

/* Адаптив для 360px  */
@media (max-width: 360px) {
  .section-profile {
    padding: 20px 10px;
  }

  .accept-profile {
    flex-direction: column;
    gap: 15px;
  }

  .user-info-block {
    width: 100%;
    min-height: auto;
    max-height: none;
    padding: 15px;
  }

  .user-info {
    margin-bottom: 20px;
  }

  .user-avatar {
    width: 60px;
    height: 60px;
  }

  .user-name {
    font-size: 14px;
  }

  .user-links ul {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
  }

  .user-links a {
    font-size: 11px;
    padding: 5px;
  }

  .content-block {
    padding: 10px;
    width: 100%;
  }

  .error-message {
    font-size: 14px;
    padding: 10px;
  }
}
</style>