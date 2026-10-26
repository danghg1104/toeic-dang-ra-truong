const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const startMarker = 'async function renderDictionaryResult(inputWord) {';
const endMarker = 'function executeDictSearch() {';

const startIndex = html.indexOf(startMarker);
const endIndex = html.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('Markers not found in index.html!');
    process.exit(1);
}

const newRenderFunction = `async function renderDictionaryResult(inputWord) {
            const raw = (inputWord || 'economic').trim();
            currentDictLookupWord = raw;
            const container = document.getElementById('dictResultContainer');
            if (!container) return;

            // Đóng autocomplete dropdown
            const dropdown = document.getElementById('dictAutocompleteDropdown');
            if (dropdown) dropdown.classList.add('hidden');

            // Loading state
            container.innerHTML = \`
                <div class="glass-panel rounded-[26px] p-8 text-center space-y-4 border-2 border-sky-200 animate-pulse">
                    <div class="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto text-xl animate-spin">
                        <i class="fa-solid fa-spinner"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-extrabold text-slate-800 dark:text-white">Đang tra cứu từ điển toàn diện...</h3>
                        <p class="text-xs text-slate-500 mt-1">Đang tra cứu từ/cụm từ <strong>"\${escapeHtml(raw)}"</strong> chuẩn TFLAT + Cambridge (song song Google GTX, FreeDict & Datamuse)...</p>
                    </div>
                </div>
            \`;

            let entry = null;
            try {
                if (window.DictionaryEngine) {
                    entry = await DictionaryEngine.lookupWord(raw);
                } else if (window.lookupWordOnlineAsync) {
                    entry = await window.lookupWordOnlineAsync(raw);
                }
            } catch (err) {
                console.warn('Lookup error in renderDictionaryResult:', err);
            }

            // Cập nhật lại thanh lịch sử
            renderDictHistoryChips();

            // 1. Trường hợp: Không tìm thấy từ (Chỉ xảy ra khi người dùng gõ chuỗi vô nghĩa như "asdfghjkl123")
            if (!entry || entry.notFound) {
                const queryStr = escapeHtml(entry?.query || raw);
                const suggestions = Array.isArray(entry?.suggestions) ? entry.suggestions : [];
                const suggestHtml = suggestions.length > 0 ? \`
                    <div class="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 max-w-md mx-auto space-y-2 text-left">
                        <div class="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                            <i class="fa-solid fa-wand-magic-sparkles text-amber-600"></i> Ý bạn có phải là:
                        </div>
                        <div class="flex flex-wrap gap-2">
                            \${suggestions.map(s => \`
                                <button onclick="quickLookupDictWord('\${escapeHtml(s)}')" class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-amber-100 text-amber-900 dark:text-amber-200 font-extrabold text-xs border border-amber-300 shadow-sm transition flex items-center gap-1.5 cursor-pointer">
                                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
                                    <span>\${escapeHtml(s)}</span>
                                </button>
                            \`).join('')}
                        </div>
                    </div>
                \` : '';

                container.innerHTML = \`
                    <div class="glass-panel rounded-[26px] p-8 text-center space-y-4 border-2 border-rose-200">
                        <div class="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto text-2xl shadow-sm">
                            <i class="fa-solid fa-circle-question"></i>
                        </div>
                        <div class="space-y-1">
                            <h4 class="text-base font-extrabold text-slate-800 dark:text-white">Không tìm thấy từ hoặc cụm từ "\${queryStr}"</h4>
                            <p class="text-xs text-slate-500 max-w-lg mx-auto">Vui lòng kiểm tra lại chính tả hoặc thử các từ quen thuộc như: <em>imminent, eager, economic, head of state, happy new year...</em></p>
                        </div>
                        \${suggestHtml}
                    </div>
                \`;
                return;
            }

            if (window.DictionaryEngine) {
                DictionaryEngine.currentEntry = entry;
            }

            const displayWord = entry.isReverseLookup ? (entry.englishTargetWord || entry.headword) : entry.headword;
            const displayEnglishWord = entry.englishTargetWord || entry.headword;
            currentDictLookupWord = displayEnglishWord;

            const pos = escapeHtml(entry.partOfSpeech || 'Từ vựng tiếng Anh');
            const examTag = escapeHtml(entry.examTag || 'TOEIC · Cambridge');

            // IPA chuẩn hóa
            let rawIpaUs = entry.ipa?.us || entry.phonetic || '';
            let rawIpaUk = entry.ipa?.uk || entry.ipaUk || rawIpaUs;
            if (window.IPAHelper) {
                rawIpaUs = window.IPAHelper.sanitizeIpaString(rawIpaUs, displayEnglishWord, 'US');
                rawIpaUk = window.IPAHelper.sanitizeIpaString(rawIpaUk, displayEnglishWord, 'UK') || rawIpaUs;
            }
            const ipaUs = escapeHtml(rawIpaUs);
            const ipaUk = escapeHtml(rawIpaUk);

            // Bóc tách POS Blocks (Danh từ, Động từ, Tính từ, Trạng từ, Cụm từ...)
            let dictBlocksHtml = '';
            const dictBlocks = Array.isArray(entry.dictBlocks) ? entry.dictBlocks : [];
            if (dictBlocks.length > 0) {
                dictBlocksHtml = \`
                    <div class="space-y-3 pt-2">
                        <div class="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-1.5">
                            <i class="fa-solid fa-layer-group text-sky-600"></i> Từ loại & Chi tiết các nghĩa (TFLAT Standard):
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            \${dictBlocks.map(block => {
                                const pLower = (block.pos || '').toLowerCase();
                                let badgeColor = 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300';
                                if (pLower.includes('danh')) badgeColor = 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950 dark:text-purple-300';
                                else if (pLower.includes('động')) badgeColor = 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950 dark:text-teal-300';
                                else if (pLower.includes('tính')) badgeColor = 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-300';
                                else if (pLower.includes('trạng')) badgeColor = 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300';

                                const blockTerms = Array.isArray(block.terms) ? block.terms : [];
                                const termsHtml = blockTerms.map(t => {
                                    if (entry.isReverseLookup) {
                                        return \`<button onclick="quickLookupDictWord('\${escapeHtml(t)}')" class="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 hover:bg-sky-100 text-sky-800 dark:text-sky-200 font-extrabold text-xs border border-slate-200 dark:border-slate-600 shadow-2xs transition cursor-pointer flex items-center gap-1"><span>\${escapeHtml(t)}</span><i class="fa-solid fa-arrow-right text-[9px] text-sky-500"></i></button>\`;
                                    }
                                    return \`<span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-600">\${escapeHtml(t)}</span>\`;
                                }).join('');

                                const blockEntries = Array.isArray(block.entries) ? block.entries : [];
                                const entriesHtml = blockEntries.slice(0, 4).map(e => \`
                                    <div class="text-xs space-y-1 pt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                                        <div class="font-extrabold text-slate-900 dark:text-white">• \${escapeHtml(e.meaning || '')}</div>
                                        \${Array.isArray(e.synonyms) && e.synonyms.length > 0 ? \`
                                            <div class="flex flex-wrap items-center gap-1 text-[11px]">
                                                <span class="text-slate-400 font-medium">Đồng nghĩa:</span>
                                                \${e.synonyms.slice(0, 5).map(s => \`
                                                    <button onclick="quickLookupDictWord('\${escapeHtml(s)}')" class="text-sky-600 dark:text-sky-400 hover:underline font-semibold cursor-pointer">
                                                        \${escapeHtml(s)}
                                                    </button>
                                                \`).join('<span class="text-slate-300">,</span> ')}
                                            </div>
                                        \` : ''}
                                    </div>
                                \`).join('');

                                return \`
                                    <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2.5">
                                        <div class="flex items-center justify-between">
                                            <span class="px-2.5 py-0.5 rounded-full text-xs font-black uppercase border \${badgeColor}">
                                                \${escapeHtml(block.pos)}
                                            </span>
                                            \${block.baseForm ? \`<span class="text-[11px] text-slate-400">Gốc: \${escapeHtml(block.baseForm)}</span>\` : ''}
                                        </div>
                                        <div class="flex flex-wrap gap-1.5">
                                            \${termsHtml}
                                        </div>
                                        \${entriesHtml}
                                    </div>
                                \`;
                            }).join('')}
                        </div>
                    </div>
                \`;
            }

            // Word Family Matrix
            const wf = entry.wordFamily || {};
            const safeNoun = Array.isArray(wf.noun) ? wf.noun : [];
            const safeVerb = Array.isArray(wf.verb) ? wf.verb : [];
            const safeAdj = Array.isArray(wf.adj) ? wf.adj : [];
            const safeAdv = Array.isArray(wf.adv) ? wf.adv : [];

            const nounList = (safeNoun.length > 0)
                ? safeNoun.map(n => \`<div class="p-2 rounded-xl bg-purple-50 dark:bg-slate-800 border border-purple-200"><button onclick="quickLookupDictWord('\${escapeHtml(n.term || n)}')" class="font-extrabold text-purple-700 dark:text-purple-300 hover:underline text-left cursor-pointer">\${escapeHtml(n.term || n)}</button><div class="text-[11px] text-slate-500">\${escapeHtml(n.vi || n.term || n)}</div></div>\`).join('')
                : \`<div class="text-xs text-slate-400 italic">Không có dạng thông dụng</div>\`;
            const verbList = (safeVerb.length > 0)
                ? safeVerb.map(v => \`<div class="p-2 rounded-xl bg-teal-50 dark:bg-slate-800 border border-teal-200"><button onclick="quickLookupDictWord('\${escapeHtml(v.term || v)}')" class="font-extrabold text-teal-700 dark:text-teal-300 hover:underline text-left cursor-pointer">\${escapeHtml(v.term || v)}</button><div class="text-[11px] text-slate-500">\${escapeHtml(v.vi || v.term || v)}</div></div>\`).join('')
                : \`<div class="text-xs text-slate-400 italic">Không có dạng thông dụng</div>\`;
            const adjList = (safeAdj.length > 0)
                ? safeAdj.map(a => \`<div class="p-2 rounded-xl bg-rose-50 dark:bg-slate-800 border border-rose-200"><button onclick="quickLookupDictWord('\${escapeHtml(a.term || a)}')" class="font-extrabold text-rose-700 dark:text-rose-300 hover:underline text-left cursor-pointer">\${escapeHtml(a.term || a)}</button><div class="text-[11px] text-slate-500">\${escapeHtml(a.vi || a.term || a)}</div></div>\`).join('')
                : \`<div class="text-xs text-slate-400 italic">Không có dạng thông dụng</div>\`;
            const advList = (safeAdv.length > 0)
                ? safeAdv.map(ad => \`<div class="p-2 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200"><button onclick="quickLookupDictWord('\${escapeHtml(ad.term || ad)}')" class="font-extrabold text-amber-800 dark:text-amber-300 hover:underline text-left cursor-pointer">\${escapeHtml(ad.term || ad)}</button><div class="text-[11px] text-slate-500">\${escapeHtml(ad.vi || ad.term || ad)}</div></div>\`).join('')
                : \`<div class="text-xs text-slate-400 italic">Không có dạng thông dụng</div>\`;

            const hasWordFamily = safeNoun.length > 0 || safeVerb.length > 0 || safeAdj.length > 0 || safeAdv.length > 0;

            // Real-life Context Examples
            const examples = Array.isArray(entry.examples) ? entry.examples : [];
            const exHtml = (examples.length > 0)
                ? \`
                    <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div class="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                            <i class="fa-regular fa-comment-dots text-sky-600"></i> Ví dụ ngữ cảnh công sở & đề thi:
                        </div>
                        <div class="space-y-2">
                            \${examples.map(ex => \`
                                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1">
                                    <div class="text-xs font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                                        <span>🇬🇧 "\${escapeHtml(ex.en || '')}"</span>
                                        <button onclick="DictionaryEngine.speak('\${escapeHtml(String(ex.en || '').replace(/'/g, "\\\\'"))}', 'en-US')" class="text-sky-600 hover:text-sky-800 text-xs cursor-pointer" title="Nghe câu ví dụ">
                                            <i class="fa-solid fa-volume-high"></i>
                                        </button>
                                    </div>
                                    <div class="text-[11.5px] text-slate-500 italic">🇻🇳 \${escapeHtml(ex.vi || '')}</div>
                                </div>
                            \`).join('')}
                        </div>
                    </div>
                \`
                : '';

            // Synonyms pills
            const synonyms = Array.isArray(entry.synonyms) ? entry.synonyms : [];
            const synHtml = (synonyms.length > 0)
                ? synonyms.slice(0, 10).map(s => \`<button onclick="quickLookupDictWord('\${escapeHtml(s)}')" class="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer">\${escapeHtml(s)}</button>\`).join('')
                : '';

            // Collocations & Idioms
            const collocations = Array.isArray(entry.collocations) ? entry.collocations : [];
            const collHtml = (collocations.length > 0)
                ? collocations.map(c => {
                    const phraseText = typeof c === 'string' ? c : (c.en || c.phrase || '');
                    const viText = typeof c === 'string' ? '' : (c.vi || '');
                    return \`<li class="flex items-start gap-2 text-xs"><span class="text-sky-600 font-extrabold shrink-0">•</span><div><strong class="text-slate-900 dark:text-white cursor-pointer hover:underline" onclick="quickLookupDictWord('\${escapeHtml(phraseText)}')">\${escapeHtml(phraseText)}</strong>\${viText ? \`: <span class="text-slate-600 dark:text-slate-300 italic">\${escapeHtml(viText)}</span>\` : ''}</div></li>\`;
                }).join('')
                : '';

            const quizHtml = window.DictionaryEngine ? DictionaryEngine.generateMiniQuiz(entry) : '';

            // RENDER TOÀN BỘ THẺ KẾT QUẢ ĐỒNG BỘ 10/10
            const alternatives = Array.isArray(entry.alternatives) ? entry.alternatives : [];

            container.innerHTML = \`
                <div class="glass-panel rounded-[26px] p-6 space-y-5 border-2 border-sky-200 dark:border-slate-700 shadow-sm">
                    
                    <!-- Header Row: Title, Badges, Audio, Action Buttons -->
                    <div class="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                            <!-- Direction Badge -->
                            <div class="flex flex-wrap items-center gap-2 mb-2">
                                \${entry.isReverseLookup ? \`
                                    <span class="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950 dark:to-teal-950 text-emerald-900 dark:text-emerald-300 font-black text-xs flex items-center gap-1.5 shadow-2xs border border-emerald-300/80">
                                        <i class="fa-solid fa-arrow-right-arrow-left"></i> Việt ➔ Anh (TFLAT + Cambridge)
                                    </span>
                                \` : \`
                                    <span class="px-3 py-1 rounded-full bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-950 dark:to-indigo-950 text-sky-900 dark:text-sky-300 font-black text-xs flex items-center gap-1.5 shadow-2xs border border-sky-300/80">
                                        <i class="fa-solid fa-book-open"></i> Anh ➔ Việt (Cambridge + TFLAT)
                                    </span>
                                \`}
                                <span class="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-slate-800 text-sky-800 dark:text-sky-300 text-xs font-extrabold">\${pos}</span>
                                <span class="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold">\${examTag}</span>
                                \${entry.isInflected ? \`
                                    <span class="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 text-xs font-bold flex items-center gap-1">
                                        <i class="fa-solid fa-code-branch"></i> Từ gốc: <strong class="cursor-pointer hover:underline" onclick="quickLookupDictWord('\${escapeHtml(entry.baseForm)}')">\${escapeHtml(entry.baseForm)}</strong>
                                    </span>
                                \` : ''}
                            </div>

                            <!-- Big Word Title -->
                            <div class="flex flex-wrap items-baseline gap-3">
                                <h2 class="text-[32px] font-black text-slate-900 dark:text-white tracking-tight leading-none">\${escapeHtml(displayWord)}</h2>
                                \${entry.isReverseLookup ? \`
                                    <span class="text-xs font-bold text-slate-500">
                                        (Từ khóa tiếng Việt: <strong class="text-emerald-600 dark:text-emerald-400">"\${escapeHtml(entry.query)}"</strong>)
                                    </span>
                                \` : ''}
                            </div>

                            <!-- US & UK Pronunciation Row -->
                            <div class="flex flex-wrap items-center gap-3 text-xs font-semibold mt-3">
                                <div class="flex items-center gap-1.5 text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-sky-200 dark:border-slate-700">
                                    <span>🇺🇸 US: <strong>\${ipaUs}</strong></span>
                                    <button onclick="DictionaryEngine.speak('\${escapeHtml(displayEnglishWord)}', 'en-US')" class="w-6 h-6 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center transition ml-1 cursor-pointer" title="Nghe phát âm chuẩn US">
                                        <i class="fa-solid fa-volume-high text-[10px]"></i>
                                    </button>
                                </div>
                                <div class="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-slate-700">
                                    <span>🇬🇧 UK: <strong>\${ipaUk}</strong></span>
                                    <button onclick="DictionaryEngine.speak('\${escapeHtml(displayEnglishWord)}', 'en-GB')" class="w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition ml-1 cursor-pointer" title="Nghe phát âm chuẩn UK">
                                        <i class="fa-solid fa-volume-high text-[10px]"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-wrap items-center gap-2">
                            <button onclick="saveDictWordToVocab('\${escapeHtml(displayEnglishWord)}')" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-extrabold shadow-sm transition flex items-center gap-1.5 cursor-pointer">
                                <i class="fa-solid fa-plus"></i>
                                <span>Thêm vào thẻ từ vựng</span>
                            </button>
                            <button onclick="openWordCopyingInTakeNote('\${escapeHtml(displayEnglishWord)}')" class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-sm transition flex items-center gap-1.5 cursor-pointer">
                                <i class="fa-solid fa-feather-pointed"></i>
                                <span>Luyện chép 10-30 lần</span>
                            </button>
                        </div>
                    </div>

                    <!-- Highlighted Core Meaning Card -->
                    <div class="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50/60 to-indigo-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border-2 border-sky-300 dark:border-slate-700 space-y-2">
                        <div class="text-[11px] font-black uppercase text-sky-700 dark:text-sky-300 tracking-wider flex items-center gap-1.5">
                            <i class="fa-solid fa-star text-amber-500"></i> Nghĩa chính cốt lõi:
                        </div>
                        <div class="text-[22px] font-black text-slate-900 dark:text-white leading-snug">
                            \${entry.isReverseLookup ? '🇬🇧 ' + escapeHtml(entry.englishTargetWord) : '🇻🇳 ' + escapeHtml(entry.mainMeaning)}
                        </div>
                        \${alternatives.length > 0 ? \`
                            <div class="pt-2 border-t border-sky-200/60 dark:border-slate-700 flex flex-wrap items-center gap-1.5">
                                <span class="text-[11px] font-bold text-slate-500 dark:text-slate-400">Các cách dịch thay thế / ngữ cảnh:</span>
                                \${alternatives.map(a => \`
                                    <button onclick="quickLookupDictWord('\${escapeHtml(a)}')" class="px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-700 text-sky-800 dark:text-sky-200 text-xs font-bold border border-sky-200 dark:border-slate-600 hover:border-sky-400 transition cursor-pointer">
                                        \${escapeHtml(a)}
                                    </button>
                                \`).join('')}
                            </div>
                        \` : ''}
                    </div>

                    <!-- TOEIC Exam Note if available -->
                    \${entry.toeicNote ? \`
                        <div class="p-3.5 rounded-2xl bg-amber-50/90 dark:bg-slate-800 border-l-4 border-l-amber-600 border border-amber-200 text-xs space-y-1 shadow-sm">
                            <div class="font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-triangle-exclamation text-amber-600"></i> BÍ KÍP BẪY TỪ LOẠI TOEIC PART 5 & 6:
                            </div>
                            <div class="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">\${escapeHtml(entry.toeicNote)}</div>
                        </div>
                    \` : ''}

                    <!-- Detailed POS Blocks (Danh từ, Động từ, Tính từ...) -->
                    \${dictBlocksHtml}

                    <!-- Synonyms Chips -->
                    \${synHtml ? \`
                        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                            <div class="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-equals text-emerald-600"></i> Từ đồng nghĩa (Synonyms):
                            </div>
                            <div class="flex flex-wrap gap-1.5">\${synHtml}</div>
                        </div>
                    \` : ''}

                    <!-- Word Family Matrix (Họ từ Noun - Verb - Adj - Adv) -->
                    \${hasWordFamily ? \`
                        <div class="space-y-2 pt-2">
                            <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                <i class="fa-solid fa-sitemap text-sky-600"></i> Bảng Họ từ toàn diện (Word Family Matrix):
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div class="glass-panel rounded-2xl p-3 space-y-2 border border-purple-200">
                                    <div class="text-xs font-black text-purple-700">🏷️ DANH TỪ (Noun)</div>
                                    <div class="space-y-1.5">\${nounList}</div>
                                </div>
                                <div class="glass-panel rounded-2xl p-3 space-y-2 border border-teal-200">
                                    <div class="text-xs font-black text-teal-700">⚡ ĐỘNG TỪ (Verb)</div>
                                    <div class="space-y-1.5">\${verbList}</div>
                                </div>
                                <div class="glass-panel rounded-2xl p-3 space-y-2 border border-rose-200">
                                    <div class="text-xs font-black text-rose-700">🎨 TÍNH TỪ (Adj)</div>
                                    <div class="space-y-1.5">\${adjList}</div>
                                </div>
                                <div class="glass-panel rounded-2xl p-3 space-y-2 border border-amber-200">
                                    <div class="text-xs font-black text-amber-800">🚀 TRẠNG TỪ (Adv)</div>
                                    <div class="space-y-1.5">\${advList}</div>
                                </div>
                            </div>
                        </div>
                    \` : ''}

                    <!-- Collocations & Idioms if available -->
                    \${collHtml ? \`
                        <div class="p-4 rounded-2xl bg-sky-50/60 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 space-y-2.5">
                            <div class="text-xs font-extrabold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-link text-sky-600"></i> Cụm từ Collocations hay gặp trong bài thi:
                            </div>
                            <ul class="space-y-2">\${collHtml}</ul>
                        </div>
                    \` : ''}

                    <!-- Real-life Context Examples -->
                    \${exHtml}

                    <!-- Mini-Quiz Quick Check -->
                    \${quizHtml ? \`
                        <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                            \${quizHtml}
                        </div>
                    \` : ''}

                    <!-- Footer Attribution -->
                    <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                        <div class="flex items-center gap-1.5">
                            <i class="fa-solid fa-shield-halved text-sky-500"></i>
                            <span>Dữ liệu mở: Google Translate GTX, Free Dictionary API (Cambridge/Oxford), Datamuse & Wiktionary.</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <button onclick="reportDictIssue('\${escapeHtml(displayEnglishWord)}')" class="hover:text-sky-600 transition cursor-pointer">Báo lỗi / Góp ý dữ liệu</button>
                        </div>
                    </div>
                </div>
            \`;
        }

        `;

const updatedHtml = html.substring(0, startIndex) + newRenderFunction + html.substring(endIndex);
fs.writeFileSync(indexPath, updatedHtml, 'utf8');
console.log('✅ Successfully updated defensive renderDictionaryResult in index.html!');
