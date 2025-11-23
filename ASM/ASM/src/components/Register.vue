<script setup>
import { reactive } from 'vue';
import { store } from '../store';

// 1. Thay Router bằng Emit
const emit = defineEmits(['switch-login']);

const form = reactive({ name: '', email: '', password: '' });

const register = () => {
    // Validate cơ bản
    if (!form.name || !form.email || !form.password) {
        alert("Vui lòng nhập đầy đủ thông tin!"); return;
    }

    // Kiểm tra trùng email
    if (store.users.some(u => u.email === form.email)) {
        alert('Email đã tồn tại!'); return;
    }

    // 2. Tạo User mới (Cập nhật đủ trường dữ liệu để không bị lỗi ở trang Home)
    const newUser = { 
        id: Date.now(), 
        ...form, 
        avatar: store.defaultAvatar,
        cover: store.defaultCover, // Thêm ảnh bìa mặc định
        friends: [],
        friendRequests: [],
        notifications: []
    };

    store.users.push(newUser);
    store.saveDB();
    
    alert('Đăng ký thành công!');
    
    // 3. Chuyển về trang đăng nhập bằng emit
    emit('switch-login');
};
</script>

<template>
    <div class="row justify-content-center align-items-center min-vh-100 m-0 full-bg">
        <div class="col-md-5 col-lg-4">
            <div class="card shadow border-0 p-4 glass-effect">
                
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
                    <a href="#" @click.prevent="emit('switch-login')" class="text-decoration-none">Đã có tài khoản? Đăng nhập</a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Giữ nguyên CSS của bạn */
.full-bg {
    background-image: url('https://st.depositphotos.com/36924814/61254/i/450/depositphotos_612543668-stock-photo-abstract-line-blue-white-wave.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: fixed; 
    top: 0; left: 0; right: 0; bottom: 0;
    overflow-y: auto; 
    z-index: 0; 
}

.glass-effect {
    background-color: rgba(255, 255, 255, 0.5); 
    -webkit-backdrop-filter: blur(20px); 
    backdrop-filter: blur(20px);
    border-radius: 15px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2) !important;
}

.card.shadow-lg {
    box-shadow: none !important;
}
</style>