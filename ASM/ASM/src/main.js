import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store' // Đảm bảo import store nếu cần dùng global, hoặc để App dùng

// Import Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

// app.use(router) // <-- XÓA HOẶC COMMENT DÒNG NÀY
app.mount('#app')