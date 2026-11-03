const fs = require('fs');

console.log('=== APPLYING SPATIOUS HEADER AND TOUR GUIDE FIXES ===');

// 1. Update index.html
let html = fs.readFileSync('index.html', 'utf8');

// Find and replace the whole #sanhTopHeaderBar block
const oldStartTag = '<div id="sanhTopHeaderBar" class="header-bar-elevation';
const oldEndTag = '<!-- Desktop Guest Login Button (Hiện khi là khách / chưa đăng nhập) -->\n                        <button id="sanhGuestLoginBtn" type="button" onclick="openAuthModal(\'login\')" class="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer">\n                            <i class="fa-solid fa-right-to-bracket text-xs"></i>\n                            <span>Đăng nhập</span>\n                        </button>\n                    </div>\n                </div>';

const startIdx = html.indexOf(oldStartTag);
const endIdx = html.indexOf(oldEndTag);

if (startIdx !== -1 && endIdx !== -1) {
    const fullOldBlock = html.substring(startIdx, endIdx + oldEndTag.length);
    
    const newHeaderBlock = `<div id="sanhTopHeaderBar" class="header-bar-elevation relative z-30 glass-panel rounded-3xl p-4 sm:p-5 lg:px-7 lg:py-4.5 flex flex-col xl:flex-row xl:items-center justify-between gap-4 sm:gap-5 shadow-xs border border-slate-200/90 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md">
                    <!-- Left: Brand Greeting & Academic Goal -->
                    <div class="flex items-center gap-3.5 text-slate-800 dark:text-white shrink-0">
                        <div class="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-lg shrink-0 font-black shadow-md shadow-blue-500/20 ring-4 ring-blue-500/10">
                            <i class="fa-solid fa-graduation-cap"></i>
                        </div>
                        <div>
                            <h1 class="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                                <span id="sanhGreetingPrefix">Chào bạn,</span> <span id="sanhMemberGreetingName" class="text-blue-600 dark:text-blue-400 font-black">Học viên</span>
                            </h1>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium flex items-center gap-2" id="sanhHeaderSubText">
                                Không gian học tập cá nhân hóa chuẩn Study Studio
                            </p>
                        </div>
                    </div>
                    
                    <!-- Right: Structured Spacious Clusters -->
                    <div class="flex items-center gap-2.5 sm:gap-3 flex-wrap xl:flex-nowrap justify-start xl:justify-end">
                        
                        <!-- Cluster 1: Learning Badges -->
                        <div class="flex items-center gap-2">
                            <!-- Streak Pill -->
                            <div onclick="window.SoiMayCompanion && window.SoiMayCompanion.celebrateStreak()" class="px-3.5 py-2 rounded-2xl bg-amber-50 dark:bg-slate-800 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs cursor-pointer hover:scale-105 active:scale-95 transition" title="Chuỗi học tập liên tục (Bấm để nhận lời chúc từ Sói Mây)">
                                <i class="fa-solid fa-fire text-amber-500 animate-pulse text-sm"></i>
                                <span id="sanhMemberStreakVal">0 ngày</span>
                            </div>

                            <!-- XP Pill -->
                            <div class="px-3.5 py-2 rounded-2xl bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                                <i class="fa-solid fa-star text-purple-500 text-sm"></i>
                                <span id="sanhMemberXpVal">0 XP</span>
                            </div>
                        </div>

                        <!-- Divider 1 -->
                        <div class="h-6 w-px bg-slate-200 dark:bg-slate-700/80 hidden sm:block"></div>

                        <!-- Cluster 2: Study Environment Toggles -->
                        <div class="flex items-center gap-2">
                            <!-- Editorial Warm Sand Theme Toggle -->
                            <button id="btnEditorialToggle" onclick="window.EditorialThemeManager && window.EditorialThemeManager.toggleEditorial()" class="px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer" title="Chế độ Giấy Tự Nhiên & Mực Trầm (Warm Sand)">
                                <i class="fa-solid fa-scroll text-amber-600"></i>
                                <span>Warm Sand</span>
                            </button>

                            <!-- ETS Serif Font Switcher -->
                            <button id="btnFontToggle" onclick="window.EditorialThemeManager && window.EditorialThemeManager.toggleFont()" class="px-3.5 py-2 rounded-2xl bg-indigo-50 hover:bg-indigo-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer" title="Đổi phông thi ETS Serif / Inter">
                                <i class="fa-solid fa-font text-indigo-600"></i>
                                <span class="font-mode-label font-serif">Serif ETS</span>
                            </button>

                            <!-- Pomodoro 25/5 Focus Launcher -->
                            <button id="btnQuickPomodoroLaunch" onclick="window.togglePomodoroHudModal && window.togglePomodoroHudModal()" class="px-3.5 py-2 rounded-2xl bg-rose-50 hover:bg-rose-100 dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer" title="Đồng hồ Pomodoro tùy chỉnh thời gian & Âm nền tập trung">
                                <i class="fa-regular fa-clock text-rose-500 animate-pulse"></i>
                                <span id="quickPomodoroTimeDisplay">25:00</span>
                            </button>
                        </div>

                        <!-- Divider 2 -->
                        <div class="h-6 w-px bg-slate-200 dark:bg-slate-700/80 hidden md:block"></div>

                        <!-- Cluster 3: Action, Utilities & Profile -->
                        <div class="flex items-center gap-2">
                            <!-- Tour Guide Launcher (Rõ ràng & Không bị đè) -->
                            <button id="btnStartTourGuide" onclick="window.AppTourGuide && window.AppTourGuide.start(true)" class="px-3.5 py-2 rounded-2xl bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer" title="Hướng dẫn làm quen ứng dụng (Tour Guide)">
                                <i class="fa-solid fa-compass text-sky-600 text-sm"></i>
                                <span>Hướng dẫn</span>
                            </button>

                            <!-- PWA Install Button -->
                            <button id="btnPwaHeaderInstall" onclick="window.triggerPwaInstallPrompt && window.triggerPwaInstallPrompt()" class="flex px-4 py-2 rounded-2xl bg-gradient-to-r from-sky-500 via-indigo-600 to-purple-600 hover:from-sky-600 hover:to-indigo-700 text-white text-xs font-extrabold items-center gap-1.5 shadow-md shadow-indigo-500/20 transition active:scale-95 cursor-pointer ring-1 ring-white/20" title="Tải & Cài đặt Ứng dụng Tôi Đi Đâu Đó về màn hình chính">
                                <i class="fa-solid fa-cloud-arrow-down text-xs text-amber-300 animate-bounce"></i>
                                <span class="tracking-tight">Tải App</span>
                            </button>

                            <!-- Notification Bell -->
                            <button onclick="showToast('🔔 Bạn không có thông báo bài tập mới nào!')" class="w-9 h-9 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center transition cursor-pointer shadow-2xs" title="Thông báo">
                                <i class="fa-regular fa-bell text-xs"></i>
                            </button>

                            <!-- User Profile Pill & Dropdown -->
                            <div class="relative z-[70] hidden" id="sanhMemberDropdownWrapper">
                                <button type="button" onclick="toggleMemberProfileDropdown(event)" class="pl-2 pr-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-2xs flex items-center gap-2 hover:border-blue-400 transition text-left cursor-pointer">
                                    <div id="sanhMemberAvatar" class="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center ring-2 ring-blue-300/40">
                                        ?
                                    </div>
                                    <div class="leading-tight">
                                        <div id="sanhMemberProfileName" class="text-xs font-bold text-slate-800 dark:text-slate-200">Học viên</div>
                                        <div class="text-[11px] text-slate-400">Xem hồ sơ</div>
                                    </div>
                                </button>
                                <!-- Dropdown Menu -->
                                <div id="sanhMemberProfileMenu" class="hidden absolute right-0 mt-2.5 w-60 rounded-[22px] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/90 dark:border-slate-700 p-2.5 z-[100] ring-1 ring-slate-900/10 dark:ring-white/10">
                                    <div class="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1">
                                        <div id="sanhMemberDropdownEmail" class="text-xs font-semibold text-slate-600 dark:text-slate-300 truncate">...</div>
                                    </div>
                                    <div class="space-y-0.5">
                                        <button type="button" onclick="openAccountProfileView()" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-[13.5px] font-bold transition text-left cursor-pointer">
                                            <i class="fa-regular fa-user text-blue-600 text-base w-5 text-center"></i>
                                            <span>Tài khoản</span>
                                        </button>
                                        <button type="button" onclick="openAccountSettingsView()" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-[13.5px] font-bold transition text-left cursor-pointer">
                                            <i class="fa-solid fa-gear text-blue-600 text-base w-5 text-center"></i>
                                            <span>Cài đặt</span>
                                        </button>
                                        <button id="sanhMemberLogoutBtn" type="button" onclick="handleLogoutUser()" class="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 text-[13.5px] font-bold transition text-left cursor-pointer">
                                            <i class="fa-solid fa-arrow-right-from-bracket text-rose-600 text-base w-5 text-center"></i>
                                            <span>Đăng xuất</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Desktop Guest Login Button -->
                            <button id="sanhGuestLoginBtn" type="button" onclick="openAuthModal('login')" class="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer">
                                <i class="fa-solid fa-right-to-bracket text-xs"></i>
                                <span>Đăng nhập</span>
                            </button>
                        </div>
                    </div>
                </div>`;

    html = html.replace(fullOldBlock, newHeaderBlock);
    console.log('✅ Successfully replaced #sanhTopHeaderBar with spacious, uncluttered version!');
} else {
    console.warn('⚠️ Could not locate exact boundaries of sanhTopHeaderBar', { startIdx, endIdx });
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('🎉 Tour Guide and Header update completed!');
