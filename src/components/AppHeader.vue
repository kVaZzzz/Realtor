<template>
  <header>
    <div class="title">
      <router-link to="/">
        <img src="./icons/Logo.svg">
      </router-link>
      <div class="city">
        <img src="./icons/shape.svg"> Томск
      </div>
    </div>
    <div class="links">
      <router-link class="router-link" to="/filters-search">Найти квартиру</router-link>
    </div>
    <div class="authreg">
      <div v-if="!isAuthenticated" class="auth-buttons">
        <button @click="openModalAuthentication">ВОЙТИ</button>
        <button @click="openModalRegistration">ЗАРЕГИСТРИРОВАТЬСЯ</button>
      </div>
      <div v-else class="user-menu">
        <router-link class="create-ad" to="/create_announ">Создать объявление</router-link>
        <div class="avatar-container">
          <img src="@/assets/avatar.png" alt="Аватар" class="avatar" :style="{ border: isMenuOpen ? '2px solid #FF4A2B' : 'none' }" @click.stop="toggleMenu">
          <Transition name="dropdown">
            <div v-if="isMenuOpen" class="dropdown-menu" ref="dropdownMenu">
              <div class="menu-items">
                <router-link class="menu-item" to="/profile">Мои объявления</router-link>
                <a href="#" class="menu-item" @click.prevent="goToFavorites">Избранное</a>
                <a href="#" class="menu-item" @click.prevent="goToEditProfile">Редактировать профиль</a>
              </div>
              <button class="logout-button" @click="logout">Выйти</button>
            </div>
          </Transition>
        </div>
      </div>
    </div>
    <Registration
        v-model:isOpen="isModalOpenReg"
        @go-to-login="switchToAuthModal"
        @auth-success="handleAuthSuccess"
    />
    <Authentication
        v-model:isOpen="isModalOpenAuth"
        @go-to-register="switchToRegModal"
        @auth-success="handleAuthSuccess"
    />

  </header>
</template>

<script setup>
import {ref, onMounted, onBeforeUnmount, nextTick} from 'vue';
import Registration from './AppRegistration.vue';
import Authentication from './AppAuthentication.vue';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';
import { thisUrl } from '../url.js';

const isModalOpenReg = ref(false);
const isModalOpenAuth = ref(false);
const isAuthenticated = ref(false);
const isMenuOpen = ref(false);
const dropdownMenu = ref(null);
const router = useRouter();

onMounted(() => {
  const token = Cookies.get('authToken');
  if (token) {
    isAuthenticated.value = true;
  }
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const openModalRegistration = () => {
  isModalOpenReg.value = true;
};

const openModalAuthentication = () => {
  isModalOpenAuth.value = true;
};

const switchToAuthModal = () => {
  isModalOpenReg.value = false;
  isModalOpenAuth.value = true;
};

const switchToRegModal = () => {
  isModalOpenAuth.value = false;
  isModalOpenReg.value = true;
};

const handleAuthSuccess = (email) => {
  isAuthenticated.value = true;
};

const toggleMenu = async () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    await nextTick();
  }
};

const goToEditProfile = () => {
  isMenuOpen.value = false
  router.push({ path: '/profile', query: { tab: 'edit-profile' } })
}

const goToFavorites = () => {
  isMenuOpen.value = false
  router.push({ path: '/profile', query: { tab: 'favorites' } })
}

const handleClickOutside = (event) => {
  if (isMenuOpen.value && dropdownMenu.value && !dropdownMenu.value.contains(event.target)) {
    isMenuOpen.value = false;
  }
};

const logout = async () => {
  const token = Cookies.get('authToken');
  if (!token) {
    console.error('Токен не найден');
    return;
  }
  await axios.post(
      `${thisUrl()}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
  );
  Cookies.remove('authToken');
  isAuthenticated.value = false;
  isMenuOpen.value = false;
  await router.push('/');
};
</script>

<style scoped>
header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  background-color: white;
  width: 1600px;
  height: 52px;
  padding-inline-start: 32px;
  padding-inline-end: 32px;
  margin-top: 12px;
  margin-right: 160px;
  margin-left: 160px;
}
.title{
  display: flex;
  width: 18%;
  flex-direction: row;
  justify-content: space-between;
}

.title div:first-child {
  cursor: pointer;
}

.city {
  color: black;
}

.links {
  display: flex;
  justify-content: space-between;
  color: black;
  font-size: 16px;
  gap: 22px;
}
.router-link{
  text-decoration: none;
  color: black;
  cursor: pointer;
}

.authreg {
  display: flex;
  width: 18%;
  flex-direction: row;
  justify-content: space-between;
}

.auth-buttons > button {
  border-radius: 5px;
  width: 80px;
  height: 36px;
  cursor: pointer;
}
.auth-buttons{
  display: flex;
  gap: 10px;
}

.auth-buttons button:nth-child(2) {
  background-color: #FF4A2B;
  width: 195px;
  height: 36px;
  cursor: pointer;
  border: none;
}
.user-menu {
  display: flex;
  align-items: center;
  gap: 20px
}

.create-ad {
  display: flex;
  justify-content: center;
  border: 1px solid #FF4A2B;
  background: none;
  color: #000;
  padding: 10px;
  width: 200px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-right: 10px;
  transition: all 500ms ease;
  text-decoration: none;
}

.create-ad:hover {
  background-color: rgba(255, 110, 66, 1);
}

.avatar-container {
  position: relative;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  top: 50px;
  right: -39px;
  background-color: white;
  border-radius: 5px;
  width: 315px;
  padding: 15px;
  z-index: 1;
}

.menu-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 15px;
}

.menu-item {
  color: #484848;
  text-decoration: none;
  font-size: 16px;
  padding: 5px 0;
  font-weight: 400;
  font-family: Noto Sans;

}

.menu-item:hover {
  color: #FF4A2B;
}

.logout-button {
  background: none;
  border: none;
  color: #FF4A2B;
  font-size: 14px;
  cursor: pointer;
  padding: 5px 0;
  text-align: left;
}

.logout-button:hover {
  text-decoration: underline;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-enter-to,
.dropdown-leave-from {
  opacity: 1;
  transform: translateY(0);
}

@media (max-width: 1366px) {
  header {
    width: 95%;
    margin-right: 25px;
    margin-left: 40px;
    justify-content: space-around;
    padding: 0;
  }

  .title {
    width: 20%;
  }

  .links {
    font-size: 14px;
    gap: 15px;
  }

  .authreg {
    width: 25%;
  }

  .auth-buttons > button {
    width: 70px;
    height: 32px;
    font-size: 12px;
  }

  .auth-buttons button:nth-child(2) {
    width: 160px;
  }

  .create-ad {
    width: 160px;
    padding: 6px;
    font-size: 14px;
  }

  .avatar {
    width: 36px;
    height: 36px;
  }

  .dropdown-menu {
    width: 280px;
    right: -20px;
  }

  .menu-item {
    font-size: 14px;
  }
}

@media (max-width: 360px) {
  header {
    flex-direction: column;
    height: auto;
    padding: 10px;
    margin: 10px;
    align-items: flex-start;
    gap: 10px;
  }

  .title {
    width: 100%;
    justify-content: space-between;
    align-items: center;
  }

  .city {
    font-size: 14px;
  }

  .links {
    width: 100%;
    justify-content: flex-start;
    font-size: 12px;
    gap: 10px;
  }

  .authreg {
    width: 100%;
    justify-content: flex-start;
  }

  .auth-buttons {
    width: 100%;
    justify-content: space-between;
    gap: 5px;
  }

  .auth-buttons > button {
    width: 48%;
    height: 30px;
    font-size: 10px;
  }

  .auth-buttons button:nth-child(2) {
    width: 48%;
  }

  .user-menu {
    width: 100%;
    justify-content: space-between;
    gap: 10px;
  }

  .create-ad {
    width: 60%;
    padding: 6px;
    font-size: 12px;
    margin-right: 0;
  }

  .avatar {
    width: 32px;
    height: 32px;
  }

  .dropdown-menu {
    width: 100%;
    right: 0;
    top: 40px;
    padding: 10px;
  }

  .menu-items {
    gap: 8px;
  }

  .menu-item {
    font-size: 12px;
  }

  .logout-button {
    font-size: 12px;
  }
}
</style>