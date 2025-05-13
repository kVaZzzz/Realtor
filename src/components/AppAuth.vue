<template>
  <header>
    <h2>Авторизация</h2>
    <div>
      <input type="email" v-model="email" placeholder="Email" required />
      <!--      <p v-if="emailError" class="error">{{ emailError }}</p>-->
      <input type="password" v-model="password" placeholder="Пароль" required />
      <!--      <p v-if="passwordError" class="error">{{ passwordError }}</p>-->
      <input type="submit" @click.prevent="signIn" value="Войти"/>
    </div>
    <!--    <p v-if="errorUser">{{ errorUser }}</p>-->
  </header>
  <AppAuth/>
</template>

<script setup>
import axios from "axios";
import {thisUrl} from "../url.js";
import {ref} from "vue";
import AppAuth from "@/components/AppAuth.vue"

let email = ref('')
let password = ref('')


const signIn = async()=> {
  try {
    console.log(email.value, password.value)
    const response = await axios.post(`${thisUrl()}/auth/login`,
        {
          email: email.value,
          password: password.value,
        })
    const token = response.data.access_token
    console.log(token)
  }
  catch(error) {
    console.log(error)
    throw error
  }
}
</script>

<style scoped>
.error {
  color: red;
  font-size: small;
}

.auth {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

.auth h2 {
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.auth form {
  display: flex;
  flex-direction: column;
}

.reg {
  color: white;
  text-decoration: none;
}

.auth input {
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.auth input:focus {
  border-color: #007bff;
  outline: none;
}

.auth button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 5px;
}

.auth button:hover {
  background-color: #0056b3;
}

.auth p {
  text-align: center;
}

.auth a {
  display: block;
  text-align: center;
}

@media (max-width: 600px) {
  .auth {
    width: calc(100% - 40px);
    padding: 15px;
  }

  .auth h2 {
    font-size: 20px;
  }

  .auth input,
  .auth button {
    font-size: 14px;
    padding: 8px;
  }

  .auth button {
    margin-bottom: 10px;
  }
}
</style>

<!--<style scoped>-->
<!--header {-->
<!--  line-height: 1.5;-->
<!--}-->

<!--.logo {-->
<!--  display: block;-->
<!--  margin: 0 auto 2rem;-->
<!--}-->

<!--@media (min-width: 1024px) {-->
<!--  header {-->
<!--    display: flex;-->
<!--    place-items: center;-->
<!--    padding-right: calc(var(&#45;&#45;section-gap) / 2);-->
<!--  }-->

<!--  .logo {-->
<!--    margin: 0 2rem 0 0;-->
<!--  }-->

<!--  header .wrapper {-->
<!--    display: flex;-->
<!--    place-items: flex-start;-->
<!--    flex-wrap: wrap;-->
<!--  }-->
<!--}-->
<!--</style>-->
