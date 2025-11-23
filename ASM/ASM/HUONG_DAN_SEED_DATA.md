# 📝 HƯỚNG DẪN SEED DỮ LIỆU MẪU

## Có 2 cách để có dữ liệu test:

### ✅ Cách 1: Tự động seed (Đã tích hợp sẵn)

**Không cần làm gì!** Khi bạn:
1. Chạy app lần đầu với Supabase
2. Database còn trống

→ Hệ thống sẽ **tự động** seed dữ liệu mẫu vào Supabase:
- 5 users mẫu (admin@gmail.com, nguyenvana@gmail.com, ...)
- 20 posts mẫu với đầy đủ likes, comments

**Lợi ích:**
- Không cần chạy SQL thủ công
- Tự động khi chưa có dữ liệu
- Dễ dàng test ngay

### 📋 Cách 2: Seed bằng SQL (Nếu muốn)

Nếu muốn seed thủ công, chạy SQL trong Supabase:

```sql
-- Insert users
INSERT INTO users (name, email, password, avatar) VALUES
('Admin Hệ Thống', 'admin@gmail.com', '123', 'https://cdn-icons-png.flaticon.com/512/295/295128.png'),
('Nguyễn Văn A', 'nguyenvana@gmail.com', '123', 'https://cdn-icons-png.flaticon.com/512/4333/4333609.png'),
('Trần Thị B', 'tranthib@gmail.com', '123', 'https://cdn-icons-png.flaticon.com/512/4333/4333609.png'),
('Lê Văn C', 'levanc@gmail.com', '123', 'https://cdn-icons-png.flaticon.com/512/149/149071.png'),
('Phạm Thị D', 'phamthid@gmail.com', '123', 'https://cdn-icons-png.flaticon.com/512/4333/4333609.png');

-- Insert posts (sau khi có users)
INSERT INTO posts (user_id, title, content, image, likes, shares, comments) VALUES
(1, 'Chào mừng đến với Social Internet!', 'Đây là nền tảng mạng xã hội mới...', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800', ARRAY[1,2,3,4,5], 3, '[]'::jsonb);
```

## 🎯 Khuyến nghị

**Dùng Cách 1** (tự động seed) vì:
- Đơn giản, không cần làm gì
- Tự động chạy khi cần
- Code đã được tích hợp sẵn

## ⚠️ Lưu ý

- Seed chỉ chạy khi database **trống**
- Nếu đã có dữ liệu, sẽ không seed lại
- Muốn seed lại: Xóa dữ liệu trong Supabase Dashboard → Refresh app

