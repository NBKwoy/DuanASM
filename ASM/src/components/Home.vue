<script setup>
import { reactive, computed, ref, watch } from 'vue';
import { store } from '../store';
import HotSearch from './HotSearch.vue';
import CreatePostModal from './CreatePostModal.vue';
import PostDetailModal from './PostDetailModal.vue';

const props = defineProps(['openPostId']);
const emit = defineEmits(['navigate', 'post-opened']);

// --- KHAI BÁO BIẾN MỚI CHO VIỆC SỬA BÀI ---
const showCreateModal = ref(false);
const editingPost = ref(null); // Biến lưu bài viết đang được sửa

// Hàm mở modal SỬA
const openEditPost = (post) => {
    editingPost.value = post;
    showCreateModal.value = true;
};

// Hàm mở modal TẠO MỚI
const openCreatePost = () => {
    editingPost.value = null;
    showCreateModal.value = true;
};
// -----------------------------------------

const filterMode = ref('category'); 
const activeCategory = ref('all');
const currentTrendKeyword = ref('');
const selectedPost = ref(null);
const bigSearchQuery = ref('');

const categories = [
    { id: 'all', name: 'Toàn thư', icon: 'fas fa-globe-asia text-primary' },
    { id: 'popular', name: 'Phổ biến', icon: 'fas fa-fire text-danger' },
    { id: 'video', name: 'Video', icon: 'fas fa-play-circle text-success' },
    { id: 'image', name: 'Hình ảnh', icon: 'fas fa-images text-warning' },
];

watch(() => props.openPostId, (newId) => {
    if (newId) {
        const post = store.posts.find(p => p.id === newId);
        if (post) { selectedPost.value = post; emit('post-opened'); }
    }
}, { immediate: true });

const selectCategory = (catId) => { filterMode.value = 'category'; activeCategory.value = catId; currentTrendKeyword.value = ''; };
const handleTrendSearch = (keyword) => { 
    filterMode.value = 'trend'; currentTrendKeyword.value = keyword; 
    setTimeout(() => { const feed = document.getElementById('main-feed'); if(feed) feed.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100); 
};
const handleBigSearch = () => { if(bigSearchQuery.value) { handleTrendSearch(bigSearchQuery.value); bigSearchQuery.value = ''; } }

const isYoutube = (url) => url && (url.includes('youtube.com') || url.includes('youtu.be'));
const isMp4 = (url) => url && url.includes('.mp4');
const getYoutubeEmbed = (url) => { if (!url) return ''; let videoId = ''; if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0]; else if (url.includes('v=')) videoId = url.split('v=')[1]?.split('&')[0]; return `https://www.youtube.com/embed/${videoId}`; };

const filteredPosts = computed(() => {
    let posts = [...store.posts];
    if (filterMode.value === 'trend' && currentTrendKeyword.value) { const k = currentTrendKeyword.value.toLowerCase(); return posts.filter(p => (p.title && p.title.toLowerCase().includes(k)) || (p.content && p.content.toLowerCase().includes(k))); }
    if (filterMode.value === 'category') { switch (activeCategory.value) { case 'popular': return posts.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)); case 'video': return posts.filter(p => isYoutube(p.image) || isMp4(p.image)); case 'image': return posts.filter(p => p.image && !isYoutube(p.image) && !isMp4(p.image)); case 'all': default: return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); } }
    return posts;
});

const getUserName = (id) => store.users.find(u => u.id === id)?.name || 'Unknown';
const getUserAvatar = (id) => store.users.find(u => u.id === id)?.avatar || store.defaultAvatar;
const formatDate = (iso) => new Date(iso).toLocaleString('vi-VN');
// Sửa hàm toggleLike trong Home.vue
const toggleLike = async (post) => {
    if (!post.likes) post.likes = [];
    
    const currentUserId = store.currentUser.id;
    const index = post.likes.indexOf(currentUserId);
    
    if (index === -1) {
        // --- LOGIC LIKE ---
        post.likes.push(currentUserId);
        
        // GỬI THÔNG BÁO (Nếu không phải tự like bài mình)
        if (post.userId !== currentUserId) {
            await store.addNotification({
                toUserId: post.userId, // Gửi cho chủ bài viết
                type: 'like_post',
                content: 'đã thích bài viết của bạn.',
                postId: post.id
            });
        }
    } else {
        // --- LOGIC UNLIKE ---
        post.likes.splice(index, 1);
    }
    
    // Cập nhật bài viết lên Server
    await store.updatePost(post.id, { likes: post.likes });
};
const deletePost = (id) => { store.deletePost(id); };
const openPostDetail = (post) => { selectedPost.value = post; };
</script>

<template>
    <div class="page-background">
        <div class="hero-header position-relative d-flex align-items-center justify-content-center flex-column text-white">
            <div class="hero-bg-overlay"></div>
            <div class="mb-4 z-2 text-center animate-fade-down">
                <h2><img src="https://i.imgur.com/fr2DiX6.png" alt="logo" width="120"></h2>
            </div>
            <div class="search-container z-2 w-100 px-3" style="max-width: 700px;">
                <div class="input-group input-group-lg bg-white rounded-pill overflow-hidden shadow-lg border border-3 border-warning">
                    <span class="input-group-text bg-white border-0 ps-4"><i class="fas fa-search text-secondary"></i></span>
                    <input v-model="bigSearchQuery" @keyup.enter="handleBigSearch" class="form-control border-0 shadow-none py-3" placeholder="Tìm kiếm (VD: FPT, iPhone, Video)...">
                    <button @click="handleBigSearch" class="btn btn-warning text-white fw-bold px-4 px-md-5 fs-5">Tìm kiếm</button>
                </div>
            </div>
        </div>

        <div class="container py-4">
            <div class="row g-4">
                <div class="col-lg-2 d-none d-lg-block">
                    <div class="sticky-sidebar">
                        <div class="list-group shadow-sm rounded-4 overflow-hidden border-0 bg-white">
                            <button v-for="cat in categories" :key="cat.id" @click="selectCategory(cat.id)" class="list-group-item list-group-item-action border-0 py-3 fw-bold d-flex align-items-center" :class="(filterMode === 'category' && activeCategory === cat.id) ? 'bg-orange-light text-orange border-start border-4 border-orange' : 'text-secondary'"> <i :class="cat.icon" class="me-3 fs-5" style="width: 25px;"></i> {{ cat.name }} </button>
                        </div>
                    </div>
                </div>

                <div class="col-lg-7 col-12" id="main-feed">
                    <div class="card shadow border-0 mb-4 rounded-4">
                        <div class="card-body p-3">
                            <div class="d-flex align-items-center">
                                <img :src="store.currentUser.avatar || store.defaultAvatar" class="rounded-circle border object-fit-cover me-3" width="45" height="45">
                                <div @click="openCreatePost" class="bg-light rounded-pill px-3 py-2 flex-grow-1 text-muted cursor-pointer hover-bg-darker transition-btn">Bạn đang nghĩ gì thế, {{ store.currentUser.name }}?</div>
                            </div>
                            <div class="d-flex justify-content-around mt-3 pt-2 border-top">
                                <button @click="openCreatePost" class="btn btn-sm btn-light text-success fw-bold"><i class="fas fa-image me-1"></i> Ảnh/Video</button>
                                <button @click="openCreatePost" class="btn btn-sm btn-light text-warning fw-bold"><i class="far fa-smile me-1"></i> Cảm xúc</button>
                            </div>
                        </div>
                    </div>

                    <div v-if="filterMode === 'trend'" class="alert alert-light border shadow-sm rounded-4 d-flex align-items-center justify-content-between mb-4"><span><i class="fas fa-search me-2 text-orange"></i>Kết quả: <span class="fw-bold text-orange">#{{ currentTrendKeyword }}</span></span><button @click="selectCategory('all')" class="btn btn-sm btn-light border rounded-pill"><i class="fas fa-times me-1"></i> Xóa</button></div>

                    <div v-for="post in filteredPosts" :key="post.id" class="card shadow-sm border-0 mb-4 rounded-4 hover-shadow animate-up">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <div class="d-flex align-items-center">
                                    <img :src="getUserAvatar(post.userId)" class="rounded-circle me-3 border object-fit-cover" width="45" height="45">
                                    <div>
                                        <div class="fw-bold text-dark">{{ getUserName(post.userId) }}</div>
                                        <small class="text-muted">{{ formatDate(post.timestamp) }}</small>
                                    </div>
                                </div>

                                <div class="dropdown" v-if="post.userId == store.currentUser.id">
                                    <button class="btn btn-light btn-sm rounded-circle" type="button" data-bs-toggle="dropdown">
                                        <i class="fas fa-ellipsis-h"></i>
                                    </button>
                                    <ul class="dropdown-menu dropdown-menu-end border-0 shadow">
                                        <li>
                                            <button class="dropdown-item" @click="openEditPost(post)">
                                                <i class="fas fa-pen me-2 text-primary"></i> Chỉnh sửa bài viết
                                            </button>
                                        </li>
                                        <li><hr class="dropdown-divider"></li>
                                        <li>
                                            <button class="dropdown-item text-danger" @click="deletePost(post.id)">
                                                <i class="fas fa-trash me-2"></i> Xóa bài viết
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <h5 v-if="post.title" class="fw-bold mb-2">{{ post.title }}</h5>
                            <p class="card-text mb-3 text-truncate-3">{{ post.content }}</p>
                            
                            <div v-if="post.image" @click="openPostDetail(post)" class="rounded-3 overflow-hidden mb-3 bg-black d-flex justify-content-center align-items-center cursor-pointer position-relative media-preview" style="max-height: 400px;">
                                <div class="overlay-hover d-flex align-items-center justify-content-center"><i class="fas fa-expand-alt text-white fa-2x"></i></div>
                                <div v-if="isYoutube(post.image)" class="ratio ratio-16x9 w-100 pointer-events-none"><iframe :src="getYoutubeEmbed(post.image)" title="YouTube"></iframe></div>
                                <video v-else-if="isMp4(post.image)" :src="post.image" class="w-100 max-h-100"></video>
                                <img v-else :src="post.image" class="img-fluid w-100 object-fit-cover">
                            </div>

                            <div class="d-flex justify-content-between text-muted border-top pt-3">
                                <button @click.stop="toggleLike(post)" class="btn btn-light flex-grow-1 border-0 text-muted transition-btn mx-3 rounded-5" :class="post.likes?.includes(store.currentUser.id) ? 'text-orange' : 'text-muted'"><i :class="post.likes?.includes(store.currentUser.id) ? 'fas' : 'far'" class="fa-thumbs-up me-2"></i>{{ post.likes?.length || 0 }}</button>
                                <button @click="openPostDetail(post)" class="btn btn-light flex-grow-1 border-0 text-muted transition-btn mx-3 rounded-5"><i class="far fa-comment-dots me-2"></i>Bình luận</button>
                                <button class="btn btn-light flex-grow-1 border-0 text-muted transition-btn mx-3 rounded-5"><i class="fas fa-share me-2"></i>{{ post.shares || 0 }}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-3 d-none d-lg-block">
                    <div class="sticky-sidebar"><HotSearch @search-trend="handleTrendSearch" /></div>
                </div>
            </div>
        </div>

        <CreatePostModal 
            v-if="showCreateModal" 
            :post-to-edit="editingPost" 
            @close="showCreateModal = false" 
            @created="showCreateModal = false" 
        />
        
        <PostDetailModal v-if="selectedPost" :post="selectedPost" @close="selectedPost = null" />
    </div>
</template>

<style scoped>
/* Style cũ giữ nguyên */
.hero-header { height: 350px; width: 100%; margin-top: -1.5rem; position: relative; }
.hero-bg-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-image: url('https://images-na.ssl-images-amazon.com/images/I/71dNtlbI7fL.jpg'); background-size: cover; background-position: center; filter: brightness(0.6); z-index: 1; }
.text-orange { color: #ff8200 !important; } .bg-orange-light { background-color: #fff0e0 !important; } .border-orange { border-color: #ff8200 !important; } .btn-orange { background-color: #ff8200; color: white; border: none; }
.sticky-sidebar { position: -webkit-sticky; position: sticky; top: 90px; z-index: 100; } .page-background { background-color: #f0f2f5; min-height: 100vh; padding-top: 0; }
.hover-bg-darker:hover { background-color: #e9ecef !important; } .pointer-events-none { pointer-events: none; } .media-preview:hover .overlay-hover { opacity: 1; }
.overlay-hover { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.3); opacity: 0; transition: opacity 0.2s; z-index: 10; }
.text-truncate-3 { display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; } .animate-up { animation: fadeInUp 0.5s ease-out; }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
.hide-scrollbar::-webkit-scrollbar { display: none; }
</style>