import { reactive } from 'vue'

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const defaultCover = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

// 1. DỮ LIỆU USER MẪU
const seedUsers = [{
        id: 1,
        name: "Admin Hệ Thống",
        email: "admin@gmail.com",
        password: "123",
        avatar: "https://cdn-icons-png.flaticon.com/512/295/295128.png",
        cover: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e",
        friends: [2, 3],
        friendRequests: [],
        notifications: []
    },
    {
        id: 2,
        name: "Sơn Tùng M-TP",
        email: "sontung@gmail.com",
        password: "123",
        avatar: "https://media-cdn-v2.laodong.vn/storage/newsportal/2024/9/6/1390064/Yagi-Do-Bo.jpg",
        cover: defaultCover,
        friends: [1],
        friendRequests: [],
        notifications: []
    },
    {
        id: 3,
        name: "Reviewer Công Nghệ",
        email: "tech@gmail.com",
        password: "123",
        avatar: "https://cdn-icons-png.flaticon.com/512/428/428001.png",
        cover: defaultCover,
        friends: [1],
        friendRequests: [],
        notifications: []
    }
];

// 2. DỮ LIỆU BÀI VIẾT CHI TIẾT (SEED DATA)
const seedPosts = [{
        id: 101,
        userId: 1,
        title: 'Khai giảng FPT Polytechnic 2024',
        content: 'Không khí khai giảng tại FPT Polytechnic TP.HCM hôm nay thật sự bùng nổ! 🔥 Chào mừng các tân sinh viên K20. Chúc các bạn có một kỳ học thật rực rỡ.\n#FPT #Polytechnic #BackToSchool',
        image: 'https://caodang.fpt.edu.vn/wp-content/uploads/2022/08/9N4A0347.jpg',
        timestamp: new Date().toISOString(), // Mới nhất
        comments: [],
        likes: [2, 3], // 2 like
        shares: 5
    },
    {
        id: 102,
        userId: 3,
        title: 'Đánh giá iPhone 16 Pro Max',
        content: 'Trên tay iPhone 16 Pro Max màu Titan Sa Mạc mới. Nút bấm Camera Control khá thú vị nhưng cần thời gian làm quen. Hiệu năng A18 Pro quá khủng khiếp! \nAnh em thấy sao về màu mới này? #iPhone16 #Apple #Review',
        image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1000&auto=format&fit=crop',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 tiếng trước
        comments: [
            { id: 1, userId: 2, content: "Màu này nhìn sang quá!", timestamp: new Date().toISOString(), replies: [] }
        ],
        likes: [1],
        shares: 12
    },
    {
        id: 103,
        userId: 2,
        title: 'Đừng Làm Trái Tim Anh Đau - Sơn Tùng M-TP',
        content: 'Một món quà nhỏ tặng đại gia đình Sky. Hãy chờ đón siêu phẩm vào tối nay nhé! 🎵🎹 \n#SonTungMTP #Comeback #Music',
        // Link YouTube thật để test chức năng iframe
        image: 'https://www.youtube.com/watch?v=abPmZCzIqP8',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        comments: [],
        likes: [1, 3, 4, 5, 6, 7, 8, 9, 10], // Nhiều like nhất -> Sẽ lên top "Phổ biến"
        shares: 999
    },
    {
        id: 104,
        userId: 1,
        title: 'Cảnh báo Bão số 3 (Yagi)',
        content: 'Cập nhật tình hình Bão số 3: Sức gió giật cấp 17, mọi người hạn chế ra đường và gia cố nhà cửa nhé. Mong bình an cho mọi người! 🙏 #Bão #Weather',
        image: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2024/9/6/1390064/Yagi-Do-Bo.jpg',
        timestamp: new Date(Date.now() - 10000000).toISOString(),
        comments: [],
        likes: [2, 3],
        shares: 50
    },
    {
        id: 105,
        userId: 3,
        title: 'Black Myth: Wukong - Game of the Year?',
        content: 'Đồ họa đỉnh cao, cốt truyện lôi cuốn. Wukong thực sự là niềm tự hào của game Á Đông năm nay. Đã ai đánh bại được con Boss đầu tiên chưa? 🎮🐒 #Wukong #Game #BlackMyth',
        // Link YouTube ngắn (youtu.be) để test chức năng parser
        image: 'https://youtu.be/1k0j57_q39o?si=sample',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 ngày trước
        comments: [],
        likes: [1, 2],
        shares: 2
    },
    {
        id: 106,
        userId: 1,
        title: 'Học Java Spring Boot cơ bản',
        content: 'Chia sẻ lộ trình học Java Spring Boot cho người mới bắt đầu. Từ Core đến JPA, Security. Ai cần tài liệu comment bên dưới nhé! 👇 #Java #Code #SpringBoot',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
        timestamp: new Date(Date.now() - 100000000).toISOString(),
        comments: [],
        likes: [2],
        shares: 20
    }
];

// Lấy dữ liệu từ LocalStorage hoặc dùng dữ liệu mẫu nếu chưa có
const storedPosts = JSON.parse(localStorage.getItem('poly_posts_db'));
// Nếu LocalStorage rỗng hoặc ít bài quá, thì lấy seedPosts đè vào để test
const finalPosts = (!storedPosts || storedPosts.length < 3) ? seedPosts : storedPosts;

export const store = reactive({
    currentUser: JSON.parse(localStorage.getItem('poly_user')) || null,
    users: JSON.parse(localStorage.getItem('poly_users_db')) || seedUsers,
    posts: finalPosts,

    // --- DARK MODE ---
    theme: localStorage.getItem('poly_theme') || 'light',

    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-bs-theme', this.theme);
        localStorage.setItem('poly_theme', this.theme);
    },

    initTheme() {
        document.documentElement.setAttribute('data-bs-theme', this.theme);
    },

    // --- DATABASE ---
    saveDB() {
        localStorage.setItem('poly_users_db', JSON.stringify(this.users));
        localStorage.setItem('poly_posts_db', JSON.stringify(this.posts));
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