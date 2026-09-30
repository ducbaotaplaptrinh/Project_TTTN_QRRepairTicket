# TÀI LIỆU TÍCH HỢP API BACK-END (LỤC GIÁC)
**Base URL (Mạng LAN):** `http://10.50.195.212:5000`
*(Lưu ý: Nếu test trên cùng 1 máy tính thì có thể dùng `http://localhost:5000`)*
**Header bắt buộc cho mọi API POST:** `Content-Type: application/json`

---

## PHẦN 1: TÀI KHOẢN & ĐĂNG NHẬP

### 1. Đăng nhập hệ thống (Nội bộ)
Dành cho Nhân viên lễ tân hoặc Kỹ thuật viên đăng nhập vào phần mềm.
*   **Method:** `POST`
*   **URL:** `/api/auth/login`
*   **Body (Gửi lên):**
```json
{
  "username": "kythuat01",
  "password": "123456"
}
```
*   **Response (Thành công):**
```json
{
  "success": true,
  "message": "Đăng nhập thành công!",
  "data": {
    "AccountID": 1,
    "Username": "kythuat01",
    "FullName": "Trần Kỹ Thuật",
    "Role": "TECHNICIAN"
  }
}
```

---

## PHẦN 2: THIẾT BỊ & MÃ QR (Nhân viên dùng)

### 2. Thêm thiết bị mới & Sinh mã QR trực tiếp
Dùng khi Nhân viên muốn lưu thiết bị trực tiếp tại quầy mà không cần khách hàng tự điền.
*   **Method:** `POST`
*   **URL:** `/api/devices`
*   **Body:**
```json
{
  "CustomerID": 1,
  "DeviceCode": "LG-9999",
  "DeviceName": "Laptop Dell XPS",
  "SerialOrVersion": "SN-123456"
}
```
*   **Response:** Trả về ID thiết bị kèm chuỗi ảnh QR Code (Base64) để in ra.

### 3. Quét QR truy xuất thông tin thiết bị
Dùng khi Kỹ thuật viên cầm máy lên và dùng điện thoại quét mã vạch trên máy.
*   **Method:** `GET`
*   **URL:** `/api/devices/:deviceCode` (Ví dụ: `/api/devices/LG-9999`)
*   **Response:**
```json
{
  "success": true,
  "data": {
    "DeviceID": 5,
    "DeviceName": "Laptop Dell XPS",
    "CustomerName": "Nguyễn Văn Khách",
    "Phone": "0901234567"
  }
}
```

---

## PHẦN 3: LUỒNG KHÁCH HÀNG TỰ TẠO PHIẾU BẰNG MÃ QR (Self-service)

### 4. Khởi tạo Phiên Quét QR (Lễ tân dùng)
Lễ tân bấm nút trên phần mềm, màn hình sẽ hiện mã QR to đùng chờ khách lấy điện thoại quét.
*   **Method:** `POST`
*   **URL:** `/api/tickets/init-session`
*   **Body:** *(Không cần)*
*   **Response (Thành công):**
```json
{
  "success": true,
  "data": {
    "ticketId": 10,
    "ticketCode": "TK-1790667970452",
    "sessionToken": "03b03f99-3383-447f-9046-69c523d4b548",
    "qrImage": "data:image/png;base64,iVBORw0KGgo..."
  }
}
```

### 5. Kiểm tra mã QR hợp lệ (Khách quét xong mở Web)
Khi điện thoại khách vừa mở giao diện web lên, Front-end lập tức gọi API này để xem QR còn hạn không.
*   **Method:** `GET`
*   **URL:** `/api/tickets/session/:token` (Thay `:token` bằng chuỗi token lấy từ URL)
*   **Response (Thành công):** HTTP 200, cho phép mở Form.
*   **Response (Thất bại/Quét mã cũ):** HTTP 404, *"Mã QR đã hết hạn hoặc không tồn tại!"*.

### 6. Khách hàng bấm Nộp Form Yêu cầu
Khách điền xong Tên, SĐT, Lỗi trên điện thoại và bấm gửi.
*   **Method:** `POST`
*   **URL:** `/api/tickets/session/:token/submit` (Thay `:token` bằng chuỗi token)
*   **Body:**
```json
{
  "fullName": "ducbao bao",
  "phone": "0972688222",
  "email": "bao@gmail.com",
  "deviceName": "Laptop ASUS ROG",
  "issueDescription": "Máy bị hỏng phím cách, khởi động chậm"
}
```
*   **Response (Thành công):** Hệ thống tự động tạo User, tạo Device và chuyển Phiếu sang `PENDING`. Hủy Token vĩnh viễn.
```json
{
  "success": true,
  "message": "Gửi Yêu cầu bảo hành thành công!",
  "data": {
    "ticketCode": "TK-1790667970452"
  }
}
```
