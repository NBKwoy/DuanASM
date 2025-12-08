import { reactive } from 'vue'
import axios from 'axios'

// Cấu hình URL của API
const API_URL = "http://localhost:3000"; 

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const defaultCover = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

export const store = reactive({
    // State
    currentUser: JSON.parse(localStorage.getItem('poly_user')) || null,
    users: [], 
    posts: [], 
    theme: localStorage.getItem('poly_theme') || 'light',

    // --- API ACTIONS (Tương tác với Server) ---

    // 1. Lấy danh sách Users
    async fetchUsers() {
        try {
            const res = await axios.get(`${API_URL}/users`);
            this.users = res.data;
            if(this.currentUser) {
                const found = this.users.find(u => u.id === this.currentUser.id);
                if(found) this.currentUser = found;
            }
        } catch (error) { console.error("Lỗi lấy users:", error); }
    },

    // 2. Lấy danh sách Bài viết
    async fetchPosts() {
        try {
            const res = await axios.get(`${API_URL}/posts`);
            this.posts = res.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } catch (error) { console.error("Lỗi lấy posts:", error); }
    },

    // 3. Đăng bài mới (POST)
    async addPost(post) {
        try {
            const res = await axios.post(`${API_URL}/posts`, post);
            this.posts.unshift(res.data);
        } catch (error) {
            console.error("Lỗi đăng bài:", error);
            alert("Lỗi kết nối Server!");
        }
    },

    // 4. Cập nhật bài viết (PATCH) - THÊM MỚI
    async updatePost(postId, newContent) {
        try {
            const res = await axios.patch(`${API_URL}/posts/${postId}`, newContent);
            const index = this.posts.findIndex(p => p.id === postId);
            if (index !== -1) {
                this.posts[index] = { ...this.posts[index], ...res.data };
            }
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            alert("Không thể cập nhật bài viết!");
        }
    },

    // 5. Xóa bài viết (DELETE) - THÊM MỚI
    async deletePost(postId) {
        if(!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
        try {
            await axios.delete(`${API_URL}/posts/${postId}`);
            this.posts = this.posts.filter(p => p.id !== postId);
        } catch (error) {
            console.error("Lỗi xóa bài:", error);
            alert("Không thể xóa bài viết!");
        }
    },

    // --- CÁC HÀM LOCAL (THEME & AUTH) ---
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-bs-theme', this.theme);
        localStorage.setItem('poly_theme', this.theme);
    },
    initTheme() {
        document.documentElement.setAttribute('data-bs-theme', this.theme);
    },
    saveUser() {
        if (this.currentUser) localStorage.setItem('poly_user', JSON.stringify(this.currentUser));
        else localStorage.removeItem('poly_user');
    },
    // Hàm saveDB cũ có thể bỏ hoặc giữ lại nhưng để trống vì giờ dùng API rồi
    saveDB() {}, 
    logout() {
        this.currentUser = null;
        this.saveUser();
    },
    defaultAvatar,
    defaultCover,

    // HÀM GỬI THÔNG BÁO (MỚI THÊM)
// Trong src/store.js
    
    async addNotification(notification) {
        try {
            // 1. Lấy thông tin người nhận
            const resUser = await axios.get(`${API_URL}/users/${notification.toUserId}`);
            const receiver = resUser.data;

            // --- SỬA ĐOẠN NÀY: Kiểm tra nếu chưa có mảng thì tạo mới ---
            if (!receiver.notifications) {
                receiver.notifications = [];
            }
            // -----------------------------------------------------------

            // 2. Tạo thông báo
            const newNoti = {
                id: Date.now(),
                fromId: this.currentUser.id,
                ...notification,
                timestamp: new Date().toISOString(),
                isRead: false
            };

            // 3. Thêm vào đầu danh sách
            receiver.notifications.unshift(newNoti);

            // 4. Lưu lên Server
            await axios.patch(`${API_URL}/users/${notification.toUserId}`, {
                notifications: receiver.notifications
            });
            
            console.log("Gửi thông báo thành công!"); // Mở F12 Console để xem dòng này có hiện không

        } catch (error) {
            console.error("Lỗi gửi thông báo:", error);
        }
    },

});