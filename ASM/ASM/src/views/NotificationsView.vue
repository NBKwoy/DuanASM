<script setup>
import { computed } from 'vue';
import { store } from '../store';

// Lấy danh sách thông báo của user hiện tại
const notifications = computed(() => {
    return store.currentUser.notifications || [];
});

// Helpers
const getUserName = (id) => store.users.find(u => u.id === id)?.name || 'Người dùng';
const getUserAvatar = (id) => store.users.find(u => u.id === id)?.avatar || store.defaultAvatar;
const formatDate = (iso) => new Date(iso).toLocaleString('vi-VN');

// XỬ LÝ KẾT BẠN
const handleFriendRequest = (noti, action) => {
    const myId = store.currentUser.id;
    const partnerId = noti.fromId;

    const me = store.users.find(u => u.id === myId);
    const partner = store.users.find(u => u.id === partnerId);

    if (action === 'accept') {
        // 1. Thêm bạn cho cả 2
        if (!me.friends) me.friends = [];
        if (!partner.friends) partner.friends = [];
        
        me.friends.push(partnerId);
        partner.friends.push(myId);
        
        alert(`Đã chấp nhận kết bạn với ${partner.name}`);
    } else {
        alert('Đã từ chối lời mời.');
    }

    // 2. Xóa lời mời trong danh sách chờ của mình
    if (me.friendRequests) {
        me.friendRequests = me.friendRequests.filter(id => id !== partnerId);
    }

    // 3. Xóa thông báo này đi (hoặc đánh dấu đã xử lý)
    me.notifications = me.notifications.filter(n => n.id !== noti.id);

    // 4. Cập nhật store
    store.currentUser = me; 
    store.saveDB();
    store.saveUser();
};
</script>

<template>
    <div class="container py-4" style="margin-top: -1.5rem;">
        <div class="row justify-content-center">
            <div class="col-lg-8">
                <div class="card border-0 shadow-sm rounded-4">
                    <div class="card-header bg-white border-0 pt-3 pb-0">
                        <h4 class="fw-bold">Thông báo</h4>
                    </div>
                    <div class="card-body">
                        <div v-if="notifications.length === 0" class="text-center py-5 text-muted">
                            <i class="fas fa-bell-slash fs-1 mb-3"></i>
                            <p>Bạn không có thông báo nào mới.</p>
                        </div>

                        <div v-for="noti in notifications" :key="noti.id" class="d-flex align-items-start p-3 mb-2 rounded hover-bg">
                            <img :src="getUserAvatar(noti.fromId)" class="rounded-circle border object-fit-cover me-3" width="60" height="60">
                            <div class="flex-grow-1">
                                <p class="mb-1">
                                    <span class="fw-bold">{{ getUserName(noti.fromId) }}</span> 
                                    {{ noti.content }}
                                </p>
                                <small class="text-muted d-block mb-2">{{ formatDate(noti.timestamp) }}</small>

                                <div v-if="noti.type === 'friend_request'">
                                    <button @click="handleFriendRequest(noti, 'accept')" class="btn btn-primary btn-sm px-4 fw-bold me-2">Chấp nhận</button>
                                    <button @click="handleFriendRequest(noti, 'deny')" class="btn btn-light btn-sm px-4 fw-bold">Từ chối</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.hover-bg:hover { background-color: #f8f9fa; }
</style>