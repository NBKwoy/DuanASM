<script setup>
import { ref, nextTick } from 'vue';
import { store } from '../store';

const props = defineProps(['post']);
const emit = defineEmits(['close']);

const newComment = ref('');
const inputRef = ref(null);
const replyingTo = ref(null);

// --- HELPERS ---
const getUser = (id) => store.users.find(u => u.id === id) || { name: 'Người dùng', avatar: store.defaultAvatar };
const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getHours()}:${d.getMinutes()} ${d.getDate()}/${d.getMonth()+1}`;
};
const isYoutube = (url) => url && (url.includes('youtube') || url.includes('youtu.be'));
const isMp4 = (url) => url && url.includes('.mp4');

const getYoutubeEmbed = (url) => {
    if (!url) return '';
    let id = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${id}`;
};

// --- LOGIC LIKE COMMENT / REPLY (MỚI) ---
const toggleCommentLike = (item) => {
    if (!item.likes) item.likes = [];
    
    const currentUserId = store.currentUser.id;
    const index = item.likes.indexOf(currentUserId);

    if (index === -1) {
        // Chưa like -> Like
        item.likes.push(currentUserId);

        // Gửi thông báo cho chủ bình luận (nếu không phải tự like chính mình)
        if (item.userId !== currentUserId) {
            const receiver = store.users.find(u => u.id === item.userId);
            if (receiver) {
                if (!receiver.notifications) receiver.notifications = [];
                receiver.notifications.unshift({
                    id: Date.now() + Math.random(),
                    type: 'like_comment', // Loại thông báo mới
                    fromId: currentUserId,
                    postId: props.post.id,
                    content: `đã thích bình luận của bạn: "${item.content.substring(0, 15)}..."`,
                    timestamp: new Date().toISOString(),
                    isRead: false
                });
            }
        }
    } else {
        // Đã like -> Unlike
        item.likes.splice(index, 1);
    }
    store.saveDB();
};

// --- LOGIC TRẢ LỜI & GỬI BÌNH LUẬN (Giữ nguyên logic cũ) ---
const startReply = (parentComment, targetUser = null) => {
    const userToTag = targetUser || getUser(parentComment.userId);
    replyingTo.value = { parentId: parentComment.id, targetName: userToTag.name, targetId: userToTag.id };
    nextTick(() => { if (inputRef.value) inputRef.value.focus(); });
};

const cancelReply = () => { replyingTo.value = null; newComment.value = ''; };

// Sửa hàm sendComment trong PostDetailModal.vue
const sendComment = async () => {
    if (!newComment.value.trim()) return;
    
    const currentUser = store.currentUser;
    
    // Tạo object comment mới
    const commentData = {
        id: Date.now(),
        userId: currentUser.id,
        content: newComment.value,
        timestamp: new Date().toISOString(),
        replies: [], 
        likes: []
    };

    if (replyingTo.value) {
        // ... (Logic trả lời bình luận - Có thể thêm thông báo reply ở đây nếu muốn)
    } else {
        // --- LOGIC BÌNH LUẬN ---
        props.post.comments.push(commentData);
        
        // GỬI THÔNG BÁO (Nếu không phải tự bình luận bài mình)
        if (props.post.userId !== currentUser.id) {
            await store.addNotification({
                toUserId: props.post.userId,
                type: 'comment',
                content: 'đã bình luận bài viết của bạn.',
                postId: props.post.id
            });
        }
    }
    
    // Lưu comment lên Server
    await store.updatePost(props.post.id, { comments: props.post.comments });
    
    newComment.value = ''; 
    replyingTo.value = null;
};

const sendNotification = (toUserId, type, text) => {
    const receiver = store.users.find(u => u.id === toUserId);
    if (receiver) {
        if (!receiver.notifications) receiver.notifications = [];
        receiver.notifications.unshift({
            id: Date.now() + Math.random(), type: type, fromId: store.currentUser.id, postId: props.post.id, content: text, timestamp: new Date().toISOString(), isRead: false
        });
    }
};

const toggleLike = () => {
    const postInStore = store.posts.find(p => p.id === props.post.id);
    if (!postInStore.likes) postInStore.likes = [];
    const idx = postInStore.likes.indexOf(store.currentUser.id);
    idx === -1 ? postInStore.likes.push(store.currentUser.id) : postInStore.likes.splice(idx, 1);
    
    // Thông báo like bài viết
    if (idx === -1 && props.post.userId !== store.currentUser.id) {
        sendNotification(props.post.userId, 'like_post', 'đã thích bài viết của bạn.');
    }
    store.saveDB();
};
</script>

<template>
    <div class="modal-overlay" @click.self="emit('close')">
        <button @click="emit('close')" class="btn-close-fixed"><i class="fas fa-times"></i></button>

        <div class="modal-dialog modal-xl modal-dialog-centered h-100 my-0 mx-auto" style="max-width: 95%;">
            <div class="modal-content border-0 shadow-none h-100 bg-transparent">
                <div class="row g-0 h-100 rounded-4 overflow-hidden">
                    <div class="col-lg-8 col-md-7 bg-black d-flex align-items-center justify-content-center position-relative">
                        <div class="w-100 h-100 d-flex align-items-center justify-content-center">
                            <iframe v-if="isYoutube(post.image)" :src="getYoutubeEmbed(post.image)" class="w-100 h-100 border-0"></iframe>
                            <video v-else-if="isMp4(post.image)" :src="post.image" controls class="w-100" style="max-height: 90vh;"></video>
                            <img v-else-if="post.image" :src="post.image" class="img-fluid" style="max-height: 90vh; object-fit: contain;">
                            <div v-else class="text-white fs-5">Bài viết văn bản</div>
                        </div>
                    </div>

                    <div class="col-lg-4 col-md-5 bg-white d-flex flex-column h-100 position-relative">
                        <div class="p-3 border-bottom d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center">
                                <img :src="getUser(post.userId).avatar || store.defaultAvatar" class="rounded-circle border me-2 object-fit-cover" width="40" height="40">
                                <div><h6 class="fw-bold mb-0 text-dark small">{{ getUser(post.userId).name }}</h6><small class="text-muted" style="font-size: 11px;">{{ formatDate(post.timestamp) }}</small></div>
                            </div>
                            <button class="btn btn-light btn-sm rounded-circle"><i class="fas fa-ellipsis-h"></i></button>
                        </div>

                        <div class="flex-grow-1 p-3 overflow-auto custom-scroll">
                            <p class="mb-3 small" style="white-space: pre-line;">{{ post.content }}</p>
                            <hr class="opacity-25">
                            
                            <div v-if="post.comments && post.comments.length > 0">
                                <div v-for="cmt in post.comments" :key="cmt.id" class="mb-3">
                                    <div class="d-flex align-items-start">
                                        <img :src="getUser(cmt.userId).avatar || store.defaultAvatar" class="rounded-circle me-2 mt-1 object-fit-cover" width="32" height="32">
                                        <div>
                                            <div class="bg-light rounded-3 p-2 px-3 d-inline-block">
                                                <span class="fw-bold d-block small text-dark">{{ getUser(cmt.userId).name }}</span>
                                                <span class="small text-dark">{{ cmt.content }}</span>
                                                <div v-if="cmt.likes && cmt.likes.length > 0" class="position-absolute" style="right: -15px; bottom: -5px;">
                                                    <span class="badge bg-white text-primary shadow-sm border rounded-pill p-1 px-2" style="font-size: 10px;">
                                                        <i class="fas fa-thumbs-up"></i> {{ cmt.likes.length }}
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="ms-1 mt-1 d-flex gap-3">
                                                <small @click="toggleCommentLike(cmt)" 
                                                       class="cursor-pointer hover-underline fw-bold" 
                                                       :class="cmt.likes && cmt.likes.includes(store.currentUser.id) ? 'text-primary' : 'text-muted'"
                                                       style="font-size: 11px;">Thích</small>
                                                
                                                <small @click="startReply(cmt)" class="text-muted cursor-pointer hover-underline fw-bold" style="font-size: 11px;">Phản hồi</small>
                                                <small class="text-muted" style="font-size: 11px;">{{ formatDate(cmt.timestamp) }}</small>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="cmt.replies && cmt.replies.length > 0" class="ms-5 mt-2">
                                        <div v-for="reply in cmt.replies" :key="reply.id" class="d-flex align-items-start mb-2">
                                            <img :src="getUser(reply.userId).avatar || store.defaultAvatar" class="rounded-circle me-2 mt-1 object-fit-cover" width="24" height="24">
                                            <div>
                                                <div class="bg-light rounded-3 p-2 px-3 d-inline-block position-relative">
                                                    <span class="fw-bold d-block small text-dark">{{ getUser(reply.userId).name }}</span>
                                                    <span class="small text-dark"><span class="text-primary fw-bold" v-if="reply.replyToUser">@{{ reply.replyToUser }}</span> {{ reply.content }}</span>
                                                    <div v-if="reply.likes && reply.likes.length > 0" class="position-absolute end-0 bottom-0 translate-middle-x translate-middle-y">
                                                        <span class="badge bg-white text-primary shadow-sm border rounded-pill p-1" style="font-size: 9px;"><i class="fas fa-thumbs-up"></i> {{ reply.likes.length }}</span>
                                                    </div>
                                                </div>
                                                <div class="ms-1 mt-1 d-flex gap-3">
                                                    <small @click="toggleCommentLike(reply)" 
                                                           class="cursor-pointer hover-underline fw-bold" 
                                                           :class="reply.likes && reply.likes.includes(store.currentUser.id) ? 'text-primary' : 'text-muted'"
                                                           style="font-size: 10px;">Thích</small>
                                                    
                                                    <small @click="startReply(cmt, getUser(reply.userId))" class="text-muted cursor-pointer hover-underline fw-bold" style="font-size: 10px;">Phản hồi</small>
                                                    <small class="text-muted" style="font-size: 10px;">{{ formatDate(reply.timestamp) }}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="text-center text-muted small mt-5">Chưa có bình luận nào.</div>
                        </div>

                        <div class="p-3 border-top bg-white">
                            <div v-if="replyingTo" class="d-flex justify-content-between align-items-center bg-warning bg-opacity-10 p-2 mb-2 rounded small border-start border-4 border-warning">
                                <span>Đang trả lời <b>{{ replyingTo.targetName }}</b></span>
                                <button @click="cancelReply" class="btn btn-sm btn-link text-muted text-decoration-none p-0"><i class="fas fa-times"></i> Hủy</button>
                            </div>
                            <div v-if="!replyingTo" class="d-flex justify-content-between mb-2 px-1">
                                <button @click="toggleLike" class="btn btn-link text-decoration-none p-0 fw-bold small" :class="post.likes?.includes(store.currentUser.id) ? 'text-orange' : 'text-secondary'">
                                    <i :class="post.likes?.includes(store.currentUser.id) ? 'fas' : 'far'" class="fa-thumbs-up me-2"></i> {{ post.likes?.length || 0 }}
                                </button>
                                <span class="text-muted small"><i class="fas fa-share me-1"></i> {{ post.shares || 0 }}</span>
                            </div>
                            <div class="d-flex align-items-center">
                                <img :src="store.currentUser.avatar || store.defaultAvatar" class="rounded-circle me-2 object-fit-cover" width="32" height="32">
                                <div class="input-group bg-light rounded-pill overflow-hidden border">
                                    <input ref="inputRef" v-model="newComment" @keyup.enter="sendComment" class="form-control bg-light border-0 small shadow-none" :placeholder="replyingTo ? 'Viết câu trả lời...' : 'Viết bình luận...'">
                                    <button @click="sendComment" class="btn btn-link text-primary pe-3" :disabled="!newComment"><i class="fas fa-paper-plane"></i></button>
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
/* CSS cũ giữ nguyên */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); z-index: 2050; display: flex; align-items: center; justify-content: center; }
.btn-close-fixed { position: absolute; top: 15px; left: 15px; z-index: 3000; width: 40px; height: 40px; border-radius: 50%; background: rgba(255,255,255,0.1); color: white; border: none; font-size: 20px; display: flex; align-items: center; justify-content: center; transition: background 0.2s; }
.btn-close-fixed:hover { background: rgba(255,255,255,0.3); }
.custom-scroll::-webkit-scrollbar { width: 6px; }
.custom-scroll::-webkit-scrollbar-thumb { background: #ccc; border-radius: 3px; }
.hover-underline:hover { text-decoration: underline; }
.cursor-pointer { cursor: pointer; }
</style>