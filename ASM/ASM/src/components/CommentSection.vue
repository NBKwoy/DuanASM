<script setup>
import { reactive } from 'vue';
import { store } from '../store';

const props = defineProps({
    comments: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['reply']);

const replyState = reactive({});

const getUserName = (id) => store.users.find(u => u.id === id)?.name || 'Unknown';
const getUserAvatar = (id) => store.users.find(u => u.id === id)?.avatar || store.defaultAvatar;
const formatDate = (iso) => new Date(iso).toLocaleString('vi-VN');

const toggleReplyInput = (parentId, replyToUser = null) => {
    replyState[`show_${parentId}`] = !replyState[`show_${parentId}`];
    if (replyToUser) {
        const name = getUserName(replyToUser);
        replyState[parentId] = `@${name} `;
    } else {
        replyState[parentId] = '';
    }
};

const submitReply = (parentCommentId) => {
    const content = replyState[parentCommentId];
    if (!content) return;
    emit('reply', parentCommentId, content);
    replyState[parentCommentId] = '';
};
</script>

<template>
    <div>
        <div v-for="cmt in comments" :key="cmt.id" class="mb-3">
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
                    <input 
                        v-model="replyState[cmt.id]" 
                        @keyup.enter="submitReply(cmt.id)" 
                        class="form-control rounded-pill bg-light border-0 px-3" 
                        placeholder="Viết câu trả lời...">
                    <button @click="submitReply(cmt.id)" class="btn btn-link text-primary text-decoration-none fw-bold" style="font-size: 12px;">Gửi</button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.bg-light-gray {
    background-color: #f0f2f5;
}
.cursor-pointer {
    cursor: pointer;
}
.hover-underline:hover {
    text-decoration: underline !important;
}
.fade-in {
    animation: fadeIn 0.3s ease-in;
}
@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}
</style>

