<script setup>
import { reactive } from 'vue';
import { store } from '../store';

// Định nghĩa sự kiện để báo cho App.vue biết
const emit = defineEmits(['login-success', 'switch-register']);

const form = reactive({ email: '', password: '' });

const login = () => {
    const user = store.users.find(u => u.email === form.email && u.password === form.password);
    if (user) {
        store.currentUser = user;
        store.saveUser();
        // Thay vì router.push, ta báo hiệu thành công
        emit('login-success');
    } else {
        alert('Sai thông tin đăng nhập!');
    }
};
</script>

<template>
    <div class="row justify-content-center align-items-center min-vh-100 m-0 full-bg">
        <div class="col-md-5 col-lg-4">
            <div class="card shadow-lg border-0 p-4 glass-effect">
                <img src="https://i.imgur.com/fr2DiX6.png" alt="Logo" height="70" class="d-block mx-auto mb-3">
                <h2 class="text-center text-primary fw-bold mb-3">Đăng nhập</h2>
                <form @submit.prevent="login">
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Email</label>
                        <input v-model="form.email" type="email" class="form-control" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label fw-semibold">Mật khẩu</label>
                        <input v-model="form.password" type="password" class="form-control" required>
                    </div>
                    <button class="btn btn-primary w-100 fw-bold py-2">Đăng nhập</button>
                </form>
                <div class="text-center mt-3">
                    <a href="#" @click.prevent="emit('switch-register')" class="text-decoration-none">Chưa có tài khoản? Đăng ký ngay</a>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.full-bg {
    background-image: url('https://st.depositphotos.com/36924814/61254/i/450/depositphotos_612543668-stock-photo-abstract-line-blue-white-wave.jpg');
    background-size: cover; background-position: center; background-repeat: no-repeat;
    position: fixed; top: 0; left: 0; right: 0; bottom: 0; overflow-y: auto; z-index: 0; 
}
.glass-effect {
    background-color: rgba(255, 255, 255, 0.5); -webkit-backdrop-filter: blur(20px); backdrop-filter: blur(20px);
    border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.3); box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2) !important;
}
</style>