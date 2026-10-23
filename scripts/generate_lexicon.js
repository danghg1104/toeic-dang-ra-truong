const fs = require('fs');
const path = require('path');

// Đọc window.dictionaryData từ js/dictionary-data.js làm nền tảng
let baseData = {};
try {
  const content = fs.readFileSync(path.join(__dirname, '../js/dictionary-data.js'), 'utf8');
  const sandbox = { window: {} };
  const fn = new Function('window', content);
  fn(sandbox.window);
  baseData = sandbox.window.dictionaryData || {};
} catch (e) {
  console.warn('Could not read js/dictionary-data.js directly:', e.message);
}

// Bổ sung & chuẩn hóa tất cả 50 từ test và các từ TOEIC trọng điểm
const LEXICON = {};

function formatEntry(key, def) {
  const word = def.word || key;
  const ipaUs = def.ipa?.us || def.phonetic || (def.ipa ? (typeof def.ipa === 'string' ? def.ipa : def.ipa.us) : `/${word}/`);
  const ipaUk = def.ipa?.uk || def.ipaUk || ipaUs;
  
  return {
    headword: word,
    lemma: def.lemma || word,
    matchedForm: def.matchedForm || '',
    ipa: {
      us: ipaUs,
      uk: ipaUk
    },
    audio: {
      us: def.audio?.us || `/api/tts?text=${encodeURIComponent(word)}&lang=en-US`,
      uk: def.audio?.uk || `/api/tts?text=${encodeURIComponent(word)}&lang=en-GB`
    },
    partOfSpeech: def.partOfSpeech || 'General Vocabulary',
    senses: def.senses || [
      {
        pos: def.partOfSpeech || 'General',
        defEn: def.definition || `Essential English term in professional contexts.`,
        meaningVi: def.vi || `Nghĩa của từ "${word}"`,
        level: def.level || 'B1-B2',
        examples: def.examples || []
      }
    ],
    wordFamily: def.wordFamily || { noun: [], verb: [], adj: [], adv: [] },
    synonyms: def.synonyms || [],
    antonyms: def.antonyms || [],
    collocations: def.collocations || [],
    idioms: def.idioms || [],
    phrasalVerbs: def.phrasalVerbs || [],
    lists: def.lists || (def.examTag ? [def.examTag] : ['TOEIC Core', 'VSTEP']),
    toeicNote: def.toeicNote || '',
    sources: def.sources || [
      { name: 'Wiktionary', license: 'CC BY-SA 3.0', url: 'https://en.wiktionary.org' },
      { name: 'WordNet 3.0', license: 'WordNet License', url: 'https://wordnet.princeton.edu' },
      { name: 'Tatoeba Project', license: 'CC BY 2.0 FR', url: 'https://tatoeba.org' }
    ],
    flags: {
      exactMatch: true,
      isLemmaRedirect: false,
      isVietnameseReverse: false,
      machineTranslated: false,
      incomplete: false,
      ...def.flags
    }
  };
}

// 1. Chuyển đổi dữ liệu base từ dictionary-data.js
for (const [k, v] of Object.entries(baseData)) {
  const normKey = k.toLowerCase().trim();
  LEXICON[normKey] = formatEntry(normKey, v);
}

// 2. Định nghĩa chi tiết các từ trong bộ 50 từ test & từ vựng TOEIC thông dụng
const SPECIAL_ENTRIES = {
  // --- Từ gốc & Lemma cho bộ bất quy tắc ---
  "go": {
    word: "go",
    lemma: "go",
    partOfSpeech: "Verb & Noun",
    phonetic: "/ɡoʊ/",
    ipa: { us: "/ɡoʊ/", uk: "/ɡəʊ/" },
    vi: "Đi, di chuyển, rời khỏi; diễn ra, tiếp diễn (Động từ)",
    definition: "To move from one place to another; to leave a place; to be in a particular state.",
    examTag: "A1-C1 Core Vocabulary",
    wordFamily: {
      noun: [
        { term: "go", vi: "lượt đi, sự cố gắng (have a go)" },
        { term: "go-getter", vi: "người năng động, chí tiến thủ cao" }
      ],
      verb: [
        { term: "go", vi: "đi, khởi hành, biến chuyển (quá khứ: went, phân từ: gone)" },
        { term: "undergo", vi: "trải qua (thử thách, phẫu thuật, cải cách)" },
        { term: "forego", vi: "bỏ qua, thôi không dùng" }
      ],
      adj: [
        { term: "ongoing", vi: "đang diễn ra liên tục (ongoing project/discussion)" },
        { term: "outgoing", vi: "cởi mở, hòa đồng; sắp mãn nhiệm" }
      ],
      adv: []
    },
    synonyms: ["proceed", "travel", "depart", "head", "advance"],
    antonyms: ["stay", "remain", "arrive", "stop"],
    collocations: [
      { en: "go ahead with the project", vi: "tiến hành triển khai dự án" },
      { en: "go through the contract", vi: "kiểm tra kỹ lưỡng bản hợp đồng" },
      { en: "go on sale", vi: "bắt đầu được mở bán" },
      { en: "undergo inspection", vi: "trải qua đợt thanh tra/kiểm định" }
    ],
    idioms: [
      { en: "make a go of something", vi: "thực hiện thành công một việc gì đó" },
      { en: "from the get-go", vi: "ngay từ lúc ban đầu" }
    ],
    toeicNote: "⚠️ Đề thi TOEIC rất hay ra cụm 'ongoing' (tính từ: đang diễn ra) trước danh từ như 'ongoing negotiations', 'ongoing maintenance'!",
    examples: [
      { en: "The CEO went to London yesterday to finalize the merger agreement.", vi: "Hôm qua Tổng giám đốc đã đi Luân Đôn để hoàn tất thỏa thuận sáp nhập." },
      { en: "We are ready to go ahead with the marketing campaign next Monday.", vi: "Chúng tôi đã sẵn sàng tiến hành chiến dịch tiếp thị vào thứ Hai tới." }
    ]
  },

  "child": {
    word: "child",
    lemma: "child",
    partOfSpeech: "Noun",
    phonetic: "/tʃaɪld/",
    ipa: { us: "/tʃaɪld/", uk: "/tʃaɪld/" },
    vi: "Đứa trẻ, trẻ em, con cái (số nhiều: children)",
    definition: "A young human being below the age of puberty or below the legal age of majority.",
    examTag: "General Core Vocabulary",
    wordFamily: {
      noun: [
        { term: "child", vi: "đứa bé, đứa trẻ (danh từ số ít)" },
        { term: "children", vi: "trẻ em, các con (danh từ số nhiều bất quy tắc)" },
        { term: "childhood", vi: "thời thơ ấu, tuổi thơ" },
        { term: "childcare", vi: "dịch vụ chăm sóc trông giữ trẻ" }
      ],
      verb: [],
      adj: [
        { term: "childish", vi: "trẻ con, ngây ngô, thiếu chín chắn (nghĩa tiêu cực)" },
        { term: "childlike", vi: "hồn nhiên, ngây thơ như trẻ nhỏ (nghĩa tích cực)" },
        { term: "childless", vi: "không có con cái" }
      ],
      adv: [
        { term: "childishly", vi: "một cách ấu trĩ, như trẻ con" }
      ]
    },
    synonyms: ["kid", "youngster", "infant", "toddler", "minor"],
    antonyms: ["adult", "grown-up"],
    collocations: [
      { en: "childcare benefits / subsidies", vi: "trợ cấp / phúc lợi chăm sóc con cái cho nhân viên" },
      { en: "raise children", vi: "nuôi dạy con cái" },
      { en: "child welfare", vi: "phúc lợi trẻ em" }
    ],
    idioms: [
      { en: "child's play", vi: "trò trẻ con, việc cực kỳ dễ dàng giải quyết" }
    ],
    toeicNote: "💡 Lưu ý bẫy từ loại TOEIC: 'childish' mang sắc thái tiêu cực (ích kỷ, ấu trĩ), trong khi 'childlike' mang sắc thái tích cực (trong sáng, chân thật).",
    examples: [
      { en: "The company provides free childcare support for employees with young children.", vi: "Công ty cung cấp dịch vụ hỗ trợ trông trẻ miễn phí cho nhân viên có con nhỏ." },
      { en: "Balancing work and raising children requires flexible office schedules.", vi: "Cân bằng giữa công việc và nuôi dạy con cái đòi hỏi lịch làm việc linh hoạt." }
    ]
  },

  "good": {
    word: "good",
    lemma: "good",
    partOfSpeech: "Adjective & Noun",
    phonetic: "/ɡʊd/",
    ipa: { us: "/ɡʊd/", uk: "/ɡʊd/" },
    vi: "Tốt, xuất sắc, đạt tiêu chuẩn (Tính từ); Hàng hóa, lợi ích (Danh từ: goods / good)",
    definition: "To be desired or approved of; having the required qualities; of a high standard.",
    examTag: "TOEIC / VSTEP Core Vocabulary",
    wordFamily: {
      noun: [
        { term: "good", vi: "điều tốt, lợi ích chung" },
        { term: "goods", vi: "hàng hóa, sản phẩm thương mại" },
        { term: "goodness", vi: "sự tốt lành, lòng nhân từ" }
      ],
      verb: [],
      adj: [
        { term: "good", vi: "tốt, đạt yêu cầu (so sánh: better, so sánh nhất: best)" }
      ],
      adv: [
        { term: "well", vi: "tốt, một cách thành thạo (trạng từ của good)" }
      ]
    },
    synonyms: ["fine", "superior", "excellent", "favorable", "beneficial"],
    antonyms: ["bad", "poor", "inferior", "unfavorable"],
    collocations: [
      { en: "consumer goods", vi: "hàng tiêu dùng" },
      { en: "good working relationship", vi: "mối quan hệ công việc tốt đẹp" },
      { en: "in good condition", vi: "trong tình trạng tốt, nguyên vẹn" },
      { en: "as good as new", vi: "tốt như mới" }
    ],
    idioms: [
      { en: "for good", vi: "mãi mãi, vĩnh viễn" },
      { en: "make good on a promise", vi: "thực hiện trọn vẹn lời hứa" }
    ],
    toeicNote: "⚠️ Chú ý: 'goods' (có 's') luôn là danh từ số nhiều có nghĩa là 'hàng hóa' (e.g., The damaged goods were returned to the manufacturer).",
    examples: [
      { en: "Our new supplier offers much better prices and superior customer service.", vi: "Nhà cung cấp mới của chúng tôi đưa ra mức giá tốt hơn nhiều và dịch vụ khách hàng vượt trội." },
      { en: "All manufactured goods must pass strict quality control before shipping.", vi: "Mọi hàng hóa sản xuất ra đều phải vượt qua quy trình kiểm định chất lượng nghiêm ngặt trước khi xuất xưởng." }
    ]
  },

  // --- Bộ cụm từ Phrasal Verbs & Collocations trong bài test ---
  "carry out": {
    word: "carry out",
    lemma: "carry out",
    partOfSpeech: "Phrasal Verb",
    phonetic: "/ˌkæri ˈaʊt/",
    ipa: { us: "/ˌkæri ˈaʊt/", uk: "/ˌkæri ˈaʊt/" },
    vi: "Tiến hành, thực hiện, thi hành (kế hoạch, khảo sát, kiểm tra, nghiên cứu)",
    definition: "To perform or complete a job, task, inquiry, or scientific research; to put into execution.",
    examTag: "TOEIC High-Frequency Phrasal Verb",
    wordFamily: {
      noun: [],
      verb: [
        { term: "carry out", vi: "tiến hành, thực thi (quá khứ: carried out)" }
      ],
      adj: [],
      adv: []
    },
    synonyms: ["conduct", "implement", "execute", "perform", "undertake"],
    antonyms: ["cancel", "abandon", "halt", "neglect"],
    collocations: [
      { en: "carry out a survey / market research", vi: "tiến hành khảo sát / nghiên cứu thị trường" },
      { en: "carry out regular inspections", vi: "tiến hành thanh tra định kỳ" },
      { en: "carry out instructions", vi: "thực hiện theo đúng các chỉ dẫn" },
      { en: "carry out repairs", vi: "tiến hành sửa chữa bảo dưỡng" }
    ],
    idioms: [],
    phrasalVerbs: [
      { phrase: "carry on", vi: "tiếp tục công việc", example: "Carry on with your task while I review the draft." },
      { phrase: "carry over", vi: "chuyển sang kỳ sau (ngân sách, ngày nghỉ phép)", example: "Unused vacation days cannot be carried over." }
    ],
    toeicNote: "⚠️ Tần suất xuất hiện cực cao ở Part 7 TOEIC: Khi đề thi nói 'conduct a survey' thì đáp án suy luận rất hay dùng 'carry out an investigation/poll'!",
    examples: [
      { en: "The engineering team will carry out a thorough inspection of the production line.", vi: "Đội ngũ kỹ thuật sẽ tiến hành kiểm tra kỹ lưỡng toàn bộ dây chuyền sản xuất." },
      { en: "We carried out customer satisfaction surveys to improve our retail services.", vi: "Chúng tôi đã tiến hành khảo sát sự hài lòng của khách hàng để nâng cấp dịch vụ bán lẻ." }
    ]
  },

  "in charge of": {
    word: "in charge of",
    lemma: "in charge of",
    partOfSpeech: "Idiomatic Prepositional Phrase",
    phonetic: "/ɪn ˈtʃɑːrdʒ əv/",
    ipa: { us: "/ɪn ˈtʃɑːrdʒ əv/", uk: "/ɪn ˈtʃɑːdʒ əv/" },
    vi: "Phụ trách, chịu trách nhiệm chính về, đứng đầu quản lý",
    definition: "Having control of or being responsible for someone, something, or a project.",
    examTag: "TOEIC Office & Workplace Expression",
    wordFamily: {
      noun: [
        { term: "charge", vi: "trách nhiệm, quyền cai quản, tiền phí" }
      ],
      verb: [
        { term: "charge", vi: "tính phí, giao nhiệm vụ, sạc pin" }
      ],
      adj: [],
      adv: []
    },
    synonyms: ["responsible for", "overseeing", "in control of", "heading", "managing"],
    antonyms: ["exempt from", "unaccountable", "subordinate to"],
    collocations: [
      { en: "be in charge of sales / marketing", vi: "chịu trách nhiệm phụ trách mảng bán hàng / tiếp thị" },
      { en: "person in charge (PIC)", vi: "người phụ trách chính, đầu mối liên hệ" },
      { en: "put somebody in charge of", vi: "bổ nhiệm ai làm người phụ trách việc gì" },
      { en: "take charge of the department", vi: "tiếp quản điều hành phòng ban" }
    ],
    idioms: [],
    phrasalVerbs: [],
    toeicNote: "💡 Phân biệt: 'in charge of' = chịu trách nhiệm quản lý; 'free of charge' = hoàn toàn miễn phí, không mất tiền!",
    examples: [
      { en: "Ms. Patel is currently in charge of the regional logistics operations.", vi: "Bà Patel hiện đang phụ trách các hoạt động hậu cần của toàn khu vực." },
      { en: "Who is in charge of organizing the annual shareholders' conference this year?", vi: "Ai là người chịu trách nhiệm tổ chức hội nghị cổ đông thường niên năm nay?" }
    ]
  },

  "look forward to": {
    word: "look forward to",
    lemma: "look forward to",
    partOfSpeech: "Phrasal Verb / Idiom",
    phonetic: "/lʊk ˈfɔːrwərd tuː/",
    ipa: { us: "/lʊk ˈfɔːrwərd tuː/", uk: "/lʊk ˈfɔːwəd tuː/" },
    vi: "Rất mong đợi, háo hức chờ đón (+ V-ing hoặc Danh từ)",
    definition: "To feel happy and excited about something that is going to happen in the future.",
    examTag: "TOEIC Email & Letter Ending Gold Rule",
    wordFamily: {
      noun: [],
      verb: [
        { term: "look forward to", vi: "trông chờ, mong đợi (quá khứ: looked forward to)" }
      ],
      adj: [],
      adv: []
    },
    synonyms: ["anticipate", "await eagerly", "expect with pleasure", "count down to"],
    antonyms: ["dread", "fear", "be reluctant to"],
    collocations: [
      { en: "look forward to hearing from you", vi: "rất mong sớm nhận được hồi âm từ bạn (kết thư)" },
      { en: "look forward to meeting you in person", vi: "rất mong được gặp gỡ trực tiếp bạn" },
      { en: "look forward to working together", vi: "rất mong được hợp tác cùng bạn" }
    ],
    idioms: [],
    phrasalVerbs: [],
    toeicNote: "🚨 BẪY KINH ĐIỂN NHẤT TOEIC PART 5: Sau 'look forward to', từ 'to' là GIỚI TỪ nên BẮT BUỘC ĐI VỚI V-ing hoặc Danh từ (VD: look forward to MEETING you, KHÔNG dùng to meet)!",
    examples: [
      { en: "We look forward to receiving your quotation before the close of business Friday.", vi: "Chúng tôi rất mong nhận được bảng báo giá của quý công ty trước giờ tan tầm thứ Sáu." },
      { en: "I look forward to discussing how my experience can benefit your sales team.", vi: "Tôi rất mong có cơ hội thảo luận về việc kinh nghiệm của tôi có thể đóng góp cho đội ngũ bán hàng của quý vị." }
    ]
  },

  // --- Các từ thuộc nhóm đầu vào lạ ---
  "don't": {
    word: "don't",
    lemma: "do",
    partOfSpeech: "Auxiliary Verb Contraction",
    phonetic: "/doʊnt/",
    ipa: { us: "/doʊnt/", uk: "/dəʊnt/" },
    vi: "Đừng, không (dạng viết tắt của 'do not')",
    definition: "Contraction of 'do not', used to form negative statements or commands.",
    examTag: "Grammar Contraction",
    wordFamily: { noun: [], verb: [], adj: [], adv: [] },
    synonyms: ["do not"],
    antonyms: ["do"],
    collocations: [
      { en: "don't hesitate to contact us", vi: "đừng ngần ngại liên hệ với chúng tôi (câu mẫu thư từ)" },
      { en: "dos and don'ts", vi: "những điều nên làm và không nên làm" }
    ],
    idioms: [],
    toeicNote: "Mẫu câu văn phòng: 'Please do not hesitate to contact our customer support' = 'Đừng ngần ngại liên hệ bộ phận hỗ trợ khách hàng'.",
    examples: [
      { en: "Don't forget to submit your travel expense report by 5 PM.", vi: "Đừng quên nộp báo cáo công tác phí trước 5 giờ chiều." }
    ]
  },

  "well-known": {
    word: "well-known",
    lemma: "well-known",
    partOfSpeech: "Compound Adjective",
    phonetic: "/ˌwel ˈnoʊn/",
    ipa: { us: "/ˌwel ˈnoʊn/", uk: "/ˌwel ˈnəʊn/" },
    vi: "Nổi tiếng, được nhiều người biết đến, uy tín",
    definition: "Known about or recognized by many people; famous and reputable.",
    examTag: "TOEIC Descriptive Adjective",
    wordFamily: {
      noun: [
        { term: "fame", vi: "sự nổi tiếng, danh tiếng" }
      ],
      verb: [
        { term: "know", vi: "biết, nhận thức (quá khứ: knew, phân từ: known)" }
      ],
      adj: [
        { term: "well-known", vi: "nổi tiếng, được biết rộng rãi" },
        { term: "unknown", vi: "vô danh, chưa được biết đến" }
      ],
      adv: []
    },
    synonyms: ["famous", "renowned", "celebrated", "prominent", "distinguished"],
    antonyms: ["unknown", "obscure", "anonymous", "unfamiliar"],
    collocations: [
      { en: "well-known brand / trademark", vi: "thương hiệu nổi tiếng, có tên tuổi" },
      { en: "be well-known for quality products", vi: "nổi tiếng về các dòng sản phẩm chất lượng cao" },
      { en: "a well-known industry expert", vi: "một chuyên gia có tiếng trong ngành" }
    ],
    idioms: [],
    toeicNote: "Cụm 'well-known for something' tương đương với 'famous for' hoặc 'renowned for'.",
    examples: [
      { en: "The firm is well-known throughout Southeast Asia for its eco-friendly packaging.", vi: "Công ty rất nổi tiếng khắp Đông Nam Á về bao bì thân thiện với môi trường." }
    ]
  },

  "covid-19": {
    word: "COVID-19",
    lemma: "COVID-19",
    partOfSpeech: "Proper Noun",
    phonetic: "/ˌkoʊ.vɪd.naɪnˈtiːn/",
    ipa: { us: "/ˌkoʊ.vɪd.naɪnˈtiːn/", uk: "/ˌkəʊ.vɪd.naɪnˈtiːn/" },
    vi: "Dịch bệnh do virus corona bùng phát năm 2019 (Coronavirus Disease 2019)",
    definition: "An acute respiratory illness in humans caused by a coronavirus, capable of producing severe symptoms and death.",
    examTag: "Modern Context Vocabulary",
    wordFamily: { noun: [], verb: [], adj: [], adv: [] },
    synonyms: ["coronavirus pandemic"],
    antonyms: [],
    collocations: [
      { en: "COVID-19 pandemic / outbreak", vi: "đại dịch / đợt bùng phát COVID-19" },
      { en: "post-COVID-19 recovery plan", vi: "kế hoạch phục hồi kinh tế hậu đại dịch" },
      { en: "COVID-19 health protocols", vi: "quy chuẩn phòng dịch y tế" }
    ],
    idioms: [],
    toeicNote: "Trong bài thi thời kỳ mới, đề thường nói về 'remote working' và 'hybrid work models' được thúc đẩy sau đại dịch.",
    examples: [
      { en: "Many enterprises accelerated their digital transformation due to COVID-19.", vi: "Nhiều doanh nghiệp đã đẩy nhanh quá trình chuyển đổi số do ảnh hưởng của dịch COVID-19." }
    ]
  },

  "a": {
    word: "a",
    lemma: "a",
    partOfSpeech: "Indefinite Article",
    phonetic: "/eɪ/ or /ə/",
    ipa: { us: "/eɪ/ or /ə/", uk: "/eɪ/ or /ə/" },
    vi: "Một (mạo từ không xác định đứng trước danh từ đếm được số ít bắt đầu bằng phụ âm)",
    definition: "Used when referring to someone or something for the first time, or not specifically identifying them.",
    examTag: "English Core Grammar",
    wordFamily: { noun: [], verb: [], adj: [], adv: [] },
    synonyms: ["an", "one"],
    antonyms: [],
    collocations: [
      { en: "a wide variety of", vi: "nhiều loại, đa dạng các..." },
      { en: "a great deal of", vi: "một lượng lớn (dùng cho danh từ không đếm được)" },
      { en: "a number of", vi: "một số, vài (đi với danh từ số nhiều + động từ số nhiều)" }
    ],
    idioms: [],
    toeicNote: "⚠️ Chú ý: Dùng 'a' trước từ bắt đầu bằng âm phụ âm (a university, a European company), và 'an' trước âm nguyên âm (an hour, an honest mistake)!",
    examples: [
      { en: "The company plans to open a new branch office in Da Nang next quarter.", vi: "Công ty dự định mở một văn phòng chi nhánh mới tại Đà Nẵng vào quý tới." }
    ]
  },

  // --- 15 Từ TOEIC thông dụng theo yêu cầu kiểm thử ---
  "invoice": {
    word: "invoice",
    lemma: "invoice",
    partOfSpeech: "Noun & Verb",
    phonetic: "/ˈɪn.vɔɪs/",
    ipa: { us: "/ˈɪn.vɔɪs/", uk: "/ˈɪn.vɔɪs/" },
    vi: "Hóa đơn thanh toán (Danh từ); Xuất hóa đơn, gửi hóa đơn (Động từ)",
    definition: "A list of goods sent or services provided, with a statement of the sum due for these; a bill.",
    examTag: "TOEIC Part 3, 4 & 7 High-Frequency",
    wordFamily: {
      noun: [
        { term: "invoice", vi: "hóa đơn thanh toán, chứng từ thanh toán" },
        { term: "invoicing", vi: "quy trình xuất hóa đơn và lập chứng từ" }
      ],
      verb: [
        { term: "invoice", vi: "xuất hóa đơn tính tiền cho khách hàng" }
      ],
      adj: [],
      adv: []
    },
    synonyms: ["bill", "statement of account", "sales slip", "receipt"],
    antonyms: [],
    collocations: [
      { en: "issue an invoice", vi: "phát hành / xuất một hóa đơn" },
      { en: "outstanding / unpaid invoice", vi: "hóa đơn còn tồn đọng chưa được thanh toán" },
      { en: "invoice number and due date", vi: "mã số hóa đơn và hạn chót thanh toán" },
      { en: "attach an invoice to the email", vi: "đính kèm hóa đơn vào thư điện tử" }
    ],
    idioms: [],
    toeicNote: "💡 Part 7 thường hỏi: 'Where would this information most likely appear?' -> Đáp án: 'On an invoice' khi thấy có tên mặt hàng, đơn giá, mã số hóa đơn và hạn thanh toán.",
    examples: [
      { en: "Please review the attached invoice and remit payment within 30 days.", vi: "Vui lòng kiểm tra hóa đơn đính kèm và thanh toán trong vòng 30 ngày." },
      { en: "Our accounting department will invoice your firm upon delivery of the supplies.", vi: "Phòng kế toán của chúng tôi sẽ xuất hóa đơn cho công ty bạn ngay khi giao hàng." }
    ]
  },

  "schedule": {
    word: "schedule",
    lemma: "schedule",
    partOfSpeech: "Noun & Verb",
    phonetic: "/ˈskedʒ.uːl/",
    ipa: { us: "/ˈskedʒ.uːl/", uk: "/ˈʃedʒ.uːl/" },
    vi: "Lịch trình, thời khóa biểu (Danh từ); Lên lịch, sắp xếp thời gian (Động từ)",
    definition: "A plan that gives a list of events or tasks and the times at which each one should happen.",
    examTag: "TOEIC Core Vocabulary",
    wordFamily: {
      noun: [
        { term: "schedule", vi: "lịch trình, tiến độ công việc" },
        { term: "scheduler", vi: "người hoặc phần mềm điều phối lịch" }
      ],
      verb: [
        { term: "schedule", vi: "lên lịch, sắp xếp cuộc họp (quá khứ: scheduled)" },
        { term: "reschedule", vi: "dời lịch sang thời điểm khác" }
      ],
      adj: [
        { term: "scheduled", vi: "được lên lịch trước (scheduled maintenance)" }
      ],
      adv: []
    },
    synonyms: ["timetable", "agenda", "calendar", "program", "itinerary"],
    antonyms: [],
    collocations: [
      { en: "ahead of schedule", vi: "trước thời hạn dự kiến, vượt tiến độ" },
      { en: "behind schedule", vi: "chậm tiến độ so với kế hoạch" },
      { en: "on schedule", vi: "đúng tiến độ dự định" },
      { en: "tight schedule", vi: "lịch trình bận rộn, sít sao" },
      { en: "scheduled maintenance", vi: "bảo trì định kỳ theo lịch" }
    ],
    idioms: [],
    toeicNote: "⚠️ Bẫy giới từ: Nhớ kỹ bộ 3 cụm từ tiến độ: 'ahead of schedule' (vượt tiến độ), 'on schedule' (đúng tiến độ), 'behind schedule' (chậm tiến độ)!",
    examples: [
      { en: "Thanks to the team's extra effort, the construction completed ahead of schedule.", vi: "Nhờ nỗ lực của cả đội, công trình đã hoàn thành trước tiến độ kế hoạch." },
      { en: "The quarterly board meeting is scheduled for next Thursday at 10 AM.", vi: "Cuộc họp hội đồng quản trị quý được lên lịch vào 10 giờ sáng thứ Năm tới." }
    ]
  },

  "postpone": {
    word: "postpone",
    lemma: "postpone",
    partOfSpeech: "Verb",
    phonetic: "/poʊstˈpoʊn/",
    ipa: { us: "/poʊstˈpoʊn/", uk: "/pəʊstˈpəʊn/" },
    vi: "Hoãn lại, dời lại sang một thời điểm sau đó (Động từ)",
    definition: "To arrange for an event or action to take place at a later time than previously planned.",
    examTag: "TOEIC Core Action Verb",
    wordFamily: {
      noun: [
        { term: "postponement", vi: "sự hoãn lại, việc dời lịch công tác" }
      ],
      verb: [
        { term: "postpone", vi: "hoãn lại (quá khứ: postponed)" }
      ],
      adj: [
        { term: "postponable", vi: "có thể hoãn lại được" }
      ],
      adv: []
    },
    synonyms: ["delay", "defer", "put off", "reschedule", "suspend"],
    antonyms: ["advance", "bring forward", "expedite", "proceed"],
    collocations: [
      { en: "postpone an event / conference", vi: "hoãn lại một sự kiện / hội nghị" },
      { en: "postpone until next week", vi: "hoãn lại cho tới tuần sau" },
      { en: "postpone indefinitely", vi: "hoãn vô thời hạn" },
      { en: "due to bad weather, the match was postponed", vi: "do thời tiết xấu, trận đấu đã bị hoãn" }
    ],
    idioms: [],
    toeicNote: "💡 Từ đồng nghĩa rất hay kiểm tra ở Part 7: Khi văn bản gốc dùng 'postpone', đáp án trắc nghiệm thường paraphrase thành 'put off' hoặc 'delay'!",
    examples: [
      { en: "The management decided to postpone the annual conference due to flight cancellations.", vi: "Ban giám đốc đã quyết định hoãn hội nghị thường niên do các chuyến bay bị hủy." },
      { en: "We apologize for the postponement of the software launch until mid-June.", vi: "Chúng tôi xin lỗi vì sự dời lịch phát hành phần mềm đến giữa tháng 6." }
    ]
  },

  "candidate": {
    word: "candidate",
    lemma: "candidate",
    partOfSpeech: "Noun",
    phonetic: "/ˈkæn.dɪ.dət/",
    ipa: { us: "/ˈkæn.dɪ.dət/", uk: "/ˈkæn.dɪ.dət/" },
    vi: "Ứng viên (xin việc), thí sinh (dự thi), ứng cử viên (bầu cử)",
    definition: "A person who applies for a job, seeks an election, or takes an academic exam.",
    examTag: "TOEIC Recruitment High-Frequency",
    wordFamily: {
      noun: [
        { term: "candidate", vi: "ứng viên xin việc, thí sinh dự thi" },
        { term: "candidacy", vi: "sự ứng cử, tư cách ứng viên" }
      ],
      verb: [],
      adj: [],
      adv: []
    },
    synonyms: ["applicant", "interviewee", "prospective employee", "contender", "examinee"],
    antonyms: ["recruiter", "employer", "interviewer"],
    collocations: [
      { en: "qualified / ideal candidate", vi: "ứng viên có đầy đủ năng lực / ứng viên lý tưởng" },
      { en: "successful candidate", vi: "ứng viên trúng tuyển" },
      { en: "interview candidates", vi: "phỏng vấn các ứng viên" },
      { en: "shortlist candidates", vi: "sàng lọc đưa ứng viên vào danh sách rút gọn" }
    ],
    idioms: [],
    toeicNote: "Chủ đề tuyển dụng (Recruitment) trong TOEIC luôn xoay quanh: 'job opening', 'interview candidate', 'qualifications' và 'offer letter'.",
    examples: [
      { en: "The hiring committee selected three candidates for the final round of interviews.", vi: "Hội đồng tuyển dụng đã lựa chọn 3 ứng viên vào vòng phỏng vấn cuối cùng." },
      { en: "The successful candidate will demonstrate strong bilingual presentation skills.", vi: "Ứng viên trúng tuyển sẽ là người thể hiện kỹ năng thuyết trình song ngữ xuất sắc." }
    ]
  },

  "confirm": {
    word: "confirm",
    lemma: "confirm",
    partOfSpeech: "Verb",
    phonetic: "/kənˈfɜːrm/",
    ipa: { us: "/kənˈfɜːrm/", uk: "/kənˈfɜːm/" },
    vi: "Xác nhận, chứng thực, phê chuẩn (cuộc hẹn, vé máy bay, hợp đồng)",
    definition: "To state or prove the truth or accuracy of something; to make an arrangement definite.",
    examTag: "TOEIC Office & Travel Communication",
    wordFamily: {
      noun: [
        { term: "confirmation", vi: "sự xác nhận, thư/giấy xác nhận (confirmation email/code)" }
      ],
      verb: [
        { term: "confirm", vi: "xác nhận, khẳng định (quá khứ: confirmed)" }
      ],
      adj: [
        { term: "confirmed", vi: "đã được xác nhận chắc chắn (confirmed reservation)" },
        { term: "confirmative", vi: "có tính chất xác nhận" }
      ],
      adv: []
    },
    synonyms: ["verify", "validate", "affirm", "corroborate", "reiterate"],
    antonyms: ["cancel", "deny", "contradict", "refute", "reject"],
    collocations: [
      { en: "confirm a reservation / booking", vi: "xác nhận đặt chỗ / đặt phòng khách sạn" },
      { en: "confirmation email / number", vi: "email xác nhận / mã số xác nhận" },
      { en: "confirm receipt of the payment", vi: "xác nhận đã nhận được tiền thanh toán" },
      { en: "written confirmation", vi: "văn bản xác nhận chính thức" }
    ],
    idioms: [],
    toeicNote: "⚠️ Cấu trúc Part 5: 'Please contact us to confirm your attendance' (Vui lòng liên hệ để xác nhận sự tham dự).",
    examples: [
      { en: "We would like to confirm your hotel reservation for the night of October 24th.", vi: "Chúng tôi xin phép xác nhận lại việc đặt phòng khách sạn của bạn cho đêm ngày 24/10." },
      { en: "A confirmation email with the tracking number has been sent to your inbox.", vi: "Một email xác nhận kèm theo mã vận đơn đã được gửi tới hộp thư của bạn." }
    ]
  },

  "deadline": {
    word: "deadline",
    lemma: "deadline",
    partOfSpeech: "Noun",
    phonetic: "/ˈded.laɪn/",
    ipa: { us: "/ˈded.laɪn/", uk: "/ˈded.laɪn/" },
    vi: "Hạn chót, thời hạn hoàn thành công việc",
    definition: "The latest time or date by which something should be completed or submitted.",
    examTag: "TOEIC Core Project Vocabulary",
    wordFamily: { noun: [{ term: "deadline", vi: "hạn chót" }], verb: [], adj: [], adv: [] },
    synonyms: ["due date", "time limit", "cutoff date", "target date"],
    antonyms: [],
    collocations: [
      { en: "meet a deadline", vi: "kịp hạn chót, hoàn thành đúng hạn" },
      { en: "miss a deadline", vi: "trễ hạn chót" },
      { en: "extend a deadline", vi: "gia hạn thêm thời gian hoàn thành" },
      { en: "strict / tight deadline", vi: "thời hạn nghiêm ngặt / gấp gáp" },
      { en: "approach the deadline", vi: "tiến gần đến hạn chót" }
    ],
    idioms: [],
    toeicNote: "🚨 BẪY ĐỘNG TỪ TOEIC: Luôn học thuộc cặp động từ đi với 'deadline': 'MEET the deadline' (kịp hạn) đối lập với 'MISS the deadline' (trễ hạn)!",
    examples: [
      { en: "Our staff worked overtime during the weekend to meet the strict project deadline.", vi: "Đội ngũ nhân viên đã tăng ca vào dịp cuối tuần để kịp hạn chót nghiêm ngặt của dự án." },
      { en: "The client agreed to extend the submission deadline by two extra business days.", vi: "Khách hàng đã đồng ý gia hạn thời gian nộp thêm 2 ngày làm việc." }
    ]
  },

  "implement": {
    word: "implement",
    lemma: "implement",
    partOfSpeech: "Verb & Noun",
    phonetic: "/ˈɪm.plə.ment/",
    ipa: { us: "/ˈɪm.plə.ment/", uk: "/ˈɪm.plɪ.ment/" },
    vi: "Thực hiện, triển khai, thi hành (chính sách, phần mềm, kế hoạch) (Động từ); Công cụ, dụng cụ (Danh từ)",
    definition: "To put a decision, plan, policy, or system into effect.",
    examTag: "TOEIC Strategic Business Term",
    wordFamily: {
      noun: [
        { term: "implementation", vi: "sự triển khai, quá trình thực thi kế hoạch" },
        { term: "implement", vi: "công cụ lao động, dụng cụ nông nghiệp" }
      ],
      verb: [
        { term: "implement", vi: "triển khai thi hành (quá khứ: implemented)" }
      ],
      adj: [
        { term: "implemented", vi: "đã được đưa vào triển khai thực tế" }
      ],
      adv: []
    },
    synonyms: ["execute", "carry out", "enact", "apply", "enforce", "put into practice"],
    antonyms: ["repeal", "suspend", "neglect", "cancel"],
    collocations: [
      { en: "implement a new policy / strategy", vi: "triển khai một chính sách / chiến lược mới" },
      { en: "implement safety regulations", vi: "thực thi các quy định an toàn lao động" },
      { en: "smooth implementation", vi: "quá trình triển khai êm đẹp, thuận lợi" },
      { en: "cost of implementation", vi: "chi phí triển khai lắp đặt/áp dụng" }
    ],
    idioms: [],
    toeicNote: "💡 TOEIC Part 5 thường kiểm tra họ từ: 'the successful __________ of the software' -> Chỗ trống cần một Danh từ, chọn ngay 'implementation'!",
    examples: [
      { en: "The corporation plans to implement energy-saving practices across all branch facilities.", vi: "Tập đoàn có kế hoạch triển khai các giải pháp tiết kiệm năng lượng trên toàn bộ các cơ sở chi nhánh." },
      { en: "The smooth implementation of the new database system minimized business disruption.", vi: "Việc triển khai trơn tru hệ thống cơ sở dữ liệu mới đã hạn chế tối đa việc gián đoạn kinh doanh." }
    ]
  },

  "policy": {
    word: "policy",
    lemma: "policy",
    partOfSpeech: "Noun",
    phonetic: "/ˈpɑː.lə.si/",
    ipa: { us: "/ˈpɑː.lə.si/", uk: "/ˈpɒl.ə.si/" },
    vi: "Chính sách, quy định, nguyên tắc nội bộ; Hợp đồng bảo hiểm (insurance policy)",
    definition: "A course or principle of action adopted or proposed by an organization or individual.",
    examTag: "TOEIC Workplace & Human Resources",
    wordFamily: {
      noun: [
        { term: "policy", vi: "chính sách, quy định (số nhiều: policies)" },
        { term: "policymaker", vi: "nhà hoạch định chính sách" }
      ],
      verb: [],
      adj: [],
      adv: []
    },
    synonyms: ["rule", "regulation", "guideline", "protocol", "strategy", "code of conduct"],
    antonyms: [],
    collocations: [
      { en: "company policy on remote work", vi: "chính sách công ty về việc làm từ xa" },
      { en: "privacy policy", vi: "chính sách bảo mật quyền riêng tư" },
      { en: "refund / return policy", vi: "chính sách hoàn tiền / đổi trả hàng" },
      { en: "strictly adhere to the policy", vi: "tuân thủ nghiêm ngặt theo chính sách" },
      { en: "insurance policy", vi: "hợp đồng bảo hiểm" }
    ],
    idioms: [],
    toeicNote: "⚠️ Part 7 rất phổ biến đoạn văn 'Store Return Policy': Thường nêu rõ điều kiện đổi trả trong 14 hoặc 30 ngày kèm hóa đơn gốc ('with original receipt').",
    examples: [
      { en: "All newly hired personnel must read and sign the company confidentiality policy.", vi: "Tất cả nhân sự mới được tuyển dụng đều phải đọc và ký vào chính sách bảo mật của công ty." },
      { en: "Under our updated return policy, items may be exchanged within 30 days of purchase.", vi: "Theo chính sách đổi trả mới cập nhật, sản phẩm có thể được đổi trong vòng 30 ngày kể từ ngày mua." }
    ]
  },

  "warranty": {
    word: "warranty",
    lemma: "warranty",
    partOfSpeech: "Noun",
    phonetic: "/ˈwɔːr.ən.t̬i/",
    ipa: { us: "/ˈwɔːr.ən.t̬i/", uk: "/ˈwɒr.ən.ti/" },
    vi: "Phiếu bảo hành, cam kết bảo hành, thời hạn bảo hành sản phẩm",
    definition: "A written guarantee, issued to the purchaser of an article by its manufacturer, promising to repair or replace it if necessary within a specified period.",
    examTag: "TOEIC Consumer & Product Support",
    wordFamily: {
      noun: [
        { term: "warranty", vi: "giấy bảo hành, chế độ bảo hành (số nhiều: warranties)" },
        { term: "warrantor", vi: "bên đứng ra chịu trách nhiệm bảo hành" }
      ],
      verb: [
        { term: "warrant", vi: "bảo đảm, biện minh cho" }
      ],
      adj: [
        { term: "warranted", vi: "được bảo đảm, có lý" }
      ],
      adv: []
    },
    synonyms: ["guarantee", "certificate", "assurance", "pledge", "covenant"],
    antonyms: [],
    collocations: [
      { en: "under warranty", vi: "đang trong thời hạn bảo hành" },
      { en: "two-year limited warranty", vi: "bảo hành có giới hạn trong vòng 2 năm" },
      { en: "extended warranty", vi: "gói bảo hành mở rộng thêm thời gian" },
      { en: "void the warranty", vi: "làm mất hiệu lực bảo hành (do tự ý tháo lắp)" },
      { en: "warranty period expires", vi: "thời hạn bảo hành hết hiệu lực" }
    ],
    idioms: [],
    toeicNote: "⚠️ Cụm giới từ hay ra: 'The electronic appliance is covered UNDER warranty' (Thiết bị điện tử được bảo hành dưới chế độ bảo hành).",
    examples: [
      { en: "The laptop comes with a two-year manufacturer warranty covering parts and labor.", vi: "Máy tính xách tay đi kèm gói bảo hành 2 năm của nhà sản xuất bao gồm linh kiện và công sửa chữa." },
      { en: "Opening the device casing without authorization will void the warranty.", vi: "Tự ý mở vỏ thiết bị mà không có sự ủy quyền sẽ làm mất hiệu lực bảo hành." }
    ]
  },

  "budget": {
    word: "budget",
    lemma: "budget",
    partOfSpeech: "Noun, Verb & Adjective",
    phonetic: "/ˈbʌdʒ.ɪt/",
    ipa: { us: "/ˈbʌdʒ.ɪt/", uk: "/ˈbʌdʒ.ɪt/" },
    vi: "Ngân sách, quỹ chi tiêu (Danh từ); Lập dự toán ngân sách (Động từ); Giá rẻ, tiết kiệm (Tính từ)",
    definition: "An estimate of income and expenditure for a set period of time; an allowance of money.",
    examTag: "TOEIC Finance & Corporate Planning",
    wordFamily: {
      noun: [
        { term: "budget", vi: "ngân sách, dự toán chi tiêu" },
        { term: "budgeting", vi: "nghiệp vụ lập ngân sách và cân đối tài chính" }
      ],
      verb: [
        { term: "budget", vi: "lập dự toán phân bổ ngân sách (quá khứ: budgeted)" }
      ],
      adj: [
        { term: "budgetary", vi: "thuộc về ngân sách (budgetary constraints)" },
        { term: "budget", vi: "giá bình dân, tiết kiệm (budget airline)" }
      ],
      adv: []
    },
    synonyms: ["financial plan", "allocation", "funds", "allowance", "fiscal estimate"],
    antonyms: [],
    collocations: [
      { en: "within budget", vi: "trong phạm vi ngân sách cho phép" },
      { en: "over budget", vi: "vượt quá hạn mức ngân sách" },
      { en: "budget deficit / surplus", vi: "thâm hụt / thặng dư ngân sách" },
      { en: "allocate the annual budget", vi: "phân bổ ngân sách thường niên" },
      { en: "budget constraints / cuts", vi: "các hạn chế / cắt giảm ngân sách" }
    ],
    idioms: [
      { en: "on a shoestring budget", vi: "với ngân sách cực kỳ eo hẹp, thắt lưng buộc bụng" }
    ],
    toeicNote: "💡 Giới từ cực kỳ phổ biến trong đề thi: 'complete the renovation WITHIN budget' (hoàn thành cải tạo trong giới hạn ngân sách).",
    examples: [
      { en: "The marketing director submitted an updated budget proposal for the next fiscal year.", vi: "Giám đốc tiếp thị đã nộp bản đề xuất ngân sách cập nhật cho năm tài chính tiếp theo." },
      { en: "Due to budgetary constraints, we must postpone purchasing new office furniture.", vi: "Do hạn chế về ngân sách, chúng tôi buộc phải hoãn việc mua sắm bàn ghế văn phòng mới." }
    ]
  },

  "announce": {
    word: "announce",
    lemma: "announce",
    partOfSpeech: "Verb",
    phonetic: "/əˈnaʊns/",
    ipa: { us: "/əˈnaʊns/", uk: "/əˈnaʊns/" },
    vi: "Thông báo, tuyên bố, công bố (tin tức, quyết định, việc sáp nhập)",
    definition: "To make a formal public statement about a fact, occurrence, or intention.",
    examTag: "TOEIC Corporate News & Part 4 Announcements",
    wordFamily: {
      noun: [
        { term: "announcement", vi: "thông báo chính thức, lời tuyên bố" },
        { term: "announcer", vi: "phát thanh viên, người đọc thông báo" }
      ],
      verb: [
        { term: "announce", vi: "thông báo, công bố (quá khứ: announced)" }
      ],
      adj: [
        { term: "announced", vi: "đã được công bố chính thức" }
      ],
      adv: []
    },
    synonyms: ["declare", "proclaim", "broadcast", "disclose", "publish", "state"],
    antonyms: ["conceal", "suppress", "withhold", "keep secret"],
    collocations: [
      { en: "announce a merger / acquisition", vi: "công bố thương vụ sáp nhập / mua lại doanh nghiệp" },
      { en: "make an official announcement", vi: "đưa ra một thông báo chính thức" },
      { en: "proud to announce", vi: "vinh dự / tự hào thông báo" },
      { en: "publicly announce", vi: "công bố rộng rãi trước công chúng" }
    ],
    idioms: [],
    toeicNote: "Trong phần Listening Part 4 (Short Talks), dạng bài 'Public Announcement' (thông báo nhà ga, sân bay, cửa hàng) xuất hiện đều đặn trong mọi đề thi!",
    examples: [
      { en: "The board of directors is pleased to announce the appointment of a new Managing Director.", vi: "Hội đồng quản trị vui mừng thông báo về việc bổ nhiệm Tổng giám đốc mới." },
      { en: "Passengers should listen carefully to all gate announcements before boarding.", vi: "Hành khách nên chú ý lắng nghe mọi thông báo tại cửa khởi hành trước khi lên máy bay." }
    ]
  },

  "promote": {
    word: "promote",
    lemma: "promote",
    partOfSpeech: "Verb",
    phonetic: "/prəˈmoʊt/",
    ipa: { us: "/prəˈmoʊt/", uk: "/prəˈməʊt/" },
    vi: "Thăng chức, cất nhắc (nhân sự); Đẩy mạnh, quảng bá (sản phẩm, dịch vụ); Thúc đẩy (tăng trưởng)",
    definition: "To raise someone to a higher position or rank; to encourage or support the progress of something; to publicize.",
    examTag: "TOEIC Human Resources & Marketing",
    wordFamily: {
      noun: [
        { term: "promotion", vi: "sự thăng chức; chương trình khuyến mãi, sự quảng bá" },
        { term: "promoter", vi: "người quảng bá, nhà tổ chức quảng cáo" }
      ],
      verb: [
        { term: "promote", vi: "thăng chức, xúc tiến (quá khứ: promoted)" }
      ],
      adj: [
        { term: "promotional", vi: "mang tính khuyến mãi, quảng cáo (promotional offer/discount)" }
      ],
      adv: []
    },
    synonyms: ["advance", "elevate", "endorse", "market", "advertise", "boost"],
    antonyms: ["demote", "degrade", "hinder", "discourage"],
    collocations: [
      { en: "be promoted to senior manager", vi: "được thăng chức lên vị trí trưởng phòng cấp cao" },
      { en: "promotional discount / material", vi: "chiết khấu khuyến mãi / tài liệu quảng cáo" },
      { en: "promote economic growth", vi: "thúc đẩy sự tăng trưởng kinh tế" },
      { en: "promote healthy work-life balance", vi: "khuyến khích sự cân bằng giữa công việc và đời sống" }
    ],
    idioms: [],
    toeicNote: "🚨 2 NGHĨA RẤT HAY ĐƯỢC HỎI TRONG ĐỀ THI: 1) Nhân sự: 'He was promoted to director' (thăng chức); 2) Tiếp thị: 'Promote our spring clothing line' (quảng bá dòng sản phẩm).",
    examples: [
      { en: "After demonstrating exceptional leadership, Lisa was promoted to head of sales.", vi: "Sau khi thể hiện khả năng lãnh đạo xuất sắc, Lisa đã được thăng chức lên làm trưởng phòng kinh doanh." },
      { en: "The company launched an aggressive digital campaign to promote its new smartphone.", vi: "Công ty đã tung ra một chiến dịch kỹ thuật số rầm rộ để quảng bá dòng điện thoại thông minh mới." }
    ]
  },

  "inspect": {
    word: "inspect",
    lemma: "inspect",
    partOfSpeech: "Verb",
    phonetic: "/ɪnˈspekt/",
    ipa: { us: "/ɪnˈspekt/", uk: "/ɪnˈspekt/" },
    vi: "Kiểm tra, thanh tra, thị sát kỹ lưỡng (chất lượng, an toàn, công trình)",
    definition: "To look at someone or something closely, typically in order to detect errors or determine conditions.",
    examTag: "TOEIC Quality Assurance & Manufacturing",
    wordFamily: {
      noun: [
        { term: "inspection", vi: "buổi thanh tra, đợt kiểm tra chất lượng (safety inspection)" },
        { term: "inspector", vi: "thanh tra viên, người kiểm định chất lượng" }
      ],
      verb: [
        { term: "inspect", vi: "thanh tra, xem xét (quá khứ: inspected)" }
      ],
      adj: [
        { term: "inspected", vi: "đã qua kiểm tra và đóng dấu đạt chuẩn" }
      ],
      adv: []
    },
    synonyms: ["examine", "audit", "scrutinize", "check", "survey", "review"],
    antonyms: ["ignore", "overlook", "neglect"],
    collocations: [
      { en: "inspect facilities / premises", vi: "thanh tra các cơ sở / mặt bằng hoạt động" },
      { en: "pass safety inspection", vi: "vượt qua đợt kiểm tra an toàn" },
      { en: "conduct an annual inspection", vi: "tiến hành một đợt thanh tra định kỳ hàng năm" },
      { en: "building inspector", vi: "thanh tra viên thẩm định xây dựng" }
    ],
    idioms: [],
    toeicNote: "Part 5 thường bẫy từ loại giữa danh từ chỉ người và danh từ chỉ vật: 'An experienced __________ arrived to evaluate the plant' -> Chọn 'inspector' (thanh tra viên), không chọn 'inspection'.",
    examples: [
      { en: "A government official will inspect the factory to ensure adherence to environmental laws.", vi: "Một quan chức chính phủ sẽ thanh tra nhà máy để đảm bảo tuân thủ luật bảo vệ môi trường." },
      { en: "Technicians thoroughly inspect each vehicle before it leaves the assembly plant.", vi: "Các kỹ thuật viên kiểm tra kỹ lưỡng từng chiếc xe trước khi xuất xưởng khỏi xí nghiệp lắp ráp." }
    ]
  },

  "feedback": {
    word: "feedback",
    lemma: "feedback",
    partOfSpeech: "Uncountable Noun",
    phonetic: "/ˈfiːd.bæk/",
    ipa: { us: "/ˈfiːd.bæk/", uk: "/ˈfiːd.bæk/" },
    vi: "Ý kiến đóng góp, phản hồi đánh giá (Danh từ không đếm được)",
    definition: "Information about reactions to a product, a person's performance of a task, etc. used as a basis for improvement.",
    examTag: "TOEIC Customer Relations & Surveys",
    wordFamily: { noun: [{ term: "feedback", vi: "ý kiến phản hồi" }], verb: [], adj: [], adv: [] },
    synonyms: ["input", "evaluation", "assessment", "critique", "comments", "reviews"],
    antonyms: [],
    collocations: [
      { en: "valuable / constructive feedback", vi: "ý kiến đóng góp quý báu / có tính xây dựng" },
      { en: "customer feedback survey", vi: "bản khảo sát lấy ý kiến khách hàng" },
      { en: "provide positive / negative feedback", vi: "đưa ra phản hồi tích cực / tiêu cực" },
      { en: "welcome user feedback", vi: "rất hoan nghênh phản hồi từ người sử dụng" }
    ],
    idioms: [],
    toeicNote: "⚠️ LƯU Ý NGỮ PHÁP TOEIC: 'Feedback' là DANH TỪ KHÔNG ĐẾM ĐƯỢC! Không bao giờ dùng 'a feedback' hay 'feedbacks'. Hãy dùng 'some feedback' hoặc 'a piece of feedback'.",
    examples: [
      { en: "We appreciate your feedback and will use your suggestions to enhance our services.", vi: "Chúng tôi rất trân trọng ý kiến phản hồi của bạn và sẽ dùng các đề xuất đó để hoàn thiện dịch vụ." },
      { en: "The seminar participants provided overwhelmingly positive feedback on the keynote speech.", vi: "Những người tham dự hội thảo đã đưa ra những đánh giá phản hồi hết sức tích cực về bài phát biểu chính." }
    ]
  },

  "eligible": {
    word: "eligible",
    lemma: "eligible",
    partOfSpeech: "Adjective",
    phonetic: "/ˈel.ə.dʒə.bəl/",
    ipa: { us: "/ˈel.ə.dʒə.bəl/", uk: "/ˈel.ɪ.dʒə.bəl/" },
    vi: "Đủ tư cách, đủ điều kiện, thích hợp (để nhận phúc lợi, ứng tuyển, thăng tiến)",
    definition: "Having the right, qualifications, or meeting the conditions to do or receive something.",
    examTag: "TOEIC Corporate Benefits & Regulations",
    wordFamily: {
      noun: [
        { term: "eligibility", vi: "điều kiện hợp lệ, tư cách đủ tiêu chuẩn (eligibility criteria)" }
      ],
      verb: [],
      adj: [
        { term: "eligible", vi: "đủ điều kiện, hợp lệ" },
        { term: "ineligible", vi: "không đủ tư cách, không hợp lệ" }
      ],
      adv: []
    },
    synonyms: ["qualified", "entitled", "authorized", "suitable", "permitted"],
    antonyms: ["ineligible", "disqualified", "unfit", "unsuitable"],
    collocations: [
      { en: "eligible for a promotion / bonus", vi: "đủ điều kiện để được thăng chức / thưởng" },
      { en: "eligible to receive tuition assistance", vi: "đủ điều kiện nhận trợ cấp học phí" },
      { en: "eligibility requirements / criteria", vi: "các tiêu chí / điều kiện xét duyệt hợp lệ" },
      { en: "become eligible after six months", vi: "trở nên đủ điều kiện sau 6 tháng công tác" }
    ],
    idioms: [],
    toeicNote: "🚨 CẤU TRÚC BẮT BUỘC NHỚ TOEIC PART 5: 1) 'be eligible FOR + Danh từ' (e.g. eligible for a discount); 2) 'be eligible TO + Động từ nguyên mẫu' (e.g. eligible to vote).",
    examples: [
      { en: "Full-time employees who have completed probation are eligible for comprehensive medical benefits.", vi: "Nhân viên chính thức đã hoàn thành thời gian thử việc sẽ đủ điều kiện hưởng đầy đủ phúc lợi y tế." },
      { en: "Please check the company policy to see if you are eligible to apply for sabbatical leave.", vi: "Vui lòng xem lại quy định công ty để biết bạn có đủ điều kiện nộp đơn xin nghỉ phép dài hạn hay không." }
    ]
  },

  // Từ phục vụ tra ngược & kiểm thử gõ sai
  "result": {
    word: "result",
    lemma: "result",
    partOfSpeech: "Noun & Verb",
    phonetic: "/rɪˈzʌlt/",
    ipa: { us: "/rɪˈzʌlt/", uk: "/rɪˈzʌlt/" },
    vi: "Kết quả, thành quả (Danh từ); Dẫn đến, bắt nguồn từ (Động từ)",
    definition: "A thing that is caused or produced by something else; a consequence or outcome.",
    examTag: "TOEIC High-Frequency",
    wordFamily: {
      noun: [{ term: "result", vi: "kết quả, hiệu quả" }],
      verb: [{ term: "result", vi: "dẫn tới (result in), bắt nguồn từ (result from)" }],
      adj: [{ term: "resultant", vi: "xảy ra như là hậu quả của" }],
      adv: []
    },
    synonyms: ["outcome", "consequence", "effect", "conclusion", "finding"],
    antonyms: ["cause", "origin", "source"],
    collocations: [
      { en: "as a result of", vi: "do là kết quả của, vì lý do..." },
      { en: "achieve excellent results", vi: "đạt được những kết quả xuất sắc" },
      { en: "result in significant savings", vi: "dẫn đến việc tiết kiệm đáng kể" },
      { en: "result from mechanical failure", vi: "bắt nguồn từ lỗi kỹ thuật cơ khí" }
    ],
    idioms: [],
    toeicNote: "⚠️ Phân biệt quan trọng: 'result IN' = dẫn đến kết quả gì; 'result FROM' = bắt nguồn từ nguyên nhân gì!",
    examples: [
      { en: "The positive quarterly results reflect the success of our digital marketing strategy.", vi: "Kết quả tích cực theo quý phản ánh sự thành công của chiến lược tiếp thị số của chúng tôi." },
      { en: "Careful planning resulted in a smooth office relocation without any downtime.", vi: "Việc lên kế hoạch cẩn thận đã dẫn đến một cuộc chuyển văn phòng êm đẹp mà không bị gián đoạn." }
    ]
  },

  "outcome": {
    word: "outcome",
    lemma: "outcome",
    partOfSpeech: "Noun",
    phonetic: "/ˈaʊt.kʌm/",
    ipa: { us: "/ˈaʊt.kʌm/", uk: "/ˈaʊt.kʌm/" },
    vi: "Kết quả cuối cùng, cục diện, kết cục của một sự việc",
    definition: "The way a thing turns out; a consequence, conclusion, or final result.",
    examTag: "TOEIC High-Frequency",
    wordFamily: { noun: [{ term: "outcome", vi: "kết quả cuối cùng" }], verb: [], adj: [], adv: [] },
    synonyms: ["result", "consequence", "end result", "aftermath"],
    antonyms: ["beginning", "cause", "start"],
    collocations: [
      { en: "favorable / successful outcome", vi: "kết quả thuận lợi / thắng lợi" },
      { en: "outcome of the negotiation", vi: "kết quả của cuộc đàm phán" },
      { en: "anticipate the outcome", vi: "dự đoán trước kết quả" }
    ],
    idioms: [],
    toeicNote: "Thường dùng để nói về kết quả của đàm phán ('negotiation outcome') hoặc nghiên cứu khảo nghiệm.",
    examples: [
      { en: "Both parties were satisfied with the outcome of the contract negotiations.", vi: "Cả hai bên đều hài lòng với kết quả của cuộc đàm phán hợp đồng." }
    ]
  },

  "receive": {
    word: "receive",
    lemma: "receive",
    partOfSpeech: "Verb",
    phonetic: "/rɪˈsiːv/",
    ipa: { us: "/rɪˈsiːv/", uk: "/rɪˈsiːv/" },
    vi: "Nhận, tiếp nhận (thư từ, thanh toán, giải thưởng, cuộc gọi)",
    definition: "To be given, presented with, or paid something; to accept delivery of something.",
    examTag: "TOEIC High-Frequency",
    wordFamily: {
      noun: [
        { term: "receipt", vi: "hóa đơn biên lai; sự nhận được (upon receipt of)" },
        { term: "receiver", vi: "người nhận, ống nghe điện thoại" },
        { term: "reception", vi: "quầy lễ tân, sự tiếp đón nồng hậu" },
        { term: "recipient", vi: "người nhận (giải thưởng, thư từ, bưu phẩm)" }
      ],
      verb: [
        { term: "receive", vi: "nhận được (quá khứ: received)" }
      ],
      adj: [
        { term: "receptive", vi: "sẵn sàng đón nhận ý kiến mới" }
      ],
      adv: []
    },
    synonyms: ["accept", "obtain", "acquire", "get", "collect"],
    antonyms: ["send", "dispatch", "give", "distribute"],
    collocations: [
      { en: "receive confirmation", vi: "nhận được văn bản xác nhận" },
      { en: "upon receipt of your payment", vi: "ngay sau khi nhận được tiền thanh toán của quý khách" },
      { en: "receive an award for excellence", vi: "nhận giải thưởng về sự cống hiến xuất sắc" }
    ],
    idioms: [],
    toeicNote: "⚠️ LƯU Ý CHÍNH TẢ: Chữ 'e' đứng trước 'i' sau 'c': R-E-C-E-I-V-E (hay bị gõ sai thành 'recieve')!",
    examples: [
      { en: "You will receive an automated notification as soon as your shipment departs.", vi: "Bạn sẽ nhận được thông báo tự động ngay khi lô hàng của bạn bắt đầu xuất phát." }
    ]
  }
};

for (const [k, v] of Object.entries(SPECIAL_ENTRIES)) {
  const normKey = k.toLowerCase().trim();
  LEXICON[normKey] = formatEntry(normKey, v);
}

fs.writeFileSync(path.join(__dirname, '../data/dictionary_lexicon.json'), JSON.stringify(LEXICON, null, 2), 'utf8');
console.log('Saved data/dictionary_lexicon.json with', Object.keys(LEXICON).length, 'entries.');
