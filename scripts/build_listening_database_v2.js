/**
 * BUILDER SCRIPT FOR STANDARDIZED TOEIC LISTENING DATABASE V2 (ETS 2026 FORMAT)
 * =========================================================================
 * Full 100 questions matching official ETS Listening Test structure:
 * - Part 1: Photographs (6 questions · 4 options A-D · photos + alt tags)
 * - Part 2: Question-Response (25 questions · 3 options A-C · trap analysis)
 * - Part 3: Conversations (13 sets × 3 questions = 39 questions · multi-voice dialogues · intent & graphic questions)
 * - Part 4: Short Talks (10 sets × 3 questions = 30 questions · monologues · intent & graphic questions)
 * Total: 100 questions with comprehensive Vietnamese explanations, trap types, IPA vocabulary, and ETS audio pacing.
 */

const fs = require('fs');
const path = require('path');

const OUTPUT_FILE = path.join(__dirname, '..', 'data', 'listening_database_v2.json');

// 1. PART 1: 6 QUESTIONS
const part1Questions = [
    {
        id: "p1_q01",
        part: 1,
        topic: "Văn phòng & Công nghệ",
        subtopic: "Làm việc với máy tính",
        difficulty: "A2",
        accent: "US",
        speakers: [{ name: "Speaker 1", accent: "en-US", role: "Narrator" }],
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
        alt_text: "A businesswoman typing on her laptop at an office desk with a coffee mug nearby",
        audioScript: "Look at the picture marked number 1 in your test book. (A) She is typing on a computer keyboard. (B) She is drinking from a coffee cup. (C) She is writing in a notebook. (D) She is filing documents in a cabinet.",
        transcript: "(A) She is typing on a computer keyboard. (B) She is drinking from a coffee cup. (C) She is writing in a notebook. (D) She is filing documents in a cabinet.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. She is typing on a computer keyboard.",
            "B. She is drinking from a coffee cup.",
            "C. She is writing in a notebook.",
            "D. She is filing documents in a cabinet."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "action",
        trap_type: "hành động không có trong tranh",
        correct_reason: "Nhân vật đang đặt hai tay lên bàn phím máy tính xách tay và tập trung thao tác gõ phím.",
        explanation_vi: "Phân tích tranh nhân vật tại bàn làm việc: (A) 'typing on a computer keyboard' miêu tả chuẩn xác hành động chính. (B) có cốc cà phê nhưng cô không uống. (C), (D) không xuất hiện trong hình.",
        key_vocab: [
            { word: "type on", ipa: "/taɪp ɒn/", meaning: "gõ trên (bàn phím)" },
            { word: "file documents", ipa: "/faɪl ˈdɒkjʊmənts/", meaning: "sắp xếp tài liệu vào hồ sơ" }
        ],
        exam_tip: "Với tranh 1 người, quan sát hành động ở tay và mắt nhân vật trước tiên."
    },
    {
        id: "p1_q02",
        part: 1,
        topic: "Họp & Thảo luận đồng nghiệp",
        subtopic: "Hội thảo nhóm",
        difficulty: "B1",
        accent: "UK",
        speakers: [{ name: "Speaker 2", accent: "en-GB", role: "Narrator" }],
        image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        alt_text: "A group of diverse colleagues gathered around a conference table discussing a project",
        audioScript: "Look at the picture marked number 2 in your test book. (A) Colleagues are gathered around a table. (B) They are packing boxes for moving. (C) An employee is presenting on a chalkboard. (D) The office furniture is being repainted.",
        transcript: "(A) Colleagues are gathered around a table. (B) They are packing boxes for moving. (C) An employee is presenting on a chalkboard. (D) The office furniture is being repainted.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Colleagues are gathered around a table.",
            "B. They are packing boxes for moving.",
            "C. An employee is presenting on a chalkboard.",
            "D. The office furniture is being repainted."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "group_action",
        trap_type: "từ gây nhiễu ngữ cảnh",
        correct_reason: "Các đồng nghiệp đang ngồi vây quanh một bàn họp gỗ để thảo luận nhóm.",
        explanation_vi: "Tranh nhiều người họp quanh bàn: (A) 'Colleagues are gathered around a table' mô tả chính xác trạng thái tập hợp. (B), (C), (D) là các hành động dọn nhà/vẽ bảng/sơn bàn ghế không có thực.",
        key_vocab: [
            { word: "gather around", ipa: "/ˈɡæðər əˈraʊnd/", meaning: "tập hợp xung quanh" },
            { word: "colleague", ipa: "/ˈkɒliːɡ/", meaning: "đồng nghiệp" }
        ],
        exam_tip: "Khi tranh có nhiều người, đáp án đúng thường mô tả hành động chung hoặc trạng thái tập thể."
    },
    {
        id: "p1_q03",
        part: 1,
        topic: "Giao thông & Đô thị",
        subtopic: "Bãi đỗ xe đường phố",
        difficulty: "B2",
        accent: "AU",
        speakers: [{ name: "Speaker 3", accent: "en-AU", role: "Narrator" }],
        image: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
        alt_text: "Multiple cars parked neatly along the sidewalk on a quiet urban avenue",
        audioScript: "Look at the picture marked number 3 in your test book. (A) Vehicles are being parked along the curb. (B) Cars have been parked along the street. (C) A driver is repairing an engine. (D) Traffic is being directed by an officer.",
        transcript: "(A) Vehicles are being parked along the curb. (B) Cars have been parked along the street. (C) A driver is repairing an engine. (D) Traffic is being directed by an officer.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Vehicles are being parked along the curb.",
            "B. Cars have been parked along the street.",
            "C. A driver is repairing an engine.",
            "D. Traffic is being directed by an officer."
        ],
        ans: 1,
        ansLetter: "B",
        question_type: "object_state",
        trap_type: "bẫy thì bị động 'being' trong tranh tĩnh",
        correct_reason: "Hàng loạt ô tô đã được đỗ sẵn ở ven lề đường, không có người đang lái hay điều khiển xe.",
        explanation_vi: "Bẫy kinh điển ETS trong tranh tả vật/cảnh tĩnh: (A) 'are being parked' mang nghĩa hành động đang được thực hiện (cần có người lái đỗ xe vào) -> SAI. (B) 'have been parked' miêu tả trạng thái đã đỗ sẵn -> CHÍNH XÁC. (C) và (D) không có người sửa xe hay cảnh sát.",
        key_vocab: [
            { word: "curb", ipa: "/kɜːb/", meaning: "mép vỉa hè" },
            { word: "vehicle", ipa: "/ˈviːəkl/", meaning: "phương tiện giao thông" }
        ],
        exam_tip: "Quy tắc vàng: Nếu tranh KHÔNG có người, 95% các đáp án chứa 'being + V3' là BẪY SAI."
    },
    {
        id: "p1_q04",
        part: 1,
        topic: "Phương tiện công cộng",
        subtopic: "Giá để xe đạp thành phố",
        difficulty: "B1",
        accent: "CA",
        speakers: [{ name: "Speaker 4", accent: "en-CA", role: "Narrator" }],
        image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
        alt_text: "Row of bicycles parked and locked to a metal bike rack on an urban sidewalk",
        audioScript: "Look at the picture marked number 4 in your test book. (A) Cyclists are riding across a bridge. (B) Bicycles have been secured to a metal rack. (C) A mechanic is assembling bicycle pedals. (D) Helmets are hanging from the handlebars.",
        transcript: "(A) Cyclists are riding across a bridge. (B) Bicycles have been secured to a metal rack. (C) A mechanic is assembling bicycle pedals. (D) Helmets are hanging from the handlebars.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Cyclists are riding across a bridge.",
            "B. Bicycles have been secured to a metal rack.",
            "C. A mechanic is assembling bicycle pedals.",
            "D. Helmets are hanging from the handlebars."
        ],
        ans: 1,
        ansLetter: "B",
        question_type: "object_state",
        trap_type: "hành động người vs vật",
        correct_reason: "Các chiếc xe đạp đã được khóa và xếp ngay ngắn vào khung sắt để xe công cộng.",
        explanation_vi: "Tranh không có người điều khiển: Loại (A) và (C). (B) 'Bicycles have been secured to a metal rack' mô tả chính xác trạng thái xe đã được gắn/khóa vào giá. (D) không có mũ bảo hiểm treo trên tay lái.",
        key_vocab: [
            { word: "secure", ipa: "/sɪˈkjʊər/", meaning: "cố định, khóa chặt an toàn" },
            { word: "rack", ipa: "/ræk/", meaning: "giá, khung để đồ" },
            { word: "handlebars", ipa: "/ˈhændlbɑːz/", meaning: "ghi-đông, tay lái xe đạp" }
        ],
        exam_tip: "Để ý động từ chỉ trạng thái như 'have been secured / positioned / arranged'."
    },
    {
        id: "p1_q05",
        part: 1,
        topic: "Cửa hàng & Bán lẻ",
        subtopic: "Nhân viên sắp xếp hàng hóa",
        difficulty: "A2",
        accent: "US",
        speakers: [{ name: "Speaker 1", accent: "en-US", role: "Narrator" }],
        image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=800&q=80",
        alt_text: "A grocery store worker in apron placing merchandise neatly onto supermarket shelves",
        audioScript: "Look at the picture marked number 5 in your test book. (A) A clerk is restocking grocery items on a shelf. (B) A customer is paying at the cash register. (C) Shopping carts are lined up by the entrance. (D) Floor tiles are being mopped with soap.",
        transcript: "(A) A clerk is restocking grocery items on a shelf. (B) A customer is paying at the cash register. (C) Shopping carts are lined up by the entrance. (D) Floor tiles are being mopped with soap.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A clerk is restocking grocery items on a shelf.",
            "B. A customer is paying at the cash register.",
            "C. Shopping carts are lined up by the entrance.",
            "D. Floor tiles are being mopped with soap."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "action",
        trap_type: "từ gây nhiễu địa điểm siêu thị",
        correct_reason: "Nhân viên đeo tạp dề đang dùng tay xếp từng món hàng lên các kệ trong siêu thị.",
        explanation_vi: "(A) 'A clerk is restocking grocery items on a shelf' miêu tả chuẩn xác nhân viên bán hàng đang bổ sung hàng lên kệ. (B) không có khách thanh toán. (C) không có xe đẩy xếp hàng. (D) không có ai lau sàn.",
        key_vocab: [
            { word: "clerk", ipa: "/klɑːk/ (UK) or /klɜːrk/ (US)/", meaning: "nhân viên thu ngân / bán hàng" },
            { word: "restock", ipa: "/ˌriːˈstɒk/", meaning: "bổ sung hàng hóa lên kệ" }
        ],
        exam_tip: "'Restock shelves' là cụm từ xuất hiện cực kỳ thường xuyên trong đề thi TOEIC Part 1."
    },
    {
        id: "p1_q06",
        part: 1,
        topic: "Nhà hàng & Khách sạn",
        subtopic: "Bàn tiệc đã bày sẵn",
        difficulty: "B1",
        accent: "UK",
        speakers: [{ name: "Speaker 2", accent: "en-GB", role: "Narrator" }],
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
        alt_text: "An elegant restaurant dining table set with wine glasses, plates, and silver cutlery",
        audioScript: "Look at the picture marked number 6 in your test book. (A) The dining table has been set with cutlery and glasses. (B) Food is being served by the waitstaff. (C) Customers are being seated at the booth. (D) Dishes are being cleared from the surface.",
        transcript: "(A) The dining table has been set with cutlery and glasses. (B) Food is being served by the waitstaff. (C) Customers are being seated at the booth. (D) Dishes are being cleared from the surface.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. The dining table has been set with cutlery and glasses.",
            "B. Food is being served by the waitstaff.",
            "C. Customers are being seated at the booth.",
            "D. Dishes are being cleared from the surface."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "object_state",
        trap_type: "bẫy hành động đang diễn ra 'being'",
        correct_reason: "Bàn ăn đã được chuẩn bị hoàn chỉnh với khăn trải bàn, ly rượu và dao nĩa xếp sẵn.",
        explanation_vi: "Tranh chụp một bàn tiệc sang trọng đã chuẩn bị sẵn, không có người. (A) 'has been set with cutlery and glasses' miêu tả chính xác trạng thái tĩnh của bàn ăn. (B), (C), (D) đều chứa bẫy 'being' giả định có người phục vụ hoặc khách.",
        key_vocab: [
            { word: "cutlery", ipa: "/ˈkʌtləri/", meaning: "bộ dao, thìa, nĩa ăn" },
            { word: "set the table", ipa: "/sɛt ðə ˈteɪbl/", meaning: "bày biện bàn ăn" },
            { word: "waitstaff", ipa: "/ˈweɪtstɑːf/", meaning: "đội ngũ nhân viên phục vụ bàn" }
        ],
        exam_tip: "Phân biệt kỹ giữa 'table is set' (bàn đã dọn sẵn) và 'food is being served' (đang bưng thức ăn ra)."
    }
];

// 2. PART 2: 25 QUESTIONS (Standard 3 options A, B, C)
const part2Questions = [
    {
        id: "p2_q01",
        part: 2,
        topic: "Lịch họp & Thời gian",
        difficulty: "A2",
        accent: "US",
        q: "When will the quarterly budget meeting take place?",
        audioScript: "Number 7. When will the quarterly budget meeting take place? (A) In Conference Room B. (B) Next Tuesday at ten A.M. (C) Yes, I met him yesterday.",
        transcript: "When will the quarterly budget meeting take place? (A) In Conference Room B. (B) Next Tuesday at ten A.M. (C) Yes, I met him yesterday.",
        options: [
            "A. In Conference Room B.",
            "B. Next Tuesday at 10:00 A.M.",
            "C. Yes, I met him yesterday."
        ],
        ans: 1,
        ansLetter: "B",
        question_type: "when",
        trap_type: "bẫy trả lời cho Where và bẫy đồng âm 'meeting/met'",
        correct_reason: "Câu hỏi bắt đầu bằng 'When' (Khi nào) cần câu trả lời chỉ mốc thời gian: 'Next Tuesday at 10:00 A.M.'",
        explanation_vi: "Phân tích câu hỏi Wh-: Từ để hỏi 'When' hỏi thời gian. (A) trả lời cho câu hỏi 'Where'. (C) là câu Yes/No (sai với Wh-) và gài bẫy đồng âm 'meeting - met'. Chọn (B).",
        key_vocab: [{ word: "take place", ipa: "/teɪk pleɪs/", meaning: "diễn ra, tổ chức" }],
        exam_tip: "Câu hỏi Wh- tuyệt đối không bao giờ trả lời bằng Yes hoặc No."
    },
    {
        id: "p2_q02",
        part: 2,
        topic: "Vị trí đồ vật văn phòng",
        difficulty: "A2",
        accent: "UK",
        q: "Where did you put the revised employee handbooks?",
        audioScript: "Number 8. Where did you put the revised employee handbooks? (A) Yes, I revised them. (B) On the shelf in the copy room. (C) No later than Friday.",
        transcript: "Where did you put the revised employee handbooks? (A) Yes, I revised them. (B) On the shelf in the copy room. (C) No later than Friday.",
        options: [
            "A. Yes, I revised them.",
            "B. On the shelf in the copy room.",
            "C. No later than Friday."
        ],
        ans: 1,
        ansLetter: "B",
        question_type: "where",
        trap_type: "bẫy lặp lại từ 'revised' và bẫy thời gian 'Friday'",
        correct_reason: "Từ để hỏi 'Where' yêu cầu câu trả lời chỉ nơi chốn/vị trí: 'On the shelf in the copy room'.",
        explanation_vi: "(A) bẫy Yes/No và lặp lại từ 'revised'. (C) 'No later than Friday' trả lời cho 'When'. (B) chỉ rõ vị trí trên giá trong phòng photocopy. Chọn (B).",
        key_vocab: [{ word: "handbook", ipa: "/ˈhændbʊk/", meaning: "sổ tay hướng dẫn" }],
        exam_tip: "Đề thi ETS thường gài bẫy lặp lại chính xác động từ của câu hỏi trong đáp án sai."
    },
    {
        id: "p2_q03",
        part: 2,
        topic: "Lý do & Nguyên nhân",
        difficulty: "B1",
        accent: "US",
        q: "Why was the client presentation postponed?",
        audioScript: "Number 9. Why was the client presentation postponed? (A) At the main post office. (B) Because the projector was being repaired. (C) I bought a birthday present.",
        transcript: "Why was the client presentation postponed? (A) At the main post office. (B) Because the projector was being repaired. (C) I bought a birthday present.",
        options: [
            "A. At the main post office.",
            "B. Because the projector was being repaired.",
            "C. I bought a birthday present."
        ],
        ans: 1,
        ansLetter: "B",
        question_type: "why",
        trap_type: "bẫy đồng âm 'postponed - post' và 'presentation - present'",
        correct_reason: "'Why' hỏi lý do trì hoãn, đáp án giải thích 'Because the projector was being repaired'.",
        explanation_vi: "Câu hỏi 'Why' (Tại sao buổi thuyết trình bị hoãn?). (A) bẫy đồng âm giữa 'postponed' và 'post office'. (C) bẫy đồng âm 'presentation' và 'birthday present'. (B) nêu trực tiếp lý do máy chiếu hỏng. Chọn (B).",
        key_vocab: [{ word: "postpone", ipa: "/pəʊstˈpəʊn/", meaning: "hoãn lại, dời lịch" }],
        exam_tip: "Cảnh giác với các từ phát âm na ná một phần của từ khóa chính trong câu hỏi."
    },
    {
        id: "p2_q04",
        part: 2,
        topic: "Nhân sự & Phụ trách",
        difficulty: "A2",
        accent: "AU",
        q: "Who is in charge of organizing the retirement reception?",
        audioScript: "Number 10. Who is in charge of organizing the retirement reception? (A) Sandra from Human Resources. (B) At six o'clock this evening. (C) He retired last year.",
        transcript: "Who is in charge of organizing the retirement reception? (A) Sandra from Human Resources. (B) At six o'clock this evening. (C) He retired last year.",
        options: [
            "A. Sandra from Human Resources.",
            "B. At six o'clock this evening.",
            "C. He retired last year."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "who",
        trap_type: "bẫy thời gian và bẫy lặp từ 'retired'",
        correct_reason: "Câu hỏi 'Who' cần người chịu trách nhiệm: 'Sandra from Human Resources'.",
        explanation_vi: "'Who is in charge of...' (Ai chịu trách nhiệm tổ chức tiệc chia tay nghỉ hưu?). (A) chỉ đích danh nhân vật Sandra phòng Nhân sự. (B) trả lời cho 'When'. (C) bẫy biến thể từ 'retirement - retired'. Chọn (A).",
        key_vocab: [{ word: "be in charge of", ipa: "/biː ɪn tʃɑːdʒ ɒv/", meaning: "chịu trách nhiệm, phụ trách" }],
        exam_tip: "'Who' thường được trả lời bằng Tên riêng, Chức danh hoặc Tên phòng ban."
    },
    {
        id: "p2_q05",
        part: 2,
        topic: "Lựa chọn phương tiện & Cách thức",
        difficulty: "B1",
        accent: "CA",
        q: "How will the inspection team travel to the factory site?",
        audioScript: "Number 11. How will the inspection team travel to the factory site? (A) By rented passenger van. (B) About forty-five minutes. (C) To inspect the assembly line.",
        transcript: "How will the inspection team travel to the factory site? (A) By rented passenger van. (B) About forty-five minutes. (C) To inspect the assembly line.",
        options: [
            "A. By rented passenger van.",
            "B. About forty-five minutes.",
            "C. To inspect the assembly line."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "how",
        trap_type: "bẫy trả lời thời lượng 'How long' và mục đích 'Why'",
        correct_reason: "'How will... travel' hỏi phương tiện đi lại -> 'By rented passenger van' (Bằng xe van chở khách thuê).",
        explanation_vi: "'How' đi với động từ di chuyển 'travel' hỏi về phương tiện. (A) dùng giới từ 'By + phương tiện' là đáp án chuẩn. (B) trả lời cho 'How long'. (C) trả lời cho 'Why'. Chọn (A).",
        key_vocab: [{ word: "inspection team", ipa: "/ɪnˈspɛkʃən tiːm/", meaning: "đội thanh tra" }],
        exam_tip: "'How + travel/get to' gần như luôn đi kèm câu trả lời chỉ phương tiện (by car, by train, take a taxi)."
    },
    {
        id: "p2_q06",
        part: 2,
        topic: "Ý kiến & Đánh giá",
        difficulty: "B1",
        accent: "US",
        q: "What do you think of the new marketing slogan?",
        audioScript: "Number 12. What do you think of the new marketing slogan? (A) It sounds very catchy and modern. (B) In the morning newspaper. (C) Yes, I think so too.",
        transcript: "What do you think of the new marketing slogan? (A) It sounds very catchy and modern. (B) In the morning newspaper. (C) Yes, I think so too.",
        options: [
            "A. It sounds very catchy and modern.",
            "B. In the morning newspaper.",
            "C. Yes, I think so too."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "opinion",
        trap_type: "bẫy Yes/No cho câu hỏi Wh-",
        correct_reason: "'What do you think of...' hỏi ý kiến/nhận xét cá nhân -> 'It sounds very catchy and modern' (Nghe rất bắt tai và hiện đại).",
        explanation_vi: "Câu hỏi thăm dò ý kiến 'What do you think of...'. (A) đưa ra tính từ nhận xét 'catchy and modern'. (B) trả lời cho 'Where'. (C) là câu Yes/No sai luật với Wh-. Chọn (A).",
        key_vocab: [{ word: "catchy", ipa: "/ˈkætʃi/", meaning: "bắt tai, dễ nhớ" }],
        exam_tip: "Hỏi nhận xét thường trả lời bằng các tính từ đánh giá hoặc cụm 'I find it...'."
    },
    {
        id: "p2_q07",
        part: 2,
        topic: "Lựa chọn phương án",
        difficulty: "B1",
        accent: "UK",
        q: "Should we order lunch from the bistro or eat at the cafeteria?",
        audioScript: "Number 13. Should we order lunch from the bistro or eat at the cafeteria? (A) The cafeteria is closed for maintenance today. (B) Yes, I am hungry. (C) Fifteen dollars per person.",
        transcript: "Should we order lunch from the bistro or eat at the cafeteria? (A) The cafeteria is closed for maintenance today. (B) Yes, I am hungry. (C) Fifteen dollars per person.",
        options: [
            "A. The cafeteria is closed for maintenance today.",
            "B. Yes, I am hungry.",
            "C. Fifteen dollars per person."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "choice",
        trap_type: "bẫy trả lời Yes/No cho câu hỏi lựa chọn 'or' và đáp án gián tiếp",
        correct_reason: "Đáp án gián tiếp loại trừ một vế: 'The cafeteria is closed for maintenance today' ngụ ý bắt buộc phải chọn vế đặt món từ bistro.",
        explanation_vi: "Câu hỏi lựa chọn 'A or B'. Quy tắc: Không trả lời Yes/No (loại B). (C) trả lời cho 'How much'. (A) đưa ra thông tin quán ăn tự phục vụ đóng cửa để ngầm chọn bistro. Chọn (A).",
        key_vocab: [{ word: "cafeteria", ipa: "/ˌkæfəˈtɪəriə/", meaning: "quán ăn tự phục vụ" }],
        exam_tip: "Câu hỏi 'or' ngày nay ETS rất chuộng đáp án gián tiếp giải thích lý do loại trừ một trong hai lựa chọn."
    },
    {
        id: "p2_q08",
        part: 2,
        topic: "Đề nghị & Lời mời",
        difficulty: "A2",
        accent: "US",
        q: "Would you like me to proofread that press release for you?",
        audioScript: "Number 14. Would you like me to proofread that press release for you? (A) That would be a huge help, thanks! (B) The press conference starts soon. (C) Yes, I read the newspaper.",
        transcript: "Would you like me to proofread that press release for you? (A) That would be a huge help, thanks! (B) The press conference starts soon. (C) Yes, I read the newspaper.",
        options: [
            "A. That would be a huge help, thanks!",
            "B. The press conference starts soon.",
            "C. Yes, I read the newspaper."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "offer",
        trap_type: "bẫy lặp lại từ 'press' và từ 'read'",
        correct_reason: "Lời đề nghị giúp đỡ 'Would you like me to...' được đón nhận nồng nhiệt bằng 'That would be a huge help, thanks!'.",
        explanation_vi: "(A) là phản hồi cảm ơn kinh điển khi nhận được đề nghị giúp đỡ. (B) bẫy lặp từ 'press'. (C) bẫy từ 'read' liên quan đến 'proofread'. Chọn (A).",
        key_vocab: [
            { word: "proofread", ipa: "/ˈpruːfriːd/", meaning: "đọc và sửa lỗi bản in/văn bản" },
            { word: "press release", ipa: "/ˈprɛs rɪˌliːs/", meaning: "thông cáo báo chí" }
        ],
        exam_tip: "Lời đề nghị giúp đỡ thường được đáp lại bằng 'That would be great/helpful' hoặc 'No thanks, I can manage'."
    },
    {
        id: "p2_q09",
        part: 2,
        topic: "Thông báo thiết bị & Giải pháp",
        difficulty: "B1",
        accent: "AU",
        q: "The heavy-duty color printer on the third floor is out of paper.",
        audioScript: "Number 15. The heavy-duty color printer on the third floor is out of paper. (A) I will grab a fresh pack from the supply room. (B) Yes, print twenty copies. (C) The third page is missing.",
        transcript: "The heavy-duty color printer on the third floor is out of paper. (A) I will grab a fresh pack from the supply room. (B) Yes, print twenty copies. (C) The third page is missing.",
        options: [
            "A. I will grab a fresh pack from the supply room.",
            "B. Yes, print twenty copies.",
            "C. The third page is missing."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "statement",
        trap_type: "bẫy đồng âm 'third' và từ gây nhiễu 'print'",
        correct_reason: "Câu trần thuật thông báo máy in hết giấy được phản hồi bằng hành động giải quyết sự cố ngay lập tức.",
        explanation_vi: "Câu trần thuật (Statement) nêu vấn đề. (A) 'I will grab a fresh pack from the supply room' (Tôi sẽ lấy một bọc mới từ kho vật tư) là phản hồi logic giải quyết vấn đề. (B) và (C) bẫy lặp từ 'print' và 'third'. Chọn (A).",
        key_vocab: [{ word: "supply room", ipa: "/səˈplaɪ ruːm/", meaning: "kho chứa văn phòng phẩm/vật tư" }],
        exam_tip: "Với câu trần thuật nêu trục trặc, người đáp lại thường đề xuất phương án khắc phục."
    },
    {
        id: "p2_q10",
        part: 2,
        topic: "Câu hỏi đuôi xác nhận",
        difficulty: "B1",
        accent: "US",
        q: "You submitted the travel reimbursement form online, didn't you?",
        audioScript: "Number 16. You submitted the travel reimbursement form online, didn't you? (A) Yes, earlier this morning. (B) I prefer traveling by train. (C) In the online catalog.",
        transcript: "You submitted the travel reimbursement form online, didn't you? (A) Yes, earlier this morning. (B) I prefer traveling by train. (C) In the online catalog.",
        options: [
            "A. Yes, earlier this morning.",
            "B. I prefer traveling by train.",
            "C. In the online catalog."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "tag_question",
        trap_type: "bẫy lặp lại từ 'travel' và 'online'",
        correct_reason: "Câu hỏi đuôi xác nhận hành động nộp đơn -> 'Yes, earlier this morning' (Vâng, lúc sáng sớm nay).",
        explanation_vi: "Câu hỏi đuôi (Tag question) xác nhận xem đã nộp đơn thanh toán công tác phí chưa. (A) trả lời 'Yes' và bổ sung mốc thời gian đã làm. (B) bẫy từ 'travel'. (C) bẫy từ 'online'. Chọn (A).",
        key_vocab: [{ word: "reimbursement", ipa: "/ˌriːɪmˈbɜːsmənt/", meaning: "khoản hoàn tiền/thanh toán lại chi phí" }],
        exam_tip: "Câu hỏi đuôi kiểm tra sự thật đã xảy ra hay chưa, câu trả lời thường đi kèm thời điểm xác thực."
    },
    {
        id: "p2_q11",
        part: 2,
        topic: "Số lượng & Quy mô",
        difficulty: "B1",
        accent: "UK",
        q: "How many copies of the training syllabus should I print?",
        audioScript: "Number 17. How many copies of the training syllabus should I print? (A) We have twelve participants registered. (B) It's printed on glossy paper. (C) Yes, please print them now.",
        transcript: "How many copies of the training syllabus should I print? (A) We have twelve participants registered. (B) It's printed on glossy paper. (C) Yes, please print them now.",
        options: [
            "A. We have twelve participants registered.",
            "B. It's printed on glossy paper.",
            "C. Yes, please print them now."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "how_many",
        trap_type: "đáp án gián tiếp qua số lượng người tham gia",
        correct_reason: "'How many copies' hỏi số bản in -> cung cấp số học viên 'twelve participants' ngụ ý in 12 bản.",
        explanation_vi: "(A) 'We have twelve participants registered' cung cấp căn cứ trực tiếp để người hỏi biết số lượng cần in là 12. (B) nói về chất liệu giấy. (C) là câu Yes/No sai với 'How many'. Chọn (A).",
        key_vocab: [{ word: "syllabus", ipa: "/ˈsɪləbəs/", meaning: "đề cương môn học/giáo trình" }],
        exam_tip: "Hỏi 'how many' không nhất thiết phải nói thẳng số bản, mà có thể nói gián tiếp số người nhận."
    },
    {
        id: "p2_q12",
        part: 2,
        topic: "Câu hỏi phủ định",
        difficulty: "B2",
        accent: "CA",
        q: "Isn't the warranty on this photocopy machine still valid?",
        audioScript: "Number 18. Isn't the warranty on this photocopy machine still valid? (A) Yes, it expires at the end of next month. (B) No, he made thirty copies. (C) Contact the warranty department.",
        transcript: "Isn't the warranty on this photocopy machine still valid? (A) Yes, it expires at the end of next month. (B) No, he made thirty copies. (C) Contact the warranty department.",
        options: [
            "A. Yes, it expires at the end of next month.",
            "B. No, he made thirty copies.",
            "C. Contact the warranty department."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "negative_question",
        trap_type: "bẫy trả lời No lạc đề và bẫy lặp lại từ 'copies'",
        correct_reason: "'Isn't the warranty still valid?' xác nhận bảo hành còn hạn không -> 'Yes, it expires at the end of next month'.",
        explanation_vi: "Câu hỏi phủ định 'Isn't... valid?'. Trong tiếng Anh, nếu vẫn còn hạn thì trả lời 'Yes' kèm chi tiết ngày hết hạn. (B) bẫy lặp từ 'copies'. Chọn (A).",
        key_vocab: [
            { word: "warranty", ipa: "/ˈwɒrənti/", meaning: "phiếu bảo hành/thời hạn bảo hành" },
            { word: "valid", ipa: "/ˈvælɪd/", meaning: "còn hiệu lực, hợp lệ" }
        ],
        exam_tip: "Quy tắc câu hỏi phủ định tiếng Anh: Cứ sự thật là CÒN thì nói YES, HẾT thì nói NO."
    },
    {
        id: "p2_q13",
        part: 2,
        topic: "Địa điểm sự kiện",
        difficulty: "A2",
        accent: "US",
        q: "Where are we holding the regional branch managers' luncheon?",
        audioScript: "Number 19. Where are we holding the regional branch managers' luncheon? (A) At the Italian bistro across the street. (B) At two o'clock sharp. (C) Yes, I have lunch every day.",
        transcript: "Where are we holding the regional branch managers' luncheon? (A) At the Italian bistro across the street. (B) At two o'clock sharp. (C) Yes, I have lunch every day.",
        options: [
            "A. At the Italian bistro across the street.",
            "B. At two o'clock sharp.",
            "C. Yes, I have lunch every day."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "where",
        trap_type: "bẫy thời gian 'At two o'clock' và đồng âm 'luncheon/lunch'",
        correct_reason: "'Where' hỏi địa điểm tổ chức tiệc trưa -> 'At the Italian bistro across the street'.",
        explanation_vi: "(A) chỉ rõ địa chỉ nhà hàng Ý bên kia đường. (B) trả lời cho 'When'. (C) bẫy từ 'lunch' và trả lời Yes/No vô nghĩa. Chọn (A).",
        key_vocab: [{ word: "luncheon", ipa: "/ˈlʌntʃən/", meaning: "tiệc trưa thân mật/trang trọng" }],
        exam_tip: "'Where' luôn tìm cụm giới từ chỉ nơi chốn (at, in, on, across, opposite)."
    },
    {
        id: "p2_q14",
        part: 2,
        topic: "Người phê duyệt & Ký duyệt",
        difficulty: "B1",
        accent: "UK",
        q: "Who approved the budget increase for the ad campaign?",
        audioScript: "Number 20. Who approved the budget increase for the ad campaign? (A) Mr. Henderson signed off on it. (B) The advertisement was effective. (C) About twenty percent higher.",
        transcript: "Who approved the budget increase for the ad campaign? (A) Mr. Henderson signed off on it. (B) The advertisement was effective. (C) About twenty percent higher.",
        options: [
            "A. Mr. Henderson signed off on it.",
            "B. The advertisement was effective.",
            "C. About twenty percent higher."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "who",
        trap_type: "bẫy từ đồng nghĩa 'ad/advertisement' và tỷ lệ phần trăm",
        correct_reason: "'Who approved' -> 'Mr. Henderson signed off on it' (Ông Henderson đã ký duyệt).",
        explanation_vi: "Cụm 'sign off on something' là cách diễn đạt đồng nghĩa (paraphrase) của 'approve'. (A) nêu chính xác người duyệt. (B) bẫy lặp từ 'advertisement'. (C) bẫy số liệu mức tăng. Chọn (A).",
        key_vocab: [{ word: "sign off on", ipa: "/saɪn ɒf ɒn/", meaning: "ký duyệt, chính thức phê chuẩn" }],
        exam_tip: "Học kỹ cụm 'sign off on' vì ETS rất hay dùng để paraphrase từ 'approve'."
    },
    {
        id: "p2_q15",
        part: 2,
        topic: "Khen ngợi & Phản hồi xã giao",
        difficulty: "B1",
        accent: "AU",
        q: "I really enjoyed reading your article in the corporate newsletter.",
        audioScript: "Number 21. I really enjoyed reading your article in the corporate newsletter. (A) Thanks, I spent a lot of time researching it. (B) In the morning paper. (C) Yes, I wrote a letter.",
        transcript: "I really enjoyed reading your article in the corporate newsletter. (A) Thanks, I spent a lot of time researching it. (B) In the morning paper. (C) Yes, I wrote a letter.",
        options: [
            "A. Thanks, I spent a lot of time researching it.",
            "B. In the morning paper.",
            "C. Yes, I wrote a letter."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "compliment",
        trap_type: "bẫy đồng âm 'newsletter/letter'",
        correct_reason: "Khi nhận được lời khen về bài viết, phản hồi lịch sự nhất là cảm ơn và chia sẻ thêm nỗ lực.",
        explanation_vi: "Đây là câu trần thuật mang tính khen ngợi. (A) 'Thanks, I spent a lot of time researching it' là phản hồi chuẩn mực. (B) trả lời cho Where. (C) bẫy từ 'letter'. Chọn (A).",
        key_vocab: [{ word: "newsletter", ipa: "/ˈnjuːzˌlɛtər/", meaning: "bản tin nội bộ doanh nghiệp" }],
        exam_tip: "Trước lời khen ngợi, câu trả lời đúng 90% sẽ bắt đầu bằng 'Thank you' hoặc 'Thanks'."
    },
    {
        id: "p2_q16",
        part: 2,
        topic: "Bảo trì & Sự cố thang máy",
        difficulty: "B1",
        accent: "US",
        q: "Why hasn't the maintenance team fixed the elevator yet?",
        audioScript: "Number 22. Why hasn't the maintenance team fixed the elevator yet? (A) They are waiting for a replacement part. (B) On the twelfth floor. (C) Yes, take the stairs.",
        transcript: "Why hasn't the maintenance team fixed the elevator yet? (A) They are waiting for a replacement part. (B) On the twelfth floor. (C) Yes, take the stairs.",
        options: [
            "A. They are waiting for a replacement part.",
            "B. On the twelfth floor.",
            "C. Yes, take the stairs."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "why",
        trap_type: "bẫy nơi chốn và bẫy Yes/No",
        correct_reason: "'Why hasn't... fixed' hỏi lý do chưa sửa xong -> 'They are waiting for a replacement part' (Họ đang chờ linh kiện thay thế).",
        explanation_vi: "(A) giải thích nguyên nhân chậm trễ do thiếu phụ tùng thay thế. (B) trả lời cho Where. (C) là câu Yes/No sai cấu trúc với câu hỏi Why. Chọn (A).",
        key_vocab: [{ word: "replacement part", ipa: "/rɪˈpleɪsmənt pɑːt/", meaning: "linh kiện/phụ tùng thay thế" }],
        exam_tip: "Lý do trì hoãn kỹ thuật trong đề TOEIC thường là 'waiting for parts' hoặc 'short on staff'."
    },
    {
        id: "p2_q17",
        part: 2,
        topic: "Đề xuất đi chung xe",
        difficulty: "A2",
        accent: "CA",
        q: "Do you want to carpool together to the branch opening tomorrow?",
        audioScript: "Number 23. Do you want to carpool together to the branch opening tomorrow? (A) That would save us gas and parking fees. (B) The car is blue. (C) Opened last Friday.",
        transcript: "Do you want to carpool together to the branch opening tomorrow? (A) That would save us gas and parking fees. (B) The car is blue. (C) Opened last Friday.",
        options: [
            "A. That would save us gas and parking fees.",
            "B. The car is blue.",
            "C. Opened last Friday."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "suggestion",
        trap_type: "bẫy lặp từ 'car' và 'opened'",
        correct_reason: "Lời rủ đi chung xe 'carpool' được đồng ý với lý do 'That would save us gas and parking fees'.",
        explanation_vi: "'Carpool' nghĩa là đi chung xe. (A) đồng tình vì giúp tiết kiệm tiền xăng và phí đỗ xe. (B) bẫy lặp từ 'car'. (C) bẫy lặp từ 'opened'. Chọn (A).",
        key_vocab: [{ word: "carpool", ipa: "/ˈkɑːpuːl/", meaning: "đi chung một xe ô tô để tiết kiệm chi phí" }],
        exam_tip: "Khi được rủ đi chung xe, đáp án thường đề cập đến 'save money', 'share gas', hoặc 'meet at the parking lot'."
    },
    {
        id: "p2_q18",
        part: 2,
        topic: "Hợp đồng & Bản thảo",
        difficulty: "B1",
        accent: "US",
        q: "When can we expect the final draft of the contract?",
        audioScript: "Number 24. When can we expect the final draft of the contract? (A) By the end of business today. (B) The contract was five pages. (C) Yes, draft it carefully.",
        transcript: "When can we expect the final draft of the contract? (A) By the end of business today. (B) The contract was five pages. (C) Yes, draft it carefully.",
        options: [
            "A. By the end of business today.",
            "B. The contract was five pages.",
            "C. Yes, draft it carefully."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "when",
        trap_type: "bẫy độ dài văn bản và bẫy lặp từ 'draft'",
        correct_reason: "'When' hỏi hạn hoàn thành -> 'By the end of business today' (Trước giờ tan làm hôm nay).",
        explanation_vi: "(A) 'By the end of business today' (viết tắt là COB/EOB) chỉ thời hạn cụ thể. (B) trả lời cho câu hỏi về số trang. (C) bẫy lặp từ 'draft'. Chọn (A).",
        key_vocab: [{ word: "end of business", ipa: "/ɛnd ɒv ˈbɪznɪs/", meaning: "cuối ngày làm việc (khoảng 5h chiều)" }],
        exam_tip: "'By the end of business / day' là cụm thời gian kinh điển trong TOEIC Listening Part 2."
    },
    {
        id: "p2_q19",
        part: 2,
        topic: "Đấu thầu & Nhà cung cấp",
        difficulty: "B2",
        accent: "UK",
        q: "Which vendor submitted the lowest bid for catering?",
        audioScript: "Number 25. Which vendor submitted the lowest bid for catering? (A) Green Leaf Bakery offered the best price. (B) Yes, the food was delicious. (C) At noon tomorrow.",
        transcript: "Which vendor submitted the lowest bid for catering? (A) Green Leaf Bakery offered the best price. (B) Yes, the food was delicious. (C) At noon tomorrow.",
        options: [
            "A. Green Leaf Bakery offered the best price.",
            "B. Yes, the food was delicious.",
            "C. At noon tomorrow."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "which",
        trap_type: "bẫy liên quan đến thức ăn 'delicious' và bẫy thời gian",
        correct_reason: "'Which vendor submitted the lowest bid' hỏi nhà cung cấp giá thấp nhất -> 'Green Leaf Bakery offered the best price'.",
        explanation_vi: "'Lowest bid' (giá thầu thấp nhất) được diễn đạt lại bằng 'the best price' (mức giá tốt nhất). (A) nêu đích danh Green Leaf Bakery. (B) nói về chất lượng món ăn. (C) là mốc thời gian. Chọn (A).",
        key_vocab: [
            { word: "vendor", ipa: "/ˈvɛndɔːr/", meaning: "nhà cung cấp / đối tác bán hàng" },
            { word: "lowest bid", ipa: "/ˈləʊɪst bɪd/", meaning: "mức giá dự thầu thấp nhất" }
        ],
        exam_tip: "'Lowest bid' thường được paraphrase bằng 'most affordable', 'best rate' hoặc 'cheapest option'."
    },
    {
        id: "p2_q20",
        part: 2,
        topic: "Tuyển dụng nhân sự",
        difficulty: "B2",
        accent: "AU",
        q: "Are you planning to hire a full-time assistant or an intern?",
        audioScript: "Number 26. Are you planning to hire a full-time assistant or an intern? (A) We haven't finalized the department budget yet. (B) He is a very capable assistant. (C) At the university job fair.",
        transcript: "Are you planning to hire a full-time assistant or an intern? (A) We haven't finalized the department budget yet. (B) He is a very capable assistant. (C) At the university job fair.",
        options: [
            "A. We haven't finalized the department budget yet.",
            "B. He is a very capable assistant.",
            "C. At the university job fair."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "choice",
        trap_type: "đáp án né tránh / gián tiếp chưa thể quyết định",
        correct_reason: "Đáp án gián tiếp: Chưa chốt ngân sách nên chưa biết thuê ai: 'We haven't finalized the department budget yet'.",
        explanation_vi: "Bẫy đáp án né tránh kinh điển của đề thi thật ETS: Hỏi chọn phương án A hay B, người đáp đưa ra nguyên nhân 'chưa chốt ngân sách' nên chưa quyết định. (B) bẫy lặp từ 'assistant'. (C) trả lời cho Where. Chọn (A).",
        key_vocab: [{ word: "finalize", ipa: "/ˈfaɪnəlaɪz/", meaning: "hoàn tất, chốt lần cuối" }],
        exam_tip: "Khi thấy câu trả lời có 'haven't decided / not sure yet / depends on budget', tỷ lệ đúng lên tới 99%."
    },
    {
        id: "p2_q21",
        part: 2,
        topic: "Hỗ trợ công nghệ thông tin",
        difficulty: "A2",
        accent: "US",
        q: "How do I log into the remote working portal?",
        audioScript: "Number 27. How do I log into the remote working portal? (A) IT sent instructions in your welcome email. (B) Yes, I work remotely on Mondays. (C) The log was delivered yesterday.",
        transcript: "How do I log into the remote working portal? (A) IT sent instructions in your welcome email. (B) Yes, I work remotely on Mondays. (C) The log was delivered yesterday.",
        options: [
            "A. IT sent instructions in your welcome email.",
            "B. Yes, I work remotely on Mondays.",
            "C. The log was delivered yesterday."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "how",
        trap_type: "bẫy đồng âm 'log' (đăng nhập vs khúc gỗ/nhật ký) và 'remotely'",
        correct_reason: "'How do I log into...' hỏi cách đăng nhập -> hướng dẫn tìm email chào mừng của IT: 'IT sent instructions in your welcome email'.",
        explanation_vi: "(A) chỉ dẫn người hỏi nơi tìm hướng dẫn đăng nhập. (B) trả lời Yes/No lạc đề và lặp từ 'remotely'. (C) bẫy đồng âm từ 'log'. Chọn (A).",
        key_vocab: [{ word: "remote working", ipa: "/rɪˈməʊt ˈwɜːkɪŋ/", meaning: "làm việc từ xa" }],
        exam_tip: "Hỏi cách làm cái gì thường được hướng dẫn xem tài liệu ('check the manual') hoặc hỏi bộ phận IT."
    },
    {
        id: "p2_q22",
        part: 2,
        topic: "Dời lịch họp đại hội cổ đông",
        difficulty: "B1",
        accent: "UK",
        q: "The annual shareholder meeting has been rescheduled, hasn't it?",
        audioScript: "Number 28. The annual shareholder meeting has been rescheduled, hasn't it? (A) Yes, it's now set for next Thursday. (B) I met the shareholders yesterday. (C) In the main boardroom.",
        transcript: "The annual shareholder meeting has been rescheduled, hasn't it? (A) Yes, it's now set for next Thursday. (B) I met the shareholders yesterday. (C) In the main boardroom.",
        options: [
            "A. Yes, it's now set for next Thursday.",
            "B. I met the shareholders yesterday.",
            "C. In the main boardroom."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "tag_question",
        trap_type: "bẫy đồng âm 'meeting/met' và lặp từ 'shareholders'",
        correct_reason: "Câu hỏi đuôi xác nhận việc đổi lịch -> 'Yes, it's now set for next Thursday' (Đúng vậy, giờ ấn định vào thứ Năm tuần sau).",
        explanation_vi: "(A) xác nhận sự việc đã được đổi và cung cấp ngày mới. (B) bẫy lặp từ 'shareholders' và từ 'met'. (C) trả lời cho Where. Chọn (A).",
        key_vocab: [
            { word: "reschedule", ipa: "/ˌriːˈʃɛdjuːl/", meaning: "sắp xếp lại lịch trình" },
            { word: "shareholder", ipa: "/ˈʃeəˌhəʊldər/", meaning: "cổ đông công ty" }
        ],
        exam_tip: "'Reschedule' hay đi cùng cụm chỉ mốc mới như 'set for / moved to [Day/Date]'."
    },
    {
        id: "p2_q23",
        part: 2,
        topic: "Yêu cầu cung cấp thông tin",
        difficulty: "B2",
        accent: "US",
        q: "Could you tell me who requested these sales projections?",
        audioScript: "Number 29. Could you tell me who requested these sales projections? (A) That would be Ms. Chen from Finance. (B) Sales increased by fifteen percent. (C) At the upcoming convention.",
        transcript: "Could you tell me who requested these sales projections? (A) That would be Ms. Chen from Finance. (B) Sales increased by fifteen percent. (C) At the upcoming convention.",
        options: [
            "A. That would be Ms. Chen from Finance.",
            "B. Sales increased by fifteen percent.",
            "C. At the upcoming convention."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "indirect_question",
        trap_type: "bẫy số liệu doanh số và bẫy nơi chốn",
        correct_reason: "Câu hỏi gián tiếp chứa từ để hỏi 'who' -> 'That would be Ms. Chen from Finance'.",
        explanation_vi: "'Could you tell me who...' là dạng câu hỏi gián tiếp lịch sự. Trọng tâm là 'who' (Ai yêu cầu bảng dự báo?). (A) chỉ rõ Ms. Chen phòng Tài chính. (B) bẫy lặp từ 'sales'. (C) trả lời cho Where. Chọn (A).",
        key_vocab: [{ word: "sales projection", ipa: "/seɪlz prəˈdʒɛkʃən/", meaning: "bản dự báo doanh số bán hàng" }],
        exam_tip: "Với câu hỏi gián tiếp 'Could you tell me + Wh-...', hãy tập trung vào từ để hỏi Wh- đứng sau."
    },
    {
        id: "p2_q24",
        part: 2,
        topic: "Đáp án né tránh thông minh",
        difficulty: "C1",
        accent: "AU",
        q: "Do you know if the client approved our revised design proposal?",
        audioScript: "Number 30. Do you know if the client approved our revised design proposal? (A) I haven't had a chance to check my inbox yet. (B) The proposal was fifty pages long. (C) Yes, I designed the logo.",
        transcript: "Do you know if the client approved our revised design proposal? (A) I haven't had a chance to check my inbox yet. (B) The proposal was fifty pages long. (C) Yes, I designed the logo.",
        options: [
            "A. I haven't had a chance to check my inbox yet.",
            "B. The proposal was fifty pages long.",
            "C. Yes, I designed the logo."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "indirect_avoidance",
        trap_type: "đáp án né tránh / chưa kiểm tra email",
        correct_reason: "Đáp án né tránh thực tế: Người được hỏi chưa kịp mở hòm thư nên chưa rõ: 'I haven't had a chance to check my inbox yet'.",
        explanation_vi: "Dạng câu hỏi độ khó cao trong đề ETS: Hỏi kết quả phê duyệt, người trả lời bảo 'Tôi chưa có cơ hội kiểm tra hòm thư' (ngụ ý chưa biết). (B) nói về độ dài văn bản. (C) bẫy từ 'designed'. Chọn (A).",
        key_vocab: [{ word: "proposal", ipa: "/prəˈpəʊzəl/", meaning: "bản đề xuất/bản kế hoạch dự án" }],
        exam_tip: "'I haven't checked my email / phone yet' là mẫu câu né tránh xuất hiện dày đặc ở các câu 25-31 của Part 2."
    },
    {
        id: "p2_q25",
        part: 2,
        topic: "Thắc mắc địa điểm chuyển phòng",
        difficulty: "B2",
        accent: "CA",
        q: "Why is the accounting department moving to the fifth floor?",
        audioScript: "Number 31. Why is the accounting department moving to the fifth floor? (A) They need more space for new hires. (B) At nine o'clock tomorrow morning. (C) Accounting was my major in college.",
        transcript: "Why is the accounting department moving to the fifth floor? (A) They need more space for new hires. (B) At nine o'clock tomorrow morning. (C) Accounting was my major in college.",
        options: [
            "A. They need more space for new hires.",
            "B. At nine o'clock tomorrow morning.",
            "C. Accounting was my major in college."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "why",
        trap_type: "bẫy mốc thời gian chuyển đồ và bẫy lặp từ 'accounting'",
        correct_reason: "'Why' hỏi lý do chuyển văn phòng -> 'They need more space for new hires' (Họ cần thêm không gian cho nhân viên mới).",
        explanation_vi: "Câu 31 chốt Part 2: Hỏi lý do 'Why'. (A) nêu chính xác nhu cầu mở rộng diện tích cho nhân sự mới. (B) trả lời cho When. (C) bẫy lặp từ 'accounting'. Chọn (A).",
        key_vocab: [{ word: "new hires", ipa: "/njuː ˈhaɪərz/", meaning: "nhân viên mới được tuyển dụng" }],
        exam_tip: "Các lý do chuyển văn phòng trong TOEIC thường xoay quanh 'expansion' (mở rộng) hoặc 'renovation' (sửa chữa)."
    }
];

// 3. PART 3: 13 SETS × 3 QUESTIONS = 39 QUESTIONS
// Includes multi-speaker dialogues, intent question (Set 6, 13), graphic questions (Set 10, 11, 12)
const part3Sets = [
    {
        setId: "p3_set01",
        part: 3,
        setNumber: 1,
        topic: "Dự án & Tiến độ công việc",
        accent: "US",
        secondaryAccent: "UK",
        speakers: [
            { name: "Man", accent: "en-US", role: "Project Lead (David)" },
            { name: "Woman", accent: "en-GB", role: "Software Developer (Rachel)" }
        ],
        audioScript: `Man: Hi Rachel, have you had a chance to test the payment processing module for our new e-commerce client?
Woman: Yes David, but unfortunately I encountered a compatibility issue with international credit cards during the sandbox test.
Man: That's concerning because the client wants to launch the platform globally next Monday. Do you think you can patch the code before Friday?
Woman: If I collaborate with the cybersecurity team today, we should be able to resolve the vulnerability and finish testing by tomorrow afternoon.`,
        transcript: `Man: Hi Rachel, have you had a chance to test the payment processing module for our new e-commerce client?
Woman: Yes David, but unfortunately I encountered a compatibility issue with international credit cards during the sandbox test.
Man: That's concerning because the client wants to launch the platform globally next Monday. Do you think you can patch the code before Friday?
Woman: If I collaborate with the cybersecurity team today, we should be able to resolve the vulnerability and finish testing by tomorrow afternoon.`,
        translation_vi: `Nam: Chào Rachel, bạn đã có dịp kiểm thử mô-đun xử lý thanh toán cho khách hàng thương mại điện tử mới của chúng ta chưa?
Nữ: Rồi David, nhưng không may là tôi gặp sự cố tương thích với thẻ tín dụng quốc tế trong quá trình thử nghiệm.
Nam: Đáng lo ngại đấy vì khách hàng muốn kích hoạt nền tảng trên toàn cầu vào thứ Hai tới. Bạn có nghĩ mình sửa được mã nguồn trước thứ Sáu không?
Nữ: Nếu hôm nay tôi phối hợp với đội ngũ an ninh mạng, chúng tôi có thể xử lý lỗ hổng này và hoàn tất việc kiểm thử trước chiều mai.`,
        questions: [
            {
                id: "p3_s01_q01",
                q: "What project are the speakers working on?",
                options: [
                    "A. An e-commerce payment system",
                    "B. A warehouse inventory tracking database",
                    "C. A mobile banking application for employees",
                    "D. An office security badge scanner"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "main_idea",
                trap_type: "từ gây nhiễu công nghệ",
                correct_reason: "Man: 'have you had a chance to test the payment processing module for our new e-commerce client?'",
                explanation_vi: "Người đàn ông hỏi về mô-đun xử lý thanh toán (payment processing module) cho khách hàng thương mại điện tử (e-commerce). Chọn A."
            },
            {
                id: "p3_s01_q02",
                q: "What problem does the woman mention?",
                options: [
                    "A. The budget has been exceeded",
                    "B. A compatibility issue with international cards",
                    "C. A server hardware malfunction",
                    "D. Lack of client feedback on design"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "paraphrase trực tiếp từ transcript",
                correct_reason: "Woman: 'I encountered a compatibility issue with international credit cards'",
                explanation_vi: "Người phụ nữ nói rõ: 'encountered a compatibility issue with international credit cards'. Chọn B."
            },
            {
                id: "p3_s01_q03",
                q: "What will the woman most likely do today?",
                options: [
                    "A. Contact the client to postpone the launch",
                    "B. Work with the cybersecurity team",
                    "C. Hire a freelance programmer",
                    "D. Submit a formal budget request"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "next_action",
                trap_type: "từ gây nhiễu hành động khác",
                correct_reason: "Woman: 'If I collaborate with the cybersecurity team today, we should be able to resolve...'",
                explanation_vi: "Người phụ nữ chốt kế hoạch: 'collaborate with the cybersecurity team today' (phối hợp với đội an ninh mạng). Chọn B."
            }
        ]
    },
    {
        setId: "p3_set02",
        part: 3,
        setNumber: 2,
        topic: "Dịch vụ khách hàng & Giao hàng",
        accent: "UK",
        secondaryAccent: "US",
        speakers: [
            { name: "Woman", accent: "en-GB", role: "Customer (Laura)" },
            { name: "Man", accent: "en-US", role: "Customer Service Agent (Mark)" }
        ],
        audioScript: `Woman: Hello, I am calling regarding order number 8421 for twenty ergonomic desk chairs for our law firm. They were supposed to arrive yesterday morning.
Man: Let me pull up your account in our shipping tracking database. Ah, yes, it appears the logistics carrier experienced severe delays due to a snowstorm near the regional depot.
Woman: Oh dear, our new associate attorneys are starting on Thursday, so we desperately need those chairs in place by Wednesday afternoon.
Man: Understood. I will expedite the shipment via priority courier at no additional cost to your firm so that they arrive tomorrow by two P.M.`,
        transcript: `Woman: Hello, I am calling regarding order number 8421 for twenty ergonomic desk chairs for our law firm. They were supposed to arrive yesterday morning.
Man: Let me pull up your account in our shipping tracking database. Ah, yes, it appears the logistics carrier experienced severe delays due to a snowstorm near the regional depot.
Woman: Oh dear, our new associate attorneys are starting on Thursday, so we desperately need those chairs in place by Wednesday afternoon.
Man: Understood. I will expedite the shipment via priority courier at no additional cost to your firm so that they arrive tomorrow by two P.M.`,
        translation_vi: `Nữ: Xin chào, tôi gọi điện về đơn hàng số 8421 gồm 20 chiếc ghế làm việc công thái học cho công ty luật của chúng tôi. Lẽ ra chúng phải được giao từ sáng hôm qua.
Nam: Để tôi tra cứu tài khoản của quý khách trên cơ sở dữ liệu vận chuyển. À vâng, có vẻ đơn vị vận chuyển bị trễ nghiêm trọng do bão tuyết gần kho trung chuyển khu vực.
Nữ: Ôi trời, các luật sư cộng tác mới của chúng tôi sẽ bắt đầu làm việc vào thứ Năm, nên chúng tôi rất cần số ghế đó được sắp đặt trước chiều thứ Tư.
Nam: Tôi hiểu rồi. Tôi sẽ đẩy nhanh tiến độ giao hàng qua dịch vụ chuyển phát ưu tiên mà công ty của bạn không phải trả thêm bất kỳ chi phí nào, đảm bảo giao tới trước 2 giờ chiều mai.`,
        questions: [
            {
                id: "p3_s02_q01",
                q: "Why is the woman calling?",
                options: [
                    "A. To inquire about a delayed furniture delivery",
                    "B. To request a price quote for legal services",
                    "C. To cancel an annual software subscription",
                    "D. To return defective computer monitors"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "main_idea",
                trap_type: "paraphrase 'twenty desk chairs' thành 'furniture'",
                correct_reason: "Woman: 'They were supposed to arrive yesterday morning.'",
                explanation_vi: "Người phụ nữ thắc mắc về đơn hàng 20 chiếc ghế bàn làm việc lẽ ra phải đến sáng hôm qua (delayed furniture delivery). Chọn A."
            },
            {
                id: "p3_s02_q02",
                q: "What caused the shipping delay?",
                options: [
                    "A. A warehouse inventory discrepancy",
                    "B. Severe winter weather conditions",
                    "C. Incorrect shipping address provided",
                    "D. A labor strike at the shipping dock"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "paraphrase 'snowstorm' thành 'severe winter weather'",
                correct_reason: "Man: 'delays due to a snowstorm near the regional depot.'",
                explanation_vi: "Người đàn ông nêu rõ nguyên nhân: 'snowstorm' (bão tuyết) được paraphrase thành 'severe winter weather conditions'. Chọn B."
            },
            {
                id: "p3_s02_q03",
                q: "What does the man offer to do for the customer?",
                options: [
                    "A. Provide a full refund immediately",
                    "B. Upgrade the chairs to leather models",
                    "C. Expedite the order via priority courier for free",
                    "D. Give a discount voucher for future purchases"
                ],
                ans: 2,
                ansLetter: "C",
                question_type: "next_action",
                trap_type: "từ gây nhiễu ưu đãi",
                correct_reason: "Man: 'I will expedite the shipment via priority courier at no additional cost...'",
                explanation_vi: "Người đàn ông đề xuất: 'expedite the shipment via priority courier at no additional cost' (chuyển phát ưu tiên hỏa tốc miễn phí). Chọn C."
            }
        ]
    },
    {
        setId: "p3_set03",
        part: 3,
        setNumber: 3,
        topic: "Thiết bị văn phòng & Bảo trì IT",
        accent: "AU",
        secondaryAccent: "CA",
        speakers: [
            { name: "Man", accent: "en-AU", role: "Employee (Simon)" },
            { name: "Woman", accent: "en-CA", role: "IT Support Manager (Jessica)" }
        ],
        audioScript: `Man: Jessica, do you have a minute? The network color printer in Marketing has been leaving black smudges on all our client brochures this morning.
Woman: Oh, that usually happens when the transfer roller collects excess toner powder. We received a batch of replacement rollers just last week.
Man: That's great, because Vice President Miller needs fifty printed copies of the annual report for his presentation at three o'clock today.
Woman: I will head upstairs with a technician right away. It should take us less than twenty minutes to swap the roller and run a test print.`,
        transcript: `Man: Jessica, do you have a minute? The network color printer in Marketing has been leaving black smudges on all our client brochures this morning.
Woman: Oh, that usually happens when the transfer roller collects excess toner powder. We received a batch of replacement rollers just last week.
Man: That's great, because Vice President Miller needs fifty printed copies of the annual report for his presentation at three o'clock today.
Woman: I will head upstairs with a technician right away. It should take us less than twenty minutes to swap the roller and run a test print.`,
        translation_vi: `Nam: Jessica, bạn có chút thời gian không? Máy in màu kết nối mạng ở phòng Marketing sáng nay cứ để lại các vết mực đen loang lổ trên tất cả tờ gấp của khách hàng.
Nữ: Ồ, hiện tượng đó thường xảy ra khi trục cuốn mực bị bám bột mực thừa. Chúng tôi vừa nhận được một lô trục lăn thay thế vào tuần trước.
Nam: Tuyệt quá, vì Phó chủ tịch Miller cần 50 bản in báo cáo thường niên cho bài thuyết trình của ông ấy lúc 3 giờ chiều nay.
Nữ: Tôi sẽ cùng một kỹ thuật viên lên tầng trên ngay bây giờ. Chúng tôi chỉ mất chưa đầy 20 phút để thay trục lăn và in thử một bản kiểm tra.`,
        questions: [
            {
                id: "p3_s03_q01",
                q: "What problem is the man reporting?",
                options: [
                    "A. A printer is producing smudged documents",
                    "B. The Internet connection in Marketing is down",
                    "C. A computer monitor screen is flickering",
                    "D. An office keycard reader is malfunctioning"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "problem",
                trap_type: "paraphrase 'leaving black smudges' thành 'smudged documents'",
                correct_reason: "Man: 'leaving black smudges on all our client brochures'",
                explanation_vi: "Người đàn ông báo sự cố máy in làm lem mực đen trên tờ gấp (smudged documents). Chọn A."
            },
            {
                id: "p3_s03_q02",
                q: "Why is the deadline urgent?",
                options: [
                    "A. An executive needs copies for a three o'clock meeting",
                    "B. An external audit is scheduled for tomorrow",
                    "C. The print shop closes at noon",
                    "D. A mail delivery courier is arriving soon"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "detail",
                trap_type: "bẫy số liệu thời gian",
                correct_reason: "Man: 'Vice President Miller needs fifty printed copies... for his presentation at three o'clock today.'",
                explanation_vi: "Phó chủ tịch cần 50 bản in cho bài thuyết trình lúc 3 giờ chiều nay. Chọn A."
            },
            {
                id: "p3_s03_q03",
                q: "What does the woman say she will do next?",
                options: [
                    "A. Order new toner cartridges online",
                    "B. Go upstairs with a technician to replace a part",
                    "C. Send an email to all Marketing staff",
                    "D. Ask the vice president to postpone his talk"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "next_action",
                trap_type: "từ gây nhiễu hành động",
                correct_reason: "Woman: 'I will head upstairs with a technician right away. It should take us less than twenty minutes to swap the roller...'",
                explanation_vi: "Người phụ nữ cam kết sẽ lên tầng cùng kỹ thuật viên để thay thế linh kiện (swap the roller = replace a part). Chọn B."
            }
        ]
    },
    {
        setId: "p3_set04",
        part: 3,
        setNumber: 4,
        topic: "Đi công tác & Đặt vé máy bay",
        accent: "US",
        secondaryAccent: "UK",
        speakers: [
            { name: "Woman", accent: "en-US", role: "Executive Assistant (Karen)" },
            { name: "Man", accent: "en-GB", role: "Regional Sales Director (Greg)" }
        ],
        audioScript: `Woman: Greg, I was reviewing your travel itinerary for the medical equipment expo in Chicago next week. Airline tickets are getting quite expensive.
Man: Yes, I noticed that too Karen. What options did our corporate travel agency suggest?
Woman: Well, flying out on Tuesday morning costs nearly eight hundred dollars, but if you depart Monday evening instead, the fare drops to four hundred and twenty dollars.
Man: Let's book the Monday evening flight then. The savings are substantial, and it will give me extra time to meet our Midwest sales representatives for dinner.`,
        transcript: `Woman: Greg, I was reviewing your travel itinerary for the medical equipment expo in Chicago next week. Airline tickets are getting quite expensive.
Man: Yes, I noticed that too Karen. What options did our corporate travel agency suggest?
Woman: Well, flying out on Tuesday morning costs nearly eight hundred dollars, but if you depart Monday evening instead, the fare drops to four hundred and twenty dollars.
Man: Let's book the Monday evening flight then. The savings are substantial, and it will give me extra time to meet our Midwest sales representatives for dinner.`,
        translation_vi: `Nữ: Greg, tôi vừa xem lại lịch trình chuyến đi của bạn tới triển lãm thiết bị y tế ở Chicago vào tuần tới. Vé máy bay đang đắt lên khá nhiều.
Nam: Vâng, tôi cũng nhận thấy điều đó Karen. Đại lý du lịch công ty chúng ta gợi ý những lựa chọn nào?
Nữ: À, bay vào sáng thứ Ba tốn gần 800 đô, nhưng nếu bạn khởi hành vào tối thứ Hai, giá vé giảm xuống chỉ còn 420 đô.
Nam: Vậy hãy đặt chuyến bay tối thứ Hai đi. Khoản tiết kiệm được là rất đáng kể, vả lại tôi sẽ có thêm thời gian gặp gỡ các đại diện bán hàng khu vực Trung Tây để ăn tối.`,
        questions: [
            {
                id: "p3_s04_q01",
                q: "What is the main topic of the conversation?",
                options: [
                    "A. Booking business travel arrangements",
                    "B. Designing medical equipment prototypes",
                    "C. Organizing an office dinner party",
                    "D. Negotiating a commercial hotel contract"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "main_idea",
                trap_type: "paraphrase tổng quan",
                correct_reason: "Woman: 'I was reviewing your travel itinerary for the medical equipment expo...'",
                explanation_vi: "Đoạn hội thoại thảo luận về việc sắp xếp chuyến đi công tác (travel itinerary/booking business travel). Chọn A."
            },
            {
                id: "p3_s04_q02",
                q: "What advantage does departing on Monday offer?",
                options: [
                    "A. It includes first-class seating upgrade",
                    "B. The ticket price is significantly lower",
                    "C. The flight duration is much shorter",
                    "D. Hotel shuttle service is provided for free"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "bẫy số liệu giá cả",
                correct_reason: "Woman: 'fare drops to four hundred and twenty dollars' & Man: 'The savings are substantial'",
                explanation_vi: "Bay tối thứ Hai giúp giảm giá vé từ $800 xuống $420 (giá vé thấp hơn đáng kể). Chọn B."
            },
            {
                id: "p3_s04_q03",
                q: "What does the man plan to do on Monday evening?",
                options: [
                    "A. Prepare his presentation slides in the hotel room",
                    "B. Have dinner with regional sales colleagues",
                    "C. Attend the expo opening ceremony",
                    "D. Visit a medical device manufacturing facility"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "từ gây nhiễu hoạt động",
                correct_reason: "Man: 'it will give me extra time to meet our Midwest sales representatives for dinner.'",
                explanation_vi: "Người đàn ông dự định ăn tối cùng các đại diện bán hàng khu vực (meet sales representatives for dinner). Chọn B."
            }
        ]
    },
    {
        setId: "p3_set05",
        part: 3,
        setNumber: 5,
        topic: "Tiếp thị & Ngân sách quảng cáo",
        accent: "CA",
        secondaryAccent: "AU",
        speakers: [
            { name: "Man", accent: "en-CA", role: "Marketing Director (Brian)" },
            { name: "Woman", accent: "en-AU", role: "Digital Campaign Strategist (Sophia)" }
        ],
        audioScript: `Man: Sophia, our preliminary analytics show that online video ads generated thirty percent more web traffic than static banners last month.
Woman: That is impressive Brian! However, producing high-definition video advertisements requires approximately double our current monthly creative budget.
Man: I discussed this with the executive committee yesterday, and they agreed to reallocate unused funds from our print advertising account.
Woman: Wonderful! In that case, I will reach out to our freelance video production agency this afternoon to storyboard three new product clips.`,
        transcript: `Man: Sophia, our preliminary analytics show that online video ads generated thirty percent more web traffic than static banners last month.
Woman: That is impressive Brian! However, producing high-definition video advertisements requires approximately double our current monthly creative budget.
Man: I discussed this with the executive committee yesterday, and they agreed to reallocate unused funds from our print advertising account.
Woman: Wonderful! In that case, I will reach out to our freelance video production agency this afternoon to storyboard three new product clips.`,
        translation_vi: `Nam: Sophia, số liệu phân tích sơ bộ cho thấy quảng cáo video trực tuyến tạo ra lượng truy cập web nhiều hơn 30% so với biểu ngữ tĩnh vào tháng trước.
Nữ: Thật ấn tượng Brian! Tuy nhiên, việc sản xuất quảng cáo video độ nét cao đòi hỏi ngân sách sáng tạo hàng tháng gần như gấp đôi hiện tại.
Nam: Tôi đã thảo luận điều này với ban điều hành ngày hôm qua, và họ đã đồng ý tái phân bổ các quỹ chưa sử dụng từ tài khoản quảng cáo in ấn sang.
Nữ: Tuyệt vời! Trong trường hợp đó, chiều nay tôi sẽ liên hệ với công ty sản xuất video độc lập để lên kịch bản hình ảnh cho ba đoạn clip sản phẩm mới.`,
        questions: [
            {
                id: "p3_s05_q01",
                q: "What marketing strategy proved successful last month?",
                options: [
                    "A. Distributing flyers in shopping centers",
                    "B. Running online video advertisements",
                    "C. Sponsoring a regional charity marathon",
                    "D. Offering buy-one-get-one coupons in magazines"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "paraphrase",
                correct_reason: "Man: 'online video ads generated thirty percent more web traffic than static banners'",
                explanation_vi: "Quảng cáo video trực tuyến (online video ads) đạt hiệu quả cao hơn 30% lưu lượng truy cập so với banner tĩnh. Chọn B."
            },
            {
                id: "p3_s05_q02",
                q: "How will the extra production costs be covered?",
                options: [
                    "A. By taking out a short-term commercial loan",
                    "B. By charging customers a premium platform fee",
                    "C. By reallocating funds from print advertising",
                    "D. By partnering with an external investor"
                ],
                ans: 2,
                ansLetter: "C",
                question_type: "detail",
                trap_type: "paraphrase 'reallocate unused funds from print advertising'",
                correct_reason: "Man: 'agreed to reallocate unused funds from our print advertising account.'",
                explanation_vi: "Ban điều hành duyệt chuyển tiền từ quỹ quảng cáo in ấn chưa dùng (reallocating funds from print advertising). Chọn C."
            },
            {
                id: "p3_s05_q03",
                q: "What will the woman do this afternoon?",
                options: [
                    "A. Contact a video production agency",
                    "B. Present to the executive board",
                    "C. Cancel the print magazine contract",
                    "D. Review customer satisfaction surveys"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "next_action",
                trap_type: "từ gây nhiễu hành động",
                correct_reason: "Woman: 'I will reach out to our freelance video production agency this afternoon...'",
                explanation_vi: "Người phụ nữ sẽ liên hệ với đơn vị sản xuất video (reach out to video production agency). Chọn A."
            }
        ]
    },
    {
        setId: "p3_set06",
        part: 3,
        setNumber: 6,
        topic: "Nhân sự & Đào tạo nội bộ (Intent Question)",
        accent: "US",
        secondaryAccent: "UK",
        speakers: [
            { name: "Man", accent: "en-US", role: "Team Supervisor (Kevin)" },
            { name: "Woman", accent: "en-GB", role: "HR Coordinator (Elena)" }
        ],
        audioScript: `Man: Elena, several of my senior technicians asked if they could skip Friday's mandatory cybersecurity workshop because they are behind on client project deliverables.
Woman: Well, corporate compliance requires one hundred percent attendance records for our annual cybersecurity audit. My hands are tied.
Man: I see. Could we perhaps offer them an online recorded version that they can complete over the weekend instead?
Woman: Actually, the IT compliance team just approved self-paced modules yesterday. I will send your team the registration link right away.`,
        transcript: `Man: Elena, several of my senior technicians asked if they could skip Friday's mandatory cybersecurity workshop because they are behind on client project deliverables.
Woman: Well, corporate compliance requires one hundred percent attendance records for our annual cybersecurity audit. My hands are tied.
Man: I see. Could we perhaps offer them an online recorded version that they can complete over the weekend instead?
Woman: Actually, the IT compliance team just approved self-paced modules yesterday. I will send your team the registration link right away.`,
        translation_vi: `Nam: Elena, vài kỹ thuật viên cấp cao của tôi hỏi xem họ có thể xin nghỉ buổi tập huấn an ninh mạng bắt buộc vào thứ Sáu không vì họ đang bị trễ tiến độ dự án của khách hàng.
Nữ: Ồ, quy định tuân thủ của tập đoàn đòi hỏi 100% tỷ lệ tham dự để phục vụ đợt kiểm toán an ninh mạng hàng năm. Tôi bị trói tay rồi (Tôi không có quyền quyết định khác đi).
Nam: Tôi hiểu rồi. Liệu chúng ta có thể cho họ học bản ghi hình trực tuyến để họ hoàn thành trong dịp cuối tuần được không?
Nữ: Thật ra, đội tuân thủ IT vừa phê duyệt các học phần tự học theo tiến độ vào hôm qua. Tôi sẽ gửi cho nhóm của bạn liên kết đăng ký ngay.`,
        questions: [
            {
                id: "p3_s06_q01",
                q: "What request does the man make?",
                options: [
                    "A. To allow staff members to miss a training session",
                    "B. To reschedule a client project presentation",
                    "C. To hire additional external cybersecurity consultants",
                    "D. To purchase new antivirus software licenses"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "detail",
                trap_type: "paraphrase 'skip Friday mandatory workshop'",
                correct_reason: "Man: 'asked if they could skip Friday's mandatory cybersecurity workshop'",
                explanation_vi: "Người đàn ông xin phép cho nhân viên của mình không tham dự buổi tập huấn bắt buộc (miss a training session). Chọn A."
            },
            {
                id: "p3_s06_q02",
                q: "What does the woman mean when she says: 'My hands are tied'?",
                options: [
                    "A. She is physically unable to type on the computer",
                    "B. She lacks the authority to make an exception to company policy",
                    "C. She is overwhelmed by too many pending tasks",
                    "D. She disagrees with the cybersecurity audit requirements"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "intent",
                trap_type: "nghĩa đen vs nghĩa bóng của thành ngữ ETS",
                correct_reason: "Woman: 'corporate compliance requires one hundred percent attendance... My hands are tied.'",
                explanation_vi: "Câu hỏi ý định (Intent question): Cụm 'My hands are tied' là thành ngữ chỉ việc người nói không thể giúp hay tạo ngoại lệ do bị ràng buộc bởi luật lệ/chính sách công ty (lacks the authority to make an exception). Chọn B."
            },
            {
                id: "p3_s06_q03",
                q: "What alternative solution is agreed upon?",
                options: [
                    "A. Taking a proctored written exam next Monday",
                    "B. Completing self-paced online training modules",
                    "C. Attending a workshop at the regional branch",
                    "D. Writing a project exemption essay"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "next_action",
                trap_type: "từ gây nhiễu phương án",
                correct_reason: "Woman: 'the IT compliance team just approved self-paced modules yesterday...'",
                explanation_vi: "Giải pháp thay thế là học trực tuyến tự chủ tiến độ (self-paced online training modules). Chọn B."
            }
        ]
    },
    {
        setId: "p3_set07",
        part: 3,
        setNumber: 7,
        topic: "Bán lẻ & Chính sách đổi trả",
        accent: "UK",
        secondaryAccent: "CA",
        speakers: [
            { name: "Man", accent: "en-GB", role: "Customer (Arthur)" },
            { name: "Woman", accent: "en-CA", role: "Store Associate (Chloe)" }
        ],
        audioScript: `Man: Good morning. I purchased this wireless Bluetooth headset here two weeks ago, but the left earpiece has completely stopped charging.
Woman: I am sorry to hear that sir. If you have the original store purchase receipt and the original packaging, we can issue an exchange for a brand-new unit right away.
Man: I brought the sales receipt and the original box with all the accessories.
Woman: Excellent. Let me inspect the serial number. Since this model is currently in stock on aisle four, I will process the replacement at this register.`,
        transcript: `Man: Good morning. I purchased this wireless Bluetooth headset here two weeks ago, but the left earpiece has completely stopped charging.
Woman: I am sorry to hear that sir. If you have the original store purchase receipt and the original packaging, we can issue an exchange for a brand-new unit right away.
Man: I brought the sales receipt and the original box with all the accessories.
Woman: Excellent. Let me inspect the serial number. Since this model is currently in stock on aisle four, I will process the replacement at this register.`,
        translation_vi: `Nam: Chào cô. Tôi mua tai nghe Bluetooth không dây này ở đây hai tuần trước, nhưng tai nghe bên trái đã hoàn toàn ngừng nhận sạc.
Nữ: Tôi rất tiếc khi nghe điều đó thưa quý khách. Nếu ông có hóa đơn mua hàng gốc và vỏ hộp ban đầu, chúng tôi có thể đổi cho ông một chiếc mới nguyên seal ngay lập tức.
Nam: Tôi có mang theo hóa đơn mua hàng và hộp gốc với đầy đủ phụ kiện đây.
Nữ: Tuyệt vời. Để tôi kiểm tra số seri. Vì mẫu này hiện đang có sẵn trên dãy hàng số 4, tôi sẽ thực hiện đổi mới ngay tại quầy thu ngân này.`,
        questions: [
            {
                id: "p3_s07_q01",
                q: "What item is the man returning?",
                options: [
                    "A. A wireless computer mouse",
                    "B. A Bluetooth audio headset",
                    "C. A portable tablet charger",
                    "D. A digital voice recorder"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "từ đồng nghĩa 'headset'",
                correct_reason: "Man: 'purchased this wireless Bluetooth headset here two weeks ago'",
                explanation_vi: "Khách hàng mang đổi tai nghe Bluetooth không dây (Bluetooth audio headset). Chọn B."
            },
            {
                id: "p3_s07_q02",
                q: "What requirement did the store associate mention for an exchange?",
                options: [
                    "A. Bringing a valid passport for verification",
                    "B. Having the original receipt and packaging",
                    "C. Paying a restocking inspection fee",
                    "D. Submitting a warranty claim form online"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "paraphrase điều kiện đổi trả",
                correct_reason: "Woman: 'If you have the original store purchase receipt and the original packaging...'",
                explanation_vi: "Điều kiện đổi hàng là có hóa đơn mua gốc và bao bì ban đầu (original receipt and packaging). Chọn B."
            },
            {
                id: "p3_s07_q03",
                q: "What will the woman do next?",
                options: [
                    "A. Process a product replacement",
                    "B. Issue a cash refund",
                    "C. Call the store general manager",
                    "D. Order a replacement unit from the factory"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "next_action",
                trap_type: "từ gây nhiễu hành động thu ngân",
                correct_reason: "Woman: 'I will process the replacement at this register.'",
                explanation_vi: "Người phụ nữ nói sẽ thực hiện quy trình đổi máy mới ngay tại quầy (process a product replacement). Chọn A."
            }
        ]
    },
    {
        setId: "p3_set08",
        part: 3,
        setNumber: 8,
        topic: "Hội nghị & Diễn giả khách mời",
        accent: "AU",
        secondaryAccent: "US",
        speakers: [
            { name: "Woman", accent: "en-AU", role: "Conference Organizer (Vanessa)" },
            { name: "Man", accent: "en-US", role: "Event Manager (Marcus)" }
        ],
        audioScript: `Woman: Marcus, Professor Tanaka's flight from Tokyo has been delayed by three hours, which means he won't land in time to deliver his morning keynote address.
Man: That is troublesome because over three hundred attendees registered specifically for his renewable energy session.
Woman: How about we shift his speech to the afternoon slot at two o'clock and move Dr. Sarah Collins' panel discussion to the morning instead?
Man: That's a sensible solution. I will update the digital schedule screens in the foyer and send an instant push notification via our conference mobile app.`,
        transcript: `Woman: Marcus, Professor Tanaka's flight from Tokyo has been delayed by three hours, which means he won't land in time to deliver his morning keynote address.
Man: That is troublesome because over three hundred attendees registered specifically for his renewable energy session.
Woman: How about we shift his speech to the afternoon slot at two o'clock and move Dr. Sarah Collins' panel discussion to the morning instead?
Man: That's a sensible solution. I will update the digital schedule screens in the foyer and send an instant push notification via our conference mobile app.`,
        translation_vi: `Nữ: Marcus, chuyến bay của Giáo sư Tanaka từ Tokyo bị trễ 3 tiếng, đồng nghĩa với việc ông ấy sẽ không kịp hạ cánh để trình bày bài diễn văn chính vào buổi sáng.
Nam: Rắc rối đấy vì có hơn 300 người đăng ký tham dự chủ yếu vì phiên thảo luận về năng lượng tái tạo của ông ấy.
Nữ: Hay là chúng ta chuyển bài nói của ông ấy sang khung giờ chiều lúc 2 giờ, và đưa tọa đàm của Tiến sĩ Sarah Collins lên buổi sáng thay thế?
Nam: Đó là giải pháp hợp lý. Tôi sẽ cập nhật màn hình hiển thị lịch trình điện tử ở sảnh chờ và gửi thông báo đẩy tức thì qua ứng dụng di động của hội nghị.`,
        questions: [
            {
                id: "p3_s08_q01",
                q: "What event problem are the speakers discussing?",
                options: [
                    "A. A keynote speaker's delayed arrival",
                    "B. A catering company cancelation",
                    "C. A power outage in the main auditorium",
                    "D. Low attendance ticket sales"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "problem",
                trap_type: "paraphrase 'flight delayed by three hours'",
                correct_reason: "Woman: 'Professor Tanaka's flight from Tokyo has been delayed by three hours... won't land in time'",
                explanation_vi: "Vấn đề sự kiện là diễn giả chính bị trễ chuyến bay không kịp thuyết trình sáng (speaker's delayed arrival). Chọn A."
            },
            {
                id: "p3_s08_q02",
                q: "What adjustment does the woman recommend?",
                options: [
                    "A. Canceling the renewable energy session entirely",
                    "B. Swapping the morning and afternoon speaking slots",
                    "C. Streaming the keynote lecture via video conference",
                    "D. Refunding registration fees to all attendees"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "suggestion",
                trap_type: "paraphrase hoán đổi lịch trình",
                correct_reason: "Woman: 'shift his speech to the afternoon slot... and move Dr. Sarah Collins' panel discussion to the morning'",
                explanation_vi: "Người phụ nữ đề xuất hoán đổi khung giờ diễn thuyết buổi sáng và buổi chiều (swapping morning and afternoon speaking slots). Chọn B."
            },
            {
                id: "p3_s08_q03",
                q: "How will conference attendees be notified of the change?",
                options: [
                    "A. By verbal announcements in the hotel lobby",
                    "B. Through digital screens and a mobile app notification",
                    "C. Via printed leaflets distributed at the entrance",
                    "D. By automated text messages to cell phones"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "kết hợp hai phương thức thông báo trong câu",
                correct_reason: "Man: 'update the digital schedule screens in the foyer and send an instant push notification via our conference mobile app.'",
                explanation_vi: "Người nghe sẽ được thông báo qua màn hình điện tử ở sảnh và thông báo ứng dụng điện thoại (digital screens and a mobile app notification). Chọn B."
            }
        ]
    },
    {
        setId: "p3_set09",
        part: 3,
        setNumber: 9,
        topic: "Bảo trì tòa nhà & Thẻ ra vào",
        accent: "CA",
        secondaryAccent: "UK",
        speakers: [
            { name: "Man", accent: "en-CA", role: "Facility Manager (Dan)" },
            { name: "Woman", accent: "en-GB", role: "Office Administrator (Paula)" }
        ],
        audioScript: `Man: Paula, please be aware that the building management company will be upgrading the magnetic electronic lock systems on the fourth and fifth floors this Saturday.
Woman: Thanks for letting me know Dan. Does that mean our accounting staff won't be able to enter the office to work overtime this weekend?
Man: Staff can still gain entry, but they must check in at the ground floor security desk and show their employee photo ID to obtain a temporary visitor pass.
Woman: Got it. I will draft an announcement email and distribute it to all department managers before five o'clock today.`,
        transcript: `Man: Paula, please be aware that the building management company will be upgrading the magnetic electronic lock systems on the fourth and fifth floors this Saturday.
Woman: Thanks for letting me know Dan. Does that mean our accounting staff won't be able to enter the office to work overtime this weekend?
Man: Staff can still gain entry, but they must check in at the ground floor security desk and show their employee photo ID to obtain a temporary visitor pass.
Woman: Got it. I will draft an announcement email and distribute it to all department managers before five o'clock today.`,
        translation_vi: `Nam: Paula, xin lưu ý là công ty quản lý tòa nhà sẽ nâng cấp hệ thống khóa từ điện tử ở tầng 4 và tầng 5 vào thứ Bảy này.
Nữ: Cảm ơn Dan đã báo. Điều đó có nghĩa là nhân viên kế toán của chúng ta sẽ không thể vào văn phòng để làm thêm giờ dịp cuối tuần này đúng không?
Nam: Nhân viên vẫn có thể vào, nhưng họ phải làm thủ tục đăng ký tại bàn bảo vệ tầng trệt và xuất trình thẻ căn cước nhân viên để lấy thẻ khách tạm thời.
Nữ: Tôi hiểu rồi. Tôi sẽ soạn thảo một email thông báo và gửi tới tất cả các trưởng phòng trước 5 giờ chiều hôm nay.`,
        questions: [
            {
                id: "p3_s09_q01",
                q: "What maintenance work is scheduled for Saturday?",
                options: [
                    "A. Replacing elevator cables",
                    "B. Upgrading electronic door lock systems",
                    "C. Repainting hallway walls",
                    "D. Cleaning office window exteriors"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "paraphrase 'magnetic electronic lock systems'",
                correct_reason: "Man: 'upgrading the magnetic electronic lock systems on the fourth and fifth floors'",
                explanation_vi: "Lịch bảo trì thứ Bảy là nâng cấp hệ thống khóa cửa điện tử (upgrading electronic door lock systems). Chọn B."
            },
            {
                id: "p3_s09_q02",
                q: "What must weekend workers do to enter the premises?",
                options: [
                    "A. Call the building facility director in advance",
                    "B. Check in with security and show employee ID",
                    "C. Use the rear freight elevator entrance",
                    "D. Pay a weekend facility usage surcharge"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "paraphrase quy trình đăng ký",
                correct_reason: "Man: 'check in at the ground floor security desk and show their employee photo ID'",
                explanation_vi: "Nhân viên làm cuối tuần phải đăng ký với bảo vệ và xuất trình thẻ nhân viên (check in with security and show employee ID). Chọn B."
            },
            {
                id: "p3_s09_q03",
                q: "What does the woman promise to do?",
                options: [
                    "A. Postpone the weekend accounting audit",
                    "B. Send an informational email to department heads",
                    "C. Distribute temporary keycards in person",
                    "D. Inspect the door locks on Friday evening"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "next_action",
                trap_type: "paraphrase 'department managers' thành 'department heads'",
                correct_reason: "Woman: 'I will draft an announcement email and distribute it to all department managers...'",
                explanation_vi: "Người phụ nữ hứa sẽ gửi email thông báo cho các trưởng phòng (department heads). Chọn B."
            }
        ]
    },
    {
        setId: "p3_set10",
        part: 3,
        setNumber: 10,
        topic: "Lịch hội thảo đào tạo (Graphic Question)",
        accent: "US",
        secondaryAccent: "AU",
        speakers: [
            { name: "Woman", accent: "en-US", role: "Employee (Hannah)" },
            { name: "Man", accent: "en-AU", role: "Senior Colleague (Tom)" }
        ],
        graphic: {
            type: "table",
            title: "Professional Development Workshop Schedule (Room 302)",
            columns: ["Time", "Workshop Title", "Instructor"],
            rows: [
                ["9:00 AM - 10:30 AM", "Advanced Data Visualization", "Dr. Robert Vance"],
                ["11:00 AM - 12:30 PM", "Strategic Budget Negotiation", "Ms. Patricia Cole"],
                ["1:30 PM - 3:00 PM", "Cross-Functional Leadership", "Mr. Arthur Young"],
                ["3:30 PM - 5:00 PM", "AI Tools for Business Workflow", "Dr. Emily Zhang"]
            ]
        },
        audioScript: `Woman: Tom, are you going to attend any of the professional development sessions in Room 302 this Thursday?
Man: Definitely. I really need help refining our department quarterly projections, so I am planning on attending the session led by Patricia Cole.
Woman: Oh, Patricia is an expert at financial modeling. Just remember to bring your company laptop because her workshop involves practical spreadsheet exercises.
Man: Thanks for the heads up! I will also make sure to download the financial dataset from the employee portal before the session starts.`,
        transcript: `Woman: Tom, are you going to attend any of the professional development sessions in Room 302 this Thursday?
Man: Definitely. I really need help refining our department quarterly projections, so I am planning on attending the session led by Patricia Cole.
Woman: Oh, Patricia is an expert at financial modeling. Just remember to bring your company laptop because her workshop involves practical spreadsheet exercises.
Man: Thanks for the heads up! I will also make sure to download the financial dataset from the employee portal before the session starts.`,
        translation_vi: `Nữ: Tom, bạn có tham gia buổi phát triển chuyên môn nào ở Phòng 302 vào thứ Năm này không?
Nam: Chắc chắn rồi. Tôi thực sự cần trợ giúp để hoàn thiện bản dự báo hàng quý của phòng ban chúng ta, nên tôi dự định tham dự buổi do cô Patricia Cole giảng dạy.
Nữ: Ồ, Patricia là một chuyên gia về mô hình hóa tài chính đấy. Nhớ mang theo máy tính xách tay của công ty nhé vì buổi của cô ấy có bài tập bảng tính thực hành.
Nam: Cảm ơn bạn đã báo trước! Tôi cũng sẽ đảm bảo tải bộ dữ liệu tài chính từ cổng thông tin nhân viên trước khi buổi học bắt đầu.`,
        questions: [
            {
                id: "p3_s10_q01",
                q: "What topic is the man trying to improve on?",
                options: [
                    "A. Public speaking techniques",
                    "B. Quarterly financial and budget projections",
                    "C. Artificial intelligence coding",
                    "D. Conflict resolution strategies"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "paraphrase 'refining quarterly projections'",
                correct_reason: "Man: 'refining our department quarterly projections'",
                explanation_vi: "Người đàn ông muốn hoàn thiện bản dự báo tài chính hàng quý (quarterly financial and budget projections). Chọn B."
            },
            {
                id: "p3_s10_q02",
                q: "Look at the graphic. What time does the workshop the man wants to attend begin?",
                options: [
                    "A. 9:00 AM",
                    "B. 11:00 AM",
                    "C. 1:30 PM",
                    "D. 3:30 PM"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "graphic",
                trap_type: "đọc đối chiếu bảng biểu graphic với tên diễn giả",
                correct_reason: "Man: 'attending the session led by Patricia Cole.' Đối chiếu bảng: Patricia Cole hướng dẫn buổi 'Strategic Budget Negotiation' lúc 11:00 AM - 12:30 PM.",
                explanation_vi: "Câu hỏi bảng biểu (Graphic question): Người đàn ông tham dự buổi của Patricia Cole. Tra bảng: Patricia Cole dạy lúc 11:00 AM. Chọn B."
            },
            {
                id: "p3_s10_q03",
                q: "What does the woman advise the man to bring?",
                options: [
                    "A. A notebook and pen",
                    "B. His company laptop",
                    "C. A printed training manual",
                    "D. His business cards"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "next_action",
                trap_type: "từ gây nhiễu vật dụng",
                correct_reason: "Woman: 'Just remember to bring your company laptop because her workshop involves practical spreadsheet exercises.'",
                explanation_vi: "Người phụ nữ nhắc nhở mang theo máy tính xách tay công ty (company laptop). Chọn B."
            }
        ]
    },
    {
        setId: "p3_set11",
        part: 3,
        setNumber: 11,
        topic: "Sơ đồ tầng văn phòng (Graphic Question)",
        accent: "UK",
        secondaryAccent: "US",
        speakers: [
            { name: "Man", accent: "en-GB", role: "Security Receptionist (Gary)" },
            { name: "Woman", accent: "en-US", role: "Visiting Auditor (Claire)" }
        ],
        graphic: {
            type: "floor_plan",
            title: "Executive Building - Level 4 Directory",
            columns: ["Suite", "Department", "Contact Person"],
            rows: [
                ["Suite 401", "Corporate Legal Counsel", "Mr. Harold Barnes"],
                ["Suite 402", "Taxation & Internal Audit", "Ms. Janice Bennett"],
                ["Suite 403", "Human Resources & Payroll", "Mr. Liam Taylor"],
                ["Suite 404", "Executive Boardroom", "Reception Desk"]
            ]
        },
        audioScript: `Man: Good morning. Welcome to Meridian Tower. How may I assist you today?
Woman: Good morning. I am Claire Jenkins from Apex Consulting. I have a ten o'clock appointment with Janice Bennett to review the tax audit paperwork.
Man: Certainly, Ms. Jenkins. Let me issue your visitor security pass. Please take the express elevator to the fourth floor. Her office is located directly adjacent to the legal counsel suite.
Woman: Thank you very much for your guidance. Have a wonderful day!`,
        transcript: `Man: Good morning. Welcome to Meridian Tower. How may I assist you today?
Woman: Good morning. I am Claire Jenkins from Apex Consulting. I have a ten o'clock appointment with Janice Bennett to review the tax audit paperwork.
Man: Certainly, Ms. Jenkins. Let me issue your visitor security pass. Please take the express elevator to the fourth floor. Her office is located directly adjacent to the legal counsel suite.
Woman: Thank you very much for your guidance. Have a wonderful day!`,
        translation_vi: `Nam: Chào buổi sáng. Chào mừng quý khách đến với Tháp Meridian. Tôi có thể giúp gì cho quý khách hôm nay?
Nữ: Chào anh. Tôi là Claire Jenkins từ công ty Tư vấn Apex. Tôi có hẹn lúc 10 giờ với cô Janice Bennett để xem lại hồ sơ kiểm toán thuế.
Nam: Vâng, thưa bà Jenkins. Để tôi cấp thẻ an ninh cho khách. Xin mời bà đi thang máy tốc hành lên tầng 4. Văn phòng của cô ấy nằm ngay cạnh phòng cố vấn pháp lý.
Nữ: Cảm ơn anh rất nhiều vì đã chỉ đường. Chúc anh một ngày tốt lành!`,
        questions: [
            {
                id: "p3_s11_q01",
                q: "Why is the woman visiting Meridian Tower?",
                options: [
                    "A. To attend a job interview in Human Resources",
                    "B. To conduct a tax audit review with Ms. Bennett",
                    "C. To install security software on Level 4",
                    "D. To deliver office supplies to Suite 404"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "main_idea",
                trap_type: "chi tiết mục đích cuộc hẹn",
                correct_reason: "Woman: 'appointment with Janice Bennett to review the tax audit paperwork.'",
                explanation_vi: "Mục đích đến là để xem xét hồ sơ kiểm toán thuế cùng cô Bennett (conduct a tax audit review). Chọn B."
            },
            {
                id: "p3_s11_q02",
                q: "Look at the graphic. Which suite will the woman visit?",
                options: [
                    "A. Suite 401",
                    "B. Suite 402",
                    "C. Suite 403",
                    "D. Suite 404"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "graphic",
                trap_type: "đối chiếu sơ đồ bảng danh mục phòng ban",
                correct_reason: "Woman: 'appointment with Janice Bennett'. Đối chiếu bảng: Janice Bennett phụ trách phòng Taxation & Internal Audit tại Suite 402.",
                explanation_vi: "Câu hỏi bảng biểu (Graphic question): Khách hẹn với Janice Bennett. Tra danh bạ tầng 4: Janice Bennett ở Suite 402. Chọn B."
            },
            {
                id: "p3_s11_q03",
                q: "What does the receptionist provide to the woman?",
                options: [
                    "A. A parking validation coupon",
                    "B. A visitor security pass",
                    "C. A printed company brochure",
                    "D. A bottle of mineral water"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "từ gây nhiễu vật phẩm quầy lễ tân",
                correct_reason: "Man: 'Let me issue your visitor security pass.'",
                explanation_vi: "Lễ tân cấp thẻ an ninh khách cho cô Jenkins (visitor security pass). Chọn B."
            }
        ]
    },
    {
        setId: "p3_set12",
        part: 3,
        setNumber: 12,
        topic: "Bảng báo giá dịch vụ (Graphic Question)",
        accent: "CA",
        secondaryAccent: "AU",
        speakers: [
            { name: "Woman", accent: "en-CA", role: "Catering Manager (Rachel)" },
            { name: "Man", accent: "en-AU", role: "Corporate Client (Martin)" }
        ],
        graphic: {
            type: "pricing_table",
            title: "Bayside Catering - Buffet Package Options",
            columns: ["Package Tier", "Price Per Guest", "Included Features"],
            rows: [
                ["Bronze Tier", "$25", "Standard buffet, soft drinks, paper cutlery"],
                ["Silver Tier", "$40", "Full hot buffet, dessert bar, ceramic tableware"],
                ["Gold Tier", "$60", "Gourmet carving station, wine pairing, dedicated waitstaff"],
                ["Platinum Tier", "$85", "Seafood bar, champagne toast, floral centerpieces"]
            ]
        },
        audioScript: `Woman: Thank you for considering Bayside Catering for your company anniversary banquet Martin.
Man: We are expecting approximately eighty employees. We definitely want real ceramic tableware and a dedicated dessert bar, but our budget cannot stretch to gourmet carving stations or wine pairings.
Woman: In that case, I have the ideal package tier for your group. Furthermore, since your event is booked on a Thursday, our corporate loyalty discount of ten percent will apply to the total bill.
Man: That sounds like a wonderful deal Rachel. Please draft the formal catering contract and email it to my office today.`,
        transcript: `Woman: Thank you for considering Bayside Catering for your company anniversary banquet Martin.
Man: We are expecting approximately eighty employees. We definitely want real ceramic tableware and a dedicated dessert bar, but our budget cannot stretch to gourmet carving stations or wine pairings.
Woman: In that case, I have the ideal package tier for your group. Furthermore, since your event is booked on a Thursday, our corporate loyalty discount of ten percent will apply to the total bill.
Man: That sounds like a wonderful deal Rachel. Please draft the formal catering contract and email it to my office today.`,
        translation_vi: `Nữ: Cảm ơn anh Martin đã cân nhắc Bayside Catering cho tiệc kỷ niệm thành lập công ty.
Nam: Chúng tôi dự kiến có khoảng 80 nhân viên. Chúng tôi chắc chắn muốn có bát đĩa sứ thật và một quầy tráng miệng riêng, nhưng ngân sách không đủ cho các quầy thịt nướng cao cấp hay rượu vang kết hợp.
Nữ: Trong trường hợp đó, tôi có gói dịch vụ lý tưởng cho quý công ty. Hơn nữa, vì sự kiện được đặt vào thứ Năm, chiết khấu khách hàng thân thiết 10% sẽ được áp dụng cho tổng hóa đơn.
Nam: Nghe thật tuyệt vời Rachel. Xin hãy soạn thảo hợp đồng dịch vụ chính thức và gửi email đến văn phòng tôi hôm nay nhé.`,
        questions: [
            {
                id: "p3_s12_q01",
                q: "What event is the man planning?",
                options: [
                    "A. A company anniversary banquet",
                    "B. A retirement party for a founder",
                    "C. A client product demonstration dinner",
                    "D. A holiday charity fundraiser"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "main_idea",
                trap_type: "paraphrase sự kiện công ty",
                correct_reason: "Woman: 'considering Bayside Catering for your company anniversary banquet'",
                explanation_vi: "Sự kiện được chuẩn bị là tiệc kỷ niệm thành lập công ty (company anniversary banquet). Chọn A."
            },
            {
                id: "p3_s12_q02",
                q: "Look at the graphic. Which package tier will the man most likely choose?",
                options: [
                    "A. Bronze Tier",
                    "B. Silver Tier",
                    "C. Gold Tier",
                    "D. Platinum Tier",
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "graphic",
                trap_type: "đối chiếu tính năng dịch vụ yêu cầu với bảng giá",
                correct_reason: "Man: 'ceramic tableware and a dedicated dessert bar, but our budget cannot stretch to gourmet carving stations'. Đối chiếu bảng: Silver Tier ($40) bao gồm ceramic tableware và dessert bar.",
                explanation_vi: "Câu hỏi bảng biểu (Graphic question): Khách muốn có 'ceramic tableware' và 'dessert bar' nhưng từ chối 'gourmet carving'. Tra bảng: Gói phù hợp chính xác là Silver Tier. Chọn B."
            },
            {
                id: "p3_s12_q03",
                q: "What discount is offered for the Thursday booking?",
                options: [
                    "A. Five percent",
                    "B. Ten percent",
                    "C. Fifteen percent",
                    "D. Twenty percent"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "bẫy số liệu phần trăm",
                correct_reason: "Woman: 'corporate loyalty discount of ten percent will apply to the total bill.'",
                explanation_vi: "Ưu đãi đặt vào thứ Năm là giảm giá 10% trên tổng hóa đơn (ten percent). Chọn B."
            }
        ]
    },
    {
        setId: "p3_set13",
        part: 3,
        setNumber: 13,
        topic: "Hội thoại 3 người & Ý định phát ngôn (3 Speakers & Intent)",
        accent: "US",
        secondaryAccent: "UK",
        speakers: [
            { name: "Man 1", accent: "en-US", role: "Warehouse Manager (Steve)" },
            { name: "Woman", accent: "en-GB", role: "Logistics Coordinator (Megan)" },
            { name: "Man 2", accent: "en-US", role: "Truck Driver (Carlos)" }
        ],
        audioScript: `Man 1: Megan, the delivery manifest says we have forty pallets of solar panels scheduled for the Vancouver depot, but Carlos' flatbed truck only has space for thirty pallets.
Woman: That's problematic. The client signed a strict contract guaranteeing full delivery before Friday afternoon.
Man 2: Look, the highway patrol closes the mountain pass for maintenance at five P.M. We don't have all day!
Man 1: Understood Carlos. Megan, let's call Dispatch immediately to send a secondary cargo van to transport the remaining ten pallets so Carlos can leave now.`,
        transcript: `Man 1: Megan, the delivery manifest says we have forty pallets of solar panels scheduled for the Vancouver depot, but Carlos' flatbed truck only has space for thirty pallets.
Woman: That's problematic. The client signed a strict contract guaranteeing full delivery before Friday afternoon.
Man 2: Look, the highway patrol closes the mountain pass for maintenance at five P.M. We don't have all day!
Man 1: Understood Carlos. Megan, let's call Dispatch immediately to send a secondary cargo van to transport the remaining ten pallets so Carlos can leave now.`,
        translation_vi: `Nam 1: Megan, bảng kê hàng ghi chúng ta có 40 pallet pin mặt trời chuyển tới kho Vancouver, nhưng xe tải sàn phẳng của Carlos chỉ đủ chỗ cho 30 pallet.
Nữ: Rắc rối đấy. Khách hàng đã ký hợp đồng nghiêm ngặt cam kết giao đủ toàn bộ trước chiều thứ Sáu.
Nam 2: Này, cảnh sát tuần tra đường cao tốc sẽ đóng đèo núi để bảo trì lúc 5 giờ chiều đấy. Chúng ta không có cả ngày để chần chừ đâu!
Nam 1: Hiểu rồi Carlos. Megan, chúng ta hãy gọi ngay cho bộ phận điều phối xe để cử một xe van chở hàng thứ hai vận chuyển 10 pallet còn lại để Carlos có thể lên đường ngay bây giờ.`,
        questions: [
            {
                id: "p3_s13_q01",
                q: "What logistical problem does the first man describe?",
                options: [
                    "A. A vehicle does not have enough capacity for the entire cargo",
                    "B. The shipping documentation contains incorrect billing rates",
                    "C. Several solar panels were damaged during unloading",
                    "D. A driver lost his commercial trucking license"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "problem",
                trap_type: "paraphrase sức chứa xe tải",
                correct_reason: "Man 1: 'manifest says we have forty pallets... but Carlos' flatbed truck only has space for thirty pallets.'",
                explanation_vi: "Vấn đề là xe tải không đủ sức chứa cho toàn bộ 40 pallet hàng (not enough capacity for entire cargo). Chọn A."
            },
            {
                id: "p3_s13_q02",
                q: "What does the second man mean when he says: 'We don't have all day!'?",
                options: [
                    "A. He wants the team to hurry because time is running out",
                    "B. He refuses to work overtime after five o'clock",
                    "C. He forgot his watch at the security gate",
                    "D. The warehouse closes early for a national holiday"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "intent",
                trap_type: "nghĩa bóng thành ngữ dục dã",
                correct_reason: "Man 2: 'closes the mountain pass for maintenance at five P.M. We don't have all day!'",
                explanation_vi: "Câu hỏi ý định (Intent question): Carlos hối thúc mọi người ra quyết định nhanh vì sắp đến giờ đóng đèo vượt núi (wants the team to hurry because time is running out). Chọn A."
            },
            {
                id: "p3_s13_q03",
                q: "What solution does the first man propose?",
                options: [
                    "A. Leaving the remaining pallets for next week's shipment",
                    "B. Requesting a secondary cargo vehicle from Dispatch",
                    "C. Hiring an external air freight contractor",
                    "D. Asking the customer to pick up the goods"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "next_action",
                trap_type: "paraphrase giải pháp điều xe",
                correct_reason: "Man 1: 'call Dispatch immediately to send a secondary cargo van to transport the remaining ten pallets'",
                explanation_vi: "Giải pháp là gọi điều phối xe gửi thêm một xe van phụ chở nốt 10 pallet còn lại (requesting a secondary cargo vehicle). Chọn B."
            }
        ]
    }
];

// 4. PART 4: 10 SETS × 3 QUESTIONS = 30 QUESTIONS
// Short talks (Voicemail, Airport announcement, Executive talk, Radio traffic/weather, Staff meeting, Museum tour, Commercial, Intent question, Graphic conference timetable, Graphic sales bar chart)
const part4Sets = [
    {
        setId: "p4_set01",
        part: 4,
        setNumber: 1,
        topic: "Tin nhắn thoại hẹn khám bệnh (Telephone Voicemail)",
        accent: "US",
        speakers: [{ name: "Speaker (Dr. Harrison's Office)", accent: "en-US", role: "Medical Receptionist" }],
        audioScript: `Hello, this message is for Mr. Robert Sterling. This is Amanda calling from Oakwood Dental Associates. I am calling regarding your routine dental cleaning and examination scheduled for this Thursday, October fourteenth, at three o'clock in the afternoon. Unfortunately, Dr. Harrison has an emergency dental surgery scheduled at that time and will be unavailable. We would like to reschedule your appointment to Friday morning at ten o'clock or next Monday afternoon at two. Please call our clinic back at 555-0192 by five P.M. today to confirm which time works best for you. We apologize for any inconvenience.`,
        transcript: `Hello, this message is for Mr. Robert Sterling. This is Amanda calling from Oakwood Dental Associates. I am calling regarding your routine dental cleaning and examination scheduled for this Thursday, October fourteenth, at three o'clock in the afternoon. Unfortunately, Dr. Harrison has an emergency dental surgery scheduled at that time and will be unavailable. We would like to reschedule your appointment to Friday morning at ten o'clock or next Monday afternoon at two. Please call our clinic back at 555-0192 by five P.M. today to confirm which time works best for you. We apologize for any inconvenience.`,
        translation_vi: `Xin chào, tin nhắn này gửi tới ông Robert Sterling. Tôi là Amanda gọi từ Nha khoa Oakwood. Tôi gọi về buổi khám và lấy cao răng định kỳ của ông dự kiến vào thứ Năm tuần này, ngày 14 tháng 10, lúc 3 giờ chiều. Rất tiếc, Bác sĩ Harrison có một ca phẫu thuật nha khoa khẩn cấp vào thời điểm đó nên sẽ vắng mặt. Chúng tôi muốn dời lịch hẹn của ông sang sáng thứ Sáu lúc 10 giờ hoặc chiều thứ Hai tuần tới lúc 2 giờ. Xin vui lòng gọi lại cho phòng khám chúng tôi theo số 555-0192 trước 5 giờ chiều hôm nay để xác nhận khung giờ phù hợp nhất với ông. Chúng tôi thành thật xin lỗi vì sự bất tiện này.`,
        questions: [
            {
                id: "p4_s01_q01",
                q: "Where does the speaker work?",
                options: [
                    "A. At an insurance agency",
                    "B. At a dental clinic",
                    "C. At a pharmacy",
                    "D. At a medical equipment supplier"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "main_idea",
                trap_type: "paraphrase 'Oakwood Dental Associates'",
                correct_reason: "Speaker: 'Amanda calling from Oakwood Dental Associates.'",
                explanation_vi: "Người nói công tác tại phòng khám nha khoa (dental clinic). Chọn B."
            },
            {
                id: "p4_s01_q02",
                q: "Why is the appointment being rescheduled?",
                options: [
                    "A. The dental office is undergoing renovation",
                    "B. The doctor has an urgent surgical procedure",
                    "C. Severe weather caused clinic closures",
                    "D. The patient's insurance was denied"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "paraphrase 'emergency dental surgery'",
                correct_reason: "Speaker: 'Dr. Harrison has an emergency dental surgery scheduled at that time'",
                explanation_vi: "Lý do dời lịch là bác sĩ có ca phẫu thuật khẩn cấp (urgent surgical procedure). Chọn B."
            },
            {
                id: "p4_s01_q03",
                q: "What is the listener asked to do by five P.M. today?",
                options: [
                    "A. Fill out an online medical history form",
                    "B. Call the clinic to select a new appointment time",
                    "C. Transfer a copay deposit fee",
                    "D. Pick up a prescription medication"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "next_action",
                trap_type: "hành động yêu cầu trong tin nhắn",
                correct_reason: "Speaker: 'Please call our clinic back at 555-0192 by five P.M. today to confirm which time works best for you.'",
                explanation_vi: "Bệnh nhân được yêu cầu gọi lại phòng khám trước 5h chiều để chọn giờ hẹn mới. Chọn B."
            }
        ]
    },
    {
        setId: "p4_set02",
        part: 4,
        setNumber: 2,
        topic: "Thông báo sân bay (Airport Announcement)",
        accent: "UK",
        speakers: [{ name: "Speaker (Airport Staff)", accent: "en-GB", role: "Airport Gate Agent" }],
        audioScript: `Attention all passengers holding boarding passes for Skyways Flight 408 with nonstop service to London Heathrow. Due to late arrival of the inbound aircraft and unexpected ground fog at the departure runway, our departure has been delayed by approximately forty-five minutes. In addition, please take note of an official gate reassignment: Flight 408 will now be boarding at Gate 26B at the north end of Terminal 3, rather than Gate 14. We request that all passengers proceed quietly toward Gate 26B where our ground crew will begin priority boarding for families with young children and passengers needing special assistance shortly. Complimentary water bottles are available at our service desk. Thank you for your patience.`,
        transcript: `Attention all passengers holding boarding passes for Skyways Flight 408 with nonstop service to London Heathrow. Due to late arrival of the inbound aircraft and unexpected ground fog at the departure runway, our departure has been delayed by approximately forty-five minutes. In addition, please take note of an official gate reassignment: Flight 408 will now be boarding at Gate 26B at the north end of Terminal 3, rather than Gate 14. We request that all passengers proceed quietly toward Gate 26B where our ground crew will begin priority boarding for families with young children and passengers needing special assistance shortly. Complimentary water bottles are available at our service desk. Thank you for your patience.`,
        translation_vi: `Xin quý hành khách có thẻ lên máy bay chuyến 408 của hãng Skyways bay thẳng đến London Heathrow chú ý. Do máy bay đến muộn và sương mù bất ngờ trên đường băng cất cánh, chuyến bay của chúng ta sẽ bị hoãn khoảng 45 phút. Ngoài ra, xin quý khách lưu ý sự thay đổi cửa khởi hành chính thức: Chuyến bay 408 hiện sẽ đón khách tại Cửa 26B ở phía bắc Nhà ga số 3, thay vì Cửa 14. Chúng tôi đề nghị tất cả hành khách di chuyển trật tự về phía Cửa 26B, nơi nhân viên mặt đất của chúng tôi sẽ bắt đầu ưu tiên lên máy bay cho các gia đình có trẻ nhỏ và hành khách cần trợ giúp đặc biệt trong ít phút tới. Nước suối miễn phí được phục vụ tại quầy dịch vụ của chúng tôi. Cảm ơn sự kiên nhẫn của quý khách.`,
        questions: [
            {
                id: "p4_s02_q01",
                q: "What is the purpose of the announcement?",
                options: [
                    "A. To announce a flight delay and gate change",
                    "B. To alert passengers of lost luggage in Terminal 3",
                    "C. To offer ticket upgrades to business class",
                    "D. To inform passengers of a terminal evacuation"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "main_idea",
                trap_type: "tổng hợp nội dung chính",
                correct_reason: "Speaker: 'our departure has been delayed... gate reassignment: Flight 408 will now be boarding at Gate 26B'",
                explanation_vi: "Mục đích thông báo là báo hoãn chuyến bay 45 phút và chuyển sang cửa 26B (flight delay and gate change). Chọn A."
            },
            {
                id: "p4_s02_q02",
                q: "What caused the flight delay?",
                options: [
                    "A. Severe mechanical engine failure",
                    "B. Late inbound plane and runway weather fog",
                    "C. Missing security inspection paperwork",
                    "D. Flight crew scheduling strike"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "nguyên nhân kết hợp",
                correct_reason: "Speaker: 'late arrival of the inbound aircraft and unexpected ground fog at the departure runway'",
                explanation_vi: "Nguyên nhân chậm giờ là do máy bay đến trễ và sương mù đường băng. Chọn B."
            },
            {
                id: "p4_s02_q03",
                q: "What group will be invited to board first?",
                options: [
                    "A. Frequent flyer gold members",
                    "B. Passengers seated in row thirty and higher",
                    "C. Families with young children and passengers needing assistance",
                    "D. Airline pilots and cabin crew"
                ],
                ans: 2,
                ansLetter: "C",
                question_type: "detail",
                trap_type: "đối tượng ưu tiên lên máy bay",
                correct_reason: "Speaker: 'begin priority boarding for families with young children and passengers needing special assistance'",
                explanation_vi: "Nhóm được ưu tiên lên máy bay trước là gia đình có trẻ nhỏ và khách cần trợ giúp đặc biệt. Chọn C."
            }
        ]
    },
    {
        setId: "p4_set03",
        part: 4,
        setNumber: 3,
        topic: "Thuyết trình kết quả kinh doanh quý (Business Presentation)",
        accent: "US",
        speakers: [{ name: "Speaker (Chief Financial Officer)", accent: "en-US", role: "CFO (Victor Ramos)" }],
        audioScript: `Good afternoon board members and department managers. I am pleased to present our third-quarter financial overview for NexaCorp. Over the past three months, our revenue grew by twelve percent compared to the previous quarter, exceeding Wall Street projections. The primary driver of this outstanding expansion was our enterprise cloud storage division, which onboarded thirty-five new international corporate clients. However, operational expenses also rose by six percent, primarily driven by investments in data server infrastructure and software engineering hiring. To maintain our healthy profit margins going into the fourth quarter, we will implement energy efficiency protocols across all data facilities and streamline vendor subscriptions. Thank you, and I now welcome your questions.`,
        transcript: `Good afternoon board members and department managers. I am pleased to present our third-quarter financial overview for NexaCorp. Over the past three months, our revenue grew by twelve percent compared to the previous quarter, exceeding Wall Street projections. The primary driver of this outstanding expansion was our enterprise cloud storage division, which onboarded thirty-five new international corporate clients. However, operational expenses also rose by six percent, primarily driven by investments in data server infrastructure and software engineering hiring. To maintain our healthy profit margins going into the fourth quarter, we will implement energy efficiency protocols across all data facilities and streamline vendor subscriptions. Thank you, and I now welcome your questions.`,
        translation_vi: `Xin chào các thành viên hội đồng quản trị và các trưởng phòng. Tôi rất vui mừng được trình bày bức tranh tổng quan tài chính quý ba của NexaCorp. Trong 3 tháng qua, doanh thu của chúng ta tăng trưởng 12% so với quý trước, vượt dự báo của Phố Wall. Động lực chính cho sự mở rộng vượt bậc này là mảng lưu trữ đám mây doanh nghiệp, đã đón thêm 35 khách hàng doanh nghiệp quốc tế mới. Tuy nhiên, chi phí vận hành cũng tăng 6%, chủ yếu do đầu tư vào hạ tầng máy chủ dữ liệu và tuyển dụng kỹ sư phần mềm. Để duy trì biên lợi nhuận vững mạnh bước vào quý 4, chúng ta sẽ áp dụng các quy chuẩn tiết kiệm năng lượng tại tất cả cơ sở dữ liệu và tinh gọn các gói đăng ký nhà cung cấp. Xin cảm ơn, và giờ tôi xin lắng nghe các câu hỏi của quý vị.`,
        questions: [
            {
                id: "p4_s03_q01",
                q: "What is the speaker mainly reporting on?",
                options: [
                    "A. Third-quarter financial performance and revenue growth",
                    "B. A merger with an international telecom provider",
                    "C. Employee annual bonus calculations",
                    "D. A lawsuit regarding software patent rights"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "main_idea",
                trap_type: "chủ đề báo cáo doanh nghiệp",
                correct_reason: "Speaker: 'pleased to present our third-quarter financial overview for NexaCorp... revenue grew by twelve percent'",
                explanation_vi: "Người nói báo cáo về kết quả tài chính quý 3 và mức tăng trưởng doanh thu 12%. Chọn A."
            },
            {
                id: "p4_s03_q02",
                q: "Which division accounted for the largest revenue increase?",
                options: [
                    "A. Consumer hardware retail",
                    "B. Enterprise cloud storage services",
                    "C. Print marketing consulting",
                    "D. Corporate cybersecurity training"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "bộ phận tạo doanh số chính",
                correct_reason: "Speaker: 'primary driver of this outstanding expansion was our enterprise cloud storage division'",
                explanation_vi: "Bộ phận đóng góp lớn nhất vào tăng trưởng doanh thu là mảng lưu trữ đám mây doanh nghiệp (enterprise cloud storage division). Chọn B."
            },
            {
                id: "p4_s03_q03",
                q: "How does the company plan to manage operating costs in the fourth quarter?",
                options: [
                    "A. By laying off junior engineering staff",
                    "B. By lowering prices for new subscription signups",
                    "C. By adopting energy efficiency measures and streamlining vendors",
                    "D. By leasing older computer hardware equipment"
                ],
                ans: 2,
                ansLetter: "C",
                question_type: "next_action",
                trap_type: "paraphrase biện pháp tối ưu chi phí",
                correct_reason: "Speaker: 'implement energy efficiency protocols across all data facilities and streamline vendor subscriptions.'",
                explanation_vi: "Kế hoạch kiểm soát chi phí là áp dụng biện pháp tiết kiệm năng lượng và tinh giản nhà cung cấp (energy efficiency measures and streamlining vendors). Chọn C."
            }
        ]
    },
    {
        setId: "p4_set04",
        part: 4,
        setNumber: 4,
        topic: "Bản tin giao thông & thời tiết radio (Radio Broadcast)",
        accent: "AU",
        speakers: [{ name: "Speaker (Radio Announcer)", accent: "en-AU", role: "Traffic & Weather Reporter" }],
        audioScript: `Good morning Metro commuters. This is Dave Lawson with your 88.5 FM rush-hour traffic and weather bulletin. If you are traveling inbound toward downtown on Highway 101, expect major delays of up to forty minutes. An overturned commercial delivery truck near the Maple Street overpass has blocked the two right lanes. Emergency crews and tow trucks are currently on the scene clearing debris. Commuters are strongly advised to exit early at River Road and take the Harbor Parkway as an alternate route. On the weather front, our overcast morning skies will give way to heavy rain showers by early afternoon, so make sure to keep your umbrella handy and reduce your driving speeds on slippery roadways. Stay tuned for sports news coming up next.`,
        transcript: `Good morning Metro commuters. This is Dave Lawson with your 88.5 FM rush-hour traffic and weather bulletin. If you are traveling inbound toward downtown on Highway 101, expect major delays of up to forty minutes. An overturned commercial delivery truck near the Maple Street overpass has blocked the two right lanes. Emergency crews and tow trucks are currently on the scene clearing debris. Commuters are strongly advised to exit early at River Road and take the Harbor Parkway as an alternate route. On the weather front, our overcast morning skies will give way to heavy rain showers by early afternoon, so make sure to keep your umbrella handy and reduce your driving speeds on slippery roadways. Stay tuned for sports news coming up next.`,
        translation_vi: `Chào buổi sáng quý thính giả đi lại trong thành phố. Tôi là Dave Lawson với bản tin giao thông và thời tiết giờ cao điểm trên kênh 88.5 FM. Nếu quý vị đang đi vào hướng trung tâm trên Cao tốc 101, hãy chuẩn bị cho việc trễ tới 40 phút. Một chiếc xe tải chở hàng bị lật gần cầu vượt Phố Maple đã chắn hai làn đường bên phải. Lực lượng cứu hộ và xe cứu hộ giao thông hiện đang có mặt tại hiện trường để dọn dẹp hiện trường. Người tham gia giao thông được khuyến cáo nên rẽ sớm ở đường River Road và đi đường Harbor Parkway làm tuyến đường thay thế. Về mặt thời tiết, bầu trời nhiều mây buổi sáng sẽ nhường chỗ cho những cơn mưa rào lớn vào đầu giờ chiều, vì vậy hãy giữ ô bên mình và giảm tốc độ lái xe trên những đoạn đường trơn trượt. Hãy tiếp tục theo dõi bản tin thể thao ngay sau đây.`,
        questions: [
            {
                id: "p4_s04_q01",
                q: "What problem is being reported on Highway 101?",
                options: [
                    "A. Scheduled road resurfacing construction",
                    "B. An overturned truck blocking traffic lanes",
                    "C. A bridge toll booth system malfunction",
                    "D. A parade causing temporary street closures"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "problem",
                trap_type: "paraphrase nguyên nhân kẹt xe",
                correct_reason: "Speaker: 'An overturned commercial delivery truck near the Maple Street overpass has blocked the two right lanes.'",
                explanation_vi: "Sự cố trên Cao tốc 101 là một xe tải bị lật chắn các làn đường (overturned truck blocking traffic lanes). Chọn B."
            },
            {
                id: "p4_s04_q02",
                q: "What detour route does the reporter suggest?",
                options: [
                    "A. Taking the subway train system",
                    "B. Using Harbor Parkway via River Road",
                    "C. Crossing the downtown suspension bridge",
                    "D. Taking Maple Street through the residential area"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "tên tuyến đường thay thế",
                correct_reason: "Speaker: 'advised to exit early at River Road and take the Harbor Parkway as an alternate route.'",
                explanation_vi: "Tuyến đường thay thế được khuyên đi là Harbor Parkway qua lối ra River Road. Chọn B."
            },
            {
                id: "p4_s04_q03",
                q: "What weather change is forecast for the afternoon?",
                options: [
                    "A. Clear blue skies with bright sunshine",
                    "B. Freezing temperatures and light snowfall",
                    "C. Heavy rain showers",
                    "D. Strong high-speed gusting winds"
                ],
                ans: 2,
                ansLetter: "C",
                question_type: "detail",
                trap_type: "dự báo thời tiết buổi chiều",
                correct_reason: "Speaker: 'overcast morning skies will give way to heavy rain showers by early afternoon'",
                explanation_vi: "Dự báo buổi chiều sẽ có mưa rào lớn (heavy rain showers). Chọn C."
            }
        ]
    },
    {
        setId: "p4_set05",
        part: 4,
        setNumber: 5,
        topic: "Cuộc họp nội bộ công ty (Company Meeting)",
        accent: "CA",
        speakers: [{ name: "Speaker (HR Vice President)", accent: "en-CA", role: "VP of Human Resources" }],
        audioScript: `Good morning everyone. Thank you for assembling promptly for this company-wide staff meeting. Following feedback gathered from our recent workplace survey, executive leadership has officially decided to modernize our remote work policy starting on the first of next month. Under the revised guidelines, all full-time employees will be eligible to work remotely up to two days per week, provided they coordinate their designated days with department supervisors. In addition, our IT department will disburse a one-time home office subsidy of three hundred dollars to assist with ergonomic desk equipment and high-speed internet connections. A comprehensive policy handbook will be posted to the employee intranet by three P.M. today. Thank you for your commitment to our collaborative workplace culture.`,
        transcript: `Good morning everyone. Thank you for assembling promptly for this company-wide staff meeting. Following feedback gathered from our recent workplace survey, executive leadership has officially decided to modernize our remote work policy starting on the first of next month. Under the revised guidelines, all full-time employees will be eligible to work remotely up to two days per week, provided they coordinate their designated days with department supervisors. In addition, our IT department will disburse a one-time home office subsidy of three hundred dollars to assist with ergonomic desk equipment and high-speed internet connections. A comprehensive policy handbook will be posted to the employee intranet by three P.M. today. Thank you for your commitment to our collaborative workplace culture.`,
        translation_vi: `Chào buổi sáng tất cả mọi người. Cảm ơn các bạn đã tập hợp nhanh chóng cho cuộc họp toàn thể nhân viên này. Sau các phản hồi thu thập từ khảo sát môi trường làm việc gần đây, ban lãnh đạo đã chính thức quyết định hiện đại hóa chính sách làm việc từ xa bắt đầu từ ngày đầu tiên của tháng tới. Theo quy định sửa đổi, tất cả nhân viên toàn thời gian sẽ đủ điều kiện làm việc từ xa tối đa 2 ngày mỗi tuần, với điều kiện họ phối hợp các ngày được chỉ định với người giám sát phòng ban. Ngoài ra, bộ phận IT của chúng ta sẽ chi trả khoản trợ cấp văn phòng tại nhà một lần trị giá 300 đô la để hỗ trợ mua sắm thiết bị bàn làm việc công thái học và kết nối internet tốc độ cao. Sổ tay chính sách toàn diện sẽ được đăng tải lên mạng nội bộ nhân viên trước 3 giờ chiều hôm nay. Cảm ơn sự cống hiến của các bạn cho văn hóa làm việc hợp tác của chúng ta.`,
        questions: [
            {
                id: "p4_s05_q01",
                q: "What is the primary topic of the meeting announcement?",
                options: [
                    "A. An updated hybrid and remote work policy",
                    "B. Changes to employee medical insurance providers",
                    "C. Mandatory annual fire evacuation training",
                    "D. A new company dress code policy"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "main_idea",
                trap_type: "paraphrase chính sách làm việc",
                correct_reason: "Speaker: 'decided to modernize our remote work policy starting on the first of next month.'",
                explanation_vi: "Chủ đề chính là cập nhật chính sách làm việc từ xa kết hợp (updated hybrid and remote work policy). Chọn A."
            },
            {
                id: "p4_s05_q02",
                q: "What additional benefit will the company provide to employees?",
                options: [
                    "A. Company-paid gym memberships",
                    "B. A three-hundred-dollar home office stipend",
                    "C. Free daily catered lunches",
                    "D. Additional paid vacation days"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "paraphrase 'subsidy' thành 'stipend'",
                correct_reason: "Speaker: 'disburse a one-time home office subsidy of three hundred dollars'",
                explanation_vi: "Công ty cung cấp khoản trợ cấp thiết lập văn phòng tại nhà 300 đô la (home office stipend). Chọn B."
            },
            {
                id: "p4_s05_q03",
                q: "Where can employees review the detailed policy handbook?",
                options: [
                    "A. In the human resources reception lobby",
                    "B. On the corporate employee intranet",
                    "C. In a printed company newsletter",
                    "D. In their personal home mailbox"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "nơi đăng tải tài liệu",
                correct_reason: "Speaker: 'comprehensive policy handbook will be posted to the employee intranet by three P.M. today.'",
                explanation_vi: "Nhân viên xem sổ tay chính sách trên mạng nội bộ công ty (employee intranet). Chọn B."
            }
        ]
    },
    {
        setId: "p4_set06",
        part: 4,
        setNumber: 6,
        topic: "Thuyết minh hướng dẫn bảo tàng (Guided Tour)",
        accent: "UK",
        speakers: [{ name: "Speaker (Museum Docent)", accent: "en-GB", role: "Tour Guide" }],
        audioScript: `Welcome to the Royal Maritime Museum visitors. My name is Julian, and I will be guiding you through our special exhibition commemorating nineteenth-century shipbuilding craftsmanship. Our tour will begin in Gallery A, where you will examine authentic scale models and hand-carved navigational compasses used during transatlantic expeditions. Before we step into the gallery, please note a few important museum regulations: to preserve the delicate varnished wood and aged leather artifacts, flash photography is strictly prohibited inside all exhibition chambers. You are welcome to take non-flash photos. Also, please place your mobile phones on silent mode. At the end of our forty-minute tour, you can visit the museum gift shop on the ground floor where replicas and souvenir books are available with a ten percent discount today. Let us proceed through the double doors.`,
        transcript: `Welcome to the Royal Maritime Museum visitors. My name is Julian, and I will be guiding you through our special exhibition commemorating nineteenth-century shipbuilding craftsmanship. Our tour will begin in Gallery A, where you will examine authentic scale models and hand-carved navigational compasses used during transatlantic expeditions. Before we step into the gallery, please note a few important museum regulations: to preserve the delicate varnished wood and aged leather artifacts, flash photography is strictly prohibited inside all exhibition chambers. You are welcome to take non-flash photos. Also, please place your mobile phones on silent mode. At the end of our forty-minute tour, you can visit the museum gift shop on the ground floor where replicas and souvenir books are available with a ten percent discount today. Let us proceed through the double doors.`,
        translation_vi: `Chào mừng quý khách đến với Bảo tàng Hàng hải Hoàng gia. Tôi tên là Julian, và tôi sẽ hướng dẫn quý vị đi tham quan triển lãm đặc biệt tôn vinh kỹ nghệ đóng tàu thế kỷ 19. Chuyến tham quan của chúng ta sẽ bắt đầu tại Phòng trưng bày A, nơi quý vị sẽ được chiêm ngưỡng các mô hình thu nhỏ nguyên bản và những chiếc la bàn định vị chạm khắc thủ công từng được sử dụng trong các chuyến thám hiểm xuyên Đại Tây Dương. Trước khi bước vào phòng trưng bày, xin quý vị lưu ý một vài quy định quan trọng của bảo tàng: để bảo tồn các hiện vật gỗ đánh vec-ni và đồ da cổ nhạy cảm, việc chụp ảnh có đèn flash bị nghiêm cấm trong tất cả các phòng triển lãm. Quý vị được thoải mái chụp ảnh không flash. Ngoài ra, xin vui lòng chuyển điện thoại sang chế độ im lặng. Vào cuối chuyến tham quan kéo dài 40 phút, quý vị có thể ghé thăm cửa hàng lưu niệm bảo tàng ở tầng trệt, nơi các bản sao và sách lưu niệm đang được giảm giá 10% hôm nay. Xin mời chúng ta cùng bước qua cửa đôi.`,
        questions: [
            {
                id: "p4_s06_q01",
                q: "What is the focus of the museum exhibition?",
                options: [
                    "A. Ancient Egyptian pottery making",
                    "B. Nineteenth-century maritime shipbuilding craftsmanship",
                    "C. Modern submarine technology",
                    "D. Renaissance oil paintings"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "main_idea",
                trap_type: "chủ đề bảo tàng hàng hải",
                correct_reason: "Speaker: 'special exhibition commemorating nineteenth-century shipbuilding craftsmanship.'",
                explanation_vi: "Trọng tâm triển lãm là kỹ nghệ đóng tàu hàng hải thế kỷ 19 (maritime shipbuilding craftsmanship). Chọn B."
            },
            {
                id: "p4_s06_q02",
                q: "What visitor behavior is strictly prohibited?",
                options: [
                    "A. Taking photos with a flash",
                    "B. Wearing coats inside the gallery",
                    "C. Asking questions during the tour",
                    "D. Bringing personal bottled water"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "detail",
                trap_type: "quy định cấm đèn flash",
                correct_reason: "Speaker: 'flash photography is strictly prohibited inside all exhibition chambers.'",
                explanation_vi: "Hành vi bị cấm nghiêm ngặt là chụp ảnh có bật đèn flash (taking photos with a flash). Chọn A."
            },
            {
                id: "p4_s06_q03",
                q: "What can visitors do at the end of the tour?",
                options: [
                    "A. Meet with the museum curator in private",
                    "B. Receive a discount at the gift shop",
                    "C. Participate in a wooden boat building workshop",
                    "D. Have afternoon tea at the rooftop cafe"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "ưu đãi cuối tour tham quan",
                correct_reason: "Speaker: 'visit the museum gift shop on the ground floor where replicas and souvenir books are available with a ten percent discount today.'",
                explanation_vi: "Cuối tour du khách có thể nhận ưu đãi giảm giá tại cửa hàng lưu niệm (discount at the gift shop). Chọn B."
            }
        ]
    },
    {
        setId: "p4_set07",
        part: 4,
        setNumber: 7,
        topic: "Quảng cáo thương mại (Radio Commercial)",
        accent: "US",
        speakers: [{ name: "Speaker (Voice Actor)", accent: "en-US", role: "Commercial Voiceover" }],
        audioScript: `Is your growing enterprise struggling to keep its office workspace pristine and hygienic? Introducing PurePro Cleaners, the region's leading eco-friendly commercial cleaning service. Unlike traditional janitorial companies that rely on harsh chemical sprays, PurePro exclusively uses plant-based, non-toxic sanitizing solutions certified safe for both your employees and the environment. Whether you manage a small legal office or a multi-floor technology headquarters, our bonded and insured custodial teams customize a schedule that fits your operational needs, seven nights a week. Sign up for a six-month cleaning contract before the end of this month, and you will receive your first two weeks of deep cleaning service absolutely free! Visit our website at www.pureproclean.com or call 1-800-555-PURE today to schedule your complimentary on-site estimate.`,
        transcript: `Is your growing enterprise struggling to keep its office workspace pristine and hygienic? Introducing PurePro Cleaners, the region's leading eco-friendly commercial cleaning service. Unlike traditional janitorial companies that rely on harsh chemical sprays, PurePro exclusively uses plant-based, non-toxic sanitizing solutions certified safe for both your employees and the environment. Whether you manage a small legal office or a multi-floor technology headquarters, our bonded and insured custodial teams customize a schedule that fits your operational needs, seven nights a week. Sign up for a six-month cleaning contract before the end of this month, and you will receive your first two weeks of deep cleaning service absolutely free! Visit our website at www.pureproclean.com or call 1-800-555-PURE today to schedule your complimentary on-site estimate.`,
        translation_vi: `Doanh nghiệp đang phát triển của bạn có đang chật vật để giữ cho không gian văn phòng luôn sạch bóng và vệ sinh không? Xin giới thiệu PurePro Cleaners, dịch vụ vệ sinh thương mại thân thiện với môi trường hàng đầu khu vực. Khác với các công ty tạp vụ truyền thống dựa vào các hóa chất tẩy rửa mạnh độc hại, PurePro chỉ sử dụng các dung dịch khử khuẩn chiết xuất từ thực vật, không độc tố được chứng nhận an toàn cho cả nhân viên của bạn lẫn môi trường. Cho dù bạn quản lý một văn phòng luật nhỏ hay một trụ sở công nghệ nhiều tầng, đội ngũ vệ sinh có bảo hiểm và bảo lãnh của chúng tôi sẽ tùy chỉnh lịch trình phù hợp với nhu cầu vận hành của bạn, 7 đêm một tuần. Đăng ký hợp đồng vệ sinh 6 tháng trước cuối tháng này, và bạn sẽ nhận được 2 tuần đầu tiên dịch vụ dọn dẹp chuyên sâu hoàn toàn miễn phí! Hãy truy cập trang web của chúng tôi tại www.pureproclean.com hoặc gọi 1-800-555-PURE hôm nay để đặt lịch khảo sát và báo giá tận nơi miễn phí.`,
        questions: [
            {
                id: "p4_s07_q01",
                q: "What service is being advertised?",
                options: [
                    "A. Eco-friendly commercial office cleaning",
                    "B. Ergonomic office furniture leasing",
                    "C. Business document shredding and recycling",
                    "D. Commercial air conditioning repair"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "main_idea",
                trap_type: "dịch vụ quảng cáo chính",
                correct_reason: "Speaker: 'PurePro Cleaners, the region's leading eco-friendly commercial cleaning service.'",
                explanation_vi: "Dịch vụ được quảng cáo là dịch vụ vệ sinh văn phòng thương mại thân thiện với môi trường (eco-friendly commercial office cleaning). Chọn A."
            },
            {
                id: "p4_s07_q02",
                q: "What makes PurePro different from conventional competitors?",
                options: [
                    "A. They guarantee the lowest hourly rates in the state",
                    "B. They use plant-based, non-toxic cleaning products",
                    "C. They only clean residential apartments",
                    "D. They operate twenty-four hours during weekends"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "điểm khác biệt sản phẩm",
                correct_reason: "Speaker: 'exclusively uses plant-based, non-toxic sanitizing solutions'",
                explanation_vi: "Điểm nổi bật là dùng sản phẩm vệ sinh chiết xuất thực vật không độc hại (plant-based, non-toxic products). Chọn B."
            },
            {
                id: "p4_s07_q03",
                q: "What promotional offer is available this month?",
                options: [
                    "A. A free company vacuum cleaner",
                    "B. Two weeks of deep cleaning service at no cost",
                    "C. Half-price weekend window cleaning",
                    "D. Free carpet replacement installation"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "chương trình khuyến mãi",
                correct_reason: "Speaker: 'receive your first two weeks of deep cleaning service absolutely free!'",
                explanation_vi: "Khuyến mại trong tháng là miễn phí 2 tuần dịch vụ vệ sinh chuyên sâu đầu tiên (two weeks of deep cleaning at no cost). Chọn B."
            }
        ]
    },
    {
        setId: "p4_set08",
        part: 4,
        setNumber: 8,
        topic: "Thông báo nội bộ & Ý định phát ngôn (Intent Question)",
        accent: "UK",
        speakers: [{ name: "Speaker (Product Development Director)", accent: "en-GB", role: "Director (Gareth)" }],
        audioScript: `Team, thank you for dialing into this emergency product sprint briefing. As you know, our target launch for the FitTrack Pro smart fitness band was set for late November. However, yesterday morning our primary rival in the market announced their holiday wearable device. Our competitor just launched something similar. We cannot afford to lose market share during Black Friday weekend. Therefore, I am asking our hardware quality assurance group to streamline validation tests and authorize overtime work through the weekend so we can begin manufacturing packaging next Monday. To compensate everyone for their dedication, a hot buffet lunch will be provided in the cafeteria every day this week, along with compensatory paid time off next quarter. Let us review the sprint milestones now.`,
        transcript: `Team, thank you for dialing into this emergency product sprint briefing. As you know, our target launch for the FitTrack Pro smart fitness band was set for late November. However, yesterday morning our primary rival in the market announced their holiday wearable device. Our competitor just launched something similar. We cannot afford to lose market share during Black Friday weekend. Therefore, I am asking our hardware quality assurance group to streamline validation tests and authorize overtime work through the weekend so we can begin manufacturing packaging next Monday. To compensate everyone for their dedication, a hot buffet lunch will be provided in the cafeteria every day this week, along with compensatory paid time off next quarter. Let us review the sprint milestones now.`,
        translation_vi: `Cả đội, cảm ơn mọi người đã tham gia cuộc họp nhanh khẩn cấp về giai đoạn nước rút của sản phẩm này. Như các bạn đã biết, mục tiêu ra mắt chiếc vòng đeo tay thể dục thông minh FitTrack Pro của chúng ta ban đầu dự kiến vào cuối tháng 11. Tuy nhiên, sáng hôm qua đối thủ cạnh tranh chính của chúng ta trên thị trường đã công bố thiết bị đeo tay mùa lễ hội của họ. Đối thủ vừa mới ra mắt một thứ tương tự. Chúng ta không thể để mất thị phần trong dịp cuối tuần Black Friday. Do đó, tôi yêu cầu nhóm đảm bảo chất lượng phần cứng tối giản hóa các bài kiểm thử xác nhận và phê duyệt làm thêm giờ suốt dịp cuối tuần để chúng ta có thể bắt đầu đóng gói sản xuất vào thứ Hai tới. Để đền đáp sự cống hiến của mọi người, bữa trưa tự chọn nóng sốt sẽ được phục vụ tại nhà ăn mỗi ngày trong tuần này, cùng với ngày nghỉ bù có lương vào quý tới. Giờ chúng ta hãy cùng xem lại các mốc thời gian của đợt nước rút này.`,
        questions: [
            {
                id: "p4_s08_q01",
                q: "What product is the team preparing to launch?",
                options: [
                    "A. A mobile banking smartphone app",
                    "B. A smart wearable fitness tracker band",
                    "C. A wireless noise-canceling earbud",
                    "D. An electric bicycle GPS navigator"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "sản phẩm công nghệ",
                correct_reason: "Speaker: 'launch for the FitTrack Pro smart fitness band'",
                explanation_vi: "Sản phẩm chuẩn bị ra mắt là vòng đeo tay thông minh theo dõi sức khỏe (smart wearable fitness tracker band). Chọn B."
            },
            {
                id: "p4_s08_q02",
                q: "What does the speaker imply when he says: 'Our competitor just launched something similar'?",
                options: [
                    "A. The team must speed up development to stay competitive",
                    "B. The company should purchase the competitor's patent",
                    "C. The FitTrack Pro project should be canceled immediately",
                    "D. The marketing department needs to hire new advertising designers"
                ],
                ans: 0,
                ansLetter: "A",
                question_type: "intent",
                trap_type: "ngụ ý chiến lược trong câu nói",
                correct_reason: "Speaker: 'Our competitor just launched something similar. We cannot afford to lose market share... streamline validation tests and authorize overtime'",
                explanation_vi: "Câu hỏi ý định (Intent question): Khi nói đối thủ vừa tung ra sản phẩm tương tự, người nói ngụ ý cả nhóm phải đẩy nhanh tiến độ làm việc để không mất thị phần (speed up development to stay competitive). Chọn A."
            },
            {
                id: "p4_s08_q03",
                q: "What reward does the speaker offer for working overtime?",
                options: [
                    "A. Cash bonuses deposited this Friday",
                    "B. Free daily hot lunches and compensatory paid time off",
                    "C. First-class business flight tickets",
                    "D. A free fitness band prototype for each engineer"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "phần thưởng đền đáp công sức",
                correct_reason: "Speaker: 'a hot buffet lunch will be provided in the cafeteria every day this week, along with compensatory paid time off next quarter.'",
                explanation_vi: "Phần thưởng gồm bữa trưa nóng hàng ngày và ngày nghỉ bù có lương (free daily hot lunches and compensatory paid time off). Chọn B."
            }
        ]
    },
    {
        setId: "p4_set09",
        part: 4,
        setNumber: 9,
        topic: "Lịch hội nghị công nghệ (Graphic Question)",
        accent: "US",
        speakers: [{ name: "Speaker (Conference Coordinator)", accent: "en-US", role: "Event Host" }],
        graphic: {
            type: "table",
            title: "TechNext 2026 Afternoon Breakout Sessions (East Wing)",
            columns: ["Track", "Session Title", "Room", "Presenter"],
            rows: [
                ["Track 1", "Next-Gen Cyber Defense Architecture", "Room 101", "Marcus Bennett"],
                ["Track 2", "Scalable Microservices on Cloud Platforms", "Room 102", "Elena Rostova"],
                ["Track 3", "Data Privacy & Regulatory Compliance", "Room 103", "Jonathan Hayes"],
                ["Track 4", "Applied Machine Learning for Retailers", "Room 104", "Dr. Aaliyah Patel"]
            ]
        },
        audioScript: `Good afternoon attendees, and welcome back from our lunch banquet. I have an important logistical update regarding the afternoon breakout schedule printed on your program flyers. Due to an unexpected plumbing leak in the east corridor, one of our breakout chambers had to be evacuated for emergency repairs. Therefore, the cloud computing architecture presentation delivered by Elena Rostova has been relocated from its original venue to the Grand Ballroom on the second floor. All other sessions will proceed according to the printed schedule in their respective rooms. If you plan to attend Elena's talk, please take the central escalators upstairs. Microphones will be open for questions during the final fifteen minutes of each workshop. Enjoy your afternoon sessions!`,
        transcript: `Good afternoon attendees, and welcome back from our lunch banquet. I have an important logistical update regarding the afternoon breakout schedule printed on your program flyers. Due to an unexpected plumbing leak in the east corridor, one of our breakout chambers had to be evacuated for emergency repairs. Therefore, the cloud computing architecture presentation delivered by Elena Rostova has been relocated from its original venue to the Grand Ballroom on the second floor. All other sessions will proceed according to the printed schedule in their respective rooms. If you plan to attend Elena's talk, please take the central escalators upstairs. Microphones will be open for questions during the final fifteen minutes of each workshop. Enjoy your afternoon sessions!`,
        translation_vi: `Chào buổi chiều các vị khách tham dự, và mừng các bạn quay trở lại sau bữa tiệc trưa. Tôi có một cập nhật quan trọng về lịch trình các phiên thảo luận chuyên đề buổi chiều được in trên tờ rơi chương trình của các bạn. Do sự cố rò rỉ đường ống nước bất ngờ ở hành lang phía đông, một trong các phòng hội thảo của chúng ta đã phải sơ tán để sửa chữa khẩn cấp. Do đó, bài thuyết trình về kiến trúc điện toán đám mây do cô Elena Rostova trình bày đã được chuyển từ địa điểm ban đầu sang Phòng khiêu vũ lớn (Grand Ballroom) ở tầng 2. Tất cả các phiên khác vẫn sẽ diễn ra theo đúng lịch trình đã in tại các phòng tương ứng. Nếu bạn dự định tham dự buổi nói chuyện của Elena, vui lòng đi thang cuốn trung tâm lên tầng trên. Micro sẽ được mở cho phần đặt câu hỏi trong 15 phút cuối của mỗi buổi hội thảo. Chúc các bạn có những buổi chiều bổ ích!`,
        questions: [
            {
                id: "p4_s09_q01",
                q: "What caused the schedule change?",
                options: [
                    "A. A speaker missed their flight connection",
                    "B. A plumbing leak required emergency repairs",
                    "C. Audiovisual projectors broke down",
                    "D. Excessive attendance overflowed the hall"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "nguyên nhân đổi phòng hội thảo",
                correct_reason: "Speaker: 'unexpected plumbing leak in the east corridor, one of our breakout chambers had to be evacuated for emergency repairs.'",
                explanation_vi: "Nguyên nhân chuyển phòng là rò rỉ đường ống nước cần sửa khẩn cấp (plumbing leak required emergency repairs). Chọn B."
            },
            {
                id: "p4_s09_q02",
                q: "Look at the graphic. Which room was originally scheduled for Elena Rostova's presentation?",
                options: [
                    "A. Room 101",
                    "B. Room 102",
                    "C. Room 103",
                    "D. Room 104"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "graphic",
                trap_type: "đối chiếu tên diễn giả với số phòng ban đầu",
                correct_reason: "Speaker: 'cloud computing architecture presentation delivered by Elena Rostova has been relocated from its original venue'. Tra bảng: Elena Rostova được xếp lịch ban đầu tại Room 102.",
                explanation_vi: "Câu hỏi bảng biểu (Graphic question): Bài của Elena Rostova ban đầu được xếp lịch ở đâu? Tra bảng: Elena Rostova phụ trách Track 2 ở Room 102. Chọn B."
            },
            {
                id: "p4_s09_q03",
                q: "Where has the relocated session been moved to?",
                options: [
                    "A. The outdoor courtyard pavilion",
                    "B. The Grand Ballroom on the second floor",
                    "C. The basement executive auditorium",
                    "D. The hotel business conference lounge"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "địa điểm phòng họp mới",
                correct_reason: "Speaker: 'relocated from its original venue to the Grand Ballroom on the second floor.'",
                explanation_vi: "Địa điểm chuyển đến mới là Phòng Grand Ballroom ở tầng 2. Chọn B."
            }
        ]
    },
    {
        setId: "p4_set10",
        part: 4,
        setNumber: 10,
        topic: "Biểu đồ hiệu suất doanh số khu vực (Graphic Question)",
        accent: "CA",
        speakers: [{ name: "Speaker (National Sales Director)", accent: "en-CA", role: "Sales Director (Monica)" }],
        graphic: {
            type: "bar_chart",
            title: "Annual Automotive Sales Targets vs Actual Units Sold",
            columns: ["Sales Region", "Annual Target (Units)", "Actual Sold (Units)", "Variance"],
            rows: [
                ["Northern Territory", "15,000", "14,200", "-800"],
                ["Eastern Coast", "22,000", "26,500", "+4,500"],
                ["Central Prairies", "18,000", "17,100", "-900"],
                ["Western Pacific", "20,000", "19,800", "-200"]
            ]
        },
        audioScript: `Good morning sales managers. Looking at our finalized end-of-year automotive unit numbers on the slide projection, I want to commend everyone for an exceptional effort in a challenging economic climate. While supply chain disruptions in semiconductor chips caused slight shortfalls in three of our operational districts, one region performed extraordinarily well by closing fleet vehicle contracts with municipal governments, beating its annual goal by over twenty percent. Because of this stellar accomplishment, all sales account executives from that leading district will receive the President's Diamond Award and an all-expenses-paid trip to our global summit in Honolulu this spring. Let us now examine our inventory strategy for electric vehicle rollouts in the upcoming quarters.`,
        transcript: `Good morning sales managers. Looking at our finalized end-of-year automotive unit numbers on the slide projection, I want to commend everyone for an exceptional effort in a challenging economic climate. While supply chain disruptions in semiconductor chips caused slight shortfalls in three of our operational districts, one region performed extraordinarily well by closing fleet vehicle contracts with municipal governments, beating its annual goal by over twenty percent. Because of this stellar accomplishment, all sales account executives from that leading district will receive the President's Diamond Award and an all-expenses-paid trip to our global summit in Honolulu this spring. Let us now examine our inventory strategy for electric vehicle rollouts in the upcoming quarters.`,
        translation_vi: `Chào buổi sáng các trưởng phòng bán hàng. Nhìn vào những con số bán xe ô tô cuối năm đã được chốt trên màn chiếu, tôi muốn khen ngợi mọi người vì một nỗ lực phi thường trong bối cảnh kinh tế đầy thách thức. Mặc dù sự gián đoạn chuỗi cung ứng chip bán dẫn đã gây ra sự thiếu hụt nhẹ ở ba trong số các khu vực hoạt động của chúng ta, một khu vực đã thể hiện xuất sắc phi thường bằng cách ký kết các hợp đồng xe đoàn với các chính quyền thành phố, vượt mục tiêu hàng năm hơn 20%. Nhờ thành tích xuất sắc này, tất cả các chuyên viên bán hàng từ khu vực dẫn đầu đó sẽ nhận được Giải thưởng Kim cương của Chủ tịch và một chuyến đi đài thọ toàn bộ chi phí đến hội nghị thượng đỉnh toàn cầu của chúng ta tại Honolulu vào mùa xuân này. Giờ chúng ta hãy cùng xem xét chiến lược hàng tồn kho cho việc triển khai xe điện trong các quý tới.`,
        questions: [
            {
                id: "p4_s10_q01",
                q: "What challenge affected vehicle sales during the year?",
                options: [
                    "A. Severe foreign currency inflation",
                    "B. Supply chain disruptions in semiconductor chips",
                    "C. A nationwide dockworkers labor strike",
                    "D. A surge in automotive fuel prices"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "thách thức chuỗi cung ứng",
                correct_reason: "Speaker: 'supply chain disruptions in semiconductor chips caused slight shortfalls'",
                explanation_vi: "Khó khăn trong năm là sự gián đoạn chuỗi cung ứng chip bán dẫn (supply chain disruptions in semiconductor chips). Chọn B."
            },
            {
                id: "p4_s10_q02",
                q: "Look at the graphic. Which region will receive the President's Diamond Award?",
                options: [
                    "A. Northern Territory",
                    "B. Eastern Coast",
                    "C. Central Prairies",
                    "D. Western Pacific"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "graphic",
                trap_type: "đối chiếu khu vực vượt chỉ tiêu doanh số",
                correct_reason: "Speaker: 'beating its annual goal by over twenty percent... all sales account executives from that leading district will receive the President's Diamond Award.' Đối chiếu bảng: Eastern Coast đạt 26,500 so với chỉ tiêu 22,000 (+4,500 units ~ +20.5%).",
                explanation_vi: "Câu hỏi bảng biểu (Graphic question): Khu vực nào nhận giải thưởng? Người nói bảo khu vực duy nhất vượt chỉ tiêu trên 20%. Tra bảng: Eastern Coast đạt 26,500 xe so với mục tiêu 22,000 (vượt +4,500 xe). Chọn B."
            },
            {
                id: "p4_s10_q03",
                q: "What prize is included with the award?",
                options: [
                    "A. A new company-provided electric vehicle",
                    "B. A fully funded trip to a summit in Honolulu",
                    "C. Additional company shares and stock options",
                    "D. A six-week sabbatical leave"
                ],
                ans: 1,
                ansLetter: "B",
                question_type: "detail",
                trap_type: "giải thưởng chuyến đi hội nghị",
                correct_reason: "Speaker: 'all-expenses-paid trip to our global summit in Honolulu this spring.'",
                explanation_vi: "Phần thưởng kèm theo là chuyến đi được đài thọ toàn bộ chi phí dự hội nghị thượng đỉnh tại Honolulu (fully funded trip to Honolulu). Chọn B."
            }
        ]
    }
];

// Populate audio_url for all items
part1Questions.forEach(q => {
    q.audio_url = `/audio/listening/part1/${q.id}.mp3`;
});
part2Questions.forEach(q => {
    q.audio_url = `/audio/listening/part2/${q.id}.mp3`;
});
part3Sets.forEach(s => {
    s.audio_url = `/audio/listening/part3/${s.setId}.mp3`;
    s.questions.forEach(q => {
        q.audio_url = s.audio_url;
    });
});
part4Sets.forEach(s => {
    s.audio_url = `/audio/listening/part4/${s.setId}.mp3`;
    s.questions.forEach(q => {
        q.audio_url = s.audio_url;
    });
});

// Full Unified Database Schema
const fullDatabase = {
    metadata: {
        version: "2.0.0",
        standard: "ETS TOEIC Listening 2026",
        title: "Cùng Đăng Ra Trường - Ngân Hàng Luyện Nghe TOEIC Chuẩn ETS",
        description: "100 câu luyện nghe chuẩn ETS (P1: 6 câu, P2: 25 câu, P3: 39 câu / 13 sets, P4: 30 câu / 10 sets) với giọng đọc đa accent (US, UK, AU, CA), phân tích bẫy, từ vựng IPA và lời giải tiếng Việt chất lượng cao.",
        totalQuestions: 100,
        parts: {
            part1: { count: 6, sets: 6, optionsPerQuestion: 4 },
            part2: { count: 25, sets: 25, optionsPerQuestion: 3 },
            part3: { count: 39, sets: 13, questionsPerSet: 3, optionsPerQuestion: 4 },
            part4: { count: 30, sets: 10, questionsPerSet: 3, optionsPerQuestion: 4 }
        },
        generatedAt: new Date().toISOString()
    },
    part1: part1Questions,
    part2: part2Questions,
    part3: part3Sets,
    part4: part4Sets
};

// Write to JSON file
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fullDatabase, null, 2), 'utf8');

console.log(`\n🎉 THÀNH CÔNG: Đã xây dựng hoàn tất Ngân hàng câu hỏi ETS 2026 V2!`);
console.log(`   - File: ${OUTPUT_FILE}`);
console.log(`   - Part 1: ${fullDatabase.part1.length} câu (Mô tả ảnh · 4 đáp án A-D)`);
console.log(`   - Part 2: ${fullDatabase.part2.length} câu (Hỏi & Đáp · 3 đáp án A-C)`);
console.log(`   - Part 3: ${fullDatabase.part3.length} sets × 3 = ${fullDatabase.part3.length * 3} câu (Hội thoại đa giọng · có câu hỏi ý định & bảng biểu)`);
console.log(`   - Part 4: ${fullDatabase.part4.length} sets × 3 = ${fullDatabase.part4.length * 3} câu (Độc thoại chuyên sâu · có câu hỏi ý định & biểu đồ)`);
console.log(`   - TỔNG CỘNG: ${fullDatabase.metadata.totalQuestions} câu chuẩn đề thi ETS!\n`);
