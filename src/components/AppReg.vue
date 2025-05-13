<template>
  <section class="wrap registration">
    <p>Регистрация</p>
    <div>
      <input
          type="text"
          name="name"
          placeholder="Имя"
          v-model="name"
          required
      />
<!--      <p v-if="errorEmail" class="error">{{ errorEmail }}</p>-->
      <input
          type="text"
          name="surname"
          placeholder="Фамилия"
          v-model="surname"
          required
      />
      <input
          type="text"
          name="patronymic"
          placeholder="Отчество"
          v-model="patronymic"
          required
      />
      <input
          type="text"
          name="phone"
          placeholder="Номер телефона"
          v-model="phone"
          required
      />
      <input
          type="email"
          name="email"
          placeholder="Электронная почта"
          v-model="email"
          required
      />
      <input
          type="password"
          name="password"
          placeholder="Пароль"
          v-model="password"
          required
      />
      <input
          type="text"
          name="verification_code"
          placeholder="Код"
          v-model="verification_code"
          required
      />
<!--      <p v-if="errorPassword" class="error">{{ errorPassword }}</p>-->
      <input type="submit" @click.prevent="signUp" />
    </div>
<!--    <p v-if="errorUser" class="error">{{ errorUser }}</p>-->
  </section>
</template>

<script setup>
import axios from "axios";
import {thisUrl} from "../url.js";
import {ref} from "vue";

let email = ref('')
let password = ref('')
let name = ref('')
let surname = ref('')
let phone = ref('')
let patronymic = ref('')
let verification_code = ref('')

const signUp = async () => {
  try {
    const response = await axios.post(
        `${thisUrl()}/reg`, {
          name: name.value,
          surname: surname.value,
          patronymic: patronymic.value,
          phone: phone.value,
          email: email.value,
          password: password.value,
          verification_code: verification_code.value
        }
    );
console.log(name.value, surname.value, patronymic.value, phone.value, email.value, password.value,)
  }
  catch(error) {
    console.log(error)
    throw error
  }
}
</script>


<style scoped>
.wrap.registration {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.wrap.registration form {
  display: flex;
  flex-direction: column;
}

.wrap.registration input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.wrap.registration input:focus {
  border-color: #007bff;
  outline: none;
}

.wrap.registration button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
}

.wrap.registration button:hover {
  background-color: #0056b3;
}

.error {
  color: red;
  font-size: small;
}

@media (max-width: 600px) {
  .wrap.registration {
    width: calc(100% - 40px);
    padding: 15px;
  }

  .wrap.registration input,
  .wrap.registration button {
    font-size: 14px;
    padding: 8px;
  }
}
</style>