# 🚀 HƯỚNG DẪN TÍCH HỢP SUPABASE

## Bước 1: Cài đặt Supabase Client

```bash
npm install @supabase/supabase-js
```

## Bước 2: Tạo tài khoản Supabase

1. Truy cập: https://supabase.com
2. Đăng ký/Đăng nhập
3. Tạo project mới
4. Chọn region gần nhất (Singapore cho VN)

## Bước 3: Lấy API Keys

1. Vào **Settings** → **API**
2. Copy 2 thông tin:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Key dài

## Bước 4: Tạo file .env

1. Copy file `.env.example` thành `.env`
2. Điền thông tin:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Bước 5: Tạo bảng trong Supabase

Vào **SQL Editor** trong Supabase và chạy:

```sql
-- Tạo bảng users
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  avatar TEXT,
  friends BIGINT[] DEFAULT '{}',
  friend_requests BIGINT[] DEFAULT '{}',
  notifications JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tạo bảng posts
CREATE TABLE posts (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(id),
  title TEXT,
  content TEXT NOT NULL,
  image TEXT,
  likes BIGINT[] DEFAULT '{}',
  shares INTEGER DEFAULT 0,
  comments JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cho phép đọc/ghi công khai (cho demo)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON users FOR ALL USING (true);
CREATE POLICY "Allow all" ON posts FOR ALL USING (true);
```

## Bước 6: Chuyển sang dùng Supabase Store

Thay đổi import trong `main.js`:

```javascript
// Từ:
import { store } from './store'

// Thành:
import { store } from './store-supabase'
```

## Bước 7: Cập nhật components để dùng async

Các hàm tạo/cập nhật/xóa cần dùng `await`:

```javascript
// Tạo bài viết
const createPost = async () => {
    // ... validation ...
    await store.addPost(postData);
};

// Cập nhật user
await store.updateUser(userId, updates);

// Xóa post
await store.deletePost(postId);
```

## ✅ Hoàn thành!

Sau khi setup xong:
- Dữ liệu sẽ lưu trên Supabase cloud
- Nhiều người có thể dùng chung
- Dữ liệu không mất khi xóa cache

## 🔄 Fallback Mode

Nếu chưa có `.env` hoặc chưa setup Supabase:
- Ứng dụng tự động dùng localStorage
- Vẫn hoạt động bình thường
- Console sẽ hiện cảnh báo

