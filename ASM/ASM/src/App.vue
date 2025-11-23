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

// --- STATE QUẢN LÝ ---
const currentTab = ref('login')
const searchQuery = ref('')
const showNavbar = ref(true) // Kiểm soát ẩn/hiện Navbar
const pendingPostId = ref(null); // ID bài viết cần mở (từ thông báo)

// --- HÀM ĐIỀU HƯỚNG ---
const switchTab = (tabName) => {
    currentTab.value = tabName;
    window.scrollTo(0, 0);
}

const handleLogout = () => {
    store.logout();
    currentTab.value = 'login';
}

const handleSearch = () => {
    if(searchQuery.value) alert('Bạn đang tìm: ' + searchQuery.value);
}

// --- LOGIC XỬ LÝ TỪ THÔNG BÁO (QUAN TRỌNG) ---
// Hàm này được gọi khi User bấm vào thông báo liên quan đến bài viết
const handleViewPost = (postId) => {
    console.log("Nhận yêu cầu mở bài viết:", postId);
    currentTab.value = 'home'; // 1. Chuyển về trang chủ
    pendingPostId.value = postId; // 2. Gán ID để Home tự mở Modal
    window.scrollTo(0, 0);
};

// --- LOGIC SCROLL NAVBAR (HIỆU ỨNG ẨN HIỆN) ---
const handleScroll = () => {
    // Nếu không phải trang Home, luôn hiện Navbar
    if (currentTab.value !== 'home') {
        showNavbar.value = true;
        return;
    }
    // Nếu là Home: Cuộn xuống > 250px mới hiện
    showNavbar.value = window.scrollY > 250;
}

// --- LIFECYCLE HOOKS ---
onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    
    // Kiểm tra đăng nhập
    if (store.currentUser) {
        currentTab.value = 'home';
        store.initTheme();
        showNavbar.value = false; // Mới vào Home thì ẩn Navbar đi
    } else {
        currentTab.value = 'login';
    }
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

// Theo dõi thay đổi Tab để reset trạng thái Navbar
watch(currentTab, (newTab) => {
    if (newTab !== 'home') showNavbar.value = true;
    else showNavbar.value = (window.scrollY > 250);
});
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top transition-navbar"
       :class="{ 'navbar-hidden': !showNavbar, 'navbar-visible': showNavbar }"
       v-if="store.currentUser">
    
    <div class="container">
        <a class="navbar-brand py-0" href="#" @click.prevent="switchTab('home')">
            <img src="https://i.imgur.com/fr2DiX6.png" alt="Social Internet" height="50">
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

            <ul class="navbar-nav align-items-center">
                <li class="nav-item me-2 fw-bold d-none d-lg-block">{{ store.currentUser.name }}</li>
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
      
      <Home 
        v-if="currentTab === 'home'" 
        @navigate="switchTab" 
        :open-post-id="pendingPostId" 
        @post-opened="pendingPostId = null" 
      />
      
      <div class="container pt-5 mt-4" v-if="currentTab !== 'home'">
          <Friends v-if="currentTab === 'friends'" @navigate="switchTab" />
          
          <Notifications 
            v-if="currentTab === 'notifications'" 
            @navigate="switchTab" 
            @view-post="handleViewPost" 
          />
          
          <Profile v-if="currentTab === 'profile'" />
          <HotSearch v-if="currentTab === 'hotsearch'" />
      </div>
  </div>
</template>

<style scoped>
.active-nav { color: var(--bs-primary) !important; border-bottom: 3px solid var(--bs-primary); }
.nav-link { cursor: pointer; transition: all 0.2s; border-bottom: 3px solid transparent; }
.nav-link:hover { background-color: #f8f9fa; border-radius: 8px; }

/* Hiệu ứng trượt Navbar */
.transition-navbar { transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out; }
.navbar-hidden { transform: translateY(-100%); opacity: 0; pointer-events: none; }
.navbar-visible { transform: translateY(0); opacity: 1; }
</style>