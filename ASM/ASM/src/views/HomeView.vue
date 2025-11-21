<script setup>
import { reactive, computed, ref } from 'vue';
import { store } from '../store';

const newPost = reactive({ title: '', content: '', image: '' });
const showImageInput = ref(false);
const replyState = reactive({}); // Lưu trạng thái ô nhập trả lời

// --- HELPERS ---
const getUserName = (id) => store.users.find(u => u.id === id)?.name || 'Unknown';
const getUserAvatar = (id) => store.users.find(u => u.id === id)?.avatar || store.defaultAvatar;
const formatDate = (iso) => new Date(iso).toLocaleString('vi-VN');

// --- KIỂM TRA TRẠNG THÁI BẠN BÈ ---
const getFriendStatus = (targetId) => {
    const me = store.currentUser;
    // 1. Đã là bạn
    if (me.friends && me.friends.includes(targetId)) return 'friend';
    
    // 2. Mình đã gửi lời mời cho họ (kiểm tra bên user kia)
    const targetUser = store.users.find(u => u.id === targetId);
    if (targetUser && targetUser.friendRequests && targetUser.friendRequests.includes(me.id)) return 'sent';

    // 3. Họ gửi lời mời cho mình
    if (me.friendRequests && me.friendRequests.includes(targetId)) return 'received';

    // 4. Chưa gì cả
    return 'none';
};

// --- ACTIONS ---

// 1. Gửi lời mời kết bạn
const sendFriendRequest = (targetId) => {
    const targetUser = store.users.find(u => u.id === targetId);
    if (!targetUser.friendRequests) targetUser.friendRequests = [];
    if (!targetUser.notifications) targetUser.notifications = [];

    // Thêm vào danh sách chờ của họ
    targetUser.friendRequests.push(store.currentUser.id);
    
    // Gửi thông báo cho họ
    targetUser.notifications.unshift({
        id: Date.now(),
        type: 'friend_request',
        fromId: store.currentUser.id,
        content: 'đã gửi cho bạn lời mời kết bạn.',
        timestamp: new Date().toISOString(),
        isRead: false
    });

    store.saveDB();
    alert('Đã gửi lời mời kết bạn!');
};

// 2. Trả lời bình luận (Liên tục)
// parentId: ID của comment to nhất (comment cha)
// replyToUser: (Tùy chọn) Người mà mình đang muốn reply cụ thể trong nhánh đó
const toggleReplyInput = (parentId, replyToUser = null) => {
    // Bật tắt ô nhập
    replyState[`show_${parentId}`] = !replyState[`show_${parentId}`];
    
    // Nếu reply cho một người cụ thể (comment con), tự điền @Tên
    if (replyToUser) {
        const name = getUserName(replyToUser);
        replyState[parentId] = `@${name} `;
    } else {
        replyState[parentId] = '';
    }
};

const submitReply = (post, parentCommentId) => {
    const content = replyState[parentCommentId];
    if (!content) return;

    const comment = post.comments.find(c => c.id === parentCommentId);
    if (comment) {
        if (!comment.replies) comment.replies = [];
        comment.replies.push({
            id: Date.now(), 
            userId: store.currentUser.id, 
            content: content, 
            timestamp: new Date().toISOString()
        });
        replyState[parentCommentId] = ''; 
        // replyState[`show_${parentCommentId}`] = false; // Muốn đóng ô nhập sau khi gửi thì bỏ comment dòng này
        store.saveDB();
    }
};

// --- CÁC HÀM CŨ (Giữ nguyên logic) ---
const sortedPosts = computed(() => [...store.posts].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
const createPost = () => {
    if (!newPost.content) return;
    store.posts.unshift({
        id: Date.now(), userId: store.currentUser.id,
        title: newPost.title || 'Chia sẻ mới', content: newPost.content, image: newPost.image,
        timestamp: new Date().toISOString(), comments: [], likes: [], shares: 0, isEditing: false
    });
    newPost.title = ''; newPost.content = ''; newPost.image = ''; showImageInput.value = false; store.saveDB();
};
const toggleLike = (post) => {
    if (!post.likes) post.likes = [];
    const idx = post.likes.indexOf(store.currentUser.id);
    idx === -1 ? post.likes.push(store.currentUser.id) : post.likes.splice(idx, 1);
    store.saveDB();
};
const handleShare = (post) => { if (!post.shares) post.shares = 0; post.shares++; store.saveDB(); alert('Đã chia sẻ!'); };
const deletePost = (id) => { if(confirm('Xóa bài?')) { store.posts = store.posts.filter(p => p.id !== id); store.saveDB(); } };
const editPost = (post) => { post.isEditing = true; post.tempTitle = post.title; post.tempContent = post.content; };
const saveEdit = (post) => { post.title = post.tempTitle; post.content = post.tempContent; post.isEditing = false; store.saveDB(); };
const addComment = (post) => {
    if(!post.newComment) return;
    if(!post.comments) post.comments = [];
    post.comments.push({ id: Date.now(), userId: store.currentUser.id, content: post.newComment, timestamp: new Date().toISOString(), replies: [] });
    post.newComment = ''; store.saveDB();
};
</script>

<template>
    <div class="page-background">
        <div class="container py-4">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="card shadow border-0 mb-4 rounded-4">
                        <div class="card-body p-4">
                            <div class="d-flex mb-3">
                                <img :src="store.currentUser.avatar || store.defaultAvatar" class="rounded-circle border object-fit-cover me-3" width="50" height="50">
                                <div class="w-100">
                                    <input v-model="newPost.title" class="form-control border-0 fw-bold mb-1 px-0 shadow-none" placeholder="Tiêu đề (Tùy chọn)...">
                                    <textarea v-model="newPost.content" class="form-control border-0 px-0 shadow-none" rows="2" :placeholder="`Chào ${store.currentUser.name}, bạn đang nghĩ gì thế?`"></textarea>
                                </div>
                            </div>
                            <div v-if="newPost.image" class="mb-3 position-relative">
                                <img :src="newPost.image" class="img-fluid rounded-3 w-100 object-fit-cover" style="max-height: 300px;">
                                <button @click="newPost.image = ''" class="btn btn-dark btn-sm position-absolute top-0 end-0 m-2 rounded-circle"><i class="fas fa-times"></i></button>
                            </div>
                            <div v-if="showImageInput" class="mb-3 fade-in"><input v-model="newPost.image" class="form-control bg-light border-0 rounded-pill" placeholder="Dán URL hình ảnh..."></div>
                            <hr class="text-muted opacity-25 my-2">
                            <div class="d-flex justify-content-between align-items-center mt-2">
                                <button @click="showImageInput = !showImageInput" class="btn btn-light text-success rounded-pill me-2 fw-bold btn-sm-custom"><i class="fas fa-image me-1"></i> Ảnh/Video</button>
                                <button @click="createPost" class="btn btn-primary rounded-pill px-4 fw-bold shadow-sm" :disabled="!newPost.content">Đăng bài</button>
                            </div>
                        </div>
                    </div>

                    <div v-for="post in sortedPosts" :key="post.id" class="card shadow-sm border-0 mb-4 rounded-4">
                        <div class="card-body p-4">
                            <div class="d-flex justify-content-between align-items-start">
                                <div class="d-flex align-items-center mb-3">
                                    <img :src="getUserAvatar(post.userId)" class="rounded-circle me-3 border object-fit-cover" width="45" height="45">
                                    <div>
                                        <div class="fw-bold text-dark d-flex align-items-center">
                                            {{ getUserName(post.userId) }}
                                            
                                            <div v-if="post.userId !== store.currentUser.id" class="ms-2">
                                                <button v-if="getFriendStatus(post.userId) === 'none'" 
                                                        @click="sendFriendRequest(post.userId)"
                                                        class="btn btn-sm btn-primary py-0 px-3 rounded-pill fw-bold shadow-sm">
                                                    <i class="fas fa-user-plus me-1"></i> Kết bạn
                                                </button>

                                                <button v-else-if="getFriendStatus(post.userId) === 'sent'" 
                                                        class="btn btn-sm btn-secondary py-0 px-3 rounded-pill fw-bold disabled">
                                                    <i class="fas fa-paper-plane me-1"></i> Đã gửi
                                                </button>

                                                <span v-else-if="getFriendStatus(post.userId) === 'friend'" 
                                                      class="badge bg-light text-dark border fw-normal p-2 rounded-pill">
                                                    <i class="fas fa-check text-success"></i> Bạn bè
                                                </span>
                                            </div>
                                        </div>
                                        <small class="text-muted" style="font-size: 12px;">{{ formatDate(post.timestamp) }} <i class="fas fa-globe-asia ms-1"></i></small>
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

                            <div v-if="post.isEditing">
                                <input v-model="post.tempTitle" class="form-control mb-2 fw-bold">
                                <textarea v-model="post.tempContent" class="form-control mb-2" rows="3"></textarea>
                                <div class="d-flex justify-content-end"><button @click="saveEdit(post)" class="btn btn-success btn-sm me-2">Lưu</button><button @click="post.isEditing = false" class="btn btn-secondary btn-sm">Hủy</button></div>
                            </div>
                            <div v-else>
                                <h5 v-if="post.title !== 'Chia sẻ mới'" class="card-title fw-bold mb-2">{{ post.title }}</h5>
                                <p class="card-text mb-3" style="white-space: pre-line;">{{ post.content }}</p>
                                <div v-if="post.image" class="rounded-3 overflow-hidden mb-3 bg-light border d-flex justify-content-center"><img :src="post.image" class="img-fluid" style="max-height: 500px;"></div>
                            </div>

                            <div class="d-flex justify-content-between text-muted border-top border-bottom py-2 my-3">
                                <button @click="toggleLike(post)" class="btn flex-grow-1 border-0 fw-bold transition-btn" :class="post.likes && post.likes.includes(store.currentUser.id) ? 'text-primary' : 'text-muted'"><i class="fas fa-thumbs-up me-2"></i>{{ post.likes?.length || '' }} Thích</button>
                                <button class="btn btn-light flex-grow-1 border-0 text-muted transition-btn"><i class="far fa-comment-alt me-2"></i>Bình luận</button>
                                <button @click="handleShare(post)" class="btn btn-light flex-grow-1 border-0 text-muted transition-btn"><i class="fas fa-share me-2"></i>{{ post.shares || '' }} Chia sẻ</button>
                            </div>

                            <div>
                                <div v-for="cmt in post.comments" :key="cmt.id" class="mb-3">
                                    <div class="d-flex">
                                        <img :src="getUserAvatar(cmt.userId)" class="rounded-circle me-2 object-fit-cover mt-1" width="32" height="32">
                                        <div class="flex-grow-1">
                                            <div class="bg-light-gray rounded-3 p-2 px-3 d-inline-block">
                                                <span class="fw-bold me-2 d-block" style="font-size: 0.9rem;">{{ getUserName(cmt.userId) }}</span>
                                                <span style="font-size: 0.95rem;">{{ cmt.content }}</span>
                                            </div>
                                            <div class="mt-1 ms-1">
                                                <small @click="toggleReplyInput(cmt.id)" class="text-muted fw-bold cursor-pointer hover-underline me-3" style="font-size: 12px;">Trả lời</small>
                                                <small class="text-muted" style="font-size: 11px;">{{ formatDate(cmt.timestamp) }}</small>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="cmt.replies && cmt.replies.length > 0" class="ms-5 mt-2 ps-2 border-start border-3">
                                        <div v-for="reply in cmt.replies" :key="reply.id" class="d-flex mb-2">
                                            <img :src="getUserAvatar(reply.userId)" class="rounded-circle me-2 object-fit-cover mt-1" width="24" height="24">
                                            <div>
                                                <div class="bg-light-gray rounded-3 p-2 px-3 d-inline-block">
                                                    <span class="fw-bold me-2 d-block" style="font-size: 0.85rem;">{{ getUserName(reply.userId) }}</span>
                                                    <span style="font-size: 0.9rem;">{{ reply.content }}</span>
                                                </div>
                                                <div class="mt-1 ms-1">
                                                    <small @click="toggleReplyInput(cmt.id, reply.userId)" class="text-muted fw-bold cursor-pointer hover-underline" style="font-size: 11px;">Trả lời</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div v-if="replyState[`show_${cmt.id}`]" class="d-flex mt-2 ms-5 align-items-center fade-in">
                                        <img :src="store.currentUser.avatar || store.defaultAvatar" class="rounded-circle me-2 object-fit-cover" width="24" height="24">
                                        <div class="input-group input-group-sm">
                                            <input v-model="replyState[cmt.id]" @keyup.enter="submitReply(post, cmt.id)" class="form-control rounded-pill bg-light border-0 px-3" placeholder="Viết câu trả lời...">
                                            <button @click="submitReply(post, cmt.id)" class="btn btn-link text-primary text-decoration-none fw-bold" style="font-size: 12px;">Gửi</button>
                                        </div>
                                    </div>
                                </div>

                                <div class="d-flex mt-3 align-items-center">
                                    <img :src="store.currentUser.avatar || store.defaultAvatar" class="rounded-circle me-2 object-fit-cover" width="32" height="32">
                                    <div class="input-group">
                                        <input v-model="post.newComment" @keyup.enter="addComment(post)" class="form-control rounded-pill bg-light border-0 px-3" placeholder="Viết bình luận công khai...">
                                        <button @click="addComment(post)" class="btn btn-link text-primary position-absolute end-0 z-3 text-decoration-none fw-bold" style="font-size: 14px;">Gửi</button>
                                    </div>
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
.page-background {
    background-color: #f0f2f5;
    background-image: linear-gradient(to bottom right, rgba(255,255,255,0.8), rgba(240,242,245,0.1)); 
    min-height: 100vh;
    padding-top: 20px; 
    margin-top: -1.5rem;
}
.bg-light-gray { background-color: #f0f2f5; }
.cursor-pointer { cursor: pointer; }
.hover-underline:hover { text-decoration: underline !important; }
.transition-btn:hover { background-color: #e4e6eb; }
.fade-in { animation: fadeIn 0.3s ease-in; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
</style>