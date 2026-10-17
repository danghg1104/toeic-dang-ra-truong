// Expert TOEIC AI Reasoning Engine
function generateExpertTOEICAnswer(question, context = {}) {
    const q = (question || '').toLowerCase();
    const ctx = (context.q || '') + ' ' + (context.explain || '') + ' ' + (context.ans || '');
    const fullText = (q + ' ' + ctx).toLowerCase();

    // 1. Bẫy Being vs Been trong Part 1
    if (fullText.includes('being') || fullText.includes('been') || fullText.includes('part 1') || fullText.includes('tranh tĩnh')) {
        return `### 🤖 Gia Sư AI Phân Tích: Bẫy "Being vs Been" (Part 1 TOEIC)
📌 **Phân tích bản chất:**
- **"is/are BEING + PII"**: Diễn tả một hành động **đang được người tác động trực tiếp lên vật**. Nếu trong tranh **không có người**, đáp án có "being" là **SAI 99%** (ví dụ: *Chairs are being moved* ➔ phải có người đang bưng ghế).
- **"has/have BEEN + PII"**: Diễn tả một trạng thái tĩnh **đã hoàn tất từ trước** (ví dụ: *Documents have been left on the desk* ➔ tài liệu đã được để sẵn trên bàn). Tranh không người rất thích dùng dạng này!

⚠️ **Bẫy đề thi ETS 2023 - 2026:**
Loa phát âm /ˈbiː.ɪŋ/ và /biːn/ rất lướt khiến thí sinh nghe nhầm.
*Ngoại lệ hiếm hoi:* "is being displayed" (đang trưng bày) hoặc "a shadow is being cast" (bóng đổ) vẫn đúng trong tranh tĩnh.

⚡ **Mẹo 3 giây trong phòng thi:**
Tranh không có người ➔ Nghe thấy chữ **"BEING"** là **GẠCH NGAY** không cần suy nghĩ!`;
    }

    // 2. Bẫy Câu trả lời Gián tiếp / Né tránh trong Part 2
    if (fullText.includes('gián tiếp') || fullText.includes('né tránh') || fullText.includes('part 2') || fullText.includes('where') || fullText.includes('when') || fullText.includes('who')) {
        return `### 🤖 Gia Sư AI Phân Tích: Bẫy Trả Lời Gián Tiếp (Part 2 ETS 2024 - 2027)
📌 **Phân tích bản chất:**
Đề thi TOEIC hiện đại cắt giảm tối đa các câu hỏi dễ trả lời thẳng (ví dụ: *Where -> At room 101*). Thay vào đó, 45% câu hỏi dùng câu trả lời **gián tiếp, đá trách nhiệm hoặc hỏi ngược lại**.

⚠️ **Các dạng bẫy kinh điển:**
1. **Đá trách nhiệm cho người khác:** *"Ask Ms. Maria"*, *"Mr. David is in charge of that"*.
2. **Kiểm tra văn bản / nguồn tin:** *"It's posted on the bulletin board"*, *"Check your email"*.
3. **Từ chối khéo léo / nêu lý do bận:** *"I have a doctor's appointment"*, *"The flight was delayed"*.
4. **Hỏi ngược lại:** *"Didn't they inform you yesterday?"*.

⚡ **Mẹo 3 giây trong phòng thi:**
Loại các câu lặp âm giống hệt câu hỏi hoặc câu trả lời Yes/No cho câu hỏi Wh- (Who, When, Where, Why). Chọn câu trả lời thể hiện việc kiểm tra nguồn tin hoặc phân công người khác!`;
    }

    // 3. Bẫy Đuôi tính từ -ive, -al nhưng là Danh từ (Part 5)
    if (fullText.includes('-ive') || fullText.includes('-al') || fullText.includes('representative') || fullText.includes('initiative') || fullText.includes('alternative') || fullText.includes('proposal') || fullText.includes('approval')) {
        return `### 🤖 Gia Sư AI Phân Tích: Danh Từ Đặc Biệt Đuôi -ive & -al (Part 5)
📌 **Phân tích bản chất:**
Thí sinh thường học máy móc rằng đuôi *-ive* (như expensive) và *-al* (như national) là Tính từ. ETS cố tình đặt chỗ trống cần điền **Danh từ** nhưng 4 đáp án lại có các từ này để gài bẫy.

⚠️ **10 Danh từ cốt lõi bắt buộc phải thuộc:**
- **representative**: người đại diện (Danh từ chỉ người)
- **initiative**: sáng kiến, kế hoạch mới
- **alternative**: giải pháp thay thế
- **objective**: mục tiêu dự án
- **executive**: cán bộ điều hành cấp cao
- **proposal**: bản đề xuất dự án
- **approval**: sự phê duyệt
- **renewal**: sự gia hạn hợp đồng
- **arrival**: sự đến nơi / hàng về
- **disposal**: việc thanh lý / xử lý rác

⚡ **Mẹo 3 giây trong phòng thi:**
Nếu trước chỗ trống có tính từ (VD: *sales _________*) và câu thiếu chủ ngữ chỉ người đi với hành động phản hồi/liên hệ ➔ Chọn ngay **representative**!`;
    }

    // 4. Bẫy Rút gọn Mệnh đề quan hệ (V-ing vs V-ed)
    if (fullText.includes('rút gọn') || fullText.includes('mệnh đề quan hệ') || fullText.includes('v-ing') || fullText.includes('v-ed')) {
        return `### 🤖 Gia Sư AI Phân Tích: Rút Gọn Mệnh Đề Quan Hệ (Part 5)
📌 **Phân tích bản chất:**
Câu đã có **động từ chính chia thì** (ví dụ: *must register, was delivered, will attend*). Chỗ trống nằm ngay sau một danh từ để bổ nghĩa.

⚠️ **Quy tắc 2 bước bất bại:**
1. **Sau chỗ trống CÓ TÂN NGỮ (Cụm danh từ):** ➔ Rút gọn dạng CHỦ ĐỘNG: **Chọn V-ing**.
   *VD: Anyone **having** questions should ask the manager. ('questions' là tân ngữ).*
2. **Sau chỗ trống KHÔNG CÓ TÂN NGỮ (Đi với giới từ by / in / at hoặc dấu phẩy):** ➔ Rút gọn BỊ ĐỘNG: **Chọn V-ed / PII**.
   *VD: Goods **purchased** during the sale cannot be returned. (Sau là giới từ 'during').*

⚡ **Mẹo 3 giây trong phòng thi:**
Tìm động từ chính trước! Nếu câu đã có động từ chia thì, tuyệt đối không chọn thêm động từ chia thì nữa mà chỉ chọn V-ing (chủ động) hoặc V-ed (bị động)!`;
    }

    // 5. Bẫy Thể giả định (Subjunctive) & Đảo ngữ câu điều kiện (Xu hướng 2026 - 2027)
    if (fullText.includes('giả định') || fullText.includes('subjunctive') || fullText.includes('đảo ngữ') || fullText.includes('should') || fullText.includes('recommended that') || fullText.includes('insist')) {
        return `### 🤖 Gia Sư AI Phân Tích: Thể Giả Định & Đảo Ngữ Câu Điều Kiện (Xu Hướng 2026 - 2027)
📌 **Phân tích bản chất:**
Đây là dạng câu hỏi phân loại điểm 800 - 990 trong các kỳ thi ETS gần đây:
1. **Thể giả định (Subjunctive Mood):**
   Cấu trúc: *S + (demand/require/request/recommend/insist/suggest) + that + S + **(should) V-nguyên thể**.*
   *Đặc biệt chú ý:* Động từ to be bắt buộc là **"be"**, không chia is/are/was/were dù chủ ngữ là số ít!
   *VD: The manager requested that Mr. Davis **be** present on time.*
2. **Đảo ngữ câu điều kiện (Bỏ chữ IF):**
   - Loại 1: **Should you + V-bare** (= If you + V)
   - Loại 3: **Had we + PII** (= If we had + PII)

⚡ **Mẹo 3 giây trong phòng thi:**
Thấy đầu câu có chỗ trống đứng trước chủ ngữ và động từ nguyên mẫu (VD: *______ you experience any issue...*) ➔ Điền **Should**, không điền If!`;
    }

    // 6. Bẫy Liên từ vs Giới từ
    if (fullText.includes('liên từ') || fullText.includes('giới từ') || fullText.includes('although') || fullText.includes('despite') || fullText.includes('because') || fullText.includes('due to') || fullText.includes('during') || fullText.includes('while')) {
        return `### 🤖 Gia Sư AI Phân Tích: Liên Từ vs Giới Từ (Part 5)
📌 **Phân tích bản chất:**
Các cặp từ mang **nghĩa giống hệt nhau** nhưng ngữ pháp khác nhau hoàn toàn:
- **LIÊN TỪ (Theo sau là Mệnh đề S + V):**
  * *Because / Since / As* (Bởi vì)
  * *Although / Even though / Though* (Mặc dù)
  * *While* (Trong khi)
- **GIỚI TỪ (Theo sau là Cụm danh từ / V-ing):**
  * *Because of / Due to / Owing to* (Bởi vì)
  * *Despite / In spite of* (Mặc dù)
  * *During* (Trong suốt)

⚡ **Mẹo 3 giây trong phòng thi:**
Nhìn ngay từ thứ 1 đến thứ 3 sau chỗ trống: Có động từ chia thì không? Nếu có động từ chia thì ➔ Chọn Liên từ. Nếu chỉ toàn Danh từ ➔ Chọn Giới từ!`;
    }

    // Default Smart Comprehensive Tutor Answer
    return `### 🤖 Gia Sư AI Luyện Thi TOEIC Giải Đáp
📌 **Nội dung bạn hỏi:** "${question}"

💡 **Phân tích giải thích chi tiết:**
- Để xử lý câu hỏi này trong đề thi TOEIC, bạn cần xác định rõ **vị trí từ loại** và **ngữ cảnh ngữ pháp doanh nghiệp** (Part 5, 6 hoặc 7).
- Hãy luôn đọc lướt trước và sau chỗ trống:
  1. Xác định Động từ chính (Main Verb) của câu đã có chưa.
  2. Xác định các dấu hiệu thời gian (thì động từ) hoặc giới từ đi kèm.
  3. Áp dụng phương pháp loại trừ 2 đáp án vô lý trước để tăng xác suất chọn đúng lên 50%.

⚡ **Lời khuyên từ Đăng & Gia sư AI:**
Nếu bạn sắp đến ngày thi TOEIC, hãy tập trung vào 3 bẫy hay gặp nhất: Bẫy câu trả lời gián tiếp Part 2, Bẫy danh từ đuôi -ive/-al Part 5, và Bẫy liên từ vs giới từ. Luyện tập đều 20 câu mỗi ngày sẽ giúp bạn tăng từ 100 - 150 điểm chỉ trong 2 tuần!`;
}

console.log('Testing TOEIC AI Engine:');
console.log(generateExpertTOEICAnswer('Tại sao câu này lại dùng be thay vì is khi có recommended that?'));
console.log('------------------------');
console.log(generateExpertTOEICAnswer('Bẫy Being vs Been trong tranh không người là sao?'));
