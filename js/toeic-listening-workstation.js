/**
 * TOEIC LISTENING WORKSTATION (Chuẩn ETS 2026 / Study4 / Prep)
 * Phục vụ toàn bộ bài thi nghe TOEIC: Part 1, Part 2, Part 3, Part 4
 * Giao diện 2 cột toàn màn hình (Split Pane), Waveform Audio Player, 
 * Phím tắt bàn phím thực chiến, Bảng câu hỏi lưới (Palette), Song ngữ & Dẫn chứng.
 */

(function (window, document) {
    'use strict';

    class ToeicListeningWorkstation {
        constructor() {
            this.isOpen = false;
            this.mode = 'practice'; // 'practice' | 'exam'
            this.part = 1; // 1 | 2 | 3 | 4
            this.title = '';
            this.items = []; // Danh sách items (Part 1, 2 là câu hỏi; Part 3, 4 là các set 3 câu)
            this.currentIndex = 0;
            this.userAnswers = {}; // { questionId: selectedIndex }
            this.answeredState = {}; // { questionId: { isCorrect, selectedIndex, checked: true } }

            // Audio Player state
            this.audio = new Audio();
            this.isPlaying = false;
            this.currentTime = 0;
            this.duration = 0;
            this.playbackRate = 1.0;
            this.isLooping = false;
            this.volume = 0.9;
            this.audioWaveData = [];

            // UI Toggles
            this.showTranscript = false;
            this.showBilingual = false;
            this.showEvidence = false;
            this.showExplanation = false;

            this.initAudioEvents();
            this.initKeyboardShortcuts();
        }

        // =========================================================================
        // KHỞI TẠO AUDIO & PHÍM TẮT
        // =========================================================================
        initAudioEvents() {
            this.audio.preload = 'auto';

            this.audio.addEventListener('timeupdate', () => {
                this.currentTime = this.audio.currentTime;
                this.duration = this.audio.duration || 0;
                this.updateWaveformProgress();
                this.updateTimeDisplay();
            });

            this.audio.addEventListener('loadedmetadata', () => {
                this.duration = this.audio.duration || 0;
                this.updateTimeDisplay();
            });

            this.audio.addEventListener('play', () => {
                this.isPlaying = true;
                this.updatePlayPauseButton();
            });

            this.audio.addEventListener('pause', () => {
                this.isPlaying = false;
                this.updatePlayPauseButton();
            });

            this.audio.addEventListener('ended', () => {
                if (this.isLooping) {
                    this.audio.currentTime = 0;
                    this.audio.play();
                } else {
                    this.isPlaying = false;
                    this.updatePlayPauseButton();
                }
            });
        }

        initKeyboardShortcuts() {
            window.addEventListener('keydown', (e) => {
                if (!this.isOpen) return;

                // Tránh can thiệp khi đang gõ vào input hoặc textarea
                const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
                if (activeTag === 'input' || activeTag === 'textarea') return;

                if (e.code === 'Space') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.seekTo(0);
                    } else {
                        this.togglePlay();
                    }
                } else if (e.code === 'ArrowLeft') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.changeSpeed(-1);
                    } else {
                        this.seekBy(-5);
                    }
                } else if (e.code === 'ArrowRight') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.changeSpeed(1);
                    } else {
                        this.seekBy(5);
                    }
                } else if (e.code === 'ArrowUp') {
                    e.preventDefault();
                    this.changeVolume(0.05);
                } else if (e.code === 'ArrowDown') {
                    e.preventDefault();
                    this.changeVolume(-0.05);
                } else if (e.code === 'Escape') {
                    const paletteModal = document.getElementById('tlwPaletteModal');
                    if (paletteModal && !paletteModal.classList.contains('hidden')) {
                        paletteModal.classList.add('hidden');
                    } else {
                        this.close();
                    }
                }
            });
        }

        // =========================================================================
        // MỞ WORKSTATION TỪ CÁC THẺ BÀI THI
        // =========================================================================
        async open(config = {}) {
            let type = config.type || 'listening_part1';
            let title = config.title || 'Luyện nghe TOEIC';
            let count = config.count || 50;

            if (typeof config === 'string') {
                type = config;
                title = arguments[1] || 'Luyện nghe TOEIC';
            }

            this.title = title;
            const cleanTitle = title.toLowerCase();

            // Xác định Part từ config, type hoặc title
            if (config.part) {
                this.part = parseInt(config.part, 10);
            } else if (type.includes('part1') || type.includes('p1') || cleanTitle.includes('part 1')) {
                this.part = 1;
            } else if (type.includes('part2') || type.includes('p2') || cleanTitle.includes('part 2')) {
                this.part = 2;
            } else if (type.includes('part3') || type.includes('p3') || cleanTitle.includes('part 3')) {
                this.part = 3;
            } else if (type.includes('part4') || type.includes('p4') || cleanTitle.includes('part 4')) {
                this.part = 4;
            } else {
                this.part = 1;
            }

            // Xác định testNumber
            let testNum = config.testNumber;
            if (!testNum) {
                const match = (type + ' ' + title).match(/(?:test|t)\s*0?(\d+)/i);
                if (match) testNum = parseInt(match[1], 10);
                else if (window.Ets2026Database) testNum = window.Ets2026Database.currentTestNum;
                else testNum = 1;
            }
            this.testNumber = testNum || 1;

            // Đảm bảo dữ liệu đề thi ETS 2026 được nạp
            const isEts = cleanTitle.includes('ets 2026') || type.includes('ets2026') || cleanTitle.includes('ets2026') || config.isEts2026;
            if (isEts && window.Ets2026Database) {
                if (!window.Ets2026Database.hasTest(this.testNumber)) {
                    await window.Ets2026Database.loadTest(this.testNumber);
                }
            }

            // Nạp dữ liệu tương ứng từ Ets2026Database hoặc ListeningDatabaseV2
            this.loadDataset(type, title, count, config);

            if (!this.items || this.items.length === 0) {
                if (typeof showToast === 'function') showToast('⚠️ Chưa tìm thấy câu hỏi phù hợp cho bài thi này.');
                return;
            }

            this.currentIndex = 0;
            this.userAnswers = {};
            this.answeredState = {};
            this.showTranscript = false;
            this.showBilingual = false;
            this.showEvidence = false;
            this.showExplanation = false;

            const el = document.getElementById('toeicListeningWorkstation');
            if (el) {
                el.classList.remove('hidden');
                el.classList.add('flex');
                document.body.classList.add('overflow-hidden');
            }

            this.isOpen = true;
            this.renderCurrentQuestion();
        }

        close() {
            this.pause();
            const el = document.getElementById('toeicListeningWorkstation');
            if (el) {
                el.classList.add('hidden');
                el.classList.remove('flex');
                document.body.classList.remove('overflow-hidden');
            }
            this.isOpen = false;
        }

        // =========================================================================
        // NẠP DỮ LIỆU ĐỀ THI
        // =========================================================================
        loadDataset(type, title, count, config = {}) {
            const cleanTitle = title.toLowerCase();
            this.items = [];

            // Ưu tiên nạp từ bộ đề chính thức ETS 2026 nếu được chọn
            if (cleanTitle.includes('ets 2026') || type.includes('ets2026') || cleanTitle.includes('ets2026') || config.isEts2026) {
                if (window.Ets2026Database) {
                    const tNum = this.testNumber || 1;
                    if (type.includes('full') || cleanTitle.includes('full') || type.includes('lc') || cleanTitle.includes('100 câu')) {
                        this.items = [
                            ...window.Ets2026Database.getPart(1, tNum),
                            ...window.Ets2026Database.getPart(2, tNum),
                            ...window.Ets2026Database.getPart(3, tNum),
                            ...window.Ets2026Database.getPart(4, tNum)
                        ];
                    } else if (this.part === 1) this.items = window.Ets2026Database.getPart(1, tNum);
                    else if (this.part === 2) this.items = window.Ets2026Database.getPart(2, tNum);
                    else if (this.part === 3) this.items = window.Ets2026Database.getPart(3, tNum);
                    else if (this.part === 4) this.items = window.Ets2026Database.getPart(4, tNum);
                    if (this.items && this.items.length > 0) {
                        return;
                    }
                }
            }

            if (this.part === 1) {
                // Part 1: 40 câu chia 4 chủ đề (hoặc tất cả)
                let allP1 = [];
                if (window.ListeningDatabaseV2) {
                    allP1 = window.ListeningDatabaseV2.getFlattenedQuestions(1);
                } else if (window.quizQuestions && window.quizQuestions.listening_part1) {
                    allP1 = window.quizQuestions.listening_part1;
                }

                if (cleanTitle.includes('người & vật') || cleanTitle.includes('người và vật') || cleanTitle.includes('tương tác')) {
                    this.items = allP1.filter(q => q.topic && (q.topic.includes('Người & vật') || q.topic.includes('người và vật') || q.topic.includes('tương tác')));
                } else if (cleanTitle.includes('tả người') || cleanTitle.includes('người')) {
                    this.items = allP1.filter(q => q.topic && q.topic.includes('tả người'));
                } else if (cleanTitle.includes('tả vật') || cleanTitle.includes('vật')) {
                    this.items = allP1.filter(q => q.topic && q.topic.includes('tả vật'));
                } else if (cleanTitle.includes('cảnh') || cleanTitle.includes('bối cảnh')) {
                    this.items = allP1.filter(q => q.topic && (q.topic.includes('cảnh') || q.topic.includes('bối cảnh')));
                }

                if (!this.items || this.items.length === 0) {
                    this.items = [...allP1];
                }
            } else if (this.part === 2) {
                // Part 2: 25 câu Wh-, Yes/No, Choice, Statement
                let allP2 = [];
                if (window.ListeningDatabaseV2) {
                    allP2 = window.ListeningDatabaseV2.getFlattenedQuestions(2);
                } else if (window.quizQuestions && window.quizQuestions.listening_part2) {
                    allP2 = window.quizQuestions.listening_part2;
                }

                if (cleanTitle.includes('wh-') || cleanTitle.includes('wh')) {
                    this.items = allP2.filter(q => ['who', 'where', 'when', 'why', 'how', 'what'].includes(q.question_type));
                } else if (cleanTitle.includes('yes/no') || cleanTitle.includes('yes no')) {
                    this.items = allP2.filter(q => ['yes_no', 'tag_question', 'opinion'].includes(q.question_type) || (q.q && q.q.match(/^(Is|Are|Do|Did|Has|Have|Can|Could|Will|Would)/i)));
                } else if (cleanTitle.includes('lựa chọn') || cleanTitle.includes('đề nghị')) {
                    this.items = allP2.filter(q => ['choice', 'offer'].includes(q.question_type) || (q.q && q.q.toLowerCase().includes(' or ')));
                } else if (cleanTitle.includes('trần thuật')) {
                    this.items = allP2.filter(q => q.question_type === 'statement' || (q.q && q.q.trim().endsWith('.')));
                }

                if (!this.items || this.items.length === 0) {
                    this.items = [...allP2];
                }
            } else if (this.part === 3) {
                // Part 3: Lấy theo Set (mỗi Set gồm 3 câu hỏi)
                let setsP3 = [];
                if (window.ListeningDatabaseV2 && window.ListeningDatabaseV2.part3) {
                    setsP3 = window.ListeningDatabaseV2.part3;
                } else if (window.ListeningDatabaseV2 && window.ListeningDatabaseV2.database) {
                    setsP3 = window.ListeningDatabaseV2.database.part3 || [];
                }

                if (cleanTitle.includes('công sở') || cleanTitle.includes('nhân sự')) {
                    this.items = setsP3.filter(s => [1, 3, 6, 9, 13].includes(s.setNumber));
                } else if (cleanTitle.includes('mua sắm') || cleanTitle.includes('đặt hàng') || cleanTitle.includes('dịch vụ')) {
                    this.items = setsP3.filter(s => [2, 5, 7].includes(s.setNumber));
                } else if (cleanTitle.includes('du lịch') || cleanTitle.includes('di chuyển') || cleanTitle.includes('sự kiện')) {
                    this.items = setsP3.filter(s => [4, 8].includes(s.setNumber));
                } else if (cleanTitle.includes('ngụ ý') || cleanTitle.includes('bảng biểu')) {
                    this.items = setsP3.filter(s => [10, 11, 12].includes(s.setNumber));
                }

                if (!this.items || this.items.length === 0) {
                    this.items = [...setsP3];
                }
            } else if (this.part === 4) {
                // Part 4: Lấy theo Set (mỗi Set gồm 3 câu hỏi)
                let setsP4 = [];
                if (window.ListeningDatabaseV2 && window.ListeningDatabaseV2.part4) {
                    setsP4 = window.ListeningDatabaseV2.part4;
                } else if (window.ListeningDatabaseV2 && window.ListeningDatabaseV2.database) {
                    setsP4 = window.ListeningDatabaseV2.database.part4 || [];
                }

                if (cleanTitle.includes('thông báo') || cleanTitle.includes('tin nhắn') || cleanTitle.includes('voicemail')) {
                    this.items = setsP4.filter(s => [1, 2, 8].includes(s.setNumber));
                } else if (cleanTitle.includes('quảng cáo') || cleanTitle.includes('giới thiệu')) {
                    this.items = setsP4.filter(s => [3, 7].includes(s.setNumber));
                } else if (cleanTitle.includes('phát biểu') || cleanTitle.includes('tour')) {
                    this.items = setsP4.filter(s => [5, 6].includes(s.setNumber));
                } else if (cleanTitle.includes('bản tin') || cleanTitle.includes('thời tiết') || cleanTitle.includes('giao thông')) {
                    this.items = setsP4.filter(s => [4, 9, 10].includes(s.setNumber));
                }

                if (!this.items || this.items.length === 0) {
                    this.items = [...setsP4];
                }
            }

            if (count && count < this.items.length) {
                this.items = this.items.slice(0, count);
            }
        }

        // =========================================================================
        // RENDER CÂU HỎI HIỆN TẠI
        // =========================================================================
        renderCurrentQuestion() {
            const currentItem = this.items[this.currentIndex];
            if (!currentItem) return;

            // Tự động cập nhật Part nếu câu hỏi thuộc đề thi Full LC hỗn hợp
            if (currentItem.part) {
                this.part = currentItem.part;
            }

            // 1. Cập nhật Top Bar (Header)
            this.updateHeader(currentItem);

            // 2. Cập nhật Cột trái: Hướng dẫn, Waveform Player, Ảnh / Bảng biểu / Transcript
            this.updateLeftColumn(currentItem);

            // 3. Cập nhật Cột phải: Danh sách câu hỏi (1 câu cho P1, P2; 3 câu cho P3, P4)
            this.updateRightColumn(currentItem);

            // 4. Cập nhật Bottom Bar: Palette button, Next, Prev, Speaker Accent
            this.updateFooter(currentItem);

            // 5. Nạp audio cho item hiện tại (không tự phát)
            this.loadAudioForItem(currentItem);
        }

        updateHeader(item) {
            const titleEl = document.getElementById('tlwTitle');
            const subtitleEl = document.getElementById('tlwSubtitle');
            const badgeEl = document.getElementById('tlwTestBadge');

            let partName = `Part ${this.part}`;
            if (this.part === 1) partName = `Part 1 - Photographs (${item.topic || 'Mô tả tranh'})`;
            else if (this.part === 2) partName = `Part 2 - Question-Response (${item.topic || 'Hỏi & Đáp'})`;
            else if (this.part === 3) partName = `Part 3 - Conversations (${item.topic || 'Hội thoại'})`;
            else if (this.part === 4) partName = `Part 4 - Short Talks (${item.topic || 'Bài nói ngắn'})`;

            if (titleEl) titleEl.textContent = partName;

            const tNum = this.testNumber || (item.test || 1);
            let questionNumberText = '';
            if (this.part === 1) {
                const qNum = item.qNum || (this.currentIndex + 1);
                questionNumberText = `ETS 2026 (Test ${tNum}) · Câu ${qNum} (${this.currentIndex + 1} / ${this.items.length})`;
            } else if (this.part === 2) {
                const qNum = item.qNum || (7 + this.currentIndex);
                questionNumberText = `ETS 2026 (Test ${tNum}) · Câu ${qNum} (${this.currentIndex + 1} / ${this.items.length})`;
            } else if (this.part === 3) {
                const qRange = item.qRange || `${32 + this.currentIndex * 3}-${34 + this.currentIndex * 3}`;
                questionNumberText = `ETS 2026 (Test ${tNum}) · Câu ${qRange} (Set ${this.currentIndex + 1} / ${this.items.length})`;
            } else if (this.part === 4) {
                const qRange = item.qRange || `${71 + this.currentIndex * 3}-${73 + this.currentIndex * 3}`;
                questionNumberText = `ETS 2026 (Test ${tNum}) · Câu ${qRange} (Set ${this.currentIndex + 1} / ${this.items.length})`;
            }

            if (subtitleEl) subtitleEl.textContent = questionNumberText;
            if (badgeEl) badgeEl.textContent = `ETS 2026 · Test ${String(tNum).padStart(2, '0')}`;
        }

        updateLeftColumn(item) {
            if (!item) return;
            // Instruction
            const instEl = document.getElementById('tlwInstruction');
            if (instEl) {
                if (this.part === 1) instEl.textContent = 'Select the one statement that best describes what you see in the picture.';
                else if (this.part === 2) instEl.textContent = 'Select the best response to the question.';
                else instEl.textContent = 'Select the best response to each question.';
            }

            // Visual Area
            const visualContainer = document.getElementById('tlwVisualArea');
            if (!visualContainer) return;
            visualContainer.innerHTML = '';

            // Part 1: Ảnh chụp
            if (this.part === 1 && item.image) {
                const imgWrap = document.createElement('div');
                imgWrap.className = 'rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-sm max-w-xl mx-auto';
                imgWrap.innerHTML = `
                    <img src="${item.image}" alt="${item.alt_text || 'Part 1 Photograph'}" class="w-full h-auto max-h-[460px] object-cover cursor-zoom-in" onclick="window.open(this.src, '_blank')" onerror="this.onerror=null; this.src='assets/listening/part1/p1_sample_01_person.webp';">
                `;
                visualContainer.appendChild(imgWrap);
            }

            // Part 2: Không có ảnh, hiển thị khung tập trung âm thanh
            if (this.part === 2) {
                const focusBox = document.createElement('div');
                focusBox.className = 'p-6 rounded-2xl bg-fuchsia-50/40 dark:bg-slate-900/60 border border-fuchsia-100 dark:border-slate-800 text-center space-y-2';
                focusBox.innerHTML = `
                    <div class="w-12 h-12 rounded-2xl bg-fuchsia-100 dark:bg-fuchsia-950/80 text-fuchsia-600 dark:text-fuchsia-300 flex items-center justify-center mx-auto text-xl shadow-xs">
                        <i class="fa-solid fa-ear-listen animate-pulse"></i>
                    </div>
                    <div class="font-extrabold text-sm text-slate-800 dark:text-slate-200">Lắng nghe câu hỏi và 3 lựa chọn phản hồi</div>
                    <p class="text-xs text-slate-500 max-w-sm mx-auto">Chọn câu trả lời logic và tự nhiên nhất. Hãy chú ý bẫy từ đồng âm và thì ngữ pháp.</p>
                `;
                visualContainer.appendChild(focusBox);
            }

            // Part 3/4: Bảng biểu / Graphic Table (nếu có)
            if ((this.part === 3 || this.part === 4) && item.graphic) {
                const g = item.graphic;
                const gBox = document.createElement('div');
                gBox.className = 'p-4 rounded-2xl bg-teal-50/50 dark:bg-slate-800/60 border border-teal-200 dark:border-slate-700 space-y-2.5 shadow-sm';
                gBox.innerHTML = `
                    <div class="text-xs font-bold text-teal-900 dark:text-teal-300 flex items-center gap-2">
                        <i class="fa-solid fa-table-cells text-teal-600"></i>
                        <span>${g.title || 'Bảng biểu đính kèm'}</span>
                    </div>
                    <div class="overflow-x-auto rounded-xl border border-teal-200/80 dark:border-slate-700 bg-white dark:bg-slate-900">
                        <table class="w-full text-xs text-left">
                            <thead class="bg-teal-100/70 dark:bg-slate-800 text-teal-950 dark:text-teal-200 uppercase text-[10.5px] font-bold">
                                <tr>
                                    ${g.columns.map(c => `<th class="px-3.5 py-2">${c}</th>`).join('')}
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-teal-100 dark:divide-slate-800">
                                ${g.rows.map(r => `
                                    <tr class="hover:bg-teal-50/40 dark:hover:bg-slate-800/50">
                                        ${r.map(cell => `<td class="px-3.5 py-2 font-medium">${cell}</td>`).join('')}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
                visualContainer.appendChild(gBox);
            }

            // Transcript / Song ngữ / Dẫn chứng Area
            const transcriptBox = document.createElement('div');
            transcriptBox.id = 'tlwTranscriptBox';
            transcriptBox.className = `p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-2 ${this.showTranscript ? '' : 'hidden'}`;
            
            let transcriptHtml = '';
            const scriptText = item.transcript || item.audioScript || item.dialogue || item.talk || '';
            const transVi = item.translation_vi || item.dialogue_vi || item.talk_vi || '';

            if (this.part === 1 || this.part === 2) {
                transcriptHtml = `
                    <div class="font-bold uppercase tracking-wider text-[10.5px] text-indigo-600 dark:text-indigo-400 mb-1 flex items-center gap-1.5">
                        <i class="fa-solid fa-file-audio"></i> Lời thoại trong audio:
                    </div>
                    <p class="font-medium text-slate-800 dark:text-slate-100 text-[13px] leading-relaxed">${scriptText}</p>
                    ${this.showBilingual && (item.explanation_vi || transVi) ? `<div class="pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs italic">${item.explanation_vi || transVi}</div>` : ''}
                `;
            } else {
                // Part 3 & 4 (Hội thoại có người nói hoặc bài nói độc thoại)
                const lines = scriptText.split('\n').filter(l => l.trim().length > 0);
                const viLines = transVi.split('\n').filter(l => l.trim().length > 0);

                const linesHtml = lines.map((line, idx) => {
                    const trimmed = line.trim();
                    const hasColon = trimmed.includes(':');
                    let speakerPrefix = '';
                    let speakerColor = 'text-teal-600';
                    let dialogueContent = trimmed;

                    if (hasColon) {
                        const colonIdx = trimmed.indexOf(':');
                        const speaker = trimmed.substring(0, colonIdx).trim();
                        dialogueContent = trimmed.substring(colonIdx + 1).trim();
                        const isWoman = speaker === 'W' || speaker.startsWith('Woman') || speaker.startsWith('Female') || speaker === 'Nữ';
                        const isMan = speaker === 'M' || speaker.startsWith('Man') || speaker.startsWith('Male') || speaker === 'Nam';
                        speakerColor = isWoman ? 'text-purple-600 dark:text-purple-400' : isMan ? 'text-indigo-600 dark:text-indigo-400' : 'text-teal-600';
                        const speakerLabel = isWoman ? 'Woman' : isMan ? 'Man' : speaker;
                        speakerPrefix = `<span class="font-bold ${speakerColor}">${speakerLabel}:</span> `;
                    }

                    let lineContent = dialogueContent;
                    if (this.showEvidence) {
                        // Highlight evidence
                        lineContent = lineContent.replace(/(\b[A-Za-z0-9\s]{15,40}\b)/g, match => {
                            return `<span class="bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold px-1 rounded">${match}</span>`;
                        });
                    }

                    const viSub = (this.showBilingual && viLines[idx]) ? `<div class="text-[11.5px] text-slate-500 dark:text-slate-400 pl-4 border-l-2 border-slate-300 dark:border-slate-700 italic">${viLines[idx].trim()}</div>` : '';

                    return `
                        <div class="space-y-0.5">
                            <div class="font-semibold text-[12.5px] text-slate-800 dark:text-slate-200">${speakerPrefix}${lineContent}</div>
                            ${viSub}
                        </div>
                    `;
                }).join('');

                transcriptHtml = `
                    <div class="flex items-center justify-between mb-2">
                        <span class="font-bold uppercase tracking-wider text-[10.5px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                            <i class="fa-solid fa-comments"></i> Transcript lời thoại ${this.part === 3 ? 'hội thoại' : 'bài nói'}:
                        </span>
                    </div>
                    <div class="space-y-2">${linesHtml}</div>
                `;
            }

            transcriptBox.innerHTML = transcriptHtml;
            visualContainer.appendChild(transcriptBox);

            // Explanation & Key Vocab Area (Hiện khi nhấn nút "Giải thích" hoặc sau khi hoàn thành)
            const explanationBox = document.createElement('div');
            explanationBox.id = 'tlwExplanationBox';
            explanationBox.className = `p-4 rounded-2xl bg-emerald-50/70 dark:bg-slate-900 border border-emerald-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed space-y-3 shadow-xs ${this.showExplanation ? '' : 'hidden'}`;

            let explHtml = '';
            if (this.part === 1 || this.part === 2) {
                explHtml = `
                    <div class="flex items-center gap-2">
                        <span class="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 font-extrabold text-[11px]">GIẢI THÍCH CHI TIẾT</span>
                        ${item.trap_type ? `<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-bold text-[10.5px]"><i class="fa-solid fa-shield-halved mr-1"></i>${item.trap_type}</span>` : ''}
                    </div>
                    <p class="text-xs sm:text-[13px] leading-relaxed text-slate-800 dark:text-slate-200">${item.explanation_vi || item.correct_reason || 'Đang cập nhật giải thích.'}</p>
                    ${item.exam_tip ? `
                        <div class="p-2.5 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200/80 dark:border-slate-700 text-[11.5px] text-amber-950 dark:text-amber-200 flex items-start gap-2">
                            <i class="fa-solid fa-lightbulb text-amber-600 mt-0.5"></i>
                            <div><strong>Mẹo thi ETS:</strong> ${item.exam_tip}</div>
                        </div>
                    ` : ''}
                    ${item.key_vocab && item.key_vocab.length ? `
                        <div class="pt-2 border-t border-emerald-200/70 dark:border-slate-800">
                            <div class="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Từ vựng trọng tâm:</div>
                            <div class="flex flex-wrap gap-2">
                                ${item.key_vocab.map(v => `
                                    <div class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                                        <strong class="text-indigo-600 dark:text-indigo-400">${v.word}</strong> <span class="text-slate-400 font-mono text-[10.5px]">${v.ipa || ''}</span>: <span class="text-slate-700 dark:text-slate-300">${v.meaning}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                `;
            } else {
                explHtml = `
                    <div class="font-extrabold text-xs text-emerald-800 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                        <i class="fa-solid fa-circle-check text-emerald-600"></i>
                        <span>Chiến thuật & Giải thích theo từng câu:</span>
                    </div>
                    <div class="space-y-2">
                        ${(item.questions || []).map((q, qIdx) => `
                            <div class="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                                <div class="font-bold text-xs text-slate-900 dark:text-white">Câu ${qIdx + 1}: ${q.q}</div>
                                <div class="text-[11.5px] text-emerald-700 dark:text-emerald-400 font-semibold">Đáp án đúng: (${q.ansLetter})</div>
                                <div class="text-[11.5px] text-slate-600 dark:text-slate-300">${q.explanation_vi || q.correct_reason || ''}</div>
                            </div>
                        `).join('')}
                    </div>
                `;
            }

            explanationBox.innerHTML = explHtml;
            visualContainer.appendChild(explanationBox);
        }

        updateRightColumn(item) {
            const container = document.getElementById('tlwQuestionsContainer');
            if (!container) return;
            container.innerHTML = '';

            if (this.part === 1 || this.part === 2 || !item.questions) {
                // Single Question Layout (Chuẩn Image 2 & Image 3)
                const qNum = item.qNum || (this.part === 1 ? (this.currentIndex + 1) : (7 + this.currentIndex));
                const qCard = this.buildQuestionCard(item, qNum, 0);
                container.appendChild(qCard);
            } else {
                // Clustered 3 Questions Layout (Chuẩn Image 4 & Image 5)
                const baseQNum = this.part === 3 ? (32 + this.currentIndex * 3) : (71 + this.currentIndex * 3);
                (item.questions || []).forEach((qItem, idx) => {
                    const qNum = qItem.qNum || (baseQNum + idx);
                    const qCard = this.buildQuestionCard(qItem, qNum, idx);
                    container.appendChild(qCard);
                });
            }
        }

        buildQuestionCard(qItem, displayNum, subIndex = 0) {
            const card = document.createElement('div');
            card.className = 'bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3.5';

            // Question Prompt
            const isPart1 = this.part === 1;
            const isPart2 = this.part === 2;
            const isPart3or4 = this.part === 3 || this.part === 4;

            let promptHtml = '';
            if (isPart1 || isPart2) {
                promptHtml = `<div class="font-bold text-sm text-slate-900 dark:text-white">${displayNum}.</div>`;
            } else {
                promptHtml = `<div class="font-bold text-sm text-slate-900 dark:text-white leading-snug">${displayNum}. ${qItem.q}</div>`;
            }
            card.innerHTML = promptHtml;

            // Options List
            const optionsBox = document.createElement('div');
            optionsBox.className = 'space-y-2';

            const userSelected = this.userAnswers[qItem.id];
            const state = this.answeredState[qItem.id];
            const isChecked = state && state.checked;

            qItem.options.forEach((optText, optIdx) => {
                const optLetter = ['A', 'B', 'C', 'D'][optIdx];
                const btn = document.createElement('button');
                btn.type = 'button';
                
                let baseBtnClass = 'w-full text-left px-4 py-3 rounded-xl border font-semibold text-xs sm:text-[13px] transition flex items-center justify-between cursor-pointer';
                
                const isCorrectOpt = optIdx === qItem.ans;
                const isSelected = userSelected === optIdx;

                if (isChecked) {
                    if (isCorrectOpt) {
                        btn.className = `${baseBtnClass} bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200`;
                    } else if (isSelected && !isCorrectOpt) {
                        btn.className = `${baseBtnClass} bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200`;
                    } else {
                        btn.className = `${baseBtnClass} border-slate-200 dark:border-slate-800 text-slate-400 opacity-60`;
                    }
                } else if (isSelected) {
                    btn.className = `${baseBtnClass} bg-blue-50 dark:bg-blue-950/40 border-[#1a73e8] text-[#1a73e8] dark:text-sky-300`;
                } else {
                    btn.className = `${baseBtnClass} bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200`;
                }

                // Radio Circle Indicator
                const radioCircle = isChecked && isCorrectOpt
                    ? '<span class="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] shrink-0 mr-3"><i class="fa-solid fa-check"></i></span>'
                    : isChecked && isSelected && !isCorrectOpt
                    ? '<span class="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] shrink-0 mr-3"><i class="fa-solid fa-xmark"></i></span>'
                    : isSelected
                    ? '<span class="w-5 h-5 rounded-full border-2 border-[#1a73e8] flex items-center justify-center shrink-0 mr-3"><span class="w-2.5 h-2.5 rounded-full bg-[#1a73e8]"></span></span>'
                    : '<span class="w-5 h-5 rounded-full border-2 border-slate-300 dark:border-slate-600 shrink-0 mr-3"></span>';

                // Label & Statement
                let labelContent = '';
                if (isPart1 || isPart2) {
                    // Part 1 & Part 2: Không lộ chữ trước khi chọn
                    if (isChecked) {
                        labelContent = `<div class="flex items-start gap-2"><span class="font-black text-xs shrink-0">(${optLetter})</span> <span class="leading-relaxed font-normal">${optText.replace(/^[A-D]\.\s*/, '')}</span></div>`;
                    } else {
                        labelContent = `<span class="font-bold text-xs sm:text-sm">(${optLetter})</span>`;
                    }
                } else {
                    // Part 3 & 4: Luôn hiển thị chữ của các phương án
                    labelContent = `<div class="flex items-start gap-2"><span class="font-bold shrink-0">(${optLetter})</span> <span class="leading-relaxed">${optText.replace(/^[A-D]\.\s*/, '')}</span></div>`;
                }

                btn.innerHTML = `
                    <div class="flex items-center w-full">
                        ${radioCircle}
                        ${labelContent}
                    </div>
                `;

                btn.onclick = () => {
                    this.selectOption(qItem, optIdx);
                };

                optionsBox.appendChild(btn);
            });

            card.appendChild(optionsBox);
            return card;
        }

        // =========================================================================
        // XỬ LÝ CHỌN ĐÁP ÁN
        // =========================================================================
        selectOption(qItem, optIdx) {
            this.userAnswers[qItem.id] = optIdx;
            const isCorrect = optIdx === qItem.ans;
            this.answeredState[qItem.id] = {
                selectedIndex: optIdx,
                isCorrect: isCorrect,
                checked: true
            };

            // Ghi nhận điểm số & XP vào state chung
            if (window.state) {
                window.state.totalAnswers = (window.state.totalAnswers || 0) + 1;
                window.state.listenDone = (window.state.listenDone || 0) + 1;
                window.state.listenTotalAnswers = (window.state.listenTotalAnswers || 0) + 1;
                if (isCorrect) {
                    window.state.correctAnswers = (window.state.correctAnswers || 0) + 1;
                    window.state.listenCorrectAnswers = (window.state.listenCorrectAnswers || 0) + 1;
                    window.state.xp = (window.state.xp || 0) + 10;
                }
                if (window.DailyTaskManager) {
                    window.DailyTaskManager.recordProgress('listening', 1);
                }
                if (window.ToeicListeningSRS && !isCorrect) {
                    window.ToeicListeningSRS.addQuestion(qItem);
                }
                if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
                if (window.AuthSyncManager) {
                    window.AuthSyncManager.saveUserData();
                } else if (typeof saveCurrentUserProgressToServer === 'function') {
                    saveCurrentUserProgressToServer();
                }
            }

            // Cập nhật lại UI câu hỏi để hiện màu xanh/đỏ và lời thoại
            const currentItem = this.items[this.currentIndex];
            this.updateRightColumn(currentItem);
            this.updateFooter(currentItem);

            // Bật tự động giải thích nếu người dùng muốn học sâu
            if (this.showExplanation) {
                this.updateLeftColumn(currentItem);
            }
        }

        // =========================================================================
        // FOOTER & ĐIỀU HƯỚNG CÂU HỎI
        // =========================================================================
        updateFooter(item) {
            // Palette counter text (e.g. "1/10" hoặc "1-3/13")
            const paletteBtnText = document.getElementById('tlwPaletteBtnText');
            if (paletteBtnText) {
                if (item && item.questions && item.questions.length > 0) {
                    const qRange = item.qRange || (item.questions[0]?.qNum ? `${item.questions[0].qNum}-${item.questions[item.questions.length - 1].qNum}` : `${this.currentIndex + 1}`);
                    paletteBtnText.textContent = `Q${qRange} (${this.currentIndex + 1}/${this.items.length})`;
                } else {
                    const qNum = (item && item.qNum) ? item.qNum : (this.part === 2 ? 7 + this.currentIndex : this.currentIndex + 1);
                    paletteBtnText.textContent = `Q${qNum} (${this.currentIndex + 1}/${this.items.length})`;
                }
            }

            // Prev button state
            const prevBtn = document.getElementById('tlwPrevBtn');
            if (prevBtn) {
                prevBtn.disabled = this.currentIndex <= 0;
                prevBtn.classList.toggle('opacity-40', this.currentIndex <= 0);
            }

            // Next button state / finish
            const nextBtn = document.getElementById('tlwNextBtn');
            if (nextBtn) {
                if (this.currentIndex >= this.items.length - 1) {
                    nextBtn.innerHTML = `<span>Hoàn thành</span><i class="fa-solid fa-flag-checkered text-xs ml-1"></i>`;
                } else {
                    nextBtn.innerHTML = `<i class="fa-solid fa-chevron-right text-xs"></i>`;
                }
            }

            // Speaker flag badge
            const speakerBadge = document.getElementById('tlwSpeakerBadge');
            if (speakerBadge) {
                const accent = (item.accent || (item.speakers && item.speakers[0]?.accent) || 'US').toUpperCase();
                const gender = item.gender || 'Female';
                const flag = accent.includes('GB') || accent.includes('UK') ? '🇬🇧' :
                             accent.includes('AU') ? '🇦🇺' :
                             accent.includes('CA') ? '🇨🇦' : '🇺🇸';
                const name = accent.includes('GB') || accent.includes('UK') ? `Anh (${gender === 'Female' ? 'Nữ' : 'Nam'})` :
                             accent.includes('AU') ? `Úc (${gender === 'Female' ? 'Nữ' : 'Nam'})` :
                             accent.includes('CA') ? `Canada (${gender === 'Female' ? 'Nữ' : 'Nam'})` : `Mỹ (${gender === 'Female' ? 'Nữ' : 'Nam'})`;
                speakerBadge.innerHTML = `<span>${flag} Giọng ${name}</span>`;
            }
        }

        prev() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.renderCurrentQuestion();
            }
        }

        next() {
            if (this.currentIndex < this.items.length - 1) {
                this.currentIndex++;
                this.renderCurrentQuestion();
            } else {
                this.finishQuiz();
            }
        }

        finishQuiz() {
            let correctCount = 0;
            let totalCount = 0;
            for (let qId in this.answeredState) {
                totalCount++;
                if (this.answeredState[qId].isCorrect) correctCount++;
            }

            if (typeof showToast === 'function') {
                showToast(`🎉 Chúc mừng bạn đã hoàn thành bài thi với ${correctCount}/${totalCount} câu đúng!`);
            }

            // Cập nhật lên server nếu hàm tồn tại
            if (typeof saveCurrentUserProgressToServer === 'function') {
                saveCurrentUserProgressToServer();
            }

            this.close();
        }

        // =========================================================================
        // AUDIO PLAYER CONTROLS & WAVEFORM
        // =========================================================================
        loadAudioForItem(item) {
            const url = item.audio_url || (item.questions && item.questions[0]?.audio_url);
            if (url) {
                if (this.audio.src !== url && !this.audio.src.endsWith(url)) {
                    this.pause();
                    this.audio.src = url;
                    this.currentTime = 0;
                    this.duration = 0;
                    this.generateWaveformData();
                    this.renderWaveform();
                }
            }
        }

        togglePlay() {
            if (this.isPlaying) {
                this.pause();
            } else {
                this.play();
            }
        }

        play() {
            if (!this.audio.src) return;
            this.audio.play().catch(e => {
                console.warn('Audio play error:', e.message);
            });
        }

        pause() {
            this.audio.pause();
        }

        seekBy(seconds) {
            if (!this.audio.duration) return;
            this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, this.audio.currentTime + seconds));
        }

        seekTo(seconds) {
            if (!this.audio.duration) return;
            this.audio.currentTime = Math.max(0, Math.min(this.audio.duration, seconds));
        }

        setSpeed(rate) {
            this.playbackRate = rate;
            this.audio.playbackRate = rate;
            // Highlight active speed pill
            document.querySelectorAll('.tlw-speed-pill').forEach(btn => {
                const val = parseFloat(btn.dataset.speed);
                btn.classList.toggle('bg-[#1a73e8]', val === rate);
                btn.classList.toggle('text-white', val === rate);
                btn.classList.toggle('bg-slate-100', val !== rate);
                btn.classList.toggle('dark:bg-slate-800', val !== rate);
            });
        }

        changeSpeed(direction) {
            const speeds = [0.75, 0.9, 1.0, 1.1, 1.25];
            let idx = speeds.indexOf(this.playbackRate);
            if (idx === -1) idx = 2;
            const newIdx = Math.max(0, Math.min(speeds.length - 1, idx + direction));
            this.setSpeed(speeds[newIdx]);
        }

        toggleLoop() {
            this.isLooping = !this.isLooping;
            const btn = document.getElementById('tlwLoopBtn');
            if (btn) {
                btn.classList.toggle('text-[#1a73e8]', this.isLooping);
                btn.classList.toggle('text-slate-400', !this.isLooping);
            }
        }

        changeVolume(delta) {
            this.volume = Math.max(0, Math.min(1, this.volume + delta));
            this.audio.volume = this.volume;
            const slider = document.getElementById('tlwVolumeSlider');
            if (slider) slider.value = Math.round(this.volume * 100);
        }

        setVolume(percent) {
            this.volume = Math.max(0, Math.min(1, percent / 100));
            this.audio.volume = this.volume;
        }

        updatePlayPauseButton() {
            const btn = document.getElementById('tlwPlayBtn');
            if (btn) {
                btn.innerHTML = this.isPlaying
                    ? '<i class="fa-solid fa-pause text-base"></i>'
                    : '<i class="fa-solid fa-play text-base ml-0.5"></i>';
            }
        }

        updateTimeDisplay() {
            const curEl = document.getElementById('tlwTimeCurrent');
            const durEl = document.getElementById('tlwTimeDuration');
            if (curEl) curEl.textContent = this.formatTime(this.currentTime);
            if (durEl) durEl.textContent = this.formatTime(this.duration);
        }

        formatTime(seconds) {
            if (!seconds || isNaN(seconds)) return '00:00';
            const m = Math.floor(seconds / 60);
            const s = Math.floor(seconds % 60);
            return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
        }

        generateWaveformData() {
            this.audioWaveData = [];
            const barCount = 42;
            for (let i = 0; i < barCount; i++) {
                // Wave pattern ngẫu nhiên nhưng có nhịp điệu tự nhiên
                const h = 8 + Math.sin(i * 0.45) * 12 + Math.cos(i * 0.8) * 8 + (i % 3) * 3;
                this.audioWaveData.push(Math.max(6, Math.min(30, Math.round(h))));
            }
        }

        renderWaveform() {
            const container = document.getElementById('tlwWaveformContainer');
            if (!container) return;
            container.innerHTML = '';

            this.audioWaveData.forEach((height, idx) => {
                const bar = document.createElement('div');
                bar.className = 'w-1 rounded-full transition-colors cursor-pointer bg-slate-200 dark:bg-slate-700 hover:opacity-80';
                bar.style.height = `${height}px`;
                bar.dataset.index = idx;
                bar.onclick = (e) => {
                    e.stopPropagation();
                    const ratio = idx / this.audioWaveData.length;
                    if (this.duration) this.seekTo(ratio * this.duration);
                };
                container.appendChild(bar);
            });
            this.updateWaveformProgress();
        }

        updateWaveformProgress() {
            const container = document.getElementById('tlwWaveformContainer');
            if (!container || !this.duration) return;

            const progress = this.currentTime / this.duration;
            const barCount = container.children.length;
            const activeBars = Math.floor(progress * barCount);

            for (let i = 0; i < barCount; i++) {
                const bar = container.children[i];
                if (i <= activeBars) {
                    bar.className = 'w-1 rounded-full cursor-pointer bg-[#1a73e8] dark:bg-sky-400';
                } else {
                    bar.className = 'w-1 rounded-full cursor-pointer bg-slate-200 dark:bg-slate-700';
                }
            }
        }

        // =========================================================================
        // TOP UTILITY BUTTON TOGGLES
        // =========================================================================
        toggleTranscript() {
            this.showTranscript = !this.showTranscript;
            const box = document.getElementById('tlwTranscriptBox');
            if (box) box.classList.toggle('hidden', !this.showTranscript);
            const btn = document.getElementById('tlwBtnTranscript');
            if (btn) {
                btn.classList.toggle('bg-slate-800', this.showTranscript);
                btn.classList.toggle('border-indigo-500', this.showTranscript);
                btn.classList.toggle('text-white', this.showTranscript);
            }
        }

        toggleBilingual() {
            this.showBilingual = !this.showBilingual;
            if (!this.showTranscript) this.toggleTranscript();
            else {
                const currentItem = this.items[this.currentIndex];
                if (currentItem) this.updateLeftColumn(currentItem);
            }
            const btn = document.getElementById('tlwBtnBilingual');
            if (btn) {
                btn.classList.toggle('bg-slate-800', this.showBilingual);
                btn.classList.toggle('border-indigo-500', this.showBilingual);
                btn.classList.toggle('text-white', this.showBilingual);
            }
        }

        toggleEvidence() {
            this.showEvidence = !this.showEvidence;
            if (!this.showTranscript) this.toggleTranscript();
            else {
                const currentItem = this.items[this.currentIndex];
                if (currentItem) this.updateLeftColumn(currentItem);
            }
            const btn = document.getElementById('tlwBtnEvidence');
            if (btn) {
                btn.classList.toggle('bg-slate-800', this.showEvidence);
                btn.classList.toggle('border-amber-500', this.showEvidence);
                btn.classList.toggle('text-amber-300', this.showEvidence);
            }
        }

        toggleExplanation() {
            this.showExplanation = !this.showExplanation;
            const box = document.getElementById('tlwExplanationBox');
            if (box) box.classList.toggle('hidden', !this.showExplanation);
            const btn = document.getElementById('tlwBtnExplanation');
            if (btn) {
                btn.classList.toggle('bg-amber-500/30', this.showExplanation);
                btn.classList.toggle('border-amber-400', this.showExplanation);
            }
        }

        openDictation() {
            const currentItem = this.items[this.currentIndex];
            if (typeof switchTab === 'function') {
                this.close();
                switchTab('nghe-chinh-ta');
            }
        }

        toggleVocab() {
            const currentItem = this.items[this.currentIndex];
            const modal = document.getElementById('tlwVocabModal');
            if (!modal) return;
            modal.classList.toggle('hidden');

            const vocabContainer = document.getElementById('tlwVocabModalBody');
            if (!vocabContainer) return;

            let words = currentItem.key_vocab || [];
            if (!words.length && currentItem.questions) {
                currentItem.questions.forEach(q => {
                    if (q.key_vocab) words.push(...q.key_vocab);
                });
            }

            if (!words.length) {
                vocabContainer.innerHTML = '<p class="text-xs text-slate-500 italic">Chưa có danh sách từ vựng riêng cho câu này.</p>';
                return;
            }

            vocabContainer.innerHTML = words.map(w => `
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div>
                        <div class="font-bold text-xs sm:text-sm text-indigo-600 dark:text-indigo-400">${w.word} <span class="font-mono text-slate-400 text-xs font-normal">${w.ipa || ''}</span></div>
                        <div class="text-xs text-slate-600 dark:text-slate-300 font-medium">${w.meaning}</div>
                    </div>
                    <button onclick="if(typeof saveWordToNotebook==='function') saveWordToNotebook('${w.word.replace(/'/g, "\\'")}')" class="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition flex items-center gap-1">
                        <i class="fa-regular fa-bookmark"></i> Lưu
                    </button>
                </div>
            `).join('');
        }

        openTakeNote() {
            if (window.FloatingTakeNote && typeof window.FloatingTakeNote.open === 'function') {
                const curItem = this.items ? this.items[this.currentIndex] : null;
                let qNum = '';
                if (curItem) {
                    qNum = curItem.qNum || (curItem.part === 2 ? 7 + this.currentIndex : this.currentIndex + 1);
                }
                const testName = this.testTitle || (this.testNum ? `ETS ${this.testNum}` : 'ETS TOEIC');
                const snippet = qNum ? `<strong>[Ghi chú Listening Part ${this.part} - Câu ${qNum} · ${testName}]:</strong><br>` : '';
                window.FloatingTakeNote.open({ snippet });
            } else if (typeof openTakeNoteDrawer === 'function') {
                openTakeNoteDrawer();
            } else if (typeof switchTab === 'function') {
                switchTab('take-note');
            }
        }

        // =========================================================================
        // PALETTE LƯỚI CÂU HỎI (POPUP QUESTION GRID)
        // =========================================================================
        openPalette() {
            const modal = document.getElementById('tlwPaletteModal');
            if (!modal) return;
            modal.classList.remove('hidden');

            const gridContainer = document.getElementById('tlwPaletteGrid');
            if (!gridContainer) return;
            gridContainer.innerHTML = '';

            this.items.forEach((item, idx) => {
                const isSet = item.questions && Array.isArray(item.questions) && item.questions.length > 0;
                if (!isSet) {
                    const qNum = item.qNum || (item.part === 2 ? 7 + idx : idx + 1);
                    const isAnswered = this.answeredState[item.id];
                    const isCurrent = idx === this.currentIndex;

                    const btn = document.createElement('button');
                    let btnClass = 'w-10 h-10 rounded-xl font-bold text-xs flex items-center justify-center transition border cursor-pointer';

                    if (isAnswered) {
                        btnClass += isAnswered.isCorrect ? ' bg-emerald-500 text-white border-emerald-600' : ' bg-rose-500 text-white border-rose-600';
                    } else if (isCurrent) {
                        btnClass += ' bg-blue-50 text-[#1a73e8] border-[#1a73e8] ring-2 ring-blue-300';
                    } else {
                        btnClass += ' bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-[#1a73e8]';
                    }

                    btn.className = btnClass;
                    btn.textContent = qNum;
                    btn.onclick = () => {
                        this.currentIndex = idx;
                        this.renderCurrentQuestion();
                        modal.classList.add('hidden');
                    };
                    gridContainer.appendChild(btn);
                } else {
                    const qRange = item.qRange || (item.questions[0]?.qNum ? `${item.questions[0].qNum}-${item.questions[item.questions.length - 1].qNum}` : `Q${idx}`);
                    const isCurrent = idx === this.currentIndex;

                    const setBox = document.createElement('div');
                    setBox.className = `p-2.5 rounded-xl border ${isCurrent ? 'border-[#1a73e8] ring-2 ring-blue-300/40 bg-blue-50/40' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'} space-y-1.5 cursor-pointer`;
                    
                    setBox.innerHTML = `
                        <div class="flex items-center justify-between text-[11px] font-bold text-slate-500">
                            <span>Part ${item.part || 3}</span>
                            <span class="text-[#1a73e8]">Q${qRange}</span>
                        </div>
                        <div class="flex items-center gap-1.5">
                            ${(item.questions || []).map((q, qSubIdx) => {
                                const qState = this.answeredState[q.id];
                                let colorClass = 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200';
                                if (qState) {
                                    colorClass = qState.isCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white';
                                }
                                return `<span class="w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center ${colorClass}">${q.qNum || (qSubIdx + 1)}</span>`;
                            }).join('')}
                        </div>
                    `;

                    setBox.onclick = () => {
                        this.currentIndex = idx;
                        this.renderCurrentQuestion();
                        modal.classList.add('hidden');
                    };
                    gridContainer.appendChild(setBox);
                }
            });
        }
    }

    // Export singleton instance ra window
    window.ToeicListeningWorkstation = new ToeicListeningWorkstation();

})(window, document);
