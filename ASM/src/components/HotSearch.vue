<script setup>
import { reactive } from 'vue';

// Khai báo emit
const emit = defineEmits(['search-trend']);

// Dữ liệu mẫu
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

// Hàm lấy màu cho Top 3 (Vàng, Bạc, Đồng)
const getRankStyle = (index) => {
    if (index === 0) return 'text-warning rank-1'; // Vàng
    if (index === 1) return 'text-secondary rank-2'; // Bạc
    if (index === 2) return 'text-brown rank-3'; // Đồng
    return 'text-muted opacity-50'; // Các hạng sau
};

// Badge loại tin
const getBadge = (type) => {
    switch(type) { 
        case 'hot': return { text: 'Hot', class: 'bg-danger-subtle text-danger' }; 
        case 'new': return { text: 'Mới', class: 'bg-success-subtle text-success' }; 
        case 'game': return { text: 'Game', class: 'bg-primary-subtle text-primary' }; 
        case 'news': return { text: 'Tin', class: 'bg-dark-subtle text-dark' }; 
        case 'tech': return { text: 'Tech', class: 'bg-info-subtle text-info' };
        default: return null; 
    }
};
</script>

<template>
    <div class="card border-0 shadow rounded-4 mb-4 overflow-hidden trend-card">
        <div class="card-header border-0 py-3 d-flex justify-content-between align-items-center bg-gradient-primary text-white">
            <h6 class="fw-bold mb-0 fs-5"><i class="fas fa-chart-line me-2"></i>Xu hướng hôm nay</h6>
            <i class="fas fa-ellipsis-h opacity-75 cursor-pointer"></i>
        </div>

        <div class="list-group list-group-flush p-2">
            <a href="#" 
               v-for="(item, index) in trends" :key="item.id" 
               @click.prevent="emit('search-trend', item.keyword)"
               class="list-group-item list-group-item-action border-0 py-3 d-flex align-items-center rounded-3 mb-1 trend-item">
                
                <div class="fw-black fs-4 me-3 text-center" style="min-width: 30px;" :class="getRankStyle(index)">
                    {{ index + 1 }}
                </div>
                
                <div class="flex-grow-1 overflow-hidden">
                    <div class="d-flex align-items-center justify-content-between mb-1">
                        <span class="fw-bold text-dark text-truncate">{{ item.title }}</span>
                        <small v-if="index < 3" class="text-danger"><i class="fas fa-arrow-up"></i></small>
                    </div>
                    
                    <div class="d-flex align-items-center gap-2">
                        <span v-if="getBadge(item.type)" :class="getBadge(item.type).class" class="badge rounded-pill fw-normal px-2">
                            {{ getBadge(item.type).text }}
                        </span>
                        <small class="text-muted" style="font-size: 12px;">{{ item.views }} lượt xem</small>
                    </div>
                </div>
            </a>
        </div>
        
        <div class="card-footer bg-white border-0 text-center pb-3">
             <button class="btn btn-link text-decoration-none text-primary fw-bold text-sm">Xem thêm <i class="fas fa-chevron-down ms-1"></i></button>
        </div>
    </div>
</template>

<style scoped>
/* Gradient cho Header */
.bg-gradient-primary {
    background: linear-gradient(45deg, #ff8200, #ff4d4d);
}

/* Màu cho Top 3 */
.rank-1 { color: #FFD700 !important; text-shadow: 1px 1px 2px rgba(0,0,0,0.1); }
.rank-2 { color: #C0C0C0 !important; }
.rank-3 { color: #CD7F32 !important; } /* Màu đồng */
.text-brown { color: #CD7F32; }

/* Font đậm cho số hạng */
.fw-black { font-weight: 900; font-family: 'Segoe UI', sans-serif; }

/* Hiệu ứng Hover cho từng dòng */
.trend-item {
    transition: all 0.2s ease;
}
.trend-item:hover {
    background-color: #fff5eb; /* Màu cam rất nhạt */
    transform: translateX(5px); /* Dịch chuyển nhẹ sang phải */
}

.trend-card {
    background: #fff;
}

/* Dark mode support (nếu App bật dark mode) */
[data-bs-theme="dark"] .trend-card {
    background-color: #242526;
}
[data-bs-theme="dark"] .trend-item:hover {
    background-color: #3a3b3c;
}
[data-bs-theme="dark"] .text-dark {
    color: #e4e6eb !important;
}
</style>