<script setup>
import { computed } from 'vue';
import { store } from '../store-supabase';

const props = defineProps({
    post: { type: Object, default: null },
    show: { type: Boolean, default: false }
});

const emit = defineEmits(['close', 'like', 'share', 'add-comment']);

// Helper functions
const getUserName = (id) => store.users.find(u => u.id === id)?.name || 'Unknown';
const getUserAvatar = (id) => store.users.find(u => u.id === id)?.avatar || store.defaultAvatar;
const formatDate = (iso) => new Date(iso).toLocaleString('vi-VN');

const isLiked = computed(() => props.post && props.post.likes && props.post.likes.includes(store.currentUser.id));
</script>

<template>
    <div v-if="show && post" class="modal fade show d-block" tabindex="-1" @click.self="emit('close')" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content" @click.stop>
                <div class="modal-header border-0 pb-2">
                    <div class="d-flex align-items-center w-100">
                        <img :src="getUserAvatar(post.userId)" class="rounded-circle me-3 border object-fit-cover" width="50" height="50">
                        <div class="flex-grow-1">
                            <h6 class="fw-bold mb-0">{{ getUserName(post.userId) }}</h6>
                            <small class="text-muted">{{ formatDate(post.timestamp) }}</small>
                        </div>
                    </div>
                    <button type="button" class="btn-close" @click="emit('close')"></button>
                </div>
                <div class="modal-body">
                    <h5 v-if="post.title && post.title !== 'Chia sẻ mới'" class="fw-bold mb-3">{{ post.title }}</h5>
                    <p class="mb-3" style="white-space: pre-line; font-size: 1.1rem;">{{ post.content }}</p>
                    <div v-if="post.image" class="mb-4">
                        <img :src="post.image" class="img-fluid rounded-3 w-100" style="max-height: 500px; object-fit: contain;">
                    </div>
                    <div class="d-flex justify-content-between text-muted border-top border-bottom py-3 my-3">
                        <button @click="emit('like', post)" class="btn flex-grow-1 border-0 fw-bold" :class="isLiked ? 'text-primary' : 'text-muted'">
                            <i class="fas fa-thumbs-up me-2"></i>{{ post.likes?.length || 0 }} Thích
                        </button>
                        <button class="btn btn-light flex-grow-1 border-0 text-muted fw-bold">
                            <i class="far fa-comment-alt me-2"></i>{{ post.comments?.length || 0 }} Bình luận
                        </button>
                        <button @click="emit('share', post)" class="btn btn-light flex-grow-1 border-0 text-muted fw-bold">
                            <i class="fas fa-share me-2"></i>{{ post.shares || 0 }} Chia sẻ
                        </button>
                    </div>
                    <div class="mb-3">
                        <h6 class="fw-bold mb-3">Bình luận ({{ post.comments?.length || 0 }})</h6>
                        <div v-if="post.comments && post.comments.length > 0">
                            <div v-for="cmt in post.comments" :key="cmt.id" class="mb-3 pb-3 border-bottom">
                                <div class="d-flex">
                                    <img :src="getUserAvatar(cmt.userId)" class="rounded-circle me-2 object-fit-cover" width="40" height="40">
                                    <div class="flex-grow-1">
                                        <div class="bg-light rounded-3 p-3">
                                            <span class="fw-bold me-2">{{ getUserName(cmt.userId) }}</span>
                                            <span>{{ cmt.content }}</span>
                                        </div>
                                        <small class="text-muted d-block mt-2">{{ formatDate(cmt.timestamp) }}</small>
                                        <div v-if="cmt.replies && cmt.replies.length > 0" class="mt-3 ms-3 ps-3 border-start border-2">
                                            <div v-for="reply in cmt.replies" :key="reply.id" class="mb-2">
                                                <div class="d-flex">
                                                    <img :src="getUserAvatar(reply.userId)" class="rounded-circle me-2 object-fit-cover" width="32" height="32">
                                                    <div class="bg-light rounded-3 p-2 flex-grow-1">
                                                        <span class="fw-bold me-2">{{ getUserName(reply.userId) }}</span>
                                                        <span>{{ reply.content }}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-else class="text-center text-muted py-4">
                            <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center mt-4">
                        <img :src="store.currentUser.avatar || store.defaultAvatar" class="rounded-circle me-2 object-fit-cover" width="40" height="40">
                        <div class="input-group flex-grow-1">
                            <input v-model="post.newComment" @keyup.enter="emit('add-comment', post)" class="form-control rounded-pill bg-light border-0 px-3" placeholder="Viết bình luận...">
                            <button @click="emit('add-comment', post)" class="btn btn-primary rounded-pill px-4"><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
