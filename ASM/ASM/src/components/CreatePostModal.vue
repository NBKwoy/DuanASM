<script setup>
import { reactive, ref } from 'vue';
import { store } from '../store';

const emit = defineEmits(['close', 'created']);
const fileInputRef = ref(null);
const newPost = reactive({ title: '', content: '', image: '' });
const showUrlInput = ref(false);

const triggerFileInput = () => { fileInputRef.value.click(); };

const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert("File quá lớn! Chọn ảnh dưới 5MB."); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
        newPost.image = e.target.result;
        showUrlInput.value = false;
    };
    reader.readAsDataURL(file);
};

const createPost = () => {
    if (!newPost.content && !newPost.image) return;
    const postData = {
        id: Date.now(),
        userId: store.currentUser.id,
        title: newPost.title || 'Chia sẻ mới',
        content: newPost.content,
        image: newPost.image,
        timestamp: new Date().toISOString(),
        comments: [], likes: [], shares: 0
    };
    store.posts.unshift(postData);
    store.saveDB();
    newPost.title = ''; newPost.content = ''; newPost.image = '';
    emit('created');
};
</script>

<template>
    <div class="modal-overlay" @click.self="emit('close')">
        <div class="modal-dialog modal-dialog-centered" style="max-width: 650px; width: 100%;">
            
            <div class="modal-content border-0 shadow-lg rounded-4 bg-white">
                
                <div class="modal-header border-bottom position-relative justify-content-center py-3">
                    <h5 class="modal-title fw-bold fs-4 text-dark">Tạo bài viết</h5>
                    <button @click="emit('close')" class="btn btn-light rounded-circle position-absolute end-0 me-3 bg-secondary bg-opacity-10">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="modal-body p-4">
                    <div class="d-flex align-items-center mb-4">
                        <img :src="store.currentUser.avatar || store.defaultAvatar" class="rounded-circle border me-3 object-fit-cover" width="50" height="50">
                        <div>
                            <h6 class="fw-bold mb-0 fs-5 text-dark">{{ store.currentUser.name }}</h6>
                            <div class="badge bg-secondary bg-opacity-10 text-dark border rounded-pill fw-normal mt-1 px-2 py-1">
                                <i class="fas fa-globe-asia me-1"></i> Công khai
                            </div>
                        </div>
                    </div>

                    <textarea v-model="newPost.content" class="form-control border-0 shadow-none px-0 mb-3 text-dark" 
                        style="font-size: 1.3rem; min-height: 150px; background: transparent;" 
                        :placeholder="`${store.currentUser.name} ơi, bạn đang nghĩ gì thế?`"></textarea>

                    <div v-if="newPost.image" class="position-relative mb-3 border rounded-3 overflow-hidden p-1 bg-light">
                        <button @click="newPost.image = ''" class="btn btn-light btn-sm rounded-circle position-absolute top-0 end-0 m-2 z-3 border shadow-sm"><i class="fas fa-times"></i></button>
                        <div class="ratio ratio-16x9 bg-black rounded-2 overflow-hidden">
                            <video v-if="newPost.image.includes('data:video') || newPost.image.includes('.mp4')" :src="newPost.image" controls></video>
                            <img v-else :src="newPost.image" class="object-fit-contain">
                        </div>
                    </div>

                    <input type="file" ref="fileInputRef" @change="handleFileChange" accept="image/*,video/*" class="d-none">

                    <div v-if="showUrlInput" class="mb-3 fade-in position-relative">
                        <input v-model="newPost.image" class="form-control bg-light rounded-pill ps-4" placeholder="Dán liên kết Ảnh hoặc YouTube...">
                        <button @click="showUrlInput = false" class="btn btn-sm btn-circle btn-secondary position-absolute top-50 end-0 translate-middle-y me-2"><i class="fas fa-times"></i></button>
                    </div>

                    <div class="d-flex justify-content-between align-items-center p-3 border rounded-3 mb-4 shadow-sm add-to-post-box">
                        <span class="fw-bold text-dark">Thêm vào bài viết của bạn</span>
                        <div class="d-flex gap-2">
                            <button @click="triggerFileInput" class="btn btn-hover rounded-circle text-success" title="Ảnh/Video">
                                <i class="fas fa-images fa-2x"></i>
                            </button>
                            
                            <button @click="showUrlInput = !showUrlInput" class="btn btn-hover rounded-circle text-primary" title="Dán Link">
                                <i class="fas fa-link fa-lg"></i>
                            </button>

                            <button class="btn btn-hover rounded-circle text-warning"><i class="far fa-smile fa-2x"></i></button>
                            <button class="btn btn-hover rounded-circle text-danger"><i class="fas fa-map-marker-alt fa-2x"></i></button>
                        </div>
                    </div>

                    <button @click="createPost" class="btn btn-primary w-100 fw-bold py-2 rounded-3 fs-5" :disabled="!newPost.content && !newPost.image">
                        Đăng
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0, 0, 0, 0.6); /* Nền đen mờ đè lên trang web */
    z-index: 9999; /* Đảm bảo nổi lên trên cùng */
    display: flex; align-items: center; justify-content: center;
}

/* Quan trọng: Đặt nền trắng tuyệt đối cho modal content */
.modal-content {
    background-color: #ffffff !important; 
    color: #000 !important;
    opacity: 1 !important;
}

.btn-hover:hover { background-color: #f0f2f5; }
.add-to-post-box { border-color: #ced0d4 !important; }
.fade-in { animation: fadeIn 0.3s; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
textarea { resize: none; }
</style>