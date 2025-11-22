<script setup>
import { computed, ref } from 'vue';
import { store } from '../store';
import PostModal from '../components/PostModal.vue';

const selectedPost = ref(null);
const showModal = ref(false);

// Sắp xếp bài viết theo số lượng like (nhiều nhất trước)
const hotPosts = computed(() => {
    return [...store.posts]
        .filter(post => post.likes && post.likes.length > 0)
        .sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0));
});

// Helpers
const getUserName = (id) => store.users.find(u => u.id === id)?.name || 'Unknown';
const getUserAvatar = (id) => store.users.find(u => u.id === id)?.avatar || store.defaultAvatar;
const formatDate = (iso) => new Date(iso).toLocaleString('vi-VN');

// Mở modal khi click vào bài viết
const openPostModal = (post) => {
    selectedPost.value = { ...post };
    showModal.value = true;
};

// Đóng modal
const closeModal = () => {
    showModal.value = false;
    selectedPost.value = null;
};

// Like/Unlike
const toggleLike = (post) => {
    if (!post.likes) post.likes = [];
    const idx = post.likes.indexOf(store.currentUser.id);
    if (idx === -1) {
        post.likes.push(store.currentUser.id);
    } else {
        post.likes.splice(idx, 1);
    }
    
    // Cập nhật trong store
    const storePost = store.posts.find(p => p.id === post.id);
    if (storePost) {
        storePost.likes = post.likes;
    }
    
    // Cập nhật selectedPost nếu đang mở modal
    if (selectedPost.value && selectedPost.value.id === post.id) {
        selectedPost.value.likes = post.likes;
    }
    
    store.saveDB();
};

// Share
const handleShare = (post) => {
    if (!post.shares) post.shares = 0;
    post.shares++;
    
    const storePost = store.posts.find(p => p.id === post.id);
    if (storePost) {
        storePost.shares = post.shares;
    }
    
    if (selectedPost.value && selectedPost.value.id === post.id) {
        selectedPost.value.shares = post.shares;
    }
    
    store.saveDB();
    alert('Đã chia sẻ!');
};

// Thêm bình luận
const addComment = (post) => {
    if (!post.newComment) return;
    if (!post.comments) post.comments = [];
    
    post.comments.push({
        id: Date.now(),
        userId: store.currentUser.id,
        content: post.newComment,
        timestamp: new Date().toISOString(),
        replies: []
    });
    
    post.newComment = '';
    
    // Cập nhật trong store
    const storePost = store.posts.find(p => p.id === post.id);
    if (storePost) {
        storePost.comments = post.comments;
    }
    
    // Cập nhật selectedPost
    if (selectedPost.value && selectedPost.value.id === post.id) {
        selectedPost.value.comments = post.comments;
    }
    
    store.saveDB();
};
</script>

<template>
    <div class="py-4" style="background-color: #f0f2f5; min-height: 100vh; margin-top: -1.5rem;">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card border-0 shadow-sm mb-4 rounded-4">
                        <div class="card-body p-4">
                            <h3 class="fw-bold mb-0">
                                <i class="fas fa-fire text-danger me-2"></i>
                                Bài viết Hot
                            </h3>
                            <p class="text-muted mb-0 mt-2">Các bài viết được yêu thích nhất</p>
                        </div>
                    </div>

                    <div v-if="hotPosts.length === 0" class="card border-0 shadow-sm rounded-4">
                        <div class="card-body p-5 text-center">
                            <i class="fas fa-fire fs-1 text-muted mb-3"></i>
                            <p class="text-muted">Chưa có bài viết nào được like. Hãy like các bài viết để chúng xuất hiện ở đây!</p>
                        </div>
                    </div>

                    <div v-for="post in hotPosts" :key="post.id" class="card border-0 shadow-sm mb-4 rounded-4" style="cursor: pointer;" @click="openPostModal(post)">
                        <div class="card-body p-4">
                            <div class="d-flex align-items-center mb-3">
                                <img :src="getUserAvatar(post.userId)" class="rounded-circle me-3 border object-fit-cover" width="50" height="50">
                                <div class="flex-grow-1">
                                    <h6 class="fw-bold mb-0">{{ getUserName(post.userId) }}</h6>
                                    <small class="text-muted">{{ formatDate(post.timestamp) }}</small>
                                </div>
                                <div class="badge bg-danger rounded-pill px-3 py-2">
                                    <i class="fas fa-fire me-1"></i>{{ post.likes?.length || 0 }} Likes
                                </div>
                            </div>

                            <h5 v-if="post.title && post.title !== 'Chia sẻ mới'" class="fw-bold mb-3">{{ post.title }}</h5>
                            <p class="mb-3" style="white-space: pre-line;">{{ post.content }}</p>
                            
                            <div v-if="post.image" class="mb-3">
                                <img :src="post.image" class="img-fluid rounded-3 w-100" style="max-height: 400px; object-fit: cover;">
                            </div>

                            <div class="d-flex justify-content-between text-muted border-top pt-3">
                                <span>
                                    <i class="fas fa-thumbs-up text-primary me-1"></i>
                                    {{ post.likes?.length || 0 }} Thích
                                </span>
                                <span>
                                    <i class="far fa-comment-alt me-1"></i>
                                    {{ post.comments?.length || 0 }} Bình luận
                                </span>
                                <span>
                                    <i class="fas fa-share me-1"></i>
                                    {{ post.shares || 0 }} Chia sẻ
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Post Modal -->
        <PostModal 
            :post="selectedPost" 
            :show="showModal"
            @close="closeModal"
            @like="toggleLike"
            @share="handleShare"
            @add-comment="addComment"
        />
    </div>
</template>

