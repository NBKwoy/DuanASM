<script setup>
import { computed } from 'vue';
import { store } from '../store';

const props = defineProps({
    post: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['like', 'share', 'delete', 'edit', 'save-edit', 'add-comment']);

const getUserName = (id) => store.users.find(u => u.id === id)?.name || 'Unknown';
const getUserAvatar = (id) => store.users.find(u => u.id === id)?.avatar || store.defaultAvatar;
const formatDate = (iso) => new Date(iso).toLocaleString('vi-VN');

const isLiked = computed(() => props.post.likes && props.post.likes.includes(store.currentUser.id));
</script>

<template>
    <div class="card shadow-sm border-0 mb-4 rounded-4">
        <div class="card-body p-4">
            <div class="d-flex justify-content-between align-items-start">
                <div class="d-flex align-items-center mb-3">
                    <img :src="getUserAvatar(post.userId)" class="rounded-circle me-3 border object-fit-cover" width="45" height="45">
                    <div>
                        <div class="fw-bold text-dark">{{ getUserName(post.userId) }}</div>
                        <small class="text-muted" style="font-size: 12px;">{{ formatDate(post.timestamp) }} <i class="fas fa-globe-asia ms-1"></i></small>
                    </div>
                </div>
                <div v-if="post.userId === store.currentUser.id" class="dropdown">
                    <button class="btn btn-light btn-sm rounded-circle" data-bs-toggle="dropdown">
                        <i class="fas fa-ellipsis-h"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                        <li><button class="dropdown-item" @click="$emit('edit', post)">Chỉnh sửa</button></li>
                        <li><button class="dropdown-item text-danger" @click="$emit('delete', post.id)">Xóa</button></li>
                    </ul>
                </div>
            </div>

            <div v-if="post.isEditing">
                <input v-model="post.tempTitle" class="form-control mb-2 fw-bold">
                <textarea v-model="post.tempContent" class="form-control mb-2" rows="3"></textarea>
                <div class="d-flex justify-content-end">
                    <button @click="$emit('save-edit', post)" class="btn btn-success btn-sm me-2">Lưu</button>
                    <button @click="post.isEditing = false" class="btn btn-secondary btn-sm">Hủy</button>
                </div>
            </div>
            <div v-else>
                <h5 v-if="post.title && post.title !== 'Chia sẻ mới'" class="card-title fw-bold mb-2">{{ post.title }}</h5>
                <p class="card-text mb-3" style="white-space: pre-line;">{{ post.content }}</p>
                <div v-if="post.image" class="rounded-3 overflow-hidden mb-3 bg-light border d-flex justify-content-center">
                    <img :src="post.image" class="img-fluid" style="max-height: 500px;">
                </div>
            </div>

            <div class="d-flex justify-content-between text-muted border-top border-bottom py-2 my-3">
                <button @click="$emit('like', post)" class="btn flex-grow-1 border-0 fw-bold transition-btn" :class="isLiked ? 'text-primary' : 'text-muted'">
                    <i class="fas fa-thumbs-up me-2"></i>{{ post.likes?.length || 0 }} Thích
                </button>
                <button class="btn btn-light flex-grow-1 border-0 text-muted transition-btn">
                    <i class="far fa-comment-alt me-2"></i>Bình luận
                </button>
                <button @click="$emit('share', post)" class="btn btn-light flex-grow-1 border-0 text-muted transition-btn">
                    <i class="fas fa-share me-2"></i>{{ post.shares || 0 }} Chia sẻ
                </button>
            </div>

            <slot name="comments"></slot>

            <div class="d-flex mt-3 align-items-center">
                <img :src="store.currentUser.avatar || store.defaultAvatar" class="rounded-circle me-2 object-fit-cover" width="32" height="32">
                <div class="input-group">
                    <input 
                        v-model="post.newComment" 
                        @keyup.enter="$emit('add-comment', post)" 
                        class="form-control rounded-pill bg-light border-0 px-3" 
                        placeholder="Viết bình luận công khai...">
                    <button @click="$emit('add-comment', post)" class="btn btn-link text-primary position-absolute end-0 z-3 text-decoration-none fw-bold" style="font-size: 14px;">Gửi</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.transition-btn:hover {
    background-color: #e4e6eb;
}
</style>

