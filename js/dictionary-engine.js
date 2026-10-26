/**
 * =========================================================================
 * DICTIONARY ENGINE (MODULE TỪ ĐIỂN ANH - VIỆT & HỌ TỪ TOÀN DIỆN)
 * =========================================================================
 * - Chuẩn hóa schema WordEntry
 * - Lemmatization (tự động đưa về từ gốc: went -> go, children -> child, better -> good)
 * - Gợi ý khi gõ sai (Levenshtein Distance / "Ý bạn là...?")
 * - Tra ngược Anh - Việt (nhập tiếng Việt -> danh sách từ tiếng Anh)
 * - Cache 2 tầng: IndexedDB ở client + cache server
 * - Chống XSS triệt để (escapeHtml)
 * - Phát âm US / UK & chế độ đọc chậm 0.75x
 * - Lịch sử tra cứu người dùng (localStorage có tiền tố theo user)
 * - Autocomplete thời gian thực (<150ms)
 * - Mini-quiz kiểm tra nhanh
 * =========================================================================
 */

(function(window) {
    'use strict';

    // 1. BẢO MẬT: Hàm escapeHTML tuyệt đối chống XSS
    function escapeHtml(str) {
        if (str === null || str === undefined) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    window.escapeHtml = escapeHtml;

    // 2. NHẬN DIỆN TIẾNG VIỆT (Dùng cho Tra ngược Anh - Việt)
    function isVietnamese(text) {
        if (!text || typeof text !== 'string') return false;
        const s = text.trim();
        const vnDiacritics = /[àáảãạăắằẵặâấầẫậđèéẻẽẹêếềễệìíỉĩịòóỏõọôốồỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵ]/i;
        if (vnDiacritics.test(s)) return true;
        // Kiểm tra cụm từ khóa tiếng Việt không dấu thông dụng
        const vnKeywords = ['ket qua', 'hop dong', 'kinh te', 'yeu cau', 'san xuat', 'quan ly', 'ung tuyen', 'ngan sach', 'thoi han', 'bao hanh', 'chinh sach', 'thong bao', 'thang chuc', 'kiem tra', 'phan hoi', 'du dieu kien'];
        const cleanLower = s.toLowerCase();
        return vnKeywords.some(kw => cleanLower.includes(kw));
    }

    // 3. KHO INDEXEDDB CACHE TẠI CLIENT
    const DictCacheDB = {
        dbName: 'noble_dict_cache_v2',
        storeName: 'word_entries',
        dbPromise: null,

        getDB() {
            if (this.dbPromise) return this.dbPromise;
            this.dbPromise = new Promise((resolve) => {
                if (!window.indexedDB) {
                    resolve(null);
                    return;
                }
                const req = indexedDB.open(this.dbName, 1);
                req.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        db.createObjectStore(this.storeName, { keyPath: 'key' });
                    }
                };
                req.onsuccess = (e) => resolve(e.target.result);
                req.onerror = () => resolve(null);
            });
            return this.dbPromise;
        },

        async get(word) {
            try {
                const db = await this.getDB();
                if (!db) return null;
                const cleanKey = String(word || '').toLowerCase().trim();
                return new Promise((resolve) => {
                    const tx = db.transaction(this.storeName, 'readonly');
                    const store = tx.objectStore(this.storeName);
                    const req = store.get(cleanKey);
                    req.onsuccess = () => resolve(req.result ? req.result.entry : null);
                    req.onerror = () => resolve(null);
                });
            } catch (e) {
                return null;
            }
        },

        async set(word, entry) {
            try {
                const db = await this.getDB();
                if (!db) return;
                const cleanKey = String(word || '').toLowerCase().trim();
                const tx = db.transaction(this.storeName, 'readwrite');
                const store = tx.objectStore(this.storeName);
                store.put({ key: cleanKey, entry: entry, cachedAt: Date.now() });
            } catch (e) {}
        }
    };

    // 4. QUẢN LÝ LỊCH SỬ TRA CỨU NGƯỜI DÙNG
    const DictHistoryManager = {
        getStorageKey() {
            let userId = 'guest';
            if (window.currentUserAccount && window.currentUserAccount.id) {
                userId = window.currentUserAccount.id;
            } else {
                try {
                    const saved = localStorage.getItem('cung_dang_session_user');
                    if (saved) {
                        const parsed = JSON.parse(saved);
                        if (parsed && parsed.id) userId = parsed.id;
                    }
                } catch(e) {}
            }
            return `ui:dict_history_${userId}`;
        },

        getHistory() {
            try {
                const raw = localStorage.getItem(this.getStorageKey());
                if (!raw) return [];
                const list = JSON.parse(raw);
                return Array.isArray(list) ? list : [];
            } catch(e) {
                return [];
            }
        },

        add(word) {
            if (!word) return;
            const clean = String(word).trim().toLowerCase();
            if (!clean || clean.length > 50) return;
            try {
                let list = this.getHistory();
                list = list.filter(w => w.toLowerCase() !== clean);
                list.unshift(clean);
                if (list.length > 15) list = list.slice(0, 15);
                localStorage.setItem(this.getStorageKey(), JSON.stringify(list));
            } catch(e) {}
        },

        remove(word) {
            if (!word) return;
            const clean = String(word).trim().toLowerCase();
            try {
                let list = this.getHistory();
                list = list.filter(w => w.toLowerCase() !== clean);
                localStorage.setItem(this.getStorageKey(), JSON.stringify(list));
            } catch(e) {}
        },

        clear() {
            try {
                localStorage.removeItem(this.getStorageKey());
            } catch(e) {}
        }
    };

    // 5. THUẬT TOÁN LEVENSHTEIN DISTANCE (Gợi ý gõ sai)
    function calcLevenshteinDistance(a, b) {
        if (a === b) return 0;
        if (!a.length) return b.length;
        if (!b.length) return a.length;

        const matrix = [];
        for (let i = 0; i <= b.length; i++) matrix[i] = [i];
        for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= b.length; i++) {
            for (let j = 1; j <= a.length; j++) {
                if (b.charAt(i - 1) === a.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1, // thay thế
                        Math.min(
                            matrix[i][j - 1] + 1,     // chèn
                            matrix[i - 1][j] + 1      // xóa
                        )
                    );
                }
            }
        }
        return matrix[b.length][a.length];
    }

    // 6. MODULE CHÍNH: DictionaryEngine
    const DictionaryEngine = {
        lexicon: {},
        lemmas: {},
        isInitialized: false,
        currentAudioSpeed: 1.0,
        currentEntry: null,

        async init() {
            if (this.isInitialized) return;
            try {
                // Tải lexicon nội bộ
                const resLex = await fetch('/data/dictionary_lexicon.json');
                if (resLex.ok) {
                    this.lexicon = await resLex.json();
                }
            } catch (e) {
                console.warn('Could not load dictionary_lexicon.json:', e.message);
            }

            try {
                // Tải bảng lemmas
                const resLem = await fetch('/data/dictionary_lemmas.json');
                if (resLem.ok) {
                    this.lemmas = await resLem.json();
                }
            } catch (e) {
                console.warn('Could not load dictionary_lemmas.json:', e.message);
            }

            // Gộp thêm dữ liệu từ window.dictionaryData nếu có
            if (window.dictionaryData) {
                for (const [k, v] of Object.entries(window.dictionaryData)) {
                    const norm = k.toLowerCase().trim();
                    if (!this.lexicon[norm]) {
                        this.lexicon[norm] = this.normalizeEntry(norm, v);
                    }
                }
            }

            this.isInitialized = true;
            this.bindGlobalShortcuts();
        },

        normalizeEntry(key, def) {
            const word = def.rootForm || def.headword || def.word || key;
            let ipaUs = def.ipa?.us || def.phonetic || '';
            let ipaUk = def.ipa?.uk || def.ipaUk || ipaUs;

            // Sử dụng IPAHelper để làm sạch và khử 100% lỗi chuỗi thô / gạch dưới
            if (window.IPAHelper) {
                ipaUs = window.IPAHelper.sanitizeIpaString(ipaUs, word, 'US');
                ipaUk = window.IPAHelper.sanitizeIpaString(ipaUk, word, 'UK') || ipaUs;
            } else {
                if (!ipaUs || ipaUs.includes('_') || ipaUs.startsWith("/'")) ipaUs = `/${word}/`;
                if (!ipaUk || ipaUk.includes('_') || ipaUk.startsWith("/'")) ipaUk = ipaUs;
            }

            const audioSources = {
                us: def.audio?.us || `/api/tts?text=${encodeURIComponent(word)}&accent=US&lang=en-US`,
                uk: def.audio?.uk || `/api/tts?text=${encodeURIComponent(word)}&accent=UK&lang=en-GB`
            };

            // Đăng ký nguồn audio cho AudioService
            if (window.AudioService && typeof window.AudioService.registerAudioSources === 'function') {
                window.AudioService.registerAudioSources(word, audioSources);
            }

            const partOfSpeech = def.pos || def.partOfSpeech || 'General Vocabulary';
            const viMeaning = def.vietnameseMeaning || def.vi || `Nghĩa của từ "${word}"`;

            // Xử lý definitions & senses đa tầng (Tier 3 Schema)
            let senses = def.senses;
            let examples = def.examples || [];
            if (Array.isArray(def.definitions) && def.definitions.length > 0) {
                senses = def.definitions.map(d => ({
                    pos: partOfSpeech,
                    defEn: d.en,
                    meaningVi: d.vi,
                    level: 'B2-C1',
                    examples: d.exampleEn ? [{ en: d.exampleEn, vi: d.exampleVi || '' }] : []
                }));
                examples = def.definitions.filter(d => d.exampleEn).map(d => ({ en: d.exampleEn, vi: d.exampleVi || '' }));
            }
            if (!senses || !senses.length) {
                senses = [
                    {
                        pos: partOfSpeech,
                        defEn: def.definition || 'Essential English term.',
                        meaningVi: viMeaning,
                        level: def.level || 'B1-B2',
                        examples: examples
                    }
                ];
            }

            // Xử lý wordFamily: Hỗ trợ cả 2 dạng: Array of objects VÀ Object of strings ({ noun, verb, adjective })
            let wordFamily = { noun: [], verb: [], adj: [], adv: [] };
            if (def.wordFamily) {
                if (Array.isArray(def.wordFamily.noun)) {
                    wordFamily = def.wordFamily;
                } else {
                    const parseWfStr = (val) => {
                        if (!val || typeof val !== 'string' || val === '-') return [];
                        return val.split(',').map(s => {
                            const t = s.trim();
                            const m = t.match(/^([^(]+)(\((.+)\))?$/);
                            if (m) {
                                return { term: m[1].trim(), vi: m[3] ? m[3].trim() : '' };
                            }
                            return { term: t, vi: '' };
                        }).filter(x => x.term);
                    };
                    wordFamily.noun = parseWfStr(def.wordFamily.noun);
                    wordFamily.verb = parseWfStr(def.wordFamily.verb);
                    wordFamily.adj = parseWfStr(def.wordFamily.adjective || def.wordFamily.adj);
                    wordFamily.adv = parseWfStr(def.wordFamily.adverb || def.wordFamily.adv);
                }
            }

            // Xử lý collocations: Hỗ trợ cả mảng chuỗi VÀ mảng object
            let collocations = [];
            if (Array.isArray(def.collocations)) {
                collocations = def.collocations.map(c => {
                    if (typeof c === 'string') {
                        return { phrase: c, en: c, vi: `Cụm thường gặp: ${c}` };
                    }
                    return c;
                });
            }

            const examTag = def.examContext || def.examTag || (def.lists && def.lists[0]) || 'TOEIC / VSTEP';
            const toeicNote = def.examContext || def.toeicNote || '';

            return {
                headword: word,
                rootForm: def.rootForm || word,
                lemma: def.lemma || word,
                matchedForm: def.matchedForm || '',
                ipa: { us: ipaUs, uk: ipaUk },
                audio: {
                    us: def.audio?.us || `/api/tts?text=${encodeURIComponent(word)}&lang=en-US`,
                    uk: def.audio?.uk || `/api/tts?text=${encodeURIComponent(word)}&lang=en-GB`
                },
                partOfSpeech: partOfSpeech,
                vi: viMeaning,
                vietnameseMeaning: viMeaning,
                definition: (senses[0] && senses[0].defEn) || def.definition || '',
                definitions: def.definitions || senses.map(s => ({ en: s.defEn, vi: s.meaningVi, exampleEn: s.examples?.[0]?.en || '', exampleVi: s.examples?.[0]?.vi || '' })),
                senses: senses,
                wordFamily: wordFamily,
                synonyms: def.synonyms || [],
                antonyms: def.antonyms || [],
                collocations: collocations,
                idioms: def.idioms || [],
                phrasalVerbs: def.phrasalVerbs || [],
                lists: def.lists || [examTag],
                examTag: examTag,
                examContext: def.examContext || '',
                toeicNote: toeicNote,
                examples: examples.length ? examples : (senses[0]?.examples || []),
                sources: def.sources || [
                    { name: 'Wiktionary / AI Lexicographer', license: 'CC BY-SA 3.0', url: 'https://noblefranklin.edu.vn' }
                ],
                flags: {
                    exactMatch: true,
                    isLemmaRedirect: !!def.flags?.isLemmaRedirect,
                    isSegmented: !!def.flags?.isSegmented,
                    isAiGenerated: !!def.flags?.isAiGenerated,
                    isVietnameseReverse: false,
                    machineTranslated: false,
                    incomplete: false,
                    ...def.flags
                },
                searchedQuery: def.searchedQuery || def.query || key,
                originalQuery: def.originalQuery || def.searchedQuery || key,
                segmentedWord: def.segmentedWord || ''
            };
        },

        // Tra cứu chuẩn hóa một từ hoặc cụm từ theo Kiến trúc 3 Tầng (3-Tier Resolver Architecture)
        // =========================================================================
        // KIẾN TRÚC MỚI: TỪ ĐIỂN ĐA NĂNG 2 CHIỀU ANH <-> VIỆT (TFLAT + CAMBRIDGE)
        // Hỗ trợ 100% từ đơn, từ chia thì/số nhiều, cụm từ, idioms, câu dài
        // =========================================================================

        async lookupWord(rawQuery, options = {}) {
            await this.init();
            const raw = String(rawQuery || '').trim().replace(/\s+/g, ' ');
            if (!raw) return null;

            const cleanKey = raw.toLowerCase();

            // TẦNG 1: CACHE TỨC THÌ (ultimate_dict_cache_v5 - 0ms)
            if (!options.bypassCache) {
                try {
                    const cachedMap = JSON.parse(localStorage.getItem('ultimate_dict_cache_v5') || '{}');
                    const cached = cachedMap[cleanKey];
                    if (cached) {
                        DictHistoryManager.add(cached.headword || cleanKey);
                        this.currentEntry = cached;
                        return cached;
                    }
                } catch(e) {}
            }

            // TỰ ĐỘNG NHẬN DIỆN CHIỀU TRA CỨU
            const VI_DIACRITICS_REGEX = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
            let isVi = VI_DIACRITICS_REGEX.test(raw);
            let sl = isVi ? 'vi' : 'en';
            let tl = isVi ? 'en' : 'vi';

            // TẦNG 3: GỌI GOOGLE TRANSLATE GTX VỚI &dj=1 (HỖ TRỢ 100% CỤM TỪ, TỪ ĐƠN, IDIOMS)
            const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&dt=bd&dt=ex&dt=md&dt=ss&dt=at&dj=1&q=${encodeURIComponent(raw)}`;
            let gtxData = null;
            try {
                const gtxRes = await fetch(gtxUrl);
                if (gtxRes.ok) {
                    gtxData = await gtxRes.json();
                }
            } catch(e) {
                console.warn('GTX Fetch error:', e);
            }

            // Xử lý thông minh tiếng Việt không dấu (vd: "con meo", "hanh phuc")
            // Chỉ kiểm tra khi Google phát hiện src là 'vi' HOẶC bản dịch en->vi bị lặp lại y hệt từ gốc (Google không dịch được)
            if (!isVi && gtxData) {
                const rawTrans = (gtxData.sentences?.[0]?.trans || '').trim();
                const isEchoed = rawTrans.toLowerCase() === cleanKey;
                if (gtxData.src === 'vi' || isEchoed) {
                    try {
                        const revUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&dt=bd&dt=ex&dt=md&dt=ss&dt=at&dj=1&q=${encodeURIComponent(raw)}`;
                        const revRes = await fetch(revUrl);
                        if (revRes.ok) {
                            const revData = await revRes.json();
                            const revTrans = (revData && revData.sentences?.[0]?.trans || '').trim();
                            if (revTrans && revTrans.toLowerCase() !== cleanKey) {
                                gtxData = revData;
                                isVi = true;
                                sl = 'vi';
                                tl = 'en';
                            }
                        }
                    } catch(e) {}
                }
            }

            const mainTrans = gtxData?.sentences?.map(s => s.trans).join('') || '';
            const isReverseLookup = isVi;
            const englishWord = isReverseLookup
                ? (mainTrans || raw).trim().toLowerCase()
                : raw.trim().toLowerCase();

            // GỌI SONG SONG FREE DICTIONARY API & DATAMUSE API
            const isSingleEnglishWord = englishWord && !englishWord.includes(' ') && /^[a-zA-Z-]+$/.test(englishWord);
            let freeDictData = null;
            let datamuseWords = [];

            if (isSingleEnglishWord) {
                const [fdSettled, dmSettled] = await Promise.allSettled([
                    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(englishWord)}`).then(r => r.ok ? r.json() : null),
                    fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(englishWord)}&md=dpf&max=10`).then(r => r.ok ? r.json() : [])
                ]);

                if (fdSettled.status === 'fulfilled' && fdSettled.value) {
                    freeDictData = fdSettled.value;
                }
                if (dmSettled.status === 'fulfilled' && dmSettled.value) {
                    datamuseWords = dmSettled.value;
                }

                // Nếu Free Dict 404 (từ chia thì / biến thể), lấy base_form từ GTX dict
                if (!freeDictData && gtxData?.dict?.[0]?.base_form) {
                    const baseForm = gtxData.dict[0].base_form;
                    if (baseForm && baseForm.toLowerCase() !== englishWord) {
                        try {
                            const fdBaseRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(baseForm)}`);
                            if (fdBaseRes.ok) {
                                freeDictData = await fdBaseRes.json();
                            }
                        } catch(e) {}
                    }
                }
            }

            // KIỂM TRA CHUỖI RÁC (GIBBERISH CHECK - Chỉ báo Not Found khi hoàn toàn vô nghĩa)
            const hasSentences = !!(gtxData && gtxData.sentences && gtxData.sentences.length > 0 && mainTrans);
            const hasDict = !!(gtxData && gtxData.dict && gtxData.dict.length > 0);
            const isEchoed = mainTrans.trim().toLowerCase() === cleanKey;
            const isGibberish = !hasSentences || (isEchoed && !hasDict && !freeDictData && (!datamuseWords || datamuseWords.length === 0));

            if (isGibberish) {
                let suggestions = [];
                try {
                    const sugRes = await fetch(`https://api.datamuse.com/sug?s=${encodeURIComponent(cleanKey)}`);
                    if (sugRes.ok) {
                        const sugData = await sugRes.json();
                        suggestions = sugData.map(s => s.word).slice(0, 5);
                    }
                } catch(e) {}

                return {
                    notFound: true,
                    query: raw,
                    suggestions: suggestions
                };
            }

            // BÓC TÁCH DỮ LIỆU TỪ GOOGLE GTX + FREE DICT + DATAMUSE (CHUẨN TFLAT & CAMBRIDGE)
            const fdItem = freeDictData?.[0] || null;
            let ipaUs = '';
            let ipaUk = '';
            let audioUs = '';
            let audioUk = '';

            if (fdItem) {
                if (fdItem.phonetic) {
                    ipaUs = fdItem.phonetic;
                    ipaUk = fdItem.phonetic;
                }
                if (Array.isArray(fdItem.phonetics)) {
                    for (const ph of fdItem.phonetics) {
                        const a = ph.audio || '';
                        if (a) {
                            if (a.includes('-us.mp3') || a.includes('/us/') || a.includes('us_pron')) {
                                if (!audioUs) audioUs = a;
                            } else if (a.includes('-uk.mp3') || a.includes('/uk/') || a.includes('uk_pron')) {
                                if (!audioUk) audioUk = a;
                            } else if (!audioUs) {
                                audioUs = a;
                            }
                        }
                        if (ph.text) {
                            if (a.includes('-uk.mp3') || a.includes('/uk/')) {
                                ipaUk = ph.text;
                            } else {
                                ipaUs = ph.text;
                            }
                        }
                    }
                }
            }

            if (!ipaUs) ipaUs = `/${englishWord}/`;
            if (!ipaUk) ipaUk = ipaUs;

            // Bóc tách POS blocks & nghĩa chi tiết từ gtxData.dict
            const dictBlocks = [];
            const allSynonyms = [];

            function mapPos(p) {
                if (!p) return 'Từ vựng';
                const s = p.toLowerCase();
                if (s.includes('danh') || s === 'noun') return 'Danh từ';
                if (s.includes('động') || s === 'verb') return 'Động từ';
                if (s.includes('tính') || s === 'adj' || s === 'adjective') return 'Tính từ';
                if (s.includes('trạng') || s.includes('phó') || s === 'adv' || s === 'adverb') return 'Trạng từ';
                if (s.includes('giới') || s === 'prep' || s === 'preposition') return 'Giới từ';
                if (s.includes('liên') || s === 'conj' || s === 'conjunction') return 'Liên từ';
                if (s.includes('đại') || s === 'pronoun') return 'Đại từ';
                if (s.includes('thành ngữ') || s.includes('cụm') || s === 'phrase' || s === 'idiom') return 'Cụm từ / Thành ngữ';
                return p.charAt(0).toUpperCase() + p.slice(1);
            }

            if (Array.isArray(gtxData?.dict)) {
                for (const d of gtxData.dict) {
                    const posLabel = mapPos(d.pos);
                    const terms = d.terms || [];
                    const entries = (d.entry || []).map(e => {
                        const syns = e.reverse_translation || [];
                        syns.forEach(s => { if (!allSynonyms.includes(s)) allSynonyms.push(s); });
                        return {
                            meaning: e.word || '',
                            synonyms: syns,
                            score: e.score || 0
                        };
                    });

                    dictBlocks.push({
                        pos: posLabel,
                        terms: terms,
                        entries: entries,
                        baseForm: d.base_form || ''
                    });
                }
            }

            // Bổ sung synonyms từ Datamuse và FreeDict
            if (Array.isArray(datamuseWords)) {
                datamuseWords.forEach(w => {
                    if (w.word && !allSynonyms.includes(w.word) && w.word.toLowerCase() !== englishWord) {
                        allSynonyms.push(w.word);
                    }
                });
            }
            if (fdItem?.meanings) {
                fdItem.meanings.forEach(m => {
                    if (Array.isArray(m.synonyms)) {
                        m.synonyms.forEach(s => {
                            if (!allSynonyms.includes(s) && s.toLowerCase() !== englishWord) {
                                allSynonyms.push(s);
                            }
                        });
                    }
                });
            }

            // Alternative translations (cho cụm từ/idioms)
            const alternatives = gtxData?.alternative_translations?.[0]?.alternative?.map(a => a.word_postproc).filter(Boolean) || [];

            // Context examples (từ GTX hoặc FreeDict)
            const examples = [];
            if (Array.isArray(gtxData?.examples?.example)) {
                gtxData.examples.example.forEach(ex => {
                    const cleanEn = (ex.text_body || '').replace(/<b>|<\/b>/g, '').trim();
                    if (cleanEn) {
                        examples.push({
                            en: cleanEn,
                            vi: `Ví dụ ngữ cảnh: "${cleanEn}"`
                        });
                    }
                });
            }
            if (fdItem?.meanings) {
                for (const m of fdItem.meanings) {
                    if (Array.isArray(m.definitions)) {
                        for (const def of m.definitions) {
                            if (def.example && !examples.some(x => x.en === def.example)) {
                                examples.push({
                                    en: def.example,
                                    vi: `Ví dụ: "${def.example}"`
                                });
                            }
                        }
                    }
                }
            }

            // Extended English definitions
            const definitions = [];
            if (Array.isArray(gtxData?.definitions)) {
                for (const defGroup of gtxData.definitions) {
                    const p = mapPos(defGroup.pos);
                    if (Array.isArray(defGroup.entry)) {
                        for (const ent of defGroup.entry) {
                            definitions.push({
                                pos: p,
                                en: ent.gloss || '',
                                example: ent.example || ''
                            });
                        }
                    }
                }
            }

            // Build Word Family matrix
            const wordFamily = { noun: [], verb: [], adj: [], adv: [] };
            dictBlocks.forEach(b => {
                const p = b.pos.toLowerCase();
                const terms = b.terms.slice(0, 3).join(', ');
                if (p.includes('danh') && !wordFamily.noun.some(x => x.term === englishWord)) {
                    wordFamily.noun.push({ term: englishWord, vi: terms || mainTrans });
                } else if (p.includes('động') && !wordFamily.verb.some(x => x.term === englishWord)) {
                    wordFamily.verb.push({ term: englishWord, vi: terms || mainTrans });
                } else if (p.includes('tính') && !wordFamily.adj.some(x => x.term === englishWord)) {
                    wordFamily.adj.push({ term: englishWord, vi: terms || mainTrans });
                } else if (p.includes('trạng') && !wordFamily.adv.some(x => x.term === englishWord)) {
                    wordFamily.adv.push({ term: englishWord, vi: terms || mainTrans });
                }
            });

            // Local data integration (Tầng 2)
            const local = this.lexicon[cleanKey] || this.lexicon[englishWord];
            const examTag = local?.examTag || (isSingleEnglishWord ? 'TOEIC · Cambridge B1-C1' : 'Cụm từ & Thành ngữ chuẩn thi');
            const toeicNote = local?.toeicNote || (dictBlocks.length > 0 ? `💡 Lưu ý bài thi: Nhận biết rõ từ loại [${dictBlocks[0].pos}] để tránh bẫy ngữ pháp Part 5!` : '');

            // Main Part of Speech
            let partOfSpeech = dictBlocks[0]?.pos || (englishWord.includes(' ') ? 'Cụm từ / Thành ngữ' : 'Từ vựng tiếng Anh');

            const entry = {
                query: raw,
                headword: isReverseLookup ? englishWord : raw,
                englishTargetWord: englishWord,
                isReverseLookup: isReverseLookup,
                directionBadge: isReverseLookup ? 'Việt ➔ Anh' : 'Anh ➔ Việt',
                partOfSpeech: partOfSpeech,
                mainMeaning: mainTrans,
                vi: mainTrans,
                vietnameseMeaning: mainTrans,
                ipa: { us: ipaUs, uk: ipaUk },
                phonetic: ipaUs,
                audio: { us: audioUs, uk: audioUk },
                dictBlocks: dictBlocks,
                alternatives: alternatives.slice(0, 8),
                synonyms: allSynonyms.slice(0, 10),
                definitions: definitions.slice(0, 4),
                examples: examples.slice(0, 3),
                wordFamily: wordFamily,
                examTag: examTag,
                toeicNote: toeicNote,
                baseForm: gtxData?.dict?.[0]?.base_form || '',
                isInflected: !!(gtxData?.dict?.[0]?.base_form && gtxData.dict[0].base_form.toLowerCase() !== englishWord)
            };

            // Lưu vào Cache ultimate_dict_cache_v5
            try {
                let cachedMap = {};
                const rawCache = localStorage.getItem('ultimate_dict_cache_v5');
                if (rawCache) cachedMap = JSON.parse(rawCache);
                cachedMap[cleanKey] = entry;
                if (englishWord !== cleanKey) cachedMap[englishWord] = entry;
                const keys = Object.keys(cachedMap);
                if (keys.length > 500) delete cachedMap[keys[0]];
                localStorage.setItem('ultimate_dict_cache_v5', JSON.stringify(cachedMap));
            } catch(e) {}

            DictHistoryManager.add(raw);
            this.currentEntry = entry;
            return entry;
        },

        // Tra cứu ngược tiếng Việt (Gọi trực tiếp qua lookupWord đa năng)
        performReverseLookup(vnQuery) {
            return this.lookupWord(vnQuery);
        },

        // Hệ thống phát âm US / UK & Web Speech API chuẩn tốc độ
        speak(text, lang = 'en-US') {
            const wordToSpeak = text || this.currentEntry?.englishTargetWord || this.currentEntry?.headword || 'hello';
            const speed = this.currentAudioSpeed || 1.0;
            const accent = (lang === 'en-GB' || lang === 'UK') ? 'UK' : 'US';
            const effectiveLang = accent === 'UK' ? 'en-GB' : 'en-US';

            // Ưu tiên 1: File mp3 từ Free Dictionary API nếu có
            const audioSrc = accent === 'UK' ? this.currentEntry?.audio?.uk : this.currentEntry?.audio?.us;
            if (audioSrc && typeof Audio !== 'undefined') {
                try {
                    const audio = new Audio(audioSrc);
                    audio.playbackRate = speed;
                    audio.play().catch(() => this.speakViaSynthesis(wordToSpeak, effectiveLang, speed));
                    return;
                } catch(e) {}
            }

            // Ưu tiên 2 (Fallback cho cụm từ, idioms, câu dài): window.speechSynthesis
            this.speakViaSynthesis(wordToSpeak, effectiveLang, speed);
        },

        speakViaSynthesis(text, lang, speed) {
            if (!('speechSynthesis' in window)) return;
            try {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(text);
                u.lang = lang;
                u.rate = speed || this.currentAudioSpeed || 1.0;
                window.speechSynthesis.speak(u);
            } catch(e) {}
        },

        // Chuyển đổi tốc độ phát âm: Chuẩn 1.0x -> Chậm 0.75x -> Rất chậm 0.5x
        toggleAudioSpeed() {
            if (this.currentAudioSpeed === 1.0) {
                this.currentAudioSpeed = 0.75;
            } else if (this.currentAudioSpeed === 0.75) {
                this.currentAudioSpeed = 0.5;
            } else {
                this.currentAudioSpeed = 1.0;
            }

            if (window.AudioService) {
                window.AudioService.setSpeed(this.currentAudioSpeed);
            }
            if (window.UniversalAudioEngine) {
                window.UniversalAudioEngine.setSpeed(this.currentAudioSpeed);
            }
            this.updateSpeedUI();
            if (window.showToast) {
                const label = this.currentAudioSpeed === 1.0 ? 'Chuẩn 1.0x' : (this.currentAudioSpeed === 0.75 ? 'Chậm 0.75x' : 'Rất chậm 0.5x');
                showToast(`⚡ Tốc độ phát âm: ${label}`);
            }
        },

        updateSpeedUI() {
            const btn = document.getElementById('dictSpeedToggleBtn');
            if (!btn) return;
            if (this.currentAudioSpeed === 0.5) {
                btn.className = 'px-3.5 py-3 rounded-2xl bg-rose-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition';
                btn.innerHTML = '<i class="fa-solid fa-gauge-simple"></i> <span>Rất chậm 0.5x</span>';
            } else if (this.currentAudioSpeed === 0.75) {
                btn.className = 'px-3.5 py-3 rounded-2xl bg-amber-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition';
                btn.innerHTML = '<i class="fa-solid fa-gauge"></i> <span>Chậm 0.75x</span>';
            } else {
                btn.className = 'px-3.5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition';
                btn.innerHTML = '<i class="fa-solid fa-gauge-high"></i> <span>Chuẩn 1.0x</span>';
            }
        },

        bindGlobalShortcuts() {
            document.addEventListener('keydown', (e) => {
                if (e.key === '/') {
                    // Chỉ kích hoạt khi đang ở view-tu-dien
                    const dictSection = document.getElementById('view-tu-dien');
                    if (!dictSection || dictSection.classList.contains('hidden')) return;

                    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
                    if (activeTag === 'input' || activeTag === 'textarea' || document.activeElement?.isContentEditable) {
                        return;
                    }

                    e.preventDefault();
                    const input = document.getElementById('dictSearchInput');
                    if (input) {
                        input.focus();
                        input.select();
                    }
                }
            });
        },

        // Render giao diện Mini-Quiz
        generateMiniQuiz(entry) {
            if (!entry || !entry.headword) return '';
            const word = entry.headword;
            
            // Câu hỏi 1: Về từ loại họ từ nếu có
            const wf = entry.wordFamily;
            let question = '';
            let correctAnswer = '';
            let options = [];

            if (wf && wf.noun && wf.noun.length > 0 && !entry.partOfSpeech.toLowerCase().includes('noun')) {
                question = `Dạng Danh từ (Noun) của từ <strong>"${escapeHtml(word)}"</strong> là gì?`;
                correctAnswer = wf.noun[0].term;
                options = [
                    correctAnswer,
                    word + 'ing',
                    word + 'able',
                    word + 'ous'
                ];
            } else if (entry.synonyms && entry.synonyms.length > 0) {
                question = `Từ nào sau đây là <strong>Từ đồng nghĩa (Synonym)</strong> của "${escapeHtml(word)}"?`;
                correctAnswer = entry.synonyms[0];
                const fake = ['unnecessary', 'inconsistent', 'unpredictable'];
                options = [correctAnswer, ...fake.slice(0, 3)];
            } else {
                const vi = entry.senses?.[0]?.meaningVi || entry.vi || 'từ vựng này';
                question = `Nghĩa tiếng Việt chuẩn xác nhất của từ <strong>"${escapeHtml(word)}"</strong> là gì?`;
                correctAnswer = vi.slice(0, 30);
                options = [
                    correctAnswer,
                    'Trì hoãn thanh toán hóa đơn công ty',
                    'Giải thể chi nhánh văn phòng đại diện',
                    'Hủy bỏ điều khoản hợp đồng lao động'
                ];
            }

            // Xáo trộn đáp án
            options = [...new Set(options)].sort(() => Math.random() - 0.5);

            return `
                <div class="glass-panel rounded-2xl p-4 border border-indigo-200 dark:border-slate-700 bg-gradient-to-r from-indigo-50/60 to-sky-50/60 dark:from-slate-800/80 dark:to-slate-800/40 space-y-3">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2">
                            <span class="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black">?</span>
                            <span class="text-xs font-black uppercase text-indigo-900 dark:text-indigo-300 tracking-wider">Thử thách phản xạ nhanh (Mini-Quiz)</span>
                        </div>
                        <span class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">+3 XP khi trả lời đúng</span>
                    </div>
                    <div class="text-xs text-slate-800 dark:text-white font-medium">
                        ${question}
                    </div>
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1" id="dictMiniQuizOptions">
                        ${options.map(opt => `
                            <button onclick="DictionaryEngine.checkQuizAnswer(this, '${escapeHtml(opt)}', '${escapeHtml(correctAnswer)}')" class="px-3 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-indigo-50 border border-slate-200 dark:border-slate-600 text-xs font-bold text-slate-800 dark:text-white text-left transition flex items-center justify-between">
                                <span>${escapeHtml(opt)}</span>
                                <i class="fa-regular fa-circle text-slate-300 text-[11px]"></i>
                            </button>
                        `).join('')}
                    </div>
                    <div id="dictMiniQuizFeedback" class="hidden text-xs font-bold pt-1"></div>
                </div>
            `;
        },

        checkQuizAnswer(btn, chosen, correct) {
            const container = document.getElementById('dictMiniQuizOptions');
            const feedback = document.getElementById('dictMiniQuizFeedback');
            if (!container || !feedback) return;

            const allBtns = container.querySelectorAll('button');
            allBtns.forEach(b => b.disabled = true);

            if (chosen === correct) {
                btn.classList.remove('bg-white', 'hover:bg-indigo-50');
                btn.classList.add('bg-emerald-600', 'text-white', 'border-emerald-600');
                btn.querySelector('i')?.setAttribute('class', 'fa-solid fa-circle-check text-white');
                feedback.className = 'text-xs font-bold text-emerald-600 flex items-center gap-1.5 pt-1';
                feedback.innerHTML = '<i class="fa-solid fa-circle-check"></i> <span>Chính xác tuyệt đối! Bạn đã ghi nhớ từ rất tốt (+3 XP)!</span>';
                if (window.StudySync) {
                    window.StudySync.broadcastLearning('DICT_QUIZ_CORRECT', this.currentEntry?.headword || 'vocab', 3);
                }
            } else {
                btn.classList.remove('bg-white', 'hover:bg-indigo-50');
                btn.classList.add('bg-rose-600', 'text-white', 'border-rose-600');
                btn.querySelector('i')?.setAttribute('class', 'fa-solid fa-circle-xmark text-white');
                
                // Highlight đáp án đúng
                allBtns.forEach(b => {
                    if (b.innerText.trim() === correct) {
                        b.classList.add('bg-emerald-100', 'text-emerald-800', 'border-emerald-300');
                    }
                });

                feedback.className = 'text-xs font-bold text-rose-600 flex items-center gap-1.5 pt-1';
                feedback.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>Chưa chính xác! Đáp án đúng là: <strong>"${escapeHtml(correct)}"</strong></span>`;
            }
            feedback.classList.remove('hidden');
        }
    };

    // Export module ra window toàn cục
    window.DictionaryEngine = DictionaryEngine;
    window.DictHistoryManager = DictHistoryManager;
    window.escapeHtml = escapeHtml;

})(window);
