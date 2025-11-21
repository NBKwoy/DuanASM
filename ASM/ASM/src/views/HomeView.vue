<script setup>
import { reactive, computed } from 'vue';
import { store } from '../store';

const newPost = reactive({ title: '', content: '', image: '' });

// Sắp xếp bài viết mới nhất lên đầu
const sortedPosts = computed(() => {
    return [...store.posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});

// Helpers
const getUserName = (id) => store.users.find(u => u.id === id)?.name || 'Unknown';
const getUserAvatar = (id) => store.users.find(u => u.id === id)?.avatar || store.defaultAvatar;
const formatDate = (iso) => new Date(iso).toLocaleString('vi-VN');

// Actions
const createPost = () => {
    store.posts.unshift({
        id: Date.now(),
        userId: store.currentUser.id,
        title: newPost.title,
        content: newPost.content,
        image: newPost.image,
        timestamp: new Date().toISOString(),
        comments: [],
        likes: [],
        isEditing: false
    });
    newPost.title = ''; newPost.content = ''; newPost.image = '';
    store.saveDB();
};

const deletePost = (id) => {
    if(confirm('Xóa bài viết này?')) {
        store.posts = store.posts.filter(p => p.id !== id);
        store.saveDB();
    }
};

const editPost = (post) => {
    post.isEditing = true;
    post.tempTitle = post.title;
    post.tempContent = post.content;
};

const saveEdit = (post) => {
    post.title = post.tempTitle;
    post.content = post.tempContent;
    post.isEditing = false;
    store.saveDB();
};

const addComment = (post) => {
    if(!post.newComment) return;
    if(!post.comments) post.comments = [];
    post.comments.push({
        id: Date.now(),
        userId: store.currentUser.id,
        content: post.newComment,
        timestamp: new Date().toISOString()
    });
    post.newComment = '';
    store.saveDB();
};
</script>

<template>
    <div class="row justify-content-center">
        <div class="col-lg-8">
            <!-- Form Đăng bài -->
            <div class="card shadow-sm border-0 mb-4">
                <div class="card-body">
                    <h5 class="fw-bold mb-3">Tạo bài viết mới</h5>
                    <input v-model="newPost.title" class="form-control mb-2 fw-bold" placeholder="Tiêu đề bài viết...">
                    <textarea v-model="newPost.content" class="form-control mb-2" rows="3" placeholder="Nội dung bài viết..."></textarea>
                    <input v-model="newPost.image" class="form-control form-control-sm mb-2" placeholder="URL hình ảnh (tùy chọn)...">
                    <div class="d-flex justify-content-end">
                        <button @click="createPost" class="btn btn-primary fw-bold" :disabled="!newPost.title || !newPost.content">Đăng bài</button>
                    </div>
                </div>
            </div>

            <!-- List Bài Viết -->
            <div v-for="post in sortedPosts" :key="post.id" class="card shadow-sm border-0 mb-4">
                <div class="card-body">
                    <!-- Header bài viết -->
                    <div class="d-flex justify-content-between">
                        <div class="d-flex align-items-center mb-2">
                            <img :src="getUserAvatar(post.userId)" class="rounded-circle me-2 border object-fit-cover" width="45" height="45">
                            <div>
                                <div class="fw-bold">{{ getUserName(post.userId) }}</div>
                                <small class="text-muted">{{ formatDate(post.timestamp) }}</small>
                            </div>
                        </div>
                        <div v-if="post.userId === store.currentUser.id" class="dropdown">
                            <button class="btn btn-light btn-sm rounded-circle" data-bs-toggle="dropdown"><i class="fas fa-ellipsis-h"></i></button>
                            <ul class="dropdown-menu dropdown-menu-end shadow border-0">
                                <li><button class="dropdown-item" @click="editPost(post)">Chỉnh sửa</button></li>
                                <li><button class="dropdown-item text-danger" @click="deletePost(post.id)">Xóa</button></li>
                            </ul>
                        </div>
                    </div>

                    <!-- Nội dung (Hiển thị hoặc Edit) -->
                    <div v-if="post.isEditing">
                        <input v-model="post.tempTitle" class="form-control mb-2 fw-bold">
                        <textarea v-model="post.tempContent" class="form-control mb-2" rows="3"></textarea>
                        <button @click="saveEdit(post)" class="btn btn-success btn-sm me-2">Lưu</button>
                        <button @click="post.isEditing = false" class="btn btn-secondary btn-sm">Hủy</button>
                    </div>
                    <div v-else>
                        <h5 class="card-title fw-bold mt-2">{{ post.title }}</h5>
                        <p class="card-text">{{ post.content }}</p>
                        <img v-if="post.image" :src="post.image" class="img-fluid rounded mb-3 w-100 object-fit-cover">
                    </div>

                    <hr>
                    
                    <!-- Comments -->
                    <div>
                        <div v-for="cmt in post.comments" :key="cmt.id" class="d-flex mb-2">
                            <img :src="getUserAvatar(cmt.userId)" class="rounded-circle me-2 object-fit-cover" width="32" height="32">
                            <div class="bg-light rounded p-2 px-3 w-100">
                                <span class="fw-bold me-2">{{ getUserName(cmt.userId) }}</span>
                                <span>{{ cmt.content }}</span>
                            </div>
                        </div>
                        <div class="d-flex mt-3">
                            <img :src="store.currentUser.avatar || store.defaultAvatar" class="rounded-circle me-2 object-fit-cover" width="32" height="32">
                            <input v-model="post.newComment" @keyup.enter="addComment(post)" class="form-control rounded-pill bg-light border-0" placeholder="Viết bình luận...">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>