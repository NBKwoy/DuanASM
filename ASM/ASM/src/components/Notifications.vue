<script setup>
import { computed } from 'vue';
import { store } from '../store';

// Khai báo sự kiện bắn ra App.vue
const emit = defineEmits(['view-post']); 

const notifications = computed(() => store.currentUser.notifications || []);

const getUserName = (id) => store.users.find(u => u.id === id)?.name || 'Người dùng';
const getUserAvatar = (id) => store.users.find(u => u.id === id)?.avatar || store.defaultAvatar;
const formatDate = (iso) => new Date(iso).toLocaleString('vi-VN');

const getIcon = (type) => {
    if (type === 'friend_request') return { class: 'fas fa-user-plus', color: 'text-primary', bg: 'bg-primary-subtle' };
    if (type === 'reply') return { class: 'fas fa-reply', color: 'text-white', bg: 'bg-warning' };
    if (type === 'comment') return { class: 'fas fa-comment-alt', color: 'text-white', bg: 'bg-success' };
    if (type === 'like_comment' || type === 'like_post') return { class: 'fas fa-thumbs-up', color: 'text-white', bg: 'bg-primary' };
    return { class: 'fas fa-bell', color: 'text-secondary', bg: 'bg-light' };
};

// Xử lý khi click vào thông báo
const handleClickNotification = (noti) => {
    // Đánh dấu đã đọc
    noti.isRead = true;
    store.saveDB();

    // Nếu là thông báo liên quan đến bài viết (có postId)
    if (noti.postId) {
        // Bắn sự kiện ra ngoài kèm ID bài viết
        emit('view-post', noti.postId);
    }
};

// ... (Logic kết bạn giữ nguyên) ...
const handleFriendRequest = (noti, action) => { /* Code cũ giữ nguyên */ };
</script>

<template>
    <div class="container py-4" style="margin-top: -1.5rem;">
        <div class="card border-0 shadow-sm rounded-4">
             <div class="card-body">
                <div v-for="noti in notifications" :key="noti.id" 
                     @click="handleClickNotification(noti)"
                     class="d-flex align-items-center p-3 mb-2 rounded hover-bg position-relative border-bottom-light cursor-pointer"
                     :class="{ 'bg-light': !noti.isRead }">
                    
                    <div class="position-relative me-3">
                        <img :src="getUserAvatar(noti.fromId)" class="rounded-circle border object-fit-cover" width="60" height="60">
                        <div class="position-absolute bottom-0 end-0 rounded-circle d-flex align-items-center justify-content-center shadow-sm border border-2 border-white" 
                             :class="getIcon(noti.type).bg" style="width: 28px; height: 28px;">
                            <i :class="[getIcon(noti.type).class, getIcon(noti.type).color]" style="font-size: 12px;"></i>
                        </div>
                    </div>

                    <div class="flex-grow-1">
                        <p class="mb-1 text-dark" style="font-size: 0.95rem;">
                            <span class="fw-bold">{{ getUserName(noti.fromId) }}</span> 
                            {{ noti.content }}
                        </p>
                        <small class="text-primary fw-bold" style="font-size: 11px;">{{ formatDate(noti.timestamp) }}</small>
                        
                        <div v-if="noti.type === 'friend_request'" class="mt-2" @click.stop>
                            <button @click="handleFriendRequest(noti, 'accept')" class="btn btn-primary btn-sm px-4 fw-bold me-2">Chấp nhận</button>
                            <button @click="handleFriendRequest(noti, 'deny')" class="btn btn-light btn-sm px-4 fw-bold">Xóa</button>
                        </div>
                    </div>
                    <div v-if="!noti.isRead" class="bg-primary rounded-circle ms-2" style="width: 10px; height: 10px;"></div>
                </div>
             </div>
        </div>
    </div>
</template>

<style scoped>
.cursor-pointer { cursor: pointer; }
.hover-bg:hover { background-color: #f0f2f5; }
.border-bottom-light { border-bottom: 1px solid #f0f2f5; }
</style>