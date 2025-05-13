<template>
  <Transition name="fade">
    <div v-if="isOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">✖</button>
        <div>
          <h2 class="modal-title">Вход</h2>
          <form @submit.prevent="signIn">
            <div class="input-wrapper" :class="{ 'error': emailError }">
              <input
                  v-model="email"
                  type="email"
                  name="email"
                  placeholder="E-mail"
                  class="modal-input"
                  required
              />
            </div>
            <div class="input-wrapper" :class="{ 'error': passwordError }">
              <input
                  v-model="password"
                  type="password"
                  name="password"
                  placeholder="Пароль"
                  class="modal-input"
                  required
              />
              <span v-if="passwordError" class="error-message">Неправильный email или пароль</span>
            </div>
            <div class="modal-checkbox">
              <input type="checkbox" id="remember" v-model="rememberPassword" />
              <label for="remember">Запомнить пароль</label>
            </div>
            <button type="submit" class="modal-button">ВОЙТИ</button>
          </form>
          <div class="modal-text">
            <p class="modal-link">
              Нет аккаунта? <a href="#" @click.prevent="redirectToRegister">Зарегистрируйтесь</a>
            </p>
            <p class="modal-policy">
              При регистрации и входе вы соглашаетесь с <a href="#" @click.prevent="redirectToPolicy">политикой конфиденциальности</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { thisUrl } from '../url.js';
import Cookies from 'js-cookie';

const emit = defineEmits(['update:isOpen', 'go-to-register', 'go-to-policy', 'go-to-forgot-password', 'auth-success']);
defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const email = ref('');
const password = ref('');
const rememberPassword = ref(false);
const emailError = ref(false);
const passwordError = ref(false);

const token = ref(Cookies.get('authToken') || '');

const closeModal = () => {
  emit('update:isOpen', false);
  resetForm();
};

const resetForm = () => {
  email.value = '';
  password.value = '';
  rememberPassword.value = false;
  emailError.value = false;
  passwordError.value = false;
};

const signIn = async () => {
  try {
    const response = await axios.post(`${thisUrl()}/auth/login`, {
      email: email.value,
      password: password.value,
    });
    const newToken = response.data.access_token;
    const userId = response.data.user_id;
    token.value = newToken;
    Cookies.set('authToken', newToken, {
      expires: rememberPassword.value ? 1 : 1,
      secure: true,
      sameSite: 'strict',
    });
    Cookies.set('userId', userId, {
      expires: rememberPassword.value ? 1 : 1,
      secure: true,
      sameSite: 'strict',
    });
    emit('auth-success', email.value);
    closeModal(response.data.access_token);
  } catch (error) {
    if (error.response && error.response.status === 401) {
      emailError.value = true;
      passwordError.value = true;
    } else {
      throw error;
    }
  }
};

const redirectToRegister = () => {
  emit('go-to-register');
  closeModal();
};

const redirectToPolicy = () => {
  emit('go-to-policy');
  closeModal();
};

// Метод получения для токена
const getToken = () => {
  return token.value || Cookies.get('authToken');
};

// Logout
const logout = () => {
  token.value = '';
  Cookies.remove('authToken');
  emit('auth-success', null);
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

.input-wrapper {
  position: relative;
  margin-bottom: 16px;
}

.modal-input {
  width: 100%;
  padding: 10px 6px;
  background-color: #f0f0f0;
  border: 2px solid transparent;
  border-radius: 5px;
  font-size: 16px;
  color: #181818;
}

.modal-input:focus {
  outline: none;
  background-color: #e8e8e8;
}

.input-wrapper.error .modal-input {
  border-color: #ff0000;
}

.error-message {
  position: absolute;
  top: 100%;
  left: 0;
  color: #ff0000;
  font-family: Noto Sans;
  font-weight: 300;
  font-size: 14px;
  margin-top: 5px;
}

.modal-checkbox {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 32px;
  font-family: Noto Sans;
  font-weight: 300;
  font-size: 16px;
  color: #000;
  margin-top: 25px;
}

.modal-checkbox label {
  margin-left: 5px;
}

.modal-checkbox a {
  color: #150060;
  text-decoration: none;
}

.modal-checkbox a:hover {
  text-decoration: underline;
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
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
  }

  .input-wrapper {
    margin-bottom: 12px;
  }

  .modal-checkbox {
    font-size: 14px;
    margin-bottom: 25px;
    margin-top: 20px;
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

  .error-message {
    font-size: 12px;
    margin-top: 4px;
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
  }

  .input-wrapper {
    margin-bottom: 10px;
  }

  .modal-checkbox {
    font-size: 12px;
    margin-bottom: 20px;
    margin-top: 15px;
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

  .error-message {
    font-size: 10px;
    margin-top: 3px;
  }
}
</style>