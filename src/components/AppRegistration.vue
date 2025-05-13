<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">✖</button>
        <div v-if="step === 'email'">
          <h2 class="modal-title">Регистрация</h2>
          <form @submit.prevent="sendVerificationCode">
            <input
                v-model="email"
                type="email"
                name="email"
                placeholder="E-mail"
                class="modal-input"
                :class="{ 'input-error': errors.email }"
                required
                @input="errors.email = ''"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            <button type="submit" class="modal-button">получить код</button>
          </form>
          <div class="modal-text">
            <p class="modal-link">
              Уже есть профиль? <a href="#" @click.prevent="redirectToLogin">Войти</a>
            </p>
            <p class="modal-policy">
              При регистрации и входе вы соглашаетесь с <a href="#" @click.prevent="redirectToPolicy">политикой конфиденциальности</a>
            </p>
          </div>
        </div>
        <div v-else-if="step === 'code'">
          <h2 class="modal-title">Введите код</h2>
          <form @submit.prevent="verifyCode">
            <div class="input-container">
              <input
                  v-for="(digit, index) in codeDigits"
                  :key="index"
                  v-model="codeDigits[index]"
                  type="text"
                  class="digit-input"
                  :class="{ 'input-error': errors.code }"
                  maxlength="1"
                  required
                  @input="handleInput(index)"
                  @keydown="handleKeyDown(index, $event)"
              />
            </div>
            <span v-if="errors.code" class="error-message">{{ errors.code }}</span>
            <p>Введите 4-х значный код</p>
            <button type="submit" class="modal-button">ПОДТВЕРДИТЬ</button>
          </form>
          <p class="modal-link">
            Код отправлен на <span class="modal-link-email">{{ email }}</span>. <br> <a href="#" @click.prevent="goBack">Изменить email</a>
          </p>
        </div>
        <div v-else-if="step === 'register'">
          <h2 class="modal-title">Введите ваши данные</h2>
          <form @submit.prevent="registerUser">
            <input
                v-model="name"
                type="text"
                name="name"
                placeholder="Имя"
                class="modal-input"
                :class="{ 'input-error': errors.name }"
                required
                @input="validateName"
            />
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>

            <input
                v-model="surname"
                type="text"
                name="surname"
                placeholder="Фамилия"
                class="modal-input"
                :class="{ 'input-error': errors.surname }"
                required
                @input="validateSurname"
            />
            <span v-if="errors.surname" class="error-message">{{ errors.surname }}</span>

            <input
                v-model="patronymic"
                type="text"
                name="patronymic"
                placeholder="Отчество"
                class="modal-input"
                :class="{ 'input-error': errors.patronymic }"
                required
                @input="validatePatronymic"
            />
            <span v-if="errors.patronymic" class="error-message">{{ errors.patronymic }}</span>

            <input
                v-model="phone"
                type="text"
                name="phone"
                placeholder="Номер телефона (+7XXXXXXXXXX)"
                class="modal-input"
                :class="{ 'input-error': errors.phone }"
                required
                @input="formatPhone"
                @keydown="protectPrefix($event)"
            />
            <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>

            <input
                v-model="password"
                type="password"
                name="password"
                placeholder="Пароль (от 8 символов)"
                class="modal-input"
                :class="{ 'input-error': errors.password }"
                required
                @input="validatePassword"
            />
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>

            <button type="submit" class="modal-button">ЗАРЕГИСТРИРОВАТЬСЯ</button>
          </form>
          <p class="modal-link">
            Уже есть профиль? <a href="#" @click.prevent="redirectToLogin">Войти</a>
          </p>
          <p class="modal-policy">
            При регистрации и входе вы соглашаетесь с политикой конфиденциальности
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import axios from 'axios';
import { thisUrl } from '../url.js';
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  isOpen: { type: Boolean, default: false },
});
const emit = defineEmits(['update:isOpen', 'go-to-login', 'auth-success']);

const step = ref('email');
const email = ref('');
const codeDigits = ref(['', '', '', '']);
const name = ref('');
const surname = ref('');
const patronymic = ref('');
const phone = ref('');
const password = ref('');
const errors = ref({
  email: '',
  code: '',
  name: '',
  surname: '',
  patronymic: '',
  phone: '',
  password: ''
});

const validateEmail = () => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.value)) {
    errors.value.email = 'Введите корректный email';
    return false;
  }
  errors.value.email = '';
  return true;
};

const validateCode = () => {
  const code = codeDigits.value.join('');
  if (!/^\d{4}$/.test(code)) {
    errors.value.code = 'Код должен состоять из 4 цифр';
    return false;
  }
  errors.value.code = '';
  return true;
};

const validateName = () => {
  if (!/^[А-Яа-яЁё\s-]+$/.test(name.value)) {
    errors.value.name = 'Только кириллица, пробелы и тире';
    return false;
  }
  errors.value.name = '';
  return true;
};

const validateSurname = () => {
  if (!/^[А-Яа-яЁё\s-]+$/.test(surname.value)) {
    errors.value.surname = 'Только кириллица, пробелы и тире';
    return false;
  }
  errors.value.surname = '';
  return true;
};

const validatePatronymic = () => {
  if (!/^[А-Яа-яЁё\s-]+$/.test(patronymic.value)) {
    errors.value.patronymic = 'Только кириллица, пробелы и тире';
    return false;
  }
  errors.value.patronymic = '';
  return true;
};

const validatePhone = () => {
  if (!/^\+7\d{10}$/.test(phone.value)) {
    errors.value.phone = 'Формат: +7XXXXXXXXXX';
    return false;
  }
  errors.value.phone = '';
  return true;
};

const protectPrefix = (event) => {
  const value = phone.value;
  const selectionStart = event.target.selectionStart;

  if (selectionStart <= 2 && event.key === 'Backspace') {
    event.preventDefault();
  }

  if (selectionStart < 1 && event.key === 'v' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault();
  }
};

const validatePassword = () => {
  if (password.value.length < 8) {
    errors.value.password = 'Пароль должен быть не менее 8 символов';
    return false;
  }
  errors.value.password = '';
  return true;
};

const formatPhone = () => {
  let digits = phone.value.replace(/[^\d+]/g, '');

  if (!digits.startsWith('+7')) {
    digits = '+7' + digits.replace(/^\+?7?/, '');
  }

  digits = digits.substring(0, 12);

  phone.value = digits;

  validatePhone();
};

const closeModal = () => {
  emit('update:isOpen', false);
  resetForm();
};

const resetForm = () => {
  step.value = 'email';
  email.value = '';
  codeDigits.value = ['', '', '', ''];
  name.value = '';
  surname.value = '';
  patronymic.value = '';
  phone.value = '';
  password.value = '';
  errors.value = {
    email: '',
    code: '',
    name: '',
    surname: '',
    patronymic: '',
    phone: '',
    password: ''
  };
};

const sendVerificationCode = async () => {
  if (!validateEmail()) return;

  try {
    const response = await axios.post(`${thisUrl()}/sendVerificationCode`, {
      email: email.value,
    });
    step.value = 'code';
  } catch (error) {
    errors.value.email = 'Ошибка при отправке кода';
  }
};

const handleInput = (index) => {
  const inputs = document.querySelectorAll('.digit-input');
  let currentValue = codeDigits.value[index];

  if (currentValue && !/^\d$/.test(currentValue)) {
    codeDigits.value[index] = currentValue.replace(/[^0-9]/g, '');
    return;
  }

  if (codeDigits.value[index] && index < 3) {
    inputs[index + 1].focus();
  }
};

const handleKeyDown = (index, event) => {
  const inputs = document.querySelectorAll('.digit-input');

  if (event.key === 'Backspace' && !codeDigits.value[index] && index > 0) {
    event.preventDefault();
    codeDigits.value[index - 1] = '';
    inputs[index - 1].focus();
  }
};

const verifyCode = async () => {
  if (!validateCode()) return;

  const code = codeDigits.value.join('');

  try {
    const response = await axios.post(`${thisUrl()}/verifyCode`, {
      email: email.value,
      verification_code: code
    });

    if (response.data.message) {
      step.value = 'register';
    }
  } catch (error) {
    if (error.response?.data?.error) {
      errors.value.code = error.response.data.error;
    } else {
      errors.value.code = 'Ошибка при проверке кода';
    }
  }
};

const goBack = () => {
  step.value = 'email';
};

const registerUser = async () => {
  const isValid = [
    validateName(),
    validateSurname(),
    validatePatronymic(),
    validatePhone(),
    validatePassword()
  ].every(v => v);

  if (!isValid) return;

  try {
    const response = await axios.post(`${thisUrl()}/reg`, {
      name: name.value,
      surname: surname.value,
      patronymic: patronymic.value,
      phone: phone.value,
      email: email.value,
      password: password.value,
    });
    emit('auth-success', email.value);
    closeModal();
  } catch (error) {
  }
};

const redirectToLogin = () => {
  emit('go-to-login');
  closeModal();
};

const redirectToPolicy = () => {
  emit('go-to-policy');
  closeModal();
};

</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.modal-content {
  background-color: #ffffff;
  padding: 40px 24px;
  border-radius: 10px;
  position: relative;
  width: 340px;
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 22px;
  color: #2B2D33;
  cursor: pointer;
}

.modal-title {
  color: #111;
  font-family: Noto Sans;
  font-weight: 400;
  font-size: 24px;
  text-align: center;
  margin-bottom: 32px;
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
  background-color: rgb(255, 110, 66);
  color: #111;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-family: Noto Sans;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  margin-bottom: 32px;
}

.modal-button:hover {
  color: #e8ded4;
}

.modal-text {
  width: 100%;
  border-top: 1px solid black;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-link {
  color: #000;
  margin-top: 16px;
  font-family: Noto Sans;
  font-weight: 300;
  font-size: 16px;
}

.modal-link a {
  color: #150060;
  text-decoration: none;
}

.modal-link a:hover {
  text-decoration: underline;
  color: #150060;
}

.modal-link-email {
  font-weight: bold;
}

form p {
  text-align: center;
  padding-bottom: 10px;
  font-family: Noto Sans;
  font-weight: 300;
  font-size: 16px;
  color: #000;
}

.modal-policy {
  color: #666;
  margin-top: 10px;
  line-height: 1;
  font-family: Noto Sans;
  font-weight: 300;
  font-size: 14px;
}

.modal-policy a {
  text-decoration: underline;
  color: #666;
  font-family: Noto Sans;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.input-container {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-bottom: 24px;
}

.digit-input {
  width: 50px;
  height: 50px;
  text-align: center;
  font-size: 24px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
  background-color: #f0f0f0;
}

.digit-input:focus {
  border-color: rgb(255, 110, 66);
  box-shadow: 0 0 5px rgb(255, 110, 66, 0.8);
  background-color: #e8e8e8;
}

.digit-input::-webkit-inner-spin-button,
.digit-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.digit-input[type="number"] {
  -moz-appearance: textfield;
}

.input-error {
  border-color: #ff4444 !important;
  background-color: #ffeeee !important;
}

.error-message {
  color: #ff4444;
  font-size: 12px;
  margin-top: -20px;
  margin-bottom: 15px;
  display: block;
  font-family: Noto Sans;
  text-align: center;
}

/* Адаптив для 1366px */
@media (max-width: 1366px) {
  .modal-content {
    width: 300px;
    padding: 30px 20px;
  }

  .modal-title {
    font-size: 20px;
    margin-bottom: 25px;
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

  .modal-close {
    font-size: 18px;
    top: 12px;
    right: 12px;
  }

  .modal-link {
    font-size: 14px;
    margin-top: 12px;
  }

  .modal-policy {
    font-size: 12px;
    margin-top: 8px;
  }

  .input-container {
    gap: 8px;
    margin-bottom: 20px;
  }

  .digit-input {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  form p {
    font-size: 14px;
    padding-bottom: 8px;
  }

  .error-message {
    font-size: 11px;
    margin-top: -15px;
    margin-bottom: 10px;
  }
}

/* Адаптив для 360px (мобильные устройства) */
@media (max-width: 360px) {
  .modal-overlay {
    align-items: flex-start;
  }

  .modal-content {
    width: 100%;
    height: 100vh;
    margin: 0;
    padding: 20px 15px;
    border-radius: 0;
  }

  .modal-title {
    font-size: 18px;
    margin-bottom: 20px;
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

  .modal-close {
    font-size: 16px;
    top: 10px;
    right: 10px;
  }

  .modal-text {
    gap: 15px;
  }

  .modal-link {
    font-size: 12px;
    margin-top: 10px;
  }

  .modal-policy {
    font-size: 10px;
    margin-top: 5px;
  }

  .input-container {
    gap: 5px;
    margin-bottom: 15px;
  }

  .digit-input {
    width: 35px;
    height: 35px;
    font-size: 18px;
  }

  form p {
    font-size: 12px;
    padding-bottom: 5px;
  }

  .error-message {
    font-size: 10px;
    margin-top: -10px;
    margin-bottom: 10px;
  }
}
</style>