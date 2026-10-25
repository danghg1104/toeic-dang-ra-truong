/**
 * TOEIC READING WORKSTATION ENGINE (Chuẩn ETS 2026 / ETS 2019 / Study4 / Prep)
 * Phục vụ toàn diện kỹ năng Reading TOEIC:
 * - Part 5: Incomplete Sentences (1 câu / màn hình + phân tích từ loại, chia thì, collocations)
 * - Part 6: Text Completion (Bài đọc bên trái có chỗ trống ____[131], nhóm 4 câu hỏi bên phải)
 * - Part 7: Reading Comprehension (Đoạn đơn, đoạn kép, đoạn ba bên trái, cụm câu hỏi bên phải + Dẫn chứng)
 * Tích hợp công cụ đỉnh cao:
 * - Song ngữ (Dịch song song từng đoạn / câu)
 * - Dẫn chứng (Highlight câu chứa manh mối trong bài đọc)
 * - Giải thích chi tiết & Mẹo thi TOEIC
 * - Từ vựng trọng tâm (Vocab Drawer)
 * - Sổ ghi chú (Take Note)
 * - Bảng câu hỏi lưới (Question Palette Drawer)
 * - Bộ chọn đề & chuyên đề tức thì (Test & Topic Selector Pill)
 */

(function (window, document) {
    'use strict';

    class ToeicReadingWorkstation {
        constructor() {
            this.isOpen = false;
            this.part = 5; // 5 | 6 | 7 | 'full_rc'
            this.title = 'Part 5 - Incomplete Sentences (Điền từ)';
            this.subtitle = 'ETS 2019 - Test 2';
            this.currentTestName = 'ETS 2019 - Test 2';
            this.currentTopic = '';
            this.isEts2026 = false;
            this.testNumber = 1;

            this.items = []; // Danh sách items (Part 5 là câu hỏi đơn; Part 6, 7 là passage sets)
            this.currentIndex = 0;
            this.userAnswers = {}; // { qId: selectedIndex }
            this.answeredState = {}; // { qId: { isCorrect, selectedIndex, checked: true } }
            this.flagged = {}; // { qId: boolean }

            // Toggles
            this.showBilingual = false;
            this.showEvidence = true;
            this.showExplanation = true; // Mặc định mở giải thích như ảnh mẫu
            this.activeBlankFocus = null;

            this.dom = {};
            this.initKeyboardShortcuts();
        }

        cacheDom() {
            this.dom.modal = document.getElementById('toeicReadingWorkstation');
            this.dom.title = document.getElementById('trwTitle');
            this.dom.subtitle = document.getElementById('trwSubtitle');
            this.dom.testSelectorBtn = document.getElementById('trwTestSelectorBtn');
            this.dom.testSelectorLabel = document.getElementById('trwTestSelectorLabel');
            this.dom.testDropdown = document.getElementById('trwTestDropdown');

            this.dom.btnBilingual = document.getElementById('trwBtnBilingual');
            this.dom.btnEvidence = document.getElementById('trwBtnEvidence');
            this.dom.btnExplanation = document.getElementById('trwBtnExplanation');

            this.dom.leftCol = document.getElementById('trwLeftCol');
            this.dom.rightCol = document.getElementById('trwRightCol');
            this.dom.instruction = document.getElementById('trwInstruction');
            this.dom.passageContainer = document.getElementById('trwPassageContainer');
            this.dom.questionsContainer = document.getElementById('trwQuestionsContainer');

            this.dom.navRangeLabel = document.getElementById('trwNavRangeLabel');
            this.dom.prevBtn = document.getElementById('trwPrevBtn');
            this.dom.nextBtn = document.getElementById('trwNextBtn');

            this.dom.paletteDrawer = document.getElementById('trwPaletteDrawer');
            this.dom.paletteGrid = document.getElementById('trwPaletteGrid');
            this.dom.vocabModal = document.getElementById('trwVocabModal');
            this.dom.vocabList = document.getElementById('trwVocabList');
            this.dom.noteModal = document.getElementById('trwNoteModal');
            this.dom.noteText = document.getElementById('trwNoteText');
        }

        initKeyboardShortcuts() {
            if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
            window.addEventListener('keydown', (e) => {
                if (!this.isOpen) return;
                const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
                if (activeTag === 'input' || activeTag === 'textarea') return;

                if (e.code === 'ArrowLeft') {
                    e.preventDefault();
                    this.prev();
                } else if (e.code === 'ArrowRight') {
                    e.preventDefault();
                    this.next();
                } else if (e.code === 'KeyE') {
                    this.toggleExplanation();
                } else if (e.code === 'KeyB') {
                    this.toggleBilingual();
                } else if (e.code === 'Escape') {
                    if (this.dom.paletteDrawer && !this.dom.paletteDrawer.classList.contains('hidden')) {
                        this.closeQuestionPalette();
                    } else if (this.dom.vocabModal && !this.dom.vocabModal.classList.contains('hidden')) {
                        this.closeVocab();
                    } else if (this.dom.noteModal && !this.dom.noteModal.classList.contains('hidden')) {
                        this.closeTakeNote();
                    } else {
                        this.close();
                    }
                }
            });
        }

        // =========================================================================
        // OPEN & INITIALIZE WORKSTATION
        // =========================================================================
        async open(options = {}) {
            this.cacheDom();
            if (!this.dom.modal) {
                console.error('Workstation modal #toeicReadingWorkstation not found');
                return;
            }

            // Xử lý options
            this.part = options.part || 5;
            this.currentTopic = options.topic || '';
            this.isEts2026 = !!options.isEts2026;
            this.testNumber = options.testNum ? parseInt(options.testNum, 10) : 1;

            // Đặt tiêu đề mặc định
            if (options.title) {
                this.title = options.title;
            } else {
                if (this.part === 5) this.title = 'Part 5 - Incomplete Sentences (Điền từ)';
                else if (this.part === 6) this.title = 'Part 6 - Text Completion (Điền đoạn văn)';
                else if (this.part === 7) this.title = 'Part 7 - Reading Comprehension (Đọc hiểu)';
                else this.title = 'TOEIC Reading Practice';
            }

            // Xác định Tên bộ đề / chuyên đề hiển thị
            if (this.isEts2026) {
                this.currentTestName = `ETS 2026 - Test ${String(this.testNumber).padStart(2, '0')}`;
                this.subtitle = `${this.currentTestName} · Bản quyền ETS`;
            } else if (this.currentTopic) {
                const topicNames = {
                    word_form: 'Câu hỏi Từ loại (N, V, Adj, Adv)',
                    tenses_voice: 'Chia thì & Bị động (Tenses & Voice)',
                    prep_conj: 'Giới từ & Liên từ (Prep & Conj)',
                    collocations: 'Từ vựng ngữ cảnh (Collocations)',
                    email_letter: 'Email & Thư tín thương mại',
                    notice_memo: 'Thông báo & Bản ghi nhớ (Memo)',
                    ads_articles: 'Quảng cáo & Bài báo',
                    sentence_insertion: 'Điền câu vào chỗ trống',
                    single_passage: 'Đọc hiểu Đoạn đơn (Single Passage)',
                    double_passage: 'Đọc hiểu Đoạn kép (Double Passage)',
                    triple_passage: 'Đọc hiểu Đoạn ba (Triple Passage)',
                    inference_vocab: 'Suy luận & Điền câu (TOEIC 700+)'
                };
                this.currentTestName = topicNames[this.currentTopic] || this.currentTopic;
                this.subtitle = `Chuyên đề: ${this.currentTestName}`;
            } else {
                this.currentTestName = 'ETS 2019 - Test 2';
                this.subtitle = 'ETS 2019 - Test 2 · Bộ đề ôn tập tiêu chuẩn';
            }

            // Tải dữ liệu
            await this.loadItems();

            if (!this.items || this.items.length === 0) {
                showToast('⚠️ Không tìm thấy câu hỏi cho phần này. Đang nạp đề dự phòng...');
                if (window.ReadingPracticeDatabase) {
                    this.items = window.ReadingPracticeDatabase.getItemsForPractice({ part: this.part });
                }
            }

            this.currentIndex = 0;
            this.userAnswers = {};
            this.answeredState = {};
            this.flagged = {};

            // Cập nhật Header
            if (this.dom.title) this.dom.title.textContent = this.title;
            if (this.dom.subtitle) this.dom.subtitle.textContent = this.subtitle;
            if (this.dom.testSelectorLabel) this.dom.testSelectorLabel.textContent = this.currentTestName;

            // Ẩn/Hiện nút Dẫn chứng (chỉ dành cho Part 6 và 7)
            if (this.dom.btnEvidence) {
                if (this.part === 5) {
                    this.dom.btnEvidence.classList.add('hidden');
                } else {
                    this.dom.btnEvidence.classList.remove('hidden');
                }
            }

            this.updateToggleButtonsUI();

            // Hiển thị modal
            this.dom.modal.classList.remove('hidden');
            this.dom.modal.classList.add('flex');
            this.isOpen = true;
            document.body.style.overflow = 'hidden';

            this.render();
        }

        async loadItems() {
            // Ưu tiên nạp từ ReadingPracticeDatabase nếu có
            if (window.ReadingPracticeDatabase) {
                this.items = window.ReadingPracticeDatabase.getItemsForPractice({
                    part: this.part,
                    topic: this.currentTopic,
                    testNum: this.testNumber,
                    isEts2026: this.isEts2026
                });
            }

            // Nếu là đề ETS 2026 và chưa có trong cache, gọi Ets2026Database
            if ((!this.items || this.items.length === 0) && this.isEts2026 && window.Ets2026Database) {
                if (!window.Ets2026Database.hasTest(this.testNumber)) {
                    await window.Ets2026Database.loadTest(this.testNumber);
                }
                const testData = window.Ets2026Database.testsCache[this.testNumber];
                if (testData && testData.reading) {
                    if (this.part === 5) this.items = testData.reading.part5 || [];
                    else if (this.part === 6) this.items = testData.reading.part6 || [];
                    else if (this.part === 7) this.items = testData.reading.part7 || [];
                }
            }
        }

        close() {
            if (!this.dom.modal) this.cacheDom();
            if (this.dom.modal) {
                this.dom.modal.classList.add('hidden');
                this.dom.modal.classList.remove('flex');
            }
            this.isOpen = false;
            document.body.style.overflow = '';
            if (this.dom.testDropdown) this.dom.testDropdown.classList.add('hidden');
            if (this.dom.paletteDrawer) this.dom.paletteDrawer.classList.add('hidden');
            if (this.dom.vocabModal) this.dom.vocabModal.classList.add('hidden');
            if (this.dom.noteModal) this.dom.noteModal.classList.add('hidden');
        }

        // =========================================================================
        // RENDER LOGIC
        // =========================================================================
        render() {
            if (!this.items || this.items.length === 0) {
                if (this.dom.passageContainer) this.dom.passageContainer.innerHTML = '<div class="p-6 text-slate-500">Đang chuẩn bị dữ liệu câu hỏi...</div>';
                return;
            }

            const currentItem = this.items[this.currentIndex];
            this.updateNavRange(currentItem);

            if (this.part === 5) {
                this.renderPart5(currentItem);
            } else if (this.part === 6) {
                this.renderPart6(currentItem);
            } else if (this.part === 7) {
                this.renderPart7(currentItem);
            }
        }

        // -------------------------------------------------------------------------
        // 1. RENDER PART 5 (Mô phỏng 100% Ảnh 2)
        // -------------------------------------------------------------------------
        renderPart5(item) {
            // Instruction
            if (this.dom.instruction) {
                this.dom.instruction.textContent = 'Select the best answer to complete the sentence.';
            }

            // Left panel: Context & Translation (Bilingual)
            let leftHtml = '';
            if (this.showBilingual && item.translation_vi) {
                leftHtml = `
                    <div class="bg-blue-50/80 dark:bg-slate-900 rounded-2xl p-5 border border-blue-200 dark:border-slate-800 space-y-3 shadow-xs">
                        <div class="flex items-center gap-2 text-blue-700 dark:text-sky-400 font-extrabold text-xs uppercase tracking-wider">
                            <i class="fa-solid fa-language text-sm"></i>
                            <span>Dịch câu tiếng Việt (Song ngữ)</span>
                        </div>
                        <p class="text-sm font-semibold text-slate-800 dark:text-slate-100 leading-relaxed">
                            "${item.translation_vi}"
                        </p>
                    </div>
                `;
            } else {
                leftHtml = `
                    <div class="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
                        <div class="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-extrabold text-xs uppercase tracking-wider">
                            <i class="fa-solid fa-lightbulb text-sm"></i>
                            <span>Hướng dẫn làm bài Part 5</span>
                        </div>
                        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                            Đọc kỹ câu hỏi, xác định vị trí chỗ trống đứng trước hoặc sau từ loại gì để chọn phương án chính xác nhất.
                        </p>
                        <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
                            <div class="font-bold text-slate-700 dark:text-slate-200">💡 Mẹo làm bài nhanh:</div>
                            <div>• Nhìn 4 đáp án trước để nhận biết dạng câu: Từ loại, Chia thì hay Giới từ.</div>
                            <div>• Bấm nút <strong>✨ Song ngữ</strong> trên thanh công cụ để xem bản dịch tiếng Việt tức thì.</div>
                            <div>• Bấm nút <strong>💡 Giải thích</strong> để xem phân tích ngữ pháp chuyên sâu.</div>
                        </div>
                    </div>
                `;
            }

            // Vocabulary tags if any
            if (item.vocab && item.vocab.length > 0) {
                leftHtml += `
                    <div class="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-2.5 shadow-xs">
                        <div class="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                            <i class="fa-solid fa-book text-indigo-500"></i>
                            <span>Từ vựng trọng tâm trong câu</span>
                        </div>
                        <div class="flex flex-wrap gap-1.5">
                            ${item.vocab.map(v => `
                                <span class="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-slate-800 border border-indigo-100 dark:border-slate-700 text-indigo-900 dark:text-indigo-200 text-xs font-semibold">
                                    <strong>${v.word}</strong> <span class="text-slate-400 text-[10.5px]">(${v.pos})</span>: ${v.meaning}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            if (this.dom.passageContainer) {
                this.dom.passageContainer.innerHTML = leftHtml;
            }

            // Right panel: Question Card
            const qId = item.id || `q_${item.qNum || this.currentIndex}`;
            const selectedOpt = this.userAnswers[qId];
            const isAnswered = selectedOpt !== undefined;
            const isCorrect = isAnswered && selectedOpt === item.ans;

            let questionText = item.q || '';
            // Chuẩn hóa định dạng số câu
            if (!/^\d+\./.test(questionText) && item.qNum) {
                questionText = `${item.qNum}. ${questionText}`;
            }

            let rightHtml = `
                <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
                    <!-- Question Text -->
                    <div class="text-sm sm:text-[15.5px] font-bold text-slate-900 dark:text-white leading-relaxed">
                        ${questionText}
                    </div>

                    <!-- Options (A, B, C, D) with Radio Circles -->
                    <div class="space-y-2.5">
                        ${(item.options || []).map((optText, optIdx) => {
                            const isChosen = selectedOpt === optIdx;
                            const isThisCorrect = optIdx === item.ans;
                            
                            let optClass = 'border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200';
                            let circleClass = 'border-slate-300 dark:border-slate-700 bg-transparent';
                            let circleInner = '';

                            if (isChosen) {
                                optClass = 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 font-bold';
                                circleClass = 'border-blue-600 bg-blue-600';
                                circleInner = '<div class="w-2 h-2 rounded-full bg-white"></div>';
                            }

                            // Nếu đang bật Giải thích và đã chọn
                            if (this.showExplanation && isAnswered) {
                                if (isThisCorrect) {
                                    optClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100 font-bold';
                                    circleClass = 'border-emerald-500 bg-emerald-500';
                                    circleInner = '<i class="fa-solid fa-check text-white text-[9px]"></i>';
                                } else if (isChosen) {
                                    optClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-950 dark:text-rose-100 font-bold';
                                    circleClass = 'border-rose-500 bg-rose-500';
                                    circleInner = '<i class="fa-solid fa-xmark text-white text-[9px]"></i>';
                                }
                            }

                            return `
                                <div onclick="ToeicReadingWorkstation.selectOption('${qId}', ${optIdx}, ${item.qNum || this.currentIndex + 1})" 
                                     class="p-3.5 sm:p-4 rounded-xl border-2 flex items-center gap-3.5 transition cursor-pointer select-none ${optClass}">
                                    <div class="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition ${circleClass}">
                                        ${circleInner}
                                    </div>
                                    <div class="text-xs sm:text-sm font-semibold tracking-wide">
                                        ${optText}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>

                    <!-- Explanation Box -->
                    ${(this.showExplanation && isAnswered) ? `
                        <div class="p-4 sm:p-5 rounded-2xl bg-amber-50/70 dark:bg-slate-800/90 border border-amber-200 dark:border-slate-700 space-y-2.5 animate-fadeIn">
                            <div class="flex items-center justify-between">
                                <span class="px-2.5 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} text-[11px] font-black uppercase tracking-wider">
                                    ${isCorrect ? '✓ Đáp án đúng: ' + (item.ansLetter || ['A','B','C','D'][item.ans]) : '✗ Chưa chính xác (Đáp án đúng: ' + (item.ansLetter || ['A','B','C','D'][item.ans]) + ')'}
                                </span>
                            </div>
                            <div class="text-xs sm:text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed whitespace-pre-line font-medium">
                                ${item.explanation_vi || 'Đáp án đúng theo cấu trúc ngữ pháp chuẩn TOEIC ETS.'}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;

            if (this.dom.questionsContainer) {
                this.dom.questionsContainer.innerHTML = rightHtml;
            }
        }

        // -------------------------------------------------------------------------
        // 2. RENDER PART 6 (Mô phỏng 100% Ảnh 3)
        // -------------------------------------------------------------------------
        renderPart6(set) {
            if (this.dom.instruction) {
                this.dom.instruction.textContent = 'Select the best answer to complete the text.';
            }

            // Left panel: Passage with Blanks
            let passageRaw = set.passageText || set.passage || '';
            // Định dạng các chỗ trống ____[131] thành span có viền đẹp
            let formattedPassage = passageRaw.replace(/____\[?(\d{3})\]?/g, (m, qn) => {
                const isFocused = this.activeBlankFocus === qn;
                return `
                    <span id="blank_${qn}" onclick="ToeicReadingWorkstation.focusQuestion(${qn})" 
                          class="inline-flex items-center justify-center px-2 py-0.5 mx-1 rounded-md text-xs font-black transition cursor-pointer ${isFocused ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-500 shadow-sm' : 'bg-blue-100 dark:bg-slate-700 text-blue-800 dark:text-sky-300 border border-blue-300 dark:border-slate-600 hover:bg-amber-200'}">
                        ____[${qn}]
                    </span>
                `;
            });

            let leftHtml = `
                <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    ${set.passageTitle ? `
                        <h2 class="text-sm sm:text-base font-black text-slate-900 dark:text-white text-center border-b border-slate-100 dark:border-slate-800 pb-3">
                            ${set.passageTitle}
                        </h2>
                    ` : ''}
                    <div class="text-xs sm:text-[14px] text-slate-800 dark:text-slate-200 leading-loose whitespace-pre-line font-serif sm:font-sans">
                        ${formattedPassage}
                    </div>

                    ${(this.showBilingual && set.passage_vi) ? `
                        <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                            <div class="flex items-center gap-1.5 text-blue-600 dark:text-sky-400 font-bold text-xs uppercase">
                                <i class="fa-solid fa-language"></i>
                                <span>Bản dịch tiếng Việt (Song ngữ)</span>
                            </div>
                            <div class="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl">
                                ${set.passage_vi}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;

            if (this.dom.passageContainer) {
                this.dom.passageContainer.innerHTML = leftHtml;
            }

            // Right panel: Stack of 4 questions (Q131..Q134)
            const questions = set.questions || [];
            let rightHtml = `
                <div class="space-y-5">
                    ${questions.map((qItem) => {
                        const qId = qItem.id || `p6_q_${qItem.qNum}`;
                        const selectedOpt = this.userAnswers[qId];
                        const isAnswered = selectedOpt !== undefined;
                        const isCorrect = isAnswered && selectedOpt === qItem.ans;

                        return `
                            <div id="qcard_${qItem.qNum}" class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition">
                                <div class="text-sm font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                                    <span>${qItem.qNum}.</span>
                                    ${(this.showExplanation && isAnswered) ? `
                                        <span class="px-2 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} text-[10px] font-black">
                                            ${isCorrect ? '✓ Đúng' : '✗ Sai'}
                                        </span>
                                    ` : ''}
                                </div>

                                <div class="space-y-2">
                                    ${(qItem.options || []).map((optText, optIdx) => {
                                        const isChosen = selectedOpt === optIdx;
                                        const isThisCorrect = optIdx === qItem.ans;

                                        let optClass = 'border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200';
                                        let circleClass = 'border-slate-300 dark:border-slate-700 bg-transparent';
                                        let circleInner = '';

                                        if (isChosen) {
                                            optClass = 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 font-bold';
                                            circleClass = 'border-blue-600 bg-blue-600';
                                            circleInner = '<div class="w-2 h-2 rounded-full bg-white"></div>';
                                        }

                                        if (this.showExplanation && isAnswered) {
                                            if (isThisCorrect) {
                                                optClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100 font-bold';
                                                circleClass = 'border-emerald-500 bg-emerald-500';
                                                circleInner = '<i class="fa-solid fa-check text-white text-[9px]"></i>';
                                            } else if (isChosen) {
                                                optClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-950 dark:text-rose-100 font-bold';
                                                circleClass = 'border-rose-500 bg-rose-500';
                                                circleInner = '<i class="fa-solid fa-xmark text-white text-[9px]"></i>';
                                            }
                                        }

                                        return `
                                            <div onclick="ToeicReadingWorkstation.selectOption('${qId}', ${optIdx}, ${qItem.qNum})" 
                                                 class="p-3 sm:p-3.5 rounded-xl border flex items-center gap-3 transition cursor-pointer select-none ${optClass}">
                                                <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${circleClass}">
                                                    ${circleInner}
                                                </div>
                                                <div class="text-xs sm:text-[13px] font-semibold">
                                                    ${optText}
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>

                                ${(this.showExplanation && isAnswered && qItem.explanation_vi) ? `
                                    <div class="p-3.5 rounded-xl bg-amber-50/70 dark:bg-slate-800/90 border border-amber-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                                        <strong>Giải thích câu ${qItem.qNum}:</strong>\n${qItem.explanation_vi}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            if (this.dom.questionsContainer) {
                this.dom.questionsContainer.innerHTML = rightHtml;
            }
        }

        // -------------------------------------------------------------------------
        // 3. RENDER PART 7 (Mô phỏng 100% Ảnh 4)
        // -------------------------------------------------------------------------
        renderPart7(set) {
            const qRangeStr = set.qRange || (set.questions && set.questions.length ? `${set.questions[0].qNum}-${set.questions[set.questions.length-1].qNum}` : '147-148');
            const docTypeStr = set.docType ? `the following ${set.docType.toLowerCase()}` : 'the following document';

            if (this.dom.instruction) {
                this.dom.instruction.textContent = set.instruction || `Questions ${qRangeStr} refer to ${docTypeStr}.`;
            }

            // Evidence highlighting logic
            let passageHtml = set.passageContent || set.passage || '';
            if (this.showEvidence && set.evidence) {
                Object.keys(set.evidence).forEach(qNum => {
                    const clue = set.evidence[qNum];
                    if (clue && passageHtml.includes(clue)) {
                        passageHtml = passageHtml.replace(clue, `<mark class="bg-amber-200 dark:bg-amber-900/70 text-slate-900 dark:text-amber-100 px-1 py-0.5 rounded font-semibold border-b-2 border-amber-500" title="Dẫn chứng câu ${qNum}">${clue} <span class="text-[10px] bg-amber-600 text-white px-1 rounded ml-1 font-bold">[Q.${qNum}]</span></mark>`);
                    }
                });
            }

            let leftHtml = `
                <div class="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    ${set.passageTitle ? `
                        <div class="text-center border-b border-slate-100 dark:border-slate-800 pb-3">
                            <h2 class="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wide">
                                ${set.passageTitle.replace(/\n/g, '<br>')}
                            </h2>
                        </div>
                    ` : ''}

                    <div class="text-xs sm:text-[14px] text-slate-800 dark:text-slate-200 leading-relaxed font-sans space-y-3">
                        ${passageHtml}
                    </div>

                    ${(this.showBilingual && set.passage_vi) ? `
                        <div class="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
                            <div class="flex items-center gap-1.5 text-blue-600 dark:text-sky-400 font-bold text-xs uppercase">
                                <i class="fa-solid fa-language"></i>
                                <span>Bản dịch tiếng Việt (Song ngữ)</span>
                            </div>
                            <div class="text-xs sm:text-[13px] text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl">
                                ${set.passage_vi}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;

            if (this.dom.passageContainer) {
                this.dom.passageContainer.innerHTML = leftHtml;
            }

            // Right panel: Question cards for Part 7
            const questions = set.questions || [];
            let rightHtml = `
                <div class="space-y-5">
                    ${questions.map((qItem) => {
                        const qId = qItem.id || `p7_q_${qItem.qNum}`;
                        const selectedOpt = this.userAnswers[qId];
                        const isAnswered = selectedOpt !== undefined;
                        const isCorrect = isAnswered && selectedOpt === qItem.ans;

                        let questionPrompt = qItem.q || '';
                        if (!/^\d+\./.test(questionPrompt)) {
                            questionPrompt = `${qItem.qNum}. ${questionPrompt}`;
                        }

                        return `
                            <div id="qcard_${qItem.qNum}" class="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition">
                                <div class="text-sm sm:text-[14.5px] font-bold text-slate-900 dark:text-white leading-relaxed flex items-start justify-between gap-3">
                                    <span>${questionPrompt}</span>
                                    ${(this.showExplanation && isAnswered) ? `
                                        <span class="px-2 py-0.5 rounded-full ${isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'} text-[10px] font-black shrink-0">
                                            ${isCorrect ? '✓ Đúng' : '✗ Sai'}
                                        </span>
                                    ` : ''}
                                </div>

                                <div class="space-y-2">
                                    ${(qItem.options || []).map((optText, optIdx) => {
                                        const isChosen = selectedOpt === optIdx;
                                        const isThisCorrect = optIdx === qItem.ans;

                                        let optClass = 'border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200';
                                        let circleClass = 'border-slate-300 dark:border-slate-700 bg-transparent';
                                        let circleInner = '';

                                        if (isChosen) {
                                            optClass = 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 text-blue-950 dark:text-blue-100 font-bold';
                                            circleClass = 'border-blue-600 bg-blue-600';
                                            circleInner = '<div class="w-2 h-2 rounded-full bg-white"></div>';
                                        }

                                        if (this.showExplanation && isAnswered) {
                                            if (isThisCorrect) {
                                                optClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-950 dark:text-emerald-100 font-bold';
                                                circleClass = 'border-emerald-500 bg-emerald-500';
                                                circleInner = '<i class="fa-solid fa-check text-white text-[9px]"></i>';
                                            } else if (isChosen) {
                                                optClass = 'border-rose-500 bg-rose-50 dark:bg-rose-950/50 text-rose-950 dark:text-rose-100 font-bold';
                                                circleClass = 'border-rose-500 bg-rose-500';
                                                circleInner = '<i class="fa-solid fa-xmark text-white text-[9px]"></i>';
                                            }
                                        }

                                        return `
                                            <div onclick="ToeicReadingWorkstation.selectOption('${qId}', ${optIdx}, ${qItem.qNum})" 
                                                 class="p-3 sm:p-3.5 rounded-xl border flex items-center gap-3 transition cursor-pointer select-none ${optClass}">
                                                <div class="w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${circleClass}">
                                                    ${circleInner}
                                                </div>
                                                <div class="text-xs sm:text-[13px] font-semibold">
                                                    ${optText}
                                                </div>
                                            </div>
                                        `;
                                    }).join('')}
                                </div>

                                ${(this.showExplanation && isAnswered && qItem.explanation_vi) ? `
                                    <div class="p-3.5 rounded-xl bg-amber-50/70 dark:bg-slate-800/90 border border-amber-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-200 whitespace-pre-line leading-relaxed">
                                        <strong>Giải thích & Dẫn chứng câu ${qItem.qNum}:</strong>\n${qItem.explanation_vi}
                                    </div>
                                ` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            `;

            if (this.dom.questionsContainer) {
                this.dom.questionsContainer.innerHTML = rightHtml;
            }
        }

        // =========================================================================
        // USER ACTIONS & INTERACTIVITY
        // =========================================================================
        selectOption(qId, optIdx, qNum) {
            this.userAnswers[qId] = optIdx;

            // Kiểm tra đúng/sai
            let targetItem = null;
            if (this.part === 5) {
                targetItem = this.items[this.currentIndex];
            } else {
                const currentSet = this.items[this.currentIndex];
                targetItem = (currentSet.questions || []).find(q => (q.id || `q_${q.qNum}`) === qId || q.qNum === qNum);
            }

            const isCorrect = targetItem && optIdx === targetItem.ans;
            this.answeredState[qId] = { checked: true, isCorrect, selectedIndex: optIdx };

            // Ghi nhận tích lũy vào Daily Tasks nếu đúng
            if (isCorrect && window.DailyTaskTracker) {
                window.DailyTaskTracker.recordProgress('reading', 1);
            }

            // Render lại để hiển thị highlight
            this.render();
        }

        focusQuestion(qNum) {
            this.activeBlankFocus = String(qNum);
            const el = document.getElementById(`qcard_${qNum}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('ring-2', 'ring-blue-500');
                setTimeout(() => el.classList.remove('ring-2', 'ring-blue-500'), 1500);
            }
            this.render();
        }

        toggleBilingual() {
            this.showBilingual = !this.showBilingual;
            this.updateToggleButtonsUI();
            this.render();
        }

        toggleEvidence() {
            this.showEvidence = !this.showEvidence;
            this.updateToggleButtonsUI();
            this.render();
        }

        toggleExplanation() {
            this.showExplanation = !this.showExplanation;
            this.updateToggleButtonsUI();
            this.render();
        }

        updateToggleButtonsUI() {
            if (this.dom.btnBilingual) {
                this.dom.btnBilingual.className = this.showBilingual 
                    ? 'px-2.5 sm:px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 shadow-xs transition'
                    : 'px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition';
            }
            if (this.dom.btnEvidence) {
                this.dom.btnEvidence.className = this.showEvidence 
                    ? 'px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-600 text-white text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 shadow-xs transition'
                    : 'px-2.5 sm:px-3 py-1.5 rounded-lg border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition';
            }
            if (this.dom.btnExplanation) {
                this.dom.btnExplanation.className = this.showExplanation 
                    ? 'px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500 text-slate-900 text-[11px] sm:text-xs font-extrabold flex items-center gap-1.5 shadow-xs transition'
                    : 'px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-amber-300 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition';
            }
        }

        // =========================================================================
        // NAVIGATION & QUESTION PALETTE
        // =========================================================================
        updateNavRange(item) {
            if (!this.dom.navRangeLabel) return;

            if (this.part === 5) {
                const total = this.items.length;
                this.dom.navRangeLabel.textContent = `${this.currentIndex + 1}/${total}`;
            } else if (this.part === 6 || this.part === 7) {
                const qRange = item.qRange || (item.questions && item.questions.length ? `${item.questions[0].qNum}-${item.questions[item.questions.length-1].qNum}` : `${this.currentIndex + 1}`);
                let totalQs = 0;
                this.items.forEach(s => totalQs += (s.questions ? s.questions.length : 1));
                this.dom.navRangeLabel.textContent = `${qRange}/${totalQs}`;
            }
        }

        next() {
            if (this.currentIndex < this.items.length - 1) {
                this.currentIndex++;
                this.activeBlankFocus = null;
                this.render();
                if (this.dom.rightCol) this.dom.rightCol.scrollTop = 0;
                if (this.dom.leftCol) this.dom.leftCol.scrollTop = 0;
            } else {
                showToast('🎉 Bạn đã hoàn thành câu hỏi cuối cùng của phần ôn tập này!');
            }
        }

        prev() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.activeBlankFocus = null;
                this.render();
                if (this.dom.rightCol) this.dom.rightCol.scrollTop = 0;
                if (this.dom.leftCol) this.dom.leftCol.scrollTop = 0;
            }
        }

        jumpTo(index) {
            if (index >= 0 && index < this.items.length) {
                this.currentIndex = index;
                this.activeBlankFocus = null;
                this.render();
                this.closeQuestionPalette();
                if (this.dom.rightCol) this.dom.rightCol.scrollTop = 0;
                if (this.dom.leftCol) this.dom.leftCol.scrollTop = 0;
            }
        }

        openQuestionPalette() {
            if (!this.dom.paletteDrawer) this.cacheDom();
            if (!this.dom.paletteDrawer || !this.dom.paletteGrid) return;

            let html = '';
            if (this.part === 5) {
                this.items.forEach((item, idx) => {
                    const qId = item.id || `q_${item.qNum || idx}`;
                    const isAnswered = this.userAnswers[qId] !== undefined;
                    const isCurrent = idx === this.currentIndex;

                    let btnClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
                    if (isCurrent) btnClass = 'ring-2 ring-blue-500 font-black';
                    if (isAnswered) btnClass += ' bg-blue-600 text-white border-blue-600';

                    html += `
                        <button onclick="ToeicReadingWorkstation.jumpTo(${idx})" 
                                class="w-10 h-10 rounded-xl text-xs font-bold border flex items-center justify-center transition cursor-pointer ${btnClass}">
                            ${item.qNum || idx + 1}
                        </button>
                    `;
                });
            } else {
                this.items.forEach((set, sIdx) => {
                    const isCurrentSet = sIdx === this.currentIndex;
                    html += `
                        <div class="col-span-full p-2 rounded-xl ${isCurrentSet ? 'bg-blue-50 dark:bg-slate-800 border border-blue-200' : 'bg-slate-50 dark:bg-slate-900'} flex items-center justify-between cursor-pointer" onclick="ToeicReadingWorkstation.jumpTo(${sIdx})">
                            <span class="text-xs font-bold text-slate-900 dark:text-white">Đoạn văn ${sIdx + 1} (Câu ${set.qRange || ''})</span>
                            <span class="text-[11px] text-blue-600 dark:text-sky-400 font-semibold">${isCurrentSet ? 'Đang làm' : 'Xem →'}</span>
                        </div>
                    `;
                });
            }

            this.dom.paletteGrid.innerHTML = html;
            this.dom.paletteDrawer.classList.remove('hidden');
        }

        closeQuestionPalette() {
            if (this.dom.paletteDrawer) this.dom.paletteDrawer.classList.add('hidden');
        }

        // =========================================================================
        // TEST & TOPIC SELECTOR DROPDOWN
        // =========================================================================
        toggleTestDropdown() {
            if (!this.dom.testDropdown) this.cacheDom();
            if (!this.dom.testDropdown) return;
            this.dom.testDropdown.classList.toggle('hidden');
        }

        selectTestOrTopic(type, val) {
            if (this.dom.testDropdown) this.dom.testDropdown.classList.add('hidden');

            if (type === 'ets2019') {
                this.open({ part: this.part, isEts2026: false, title: `Part ${this.part} - ETS 2019 Test 2` });
            } else if (type === 'ets2026') {
                const num = parseInt(val, 10) || 1;
                this.open({ part: this.part, isEts2026: true, testNum: num, title: `ETS 2026 - Test ${String(num).padStart(2,'0')} - Part ${this.part}` });
            } else if (type === 'subtopic') {
                this.open({ part: this.part, topic: val });
            }
        }

        // =========================================================================
        // UTILITIES: VOCAB, TAKE NOTE, REPORT
        // =========================================================================
        toggleVocab() {
            if (!this.dom.vocabModal) this.cacheDom();
            if (!this.dom.vocabModal) return;

            const current = this.items[this.currentIndex];
            let vocabHtml = '';

            if (current && current.vocab && current.vocab.length > 0) {
                vocabHtml = current.vocab.map(v => `
                    <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                        <div class="flex items-center justify-between">
                            <span class="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">${v.word}</span>
                            <span class="text-xs text-slate-400">${v.ipa || ''} · <span class="italic font-bold">${v.pos || ''}</span></span>
                        </div>
                        <p class="text-xs text-slate-700 dark:text-slate-300">${v.meaning}</p>
                    </div>
                `).join('');
            } else {
                vocabHtml = `
                    <div class="p-4 text-center text-slate-400 text-xs">
                        Từ vựng ngữ cảnh của câu này sẽ được cập nhật thêm theo ngữ pháp bài thi.
                    </div>
                `;
            }

            if (this.dom.vocabList) this.dom.vocabList.innerHTML = vocabHtml;
            this.dom.vocabModal.classList.remove('hidden');
        }

        closeVocab() {
            if (this.dom.vocabModal) this.dom.vocabModal.classList.add('hidden');
        }

        openTakeNote() {
            if (!this.dom.noteModal) this.cacheDom();
            if (!this.dom.noteModal) return;

            const key = `trw_note_p${this.part}_${this.currentIndex}`;
            const saved = localStorage.getItem(key) || '';
            if (this.dom.noteText) this.dom.noteText.value = saved;
            this.dom.noteModal.classList.remove('hidden');
        }

        saveTakeNote() {
            if (this.dom.noteText) {
                const key = `trw_note_p${this.part}_${this.currentIndex}`;
                localStorage.setItem(key, this.dom.noteText.value);
                showToast('📝 Đã lưu ghi chú vào sổ tay thành công!');
                this.closeTakeNote();
            }
        }

        closeTakeNote() {
            if (this.dom.noteModal) this.dom.noteModal.classList.add('hidden');
        }

        reportIssue() {
            showToast('⚠️ Cảm ơn bạn! Đã ghi nhận báo lỗi nội dung câu hỏi để đội ngũ học thuật kiểm tra.');
        }

        giveFeedback() {
            showToast('💬 Cảm ơn bạn đã đóng góp ý kiến để nâng cấp giao diện ôn tập TOEIC!');
        }
    }

    window.ToeicReadingWorkstation = new ToeicReadingWorkstation();

})(typeof window !== 'undefined' ? window : global, typeof document !== 'undefined' ? document : {});
