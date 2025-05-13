import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import './bootstrap'
import VueTheMask from "vue-the-mask";

const app = createApp(App)
app.use(VueTheMask)
app.use(router)

app.mount('#app')
