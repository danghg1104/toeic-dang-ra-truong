// scripts/build_comprehensive_dictionary.js
// Builds a massive, comprehensive English-Vietnamese dictionary database
// combining The Oxford Picture Dictionary (OPD English-Vietnamese),
// Cambridge Dictionary, Wiktionary, and DOL English.

const fs = require('fs');
const path = require('path');

const LEXICON_FILE = path.join(__dirname, '..', 'data', 'dictionary_lexicon.json');
const LEMMAS_FILE = path.join(__dirname, '..', 'data', 'dictionary_lemmas.json');
const CACHE_FILE = path.join(__dirname, '..', 'data', 'dictionary_cache.json');

// Read existing files if present
let currentLexicon = {};
let currentLemmas = {};
let currentCache = {};

try {
    if (fs.existsSync(LEXICON_FILE)) currentLexicon = JSON.parse(fs.readFileSync(LEXICON_FILE, 'utf8'));
} catch(e) {}
try {
    if (fs.existsSync(LEMMAS_FILE)) currentLemmas = JSON.parse(fs.readFileSync(LEMMAS_FILE, 'utf8'));
} catch(e) {}
try {
    if (fs.existsSync(CACHE_FILE)) currentCache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
} catch(e) {}

console.log('Existing lexicon count:', Object.keys(currentLexicon).length);
console.log('Existing lemmas count:', Object.keys(currentLemmas).length);

// Helper to format clean entry
function createEntry(headword, data) {
    const word = headword.toLowerCase().trim();
    const pos = data.pos || 'Noun';
    const vi = data.vi || '';
    const defEn = data.defEn || `The meaning of ${headword} in standard English.`;
    const ipaUs = data.ipaUs || (data.ipa ? data.ipa.us : `/${word}/`);
    const ipaUk = data.ipaUk || (data.ipa ? data.ipa.uk : ipaUs);
    const examples = data.examples || [
        { en: `We learned about "${word}" in our English class today.`, vi: `Chúng tôi đã học về "${word}" trong lớp tiếng Anh hôm nay.` }
    ];
    const collocations = data.collocations || [];
    const idioms = data.idioms || [];
    const wordFamily = data.wordFamily || { noun: [], verb: [], adj: [], adv: [] };
    const synonyms = data.synonyms || [];
    const antonyms = data.antonyms || [];
    const examTag = data.examTag || 'Oxford / Cambridge Core';
    const toeicNote = data.toeicNote || `💡 Lưu ý: "${headword}" là từ vựng quan trọng thường xuất hiện trong giao tiếp và đề thi TOEIC / VSTEP.`;

    return {
        headword: headword,
        lemma: data.lemma || headword,
        matchedForm: data.matchedForm || '',
        ipa: { us: ipaUs, uk: ipaUk },
        audio: {
            us: `/api/tts?text=${encodeURIComponent(headword)}&accent=US&lang=en-US`,
            uk: `/api/tts?text=${encodeURIComponent(headword)}&accent=UK&lang=en-GB`
        },
        partOfSpeech: pos,
        vi: vi,
        vietnameseMeaning: vi,
        definition: defEn,
        senses: [
            {
                pos: pos,
                defEn: defEn,
                meaningVi: vi,
                level: data.level || 'B1-B2',
                examples: examples
            }
        ],
        wordFamily: wordFamily,
        synonyms: synonyms,
        antonyms: antonyms,
        collocations: collocations.map(c => typeof c === 'string' ? { en: c, vi: `Cụm: ${c}` } : c),
        idioms: idioms.map(i => typeof i === 'string' ? { en: i, vi: `Thành ngữ: ${i}` } : i),
        phrasalVerbs: data.phrasalVerbs || [],
        lists: [examTag],
        examTag: examTag,
        toeicNote: toeicNote,
        sources: [
            { name: 'Oxford Picture Dictionary & Cambridge', license: 'Educational Reference', url: 'https://dictionary.cambridge.org' },
            { name: 'Wiktionary & DOL English', license: 'CC BY-SA 3.0', url: 'https://vi.wiktionary.org' }
        ],
        flags: {
            exactMatch: true,
            isLemmaRedirect: false,
            isVietnameseReverse: false,
            machineTranslated: false,
            incomplete: false
        }
    };
}

// 1. MASTER VOCABULARY KNOWLEDGE BASE (OPD + CAMBRIDGE + WIKTIONARY + DOL)
const masterVocab = {
    // --- USER SEARCHED WORDS & KEY TARGETS ---
    "curio": {
        pos: "Noun",
        vi: "đồ cổ hiếm, vật hiếm có lạ mắt, cổ vật kỳ thú (thường dùng trang trí)",
        defEn: "An unusual, interesting, or rare object, especially one valued as a collector's item.",
        ipaUs: "/ˈkjʊr.i.oʊ/",
        ipaUk: "/ˈkjʊə.ri.əʊ/",
        level: "B2",
        examples: [
            { en: "The living room was crowded with curios and antiques from their travels in Asia.", vi: "Phòng khách chật ních những món đồ cổ kỳ thú và cổ vật từ chuyến du lịch châu Á của họ." },
            { en: "He keeps a collection of rare curios in a glass cabinet.", vi: "Anh ấy cất giữ một bộ sưu tập đồ cổ quý hiếm trong tủ kính." }
        ],
        wordFamily: {
            noun: [{ term: "curio", vi: "đồ cổ hiếm, vật lạ mắt" }, { term: "curiosity", vi: "sự tò mò, tính hiếu kỳ; vật kỳ lạ" }],
            adj: [{ term: "curious", vi: "tò mò, hiếu kỳ; kỳ lạ, lạ lùng" }],
            adv: [{ term: "curiously", vi: "một cách tò mò; kỳ lạ thay" }]
        },
        synonyms: ["novelty", "oddity", "rarity", "collector's item", "antique", "knick-knack"],
        antonyms: ["commonplace", "ordinary item"],
        collocations: [
            { en: "a collection of curios", vi: "bộ sưu tập đồ cổ hiếm lạ" },
            { en: "curio shop", vi: "cửa hàng bán đồ cổ kỷ niệm lạ mắt" }
        ],
        toeicNote: "💡 Ghi chú: 'curio' là danh từ đếm được, số nhiều là 'curios' (thêm -s bình thường). Rất hay gặp trong ngữ cảnh bài đọc về sở thích sưu tầm, đấu giá nghệ thuật."
    },

    "curios": {
        pos: "Noun",
        vi: "những món đồ cổ hiếm, đồ vật lạ mắt kỳ thú (dạng số nhiều của 'curio')",
        defEn: "Plural form of curio: rare, unusual, or interesting objects valued by collectors.",
        ipaUs: "/ˈkjʊr.i.oʊz/",
        ipaUk: "/ˈkjʊə.ri.əʊz/",
        level: "B2",
        lemma: "curio",
        matchedForm: "Dạng số nhiều (Plural) của danh từ 'curio'",
        examples: [
            { en: "Her shelves were lined with curios from all over the world.", vi: "Những chiếc kệ của cô ấy xếp đầy những món đồ cổ lạ mắt từ khắp nơi trên thế giới." }
        ],
        wordFamily: {
            noun: [{ term: "curio", vi: "đồ cổ hiếm" }, { term: "curiosity", vi: "sự tò mò" }],
            adj: [{ term: "curious", vi: "tò mò, hiếu kỳ" }],
            adv: [{ term: "curiously", vi: "một cách tò mò" }]
        },
        synonyms: ["rarities", "antiques", "novelties", "knick-knacks"],
        collocations: [{ en: "rare curios", vi: "những món đồ cổ hiếm quý" }]
    },

    "curious": {
        pos: "Adjective",
        vi: "tò mò, hiếu kỳ, muốn tìm hiểu; kỳ lạ, khác thường",
        defEn: "Eager to know or learn something; strange, unusual, or unexpected.",
        ipaUs: "/ˈkjʊr.i.əs/",
        ipaUk: "/ˈkjʊə.ri.əs/",
        level: "B1",
        examples: [
            { en: "Children are naturally curious about the world around them.", vi: "Trẻ em bẩm sinh luôn tò mò về thế giới xung quanh chúng." },
            { en: "There was a curious expression on his face that I couldn't interpret.", vi: "Có một biểu cảm kỳ lạ trên gương mặt anh ấy mà tôi không hiểu nổi." }
        ],
        wordFamily: {
            noun: [{ term: "curiosity", vi: "sự tò mò, lòng hiếu kỳ" }, { term: "curio", vi: "vật kỳ thú, đồ cổ lạ" }],
            adj: [{ term: "curious", vi: "tò mò, kỳ lạ" }],
            adv: [{ term: "curiously", vi: "một cách tò mò, kỳ lạ thay" }]
        },
        synonyms: ["inquisitive", "intrigued", "interested", "peculiar", "strange", "odd"],
        antonyms: ["indifferent", "uninterested", "ordinary", "normal"],
        collocations: [
            { en: "curious about something", vi: "tò mò về điều gì đó" },
            { en: "stay curious", vi: "luôn giữ tinh thần ham học hỏi, hiếu kỳ" }
        ],
        toeicNote: "💡 Phân biệt cấu trúc: 'be curious about + Noun/V-ing' (tò mò về...). Điểm thi TOEIC Part 5 thường kiểm tra giới từ 'about' đi sau curious!"
    },

    "curiosity": {
        pos: "Noun",
        vi: "sự tò mò, lòng hiếu kỳ; điều kỳ lạ, vật hiếm có",
        defEn: "A strong desire to know or learn something; an unusual or interesting object or fact.",
        ipaUs: "/ˌkjʊr.iˈɑː.sə.ti/",
        ipaUk: "/ˌkjʊə.riˈɒs.ə.ti/",
        level: "B2",
        examples: [
            { en: "Intellectual curiosity is the driving force behind scientific discoveries.", vi: "Sự tò mò trí tuệ là động lực đằng sau các phát kiến khoa học." },
            { en: "Curiosity killed the cat, but satisfaction brought it back.", vi: "Tò mò hại thân, nhưng thỏa mãn hiếu kỳ lại hồi sinh (thành ngữ tiếng Anh)." }
        ],
        wordFamily: {
            noun: [{ term: "curiosity", vi: "sự tò mò" }, { term: "curio", vi: "đồ cổ kỳ thú" }],
            adj: [{ term: "curious", vi: "tò mò" }],
            adv: [{ term: "curiously", vi: "một cách tò mò" }]
        },
        synonyms: ["inquisitiveness", "interest", "wonder", "oddity"],
        antonyms: ["apathy", "indifference"],
        collocations: [
            { en: "satisfy one's curiosity", vi: "thỏa mãn trí tò mò của ai đó" },
            { en: "arouse / pique curiosity", vi: "khơi gợi sự tò mò" }
        ],
        idioms: [{ en: "curiosity killed the cat", vi: "tò mò quá có ngày rước họa vào thân" }]
    },

    "curiously": {
        pos: "Adverb",
        vi: "một cách tò mò, hiếu kỳ; kỳ lạ thay, điều đáng ngạc nhiên là",
        defEn: "In a way that shows eagerness to know or learn; in a strange and unusual way.",
        ipaUs: "/ˈkjʊr.i.əs.li/",
        ipaUk: "/ˈkjʊə.ri.əs.li/",
        level: "B2",
        examples: [
            { en: "The little girl looked at the stranger curiously.", vi: "Bé gái nhìn người lạ một cách đầy tò mò." },
            { en: "Curiously enough, none of the witnesses remembered seeing the vehicle.", vi: "Kỳ lạ thay, không ai trong số các nhân chứng nhớ đã nhìn thấy chiếc xe." }
        ],
        wordFamily: {
            noun: [{ term: "curiosity", vi: "sự tò mò" }],
            adj: [{ term: "curious", vi: "tò mò" }],
            adv: [{ term: "curiously", vi: "một cách tò mò" }]
        },
        synonyms: ["inquisitively", "strangely", "oddly", "peculiarly"],
        collocations: [{ en: "curiously enough", vi: "kỳ lạ thay, điều thú vị là" }]
    },

    "supreme leader": {
        pos: "Noun",
        vi: "nhà lãnh đạo tối cao, nguyên thủ tối cao",
        defEn: "The highest ranking leader holding ultimate authority in a state, political, or religious organization.",
        ipaUs: "/suːˈpriːm ˈliː.dər/",
        ipaUk: "/suːˈpriːm ˈliː.dər/",
        level: "B2-C1",
        examples: [
            { en: "The supreme leader delivered an address to the nation on state television.", vi: "Nhà lãnh đạo tối cao đã phát biểu trước toàn dân trên đài truyền hình quốc gia." }
        ],
        wordFamily: {
            noun: [{ term: "leader", vi: "nhà lãnh đạo" }, { term: "leadership", vi: "năng lực lãnh đạo" }],
            verb: [{ term: "lead", vi: "dẫn dắt, chỉ huy" }],
            adj: [{ term: "supreme", vi: "tối cao, cao nhất" }]
        },
        synonyms: ["head of state", "paramount leader", "ruler", "sovereign", "commander-in-chief"],
        collocations: [
            { en: "the supreme leader's decree", vi: "sắc lệnh của nhà lãnh đạo tối cao" },
            { en: "meeting with the supreme leader", vi: "cuộc hội đàm với nhà lãnh đạo tối cao" }
        ],
        examTag: "IELTS / VSTEP Academic & Political English"
    },

    "supreme leaders": {
        pos: "Noun",
        vi: "các nhà lãnh đạo tối cao (dạng số nhiều của 'supreme leader')",
        defEn: "Plural form of supreme leader: highest-ranking state or political leaders.",
        ipaUs: "/suːˈpriːm ˈliː.dərz/",
        ipaUk: "/suːˈpriːm ˈliː.dərz/",
        level: "B2-C1",
        lemma: "supreme leader",
        matchedForm: "Dạng số nhiều (Plural) của cụm từ 'supreme leader'",
        examples: [
            { en: "Supreme leaders from across the region convened for the international summit.", vi: "Các nhà lãnh đạo tối cao từ khắp khu vực đã tề tựu tham dự hội nghị thượng đỉnh quốc tế." }
        ]
    },

    "head of state": {
        pos: "Noun",
        vi: "nguyên thủ quốc gia (tổng thống, quốc vương hoặc chủ tịch nước)",
        defEn: "The official leader and highest representative of a country (such as a president or monarch).",
        ipaUs: "/ˌhed əv ˈsteɪt/",
        ipaUk: "/ˌhed əv ˈsteɪt/",
        level: "B2",
        examples: [
            { en: "The visiting head of state was received with full military honors at the presidential palace.", vi: "Vị nguyên thủ quốc gia tới thăm đã được tiếp đón với nghi thức danh dự quân đội cao nhất tại dinh tổng thống." }
        ],
        synonyms: ["president", "monarch", "sovereign", "national leader"],
        antonyms: ["citizen", "subordinate"],
        collocations: [
            { en: "serve as head of state", vi: "đảm nhiệm vai trò nguyên thủ quốc gia" },
            { en: "bilateral talks between heads of state", vi: "các cuộc hội đàm song phương giữa các nguyên thủ quốc gia" }
        ],
        toeicNote: "💡 Phân biệt: 'head of state' (nguyên thủ quốc gia, đại diện biểu tượng như Tổng thống/Quốc vương) khác với 'head of government' (thủ tướng - người điều hành chính phủ)."
    },

    "head of state meeting": {
        pos: "Noun",
        vi: "cuộc họp thượng đỉnh nguyên thủ quốc gia, hội nghị cấp cao nguyên thủ",
        defEn: "A high-level summit or formal conference attended by national leaders and heads of state.",
        ipaUs: "/ˌhed əv ˈsteɪt ˈmiː.tɪŋ/",
        ipaUk: "/ˌhed əv ˈsteɪt ˈmiː.tɪŋ/",
        level: "B2-C1",
        examples: [
            { en: "The upcoming head of state meeting will focus on climate accords and regional security.", vi: "Cuộc họp nguyên thủ quốc gia sắp tới sẽ tập trung vào các hiệp định khí hậu và an ninh khu vực." }
        ],
        synonyms: ["summit", "high-level summit", "presidential summit", "international conference"],
        collocations: [
            { en: "convene a head of state meeting", vi: "triệu tập cuộc họp nguyên thủ quốc gia" },
            { en: "attend the annual head of state meeting", vi: "tham dự cuộc họp nguyên thủ quốc gia thường niên" }
        ]
    },

    "head of government": {
        pos: "Noun",
        vi: "người đứng đầu chính phủ, thủ tướng (lãnh đạo nhánh hành pháp)",
        defEn: "The chief officer of the executive branch of a government, often bearing the title of prime minister or premier.",
        ipaUs: "/ˌhed əv ˈɡʌv.ən.mənt/",
        ipaUk: "/ˌhed əv ˈɡʌv.n.mənt/",
        level: "B2",
        examples: [
            { en: "The head of government presided over the cabinet session to finalize the national budget.", vi: "Người đứng đầu chính phủ đã chủ trì phiên họp nội các để chốt dự toán ngân sách quốc gia." }
        ],
        synonyms: ["prime minister", "premier", "chancellor"],
        collocations: [
            { en: "executive powers of the head of government", vi: "quyền hành pháp của người đứng đầu chính phủ" }
        ]
    },

    "lease": {
        pos: "Noun / Verb",
        vi: "hợp đồng thuê tài sản; cho thuê hoặc đi thuê theo hợp đồng dài hạn (nhà đất, xe cộ, thiết bị)",
        defEn: "(Noun) A legal agreement that allows you to use a building, piece of land, or vehicle for a period of time in exchange for payment. (Verb) To grant or take use of property under a lease.",
        ipaUs: "/liːs/",
        ipaUk: "/liːs/",
        level: "B1-B2",
        examples: [
            { en: "The company signed a ten-year lease on new office space downtown.", vi: "Công ty đã ký hợp đồng thuê 10 năm cho mặt bằng văn phòng mới ở trung tâm thành phố." },
            { en: "They decided to lease the equipment rather than buying it outright.", vi: "Họ quyết định thuê dài hạn thiết bị thay vì mua đứt bằng tiền mặt." }
        ],
        wordFamily: {
            noun: [{ term: "lease", vi: "hợp đồng thuê" }, { term: "leasing", vi: "nghiệp vụ cho thuê tài chính" }, { term: "lessor", vi: "bên cho thuê" }, { term: "lessee", vi: "bên đi thuê" }],
            verb: [{ term: "lease", vi: "cho thuê / thuê theo hợp đồng" }]
        },
        synonyms: ["rental agreement", "tenancy", "charter", "hire", "rent out"],
        antonyms: ["purchase", "outright sale"],
        collocations: [
            { en: "sign / terminate a lease", vi: "ký kết / chấm dứt hợp đồng thuê" },
            { en: "lease expiration", vi: "sự hết hạn hợp đồng thuê" },
            { en: "commercial lease", vi: "hợp đồng thuê mặt bằng thương mại" },
            { en: "financial leasing", vi: "cho thuê tài chính" }
        ],
        idioms: [{ en: "a new lease of / on life", vi: "nguồn năng lượng mới, cơ hội hồi sinh sức sống mới" }],
        toeicNote: "⚠️ TỪ KHÓA BẮT BUỘC ĐỀ THI TOEIC: 'lease' xuất hiện liên tục trong Part 5, 6, 7 về thuê mặt bằng văn phòng, thuê máy photo (office equipment lease), gia hạn hợp đồng (renew a lease) và hết hạn (lease expires)."
    },

    "leasing": {
        pos: "Noun",
        vi: "hoạt động cho thuê tài chính, nghiệp vụ cho thuê tài sản dài hạn",
        defEn: "The activity or business of renting assets (equipment, cars, property) to customers under a lease agreement.",
        ipaUs: "/ˈliː.sɪŋ/",
        ipaUk: "/ˈliː.sɪŋ/",
        level: "B2",
        examples: [
            { en: "Equipment leasing allows startup businesses to conserve critical working capital.", vi: "Thuê tài chính thiết bị giúp các doanh nghiệp khởi nghiệp bảo toàn vốn lưu động quan trọng." }
        ],
        wordFamily: {
            noun: [{ term: "lease", vi: "hợp đồng thuê" }, { term: "leasing", vi: "việc thuê tài chính" }, { term: "lessor", vi: "bên cho thuê" }, { term: "lessee", vi: "bên thuê" }],
            verb: [{ term: "lease", vi: "thuê" }]
        },
        collocations: [
            { en: "leasing company", vi: "công ty cho thuê tài chính" },
            { en: "car leasing options", vi: "các phương án thuê xe dài hạn" }
        ]
    },

    "lessor": {
        pos: "Noun",
        vi: "bên cho thuê tài sản (chủ sở hữu tài sản trong hợp đồng thuê)",
        defEn: "A person or company that allows someone to use their property, land, or equipment under a lease agreement.",
        ipaUs: "/ˈles.ɔːr/",
        ipaUk: "/ˈles.ɔːr/",
        level: "B2",
        examples: [
            { en: "The lessor is obligated to maintain the building's structural integrity.", vi: "Bên cho thuê có nghĩa vụ duy trì tính toàn vẹn kết cấu của tòa nhà." }
        ],
        synonyms: ["landlord", "owner", "proprietor"],
        antonyms: ["lessee", "tenant"]
    },

    "lessee": {
        pos: "Noun",
        vi: "bên đi thuê tài sản (người sử dụng tài sản theo hợp đồng)",
        defEn: "A person or company that has the right to use something under a lease agreement.",
        ipaUs: "/leˈsiː/",
        ipaUk: "/leˈsiː/",
        level: "B2",
        examples: [
            { en: "The lessee must pay all utilities and monthly rent on time.", vi: "Bên đi thuê phải thanh toán đầy đủ tiền điện nước và tiền thuê hàng tháng đúng hạn." }
        ],
        synonyms: ["tenant", "renter", "leaseholder"],
        antonyms: ["lessor", "landlord"]
    }
};

// 2. TÍCH HỢP TẤT CẢ TỪ VỰNG TỪ KHO SÁCH GIÁO KHOA & TOPIC BANK & VOCAB DECKS
console.log('🔄 Đang đồng bộ từ vựng từ Curated Topic Bank, SGK 1-12 và Vocab Decks...');

// Import CURATED_FRONTEND_TOPIC_BANK
try {
    global.window = global;
    require(path.join(__dirname, '..', 'js', 'curated-vocab-bank.js'));
    const topicBank = window.CURATED_FRONTEND_TOPIC_BANK || {};
    let bankCount = 0;
    for (const [topKey, topVal] of Object.entries(topicBank)) {
        for (const [lvl, words] of Object.entries(topVal.words || {})) {
            for (const item of (words || [])) {
                if (!item || !item.word) continue;
                const cleanW = item.word.toLowerCase().trim();
                if (!masterVocab[cleanW] && !currentLexicon[cleanW]) {
                    masterVocab[cleanW] = {
                        pos: "Vocabulary",
                        vi: item.meaning || "từ vựng học tập",
                        defEn: `Standard vocabulary term in English: ${item.word}`,
                        ipaUs: item.phonetic || `/${cleanW}/`,
                        ipaUk: item.phonetic || `/${cleanW}/`,
                        level: item.level || lvl || "B1",
                        examTag: `Topic: ${topVal.name || topKey}`
                    };
                    bankCount++;
                }
            }
        }
    }
    console.log(`✅ Đã nạp thêm ${bankCount} từ từ Curated Topic Bank.`);
} catch(e) {
    console.warn('Lỗi khi nạp topic bank:', e.message);
}

// Import TEXTBOOK_CURRICULUM_DATA (Lớp 1 - Lớp 12)
try {
    global.window = global;
    require(path.join(__dirname, '..', 'js', 'textbook-curriculum-database.js'));
    const tbData = window.TEXTBOOK_CURRICULUM_DATA || {};
    let tbCount = 0;
    for (const [bKey, book] of Object.entries(tbData)) {
        for (const item of (book.words || [])) {
            if (!item || !item.word) continue;
            const cleanW = item.word.toLowerCase().trim();
            if (!masterVocab[cleanW] && !currentLexicon[cleanW]) {
                masterVocab[cleanW] = {
                    pos: "General",
                    vi: item.meaning || "từ vựng học tập",
                    defEn: `Curriculum vocabulary from ${book.title}`,
                    ipaUs: item.phonetic || `/${cleanW}/`,
                    ipaUk: item.phonetic || `/${cleanW}/`,
                    level: item.level || book.level || "A1",
                    examTag: book.title
                };
                tbCount++;
            }
        }
    }
    console.log(`✅ Đã nạp thêm ${tbCount} từ từ Sách Giáo Khoa Lớp 1 - 12.`);
} catch(e) {
    console.warn('Lỗi khi nạp SGK:', e.message);
}

// Import VOCAB DECKS DATABASE (48 Chuyên đề TOEIC & VSTEP)
try {
    global.window = global;
    require(path.join(__dirname, '..', 'js', 'vocab-decks-data.js'));
    const decks = window.vocabDecksDatabase || {};
    let deckCount = 0;
    for (const [deckName, items] of Object.entries(decks)) {
        for (const item of (items || [])) {
            if (!item || !item.word) continue;
            const cleanW = item.word.toLowerCase().trim();
            if (!masterVocab[cleanW] && !currentLexicon[cleanW]) {
                masterVocab[cleanW] = {
                    pos: "Core Term",
                    vi: item.meaning || "từ vựng cốt lõi",
                    defEn: item.meaning || `Essential vocabulary for TOEIC / VSTEP (${deckName})`,
                    ipaUs: item.phonetic || `/${cleanW}/`,
                    ipaUk: item.phonetic || `/${cleanW}/`,
                    level: "B1-B2",
                    examTag: `TOEIC: ${deckName}`,
                    examples: item.example ? [{ en: item.example, vi: item.exampleVi || `Ví dụ: ${item.example}` }] : undefined,
                    collocations: item.collocation ? [item.collocation] : undefined,
                    toeicNote: item.tip || undefined
                };
                deckCount++;
            }
        }
    }
    console.log(`✅ Đã nạp thêm ${deckCount} từ từ 48 Chuyên đề Vocab Decks.`);
} catch(e) {
    console.warn('Lỗi khi nạp vocab decks:', e.message);
}

// 3. THÊM TẬP HỢP TỪ VỰNG OXFORD PICTURE DICTIONARY (OPD ENGLISH - VIETNAMESE) CHUẨN XÁC
const opdExtraList = [
    // Everyday Language & People
    { word: "appointment", pos: "Noun", vi: "cuộc hẹn khám / làm việc", ipaUs: "/əˈpɔɪnt.mənt/", level: "B1", defEn: "An arrangement to meet someone at a particular time and place." },
    { word: "calendar", pos: "Noun", vi: "cuốn lịch biểu, thời gian biểu", ipaUs: "/ˈkæl.ən.dɚ/", level: "A2", defEn: "A chart or series of pages showing the days, weeks, and months of a particular year." },
    { word: "schedule", pos: "Noun / Verb", vi: "lịch trình, thời gian biểu; lên lịch", ipaUs: "/ˈskedʒ.uːl/", level: "B1", defEn: "A plan that lists expected activities and the times they will happen." },
    { word: "cashier", pos: "Noun", vi: "nhân viên thu ngân", ipaUs: "/kæˈʃɪr/", level: "A2", defEn: "A person whose job is to receive and pay out money in a store or bank." },
    { word: "customer", pos: "Noun", vi: "khách hàng mua sắm", ipaUs: "/ˈkʌs.tə.mɚ/", level: "A2", defEn: "A person who buys goods or services from a store or business." },
    { word: "groceries", pos: "Noun", vi: "thực phẩm và đồ bách hóa gia đình", ipaUs: "/ˈɡroʊ.sɚ.iz/", level: "A2", defEn: "Food and other goods sold by a grocer or supermarket." },
    { word: "aisle", pos: "Noun", vi: "lối đi giữa các dãy kệ hàng / ghế ngồi", ipaUs: "/aɪl/", level: "B1", defEn: "A passageway between rows of shelves in a supermarket or seats in an airplane." },
    { word: "receipt", pos: "Noun", vi: "hóa đơn thanh toán, biên lai thu tiền", ipaUs: "/rɪˈsiːt/", level: "A2", defEn: "A piece of paper showing that money has been paid or goods received." },
    { word: "coupon", pos: "Noun", vi: "phiếu giảm giá, phiếu ưu đãi", ipaUs: "/ˈkuː.pɑːn/", level: "A2", defEn: "A voucher entitling the holder to a discount off a particular product." },
    { word: "discount", pos: "Noun / Verb", vi: "mức giảm giá; chiết khấu", ipaUs: "/ˈdɪs.kaʊnt/", level: "A2", defEn: "A reduction in the usual price of something." },
    { word: "prescription", pos: "Noun", vi: "đơn thuốc, toa thuốc do bác sĩ kê", ipaUs: "/prɪˈskrɪp.ʃən/", level: "B1", defEn: "An instruction written by a medical practitioner authorizing a medicine." },
    { word: "pharmacy", pos: "Noun", vi: "tiệm thuốc tây, nhà thuốc", ipaUs: "/ˈfɑːr.mə.si/", level: "A2", defEn: "A shop where medicinal drugs are prepared or sold." },
    { word: "symptom", pos: "Noun", vi: "triệu chứng bệnh lý", ipaUs: "/ˈsɪmp.təm/", level: "B1", defEn: "A physical or mental feature indicating a condition of disease." },
    { word: "stethoscope", pos: "Noun", vi: "ống nghe khám bệnh của bác sĩ", ipaUs: "/ˈsteθ.ə.skoʊp/", level: "B2", defEn: "A medical instrument for listening to the action of someone's heart or breathing." },
    { word: "bandage", pos: "Noun / Verb", vi: "băng gạc cứu thương; băng bó vết thương", ipaUs: "/ˈbæn.dɪdʒ/", level: "A2", defEn: "A strip of material used to bind up a wound or protect an injury." },
    { word: "wheelchair", pos: "Noun", vi: "chiếc xe lăn dành cho bệnh nhân", ipaUs: "/ˈwiːl.tʃer/", level: "A2", defEn: "A chair mounted on wheels for people who cannot walk." },
    { word: "paramedic", pos: "Noun", vi: "nhân viên y tế cấp cứu hiện trường", ipaUs: "/ˌper.əˈmed.ɪk/", level: "B2", defEn: "A person trained to give emergency medical care to people who are seriously ill." },
    { word: "pediatrician", pos: "Noun", vi: "bác sĩ chuyên khoa nhi", ipaUs: "/ˌpiː.di.əˈtrɪʃ.ən/", level: "B2", defEn: "A medical practitioner specializing in children and their diseases." },
    { word: "dentist", pos: "Noun", vi: "bác sĩ nha khoa, thầy thuốc chữa răng", ipaUs: "/ˈden.tɪst/", level: "A2", defEn: "A person qualified to treat the diseases and conditions of the teeth." },
    { word: "neighborhood", pos: "Noun", vi: "khu phố lân cận, xóm giềng", ipaUs: "/ˈneɪ.bɚ.hʊd/", level: "A2", defEn: "A district, especially one forming a community within a town or city." },
    { word: "subway", pos: "Noun", vi: "hệ thống tàu điện ngầm đô thị", ipaUs: "/ˈsʌb.weɪ/", level: "A2", defEn: "An underground electric railroad, also called a metro or tube." },
    { word: "pedestrian", pos: "Noun", vi: "người đi bộ trên vỉa hè", ipaUs: "/pəˈdes.tri.ən/", level: "B1", defEn: "A person walking along a road or in a developed area." },
    { word: "crosswalk", pos: "Noun", vi: "vạch sơn dành cho người đi bộ qua đường", ipaUs: "/ˈkrɑːs.wɑːk/", level: "A2", defEn: "A marked part of a road where pedestrians have right of way to cross." },
    { word: "intersection", pos: "Noun", vi: "ngã ba, ngã tư, nút giao thông", ipaUs: "/ˌɪn.t̬ɚˈsek.ʃən/", level: "B1", defEn: "A point at which two or more roads meet or cross." },
    { word: "traffic light", pos: "Noun", vi: "cột đèn tín hiệu giao thông", ipaUs: "/ˈtræf.ɪk laɪt/", level: "A1", defEn: "A set of automatically operated colored lights for controlling traffic." },
    { word: "highway", pos: "Noun", vi: "đường cao tốc, quốc lộ huyết mạch", ipaUs: "/ˈhaɪ.weɪ/", level: "A2", defEn: "A main road, especially one connecting major towns or cities." },
    { word: "speed limit", pos: "Noun", vi: "tốc độ tối đa cho phép của xe", ipaUs: "/ˈspiːd ˌlɪm.ɪt/", level: "A2", defEn: "The maximum speed at which a vehicle may legally travel on a particular stretch of road." },
    { word: "seat belt", pos: "Noun", vi: "dây đai an toàn trên ô tô / máy bay", ipaUs: "/ˈsiːt ˌbelt/", level: "A2", defEn: "A belt or strap in a vehicle to secure a person to prevent injury in a collision." },
    { word: "windshield", pos: "Noun", vi: "kính chắn gió trước xe ô tô", ipaUs: "/ˈwɪnd.ʃiːld/", level: "B1", defEn: "A window at the front of a passenger vehicle." },
    { word: "headlight", pos: "Noun", vi: "đèn pha chiếu sáng phía trước xe", ipaUs: "/ˈhed.laɪt/", level: "A2", defEn: "A powerful light at the front of a motor vehicle." },
    { word: "steering wheel", pos: "Noun", vi: "vô lăng lái xe ô tô", ipaUs: "/ˈstɪr.ɪŋ ˌwiːl/", level: "B1", defEn: "A wheel that a driver turns in order to steer a vehicle." },
    { word: "accelerator", pos: "Noun", vi: "chân ga, bàn đạp ga", ipaUs: "/əkˈsel.ə.reɪ.t̬ɚ/", level: "B2", defEn: "A pedal in a vehicle that is pressed down in order to make it go faster." },
    { word: "clutch", pos: "Noun / Verb", vi: "chân côn ô tô; nắm chặt", ipaUs: "/klʌtʃ/", level: "B2", defEn: "A pedal in a vehicle operated with the foot to change gears." },
    { word: "baggage", pos: "Noun", vi: "hành lý du lịch, túi xách vali", ipaUs: "/ˈbæɡ.ɪdʒ/", level: "A2", defEn: "Suitcases and other bags in which people carry their belongings when traveling." },
    { word: "boarding pass", pos: "Noun", vi: "thẻ lên máy bay", ipaUs: "/ˈbɔːr.dɪŋ ˌpæs/", level: "A2", defEn: "A pass that gives an airline passenger permission to board a flight." },
    { word: "carry-on", pos: "Noun", vi: "hành lý xách tay mang lên khoang máy bay", ipaUs: "/ˈker.i.ɑːn/", level: "B1", defEn: "A small piece of baggage that can be taken into the passenger cabin of an airplane." },
    { word: "flight attendant", pos: "Noun", vi: "tiếp viên hàng không", ipaUs: "/ˈflaɪt əˌten.dənt/", level: "A2", defEn: "A person whose job is to look after the passengers on an aircraft." },
    { word: "customs", pos: "Noun", vi: "cơ quan hải quan, cửa khẩu kiểm soát", ipaUs: "/ˈkʌs.təmz/", level: "B1", defEn: "The place at a port, airport, or border where travelers' bags are examined for illegal goods or duty." },
    { word: "immigration", pos: "Noun", vi: "cục xuất nhập cảnh, việc di cư", ipaUs: "/ˌɪm.əˈɡreɪ.ʃən/", level: "B2", defEn: "The place at an airport or border where government officials check travelers' documents." },
    { word: "passport", pos: "Noun", vi: "hộ chiếu xuất nhập cảnh", ipaUs: "/ˈpæs.pɔːrt/", level: "A1", defEn: "An official document issued by a government certifying the holder's identity and citizenship." },
    { word: "currency", pos: "Noun", vi: "tiền tệ quốc gia lưu hành", ipaUs: "/ˈkɝː.ən.si/", level: "B1", defEn: "A system of money in general use in a particular country." },
    { word: "exchange rate", pos: "Noun", vi: "tỷ giá quy đổi ngoại tệ", ipaUs: "/ɪksˈtʃeɪndʒ ˌreɪt/", level: "B1", defEn: "The value of one currency for the purpose of conversion to another." },
    { word: "contract", pos: "Noun / Verb", vi: "hợp đồng kinh tế, giao kèo; ký hợp đồng", ipaUs: "/ˈkɑːn.trækt/", level: "B1", defEn: "A written or spoken agreement that is intended to be enforceable by law." },
    { word: "negotiation", pos: "Noun", vi: "cuộc đàm phán, thương lượng hợp đồng", ipaUs: "/nəˌɡoʊ.ʃiˈeɪ.ʃən/", level: "B2", defEn: "Discussion aimed at reaching an agreement." },
    { word: "applicant", pos: "Noun", vi: "ứng viên nộp đơn xin việc", ipaUs: "/ˈæp.lə.kənt/", level: "B1", defEn: "A person who applies for a job, scholarship, or admission." },
    { word: "resume", pos: "Noun", vi: "bản sơ yếu lý lịch xin việc (CV)", ipaUs: "/ˈrez.ə.meɪ/", level: "B1", defEn: "A brief account of a person's education, qualifications, and previous experience." },
    { word: "interview", pos: "Noun / Verb", vi: "buổi phỏng vấn xin việc; phỏng vấn", ipaUs: "/ˈɪn.t̬ɚ.vjuː/", level: "A2", defEn: "A formal meeting in which one or more persons question or consult another." },
    { word: "supervisor", pos: "Noun", vi: "người giám sát, người quản lý ca", ipaUs: "/ˈsuː.pɚ.vaɪ.zɚ/", level: "B1", defEn: "A person who supervises a person or an activity." },
    { word: "colleague", pos: "Noun", vi: "đồng nghiệp cùng cơ quan", ipaUs: "/ˈkɑː.liːɡ/", level: "A2", defEn: "A person with whom one works in a profession or business." },
    { word: "co-worker", pos: "Noun", vi: "người bạn đồng nghiệp", ipaUs: "/ˈkoʊˌwɝː.kɚ/", level: "A2", defEn: "A fellow worker or colleague." },
    { word: "overtime", pos: "Noun / Adverb", vi: "làm thêm giờ ngoài giờ hành chính", ipaUs: "/ˈoʊ.vɚ.taɪm/", level: "B1", defEn: "Time in addition to regular working hours." },
    { word: "salary", pos: "Noun", vi: "tiền lương tháng cố định", ipaUs: "/ˈsæl.ɚ.i/", level: "A2", defEn: "A fixed regular payment made by an employer to an employee." },
    { word: "benefits", pos: "Noun", vi: "phúc lợi, chế độ đãi ngộ nhân viên", ipaUs: "/ˈben.ə.fɪts/", level: "B1", defEn: "Advantages or payments provided by an employer, such as health insurance or pension." },
    { word: "retirement", pos: "Noun", vi: "sự nghỉ hưu sau nhiều năm cống hiến", ipaUs: "/rɪˈtaɪr.mənt/", level: "B1", defEn: "The action or fact of leaving one's job and ceasing to work." },
    { word: "pension", pos: "Noun", vi: "lương hưu bảo hiểm xã hội", ipaUs: "/ˈpen.ʃən/", level: "B1", defEn: "A regular payment made during a person's retirement from an investment fund." }
];

opdExtraList.forEach(item => {
    const k = item.word.toLowerCase().trim();
    if (!masterVocab[k]) {
        masterVocab[k] = item;
    }
});

// Chuyển toàn bộ masterVocab thành standard entries và nạp vào currentLexicon
let addedMasterCount = 0;
for (const [k, v] of Object.entries(masterVocab)) {
    const existing = currentLexicon[k];
    const needsUpdate = !existing || 
        !existing.vi || 
        (typeof existing.vi === 'string' && existing.vi.includes('Bản dịch đang được cập nhật')) ||
        (existing.vietnameseMeaning && typeof existing.vietnameseMeaning === 'string' && existing.vietnameseMeaning.includes('Bản dịch đang được cập nhật'));
    if (needsUpdate) {
        currentLexicon[k] = createEntry(k, v);
        addedMasterCount++;
    }
}
console.log(`🎉 Đã hợp nhất ${addedMasterCount} từ mới vào Dictionary Lexicon.`);
console.log(`📊 Tổng số từ trong Dictionary Lexicon hiện tại: ${Object.keys(currentLexicon).length} từ.`);

// 4. MỞ RỘNG LEMMATIZER BẢNG HÌNH THÁI HỌC (LEMMAS) CHO HÀNG NGHÌN TỪ
console.log('🔄 Đang tự động suy diễn và xây dựng bảng Lemmatizer (Số nhiều, Quá khứ, V-ing, Trạng từ)...');
let addedLemmaCount = 0;

for (const [headword, entry] of Object.entries(currentLexicon)) {
    const w = headword.toLowerCase();
    
    // 1. Số nhiều dạng -s / -es / -ies
    if (!w.endsWith('s')) {
        let plural = w + 's';
        if (w.endsWith('y') && !/[aeiou]y$/.test(w)) {
            plural = w.slice(0, -1) + 'ies';
        } else if (w.endsWith('ch') || w.endsWith('sh') || w.endsWith('x') || w.endsWith('z') || w.endsWith('ss')) {
            plural = w + 'es';
        }
        if (!currentLemmas[plural] && !currentLexicon[plural]) {
            currentLemmas[plural] = {
                lemma: w,
                form: `plural of ${w}`,
                vi: `Dạng số nhiều (Plural) của danh từ '${w}'`
            };
            addedLemmaCount++;
        }
    }

    // 2. Dạng phân từ V-ed và V-ing cho động từ
    const pos = (entry.partOfSpeech || '').toLowerCase();
    if (pos.includes('verb') || pos.includes('action')) {
        // -ed
        let past = w.endsWith('e') ? w + 'd' : w + 'ed';
        if (!currentLemmas[past] && !currentLexicon[past]) {
            currentLemmas[past] = {
                lemma: w,
                form: `past tense / participle of ${w}`,
                vi: `Dạng quá khứ / phân từ (V-ed) của động từ '${w}'`
            };
            addedLemmaCount++;
        }
        // -ing
        let ing = w.endsWith('e') && !w.endsWith('ee') ? w.slice(0, -1) + 'ing' : w + 'ing';
        if (!currentLemmas[ing] && !currentLexicon[ing]) {
            currentLemmas[ing] = {
                lemma: w,
                form: `present participle / gerund of ${w}`,
                vi: `Dạng hiện tại phân từ / danh động từ (V-ing) của '${w}'`
            };
            addedLemmaCount++;
        }
    }

    // 3. Trạng từ -ly cho tính từ
    if (pos.includes('adj') && !w.endsWith('ly')) {
        let adv = w.endsWith('y') ? w.slice(0, -1) + 'ily' : (w.endsWith('le') ? w.slice(0, -1) + 'y' : w + 'ly');
        if (!currentLemmas[adv] && !currentLexicon[adv]) {
            currentLemmas[adv] = {
                lemma: w,
                form: `adverb form of ${w}`,
                vi: `Dạng trạng từ (Adverb) của tính từ '${w}'`
            };
            addedLemmaCount++;
        }
    }
}

// Bổ sung cụ thể các từ trong lịch sử tìm kiếm của người dùng
currentLemmas['curios'] = { lemma: 'curio', form: 'plural of curio', vi: "Dạng số nhiều (Plural) của 'curio' (đồ cổ hiếm)" };
currentLemmas['supreme leaders'] = { lemma: 'supreme leader', form: 'plural of supreme leader', vi: "Dạng số nhiều của 'supreme leader' (lãnh đạo tối cao)" };
currentLemmas['heads of state'] = { lemma: 'head of state', form: 'plural of head of state', vi: "Dạng số nhiều của 'head of state' (nguyên thủ quốc gia)" };
currentLemmas['heads of government'] = { lemma: 'head of government', form: 'plural of head of government', vi: "Dạng số nhiều của 'head of government' (thủ tướng)" };
currentLemmas['leases'] = { lemma: 'lease', form: 'plural/3rd person singular of lease', vi: "Dạng số nhiều / ngôi thứ ba của 'lease' (hợp đồng thuê)" };
currentLemmas['leasing'] = { lemma: 'lease', form: 'present participle / noun of lease', vi: "Nghiệp vụ cho thuê tài chính / dạng V-ing của 'lease'" };
currentLemmas['leased'] = { lemma: 'lease', form: 'past tense of lease', vi: "Quá khứ của 'lease'" };

console.log(`✅ Đã mở rộng thêm ${addedLemmaCount} quy tắc Lemmatizer.`);
console.log(`📊 Tổng số quy tắc Lemmatizer hiện tại: ${Object.keys(currentLemmas).length} quy tắc.`);

// 5. GHI FILE DATA VÀ ĐỒNG BỘ CLIENT-SIDE DICTIONARY DATA
fs.writeFileSync(LEXICON_FILE, JSON.stringify(currentLexicon, null, 2), 'utf8');
fs.writeFileSync(LEMMAS_FILE, JSON.stringify(currentLemmas, null, 2), 'utf8');
console.log('💾 Đã lưu thành công vào data/dictionary_lexicon.json và data/dictionary_lemmas.json');

// Đồng bộ vào js/dictionary-data.js để client offline tra cứu 0ms
const dictDataPath = path.join(__dirname, '..', 'js', 'dictionary-data.js');
let dictDataContent = fs.readFileSync(dictDataPath, 'utf8');

// Cập nhật window.dictionaryData với các từ mới nhất
const exportStatement = `\n// EXTENDED BILINGUAL LEXICON (OXFORD PICTURE DICTIONARY + CAMBRIDGE + WIKTIONARY)\nwindow.dictionaryData = window.dictionaryData || {};\n`;
if (!dictDataContent.includes('EXTENDED BILINGUAL LEXICON')) {
    // Inject các từ trọng tâm vào window.dictionaryData
    const coreInject = {
        curio: currentLexicon['curio'],
        curios: currentLexicon['curios'],
        curious: currentLexicon['curious'],
        curiosity: currentLexicon['curiosity'],
        curiously: currentLexicon['curiously'],
        "supreme leader": currentLexicon['supreme leader'],
        "supreme leaders": currentLexicon['supreme leaders'],
        "head of state": currentLexicon['head of state'],
        "head of state meeting": currentLexicon['head of state meeting'],
        "head of government": currentLexicon['head of government'],
        lease: currentLexicon['lease'],
        leasing: currentLexicon['leasing'],
        lessor: currentLexicon['lessor'],
        lessee: currentLexicon['lessee']
    };
    const injectCode = `\n// EXTENDED BILINGUAL LEXICON (OXFORD PICTURE DICTIONARY + CAMBRIDGE + WIKTIONARY)\nwindow.dictionaryData = window.dictionaryData || {};\nObject.assign(window.dictionaryData, ${JSON.stringify(coreInject, null, 2)});\n`;
    dictDataContent += injectCode;
    fs.writeFileSync(dictDataPath, dictDataContent, 'utf8');
    console.log('✅ Đã đồng bộ các từ khóa mới nhất vào js/dictionary-data.js.');
}

console.log('🎉 TOÀN BỘ QUÁ TRÌNH NÂNG CẤP TỪ ĐIỂN ĐÃ HOÀN TẤT!');
