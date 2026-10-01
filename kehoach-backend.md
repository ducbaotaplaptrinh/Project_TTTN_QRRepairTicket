# KẾ HOẠCH HÀNH ĐỘNG CỦA BACKEND DEVELOPER (BÁM SÁT 7 TÀI LIỆU TEAM)

Dựa trên sự nhất trí của cả nhóm qua 7 tài liệu đặc tả (đặc biệt là `CONTRIBUTING.md` và `GIT_WORKFLOW.md`), dưới đây là kế hoạch hành động chi tiết từng bước (Step-by-step) dành riêng cho vai trò Backend Developer để hoàn thành tích hợp và bàn giao API.

---

## GIAI ĐOẠN 1: ONBOARDING & SETUP THEO CHUẨN (Bám sát CONTRIBUTING.md & DEVELOPMENT_SETUP.md)

### Bước 1: Khởi tạo Nhánh làm việc (Branch Strategy)
Theo `GIT_WORKFLOW.md`, không bao giờ làm việc trực tiếp trên `main`.
```powershell
git switch main
git pull origin main
# Tạo nhánh mới theo chuẩn Naming Convention
git switch -c feature/backend-api-refactor
```

### Bước 2: Thiết lập Kỷ luật Thư mục (Scope Discipline)
Theo `CONTRIBUTING.md`, Backend Developer **TUYỆT ĐỐI KHÔNG** đụng vào `frontend/` hay `mobile/`. 
- Đổi tên thư mục `back-end` hiện tại thành `backend/`.
- Xóa bỏ thư mục `node_modules/` cũ để cài đặt lại chuẩn.

### Bước 3: Cấu hình Môi trường (ENVIRONMENT.md)
Tạo file `backend/.env` (và tuyệt đối không commit file này). Đảm bảo chứa đủ 6 biến theo tài liệu:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://[supabase_url]
JWT_SECRET=lucgiac_secret_key
QR_SESSION_TTL=900
CORS_ORIGIN=http://localhost:3000
```

---

## GIAI ĐOẠN 2: REFACTOR DATABASE THEO CHUẨN TIẾNG ANH (Bám sát DATABASE.md)

Theo thiết kế Logical Schema, hệ thống bắt buộc dùng **PostgreSQL** và bảng tiếng Anh.
1. **Xóa bỏ MSSQL:** Gỡ thư viện `mssql`, cài đặt `pg`.
2. **Khởi tạo 5 bảng tiếng Anh trên Supabase:**
   - `accounts` (thay vì TaiKhoan)
   - `customers` (thay vì KhachHang)
   - `devices` (thay vì ThietBi)
   - `tickets` (thay vì PhieuSuaChua)
   - `ticket_sessions` (thay vì PhienQuet)
3. **Cấu trúc lại Models/Services:** Viết lại toàn bộ câu lệnh SQL từ đầu (dùng Parameterized Queries `$1, $2` để chống SQL Injection).

---

## GIAI ĐOẠN 3: CHUẨN HÓA API CONTRACT (Bám sát API_DOCUMENTATION.md)

Đây là bước quan trọng nhất. Nếu Backend trả sai API Contract, Client của Frontend và Mobile sẽ sụp đổ.

### 1. API Đăng nhập (`POST /api/auth/login`)
- **Yêu cầu:** Trả về `{ success, message, data: { accountId, username, fullName, role, token } }`.
- **Thực thi:** Sửa lại Controller Đăng nhập để map đúng thuộc tính tiếng Anh.

### 2. API Sinh mã QR (`POST /api/tickets/init-session`)
- **Yêu cầu:** Trả về `{ data: { ticketId, ticketCode, sessionToken, qrImage, expiresAt } }`.
- **Thực thi:** Cập nhật Service tạo phiên QR, định dạng `ticketCode` thành chuẩn `TK-<timestamp>`.

### 3. API Mobile Quét mã & Nộp Form (`POST /api/tickets/session/:token/submit`)
- **Yêu cầu Payload:** `{ fullName, phone, email, deviceName, issueDescription }`.
- **Thực thi:** Viết lại luồng Transaction: Tạo `customers` -> Tạo `devices` -> Tạo `tickets` (Trạng thái `PENDING`) -> Hủy vĩnh viễn `sessionToken`.

---

## GIAI ĐOẠN 4: KIỂM THỬ TÍCH HỢP & BẢO MẬT (INTEGRATION & SECURITY TEST)

Trước khi hô vang "Code xong rồi", Backend phải tự vượt qua bài Test nội bộ.

### 1. Unit/Manual Test API
- Bật Postman, gọi lại 5 Endpoint trên. So sánh từng field JSON trả về với `API_DOCUMENTATION.md`. Nếu sai 1 chữ cũng phải sửa lại.

### 2. Kiểm tra Bảo mật (OWASP Top 10)
- **A01 (Broken Access Control):** Dùng JWT của Lễ tân gọi API Kỹ thuật viên -> Kỳ vọng `403 Forbidden`.
- **A03 (SQL Injection):** Cố ý gửi chuỗi `' OR 1=1` vào Form nộp phiếu -> Kỳ vọng DB an toàn nhờ dùng `$1`.
- **A04 (DDoS/Rate Limit):** Bắn 30 Request liên tục -> Kỳ vọng văng lỗi `429 Too Many Requests`.
- **A05 (Error Hiding):** Bọc mọi lỗi của Postgres (Ví dụ lỗi trùng số điện thoại) thành câu chữ thân thiện: `"Số điện thoại đã tồn tại"`, không được văng mã lỗi SQL ra ngoài.

---

## GIAI ĐOẠN 5: BÀN GIAO & MERGE VÀO MAIN (Quy trình làm việc nhóm)

Thực hiện đúng theo sơ đồ **Quy Trình Phối Hợp 3 Người Khi Làm Tính Năng Mới**:
1. **Gom Code:** Chạy `git status`, chỉ `git add backend/`.
2. **Commit:** Đặt tên đúng chuẩn Conventional:
   ```powershell
   git commit -m "feat(backend): refactor database schema and standardize API contract"
   ```
3. **Deploy Tạm:** Đưa code lên Vercel để sinh ra `API_URL` thật.
4. **Họp Tích Hợp (Integration Test):** Gửi `API_URL` cho Frontend và Mobile. Hai bên đổi Base URL và chạy thử luồng "Khách hàng quét QR".
5. **Tạo Pull Request:** Lên GitHub mở PR. Nhờ Trưởng nhóm hoặc bạn Frontend review code. Đảm bảo Checklist:
   - [x] KHÔNG CÓ file `.env` bị lọt vào commit.
   - [x] Không có `node_modules`.
   - [x] API chạy mượt mà.
6. **Merge `main`:** Hoàn thành xuất sắc nhiệm vụ Backend!
