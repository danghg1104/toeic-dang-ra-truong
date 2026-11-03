const fs = require('fs');

console.log('=== ACCURATELY REPLACING SANHTOPHEADERBAR WITH SINGLE HORIZONTAL SPREAD ===');
let html = fs.readFileSync('index.html', 'utf8');

const startMarker = '<!-- 1. TOP HEADER BAR: LỜI CHÀO CHUYÊN NGHIỆP & HUY HIỆU -->';
const endMarker = '<!-- 2. KHỐI 1 (HERO ACTION CARD): BÀI HỌC TIẾP THEO - ĐIỂM NHẤN SỐ 1 -->';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
    console.error('❌ Could not find markers:', { startIdx, endIdx });
    process.exit(1);
}

const newHeaderHtml = `<!-- 1. TOP HEADER BAR: LỜI CHÀO CHUYÊN NGHIỆP & HUY HIỆU (TRẢI DÀI NGANG 1 HÀNG DUY NHẤT) -->
                <div id="sanhTopHeaderBar" class="header-bar-elevation relative z-30 glass-panel rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:px-6 lg:py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 shadow-xs border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
                    <!-- Left: Brand Greeting & Academic Goal -->
                    <div class="flex items-center gap-3 text-slate-800 dark:text-white shrink-0">
                        <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-base shrink-0 font-black shadow-md shadow-blue-500/20 ring-4 ring-blue-500/10">
                            <i class="fa-solid fa-graduation-cap"></i>
                        </div>
                        <div class="min-w-0">
                            <h1 class="text-sm sm:text-base font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight truncate">
                                <span id="sanhGreetingPrefix">Chào bạn,</span> <span id="sanhMemberGreetingName" class="text-blue-600 dark:text-blue-400 font-black">Học viên</span>
                            </h1>
                            <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium truncate" id="sanhHeaderSubText">
                                Mục tiêu 600 TOEIC · Không gian học tập cá nhân hóa
                            </p>
                        </div>
                    </div>
                    
                    <!-- Right: Trải dài ngang toàn bộ các nút trên 1 hàng (Single Horizontal Row) -->
                    <div class="flex items-center gap-2 sm:gap-2.5 flex-nowrap overflow-x-auto no-scrollbar py-0.5 shrink-0 max-w-full">
                        
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
                        <div class="h-5 w-px bg-slate-200 dark:bg-slate-700 shrink-0"></div>

                        <!-- Cluster 2: Study Environment Toggles -->
                        <div class="flex items-center gap-1.5 shrink-0">
                            <!-- Editorial Warm Sand Theme Toggle -->
                            <button id="btnEditorialToggle" onclick="window.EditorialThemeManager && window.EditorialThemeManager.toggleEditorial()" class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer shrink-0" title="Chế độ Giấy Tự Nhiên & Mực Trầm (Warm Sand)">
                                <i class="fa-solid fa-scroll text-amber-600 text-xs"></i>
                                <span>Warm Sand</span>
                            </button>

                            <!-- ETS Serif Font Switcher -->
                            <button id="btnFontToggle" onclick="window.EditorialThemeManager && window.EditorialThemeManager.toggleFont()" class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer shrink-0" title="Đổi phông thi ETS Serif / Inter">
                                <i class="fa-solid fa-font text-indigo-600 text-xs"></i>
                                <span class="font-mode-label font-serif">Serif ETS</span>
                            </button>

                            <!-- Pomodoro 25/5 Focus Launcher -->
                            <button id="btnQuickPomodoroLaunch" onclick="window.togglePomodoroHudModal && window.togglePomodoroHudModal()" class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer shrink-0" title="Đồng hồ Pomodoro tùy chỉnh thời gian & Âm nền tập trung">
                                <i class="fa-regular fa-clock text-rose-500 animate-pulse text-xs"></i>
                                <span id="quickPomodoroTimeDisplay">25:00</span>
                            </button>
                        </div>

                        <!-- Divider 2 -->
                        <div class="h-5 w-px bg-slate-200 dark:bg-slate-700 shrink-0"></div>

                        <!-- Cluster 3: Action, Utilities & Profile -->
                        <div class="flex items-center gap-1.5 shrink-0">
                            <!-- Tour Guide Launcher (Rõ ràng & Không bị đè) -->
                            <button id="btnStartTourGuide" onclick="window.AppTourGuide && window.AppTourGuide.start(true)" class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer shrink-0" title="Hướng dẫn làm quen ứng dụng (Tour Guide)">
                                <i class="fa-solid fa-compass text-sky-600 text-xs"></i>
                                <span>Hướng dẫn</span>
                            </button>

                            <!-- PWA Install Button -->
                            <button id="btnPwaHeaderInstall" onclick="window.triggerPwaInstallPrompt && window.triggerPwaInstallPrompt()" class="px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition active:scale-95 cursor-pointer shrink-0" title="Cài đặt PWA 1 Chạm">
                                <i class="fa-solid fa-cloud-arrow-down text-xs"></i>
                                <span>Tải App</span>
                            </button>

                            <!-- Notification Center Bell -->
                            <button onclick="window.toggleNotificationCenter && window.toggleNotificationCenter()" class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition cursor-pointer relative shrink-0" title="Thông báo tiến độ hàng tuần" aria-label="Thông báo tiến độ">
                                <i class="fa-regular fa-bell text-xs"></i>
                                <span id="headerWeeklyReportDot" class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
                            </button>

                            <!-- User Profile Avatar Pill & Dropdown -->
                            <div class="relative shrink-0" id="sanhMemberDropdownWrapper">
                                <button type="button" id="sanhMemberProfileTrigger" onclick="toggleSanhMemberProfileMenu(event)" class="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 flex items-center gap-2 transition active:scale-95 cursor-pointer shadow-2xs">
                                    <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs font-black shadow-2xs">
                                        <span id="sanhMemberAvatarLetter">H</span>
                                    </div>
                                    <div class="text-left hidden sm:block">
                                        <div class="text-xs font-extrabold text-slate-800 dark:text-slate-200 leading-tight" id="sanhMemberAccountName">Huynh Dang</div>
                                        <div class="text-[9px] text-slate-400 font-semibold leading-none">Xem hồ sơ</div>
                                    </div>
                                    <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 hidden sm:block"></i>
                                </button>

                                <!-- Dropdown Menu -->
                                <div id="sanhMemberProfileMenu" class="hidden absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 animate-fadeIn">
                                    <div class="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                                        <p class="text-xs font-bold text-slate-900 dark:text-white" id="sanhMenuFullName">Huynh Dang</p>
                                        <p class="text-[11px] text-slate-400 truncate" id="sanhMenuEmail">student@toididau.edu.vn</p>
                                    </div>
                                    <a href="#tai-khoan" onclick="switchMainTab('tai-khoan'); closeSanhMemberProfileMenu();" class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                        <i class="fa-regular fa-user text-indigo-500"></i>
                                        <span>Hồ sơ & Đổi mục tiêu</span>
                                    </a>
                                    <a href="#cai-dat" onclick="switchMainTab('cai-dat'); closeSanhMemberProfileMenu();" class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                        <i class="fa-solid fa-sliders text-emerald-500"></i>
                                        <span>Cài đặt âm thanh & giao diện</span>
                                    </a>
                                    <button onclick="handleHeaderLogout()" class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition mt-1 border-t border-slate-100 dark:border-slate-800 pt-2">
                                        <i class="fa-solid fa-arrow-right-from-bracket"></i>
                                        <span>Đăng xuất</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                `;

html = html.slice(0, startIdx) + newHeaderHtml + html.slice(endIdx);
fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ Replaced entire #sanhTopHeaderBar successfully!');
