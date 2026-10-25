const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'data', 'listening_database_v2.json');

const questions = [
    // =========================================================================
    // TOPIC 1: TRANH TẢ NGƯỜI (10 CÂU: p1_q01 -> p1_q10)
    // =========================================================================
    {
        id: "p1_q01",
        part: 1,
        topic: "Tranh tả người",
        subtopic: "Kiến trúc sư làm việc với bản vẽ",
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
        id: "p1_q02",
        part: 1,
        topic: "Tranh tả người",
        subtopic: "Bác sĩ tại phòng khám",
        difficulty: "A2",
        accent: "US",
        speakers: [{ name: "Guy (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_05_doctor.webp",
        alt_text: "A doctor examining a chest X-ray on an illuminated wall display",
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
        id: "p1_q03",
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
        id: "p1_q04",
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
        id: "p1_q05",
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
        id: "p1_q06",
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
        id: "p1_q07",
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
        id: "p1_q08",
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
        id: "p1_q09",
        part: 1,
        topic: "Tranh tả người",
        subtopic: "Kỹ thuật viên sửa chữa xe",
        difficulty: "A2",
        accent: "US",
        speakers: [{ name: "Jenny (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_12_mechanic.webp",
        alt_text: "An auto mechanic inspecting a car engine under the raised hood",
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
        id: "p1_q10",
        part: 1,
        topic: "Tranh tả người",
        subtopic: "Lễ tân khách sạn",
        difficulty: "A2",
        accent: "US",
        speakers: [{ name: "Guy (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_13_receptionist.webp",
        alt_text: "A hotel receptionist typing on a desktop keyboard behind the check-in desk",
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
    },

    // =========================================================================
    // TOPIC 2: TRANH TẢ VẬT (10 CÂU: p1_q11 -> p1_q20)
    // =========================================================================
    {
        id: "p1_q11",
        part: 1,
        topic: "Tranh tả vật",
        subtopic: "Phòng họp & Bàn ghế",
        difficulty: "A2",
        accent: "US",
        speakers: [{ name: "Guy (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_02_object.webp",
        alt_text: "An empty corporate conference room with modern office chairs arranged neatly around a polished oval conference table",
        audioScript: "Number 11. Look at the picture marked number 11 in your test book. (A) People are seated in a circle on the floor. (B) A projector is being mounted onto the ceiling. (C) Chairs are arranged around a long table. (D) Papers are scattered across the carpet.",
        transcript: "(A) People are seated in a circle on the floor. (B) A projector is being mounted onto the ceiling. (C) Chairs are arranged around a long table. (D) Papers are scattered across the carpet.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. People are seated in a circle on the floor.",
            "B. A projector is being mounted onto the ceiling.",
            "C. Chairs are arranged around a long table.",
            "D. Papers are scattered across the carpet."
        ],
        ans: 2,
        ansLetter: "C",
        question_type: "state",
        trap_type: "bẫy người trong tranh chỉ có đồ vật (People are seated)",
        correct_reason: "Các ghế văn phòng được xếp ngay ngắn bao quanh chiếc bàn họp dài hình bầu dục, không có người trong phòng.",
        explanation_vi: "Phân tích tranh vật: Phòng họp trống, không có người. (C) 'Chairs are arranged around a long table' (Ghế được sắp xếp quanh một bàn dài) mô tả hoàn hảo. (A) sai vì không có người. (B) sai bẫy bị động 'is being mounted'. (D) sai vì sàn nhà sạch sẽ.",
        key_vocab: [
            { word: "arrange", ipa: "/əˈreɪndʒ/", meaning: "sắp xếp, bài trí" },
            { word: "conference table", ipa: "/ˈkɒn.fər.əns ˌteɪ.bəl/", meaning: "bàn hội nghị" },
            { word: "scatter", ipa: "/ˈskæt.ər/", meaning: "rải rác bừa bãi" }
        ],
        exam_tip: "Khi tranh KHÔNG CÓ NGƯỜI, hãy loại ngay lập tức các đáp án chứa 'being + V3/ed' (đang được làm) và các câu có chủ ngữ là người.",
        audio_url: "/audio/listening/part1/p1_q02.mp3"
    },
    {
        id: "p1_q12",
        part: 1,
        topic: "Tranh tả vật",
        subtopic: "Bàn làm việc máy tính",
        difficulty: "A2",
        accent: "US",
        speakers: [{ name: "Jenny (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_14_desk.webp",
        alt_text: "A tidy office desk with dual computer monitors and a desk lamp",
        audioScript: "Number 12. Look at the picture marked number 12 in your test book. (A) Computer monitors are positioned on a desk surface. (B) A keyboard is being cleaned with a cloth. (C) A desk lamp has fallen to the carpeted floor. (D) Documents are scattered across an office chair.",
        transcript: "(A) Computer monitors are positioned on a desk surface. (B) A keyboard is being cleaned with a cloth. (C) A desk lamp has fallen to the carpeted floor. (D) Documents are scattered across an office chair.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Computer monitors are positioned on a desk surface.",
            "B. A keyboard is being cleaned with a cloth.",
            "C. A desk lamp has fallen to the carpeted floor.",
            "D. Documents are scattered across an office chair."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy bị động đang diễn ra (is being cleaned)",
        correct_reason: "Hai màn hình máy tính được đặt ngay ngắn trên mặt bàn làm việc.",
        explanation_vi: "(A) đúng: 'Computer monitors are positioned on a desk surface'. (B) sai bẫy bị động 'is being cleaned'. (C) sai vì đèn bàn đứng thẳng trên bàn. (D) sai vì ghế trống không có tài liệu.",
        key_vocab: [
            { word: "monitor", ipa: "/ˈmɒn.ɪ.tər/", meaning: "màn hình hiển thị" },
            { word: "positioned", ipa: "/pəˈzɪʃ.ənd/", meaning: "được đặt ở vị trí" },
            { word: "surface", ipa: "/ˈsɜː.fɪs/", meaning: "bề mặt" }
        ],
        exam_tip: "Các cụm từ chỉ vị trí tĩnh như 'be positioned on', 'be placed on', 'rest on' rất hay là đáp án đúng cho tranh tĩnh vật.",
        audio_url: "/audio/listening/part1/p1_q01.mp3"
    },
    {
        id: "p1_q13",
        part: 1,
        topic: "Tranh tả vật",
        subtopic: "Xe đạp tựa tường",
        difficulty: "A2",
        accent: "UK",
        speakers: [{ name: "Sonia (UK)", accent: "en-GB", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_15_bicycle.webp",
        alt_text: "A vintage bicycle leaning against a red brick building exterior wall",
        audioScript: "Number 13. Look at the picture marked number 13 in your test book. (A) A bicycle is leaning against an exterior wall. (B) A cyclist is pedaling down a paved street. (C) Bikes are locked to a metal parking rack. (D) The storefront window has been shattered.",
        transcript: "(A) A bicycle is leaning against an exterior wall. (B) A cyclist is pedaling down a paved street. (C) Bikes are locked to a metal parking rack. (D) The storefront window has been shattered.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A bicycle is leaning against an exterior wall.",
            "B. A cyclist is pedaling down a paved street.",
            "C. Bikes are locked to a metal parking rack.",
            "D. The storefront window has been shattered."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy giá đỡ xe đạp kinh điển (metal parking rack)",
        correct_reason: "Chiếc xe đạp đang tựa nghiêng vào bức tường gạch đỏ bên ngoài tòa nhà.",
        explanation_vi: "(A) đúng: 'A bicycle is leaning against an exterior wall'. (B) sai vì không có người đi xe đạp. (C) sai vì xe tựa vào tường chứ không khóa vào giá đỡ (metal rack). (D) sai vì cửa kính nguyên vẹn.",
        key_vocab: [
            { word: "lean against", ipa: "/liːn əˈɡenst/", meaning: "dựa vào, tựa vào" },
            { word: "exterior", ipa: "/ɪkˈstɪə.ri.ər/", meaning: "bên ngoài" },
            { word: "pedal", ipa: "/ˈped.əl/", meaning: "đạp bàn đạp xe" }
        ],
        exam_tip: "Bẫy xe đạp: ETS hay ra tranh một chiếc xe tựa tường và cho đáp án nhiễu là 'locked to a rack' hoặc 'riding a bicycle'.",
        audio_url: "/audio/listening/part1/p1_q03.mp3"
    },
    {
        id: "p1_q14",
        part: 1,
        topic: "Tranh tả vật",
        subtopic: "Tủ hồ sơ văn phòng",
        difficulty: "B1",
        accent: "UK",
        speakers: [{ name: "Ryan (UK)", accent: "en-GB", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_16_cabinets.webp",
        alt_text: "Metal office filing cabinets with one top drawer pulled open",
        audioScript: "Number 14. Look at the picture marked number 14 in your test book. (A) One of the cabinet drawers is pulled open. (B) A clerk is filing folders alphabetically. (C) Filing cabinets are being moved into an elevator. (D) Labels have fallen off the drawer fronts.",
        transcript: "(A) One of the cabinet drawers is pulled open. (B) A clerk is filing folders alphabetically. (C) Filing cabinets are being moved into an elevator. (D) Labels have fallen off the drawer fronts.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. One of the cabinet drawers is pulled open.",
            "B. A clerk is filing folders alphabetically.",
            "C. Filing cabinets are being moved into an elevator.",
            "D. Labels have fallen off the drawer fronts."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy người phân loại hồ sơ (filing folders)",
        correct_reason: "Một ngăn kéo phía trên của tủ hồ sơ bằng kim loại đang được kéo mở ra.",
        explanation_vi: "(A) đúng: 'One of the cabinet drawers is pulled open'. (B) sai vì phòng lưu trữ không có người. (C) sai bẫy bị động 'are being moved'. (D) sai vì nhãn tên vẫn gắn rõ trên ngăn kéo.",
        key_vocab: [
            { word: "drawer", ipa: "/drɔːr/", meaning: "ngăn kéo tủ" },
            { word: "filing cabinet", ipa: "/ˈfaɪ.lɪŋ ˌkæb.ɪ.nət/", meaning: "tủ tài liệu" },
            { word: "pulled open", ipa: "/pʊld ˈəʊ.pən/", meaning: "được kéo mở" }
        ],
        exam_tip: "Từ 'drawer' phát âm là /drɔːr/, chỉ ngăn kéo. Hãy chú ý trạng thái 'left open' hoặc 'pulled open'.",
        audio_url: "/audio/listening/part1/p1_q04.mp3"
    },
    {
        id: "p1_q15",
        part: 1,
        topic: "Tranh tả vật",
        subtopic: "Giá treo quần áo cửa hàng",
        difficulty: "A2",
        accent: "AU",
        speakers: [{ name: "Natasha (AU)", accent: "en-AU", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_17_clothing_rack.webp",
        alt_text: "Garments hanging neatly on display racks in a fashion retail boutique",
        audioScript: "Number 15. Look at the picture marked number 15 in your test book. (A) Garments are hanging neatly on a display rack. (B) A customer is trying on a jacket in a dressing room. (C) Clothes have been folded into cardboard shipping boxes. (D) A tailor is measuring fabric with a tape.",
        transcript: "(A) Garments are hanging neatly on a display rack. (B) A customer is trying on a jacket in a dressing room. (C) Clothes have been folded into cardboard shipping boxes. (D) A tailor is measuring fabric with a tape.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Garments are hanging neatly on a display rack.",
            "B. A customer is trying on a jacket in a dressing room.",
            "C. Clothes have been folded into cardboard shipping boxes.",
            "D. A tailor is measuring fabric with a tape."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy khách thử áo trong phòng thay đồ (trying on a jacket)",
        correct_reason: "Quần áo được treo ngay ngắn trên các thanh giá treo đồ trong cửa hàng thời trang.",
        explanation_vi: "(A) đúng: 'Garments are hanging neatly on a display rack'. (B) sai vì không có khách hàng thử áo. (C) sai vì quần áo treo chứ không gấp vào thùng carton. (D) sai vì không có thợ may đo vải.",
        key_vocab: [
            { word: "garment", ipa: "/ˈɡɑː.mənt/", meaning: "quần áo, trang phục" },
            { word: "display rack", ipa: "/dɪˈspleɪ ræk/", meaning: "giá trưng bày" },
            { word: "neatly", ipa: "/ˈniːt.li/", meaning: "ngay ngắn, gọn gàng" }
        ],
        exam_tip: "'Garment' là từ đồng nghĩa trang trọng của 'clothes/clothing', xuất hiện liên tục trong đề thi Part 1 và Part 7.",
        audio_url: "/audio/listening/part1/p1_q05.mp3"
    },
    {
        id: "p1_q16",
        part: 1,
        topic: "Tranh tả vật",
        subtopic: "Hành lý sân bay",
        difficulty: "B1",
        accent: "AU",
        speakers: [{ name: "William (AU)", accent: "en-AU", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_18_luggage.webp",
        alt_text: "Suitcases and luggage bags standing upright on the pavement",
        audioScript: "Number 16. Look at the picture marked number 16 in your test book. (A) Several pieces of luggage are resting on a pavement. (B) Passengers are rolling their bags through an entryway. (C) Suitcases are being loaded onto a luggage carousel. (D) A taxi trunk has been opened by a driver.",
        transcript: "(A) Several pieces of luggage are resting on a pavement. (B) Passengers are rolling their bags through an entryway. (C) Suitcases are being loaded onto a luggage carousel. (D) A taxi trunk has been opened by a driver.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Several pieces of luggage are resting on a pavement.",
            "B. Passengers are rolling their bags through an entryway.",
            "C. Suitcases are being loaded onto a luggage carousel.",
            "D. A taxi trunk has been opened by a driver."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy băng chuyền hành lý (luggage carousel)",
        correct_reason: "Nhiều vali hành lý đang dựng đứng trên vỉa hè lối ra sân bay.",
        explanation_vi: "(A) đúng: 'Several pieces of luggage are resting on a pavement'. (B) sai vì hành lý để tĩnh trên mặt đất, không có người kéo. (C) sai vì không có băng chuyền hành lý (carousel). (D) sai vì không có cốp taxi mở.",
        key_vocab: [
            { word: "luggage", ipa: "/ˈlʌɡ.ɪdʒ/", meaning: "hành lý (danh từ không đếm được)" },
            { word: "pavement", ipa: "/ˈpeɪv.mənt/", meaning: "vỉa hè, mặt đường lát gạch" },
            { word: "carousel", ipa: "/ˌkær.əˈsel/", meaning: "băng chuyền nhận hành lý" }
        ],
        exam_tip: "'Luggage' và 'baggage' là danh từ không đếm được, thường dùng với đơn vị 'a piece of luggage' / 'pieces of luggage'.",
        audio_url: "/audio/listening/part1/p1_q06.mp3"
    },
    {
        id: "p1_q17",
        part: 1,
        topic: "Tranh tả vật",
        subtopic: "Bàn tiệc buffet",
        difficulty: "B2",
        accent: "CA",
        speakers: [{ name: "Clara (CA)", accent: "en-CA", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_19_buffet.webp",
        alt_text: "Silver chafing dishes with covers arranged along a banquet buffet table",
        audioScript: "Number 17. Look at the picture marked number 17 in your test book. (A) Serving dishes are arranged on a long buffet table. (B) Diners are lining up with dinner plates. (C) A waiter is collecting empty glasses from tables. (D) The dining room lights have been dimmed.",
        transcript: "(A) Serving dishes are arranged on a long buffet table. (B) Diners are lining up with dinner plates. (C) A waiter is collecting empty glasses from tables. (D) The dining room lights have been dimmed.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Serving dishes are arranged on a long buffet table.",
            "B. Diners are lining up with dinner plates.",
            "C. A waiter is collecting empty glasses from tables.",
            "D. The dining room lights have been dimmed."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy thực khách xếp hàng (diners lining up)",
        correct_reason: "Các khay đựng thức ăn kim loại có nắp đậy được xếp thành hàng dọc theo bàn tiệc dài.",
        explanation_vi: "(A) đúng: 'Serving dishes are arranged on a long buffet table'. (B) sai vì không có thực khách xếp hàng. (C) sai vì không có bồi bàn thu dọn ly. (D) sai vì phòng tiệc sáng rực rỡ.",
        key_vocab: [
            { word: "serving dish", ipa: "/ˈsɜː.vɪŋ dɪʃ/", meaning: "khay/đĩa phục vụ thức ăn" },
            { word: "buffet", ipa: "/ˈbʊf.eɪ/", meaning: "tiệc đứng, tiệc tự chọn" },
            { word: "diner", ipa: "/ˈdaɪ.nər/", meaning: "người đi ăn nhà hàng" }
        ],
        exam_tip: "'Diner' (/ˈdaɪ.nər/) là người ăn, tránh nhầm với 'dinner' (/ˈdɪn.ər/) là bữa tối.",
        audio_url: "/audio/listening/part1/p1_q01.mp3"
    },
    {
        id: "p1_q18",
        part: 1,
        topic: "Tranh tả vật",
        subtopic: "Máy in trong văn phòng",
        difficulty: "A2",
        accent: "CA",
        speakers: [{ name: "Liam (CA)", accent: "en-CA", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_20_copier.webp",
        alt_text: "A commercial office photocopier with printed documents in the output tray",
        audioScript: "Number 18. Look at the picture marked number 18 in your test book. (A) Paper documents are stacked in the printer tray. (B) An employee is clearing a paper jam inside the machine. (C) A copier is being plugged into an electrical socket. (D) Toner cartridges are scattered across the floor.",
        transcript: "(A) Paper documents are stacked in the printer tray. (B) An employee is clearing a paper jam inside the machine. (C) A copier is being plugged into an electrical socket. (D) Toner cartridges are scattered across the floor.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Paper documents are stacked in the printer tray.",
            "B. An employee is clearing a paper jam inside the machine.",
            "C. A copier is being plugged into an electrical socket.",
            "D. Toner cartridges are scattered across the floor."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy kẹt giấy máy in (clearing a paper jam)",
        correct_reason: "Các tập tài liệu giấy đã in xếp ngay ngắn trong khay giấy đầu ra của máy photocopy.",
        explanation_vi: "(A) đúng: 'Paper documents are stacked in the printer tray'. (B) sai vì máy in đứng một mình, không ai sửa kẹt giấy. (C) sai bẫy bị động 'is being plugged'. (D) sai vì sàn nhà gọn gàng, không có hộp mực rơi vãi.",
        key_vocab: [
            { word: "printer tray", ipa: "/ˈprɪn.tər treɪ/", meaning: "khay đựng giấy máy in" },
            { word: "paper jam", ipa: "/ˈpeɪ.pər dʒæm/", meaning: "kẹt giấy máy in" },
            { word: "toner cartridge", ipa: "/ˈtəʊ.nər ˌkɑː.trɪdʒ/", meaning: "hộp mực máy in laser" }
        ],
        exam_tip: "Khi tranh tả máy móc văn phòng tĩnh, hãy để ý khay giấy ('tray') và các nút điều khiển ('control panel').",
        audio_url: "/audio/listening/part1/p1_q02.mp3"
    },
    {
        id: "p1_q19",
        part: 1,
        topic: "Tranh tả vật",
        subtopic: "Dù che hiên quán cà phê",
        difficulty: "A2",
        accent: "US",
        speakers: [{ name: "Jenny (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_21_patio.webp",
        alt_text: "Folded sun umbrellas over empty wooden tables on an outdoor restaurant patio",
        audioScript: "Number 19. Look at the picture marked number 19 in your test book. (A) Sun umbrellas are folded over outdoor patio tables. (B) Waiters are setting place mats for the evening dinner. (C) Rain has flooded the restaurant terrace. (D) Chairs have been overturned by strong wind.",
        transcript: "(A) Sun umbrellas are folded over outdoor patio tables. (B) Waiters are setting place mats for the evening dinner. (C) Rain has flooded the restaurant terrace. (D) Chairs have been overturned by strong wind.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Sun umbrellas are folded over outdoor patio tables.",
            "B. Waiters are setting place mats for the evening dinner.",
            "C. Rain has flooded the restaurant terrace.",
            "D. Chairs have been overturned by strong wind."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy người phục vụ dọn bàn (setting place mats)",
        correct_reason: "Những chiếc ô che nắng lớn đang được xếp gập lại bên trên các bàn gỗ ngoài trời.",
        explanation_vi: "(A) đúng: 'Sun umbrellas are folded over outdoor patio tables'. (B) sai vì ngoài hiên không có nhân viên phục vụ. (C) sai vì sân hiên khô ráo. (D) sai vì ghế đứng ngay ngắn quanh bàn.",
        key_vocab: [
            { word: "folded", ipa: "/ˈfəʊl.dɪd/", meaning: "được gấp lại, xếp lại" },
            { word: "patio", ipa: "/ˈpæt.i.əʊ/", meaning: "sân hiên ngoài trời (lát gạch/gỗ)" },
            { word: "overturned", ipa: "/ˌəʊ.vəˈtɜːnd/", meaning: "bị lật úp" }
        ],
        exam_tip: "Từ 'folded' (được gấp lại) và 'unfolded' (được mở ra) thường dùng để miêu tả ô (umbrellas) hoặc ghế gấp (folding chairs).",
        audio_url: "/audio/listening/part1/p1_q03.mp3"
    },
    {
        id: "p1_q20",
        part: 1,
        topic: "Tranh tả vật",
        subtopic: "Pallet gỗ kho hàng",
        difficulty: "B1",
        accent: "US",
        speakers: [{ name: "Guy (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_22_pallets.webp",
        alt_text: "Stacks of wooden shipping pallets stored in a warehouse bay",
        audioScript: "Number 20. Look at the picture marked number 20 in your test book. (A) Wooden pallets are stacked inside a storage facility. (B) A forklift is unloading cargo from a shipping container. (C) Boxes are tumbling off a conveyor belt. (D) The warehouse roll-up door is bolted shut.",
        transcript: "(A) Wooden pallets are stacked inside a storage facility. (B) A forklift is unloading cargo from a shipping container. (C) Boxes are tumbling off a conveyor belt. (D) The warehouse roll-up door is bolted shut.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Wooden pallets are stacked inside a storage facility.",
            "B. A forklift is unloading cargo from a shipping container.",
            "C. Boxes are tumbling off a conveyor belt.",
            "D. The warehouse roll-up door is bolted shut."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy xe nâng bốc hàng (forklift unloading cargo)",
        correct_reason: "Các pallet gỗ kê hàng được xếp chồng gọn gàng theo từng cột trong nhà kho.",
        explanation_vi: "(A) đúng: 'Wooden pallets are stacked inside a storage facility'. (B) sai vì không có xe nâng đang vận hành. (C) sai vì không có băng chuyền hàng hóa. (D) sai vì cửa cuốn kho đang mở cao đón ánh sáng.",
        key_vocab: [
            { word: "pallet", ipa: "/ˈpæl.ət/", meaning: "kệ kê hàng bằng gỗ/nhựa" },
            { word: "storage facility", ipa: "/ˈstɔː.rɪdʒ fəˌsɪl.ə.ti/", meaning: "cơ sở lưu trữ, kho bãi" },
            { word: "forklift", ipa: "/ˈfɔːk.lɪft/", meaning: "xe nâng hàng" }
        ],
        exam_tip: "'Pallet' là vật phẩm xuất hiện trong hơn 60% tranh kho bãi của đề thi TOEIC. Hãy ghi nhớ từ này.",
        audio_url: "/audio/listening/part1/p1_q04.mp3"
    },

    // =========================================================================
    // TOPIC 3: CẢNH & BỐI CẢNH (10 CÂU: p1_q21 -> p1_q30)
    // =========================================================================
    {
        id: "p1_q21",
        part: 1,
        topic: "Cảnh & bối cảnh",
        subtopic: "Công viên & Lối đi bộ",
        difficulty: "B1",
        accent: "UK",
        speakers: [{ name: "Sonia (UK)", accent: "en-GB", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_03_scene.webp",
        alt_text: "A scenic outdoor public park with curved stone paving, green grass, autumn trees, and empty wooden benches alongside the path",
        audioScript: "Number 21. Look at the picture marked number 21 in your test book. (A) Benches have been placed along a walkway. (B) Pedestrians are jogging on a path. (C) Leaves are being swept into a pile. (D) Streetlights are being installed near the grass.",
        transcript: "(A) Benches have been placed along a walkway. (B) Pedestrians are jogging on a path. (C) Leaves are being swept into a pile. (D) Streetlights are being installed near the grass.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Benches have been placed along a walkway.",
            "B. Pedestrians are jogging on a path.",
            "C. Leaves are being swept into a pile.",
            "D. Streetlights are being installed near the grass."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy thì tiếp diễn bị động (are being swept / are being installed)",
        correct_reason: "Những chiếc ghế băng gỗ ngoài trời được đặt dọc theo lối đi lát đá uốn lượn trong công viên.",
        explanation_vi: "Phân tích cảnh quan: Khung cảnh công viên mùa thu thanh bình, không có bóng người. (A) 'Benches have been placed along a walkway' (Ghế băng đã được đặt dọc lối đi) là đáp án đúng duy nhất ở thể hoàn thành miêu tả trạng thái tĩnh. (B) sai vì không có người chạy bộ. (C) và (D) sai bẫy bị động 'are being'.",
        key_vocab: [
            { word: "bench", ipa: "/bentʃ/", meaning: "ghế dài, ghế băng ngoài trời" },
            { word: "walkway", ipa: "/ˈwɔːk.weɪ/", meaning: "đường dành cho người đi bộ, lối đi" },
            { word: "sweep", ipa: "/swiːp/", meaning: "quét dọn (lá cây, rác)" }
        ],
        exam_tip: "Khi tranh không có người, thể bị động hiện tại tiếp diễn 'are being + V3/ed' hầu như luôn là BẪY SAI vì không có ai đang thực hiện hành động đó.",
        audio_url: "/audio/listening/part1/p1_q03.mp3"
    },
    {
        id: "p1_q22",
        part: 1,
        topic: "Cảnh & bối cảnh",
        subtopic: "Sảnh sân bay",
        difficulty: "B1",
        accent: "UK",
        speakers: [{ name: "Ryan (UK)", accent: "en-GB", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_23_terminal.webp",
        alt_text: "An airport departure concourse with digital flight information screens suspended from ceiling",
        audioScript: "Number 22. Look at the picture marked number 22 in your test book. (A) Information screens are suspended from the terminal ceiling. (B) An aircraft is taxiing down an active runway. (C) Travelers are boarding an international flight. (D) Luggage is being inspected by customs officers.",
        transcript: "(A) Information screens are suspended from the terminal ceiling. (B) An aircraft is taxiing down an active runway. (C) Travelers are boarding an international flight. (D) Luggage is being inspected by customs officers.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Information screens are suspended from the terminal ceiling.",
            "B. An aircraft is taxiing down an active runway.",
            "C. Travelers are boarding an international flight.",
            "D. Luggage is being inspected by customs officers."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy máy bay lăn trên đường băng (taxiing on runway)",
        correct_reason: "Các màn hình điện tử hiển thị chuyến bay được treo từ trần sảnh nhà ga sân bay.",
        explanation_vi: "(A) đúng: 'Information screens are suspended from the terminal ceiling'. (B) sai vì góc chụp bên trong nhà ga, không thấy máy bay trên đường băng. (C) sai vì hành khách đang đứng xem bảng giờ bay chứ chưa lên máy bay. (D) sai bẫy bị động 'is being inspected'.",
        key_vocab: [
            { word: "suspend", ipa: "/səˈspend/", meaning: "treo lơ lửng" },
            { word: "concourse", ipa: "/ˈkɒŋ.kɔːs/", meaning: "sảnh lớn nhà ga/sân bay" },
            { word: "taxi", ipa: "/ˈtæk.si/", meaning: "(máy bay) di chuyển chậm trên đường băng" }
        ],
        exam_tip: "'Suspend from' (được treo từ...) là cấu trúc chỉ vị trí rất hay gặp khi mô tả đèn chùm, màn hình hoặc biển báo trần.",
        audio_url: "/audio/listening/part1/p1_q04.mp3"
    },
    {
        id: "p1_q23",
        part: 1,
        topic: "Cảnh & bối cảnh",
        subtopic: "Ngã tư đường phố thành phố",
        difficulty: "A2",
        accent: "AU",
        speakers: [{ name: "Natasha (AU)", accent: "en-AU", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_24_crosswalk.webp",
        alt_text: "A pedestrian crosswalk painted on the asphalt street between modern skyscrapers",
        audioScript: "Number 23. Look at the picture marked number 23 in your test book. (A) White pedestrian stripes are painted on the roadway. (B) Traffic is backed up at a toll plaza. (C) A parade is marching down the boulevard. (D) Streetlights are being repaired by utility workers.",
        transcript: "(A) White pedestrian stripes are painted on the roadway. (B) Traffic is backed up at a toll plaza. (C) A parade is marching down the boulevard. (D) Streetlights are being repaired by utility workers.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. White pedestrian stripes are painted on the roadway.",
            "B. Traffic is backed up at a toll plaza.",
            "C. A parade is marching down the boulevard.",
            "D. Streetlights are being repaired by utility workers."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy trạm thu phí (toll plaza)",
        correct_reason: "Vạch kẻ màu trắng dành cho người đi bộ qua đường được sơn rõ nét trên mặt đường nhựa.",
        explanation_vi: "(A) đúng: 'White pedestrian stripes are painted on the roadway'. (B) sai vì không có trạm thu phí nào trên đường phố nội đô. (C) sai vì không có đoàn diễu hành. (D) sai bẫy bị động 'are being repaired'.",
        key_vocab: [
            { word: "crosswalk", ipa: "/ˈkrɒs.wɔːk/", meaning: "vạch qua đường cho người đi bộ (zebra crossing)" },
            { word: "stripe", ipa: "/straɪp/", meaning: "đường kẻ vạch, sọc" },
            { word: "roadway", ipa: "/ˈrəʊd.weɪ/", meaning: "lòng đường, mặt đường xe chạy" }
        ],
        exam_tip: "Khi tranh có đường phố, hãy chú ý các đặc điểm kẻ vạch ('lines painted on the street', 'crosswalk').",
        audio_url: "/audio/listening/part1/p1_q05.mp3"
    },
    {
        id: "p1_q24",
        part: 1,
        topic: "Cảnh & bối cảnh",
        subtopic: "Giảng đường đại học trống",
        difficulty: "B1",
        accent: "AU",
        speakers: [{ name: "William (AU)", accent: "en-AU", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_25_auditorium.webp",
        alt_text: "An empty university lecture auditorium with tiered wooden desks descending to stage",
        audioScript: "Number 24. Look at the picture marked number 24 in your test book. (A) Rows of wooden desks descend toward a podium. (B) A professor is lecturing in front of a chalkboard. (C) Students are taking an exam in an auditorium. (D) The stage curtains are drawn completely closed.",
        transcript: "(A) Rows of wooden desks descend toward a podium. (B) A professor is lecturing in front of a chalkboard. (C) Students are taking an exam in an auditorium. (D) The stage curtains are drawn completely closed.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Rows of wooden desks descend toward a podium.",
            "B. A professor is lecturing in front of a chalkboard.",
            "C. Students are taking an exam in an auditorium.",
            "D. The stage curtains are drawn completely closed."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy người trong giảng đường trống (professor lecturing / students taking exam)",
        correct_reason: "Các dãy bàn học gỗ xếp theo bậc thang thoai thoải hướng xuống phía bục giảng trung tâm.",
        explanation_vi: "(A) đúng: 'Rows of wooden desks descend toward a podium'. (B) và (C) sai vì giảng đường trống, không có giáo sư hay sinh viên. (D) sai vì sân khấu mở, không có rèm che.",
        key_vocab: [
            { word: "tiered", ipa: "/tɪəd/", meaning: "xếp theo bậc thang, tầng tầng lớp lớp" },
            { word: "descend", ipa: "/dɪˈsend/", meaning: "dốc xuống, đi xuống" },
            { word: "auditorium", ipa: "/ˌɔː.dɪˈtɔː.ri.əm/", meaning: "khán phòng, giảng đường lớn" }
        ],
        exam_tip: "Động từ 'descend' (dốc xuống) và 'ascend' (dốc lên) thường dùng miêu tả cấu trúc bậc thang hoặc khán đài dốc.",
        audio_url: "/audio/listening/part1/p1_q06.mp3"
    },
    {
        id: "p1_q25",
        part: 1,
        topic: "Cảnh & bối cảnh",
        subtopic: "Bến cảng ven sông",
        difficulty: "A2",
        accent: "CA",
        speakers: [{ name: "Clara (CA)", accent: "en-CA", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_26_pier.webp",
        alt_text: "Small boats and yachts docked along a wooden waterfront pier",
        audioScript: "Number 25. Look at the picture marked number 25 in your test book. (A) Boats are docked along the edge of a pier. (B) Passengers are disembarking from a large ferry. (C) A vessel is sailing across an open ocean. (D) Fishermen are casting nets into the water.",
        transcript: "(A) Boats are docked along the edge of a pier. (B) Passengers are disembarking from a large ferry. (C) A vessel is sailing across an open ocean. (D) Fishermen are casting nets into the water.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Boats are docked along the edge of a pier.",
            "B. Passengers are disembarking from a large ferry.",
            "C. A vessel is sailing across an open ocean.",
            "D. Fishermen are casting nets into the water."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy hành khách rời phà (passengers disembarking)",
        correct_reason: "Nhiều thuyền nhỏ đang neo đậu dọc theo mép cầu tàu gỗ.",
        explanation_vi: "(A) đúng: 'Boats are docked along the edge of a pier'. (B) sai vì không có chiếc phà lớn hay hành khách lên xuống. (C) sai vì thuyền đang neo tĩnh bên cầu cảng, không chạy ngoài khơi. (D) sai vì không có ngư dân quăng lưới.",
        key_vocab: [
            { word: "dock", ipa: "/dɒk/", meaning: "cập bến, neo đậu ở bến tàu" },
            { word: "pier", ipa: "/pɪər/", meaning: "cầu tàu, bến tàu nhô ra biển" },
            { word: "disembark", ipa: "/ˌdɪs.ɪmˈbɑːk/", meaning: "xuống tàu/máy bay" }
        ],
        exam_tip: "'Dock' và 'moor' là hai động từ miêu tả thuyền bè neo đậu phổ biến nhất trong đề thi TOEIC.",
        audio_url: "/audio/listening/part1/p1_q01.mp3"
    },
    {
        id: "p1_q26",
        part: 1,
        topic: "Cảnh & bối cảnh",
        subtopic: "Khu vực chờ sảnh khách sạn",
        difficulty: "A2",
        accent: "CA",
        speakers: [{ name: "Liam (CA)", accent: "en-CA", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_27_lounge.webp",
        alt_text: "A contemporary hotel lobby lounge with indoor green plants and comfortable sofas",
        audioScript: "Number 26. Look at the picture marked number 26 in your test book. (A) Potted plants are positioned beside upholstered seating. (B) A receptionist is answering phone calls at the desk. (C) Carpets are being vacuumed by housekeeping staff. (D) Luggage carts are blocking the entrance doorway.",
        transcript: "(A) Potted plants are positioned beside upholstered seating. (B) A receptionist is answering phone calls at the desk. (C) Carpets are being vacuumed by housekeeping staff. (D) Luggage carts are blocking the entrance doorway.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Potted plants are positioned beside upholstered seating.",
            "B. A receptionist is answering phone calls at the desk.",
            "C. Carpets are being vacuumed by housekeeping staff.",
            "D. Luggage carts are blocking the entrance doorway."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy hút bụi thảm (carpets being vacuumed)",
        correct_reason: "Những chậu cây cảnh được đặt cạnh các bộ ghế bành bọc nệm trong sảnh.",
        explanation_vi: "(A) đúng: 'Potted plants are positioned beside upholstered seating'. (B) sai vì góc chụp phòng chờ không thấy quầy lễ tân. (C) sai bẫy bị động 'are being vacuumed'. (D) sai vì không có xe chở hành lý chắn cửa.",
        key_vocab: [
            { word: "potted plant", ipa: "/ˈpɒt.ɪd plɑːnt/", meaning: "cây trồng trong chậu" },
            { word: "upholstered", ipa: "/ʌpˈhəʊl.stəd/", meaning: "bọc đệm/da (ghế sofa)" },
            { word: "vacuum", ipa: "/ˈvæk.juːm/", meaning: "hút bụi" }
        ],
        exam_tip: "'Potted plants' (cây trồng trong chậu) là đối tượng tĩnh xuất hiện cực kỳ thường xuyên ở sảnh khách sạn, văn phòng.",
        audio_url: "/audio/listening/part1/p1_q02.mp3"
    },
    {
        id: "p1_q27",
        part: 1,
        topic: "Cảnh & bối cảnh",
        subtopic: "Sân ga đường sắt",
        difficulty: "A2",
        accent: "US",
        speakers: [{ name: "Jenny (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_28_platform.webp",
        alt_text: "An outdoor railway platform alongside parallel steel train tracks",
        audioScript: "Number 27. Look at the picture marked number 27 in your test book. (A) A railway platform borders a pair of empty tracks. (B) A high-speed train is arriving at the terminal. (C) Commuters are rushing toward the ticket barriers. (D) Construction barriers block the passenger concourse.",
        transcript: "(A) A railway platform borders a pair of empty tracks. (B) A high-speed train is arriving at the terminal. (C) Commuters are rushing toward the ticket barriers. (D) Construction barriers block the passenger concourse.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A railway platform borders a pair of empty tracks.",
            "B. A high-speed train is arriving at the terminal.",
            "C. Commuters are rushing toward the ticket barriers.",
            "D. Construction barriers block the passenger concourse."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy tàu hỏa đang tiến vào ga (train arriving at terminal)",
        correct_reason: "Sân ga tàu hỏa chạy dài song song cạnh đường ray sắt đang trống, không có đoàn tàu nào.",
        explanation_vi: "(A) đúng: 'A railway platform borders a pair of empty tracks'. (B) sai vì đường ray trống, không có tàu đang vào ga. (C) sai vì sân ga vắng người, không ai chạy qua cửa soát vé. (D) sai vì không có rào chắn thi công.",
        key_vocab: [
            { word: "railway platform", ipa: "/ˈreɪl.weɪ ˌplæt.fɔːm/", meaning: "sân ga xe lửa" },
            { word: "track", ipa: "/træk/", meaning: "đường ray tàu hỏa" },
            { word: "commuter", ipa: "/kəˈmjuː.tər/", meaning: "người đi làm bằng phương tiện công cộng" }
        ],
        exam_tip: "Khi nhìn thấy đường ray trống, cảnh giác với đáp án có từ 'train arriving' hoặc 'boarding the train'.",
        audio_url: "/audio/listening/part1/p1_q03.mp3"
    },
    {
        id: "p1_q28",
        part: 1,
        topic: "Cảnh & bối cảnh",
        subtopic: "Văn phòng mở không người",
        difficulty: "B1",
        accent: "US",
        speakers: [{ name: "Guy (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_29_cubicles.webp",
        alt_text: "An open corporate office layout with modular cubicle partitions and workstations",
        audioScript: "Number 28. Look at the picture marked number 28 in your test book. (A) Cubicle partitions divide an open office space. (B) Employees are participating in a group video call. (C) Blinds have been pulled down over every window. (D) Office furniture is being loaded onto a delivery van.",
        transcript: "(A) Cubicle partitions divide an open office space. (B) Employees are participating in a group video call. (C) Blinds have been pulled down over every window. (D) Office furniture is being loaded onto a delivery van.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Cubicle partitions divide an open office space.",
            "B. Employees are participating in a group video call.",
            "C. Blinds have been pulled down over every window.",
            "D. Office furniture is being loaded onto a delivery van."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy họp video nhóm (participating in video call)",
        correct_reason: "Các vách ngăn ô làm việc phân chia không gian văn phòng thành các góc làm việc chuyên biệt.",
        explanation_vi: "(A) đúng: 'Cubicle partitions divide an open office space'. (B) sai vì văn phòng không có nhân viên. (C) sai vì rèm cửa sổ đang mở để lộ ánh sáng tự nhiên. (D) sai bẫy bị động 'is being loaded'.",
        key_vocab: [
            { word: "cubicle", ipa: "/ˈkjuː.bɪ.kəl/", meaning: "ô/vách ngăn góc làm việc văn phòng" },
            { word: "partition", ipa: "/pɑːˈtɪʃ.ən/", meaning: "vách ngăn phân chia" },
            { word: "blinds", ipa: "/blaɪndz/", meaning: "rèm sáo che cửa sổ" }
        ],
        exam_tip: "'Partition' (vách ngăn) và 'cubicle' (ô làm việc) là bộ đôi từ vựng quen thuộc mô tả bố cục văn phòng hiện đại.",
        audio_url: "/audio/listening/part1/p1_q04.mp3"
    },
    {
        id: "p1_q29",
        part: 1,
        topic: "Cảnh & bối cảnh",
        subtopic: "Cầu vượt xa lộ",
        difficulty: "A2",
        accent: "UK",
        speakers: [{ name: "Sonia (UK)", accent: "en-GB", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_30_overpass.webp",
        alt_text: "A concrete highway overpass spanning across multiple lanes of road traffic",
        audioScript: "Number 29. Look at the picture marked number 29 in your test book. (A) A concrete overpass spans across a multi-lane highway. (B) Vehicles are stopped at an intersection red light. (C) A bridge is undergoing major structural demolition. (D) Pedestrians are jogging across a suspension bridge.",
        transcript: "(A) A concrete overpass spans across a multi-lane highway. (B) Vehicles are stopped at an intersection red light. (C) A bridge is undergoing major structural demolition. (D) Pedestrians are jogging across a suspension bridge.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A concrete overpass spans across a multi-lane highway.",
            "B. Vehicles are stopped at an intersection red light.",
            "C. A bridge is undergoing major structural demolition.",
            "D. Pedestrians are jogging across a suspension bridge."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy đèn đỏ ngã tư (intersection red light)",
        correct_reason: "Cây cầu vượt bằng bê tông bắc ngang qua xa lộ cao tốc nhiều làn xe.",
        explanation_vi: "(A) đúng: 'A concrete overpass spans across a multi-lane highway'. (B) sai vì xa lộ xe cộ đang di chuyển, không có đèn đỏ ngã tư. (C) sai vì cầu hoàn thiện kiên cố, không bị phá dỡ. (D) sai vì không có người chạy bộ trên cầu.",
        key_vocab: [
            { word: "overpass", ipa: "/ˈəʊ.və.pɑːs/", meaning: "cầu vượt đường bộ" },
            { word: "span", ipa: "/spæn/", meaning: "bắc qua, trải rộng qua" },
            { word: "lane", ipa: "/leɪn/", meaning: "làn đường xe chạy" }
        ],
        exam_tip: "Động từ 'span' (bắc ngang qua) rất thường đi kèm với danh từ 'bridge', 'overpass' hoặc 'arch'.",
        audio_url: "/audio/listening/part1/p1_q05.mp3"
    },
    {
        id: "p1_q30",
        part: 1,
        topic: "Cảnh & bối cảnh",
        subtopic: "Lối đi siêu thị",
        difficulty: "A2",
        accent: "UK",
        speakers: [{ name: "Ryan (UK)", accent: "en-GB", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_31_supermarket.webp",
        alt_text: "A clean supermarket grocery aisle with shelves stocked with packaged food items",
        audioScript: "Number 30. Look at the picture marked number 30 in your test book. (A) Shelves are stocked with packaged goods in an aisle. (B) A shopper is pushing an overloaded shopping cart. (C) Produce is being weighed on an electronic scale. (D) A spilled liquid is being cleaned with a mop.",
        transcript: "(A) Shelves are stocked with packaged goods in an aisle. (B) A shopper is pushing an overloaded shopping cart. (C) Produce is being weighed on an electronic scale. (D) A spilled liquid is being cleaned with a mop.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Shelves are stocked with packaged goods in an aisle.",
            "B. A shopper is pushing an overloaded shopping cart.",
            "C. Produce is being weighed on an electronic scale.",
            "D. A spilled liquid is being cleaned with a mop."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "state",
        trap_type: "bẫy người đẩy xe đẩy hàng (pushing a shopping cart)",
        correct_reason: "Các dãy kệ kim loại trong lối đi siêu thị chứa đầy các mặt hàng đóng gói ngay ngắn.",
        explanation_vi: "(A) đúng: 'Shelves are stocked with packaged goods in an aisle'. (B) sai vì không có người mua sắm hay xe đẩy hàng trong lối đi. (C) sai bẫy bị động 'is being weighed'. (D) sai vì sàn nhà sạch bóng, không ai lau nhà.",
        key_vocab: [
            { word: "be stocked with", ipa: "/stɒkt wɪð/", meaning: "chứa đầy, chất đầy hàng" },
            { word: "packaged goods", ipa: "/ˈpæk.ɪdʒd ɡʊdz/", meaning: "hàng hóa đóng gói sẵn" },
            { word: "scale", ipa: "/skeɪl/", meaning: "cái cân điện tử" }
        ],
        exam_tip: "'Be stocked with' (được chất đầy hàng hóa) là cụm động từ miêu tả trạng thái siêu thị, cửa hàng tạp hóa thường xuyên ra thi.",
        audio_url: "/audio/listening/part1/p1_q06.mp3"
    },

    // =========================================================================
    // TOPIC 4: NGƯỜI & VẬT TƯƠNG TÁC (10 CÂU: p1_q31 -> p1_q40)
    // =========================================================================
    {
        id: "p1_q31",
        part: 1,
        topic: "Người & vật",
        subtopic: "Thu ngân & Khách hàng",
        difficulty: "B1",
        accent: "US",
        speakers: [{ name: "Jenny (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_04_interaction.webp",
        alt_text: "A friendly female cashier at a modern supermarket checkout counter handing a brown paper grocery shopping bag to an adult male customer",
        audioScript: "Number 31. Look at the picture marked number 31 in your test book. (A) A customer is pushing a grocery cart through the entrance. (B) Groceries are being loaded onto a delivery truck. (C) Shelves are being stocked with canned vegetables. (D) A cashier is handing a bag to a customer.",
        transcript: "(A) A customer is pushing a grocery cart through the entrance. (B) Groceries are being loaded onto a delivery truck. (C) Shelves are being stocked with canned vegetables. (D) A cashier is handing a bag to a customer.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A customer is pushing a grocery cart through the entrance.",
            "B. Groceries are being loaded onto a delivery truck.",
            "C. Shelves are being stocked with canned vegetables.",
            "D. A cashier is handing a bag to a customer."
        ],
        ans: 3,
        ansLetter: "D",
        question_type: "interaction",
        trap_type: "bẫy hành động nhập hàng / bốc hàng (loaded onto truck)",
        correct_reason: "Thu ngân đang cầm túi giấy đựng hàng đưa cho khách hàng qua quầy thanh toán.",
        explanation_vi: "Phân tích tương tác người & vật: Thu ngân và khách hàng đứng đối diện tại quầy thu ngân. (D) 'A cashier is handing a bag to a customer' (Thu ngân đang đưa túi đồ cho khách hàng) mô tả chính xác 100%. (A) sai vì khách đang đứng nhận túi, không đẩy xe. (B) và (C) sai bẫy bị động 'are being loaded/stocked'.",
        key_vocab: [
            { word: "cashier", ipa: "/kæˈʃɪər/", meaning: "nhân viên thu ngân" },
            { word: "hand", ipa: "/hænd/", meaning: "trao tay, đưa tận tay cho ai" },
            { word: "checkout counter", ipa: "/ˈtʃek.aʊt ˌkaʊn.tər/", meaning: "quầy thu ngân thanh toán" }
        ],
        exam_tip: "Hành động 'handing sth to sb' (đưa cái gì cho ai) rất hay xuất hiện trong tương tác giữa nhân viên và khách hàng.",
        audio_url: "/audio/listening/part1/p1_q04.mp3"
    },
    {
        id: "p1_q32",
        part: 1,
        topic: "Người & vật",
        subtopic: "Tiếp viên hàng không phục vụ",
        difficulty: "A2",
        accent: "US",
        speakers: [{ name: "Guy (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_32_flight_attendant.webp",
        alt_text: "A flight attendant serving a drinking cup to a passenger in an airplane cabin",
        audioScript: "Number 32. Look at the picture marked number 32 in your test book. (A) A cabin attendant is serving a beverage to a seated traveler. (B) A passenger is stowing luggage in an overhead bin. (C) Meals are being loaded onto a beverage cart. (D) The airplane window blinds are all drawn shut.",
        transcript: "(A) A cabin attendant is serving a beverage to a seated traveler. (B) A passenger is stowing luggage in an overhead bin. (C) Meals are being loaded onto a beverage cart. (D) The airplane window blinds are all drawn shut.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A cabin attendant is serving a beverage to a seated traveler.",
            "B. A passenger is stowing luggage in an overhead bin.",
            "C. Meals are being loaded onto a beverage cart.",
            "D. The airplane window blinds are all drawn shut."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "interaction",
        trap_type: "bẫy cất hành lý lên khoang trên (stowing luggage in bin)",
        correct_reason: "Tiếp viên hàng không đang cúi người trao cốc nước uống cho hành khách ngồi trên ghế.",
        explanation_vi: "(A) đúng: 'serving a beverage to a seated traveler'. (B) sai vì không ai cất hành lý lên khoang trên. (C) sai bẫy bị động 'are being loaded'. (D) sai vì cửa sổ máy bay đang mở đón ánh sáng.",
        key_vocab: [
            { word: "attendant", ipa: "/əˈten.dənt/", meaning: "tiếp viên, người phục vụ" },
            { word: "stow", ipa: "/stəʊ/", meaning: "cất gọn gàng (hành lý)" },
            { word: "overhead bin", ipa: "/ˌəʊ.və.hed ˈbɪn/", meaning: "khoang chứa đồ phía trên đầu" }
        ],
        exam_tip: "'Stow' là từ vựng TOEIC đặc thù chỉ hành động xếp hành lý vào khoang phía trên ('stowing carry-on bags in the overhead compartment').",
        audio_url: "/audio/listening/part1/p1_q01.mp3"
    },
    {
        id: "p1_q33",
        part: 1,
        topic: "Người & vật",
        subtopic: "Bắt tay hợp tác",
        difficulty: "A2",
        accent: "UK",
        speakers: [{ name: "Sonia (UK)", accent: "en-GB", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_33_handshake.webp",
        alt_text: "Two business associates shaking hands across a meeting conference table",
        audioScript: "Number 33. Look at the picture marked number 33 in your test book. (A) Two professionals are shaking hands over a meeting table. (B) They are exchanging printed business cards. (C) One person is signing a legal contract with a pen. (D) Laptops are being packed into leather briefcases.",
        transcript: "(A) Two professionals are shaking hands over a meeting table. (B) They are exchanging printed business cards. (C) One person is signing a legal contract with a pen. (D) Laptops are being packed into leather briefcases.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Two professionals are shaking hands over a meeting table.",
            "B. They are exchanging printed business cards.",
            "C. One person is signing a legal contract with a pen.",
            "D. Laptops are being packed into leather briefcases."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "interaction",
        trap_type: "bẫy ký hợp đồng (signing a contract)",
        correct_reason: "Hai đối tác kinh doanh đang bắt tay nhau qua mặt bàn hội nghị.",
        explanation_vi: "(A) đúng: 'shaking hands over a meeting table'. (B) sai vì họ bắt tay chứ không trao danh thiếp. (C) sai vì không ai cầm bút ký giấy tờ. (D) sai bẫy bị động 'are being packed'.",
        key_vocab: [
            { word: "shake hands", ipa: "/ʃeɪk hændz/", meaning: "bắt tay chào hỏi/hợp tác" },
            { word: "business card", ipa: "/ˈbɪz.nɪs kɑːd/", meaning: "danh thiếp" },
            { word: "briefcase", ipa: "/ˈbriːf.keɪs/", meaning: "cặp tài liệu công sở" }
        ],
        exam_tip: "'Shaking hands' là một trong những hành động tương tác phổ biến nhất trong tranh đàm phán, phỏng vấn.",
        audio_url: "/audio/listening/part1/p1_q02.mp3"
    },
    {
        id: "p1_q34",
        part: 1,
        topic: "Người & vật",
        subtopic: "Nạp giấy máy in",
        difficulty: "B1",
        accent: "UK",
        speakers: [{ name: "Ryan (UK)", accent: "en-GB", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_34_loading_paper.webp",
        alt_text: "An office worker inserting a stack of paper into the open side paper tray of a photocopier",
        audioScript: "Number 34. Look at the picture marked number 34 in your test book. (A) An employee is loading paper into a copying machine. (B) He is collating bound reports for a meeting. (C) A technician is disassembling the printer motor. (D) Paper shreds are overflowing from a wastebasket.",
        transcript: "(A) An employee is loading paper into a copying machine. (B) He is collating bound reports for a meeting. (C) A technician is disassembling the printer motor. (D) Paper shreds are overflowing from a wastebasket.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. An employee is loading paper into a copying machine.",
            "B. He is collating bound reports for a meeting.",
            "C. A technician is disassembling the printer motor.",
            "D. Paper shreds are overflowing from a wastebasket."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "interaction",
        trap_type: "bẫy tháo lắp động cơ máy in (disassembling the motor)",
        correct_reason: "Nhân viên cầm xấp giấy trắng đặt vào khay nạp giấy mở bên hông máy photocopy.",
        explanation_vi: "(A) đúng: 'loading paper into a copying machine'. (B) sai vì không có việc sắp xếp báo cáo đóng gáy. (C) sai vì không có kỹ thuật viên tháo dỡ máy. (D) sai vì thùng rác không có giấy vụn tràn ra.",
        key_vocab: [
            { word: "load", ipa: "/ləʊd/", meaning: "nạp vào, tải vào (giấy, hành lý)" },
            { word: "collate", ipa: "/kəˈleɪt/", meaning: "đối chiếu, sắp xếp trang in theo thứ tự" },
            { word: "wastebasket", ipa: "/ˈweɪstˌbɑː.skɪt/", meaning: "thùng rác văn phòng" }
        ],
        exam_tip: "'Loading' (nạp vào/chất lên) trái nghĩa với 'unloading' (dỡ ra/lấy ra). Hãy nghe kỹ tiền tố 'un-'.",
        audio_url: "/audio/listening/part1/p1_q03.mp3"
    },
    {
        id: "p1_q35",
        part: 1,
        topic: "Người & vật",
        subtopic: "Làm thủ tục nhận phòng",
        difficulty: "A2",
        accent: "AU",
        speakers: [{ name: "Natasha (AU)", accent: "en-AU", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_35_checkin.webp",
        alt_text: "A hotel guest handing a credit card to the front-desk clerk at check-in",
        audioScript: "Number 35. Look at the picture marked number 35 in your test book. (A) A guest is handing a card to a front-desk agent. (B) The clerk is checking baggage on a luggage scale. (C) A guest is relaxing on a lobby armchair. (D) Room keys are being programmed in a back office.",
        transcript: "(A) A guest is handing a card to a front-desk agent. (B) The clerk is checking baggage on a luggage scale. (C) A guest is relaxing on a lobby armchair. (D) Room keys are being programmed in a back office.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A guest is handing a card to a front-desk agent.",
            "B. The clerk is checking baggage on a luggage scale.",
            "C. A guest is relaxing on a lobby armchair.",
            "D. Room keys are being programmed in a back office."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "interaction",
        trap_type: "bẫy cân hành lý (weighing baggage on scale)",
        correct_reason: "Vị khách đưa chiếc thẻ cho nhân viên lễ tân khách sạn qua mặt bàn quầy.",
        explanation_vi: "(A) đúng: 'handing a card to a front-desk agent'. (B) sai vì khách sạn không có cân hành lý sân bay. (C) sai vì khách đang đứng làm thủ tục, không ngồi ghế bành. (D) sai bẫy bị động 'are being programmed'.",
        key_vocab: [
            { word: "guest", ipa: "/ɡest/", meaning: "khách thuê phòng, khách mời" },
            { word: "front-desk agent", ipa: "/ˌfrʌnt ˈdesk ˈeɪ.dʒənt/", meaning: "nhân viên quầy lễ tân" },
            { word: "baggage scale", ipa: "/ˈbæɡ.ɪdʒ skeɪl/", meaning: "cân hành lý" }
        ],
        exam_tip: "'Front desk', 'reception desk', 'service counter' đều chỉ quầy lễ tân phục vụ khách hàng.",
        audio_url: "/audio/listening/part1/p1_q04.mp3"
    },
    {
        id: "p1_q36",
        part: 1,
        topic: "Người & vật",
        subtopic: "Giao nhận bưu kiện",
        difficulty: "A2",
        accent: "AU",
        speakers: [{ name: "William (AU)", accent: "en-AU", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_36_courier.webp",
        alt_text: "A delivery courier in uniform handing a cardboard package and clipboard to a receptionist",
        audioScript: "Number 36. Look at the picture marked number 36 in your test book. (A) A courier is delivering a package to an office worker. (B) He is loading freight onto the back of a delivery truck. (C) A box is being opened with a utility knife. (D) The reception area is closed to visitors.",
        transcript: "(A) A courier is delivering a package to an office worker. (B) He is loading freight onto the back of a delivery truck. (C) A box is being opened with a utility knife. (D) The reception area is closed to visitors.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A courier is delivering a package to an office worker.",
            "B. He is loading freight onto the back of a delivery truck.",
            "C. A box is being opened with a utility knife.",
            "D. The reception area is closed to visitors."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "interaction",
        trap_type: "bẫy rạch hộp bằng dao (opening with a utility knife)",
        correct_reason: "Người giao hàng mặc đồng phục đang trao gói bưu phẩm cho nữ nhân viên văn phòng.",
        explanation_vi: "(A) đúng: 'delivering a package to an office worker'. (B) sai vì người này đang giao hàng trong văn phòng, không chất hàng lên xe tải. (C) sai vì hộp bưu kiện còn nguyên vẹn. (D) sai vì quầy lễ tân đang mở cửa tiếp khách.",
        key_vocab: [
            { word: "courier", ipa: "/ˈkʊr.i.ər/", meaning: "người chuyển phát nhanh, người giao hàng" },
            { word: "freight", ipa: "/freɪt/", meaning: "hàng hóa chuyên chở" },
            { word: "clipboard", ipa: "/ˈklɪp.bɔːd/", meaning: "bảng kẹp tài liệu" }
        ],
        exam_tip: "'Courier' (/ˈkʊr.i.ər/) hoặc 'delivery driver' là từ vựng quen thuộc mô tả nhân vật giao nhận bưu phẩm.",
        audio_url: "/audio/listening/part1/p1_q05.mp3"
    },
    {
        id: "p1_q37",
        part: 1,
        topic: "Người & vật",
        subtopic: "Thử kính mắt tại cửa hàng",
        difficulty: "B1",
        accent: "CA",
        speakers: [{ name: "Clara (CA)", accent: "en-CA", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_37_optician.webp",
        alt_text: "A customer trying on a pair of eyeglasses in front of a mirror with an optician standing nearby",
        audioScript: "Number 37. Look at the picture marked number 37 in your test book. (A) A customer is trying on eyewear in front of a mirror. (B) An optometrist is performing an eye exam with a machine. (C) Glasses frames are being polished with a special spray. (D) The shop windows are covered with promotional posters.",
        transcript: "(A) A customer is trying on eyewear in front of a mirror. (B) An optometrist is performing an eye exam with a machine. (C) Glasses frames are being polished with a special spray. (D) The shop windows are covered with promotional posters.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A customer is trying on eyewear in front of a mirror.",
            "B. An optometrist is performing an eye exam with a machine.",
            "C. Glasses frames are being polished with a special spray.",
            "D. The shop windows are covered with promotional posters."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "interaction",
        trap_type: "bẫy đo thị lực bằng máy (performing an eye exam)",
        correct_reason: "Khách hàng đeo thử gọng kính và nhìn vào gương nhỏ để ngắm.",
        explanation_vi: "(A) đúng: 'trying on eyewear in front of a mirror'. (B) sai vì không có máy đo khúc xạ mắt nào đang vận hành. (C) sai bẫy bị động 'are being polished'. (D) sai vì cửa kính cửa hàng quang đãng, không dán kín poster.",
        key_vocab: [
            { word: "try on", ipa: "/traɪ ɒn/", meaning: "thử (quần áo, kính, giày dép)" },
            { word: "eyewear", ipa: "/ˈaɪ.weər/", meaning: "kính mắt thời trang/cận thị" },
            { word: "optician", ipa: "/ɒpˈtɪʃ.ən/", meaning: "chuyên viên nhãn khoa, người bán kính" }
        ],
        exam_tip: "'Eyewear' là từ vựng chỉ chung cho kính mắt (glasses/spectacles/sunglasses).",
        audio_url: "/audio/listening/part1/p1_q06.mp3"
    },
    {
        id: "p1_q38",
        part: 1,
        topic: "Người & vật",
        subtopic: "Nghiên cứu trong phòng thí nghiệm",
        difficulty: "B2",
        accent: "CA",
        speakers: [{ name: "Liam (CA)", accent: "en-CA", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_38_lab.webp",
        alt_text: "Two researchers wearing protective lab coats examining a liquid flask together in a laboratory",
        audioScript: "Number 38. Look at the picture marked number 38 in your test book. (A) Researchers are inspecting a liquid container in a lab. (B) They are cleaning glass beakers in a sterilization unit. (C) Microscopes have been packed into wooden crates. (D) A scientist is typing notes into a desktop computer.",
        transcript: "(A) Researchers are inspecting a liquid container in a lab. (B) They are cleaning glass beakers in a sterilization unit. (C) Microscopes have been packed into wooden crates. (D) A scientist is typing notes into a desktop computer.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. Researchers are inspecting a liquid container in a lab.",
            "B. They are cleaning glass beakers in a sterilization unit.",
            "C. Microscopes have been packed into wooden crates.",
            "D. A scientist is typing notes into a desktop computer."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "interaction",
        trap_type: "bẫy gõ ghi chú vào máy tính (typing notes on computer)",
        correct_reason: "Hai nhà nghiên cứu mặc áo blouse trắng cùng quan sát bình chứa dung dịch thủy tinh.",
        explanation_vi: "(A) đúng: 'inspecting a liquid container in a lab'. (B) sai vì không ai rửa dụng cụ thí nghiệm. (C) sai vì kính hiển vi để sẵn trên bàn, không đóng thùng gỗ. (D) sai vì không ai ngồi gõ máy tính.",
        key_vocab: [
            { word: "flask", ipa: "/flɑːsk/", meaning: "bình tam giác thủy tinh thí nghiệm" },
            { word: "beaker", ipa: "/ˈbiː.kər/", meaning: "cốc đong thủy tinh có mỏ" },
            { word: "sterilization", ipa: "/ˌster.ə.laɪˈzeɪ.ʃən/", meaning: "khử trùng, tiệt trùng" }
        ],
        exam_tip: "Tranh phòng thí nghiệm ETS thường xoay quanh các động từ 'inspecting', 'adjusting equipment' hoặc 'examining a sample'.",
        audio_url: "/audio/listening/part1/p1_q01.mp3"
    },
    {
        id: "p1_q39",
        part: 1,
        topic: "Người & vật",
        subtopic: "Tư vấn mua đồng hồ",
        difficulty: "B1",
        accent: "US",
        speakers: [{ name: "Jenny (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_39_watch_display.webp",
        alt_text: "A jewelry sales associate holding a velvet display tray showing a luxury wristwatch to a shopper",
        audioScript: "Number 39. Look at the picture marked number 39 in your test book. (A) A salesperson is presenting an item on a display tray. (B) A customer is repairing a broken watch strap with tools. (C) The jewelry display case has been shattered. (D) The store cash register is being emptied by an owner.",
        transcript: "(A) A salesperson is presenting an item on a display tray. (B) A customer is repairing a broken watch strap with tools. (C) The jewelry display case has been shattered. (D) The store cash register is being emptied by an owner.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. A salesperson is presenting an item on a display tray.",
            "B. A customer is repairing a broken watch strap with tools.",
            "C. The jewelry display case has been shattered.",
            "D. The store cash register is being emptied by an owner."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "interaction",
        trap_type: "bẫy sửa quai đồng hồ (repairing watch strap)",
        correct_reason: "Nhân viên bán hàng hai tay cầm khay nhung giới thiệu chiếc đồng hồ đeo tay cho khách.",
        explanation_vi: "(A) đúng: 'presenting an item on a display tray'. (B) sai vì khách đang xem hàng, không dùng dụng cụ sửa đồng hồ. (C) sai vì tủ kính trưng bày nguyên vẹn. (D) sai bẫy bị động 'is being emptied'.",
        key_vocab: [
            { word: "salesperson", ipa: "/ˈseɪlzˌpɜː.sən/", meaning: "nhân viên bán hàng" },
            { word: "display tray", ipa: "/dɪˈspleɪ treɪ/", meaning: "khay nhung trưng bày trang sức" },
            { word: "strap", ipa: "/stræp/", meaning: "quai đeo (đồng hồ, túi xách)" }
        ],
        exam_tip: "'Presenting' trong ngữ cảnh bán hàng có nghĩa là giới thiệu/đưa ra cho khách xem ('presenting merchandise to a buyer').",
        audio_url: "/audio/listening/part1/p1_q02.mp3"
    },
    {
        id: "p1_q40",
        part: 1,
        topic: "Người & vật",
        subtopic: "Bàn giao chìa khóa thuê xe",
        difficulty: "A2",
        accent: "US",
        speakers: [{ name: "Guy (US)", accent: "en-US", role: "Narrator" }],
        image: "assets/listening/part1/p1_sample_40_car_rental.webp",
        alt_text: "A car rental agent handing automobile keys over the service counter to a customer",
        audioScript: "Number 40. Look at the picture marked number 40 in your test book. (A) An agent is handing keys to a customer over a service desk. (B) A driver is inspecting the exterior of a rental sedan. (C) Luggage is being transferred into a vehicle trunk. (D) The rental counter is unattended by staff.",
        transcript: "(A) An agent is handing keys to a customer over a service desk. (B) A driver is inspecting the exterior of a rental sedan. (C) Luggage is being transferred into a vehicle trunk. (D) The rental counter is unattended by staff.",
        q: "Look at the picture and choose the statement that best describes what you see:",
        options: [
            "A. An agent is handing keys to a customer over a service desk.",
            "B. A driver is inspecting the exterior of a rental sedan.",
            "C. Luggage is being transferred into a vehicle trunk.",
            "D. The rental counter is unattended by staff."
        ],
        ans: 0,
        ansLetter: "A",
        question_type: "interaction",
        trap_type: "bẫy kiểm tra thân xe bên ngoài (inspecting the exterior)",
        correct_reason: "Nhân viên dịch vụ đang đưa chùm chìa khóa qua quầy cho khách hàng.",
        explanation_vi: "(A) đúng: 'handing keys to a customer over a service desk'. (B) sai vì họ đang ở trong văn phòng làm thủ tục nhận chìa, chưa ra bãi xe kiểm tra. (C) sai bẫy bị động 'is being transferred'. (D) sai vì quầy có nhân viên phục vụ tận tình.",
        key_vocab: [
            { word: "hand over", ipa: "/hænd ˈəʊ.vər/", meaning: "trao tay, bàn giao" },
            { word: "service desk", ipa: "/ˈsɜː.vɪs desk/", meaning: "bàn quầy làm thủ tục dịch vụ" },
            { word: "unattended", ipa: "/ˌʌn.əˈten.dɪd/", meaning: "không có người trông coi/phục vụ" }
        ],
        exam_tip: "'Unattended' (không có người trông coi) là tính từ bẫy cực kỳ phổ biến trong đề thi cho cả tranh tả người và tranh tả vật.",
        audio_url: "/audio/listening/part1/p1_q03.mp3"
    }
];

function updateDatabase() {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    db.part1 = questions;
    db.metadata.total_questions = questions.length + db.part2.length + (db.part3.length * 3) + (db.part4.length * 3);
    db.metadata.part1_count = questions.length;
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
    console.log(`✅ Updated listening_database_v2.json: Part 1 now has exactly ${questions.length} questions! Total DB: ${db.metadata.total_questions} questions.`);
}

updateDatabase();
