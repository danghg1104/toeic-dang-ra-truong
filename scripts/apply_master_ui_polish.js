const fs = require('fs');

const path = 'index.html';
let content = fs.readFileSync(path, 'utf8');

// 1. Locate #sanhTopHeaderBar
const headerStart = content.indexOf('<div id="sanhTopHeaderBar"');
const headerEndMarker = '<!-- 2. KHỐI 1 (HERO ACTION CARD): BÀI HỌC TIẾP THEO - ĐIỂM NHẤN SỐ 1 -->';
const headerEnd = content.indexOf(headerEndMarker);

if (headerStart === -1 || headerEnd === -1) {
    console.error('Could not locate #sanhTopHeaderBar boundaries!');
    process.exit(1);
}

const newHeaderHtml = `<div id="sanhTopHeaderBar" class="header-bar-elevation relative z-30 glass-panel rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:p-5 flex flex-col gap-2.5 sm:gap-3 shadow-xs border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
                    <!-- TIER 1: Brand Greeting, Academic Goal & Profile Cluster -->
                    <div class="flex items-center justify-between gap-3 flex-nowrap w-full">
                        <!-- Left: Brand Greeting & Academic Goal -->
                        <div class="flex items-center gap-2.5 sm:gap-3 text-slate-800 dark:text-white shrink min-w-0">
                            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-sm sm:text-base shrink-0 font-black shadow-md shadow-blue-500/20 ring-4 ring-blue-500/10">
                                <i class="fa-solid fa-graduation-cap"></i>
                            </div>
                            <div class="min-w-0">
                                <h1 class="text-xs sm:text-sm md:text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight truncate">
                                    <span id="sanhGreetingPrefix">Chào bạn,</span> <span id="sanhMemberGreetingName" class="text-blue-600 dark:text-blue-400 font-black">Học viên</span>
                                </h1>
                                <p class="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate" id="sanhHeaderSubText">
                                    Mục tiêu 600 TOEIC · Không gian học tập cá nhân hóa
                                </p>
                            </div>
                        </div>

                        <!-- Right: Actions (PWA, Notifications & User Avatar Profile Pill) -->
                        <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
                            <!-- PWA Install Button -->
                            <button id="btnPwaHeaderInstall" onclick="window.triggerPwaInstallPrompt && window.triggerPwaInstallPrompt()" class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition active:scale-95 cursor-pointer shrink-0" title="Cài đặt PWA 1 Chạm">
                                <i class="fa-solid fa-cloud-arrow-down text-xs"></i>
                                <span>Tải App</span>
                            </button>

                            <!-- Notification Center Bell -->
                            <button onclick="window.toggleNotificationCenter && window.toggleNotificationCenter()" class="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition cursor-pointer relative shrink-0" title="Thông báo tiến độ hàng tuần" aria-label="Thông báo tiến độ">
                                <i class="fa-regular fa-bell text-xs"></i>
                                <span id="headerWeeklyReportDot" class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
                            </button>

                            <!-- User Profile Avatar Pill & Dropdown -->
                            <div class="relative shrink-0" id="sanhMemberDropdownWrapper">
                                <button type="button" id="sanhMemberProfileTrigger" onclick="toggleMemberProfileDropdown(event)" class="pl-1.5 pr-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-2xs flex items-center gap-2 hover:border-blue-400 dark:hover:border-blue-500 transition text-left cursor-pointer shrink-0" title="Tài khoản & Thiết lập (Bấm để xem menu)">
                                    <div id="sanhMemberAvatar" class="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white font-extrabold text-xs flex items-center justify-center ring-2 ring-purple-300/40 shrink-0">
                                        <span id="sanhMemberAvatarLetter">H</span>
                                    </div>
                                    <div class="leading-tight hidden sm:block">
                                        <div id="sanhMemberProfileName" class="text-xs font-bold text-slate-800 dark:text-slate-200">Huynh Dang</div>
                                        <div class="text-[10px] text-slate-400">Xem hồ sơ</div>
                                    </div>
                                    <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 ml-0.5"></i>
                                </button>

                                <!-- Menu Sổ Xuống (Dropdown) -->
                                <div id="sanhMemberProfileMenu" class="hidden absolute right-0 top-full mt-2 w-56 sm:w-60 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/90 dark:border-slate-800 p-2 z-[99999] animate-fadeIn">
                                    <!-- Thông tin tóm tắt -->
                                    <div class="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center gap-2.5">
                                        <div class="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                                            <span>H</span>
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <div id="sanhMemberProfileDropdownName" class="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">Huynh Dang</div>
                                            <div id="sanhMemberDropdownEmail" class="text-[10px] text-slate-400 truncate">student@toididau.edu.vn</div>
                                        </div>
                                    </div>

                                    <!-- 3 Mục lựa chọn: Tài khoản, Cài đặt, Đăng xuất -->
                                    <div class="space-y-0.5">
                                        <button type="button" onclick="openAccountProfileView()" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition text-left cursor-pointer">
                                            <i class="fa-regular fa-user text-indigo-500 text-xs w-4 text-center"></i>
                                            <span>Tài khoản & Mục tiêu</span>
                                        </button>
                                        <button type="button" onclick="openAccountSettingsView()" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition text-left cursor-pointer">
                                            <i class="fa-solid fa-sliders text-emerald-500 text-xs w-4 text-center"></i>
                                            <span>Cài đặt hệ thống</span>
                                        </button>
                                        <button type="button" onclick="handleLogoutUser()" class="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold transition text-left cursor-pointer border-t border-slate-100 dark:border-slate-800 pt-2 mt-1">
                                            <i class="fa-solid fa-arrow-right-from-bracket text-xs w-4 text-center"></i>
                                            <span>Đăng xuất</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- TIER 2: Spacious Full-Width Horizontal Toolbar (Badges, Theme, Font, Pomodoro, Tour Guide) -->
                    <div class="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar py-0.5 flex-nowrap border-t border-slate-100 dark:border-slate-800/80 pt-2">
                        <!-- Cluster 1: Learning Badges -->
                        <div class="flex items-center gap-1.5 shrink-0">
                            <!-- Streak Pill -->
                            <div onclick="window.SoiMayCompanion && window.SoiMayCompanion.celebrateStreak()" class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer hover:scale-105 active:scale-95 transition shrink-0" title="Chuỗi học tập liên tục (Bấm để nhận lời chúc từ Sói Mây)">
                                <i class="fa-solid fa-fire text-amber-500 animate-pulse text-xs"></i>
                                <span id="sanhMemberStreakVal">0 ngày</span>
                            </div>

                            <!-- XP Pill -->
                            <div class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs shrink-0">
                                <i class="fa-solid fa-star text-purple-500 text-xs"></i>
                                <span id="sanhMemberXpVal">0 XP</span>
                            </div>
                        </div>

                        <!-- Divider 1 -->
                        <div class="h-4 w-px bg-slate-200 dark:bg-slate-700 shrink-0"></div>

                        <!-- Cluster 2: Study Environment Controls (Locked min-widths for 0px jitter) -->
                        <div id="studyEnvironmentControls" class="flex items-center gap-1.5 shrink-0">
                            <!-- Warm Sand Theme Toggle (Locked min-width) -->
                            <button id="btnEditorialToggle" onclick="window.EditorialThemeManager && window.EditorialThemeManager.toggleEditorial()" class="min-w-[115px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer shrink-0" title="Chế độ Giấy Tự Nhiên & Mực Trầm (Warm Sand)">
                                <i class="fa-solid fa-scroll text-amber-600 text-xs"></i>
                                <span>Warm Sand</span>
                            </button>

                            <!-- ETS Serif Font Switcher (Locked min-width so text toggle NEVER shifts layout) -->
                            <button id="btnFontToggle" onclick="window.EditorialThemeManager && window.EditorialThemeManager.toggleFont()" class="min-w-[105px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer shrink-0" title="Đổi phông thi ETS Serif / Inter">
                                <i class="fa-solid fa-font text-indigo-600 text-xs"></i>
                                <span class="font-mode-label font-serif">Serif ETS</span>
                            </button>

                            <!-- Pomodoro Focus Timer -->
                            <button id="btnQuickPomodoroLaunch" onclick="window.togglePomodoroHudModal && window.togglePomodoroHudModal()" class="min-w-[85px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer shrink-0" title="Đồng hồ Pomodoro tùy chỉnh thời gian & Âm nền tập trung">
                                <i class="fa-regular fa-clock text-rose-500 animate-pulse text-xs"></i>
                                <span id="quickPomodoroTimeDisplay">25:00</span>
                            </button>
                        </div>

                        <!-- Divider 2 -->
                        <div class="h-4 w-px bg-slate-200 dark:bg-slate-700 shrink-0"></div>

                        <!-- Cluster 3: Onboarding Tour Guide Launcher -->
                        <div class="flex items-center gap-1.5 shrink-0">
                            <button id="btnStartTourGuide" onclick="window.AppTourGuide && window.AppTourGuide.start(true)" class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer shrink-0" title="Hướng dẫn làm quen ứng dụng (Tour Guide)">
                                <i class="fa-solid fa-compass text-sky-600 text-xs"></i>
                                <span>Hướng dẫn</span>
                            </button>
                        </div>
                    </div>
                </div>\n\n                `;

content = content.slice(0, headerStart) + newHeaderHtml + content.slice(headerEnd);

// 2. Locate Hero action buttons to replace with clean primary CTA + dedicated quick study tools bar
const heroButtonsStart = content.indexOf('<div class="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3">');
const heroMascotStart = content.indexOf('<!-- Right Illustration: Sói Mây Companion');

if (heroButtonsStart === -1 || heroMascotStart === -1) {
    console.error('Could not locate hero buttons boundaries!');
    process.exit(1);
}

const newHeroButtonsHtml = `<div class="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                                <button id="heroPrimaryCtaBtn" onclick="window.startHeroNextLesson()" class="px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-blue-500/25 active:scale-98 transition cursor-pointer">
                                    <i class="fa-solid fa-play text-xs"></i>
                                    <span id="heroPrimaryCtaText">Bắt đầu Test Chẩn Đoán (25 phút)</span>
                                </button>
                                <button id="heroSecondaryBtn" onclick="switchTab('lo-trinh')" class="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold text-xs border border-slate-200/80 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer">
                                    <span>Xem toàn bộ 6 chặng</span>
                                    <i class="fa-solid fa-arrow-right text-xs text-slate-400"></i>
                                </button>
                                <button onclick="window.openAdaptiveTestModal && window.openAdaptiveTestModal()" class="px-3.5 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs border border-indigo-200/80 dark:border-indigo-800 transition flex items-center gap-1.5 cursor-pointer" title="Kiểm tra trình độ nhanh bằng thuật toán 2PL IRT">
                                    <i class="fa-solid fa-gauge-high text-xs"></i>
                                    <span>Test Nhanh 10 Phút</span>
                                </button>
                                <button onclick="window.openTrapHeatMatrixModal && window.openTrapHeatMatrixModal()" class="px-3.5 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 font-bold text-xs border border-amber-200/80 dark:border-amber-800 transition flex items-center gap-1.5 cursor-pointer" title="Khảo sát ma trận 12 bẫy tử huyệt và tỷ lệ sai sót">
                                    <i class="fa-solid fa-fire text-xs text-amber-500"></i>
                                    <span>12 Bẫy Tử Huyệt</span>
                                </button>
                            </div>

                            <!-- BỘ CÔNG CỤ LUYỆN THI SIÊU TỐC 2026 (QUICK STUDY TOOLS DOCK) -->
                            <div id="quickStudyToolsContainer" class="pt-3.5 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center gap-2">
                                        <span class="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                                            <i class="fa-solid fa-bolt text-amber-500 text-xs"></i>
                                            Công Cụ Luyện Thi Siêu Tốc 2026
                                        </span>
                                        <span class="px-2 py-0.5 rounded-full text-[9px] font-black bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-800/50">4 Trạm</span>
                                    </div>
                                    <span class="text-[10px] text-slate-400 font-medium hidden sm:inline">Bấm để mở công cụ ôn luyện</span>
                                </div>

                                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                                    <!-- 1. Trạm 180s -->
                                    <button type="button" onclick="window.openCapsuleStationModal && window.openCapsuleStationModal()" class="group p-2.5 rounded-2xl bg-teal-50/80 hover:bg-teal-100 dark:bg-teal-950/30 dark:hover:bg-teal-900/40 border border-teal-200/80 dark:border-teal-800/60 text-left transition active:scale-98 cursor-pointer flex items-center gap-2.5 shadow-2xs">
                                        <div class="w-8 h-8 rounded-xl bg-teal-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm shadow-teal-500/30 group-hover:scale-105 transition">
                                            <i class="fa-solid fa-capsules"></i>
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <div class="text-xs font-bold text-teal-950 dark:text-teal-200 truncate">Trạm 180s</div>
                                            <div class="text-[10px] text-teal-600 dark:text-teal-400 font-medium truncate">Viên nang 3 phút</div>
                                        </div>
                                    </button>

                                    <!-- 2. Flashcard 3D -->
                                    <button type="button" onclick="window.openTinderFlashcardModal && window.openTinderFlashcardModal()" class="group p-2.5 rounded-2xl bg-fuchsia-50/80 hover:bg-fuchsia-100 dark:bg-fuchsia-950/30 dark:hover:bg-fuchsia-900/40 border border-fuchsia-200/80 dark:border-fuchsia-800/60 text-left transition active:scale-98 cursor-pointer flex items-center gap-2.5 shadow-2xs">
                                        <div class="w-8 h-8 rounded-xl bg-fuchsia-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm shadow-fuchsia-600/30 group-hover:scale-105 transition">
                                            <i class="fa-solid fa-layer-group"></i>
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <div class="text-xs font-bold text-fuchsia-950 dark:text-fuchsia-200 truncate">Flashcard 3D</div>
                                            <div class="text-[10px] text-fuchsia-600 dark:text-fuchsia-400 font-medium truncate">Vuốt Tinder FSRS v5</div>
                                        </div>
                                    </button>

                                    <!-- 3. Cheat Sheet 1 Trang -->
                                    <button type="button" onclick="window.openCheatSheetModal && window.openCheatSheetModal('unit03')" class="group p-2.5 rounded-2xl bg-emerald-50/80 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/40 border border-emerald-200/80 dark:border-emerald-800/60 text-left transition active:scale-98 cursor-pointer flex items-center gap-2.5 shadow-2xs">
                                        <div class="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm shadow-emerald-600/30 group-hover:scale-105 transition">
                                            <i class="fa-solid fa-file-lines"></i>
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <div class="text-xs font-bold text-emerald-950 dark:text-emerald-200 truncate">Cheat Sheet</div>
                                            <div class="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium truncate">1 trang tóm tắt & PDF</div>
                                        </div>
                                    </button>

                                    <!-- 4. Tài Liệu Thực Chiến -->
                                    <button type="button" onclick="window.openAuthenticDocumentModal && window.openAuthenticDocumentModal('Email')" class="group p-2.5 rounded-2xl bg-sky-50/80 hover:bg-sky-100 dark:bg-sky-950/30 dark:hover:bg-sky-900/40 border border-sky-200/80 dark:border-sky-800/60 text-left transition active:scale-98 cursor-pointer flex items-center gap-2.5 shadow-2xs">
                                        <div class="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm shadow-sky-600/30 group-hover:scale-105 transition">
                                            <i class="fa-solid fa-file-contract"></i>
                                        </div>
                                        <div class="min-w-0 flex-1">
                                            <div class="text-xs font-bold text-sky-950 dark:text-sky-200 truncate">Tài Liệu Đề Thi</div>
                                            <div class="text-[10px] text-sky-600 dark:text-sky-400 font-medium truncate">Hóa đơn, email Part 6-7</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>

                        `;

content = content.slice(0, heroButtonsStart) + newHeroButtonsHtml + content.slice(heroMascotStart);

// 3. Update sampleDeck in openTinderFlashcardModal to 12 high-frequency words
const deckStart = content.indexOf('const sampleDeck = [');
const deckEnd = content.indexOf('];', deckStart);

if (deckStart !== -1 && deckEnd !== -1) {
    const newDeckCode = `const sampleDeck = [
                    { word: 'abide by', ipa: '/əˈbaɪd baɪ/', pos: 'v.', meaning: 'Tuân thủ, tôn trọng thỏa thuận', example: 'Both parties agreed to abide by the terms of the contract.', exampleVi: 'Cả hai bên đồng ý tuân thủ các điều khoản hợp đồng.', collocation: 'abide by the contract', tier: 'Cực Cao' },
                    { word: 'accommodate', ipa: '/əˈkɑː.mə.deɪt/', pos: 'v.', meaning: 'Đáp ứng nhu cầu, cung cấp chỗ', example: 'The conference hall can accommodate up to 500 attendees.', exampleVi: 'Hội trường hội nghị có thể chứa đến 500 người tham dự.', collocation: 'accommodate requests', tier: 'Cực Cao' },
                    { word: 'expedite', ipa: '/ˈek.spə.daɪt/', pos: 'v.', meaning: 'Xúc tiến, đẩy nhanh tiến độ', example: 'Please expedite the shipping process for this urgent client.', exampleVi: 'Vui lòng đẩy nhanh quá trình giao hàng cho khách hàng khẩn cấp này.', collocation: 'expedite shipment', tier: 'Cực Cao' },
                    { word: 'discrepancy', ipa: '/dɪˈskrep.ən.si/', pos: 'n.', meaning: 'Sự chênh lệch, sai số tài chính', example: 'The accountant discovered a discrepancy between invoice and ledger.', exampleVi: 'Kế toán phát hiện sự sai lệch giữa hóa đơn và sổ cái.', collocation: 'budget discrepancy', tier: 'Cao' },
                    { word: 'moratorium', ipa: '/ˌmɔːr.əˈtɔːr.i.əm/', pos: 'n.', meaning: 'Lệnh tạm hoãn nợ, đình chỉ thanh toán', example: 'The government placed a moratorium on commercial loan defaults.', exampleVi: 'Chính phủ đã ban hành lệnh tạm hoãn trả nợ thương mại.', collocation: 'debt moratorium', tier: 'Trung Bình' },
                    { word: 'remittance', ipa: '/rɪˈmɪt.əns/', pos: 'n.', meaning: 'Khoản tiền gửi, tiền thanh toán chuyển khoản', example: 'We received your remittance for invoice #4928 yesterday.', exampleVi: 'Chúng tôi đã nhận được khoản thanh toán chuyển khoản của bạn ngày hôm qua.', collocation: 'prompt remittance', tier: 'Cao' },
                    { word: 'prerequisite', ipa: '/priːˈrek.wə.zɪt/', pos: 'n.', meaning: 'Điều kiện tiên quyết, bắt buộc trước', example: 'Five years of managerial experience is a prerequisite for this position.', exampleVi: 'Năm năm kinh nghiệm quản lý là điều kiện tiên quyết cho vị trí này.', collocation: 'prerequisite course', tier: 'Cực Cao' },
                    { word: 'lucrative', ipa: '/ˈluː.krə.tɪv/', pos: 'adj.', meaning: 'Sinh lợi cao, béo bở, đắt khách', example: 'The merger proved to be a highly lucrative business venture.', exampleVi: 'Thương vụ sáp nhập đã chứng minh là một dự án kinh doanh cực kỳ sinh lợi.', collocation: 'lucrative deal', tier: 'Cao' },
                    { word: 'consensus', ipa: '/kənˈsen.səs/', pos: 'n.', meaning: 'Sự đồng thuận, nhất trí chung của tập thể', example: 'The committee finally reached a consensus on the new budget proposal.', exampleVi: 'Ủy ban cuối cùng đã đạt được sự đồng thuận về đề xuất ngân sách mới.', collocation: 'reach a consensus', tier: 'Cực Cao' },
                    { word: 'reimburse', ipa: '/ˌriː.ɪmˈbɜːrs/', pos: 'v.', meaning: 'Hoàn trả chi phí công tác, bồi hoàn', example: 'The company will reimburse travel expenses within ten business days.', exampleVi: 'Công ty sẽ hoàn trả chi phí đi lại trong vòng mười ngày làm việc.', collocation: 'reimburse expenses', tier: 'Cực Cao' },
                    { word: 'tentative', ipa: '/ˈten.tə.tɪv/', pos: 'adj.', meaning: 'Dự kiến, tạm thời chưa chốt chung cuộc', example: 'We have made a tentative agreement subject to board approval.', exampleVi: 'Chúng tôi đã đạt được thỏa thuận dự kiến chờ hội đồng quản trị phê duyệt.', collocation: 'tentative agreement', tier: 'Cao' },
                    { word: 'unanimous', ipa: '/juːˈnæn.ə.məs/', pos: 'adj.', meaning: 'Nhất trí 100%, đồng lòng toàn thể', example: 'The board gave unanimous approval to the international expansion plan.', exampleVi: 'Hội đồng quản trị đã nhất trí 100% phê duyệt kế hoạch mở rộng quốc tế.', collocation: 'unanimous decision', tier: 'Cực Cao' }
                ]`;
    content = content.slice(0, deckStart) + newDeckCode + content.slice(deckEnd + 2);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully updated index.html with 2-tier header, quick study tools dock, and rich vocab deck!');
