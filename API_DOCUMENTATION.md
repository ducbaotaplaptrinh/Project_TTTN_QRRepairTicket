# Tài Liệu Đặc Tả & Hợp Đồng Giao Tiếp API (API Contract Documentation)

> **Trạng thái tài liệu:** `SOURCE OF TRUTH` cho giao tiếp giữa **Backend**, **Frontend Web**, và **Customer Mobile App**.  
> **Phiên bản tài liệu:** v1.0.0 (Chuẩn hóa nền tảng hệ thống)  
> **Quy ước trạng thái triển khai:**
> - `[DOCUMENTED]`: API đã được định nghĩa và thống nhất trong đặc tả, đang chờ hoặc đang trong quá trình hiện thực hóa mã nguồn Backend.
> - `[IMPLEMENTED]`: API đã được code hoàn thiện trong Backend, đã qua kiểm thử và sẵn sàng cho Web/Mobile tích hợp.
> - `[MISMATCH]`: Có sự sai lệch giữa mã nguồn Backend và Client, yêu cầu họp thống nhất trước khi sửa.

---

## 1. Địa Chỉ Máy Chủ (Base URLs)

| Môi trường | Base URL | Đối tượng sử dụng & Ghi chú |
| :--- | :--- | :--- |
| **Local (Máy tính Web / Tool)** | `http://localhost:5000` | Frontend Web chạy trên cùng máy tính với Backend |
| **Local (Android Emulator)** | `http://10.0.2.2:5000` | Loopback IP dành riêng cho máy ảo Android Studio kết nối Backend |
| **Local (Thiết bị thật qua WiFi)** | `http://10.50.195.212:5000` | Thay bằng địa chỉ IPv4 LAN thực tế của máy chạy Backend (`ipconfig`) |
| **Staging (Tích hợp chung)** | `https://api-staging.yourdomain.com` | *(Placeholder - Sẽ cập nhật khi deploy staging server)* |
| **Production (Vận hành thực tế)**| `https://api.yourdomain.com` | *(Placeholder - Sẽ cập nhật khi release chính thức)* |

---

## 2. Quy Chuẩn Giao Thức Chung (Conventions)

- **Định dạng dữ liệu (Data Format):** `JSON (JavaScript Object Notation)`
- **Header bắt buộc cho mọi request có Body:**
  ```http
  Content-Type: application/json
  Accept: application/json
  ```
- **Chuẩn phản hồi thành công (Standard Success Response):**
  ```json
  {
    "success": true,
    "message": "Mô tả ngắn kết quả thực hiện thành công (tùy chọn)",
    "data": { ... } // Đối tượng hoặc mảng dữ liệu trả về
  }
  ```
- **Chuẩn phản hồi lỗi (Standard Error Response):**
  ```json
  {
    "success": false,
    "message": "Thông điệp lỗi thân thiện hiển thị cho người dùng hoặc log debug",
    "errorCode": "MA_LOI_HE_THONG_NEU_CO",
    "errors": [ ... ] // Danh sách chi tiết lỗi validation trường nếu có
  }
  ```

### Bảng Mã Trạng Thái HTTP (HTTP Status Codes)
- `200 OK`: Yêu cầu thực hiện thành công.
- `201 Created`: Tạo mới bản ghi thành công (Ticket, Device, Account).
- `400 Bad Request`: Dữ liệu gửi lên sai định dạng, thiếu trường bắt buộc.
- `401 Unauthorized`: Chưa đăng nhập hoặc Token xác thực không hợp lệ.
- `403 Forbidden`: Không có quyền truy cập vào tài nguyên này.
- `404 Not Found`: Không tìm thấy tài nguyên (Phiên QR hết hạn, Thiết bị không tồn tại).
- `500 Internal Server Error`: Lỗi phát sinh từ phía Backend máy chủ.

---

## 3. Đặc Tả Chi Tiết Các API Endpoints

### PHẦN 1: TÀI KHOẢN & ĐĂNG NHẬP (NỘI BỘ)

#### 1. Đăng nhập hệ thống (Nội bộ) `[DOCUMENTED]`
- **Mục đích:** Dành cho Nhân viên lễ tân hoặc Kỹ thuật viên đăng nhập vào giao diện Web quản lý.
- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Yêu cầu xác thực (Auth):** Không yêu cầu.
- **Request Body:**
  ```json
  {
    "username": "kythuat01",
    "password": "your_secure_password"
  }
  ```
- **Response Thành Công (HTTP 200):**
  ```json
  {
    "success": true,
    "message": "Đăng nhập thành công!",
    "data": {
      "accountId": 1,
      "username": "kythuat01",
      "fullName": "Trần Kỹ Thuật",
      "role": "TECHNICIAN",
      "token": "jwt_access_token_string_here"
    }
  }
  ```
- **Response Lỗi (HTTP 401):**
  ```json
  {
    "success": false,
    "message": "Tên đăng nhập hoặc mật khẩu không chính xác!"
  }
  ```

---

### PHẦN 2: THIẾT BỊ & MÃ QR (NHÂN VIÊN DÙNG)

#### 2. Thêm thiết bị mới & Sinh mã QR trực tiếp `[DOCUMENTED]`
- **Mục đích:** Dùng khi Nhân viên muốn lưu thiết bị trực tiếp tại quầy mà không cần khách hàng tự điền.
- **Method:** `POST`
- **URL:** `/api/devices`
- **Yêu cầu xác thực (Auth):** Đăng nhập quyền Nhân viên / Kỹ thuật viên.
- **Request Body:**
  ```json
  {
    "customerId": 1,
    "deviceCode": "LG-9999",
    "deviceName": "Laptop Dell XPS 15",
    "serialOrVersion": "SN-123456"
  }
  ```
- **Response Thành Công (HTTP 201):**
  ```json
  {
    "success": true,
    "message": "Thêm thiết bị và tạo mã QR thành công!",
    "data": {
      "deviceId": 5,
      "deviceCode": "LG-9999",
      "qrImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
    }
  }
  ```

#### 3. Quét QR truy xuất thông tin thiết bị `[DOCUMENTED]`
- **Mục đích:** Dùng khi Kỹ thuật viên dùng máy quét hoặc ứng dụng quét mã QR in trên tem máy để tra cứu lịch sử và chủ sở hữu.
- **Method:** `GET`
- **URL:** `/api/devices/:deviceCode` (Ví dụ: `/api/devices/LG-9999`)
- **Yêu cầu xác thực (Auth):** Nhân viên nội bộ.
- **Response Thành Công (HTTP 200):**
  ```json
  {
    "success": true,
    "data": {
      "deviceId": 5,
      "deviceCode": "LG-9999",
      "deviceName": "Laptop Dell XPS 15",
      "serialOrVersion": "SN-123456",
      "customerName": "Nguyễn Văn Khách",
      "phone": "0901234567"
    }
  }
  ```
- **Response Lỗi (HTTP 404):**
  ```json
  {
    "success": false,
    "message": "Không tìm thấy thiết bị với mã đã quét!"
  }
  ```

---

### PHẦN 3: LUỒNG KHÁCH HÀNG TỰ TẠO PHIẾU BẰNG MÃ QR (SELF-SERVICE FLOW)

#### 4. Khởi tạo Phiên Quét QR Tiếp Nhận (Lễ tân dùng) `[DOCUMENTED]`
- **Mục đích:** Lễ tân bấm nút trên giao diện Web quản lý. Hệ thống Backend tạo một phiên tạm thời kèm mã định danh và trả về ảnh QR Code lớn trên màn hình để khách hàng dùng Customer Mobile App quét.
- **Method:** `POST`
- **URL:** `/api/tickets/init-session`
- **Yêu cầu xác thực (Auth):** Quyền Lễ tân / Staff.
- **Request Body:** Không có body (`{}`).
- **Response Thành Công (HTTP 200):**
  ```json
  {
    "success": true,
    "data": {
      "ticketId": 10,
      "ticketCode": "TK-1790667970452",
      "sessionToken": "03b03f99-3383-447f-9046-69c523d4b548",
      "qrImage": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
      "expiresAt": "2026-09-30T11:15:00Z"
    }
  }
  ```

#### 5. Kiểm tra tính hợp lệ của mã QR (Mobile App quét xong) `[DOCUMENTED]`
- **Mục đích:** Khi Mobile App của khách hàng quét trúng mã QR (chứa `sessionToken`), ứng dụng gọi ngay API này để xác thực phiên làm việc còn hiệu lực hay đã bị hủy/hết hạn trước khi mở màn hình điền form.
- **Method:** `GET`
- **URL:** `/api/tickets/session/:token`  
  *(Trong đó `:token` là giá trị `sessionToken` giải mã được từ mã QR)*
- **Yêu cầu xác thực (Auth):** Không yêu cầu (Public - Xác thực bằng chính token một lần).
- **Response Thành Công (HTTP 200):**
  ```json
  {
    "success": true,
    "message": "Phiên hợp lệ, cho phép mở form tiếp nhận",
    "data": {
      "ticketCode": "TK-1790667970452",
      "sessionStatus": "ACTIVE",
      "expiresAt": "2026-09-30T11:15:00Z"
    }
  }
  ```
- **Response Thất Bại (HTTP 404 / 410 Gone):**
  ```json
  {
    "success": false,
    "message": "Mã QR đã hết hạn hoặc không tồn tại!"
  }
  ```

#### 6. Khách hàng nộp Form Yêu cầu sửa chữa `[DOCUMENTED]`
- **Mục đích:** Khách hàng điền xong Họ tên, SĐT, Email, Tên thiết bị và Mô tả lỗi trên Mobile App và bấm nút "Gửi yêu cầu".
- **Method:** `POST`
- **URL:** `/api/tickets/session/:token/submit`
- **Yêu cầu xác thực (Auth):** Xác thực bằng `:token` hợp lệ.
- **Request Body:**
  ```json
  {
    "fullName": "Nguyễn Đức Bảo",
    "phone": "0972688222",
    "email": "bao@gmail.com",
    "deviceName": "Laptop ASUS ROG Strix",
    "issueDescription": "Máy bị hỏng phím cách, khởi động kêu to"
  }
  ```
- **Hành vi xử lý phía Backend (Business Behavior):**
  1. Kiểm tra `:token` hợp lệ và chưa từng được submit.
  2. Tự động kiểm tra hoặc tạo mới Khách hàng (`Customer`) theo số điện thoại.
  3. Tạo mới Thiết bị (`Device`) liên kết với Khách hàng.
  4. Cập nhật phiếu sửa chữa (`Ticket`) sang trạng thái `PENDING` (Chờ xử lý).
  5. **Hủy `sessionToken` vĩnh viễn** để ngăn chặn việc gửi lại (Replay attack).
- **Response Thành Công (HTTP 200 / 201):**
  ```json
  {
    "success": true,
    "message": "Gửi yêu cầu tiếp nhận sửa chữa thành công!",
    "data": {
      "ticketCode": "TK-1790667970452",
      "status": "PENDING",
      "submittedAt": "2026-09-30T10:55:00Z"
    }
  }
  ```
- **Response Lỗi (HTTP 400 - Dữ liệu không hợp lệ):**
  ```json
  {
    "success": false,
    "message": "Số điện thoại không hợp lệ hoặc thiếu mô tả lỗi!"
  }
  ```

---

## 4. Quy Trình Thay Đổi Hợp Đồng API (API Change Management Workflow)

> [!IMPORTANT]
> **API là bản cam kết giữa Backend và các Client (Web & Mobile).**  
> Tuyệt đối KHÔNG BAO GIỜ được tự ý thay đổi tên trường (ví dụ: đổi `token` thành `sessionToken`, `phone` thành `phoneNumber`) hoặc đổi kiểu dữ liệu một cách âm thầm!

Mọi thay đổi API phải tuân thủ quy trình 6 bước sau:

```
[ BƯỚC 1: ĐỀ XUẤT ] ──► [ BƯỚC 2: CẬP NHẬT DOCS ] ──► [ BƯỚC 3: THÔNG BÁO ]
                                                              │
[ BƯỚC 6: KIỂM THỬ ] ◄── [ BƯỚC 5: CLIENT CODE ]  ◄─── [ BƯỚC 4: BACKEND PR ]
```

1. **Bước 1 - Đề xuất & Xác định ảnh hưởng:**
   - Người đề xuất mở Issue trên GitHub (hoặc thảo luận trực tiếp trên kênh team).
   - Xác định rõ: Thay đổi trường gì? Ảnh hưởng đến Web (`frontend/`) hay Mobile (`mobile/`) hay cả hai?
2. **Bước 2 - Cập nhật Tài liệu (`docs/API_DOCUMENTATION.md`):**
   - Đưa thay đổi vào file này trước, ghi chú rõ phiên bản và ngày sửa đổi.
3. **Bước 3 - Thông báo chính thức cho Client Developers:**
   - Backend Developer thông báo tới Developer phụ trách Frontend/Mobile về thay đổi và thời điểm deploy Backend test.
4. **Bước 4 - Triển khai Backend:**
   - Backend Developer tạo PR thực thi logic theo đúng hợp đồng tài liệu đã cập nhật.
5. **Bước 5 - Triển khai Client (Web & Mobile):**
   - Các developer phụ trách Web/Mobile cập nhật model và service tương ứng.
6. **Bước 6 - Kiểm thử tích hợp (Integration Test):**
   - Cả hai bên kiểm thử đồng bộ luồng dữ liệu trên môi trường Local/Staging trước khi đóng task.
