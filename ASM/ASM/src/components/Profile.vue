<script setup>
import { reactive } from 'vue';
import { store } from '../store';

// Dùng reactive để map dữ liệu từ store vào form
const form = reactive({ 
    name: store.currentUser.name, 
    avatar: store.currentUser.avatar,
    password: '' 
});

const updateProfile = () => {
    const idx = store.users.findIndex(u => u.id === store.currentUser.id);
    if (idx !== -1) {
        // Cập nhật dữ liệu vào mảng users chính
        store.users[idx].name = form.name;
        store.users[idx].avatar = form.avatar;
        
        // Chỉ cập nhật mật khẩu nếu người dùng nhập mới
        if(form.password) store.users[idx].password = form.password;
        
        // Cập nhật lại currentUser và lưu LocalStorage
        store.currentUser = store.users[idx];
        store.saveDB();
        store.saveUser();
        
        alert('Cập nhật thành công!');
        // Xóa ô password sau khi lưu xong cho an toàn
        form.password = '';
    }
};
</script>

<template>
    <div class="row justify-content-center pt-4">
        <div class="col-md-6">
            <div class="card shadow border-0 p-4 rounded-4">
                <h3 class="fw-bold mb-4 text-center text-primary">Thông tin cá nhân</h3>
                
                <div class="text-center mb-4">
                    <img :src="store.currentUser.avatar || store.defaultAvatar" class="rounded-circle border border-3 border-primary object-fit-cover shadow-sm" width="120" height="120">
                </div>

                <form @submit.prevent="updateProfile">
                    <div class="mb-3">
                        <label class="fw-bold form-label">Họ tên</label>
                        <input v-model="form.name" type="text" class="form-control" required>
                    </div>
                    
                    <div class="mb-3">
                        <label class="fw-bold form-label">Email (Không thể sửa)</label>
                        <input :value="store.currentUser.email" type="text" class="form-control bg-light" disabled>
                    </div>
                    
                    <div class="mb-3">
                        <label class="fw-bold form-label">URL Ảnh đại diện</label>
                        <input v-model="form.avatar" type="text" class="form-control" placeholder="https://...">
                        <small class="text-muted">Dán đường dẫn ảnh từ internet vào đây</small>
                    </div>
                    
                    <div class="mb-3">
                        <label class="fw-bold form-label">Đổi mật khẩu</label>
                        <input v-model="form.password" type="password" class="form-control" placeholder="Bỏ trống nếu không muốn đổi">
                    </div>
                    
                    <button class="btn btn-primary w-100 fw-bold py-2 mt-3 rounded-pill">Lưu thay đổi</button>
                </form>
            </div>
        </div>
    </div>
</template>