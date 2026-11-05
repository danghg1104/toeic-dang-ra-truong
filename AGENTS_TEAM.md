# 🌟 ĐỘI NGŨ 3 AGENT CHUYÊN TRÁCH — "TÔI ĐI ĐÂU ĐÓ" (TOEIC MASTER)

Hệ thống đã khởi tạo và cấu hình thành công **3 Subagent chuyên biệt**, sẵn sàng được kích hoạt bất cứ lúc nào trong các tác vụ phát triển, tối ưu và thẩm định ứng dụng.

---

## 📱 1. Mobile Web Doctor (`mobile-web-doctor`)
> **Vai trò:** Kỹ sư chuyên sâu về Frontend Responsive & Trải nghiệm Di động.

### 🎯 Trọng tâm chuyên trách:
- **Kiểm soát Viewport hẹp:** Tối ưu mượt mà từ 320px (iPhone SE), 360px–390px (iPhone 12/13/14/15/16, Galaxy S21/S24) đến 428px (Pro Max/Plus).
- **Diệt trừ triệt để lỗi hiển thị:**
  - Chống tràn ngang tuyệt đối (Zero horizontal scroll/overflow).
  - Không để nút bấm, icon bị ép mép, cắt góc hay che khuất.
  - Tự động chuyển đổi các thanh công cụ dài thành lưới thông minh (Responsive Grid 2x3, 3x2).
- **Tối ưu thao tác cảm ứng (Touch Ergonomics):**
  - Đảm bảo Touch Target tối thiểu 40x40px – 44x44px.
  - Tối ưu Bottom Sheet, modal toàn màn hình và cử chỉ vuốt thẻ Flashcard 3D mượt mà một tay.
  - Tự động xử lý vùng đệm an toàn Safe Area Insets (tai thỏ, Dynamic Island).
- **Quy trình:** Luôn đồng bộ `npm run copy-assets` sang thư mục `www/` và chạy test kiểm thử responsive.

---

## 💻 2. Desktop Web Engineer (`desktop-web-engineer`)
> **Vai trò:** Kỹ sư chuyên sâu về Giao diện & Hiệu năng Màn hình Lớn (Laptop & Desktop).

### 🎯 Trọng tâm chuyên trách:
- **Làm chủ không gian màn hình lớn:** Tối ưu hóa hoàn hảo cho các độ phân giải 1024px, 1280px, 1366px, 1440px, 1536px, 1920px (HD, Full HD, 2K, Retina).
- **Bố cục đa nhiệm chuyên nghiệp:**
  - Sidebar Drawer cố định hoặc thu gọn mượt mà.
  - Header bar trải dài 1 hàng ngang với vạch phân cách Divider tinh tế.
  - Tránh tình trạng kéo giãn phần tử quá mức trên màn hình Ultra-wide.
- **Tương tác Chuột & Bàn phím (Mouse & Keyboard):**
  - Trạng thái hover, tooltip giải thích chỉ số rõ nét.
  - Phím tắt thông minh: `Space` lật flashcard / phát âm, `Mũi tên ← / →` chuyển thẻ, `1-4` chọn đáp án trắc nghiệm, `Esc` đóng popup.
- **Hiệu năng & Tiết kiệm pin:**
  - Không chạy loop vô hạn gây tốn CPU/quạt laptop kêu to.
  - Tối ưu bảng in ấn & xuất PDF (`@media print`) cho Cheat Sheet khổ giấy A4.

---

## 🎓 3. Authentic App UX Evaluator (`app-ux-evaluator`)
> **Vai trò:** Chuyên gia Đánh giá Độc lập & Thẩm định Trải nghiệm Người học Thực tế.

### 🎯 Trọng tâm chuyên trách:
- **Tôn chỉ:** Đánh giá công tâm, thẳng thắn, không khen đãi bôi. Trực tiếp đóng vai người học TOEIC thật (Mất gốc Target 450, Ôn cấp tốc Target 600–750, Người dùng kỹ tính).
- **Thẩm định 5 trụ cột trải nghiệm cốt lõi:**
  1. **Ấn tượng 5 giây đầu (First Impression):** Vào app có hiểu ngay bài cần học? Sói Mây truyền cảm hứng thế nào?
  2. **Độ trơn tru & Loại bỏ ức chế (Smoothness & Flow):** Flashcard 3D vuốt có đã tay? Âm thanh Web Audio (Ding/Pop/Thud) có kích thích não bộ? Dropdown, nút bấm có nhạy không?
  3. **Tính sư phạm & Luyện thi ETS (Pedagogy):** Các bẫy Part 5, Part 7, Cheat Sheet 1 trang có thực sự bám sát đề thi ETS 2026? Thuật toán lặp lại ngắt quãng FSRS v5 có hiệu quả?
  4. **Thẩm mỹ & Cảm xúc (Aesthetics & Emotion):** Chế độ Warm Sand, Phông ETS Serif, Dark mode có êm dịu mắt khi học đêm?
  5. **Tính liên tục đa thiết bị (Cross-Device Parity):** Học trên laptop rồi đổi sang điện thoại có liền mạch không?
- **Đầu ra:** Bảng chấm điểm thang 10, TOP điểm sáng "ăn tiền" và TOP điểm gây cấn (Pain points) cần cải thiện ngay.

---

## 🚀 CÁCH SỬ DỤNG
Bạn chỉ cần yêu cầu trong đoạn chat:
- *"Cho con chuyên sửa lỗi mobile kiểm tra lại thanh header trên iPhone"* -> Agent **`mobile-web-doctor`** sẽ được gọi.
- *"Cho con laptop tối ưu lại phím tắt và chế độ full màn hình"* -> Agent **`desktop-web-engineer`** sẽ được gọi.
- *"Nhờ chuyên gia UX đánh giá trải nghiệm thực tế của app hiện tại"* -> Agent **`app-ux-evaluator`** sẽ được gọi và xuất báo cáo toàn diện.
