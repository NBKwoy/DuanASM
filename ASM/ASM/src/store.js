import { reactive } from 'vue'

// Dữ liệu mặc định nếu chưa có localStorage
const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export const store = reactive({
    currentUser: JSON.parse(localStorage.getItem('poly_user')) || null,
    users: JSON.parse(localStorage.getItem('poly_users_db')) || [],
    posts: JSON.parse(localStorage.getItem('poly_posts_db')) || [],
    
    // Hàm lưu dữ liệu
    saveDB() {
        localStorage.setItem('poly_users_db', JSON.stringify(this.users));
        localStorage.setItem('poly_posts_db', JSON.stringify(this.posts));
    },
    saveUser() {
        if(this.currentUser) localStorage.setItem('poly_user', JSON.stringify(this.currentUser));
        else localStorage.removeItem('poly_user');
    },
    logout() {
        this.currentUser = null;
        this.saveUser();
    },
    defaultAvatar
});