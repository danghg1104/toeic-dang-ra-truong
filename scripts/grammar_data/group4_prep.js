module.exports = [
  {
    "slug": "prepositions-time-place",
    "categorySlug": "prepositions-and-conjunctions",
    "categoryTitle": "4. Giới từ & Liên từ (Prepositions & Conjunctions)",
    "title": "Giới từ chỉ thời gian & nơi chốn (in, on, at, by)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "0-500",
    "totalQuestions": 50,
    "description": "Quy tắc tam giác giới từ IN - ON - AT cho thời gian và địa điểm, phân biệt By vs Until, In vs Within.",
    "goldenRule": {
      "title": "Công thức Tam giác Giới từ In - On - At:",
      "formulas": [
        "At + giờ cụ thể / địa chỉ chính xác",
        "On + thứ / ngày / tên đường / tầng nhà",
        "In + tháng / năm / mùa / thành phố / quốc gia"
      ],
      "note": "Đi từ quy mô lớn (In) ➔ quy mô vừa (On) ➔ điểm cụ thể chính xác (At)."
    },
    "quickTips": [
      "By Friday = hạn chót trước hoặc chậm nhất là thứ Sáu (chấm dứt hành động)",
      "Until Friday = hành động hoặc trạng thái duy trì liên tục kéo dài tới thứ Sáu",
      "Within 3 business days = trong vòng 3 ngày làm việc (không vượt quá 3 ngày)"
    ],
    "mascotTip": "Thần chú: Hạn chót nộp báo cáo ➔ dùng \"by\"; ở lại văn phòng tới 6h tối ➔ dùng \"until\"!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Đối tượng",
          "action": "Thời gian hay Nơi chốn?"
        },
        {
          "step": 2,
          "label": "Mức độ chi tiết",
          "action": "Rộng (In), Vừa (On), Cụ thể (At)"
        },
        {
          "step": 3,
          "label": "Tính chất kéo dài",
          "action": "Hạn chót (By) hay Duy trì liên tục (Until)"
        }
      ],
      "explanation": "Hình dung phễu lọc từ vĩ mô đến vi mô."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "submit by 5:00 PM"
      },
      {
        "id": "2",
        "formula": "remain until next week"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Giới từ BY (Hạn chót)",
        "items": [
          "Hành động hoàn thành một lần trước thời điểm đó",
          "Đi với động từ dứt điểm: submit, finish, arrive, deliver"
        ],
        "note": "Ví dụ: submit the proposal by Friday"
      },
      "rightBox": {
        "title": "Giới từ UNTIL (Kéo dài)",
        "items": [
          "Hành động hoặc trạng thái diễn ra liên tục đến mốc thời gian",
          "Đi với động từ kéo dài: wait, stay, remain, delay"
        ],
        "note": "Ví dụ: wait until Monday"
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy By vs Until",
        "explanation": "Thí sinh hay chọn \"until\" khi thấy câu có nộp bài hoặc giao hàng. Động từ dứt điểm bắt buộc dùng \"by\".",
        "wrongExample": "All expense claims must be submitted until 5:00 PM today.",
        "rightExample": "All expense claims must be submitted by 5:00 PM today."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "All department managers must submit their annual budgetary projections by 5:00 PM this Friday.",
        "sentenceVi": "Tất cả trưởng phòng phải nộp bảng dự toán ngân sách hàng năm chậm nhất là 5:00 chiều thứ Sáu này.",
        "highlightRule": "Giới từ chỉ hạn chót: submit + by + mốc thời gian"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "Completed employment application forms must be received by the human resources department _______ next Tuesday.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "by",
            "inlineExplanation": "Chính xác. \"by\" chỉ hạn chót (chậm nhất vào thứ Ba tới) đi với hành động hoàn tất \"received\"."
          },
          {
            "key": "B",
            "text": "until",
            "inlineExplanation": "Sai. \"until\" chỉ hành động kéo dài liên tục, không dùng với \"received\"."
          },
          {
            "key": "C",
            "text": "in",
            "inlineExplanation": "Sai. \"in\" không đi với ngày cụ thể như \"next Tuesday\"."
          },
          {
            "key": "D",
            "text": "at",
            "inlineExplanation": "Sai. \"at\" chỉ giờ hoặc địa điểm nhỏ."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Giới từ đứng trước mốc thời gian hạn chót \"next Tuesday\".",
          "step2_ruleApplication": {
            "text": "Động từ \"received\" (được nhận về) là hành động dứt điểm ➔ Dùng \"by\" để chỉ thời hạn chót.",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "by next Tuesday = chậm nhất vào thứ Ba tới.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"by\"."
        },
        "recapNote": "Giới từ thời gian: by + mốc thời gian (chỉ hạn chót hoàn thành)."
      },
      {
        "id": 2,
        "questionText": "The main library branch will remain closed for asbestos removal _______ the end of next month.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "until",
            "inlineExplanation": "Chính xác. Động từ \"remain closed\" (duy trì trạng thái đóng cửa) diễn ra liên tục ➔ Dùng \"until\"."
          },
          {
            "key": "B",
            "text": "by",
            "inlineExplanation": "Sai. \"by\" dùng cho hành động hoàn thành một lần."
          },
          {
            "key": "C",
            "text": "on",
            "inlineExplanation": "Sai."
          },
          {
            "key": "D",
            "text": "from",
            "inlineExplanation": "Sai nếu thiếu \"to\"."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Đứng trước mốc thời gian \"the end of next month\".",
          "step2_ruleApplication": {
            "text": "Động từ \"remain closed\" diễn tả trạng thái liên tục kéo dài ➔ Dùng \"until\".",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "remain closed until = duy trì đóng cửa cho đến khi.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"until\"."
        },
        "recapNote": "Giới từ thời gian: remain / wait / stay + until + mốc thời gian."
      }
    ]
  },
  {
    "slug": "advanced-toeic-prepositions",
    "categorySlug": "prepositions-and-conjunctions",
    "categoryTitle": "4. Giới từ & Liên từ (Prepositions & Conjunctions)",
    "title": "Giới từ nâng cao TOEIC (prior to, regarding, despite)",
    "targetTags": [
      "TOEIC"
    ],
    "level": "600+",
    "totalQuestions": 50,
    "description": "Các giới từ học thuật thương mại xuất hiện liên tục trong Part 5 & 7: prior to, regarding, despite, throughout, among, in addition to.",
    "goldenRule": {
      "title": "Công thức Giới từ Thương mại Cốt lõi:",
      "formulas": [
        "Prior to / Ahead of + N / V-ing = Trước khi",
        "Regarding / Concerning / Pertaining to + N = Về việc",
        "Despite / In spite of / Notwithstanding + N = Mặc dù",
        "In addition to / Besides + N / V-ing = Bên cạnh / Ngoài ra"
      ],
      "note": "Tất cả các cụm từ này đều là GIỚI TỪ, theo sau bắt buộc là Cụm danh từ hoặc V-ing (KHÔNG ĐƯỢC đi với mệnh đề S + V)."
    },
    "quickTips": [
      "Regarding / Concerning = About (liên quan đến, về việc)",
      "Prior to = Before (trước khi)",
      "Despite = In spite of = Notwithstanding (+ Cụm Noun/V-ing)",
      "Throughout the country = khắp cả nước; Throughout the year = suốt cả năm"
    ],
    "mascotTip": "Thần chú: \"Regarding the proposal\" -> \"regarding\" là giới từ mang nghĩa \"về việc\", không phải V-ing tiếp diễn!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Kiểm tra phía sau",
          "action": "Phía sau là Mệnh đề S + V hay Cụm Danh từ?"
        },
        {
          "step": 2,
          "label": "Nghĩa biểu đạt",
          "action": "Trước khi (prior to), Về việc (regarding), Mặc dù (despite)"
        },
        {
          "step": 3,
          "label": "Khóa giới từ",
          "action": "Chọn giới từ thương mại tương ứng"
        }
      ],
      "explanation": "Bộ từ vựng ăn điểm 700+ TOEIC bắt buộc phải phân biệt được giới từ và liên từ đồng nghĩa."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "prior to departure / prior to signing"
      },
      {
        "id": "2",
        "formula": "inquiries regarding the warranty"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Giới từ (Theo sau bởi Noun / V-ing)",
        "items": [
          "despite, in spite of",
          "due to, owing to, because of",
          "prior to, ahead of",
          "during"
        ],
        "note": "Ví dụ: despite the heavy rain"
      },
      "rightBox": {
        "title": "Liên từ (Theo sau bởi Mệnh đề S + V)",
        "items": [
          "although, even though, though",
          "because, since, as",
          "before",
          "while"
        ],
        "note": "Ví dụ: although it rained heavily"
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy \"Despite of\"",
        "explanation": "Trong tiếng Anh chỉ có \"Despite + Noun\" hoặc \"In spite of + Noun\". Đề thi thường cho phương án bẫy \"Despite of\" (hoàn toàn sai ngữ pháp).",
        "wrongExample": "Despite of the economic downturn, sales grew.",
        "rightExample": "Despite the economic downturn, sales grew."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "Prior to boarding the aircraft, passengers must display their valid passport and boarding pass.",
        "sentenceVi": "Trước khi lên máy bay, hành khách phải xuất trình hộ chiếu hợp lệ và thẻ lên máy bay.",
        "highlightRule": "Giới từ: Prior to + V-ing (boarding)"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "_______ the unexpected rise in global logistics costs, the company posted record net earnings this year.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "Although",
            "inlineExplanation": "Sai. \"Although\" là liên từ, theo sau phải là mệnh đề S + V. Ở đây chỉ có cụm danh từ \"the unexpected rise...\"."
          },
          {
            "key": "B",
            "text": "Despite",
            "inlineExplanation": "Chính xác. Giới từ \"Despite\" (mặc dù) đứng trước cụm danh từ \"the unexpected rise in global logistics costs\"."
          },
          {
            "key": "C",
            "text": "Despite of",
            "inlineExplanation": "Sai ngữ pháp nghiêm trọng (không có \"despite of\")."
          },
          {
            "key": "D",
            "text": "Even though",
            "inlineExplanation": "Sai liên từ."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Đứng trước cụm danh từ \"the unexpected rise in global logistics costs\" (không có động từ chia thì).",
          "step2_ruleApplication": {
            "text": "Ý nghĩa nhượng bộ đi với cụm danh từ ➔ Bắt buộc dùng Giới từ \"Despite\". Loại liên từ \"Although, Even though\".",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Loại phương án bẫy \"Despite of\" vì không tồn tại trong tiếng Anh.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"Despite\"."
        },
        "recapNote": "Giới từ nhượng bộ: Despite / In spite of + Noun Phrase."
      },
      {
        "id": 2,
        "questionText": "If you have any questions _______ the revised employee medical insurance policy, please contact HR.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "regarding",
            "inlineExplanation": "Chính xác. Giới từ \"regarding\" mang nghĩa \"liên quan đến / về việc\" (đồng nghĩa với about)."
          },
          {
            "key": "B",
            "text": "regard",
            "inlineExplanation": "Sai động từ."
          },
          {
            "key": "C",
            "text": "regards",
            "inlineExplanation": "Sai."
          },
          {
            "key": "D",
            "text": "regardless",
            "inlineExplanation": "Sai, phải có \"regardless of\"."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Nối giữa danh từ \"questions\" và cụm danh từ \"the revised employee medical insurance policy\".",
          "step2_ruleApplication": {
            "text": "Cụm giới từ công sở kinh điển: questions/inquiries + regarding something (câu hỏi liên quan đến...).",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "\"regarding\" đóng vai trò là một giới từ hoàn chỉnh.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"regarding\"."
        },
        "recapNote": "Giới từ thương mại: regarding / concerning + Noun = về việc / liên quan đến."
      }
    ]
  },
  {
    "slug": "coordinating-correlative-conjunctions",
    "categorySlug": "prepositions-and-conjunctions",
    "categoryTitle": "4. Giới từ & Liên từ (Prepositions & Conjunctions)",
    "title": "Liên từ kết hợp & Tương quan (both...and, either...or)",
    "targetTags": [
      "TOEIC"
    ],
    "level": "600+",
    "totalQuestions": 50,
    "description": "Bí kíp 3 giây xử lý các cặp liên từ tương quan: both...and, either...or, neither...nor, not only...but also, whether...or.",
    "goldenRule": {
      "title": "Công thức Liên từ Tương quan Cốt lõi:",
      "formulas": [
        "both A and B",
        "either A or B",
        "neither A nor B",
        "not only A but also B",
        "whether A or B"
      ],
      "note": "Quy tắc song hành (Parallelism): A và B phải hoàn toàn tương đương nhau về từ loại và cấu trúc ngữ pháp."
    },
    "quickTips": [
      "Thấy \"and\" phía sau ➔ 95% chọn \"both\"",
      "Thấy \"or\" phía sau ➔ Nghĩ ngay tới \"either\" hoặc \"whether\"",
      "Thấy \"nor\" phía sau ➔ Bắt buộc đi với \"neither\"",
      "Nếu vế A là Tính từ thì vế B bắt buộc là Tính từ; vế A là To-V thì vế B là To-V"
    ],
    "mascotTip": "PassToeic Tip: Quét mắt nhanh tìm cặp từ tương ứng: and -> both, or -> either, nor -> neither. Chốt đáp án trong 2 giây!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Quét cặp",
          "action": "Tìm từ đối ngẫu phía sau: and, or, nor, but also"
        },
        {
          "step": 2,
          "label": "Khóa liên từ",
          "action": "Điền từ đi theo cặp tương ứng"
        },
        {
          "step": 3,
          "label": "Kiểm tra song hành",
          "action": "Xác minh tính tương đồng ngữ pháp giữa 2 vế"
        }
      ],
      "explanation": "Liên từ tương quan hoạt động theo từng cặp bất biến."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "BOTH professional AND courteous"
      },
      {
        "id": "2",
        "formula": "EITHER by email OR by courier"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Liên từ kết hợp (FANBOYS)",
        "items": [
          "For, And, Nor, But, Or, Yet, So",
          "Nối các từ, cụm từ hoặc mệnh đề độc lập tương đương"
        ],
        "note": "Ví dụ: The task was difficult, but we finished on time."
      },
      "rightBox": {
        "title": "Liên từ tương quan (Correlative)",
        "items": [
          "both...and, either...or, neither...nor, not only...but also",
          "Đòi hỏi sự cân xứng cấu trúc tuyệt đối giữa 2 vế"
        ],
        "note": "Ví dụ: not only skilled but also dedicated"
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy ghép sai cặp liên từ",
        "explanation": "Đề thi hay ghép nhầm: neither...or (SAI ➔ neither...nor); either...and (SAI ➔ both...and).",
        "wrongExample": "Neither the CEO or the board agreed to the terms.",
        "rightExample": "Neither the CEO nor the board agreed to the terms."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The new executive is both exceptionally knowledgeable and highly approachable.",
        "sentenceVi": "Vị giám đốc điều hành mới vừa am hiểu kiến thức xuất sắc lại vừa hết sức dễ gần.",
        "highlightRule": "Liên từ tương quan: both + Adj + and + Adj (song hành)"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "Applicants must demonstrate _______ fluency in technical English and substantial software engineering experience.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "either",
            "inlineExplanation": "Sai, vì phía sau có liên từ \"and\", không có \"or\"."
          },
          {
            "key": "B",
            "text": "both",
            "inlineExplanation": "Chính xác. Cặp liên từ tương quan \"both...and\" nối 2 cụm danh từ."
          },
          {
            "key": "C",
            "text": "neither",
            "inlineExplanation": "Sai, vì \"neither\" phải đi với \"nor\"."
          },
          {
            "key": "D",
            "text": "not",
            "inlineExplanation": "Sai."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Chỗ trống đứng trước cụm danh từ thứ nhất, phía sau có liên từ \"and\".",
          "step2_ruleApplication": {
            "text": "Cặp liên từ tương quan bắt buộc: both A and B (cả A và B) ➔ Loại either (đi với or), neither (đi với nor).",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Cấu trúc: both [fluency...] and [substantial experience...].",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"both\"."
        },
        "recapNote": "Liên từ tương quan: both A and B."
      },
      {
        "id": 2,
        "questionText": "Customers may pay for their merchandise _______ in cash at our retail store or via online bank transfer.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "either",
            "inlineExplanation": "Chính xác. Cặp liên từ \"either...or\" diễn tả lựa chọn giữa 2 phương thức thanh toán."
          },
          {
            "key": "B",
            "text": "neither",
            "inlineExplanation": "Sai, vì đi với \"or\" thay vì \"nor\"."
          },
          {
            "key": "C",
            "text": "both",
            "inlineExplanation": "Sai, vì đi với \"or\" thay vì \"and\"."
          },
          {
            "key": "D",
            "text": "as",
            "inlineExplanation": "Sai."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Phía sau chỗ trống có liên từ lựa chọn \"or\".",
          "step2_ruleApplication": {
            "text": "Cặp liên từ tương quan đi với \"or\": either A or B (hoặc A hoặc B).",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Cấu trúc song hành: either [in cash...] or [via bank transfer...].",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"either\"."
        },
        "recapNote": "Liên từ tương quan: either A or B."
      }
    ]
  },
  {
    "slug": "subordinating-conjunctions",
    "categorySlug": "prepositions-and-conjunctions",
    "categoryTitle": "4. Giới từ & Liên từ (Prepositions & Conjunctions)",
    "title": "Liên từ phụ thuộc (although, because, unless, once)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "600+",
    "totalQuestions": 50,
    "description": "Quy tắc kết nối mệnh đề phụ thuộc (mệnh đề chỉ nguyên nhân, điều kiện, nhượng bộ, thời gian) với mệnh đề chính.",
    "goldenRule": {
      "title": "Công thức Liên từ Phụ thuộc:",
      "formulas": [
        "Subordinating Conjunction + S + V, S + V",
        "S + V + Subordinating Conjunction + S + V"
      ],
      "note": "Theo sau Liên từ phụ thuộc BẮT BUỘC là một mệnh đề hoàn chỉnh gồm Chủ ngữ và Động từ chia thì (S + V)."
    },
    "quickTips": [
      "Nguyên nhân: because, since, as, now that (+ S + V)",
      "Nhượng bộ: although, even though, though (+ S + V)",
      "Điều kiện: unless (= if not), provided that, as long as (+ S + V)",
      "Thời gian: once (một khi), as soon as, while, when (+ S + V)"
    ],
    "mascotTip": "Thần chú: Sau chỗ trống có ĐỘNG TỪ CHIA THÌ -> Chọn Liên từ (Because/Although); Không có động từ -> Chọn Giới từ (Due to/Despite)!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Đếm động từ",
          "action": "Câu có 2 động từ chia thì độc lập không?"
        },
        {
          "step": 2,
          "label": "Xét mối quan hệ",
          "action": "Nguyên nhân - Kết quả (because) hay Tương phản (although)?"
        },
        {
          "step": 3,
          "label": "Khóa liên từ",
          "action": "Chọn liên từ kết nối 2 mệnh đề"
        }
      ],
      "explanation": "Liên từ phụ thuộc là chất keo dán 2 mệnh đề có S + V lại với nhau."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "ALTHOUGH the budget was tight, we succeeded"
      },
      {
        "id": "2",
        "formula": "UNLESS approved in writing, travel is not permitted"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Liên từ chỉ nguyên nhân",
        "items": [
          "because, since, as, now that",
          "Theo sau bởi mệnh đề S + V",
          "Nhấn mạnh lý do dẫn tới hành động ở mệnh đề chính"
        ],
        "note": "Ví dụ: Because he arrived late, he missed the flight."
      },
      "rightBox": {
        "title": "Liên từ chỉ nhượng bộ",
        "items": [
          "although, even though, though",
          "Theo sau bởi mệnh đề S + V",
          "Diễn tả sự trái ngược giữa nguyên nhân và kết quả"
        ],
        "note": "Ví dụ: Although sales dropped, profits rose."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy nhầm lẫn giữa Unless và If",
        "explanation": "Unless = If... not (Trừ khi). Trong mệnh đề chứa Unless không dùng phủ định (not) vì bản thân nó đã mang nghĩa phủ định.",
        "wrongExample": "Unless you do not submit the receipt, you will not be reimbursed.",
        "rightExample": "Unless you submit the receipt, you will not be reimbursed."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "Although the initial market research was discouraging, the prototype received overwhelmingly positive reviews.",
        "sentenceVi": "Mặc dù nghiên cứu thị trường ban đầu không mấy khả quan, mẫu thử nghiệm đã nhận được những đánh giá tích cực áp đảo.",
        "highlightRule": "Liên từ nhượng bộ: Although + S + V, S + V"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "_______ the software installation was completed ahead of schedule, the IT team tested all modules thoroughly.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "Even though",
            "inlineExplanation": "Chính xác. Liên từ nhượng bộ \"Even though\" kết nối mệnh đề phụ \"the software installation was completed...\" với mệnh đề chính."
          },
          {
            "key": "B",
            "text": "Despite",
            "inlineExplanation": "Sai. \"Despite\" là giới từ, không đi với mệnh đề S + V."
          },
          {
            "key": "C",
            "text": "In spite of",
            "inlineExplanation": "Sai giới từ."
          },
          {
            "key": "D",
            "text": "Regardless",
            "inlineExplanation": "Sai."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Đứng trước một mệnh đề hoàn chỉnh có chủ ngữ \"the software installation\" và động từ chia thì \"was completed\".",
          "step2_ruleApplication": {
            "text": "Theo sau là mệnh đề (S + V) ➔ Bắt buộc dùng Liên từ. Loại bỏ các giới từ \"Despite, In spite of\".",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "\"Even though\" mang nghĩa mặc dù, nối 2 mệnh đề tương phản hợp logic.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"Even though\"."
        },
        "recapNote": "Liên từ phụ thuộc: Even though / Although + S + V, S + V."
      },
      {
        "id": 2,
        "questionText": "The warranty coverage will become completely void _______ all maintenance work is performed by certified technicians.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "unless",
            "inlineExplanation": "Chính xác. \"unless\" mang nghĩa \"trừ khi / nếu không\" (bảo hành sẽ bị vô hiệu trừ khi việc bảo trì được thực hiện bởi kỹ thuật viên có chứng chỉ)."
          },
          {
            "key": "B",
            "text": "without",
            "inlineExplanation": "Sai. \"without\" là giới từ, không đi với mệnh đề S + V \"all maintenance work is performed...\"."
          },
          {
            "key": "C",
            "text": "despite",
            "inlineExplanation": "Sai giới từ."
          },
          {
            "key": "D",
            "text": "instead of",
            "inlineExplanation": "Sai giới từ."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Đứng giữa 2 mệnh đề: \"The warranty coverage will become completely void\" và \"all maintenance work is performed by certified technicians\".",
          "step2_ruleApplication": {
            "text": "Phía sau có mệnh đề hoàn chỉnh (S + is performed) ➔ Cần liên từ điều kiện phủ định \"unless\" (trừ khi).",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Without, despite, instead of là giới từ nên không thể đi với mệnh đề.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"unless\"."
        },
        "recapNote": "Liên từ điều kiện: unless + S + V = trừ phi / nếu không."
      }
    ]
  }
];
