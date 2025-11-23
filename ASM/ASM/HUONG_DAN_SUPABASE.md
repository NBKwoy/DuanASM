# 📚 HƯỚNG DẪN TÍCH HỢP SUPABASE

## Bước 1: Tạo tài khoản Supabase

1. Truy cập: https://supabase.com
2. Click "Start your project"
3. Đăng ký bằng GitHub hoặc Email
4. Tạo project mới

## Bước 2: Lấy API Keys

Sau khi tạo project:
1. Vào Settings → API
2. Copy 2 thông tin:
   - **Project URL** (ví dụ: https://xxxxx.supabase.co)
   - **anon public key** (key dài)

## Bước 3: Tạo bảng trong Supabase

Vào SQL Editor trong Supabase và chạy các lệnh sau:

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

-- Cho phép đọc/ghi công khai (tạm thời cho demo)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON users FOR ALL USING (true);
CREATE POLICY "Allow all" ON posts FOR ALL USING (true);
```

## Bước 4: Cài đặt Supabase Client

Chạy lệnh trong terminal:
```bash
npm install @supabase/supabase-js
```

## Bước 5: Cấu hình

Tạo file `.env` trong thư mục gốc:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

⚠️ **Lưu ý**: File `.env` đã được thêm vào `.gitignore` để không commit key lên GitHub.

