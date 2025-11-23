<script setup>
import { reactive } from 'vue';

// Khai báo emit để gửi dữ liệu ra ngoài
const emit = defineEmits(['search-trend']);

// Dữ liệu mẫu (Thêm hashtag để tìm kiếm chính xác hơn)
const trends = reactive([
    { id: 1, title: 'FPT Polytechnic', keyword: 'FPT', views: '1.2M', type: 'hot' },
    { id: 2, title: 'Black Myth: Wukong', keyword: 'Wukong', views: '980K', type: 'game' },
    { id: 3, title: 'Bão số 3', keyword: 'Bão', views: '850K', type: 'news' },
    { id: 4, title: 'iPhone 16', keyword: 'iPhone', views: '600K', type: 'tech' },
    { id: 5, title: 'Trung thu', keyword: 'bánh', views: '450K', type: 'life' },
    { id: 6, title: 'VueJS', keyword: 'Vue', views: '320K', type: 'code' },
    { id: 7, title: 'Sơn Tùng MTP', keyword: 'Sơn Tùng', views: '290K', type: 'music' },
    { id: 8, title: 'Java', keyword: 'Java', views: '150K', type: 'code' },
]);

// ... (Giữ nguyên các hàm getRankColor, getBadge cũ) ...
const getRankColor = (index) => {
    if (index === 0) return 'bg-danger'; if (index === 1) return 'bg-warning'; if (index === 2) return 'bg-info'; return 'bg-secondary bg-opacity-25 text-dark';
};
const getBadge = (type) => {
    switch(type) { case 'hot': return { text: 'Hot', class: 'bg-danger' }; case 'new': return { text: 'Mới', class: 'bg-success' }; case 'game': return { text: 'Game', class: 'bg-primary' }; case 'news': return { text: 'Tin', class: 'bg-dark' }; default: return null; }
};
</script>

<template>
    <div class="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
        <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
            <h6 class="fw-bold mb-0 text-primary"><i class="fas fa-fire-alt me-2"></i>Tìm kiếm nổi bật</h6>
        </div>

        <div class="list-group list-group-flush">
            <a href="#" 
               v-for="(item, index) in trends" :key="item.id" 
               @click.prevent="emit('search-trend', item.keyword)"
               class="list-group-item list-group-item-action border-0 py-2 d-flex align-items-center px-3 hover-bg">
                
                <span :class="getRankColor(index)" class="badge rounded py-1 px-2 me-3" style="min-width: 25px;">{{ index + 1 }}</span>
                
                <div class="flex-grow-1 overflow-hidden">
                    <div class="d-flex align-items-center mb-1">
                        <span class="fw-semibold text-truncate me-2">{{ item.title }}</span>
                        <span v-if="getBadge(item.type)" :class="getBadge(item.type).class" class="badge rounded-1" style="font-size: 10px;">{{ getBadge(item.type).text }}</span>
                    </div>
                    <small class="text-muted" style="font-size: 11px;">{{ item.views }} lượt quan tâm</small>
                </div>
            </a>
        </div>
    </div>
</template>

<style scoped>
.hover-bg:hover { background-color: #f8f9fa; cursor: pointer; }
</style>