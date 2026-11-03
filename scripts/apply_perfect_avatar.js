const fs = require('fs');

console.log('=== FIXING AVATAR OVERFLOW & DIRECT ACCOUNT NAVIGATION ===');
let html = fs.readFileSync('index.html', 'utf8');

// 1. ADD JAVASCRIPT HANDLER FOR PROFILE TOGGLE AND DIRECT ACCOUNT SWITCH
const profileScript = `
    <script>
        // Điều hướng trực tiếp đến trang Tài khoản cá nhân khi bấm vào Avatar
        window.openUserProfile = function() {
            if (typeof switchTab === 'function') {
                switchTab('tai-khoan');
                if (typeof showToast === 'function') {
                    showToast('👤 Đã mở Hồ sơ & Thiết lập tài khoản');
                }
            } else {
                location.hash = '#tai-khoan';
            }
        };

        window.toggleSanhMemberProfileMenu = function(e) {
            if (e) e.stopPropagation();
            const menu = document.getElementById('sanhMemberProfileMenu');
            if (menu) {
                const isHidden = menu.classList.contains('hidden');
                if (isHidden) {
                    menu.classList.remove('hidden');
                } else {
                    menu.classList.add('hidden');
                }
            } else {
                window.openUserProfile();
            }
        };

        window.closeSanhMemberProfileMenu = function() {
            const menu = document.getElementById('sanhMemberProfileMenu');
            if (menu) menu.classList.add('hidden');
        };

        // Click outside closes profile menu
        document.addEventListener('click', function(e) {
            const menu = document.getElementById('sanhMemberProfileMenu');
            const trigger = document.getElementById('sanhMemberProfileTrigger');
            if (menu && !menu.classList.contains('hidden')) {
                if (trigger && !trigger.contains(e.target) && !menu.contains(e.target)) {
                    menu.classList.add('hidden');
                }
            }
        });
    </script>
`;

if (!html.includes('window.openUserProfile = function')) {
    html = html.replace('</head>', `${profileScript}\n</head>`);
    console.log('✅ Injected openUserProfile and toggleSanhMemberProfileMenu handlers');
}

// 2. UPDATE #sanhTopHeaderBar:
// - Keep right container flex-nowrap WITHOUT overflow-x-auto clipping
// - Make the Avatar button an elegant circular pill that links directly to openUserProfile() / switchTab('tai-khoan')
// - Ensure plenty of breathing room inside the rounded card

const startMarker = '<!-- 1. TOP HEADER BAR: LỜI CHÀO CHUYÊN NGHIỆP & HUY HIỆU (TRẢI DÀI NGANG 1 HÀNG DUY NHẤT) -->';
const endMarker = '<!-- 2. KHỐI 1 (HERO ACTION CARD): BÀI HỌC TIẾP THEO - ĐIỂM NHẤN SỐ 1 -->';

const startIdx = html.indexOf(startMarker);
const endIdx = html.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
    console.error('❌ Could not find markers:', { startIdx, endIdx });
    process.exit(1);
}

const perfectedHeaderHtml = `<!-- 1. TOP HEADER BAR: LỜI CHÀO CHUYÊN NGHIỆP & HUY HIỆU (TRẢI DÀI NGANG 1 HÀNG DUY NHẤT) -->
                <div id="sanhTopHeaderBar" class="header-bar-elevation relative z-30 glass-panel rounded-2xl sm:rounded-3xl p-3 sm:p-4 lg:px-6 lg:py-3 flex flex-row items-center justify-between gap-3 shadow-xs border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
                    <!-- Left: Brand Greeting & Academic Goal -->
                    <div class="flex items-center gap-2.5 sm:gap-3 text-slate-800 dark:text-white shrink-0">
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
                    
                    <!-- Right: Trải dài ngang toàn bộ các nút trên 1 hàng (Single Horizontal Row) -->
                    <div class="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5 flex-nowrap shrink-0">
                        
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
                        <div class="h-5 w-px bg-slate-200 dark:bg-slate-700 shrink-0 hidden sm:block"></div>

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
                        <div class="h-5 w-px bg-slate-200 dark:bg-slate-700 shrink-0 hidden md:block"></div>

                        <!-- Cluster 3: Action, Utilities & Profile -->
                        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
                            <!-- Tour Guide Launcher (Rõ ràng & Không bị đè) -->
                            <button id="btnStartTourGuide" onclick="window.AppTourGuide && window.AppTourGuide.start(true)" class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer shrink-0" title="Hướng dẫn làm quen ứng dụng (Tour Guide)">
                                <i class="fa-solid fa-compass text-sky-600 text-xs"></i>
                                <span>Hướng dẫn</span>
                            </button>

                            <!-- PWA Install Button -->
                            <button id="btnPwaHeaderInstall" onclick="window.triggerPwaInstallPrompt && window.triggerPwaInstallPrompt()" class="px-2.5 sm:px-3 py-1.5 rounded-xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition active:scale-95 cursor-pointer shrink-0" title="Cài đặt PWA 1 Chạm">
                                <i class="fa-solid fa-cloud-arrow-down text-xs"></i>
                                <span>Tải App</span>
                            </button>

                            <!-- Notification Center Bell -->
                            <button onclick="window.toggleNotificationCenter && window.toggleNotificationCenter()" class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition cursor-pointer relative shrink-0" title="Thông báo tiến độ hàng tuần" aria-label="Thông báo tiến độ">
                                <i class="fa-regular fa-bell text-xs"></i>
                                <span id="headerWeeklyReportDot" class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse"></span>
                            </button>

                            <!-- User Profile Avatar Pill & Direct Account Navigation -->
                            <div class="relative shrink-0" id="sanhMemberDropdownWrapper">
                                <button type="button" id="sanhMemberProfileTrigger" onclick="window.openUserProfile ? window.openUserProfile() : switchTab('tai-khoan')" class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center text-xs sm:text-sm font-black shadow-md shadow-purple-500/20 ring-2 ring-purple-500/20 hover:scale-105 active:scale-95 transition cursor-pointer shrink-0" title="Hồ sơ tài khoản cá nhân (Bấm để mở trang Tài khoản)">
                                    <span id="sanhMemberAvatarLetter">H</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                `;

html = html.slice(0, startIdx) + perfectedHeaderHtml + html.slice(endIdx);
fs.writeFileSync('index.html', html, 'utf8');
console.log('✅ Applied perfected header with compact avatar and direct account navigation!');
