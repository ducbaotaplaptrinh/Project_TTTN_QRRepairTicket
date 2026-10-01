## 1. Mục Đích & Mô Tả Thay Đổi (What changed?)
<!-- Mô tả tóm tắt tính năng, bug fix hoặc thay đổi được thực hiện trong PR này -->

## 2. Issue Liên Quan (Related Issue)
<!-- Ghi số ID của issue, ví dụ: Closes #12 hoặc Refs #34 -->
Closes #

## 3. Phạm Vi Thay Đổi (Scope)
- [ ] `backend/` (Next.js Backend API / Database)
- [ ] `frontend/` (Next.js Web Lễ tân / Admin)
- [ ] `mobile/` (Flutter Customer App)
- [ ] `docs/` (Tài liệu kỹ thuật / Quy trình)
- [ ] Khác (Cấu hình repo, CI/CD, .gitignore)

## 4. Thay Đổi Về API Contract (API Changes)
- [ ] Không có thay đổi API nào
- [ ] Có thêm API mới
- [ ] Có sửa đổi API hiện có (Sửa request body, query param, response schema)
- [ ] Có xóa / deprecate API cũ

> **Nếu có thay đổi API:**
> - [ ] Đã cập nhật file `docs/API_DOCUMENTATION.md`?
> - [ ] Đã thông báo cho phía Web / Mobile để chuẩn bị tích hợp?

## 5. Kết Quả Kiểm Thử (Testing)
- [ ] Đã chạy thử nghiệm trên máy cục bộ (Local tested)
- [ ] Đã kiểm tra API bằng Postman / curl (API tested)
- [ ] Đã chạy thử ứng dụng Mobile trên máy ảo / máy thật (Mobile tested)
- [ ] Đã kiểm tra giao diện Frontend Web trên trình duyệt (Frontend tested)
- [ ] Đã kiểm thử tích hợp luồng chéo giữa Client và Backend (Integration tested)

## 6. Danh Sách Kiểm Tra An Toàn (Checklist)
- [ ] **Tuyệt đối KHÔNG commit file `.env`, token, secret, database password.**
- [ ] Không có file thừa, file sinh tự động (`node_modules`, `.next`, `build/`, `.dart_tool`).
- [ ] Chỉ sửa các file nằm trong phạm vi task (No unrelated files changed).
- [ ] Đã xóa các đoạn mã debug thừa (ví dụ: `console.log`, `print`, code tạm).
- [ ] Tiêu đề commit tuân thủ quy chuẩn Conventional Commits.
