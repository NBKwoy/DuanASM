import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { store } from './store'

// Import Bootstrap CSS và JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

app.use(router)

// Khởi tạo theme khi app load (chỉ khi DOM đã sẵn sàng)
try {
    if (document.documentElement) {
        store.initTheme()
    }
} catch (error) {
    console.error('Error initializing theme:', error)
}

app.mount('#app')