const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

console.log('🚀 Đang thực hiện Bước 2: Tái cấu trúc Dashboard chuẩn Study Studio / Quiet Confidence...');

// 1. New HTML for view-hom-nay
const newHomNayHTML = `            <!-- ========================================== -->
            <!-- VIEW 1: HÔM NAY (STUDY STUDIO DASHBOARD)   -->
            <!-- ========================================== -->
            <section id="view-hom-nay" class="space-y-5">

                <!-- 1. TOP HEADER BAR: LỜI CHÀO CHUYÊN NGHIỆP & HUY HIỆU -->
                <div class="glass-panel rounded-2xl px-4 sm:px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-xs border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div class="flex items-center gap-3 text-slate-800 dark:text-white">
                        <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base shrink-0 font-bold border border-blue-100 dark:border-blue-900/40">
                            <i class="fa-solid fa-graduation-cap"></i>
                        </div>
                        <div>
                            <h1 class="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
                                <span id="sanhGreetingPrefix">Chào bạn,</span> <span id="sanhMemberGreetingName" class="text-blue-600 dark:text-blue-400 font-extrabold">Học viên</span>
                            </h1>
                            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5" id="sanhHeaderSubText">
                                Không gian học tập cá nhân hóa chuẩn Study Studio
                            </p>
                        </div>
                    </div>
                    
                    <div class="flex items-center gap-2 sm:gap-2.5 flex-wrap">
                        <!-- Streak Pill -->
                        <div class="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-slate-800 text-amber-700 dark:text-amber-400 border border-amber-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                            <i class="fa-solid fa-fire text-amber-500"></i>
                            <span id="sanhMemberStreakVal">0 ngày</span>
                        </div>

                        <!-- XP Pill -->
                        <div class="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                            <i class="fa-solid fa-star text-purple-500"></i>
                            <span id="sanhMemberXpVal">0 XP</span>
                        </div>

                        <!-- Notification Bell -->
                        <button onclick="showToast('🔔 Bạn không có thông báo bài tập mới nào!')" class="w-8 h-8 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700 flex items-center justify-center transition cursor-pointer" title="Thông báo">
                            <i class="fa-regular fa-bell text-xs"></i>
                        </button>

                        <!-- User Profile Pill & Dropdown (Hiện khi đã đăng nhập) -->
                        <div class="relative z-50 hidden" id="sanhMemberDropdownWrapper">
                            <button type="button" onclick="toggleMemberProfileDropdown(event)" class="pl-1.5 pr-3.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs flex items-center gap-2 hover:border-blue-400 transition text-left cursor-pointer">
                                <div id="sanhMemberAvatar" class="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center ring-2 ring-blue-300/40">
                                    ?
                                </div>
                                <div class="leading-tight">
                                    <div id="sanhMemberProfileName" class="text-xs font-bold text-slate-800 dark:text-slate-200">Học viên</div>
                                    <div class="text-xs text-slate-400">Xem hồ sơ</div>
                                </div>
                            </button>
                            <!-- Dropdown Menu -->
                            <div id="sanhMemberProfileMenu" class="hidden absolute right-0 mt-2.5 w-60 rounded-[20px] bg-white dark:bg-slate-900 shadow-2xl border border-slate-200/90 dark:border-slate-700 p-2.5 z-[100]">
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

                        <!-- Desktop Guest Login Button (Hiện khi là khách / chưa đăng nhập) -->
                        <button id="sanhGuestLoginBtn" type="button" onclick="openAuthModal('login')" class="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer">
                            <i class="fa-solid fa-right-to-bracket text-xs"></i>
                            <span>Đăng nhập</span>
                        </button>
                    </div>
                </div>

                <!-- 2. KHỐI 1 (HERO ACTION CARD): BÀI HỌC TIẾP THEO - ĐIỂM NHẤN SỐ 1 -->
                <div class="relative overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-6 sm:p-7 shadow-sm">
                    <!-- Subtle background tint -->
                    <div class="absolute -right-10 -bottom-10 w-80 h-80 rounded-full bg-blue-50/60 dark:bg-blue-950/20 blur-2xl pointer-events-none"></div>

                    <div class="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <!-- Left Content Area -->
                        <div class="space-y-3 text-center md:text-left flex-1 min-w-0">
                            <!-- Category Badge & Target Tracker -->
                            <div class="flex flex-wrap items-center justify-center md:justify-start gap-2">
                                <span id="heroLessonBadge" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-xs font-extrabold border border-blue-200/60 dark:border-blue-900/50">
                                    <span class="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                    <span id="heroLessonBadgeText">TIẾP TỤC LỘ TRÌNH ETS 2026</span>
                                </span>
                                <span class="text-xs font-semibold text-slate-500 dark:text-slate-400" id="heroTargetTracker">
                                    Mục tiêu <strong class="text-slate-800 dark:text-slate-200" id="memberTargetScore">600</strong> điểm · <span id="memberExamDate">Thi: 20/12/2026</span>
                                    <button onclick="openTargetModal()" class="ml-1 text-slate-400 hover:text-blue-600 transition" title="Đổi mục tiêu"><i class="fa-solid fa-pen-to-square text-[11px]"></i></button>
                                </span>
                            </div>

                            <!-- Main Lesson Headline -->
                            <h2 id="heroLessonTitle" class="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
                                Part 5 — Nhận diện Hậu tố Từ loại & Bẫy liên từ cốt lõi
                            </h2>

                            <!-- Lesson Metadata -->
                            <p id="heroLessonDesc" class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <span class="flex items-center gap-1.5"><i class="fa-regular fa-circle-question text-blue-500"></i> <strong id="heroLessonCount">12 câu trắc nghiệm</strong></span>
                                <span class="text-slate-300 dark:text-slate-700">·</span>
                                <span class="flex items-center gap-1.5"><i class="fa-regular fa-clock text-amber-500"></i> Khoảng <strong id="heroLessonTime">8 phút</strong></span>
                                <span class="text-slate-300 dark:text-slate-700">·</span>
                                <span class="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold"><i class="fa-solid fa-bolt"></i> +25 XP</span>
                            </p>

                            <!-- Single Primary CTA Button (Quiet Confidence Blue) -->
                            <div class="pt-1 flex flex-wrap items-center justify-center md:justify-start gap-3">
                                <button id="heroPrimaryCtaBtn" onclick="window.startHeroNextLesson()" class="px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/30 active:scale-98 transition cursor-pointer">
                                    <i class="fa-solid fa-play text-xs"></i>
                                    <span id="heroPrimaryCtaText">Tiếp tục học ngay (~8 phút)</span>
                                </button>
                                <button onclick="switchTab('lo-trinh')" class="px-4 py-3 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200/80 dark:border-slate-700 transition flex items-center gap-1.5 cursor-pointer">
                                    <span>Xem toàn bộ 6 chặng</span>
                                    <i class="fa-solid fa-arrow-right text-[11px] text-slate-400"></i>
                                </button>
                            </div>
                        </div>

                        <!-- Right Illustration: Rio reading book calmly -->
                        <div class="shrink-0 flex flex-col items-center justify-center">
                            <div class="w-32 h-32 sm:w-36 sm:h-36 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-750 p-2 flex items-center justify-center shadow-xs">
                                <img src="assets/mascot/may_reading.png" alt="Sói Mây Học Thuật" class="max-h-full max-w-full object-contain filter drop-shadow hover:scale-105 transition-transform duration-300">
                            </div>
                            <span class="mt-2 text-[11.5px] font-bold text-slate-500 dark:text-slate-400">Bạn học Sói Mây đồng hành</span>
                        </div>
                    </div>
                </div>

                <!-- 3. KHỐI 2: DẢI TIẾN ĐỘ HÔM NAY (COMPACT 1-ROW DAILY PROGRESS) -->
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 shadow-2xs">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
                        <!-- Stat 1: Thời gian học hôm nay -->
                        <div class="flex items-center gap-3 px-2 pt-2 md:pt-0">
                            <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm shrink-0 font-bold border border-blue-100 dark:border-blue-900/40">
                                <i class="fa-regular fa-clock"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="text-xs text-slate-500 dark:text-slate-400 font-semibold" id="memberStudyTimeSub">Hôm nay đã học</div>
                                <div class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                    <span id="memberStudyTime">16p</span>
                                </div>
                            </div>
                        </div>

                        <!-- Stat 2: Nhiệm vụ hoàn thành -->
                        <div class="flex items-center gap-3 px-2 pt-2 md:pt-0">
                            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-sm shrink-0 font-bold border border-emerald-100 dark:border-emerald-900/40">
                                <i class="fa-solid fa-list-check"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="text-xs text-slate-500 dark:text-slate-400 font-semibold">Nhiệm vụ hôm nay</div>
                                <div class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                    <span id="memberTasksSubtitle">0/5 hoàn thành</span>
                                </div>
                            </div>
                        </div>

                        <!-- Stat 3: Chuỗi học tập Streak -->
                        <div class="flex items-center gap-3 px-2 pt-2 md:pt-0">
                            <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-sm shrink-0 font-bold border border-amber-100 dark:border-amber-900/40">
                                <i class="fa-solid fa-fire text-amber-500"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="text-xs text-slate-500 dark:text-slate-400 font-semibold">Chuỗi liên tục</div>
                                <div class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                    <span id="sanhMemberStreakTitle">Streak 7 ngày</span>
                                </div>
                            </div>
                        </div>

                        <!-- Stat 4: Từ vựng & XP -->
                        <div class="flex items-center gap-3 px-2 pt-2 md:pt-0">
                            <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center text-sm shrink-0 font-bold border border-purple-100 dark:border-purple-900/40">
                                <i class="fa-solid fa-book-bookmark"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="text-xs text-slate-500 dark:text-slate-400 font-semibold" id="memberVocabSub">Từ vựng đã thuộc</div>
                                <div class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                                    <span id="memberVocabCount">0</span> từ <span class="text-xs font-semibold text-slate-400">·</span> <span id="memberAccuracyVal" class="text-xs font-bold text-slate-500">88% đúng</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 4. GRID CHÍNH 2 CỘT: CỘT TRÁI (Nhiệm vụ & Đề xuất) + CỘT PHẢI (Kỹ năng & AI) -->
                <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
                    
                    <!-- CỘT TRÁI: 7 CỘT (Đề xuất thông minh + Danh sách nhiệm vụ) -->
                    <div class="lg:col-span-7 space-y-4">

                        <!-- KHỐI 3: ĐỀ XUẤT CÁ NHÂN HÓA THÔNG MINH -->
                        <div id="smartRecommendationBox" class="rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-blue-50/70 via-white to-indigo-50/50 dark:from-slate-850 dark:to-slate-800 border border-blue-200/70 dark:border-slate-700 shadow-xs space-y-3">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
                                    <i class="fa-solid fa-compass text-blue-600 dark:text-blue-400 text-sm"></i>
                                    <span id="smartRecommendationTitle">Đề xuất cá nhân hóa hôm nay</span>
                                </div>
                                <span class="text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">AI Analyzer</span>
                            </div>
                            <p id="smartRecommendationBody" class="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                                Khảo sát năng lực ban đầu: Làm bài test chẩn đoán 28 câu chuẩn ETS 2026 (25 phút) để AI quét chính xác 6 lỗ hổng kiến thức và mở khóa lộ trình tự động.
                            </p>
                            <div class="pt-1">
                                <button id="smartRecommendationBtn" onclick="window.startSmartRecommendationAction()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition cursor-pointer">
                                    <span id="smartRecommendationBtnText">Bắt đầu bài Test Chẩn đoán (25 phút)</span>
                                    <i class="fa-solid fa-arrow-right text-[11px]"></i>
                                </button>
                            </div>
                        </div>

                        <!-- KHỐI 5: NHIỆM VỤ HÔM NAY (DAILY TASKS CHECKLIST) -->
                        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
                            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 class="text-base font-bold text-slate-900 dark:text-white">Nhiệm vụ hôm nay</h3>
                                    <p class="text-xs text-slate-500 dark:text-slate-400">Hoàn thành mục tiêu nhỏ để duy trì tiến độ vững chắc</p>
                                </div>
                                <span id="memberTasksTotalXp" class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold">+0 XP</span>
                            </div>

                            <!-- Container nhiệm vụ được tự động render bởi DailyTaskManager.render() -->
                            <div id="dailyTasksContainer" class="space-y-2.5 text-xs"></div>
                        </div>

                    </div>

                    <!-- CỘT PHẢI: 5 CỘT (Cân bằng kỹ năng dạng Progress Bar + Trợ lý Sói Mây AI) -->
                    <div class="lg:col-span-5 space-y-4">

                        <!-- KHỐI 4: CÂN BẰNG 4 KỸ NĂNG (SKILL BALANCE PROGRESS BARS) -->
                        <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs space-y-4">
                            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                <div>
                                    <h3 class="text-base font-bold text-slate-900 dark:text-white">Cân bằng 4 kỹ năng</h3>
                                    <p class="text-xs text-slate-500 dark:text-slate-400">Độ hoàn thiện theo ngân hàng câu hỏi chuẩn ETS</p>
                                </div>
                                <button onclick="switchTab('lo-trinh')" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Chi tiết</button>
                            </div>

                            <!-- 4 Thanh Progress Bar ngang trực quan -->
                            <div class="space-y-3.5">
                                <!-- Kỹ năng 1: Luyện Nghe (Listening - Teal #248A8A) -->
                                <div class="space-y-1.5">
                                    <div class="flex items-center justify-between text-xs">
                                        <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                            <i class="fa-solid fa-headphones text-teal-600 dark:text-teal-400"></i>
                                            <span>Luyện Nghe (Listening)</span>
                                        </span>
                                        <div class="flex items-center gap-2">
                                            <span id="skillAccuracyListenPct" class="font-bold text-teal-700 dark:text-teal-300">--%</span>
                                            <span id="skillAccuracyListenCount" class="text-slate-400 text-[11px]">0/2100</span>
                                        </div>
                                    </div>
                                    <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div id="skillAccuracyListenProgress" class="h-full rounded-full bg-[#248A8A] transition-all duration-500" style="width: 0%"></div>
                                    </div>
                                </div>

                                <!-- Kỹ năng 2: Luyện Đọc (Reading - Green #3E8B62) -->
                                <div class="space-y-1.5">
                                    <div class="flex items-center justify-between text-xs">
                                        <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                            <i class="fa-regular fa-file-lines text-emerald-600 dark:text-emerald-400"></i>
                                            <span>Luyện Đọc (Reading)</span>
                                        </span>
                                        <div class="flex items-center gap-2">
                                            <span id="skillAccuracyReadPct" class="font-bold text-emerald-700 dark:text-emerald-300">--%</span>
                                            <span id="skillAccuracyReadCount" class="text-slate-400 text-[11px]">0/2100</span>
                                        </div>
                                    </div>
                                    <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div id="skillAccuracyReadProgress" class="h-full rounded-full bg-[#3E8B62] transition-all duration-500" style="width: 0%"></div>
                                    </div>
                                </div>

                                <!-- Kỹ năng 3: Ngữ pháp trọng tâm (Grammar - Purple #7759C2) -->
                                <div class="space-y-1.5">
                                    <div class="flex items-center justify-between text-xs">
                                        <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                            <i class="fa-solid fa-book-open text-purple-600 dark:text-purple-400"></i>
                                            <span>Ngữ pháp trọng tâm</span>
                                        </span>
                                        <div class="flex items-center gap-2">
                                            <span id="skillAccuracyGrammarPct" class="font-bold text-purple-700 dark:text-purple-300">--%</span>
                                            <span id="skillAccuracyGrammarCount" class="text-slate-400 text-[11px]">0/1500</span>
                                        </div>
                                    </div>
                                    <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div id="skillAccuracyGrammarProgress" class="h-full rounded-full bg-[#7759C2] transition-all duration-500" style="width: 0%"></div>
                                    </div>
                                </div>

                                <!-- Kỹ năng 4: Từ vựng cốt lõi (Vocab - Orange #D97A40) -->
                                <div class="space-y-1.5">
                                    <div class="flex items-center justify-between text-xs">
                                        <span class="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                            <i class="fa-solid fa-spell-check text-amber-600 dark:text-amber-400"></i>
                                            <span>Kho Từ vựng cốt lõi</span>
                                        </span>
                                        <div class="flex items-center gap-2">
                                            <span id="skillAccuracyVocabPct" class="font-bold text-amber-700 dark:text-amber-300">--%</span>
                                            <span id="skillAccuracyVocabCount" class="text-slate-400 text-[11px]">0/4514</span>
                                        </div>
                                    </div>
                                    <div class="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                        <div id="skillAccuracyVocabProgress" class="h-full rounded-full bg-[#D97A40] transition-all duration-500" style="width: 0%"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Hidden dummy circle elements to maintain complete JS backward compatibility without errors -->
                            <div class="hidden">
                                <div id="skillAccuracyGrammarCircle"></div>
                                <div id="skillAccuracyVocabCircle"></div>
                                <div id="skillAccuracyListenCircle"></div>
                                <div id="skillAccuracyReadCircle"></div>
                            </div>
                        </div>

                        <!-- KHỐI TRỢ LÝ SÓI MÂY AI (QUIET STUDIO COMPANION) -->
                        <div class="rounded-2xl p-4 bg-slate-50 dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 shadow-2xs flex items-center gap-3.5">
                            <div class="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-1 shrink-0 shadow-2xs">
                                <img src="assets/mascot/may_reading.png" alt="Sói Mây AI" class="max-h-full max-w-full object-contain">
                            </div>
                            <div class="flex-1 min-w-0">
                                <h4 class="text-xs font-bold text-slate-800 dark:text-slate-200">Gia sư Sói Mây AI</h4>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">Sẵn sàng phân tích bẫy đề & ngữ pháp 24/7</p>
                            </div>
                            <button onclick="openAITutorModal()" class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs transition shrink-0 cursor-pointer">
                                <i class="fa-solid fa-message text-[11px]"></i>
                                <span>Hỏi đáp</span>
                            </button>
                        </div>

                    </div>
                </div>

            </section>`;

// Replace from <section id="view-hom-nay" to </section> before view-lo-trinh
const viewPattern = /<!-- =+ -->\s*<!-- VIEW 1:[\s\S]*?<section id="view-hom-nay"[\s\S]*?<\/section>\s*(?=<!-- VIEW: L)/i;

if (viewPattern.test(content)) {
  content = content.replace(viewPattern, newHomNayHTML + '\n\n            ');
  console.log('✓ Đã thay thế thành công layout view-hom-nay mới!');
} else {
  // Fallback: replace using exact start and end markers
  const startMarker = '<section id="view-hom-nay"';
  const endMarker = '<!-- VIEW: L';
  const sIdx = content.indexOf(startMarker);
  const eIdx = content.indexOf(endMarker, sIdx);
  if (sIdx !== -1 && eIdx !== -1) {
    const prevSectionComment = content.lastIndexOf('<!-- ==========================================', sIdx);
    const replaceFrom = prevSectionComment !== -1 ? prevSectionComment : sIdx;
    content = content.substring(0, replaceFrom) + newHomNayHTML + '\n\n            ' + content.substring(eIdx);
    console.log('✓ Đã thay thế view-hom-nay theo vị trí index!');
  } else {
    console.error('❌ Không tìm thấy điểm thay thế view-hom-nay!');
    process.exit(1);
  }
}

// 2. Add JavaScript logic for Hero & Progress Bars in updateSanhMemberStats
const updateStatsTarget = 'if (window.DailyTaskManager && typeof window.DailyTaskManager.render === \'function\') {';
const newJsEnhancements = `            // Update 4 Horizontal Progress Bars for Skill Balance
            const lProg = document.getElementById('skillAccuracyListenProgress');
            if (lProg) lProg.style.width = \`\${Math.min(100, Math.round((lDone / 2100) * 100))}%\`;
            const rProg = document.getElementById('skillAccuracyReadProgress');
            if (rProg) rProg.style.width = \`\${Math.min(100, Math.round((rDone / 2100) * 100))}%\`;
            const gProg = document.getElementById('skillAccuracyGrammarProgress');
            if (gProg) gProg.style.width = \`\${Math.min(100, Math.round((gAnswered / 1500) * 100))}%\`;
            const vProg = document.getElementById('skillAccuracyVocabProgress');
            if (vProg) vProg.style.width = \`\${Math.min(100, Math.round((vAnswered / 4514) * 100))}%\`;

            if (typeof updateDashboardStudioHero === 'function') {
                updateDashboardStudioHero();
            }

            if (window.DailyTaskManager && typeof window.DailyTaskManager.render === 'function') {`;

if (content.includes(updateStatsTarget)) {
  content = content.replace(updateStatsTarget, newJsEnhancements);
  console.log('✓ Đã tích hợp cập nhật Progress Bar vào updateSanhMemberStats!');
}

// 3. Inject window.updateDashboardStudioHero, window.startHeroNextLesson, window.startSmartRecommendationAction
const heroFunctions = `
        // =========================================================================
        // STUDY STUDIO DASHBOARD HERO & SMART RECOMMENDATION LOGIC (GIAI ĐOẠN 2)
        // =========================================================================
        window.startHeroNextLesson = function() {
            const user = (typeof PersonalizedRoadmapEngine !== 'undefined') ? PersonalizedRoadmapEngine.getActiveUser() : currentUserAccount;
            if (!user || !user.diagnosticResults) {
                if (window.ToeicDiagnosticWorkstation && typeof window.ToeicDiagnosticWorkstation.open === 'function') {
                    window.ToeicDiagnosticWorkstation.open();
                    return;
                }
            }
            if (typeof switchTab === 'function') {
                switchTab('ngu-phap');
            }
        };

        window.startSmartRecommendationAction = function() {
            const user = (typeof PersonalizedRoadmapEngine !== 'undefined') ? PersonalizedRoadmapEngine.getActiveUser() : currentUserAccount;
            if (!user || !user.diagnosticResults) {
                if (window.ToeicDiagnosticWorkstation && typeof window.ToeicDiagnosticWorkstation.open === 'function') {
                    window.ToeicDiagnosticWorkstation.open();
                    return;
                }
            }
            if (typeof switchTab === 'function') {
                switchTab('bay-de-thi');
            }
        };

        window.updateDashboardStudioHero = function() {
            const user = (typeof PersonalizedRoadmapEngine !== 'undefined') ? PersonalizedRoadmapEngine.getActiveUser() : currentUserAccount;
            const hour = new Date().getHours();
            let greeting = 'Chào bạn';
            if (hour >= 4 && hour < 12) greeting = 'Chào buổi sáng';
            else if (hour >= 12 && hour < 18) greeting = 'Chào buổi chiều';
            else greeting = 'Chào buổi tối';

            const prefixEl = document.getElementById('sanhGreetingPrefix');
            if (prefixEl) prefixEl.textContent = \`\${greeting},\`;

            const nameEl = document.getElementById('sanhMemberGreetingName');
            const targetScoreEl = document.getElementById('memberTargetScore');
            const examDateEl = document.getElementById('memberExamDate');
            const subTextEl = document.getElementById('sanhHeaderSubText');

            const titleEl = document.getElementById('heroLessonTitle');
            const badgeText = document.getElementById('heroLessonBadgeText');
            const countEl = document.getElementById('heroLessonCount');
            const timeEl = document.getElementById('heroLessonTime');
            const ctaText = document.getElementById('heroPrimaryCtaText');
            const smartTitle = document.getElementById('smartRecommendationTitle');
            const smartBody = document.getElementById('smartRecommendationBody');
            const smartBtnText = document.getElementById('smartRecommendationBtnText');

            if (user && user.id) {
                const displayName = user.name || user.displayName || 'Huỳnh Đăng';
                if (nameEl) nameEl.textContent = displayName;
                const score = user.targetScore || 600;
                if (targetScoreEl) targetScoreEl.textContent = score;

                let daysRemaining = 52;
                if (typeof PersonalizedRoadmapEngine !== 'undefined' && typeof PersonalizedRoadmapEngine.calculateDaysRemaining === 'function') {
                    daysRemaining = PersonalizedRoadmapEngine.calculateDaysRemaining() || 52;
                }
                if (subTextEl) {
                    subTextEl.textContent = \`Mục tiêu \${score} TOEIC · Còn \${daysRemaining} ngày ôn luyện tập trung\`;
                }

                if (user.diagnosticResults) {
                    if (badgeText) badgeText.textContent = 'BÀI HỌC TIẾP THEO · LỘ TRÌNH ETS 2026';
                    if (titleEl) titleEl.textContent = 'Part 5 — Nhận diện Hậu tố Từ loại & Bẫy liên từ cốt lõi';
                    if (countEl) countEl.innerHTML = '<i class="fa-regular fa-circle-question text-blue-500"></i> <strong>12 câu hỏi trọng tâm</strong>';
                    if (timeEl) timeEl.innerHTML = '<i class="fa-regular fa-clock text-amber-500"></i> Khoảng <strong>8 phút</strong>';
                    if (ctaText) ctaText.textContent = 'Tiếp tục học ngay (~8 phút)';
                    if (smartTitle) smartTitle.textContent = 'Điểm cần cải thiện để tăng 50+ điểm';
                    if (smartBody) smartBody.textContent = 'AI phân tích bạn hay nhầm lẫn giữa tính từ đuôi -ive / -al và danh từ trong Part 5. Luyện nhanh 8 câu bẫy kinh điển để khắc phục.';
                    if (smartBtnText) smartBtnText.textContent = 'Luyện bẫy từ loại Part 5 →';
                } else {
                    if (badgeText) badgeText.textContent = 'KHỞI ĐỘNG · BƯỚC 1 CỦA LỘ TRÌNH';
                    if (titleEl) titleEl.textContent = 'Bài Test Chẩn Đoán 28 Câu Chuẩn ETS 2026 (7 Part)';
                    if (countEl) countEl.innerHTML = '<i class="fa-regular fa-circle-question text-blue-500"></i> <strong>28 câu hỏi đa dạng</strong>';
                    if (timeEl) timeEl.innerHTML = '<i class="fa-regular fa-clock text-amber-500"></i> Khoảng <strong>25 phút</strong>';
                    if (ctaText) ctaText.textContent = 'Bắt đầu Test Chẩn Đoán (25 phút)';
                    if (smartTitle) smartTitle.textContent = 'Khảo sát năng lực ban đầu';
                    if (smartBody) smartBody.textContent = 'Bạn chưa làm bài kiểm tra chẩn đoán năng lực. Hãy làm bài test 28 câu chuẩn ETS để AI quét 6 lỗ hổng kiến thức và mở khóa lộ trình tự động.';
                    if (smartBtnText) smartBtnText.textContent = 'Làm bài kiểm tra đầu vào (25 phút) →';
                }
            } else {
                if (subTextEl) subTextEl.textContent = 'Đăng nhập để lưu tiến độ và cá nhân hóa lộ trình ETS 2026';
            }
        };
`;

// Insert heroFunctions right before window.DailyTaskManager = DailyTaskManager;
const injectTarget = 'window.DailyTaskManager = DailyTaskManager;';
if (content.includes(injectTarget) && !content.includes('window.updateDashboardStudioHero =')) {
  content = content.replace(injectTarget, heroFunctions + '\n        ' + injectTarget);
  console.log('✓ Đã tích hợp hàm điều khiển Hero và Đề xuất thông minh vào index.html!');
}

fs.writeFileSync(indexPath, content, 'utf8');
console.log('✓ Đã lưu file index.html thành công!');
