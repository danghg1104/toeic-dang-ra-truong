const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const JSON_PATH = path.join(__dirname, '..', 'data', 'listening_database_v2.json');
const db = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

// 4 New Verified Questions matching the 4 generated 1280x853 WebP photos
const newPart1Samples = [
  {
    "id": "p1_q01",
    "part": 1,
    "topic": "Tranh tả người",
    "subtopic": "Hành động & Tư thế nhân vật",
    "difficulty": "A2",
    "accent": "US",
    "speakers": [
      {
        "name": "Jenny (US)",
        "accent": "en-US",
        "role": "Narrator"
      }
    ],
    "image": "assets/listening/part1/p1_sample_01_person.webp",
    "alt_text": "A professional female architect examining an architectural blueprint floor plan on a drafting table",
    "audioScript": "Number 1. Look at the picture marked number 1 in your test book. (A) She is hanging a picture frame on the wall. (B) A woman is examining a blueprint on a table. (C) She is rolling up a sheet of paper. (D) She is speaking into a telephone receiver.",
    "transcript": "(A) She is hanging a picture frame on the wall. (B) A woman is examining a blueprint on a table. (C) She is rolling up a sheet of paper. (D) She is speaking into a telephone receiver.",
    "q": "Look at the picture and choose the statement that best describes what you see:",
    "options": [
      "A. She is hanging a picture frame on the wall.",
      "B. A woman is examining a blueprint on a table.",
      "C. She is rolling up a sheet of paper.",
      "D. She is speaking into a telephone receiver."
    ],
    "ans": 1,
    "ansLetter": "B",
    "question_type": "action",
    "trap_type": "bẫy hành động sai và trạng thái tiếp diễn",
    "correct_reason": "Người phụ nữ đang đứng cúi người đặt hai tay lên mặt bàn và chăm chú nhìn bản vẽ kiến trúc trải phẳng.",
    "explanation_vi": "Phân tích tranh: Người phụ nữ đứng bên bàn làm việc và nhìn chăm chú vào bản vẽ kiến trúc trải phẳng. (B) 'A woman is examining a blueprint on a table' mô tả chính xác nhất. (A) sai vì không treo tranh. (C) sai vì bản vẽ đang mở phẳng, không cuộn. (D) sai vì không dùng điện thoại.",
    "key_vocab": [
      {
        "word": "examine",
        "ipa": "/ɪɡˈzæm.ɪn/",
        "meaning": "quan sát kỹ, kiểm tra"
      },
      {
        "word": "blueprint",
        "ipa": "/ˈbluː.prɪnt/",
        "meaning": "bản vẽ thiết kế kiến trúc"
      },
      {
        "word": "drafting table",
        "ipa": "/ˈdrɑːf.tɪŋ ˌteɪ.bəl/",
        "meaning": "bàn vẽ kỹ thuật"
      }
    ],
    "exam_tip": "Với tranh tả người, hãy chú ý mắt nhìn vào đâu và tay đang làm hành động gì. Động từ 'examine' (quan sát/nghiên cứu) rất thường xuyên là đáp án đúng trong ETS.",
    "audio_url": "/audio/listening/part1/p1_q01.mp3"
  },
  {
    "id": "p1_q02",
    "part": 1,
    "topic": "Tranh tả vật",
    "subtopic": "Sắp xếp đồ đạc trong phòng hội nghị",
    "difficulty": "A2",
    "accent": "UK",
    "speakers": [
      {
        "name": "Ryan (UK)",
        "accent": "en-GB",
        "role": "Narrator"
      }
    ],
    "image": "assets/listening/part1/p1_sample_02_object.webp",
    "alt_text": "An empty executive conference room with black chairs arranged around a long wooden table",
    "audioScript": "Number 2. Look at the picture marked number 2 in your test book. (A) Some attendees are taking seats for a lecture. (B) The presentation screen has been turned on. (C) Chairs are arranged around a long table. (D) The conference table is being wiped down.",
    "transcript": "(A) Some attendees are taking seats for a lecture. (B) The presentation screen has been turned on. (C) Chairs are arranged around a long table. (D) The conference table is being wiped down.",
    "q": "Look at the picture and choose the statement that best describes what you see:",
    "options": [
      "A. Some attendees are taking seats for a lecture.",
      "B. The presentation screen has been turned on.",
      "C. Chairs are arranged around a long table.",
      "D. The conference table is being wiped down."
    ],
    "ans": 2,
    "ansLetter": "C",
    "question_type": "object_state",
    "trap_type": "bẫy người trong tranh tĩnh và bẫy bị động tiếp diễn 'is being + V3'",
    "correct_reason": "Các ghế văn phòng màu đen được xếp ngay ngắn bao quanh chiếc bàn hội nghị dài bằng gỗ.",
    "explanation_vi": "Phân tích tranh tĩnh không người: (C) 'Chairs are arranged around a long table' mô tả chính xác trạng thái sắp đặt của bàn ghế. (A) sai vì không có người. (B) sai vì màn hình máy chiếu màu trắng đang tắt. (D) dùng 'is being wiped down' chỉ hành động đang lau dọn có người thực hiện -> SAI với tranh tĩnh.",
    "key_vocab": [
      {
        "word": "arrange",
        "ipa": "/əˈreɪndʒ/",
        "meaning": "sắp xếp, bố trí"
      },
      {
        "word": "conference table",
        "ipa": "/ˈkɒn.fər.əns ˌteɪ.bəl/",
        "meaning": "bàn họp hội nghị"
      },
      {
        "word": "presentation screen",
        "ipa": "/ˌprez.ənˈteɪ.ʃən skriːn/",
        "meaning": "màn hình trình chiếu"
      }
    ],
    "exam_tip": "Quy tắc vàng TOEIC Part 1: Khi tranh tĩnh hoàn toàn KHÔNG CÓ NGƯỜI, phương án chứa 'is/are being + V3' (bị động tiếp diễn) gần như 99% là đáp án SAI vì không có ai đang thực hiện hành động.",
    "audio_url": "/audio/listening/part1/p1_q02.mp3"
  },
  {
    "id": "p1_q03",
    "part": 1,
    "topic": "Cảnh & bối cảnh",
    "subtopic": "Lối đi ven sông công viên đô thị",
    "difficulty": "B1",
    "accent": "AU",
    "speakers": [
      {
        "name": "Natasha (AU)",
        "accent": "en-AU",
        "role": "Narrator"
      }
    ],
    "image": "assets/listening/part1/p1_sample_03_scene.webp",
    "alt_text": "Paved pedestrian walkway with benches along a river promenade with trees and distant bridges",
    "audioScript": "Number 3. Look at the picture marked number 3 in your test book. (A) Benches have been placed along a walkway. (B) Boats are passing beneath a bridge. (C) Leaves are being swept into a pile. (D) Pedestrians are jogging in a group along the path.",
    "transcript": "(A) Benches have been placed along a walkway. (B) Boats are passing beneath a bridge. (C) Leaves are being swept into a pile. (D) Pedestrians are jogging in a group along the path.",
    "q": "Look at the picture and choose the statement that best describes what you see:",
    "options": [
      "A. Benches have been placed along a walkway.",
      "B. Boats are passing beneath a bridge.",
      "C. Leaves are being swept into a pile.",
      "D. Pedestrians are jogging in a group along the path."
    ],
    "ans": 0,
    "ansLetter": "A",
    "question_type": "scenery_state",
    "trap_type": "bẫy đối tượng không xuất hiện và bẫy thì bị động tiếp diễn",
    "correct_reason": "Hàng ghế băng gỗ được đặt cách đều nhau dọc theo lối đi dạo lát đá ven bờ sông.",
    "explanation_vi": "Phân tích tranh phong cảnh: (A) 'Benches have been placed along a walkway' (Những chiếc ghế băng đã được đặt dọc theo lối đi) sử dụng thì hiện tại hoàn thành bị động chỉ trạng thái tĩnh sẵn có -> ĐÚNG. (B) sai vì trên sông không có thuyền. (C) sai vì không có ai đang quét lá. (D) sai vì không có người chạy bộ.",
    "key_vocab": [
      {
        "word": "walkway",
        "ipa": "/ˈwɔːk.weɪ/",
        "meaning": "lối đi bộ, đường tản bộ"
      },
      {
        "word": "promenade",
        "ipa": "/ˌprɒm.əˈnɑːd/",
        "meaning": "đường dạo ven sông / bờ biển"
      },
      {
        "word": "railing",
        "ipa": "/ˈreɪ.lɪŋ/",
        "meaning": "hàng rào chắn, lan can bảo vệ"
      }
    ],
    "exam_tip": "Chú ý sự đối lập giữa thì hoàn thành 'have been placed' (chỉ kết quả/trạng thái tĩnh đã đặt sẵn) và tiếp diễn 'are being placed' (chỉ hành động đang bê đặt ghế). Trong TOEIC, 'have been V3' thường là đáp án đúng cho tranh cảnh vật.",
    "audio_url": "/audio/listening/part1/p1_q03.mp3"
  },
  {
    "id": "p1_q04",
    "part": 1,
    "topic": "Người & vật tương tác",
    "subtopic": "Thanh toán và giao nhận hàng tại quầy siêu thị",
    "difficulty": "A2",
    "accent": "CA",
    "speakers": [
      {
        "name": "Liam (CA)",
        "accent": "en-CA",
        "role": "Narrator"
      }
    ],
    "image": "assets/listening/part1/p1_sample_04_interaction.webp",
    "alt_text": "A male cashier handing a brown paper bag across the grocery counter to a female customer",
    "audioScript": "Number 4. Look at the picture marked number 4 in your test book. (A) Groceries are being loaded into a vehicle. (B) A customer is entering a PIN code on a keypad. (C) Shelves are being restocked with canned goods. (D) A cashier is handing a bag to a customer.",
    "transcript": "(A) Groceries are being loaded into a vehicle. (B) A customer is entering a PIN code on a keypad. (C) Shelves are being restocked with canned goods. (D) A cashier is handing a bag to a customer.",
    "q": "Look at the picture and choose the statement that best describes what you see:",
    "options": [
      "A. Groceries are being loaded into a vehicle.",
      "B. A customer is entering a PIN code on a keypad.",
      "C. Shelves are being restocked with canned goods.",
      "D. A cashier is handing a bag to a customer."
    ],
    "ans": 3,
    "ansLetter": "D",
    "question_type": "interaction",
    "trap_type": "bẫy hành động sai ngữ cảnh và đối tượng sai",
    "correct_reason": "Nhân viên thu ngân đang cầm quai túi giấy đưa qua quầy và khách hàng đang giơ tay đón nhận.",
    "explanation_vi": "Phân tích tranh tương tác hai người: (D) 'A cashier is handing a bag to a customer' (Thu ngân đang trao túi hàng cho khách) miêu tả chuẩn xác tương tác trọng tâm. (A) sai vì đây là quầy thu ngân trong siêu thị, không phải xe hơi. (B) sai vì khách hàng đang đón túi giấy, không phải bấm mã PIN. (C) sai vì không có ai đang xếp hàng hộp lên kệ.",
    "key_vocab": [
      {
        "word": "hand",
        "ipa": "/hænd/",
        "meaning": "trao tay, đưa cho (v)"
      },
      {
        "word": "cashier",
        "ipa": "/kæʃˈɪər/",
        "meaning": "nhân viên thu ngân"
      },
      {
        "word": "checkout counter",
        "ipa": "/ˈtʃek.aʊt ˌkaʊn.tər/",
        "meaning": "quầy thanh toán"
      }
    ],
    "exam_tip": "Khi tranh có 2 nhân vật tương tác với một đồ vật, hãy chú ý hướng chuyển động của đồ vật đó (trao đi - nhận lại, đưa - lấy). Động từ 'handing / passing / reaching for' xuất hiện rất nhiều trong đề ETS.",
    "audio_url": "/audio/listening/part1/p1_q04.mp3"
  }
];

// Replace the first 4 items of part1, keeping q05 and q06
db.part1[0] = newPart1Samples[0];
db.part1[1] = newPart1Samples[1];
db.part1[2] = newPart1Samples[2];
db.part1[3] = newPart1Samples[3];

fs.writeFileSync(JSON_PATH, JSON.stringify(db, null, 2), 'utf8');
console.log('Updated data/listening_database_v2.json successfully.');

// Re-export js/listening-data-v2.js
require('./export_listening_data_js.js');
console.log('Re-exported js/listening-data-v2.js successfully.');
