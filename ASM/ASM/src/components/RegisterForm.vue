<script setup>
import { reactive } from 'vue';
import { store } from '../store-supabase';

const emit = defineEmits(['register-success']);

const form = reactive({ name: '', email: '', password: '' });

const register = () => {
    if (!form.name || !form.name.trim()) {
        alert('Vui lòng nhập họ tên!');
        return;
    }
    if (!form.email || !form.email.trim()) {
        alert('Vui lòng nhập email!');
        return;
    }
    if (!form.email.includes('@')) {
        alert('Email không hợp lệ!');
        return;
    }
    if (!form.password || form.password.length < 3) {
        alert('Mật khẩu phải có ít nhất 3 ký tự!');
        return;
    }
    
    if (store.users.some(u => u.email === form.email)) {
        alert('Email đã tồn tại!');
        return;
    }
    
    const newUser = { 
        id: Date.now(), 
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        avatar: store.defaultAvatar,
        friends: [],
        friendRequests: [],
        notifications: []
    };
    store.users.push(newUser);
    store.saveDB();
    alert('Đăng ký thành công!');
    emit('register-success');
};
</script>

<template>
    <div class="row justify-content-center align-items-center min-vh-100 m-0" style="background-image: url('https://st.depositphotos.com/36924814/61254/i/450/depositphotos_612543668-stock-photo-abstract-line-blue-white-wave.jpg'); background-size: cover; background-position: center; position: fixed; top: 0; left: 0; right: 0; bottom: 0; overflow-y: auto;">
        <div class="col-md-5 col-lg-4">
            <div class="card shadow border-0 p-4" style="background-color: rgba(255, 255, 255, 0.5); backdrop-filter: blur(20px); border-radius: 15px;">
                <img src="https://i.imgur.com/fr2DiX6.png" alt="Logo" height="70" class="d-block mx-auto mb-3">
                <h2 class="text-center text-primary fw-bold mb-3">Đăng ký</h2>
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
                    <button class="btn btn-primary w-100 fw-bold">Đăng ký</button>
                </form>
                <div class="text-center mt-3">
                    <button @click="$emit('show-login')" class="btn btn-link text-decoration-none p-0">Đã có tài khoản? Đăng nhập</button>
                </div>
            </div>
        </div>
    </div>
</template>

