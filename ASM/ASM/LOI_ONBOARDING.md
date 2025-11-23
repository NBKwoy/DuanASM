# 🔧 XỬ LÝ LỖI "onboarding.js"

## ❓ Lỗi này là gì?

Lỗi `Uncaught (in promise) undefined` từ `onboarding.js:30` **KHÔNG phải từ code của bạn**.

## 🔍 Nguyên nhân có thể:

### 1. Browser Extension
- React DevTools
- Vue DevTools  
- Redux DevTools
- Hoặc extension khác

### 2. Supabase Dashboard
- Nếu bạn đang mở tab Supabase Dashboard
- Script onboarding của Supabase có thể inject vào

### 3. Service Worker
- Service worker từ extension hoặc browser

## ✅ Cách xử lý:

### Cách 1: Bỏ qua (Khuyến nghị)
- **Nếu app vẫn hoạt động bình thường** → Bỏ qua lỗi này
- Lỗi này không ảnh hưởng đến chức năng của app
- Chỉ là warning từ extension/script bên ngoài

### Cách 2: Tắt Extension
1. Mở Chrome DevTools (F12)
2. Vào tab **Console**
3. Click vào icon **Filter** (hình phễu)
4. Chọn **Hide network messages** hoặc **Hide extension errors**

### Cách 3: Chạy ở Incognito Mode
- Mở Chrome Incognito (Ctrl + Shift + N)
- Chạy app ở đó (không có extension)

### Cách 4: Filter trong Console
Thêm filter để ẩn lỗi này:
```javascript
// Trong Console, gõ:
console.error = (function(original) {
    return function(...args) {
        if (!args[0]?.includes?.('onboarding.js')) {
            original.apply(console, args);
        }
    };
})(console.error);
```

## 🎯 Kiểm tra app có hoạt động không:

1. **Seed data có chạy không?**
   - Xem console có log: `✅ Đã seed users thành công!`
   - Xem console có log: `✅ Đã seed posts thành công!`

2. **App có load được không?**
   - Trang login có hiện không?
   - Đăng nhập được không?

3. **Dữ liệu có hiển thị không?**
   - Posts có hiện không?
   - Users có load được không?

## ✅ Kết luận:

**Nếu app hoạt động bình thường** → **Bỏ qua lỗi này!**

Lỗi này không ảnh hưởng đến:
- ✅ Seed data
- ✅ Kết nối Supabase
- ✅ Chức năng app
- ✅ Hiển thị dữ liệu

Chỉ là warning từ script bên ngoài (extension/dashboard).

