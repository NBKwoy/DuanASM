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
    },
    {
        id: 3,
        name: "Trần Thị B",
        email: "tranthib@gmail.com",
        password: "123",
        avatar: "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
        cover: defaultCover,
        friends: [],
        friendRequests: [],
        notifications: []
    },
    {
        id: 4,
        name: "Lê Văn C",
        email: "levanc@gmail.com",
        password: "123",
        avatar: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        cover: defaultCover,
        friends: [],
        friendRequests: [],
        notifications: []
    },
    {
        id: 5,
        name: "Phạm Thị D",
        email: "phamthid@gmail.com",
        password: "123",
        avatar: "https://cdn-icons-png.flaticon.com/512/4333/4333609.png",
        cover: defaultCover,
        friends: [],
        friendRequests: [],
        notifications: []
    }
];

// Tạo dữ liệu mẫu cho posts
const generateSeedPosts = () => {
    const now = new Date();
    const posts = [];
    
    // Helper để tạo timestamp cách đây N giờ
    const hoursAgo = (hours) => {
        const date = new Date(now);
        date.setHours(date.getHours() - hours);
        return date.toISOString();
    };
    
    // Post 1 - Nhiều likes
    posts.push({
        id: 1001,
        userId: 1,
        title: "Chào mừng đến với Social Internet!",
        content: "Đây là nền tảng mạng xã hội mới của chúng tôi. Hãy chia sẻ những khoảnh khắc đẹp của bạn với mọi người! 🎉\n\n#SocialInternet #Welcome",
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
        timestamp: hoursAgo(2),
        comments: [
            {
                id: 2001,
                userId: 2,
                content: "Rất vui được tham gia!",
                timestamp: hoursAgo(1.5),
                replies: [
                    {
                        id: 3001,
                        userId: 1,
                        content: "Cảm ơn bạn đã tham gia!",
                        timestamp: hoursAgo(1.4)
                    }
                ]
            },
            {
                id: 2002,
                userId: 3,
                content: "Giao diện đẹp quá! 👍",
                timestamp: hoursAgo(1),
                replies: []
            }
        ],
        likes: [1, 2, 3, 4, 5],
        shares: 3,
        isEditing: false
    });
    
    // Post 2 - Bài viết về công nghệ
    posts.push({
        id: 1002,
        userId: 2,
        title: "Vue.js 3 - Framework tuyệt vời!",
        content: "Vừa học xong Vue.js 3 và thấy nó thật sự mạnh mẽ. Composition API giúp code dễ đọc và maintain hơn rất nhiều.\n\nBạn nào đã dùng Vue.js chưa?",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
        timestamp: hoursAgo(5),
        comments: [
            {
                id: 2003,
                userId: 1,
                content: "Đúng rồi! Vue 3 rất tốt cho performance",
                timestamp: hoursAgo(4.5),
                replies: []
            },
            {
                id: 2004,
                userId: 4,
                content: "Mình cũng đang học, có thể share tài liệu không?",
                timestamp: hoursAgo(4),
                replies: [
                    {
                        id: 3002,
                        userId: 2,
                        content: "Chắc chắn rồi! Mình sẽ gửi link sau",
                        timestamp: hoursAgo(3.9)
                    }
                ]
            }
        ],
        likes: [1, 2, 4, 5],
        shares: 2,
        isEditing: false
    });
    
    // Post 3 - Không có hình ảnh
    posts.push({
        id: 1003,
        userId: 3,
        title: "",
        content: "Hôm nay trời đẹp quá! Ai đi cafe không? ☕\n\nMình đang ở quán cafe gần công viên, view đẹp lắm!",
        image: "",
        timestamp: hoursAgo(8),
        comments: [
            {
                id: 2005,
                userId: 2,
                content: "Mình đi với!",
                timestamp: hoursAgo(7.5),
                replies: []
            }
        ],
        likes: [2, 3, 4],
        shares: 1,
        isEditing: false
    });
    
    // Post 4 - Bài viết về du lịch
    posts.push({
        id: 1004,
        userId: 4,
        title: "Chuyến du lịch Đà Lạt",
        content: "Vừa về từ Đà Lạt, cảnh đẹp không thể tả nổi! 🌸\n\nĐặc biệt là hoa anh đào đang nở rộ, ai có kế hoạch đi Đà Lạt thì nên đi ngay nhé!",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        timestamp: hoursAgo(12),
        comments: [
            {
                id: 2006,
                userId: 1,
                content: "Ảnh đẹp quá! Mình cũng muốn đi",
                timestamp: hoursAgo(11.5),
                replies: []
            },
            {
                id: 2007,
                userId: 3,
                content: "Bạn đi mấy ngày vậy?",
                timestamp: hoursAgo(11),
                replies: [
                    {
                        id: 3003,
                        userId: 4,
                        content: "Mình đi 3 ngày 2 đêm, đủ để tham quan các điểm nổi tiếng",
                        timestamp: hoursAgo(10.9)
                    }
                ]
            },
            {
                id: 2008,
                userId: 5,
                content: "Đà Lạt mùa này lạnh không bạn?",
                timestamp: hoursAgo(10.5),
                replies: []
            }
        ],
        likes: [1, 2, 3, 5],
        shares: 5,
        isEditing: false
    });
    
    // Post 5 - Bài viết về ẩm thực
    posts.push({
        id: 1005,
        userId: 5,
        title: "Công thức làm bánh mì tại nhà",
        content: "Hôm nay mình thử làm bánh mì tại nhà, kết quả khá ổn! 🍞\n\nNguyên liệu:\n- Bột mì 500g\n- Men nở 5g\n- Nước ấm 300ml\n- Muối, đường\n\nAi muốn thử thì comment nhé!",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800",
        timestamp: hoursAgo(15),
        comments: [
            {
                id: 2009,
                userId: 2,
                content: "Nhìn ngon quá! Mình sẽ thử làm cuối tuần",
                timestamp: hoursAgo(14.5),
                replies: []
            }
        ],
        likes: [1, 2, 3],
        shares: 2,
        isEditing: false
    });
    
    // Post 6 - Bài viết về học tập
    posts.push({
        id: 1006,
        userId: 1,
        title: "Tips học lập trình hiệu quả",
        content: "Chia sẻ một số tips học lập trình mà mình đã áp dụng:\n\n1. Code mỗi ngày, dù chỉ 30 phút\n2. Làm project thực tế\n3. Đọc code của người khác\n4. Tham gia cộng đồng\n\nBạn có tips nào khác không?",
        image: "",
        timestamp: hoursAgo(20),
        comments: [
            {
                id: 2010,
                userId: 4,
                content: "Mình thấy việc giải thích code cho người khác cũng rất hiệu quả",
                timestamp: hoursAgo(19.5),
                replies: [
                    {
                        id: 3004,
                        userId: 1,
                        content: "Đúng rồi! Teaching is the best way to learn",
                        timestamp: hoursAgo(19.4)
                    }
                ]
            }
        ],
        likes: [2, 3, 4, 5],
        shares: 4,
        isEditing: false
    });
    
    // Post 7 - Bài viết về thể thao
    posts.push({
        id: 1007,
        userId: 2,
        title: "",
        content: "Vừa chạy bộ 5km xong! Cảm giác thật tuyệt vời 🏃‍♂️\n\nAi cũng tập thể dục đi, sức khỏe là vàng!",
        image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
        timestamp: hoursAgo(24),
        comments: [],
        likes: [1, 3, 5],
        shares: 1,
        isEditing: false
    });
    
    // Post 8 - Bài viết về phim
    posts.push({
        id: 1008,
        userId: 3,
        title: "Review phim mới ra rạp",
        content: "Vừa xem xong bộ phim mới, rating 8/10! 🎬\n\nDiễn xuất tốt, cốt truyện hay, nhưng phần kết hơi vội. Ai đã xem chưa?",
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800",
        timestamp: hoursAgo(30),
        comments: [
            {
                id: 2011,
                userId: 5,
                content: "Mình cũng vừa xem, đồng ý phần kết hơi vội",
                timestamp: hoursAgo(29.5),
                replies: []
            }
        ],
        likes: [1, 2, 4, 5],
        shares: 3,
        isEditing: false
    });
    
    // Post 9 - Bài viết về sách
    posts.push({
        id: 1009,
        userId: 4,
        title: "Sách hay nên đọc: 'Clean Code'",
        content: "Đang đọc cuốn 'Clean Code' của Robert C. Martin. Sách rất hay, giúp mình hiểu cách viết code sạch và dễ maintain hơn.\n\nAi đã đọc chưa?",
        image: "",
        timestamp: hoursAgo(36),
        comments: [
            {
                id: 2012,
                userId: 1,
                content: "Cuốn này là must-read cho developer!",
                timestamp: hoursAgo(35.5),
                replies: []
            }
        ],
        likes: [1, 2, 3],
        shares: 2,
        isEditing: false
    });
    
    // Post 10 - Bài viết về âm nhạc
    posts.push({
        id: 1010,
        userId: 5,
        title: "",
        content: "Đang nghe playlist mới, có bài nào hay không mọi người? 🎵\n\nMình thích nhạc acoustic và indie, ai có recommend không?",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800",
        timestamp: hoursAgo(40),
        comments: [
            {
                id: 2013,
                userId: 2,
                content: "Thử nghe Ed Sheeran xem, hay lắm!",
                timestamp: hoursAgo(39.5),
                replies: [
                    {
                        id: 3005,
                        userId: 5,
                        content: "Cảm ơn bạn, mình sẽ thử nghe",
                        timestamp: hoursAgo(39.4)
                    }
                ]
            }
        ],
        likes: [2, 3, 4],
        shares: 1,
        isEditing: false
    });
    
    // Post 11 - Bài viết nhiều likes
    posts.push({
        id: 1011,
        userId: 1,
        title: "Cảm ơn tất cả mọi người!",
        content: "Cảm ơn tất cả các bạn đã tham gia và ủng hộ nền tảng này! 🙏\n\nChúng tôi sẽ tiếp tục cải thiện để mang đến trải nghiệm tốt nhất cho các bạn.",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
        timestamp: hoursAgo(48),
        comments: [
            {
                id: 2014,
                userId: 2,
                content: "Cảm ơn team đã tạo ra nền tảng tuyệt vời!",
                timestamp: hoursAgo(47.5),
                replies: []
            },
            {
                id: 2015,
                userId: 3,
                content: "Ủng hộ hết mình!",
                timestamp: hoursAgo(47),
                replies: []
            },
            {
                id: 2016,
                userId: 4,
                content: "Keep up the good work!",
                timestamp: hoursAgo(46.5),
                replies: []
            }
        ],
        likes: [1, 2, 3, 4, 5],
        shares: 8,
        isEditing: false
    });
    
    // Post 12 - Bài viết về game
    posts.push({
        id: 1012,
        userId: 2,
        title: "Game mới ra mắt",
        content: "Vừa thử game mới, gameplay khá hay! 🎮\n\nAi chơi rồi cho mình biết cảm nhận nhé!",
        image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800",
        timestamp: hoursAgo(50),
        comments: [],
        likes: [1, 3],
        shares: 0,
        isEditing: false
    });
    
    // Post 13 - Bài viết về thiên nhiên
    posts.push({
        id: 1013,
        userId: 3,
        title: "Hoàng hôn đẹp quá!",
        content: "Chụp được ảnh hoàng hôn đẹp quá, chia sẻ với mọi người! 🌅\n\nThiên nhiên thật kỳ diệu phải không?",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        timestamp: hoursAgo(55),
        comments: [
            {
                id: 2017,
                userId: 4,
                content: "Ảnh đẹp quá! Bạn chụp ở đâu vậy?",
                timestamp: hoursAgo(54.5),
                replies: [
                    {
                        id: 3006,
                        userId: 3,
                        content: "Mình chụp ở bãi biển Vũng Tàu",
                        timestamp: hoursAgo(54.4)
                    }
                ]
            }
        ],
        likes: [1, 2, 4, 5],
        shares: 2,
        isEditing: false
    });
    
    // Post 14 - Bài viết về công việc
    posts.push({
        id: 1014,
        userId: 4,
        title: "Work from home tips",
        content: "Làm việc tại nhà cần có kỷ luật! 💼\n\nMột số tips:\n- Tạo không gian làm việc riêng\n- Lập lịch làm việc cụ thể\n- Nghỉ giải lao đều đặn\n- Giao tiếp với team thường xuyên",
        image: "",
        timestamp: hoursAgo(60),
        comments: [
            {
                id: 2018,
                userId: 5,
                content: "Mình cũng đang WFH, tips rất hữu ích!",
                timestamp: hoursAgo(59.5),
                replies: []
            }
        ],
        likes: [1, 2, 5],
        shares: 3,
        isEditing: false
    });
    
    // Post 15 - Bài viết về động vật
    posts.push({
        id: 1015,
        userId: 5,
        title: "Chú mèo dễ thương",
        content: "Chú mèo nhà mình ngủ say quá! 😸\n\nAi cũng có thú cưng không?",
        image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800",
        timestamp: hoursAgo(65),
        comments: [
            {
                id: 2019,
                userId: 1,
                content: "Dễ thương quá!",
                timestamp: hoursAgo(64.5),
                replies: []
            },
            {
                id: 2020,
                userId: 2,
                content: "Mình cũng có mèo, giống này đúng không?",
                timestamp: hoursAgo(64),
                replies: []
            }
        ],
        likes: [1, 2, 3, 4],
        shares: 4,
        isEditing: false
    });
    
    // Post 16 - Bài viết về sức khỏe
    posts.push({
        id: 1016,
        userId: 1,
        title: "Uống đủ nước mỗi ngày",
        content: "Nhắc nhở mọi người nhớ uống đủ nước nhé! 💧\n\nMỗi ngày nên uống ít nhất 2 lít nước để cơ thể khỏe mạnh.",
        image: "",
        timestamp: hoursAgo(70),
        comments: [],
        likes: [2, 3, 4, 5],
        shares: 2,
        isEditing: false
    });
    
    // Post 17 - Bài viết về thời trang
    posts.push({
        id: 1017,
        userId: 2,
        title: "",
        content: "Outfit mới cho mùa hè! 👗\n\nAi cũng thích mix & match không?",
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800",
        timestamp: hoursAgo(75),
        comments: [
            {
                id: 2021,
                userId: 3,
                content: "Đẹp quá! Bạn mua ở đâu vậy?",
                timestamp: hoursAgo(74.5),
                replies: []
            }
        ],
        likes: [1, 3, 4, 5],
        shares: 3,
        isEditing: false
    });
    
    // Post 18 - Bài viết về nấu ăn
    posts.push({
        id: 1018,
        userId: 3,
        title: "Món phở bò tự nấu",
        content: "Hôm nay thử nấu phở bò tại nhà, thành công! 🍜\n\nNước dùng ngọt, thịt mềm, ai muốn công thức thì comment nhé!",
        image: "https://images.unsplash.com/photo-1558030006-450675393462?w=800",
        timestamp: hoursAgo(80),
        comments: [
            {
                id: 2022,
                userId: 4,
                content: "Nhìn ngon quá! Cho mình công thức với",
                timestamp: hoursAgo(79.5),
                replies: [
                    {
                        id: 3007,
                        userId: 3,
                        content: "Mình sẽ gửi công thức chi tiết sau nhé!",
                        timestamp: hoursAgo(79.4)
                    }
                ]
            }
        ],
        likes: [1, 2, 4, 5],
        shares: 5,
        isEditing: false
    });
    
    // Post 19 - Bài viết về học ngoại ngữ
    posts.push({
        id: 1019,
        userId: 4,
        title: "Học tiếng Anh mỗi ngày",
        content: "Quyết tâm học tiếng Anh mỗi ngày! 📚\n\nMục tiêu: 30 phút mỗi ngày, học từ vựng và luyện nghe.\n\nAi muốn học cùng không?",
        image: "",
        timestamp: hoursAgo(85),
        comments: [
            {
                id: 2023,
                userId: 5,
                content: "Mình cũng đang học, học cùng nhau nhé!",
                timestamp: hoursAgo(84.5),
                replies: []
            }
        ],
        likes: [1, 2, 3, 5],
        shares: 2,
        isEditing: false
    });
    
    // Post 20 - Bài viết về cuối tuần
    posts.push({
        id: 1020,
        userId: 5,
        title: "Kế hoạch cuối tuần",
        content: "Cuối tuần này mình sẽ:\n- Đi cafe với bạn\n- Xem phim mới\n- Dọn dẹp nhà cửa\n- Nấu một bữa ngon\n\nBạn có kế hoạch gì cho cuối tuần không?",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
        timestamp: hoursAgo(90),
        comments: [
            {
                id: 2024,
                userId: 1,
                content: "Mình sẽ đi du lịch!",
                timestamp: hoursAgo(89.5),
                replies: []
            },
            {
                id: 2025,
                userId: 2,
                content: "Mình sẽ nghỉ ngơi ở nhà",
                timestamp: hoursAgo(89),
                replies: []
            }
        ],
        likes: [1, 2, 3, 4],
        shares: 1,
        isEditing: false
    });
    
    return posts;
};

// Load posts từ localStorage hoặc tạo mới
let seedPosts = [];
try {
    const savedPosts = localStorage.getItem('poly_posts_db');
    if (savedPosts) {
        seedPosts = JSON.parse(savedPosts);
    } else {
        seedPosts = generateSeedPosts();
    }
} catch (error) {
    console.error('Error loading posts from localStorage:', error);
    seedPosts = generateSeedPosts();
}

// Load users từ localStorage hoặc dùng seedUsers
let loadedUsers = seedUsers;
try {
    const savedUsers = localStorage.getItem('poly_users_db');
    if (savedUsers) {
        loadedUsers = JSON.parse(savedUsers);
    }
} catch (error) {
    console.error('Error loading users from localStorage:', error);
    loadedUsers = seedUsers;
}

// Load currentUser từ localStorage
let loadedCurrentUser = null;
try {
    const savedUser = localStorage.getItem('poly_user');
    if (savedUser) {
        loadedCurrentUser = JSON.parse(savedUser);
    }
} catch (error) {
    console.error('Error loading currentUser from localStorage:', error);
    loadedCurrentUser = null;
}

// Load templates từ localStorage
let loadedTemplates = [];
try {
    const savedTemplates = localStorage.getItem('poly_post_templates');
    if (savedTemplates) {
        loadedTemplates = JSON.parse(savedTemplates);
    }
} catch (error) {
    console.error('Error loading templates from localStorage:', error);
    loadedTemplates = [];
}

export const store = reactive({
    currentUser: loadedCurrentUser,
    users: loadedUsers,
    posts: seedPosts,
    templates: loadedTemplates,

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