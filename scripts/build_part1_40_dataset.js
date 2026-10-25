const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'listening_database_v2.json');

// 40 Comprehensive Part 1 Questions (10 per topic)
const fullPart1Questions = [
    // -------------------------------------------------------------------------
    // TOPIC 1: TRANH TẢ NGƯỜI (10 CÂU: p1_q01 -> p1_q10)
    // -------------------------------------------------------------------------
    {
        id: "p1_q01",
        part: 1,
        topic: "Tranh tả người",
        subtopic: "Hành động & Tư thế nhân vật",
        difficulty: "A2",
        accent: "US",
        speakers: [{ name: "Jenny (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_01_person.webp",
        alt_text: "A professional female architect examining an architectural blueprint floor plan on a drafting table",
        audioScript: "Number 1. Look at the picture marked number 1 in your test book. (A) She is hanging a picture frame on the wall. (B) A woman is examining a blueprint on a table. (C) She is rolling up a sheet of paper. (D) She is speaking into a telephone receiver.",
        transcript: "(A) She is hanging a picture frame on the wall. (B) A woman is examining a blueprint on a table. (C) She is rolling up a sheet of paper. (D) She is speaking into a telephone receiver.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. She is hanging a picture frame on the wall.",
            "B. A woman is examining a blueprint on a table.",
            "C. She is rolling up a sheet of paper.",
            "D. She is speaking into a telephone receiver."
        ],
        ans: 1,
        ansLetter: "B",
        question_type: "action",
        trap_type: "bẫy hành động sai và trạng thái tiếp diễn",
        correct_reason: "Người phụ nữ đang đứng cúi người đặt hai tay lên mặt bàn và chăm chú nhìn bản vẽ kiến trúc trải phẳng.",
        explanation_vi: "Phân tích tranh: Người phụ nữ đứng bên bàn làm việc và nhìn chăm chú vào bản vẽ kiến trúc trải phẳng. (B) 'A woman is examining a blueprint on a table' mô tả chính xác nhất. (A) sai vì không treo tranh. (C) sai vì bản vẽ đang mở phẳng, không cuộn. (D) sai vì không dùng điện thoại.",
        key_vocab: [
            { word: "examine", ipa: "/ɪɡˈzæm.ɪn/", meaning: "quan sát kỹ, kiểm tra" },
            { word: "blueprint", ipa: "/ˈbluː.prɪnt/", meaning: "bản vẽ thiết kế kiến trúc" },
            { word: "drafting table", ipa: "/ˈdrɑːf.tɪŋ ˌteɪ.bəl/", meaning: "bàn vẽ kỹ thuật" }
        ],
        exam_tip: "Với tranh tả người, hãy chú ý mắt nhìn vào đâu và tay đang làm hành động gì. Động từ 'examine' rất thường xuyên là đáp án đúng trong ETS.",
        audio_url: "/audio/listening/part1/p1_q01.mp3"
    },
    {
        id: "p1_q02_person",
        part: 1,
        topic: "Tranh tả người",
        subtopic: "Bác sĩ tại phòng khám",
        difficulty: "A2",
        accent: "US",
        speakers: [{ name: "Guy (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_05_doctor.webp",
        alt_text: "A doctor in a white lab coat examining a chest X-ray on an illuminated wall display",
        audioScript: "Number 2. Look at the picture marked number 2 in your test book. (A) A physician is reviewing an X-ray on a wall display. (B) He is prescribing medication to a patient. (C) A stethoscope is lying on the examination table. (D) The lights in the laboratory have been switched off.",
        transcript: "(A) A physician is reviewing an X-ray on a wall display. (B) He is prescribing medication to a patient. (C) A stethoscope is lying on the examination table. (D) The lights in the laboratory have been switched off.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A physician is reviewing an X-ray on a wall display.",
            "B. He is prescribing medication to a patient.",
            "C. A stethoscope is lying on the examination table.",
            "D. The lights in the laboratory have been switched off."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "action",
        trap_type: "bẫy đối tượng không xuất hiện trong hình (no patient)",
        correct_reason: "Bác sĩ mặc áo blouse trắng đang nhìn vào tấm phim X-quang gắn trên bảng đèn chiếu sáng trên tường.",
        explanation_vi: "(A) đúng vì bác sĩ đang xem phim chụp X-quang trên bảng đèn ('reviewing an X-ray on a wall display'). (B) sai vì trong phòng không có bệnh nhân. (C) sai vì ống nghe đeo trên cổ bác sĩ, không nằm trên bàn. (D) sai vì đèn đang bật sáng.",
        key_vocab: [
            { word: "physician", ipa: "/fɪˈzɪʃ.ən/", meaning: "bác sĩ điều trị" },
            { word: "review", ipa: "/rɪˈvjuː/", meaning: "xem xét, đánh giá" },
            { word: "illuminated", ipa: "/ɪˈluː.mɪ.neɪ.tɪd/", meaning: "được chiếu sáng" }
        ],
        exam_tip: "Khi nghe đáp án có danh từ chỉ người khác (patient, customer), hãy liếc thật nhanh xem trong ảnh có người đó hay không.",
        audio_url: "/audio/listening/part1/p1_q02.mp3"
    },
    {
        id: "p1_q03_person",
        part: 1,
        topic: "Tranh tả người",
        subtopic: "Thư viện & Sắp xếp sách",
        difficulty: "B1",
        accent: "UK",
        speakers: [{ name: "Sonia (UK)", accent: "en-GB", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_06_librarian.webp",
        alt_text: "A librarian reaching up to place books on a high wooden bookshelf",
        audioScript: "Number 3. Look at the picture marked number 3 in your test book. (A) A woman is checking out a library book. (B) She is stacking books onto a tall shelf. (C) Patrons are reading newspapers at a study carrel. (D) She is adjusting the lens of a photocopier.",
        transcript: "(A) A woman is checking out a library book. (B) She is stacking books onto a tall shelf. (C) Patrons are reading newspapers at a study carrel. (D) She is adjusting the lens of a photocopier.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A woman is checking out a library book.",
            "B. She is stacking books onto a tall shelf.",
            "C. Patrons are reading newspapers at a study carrel.",
            "D. She is adjusting the lens of a photocopier."
        ],
        ans: 1,
        ansLetter: "B",
        question_type: "action",
        trap_type: "bẫy hành động thường gặp ở thư viện (checking out vs shelving)",
        correct_reason: "Người phụ nữ đang với tay xếp những cuốn sách lên giá sách gỗ cao.",
        explanation_vi: "(B) đúng: 'She is stacking books onto a tall shelf'. (A) sai vì cô ấy không đứng ở quầy mượn sách. (C) sai vì không có độc giả nào đang đọc báo. (D) sai vì không có máy photocopy.",
        key_vocab: [
            { word: "stack", ipa: "/stæk/", meaning: "xếp chồng, xếp lên giá" },
            { word: "patron", ipa: "/ˈpeɪ.trən/", meaning: "độc giả, khách quen" },
            { word: "carrel", ipa: "/ˈkær.əl/", meaning: "bàn học cá nhân có vách ngăn" }
        ],
        exam_tip: "Động từ 'stack', 'shelve', 'arrange' là từ khóa ăn điểm kinh điển trong tranh thư viện và kho hàng.",
        audio_url: "/audio/listening/part1/p1_q03.mp3"
    },
    {
        id: "p1_q04_person",
        part: 1,
        topic: "Tranh tả người",
        subtopic: "Quán cà phê & Dọn dẹp",
        difficulty: "A2",
        accent: "UK",
        speakers: [{ name: "Ryan (UK)", accent: "en-GB", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_07_barista.webp",
        alt_text: "A barista wiping down a wooden coffee shop counter with a clean cloth",
        audioScript: "Number 4. Look at the picture marked number 4 in your test book. (A) A server is wiping down a wooden counter. (B) He is pouring coffee into a customer's mug. (C) Chairs are stacked on top of the dining tables. (D) A menu board is being replaced on the wall.",
        transcript: "(A) A server is wiping down a wooden counter. (B) He is pouring coffee into a customer's mug. (C) Chairs are stacked on top of the dining tables. (D) A menu board is being replaced on the wall.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A server is wiping down a wooden counter.",
            "B. He is pouring coffee into a customer's mug.",
            "C. Chairs are stacked on top of the dining tables.",
            "D. A menu board is being replaced on the wall."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "action",
        trap_type: "bẫy hành động phục vụ đồ uống (pouring coffee)",
        correct_reason: "Nhân viên quán cầm khăn lau mặt quầy gỗ.",
        explanation_vi: "(A) đúng vì nhân viên đang lau chùi mặt quầy bar ('wiping down a wooden counter'). (B) sai vì anh ấy không rót cà phê. (C) sai vì ghế đặt bình thường dưới sàn. (D) sai vì không ai thay bảng thực đơn.",
        key_vocab: [
            { word: "wipe down", ipa: "/waɪp daʊn/", meaning: "lau sạch bề mặt" },
            { word: "counter", ipa: "/ˈkaʊn.tər/", meaning: "quầy phục vụ, quầy thu ngân" },
            { word: "stack", ipa: "/stæk/", meaning: "chồng lên nhau" }
        ],
        exam_tip: "Hành động lau dọn ('wiping', 'cleaning', 'sweeping') thường xuất hiện trong tranh nhà hàng, khách sạn.",
        audio_url: "/audio/listening/part1/p1_q04.mp3"
    },
    {
        id: "p1_q05_person",
        part: 1,
        topic: "Tranh tả người",
        subtopic: "Công trường xây dựng",
        difficulty: "B1",
        accent: "AU",
        speakers: [{ name: "Natasha (AU)", accent: "en-AU", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_08_construction.webp",
        alt_text: "A construction engineer wearing a hardhat looking down at technical blueprints",
        audioScript: "Number 5. Look at the picture marked number 5 in your test book. (A) A worker is operating heavy machinery. (B) He is looking down at a technical document. (C) Scaffolding has been dismantled around the structure. (D) Safety cones are being loaded into a truck.",
        transcript: "(A) A worker is operating heavy machinery. (B) He is looking down at a technical document. (C) Scaffolding has been dismantled around the structure. (D) Safety cones are being loaded into a truck.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A worker is operating heavy machinery.",
            "B. He is looking down at a technical document.",
            "C. Scaffolding has been dismantled around the structure.",
            "D. Safety cones are being loaded into a truck."
        ],
        ans: 1,
        ansLetter: "B",
        question_type: "action",
        trap_type: "bẫy hành động lái máy móc nặng (operating machinery)",
        correct_reason: "Kỹ sư đội mũ bảo hộ đang cúi đầu xem tài liệu kỹ thuật trên tay.",
        explanation_vi: "(B) đúng: 'looking down at a technical document'. (A) sai vì người này đứng trên mặt đất, không lái máy ủi/cần cẩu. (C) sai vì giàn giáo vẫn đang dựng. (D) sai vì không ai bốc dỡ cọc tiêu giao thông.",
        key_vocab: [
            { word: "hardhat", ipa: "/ˈhɑːd.hæt/", meaning: "mũ bảo hộ lao động" },
            { word: "scaffolding", ipa: "/ˈskæf.əl.dɪŋ/", meaning: "giàn giáo xây dựng" },
            { word: "dismantle", ipa: "/dɪsˈmæn.təl/", meaning: "tháo dỡ" }
        ],
        exam_tip: "Tranh công trường ETS rất hay bẫy hành động 'operating heavy machinery' khi thực tế nhân vật chỉ đang xem bản vẽ hoặc đo đạc.",
        audio_url: "/audio/listening/part1/p1_q05.mp3"
    },
    {
        id: "p1_q06_person",
        part: 1,
        topic: "Tranh tả người",
        subtopic: "Thuyết trình hội nghị",
        difficulty: "B2",
        accent: "AU",
        speakers: [{ name: "William (AU)", accent: "en-AU", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_09_podium.webp",
        alt_text: "A business executive delivering a presentation from behind a wooden lectern",
        audioScript: "Number 6. Look at the picture marked number 6 in your test book. (A) A speaker is addressing an audience from behind a podium. (B) He is handing out printed agendas to the attendees. (C) The projector screen has been lowered onto the stage. (D) People are exiting through the auditorium doors.",
        transcript: "(A) A speaker is addressing an audience from behind a podium. (B) He is handing out printed agendas to the attendees. (C) The projector screen has been lowered onto the stage. (D) People are exiting through the auditorium doors.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A speaker is addressing an audience from behind a podium.",
            "B. He is handing out printed agendas to the attendees.",
            "C. The projector screen has been lowered onto the stage.",
            "D. People are exiting through the auditorium doors."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "action",
        trap_type: "bẫy phân phát tài liệu (handing out agendas)",
        correct_reason: "Diễn giả đứng sau bục phát biểu nói chuyện trước hội trường.",
        explanation_vi: "(A) đúng: 'addressing an audience from behind a podium'. (B) sai vì ông ấy đứng nói, không phát tài liệu. (C) sai vì màn chiếu treo cố định phía sau. (D) sai vì cử tọa đang ngồi chăm chú lắng nghe.",
        key_vocab: [
            { word: "address", ipa: "/əˈdres/", meaning: "phát biểu, diễn thuyết trước" },
            { word: "podium", ipa: "/ˈpəʊ.di.əm/", meaning: "bục phát biểu (lectern)" },
            { word: "attendee", ipa: "/ə.tenˈdiː/", meaning: "người tham dự" }
        ],
        exam_tip: "Động từ 'address' trong TOEIC Listening thường mang nghĩa là phát biểu trước một cử tọa ('addressing a gathering/audience').",
        audio_url: "/audio/listening/part1/p1_q06.mp3"
    },
    {
        id: "p1_q07_person",
        part: 1,
        topic: "Tranh tả người",
        subtopic: "Kho hàng & Vận chuyển",
        difficulty: "A2",
        accent: "CA",
        speakers: [{ name: "Clara (CA)", accent: "en-CA", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_10_warehouse_cart.webp",
        alt_text: "A warehouse worker pushing a handcart stacked with cardboard boxes down an aisle",
        audioScript: "Number 7. Look at the picture marked number 7 in your test book. (A) A man is pushing a handcart through a warehouse aisle. (B) He is sealing a carton with packing tape. (C) Cargo containers are being hoisted by a crane. (D) Shelves are empty of merchandise.",
        transcript: "(A) A man is pushing a handcart through a warehouse aisle. (B) He is sealing a carton with packing tape. (C) Cargo containers are being hoisted by a crane. (D) Shelves are empty of merchandise.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A man is pushing a handcart through a warehouse aisle.",
            "B. He is sealing a carton with packing tape.",
            "C. Cargo containers are being hoisted by a crane.",
            "D. Shelves are empty of merchandise."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "action",
        trap_type: "bẫy niêm phong thùng hàng (sealing a carton)",
        correct_reason: "Người đàn ông hai tay đẩy chiếc xe đẩy chở các thùng carton đi dọc lối đi trong kho.",
        explanation_vi: "(A) đúng: 'pushing a handcart through a warehouse aisle'. (B) sai vì không có cuộn băng dính dán thùng. (C) sai vì trong kho không có cần cẩu nâng container. (D) sai vì các kệ chứa đầy hàng hóa.",
        key_vocab: [
            { word: "handcart", ipa: "/ˈhænd.kɑːt/", meaning: "xe đẩy hàng bằng tay" },
            { word: "aisle", ipa: "/aɪl/", meaning: "lối đi giữa các dãy kệ (chữ s câm)" },
            { word: "merchandise", ipa: "/ˈmɜː.tʃən.daɪs/", meaning: "hàng hóa thương mại" }
        ],
        exam_tip: "Chú ý phát âm từ 'aisle' (/aɪl/) có âm 's' câm, rất hay xuất hiện trong tranh kho hàng, siêu thị và máy bay.",
        audio_url: "/audio/listening/part1/p1_q01.mp3"
    },
    {
        id: "p1_q08_person",
        part: 1,
        topic: "Tranh tả người",
        subtopic: "Đầu bếp nhà hàng",
        difficulty: "B1",
        accent: "CA",
        speakers: [{ name: "Liam (CA)", accent: "en-CA", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_11_chef.webp",
        alt_text: "A professional chef in a white uniform preparing food in a frying pan over a stove",
        audioScript: "Number 8. Look at the picture marked number 8 in your test book. (A) A cook is preparing food over a kitchen stove. (B) He is washing dirty dishes in a stainless steel sink. (C) Plates of food are being served to patrons. (D) The refrigerator door has been left wide open.",
        transcript: "(A) A cook is preparing food over a kitchen stove. (B) He is washing dirty dishes in a stainless steel sink. (C) Plates of food are being served to patrons. (D) The refrigerator door has been left wide open.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A cook is preparing food over a kitchen stove.",
            "B. He is washing dirty dishes in a stainless steel sink.",
            "C. Plates of food are being served to patrons.",
            "D. The refrigerator door has been left wide open."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "action",
        trap_type: "bẫy rửa bát đĩa (washing dishes)",
        correct_reason: "Đầu bếp đứng trước bếp nấu đang đảo chảo thức ăn.",
        explanation_vi: "(A) đúng: 'preparing food over a kitchen stove'. (B) sai vì anh ấy không đứng ở bồn rửa bát. (C) sai vì chưa đưa món ăn ra bàn phục vụ khách. (D) sai vì cửa tủ lạnh đóng kín.",
        key_vocab: [
            { word: "cook", ipa: "/kʊk/", meaning: "người nấu ăn, đầu bếp" },
            { word: "stove", ipa: "/stəʊv/", meaning: "bếp nấu" },
            { word: "stainless steel", ipa: "/ˌsteɪn.ləs ˈstiːl/", meaning: "thép không gỉ, inox" }
        ],
        exam_tip: "'Cook' vừa là động từ nấu ăn vừa là danh từ chỉ người nấu. Tránh nhầm với 'cooker' (nồi cơm điện/bếp nấu).",
        audio_url: "/audio/listening/part1/p1_q02.mp3"
    },
    {
        id: "p1_q09_person",
        part: 1,
        topic: "Tranh tả người",
        subtopic: "Kỹ thuật viên sửa chữa xe",
        difficulty: "A2",
        accent: "US",
        speakers: [{ name: "Jenny (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_12_mechanic.webp",
        alt_text: "An auto mechanic in blue overalls inspecting a car engine under the raised hood",
        audioScript: "Number 9. Look at the picture marked number 9 in your test book. (A) A technician is inspecting a vehicle engine. (B) He is changing the front tire of an automobile. (C) A car is being driven into an automatic wash bay. (D) Tools have been locked inside a metal storage box.",
        transcript: "(A) A technician is inspecting a vehicle engine. (B) He is changing the front tire of an automobile. (C) A car is being driven into an automatic wash bay. (D) Tools have been locked inside a metal storage box.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A technician is inspecting a vehicle engine.",
            "B. He is changing the front tire of an automobile.",
            "C. A car is being driven into an automatic wash bay.",
            "D. Tools have been locked inside a metal storage box."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "action",
        trap_type: "bẫy thay lốp xe (changing a tire)",
        correct_reason: "Kỹ thuật viên đang cúi người kiểm tra động cơ dưới nắp capo mở.",
        explanation_vi: "(A) đúng: 'inspecting a vehicle engine'. (B) sai vì anh ấy đứng ở đầu xe xem máy, không thay lốp. (C) sai vì xe đang đỗ tĩnh trong xưởng sửa chữa. (D) sai vì dụng cụ đang để sẵn trên xe đẩy dụng cụ.",
        key_vocab: [
            { word: "technician", ipa: "/tekˈnɪʃ.ən/", meaning: "kỹ thuật viên" },
            { word: "inspect", ipa: "/ɪnˈspekt/", meaning: "kiểm tra, giám định" },
            { word: "vehicle", ipa: "/ˈvɪə.kəl/", meaning: "phương tiện giao thông (chữ h câm)" }
        ],
        exam_tip: "Từ 'vehicle' phát âm là /ˈvɪə.kəl/, chữ 'h' hoàn toàn câm. Đây là từ bẫy nghe rất phổ biến trong đề thi.",
        audio_url: "/audio/listening/part1/p1_q03.mp3"
    },
    {
        id: "p1_q10_person",
        part: 1,
        topic: "Tranh tả người",
        subtopic: "Lễ tân khách sạn",
        difficulty: "A2",
        accent: "US",
        speakers: [{ name: "Guy (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_13_receptionist.webp",
        alt_text: "A hotel receptionist in professional attire typing on a desktop keyboard behind the check-in desk",
        audioScript: "Number 10. Look at the picture marked number 10 in your test book. (A) A staff member is entering information on a keyboard. (B) She is carrying luggage up a flight of stairs. (C) Guests are queuing in front of the elevator. (D) Key cards are being sorted on a coffee table.",
        transcript: "(A) A staff member is entering information on a keyboard. (B) She is carrying luggage up a flight of stairs. (C) Guests are queuing in front of the elevator. (D) Key cards are being sorted on a coffee table.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A staff member is entering information on a keyboard.",
            "B. She is carrying luggage up a flight of stairs.",
            "C. Guests are queuing in front of the elevator.",
            "D. Key cards are being sorted on a coffee table."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "action",
        trap_type: "bẫy mang vác hành lý (carrying luggage)",
        correct_reason: "Nhân viên lễ tân đặt tay gõ phím trên bàn quầy.",
        explanation_vi: "(A) đúng: 'entering information on a keyboard'. (B) sai vì cô ấy đứng tại quầy, không vác hành lý. (C) sai vì không có khách nào xếp hàng trước thang máy. (D) sai vì không có hành động phân loại thẻ khóa trên bàn cà phê.",
        key_vocab: [
            { word: "staff member", ipa: "/stɑːf ˈmem.bər/", meaning: "nhân viên" },
            { word: "enter information", ipa: "/ˈen.tər ˌɪn.fəˈmeɪ.ʃən/", meaning: "nhập thông tin" },
            { word: "flight of stairs", ipa: "/flaɪt əv steəz/", meaning: "dãy bậc cầu thang" }
        ],
        exam_tip: "'Typing on a keyboard' thường được paraphrase thành 'entering information on a computer' hoặc 'inputting data'.",
        audio_url: "/audio/listening/part1/p1_q04.mp3"
    }
];

console.log('Successfully prepared 10 questions for Tranh tả người.');
