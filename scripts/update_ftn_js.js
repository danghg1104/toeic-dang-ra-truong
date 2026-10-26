const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'js', 'floating-take-note.js');

const newCode = `/**
 * =========================================================================
 * FLOATING TAKE NOTE SYSTEM (SỔ GHI CHÚ NỔI TOÀN NĂNG - TOTORO THEME)
 * =========================================================================
 * - Mở nhanh mọi lúc mọi nơi trên toàn website (khi đang giải Part 5, Part 1, Part 7, Từ vựng,...)
 * - Thay thế nút Gia sư AI bằng nút tròn Sổ Take Note thanh lịch, đa năng
 * - Cửa sổ nổi thông minh (non-blocking), có thể kéo di chuyển vị trí tự do
 * - Điều chỉnh kích thước linh hoạt ở CẢ 4 GÓC (NW, NE, SW, SE) + 4 CẠNH (N, S, W, E)
 * - Tự động ghi nhớ vị trí và kích thước đã chỉnh trong localStorage
 * - Tích hợp đầy đủ tính năng: Đổi tiêu đề, Phân loại, Giấy kẻ ngang (paper-lined), Giấy ô ly,
 *   Thanh công cụ định dạng, Highlight màu pastel, Chèn bẫy Part 5 / Collocation / Công thức,
 *   Danh sách các trang note, Chép phạt lặp từ 10-30 lần, Đồng bộ tức thì với Sổ Take Note chính.
 * =========================================================================
 */

(function () {
    'use strict';

    const STORAGE_KEY_GEOMETRY = 'cung_dang_ftn_geometry_v2';

    const FloatingTakeNote = {
        isOpen: false,
        isMinimized: false,
        activeTab: 'editor', // 'editor' | 'list' | 'drill'
        saveTimer: null,
        drillTarget: 'abide by = comply with = conform to = adhere to',
        drillCount: 0,
        drillGoal: 10,
        geometry: {
            width: 580,
            height: 520,
            left: null,
            top: null
        },

        init() {
            this.loadSavedGeometry();
            this.injectModalMarkup();
            this.bindResizeAndDragEvents();
            this.syncWithGlobalNotes();

            // Lắng nghe sự kiện phím tắt (Alt + N để bật/tắt Take Note nhanh)
            window.addEventListener('keydown', (e) => {
                if (e.altKey && (e.key === 'n' || e.key === 'N')) {
                    e.preventDefault();
                    this.toggle();
                }
            });

            console.log('📒 FloatingTakeNote initialized successfully');
        },

        loadSavedGeometry() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY_GEOMETRY);
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed.width && parsed.height) {
                        this.geometry = Object.assign(this.geometry, parsed);
                    }
                }
            } catch (e) {}
        },

        saveGeometry() {
            try {
                localStorage.setItem(STORAGE_KEY_GEOMETRY, JSON.stringify(this.geometry));
            } catch (e) {}
        },

        injectModalMarkup() {
            if (document.getElementById('floatingTakeNoteModal')) return;

            const modalHTML = \`
            <div id="floatingTakeNoteModal" class="ftn-window fixed z-50 hidden flex-col bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border-2 border-amber-400/80 dark:border-amber-500/60 overflow-hidden backdrop-blur-md select-none transition-[opacity,transform] duration-150"
                style="width: 580px; height: 520px; right: 24px; bottom: 84px;">
                
                <!-- 4 CORNER RESIZERS (GÓC THU TO THU NHỎ - ẢNH 1) -->
                <div class="ftn-handle ftn-handle-nw" data-handle="nw" title="Kéo góc trên-trái để thu to / thu nhỏ khung">
                    <div class="ftn-corner-grip"></div>
                </div>
                <div class="ftn-handle ftn-handle-ne" data-handle="ne" title="Kéo góc trên-phải để thu to / thu nhỏ khung">
                    <div class="ftn-corner-grip"></div>
                </div>
                <div class="ftn-handle ftn-handle-sw" data-handle="sw" title="Kéo góc dưới-trái để thu to / thu nhỏ khung">
                    <div class="ftn-corner-grip"></div>
                </div>
                <div class="ftn-handle ftn-handle-se" data-handle="se" title="Kéo góc dưới-phải để thu to / thu nhỏ khung">
                    <div class="ftn-corner-grip"></div>
                </div>
                
                <!-- 4 EDGE RESIZERS (Kéo cạnh viền để chỉnh kích thước) -->
                <div class="ftn-handle ftn-handle-n" data-handle="n"></div>
                <div class="ftn-handle ftn-handle-s" data-handle="s"></div>
                <div class="ftn-handle ftn-handle-w" data-handle="w"></div>
                <div class="ftn-handle ftn-handle-e" data-handle="e"></div>

                <!-- 1. TOP DRAG BAR (THANH DI CHUYỂN KHUNG - ẢNH 2) -->
                <div id="ftnDragBar" class="ftn-drag-bar px-3.5 py-2 bg-gradient-to-r from-amber-100 via-orange-100/80 to-amber-200/90 dark:from-slate-800 dark:via-slate-850 dark:to-slate-800 border-b border-amber-300/70 dark:border-slate-700 flex items-center justify-between gap-3 shrink-0 select-none"
                    title="Nhấp giữ và kéo để di chuyển khung khắp màn hình">
                    
                    <!-- Left: Title & Move Badge -->
                    <div class="flex items-center gap-2 min-w-0 pointer-events-none">
                        <div class="w-7 h-7 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center text-xs shadow-xs shrink-0">
                            📓
                        </div>
                        <div class="flex items-center gap-1.5 min-w-0">
                            <h3 class="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">Sổ Take Note Nhanh</h3>
                            <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-200/80 dark:bg-amber-950 text-amber-900 dark:text-amber-300 shrink-0">Part 5 & TOEIC</span>
                        </div>
                    </div>

                    <!-- Center: Tactile Drag Pill Handle -->
                    <div class="flex-1 flex items-center justify-center pointer-events-none px-2">
                        <div class="flex items-center gap-1 bg-amber-200/70 dark:bg-slate-700 px-3 py-1 rounded-full text-[10px] font-extrabold text-amber-900 dark:text-amber-200">
                            <i class="fa-solid fa-up-down-left-right text-[9px]"></i>
                            <span class="hidden sm:inline">Kéo để di chuyển khung</span>
                        </div>
                    </div>

                    <!-- Right: Window Controls -->
                    <div class="flex items-center gap-1 shrink-0">
                        <!-- Open Full Tab Button -->
                        <button type="button" onclick="FloatingTakeNote.openFullTakeNoteTab()" title="Mở Sổ Note toàn màn hình"
                            class="w-6 h-6 rounded-lg bg-white/90 dark:bg-slate-700 hover:bg-amber-200 text-slate-600 dark:text-slate-200 flex items-center justify-center text-[11px] transition shadow-2xs cursor-pointer">
                            <i class="fa-solid fa-up-right-from-square"></i>
                        </button>
                        <!-- Minimize Button -->
                        <button type="button" onclick="FloatingTakeNote.toggleMinimize()" title="Thu nhỏ / Phục hồi"
                            class="w-6 h-6 rounded-lg bg-white/90 dark:bg-slate-700 hover:bg-amber-200 text-slate-600 dark:text-slate-200 flex items-center justify-center text-[11px] transition shadow-2xs cursor-pointer">
                            <i id="ftnMinIcon" class="fa-solid fa-minus"></i>
                        </button>
                        <!-- Close Button -->
                        <button type="button" onclick="FloatingTakeNote.close()" title="Đóng cửa sổ"
                            class="w-6 h-6 rounded-lg bg-white/90 dark:bg-slate-700 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center text-[11px] transition shadow-2xs cursor-pointer">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>
                </div>

                <!-- 2. SUB-HEADER: TABS SWITCHER & SAVE STATUS -->
                <div class="px-3.5 py-1.5 bg-amber-50/70 dark:bg-slate-900 border-b border-amber-200/60 dark:border-slate-800 flex items-center justify-between gap-2 shrink-0">
                    <div class="flex items-center gap-1 bg-white/90 dark:bg-slate-800 p-0.5 rounded-xl border border-amber-200/70 dark:border-slate-700">
                        <button type="button" onclick="FloatingTakeNote.switchTab('editor')" id="ftnTabBtn-editor"
                            class="px-3 py-1 rounded-lg text-xs font-black transition bg-amber-500 text-slate-950 shadow-xs cursor-pointer">
                            📝 Soạn thảo
                        </button>
                        <button type="button" onclick="FloatingTakeNote.switchTab('list')" id="ftnTabBtn-list"
                            class="px-3 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition cursor-pointer">
                            📚 Danh sách
                        </button>
                        <button type="button" onclick="FloatingTakeNote.switchTab('drill')" id="ftnTabBtn-drill"
                            class="px-3 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition cursor-pointer">
                            🎯 Chép phạt
                        </button>
                    </div>

                    <div id="ftnSaveStatus" class="text-[11px] text-slate-500 dark:text-slate-400 font-bold truncate">
                        ✓ Sẵn sàng ghi chú
                    </div>
                </div>

                <!-- 3. WINDOW BODY (Nội dung sổ Take Note) -->
                <div id="ftnBody" class="flex-1 flex flex-col min-h-0 bg-white dark:bg-slate-900 select-text overflow-hidden">
                    
                    <!-- ========================================== -->
                    <!-- TAB 1: SOẠN THẢO TRANG HIỆN TẠI (EDITOR)   -->
                    <!-- ========================================== -->
                    <div id="ftnPane-editor" class="flex-1 flex flex-col min-h-0">
                        
                        <!-- Top Metadata Bar: Note Selector, Title, Category, Paper Style -->
                        <div class="px-3.5 py-2 bg-slate-50/90 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 flex items-center gap-2 flex-wrap shrink-0">
                            <!-- Note Selector Dropdown -->
                            <div class="flex items-center gap-1.5 flex-1 min-w-[180px]">
                                <select id="ftnNoteSelector" onchange="FloatingTakeNote.handleSelectNote(this.value)"
                                    class="w-full text-xs font-bold py-1.5 px-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500">
                                </select>
                            </div>

                            <!-- New Note Button -->
                            <button type="button" onclick="FloatingTakeNote.createNewNote()" title="Tạo trang ghi chú mới"
                                class="px-2.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition flex items-center gap-1 shrink-0 cursor-pointer shadow-xs active:scale-95">
                                <i class="fa-solid fa-plus"></i>
                                <span>Trang mới</span>
                            </button>

                            <!-- Category Selector -->
                            <select id="ftnCategorySelect" onchange="FloatingTakeNote.handleCategoryChange(this.value)"
                                class="text-[11px] font-bold py-1.5 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none shrink-0">
                                <option value="Part 5 Bẫy">⚡ Part 5 Bẫy</option>
                                <option value="Ngữ pháp">📘 Ngữ pháp</option>
                                <option value="Từ vựng">📖 Từ vựng</option>
                                <option value="Listening">🎧 Listening</option>
                                <option value="Lỗi sai">❌ Lỗi sai</option>
                                <option value="Bí kíp">⭐ Bí kíp</option>
                            </select>

                            <!-- Paper Style Selector -->
                            <select id="ftnPaperSelect" onchange="FloatingTakeNote.handlePaperChange(this.value)"
                                class="text-[11px] font-bold py-1.5 px-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none shrink-0">
                                <option value="paper-lined">📝 Giấy kẻ ngang</option>
                                <option value="paper-grid">🔲 Giấy kẻ ô</option>
                                <option value="paper-blank">📄 Giấy trơn</option>
                                <option value="paper-vintage">📜 Cổ điển</option>
                            </select>
                        </div>

                        <!-- Title Input Bar -->
                        <div class="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 shrink-0 bg-white dark:bg-slate-900">
                            <span class="text-xs font-bold text-slate-400">Tiêu đề:</span>
                            <input id="ftnNoteTitle" type="text" placeholder="Nhập tiêu đề ghi chú (Ví dụ: Bẫy liên từ vs giới từ Part 5)..."
                                oninput="FloatingTakeNote.handleTitleChange(this.value)"
                                class="flex-1 text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white bg-transparent outline-none focus:text-amber-600 transition">
                            <span id="ftnWordCount" class="text-[10px] font-bold text-slate-400 shrink-0">0 từ</span>
                        </div>

                        <!-- Sticky Ribbon Formatting Toolbar -->
                        <div class="px-3 py-1.5 bg-slate-50/80 dark:bg-slate-800/40 border-b border-slate-200/70 dark:border-slate-800 flex items-center gap-1.5 flex-wrap shrink-0">
                            <!-- Basic Formatting -->
                            <div class="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                <button type="button" onclick="FloatingTakeNote.format('bold')" title="In đậm (Ctrl+B)"
                                    class="w-6 h-6 rounded flex items-center justify-center font-black text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer">B</button>
                                <button type="button" onclick="FloatingTakeNote.format('italic')" title="In nghiêng (Ctrl+I)"
                                    class="w-6 h-6 rounded flex items-center justify-center italic font-serif text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer">I</button>
                                <button type="button" onclick="FloatingTakeNote.format('underline')" title="Gạch chân (Ctrl+U)"
                                    class="w-6 h-6 rounded flex items-center justify-center underline text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer">U</button>
                                <button type="button" onclick="FloatingTakeNote.format('strikeThrough')" title="Gạch ngang"
                                    class="w-6 h-6 rounded flex items-center justify-center line-through text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer">S</button>
                            </div>

                            <!-- Pastel Highlighters -->
                            <div class="flex items-center gap-1 bg-white dark:bg-slate-900 px-1.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700" title="Bút dạ quang Pastel">
                                <span class="text-[10px] font-bold text-slate-400">🖍️</span>
                                <button type="button" onclick="FloatingTakeNote.highlight('#fef08a')" class="w-4 h-4 rounded-full bg-yellow-200 hover:scale-125 transition border border-yellow-300" title="Vàng chanh pastel"></button>
                                <button type="button" onclick="FloatingTakeNote.highlight('#bbf7d0')" class="w-4 h-4 rounded-full bg-emerald-200 hover:scale-125 transition border border-emerald-300" title="Xanh bạc hà"></button>
                                <button type="button" onclick="FloatingTakeNote.highlight('#fbcfe8')" class="w-4 h-4 rounded-full bg-pink-200 hover:scale-125 transition border border-pink-300" title="Hồng phấn"></button>
                                <button type="button" onclick="FloatingTakeNote.highlight('#fed7aa')" class="w-4 h-4 rounded-full bg-orange-200 hover:scale-125 transition border border-orange-300" title="Cam đào"></button>
                            </div>

                            <!-- Lists -->
                            <div class="flex items-center gap-0.5 bg-white dark:bg-slate-900 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                                <button type="button" onclick="FloatingTakeNote.format('insertUnorderedList')" title="Danh sách chấm tròn"
                                    class="w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer">
                                    <i class="fa-solid fa-list-ul"></i>
                                </button>
                                <button type="button" onclick="FloatingTakeNote.format('insertOrderedList')" title="Danh sách số"
                                    class="w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer">
                                    <i class="fa-solid fa-list-ol"></i>
                                </button>
                                <button type="button" onclick="FloatingTakeNote.insertTemplate('checklist')" title="Mục kiểm checklist"
                                    class="w-6 h-6 rounded flex items-center justify-center text-xs hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer">
                                    <i class="fa-regular fa-square-check"></i>
                                </button>
                            </div>

                            <!-- Quick Part 5 Templates -->
                            <div class="flex items-center gap-1">
                                <button type="button" onclick="FloatingTakeNote.insertTemplate('part5_trap')" title="Chèn mẫu phân tích bẫy Part 5"
                                    class="px-2 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 dark:bg-amber-950 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-200 text-[10px] font-black transition flex items-center gap-1 cursor-pointer">
                                    <span>⚠️ Bẫy Part 5</span>
                                </button>
                                <button type="button" onclick="FloatingTakeNote.insertTemplate('collocation')" title="Chèn mẫu cụm từ Collocation"
                                    class="px-2 py-1 rounded-lg bg-sky-100 hover:bg-sky-200 dark:bg-sky-950 dark:hover:bg-sky-900 text-sky-900 dark:text-sky-200 text-[10px] font-black transition flex items-center gap-1 cursor-pointer">
                                    <span>📌 Collocation</span>
                                </button>
                                <button type="button" onclick="FloatingTakeNote.insertTemplate('vocab_card')" title="Chèn thẻ từ vựng mới"
                                    class="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-950 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 text-[10px] font-black transition flex items-center gap-1 cursor-pointer">
                                    <span>📖 Từ mới</span>
                                </button>
                                <button type="button" onclick="FloatingTakeNote.insertTemplate('formula')" title="Chèn công thức ngữ pháp"
                                    class="px-2 py-1 rounded-lg bg-purple-100 hover:bg-purple-200 dark:bg-purple-950 dark:hover:bg-purple-900 text-purple-900 dark:text-purple-200 text-[10px] font-black transition flex items-center gap-1 cursor-pointer">
                                    <span>📐 Công thức</span>
                                </button>
                            </div>
                        </div>

                        <!-- Real Paper Editor Canvas (Kẻ ngang paper-lined mặc định) -->
                        <div class="flex-1 overflow-y-auto p-4 sm:p-5 relative focus:outline-none">
                            <div id="ftnEditorPaper" contenteditable="true" spellcheck="false"
                                oninput="FloatingTakeNote.handleEditorInput()"
                                class="paper-lined min-h-full p-4 rounded-2xl outline-none text-slate-900 dark:text-slate-100 text-sm leading-relaxed transition-all shadow-inner border border-amber-200/50 dark:border-slate-800">
                                <p>Bắt đầu viết ghi chú của bạn tại đây...</p>
                            </div>
                        </div>
                    </div>

                    <!-- ========================================== -->
                    <!-- TAB 2: DANH SÁCH SỔ TẤT CẢ CÁC TRANG       -->
                    <!-- ========================================== -->
                    <div id="ftnPane-list" class="flex-1 flex flex-col min-h-0 hidden p-3.5 space-y-3">
                        <div class="flex items-center gap-2">
                            <div class="relative flex-1">
                                <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                <input type="text" id="ftnSearchListInput" oninput="FloatingTakeNote.renderNotesList()"
                                    placeholder="Tìm nhanh trang ghi chú hoặc từ khóa..."
                                    class="w-full pl-8 pr-3 py-1.5 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none">
                            </div>
                            <button type="button" onclick="FloatingTakeNote.createNewNote()"
                                class="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition shrink-0 cursor-pointer">
                                + Tạo trang mới
                            </button>
                        </div>

                        <div id="ftnNotesListContainer" class="flex-1 overflow-y-auto space-y-2 pr-1">
                            <!-- Rendered dynamically -->
                        </div>
                    </div>

                    <!-- ========================================== -->
                    <!-- TAB 3: CHÉP PHẠT TỪ VỰNG & BẪY PART 5      -->
                    <!-- ========================================== -->
                    <div id="ftnPane-drill" class="flex-1 flex flex-col min-h-0 hidden p-4 space-y-3.5 overflow-y-auto">
                        <div class="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-2xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200">
                            <strong>🎯 Công cụ chép phạt ghi nhớ siêu tốc:</strong> Gõ lặp lại câu bẫy hoặc từ vựng 10-30 lần để tạo phản xạ 3 giây trong phòng thi TOEIC!
                        </div>

                        <div class="space-y-1.5">
                            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Từ vựng hoặc bẫy cần gõ lặp lại:</label>
                            <input type="text" id="ftnDrillTargetInput" value="abide by = comply with = conform to = adhere to"
                                onchange="FloatingTakeNote.setDrillTarget(this.value)"
                                class="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none">
                        </div>

                        <div class="flex items-center justify-between text-xs font-bold text-slate-500">
                            <span>Mục tiêu số lần gõ:</span>
                            <div class="flex items-center gap-1.5">
                                <button type="button" onclick="FloatingTakeNote.setDrillGoal(10)" class="px-2.5 py-1 rounded-lg border text-xs font-bold bg-amber-500 text-slate-950">10 lần</button>
                                <button type="button" onclick="FloatingTakeNote.setDrillGoal(20)" class="px-2.5 py-1 rounded-lg border text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">20 lần</button>
                                <button type="button" onclick="FloatingTakeNote.setDrillGoal(30)" class="px-2.5 py-1 rounded-lg border text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">30 lần</button>
                            </div>
                        </div>

                        <!-- Typing input for drill -->
                        <div class="space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-extrabold text-slate-700 dark:text-slate-300">Nhập vào đây (Bấm Enter sau mỗi lần):</span>
                                <span id="ftnDrillProgressBadge" class="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-cyan-300">
                                    0 / 10 lần
                                </span>
                            </div>
                            <input type="text" id="ftnDrillInput" placeholder="Gõ chính xác cụm từ trên rồi bấm Enter..."
                                onkeydown="FloatingTakeNote.handleDrillKeydown(event)"
                                class="w-full px-3.5 py-2.5 text-xs font-bold rounded-xl border-2 border-blue-400 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500">
                        </div>

                        <!-- History logs -->
                        <div class="space-y-1">
                            <div class="text-[11px] font-bold text-slate-400">Lịch sử các lần gõ đúng:</div>
                            <div id="ftnDrillHistory" class="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 max-h-36 overflow-y-auto space-y-1 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                                <div class="text-slate-400 italic">Chưa có lượt gõ nào. Hãy bắt đầu!</div>
                            </div>
                        </div>

                        <button type="button" onclick="FloatingTakeNote.insertDrillToNote()"
                            class="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black text-xs transition shadow-md active:scale-95 cursor-pointer">
                            📥 Chèn kết quả luyện tập vào trang ghi chú hiện tại
                        </button>
                    </div>

                </div>

            </div>
            \`;

            document.body.insertAdjacentHTML('beforeend', modalHTML);
        },

        bindResizeAndDragEvents() {
            const modal = document.getElementById('floatingTakeNoteModal');
            const dragBar = document.getElementById('ftnDragBar');
            if (!modal || !dragBar) return;

            let isDragging = false;
            let isResizing = false;
            let currentHandle = null;
            let startX = 0;
            let startY = 0;
            let startLeft = 0;
            let startTop = 0;
            let startWidth = 0;
            let startHeight = 0;

            const MIN_WIDTH = 340;
            const MIN_HEIGHT = 280;

            // 1. DI CHUYỂN KHUNG BẰNG THANH HEADER (ẢNH 2)
            dragBar.addEventListener('pointerdown', (e) => {
                // Không kéo nếu nhấp vào các nút đóng / thu nhỏ / mở rộng
                if (e.target.closest('button') || e.target.closest('input') || e.target.closest('select')) {
                    return;
                }
                isDragging = true;
                modal.classList.add('is-dragging');
                dragBar.setPointerCapture(e.pointerId);

                const rect = modal.getBoundingClientRect();
                startX = e.clientX;
                startY = e.clientY;
                startLeft = rect.left;
                startTop = rect.top;
                startWidth = rect.width;
                startHeight = rect.height;

                modal.style.left = startLeft + 'px';
                modal.style.top = startTop + 'px';
                modal.style.right = 'auto';
                modal.style.bottom = 'auto';
                modal.style.width = startWidth + 'px';
                modal.style.height = startHeight + 'px';
            });

            const onDragMove = (e) => {
                if (!isDragging) return;
                const dx = e.clientX - startX;
                const dy = e.clientY - startY;
                const maxLeft = window.innerWidth - modal.offsetWidth - 10;
                const maxTop = window.innerHeight - modal.offsetHeight - 10;
                const newLeft = Math.max(10, Math.min(maxLeft, startLeft + dx));
                const newTop = Math.max(10, Math.min(maxTop, startTop + dy));

                modal.style.left = newLeft + 'px';
                modal.style.top = newTop + 'px';
                this.geometry.left = newLeft;
                this.geometry.top = newTop;
            };

            const onDragEnd = (e) => {
                if (isDragging) {
                    isDragging = false;
                    modal.classList.remove('is-dragging');
                    try { dragBar.releasePointerCapture(e.pointerId); } catch(err) {}
                    this.saveGeometry();
                }
            };

            dragBar.addEventListener('pointermove', onDragMove);
            dragBar.addEventListener('pointerup', onDragEnd);
            dragBar.addEventListener('pointercancel', onDragEnd);
            window.addEventListener('pointermove', (e) => { if (isDragging) onDragMove(e); });
            window.addEventListener('pointerup', (e) => { if (isDragging) onDragEnd(e); });

            // 2. THU TO / THU NHỎ Ở 4 GÓC CỦA KHUNG (ẢNH 1)
            const handles = modal.querySelectorAll('.ftn-handle');
            handles.forEach(h => {
                h.addEventListener('pointerdown', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    isResizing = true;
                    currentHandle = h.dataset.handle;
                    h.setPointerCapture(e.pointerId);

                    const rect = modal.getBoundingClientRect();
                    startX = e.clientX;
                    startY = e.clientY;
                    startLeft = rect.left;
                    startTop = rect.top;
                    startWidth = rect.width;
                    startHeight = rect.height;

                    modal.style.left = startLeft + 'px';
                    modal.style.top = startTop + 'px';
                    modal.style.right = 'auto';
                    modal.style.bottom = 'auto';
                    modal.style.width = startWidth + 'px';
                    modal.style.height = startHeight + 'px';
                });

                const onResizeMove = (e) => {
                    if (!isResizing || !currentHandle) return;
                    const dx = e.clientX - startX;
                    const dy = e.clientY - startY;

                    const maxW = window.innerWidth - 20;
                    const maxH = window.innerHeight - 20;

                    let newW = startWidth;
                    let newH = startHeight;
                    let newL = startLeft;
                    let newT = startTop;

                    // Phía Đông (Phải)
                    if (currentHandle.includes('e')) {
                        newW = Math.max(MIN_WIDTH, Math.min(maxW, startWidth + dx));
                    }
                    // Phía Nam (Dưới)
                    if (currentHandle.includes('s')) {
                        newH = Math.max(MIN_HEIGHT, Math.min(maxH, startHeight + dy));
                    }
                    // Phía Tây (Trái)
                    if (currentHandle.includes('w')) {
                        const calculatedW = startWidth - dx;
                        if (calculatedW >= MIN_WIDTH) {
                            newW = Math.min(maxW, calculatedW);
                            newL = startLeft + dx;
                        } else {
                            newW = MIN_WIDTH;
                            newL = startLeft + (startWidth - MIN_WIDTH);
                        }
                    }
                    // Phía Bắc (Trên)
                    if (currentHandle.includes('n')) {
                        const calculatedH = startHeight - dy;
                        if (calculatedH >= MIN_HEIGHT) {
                            newH = Math.min(maxH, calculatedH);
                            newT = startTop + dy;
                        } else {
                            newH = MIN_HEIGHT;
                            newT = startTop + (startHeight - MIN_HEIGHT);
                        }
                    }

                    modal.style.width = newW + 'px';
                    modal.style.height = newH + 'px';
                    modal.style.left = newL + 'px';
                    modal.style.top = newT + 'px';

                    this.geometry.width = newW;
                    this.geometry.height = newH;
                    this.geometry.left = newL;
                    this.geometry.top = newT;
                };

                const onResizeEnd = (e) => {
                    if (isResizing) {
                        isResizing = false;
                        currentHandle = null;
                        try { h.releasePointerCapture(e.pointerId); } catch(err) {}
                        this.saveGeometry();
                    }
                };

                h.addEventListener('pointermove', onResizeMove);
                h.addEventListener('pointerup', onResizeEnd);
                h.addEventListener('pointercancel', onResizeEnd);
                window.addEventListener('pointermove', (e) => { if (isResizing) onResizeMove(e); });
                window.addEventListener('pointerup', (e) => { if (isResizing) onResizeEnd(e); });
            });
        },

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        },

        open(options = {}) {
            const modal = document.getElementById('floatingTakeNoteModal');
            if (!modal) {
                this.injectModalMarkup();
                this.bindResizeAndDragEvents();
            }

            const m = document.getElementById('floatingTakeNoteModal');
            if (!m) return;

            this.syncWithGlobalNotes();

            const w = Math.min(window.innerWidth - 30, Math.max(340, this.geometry.width || 580));
            const h = Math.min(window.innerHeight - 80, Math.max(280, this.geometry.height || 520));
            m.style.width = w + 'px';
            m.style.height = h + 'px';

            if (this.geometry.left !== null && this.geometry.top !== null) {
                const maxL = window.innerWidth - w - 10;
                const maxT = window.innerHeight - h - 10;
                m.style.left = Math.max(10, Math.min(maxL, this.geometry.left)) + 'px';
                m.style.top = Math.max(10, Math.min(maxT, this.geometry.top)) + 'px';
                m.style.right = 'auto';
                m.style.bottom = 'auto';
            } else {
                m.style.right = '24px';
                m.style.bottom = '84px';
                m.style.left = 'auto';
                m.style.top = 'auto';
            }

            m.classList.remove('hidden');
            m.classList.add('flex');
            this.isOpen = true;

            this.loadActiveNote();
            this.updateSelectorDropdown();

            if (options.snippet) {
                this.appendSnippetToEditor(options.snippet);
            }
        },

        close() {
            const m = document.getElementById('floatingTakeNoteModal');
            if (m) {
                m.classList.add('hidden');
                m.classList.remove('flex');
            }
            this.saveCurrentNoteImmediately();
            this.isOpen = false;
        },

        toggleMinimize() {
            const body = document.getElementById('ftnBody');
            const icon = document.getElementById('ftnMinIcon');
            const modal = document.getElementById('floatingTakeNoteModal');
            if (!body || !modal) return;

            this.isMinimized = !this.isMinimized;
            if (this.isMinimized) {
                body.classList.add('hidden');
                modal.style.height = 'auto';
                if (icon) icon.className = 'fa-solid fa-up-right-and-down-left-from-center';
            } else {
                body.classList.remove('hidden');
                modal.style.height = (this.geometry.height || 520) + 'px';
                if (icon) icon.className = 'fa-solid fa-minus';
            }
        },

        openFullTakeNoteTab() {
            this.saveCurrentNoteImmediately();
            if (typeof switchTab === 'function') {
                switchTab('take-note');
            }
            if (typeof showToast === 'function') {
                showToast('📖 Đã chuyển sang Sổ Take Note toàn màn hình!');
            }
        },

        getNotesList() {
            this.syncWithGlobalNotes();
            return window.takeNotesList;
        },

        getActiveNote() {
            const list = this.getNotesList();
            return list.find(n => n.id === window.activeNoteId) || list[0];
        },

        syncWithGlobalNotes() {
            if (typeof window.takeNotesList === 'undefined' || !Array.isArray(window.takeNotesList) || window.takeNotesList.length === 0) {
                if (typeof window.initTakeNotes === 'function') {
                    window.initTakeNotes();
                } else if (typeof initTakeNotes === 'function') {
                    initTakeNotes();
                }
            }
            if (typeof window.takeNotesList === 'undefined' || !Array.isArray(window.takeNotesList) || window.takeNotesList.length === 0) {
                try {
                    const raw = localStorage.getItem('cung_dang_take_notes_v1');
                    if (raw) {
                        window.takeNotesList = JSON.parse(raw);
                    }
                } catch(e) {}
            }
            if (!Array.isArray(window.takeNotesList) || window.takeNotesList.length === 0) {
                window.takeNotesList = [{
                    id: 'note-1',
                    title: '📝 Ghi chú Part 5 & Bẫy TOEIC 2026',
                    category: 'Part 5 Bẫy',
                    paper: 'paper-lined',
                    updatedAt: 'Vừa xong',
                    updatedAtMs: Date.now(),
                    content: '<p><strong>[Mẹo Part 5]:</strong> Cẩn thận bẫy từ loại đuôi <em>-ive</em> (initiative, representative) là danh từ!</p>'
                }];
                window.activeNoteId = 'note-1';
            }
            if (!window.activeNoteId && window.takeNotesList.length > 0) {
                window.activeNoteId = window.takeNotesList[0].id;
            }
        },

        loadActiveNote() {
            const note = this.getActiveNote();
            if (!note) return;
            window.activeNoteId = note.id;

            const titleEl = document.getElementById('ftnNoteTitle');
            const catEl = document.getElementById('ftnCategorySelect');
            const paperSelect = document.getElementById('ftnPaperSelect');
            const paperEl = document.getElementById('ftnEditorPaper');

            if (titleEl) titleEl.value = note.title || '';
            if (catEl) catEl.value = note.category || 'Part 5 Bẫy';
            if (paperSelect) paperSelect.value = note.paper || 'paper-lined';

            if (paperEl) {
                paperEl.innerHTML = note.content || '<p>Bắt đầu viết ghi chú của bạn tại đây...</p>';
                this.applyPaperClassToElement(paperEl, note.paper || 'paper-lined');
            }

            this.updateWordCount();
            this.updateSaveStatus('✓ Đã tải trang ghi chú');
        },

        applyPaperClassToElement(el, paperStyle) {
            el.classList.remove('paper-lined', 'paper-grid', 'paper-blank', 'paper-vintage');
            if (paperStyle === 'paper-grid') el.classList.add('paper-grid');
            else if (paperStyle === 'paper-blank') el.classList.add('paper-blank');
            else if (paperStyle === 'paper-vintage') el.classList.add('paper-vintage');
            else el.classList.add('paper-lined');
        },

        updateSelectorDropdown() {
            const sel = document.getElementById('ftnNoteSelector');
            const list = this.getNotesList();
            if (!sel || !Array.isArray(list)) return;

            sel.innerHTML = list.map(n => {
                const isSel = n.id === window.activeNoteId ? 'selected' : '';
                const preview = (n.title || 'Trang không tên').slice(0, 32);
                return \`<option value="\${n.id}" \${isSel}>📄 [\${n.category || 'Note'}] \${preview}</option>\`;
            }).join('');
        },

        handleSelectNote(id) {
            this.saveCurrentNoteImmediately();
            window.activeNoteId = id;
            this.loadActiveNote();
            if (typeof selectTakeNotePage === 'function') {
                selectTakeNotePage(id);
            }
        },

        handleTitleChange(newTitle) {
            const note = this.getActiveNote();
            if (note) {
                note.title = newTitle.trim() || 'Trang ghi chú không tên';
                this.triggerDebouncedSave();
                this.updateSelectorDropdown();
                const mainTitleInput = document.getElementById('takeNoteTitleInput');
                if (mainTitleInput) mainTitleInput.value = note.title;
            }
        },

        handleCategoryChange(newCategory) {
            const note = this.getActiveNote();
            if (note) {
                note.category = newCategory;
                this.triggerDebouncedSave();
                this.updateSelectorDropdown();
                const mainCat = document.getElementById('takeNoteCategorySelect');
                if (mainCat) mainCat.value = newCategory;
            }
        },

        handlePaperChange(styleClass) {
            const note = this.getActiveNote();
            if (note) {
                note.paper = styleClass;
                const paperEl = document.getElementById('ftnEditorPaper');
                if (paperEl) this.applyPaperClassToElement(paperEl, styleClass);
                this.triggerDebouncedSave();
                if (typeof changeTakeNotePaperStyle === 'function') {
                    changeTakeNotePaperStyle(styleClass);
                }
            }
        },

        handleEditorInput() {
            this.updateWordCount();
            this.triggerDebouncedSave();
        },

        updateWordCount() {
            const paperEl = document.getElementById('ftnEditorPaper');
            const countEl = document.getElementById('ftnWordCount');
            if (!paperEl || !countEl) return;
            const text = (paperEl.innerText || '').trim();
            const words = text ? text.split(/\\s+/).filter(Boolean).length : 0;
            countEl.textContent = \`\${words} từ\`;
        },

        triggerDebouncedSave() {
            this.updateSaveStatus('Đang lưu...');
            clearTimeout(this.saveTimer);
            this.saveTimer = setTimeout(() => {
                this.saveCurrentNoteImmediately();
            }, 450);
        },

        saveCurrentNoteImmediately() {
            const note = this.getActiveNote();
            const paperEl = document.getElementById('ftnEditorPaper');
            const titleEl = document.getElementById('ftnNoteTitle');
            const catEl = document.getElementById('ftnCategorySelect');

            if (!note || !paperEl) return;

            if (titleEl) note.title = titleEl.value.trim() || 'Trang ghi chú';
            if (catEl) note.category = catEl.value;
            note.content = paperEl.innerHTML;
            note.previewText = (paperEl.innerText || '').replace(/\\s+/g, ' ').trim().slice(0, 160);

            const now = new Date();
            note.updatedAt = \`\${String(now.getHours()).padStart(2, '0')}:\${String(now.getMinutes()).padStart(2, '0')}\`;
            note.updatedAtMs = Date.now();

            if (typeof persistTakeNotes === 'function') {
                persistTakeNotes();
            } else {
                try {
                    localStorage.setItem('cung_dang_take_notes_v1', JSON.stringify(this.getNotesList()));
                } catch(e) {}
            }

            // Đồng bộ sang giao diện chính của Sổ Note
            const mainPaper = document.getElementById('takeNoteEditorPaper');
            if (mainPaper && mainPaper.innerHTML !== note.content) {
                mainPaper.innerHTML = note.content;
            }
            if (typeof renderTakeNoteSidebarList === 'function') {
                renderTakeNoteSidebarList();
            }

            this.updateSaveStatus(\`✓ Đã lưu lúc \${note.updatedAt}\`);
        },

        updateSaveStatus(msg) {
            const el = document.getElementById('ftnSaveStatus');
            if (el) el.textContent = msg;
        },

        createNewNote() {
            this.saveCurrentNoteImmediately();
            const list = this.getNotesList();
            const newId = 'note-' + Date.now();
            const newNote = {
                id: newId,
                title: '📝 Ghi chú Part 5 mới',
                category: 'Part 5 Bẫy',
                paper: 'paper-lined',
                updatedAt: 'Vừa xong',
                updatedAtMs: Date.now(),
                content: '<p>Bắt đầu viết ghi chú bẫy Part 5 hoặc từ vựng mới...</p>'
            };
            list.unshift(newNote);
            window.activeNoteId = newId;

            if (typeof persistTakeNotes === 'function') persistTakeNotes();
            if (typeof renderTakeNoteSidebarList === 'function') renderTakeNoteSidebarList();

            this.switchTab('editor');
            this.loadActiveNote();
            this.updateSelectorDropdown();

            const titleEl = document.getElementById('ftnNoteTitle');
            if (titleEl) {
                titleEl.focus();
                titleEl.select();
            }
            if (typeof showToast === 'function') {
                showToast('📒 Đã tạo trang mới trong Sổ Take Note!');
            }
        },

        format(cmd, value = null) {
            document.execCommand(cmd, false, value);
            const paperEl = document.getElementById('ftnEditorPaper');
            if (paperEl) paperEl.focus();
            this.handleEditorInput();
        },

        highlight(color) {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;
            const range = selection.getRangeAt(0);
            if (range.collapsed) {
                document.execCommand('hiliteColor', false, color);
            } else {
                const mark = document.createElement('mark');
                mark.style.backgroundColor = color;
                mark.style.borderRadius = '4px';
                mark.style.padding = '0 3px';
                mark.appendChild(range.extractContents());
                range.insertNode(mark);
            }
            this.handleEditorInput();
        },

        insertTemplate(type) {
            const paperEl = document.getElementById('ftnEditorPaper');
            if (!paperEl) return;
            paperEl.focus();

            let snippet = '';
            if (type === 'part5_trap') {
                snippet = \`
                    <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px 14px; margin: 10px 0; border-radius: 10px; font-size: 13px; color: #78350f;">
                        <strong>⚠️ [BẪY ETS PART 5]:</strong> Cẩn thận bẫy từ loại đuôi -ive / -al...<br>
                        <strong>🎯 Mẹo 3 giây:</strong> Nhìn trước chỗ trống là mạo từ "the" + tính từ...<br>
                        <strong>💡 Ví dụ:</strong> The company's new <u>initiative</u> has been successful.
                    </div><p><br></p>
                \`;
            } else if (type === 'collocation') {
                snippet = \`
                    <div style="background: #e0f2fe; border-left: 4px solid #0284c7; padding: 10px 14px; margin: 10px 0; border-radius: 10px; font-size: 13px; color: #0c4a6e;">
                        <strong>📌 [COLLOCATION ĂN ĐIỂM]:</strong><br>
                        • <strong>abide by</strong> = <strong>comply with</strong> = <strong>adhere to</strong>: tuân thủ<br>
                        • <strong>behind schedule</strong> (trễ) ≠ <strong>ahead of schedule</strong> (sớm tiến độ)
                    </div><p><br></p>
                \`;
            } else if (type === 'vocab_card') {
                snippet = \`
                    <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 10px 14px; margin: 10px 0; border-radius: 10px; font-size: 13px; color: #064e3b;">
                        <strong>📖 [TỪ VỰNG]:</strong> <em>reimburse</em> /ˌriː.ɪmˈbɜːs/ (v)<br>
                        <strong>🇻🇳 Nghĩa:</strong> Hoàn trả chi phí, bồi hoàn<br>
                        <strong>💬 Ví dụ:</strong> Travel expenses will be reimbursed promptly.
                    </div><p><br></p>
                \`;
            } else if (type === 'formula') {
                snippet = \`
                    <div style="background: #f3e8ff; border-left: 4px solid #a855f7; padding: 10px 14px; margin: 10px 0; border-radius: 10px; font-size: 13px; color: #581c87;">
                        <strong>📐 [CÔNG THỨC VÀNG]:</strong> S + V (ngoại động từ) + O + <u>Trạng từ (Adv)</u><br>
                        <strong>🔑 Dấu hiệu:</strong> Câu đã đủ Chủ ngữ và Tân ngữ hoàn chỉnh, chỗ trống cuối câu thường điền Trạng từ (-ly)!
                    </div><p><br></p>
                \`;
            } else if (type === 'checklist') {
                snippet = \`
                    <div style="display: flex; items-center; gap: 8px; margin: 6px 0;">
                        <input type="checkbox" style="cursor: pointer; width: 16px; height: 16px;">
                        <span>Ôn lại 20 câu Part 5 đề ETS 2026 Test 1</span>
                    </div><p><br></p>
                \`;
            }

            document.execCommand('insertHTML', false, snippet);
            this.handleEditorInput();
        },

        appendSnippetToEditor(htmlSnippet) {
            const paperEl = document.getElementById('ftnEditorPaper');
            if (!paperEl) return;
            paperEl.innerHTML += htmlSnippet;
            this.handleEditorInput();
        },

        switchTab(tabName) {
            this.activeTab = tabName;
            const tabs = ['editor', 'list', 'drill'];
            tabs.forEach(t => {
                const pane = document.getElementById(\`ftnPane-\${t}\`);
                const btn = document.getElementById(\`ftnTabBtn-\${t}\`);
                if (pane) {
                    if (t === tabName) pane.classList.remove('hidden');
                    else pane.classList.add('hidden');
                }
                if (btn) {
                    if (t === tabName) {
                        btn.className = 'px-3 py-1 rounded-lg text-xs font-black transition bg-amber-500 text-slate-950 shadow-xs cursor-pointer';
                    } else {
                        btn.className = 'px-3 py-1 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 transition cursor-pointer';
                    }
                }
            });

            if (tabName === 'list') {
                this.renderNotesList();
            }
        },

        renderNotesList() {
            const container = document.getElementById('ftnNotesListContainer');
            const searchInput = document.getElementById('ftnSearchListInput');
            const list = this.getNotesList();
            if (!container || !Array.isArray(list)) return;

            const q = (searchInput?.value || '').toLowerCase().trim();
            const filtered = list.filter(n => {
                return !q || (n.title || '').toLowerCase().includes(q) || (n.previewText || '').toLowerCase().includes(q);
            });

            if (filtered.length === 0) {
                container.innerHTML = \`<div class="text-center py-8 text-xs text-slate-400">Không tìm thấy trang ghi chú nào khớp với từ khóa.</div>\`;
                return;
            }

            container.innerHTML = filtered.map(n => {
                const isActive = n.id === window.activeNoteId;
                const preview = (n.previewText || (n.content || '').replace(/<[^>]+>/g, ' ')).slice(0, 75);
                return \`
                    <div onclick="FloatingTakeNote.handleSelectNote('\${n.id}'); FloatingTakeNote.switchTab('editor');"
                        class="p-3 rounded-2xl border transition cursor-pointer flex items-start justify-between gap-2 \${isActive ? 'bg-amber-50/90 border-amber-400 dark:bg-amber-950/40' : 'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 hover:border-amber-300'}">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center gap-1.5 mb-1">
                                <span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-black">\${n.category || 'Note'}</span>
                                <span class="text-[10px] text-slate-400">\${n.updatedAt || ''}</span>
                            </div>
                            <div class="text-xs font-black text-slate-900 dark:text-white truncate">\${n.title || 'Trang ghi chú'}</div>
                            <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">\${preview || 'Trang giấy trống...'}</div>
                        </div>
                        <button type="button" onclick="event.stopPropagation(); FloatingTakeNote.deleteNote('\${n.id}')" title="Xóa trang"
                            class="w-6 h-6 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 flex items-center justify-center text-xs transition cursor-pointer">
                            <i class="fa-regular fa-trash-can"></i>
                        </button>
                    </div>
                \`;
            }).join('');
        },

        deleteNote(id) {
            const list = this.getNotesList();
            if (list.length <= 1) {
                if (typeof showToast === 'function') showToast('Sổ Take Note cần giữ lại ít nhất 1 trang!');
                return;
            }
            window.takeNotesList = list.filter(n => n.id !== id);
            if (window.activeNoteId === id) {
                window.activeNoteId = window.takeNotesList[0].id;
            }
            if (typeof persistTakeNotes === 'function') persistTakeNotes();
            this.renderNotesList();
            this.loadActiveNote();
            this.updateSelectorDropdown();
            if (typeof showToast === 'function') showToast('🗑️ Đã xóa trang ghi chú!');
        },

        // =========================================================================
        // DRILL TOOL (CHÉP PHẠT LẶP LẠI TỪ VỰNG / BẪY 10-30 LẦN)
        // =========================================================================
        setDrillTarget(val) {
            this.drillTarget = val.trim();
            this.drillCount = 0;
            this.updateDrillUI();
        },

        setDrillGoal(num) {
            this.drillGoal = num;
            this.updateDrillUI();
        },

        handleDrillKeydown(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const input = document.getElementById('ftnDrillInput');
                if (!input) return;
                const typed = input.value.trim();
                const target = this.drillTarget.trim();

                if (typed.toLowerCase() === target.toLowerCase()) {
                    this.drillCount++;
                    input.value = '';
                    input.classList.remove('border-rose-500');
                    input.classList.add('border-emerald-500');

                    const history = document.getElementById('ftnDrillHistory');
                    if (history) {
                        if (this.drillCount === 1) history.innerHTML = '';
                        history.insertAdjacentHTML('afterbegin', \`<div>✓ Lần \${this.drillCount}: \${target}</div>\`);
                    }

                    if (this.drillCount >= this.drillGoal) {
                        if (typeof showToast === 'function') {
                            showToast(\`🎉 Xuất sắc! Bạn đã chép phạt thành công \${this.drillGoal} lần!\`);
                        }
                    }
                } else {
                    input.classList.add('border-rose-500');
                    if (typeof showToast === 'function') {
                        showToast('Gõ chưa chính xác! Hãy gõ đúng từng ký tự để rèn trí nhớ.');
                    }
                }
                this.updateDrillUI();
            }
        },

        updateDrillUI() {
            const badge = document.getElementById('ftnDrillProgressBadge');
            if (badge) {
                badge.textContent = \`\${this.drillCount} / \${this.drillGoal} lần\`;
                if (this.drillCount >= this.drillGoal) {
                    badge.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
                }
            }
        },

        insertDrillToNote() {
            if (this.drillCount === 0) {
                if (typeof showToast === 'function') showToast('Hãy gõ ít nhất 1 lần trước khi chèn vào ghi chú!');
                return;
            }
            const snippet = \`
                <div style="background: #fef3c7; border: 1px dashed #d97706; padding: 10px 14px; margin: 8px 0; border-radius: 12px; font-size: 13px;">
                    <strong>🔥 [ĐÃ LUYỆN CHÉP PHẠT \${this.drillCount}/\${this.drillGoal} LẦN]:</strong><br>
                    <span style="font-family: monospace; font-size: 14px; color: #b45309; font-weight: bold;">\${this.drillTarget}</span>
                </div><p><br></p>
            \`;
            this.switchTab('editor');
            this.appendSnippetToEditor(snippet);
            if (typeof showToast === 'function') showToast('📥 Đã chèn kết quả chép phạt vào trang ghi chú!');
        }
    };

    window.FloatingTakeNote = FloatingTakeNote;

    // Tự động khởi tạo sau khi DOM sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => FloatingTakeNote.init());
    } else {
        FloatingTakeNote.init();
    }
})();
`;

fs.writeFileSync(targetPath, newCode, 'utf8');
console.log('✅ Rewrote js/floating-take-note.js with dedicated ftnDragBar and 36px corner grips.');
