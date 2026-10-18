module.exports = [
  {
    "slug": "passive-voice",
    "categorySlug": "verb-forms-and-passive",
    "categoryTitle": "3. Dạng thức Động từ & Câu Bị động",
    "title": "Câu bị động (Passive Voice)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "600+",
    "totalQuestions": 50,
    "description": "Quy tắc chuyển đổi chủ động - bị động, nhận diện bị động qua giới từ \"by\" và động từ không có tân ngữ phía sau.",
    "goldenRule": {
      "title": "Công thức Bị động cốt lõi:",
      "formulas": [
        "S + be + V3 / V-ed + (by O)"
      ],
      "note": "Chủ ngữ là đối tượng tiếp nhận hành động thay vì tự thực hiện hành động."
    },
    "quickTips": [
      "Sau chỗ trống KHÔNG có tân ngữ danh từ ➔ 90% chọn dạng Bị động (be + V3/ed)",
      "Chủ ngữ chỉ vật/đồ vật trong TOEIC Part 5 thường chia ở thể bị động",
      "Nội động từ (occur, happen, remain, exist, arrive) KHÔNG BAO GIỜ chia bị động"
    ],
    "mascotTip": "Bí kíp 3 giây: Thấy phía sau có giới từ \"by / in / at\" hoặc dấu chấm câu ➔ Ưu tiên khoanh ngay thể bị động BE + V3/ED!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Chủ ngữ",
          "action": "Chủ ngữ tự làm hay bị tác động?"
        },
        {
          "step": 2,
          "label": "Phía sau trống",
          "action": "Có tân ngữ (Object) nhận tác động không?"
        },
        {
          "step": 3,
          "label": "Khóa thể",
          "action": "Nếu phía sau là giới từ (by, in, at, to) ➔ Chọn Bị động"
        }
      ],
      "explanation": "Nếu phía sau là giới từ hoặc không có danh từ làm tân ngữ trực tiếp ➔ Chọn Bị động."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "S + is/are/was/were + V3/V-ed"
      },
      {
        "id": "2",
        "formula": "S + have/has + been + V3/V-ed"
      },
      {
        "id": "3",
        "formula": "S + will be + V3/V-ed"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Chủ động (Active)",
        "items": [
          "Chủ ngữ tự gây ra hành động",
          "Sau động từ CÓ tân ngữ danh từ trực tiếp"
        ],
        "note": "Cấu trúc: S + V + O"
      },
      "rightBox": {
        "title": "Bị động (Passive)",
        "items": [
          "Chủ ngữ chịu sự tác động",
          "Sau động từ KHÔNG có tân ngữ (thường đi với giới từ)"
        ],
        "note": "Cấu trúc: S + be + V3/ed + by O"
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy Nội động từ (Intransitive Verbs) không bao giờ chia bị động",
        "explanation": "Các động từ như occur, happen, arrive, remain, exist, expire KHÔNG BAO GIỜ chia dạng bị động vì bản thân chúng không nhận tân ngữ.",
        "wrongExample": "The conference was occurred yesterday morning.",
        "rightExample": "The conference occurred yesterday morning."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The revised marketing strategy was approved by the board of directors yesterday.",
        "sentenceVi": "Chiến lược tiếp thị sửa đổi đã được ban giám đốc phê duyệt vào ngày hôm qua.",
        "highlightRule": "Bị động: was approved by + đối tượng thực hiện"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "The annual financial statement _______ by the independent audit firm before next Monday.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "will review",
            "inlineExplanation": "Sai. Đây là thể chủ động, trong khi báo cáo tài chính phải được kiểm toán viên xem xét."
          },
          {
            "key": "B",
            "text": "will be reviewed",
            "inlineExplanation": "Chính xác. Thể bị động tương lai: will + be + V3/ed, phía sau có giới từ \"by\"."
          },
          {
            "key": "C",
            "text": "reviews",
            "inlineExplanation": "Sai. Hiện tại đơn chủ động không phù hợp ngữ cảnh và bối cảnh bị động."
          },
          {
            "key": "D",
            "text": "is reviewing",
            "inlineExplanation": "Sai. Bản báo cáo không thể tự đang xem xét (tiếp diễn chủ động)."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Chủ ngữ \"The annual financial statement\" (bản báo cáo tài chính) là danh từ chỉ vật.",
          "step2_ruleApplication": {
            "text": "Phía sau chỗ trống có cụm \"by the independent audit firm\" ➔ Bắt buộc dùng thể Bị động.",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Thời gian \"before next Monday\" chỉ tương lai ➔ Cấu trúc \"will be reviewed\".",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"will be reviewed\"."
        },
        "recapNote": "Bị động tương lai: S + will be + V3/V-ed + by O."
      },
      {
        "id": 2,
        "questionText": "Unforeseen technical delays _______ during the final phase of the power grid renovation.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "were occurred",
            "inlineExplanation": "Sai nghiêm trọng. \"occur\" là nội động từ, tuyệt đối không chia thể bị động."
          },
          {
            "key": "B",
            "text": "occurred",
            "inlineExplanation": "Chính xác. \"occur\" là nội động từ chia ở thể chủ động quá khứ đơn."
          },
          {
            "key": "C",
            "text": "was occurred",
            "inlineExplanation": "Sai vừa bị động vừa sai số ít/nhiều."
          },
          {
            "key": "D",
            "text": "occurring",
            "inlineExplanation": "Sai dạng V-ing thiếu trợ động từ."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Động từ chính của câu sau chủ ngữ \"Unforeseen technical delays\".",
          "step2_ruleApplication": {
            "text": "Bẫy nội động từ: \"occur, happen, remain\" KHÔNG BAO GIỜ chia bị động (be + V3/ed) ➔ Loại A, C.",
            "eliminatedKeys": [
              "A",
              "C"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Câu cần động từ vị ngữ chính ở quá khứ đơn ➔ Chọn \"occurred\".",
            "eliminatedKeys": [
              "D"
            ]
          },
          "finalConclusion": "Chọn B - \"occurred\"."
        },
        "recapNote": "Bẫy nội động từ: occur, happen, remain, exist không có dạng bị động!"
      }
    ]
  },
  {
    "slug": "subject-verb-agreement",
    "categorySlug": "verb-forms-and-passive",
    "categoryTitle": "3. Dạng thức Động từ & Câu Bị động",
    "title": "Sự hòa hợp Chủ ngữ & Động từ (S-V Agreement)",
    "targetTags": [
      "TOEIC"
    ],
    "level": "600+",
    "totalQuestions": 50,
    "description": "Quy tắc chia động từ theo chủ ngữ số ít/số nhiều, bẫy cụm giới từ chen ngang, và các cấu trúc Either/Neither/Not only... but also.",
    "goldenRule": {
      "title": "Công thức Sự hòa hợp Chủ - Vị:",
      "formulas": [
        "N_1 + prep + N_2 → V (chia theo ) N_1",
        "The number of + N_{pl} → V (số ít)",
        "A number of + N_{pl} → V (số nhiều)"
      ],
      "note": "Khi cụm giới từ chen giữa chủ ngữ và động từ, động từ luôn chia theo danh từ đứng TRƯỚC giới từ."
    },
    "quickTips": [
      "Gạch bỏ cụm giới từ (in, on, of, for, with) khi tìm chủ ngữ chính",
      "The number of đi với V số ít; A number of đi với V số nhiều",
      "Either A or B / Neither A nor B ➔ Động từ chia theo B"
    ],
    "mascotTip": "Thần chú: \"The cost of building materials ______\" -> Chủ ngữ là \"The cost\" số ít, đừng nhìn chữ \"materials\" mà chia số nhiều nhé!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Lọc nhiễu",
          "action": "Bỏ qua các cụm giới từ chen ngang nằm giữa S và V"
        },
        {
          "step": 2,
          "label": "Bắt chủ ngữ",
          "action": "Tìm danh từ cốt lõi đứng đầu cụm"
        },
        {
          "step": 3,
          "label": "Khóa số",
          "action": "Số ít (thêm -s, is, was, has) hay Số nhiều (giữ nguyên, are, were, have)"
        }
      ],
      "explanation": "Không để các từ bổ nghĩa số nhiều đánh lừa mắt khi chủ ngữ chính là số ít."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "The quality of the products IS excellent"
      },
      {
        "id": "2",
        "formula": "Neither the manager nor the staff members WERE present"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Chủ ngữ luôn chia Động từ số ít",
        "items": [
          "The number of + Plural Noun",
          "Đại từ bất định (Everyone, Anyone, Each)",
          "Danh động từ V-ing làm chủ ngữ",
          "Tên riêng công ty, đầu sách, số tiền, thời gian"
        ],
        "note": "Ví dụ: Developing new software takes time."
      },
      "rightBox": {
        "title": "Chủ ngữ chia Động từ số nhiều",
        "items": [
          "A number of + Plural Noun",
          "N1 and N2",
          "Both A and B",
          "The + Adjective (The rich, the poor)"
        ],
        "note": "Ví dụ: A number of applicants have arrived."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy danh từ đuôi -s nhưng là số ít",
        "explanation": "News, economics, physics, politics có đuôi -s nhưng là danh từ không đếm được/môn học, động từ luôn chia số ít.",
        "wrongExample": "The economic news from Asia were very promising.",
        "rightExample": "The economic news from Asia was very promising."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The total cost of the structural renovations is estimated at two million dollars.",
        "sentenceVi": "Tổng chi phí của các hạng mục cải tạo kết cấu được ước tính khoảng hai triệu đô la.",
        "highlightRule": "Chủ ngữ chính là \"The total cost\" (số ít) nên chia động từ \"is\""
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "The quality of customer service interactions at our regional call centers _______ significantly over the past year.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "has improved",
            "inlineExplanation": "Chính xác. Chủ ngữ chính là \"The quality\" (danh từ số ít) nên động từ chia \"has improved\"."
          },
          {
            "key": "B",
            "text": "have improved",
            "inlineExplanation": "Sai. Thí sinh bị đánh lừa bởi danh từ số nhiều \"interactions\" và \"centers\" trong cụm giới từ."
          },
          {
            "key": "C",
            "text": "are improving",
            "inlineExplanation": "Sai số nhiều."
          },
          {
            "key": "D",
            "text": "were improved",
            "inlineExplanation": "Sai số nhiều."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Động từ chính của câu, chủ ngữ có cụm giới từ chen ngang \"of customer service interactions at our regional call centers\".",
          "step2_ruleApplication": {
            "text": "Bỏ qua các cụm giới từ \"of...\" và \"at...\" ➔ Chủ ngữ cốt lõi là \"The quality\" (danh từ số ít không đếm được).",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Chủ ngữ số ít đi với trợ động từ \"has\" ➔ Chọn \"has improved\".",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"has improved\"."
        },
        "recapNote": "Sự hòa hợp S-V: N_1 + of + N_2 → động từ chia theo N_1."
      },
      {
        "id": 2,
        "questionText": "Neither the department supervisor nor the factory technicians _______ able to identify the machine defect.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "was",
            "inlineExplanation": "Sai. Trong cấu trúc Neither A nor B, động từ chia theo chủ ngữ gần nhất B (the factory technicians - số nhiều)."
          },
          {
            "key": "B",
            "text": "were",
            "inlineExplanation": "Chính xác. Động từ \"were\" chia theo danh từ số nhiều \"the factory technicians\"."
          },
          {
            "key": "C",
            "text": "is",
            "inlineExplanation": "Sai số ít."
          },
          {
            "key": "D",
            "text": "has been",
            "inlineExplanation": "Sai số ít."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Động từ to be đứng sau cấu trúc \"Neither A nor B\".",
          "step2_ruleApplication": {
            "text": "Cấu trúc \"Neither A nor B\" chia động từ theo danh từ đứng sau \"nor\" (B: the factory technicians ➔ danh từ số nhiều).",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Danh từ số nhiều đi với \"were able to\".",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"were\"."
        },
        "recapNote": "Neither A nor B → Động từ chia theo B."
      }
    ]
  },
  {
    "slug": "to-infinitive-and-bare-v",
    "categorySlug": "verb-forms-and-passive",
    "categoryTitle": "3. Dạng thức Động từ & Câu Bị động",
    "title": "Động từ nguyên mẫu (To-Infinitive & Bare V)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "0-500",
    "totalQuestions": 50,
    "description": "Nắm vững các động từ theo sau bởi To-V (plan, decide, hesitate), cấu trúc V + O + to-V, và các động từ tri giác/cầu khiến đi với Bare V.",
    "goldenRule": {
      "title": "Công thức Động từ nguyên mẫu:",
      "formulas": [
        "V + to-V",
        "V + O + to-V",
        "Make / Let / Have + O + V (bare)",
        "In order to / So as to + V (bare)"
      ],
      "note": "To-infinitive thường diễn tả mục đích trong tương lai; Bare V đi sau trợ động từ khuyết thiếu hoặc động từ cầu khiến."
    },
    "quickTips": [
      "Động từ đi với to-V: hesitate, agree, decide, fail, hope, intend, plan, refuse, offer",
      "Động từ đi với O + to-V: advise, allow, remind, require, encourage, permit, instruct",
      "Gặp \"do not hesitate to _______\" ➔ 100% điền V nguyên mẫu"
    ],
    "mascotTip": "Thần chú Part 5: \"hesitate to contact\", \"strive to provide\", \"aim to improve\" ➔ Luôn là to-V!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Động từ trước",
          "action": "Xem động từ phía trước thuộc nhóm To-V hay V-ing?"
        },
        {
          "step": 2,
          "label": "Có tân ngữ không",
          "action": "Cấu trúc V + O + to-V (yêu cầu ai làm gì)"
        },
        {
          "step": 3,
          "label": "Chốt phương án",
          "action": "Chọn to-V hoặc Bare V tương ứng"
        }
      ],
      "explanation": "Ghi nhớ bảng phân loại động từ chỉ ý định, mục tiêu ➔ To-V."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "do not hesitate to CONTACT us"
      },
      {
        "id": "2",
        "formula": "remind employees TO WEAR badges"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Động từ đi với to-V",
        "items": [
          "agree, decide, hope, manage, plan, promise, refuse, strive, struggle",
          "Diễn tả hành động chưa xảy ra hoặc mục tiêu hướng tới"
        ],
        "note": "Ví dụ: We plan to expand our market."
      },
      "rightBox": {
        "title": "Động từ đi với O + to-V",
        "items": [
          "allow, enable, encourage, invite, remind, require, tell, urge, warn",
          "Chỉ sự tác động để người khác thực hiện hành động"
        ],
        "note": "Ví dụ: Remind him to bring the contract."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy chữ \"to\" là giới từ (đi với V-ing)",
        "explanation": "Cảnh giác với: look forward to, be committed to, be dedicated to, prior to, object to. Trong các cụm này, \"to\" là giới từ nên theo sau là V-ing, KHÔNG DÙNG To-V.",
        "wrongExample": "We look forward to receive your confirmation letter.",
        "rightExample": "We look forward to receiving your confirmation letter."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "Please do not hesitate to contact our technical support division should you encounter any problems.",
        "sentenceVi": "Xin vui lòng đừng ngần ngại liên hệ bộ phận hỗ trợ kỹ thuật của chúng tôi nếu bạn gặp bất kỳ vấn đề nào.",
        "highlightRule": "Động từ đi với to-V: hesitate to contact"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "The project guidelines require all researchers _______ their laboratory notebooks at the security checkpoint.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "submitting",
            "inlineExplanation": "Sai dạng V-ing."
          },
          {
            "key": "B",
            "text": "to submit",
            "inlineExplanation": "Chính xác. Cấu trúc \"require someone to do something\" (yêu cầu ai làm gì)."
          },
          {
            "key": "C",
            "text": "submit",
            "inlineExplanation": "Sai thiếu \"to\"."
          },
          {
            "key": "D",
            "text": "submitted",
            "inlineExplanation": "Sai dạng phân từ."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Đứng sau động từ \"require\" và tân ngữ chỉ người \"all researchers\".",
          "step2_ruleApplication": {
            "text": "Cấu trúc V + O + to-V: require someone to do something ➔ Bắt buộc dùng \"to submit\".",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Diễn tả quy định yêu cầu nhà nghiên cứu nộp sổ tay ghi chép.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"to submit\"."
        },
        "recapNote": "Cấu trúc: require / permit / allow + O + to-V."
      },
      {
        "id": 2,
        "questionText": "We strive _______ the most cost-effective shipping solutions for all international clients.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "provide",
            "inlineExplanation": "Sai thiếu \"to\"."
          },
          {
            "key": "B",
            "text": "to provide",
            "inlineExplanation": "Chính xác. Động từ \"strive\" (nỗ lực, phấn đấu) luôn đi với to-infinitive: strive to do something."
          },
          {
            "key": "C",
            "text": "providing",
            "inlineExplanation": "Sai dạng V-ing."
          },
          {
            "key": "D",
            "text": "provision",
            "inlineExplanation": "Sai danh từ."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Đứng sau ngoại động từ \"strive\".",
          "step2_ruleApplication": {
            "text": "Động từ \"strive\" đi với to-V: strive to do something ➔ Chọn \"to provide\".",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Nỗ lực cung cấp giải pháp vận chuyển tối ưu.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"to provide\"."
        },
        "recapNote": "Động từ theo sau bởi to-V: strive / aim / seek / attempt + to-V."
      }
    ]
  },
  {
    "slug": "gerunds-v-ing",
    "categorySlug": "verb-forms-and-passive",
    "categoryTitle": "3. Dạng thức Động từ & Câu Bị động",
    "title": "Danh động từ (Gerunds V-ing)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "0-500",
    "totalQuestions": 50,
    "description": "Quy tắc dùng danh động từ V-ing làm chủ ngữ, đứng sau giới từ và các động từ chuyên dụng (postpone, consider, avoid, recommend).",
    "goldenRule": {
      "title": "Công thức Danh động từ cốt lõi:",
      "formulas": [
        "Preposition + V-ing",
        "V + V-ing",
        "V-ing (làm chủ ngữ) → V (chia số ít)"
      ],
      "note": "Sau tất cả các giới từ (in, on, at, by, for, without, before, after) bắt buộc là V-ing hoặc Danh từ."
    },
    "quickTips": [
      "Động từ đi kèm V-ing: postpone, delay, consider, avoid, recommend, suggest, finish, mind",
      "V-ing làm chủ ngữ (Gerund subject) thì động từ chính LUÔN CHIA SỐ ÍT",
      "Phân biệt V-ing và Danh từ: V-ing có thể nhận tân ngữ danh từ phía sau, danh từ thuần túy thì không"
    ],
    "mascotTip": "Thần chú: Sau giới từ \"without / before / after\", nếu có tân ngữ phía sau thì chọn V-ing ngay!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Vị trí",
          "action": "Đứng sau giới từ, làm chủ ngữ hay sau động từ đặc biệt?"
        },
        {
          "step": 2,
          "label": "Kiểm tra tân ngữ",
          "action": "Phía sau có danh từ nhận tác động không?"
        },
        {
          "step": 3,
          "label": "Chọn dạng",
          "action": "Nếu có tân ngữ -> Chọn V-ing; Nếu không có -> Xem xét Noun"
        }
      ],
      "explanation": "V-ing vừa mang tính chất danh từ, vừa giữ đặc tính động từ để mang theo tân ngữ."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "without DISRUPTING workflow"
      },
      {
        "id": "2",
        "formula": "consider EXPANDING overseas"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Danh động từ (V-ing)",
        "items": [
          "Được theo sau bởi tân ngữ danh từ trực tiếp",
          "Không đi với mạo từ \"the/a/an\" phía trước"
        ],
        "note": "Ví dụ: inspecting the equipment"
      },
      "rightBox": {
        "title": "Danh từ thuần túy",
        "items": [
          "Được bổ nghĩa bởi tính từ phía trước",
          "Cần giới từ \"of\" nếu muốn nối với danh từ khác"
        ],
        "note": "Ví dụ: a thorough inspection of the equipment"
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy chọn Danh từ thay vì V-ing khi có tân ngữ phía sau",
        "explanation": "Thí sinh thấy chỗ trống sau giới từ liền chọn danh từ. Nhưng nếu sau chỗ trống có tân ngữ (the contract) thì bắt buộc chọn V-ing.",
        "wrongExample": "Before signature the contract, review article four.",
        "rightExample": "Before signing the contract, review article four."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The executive committee considered delaying the official product rollout until next spring.",
        "sentenceVi": "Ủy ban điều hành đã cân nhắc việc hoãn ra mắt sản phẩm chính thức cho đến mùa xuân tới.",
        "highlightRule": "Động từ đi với V-ing: considered + delaying"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "The production team minimized factory downtime by _______ the maintenance procedures during the weekend.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "conduct",
            "inlineExplanation": "Sai động từ nguyên mẫu sau giới từ."
          },
          {
            "key": "B",
            "text": "conducting",
            "inlineExplanation": "Chính xác. Sau giới từ \"by\" cần V-ing mang theo tân ngữ \"the maintenance procedures\"."
          },
          {
            "key": "C",
            "text": "conducted",
            "inlineExplanation": "Sai dạng quá khứ."
          },
          {
            "key": "D",
            "text": "conductor",
            "inlineExplanation": "Sai danh từ chỉ người."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Chỗ trống đứng sau giới từ \"by\" và trước cụm danh từ tân ngữ \"the maintenance procedures\".",
          "step2_ruleApplication": {
            "text": "Sau giới từ có tân ngữ phía sau ➔ Bắt buộc dùng Danh động từ (V-ing).",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "By + V-ing diễn tả phương thức đạt được kết quả (bằng cách thực hiện bảo trì).",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"conducting\"."
        },
        "recapNote": "Preposition + V-ing + Object (by conducting procedures)."
      },
      {
        "id": 2,
        "questionText": "_______ the corporate data center to the cloud improved overall processing efficiency significantly.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "Migrate",
            "inlineExplanation": "Sai động từ nguyên mẫu không làm chủ ngữ."
          },
          {
            "key": "B",
            "text": "Migrating",
            "inlineExplanation": "Chính xác. Danh động từ \"Migrating\" làm chủ ngữ đứng đầu câu, mang theo tân ngữ \"the corporate data center\"."
          },
          {
            "key": "C",
            "text": "Migrated",
            "inlineExplanation": "Sai phân từ."
          },
          {
            "key": "D",
            "text": "Migration",
            "inlineExplanation": "Sai. \"Migration\" là danh từ thuần túy, không nhận trực tiếp tân ngữ \"the corporate data center\" mà phải có \"of\"."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Đứng đầu câu làm chủ ngữ cho vị ngữ chính \"improved overall processing efficiency\".",
          "step2_ruleApplication": {
            "text": "Phía sau có tân ngữ danh từ \"the corporate data center\" ➔ Bắt buộc dùng Danh động từ (V-ing), không dùng danh từ thuần túy (Migration).",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "V-ing làm chủ ngữ: Migrating the data center.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"Migrating\"."
        },
        "recapNote": "V-ing làm chủ ngữ: V-ing + Object + V (main) (Migrating the center improved efficiency)."
      }
    ]
  },
  {
    "slug": "modal-verbs",
    "categorySlug": "verb-forms-and-passive",
    "categoryTitle": "3. Dạng thức Động từ & Câu Bị động",
    "title": "Động từ khuyết thiếu (Modal Verbs)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "0-500",
    "totalQuestions": 50,
    "description": "Chinh phục các động từ khuyết thiếu Can, Could, May, Might, Must, Should, cấu trúc phỏng đoán trong quá khứ Modal + have + V3/ed.",
    "goldenRule": {
      "title": "Công thức Động từ Khuyết thiếu:",
      "formulas": [
        "Modal + V (bare)",
        "Modal + be + V3/V-ed",
        "Modal + have + V3/V-ed"
      ],
      "note": "Sau tất cả các động từ khuyết thiếu (can, could, will, would, should, must, may, might) LUÔN là Động từ nguyên thể không to."
    },
    "quickTips": [
      "Must = bắt buộc; Should = nên; May/Might = có thể (khả năng xảy ra); Cannot = không thể",
      "Must have + V3/ed: chắc chắn đã xảy ra trong quá khứ (có bằng chứng cụ thể)",
      "Should have + V3/ed: lẽ ra nên làm trong quá khứ (nhưng thực tế đã không làm)"
    ],
    "mascotTip": "Thần chú: Sau can/must/should, thấy đáp án có to-V hoặc V-ing là gạch ngay tức khắc!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Nhận diện Modal",
          "action": "Tìm can, could, will, would, should, must, may"
        },
        {
          "step": 2,
          "label": "Chủ động/Bị động",
          "action": "Nếu chủ động -> V (bare); Nếu bị động -> be + V3/ed"
        },
        {
          "step": 3,
          "label": "Thời gian",
          "action": "Hiện tại/Tương lai -> V (bare); Quá khứ -> have + V3/ed"
        }
      ],
      "explanation": "Xác định cấp độ suy đoán và thời điểm của hành động."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "should contact / must submit"
      },
      {
        "id": "2",
        "formula": "should have received (lẽ ra đã phải nhận)"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Must vs Have to",
        "items": [
          "Must: mệnh lệnh xuất phát từ người nói hoặc quy tắc bắt buộc",
          "Must not: CẤM ĐOÁN tuyệt đối",
          "Do not have to: KHÔNG CẦN THIẾT (tùy chọn)"
        ],
        "note": "Ví dụ: You must wear safety goggles."
      },
      "rightBox": {
        "title": "Suy đoán quá khứ (Modal + have + V3)",
        "items": [
          "Must have V3: chắc chắn đã xảy ra",
          "Cannot have V3: không thể nào đã xảy ra",
          "Could have V3: lẽ ra có thể làm"
        ],
        "note": "Ví dụ: He must have forgotten the keys."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy nhầm lẫn giữa \"Must not\" và \"Do not have to\"",
        "explanation": "Must not mang nghĩa \"cấm tiệt\" (prohibition). Don't have to mang nghĩa \"không cần làm\" (lack of necessity).",
        "wrongExample": "Employees must not wear suits on Casual Fridays. (Nghĩa bị sai: cấm mặc)",
        "rightExample": "Employees do not have to wear suits on Casual Fridays."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "All laboratory technicians must complete safety certification before operating high-voltage equipment.",
        "sentenceVi": "Tất cả kỹ thuật viên phòng thí nghiệm phải hoàn thành chứng chỉ an toàn trước khi vận hành thiết bị điện áp cao.",
        "highlightRule": "Modal verb: must + complete (V nguyên mẫu)"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "Any employee traveling on official business _______ obtain prior written authorization from the finance department.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "must",
            "inlineExplanation": "Chính xác. Động từ khuyết thiếu \"must\" đứng trước động từ nguyên thể \"obtain\" diễn tả yêu cầu bắt buộc."
          },
          {
            "key": "B",
            "text": "has",
            "inlineExplanation": "Sai. \"has\" cần đi với \"to obtain\"."
          },
          {
            "key": "C",
            "text": "ought",
            "inlineExplanation": "Sai. \"ought\" cần đi với \"to obtain\"."
          },
          {
            "key": "D",
            "text": "is",
            "inlineExplanation": "Sai."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Đứng trước động từ nguyên mẫu không to \"obtain\".",
          "step2_ruleApplication": {
            "text": "Has và Ought bắt buộc phải có \"to\" (has to, ought to) ➔ Loại B, C.",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Động từ khuyết thiếu \"must\" đi trực tiếp với V nguyên mẫu \"obtain\" chỉ quy định bắt buộc.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"must\"."
        },
        "recapNote": "Động từ khuyết thiếu: must / should / can + V (bare)."
      },
      {
        "id": 2,
        "questionText": "Given the flawless test results, the shipment _______ have left the manufacturing warehouse on schedule.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "must",
            "inlineExplanation": "Chính xác. Cấu trúc suy đoán chắc chắn trong quá khứ có căn cứ: \"must have left\" (chắc hẳn đã xuất kho)."
          },
          {
            "key": "B",
            "text": "ought",
            "inlineExplanation": "Sai thiếu \"to\"."
          },
          {
            "key": "C",
            "text": "can",
            "inlineExplanation": "Sai. \"Can have V3\" không dùng để suy đoán khẳng định trong quá khứ."
          },
          {
            "key": "D",
            "text": "able",
            "inlineExplanation": "Sai tính từ."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Đứng trước cụm \"have left\" diễn tả sự suy đoán sự việc trong quá khứ.",
          "step2_ruleApplication": {
            "text": "Có căn cứ rõ ràng \"Given the flawless test results\" ➔ Suy đoán chắc chắn 95% ở quá khứ: \"must have + V3/ed\".",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "\"must have left\": chắc chắn đã rời kho.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"must\"."
        },
        "recapNote": "Suy đoán quá khứ: must have + V3/V-ed (chắc hẳn là đã...)."
      }
    ]
  }
];
