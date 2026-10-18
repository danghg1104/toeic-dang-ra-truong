module.exports = [
  {
    "slug": "relative-clauses",
    "categorySlug": "clauses",
    "categoryTitle": "5. Các loại Mệnh đề (Clauses)",
    "title": "Mệnh đề quan hệ (Who, Whom, Which, That, Whose)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "600+",
    "totalQuestions": 50,
    "description": "Nắm vững các đại từ quan hệ Who, Whom, Which, That, Whose, phân biệt mệnh đề quan hệ xác định và không xác định, quy tắc giới từ đi với Whom/Which.",
    "goldenRule": {
      "title": "Công thức Đại từ Quan hệ Cốt lõi:",
      "formulas": [
        "N_{người} + who + V",
        "N_{người} + whom + S + V",
        "N_{vật} + which + V / (S + V)",
        "N + whose + N + V / (S + V)"
      ],
      "note": "Sau giới từ CHỈ DÙNG WHOM (người) hoặc WHICH (vật); KHÔNG bao giờ dùng That sau giới từ hoặc sau dấu phẩy."
    },
    "quickTips": [
      "Whose đứng giữa 2 danh từ và mang nghĩa sở hữu (the architect whose design won)",
      "That có thể thay cho who, whom, which nhưng CẤM dùng sau dấu phẩy và sau giới từ",
      "Giới từ + Whom/Which: to whom, with whom, in which, for which"
    ],
    "mascotTip": "Thần chú 3 giây: Thấy danh từ chỉ người + chỗ trống + Danh từ không có mạo từ ➔ 100% chọn WHOSE!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Tiền từ",
          "action": "Danh từ đứng trước là Người hay Vật?"
        },
        {
          "step": 2,
          "label": "Thành phần sau",
          "action": "Theo sau là Động từ (who/which) hay Mệnh đề S+V (whom/which)?"
        },
        {
          "step": 3,
          "label": "Dấu câu & Giới từ",
          "action": "Có dấu phẩy hoặc giới từ đứng trước không? (Loại That)"
        }
      ],
      "explanation": "Đại từ quan hệ thay thế cho danh từ đứng trước và đóng vai trò ngữ pháp trong mệnh đề phụ."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "the applicant WHO submitted"
      },
      {
        "id": "2",
        "formula": "the company WHOSE profits doubled"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Mệnh đề quan hệ xác định",
        "items": [
          "Cung cấp thông tin thiết yếu để định danh",
          "KHÔNG dùng dấu phẩy",
          "Có thể dùng \"that\" thay cho who, whom, which"
        ],
        "note": "Ví dụ: The man that called you is here."
      },
      "rightBox": {
        "title": "Mệnh đề quan hệ không xác định",
        "items": [
          "Cung cấp thông tin bổ sung cho danh từ đã rõ",
          "BẮT BUỘC có dấu phẩy",
          "TUYỆT ĐỐI KHÔNG DÙNG \"that\""
        ],
        "note": "Ví dụ: Mr. Tanaka, who joined last year, is VP."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy dùng \"that\" sau dấu phẩy hoặc giới từ",
        "explanation": "Đề thi hay gài dùng \"that\" sau dấu phẩy hoặc sau giới từ (in that, to that). Quy tắc: Không bao giờ dùng that trong 2 trường hợp này.",
        "wrongExample": "Mr. Henderson, that is the head auditor, will inspect the branch.",
        "rightExample": "Mr. Henderson, who is the head auditor, will inspect the branch."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The architect whose innovative blueprint won the design award will oversee construction.",
        "sentenceVi": "Kiến trúc sư có bản thiết kế sáng tạo đạt giải thưởng sẽ trực tiếp giám sát việc thi công.",
        "highlightRule": "Đại từ sở hữu: The architect whose innovative blueprint..."
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "The environmental engineer _______ designed the wastewater recycling system was honored at the annual symposium.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "which",
            "inlineExplanation": "Sai, vì danh từ phía trước là người \"The environmental engineer\"."
          },
          {
            "key": "B",
            "text": "who",
            "inlineExplanation": "Chính xác. \"who\" thay thế cho danh từ chỉ người làm chủ ngữ cho động từ \"designed\"."
          },
          {
            "key": "C",
            "text": "whom",
            "inlineExplanation": "Sai, vì sau chỗ trống là động từ \"designed\", không phải mệnh đề S + V."
          },
          {
            "key": "D",
            "text": "whose",
            "inlineExplanation": "Sai, vì sau chỗ trống là động từ, không phải danh từ."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Đại từ quan hệ thay thế cho danh từ chỉ người \"The environmental engineer\" và làm chủ ngữ cho động từ \"designed\".",
          "step2_ruleApplication": {
            "text": "Đại từ quan hệ chỉ người làm chủ ngữ ➔ Bắt buộc dùng \"who\".",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Loại \"whom\" vì sau là động từ, loại \"which\" vì chỉ vật.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"who\"."
        },
        "recapNote": "Đại từ quan hệ: N_{người} + who + V (vị ngữ)."
      },
      {
        "id": 2,
        "questionText": "We interviewed several consulting firms, two of _______ have extensive experience in renewable energy infrastructure.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "which",
            "inlineExplanation": "Chính xác. Sau giới từ \"of\" thay thế cho danh từ chỉ vật/tổ chức \"consulting firms\" ➔ Dùng \"which\"."
          },
          {
            "key": "B",
            "text": "that",
            "inlineExplanation": "Sai. Tuyệt đối không dùng \"that\" sau giới từ (two of that là sai)."
          },
          {
            "key": "C",
            "text": "whom",
            "inlineExplanation": "Sai, vì \"consulting firms\" là tổ chức/công ty (chỉ vật)."
          },
          {
            "key": "D",
            "text": "whose",
            "inlineExplanation": "Sai."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Đứng sau cụm từ chỉ số lượng và giới từ \"two of _______\" thay cho danh từ chỉ công ty \"consulting firms\".",
          "step2_ruleApplication": {
            "text": "Sau giới từ thay thế cho danh từ chỉ vật/công ty ➔ Bắt buộc dùng \"which\".",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Loại \"that\" vì không đứng sau giới từ; loại \"whom\" vì chỉ người.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"which\"."
        },
        "recapNote": "Đại từ quan hệ sau giới từ: Lượng từ + of + whom / which."
      }
    ]
  },
  {
    "slug": "reduced-relative-clauses",
    "categorySlug": "clauses",
    "categoryTitle": "5. Các loại Mệnh đề (Clauses)",
    "title": "Rút gọn mệnh đề quan hệ (V-ing / V3-ed / To-V)",
    "targetTags": [
      "TOEIC"
    ],
    "level": "800+",
    "totalQuestions": 50,
    "description": "Dạng bài phân loại điểm 800+ trong TOEIC Part 5: rút gọn chủ động thành V-ing, rút gọn bị động thành V-ed/V3, và rút gọn với To-V.",
    "goldenRule": {
      "title": "Công thức Rút gọn Mệnh đề Quan hệ:",
      "formulas": [
        "N + V-ing + Object (Rút gọn CHỦ ĐỘNG)",
        "N + V3/V-ed + (by / prep) (Rút gọn BỊ ĐỘNG)",
        "N + to-V (sau the first, the only, the best)"
      ],
      "note": "Nếu câu đã có Động từ chính chia thì, chỗ trống bổ nghĩa cho danh từ chỉ có thể là V-ing hoặc V3/ed."
    },
    "quickTips": [
      "Sau chỗ trống CÓ TÂN NGỮ (Cụm danh từ) ➔ Rút gọn CHỦ ĐỘNG: Chọn V-ing",
      "Sau chỗ trống KHÔNG CÓ TÂN NGỮ (đi với giới từ by/in/at hoặc dấu phẩy) ➔ Rút gọn BỊ ĐỘNG: Chọn V-ed/V3",
      "Thấy \"the first / the second / the only / the next\" ➔ Rút gọn dùng to-V"
    ],
    "mascotTip": "Quy tắc vàng 5 giây: Tìm động từ chính của câu trước! Nếu đã có V chính -> Tuyệt đối không chọn động từ chia thì nữa!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Động từ chính",
          "action": "Câu đã có động từ chia thì chưa? (Đã có ➔ Rút gọn)"
        },
        {
          "step": 2,
          "label": "Quan hệ chủ/bị",
          "action": "Danh từ tự thực hiện (V-ing) hay chịu tác động (V-ed)?"
        },
        {
          "step": 3,
          "label": "Tân ngữ phía sau",
          "action": "Có danh từ tân ngữ ➔ V-ing; Đi với giới từ ➔ V-ed"
        }
      ],
      "explanation": "Biến một mệnh đề quan hệ rườm rà thành một cụm phân từ ngắn gọn súc tích."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "passengers HOLDING valid boarding passes"
      },
      {
        "id": "2",
        "formula": "goods ORDERED online"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Rút gọn Chủ động (V-ing)",
        "items": [
          "Bản gốc: who/which + Verb chủ động",
          "Rút gọn: bỏ đại từ quan hệ và to be, chuyển V thành V-ing",
          "Phía sau CÓ tân ngữ nhận tác động"
        ],
        "note": "Ví dụ: anyone wishing to attend (= who wishes)"
      },
      "rightBox": {
        "title": "Rút gọn Bị động (V3/ed)",
        "items": [
          "Bản gốc: who/which + be + V3/ed",
          "Rút gọn: bỏ đại từ quan hệ và to be, giữ lại V3/ed",
          "Phía sau KHÔNG CÓ tân ngữ, thường đi với giới từ"
        ],
        "note": "Ví dụ: products manufactured in Vietnam (= which are manufactured)"
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy chọn thêm một động từ chia thì vào câu đã đủ vị ngữ",
        "explanation": "Thí sinh hay chọn động từ chia thì (has ordered, was purchased) khiến câu có 2 vị ngữ chính mà không có liên từ nối.",
        "wrongExample": "All products were purchased online can be returned.",
        "rightExample": "All products purchased online can be returned."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "Passengers traveling to international destinations must report to terminal 2 three hours prior to departure.",
        "sentenceVi": "Hành khách đi đến các điểm đến quốc tế phải có mặt tại nhà ga số 2 ba tiếng trước giờ khởi hành.",
        "highlightRule": "Rút gọn chủ động: Passengers traveling (= who are traveling)"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "Any conference participant _______ questions regarding the schedule should speak directly to the registration staff.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "has",
            "inlineExplanation": "Sai. Nếu chọn \"has\", câu sẽ có 2 động từ chia thì độc lập (has và should speak) mà không có liên từ."
          },
          {
            "key": "B",
            "text": "having",
            "inlineExplanation": "Chính xác. Rút gọn mệnh đề quan hệ dạng chủ động (who has -> having) bổ nghĩa cho \"Any conference participant\"."
          },
          {
            "key": "C",
            "text": "had",
            "inlineExplanation": "Sai động từ chia thì quá khứ."
          },
          {
            "key": "D",
            "text": "have",
            "inlineExplanation": "Sai động từ chia thì."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Câu đã có động từ chính là \"should speak\". Chỗ trống nằm trong cụm bổ nghĩa cho chủ ngữ \"Any conference participant\".",
          "step2_ruleApplication": {
            "text": "Vì đã có động từ chính chia thì ➔ Chỗ trống phải là phân từ rút gọn mệnh đề quan hệ (V-ing hoặc V3/ed). Loại A, C, D.",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Phía sau có tân ngữ \"questions\" ➔ Dạng rút gọn chủ động: \"having questions\".",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"having\"."
        },
        "recapNote": "Rút gọn chủ động: N + V-ing + Object + V (main) (participant having questions)."
      },
      {
        "id": 2,
        "questionText": "Electronic components _______ by the logistics subsidiary will be inspected upon arrival at the seaport.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "shipped",
            "inlineExplanation": "Chính xác. Rút gọn mệnh đề quan hệ dạng bị động (which are shipped -> shipped) bổ nghĩa cho \"Electronic components\"."
          },
          {
            "key": "B",
            "text": "shipping",
            "inlineExplanation": "Sai chủ động, linh kiện điện tử không thể tự vận chuyển."
          },
          {
            "key": "C",
            "text": "were shipped",
            "inlineExplanation": "Sai, vì câu đã có động từ chính \"will be inspected\"."
          },
          {
            "key": "D",
            "text": "ship",
            "inlineExplanation": "Sai."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Câu đã có động từ chính \"will be inspected\". Chỗ trống bổ nghĩa cho danh từ \"Electronic components\".",
          "step2_ruleApplication": {
            "text": "Phía sau có cụm giới từ \"by the logistics subsidiary\" ➔ Thể bị động rút gọn: V3/ed (shipped).",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Loại \"were shipped\" vì sẽ tạo ra 2 động từ chính trong câu mà không có liên từ.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"shipped\"."
        },
        "recapNote": "Rút gọn bị động: N + V3/V-ed + by O + V (main) (components shipped by...)."
      }
    ]
  },
  {
    "slug": "noun-clauses",
    "categorySlug": "clauses",
    "categoryTitle": "5. Các loại Mệnh đề (Clauses)",
    "title": "Mệnh đề danh ngữ (What, Whether, That)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "600+",
    "totalQuestions": 50,
    "description": "Cách nhận diện và sử dụng mệnh đề danh ngữ làm chủ ngữ, tân ngữ hoặc bổ ngữ trong câu với các từ nối That, What, Whether, How.",
    "goldenRule": {
      "title": "Công thức Mệnh đề Danh ngữ Cốt lõi:",
      "formulas": [
        "That / What / Whether + S + V + V (chính (số ít))",
        "S + V + that / what / whether / if + S + V"
      ],
      "note": "Mệnh đề danh ngữ khi làm chủ ngữ thì động từ chính của câu LUÔN CHIA Ở NGÔI THỨ 3 SỐ ÍT."
    },
    "quickTips": [
      "That + Mệnh đề hoàn chỉnh (That the proposal was accepted surprised everyone)",
      "What + Mệnh đề thiếu thành phần (What we need is more capital)",
      "Whether... or not = liệu có... hay không (Whether có thể đứng đầu câu, If thì KHÔNG)"
    ],
    "mascotTip": "Bẫy đề thi: Chỗ trống đứng đầu câu mang nghĩa \"Liệu có... hay không\" ➔ Bắt buộc chọn WHETHER, không bao giờ chọn IF!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Vị trí mệnh đề",
          "action": "Làm chủ ngữ đầu câu hay làm tân ngữ sau động từ?"
        },
        {
          "step": 2,
          "label": "Mức độ trọn vẹn",
          "action": "Mệnh đề sau trọn vẹn (That) hay khuyết thiếu (What)?"
        },
        {
          "step": 3,
          "label": "Nghi vấn/Liệu rằng",
          "action": "Nếu mang nghĩa phân vân -> Whether"
        }
      ],
      "explanation": "Mệnh đề danh ngữ đóng vai trò tương đương một danh từ trong cấu trúc câu."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "WHETHER we can meet the deadline DEPENDS on funding"
      },
      {
        "id": "2",
        "formula": "the committee decided THAT the bid was valid"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "That Clause (Mệnh đề That)",
        "items": [
          "Diễn tả một sự thật hiển nhiên hoặc sự kiện xác định",
          "Mệnh đề đi sau \"that\" đã trọn vẹn đầy đủ S + V + O"
        ],
        "note": "Ví dụ: That he won is certain."
      },
      "rightBox": {
        "title": "Whether Clause (Mệnh đề Whether)",
        "items": [
          "Diễn tả sự nghi ngờ, lựa chọn giữa 2 phương án",
          "Thường đi kèm \"or not\"",
          "Có thể đứng sau giới từ (about whether)"
        ],
        "note": "Ví dụ: I wonder whether it will rain."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy dùng \"If\" đứng đầu câu làm chủ ngữ",
        "explanation": "Trong tiếng Anh học thuật, \"If\" không được đứng đầu câu để làm chủ ngữ mệnh đề danh ngữ, cũng không đứng sau giới từ. Bắt buộc dùng \"Whether\".",
        "wrongExample": "If the merger will proceed depends on the antitrust ruling.",
        "rightExample": "Whether the merger will proceed depends on the antitrust ruling."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "Whether the foreign manufacturing plant will expand depends largely on regulatory tax incentives.",
        "sentenceVi": "Liệu nhà máy sản xuất ở nước ngoài có mở rộng hay không phụ thuộc phần lớn vào các ưu đãi thuế của chính phủ.",
        "highlightRule": "Mệnh đề danh ngữ làm chủ ngữ: Whether + S + V + depends (chia số ít)"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "_______ the new medical device receives patent approval will determine the launch date.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "Whether",
            "inlineExplanation": "Chính xác. \"Whether\" mở đầu mệnh đề danh ngữ làm chủ ngữ cho động từ \"will determine\" (việc liệu thiết bị có được cấp bằng sáng chế hay không)."
          },
          {
            "key": "B",
            "text": "If",
            "inlineExplanation": "Sai. \"If\" không đứng đầu câu làm chủ ngữ cho mệnh đề danh ngữ."
          },
          {
            "key": "C",
            "text": "That",
            "inlineExplanation": "Sai về mặt ngữ nghĩa (sự việc chưa ngã ngũ, không phải sự thật hiển nhiên)."
          },
          {
            "key": "D",
            "text": "Which",
            "inlineExplanation": "Sai."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Từ nối đứng đầu câu mở đầu cho mệnh đề danh ngữ làm chủ ngữ cho động từ \"will determine\".",
          "step2_ruleApplication": {
            "text": "Mang ý nghĩa phân vân \"liệu có... hay không\" đứng đầu câu làm chủ ngữ ➔ Bắt buộc dùng \"Whether\". Loại \"If\".",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Cấu trúc: Whether S + V + will determine...",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"Whether\"."
        },
        "recapNote": "Mệnh đề danh ngữ: Whether + S + V + V (main) (Whether S+V làm chủ ngữ)."
      },
      {
        "id": 2,
        "questionText": "The CEO emphasized _______ innovative workforce development is vital for maintaining our technological edge.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "what",
            "inlineExplanation": "Sai. Vế sau \"innovative workforce development is vital...\" đã hoàn chỉnh đầy đủ S + V + Adj, không thể dùng \"what\"."
          },
          {
            "key": "B",
            "text": "that",
            "inlineExplanation": "Chính xác. \"that\" mở đầu mệnh đề danh ngữ hoàn chỉnh làm tân ngữ cho động từ \"emphasized\"."
          },
          {
            "key": "C",
            "text": "which",
            "inlineExplanation": "Sai."
          },
          {
            "key": "D",
            "text": "whom",
            "inlineExplanation": "Sai."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Đứng sau ngoại động từ \"emphasized\" (nhấn mạnh), nối với mệnh đề trọn vẹn phía sau.",
          "step2_ruleApplication": {
            "text": "Mệnh đề phía sau đã đầy đủ thành phần ngữ pháp ➔ Dùng liên từ \"that\" mở đầu mệnh đề danh ngữ.",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "S + emphasized that + S + V...",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"that\"."
        },
        "recapNote": "Mệnh đề danh ngữ tân ngữ: S + V + that + S + V + O."
      }
    ]
  },
  {
    "slug": "adverbial-clauses",
    "categorySlug": "clauses",
    "categoryTitle": "5. Các loại Mệnh đề (Clauses)",
    "title": "Mệnh đề trạng ngữ (Adverbial Clauses)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "600+",
    "totalQuestions": 50,
    "description": "Nắm vững các mệnh đề trạng ngữ chỉ mục đích (so that, in order that), kết quả (so... that, such... that) và rút gọn mệnh đề trạng ngữ cùng chủ ngữ.",
    "goldenRule": {
      "title": "Công thức Mệnh đề Trạng ngữ Cốt lõi:",
      "formulas": [
        "So that / In order that + S + can/could/will/would + V",
        "So + Adj/Adv + that + S + V",
        "Such + (a/an) + Adj + Noun + that + S + V"
      ],
      "note": "So that đi với mệnh đề có động từ khuyết thiếu; So... that đi với tính từ/trạng từ; Such... that đi với cụm danh từ."
    },
    "quickTips": [
      "So + Adj/Adv + that: quá... đến nỗi mà (The conference was so crowded that...)",
      "Such + (a/an) + Adj + Noun + that (It was such a crowded conference that...)",
      "Rút gọn trạng ngữ cùng chủ ngữ: Having completed the report, he sent it."
    ],
    "mascotTip": "Thần chú: Thấy chữ \"that\" phía sau, nhìn ngay trước chỗ trống: có Danh từ thì chọn SUCH, chỉ có Tính từ/Trạng từ thì chọn SO!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Thành phần giữa",
          "action": "Giữa chỗ trống và \"that\" là Tính từ hay Cụm danh từ?"
        },
        {
          "step": 2,
          "label": "So hay Such",
          "action": "Tính từ -> So; Cụm danh từ -> Such"
        },
        {
          "step": 3,
          "label": "Mục đích hay Kết quả",
          "action": "Nếu chỉ mục đích (\"để mà\") -> So that"
        }
      ],
      "explanation": "Phân định rõ ràng giữa cấu trúc chỉ mục đích và cấu trúc chỉ kết quả."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "SO expensive THAT nobody bought it"
      },
      {
        "id": "2",
        "formula": "SUCH an expensive product THAT nobody bought it"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Mệnh đề chỉ Mục đích (Purpose)",
        "items": [
          "so that, in order that",
          "Theo sau thường có modal verb: can, could, will, would",
          "Nối hành động với mục tiêu hướng tới"
        ],
        "note": "Ví dụ: Speak clearly so that everyone can hear."
      },
      "rightBox": {
        "title": "Mệnh đề chỉ Kết quả (Result)",
        "items": [
          "so... that, such... that",
          "Diễn tả mức độ tác động dẫn đến kết quả",
          "Có sự phân biệt giữa Adj (So) và Noun (Such)"
        ],
        "note": "Ví dụ: It was so hot that we stayed home."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy dùng \"So that\" thay cho \"In order to\"",
        "explanation": "So that theo sau là mệnh đề S + V. In order to theo sau là động từ nguyên mẫu (V (bare)). Đề thi hay gài \"in order to + S + V\" (hoàn toàn sai).",
        "wrongExample": "He left early in order to he could catch the train.",
        "rightExample": "He left early so that he could catch the train / in order to catch the train."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The automated assembly line operated so efficiently that output doubled within three months.",
        "sentenceVi": "Dây chuyền lắp ráp tự động vận hành hiệu quả đến mức sản lượng đã tăng gấp đôi chỉ trong ba tháng.",
        "highlightRule": "Mệnh đề trạng ngữ chỉ kết quả: so + efficiently (Adv) + that + S + V"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "The project budget was _______ limited that the director had to scale back marketing operations.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "so",
            "inlineExplanation": "Chính xác. Cấu trúc \"so + Adj + that\" (quá đến nỗi mà) với tính từ \"limited\"."
          },
          {
            "key": "B",
            "text": "such",
            "inlineExplanation": "Sai. \"such\" phải đi với cụm danh từ (such a limited budget that)."
          },
          {
            "key": "C",
            "text": "too",
            "inlineExplanation": "Sai, vì cấu trúc của \"too\" là \"too... to V\", không đi với \"that\"."
          },
          {
            "key": "D",
            "text": "very",
            "inlineExplanation": "Sai, không đi kèm mệnh đề \"that\"."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Đứng trước tính từ \"limited\" và phía sau có liên từ kết quả \"that\".",
          "step2_ruleApplication": {
            "text": "Cấu trúc chỉ kết quả với Tính từ: so + Adj + that.",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Loại \"such\" vì không có danh từ đi kèm ngay sau limited.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"so\"."
        },
        "recapNote": "Cấu trúc kết quả: so + Adj/Adv + that + S + V."
      },
      {
        "id": 2,
        "questionText": "The human resources department updated the handbook _______ all employees could easily understand company regulations.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "so that",
            "inlineExplanation": "Chính xác. Liên từ chỉ mục đích \"so that\" kết nối mệnh đề có trợ động từ \"could understand\"."
          },
          {
            "key": "B",
            "text": "in order to",
            "inlineExplanation": "Sai. \"in order to\" theo sau là V nguyên mẫu, không đi với mệnh đề \"all employees could...\"."
          },
          {
            "key": "C",
            "text": "because of",
            "inlineExplanation": "Sai giới từ."
          },
          {
            "key": "D",
            "text": "due to",
            "inlineExplanation": "Sai giới từ."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Đứng giữa 2 mệnh đề độc lập, mệnh đề sau có modal verb \"could\".",
          "step2_ruleApplication": {
            "text": "Liên từ chỉ mục đích đi với mệnh đề: \"so that + S + could + V\".",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Loại \"in order to\" vì phía sau là mệnh đề, không phải V nguyên thể.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"so that\"."
        },
        "recapNote": "Mục đích: so that / in order that + S + can/could + V."
      }
    ]
  }
];
