# Kiến Trúc Hệ Thống (System Architecture)

Dự án **Project_TTTN_QRRepairTicket** là một giải pháp tổng thể phục vụ quy trình tiếp nhận, quản lý và theo dõi phiếu sửa chữa/bảo hành thiết bị thông minh thông qua công nghệ mã QR.

---

## 1. Tổng Quan Kiến Trúc (System Overview)

Hệ thống được thiết kế theo mô hình phân tầng chuẩn 3 lớp (3-Tier Architecture):
- **Tầng Giao Diện Người Dùng (Client Tier):** Web App (Lễ tân/Admin) và Mobile App (Khách hàng).
- **Tầng Xử Lý Nghiệp Vụ & API (Application & API Tier):** Next.js Backend REST API.
- **Tầng Dữ Liệu (Data Tier):** Cơ sở dữ liệu quan hệ PostgreSQL.

```
                    ┌─────────────────────────┐
                    │  CUSTOMER MOBILE APP    │ (Flutter / Dart)
                    │  (Khách hàng quét QR)   │
                    └────────────┬────────────┘
                                 │
                                 │ REST API (JSON)
                                 │ [HTTP / HTTPS]
                                 ▼
                    ┌─────────────────────────┐
                    │     NEXT.JS BACKEND     │ (Node.js REST API)
                    │  (Business Logic & Auth)│
                    └────────────┬────────────┘
                                 │
                                 │ SQL Connection (Prisma / pg)
                                 │ [Port 5432]
                                 ▼
                    ┌─────────────────────────┐
                    │   POSTGRESQL DATABASE   │ (Relational Data)
                    └─────────────────────────┘
                                 ▲
                                 │ SQL Connection
                                 │
                    ┌────────────┴────────────┐
                    │     NEXT.JS BACKEND     │
                    └────────────▲────────────┘
                                 │
                                 │ REST API (JSON)
                                 │ [HTTP / HTTPS]
                                 │
                    ┌────────────┴────────────┐
                    │    FRONTEND WEB APP     │ (Next.js / React)
                    │   (Lễ tân & Quản lý)    │
                    └─────────────────────────┘
```

---

## 2. Các Thành Phần Ứng Dụng (Applications Breakdown)

| Ứng dụng | Thư mục | Công nghệ | Đối tượng & Trách nhiệm chính |
| :--- | :--- | :--- | :--- |
| **Backend API** | `backend/` | Next.js (Node.js runtime) | Cung cấp RESTful API, xác thực, toàn vẹn dữ liệu, sinh mã QR, quản lý phiên và tương tác duy nhất với PostgreSQL. |
| **Frontend Web** | `frontend/` | Next.js / React | Giao diện dành cho Lễ tân tại quầy (tạo phiên QR, in tem, cập nhật tiến độ) và Quản trị viên (quản lý nhân viên, thống kê). |
| **Customer Mobile** | `mobile/` | Flutter / Dart | Ứng dụng di động dành cho Khách hàng: Quét mã QR tại quầy tiếp nhận, mở form tự điền thông tin, tra cứu tiến độ, nhận thông báo. |

---

## 3. Luồng Dữ Liệu (Data Flow Principles)

> [!IMPORTANT]
> **Nguyên tắc cốt lõi về bảo mật và toàn vẹn kiến trúc:**
> 1. **Client KHÔNG BAO GIỜ kết nối trực tiếp đến PostgreSQL.** Cả Frontend Web và Mobile App bắt buộc phải giao tiếp thông qua REST API của Backend.
> 2. **Toàn bộ Business Logic nằm tại Backend.** Mọi quy tắc về định dạng mã phiếu (`TK-xxx`), thời hạn phiên QR, phân quyền nhân viên, trạng thái phiếu đều do Backend kiểm soát tuyệt đối.
> 3. **API là Hợp Đồng (Contract) bất biến.** Client chỉ xây dựng giao diện và gọi theo đúng đặc tả tại [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

---

## 4. Phân Định Trách Nhiệm Chi Tiết (Separation of Concerns)

### 4.1. Backend API (`backend/`)
- Cung cấp các REST API endpoints chuẩn hóa cho cả Web và Mobile.
- Quản lý kết nối an toàn với cơ sở dữ liệu MSSQL.
- Quản lý vòng đời phiên quét mã QR (QR Session Lifecycle: khởi tạo, kiểm tra thời hạn, hủy phiên sau khi submit).
- Thực hiện kiểm tra tính hợp lệ dữ liệu (Server-side validation) cho mọi payload gửi lên.
- Quản lý phiên đăng nhập nội bộ (JWT Authentication & Role-based Authorization).
- Quản lý trạng thái phiếu sửa chữa: `PENDING` -> `ASSIGNED` -> `IN_PROGRESS` -> `COMPLETED` -> `DELIVERED`.

### 4.2. Frontend Web (`frontend/`)
- Màn hình Lễ tân: Nút bấm "Tạo phiên tiếp nhận mới", hiển thị mã QR cỡ lớn kèm thời gian đếm ngược để khách quét.
- Màn hình Kỹ thuật viên & Quản trị: Bảng danh sách phiếu, bộ lọc theo trạng thái, cập nhật ghi chú sửa chữa, quản lý kho thiết bị.
- Kết nối Backend qua `fetch` / `axios` với Base URL cấu hình trong biến môi trường.

### 4.3. Customer Mobile App (`mobile/`)
- Quản lý quyền truy cập Camera và thực hiện quét mã QR (`mobile_scanner`).
- Trích xuất `sessionToken` từ nội dung mã QR và gọi API xác thực phiên.
- Hiển thị màn hình nhập thông tin (Họ tên, SĐT, Tên thiết bị, Mô tả lỗi) khi phiên hợp lệ.
- Gửi yêu cầu tiếp nhận sửa chữa và lưu mã phiếu (`ticketCode`) vào bộ nhớ máy (`shared_preferences`) để tra cứu.
- Giao diện thân thiện, mượt mà trên cả Android và iOS.

---

## 5. Kiến Trúc Luồng Nghiệp Vụ: QR Self-Service Flow

Đây là luồng tính năng đặc trưng nhất của hệ thống, cho phép khách hàng tự phục vụ thông qua điện thoại:

```
[ FRONTEND WEB (Lễ tân) ]            [ NEXT.JS BACKEND ]             [ CUSTOMER MOBILE APP ]
           │                                 │                                 │
           │ 1. POST /api/tickets/init-session│                                 │
           ├────────────────────────────────►│                                 │
           │                                 │ 2. Sinh sessionToken tạm thời  │
           │                                 │    Lưu trạng thái INITIALIZED   │
           │                                 │    Sinh chuỗi Base64 QR Image   │
           │ 3. Trả về qrImage & sessionToken │                                 │
           │◄────────────────────────────────┤                                 │
           │                                 │                                 │
  (Hiển thị QR màn hình)                     │                                 │
           │                                 │                                 │
           │ - - - - - - - - - - - - - - - - │ - - - - - - - - - - - - - - - - │
           │     Khách đưa điện thoại quét   │                                 │
           │ - - - - - - - - - - - - - - - - │ - - - - - - - - - - - - - - - - │
           │                                 │                                 │
           │                                 │ 4. GET /api/tickets/session/:tok│
           │                                 │◄────────────────────────────────┤
           │                                 │ 5. Kiểm tra thời hạn session    │
           │                                 │    (Nếu hợp lệ -> HTTP 200)     │
           │                                 ├────────────────────────────────►│
           │                                 │                                 │
           │                                 │                  (Mở Form Điền) │
           │                                 │                                 │
           │                                 │ 6. POST /session/:tok/submit    │
           │                                 │    Payload: Tên, SĐT, Thiết bị, Lỗi
           │                                 │◄────────────────────────────────┤
           │                                 │ 7. Transaction Database:        │
           │                                 │    - Upsert Customer            │
           │                                 │    - Create Device              │
           │                                 │    - Update Ticket -> PENDING   │
           │                                 │    - VÔ HIỆU HÓA sessionToken   │
           │                                 │ 8. Trả về ticketCode            │
           │                                 ├────────────────────────────────►│
           │                                 │                                 │
           │ 9. WebSocket / Polling / Refetch│                                 │
           │    Web hiển thị Ticket mới vào  │                                 │
           │◄────────────────────────────────┤                                 │
```

---

## 6. Định Hướng Mở Rộng (Future Scalability)

- **Thông báo thời gian thực (Real-time Notifications):** Sử dụng Socket.io hoặc Server-Sent Events (SSE) để Lễ tân thấy ngay phiếu của khách vừa nộp mà không cần F5 lại trang.
- **Push Notifications cho Mobile:** Tích hợp Firebase Cloud Messaging (FCM) thông báo cho khách khi thiết bị đã sửa xong.
- **Tách dịch vụ (Microservices-ready):** Nhờ việc tách rõ ràng Backend/Frontend/Mobile, khi tải hệ thống tăng cao có thể đưa Backend lên Kubernetes hoặc Docker Swarm độc lập mà không ảnh hưởng mã nguồn Client.
