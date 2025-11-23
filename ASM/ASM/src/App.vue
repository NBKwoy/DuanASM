<script setup>
import { ref, computed } from 'vue';
import { store } from './store-supabase';
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';
import HomePage from './components/HomePage.vue';
import HotPage from './components/HotPage.vue';
import ProfileForm from './components/ProfileForm.vue';
import FriendsList from './components/FriendsList.vue';
import NotificationsList from './components/NotificationsList.vue';

// Quản lý trang hiện tại: 'login', 'register', 'home', 'hot', 'profile', 'friends', 'notifications'
const currentPage = ref('login');
const searchQuery = ref('');

// Nếu đã đăng nhập thì chuyển về trang chủ
if (store.currentUser) {
    currentPage.value = 'home';
}

// Xử lý đăng nhập thành công
const handleLoginSuccess = () => {
    currentPage.value = 'home';
};

// Xử lý đăng ký thành công
const handleRegisterSuccess = () => {
    currentPage.value = 'login';
};

// Xử lý đăng xuất
const handleLogout = () => {
    store.logout();
    currentPage.value = 'login';
};

// Xử lý tìm kiếm
const handleSearch = () => {
    if (searchQuery.value) {
        alert('Bạn đang tìm: ' + searchQuery.value);
    }
};

// Chuyển trang
const navigateTo = (page) => {
    currentPage.value = page;
};
</script>

<template>
    <!-- Trang đăng nhập -->
    <LoginForm v-if="currentPage === 'login'" @login-success="handleLoginSuccess" @show-register="navigateTo('register')" />

    <!-- Trang đăng ký -->
    <RegisterForm v-else-if="currentPage === 'register'" @register-success="handleRegisterSuccess" @show-login="navigateTo('login')" />

    <!-- Các trang sau khi đăng nhập -->
    <template v-else>
        <!-- Navigation Bar -->
        <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top mb-4">
            <div class="container">
                <button @click="navigateTo('home')" class="navbar-brand py-0 btn btn-link p-0 border-0">
                    <img src="https://i.imgur.com/fr2DiX6.png" alt="Social Internet" height="50">
                </button>

                <div class="input-group d-none d-md-flex" style="width: 240px;">
                    <span class="input-group-text bg-light border-0 rounded-pill rounded-end-0">
                        <i class="fas fa-search text-muted"></i>
                    </span>
                    <input 
                        v-model="searchQuery" 
                        @keyup.enter="handleSearch"
                        type="text" 
                        class="form-control bg-light border-0 rounded-pill rounded-start-0 shadow-none" 
                        placeholder="Tìm kiếm...">
                </div>

                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarContent">
                    <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                        <li class="nav-item px-2">
                            <button @click="navigateTo('home')" class="nav-link d-flex align-items-center btn btn-link border-0 p-2" :class="currentPage === 'home' ? 'text-primary fw-bold' : 'text-dark'">
                                <i class="fas fa-home fs-5 me-2"></i>
                                <span class="fw-semibold">Trang chủ</span>
                            </button>
                        </li>
                        <li class="nav-item px-2">
                            <button @click="navigateTo('hot')" class="nav-link d-flex align-items-center btn btn-link border-0 p-2" :class="currentPage === 'hot' ? 'text-primary fw-bold' : 'text-dark'">
                                <i class="fas fa-fire fs-5 me-2 text-danger"></i>
                                <span class="fw-semibold">Hot</span>
                            </button>
                        </li>
                        <li class="nav-item px-2">
                            <button @click="navigateTo('friends')" class="nav-link d-flex align-items-center btn btn-link border-0 p-2" :class="currentPage === 'friends' ? 'text-primary fw-bold' : 'text-dark'">
                                <i class="fas fa-user-friends fs-5 me-2"></i>
                                <span class="fw-semibold">Bạn bè</span>
                            </button>
                        </li>
                        <li class="nav-item px-2">
                            <button @click="navigateTo('notifications')" class="nav-link d-flex align-items-center btn btn-link border-0 p-2" :class="currentPage === 'notifications' ? 'text-primary fw-bold' : 'text-dark'">
                                <i class="fas fa-bell fs-5 me-2"></i>
                                <span class="fw-semibold">Thông báo</span>
                            </button>
                        </li>
                    </ul>

                    <ul class="navbar-nav align-items-center">
                        <li class="nav-item me-2 fw-bold d-none d-lg-block">{{ store.currentUser.name }}</li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                                <img :src="store.currentUser.avatar || store.defaultAvatar" class="rounded-circle border object-fit-cover" width="40" height="40">
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end border-0 shadow">
                                <li><button @click="navigateTo('profile')" class="dropdown-item">Thông tin cá nhân</button></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><button @click="handleLogout" class="dropdown-item text-danger">Đăng xuất</button></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <!-- Nội dung trang -->
        <div class="container">
            <HomePage v-if="currentPage === 'home'" />
            <HotPage v-else-if="currentPage === 'hot'" />
            <ProfileForm v-else-if="currentPage === 'profile'" />
            <FriendsList v-else-if="currentPage === 'friends'" @show-notifications="navigateTo('notifications')" />
            <NotificationsList v-else-if="currentPage === 'notifications'" />
        </div>
    </template>
</template>
