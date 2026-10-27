// ======================================================================================
// GUNDAM VOCABULARY ARENA WORKSTATION & CEFR SCANNER (CÙNG ĐĂNG RA TRƯỜNG)
// ======================================================================================
// - Mobile Suit Gundam Mecha Launcher (Cử động xoay nòng ngắm mượt & Bắn chùm Beam Laser)
// - Khung thẻ từ rơi cỡ trung (Medium compact & balanced HUD frame)
// - Tự động đồng bộ từ vựng vào "Sổ tay từ vựng" (savedVocabItems & localStorage)
// - Mỗi lượt học là 1 lượt từ mới, tích hợp nút Reset bộ từ
// - Tính năng Upload File từ vựng (Scan 3,000+ từ, tự động phân loại CEFR A1 - C2)
// - Tính năng Tự điền từ của mình vào (Custom Manual Input & Auto CEFR Tagger)
// - Đấu trường Game Arena mở rộng to, rộng rãi, chuẩn không gian vũ trụ Gundam
// ======================================================================================

(function(window) {
    'use strict';

    // =========================================================================
    // 1. ENGINE PHÂN LOẠI CEFR THÔNG MINH (A1 - C2 CLASSIFIER & DICTIONARY LOOKUP)
    // =========================================================================
    class CEFRClassifier {
        constructor() {
            // Ngân hàng đối chiếu CEFR cốt lõi (Core CEFR Lexicon)
            this.lexicon = {
                // A1: Sơ cấp (Căn bản đời sống)
                'water': 'A1', 'book': 'A1', 'house': 'A1', 'happy': 'A1', 'family': 'A1', 'food': 'A1',
                'school': 'A1', 'friend': 'A1', 'money': 'A1', 'time': 'A1', 'work': 'A1', 'day': 'A1',
                'help': 'A1', 'name': 'A1', 'place': 'A1', 'room': 'A1', 'city': 'A1', 'country': 'A1',
                'car': 'A1', 'phone': 'A1', 'music': 'A1', 'movie': 'A1', 'morning': 'A1', 'night': 'A1',
                'dog': 'A1', 'cat': 'A1', 'baby': 'A1', 'man': 'A1', 'woman': 'A1', 'child': 'A1',
                'eat': 'A1', 'drink': 'A1', 'sleep': 'A1', 'walk': 'A1', 'run': 'A1', 'see': 'A1',
                'come': 'A1', 'go': 'A1', 'live': 'A1', 'know': 'A1', 'think': 'A1', 'take': 'A1',
                'good': 'A1', 'bad': 'A1', 'big': 'A1', 'small': 'A1', 'hot': 'A1', 'cold': 'A1',

                // A2: Cơ bản (Giao tiếp thường nhật & Đi lại)
                'travel': 'A2', 'flight': 'A2', 'ticket': 'A2', 'weather': 'A2', 'airport': 'A2', 'hotel': 'A2',
                'dinner': 'A2', 'lunch': 'A2', 'breakfast': 'A2', 'holiday': 'A2', 'vacation': 'A2', 'station': 'A2',
                'bus': 'A2', 'train': 'A2', 'driver': 'A2', 'visitor': 'A2', 'tourist': 'A2', 'luggage': 'A2',
                'passport': 'A2', 'advice': 'A2', 'invitation': 'A2', 'appointment': 'A2', 'message': 'A2',
                'decide': 'A2', 'explain': 'A2', 'borrow': 'A2', 'lend': 'A2', 'repair': 'A2', 'clean': 'A2',
                'simple': 'A2', 'cheap': 'A2', 'expensive': 'A2', 'careful': 'A2', 'comfortable': 'A2',

                // B1: Trung cấp (Công sở & Môi trường tổng quát)
                'convenient': 'B1', 'experience': 'B1', 'develop': 'B1', 'schedule': 'B1', 'environment': 'B1',
                'improve': 'B1', 'afford': 'B1', 'budget': 'B1', 'colleague': 'B1', 'customer': 'B1',
                'delivery': 'B1', 'discount': 'B1', 'employee': 'B1', 'employer': 'B1', 'equipment': 'B1',
                'facility': 'B1', 'feedback': 'B1', 'guarantee': 'B1', 'increase': 'B1', 'interview': 'B1',
                'manager': 'B1', 'payment': 'B1', 'product': 'B1', 'promotion': 'B1', 'receipt': 'B1',
                'transport': 'B1', 'contract': 'B1', 'document': 'B1', 'inquire': 'B1', 'register': 'B1',

                // B2: Trung cao (Kinh doanh, Đàm phán & Học thuật)
                'negotiate': 'B2', 'collaborate': 'B2', 'innovative': 'B2', 'sustainable': 'B2', 'strategy': 'B2',
                'significant': 'B2', 'implement': 'B2', 'allocate': 'B2', 'clarify': 'B2', 'compensation': 'B2',
                'compliance': 'B2', 'comprehensive': 'B2', 'coordinate': 'B2', 'criteria': 'B2', 'dedicate': 'B2',
                'efficiency': 'B2', 'evaluate': 'B2', 'expertise': 'B2', 'facilitate': 'B2', 'perspective': 'B2',
                'potential': 'B2', 'productive': 'B2', 'substantial': 'B2', 'obligation': 'B2', 'reputation': 'B2',

                // C1: Cao cấp (Chuyên sâu, Luận điểm & Đa tầng nghĩa)
                'meticulous': 'C1', 'prerequisite': 'C1', 'ambiguous': 'C1', 'profound': 'C1', 'exacerbate': 'C1',
                'coherent': 'C1', 'contemplate': 'C1', 'cumbersome': 'C1', 'detrimental': 'C1', 'discrepancy': 'C1',
                'exemplify': 'C1', 'formidable': 'C1', 'inevitable': 'C1', 'intricate': 'C1', 'lucrative': 'C1',
                'paramount': 'C1', 'plausible': 'C1', 'prevalent': 'C1', 'scrutinize': 'C1', 'unprecedented': 'C1',
                'vulnerable': 'C1', 'substantiate': 'C1', 'pervasive': 'C1', 'consolidate': 'C1', 'unanimous': 'C1',

                // C2: Thành thạo (Văn phong bác học, Tinh tế & Điêu luyện)
                'serendipity': 'C2', 'quintessential': 'C2', 'ubiquitous': 'C2', 'obfuscate': 'C2', 'idiosyncrasy': 'C2',
                'anachronistic': 'C2', 'ephemeral': 'C2', 'equanimity': 'C2', 'fastidious': 'C2', 'iconoclast': 'C2',
                'juxtaposition': 'C2', 'magnanimous': 'C2', 'nonchalant': 'C2', 'ostentatious': 'C2', 'panacea': 'C2',
                'perfunctory': 'C2', 'quixotic': 'C2', 'recalcitrant': 'C2', 'sycophant': 'C2', 'zeitgeist': 'C2'
            };

            // Từ điển nghĩa tiếng Việt nhanh cho các từ phổ biến
            this.quickMeanings = {
                'negotiate': 'đàm phán, thương lượng',
                'collaborate': 'hợp tác, cộng tác',
                'innovative': 'sáng tạo, đổi mới',
                'sustainable': 'bền vững',
                'strategy': 'chiến lược',
                'implement': 'thực hiện, thi công',
                'meticulous': 'tỉ mỉ, cẩn trọng',
                'prerequisite': 'điều kiện tiên quyết',
                'serendipity': 'sự may mắn tình cờ',
                'quintessential': 'tinh hoa, điển hình nhất',
                'ubiquitous': 'phổ biến khắp nơi',
                'comprehensive': 'toàn diện, bao quát',
                'efficient': 'hiệu quả, năng suất',
                'schedule': 'lịch trình, kế hoạch',
                'budget': 'ngân sách',
                'colleague': 'đồng nghiệp',
                'delivery': 'sự giao hàng'
            };
        }

        classify(word) {
            if (!word) return 'B1';
            const clean = word.toLowerCase().trim();

            if (this.lexicon[clean]) {
                return this.lexicon[clean];
            }

            // Kiểm tra trong dictionaryData toàn cục của web
            if (window.dictionaryData && window.dictionaryData[clean]) {
                const entry = window.dictionaryData[clean];
                const tag = (entry.examTag || '').toUpperCase();
                if (tag.includes('C2')) return 'C2';
                if (tag.includes('C1') || tag.includes('800') || tag.includes('900')) return 'C1';
                if (tag.includes('B2') || tag.includes('600') || tag.includes('700')) return 'B2';
                if (tag.includes('B1') || tag.includes('400') || tag.includes('500')) return 'B1';
                if (tag.includes('A2')) return 'A2';
            }

            // Thuật toán Heuristic hình thái học & âm tiết
            const len = clean.length;
            const syllables = (clean.match(/[aeiouy]{1,2}/g) || []).length;

            if (len >= 13 || syllables >= 5 || /(?:ification|ousness|lessness|istically|ocentric|morphology)$/.test(clean)) {
                return 'C2';
            }
            if (len >= 10 || syllables >= 4 || /(?:ology|aceous|icular|escent|ization|bility|cracy|pathy)$/.test(clean)) {
                return 'C1';
            }
            if (len >= 8 || syllables >= 3 || /(?:tion|ment|ence|ance|able|ible|ical|ively|iate|uate)$/.test(clean)) {
                return 'B2';
            }
            if (len >= 6 || syllables >= 2 || /(?:ing|ful|less|ness|ship|ward|ize|ise)$/.test(clean)) {
                return 'B1';
            }
            if (len >= 5 || syllables >= 2) {
                return 'A2';
            }
            return 'A1';
        }

        lookupMeaning(word) {
            if (!word) return '';
            const clean = word.toLowerCase().trim();
            if (this.quickMeanings[clean]) return this.quickMeanings[clean];
            if (window.dictionaryData && window.dictionaryData[clean]) {
                const item = window.dictionaryData[clean];
                return item.vi || (item.senses && item.senses[0] && item.senses[0].meaningVi) || '';
            }
            if (window.CURATED_FRONTEND_TOPIC_BANK) {
                for (const topic of Object.keys(window.CURATED_FRONTEND_TOPIC_BANK)) {
                    const topicData = window.CURATED_FRONTEND_TOPIC_BANK[topic];
                    if (topicData && topicData.words) {
                        for (const lvl of Object.keys(topicData.words)) {
                            const arr = topicData.words[lvl];
                            if (Array.isArray(arr)) {
                                const found = arr.find(x => (x.word || '').toLowerCase() === clean);
                                if (found && found.meaning) return found.meaning;
                            }
                        }
                    }
                }
            }
            if (window.vocabDecksDatabase) {
                for (const deck of Object.keys(window.vocabDecksDatabase)) {
                    const arr = window.vocabDecksDatabase[deck];
                    if (Array.isArray(arr)) {
                        const found = arr.find(x => (x.word || '').toLowerCase() === clean);
                        if (found && found.meaning) return found.meaning;
                    }
                }
            }
            return '';
        }

        lookupIPA(word) {
            if (!word) return '';
            const clean = word.toLowerCase().trim();
            if (window.dictionaryData && window.dictionaryData[clean] && window.dictionaryData[clean].ipa) {
                return window.dictionaryData[clean].ipa;
            }
            if (window.CURATED_FRONTEND_TOPIC_BANK) {
                for (const topic of Object.keys(window.CURATED_FRONTEND_TOPIC_BANK)) {
                    const topicData = window.CURATED_FRONTEND_TOPIC_BANK[topic];
                    if (topicData && topicData.words) {
                        for (const lvl of Object.keys(topicData.words)) {
                            const arr = topicData.words[lvl];
                            if (Array.isArray(arr)) {
                                const found = arr.find(x => (x.word || '').toLowerCase() === clean);
                                if (found && found.phonetic) return found.phonetic;
                            }
                        }
                    }
                }
            }
            if (window.vocabDecksDatabase) {
                for (const deck of Object.keys(window.vocabDecksDatabase)) {
                    const arr = window.vocabDecksDatabase[deck];
                    if (Array.isArray(arr)) {
                        const found = arr.find(x => (x.word || '').toLowerCase() === clean);
                        if (found && found.phonetic) return found.phonetic;
                    }
                }
            }
            if (window.IPAHelper && typeof window.IPAHelper.transcribePhrase === 'function') {
                try {
                    const ipa = window.IPAHelper.transcribePhrase(clean);
                    if (ipa) return ipa;
                } catch(e) {}
            }
            return '/' + word + '/';
        }
    }

    const cefrEngine = new CEFRClassifier();
    window.CEFRClassifier = cefrEngine;

    // =========================================================================
    // 2. GUNDAM WORKSTATION CONTROLLER
    // =========================================================================
    
    // =========================================================================
    // NGÂN HÀNG 8 CHỦ ĐỀ CHUẨN CEFR A1 - C2 TÍCH HỢP SẴN OFFLINE
    // =========================================================================
    function removeVietnameseDiacritics(str) {
        if (!str) return '';
        return str.normalize('NFD')
                  .replace(/[\u0300-\u036f]/g, '')
                  .replace(/đ/g, 'd')
                  .replace(/Đ/g, 'D')
                  .toLowerCase()
                  .trim();
    }

    const CURATED_FRONTEND_TOPIC_BANK = (typeof window !== 'undefined' && window.CURATED_FRONTEND_TOPIC_BANK) 
        ? window.CURATED_FRONTEND_TOPIC_BANK 
        : {};

    const SAMPLE_VOCAB_PRESETS = {
  oxford3000: [
    // A1
    { word: "family", phonetic: "/ˈfæm.əl.i/", meaning: "gia đình thân thương", level: "A1" },
    { word: "friend", phonetic: "/frend/", meaning: "bạn bè thân thiết", level: "A1" },
    { word: "house", phonetic: "/haʊs/", meaning: "ngôi nhà ấm cúng", level: "A1" },
    { word: "water", phonetic: "/ˈwɑː.t̬ɚ/", meaning: "nước uống tinh khiết", level: "A1" },
    { word: "happy", phonetic: "/ˈhæp.i/", meaning: "vui vẻ, hạnh phúc", level: "A1" },
    { word: "school", phonetic: "/skuːl/", meaning: "trường học", level: "A1" },
    { word: "book", phonetic: "/bʊk/", meaning: "sách vở ghi chép", level: "A1" },
    { word: "money", phonetic: "/ˈmʌn.i/", meaning: "tiền bạc", level: "A1" },
    { word: "morning", phonetic: "/ˈmɔːr.nɪŋ/", meaning: "buổi sáng bình minh", level: "A1" },
    { word: "music", phonetic: "/ˈmjuː.zɪk/", meaning: "âm nhạc êm dịu", level: "A1" },
    { word: "coffee", phonetic: "/ˈkɑː.fi/", meaning: "cà phê buổi sáng", level: "A1" },
    { word: "bread", phonetic: "/bred/", meaning: "bánh mì thơm giòn", level: "A1" },
    { word: "city", phonetic: "/ˈsɪt.i/", meaning: "thành phố nhộn nhịp", level: "A1" },
    { word: "street", phonetic: "/striːt/", meaning: "đường phố tấp nập", level: "A1" },
    { word: "world", phonetic: "/wɝːld/", meaning: "thế giới rộng lớn", level: "A1" },

    // A2
    { word: "travel", phonetic: "/ˈtræv.əl/", meaning: "đi du lịch khám phá", level: "A2" },
    { word: "flight", phonetic: "/flaɪt/", meaning: "chuyến bay hàng không", level: "A2" },
    { word: "ticket", phonetic: "/ˈtɪk.ɪt/", meaning: "vé tàu xe máy bay", level: "A2" },
    { word: "hotel", phonetic: "/hoʊˈtel/", meaning: "khách sạn nghỉ ngơi", level: "A2" },
    { word: "airport", phonetic: "/ˈer.pɔːrt/", meaning: "sân bay quốc tế", level: "A2" },
    { word: "vacation", phonetic: "/veɪˈkeɪ.ʃən/", meaning: "kỳ nghỉ lễ dài ngày", level: "A2" },
    { word: "advice", phonetic: "/ədˈvaɪs/", meaning: "lời khuyên chân tình", level: "A2" },
    { word: "invitation", phonetic: "/ˌɪn.vəˈteɪ.ʃən/", meaning: "lời mời dự tiệc", level: "A2" },
    { word: "message", phonetic: "/ˈmes.ɪdʒ/", meaning: "tin nhắn thông báo", level: "A2" },
    { word: "appointment", phonetic: "/əˈpɔɪnt.mənt/", meaning: "cuộc hẹn gặp mặt", level: "A2" },
    { word: "neighbor", phonetic: "/ˈneɪ.bɚ/", meaning: "người hàng xóm thân thiện", level: "A2" },
    { word: "holiday", phonetic: "/ˈhɑː.lə.deɪ/", meaning: "ngày nghỉ lễ quốc gia", level: "A2" },
    { word: "weather", phonetic: "/ˈweð.ɚ/", meaning: "thời tiết ngoài trời", level: "A2" },
    { word: "luggage", phonetic: "/ˈlʌɡ.ɪdʒ/", meaning: "hành lý tư trang", level: "A2" },
    { word: "passport", phonetic: "/ˈpæs.pɔːrt/", meaning: "hộ chiếu xuất nhập cảnh", level: "A2" },

    // B1
    { word: "schedule", phonetic: "/ˈskedʒ.uːl/", meaning: "lịch trình kế hoạch", level: "B1" },
    { word: "colleague", phonetic: "/ˈkɑː.liːɡ/", meaning: "đồng nghiệp cùng phòng", level: "B1" },
    { word: "delivery", phonetic: "/dɪˈlɪv.ɚ.i/", meaning: "sự giao hàng tận nơi", level: "B1" },
    { word: "discount", phonetic: "/ˈdɪs.kaʊnt/", meaning: "mức chiết khấu giảm giá", level: "B1" },
    { word: "employee", phonetic: "/ɪmˈplɔɪ.iː/", meaning: "nhân viên chính thức", level: "B1" },
    { word: "equipment", phonetic: "/ɪˈkwɪp.mənt/", meaning: "trang thiết bị máy móc", level: "B1" },
    { word: "feedback", phonetic: "/ˈfiːd.bæk/", meaning: "ý kiến đóng góp phản hồi", level: "B1" },
    { word: "interview", phonetic: "/ˈɪn.t̬ɚ.vjuː/", meaning: "buổi phỏng vấn xin việc", level: "B1" },
    { word: "manager", phonetic: "/ˈmæn.ə.dʒɚ/", meaning: "người quản lý điều hành", level: "B1" },
    { word: "promotion", phonetic: "/prəˈmoʊ.ʃən/", meaning: "sự thăng chức, quảng bá", level: "B1" },
    { word: "contract", phonetic: "/ˈkɑːn.trækt/", meaning: "bản hợp đồng giao kết", level: "B1" },
    { word: "budget", phonetic: "/ˈbʌdʒ.ɪt/", meaning: "ngân sách chi tiêu", level: "B1" },
    { word: "convenient", phonetic: "/kənˈviː.ni.ənt/", meaning: "tiện lợi, thuận tiện", level: "B1" },
    { word: "experience", phonetic: "/ɪkˈspɪr.i.əns/", meaning: "kinh nghiệm tích lũy", level: "B1" },
    { word: "facility", phonetic: "/fəˈsɪl.ə.t̬i/", meaning: "cơ sở vật chất tiện nghi", level: "B1" },

    // B2
    { word: "negotiate", phonetic: "/nəˈɡoʊ.ʃi.eɪt/", meaning: "đàm phán thương lượng", level: "B2" },
    { word: "collaborate", phonetic: "/kəˈlæb.ə.reɪt/", meaning: "hợp tác, cộng tác đa ngành", level: "B2" },
    { word: "innovative", phonetic: "/ˈɪn.ə.veɪ.t̬ɪv/", meaning: "sáng tạo, đổi mới đột phá", level: "B2" },
    { word: "sustainable", phonetic: "/səˈsteɪ.nə.bəl/", meaning: "phát triển bền vững lâu dài", level: "B2" },
    { word: "efficiency", phonetic: "/ɪˈfɪʃ.ən.si/", meaning: "tính hiệu quả, năng suất cao", level: "B2" },
    { word: "implement", phonetic: "/ˈɪm.plə.ment/", meaning: "triển khai thực thi dự án", level: "B2" },
    { word: "perspective", phonetic: "/pɚˈspek.tɪv/", meaning: "góc nhìn, quan điểm thấu đáo", level: "B2" },
    { word: "potential", phonetic: "/poʊˈten.ʃəl/", meaning: "tiềm năng phát triển lớn", level: "B2" },
    { word: "strategy", phonetic: "/ˈstræt̬.ə.dʒi/", meaning: "chiến lược hành động then chốt", level: "B2" },
    { word: "significant", phonetic: "/sɪɡˈnɪf.ə.kənt/", meaning: "có ý nghĩa quan trọng, đáng kể", level: "B2" },
    { word: "allocate", phonetic: "/ˈæl.ə.keɪt/", meaning: "phân bổ nguồn lực ngân sách", level: "B2" },
    { word: "compliance", phonetic: "/kəmˈplaɪ.əns/", meaning: "sự tuân thủ pháp lý nội quy", level: "B2" },
    { word: "comprehensive", phonetic: "/ˌkɑːm.prəˈhen.sɪv/", meaning: "toàn diện, bao quát mọi mặt", level: "B2" },
    { word: "facilitate", phonetic: "/fəˈsɪl.ə.teɪt/", meaning: "tạo điều kiện thuận lợi", level: "B2" },
    { word: "reputation", phonetic: "/ˌrep.jəˈteɪ.ʃən/", meaning: "uy tín thương hiệu danh tiếng", level: "B2" },

    // C1
    { word: "meticulous", phonetic: "/məˈtɪk.jə.ləs/", meaning: "tỉ mỉ, cẩn trọng từng chi tiết", level: "C1" },
    { word: "prerequisite", phonetic: "/ˌpriːˈrek.wə.zɪt/", meaning: "điều kiện tiên quyết bắt buộc", level: "C1" },
    { word: "ambiguous", phonetic: "/æmˈbɪɡ.ju.əs/", meaning: "mơ hồ, đa nghĩa khó đoán", level: "C1" },
    { word: "profound", phonetic: "/prəˈfaʊnd/", meaning: "sâu sắc, uyên thâm, thâm thúy", level: "C1" },
    { word: "coherent", phonetic: "/koʊˈhɪr.ənt/", meaning: "mạch lạc, chặt chẽ, logic", level: "C1" },
    { word: "inevitable", phonetic: "/ɪnˈev.ə.t̬ə.bəl/", meaning: "tất yếu, không thể tránh khỏi", level: "C1" },
    { word: "intricate", phonetic: "/ˈɪn.trə.kət/", meaning: "tinh xảo, phức tạp tinh vi", level: "C1" },
    { word: "paramount", phonetic: "/ˈper.ə.maʊnt/", meaning: "tối quan trọng, có tầm quan trọng tối thượng", level: "C1" },
    { word: "plausible", phonetic: "/ˈplɑː.zə.bəl/", meaning: "hợp lý, đáng tin cậy, khả thi", level: "C1" },
    { word: "scrutinize", phonetic: "/ˈskruː.t̬ən.aɪz/", meaning: "xem xét kỹ lưỡng, soi xét cẩn trọng", level: "C1" },
    { word: "substantiate", phonetic: "/səbˈstæn.ʃi.eɪt/", meaning: "chứng minh có căn cứ xác thực", level: "C1" },
    { word: "unprecedented", phonetic: "/ʌnˈpres.ə.den.t̬ɪd/", meaning: "chưa từng có tiền lệ trong lịch sử", level: "C1" },

    // C2
    { word: "serendipity", phonetic: "/ˌser.ənˈdɪp.ə.t̬i/", meaning: "sự tình cờ may mắn kỳ diệu", level: "C2" },
    { word: "quintessential", phonetic: "/ˌkwɪn.təˈsen.ʃəl/", meaning: "tinh hoa cốt lõi, tinh túy nhất", level: "C2" },
    { word: "ubiquitous", phonetic: "/juːˈbɪk.wə.t̬əs/", meaning: "phổ biến khắp nơi, đâu đâu cũng thấy", level: "C2" },
    { word: "ephemeral", phonetic: "/ɪˈfem.ɚ.əl/", meaning: "phù du, sớm nở tối tàn, thoảng qua", level: "C2" },
    { word: "equanimity", phonetic: "/ˌek.wəˈnɪm.ə.t̬i/", meaning: "sự bình thản, điềm tĩnh trước sóng gió", level: "C2" },
    { word: "fastidious", phonetic: "/fæsˈtɪd.i.əs/", meaning: "kỹ tính, cầu toàn, khó tính tỉ mỉ", level: "C2" },
    { word: "juxtaposition", phonetic: "/ˌdʒʌk.stə.pəˈzɪʃ.ən/", meaning: "sự đặt cạnh nhau để tương phản", level: "C2" },
    { word: "magnanimous", phonetic: "/mæɡˈnæn.ə.məs/", meaning: "rộng lượng, hào hiệp, vị tha", level: "C2" },
    { word: "panacea", phonetic: "/ˌpæn.əˈsiː.ə/", meaning: "phương thuốc vạn năng, liều thuốc tiên", level: "C2" },
    { word: "zeitgeist", phonetic: "/ˈtsaɪt.ɡaɪst/", meaning: "tinh thần thời đại, xu thế của thời kỳ", level: "C2" }
  ],

  toeic1000: [
    { word: "abide by", phonetic: "/əˈbaɪd baɪ/", meaning: "tuân theo hợp đồng thỏa thuận", level: "B1" },
    { word: "agreement", phonetic: "/əˈɡriː.mənt/", meaning: "hợp đồng ký kết, sự đồng thuận", level: "A2" },
    { word: "assurance", phonetic: "/əˈʃʊr.əns/", meaning: "sự cam đoan đảm bảo chắc chắn", level: "B1" },
    { word: "cancellation", phonetic: "/ˌsæn.səˈleɪ.ʃən/", meaning: "sự hủy bỏ đơn hàng hợp đồng", level: "B1" },
    { word: "determine", phonetic: "/dɪˈtɝː.mɪn/", meaning: "xác định, quyết định dứt khoát", level: "B1" },
    { word: "engage", phonetic: "/ɪnˈɡeɪdʒ/", meaning: "tham gia, cam kết, ký hợp đồng", level: "B2" },
    { word: "establish", phonetic: "/ɪˈstæb.lɪʃ/", meaning: "thành lập, thiết lập quan hệ", level: "B2" },
    { word: "obligate", phonetic: "/ˈɑːb.lə.ɡeɪt/", meaning: "bắt buộc theo nghĩa vụ pháp lý", level: "B2" },
    { word: "provision", phonetic: "/prəˈvɪʒ.ən/", meaning: "điều khoản quy định trong hợp đồng", level: "C1" },
    { word: "resolve", phonetic: "/rɪˈzɑːlv/", meaning: "giải quyết tranh chấp triệt để", level: "B2" },
    { word: "specific", phonetic: "/spəˈsɪf.ɪk/", meaning: "cụ thể, chi tiết, đặc thù", level: "B1" },
    { word: "attract", phonetic: "/əˈtrækt/", meaning: "thu hút khách hàng tiềm năng", level: "B1" },
    { word: "compare", phonetic: "/kəmˈper/", meaning: "so sánh giá cả và chất lượng", level: "A2" },
    { word: "competition", phonetic: "/ˌkɑːm.pəˈtɪʃ.ən/", meaning: "sự cạnh tranh trên thị trường", level: "B1" },
    { word: "consume", phonetic: "/kənˈsuːm/", meaning: "tiêu thụ hàng hóa năng lượng", level: "B1" },
    { word: "convince", phonetic: "/kənˈvɪns/", meaning: "thuyết phục đối tác ký kết", level: "B1" },
    { word: "currently", phonetic: "/ˈkɝː.ənt.li/", meaning: "hiện tại, vào thời điểm này", level: "B1" },
    { word: "fad", phonetic: "/fæd/", meaning: "mốt nhất thời, xu hướng chóng tàn", level: "C1" },
    { word: "inspiration", phonetic: "/ˌɪn.spəˈreɪ.ʃən/", meaning: "nguồn cảm hứng sáng tạo", level: "B2" },
    { word: "market", phonetic: "/ˈmɑːr.kɪt/", meaning: "thị trường tiêu thụ hàng hóa", level: "A2" },
    { word: "persuasion", phonetic: "/pɚˈsweɪ.ʒən/", meaning: "nghệ thuật thuyết phục khách hàng", level: "B2" },
    { word: "productive", phonetic: "/prəˈdʌk.tɪv/", meaning: "mang lại năng suất sinh lời cao", level: "B2" },
    { word: "satisfaction", phonetic: "/ˌsæt̬.ɪsˈfæk.ʃən/", meaning: "sự hài lòng của khách hàng", level: "B1" },
    { word: "characteristic", phonetic: "/ˌker.ək.təˈrɪs.tɪk/", meaning: "đặc tính nổi bật của sản phẩm", level: "B2" },
    { word: "consequence", phonetic: "/ˈkɑːn.sə.kwəns/", meaning: "hậu quả, hệ quả tất yếu", level: "B2" },
    { word: "consider", phonetic: "/kənˈsɪd.ɚ/", meaning: "cân nhắc kỹ lưỡng trước khi mua", level: "A2" },
    { word: "cover", phonetic: "/ˈkʌv.ɚ/", meaning: "chi trả, bảo hiểm bao quát chi phí", level: "B1" },
    { word: "expiration", phonetic: "/ˌek.spəˈreɪ.ʃən/", meaning: "hạn chót, sự hết hạn bảo hành", level: "B2" },
    { word: "frequently", phonetic: "/ˈfriː.kwənt.li/", meaning: "thường xuyên xảy ra", level: "B1" },
    { word: "imply", phonetic: "/ɪmˈplaɪ/", meaning: "ngụ ý, hàm chỉ điều gì", level: "B2" },
    { word: "promise", phonetic: "/ˈprɑː.mɪs/", meaning: "lời cam kết chất lượng dịch vụ", level: "A2" },
    { word: "protect", phonetic: "/prəˈtekt/", meaning: "bảo vệ quyền lợi người tiêu dùng", level: "B1" },
    { word: "reputation", phonetic: "/ˌrep.jəˈteɪ.ʃən/", meaning: "danh tiếng thương hiệu uy tín", level: "B2" },
    { word: "require", phonetic: "/rɪˈkwaɪr/", meaning: "yêu cầu điều kiện bắt buộc", level: "B1" },
    { word: "variety", phonetic: "/vəˈraɪ.ə.t̬i/", meaning: "sự đa dạng nhiều chủng loại", level: "B1" }
  ],

  vstepAcademic: [
    { word: "academic", phonetic: "/ˌæk.əˈdem.ɪk/", meaning: "mang tính học thuật nghiên cứu", level: "B2" },
    { word: "analyze", phonetic: "/ˈæn.əl.aɪz/", meaning: "phân tích số liệu và hiện tượng", level: "B1" },
    { word: "concept", phonetic: "/ˈkɑːn.sept/", meaning: "khái niệm, ý niệm nền tảng", level: "B2" },
    { word: "constitute", phonetic: "/ˈkɑːn.stə.tuːt/", meaning: "cấu thành, tạo nên hệ thống", level: "C1" },
    { word: "context", phonetic: "/ˈkɑːn.tekst/", meaning: "bối cảnh văn hóa xã hội", level: "B2" },
    { word: "criteria", phonetic: "/kraɪˈtɪr.i.ə/", meaning: "tiêu chí đánh giá chuẩn mực", level: "B2" },
    { word: "deduce", phonetic: "/dɪˈduːs/", meaning: "suy luận logic từ dữ kiện", level: "C1" },
    { word: "demonstrate", phonetic: "/ˈdem.ən.streɪt/", meaning: "chứng minh, minh họa rõ ràng", level: "B2" },
    { word: "derive", phonetic: "/dɪˈraɪv/", meaning: "bắt nguồn, bắt rễ từ nguồn gốc", level: "B2" },
    { word: "evident", phonetic: "/ˈev.ə.dənt/", meaning: "hiển nhiên, bằng chứng rõ rệt", level: "B2" },
    { word: "factor", phonetic: "/ˈfæk.tɚ/", meaning: "yếu tố, nhân tố tác động", level: "B1" },
    { word: "formulate", phonetic: "/ˈfɔːr.mjə.leɪt/", meaning: "xây dựng công thức, hình thành thuyết", level: "C1" },
    { word: "hypothesis", phonetic: "/haɪˈpɑː.θə.sɪs/", meaning: "giả thuyết khoa học cần chứng minh", level: "C1" },
    { word: "indicate", phonetic: "/ˈɪn.də.keɪt/", meaning: "chỉ ra, biểu thị dấu hiệu", level: "B2" },
    { word: "interpret", phonetic: "/ɪnˈtɝː.prət/", meaning: "diễn giải, cắt nghĩa thông tin", level: "B2" },
    { word: "methodology", phonetic: "/ˌmeθ.əˈdɑː.lə.dʒi/", meaning: "phương pháp luận nghiên cứu", level: "C1" },
    { word: "phenomenon", phonetic: "/fəˈnɑː.mə.nɑːn/", meaning: "hiện tượng tự nhiên xã hội", level: "B2" },
    { word: "principle", phonetic: "/ˈprɪn.sə.pəl/", meaning: "nguyên lý, nguyên tắc nền tảng", level: "B2" },
    { word: "significant", phonetic: "/sɪɡˈnɪf.ə.kənt/", meaning: "có ý nghĩa thống kê quan trọng", level: "B2" },
    { word: "theory", phonetic: "/ˈθɪr.i/", meaning: "học thuyết lý luận khoa học", level: "B1" }
  ]
};


    window.SAMPLE_VOCAB_PRESETS = SAMPLE_VOCAB_PRESETS;

    // Danh sách 140+ Stopwords tiếng Anh để lọc sạch khi bóc tách văn bản thô
    const STOPWORDS_SET = new Set([
        "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at",
        "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could",
        "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for",
        "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's",
        "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm",
        "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't",
        "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours",
        "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so",
        "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's",
        "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until",
        "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when",
        "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would",
        "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"
    ]);

    class VocabGameWorkstation {
        constructor() {
            this.containerId = 'view-hoc-tu-vung';
            this.activeView = 'config'; // 'config' | 'preview' | 'playing' | 'summary'

            // Cấu hình Intake Mode: 'ai' | 'file' | 'custom'
            this.currentIntakeMode = 'ai';

            // Dữ liệu bộ từ & Cấu hình chơi
            this.selectedTopic = 'Công nghệ';
            this.selectedLevel = 'A1';
            this.selectedCount = 10;
            this.wordList = [];
            this.currentIndex = 0;
            this.currentWord = null;

            // Bộ từ đã dùng trong phiên học để đảm bảo luôn là TỪ MỚI 100%
            this.sessionUsedWords = new Set();

            // Kết quả quét file & Tự điền từ
            this.uploadedFileWords = [];
            this.scannedStats = null;
            this.fileFilterLevel = 'ALL';
            this.scannedSelectedCount = 10;
            this.customInputText = '';

            // Trạng thái gõ phím & gameplay
            this.typedLetters = '';
            this.mistakeHint = '';
            this.isMistake = false;
            this.mistakeCount = 0;
            this.correctCount = 0;
            this.mistakeWords = [];
            this.earnedXP = 0;

            // Rơi thẻ từ
            this.fallProgress = 0; // % từ 0 đến 100
            this.fallSpeed = 0.052; // Tốc độ rơi (% per tick)
            this.isFallingPaused = false;
            this.animFrameId = null;

            // Web Audio Synth
            this.audioCtx = null;
            this.soundEnabled = true;

            // Đa dạng khung thẻ từ & vị trí rơi tự nhiên ngẫu nhiên trái/phải
            this.cardThemeIndex = 0;
            this.cardBaseX = 50;
            this.swaySeed = 0;
            this.swayAmplitude = 20;

            // Gundam Aiming Angle & Recoil State
            this.gundamAngle = 0;
            this.isGundamRecoil = false;

            // Particle Canvas & Visuals
            this.particles = [];
            this.floatingTexts = [];
            this.projectiles = [];

            // Quản lý tài liệu đã quét lưu vĩnh viễn theo tài khoản người dùng
            this.savedScannedFiles = [];
            this.activeScannedFileId = null;

            // Bộ thẻ từ được chọn trong lưới để học / lưu sổ (Ảnh 4)
            this.selectedCardWords = new Set();

            // Quản lý học Flashcard 3D
            this.flashcardWords = [];
            this.flashcardIndex = 0;
            this.flashcardIsFlipped = false;
            this.flashcardTitle = 'Ôn tập Flashcard';

            // Khởi tạo và khôi phục tài liệu của tài khoản
            this.loadSavedScannedFiles();
            this.restoreLastActiveScannedFile();

            // Bind phím toàn cục
            this.handleGlobalKeyDown = this.handleGlobalKeyDown.bind(this);
        }

        // =========================================================================
        // KHỞI TẠO ÂM THANH GUNDAM BEAM LASER (Web Audio API)
        // =========================================================================
        initAudio() {
            if (!this.audioCtx && typeof window.AudioContext !== 'undefined') {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioCtx = new AudioContext();
            }
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
        }

        // Gundam Sci-Fi Beam Rifle Laser Shot Sound
        playShootSound() {
            if (!this.soundEnabled) return;
            try {
                this.initAudio();
                if (!this.audioCtx) return;
                const now = this.audioCtx.currentTime;

                // High-tech laser sweep oscillator
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(980, now);
                osc.frequency.exponentialRampToValueAtTime(160, now + 0.12);

                gain.gain.setValueAtTime(0.22, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.12);
            } catch(e) {}
        }

        playWrongSound() {
            if (!this.soundEnabled) return;
            try {
                this.initAudio();
                if (!this.audioCtx) return;
                const now = this.audioCtx.currentTime;
                const osc = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();

                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(140, now);
                osc.frequency.linearRampToValueAtTime(80, now + 0.18);

                gain.gain.setValueAtTime(0.22, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

                osc.connect(gain);
                gain.connect(this.audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.18);
            } catch(e) {}
        }

        playSuccessChime() {
            if (!this.soundEnabled) return;
            try {
                this.initAudio();
                if (!this.audioCtx) return;
                const now = this.audioCtx.currentTime;
                const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
                notes.forEach((freq, idx) => {
                    const osc = this.audioCtx.createOscillator();
                    const gain = this.audioCtx.createGain();
                    const noteStart = now + idx * 0.06;

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, noteStart);

                    gain.gain.setValueAtTime(0.18, noteStart);
                    gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.28);

                    osc.connect(gain);
                    gain.connect(this.audioCtx.destination);
                    osc.start(noteStart);
                    osc.stop(noteStart + 0.28);
                });
            } catch(e) {}
        }

        // =========================================================================
        // PHÁT ÂM TIẾNG ANH CHUẨN (Web Speech API / Server TTS)
        // =========================================================================
        speakWord(word, lang = 'en-US') {
            if (!word) return;
            const clean = word.trim();
            const accent = (lang === 'en-GB' || lang === 'UK') ? 'UK' : 'US';
            const effLang = accent === 'UK' ? 'en-GB' : 'en-US';

            // Ưu tiên 1: AudioService nếu có nguồn phát âm chuẩn
            if (window.AudioService && typeof window.AudioService.speakWord === 'function') {
                window.AudioService.speakWord(clean, accent);
                return;
            }

            // Ưu tiên 2: Web Speech API chuẩn giọng US / UK
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(clean);
                utter.lang = effLang;
                utter.rate = 0.9;
                utter.pitch = 1.0;
                window.speechSynthesis.speak(utter);
                return;
            }

            const audio = new Audio(`/api/tts?text=${encodeURIComponent(clean)}&accent=${accent}&lang=${effLang}`);
            audio.play().catch(() => {});
        }

        // =========================================================================
        // TỰ ĐỘNG LƯU VÀO SỔ TAY TỪ VỰNG TRONG PHẦN "TỪ VỰNG"
        // =========================================================================
        saveWordToNotebook(wordItem) {
            if (!wordItem || !wordItem.word) return;
            const word = wordItem.word.trim();
            const meaning = wordItem.meaning || '';
            const phonetic = wordItem.phonetic || '';
            const level = wordItem.level || this.selectedLevel || 'B1';

            if (typeof window.addWordToSavedVocab === 'function') {
                window.addWordToSavedVocab({ word, meaning, phonetic, level });
            } else {
                if (!Array.isArray(window.savedVocabItems)) {
                    window.savedVocabItems = [];
                }
                const exists = window.savedVocabItems.some(x => (x.word || '').toLowerCase() === word.toLowerCase());
                if (!exists) {
                    window.savedVocabItems.push({
                        word: word,
                        meaning: meaning,
                        phonetic: phonetic,
                        level: level,
                        dateAdded: new Date().toLocaleDateString('vi-VN')
                    });
                }
            }

            // Đồng bộ sang VocabularyEngine bookmarkedWordsMap nếu có
            if (window.VocabularyEngine) {
                if (!window.VocabularyEngine.bookmarkedWordsMap) window.VocabularyEngine.bookmarkedWordsMap = {};
                window.VocabularyEngine.bookmarkedWordsMap[word.toLowerCase()] = true;
                if (typeof window.VocabularyEngine.saveState === 'function') {
                    window.VocabularyEngine.saveState();
                }
            }

            // Cập nhật huy hiệu trên giao diện Sổ tay từ vựng
            const count = (window.savedVocabItems && window.savedVocabItems.length) || 1;
            const badge = document.getElementById('savedWordsBadge');
            if (badge) badge.textContent = count;
            const sub = document.getElementById('savedVocabSub');
            if (sub) sub.textContent = count > 0 ? `Đã lưu ${count} từ vựng` : 'Chưa lưu từ nào';

            if (typeof window.renderSavedVocabList === 'function') {
                window.renderSavedVocabList();
            }

            // Lưu vào LocalStorage
            const uid = this.getCurrentUserId();
            localStorage.setItem(`cung_dang_${uid}_saved_vocab_v1`, JSON.stringify(window.savedVocabItems));

            // Thông báo toast nhẹ nhàng
            if (typeof window.showToast === 'function') {
                window.showToast(`🔖 Đã thêm "${word}" vào Sổ tay từ vựng!`);
            }
        }

        // =========================================================================
        // QUẢN LÝ TÀI LIỆU QUÉT THEO TÀI KHOẢN & SỔ TỪ VỰNG CÁ NHÂN
        // =========================================================================
        getCurrentUserId() {
            try {
                if (window.currentUserAccount) {
                    return window.currentUserAccount.id || window.currentUserAccount.uid || 'guest';
                }
                const saved = localStorage.getItem('cung_dang_session_user');
                if (saved) {
                    const u = JSON.parse(saved);
                    return u.id || u.uid || 'guest';
                }
            } catch(e) {}
            return 'guest';
        }

        getScannedFilesStorageKey() {
            const uid = this.getCurrentUserId();
            return `cung_dang_${uid}_saved_scanned_files_v2`;
        }

        loadSavedScannedFiles() {
            try {
                const key = this.getScannedFilesStorageKey();
                let raw = localStorage.getItem(key);
                if (!raw || raw === '[]') {
                    // Tự động tìm kiếm file đã lưu trong các session/tài khoản khác của máy
                    for (let i = 0; i < localStorage.length; i++) {
                        const k = localStorage.key(i);
                        if (k && k.startsWith('cung_dang_') && k.endsWith('_saved_scanned_files_v2')) {
                            const val = localStorage.getItem(k);
                            if (val && val !== '[]') {
                                raw = val;
                                break;
                            }
                        }
                    }
                }
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed)) {
                        this.savedScannedFiles = parsed;
                        return this.savedScannedFiles;
                    }
                }
            } catch(e) {}
            this.savedScannedFiles = [];
            return this.savedScannedFiles;
        }

        saveSavedScannedFiles() {
            try {
                const key = this.getScannedFilesStorageKey();
                localStorage.setItem(key, JSON.stringify(this.savedScannedFiles));
                const uid = this.getCurrentUserId();
                if (this.activeScannedFileId) {
                    localStorage.setItem(`cung_dang_${uid}_active_scanned_file_id_v2`, this.activeScannedFileId);
                }
            } catch(e) {}
        }

        restoreLastActiveScannedFile() {
            this.loadSavedScannedFiles();
            if (!this.savedScannedFiles || this.savedScannedFiles.length === 0) return;

            const uid = this.getCurrentUserId();
            let activeId = localStorage.getItem(`cung_dang_${uid}_active_scanned_file_id_v2`);
            if (!activeId) {
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    if (k && k.startsWith('cung_dang_') && k.endsWith('_active_scanned_file_id_v2')) {
                        activeId = localStorage.getItem(k);
                        if (activeId) break;
                    }
                }
            }
            let target = null;
            if (activeId) {
                target = this.savedScannedFiles.find(f => f.id === activeId);
            }
            if (!target) {
                target = this.savedScannedFiles[0];
            }
            if (target && target.words && target.words.length > 0) {
                // Tự động phát hiện và làm sạch file bị dính rác nhị phân cũ (nuuw, ovh, cug, vus...)
                const hasCorrupted = target.words.some(w => (w.word || '').toLowerCase() === 'nuuw' || (w.word || '').toLowerCase() === 'ovh' || (w.word || '').toLowerCase() === 'cug');
                if (hasCorrupted) {
                    target.words = target.words.filter(w => !this.isGarbageTokenStatic(w.word));
                    target.totalWords = target.words.length;
                    if (target.stats) target.stats.total = target.words.length;
                    this.saveSavedScannedFiles();
                }

                // Tự động dịch và làm giàu nếu từ bị dính nhãn 'từ vựng học tập' cũ
                const hasFakeMeanings = target.words.some(w => (w.meaning || '').toLowerCase() === 'từ vựng học tập');
                if (hasFakeMeanings) {
                    this.enrichUploadedWordsIfNeeded(target.words).then(() => {
                        this.saveSavedScannedFiles();
                        if (this.currentIntakeMode === 'file') this.renderInto();
                    }).catch(() => {});
                }
                this.activeScannedFileId = target.id;
                this.uploadedFileWords = JSON.parse(JSON.stringify(target.words));
                this.scannedStats = target.stats || { total: target.words.length, A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
                this.scannedFileName = target.fileName;
                this.scannedStopwordsCount = target.stopwordsFiltered || 0;
                this.scannedDuration = 18;
                this.scannedSelectedCount = Math.min(10, target.words.length || 10);
            }
        }

        saveCurrentScannedFile(fileName, extractedWords, stats, stopwordsFiltered = 0, meta = null) {
            if (!extractedWords || extractedWords.length === 0) return;
            this.loadSavedScannedFiles();
            const nowStr = new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

            let existingFile = this.savedScannedFiles.find(f => f.fileName === fileName);
            if (existingFile) {
                existingFile.totalWords = extractedWords.length;
                existingFile.stats = stats;
                existingFile.words = extractedWords;
                existingFile.stopwordsFiltered = stopwordsFiltered;
                existingFile.scannedAt = nowStr;
                if (meta) existingFile.meta = meta;
                this.activeScannedFileId = existingFile.id;
            } else {
                const newFile = {
                    id: 'scanned_file_' + Date.now(),
                    fileName: fileName,
                    totalWords: extractedWords.length,
                    stats: stats,
                    words: extractedWords,
                    stopwordsFiltered: stopwordsFiltered,
                    scannedAt: nowStr,
                    meta: meta,
                    learnedWords: [],
                    lastStudiedAt: null
                };
                this.savedScannedFiles.unshift(newFile);
                if (this.savedScannedFiles.length > 25) {
                    this.savedScannedFiles = this.savedScannedFiles.slice(0, 25);
                }
                this.activeScannedFileId = newFile.id;
            }
            this.saveSavedScannedFiles();
        }

        getActiveSavedFile() {
            if (!this.savedScannedFiles || this.savedScannedFiles.length === 0) return null;
            if (this.activeScannedFileId) {
                const found = this.savedScannedFiles.find(f => f.id === this.activeScannedFileId);
                if (found) return found;
            }
            if (this.scannedFileName) {
                const found = this.savedScannedFiles.find(f => f.fileName === this.scannedFileName);
                if (found) return found;
            }
            return this.savedScannedFiles[0] || null;
        }

        loadSavedScannedFile(fileId) {
            this.loadSavedScannedFiles();
            const file = this.savedScannedFiles.find(f => f.id === fileId);
            if (!file) {
                if (typeof window.showToast === 'function') window.showToast('Không tìm thấy tài liệu này!');
                return;
            }

            this.activeScannedFileId = file.id;
            this.uploadedFileWords = JSON.parse(JSON.stringify(file.words || []));
            this.scannedStats = file.stats || { total: this.uploadedFileWords.length, A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
            this.scannedFileName = file.fileName;
            this.scannedStopwordsCount = file.stopwordsFiltered || 0;
            this.scannedDuration = 15;
            this.scannedMeta = file.meta || null;
            this.fileFilterLevel = 'ALL';
            this.fileSearchQuery = '';
            this.fileDisplayLimit = 36;
            this.scannedSelectedCount = Math.min(10, this.uploadedFileWords.length || 10);
            this.selectedCardWords.clear();

            const uid = this.getCurrentUserId();
            localStorage.setItem(`cung_dang_${uid}_active_scanned_file_id_v2`, file.id);

            if (typeof window.showToast === 'function') {
                window.showToast(`✨ Đã nạp lại ${this.uploadedFileWords.length} từ từ tài liệu "${file.fileName}"!`);
            }
            this.renderInto();
        }

        deleteSavedScannedFile(fileId) {
            this.loadSavedScannedFiles();
            const idx = this.savedScannedFiles.findIndex(f => f.id === fileId);
            if (idx === -1) return;

            const file = this.savedScannedFiles[idx];
            this.savedScannedFiles.splice(idx, 1);
            this.saveSavedScannedFiles();

            if (this.activeScannedFileId === fileId) {
                this.activeScannedFileId = null;
                if (this.savedScannedFiles.length > 0) {
                    this.loadSavedScannedFile(this.savedScannedFiles[0].id);
                } else {
                    this.uploadedFileWords = [];
                    this.scannedStats = null;
                    this.scannedFileName = '';
                    this.renderInto();
                }
            } else {
                this.renderInto();
            }

            if (typeof window.showToast === 'function') {
                window.showToast(`🗑️ Đã xóa tài liệu "${file.fileName}"!`);
            }
        }

        markWordsAsLearnedInActiveFile(wordsArray) {
            if (!Array.isArray(wordsArray) || wordsArray.length === 0) return;
            const activeFile = this.getActiveSavedFile();
            if (!activeFile) return;

            if (!Array.isArray(activeFile.learnedWords)) {
                activeFile.learnedWords = [];
            }

            const learnedSet = new Set(activeFile.learnedWords.map(w => (w || '').toLowerCase()));
            wordsArray.forEach(item => {
                if (!item || !item.word) return;
                learnedSet.add(item.word.trim().toLowerCase());
            });

            activeFile.learnedWords = Array.from(learnedSet);
            activeFile.lastStudiedAt = new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
            this.saveSavedScannedFiles();
        }

        recordWordsToNotebook(wordsArray, sourceName = 'Tài liệu đã quét') {
            if (!Array.isArray(wordsArray) || wordsArray.length === 0) return;
            const todayStr = new Date().toLocaleDateString('vi-VN');
            if (!Array.isArray(window.savedVocabItems)) {
                window.savedVocabItems = [];
            }

            wordsArray.forEach(item => {
                if (!item || !item.word) return;
                const cleanW = item.word.trim();
                const exists = window.savedVocabItems.some(x => (x.word || '').toLowerCase() === cleanW.toLowerCase());
                if (!exists) {
                    window.savedVocabItems.push({
                        word: cleanW,
                        meaning: item.meaning || (item.level ? 'Từ vựng cấp độ ' + item.level : 'Từ vựng tiếng Anh'),
                        phonetic: item.phonetic || (cefrEngine ? cefrEngine.lookupIPA(cleanW) : `/${cleanW}/`),
                        level: item.level || (cefrEngine ? cefrEngine.classify(cleanW) : 'B1'),
                        dateAdded: todayStr,
                        sourceFile: sourceName,
                        learnedAt: Date.now()
                    });
                }
            });

            const uid = this.getCurrentUserId();
            localStorage.setItem(`cung_dang_${uid}_saved_vocab_v1`, JSON.stringify(window.savedVocabItems));

            const badge = document.getElementById('savedWordsBadge');
            if (badge) badge.textContent = window.savedVocabItems.length;
            const sub = document.getElementById('savedVocabSub');
            if (sub) sub.textContent = `Đã lưu ${window.savedVocabItems.length} từ vựng`;

            if (typeof window.renderSavedVocabList === 'function') {
                window.renderSavedVocabList();
            }
        }

        // =========================================================================
        // CHỌN TỪ TRỰC TIẾP TRÊN LƯỚI CARD & ACTION FLOATING BAR (ẢNH 4)
        // =========================================================================
        toggleSelectWordCard(word) {
            if (!word) return;
            const lower = word.trim().toLowerCase();
            if (this.selectedCardWords.has(lower)) {
                this.selectedCardWords.delete(lower);
            } else {
                this.selectedCardWords.add(lower);
            }
            if (document.getElementById('vgFileCardsGrid')) {
                this.updateFileWordGridOnly();
            } else {
                this.renderInto();
            }
        }

        selectAllDisplayedCards() {
            const displayed = this.getFilteredUploadedWords();
            displayed.forEach(w => {
                if (w && w.word) this.selectedCardWords.add(w.word.trim().toLowerCase());
            });
            if (document.getElementById('vgFileCardsGrid')) {
                this.updateFileWordGridOnly();
            } else {
                this.renderInto();
            }
        }

        clearSelectedCards() {
            this.selectedCardWords.clear();
            if (document.getElementById('vgFileCardsGrid')) {
                this.updateFileWordGridOnly();
            } else {
                this.renderInto();
            }
        }

        saveSelectedCardsToNotebook() {
            if (!this.selectedCardWords || this.selectedCardWords.size === 0) return;
            const selectedItems = [];
            this.selectedCardWords.forEach(wordStr => {
                const found = this.uploadedFileWords.find(w => w.word.toLowerCase() === wordStr.toLowerCase());
                if (found) selectedItems.push(found);
            });
            if (selectedItems.length === 0) return;

            const sourceName = this.scannedFileName || 'Tài liệu đã quét';
            this.recordWordsToNotebook(selectedItems, sourceName);

            if (typeof window.showToast === 'function') {
                window.showToast(`🔖 Đã lưu ${selectedItems.length} từ vựng vào Sổ từ vựng!`);
            }
            this.clearSelectedCards();
        }

        launchArenaWithSelectedCards() {
            if (!this.selectedCardWords || this.selectedCardWords.size === 0) return;
            const selectedWords = [];
            this.selectedCardWords.forEach(wordStr => {
                const found = this.uploadedFileWords.find(w => w.word.toLowerCase() === wordStr.toLowerCase());
                if (found) selectedWords.push(found);
            });
            if (selectedWords.length === 0) return;

            this.markWordsAsLearnedInActiveFile(selectedWords);
            this.recordWordsToNotebook(selectedWords, this.scannedFileName || 'Tài liệu');
            this.launchArenaWithWords(selectedWords, `Đã chọn: ${this.scannedFileName || 'Tài liệu'}`);
            this.clearSelectedCards();
        }

        launchFlashcardsWithSelectedCards() {
            if (!this.selectedCardWords || this.selectedCardWords.size === 0) return;
            const selectedWords = [];
            this.selectedCardWords.forEach(wordStr => {
                const found = this.uploadedFileWords.find(w => w.word.toLowerCase() === wordStr.toLowerCase());
                if (found) selectedWords.push(found);
            });
            if (selectedWords.length === 0) return;

            this.markWordsAsLearnedInActiveFile(selectedWords);
            this.recordWordsToNotebook(selectedWords, this.scannedFileName || 'Tài liệu');
            this.openFlashcardModal(selectedWords, `Thẻ chọn từ: ${this.scannedFileName || 'Tài liệu'}`);
            this.clearSelectedCards();
        }

        launchArenaWithWords(wordsList, title = 'Từ vựng') {
            if (!wordsList || wordsList.length === 0) {
                if (typeof window.showToast === 'function') window.showToast('Danh sách từ trống!');
                return;
            }
            if (typeof window.switchTab === 'function') {
                window.switchTab('hoc-tu-vung');
            }
            this.wordList = wordsList.map(w => ({
                word: w.word,
                meaning: w.meaning || (w.level ? 'Từ vựng cấp độ ' + w.level : 'Từ vựng tiếng Anh'),
                phonetic: w.phonetic || (cefrEngine ? cefrEngine.lookupIPA(w.word) : `/${w.word}/`),
                level: w.level || (cefrEngine ? cefrEngine.classify(w.word) : 'B1')
            }));
            this.selectedTopic = title;
            this.selectedLevel = this.wordList[0]?.level || 'B1';
            this.selectedCount = this.wordList.length;
            this.startArena();
            if (typeof window.showToast === 'function') {
                window.showToast(`🚀 Đã nạp ${this.wordList.length} từ vào Gundam Arena!`);
            }
        }

        // =========================================================================
        // HỌC THẺ TỪ 3D FLASHCARD TƯƠNG TÁC
        // =========================================================================
        openFlashcardModal(wordsList, title = 'Ôn tập Flashcard') {
            if (!wordsList || wordsList.length === 0) {
                if (typeof window.showToast === 'function') window.showToast('Không có từ vựng nào để mở Flashcard!');
                return;
            }
            this.flashcardWords = wordsList;
            this.flashcardIndex = 0;
            this.flashcardIsFlipped = false;
            this.flashcardTitle = title;
            this.renderFlashcardModal();
            const cur = this.flashcardWords[0];
            if (cur && cur.word) this.speakWord(cur.word);
        }

        closeFlashcardModal() {
            const modal = document.getElementById('vgFlashcardModalRoot');
            if (modal) modal.remove();
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        }

        flipFlashcard() {
            this.flashcardIsFlipped = !this.flashcardIsFlipped;
            const inner = document.getElementById('vgFlashcardInner');
            if (inner) {
                if (this.flashcardIsFlipped) {
                    inner.classList.add('rotate-y-180');
                } else {
                    inner.classList.remove('rotate-y-180');
                }
            }
        }

        nextFlashcard() {
            if (this.flashcardIndex < this.flashcardWords.length - 1) {
                this.flashcardIndex++;
                this.flashcardIsFlipped = false;
                this.renderFlashcardModal();
                const cur = this.flashcardWords[this.flashcardIndex];
                if (cur && cur.word) this.speakWord(cur.word);
            } else {
                if (typeof window.showToast === 'function') window.showToast('🎉 Bạn đã xem hết tất cả các thẻ trong bộ này!');
            }
        }

        prevFlashcard() {
            if (this.flashcardIndex > 0) {
                this.flashcardIndex--;
                this.flashcardIsFlipped = false;
                this.renderFlashcardModal();
                const cur = this.flashcardWords[this.flashcardIndex];
                if (cur && cur.word) this.speakWord(cur.word);
            }
        }

        launchArenaFromFlashcard() {
            const wordsToPlay = this.flashcardWords;
            const title = this.flashcardTitle;
            this.closeFlashcardModal();
            this.launchArenaWithWords(wordsToPlay, title);
        }

        renderFlashcardModal() {
            let modalRoot = document.getElementById('vgFlashcardModalRoot');
            if (!modalRoot) {
                modalRoot = document.createElement('div');
                modalRoot.id = 'vgFlashcardModalRoot';
                document.body.appendChild(modalRoot);
            }

            const item = this.flashcardWords[this.flashcardIndex] || { word: '', meaning: '', phonetic: '', level: 'B1' };
            const total = this.flashcardWords.length;
            const curIdx = this.flashcardIndex;

            const lvlColors = {
                A1: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300',
                A2: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-300',
                B1: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300',
                B2: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300',
                C1: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300',
                C2: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
            };

            modalRoot.innerHTML = `
                <div id="vgFlashcardModal" class="fixed inset-0 z-[9999] bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
                    <div class="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-2xl space-y-5">
                        <!-- Header -->
                        <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2.5">
                                <span class="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-base font-black shadow-xs">🃏</span>
                                <div>
                                    <h3 class="text-sm font-black text-slate-900 dark:text-white truncate max-w-[260px]">${this.flashcardTitle}</h3>
                                    <div class="text-[11px] text-slate-400 font-bold">Thẻ ${curIdx + 1} / ${total} • Bấm thẻ để lật</div>
                                </div>
                            </div>
                            <button onclick="VocabGameWorkstation.closeFlashcardModal()" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition cursor-pointer">✕</button>
                        </div>

                        <!-- Thanh tiến độ thẻ -->
                        <div class="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300" style="width: ${Math.round(((curIdx + 1) / total) * 100)}%"></div>
                        </div>

                        <!-- 3D Flippable Card -->
                        <div class="perspective-1000 w-full h-64 cursor-pointer select-none" onclick="VocabGameWorkstation.flipFlashcard()">
                            <div id="vgFlashcardInner" class="relative w-full h-full rounded-3xl transition-transform duration-500 transform-style-preserve-3d shadow-xl border border-slate-200/90 dark:border-slate-800 ${this.flashcardIsFlipped ? 'rotate-y-180' : ''}">
                                <!-- Mặt trước: Từ tiếng Anh, phiên âm, loa -->
                                <div class="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-blue-50/30 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 flex flex-col justify-between items-center text-center backface-hidden">
                                    <div class="flex items-center justify-between w-full">
                                        <span class="px-2.5 py-0.5 rounded-md text-[10px] font-black border ${lvlColors[item.level] || lvlColors.B1}">
                                            ${item.level || 'B1'}
                                        </span>
                                        <button type="button" onclick="event.stopPropagation(); VocabGameWorkstation.speakWord('${item.word}')" title="Nghe phát âm chuẩn"
                                            class="w-9 h-9 rounded-xl bg-slate-100 hover:bg-cyan-100 dark:bg-slate-700 text-slate-600 hover:text-cyan-600 flex items-center justify-center text-xs transition cursor-pointer">
                                            <i class="fa-solid fa-volume-high"></i>
                                        </button>
                                    </div>
                                    <div class="my-auto space-y-1.5">
                                        <div class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-wide">${item.word}</div>
                                        <div class="text-sm font-mono text-cyan-600 dark:text-cyan-400 font-bold">${item.phonetic || '/' + item.word + '/'}</div>
                                    </div>
                                    <div class="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                                        <i class="fa-solid fa-arrow-rotate-right text-emerald-500"></i>
                                        <span>Bấm để lật xem nghĩa tiếng Việt</span>
                                    </div>
                                </div>

                                <!-- Mặt sau: Nghĩa tiếng Việt, ví dụ -->
                                <div class="absolute inset-0 bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-amber-100/40 dark:from-slate-800 dark:to-slate-900 rounded-3xl p-6 flex flex-col justify-between items-center text-center backface-hidden rotate-y-180">
                                    <div class="flex items-center justify-between w-full">
                                        <span class="px-2.5 py-0.5 rounded-md text-[10px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300">
                                            NGHĨA TIẾNG VIỆT
                                        </span>
                                        <button type="button" onclick="event.stopPropagation(); VocabGameWorkstation.speakWord('${item.word}')" title="Nghe phát âm chuẩn"
                                            class="w-9 h-9 rounded-xl bg-amber-100 dark:bg-slate-700 text-amber-800 flex items-center justify-center text-xs transition cursor-pointer">
                                            <i class="fa-solid fa-volume-high"></i>
                                        </button>
                                    </div>
                                    <div class="my-auto space-y-2">
                                        <div class="text-xl sm:text-2xl font-black text-amber-950 dark:text-amber-300 leading-snug">${item.meaning || (item.level ? 'Từ vựng cấp độ ' + item.level : 'Từ vựng tiếng Anh')}</div>
                                        <div class="text-xs font-semibold text-slate-500 dark:text-slate-400">/${item.word}/ • ${item.level || 'B1'}</div>
                                    </div>
                                    <div class="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                                        <i class="fa-solid fa-arrow-rotate-right text-amber-500"></i>
                                        <span>Bấm để lật lại mặt trước</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Footer Navigation Buttons -->
                        <div class="flex items-center justify-between gap-2.5 pt-2 flex-wrap">
                            <button type="button" onclick="VocabGameWorkstation.prevFlashcard()" ${curIdx === 0 ? 'disabled' : ''}
                                class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-black text-slate-700 dark:text-slate-300 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                                ← Trước
                            </button>

                            <!-- Chuyển trực tiếp sang Gundam Arena -->
                            <button type="button" onclick="VocabGameWorkstation.launchArenaFromFlashcard()"
                                class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black text-xs shadow-md transition active:scale-95 flex items-center gap-1.5 cursor-pointer">
                                <i class="fa-solid fa-gamepad"></i>
                                <span>Bắn súng Gundam (${total} từ)</span>
                            </button>

                            <button type="button" onclick="VocabGameWorkstation.nextFlashcard()" ${curIdx === total - 1 ? 'disabled' : ''}
                                class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed">
                                Tiếp theo →
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }

        // =========================================================================
        // THƯ VIỆN SÁCH GIÁO KHOA BỘ GIÁO DỤC (LỚP 1 - LỚP 12)
        // =========================================================================
        buildTextbookLibraryHTML() {
            return `
                <div class="bg-gradient-to-r from-blue-50/80 via-sky-50/50 to-indigo-50/80 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/80 p-4 sm:p-5 rounded-3xl border border-blue-200/90 dark:border-slate-700 shadow-2xs space-y-3.5">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-lg shadow-md shrink-0">
                                📚
                            </div>
                            <div>
                                <h5 class="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                                    <span>Thư viện Sách Giáo Khoa Chuẩn Bộ GD&ĐT (Lớp 1 — 12)</span>
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-600 text-white shadow-xs">Scan & Nạp Nhanh</span>
                                </h5>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                                    Tự động nhận diện file scan ảnh SGK hoặc bấm chọn trực tiếp sách bên dưới để nạp đủ 100% từ vựng chuẩn Unit:
                                </p>
                            </div>
                        </div>

                        <!-- Badge Bộ Giáo Dục -->
                        <span class="px-3 py-1 rounded-xl text-[11px] font-black bg-white dark:bg-slate-900 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-slate-700 shadow-2xs shrink-0 flex items-center gap-1.5">
                            <i class="fa-solid fa-graduation-cap text-amber-500"></i>
                            <span>Global Success & MoET</span>
                        </span>
                    </div>

                    <!-- Danh sách 12 Lớp (Grades 1 to 12) -->
                    <div class="flex flex-wrap items-center gap-2 pt-1">
                        <span class="text-[11px] font-bold text-slate-400 shrink-0">Chọn sách theo khối:</span>
                        
                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_1_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 1</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_2_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 2</span>
                        </button>

                        <!-- LỚP 3 GLOBAL SUCCESS NỔI BẬT (TẬP 1 & TẬP 2) -->
                        <div class="inline-flex rounded-xl shadow-2xs p-0.5 bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-700">
                            <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_3_global_success_tap_1')"
                                title="Sách Giáo Khoa Tiếng Anh 3 Global Success - Tập 1 (Unit 1 - 10)"
                                class="px-3 py-1 rounded-lg text-xs font-black transition flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer">
                                <span>⭐ Lớp 3 (Tập 1)</span>
                            </button>
                            <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_3_global_success_tap_2')"
                                title="Sách Giáo Khoa Tiếng Anh 3 Global Success - Tập 2 (Unit 11 - 20)"
                                class="px-2.5 py-1 rounded-lg text-xs font-black transition flex items-center gap-1 text-blue-700 hover:bg-blue-200/60 dark:text-blue-300 cursor-pointer">
                                <span>Tập 2</span>
                            </button>
                        </div>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_4_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 4</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_5_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 5</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_6_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 6 (A2)</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_7_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 7 (A2)</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_8_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 8 (B1)</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_9_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 9 (B1)</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_10_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 10 (B2)</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_11_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 11 (B2)</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_12_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 12 (B2/C1)</span>
                        </button>
                    </div>
                </div>
            `;
        }

        loadTextbookCurriculum(key) {
            if (!window.TextbookCurriculumEngine) return;
            const book = window.TextbookCurriculumEngine.getCurriculum(key);
            if (!book) {
                if (typeof window.showToast === 'function') window.showToast('Không tìm thấy sách giáo khoa này!');
                return;
            }

            const startTime = performance.now();
            const words = JSON.parse(JSON.stringify(book.words || []));
            this.finalizeScannedWords(words, book.title, startTime, 0, {
                isTextbook: true,
                bookTitle: book.title,
                badge: book.badge,
                units: book.units
            });

            if (typeof window.showToast === 'function') {
                window.showToast(`📘 Đã nạp thành công ${words.length} từ vựng từ "${book.title}"!`);
            }
        }

        async ensureTesseractLoaded() {
            if (window.Tesseract) return window.Tesseract;
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'js/tesseract.min.js';
                script.onload = () => resolve(window.Tesseract);
                script.onerror = () => {
                    const cdnScript = document.createElement('script');
                    cdnScript.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
                    cdnScript.onload = () => resolve(window.Tesseract);
                    cdnScript.onerror = () => resolve(null);
                    document.head.appendChild(cdnScript);
                };
                document.head.appendChild(script);
            });
        }

        async performPdfCanvasOcr(arrayBuffer) {
            if (!window.pdfjsLib) return '';
            try {
                const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
                const pdfDoc = await loadingTask.promise;
                const pagesToScan = Math.min(pdfDoc.numPages, 3);
                let text = '';

                await this.ensureTesseractLoaded();
                if (window.Tesseract) {
                    let worker = null;
                    try {
                        worker = await window.Tesseract.createWorker(['eng'], 1, {
                            workerPath: 'js/tesseract-dist/worker.min.js',
                            corePath: 'js/tesseract-dist/tesseract-core.wasm.js',
                            langPath: window.location.origin + '/data/ocr_lang',
                            cacheMethod: 'none',
                            gzip: true
                        });
                    } catch(errWorker) {
                        worker = await window.Tesseract.createWorker('eng');
                    }

                    if (worker) {
                        for (let p = 1; p <= pagesToScan; p++) {
                            const page = await pdfDoc.getPage(p);
                            const viewport = page.getViewport({ scale: 1.5 });
                            const canvas = document.createElement('canvas');
                            canvas.width = viewport.width;
                            canvas.height = viewport.height;
                            const ctx = canvas.getContext('2d');
                            await page.render({ canvasContext: ctx, viewport: viewport }).promise;

                            const result = await worker.recognize(canvas);
                            if (result && result.data && result.data.text) {
                                text += result.data.text + '\n';
                            }
                        }
                        await worker.terminate();
                    }
                }
                return text;
            } catch(e) {
                console.warn('Lỗi performPdfCanvasOcr:', e);
                return '';
            }
        }

        // =========================================================================
        // SECTION GIAO DIỆN TÀI LIỆU ĐÃ QUÉT CỦA NGƯỜI DÙNG (THAY THẾ BỘ MẪU GIẢ)
        // =========================================================================
        buildSavedScannedFilesSectionHTML() {
            this.loadSavedScannedFiles();
            const savedFiles = this.savedScannedFiles || [];

            return `
                <div class="bg-slate-50/80 dark:bg-slate-800/50 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3.5">
                    <div class="flex items-center justify-between flex-wrap gap-2">
                        <div class="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-2">
                            <span class="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs font-black">📁</span>
                            <span>Tài liệu đã quét của bạn (Tự động ghi nhớ tài khoản):</span>
                        </div>
                        <span class="text-[11px] font-bold text-slate-400">
                            ${savedFiles.length > 0 ? `Đang lưu ${savedFiles.length} tài liệu • Bấm 1 chạm để nạp lại` : 'Chưa có tài liệu nào'}
                        </span>
                    </div>

                    ${savedFiles.length > 0 ? `
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            ${savedFiles.map(file => {
                                const isActive = file.id === this.activeScannedFileId;
                                const learnedCount = (file.learnedWords && file.learnedWords.length) || 0;
                                const totalCount = file.totalWords || (file.words && file.words.length) || 0;
                                const pct = totalCount > 0 ? Math.round((learnedCount / totalCount) * 100) : 0;
                                const remaining = Math.max(0, totalCount - learnedCount);

                                return `
                                    <div class="p-4 rounded-2xl border transition relative flex flex-col justify-between gap-3 ${isActive ? 'bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-500 shadow-sm ring-2 ring-emerald-400/30' : 'bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/60 border-slate-200 dark:border-slate-700 shadow-2xs'}">
                                        <div>
                                            <div class="flex items-start justify-between gap-2">
                                                <div class="flex items-center gap-2.5 min-w-0">
                                                    <div class="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-cyan-300 flex items-center justify-center text-base shrink-0">
                                                        📄
                                                    </div>
                                                    <div class="min-w-0">
                                                        <div class="text-xs font-black text-slate-900 dark:text-white truncate" title="${file.fileName}">
                                                            ${file.fileName}
                                                        </div>
                                                        <div class="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                                            <span>📅 Quét: ${file.scannedAt || 'Gần đây'}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button type="button" onclick="event.stopPropagation(); VocabGameWorkstation.deleteSavedScannedFile('${file.id}')"
                                                    class="w-6 h-6 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 flex items-center justify-center text-xs transition cursor-pointer" title="Xóa tài liệu này">
                                                    <i class="fa-regular fa-trash-can"></i>
                                                </button>
                                            </div>

                                            <!-- Thống kê tiến độ học từ tài liệu này -->
                                            <div class="mt-3 space-y-1.5 bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <div class="flex items-center justify-between text-[11px] font-bold">
                                                    <span class="text-slate-600 dark:text-slate-300">Tổng số từ: <strong class="text-slate-900 dark:text-white">${totalCount}</strong></span>
                                                    <span class="text-emerald-600 dark:text-emerald-400 font-extrabold">Đã học: ${learnedCount} (${pct}%)</span>
                                                </div>
                                                <div class="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                    <div class="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                                                </div>
                                                <div class="text-[10px] text-slate-400 flex items-center justify-between pt-0.5">
                                                    <span>Còn lại: <strong class="text-amber-500">${remaining}</strong> từ chưa học</span>
                                                    ${file.lastStudiedAt ? `<span class="italic text-[9px]">Lần cuối: ${file.lastStudiedAt}</span>` : ''}
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Action Buttons -->
                                        <div class="flex items-center gap-2 pt-1">
                                            <button type="button" onclick="VocabGameWorkstation.loadSavedScannedFile('${file.id}')"
                                                class="flex-1 py-2 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 cursor-pointer ${isActive ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-2xs'}">
                                                <i class="fa-solid fa-bolt text-[11px]"></i>
                                                <span>${isActive ? 'Đang kích hoạt (Xem chi tiết)' : 'Nạp lại & Học ngay'}</span>
                                            </button>
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    ` : `
                        <!-- Trạng thái trống (Totoro Style) -->
                        <div class="p-6 rounded-2xl bg-white dark:bg-slate-800/80 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-2">
                            <div class="text-2xl">📚</div>
                            <div class="text-xs font-bold text-slate-700 dark:text-slate-200">
                                Chưa có tài liệu nào được lưu trong tài khoản của bạn
                            </div>
                            <p class="text-[11px] text-slate-400 max-w-md mx-auto">
                                Tải lên bất kỳ sách giáo khoa Lớp 1–12, giáo trình, bài đọc, file PDF, DOCX, TXT hoặc dán văn bản ở trên. Hệ thống sẽ tự động phân tích và ghi nhớ vĩnh viễn vào tài khoản của bạn để lần sau vào học ngay mà không cần tải lại!
                            </p>
                        </div>
                    `}
                </div>
            `;
        }

        // =========================================================================
        // ĐIỀU HƯỚNG & RENDER CHÍNH
        // =========================================================================
        renderInto(containerId = 'view-hoc-tu-vung') {
            this.containerId = containerId;
            const container = document.getElementById(containerId);
            if (!container) return;

            const searchInput = document.getElementById('vgFileSearchInput');
            const wasSearchFocused = (document.activeElement === searchInput);
            const searchStart = searchInput?.selectionStart;
            const searchEnd = searchInput?.selectionEnd;

            if (this.activeView === 'config') {
                this.detachGlobalKeydown();
                this.stopGameLoop();
                container.innerHTML = this.buildConfigHTML();
            } else if (this.activeView === 'preview') {
                this.detachGlobalKeydown();
                this.stopGameLoop();
                container.innerHTML = this.buildPreviewHTML();
            } else if (this.activeView === 'playing') {
                container.innerHTML = this.buildGameArenaHTML();
                this.attachGlobalKeydown();
                this.initGameCanvas();
                this.startGameLoop();
                this.updateFallingCardUI();
                this.speakWord(this.currentWord.word);
            } else if (this.activeView === 'summary') {
                this.detachGlobalKeydown();
                this.stopGameLoop();
                container.innerHTML = this.buildSummaryHTML();
            }

            if (wasSearchFocused) {
                const newSearchInput = document.getElementById('vgFileSearchInput');
                if (newSearchInput) {
                    newSearchInput.focus();
                    if (searchStart !== undefined && searchEnd !== undefined) {
                        try { newSearchInput.setSelectionRange(searchStart, searchEnd); } catch(e) {}
                    }
                }
            }
        }

        // =========================================================================
        // VIEW 1: BẢNG CẤU HÌNH & 3 CHẾ ĐỘ NẠP TỪ (AI, UPLOAD FILE, TỰ ĐIỀN)
        // =========================================================================
        switchIntakeMode(mode) {
            this.currentIntakeMode = mode;
            this.renderInto();
        }

        buildConfigHTML() {
                        const topics = [
                { id: 'Công nghệ', icon: '💻', label: 'Công nghệ (Technology)' },
                { id: 'Du lịch', icon: '✈️', label: 'Du lịch (Travel)' },
                { id: 'Kinh tế & Doanh nghiệp', icon: '📈', label: 'Kinh tế (Business)' },
                { id: 'Phim hoạt hình Ghibli', icon: '🌳', label: 'Thế giới Totoro & Ghibli' },
                { id: 'Phỏng vấn xin việc', icon: '💼', label: 'Phỏng vấn (Job Interview)' },
                { id: 'Giao tiếp đời sống', icon: '☕', label: 'Giao tiếp (Daily Life)' },
                { id: 'Ẩm thực & Nhà hàng', icon: '🍕', label: 'Ẩm thực (Food & Dining)' },
                { id: 'Môi trường công sở', icon: '🏢', label: 'Công sở (Workplace)' }
            ];

            const levels = [
                { id: 'A1', sub: '(Sơ cấp)', score: '100 - 250' },
                { id: 'A2', sub: '(Cơ bản)', score: '255 - 450' },
                { id: 'B1', sub: '(Trung cấp)', score: '455 - 650' },
                { id: 'B2', sub: '(Trung cao cấp)', score: '655 - 800' },
                { id: 'C1', sub: '(Cao cấp)', score: '805 - 900' },
                { id: 'C2', sub: '(Thành thạo)', score: '905 - 990' }
            ];

            const counts = [10, 20, 30, 50];

            return `
                <div class="w-full max-w-6xl 2xl:max-w-7xl mx-auto space-y-6 pb-12">
                    <!-- Top Breadcrumb -->
                    <nav class="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-1">
                        <span class="hover:text-emerald-600 cursor-pointer" onclick="switchTab('hom-nay')">Trang chủ</span>
                        <span class="mx-1.5">/</span>
                        <span class="text-slate-700 dark:text-slate-200">Học từ vựng</span>
                    </nav>

                    <!-- Gundam Sci-Fi Header Banner -->
                    <div class="rounded-3xl p-5 sm:p-6 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-900 text-white border border-cyan-500/30 shadow-2xl flex flex-col sm:flex-row items-center gap-5 relative overflow-hidden">
                        <div class="w-20 sm:w-24 aspect-[219/286] shrink-0 rounded-2xl overflow-hidden border border-cyan-400/40 shadow-lg relative bg-slate-900 flex items-center justify-center">
                            <img src="assets/mascot/totoro_listening_card.png" alt="Gundam Arena Mascot" class="w-full h-full object-cover filter brightness-105 hover:scale-105 transition-transform duration-300">
                        </div>
                        <div class="space-y-1.5 text-center sm:text-left flex-1 min-w-0">
                            <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                <span class="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-black uppercase tracking-wider border border-cyan-400/30">
                                    GUNDAM MOBILE SUIT VOCAB ARENA
                                </span>
                                <span class="text-xs text-amber-300 font-bold">✨ Bắn Rơi Từ Vựng & Phân Loại CEFR</span>
                            </div>
                            <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">
                                Đấu Trường Gundam — Nghe Chuẩn Phát Âm, Quét File 3000 Từ & Xếp CEFR A1–C2
                            </h2>
                            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                                Điều khiển Mobile Suit Gundam xoay nòng ngắm bắn từ rơi! Tự do chọn chủ đề AI, tải lên file tài liệu hàng nghìn từ để tự động phân loại chuẩn CEFR hoặc tự điền từ vựng yêu thích.
                            </p>
                        </div>
                    </div>

                    <!-- 3 CỘT TAB CHỌN PHƯƠNG THỨC NẠP TỪ VỰNG -->
                    <div class="flex items-center justify-center p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 max-w-2xl mx-auto shadow-xs">
                        <button onclick="VocabGameWorkstation.switchIntakeMode('ai')" 
                            class="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${this.currentIntakeMode === 'ai' ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}">
                            <i class="fa-solid fa-wand-magic-sparkles"></i>
                            <span>Tạo theo chủ đề</span>
                        </button>
                        <button onclick="VocabGameWorkstation.switchIntakeMode('file')" 
                            class="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${this.currentIntakeMode === 'file' ? 'bg-white dark:bg-slate-900 text-cyan-600 dark:text-cyan-400 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}">
                            <i class="fa-solid fa-cloud-arrow-up"></i>
                            <span>Tải lên File từ vựng (Scan CEFR)</span>
                        </button>
                        <button onclick="VocabGameWorkstation.switchIntakeMode('custom')" 
                            class="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${this.currentIntakeMode === 'custom' ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-slate-700' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'}">
                            <i class="fa-solid fa-pen-to-square"></i>
                            <span>Tự điền từ của bạn</span>
                        </button>
                    </div>

                    <!-- NỘI DUNG TỪNG TAB -->
                    ${this.currentIntakeMode === 'file' ? this.buildFileScanHTML() : 
                      this.currentIntakeMode === 'custom' ? this.buildCustomInputHTML() : 
                      this.buildTopicAIHTML(topics, levels, counts)}
                </div>
            `;
        }

        // =========================================================================
        // SUB-VIEW A: TẠO THEO CHỦ ĐỀ
        // =========================================================================
        buildTopicAIHTML(topics, levels, counts) {
            return `
                <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
                    <!-- 1. Topic Input & Suggestions -->
                    <div class="space-y-3">
                        <label class="block text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                            <span class="flex items-center gap-2">
                                <span class="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">1</span>
                                Chủ đề từ vựng muốn học (Topic)
                            </span>
                            <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">Nhập Tiếng Việt hoặc English</span>
                        </label>

                        <div class="relative">
                            <input type="text" id="vgTopicInput" value="${this.selectedTopic}" 
                                placeholder="Nhập bất kỳ chủ đề nào bằng Tiếng Việt hoặc English (VD: Travel, Artificial Intelligence, Job Interview, Ẩm thực...)"
                                class="w-full px-4 py-3 text-sm font-bold rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-2xs transition">
                        </div>

                        <!-- Quick Suggestion Tags -->
                        <div class="flex flex-wrap items-center gap-2 pt-1">
                            <span class="text-xs font-bold text-slate-400 shrink-0">Gợi ý nhanh:</span>
                            ${topics.map(t => `
                                <button onclick="VocabGameWorkstation.selectQuickTopic('${t.id}')"
                                    class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${this.selectedTopic === t.id ? 'bg-blue-600 text-white shadow-sm scale-105' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'}">
                                    <span>${t.icon}</span>
                                    <span>${t.label}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>

                    <!-- 2. CEFR Level Selector (A1 - C2) -->
                    <div class="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <label class="block text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                            <span class="flex items-center gap-2">
                                <span class="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">2</span>
                                Trình độ từ vựng chuẩn khung CEFR (A1 – C2)
                            </span>
                            <span class="text-xs font-semibold text-slate-400">Chọn mức độ phù hợp với năng lực</span>
                        </label>

                        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                            ${levels.map(l => {
                                const isSelected = this.selectedLevel === l.id;
                                return `
                                    <button onclick="VocabGameWorkstation.selectLevel('${l.id}')"
                                        class="p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102' : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}">
                                        <div class="text-sm font-black">${l.id}</div>
                                        <div class="text-[11px] font-semibold opacity-90 whitespace-nowrap">${l.sub}</div>
                                        <div class="text-[10px] opacity-75 font-medium">${l.score}</div>
                                    </button>
                                `;
                            }).join('')}
                        </div>
                    </div>

                    <!-- 3. Word Count Selector (Interactive Range Slider 1-50 & Direct Number Box) -->
                    <div class="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <label class="block text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center justify-between">
                            <span class="flex items-center gap-2">
                                <span class="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs">3</span>
                                Số lượng từ vựng cho một màn chơi
                            </span>
                            <span id="vgCountBadge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-300 border border-blue-200 dark:border-blue-800 shadow-xs">
                                <i class="fa-solid fa-seedling text-emerald-500"></i>
                                <span id="vgCountBadgeNum">${this.selectedCount}</span> từ vựng
                            </span>
                        </label>

                        <div class="bg-slate-50/80 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 space-y-3">
                            <div class="flex items-center gap-4">
                                <!-- Range Slider 1 to 50 -->
                                <div class="relative flex-1 flex items-center">
                                    <input type="range" id="vgCountSlider" min="1" max="50" step="1" value="${this.selectedCount}"
                                        oninput="VocabGameWorkstation.handleSliderInput(this.value)"
                                        class="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-cyan-400"
                                        style="background: linear-gradient(to right, #2563eb 0%, #2563eb ${(this.selectedCount - 1) / 49 * 100}%, #cbd5e1 ${(this.selectedCount - 1) / 49 * 100}%, #cbd5e1 100%);">
                                </div>
                                
                                <!-- Direct Number Input Box -->
                                <div class="flex items-center gap-1.5 shrink-0 bg-white dark:bg-slate-900 px-3 py-1.5 rounded-xl border-2 border-blue-400/80 dark:border-cyan-500/80 shadow-xs">
                                    <input type="number" id="vgCountNumInput" min="1" max="50" value="${this.selectedCount}"
                                        oninput="VocabGameWorkstation.handleNumberInput(this.value)"
                                        class="w-12 text-center font-black text-base text-blue-700 dark:text-cyan-300 bg-transparent focus:outline-none">
                                    <span class="text-xs font-bold text-slate-500 dark:text-slate-400">từ</span>
                                </div>
                            </div>

                            <!-- Quick Preset Jump Chips (including odd & custom numbers like 15, 17) -->
                            <div class="flex items-center gap-1.5 flex-wrap pt-1">
                                <span class="text-[11px] font-bold text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
                                    <i class="fa-solid fa-bolt text-amber-500 text-[10px]"></i> Chọn nhanh:
                                </span>
                                ${[5, 10, 15, 17, 20, 25, 30, 50].map(c => `
                                    <button type="button" onclick="VocabGameWorkstation.selectCount(${c})"
                                        class="vg-count-chip px-2.5 py-1 rounded-lg font-bold text-xs transition border cursor-pointer ${this.selectedCount === c ? 'bg-blue-600 text-white border-blue-600 shadow-xs scale-105' : 'bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700'}">
                                        ${c}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- 4. Action Buttons -->
                    <div class="pt-4 flex flex-col sm:flex-row items-center gap-3">
                        <button onclick="VocabGameWorkstation.generateVocab(true)" 
                            id="vgGenerateBtn"
                            class="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2.5 transition active:scale-95 cursor-pointer">
                            <span>✨ Tạo bộ từ & Học ngay</span>
                        </button>

                        <button onclick="VocabGameWorkstation.generateVocab(false)" 
                            class="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer">
                            <span>🎲 Chơi nhanh với bộ từ mẫu có sẵn</span>
                        </button>
                    </div>
                </div>
            `;
        }

        // =========================================================================
        // SUB-VIEW B: TẢI LÊN FILE TỪ VỰNG (SCAN 3000 TỪ & PHÂN LOẠI A1 - C2)
        // =========================================================================
        buildFileScanHTML() {
            const stats = this.scannedStats;
            const hasWords = this.uploadedFileWords.length > 0;
            const filterLevel = this.fileFilterLevel || 'ALL';
            const searchQuery = (this.fileSearchQuery || '').toLowerCase().trim();

            // Lọc danh sách từ theo level và ô tìm kiếm (Hỗ trợ tìm kiếm nhiều từ cách nhau bằng khoảng trắng)
            let displayedWords = this.getFilteredUploadedWords();

            const totalFiltered = displayedWords.length;
            const displayLimit = this.fileDisplayLimit || 36;
            const paginatedWords = displayedWords.slice(0, displayLimit);

            return `
                <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
                    
                    <!-- 1. DROPZONE TẢI FILE TỰ ĐỘNG & KÉO THẢ THƯỢNG THỪA -->
                    <div id="vgDropzoneContainer"
                        ondragover="VocabGameWorkstation.handleDragOver(event)"
                        ondragleave="VocabGameWorkstation.handleDragLeave(event)"
                        ondrop="VocabGameWorkstation.handleFileDrop(event)"
                        class="border-2 border-dashed border-cyan-400/70 dark:border-cyan-500/60 rounded-3xl p-6 sm:p-9 text-center bg-gradient-to-b from-cyan-50/40 via-sky-50/20 to-transparent dark:from-slate-800/50 dark:to-slate-900/40 relative hover:border-cyan-500 hover:bg-cyan-50/60 transition-all duration-300 group cursor-pointer shadow-xs">
                        
                        <input type="file" id="vgFileInput" class="hidden" accept=".txt,.csv,.tsv,.json,.docx,.pdf" onchange="VocabGameWorkstation.handleFileUpload(event)">
                        
                        <!-- Animated Icon with Radar Rings -->
                        <div onclick="document.getElementById('vgFileInput').click()" class="relative w-18 h-18 sm:w-20 sm:h-20 mx-auto mb-3.5 flex items-center justify-center">
                            <div class="absolute inset-0 rounded-full bg-cyan-400/20 dark:bg-cyan-500/20 animate-ping opacity-60"></div>
                            <div class="absolute inset-1 rounded-full bg-cyan-200/50 dark:bg-cyan-900/60"></div>
                            <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 text-white flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                            </div>
                        </div>

                        <div onclick="document.getElementById('vgFileInput').click()">
                            <h4 class="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-1.5 flex items-center justify-center gap-2">
                                <span>Kéo thả hoặc Nhấp để Tải lên File từ vựng</span>
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs">Scan 3,000+ từ</span>
                            </h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-4">
                                Hỗ trợ cực mạnh các định dạng <strong>.TXT, .CSV, .TSV, .JSON, .PDF, .DOCX</strong>. Hệ thống tự động bóc tách từ vựng, lọc bỏ từ rác, tra nghĩa tiếng Việt và phân loại chuẩn <strong>CEFR A1, A2, B1, B2, C1, C2</strong> trong chớp mắt!
                            </p>
                        </div>

                        <!-- Định dạng hỗ trợ badges -->
                        <div class="flex items-center justify-center gap-2 flex-wrap mb-4" onclick="document.getElementById('vgFileInput').click()">
                            <span class="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200/80 dark:border-blue-800 text-[11px] font-bold font-mono">.TXT</span>
                            <span class="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-[11px] font-bold font-mono">.CSV / .TSV</span>
                            <span class="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800 text-[11px] font-bold font-mono">.JSON</span>
                            <span class="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800 text-[11px] font-bold font-mono">.PDF</span>
                            <span class="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 text-[11px] font-bold font-mono">.DOCX</span>
                        </div>

                        <!-- Action Buttons: Chọn file & Dán từ Clipboard -->
                        <div class="flex items-center justify-center gap-3 flex-wrap">
                            <button type="button" onclick="document.getElementById('vgFileInput').click()"
                                class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition active:scale-95 flex items-center gap-2">
                                <i class="fa-solid fa-folder-open"></i>
                                <span>Chọn file từ máy tính</span>
                            </button>
                            <button type="button" onclick="VocabGameWorkstation.pasteFromClipboard()"
                                class="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs transition active:scale-95 flex items-center gap-1.5 shadow-2xs">
                                <i class="fa-solid fa-paste text-cyan-600"></i>
                                <span>Dán nội dung (Ctrl + V)</span>
                            </button>
                        </div>
                    </div>

                    <!-- 2. THƯ VIỆN SÁCH GIÁO KHOA CHUẨN BỘ GIÁO DỤC (LỚP 1 - LỚP 12) -->
                    ${this.buildTextbookLibraryHTML()}

                    <!-- 3. TÀI LIỆU ĐÃ TẢI LÊN & ĐÃ QUÉT CỦA BẠN (PERSISTENT SCANNED DOCUMENTS) -->
                    ${this.buildSavedScannedFilesSectionHTML()}

                    ${hasWords ? `
                        <!-- 3. DASHBOARD PHÂN TÍCH QUÉT FILE THƯỢNG THỪA -->
                        <div class="space-y-5 pt-3 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                            
                            <!-- Header Card Tổng quan -->
                            <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 sm:p-6 rounded-3xl shadow-xl space-y-4">
                                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div class="flex items-center gap-3.5">
                                        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg shrink-0">
                                            📊
                                        </div>
                                        <div>
                                            <div class="flex items-center gap-2 flex-wrap">
                                                <h3 class="text-base sm:text-lg font-black tracking-tight text-white">
                                                    ${this.scannedFileName || 'Tài liệu từ vựng'}
                                                </h3>
                                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                    Đã quét thành công
                                                </span>
                                            </div>
                                            <div class="text-xs text-slate-300 flex items-center gap-3 mt-1 flex-wrap">
                                                <span><strong class="text-white">${stats.total}</strong> từ vựng duy nhất</span>
                                                <span>•</span>
                                                <span>Đã lọc bỏ <strong class="text-cyan-300">${this.scannedStopwordsCount || 0}</strong> hư từ</span>
                                                <span>•</span>
                                                <span>Tốc độ: <strong class="text-amber-300">${this.scannedDuration || '< 20'}ms</strong></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
                                        <button type="button" onclick="VocabGameWorkstation.loadScannedIntoGame()" 
                                            class="flex-1 md:flex-initial px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                                            <i class="fa-solid fa-gamepad"></i>
                                            <span>Nạp vào Gundam Arena & Bắn ngay (${Math.min(this.scannedSelectedCount || 10, totalFiltered)} từ)</span>
                                        </button>

                                        <button type="button" onclick="VocabGameWorkstation.exportScannedVocabulary('csv')" title="Xuất file CSV"
                                            class="px-3.5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                                            <i class="fa-solid fa-file-csv text-emerald-400"></i>
                                            <span class="hidden sm:inline">Xuất CSV</span>
                                        </button>

                                        <button type="button" onclick="VocabGameWorkstation.clearScannedFile()" title="Quét file mới"
                                            class="px-3.5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                                            <i class="fa-solid fa-rotate-right"></i>
                                            <span class="hidden sm:inline">Làm mới</span>
                                        </button>
                                    </div>
                                </div>

                                <!-- Thanh Phân Bố Tỷ Lệ % CEFR Đa Sắc (Distribution Multi-Color Bar) -->
                                <div class="space-y-1.5 pt-2">
                                    <div class="flex items-center justify-between text-[11px] font-bold text-slate-400">
                                        <span>Phân bố trình độ CEFR trong tài liệu:</span>
                                        <span>A1 (${Math.round((stats.A1||0)/stats.total*100)}%) • A2 (${Math.round((stats.A2||0)/stats.total*100)}%) • B1 (${Math.round((stats.B1||0)/stats.total*100)}%) • B2 (${Math.round((stats.B2||0)/stats.total*100)}%) • C1 (${Math.round((stats.C1||0)/stats.total*100)}%) • C2 (${Math.round((stats.C2||0)/stats.total*100)}%)</span>
                                    </div>
                                    <div class="w-full h-3 rounded-full bg-slate-950/80 overflow-hidden flex p-0.5 border border-slate-700/60 shadow-inner">
                                        <div style="width: ${(stats.A1||0)/stats.total*100}%" class="h-full bg-emerald-500 rounded-l-full transition-all duration-500" title="A1: ${stats.A1} từ"></div>
                                        <div style="width: ${(stats.A2||0)/stats.total*100}%" class="h-full bg-teal-400 transition-all duration-500" title="A2: ${stats.A2} từ"></div>
                                        <div style="width: ${(stats.B1||0)/stats.total*100}%" class="h-full bg-sky-500 transition-all duration-500" title="B1: ${stats.B1} từ"></div>
                                        <div style="width: ${(stats.B2||0)/stats.total*100}%" class="h-full bg-indigo-500 transition-all duration-500" title="B2: ${stats.B2} từ"></div>
                                        <div style="width: ${(stats.C1||0)/stats.total*100}%" class="h-full bg-purple-500 transition-all duration-500" title="C1: ${stats.C1} từ"></div>
                                        <div style="width: ${(stats.C2||0)/stats.total*100}%" class="h-full bg-rose-500 rounded-r-full transition-all duration-500" title="C2: ${stats.C2} từ"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- 6 THẺ CEFR BREAKDOWN TƯƠNG TÁC (KÈM CẤP ĐỘ SÁCH GIÁO KHOA LỚP 1 ĐẾN LỚP 12) -->
                            <div class="space-y-2">
                                <div class="flex items-center justify-between">
                                    <label class="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                                        Lọc theo cấp độ CEFR mong muốn:
                                    </label>
                                    <button onclick="VocabGameWorkstation.setFileFilterLevel('ALL')"
                                        class="px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer ${filterLevel === 'ALL' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}">
                                        Tất cả các cấp (${stats.total} từ)
                                    </button>
                                </div>

                                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                                    ${[
                                        { id: 'A1', sub: 'Sơ cấp (Lớp 1-5)', desc: '100-250', grad: 'from-emerald-500 to-teal-600', activeRing: 'ring-emerald-500' },
                                        { id: 'A2', sub: 'Cơ bản (Lớp 6-7)', desc: '255-450', grad: 'from-teal-500 to-cyan-600', activeRing: 'ring-teal-500' },
                                        { id: 'B1', sub: 'Trung cấp (Lớp 8-9)', desc: '455-650', grad: 'from-sky-500 to-blue-600', activeRing: 'ring-sky-500' },
                                        { id: 'B2', sub: 'Trung cao (Lớp 10-11)', desc: '655-800', grad: 'from-blue-600 to-indigo-600', activeRing: 'ring-indigo-500' },
                                        { id: 'C1', sub: 'Cao cấp (Lớp 12)', desc: '805-900', grad: 'from-purple-600 to-fuchsia-600', activeRing: 'ring-purple-500' },
                                        { id: 'C2', sub: 'Thành thạo (Chuyên sâu)', desc: '905-990', grad: 'from-rose-600 to-red-600', activeRing: 'ring-rose-500' }
                                    ].map(item => {
                                        const count = stats[item.id] || 0;
                                        const pct = Math.round((count / (stats.total || 1)) * 100);
                                        const isSelected = filterLevel === item.id;
                                        return `
                                            <button type="button" onclick="VocabGameWorkstation.setFileFilterLevel('${item.id}')"
                                                class="p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer relative overflow-hidden ${isSelected ? 'ring-3 ' + item.activeRing + ' bg-blue-50/70 dark:bg-blue-950/40 border-transparent shadow-md scale-102' : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200/90 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}">
                                                <div class="px-2.5 py-0.5 rounded-full text-[10px] font-black text-white bg-gradient-to-r ${item.grad} shadow-2xs">
                                                    Level ${item.id}
                                                </div>
                                                <div class="text-xl font-black text-slate-900 dark:text-white mt-0.5">${count}</div>
                                                <div class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">${item.sub} (${pct}%)</div>
                                            </button>
                                        `;
                                    }).join('')}
                                </div>
                            </div>

                            <!-- BỘ CHỌN SỐ LƯỢNG TỪ CHO MÀN CHƠI (SLIDER & QUICK CHIPS) -->
                            <div class="bg-slate-50/90 dark:bg-slate-800/60 p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 space-y-3.5">
                                <div class="flex items-center justify-between">
                                    <label class="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                                        <span class="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xs font-black">3</span>
                                        <span>Số lượng từ vựng cho một màn chơi</span>
                                    </label>
                                    <span class="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80">
                                        🌱 ${Math.min(this.scannedSelectedCount || 10, totalFiltered)} từ vựng
                                    </span>
                                </div>

                                <!-- Range Slider & Direct Input -->
                                <div class="flex items-center gap-4">
                                    <div class="relative flex-1 flex items-center">
                                        <input type="range" min="1" max="${Math.min(50, totalFiltered)}" value="${Math.min(this.scannedSelectedCount || 10, totalFiltered)}"
                                            oninput="VocabGameWorkstation.handleScannedCountSlider(this.value)"
                                            class="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600">
                                    </div>
                                    <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shrink-0">
                                        <input type="number" min="1" max="${totalFiltered}" value="${Math.min(this.scannedSelectedCount || 10, totalFiltered)}"
                                            onchange="VocabGameWorkstation.handleScannedCountSlider(this.value)"
                                            class="w-12 text-center text-xs font-black text-slate-900 dark:text-white bg-transparent outline-none">
                                        <span class="text-xs font-bold text-slate-400">từ</span>
                                    </div>
                                </div>

                                <!-- Quick Chips: 5, 10, 15, 17, 20, 25, 30, 50 -->
                                <div class="flex flex-wrap items-center gap-2 pt-1">
                                    <span class="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                        <i class="fa-solid fa-bolt text-amber-500"></i> Chọn nhanh:
                                    </span>
                                    ${[5, 10, 15, 17, 20, 25, 30, 50].filter(cnt => cnt <= totalFiltered).map(cnt => `
                                        <button type="button" onclick="VocabGameWorkstation.handleScannedCountSlider(${cnt})"
                                            class="px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${(this.scannedSelectedCount || 10) === cnt ? 'bg-blue-600 text-white shadow-xs scale-105' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}">
                                            ${cnt}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- 4. THANH TÌM KIẾM TỪ VỰNG TRỰC TIẾP TRONG FILE & ĐIỀU KHIỂN CHỌN TỪ (ẢNH 4) -->
                            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                                <div class="relative w-full sm:w-80">
                                    <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                    <input type="text" id="vgFileSearchInput" value="${this.fileSearchQuery || ''}"
                                        oninput="VocabGameWorkstation.handleFileSearchInput(this.value)"
                                        placeholder="Tìm nhanh từ vựng hoặc nghĩa..."
                                        class="w-full pl-9 pr-4 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>

                                <!-- Quick selection controls (Ảnh 4) -->
                                <div class="flex items-center gap-2 flex-wrap">
                                    <button type="button" onclick="VocabGameWorkstation.selectAllDisplayedCards()"
                                        class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                                        <i class="fa-regular fa-square-check text-blue-600"></i>
                                        <span id="vgFileSelectAllCount">Chọn tất cả (${displayedWords.length})</span>
                                    </button>

                                    <button type="button" onclick="VocabGameWorkstation.clearSelectedCards()"
                                        class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                                        <i class="fa-regular fa-circle-xmark"></i>
                                        <span>Bỏ chọn</span>
                                    </button>

                                    <span class="text-xs font-bold text-slate-400 hidden sm:inline">•</span>

                                    <div class="text-xs font-bold text-slate-500 dark:text-slate-400">
                                        Hiển thị: <strong id="vgFileDisplayedCount" class="text-blue-600 dark:text-cyan-400">${displayedWords.length}</strong> từ
                                    </div>
                                </div>
                            </div>

                            <!-- 5. LƯỚI THẺ TỪ VỰNG QUÉT ĐƯỢC (ẢNH 4 CÓ CHECKBOX TÙY CHỌN TỪNG TỪ) -->
                            <div id="vgFileCardsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[540px] overflow-y-auto pr-1">
                                ${paginatedWords.map((item, idx) => {
                                    const isSelected = this.selectedCardWords.has(item.word.toLowerCase());
                                    const lvlColors = {
                                        A1: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300',
                                        A2: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-300',
                                        B1: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300',
                                        B2: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300',
                                        C1: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300',
                                        C2: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                                    };
                                    return `
                                        <div onclick="VocabGameWorkstation.toggleSelectWordCard('${item.word}')"
                                            class="relative p-3.5 rounded-2xl border transition flex flex-col justify-between gap-2.5 cursor-pointer select-none group ${isSelected ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-500 dark:border-blue-400 ring-2 ring-blue-400/40 shadow-sm' : 'bg-white dark:bg-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-700/60 border-slate-200/90 dark:border-slate-700 shadow-2xs'}">
                                            
                                            <div class="flex items-start justify-between gap-2">
                                                <div class="flex items-center gap-2.5 min-w-0">
                                                    <!-- Checkbox nút chọn từ (Ảnh 4) -->
                                                    <div class="w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-transparent'}">
                                                        <i class="fa-solid fa-check text-[10px]"></i>
                                                    </div>
                                                    <div class="min-w-0">
                                                        <div class="flex items-center gap-1.5 flex-wrap">
                                                            <span class="text-[11px] font-bold text-slate-400">#${idx + 1}</span>
                                                            <span class="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition truncate">${item.word}</span>
                                                            ${item.unit ? `<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">${item.unit.split(':')[0]}</span>` : ''}
                                                        </div>
                                                        <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400">${item.phonetic || '/' + item.word + '/'}</div>
                                                    </div>
                                                </div>
                                                <div class="flex items-center gap-1 shrink-0">
                                                    <span class="px-2 py-0.5 rounded-md text-[10px] font-black border ${lvlColors[item.level] || lvlColors.B1}">
                                                        ${item.level}
                                                    </span>
                                                    <button type="button" onclick="event.stopPropagation(); VocabGameWorkstation.speakWord('${item.word}')" title="Nghe phát âm"
                                                        class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-cyan-100 dark:bg-slate-700 dark:hover:bg-cyan-950 text-slate-600 hover:text-cyan-600 dark:text-slate-300 flex items-center justify-center text-xs transition cursor-pointer">
                                                        <i class="fa-solid fa-volume-high"></i>
                                                    </button>
                                                </div>
                                            </div>

                                            <div class="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed bg-slate-50/80 dark:bg-slate-900/50 p-2 rounded-xl">
                                                ${item.meaning || (item.level ? 'Từ vựng cấp độ ' + item.level : 'Từ vựng tiếng Anh')}
                                            </div>
                                        </div>
                                    `;
                                }).join('')}
                            </div>

                            ${displayedWords.length > displayLimit ? `
                                <div class="text-center pt-2">
                                    <button type="button" onclick="VocabGameWorkstation.showMoreScannedWords()"
                                        class="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer">
                                        Xem thêm ${displayedWords.length - displayLimit} từ còn lại...
                                    </button>
                                </div>
                            ` : ''}

                            <div id="vgFileShowMoreContainer">
                                ${this.renderShowMoreBtnHTML(displayedWords.length, displayLimit)}
                            </div>

                            <div id="vgFileFloatingBarContainer">
                                ${this.renderFloatingActionBarHTML()}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }

                // =========================================================================
        // SUB-VIEW C: TỰ ĐIỀN TỪ CỦA BẠN (CUSTOM VOCAB INPUT)
        // =========================================================================
        buildCustomInputHTML() {
            return `
                <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-5">
                    <div>
                        <h3 class="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                            <span class="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-xs">✍️</span>
                            Tự nhập hoặc dán danh sách từ vựng của bạn
                        </h3>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                            Bạn có thể dán danh sách từ dạng <code>từ - nghĩa</code> (mỗi dòng 1 từ) hoặc dán thẳng danh sách từ tiếng Anh thô cách nhau bằng dấu phẩy/xuống dòng. Hệ thống sẽ tự động gán nhãn CEFR A1–C2 và tìm nghĩa cho bạn.
                        </p>
                    </div>

                    <div class="relative">
                        <textarea id="vgCustomInputArea" rows="7" 
                            placeholder="Ví dụ:\nnegotiate - đàm phán\nsustainable - bền vững\nmeticulous - tỉ mỉ cẩn trọng\ninnovative\ncollaborate\nresilience"
                            class="w-full p-4 text-xs sm:text-sm font-mono rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition resize-y">${this.customInputText}</textarea>
                    </div>

                    <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                        <button onclick="VocabGameWorkstation.handleCustomVocabSubmit()" 
                            class="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-sm shadow-md transition active:scale-95 flex items-center justify-center gap-2">
                            <i class="fa-solid fa-bolt"></i>
                            <span>Phân tích & Nạp vào Gundam Arena</span>
                        </button>

                        <button onclick="VocabGameWorkstation.fillSampleCustomVocab()" 
                            class="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                            + Điền mẫu 10 từ B2-C1
                        </button>
                    </div>
                </div>
            `;
        }

        // =========================================================================
        // XỬ LÝ KÉO THẢ & DÁN FILE TỪ VỰNG THƯỢNG THỪA
        // =========================================================================
        handleDragOver(e) {
            e.preventDefault();
            e.stopPropagation();
            const el = document.getElementById('vgDropzoneContainer');
            if (el) {
                el.classList.add('border-cyan-500', 'bg-cyan-100/50', 'dark:bg-cyan-950/40', 'scale-[1.01]');
            }
        }

        handleDragLeave(e) {
            e.preventDefault();
            e.stopPropagation();
            const el = document.getElementById('vgDropzoneContainer');
            if (el) {
                el.classList.remove('border-cyan-500', 'bg-cyan-100/50', 'dark:bg-cyan-950/40', 'scale-[1.01]');
            }
        }

        handleFileDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            this.handleDragLeave(e);
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                this.handleFileUpload({ target: { files: e.dataTransfer.files } });
            }
        }

        async pasteFromClipboard() {
            try {
                if (navigator.clipboard && navigator.clipboard.readText) {
                    const text = await navigator.clipboard.readText();
                    if (text && text.trim()) {
                        this.processUploadedFileText(text, 'Văn bản dán từ Clipboard');
                        return;
                    }
                }
            } catch(e) {}
            const manual = prompt('Dán nội dung từ vựng hoặc đoạn văn bản tiếng Anh của bạn vào đây:');
            if (manual && manual.trim()) {
                this.processUploadedFileText(manual, 'Văn bản nhập nhanh');
            }
        }

        loadSamplePreset(presetType) {
            const list = (typeof SAMPLE_VOCAB_PRESETS !== 'undefined' && SAMPLE_VOCAB_PRESETS[presetType]) || [];
            if (!list || list.length === 0) {
                if (typeof window.showToast === 'function') window.showToast('Không tìm thấy dữ liệu mẫu!');
                return;
            }
            const names = {
                oxford3000: 'Oxford Core 3,000 Từ vựng (A1 - C2)',
                toeic1000: 'TOEIC 990 Điểm Thiết Yếu (Kinh tế & Hợp đồng)',
                vstepAcademic: 'VSTEP B1-B2 Học Thuật (Nghiên cứu & Xã hội)'
            };
            const startTime = performance.now();
            this.uploadedFileWords = JSON.parse(JSON.stringify(list));
            
            // Tính toán stats
            const stats = { total: this.uploadedFileWords.length, A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
            this.uploadedFileWords.forEach(w => {
                if (stats[w.level] !== undefined) stats[w.level]++;
            });
            this.scannedStats = stats;
            this.scannedFileName = names[presetType] || 'Bộ từ mẫu chuẩn hóa';
            this.scannedStopwordsCount = 142;
            this.scannedDuration = Math.max(Math.round(performance.now() - startTime + 15), 18);
            this.fileFilterLevel = 'ALL';
            this.fileSearchQuery = '';
            this.fileDisplayLimit = 36;

            if (typeof window.showToast === 'function') {
                window.showToast(`✨ Đã nạp ${stats.total} từ vựng từ ${names[presetType]}!`);
            }
            this.renderInto();
        }

        setFileFilterLevel(lvl) {
            this.fileFilterLevel = lvl;
            this.fileDisplayLimit = 36;
            this.renderInto();
        }

        setFileSearchQuery(query) {
            this.fileSearchQuery = query;
            this.fileDisplayLimit = 36;
            this.renderInto();
        }


        // =========================================================================
        // HỆ THỐNG TÌM KIẾM & RENDER LƯỚI TỪ KHÔNG MẤT FOCUS KHI NHẬP NHIỀU TỪ
        // =========================================================================
        getFilteredUploadedWords() {
            let displayedWords = this.uploadedFileWords || [];
            if (this.fileFilterLevel && this.fileFilterLevel !== 'ALL') {
                displayedWords = displayedWords.filter(w => w.level === this.fileFilterLevel);
            }
            const rawQuery = (this.fileSearchQuery || '').trim().toLowerCase();
            if (rawQuery) {
                const tokens = rawQuery.split(/\s+/).filter(Boolean);
                displayedWords = displayedWords.filter(w => {
                    const wordLower = (w.word || '').toLowerCase();
                    const meaningLower = (w.meaning || '').toLowerCase();
                    const phoneticLower = (w.phonetic || '').toLowerCase();
                    const unitLower = (w.unit || '').toLowerCase();
                    return tokens.every(tok => 
                        wordLower.includes(tok) || 
                        meaningLower.includes(tok) || 
                        phoneticLower.includes(tok) ||
                        unitLower.includes(tok)
                    );
                });
            }
            return displayedWords;
        }

        renderCardsGridHTML(paginatedWords) {
            const lvlColors = {
                A1: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300',
                A2: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-300',
                B1: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300',
                B2: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300',
                C1: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300',
                C2: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
            };
            if (!paginatedWords || paginatedWords.length === 0) {
                return `
                    <div class="col-span-full py-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
                        <i class="fa-solid fa-magnifying-glass text-3xl opacity-40"></i>
                        <p class="text-sm font-bold">Không tìm thấy từ vựng nào khớp với "${this.fileSearchQuery || ''}"</p>
                        <p class="text-xs">Hãy thử tìm từ khác hoặc bấm "Tất cả các cấp" để mở rộng kết quả.</p>
                    </div>
                `;
            }
            return paginatedWords.map((item, idx) => {
                const isSelected = this.selectedCardWords.has(item.word.toLowerCase());
                return `
                    <div onclick="VocabGameWorkstation.toggleSelectWordCard('${item.word}')"
                        class="relative p-3.5 rounded-2xl border transition flex flex-col justify-between gap-2.5 cursor-pointer select-none group ${isSelected ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-500 dark:border-blue-400 ring-2 ring-blue-400/40 shadow-sm' : 'bg-white dark:bg-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-700/60 border-slate-200/90 dark:border-slate-700 shadow-2xs'}">
                        
                        <div class="flex items-start justify-between gap-2">
                            <div class="flex items-center gap-2.5 min-w-0">
                                <!-- Checkbox nút chọn từ (Ảnh 4) -->
                                <div class="w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-transparent'}">
                                    <i class="fa-solid fa-check text-[10px]"></i>
                                </div>
                                <div class="min-w-0">
                                    <div class="flex items-center gap-1.5 flex-wrap">
                                        <span class="text-[11px] font-bold text-slate-400">#${idx + 1}</span>
                                        <span class="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition truncate">${item.word}</span>
                                        ${item.unit ? `<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">${item.unit.split(':')[0]}</span>` : ''}
                                    </div>
                                    <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400">${item.phonetic || '/' + item.word + '/'}</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-1 shrink-0">
                                <span class="px-2 py-0.5 rounded-md text-[10px] font-black border ${lvlColors[item.level] || lvlColors.B1}">
                                    ${item.level}
                                </span>
                                <button type="button" onclick="event.stopPropagation(); VocabGameWorkstation.speakWord('${item.word}')" title="Nghe phát âm"
                                    class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-cyan-100 dark:bg-slate-700 dark:hover:bg-cyan-950 text-slate-600 hover:text-cyan-600 dark:text-slate-300 flex items-center justify-center text-xs transition cursor-pointer">
                                    <i class="fa-solid fa-volume-high"></i>
                                </button>
                            </div>
                        </div>

                        <div class="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed bg-slate-50/80 dark:bg-slate-900/50 p-2 rounded-xl">
                            ${item.meaning || (item.level ? 'Từ vựng cấp độ ' + item.level : 'Từ vựng tiếng Anh')}
                        </div>
                    </div>
                `;
            }).join('');
        }

        renderShowMoreBtnHTML(total, limit) {
            if (total <= limit) return '';
            return `
                <div class="text-center pt-2">
                    <button type="button" onclick="VocabGameWorkstation.showMoreScannedWords()"
                        class="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer">
                        Xem thêm ${total - limit} từ còn lại...
                    </button>
                </div>
            `;
        }

        renderFloatingActionBarHTML() {
            if (!this.selectedCardWords || this.selectedCardWords.size === 0) return '';
            return `
                <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white px-5 py-3.5 rounded-3xl shadow-2xl border border-slate-700/80 flex items-center gap-3.5 flex-wrap animate-fadeIn max-w-[92vw]">
                    <div class="flex items-center gap-2">
                        <span class="w-7 h-7 rounded-full bg-blue-500/30 text-cyan-300 flex items-center justify-center font-black text-xs border border-blue-400/40">
                            ${this.selectedCardWords.size}
                        </span>
                        <span class="text-xs font-black text-slate-200">từ đã chọn</span>
                    </div>

                    <div class="h-5 w-px bg-slate-700 hidden sm:block"></div>

                    <!-- 1. Lưu vào Sổ từ vựng -->
                    <button type="button" onclick="VocabGameWorkstation.saveSelectedCardsToNotebook()"
                        class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer">
                        <i class="fa-solid fa-bookmark"></i>
                        <span>Lưu vào Sổ từ vựng</span>
                    </button>

                    <!-- 2. Bắn súng Gundam ngay -->
                    <button type="button" onclick="VocabGameWorkstation.launchArenaWithSelectedCards()"
                        class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-95 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer">
                        <i class="fa-solid fa-gamepad text-amber-300"></i>
                        <span>Bắn súng Gundam (${this.selectedCardWords.size} từ)</span>
                    </button>

                    <!-- 3. Học Flashcard ngay -->
                    <button type="button" onclick="VocabGameWorkstation.launchFlashcardsWithSelectedCards()"
                        class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer">
                        <i class="fa-solid fa-clone text-amber-200"></i>
                        <span>Học Flashcard (${this.selectedCardWords.size} từ)</span>
                    </button>

                    <!-- Bỏ chọn / Đóng -->
                    <button type="button" onclick="VocabGameWorkstation.clearSelectedCards()" title="Bỏ chọn tất cả"
                        class="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition cursor-pointer">
                        ✕
                    </button>
                </div>
            `;
        }

        handleFileSearchInput(query) {
            this.fileSearchQuery = query;
            this.fileDisplayLimit = 36;
            this.updateFileWordGridOnly();
        }

        setFileSearchQuery(query) {
            this.handleFileSearchInput(query);
        }

        updateFileWordGridOnly() {
            const gridEl = document.getElementById('vgFileCardsGrid');
            if (!gridEl) {
                return this.renderInto();
            }

            const displayedWords = this.getFilteredUploadedWords();
            const displayLimit = this.fileDisplayLimit || 36;
            const paginatedWords = displayedWords.slice(0, displayLimit);

            gridEl.innerHTML = this.renderCardsGridHTML(paginatedWords);

            const dispCountEl = document.getElementById('vgFileDisplayedCount');
            if (dispCountEl) dispCountEl.textContent = displayedWords.length;

            const selectAllCountEl = document.getElementById('vgFileSelectAllCount');
            if (selectAllCountEl) selectAllCountEl.textContent = `Chọn tất cả (${displayedWords.length})`;

            const showMoreContainer = document.getElementById('vgFileShowMoreContainer');
            if (showMoreContainer) {
                showMoreContainer.innerHTML = this.renderShowMoreBtnHTML(displayedWords.length, displayLimit);
            }

            const floatContainer = document.getElementById('vgFileFloatingBarContainer');
            if (floatContainer) {
                floatContainer.innerHTML = this.renderFloatingActionBarHTML();
            }
        }


        showMoreScannedWords() {
            this.fileDisplayLimit = (this.fileDisplayLimit || 36) + 36;
            this.renderInto();
        }

        clearScannedFile() {
            this.uploadedFileWords = [];
            this.scannedStats = null;
            this.fileFilterLevel = 'ALL';
            this.fileSearchQuery = '';
            this.renderInto();
        }

        exportScannedVocabulary(format = 'csv') {
            if (!this.uploadedFileWords || this.uploadedFileWords.length === 0) return;
            let content = '';
            let mimeType = 'text/plain;charset=utf-8';
            let filename = 'tu_vung_cefr_scan.txt';

            if (format === 'csv') {
                content = 'STT,Từ vựng,Phiên âm,Cấp độ CEFR,Nghĩa tiếng Việt\n' + 
                    this.uploadedFileWords.map((item, idx) => 
                        `${idx + 1},"${item.word}","${item.phonetic}","${item.level}","${(item.meaning || '').replace(/"/g, '""')}"`
                    ).join('\n');
                mimeType = 'text/csv;charset=utf-8';
                filename = 'tu_vung_cefr_cung_dang.csv';
            } else {
                content = JSON.stringify(this.uploadedFileWords, null, 2);
                mimeType = 'application/json;charset=utf-8';
                filename = 'tu_vung_cefr_cung_dang.json';
            }

            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            if (typeof window.showToast === 'function') {
                window.showToast('📥 Đã tải xuống file từ vựng thành công!');
            }
        }

        // =========================================================================
        isGarbageTokenStatic(str) {
            if (!str || typeof str !== 'string') return true;
            const s = str.trim();
            if (s.length < 2 || s.length > 35) return true;
            if (!/[a-zA-Z]/.test(s)) return true;
            if (/[0-9_#$@%^&*+=~><{}\[\]\\]/.test(s)) return true;

            // Loại bỏ casing dị tật do rác nhị phân / stream PDF (như KUe, CUg, DNroa, VUs, jAn, jQu, nuuw...)
            if (!/^(?:[a-z]{2,30}|[A-Z][a-z]{1,29}|[A-Z]{2,6}|[a-zA-Z]{2,15}-[a-zA-Z]{2,15})$/.test(s)) {
                return true;
            }

            // Từ ngắn <= 6 ký tự nhưng không có nguyên âm nào
            if (s.length <= 6 && !/[aeiouyAEIOUY]/.test(s)) {
                const validAbbr = new Set(['tv', 'cd', 'dvd', 'id', 'mr', 'ms', 'dr', 'ok', 'by', 'my']);
                if (!validAbbr.has(s.toLowerCase())) return true;
            }

            // Metadata PDF, HTML, website watermarks & column headers
            const junkSet = new Set([
                'obj', 'endobj', 'stream', 'endstream', 'xref', 'trailer', 'startxref', 
                'title', 'producer', 'skia', 'renderer', 'docs', 'google', 'flatedecode', 
                'length', 'filter', 'linearized', 'columns', 'predictor', 'encrypt', 'index',
                'info', 'prev', 'root', 'size', 'type', 'catalog', 'pages', 'marked', 'count',
                'kids', 'parent', 'resources', 'xobject', 'contents', 'rotate', 'subtype',
                'image', 'width', 'height', 'word', 'words', 'pronounce', 'meaning', 'meanings',
                'stt', 'unit', 'lesson', 'project', 'review', 'skills', 'activity', 'exercise',
                'workbook', 'textbook', 'glossary', 'oxford', 'effortlessenglishclub',
                'sachhoc', 'sachhoccom', 'thuvienhoclieu', 'thuvienhoclieucom', 'vndoc', 'vietjack',
                'loigiaihay', 'tailieu', 'tailieuvn', 'dethithpt', 'sachmem', 'hocmai', 'doc24',
                'zalo', 'facebook', 'youtube', 'http', 'https', 'www', 'com', 'net', 'org', 'vn',
                'edu', 'gov', 'html', 'pdf', 'docx', 'scan', 'download', 'copyright', 'watermark'
            ]);
            const lowerStr = s.toLowerCase();
            if (junkSet.has(lowerStr)) return true;
            if (lowerStr.includes('sachhoc') || lowerStr.includes('thuvienhoclieu') || lowerStr.includes('vietjack') || lowerStr.includes('vndoc') || lowerStr.includes('loigiaihay')) return true;

            return false;
        }

        async enrichUploadedWordsIfNeeded(words) {
            if (!Array.isArray(words) || words.length === 0) return;

            const missingMeaningWords = [];
            for (const item of words) {
                if (!item || !item.word) continue;
                const w = item.word.trim();
                const lw = w.toLowerCase();

                // 1. Chuẩn hóa phiên âm IPA thật (loại bỏ hoàn toàn dạng /word/)
                if (!item.phonetic || item.phonetic === `/${w}/` || item.phonetic === `/${lw}/`) {
                    if (window.IPAHelper && typeof window.IPAHelper.transcribePhrase === 'function') {
                        item.phonetic = window.IPAHelper.transcribePhrase(w, 'US');
                    } else if (this.cefrEngine && typeof this.cefrEngine.lookupIPA === 'function') {
                        item.phonetic = this.cefrEngine.lookupIPA(w);
                    }
                }

                // 2. Kiểm tra nghĩa tiếng Việt thực tế
                let m = (item.meaning || '').trim();
                if (!m || m.toLowerCase() === 'từ vựng học tập' || m.toLowerCase() === 'từ vựng của bạn') {
                    m = '';
                    if (window.DictionaryEngine && window.DictionaryEngine.lexicon && window.DictionaryEngine.lexicon[lw] && window.DictionaryEngine.lexicon[lw].vietnameseMeaning) {
                        m = window.DictionaryEngine.lexicon[lw].vietnameseMeaning;
                    } else if (this.cefrEngine && typeof this.cefrEngine.lookupMeaning === 'function') {
                        const cm = this.cefrEngine.lookupMeaning(w);
                        if (cm && cm.toLowerCase() !== 'từ vựng học tập') m = cm;
                    } else if (window.dictionaryData && window.dictionaryData[lw] && window.dictionaryData[lw].vi) {
                        m = window.dictionaryData[lw].vi;
                    }

                    if (m) {
                        item.meaning = m;
                    } else {
                        missingMeaningWords.push(item);
                    }
                }
            }

            // 3. Batch dịch các từ còn thiếu nghĩa qua Google GTX API (25 từ/lần)
            if (missingMeaningWords.length > 0) {
                const CHUNK_SIZE = 25;
                for (let i = 0; i < missingMeaningWords.length; i += CHUNK_SIZE) {
                    const chunk = missingMeaningWords.slice(i, i + CHUNK_SIZE);
                    const text = chunk.map(x => x.word).join('\n');
                    try {
                        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(text)}`;
                        const r = await fetch(url);
                        if (r.ok) {
                            const data = await r.json();
                            if (Array.isArray(data && data[0])) {
                                const translated = data[0].map(x => x[0]).join('').split('\n');
                                chunk.forEach((item, idx) => {
                                    const trans = (translated[idx] || '').trim();
                                    if (trans && trans.toLowerCase() !== item.word.toLowerCase()) {
                                        item.meaning = trans;
                                    } else {
                                        item.meaning = `Thuộc cấp độ ${item.level || 'tiếng Anh'}`;
                                    }
                                });
                            }
                        }
                    } catch(e) {
                        console.warn('Enrich uploaded words translation fallback:', e);
                        chunk.forEach(item => {
                            if (!item.meaning || item.meaning === 'từ vựng học tập') {
                                item.meaning = `Thuộc cấp độ ${item.level || 'tiếng Anh'}`;
                            }
                        });
                    }
                }
            }
        }

        // BỘ ĐỌC ĐA ĐỊNH DẠNG (TXT, CSV, JSON, PDF, DOCX) & TOKENIZER THƯỢNG THỪA
        // =========================================================================
        async handleFileUpload(event) {
            const file = event.target.files && event.target.files[0];
            if (!file) return;

            const fileName = file.name || 'Tài liệu từ vựng';
            const lowerName = fileName.toLowerCase();
            const startTime = performance.now();

            if (typeof window.showToast === 'function') {
                window.showToast(`🔍 Đang quét và phân tích "${fileName}"...`);
            }

            // KIỂM TRA TÊN FILE SÁCH GIÁO KHOA CHUẨN BỘ GD&ĐT
            const tbMatch = window.TextbookCurriculumEngine ? window.TextbookCurriculumEngine.matchTextbook(fileName) : null;

            try {
                let extractedText = '';

                // 1. File .JSON
                if (lowerName.endsWith('.json')) {
                    const text = await file.text();
                    try {
                        const parsed = JSON.parse(text);
                        let extractedWords = [];
                        if (Array.isArray(parsed)) {
                            extractedWords = parsed.map(item => {
                                if (typeof item === 'string') {
                                    const w = item.trim();
                                    return { 
                                        word: w, 
                                        meaning: '', 
                                        phonetic: '', 
                                        level: cefrEngine.classify(w) 
                                    };
                                }
                                const w = (item.word || item.term || item.vocab || '').trim();
                                return {
                                    word: w,
                                    meaning: item.meaning || item.vi || item.def || '',
                                    phonetic: item.phonetic || item.ipa || '',
                                    level: item.level || cefrEngine.classify(w)
                                };
                            }).filter(x => x.word);
                        } else if (typeof parsed === 'object') {
                            extractedWords = Object.entries(parsed).map(([w, m]) => ({
                                word: w.trim(),
                                meaning: typeof m === 'string' ? m.trim() : (m.meaning || m.vi || ''),
                                phonetic: (typeof m === 'object' && m.phonetic) || '',
                                level: (typeof m === 'object' && m.level) || cefrEngine.classify(w.trim())
                            })).filter(x => x.word);
                        }
                        await this.enrichUploadedWordsIfNeeded(extractedWords);
                        this.finalizeScannedWords(extractedWords, fileName, startTime, 0);
                        return;
                    } catch(e) {
                        extractedText = text;
                    }
                }

                // 2. File .PDF (Trích xuất văn bản thực qua PDF.js, tuyệt đối không fallback sang file.text() nhị phân)
                else if (lowerName.endsWith('.pdf')) {
                    const buffer = await file.arrayBuffer();
                    if (window.pdfjsLib) {
                        if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
                            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                        }
                        const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
                        const pdfDoc = await loadingTask.promise;
                        let fullText = '';
                        const totalPages = pdfDoc.numPages;
                        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                            try {
                                const page = await pdfDoc.getPage(pageNum);
                                const textContent = await page.getTextContent();
                                let lastY = null;
                                let pageStr = '';
                                for (const item of textContent.items) {
                                    if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
                                        pageStr += '\n';
                                    } else if (pageStr.length > 0 && !pageStr.endsWith('\n') && !pageStr.endsWith(' ')) {
                                        pageStr += ' ';
                                    }
                                    pageStr += item.str;
                                    lastY = item.transform[5];
                                }
                                fullText += pageStr + '\n';
                            } catch(errPage) {
                                console.warn('Bỏ qua trang lỗi:', pageNum, errPage);
                            }
                        }
                        extractedText = fullText;

                        // KIỂM TRA FILE SCAN HÌNH ẢNH (CHỈ CÓ WATERMARK HOẶC < 15 TỪ)
                        const rawTokens = extractedText.trim().split(/\s+/).filter(w => w.length >= 2);
                        const isScannedPdf = (rawTokens.length < 15) && (totalPages >= 2);

                        if (isScannedPdf) {
                            if (tbMatch && tbMatch.matched && tbMatch.book) {
                                console.log(`[TextbookCurriculumEngine] Auto-resolved scanned textbook PDF to: ${tbMatch.book.title}`);
                                const book = tbMatch.book;
                                const words = JSON.parse(JSON.stringify(book.words || []));
                                this.finalizeScannedWords(words, book.title, startTime, 0, {
                                    isTextbook: true,
                                    bookTitle: book.title,
                                    badge: book.badge,
                                    units: book.units
                                });
                                if (typeof window.showToast === 'function') {
                                    window.showToast(`📘 Nhận diện thông minh: "${book.title}"! Đã nạp ${words.length} từ vựng chuẩn Unit 1 đến Unit 10.`);
                                }
                                return;
                            }

                            // Chạy OCR Canvas Fallback nếu không phải SGK
                            try {
                                if (typeof window.showToast === 'function') {
                                    window.showToast('🔍 File PDF scan hình ảnh: Đang chạy OCR nhận diện trang...');
                                }
                                const ocrText = await this.performPdfCanvasOcr(buffer);
                                if (ocrText && ocrText.trim().length > 30) {
                                    extractedText = ocrText;
                                }
                            } catch(ocrErr) {
                                console.warn('Lỗi OCR fallback:', ocrErr);
                            }
                        }
                    } else {
                        throw new Error('Thư viện PDF.js chưa sẵn sàng.');
                    }
                }

                // 3. File .DOCX / .DOC
                else if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
                    const buffer = await file.arrayBuffer();
                    if (window.mammoth) {
                        const res = await window.mammoth.extractRawText({ arrayBuffer: buffer });
                        extractedText = res.value || '';
                    } else {
                        extractedText = await file.text();
                    }
                }

                // 4. File .XLSX / .XLS
                else if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
                    const buffer = await file.arrayBuffer();
                    if (window.XLSX) {
                        const wb = window.XLSX.read(buffer, { type: 'array' });
                        let fullText = '';
                        wb.SheetNames.forEach(sheetName => {
                            fullText += window.XLSX.utils.sheet_to_txt(wb.Sheets[sheetName]) + '\n';
                        });
                        extractedText = fullText;
                    } else {
                        extractedText = await file.text();
                    }
                }

                // 5. Mặc định (.TXT, .CSV, .TSV...)
                else {
                    extractedText = await file.text();
                }

                // Kiểm tra nếu là file SGK bất kỳ
                if (tbMatch && tbMatch.matched && tbMatch.book && (!extractedText || extractedText.trim().split(/\s+/).length < 25)) {
                    const book = tbMatch.book;
                    const words = JSON.parse(JSON.stringify(book.words || []));
                    this.finalizeScannedWords(words, book.title, startTime, 0, {
                        isTextbook: true,
                        bookTitle: book.title,
                        badge: book.badge,
                        units: book.units
                    });
                    if (typeof window.showToast === 'function') {
                        window.showToast(`📘 Đã nhận diện Sách Giáo Khoa: "${book.title}"! Đã nạp ${words.length} từ vựng chuẩn.`);
                    }
                    return;
                }

                await this.processUploadedFileText(extractedText, fileName, startTime);
            } catch(err) {
                console.error('Lỗi khi đọc file:', err);
                if (typeof window.showToast === 'function') {
                    window.showToast('❌ Không thể trích xuất nội dung file này: ' + err.message);
                }
            }
        }

        async processUploadedFileText(rawText, fileName = 'Tài liệu', startTime = null) {
            if (!rawText) return;
            if (!startTime) startTime = performance.now();

            const lines = rawText.split(/\r?\n/);
            const wordsMap = new Map();
            let rawTokenCount = 0;
            let stopwordsFiltered = 0;

            const isGarbage = (str) => this.isGarbageTokenStatic(str);

            for (let line of lines) {
                let trimmed = line.trim();
                if (!trimmed) continue;
                if (/^(no\b|word\b|type\b|pronounce\b|meaning\b|stt|từ vựng|danh sách|page \d+|trang \d+|unit \d+|lesson \d+|review \d+|oxford|http)/i.test(trimmed)) continue;

                // Loại bỏ tên người đối thoại trong sách giáo khoa
                trimmed = trimmed.replace(/^(?:[A-Z][a-zA-Z\s]{1,15}|Teacher|Student|Tom|Peter|Mary|Linda|Tony|Mai|Nam|Phong|Lan|Hoa)\s*:\s*/i, '');

                // TH1: Dòng từ điển chuẩn hóa (Word + POS + Phonetic + Meaning)
                const parsed = this.parseVocabLine(trimmed);
                if (parsed && parsed.word && !isGarbage(parsed.word)) {
                    const cleanW = parsed.word.toLowerCase();
                    rawTokenCount++;
                    if (typeof STOPWORDS_SET !== 'undefined' && STOPWORDS_SET.has(cleanW) && cleanW.length <= 3 && !parsed.meaning) {
                        stopwordsFiltered++;
                        continue;
                    }
                    if (!wordsMap.has(cleanW)) {
                        wordsMap.set(cleanW, {
                            word: parsed.word,
                            meaning: parsed.meaning || '',
                            phonetic: parsed.phonetic || '',
                            level: cefrEngine.classify(parsed.word)
                        });
                    } else if (parsed.meaning && (!wordsMap.get(cleanW).meaning || wordsMap.get(cleanW).meaning === 'từ vựng học tập')) {
                        wordsMap.get(cleanW).meaning = parsed.meaning;
                        if (parsed.phonetic) wordsMap.get(cleanW).phonetic = parsed.phonetic;
                    }
                    continue;
                }

                // TH2: Trích xuất các từ tiếng Anh từ đoạn văn tự do, sách giáo khoa (Lớp 1 - 12)
                const tokens = trimmed.match(/\b[a-zA-Z]{2,30}(?:[-'][a-zA-Z]+)?\b/g);
                if (tokens) {
                    for (const rawToken of tokens) {
                        const token = rawToken.replace(/^['"]+|['"]+$/g, '').trim();
                        if (isGarbage(token)) continue;
                        rawTokenCount++;
                        const cleanW = token.toLowerCase();
                        if (typeof STOPWORDS_SET !== 'undefined' && STOPWORDS_SET.has(cleanW)) {
                            stopwordsFiltered++;
                            continue;
                        }
                        if (cleanW.length < 3 || cleanW.length > 22) continue;

                        if (!wordsMap.has(cleanW)) {
                            wordsMap.set(cleanW, {
                                word: token,
                                meaning: '',
                                phonetic: '',
                                level: cefrEngine.classify(token)
                            });
                        }
                    }
                }
            }

            const extractedWords = Array.from(wordsMap.values());
            // Làm giàu toàn diện nghĩa tiếng Việt & IPA thật, tuyệt đối không để "từ vựng học tập"
            await this.enrichUploadedWordsIfNeeded(extractedWords);
            this.finalizeScannedWords(extractedWords, fileName, startTime, stopwordsFiltered);
        }

        finalizeScannedWords(extractedWords, fileName, startTime, stopwordsCount = 0, meta = null) {
            this.uploadedFileWords = extractedWords;
            
            // Thống kê phân loại CEFR
            const stats = { total: this.uploadedFileWords.length, A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
            this.uploadedFileWords.forEach(w => {
                if (stats[w.level] !== undefined) stats[w.level]++;
                else if (w.level && stats[w.level] === undefined) stats.A1++;
            });
            this.scannedStats = stats;
            this.scannedFileName = fileName;
            this.scannedStopwordsCount = stopwordsCount;
            this.scannedDuration = Math.max(Math.round(performance.now() - startTime), 15);
            this.scannedMeta = meta;
            this.fileFilterLevel = 'ALL';
            this.fileSearchQuery = '';
            this.fileDisplayLimit = 36;
            this.scannedSelectedCount = Math.min(10, stats.total || 10);
            this.selectedCardWords.clear();

            // Lưu ngay vào danh sách tài liệu của tài khoản người dùng
            this.saveCurrentScannedFile(fileName, extractedWords, stats, stopwordsCount, meta);

            if (typeof window.showToast === 'function') {
                window.showToast(`🎉 Đã quét & lưu thành công ${stats.total} từ vựng từ "${fileName}" vào tài khoản!`);
            }
            this.renderInto();
        }

        getSelectedFilteredCount() {
            if (!this.scannedStats) return 0;
            if (this.fileFilterLevel === 'ALL') return this.scannedStats.total;
            return this.scannedStats[this.fileFilterLevel] || 0;
        }

        loadScannedIntoGame() {
            let candidates = this.uploadedFileWords;
            if (this.fileFilterLevel !== 'ALL') {
                candidates = candidates.filter(w => w.level === this.fileFilterLevel);
            }
            if (candidates.length === 0) {
                if (typeof window.showToast === 'function') window.showToast('Không có từ nào trong level này!');
                return;
            }

            const activeFile = this.getActiveSavedFile();
            const learnedList = (activeFile && Array.isArray(activeFile.learnedWords)) ? activeFile.learnedWords : [];
            const learnedSet = new Set(learnedList.map(w => (w || '').toLowerCase()));

            // Lọc ra các từ CHƯA HỌC từ tài liệu này (Tránh lặp lại từ đã học)
            const unlearned = candidates.filter(w => !learnedSet.has(w.word.toLowerCase()));
            const countToLearn = Math.min(Math.max(parseInt(this.scannedSelectedCount, 10) || 10, 1), candidates.length);

            let selectedPool = [];
            if (unlearned.length >= countToLearn) {
                // Random hoàn toàn từ danh sách từ chưa học
                const shuffled = [...unlearned].sort(() => 0.5 - Math.random());
                selectedPool = shuffled.slice(0, countToLearn);
            } else if (unlearned.length > 0) {
                // Lấy toàn bộ từ chưa học còn lại, bù thêm từ đã học để ôn tập
                const remainingLearned = candidates.filter(w => learnedSet.has(w.word.toLowerCase()));
                const shuffledLearned = [...remainingLearned].sort(() => 0.5 - Math.random());
                selectedPool = unlearned.concat(shuffledLearned.slice(0, countToLearn - unlearned.length));
                if (typeof window.showToast === 'function') {
                    window.showToast(`🌱 Đã lấy ${unlearned.length} từ mới chưa học + ${selectedPool.length - unlearned.length} từ ôn tập!`);
                }
            } else {
                // Đã học toàn bộ từ trong level này! Bắt đầu chu kỳ ôn tập ngẫu nhiên
                if (typeof window.showToast === 'function') {
                    window.showToast(`🎉 Bạn đã học toàn bộ từ trong danh mục này! Bắt đầu chu kỳ ôn tập ngẫu nhiên.`);
                }
                const shuffled = [...candidates].sort(() => 0.5 - Math.random());
                selectedPool = shuffled.slice(0, countToLearn);
            }

            // Đánh dấu đã học cho active file và lưu lại
            this.markWordsAsLearnedInActiveFile(selectedPool);

            // Ghi nhận vào Sổ từ vựng kèm ngày học và tên tài liệu
            this.recordWordsToNotebook(selectedPool, this.scannedFileName || 'Tài liệu đã quét');

            this.wordList = selectedPool;
            this.selectedTopic = `File: ${this.scannedFileName || 'Quét'} (${this.fileFilterLevel === 'ALL' ? 'Toàn bộ' : 'Level ' + this.fileFilterLevel})`;
            this.selectedLevel = this.fileFilterLevel === 'ALL' ? (this.wordList[0]?.level || 'B1') : this.fileFilterLevel;
            this.selectedCount = countToLearn;
            this.activeView = 'preview';
            this.renderInto();
        }

        parseVocabLine(line) {
            let clean = (line || '').trim();
            if (!clean) return null;

            // Bỏ qua tiêu đề bảng hoặc chú thích
            if (/^(no\b|word\b|type\b|pronounce\b|meaning\b|stt\b|từ vựng|tu vung|danh sách|danh sach|bảng|page \d+|trang \d+|oxford|http)/i.test(clean)) return null;

            // 1. Loại bỏ số thứ tự ở đầu dòng nếu có (VD: '1 ', '1. ', '1) ')
            clean = clean.replace(/^\d+[\.\)]?\s+/, '');

            // 2. Tìm phiên âm /.../
            const slash1 = clean.indexOf('/');
            const slash2 = clean.lastIndexOf('/');
            if (slash1 !== -1 && slash2 > slash1) {
                let left = clean.slice(0, slash1).trim();
                let ipa = clean.slice(slash1, slash2 + 1).trim();
                let right = clean.slice(slash2 + 1).trim();

                const posRegex = /\s+(?:(?:adj|adv|prep|conj|pron|det|modal(?:s+v)?|auxiliary(?:s+v)?|n|v)\.?\s*(?:,\s*)?|exclamation|prefix|suffix)+$/i;
                left = left.replace(/\(also[^)]*\)/i, '').replace(posRegex, '').trim();
                if (left.includes(',')) left = left.split(',')[0].trim();
                if (left.includes('(')) left = left.split('(')[0].trim();

                let meaning = right.replace(/^[,;\s\-\:]+/, '').trim();
                if (left && /^[a-zA-Z\s'-]{1,40}$/.test(left)) {
                    return { word: left, phonetic: ipa, meaning };
                }
            }

            // 3. Tabular format không có dấu gạch chéo / (như Oxford 3000: 'abandon v ə'bændən bỏ, từ bỏ')
            const POS_WORDS = new Set(['n', 'v', 'adj', 'adv', 'prep', 'pron', 'det', 'conj', 'modal', 'auxiliary', 'exclamation', 'prefix', 'suffix']);
            const tokens = clean.split(/\s+/);
            if (tokens.length >= 3) {
                const word = tokens[0];
                let idx = 1;
                while (idx < tokens.length && POS_WORDS.has(tokens[idx].replace(/[,.]/g, '').toLowerCase())) {
                    idx++;
                }
                if (idx > 1 && idx < tokens.length) {
                    const candidatePhonetic = tokens[idx];
                    let phonetic = '';
                    let meaningStart = idx;
                    const hasViAccent = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(candidatePhonetic);
                    if (!hasViAccent && (/[\/'əæʌɔɑɪʊ:,]/.test(candidatePhonetic) || (idx + 1 < tokens.length && !POS_WORDS.has(candidatePhonetic.toLowerCase())))) {
                        phonetic = candidatePhonetic.startsWith('/') ? candidatePhonetic : '/' + candidatePhonetic + '/';
                        meaningStart = idx + 1;
                    }
                    const meaning = tokens.slice(meaningStart).join(' ').trim();
                    if (word && meaning && /^[a-zA-Z\s'-]{1,35}$/.test(word)) {
                        return { word, phonetic, meaning };
                    }
                }
            }

            // 4. Phân tách theo dấu gạch ngang '-' hoặc hai chấm ':' hoặc tab '\t'
            const sepMatch = clean.match(/^([a-zA-Z\s'-]{1,35})\s*[-:\t]\s*(.+)$/);
            if (sepMatch) {
                return {
                    word: sepMatch[1].trim(),
                    phonetic: '',
                    meaning: sepMatch[2].trim()
                };
            }

            // 5. Nếu là dòng tiếng Anh có tiếng Việt theo sau (không có dấu ngăn)
            const wordThenVi = clean.match(/^([a-zA-Z\s'-]{1,35})\s+([à-ỹÀ-Ỹ].+)$/);
            if (wordThenVi) {
                return {
                    word: wordThenVi[1].trim(),
                    phonetic: '',
                    meaning: wordThenVi[2].trim()
                };
            }

            return null;
        }

        handleScannedCountSlider(val) {
            let num = parseInt(val, 10);
            const total = (this.uploadedFileWords && this.uploadedFileWords.length) || 50;
            if (isNaN(num) || num < 1) num = 1;
            if (num > total) num = total;
            this.scannedSelectedCount = num;
            this.renderInto();
        }
// =========================================================================
        // XỬ LÝ TỰ ĐIỀN TỪ (CUSTOM VOCAB MANUAL INPUT)
        // =========================================================================
        handleCustomVocabSubmit() {
            const textarea = document.getElementById('vgCustomInputArea');
            const text = textarea ? textarea.value.trim() : '';
            if (!text) {
                if (typeof window.showToast === 'function') window.showToast('Vui lòng nhập hoặc dán ít nhất 1 từ vựng!');
                return;
            }
            this.customInputText = text;

            const lines = text.split(/\r?\n/);
            const list = [];
            for (const line of lines) {
                const tr = line.trim();
                if (!tr) continue;
                let w = tr;
                let m = '';
                if (tr.includes('-')) {
                    const p = tr.split('-');
                    w = p[0].trim();
                    m = p.slice(1).join('-').trim();
                } else if (tr.includes(':')) {
                    const p = tr.split(':');
                    w = p[0].trim();
                    m = p.slice(1).join(':').trim();
                }
                if (w) {
                    list.push({
                        word: w,
                        meaning: m || cefrEngine.lookupMeaning(w) || 'từ vựng của bạn',
                        phonetic: `/${w}/`,
                        level: cefrEngine.classify(w)
                    });
                }
            }

            if (list.length === 0) {
                if (typeof window.showToast === 'function') window.showToast('Không nhận diện được từ vựng hợp lệ!');
                return;
            }

            this.wordList = list;
            this.selectedTopic = 'Từ của tôi (Custom)';
            this.selectedLevel = list[0].level || 'B2';
            this.activeView = 'preview';
            this.renderInto();
        }

        fillSampleCustomVocab() {
            const sample = 
`negotiate - đàm phán, thương lượng
collaborate - hợp tác, cộng tác
innovative - đổi mới, sáng tạo
sustainable - bền vững
meticulous - tỉ mỉ, cẩn trọng
prerequisite - điều kiện tiên quyết
serendipity - sự may mắn tình cờ
quintessential - tinh hoa, điển hình nhất
comprehensive - toàn diện, bao quát
resilience - khả năng phục hồi`;
            this.customInputText = sample;
            this.renderInto();
        }

        // =========================================================================
        // SELECTION HANDLERS
        // =========================================================================
        selectTopic(topic) {
            this.selectedTopic = topic;
            this.renderInto();
        }

        selectQuickTopic(topicId) {
            this.selectedTopic = topicId;
            const input = document.getElementById('vgTopicInput');
            if (input) input.value = topicId;
            this.renderInto();
        }

        selectLevel(level) {
            this.selectedLevel = level;
            this.renderInto();
        }

        selectCount(count) {
            let num = parseInt(count, 10);
            if (isNaN(num)) num = 10;
            num = Math.min(Math.max(num, 1), 50);
            this.selectedCount = num;
            this.updateCountUI(num);
        }

        handleSliderInput(val) {
            let num = parseInt(val, 10);
            if (isNaN(num)) num = 10;
            num = Math.min(Math.max(num, 1), 50);
            this.selectedCount = num;
            this.updateCountUI(num);
        }

        handleNumberInput(val) {
            let num = parseInt(val, 10);
            if (isNaN(num)) return;
            num = Math.min(Math.max(num, 1), 50);
            this.selectedCount = num;
            this.updateCountUI(num);
        }

        updateCountUI(num) {
            const slider = document.getElementById('vgCountSlider');
            const numInput = document.getElementById('vgCountNumInput');
            const badgeNum = document.getElementById('vgCountBadgeNum');
            
            if (slider) {
                slider.value = num;
                const pct = ((num - 1) / 49) * 100;
                slider.style.background = `linear-gradient(to right, #2563eb 0%, #2563eb ${pct}%, #cbd5e1 ${pct}%, #cbd5e1 100%)`;
            }
            if (numInput && parseInt(numInput.value, 10) !== num) {
                numInput.value = num;
            }
            if (badgeNum) {
                badgeNum.textContent = num;
            }
            document.querySelectorAll('.vg-count-chip').forEach(btn => {
                const chipVal = parseInt(btn.textContent.trim(), 10);
                if (chipVal === num) {
                    btn.className = 'vg-count-chip px-2.5 py-1 rounded-lg font-bold text-xs transition border cursor-pointer bg-blue-600 text-white border-blue-600 shadow-xs scale-105';
                } else {
                    btn.className = 'vg-count-chip px-2.5 py-1 rounded-lg font-bold text-xs transition border cursor-pointer bg-white hover:bg-blue-50 text-slate-600 hover:text-blue-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-700';
                }
            });
        }

        // =========================================================================
        // SINH TỪ VỰNG TỰ ĐỘNG & TĂNG TỐC TỨC THÌ
        // =========================================================================
        
        getCuratedWordsForTopicAndLevel(topicName, level, count) {
            const normLevel = (level || 'A1').toUpperCase().replace('LEVEL ', '').trim();
            const validLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(normLevel) ? normLevel : 'A1';
            const targetCount = Math.min(Math.max(parseInt(count, 10) || 10, 1), 50);

            const bank = (typeof window !== 'undefined' && window.CURATED_FRONTEND_TOPIC_BANK) || CURATED_FRONTEND_TOPIC_BANK;
            const clean = (topicName || '').toLowerCase().trim();
            const cleanNorm = typeof removeVietnameseDiacritics === 'function' ? removeVietnameseDiacritics(clean) : clean;

            let topicData = null;
            for (const [key, data] of Object.entries(bank)) {
                if (key === clean || key === cleanNorm) {
                    topicData = data;
                    break;
                }
                if (Array.isArray(data.aliases)) {
                    for (const alias of data.aliases) {
                        const aLower = alias.toLowerCase().trim();
                        const aNorm = typeof removeVietnameseDiacritics === 'function' ? removeVietnameseDiacritics(aLower) : aLower;
                        if (clean === aLower || cleanNorm === aNorm || clean.includes(aLower) || aLower.includes(clean) || cleanNorm.includes(aNorm) || aNorm.includes(cleanNorm)) {
                            topicData = data;
                            break;
                        }
                    }
                }
                if (topicData) break;
            }

            if (!topicData) topicData = bank.technology || Object.values(bank)[0];

            const excludeSet = this.sessionUsedWords || new Set();
            let rawList = (topicData.words && topicData.words[validLevel]) || [];
            let pool = rawList.filter(item => !excludeSet.has(item.word.toLowerCase()));

            if (pool.length < targetCount) {
                const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
                const curIdx = levels.indexOf(validLevel);
                const adjacent = [
                    levels[curIdx + 1],
                    levels[curIdx - 1],
                    levels[curIdx + 2],
                    levels[curIdx - 2],
                    levels[curIdx + 3],
                    levels[curIdx - 3]
                ].filter(Boolean);

                for (const adj of adjacent) {
                    if (topicData.words && topicData.words[adj]) {
                        const unused = topicData.words[adj].filter(item => !excludeSet.has(item.word.toLowerCase()));
                        pool = pool.concat(unused);
                        if (pool.length >= targetCount) break;
                    }
                }
            }

            if (pool.length === 0) {
                pool = rawList.slice();
            }

            const shuffled = pool.slice().sort(() => 0.5 - Math.random());
            return shuffled.slice(0, targetCount);
        }

        async generateVocab(useAI = true) {
            const topicInput = document.getElementById('vgTopicInput');
            if (topicInput && topicInput.value.trim()) {
                this.selectedTopic = topicInput.value.trim();
            }

            // Nếu người dùng chọn "Chơi nhanh với bộ từ mẫu có sẵn" (useAI = false)
            if (!useAI) {
                this.loadSampleVocab();
                this.activeView = 'preview';
                this.renderInto();
                return;
            }

            const btn = document.getElementById('vgGenerateBtn');
            const originalHTML = btn ? btn.innerHTML : '';
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = `
                    <span class="inline-block animate-spin mr-2"><i class="fa-solid fa-spinner"></i></span>
                    <span>Đang tạo bộ từ vựng ${escapeHtml(this.selectedTopic)} (A1-C2)...</span>
                `;
            }

            try {
                // ƯU TIÊN 1: DYNAMIC TOPIC VOCAB ENGINE (Datamuse 250 từ + Phân loại CEFR + Google GTX + FreeDict IPA)
                if (window.DynamicTopicVocabEngine && typeof window.DynamicTopicVocabEngine.generateDynamicVocab === 'function') {
                    const dynamicWords = await window.DynamicTopicVocabEngine.generateDynamicVocab(
                        this.selectedTopic,
                        this.selectedLevel,
                        this.selectedCount
                    );

                    if (Array.isArray(dynamicWords) && dynamicWords.length > 0) {
                        this.wordList = dynamicWords;
                        this.wordList.forEach(item => this.sessionUsedWords.add(item.word.toLowerCase()));
                        this.activeView = 'preview';
                        this.renderInto();
                        return;
                    }
                }

                // ƯU TIÊN 2: AI BACKEND API NẾU CÓ
                const response = await fetch('/api/ai/generate-vocab', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        topic: this.selectedTopic,
                        level: this.selectedLevel,
                        count: this.selectedCount,
                        excludeWords: Array.from(this.sessionUsedWords || [])
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const returnedWords = (data && (data.words || data.vocabList)) || [];
                    if (Array.isArray(returnedWords) && returnedWords.length > 0) {
                        const needed = Math.min(Math.max(parseInt(this.selectedCount, 10) || 10, 1), 50);
                        const freshList = returnedWords.filter(item => !this.sessionUsedWords.has(item.word.toLowerCase()));
                        const pool = freshList.length >= needed ? freshList : returnedWords;
                        this.wordList = pool.slice(0, needed);
                        this.wordList.forEach(item => this.sessionUsedWords.add(item.word.toLowerCase()));
                        this.activeView = 'preview';
                        this.renderInto();
                        return;
                    }
                }

                throw new Error('Fallback to curated topic bank');
            } catch (err) {
                console.warn('⚡ Using instant curated fallback vocabulary pool:', err.message);
                this.loadSampleVocab();
                this.activeView = 'preview';
                this.renderInto();
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = originalHTML;
                }
            }
        }

        loadSampleVocab() {
            this.wordList = this.getCuratedWordsForTopicAndLevel(this.selectedTopic, this.selectedLevel, this.selectedCount);
            this.wordList.forEach(item => this.sessionUsedWords.add(item.word.toLowerCase()));
        }

        // =========================================================================
        // NÚT RESET BỘ TỪ MỚI (MỖI LẦN HỌC LÀ 1 LẦN TỪ MỚI)
        // =========================================================================
        async resetSessionWords() {
            const wasPlaying = (this.activeView === 'playing');
            if (this.currentIntakeMode === 'file' && this.uploadedFileWords.length > 0) {
                this.loadScannedIntoGame();
            } else if (this.currentIntakeMode === 'custom' && this.uploadedFileWords.length > 0) {
                this.handleCustomVocabSubmit();
            } else {
                await this.generateVocab(true);
            }
            if (wasPlaying) {
                setTimeout(() => {
                    this.startArena();
                }, 60);
            }
            if (typeof window.showToast === 'function') {
                window.showToast('🔄 Đã làm mới! Chuẩn bị bộ từ mới tinh cho bạn.');
            }
        }

        // =========================================================================
        // VIEW 2: XEM TRƯỚC DANH SÁCH TỪ VỪNG TRƯỚC KHI VÀO GAME
        // =========================================================================
        buildPreviewHTML() {
            return `
                <div class="w-full max-w-6xl 2xl:max-w-7xl mx-auto space-y-5 pb-12">
                    <!-- Top Breadcrumb & Controls -->
                    <div class="flex items-center justify-between">
                        <button onclick="VocabGameWorkstation.backToConfig()" 
                            class="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1.5 cursor-pointer">
                            <i class="fa-solid fa-arrow-left"></i> Đổi chủ đề / Tải file khác
                        </button>

                        <div class="flex items-center gap-2">
                            <!-- Nút Reset từ mới -->
                            <button onclick="VocabGameWorkstation.resetSessionWords()" 
                                title="Đổi ngay một bộ từ mới tinh khác"
                                class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition flex items-center gap-1.5 cursor-pointer border border-slate-200 dark:border-slate-700">
                                <i class="fa-solid fa-rotate text-blue-500"></i>
                                <span>Đổi từ mới (Reset)</span>
                            </button>

                            <span class="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-cyan-300 font-extrabold text-xs">
                                🚀 ${this.selectedTopic} • Level ${this.selectedLevel}
                            </span>
                            <span class="text-xs font-semibold text-slate-500">(${this.wordList.length} từ)</span>
                        </div>
                    </div>

                    <!-- Action Hero Card -->
                    <div class="p-5 rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div class="space-y-1 text-center sm:text-left">
                            <h3 class="text-lg font-black tracking-tight">Bộ từ vựng đã sẵn sàng vào đấu trường Gundam!</h3>
                            <p class="text-xs text-blue-100">
                                Hãy xem lướt qua hoặc bấm bắt đầu ngay để Gundam kích hoạt nòng Beam Rifle cùng bạn!
                            </p>
                        </div>
                        <button onclick="VocabGameWorkstation.startArena()" 
                            class="px-7 py-3 rounded-2xl bg-white hover:bg-slate-50 text-blue-950 font-black text-sm shadow-md transition active:scale-95 cursor-pointer flex items-center gap-2 shrink-0">
                            <i class="fa-solid fa-play text-blue-600"></i>
                            <span>Bắt đầu màn chơi ngay</span>
                        </button>
                    </div>

                    <!-- Word Grid Preview -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        ${this.wordList.map((item, idx) => `
                            <div class="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs hover:border-cyan-400 transition flex items-start justify-between gap-2">
                                <div class="space-y-1">
                                    <div class="flex items-center gap-2">
                                        <span class="text-xs font-black text-cyan-600 dark:text-cyan-400">#${idx + 1}</span>
                                        <span class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">${item.word}</span>
                                        <span class="px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">${item.level || this.selectedLevel}</span>
                                    </div>
                                    <div class="text-[11px] font-mono text-slate-400">${item.phonetic || ''}</div>
                                    <div class="text-xs font-semibold text-slate-700 dark:text-slate-300">${item.meaning}</div>
                                </div>
                                <button onclick="VocabGameWorkstation.speakWord('${item.word}')" 
                                    class="w-8 h-8 rounded-full bg-slate-100 hover:bg-cyan-100 text-slate-500 hover:text-cyan-700 dark:bg-slate-800 dark:hover:bg-cyan-950/80 dark:text-slate-300 flex items-center justify-center transition cursor-pointer shrink-0">
                                    <i class="fa-solid fa-volume-high text-xs"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>

                    <!-- Bottom Action Button -->
                    <div class="text-center pt-4">
                        <button onclick="VocabGameWorkstation.startArena()" 
                            class="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:opacity-95 text-white font-black text-base shadow-xl transition active:scale-95 cursor-pointer inline-flex items-center gap-2.5">
                            <i class="fa-solid fa-play"></i>
                            <span>Vào game gõ & bắn từ vựng (${this.wordList.length} từ)</span>
                        </button>
                    </div>
                </div>
            `;
        }

        // =========================================================================
        // VIEW 3: GAME ARENA (ĐẤU TRƯỜNG VŨ TRỤ GUNDAM RỘNG RÃI & KHUNG CỠ TRUNG)
        // =========================================================================
        buildGameArenaHTML() {
            return `
                <div class="w-full max-w-6xl 2xl:max-w-7xl mx-auto pb-8">
                    <!-- Top Game Bar -->
                    <div class="flex items-center justify-between mb-3 px-1">
                        <button onclick="VocabGameWorkstation.exitToConfig()" 
                            class="px-3.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-rose-600 transition flex items-center gap-1.5 shadow-2xs cursor-pointer">
                            <i class="fa-solid fa-arrow-left"></i> Thoát
                        </button>

                        <div class="flex items-center gap-2">
                            <!-- NÚT RESET ĐỔI TỪ MỚI TRỰC TIẾP TRONG GAME -->
                            <button onclick="VocabGameWorkstation.resetSessionWords()" 
                                title="Đổi ngay bộ từ mới tinh"
                                class="px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm">
                                <i class="fa-solid fa-rotate text-cyan-400"></i>
                                <span>Đổi từ mới (Reset)</span>
                            </button>

                            <div class="px-4 py-1.5 rounded-full bg-slate-900/90 text-white border border-cyan-500/30 text-xs font-black shadow-md flex items-center gap-2">
                                <span>🚀 ${this.selectedTopic}</span>
                                <span>•</span>
                                <span class="text-amber-400">Level ${this.selectedLevel}</span>
                                <span>•</span>
                                <span class="text-cyan-400">Từ: <span id="vgCurrentCounter">${this.currentIndex + 1}</span>/${this.wordList.length}</span>
                            </div>
                        </div>

                        <div class="flex items-center gap-2">
                            <button onclick="VocabGameWorkstation.speakWord(VocabGameWorkstation.currentWord.word)" 
                                title="Phát âm lại từ (Phím Space hoặc Tab)"
                                class="px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-bold transition flex items-center gap-1.5 border border-cyan-500/40 cursor-pointer">
                                <i class="fa-solid fa-volume-high"></i>
                                <span class="hidden sm:inline">Nghe (Space)</span>
                            </button>
                        </div>
                    </div>

                    <!-- Game Arena Viewport (MỞ RỘNG RỘNG RÃI TO HƠN - ẢNH 4) -->
                    <div id="vgArenaContainer" 
                        class="w-full h-[640px] md:h-[680px] rounded-3xl relative overflow-hidden shadow-2xl select-none"
                        style="background: radial-gradient(circle at 50% 25%, #0f172a 0%, #090d16 55%, #020408 100%);">
                        
                        <!-- Gundam Space Battlefield HUD Lines & Stars -->
                        <div class="absolute inset-0 pointer-events-none opacity-35">
                            <!-- Background Stars -->
                            <div class="absolute w-1.5 h-1.5 rounded-full bg-cyan-300 blur-[0.5px] animate-pulse" style="top: 15%; left: 12%;"></div>
                            <div class="absolute w-2 h-2 rounded-full bg-blue-400 blur-[1px] animate-pulse" style="top: 35%; left: 85%; animation-delay: 1.2s;"></div>
                            <div class="absolute w-1.5 h-1.5 rounded-full bg-amber-200 blur-[0.5px] animate-pulse" style="top: 60%; left: 20%; animation-delay: 2s;"></div>
                            <div class="absolute w-1 h-1 rounded-full bg-cyan-200 blur-[0.5px] animate-pulse" style="top: 25%; left: 70%; animation-delay: 0.7s;"></div>
                            <div class="absolute w-2 h-2 rounded-full bg-indigo-300 blur-[1px] animate-pulse" style="top: 80%; left: 75%; animation-delay: 1.6s;"></div>
                            
                            <!-- Targeting Crosshair Grid in corners -->
                            <div class="absolute top-4 left-4 text-cyan-500/40 font-mono text-[10px]">TARGET ACQUISITION: ACTIVE</div>
                            <div class="absolute top-4 right-4 text-cyan-500/40 font-mono text-[10px]">RADAR LOCK: STANDBY</div>
                            <div class="absolute bottom-4 left-4 text-cyan-500/30 font-mono text-[10px]">MOBILE SUIT: RX-78 BEAM ARMED</div>
                        </div>

                                                <!-- Falling Word Card (Ô CHỮ RƠI BỰ VỪA ĐỦ - BALANCED MEDIUM) -->
                        <div id="vgFallingCard" 
                            class="absolute z-20 cursor-pointer select-none"
                            onclick="VocabGameWorkstation.speakWord(VocabGameWorkstation.currentWord.word)"
                            style="top: 10%; left: 50%; transform: translateX(-50%); padding: 8px 16px; border-radius: 10px; border: 1.8px dashed #f59e0b; background: rgba(26, 18, 11, 0.94); box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4); display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; backdrop-filter: blur(8px);">
                            
                            <!-- Card Sound Button Top-Right (22px x 22px) -->
                            <div onclick="event.stopPropagation(); VocabGameWorkstation.speakWord(VocabGameWorkstation.currentWord.word)" 
                                title="Nghe phát âm"
                                style="position: absolute; top: -8px; right: -8px; width: 22px; height: 22px; border-radius: 9999px; background: #f59e0b; color: #1e1b4b; display: flex; align-items: center; justify-content: center; font-size: 10px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.6); z-index: 5;">
                                <i class="fa-solid fa-volume-high"></i>
                            </div>

                            <!-- Letters Unmasking Display (Duy nhất 1 hàng: chữ cái đầu & các dấu _) -->
                            <div id="vgLettersDisplay" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; line-height: 1;">
                                <!-- Rendered dynamically -->
                            </div>
                        </div>

                        <!-- Cleared Word Floating Text -->
                        <div id="vgClearedNotification" 
                            class="absolute pointer-events-none transition-all duration-700 opacity-0 z-30 flex flex-col items-center justify-center text-center"
                            style="top: 30%; left: 50%; transform: translate(-50%, 0);">
                            <div id="vgClearedEn" class="text-2xl sm:text-3xl font-black text-[#4ade80] drop-shadow-[0_2px_8px_rgba(74,222,128,0.7)]">
                                disclose
                            </div>
                            <div id="vgClearedVi" class="text-sm sm:text-base font-bold text-[#86efac] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] mt-0.5">
                                tiết lộ
                            </div>
                            <!-- Thông báo đã thêm vào Sổ tay từ vựng -->
                            <div class="text-[11px] font-black text-amber-300 bg-slate-950/80 px-2.5 py-0.5 rounded-full mt-1 border border-amber-500/40">
                                🔖 Đã thêm vào Sổ tay từ vựng
                            </div>
                        </div>

                        <!-- Particle Canvas for Beam Laser & Sparks -->
                        <canvas id="vgParticleCanvas" class="absolute inset-0 pointer-events-none z-25"></canvas>

                        <!-- Bottom Launcher: GUNDAM MOBILE SUIT RX-78 MECHA (ẢNH 1 & ẢNH 3) -->
                        <div class="absolute bottom-4 left-0 right-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                            
                            <!-- Gundam Mecha Turret (Cử động xoay nòng ngắm mượt & nhấp nhô lơ lửng) -->
                            <div id="vgGundamWrapper" class="relative flex flex-col items-center justify-center pointer-events-none mb-1">
                                <div id="vgGundamLauncher" 
                                    class="relative flex flex-col items-center justify-center pointer-events-none"
                                    style="width: 140px; height: 155px; transform-origin: 50% 88%; will-change: transform;">
                                    
                                    <svg viewBox="0 0 140 160" class="w-full h-full drop-shadow-[0_10px_25px_rgba(56,189,248,0.5)]">
                                        <defs>
                                            <linearGradient id="vFinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stop-color="#fef08a" />
                                                <stop offset="60%" stop-color="#f59e0b" />
                                                <stop offset="100%" stop-color="#b45309" />
                                            </linearGradient>
                                            <linearGradient id="chestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stop-color="#2563eb" />
                                                <stop offset="60%" stop-color="#1d4ed8" />
                                                <stop offset="100%" stop-color="#0f172a" />
                                            </linearGradient>
                                            <linearGradient id="rifleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stop-color="#64748b" />
                                                <stop offset="50%" stop-color="#334155" />
                                                <stop offset="100%" stop-color="#1e293b" />
                                            </linearGradient>
                                            <linearGradient id="thrusterPlasma" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stop-color="#ffffff" />
                                                <stop offset="25%" stop-color="#38bdf8" />
                                                <stop offset="80%" stop-color="#1d4ed8" />
                                                <stop offset="100%" stop-color="transparent" />
                                            </linearGradient>
                                            <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
                                                <feGaussianBlur stdDeviation="3" result="blur" />
                                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                            </filter>
                                        </defs>

                                        <!-- 1. BACKPACK THRUSTERS & PLASMA FLAMES -->
                                        <!-- Left Thruster Pod -->
                                        <polygon points="32,95 24,105 24,120 36,115 36,98" fill="#1e293b" stroke="#475569" stroke-width="1.5" />
                                        <polygon points="25,120 29,138 34,120" fill="url(#thrusterPlasma)" class="gundam-thruster" />

                                        <!-- Right Thruster Pod -->
                                        <polygon points="108,95 116,105 116,120 104,115 104,98" fill="#1e293b" stroke="#475569" stroke-width="1.5" />
                                        <polygon points="106,120 111,138 115,120" fill="url(#thrusterPlasma)" class="gundam-thruster" />

                                        <!-- 2. BEAM RIFLE (Vươn cao sẵn sàng ngắm bắn) -->
                                        <g id="gundamBeamRifle">
                                            <!-- Long Rifle Barrel -->
                                            <rect x="92" y="10" width="7" height="66" rx="2" fill="url(#rifleGrad)" stroke="#0f172a" stroke-width="1.2" />
                                            <!-- Muzzle Suppressor Tip -->
                                            <rect x="90" y="6" width="11" height="8" rx="2" fill="#0f172a" />
                                            <!-- Glowing Plasma Muzzle Tip -->
                                            <ellipse id="gundamMuzzle" cx="95.5" cy="6" rx="5" ry="3.5" fill="#38bdf8" filter="url(#cyanGlow)" />
                                            <!-- Scope Optical Lens -->
                                            <rect x="88" y="30" width="5" height="14" rx="1.5" fill="#1e293b" />
                                            <circle cx="90.5" cy="37" r="2" fill="#38bdf8" />
                                            <!-- Rifle Body / Grip Mount -->
                                            <polygon points="86,58 102,58 100,82 88,80" fill="#334155" stroke="#0f172a" stroke-width="1.2" />
                                            <rect x="95" y="80" width="5" height="15" rx="1" fill="#1e293b" />
                                        </g>

                                        <!-- 3. SHOULDERS (PAULDRONS) -->
                                        <!-- Left Shoulder -->
                                        <polygon points="46,65 18,72 14,92 42,88 46,75" fill="#f8fafc" stroke="#334155" stroke-width="1.8" />
                                        <polygon points="20,74 16,84 26,82" fill="#ef4444" />
                                        <!-- Right Shoulder -->
                                        <polygon points="94,65 122,72 126,92 98,88 94,75" fill="#f8fafc" stroke="#334155" stroke-width="1.8" />
                                        <polygon points="120,74 124,84 114,82" fill="#ef4444" />

                                        <!-- 4. TORSO & CHEST ARMOR -->
                                        <polygon points="46,70 94,70 86,108 54,108" fill="url(#chestGrad)" stroke="#1e293b" stroke-width="2" />
                                        <!-- Yellow Chest Intake Vents -->
                                        <polygon points="50,75 62,75 60,86 52,86" fill="#fbbf24" stroke="#b45309" stroke-width="1.2" />
                                        <line x1="51" y1="80" x2="61" y2="80" stroke="#78350f" stroke-width="1" />
                                        <polygon points="78,75 90,75 88,86 80,86" fill="#fbbf24" stroke="#b45309" stroke-width="1.2" />
                                        <line x1="79" y1="80" x2="89" y2="80" stroke="#78350f" stroke-width="1" />
                                        <!-- Red Center Cockpit Armor -->
                                        <polygon points="65,78 75,78 74,96 66,96" fill="#dc2626" stroke="#991b1b" stroke-width="1.2" />
                                        <polygon points="63,96 77,96 75,108 65,108" fill="#ef4444" />

                                        <!-- 5. ARMS -->
                                        <!-- Left Forearm -->
                                        <rect x="24" y="88" width="16" height="26" rx="4" fill="#f8fafc" stroke="#334155" stroke-width="1.5" />
                                        <!-- Right Forearm holding rifle -->
                                        <rect x="100" y="86" width="16" height="25" rx="4" fill="#f8fafc" stroke="#334155" stroke-width="1.5" />

                                        <!-- 6. GUNDAM HEAD & HELMET -->
                                        <!-- Collar & Neck -->
                                        <polygon points="56,66 84,66 80,72 60,72" fill="#f8fafc" stroke="#334155" stroke-width="1.5" />
                                        
                                        <!-- Face Mask Base (White) -->
                                        <polygon points="54,38 86,38 88,58 78,66 62,66 52,58" fill="#f8fafc" stroke="#334155" stroke-width="1.8" />
                                        <!-- Cheek Guards Armor -->
                                        <polygon points="53,44 60,44 60,60 52,56" fill="#e2e8f0" stroke="#475569" stroke-width="1.2" />
                                        <polygon points="87,44 80,44 80,60 88,56" fill="#e2e8f0" stroke="#475569" stroke-width="1.2" />
                                        
                                        <!-- Glowing Cyan Optical Sensors (Eyes Visor) -->
                                        <polygon points="61,48 68,48 67,52 62,52" fill="#38bdf8" filter="url(#cyanGlow)" />
                                        <polygon points="72,48 79,48 78,52 73,52" fill="#38bdf8" filter="url(#cyanGlow)" />
                                        
                                        <!-- Nose Bridge & Mouth Plate -->
                                        <polygon points="67,46 73,46 72,56 68,56" fill="#cbd5e1" />
                                        <line x1="68" y1="57" x2="72" y2="57" stroke="#475569" stroke-width="1" />
                                        <line x1="68" y1="59" x2="72" y2="59" stroke="#475569" stroke-width="1" />
                                        
                                        <!-- Red Chin Guard -->
                                        <polygon points="66,61 74,61 73,67 67,67" fill="#ef4444" stroke="#b91c1c" stroke-width="1" />

                                        <!-- Forehead Main Camera Sensor (Red) -->
                                        <polygon points="66,32 74,32 73,38 67,38" fill="#ef4444" stroke="#991b1b" stroke-width="1" />

                                        <!-- 7. ICONIC V-FIN ANTENNA (Gold / Yellow Samurai Crest) -->
                                        <g id="gundamVFin">
                                            <!-- Left Wing of V-fin -->
                                            <polygon points="68,36 34,16 46,28 66,38" fill="url(#vFinGrad)" stroke="#b45309" stroke-width="1.5" />
                                            <!-- Right Wing of V-fin -->
                                            <polygon points="72,36 106,16 94,28 74,38" fill="url(#vFinGrad)" stroke="#b45309" stroke-width="1.5" />
                                            <!-- Secondary Smaller Antenna -->
                                            <polygon points="68,37 54,26 60,33 67,38" fill="#f59e0b" />
                                            <polygon points="72,37 86,26 80,33 73,38" fill="#f59e0b" />
                                            <!-- Central Diamond Jewel Crest (Red) -->
                                            <polygon points="70,30 75,36 70,42 65,36" fill="#dc2626" stroke="#991b1b" stroke-width="1.2" />
                                        </g>

                                        <!-- 8. WAIST / HIP MOUNT -->
                                        <polygon points="56,108 84,108 80,122 60,122" fill="#f8fafc" stroke="#334155" stroke-width="1.8" />
                                        <rect x="67" y="110" width="6" height="10" rx="1.5" fill="#ef4444" />
                                    </svg>
                                </div>
                            </div>

                            <!-- Progress Bar -->
                            <div class="w-64 sm:w-84 h-7 rounded-full bg-slate-950/85 border border-cyan-500/40 p-1 flex items-center relative overflow-hidden shadow-lg">
                                <div id="vgProgressBarFill" 
                                    class="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-300"
                                    style="width: 10%;"></div>
                                <div class="absolute inset-0 flex items-center justify-center text-[10px] sm:text-[11px] font-black text-cyan-200 uppercase tracking-wider drop-shadow-sm pointer-events-none">
                                    <span class="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping mr-1.5"></span>
                                    <span>${this.selectedTopic.toUpperCase()} • LEVEL ${this.selectedLevel}</span>
                                </div>
                            </div>

                            <div class="text-[10px] font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                                <span>Gõ trực tiếp chữ cái trên bàn phím • [Space/Tab] để nghe lại âm chuẩn</span>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        // =========================================================================
        // KHỞI TẠO GAME & LOOP CHUYỂN ĐỘNG
        // =========================================================================
        startArena() {
            if (!this.wordList || this.wordList.length === 0) {
                this.loadSampleVocab();
            }
            this.currentIndex = 0;
            this.currentWord = this.wordList[this.currentIndex];
            this.typedLetters = '';
            this.mistakeHint = '';
            this.isMistake = false;
            this.correctCount = 0;
            this.mistakeCount = 0;
            this.mistakeWords = [];
            this.fallProgress = 10;
            this.isFallingPaused = false;
            this.cardThemeIndex = 0;
            this.cardBaseX = 50;
            this.swaySeed = 0;
            this.swayAmplitude = 18;
            this.gundamAngle = 0;
            this.particles = [];
            this.projectiles = [];

            this.activeView = 'playing';
            this.renderInto();
        }

        exitToConfig() {
            this.stopGameLoop();
            this.detachGlobalKeydown();
            this.activeView = 'config';
            this.renderInto();
        }

        backToConfig() {
            this.activeView = 'config';
            this.renderInto();
        }

        initGameCanvas() {
            const canvas = document.getElementById('vgParticleCanvas');
            const arena = document.getElementById('vgArenaContainer');
            if (canvas && arena) {
                canvas.width = arena.clientWidth;
                canvas.height = arena.clientHeight;
            }
        }

        startGameLoop() {
            this.stopGameLoop();
            let lastTime = performance.now();

            const loop = (currentTime) => {
                const dt = (currentTime - lastTime) / 1000;
                lastTime = currentTime;

                if (this.activeView === 'playing' && !this.isFallingPaused) {
                    this.fallProgress += this.fallSpeed;
                    
                    if (this.fallProgress >= 88) {
                        this.handleCardReachedBottom();
                    } else {
                        const card = document.getElementById('vgFallingCard');
                        if (card) {
                            const timeNow = currentTime / 850;
                            const currentSway = Math.sin(timeNow + (this.swaySeed || 0)) * (this.swayAmplitude || 18);
                            const currentTilt = Math.sin(timeNow + (this.swaySeed || 0)) * 2.5;
                            card.style.top = `${this.fallProgress}%`;
                            card.style.left = `calc(${this.cardBaseX || 50}% + ${currentSway}px)`;
                            card.style.transform = `translateX(-50%) rotate(${currentTilt}deg)`;
                        }
                    }

                    // Gundam xoay ngắm mượt mà theo vị trí thẻ từ rơi
                    this.updateGunTracking();
                }

                // Cập nhật và vẽ particle effects
                this.renderParticles();

                if (this.activeView === 'playing') {
                    this.animFrameId = requestAnimationFrame(loop);
                }
            };

            this.animFrameId = requestAnimationFrame(loop);
        }

        stopGameLoop() {
            if (this.animFrameId) {
                cancelAnimationFrame(this.animFrameId);
                this.animFrameId = null;
            }
        }

        // =========================================================================
        // GUNDAM XOAY NÒNG NGẮM MƯỢT MÀ THEO VỊ TRÍ THẺ TỪ (ẢNH 1 & ẢNH 3)
        // =========================================================================
        updateGunTracking() {
            const card = document.getElementById('vgFallingCard');
            const gundam = document.getElementById('vgGundamLauncher');
            if (!card || !gundam) return;

            const cardRect = card.getBoundingClientRect();
            const gundamRect = gundam.getBoundingClientRect();

            const cardCenterX = cardRect.left + (cardRect.width / 2);
            const cardCenterY = cardRect.top + (cardRect.height / 2);

            const gundamCenterX = gundamRect.left + (gundamRect.width / 2);
            const gundamCenterY = gundamRect.top + (gundamRect.height * 0.85);

            const dx = cardCenterX - gundamCenterX;
            const dy = gundamCenterY - cardCenterY;

            let targetAngleDeg = Math.atan2(dx, dy) * (180 / Math.PI);
            // Giới hạn góc ngắm tự nhiên (-48deg đến +48deg)
            targetAngleDeg = Math.max(-48, Math.min(48, targetAngleDeg));

            if (typeof this.gundamAngle !== 'number') this.gundamAngle = 0;
            // Easing mượt mà
            this.gundamAngle += (targetAngleDeg - this.gundamAngle) * 0.16;

            const recoilScale = this.isGundamRecoil ? 0.92 : 1;
            const recoilY = this.isGundamRecoil ? 5 : 0;
            gundam.style.transform = `rotate(${this.gundamAngle.toFixed(2)}deg) scale(${recoilScale}) translateY(${recoilY}px)`;
        }

        // =========================================================================
        // ĐA DẠNG KIỂU KHUNG THẺ RƠI (ẢNH 4 & CỠ TRUNG ẢNH 2)
        // =========================================================================
        applyCardTheme(cardEl) {
            if (!cardEl) return;
            const themes = [
                // Theme 0: Rừng Hổ Phách
                {
                    bg: 'rgba(30, 20, 10, 0.92)',
                    border: '2px dashed #f59e0b',
                    shadow: '0 8px 32px rgba(245, 158, 11, 0.45)',
                    glow: '#f59e0b'
                },
                // Theme 1: Chồi Non Ngọc Lục Bảo
                {
                    bg: 'rgba(10, 30, 20, 0.92)',
                    border: '2px dashed #10b981',
                    shadow: '0 8px 32px rgba(16, 185, 129, 0.45)',
                    glow: '#10b981'
                },
                // Theme 2: Hoàng Hôn Hồng Tím
                {
                    bg: 'rgba(30, 15, 30, 0.92)',
                    border: '2px dashed #d946ef',
                    shadow: '0 8px 32px rgba(217, 70, 239, 0.45)',
                    glow: '#d946ef'
                },
                // Theme 3: Không gian Xanh Lơ Gundam HUD
                {
                    bg: 'rgba(10, 25, 40, 0.92)',
                    border: '2px dashed #06b6d4',
                    shadow: '0 8px 32px rgba(6, 182, 212, 0.45)',
                    glow: '#06b6d4'
                }
            ];

            const current = themes[this.cardThemeIndex % themes.length];
            cardEl.style.backgroundColor = current.bg;
            cardEl.style.border = current.border;
            cardEl.style.boxShadow = current.shadow;
            cardEl.style.backdropFilter = 'blur(8px)';
            this.currentCardGlow = current.glow;
        }

        // =========================================================================
        // CẬP NHẬT GIAO DIỆN THẺ TỪ RƠI (HIỂN THỊ CHỮ & KÝ TỰ CỠ TRUNG)
        // =========================================================================
                updateFallingCardUI() {
            const lettersDiv = document.getElementById('vgLettersDisplay');
            const card = document.getElementById('vgFallingCard');
            if (!lettersDiv || !this.currentWord) return;

            const word = this.currentWord.word.toLowerCase();
            
            // Khung bự vừa đủ (~1.5x so với bản nhỏ, nhỏ gọn hơn bản cũ):
            // Chiều rộng = padding (32px) + viền (4px) + (word.length * 15px) + ((word.length - 1) * 6px gap)
            const fixedWidthPx = 36 + (word.length * 15) + ((word.length - 1) * 6);
            if (card) {
                card.style.width = `${fixedWidthPx}px`;
                card.style.height = '42px';
                card.style.padding = '8px 16px';
                card.style.borderRadius = '10px';
                card.style.border = '1.8px dashed #f59e0b';
                card.style.background = 'rgba(26, 18, 11, 0.94)';
                card.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)';
            }

            let html = '';
            for (let i = 0; i < word.length; i++) {
                if (i === 0) {
                    // Chữ cái đầu tiên: font-size 21px, font-weight 700, màu vàng sáng
                    html += `
                        <div style="position: relative; width: 15px; height: 22px; display: inline-flex; align-items: center; justify-content: center;">
                            <span style="font-size: 21px; font-weight: 700; color: #fbbf24; line-height: 1; text-shadow: 0 2px 8px rgba(251, 191, 36, 0.6);">${word[0]}</span>
                        </div>
                    `;
                } else if (i < this.typedLetters.length) {
                    // Ký tự đã gõ đúng tiếp theo: font-size 21px, font-weight 700, màu vàng sáng
                    const typedChar = this.typedLetters[i];
                    html += `
                        <div style="position: relative; width: 15px; height: 22px; display: inline-flex; align-items: center; justify-content: center;">
                            <span style="font-size: 21px; font-weight: 700; color: #fbbf24; line-height: 1; text-shadow: 0 2px 8px rgba(251, 191, 36, 0.6);">${typedChar}</span>
                        </div>
                    `;
                } else if (i === this.typedLetters.length) {
                    // Ký tự tiếp theo cần gõ:
                    const hasHint = this.isMistake && this.mistakeHint;
                    html += `
                        <div style="position: relative; width: 15px; height: 22px; display: inline-flex; align-items: center; justify-content: center;">
                            ${hasHint ? `
                                <span style="position: absolute; top: -16px; font-size: 13px; font-weight: 800; color: #f87171; line-height: 1; text-shadow: 0 1px 4px rgba(0,0,0,0.9);">
                                    ${this.mistakeHint}
                                </span>
                            ` : ''}
                            <span style="display: block; width: 15px; height: 2.5px; background: ${hasHint ? '#ef4444' : '#f59e0b'}; border-radius: 1.5px; ${hasHint ? 'box-shadow: 0 0 8px #ef4444;' : 'box-shadow: 0 0 5px #f59e0b;'}"></span>
                        </div>
                    `;
                } else {
                    // Các ký tự còn lại: vạch đơn mảnh rộng 15px, cao 2.5px, màu amber mờ
                    html += `
                        <div style="position: relative; width: 15px; height: 22px; display: inline-flex; align-items: center; justify-content: center;">
                            <span style="display: block; width: 15px; height: 2.5px; background: rgba(245, 158, 11, 0.45); border-radius: 1.5px;"></span>
                        </div>
                    `;
                }
            }

            lettersDiv.innerHTML = html;

            const counter = document.getElementById('vgCurrentCounter');
            if (counter) counter.textContent = this.currentIndex + 1;

            const progress = document.getElementById('vgProgressBarFill');
            if (progress && this.wordList.length > 0) {
                const pct = Math.round(((this.currentIndex) / this.wordList.length) * 100);
                progress.style.width = `${Math.max(pct, 8)}%`;
            }
        }

        // =========================================================================
        // GLOBAL KEYDOWN LISTENER (TƯƠNG TÁC GÕ PHÍM TRỰC TIẾP)
        // =========================================================================
        attachGlobalKeydown() {
            this.detachGlobalKeydown();
            window.addEventListener('keydown', this.handleGlobalKeyDown);
        }

        detachGlobalKeydown() {
            window.removeEventListener('keydown', this.handleGlobalKeyDown);
        }

        handleGlobalKeyDown(e) {
            if (this.activeView !== 'playing') return;

            const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
            if (activeTag === 'input' || activeTag === 'textarea') return;

            if (e.code === 'Space' || e.key === 'Tab') {
                e.preventDefault();
                this.speakWord(this.currentWord.word);
                return;
            }

            if (e.key.length === 1 && /^[a-zA-Z]$/.test(e.key)) {
                e.preventDefault();
                this.processKeyInput(e.key.toLowerCase());
            }
        }

        processKeyInput(pressedChar) {
            if (!this.currentWord) return;
            const word = this.currentWord.word.toLowerCase();

            const currentExpectedIdx = Math.max(this.typedLetters.length, 1);
            if (currentExpectedIdx >= word.length) return;

            const expectedChar = word[currentExpectedIdx];

            // =========================================================================
            // BẤT KỂ GÕ ĐÚNG HAY SAI: ĐỀU BẮN VIÊN ĐẠN XANH BAY VÀO Ô CHỮ!
            // =========================================================================
            this.playShootSound();
            this.triggerGundamRecoil();
            this.spawnShootProjectile();

            if (pressedChar === expectedChar) {
                // =====================================================
                // GÕ ĐÚNG KÝ TỰ!
                // =====================================================
                this.isMistake = false;
                this.mistakeHint = '';

                if (this.typedLetters.length === 0) {
                    this.typedLetters = word[0] + pressedChar;
                } else {
                    this.typedLetters += pressedChar;
                }

                this.correctCount++;
                this.updateFallingCardUI();

                if (this.typedLetters.length === word.length) {
                    this.handleWordCleared();
                }
            } else {
                // =====================================================
                // GÕ SAI KÝ TỰ!
                // =====================================================
                this.isMistake = true;
                this.mistakeHint = expectedChar;
                this.mistakeCount++;

                if (!this.mistakeWords.some(w => w.word === this.currentWord.word)) {
                    this.mistakeWords.push(this.currentWord);
                }

                this.playWrongSound();
                this.speakWord(this.currentWord.word);

                const card = document.getElementById('vgFallingCard');
                if (card) {
                    card.classList.add('animate-shake');
                    card.style.borderColor = '#ef4444';
                    setTimeout(() => {
                        if (card) {
                            card.classList.remove('animate-shake');
                            card.style.borderColor = '#f59e0b';
                        }
                    }, 400);
                }

                this.updateFallingCardUI();
            }
        }

        triggerGundamRecoil() {
            this.isGundamRecoil = true;
            setTimeout(() => {
                this.isGundamRecoil = false;
            }, 90);
        }

        // =========================================================================
        // GUNDAM BEAM LASER PROJECTILE & ENERGY FLARE
        // =========================================================================
        spawnShootProjectile() {
            const canvas = document.getElementById('vgParticleCanvas');
            const card = document.getElementById('vgFallingCard');
            const arena = document.getElementById('vgArenaContainer');
            if (!canvas || !card) return;

            if (arena && (canvas.width !== arena.clientWidth || canvas.height !== arena.clientHeight)) {
                canvas.width = arena.clientWidth;
                canvas.height = arena.clientHeight;
            }

            const rect = canvas.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();

            const angleRad = (this.gundamAngle || 0) * (Math.PI / 180);
            const barrelLen = 78; // Chiều dài nòng Beam Rifle
            const startX = (rect.width / 2) + Math.sin(angleRad) * barrelLen;
            const startY = (rect.height - 75) - Math.cos(angleRad) * barrelLen;

            const targetX = cardRect.left - rect.left + (cardRect.width / 2);
            const targetY = cardRect.top - rect.top + (cardRect.height / 2);

            this.triggerGundamRecoil();

            // Chớp sáng đầu nòng súng Beam Rifle
            for (let m = 0; m < 8; m++) {
                this.particles.push({
                    x: startX + (Math.random() - 0.5) * 10,
                    y: startY + (Math.random() - 0.5) * 10,
                    vx: (Math.random() - 0.5) * 3 + Math.sin(angleRad) * 3.5,
                    vy: (Math.random() - 0.5) * 3 - Math.cos(angleRad) * 3.5,
                    radius: 3 + Math.random() * 3,
                    color: Math.random() > 0.3 ? '#00e5ff' : '#38bdf8',
                    alpha: 1,
                    decay: 0.08
                });
            }

            // Viên đạn xanh Beam Laser bay vào ô chữ
            this.projectiles.push({
                x: startX,
                y: startY,
                targetX: targetX,
                targetY: targetY,
                prevX: startX,
                prevY: startY,
                progress: 0,
                speed: 0.07 // Bay rõ nét và mượt mà ~250ms
            });
        }

        // =========================================================================
        // HOÀN THÀNH TỪ: LƯU VÀO SỔ TAY TỪ VỰNG & NỔ NĂNG LƯỢNG
        // =========================================================================
        handleWordCleared() {
            this.isFallingPaused = true;
            this.playSuccessChime();

            // 1. TỰ ĐỘNG THÊM VÀO SỔ TAY TỪ VỰNG TRONG TAB "TỪ VỰNG"
            this.saveWordToNotebook(this.currentWord);

            const card = document.getElementById('vgFallingCard');
            const notif = document.getElementById('vgClearedNotification');
            const enText = document.getElementById('vgClearedEn');
            const viText = document.getElementById('vgClearedVi');

            // 2. Chùm hạt năng lượng plasma nổ tung
            if (card) {
                const canvas = document.getElementById('vgParticleCanvas');
                if (canvas) {
                    const rect = canvas.getBoundingClientRect();
                    const cardRect = card.getBoundingClientRect();
                    const centerX = cardRect.left - rect.left + (cardRect.width / 2);
                    const centerY = cardRect.top - rect.top + (cardRect.height / 2);

                    for (let i = 0; i < 32; i++) {
                        const angle = Math.random() * Math.PI * 2;
                        const speed = 2 + Math.random() * 5;
                        this.particles.push({
                            x: centerX,
                            y: centerY,
                            vx: Math.cos(angle) * speed,
                            vy: Math.sin(angle) * speed,
                            radius: 2 + Math.random() * 3.5,
                            color: Math.random() > 0.5 ? '#38bdf8' : (Math.random() > 0.5 ? '#4ade80' : '#fde047'),
                            alpha: 1,
                            decay: 0.025 + Math.random() * 0.02
                        });
                    }
                }
                card.style.opacity = '0';
            }

            // 3. Hiện chữ tiếng Anh + tiếng Việt nổi lên
            if (notif && enText && viText && card) {
                enText.textContent = this.currentWord.word;
                viText.textContent = this.currentWord.meaning;
                notif.style.top = `${this.fallProgress}%`;
                notif.style.opacity = '1';
                notif.style.transform = 'translate(-50%, -15px)';

                setTimeout(() => {
                    if (notif) {
                        notif.style.opacity = '0';
                        notif.style.transform = 'translate(-50%, -35px)';
                    }
                }, 850);
            }

            // 4. Chuyển sang từ tiếp theo
            setTimeout(() => {
                this.moveToNextWord();
            }, 1000);
        }

        handleCardReachedBottom() {
            if (!this.mistakeWords.some(w => w.word === this.currentWord.word)) {
                this.mistakeWords.push(this.currentWord);
            }
            this.handleWordCleared();
        }

        moveToNextWord() {
            this.currentIndex++;
            if (this.currentIndex >= this.wordList.length) {
                this.finishGame();
                return;
            }

            this.currentWord = this.wordList[this.currentIndex];
            this.typedLetters = '';
            this.mistakeHint = '';
            this.isMistake = false;
            this.fallProgress = 10;
            this.isFallingPaused = false;

            this.cardThemeIndex = (this.cardThemeIndex + 1) % 4;
            this.cardBaseX = 22 + Math.random() * 56;
            this.swaySeed = Math.random() * 10;
            this.swayAmplitude = 16 + Math.random() * 18;

            const card = document.getElementById('vgFallingCard');
            if (card) {
                card.style.opacity = '1';
                card.style.top = '10%';
                card.style.left = `${this.cardBaseX}%`;
            }

            this.updateFallingCardUI();
            this.speakWord(this.currentWord.word);
        }

        // =========================================================================
        // TỔNG KẾT & ĐỒNG BỘ DỮ LIỆU VỚI HỆ THỐNG WEB
        // =========================================================================
        finishGame() {
            this.stopGameLoop();
            this.detachGlobalKeydown();

            const total = this.wordList.length;
            const mastered = Math.max(total - this.mistakeWords.length, 0);
            this.earnedXP = Math.round(mastered * 5 + (total >= 20 ? 30 : 15));

            if (window.state) {
                window.state.xp = (window.state.xp || 0) + this.earnedXP;
                window.state.vocabLearned = (window.state.vocabLearned || 0) + mastered;

                const xpEl = document.getElementById('headerXP');
                if (xpEl) xpEl.textContent = `${window.state.xp} XP`;
                const userXpBadge = document.getElementById('userXpBadge');
                if (userXpBadge) userXpBadge.textContent = `${window.state.xp} XP`;

                if (typeof showToast === 'function') {
                    showToast(`🎉 +${this.earnedXP} XP! Đã học xong ${mastered} từ vựng mới cùng Gundam!`);
                }
            }

            this.activeView = 'summary';
            this.renderInto();
        }

        // =========================================================================
        // PARTICLE CANVAS ANIMATION (GUNDAM BEAM LASER & SPARKS)
        // =========================================================================
        renderParticles() {
            const canvas = document.getElementById('vgParticleCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Vẽ Viên Đạn Xanh Beam Laser từ Gundam
            for (let i = this.projectiles.length - 1; i >= 0; i--) {
                const p = this.projectiles[i];
                p.prevX = p.x + (p.targetX - p.x) * p.progress;
                p.prevY = p.y + (p.targetY - p.y) * p.progress;

                p.progress += p.speed;

                const curX = p.x + (p.targetX - p.x) * Math.min(p.progress, 1);
                const curY = p.y + (p.targetY - p.y) * Math.min(p.progress, 1);

                // Tính góc bay của viên đạn
                const bulletAngle = Math.atan2(p.targetY - p.y, p.targetX - p.x);

                // Vệt tia lửa plasma xanh cyan phía sau đuôi đạn
                this.particles.push({
                    x: curX + (Math.random() - 0.5) * 6,
                    y: curY + (Math.random() - 0.5) * 6,
                    vx: (Math.random() - 0.5) * 1.5 - Math.cos(bulletAngle) * 2,
                    vy: (Math.random() - 0.5) * 1.5 - Math.sin(bulletAngle) * 2,
                    radius: 2 + Math.random() * 2.5,
                    color: Math.random() > 0.4 ? '#00e5ff' : '#38bdf8',
                    alpha: 0.9,
                    decay: 0.06
                });

                ctx.save();

                // Vệt sáng nối đuôi đạn (Beam Tracer Tail)
                ctx.beginPath();
                ctx.moveTo(p.prevX, p.prevY);
                ctx.lineTo(curX, curY);
                ctx.strokeStyle = '#00e5ff';
                ctx.lineWidth = 6;
                ctx.lineCap = 'round';
                ctx.shadowColor = '#00b4d8';
                ctx.shadowBlur = 18;
                ctx.stroke();

                // Viên đạn Beam Laser hình elip dài / viên đạn xanh
                ctx.translate(curX, curY);
                ctx.rotate(bulletAngle);

                // Lớp hào quang xanh neon bên ngoài
                ctx.beginPath();
                ctx.ellipse(0, 0, 14, 6, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#00e5ff';
                ctx.shadowColor = '#00f5ff';
                ctx.shadowBlur = 24;
                ctx.fill();

                // Lõi đạn xanh lam đậm hơn
                ctx.beginPath();
                ctx.ellipse(0, 0, 10, 4, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#38bdf8';
                ctx.fill();

                // Lõi năng lượng trắng sáng chói giữa tâm
                ctx.beginPath();
                ctx.ellipse(0, 0, 6, 2.5, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();

                ctx.restore();

                if (p.progress >= 1) {
                    // Đạn chạm đích vào ô chữ: Nổ chùm sao plasma xanh & vàng rực rỡ
                    for (let k = 0; k < 16; k++) {
                        const a = Math.random() * Math.PI * 2;
                        const spd = 2 + Math.random() * 5;
                        this.particles.push({
                            x: p.targetX,
                            y: p.targetY,
                            vx: Math.cos(a) * spd,
                            vy: Math.sin(a) * spd,
                            radius: 2.5 + Math.random() * 3,
                            color: Math.random() > 0.3 ? '#00e5ff' : (Math.random() > 0.5 ? '#38bdf8' : '#fde047'),
                            alpha: 1,
                            decay: 0.045
                        });
                    }
                    this.projectiles.splice(i, 1);
                }
            }

            // 2. Vẽ Particles nổ đom đóm & tia lửa sao vàng
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const pt = this.particles[i];
                pt.x += pt.vx;
                pt.y += pt.vy;
                pt.alpha -= pt.decay;

                if (pt.alpha <= 0) {
                    this.particles.splice(i, 1);
                    continue;
                }

                ctx.save();
                ctx.globalAlpha = Math.max(0, pt.alpha);
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
                ctx.fillStyle = pt.color;
                ctx.shadowColor = pt.color;
                ctx.shadowBlur = 6;
                ctx.fill();
                ctx.restore();
            }
        }

        // =========================================================================
        // VIEW 4: MÀN HÌNH TỔNG KẾT KẾT QUẢ MÀN CHƠI
        // =========================================================================
        buildSummaryHTML() {
            const total = this.wordList.length;
            const mistakes = this.mistakeWords.length;
            const mastered = Math.max(total - mistakes, 0);
            const accuracy = total > 0 ? Math.round((mastered / total) * 100) : 100;

            return `
                <div class="w-full max-w-xl mx-auto space-y-6 pt-6 pb-16">
                    <div class="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6">
                        
                        <!-- Celebration Icon -->
                        <div class="w-20 h-20 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-300 flex items-center justify-center text-3xl mx-auto shadow-inner">
                            🚀
                        </div>

                        <div class="space-y-1">
                            <span class="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-extrabold text-xs">
                                HOÀN THÀNH ĐẤU TRƯỜNG GUNDAM
                            </span>
                            <h2 class="text-2xl font-black text-slate-900 dark:text-white">
                                Xuất sắc! Bạn đã vượt qua màn chơi!
                            </h2>
                            <p class="text-xs text-slate-500">
                                Chủ đề: <strong>${this.selectedTopic}</strong> • Trình độ: <strong>Level ${this.selectedLevel}</strong>
                            </p>
                        </div>

                        <!-- Stats Box -->
                        <div class="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                            <div>
                                <div class="text-2xl font-black text-cyan-600 dark:text-cyan-400">${mastered}/${total}</div>
                                <div class="text-[11px] font-bold text-slate-500">Thuộc trọn vẹn</div>
                            </div>
                            <div>
                                <div class="text-2xl font-black text-amber-500">${accuracy}%</div>
                                <div class="text-[11px] font-bold text-slate-500">Độ chính xác</div>
                            </div>
                            <div>
                                <div class="text-2xl font-black text-purple-600 dark:text-purple-400">+${this.earnedXP}</div>
                                <div class="text-[11px] font-bold text-slate-500">XP Thưởng</div>
                            </div>
                        </div>

                        <!-- Auto-saved to Notebook notification -->
                        <div class="p-3 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-xs font-bold text-amber-900 dark:text-amber-300 flex items-center justify-center gap-2">
                            <span>🔖</span>
                            <span>Đã tự động lưu <strong>${mastered} từ vựng mới</strong> vào Sổ tay từ vựng của bạn!</span>
                        </div>

                        <!-- Danh sách từ cần ôn lại nếu có -->
                        ${mistakes > 0 ? `
                            <div class="text-left space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                                <div class="text-xs font-extrabold text-rose-500 flex items-center gap-1.5">
                                    <i class="fa-solid fa-circle-exclamation"></i>
                                    <span>Từ vựng cần chú ý luyện thêm (${mistakes} từ):</span>
                                </div>
                                <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                                    ${this.mistakeWords.map(w => `
                                        <div class="p-2 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs flex items-center justify-between">
                                            <span class="font-extrabold text-rose-700 dark:text-rose-300">${w.word}</span>
                                            <span class="text-slate-500 text-[11px]">${w.meaning}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}

                        <!-- Action Buttons -->
                        <div class="flex flex-col sm:flex-row items-center gap-3 pt-2">
                            <button onclick="VocabGameWorkstation.resetSessionWords()" 
                                class="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-95 text-white font-black text-xs shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2">
                                <i class="fa-solid fa-rotate"></i>
                                <span>Luyện tiếp với bộ từ mới (Reset)</span>
                            </button>

                            <button onclick="VocabGameWorkstation.backToConfig()" 
                                class="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer">
                                <span>Chọn chủ đề / Tải file khác</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }
    }

    // Khởi tạo Singleton
    const instance = new VocabGameWorkstation();
    window.VocabGameWorkstation = instance;
    window.vocabGameWorkstation = instance;

})(window);
