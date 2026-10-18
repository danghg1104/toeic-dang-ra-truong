/**
 * Grammar Database TypeScript Definition & Store
 * 35 Comprehensive Grammar Topics across 8 Academic Groups
 */

export interface QuestionOption {
  key: 'A' | 'B' | 'C' | 'D';
  text: string;
  explanation: string;
}

export interface ThreeStepReasoning {
  step1: string;
  step2: string;
  step3: string;
}

export interface PracticeQuestion {
  id: number;
  part: number;
  targetTags: string[];
  level: '0-500' | '600+' | '800+';
  question: string;
  options: QuestionOption[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  threeStepReasoning: ThreeStepReasoning;
}

export interface GoldenRule {
  title: string;
  formulas: string[];
  note: string;
}

export interface MentalModelFlowStep {
  step: number;
  label: string;
  action: string;
}

export interface MentalModel {
  flowSteps: MentalModelFlowStep[];
  explanation: string;
}

export interface QuickFormula {
  id: string;
  formula: string;
}

export interface UsageBox {
  title: string;
  items: string[];
  note: string;
}

export interface UsageComparison {
  leftBox: UsageBox;
  rightBox: UsageBox;
}

export interface GrammarTrap {
  id: number;
  title: string;
  explanation: string;
  wrongExample: string;
  rightExample: string;
}

export interface GrammarExample {
  id: number;
  sentenceEn: string;
  sentenceVi: string;
  highlightRule: string;
}

export interface GrammarTopicDetail {
  slug: string;
  categorySlug: string;
  categoryTitle: string;
  title: string;
  targetTags: string[];
  level: '0-500' | '600+' | '800+';
  totalQuestions: number;
  description: string;
  goldenRule: GoldenRule;
  quickTips: string[];
  mascotTip: string;
  mentalModel: MentalModel;
  quickFormulas: QuickFormula[];
  usageComparison: UsageComparison;
  traps: GrammarTrap[];
  examples: GrammarExample[];
  questions: PracticeQuestion[];
}

export interface GrammarTopicSummary {
  slug: string;
  name: string;
  tags: string[];
  level: '0-500' | '600+' | '800+';
  totalQuestions: number;
}

export interface GrammarGroupMaster {
  id: string;
  title: string;
  badge: string;
  badgeColor: string;
  icon: string;
  description: string;
  topics: GrammarTopicSummary[];
}

export const grammarGroupsMaster: GrammarGroupMaster[] = [
  {
    "id": "verb-tenses",
    "title": "1. Thì thời gian (Verb Tenses)",
    "badge": "Trọng tâm",
    "badgeColor": "bg-indigo-50 text-indigo-600 border border-indigo-200",
    "icon": "⏳",
    "description": "Chinh phục 12 thì tiếng Anh với mô hình trục thời gian & quy tắc phối thì chuẩn xác.",
    "topics": [
      {
        "slug": "present-tenses",
        "name": "Các thì hiện tại",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "0-500",
        "totalQuestions": 50
      },
      {
        "slug": "past-tenses",
        "name": "Các thì quá khứ",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "0-500",
        "totalQuestions": 50
      },
      {
        "slug": "future-tenses",
        "name": "Các thì tương lai",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "0-500",
        "totalQuestions": 50
      },
      {
        "slug": "perfect-tenses",
        "name": "Các thì hoàn thành",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "600+",
        "totalQuestions": 50
      },
      {
        "slug": "sequence-of-tenses",
        "name": "Sự phối hợp thì (Sequence of Tenses)",
        "tags": [
          "TOEIC"
        ],
        "level": "600+",
        "totalQuestions": 50
      }
    ]
  },
  {
    "id": "parts-of-speech",
    "title": "2. Từ loại (Parts of Speech - Chiếm 35% đề thi)",
    "badge": "Chiếm 35%",
    "badgeColor": "bg-rose-50 text-rose-600 border border-rose-200",
    "icon": "🧱",
    "description": "Bản đồ vị trí & nhận diện đuôi danh từ, đại từ, tính từ, trạng từ và mạo từ trong Part 5.",
    "topics": [
      {
        "slug": "nouns-and-noun-phrases",
        "name": "Danh từ & Cụm danh từ",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "0-500",
        "totalQuestions": 50
      },
      {
        "slug": "pronouns-reflexive-possessive",
        "name": "Đại từ (Pronouns: Phản thân, Sở hữu)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "0-500",
        "totalQuestions": 50
      },
      {
        "slug": "adjectives-ing-ed",
        "name": "Tính từ & Đuôi -ing/-ed",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "0-500",
        "totalQuestions": 50
      },
      {
        "slug": "adverbs-and-positions",
        "name": "Trạng từ & Vị trí trạng từ",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "0-500",
        "totalQuestions": 50
      },
      {
        "slug": "articles-and-quantifiers",
        "name": "Mạo từ (A, An, The) & Lượng từ",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "0-500",
        "totalQuestions": 50
      }
    ]
  },
  {
    "id": "verb-forms-and-passive",
    "title": "3. Dạng thức Động từ & Câu Bị động (Verb Forms & Passive)",
    "badge": "Cốt lõi",
    "badgeColor": "bg-emerald-50 text-emerald-600 border border-emerald-200",
    "icon": "🔄",
    "description": "Làm chủ câu bị động, sự hòa hợp S-V, To-V vs Gerunds và động từ khuyết thiếu.",
    "topics": [
      {
        "slug": "passive-voice",
        "name": "Câu bị động (Passive Voice)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "600+",
        "totalQuestions": 50
      },
      {
        "slug": "subject-verb-agreement",
        "name": "Sự hòa hợp Chủ ngữ & Động từ (S-V Agreement)",
        "tags": [
          "TOEIC"
        ],
        "level": "600+",
        "totalQuestions": 50
      },
      {
        "slug": "to-infinitive-and-bare-v",
        "name": "Động từ nguyên mẫu (To-Infinitive & Bare V)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "0-500",
        "totalQuestions": 50
      },
      {
        "slug": "gerunds-v-ing",
        "name": "Danh động từ (Gerunds V-ing)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "0-500",
        "totalQuestions": 50
      },
      {
        "slug": "modal-verbs",
        "name": "Động từ khuyết thiếu (Modal Verbs)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "0-500",
        "totalQuestions": 50
      }
    ]
  },
  {
    "id": "prepositions-and-conjunctions",
    "title": "4. Giới từ & Liên từ (Prepositions & Conjunctions)",
    "badge": "Bẫy điểm",
    "badgeColor": "bg-amber-50 text-amber-600 border border-amber-200",
    "icon": "🔗",
    "description": "Phân biệt giới từ đi với Cụm từ và liên từ đi với Mệnh đề (Despite vs Although, Due to vs Because).",
    "topics": [
      {
        "slug": "prepositions-time-place",
        "name": "Giới từ chỉ thời gian & nơi chốn (in, on, at, by)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "0-500",
        "totalQuestions": 50
      },
      {
        "slug": "advanced-toeic-prepositions",
        "name": "Giới từ nâng cao TOEIC (prior to, regarding, despite)",
        "tags": [
          "TOEIC"
        ],
        "level": "600+",
        "totalQuestions": 50
      },
      {
        "slug": "coordinating-correlative-conjunctions",
        "name": "Liên từ kết hợp & Tương quan (both...and, either...or)",
        "tags": [
          "TOEIC"
        ],
        "level": "600+",
        "totalQuestions": 50
      },
      {
        "slug": "subordinating-conjunctions",
        "name": "Liên từ phụ thuộc (although, because, unless, once)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "600+",
        "totalQuestions": 50
      }
    ]
  },
  {
    "id": "clauses",
    "title": "5. Các loại Mệnh đề (Clauses)",
    "badge": "Nâng cao",
    "badgeColor": "bg-blue-50 text-blue-600 border border-blue-200",
    "icon": "📜",
    "description": "Mệnh đề quan hệ, rút gọn mệnh đề quan hệ (V-ing/V3), mệnh đề danh từ và mệnh đề trạng ngữ.",
    "topics": [
      {
        "slug": "relative-clauses",
        "name": "Mệnh đề quan hệ (Who, Whom, Which, That, Whose)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "600+",
        "totalQuestions": 50
      },
      {
        "slug": "reduced-relative-clauses",
        "name": "Rút gọn mệnh đề quan hệ (V-ing / V3-ed / To-V)",
        "tags": [
          "TOEIC"
        ],
        "level": "800+",
        "totalQuestions": 50
      },
      {
        "slug": "noun-clauses",
        "name": "Mệnh đề danh ngữ (What, Whether, That)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "600+",
        "totalQuestions": 50
      },
      {
        "slug": "adverbial-clauses",
        "name": "Mệnh đề trạng ngữ (Adverbial Clauses)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "600+",
        "totalQuestions": 50
      }
    ]
  },
  {
    "id": "comparisons-and-conditionals",
    "title": "6. So sánh & Câu điều kiện (Comparisons & Conditionals)",
    "badge": "Phân loại",
    "badgeColor": "bg-purple-50 text-purple-600 border border-purple-200",
    "icon": "⚖️",
    "description": "So sánh hơn/nhất, so sánh kép, bội số, các loại câu điều kiện và đảo ngữ điều kiện.",
    "topics": [
      {
        "slug": "comparisons-equal-higher-superlative",
        "name": "So sánh bằng, hơn & nhất (Equal, Comparative & Superlative)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "0-500",
        "totalQuestions": 48
      },
      {
        "slug": "double-comparisons-and-multiples",
        "name": "So sánh kép (The more... the more) & So sánh Bội số",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "800+",
        "totalQuestions": 40
      },
      {
        "slug": "conditional-sentences",
        "name": "Câu điều kiện loại 1, 2, 3 & Hỗn hợp (Conditionals)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "600+",
        "totalQuestions": 50
      },
      {
        "slug": "conditional-inversion",
        "name": "Đảo ngữ câu điều kiện (Should / Were / Had)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "800+",
        "totalQuestions": 42
      }
    ]
  },
  {
    "id": "special-structures",
    "title": "7. Cấu trúc Đặc biệt (Special Structures)",
    "badge": "Target 800+",
    "badgeColor": "bg-indigo-50 text-indigo-700 border border-indigo-300",
    "icon": "✨",
    "description": "Thức giả định (Subjunctive), cấu trúc cầu khiến (Causative) và cấu trúc song hành.",
    "topics": [
      {
        "slug": "subjunctive-mood",
        "name": "Thức giả định (Subjunctive Mood with Suggest, Demand, Vital)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "800+",
        "totalQuestions": 45
      },
      {
        "slug": "causative-structures",
        "name": "Cấu trúc Cầu khiến (Causative: Have/Get something done)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "600+",
        "totalQuestions": 44
      },
      {
        "slug": "inversion-and-parallelism",
        "name": "Đảo ngữ & Cấu trúc Song hành (Inversion & Parallelism)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "800+",
        "totalQuestions": 46
      }
    ]
  },
  {
    "id": "advanced-vstep-modifiers",
    "title": "8. Cấu trúc Nâng cao VSTEP & TOEIC 800+",
    "badge": "VSTEP B2-C1",
    "badgeColor": "bg-fuchsia-50 text-fuchsia-600 border border-fuchsia-200",
    "icon": "🏆",
    "description": "Câu chẻ (Cleft), đảo ngữ phủ định, mệnh đề nhượng bộ nâng cao và động từ nối (Linking Verbs).",
    "topics": [
      {
        "slug": "cleft-sentences",
        "name": "Câu chẻ nhấn mạnh (Cleft Sentences: It is... that...)",
        "tags": [
          "VSTEP",
          "TOEIC"
        ],
        "level": "800+",
        "totalQuestions": 40
      },
      {
        "slug": "negative-inversion",
        "name": "Đảo ngữ với trạng từ phủ định (Never, Seldom, Rarely, Hardly)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "800+",
        "totalQuestions": 48
      },
      {
        "slug": "concession-purpose-clauses",
        "name": "Mệnh đề Nhượng bộ & Mục đích nâng cao (Concession & Purpose)",
        "tags": [
          "VSTEP",
          "TOEIC"
        ],
        "level": "800+",
        "totalQuestions": 44
      },
      {
        "slug": "reported-speech-variants",
        "name": "Câu gián tiếp với Động từ tường thuật biến đổi (Reporting Verbs)",
        "tags": [
          "VSTEP",
          "TOEIC"
        ],
        "level": "800+",
        "totalQuestions": 42
      },
      {
        "slug": "linking-verbs",
        "name": "Động từ nối & Động từ hệ từ (Linking Verbs + Adjective)",
        "tags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "600+",
        "totalQuestions": 45
      }
    ]
  }
];

export const grammarDatabase: Record<string, GrammarTopicDetail> = {
  "present-tenses": {
    "slug": "present-tenses",
    "categorySlug": "verb-tenses",
    "categoryTitle": "1. Thì thời gian (Verb Tenses)",
    "title": "Các thì hiện tại",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "0-500",
    "totalQuestions": 50,
    "description": "Nắm vững cấu trúc, cách dùng thì Hiện tại đơn và Hiện tại tiếp diễn, phân biệt thói quen định kỳ và sự vụ tạm thời trong đề thi TOEIC & VSTEP.",
    "goldenRule": {
      "title": "Quy tắc vàng Hiện tại:",
      "formulas": [
        "S + V(s/es)",
        "S + am/is/are + V-ing"
      ],
      "note": "Hành động thói quen/định kỳ dùng Hiện tại đơn; hành động đang diễn ra tạm thời dùng Hiện tại tiếp diễn."
    },
    "quickTips": [
      "He, She, It, danh từ số ít ➔ V(s/es)",
      "We, They, danh từ số nhiều ➔ V nguyên mẫu",
      "currently, right now, at present ➔ Ưu tiên chọn Hiện tại tiếp diễn"
    ],
    "mascotTip": "Cú Đăng nhắc nhỏ: Gặp trạng từ \"routinely\" hoặc \"regularly\" thì 100% chọn Hiện tại đơn nhé!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Chủ ngữ",
          "action": "Xác định nhanh chủ ngữ số ít hay số nhiều"
        },
        {
          "step": 2,
          "label": "Bản chất",
          "action": "Phân loại: Thói quen định kỳ hay đang diễn ra tạm thời?"
        },
        {
          "step": 3,
          "label": "Khóa đáp án",
          "action": "Áp dụng quy tắc vàng và loại trừ bẫy stative verbs"
        }
      ],
      "explanation": "Tư duy cực nhanh theo flow: [Ai / Điều gì] → [Làm gì?]. Phân loại trong 3 giây: Thói quen hay hành động tạm thời?"
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "S + V(s/es)"
      },
      {
        "id": "2",
        "formula": "S + am/is/are + V-ing"
      },
      {
        "id": "3",
        "formula": "S + do/does not + V (inf)"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Hiện tại đơn (Present Simple)",
        "items": [
          "Thói quen công sở định kỳ",
          "Quy chế công ty, điều khoản hợp đồng",
          "Chân lý, lịch trình cố định"
        ],
        "note": "Dấu hiệu: usually, regularly, routinely, every week"
      },
      "rightBox": {
        "title": "Hiện tại tiếp diễn (Present Continuous)",
        "items": [
          "Hành động đang xảy ra tại thời điểm nói",
          "Dự án hoặc xu hướng đang tiến hành tạm thời",
          "Kế hoạch đã định trong tương lai gần"
        ],
        "note": "Dấu hiệu: currently, at the moment, this month"
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy Stative verbs không dùng thì tiếp diễn",
        "explanation": "Các động từ chỉ nhận thức, trạng thái, sở hữu (know, believe, belong to, contain, consist of, possess) không chia ở thì tiếp diễn trong đề thi TOEIC.",
        "wrongExample": "This confidential report is containing the fiscal audit results.",
        "rightExample": "This confidential report contains the fiscal audit results."
      },
      {
        "id": 2,
        "title": "Bẫy \"Currently\" kết hợp với chức vụ lâu dài",
        "explanation": "Khi nói về chức vụ chính thức ổn định, dù có \"currently\" vẫn chia Hiện tại đơn: \"He currently serves as VP\", không chia tiếp diễn.",
        "wrongExample": "Ms. Jenkins is currently serving as Chief Technology Officer.",
        "rightExample": "Ms. Jenkins currently serves as Chief Technology Officer."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "Mr. Tanaka usually submits his monthly expenditure reports on the first Friday of each month.",
        "sentenceVi": "Ông Tanaka thường nộp báo cáo chi tiêu hàng tháng vào thứ Sáu đầu tiên của mỗi tháng.",
        "highlightRule": "Hiện tại đơn: thói quen định kỳ với \"usually\""
      },
      {
        "id": 2,
        "sentenceEn": "The maintenance engineering team is currently conducting safety inspections on all factory elevators.",
        "sentenceVi": "Đội ngũ kỹ thuật bảo trì hiện đang tiến hành thanh tra an toàn trên toàn bộ thang máy nhà máy.",
        "highlightRule": "Hiện tại tiếp diễn: dự án đang triển khai với \"currently\""
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "The senior marketing manager routinely _______ comprehensive consumer surveys before launching any promotional campaign.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "conducts",
            "inlineExplanation": "Chính xác. Động từ thêm -s chia theo chủ ngữ số ít \"The senior marketing manager\" và trạng từ \"routinely\"."
          },
          {
            "key": "B",
            "text": "is conducting",
            "inlineExplanation": "Sai. \"routinely\" chỉ thói quen định kỳ, không dùng tiếp diễn."
          },
          {
            "key": "C",
            "text": "conducted",
            "inlineExplanation": "Sai thì quá khứ, không phù hợp với thói quen định kỳ."
          },
          {
            "key": "D",
            "text": "conduct",
            "inlineExplanation": "Sai. Chủ ngữ là ngôi thứ ba số ít, động từ phải thêm -s."
          }
        ],
        "correctAnswer": "A",
        "reasoning": {
          "step1_slotAnalysis": "Đứng sau chủ ngữ \"The senior marketing manager\" và trạng từ \"routinely\" cần động từ chính chia thì.",
          "step2_ruleApplication": {
            "text": "Trạng từ tần suất \"routinely\" (định kỳ) đòi hỏi thì Hiện tại đơn.",
            "eliminatedKeys": [
              "B",
              "C"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Chủ ngữ số ít ngôi thứ ba đòi hỏi động từ thêm \"-s\" -> loại \"conduct\".",
            "eliminatedKeys": [
              "D"
            ]
          },
          "finalConclusion": "Chọn A - \"conducts\"."
        },
        "recapNote": "Hiện tại đơn: S(số ít) + V(s/es) đi với các trạng từ tần suất routinely, regularly, usually."
      },
      {
        "id": 2,
        "questionText": "Nexis Tech _______ several software upgrades to its mobile banking platform throughout this month.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "introduces",
            "inlineExplanation": "Sai. \"throughout this month\" chỉ dự án tạm thời diễn ra trong tháng, không phải quy luật vĩnh cửu."
          },
          {
            "key": "B",
            "text": "is introducing",
            "inlineExplanation": "Chính xác. Thì Hiện tại tiếp diễn diễn tả hành động đang triển khai trong khoảng thời gian hiện tại."
          },
          {
            "key": "C",
            "text": "introduced",
            "inlineExplanation": "Sai. \"throughout this month\" chưa kết thúc, không dùng quá khứ đơn."
          },
          {
            "key": "D",
            "text": "introduce",
            "inlineExplanation": "Sai dạng chia động từ cho chủ ngữ số ít."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Vị trí vị ngữ chính của câu sau danh từ công ty \"Nexis Tech\".",
          "step2_ruleApplication": {
            "text": "Cụm trạng từ \"throughout this month\" chỉ một quá trình đang triển khai trong tháng ➔ Hiện tại tiếp diễn.",
            "eliminatedKeys": [
              "A",
              "C"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Chủ ngữ số ít đi với trợ động từ \"is\" + V-ing.",
            "eliminatedKeys": [
              "D"
            ]
          },
          "finalConclusion": "Chọn B - \"is introducing\"."
        },
        "recapNote": "Hiện tại tiếp diễn: S + am/is/are + V-ing diễn tả dự án/sự vụ tạm thời trong giai đoạn hiện hành."
      }
    ]
  },
  "past-tenses": {
    "slug": "past-tenses",
    "categorySlug": "verb-tenses",
    "categoryTitle": "1. Thì thời gian (Verb Tenses)",
    "title": "Các thì quá khứ",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "0-500",
    "totalQuestions": 50,
    "description": "Nắm vững cấu trúc, cách dùng thì Quá khứ đơn và Quá khứ tiếp diễn, phân biệt dấu hiệu ago, yesterday, last week.",
    "goldenRule": {
      "title": "Quy tắc vàng Quá khứ:",
      "formulas": [
        "S + V-ed / V2",
        "S + was/were + V-ing"
      ],
      "note": "Hành động đã chấm dứt hoàn toàn trong quá khứ và có thời gian xác định."
    },
    "quickTips": [
      "Gặp yesterday, ago, last, in + năm quá khứ ➔ Chọn ngay Quá khứ đơn",
      "Hành động đang xảy ra (quá khứ tiếp diễn) thì hành động khác chen vào (quá khứ đơn)",
      "While + was/were + V-ing, When + V-ed"
    ],
    "mascotTip": "Mẹo phòng thi: Thấy \"ago\" đứng cuối câu, lập tức khoanh ngay V-ed/V2 không cần dịch cả câu!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Thời điểm",
          "action": "Đã kết thúc trong quá khứ chưa?"
        },
        {
          "step": 2,
          "label": "Dấu hiệu",
          "action": "Tìm ago, last, yesterday, while, when"
        },
        {
          "step": 3,
          "label": "Phân loại",
          "action": "Hành động đơn lẻ hay cắt ngang đang diễn ra?"
        }
      ],
      "explanation": "Tư duy mốc thời gian đã khóa lại ở quá khứ, không còn liên quan đến hiện tại."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "S + V-ed / V2"
      },
      {
        "id": "2",
        "formula": "S + was/were not + V (inf)"
      },
      {
        "id": "3",
        "formula": "While + S + was/were + V-ing, S + V-ed"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Quá khứ đơn",
        "items": [
          "Hành động đã chấm dứt hoàn toàn",
          "Chuỗi hành động liên tiếp trong quá khứ",
          "Thói quen đã bỏ trong quá khứ"
        ],
        "note": "Dấu hiệu: yesterday, ago, in 2010, last month"
      },
      "rightBox": {
        "title": "Quá khứ tiếp diễn",
        "items": [
          "Đang xảy ra tại thời điểm cụ thể trong quá khứ",
          "Hai hành động diễn ra song song (While)",
          "Hành động đang diễn ra thì có việc khác chen vào"
        ],
        "note": "Dấu hiệu: at 8 PM yesterday, while, when"
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy \"Since\" vs \"Ago\"",
        "explanation": "Ago đi với Quá khứ đơn (two days ago). Since đi với mốc thời gian trong Hiện tại hoàn thành (since Monday). Tránh nhầm lẫn giữa hai từ này trong Part 5.",
        "wrongExample": "Mr. David has left the office two hours ago.",
        "rightExample": "Mr. David left the office two hours ago."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The courier delivered the urgent legal documents at reception yesterday at approximately 4:30 PM.",
        "sentenceVi": "Nhân viên chuyển phát đã giao các tài liệu pháp lý khẩn cấp tại quầy lễ tân vào khoảng 4:30 chiều hôm qua.",
        "highlightRule": "Quá khứ đơn: hành động xảy ra và chấm dứt tại mốc yesterday"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "The courier _______ the urgent legal documents at reception yesterday at approximately 4:30 PM.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "delivers",
            "inlineExplanation": "Sai. \"delivers\" là hiện tại đơn, câu có mốc \"yesterday\"."
          },
          {
            "key": "B",
            "text": "delivered",
            "inlineExplanation": "Chính xác. Động từ quá khứ đơn phù hợp với trạng từ \"yesterday\"."
          },
          {
            "key": "C",
            "text": "was delivered",
            "inlineExplanation": "Sai. Chủ ngữ \"courier\" (người chuyển phát) là chủ thể thực hiện hành động, không dùng bị động."
          },
          {
            "key": "D",
            "text": "has delivered",
            "inlineExplanation": "Sai. Hiện tại hoàn thành không đi với thời điểm xác định trong quá khứ (yesterday)."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Sau chủ ngữ \"The courier\" cần một động từ chính chia theo mốc thời gian.",
          "step2_ruleApplication": {
            "text": "Dấu hiệu thời gian \"yesterday\" loại bỏ thì hiện tại (delivers) và hiện tại hoàn thành (has delivered).",
            "eliminatedKeys": [
              "A",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Chủ ngữ là người thực hiện hành động giao tài liệu ➔ Dạng chủ động, loại bị động (was delivered).",
            "eliminatedKeys": [
              "C"
            ]
          },
          "finalConclusion": "Chọn B - \"delivered\"."
        },
        "recapNote": "Quá khứ đơn: S + V-ed dùng cho hành động có mốc thời gian xác định trong quá khứ (yesterday, ago, last...)."
      },
      {
        "id": 2,
        "questionText": "While the lead auditor _______ the quarterly balance sheets, the power suddenly went out in the main office.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "reviewed",
            "inlineExplanation": "Sai. Hành động đang kéo dài liên tục đi sau \"While\" phải chia tiếp diễn."
          },
          {
            "key": "B",
            "text": "was reviewing",
            "inlineExplanation": "Chính xác. Quá khứ tiếp diễn diễn tả hành động đang xảy ra thì có sự việc khác chen vào (power went out)."
          },
          {
            "key": "C",
            "text": "is reviewing",
            "inlineExplanation": "Sai. Ngữ cảnh cả câu ở quá khứ (went out), không dùng hiện tại tiếp diễn."
          },
          {
            "key": "D",
            "text": "has reviewed",
            "inlineExplanation": "Sai thì hoàn thành."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Mệnh đề phụ sau liên từ \"While\" cần động từ diễn tả hành động đang diễn ra.",
          "step2_ruleApplication": {
            "text": "Vế chính có hành động cắt ngang \"went out\" (quá khứ đơn) ➔ Mệnh đề While dùng Quá khứ tiếp diễn.",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Chủ ngữ số ít \"the lead auditor\" đi với \"was reviewing\".",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"was reviewing\"."
        },
        "recapNote": "Sự phối hợp thì: While + S + was/were + V-ing, S + V-ed."
      }
    ]
  },
  "future-tenses": {
    "slug": "future-tenses",
    "categorySlug": "verb-tenses",
    "categoryTitle": "1. Thì thời gian (Verb Tenses)",
    "title": "Các thì tương lai",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "0-500",
    "totalQuestions": 50,
    "description": "Phân biệt Will vs Be Going To, thì Tương lai tiếp diễn và quy tắc vàng không dùng will trong mệnh đề trạng ngữ chỉ thời gian.",
    "goldenRule": {
      "title": "Quy tắc vàng Tương lai:",
      "formulas": [
        "S + will + V (inf)",
        "S + am/is/are going to + V (inf)",
        "S + will be + V-ing"
      ],
      "note": "Trong mệnh đề trạng ngữ chỉ thời gian (when, as soon as, once), dùng Hiện tại đơn thay cho Tương lai đơn."
    },
    "quickTips": [
      "Gặp tomorrow, upcoming, next, soon ➔ Dấu hiệu thì tương lai",
      "Sau When, Once, As soon as, Before, After ➔ TUYỆT ĐỐI KHÔNG DÙNG WILL, dùng Hiện tại đơn",
      "Will be + V-ing diễn tả hành động đang diễn ra tại một thời điểm xác định ở tương lai"
    ],
    "mascotTip": "Bẫy đề thi kinh điển: Thấy \"As soon as Mr. Park ____\" thì chọn \"arrives\", không bao giờ chọn \"will arrive\" nhé!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Mệnh đề",
          "action": "Chỗ trống thuộc mệnh đề chính hay mệnh đề thời gian?"
        },
        {
          "step": 2,
          "label": "Dấu hiệu",
          "action": "Tìm tomorrow, next week, upcoming, as soon as"
        },
        {
          "step": 3,
          "label": "Khóa thì",
          "action": "Nếu sau liên từ thời gian -> Chọn Hiện tại; mệnh đề chính -> Chọn Will"
        }
      ],
      "explanation": "Mệnh đề phụ chỉ thời gian đã ngầm mang ý nghĩa tương lai nên không cần thêm will."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "S + will + V (inf)"
      },
      {
        "id": "2",
        "formula": "As soon as + S + V(s/es), S + will + V (inf)"
      },
      {
        "id": "3",
        "formula": "S + will be + V-ing"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Will + V (inf)",
        "items": [
          "Quyết định tức thì tại thời điểm nói",
          "Dự đoán không có bằng chứng chắc chắn",
          "Lời hứa hoặc đề nghị giúp đỡ"
        ],
        "note": "Ví dụ: I will assist you with the luggage."
      },
      "rightBox": {
        "title": "Be going to + V (inf)",
        "items": [
          "Kế hoạch đã định sẵn từ trước",
          "Dự đoán có bằng chứng cụ thể ở hiện tại"
        ],
        "note": "Ví dụ: Look at the sales figures, we are going to exceed targets."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy dùng \"will\" trong mệnh đề trạng ngữ chỉ thời gian",
        "explanation": "Đề thi TOEIC thường gài chọn \"will\" sau When, Once, As soon as. Quy tắc: Mệnh đề phụ thời gian chia Hiện tại đơn.",
        "wrongExample": "Once the shipment will arrive, we will inspect the goods.",
        "rightExample": "Once the shipment arrives, we will inspect the goods."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The board of directors will announce the new chief executive officer early next month.",
        "sentenceVi": "Ban giám đốc sẽ công bố tổng giám đốc điều hành mới vào đầu tháng tới.",
        "highlightRule": "Tương lai đơn: hành động xảy ra trong tương lai với \"next month\""
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "As soon as the factory manager _______ the safety checklist, full production will resume immediately.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "will sign",
            "inlineExplanation": "Sai. Trong mệnh đề phụ bắt đầu bằng \"As soon as\", không dùng \"will\"."
          },
          {
            "key": "B",
            "text": "signs",
            "inlineExplanation": "Chính xác. Dùng thì Hiện tại đơn trong mệnh đề thời gian để chỉ sự việc trong tương lai."
          },
          {
            "key": "C",
            "text": "signed",
            "inlineExplanation": "Sai thì quá khứ, mệnh đề chính dùng \"will resume\"."
          },
          {
            "key": "D",
            "text": "signing",
            "inlineExplanation": "Sai dạng V-ing không làm động từ chính."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Chỗ trống là vị ngữ trong mệnh đề trạng ngữ chỉ thời gian bắt đầu bằng \"As soon as\".",
          "step2_ruleApplication": {
            "text": "Mệnh đề trạng ngữ chỉ thời gian dùng Hiện tại đơn thay cho Tương lai đơn ➔ Loại bỏ \"will sign\".",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Chủ ngữ \"the factory manager\" là ngôi thứ 3 số ít ➔ Động từ thêm \"-s\" (signs).",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"signs\"."
        },
        "recapNote": "Mệnh đề trạng ngữ thời gian: As soon as / Once / When + S + V(s/es), S + will + V (bare)."
      },
      {
        "id": 2,
        "questionText": "Next Wednesday at 10:00 AM, the vice president _______ the keynote address at the international technology expo.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "delivered",
            "inlineExplanation": "Sai thì quá khứ, mốc thời gian là \"Next Wednesday\"."
          },
          {
            "key": "B",
            "text": "will be delivering",
            "inlineExplanation": "Chính xác. Tương lai tiếp diễn diễn tả hành động đang diễn ra tại mốc thời gian cụ thể trong tương lai (Next Wednesday at 10:00 AM)."
          },
          {
            "key": "C",
            "text": "has delivered",
            "inlineExplanation": "Sai thì hiện tại hoàn thành."
          },
          {
            "key": "D",
            "text": "is delivered",
            "inlineExplanation": "Sai bị động."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Vị ngữ sau chủ ngữ \"the vice president\" kèm thời điểm cụ thể \"Next Wednesday at 10:00 AM\".",
          "step2_ruleApplication": {
            "text": "Có mốc thời gian xác định trong tương lai ➔ Dùng thì Tương lai tiếp diễn: will be + V-ing.",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Chủ động phát biểu bài phát biểu chủ đạo (the keynote address).",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"will be delivering\"."
        },
        "recapNote": "Tương lai tiếp diễn: S + will be + V-ing diễn tả hành động đang xảy ra tại thời điểm cụ thể ở tương lai."
      }
    ]
  },
  "perfect-tenses": {
    "slug": "perfect-tenses",
    "categorySlug": "verb-tenses",
    "categoryTitle": "1. Thì thời gian (Verb Tenses)",
    "title": "Các thì hoàn thành",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "600+",
    "totalQuestions": 50,
    "description": "Chinh phục Hiện tại hoàn thành, Quá khứ hoàn thành và Tương lai hoàn thành; làm chủ cặp dấu hiệu since/for và by the time.",
    "goldenRule": {
      "title": "Quy tắc vàng Các thì Hoàn thành:",
      "formulas": [
        "S + have/has + V3/V-ed",
        "S + had + V3/V-ed",
        "S + will have + V3/V-ed"
      ],
      "note": "Hoàn thành diễn tả hành động xảy ra trước một mốc thời gian hoặc kéo dài liên tục đến mốc đó."
    },
    "quickTips": [
      "Since + mốc thời gian, For + khoảng thời gian ➔ Hiện tại hoàn thành",
      "By the time + Quá khứ đơn ➔ Mệnh đề chính chia Quá khứ hoàn thành (had + V3/ed)",
      "By the time / By next month ➔ Mệnh đề chính chia Tương lai hoàn thành (will have + V3/ed)"
    ],
    "mascotTip": "Công thức 5 giây: By the time + V(s/es) thì vế kia chọn \"will have V3/ed\"; By the time + V-ed thì vế kia chọn \"had V3/ed\"!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Mốc so sánh",
          "action": "Xác định mốc đối chiếu: Quá khứ hay Tương lai?"
        },
        {
          "step": 2,
          "label": "Dấu hiệu",
          "action": "Tìm By, By the time, Already, Yet, Since, For"
        },
        {
          "step": 3,
          "label": "Chọn thì",
          "action": "Trước Quá khứ -> QKHT; Trước Tương lai -> TLHT"
        }
      ],
      "explanation": "Thì hoàn thành luôn là \"cây cầu thời gian\" nối từ điểm xuất phát tới mốc đối chiếu."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "S + have/has + V3/V-ed"
      },
      {
        "id": "2",
        "formula": "By the time + S + V-ed, S + had + V3/V-ed"
      },
      {
        "id": "3",
        "formula": "By + mốc tương lai, S + will have + V3/V-ed"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Quá khứ hoàn thành (Had + V3/ed)",
        "items": [
          "Hành động xảy ra trước một hành động quá khứ khác",
          "Đứng trong cấu trúc By the time + Quá khứ"
        ],
        "note": "Ví dụ: The meeting had ended before he arrived."
      },
      "rightBox": {
        "title": "Tương lai hoàn thành (Will have + V3/ed)",
        "items": [
          "Hành động sẽ hoàn thành trước một mốc thời gian ở tương lai",
          "Đứng trong cấu trúc By the time + Hiện tại"
        ],
        "note": "Ví dụ: By 2030, we will have expanded to 10 countries."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy \"By the time\" với thì Hiện tại và Quá khứ",
        "explanation": "Nhầm lẫn thì của mệnh đề sau By the time: Nếu là V-ed thì mệnh đề chính là Had + V3/ed; Nếu là V(s/es) thì mệnh đề chính là Will have + V3/ed.",
        "wrongExample": "By the time she retired last year, she will have worked here for 30 years.",
        "rightExample": "By the time she retired last year, she had worked here for 30 years."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "Our company has developed cutting-edge green technologies since its founding in 2015.",
        "sentenceVi": "Công ty chúng tôi đã phát triển các công nghệ xanh tiên tiến kể từ khi thành lập vào năm 2015.",
        "highlightRule": "Hiện tại hoàn thành: bắt đầu từ 2015 và kéo dài đến nay"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "By the time the new CEO assumed office last week, the restructuring committee _______ the financial audit.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "completes",
            "inlineExplanation": "Sai thì hiện tại."
          },
          {
            "key": "B",
            "text": "had completed",
            "inlineExplanation": "Chính xác. Hành động kiểm toán hoàn thành trước mốc quá khứ \"assumed office\" ➔ Quá khứ hoàn thành."
          },
          {
            "key": "C",
            "text": "will complete",
            "inlineExplanation": "Sai thì tương lai."
          },
          {
            "key": "D",
            "text": "is completing",
            "inlineExplanation": "Sai thì tiếp diễn."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Mệnh đề chính sau liên từ chỉ thời gian \"By the time the new CEO assumed office last week\".",
          "step2_ruleApplication": {
            "text": "Mệnh đề phụ ở quá khứ đơn (assumed) ➔ Mệnh đề chính diễn tả hành động xảy ra trước đó, bắt buộc dùng Quá khứ hoàn thành (had + V3/ed).",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Cấu trúc: By the time + S + V2/ed, S + had + V3/ed.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"had completed\"."
        },
        "recapNote": "Quá khứ hoàn thành: By the time + S + V-ed, S + had + V3/V-ed."
      },
      {
        "id": 2,
        "questionText": "By the end of the next fiscal quarter, our manufacturing team _______ more than 500,000 electric vehicle batteries.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "produced",
            "inlineExplanation": "Sai thì quá khứ đơn."
          },
          {
            "key": "B",
            "text": "will have produced",
            "inlineExplanation": "Chính xác. \"By the end of next fiscal quarter\" là mốc thời gian tương lai ➔ Dùng Tương lai hoàn thành (will have + V3/ed)."
          },
          {
            "key": "C",
            "text": "has produced",
            "inlineExplanation": "Sai thì hiện tại hoàn thành."
          },
          {
            "key": "D",
            "text": "is producing",
            "inlineExplanation": "Sai thì tiếp diễn."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Vị ngữ của câu có mốc thời gian hoàn tất ở tương lai: \"By the end of the next fiscal quarter\".",
          "step2_ruleApplication": {
            "text": "Cấu trúc \"By + mốc tương lai\" đòi hỏi thì Tương lai hoàn thành (will have + V3/ed).",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Nhấn mạnh sự hoàn tất mục tiêu sản lượng trước thời hạn quý tới.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"will have produced\"."
        },
        "recapNote": "Tương lai hoàn thành: By + mốc tương lai, S + will have + V3/V-ed."
      }
    ]
  },
  "sequence-of-tenses": {
    "slug": "sequence-of-tenses",
    "categorySlug": "verb-tenses",
    "categoryTitle": "1. Thì thời gian (Verb Tenses)",
    "title": "Sự phối hợp thì (Sequence of Tenses)",
    "targetTags": [
      "TOEIC"
    ],
    "level": "600+",
    "totalQuestions": 50,
    "description": "Quy tắc lùi thì trong câu phức, câu tường thuật và sự ăn khớp thời gian giữa mệnh đề chính và mệnh đề phụ.",
    "goldenRule": {
      "title": "Quy tắc vàng Sự phối hợp thì:",
      "formulas": [
        "Main Clause (Quá khứ) → Sub Clause lùi thì quá khứ",
        "Since + S + V-ed, S + have/has + V3/V-ed"
      ],
      "note": "Khi mệnh đề chính ở thì Quá khứ, động từ trong mệnh đề phụ bắt buộc phải lùi về các thì quá khứ tương ứng."
    },
    "quickTips": [
      "Mệnh đề chính dùng \"said / announced / confirmed\" ➔ Mệnh đề \"that\" phải lùi thì (was/were, had V3, would)",
      "Since + Quá khứ đơn, Mệnh đề chính Hiện tại hoàn thành",
      "After + Quá khứ hoàn thành, Quá khứ đơn; Before + Quá khứ đơn, Quá khứ hoàn thành"
    ],
    "mascotTip": "Thần chú: Mệnh đề chính đã Quá khứ thì mệnh đề phụ cấm kỵ dùng Hiện tại đơn hoặc Will!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Mệnh đề chính",
          "action": "Xem động từ chính chia ở Hiện tại hay Quá khứ?"
        },
        {
          "step": 2,
          "label": "Mối quan hệ",
          "action": "Hành động phụ xảy ra trước, cùng lúc hay sau động từ chính?"
        },
        {
          "step": 3,
          "label": "Lùi thì",
          "action": "Khóa động từ phụ tương thích với dòng thời gian của mệnh đề chính"
        }
      ],
      "explanation": "Đảm bảo tính logic của dòng thời gian câu văn trong tiếng Anh."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "S + announced that + S + had + V3/V-ed"
      },
      {
        "id": "2",
        "formula": "S + confirmed that + S + would + V (inf)"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Mệnh đề chính Hiện tại",
        "items": [
          "Động từ phụ giữ nguyên thì thực tế",
          "Có thể chia hiện tại, quá khứ hoặc tương lai"
        ],
        "note": "Ví dụ: He says that he will come."
      },
      "rightBox": {
        "title": "Mệnh đề chính Quá khứ",
        "items": [
          "Động từ phụ bắt buộc lùi thì",
          "Hiện tại -> Quá khứ đơn; Tương lai (will) -> would; Quá khứ -> Quá khứ hoàn thành"
        ],
        "note": "Ví dụ: He said that he would come."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy giữ nguyên \"will\" sau động từ tường thuật quá khứ",
        "explanation": "Khi mệnh đề chính là \"reported / announced\", mệnh đề that không được dùng \"will\" mà phải lùi thành \"would\".",
        "wrongExample": "The spokesperson confirmed that profits will increase by 10%.",
        "rightExample": "The spokesperson confirmed that profits would increase by 10%."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The auditor reported that the discrepancy had occurred during the previous inventory transfer.",
        "sentenceVi": "Kiểm toán viên báo cáo rằng sự sai lệch đã xảy ra trong đợt chuyển hàng tồn kho trước đó.",
        "highlightRule": "Sự phối hợp thì: reported (quá khứ) đi với had occurred (xảy ra trước đó)"
      }
    ],
    "questions": [
      {
        "id": 1,
        "questionText": "The project director confirmed yesterday that the software update _______ launched by the end of this month.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "will be",
            "inlineExplanation": "Sai. Mệnh đề chính có động từ quá khứ \"confirmed yesterday\", phải lùi thì \"will\" thành \"would\"."
          },
          {
            "key": "B",
            "text": "would be",
            "inlineExplanation": "Chính xác. Động từ \"would be\" là dạng lùi thì hợp chuẩn của \"will be\" sau động từ quá khứ \"confirmed\"."
          },
          {
            "key": "C",
            "text": "is",
            "inlineExplanation": "Sai thì hiện tại."
          },
          {
            "key": "D",
            "text": "has been",
            "inlineExplanation": "Sai thì hoàn thành."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Động từ trong mệnh đề danh ngữ \"that...\" phụ thuộc vào động từ chính \"confirmed yesterday\".",
          "step2_ruleApplication": {
            "text": "Động từ chính ở quá khứ đơn (confirmed) ➔ Quy tắc phối hợp thì bắt buộc lùi \"will\" thành \"would\".",
            "eliminatedKeys": [
              "A",
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Dạng bị động: would be launched.",
            "eliminatedKeys": []
          },
          "finalConclusion": "Chọn B - \"would be\"."
        },
        "recapNote": "Phối hợp thì: S + V (quá khứ) + that + S + would + V (bare)."
      },
      {
        "id": 2,
        "questionText": "Ever since Ms. Davies _______ as chief operating officer, corporate revenues have surged dramatically.",
        "instruction": "CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU",
        "options": [
          {
            "key": "A",
            "text": "appointed",
            "inlineExplanation": "Sai dạng chủ động, Ms. Davies phải được bổ nhiệm (bị động)."
          },
          {
            "key": "B",
            "text": "was appointed",
            "inlineExplanation": "Chính xác. Sau \"since\" dùng thì Quá khứ đơn bị động, vế chính dùng Hiện tại hoàn thành \"have surged\"."
          },
          {
            "key": "C",
            "text": "has been appointed",
            "inlineExplanation": "Sai. Sau \"since\" dùng mốc thời gian quá khứ đơn, không dùng hiện tại hoàn thành."
          },
          {
            "key": "D",
            "text": "appoints",
            "inlineExplanation": "Sai thì hiện tại đơn."
          }
        ],
        "correctAnswer": "B",
        "reasoning": {
          "step1_slotAnalysis": "Mệnh đề sau liên từ thời gian \"Ever since...\".",
          "step2_ruleApplication": {
            "text": "Cấu trúc phối hợp thì: Ever since + S + Quá khứ đơn, S + Hiện tại hoàn thành.",
            "eliminatedKeys": [
              "C",
              "D"
            ]
          },
          "step3_grammaticalClue": {
            "text": "Chủ ngữ Ms. Davies được bổ nhiệm làm COO ➔ Bị động quá khứ đơn \"was appointed\".",
            "eliminatedKeys": [
              "A"
            ]
          },
          "finalConclusion": "Chọn B - \"was appointed\"."
        },
        "recapNote": "Phối hợp thì với Since: Since + S + V-ed / was-were PII, S + have/has + V3/V-ed."
      }
    ]
  },
  "nouns-and-noun-phrases": {
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
  "pronouns-reflexive-possessive": {
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
  "adjectives-ing-ed": {
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
  "adverbs-and-positions": {
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
  "articles-and-quantifiers": {
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
  },
  "passive-voice": {
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
  "subject-verb-agreement": {
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
  "to-infinitive-and-bare-v": {
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
  "gerunds-v-ing": {
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
  "modal-verbs": {
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
  },
  "prepositions-time-place": {
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
  "advanced-toeic-prepositions": {
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
  "coordinating-correlative-conjunctions": {
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
  "subordinating-conjunctions": {
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
  },
  "relative-clauses": {
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
  "reduced-relative-clauses": {
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
  "noun-clauses": {
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
  "adverbial-clauses": {
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
  },
  "comparisons-equal-higher-superlative": {
    "slug": "comparisons-equal-higher-superlative",
    "categorySlug": "comparisons-and-conditionals",
    "categoryTitle": "6. So sánh & Câu điều kiện (Comparisons & Conditionals)",
    "title": "So sánh bằng, hơn & nhất (Equal, Comparative & Superlative)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "0-500",
    "totalQuestions": 48,
    "description": "Nắm vững cấu trúc so sánh bằng (as...as), so sánh hơn (-er / more than), so sánh nhất (-est / most) của tính từ và trạng từ, cùng các từ nhấn mạnh so sánh kinh điển trong đề thi.",
    "goldenRule": {
      "title": "Công thức So sánh Cốt lõi:",
      "formulas": [
        "Bằng: S_1 + V + as + adj/adv + as + S_2",
        "Hơn: S_1 + V + adj/adv-er / more + adj/adv + than + S_2",
        "Nhất: S + V + the + adj/adv-est / the most + adj/adv + (of / in / among)"
      ],
      "note": "Các từ nhấn mạnh so sánh hơn hay xuất hiện trong TOEIC: much, far, significantly, substantially, considerably, slightly, a bit."
    },
    "quickTips": [
      "Gặp \"than\" ở phía sau ➔ 100% chọn dạng so sánh hơn (tính từ ngắn đuôi -er hoặc more + tính từ dài)",
      "Gặp \"the\" ở phía trước và cụm \"of the three / in the company\" ➔ chọn so sánh nhất",
      "Đứng giữa as...as là tính từ/trạng từ ở DẠNG NGUYÊN BẢN (tuyệt đối không thêm -er hay more)"
    ],
    "mascotTip": "Thần chú bẫy TOEIC: Phía sau có THAN mà phía trước chỗ trống đã có MORE rồi thì KHÔNG chọn đuôi -er nữa (tránh lỗi lặp kép more better/more easier)!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Dấu hiệu từ nối",
          "action": "Tìm kiếm \"than\" (so sánh hơn), \"as...as\" (so sánh bằng), hay \"the...in/of\" (so sánh nhất)."
        },
        {
          "step": 2,
          "label": "Độ dài tính từ/trạng từ",
          "action": "Tính từ ngắn (1 âm tiết) thêm đuôi -er/-est; tính từ dài (>= 2 âm tiết) dùng more/most."
        },
        {
          "step": 3,
          "label": "Từ nhấn mạnh",
          "action": "Nếu có chỗ trống đứng trước so sánh hơn, tìm các trạng từ tăng cường (much, significantly, far)."
        }
      ],
      "explanation": "So sánh thể hiện mức độ tương quan giữa 2 hoặc nhiều đối tượng, căn cứ vào từ nối và độ dài từ để quyết định hình thái."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "much / significantly MORE expensive THAN"
      },
      {
        "id": "2",
        "formula": "the MOST efficient employee in the department"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "So sánh Hơn (Comparative)",
        "items": [
          "Dùng để đối chiếu giữa 2 người, vật hoặc nhóm",
          "Bắt buộc có \"than\" khi nêu rõ đối tượng thứ hai",
          "Nhấn mạnh bằng: much, far, significantly, considerably"
        ],
        "note": "Ví dụ: This software is much more reliable than the old version."
      },
      "rightBox": {
        "title": "So sánh Nhất (Superlative)",
        "items": [
          "Dùng để chỉ đối tượng vượt trội trong nhóm từ 3 trở lên",
          "Bắt buộc có \"the\" đứng trước tính từ/trạng từ",
          "Đi kèm cụm giới từ: in + nơi chốn, of/among + tập hợp"
        ],
        "note": "Ví dụ: Ms. Kim is the most experienced engineer on our team."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy dùng so sánh nhất khi chỉ có 2 đối tượng",
        "explanation": "Khi trong câu chỉ có 2 đối tượng (between the two options, of the two candidates), đề thi bắt buộc dùng SO SÁNH HƠN với mạo từ \"the\": the + comparative + of the two.",
        "wrongExample": "Between the two applicants, Mr. Davis is the best qualified.",
        "rightExample": "Between the two applicants, Mr. Davis is the better qualified."
      },
      {
        "id": 2,
        "title": "Bẫy trạng từ bổ nghĩa cho so sánh hơn",
        "explanation": "Các trạng từ như very, so, too KHÔNG được bổ nghĩa trực tiếp cho tính từ so sánh hơn. Chỉ dùng much, far, slightly, significantly, substantially.",
        "wrongExample": "The quarterly profit was very higher than projected.",
        "rightExample": "The quarterly profit was significantly higher than projected."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The new logistics route is substantially faster and more economical than the standard overland transport.",
        "sentenceVi": "Tuyến đường vận chuyển mới nhanh hơn và tiết kiệm chi phí hơn đáng kể so với phương thức vận tải đường bộ tiêu chuẩn.",
        "highlightRule": "Nhấn mạnh so sánh hơn: substantially faster and more economical than..."
      },
      {
        "id": 2,
        "sentenceEn": "Among all the candidates interviewed this morning, Ms. Torres presented the most comprehensive strategy.",
        "sentenceVi": "Trong số tất cả các ứng viên được phỏng vấn sáng nay, cô Torres đã trình bày chiến lược toàn diện nhất.",
        "highlightRule": "So sánh nhất trong tập đoàn/nhóm: Among all... the most comprehensive strategy."
      }
    ],
    "questions": [
      {
        "id": 1,
        "part": 5,
        "targetTags": [
          "TOEIC"
        ],
        "level": "0-500",
        "question": "Sales of our premium line were _______ higher this quarter than industry analysts had initially projected.",
        "options": [
          {
            "key": "A",
            "text": "significantly",
            "explanation": "Chính xác! Trạng từ \"significantly\" (đáng kể) dùng để bổ nghĩa, nhấn mạnh cho tính từ so sánh hơn \"higher than\"."
          },
          {
            "key": "B",
            "text": "very",
            "explanation": "Sai. \"Very\" không bổ nghĩa trực tiếp cho tính từ so sánh hơn (không nói very higher, phải dùng much/far/significantly higher)."
          },
          {
            "key": "C",
            "text": "more",
            "explanation": "Sai. \"Higher\" đã là dạng so sánh hơn của high, nếu thêm \"more\" sẽ tạo ra lỗi lặp kép (double comparative)."
          },
          {
            "key": "D",
            "text": "too",
            "explanation": "Sai. \"Too\" chỉ dùng trong cấu trúc \"too... to V\" hoặc bổ nghĩa tính từ nguyên mẫu, không bổ nghĩa so sánh hơn."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Nhấn mạnh tính từ so sánh hơn \"higher\", cần trạng từ như significantly, substantially, much, far.",
        "threeStepReasoning": {
          "step1": "Phân tích cấu trúc: Chỗ trống đứng trước tính từ so sánh hơn \"higher\" và liên từ \"than\".",
          "step2": "Nhận diện quy tắc: Cần một trạng từ tăng cường mức độ cho so sánh hơn. Chỉ có các từ much, far, significantly, considerably phù hợp.",
          "step3": "Loại trừ: Loại B (\"very\") vì không đi với comparative; loại C (\"more\") vì gây lặp kép; loại D (\"too\") sai ngữ pháp. Chọn A (significantly)."
        }
      },
      {
        "id": 2,
        "part": 5,
        "targetTags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "600+",
        "question": "Of the two proposed marketing initiatives, the committee concluded that the social media campaign is the _______ choice.",
        "options": [
          {
            "key": "A",
            "text": "most practical",
            "explanation": "Sai. Câu chỉ so sánh giữa 2 kế hoạch (\"of the two\"), không được dùng so sánh nhất."
          },
          {
            "key": "B",
            "text": "more practical",
            "explanation": "Chính xác! Cấu trúc so sánh giữa hai đối tượng: \"the + comparative + of the two\" (chọn cái thực tế hơn trong số hai cái)."
          },
          {
            "key": "C",
            "text": "practically",
            "explanation": "Sai. Vị trí sau mạo từ \"the\" và trước danh từ \"choice\" cần một tính từ bổ nghĩa."
          },
          {
            "key": "D",
            "text": "as practical",
            "explanation": "Sai. Cấu trúc so sánh bằng cần \"as...as\", không đi kèm với mạo từ \"the\" đứng trước danh từ theo dạng này."
          }
        ],
        "correctAnswer": "B",
        "explanation": "Khi câu xác định phạm vi chỉ có 2 đối tượng (\"Of the two...\"), bắt buộc dùng \"the + comparative\" chứ không dùng superlative.",
        "threeStepReasoning": {
          "step1": "Quan sát cụm từ chỉ phạm vi đầu câu: \"Of the two proposed marketing initiatives\" ➔ Chỉ có 2 đối tượng được so sánh.",
          "step2": "Áp dụng quy tắc đặc biệt: So sánh 2 đối tượng sử dụng cấu trúc \"the + comparative + N\".",
          "step3": "Kết luận: \"more practical\" là dạng so sánh hơn phù hợp nhất để bổ nghĩa cho \"choice\". Chọn B."
        }
      }
    ]
  },
  "double-comparisons-and-multiples": {
    "slug": "double-comparisons-and-multiples",
    "categorySlug": "comparisons-and-conditionals",
    "categoryTitle": "6. So sánh & Câu điều kiện (Comparisons & Conditionals)",
    "title": "So sánh kép (The more... the more) & So sánh Bội số",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "800+",
    "totalQuestions": 40,
    "description": "Chinh phục cấu trúc so sánh kép chỉ sự đồng tiến (Càng... càng...) và so sánh bội số (gấp 2, gấp 3 lần), các bẫy đảo ngữ và sai cấu trúc liên từ.",
    "goldenRule": {
      "title": "Công thức So sánh Kép & Bội số:",
      "formulas": [
        "So sánh kép: The + comparative + S + V, the + comparative + S + V",
        "Bội số: S + V + multiple (twice / 3 times) + as + adj/adv/N + as + S_2"
      ],
      "note": "Riêng gấp đôi dùng \"twice\", không dùng \"two times\". Với cấu trúc bội số, dạng chuẩn học thuật là multiple + as...as."
    },
    "quickTips": [
      "Vế 1 bắt đầu bằng \"The + more/comparative\" thì vế 2 cũng bắt buộc phải bắt đầu bằng \"The + comparative\"",
      "Sau bội số (twice, three times, four times) dùng cấu trúc \"as much/many... as\"",
      "So sánh càng ngày càng: \"more and more + adj dài\" hoặc \"adj-er and adj-er\""
    ],
    "mascotTip": "Thần chú bẫy điểm 800+: Thấy \"The sooner you complete the audit, _______ the report will be approved\" ➔ Vế sau chắc chắn phải có \"the + so sánh hơn\" (the faster / the more likely)!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Nhận diện mẫu so sánh",
          "action": "Phát hiện câu có 2 mệnh đề bắt đầu bằng mạo từ \"The\" hoặc có từ chỉ bội số (twice, three times)."
        },
        {
          "step": 2,
          "label": "Kiểm tra tính đối xứng",
          "action": "Cả 2 vế trong so sánh kép phải đồng dạng: The + so sánh hơn + S + V."
        },
        {
          "step": 3,
          "label": "Lựa chọn từ loại",
          "action": "Xác định từ đứng sau comparative là tính từ, trạng từ hay danh từ để chọn từ loại phù hợp."
        }
      ],
      "explanation": "So sánh kép thể hiện mối quan hệ nhân quả tương hỗ tỉ lệ thuận hoặc nghịch giữa 2 hành động/trạng thái."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "THE MORE experienced the staff, THE HIGHER the productivity"
      },
      {
        "id": "2",
        "formula": "generated TWICE AS MUCH revenue AS last year"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "So sánh Kép (The more... the more)",
        "items": [
          "Mỗi vế đều bắt đầu bằng THE + tính từ/trạng từ so sánh hơn",
          "Diễn đạt ý \"càng... thì càng...\"",
          "Động từ to be ở cuối vế có thể được lược bỏ trong văn phong trang trọng"
        ],
        "note": "Ví dụ: The more you practice, the more confident you become."
      },
      "rightBox": {
        "title": "So sánh Bội số (Multiple Comparisons)",
        "items": [
          "Từ chỉ số lần: half, twice, three times, four times...",
          "Theo sau bởi: as + much/many (+ N) + as",
          "Tránh dùng \"twice more than\" trong văn viết học thuật"
        ],
        "note": "Ví dụ: The new server processes data three times as fast as the previous model."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy thiếu \"the\" ở vế thứ hai của so sánh kép",
        "explanation": "Đề thi thường đưa ra các phương án ở vế hai chỉ có so sánh hơn mà thiếu mất mạo từ \"the\" (ví dụ: faster the report will be thay vì the faster the report will be).",
        "wrongExample": "The more efficiently we work, sooner the project will finish.",
        "rightExample": "The more efficiently we work, the sooner the project will finish."
      },
      {
        "id": 2,
        "title": "Bẫy dùng \"than\" sau bội số",
        "explanation": "Sau \"twice / three times\", cấu trúc chuẩn theo ngữ pháp TOEIC/VSTEP là \"as... as\", không dùng \"than\" trừ khi là \"times more than\" trong một số ngữ cảnh phi trang trọng.",
        "wrongExample": "The factory produced twice more vehicles than last quarter.",
        "rightExample": "The factory produced twice as many vehicles as last quarter."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The more thoroughly the contract is reviewed, the less likely the firm is to face legal disputes.",
        "sentenceVi": "Hợp đồng càng được rà soát kỹ lưỡng bao nhiêu, công ty càng ít có nguy cơ đối mặt với tranh chấp pháp lý bấy nhiêu.",
        "highlightRule": "So sánh kép: The more thoroughly... the less likely..."
      },
      {
        "id": 2,
        "sentenceEn": "Our overseas branch generated nearly three times as much profit as the domestic headquarters this fiscal year.",
        "sentenceVi": "Chi nhánh nước ngoài của chúng tôi đã tạo ra lợi nhuận gần gấp ba lần so với trụ sở chính trong nước trong năm tài chính này.",
        "highlightRule": "So sánh bội số: three times as much profit as..."
      }
    ],
    "questions": [
      {
        "id": 1,
        "part": 5,
        "targetTags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "800+",
        "question": "The more clearly instructions are outlined in the user manual, _______ customer complaints the technical desk receives.",
        "options": [
          {
            "key": "A",
            "text": "fewer",
            "explanation": "Sai. Thiếu mạo từ \"the\" bắt buộc trong cấu trúc so sánh kép \"The more..., the fewer...\"."
          },
          {
            "key": "B",
            "text": "the fewer",
            "explanation": "Chính xác! Cấu trúc so sánh kép đòi hỏi cả 2 vế đều có \"The + comparative\". \"Complaints\" là danh từ đếm được số nhiều nên dùng \"fewer\"."
          },
          {
            "key": "C",
            "text": "the fewest",
            "explanation": "Sai. Cấu trúc so sánh kép dùng so sánh hơn, không dùng so sánh nhất."
          },
          {
            "key": "D",
            "text": "the less",
            "explanation": "Sai. \"Complaints\" là danh từ đếm được số nhiều, phải dùng \"fewer\" chứ không dùng \"less\"."
          }
        ],
        "correctAnswer": "B",
        "explanation": "Cấu trúc \"The + comparative... the + comparative\". Do complaints là danh từ đếm được nên dùng \"the fewer\".",
        "threeStepReasoning": {
          "step1": "Xác định cấu trúc câu: Vế 1 mở đầu bằng \"The more clearly...\" ➔ Đây là cấu trúc so sánh kép (The + comparative, the + comparative).",
          "step2": "Kiểm tra yêu cầu của vế 2: Bắt buộc phải có \"the\" và dạng so sánh hơn.",
          "step3": "Chọn dạng từ phù hợp: Danh từ \"customer complaints\" là đếm được số nhiều ➔ dùng \"the fewer\". Chọn B."
        }
      },
      {
        "id": 2,
        "part": 5,
        "targetTags": [
          "TOEIC"
        ],
        "level": "800+",
        "question": "With the automated sorting system, the distribution center now processes _______ parcels as it did manually.",
        "options": [
          {
            "key": "A",
            "text": "twice as many",
            "explanation": "Chính xác! Bội số \"twice\" kết hợp với \"as many + N đếm được số nhiều (parcels) + as\"."
          },
          {
            "key": "B",
            "text": "twice more",
            "explanation": "Sai. Không kết hợp \"twice more... as\" vì \"more\" phải đi với \"than\"."
          },
          {
            "key": "C",
            "text": "as twice many",
            "explanation": "Sai trật tự từ. Từ chỉ bội số (twice) phải đứng trước cấu trúc \"as... as\"."
          },
          {
            "key": "D",
            "text": "two times as much",
            "explanation": "Sai. \"Parcels\" là danh từ đếm được số nhiều nên phải dùng \"many\", không dùng \"much\". Ngoài ra gấp 2 dùng \"twice\"."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Cấu trúc so sánh bội số với danh từ đếm được: multiple + as many + Ns + as.",
        "threeStepReasoning": {
          "step1": "Phân tích câu: Phía sau chỗ trống có danh từ đếm được số nhiều \"parcels\" và từ so sánh \"as it did\".",
          "step2": "Áp dụng công thức bội số: [twice / three times] + as many + [Plural Noun] + as.",
          "step3": "Chọn đáp án A: \"twice as many\" đúng vị trí bội số và hòa hợp với danh từ đếm được."
        }
      }
    ]
  },
  "conditional-sentences": {
    "slug": "conditional-sentences",
    "categorySlug": "comparisons-and-conditionals",
    "categoryTitle": "6. So sánh & Câu điều kiện (Comparisons & Conditionals)",
    "title": "Câu điều kiện loại 1, 2, 3 & Hỗn hợp (Conditionals)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "600+",
    "totalQuestions": 50,
    "description": "Thấu hiểu bản chất giả định thực tế và trái với thực tế: Câu điều kiện loại 1 (có thể xảy ra ở hiện tại/tương lai), loại 2 (trái thực tế hiện tại), loại 3 (trái thực tế quá khứ), và câu điều kiện hỗn hợp.",
    "goldenRule": {
      "title": "Bảng Công thức Câu Điều kiện Chuẩn:",
      "formulas": [
        "Loại 1: If + S + V(s/es), S + will / can / may + V-inf",
        "Loại 2: If + S + V2/ed (were), S + would / could + V-inf",
        "Loại 3: If + S + had + V3/ed, S + would / could + have + V3/ed",
        "Hỗn hợp: If + S + had + V3/ed (quá khứ), S + would + V-inf (hiện tại - now)"
      ],
      "note": "Từ đồng nghĩa với If: Provided that, Providing that, As long as, In case, Assuming that. Unless = If... not."
    },
    "quickTips": [
      "Nhìn vế đã cho để suy ra vế còn lại: thấy \"would have V3\" ➔ vế if phải là \"had + V3\"",
      "Trong câu điều kiện loại 2, động từ To Be luôn chia là \"WERE\" cho tất cả các ngôi trong văn viết chuẩn",
      "Nếu vế if có \"had + V3\" mà vế chính có \"now / today / currently\" ➔ câu điều kiện hỗn hợp 3-2 (chọn would + V-inf)"
    ],
    "mascotTip": "Thần chú bẫy UNLESS: Sau Unless tuyệt đối KHÔNG dùng dạng phủ định (not) vì bản thân nó đã mang nghĩa phủ định rồi!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Xác định mốc thời gian",
          "action": "Hành động giả định xảy ra ở hiện tại/tương lai hay quá khứ?"
        },
        {
          "step": 2,
          "label": "Khảo sát vế đã cho",
          "action": "Xem thì của vế If (hoặc vế chính) để tìm mẫu tương ứng theo bảng công thức."
        },
        {
          "step": 3,
          "label": "Kiểm tra trạng từ thời gian",
          "action": "Lưu ý từ \"now\", \"at present\" ở vế chính để phát hiện bẫy câu điều kiện hỗn hợp."
        }
      ],
      "explanation": "Câu điều kiện thiết lập mối liên hệ nhân quả mang tính giả thuyết, mức độ lùi thì tương ứng với mức độ phi thực tế của giả định."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "IF you NEED assistance, PLEASE CONTACT the hotline"
      },
      {
        "id": "2",
        "formula": "IF we HAD KNOWN about the traffic, we WOULD HAVE TAKEN the metro"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Loại 1 & 2 (Hiện tại & Tương lai)",
        "items": [
          "Loại 1: Giả định có thật hoặc có thể xảy ra ở hiện tại/tương lai (If S + V-s/es, S + will + V)",
          "Loại 2: Giả định không có thật ở hiện tại (If S + V-ed/were, S + would + V)",
          "Loại 1 có thể dùng câu mệnh lệnh ở vế chính (If you have questions, call us)"
        ],
        "note": "Ví dụ: If the shipment arrives on time, we will notify the client."
      },
      "rightBox": {
        "title": "Loại 3 & Hỗn hợp (Quá khứ & Thực tại)",
        "items": [
          "Loại 3: Giả định trái ngược với sự thật trong quá khứ (If had V3, would have V3)",
          "Diễn tả sự tiếc nuối hoặc suy đoán về sự kiện đã diễn ra",
          "Hỗn hợp: Giả định quá khứ dẫn đến kết quả còn kéo dài đến hiện tại (now)"
        ],
        "note": "Ví dụ: If I had accepted that offer, I would be working in Tokyo now."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy câu điều kiện hỗn hợp (Mixed Conditional)",
        "explanation": "Học sinh hay máy móc thấy \"If had V3\" liền chọn \"would have V3\" ở vế chính mà không để ý từ \"now\" hoặc \"today\". Có \"now\" ở vế chính bắt buộc dùng \"would + V-inf\".",
        "wrongExample": "If he had taken the advice yesterday, he would have been safe now.",
        "rightExample": "If he had taken the advice yesterday, he would be safe now."
      },
      {
        "id": 2,
        "title": "Bẫy dùng thì tương lai \"will\" trong mệnh đề IF",
        "explanation": "Trong mệnh đề chỉ điều kiện bắt đầu bằng If, As soon as, When, Once, tuyệt đối KHÔNG chia thì tương lai đơn (will V). Phải dùng thì hiện tại đơn để chỉ tương lai.",
        "wrongExample": "If the supplier will deliver the parts tomorrow, we can resume work.",
        "rightExample": "If the supplier delivers the parts tomorrow, we can resume work."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "If the client approves the revised budget proposal today, the design team will begin drafting the blueprints immediately.",
        "sentenceVi": "Nếu khách hàng phê duyệt đề xuất ngân sách đã chỉnh sửa vào hôm nay, đội thiết kế sẽ bắt đầu phác thảo bản vẽ ngay lập tức.",
        "highlightRule": "Điều kiện loại 1: If client approves (hiện tại đơn)... team will begin (tương lai đơn)."
      },
      {
        "id": 2,
        "sentenceEn": "If we had implemented the cybersecurity firewall earlier, the server would not have suffered this data breach.",
        "sentenceVi": "Nếu chúng ta triển khai tường lửa an ninh mạng sớm hơn, máy chủ đã không phải gánh chịu vụ rò rỉ dữ liệu này.",
        "highlightRule": "Điều kiện loại 3: If we had implemented... server would not have suffered..."
      }
    ],
    "questions": [
      {
        "id": 1,
        "part": 5,
        "targetTags": [
          "TOEIC"
        ],
        "level": "600+",
        "question": "Unless the regional sales figures _______ significantly by next Friday, the executive board will reconsider the expansion plan.",
        "options": [
          {
            "key": "A",
            "text": "improve",
            "explanation": "Chính xác! Mệnh đề sau \"Unless\" mang tính chất mệnh đề phụ chỉ điều kiện, chia thì hiện tại đơn \"improve\" tương ứng với chủ ngữ số nhiều \"sales figures\"."
          },
          {
            "key": "B",
            "text": "will improve",
            "explanation": "Sai. Trong mệnh đề If / Unless không dùng thì tương lai với \"will\"."
          },
          {
            "key": "C",
            "text": "improved",
            "explanation": "Sai. Vế chính chia \"will reconsider\" (loại 1), mệnh đề điều kiện phải chia ở hiện tại."
          },
          {
            "key": "D",
            "text": "are improved",
            "explanation": "Sai nghĩa. Doanh số tự nó khởi sắc/tăng lên, không dùng bị động trong ngữ cảnh này."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Mệnh đề chứa liên từ điều kiện \"Unless\" tuân theo quy tắc câu điều kiện loại 1: dùng thì hiện tại đơn để diễn tả điều kiện trong tương lai.",
        "threeStepReasoning": {
          "step1": "Nhận diện liên từ: \"Unless\" (trừ khi) mở đầu cho mệnh đề điều kiện.",
          "step2": "Quan sát vế chính: \"the executive board will reconsider\" chia thì tương lai đơn ➔ Câu điều kiện loại 1.",
          "step3": "Chia thì mệnh đề phụ: Mệnh đề sau Unless chia thì hiện tại đơn với chủ ngữ số nhiều \"sales figures\" ➔ chọn \"improve\". Chọn A."
        }
      },
      {
        "id": 2,
        "part": 5,
        "targetTags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "600+",
        "question": "If the research team had secured adequate funding last year, they _______ on the clinical trial phase now.",
        "options": [
          {
            "key": "A",
            "text": "would work",
            "explanation": "Chính xác! Đây là câu điều kiện hỗn hợp 3-2: Giả định quá khứ (had secured last year) để lại kết quả ở hiện tại (now) ➔ vế chính dùng \"would + V-inf\"."
          },
          {
            "key": "B",
            "text": "would have worked",
            "explanation": "Sai. Có trạng từ \"now\" ở cuối câu, diễn tả hành động đang diễn ra ở hiện tại, không dùng would have V3."
          },
          {
            "key": "C",
            "text": "will work",
            "explanation": "Sai. Vế If chia thì quá khứ hoàn thành (had secured), không thể kết hợp với \"will\"."
          },
          {
            "key": "D",
            "text": "had worked",
            "explanation": "Sai ngữ pháp. Vế chính câu điều kiện không dùng quá khứ hoàn thành đơn lẻ."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Dấu hiệu \"now\" ở vế chính kết hợp với \"last year\" ở mệnh đề If tạo thành câu điều kiện hỗn hợp loại 3 - loại 2.",
        "threeStepReasoning": {
          "step1": "Phân tích vế If: \"had secured... last year\" là giả thiết trái thực tế quá khứ (dấu hiệu loại 3).",
          "step2": "Kiểm tra trạng từ ở vế chính: Có \"now\" (ở hiện tại) ➔ Đây là câu điều kiện hỗn hợp diễn tả kết quả còn tiếp diễn ở hiện tại.",
          "step3": "Áp dụng công thức hỗn hợp: Vế chính dùng would/could + V-inf (\"would work\"). Chọn A."
        }
      }
    ]
  },
  "conditional-inversion": {
    "slug": "conditional-inversion",
    "categorySlug": "comparisons-and-conditionals",
    "categoryTitle": "6. So sánh & Câu điều kiện (Comparisons & Conditionals)",
    "title": "Đảo ngữ câu điều kiện (Should / Were / Had)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "800+",
    "totalQuestions": 42,
    "description": "Bí quyết giải quyết các câu hỏi phân loại điểm 800+ và VSTEP B2-C1 với kỹ thuật đảo ngữ câu điều kiện: lược bỏ \"If\", đưa Should, Were, Had lên đầu câu.",
    "goldenRule": {
      "title": "3 Công thức Đảo ngữ Điều kiện Cần Thuộc Lòng:",
      "formulas": [
        "Loại 1: Should + S + V-inf, S + will / can + V-inf",
        "Loại 2: Were + S + to-V / (adj/N), S + would + V-inf",
        "Loại 3: Had + S + V3/ed, S + would have + V3/ed"
      ],
      "note": "Khi đảo ngữ, TỪ \"IF\" BỊ TRIỆT TIÊU HOÀN TOÀN. Thể phủ định thêm \"not\" ngay sau chủ ngữ: Had S not V3, Should S not receive."
    },
    "quickTips": [
      "Thấy chỗ trống đứng đầu câu, theo sau là Chủ ngữ + Động từ nguyên mẫu (V-inf) ➔ Chọn ngay SHOULD",
      "Thấy chỗ trống đứng đầu câu, theo sau là Chủ ngữ + V3/ed ➔ Chọn ngay HAD",
      "Đảo ngữ phủ định: Tuyệt đối không co gọn thành \"Hadn't S...\" mà phải viết tách \"Had S not...\""
    ],
    "mascotTip": "Bí kíp phản xạ: Cứ thấy đầu câu có chỗ trống, vế sau là \"please contact / will receive\" ➔ 99% đề thi TOEIC bẫy đảo ngữ loại 1: chọn \"Should\"!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Nhận dạng cấu trúc đầu câu",
          "action": "Chỗ trống ở đầu câu, không có từ \"If\", nhưng vế 2 có cấu trúc của câu điều kiện."
        },
        {
          "step": 2,
          "label": "Xác định hình thái động từ",
          "action": "Xem động từ sau chủ ngữ là V-inf (Should), to-V (Were), hay V3/ed (Had)."
        },
        {
          "step": 3,
          "label": "Chọn trợ động từ tương ứng",
          "action": "Đưa Should (loại 1), Were (loại 2) hoặc Had (loại 3) vào vị trí đảo ngữ."
        }
      ],
      "explanation": "Đảo ngữ câu điều kiện giúp câu văn trang trọng hơn, nhấn mạnh tính lịch sự và chuẩn mực trong thư từ hành chính thương mại."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "SHOULD you have any inquiries, PLEASE NOTIFY our desk"
      },
      {
        "id": "2",
        "formula": "HAD the director ATTENDED the summit, the deal WOULD HAVE BEEN signed"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Đảo ngữ Loại 1 (Should)",
        "items": [
          "Thay thế cho: If + S + V(s/es)",
          "Động từ sau chủ ngữ LUÔN Ở DẠNG NGUYÊN MẪU (V-inf)",
          "Thường đi với câu mệnh lệnh hoặc vế chính dùng will/may",
          "Mang sắc thái lịch sự cao cấp trong email công việc"
        ],
        "note": "Ví dụ: Should you need a replacement, please email support."
      },
      "rightBox": {
        "title": "Đảo ngữ Loại 3 (Had)",
        "items": [
          "Thay thế cho: If + S + had + V3/ed",
          "Cấu trúc: Had + S + (not) + V3/ed",
          "Vế chính: S + would/could + have + V3/ed",
          "Diễn đạt sự việc trái ngược trong quá khứ"
        ],
        "note": "Ví dụ: Had the contract arrived earlier, we would have signed it."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy chia động từ số ít sau Should",
        "explanation": "Nhiều thí sinh thấy chủ ngữ sau Should là ngôi thứ ba số ít (he, she, the manager) liền chia động từ thêm -s/es. Nhớ rằng sau Should, động từ PHẢI Ở NGUYÊN THỂ (V-inf).",
        "wrongExample": "Should the customer requests a refund, refer them to billing.",
        "rightExample": "Should the customer request a refund, refer them to billing."
      },
      {
        "id": 2,
        "title": "Bẫy giữ lại từ \"If\" khi đã đảo ngữ",
        "explanation": "Phương án nhiễu thường ghép cả \"If\" lẫn trợ động từ đảo ngữ (If should you need / If had we known). Đây là lỗi sai cú pháp nghiêm trọng.",
        "wrongExample": "If should you encounter any technical glitch, restart the computer.",
        "rightExample": "Should you encounter any technical glitch, restart the computer."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "Should your flight be delayed due to severe weather conditions, please contact our ground support agent immediately.",
        "sentenceVi": "Nếu chuyến bay của quý khách bị hoãn do điều kiện thời tiết xấu, vui lòng liên hệ ngay với nhân viên hỗ trợ mặt đất của chúng tôi.",
        "highlightRule": "Đảo ngữ điều kiện loại 1: Should your flight be delayed... please contact..."
      },
      {
        "id": 2,
        "sentenceEn": "Had the financial statements not been audited by a third party, the investors would have withheld their capital.",
        "sentenceVi": "Nếu các báo cáo tài chính không được kiểm toán bởi một bên thứ ba, các nhà đầu tư đã giữ lại nguồn vốn của họ.",
        "highlightRule": "Đảo ngữ phủ định loại 3: Had the statements not been audited... investors would have withheld..."
      }
    ],
    "questions": [
      {
        "id": 1,
        "part": 5,
        "targetTags": [
          "TOEIC"
        ],
        "level": "800+",
        "question": "_______ the delivery be postponed due to customs inspection, the purchasing department will inform the client right away.",
        "options": [
          {
            "key": "A",
            "text": "Should",
            "explanation": "Chính xác! Đảo ngữ câu điều kiện loại 1: Should + S (the delivery) + V-inf (be postponed), vế sau dùng \"will inform\"."
          },
          {
            "key": "B",
            "text": "If",
            "explanation": "Sai. Nếu dùng \"If\" thì động từ phải chia thì (is postponed), không thể để \"be postponed\" nguyên mẫu."
          },
          {
            "key": "C",
            "text": "Were",
            "explanation": "Sai. Were dùng cho loại 2, đi với \"Were S to be\" hoặc \"Were S + adj\", vế sau phải là would chứ không phải will."
          },
          {
            "key": "D",
            "text": "Unless",
            "explanation": "Sai. \"Unless\" tương tự \"If\", động từ theo sau phải được chia thì phù hợp với chủ ngữ số ít."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Động từ \"be postponed\" ở dạng nguyên mẫu không chia và vế sau có \"will inform\", chứng tỏ đây là đảo ngữ câu điều kiện loại 1 với Should.",
        "threeStepReasoning": {
          "step1": "Quan sát vị trí đầu câu và cấu trúc theo sau: \"_______ the delivery be postponed...\" ➔ Động từ \"be\" đang ở dạng nguyên mẫu.",
          "step2": "Quan sát vế chính: \"the purchasing department will inform...\" ➔ Vế chính dùng thì tương lai với \"will\" (câu điều kiện loại 1).",
          "step3": "Suy ra cấu trúc đảo ngữ: Chỉ có \"Should + S + V-inf\" mới đi kèm động từ nguyên thể và vế sau will. Chọn A (Should)."
        }
      },
      {
        "id": 2,
        "part": 5,
        "targetTags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "800+",
        "question": "_______ you not received your registration credentials within two business days, please resubmit the digital inquiry form.",
        "options": [
          {
            "key": "A",
            "text": "Had",
            "explanation": "Chính xác! Đảo ngữ phủ định điều kiện loại 3: \"Had you not received...\" (ở đây rút gọn hoặc nói về sự kiện trong quá khứ) hoặc kết hợp câu chỉ dẫn."
          },
          {
            "key": "B",
            "text": "If",
            "explanation": "Sai. Nếu dùng If phủ định ở quá khứ thì phải là \"If you had not received\", không đảo \"not\" đứng trước động từ theo dạng này."
          },
          {
            "key": "C",
            "text": "Should",
            "explanation": "Sai. Sau Should thì động từ phải là nguyên thể (Should you not receive), trong khi ở đây là \"received\" (V3/ed)."
          },
          {
            "key": "D",
            "text": "Were",
            "explanation": "Sai. Were không đi trực tiếp với V3 trong câu chủ động như thế này."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Cấu trúc đảo ngữ quá khứ: Had + S + not + V3/ed (received).",
        "threeStepReasoning": {
          "step1": "Phân tích hình thái động từ: \"not received\" là cấu trúc phủ định với động từ dạng phân từ hai (V3/ed).",
          "step2": "Xác định trợ động từ đảo ngữ: Để đi với V3/ed, chỉ có trợ động từ \"Had\" thỏa mãn (Had + S + not + V3).",
          "step3": "Kết luận: Loại C (\"Should\") vì Should đòi hỏi V-inf (receive); loại B (\"If\") sai cấu trúc. Chọn A."
        }
      }
    ]
  },
  "subjunctive-mood": {
    "slug": "subjunctive-mood",
    "categorySlug": "special-structures",
    "categoryTitle": "7. Cấu trúc Đặc biệt (Special Structures)",
    "title": "Thức giả định (Subjunctive Mood with Suggest, Demand, Vital)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "800+",
    "totalQuestions": 45,
    "description": "Chuyên sâu cấu trúc thức giả định trong tiếng Anh trang trọng: các động từ yêu cầu/đề xuất (suggest, recommend, demand, insist) và tính từ cấp thiết (vital, essential, imperative, mandatory) đi với mệnh đề That + S + (should) + V-inf.",
    "goldenRule": {
      "title": "Công thức Thức Giả định Cốt lõi:",
      "formulas": [
        "S_1 + V (yêu cầu) + that + S_2 + (should) + V-inf / be + V3/ed",
        "mathbf{It is + adj_{cấp thiết} + that} + S + (should) + V-inf / be + V3/ed"
      ],
      "note": "Dù chủ ngữ S_2 là số ít (he, she, the director) hay thì của mệnh đề chính là quá khứ, động từ trong mệnh đề that LUÔN Ở DẠNG NGUYÊN MẪU (V-inf)."
    },
    "quickTips": [
      "Gặp các động từ: suggest, recommend, request, demand, require, insist, propose + that ➔ chọn V-inf (hoặc be V3 nếu bị động)",
      "Gặp các tính từ: essential, vital, imperative, crucial, mandatory, necessary + that ➔ chọn V-inf",
      "Nếu là thể bị động, động từ to be GIỮ NGUYÊN LÀ \"BE\" (không chia is, are, was, were)"
    ],
    "mascotTip": "Bẫy kinh điển đề 800+: \"The director recommended that every employee _______ the seminar.\" Nhìn thấy \"every employee\" đừng vội chia attends, phải chọn ATTEND nguyên mẫu!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Nhận diện tín hiệu",
          "action": "Tìm kiếm động từ yêu cầu (recommend/suggest) hoặc tính từ cấp bách (vital/mandatory) + THAT."
        },
        {
          "step": 2,
          "label": "Xác định thể chủ động hay bị động",
          "action": "Chủ ngữ sau that tự thực hiện hành động (V-inf) hay bị tác động (be + V3/ed)?"
        },
        {
          "step": 3,
          "label": "Giữ nguyên dạng trần",
          "action": "Loại bỏ ngay các phương án chia thì (-s, -ed, was, will). Chọn dạng nguyên mẫu trần."
        }
      ],
      "explanation": "Thức giả định diễn đạt ý muốn, mệnh lệnh hoặc sự cấp bách chứ không kể lại một sự thật hiển nhiên, do đó động từ không bị ràng buộc bởi ngôi hay thì."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "recommend that the manager SUBMIT the invoice"
      },
      {
        "id": "2",
        "formula": "It is imperative that all safety regulations BE OBSERVED"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Động từ chỉ ý muốn (Verbs)",
        "items": [
          "suggest, recommend, demand, request, require, propose, insist, advise, urge",
          "Cấu trúc: Verb + that + S + (should) + V-inf",
          "Thể phủ định: that + S + (should) not + V-inf"
        ],
        "note": "Ví dụ: The CEO requested that the committee review the proposal."
      },
      "rightBox": {
        "title": "Tính từ cấp bách (Adjectives)",
        "items": [
          "vital, essential, imperative, crucial, necessary, mandatory, urgent, important",
          "Cấu trúc: It is + adj + that + S + (should) + V-inf",
          "Dùng \"be + V3/ed\" khi mang ý nghĩa bị động"
        ],
        "note": "Ví dụ: It is vital that confidentiality be maintained."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy chia động từ to be theo thì quá khứ hoặc số ít",
        "explanation": "Trong mệnh đề bị động của thức giả định, động từ to be bắt buộc phải là \"be\", không được chia thành is, are, was, were.",
        "wrongExample": "It is essential that the leaked document is destroyed at once.",
        "rightExample": "It is essential that the leaked document be destroyed at once."
      },
      {
        "id": 2,
        "title": "Bẫy thêm -s/es cho chủ ngữ ngôi thứ ba số ít",
        "explanation": "Thí sinh hay mắc phản xạ chia động từ theo chủ ngữ số ít (Mr. Lee, the report, everyone). Nhớ rằng trợ động từ \"should\" đã bị ẩn đi, nên động từ bắt buộc là bare-infinitive.",
        "wrongExample": "The auditor insisted that Mr. Scott submits the receipts today.",
        "rightExample": "The auditor insisted that Mr. Scott submit the receipts today."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The board of directors recommended that the new regional branch be located in downtown Seattle.",
        "sentenceVi": "Hội đồng quản trị đề xuất rằng chi nhánh khu vực mới nên được đặt tại trung tâm thành phố Seattle.",
        "highlightRule": "Thức giả định bị động: recommended that the new branch be located..."
      },
      {
        "id": 2,
        "sentenceEn": "It is imperative that every medical personnel strictly adhere to the updated sanitization protocol.",
        "sentenceVi": "Điều bắt buộc là mọi nhân viên y tế phải tuân thủ nghiêm ngặt quy trình vệ sinh khử khuẩn đã được cập nhật.",
        "highlightRule": "Tính từ cấp bách: It is imperative that every personnel adhere (nguyên mẫu)..."
      }
    ],
    "questions": [
      {
        "id": 1,
        "part": 5,
        "targetTags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "800+",
        "question": "The senior compliance officer demanded that the accounting department _______ all transaction records before the external audit begins.",
        "options": [
          {
            "key": "A",
            "text": "provide",
            "explanation": "Chính xác! Cấu trúc thức giả định: demand that + S + (should) + V-inf. Động từ \"provide\" phải giữ nguyên mẫu."
          },
          {
            "key": "B",
            "text": "provides",
            "explanation": "Sai. Không chia động từ thêm -s theo chủ ngữ số ít trong mệnh đề thức giả định."
          },
          {
            "key": "C",
            "text": "provided",
            "explanation": "Sai. Không lùi thì theo thì quá khứ \"demanded\" của mệnh đề chính."
          },
          {
            "key": "D",
            "text": "will provide",
            "explanation": "Sai. Không dùng thì tương lai với \"will\" trong mệnh đề thức giả định."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Sau động từ đòi hỏi \"demanded that\", mệnh đề phụ sử dụng thức giả định với động từ nguyên thể không \"to\": provide.",
        "threeStepReasoning": {
          "step1": "Nhận diện tín hiệu: Động từ \"demanded that\" báo hiệu cấu trúc thức giả định (Subjunctive mood).",
          "step2": "Áp dụng công thức: S + demand + that + S + (should) + V-inf.",
          "step3": "Chọn đáp án nguyên mẫu: Loại B (provides), C (provided), D (will provide). Chọn A (provide)."
        }
      },
      {
        "id": 2,
        "part": 5,
        "targetTags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "800+",
        "question": "It is mandatory that all digital access credentials _______ confidential and never shared with unauthorized individuals.",
        "options": [
          {
            "key": "A",
            "text": "be kept",
            "explanation": "Chính xác! Cấu trúc: It is mandatory that + S + (should) + be + V3/ed. Đây là thể bị động của thức giả định."
          },
          {
            "key": "B",
            "text": "are kept",
            "explanation": "Sai. Động từ \"to be\" trong mệnh đề thức giả định phải ở dạng nguyên mẫu \"be\", không chia thành \"are\"."
          },
          {
            "key": "C",
            "text": "keep",
            "explanation": "Sai nghĩa. Credentials (thông tin đăng nhập) phải được giữ bí mật (bị động), không tự giữ."
          },
          {
            "key": "D",
            "text": "to be kept",
            "explanation": "Sai ngữ pháp. Sau mệnh đề \"that + S\" cần một vị ngữ hoàn chỉnh chứ không dùng to-infinitive."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Cấu trúc \"It is mandatory that + S + be V3/ed\" (thể bị động thức giả định giữ nguyên \"be\").",
        "threeStepReasoning": {
          "step1": "Xác định cấu trúc: \"It is mandatory that...\" yêu cầu thức giả định ở mệnh đề sau that.",
          "step2": "Xác định thể: Chủ ngữ \"access credentials\" (thông tin đăng nhập) cần được giữ bí mật ➔ Thể bị động (be + V3/ed).",
          "step3": "Chọn dạng chuẩn: To be trong thức giả định luôn là \"be\" nguyên mẫu ➔ \"be kept\". Chọn A."
        }
      }
    ]
  },
  "causative-structures": {
    "slug": "causative-structures",
    "categorySlug": "special-structures",
    "categoryTitle": "7. Cấu trúc Đặc biệt (Special Structures)",
    "title": "Cấu trúc Cầu khiến (Causative: Have/Get something done)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "600+",
    "totalQuestions": 44,
    "description": "Thành thạo cấu trúc cầu khiến chỉ hành động nhờ vả, thuê mướn hoặc sai khiến người khác làm việc gì: Have someone do something, Get someone to do something, và thể bị động cốt lõi Have/Get something done.",
    "goldenRule": {
      "title": "Hệ Thống Cấu Trúc Cầu Khiến Bắt Buộc Nhớ:",
      "formulas": [
        "Chủ động Have: S + have + O_{người} + V-inf",
        "Chủ động Get: S + get + O_{người} + to-V",
        "Bị động chung: S + have / get + O_{vật} + V3/ed",
        "Sai khiến Make/Let: S + make / let + O + V-inf"
      ],
      "note": "Dạng bị động \"have/get something done\" chiếm trên 85% câu hỏi cầu khiến trong bài thi TOEIC (nhờ ai đó sửa máy móc, in ấn tài liệu, kiểm tra hợp đồng)."
    },
    "quickTips": [
      "Have + Người + V-inf (Have someone DO)",
      "Get + Người + to-V (Get someone TO DO)",
      "Have / Get + Vật + V3/ed (Have something DONE)",
      "Let / Make + Người/Vật + V-inf (Make someone DO - không có to)"
    ],
    "mascotTip": "Thần chú siêu tốc: Cứ thấy HAVE hoặc GET mà tân ngữ là ĐỒ VẬT (the machine, the report, the car) ➔ 100% khoanh V3/ed (repaired, printed, inspected)!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Nhận diện động từ tác nhân",
          "action": "Phát hiện các động từ: have, get, make, let."
        },
        {
          "step": 2,
          "label": "Phân loại tân ngữ (O)",
          "action": "Tân ngữ là Người (chủ thể hành động) hay Vật (đối tượng chịu tác động)?"
        },
        {
          "step": 3,
          "label": "Khớp công thức",
          "action": "Have người do / Get người to do / Have vật done / Get vật done."
        }
      ],
      "explanation": "Cấu trúc cầu khiến thể hiện một chủ thể tác động lên chủ thể khác để hoàn thành công việc thay vì tự mình làm."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "had the technician INSPECT the equipment"
      },
      {
        "id": "2",
        "formula": "had the air conditioning system SERVICED yesterday"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Chủ động (Active Causative)",
        "items": [
          "Have + Người + V-inf: Giao việc, chỉ định nhiệm vụ",
          "Get + Người + to-V: Thuyết phục, nhờ cậy ai làm gì",
          "Make + Người + V-inf: Bắt buộc, ép buộc ai làm gì",
          "Let + Người + V-inf: Cho phép ai làm gì"
        ],
        "note": "Ví dụ: I had my assistant book the flight ticket."
      },
      "rightBox": {
        "title": "Bị động (Passive Causative)",
        "items": [
          "Have / Get + Vật + V3/ed: Thuê mướn hoặc nhờ ai đó xử lý đồ vật",
          "Không cần nhắc tới người thực hiện nếu không quan trọng",
          "Dùng phổ biến trong dịch vụ, bảo trì, sửa chữa, in ấn"
        ],
        "note": "Ví dụ: We must get the server upgraded this weekend."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy nhầm lẫn giữa Have và Get ở thể chủ động",
        "explanation": "Thí sinh hay dùng lẫn lộn \"have someone to do\" hoặc \"get someone do\". Nhớ: Have đi với V-inf, còn Get bắt buộc phải có TO (get someone to do).",
        "wrongExample": "The director got his assistant prepare the slide deck.",
        "rightExample": "The director got his assistant to prepare the slide deck."
      },
      {
        "id": 2,
        "title": "Bẫy chia To-V khi tân ngữ là đồ vật",
        "explanation": "Khi thấy Get + đồ vật, nhiều bạn vẫn theo thói quen chọn \"to-V\". Hãy nhớ: khi tân ngữ là vật, dù là Have hay Get thì động từ đều là V3/ed.",
        "wrongExample": "The company got the annual report to publish last week.",
        "rightExample": "The company got the annual report published last week."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The property manager had the commercial elevators inspected by certified technicians last Monday.",
        "sentenceVi": "Người quản lý tòa nhà đã cho kiểm định các thang máy thương mại bởi các kỹ thuật viên được chứng nhận vào thứ Hai tuần trước.",
        "highlightRule": "Cầu khiến bị động: had the elevators (vật) inspected (V3/ed)..."
      },
      {
        "id": 2,
        "sentenceEn": "Our marketing director got the graphic designer to revise the brand logo before the product launch.",
        "sentenceVi": "Giám đốc tiếp thị của chúng tôi đã nhờ nhà thiết kế đồ họa chỉnh sửa logo thương hiệu trước đợt ra mắt sản phẩm.",
        "highlightRule": "Cầu khiến chủ động với Get: got the designer (người) to revise (to-V)..."
      }
    ],
    "questions": [
      {
        "id": 1,
        "part": 5,
        "targetTags": [
          "TOEIC"
        ],
        "level": "600+",
        "question": "The branch manager will have an IT specialist _______ the outdated computer terminals before the new fiscal quarter.",
        "options": [
          {
            "key": "A",
            "text": "upgrade",
            "explanation": "Chính xác! Cấu trúc chủ động với Have: have + O(người) + V-inf (\"have an IT specialist upgrade\")."
          },
          {
            "key": "B",
            "text": "to upgrade",
            "explanation": "Sai. \"Have\" chủ động đi với V-inf, không dùng to-infinitive (chỉ \"get\" mới dùng to-V)."
          },
          {
            "key": "C",
            "text": "upgraded",
            "explanation": "Sai. Tân ngữ là \"an IT specialist\" (người trực tiếp thực hiện hành động), không dùng phân từ bị động."
          },
          {
            "key": "D",
            "text": "upgrading",
            "explanation": "Sai ngữ pháp. Cấu trúc cầu khiến cơ bản không sử dụng dạng V-ing trong ngữ cảnh này."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Cấu trúc cầu khiến thể chủ động: have + someone + do something (V-inf).",
        "threeStepReasoning": {
          "step1": "Phát hiện động từ cầu khiến: \"will have\" đi cùng tân ngữ \"an IT specialist\".",
          "step2": "Xác định bản chất tân ngữ: \"an IT specialist\" là danh từ chỉ người (chủ thể trực tiếp nâng cấp máy tính).",
          "step3": "Áp dụng công thức Have chủ động: have + người + V-inf ➔ chọn \"upgrade\". Chọn A."
        }
      },
      {
        "id": 2,
        "part": 5,
        "targetTags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "600+",
        "question": "To comply with workplace safety codes, the manufacturing plant gets its ventilation filters _______ every three months.",
        "options": [
          {
            "key": "A",
            "text": "replace",
            "explanation": "Sai. Tân ngữ \"ventilation filters\" (bộ lọc thông gió) là vật, không thể tự thực hiện hành động thay thế."
          },
          {
            "key": "B",
            "text": "to replace",
            "explanation": "Sai. \"Get something to replace\" là sai cấu trúc bị động."
          },
          {
            "key": "C",
            "text": "replaced",
            "explanation": "Chính xác! Cấu trúc cầu khiến bị động: get + something + V3/ed (\"get filters replaced\" = cho người thay thế bộ lọc)."
          },
          {
            "key": "D",
            "text": "replacing",
            "explanation": "Sai ngữ pháp. Dạng V-ing không dùng cho thể bị động cầu khiến."
          }
        ],
        "correctAnswer": "C",
        "explanation": "Cấu trúc cầu khiến bị động: get + something (filters) + V3/ed (replaced).",
        "threeStepReasoning": {
          "step1": "Xác định cấu trúc: Động từ \"gets\" kết hợp với tân ngữ \"its ventilation filters\".",
          "step2": "Phân tích tân ngữ: \"ventilation filters\" là đồ vật chịu tác động (được thay thế).",
          "step3": "Áp dụng công thức bị động: get + something + V3/ed ➔ chọn \"replaced\". Chọn C."
        }
      }
    ]
  },
  "inversion-and-parallelism": {
    "slug": "inversion-and-parallelism",
    "categorySlug": "special-structures",
    "categoryTitle": "7. Cấu trúc Đặc biệt (Special Structures)",
    "title": "Đảo ngữ & Cấu trúc Song hành (Inversion & Parallelism)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "800+",
    "totalQuestions": 46,
    "description": "Chinh phục quy tắc song hành tuyệt đối (Parallel Structure) với các liên từ kết hợp và tương quan (both...and, not only...but also, either...or), cùng các trường hợp đảo ngữ nâng cao chỉ địa điểm và phương hướng.",
    "goldenRule": {
      "title": "Quy tắc Cốt lõi về Song hành & Đảo ngữ:",
      "formulas": [
        "Song hành: A + mathbf{{and / or / but / as well as}} + B quad (A và B cùng từ loại/cấu trúc)",
        "Both A and B / Either A or B / Neither A nor B / Not only A but also B",
        "Đảo ngữ địa điểm: Prep Phrase (Địa điểm) + V + S"
      ],
      "note": "Các thành phần nối bởi liên từ song hành phải tương đương nhau: Nối tính từ với tính từ, danh từ với danh từ, to-V với to-V, V-ing với V-ing."
    },
    "quickTips": [
      "Trước liên từ \"and / but / or\" là từ loại gì thì sau liên từ phải là từ loại tương ứng",
      "Cặp liên từ cố định: Not only đi với but also, Either đi với or, Neither đi với nor, Both đi với and",
      "Đảo ngữ cụm giới từ chỉ vị trí (Behind the building stood a warehouse): động từ đảo trực tiếp lên trước chủ ngữ không cần mượn trợ động từ do/does/did"
    ],
    "mascotTip": "Thần chú bẫy Part 5: Thấy \"reliable, dedicated, and _______\" ➔ Phía trước là 2 tính từ thì chỗ trống 100% phải chọn một TÍNH TỪ (ví dụ: efficient)!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Xác định liên từ",
          "action": "Tìm các liên từ song hành: and, but, or, as well as, not only... but also."
        },
        {
          "step": 2,
          "label": "Quét yếu tố đối chiếu",
          "action": "Kiểm tra thành phần ngữ pháp đứng trước liên từ (tính từ, danh từ, cụm phân từ, hay mệnh đề)."
        },
        {
          "step": 3,
          "label": "Đồng bộ hóa hình thức",
          "action": "Chọn phương án có cùng dạng thức và vai trò ngữ pháp với yếu tố đối chiếu."
        }
      ],
      "explanation": "Cấu trúc song hành tạo nên sự cân xứng, nhịp nhàng và rõ ràng trong tư duy văn bản học thuật và kinh doanh."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "responsible for ANALYZING data and PREPARING reports"
      },
      {
        "id": "2",
        "formula": "not only COST-EFFECTIVE but also HIGHLY RELIABLE"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Cấu trúc Song hành (Parallelism)",
        "items": [
          "Đồng nhất từ loại: Adj and Adj, N and N, Adv and Adv",
          "Đồng nhất cấu trúc động từ: V-ing and V-ing, to-V and (to) V",
          "Đồng nhất mệnh đề: that-clause and that-clause",
          "Các cặp tương quan: both...and, not only...but also"
        ],
        "note": "Ví dụ: The internship offers hands-on experience and professional mentorship."
      },
      "rightBox": {
        "title": "Đảo ngữ Cụm Giới từ (Locative Inversion)",
        "items": [
          "Mở đầu bằng cụm giới từ chỉ phương hướng hoặc vị trí",
          "Động từ chính (thường là stand, sit, lie, come) đứng ngay trước chủ ngữ",
          "KHÔNG dùng trợ động từ do / does / did",
          "Chủ ngữ thực sự nằm ở cuối câu"
        ],
        "note": "Ví dụ: On the top shelf were several archived dossiers."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy mất cân xứng dạng động từ trong chuỗi liệt kê",
        "explanation": "Đề thi thường đưa ra chuỗi hành động có 2 động từ V-ing nhưng phương án lại gài to-V hoặc danh từ. Hãy luôn giữ tính đồng nhất dạng động từ.",
        "wrongExample": "His duties include filing records, answering calls, and to schedule meetings.",
        "rightExample": "His duties include filing records, answering calls, and scheduling meetings."
      },
      {
        "id": 2,
        "title": "Bẫy dùng sai cặp liên từ tương quan",
        "explanation": "Đề thi hay ghép \"not only... and\", \"neither... or\", hoặc \"either... nor\". Phải ghi nhớ chuẩn xác các cặp đôi bất biến.",
        "wrongExample": "The new model is neither energy-efficient or reasonably priced.",
        "rightExample": "The new model is neither energy-efficient nor reasonably priced."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The company seeks a consultant who communicates effectively, thinks analytically, and collaborates seamlessly.",
        "sentenceVi": "Công ty đang tìm kiếm một chuyên gia tư vấn có khả năng giao tiếp hiệu quả, tư duy phân tích và hợp tác ăn ý.",
        "highlightRule": "Song hành 3 động từ: communicates effectively, thinks analytically, and collaborates seamlessly."
      },
      {
        "id": 2,
        "sentenceEn": "Not only does the automated software reduce administrative overhead, but it also minimizes operational error rates.",
        "sentenceVi": "Phần mềm tự động hóa không những cắt giảm chi phí gián tiếp mà còn giảm thiểu tỷ lệ sai sót trong vận hành.",
        "highlightRule": "Đảo ngữ với Not only đứng đầu câu: Not only does the software reduce..., but it also minimizes..."
      }
    ],
    "questions": [
      {
        "id": 1,
        "part": 5,
        "targetTags": [
          "TOEIC"
        ],
        "level": "800+",
        "question": "Applicants for the project manager role must demonstrate strong leadership, exceptional communication skills, and _______ under pressure.",
        "options": [
          {
            "key": "A",
            "text": "adaptability",
            "explanation": "Chính xác! Cấu trúc song hành với chuỗi 3 danh từ: \"leadership\" (N), \"communication skills\" (N phrase), and \"adaptability\" (N)."
          },
          {
            "key": "B",
            "text": "adaptable",
            "explanation": "Sai. \"Adaptable\" là tính từ, phá vỡ cấu trúc song hành của chuỗi danh từ đứng trước."
          },
          {
            "key": "C",
            "text": "adapt",
            "explanation": "Sai. \"Adapt\" là động từ nguyên mẫu, không hòa hợp với vai trò tân ngữ của động từ \"demonstrate\"."
          },
          {
            "key": "D",
            "text": "adaptively",
            "explanation": "Sai. \"Adaptively\" là trạng từ, không thể đóng vai trò tân ngữ liệt kê trong câu."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Chuỗi liệt kê bổ nghĩa cho động từ \"demonstrate\": demonstrate [N], [N], and [N] ➔ Chỗ trống cần một danh từ (adaptability).",
        "threeStepReasoning": {
          "step1": "Phân tích các thành phần trước liên từ \"and\": \"strong leadership\" (Cụm N) và \"exceptional communication skills\" (Cụm N).",
          "step2": "Áp dụng luật song hành: Các thành phần nối bởi \"and\" phải cùng từ loại ➔ chỗ trống bắt buộc là Danh từ.",
          "step3": "Chọn đáp án danh từ: Loại B (tính từ), C (động từ), D (trạng từ). Chọn A (adaptability - danh từ sự thích ứng)."
        }
      },
      {
        "id": 2,
        "part": 5,
        "targetTags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "800+",
        "question": "The prospective joint venture will be _______ profitable for both enterprises nor sustainable over the coming decade.",
        "options": [
          {
            "key": "A",
            "text": "neither",
            "explanation": "Chính xác! Cặp liên từ tương quan bất biến: \"neither... nor\" (không... cũng không)."
          },
          {
            "key": "B",
            "text": "either",
            "explanation": "Sai. \"Either\" phải đi đôi với \"or\", không đi với \"nor\"."
          },
          {
            "key": "C",
            "text": "both",
            "explanation": "Sai. \"Both\" đi với \"and\"."
          },
          {
            "key": "D",
            "text": "not only",
            "explanation": "Sai. \"Not only\" phải đi với \"but also\"."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Nhìn phía sau có từ liên kết \"nor sustainable\", từ kết cặp duy nhất đi cùng \"nor\" là \"neither\".",
        "threeStepReasoning": {
          "step1": "Quét nhanh câu để tìm từ kết nối tương quan: Thấy từ \"nor\" ở vế sau (\"nor sustainable\").",
          "step2": "Đối chiếu cặp liên từ chuẩn: Cặp tương quan chuẩn là \"neither... nor\".",
          "step3": "Chọn đáp án A (neither). Loại ngay B (either...or), C (both...and), D (not only...but also)."
        }
      }
    ]
  },
  "cleft-sentences": {
    "slug": "cleft-sentences",
    "categorySlug": "advanced-vstep-modifiers",
    "categoryTitle": "8. Cấu trúc Nâng cao VSTEP & TOEIC 800+",
    "title": "Câu chẻ nhấn mạnh (Cleft Sentences: It is... that...)",
    "targetTags": [
      "VSTEP",
      "TOEIC"
    ],
    "level": "800+",
    "totalQuestions": 40,
    "description": "Chinh phục câu chẻ (Cleft Sentences) dùng để nhấn mạnh một thành phần cụ thể trong câu (chủ ngữ, tân ngữ, trạng ngữ chỉ thời gian/nơi chốn/nguyên nhân).",
    "goldenRule": {
      "title": "Công thức Câu Chẻ Chuẩn:",
      "formulas": [
        "It + is / was + Thành phần nhấn mạnh + that / who + S + V",
        "Nhấn mạnh Chủ ngữ (Người): mathbf{It is/was + S_{người} + who / that + V}",
        "Nhấn mạnh Trạng ngữ: It is/was + Prep Phrase / Trạng ngữ + that + S + V"
      ],
      "note": "Dù thành phần nhấn mạnh là thời gian hay nơi chốn (yesterday, in Hanoi), trong văn viết học thuật chuẩn VSTEP/TOEIC, liên từ kết nối LUÔN LÀ \"THAT\" (tránh dùng when/where)."
    },
    "quickTips": [
      "Cấu trúc mở đầu bắt buộc là \"It is\" hoặc \"It was\" (không dùng This is hay That is để làm câu chẻ)",
      "Muốn biết có phải câu chẻ không: Bỏ \"It is/was\" và \"that\", nếu câu còn lại sắp xếp thành câu hoàn chỉnh đúng nghĩa thì 100% là câu chẻ",
      "Nếu mệnh đề chính ở quá khứ, to be phải chia là \"was\" (It was last night that...)"
    ],
    "mascotTip": "Bẫy đề thi: \"It was in the boardroom _______ the historic merger agreement was finalized.\" Đừng thấy nơi chốn mà chọn where, đáp án chuẩn học thuật là THAT!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Kiểm tra chủ ngữ giả",
          "action": "Phát hiện câu bắt đầu bằng \"It is\" hoặc \"It was\" kèm theo một thành phần được cô lập."
        },
        {
          "step": 2,
          "label": "Thử nghiệm lược bỏ",
          "action": "Lược bỏ \"It is/was... that\", kiểm tra xem các thành phần còn lại có tạo nên mệnh đề độc lập logic."
        },
        {
          "step": 3,
          "label": "Chọn liên từ chẻ",
          "action": "Dùng \"that\" (ưu tiên số 1) hoặc \"who\" (nếu nhấn mạnh chủ ngữ chỉ người)."
        }
      ],
      "explanation": "Câu chẻ chia một câu đơn thành hai phần nhằm dồn toàn bộ sự chú ý của người đọc/người nghe vào một yếu tố trọng tâm."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "It was MS. DELGADO WHO submitted the final proposal"
      },
      {
        "id": "2",
        "formula": "It was DUE TO SEVERE TURBULENCE THAT the flight was diverted"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Nhấn mạnh Chủ ngữ & Tân ngữ",
        "items": [
          "Nhấn mạnh danh từ chỉ người: dùng who hoặc that",
          "Nhấn mạnh danh từ chỉ vật/sự việc: bắt buộc dùng that (không dùng which)",
          "Động từ sau who/that chia theo ngôi của danh từ được nhấn mạnh"
        ],
        "note": "Ví dụ: It was the CEO who made the decisive announcement."
      },
      "rightBox": {
        "title": "Nhấn mạnh Trạng từ & Cụm Giới từ",
        "items": [
          "Nhấn mạnh thời gian: It was yesterday that...",
          "Nhấn mạnh địa điểm: It was at the headquarters that...",
          "Nhấn mạnh nguyên nhân: It was because of the delay that...",
          "Tuyệt đối KHÔNG thay that bằng when, where, why"
        ],
        "note": "Ví dụ: It was only recently that the technology matured."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy dùng \"where\" hoặc \"when\" sau trạng ngữ nơi chốn/thời gian",
        "explanation": "Thí sinh hay nhầm câu chẻ với mệnh đề quan hệ nên chọn where khi gặp nơi chốn hoặc when khi gặp thời gian. Trong cấu trúc câu chẻ It is... that, liên từ chuẩn mực là THAT.",
        "wrongExample": "It was in Paris where the climate agreement was signed.",
        "rightExample": "It was in Paris that the climate agreement was signed."
      },
      {
        "id": 2,
        "title": "Bẫy dùng \"This is\" thay cho \"It is\"",
        "explanation": "Phương án gây nhiễu đưa \"This is...\" hoặc \"That is...\". Quy tắc câu chẻ: Chỉ có đại từ giả định \"It\" mới hợp lệ.",
        "wrongExample": "This was Mr. Vance that organized the charity gala.",
        "rightExample": "It was Mr. Vance that organized the charity gala."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "It was Ms. Chen who originally identified the computational bug in the financial reporting software.",
        "sentenceVi": "Chính cô Chen là người đầu tiên phát hiện ra lỗi thuật toán trong phần mềm lập báo cáo tài chính.",
        "highlightRule": "Nhấn mạnh chủ thể hành động: It was Ms. Chen who originally identified..."
      },
      {
        "id": 2,
        "sentenceEn": "It was only after the rigorous market assessment that the enterprise decided to venture into Southeast Asia.",
        "sentenceVi": "Chỉ sau khi tiến hành đánh giá thị trường khắt khe thì doanh nghiệp mới quyết định đầu tư mạo hiểm vào Đông Nam Á.",
        "highlightRule": "Nhấn mạnh mệnh đề thời gian: It was only after... that the enterprise decided..."
      }
    ],
    "questions": [
      {
        "id": 1,
        "part": 5,
        "targetTags": [
          "VSTEP",
          "TOEIC"
        ],
        "level": "800+",
        "question": "It was during the annual international symposium _______ the research consortium unveiled its breakthrough solar cell technology.",
        "options": [
          {
            "key": "A",
            "text": "that",
            "explanation": "Chính xác! Cấu trúc câu chẻ nhấn mạnh trạng ngữ thời gian: It was [during the symposium] that + S + V."
          },
          {
            "key": "B",
            "text": "which",
            "explanation": "Sai. \"Which\" chỉ dùng cho mệnh đề quan hệ thay cho vật, không dùng làm liên từ câu chẻ nhấn mạnh trạng từ."
          },
          {
            "key": "C",
            "text": "when",
            "explanation": "Sai. Trong câu chẻ chuẩn học thuật, dù nhấn mạnh thời gian vẫn dùng \"that\", không dùng \"when\"."
          },
          {
            "key": "D",
            "text": "where",
            "explanation": "Sai. Không dùng \"where\" trong cấu trúc câu chẻ It was... that."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Cấu trúc câu chẻ nhấn mạnh cụm trạng từ thời gian \"during the annual symposium\": It was + Adv + that + S + V.",
        "threeStepReasoning": {
          "step1": "Phân tích mở đầu câu: \"It was during the annual international symposium...\" ➔ Bắt đầu bằng It was + cụm giới từ thời gian.",
          "step2": "Xác định cấu trúc câu: Đây là câu chẻ (Cleft sentence) dùng để nhấn mạnh cụm từ thời gian.",
          "step3": "Chọn liên từ: Cấu trúc câu chẻ chuẩn luôn dùng liên từ \"that\". Chọn A."
        }
      },
      {
        "id": 2,
        "part": 5,
        "targetTags": [
          "VSTEP",
          "TOEIC"
        ],
        "level": "800+",
        "question": "_______ was through the diligent efforts of the logistics department that all overseas orders were shipped without incident.",
        "options": [
          {
            "key": "A",
            "text": "It",
            "explanation": "Chính xác! Cấu trúc câu chẻ bắt buộc dùng đại từ giả \"It\" mở đầu: It was [through the efforts...] that..."
          },
          {
            "key": "B",
            "text": "This",
            "explanation": "Sai. \"This\" không thể kết hợp với \"that\" để tạo thành câu chẻ nhấn mạnh."
          },
          {
            "key": "C",
            "text": "There",
            "explanation": "Sai. \"There was\" là cấu trúc tồn tại, không kết hợp với mệnh đề \"that\" chỉ trạng thái như câu chẻ."
          },
          {
            "key": "D",
            "text": "What",
            "explanation": "Sai. Nếu dùng \"What was through...\" thì câu sẽ vô nghĩa và sai cú pháp hoàn toàn."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Cấu trúc câu chẻ nhấn mạnh: It + was + cụm giới từ phương tiện/cách thức + that + S + V.",
        "threeStepReasoning": {
          "step1": "Quan sát cấu trúc toàn câu: \"_______ was through the diligent efforts... that all orders were shipped...\".",
          "step2": "Nhận diện mô hình: Có dạng [Chủ ngữ giả] + was + [Thành phần nhấn mạnh] + that + [Mệnh đề].",
          "step3": "Chọn đại từ giả định: Chỉ có \"It\" tạo thành cấu trúc câu chẻ hợp lệ. Chọn A."
        }
      }
    ]
  },
  "negative-inversion": {
    "slug": "negative-inversion",
    "categorySlug": "advanced-vstep-modifiers",
    "categoryTitle": "8. Cấu trúc Nâng cao VSTEP & TOEIC 800+",
    "title": "Đảo ngữ với trạng từ phủ định (Never, Seldom, Rarely, Hardly)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "800+",
    "totalQuestions": 48,
    "description": "Chinh phục chuyên đề đảo ngữ kinh điển xuất hiện trong mọi kỳ thi chuẩn hóa: Đưa trạng từ phủ định hoặc bán phủ định lên đầu câu, mượn trợ động từ đảo lên trước chủ ngữ.",
    "goldenRule": {
      "title": "Hệ Thống Đảo Ngữ Phủ Định Cốt Lõi:",
      "formulas": [
        "Negative Adverb + Auxiliary / Modal (do, does, did, have, can) + S + V-inf",
        "Cặp thời gian 1: Hardly / Scarcely + had + S + V3/ed + when + S + V2/ed",
        "Cặp thời gian 2: No sooner + had + S + V3/ed + than + S + V2/ed",
        "Only after / Only when + S + V, Aux + S + V"
      ],
      "note": "Các trạng từ/cụm từ phủ định đứng đầu câu: Never, Rarely, Seldom, Hardly, Scarcely, Barely, Little, Under no circumstances, On no account, In no way, At no time."
    },
    "quickTips": [
      "Gặp trạng từ phủ định đứng đầu câu ➔ 100% tìm phương án có TRỢ ĐỘNG TỪ đứng trước CHỦ NGỮ",
      "No sooner LUÔN ĐI VỚI THAN (so sánh hơn)",
      "Hardly / Scarcely LUÔN ĐI VỚI WHEN",
      "Under no circumstances (Dù trong bất kỳ hoàn cảnh nào cũng không) + Trợ động từ + S + V"
    ],
    "mascotTip": "Thần chú bất hủ: \"No sooner\" có chữ -ER so sánh hơn nên bắt buộc đi với THAN! \"Hardly\" đi với WHEN!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Phát hiện từ phủ định đầu câu",
          "action": "Xác định các từ: Never, Rarely, Seldom, Hardly, No sooner, Under no circumstances."
        },
        {
          "step": 2,
          "label": "Đảo trợ động từ",
          "action": "Đưa trợ từ phù hợp với thì (did/does/had/can) lên trước chủ ngữ."
        },
        {
          "step": 3,
          "label": "Kiểm tra cặp liên từ đi kèm",
          "action": "Nếu là No sooner ➔ tìm Than; nếu là Hardly ➔ tìm When."
        }
      ],
      "explanation": "Đảo ngữ phủ định được dùng để gia tăng sự kịch tính, nhấn mạnh tính tuyệt đối hoặc sự ngạc nhiên trong văn phong trang trọng."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "SELDOM HAVE WE WITNESSED such exponential market expansion"
      },
      {
        "id": "2",
        "formula": "NO SOONER HAD THE SHIPMENT ARRIVED THAN it was inspected"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Trạng từ đơn (Negative Adverbs)",
        "items": [
          "Never, Rarely, Seldom, Little, Hardly",
          "Cấu trúc: Từ phủ định + Trợ động từ + S + V",
          "Little did we know / Seldom do we see",
          "Nhấn mạnh tần suất hiếm hoi hoặc sự phủ định hoàn toàn"
        ],
        "note": "Ví dụ: Rarely does a new startup achieve profitability in its first quarter."
      },
      "rightBox": {
        "title": "Cụm giới từ phủ định (Negative Prepositions)",
        "items": [
          "Under no circumstances, On no account, At no time, In no way",
          "Bắt buộc đảo trợ động từ lên trước chủ ngữ ở mệnh đề chính",
          "Mang tính cảnh báo, điều lệ an ninh, quy tắc pháp lý nghiêm ngặt"
        ],
        "note": "Ví dụ: Under no circumstances should confidential files be disclosed."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy ghép No sooner với When hoặc Hardly với Than",
        "explanation": "Đây là cái bẫy kinh điển nhất trong Part 5 & VSTEP B2. Nhớ quy tắc: No sooner... THAN; Hardly / Scarcely... WHEN.",
        "wrongExample": "No sooner had the contract been printed when the client cancelled.",
        "rightExample": "No sooner had the contract been printed than the client cancelled."
      },
      {
        "id": 2,
        "title": "Bẫy không đảo trợ động từ khi từ phủ định đứng đầu",
        "explanation": "Thí sinh thấy từ phủ định nhưng vẫn chọn trật tự câu thông thường (S + V) thay vì đảo trợ động từ (Aux + S + V).",
        "wrongExample": "Seldom the department has exceeded its annual revenue quota.",
        "rightExample": "Seldom has the department exceeded its annual revenue quota."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "Rarely has our corporation encountered such enthusiastic consumer feedback for a newly launched product line.",
        "sentenceVi": "Hiếm khi nào tập đoàn của chúng ta nhận được phản hồi nhiệt tình như vậy từ người tiêu dùng cho một dòng sản phẩm mới ra mắt.",
        "highlightRule": "Đảo ngữ hiện tại hoàn thành: Rarely has our corporation encountered..."
      },
      {
        "id": 2,
        "sentenceEn": "No sooner had the executive concluded his keynote speech than attendees raised questions regarding market risks.",
        "sentenceVi": "Ngay khi vị giám đốc điều hành vừa kết thúc bài phát biểu khai mạc thì các khách tham dự đã đặt ra những câu hỏi liên quan đến rủi ro thị trường.",
        "highlightRule": "Đảo ngữ No sooner... than: No sooner had the executive concluded... than attendees raised..."
      }
    ],
    "questions": [
      {
        "id": 1,
        "part": 5,
        "targetTags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "800+",
        "question": "Under no circumstances _______ personal electronic devices to be connected to the company's secure internal intranet.",
        "options": [
          {
            "key": "A",
            "text": "are",
            "explanation": "Chính xác! Đảo ngữ với cụm phủ định \"Under no circumstances\": Cụm phủ định + be (are) + S (personal devices) + to V."
          },
          {
            "key": "B",
            "text": "they are",
            "explanation": "Sai. Chưa đảo trợ động từ lên trước chủ ngữ, thừa đại từ \"they\"."
          },
          {
            "key": "C",
            "text": "should",
            "explanation": "Sai ngữ pháp. Nếu dùng should thì động từ theo sau là bare-infinitive (be connected), ở đây phía sau có \"to be connected\" nên đi với to be."
          },
          {
            "key": "D",
            "text": "have",
            "explanation": "Sai ngữ pháp khi kết hợp với \"to be connected\"."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Đảo ngữ với cụm từ phủ định \"Under no circumstances\": Aux/To be + S + to-V.",
        "threeStepReasoning": {
          "step1": "Phát hiện cụm từ phủ định đứng đầu câu: \"Under no circumstances\" (Tuyệt đối không trong bất kỳ tình huống nào).",
          "step2": "Xác định quy tắc đảo ngữ: Cần một trợ động từ hoặc động từ to be đứng ngay sau cụm từ phủ định và trước chủ ngữ \"personal electronic devices\".",
          "step3": "Chọn dạng phù hợp: \"are personal electronic devices to be connected\" (cấu trúc be to-V mang nghĩa quy định/mệnh lệnh). Chọn A."
        }
      },
      {
        "id": 2,
        "part": 5,
        "targetTags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "800+",
        "question": "Hardly _______ the emergency evacuation siren sounded when employees assembled calmly in the designated courtyard.",
        "options": [
          {
            "key": "A",
            "text": "had",
            "explanation": "Chính xác! Cấu trúc đảo ngữ: Hardly + had + S (the siren) + V3 (sounded) + when + S + V2."
          },
          {
            "key": "B",
            "text": "did",
            "explanation": "Sai. Sau \"did\" động từ phải là nguyên thể (sound), ở đây là \"sounded\" (V3)."
          },
          {
            "key": "C",
            "text": "has",
            "explanation": "Sai. Sự việc đã diễn ra trong quá khứ (vế sau chia assembled), phải dùng thì quá khứ hoàn thành \"had\"."
          },
          {
            "key": "D",
            "text": "was",
            "explanation": "Sai. Tiếng còi vang lên mang tính chủ động trong thì hoàn thành (had sounded)."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Cấu trúc cố định: Hardly had + S + V3/ed + when + S + V2/ed.",
        "threeStepReasoning": {
          "step1": "Nhận diện liên từ: \"Hardly\" đứng đầu câu và liên từ \"when\" ở vế thứ hai.",
          "step2": "Đối chiếu công thức: Hardly + had + S + V3/ed + when + S + V2/ed.",
          "step3": "Chọn trợ động từ: \"had\" là trợ động từ duy nhất đúng cho cấu trúc này. Chọn A."
        }
      }
    ]
  },
  "concession-purpose-clauses": {
    "slug": "concession-purpose-clauses",
    "categorySlug": "advanced-vstep-modifiers",
    "categoryTitle": "8. Cấu trúc Nâng cao VSTEP & TOEIC 800+",
    "title": "Mệnh đề Nhượng bộ & Mục đích nâng cao (Concession & Purpose)",
    "targetTags": [
      "VSTEP",
      "TOEIC"
    ],
    "level": "800+",
    "totalQuestions": 44,
    "description": "Nâng cấp kỹ năng viết học thuật và giải quyết các câu hỏi cấu trúc ngữ pháp cao cấp: Đảo ngữ tính từ với AS/THOUGH, cấu trúc HOWEVER + Adj + S + V, và các liên từ chỉ mục đích nâng cao (in order that, lest, for fear that).",
    "goldenRule": {
      "title": "Các Công thức Nhượng bộ & Mục đích Cao cấp:",
      "formulas": [
        "Đảo ngữ nhượng bộ: Adj / Adv + as / though + S + V, S + V",
        "However nhượng bộ: However / No matter how + adj / adv + S + V, S + V",
        "Mục đích nâng cao: mathbf{so that / in order that + S + {can/could/may/might} + V}",
        "Phòng ngừa: lest + S + (should) + V-inf quad / quad for fear that + S + might + V"
      ],
      "note": "Công thức \"Difficult as it was\" tương đương với \"Although it was difficult\". Từ \"lest\" mang nghĩa là \"vì sợ rằng / để không bị\" và đi kèm thức giả định nguyên mẫu."
    },
    "quickTips": [
      "Thấy Tính từ hoặc Trạng từ đứng trơ trọi ở đầu câu trước chỗ trống ➔ Chọn AS hoặc THOUGH (Adj + as + S + V)",
      "Sau \"However\" đứng đầu mệnh đề nhượng bộ là TÍNH TỪ hoặc TRẠNG TỪ ngay liền kề (However challenging the exam may be)",
      "Lest đi kèm động từ nguyên thể không chia: lest the deal fail"
    ],
    "mascotTip": "Thần chú bẫy VSTEP C1: Cứ thấy tính từ đứng đầu câu như \"Expensive as it was, they bought it\" ➔ Nhớ công thức ADJ + AS/THOUGH + S + V!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Quan sát trật tự từ khác thường",
          "action": "Phát hiện tính từ/trạng từ bị đảo lên đầu trước liên từ (Expensive as / However difficult)."
        },
        {
          "step": 2,
          "label": "Phân tích quan hệ ý nghĩa",
          "action": "Ý câu diễn tả sự tương phản/nhượng bộ (Mặc dù...) hay mục đích (Để cho...)?"
        },
        {
          "step": 3,
          "label": "Chọn liên từ chuẩn xác",
          "action": "Khớp công thức tương ứng và kiểm tra thể động từ ở mệnh đề phụ."
        }
      ],
      "explanation": "Các biến thể nhượng bộ và mục đích nâng cao giúp bài viết học thuật có sự linh hoạt trong ngữ pháp và đạt tiêu chuẩn điểm số cao."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "RIGOROUS AS the security check was, passengers REMAINED patient"
      },
      {
        "id": "2",
        "formula": "HOWEVER LUCRATIVE the offer may seem, we MUST PROCEED with caution"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Nhượng bộ Đảo ngữ (Concession Inversion)",
        "items": [
          "Adj / Adv + as / though + S + V",
          "However + Adj / Adv + S + V",
          "No matter what / how / where + S + V",
          "Tạo điểm nhấn mạnh hơn rất nhiều so với although / even though"
        ],
        "note": "Ví dụ: Fast though he ran, he could not catch the last train."
      },
      "rightBox": {
        "title": "Mục đích & Phòng ngừa (Purpose & Precaution)",
        "items": [
          "so that / in order that + S + modal + V",
          "so as to / in order to + V-inf",
          "lest + S + (should) + V-inf (vì sợ rằng)",
          "for fear that + S + might + V"
        ],
        "note": "Ví dụ: They encrypted the files lest unauthorized parties access them."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy trật tự từ sau However trong văn cảnh nhượng bộ",
        "explanation": "Thí sinh hay quen viết \"However S + V + adj\". Trong mệnh đề nhượng bộ đồng nghĩa với No matter how, tính từ/trạng từ PHẢI ĐỨNG NGAY SAU However.",
        "wrongExample": "However the project was demanding, we delivered on schedule.",
        "rightExample": "However demanding the project was, we delivered on schedule."
      },
      {
        "id": 2,
        "title": "Bẫy dùng \"although\" thay vì \"as\" khi tính từ đứng đầu",
        "explanation": "Nhiều người thấy nghĩa \"mặc dù\" nên chọn Although khi thấy tính từ đứng đầu (Difficult although it was). Quy tắc: Chỉ có AS hoặc THOUGH mới đứng sau tính từ đảo ngữ.",
        "wrongExample": "Challenging although the negotiations were, a consensus was reached.",
        "rightExample": "Challenging though the negotiations were, a consensus was reached."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "Unfavorable as the macroeconomic climate appeared, the tech firm posted a record quarterly revenue.",
        "sentenceVi": "Dù bối cảnh kinh tế vĩ mô có vẻ không thuận lợi, công ty công nghệ này vẫn ghi nhận mức doanh thu quý kỷ lục.",
        "highlightRule": "Đảo ngữ nhượng bộ với As: Unfavorable as the macroeconomic climate appeared..."
      },
      {
        "id": 2,
        "sentenceEn": "The firm upgraded its backup generators lest an abrupt blackout disrupt the central cloud servers.",
        "sentenceVi": "Doanh nghiệp đã nâng cấp các máy phát điện dự phòng vì sợ rằng sự cố mất điện đột ngột có thể làm gián đoạn máy chủ đám mây trung tâm.",
        "highlightRule": "Mục đích phòng ngừa với Lest: lest an abrupt blackout disrupt (nguyên mẫu)..."
      }
    ],
    "questions": [
      {
        "id": 1,
        "part": 5,
        "targetTags": [
          "VSTEP",
          "TOEIC"
        ],
        "level": "800+",
        "question": "Promising _______ the preliminary lab trial results were, the pharmaceutical board opted to conduct further verification.",
        "options": [
          {
            "key": "A",
            "text": "as",
            "explanation": "Chính xác! Cấu trúc nhượng bộ đảo tính từ lên đầu: Adj (Promising) + as + S (results) + V (were), mang nghĩa \"Dù cho kết quả đầy hứa hẹn...\"."
          },
          {
            "key": "B",
            "text": "although",
            "explanation": "Sai. \"Although\" không đứng sau tính từ theo cấu trúc đảo ngữ này."
          },
          {
            "key": "C",
            "text": "despite",
            "explanation": "Sai. \"Despite\" là giới từ, đi với danh từ hoặc V-ing, không đứng giữa tính từ và mệnh đề."
          },
          {
            "key": "D",
            "text": "so",
            "explanation": "Sai cấu trúc và sai hoàn toàn về ý nghĩa ngữ pháp."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Cấu trúc đảo ngữ tính từ chỉ sự nhượng bộ: Adj + as / though + S + V.",
        "threeStepReasoning": {
          "step1": "Phân tích đầu câu: Tính từ \"Promising\" (đầy hứa hẹn) đứng đơn độc ở vị trí đầu câu trước chỗ trống.",
          "step2": "Nhận diện cấu trúc nhượng bộ đặc biệt: Mô hình [Adj] + as/though + [S] + [V], [Mệnh đề chính].",
          "step3": "Chọn liên từ: \"as\" hoặc \"though\" phù hợp. Phương án A có \"as\". Chọn A."
        }
      },
      {
        "id": 2,
        "part": 5,
        "targetTags": [
          "VSTEP",
          "TOEIC"
        ],
        "level": "800+",
        "question": "The financial advisor recommended diversifying the investment portfolio _______ market volatility jeopardize the client’s capital.",
        "options": [
          {
            "key": "A",
            "text": "lest",
            "explanation": "Chính xác! \"Lest\" mang nghĩa \"vì sợ rằng/để phòng ngừa\", đi cùng mệnh đề thức giả định: lest + S (market volatility) + V-inf (jeopardize - không thêm s)."
          },
          {
            "key": "B",
            "text": "so that",
            "explanation": "Sai nghĩa. \"So that\" nghĩa là \"để mà\" (mục đích tích cực), trái ngược với việc làm nguy hại (jeopardize) vốn đầu tư."
          },
          {
            "key": "C",
            "text": "in order to",
            "explanation": "Sai. Sau \"in order to\" phải là một động từ nguyên mẫu, không đi với mệnh đề S+V."
          },
          {
            "key": "D",
            "text": "unless",
            "explanation": "Sai nghĩa và không đi kèm thức giả định nguyên thể trong ngữ cảnh này."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Liên từ phòng ngừa \"lest + S + (should) + V-inf\": vì sợ rằng biến động thị trường gây nguy hại đến vốn đầu tư.",
        "threeStepReasoning": {
          "step1": "Quan sát mệnh đề sau chỗ trống: \"market volatility jeopardize\" ➔ Động từ \"jeopardize\" ở dạng nguyên mẫu không chia dù chủ ngữ số ít.",
          "step2": "Phân tích ý nghĩa: Đa dạng hóa danh mục đầu tư \"vì sợ rằng\" biến động thị trường làm mất vốn.",
          "step3": "Chọn liên từ: \"lest\" vừa mang nghĩa phòng tránh rủi ro vừa đi kèm động từ nguyên thể thức giả định. Chọn A."
        }
      }
    ]
  },
  "reported-speech-variants": {
    "slug": "reported-speech-variants",
    "categorySlug": "advanced-vstep-modifiers",
    "categoryTitle": "8. Cấu trúc Nâng cao VSTEP & TOEIC 800+",
    "title": "Câu gián tiếp với Động từ tường thuật biến đổi (Reporting Verbs)",
    "targetTags": [
      "VSTEP",
      "TOEIC"
    ],
    "level": "800+",
    "totalQuestions": 42,
    "description": "Chinh phục hệ thống động từ tường thuật cao cấp (Reporting Verbs) thay thế cho \"say\" và \"tell\": Động từ đi kèm to-infinitive, động từ đi kèm V-ing, và các giới từ cố định đi kèm trong văn cảnh giao tiếp công sở chuyên nghiệp.",
    "goldenRule": {
      "title": "Bảng Phân Nhóm Động Từ Tường Thuật Cần Nhớ:",
      "formulas": [
        "V + to-V: promise, offer, refuse, agree, threat, demand, decide",
        "V + O + to-V: remind, advise, encourage, warn, urge, invite, forbid, permit",
        "V + V-ing: admit, deny, suggest, recommend",
        "V + O + prep + V-ing: accuse OF, apologize FOR, congratulate ON, thank FOR, blame FOR"
      ],
      "note": "Khi dùng các động từ tường thuật đặc thù, câu gián tiếp không cần quy trình lùi thì phức tạp mà tuân thủ đúng dạng thức danh động từ/nguyên mẫu của động từ đó."
    },
    "quickTips": [
      "Remind đi với: remind + O + to-V (Remind him to send the email)",
      "Warn đi với: warn + O + (not) to-V hoặc warn + O + about/against + V-ing",
      "Accuse ai làm gì: accuse + someone + OF + V-ing (buộc tội)",
      "Congratulate ai: congratulate + someone + ON + V-ing (chúc mừng)"
    ],
    "mascotTip": "Thần chú bắt giới từ: \"Congratulate ON\", \"Accuse OF\", \"Apologize FOR\", \"Prevent FROM\" - Bất di bất dịch!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Nhận diện động từ tường thuật",
          "action": "Xác định động từ dẫn dắt (remind, congratulate, accuse, refuse)."
        },
        {
          "step": 2,
          "label": "Kiểm tra thành phần sau động từ",
          "action": "Có tân ngữ (O) đứng ngay sau không? Có giới từ cố định nào không?"
        },
        {
          "step": 3,
          "label": "Chọn dạng thức động từ",
          "action": "Lựa chọn to-V, V-ing hay giới từ + V-ing tương ứng với mẫu ngữ pháp của động từ đó."
        }
      ],
      "explanation": "Động từ tường thuật biến đổi cô đọng nội dung lời nói và biểu đạt chính xác thái độ, mục đích giao tiếp của người nói."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "REMINDED all staff TO SUBMIT their travel receipts"
      },
      {
        "id": "2",
        "formula": "CONGRATULATED the sales director ON EXCEEDING the target"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Động từ đi kèm Tân ngữ + to-V",
        "items": [
          "remind someone to do something (nhắc nhở)",
          "encourage someone to do something (khuyến khích)",
          "warn someone not to do something (cảnh báo)",
          "advise someone to do something (khuyên bảo)"
        ],
        "note": "Ví dụ: The supervisor reminded me to lock the file cabinet."
      },
      "rightBox": {
        "title": "Động từ đi kèm Giới từ + V-ing",
        "items": [
          "apologize to someone for doing something (xin lỗi)",
          "accuse someone of doing something (buộc tội)",
          "congratulate someone on doing something (chúc mừng)",
          "insist on doing something (khăng khăng)"
        ],
        "note": "Ví dụ: The manager apologized for delaying the feedback."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy dùng sai giới từ với Congratulate và Accuse",
        "explanation": "Đề thi hay gài \"congratulate someone for\" (sai, phải là ON) hoặc \"accuse someone for\" (sai, phải là OF).",
        "wrongExample": "The board congratulated Ms. Patel for her appointment.",
        "rightExample": "The board congratulated Ms. Patel on her appointment."
      },
      {
        "id": 2,
        "title": "Bẫy chia V-ing sau động từ Remind",
        "explanation": "Thí sinh hay nhầm remind với remember nên chọn V-ing. Nhớ rằng: Remind + O + TO-V (nhắc nhở ai làm gì trong tương lai).",
        "wrongExample": "Please remind the delegates attending the keynote session.",
        "rightExample": "Please remind the delegates to attend the keynote session."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "The CEO warmly congratulated the engineering division on successfully launching the satellite ahead of schedule.",
        "sentenceVi": "Tổng giám đốc điều hành đã nồng nhiệt chúc mừng bộ phận kỹ thuật vì đã phóng thành công vệ tinh trước thời hạn.",
        "highlightRule": "Động từ tường thuật với giới từ: congratulated the division on successfully launching..."
      },
      {
        "id": 2,
        "sentenceEn": "The legal department strictly warned all personnel against downloading unverified software onto company workstations.",
        "sentenceVi": "Phòng pháp chế đã nghiêm khắc cảnh báo toàn thể nhân viên về việc không được tải phần mềm chưa kiểm chứng vào máy trạm công ty.",
        "highlightRule": "Cảnh báo phòng tránh: warned all personnel against downloading..."
      }
    ],
    "questions": [
      {
        "id": 1,
        "part": 5,
        "targetTags": [
          "VSTEP",
          "TOEIC"
        ],
        "level": "800+",
        "question": "The committee chairperson congratulated the research fellows _______ securing the prestigious European scientific grant.",
        "options": [
          {
            "key": "A",
            "text": "on",
            "explanation": "Chính xác! Cấu trúc chuẩn mực: congratulate someone ON doing something (chúc mừng ai vì việc gì)."
          },
          {
            "key": "B",
            "text": "for",
            "explanation": "Sai. \"Congratulate someone for\" là lỗi phổ biến, tiếng Anh chuẩn bắt buộc dùng giới từ \"on\"."
          },
          {
            "key": "C",
            "text": "about",
            "explanation": "Sai giới từ."
          },
          {
            "key": "D",
            "text": "with",
            "explanation": "Sai giới từ."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Mẫu động từ tường thuật: congratulate + O + on + V-ing/Noun.",
        "threeStepReasoning": {
          "step1": "Nhận diện động từ chính: \"congratulated the research fellows\" (chúc mừng các nghiên cứu viên).",
          "step2": "Xác định giới từ đi kèm: Động từ \"congratulate\" đi với giới từ \"on\" + V-ing.",
          "step3": "Chọn đáp án A (on). Loại trừ for, about, with."
        }
      },
      {
        "id": 2,
        "part": 5,
        "targetTags": [
          "VSTEP",
          "TOEIC"
        ],
        "level": "800+",
        "question": "The office manager sent an urgent memo reminding all departmental heads _______ their quarterly budget reconciliations by noon.",
        "options": [
          {
            "key": "A",
            "text": "to submit",
            "explanation": "Chính xác! Cấu trúc động từ tường thuật: remind + someone + to-V (nhắc ai làm điều gì)."
          },
          {
            "key": "B",
            "text": "submitting",
            "explanation": "Sai. \"Remind\" không đi với V-ing (khác với remember)."
          },
          {
            "key": "C",
            "text": "submit",
            "explanation": "Sai. Thiếu \"to\" trong cấu trúc remind someone to do something."
          },
          {
            "key": "D",
            "text": "submitted",
            "explanation": "Sai thì và sai dạng thức ngữ pháp."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Cấu trúc tường thuật câu nhắc nhở/mệnh lệnh: remind + O + to-V.",
        "threeStepReasoning": {
          "step1": "Phân tích động từ dẫn: \"reminding all departmental heads\" (nhắc nhở các trưởng bộ phận).",
          "step2": "Khớp cấu trúc ngữ pháp: remind + O + to-infinitive.",
          "step3": "Chọn dạng động từ: \"to submit\". Chọn A."
        }
      }
    ]
  },
  "linking-verbs": {
    "slug": "linking-verbs",
    "categorySlug": "advanced-vstep-modifiers",
    "categoryTitle": "8. Cấu trúc Nâng cao VSTEP & TOEIC 800+",
    "title": "Động từ nối & Động từ hệ từ (Linking Verbs + Adjective)",
    "targetTags": [
      "TOEIC",
      "VSTEP"
    ],
    "level": "600+",
    "totalQuestions": 45,
    "description": "Thấu suốt bản chất của Động từ nối (Linking Verbs / Copular Verbs): Động từ không diễn tả hành động cụ thể mà kết nối chủ ngữ với một tính từ mô tả trạng thái hoặc bản chất của chủ ngữ.",
    "goldenRule": {
      "title": "Quy Tắc Vàng Về Động Từ Nối:",
      "formulas": [
        "S + Linking Verb + ADJECTIVE quad (KHÔNG dùng Trạng từ - Adv)",
        "Nhóm tri giác: look, sound, smell, taste, feel + adj",
        "Nhóm giữ nguyên trạng thái: remain, stay, keep, hold + adj",
        "Nhóm biến đổi/chứng minh: become, get, turn, grow, prove + adj",
        "Nhóm dường như: seem, appear + adj"
      ],
      "note": "Dù trong tiếng Việt dịch là \"vẫn duy trì MỘT CÁCH cạnh tranh\", tiếng Anh bắt buộc dùng TÍNH TỪ: remain competitive (không dùng remain competitively)."
    },
    "quickTips": [
      "Gặp \"remain, stay, keep, become, seem, appear\" ➔ Chỗ trống đứng sau 90% chọn TÍNH TỪ",
      "Muốn thử xem có phải Linking Verb không: Thay động từ đó bằng \"IS/ARE/WAS/WERE\", nếu câu vẫn có nghĩa hợp lý thì đó là Linking Verb",
      "Lưu ý: Nếu động từ đó được bổ nghĩa bởi trạng từ, trạng từ sẽ đứng TRƯỚC linking verb (The plan seems reasonably practical)"
    ],
    "mascotTip": "Thần chú điểm 600+: Thấy REMAIN hoặc STAY có chỗ trống theo sau ➔ Bỏ qua ngay các đuôi -ly, chọn ngay phương án TÍNH TỪ!",
    "mentalModel": {
      "flowSteps": [
        {
          "step": 1,
          "label": "Xác định loại động từ",
          "action": "Phát hiện các động từ: remain, stay, seem, appear, sound, look, become."
        },
        {
          "step": 2,
          "label": "Thử nghiệm thay thế bằng \"To Be\"",
          "action": "Thay động từ bằng to be; nếu câu vẫn giữ nguyên ý nghĩa mô tả chủ ngữ ➔ Đây là linking verb."
        },
        {
          "step": 3,
          "label": "Chọn tính từ bổ nghĩa",
          "action": "Chọn Tính từ (Adjective) để làm bổ ngữ cho chủ ngữ (Subject Complement)."
        }
      ],
      "explanation": "Linking verbs đóng vai trò như dấu bằng (=) liên kết chủ ngữ với tính chất của nó, do đó cần một tính từ chứ không phải trạng từ."
    },
    "quickFormulas": [
      {
        "id": "1",
        "formula": "REMAIN COMPETITIVE in the global marketplace"
      },
      {
        "id": "2",
        "formula": "THE PROPOSAL SEEMS HIGHLY VIABLE for our budget"
      }
    ],
    "usageComparison": {
      "leftBox": {
        "title": "Linking Verb + Tính từ",
        "items": [
          "Động từ đóng vai trò liên kết trạng thái",
          "Bổ nghĩa cho Chủ ngữ (Subject)",
          "Các động từ: remain, stay, look, seem, appear, taste, sound, prove",
          "Ví dụ: The weather remains cold."
        ],
        "note": "Ví dụ: The solution proved extremely effective."
      },
      "rightBox": {
        "title": "Action Verb + Trạng từ",
        "items": [
          "Động từ diễn tả hành động vật lý cụ thể",
          "Bổ nghĩa cho Động từ (Verb)",
          "Dùng trạng từ đuôi -ly để chỉ cách thức thực hiện",
          "Ví dụ: He looked at the painting carefully."
        ],
        "note": "Ví dụ: She tasted the soup hesitantly."
      }
    },
    "traps": [
      {
        "id": 1,
        "title": "Bẫy trạng từ sau \"remain\" và \"stay\"",
        "explanation": "Thí sinh dịch câu sang tiếng Việt thấy có chữ \"một cách\" (duy trì một cách ổn định) liền vội vàng chọn đuôi -ly. Nhớ rằng: sau remain/stay PHẢI LÀ TÍNH TỪ.",
        "wrongExample": "Despite market volatility, the exchange rates remained stably.",
        "rightExample": "Despite market volatility, the exchange rates remained stable."
      },
      {
        "id": 2,
        "title": "Bẫy trạng từ bổ nghĩa cho chính tính từ sau linking verb",
        "explanation": "Đề thi hay đặt chỗ trống giữa linking verb và tính từ: \"remained _______ competitive\". Vị trí này bổ nghĩa cho tính từ \"competitive\" nên lại cần một TRẠNG TỪ (remained highly competitive).",
        "wrongExample": "The firm remained remarkable competitive.",
        "rightExample": "The firm remained remarkably competitive."
      }
    ],
    "examples": [
      {
        "id": 1,
        "sentenceEn": "To remain competitive in today's fast-paced digital economy, corporations must invest continuously in worker training.",
        "sentenceVi": "Để duy trì tính cạnh tranh trong nền kinh tế số biến chuyển nhanh hiện nay, các tập đoàn phải liên tục đầu tư vào đào tạo người lao động.",
        "highlightRule": "Linking Verb + Tính từ: To remain competitive (không dùng competitively)..."
      },
      {
        "id": 2,
        "sentenceEn": "The initial findings of the clinical trial appeared promising, prompting the board to approve phase two.",
        "sentenceVi": "Những phát hiện ban đầu của cuộc thử nghiệm lâm sàng dường như rất nhiều triển vọng, thúc đẩy hội đồng phê duyệt giai đoạn hai.",
        "highlightRule": "Linking Verb \"appear\" + Tính từ: appeared promising..."
      }
    ],
    "questions": [
      {
        "id": 1,
        "part": 5,
        "targetTags": [
          "TOEIC"
        ],
        "level": "600+",
        "question": "Despite sharp fluctuations in raw material costs, the retail price of our flagship merchandise has remained _______ throughout the year.",
        "options": [
          {
            "key": "A",
            "text": "stable",
            "explanation": "Chính xác! \"Remain\" là động từ nối (linking verb), theo sau là tính từ \"stable\" để bổ nghĩa cho chủ ngữ \"the retail price\"."
          },
          {
            "key": "B",
            "text": "stably",
            "explanation": "Sai. Trạng từ \"stably\" không đi trực tiếp sau linking verb \"remain\" để làm vị ngữ."
          },
          {
            "key": "C",
            "text": "stability",
            "explanation": "Sai. \"Stability\" là danh từ, không diễn tả trạng thái của mức giá bán lẻ trong câu này."
          },
          {
            "key": "D",
            "text": "stabilize",
            "explanation": "Sai. \"Stabilize\" là động từ nguyên mẫu, không phù hợp về ngữ pháp sau \"has remained\"."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Linking verb \"remain\" đi kèm tính từ (Adjective) làm bổ ngữ cho chủ ngữ.",
        "threeStepReasoning": {
          "step1": "Xác định động từ trước chỗ trống: \"has remained\" (thì hiện tại hoàn thành của động từ nối remain).",
          "step2": "Nhận diện quy tắc ngữ pháp: Sau linking verb \"remain/stay/keep\" cần một Tính từ bổ nghĩa cho chủ ngữ.",
          "step3": "Chọn đáp án tính từ: Loại B (trạng từ stably), C (danh từ stability), D (động từ stabilize). Chọn A (stable)."
        }
      },
      {
        "id": 2,
        "part": 5,
        "targetTags": [
          "TOEIC",
          "VSTEP"
        ],
        "level": "600+",
        "question": "The structural modifications proposed by the external architectural consultant seem _______ and economically feasible.",
        "options": [
          {
            "key": "A",
            "text": "practical",
            "explanation": "Chính xác! \"Seem\" là linking verb nối với cặp tính từ song hành: \"practical and economically feasible\"."
          },
          {
            "key": "B",
            "text": "practically",
            "explanation": "Sai. Không dùng trạng từ \"practically\" làm bổ ngữ nối với \"and feasible\"."
          },
          {
            "key": "C",
            "text": "practitioner",
            "explanation": "Sai. \"Practitioner\" là danh từ chỉ người (người hành nghề), sai nghĩa."
          },
          {
            "key": "D",
            "text": "practice",
            "explanation": "Sai. \"Practice\" là danh từ sự thực hành hoặc động từ, không hòa hợp với linking verb \"seem\"."
          }
        ],
        "correctAnswer": "A",
        "explanation": "Linking verb \"seem\" + Adj. Ngoài ra có liên từ \"and\" nối với tính từ \"feasible\" tạo thành cấu trúc song hành (practical and feasible).",
        "threeStepReasoning": {
          "step1": "Phân tích vị trí: Chỗ trống đứng sau linking verb \"seem\" và trước liên từ \"and economically feasible\" (tính từ).",
          "step2": "Áp dụng 2 quy tắc đồng thời: Linking verb đi với tính từ + Cấu trúc song hành với tính từ \"feasible\".",
          "step3": "Chọn tính từ: \"practical\" (thực tiễn). Chọn A."
        }
      }
    ]
  }
};

export const grammarAliases: Record<string, string> = {
  "cac-thi-hien-tai": "present-tenses",
  "cac-thi-qua-khu": "past-tenses",
  "cac-thi-tuong-lai": "future-tenses",
  "cac-thi-hoan-thanh": "perfect-tenses",
  "su-phoi-hop-thi": "sequence-of-tenses",
  "danh-tu-cum-danh-tu": "nouns-and-noun-phrases",
  "dai-tu": "pronouns-reflexive-possessive",
  "tinh-tu": "adjectives-ing-ed",
  "trang-tu": "adverbs-and-positions",
  "mao-tu-luong-tu": "articles-and-quantifiers",
  "cau-bi-dong": "passive-voice",
  "su-hoa-hop-s-v": "subject-verb-agreement",
  "dong-tu-nguyen-mau": "to-infinitive-and-bare-v",
  "danh-dong-tu": "gerunds-v-ing",
  "dong-tu-khuyet-thieu": "modal-verbs",
  "gioi-tu": "prepositions-time-place",
  "gioi-tu-nang-cao": "advanced-toeic-prepositions",
  "lien-tu-ket-hop": "coordinating-correlative-conjunctions",
  "lien-tu-phu-thuoc": "subordinating-conjunctions",
  "menh-de-quan-he": "relative-clauses",
  "rut-gon-menh-de-quan-he": "reduced-relative-clauses",
  "menh-de-danh-tu": "noun-clauses",
  "menh-de-trang-ngu": "adverbial-clauses",
  "cau-so-sanh": "comparisons-equal-higher-superlative",
  "so-sanh-kep": "double-comparisons-and-multiples",
  "cau-dieu-kien": "conditional-sentences",
  "dao-ngu-dieu-kien": "conditional-inversion",
  "thuc-gia-dinh": "subjunctive-mood",
  "cau-truc-cau-khien": "causative-structures",
  "dao-ngu-song-hanh": "inversion-and-parallelism",
  "cau-che": "cleft-sentences",
  "dao-ngu-phu-dinh": "negative-inversion",
  "menh-de-nhuong-bo": "concession-purpose-clauses",
  "cau-gian-tiep": "reported-speech-variants",
  "dong-tu-noi": "linking-verbs"
};

export function getGrammarTopic(slug: string): GrammarTopicDetail | undefined {
  if (!slug) return undefined;
  const canonicalSlug = grammarAliases[slug] || slug;
  return grammarDatabase[canonicalSlug];
}

export function getAllGrammarTopics(): GrammarTopicDetail[] {
  return Object.values(grammarDatabase);
}

export function getTopicsByCategory(categorySlug: string): GrammarTopicDetail[] {
  return Object.values(grammarDatabase).filter(t => t.categorySlug === categorySlug);
}
