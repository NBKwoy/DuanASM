<script setup>
import { reactive } from 'vue';
import { store } from '../store-supabase';

const form = reactive({ 
    name: store.currentUser.name, 
    avatar: store.currentUser.avatar,
    password: '' 
});

const updateProfile = () => {
    const idx = store.users.findIndex(u => u.id === store.currentUser.id);
    if (idx !== -1) {
        store.users[idx].name = form.name;
        store.users[idx].avatar = form.avatar;
        if(form.password) store.users[idx].password = form.password;
        
        store.currentUser = store.users[idx];
        store.saveDB();
        store.saveUser();
        alert('Cập nhật thành công!');
    }
};
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow border-0 p-4">
                <h3 class="fw-bold mb-4">Thông tin cá nhân</h3>
                <div class="text-center mb-4">
                    <img :src="store.currentUser.avatar || store.defaultAvatar" class="rounded-circle border border-3 border-primary object-fit-cover" width="100" height="100">
                </div>
                <form @submit.prevent="updateProfile">
                    <div class="mb-3">
                        <label class="fw-bold">Họ tên</label>
                        <input v-model="form.name" type="text" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label class="fw-bold">Email (Không thể sửa)</label>
                        <input :value="store.currentUser.email" type="text" class="form-control" disabled>
                    </div>
                    <div class="mb-3">
                        <label class="fw-bold">URL Ảnh đại diện</label>
                        <input v-model="form.avatar" type="text" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label class="fw-bold">Mật khẩu mới</label>
                        <input v-model="form.password" type="password" class="form-control" placeholder="Bỏ trống nếu không đổi">
                    </div>
                    <button class="btn btn-primary w-100 fw-bold">Lưu thay đổi</button>
                </form>
            </div>
        </div>
    </div>
</template>

