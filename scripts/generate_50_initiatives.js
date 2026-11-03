const fs = require('fs');

const initiatives = [
    // CLUSTER 1: PEDAGOGY & LEARNING SCIENCE (10)
    {
        id: "INIT_01",
        cluster: "Sư Phạm & Khoa Học Học Tập",
        role: "Chuyên Gia Khoa Học Trí Nhớ & Đường Cong Quên (Cognitive Scientist)",
        title: "Thuật toán Lặp lại Ngắt quãng FSRS v5 (Free Spaced Repetition Scheduler)",
        description: "Nâng cấp thuật toán SRS hiện tại lên FSRS v5 (hiện đại hơn Anki SM-2), tính toán chính xác độ khó từ vựng và thời điểm học viên sắp quên để nhắc ôn tập đúng thời điểm vàng.",
        impact: "Tăng 40% hiệu suất ghi nhớ dài hạn, giảm 30% thời gian ôn tập lặp lại vô ích.",
        feasibility: "Cao (chỉ cần logic toán học JavaScript cục bộ, không tốn tài nguyên)."
    },
    {
        id: "INIT_02",
        cluster: "Sư Phạm & Khoa Học Học Tập",
        role: "Giảng Viên Trưởng Luyện Thi TOEIC 990 (Master TOEIC Instructor)",
        title: "Hệ thống Bản Đồ Điểm Mù & Phân Tích Bẫy Chuyên Biệt (Blindspot Heatmap)",
        description: "Tự động phân loại sai sót của học viên theo 12 dạng bẫy (bẫy trạng thái tiếp diễn, bẫy từ đồng âm, bẫy câu hỏi suy luận Part 3/4) và vẽ Heatmap trực quan các điểm yếu.",
        impact: "Giúp học viên nhận ra ngay 'lỗ hổng tử huyệt' của mình thay vì làm đề lan man.",
        feasibility: "Cao (đã có sẵn khung TOEIC Traps Engine, chỉ cần tổng hợp thống kê trực quan)."
    },
    {
        id: "INIT_03",
        cluster: "Sư Phạm & Khoa Học Học Tập",
        role: "Chuyên Gia Luyện Nghe Phản Xạ (Auditory Reflex Coach)",
        title: "Phòng Thu Luyện Nghe Shadowing & Kỹ Thuật Đọc Nhại 3 Bước",
        description: "Quy trình luyện nghe 3 bước chuẩn quốc tế: Bước 1: Nghe bắt âm (Blinded) -> Bước 2: Nhại theo phụ đề (Shadowing) -> Bước 3: Ghi âm giọng đối chiếu với file gốc.",
        impact: "Xóa bỏ rào cản 'nghe kịp nhưng không hiểu', cải thiện phát âm và phản xạ bắt từ.",
        feasibility: "Trung bình (cần tích hợp MediaRecorder API trên trình duyệt để ghi âm)."
    },
    {
        id: "INIT_04",
        cluster: "Sư Phạm & Khoa Học Học Tập",
        role: "Chuyên Gia Thiết Kế Bài Học Vi Mô (Micro-learning Architect)",
        title: "Chế Độ '3 Phút Trên Xe Buýt' (3-Minute Commute Learning Bites)",
        description: "Đóng gói các viên nang bài học siêu ngắn: đúng 3 câu bẫy hoặc 5 từ vựng then chốt kèm audio giải thích ngắn gọn, tối ưu hoàn toàn cho các khoảng thời gian trống của sinh viên.",
        impact: "Tăng tần suất truy cập hàng ngày từ 1 lần lên 3-4 lần, tận dụng thời gian chết.",
        feasibility: "Rất cao (chỉ cần lọc dữ liệu hiện có thành các mini-session)."
    },
    {
        id: "INIT_05",
        cluster: "Sư Phạm & Khoa Học Học Tập",
        role: "Chuyên Gia Ngữ Âm Học Đối Chiếu (Phonetics & Minimal Pairs Expert)",
        title: "Phòng Tập Thể Dục Thính Giác (Ear Gym: Cặp Âm Dễ Nhầm Lẫn)",
        description: "Bộ luyện nghe phân biệt các cặp âm tối thiểu mà người Việt hay nghe nhầm trong đề TOEIC (e.g., ship vs sheep, walk vs work, copy vs coffee, file vs fly).",
        impact: "Triệt tiêu các bẫy phát âm gây mất điểm oan ức nhất trong Part 1 và Part 2.",
        feasibility: "Cao (tạo bộ câu hỏi phân biệt A/B nhắm thẳng vào cặp âm)."
    },
    {
        id: "INIT_06",
        cluster: "Sư Phạm & Khoa Học Học Tập",
        role: "Chuyên Gia Tiếng Anh Thương Mại (Business English Specialist)",
        title: "Mô Phỏng Tài Liệu Doanh Nghiệp Thực Tế (Real-World Office Artifacts)",
        description: "Chuyển các bài đọc Part 6 & Part 7 thành giao diện thực tế: Hộp thư Gmail công ty, Hóa đơn VAT điện tử, Vé máy bay boarding pass, Thông báo nội bộ Slack.",
        impact: "Giảm cảm giác nhàm chán khi đọc văn bản chữ đen trên nền trắng, tăng tính thực chiến.",
        feasibility: "Trung bình (cần thiết kế component giả lập UI email/invoice)."
    },
    {
        id: "INIT_07",
        cluster: "Sư Phạm & Khoa Học Học Tập",
        role: "Chuyên Gia Phân Tích Đề Thi ETS (ETS Test Deconstruction Analyst)",
        title: "Bộ Giải Mã Tần Suất Ra Đề 2026 (ETS High-Yield Frequency Radar)",
        description: "Gắn thẻ tần suất xuất hiện thực tế (Very High, High, Medium) cho từng từ vựng và chủ điểm ngữ pháp dựa trên phân tích đề thi giai đoạn 2024-2026.",
        impact: "Học viên cần gấp chứng chỉ chỉ cần ôn tập 20% lượng từ nhưng trúng 80% đề thi.",
        feasibility: "Cao (bổ sung metadata nhãn tần suất vào ngân hàng dữ liệu)."
    },
    {
        id: "INIT_08",
        cluster: "Sư Phạm & Khoa Học Học Tập",
        role: "Chuyên Gia Bản Đồ Tư Duy (Mindmap & Semantic Association Specialist)",
        title: "Mạng Lưới Ngữ Nghĩa Từ Vựng Liên Tưởng (Synonym & Antonym Clusters)",
        description: "Thay vì học từng từ riêng lẻ, nhóm từ vựng theo cụm hành vi văn phòng (e.g., 'delay' đi cùng 'postpone, put off, push back, defer, reschedule').",
        impact: "Giúp giải quyết triệt để bẫy Paraphrasing trong Part 3, Part 4 và Part 7.",
        feasibility: "Cao (liên kết các từ đã có trong từ điển thành cụm gia đình từ)."
    },
    {
        id: "INIT_09",
        cluster: "Sư Phạm & Khoa Học Học Tập",
        role: "Bác Sĩ Tâm Lý Học Đường & Quản Trị Căng Thẳng (Exam Anxiety Counselor)",
        title: "Bộ Huấn Luyện Quản Lý Thời Gian & Áp Lực Phòng Thi (Pressure Simulator)",
        description: "Chế độ thi thử với tiếng ồn môi trường nhẹ (tiếng bút chì tô đáp án, tiếng ho nhẹ, tiếng quạt gió) và đồng hồ đếm ngược đập nhịp tim khi còn 5 phút cuối.",
        impact: "Rèn luyện tâm lý vững vàng, tránh tình trạng 'ở nhà làm được 800 mà vào phòng thi run chỉ được 600'.",
        feasibility: "Cao (thêm tùy chọn phát âm thanh nền tiếng ồn phòng thi)."
    },
    {
        id: "INIT_10",
        cluster: "Sư Phạm & Khoa Học Học Tập",
        role: "Chuyên Gia Kiểm Định Thích Ứng (Computerized Adaptive Testing Specialist)",
        title: "Hệ Thống Đánh Giá Thích Ứng Năng Lực 15 Câu (Mini Adaptive Diagnostic)",
        description: "Bài test chẩn đoán 15 phút: nếu trả lời đúng, câu sau tăng độ khó; nếu sai, hạ độ khó. Xác định dải điểm hiện tại (ví dụ: 450-550 hay 750-850) chỉ sau 15 câu.",
        impact: "Sinh viên mới vào web biết ngay trình độ của mình mà không cần cày full 200 câu trong 2 tiếng.",
        feasibility: "Trung bình (cần viết thuật toán phân nhánh câu hỏi theo độ khó A2 -> C1)."
    },

    // CLUSTER 2: GAMIFICATION & MOTIVATION (10)
    {
        id: "INIT_11",
        cluster: "Gamification & Động Lực",
        role: "Trưởng Nhóm Thiết Kế Game RPG (Game Designer)",
        title: "Đấu Trường Từ Vựng PvP Thời Gian Thực (1v1 Live Vocab Arena)",
        description: "Cho phép 2 sinh viên trong cùng ký túc xá hoặc bạn bè thách đấu trực tiếp: 10 từ vựng nhanh trong 60 giây, ai phản xạ nhanh và đúng hơn sẽ giành chiến thắng.",
        impact: "Kích hoạt cảm giác ganh đua lành mạnh, biến việc học từ vựng thành trò chơi eSports học đường.",
        feasibility: "Trung bình - Cao (dùng WebRTC hoặc WebSocket sẵn có trên server).",
    },
    {
        id: "INIT_12",
        cluster: "Gamification & Động Lực",
        role: "Chuyên Gia Giữ Chân Người Dùng (User Retention Specialist)",
        title: "Cơ Chế 'Khiên Bảo Vệ Chuỗi' Linh Hoạt (Streak Freeze & Grace Period)",
        description: "Cho phép sinh viên dùng XP kiếm được để mua 'Bảo hiểm Chuỗi' (Streak Shield) khi bận thi cử trên trường hoặc ốm đột xuất, không bị mất chuỗi ngày chăm chỉ.",
        impact: "Loại bỏ tâm lý chán nản muốn từ bỏ khi lỡ đứt chuỗi học tập (Streak Loss Depression).",
        feasibility: "Rất cao (chỉ cần lưu biến ngày và số lượng khiên vào localStorage)."
    },
    {
        id: "INIT_13",
        cluster: "Gamification & Động Lực",
        role: "Họa Sĩ Hoạt Họa Linh Vật (Mascot & Character Designer)",
        title: "Hệ Thống Tiến Hóa Linh Vật 'Đăng Totoro' (Mascot Evolution RPG)",
        description: "Linh vật khởi đầu là 'Mầm Non TOEIC', khi người học đạt các mốc (350 -> 500 -> 650 -> 800+), linh vật sẽ biến hình mang Balo Sách, Đeo Kính Trí Thức, Khoác Áo Cử Nhân.",
        impact: "Tạo cảm xúc gắn bó thân thuộc, sinh viên cảm thấy mình đang đồng hành cùng linh vật lớn lên mỗi ngày.",
        feasibility: "Cao (dùng các asset SVG/PNG có sẵn kết hợp huy hiệu)."
    },
    {
        id: "INIT_14",
        cluster: "Gamification & Động Lực",
        role: "Chuyên Gia Hệ Thống Thành Tựu (Achievement Architect)",
        title: "Bộ Huy Hiệu 'Hài Hước Nhưng Tự Hào' (Relatable Student Badges)",
        description: "Huy hiệu thiết kế theo văn hóa sinh viên Việt: 'Cú Đêm 2h Sáng', 'Khắc Tinh Bẫy Part 1', 'Tay Bấm Nhanh Hơn Não', 'Sinh Viên Chăm Chỉ Qua Môn'.",
        impact: "Kích thích chia sẻ ảnh chụp màn hình lên Facebook/Story Instagram, tăng tính viral tự nhiên.",
        feasibility: "Rất cao (tạo component danh hiệu mở khóa theo trigger sự kiện)."
    },
    {
        id: "INIT_15",
        cluster: "Gamification & Động Lực",
        role: "Quản Trị Viên Cộng Đồng Sinh Viên (Community Guild Master)",
        title: "Hệ Thống 'Tổ Đội Luyện Thi' (Study Squads / Guilds)",
        description: "Cho phép lập nhóm 3-5 người (bạn cùng lớp/cùng phòng trọ). Cả đội cùng cày điểm XP chung để hoàn thành mục tiêu tuần và nhận thưởng chung.",
        impact: "Trách nhiệm xã hội (Social accountability): Bạn bè kéo nhau cùng học, không ai bỏ rơi ai.",
        feasibility: "Trung bình (cần đồng bộ nhóm điểm qua máy chủ)."
    },
    {
        id: "INIT_16",
        cluster: "Gamification & Động Lực",
        role: "Chuyên Gia Vòng Lặp Dopamine (Dopamine Loop Designer)",
        title: "Chiếc Rương Bí Ẩn Sau Mỗi 10 Câu (Mystery Reward Gacha Box)",
        description: "Mỗi khi hoàn thành 1 cụm 10 câu hỏi, học viên được mở một chiếc hộp gacha bí ẩn chứa: thẻ từ vựng hiếm, mẹo làm bài độc quyền từ thủ khoa, hoặc âm thanh chúc mừng hài hước.",
        impact: "Cung cấp phần thưởng ngẫu nhiên biến thiên (Variable Reward) tạo hưng phấn duy trì bài học.",
        feasibility: "Cao (logic hiệu ứng lật thẻ và mở rương CSS/Canvas)."
    },
    {
        id: "INIT_17",
        cluster: "Gamification & Động Lực",
        role: "Chuyên Gia Bảng Xếp Hạng Đa Chiều (Multidimensional Leaderboard)",
        title: "Bảng Xếp Hạng 'Tiến Bộ Vượt Bậc' Thay Vì Chỉ Đua Cày Điểm",
        description: "Bên cạnh BXH Top Điểm Cao, bổ sung: BXH Người Chăm Chỉ Nhất Tuần, BXH Cải Thiện Điểm Số Nhanh Nhất, BXH Chiến Binh Không Ngừng Nghỉ.",
        impact: "Giúp các bạn sinh viên học lực yếu không bị tự ti hay lép vế trước các 'thần đồng' tiếng Anh.",
        feasibility: "Cao (tính toán dựa trên delta điểm số và số ngày hoạt động liên tiếp)."
    },
    {
        id: "INIT_18",
        cluster: "Gamification & Động Lực",
        role: "Kỹ Sư Âm Nhạc Trị Liệu & Tập Trung (Focus Audio Engineer)",
        title: "Đồng Hồ Pomodoro Kèm Nhạc Lo-fi / Tiếng Mưa Thư Giãn Tích Hợp",
        description: "Tích hợp sẵn player Pomodoro 25 phút học / 5 phút nghỉ với 3 kênh âm thanh chọn lọc: Lo-fi Chillbeats, Tiếng Mưa Rơi Ngoài Hiên, Không Khí Quán Cà Phê Học Bài.",
        impact: "Học viên không cần bật thêm tab YouTube khác, giảm xao nhãng bởi thuật toán đề xuất video.",
        feasibility: "Rất cao (tích hợp audio loop nhẹ không tốn băng thông)."
    },
    {
        id: "INIT_19",
        cluster: "Gamification & Động Lực",
        role: "Chuyên Gia Hiệu Ứng Vi Mô (Micro-interaction Designer)",
        title: "Hiệu Ứng Âm Thanh & Pháo Hoa Thăng Hoa Khi Trả Lời Đúng",
        description: "Âm thanh phản hồi giòn giã 'ding!', tiếng chuông combo liên hoàn khi đúng 5 câu liên tiếp, kết hợp hạt confetti bay nhẹ khi phá kỷ lục cá nhân.",
        impact: "Kích thích giác quan ngay tức thì, biến bài kiểm tra khô khan thành trải nghiệm giải trí bổ ích.",
        feasibility: "Rất cao (dùng thư viện nhẹ canvas-confetti và audio chime có sẵn)."
    },
    {
        id: "INIT_20",
        cluster: "Gamification & Động Lực",
        role: "Người Điều Phối Chiến Dịch Xã Hội (Social Campaign Coordinator)",
        title: "Thử Thách '30 Ngày Bứt Phá Ra Trường' (30-Day Graduation Challenge)",
        description: "Lộ trình đóng khung 30 ngày với danh sách bài học cụ thể mỗi ngày. Hoàn thành 30 ngày nhận chứng nhận điện tử 'Đủ Điều Kiện Tốt Nghiệp' có chữ ký của web.",
        impact: "Tạo áp lực tích cực có kỳ hạn (Sense of Urgency), biến việc học thành cam kết rõ ràng.",
        feasibility: "Cao (tạo bộ tracker tiến độ 30 ngày trực quan)."
    },

    // CLUSTER 3: UI/UX & MOBILE EXPERIENCE (10)
    {
        id: "INIT_21",
        cluster: "Giao Diện & Trải Nghiệm Mobile",
        role: "Chuyên Gia Thiết Kế Công Thái Học Ngón Tay (Thumb Ergonomics Specialist)",
        title: "Vùng Thao Tác Ngón Tay Cái Một Tay (One-Hand Thumb Navigation Zone)",
        description: "Đưa toàn bộ các nút bấm quan trọng nhất (Phát Audio, Chọn đáp án A-B-C-D, Nút Tiếp tục) xuống 1/3 đáy màn hình, giúp cầm điện thoại 1 tay trên xe bus vẫn bấm thoải mái.",
        impact: "Tối ưu hóa công thái học di động, chống mỏi tay và giảm tỷ lệ bấm trượt.",
        feasibility: "Rất cao (tinh chỉnh vị trí CSS bottom nav)."
    },
    {
        id: "INIT_22",
        cluster: "Giao Diện & Trải Nghiệm Mobile",
        role: "Nhà Thiết Kế Hệ Thống Âm Thanh Di Động (Mobile Audio System Designer)",
        title: "Thanh Điều Khiển Audio Nổi Thu Nhỏ Kiểu 'Dynamic Island'",
        description: "Khi học viên cuộn trang xuống xem câu hỏi hoặc lời giải, thanh phát audio tự động thu nhỏ thành 1 viên thuốc (pill) nổi ở mép màn hình hiển thị sóng âm và nút Play/Pause.",
        impact: "Không bao giờ bị mất dấu trình điều khiển âm thanh dù xem bài đọc dài.",
        feasibility: "Cao (CSS position fixed kết hợp IntersectionObserver)."
    },
    {
        id: "INIT_23",
        cluster: "Giao Diện & Trải Nghiệm Mobile",
        role: "Chuyên Gia Hiển Thị OLED & Tiết Kiệm Năng Lượng (OLED Display Specialist)",
        title: "Chế Độ Dark Mode Đen Tuyệt Đối (#000000 True Pitch Black)",
        description: "Bên cạnh Dark Mode xanh navy hiện tại, bổ sung chế độ Đen Thuần OLED: giúp tắt hẳn các điểm ảnh trên màn hình iPhone/Android, tiết kiệm pin 40% và chống lóa mắt ban đêm.",
        impact: "Cực kỳ lý tưởng cho sinh viên thường xuyên cày đề trong phòng trọ tối sau 11h đêm.",
        feasibility: "Rất cao (bổ sung biến class CSS bg-black)."
    },
    {
        id: "INIT_24",
        cluster: "Giao Diện & Trải Nghiệm Mobile",
        role: "Chuyên Gia Tương Tác Cử Chỉ (Gesture Interaction Designer)",
        title: "Thẻ Flashcard Từ Vựng Vuốt Trái/Phải Kiểu 'Tinder'",
        description: "Thao tác vuốt mượt mà: Vuốt sang Phải nếu đã thuộc từ, Vuốt sang Trái nếu chưa thuộc. Kèm hiệu ứng nghiêng thẻ 3D vật lý chân thực.",
        impact: "Tốc độ ôn từ vựng nhanh gấp 3 lần so với việc bấm nút thủ công.",
        feasibility: "Cao (dùng TouchEvent handlers và CSS transform)."
    },
    {
        id: "INIT_25",
        cluster: "Giao Diện & Trải Nghiệm Mobile",
        role: "Chuyên Gia Chống Nhầm Lẫn Bàn Phím (Keyboard Anti-Fatigue Specialist)",
        title: "Bàn Phím Số Ảo Siêu To Nổi Dưới Đáy Màn Hình Cho Part 1 & Part 2",
        description: "Khi làm Part 1 (4 lựa chọn) và Part 2 (3 lựa chọn), hiển thị dãy nút A, B, C, D to bản có khoảng cách an toàn, kèm phản hồi rung haptic xúc giác.",
        impact: "Xóa bỏ hoàn toàn tình trạng bấm nhầm đáp án do ngón tay to hoặc xe rung lắc.",
        feasibility: "Rất cao (tạo bàn phím bottom dock tối ưu cho mobile)."
    },
    {
        id: "INIT_26",
        cluster: "Giao Diện & Trải Nghiệm Mobile",
        role: "Chuyên Gia Màn Hình Gập & Máy Tính Bảng (Foldable & Tablet UX Specialist)",
        title: "Bố Cục Kép Phân Chia Hai Cột Cho iPad & Điện Thoại Màn Gập",
        description: "Khi phát hiện màn hình rộng (Tablet, iPad, Samsung Z Fold): Cột trái hiển thị đề bài/hình ảnh/đoạn văn, Cột phải hiển thị phiếu trả lời và từ điển tra cứu nhanh.",
        impact: "Tận dụng tối đa không gian màn hình lớn mà không bị khoảng trắng thừa thãi.",
        feasibility: "Cao (CSS grid 2-column với breakpoint @media (min-width: 768px))."
    },
    {
        id: "INIT_27",
        cluster: "Giao Diện & Trải Nghiệm Mobile",
        role: "Nhà Tâm Lý Học Màu Sắc Giao Diện (Color Psychology Researcher)",
        title: "Bộ Giao Diện Đổi Màu Theo Tâm Trạng Học Tập (Mood Themes)",
        description: "Tùy chọn 4 phong cách màu: 'Rừng Xanh Bình Yên' (Emerald thư giãn giảm stress), 'Đại Dương Tập Trung' (Navy Deep Blue), 'Cà Phê Tỉnh Táo' (Warm Amber), 'Mùa Thi Quyết Liệt' (Crimson Focus).",
        impact: "Cá nhân hóa tối đa theo gu thẩm mỹ của từng sinh viên.",
        feasibility: "Cao (chuyển đổi bộ biến CSS theme variables)."
    },
    {
        id: "INIT_28",
        cluster: "Giao Diện & Trải Nghiệm Mobile",
        role: "Kỹ Sư Phản Hồi Xúc Giác (Haptic Feedback Engineer)",
        title: "Bộ Rung Xúc Giác Rung Nhẹ Thông Minh Trên Điện Thoại (Vibration API)",
        description: "Tận dụng `navigator.vibrate`: Rung nhẹ 1 nhịp ngắn (30ms) khi chọn đáp án, rung 2 nhịp vui tươi khi đúng câu hỏi khó, rung dài nhẹ khi hoàn thành bài test.",
        impact: "Tạo cảm giác chân thực như đang bấm bút bi tô phiếu trả lời thi thật.",
        feasibility: "Rất cao (tích hợp Web Vibration API an toàn có kiểm tra hỗ trợ)."
    },
    {
        id: "INIT_29",
        cluster: "Giao Diện & Trải Nghiệm Mobile",
        role: "Chuyên Gia Kiểu Chữ Đọc Sách (Typography & Readability Specialist)",
        title: "Bộ Chuyển Đổi Phông Chữ ETS Thi Thật vs Phông Chữ Dễ Đọc Cho Mắt",
        description: "Nút gạt chuyển đổi nhanh: Phông chữ mô phỏng đề thi ETS thật (Times New Roman / Garamond) để quen mắt phòng thi, hoặc Phông Sans-serif hiện đại (Inter / Plus Jakarta Sans) để đọc lâu không mỏi.",
        impact: "Đáp ứng cả hai nhu cầu: Vừa luyện làm quen phông thi thật, vừa đọc giải thích êm dịu cho mắt.",
        feasibility: "Rất cao (chuyển đổi font-family class trên body)."
    },
    {
        id: "INIT_30",
        cluster: "Giao Diện & Trải Nghiệm Mobile",
        role: "Kỹ Sư Đồng Bộ Lời Bài Hát (Karaoke Transcript Synchronizer)",
        title: "Chạy Chữ Lời Thoại Karaoke Theo Nhịp Đọc Audio (Karaoke Scrolling Script)",
        description: "Trong phần xem lại đáp án hoặc bài nghe Part 3/Part 4, từng câu và từng từ được tô sáng chạy theo giọng đọc audio giống Apple Music / Spotify.",
        impact: "Học viên nhận biết chính xác từ nào mình vừa nghe lướt qua hoặc phát âm nuốt âm.",
        feasibility: "Trung bình (dựa trên time-stamped transcript cues)."
    },

    // CLUSTER 4: ARTIFICIAL INTELLIGENCE & SMART EDTECH (10)
    {
        id: "INIT_31",
        cluster: "Trí Tuệ Nhân Tạo & EdTech Thông Minh",
        role: "Kiến Trúc Sư AI Đàm Thoại (Conversational AI Architect)",
        title: "Trợ Lý Ảo 'Gia Sư Đăng' Đối Thoại Giọng Nói 1-1 (AI Speaking Partner)",
        description: "Cho phép sinh viên bấm mic nói chuyện trực tiếp với AI để luyện phản xạ hỏi - đáp Part 2 và tóm tắt nội dung Part 3, AI phản hồi lại bằng giọng người bản ngữ tự nhiên.",
        impact: "Mở rộng từ Luyện Nghe sang Luyện Nói phản xạ toàn diện mà không tốn chi phí thuê gia sư Tây.",
        feasibility: "Trung bình (kết nối endpoint Gemini Flash Live / Web Audio API)."
    },
    {
        id: "INIT_32",
        cluster: "Trí Tuệ Nhân Tạo & EdTech Thông Minh",
        role: "Chuyên Gia Phân Tích Lỗi Sai Bằng AI (AI Pedagogical Explainer)",
        title: "Trình Diễn Giải 'Vì Sao Em Sai?' Bằng Phong Cách Sinh Viên Dí Dỏm",
        description: "AI phân tích chính xác vì sao học viên lại chọn đáp án sai đó: 'À em bị bẫy bởi từ sounded like (nghe na ná) rồi! Người ta nói depart mà em nghe thành part! Đừng để ETS lừa lần nữa nha!'",
        impact: "Tạo cảm giác thân thiện, xoa dịu cảm giác bực bội khi làm sai câu khó.",
        feasibility: "Cao (sử dụng template prompt AI phân tích theo cặp [câu trả lời sai - đáp án đúng])."
    },
    {
        id: "INIT_33",
        cluster: "Trí Tuệ Nhân Tạo & EdTech Thông Minh",
        role: "Kỹ Sư Nhận Diện Giọng Đọc Bản Xứ (Accent Classifier Engineer)",
        title: "Thước Đo Nhận Diện Accent Tự Động (US vs UK vs AU vs CA Detector)",
        description: "Khi phát audio, hiển thị cờ quốc gia tương ứng (Cờ Mỹ, Anh, Úc, Canada) và highlight các từ mang biến âm đặc trưng của vùng đó (e.g., schedule, advertisement, tomato).",
        impact: "Giúp người học chủ động 'chuyển kênh não bộ' sang accent tương ứng ngay khi nghe câu đầu.",
        feasibility: "Rất cao (metadata accent đã có sẵn trong cơ sở dữ liệu)."
    },
    {
        id: "INIT_34",
        cluster: "Trí Tuệ Nhân Tạo & EdTech Thông Minh",
        role: "Kỹ Sư Xử Lý Tín Hiệu Âm Thanh Tự Động (Smart Speed Scaling Engineer)",
        title: "Tự Động Giảm Tốc Độ Thông Minh Ở Đoạn Bẫy (Dynamic Speed Braking)",
        description: "Học viên có thể bật chế độ 'Tự giảm tốc': Audio chạy tốc độ bình thường 1.0x, nhưng khi đến cụm từ bẫy nguy hiểm hoặc từ nối âm khó, tự động hạ xuống 0.85x rồi trở lại bình thường.",
        impact: "Giúp tai người học kịp thời 'bắt trúng' khoảnh khắc phát âm nối khó nuốt.",
        feasibility: "Trung bình (cần metadata timestamps cho các đoạn bẫy)."
    },
    {
        id: "INIT_35",
        cluster: "Trí Tuệ Nhân Tạo & EdTech Thông Minh",
        role: "Chuyên Gia Thị Giác Máy Tính (Computer Vision / OCR Specialist)",
        title: "Chụp Ảnh Đề Sách Giáo Trình - Giải Bẫy Liền Tay (Snap & Solve OCR)",
        description: "Sinh viên chụp ảnh một câu hỏi khó trong đề giấy trên lớp hoặc sách ETS, tải lên web; hệ thống OCR tự nhận diện chữ và phân tích bẫy ngay lập tức.",
        impact: "Kết nối tài liệu học tập thực tế ngoài đời thực vào hệ sinh thái của web.",
        feasibility: "Cao (dùng Gemini 1.5 Flash Vision API xử lý ảnh sang văn bản trong 1 giây)."
    },
    {
        id: "INIT_36",
        cluster: "Trí Tuệ Nhân Tạo & EdTech Thông Minh",
        role: "Nhà Sáng Tạo Mẹo Nhớ Từ Vựng (Mnemonics & Memory Hook Creator)",
        title: "Trình Tạo Mẹo Nhớ Từ Vựng Bằng Thơ & Chữ Hán/Việt (AI Mnemonic Engine)",
        description: "Tự động tạo câu chuyện bắc cầu âm thanh tương tự để nhớ nghĩa: Ví dụ từ 'hesitate' (/ˈhezɪteɪt/) -> 'Hè sĩ té' -> 'Nghỉ hè mà đi thi sĩ bị té nên ngập ngừng do dự'.",
        impact: "Thuộc ngay các từ vựng khó nhớ chỉ sau 1 lần đọc mẹo vui nhộn.",
        feasibility: "Cao (tạo sẵn bộ từ điển mẹo cho 1000 từ then chốt)."
    },
    {
        id: "INIT_37",
        cluster: "Trí Tuệ Nhân Tạo & EdTech Thông Minh",
        role: "Nhà Dự Đoán Điểm Số Bằng Máy Học (Predictive Machine Learning Specialist)",
        title: "Đường Cong Dự Báo Điểm Thi Thật (ETS Score Prediction Curve)",
        description: "Dựa trên: tỷ lệ đúng theo từng Part, tốc độ phản xạ bấm nút, và lịch sử phân bổ điểm của các thế hệ sinh viên đi trước để đưa ra khoảng điểm thi thật chính xác (e.g., 680 - 730).",
        impact: "Sinh viên biết chắc chắn mình đã đủ điều kiện qua môn hay chưa trước khi nộp 1 triệu 500k lệ phí thi.",
        feasibility: "Cao (thuật toán quy đổi thống kê chuẩn ETS Raw Score to Scaled Score)."
    },
    {
        id: "INIT_38",
        cluster: "Trí Tuệ Nhân Tạo & EdTech Thông Minh",
        role: "Kỹ Sư Lọc Tạp Âm & Tối Ưu Âm Thanh (Audio Enhancement Specialist)",
        title: "Bộ Khử Nhiễu & Tăng Cường Độ Rõ Của Giọng Đọc (AI Voice Clarifier)",
        description: "Bộ lọc equalizer tần số giọng người (1kHz - 4kHz) tích hợp trực tiếp trên Web Audio API giúp giọng đọc trong trẻo, rõ nét ngay cả khi nghe bằng tai nghe giá rẻ 50k.",
        impact: "Đảm bảo chất lượng âm thanh đồng đều cho mọi sinh viên dù dùng điện thoại cũ hay tai nghe thường.",
        feasibility: "Cao (dùng BiquadFilterNode của Web Audio API)."
    },
    {
        id: "INIT_39",
        cluster: "Trí Tuệ Nhân Tạo & EdTech Thông Minh",
        role: "Chuyên Gia Phân Tích Lịch Trình Cá Nhân Hóa (Personalized Schedule Coach)",
        title: "Lịch Học Thích Ứng Theo Mùa Thi Học Kỳ Của Trường",
        description: "Học viên chỉ cần nhập ngày dự định thi ra trường và số điểm cần đạt; hệ thống tự động vẽ biểu đồ phân phối: 'Mỗi ngày cần làm bao nhiêu câu, hôm nào bận thi chuyên ngành thì giảm tải'.",
        impact: "Không bị quá tải, phù hợp với lịch sinh hoạt thất thường của sinh viên đại học.",
        feasibility: "Rất cao (tính toán số ngày chia đều lượng câu hỏi)."
    },
    {
        id: "INIT_40",
        cluster: "Trí Tuệ Nhân Tạo & EdTech Thông Minh",
        role: "Chuyên Gia Ngữ Cảnh Song Ngữ (Bilingual Contextualist)",
        title: "Đối Chiếu Văn Hóa Doanh Nghiệp Mỹ - Việt (Cross-Cultural Workplace Notes)",
        description: "Giải thích văn hóa công sở Mỹ đằng sau đề bài: Vì sao người Mỹ thích hẹn ăn trưa (working lunch), vì sao gửi RSVP phải phản hồi ngay, sự khác biệt giữa memo và notice.",
        impact: "Không chỉ học để thi đỗ, mà còn trang bị kỹ năng làm việc thực tế tại các tập đoàn đa quốc gia.",
        feasibility: "Cao (thêm ghi chú ngắn 'Văn hóa công sở' trong phần giải thích)."
    },

    // CLUSTER 5: ACCESSIBILITY, OFFLINE & COMMUNITY (10)
    {
        id: "INIT_41",
        cluster: "Tiếp Cận Đa Tầng Lớp & Cộng Đồng",
        role: "Kỹ Sư Tối Ưu Mạng Băng Thông Thấp (Low-Bandwidth Web Architect)",
        title: "Chế Độ 'Sinh Viên Tiết Kiệm Data' (Super Data Saver Mode)",
        description: "Chế độ 1 chạm: Tắt tải các hình ảnh trang trí, nén audio xuống định dạng Opus/AAC siêu nhẹ (chỉ tốn vài trăm KB cho cả bài test), giúp học viên dùng gói 4G hết tốc độ cao vẫn học phà phà.",
        impact: "Không bỏ rơi bất kỳ sinh viên nào ở vùng sâu vùng xa hoặc hoàn cảnh khó khăn.",
        feasibility: "Rất cao (gắn cờ toggle DataSaver tắt tài nguyên nặng)."
    },
    {
        id: "INIT_42",
        cluster: "Tiếp Cận Đa Tầng Lớp & Cộng Đồng",
        role: "Chuyên Gia Ứng Dụng Web Tiến Bộ (Progressive Web App - PWA Engineer)",
        title: "Cài Đặt 1 Chạm Thành App Di Động Hoàn Chỉnh (PWA Instant Install)",
        description: "Bật popup hướng dẫn 'Thêm vào Màn hình chính' trên iOS Safari và Android Chrome. Web biến thành App độc lập không có thanh địa chỉ trình duyệt, có icon riêng đẹp mắt.",
        impact: "Trải nghiệm mượt mà y hệt Native App tải từ App Store mà không tốn dung lượng bộ nhớ.",
        feasibility: "Rất cao (file manifest.json và ServiceWorker đã sẵn sàng)."
    },
    {
        id: "INIT_43",
        cluster: "Tiếp Cận Đa Tầng Lớp & Cộng Đồng",
        role: "Kỹ Sư Lưu Trữ Ngoại Tuyến (Offline Storage Specialist)",
        title: "Học Ngoại Tuyến Hoàn Toàn Bằng IndexedDB (100% Offline Test Pack)",
        description: "Nút bấm 'Tải bộ đề ngoại tuyến': Cho phép lưu trước 5 đề thi và 500 từ vựng vào bộ nhớ máy, sinh viên ngồi trên xe buýt đường dài hoặc mất sóng wifi vẫn làm bài bình thường.",
        impact: "Độc lập hoàn toàn với internet, biến web thành công cụ học tập mọi lúc mọi nơi.",
        feasibility: "Cao (sử dụng IndexedDB lưu trữ JSON và Blob audio)."
    },
    {
        id: "INIT_44",
        cluster: "Tiếp Cận Đa Tầng Lớp & Cộng Đồng",
        role: "Chuyên Gia Trợ Năng Toàn Cầu (Web Accessibility & WCAG AAA Auditor)",
        title: "Chuẩn Trợ Năng Toàn Diện Cho Người Khiếm Thị & Khiếm Thính (WCAG AAA)",
        description: "Hỗ trợ đầy đủ phím Tab/Enter, nhãn aria-label cho trình đọc màn hình, chế độ tương phản cao cho người mắt yếu, và phụ đề đóng (closed captions) cho người nghe kém.",
        impact: "Đảm bảo tính nhân văn sâu sắc, mọi tầng lớp và đối tượng trong xã hội đều có quyền bình đẳng học tập.",
        feasibility: "Cao (chuẩn hóa thuộc tính HTML và phím tắt)."
    },
    {
        id: "INIT_45",
        cluster: "Tiếp Cận Đa Tầng Lớp & Cộng Đồng",
        role: "Nhà Thiết Kế Cho Người Không Rành Công Nghệ (Zero-Friction UX Designer)",
        title: "Chế Độ 'Mở Là Học Ngay - 1 Chạm' (Zero-Config Simplicity Mode)",
        description: "Dành riêng cho những bạn ngại công nghệ hoặc sinh viên mới tiếp cận: Vào trang chỉ có 1 nút to duy nhất: 'BẮT ĐẦU LUYỆN NGAY'. Hệ thống tự chọn bài phù hợp nhất mà không cần tùy chỉnh phức tạp.",
        impact: "Loại bỏ rào cản 'sợ app phức tạp', ai mở web lên cũng biết dùng ngay trong 3 giây.",
        feasibility: "Rất cao (tạo flow One-Click Quick Start trên trang chủ)."
    },
    {
        id: "INIT_46",
        cluster: "Tiếp Cận Đa Tầng Lớp & Cộng Đồng",
        role: "Chuyên Gia Lan Tỏa Mạng Xã Hội (Social Virality Architect)",
        title: "Trình Tạo Ảnh Thẻ Từ Vựng & Điểm Số Để Khoe Story (Social Card Generator)",
        description: "Nút 'Khoe thành tích': Tự động xuất 1 bức ảnh tỉ lệ 9:16 siêu đẹp (chứa từ vựng hay vừa học, chuỗi streak, kèm linh vật Totoro) để đăng Facebook Story / Instagram / Zalo.",
        impact: "Quảng bá web tự nhiên hoàn toàn miễn phí thông qua chính sự tự hào của người học.",
        feasibility: "Cao (dùng HTML5 Canvas xuất ảnh trực tiếp trong trình duyệt)."
    },
    {
        id: "INIT_47",
        cluster: "Tiếp Cận Đa Tầng Lớp & Cộng Đồng",
        role: "Trưởng Ban Kết Nối Cựu Sinh Viên (Alumni Mentorship Coordinator)",
        title: "Góc 'Tiếp Lửa Ra Trường' - Lời Khuyên Từ Cựu Sinh Viên Đã Vượt Cạn",
        description: "Khu vực ghi chú ngắn từ các anh chị khóa trước: 'Khóa 18 trường mình cần 550 là ra trường được, các em cố lên!', 'Hôm qua anh vừa thi phòng thi ở IIG xong, loa rất to rõ, nhớ mang CCCD'.",
        impact: "Tạo cảm giác gắn kết cộng đồng sinh viên, tiếp thêm niềm tin và động lực thực tế.",
        feasibility: "Rất cao (lưu danh sách tin nhắn cổ vũ tĩnh hoặc JSON nhẹ)."
    },
    {
        id: "INIT_48",
        cluster: "Tiếp Cận Đa Tầng Lớp & Cộng Đồng",
        role: "Chuyên Gia Bản Địa Hóa Đa Ngôn Ngữ (Multilingual Localization Specialist)",
        title: "Hỗ Trợ Giao Diện Đa Ngôn Ngữ Cho Sinh Viên Quốc Tế (i18n Support)",
        description: "Bổ sung tùy chọn ngôn ngữ giao diện: Tiếng Việt, Tiếng Anh, Tiếng Hàn, Tiếng Nhật, Tiếng Lào/Campuchia cho các bạn lưu học sinh đang theo học tại các trường đại học Việt Nam.",
        impact: "Mở rộng tầm vóc của web thành nền tảng giáo dục quốc tế không biên giới.",
        feasibility: "Cao (dùng từ điển i18n key-value nhẹ)."
    },
    {
        id: "INIT_49",
        cluster: "Tiếp Cận Đa Tầng Lớp & Cộng Đồng",
        role: "Chuyên Gia Định Dạng In Ấn (Print & Paper Workflow Specialist)",
        title: "Xuất Đề Thi & Bảng Từ Vựng Ra File PDF Chuẩn In Ấn 1 Chạm",
        description: "Nút 'In đề thi': Tự động xuất đề và bảng từ vựng ra file PDF định dạng A4 sạch sẽ, không chứa quảng cáo, có sẵn ô tròn để tô chì như đề thi thật.",
        impact: "Phục vụ các bạn thích cầm bút gạch chân trên giấy hoặc giáo viên in đề cho học sinh trên lớp.",
        feasibility: "Cao (dùng CSS @media print được tối ưu tinh tế)."
    },
    {
        id: "INIT_50",
        cluster: "Tiếp Cận Đa Tầng Lớp & Cộng Đồng",
        role: "Đại Sứ Tài Nguyên Giáo Dục Mở (Open Education Resource Ambassador)",
        title: "Bản Tuyên Ngôn 'Mọi Sinh Viên Đều Được Ra Trường' (Free Education Manifesto)",
        description: "Cam kết công khai trên web: Nền tảng miễn phí 100% vĩnh viễn cho sinh viên, không thu phí mở khóa tính năng, không quảng cáo phản cảm cờ bạc, đặt tương lai sinh viên lên hàng đầu.",
        impact: "Tạo dựng niềm tin tuyệt đối và sự yêu mến trọn vẹn từ hàng triệu sinh viên trên cả nước.",
        feasibility: "Rất cao (chỉ là cam kết sứ mệnh hiển thị ở chân trang)."
    }
];

console.log(`Loaded ${initiatives.length} strategic initiatives from 50 agents.`);

// Group by cluster
const clusters = {};
initiatives.forEach(item => {
    if (!clusters[item.cluster]) clusters[item.cluster] = [];
    clusters[item.cluster].push(item);
});

fs.writeFileSync('scripts/proof_50_initiatives_data.json', JSON.stringify({
    totalInitiatives: initiatives.length,
    clusters
}, null, 2));

console.log('Saved 50 initiatives to scripts/proof_50_initiatives_data.json');
