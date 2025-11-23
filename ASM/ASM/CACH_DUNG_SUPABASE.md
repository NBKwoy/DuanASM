# 🚀 CÁCH DÙNG SUPABASE - HƯỚNG DẪN ĐƠN GIẢN

## Bước 1: Cài đặt

```bash
npm install @supabase/supabase-js
```

## Bước 2: Tạo tài khoản Supabase

1. Vào https://supabase.com
2. Đăng ký miễn phí
3. Tạo project mới

## Bước 3: Lấy thông tin

1. Vào **Settings** → **API**
2. Copy:
   - **Project URL**
   - **anon public key**

## Bước 4: Tạo file .env

Tạo file `.env` trong thư mục gốc:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-key-here
```

## Bước 5: Tạo bảng

Vào **SQL Editor** trong Supabase, chạy:

```sql
-- Bảng users
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

-- Bảng posts
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

-- Cho phép truy cập công khai (cho demo)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all" ON users FOR ALL USING (true);
CREATE POLICY "Allow all" ON posts FOR ALL USING (true);
```

## Bước 6: Chuyển sang Supabase

Trong `main.js`, thay đổi:

```javascript
// Từ:
import { store } from './store'

// Thành:
import { store } from './store-supabase'
```

## ✅ Xong!

- Nếu có `.env` → Dùng Supabase
- Nếu không có → Tự động dùng localStorage (vẫn hoạt động)

## 📝 Lưu ý

- File `.env` không được commit lên GitHub (đã có trong .gitignore)
- Supabase miễn phí đến 500MB database
- Dữ liệu sẽ lưu trên cloud, không mất khi xóa cache

