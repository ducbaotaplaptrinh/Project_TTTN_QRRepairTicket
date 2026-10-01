# Quản Lý Môi Trường Phát Triển & Biến Môi Trường (Environment Guide)

Tài liệu này định nghĩa kiến trúc môi trường, cách thức phân bổ biến môi trường (Environment Variables), và các nguyên tắc bảo mật thông tin tuyệt đối cho dự án **Project_TTTN_QRRepairTicket**.

---

## 1. Mô Hình Ba Môi Trường (The 3 Environments)

Dự án hoạt động trên 3 môi trường tách biệt hoàn toàn để đảm bảo sự ổn định và an toàn dữ liệu:

```
┌─────────────────────────────────┐
│        1. LOCAL (Máy DEV)       │
│  - Mỗi developer chạy máy mình  │
│  - DB cục bộ / Docker Compose   │
│  - API: localhost / 10.0.2.2    │
└────────────────┬────────────────┘
                 │ (Merge PR vào nhánh develop / staging)
                 ▼
┌─────────────────────────────────┐
│       2. STAGING (Tích hợp)     │
│  - Môi trường thử nghiệm chung  │
│  - Cả team kết nối test chéo    │
│  - Dữ liệu mẫu (Seed Data)      │
└────────────────┬────────────────┘
                 │ (Release chính thức)
                 ▼
┌─────────────────────────────────┐
│      3. PRODUCTION (Vận hành)   │
│  - Dành cho người dùng thật     │
│  - Cửa hàng tiếp nhận bảo hành  │
│  - Bảo mật tối đa, Backup định kỳ│
└─────────────────────────────────┘
```

### Bảng So Sánh Các Môi Trường

| Đặc điểm | Môi Trường LOCAL | Môi Trường STAGING | Môi Trường PRODUCTION |
| :--- | :--- | :--- | :--- |
| **Mục đích** | Developer tự code, debug, chạy thử nghiệm tính năng mới. | Team tích hợp chéo (Web + Mobile test API Backend chung). | Cửa hàng và Khách hàng sử dụng thật. |
| **Backend URL** | `http://localhost:5000` (Web)<br>`http://10.0.2.2:5000` (Android Emu)<br>`http://<LAN_IP>:5000` (Mobile thật) | `https://api-staging.example.com` *(Placeholder)* | `https://api.example.com` *(Placeholder)* |
| **Database** | PostgreSQL cục bộ trên máy dev (`localhost:5432`) | Cloud PostgreSQL máy chủ staging | Cloud PostgreSQL có Replica, HA, SSL |
| **Dữ liệu** | Dữ liệu test giả lập, tự do xóa/reset | Dữ liệu mẫu kiểm thử tích hợp | Dữ liệu khách hàng thật, cấm xóa |

---

## 2. Bản Đồ Biến Môi Trường (Environment Variables Matrix)

Mỗi thành phần trong Monorepo có các biến cấu hình độc lập:

### 2.1. Backend API (`backend/`)
Cấu hình đặt trong file `backend/.env` (tạo từ `backend/.env.example`):

| Tên biến | Ý nghĩa & Mô tả | Ví dụ môi trường Local |
| :--- | :--- | :--- |
| `PORT` | Cổng mạng Backend lắng nghe | `5000` |
| `NODE_ENV` | Môi trường Node.js | `development` / `production` |
| `DATABASE_URL` | Chuỗi kết nối PostgreSQL | `postgresql://postgres:postgres@localhost:5432/repair_ticket_dev?schema=public` |
| `JWT_SECRET` | Khóa bí mật ký mã Access Token | `dev_secret_key_change_in_production_123` |
| `QR_SESSION_TTL` | Thời gian sống của phiên QR (giây) | `900` (15 phút) |
| `CORS_ORIGIN` | Các domain Web được phép gọi API | `http://localhost:3000` |

### 2.2. Frontend Web (`frontend/`)
Cấu hình đặt trong file `frontend/.env.local` (tạo từ `frontend/.env.example`):

| Tên biến | Ý nghĩa & Mô tả | Ví dụ môi trường Local |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Địa chỉ Backend mà trình duyệt gọi tới | `http://localhost:5000` |
| `PORT` | Cổng chạy server Next.js giao diện | `3000` |

### 2.3. Customer Mobile App (`mobile/`)
Cấu hình mạng được khai báo tập trung trong file cấu hình code hoặc file `.env` di động (ví dụ: `mobile/lib/core/constants/api_constants.dart` hoặc `--dart-define`):

| Tên biến / Tham số | Mô tả kết nối | Địa chỉ tương ứng |
| :--- | :--- | :--- |
| `API_BASE_URL` (Android Emulator) | Máy ảo Android gọi máy chủ host | `http://10.0.2.2:5000` |
| `API_BASE_URL` (iOS Simulator) | Máy ảo iOS gọi máy Mac | `http://localhost:5000` |
| `API_BASE_URL` (Điện thoại thật) | Điện thoại kết nối qua WiFi chung | `http://192.168.1.xxx:5000` (IP máy tính chạy Backend) |

> [!TIP]
> **Lưu ý đặc biệt cho Mobile Developer:**  
> Máy ảo Android Emulator sử dụng một mạng nội bộ riêng. Nếu trong code mobile bạn để `http://localhost:5000`, điện thoại sẽ tự tìm cổng 5000 trên chính chiếc điện thoại (sẽ gặp lỗi `Connection Refused`). Do đó bắt buộc phải sử dụng `http://10.0.2.2:5000` cho Android Emulator!

---

## 3. Nguyên Tắc Bảo Mật & Quản Lý Secret (Security Principles)

> [!CAUTION]
> **CÁC NGUYÊN TẮC BẢO MẬT BẮT BUỘC:**
> 1. **KHÔNG BAO GIỜ commit các file `.env`, `.env.local`, `.env.production` lên Git.** Các file này đã được đưa vào [.gitignore](file:///d:/ProjectTTTN/system-repair/Project_TTTN_QRRepairTicket/.gitignore).
> 2. **Chỉ commit file mẫu `.env.example`** chứa các tên biến (Key) kèm giá trị giả lập mẫu (Dummy Value).
> 3. **Secret thực tế** (Database credentials production, API production keys) chỉ được lưu trữ trên GitHub Secrets (khi setup CI/CD) hoặc trao đổi bảo mật nội bộ, không đưa vào file code.
> 4. Nếu phát hiện lộ secret lên Git, hãy báo Team Lead ngay để hủy và cấp lại secret mới.
