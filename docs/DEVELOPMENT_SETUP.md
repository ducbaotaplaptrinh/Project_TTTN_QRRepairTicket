# Hướng Dẫn Cài Đặt Môi Trường Phát Triển (Development Setup Guide)

Tài liệu này cung cấp hướng dẫn chi tiết từng bước giúp một lập trình viên mới sau khi clone repository có thể thiết lập môi trường máy tính cục bộ và chạy được toàn bộ hệ thống (**Backend**, **Frontend Web**, và **Customer Mobile App**).

---

## 1. Yêu Cầu Cài Đặt Ban Đầu (Prerequisites)

Hãy đảm bảo máy tính của bạn đã được cài đặt các công cụ sau:

| Công cụ | Phiên bản khuyến nghị | Mục đích sử dụng | Kiểm tra lệnh |
| :--- | :--- | :--- | :--- |
| **Git** | `2.30+` | Quản lý phiên bản mã nguồn | `git --version` |
| **Node.js** | `v18.x` hoặc `v20.x` (LTS) | Runtime chạy Backend & Frontend | `node -v` |
| **npm / pnpm / yarn** | `npm 9+` hoặc `pnpm 8+` | Trình quản lý package JavaScript | `npm -v` |
| **Flutter SDK** | `3.19+` (Dart SDK `^3.10.4`) | Phát triển ứng dụng Customer Mobile | `flutter doctor` |
| **PostgreSQL** | `v14+` hoặc `v15+` / `v16+` | Cơ sở dữ liệu chính của hệ thống | `psql --version` |
| **IDE Khuyến nghị** | VS Code hoặc Android Studio | Trình biên soạn code & giả lập máy ảo | - |

---

## 2. Tải Mã Nguồn Về Máy (Clone Repository)

Mở terminal (PowerShell trên Windows hoặc Terminal trên macOS/Linux) và chạy:

```powershell
# 1. Clone repository từ GitHub
git clone https://github.com/ducbaotaplaptrinh/Project_TTTN_QRRepairTicket.git

# 2. Di chuyển vào thư mục dự án
cd Project_TTTN_QRRepairTicket
```

---

## 3. Cài Đặt & Chạy Backend API (`backend/`)

Thư mục `backend/` chịu trách nhiệm cung cấp REST API và kết nối cơ sở dữ liệu.

```powershell
# 1. Di chuyển vào thư mục backend
cd backend

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Tạo file cấu hình môi trường từ mẫu
cp .env.example .env
# (Trên Windows PowerShell nếu lệnh cp không nhận, dùng: Copy-Item .env.example .env)

# 4. Mở file .env và cập nhật chuỗi kết nối PostgreSQL của bạn:
# DATABASE_URL="postgresql://postgres:matkhau@localhost:5432/repair_ticket_dev?schema=public"

# 5. Khởi chạy máy chủ phát triển (Development Server)
npm run dev
```

> **Kiểm tra hoạt động:** Mở trình duyệt và truy cập `http://localhost:5000`. Nếu thấy server phản hồi là Backend đã sẵn sàng.

---

## 4. Cài Đặt & Chạy Frontend Web (`frontend/`)

Thư mục `frontend/` là ứng dụng Web Next.js/React dành cho nhân viên lễ tân và quản lý tại quầy tiếp nhận.

Mở một cửa sổ Terminal mới:

```powershell
# 1. Di chuyển vào thư mục frontend
cd frontend

# 2. Cài đặt các gói phụ thuộc
npm install

# 3. Tạo file biến môi trường
cp .env.example .env.local

# 4. Kiểm tra cấu hình trong .env.local:
# NEXT_PUBLIC_API_URL=http://localhost:5000

# 5. Khởi chạy ứng dụng Web
npm run dev
```

> **Kiểm tra hoạt động:** Mở trình duyệt và truy cập `http://localhost:3000`. Bạn sẽ thấy giao diện quản lý tiếp nhận phiếu sửa chữa.

---

## 5. Cài Đặt & Chạy Customer Mobile App (`mobile/`)

Thư mục `mobile/` là ứng dụng Flutter dành cho khách hàng quét mã QR.

Mở một cửa sổ Terminal mới:

```powershell
# 1. Di chuyển vào thư mục mobile
cd mobile

# 2. Tải và cài đặt các package Flutter & Dart
flutter pub get

# 3. Kiểm tra danh sách thiết bị đang kết nối (Máy ảo hoặc điện thoại cắm dây)
flutter devices

# 4. Khởi chạy ứng dụng lên thiết bị hoặc máy ảo đang mở
flutter run
```

> [!NOTE]
> Để camera quét mã QR hoạt động trơn tru:
> - Trên máy ảo Android: Vào Settings của Emulator -> Cài đặt Camera Front/Back thành `VirtualScene` hoặc `Webcam0`.
> - Trên điện thoại thật: Cần cấp quyền truy cập Camera khi ứng dụng mở lần đầu.

---

## 6. Xác Minh Cài Đặt Thành Công (Verification Checklist)

Để đảm bảo toàn bộ hệ sinh thái hoạt động gắn kết với nhau:

- [ ] **Backend chạy:** Truy cập `http://localhost:5000` nhận phản hồi thành công.
- [ ] **Database kết nối:** Backend kết nối được PostgreSQL mà không báo lỗi `ECONNREFUSED`.
- [ ] **Frontend Web chạy:** Truy cập `http://localhost:3000` tải được giao diện.
- [ ] **Mobile kết nối được Backend:**
  - Nếu chạy Android Emulator: API trỏ về `http://10.0.2.2:5000`.
  - Nếu chạy điện thoại thật: API trỏ về `http://<LAN_IP>:5000` (cùng mạng WiFi với máy tính chạy Backend).

---

## 7. Xử Lý Các Sự Cố Thường Gặp (Troubleshooting)

### Vấn đề 1: Trùng cổng mạng (Port 5000 hoặc 3000 bị chiếm dụng)
- **Hiện tượng:** Chạy `npm run dev` báo lỗi `Error: listen EADDRINUSE: address already in use :::5000`.
- **Cách xử lý trên Windows:**
  ```powershell
  # Tìm tiến trình đang chiếm cổng 5000
  netstat -ano | findstr :5000
  # Tắt tiến trình đó theo PID (thay 12345 bằng PID tương ứng)
  taskkill /PID 12345 /F
  ```

### Vấn đề 2: Android Emulator không gọi được API Backend Local
- **Hiện tượng:** Mobile app gửi request báo lỗi `SocketException: Connection refused`.
- **Nguyên nhân:** Đang cấu hình URL là `http://localhost:5000`.
- **Cách xử lý:** Đổi Base URL trong cấu hình Mobile sang `http://10.0.2.2:5000`.

### Vấn đề 3: Lỗi CORS khi Web gọi sang Backend
- **Hiện tượng:** Trình duyệt báo `Access-Control-Allow-Origin missing`.
- **Cách xử lý:** Đảm bảo Backend có bật middleware CORS cho phép nguồn `http://localhost:3000`.

### Vấn đề 4: Lỗi Camera trên Flutter Mobile Scanner
- **Hiện tượng:** Màn hình quét QR đen ngòm hoặc văng ứng dụng.
- **Cách xử lý:** Kiểm tra quyền `android.permission.CAMERA` trong `AndroidManifest.xml` hoặc kiểm tra quyền cấp trong Settings máy ảo.
