# 📝 HƯỚNG DẪN TẠO FILE .ENV

## Bước 1: Lấy URL và Key từ Supabase

1. **Đăng nhập vào Supabase**: https://supabase.com
2. **Chọn project** của bạn (hoặc tạo project mới)
3. **Vào Settings** (biểu tượng bánh răng ở sidebar bên trái)
4. **Chọn "API"** trong menu Settings
5. **Copy 2 thông tin sau:**

   - **Project URL**: 
     ```
     https://xxxxx.supabase.co
     ```
     (Ví dụ: `https://abcdefghijklmnop.supabase.co`)

   - **anon public key**: 
     ```
     eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```
     (Key rất dài, copy toàn bộ)

## Bước 2: Tạo file .env

### Vị trí file:
Tạo file `.env` ở **thư mục gốc** của project:
```
ASM/ASM/
├── .env          ← Tạo file ở đây
├── package.json
├── src/
└── ...
```

### Cách tạo:

**Cách 1: Tạo bằng VS Code**
1. Mở VS Code
2. Click chuột phải vào thư mục `ASM/ASM/`
3. Chọn "New File"
4. Đặt tên: `.env` (có dấu chấm ở đầu)
5. Paste nội dung:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

6. Thay `your-project-id.supabase.co` bằng **Project URL** của bạn
7. Thay `your-anon-key-here` bằng **anon public key** của bạn

**Cách 2: Tạo bằng Notepad (Windows)**
1. Mở Notepad
2. Paste nội dung:
```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
3. Thay thông tin của bạn
4. Lưu file với tên: `.env` (chọn "All Files" trong Save as type)
5. Lưu vào thư mục `ASM/ASM/`

**Cách 3: Tạo bằng Terminal**
```bash
cd ASM/ASM
echo VITE_SUPABASE_URL=https://your-project-id.supabase.co > .env
echo VITE_SUPABASE_ANON_KEY=your-anon-key-here >> .env
```

## Bước 3: Ví dụ file .env hoàn chỉnh

```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODk2NzI5MCwiZXhwIjoxOTU0NTQzMjkwfQ.abcdefghijklmnopqrstuvwxyz1234567890
```

⚠️ **Lưu ý:**
- Không có khoảng trắng trước/sau dấu `=`
- Không có dấu ngoặc kép `"` hoặc `'`
- Mỗi dòng một biến

## Bước 4: Kiểm tra

Sau khi tạo file `.env`:
1. **Restart dev server** (dừng và chạy lại `npm run dev`)
2. Mở browser console
3. Nếu thấy log: `⚠️ Supabase chưa được cấu hình...` → File chưa đúng
4. Nếu không thấy log → Đã cấu hình thành công!

## ❌ Lỗi thường gặp

### Lỗi 1: "Failed to resolve import"
→ Chưa cài `@supabase/supabase-js`
→ Chạy: `npm install @supabase/supabase-js`

### Lỗi 2: "Supabase chưa được cấu hình"
→ File `.env` chưa đúng vị trí hoặc sai format
→ Kiểm tra:
- File ở thư mục gốc `ASM/ASM/`
- Tên file là `.env` (có dấu chấm)
- Không có khoảng trắng thừa

### Lỗi 3: "Invalid API key"
→ Key sai hoặc đã hết hạn
→ Lấy lại key từ Supabase Dashboard

## ✅ Hoàn thành!

Sau khi tạo file `.env` đúng:
- App sẽ tự động kết nối Supabase
- Dữ liệu sẽ lưu trên cloud
- Nhiều người có thể dùng chung

