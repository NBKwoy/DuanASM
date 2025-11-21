import { reactive } from 'vue'

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
// Ảnh bìa mặc định (Hình thiên nhiên)
const defaultCover = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

const seedUsers = [{
        id: 1,
        name: "Admin Hệ Thống",
        email: "admin@gmail.com",
        password: "123",
        avatar: "https://cdn-icons-png.flaticon.com/512/295/295128.png",
        cover: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
        friends: [],
        friendRequests: [],
        notifications: []
    },
    {
        id: 2,
        name: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        password: "123",
        avatar: "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
        cover: defaultCover,
        friends: [],
        friendRequests: [],
        notifications: []
    }
];

// (Giữ nguyên seedPosts cũ của bạn hoặc dùng mảng rỗng nếu muốn)
const seedPosts = JSON.parse(localStorage.getItem('poly_posts_db')) || [];

export const store = reactive({
    currentUser: JSON.parse(localStorage.getItem('poly_user')) || null,
    users: JSON.parse(localStorage.getItem('poly_users_db')) || seedUsers,
    posts: seedPosts,
    templates: JSON.parse(localStorage.getItem('poly_post_templates')) || [],

    // --- DARK MODE STATE ---
    theme: localStorage.getItem('poly_theme') || 'light',

    // Toggle Dark Mode
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('poly_theme', this.theme);
        // Cập nhật thuộc tính data-bs-theme cho Bootstrap 5.3
        document.documentElement.setAttribute('data-bs-theme', this.theme);
    },

    // Khởi tạo theme khi load trang
    initTheme() {
        document.documentElement.setAttribute('data-bs-theme', this.theme);
    },

    saveDB() {
        localStorage.setItem('poly_users_db', JSON.stringify(this.users));
        localStorage.setItem('poly_posts_db', JSON.stringify(this.posts));
        localStorage.setItem('poly_post_templates', JSON.stringify(this.templates));
    },
    saveUser() {
        if (this.currentUser) localStorage.setItem('poly_user', JSON.stringify(this.currentUser));
        else localStorage.removeItem('poly_user');
    },
    logout() {
        this.currentUser = null;
        this.saveUser();
    },
    defaultAvatar,
    defaultCover
});