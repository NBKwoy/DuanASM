// Composable để quản lý post logic
import { ref } from 'vue';
import { store } from '../store-supabase';
import { getUserName, getUserAvatar, formatDate } from '../utils/helpers';

export function usePost() {
    const selectedPost = ref(null);
    const showModal = ref(false);

    const openPostModal = (post) => {
        selectedPost.value = { ...post };
        showModal.value = true;
    };

    const closeModal = () => {
        showModal.value = false;
        selectedPost.value = null;
    };

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
    };

    const addComment = (post) => {
        if (!post.newComment || !post.newComment.trim()) return;
        if (!post.comments) post.comments = [];
        
        post.comments.push({
            id: Date.now(),
            userId: store.currentUser.id,
            content: post.newComment.trim(),
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

    return {
        selectedPost,
        showModal,
        openPostModal,
        closeModal,
        toggleLike,
        handleShare,
        addComment
    };
}

