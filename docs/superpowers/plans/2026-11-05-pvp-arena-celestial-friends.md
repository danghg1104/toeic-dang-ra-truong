# Kế Hoạch Triển Khai: Nâng Cấp Đấu Trường Từ Vựng 1v1, UI Thanh Tuấn & Hệ Thống Bạn Bè

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Khắc phục triệt để lỗi chờ 34s khi đấu xong, thiết kế lại toàn bộ giao diện Đấu trường theo phong cách "Nhẹ Nhàng Thanh Tuấn" (ảnh 2-5) tối ưu Mobile & Laptop, và tích hợp hệ thống Kết Bạn / Mời Đấu 1v1 trực tiếp bằng Mã Friend ID thời gian thực.

**Architecture:** Mở rộng WebSocket Server (`lib/pvp-arena-server.js`) với cơ chế rút ngắn thời gian Bot AI khi người chơi về đích, thêm giao thức kết bạn / mời đấu tức thì; tích hợp mã Friend ID vào hệ thống User Profile (`server.js`); tái thiết kế UI client (`js/pvp-arena-client.js` & `index.html`) bằng phong cách Học Viện Tinh Vân (Celestial Study Academy) thanh nhã, hài hòa với nền giấy Warm Sand.

**Tech Stack:** Node.js, WebSocket (ws), Vanilla JavaScript, Tailwind CSS, Canvas-Confetti, Puppeteer-Core.

**Spec:** `C:\Users\Admin\.gemini\antigravity\brain\ed360126-cbd6-4e9c-92fb-38b43251e283\pvp_arena_and_friends_design.md`

## Global Constraints

- Không làm gián đoạn cấu trúc cơ sở dữ liệu người dùng hiện tại (`data/users_database.json`, `data/profiles/`).
- Đảm bảo 100% 288 bài kiểm thử E2E hiện có tiếp tục vượt qua (`run_all_e2e.js`).
- Luôn đồng bộ tài nguyên sang thư mục `www/` thông qua lệnh `npm run copy-assets`.
- Thiết kế responsive chuẩn mực trên màn hình di động (375px - 430px) và laptop (1280px - 1440px).

## Review Focus

- Trường hợp người chơi trả lời xong 10 câu cực nhanh trong 15s-25s: Trận đấu Bot phải kết thúc ngay trong <= 1 giây, không được để người chơi chờ đơ.
- Trường hợp gửi lời mời thách đấu bạn bè đang offline hoặc đang trong trận: Báo lỗi thân thiện không gây crash.
- Trường hợp hai người cùng nhập mã kết bạn của nhau: Không bị trùng lặp trong danh bạ bạn bè.
- Hiển thị đầy đủ không bị tràn viền hoặc che khuất trên màn hình laptop (1280px) và điện thoại di động (375px).

---

### Task 1: Tối Ưu Kết Thúc Trận Đấu Sớm & Chấm Dứt Hiện Tượng Chờ 34s

**Files:**
- Modify: `lib/pvp-arena-server.js:530-580` & `640-660`
- Modify: `js/pvp-arena-client.js:1180-1215`
- Test: `tests/test_pvp_instant_finish.js`

- [ ] **Step 1:** Viết bài test `tests/test_pvp_instant_finish.js` kiểm tra khi người chơi trả lời câu 10, trận đấu kết thúc trong <= 1.2s thay vì chờ hết 60s.
- [ ] **Step 2:** Trong `lib/pvp-arena-server.js`, cập nhật `processAnswer`: Khi `player1.finished = true` trong một trận Bot Match, hủy ngay bộ đếm trễ của bot (`clearTimeout(match.botTimeout)`), tính điểm nhanh cho bot và gọi `this.endMatch(matchId, 'ALL_ANSWERED')` trong 600ms.
- [ ] **Step 3:** Trong `js/pvp-arena-client.js`, cập nhật `renderWaitingOpponent`: Thay vì thay thế toàn bộ giao diện bằng đồng hồ cát cô lập, giữ nguyên sàn đấu Versus sống động, hiển thị bảng điểm 10/10 đã hoàn tất và thanh tiến trình chờ kết quả tinh tế.
- [ ] **Step 4:** Chạy `node tests/test_pvp_instant_finish.js` để xác nhận trận đấu kết thúc mượt mà ngay lập tức.
- [ ] **Step 5:** Commit thay đổi: `git commit -m "fix(pvp): eliminate 34s waiting stall on bot match completion"`.

---

### Task 2: Hệ Thống Mã Bạn Bè (Friend ID) & Mời Đấu 1v1 Thời Gian Thực

**Files:**
- Modify: `server.js` (Thêm Friend Code và API quản lý bạn bè)
- Modify: `lib/pvp-arena-server.js` (Xử lý `ADD_FRIEND`, `GET_FRIENDS_LIST`, `INVITE_FRIEND`, `RESPOND_INVITE`)
- Test: `tests/test_pvp_friends_system.js`

- [ ] **Step 1:** Viết bài test `tests/test_pvp_friends_system.js` mô phỏng 2 client: kết bạn qua mã, phát hiện bạn bè online, gửi lời mời đấu và nhận phòng đấu tự động.
- [ ] **Step 2:** Trong `server.js`, viết hàm sinh mã bạn bè ngắn gọn duy nhất (ví dụ: `HD-7133` cho Huynh Dang, các tài khoản khác theo tiền tố tên/số). Lưu trữ danh bạ bạn bè trong profile người dùng.
- [ ] **Step 3:** Trong `lib/pvp-arena-server.js`, triển khai cơ chế theo dõi Client kết nối trực tuyến qua `userId`. Xử lý sự kiện mời đấu: gửi pop-up `BATTLE_INVITATION` đến đúng socket của bạn bè; khi bạn bè chấp nhận, tự động khởi tạo trận đấu 1v1 giữa 2 người.
- [ ] **Step 4:** Chạy `node tests/test_pvp_friends_system.js` xác nhận 100% kịch bản kết bạn & mời đấu thành công.
- [ ] **Step 5:** Commit thay đổi: `git commit -m "feat(pvp): implement friend code system and real-time 1v1 battle invites"`.

---

### Task 3: Tái Tạo Giao Diện Đấu Trường "Nhẹ Nhàng Thanh Tuấn" & Tối Ưu Đa Nền Tảng

**Files:**
- Modify: `index.html` (Thêm background họa tiết bầu trời đêm đầy sao và giấy vẽ tinh tế)
- Modify: `js/pvp-arena-client.js` (Thiết kế lại toàn bộ giao diện sàn đấu, thẻ câu hỏi, tab Bạn bè, Pop-up thách đấu)
- Test: `tests/test_pvp_ui_responsive.js`

- [ ] **Step 1:** Thiết kế tab `"Bạn Bè & Thách Đấu"` trong `js/pvp-arena-client.js`:
  - Hiển thị Mã Bạn Bè của tôi kèm nút `[Sao chép mã 1 chạm]`.
  - Ô tìm kiếm / kết bạn: *"Nhập mã bạn bè (VD: HD-7133)..."* kèm nút `[+ Thêm bạn]`.
  - Danh sách bạn bè kèm chấm xanh `🟢 Online` và nút `[⚔️ Mời Đấu 1v1]`.
- [ ] **Step 2:** Xây dựng Modal / Pop-up Thách Đấu Real-time thời thượng:
  - Khi có bạn bè mời đấu, pop-up trượt vào nhẹ nhàng kèm âm thanh chuông báo tinh tế: *"Huynh Dang vừa mời bạn vào Đấu Trường 1v1!"* kèm nút `[Chấp nhận]` và `[Từ chối]`.
- [ ] **Step 3:** Áp dụng phong cách UI **"Học Viện Tinh Vân"** nhẹ nhàng thanh tuấn (lấy cảm hứng từ ảnh 2-5):
  - Kính mờ Indigo sâu thẳm điểm xuyết ánh sao vàng nhạt và viền đồng mềm mại.
  - Thẻ câu hỏi và các nút lựa chọn to rõ, bóng đổ êm dịu, phản hồi xúc giác nhanh.
  - Tối ưu 100% trên **Laptop** (bố cục ngang cân xứng) và **Điện thoại** (thao tác 1 tay thuận tiện).
- [ ] **Step 4:** Viết `tests/test_pvp_ui_responsive.js` chạy Puppeteer kiểm tra chụp ảnh giao diện tại 375px (Mobile) và 1280px (Laptop).
- [ ] **Step 5:** Commit thay đổi: `git commit -m "feat(ui): redesign pvp arena with serene celestial study aesthetic and responsive layout"`.

---

### Task 4: Kiểm Thử Toàn Diện, Đồng Bộ Tài Nguyên & Triển Khai GitHub

**Files:**
- Run test suites: `test_new_user_requests.js`, `run_all_e2e.js`, `test_header_auth.js`
- Copy assets to `www/`
- Push to GitHub `origin/main`

- [ ] **Step 1:** Chạy toàn bộ test suite và đảm bảo 288/288 bài test E2E đạt 100% PASS.
- [ ] **Step 2:** Chạy `npm run copy-assets` đồng bộ `www/`.
- [ ] **Step 3:** Commit và đẩy lên GitHub `origin/main`.
- [ ] **Step 4:** Kiểm tra trạng thái hoạt động trên Render.
