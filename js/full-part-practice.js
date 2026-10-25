/**
 * HỆ THỐNG LUYỆN THI TRỌN VẸN TỪNG PART (FULL PART PRACTICE) ETS 2026
 * Dành riêng cho "Cùng Đăng Ra Trường"
 * Hỗ trợ làm toàn bộ 1 Part liền mạch:
 * - Part 1: Full 6 câu (Mỗi câu có 1 bức ảnh thực tế + Audio + 4 lựa chọn A, B, C, D)
 * - Part 2: Full 25 câu (Chuẩn ETS: Đúng 3 lựa chọn A, B, C + Audio)
 * - Part 3: Full 12 câu (4 đoạn hội thoại, mỗi đoạn 3 câu hỏi A, B, C, D + Audio)
 * - Part 4: Full 12 câu (4 bài nói độc thoại, mỗi bài 3 câu hỏi A, B, C, D + Audio)
 * - Part 5: Full 30 câu (30 câu điền từ vào câu: Ngữ pháp & Từ vựng, A, B, C, D)
 * - Part 6: Full 16 câu (4 đoạn văn hoàn chỉnh, mỗi đoạn 4 câu hỏi A, B, C, D)
 * - Part 7: Full 20 câu (Đọc hiểu văn bản đơn, email, thông báo, hóa đơn, A, B, C, D)
 */

window.FullPartPracticeEngine = {
    currentPart: 1,
    activeQuestions: [],
    currentIndex: 0,
    userAnswers: {},
    timeRemaining: 0,
    timerInterval: null,
    isSubmitted: false,

    // Bộ câu hỏi chuẩn ETS cho từng Part
    partDatasets: {
        1: {
            title: "Part 1: Photographs (Mô tả hình ảnh)",
            totalQuestions: 4,
            timeLimitMinutes: 4,
            badge: "Listening · 4 câu mẫu chuẩn ETS",
            optionsCount: 4,
            questions: [
                {
                    id: "p1-sample-01",
                    part: 1,
                    topic: "Tranh tả người",
                    image: "assets/listening/part1/p1_sample_01_person.webp",
                    audioScript: "Number 1. Look at the picture marked number 1 in your test book. (A) She is hanging a picture frame on the wall. (B) A woman is examining a blueprint on a table. (C) She is rolling up a sheet of paper. (D) She is speaking into a telephone receiver.",
                    q: "Look at the picture and choose the statement that best describes what you see:",
                    options: [
                        "A. She is hanging a picture frame on the wall.",
                        "B. A woman is examining a blueprint on a table.",
                        "C. She is rolling up a sheet of paper.",
                        "D. She is speaking into a telephone receiver."
                    ],
                    ans: "B",
                    ansLetter: "B",
                    explain: "Phân tích tranh: Người phụ nữ đứng bên bàn làm việc và nhìn chăm chú vào bản vẽ kiến trúc trải phẳng. (B) 'A woman is examining a blueprint on a table' mô tả chính xác nhất. (A) sai vì không treo tranh. (C) sai vì bản vẽ đang mở phẳng. (D) sai vì không dùng điện thoại."
                },
                {
                    id: "p1-sample-02",
                    part: 1,
                    topic: "Tranh tả vật",
                    image: "assets/listening/part1/p1_sample_02_object.webp",
                    audioScript: "Number 2. Look at the picture marked number 2 in your test book. (A) Some attendees are taking seats for a lecture. (B) The presentation screen has been turned on. (C) Chairs are arranged around a long table. (D) The conference table is being wiped down.",
                    q: "Look at the picture and choose the statement that best describes what you see:",
                    options: [
                        "A. Some attendees are taking seats for a lecture.",
                        "B. The presentation screen has been turned on.",
                        "C. Chairs are arranged around a long table.",
                        "D. The conference table is being wiped down."
                    ],
                    ans: "C",
                    ansLetter: "C",
                    explain: "Phân tích tranh tĩnh không người: (C) 'Chairs are arranged around a long table' mô tả chính xác trạng thái sắp đặt của bàn ghế. (A) sai vì không có người. (B) sai vì màn hình máy chiếu màu trắng đang tắt. (D) dùng 'is being wiped down' chỉ hành động đang lau dọn có người thực hiện -> SAI với tranh tĩnh."
                },
                {
                    id: "p1-sample-03",
                    part: 1,
                    topic: "Cảnh & bối cảnh",
                    image: "assets/listening/part1/p1_sample_03_scene.webp",
                    audioScript: "Number 3. Look at the picture marked number 3 in your test book. (A) Benches have been placed along a walkway. (B) Boats are passing beneath a bridge. (C) Leaves are being swept into a pile. (D) Pedestrians are jogging in a group along the path.",
                    q: "Look at the picture and choose the statement that best describes what you see:",
                    options: [
                        "A. Benches have been placed along a walkway.",
                        "B. Boats are passing beneath a bridge.",
                        "C. Leaves are being swept into a pile.",
                        "D. Pedestrians are jogging in a group along the path."
                    ],
                    ans: "A",
                    ansLetter: "A",
                    explain: "Phân tích tranh phong cảnh: (A) 'Benches have been placed along a walkway' chỉ trạng thái tĩnh sẵn có -> ĐÚNG. (B) sai vì trên sông không có thuyền. (C) sai vì không ai quét lá. (D) sai vì không có người chạy bộ."
                },
                {
                    id: "p1-sample-04",
                    part: 1,
                    topic: "Người & vật tương tác",
                    image: "assets/listening/part1/p1_sample_04_interaction.webp",
                    audioScript: "Number 4. Look at the picture marked number 4 in your test book. (A) Groceries are being loaded into a vehicle. (B) A customer is entering a PIN code on a keypad. (C) Shelves are being restocked with canned goods. (D) A cashier is handing a bag to a customer.",
                    q: "Look at the picture and choose the statement that best describes what you see:",
                    options: [
                        "A. Groceries are being loaded into a vehicle.",
                        "B. A customer is entering a PIN code on a keypad.",
                        "C. Shelves are being restocked with canned goods.",
                        "D. A cashier is handing a bag to a customer."
                    ],
                    ans: "D",
                    ansLetter: "D",
                    explain: "Phân tích tranh tương tác hai người: (D) 'A cashier is handing a bag to a customer' miêu tả chuẩn xác tương tác trọng tâm. (A) sai vì tại quầy thu ngân trong siêu thị, không phải xe hơi. (B) sai vì đang đón túi giấy, không phải bấm mã PIN. (C) sai vì không xếp đồ hộp."
                }
            ]
        },

        2: {
            title: "Part 2: Question-Response (Hỏi & Đáp)",
            totalQuestions: 25,
            timeLimitMinutes: 15,
            badge: "Listening · Đúng 3 đáp án (A, B, C)",
            optionsCount: 3,
            questions: [
                {
                    id: "p2-1",
                    audioScript: "When will the quarterly budget meeting take place? (A) In Conference Room B. (B) Next Tuesday at ten A.M. (C) Yes, I met him yesterday.",
                    q: "When will the quarterly budget meeting take place?",
                    options: ["A. In Conference Room B.", "B. Next Tuesday at 10:00 A.M.", "C. Yes, I met him yesterday."],
                    ans: "B",
                    explain: "Câu hỏi 'When' hỏi thời gian -> Chọn B (Next Tuesday at 10:00 A.M.). Đáp án A trả lời cho 'Where', C là câu Yes/No kèm bẫy lặp từ 'meeting/met'."
                },
                {
                    id: "p2-2",
                    audioScript: "Where did you put the revised employee handbooks? (A) Yes, I revised them. (B) On the shelf in the copy room. (C) No later than Friday.",
                    q: "Where did you put the revised employee handbooks?",
                    options: ["A. Yes, I revised them.", "B. On the shelf in the copy room.", "C. No later than Friday."],
                    ans: "B",
                    explain: "Câu hỏi 'Where' hỏi địa điểm -> Chọn B (On the shelf in the copy room). A sai vì Wh- không dùng Yes, C trả lời cho 'When'."
                },
                {
                    id: "p2-3",
                    audioScript: "Why was the client presentation postponed? (A) At the main post office. (B) Because the projector was being repaired. (C) I bought a birthday present.",
                    q: "Why was the client presentation postponed?",
                    options: ["A. At the main post office.", "B. Because the projector was being repaired.", "C. I bought a birthday present."],
                    ans: "B",
                    explain: "Câu hỏi 'Why' hỏi nguyên nhân -> Chọn B (Because the projector was being repaired). A và C là bẫy đồng âm (post/postponed, present/presentation)."
                },
                {
                    id: "p2-4",
                    audioScript: "Would you like to review the sales figures before the conference? (A) Sure, let's look over them now. (B) The conference was last month. (C) About twenty dollars.",
                    q: "Would you like to review the sales figures before the conference?",
                    options: ["A. Sure, let's look over them now.", "B. The conference was last month.", "C. About twenty dollars."],
                    ans: "A",
                    explain: "Lời đề nghị 'Would you like to review...' -> Chọn A (Sure, let's look over them now) đồng ý cùng xem lại."
                },
                {
                    id: "p2-5",
                    audioScript: "The printer on the fourth floor seems to be jammed again. (A) I already submitted my report. (B) There is another one down the hall. (C) Printing fifty copies.",
                    q: "The printer on the fourth floor seems to be jammed again.",
                    options: ["A. I already submitted my report.", "B. There is another one down the hall.", "C. Printing fifty copies."],
                    ans: "B",
                    explain: "Câu trần thuật thông báo máy in bị kẹt -> B (Có một chiếc khác ở cuối hành lang) đưa ra giải pháp xử lý hợp lý nhất."
                },
                {
                    id: "p2-6",
                    audioScript: "Who is in charge of organizing the company annual dinner? (A) It will be held downtown. (B) Sarah from human resources. (C) Yes, it was delicious.",
                    q: "Who is in charge of organizing the company annual dinner?",
                    options: ["A. It will be held downtown.", "B. Sarah from human resources.", "C. Yes, it was delicious."],
                    ans: "B",
                    explain: "Câu hỏi 'Who' hỏi người phụ trách -> B (Sarah from human resources)."
                },
                {
                    id: "p2-7",
                    audioScript: "How often do you conduct software security updates? (A) Once every two weeks. (B) Yes, the software is secure. (C) In the IT department.",
                    q: "How often do you conduct software security updates?",
                    options: ["A. Once every two weeks.", "B. Yes, the software is secure.", "C. In the IT department."],
                    ans: "A",
                    explain: "Câu hỏi 'How often' hỏi tần suất -> A (Once every two weeks = 2 tuần một lần)."
                },
                {
                    id: "p2-8",
                    audioScript: "Should we take a taxi or catch the subway to the airport? (A) The subway is much faster at this hour. (B) Yes, I caught it. (C) Ticket prices are forty dollars.",
                    q: "Should we take a taxi or catch the subway to the airport?",
                    options: ["A. The subway is much faster at this hour.", "B. Yes, I caught it.", "C. Ticket prices are forty dollars."],
                    ans: "A",
                    explain: "Câu hỏi lựa chọn 'take a taxi or catch the subway' -> A (Tàu điện ngầm nhanh hơn nhiều vào giờ này) đưa ra lựa chọn hợp lý."
                },
                {
                    id: "p2-9",
                    audioScript: "Has the new marketing director been introduced to the team? (A) He will arrive tomorrow morning. (B) Yes, I bought the marketing book. (C) At the grand opening.",
                    q: "Has the new marketing director been introduced to the team?",
                    options: ["A. He will arrive tomorrow morning.", "B. Yes, I bought the marketing book.", "C. At the grand opening."],
                    ans: "A",
                    explain: "Trả lời gián tiếp: Giám đốc tiếp thị mới đã được giới thiệu chưa? -> A (Sáng mai anh ấy mới tới nơi, ngụ ý là chưa giới thiệu)."
                },
                {
                    id: "p2-10",
                    audioScript: "Could you help me set up the audiovisual equipment for the seminar? (A) I have a client call in five minutes. (B) The audio is very clear. (C) In the reception lobby.",
                    q: "Could you help me set up the audiovisual equipment for the seminar?",
                    options: ["A. I have a client call in five minutes.", "B. The audio is very clear.", "C. In the reception lobby."],
                    ans: "A",
                    explain: "Lời nhờ giúp đỡ -> A (Tôi có cuộc gọi với khách hàng sau 5 phút nữa) từ chối khéo léo theo phong cách ETS."
                },
                {
                    id: "p2-11",
                    audioScript: "What time is the keynote speaker scheduled to begin? (A) Right after the opening remarks. (B) He spoke about renewable energy. (C) Yes, I set the schedule.",
                    q: "What time is the keynote speaker scheduled to begin?",
                    options: ["A. Right after the opening remarks.", "B. He spoke about renewable energy.", "C. Yes, I set the schedule."],
                    ans: "A",
                    explain: "'What time' trả lời mốc thời gian -> A (Ngay sau lời phát biểu khai mạc)."
                },
                {
                    id: "p2-12",
                    audioScript: "You haven't seen my laptop charger anywhere, have you? (A) I left it at home. (B) Check the conference room table. (C) It costs eighty dollars.",
                    q: "You haven't seen my laptop charger anywhere, have you?",
                    options: ["A. I left it at home.", "B. Check the conference room table.", "C. It costs eighty dollars."],
                    ans: "B",
                    explain: "Câu hỏi đuôi tìm đồ vật -> B (Hãy kiểm tra bàn phòng họp xem sao) đưa ra gợi ý tìm kiếm."
                },
                {
                    id: "p2-13",
                    audioScript: "Did you receive the shipment tracking number from the supplier? (A) They said they would email it by noon. (B) The shipping fee was paid. (C) A track and field event.",
                    q: "Did you receive the shipment tracking number from the supplier?",
                    options: ["A. They said they would email it by noon.", "B. The shipping fee was paid.", "C. A track and field event."],
                    ans: "A",
                    explain: "Bẫy trả lời gián tiếp: A (Họ bảo sẽ gửi email trước buổi trưa)."
                },
                {
                    id: "p2-14",
                    audioScript: "How many copies of the training manual should I print? (A) We have twelve participants registered. (B) It's on glossy paper. (C) Yes, print them now.",
                    q: "How many copies of the training manual should I print?",
                    options: ["A. We have twelve participants registered.", "B. It's on glossy paper.", "C. Yes, print them now."],
                    ans: "A",
                    explain: "'How many copies' -> A (Chúng ta có 12 người đăng ký tham dự, ngụ ý in 12 bản)."
                },
                {
                    id: "p2-15",
                    audioScript: "Isn't the warranty on this photocopy machine still valid? (A) Yes, it expires next month. (B) No, he made thirty copies. (C) The warranty department.",
                    q: "Isn't the warranty on this photocopy machine still valid?",
                    options: ["A. Yes, it expires next month.", "B. No, he made thirty copies.", "C. The warranty department."],
                    ans: "A",
                    explain: "Câu hỏi phủ định 'Isn't the warranty... valid?' -> A (Vâng, nó hết hạn vào tháng tới, tức là vẫn còn hiệu lực)."
                },
                {
                    id: "p2-16",
                    audioScript: "Where are we holding the regional branch managers' luncheon? (A) At the Italian bistro across the street. (B) At two o'clock. (C) Yes, I lunch every day.",
                    q: "Where are we holding the regional branch managers' luncheon?",
                    options: ["A. At the Italian bistro across the street.", "B. At two o'clock.", "C. Yes, I lunch every day."],
                    ans: "A",
                    explain: "'Where' -> A (Tại nhà hàng Ý bên kia đường)."
                },
                {
                    id: "p2-17",
                    audioScript: "Who approved the budget increase for the ad campaign? (A) Mr. Henderson signed off on it. (B) The advertisement was effective. (C) Twenty percent higher.",
                    q: "Who approved the budget increase for the ad campaign?",
                    options: ["A. Mr. Henderson signed off on it.", "B. The advertisement was effective.", "C. Twenty percent higher."],
                    ans: "A",
                    explain: "'Who approved' -> A (Mr. Henderson signed off on it = Ông Henderson đã ký duyệt)."
                },
                {
                    id: "p2-18",
                    audioScript: "I really enjoyed your article in the corporate newsletter. (A) Thanks, I spent a lot of time researching it. (B) In the morning paper. (C) Yes, I wrote a letter.",
                    q: "I really enjoyed your article in the corporate newsletter.",
                    options: ["A. Thanks, I spent a lot of time researching it.", "B. In the morning paper.", "C. Yes, I wrote a letter."],
                    ans: "A",
                    explain: "Lời khen ngợi -> A (Cảm ơn, tôi đã dành rất nhiều thời gian nghiên cứu nó)."
                },
                {
                    id: "p2-19",
                    audioScript: "Why hasn't the maintenance team fixed the elevator yet? (A) They are waiting for a replacement part. (B) On the twelfth floor. (C) Yes, take the stairs.",
                    q: "Why hasn't the maintenance team fixed the elevator yet?",
                    options: ["A. They are waiting for a replacement part.", "B. On the twelfth floor.", "C. Yes, take the stairs."],
                    ans: "A",
                    explain: "'Why' -> A (Họ đang đợi linh kiện thay thế)."
                },
                {
                    id: "p2-20",
                    audioScript: "Do you want to carpool together to the branch opening? (A) That would save us gas and parking fees. (B) The car is blue. (C) Opened last Friday.",
                    q: "Do you want to carpool together to the branch opening?",
                    options: ["A. That would save us gas and parking fees.", "B. The car is blue.", "C. Opened last Friday."],
                    ans: "A",
                    explain: "Lời rủ đi chung xe (carpool) -> A (Thế thì tiết kiệm tiền xăng và phí gửi xe quá)."
                },
                {
                    id: "p2-21",
                    audioScript: "When can we expect the final draft of the contract? (A) By the end of business today. (B) The contract was five pages. (C) Yes, draft it carefully.",
                    q: "When can we expect the final draft of the contract?",
                    options: ["A. By the end of business today.", "B. The contract was five pages.", "C. Yes, draft it carefully."],
                    ans: "A",
                    explain: "'When' -> A (Trước giờ tan làm hôm nay)."
                },
                {
                    id: "p2-22",
                    audioScript: "Which vendor submitted the lowest bid for catering? (A) Green Leaf Bakery offered the best price. (B) Yes, the food was delicious. (C) At noon tomorrow.",
                    q: "Which vendor submitted the lowest bid for catering?",
                    options: ["A. Green Leaf Bakery offered the best price.", "B. Yes, the food was delicious.", "C. At noon tomorrow."],
                    ans: "A",
                    explain: "'Which vendor submitted lowest bid' -> A (Green Leaf Bakery đưa ra mức giá tốt nhất)."
                },
                {
                    id: "p2-23",
                    audioScript: "Are you planning to hire a full-time assistant or an intern? (A) We haven't finalized the department budget yet. (B) He is a very capable assistant. (C) At the university job fair.",
                    q: "Are you planning to hire a full-time assistant or an intern?",
                    options: ["A. We haven't finalized the department budget yet.", "B. He is a very capable assistant.", "C. At the university job fair."],
                    ans: "A",
                    explain: "Bẫy trả lời gián tiếp: Thuê toàn thời gian hay thực tập sinh? -> A (Chúng tôi chưa chốt ngân sách phòng ban nên chưa quyết định)."
                },
                {
                    id: "p2-24",
                    audioScript: "How do I log into the remote working portal? (A) IT sent instructions in your welcome email. (B) Yes, I work remotely on Mondays. (C) The log was delivered.",
                    q: "How do I log into the remote working portal?",
                    options: ["A. IT sent instructions in your welcome email.", "B. Yes, I work remotely on Mondays.", "C. The log was delivered."],
                    ans: "A",
                    explain: "'How do I log into...' -> A (IT đã gửi hướng dẫn trong email chào mừng của bạn)."
                },
                {
                    id: "p2-25",
                    audioScript: "The annual shareholder meeting has been rescheduled, hasn't it? (A) Yes, it's now set for next Thursday. (B) I met the shareholders yesterday. (C) In the main boardroom.",
                    q: "The annual shareholder meeting has been rescheduled, hasn't it?",
                    options: ["A. Yes, it's now set for next Thursday.", "B. I met the shareholders yesterday.", "C. In the main boardroom."],
                    ans: "A",
                    explain: "Câu hỏi đuôi xác nhận đổi lịch -> A (Vâng, giờ chuyển sang thứ Năm tuần sau)."
                }
            ]
        },

        5: {
            title: "Part 5: Incomplete Sentences (Điền từ vào câu)",
            totalQuestions: 30,
            timeLimitMinutes: 18,
            badge: "Reading · 30 câu Ngữ pháp & Từ vựng ETS",
            optionsCount: 4,
            questions: [
                {
                    id: "p5-1",
                    q: "The senior marketing director approved the _______ budget proposal before submitting it to executive leadership.",
                    options: ["A. revise", "B. revised", "C. revision", "D. revising"],
                    ans: "B",
                    explain: "Cần tính từ (phân từ V-ed mang nghĩa bị động 'đã được chỉnh sửa') bổ nghĩa cho cụm danh từ 'budget proposal' -> Chọn B (revised)."
                },
                {
                    id: "p5-2",
                    q: "A qualified customer service _______ will contact you within two business days to confirm your appointment.",
                    options: ["A. represent", "B. representative", "C. representing", "D. representation"],
                    ans: "B",
                    explain: "Bẫy từ loại: 'representative' đuôi -ive nhưng là danh từ chỉ người đếm được (người đại diện) -> Chọn B."
                },
                {
                    id: "p5-3",
                    q: "_______ unexpected adverse weather conditions, the cargo vessel arrived at the terminal on schedule.",
                    options: ["A. Although", "B. Even though", "C. Despite", "D. Because"],
                    ans: "C",
                    explain: "Phía sau là cụm danh từ 'unexpected adverse weather conditions' (không có động từ chia thì) -> Cần giới từ 'Despite' (Mặc dù). Chọn C."
                },
                {
                    id: "p5-4",
                    q: "All factory personnel are strictly required to comply _______ updated workplace safety standards.",
                    options: ["A. with", "B. to", "C. on", "D. for"],
                    ans: "A",
                    explain: "Cụm cố định (Collocation): 'comply with' = tuân thủ theo quy định. Chọn A."
                },
                {
                    id: "p5-5",
                    q: "Passengers _______ flights to Frankfurt should proceed immediately to Gate 22 for priority boarding.",
                    options: ["A. board", "B. boarding", "C. boarded", "D. are boarding"],
                    ans: "B",
                    explain: "Câu đã có động từ chính 'should proceed'. Chỗ trống rút gọn mệnh đề quan hệ chủ động 'who are boarding' -> V-ing 'boarding'. Chọn B."
                },
                {
                    id: "p5-6",
                    q: "The executive board recommends that each project supervisor _______ a risk assessment by Friday.",
                    options: ["A. conducts", "B. conduct", "C. conducted", "D. will conduct"],
                    ans: "B",
                    explain: "Thể giả định (Subjunctive): recommend that + S + (should) + V-nguyên mẫu không 's/es' -> Chọn B (conduct)."
                },
                {
                    id: "p5-7",
                    q: "Ms. Tanaka delivered her presentation _______ and answered all questions with remarkable clarity.",
                    options: ["A. confident", "B. confidence", "C. confidently", "D. confidential"],
                    ans: "C",
                    explain: "Bổ nghĩa cho động từ 'delivered' cần một trạng từ chỉ cách thức -> Chọn C (confidently = một cách tự tin)."
                },
                {
                    id: "p5-8",
                    q: "Customers who purchase more than three items online are _______ for free express delivery.",
                    options: ["A. eligible", "B. eligibility", "C. eligibly", "D. eligibleness"],
                    ans: "A",
                    explain: "Cấu trúc: 'be eligible for + N' (đủ điều kiện hưởng cái gì) -> Chọn tính từ A (eligible)."
                },
                {
                    id: "p5-9",
                    q: "The newly renovated auditorium is spacious _______ to accommodate over five hundred conference attendees.",
                    options: ["A. too", "B. very", "C. enough", "D. so"],
                    ans: "C",
                    explain: "Cấu trúc: 'Adj + enough + to V' (đủ... để làm gì) -> Chọn C (enough)."
                },
                {
                    id: "p5-10",
                    q: "Neither the team leader _______ the department manager was available to sign the authorization form.",
                    options: ["A. or", "B. nor", "C. and", "D. but"],
                    ans: "B",
                    explain: "Liên từ tương hỗ: 'Neither ... nor ...' (Không... mà cũng không...) -> Chọn B."
                },
                {
                    id: "p5-11",
                    q: "The warranty covers parts and labor for two years, _______ customers maintain proof of original purchase.",
                    options: ["A. provided that", "B. so that", "C. in case of", "D. despite"],
                    ans: "A",
                    explain: "'provided that' = miễn là / với điều kiện là (+ mệnh đề S+V). Chọn A."
                },
                {
                    id: "p5-12",
                    q: "Dr. Gomez has earned a worldwide _______ for his groundbreaking research in sustainable agriculture.",
                    options: ["A. reputation", "B. repetition", "C. replacement", "D. requirement"],
                    ans: "A",
                    explain: "Cụm từ 'earn a reputation for' = tạo dựng được danh tiếng/uy tín nhờ... Chọn A (reputation)."
                },
                {
                    id: "p5-13",
                    q: "The updated software program operates much more _______ than the previous legacy system.",
                    options: ["A. efficient", "B. efficiently", "C. efficiency", "D. efficiencies"],
                    ans: "B",
                    explain: "Bổ nghĩa cho động từ 'operates' trong so sánh hơn 'much more ...' cần trạng từ -> Chọn B (efficiently)."
                },
                {
                    id: "p5-14",
                    q: "_______ we received the signed agreement earlier, we could have dispatched the goods yesterday.",
                    options: ["A. Had", "B. If", "C. Were", "D. Did"],
                    ans: "A",
                    explain: "Đảo ngữ câu điều kiện loại 3: 'Had + S + V3' thay thế cho 'If + S + had + V3' -> Chọn A (Had)."
                },
                {
                    id: "p5-15",
                    q: "Please review the attached contract carefully before putting your _______ on the signature line.",
                    options: ["A. sign", "B. signature", "C. signatory", "D. signatured"],
                    ans: "B",
                    explain: "Đứng sau tính từ sở hữu 'your' cần một danh từ -> Chọn B (signature = chữ ký)."
                },
                {
                    id: "p5-16",
                    q: "The research and development budget was increased by twenty percent to _______ new product design.",
                    options: ["A. facilitate", "B. facility", "C. facilitation", "D. facilitator"],
                    ans: "A",
                    explain: "Sau 'to' chỉ mục đích cần động từ nguyên mẫu -> Chọn A (facilitate = tạo điều kiện thuận lợi)."
                },
                {
                    id: "p5-17",
                    q: "All employees must wear protective headgear at all times _______ inside the construction zone.",
                    options: ["A. while", "B. during", "C. between", "D. throughout"],
                    ans: "A",
                    explain: "'while + prepositional phrase/V-ing' (trong khi đang ở bên trong...). 'during' đi với danh từ, không đi trực tiếp với cụm giới từ 'inside...'. Chọn A."
                },
                {
                    id: "p5-18",
                    q: "Mr. Patel is regarded as one of the most _______ financial consultants in the metropolitan area.",
                    options: ["A. know", "B. knowledge", "C. knowledgeable", "D. knowledgeably"],
                    ans: "C",
                    explain: "Sau 'the most' cần tính từ bổ nghĩa cho danh từ 'consultants' -> Chọn C (knowledgeable = am hiểu, uyên bác)."
                },
                {
                    id: "p5-19",
                    q: "Due to heavy traffic congestion on Highway 9, Ms. Jenkins arrived _______ late for the board briefing.",
                    options: ["A. slightly", "B. slight", "C. slightness", "D. slighter"],
                    ans: "A",
                    explain: "Bổ nghĩa cho tính từ/trạng từ 'late' cần một trạng từ mức độ -> Chọn A (slightly late = trễ một chút)."
                },
                {
                    id: "p5-20",
                    q: "The hotel offers complimentary shuttle service to and _______ the international airport every hour.",
                    options: ["A. from", "B. of", "C. by", "D. with"],
                    ans: "A",
                    explain: "Cụm từ 'to and from' = đến và đi từ... Chọn A (from)."
                },
                {
                    id: "p5-21",
                    q: "Online orders placed after 3:00 P.M. will be processed on the _______ business day.",
                    options: ["A. follow", "B. following", "C. followed", "D. follower"],
                    ans: "B",
                    explain: "Cụm danh từ 'on the following business day' = vào ngày làm việc tiếp theo. Chọn B."
                },
                {
                    id: "p5-22",
                    q: "The keynote speaker was delayed, but the audience waited _______ until he arrived.",
                    options: ["A. patience", "B. patient", "C. patiently", "D. patientless"],
                    ans: "C",
                    explain: "Bổ nghĩa cho động từ 'waited' cần một trạng từ -> Chọn C (patiently = kiên nhẫn)."
                },
                {
                    id: "p5-23",
                    q: "The company handbook clearly outlines policies _______ paid leave, overtime, and medical benefits.",
                    options: ["A. regarding", "B. regard", "C. regards", "D. regarded"],
                    ans: "A",
                    explain: "'regarding' là giới từ mang nghĩa 'liên quan đến / về việc...'. Chọn A."
                },
                {
                    id: "p5-24",
                    q: "A formal _______ will be issued once the internal investigation is finalized.",
                    options: ["A. state", "B. statement", "C. stated", "D. stately"],
                    ans: "B",
                    explain: "Sau mạo từ và tính từ 'A formal' cần danh từ -> Chọn B (statement = bản tuyên bố/thông cáo)."
                },
                {
                    id: "p5-25",
                    q: "The warehouse supervisor noticed that several shipments were _______ packaged and damaged.",
                    options: ["A. improper", "B. improperly", "C. impropriety", "D. improperness"],
                    ans: "B",
                    explain: "Bổ nghĩa cho phân từ quá khứ 'packaged' cần trạng từ -> Chọn B (improperly = không đúng quy cách)."
                },
                {
                    id: "p5-26",
                    q: "Anyone _______ to change their shift schedule must notify human resources seventy-two hours in advance.",
                    options: ["A. wish", "B. wished", "C. wishing", "D. wishes"],
                    ans: "C",
                    explain: "Rút gọn mệnh đề quan hệ chủ động sau đại từ 'Anyone' (who wishes -> wishing). Chọn C."
                },
                {
                    id: "p5-27",
                    q: "The CEO praised the marketing team for their _______ efforts in launching the brand campaign.",
                    options: ["A. exceptional", "B. except", "C. exceptionally", "D. exception"],
                    ans: "A",
                    explain: "Đứng trước danh từ 'efforts' cần tính từ -> Chọn A (exceptional = xuất chúng, phi thường)."
                },
                {
                    id: "p5-28",
                    q: "To ensure data integrity, always create a backup copy of your database before _______ the software.",
                    options: ["A. upgrade", "B. upgrading", "C. upgraded", "D. upgradable"],
                    ans: "B",
                    explain: "Sau giới từ 'before' cần danh động từ V-ing -> Chọn B (upgrading)."
                },
                {
                    id: "p5-29",
                    q: "The facility manager inspected all smoke detectors to confirm that they were _______ properly.",
                    options: ["A. function", "B. functioning", "C. functional", "D. functionally"],
                    ans: "B",
                    explain: "Thì quá khứ tiếp diễn: 'were functioning properly' (đang hoạt động tốt). Chọn B."
                },
                {
                    id: "p5-30",
                    q: "Tickets for the international summit sold out within minutes _______ unprecedented global demand.",
                    options: ["A. because of", "B. even though", "C. so that", "D. in order to"],
                    ans: "A",
                    explain: "Phía sau là cụm danh từ 'unprecedented global demand' chỉ lý do -> Chọn giới từ A (because of = bởi vì)."
                }
            ]
        },

        6: {
            title: "Part 6: Text Completion (Điền đoạn văn)",
            totalQuestions: 16,
            timeLimitMinutes: 10,
            badge: "Reading · 4 đoạn văn hoàn chỉnh (16 câu)",
            optionsCount: 4,
            questions: [
                {
                    id: "p6-1",
                    passage: "<strong>To:</strong> All Regional Staff<br><strong>From:</strong> IT Support Directorate<br><strong>Date:</strong> October 24<br>Please be advised that our primary cloud servers will undergo scheduled maintenance this coming Saturday from 11:00 P.M. to 3:00 A.M. During this maintenance window, access to the internal enterprise portal will be _______ unavailable.",
                    q: "Chọn từ loại phù hợp nhất điền vào chỗ trống:",
                    options: ["A. temporary", "B. temporarily", "C. temporariness", "D. temporize"],
                    ans: "B",
                    explain: "Bổ nghĩa cho tính từ 'unavailable' cần một trạng từ -> Chọn B (temporarily = tạm thời)."
                },
                {
                    id: "p6-2",
                    passage: "<strong>To:</strong> All Regional Staff (Tiếp theo)<br>All unsaved changes in cloud documents must be saved before 10:45 P.M. to avoid accidental data loss. [ 2 ]. If you experience persistent technical difficulties on Monday morning, please contact the IT hotline at extension 4402.",
                    q: "Chọn câu điền vào chỗ trống [ 2 ] liền mạch và hợp lý nhất:",
                    options: [
                        "A. Normal system operations will resume automatically at 3:30 A.M. on Sunday.",
                        "B. We regret to inform you that all accounts have been permanently closed.",
                        "C. Please return your assigned laptop to the inventory depot immediately.",
                        "D. The building cafeteria will offer a twenty percent discount on beverages."
                    ],
                    ans: "A",
                    explain: "Mạch văn thông báo bảo trì: Sau khi nhắc lưu tài liệu trước khi bảo trì, câu tiếp theo thông báo thời gian hệ thống hoạt động trở lại bình thường (A)."
                },
                {
                    id: "p6-3",
                    passage: "<strong>To:</strong> All Regional Staff (Tiếp theo)<br>We apologize for any _______ this temporary shutdown may cause to your workflow.",
                    q: "Chọn từ vựng phù hợp nhất:",
                    options: ["A. convenience", "B. inconvenience", "C. celebration", "D. permission"],
                    ans: "B",
                    explain: "Cụm từ quen thuộc trong thông báo: 'apologize for any inconvenience' (xin lỗi vì bất kỳ sự bất tiện nào). Chọn B."
                },
                {
                    id: "p6-4",
                    passage: "<strong>To:</strong> All Regional Staff (Tiếp theo)<br>Thank you in advance for your _______ and cooperation.",
                    q: "Chọn từ vựng phù hợp nhất:",
                    options: ["A. patient", "B. patience", "C. patiently", "D. inpatient"],
                    ans: "B",
                    explain: "Sau tính từ sở hữu 'your' và song hành với danh từ 'cooperation' cần một danh từ -> Chọn B (patience)."
                }
            ]
        },

        7: {
            title: "Part 7: Reading Comprehension (Đọc hiểu văn bản)",
            totalQuestions: 20,
            timeLimitMinutes: 25,
            badge: "Reading · Đoạn đơn & Đoạn kép chuẩn ETS",
            optionsCount: 4,
            questions: [
                {
                    id: "p7-1",
                    passage: "<strong>MEMORANDUM</strong><br><strong>To:</strong> Department Managers<br><strong>From:</strong> Facilities Operation Office<br><strong>Subject:</strong> Parking Garage Renovation<br>Starting Monday, November 3, the underground staff parking garage will be temporarily closed for concrete sealing and lighting installation. During this two-week renovation, employees may park in the adjacent municipal lot on Elm Street at no cost by displaying their company parking permit on the dashboard.",
                    q: "According to the memo, where are employees instructed to park during the renovation?",
                    options: [
                        "A. In the executive garage",
                        "B. In the municipal lot on Elm Street",
                        "C. Across from the shopping center",
                        "D. In the underground basement"
                    ],
                    ans: "B",
                    explain: "Bài đọc ghi rõ: 'employees may park in the adjacent municipal lot on Elm Street at no cost'. Chọn B."
                },
                {
                    id: "p7-2",
                    passage: "<strong>MEMORANDUM (Tiếp theo)</strong><br>What must employees do to park in the municipal lot without paying?",
                    q: "What must employees do to qualify for free parking at the municipal lot?",
                    options: [
                        "A. Pay an hourly fee with a credit card",
                        "B. Register their license plate online each morning",
                        "C. Display their company parking permit on the vehicle dashboard",
                        "D. Arrive before seven o'clock in the morning"
                    ],
                    ans: "C",
                    explain: "Chi tiết trong bài: 'by displaying their company parking permit on the dashboard'. Chọn C."
                },
                {
                    id: "p7-3",
                    passage: "<strong>CANCELLATION & REFUND POLICY NOTICE</strong><br>Full tuition refunds for professional workshops will be granted only if written cancellation requests are submitted at least 72 hours prior to the scheduled session. Cancellations received less than 72 hours before an event are non-refundable; however, attendees will be issued a credit voucher valid for any workshop held within the subsequent six months.",
                    q: "What is TRUE regarding workshop cancellations made less than 72 hours before the event?",
                    options: [
                        "A. Participants will receive a complete cash refund.",
                        "B. The registration fee is entirely forfeited with no alternatives.",
                        "C. Attendees are provided a credit voucher valid for six months.",
                        "D. The session will automatically be rescheduled to the following week."
                    ],
                    ans: "C",
                    explain: "Paraphrase: 'attendees will be issued a credit voucher valid for any workshop held within the subsequent six months' tương đương với C."
                }
            ]
        }
    },

    // Chế độ: 'practice' (Luyện tập - replay, gợi ý, phản hồi ngay) | 'exam' (Thi thật - 1 lần nghe, ẩn chữ P1/P2)
    mode: 'practice',
    flagged: {},
    player: null,

    // Khởi động bài luyện trọn vẹn cả Part hoặc Thi thử Mock Test
    startPart(partNumber, chosenMode = 'practice') {
        this.currentPart = isNaN(parseInt(partNumber, 10)) ? partNumber : parseInt(partNumber, 10);
        this.mode = chosenMode === 'exam' ? 'exam' : 'practice';
        this.flagged = {};

        // Nạp ngân hàng câu hỏi chuẩn ETS 2026 từ ListeningDatabaseV2
        if (window.ListeningDatabaseV2) {
            if (this.currentPart === 'mock_full' || this.currentPart === 100) {
                this.partDatasets['mock_full'] = {
                    title: "Thi Thử Luyện Nghe Toàn Diện (Full Mock Test - 100 Câu Chuẩn ETS)",
                    totalQuestions: 100,
                    timeLimitMinutes: 45,
                    badge: "ETS Mock Test · 100 câu · 45 phút",
                    optionsCount: 4,
                    questions: window.ListeningDatabaseV2.getAllMockTestQuestions()
                };
            } else if (this.currentPart === 'mock_mini' || this.currentPart === 25) {
                this.partDatasets['mock_mini'] = {
                    title: "Thi Thử Nhanh (Mini Mock Test - 25 Câu Rút Gọn)",
                    totalQuestions: 25,
                    timeLimitMinutes: 12,
                    badge: "ETS Mini Test · 25 câu · 12 phút",
                    optionsCount: 4,
                    questions: window.ListeningDatabaseV2.getMiniTestQuestions()
                };
            } else if (this.currentPart === 'adaptive') {
                this.partDatasets['adaptive'] = {
                    title: "Luyện Nghe Thích Ứng AI (Trọng Tâm Bẫy Thường Sai)",
                    totalQuestions: 20,
                    timeLimitMinutes: 15,
                    badge: "Adaptive AI · 20 câu bẫy trọng điểm",
                    optionsCount: 4,
                    questions: window.ListeningDashboard ? window.ListeningDashboard.getAdaptiveQuestions(20) : window.ListeningDatabaseV2.getMiniTestQuestions()
                };
            } else if (this.currentPart === 1) {
                this.partDatasets[1] = {
                    title: "Part 1: Photographs (Mô tả hình ảnh)",
                    totalQuestions: 6,
                    timeLimitMinutes: 6,
                    badge: "Listening · 6 câu chuẩn ETS",
                    optionsCount: 4,
                    questions: window.ListeningDatabaseV2.getFlattenedQuestions(1)
                };
            } else if (this.currentPart === 2) {
                this.partDatasets[2] = {
                    title: "Part 2: Question-Response (Hỏi & Đáp)",
                    totalQuestions: 25,
                    timeLimitMinutes: 12,
                    badge: "Listening · 25 câu chuẩn ETS (3 đáp án)",
                    optionsCount: 3,
                    questions: window.ListeningDatabaseV2.getFlattenedQuestions(2)
                };
            } else if (this.currentPart === 3) {
                this.partDatasets[3] = {
                    title: "Part 3: Conversations (Đoạn hội thoại đa giọng)",
                    totalQuestions: 39,
                    timeLimitMinutes: 18,
                    badge: "Listening · 39 câu (13 hội thoại) chuẩn ETS",
                    optionsCount: 4,
                    questions: window.ListeningDatabaseV2.getFlattenedQuestions(3)
                };
            } else if (this.currentPart === 4) {
                this.partDatasets[4] = {
                    title: "Part 4: Short Talks (Bài nói ngắn độc thoại)",
                    totalQuestions: 30,
                    timeLimitMinutes: 15,
                    badge: "Listening · 30 câu (10 bài nói) chuẩn ETS",
                    optionsCount: 4,
                    questions: window.ListeningDatabaseV2.getFlattenedQuestions(4)
                };
            }
        }

        const dataset = this.partDatasets[this.currentPart] || this.partDatasets[1];
        this.activeQuestions = [...dataset.questions];
        this.currentIndex = 0;
        this.userAnswers = {};
        this.isSubmitted = false;
        this.timeRemaining = dataset.timeLimitMinutes * 60;

        // Render modal luyện tập full-viewport
        this.renderPracticeModal(dataset);
        this.startTimer();
    },

    // Chuyển đổi chế độ Học vs Thi
    setMode(newMode) {
        if (this.isSubmitted) return;
        this.mode = newMode === 'exam' ? 'exam' : 'practice';
        if (this.player) {
            this.player.setMode(this.mode);
        }
        const dataset = this.partDatasets[this.currentPart] || this.partDatasets[1];
        this.renderPracticeModal(dataset);
        showToast(this.mode === 'exam' ? '⏱️ Đã chuyển sang Chế độ Thi: 1 lần nghe, ẩn chữ Part 1 & 2!' : '🎓 Đã chuyển sang Chế độ Học: Replay tự do, xem gợi ý & phản hồi ngay!');
    },

    // Đánh dấu xem lại
    toggleFlagCurrent() {
        if (this.flagged[this.currentIndex]) {
            delete this.flagged[this.currentIndex];
            showToast('Đã bỏ đánh dấu câu này');
        } else {
            this.flagged[this.currentIndex] = true;
            showToast('🚩 Đã đánh dấu xem lại câu này');
        }
        this.renderCurrentQuestion();
    },

    // Render giao diện Modal luyện toàn bộ Part (Thiết kế Full-Viewport không bao giờ bị cắt)
    renderPracticeModal(dataset) {
        let modal = document.getElementById('fullPartPracticeModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'fullPartPracticeModal';
            modal.className = 'fixed inset-0 z-50 bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-3 overflow-hidden';
            document.body.appendChild(modal);
        }

        const isExam = this.mode === 'exam';

        modal.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-none sm:rounded-[28px] w-full max-w-5xl h-full sm:h-[94vh] flex flex-col shadow-2xl border-0 sm:border border-slate-200 dark:border-slate-800 overflow-hidden animate-in fade-in duration-200">
                
                <!-- Fixed Header Top Bar -->
                <div class="px-4 py-3 sm:px-6 sm:py-3.5 bg-gradient-to-r ${this.getPartGradient(this.currentPart)} text-white flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-sm">
                    <div class="space-y-0.5">
                        <div class="flex items-center gap-2">
                            <span class="px-2.5 py-0.5 rounded-full bg-white/20 text-[10.5px] font-black uppercase tracking-wider">
                                ⚡ LUYỆN TOÀN PART CHUẨN ETS
                            </span>
                            <span class="text-[11px] font-bold text-white/90 hidden sm:inline">${dataset.badge}</span>
                        </div>
                        <h2 class="text-sm sm:text-base font-black truncate max-w-xs sm:max-w-md">${dataset.title}</h2>
                    </div>

                    <!-- Mode Toggle Switch & Timer -->
                    <div class="flex items-center gap-2.5">
                        <!-- Mode Switch Buttons -->
                        <div class="bg-black/20 p-1 rounded-xl flex items-center gap-1 border border-white/10">
                            <button type="button" onclick="FullPartPracticeEngine.setMode('practice')" class="px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold transition flex items-center gap-1 ${!isExam ? 'bg-white text-slate-900 shadow-xs' : 'text-white/80 hover:text-white'}">
                                <i class="fa-solid fa-graduation-cap"></i>
                                <span class="hidden md:inline">Học tập</span>
                            </button>
                            <button type="button" onclick="FullPartPracticeEngine.setMode('exam')" class="px-2.5 py-1 rounded-lg text-[10.5px] font-extrabold transition flex items-center gap-1 ${isExam ? 'bg-rose-600 text-white shadow-xs' : 'text-white/80 hover:text-white'}">
                                <i class="fa-solid fa-stopwatch"></i>
                                <span class="hidden md:inline">Thi thật</span>
                            </button>
                        </div>

                        <!-- Countdown Timer -->
                        <div class="px-3 py-1.5 rounded-xl bg-black/25 backdrop-blur-md border border-white/20 text-white font-mono font-black text-xs sm:text-sm flex items-center gap-1.5">
                            <i class="fa-regular fa-clock"></i>
                            <span id="fullPartTimerText">${this.formatTime(this.timeRemaining)}</span>
                        </div>

                        <!-- Close Exit Button -->
                        <button onclick="FullPartPracticeEngine.confirmExit()" class="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition cursor-pointer" title="Thoát bài luyện">
                            <i class="fa-solid fa-xmark text-sm"></i>
                        </button>
                    </div>
                </div>

                <!-- Horizontal Question Navigation Pills Bar -->
                <div class="px-3 sm:px-5 py-2 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center gap-1.5 overflow-x-auto shrink-0 scrollbar-none" id="fullPartPillsBar">
                    ${this.activeQuestions.map((q, idx) => {
                        const isAnswered = this.userAnswers[idx] !== undefined;
                        const isFlagged = this.flagged[idx];
                        const isActive = idx === this.currentIndex;

                        let pillClass = 'w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-extrabold text-[11px] shrink-0 transition flex items-center justify-center relative cursor-pointer ';
                        if (isActive) {
                            pillClass += 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-sm';
                        } else if (isAnswered) {
                            pillClass += 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300';
                        } else {
                            pillClass += 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100';
                        }

                        return `
                            <button onclick="FullPartPracticeEngine.jumpToQuestion(${idx})" id="nav-pill-${idx}" class="${pillClass}">
                                <span>${idx + 1}</span>
                                ${isFlagged ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900"></span>' : ''}
                            </button>
                        `;
                    }).join('')}
                </div>

                <!-- Main Question Content Area (Scrollable with Bottom Padding to never cut content) -->
                <div class="px-4 py-4 sm:px-6 sm:py-5 space-y-4 overflow-y-auto flex-1 pb-16" id="fullPartQuestionArea">
                    <!-- Populated via renderCurrentQuestion() -->
                </div>

                <!-- Fixed Footer Action Bar -->
                <div class="px-4 py-3 sm:px-6 sm:py-3.5 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2.5 shrink-0">
                    <div class="flex items-center gap-2">
                        <span class="text-xs font-bold text-slate-500 dark:text-slate-400">
                            Đã làm: <span id="fullPartAnsweredCounter" class="text-indigo-600 dark:text-indigo-400 font-black">0</span> / ${this.activeQuestions.length} câu
                        </span>
                        <button type="button" onclick="FullPartPracticeEngine.toggleFlagCurrent()" class="px-2.5 py-1 rounded-lg text-[11px] font-bold border transition flex items-center gap-1 ${this.flagged[this.currentIndex] ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-amber-50'}">
                            <i class="fa-solid fa-flag text-[10px]"></i>
                            <span>${this.flagged[this.currentIndex] ? 'Đã đánh dấu' : 'Để sau'}</span>
                        </button>
                    </div>

                    <div class="flex items-center gap-2">
                        <button onclick="FullPartPracticeEngine.prevQuestion()" id="btnPrevPartQ" class="px-3.5 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold transition flex items-center gap-1 cursor-pointer">
                            <i class="fa-solid fa-chevron-left text-[10px]"></i>
                            <span class="hidden sm:inline">Câu trước</span>
                        </button>
                        <button onclick="FullPartPracticeEngine.nextQuestion()" id="btnNextPartQ" class="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer">
                            <span class="hidden sm:inline">Câu sau</span>
                            <i class="fa-solid fa-chevron-right text-[10px]"></i>
                        </button>
                        <button onclick="FullPartPracticeEngine.submitPart()" class="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-md shadow-emerald-600/30 transition flex items-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-check"></i>
                            <span>Nộp bài & Chấm điểm</span>
                        </button>
                    </div>
                </div>
            </div>
        `;

        modal.classList.remove('hidden');
        this.renderCurrentQuestion();
    },

    // Render câu hỏi hiện tại với toàn bộ logic ETS 2026
    renderCurrentQuestion() {
        const area = document.getElementById('fullPartQuestionArea');
        if (!area) return;

        const q = this.activeQuestions[this.currentIndex];
        const selected = this.userAnswers[this.currentIndex];
        const isExam = this.mode === 'exam';
        const isAnswered = selected !== undefined;
        const isPart1or2 = (q && (q.part === 1 || q.part === 2)) || this.currentPart === 1 || this.currentPart === 2;

        // Cập nhật thanh Navigation Pills
        this.activeQuestions.forEach((_, idx) => {
            const pill = document.getElementById(`nav-pill-${idx}`);
            if (!pill) return;
            const answered = this.userAnswers[idx] !== undefined;
            const flagged = this.flagged[idx];
            const active = idx === this.currentIndex;

            let c = 'w-7 h-7 sm:w-8 sm:h-8 rounded-xl font-extrabold text-[11px] shrink-0 transition flex items-center justify-center relative cursor-pointer ';
            if (active) {
                c += 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-sm';
            } else if (answered) {
                c += 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300';
            } else {
                c += 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-100';
            }
            pill.className = c;
            pill.innerHTML = `<span>${idx + 1}</span>${flagged ? '<span class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white dark:border-slate-900"></span>' : ''}`;
        });

        // Cập nhật bộ đếm đã làm
        const counter = document.getElementById('fullPartAnsweredCounter');
        if (counter) counter.textContent = Object.keys(this.userAnswers).length;

        // Nội dung câu hỏi theo chuẩn ETS
        // Ở Part 1 & 2: KHÔNG HIỆN CHỮ CÂU HỎI & ĐÁP ÁN TRƯỚC KHI CHỌN (chỉ hiện A, B, C hoặc A, B, C, D)
        const hideTextBeforeAnswer = isPart1or2 && !this.isSubmitted && (!isAnswered || isExam);

        area.innerHTML = `
            <div class="space-y-4 animate-in fade-in duration-150">
                
                <!-- Status Row -->
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2">
                        <span class="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-black">
                            Câu ${this.currentIndex + 1} / ${this.activeQuestions.length}
                        </span>
                        ${q.accent ? `
                            <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10.5px] font-bold">
                                🎙️ Accent: ${q.accent}
                            </span>
                        ` : ''}
                        ${q.difficulty ? `
                            <span class="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300 text-[10.5px] font-bold">
                                Level: ${q.difficulty}
                            </span>
                        ` : ''}
                    </div>

                    <button onclick="openAITutorModal('Giải thích chi tiết câu ${this.currentIndex + 1} Part ${this.currentPart}:\\n${q.q.replace(/'/g, "\\'")}', '${(q.explanation_vi || q.explain || '').replace(/'/g, "\\'")}')" class="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                        <i class="fa-solid fa-robot"></i>
                        <span>Gia Sư AI</span>
                    </button>
                </div>

                <!-- Unified Neural ToeicAudioPlayer Component Container -->
                <div id="fullPartAudioPlayerContainer"></div>

                <!-- Part 1 Photograph Display with Zoom -->
                ${q.image ? `
                    <div class="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-sm max-w-xl mx-auto">
                        <img src="${q.image}" alt="${q.alt_text || 'TOEIC Part 1 Photograph'}" class="w-full h-56 sm:h-64 object-cover cursor-zoom-in" onclick="window.open(this.src, '_blank')" loading="lazy" onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80';">
                    </div>
                ` : ''}

                <!-- Graphic Table / Chart (Part 3/4) -->
                ${q.graphic ? `
                    <div class="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 space-y-2 max-w-xl mx-auto">
                        <div class="text-xs font-bold text-teal-900 dark:text-teal-300 flex items-center gap-1.5">
                            <i class="fa-solid fa-table-cells"></i>
                            <span>${q.graphic.title || 'Bảng biểu thông tin đính kèm'}</span>
                        </div>
                        <div class="overflow-x-auto rounded-xl border border-teal-200/80 dark:border-slate-700">
                            <table class="w-full text-xs text-left">
                                <thead class="bg-teal-100/70 dark:bg-slate-700 text-teal-950 dark:text-teal-200 uppercase text-[10px] font-bold">
                                    <tr>
                                        ${q.graphic.columns.map(c => `<th class="px-3 py-1.5">${c}</th>`).join('')}
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-teal-200/50 dark:divide-slate-700 bg-white dark:bg-slate-800">
                                    ${q.graphic.rows.map(r => `
                                        <tr class="hover:bg-teal-50/50 dark:hover:bg-slate-700/50">
                                            ${r.map(cell => `<td class="px-3 py-1.5 font-medium">${cell}</td>`).join('')}
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ` : ''}

                <!-- Reading Passage Display (Part 6, Part 7) -->
                ${q.passage && !q.audio_url ? `
                    <div class="p-4 rounded-2xl bg-amber-50/70 dark:bg-slate-800 border border-amber-200/80 dark:border-slate-700 text-xs sm:text-[13px] text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                        ${q.passage}
                    </div>
                ` : ''}

                <!-- Question Statement (Ẩn ở Part 1 & 2 khi chưa trả lời hoặc ở chế độ thi) -->
                <div class="p-3.5 sm:p-4 rounded-2xl ${hideTextBeforeAnswer ? 'bg-indigo-50/60 dark:bg-slate-800/60 border border-indigo-200/80 dark:border-slate-700 text-indigo-900 dark:text-indigo-300' : 'bg-slate-50 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700 text-slate-900 dark:text-white'} text-sm font-bold leading-relaxed">
                    ${hideTextBeforeAnswer ? (
                        (this.currentPart === 1 || q.part === 1) ? `
                            <div class="flex items-center gap-2 text-xs font-extrabold text-indigo-800 dark:text-indigo-300">
                                <i class="fa-solid fa-headphones animate-pulse"></i>
                                <span>Quan sát bức ảnh và lắng nghe 4 phương án (A, B, C, D) để chọn mô tả đúng:</span>
                            </div>
                        ` : `
                            <div class="flex items-center gap-2 text-xs font-extrabold text-fuchsia-800 dark:text-fuchsia-300">
                                <i class="fa-solid fa-ear-listen animate-pulse"></i>
                                <span>Lắng nghe câu hỏi và 3 câu phản hồi để chọn đáp án (A, B hoặc C):</span>
                            </div>
                        `
                    ) : (
                        ((this.currentPart === 2 || q.part === 2) && isAnswered) ? `
                            <div class="space-y-1">
                                <div class="text-[11px] font-bold uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400 flex items-center gap-1.5">
                                    <i class="fa-solid fa-volume-high"></i> Câu hỏi trong audio:
                                </div>
                                <div class="text-sm font-extrabold text-slate-900 dark:text-white">${q.q}</div>
                            </div>
                        ` : q.q
                    )}
                </div>

                <!-- Options -->
                <div class="space-y-2.5 pt-1">
                    ${q.options.map((opt, optIdx) => {
                        const optKey = opt.trim().charAt(0);
                        const isChosen = selected === optKey;
                        const isGraded = this.isSubmitted || (!isExam && isAnswered);
                        const correctKey = (q.ansLetter || (typeof q.ans === 'number' ? ['A','B','C','D'][q.ans] : q.ans) || 'A').toUpperCase();
                        const isCorrectAnswer = optKey === correctKey;

                        let btnClass = 'w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between text-xs sm:text-[13px] font-medium cursor-pointer ';
                        if (isGraded) {
                            if (isCorrectAnswer) {
                                btnClass += 'border-emerald-500 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 font-bold';
                            } else if (isChosen && !isCorrectAnswer) {
                                btnClass += 'border-rose-500 bg-rose-50 text-rose-900 dark:bg-rose-950/40 dark:text-rose-200 font-bold';
                            } else {
                                btnClass += 'border-slate-200 dark:border-slate-700 opacity-60';
                            }
                        } else {
                            if (isChosen) {
                                btnClass += 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-bold ring-2 ring-indigo-400';
                            } else {
                                btnClass += 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-800';
                            }
                        }

                        // Ở Part 1 & 2: Ẩn toàn bộ chữ câu nói khi chưa trả lời hoặc ở chế độ thi, chỉ hiện "(A)", "(B)", "(C)", "(D)"
                        const displayOptionText = hideTextBeforeAnswer ? `Lựa chọn (${optKey})` : opt;

                        return `
                            <button type="button" onclick="FullPartPracticeEngine.selectAnswer(${this.currentIndex}, '${optKey}')" class="${btnClass}">
                                <div class="flex items-center gap-2">
                                    <span class="w-6 h-6 rounded-lg bg-slate-200/80 dark:bg-slate-700 font-bold text-xs flex items-center justify-center shrink-0 ${isChosen ? 'bg-indigo-600 text-white' : ''}">${optKey}</span>
                                    <span>${displayOptionText}</span>
                                </div>
                                ${isGraded ? (isCorrectAnswer ? '<i class="fa-solid fa-circle-check text-emerald-600 text-sm"></i>' : isChosen ? '<i class="fa-solid fa-circle-xmark text-rose-600 text-sm"></i>' : '') : ''}
                            </button>
                        `;
                    }).join('')}
                </div>

                <!-- Explanation Box (Hiện ngay ở Chế độ học sau khi chọn, hoặc hiện sau khi nộp bài) -->
                ${(this.isSubmitted || (!isExam && isAnswered)) ? `
                    <div class="p-4 rounded-2xl bg-emerald-50/70 dark:bg-slate-800/90 border border-emerald-200 dark:border-slate-700 text-xs space-y-2 animate-in fade-in duration-200">
                        <div class="flex items-center justify-between gap-2">
                            <span class="font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5 text-xs">
                                <i class="fa-solid fa-lightbulb text-amber-500"></i>
                                <span>Đáp án đúng: ${q.ansLetter || q.ans} • Phân tích chi tiết:</span>
                            </span>
                            <button onclick="saveCurrentQuestionToNotebook()" class="text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                                <i class="fa-regular fa-bookmark"></i> Lưu sổ tay
                            </button>
                        </div>

                        ${q.trap_type ? `
                            <div class="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/50 px-2.5 py-1 rounded-lg">
                                ⚠️ Nhận diện bẫy: <span class="font-normal">${q.trap_type}</span>
                            </div>
                        ` : ''}

                        ${q.correct_reason ? `
                            <div class="text-[11.5px] text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-700/80 p-2.5 rounded-xl border border-slate-200 dark:border-slate-600">
                                <strong class="text-teal-700 dark:text-teal-300">📌 Căn cứ trong bài:</strong> "${q.correct_reason}"
                            </div>
                        ` : ''}

                        <p class="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                            ${q.explanation_vi || q.explain || ''}
                        </p>

                        <!-- Transcript Viewer Toggle -->
                        ${(q.transcript || q.audioScript) ? `
                            <div class="pt-2 border-t border-slate-200 dark:border-slate-700">
                                <button type="button" onclick="const sc = document.getElementById('fullpart-transcript-${this.currentIndex}'); if (sc) sc.classList.toggle('hidden');" class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                                    <i class="fa-solid fa-file-lines text-[10px]"></i>
                                    <span>Xem Transcript băng đọc & Dịch nghĩa tiếng Việt</span>
                                </button>
                                <div id="fullpart-transcript-${this.currentIndex}" class="hidden mt-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                                    <div><strong class="text-slate-900 dark:text-white">Transcript:</strong><br><span class="italic text-slate-700 dark:text-slate-300 leading-relaxed">${(q.transcript || q.audioScript).replace(/\n/g, '<br>')}</span></div>
                                    ${q.translation_vi ? `<div><strong class="text-teal-700 dark:text-teal-300">Bản dịch tiếng Việt:</strong><br><span class="text-slate-600 dark:text-slate-400 leading-relaxed">${q.translation_vi.replace(/\n/g, '<br>')}</span></div>` : ''}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
        `;

        // Khởi tạo Audio Player
        this._setupAudioPlayer(q);
    },

    // Khởi tạo và gắn ToeicAudioPlayer Component
    _setupAudioPlayer(q) {
        if (!q.audio_url && !q.audioScript) return;

        if (!this.player && window.ToeicAudioPlayer) {
            this.player = new window.ToeicAudioPlayer({
                containerId: 'fullPartAudioPlayerContainer',
                mode: this.mode,
                onOptionSelect: (optIdx) => {
                    const keys = ['A', 'B', 'C', 'D'];
                    if (keys[optIdx]) this.selectAnswer(this.currentIndex, keys[optIdx]);
                },
                onNextQuestion: () => {
                    this.nextQuestion();
                }
            });
        }

        if (this.player) {
            window._currentToeicAudioPlayer = this.player;
            this.player.setMode(this.mode);
            this.player.render();

            if (q.audio_url) {
                this.player.load(q.audio_url, { autoPlay: false });
            }

            // Preload câu kế tiếp
            if (this.currentIndex < this.activeQuestions.length - 1 && this.activeQuestions[this.currentIndex + 1]?.audio_url) {
                this.player.preloadNext(this.activeQuestions[this.currentIndex + 1].audio_url);
            }
        }
    },

    selectAnswer(qIndex, optKey) {
        if (this.isSubmitted) return;
        this.userAnswers[qIndex] = optKey;

        // Nếu ở chế độ học, ghi nhận kết quả ngay vào ListeningDashboard và SRS
        if (this.mode !== 'exam') {
            const q = this.activeQuestions[qIndex];
            if (q) {
                const correctKey = (q.ansLetter || (typeof q.ans === 'number' ? ['A','B','C','D'][q.ans] : q.ans) || 'A').toUpperCase();
                const isCorrect = optKey === correctKey;
                if (window.ListeningDashboard) {
                    window.ListeningDashboard.recordAnswer(q, isCorrect);
                }
                if (!isCorrect && window.ToeicListeningSRS) {
                    window.ToeicListeningSRS.addQuestion(q);
                }
            }
        }

        this.renderCurrentQuestion();
    },

    jumpToQuestion(idx) {
        this.currentIndex = idx;
        this.renderCurrentQuestion();
    },

    nextQuestion() {
        if (this.currentIndex < this.activeQuestions.length - 1) {
            this.currentIndex++;
            this.renderCurrentQuestion();
        }
    },

    prevQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.renderCurrentQuestion();
        }
    },

    playAudio(text) {
        if (this.player) {
            this.player.togglePlay();
            return;
        }
        if (window.UniversalAudioEngine) {
            window.UniversalAudioEngine.speak(text, { rate: 0.95 });
        } else if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-US';
            utterance.rate = 0.95;
            window.speechSynthesis.speak(utterance);
        }
    },

    startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.timerInterval = setInterval(() => {
            if (this.timeRemaining > 0) {
                this.timeRemaining--;
                const timerEl = document.getElementById('fullPartTimerText');
                if (timerEl) timerEl.textContent = this.formatTime(this.timeRemaining);
            } else {
                clearInterval(this.timerInterval);
                showToast('⏱️ Hết giờ làm bài! Tự động nộp bài...');
                this.submitPart();
            }
        }, 1000);
    },

    formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    },

    closeModal() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        if (this.player) this.player.pause();
        const modal = document.getElementById('fullPartPracticeModal');
        if (modal) modal.remove();
    },

    confirmExit() {
        if (this.isSubmitted || confirm('Bạn có chắc chắn muốn rời khỏi bài luyện Part này không? Kết quả chưa nộp sẽ không được lưu.')) {
            if (this.timerInterval) clearInterval(this.timerInterval);
            if (this.player) this.player.pause();
            const modal = document.getElementById('fullPartPracticeModal');
            if (modal) modal.remove();
        }
    },

    // Chấm điểm bài thi và hiện tổng kết chuẩn ETS
    submitPart() {
        if (this.isSubmitted) return;
        if (this.timerInterval) clearInterval(this.timerInterval);
        if (this.player) this.player.pause();
        this.isSubmitted = true;

        let correctCount = 0;
        this.activeQuestions.forEach((q, idx) => {
            const correctKey = (q.ansLetter || (typeof q.ans === 'number' ? ['A','B','C','D'][q.ans] : q.ans) || 'A').toUpperCase();
            const isCorrect = this.userAnswers[idx] === correctKey;
            if (isCorrect) {
                correctCount++;
            } else if (window.ToeicListeningSRS) {
                // Tự động đưa câu sai vào Sổ tay Ôn tập ngắt quãng SRS Box 1
                window.ToeicListeningSRS.addQuestion(q);
            }
            // Ghi nhận vào thống kê ListeningDashboard
            if (window.ListeningDashboard) {
                window.ListeningDashboard.recordAnswer(q, isCorrect);
            }
        });

        // Kiểm tra và trao huy hiệu mốc thực tế
        if (window.ToeicListeningBadges) {
            window.ToeicListeningBadges.checkMilestones();
        }

        const total = this.activeQuestions.length;
        const percentage = Math.round((correctCount / total) * 100);

        // Lưu điểm vào hồ sơ người dùng
        if (!currentUserAccount) {
            currentUserAccount = { id: 'temp', name: 'Học viên' };
        }
        currentUserAccount.practiceQuestionsDone = (currentUserAccount.practiceQuestionsDone || 0) + total;
        state.xp = (state.xp || 0) + (correctCount * 10);
        state.listenDone = (state.listenDone || 0) + correctCount;
        if (window.syncCurrentAccountState) window.syncCurrentAccountState();

        // Render lại câu hỏi hiện tại với lời giải
        this.renderCurrentQuestion();

        // Mở popup kết quả chuẩn ETS
        this.showResultSummaryModal(correctCount, total, percentage);
    },

    showResultSummaryModal(correct, total, percentage) {
        let resModal = document.getElementById('fullPartResultSummaryModal');
        if (!resModal) {
            resModal = document.createElement('div');
            resModal.id = 'fullPartResultSummaryModal';
            resModal.className = 'fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto';
            document.body.appendChild(resModal);
        }

        const isGood = percentage >= 75;
        const scoreEstimate = window.ListeningDatabaseV2 ? window.ListeningDatabaseV2.calculateScore(Math.round((correct / total) * 100)) : null;

        resModal.innerHTML = `
            <div class="bg-white dark:bg-slate-900 rounded-[28px] max-w-md w-full p-6 text-center space-y-4 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in zoom-in-95">
                <div class="w-16 h-16 rounded-3xl ${isGood ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60' : 'bg-amber-100 text-amber-600 dark:bg-amber-950/60'} flex items-center justify-center text-3xl mx-auto shadow-md">
                    <i class="${isGood ? 'fa-solid fa-trophy' : 'fa-solid fa-chart-line'}"></i>
                </div>

                <div class="space-y-1">
                    <span class="text-xs font-bold uppercase tracking-wider text-slate-500">TỔNG KẾT PART ${this.currentPart} (CHUẨN ETS)</span>
                    <h3 class="text-2xl font-black text-slate-900 dark:text-white">
                        Đạt ${correct} / ${total} câu đúng
                    </h3>
                    <p class="text-xs font-semibold ${isGood ? 'text-emerald-600' : 'text-amber-600'}">
                        Tỷ lệ chính xác: ${percentage}% • +${correct * 10} XP
                    </p>
                </div>

                ${scoreEstimate ? `
                    <div class="p-3.5 rounded-2xl bg-gradient-to-r from-teal-500/10 via-sky-500/10 to-indigo-500/10 border border-teal-200 dark:border-slate-700 text-left space-y-1">
                        <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Ước tính điểm Listening ETS (5-495)</div>
                        <div class="text-xl font-black text-teal-700 dark:text-teal-300 flex items-center justify-between">
                            <span>${scoreEstimate.scaledScore} / 495 điểm</span>
                            <span class="text-xs px-2.5 py-0.5 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-200 font-bold">${scoreEstimate.cefr}</span>
                        </div>
                        <div class="text-[11px] text-slate-600 dark:text-slate-400">${scoreEstimate.evaluation}</div>
                    </div>
                ` : ''}

                <div class="pt-2 flex flex-col gap-2">
                    <button onclick="document.getElementById('fullPartResultSummaryModal').remove();" class="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-teal-600 hover:from-indigo-700 hover:to-teal-700 text-white font-black text-xs shadow-md transition cursor-pointer">
                        Xem lại từng câu & Lời giải chi tiết
                    </button>
                    <button onclick="document.getElementById('fullPartResultSummaryModal').remove(); FullPartPracticeEngine.confirmExit();" class="w-full py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition cursor-pointer">
                        Hoàn thành & Thoát
                    </button>
                </div>
            </div>
        `;
    },

    getPartGradient(partNum) {
        switch (partNum) {
            case 1: return 'from-indigo-600 via-blue-600 to-cyan-600';
            case 2: return 'from-fuchsia-600 via-purple-600 to-indigo-600';
            case 3: return 'from-emerald-600 via-teal-600 to-cyan-600';
            case 4: return 'from-amber-600 via-orange-600 to-rose-600';
            case 'mock_full':
            case 100: return 'from-purple-700 via-indigo-700 to-blue-700';
            case 'mock_mini':
            case 25: return 'from-indigo-600 via-sky-600 to-teal-600';
            case 'adaptive': return 'from-teal-600 via-emerald-600 to-cyan-600';
            case 5: return 'from-emerald-600 via-teal-600 to-blue-600';
            case 6: return 'from-teal-600 via-cyan-600 to-indigo-600';
            case 7: return 'from-rose-600 via-pink-600 to-purple-600';
            default: return 'from-indigo-600 to-blue-600';
        }
    }
};

// Global helper function để mở modal luyện toàn Part
window.openFullPartPracticeModal = function(partNumber, mode = 'practice') {
    if (window.FullPartPracticeEngine) {
        window.FullPartPracticeEngine.startPart(partNumber, mode);
    }
};
