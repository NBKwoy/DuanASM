import { createRouter, createWebHistory } from 'vue-router'
import { store } from '../store'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true } },
    { path: '/profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView }
  ]
})

// Bảo vệ route (Navigation Guard)
router.beforeEach((to, from, next) => {
    const isAuthenticated = !!store.currentUser;
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
    } else if ((to.name === 'login' || to.name === 'register') && isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router