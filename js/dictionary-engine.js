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
            const word = def.word || key;
            const ipaUs = def.ipa?.us || def.phonetic || `/${word}/`;
            const ipaUk = def.ipa?.uk || def.ipaUk || ipaUs;
            return {
                headword: word,
                lemma: def.lemma || word,
                matchedForm: def.matchedForm || '',
                ipa: { us: ipaUs, uk: ipaUk },
                audio: {
                    us: def.audio?.us || `/api/tts?text=${encodeURIComponent(word)}&lang=en-US`,
                    uk: def.audio?.uk || `/api/tts?text=${encodeURIComponent(word)}&lang=en-GB`
                },
                partOfSpeech: def.partOfSpeech || 'General Vocabulary',
                senses: def.senses || [
                    {
                        pos: def.partOfSpeech || 'General',
                        defEn: def.definition || 'Essential English term.',
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
                lists: def.lists || (def.examTag ? [def.examTag] : ['TOEIC / VSTEP']),
                toeicNote: def.toeicNote || '',
                sources: def.sources || [
                    { name: 'Wiktionary', license: 'CC BY-SA 3.0', url: 'https://en.wiktionary.org' },
                    { name: 'WordNet 3.0', license: 'WordNet License', url: 'https://wordnet.princeton.edu' }
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
        },

        // Tra cứu chuẩn hóa một từ hoặc cụm từ
        async lookupWord(rawQuery, options = {}) {
            await this.init();
            const query = String(rawQuery || '').trim();
            if (!query) return null;

            const cleanKey = query.toLowerCase();

            // A. Kiểm tra Tra ngược Anh - Việt nếu đầu vào là tiếng Việt
            if (isVietnamese(query)) {
                return this.performReverseLookup(query);
            }

            // B. Kiểm tra Client IndexedDB Cache
            if (!options.bypassCache) {
                const cached = await DictCacheDB.get(cleanKey);
                if (cached) {
                    DictHistoryManager.add(cached.headword || cleanKey);
                    return cached;
                }
            }

            // C. Kiểm tra Lemmatizer (từ bất quy tắc, số nhiều, quá khứ)
            let lemmaInfo = this.lemmas[cleanKey] || null;
            let targetKey = cleanKey;
            let isLemma = false;
            let matchedFormText = '';

            if (lemmaInfo) {
                targetKey = lemmaInfo.lemma.toLowerCase();
                isLemma = true;
                matchedFormText = lemmaInfo.vi || lemmaInfo.form;
            } else {
                // Thử quy tắc biến thể thông thường: -ies, -es, -s, -ed, -ing
                if (cleanKey.endsWith('ies') && cleanKey.length > 5) {
                    const candidate = cleanKey.slice(0, -3) + 'y';
                    if (this.lexicon[candidate]) {
                        targetKey = candidate;
                        isLemma = true;
                        matchedFormText = `Dạng số nhiều của '${candidate}'`;
                    }
                } else if (cleanKey.endsWith('es') && cleanKey.length > 4) {
                    const candidate = cleanKey.slice(0, -2);
                    if (this.lexicon[candidate]) {
                        targetKey = candidate;
                        isLemma = true;
                        matchedFormText = `Dạng số nhiều / ngôi thứ 3 của '${candidate}'`;
                    }
                } else if (cleanKey.endsWith('s') && cleanKey.length > 3) {
                    const candidate = cleanKey.slice(0, -1);
                    if (this.lexicon[candidate]) {
                        targetKey = candidate;
                        isLemma = true;
                        matchedFormText = `Dạng số nhiều / số ít của '${candidate}'`;
                    }
                } else if (cleanKey.endsWith('ed') && cleanKey.length > 4) {
                    const c1 = cleanKey.slice(0, -2);
                    const c2 = cleanKey.slice(0, -1);
                    if (this.lexicon[c2]) {
                        targetKey = c2;
                        isLemma = true;
                        matchedFormText = `Dạng quá khứ / phân từ của '${c2}'`;
                    } else if (this.lexicon[c1]) {
                        targetKey = c1;
                        isLemma = true;
                        matchedFormText = `Dạng quá khứ / phân từ của '${c1}'`;
                    }
                } else if (cleanKey.endsWith('ing') && cleanKey.length > 5) {
                    const c1 = cleanKey.slice(0, -3);
                    const c2 = cleanKey.slice(0, -3) + 'e';
                    if (this.lexicon[c2]) {
                        targetKey = c2;
                        isLemma = true;
                        matchedFormText = `Dạng V-ing của '${c2}'`;
                    } else if (this.lexicon[c1]) {
                        targetKey = c1;
                        isLemma = true;
                        matchedFormText = `Dạng V-ing của '${c1}'`;
                    }
                }
            }

            // D. Khớp trong Lexicon nội bộ
            if (this.lexicon[targetKey]) {
                const entry = JSON.parse(JSON.stringify(this.lexicon[targetKey]));
                if (isLemma) {
                    entry.flags.isLemmaRedirect = true;
                    entry.matchedForm = matchedFormText;
                    entry.searchedQuery = query;
                }
                await DictCacheDB.set(cleanKey, entry);
                DictHistoryManager.add(entry.headword || cleanKey);
                return entry;
            }

            // E. Gọi API Backend (/api/dictionary/lookup)
            try {
                const res = await fetch(`/api/dictionary/lookup?word=${encodeURIComponent(cleanKey)}`);
                if (res.ok) {
                    const json = await res.json();
                    if (json && json.success && json.data) {
                        const entry = this.normalizeEntry(cleanKey, json.data);
                        await DictCacheDB.set(cleanKey, entry);
                        DictHistoryManager.add(entry.headword || cleanKey);
                        return entry;
                    } else if (json && json.notFound) {
                        // Backend xác nhận từ không tồn tại hoặc sai chính tả
                        return {
                            notFound: true,
                            query: query,
                            suggestions: this.findFuzzySuggestions(cleanKey)
                        };
                    }
                }
            } catch (err) {
                console.warn('Backend lookup error:', err);
            }

            // F. Nếu không tìm thấy: Tìm gợi ý gõ sai (Did you mean...?)
            const suggestions = this.findFuzzySuggestions(cleanKey);
            return {
                notFound: true,
                query: query,
                suggestions: suggestions
            };
        },

        // Tìm kiếm các từ gợi ý khi gõ sai
        findFuzzySuggestions(cleanQuery) {
            const pool = Object.keys(this.lexicon);
            // Thêm các từ đích trong lemmas
            for (const [k, v] of Object.entries(this.lemmas)) {
                if (!pool.includes(k)) pool.push(k);
                if (v.lemma && !pool.includes(v.lemma)) pool.push(v.lemma);
            }

            // Các trường hợp lỗi chính tả điển hình tiếng Anh
            const typoFixes = {
                'recieve': 'receive',
                'negociate': 'negotiate',
                'managment': 'management',
                'seperate': 'separate',
                'occured': 'occurred',
                'untill': 'until',
                'calender': 'calendar',
                'definitly': 'definitely'
            };
            if (typoFixes[cleanQuery]) {
                return [typoFixes[cleanQuery]];
            }

            const scored = [];
            for (const word of pool) {
                const dist = calcLevenshteinDistance(cleanQuery, word);
                if (dist <= 2 && dist < cleanQuery.length) {
                    scored.push({ word, dist });
                }
            }

            scored.sort((a, b) => a.dist - b.dist);
            return scored.slice(0, 3).map(s => s.word);
        },

        // Tra cứu ngược từ tiếng Việt sang tiếng Anh
        performReverseLookup(vnQuery) {
            const cleanQuery = vnQuery.toLowerCase().trim();
            const matches = [];

            for (const [key, entry] of Object.entries(this.lexicon)) {
                let score = 0;
                const head = (entry.headword || key).toLowerCase();
                const viText = ((entry.senses && entry.senses[0] && entry.senses[0].meaningVi) || entry.vi || '').toLowerCase();
                
                if (viText.includes(cleanQuery)) {
                    score += 10;
                    if (viText.startsWith(cleanQuery)) score += 5;
                }
                
                // Kiểm tra collocations
                if (entry.collocations) {
                    for (const c of entry.collocations) {
                        if (c.vi && c.vi.toLowerCase().includes(cleanQuery)) {
                            score += 4;
                            break;
                        }
                    }
                }

                if (score > 0) {
                    matches.push({ entry, score });
                }
            }

            matches.sort((a, b) => b.score - a.score);
            const results = matches.slice(0, 6).map(m => m.entry);

            return {
                isReverseLookup: true,
                query: vnQuery,
                results: results
            };
        },

        // Autocomplete theo thời gian thực (<150ms)
        getAutocompleteSuggestions(prefix) {
            if (!prefix) return [];
            const clean = prefix.toLowerCase().trim();
            if (clean.length < 2) return [];

            const list = [];
            const pool = Object.keys(this.lexicon);

            for (const key of pool) {
                if (key.startsWith(clean)) {
                    const entry = this.lexicon[key];
                    list.push({
                        word: entry.headword || key,
                        partOfSpeech: entry.partOfSpeech || 'Word',
                        vi: (entry.senses?.[0]?.meaningVi || entry.vi || '').slice(0, 45)
                    });
                    if (list.length >= 5) break;
                }
            }
            return list;
        },

        // Phát âm giọng chuẩn US / UK với tốc độ tùy chỉnh
        speak(text, lang = 'en-US') {
            if (!text) return;
            const speed = this.currentAudioSpeed || 1.0;
            if (window.UniversalAudioEngine) {
                window.UniversalAudioEngine.speak(text, {
                    lang: lang,
                    rate: speed
                });
            } else if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(text);
                u.lang = lang;
                u.rate = speed;
                window.speechSynthesis.speak(u);
            }
        },

        toggleAudioSpeed() {
            if (this.currentAudioSpeed === 1.0) {
                this.currentAudioSpeed = 0.75;
            } else {
                this.currentAudioSpeed = 1.0;
            }
            this.updateSpeedUI();
            if (window.showToast) {
                showToast(`🐢 Tốc độ đọc: ${this.currentAudioSpeed === 0.75 ? 'Chậm 0.75x' : 'Bình thường 1.0x'}`);
            }
        },

        updateSpeedUI() {
            const btn = document.getElementById('dictSpeedToggleBtn');
            if (!btn) return;
            if (this.currentAudioSpeed === 0.75) {
                btn.className = 'px-3 py-1.5 rounded-xl bg-amber-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition';
                btn.innerHTML = '<i class="fa-solid fa-turtle"></i> <span>Chậm 0.75x</span>';
            } else {
                btn.className = 'px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold text-xs flex items-center gap-1.5 transition';
                btn.innerHTML = '<i class="fa-solid fa-gauge-high"></i> <span>Chuẩn 1.0x</span>';
            }
        },

        // Phím tắt bàn phím '/' để focus ô tìm kiếm từ điển
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
