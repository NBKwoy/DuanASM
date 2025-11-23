<script setup>
import { computed } from 'vue';
import { store } from '../store-supabase';

// Lấy danh sách bạn bè
const myFriends = computed(() => {
    const friendIds = store.currentUser.friends || [];
    return store.users.filter(u => friendIds.includes(u.id));
});

// Lấy danh sách lời mời đang chờ
const pendingRequests = computed(() => {
    const reqIds = store.currentUser.friendRequests || [];
    return store.users.filter(u => reqIds.includes(u.id));
});

const unfriend = (id) => {
    if(confirm('Hủy kết bạn với người này?')) {
        const me = store.users.find(u => u.id === store.currentUser.id);
        const other = store.users.find(u => u.id === id);

        me.friends = me.friends.filter(fid => fid !== id);
        if(other.friends) other.friends = other.friends.filter(fid => fid !== me.id);

        store.currentUser = me;
        store.saveDB();
        store.saveUser();
    }
}
</script>

<template>
    <div class="container py-4" style="margin-top: -1.5rem;">
        <div v-if="pendingRequests.length > 0" class="mb-4">
            <h5 class="fw-bold mb-3">Lời mời kết bạn ({{ pendingRequests.length }})</h5>
            <div class="row row-cols-1 row-cols-md-2 g-3">
                <div v-for="user in pendingRequests" :key="user.id" class="col">
                    <div class="card border-0 shadow-sm rounded-3">
                        <div class="card-body d-flex align-items-center">
                            <img :src="user.avatar" class="rounded-circle border me-3 object-fit-cover" width="80" height="80">
                            <div class="w-100">
                                <h6 class="fw-bold">{{ user.name }}</h6>
                                <div class="d-flex mt-2">
                                    <button @click="$emit('show-notifications')" class="btn btn-primary btn-sm w-100 fw-bold">Xem & Phản hồi</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="my-4">
        </div>

        <h5 class="fw-bold mb-3">Bạn bè ({{ myFriends.length }})</h5>
        <div class="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3">
            <div v-for="friend in myFriends" :key="friend.id" class="col">
                <div class="card h-100 border-0 shadow-sm rounded-4 text-center p-3">
                    <div class="mb-3">
                        <img :src="friend.avatar" class="rounded-circle border shadow-sm object-fit-cover" width="100" height="100">
                    </div>
                    <h6 class="fw-bold mb-1">{{ friend.name }}</h6>
                    <p class="text-muted small">Bạn bè</p>
                    <button @click="unfriend(friend.id)" class="btn btn-light btn-sm text-danger fw-bold w-100 mt-auto">Hủy kết bạn</button>
                </div>
            </div>
        </div>

        <div v-if="myFriends.length === 0" class="text-center py-5 text-muted">
            <i class="fas fa-user-friends fs-1 mb-3"></i>
            <p>Chưa có bạn bè nào. Hãy đi kết bạn nhé!</p>
        </div>
    </div>
</template>

