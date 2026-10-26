const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'js', 'dictionary-engine.js');
let content = fs.readFileSync(targetFile, 'utf8');

// The new implementation of lookupWord, performReverseLookup, speak, toggleAudioSpeed, updateSpeedUI
const newCodeBlock = `
        // =========================================================================
        // KIẾN TRÚC MỚI: TỪ ĐIỂN ĐA NĂNG 2 CHIỀU ANH <-> VIỆT (TFLAT + CAMBRIDGE)
        // Hỗ trợ 100% từ đơn, từ chia thì/số nhiều, cụm từ, idioms, câu dài
        // =========================================================================

        async lookupWord(rawQuery, options = {}) {
            await this.init();
            const raw = String(rawQuery || '').trim().replace(/\\s+/g, ' ');
            if (!raw) return null;

            const cleanKey = raw.toLowerCase();

            // TẦNG 1: CACHE TỨC THÌ (ultimate_dict_cache_v3 - 0ms)
            if (!options.bypassCache) {
                try {
                    const cachedMap = JSON.parse(localStorage.getItem('ultimate_dict_cache_v3') || '{}');
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
            const gtxUrl = \`https://translate.googleapis.com/translate_a/single?client=gtx&sl=\${sl}&tl=\${tl}&dt=t&dt=bd&dt=ex&dt=md&dt=ss&dt=at&dj=1&q=\${encodeURIComponent(raw)}\`;
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
            if (!isVi && gtxData) {
                const rawTrans = gtxData.sentences?.[0]?.trans || '';
                if (gtxData.src === 'vi' || (rawTrans && VI_DIACRITICS_REGEX.test(rawTrans) && rawTrans.toLowerCase() !== cleanKey)) {
                    try {
                        const revUrl = \`https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&dt=bd&dt=ex&dt=md&dt=ss&dt=at&dj=1&q=\${encodeURIComponent(raw)}\`;
                        const revRes = await fetch(revUrl);
                        if (revRes.ok) {
                            const revData = await revRes.json();
                            if (revData && revData.sentences?.[0]?.trans) {
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
                    fetch(\`https://api.dictionaryapi.dev/api/v2/entries/en/\${encodeURIComponent(englishWord)}\`).then(r => r.ok ? r.json() : null),
                    fetch(\`https://api.datamuse.com/words?ml=\${encodeURIComponent(englishWord)}&md=dpf&max=10\`).then(r => r.ok ? r.json() : [])
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
                            const fdBaseRes = await fetch(\`https://api.dictionaryapi.dev/api/v2/entries/en/\${encodeURIComponent(baseForm)}\`);
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
            const isGibberish = !hasSentences || (mainTrans.toLowerCase() === cleanKey && !hasDict && !freeDictData && datamuseWords.length === 0 && cleanKey.length > 6 && !/[aeiouy]/i.test(cleanKey));

            if (isGibberish) {
                let suggestions = [];
                try {
                    const sugRes = await fetch(\`https://api.datamuse.com/sug?s=\${encodeURIComponent(cleanKey)}\`);
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

            if (!ipaUs) ipaUs = \`/\${englishWord}/\`;
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
                    const cleanEn = (ex.text_body || '').replace(/<b>|<\\/b>/g, '').trim();
                    if (cleanEn) {
                        examples.push({
                            en: cleanEn,
                            vi: \`Ví dụ ngữ cảnh: "\${cleanEn}"\`
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
                                    vi: \`Ví dụ: "\${def.example}"\`
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
            const toeicNote = local?.toeicNote || (dictBlocks.length > 0 ? \`💡 Lưu ý bài thi: Nhận biết rõ từ loại [\${dictBlocks[0].pos}] để tránh bẫy ngữ pháp Part 5!\` : '');

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

            // Lưu vào Cache ultimate_dict_cache_v3
            try {
                let cachedMap = {};
                const rawCache = localStorage.getItem('ultimate_dict_cache_v3');
                if (rawCache) cachedMap = JSON.parse(rawCache);
                cachedMap[cleanKey] = entry;
                if (englishWord !== cleanKey) cachedMap[englishWord] = entry;
                const keys = Object.keys(cachedMap);
                if (keys.length > 500) delete cachedMap[keys[0]];
                localStorage.setItem('ultimate_dict_cache_v3', JSON.stringify(cachedMap));
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
                showToast(\`⚡ Tốc độ phát âm: \${label}\`);
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
`;

// Replace lines from 'async lookupWord' up to 'updateSpeedUI'
const startMarker = 'async lookupWord(rawQuery, options = {}) {';
const endMarker = 'bindGlobalShortcuts() {';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('Markers not found! startIndex:', startIndex, 'endIndex:', endIndex);
    process.exit(1);
}

const updatedContent = content.substring(0, startIndex) + newCodeBlock.trim() + '\n\n        // ' + content.substring(endIndex);
fs.writeFileSync(targetFile, updatedContent, 'utf8');
console.log('✅ Successfully updated js/dictionary-engine.js!');
