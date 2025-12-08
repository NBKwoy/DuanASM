import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js' // <--- 1. Import router

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

app.use(router) // <--- 2. Kích hoạt router

app.mount('#app')