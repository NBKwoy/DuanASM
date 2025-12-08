import { createRouter, createWebHistory } from 'vue-router'
import { store } from './store'

// Import các trang
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Home from './components/Home.vue'
import Profile from './components/Profile.vue'
// --- THÊM 2 DÒNG NÀY ---
import Friends from './components/Friends.vue'
import HotSearch from './components/HotSearch.vue'

const routes = [
    { path: '/login', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
    { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
    
    // --- THÊM 2 ROUTE NÀY ---
    { 
        path: '/friends', 
        name: 'Friends', 
        component: Friends, 
        meta: { requiresAuth: true } 
    },
    { 
        path: '/hotsearch', 
        name: 'HotSearch', 
        component: HotSearch, 
        meta: { requiresAuth: true } 
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.currentUser;
    if (to.meta.requiresAuth && !isAuthenticated) next('/login');
    else if ((to.path === '/login' || to.path === '/register') && isAuthenticated) next('/');
    else next();
})

export default router;