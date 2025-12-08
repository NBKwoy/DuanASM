<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router' // Import Router
import { store } from './store'

const router = useRouter() // Để điều hướng bằng code (ví dụ: logout xong chuyển trang)
const route = useRoute()   // Để lấy thông tin đường dẫn hiện tại

const showNavbar = ref(true)

// Xử lý đăng xuất
const handleLogout = () => {
    store.logout();
    router.push('/login'); // Chuyển hướng về trang đăng nhập
}

// Logic ẩn hiện Navbar khi cuộn trang (Giữ nguyên từ code cũ)
const handleScroll = () => {
    // Chỉ áp dụng hiệu ứng cuộn khi ở trang chủ
    if (route.path === '/') { 
        showNavbar.value = window.scrollY > 250;
    } else {
        showNavbar.value = true;
    }
}

// Theo dõi sự thay đổi của route để reset cuộn trang
watch(route, () => {
    window.scrollTo(0, 0);
    if (route.path !== '/') showNavbar.value = true;
});

onMounted(async () => {
    store.initTheme();
    window.addEventListener('scroll', handleScroll);
    
    // GỌI API LẤY DỮ LIỆU
    await store.fetchUsers(); // Lấy danh sách user để đăng nhập
    await store.fetchPosts(); // Lấy danh sách bài viết hiển thị ra Home
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
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
        <router-link class="navbar-brand py-0" to="/">
            <img src="https://i.imgur.com/fr2DiX6.png" alt="Social" height="50">
        </router-link>

        <div class="input-group d-none d-md-flex" style="width: 240px;">
            <span class="input-group-text bg-light border-0 rounded-pill rounded-end-0">
                <i class="fas fa-search text-muted"></i>
            </span>
            <input type="text" class="form-control bg-light border-0 rounded-pill rounded-start-0 shadow-none" placeholder="Tìm kiếm...">
        </div>
       
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarContent">
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                <li class="nav-item px-2">
                    <router-link class="nav-link d-flex align-items-center" to="/" active-class="active-nav">
                        <i class="fas fa-home fs-5 me-2"></i> <span class="fw-semibold">Trang chủ</span>
                    </router-link>
                </li>
                
                <li class="nav-item px-2">
                    <router-link class="nav-link d-flex align-items-center" to="/friends" active-class="active-nav">
                        <i class="fas fa-user-friends fs-5 me-2"></i> <span class="fw-semibold">Bạn bè</span>
                    </router-link>
                </li>
                
                <li class="nav-item px-2">
                    <router-link class="nav-link d-flex align-items-center" to="/hotsearch" active-class="active-nav">
                        <i class="fas fa-fire fs-5 me-2"></i> <span class="fw-semibold">Tin nóng</span>
                    </router-link>
                </li>

                <li class="nav-item px-2">
                    <router-link class="nav-link d-flex align-items-center" to="/notifications" active-class="active-nav">
                        <i class="fas fa-bell fs-5 me-2"></i> <span class="fw-semibold">Thông báo</span>
                    </router-link>
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
                        <li>
                            <router-link class="dropdown-item" to="/profile">Thông tin cá nhân</router-link>
                        </li>
                        <li><hr class="dropdown-divider"></li>
                        <li><button class="dropdown-item text-danger" @click="handleLogout">Đăng xuất</button></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
  </nav>

  <div class="container-fluid p-0">
      <router-view></router-view>
  </div>
</template>

<style>
/* --- Giữ nguyên toàn bộ CSS cũ của bạn --- */
:root {
    --bg-body: #f0f2f5;
    --bg-card: #ffffff;
    --text-color: #050505;
    --text-muted: #65676b;
    --input-bg: #f0f2f5;
    --border-color: #dee2e6;
}

[data-bs-theme="dark"] {
    --bg-body: #18191a;
    --bg-card: #242526;
    --text-color: #e4e6eb;
    --text-muted: #b0b3b8;
    --input-bg: #3a3b3c;
    --border-color: #3e4042;
    --bs-body-bg: #18191a; 
}

body, .page-background, #app {
    background-color: var(--bg-body) !important;
    color: var(--text-color);
    transition: background-color 0.3s, color 0.3s;
}

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

/* CSS cho class active-nav của Router Link */
.active-nav { 
    color: var(--bs-primary) !important; 
    border-bottom: 3px solid var(--bs-primary); 
}

.nav-link { cursor: pointer; transition: all 0.2s; border-bottom: 3px solid transparent; }
.nav-link:hover { background-color: rgba(0,0,0,0.05); border-radius: 8px; }

.transition-navbar { transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out; }
.navbar-hidden { transform: translateY(-100%); opacity: 0; pointer-events: none; }
.navbar-visible { transform: translateY(0); opacity: 1; }

[data-bs-theme="dark"] .dropdown-menu { background-color: var(--bg-card); border-color: var(--border-color); }
[data-bs-theme="dark"] .dropdown-item { color: var(--text-color); }
[data-bs-theme="dark"] .dropdown-item:hover { background-color: #3a3b3c; }
</style>