<script setup>
import { reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios'; // Import Axios để gọi API
import { store } from '../store';

const router = useRouter();
const form = reactive({ name: '', email: '', password: '' });
const API_URL = "http://localhost:3000/users"; // Đường dẫn API Users

const register = async () => {
    // 1. Kiểm tra dữ liệu đầu vào
    if (!form.name || !form.email || !form.password) {
        alert("Vui lòng nhập đầy đủ thông tin!"); 
        return;
    }

    // 2. Kiểm tra trùng Email (Dựa trên danh sách user đã tải về store)
    // Lưu ý: Đảm bảo store.fetchUsers() đã chạy ở App.vue
    if (store.users.some(u => u.email === form.email)) {
        alert('Email đã tồn tại!'); 
        return;
    }

    try {
        // 3. Chuẩn bị dữ liệu user mới
        const newUser = { 
            // Không cần id, json-server sẽ tự tạo
            name: form.name,
            email: form.email,
            password: form.password,
            avatar: store.defaultAvatar,
            cover: store.defaultCover,
            friends: [],
            friendRequests: [],
            notifications: []
        };

        // 4. GỬI REQUEST LÊN SERVER (QUAN TRỌNG)
        const response = await axios.post(API_URL, newUser);

        // 5. Nếu thành công, cập nhật store và chuyển trang
        if (response.status === 201) {
            // Thêm vào danh sách ở client để không cần load lại
            store.users.push(response.data); 
            
            alert('Đăng ký thành công!');
            router.push('/login'); // Chuyển sang trang đăng nhập
        }
    } catch (error) {
        console.error("Lỗi đăng ký:", error);
        alert("Có lỗi xảy ra khi kết nối Server!");
    }
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
                        <input v-model="form.name" type="text" class="form-control" placeholder="Nhập họ tên..." required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Email</label>
                        <input v-model="form.email" type="email" class="form-control" placeholder="example@email.com" required>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Mật khẩu</label>
                        <input v-model="form.password" type="password" class="form-control" placeholder="******" required>
                    </div>
                    <button type="submit" class="btn btn-primary w-100 fw-bold">Đăng ký</button>
                </form>

                <div class="text-center mt-3">
                    <router-link to="/login" class="text-decoration-none">Đã có tài khoản? Đăng nhập</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
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
</style>