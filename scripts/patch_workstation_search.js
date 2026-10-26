const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'js', 'vocab-game-workstation.js');
let code = fs.readFileSync(targetFile, 'utf8');

// 1. Update toggleSelectWordCard, selectAllDisplayedCards, clearSelectedCards
const oldSelectionMethods = `        toggleSelectWordCard(word) {
            if (!word) return;
            const lower = word.trim().toLowerCase();
            if (this.selectedCardWords.has(lower)) {
                this.selectedCardWords.delete(lower);
            } else {
                this.selectedCardWords.add(lower);
            }
            this.renderInto();
        }

        selectAllDisplayedCards() {
            let filtered = this.uploadedFileWords || [];
            if (this.fileFilterLevel !== 'ALL') {
                filtered = filtered.filter(w => w.level === this.fileFilterLevel);
            }
            if (this.fileSearchQuery) {
                const q = this.fileSearchQuery.toLowerCase().trim();
                filtered = filtered.filter(w => (w.word || '').toLowerCase().includes(q) || (w.meaning || '').toLowerCase().includes(q));
            }
            filtered.forEach(w => {
                if (w && w.word) this.selectedCardWords.add(w.word.trim().toLowerCase());
            });
            this.renderInto();
        }

        clearSelectedCards() {
            this.selectedCardWords.clear();
            this.renderInto();
        }`;

const newSelectionMethods = `        toggleSelectWordCard(word) {
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
        }`;

// 2. Replace old search input and card list rendering in renderScannedDocumentView()
const oldSearchBlock = `                            <!-- 4. THANH TÌM KIẾM TỪ VỰNG TRỰC TIẾP TRONG FILE & ĐIỀU KHIỂN CHỌN TỪ (ẢNH 4) -->
                            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                                <div class="relative w-full sm:w-80">
                                    <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                    <input type="text" value="\${this.fileSearchQuery || ''}"
                                        oninput="VocabGameWorkstation.setFileSearchQuery(this.value)"
                                        placeholder="Tìm nhanh từ vựng hoặc nghĩa..."
                                        class="w-full pl-9 pr-4 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>

                                <!-- Quick selection controls (Ảnh 4) -->
                                <div class="flex items-center gap-2 flex-wrap">
                                    <button type="button" onclick="VocabGameWorkstation.selectAllDisplayedCards()"
                                        class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                                        <i class="fa-regular fa-square-check text-blue-600"></i>
                                        <span>Chọn tất cả (\${displayedWords.length})</span>
                                    </button>

                                    <button type="button" onclick="VocabGameWorkstation.clearSelectedCards()"
                                        class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                                        <i class="fa-regular fa-circle-xmark"></i>
                                        <span>Bỏ chọn</span>
                                    </button>

                                    <span class="text-xs font-bold text-slate-400 hidden sm:inline">•</span>

                                    <div class="text-xs font-bold text-slate-500 dark:text-slate-400">
                                        Hiển thị: <strong class="text-blue-600 dark:text-cyan-400">\${displayedWords.length}</strong> từ
                                    </div>
                                </div>
                            </div>

                            <!-- 5. LƯỚI THẺ TỪ VỰNG QUÉT ĐƯỢC (ẢNH 4 CÓ CHECKBOX TÙY CHỌN TỪNG TỪ) -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[540px] overflow-y-auto pr-1">`;

const newSearchBlock = `                            <!-- 4. THANH TÌM KIẾM TỪ VỰNG TRỰC TIẾP TRONG FILE & ĐIỀU KHIỂN CHỌN TỪ (ẢNH 4) -->
                            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                                <div class="relative w-full sm:w-80">
                                    <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                    <input type="text" id="vgFileSearchInput" value="\${this.fileSearchQuery || ''}"
                                        oninput="VocabGameWorkstation.handleFileSearchInput(this.value)"
                                        placeholder="Tìm nhanh từ vựng hoặc nghĩa..."
                                        class="w-full pl-9 pr-4 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>

                                <!-- Quick selection controls (Ảnh 4) -->
                                <div class="flex items-center gap-2 flex-wrap">
                                    <button type="button" onclick="VocabGameWorkstation.selectAllDisplayedCards()"
                                        class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                                        <i class="fa-regular fa-square-check text-blue-600"></i>
                                        <span id="vgFileSelectAllCount">Chọn tất cả (\${displayedWords.length})</span>
                                    </button>

                                    <button type="button" onclick="VocabGameWorkstation.clearSelectedCards()"
                                        class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                                        <i class="fa-regular fa-circle-xmark"></i>
                                        <span>Bỏ chọn</span>
                                    </button>

                                    <span class="text-xs font-bold text-slate-400 hidden sm:inline">•</span>

                                    <div class="text-xs font-bold text-slate-500 dark:text-slate-400">
                                        Hiển thị: <strong id="vgFileDisplayedCount" class="text-blue-600 dark:text-cyan-400">\${displayedWords.length}</strong> từ
                                    </div>
                                </div>
                            </div>

                            <!-- 5. LƯỚI THẺ TỪ VỰNG QUÉT ĐƯỢC (ẢNH 4 CÓ CHECKBOX TÙY CHỌN TỪNG TỪ) -->
                            <div id="vgFileCardsGrid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[540px] overflow-y-auto pr-1">`;

// 3. New methods to add to VocabGameWorkstation
const newMethodsToAdd = `
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
                const tokens = rawQuery.split(/\\s+/).filter(Boolean);
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
                return \`
                    <div class="col-span-full py-12 text-center text-slate-400 dark:text-slate-500 space-y-2">
                        <i class="fa-solid fa-magnifying-glass text-3xl opacity-40"></i>
                        <p class="text-sm font-bold">Không tìm thấy từ vựng nào khớp với "\${this.fileSearchQuery || ''}"</p>
                        <p class="text-xs">Hãy thử tìm từ khác hoặc bấm "Tất cả các cấp" để mở rộng kết quả.</p>
                    </div>
                \`;
            }
            return paginatedWords.map((item, idx) => {
                const isSelected = this.selectedCardWords.has(item.word.toLowerCase());
                return \`
                    <div onclick="VocabGameWorkstation.toggleSelectWordCard('\${item.word}')"
                        class="relative p-3.5 rounded-2xl border transition flex flex-col justify-between gap-2.5 cursor-pointer select-none group \${isSelected ? 'bg-blue-50/90 dark:bg-blue-950/40 border-blue-500 dark:border-blue-400 ring-2 ring-blue-400/40 shadow-sm' : 'bg-white dark:bg-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-700/60 border-slate-200/90 dark:border-slate-700 shadow-2xs'}">
                        
                        <div class="flex items-start justify-between gap-2">
                            <div class="flex items-center gap-2.5 min-w-0">
                                <!-- Checkbox nút chọn từ (Ảnh 4) -->
                                <div class="w-5 h-5 rounded-md border flex items-center justify-center transition shrink-0 \${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-transparent'}">
                                    <i class="fa-solid fa-check text-[10px]"></i>
                                </div>
                                <div class="min-w-0">
                                    <div class="flex items-center gap-1.5 flex-wrap">
                                        <span class="text-[11px] font-bold text-slate-400">#\${idx + 1}</span>
                                        <span class="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition truncate">\${item.word}</span>
                                        \${item.unit ? \`<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">\${item.unit.split(':')[0]}</span>\` : ''}
                                    </div>
                                    <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400">\${item.phonetic || '/' + item.word + '/'}</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-1 shrink-0">
                                <span class="px-2 py-0.5 rounded-md text-[10px] font-black border \${lvlColors[item.level] || lvlColors.B1}">
                                    \${item.level}
                                </span>
                                <button type="button" onclick="event.stopPropagation(); VocabGameWorkstation.speakWord('\${item.word}')" title="Nghe phát âm"
                                    class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-cyan-100 dark:bg-slate-700 dark:hover:bg-cyan-950 text-slate-600 hover:text-cyan-600 dark:text-slate-300 flex items-center justify-center text-xs transition cursor-pointer">
                                    <i class="fa-solid fa-volume-high"></i>
                                </button>
                            </div>
                        </div>

                        <div class="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed bg-slate-50/80 dark:bg-slate-900/50 p-2 rounded-xl">
                            \${item.meaning || 'Từ vựng học tập'}
                        </div>
                    </div>
                \`;
            }).join('');
        }

        renderShowMoreBtnHTML(total, limit) {
            if (total <= limit) return '';
            return \`
                <div class="text-center pt-2">
                    <button type="button" onclick="VocabGameWorkstation.showMoreScannedWords()"
                        class="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer">
                        Xem thêm \${total - limit} từ còn lại...
                    </button>
                </div>
            \`;
        }

        renderFloatingActionBarHTML() {
            if (!this.selectedCardWords || this.selectedCardWords.size === 0) return '';
            return \`
                <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white px-5 py-3.5 rounded-3xl shadow-2xl border border-slate-700/80 flex items-center gap-3.5 flex-wrap animate-fadeIn max-w-[92vw]">
                    <div class="flex items-center gap-2">
                        <span class="w-7 h-7 rounded-full bg-blue-500/30 text-cyan-300 flex items-center justify-center font-black text-xs border border-blue-400/40">
                            \${this.selectedCardWords.size}
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
                        <span>Bắn súng Gundam (\${this.selectedCardWords.size} từ)</span>
                    </button>

                    <!-- 3. Học Flashcard ngay -->
                    <button type="button" onclick="VocabGameWorkstation.launchFlashcardsWithSelectedCards()"
                        class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer">
                        <i class="fa-solid fa-clone text-amber-200"></i>
                        <span>Học Flashcard (\${this.selectedCardWords.size} từ)</span>
                    </button>

                    <!-- Bỏ chọn / Đóng -->
                    <button type="button" onclick="VocabGameWorkstation.clearSelectedCards()" title="Bỏ chọn tất cả"
                        class="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition cursor-pointer">
                        ✕
                    </button>
                </div>
            \`;
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
            if (selectAllCountEl) selectAllCountEl.textContent = \`Chọn tất cả (\${displayedWords.length})\`;

            const showMoreContainer = document.getElementById('vgFileShowMoreContainer');
            if (showMoreContainer) {
                showMoreContainer.innerHTML = this.renderShowMoreBtnHTML(displayedWords.length, displayLimit);
            }

            const floatContainer = document.getElementById('vgFileFloatingBarContainer');
            if (floatContainer) {
                floatContainer.innerHTML = this.renderFloatingActionBarHTML();
            }
        }
`;

// Apply replacements
let modified = false;

// 1. Replace selection methods
const normCode = code.replace(/\r\n/g, '\n');
const normOldSel = oldSelectionMethods.replace(/\r\n/g, '\n');
const normNewSel = newSelectionMethods.replace(/\r\n/g, '\n');

if (normCode.includes(normOldSel)) {
    code = normCode.replace(normOldSel, normNewSel);
    modified = true;
    console.log('✅ Replaced selection methods (toggle, selectAll, clear)');
} else {
    console.warn('⚠️ oldSelectionMethods not matched directly');
}

// 2. Replace search input block
const normOldSearch = oldSearchBlock.replace(/\r\n/g, '\n');
const normNewSearch = newSearchBlock.replace(/\r\n/g, '\n');

if (code.includes(normOldSearch)) {
    code = code.replace(normOldSearch, normNewSearch);
    modified = true;
    console.log('✅ Replaced search block with vgFileSearchInput and vgFileCardsGrid');
} else {
    console.warn('⚠️ oldSearchBlock not matched directly');
}

// 3. Replace floating action bar container and show more container
const oldEndBlock = `                            <!-- FLOATING ACTION BAR KHI NGƯỜI DÙNG CHỌN TỪ TRONG ẢNH 4 (1 LÀ BẮN SÚNG, 2 LÀ CARD, 3 LÀ LƯU SỔ) -->
                            \${this.selectedCardWords.size > 0 ? \`
                                <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md text-white px-5 py-3.5 rounded-3xl shadow-2xl border border-slate-700/80 flex items-center gap-3.5 flex-wrap animate-fadeIn max-w-[92vw]">
                                    <div class="flex items-center gap-2">
                                        <span class="w-7 h-7 rounded-full bg-blue-500/30 text-cyan-300 flex items-center justify-center font-black text-xs border border-blue-400/40">
                                            \${this.selectedCardWords.size}
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
                                        <span>Bắn súng Gundam (\${this.selectedCardWords.size} từ)</span>
                                    </button>

                                    <!-- 3. Học Flashcard ngay -->
                                    <button type="button" onclick="VocabGameWorkstation.launchFlashcardsWithSelectedCards()"
                                        class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-black text-xs transition flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer">
                                        <i class="fa-solid fa-clone text-amber-200"></i>
                                        <span>Học Flashcard (\${this.selectedCardWords.size} từ)</span>
                                    </button>

                                    <!-- Bỏ chọn / Đóng -->
                                    <button type="button" onclick="VocabGameWorkstation.clearSelectedCards()" title="Bỏ chọn tất cả"
                                        class="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs transition cursor-pointer">
                                        ✕
                                    </button>
                                </div>
                            \` : ''}

                            \${displayedWords.length > displayLimit ? \`
                                <div class="text-center pt-2">
                                    <button type="button" onclick="VocabGameWorkstation.showMoreScannedWords()"
                                        class="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer">
                                        Xem thêm \${displayedWords.length - displayLimit} từ còn lại...
                                    </button>
                                </div>
                            \` : ''}`;

const newEndBlock = `                            <div id="vgFileShowMoreContainer">
                                \${this.renderShowMoreBtnHTML(displayedWords.length, displayLimit)}
                            </div>

                            <div id="vgFileFloatingBarContainer">
                                \${this.renderFloatingActionBarHTML()}
                            </div>`;

const normOldEnd = oldEndBlock.replace(/\r\n/g, '\n');
const normNewEnd = newEndBlock.replace(/\r\n/g, '\n');

if (code.includes(normOldEnd)) {
    code = code.replace(normOldEnd, normNewEnd);
    modified = true;
    console.log('✅ Replaced floating bar container and show more container');
} else {
    console.warn('⚠️ oldEndBlock not matched directly');
}

// 4. Insert new helper methods before showMoreScannedWords
const targetBefore = `        showMoreScannedWords() {`;
if (code.includes(targetBefore)) {
    code = code.replace(targetBefore, newMethodsToAdd + '\n\n' + targetBefore);
    modified = true;
    console.log('✅ Inserted newMethodsToAdd');
} else {
    console.warn('⚠️ targetBefore not matched');
}

// 5. Update renderInto to preserve focus and selection
const oldRenderInto = `        renderInto(containerId = 'view-hoc-tu-vung') {
            this.containerId = containerId;
            const container = document.getElementById(containerId);
            if (!container) return;`;

const newRenderInto = `        renderInto(containerId = 'view-hoc-tu-vung') {
            this.containerId = containerId;
            const container = document.getElementById(containerId);
            if (!container) return;

            const searchInput = document.getElementById('vgFileSearchInput');
            const wasSearchFocused = (document.activeElement === searchInput);
            const searchStart = searchInput?.selectionStart;
            const searchEnd = searchInput?.selectionEnd;`;

const endOfRenderInto = `            } else if (this.activeView === 'summary') {
                this.detachGlobalKeydown();
                this.stopGameLoop();
                container.innerHTML = this.buildSummaryHTML();
            }
        }`;

const newEndOfRenderInto = `            } else if (this.activeView === 'summary') {
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
        }`;

if (code.includes(oldRenderInto.replace(/\r\n/g, '\n'))) {
    code = code.replace(oldRenderInto.replace(/\r\n/g, '\n'), newRenderInto);
}
if (code.includes(endOfRenderInto.replace(/\r\n/g, '\n'))) {
    code = code.replace(endOfRenderInto.replace(/\r\n/g, '\n'), newEndOfRenderInto);
    console.log('✅ Added focus/cursor preservation to renderInto');
}

fs.writeFileSync(targetFile, code.replace(/\n/g, '\r\n'), 'utf8');
console.log('💾 Successfully saved js/vocab-game-workstation.js');
