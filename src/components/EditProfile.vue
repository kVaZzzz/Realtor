<template>
  <div class="edit-profile">
    <h2>Редактирование профиля</h2>
    <div class="tabs">
      <button
          :class="{ active: activeTab === 'profile' }"
          @click="switchTab('profile')"
      >
        Редактировать данные
      </button>
      <button
          :class="{ active: activeTab === 'password' }"
          @click="switchTab('password')"
      >
        Сменить пароль
      </button>
    </div>

    <div v-if="activeTab === 'profile'">
      <div v-if="profileError" class="error-message">{{ profileError }}</div>
      <div v-if="profileSuccess" class="success-message">Данные успешно обновлены!</div>
      <form @submit.prevent="saveProfile">
        <div class="form-group">
          <label for="name">Имя</label>
          <input
              type="text"
              id="name"
              v-model="profileForm.name"
              placeholder="Введите имя"
              class="modal-input"
              :class="{ 'input-error': profileErrors.name }"
              @input="validateName"
          />
          <span v-if="profileErrors.name" class="error-message">{{ profileErrors.name }}</span>
        </div>
        <div class="form-group">
          <label for="surname">Фамилия</label>
          <input
              type="text"
              id="surname"
              v-model="profileForm.surname"
              placeholder="Введите фамилию"
              class="modal-input"
              :class="{ 'input-error': profileErrors.surname }"
              @input="validateSurname"
          />
          <span v-if="profileErrors.surname" class="error-message">{{ profileErrors.surname }}</span>
        </div>
        <div class="form-group">
          <label for="patronymic">Отчество</label>
          <input
              type="text"
              id="patronymic"
              v-model="profileForm.patronymic"
              placeholder="Введите отчество"
              class="modal-input"
              :class="{ 'input-error': profileErrors.patronymic }"
              @input="validatePatronymic"
          />
          <span v-if="profileErrors.patronymic" class="error-message">{{ profileErrors.patronymic }}</span>
        </div>
        <div class="form-group">
          <label for="phone">Телефон</label>
          <input
              type="text"
              id="phone"
              v-model="profileForm.phone"
              placeholder="+79991234567"
              class="modal-input"
              :class="{ 'input-error': profileErrors.phone }"
              @input="formatPhone"
              @keydown="protectPrefix($event)"
          />
          <span v-if="profileErrors.phone" class="error-message">{{ profileErrors.phone }}</span>
        </div>
        <button type="submit" class="modal-button">Сохранить данные</button>
      </form>
    </div>

    <div v-if="activeTab === 'password'">
      <div v-if="passwordError" class="error-message">{{ passwordError }}</div>
      <div v-if="passwordSuccess" class="success-message">Пароль успешно изменен!</div>
      <form @submit.prevent="changePassword">
        <div class="form-group">
          <label for="current_password">Текущий пароль</label>
          <input
              type="password"
              id="current_password"
              v-model="passwordForm.current_password"
              placeholder="Введите текущий пароль"
              class="modal-input"
              :class="{ 'input-error': passwordErrors.current_password }"
              @input="passwordErrors.current_password = ''"
          />
          <span v-if="passwordErrors.current_password" class="error-message">{{ passwordErrors.current_password }}</span>
        </div>
        <div class="form-group">
          <label for="password1">Новый пароль</label>
          <input
              type="password"
              id="password1"
              v-model="passwordForm.password1"
              placeholder="Введите новый пароль"
              class="modal-input"
              :class="{ 'input-error': passwordErrors.password1 }"
              @input="validatePassword"
          />
          <span v-if="passwordErrors.password1" class="error-message">{{ passwordErrors.password1 }}</span>
        </div>
        <div class="form-group">
          <label for="password2">Подтверждение нового пароля</label>
          <input
              type="password"
              id="password2"
              v-model="passwordForm.password1_confirmation"
              placeholder="Подтвердите новый пароль"
              class="modal-input"
              :class="{ 'input-error': passwordErrors.password2 }"
              @input="validatePasswordConfirmation"
          />
          <span v-if="passwordErrors.password2" class="error-message">{{ passwordErrors.password2 }}</span>
        </div>
        <button type="submit" class="modal-button">Сменить пароль</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Cookies from 'js-cookie'
import { thisUrl } from '../url.js'

const emit = defineEmits(['update-user'])
const activeTab = ref('profile')

// Состояния для профиля
const profileForm = ref({
  name: '',
  surname: '',
  patronymic: '',
  phone: ''
})
const profileError = ref('')
const profileSuccess = ref(false)
const profileErrors = ref({
  name: '',
  surname: '',
  patronymic: '',
  phone: ''
})

// Состояния для пароля
const passwordForm = ref({
  current_password: '',
  password1: '',
  password1_confirmation: ''
})
const passwordError = ref('')
const passwordSuccess = ref(false)
const passwordErrors = ref({
  current_password: '',
  password1: '',
  password2: ''
})

const token = Cookies.get('authToken')
const axiosInstance = axios.create({
  baseURL: thisUrl(),
  headers: {
    Authorization: `Bearer ${token}`
  }
})

// Переключение вкладок с очисткой сообщений
const switchTab = (tab) => {
  activeTab.value = tab
  profileError.value = ''
  profileSuccess.value = false
  passwordError.value = ''
  passwordSuccess.value = false
}

// Валидации для профиля
const validateName = () => {
  if (!profileForm.value.name) {
    profileErrors.value.name = 'Имя обязательно'
    return false
  } else if (!/^[А-Яа-яЁё\s-]+$/u.test(profileForm.value.name)) {
    profileErrors.value.name = 'Только кириллица, пробелы и тире'
    return false
  }
  profileErrors.value.name = ''
  return true
}

const validateSurname = () => {
  if (!profileForm.value.surname) {
    profileErrors.value.surname = 'Фамилия обязательна'
    return false
  } else if (!/^[А-Яа-яЁё\s-]+$/u.test(profileForm.value.surname)) {
    profileErrors.value.surname = 'Только кириллица, пробелы и тире'
    return false
  }
  profileErrors.value.surname = ''
  return true
}

const validatePatronymic = () => {
  if (!profileForm.value.patronymic) {
    profileErrors.value.patronymic = 'Отчество обязательно'
    return false
  } else if (!/^[А-Яа-яЁё\s-]+$/u.test(profileForm.value.patronymic)) {
    profileErrors.value.patronymic = 'Только кириллица, пробелы и тире'
    return false
  }
  profileErrors.value.patronymic = ''
  return true
}

const validatePhone = () => {
  if (!profileForm.value.phone) {
    profileErrors.value.phone = 'Телефон обязателен'
    return false
  } else if (!/^\+7\d{10}$/.test(profileForm.value.phone)) {
    profileErrors.value.phone = 'Формат: +7XXXXXXXXXX'
    return false
  }
  profileErrors.value.phone = ''
  return true
}

const protectPrefix = (event) => {
  const value = profileForm.value.phone
  const selectionStart = event.target.selectionStart

  if (selectionStart <= 2 && event.key === 'Backspace') {
    event.preventDefault()
  }

  if (selectionStart < 1 && event.key === 'v' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
  }
}

const formatPhone = () => {
  let digits = profileForm.value.phone.replace(/[^\d+]/g, '')

  if (!digits.startsWith('+7')) {
    digits = '+7' + digits.replace(/^\+?7?/, '')
  }

  digits = digits.substring(0, 12)

  profileForm.value.phone = digits
  validatePhone()
}

const validatePassword = () => {
  if (!passwordForm.value.password1) {
    passwordErrors.value.password1 = 'Новый пароль обязателен'
    return false
  } else if (passwordForm.value.password1.length < 8) {
    passwordErrors.value.password1 = 'Пароль должен быть не менее 8 символов'
    return false
  } else if (passwordForm.value.current_password &&
      passwordForm.value.password1 === passwordForm.value.current_password) {
    passwordErrors.value.password1 = 'Новый пароль должен отличаться от текущего'
    return false
  }
  passwordErrors.value.password1 = ''
  validatePasswordConfirmation()
  return true
}

const validatePasswordConfirmation = () => {
  if (passwordForm.value.password1 !== passwordForm.value.password1_confirmation) {
    passwordErrors.value.password2 = 'Пароли не совпадают'
    return false
  }
  passwordErrors.value.password2 = ''
  return true
}

onMounted(async () => {
  try {
    const response = await axiosInstance.get('/user/profile')
    profileForm.value = {
      name: response.data.user.name || '',
      surname: response.data.user.surname || '',
      patronymic: response.data.user.patronymic || '',
      phone: response.data.user.phone || ''
    }
  } catch (err) {
    profileError.value = err.response?.data?.message || 'Не удалось загрузить данные пользователя'
  }
})

const saveProfile = async () => {
  profileError.value = ''
  profileSuccess.value = false
  profileErrors.value = {
    name: '',
    surname: '',
    patronymic: '',
    phone: ''
  }

  const isValid = [
    validateName(),
    validateSurname(),
    validatePatronymic(),
    validatePhone()
  ].every(v => v)

  if (!isValid) {
    return
  }

  try {
    const response = await axiosInstance.patch('/user/updateProfile', profileForm.value)
    profileSuccess.value = true
    emit('update-user', {
      name: profileForm.value.name,
      surname: profileForm.value.surname,
      patronymic: profileForm.value.patronymic,
      phone: profileForm.value.phone
    })
  } catch (err) {
    if (err.response) {
      if (err.response.status === 500) {
        profileError.value = 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.'
      } else if (err.response.data.error) {
        profileError.value = err.response.data.error
      } else if (err.response.data.message && err.response.data.errors) {
        profileError.value = 'Пожалуйста, исправьте ошибки в форме'
        Object.keys(err.response.data.errors).forEach((key) => {
          profileErrors.value[key] = err.response.data.errors[key][0]
        })
      } else {
        profileError.value = 'Ошибка при обновлении профиля'
      }
    } else {
      profileError.value = 'Произошла ошибка. Попробуйте снова.'
    }
  }
}

const changePassword = async () => {
  passwordError.value = ''
  passwordSuccess.value = false
  passwordErrors.value = {
    current_password: '',
    password1: '',
    password2: ''
  }

  if (!passwordForm.value.current_password) {
    passwordErrors.value.current_password = 'Текущий пароль обязателен'
    return
  }

  const isValid = [
    validatePassword(),
    validatePasswordConfirmation()
  ].every(v => v)

  if (!isValid) {
    return
  }

  try {
    const response = await axiosInstance.patch('/user/updatePassword', {
      current_password: passwordForm.value.current_password,
      password1: passwordForm.value.password1,
      password1_confirmation: passwordForm.value.password1_confirmation
    })

    passwordSuccess.value = true
    passwordForm.value = {
      current_password: '',
      password1: '',
      password1_confirmation: ''
    }
  } catch (err) {
    if (err.response) {
      if (err.response.status === 500) {
        passwordError.value = 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.'
      } else if (err.response.data.error) {
        passwordError.value = err.response.data.error
      } else if (err.response.data.message && err.response.data.errors) {
        passwordError.value = 'Пожалуйста, исправьте ошибки в форме'
        Object.keys(err.response.data.errors).forEach((key) => {
          if (key === 'password1') passwordErrors.value.password1 = err.response.data.errors[key][0]
          if (key === 'current_password') passwordErrors.value.current_password = err.response.data.errors[key][0]
        })
      } else {
        passwordError.value = 'Ошибка при смене пароля'
      }
    } else {
      passwordError.value = 'Произошла ошибка. Попробуйте снова.'
    }
  }
}
</script>

<style scoped>
.edit-profile {
  background: white;
  padding: 20px;
  box-shadow: 10px 10px 5px rgba(204, 204, 204, 0.5);
}

.edit-profile h2 {
  font-size: 24px;
  margin-bottom: 20px;
  color: #111;
  font-family: 'Noto Sans', sans-serif;
  font-weight: 400;
  text-align: center;
}

.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background: #f0f0f0;
  cursor: pointer;
  font-family: 'Noto Sans', sans-serif;
  font-size: 16px;
  color: #111;
  transition: background 0.3s;
}

.tabs button.active {
  background: #FF784F;
  color: white;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-family: 'Noto Sans', sans-serif;
  font-weight: 300;
  font-size: 16px;
  color: #000;
}

.modal-input {
  width: 100%;
  padding: 10px 6px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  color: #181818;
  margin-bottom: 24px;
}

.modal-input:focus {
  outline: none;
  background-color: #e8e8e8;
}

.modal-button {
  width: 100%;
  padding: 12px;
  background-color: #FF784F;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: 'Noto Sans', sans-serif;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  margin-bottom: 32px;
}

.modal-button:hover {
  color: #e8ded4;
}

.error-message {
  color: #ff4444;
  font-size: 12px;
  margin-top: -20px;
  margin-bottom: 15px;
  display: block;
  font-family: 'Noto Sans', sans-serif;
  text-align: center;
}

span .error-message {
  margin-top: 10px;
  font-size: 12px;
}

.success-message {
  color: green;
  margin-bottom: 10px;
  font-family: 'Noto Sans', sans-serif;
  text-align: center;
}

.input-error {
  border-color: #ff4444 !important;
  background-color: #ffeeee !important;
}

/* Адаптив для 1366px */
@media (max-width: 1366px) {
  .edit-profile {
    padding: 15px;
  }

  .edit-profile h2 {
    font-size: 20px;
    margin-bottom: 15px;
  }

  .tabs button {
    padding: 8px 15px;
    font-size: 14px;
  }

  .form-group label {
    font-size: 14px;
  }

  .modal-input {
    padding: 8px 5px;
    font-size: 14px;
    margin-bottom: 20px;
  }

  .modal-button {
    padding: 10px;
    font-size: 12px;
    margin-bottom: 25px;
  }

  .error-message {
    font-size: 11px;
    margin-top: -15px;
    margin-bottom: 10px;
  }

  span.error-message {
    font-size: 11px;
  }

  .success-message {
    font-size: 14px;
  }
}

/* Адаптив для 360px (мобильные устройства) */
@media (max-width: 360px) {
  .edit-profile {
    padding: 10px;
  }

  .edit-profile h2 {
    font-size: 18px;
    margin-bottom: 15px;
  }

  .tabs {
    flex-direction: column;
    gap: 5px;
  }

  .tabs button {
    width: 100%;
    padding: 10px;
    font-size: 14px;
  }

  .form-group {
    margin-bottom: 10px;
  }

  .form-group label {
    font-size: 12px;
    margin-bottom: 3px;
  }

  .modal-input {
    padding: 8px;
    font-size: 12px;
    margin-bottom: 15px;
  }

  .modal-button {
    padding: 10px;
    font-size: 12px;
    margin-bottom: 20px;
  }

  .error-message {
    font-size: 10px;
    margin-top: -10px;
    margin-bottom: 10px;
  }

  span.error-message {
    font-size: 10px;
    margin-top: 5px;
  }

  .success-message {
    font-size: 12px;
    margin-bottom: 10px;
  }
}
</style>