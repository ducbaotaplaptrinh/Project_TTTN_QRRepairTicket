# Quy Trình Git & GitHub Cho Đội Ngũ Phát Triển (Git Workflow)

Tài liệu này là quy chuẩn bắt buộc dành cho mọi thành viên tham gia phát triển dự án **Project_TTTN_QRRepairTicket** (Bao gồm Backend Developer, Frontend Web Developer, và Mobile Developer). 

Mục tiêu: Đảm bảo mã nguồn trên nhánh chính luôn ổn định, loại bỏ rủi ro xung đột mã (conflict), không rò rỉ mã bí mật (secrets), và giúp thành viên mới làm việc nhịp nhàng ngay từ ngày đầu tiên.

---

## 1. Cấu Trúc Repository & Nguyên Tắc Nhánh (Branch Strategy)

Dự án sử dụng mô hình phân chia theo nhánh tính năng dựa trên nhánh chuẩn `main`:

```
               (Pull Request & Review)
feature/xxx ──────────────────────────┐
                                      ▼
main (STABLE) ───────────────────► [ MERGE ] ───────────────────►
      ▲                               ▲
      └────── git switch -c ──────────┘
```

- **Nhánh `main`:**
  - Là nhánh mã nguồn chính thức, phản ánh trạng thái ổn định nhất của dự án.
  - **TUYỆT ĐỐI KHÔNG commit hoặc push trực tiếp lên nhánh `main`.**
  - Mọi thay đổi đều phải đi qua nhánh riêng (`feature/`, `fix/`, ...) và được đưa vào `main` thông qua **Pull Request (PR)** có sự review.

---

## 2. Quy Chuẩn Đặt Tên Nhánh (Branch Naming Convention)

Tên nhánh phải viết bằng chữ thường (lowercase), phân tách bằng dấu gạch nối `-`, có tiền tố xác định mục đích rõ ràng:

| Tiền tố | Mục đích | Ví dụ |
| :--- | :--- | :--- |
| `feature/` | Phát triển tính năng mới | `feature/mobile-qr-scanner`<br>`feature/backend-ticket-session`<br>`feature/frontend-ticket-management` |
| `fix/` | Sửa lỗi đã phát hiện | `fix/mobile-invalid-qr`<br>`fix/backend-expired-session`<br>`fix/frontend-cors-error` |
| `refactor/` | Tối ưu/cấu trúc lại code (không đổi tính năng) | `refactor/backend-auth-middleware`<br>`refactor/mobile-state-provider` |
| `docs/` | Bổ sung, cập nhật tài liệu kỹ thuật | `docs/update-api-contract`<br>`docs/environment-setup` |
| `chore/` | Cập nhật cấu hình, dependency, script | `chore/update-flutter-deps`<br>`chore/setup-prettier` |

---

## 3. Quy Trình Làm Việc Hằng Ngày (Daily Workflow - Từng Bước Cụ Thể)

Mỗi khi bắt đầu một công việc mới, hãy tuân thủ tuần tự các bước dòng lệnh sau:

### Bước 1: Cập nhật nhánh `main` mới nhất
Trước khi tạo nhánh mới, luôn đảm bảo bạn bắt đầu từ phiên bản mới nhất của dự án:
```powershell
# 1. Chuyển về nhánh main
git switch main

# 2. Kéo code mới nhất từ GitHub về
git pull origin main
```

### Bước 2: Tạo nhánh làm việc mới từ `main`
```powershell
# Tạo và chuyển ngay sang nhánh mới
git switch -c feature/mobile-qr-scanner
```

### Bước 3: Phát triển mã nguồn & Kiểm tra cục bộ
- Chỉ sửa đổi các tệp thuộc phạm vi công việc được giao (ví dụ: Mobile dev làm trong `mobile/`).
- Thực hiện kiểm tra, chạy thử và đảm bảo ứng dụng không lỗi trước khi commit.

### Bước 4: Kiểm tra trạng thái thay đổi (KHÔNG DÙNG `git add .` BỪA BÃI)
> [!WARNING]
> Không chạy `git add .` khi chưa kiểm tra `git status`. Lệnh `git add .` có thể vô tình đưa các file rác, file `.env` hoặc file sinh tự động vào commit.

```powershell
# 1. Xem danh sách các file đang bị thay đổi hoặc untracked
git status

# 2. Xem chi tiết các dòng code đã sửa
git diff

# 3. Chỉ add các thư mục/file thuộc phạm vi task của bạn
git add mobile/
# Hoặc add từng file cụ thể:
git add mobile/lib/features/qr_scanner/scanner_view.dart
```

### Bước 5: Tạo Commit theo chuẩn Conventional Commits
```powershell
git commit -m "feat(mobile): add QR scanner camera view and permission handling"
```

### Bước 6: Đẩy nhánh lên GitHub (Push)
```powershell
# Lần đầu push nhánh lên GitHub:
git push -u origin feature/mobile-qr-scanner

# Những lần push tiếp theo trên cùng nhánh:
git push
```

### Bước 7: Mở Pull Request (PR) trên GitHub
- Truy cập repository trên GitHub: https://github.com/ducbaotaplaptrinh/Project_TTTN_QRRepairTicket
- GitHub sẽ tự động hiển thị nút **Compare & pull request**.
- Điền đầy đủ thông tin theo mẫu **Pull Request Template**.
- Yêu cầu ít nhất 1 thành viên liên quan trong team review code.

---

## 4. Quy Chuẩn Đặt Tên Commit (Commit Convention)

Dự án áp dụng chuẩn **Conventional Commits**:
```text
<type>(<scope>): <mô tả ngắn gọn bằng tiếng Anh hoặc tiếng Việt rõ nghĩa>
```

### Các `type` được phép sử dụng:
- `feat`: Tính năng mới (ví dụ: `feat(backend): add ticket session init API`)
- `fix`: Sửa lỗi (ví dụ: `fix(mobile): handle camera permission denied`)
- `refactor`: Tái cấu trúc mã nguồn (ví dụ: `refactor(frontend): extract ticket table component`)
- `docs`: Sửa hoặc thêm tài liệu (ví dụ: `docs(api): update submit session request payload`)
- `test`: Thêm hoặc cập nhật test (ví dụ: `test(backend): add ticket validation unit tests`)
- `chore`: Việc vặt, config, package (ví dụ: `chore(deps): bump dio version to 5.8.0`)

### Các phạm vi (`scope`) đề xuất:
- `backend`, `frontend`, `mobile`, `docs`, `config`, `api`

### ❌ Những Commit KHÔNG ĐƯỢC CHẤP NHẬN:
- `git commit -m "update"`
- `git commit -m "fix bug"`
- `git commit -m "final"`
- `git commit -m "abc"`
- `git commit -m "code xong"`

---

## 5. Đồng Bộ Nhánh & Xử Lý Xung Đột (Merge & Conflict Resolution)

Để giữ quy trình đơn giản và an toàn nhất cho team 3 người, chúng ta sử dụng **Git Merge** chuẩn để cập nhật code mới từ `main` vào nhánh tính năng của bạn trước khi tạo PR.

### Cách đồng bộ code mới nhất từ `main` vào nhánh của bạn:
Khi bạn đang làm việc trên nhánh `feature/xxx` mà nhánh `main` trên GitHub đã có người khác merge code mới:
```powershell
# 1. Commit các thay đổi đang dở dang trên nhánh của bạn
git status
git add <các file đã sửa>
git commit -m "feat(...): ..."

# 2. Cập nhật nhánh main cục bộ
git switch main
git pull origin main

# 3. Quay lại nhánh của bạn và hòa trộn main vào
git switch feature/mobile-qr-scanner
git merge main
```

### Xử lý Xung Đột (Merge Conflict):
Nếu Git thông báo có conflict, đừng hoảng loạn! Hãy làm tuần tự:

1. **Conflict là gì?** Conflict xảy ra khi hai người cùng sửa vào các dòng code giống nhau trên cùng một file.
2. **Cách nhận biết conflict:** Mở file bị conflict lên trong VS Code / Android Studio, bạn sẽ thấy ký hiệu:
   ```text
   <<<<<<< HEAD (Mã trên nhánh hiện tại của bạn)
   final baseUrl = "http://10.0.2.2:5000";
   =======
   final baseUrl = "http://10.50.195.212:5000";
   >>>>>>> main (Mã trên nhánh main vừa kéo về)
   ```
3. **Cách giải quyết:**
   - Trao đổi ngay với thành viên phụ trách phần đó để thống nhất giữ lại đoạn mã nào.
   - Xóa bỏ các dòng ký hiệu `<<<<<<<`, `=======`, `>>>>>>>` và chỉ giữ lại mã nguồn chính xác.
   - Lưu file lại.
4. **Xác nhận hoàn thành conflict:**
   ```powershell
   # Kiểm tra lại các file đã resolve xong
   git status

   # Đánh dấu đã giải quyết
   git add <tên-file-vừa-sửa>

   # Tạo commit kết thúc merge
   git commit -m "chore: resolve merge conflicts with main"

   # Đẩy lên nhánh remote
   git push origin feature/mobile-qr-scanner
   ```

---

## 6. Quy Tắc Bảo Mật & Danh Sách Tệp Cấm Commit (DO NOT COMMIT)

> [!CAUTION]
> **TUYỆT ĐỐI KHÔNG BAO GIỜ COMMIT CÁC TỆP SAU:**
> 1. File môi trường chứa thông tin bảo mật: `.env`, `.env.local`, `.env.production` (Chỉ được commit file mẫu `.env.example`).
> 2. Mật khẩu, token cá nhân, private key, JWT secret, Database connection string thật.
> 3. Thư mục mã nguồn phụ thuộc: `node_modules/`.
> 4. Thư mục build sinh tự động: `.next/`, `build/`, `out/`, `.dart_tool/`, `android/.gradle/`.
> 5. File hệ điều hành hoặc cấu hình cá nhân: `.DS_Store`, `Thumbs.db`.

Nếu bạn lỡ commit nhầm file chứa thông tin bảo mật, hãy báo ngay cho Team Lead để tiến hành gỡ bỏ và xoay vòng (rotate) credentials!

---

## 7. Quy Tắc Phạm Vi Trách Nhiệm (Scope Discipline)

- **Backend Developer:** Tập trung làm việc trong `backend/` và cập nhật `docs/API_DOCUMENTATION.md` khi có thay đổi API.
- **Frontend Developer:** Tập trung làm việc trong `frontend/`.
- **Mobile Developer:** Tập trung làm việc trong `mobile/`.
- **Docs chung:** `docs/`.

Không tự ý thay đổi format hay refactor code của các thư mục khác ngoài phạm vi được phân công trong cùng một PR.

---

## 8. Sau Khi Pull Request Được Merge Vào `main`

Khi PR của bạn đã được Review, phê duyệt và Merge vào `main` trên GitHub:

```powershell
# 1. Chuyển về nhánh main trên máy cục bộ
git switch main

# 2. Kéo mã nguồn mới nhất về
git pull origin main

# 3. (Tùy chọn) Xóa nhánh tính năng cũ trên máy để giữ máy gọn gàng
git branch -d feature/mobile-qr-scanner

# 4. Sẵn sàng tạo nhánh mới cho task tiếp theo!
git switch -c feature/ten-task-moi
```
