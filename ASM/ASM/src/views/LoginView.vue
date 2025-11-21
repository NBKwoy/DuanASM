<script setup>
import { reactive } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { store } from '../store';

const router = useRouter();
const form = reactive({ email: '', password: '' });

const login = () => {
    const user = store.users.find(u => u.email === form.email && u.password === form.password);
    if (user) {
        store.currentUser = user;
        store.saveUser();
        router.push('/');
    } else {
        alert('Sai thông tin đăng nhập!');
    }
};
</script>

<template>
    <div class="row justify-content-center min-vh-100 align-items-center bg-light">
        <div class="col-md-5 col-lg-4">
            <div class="card shadow border-0 p-4">
                <h2 class="text-center text-primary fw-bold mb-3">Đăng nhập</h2>
                <form @submit.prevent="login">
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input v-model="form.email" type="email" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Mật khẩu</label>
                        <input v-model="form.password" type="password" class="form-control" required>
                    </div>
                    <button class="btn btn-primary w-100 fw-bold">Đăng nhập</button>
                </form>
                <div class="text-center mt-3">
                    <RouterLink to="/register">Chưa có tài khoản? Đăng ký ngay</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>