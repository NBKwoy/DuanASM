import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store-supabase'

// Import Bootstrap CSS và JS
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const app = createApp(App)

// Khởi tạo theme khi app load
try {
    if (document.documentElement) {
        store.initTheme()
    }
} catch (error) {
    console.error('Error initializing theme:', error)
}

app.mount('#app')