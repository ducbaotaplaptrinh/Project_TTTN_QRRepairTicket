# Project_TTTN_QRRepairTicket

> **Hệ thống Quản lý & Tiếp nhận Phiếu Sửa Chữa / Bảo Hành Thiết Bị Bằng Mã QR (QR Repair Ticket System)**

Dự án là giải pháp số hóa toàn diện quy trình tiếp nhận máy tại quầy dịch vụ sửa chữa và bảo hành. Hệ thống cho phép Lễ tân sinh mã QR phiên làm việc trực tiếp trên Web, khách hàng dùng điện thoại quét mã để tự động mở biểu mẫu và gửi thông tin tiếp nhận, giảm thiểu thời gian chờ đợi và sai sót trong quá trình nhập liệu thủ công.

---

## 1. Kiến Trúc Tổng Quan (Architecture Overview)

Hệ thống được xây dựng theo kiến trúc phân tầng chuẩn (3-Tier Architecture). **Web và Mobile tuyệt đối không truy cập trực tiếp vào Cơ sở dữ liệu PostgreSQL**, mọi thao tác nghiệp vụ đều bắt buộc phải thông qua lớp Next.js Backend REST API:

```
                    ┌────────────────────────┐
                    │  CUSTOMER MOBILE APP   │ (Flutter / Dart)
                    │  (Khách hàng quét QR)  │
                    └───────────┬────────────┘
                                │ REST API (JSON)
                                ▼
                    ┌────────────────────────┐
                    │    NEXT.JS BACKEND     │ (Node.js REST API)
                    │ (Business Logic & Auth)│
                    └───────────┬────────────┘
                                │ SQL Connection
                                ▼
                    ┌────────────────────────┐
                    │  POSTGRESQL DATABASE   │
                    └────────────────────────┘
                                ▲
                                │ SQL Connection
                    ┌───────────┴────────────┐
                    │    NEXT.JS BACKEND     │
                    └───────────▲────────────┘
                                │ REST API (JSON)
                    ┌───────────┴────────────┐
                    │    FRONTEND WEB APP    │ (Next.js / React)
                    │   (Lễ tân & Quản lý)   │
                    └────────────────────────┘
```

👉 Xem tài liệu chi tiết tại: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

---

## 2. Cấu Trúc Repository (Repository Structure)

Monorepo được phân chia ranh giới rõ ràng cho 3 thành viên phụ trách:

```
Project_TTTN_QRRepairTicket/
│
├── backend/            # Mã nguồn Backend API & Database (Next.js / Node.js)
├── frontend/           # Ứng dụng Web dành cho Lễ tân & Quản trị viên (Next.js / React)
├── mobile/             # Ứng dụng di động Customer App dành cho Khách hàng (Flutter / Dart)
│
├── docs/               # Thư viện tài liệu kỹ thuật dùng chung cho cả đội ngũ
│   ├── API_DOCUMENTATION.md    # Hợp đồng API Contract giữa Backend và Client (Source of Truth)
│   ├── ARCHITECTURE.md         # Chi tiết kiến trúc hệ thống, data flow & QR self-service flow
│   ├── DATABASE.md             # Thiết kế mô hình dữ liệu logic & quan hệ thực thể PostgreSQL
│   ├── ENVIRONMENT.md          # Hướng dẫn cấu hình môi trường Local, Staging, Production & secrets
│   ├── GIT_WORKFLOW.md         # Quy chuẩn nhánh Git, commit convention, PR review & conflict
│   ├── DEVELOPMENT_SETUP.md    # Hướng dẫn cài đặt môi trường máy dev từ A-Z & troubleshooting
│   └── CONTRIBUTING.md         # Quy trình phối hợp đội ngũ & onboarding cho thành viên mới
│
├── .github/            # Cấu hình GitHub templates chuẩn mực
│   ├── PULL_REQUEST_TEMPLATE.md # Mẫu PR kiểm soát scope, testing và thay đổi API
│   └── ISSUE_TEMPLATE/
│       ├── bug_report.md        # Mẫu báo cáo lỗi kỹ thuật
│       └── feature_request.md   # Mẫu đề xuất tính năng mới
│
├── .gitignore          # Quy tắc loại trừ tệp tự động (Node, Next, Flutter, Dart, env, OS/IDE)
└── README.md           # Tài liệu hướng dẫn trung tâm
```

---

## 3. Công Nghệ Sử Dụng (Technology Stack)

Toàn bộ công nghệ được xác định chuẩn xác từ thiết kế kiến trúc và mã nguồn thực tế:

| Thành phần | Công nghệ chính | Phiên bản / Thư viện cốt lõi |
| :--- | :--- | :--- |
| **Backend API** | Next.js (Node.js runtime) | Node.js `v18+` / `v20+` LTS, RESTful API, PostgreSQL |
| **Frontend Web** | Next.js / React | Next.js, React, Vanilla CSS / Component-based UI |
| **Customer Mobile** | Flutter / Dart | Dart SDK `^3.10.4`, Flutter `3.x`<br>State: `provider: ^6.1.2`<br>Network: `dio: ^5.8.0+1`<br>QR: `mobile_scanner: ^6.0.4`<br>Noti: `flutter_local_notifications: ^18.0.1` |
| **Database** | PostgreSQL | PostgreSQL `v14+` / `v15+` / `v16+` |

---

## 4. Phân Chia Trách Nhiệm Đội Ngũ (Team Responsibilities)

Hệ thống được phát triển bởi đội ngũ 3 thành viên:

- **Developer 1 (Backend Engineer):**
  - Chịu trách nhiệm chính tại [backend/](backend/).
  - Thiết kế và triển khai REST API, business logic, kết nối PostgreSQL.
  - Quản lý vòng đời phiên quét mã QR, xác thực và phân quyền.
  - Đảm bảo tài liệu [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) luôn đồng bộ với mã nguồn.
- **Developer 2 (Frontend Web Engineer):**
  - Chịu trách nhiệm chính tại [frontend/](frontend/).
  - Xây dựng giao diện Web cho Lễ tân tại quầy (tạo phiên QR, hiển thị QR cho khách quét).
  - Xây dựng màn hình quản lý danh sách phiếu sửa chữa, điều phối kỹ thuật viên.
- **Developer 3 (Flutter Mobile Engineer):**
  - Chịu trách nhiệm chính tại [mobile/](mobile/).
  - Xây dựng ứng dụng di động cho khách hàng.
  - Tích hợp camera quét mã QR, gọi API xác thực phiên, mở form điền thông tin tiếp nhận.
  - Quản lý trạng thái phiếu sửa chữa trên thiết bị của khách hàng.
- **Cả Team:**
  - Cùng đóng góp và tuân thủ tài liệu tại [docs/](docs/).

---

## 5. Hướng Dẫn Bắt Đầu Nhanh (Quick Start)

Developer mới clone repository về máy chỉ cần làm theo hướng dẫn từng bước:

```powershell
# 1. Clone repository
git clone https://github.com/ducbaotaplaptrinh/Project_TTTN_QRRepairTicket.git
cd Project_TTTN_QRRepairTicket

# 2. Xem hướng dẫn setup chi tiết cho từng phần
```
👉 **Xem hướng dẫn chi tiết:** [docs/DEVELOPMENT_SETUP.md](docs/DEVELOPMENT_SETUP.md)

---

## 6. Liên Kết Tài Liệu Kỹ Thuật (Documentation Links)

Mọi quy chuẩn và kiến thức vận hành hệ thống được lưu trữ đầy đủ trong thư mục `docs/`:

1. 🚀 **Hướng dẫn cài đặt môi trường:** [docs/DEVELOPMENT_SETUP.md](docs/DEVELOPMENT_SETUP.md)
2. 🌿 **Quy trình làm việc với Git/GitHub:** [docs/GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md)
3. 📡 **Hợp đồng & Đặc tả API (API Contract):** [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)
4. 🏛️ **Kiến trúc hệ thống & Luồng QR:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
5. 🌐 **Môi trường & Biến cấu hình (Local/Staging/Prod):** [docs/ENVIRONMENT.md](docs/ENVIRONMENT.md)
6. 🗄️ **Mô hình Cơ sở dữ liệu logic:** [docs/DATABASE.md](docs/DATABASE.md)
7. 🤝 **Quy chuẩn đóng góp & Onboarding Checklist:** [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)

---

## 7. Checklist Nhanh Cho Thành Viên Mới (New Developer Checklist)

- [ ] Đã clone repository và đọc xong [README.md](README.md).
- [ ] Đã đọc [ARCHITECTURE.md](docs/ARCHITECTURE.md) để hiểu bức tranh kiến trúc.
- [ ] Đã hoàn tất cài đặt máy theo [DEVELOPMENT_SETUP.md](docs/DEVELOPMENT_SETUP.md).
- [ ] Đã cấu hình file môi trường theo [ENVIRONMENT.md](docs/ENVIRONMENT.md).
- [ ] Đã khởi chạy và xác nhận ứng dụng phụ trách chạy thành công trên máy.
- [ ] Đã đọc [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md) (nếu làm Web/Mobile).
- [ ] Đã đọc kỹ [GIT_WORKFLOW.md](docs/GIT_WORKFLOW.md) về cách tạo branch (`feature/xxx`) và commit (`feat(...)`).
- [ ] Tạo branch mới và sẵn sàng thực hiện task được giao!
