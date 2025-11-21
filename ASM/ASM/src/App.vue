<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { store } from './store'

const router = useRouter();

const handleLogout = () => {
    store.logout();
    router.push('/login');
}
</script>

<template>
  <!-- Navbar chỉ hiện khi đã đăng nhập -->
  <nav v-if="store.currentUser" class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top mb-4">
    <div class="container">
        <RouterLink class="navbar-brand text-primary fw-bold fs-3" to="/">PolyBlog</RouterLink>
        
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-end" id="navbarContent">
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