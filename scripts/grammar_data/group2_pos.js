module.exports = [
  {
    "slug": "nouns-and-noun-phrases",
    "categorySlug": "parts-of-speech",
    "categoryTitle": "2. Từ loại (Parts of Speech)",
    "title": "Danh từ & Cụm danh từ",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "0-500",
    "totalQuestions": 50,
    "description": "Chinh phục quy tắc cấu tạo cụm danh từ (Noun Phrase), đuôi nhận diện danh từ chỉ người/vật và các danh từ đặc biệt đuôi -al, -ive trong TOEIC Part 5 & 6.",
    "goldenRule": {
      "title": "Công thức Cụm Danh từ cốt lõi:",
      "formulas": [
        "Mạo từ / Sở hữu + (Adv) + (Adj) + Noun",
        "Noun + Noun = Danh từ ghép"
      ],
      "note": "Danh từ chính luôn đứng cuối cụm danh từ; các từ đứng trước có vai trò bổ nghĩa."
    },
    "quickTips": [
      "Đuôi danh từ chỉ vật/khái niệm: -tion, -sion, -ment, -ance, -ence, -ity, -ship",
      "Đuôi danh từ chỉ người: -er, -or, -ee, -ant (employee, applicant, supervisor)",
      "10 Danh từ đặc biệt đuôi -al, -ive: representative, initiative, alternative, proposal, approval"
    ],
    "mascotTip": "PassToeic Tip: Thấy \"sales ______\" cần điền chủ ngữ chỉ người đi với \"agreed\" -> Chọn ngay \"representative\"!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Vị trí",
          "action": "Đứng sau a/an/the, tính từ, hay làm chủ ngữ/tân ngữ?"
        },
        {
          "step": 2,
          "label": "Chỉ người hay vật",
          "action": "Xem ngữ cảnh câu cần đối tượng thực hiện hành động hay sự vật"
        },
        {
          "step": 3,
          "label": "Đếm được hay không",
          "action": "Nếu đếm được số ít bắt buộc có mạo từ hoặc -s số nhiều"
        }
      ],
      "explanation": "Phân tích từ phải sang trái trong cụm danh từ để tìm danh từ hạt nhân."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "the + (adv) + (adj) + NOUN"
      },
      {
        "id": "2",
        "formula": "sales representative / customer satisfaction"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Danh từ đếm được (Countable)",
        "items": [
          "Có dạng số ít và số nhiều (thêm -s/-es)",
          "Dạng số ít BẮT BUỘC có a/an/the hoặc tính từ sở hữu"
        ],
        "note": "Ví dụ: a report, two reports"
      },
      "rightBox": {
        "title": "Danh từ không đếm được (Uncountable)",
        "items": [
          "Không bao giờ thêm -s/-es",
          "Không đi trực tiếp với a/an"
        ],
        "note": "Bắt buộc thuộc: information, equipment, luggage, furniture, advice"
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy danh từ có đuôi tính từ (-ive, -al)",
        "explanation": "Thí sinh hay nhầm representative, initiative, alternative, proposal, approval là tính từ nên bỏ qua khi câu cần danh từ.",
        "wrongExample": "The committee unanimously voted for the newly submitted propose.",
        "rightExample": "The committee unanimously voted for the newly submitted proposal."
      },
      {
        "id": 2,
        "title": "Bẫy danh từ chỉ người vs danh từ chỉ vật",
        "explanation": "Đề thi thường cho 2 danh từ: 1 chỉ người (-er/-ee/-ant), 1 chỉ vật (-tion/-ment). Phải dựa vào động từ phía sau để chọn.",
        "wrongExample": "The attending of the conference received complimentary gift bags.",
        "rightExample": "The attendees of the conference received complimentary gift bags."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The sales representative negotiated a mutually beneficial distribution contract with the foreign supplier.",
        "sentenceVi": "Người đại diện kinh doanh đã đàm phán một hợp đồng phân phối đôi bên cùng có lợi với nhà cung cấp nước ngoài.",
        "highlightRule": "Cụm danh từ: sales representative (người đại diện bán hàng)"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "The board of directors granted final _______ for the multi-million dollar hospital expansion project.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "approve",
            "inlineExplanation": "Sai. Đây là động từ nguyên mẫu, vị trí sau tính từ \"final\" cần một Danh từ."
          },
          {
            "key": "B",
            "text": "approval",
            "inlineExplanation": "Chính xác. \"approval\" là danh từ (sự phê chuẩn) đứng sau tính từ \"final\"."
          },
          {
            "key": "C",
            "text": "approving",
            "inlineExplanation": "Sai dạng V-ing."
          },
          {
            "key": "D",
            "text": "approved",
            "inlineExplanation": "Sai dạng phân từ."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Đứng sau ngoại động từ \"granted\" và tính từ \"final\" ➔ Cần một Danh từ làm tân ngữ.",
          "step2_ruleApplication": {
            "text": "Cụm danh từ: Tính từ (final) + Danh từ (approval).",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "\"approval\" là danh từ đặc biệt kết thúc bằng đuôi -al.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"approval\"."
        },
        "recapNote": "Cụm danh từ: Adj + Noun. Đuôi danh từ -al: approval (sự phê duyệt), proposal (bản đề xuất)."
      },
      {
        "id": 2,
        "questionText": "All registered _______ should collect their conference badges from the registration desk before 8:30 AM.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "participate",
            "inlineExplanation": "Sai động từ."
          },
          {
            "key": "B",
            "text": "participants",
            "inlineExplanation": "Chính xác. Danh từ chỉ người số nhiều (những người tham dự) phù hợp với hành động \"collect badges\" và \"their\"."
          },
          {
            "key": "C",
            "text": "participation",
            "inlineExplanation": "Sai. \"participation\" là danh từ chỉ sự tham gia, không thể đi lấy thẻ đeo."
          },
          {
            "key": "D",
            "text": "participating",
            "inlineExplanation": "Sai dạng V-ing."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Chỗ trống đứng sau mạo từ lượng từ \"All\" và phân từ tính từ \"registered\" ➔ Cần Danh từ làm chủ ngữ.",
          "step2_ruleApplication": {
            "text": "Hành động \"collect badges\" (lấy thẻ đeo) và đại từ sở hữu \"their\" đòi hỏi danh từ chỉ người số nhiều.",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Chọn \"participants\" (những người tham dự), loại \"participation\" (sự tham gia).",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"participants\"."
        },
        "recapNote": "Phân biệt danh từ chỉ người (-ant, -er, -ee) và danh từ chỉ vật/khái niệm (-tion, -ment)."
      }
    ]
  },
  {
    "slug": "pronouns-reflexive-possessive",
    "categorySlug": "parts-of-speech",
    "categoryTitle": "2. Từ loại (Parts of Speech)",
    "title": "Đại từ (Pronouns: Phản thân, Sở hữu)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "0-500",
    "totalQuestions": 50,
    "description": "Chinh phục các câu hỏi về Đại từ nhân xưng, Đại từ sở hữu, Tính từ sở hữu và Đại từ phản thân (by myself/himself).",
    "goldenRule": {
      "title": "Công thức Đại từ phản thân & Sở hữu:",
      "formulas": [
        "by + oneself = on one's own",
        "Possessive Adj + N"
      ],
      "note": "Cụm \"by + đại từ phản thân\" mang nghĩa tự mình làm điều gì mà không có sự giúp đỡ."
    },
    "quickTips": [
      "Thấy \"by _____\" đứng cuối câu hoặc sau tân ngữ ➔ 95% chọn đại từ phản thân (-self/-selves)",
      "Trước một danh từ ➔ Điền Tính từ sở hữu (my, his, her, their, our)"
    ],
    "mascotTip": "Thần chú: Sau \"by\" không có danh từ ➔ quất ngay đại từ phản thân himself/herself/themselves!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Vị trí",
          "action": "Chỗ trống đứng trước danh từ hay sau giới từ by?"
        },
        {
          "step": 2,
          "label": "Chủ thể",
          "action": "Xác định chủ ngữ của câu là nam, nữ hay số nhiều"
        }
      ],
      "explanation": "Nếu nhấn mạnh tự làm một mình: by + reflexive pronoun."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "by + himself / herself / themselves"
      },
      {
        "id": "2",
        "formula": "on + his / her / their + own"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Tính từ sở hữu",
        "items": [
          "his, her, their, our, its",
          "BẮT BUỘC có danh từ đi kèm ngay phía sau"
        ],
        "note": "Ví dụ: his monthly report"
      },
      "rightBox": {
        "title": "Đại từ phản thân",
        "items": [
          "himself, herself, themselves, myself",
          "Dùng sau \"by\" hoặc để nhấn mạnh chủ ngữ"
        ],
        "note": "Ví dụ: completed the report by himself"
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy nhầm lẫn giữa \"his\" (tính từ sở hữu) và \"himself\" sau giới từ \"by\"",
        "explanation": "Sau giới từ \"by\", nếu không có danh từ đi kèm ở phía sau, ta dùng đại từ phản thân \"himself\" chứ không dùng đại từ tân ngữ \"him\" hay tính từ sở hữu \"his\".",
        "wrongExample": "Mr. Henderson completed the report entirely by him.",
        "rightExample": "Mr. Henderson completed the report entirely by himself."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "Mr. Henderson completed the quarterly financial audit report entirely by himself without hiring external auditors.",
        "sentenceVi": "Ông Henderson đã tự mình hoàn thành toàn bộ báo cáo kiểm toán tài chính hàng quý mà không cần thuê kiểm toán viên bên ngoài.",
        "highlightRule": "by himself = tự mình làm không có trợ giúp"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "Mr. Henderson completed the quarterly financial audit report entirely by _______ without hiring external auditors.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "him",
            "inlineExplanation": "Sai. Không dùng đại từ tân ngữ sau \"by\" khi chủ ngữ tự thực hiện hành động cho chính mình."
          },
          {
            "key": "B",
            "text": "himself",
            "inlineExplanation": "Chính xác. Cụm \"by himself\" diễn tả ông Henderson tự mình hoàn thành báo cáo."
          },
          {
            "key": "C",
            "text": "his",
            "inlineExplanation": "Sai. \"his\" là tính từ sở hữu, cần một danh từ theo sau."
          },
          {
            "key": "D",
            "text": "he",
            "inlineExplanation": "Sai. \"he\" là đại từ chủ ngữ, không đứng sau giới từ \"by\"."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Vị trí sau giới từ \"by\" và trước liên từ \"without\".",
          "step2_ruleApplication": {
            "text": "Cụm thành ngữ \"by + đại từ phản thân\" mang nghĩa \"tự mình làm\". Chủ ngữ là Mr. Henderson (nam giới).",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Loại \"his\" vì không có danh từ, loại \"he\" vì không thể làm bổ ngữ cho giới từ.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"himself\"."
        },
        "recapNote": "by + reflexive pronoun = tự thân làm việc gì."
      },
      {
        "id": 2,
        "questionText": "The marketing team presented _______ promotional strategy to the executive board yesterday afternoon.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "their",
            "inlineExplanation": "Chính xác. Tính từ sở hữu \"their\" bổ nghĩa cho cụm danh từ \"promotional strategy\" đứng ngay phía sau."
          },
          {
            "key": "B",
            "text": "theirs",
            "inlineExplanation": "Sai. Đại từ sở hữu \"theirs\" không đứng trước danh từ."
          },
          {
            "key": "C",
            "text": "them",
            "inlineExplanation": "Sai tân ngữ."
          },
          {
            "key": "D",
            "text": "themselves",
            "inlineExplanation": "Sai đại từ phản thân."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Chỗ trống đứng trước cụm danh từ \"promotional strategy\" ➔ Cần một Tính từ sở hữu.",
          "step2_ruleApplication": {
            "text": "Tính từ sở hữu đứng trước Noun: their + Noun. Loại đại từ sở hữu \"theirs\" vì không đi với Noun.",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Chủ ngữ là \"The marketing team\" (tập hợp người) ➔ Dùng \"their\".",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"their\"."
        },
        "recapNote": "Tính từ sở hữu: Possessive Adj + Noun (my, his, her, their, our, its)."
      }
    ]
  },
  {
    "slug": "adjectives-ing-ed",
    "categorySlug": "parts-of-speech",
    "categoryTitle": "2. Từ loại (Parts of Speech)",
    "title": "Tính từ & Đuôi -ing/-ed",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "0-500",
    "totalQuestions": 50,
    "description": "Vị trí tính từ, đuôi nhận diện tính từ, phân biệt phân từ V-ing (chủ động/tính chất) và V-ed (bị động/cảm xúc), cùng các tính từ đuôi -ly gây bẫy.",
    "goldenRule": {
      "title": "Công thức Tính từ & Phân từ:",
      "formulas": [
        "be / seem / remain / become + Adj",
        "Adj + Noun",
        "V-ing (chủ động / bản chất) vs V3/V-ed (bị động / cảm xúc)"
      ],
      "note": "Tính từ đuôi -ing miêu tả tính chất của vật/sự việc; tính từ đuôi -ed diễn tả cảm xúc hoặc trạng thái bị tác động."
    },
    "quickTips": [
      "Đuôi tính từ kinh điển: -able, -ible, -al, -ful, -less, -ive, -ous, -ic",
      "Tính từ đuôi -ly cần nhớ: friendly, timely, costly, lovely (đây là TÍNH TỪ, không phải trạng từ)",
      "Phân từ cảm xúc: exciting (thú vị) vs excited (hào hứng), interesting vs interested"
    ],
    "mascotTip": "Bẫy đề thi: \"in a timely manner\" thì \"timely\" là tính từ bổ nghĩa cho \"manner\" nhé!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Vị trí",
          "action": "Sau linking verb hay trước danh từ?"
        },
        {
          "step": 2,
          "label": "Bản chất",
          "action": "Đối tượng tự gây ra cảm xúc (V-ing) hay bị tác động (V-ed)?"
        },
        {
          "step": 3,
          "label": "Loại trừ",
          "action": "Cảnh giác tính từ đuôi -ly và cặp từ gây nhầm lẫn"
        }
      ],
      "explanation": "V-ing = Tính chất bản thể; V-ed = Trạng thái cảm thụ / bị động."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "linking verb + ADJECTIVE"
      },
      {
        "id": "2",
        "formula": "in a timely manner"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Phân từ đuôi -ing (Chủ động)",
        "items": [
          "Miêu tả bản chất của sự vật, sự việc, công việc",
          "Chủ ngữ gây ra cảm xúc cho người khác"
        ],
        "note": "Ví dụ: an exhausting task, an overwhelming demand"
      },
      "rightBox": {
        "title": "Phân từ đuôi -ed (Bị động)",
        "items": [
          "Miêu tả cảm xúc của con người",
          "Sự vật ở trạng thái đã được xử lý/hoàn thành"
        ],
        "note": "Ví dụ: I am interested, the attached file, damaged goods"
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy tính từ đuôi -ly (costly, timely)",
        "explanation": "Thí sinh thấy đuôi -ly liền tưởng là trạng từ. Tuy nhiên costly (đắt đỏ) và timely (kịp thời) là Tính từ, đứng trước danh từ.",
        "wrongExample": "The project was completed in a time manner.",
        "rightExample": "The project was completed in a timely manner."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The executive committee remained skeptical about the projected quarterly earnings report.",
        "sentenceVi": "Ủy ban điều hành vẫn hoài nghi về bản báo cáo lợi nhuận dự kiến hàng quý.",
        "highlightRule": "Tính từ sau linking verb: remained + skeptical"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "Due to severe weather disruptions, the conference organizers announced that the schedule remains _______ to change.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "subject",
            "inlineExplanation": "Chính xác. Cụm tính từ \"remains subject to change\" (có thể thay đổi) sau linking verb \"remains\"."
          },
          {
            "key": "B",
            "text": "subjectively",
            "inlineExplanation": "Sai trạng từ, sau linking verb \"remains\" cần tính từ."
          },
          {
            "key": "C",
            "text": "subjecting",
            "inlineExplanation": "Sai dạng V-ing."
          },
          {
            "key": "D",
            "text": "subjection",
            "inlineExplanation": "Sai danh từ."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Đứng sau liên động từ (linking verb) \"remains\" ➔ Cần một Tính từ.",
          "step2_ruleApplication": {
            "text": "Cụm thành ngữ TOEIC cốt lõi: \"be / remain subject to change\" (có thể thay đổi tùy tình hình).",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "\"subject\" đóng vai trò là tính từ trong cụm này.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"subject\"."
        },
        "recapNote": "Liên động từ: remain / stay / seem + Adj. Cụm: subject to change."
      },
      {
        "id": 2,
        "questionText": "Customers who received _______ merchandise are entitled to a full refund within thirty business days.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "damage",
            "inlineExplanation": "Sai động từ nguyên mẫu."
          },
          {
            "key": "B",
            "text": "damaged",
            "inlineExplanation": "Chính xác. Phân từ quá khứ V-ed mang nghĩa bị động (hàng hóa đã bị hư hại) bổ nghĩa cho danh từ \"merchandise\"."
          },
          {
            "key": "C",
            "text": "damaging",
            "inlineExplanation": "Sai. \"damaging\" mang nghĩa gây hại chủ động, không hợp nghĩa với hàng hóa bị lỗi."
          },
          {
            "key": "D",
            "text": "damages",
            "inlineExplanation": "Sai danh từ số nhiều."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Chỗ trống đứng trước danh từ \"merchandise\" (hàng hóa) ➔ Cần Tính từ bổ nghĩa.",
          "step2_ruleApplication": {
            "text": "Hàng hóa bị hư hại trong quá trình vận chuyển ➔ Dùng phân từ bị động V-ed: \"damaged merchandise\".",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Loại \"damaging\" vì mang nghĩa chủ động làm hư hại vật khác.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"damaged\"."
        },
        "recapNote": "Phân từ quá khứ làm tính từ: V3/V-ed + Noun (hành động bị tác động: damaged goods, attached document)."
      }
    ]
  },
  {
    "slug": "adverbs-and-positions",
    "categorySlug": "parts-of-speech",
    "categoryTitle": "2. Từ loại (Parts of Speech)",
    "title": "Trạng từ & Vị trí trạng từ",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "0-500",
    "totalQuestions": 50,
    "description": "Quy tắc 4 vị trí vàng của trạng từ trong đề thi TOEIC: xen giữa trợ động từ và động từ chính, đứng đầu câu, đứng cuối câu và bổ nghĩa cho tính từ.",
    "goldenRule": {
      "title": "Công thức Vị trí Vàng của Trạng từ:",
      "formulas": [
        "Auxiliary + Adv + V (main)",
        "Adv + Adj + Noun",
        "S + V + O + Adv"
      ],
      "note": "Trạng từ đuôi -ly bổ nghĩa cho Động từ, Tính từ hoặc cả câu (KHÔNG bao giờ bổ nghĩa cho Danh từ)."
    },
    "quickTips": [
      "Chỗ trống xen giữa has/have/is/will và V3/ed/V-ing ➔ 99% chọn Trạng từ (-ly)",
      "Câu đã hoàn chỉnh đầy đủ S + V + O ➔ Chỗ trống cuối câu chọn Trạng từ",
      "Đứng trước Tính từ ➔ Chọn Trạng từ để bổ nghĩa (extremely important, highly qualified)"
    ],
    "mascotTip": "Thần chú 3 giây: Thấy \"has ______ completed\", không cần dịch nghĩa, khoanh ngay đuôi -LY!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Kiểm tra câu",
          "action": "Câu đã có đầy đủ Chủ ngữ, Động từ và Tân ngữ chưa?"
        },
        {
          "step": 2,
          "label": "Kẹp giữa",
          "action": "Có nằm giữa Trợ động từ và Động từ chính không?"
        },
        {
          "step": 3,
          "label": "Chốt đáp án",
          "action": "Nếu câu đã trọn vẹn ngữ pháp -> Điền Trạng từ (-ly)"
        }
      ],
      "explanation": "Trạng từ là thành phần gia vị linh hoạt nhất trong câu tiếng Anh."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "has + ADV + completed"
      },
      {
        "id": "2",
        "formula": "highly qualified / reasonably priced"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Trạng từ chỉ mức độ",
        "items": [
          "highly, extremely, thoroughly, relatively",
          "Thường đứng trước Tính từ hoặc Phân từ"
        ],
        "note": "Ví dụ: highly recommended"
      },
      "rightBox": {
        "title": "Trạng từ chỉ cách thức",
        "items": [
          "promptly, carefully, efficiently, accurately",
          "Thường đứng sau động từ hoặc xen giữa trợ động từ"
        ],
        "note": "Ví dụ: respond promptly"
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy trạng từ không có đuôi -ly (hard, fast, late)",
        "explanation": "Các từ hard, fast, late, early vừa là tính từ vừa là trạng từ. Tuyệt đối không chọn \"hardly\" khi muốn diễn đạt chăm chỉ (hardly = hầu như không).",
        "wrongExample": "Mr. Park works hardly to meet the project deadline.",
        "rightExample": "Mr. Park works hard to meet the project deadline."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The accounting team has successfully implemented the cloud-based invoicing platform.",
        "sentenceVi": "Đội ngũ kế toán đã triển khai thành công nền tảng lập hóa đơn trên nền điện toán đám mây.",
        "highlightRule": "Trạng từ kẹp giữa: has + successfully + implemented"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "The maintenance technicians have _______ resolved the server cooling malfunction.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "successful",
            "inlineExplanation": "Sai tính từ."
          },
          {
            "key": "B",
            "text": "successfully",
            "inlineExplanation": "Chính xác. Trạng từ đuôi -ly xen giữa trợ động từ \"have\" và quá khứ phân từ \"resolved\"."
          },
          {
            "key": "C",
            "text": "success",
            "inlineExplanation": "Sai danh từ."
          },
          {
            "key": "D",
            "text": "succeed",
            "inlineExplanation": "Sai động từ."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Chỗ trống nằm xen giữa trợ động từ \"have\" và động từ chính \"resolved\".",
          "step2_ruleApplication": {
            "text": "Vị trí vàng số 1 của trạng từ: Auxiliary + ADV + Main Verb ➔ Bắt buộc chọn trạng từ đuôi -ly.",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "\"successfully\" bổ nghĩa cho hành động \"resolved\" (đã giải quyết một cách thành công).",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"successfully\"."
        },
        "recapNote": "Vị trí trạng từ: have/has + Adv + V3/V-ed."
      },
      {
        "id": 2,
        "questionText": "Customer service inquiries submitted over the weekend will be handled _______ on Monday morning.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "prompt",
            "inlineExplanation": "Sai tính từ."
          },
          {
            "key": "B",
            "text": "promptly",
            "inlineExplanation": "Chính xác. Trạng từ \"promptly\" (kịp thời, nhanh chóng) bổ nghĩa cho động từ bị động \"will be handled\"."
          },
          {
            "key": "C",
            "text": "promptness",
            "inlineExplanation": "Sai danh từ."
          },
          {
            "key": "D",
            "text": "prompter",
            "inlineExplanation": "Sai."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Đứng sau cụm động từ bị động đã trọn vẹn \"will be handled\" ➔ Cần Trạng từ bổ nghĩa cho hành động.",
          "step2_ruleApplication": {
            "text": "Bổ nghĩa cho động từ \"handled\" bằng cách thức: xử lý một cách nhanh chóng (promptly).",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Đuôi trạng từ -ly: promptly.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"promptly\"."
        },
        "recapNote": "Trạng từ cách thức đứng sau động từ: V + Adv (handle promptly, respond immediately)."
      }
    ]
  },
  {
    "slug": "articles-and-quantifiers",
    "categorySlug": "parts-of-speech",
    "categoryTitle": "2. Từ loại (Parts of Speech)",
    "title": "Mạo từ (A, An, The) & Lượng từ",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "0-500",
    "totalQuestions": 50,
    "description": "Quy tắc dùng mạo từ A/An/The và các cặp từ chỉ số lượng gây nhầm lẫn: many/much, few/little, every/each, another/other.",
    "goldenRule": {
      "title": "Công thức Mạo từ & Lượng từ cốt lõi:",
      "formulas": [
        "Every / Each + N_{số ít} → V (số ít)",
        "Many / Several / A few + N_{số nhiều}",
        "Much / A little + N_{không đếm được}"
      ],
      "note": "Lượng từ phải luôn hòa hợp với tính chất đếm được/không đếm được của danh từ đi kèm."
    },
    "quickTips": [
      "Each of / One of + the + N số nhiều ➔ ĐỘNG TỪ VẪN CHIA SỐ ÍT",
      "Another + N số ít (một cái khác); Other + N số nhiều (những cái khác)",
      "Few / Little mang nghĩa tiêu cực (gần như không có); A few / A little mang nghĩa tích cực (có một chút/vài)"
    ],
    "mascotTip": "Thần chú: \"Every\" và \"Each\" đi thẳng với danh từ số ít, cấm kỵ thêm -s vào danh từ phía sau!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Danh từ",
          "action": "Danh từ phía sau là số ít, số nhiều hay không đếm được?"
        },
        {
          "step": 2,
          "label": "Khớp lượng từ",
          "action": "Loại trừ lượng từ không tương thích"
        },
        {
          "step": 3,
          "label": "Chia động từ",
          "action": "Xác định động từ số ít hay số nhiều"
        }
      ],
      "explanation": "Kiểm tra tính đếm được của danh từ là chìa khóa 100% của bài lượng từ."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "Each + Singular Noun"
      },
      {
        "id": "2",
        "formula": "Another + Singular Noun vs Other + Plural Noun"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Đi với Danh từ đếm được số nhiều",
        "items": [
          "many, a few, few, several, both, numerous",
          "Động từ đi kèm chia số nhiều"
        ],
        "note": "Ví dụ: several candidates applied"
      },
      "rightBox": {
        "title": "Đi với Danh từ không đếm được",
        "items": [
          "much, a little, little, a great deal of, amount of",
          "Động từ đi kèm chia số ít"
        ],
        "note": "Ví dụ: much information was provided"
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy Almost vs Most vs Mostly",
        "explanation": "Almost là trạng từ (almost all employees). Most là lượng từ/tính từ (most employees). Mostly là trạng từ mang nghĩa \"chủ yếu là\".",
        "wrongExample": "Almost employees attended the annual meeting.",
        "rightExample": "Most employees / Almost all employees attended the annual meeting."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "Each applicant must present two valid forms of identification prior to entering the exam room.",
        "sentenceVi": "Mỗi thí sinh phải xuất trình hai loại giấy tờ tùy thân hợp lệ trước khi vào phòng thi.",
        "highlightRule": "Each + danh từ số ít (applicant) đi với động từ khuyết thiếu"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "_______ attendee at the global summit will receive a complimentary orientation welcome package.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "Every",
            "inlineExplanation": "Chính xác. \"Every\" đi với danh từ đếm được số ít \"attendee\" và động từ số ít."
          },
          {
            "key": "B",
            "text": "All",
            "inlineExplanation": "Sai. \"All\" phải đi với danh từ số nhiều (All attendees)."
          },
          {
            "key": "C",
            "text": "Several",
            "inlineExplanation": "Sai. \"Several\" đi với danh từ số nhiều."
          },
          {
            "key": "D",
            "text": "Many",
            "inlineExplanation": "Sai. \"Many\" đi với danh từ số nhiều."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Chỗ trống đứng trước danh từ đếm được số ít \"attendee\" (không có -s).",
          "step2_ruleApplication": {
            "text": "All, Several, Many bắt buộc đi với danh từ số nhiều ➔ Bị loại.",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "\"Every\" đi với danh từ đếm được số ít (Every attendee = mỗi người tham dự).",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"Every\"."
        },
        "recapNote": "Lượng từ: Every / Each + N_{số ít đếm được}."
      },
      {
        "id": 2,
        "questionText": "The logistics company invested _______ resources in upgrading its regional warehouse automation systems.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "substantial",
            "inlineExplanation": "Chính xác. Tính từ \"substantial\" (đáng kể) bổ nghĩa cho danh từ số nhiều \"resources\"."
          },
          {
            "key": "B",
            "text": "substantially",
            "inlineExplanation": "Sai trạng từ, cần từ bổ nghĩa cho danh từ \"resources\"."
          },
          {
            "key": "C",
            "text": "substance",
            "inlineExplanation": "Sai danh từ."
          },
          {
            "key": "D",
            "text": "substantiate",
            "inlineExplanation": "Sai động từ."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Đứng giữa ngoại động từ \"invested\" và danh từ tân ngữ \"resources\".",
          "step2_ruleApplication": {
            "text": "Cần một tính từ đứng trước để bổ nghĩa cho danh từ \"resources\" ➔ Chọn \"substantial\".",
            "eliminatedKeys": [
              "B",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Cụm từ công sở TOEIC: \"substantial resources / substantial investment\" (nguồn lực đáng kể).",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn A - \"substantial\"."
        },
        "recapNote": "Cụm danh từ: Adj + Noun (substantial resources)."
      }
    ]
  }
];
