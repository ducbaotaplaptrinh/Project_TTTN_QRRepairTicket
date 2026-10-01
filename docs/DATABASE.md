# Thiết Kế Mô Hình Dữ Liệu (Database Logical Schema)

> **Trạng thái tài liệu:** `[PLANNED / LOGICAL DATA MODEL]`  
> **Hệ quản trị CSDL:** PostgreSQL  
> **Nguyên tắc phân quyền truy cập:** **DUY NHẤT** Backend API được phép kết nối và thực thi truy vấn trực tiếp với PostgreSQL. Frontend Web và Customer Mobile hoàn toàn không có quyền và không kết nối trực tiếp đến Database.

---

## 1. Sơ Đồ Thực Thể Quan Hệ Tổng Quan (Logical ERD)

```
┌─────────────────────┐
│      accounts       │
├─────────────────────┤
│ id (PK)             │
│ username            │
│ password_hash       │
│ full_name           │
│ role (RECEPTION/TECH│
└──────────┬──────────┘
           │ 1:N (Người tạo/xử lý)
           ▼
┌─────────────────────┐          1:N           ┌─────────────────────┐
│      customers      │◄───────────────────────┤       devices       │
├─────────────────────┤                        ├─────────────────────┤
│ id (PK)             │                        │ id (PK)             │
│ full_name           │                        │ customer_id (FK)    │
│ phone (UNIQUE)      │                        │ device_code (UNIQUE)│
│ email               │                        │ device_name         │
└──────────┬──────────┘                        │ serial_or_version   │
           │                                   └──────────┬──────────┘
           │ 1:N                                          │ 1:N
           ▼                                              ▼
┌────────────────────────────────────────────────────────────────────┐
│                              tickets                               │
├────────────────────────────────────────────────────────────────────┤
│ id (PK)                                                            │
│ ticket_code (UNIQUE, ví dụ: TK-1790667970452)                      │
│ customer_id (FK -> customers.id)                                   │
│ device_id (FK -> devices.id)                                       │
│ issue_description (Mô tả tình trạng lỗi của máy)                   │
│ status (PENDING, ASSIGNED, IN_PROGRESS, COMPLETED, CANCELLED)       │
│ created_by_account_id (FK -> accounts.id, nullable)                │
│ assigned_technician_id (FK -> accounts.id, nullable)               │
│ created_at, updated_at                                             │
└─────────────────────────────────▲──────────────────────────────────┘
                                  │ 1:1 (Liên kết phiên tự tạo)
┌─────────────────────────────────┴──────────────────────────────────┐
│                          ticket_sessions                           │
├────────────────────────────────────────────────────────────────────┤
│ id (PK)                                                            │
│ session_token (UNIQUE, UUID string)                                │
│ ticket_id (FK -> tickets.id)                                       │
│ qr_image_base64 (Chuỗi ảnh mã QR để Lễ tân hiển thị)               │
│ status (ACTIVE, SUBMITTED, EXPIRED)                                │
│ expires_at (Thời điểm hết hạn, mặc định 15 phút sau khi tạo)       │
│ submitted_at (Thời điểm khách nộp form thành công)                 │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2. Đặc Tả Chi Tiết Các Thực Thể (Entities Breakdown)

### 2.1. Bảng `accounts` (Tài khoản nhân viên nội bộ)
- **Mục đích:** Quản lý nhân sự nội bộ (Lễ tân tại quầy, Kỹ thuật viên sửa chữa, Quản trị viên).
- **Trách nhiệm sở hữu (Ownership):** Backend quản lý xác thực JWT.
- **Các trường chính:**
  - `id`: Khóa chính (Serial / BigInt / UUID).
  - `username`: Tên đăng nhập duy nhất (`VARCHAR(50)`, `UNIQUE`, `NOT NULL`).
  - `password_hash`: Chuỗi mật khẩu băm bảo mật (`VARCHAR(255)`, bcrypt/argon2).
  - `full_name`: Họ tên nhân viên (`VARCHAR(100)`, `NOT NULL`).
  - `role`: Vai trò (`VARCHAR(20)`: `RECEPTIONIST`, `TECHNICIAN`, `ADMIN`).
  - `created_at`: Ngày tạo.

### 2.2. Bảng `customers` (Khách hàng)
- **Mục đích:** Lưu trữ thông tin định danh khách hàng mang thiết bị đến sửa.
- **Trách nhiệm sở hữu:** Được tự động tạo hoặc cập nhật khi khách nộp form QR Self-service hoặc do nhân viên thêm tại quầy.
- **Các trường chính:**
  - `id`: Khóa chính.
  - `full_name`: Họ tên khách hàng (`VARCHAR(100)`, `NOT NULL`).
  - `phone`: Số điện thoại liên lạc (`VARCHAR(20)`, `NOT NULL`, có Index để tra cứu nhanh).
  - `email`: Địa chỉ thư điện tử (`VARCHAR(100)`, `NULLABLE`).
  - `created_at`: Ngày tạo.

### 2.3. Bảng `devices` (Thiết bị sửa chữa)
- **Mục đích:** Lưu thông tin phần cứng từng máy/thiết bị của khách hàng.
- **Trách nhiệm sở hữu:** Gắn liền với một `customer_id`.
- **Các trường chính:**
  - `id`: Khóa chính.
  - `customer_id`: Khóa ngoại tham chiếu đến `customers(id)`.
  - `device_code`: Mã định danh thiết bị in trên tem QR cố định (`VARCHAR(50)`, `UNIQUE`, ví dụ: `LG-9999`).
  - `device_name`: Tên model máy (`VARCHAR(150)`, `NOT NULL`, ví dụ: "Laptop Dell XPS 15").
  - `serial_or_version`: Số Serial Number hoặc phiên bản phần cứng (`VARCHAR(100)`, `NULLABLE`).
  - `created_at`: Ngày tạo.

### 2.4. Bảng `tickets` (Phiếu sửa chữa / tiếp nhận bảo hành)
- **Mục đích:** Thực thể trung tâm theo dõi toàn bộ vòng đời của một lượt tiếp nhận máy từ lúc khách gửi đến khi sửa xong giao trả.
- **Trách nhiệm sở hữu:** Backend xử lý chuyển đổi trạng thái máy tính (State Machine).
- **Các trường chính:**
  - `id`: Khóa chính.
  - `ticket_code`: Mã phiếu định danh công khai (`VARCHAR(50)`, `UNIQUE`, `NOT NULL`, ví dụ: `TK-1790667970452`).
  - `customer_id`: Khóa ngoại trỏ đến `customers(id)`.
  - `device_id`: Khóa ngoại trỏ đến `devices(id)`.
  - `issue_description`: Mô tả chi tiết triệu chứng lỗi của máy (`TEXT`, `NOT NULL`).
  - `status`: Trạng thái phiếu (`VARCHAR(30)`, mặc định `PENDING`):
    - `INITIALIZING`: Vừa sinh phiên QR, chờ khách điền.
    - `PENDING`: Khách đã nộp form thành công, chờ phân công kỹ thuật.
    - `ASSIGNED`: Đã chỉ định kỹ thuật viên nhận máy kiểm tra.
    - `IN_PROGRESS`: Đang tiến hành sửa chữa / thay thế linh kiện.
    - `COMPLETED`: Đã sửa chữa xong, máy hoạt động bình thường.
    - `CANCELLED`: Khách hủy yêu cầu hoặc không thể sửa.
  - `created_at`, `updated_at`.

### 2.5. Bảng `ticket_sessions` (Phiên tạo phiếu bằng QR Code)
- **Mục đích:** Lưu trữ phiên làm việc tạm thời phục vụ tính năng Khách quét QR tự điền thông tin.
- **Trách nhiệm sở hữu:** Sinh ra bởi API `/api/tickets/init-session` và bị vô hiệu hóa bởi `/api/tickets/session/:token/submit`.
- **Các trường chính:**
  - `id`: Khóa chính.
  - `session_token`: Chuỗi token duy nhất (`VARCHAR(64)` hoặc `UUID`, `UNIQUE`, `NOT NULL`).
  - `ticket_id`: Khóa ngoại trỏ tới `tickets(id)`.
  - `qr_image_base64`: Dữ liệu ảnh mã QR để hiển thị lên màn hình Lễ tân.
  - `status`: Trạng thái phiên (`ACTIVE`, `SUBMITTED`, `EXPIRED`).
  - `expires_at`: Thời điểm hết hạn hiệu lực (`TIMESTAMP WITH TIME ZONE`).
  - `submitted_at`: Thời điểm nộp (`NULLABLE`).

---

## 3. Ràng Buộc Toàn Vẹn & Quy Tắc Nghiệp Vụ CSDL

1. **Ràng buộc duy nhất (Unique Constraints):**
   - `accounts.username` phải là duy nhất.
   - `tickets.ticket_code` phải là duy nhất trong toàn hệ thống.
   - `ticket_sessions.session_token` phải là duy nhất.
2. **Quy tắc vô hiệu hóa Token (Token Invalidation):**
   - Khi một phiên `ticket_sessions` được gửi (`submit`) thành công, trường `status` phải đổi thành `SUBMITTED`, cập nhật `submitted_at` và không bao giờ được phép submit lần thứ 2.
3. **Tính toàn vẹn khóa ngoại (Foreign Keys):**
   - Xóa khách hàng không được làm mất lịch sử các phiếu `tickets` đã sửa chữa (`ON DELETE RESTRICT`).
