const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'data');
if (!fs.existsSync(srcDir)) {
    fs.mkdirSync(srcDir, { recursive: true });
}

// Data definitions for 35 topics
const topicsData = [
  // ==========================================
  // NHÓM 1: THÌ THỜI GIAN (VERB TENSES)
  // ==========================================
  {
    slug: 'present-tenses',
    categorySlug: 'verb-tenses',
    categoryTitle: '1. Thì thời gian (Verb Tenses)',
    title: 'Các thì hiện tại',
    targetTags: ['TOEIC', 'VSTEP'],
    level: '0-500',
    totalQuestions: 50,
    description: 'Nắm vững cấu trúc, cách dùng thì Hiện tại đơn và Hiện tại tiếp diễn, mô hình tư duy 3 giây và bẫy đề stative verbs trong TOEIC Part 5 & 6.',
    goldenRule: {
      title: 'Quy tắc vàng Hiện tại:',
      formulas: ['$S + V(s/es)$', '$S + am/is/are + V\\text{-}ing$'],
      note: 'Hành động thói quen/định kỳ dùng Hiện tại đơn; hành động đang diễn ra tạm thời dùng Hiện tại tiếp diễn.'
    },
    quickTips: [
      'He, She, It, danh từ số ít ➔ V(s/es)',
      'We, They, danh từ số nhiều ➔ V nguyên mẫu',
      'currently, right now, at present ➔ Ưu tiên chọn Hiện tại tiếp diễn'
    ],
    mascotTip: 'Cú Đăng nhắc nhỏ: Gặp trạng từ "routinely" hoặc "regularly" thì 100% chọn Hiện tại đơn nhé!',
    mentalModel: {
      flowSteps: [
        { step: 1, label: 'Chủ ngữ', action: 'Xác định nhanh chủ ngữ số ít hay số nhiều' },
        { step: 2, label: 'Bản chất', action: 'Phân loại: Thói quen định kỳ hay đang diễn ra tạm thời?' },
        { step: 3, label: 'Khóa đáp án', action: 'Áp dụng quy tắc vàng và loại trừ bẫy stative verbs' }
      ],
      explanation: 'Tư duy cực nhanh theo flow: [Ai / Điều gì] → [Làm gì?]. Phân loại trong 3 giây: Thói quen hay hành động tạm thời?'
    },
    quickFormulas: [
      { id: '1', formula: 'S + V(s/es)' },
      { id: '2', formula: 'S + am/is/are + V-ing' },
      { id: '3', formula: 'S + do/does not + V_inf' }
    ],
    usageComparison: {
      leftBox: {
        title: 'Hiện tại đơn (Present Simple)',
        items: ['Thói quen công sở định kỳ', 'Quy chế công ty, điều khoản hợp đồng', 'Chân lý, lịch trình cố định'],
        note: 'Dấu hiệu: usually, regularly, routinely, every week'
      },
      rightBox: {
        title: 'Hiện tại tiếp diễn (Present Continuous)',
        items: ['Hành động đang xảy ra tại thời điểm nói', 'Dự án hoặc xu hướng đang tiến hành tạm thời', 'Kế hoạch đã định trong tương lai gần'],
        note: 'Dấu hiệu: currently, at the moment, this month'
      }
    },
    traps: [
      {
        id: 1,
        title: 'Bẫy Stative verbs không dùng thì tiếp diễn',
        explanation: 'Các động từ chỉ nhận thức, trạng thái, sở hữu (know, believe, belong to, contain, consist of, possess) không chia ở thì tiếp diễn trong đề thi TOEIC.',
        wrongExample: 'This confidential report is containing the fiscal audit results.',
        rightExample: 'This confidential report contains the fiscal audit results.'
      },
      {
        id: 2,
        title: 'Bẫy "Currently" kết hợp với chức vụ lâu dài',
        explanation: 'Khi nói về chức vụ chính thức ổn định, dù có "currently" vẫn chia Hiện tại đơn: "He currently serves as VP", không chia tiếp diễn.',
        wrongExample: 'Ms. Jenkins is currently serving as Chief Technology Officer.',
        rightExample: 'Ms. Jenkins currently serves as Chief Technology Officer.'
      }
    ],
    examples: [
      {
        id: 1,
        sentenceEn: 'Mr. Tanaka usually submits his monthly expenditure reports on the first Friday of each month.',
        sentenceVi: 'Ông Tanaka thường nộp báo cáo chi tiêu hàng tháng vào thứ Sáu đầu tiên của mỗi tháng.',
        highlightRule: 'Hiện tại đơn: thói quen định kỳ với "usually"'
      },
      {
        id: 2,
        sentenceEn: 'The maintenance engineering team is currently conducting safety inspections on all factory elevators.',
        sentenceVi: 'Đội ngũ kỹ thuật bảo trì hiện đang tiến hành thanh tra an toàn trên toàn bộ thang máy nhà máy.',
        highlightRule: 'Hiện tại tiếp diễn: dự án đang triển khai với "currently"'
      }
    ],
    questions: [
      {
        id: 1,
        questionText: 'The senior marketing manager routinely _______ comprehensive consumer surveys before launching any promotional campaign.',
        instruction: 'CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU',
        options: [
          { key: 'A', text: 'conducts', inlineExplanation: 'Chính xác. Động từ thêm -s chia theo chủ ngữ số ít "The senior marketing manager" và trạng từ "routinely".' },
          { key: 'B', text: 'is conducting', inlineExplanation: 'Sai. "routinely" chỉ thói quen định kỳ, không dùng tiếp diễn.' },
          { key: 'C', text: 'conducted', inlineExplanation: 'Sai thì quá khứ, không phù hợp với thói quen định kỳ.' },
          { key: 'D', text: 'conduct', inlineExplanation: 'Sai. Chủ ngữ là ngôi thứ ba số ít, động từ phải thêm -s.' }
        ],
        correctAnswer: 'A',
        reasoning: {
          step1_slotAnalysis: 'Đứng sau chủ ngữ "The senior marketing manager" và trạng từ "routinely" cần động từ chính chia thì.',
          step2_ruleApplication: {
            text: 'Trạng từ tần suất "routinely" (định kỳ) đòi hỏi thì Hiện tại đơn.',
            eliminatedKeys: ['B', 'C']
          },
          step3_grammaticalClue: {
            text: 'Chủ ngữ số ít ngôi thứ ba đòi hỏi động từ thêm "-s" -> loại "conduct".',
            eliminatedKeys: ['D']
          },
          finalConclusion: 'Chọn A - "conducts".'
        },
        recapNote: 'Hiện tại đơn: $S(\\text{số ít}) + V(s/es)$ đi với các trạng từ tần suất routinely, regularly, usually.'
      },
      {
        id: 2,
        questionText: 'Nexis Tech _______ several software upgrades to its mobile banking platform throughout this month.',
        instruction: 'CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU',
        options: [
          { key: 'A', text: 'introduces', inlineExplanation: 'Sai. "throughout this month" chỉ dự án tạm thời diễn ra trong tháng, không phải quy luật vĩnh cửu.' },
          { key: 'B', text: 'is introducing', inlineExplanation: 'Chính xác. Thì Hiện tại tiếp diễn diễn tả hành động đang triển khai trong khoảng thời gian hiện tại.' },
          { key: 'C', text: 'introduced', inlineExplanation: 'Sai. "throughout this month" chưa kết thúc, không dùng quá khứ đơn.' },
          { key: 'D', text: 'introduce', inlineExplanation: 'Sai dạng chia động từ cho chủ ngữ số ít.' }
        ],
        correctAnswer: 'B',
        reasoning: {
          step1_slotAnalysis: 'Vị trí vị ngữ chính của câu sau danh từ công ty "Nexis Tech".',
          step2_ruleApplication: {
            text: 'Cụm trạng từ "throughout this month" chỉ một quá trình đang triển khai trong tháng ➔ Hiện tại tiếp diễn.',
            eliminatedKeys: ['A', 'C']
          },
          step3_grammaticalClue: {
            text: 'Chủ ngữ số ít đi với trợ động từ "is" + V-ing.',
            eliminatedKeys: ['D']
          },
          finalConclusion: 'Chọn B - "is introducing".'
        },
        recapNote: 'Hiện tại tiếp diễn: $S + \\text{am/is/are} + V\\text{-}ing$ diễn tả dự án/sự vụ tạm thời trong giai đoạn hiện hành.'
      }
    ]
  },

  {
    slug: 'past-tenses',
    categorySlug: 'verb-tenses',
    categoryTitle: '1. Thì thời gian (Verb Tenses)',
    title: 'Các thì quá khứ',
    targetTags: ['TOEIC', 'VSTEP'],
    level: '0-500',
    totalQuestions: 50,
    description: 'Nắm vững cấu trúc, cách dùng thì Quá khứ đơn và Quá khứ tiếp diễn, phân biệt dấu hiệu ago, yesterday, last week.',
    goldenRule: {
      title: 'Quy tắc vàng Quá khứ:',
      formulas: ['$S + V_{ed} / V_2$', '$S + \\text{was/were} + V\\text{-}ing$'],
      note: 'Hành động đã chấm dứt hoàn toàn trong quá khứ và có thời gian xác định.'
    },
    quickTips: [
      'Gặp yesterday, ago, last, in + năm quá khứ ➔ Chọn ngay Quá khứ đơn',
      'Hành động đang xảy ra (quá khứ tiếp diễn) thì hành động khác chen vào (quá khứ đơn)',
      'While + was/were + V-ing, When + V-ed'
    ],
    mascotTip: 'Mẹo phòng thi: Thấy "ago" đứng cuối câu, lập tức khoanh ngay V-ed/V2 không cần dịch cả câu!',
    mentalModel: {
      flowSteps: [
        { step: 1, label: 'Thời điểm', action: 'Đã kết thúc trong quá khứ chưa?' },
        { step: 2, label: 'Dấu hiệu', action: 'Tìm ago, last, yesterday, while, when' },
        { step: 3, label: 'Phân loại', action: 'Hành động đơn lẻ hay cắt ngang đang diễn ra?' }
      ],
      explanation: 'Tư duy mốc thời gian đã khóa lại ở quá khứ, không còn liên quan đến hiện tại.'
    },
    quickFormulas: [
      { id: '1', formula: 'S + V_{ed} / V_2' },
      { id: '2', formula: 'S + was/were not + V_inf' },
      { id: '3', formula: 'While + S + was/were + V-ing, S + V_{ed}' }
    ],
    usageComparison: {
      leftBox: {
        title: 'Quá khứ đơn',
        items: ['Hành động đã chấm dứt hoàn toàn', 'Chuỗi hành động liên tiếp trong quá khứ', 'Thói quen đã bỏ trong quá khứ'],
        note: 'Dấu hiệu: yesterday, ago, in 2010, last month'
      },
      rightBox: {
        title: 'Quá khứ tiếp diễn',
        items: ['Đang xảy ra tại thời điểm cụ thể trong quá khứ', 'Hai hành động diễn ra song song (While)', 'Hành động đang diễn ra thì có việc khác chen vào'],
        note: 'Dấu hiệu: at 8 PM yesterday, while, when'
      }
    },
    traps: [
      {
        id: 1,
        title: 'Bẫy "Since" vs "Ago"',
        explanation: 'Ago đi với Quá khứ đơn (two days ago). Since đi với mốc thời gian trong Hiện tại hoàn thành (since Monday). Tránh nhầm lẫn giữa hai từ này trong Part 5.',
        wrongExample: 'Mr. David has left the office two hours ago.',
        rightExample: 'Mr. David left the office two hours ago.'
      }
    ],
    examples: [
      {
        id: 1,
        sentenceEn: 'The courier delivered the urgent legal documents at reception yesterday at approximately 4:30 PM.',
        sentenceVi: 'Nhân viên chuyển phát đã giao các tài liệu pháp lý khẩn cấp tại quầy lễ tân vào khoảng 4:30 chiều hôm qua.',
        highlightRule: 'Quá khứ đơn: hành động xảy ra và chấm dứt tại mốc yesterday'
      }
    ],
    questions: [
      {
        id: 1,
        questionText: 'The courier _______ the urgent legal documents at reception yesterday at approximately 4:30 PM.',
        instruction: 'CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU',
        options: [
          { key: 'A', text: 'delivers', inlineExplanation: 'Sai. "delivers" là hiện tại đơn, câu có mốc "yesterday".' },
          { key: 'B', text: 'delivered', inlineExplanation: 'Chính xác. Động từ quá khứ đơn phù hợp với trạng từ "yesterday".' },
          { key: 'C', text: 'was delivered', inlineExplanation: 'Sai. Chủ ngữ "courier" (người chuyển phát) là chủ thể thực hiện hành động, không dùng bị động.' },
          { key: 'D', text: 'has delivered', inlineExplanation: 'Sai. Hiện tại hoàn thành không đi với thời điểm xác định trong quá khứ (yesterday).' }
        ],
        correctAnswer: 'B',
        reasoning: {
          step1_slotAnalysis: 'Sau chủ ngữ "The courier" cần một động từ chính chia theo mốc thời gian.',
          step2_ruleApplication: {
            text: 'Dấu hiệu thời gian "yesterday" loại bỏ thì hiện tại (delivers) và hiện tại hoàn thành (has delivered).',
            eliminatedKeys: ['A', 'D']
          },
          step3_grammaticalClue: {
            text: 'Chủ ngữ là người thực hiện hành động giao tài liệu ➔ Dạng chủ động, loại bị động (was delivered).',
            eliminatedKeys: ['C']
          },
          finalConclusion: 'Chọn B - "delivered".'
        },
        recapNote: 'Quá khứ đơn: $S + V_{ed}$ dùng cho hành động có mốc thời gian xác định trong quá khứ (yesterday, ago, last...).'
      },
      {
        id: 2,
        questionText: 'While the lead auditor _______ the quarterly balance sheets, the power suddenly went out in the main office.',
        instruction: 'CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU',
        options: [
          { key: 'A', text: 'reviewed', inlineExplanation: 'Sai. Hành động đang kéo dài liên tục đi sau "While" phải chia tiếp diễn.' },
          { key: 'B', text: 'was reviewing', inlineExplanation: 'Chính xác. Quá khứ tiếp diễn diễn tả hành động đang xảy ra thì có sự việc khác chen vào (power went out).' },
          { key: 'C', text: 'is reviewing', inlineExplanation: 'Sai. Ngữ cảnh cả câu ở quá khứ (went out), không dùng hiện tại tiếp diễn.' },
          { key: 'D', text: 'has reviewed', inlineExplanation: 'Sai thì hoàn thành.' }
        ],
        correctAnswer: 'B',
        reasoning: {
          step1_slotAnalysis: 'Mệnh đề phụ sau liên từ "While" cần động từ diễn tả hành động đang diễn ra.',
          step2_ruleApplication: {
            text: 'Vế chính có hành động cắt ngang "went out" (quá khứ đơn) ➔ Mệnh đề While dùng Quá khứ tiếp diễn.',
            eliminatedKeys: ['A', 'C', 'D']
          },
          step3_grammaticalClue: {
            text: 'Chủ ngữ số ít "the lead auditor" đi với "was reviewing".',
            eliminatedKeys: []
          },
          finalConclusion: 'Chọn B - "was reviewing".'
        },
        recapNote: 'Sự phối hợp thì: $\\text{While} + S + \\text{was/were} + V\\text{-}ing, S + V_{ed}$.'
      }
    ]
  },

  {
    slug: 'future-tenses',
    categorySlug: 'verb-tenses',
    categoryTitle: '1. Thì thời gian (Verb Tenses)',
    title: 'Các thì tương lai',
    targetTags: ['TOEIC', 'VSTEP'],
    level: '0-500',
    totalQuestions: 50,
    description: 'Phân biệt Will vs Be Going To, thì Tương lai tiếp diễn và quy tắc vàng không dùng will trong mệnh đề trạng ngữ chỉ thời gian.',
    goldenRule: {
      title: 'Quy tắc vàng Tương lai:',
      formulas: ['$S + \\text{will} + V_{\\text{inf}}$', '$S + \\text{am/is/are going to} + V_{\\text{inf}}$', '$S + \\text{will be} + V\\text{-}ing$'],
      note: 'Trong mệnh đề trạng ngữ chỉ thời gian (when, as soon as, once), dùng Hiện tại đơn thay cho Tương lai đơn.'
    },
    quickTips: [
      'Gặp tomorrow, upcoming, next, soon ➔ Dấu hiệu thì tương lai',
      'Sau When, Once, As soon as, Before, After ➔ TUYỆT ĐỐI KHÔNG DÙNG WILL, dùng Hiện tại đơn',
      'Will be + V-ing diễn tả hành động đang diễn ra tại một thời điểm xác định ở tương lai'
    ],
    mascotTip: 'Bẫy đề thi kinh điển: Thấy "As soon as Mr. Park ____" thì chọn "arrives", không bao giờ chọn "will arrive" nhé!',
    mentalModel: {
      flowSteps: [
        { step: 1, label: 'Mệnh đề', action: 'Chỗ trống thuộc mệnh đề chính hay mệnh đề thời gian?' },
        { step: 2, label: 'Dấu hiệu', action: 'Tìm tomorrow, next week, upcoming, as soon as' },
        { step: 3, label: 'Khóa thì', action: 'Nếu sau liên từ thời gian -> Chọn Hiện tại; mệnh đề chính -> Chọn Will' }
      ],
      explanation: 'Mệnh đề phụ chỉ thời gian đã ngầm mang ý nghĩa tương lai nên không cần thêm will.'
    },
    quickFormulas: [
      { id: '1', formula: 'S + will + V_inf' },
      { id: '2', formula: 'As soon as + S + V(s/es), S + will + V_inf' },
      { id: '3', formula: 'S + will be + V-ing' }
    ],
    usageComparison: {
      leftBox: {
        title: 'Will + V_inf',
        items: ['Quyết định tức thì tại thời điểm nói', 'Dự đoán không có bằng chứng chắc chắn', 'Lời hứa hoặc đề nghị giúp đỡ'],
        note: 'Ví dụ: I will assist you with the luggage.'
      },
      rightBox: {
        title: 'Be going to + V_inf',
        items: ['Kế hoạch đã định sẵn từ trước', 'Dự đoán có bằng chứng cụ thể ở hiện tại'],
        note: 'Ví dụ: Look at the sales figures, we are going to exceed targets.'
      }
    },
    traps: [
      {
        id: 1,
        title: 'Bẫy dùng "will" trong mệnh đề trạng ngữ chỉ thời gian',
        explanation: 'Đề thi TOEIC thường gài chọn "will" sau When, Once, As soon as. Quy tắc: Mệnh đề phụ thời gian chia Hiện tại đơn.',
        wrongExample: 'Once the shipment will arrive, we will inspect the goods.',
        rightExample: 'Once the shipment arrives, we will inspect the goods.'
      }
    ],
    examples: [
      {
        id: 1,
        sentenceEn: 'The board of directors will announce the new chief executive officer early next month.',
        sentenceVi: 'Ban giám đốc sẽ công bố tổng giám đốc điều hành mới vào đầu tháng tới.',
        highlightRule: 'Tương lai đơn: hành động xảy ra trong tương lai với "next month"'
      }
    ],
    questions: [
      {
        id: 1,
        questionText: 'As soon as the factory manager _______ the safety checklist, full production will resume immediately.',
        instruction: 'CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU',
        options: [
          { key: 'A', text: 'will sign', inlineExplanation: 'Sai. Trong mệnh đề phụ bắt đầu bằng "As soon as", không dùng "will".' },
          { key: 'B', text: 'signs', inlineExplanation: 'Chính xác. Dùng thì Hiện tại đơn trong mệnh đề thời gian để chỉ sự việc trong tương lai.' },
          { key: 'C', text: 'signed', inlineExplanation: 'Sai thì quá khứ, mệnh đề chính dùng "will resume".' },
          { key: 'D', text: 'signing', inlineExplanation: 'Sai dạng V-ing không làm động từ chính.' }
        ],
        correctAnswer: 'B',
        reasoning: {
          step1_slotAnalysis: 'Chỗ trống là vị ngữ trong mệnh đề trạng ngữ chỉ thời gian bắt đầu bằng "As soon as".',
          step2_ruleApplication: {
            text: 'Mệnh đề trạng ngữ chỉ thời gian dùng Hiện tại đơn thay cho Tương lai đơn ➔ Loại bỏ "will sign".',
            eliminatedKeys: ['A', 'C', 'D']
          },
          step3_grammaticalClue: {
            text: 'Chủ ngữ "the factory manager" là ngôi thứ 3 số ít ➔ Động từ thêm "-s" (signs).',
            eliminatedKeys: []
          },
          finalConclusion: 'Chọn B - "signs".'
        },
        recapNote: 'Mệnh đề trạng ngữ thời gian: $\\text{As soon as / Once / When} + S + V(s/es), S + \\text{will} + V_{\\text{bare}}$.'
      },
      {
        id: 2,
        questionText: 'Next Wednesday at 10:00 AM, the vice president _______ the keynote address at the international technology expo.',
        instruction: 'CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU',
        options: [
          { key: 'A', text: 'delivered', inlineExplanation: 'Sai thì quá khứ, mốc thời gian là "Next Wednesday".' },
          { key: 'B', text: 'will be delivering', inlineExplanation: 'Chính xác. Tương lai tiếp diễn diễn tả hành động đang diễn ra tại mốc thời gian cụ thể trong tương lai (Next Wednesday at 10:00 AM).' },
          { key: 'C', text: 'has delivered', inlineExplanation: 'Sai thì hiện tại hoàn thành.' },
          { key: 'D', text: 'is delivered', inlineExplanation: 'Sai bị động.' }
        ],
        correctAnswer: 'B',
        reasoning: {
          step1_slotAnalysis: 'Vị ngữ sau chủ ngữ "the vice president" kèm thời điểm cụ thể "Next Wednesday at 10:00 AM".',
          step2_ruleApplication: {
            text: 'Có mốc thời gian xác định trong tương lai ➔ Dùng thì Tương lai tiếp diễn: will be + V-ing.',
            eliminatedKeys: ['A', 'C', 'D']
          },
          step3_grammaticalClue: {
            text: 'Chủ động phát biểu bài phát biểu chủ đạo (the keynote address).',
            eliminatedKeys: []
          },
          finalConclusion: 'Chọn B - "will be delivering".'
        },
        recapNote: 'Tương lai tiếp diễn: $S + \\text{will be} + V\\text{-}ing$ diễn tả hành động đang xảy ra tại thời điểm cụ thể ở tương lai.'
      }
    ]
  },

  {
    slug: 'perfect-tenses',
    categorySlug: 'verb-tenses',
    categoryTitle: '1. Thì thời gian (Verb Tenses)',
    title: 'Các thì hoàn thành',
    targetTags: ['TOEIC', 'VSTEP'],
    level: '600+',
    totalQuestions: 50,
    description: 'Chinh phục Hiện tại hoàn thành, Quá khứ hoàn thành và Tương lai hoàn thành; làm chủ cặp dấu hiệu since/for và by the time.',
    goldenRule: {
      title: 'Quy tắc vàng Các thì Hoàn thành:',
      formulas: ['$S + \\text{have/has} + V_3/V_{ed}$', '$S + \\text{had} + V_3/V_{ed}$', '$S + \\text{will have} + V_3/V_{ed}$'],
      note: 'Hoàn thành diễn tả hành động xảy ra trước một mốc thời gian hoặc kéo dài liên tục đến mốc đó.'
    },
    quickTips: [
      'Since + mốc thời gian, For + khoảng thời gian ➔ Hiện tại hoàn thành',
      'By the time + Quá khứ đơn ➔ Mệnh đề chính chia Quá khứ hoàn thành (had + V3/ed)',
      'By the time / By next month ➔ Mệnh đề chính chia Tương lai hoàn thành (will have + V3/ed)'
    ],
    mascotTip: 'Công thức 5 giây: By the time + V(s/es) thì vế kia chọn "will have V3/ed"; By the time + V-ed thì vế kia chọn "had V3/ed"!',
    mentalModel: {
      flowSteps: [
        { step: 1, label: 'Mốc so sánh', action: 'Xác định mốc đối chiếu: Quá khứ hay Tương lai?' },
        { step: 2, label: 'Dấu hiệu', action: 'Tìm By, By the time, Already, Yet, Since, For' },
        { step: 3, label: 'Chọn thì', action: 'Trước Quá khứ -> QKHT; Trước Tương lai -> TLHT' }
      ],
      explanation: 'Thì hoàn thành luôn là "cây cầu thời gian" nối từ điểm xuất phát tới mốc đối chiếu.'
    },
    quickFormulas: [
      { id: '1', formula: 'S + have/has + V_3/V_{ed}' },
      { id: '2', formula: 'By the time + S + V_{ed}, S + had + V_3/V_{ed}' },
      { id: '3', formula: 'By + mốc tương lai, S + will have + V_3/V_{ed}' }
    ],
    usageComparison: {
      leftBox: {
        title: 'Quá khứ hoàn thành (Had + V3/ed)',
        items: ['Hành động xảy ra trước một hành động quá khứ khác', 'Đứng trong cấu trúc By the time + Quá khứ'],
        note: 'Ví dụ: The meeting had ended before he arrived.'
      },
      rightBox: {
        title: 'Tương lai hoàn thành (Will have + V3/ed)',
        items: ['Hành động sẽ hoàn thành trước một mốc thời gian ở tương lai', 'Đứng trong cấu trúc By the time + Hiện tại'],
        note: 'Ví dụ: By 2030, we will have expanded to 10 countries.'
      }
    },
    traps: [
      {
        id: 1,
        title: 'Bẫy "By the time" với thì Hiện tại và Quá khứ',
        explanation: 'Nhầm lẫn thì của mệnh đề sau By the time: Nếu là V-ed thì mệnh đề chính là Had + V3/ed; Nếu là V(s/es) thì mệnh đề chính là Will have + V3/ed.',
        wrongExample: 'By the time she retired last year, she will have worked here for 30 years.',
        rightExample: 'By the time she retired last year, she had worked here for 30 years.'
      }
    ],
    examples: [
      {
        id: 1,
        sentenceEn: 'Our company has developed cutting-edge green technologies since its founding in 2015.',
        sentenceVi: 'Công ty chúng tôi đã phát triển các công nghệ xanh tiên tiến kể từ khi thành lập vào năm 2015.',
        highlightRule: 'Hiện tại hoàn thành: bắt đầu từ 2015 và kéo dài đến nay'
      }
    ],
    questions: [
      {
        id: 1,
        questionText: 'By the time the new CEO assumed office last week, the restructuring committee _______ the financial audit.',
        instruction: 'CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU',
        options: [
          { key: 'A', text: 'completes', inlineExplanation: 'Sai thì hiện tại.' },
          { key: 'B', text: 'had completed', inlineExplanation: 'Chính xác. Hành động kiểm toán hoàn thành trước mốc quá khứ "assumed office" ➔ Quá khứ hoàn thành.' },
          { key: 'C', text: 'will complete', inlineExplanation: 'Sai thì tương lai.' },
          { key: 'D', text: 'is completing', inlineExplanation: 'Sai thì tiếp diễn.' }
        ],
        correctAnswer: 'B',
        reasoning: {
          step1_slotAnalysis: 'Mệnh đề chính sau liên từ chỉ thời gian "By the time the new CEO assumed office last week".',
          step2_ruleApplication: {
            text: 'Mệnh đề phụ ở quá khứ đơn (assumed) ➔ Mệnh đề chính diễn tả hành động xảy ra trước đó, bắt buộc dùng Quá khứ hoàn thành (had + V3/ed).',
            eliminatedKeys: ['A', 'C', 'D']
          },
          step3_grammaticalClue: {
            text: 'Cấu trúc: By the time + S + V2/ed, S + had + V3/ed.',
            eliminatedKeys: []
          },
          finalConclusion: 'Chọn B - "had completed".'
        },
        recapNote: 'Quá khứ hoàn thành: $\\text{By the time} + S + V_{ed}, S + \\mathbf{had + V_3/V_{ed}}$.'
      },
      {
        id: 2,
        questionText: 'By the end of the next fiscal quarter, our manufacturing team _______ more than 500,000 electric vehicle batteries.',
        instruction: 'CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU',
        options: [
          { key: 'A', text: 'produced', inlineExplanation: 'Sai thì quá khứ đơn.' },
          { key: 'B', text: 'will have produced', inlineExplanation: 'Chính xác. "By the end of next fiscal quarter" là mốc thời gian tương lai ➔ Dùng Tương lai hoàn thành (will have + V3/ed).' },
          { key: 'C', text: 'has produced', inlineExplanation: 'Sai thì hiện tại hoàn thành.' },
          { key: 'D', text: 'is producing', inlineExplanation: 'Sai thì tiếp diễn.' }
        ],
        correctAnswer: 'B',
        reasoning: {
          step1_slotAnalysis: 'Vị ngữ của câu có mốc thời gian hoàn tất ở tương lai: "By the end of the next fiscal quarter".',
          step2_ruleApplication: {
            text: 'Cấu trúc "By + mốc tương lai" đòi hỏi thì Tương lai hoàn thành (will have + V3/ed).',
            eliminatedKeys: ['A', 'C', 'D']
          },
          step3_grammaticalClue: {
            text: 'Nhấn mạnh sự hoàn tất mục tiêu sản lượng trước thời hạn quý tới.',
            eliminatedKeys: []
          },
          finalConclusion: 'Chọn B - "will have produced".'
        },
        recapNote: 'Tương lai hoàn thành: $\\text{By} + \\text{mốc tương lai}, S + \\mathbf{will\\ have + V_3/V_{ed}}$.'
      }
    ]
  },

  {
    slug: 'sequence-of-tenses',
    categorySlug: 'verb-tenses',
    categoryTitle: '1. Thì thời gian (Verb Tenses)',
    title: 'Sự phối hợp thì (Sequence of Tenses)',
    targetTags: ['TOEIC'],
    level: '600+',
    totalQuestions: 50,
    description: 'Quy tắc lùi thì trong câu phức, câu tường thuật và sự ăn khớp thời gian giữa mệnh đề chính và mệnh đề phụ.',
    goldenRule: {
      title: 'Quy tắc vàng Sự phối hợp thì:',
      formulas: ['$\\text{Main Clause (Quá khứ)} \\rightarrow \\text{Sub Clause lùi thì quá khứ}$', '$\\text{Since} + S + V_{ed}, S + \\text{have/has} + V_3/V_{ed}$'],
      note: 'Khi mệnh đề chính ở thì Quá khứ, động từ trong mệnh đề phụ bắt buộc phải lùi về các thì quá khứ tương ứng.'
    },
    quickTips: [
      'Mệnh đề chính dùng "said / announced / confirmed" ➔ Mệnh đề "that" phải lùi thì (was/were, had V3, would)',
      'Since + Quá khứ đơn, Mệnh đề chính Hiện tại hoàn thành',
      'After + Quá khứ hoàn thành, Quá khứ đơn; Before + Quá khứ đơn, Quá khứ hoàn thành'
    ],
    mascotTip: 'Thần chú: Mệnh đề chính đã Quá khứ thì mệnh đề phụ cấm kỵ dùng Hiện tại đơn hoặc Will!',
    mentalModel: {
      flowSteps: [
        { step: 1, label: 'Mệnh đề chính', action: 'Xem động từ chính chia ở Hiện tại hay Quá khứ?' },
        { step: 2, label: 'Mối quan hệ', action: 'Hành động phụ xảy ra trước, cùng lúc hay sau động từ chính?' },
        { step: 3, label: 'Lùi thì', action: 'Khóa động từ phụ tương thích với dòng thời gian của mệnh đề chính' }
      ],
      explanation: 'Đảm bảo tính logic của dòng thời gian câu văn trong tiếng Anh.'
    },
    quickFormulas: [
      { id: '1', formula: 'S + announced that + S + had + V_3/V_{ed}' },
      { id: '2', formula: 'S + confirmed that + S + would + V_inf' }
    ],
    usageComparison: {
      leftBox: {
        title: 'Mệnh đề chính Hiện tại',
        items: ['Động từ phụ giữ nguyên thì thực tế', 'Có thể chia hiện tại, quá khứ hoặc tương lai'],
        note: 'Ví dụ: He says that he will come.'
      },
      rightBox: {
        title: 'Mệnh đề chính Quá khứ',
        items: ['Động từ phụ bắt buộc lùi thì', 'Hiện tại -> Quá khứ đơn; Tương lai (will) -> would; Quá khứ -> Quá khứ hoàn thành'],
        note: 'Ví dụ: He said that he would come.'
      }
    },
    traps: [
      {
        id: 1,
        title: 'Bẫy giữ nguyên "will" sau động từ tường thuật quá khứ',
        explanation: 'Khi mệnh đề chính là "reported / announced", mệnh đề that không được dùng "will" mà phải lùi thành "would".',
        wrongExample: 'The spokesperson confirmed that profits will increase by 10%.',
        rightExample: 'The spokesperson confirmed that profits would increase by 10%.'
      }
    ],
    examples: [
      {
        id: 1,
        sentenceEn: 'The auditor reported that the discrepancy had occurred during the previous inventory transfer.',
        sentenceVi: 'Kiểm toán viên báo cáo rằng sự sai lệch đã xảy ra trong đợt chuyển hàng tồn kho trước đó.',
        highlightRule: 'Sự phối hợp thì: reported (quá khứ) đi với had occurred (xảy ra trước đó)'
      }
    ],
    questions: [
      {
        id: 1,
        questionText: 'The project director confirmed yesterday that the software update _______ launched by the end of this month.',
        instruction: 'CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU',
        options: [
          { key: 'A', text: 'will be', inlineExplanation: 'Sai. Mệnh đề chính có động từ quá khứ "confirmed yesterday", phải lùi thì "will" thành "would".' },
          { key: 'B', text: 'would be', inlineExplanation: 'Chính xác. Động từ "would be" là dạng lùi thì hợp chuẩn của "will be" sau động từ quá khứ "confirmed".' },
          { key: 'C', text: 'is', inlineExplanation: 'Sai thì hiện tại.' },
          { key: 'D', text: 'has been', inlineExplanation: 'Sai thì hoàn thành.' }
        ],
        correctAnswer: 'B',
        reasoning: {
          step1_slotAnalysis: 'Động từ trong mệnh đề danh ngữ "that..." phụ thuộc vào động từ chính "confirmed yesterday".',
          step2_ruleApplication: {
            text: 'Động từ chính ở quá khứ đơn (confirmed) ➔ Quy tắc phối hợp thì bắt buộc lùi "will" thành "would".',
            eliminatedKeys: ['A', 'C', 'D']
          },
          step3_grammaticalClue: {
            text: 'Dạng bị động: would be launched.',
            eliminatedKeys: []
          },
          finalConclusion: 'Chọn B - "would be".'
        },
        recapNote: 'Phối hợp thì: $S + V_{\\text{quá khứ}} + \\text{that} + S + \\mathbf{would} + V_{\\text{bare}}$.'
      },
      {
        id: 2,
        questionText: 'Ever since Ms. Davies _______ as chief operating officer, corporate revenues have surged dramatically.',
        instruction: 'CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU',
        options: [
          { key: 'A', text: 'appointed', inlineExplanation: 'Sai dạng chủ động, Ms. Davies phải được bổ nhiệm (bị động).' },
          { key: 'B', text: 'was appointed', inlineExplanation: 'Chính xác. Sau "since" dùng thì Quá khứ đơn bị động, vế chính dùng Hiện tại hoàn thành "have surged".' },
          { key: 'C', text: 'has been appointed', inlineExplanation: 'Sai. Sau "since" dùng mốc thời gian quá khứ đơn, không dùng hiện tại hoàn thành.' },
          { key: 'D', text: 'appoints', inlineExplanation: 'Sai thì hiện tại đơn.' }
        ],
        correctAnswer: 'B',
        reasoning: {
          step1_slotAnalysis: 'Mệnh đề sau liên từ thời gian "Ever since...".',
          step2_ruleApplication: {
            text: 'Cấu trúc phối hợp thì: Ever since + S + Quá khứ đơn, S + Hiện tại hoàn thành.',
            eliminatedKeys: ['C', 'D']
          },
          step3_grammaticalClue: {
            text: 'Chủ ngữ Ms. Davies được bổ nhiệm làm COO ➔ Bị động quá khứ đơn "was appointed".',
            eliminatedKeys: ['A']
          },
          finalConclusion: 'Chọn B - "was appointed".'
        },
        recapNote: 'Phối hợp thì với Since: $\\text{Since} + S + V_{ed} / \\text{was-were PII}, S + \\text{have/has} + V_3/V_{ed}$.'
      }
    ]
  }
];

console.log('Base topics loaded:', topicsData.length);
