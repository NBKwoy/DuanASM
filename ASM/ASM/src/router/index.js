import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import HotView from '../views/HotView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import ProfileView from '../views/ProfileView.vue'
import FriendsView from '../views/FriendsView.vue'
import NotificationsView from '../views/NotificationsView.vue'
import { store } from '../store'

const router = createRouter({
    history: createWebHistory(
        import.meta.env.BASE_URL),
    routes: [
        { path: '/', name: 'home', component: HomeView },
        { path: '/hot', name: 'hot', component: HotView },
        { path: '/login', name: 'login', component: LoginView },
        { path: '/register', name: 'register', component: RegisterView },
        { path: '/profile', name: 'profile', component: ProfileView },
        { path: '/friends', name: 'friends', component: FriendsView },
        { path: '/notifications', name: 'notifications', component: NotificationsView }
    ]
})

// Guard: Chặn chưa đăng nhập
router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register'];
    const authRequired = !publicPages.includes(to.path);
    if (authRequired && !store.currentUser) {
        next('/login');
    } else {
        next();
    }
});

export default router