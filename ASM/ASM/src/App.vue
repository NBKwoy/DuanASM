<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { store } from './store'
import { ref } from 'vue' // Import ref để dùng cho ô tìm kiếm

const router = useRouter();
const searchQuery = ref(''); // Khởi tạo biến searchQuery

const handleLogout = () => {
    store.logout();
    router.push('/login'); 
}

const handleSearch = () => {
    if(searchQuery.value) {
        alert('Bạn đang tìm: ' + searchQuery.value);
    }
}
</script>

<template>
  <nav v-if="store.currentUser" class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top mb-4">
    <div class="container">
        <RouterLink class="navbar-brand py-0" to="/">
            <img src="https://i.imgur.com/fr2DiX6.png" alt="Social Internet" height="50">
        </RouterLink>

        <div class="input-group d-none d-md-flex" style="width: 240px;">
                <span class="input-group-text bg-light border-0 rounded-pill rounded-end-0">
                    <i class="fas fa-search text-muted"></i>
                </span>
                <input 
                    v-model="searchQuery" 
                    @keyup.enter="handleSearch"
                    type="text" 
                    class="form-control bg-light border-0 rounded-pill rounded-start-0 shadow-none" 
                    placeholder="Tìm kiếm..."
                >
            </div>
       
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarContent">
            
            <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                <li class="nav-item px-2">
                    <RouterLink class="nav-link d-flex align-items-center" to="/" active-class="active-nav">
                        <i class="fas fa-home fs-5 me-2"></i>
                        <span class="fw-semibold">Trang chủ</span>
                    </RouterLink>
                </li>
                <li class="nav-item px-2">
                    <RouterLink class="nav-link d-flex align-items-center" to="/friends" active-class="active-nav">
                        <i class="fas fa-user-friends fs-5 me-2"></i>
                        <span class="fw-semibold">Bạn bè</span>
                    </RouterLink>
                </li>
                <li class="nav-item px-2">
                    <RouterLink class="nav-link d-flex align-items-center" to="/notifications" active-class="active-nav">
                        <i class="fas fa-bell fs-5 me-2"></i>
                        <span class="fw-semibold">Thông báo</span>
                    </RouterLink>
                </li>
            </ul>

            <ul class="navbar-nav align-items-center">
                <li class="nav-item me-2 fw-bold d-none d-lg-block">{{ store.currentUser.name }}</li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        <img :src="store.currentUser.avatar || store.defaultAvatar" class="rounded-circle border object-fit-cover" width="40" height="40">
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end border-0 shadow">
                        <li><RouterLink class="dropdown-item" to="/profile">Thông tin cá nhân</RouterLink></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><button class="dropdown-item text-danger" @click="handleLogout">Đăng xuất</button></li>
                    </ul>
                </li>
            </ul>
        </div>
    </div>
  </nav>

  <div class="container">
    <RouterView />
  </div>
</template>

<style scoped>
/* Style riêng cho link đang active để nổi bật hơn */
.active-nav {
    color: var(--bs-primary) !important; /* Màu xanh của Bootstrap */
    border-bottom: 3px solid var(--bs-primary);
}

/* Hiệu ứng hover cho menu */
.nav-link {
    transition: all 0.2s;
    border-bottom: 3px solid transparent; /* Giữ chỗ để không bị nhảy layout */
}

.nav-link:hover {
    background-color: #f8f9fa;
    border-radius: 8px;
}
</style>