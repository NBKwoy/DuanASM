<script setup>
import { reactive } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import { store } from '../store';

const router = useRouter();
const form = reactive({ name: '', email: '', password: '' });

const register = () => {
    if (store.users.some(u => u.email === form.email)) {
        alert('Email đã tồn tại!'); return;
    }
    const newUser = { id: Date.now(), ...form, avatar: store.defaultAvatar };
    store.users.push(newUser);
    store.saveDB();
    alert('Đăng ký thành công!');
    router.push('/login');
};
</script>

<template>
    <div class="row justify-content-center min-vh-100 align-items-center bg-light">
        <div class="col-md-5 col-lg-4">
            <div class="card shadow border-0 p-4">
                <h2 class="text-center text-success fw-bold mb-3">Đăng ký</h2>
                <form @submit.prevent="register">
                    <div class="mb-3">
                        <label class="form-label">Họ tên</label>
                        <input v-model="form.name" type="text" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input v-model="form.email" type="email" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Mật khẩu</label>
                        <input v-model="form.password" type="password" class="form-control" required>
                    </div>
                    <button class="btn btn-success w-100 fw-bold">Đăng ký</button>
                </form>
                <div class="text-center mt-3">
                    <RouterLink to="/login">Đã có tài khoản? Đăng nhập</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>