# Hướng Dẫn Đóng Góp & Onboarding Cho Lập Trình Viên Mới (Contributing Guide)

Chào mừng bạn gia nhập đội ngũ phát triển dự án **Project_TTTN_QRRepairTicket**! Tài liệu này là kim chỉ nam giúp bạn nhanh chóng nắm bắt văn hóa làm việc, quy trình kỹ thuật và bắt đầu đóng góp code một cách hiệu quả, an toàn.

---

## 1. Bản Đồ Tiếp Nhận Thành Viên Mới (New Developer Onboarding Roadmap)

Nếu bạn là thành viên mới toanh vừa tham gia team, hãy thực hiện tuần tự 8 bước sau đây trước khi gõ dòng code đầu tiên:

```
[ 1. CLONE REPO ] ──► [ 2. ĐỌC README ] ──► [ 3. ĐỌC ARCHITECTURE ] ──► [ 4. SETUP MÁY ]
                                                                               │
[ 8. TẠO BRANCH ] ◄── [ 7. CHỌN ISSUE ] ◄── [ 6. ĐỌC API DOCS ]   ◄──── [ 5. CHẠY THỬ ]
```

1. **Bước 1:** Clone repository về máy tính cá nhân theo hướng dẫn tại [DEVELOPMENT_SETUP.md](DEVELOPMENT_SETUP.md).
2. **Bước 2:** Đọc kỹ [README.md](../README.md) ở thư mục gốc để nắm được bức tranh tổng thể và công nghệ sử dụng.
3. **Bước 3:** Đọc [ARCHITECTURE.md](ARCHITECTURE.md) để hiểu luồng di chuyển dữ liệu (Data Flow) và tính năng QR Self-service.
4. **Bước 4:** Thiết lập các công cụ, biến môi trường và kết nối cơ sở dữ liệu trên máy bạn theo [ENVIRONMENT.md](ENVIRONMENT.md).
5. **Bước 5:** Khởi chạy thử ứng dụng thuộc phạm vi phụ trách của bạn (Backend, Frontend hoặc Mobile) và xác nhận chạy thành công.
6. **Bước 6:** Nếu bạn làm **Frontend Web** hoặc **Mobile App**, bắt buộc phải đọc kỹ [API_DOCUMENTATION.md](API_DOCUMENTATION.md) để nắm hợp đồng dữ liệu.
7. **Bước 7:** Kiểm tra danh sách GitHub Issues của repository để nhận Task hoặc thảo luận với Team Lead.
8. **Bước 8:** Tạo branch tính năng mới theo chuẩn [GIT_WORKFLOW.md](GIT_WORKFLOW.md) và bắt đầu làm việc!

---

## 2. Phân Chia Phạm Vi Trách Nhiệm (Component Ownership)

Để tránh xung đột mã nguồn và giữ ranh giới rõ ràng, dự án phân chia ranh giới theo thư mục:

| Thành viên | Thư mục ưu tiên | Trách nhiệm chính |
| :--- | :--- | :--- |
| **Backend Developer** | `backend/`<br>`docs/API_DOCUMENTATION.md` | Xây dựng API, kết nối PostgreSQL, sinh mã QR, quản lý vòng đời phiên, đảm bảo API Contract luôn cập nhật. |
| **Frontend Developer** | `frontend/` | Xây dựng giao diện Web cho Lễ tân và Quản trị viên, gọi API theo đúng đặc tả, hiển thị mã QR. |
| **Mobile Developer** | `mobile/` | Xây dựng Customer Mobile App (Flutter), tính năng quét mã QR bằng camera, form nhập liệu tiếp nhận. |
| **Cả Team** | `docs/` | Đóng góp và hoàn thiện tài liệu dùng chung khi có thay đổi kỹ thuật. |

> [!WARNING]
> **Kỷ luật về phạm vi (Scope Discipline):**  
> Khi bạn làm một task thuộc về Mobile, PR của bạn chỉ nên chứa các tệp trong thư mục `mobile/` (kèm tài liệu `docs/` nếu có). **Tuyệt đối không tự ý refactor hay format lại code của các thư mục khác** nằm ngoài phạm vi công việc được giao.

---

## 3. Quy Trình Phối Hợp 3 Người Khi Làm Tính Năng Mới (Cross-Team Feature Flow)

Lấy ví dụ về tính năng cốt lõi: **Khách hàng quét mã QR tự tạo phiếu tiếp nhận (QR Self-Service)**:

```
                  ┌───────────────────────────────┐
                  │ 1. Thống nhất API Contract    │
                  │    trong API_DOCUMENTATION.md │
                  └───────────────┬───────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
┌──────────────────────────────┐                  ┌──────────────────────────────┐
│ 2. Backend Developer:        │                  │ 3. Client Developers:        │
│ - Tạo nhánh feature/backend  │                  │ - Frontend: feature/web-qr   │
│ - Code API init & submit     │                  │ - Mobile: feature/mobile-qr  │
│ - Viết Unit test & deploy    │                  │ - Dùng Mock data theo docs   │
└──────────────┬───────────────┘                  └──────────────┬───────────────┘
               │                                                 │
               └────────────────────────┬────────────────────────┘
                                        ▼
                         ┌──────────────────────────────┐
                         │ 4. Kiểm thử tích hợp chung   │
                         │    (Integration Test)        │
                         └──────────────┬───────────────┘
                                        ▼
                         ┌──────────────────────────────┐
                         │ 5. Review PR & Merge main    │
                         └──────────────────────────────┘
```

---

## 4. Bảng Kiểm Tra Bắt Buộc (Developer Checklist)

### Checklist Trước Khi Gõ Code (Before Coding)
- [ ] Đã chuyển về `main` và kéo code mới nhất: `git switch main && git pull origin main`.
- [ ] Đã đọc kỹ mô tả yêu cầu trong GitHub Issue.
- [ ] Đã đối chiếu kỹ các trường dữ liệu trong [API_DOCUMENTATION.md](API_DOCUMENTATION.md) (nếu làm Web/Mobile).
- [ ] Đã tạo nhánh đúng quy chuẩn: `git switch -c feature/ten-tinh-nang`.

### Checklist Trước Khi Tạo Pull Request (Before Submitting PR)
- [ ] Ứng dụng chạy thử nghiệm thành công trên máy cục bộ, không phát sinh lỗi biên dịch.
- [ ] Đã chạy `git status` và `git diff` để rà soát từng dòng code đã sửa.
- [ ] **KHÔNG CÓ bất kỳ file `.env` hay mật khẩu/secret nào lọt vào commit.**
- [ ] Không có các file rác, file sinh tự động (`node_modules`, `.next`, `build/`, `.dart_tool`).
- [ ] Đã cập nhật tài liệu kỹ thuật (`docs/`) nếu tính năng có thay đổi về luồng hoặc API.
- [ ] Tiêu đề commit tuân thủ quy chuẩn Conventional Commits (`feat(...)`, `fix(...)`).
