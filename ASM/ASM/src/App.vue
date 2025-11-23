<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { store } from './store'

// Import các Components
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Home from './components/Home.vue'
import Friends from './components/Friends.vue'
import Notifications from './components/Notifications.vue'
import Profile from './components/Profile.vue'
import HotSearch from './components/HotSearch.vue'

const currentTab = ref('login')
const searchQuery = ref('')
const showNavbar = ref(true)
const pendingPostId = ref(null);

const switchTab = (tabName) => { currentTab.value = tabName; window.scrollTo(0, 0); }
const handleLogout = () => { store.logout(); currentTab.value = 'login'; }
const handleSearch = () => { if(searchQuery.value) alert('Bạn đang tìm: ' + searchQuery.value); }

const handleViewPost = (postId) => {
    currentTab.value = 'home';
    pendingPostId.value = postId;
    window.scrollTo(0, 0);
};

const handleScroll = () => {
    if (currentTab.value !== 'home') { showNavbar.value = true; return; }
    showNavbar.value = window.scrollY > 250;
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    if (store.currentUser) {
        currentTab.value = 'home';
        store.initTheme();
        showNavbar.value = false;
    } else { currentTab.value = 'login'; }
});
onUnmounted(() => { window.removeEventListener('scroll', handleScroll); });

watch(currentTab, (newTab) => {
    if (newTab !== 'home') showNavbar.value = true;
    else showNavbar.value = (window.scrollY > 250);
});
</script>

<template>
  <nav class="navbar navbar-expand-lg shadow-sm fixed-top transition-navbar"
       :class="[
         !showNavbar ? 'navbar-hidden' : 'navbar-visible',
         store.theme === 'dark' ? 'navbar-dark' : 'navbar-light'
       ]"
       v-if="store.currentUser">
    
    <div class="container">
        <a class="navbar-brand py-0" href="#" @click.prevent="switchTab('home')">
            <img src="https://i.imgur.com/fr2DiX6.png" alt="Social" height="50">
        </a>

        <div class="input-group d-none d-md-flex" style="width: 240px;">
            <span class="input-group-text bg-light border-0 rounded-pill rounded-end-0">
                <i class="fas fa-search text-muted"></i>
            </span>
            <input v-model="searchQuery" @keyup.enter="handleSearch" type="text" class="form-control bg-light border-0 rounded-pill rounded-start-0 shadow-none" placeholder="Tìm kiếm...">
        </div>
       
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarContent">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                <li class="nav-item px-2">
                    <a class="nav-link d-flex align-items-center" :class="{ 'active-nav': currentTab === 'home' }" href="#" @click.prevent="switchTab('home')">
                        <i class="fas fa-home fs-5 me-2"></i> <span class="fw-semibold">Trang chủ</span>
                    </a>
                </li>
                <li class="nav-item px-2">
                    <a class="nav-link d-flex align-items-center" :class="{ 'active-nav': currentTab === 'friends' }" href="#" @click.prevent="switchTab('friends')">
                        <i class="fas fa-user-friends fs-5 me-2"></i> <span class="fw-semibold">Bạn bè</span>
                    </a>
                </li>
                <li class="nav-item px2">
                    <a class="nav-link d-flex align-items-center" :class="{ 'active-nav': currentTab === 'hotsearch' }" href="#" @click.prevent="switchTab('hotsearch')">
                        <i class="fas fa-fire fs-5 me-2"></i> <span class="fw-semibold">Tin nóng</span>
                    </a>
                </li>
                <li class="nav-item px-2">
                    <a class="nav-link d-flex align-items-center" :class="{ 'active-nav': currentTab === 'notifications' }" href="#" @click.prevent="switchTab('notifications')">
                        <i class="fas fa-bell fs-5 me-2"></i> <span class="fw-semibold">Thông báo</span>
                    </a>
                </li>
            </ul>

            <ul class="navbar-nav align-items-center gap-3">
                <li class="nav-item cursor-pointer" @click="store.toggleTheme()">
                    <div class="btn btn-light rounded-circle border d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                        <i v-if="store.theme === 'dark'" class="fas fa-sun text-warning"></i>
                        <i v-else class="fas fa-moon text-secondary"></i>
                    </div>
                </li>

                <li class="nav-item fw-bold d-none d-lg-block text-body">{{ store.currentUser.name }}</li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        <img :src="store.currentUser.avatar || store.defaultAvatar" class="rounded-circle border object-fit-cover" width="40" height="40">
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end border-0 shadow">
                        <li><a class="dropdown-item" href="#" @click.prevent="switchTab('profile')">Thông tin cá nhân</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><button class="dropdown-item text-danger" @click="handleLogout">Đăng xuất</button></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
  </nav>

  <Login v-if="!store.currentUser && currentTab === 'login'" @login-success="switchTab('home')" @switch-register="switchTab('register')" />
  <Register v-if="!store.currentUser && currentTab === 'register'" @switch-login="switchTab('login')" />

  <div class="container-fluid p-0" v-if="store.currentUser">
      <Home v-if="currentTab === 'home'" @navigate="switchTab" :open-post-id="pendingPostId" @post-opened="pendingPostId = null" />
      <div class="container pt-5 mt-4" v-if="currentTab !== 'home'">
          <Friends v-if="currentTab === 'friends'" @navigate="switchTab" />
          <Notifications v-if="currentTab === 'notifications'" @navigate="switchTab" @view-post="handleViewPost" />
          <Profile v-if="currentTab === 'profile'" />
          <HotSearch v-if="currentTab === 'hotsearch'" />
      </div>
  </div>
</template>

<style>
/* --- CSS VARIABLES --- */
:root {
    --bg-body: #f0f2f5;
    --bg-card: #ffffff;
    --text-color: #050505;
    --text-muted: #65676b;
    --input-bg: #f0f2f5;
    --border-color: #dee2e6;
}

/* Dark Mode Variables */
[data-bs-theme="dark"] {
    --bg-body: #18191a;
    --bg-card: #242526;
    --text-color: #e4e6eb;
    --text-muted: #b0b3b8;
    --input-bg: #3a3b3c;
    --border-color: #3e4042;
    --bs-body-bg: #18191a; 
}

/* --- GLOBAL STYLES --- */
body, .page-background, #app {
    background-color: var(--bg-body) !important;
    background-image: none !important;
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

/* Navbar Styles - QUAN TRỌNG: Dùng var(--bg-card) */
.navbar, .sticky-sidebar .list-group {
    background-color: var(--bg-card) !important;
    border-color: var(--border-color) !important;
}

.card, .modal-content {
    background-color: var(--bg-card) !important;
    color: var(--text-color) !important;
    border-color: var(--border-color) !important;
}

.form-control, .bg-light, .btn-light, .input-group-text {
    background-color: var(--input-bg) !important;
    color: var(--text-color) !important;
    border-color: transparent !important;
}

.form-control::placeholder { color: var(--text-muted) !important; }
.text-dark, .text-body { color: var(--text-color) !important; }
.text-muted, .text-secondary { color: var(--text-muted) !important; }
hr, .border, .border-bottom, .border-top { border-color: var(--border-color) !important; }

/* Hover Effects */
[data-bs-theme="dark"] .hover-bg:hover,
[data-bs-theme="dark"] .dropdown-item:hover,
[data-bs-theme="dark"] .list-group-item-action:hover {
    background-color: #3a3b3c !important;
}
[data-bs-theme="dark"] .dropdown-menu { background-color: var(--bg-card); border-color: var(--border-color); }
[data-bs-theme="dark"] .dropdown-item { color: var(--text-color); }
[data-bs-theme="dark"] .nav-link:hover { background-color: #3a3b3c; }

.active-nav { color: var(--bs-primary) !important; border-bottom: 3px solid var(--bs-primary); }
.nav-link { cursor: pointer; transition: all 0.2s; border-bottom: 3px solid transparent; }
.nav-link:hover { background-color: rgba(0,0,0,0.05); border-radius: 8px; }

.transition-navbar { transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out; }
.navbar-hidden { transform: translateY(-100%); opacity: 0; pointer-events: none; }
.navbar-visible { transform: translateY(0); opacity: 1; }
</style>