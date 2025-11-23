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
        name: "LowTech",
        email: "tech@gmail.com",
        password: "123",
        avatar: "https://scontent.fsgn5-8.fna.fbcdn.net/v/t39.30808-1/320533217_670382914572780_1357968041736338725_n.jpg?stp=dst-jpg_s200x200_tt6&_nc_cat=109&ccb=1-7&_nc_sid=2d3e12&_nc_eui2=AeF416B-wXldshlXaDgNltRGBJftrpQcobQEl-2ulByhtE8SrdoAwu8ZK3ob14RQXjc-8Sjxd116RhifY9K19nCi&_nc_ohc=sDGKagJLB-4Q7kNvwGu-PNJ&_nc_oc=AdmZsKWcK5Ld6C1dKzXPLY6Ih72sF6v1JDfHTJ5D1th4QdLtWG3_XuJVGqN2LW56Faz80cy0rpAG2JVKCImdKPII&_nc_zt=24&_nc_ht=scontent.fsgn5-8.fna&_nc_gid=stjoZcVX3ajRSwXRIs4ABg&oh=00_AfjjsVOyAcHSGBgABCt0HwLc0kY4LM3rCQlw4MPTe-A_cA&oe=69287F1Ds",
        cover: defaultCover,
        friends: [1],
        friendRequests: [],
        notifications: []
    }
];

// 2. DỮ LIỆU BÀI VIẾT CHI TIẾT (SEED DATA)
// Chứa các từ khóa: FPT, Wukong, Bão, iPhone, Video, Java...
const seedPosts = [{
        id: 101,
        userId: 1,
        title: 'Khai giảng FPT Polytechnic 2024',
        content: 'Không khí khai giảng tại FPT Polytechnic TP.HCM hôm nay thật sự bùng nổ! 🔥 Chào mừng các tân sinh viên K20. Chúc các bạn có một kỳ học thật rực rỡ.\n#FPT #Polytechnic #BackToSchool',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwdFzkI_TaXHVaOkU3lPF_oEjrbjfBUICQ8A&ss',
        timestamp: new Date().toISOString(), // Mới nhất
        comments: [],
        likes: [2, 3], // 2 like
        shares: 5
    },
    {
        id: 102,
        userId: 3,
        title: 'Đánh giá iPhone 17 Pro Max',
        content: 'Trên tay iPhone 17 Pro Max màu Titan Sa Mạc mới. Nút bấm Camera Control khá thú vị nhưng cần thời gian làm quen. Hiệu năng A18 Pro quá khủng khiếp! \nAnh em thấy sao về màu mới này? #iPhone16 #Apple #Review',
        image: 'https://cdn2.fptshop.com.vn/unsafe/828x0/filters:format(webp):quality(75)/iphone_17_pro_slide_1_c27e78032a.jpg',
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
        title: 'Trailer MV Mới - Sky ơi!',
        content: 'Một món quà nhỏ tặng đại gia đình Sky. Hãy chờ đón siêu phẩm vào tối nay nhé! 🎵🎹 \n#SonTungMTP #Comeback #Music',
        // Giả lập Video bằng đuôi .mp4 để bộ lọc nhận diện
        image: 'https://www.youtube.com/watch?v=abPmZCZZrFA&list=RDabPmZCZZrFA&start_radio=1',
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
        image: 'https://www.youtube.com/watch?v=u83VdXAVq08',
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

    theme: localStorage.getItem('poly_theme') || 'light',

    initTheme() {
        document.documentElement.setAttribute('data-bs-theme', this.theme);
    },
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