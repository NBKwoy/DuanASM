/**
 * Store với Supabase
 * Thay thế localStorage bằng Supabase database
 */

import { reactive, ref } from 'vue'
import { supabase, useSupabase } from './config/supabase'

const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
const defaultCover = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80";

// Seed data mẫu (dùng khi chưa có dữ liệu)
const seedUsers = [
    {
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

// State
const currentUser = ref(null);
const users = ref([]);
const posts = ref([]);
const loading = ref(false);

// Kiểm tra có dùng Supabase không
const hasSupabase = useSupabase();

// ===== SUPABASE FUNCTIONS =====

/**
 * Load users từ Supabase
 * Nếu chưa có dữ liệu, tự động seed dữ liệu mẫu
 */
const loadUsers = async () => {
    if (!hasSupabase) {
        // Fallback: dùng localStorage
        const saved = localStorage.getItem('poly_users_db');
        if (saved) {
            users.value = JSON.parse(saved);
        } else {
            // Seed data vào localStorage
            users.value = seedUsers;
            localStorage.setItem('poly_users_db', JSON.stringify(seedUsers));
        }
        return;
    }

    try {
        loading.value = true;
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Nếu chưa có dữ liệu, tự động seed
        if (!data || data.length === 0) {
            console.log('Chưa có dữ liệu, đang seed dữ liệu mẫu...');
            try {
                await seedUsersToSupabase();
                // Load lại sau khi seed
                const { data: newData, error: loadError } = await supabase
                    .from('users')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (loadError) throw loadError;
                
                users.value = (newData || []).map(u => ({
                    ...u,
                    friendRequests: u.friend_requests || [],
                    friends: u.friends || []
                }));
            } catch (seedError) {
                console.error('Lỗi khi seed users, dùng dữ liệu mẫu local:', seedError);
                users.value = seedUsers;
            }
        } else {
            // Convert format
            users.value = (data || []).map(u => ({
                ...u,
                friendRequests: u.friend_requests || [],
                friends: u.friends || []
            }));
        }
    } catch (error) {
        console.error('Error loading users:', error);
        // Fallback về localStorage nếu có lỗi
        const saved = localStorage.getItem('poly_users_db');
        users.value = saved ? JSON.parse(saved) : seedUsers;
    } finally {
        loading.value = false;
    }
};

/**
 * Seed dữ liệu users mẫu vào Supabase
 */
const seedUsersToSupabase = async () => {
    if (!hasSupabase) return;
    
    try {
        // Insert từng user và kiểm tra lỗi
        for (const user of seedUsers) {
            const { error } = await supabase.from('users').insert([{
                name: user.name,
                email: user.email,
                password: user.password,
                avatar: user.avatar,
                friends: user.friends,
                friend_requests: user.friendRequests,
                notifications: user.notifications
            }]);
            
            if (error) {
                // Nếu lỗi do duplicate email, bỏ qua (đã có user rồi)
                if (error.code === '23505') {
                    console.log(`User ${user.email} đã tồn tại, bỏ qua...`);
                    continue;
                }
                throw error;
            }
        }
        console.log('✅ Đã seed users thành công!');
    } catch (error) {
        console.error('Error seeding users:', error);
        throw error; // Re-throw để caller biết có lỗi
    }
};

/**
 * Tạo dữ liệu posts mẫu
 */
const generateSeedPosts = () => {
    const now = new Date();
    const posts = [];
    
    const hoursAgo = (hours) => {
        const date = new Date(now);
        date.setHours(date.getHours() - hours);
        return date.toISOString();
    };
    
    // Post 1 - Nhiều likes
    posts.push({
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
        shares: 3
    });
    
    // Post 2 - Bài viết về công nghệ
    posts.push({
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
            }
        ],
        likes: [1, 2, 4, 5],
        shares: 2
    });
    
    // Thêm thêm 18 posts nữa (tổng 20 posts)
    for (let i = 3; i <= 20; i++) {
        posts.push({
            userId: ((i - 1) % 5) + 1,
            title: i % 2 === 0 ? `Bài viết số ${i}` : "",
            content: `Đây là nội dung bài viết mẫu số ${i}. Chia sẻ những khoảnh khắc đẹp trong cuộc sống! 🌟`,
            image: i % 3 === 0 ? "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800" : "",
            timestamp: hoursAgo(i * 2),
            comments: [],
            likes: [1, 2].slice(0, i % 3),
            shares: i % 4
        });
    }
    
    return posts;
};

/**
 * Seed dữ liệu posts mẫu vào Supabase
 */
const seedPostsToSupabase = async () => {
    if (!hasSupabase) return;
    
    try {
        const seedPosts = generateSeedPosts();
        
        // Insert từng post và kiểm tra lỗi
        for (const post of seedPosts) {
            const { error } = await supabase.from('posts').insert([{
                user_id: post.userId,
                title: post.title,
                content: post.content,
                image: post.image || '',
                likes: post.likes || [],
                shares: post.shares || 0,
                comments: post.comments || [],
                created_at: post.timestamp
            }]);
            
            if (error) {
                // Nếu lỗi do foreign key (user_id không tồn tại), bỏ qua
                if (error.code === '23503') {
                    console.warn(`Post của user ${post.userId} không thể insert (user chưa tồn tại), bỏ qua...`);
                    continue;
                }
                throw error;
            }
        }
        console.log('✅ Đã seed posts thành công!');
    } catch (error) {
        console.error('Error seeding posts:', error);
        throw error; // Re-throw để caller biết có lỗi
    }
};

/**
 * Load posts từ Supabase
 * Nếu chưa có dữ liệu, tự động seed dữ liệu mẫu
 */
const loadPosts = async () => {
    if (!hasSupabase) {
        const saved = localStorage.getItem('poly_posts_db');
        if (saved) {
            posts.value = JSON.parse(saved);
        } else {
            // Seed data vào localStorage
            const seedPosts = generateSeedPosts();
            posts.value = seedPosts.map((p, idx) => ({
                ...p,
                id: 1000 + idx + 1,
                isEditing: false,
                newComment: ''
            }));
            localStorage.setItem('poly_posts_db', JSON.stringify(posts.value));
        }
        return;
    }

    try {
        loading.value = true;
        const { data, error } = await supabase
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        // Nếu chưa có dữ liệu, tự động seed
        if (!data || data.length === 0) {
            console.log('Chưa có dữ liệu posts, đang seed dữ liệu mẫu...');
            try {
                await seedPostsToSupabase();
                // Load lại sau khi seed
                const { data: newData, error: loadError } = await supabase
                    .from('posts')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (loadError) throw loadError;
                
                posts.value = (newData || []).map(post => ({
                    ...post,
                    id: post.id,
                    userId: post.user_id,
                    timestamp: post.created_at,
                    comments: post.comments || [],
                    likes: post.likes || [],
                    shares: post.shares || 0,
                    isEditing: false,
                    newComment: ''
                }));
            } catch (seedError) {
                console.error('Lỗi khi seed posts, dùng dữ liệu mẫu local:', seedError);
                const seedPosts = generateSeedPosts();
                posts.value = seedPosts.map((p, idx) => ({
                    ...p,
                    id: 1000 + idx + 1,
                    isEditing: false,
                    newComment: ''
                }));
            }
        } else {
            // Convert format
            posts.value = (data || []).map(post => ({
                ...post,
                id: post.id,
                userId: post.user_id,
                timestamp: post.created_at,
                comments: post.comments || [],
                likes: post.likes || [],
                shares: post.shares || 0,
                isEditing: false,
                newComment: ''
            }));
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        // Fallback về localStorage nếu có lỗi
        const saved = localStorage.getItem('poly_posts_db');
        if (saved) {
            posts.value = JSON.parse(saved);
        } else {
            const seedPosts = generateSeedPosts();
            posts.value = seedPosts.map((p, idx) => ({
                ...p,
                id: 1000 + idx + 1,
                isEditing: false,
                newComment: ''
            }));
        }
    } finally {
        loading.value = false;
    }
};

/**
 * Thêm user mới vào Supabase
 */
const addUserToDB = async (userData) => {
    if (!hasSupabase) {
        users.value.push(userData);
        localStorage.setItem('poly_users_db', JSON.stringify(users.value));
        return userData;
    }

    try {
        const { data, error } = await supabase
            .from('users')
            .insert([{
                name: userData.name,
                email: userData.email,
                password: userData.password,
                avatar: userData.avatar || defaultAvatar,
                friends: userData.friends || [],
                friend_requests: userData.friendRequests || [],
                notifications: userData.notifications || []
            }])
            .select()
            .single();

        if (error) throw error;
        
        // Convert về format cũ
        const newUser = {
            ...data,
            id: data.id,
            friendRequests: data.friend_requests || [],
            friends: data.friends || []
        };
        
        users.value.push(newUser);
        return newUser;
    } catch (error) {
        console.error('Error adding user:', error);
        alert('Lỗi khi đăng ký!');
        throw error;
    }
};

/**
 * Cập nhật user trong Supabase
 */
const updateUserInDB = async (userId, updates) => {
    if (!hasSupabase) {
        const idx = users.value.findIndex(u => u.id === userId);
        if (idx !== -1) {
            users.value[idx] = { ...users.value[idx], ...updates };
            localStorage.setItem('poly_users_db', JSON.stringify(users.value));
        }
        return;
    }

    try {
        const { error } = await supabase
            .from('users')
            .update({
                name: updates.name,
                avatar: updates.avatar,
                password: updates.password,
                friends: updates.friends,
                friend_requests: updates.friendRequests,
                notifications: updates.notifications
            })
            .eq('id', userId);

        if (error) throw error;
        
        // Cập nhật local state
        const idx = users.value.findIndex(u => u.id === userId);
        if (idx !== -1) {
            users.value[idx] = { ...users.value[idx], ...updates };
        }
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Lỗi khi cập nhật!');
    }
};

/**
 * Thêm post mới vào Supabase
 */
const addPostToDB = async (postData) => {
    if (!hasSupabase) {
        posts.value.unshift(postData);
        localStorage.setItem('poly_posts_db', JSON.stringify(posts.value));
        return postData;
    }

    try {
        const { data, error } = await supabase
            .from('posts')
            .insert([{
                user_id: postData.userId,
                title: postData.title,
                content: postData.content,
                image: postData.image || '',
                likes: postData.likes || [],
                shares: postData.shares || 0,
                comments: postData.comments || []
            }])
            .select()
            .single();

        if (error) throw error;
        
        // Convert về format cũ
        const newPost = {
            ...data,
            id: data.id,
            userId: data.user_id,
            timestamp: data.created_at,
            isEditing: false,
            newComment: ''
        };
        
        posts.value.unshift(newPost);
        return newPost;
    } catch (error) {
        console.error('Error adding post:', error);
        alert('Lỗi khi đăng bài!');
        throw error;
    }
};

/**
 * Cập nhật post trong Supabase
 */
const updatePostInDB = async (postId, updates) => {
    if (!hasSupabase) {
        const idx = posts.value.findIndex(p => p.id === postId);
        if (idx !== -1) {
            posts.value[idx] = { ...posts.value[idx], ...updates };
            localStorage.setItem('poly_posts_db', JSON.stringify(posts.value));
        }
        return;
    }

    try {
        const { error } = await supabase
            .from('posts')
            .update({
                title: updates.title,
                content: updates.content,
                image: updates.image,
                likes: updates.likes,
                shares: updates.shares,
                comments: updates.comments
            })
            .eq('id', postId);

        if (error) throw error;
        
        // Cập nhật local state
        const idx = posts.value.findIndex(p => p.id === postId);
        if (idx !== -1) {
            posts.value[idx] = { ...posts.value[idx], ...updates };
        }
    } catch (error) {
        console.error('Error updating post:', error);
        alert('Lỗi khi cập nhật bài viết!');
    }
};

/**
 * Xóa post trong Supabase
 */
const deletePostFromDB = async (postId) => {
    if (!hasSupabase) {
        posts.value = posts.value.filter(p => p.id !== postId);
        localStorage.setItem('poly_posts_db', JSON.stringify(posts.value));
        return;
    }

    try {
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId);

        if (error) throw error;
        
        posts.value = posts.value.filter(p => p.id !== postId);
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('Lỗi khi xóa bài viết!');
    }
};

// ===== STORE OBJECT =====

export const store = reactive({
    // State
    get currentUser() {
        return currentUser.value;
    },
    set currentUser(user) {
        currentUser.value = user;
        if (user) {
            localStorage.setItem('poly_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('poly_user');
        }
    },
    
    get users() {
        return users.value;
    },
    set users(newUsers) {
        users.value = newUsers;
    },
    
    get posts() {
        return posts.value;
    },
    set posts(newPosts) {
        posts.value = newPosts;
    },
    
    loading: loading,
    defaultAvatar,
    defaultCover,

    // Methods
    async init() {
        // Load currentUser từ localStorage
        const savedUser = localStorage.getItem('poly_user');
        if (savedUser) {
            try {
                currentUser.value = JSON.parse(savedUser);
            } catch (e) {
                console.error('Error parsing saved user:', e);
            }
        }
        
        // Load users và posts
        await loadUsers();
        await loadPosts();
    },

    async saveDB() {
        if (!hasSupabase) {
            localStorage.setItem('poly_users_db', JSON.stringify(users.value));
            localStorage.setItem('poly_posts_db', JSON.stringify(posts.value));
            return;
        }
        // Với Supabase, data đã được sync tự động khi insert/update
        // Không cần save thủ công
    },

    saveUser() {
        if (currentUser.value) {
            localStorage.setItem('poly_user', JSON.stringify(currentUser.value));
        } else {
            localStorage.removeItem('poly_user');
        }
    },

    logout() {
        currentUser.value = null;
        this.saveUser();
    },

    // Wrapper functions
    async addUser(userData) {
        return await addUserToDB(userData);
    },

    async updateUser(userId, updates) {
        return await updateUserInDB(userId, updates);
    },

    async addPost(postData) {
        return await addPostToDB(postData);
    },

    async updatePost(postId, updates) {
        return await updatePostInDB(postId, updates);
    },

    async deletePost(postId) {
        return await deletePostFromDB(postId);
    },

    // Theme (giữ nguyên)
    theme: localStorage.getItem('poly_theme') || 'light',
    
    toggleTheme() {
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        localStorage.setItem('poly_theme', this.theme);
        document.documentElement.setAttribute('data-bs-theme', this.theme);
    },
    
    initTheme() {
        document.documentElement.setAttribute('data-bs-theme', this.theme);
    }
});

// Khởi tạo khi load
store.init();

