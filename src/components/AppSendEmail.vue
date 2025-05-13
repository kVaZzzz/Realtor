<template>
  <section class="wrap registration">
    <p>Регистрация</p>
    <div>
      <input
          type="email"
          name="email"
          placeholder="Электронная почта"
          v-model="email"
          required
      />
      <!--      <p v-if="errorPassword" class="error">{{ errorPassword }}</p>-->
      <input type="submit" @click.prevent="sendEmail" />
    </div>
    <!--    <p v-if="errorUser" class="error">{{ errorUser }}</p>-->
  </section>
</template>

<script setup>
import axios from "axios";
import {thisUrl} from "../url.js";
import {ref} from "vue";
import {useRouter} from 'vue-router'
const router = useRouter()

let email = ref('')

const sendEmail = async () => {
  try {
    const response = await axios.post(
        `${thisUrl()}/sendVerificationCode`, {
          email: email.value,
        }
    );
    await router.push({ name: 'reg' });
  }
  catch(error) {
    console.log(error)
    throw error
  }
}
</script>


<style scoped>
p{
  color: #181818;
}
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