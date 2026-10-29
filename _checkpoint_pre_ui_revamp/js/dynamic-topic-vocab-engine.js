/**
 * =========================================================================
 * DYNAMIC TOPIC VOCAB ENGINE (CEFR A1 - C2 & INFINITE VOCABULARY GENERATOR)
 * =========================================================================
 * Giải quyết triệt để tình trạng ít chủ đề và lặp lại từ vựng trong Đấu trường Gundam:
 * - Bước 1: Tự động dịch chủ đề tiếng Việt sang từ khóa tiếng Anh chuẩn qua Google GTX.
 * - Bước 2: Gọi Datamuse API (ml=${topic}&md=fpd&max=250) lấy 250 từ vựng chuyên sâu kèm tần suất xuất hiện f:.
 * - Bước 3: Phân loại chính xác 250 từ vào 6 khung trình độ CEFR (A1 - C2) theo chuẩn tần suất và độ dài.
 * - Bước 4: Lọc bỏ các từ đã xuất hiện trong session (lưu vào sessionStorage theo topic) để mỗi lần Reset là 100% từ mới.
 * - Bước 5: Bóc tách Nghĩa tiếng Việt chuẩn (Google GTX batch) và Phiên âm IPA thực tế (FreeDict + IPAHelper).
 * =========================================================================
 */

(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.DynamicTopicVocabEngine = factory();
    }
}(typeof self !== 'undefined' ? self : this, function() {
    'use strict';

    // Bảng từ khóa tiếng Anh nhanh cho các chủ đề phổ biến
    const TOPIC_PRESETS = {
        'công nghệ': 'technology software computer internet',
        'công nghệ (technology)': 'technology software computer internet',
        'du lịch': 'travel tourism journey hotel vacation',
        'du lịch (travel)': 'travel tourism journey hotel vacation',
        'kinh tế': 'business economy finance commerce trade',
        'kinh tế (business)': 'business economy finance commerce trade',
        'kinh tế & doanh nghiệp': 'business corporate marketing management finance',
        'thế giới totoro & ghibli': 'nature fantasy forest anime magic spirit animation',
        'phim hoạt hình ghibli': 'nature fantasy forest anime magic spirit animation',
        'phỏng vấn': 'job interview employment career recruitment resume',
        'phỏng vấn (job interview)': 'job interview employment career recruitment resume',
        'phỏng vấn xin việc': 'job interview employment career recruitment resume',
        'giao tiếp': 'conversation daily dialogue greeting talking communication',
        'giao tiếp (daily life)': 'conversation daily dialogue greeting talking communication',
        'giao tiếp đời sống': 'conversation daily dialogue greeting talking communication',
        'ẩm thực': 'food dining cooking restaurant cuisine recipe meal',
        'ẩm thực (food & dining)': 'food dining cooking restaurant cuisine recipe meal',
        'công sở': 'workplace corporate office meeting colleague employee',
        'công sở (workplace)': 'workplace corporate office meeting colleague employee',
        'hàng không': 'aviation flight airline airplane airport pilot',
        'bóng đá': 'football soccer sports stadium championship referee',
        'vũ trụ': 'space astronomy universe galaxy planet astronaut rocket',
        'y tế': 'medical healthcare doctor hospital clinic nurse treatment',
        'sức khỏe': 'health fitness wellness medicine exercise nutrition',
        'giáo dục': 'education university school student teacher exam study',
        'môi trường': 'environment nature climate ecology wildlife pollution forest',
        'thời trang': 'fashion clothing style apparel model designer garment',
        'âm nhạc': 'music instrument concert song melody artist band',
        'điện ảnh': 'cinema movie film actor director theater drama',
        'khoa học': 'science laboratory research experiment physics chemistry',
        'luật pháp': 'law legal justice court attorney judge lawyer',
        'xây dựng': 'construction building architecture engineering civil structure',
        'ngân hàng': 'banking investment money loan finance account credit',
        'thể thao': 'sports athlete tournament stadium game coach exercise',
        'động vật': 'animal wildlife pet mammal creature bird zoo',
        'thời tiết': 'weather climate temperature storm rain season winter'
    };

    const DynamicTopicVocabEngine = {
        topicPoolCache: {},
        sessionUsedWordsMap: {},

        toTopicSlug(raw) {
            if (!raw || typeof raw !== 'string') return 'general';
            return raw.toLowerCase().trim()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/[^a-z0-9]+/g, '_')
                .replace(/^_+|_+$/g, '') || 'general';
        },

        // 1. DỊCH CHỦ ĐỀ SANG TIẾNG ANH (Hỗ trợ cả Tiếng Việt và Tiếng Anh)
        async translateTopicToEnglish(rawTopic) {
            if (!rawTopic || typeof rawTopic !== 'string') return 'technology';
            const clean = rawTopic.trim().toLowerCase();

            // Kiểm tra preset map
            for (const [k, v] of Object.entries(TOPIC_PRESETS)) {
                if (clean === k || clean.includes(k) || k.includes(clean)) {
                    return v;
                }
            }

            // Kiểm tra nếu có dấu tiếng Việt -> Dịch qua Google GTX
            const VI_REGEX = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
            if (VI_REGEX.test(clean)) {
                try {
                    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&q=${encodeURIComponent(clean)}`;
                    const r = await fetch(url);
                    if (r.ok) {
                        const data = await r.json();
                        const trans = data?.[0]?.[0]?.[0];
                        if (trans && typeof trans === 'string') {
                            return trans.trim().toLowerCase();
                        }
                    }
                } catch (e) {
                    console.warn('Could not translate topic via Google GTX:', e);
                }
            }

            return clean;
        },

        // 2. GỌI DATAMUSE API LẤY 250 TỪ KÈM CHỈ SỐ TẦN SUẤT f: VÀ TỪ LOẠI
        async fetchWordsForTopic(englishTopic) {
            const cacheKey = englishTopic.toLowerCase().trim();
            if (this.topicPoolCache[cacheKey] && this.topicPoolCache[cacheKey].length > 0) {
                return this.topicPoolCache[cacheKey];
            }

            try {
                // Tách cụm từ nếu có để lấy từ khóa trọng tâm
                const primaryTerm = englishTopic.split(' ')[0] || englishTopic;
                const url = `https://api.datamuse.com/words?ml=${encodeURIComponent(englishTopic)}&md=fpd&max=250`;
                
                const r = await fetch(url);
                if (!r.ok) throw new Error(`Datamuse HTTP ${r.status}`);
                let data = await r.json();

                // Nếu số lượng ít, gọi thêm query với primaryTerm để làm giàu pool
                if (Array.isArray(data) && data.length < 80 && primaryTerm !== englishTopic) {
                    try {
                        const fallbackUrl = `https://api.datamuse.com/words?ml=${encodeURIComponent(primaryTerm)}&md=fpd&max=200`;
                        const r2 = await fetch(fallbackUrl);
                        if (r2.ok) {
                            const data2 = await r2.json();
                            if (Array.isArray(data2)) {
                                const existingWords = new Set(data.map(d => d.word.toLowerCase()));
                                for (const item of data2) {
                                    if (!existingWords.has(item.word.toLowerCase())) {
                                        data.push(item);
                                        existingWords.add(item.word.toLowerCase());
                                    }
                                }
                            }
                        }
                    } catch(e) {}
                }

                if (Array.isArray(data) && data.length > 0) {
                    this.topicPoolCache[cacheKey] = data;
                    return data;
                }
            } catch (e) {
                console.warn('Datamuse API error:', e);
            }

            return [];
        },

        // 3. TỰ ĐỘNG PHÂN LOẠI 250 TỪ VÀO 6 KHUNG TRÌNH ĐỘ CEFR (A1 - C2)
        // Tiêu chí:
        // - A1: f >= 30 và từ ngắn thông dụng (length <= 8)
        // - A2: 15 <= f < 30
        // - B1: 7 <= f < 15
        // - B2: 3 <= f < 7
        // - C1: 1 <= f < 3
        // - C2: f < 1
        classifyWordsIntoCEFR(rawWordList) {
            const buckets = {
                A1: [],
                A2: [],
                B1: [],
                B2: [],
                C1: [],
                C2: []
            };

            const seen = new Set();

            for (const item of rawWordList) {
                if (!item || !item.word) continue;
                const w = item.word.trim().toLowerCase();

                // Lọc từ hợp lệ: chỉ chấp nhận từ đơn hoặc từ nối bằng gạch đơn, độ dài 3-22 ký tự
                if (!/^[a-zA-Z-]{3,22}$/.test(w) || seen.has(w)) continue;
                // Bỏ qua một số từ hư từ tiếng Anh không mang nghĩa chủ đề
                if (['the', 'and', 'that', 'this', 'with', 'from', 'they', 'have', 'were'].includes(w)) continue;
                seen.add(w);

                let f = 5.0; // Tần suất mặc định nếu thiếu tag
                if (Array.isArray(item.tags)) {
                    for (const t of item.tags) {
                        if (typeof t === 'string' && t.startsWith('f:')) {
                            const val = parseFloat(t.substring(2));
                            if (!isNaN(val)) f = val;
                            break;
                        }
                    }
                }

                let level = 'C2';
                if (f >= 30 && w.length <= 8) {
                    level = 'A1';
                } else if (f >= 15) {
                    level = 'A2';
                } else if (f >= 7) {
                    level = 'B1';
                } else if (f >= 3) {
                    level = 'B2';
                } else if (f >= 1) {
                    level = 'C1';
                } else {
                    level = 'C2';
                }

                buckets[level].push({
                    word: w,
                    score: item.score || 0,
                    frequency: f,
                    level: level,
                    defs: item.defs || []
                });
            }

            return buckets;
        },

        // 4. LỌC BỎ CÁC TỪ ĐÃ XUẤT HIỆN TRONG CÁC LƯỢT CHƠI TRƯỚC (SESSION STORAGE)
        // Đảm bảo mỗi lần "Đổi từ mới (Reset)" hoặc tạo mới là 100% từ mới
        selectNonRepeatingWords(buckets, requestedLevel, requestedCount, topicKey) {
            const targetLevel = (requestedLevel || 'A2').toUpperCase().replace('LEVEL ', '').trim();
            const validLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(targetLevel) ? targetLevel : 'A2';
            const needed = Math.min(Math.max(parseInt(requestedCount, 10) || 10, 1), 50);

            // Thứ tự ưu tiên mở rộng khi cấp độ chính đã hết từ tươi mới
            const EXPANSION_ORDER = {
                A1: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
                A2: ['A2', 'A1', 'B1', 'B2', 'C1', 'C2'],
                B1: ['B1', 'A2', 'B2', 'A1', 'C1', 'C2'],
                B2: ['B2', 'B1', 'C1', 'A2', 'C2', 'A1'],
                C1: ['C1', 'B2', 'C2', 'B1', 'A2', 'A1'],
                C2: ['C2', 'C1', 'B2', 'B1', 'A2', 'A1']
            };

            const cleanTopicSlug = this.toTopicSlug(topicKey);
            const sessionKey = `gundam_topic_history_${cleanTopicSlug}_${validLevel}`;
            
            let usedWords = [];
            try {
                const rawStored = sessionStorage.getItem(sessionKey);
                if (rawStored) usedWords = JSON.parse(rawStored);
                if (!Array.isArray(usedWords)) usedWords = [];
            } catch (e) {}

            // Kết hợp với in-memory set để đảm bảo 100% không trùng ngay cả khi sessionStorage bị sandbox
            if (!this.sessionUsedWordsMap[sessionKey]) {
                this.sessionUsedWordsMap[sessionKey] = new Set(usedWords.map(w => w.toLowerCase()));
            }
            usedWords.forEach(w => this.sessionUsedWordsMap[sessionKey].add(w.toLowerCase()));
            const usedSet = this.sessionUsedWordsMap[sessionKey];

            // Thu thập candidate pool theo thứ tự cấp độ
            let candidatePool = [];
            const levelsToScan = EXPANSION_ORDER[validLevel] || ['A2', 'B1', 'A1', 'B2', 'C1', 'C2'];
            for (const lvl of levelsToScan) {
                const list = buckets[lvl] || [];
                for (const item of list) {
                    if (!candidatePool.some(x => x.word === item.word)) {
                        candidatePool.push(item);
                    }
                }
            }

            // Lọc các từ tươi mới
            let freshPool = candidatePool.filter(item => !usedSet.has(item.word.toLowerCase()));

            // Nếu số lượng từ mới còn lại trong pool nhỏ hơn số lượng yêu cầu, reset session của topic này
            if (freshPool.length < needed) {
                usedWords = [];
                usedSet.clear();
                freshPool = [...candidatePool];
            }

            // Chọn đủ số lượng từ
            const selected = freshPool.slice(0, needed);

            // Cập nhật session storage & in-memory set
            selected.forEach(item => {
                const lw = item.word.toLowerCase();
                usedWords.push(lw);
                usedSet.add(lw);
            });
            try {
                sessionStorage.setItem(sessionKey, JSON.stringify(usedWords));
            } catch (e) {}

            return selected;
        },

        // 5. TỰ ĐỘNG LẤY NGHĨA TIẾNG VIỆT CHUẨN XÁC & PHIÊN ÂM IPA THỰC TẾ
        // Tuyệt đối không để phiên âm giả dạng /word/
        async enrichWordsWithMeaningsAndIPA(selectedWordItems) {
            if (!selectedWordItems || selectedWordItems.length === 0) return [];

            const wordStrings = selectedWordItems.map(item => item.word);
            const meaningsMap = {};
            const ipaMap = {};

            // 5a. BATCH DỊCH NGHĨA TIẾNG VIỆT QUA GOOGLE GTX (Tối ưu 25 từ/request)
            const CHUNK_SIZE = 25;
            for (let i = 0; i < wordStrings.length; i += CHUNK_SIZE) {
                const chunk = wordStrings.slice(i, i + CHUNK_SIZE);
                const textToTranslate = chunk.join('\n');
                try {
                    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(textToTranslate)}`;
                    const r = await fetch(url);
                    if (r.ok) {
                        const data = await r.json();
                        if (Array.isArray(data?.[0])) {
                            const translatedLines = data[0].map(item => item[0]).join('').split('\n');
                            chunk.forEach((w, idx) => {
                                let trans = (translatedLines[idx] || '').trim();
                                if (trans && trans.toLowerCase() !== w.toLowerCase()) {
                                    meaningsMap[w] = trans;
                                }
                            });
                        }
                    }
                } catch (e) {
                    console.warn('Batch translation warning:', e);
                }
            }

            // 5b. TRA CỨU IPA & AUDIO MP3 THỰC TẾ (Local Lexicon -> FreeDict API -> IPAHelper)
            await Promise.allSettled(wordStrings.map(async (word) => {
                // 1. Kiểm tra Local DictionaryEngine hoặc DictionaryData
                const dictEngine = window.DictionaryEngine;
                if (dictEngine?.lexicon?.[word]) {
                    const loc = dictEngine.lexicon[word];
                    if (loc.vietnameseMeaning && !meaningsMap[word]) {
                        meaningsMap[word] = loc.vietnameseMeaning;
                    }
                    if (loc.ipa?.us && !loc.ipa.us.includes('_') && loc.ipa.us !== `/${word}/`) {
                        ipaMap[word] = loc.ipa.us;
                        return;
                    }
                }

                // 2. Gọi Free Dictionary API (Timeout 1.8s)
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 1800);
                    const fdRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (fdRes.ok) {
                        const fdData = await fdRes.json();
                        const entry = fdData?.[0];
                        if (entry) {
                            let ipa = entry.phonetic || '';
                            if (!ipa && Array.isArray(entry.phonetics)) {
                                for (const ph of entry.phonetics) {
                                    if (ph.text) { ipa = ph.text; break; }
                                }
                            }
                            if (ipa && !ipa.includes('_') && ipa !== `/${word}/`) {
                                ipaMap[word] = ipa;
                            }

                            // Đăng ký Audio URL nếu có
                            if (Array.isArray(entry.phonetics) && window.AudioService) {
                                let audioUs = '';
                                let audioUk = '';
                                for (const ph of entry.phonetics) {
                                    if (ph.audio) {
                                        if (ph.audio.includes('-us.mp3') || ph.audio.includes('/us/')) audioUs = ph.audio;
                                        else if (ph.audio.includes('-uk.mp3') || ph.audio.includes('/uk/')) audioUk = ph.audio;
                                        else if (!audioUs) audioUs = ph.audio;
                                    }
                                }
                                if (audioUs || audioUk) {
                                    window.AudioService.registerAudioSources?.(word, {
                                        us: audioUs || audioUk,
                                        uk: audioUk || audioUs
                                    });
                                }
                            }
                        }
                    }
                } catch (e) {}

                // 3. Fallback IPA chuẩn qua IPAHelper (Grapheme-to-Phoneme với ký tự ngữ âm chuẩn quốc tế)
                if (!ipaMap[word] || ipaMap[word] === `/${word}/`) {
                    if (window.IPAHelper && typeof window.IPAHelper.transcribePhrase === 'function') {
                        ipaMap[word] = window.IPAHelper.transcribePhrase(word, 'US');
                    } else {
                        ipaMap[word] = `/${word}/`;
                    }
                }
            }));

            // Ghép thành danh sách hoàn chỉnh chuẩn schema cho VocabGameWorkstation
            return selectedWordItems.map(item => {
                const w = item.word;
                let m = meaningsMap[w] || '';
                if (!m) {
                    if (item.defs && item.defs[0]) {
                        m = item.defs[0].replace(/^[a-z]+\t/, '').trim();
                    } else {
                        m = `từ vựng về ${item.level}`;
                    }
                }

                let phonetic = ipaMap[w] || '';
                // Tuyệt đối không để phiên âm giả dạng /word/
                if (!phonetic || phonetic === `/${w}/` || phonetic === `/${w.toLowerCase()}/`) {
                    if (window.IPAHelper && typeof window.IPAHelper.transcribePhrase === 'function') {
                        phonetic = window.IPAHelper.transcribePhrase(w, 'US');
                    }
                }

                return {
                    word: w,
                    meaning: m,
                    phonetic: phonetic,
                    level: item.level
                };
            });
        },

        // =========================================================================
        // HÀM CHÍNH ĐIỀU PHỐI: generateDynamicVocab
        // =========================================================================
        async generateDynamicVocab(rawTopic, requestedLevel, requestedCount) {
            console.log(`[DynamicTopicVocabEngine] Generating vocab for topic "${rawTopic}", level "${requestedLevel}", count ${requestedCount}...`);

            // Bước 1: Dịch chủ đề sang tiếng Anh
            const englishTopic = await this.translateTopicToEnglish(rawTopic);

            // Bước 2: Gọi Datamuse API lấy 250 từ
            let rawWords = await this.fetchWordsForTopic(englishTopic);

            // Fallback nếu Datamuse không ra kết quả với englishTopic
            if (!rawWords || rawWords.length === 0) {
                rawWords = await this.fetchWordsForTopic(rawTopic);
            }

            if (!rawWords || rawWords.length === 0) {
                console.warn('[DynamicTopicVocabEngine] No words found from Datamuse, falling back to curated bank.');
                return null;
            }

            // Bước 3: Phân loại 250 từ vào 6 khung CEFR
            const buckets = this.classifyWordsIntoCEFR(rawWords);

            // Bước 4: Lọc bỏ từ đã xuất hiện trong session để không trùng lặp
            const selected = this.selectNonRepeatingWords(buckets, requestedLevel, requestedCount, rawTopic);

            if (!selected || selected.length === 0) {
                return null;
            }

            // Bước 5: Bóc tách Nghĩa tiếng Việt chuẩn và IPA thực tế
            const finalWords = await this.enrichWordsWithMeaningsAndIPA(selected);
            console.log(`[DynamicTopicVocabEngine] Successfully generated ${finalWords.length} dynamic non-repeating words.`);
            return finalWords;
        }
    };

    return DynamicTopicVocabEngine;
}));
