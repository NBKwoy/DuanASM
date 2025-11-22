<script setup>
import { reactive, ref } from 'vue';
import { store } from '../store';

const emit = defineEmits(['create-post']);

const newPost = reactive({ title: '', content: '', image: '' });
const showImageInput = ref(false);

const createPost = () => {
    if (!newPost.content) return;
    emit('create-post', { ...newPost });
    newPost.title = '';
    newPost.content = '';
    newPost.image = '';
    showImageInput.value = false;
};
</script>

<template>
    <div class="card shadow border-0 mb-4 rounded-4">
        <div class="card-body p-4">
            <div class="d-flex align-items-center mb-3">
                <img :src="store.currentUser.avatar || store.defaultAvatar" class="rounded-circle border object-fit-cover me-2" width="45" height="45">
                <div>
                    <h6 class="fw-bold mb-0 text-dark">{{ store.currentUser.name }}</h6>
                    <div class="badge bg-light text-secondary border rounded-pill px-2 py-1 mt-1 fw-normal" style="cursor: pointer; font-size: 11px;">
                        <i class="fas fa-globe-asia me-1"></i> Công khai <i class="fas fa-caret-down ms-1"></i>
                    </div>
                </div>
            </div>

            <div class="w-100">
                <input 
                    v-model="newPost.title" 
                    class="form-control border-0 fw-bold mb-2 px-0 shadow-none fs-5" 
                    placeholder="Tiêu đề bài viết (Không bắt buộc)...">
                <textarea 
                    v-model="newPost.content" 
                    class="form-control border-0 px-0 shadow-none fs-5" 
                    rows="3" 
                    :placeholder="`Chào ${store.currentUser.name}, bạn đang nghĩ gì thế?`" 
                    style="resize: none;">
                </textarea>
            </div>
            
            <div v-if="newPost.image" class="mb-3 position-relative mt-2">
                <img :src="newPost.image" class="img-fluid rounded-3 w-100 object-fit-cover" style="max-height: 300px;">
                <button @click="newPost.image = ''" class="btn btn-dark btn-sm position-absolute top-0 end-0 m-2 rounded-circle">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div v-if="showImageInput" class="mb-3 fade-in mt-2">
                <input 
                    v-model="newPost.image" 
                    class="form-control bg-light border-0 rounded-pill" 
                    placeholder="Dán URL hình ảnh...">
            </div>
            
            <hr class="text-muted opacity-25 my-2">
            
            <div class="d-flex justify-content-between align-items-center mt-2">
                <button @click="showImageInput = !showImageInput" class="btn btn-light text-success rounded-pill me-2 fw-bold btn-sm-custom">
                    <i class="fas fa-image me-1"></i> Ảnh/Video
                </button>
                <button @click="createPost" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" :disabled="!newPost.content">
                    Đăng bài
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.fade-in {
    animation: fadeIn 0.3s ease-in;
}
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>

