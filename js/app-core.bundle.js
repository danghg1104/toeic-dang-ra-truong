        // Application State
        let currentUserAccount = null;
        const state = {
            currentTab: 'hom-nay',
            xp: 0,
            streak: 0,
            vocabLearned: 0,
            grammarDone: 0,
            listenDone: 0,
            readDone: 0,
            dictationDone: 0,
            studyMinutes: 0,
            correctAnswers: 0,
            totalAnswers: 0,
            sidebarCollapsed: false
        };
        window.state = state;

        // Mascot Mây Engine (Đồng bộ từng chuyên mục theo yêu cầu học viên)
        function getOwlSVG(variant = 'wave') {
            if (variant === 'listening') {
                return `
                <div class="relative w-full h-full flex flex-col items-center justify-center select-none group">
                    <img src="/assets/mascot/may_listening.png" alt="Mascot Sói Mây" class="max-w-full max-h-full object-contain filter drop-shadow hover:scale-105 transition-transform duration-300">
                    <span class="absolute -bottom-1 px-2.5 py-0.5 rounded-full bg-teal-900/90 text-teal-200 text-xs font-black tracking-wider uppercase shadow-xs ring-1 ring-teal-400/40">LISTENING</span>
                </div>`;
            } else if (variant === 'reading') {
                return `
                <div class="relative w-full h-full flex flex-col items-center justify-center select-none group">
                    <img src="/assets/mascot/may_reading.png" alt="Mascot Sói Mây" class="max-w-full max-h-full object-contain filter drop-shadow hover:scale-105 transition-transform duration-300">
                    <span class="absolute -bottom-1 px-2.5 py-0.5 rounded-full bg-sky-900/90 text-sky-200 text-xs font-black tracking-wider uppercase shadow-xs ring-1 ring-sky-400/40">READING</span>
                </div>`;
            } else if (variant === 'mock') {
                return `
                <div class="relative w-full h-full flex flex-col items-center justify-center select-none group">
                    <img src="/assets/mascot/may_explorer.png" alt="Mascot Sói Mây" class="max-w-full max-h-full object-contain filter drop-shadow hover:scale-105 transition-transform duration-300">
                    <span class="absolute -bottom-1 px-2.5 py-0.5 rounded-full bg-lime-950/90 text-lime-300 text-xs font-black tracking-wider uppercase shadow-xs ring-1 ring-lime-400/40">MOCK ETS 2026</span>
                </div>`;
            }

            return `
            <div class="relative w-full h-full flex flex-col items-center justify-center select-none pointer-events-none group">
                <img src="/assets/mascot/may_reading.png" alt="Mascot Mây" class="max-w-full max-h-full object-contain filter drop-shadow hover:scale-105 transition-transform duration-300">
            </div>`;
        }

        // Initialize Mascots on Load (Null-safe for all views)
        function renderAllMascots() {
            if (window.LandingMascotEngine) {
                const heroEl = document.getElementById('landingHeroOwl');
                if (heroEl) heroEl.innerHTML = window.LandingMascotEngine.getOwlMascotSVG('hero');
                const trophyEl = document.getElementById('landingTrophyOwl');
                if (trophyEl) trophyEl.innerHTML = window.LandingMascotEngine.getOwlMascotSVG('trophy');
            }
            const mascotTargets = [
                { id: 'sidebarOwlContainer', variant: 'wave' },
                { id: 'dashboardCatMascotContainer', variant: 'wave' },
                { id: 'dashboardBigOwl', variant: 'book' },
                { id: 'grammarHeroOwl', variant: 'grammar' },
                { id: 'listeningHeroOwl', variant: 'listening' },
                { id: 'readingHeroOwl', variant: 'reading' },
                { id: 'mockHeroOwl', variant: 'mock' },
                { id: 'dictationHeroOwl', variant: 'listening' }
            ];
            mascotTargets.forEach(({ id, variant }) => {
                const el = document.getElementById(id);
                if (el) {
                    el.innerHTML = getOwlSVG(variant);
                }
            });
        }

        // Tab Navigation Config
        const tabConfig = {
            'hom-nay': {
                activeClass: 'nav-active-home',
                mascotText: 'Tôi Đi Đâu Đó chinh phục tiếng Anh mỗi ngày!',
                feedbackText: 'Mở nhanh Sổ Take Note',
                owlVariant: 'wave'
            },
            'lo-trinh': {
                activeClass: 'nav-active-roadmap',
                mascotText: 'Lộ trình cá nhân bám sát ngày thi & điểm số!',
                feedbackText: 'Ghi chú mục tiêu thi',
                owlVariant: 'wave'
            },
            'ngu-phap': {
                activeClass: 'nav-active-grammar',
                mascotText: 'Tôi Đi Đâu Đó chinh phục ngữ pháp & PassToeic!',
                feedbackText: 'Ghi chú công thức ngay',
                owlVariant: 'grammar'
            },
            'grammar-theory': {
                activeClass: 'nav-active-grammar',
                mascotText: 'Nắm chắc bản chất & chiến thuật ngữ pháp!',
                feedbackText: 'Ghi chú công thức ngay',
                owlVariant: 'grammar',
                navTarget: 'ngu-phap'
            },
            'grammar-practice': {
                activeClass: 'nav-active-grammar',
                mascotText: 'Thực chiến 2 cột bóc tách tư duy 3 bước!',
                feedbackText: 'Ghi chú bẫy ngữ pháp',
                owlVariant: 'grammar',
                navTarget: 'ngu-phap'
            },
            'tu-vung': {
                activeClass: 'nav-active-vocab',
                mascotText: 'Tôi Đi Đâu Đó học từ mới mỗi ngày nhé!',
                feedbackText: 'Lưu từ vào Sổ Take Note',
                owlVariant: 'book'
            },
            'vocabulary-study': {
                activeClass: 'nav-active-vocab',
                mascotText: 'Học sâu 5 chế độ từ vựng chuẩn EdTech!',
                feedbackText: 'Lưu từ vào Sổ Take Note',
                owlVariant: 'book',
                navTarget: 'tu-vung'
            },
            'vocabulary-match': {
                activeClass: 'nav-active-vocab',
                mascotText: 'Đấu trường Ghép cụm từ & Collocation TOEIC!',
                feedbackText: 'Ghi chú cụm từ hay',
                owlVariant: 'book',
                navTarget: 'tu-vung'
            },
            'tu-dien': {
                activeClass: 'nav-active-dict',
                mascotText: 'Tra cứu từ điển, họ từ & collocations chuẩn TOEIC!',
                feedbackText: 'Lưu từ vào Sổ Take Note',
                owlVariant: 'book'
            },
            'nghe': {
                activeClass: 'nav-active-listen',
                mascotText: 'Tôi Đi Đâu Đó luyện nghe đều mỗi ngày!',
                feedbackText: 'Ghi chú mẹo nghe',
                owlVariant: 'listening'
            },
            'doc': {
                activeClass: 'nav-active-read',
                mascotText: 'Tôi Đi Đâu Đó đọc hiểu tốt hơn mỗi ngày!',
                feedbackText: 'Ghi chú từ vựng bài đọc',
                owlVariant: 'reading'
            },
            'thi-thu': {
                activeClass: 'nav-active-mock',
                mascotText: 'Tôi Đi Đâu Đó giữ phong độ trước ngày thi!',
                feedbackText: 'Ghi chú lỗi sai đề thi',
                owlVariant: 'mock'
            },
            'bay-de-thi': {
                activeClass: 'nav-active-traps',
                mascotText: 'Nắm chắc bẫy đề thi kinh điển 2023 - 2027!',
                feedbackText: 'Ghi chú bẫy hay sai',
                owlVariant: 'mock'
            },
            'hoc-tu-vung': {
                activeClass: 'nav-active-vocab-game',
                mascotText: 'Luyện gõ từ vựng & nghe phát âm cùng Sói Mây!',
                feedbackText: 'Mở Sổ Take Note',
                owlVariant: 'book'
            },
            'pvp-arena': {
                activeClass: 'nav-active-vocab-game',
                mascotText: 'Đấu trường từ vựng PvP 1v1 trực tiếp thời gian thực 60 giây!',
                feedbackText: 'Mở Sổ Take Note',
                owlVariant: 'book',
                navTarget: 'pvp'
            },
            'boc-bang-audio': {
                activeClass: 'nav-active-listen',
                mascotText: 'Bóc băng file nghe tự động, dịch song ngữ & phân tích đáp án TOEIC!',
                feedbackText: 'Mở Sổ Take Note',
                owlVariant: 'listening'
            },
            'nghe-chinh-ta': {
                activeClass: 'nav-active-dictation',
                mascotText: 'Nghe chép chính tả DailyDictation siêu nhạy!',
                feedbackText: 'Mở Sổ Take Note',
                owlVariant: 'listening'
            },
            'tu-vung-phim': {
                activeClass: 'nav-active-youglish',
                mascotText: 'Học phát âm qua phim ảnh cùng YouGlish!',
                feedbackText: 'Mở Sổ Take Note',
                owlVariant: 'wave'
            },
            'take-note': {
                activeClass: 'nav-active-note',
                mascotText: 'Ghi chép cẩn thận giúp nhớ lâu gấp 3 lần!',
                feedbackText: 'Đang mở Sổ Take Note',
                owlVariant: 'book'
            },
            'tai-khoan': {
                activeClass: 'nav-active-home',
                mascotText: 'Cập nhật hồ sơ & mục tiêu điểm số của bạn!',
                feedbackText: 'Mở nhanh Sổ Take Note',
                owlVariant: 'wave'
            },
            'cai-dat': {
                activeClass: 'nav-active-home',
                mascotText: 'Tùy chỉnh giao diện và bảo mật tài khoản!',
                feedbackText: 'Mở nhanh Sổ Take Note',
                owlVariant: 'wave'
            }
        };

        // Điều khiển Mobile Quick Action Sheet (Khay luyện nhanh 1 chạm ngón cái)
        function openMobileQuickActionSheet() {
            const sheet = document.getElementById('mobileQuickActionSheet');
            if (sheet) {
                sheet.classList.remove('hidden');
                sheet.classList.add('flex');
            }
        }
        function closeMobileQuickActionSheet(e) {
            const sheet = document.getElementById('mobileQuickActionSheet');
            if (sheet) {
                sheet.classList.remove('flex');
                sheet.classList.add('hidden');
            }
        }
        window.openMobileQuickActionSheet = openMobileQuickActionSheet;
        window.closeMobileQuickActionSheet = closeMobileQuickActionSheet;

        function switchTab(tabId) {
            // Tự động đóng menu thanh bên trên mobile khi chuyển tab
            if (typeof window !== 'undefined' && window.innerWidth < 1024 && typeof toggleSidebar === 'function') {
                try { toggleSidebar(false); } catch(e) {}
            }
            // Đảm bảo lấy tài khoản người dùng đang hoạt động nếu có phiên lưu trữ
            if (!currentUserAccount) {
                if (typeof window.getCurrentUser === 'function') {
                    currentUserAccount = window.getCurrentUser();
                } else if (window.currentUserAccount) {
                    currentUserAccount = window.currentUserAccount;
                }
            }
            if (!currentUserAccount) {
                try {
                    const saved = localStorage.getItem('cung_dang_session_user');
                    if (saved) currentUserAccount = JSON.parse(saved);
                } catch(e) {}
            }

            // Cho phép khách tự do trải nghiệm học tập, chỉ yêu cầu đăng nhập khi vào quản lý tài khoản cá nhân
            if (!currentUserAccount && tabId === 'tai-khoan') {
                openAuthModal('login');
                showToast('🔒 Vui lòng đăng nhập để xem và quản lý tài khoản!');
                return;
            }

            state.currentTab = tabId;

            // Prefetch dữ liệu ngân hàng đề khi chuyển sang tab Luyện Đọc
            if (tabId === 'doc' && window.ToeicReadingWorkstation && !window.ReadingPracticeDatabase) {
                window.ToeicReadingWorkstation.ensureReadingDatabase(true);
            }

            const allTabs = Object.keys(tabConfig);

            allTabs.forEach(id => {
                const sectionEl = document.getElementById(`view-${id}`);
                const navEl = document.getElementById(`nav-${id}`);
                if (sectionEl) {
                    if (id === tabId) {
                        sectionEl.classList.remove('hidden');
                    } else {
                        sectionEl.classList.add('hidden');
                    }
                }
                if (navEl) {
                    navEl.classList.remove(
                        'nav-active-home',
                        'nav-active-roadmap',
                        'nav-active-grammar',
                        'nav-active-vocab',
                        'nav-active-dict',
                        'nav-active-listen',
                        'nav-active-read',
                        'nav-active-mock',
                        'nav-active-traps',
                        'nav-active-dictation',
                        'nav-active-vocab-game',
                        'nav-active-youglish',
                        'nav-active-note'
                    );
                    if (id === tabId) {
                        navEl.classList.add(tabConfig[id].activeClass);
                    }
                }
            });

            // Đảm bảo highlight đúng nav item khi ở các trang con (như grammar-theory, grammar-practice)
            const targetNavId = (tabConfig[tabId] && tabConfig[tabId].navTarget) ? tabConfig[tabId].navTarget : tabId;
            const activeNavEl = document.getElementById(`nav-${targetNavId}`);
            if (activeNavEl && tabConfig[tabId]) {
                activeNavEl.classList.add(tabConfig[tabId].activeClass);
            }

            // Kích hoạt render views ngữ pháp chuyên sâu nếu cần
            if (tabId === 'grammar-theory' && window.GrammarEngine) {
                GrammarEngine.showTheoryView(false);
            }
            if (tabId === 'grammar-practice' && window.GrammarEngine) {
                GrammarEngine.showPracticeView(false);
            }

            // Kích hoạt render views từ vựng chuyên sâu nếu cần
            if (tabId === 'vocabulary-study' && window.VocabularyEngine) {
                VocabularyEngine.showStudyView(VocabularyEngine.currentTopicSlug || 'contracts', 0, false);
            }
            if (tabId === 'vocabulary-match' && window.VocabularyEngine) {
                VocabularyEngine.showMatchView(false);
            }

            // Trigger initialization for views on demand
            if (tabId === 'tu-vung') {
                if (typeof renderAllVocabGroups === 'function') renderAllVocabGroups();
                if (typeof renderLearnedVocabList === 'function') renderLearnedVocabList();
                if (typeof renderSavedVocabList === 'function') renderSavedVocabList();
            }
            if (tabId === 'ngu-phap') {
                if (typeof renderAllGrammarGroups === 'function') renderAllGrammarGroups();
            }
            if (tabId === 'lo-trinh' && window.PersonalizedRoadmapEngine) {
                PersonalizedRoadmapEngine.renderRoadmapView();
            }
            if (tabId === 'bay-de-thi' && window.TOEICTrapsEngine) {
                TOEICTrapsEngine.init();
            }
            if (tabId === 'hoc-tu-vung' && window.VocabGameWorkstation) {
                window.VocabGameWorkstation.renderInto('view-hoc-tu-vung');
            }
            if (tabId === 'pvp-arena' && window.PvPArenaClient) {
                if (typeof window.PvPArenaClient.renderInto === 'function') {
                    window.PvPArenaClient.renderInto('pvpArenaInlineContainer');
                }
            }
            if (tabId === 'nghe' && window.ListeningDashboard) {
                ListeningDashboard.renderStats();
            }
            if (tabId === 'boc-bang-audio') {
                if (window.ToeicBocBangStation && window.ToeicBocBangStation.instance) {
                    window.ToeicBocBangStation.instance.renderInto('view-boc-bang-audio');
                }
            }
            if (tabId === 'nghe-chinh-ta' || tabId === 'luyen-nghe-chinh-ta') {
                if (window._currentDictationSubMode === 'youtube') {
                    window.switchDictationSubMode('youtube');
                } else {
                    window.switchDictationSubMode('toeic');
                }
            }
            if (tabId === 'take-note' || tabId === 'so-take-note') {
                if (typeof renderTakeNoteSidebarList === 'function') renderTakeNoteSidebarList();
                if (typeof loadActiveTakeNoteIntoEditor === 'function') loadActiveTakeNoteIntoEditor();
                if (window.TakeNoteHybridEditor) {
                    window.TakeNoteHybridEditor.init();
                    window.TakeNoteHybridEditor.updateBreadcrumbs();
                }
            }
            if (tabId === 'tu-dien') {
                if (typeof initDictionaryView === 'function') initDictionaryView();
            }
            if (tabId === 'cai-dat') {
                if (typeof initBocBangSettingsGlobalUI === 'function') initBocBangSettingsGlobalUI();
            }
            if (tabId === 'tai-khoan') {
                if (window.StreakReminderEngine) {
                    const c = document.getElementById('streakReminderContainer');
                    if (c) window.StreakReminderEngine.renderSettingsCard(c);
                }
            }

            // Đồng bộ trạng thái sáng đèn trên Thanh điều hướng đáy Điện thoại (Mobile Bottom Nav 2.0 Thumb Zone)
            document.querySelectorAll('.mob-nav-item').forEach(btn => {
                btn.className = 'mob-nav-item flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 dark:text-slate-400 font-medium transition active:scale-90';
            });
            let targetMobId = 'mob-nav-hom-nay';
            if (tabId === 'hom-nay') targetMobId = 'mob-nav-hom-nay';
            else if (tabId === 'lo-trinh') targetMobId = 'mob-nav-lo-trinh';
            else if (tabId === 'tu-vung' || tabId === 'hoc-tu-vung' || tabId === 'vocabulary-study' || tabId === 'vocabulary-match' || tabId === 'tu-dien') targetMobId = 'mob-nav-tu-vung';
            else if (tabId === 'tai-khoan' || tabId === 'cai-dat') targetMobId = 'mob-nav-tai-khoan';

            const activeMobBtn = document.getElementById(targetMobId);
            if (activeMobBtn) {
                activeMobBtn.className = 'mob-nav-item flex-1 flex flex-col items-center justify-center py-1 rounded-xl text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-slate-800 font-bold transition active:scale-90';
            }

            // Update sidebar companion card text & Image 4 cat mascot pose
            const cfg = tabConfig[tabId];
            if (cfg) {
                const mascotTextEl = document.getElementById('sidebarMascotText');
                const feedbackBtnTextEl = document.getElementById('sidebarFeedbackBtnText');
                const owlContainerEl = document.getElementById('sidebarOwlContainer');
                if (mascotTextEl) mascotTextEl.textContent = cfg.mascotText;
                if (feedbackBtnTextEl) feedbackBtnTextEl.textContent = cfg.feedbackText;
                if (owlContainerEl) owlContainerEl.innerHTML = getOwlSVG(cfg.owlVariant);
            }

            // Tự động điều khiển hiển thị Sảnh 1 vs Sảnh 2 và Thanh học tập
            updateSanhAndSidebarVisibility();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        window.switchTab = switchTab;

        // BỘ ĐIỀU HƯỚNG SUB-MODE CHO TRẠM LUYỆN NGHE CHÉP CHÍNH TẢ (TOEIC VS YOUTUBE VOCATYPE)
        window._currentDictationSubMode = 'toeic';
        window.switchDictationSubMode = function(mode = 'toeic') {
            window._currentDictationSubMode = mode;
            const btnToeic = document.getElementById('btnTabDictationToeic');
            const btnYt = document.getElementById('btnTabDictationYoutube');
            const viewToeic = document.getElementById('subViewDictationToeic');
            const viewYt = document.getElementById('subViewDictationYoutube');

            if (mode === 'youtube') {
                if (btnToeic) {
                    btnToeic.className = 'flex-1 py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer';
                }
                if (btnYt) {
                    btnYt.className = 'flex-1 py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-indigo-600 text-white shadow-xs cursor-pointer';
                }
                if (viewToeic) viewToeic.classList.add('hidden');
                if (viewYt) viewYt.classList.remove('hidden');

                if (window.YouTubeDictationWorkstation) {
                    window.YouTubeDictationWorkstation.renderInto('youtubeDictationContainer');
                }
            } else {
                if (btnToeic) {
                    btnToeic.className = 'flex-1 py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 bg-indigo-600 text-white shadow-xs cursor-pointer';
                }
                if (btnYt) {
                    btnYt.className = 'flex-1 py-2 px-3 rounded-xl font-extrabold text-xs transition flex items-center justify-center gap-2 text-slate-600 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-700 cursor-pointer';
                }
                if (viewToeic) viewToeic.classList.remove('hidden');
                if (viewYt) viewYt.classList.add('hidden');

                if (window.DailyDictationWorkstation) {
                    window.DailyDictationWorkstation.renderInto('dailyDictationContainer');
                }
            }
        };

        window.openYouTubeDictationSong = function(songId = 'heather-conan-gray') {
            switchTab('nghe-chinh-ta');
            window.switchDictationSubMode('youtube');
            if (window.YouTubeDictationWorkstation) {
                window.YouTubeDictationWorkstation.startSong(songId);
            }
        };

        // =========================================================================
        // PHÂN BIỆT 2 SẢNH VÀ ĐIỀU KHIỂN THANH HỌC TẬP (SIDEBAR)
        // Sảnh 1 (Trước đăng nhập): Thanh trên cùng hiện nút "Đăng nhập" thay avatar
        // Sảnh 2 (Khi đăng nhập): Hiện avatar và menu tài khoản thành viên
        // =========================================================================
        function updateSanhAndSidebarVisibility(forceIsMember) {
            const isMember = (typeof forceIsMember === 'boolean') ? forceIsMember : !!currentUserAccount;
            const sanhMember = document.getElementById('sanh-member');
            const sidebar = document.getElementById('sidebarContainer');
            const mobileBottomNav = document.getElementById('mobileBottomNav');
            const mobileTopAvatar = document.getElementById('mobileTopAvatar');
            const mobileUnauthBtn = document.getElementById('mobileUnauthLoginBtn');
            const sanhGuestLoginBtn = document.getElementById('sanhGuestLoginBtn');
            const sanhDropdownWrapper = document.getElementById('sanhMemberDropdownWrapper');

            if (sanhMember) sanhMember.classList.remove('hidden');
            if (sidebar) {
                sidebar.classList.remove('hidden');
                sidebar.style.display = '';
                if (window.innerWidth >= 1024) {
                    if (!sidebarOpen) {
                        sidebar.classList.add('sb-collapsed');
                    } else {
                        sidebar.classList.remove('sb-collapsed');
                    }
                }
            }
            if (mobileBottomNav) mobileBottomNav.classList.remove('hidden');

            if (isMember) {
                if (mobileTopAvatar) mobileTopAvatar.classList.remove('hidden');
                if (mobileUnauthBtn) mobileUnauthBtn.classList.add('hidden');
                if (sanhGuestLoginBtn) {
                    sanhGuestLoginBtn.classList.add('hidden');
                    sanhGuestLoginBtn.classList.remove('inline-flex');
                }
                if (sanhDropdownWrapper) sanhDropdownWrapper.classList.remove('hidden');
            } else {
                if (mobileTopAvatar) mobileTopAvatar.classList.add('hidden');
                if (mobileUnauthBtn) mobileUnauthBtn.classList.remove('hidden');
                if (sanhGuestLoginBtn) {
                    sanhGuestLoginBtn.classList.remove('hidden');
                    sanhGuestLoginBtn.classList.add('inline-flex');
                }
                if (sanhDropdownWrapper) sanhDropdownWrapper.classList.add('hidden');
            }

            const sanhLogoutBtn = document.getElementById('sanhMemberLogoutBtn');
            if (sanhLogoutBtn) sanhLogoutBtn.classList.toggle('hidden', !isMember);

            const mobLogoutBtn = document.getElementById('mobileLogoutBtn');
            const mobLoginBtn = document.getElementById('mobileLoginBtn');
            if (mobLogoutBtn) mobLogoutBtn.classList.toggle('hidden', !isMember);
            if (mobLoginBtn) mobLoginBtn.classList.toggle('hidden', isMember);
        }
        window.updateSanhAndSidebarVisibility = updateSanhAndSidebarVisibility;

        function loginAsDemoAccount() {
            openAuthModal('login');
        }
        window.loginAsDemoAccount = loginAsDemoAccount;

        // =========================================================================
        // THANH ĐIỀU HƯỚNG BÊN TRÁI (SIDEBAR TOGGLE & STATE MANAGEMENT)
        // =========================================================================
        let sidebarOpen = true;

        function applySidebarState(animate = true) {
            const aside = document.getElementById('sidebarContainer');
            const main = document.querySelector('main');
            const reopenBtn = document.getElementById('sidebarReopenBtn');
            const collapseBtn = document.getElementById('sidebarCollapseBtn');
            const backdrop = document.getElementById('mobileDrawerBackdrop');
            if (!aside) return;

            const isDesktop = window.innerWidth >= 1024;

            if (isDesktop) {
                // Đảm bảo không khóa cuộn hay giữ backdrop trên Desktop
                if (backdrop) backdrop.classList.add('hidden');
                document.body.classList.remove('overflow-hidden');

                if (sidebarOpen) {
                    aside.classList.remove('sb-collapsed');
                    aside.removeAttribute('inert');
                    if (main) main.classList.remove('sb-main-collapsed');
                    if (reopenBtn) {
                        reopenBtn.classList.add('hidden');
                        reopenBtn.style.display = 'none';
                    }
                    if (collapseBtn) {
                        collapseBtn.style.display = 'flex';
                        collapseBtn.setAttribute('aria-expanded', 'true');
                        collapseBtn.setAttribute('aria-label', 'Thu gọn thanh bên');
                    }
                } else {
                    aside.classList.add('sb-collapsed');
                    aside.setAttribute('inert', '');
                    if (main) main.classList.add('sb-main-collapsed');
                    if (reopenBtn) {
                        reopenBtn.classList.remove('hidden');
                        reopenBtn.style.display = 'flex';
                        reopenBtn.setAttribute('aria-expanded', 'false');
                        reopenBtn.setAttribute('aria-label', 'Mở thanh bên');
                    }
                    if (collapseBtn) {
                        collapseBtn.style.display = 'none';
                        collapseBtn.setAttribute('aria-expanded', 'false');
                        collapseBtn.setAttribute('aria-label', 'Thu gọn thanh bên');
                    }
                }

                // Phát sự kiện resize sau chuyển động (220ms) để biểu đồ/lưới tính lại kích thước
                if (animate) {
                    setTimeout(() => {
                        window.dispatchEvent(new Event('resize'));
                    }, 230);
                } else {
                    window.dispatchEvent(new Event('resize'));
                }
            } else {
                // Di động & Máy tính bảng (< 1024px)
                if (main) main.classList.remove('sb-main-collapsed');
                aside.classList.remove('sb-collapsed');

                if (sidebarOpen) {
                    aside.classList.remove('-translate-x-full');
                    aside.removeAttribute('inert');
                    if (backdrop) backdrop.classList.remove('hidden');
                    document.body.classList.add('overflow-hidden'); // Khóa cuộn nền CHỈ khi ngăn kéo đang mở
                    if (reopenBtn) {
                        reopenBtn.classList.add('hidden');
                        reopenBtn.style.display = 'none';
                    }
                    const floatingDock = document.getElementById('soiMayFloatingDock');
                    if (floatingDock) floatingDock.classList.add('hidden');
                    if (collapseBtn) collapseBtn.setAttribute('aria-expanded', 'true');
                } else {
                    aside.classList.add('-translate-x-full');
                    aside.setAttribute('inert', '');
                    if (backdrop) backdrop.classList.add('hidden');
                    document.body.classList.remove('overflow-hidden'); // Mở khóa cuộn nền khi đóng
                    if (reopenBtn) {
                        reopenBtn.classList.add('hidden');
                        reopenBtn.style.display = 'none';
                    }
                    const floatingDock = document.getElementById('soiMayFloatingDock');
                    if (floatingDock) floatingDock.classList.remove('hidden');
                    if (collapseBtn) collapseBtn.setAttribute('aria-expanded', 'false');
                }
            }
        }

        function toggleSidebar(forceState) {
            if (typeof forceState === 'boolean') {
                sidebarOpen = forceState;
            } else {
                sidebarOpen = !sidebarOpen;
            }

            const isDesktop = window.innerWidth >= 1024;
            if (isDesktop) {
                try {
                    localStorage.setItem('ui:sidebar', sidebarOpen ? 'open' : 'closed');
                } catch (e) {}
            }

            applySidebarState(true);
        }

        // Tương thích ngược với các lệnh gọi cũ
        function toggleSidebarCollapse() {
            toggleSidebar();
        }
        function toggleMobileSidebar(forceClose = false) {
            if (forceClose) {
                toggleSidebar(false);
            } else {
                toggleSidebar(!sidebarOpen);
            }
        }

        window.toggleSidebar = toggleSidebar;
        window.toggleSidebarCollapse = toggleSidebarCollapse;
        window.toggleMobileSidebar = toggleMobileSidebar;

        // Khởi tạo trạng thái thanh bên khi tải trang
        function initSidebarState() {
            try {
                const isDesktop = window.innerWidth >= 1024;
                if (isDesktop) {
                    // Dọn dẹp một lần giá trị 'closed' cũ bị lưu nhầm bởi bug tự động đóng
                    if (!localStorage.getItem('ui:sidebar_manual_v2')) {
                        localStorage.removeItem('ui:sidebar');
                        localStorage.setItem('ui:sidebar_manual_v2', 'true');
                    }
                    const saved = localStorage.getItem('ui:sidebar');
                    if (saved === 'closed') {
                        sidebarOpen = false;
                    } else {
                        sidebarOpen = true; // Mặc định luôn mở cố định trên desktop
                    }
                } else {
                    sidebarOpen = false; // Mặc định thu gọn trên điện thoại
                }
            } catch (e) {
                sidebarOpen = true;
            }
            document.documentElement.classList.remove('sb-preload-collapsed');
            applySidebarState(false);
        }

        // Lắng nghe phím Esc để đóng ngăn kéo trên điện thoại
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' || e.key === 'Esc') {
                if (window.innerWidth < 1024 && sidebarOpen) {
                    toggleSidebar(false);
                }
            }
        });

        // Tự động điều chỉnh khi thay đổi kích thước cửa sổ qua ngưỡng breakpoint
        let lastSidebarWasDesktop = window.innerWidth >= 1024;
        window.addEventListener('resize', function() {
            const isDesktop = window.innerWidth >= 1024;
            if (isDesktop !== lastSidebarWasDesktop) {
                lastSidebarWasDesktop = isDesktop;
                initSidebarState();
            }
        // [BUG-028] Đóng ngăn kéo sidebar trên mobile khi bấm ra ngoài khoảng trống (Backdrop click)
        document.addEventListener('click', function(e) {
            if (window.innerWidth < 1024 && sidebarOpen) {
                const sidebar = document.getElementById('mainSidebar') || document.querySelector('aside');
                const toggleBtns = document.querySelectorAll('[onclick*="toggleSidebar"], [onclick*="toggleMobileSidebar"]');
                const isClickInsideSidebar = sidebar && sidebar.contains(e.target);
                let isClickOnToggle = false;
                toggleBtns.forEach(btn => { if (btn && btn.contains(e.target)) isClickOnToggle = true; });
                if (!isClickInsideSidebar && !isClickOnToggle) {
                    toggleSidebar(false);
                }
            }
        });

        });

        // Dark / Light Theme Toggle
        function toggleDarkMode() {
            const htmlEl = document.documentElement;
            htmlEl.classList.toggle('dark');
            const isDark = htmlEl.classList.contains('dark');
            try {
                localStorage.setItem('study_studio_theme', isDark ? 'dark' : 'light');
            } catch (e) {}

            const icon = document.getElementById('themeIcon');
            if (icon) {
                if (isDark) {
                    icon.className = 'fa-solid fa-moon text-[15px] text-amber-300';
                } else {
                    icon.className = 'fa-regular fa-sun text-[15px]';
                }
            }
            showToast(isDark ? 'Đã chuyển sang giao diện Tối 🌙' : 'Đã chuyển sang giao diện Sáng ☀️');
        }

        // Toast Helper
        let toastTimeout;
        function showToast(msg) {
            const box = document.getElementById('toastBox');
            document.getElementById('toastText').textContent = msg;
            box.classList.remove('opacity-0', 'translate-y-3');
            clearTimeout(toastTimeout);
            toastTimeout = setTimeout(() => {
                box.classList.add('opacity-0', 'translate-y-3');
            }, 3000);
        }

        // =========================================================================
        // 1. NGỮ PHÁP (7 CHUYÊN ĐỀ LỚN · 30 CHỦ ĐỀ · SỔ TAY CÁ NHÂN)
        // =========================================================================
        let savedGrammarNotes = [];
        let currentGrammarExamFilter = 'ALL';
        let currentGrammarSort = 'default';

        // Master Grammar Groups mapping
        const grammarIconMap = {
            'present-tenses': 'fa-book-open',
            'past-tenses': 'fa-clock',
            'future-tenses': 'fa-calendar-check',
            'perfect-tenses': 'fa-circle-check',
            'sequence-of-tenses': 'fa-arrows-left-right',
            'nouns-and-noun-phrases': 'fa-font',
            'pronouns-reflexive-possessive': 'fa-user-tag',
            'adjectives-ing-ed': 'fa-wand-magic-sparkles',
            'adverbs-and-positions': 'fa-bolt',
            'articles-and-quantifiers': 'fa-layer-group',
            'passive-voice': 'fa-shield-halved',
            'subject-verb-agreement': 'fa-scale-balanced',
            'to-infinitive-and-bare-v': 'fa-code-commit',
            'gerunds-v-ing': 'fa-repeat',
            'modal-verbs': 'fa-key',
            'prepositions-time-place': 'fa-location-dot',
            'advanced-toeic-prepositions': 'fa-compass',
            'coordinating-correlative-conjunctions': 'fa-link',
            'subordinating-conjunctions': 'fa-code-branch',
            'relative-clauses': 'fa-diagram-project',
            'reduced-relative-clauses': 'fa-compress',
            'noun-clauses': 'fa-cube',
            'adverbial-clauses': 'fa-sliders',
            'comparisons-equal-higher-superlative': 'fa-chart-simple',
            'double-comparisons-and-multiples': 'fa-angles-up',
            'conditional-sentences': 'fa-shuffle',
            'conditional-inversion': 'fa-rotate',
            'subjunctive-mood': 'fa-star',
            'causative-structures': 'fa-wrench',
            'inversion-and-parallelism': 'fa-bars-staggered',
            'cleft-sentences': 'fa-highlighter',
            'negative-inversion': 'fa-arrow-down-up-across-line',
            'concession-purpose-clauses': 'fa-handshake-simple',
            'reported-speech-variants': 'fa-comments',
            'linking-verbs': 'fa-bridge'
        };

        function getGrammarGroupsData() {
            if (typeof window.grammarGroupsMaster !== 'undefined' && window.grammarGroupsMaster.length > 0) {
                return window.grammarGroupsMaster;
            }
            return [];
        }

        function renderAllGrammarGroups() {
            const container = document.getElementById('grammarAllGroupsContainer');
            if (!container) return;
            const searchQ = (document.getElementById('grammarSearchInput')?.value || '').toLowerCase().trim();
            const selectedGroup = document.getElementById('grammarGroupSelect')?.value || 'ALL';
            const groups = getGrammarGroupsData();

            let html = '';
            groups.forEach(group => {
                const groupIdMatches = selectedGroup === 'ALL' || group.id === selectedGroup || 
                    (selectedGroup === 'tenses' && group.id === 'verb-tenses') ||
                    (selectedGroup === 'pos' && group.id === 'parts-of-speech') ||
                    (selectedGroup === 'verbs' && group.id === 'verb-forms-and-passive') ||
                    (selectedGroup === 'prep' && group.id === 'prepositions-and-conjunctions') ||
                    (selectedGroup === 'comp' && group.id === 'comparisons-and-conditionals') ||
                    (selectedGroup === 'special' && group.id === 'special-structures');

                if (!groupIdMatches) return;

                let filteredTopics = (group.topics || []).filter(t => {
                    const titleText = (t.name || t.title || '').toLowerCase();
                    const groupTitleText = group.title.toLowerCase();
                    const matchSearch = !searchQ || titleText.includes(searchQ) || groupTitleText.includes(searchQ);
                    const topicTags = Array.isArray(t.tags) ? t.tags.join(' ') : (t.tag || '');
                    const matchExam = currentGrammarExamFilter === 'ALL' || topicTags.includes(currentGrammarExamFilter);
                    return matchSearch && matchExam;
                });

                if (filteredTopics.length === 0) return;

                const topicCardsHtml = filteredTopics.map(t => {
                    const title = t.name || t.title;
                    const slug = t.slug;
                    const totalQ = t.totalQuestions || 50;
                    const iconClass = grammarIconMap[slug] || 'fa-book-open';
                    const tagsText = Array.isArray(t.tags) ? t.tags.join(' · ') : (t.tag || 'TOEIC · VSTEP');

                    // Level Badge
                    let levelBadge = '';
                    if (t.level === '0-500') {
                        levelBadge = '<span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold border border-emerald-200">🌱 0-500</span>';
                    } else if (t.level === '600+') {
                        levelBadge = '<span class="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-extrabold border border-indigo-200">🚀 600+</span>';
                    } else {
                        levelBadge = '<span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-extrabold border border-amber-200">👑 800+</span>';
                    }

                    // Progress & Accuracy from isolated storage theo từng tài khoản
                    let correctCount = 0;
                    let answeredCount = 0;
                    const currentUId = (window.currentUserAccount && window.currentUserAccount.id) ? window.currentUserAccount.id : 'guest';
                    try {
                        const progressRaw = localStorage.getItem(`grammar_progress_${currentUId}_${slug}`);
                        if (progressRaw) {
                            const p = JSON.parse(progressRaw);
                            if (p.questionStatusMap) {
                                correctCount = Object.values(p.questionStatusMap).filter(v => v === 'correct').length;
                                answeredCount = Object.keys(p.questionStatusMap).length;
                            }
                        }
                    } catch (e) {}

                    const pct = totalQ > 0 ? Math.round((correctCount / totalQ) * 100) : 0;

                    return `
                    <div class="glass-panel rounded-[22px] p-4 flex flex-col justify-between min-h-[175px] border border-purple-100/80 dark:border-slate-700 hover:shadow-md transition">
                        <div class="flex items-start justify-between cursor-pointer" onclick="GrammarEngine.navigateToTheory('${slug}')">
                            <div class="flex items-center gap-2.5">
                                <div class="w-9 h-9 rounded-full bg-purple-100/80 text-purple-600 flex items-center justify-center shrink-0">
                                    <i class="fa-solid ${iconClass} text-xs"></i>
                                </div>
                                <h3 class="text-[13.5px] font-extrabold text-purple-700 dark:text-purple-300 leading-snug hover:underline">${title}</h3>
                            </div>
                            <div class="flex items-center gap-1 shrink-0">
                                <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold">${tagsText}</span>
                                ${levelBadge}
                            </div>
                        </div>
                        <div class="my-3">
                            <div class="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
                                <span>Tiến độ chính xác</span>
                                <span class="text-purple-600 font-bold">${pct}% (${correctCount}/${totalQ})</span>
                            </div>
                            <div class="w-full h-1.5 bg-slate-200/80 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300" style="width: ${pct}%"></div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span class="text-xs font-medium text-slate-500">${answeredCount}/${totalQ} câu</span>
                            <div class="flex items-center gap-1.5">
                                <button onclick="GrammarEngine.navigateToTheory('${slug}')" class="px-2.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition" title="Xem lý thuyết chuyên sâu">Lý thuyết</button>
                                <button onclick="GrammarEngine.navigateToPractice('${slug}')" class="px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition" title="Luyện ngay ${totalQ} câu">
                                    <span>Luyện ngay</span>
                                    <i class="fa-solid fa-arrow-right text-xs"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                `;
                }).join('');

                html += `
                    <div class="space-y-3">
                        <div class="px-1 flex items-center justify-between">
                            <div>
                                <h2 class="text-[16px] font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                    <span>${group.icon || '📚'}</span>
                                    <span>${group.title}</span>
                                    <span class="px-2 py-0.5 rounded-full ${group.badgeColor || 'bg-purple-100 text-purple-700'} text-xs font-bold">${group.badge || 'Trọng tâm'}</span>
                                </h2>
                                <p class="text-[12px] text-slate-500 dark:text-slate-400">${group.description || ''}</p>
                            </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${topicCardsHtml}
                            <!-- Random Review Card -->
                            <div class="rounded-[22px] p-4 bg-gradient-to-br from-purple-100/90 to-indigo-100/80 dark:from-slate-800 dark:to-slate-800 border border-purple-200 dark:border-slate-700 flex flex-col justify-between min-h-[168px]">
                                <div class="flex items-center gap-2.5">
                                    <div class="w-9 h-9 rounded-full bg-white text-purple-600 flex items-center justify-center shadow-sm">
                                        <i class="fa-solid fa-shuffle text-xs"></i>
                                    </div>
                                    <h3 class="text-[14px] font-extrabold text-purple-800 dark:text-purple-300">Ôn tập ngẫu nhiên</h3>
                                </div>
                                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed my-2">
                                    Luyện câu hỏi ngẫu nhiên từ các chủ đề trong <strong class="text-slate-800 dark:text-white">${group.title}</strong>.
                                </p>
                                <div class="flex items-center gap-2 pt-1">
                                    <button onclick="startQuickQuiz('grammar', 'Ôn tập 20 câu: ${group.title.replace(/'/g, "\\'")}', 20)" class="px-3 py-1.5 rounded-full bg-purple-600 text-white text-xs font-bold flex items-center gap-1 shadow-sm">
                                        <i class="fa-solid fa-check text-xs"></i> 20 câu
                                    </button>
                                    <button onclick="startQuickQuiz('grammar', 'Ôn tập 30 câu: ${group.title.replace(/'/g, "\\'")}', 30)" class="px-3 py-1.5 rounded-full bg-white text-slate-700 text-xs font-bold border border-purple-100 hover:bg-purple-50">30 câu</button>
                                    <button onclick="startQuickQuiz('grammar', 'Ôn tập 50 câu: ${group.title.replace(/'/g, "\\'")}', 50)" class="px-3 py-1.5 rounded-full bg-white text-slate-700 text-xs font-bold border border-purple-100 hover:bg-purple-50">50 câu</button>
                                </div>
                            </div>
                            <!-- Mini Test Card -->
                            <div onclick="startQuickQuiz('grammar', 'Mini Test: ${group.title.replace(/'/g, "\\'")}', 15)" class="cursor-pointer rounded-[22px] p-4 bg-gradient-to-br from-amber-50 via-yellow-50/90 to-orange-50/80 dark:from-slate-800 dark:to-slate-800 border-l-4 border-l-amber-600 border border-amber-200/80 dark:border-slate-700 flex flex-col justify-between min-h-[168px] hover:shadow-md transition">
                                <div class="flex items-start justify-between">
                                    <div class="flex items-center gap-2.5">
                                        <div class="w-9 h-9 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center">
                                            <i class="fa-regular fa-clipboard text-xs"></i>
                                        </div>
                                        <h3 class="text-[14px] font-extrabold text-amber-900 dark:text-amber-300">Mini Test</h3>
                                    </div>
                                    <span class="px-2.5 py-1 rounded-full bg-white text-slate-700 text-xs font-bold shadow-sm">TOEIC</span>
                                </div>
                                <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed my-2">
                                    Bài kiểm tra tổng hợp trong <strong class="text-slate-800 dark:text-white">${group.title}</strong>, đếm ngược thời gian làm cho từng câu.
                                </p>
                                <div class="w-full h-1 bg-amber-200/70 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html || `<div class="glass-panel rounded-2xl p-8 text-center text-sm text-slate-500">Không tìm thấy chủ đề ngữ pháp phù hợp.</div>`;

            const doneStatEl = document.getElementById('grammarDoneStat');
            if (doneStatEl) doneStatEl.textContent = state.grammarDone || 0;
            const noteCountEl = document.getElementById('grammarNotebookCount');
            if (noteCountEl) noteCountEl.textContent = Array.isArray(savedGrammarNotes) ? savedGrammarNotes.length : 0;
        }

        function switchGrammarSubTab(subTab) {
            const learnBtn = document.getElementById('grammarSubTabLearn');
            const ptBtn = document.getElementById('grammarSubTabPassToeic');
            const noteBtn = document.getElementById('grammarSubTabNotebook');
            const learnPanel = document.getElementById('grammarMainLearnPanel');
            const ptPanel = document.getElementById('grammarPassToeicPanel');
            const notePanel = document.getElementById('grammarNotebookPanel');

            const inactiveClass = 'pb-2.5 border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:text-purple-600 font-semibold text-[13.5px] flex items-center gap-2';
            const activeClass = 'pb-2.5 border-b-2 border-purple-600 text-purple-700 dark:text-purple-400 font-bold text-[13.5px] flex items-center gap-2';

            if (learnBtn) learnBtn.className = subTab === 'learn' ? activeClass : inactiveClass;
            if (ptBtn) ptBtn.className = subTab === 'passtoeic' ? activeClass : inactiveClass;
            if (noteBtn) noteBtn.className = subTab === 'notebook' ? activeClass : inactiveClass;

            if (learnPanel) learnPanel.classList.toggle('hidden', subTab !== 'learn');
            if (ptPanel) ptPanel.classList.toggle('hidden', subTab !== 'passtoeic');
            if (notePanel) notePanel.classList.toggle('hidden', subTab !== 'notebook');

            if (subTab === 'learn') renderAllGrammarGroups();
        }

        function setGrammarExamFilter(filter, btnEl) {
            currentGrammarExamFilter = filter;
            document.querySelectorAll('.gram-exam-btn').forEach(b => {
                b.className = 'gram-exam-btn px-3 py-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100';
            });
            btnEl.className = 'gram-exam-btn px-3 py-1 rounded-xl bg-purple-100 text-purple-700';
            renderAllGrammarGroups();
        }

        function setGrammarSort(sortMode, btnEl) {
            currentGrammarSort = sortMode;
            document.querySelectorAll('.gram-sort-btn').forEach(b => {
                b.className = 'gram-sort-btn px-3 py-1 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100';
            });
            btnEl.className = 'gram-sort-btn px-3 py-1 rounded-xl bg-purple-100 text-purple-700';
            renderAllGrammarGroups();
        }

        // =========================================================================
        // 2. TỪ VỰNG (6 NHÓM CHỦ ĐỀ · 48 BỘ TỪ · GHÉP CỤM TỪ COLLOCATION)
        // =========================================================================
        const vocabGroupsData = [
            {
                groupName: 'Business & Workplace',
                color: 'bg-fuchsia-600',
                decks: ['Contracts', 'Business Planning', 'Conferences', 'Office Technology', 'Office Procedures', 'Correspondence', 'Marketing', 'Warranties', 'Customer Service', 'Company Regulations']
            },
            {
                groupName: 'Personnel & HR',
                color: 'bg-purple-600',
                decks: ['Job Advertising & Recruiting', 'Applying & Interviewing', 'Hiring & Training', 'Salaries & Benefits', 'Promotions & Awards', 'Pensions & Retirement', 'Workplace Safety', 'Team Collaboration']
            },
            {
                groupName: 'Purchasing & Logistics',
                color: 'bg-teal-600',
                decks: ['Shopping & Ordering Supplies', 'Shipping & Receiving', 'Invoices & Billing', 'Inventory Management', 'Manufacturing', 'Quality Control', 'Product Development', 'Warehouse Operations']
            },
            {
                groupName: 'Finance & Accounting',
                color: 'bg-emerald-600',
                decks: ['Banking & Loans', 'Accounting', 'Investments', 'Financial Statements', 'Taxes & Auditing', 'Property & Real Estate', 'Board Meetings', 'Cost Reduction']
            },
            {
                groupName: 'Travel & Entertainment',
                color: 'bg-blue-600',
                decks: ['Airlines & Airports', 'Trains & Public Transit', 'Hotels & Accommodations', 'Car Rentals', 'Eating Out & Restaurants', 'Cinema & Theater', 'Museums & Art', 'Media & Press']
            },
            {
                groupName: 'Health & VSTEP Academic',
                color: 'bg-amber-600',
                decks: ['Doctor’s Office & Dentistry', 'Health Insurance', 'Hospitals & Pharmacy', 'VSTEP Environment & Climate', 'VSTEP Education & Technology', 'VSTEP Social & Culture']
            }
        ];

        // Phân tầng cấp độ từ vựng TOEIC & VSTEP (0 - 500, 600+, 800+)
        const vocabDeckTiers = {
            // Tier 0 - 500: Căn bản & Mất gốc (16 bộ)
            'Customer Service': 'tier_0_500', 'Office Technology': 'tier_0_500', 'Office Procedures': 'tier_0_500', 'Correspondence': 'tier_0_500',
            'Airlines & Airports': 'tier_0_500', 'Trains & Public Transit': 'tier_0_500', 'Hotels & Accommodations': 'tier_0_500', 'Car Rentals': 'tier_0_500',
            'Eating Out & Restaurants': 'tier_0_500', 'Cinema & Theater': 'tier_0_500', 'Museums & Art': 'tier_0_500', 'Shopping & Ordering Supplies': 'tier_0_500',
            'Shipping & Receiving': 'tier_0_500', 'Invoices & Billing': 'tier_0_500', 'Doctor’s Office & Dentistry': 'tier_0_500', 'Hospitals & Pharmacy': 'tier_0_500',

            // Tier 600+: Cốt lõi Ra trường & Doanh nghiệp (20 bộ)
            'Contracts': 'tier_600', 'Business Planning': 'tier_600', 'Conferences': 'tier_600', 'Marketing': 'tier_600',
            'Warranties': 'tier_600', 'Company Regulations': 'tier_600', 'Job Advertising & Recruiting': 'tier_600', 'Applying & Interviewing': 'tier_600',
            'Hiring & Training': 'tier_600', 'Salaries & Benefits': 'tier_600', 'Promotions & Awards': 'tier_600', 'Team Collaboration': 'tier_600',
            'Workplace Safety': 'tier_600', 'Inventory Management': 'tier_600', 'Manufacturing': 'tier_600', 'Quality Control': 'tier_600',
            'Product Development': 'tier_600', 'Warehouse Operations': 'tier_600', 'Banking & Loans': 'tier_600', 'Accounting': 'tier_600',

            // Tier 800+: Điểm cao, Kiểm toán & Học thuật VSTEP (12 bộ)
            'Investments': 'tier_800', 'Financial Statements': 'tier_800', 'Taxes & Auditing': 'tier_800', 'Property & Real Estate': 'tier_800',
            'Board Meetings': 'tier_800', 'Cost Reduction': 'tier_800', 'Pensions & Retirement': 'tier_800', 'Health Insurance': 'tier_800',
            'Media & Press': 'tier_800', 'VSTEP Environment & Climate': 'tier_800', 'VSTEP Education & Technology': 'tier_800', 'VSTEP Social & Culture': 'tier_800'
        };

        let currentVocabTierFilter = 'ALL';

        function setVocabLevelFilter(tier, btnEl) {
            currentVocabTierFilter = tier;
            const selectEl = document.getElementById('vocabCourseFilter');
            if (selectEl) selectEl.value = tier;
            
            const btnALL = document.getElementById('btnTierALL');
            const btn0500 = document.getElementById('btnTier0500');
            const btn600 = document.getElementById('btnTier600');
            const btn800 = document.getElementById('btnTier800');
            
            if (btnALL) btnALL.className = 'vocab-tier-btn px-4 py-2 rounded-xl text-xs font-extrabold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-indigo-300 transition';
            if (btn0500) btn0500.className = 'vocab-tier-btn px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 transition';
            if (btn600) btn600.className = 'vocab-tier-btn px-4 py-2 rounded-xl text-xs font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-200/80 hover:bg-indigo-100 transition';
            if (btn800) btn800.className = 'vocab-tier-btn px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-50 text-amber-700 border border-amber-200/80 hover:bg-amber-100 transition';
            
            if (tier === 'ALL' && btnALL) {
                btnALL.className = 'vocab-tier-btn px-4 py-2 rounded-xl text-xs font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md transition ring-2 ring-indigo-300';
            } else if (tier === 'tier_0_500' && btn0500) {
                btn0500.className = 'vocab-tier-btn px-4 py-2 rounded-xl text-xs font-extrabold bg-emerald-600 text-white shadow-md transition ring-2 ring-emerald-300';
            } else if (tier === 'tier_600' && btn600) {
                btn600.className = 'vocab-tier-btn px-4 py-2 rounded-xl text-xs font-extrabold bg-indigo-600 text-white shadow-md transition ring-2 ring-indigo-300';
            } else if (tier === 'tier_800' && btn800) {
                btn800.className = 'vocab-tier-btn px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-600 text-white shadow-md transition ring-2 ring-amber-300';
            }
            renderAllVocabGroups();
        }

        function handleVocabCourseDropdownChange(val) {
            setVocabLevelFilter(val, null);
        }

        function stripVietnameseAccents(str) {
            if (!str) return '';
            return String(str)
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D')
                .toLowerCase();
        }
        function renderAllVocabGroups() {
            const container = document.getElementById('vocabModeCardsContainer');
            if (!container) return;
            const searchQ = (document.getElementById('vocabSearchInput')?.value || '').toLowerCase().trim();
            const examFilter = document.getElementById('vocabExamFilter')?.value || 'ALL';
            const groupFilter = document.getElementById('vocabGroupFilter')?.value || 'ALL';
            const tierFilter = currentVocabTierFilter || document.getElementById('vocabCourseFilter')?.value || 'ALL';

            let html = '';
            let totalDecksRendered = 0;

            vocabGroupsData.forEach(grp => {
                if (groupFilter !== 'ALL' && !grp.groupName.toLowerCase().includes(groupFilter.toLowerCase())) return;

                let filteredDecks = grp.decks.filter(deckName => {
                    const cleanSearch = stripVietnameseAccents(searchQ);
                    const matchSearch = !cleanSearch || 
                        stripVietnameseAccents(deckName).includes(cleanSearch) || 
                        stripVietnameseAccents(grp.groupName).includes(cleanSearch);
                    let matchExam = true;
                    if (examFilter === 'VSTEP') {
                        matchExam = deckName.toLowerCase().includes('vstep') || grp.groupName.toLowerCase().includes('vstep');
                    } else if (examFilter === 'TOEIC') {
                        matchExam = !deckName.toLowerCase().startsWith('vstep ');
                    }
                    
                    let matchTier = true;
                    if (tierFilter !== 'ALL') {
                        const dTier = vocabDeckTiers[deckName] || 'tier_600';
                        matchTier = (dTier === tierFilter);
                    }

                    return matchSearch && matchExam && matchTier;
                });

                if (filteredDecks.length === 0) return;
                totalDecksRendered += filteredDecks.length;

                const deckCards = filteredDecks.map(deckName => {
                    const deckCardsList = (window.vocabDecksDatabase && window.vocabDecksDatabase[deckName]) || [];
                    const totalInDeck = deckCardsList.length || 12;
                    const learnedCount = Array.isArray(learnedVocabItems)
                        ? deckCardsList.filter(card => learnedVocabItems.some(lv => (lv.word || '').toLowerCase() === (card.word || '').toLowerCase())).length
                        : 0;
                    const deckPct = totalInDeck > 0 ? Math.round((learnedCount / totalInDeck) * 100) : 0;
                    const isMastered = deckPct === 100;
                    const isStudying = deckPct > 0 && !isMastered;

                    let statusBadge = '<span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">Mới</span>';
                    if (isMastered) {
                        statusBadge = '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">✓ Đã thuộc 100%</span>';
                    } else if (isStudying) {
                        statusBadge = `<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">Đang học ${deckPct}%</span>`;
                    }

                    // Level Tier Badge
                    const dTier = vocabDeckTiers[deckName] || 'tier_600';
                    let tierBadge = '<span class="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 text-xs font-extrabold">🚀 600+ Cốt lõi Ra trường</span>';
                    if (dTier === 'tier_0_500') {
                        tierBadge = '<span class="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 text-xs font-extrabold">🌱 0 - 500 Căn bản & Mất gốc</span>';
                    } else if (dTier === 'tier_800') {
                        tierBadge = '<span class="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 text-xs font-extrabold">👑 800+ Điểm cao & Học thuật</span>';
                    }

                    const safeDeckName = deckName.replace(/'/g, "\\'");
                    const topicSlug = safeDeckName.toLowerCase().replace(/[^a-z0-9]+/g, '-');

                    return `
                        <div onclick="if(window.VocabularyEngine){ VocabularyEngine.navigateToStudy('${topicSlug}'); } else { openVocabFlashcardModal('${safeDeckName}'); }" class="cursor-pointer glass-panel rounded-[22px] p-4 flex flex-col justify-between min-h-[168px] border border-slate-200/80 dark:border-slate-700 hover:border-indigo-300 hover:shadow-lg transition-all">
                            <div>
                                <div class="flex items-start justify-between gap-1 mb-1">
                                    <div class="flex items-center gap-2">
                                        <div class="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                                            <i class="fa-solid fa-book-open text-xs"></i>
                                        </div>
                                        <h3 class="text-[13.5px] font-extrabold text-slate-800 dark:text-slate-100 leading-snug">${deckName}</h3>
                                    </div>
                                    ${statusBadge}
                                </div>
                                <div class="flex items-center gap-1.5 mt-2">
                                    ${tierBadge}
                                </div>
                            </div>
                            <div class="my-2.5">
                                <div class="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
                                    <span>Tiến độ đã học</span>
                                    <span class="text-indigo-600 font-bold">${deckPct}%</span>
                                </div>
                                <div class="w-full h-1.5 bg-slate-200/80 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300" style="width: ${deckPct}%"></div>
                                </div>
                            </div>
                            <div class="flex items-center justify-between pt-1">
                                <span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                                    <i class="fa-solid fa-layer-group mr-1 text-slate-400"></i>${learnedCount}/${totalInDeck} từ
                                </span>
                                <button onclick="event.stopPropagation(); if(window.VocabularyEngine){ VocabularyEngine.navigateToStudy('${topicSlug}'); } else { openVocabFlashcardModal('${safeDeckName}'); }" class="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition">
                                    <span>Học bài</span>
                                    <i class="fa-solid fa-arrow-right text-xs"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }).join('');

                html += `
                    <div class="space-y-3">
                        <div class="flex items-center gap-2 px-1">
                            <span class="w-2.5 h-2.5 rounded-full ${grp.color}"></span>
                            <h2 class="text-[17px] font-extrabold text-slate-900 dark:text-white">${grp.groupName}</h2>
                            <span class="text-xs font-medium text-slate-500 ml-1">${filteredDecks.length === grp.decks.length ? `${filteredDecks.length} bộ từ` : `${filteredDecks.length}/${grp.decks.length} bộ (đang lọc)`}</span>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            ${deckCards}
                        </div>
                    </div>
                `;
            });

            container.innerHTML = html || `<div class="glass-panel rounded-2xl p-8 text-center text-sm text-slate-500">Không tìm thấy bộ từ vựng nào thuộc trình độ "${tierFilter === 'tier_0_500' ? '0 - 500' : tierFilter === 'tier_600' ? '600+' : tierFilter === 'tier_800' ? '800+' : 'đã chọn'}". Vui lòng chọn "Tất cả" hoặc thử từ khóa khác!</div>`;

            // Cập nhật các thống kê trên top panel Từ vựng
            const totalLearned = Array.isArray(learnedVocabItems) ? learnedVocabItems.length : 0;
            const totalSaved = Array.isArray(savedVocabItems) ? savedVocabItems.length : 0;
            const learnedBadge = document.getElementById('learnedWordsBadge');
            if (learnedBadge) learnedBadge.textContent = totalLearned;
            const savedBadge = document.getElementById('savedWordsBadge');
            if (savedBadge) savedBadge.textContent = totalSaved;
            const vHeaderLearned = document.getElementById('vocabHeaderLearned');
            if (vHeaderLearned) vHeaderLearned.textContent = totalLearned;
            const vDueText = document.getElementById('vocabDueStatusText');
            if (vDueText) vDueText.textContent = totalLearned > 0 ? `${totalLearned} từ cần ôn tập định kỳ` : 'Không có từ đến hạn';
            const vSavedSub = document.getElementById('savedVocabSub');
            if (vSavedSub) vSavedSub.textContent = totalSaved > 0 ? `Đã lưu ${totalSaved} từ vào sổ tay` : 'Chưa lưu từ nào';
        }

        function switchVocabSubMode(mode) {
            const modes = ['cards', 'match', 'family', 'learned', 'saved'];
            modes.forEach(m => {
                const container = document.getElementById(`vocabMode${m.charAt(0).toUpperCase() + m.slice(1)}Container`);
                if (container) container.classList.toggle('hidden', m !== mode);
            });
            const filterBar = document.getElementById('vocabFilterBar');
            if (filterBar) filterBar.classList.toggle('hidden', mode !== 'cards');

            // Highlight active mode tab
            const tabs = {
                cards: 'vocabTabCards',
                match: 'vocabTabMatch',
                family: 'vocabTabFamily',
                learned: 'vocabTabLearned',
                saved: 'vocabTabSaved'
            };
            for (let k in tabs) {
                const btn = document.getElementById(tabs[k]);
                if (btn) {
                    if (k === mode) {
                        btn.classList.add('ring-2', 'ring-offset-1', 'ring-fuchsia-400');
                    } else {
                        btn.classList.remove('ring-2', 'ring-offset-1', 'ring-fuchsia-400');
                    }
                }
            }

            if (mode === 'cards') renderAllVocabGroups();
            if (mode === 'match') initCollocationMatchGame();
            if (mode === 'family') renderVocabFamilySearch(document.getElementById('vocabFamilySearchInput')?.value || 'economic');
            if (mode === 'learned') renderLearnedVocabList();
            if (mode === 'saved') renderSavedVocabList();
        }

        const collocationPairs = [
            { id: 1, en: 'abide by the agreement', vi: 'tuân thủ thỏa thuận hợp đồng' },
            { id: 2, en: 'prior to the scheduled departure', vi: 'trước giờ khởi hành theo lịch' },
            { id: 3, en: 'eligible for a full refund', vi: 'đủ điều kiện được hoàn tiền 100%' },
            { id: 4, en: 'submit a travel expense report', vi: 'nộp báo cáo chi phí công tác' },
            { id: 5, en: 'comply with safety regulations', vi: 'chấp hành quy định an toàn' }
        ];
        let selectedEnId = null;

        function initCollocationMatchGame() {
            selectedEnId = null;
            const board = document.getElementById('collocationMatchBoard');
            if (!board) return;

            const leftHtml = collocationPairs.map(p => `
                <button id="match-en-${p.id}" onclick="selectCollocationLeft(${p.id})" class="w-full text-left p-3.5 rounded-2xl border border-cyan-200 bg-cyan-50/50 hover:bg-cyan-100/70 font-bold text-xs text-slate-800 transition flex items-center justify-between">
                    <span>🇬🇧 ${p.en}</span>
                    <i class="fa-solid fa-link text-cyan-600"></i>
                </button>
            `).join('');

            const shuffledVi = [...collocationPairs].sort(() => Math.random() - 0.5);
            const rightHtml = shuffledVi.map(p => `
                <button id="match-vi-${p.id}" onclick="selectCollocationRight(${p.id})" class="w-full text-left p-3.5 rounded-2xl border border-slate-200 bg-white hover:border-cyan-400 font-semibold text-xs text-slate-700 transition flex items-center justify-between">
                    <span>🇻🇳 ${p.vi}</span>
                </button>
            `).join('');

            board.innerHTML = `<div class="space-y-2.5">${leftHtml}</div><div class="space-y-2.5">${rightHtml}</div>`;
        }

        function selectCollocationLeft(id) {
            selectedEnId = id;
            collocationPairs.forEach(p => {
                const btn = document.getElementById(`match-en-${p.id}`);
                if (btn && !btn.disabled) {
                    btn.classList.toggle('ring-2', p.id === id);
                    btn.classList.toggle('ring-cyan-600', p.id === id);
                }
            });
        }

        function selectCollocationRight(id) {
            if (!selectedEnId) {
                showToast('Hãy chọn 1 cụm từ tiếng Anh ở cột bên trái trước nhé!');
                return;
            }
            const enBtn = document.getElementById(`match-en-${selectedEnId}`);
            const viBtn = document.getElementById(`match-vi-${id}`);
            if (selectedEnId === id) {
                enBtn.disabled = true;
                viBtn.disabled = true;
                enBtn.className = 'w-full text-left p-3.5 rounded-2xl border border-emerald-400 bg-emerald-100 font-bold text-xs text-emerald-900 flex items-center justify-between opacity-75';
                viBtn.className = 'w-full text-left p-3.5 rounded-2xl border border-emerald-400 bg-emerald-100 font-bold text-xs text-emerald-900 flex items-center justify-between opacity-75';
                state.xp += 5;
                state.vocabLearned++;
                updateDashboardMetrics();
                showToast('✨ Ghép chính xác! +5 XP');
                selectedEnId = null;
            } else {
                showToast('Chưa khớp rồi, bạn thử lại nhé!');
            }
        }

        // =========================================================================
        // 3. NGÂN HÀNG CÂU HỎI TƯƠNG TÁC (QUIZ QUESTIONS BANK)
        // =========================================================================
        const quizQuestions = {
            grammar: [
                {
                    q: "Ms. Parker _______ the monthly financial report before the board meeting every Friday.",
                    options: ["A. review", "B. reviews", "C. reviewing", "D. reviewed"],
                    ans: 1,
                    steps: [
                        "1. Vị trí chỗ trống: Đứng sau chủ ngữ số ít 'Ms. Parker' và trước cụm danh từ tân ngữ 'the monthly financial report' → cần một động từ chia thì.",
                        "2. Xét ngữ pháp: Cuối câu có cụm trạng từ chỉ tần suất 'every Friday' (mỗi thứ Sáu) → dấu hiệu của thì Hiện tại đơn.",
                        "3. Kết luận: Chủ ngữ ngôi thứ 3 số ít nên động từ thêm '-s' → Chọn B (reviews)."
                    ]
                },
                {
                    q: "All new technicians _______ a mandatory safety orientation before entering the laboratory.",
                    options: ["A. must complete", "B. completing", "C. to complete", "D. completion"],
                    ans: 0,
                    steps: [
                        "1. Vị trí chỗ trống: Câu chưa có động từ chính sau chủ ngữ 'All new technicians'.",
                        "2. Xét ngữ pháp: B (V-ing), C (To-V) và D (Danh từ) đều không thể làm vị ngữ chính trong câu.",
                        "3. Kết luận: Chọn A (must complete) là cụm động từ khuyết thiếu hợp chuẩn ngữ pháp."
                    ]
                },
                {
                    q: "_______ the severe snowstorm, the annual shareholders conference started on schedule.",
                    options: ["A. Although", "B. Because", "C. Despite", "D. Unless"],
                    ans: 2,
                    steps: [
                        "1. Vị trí chỗ trống: Đứng trước cụm danh từ 'the severe snowstorm' (không có động từ chia thì).",
                        "2. Xét ngữ pháp: A, B, D là liên từ phụ thuộc (theo sau phải là mệnh đề S + V). Chỉ có 'Despite' là giới từ đi với cụm danh từ.",
                        "3. Kết luận: Chọn C (Despite = Mặc dù)."
                    ]
                }
            ],
            passtoeic_grammar: [
                {
                    q: "[PassToeic 5-Second Trap] The marketing director approved the _______ promotional budget for the upcoming quarter.",
                    options: ["A. revise", "B. revised", "C. revision", "D. D. revising"],
                    ans: 1,
                    steps: [
                        "1. Công thức 5 giây PassToeic: Chỗ trống nằm giữa mạo từ 'the' và cụm danh từ 'promotional budget'.",
                        "2. Xét ngữ pháp: Cần một Tính từ (Phân từ quá khứ V3/ed mang nghĩa bị động 'đã được chỉnh sửa') bổ nghĩa cho 'budget'.",
                        "3. Kết luận: Chọn B (revised = ngân sách đã được điều chỉnh)."
                    ]
                },
                {
                    q: "[PassToeic Participle Trap] Anyone _______ to attend the leadership workshop must register online by Wednesday.",
                    options: ["A. wish", "B. wished", "C. wishing", "D. wishes"],
                    ans: 2,
                    steps: [
                        "1. Vị trí chỗ trống: Câu đã có động từ chính 'must register'. Chỗ trống rút gọn mệnh đề quan hệ sau đại từ bất định 'Anyone'.",
                        "2. Mẹo PassToeic: 'Anyone who wishes to attend' (chủ động) rút gọn thành V-ing.",
                        "3. Kết luận: Chọn C (wishing)."
                    ]
                }
            ],
            listening_part1: [
                {
                    id: "p1_q01",
                    topic: "Tranh tả người",
                    image: "assets/listening/part1/p1_sample_01_person.webp",
                    audioScript: "Number 1. Look at the picture marked number 1 in your test book. (A) She is hanging a picture frame on the wall. (B) A woman is examining a blueprint on a table. (C) She is rolling up a sheet of paper. (D) She is speaking into a telephone receiver.",
                    q: "Look at the picture and choose the statement that best describes what you see:",
                    options: [
                        "A. She is hanging a picture frame on the wall.",
                        "B. A woman is examining a blueprint on a table.",
                        "C. She is rolling up a sheet of paper.",
                        "D. She is speaking into a telephone receiver."
                    ],
                    ans: 1,
                    steps: [
                        "1. Phân tích tranh: Người phụ nữ đứng bên bàn làm việc và nhìn chăm chú vào bản vẽ kiến trúc trải phẳng.",
                        "2. Mô tả đúng: (B) 'A woman is examining a blueprint on a table' mô tả chính xác nhất.",
                        "3. Loại trừ bẫy: (A) sai vì không treo tranh. (C) sai vì bản vẽ đang mở phẳng. (D) sai vì không dùng điện thoại."
                    ]
                },
                {
                    id: "p1_q02",
                    topic: "Tranh tả vật",
                    image: "assets/listening/part1/p1_sample_02_object.webp",
                    audioScript: "Number 2. Look at the picture marked number 2 in your test book. (A) Some attendees are taking seats for a lecture. (B) The presentation screen has been turned on. (C) Chairs are arranged around a long table. (D) The conference table is being wiped down.",
                    q: "Look at the picture and choose the statement that best describes what you see:",
                    options: [
                        "A. Some attendees are taking seats for a lecture.",
                        "B. The presentation screen has been turned on.",
                        "C. Chairs are arranged around a long table.",
                        "D. The conference table is being wiped down."
                    ],
                    ans: 2,
                    steps: [
                        "1. Phân tích tranh tĩnh không người: (C) 'Chairs are arranged around a long table' mô tả chính xác trạng thái sắp đặt của bàn ghế.",
                        "2. Loại trừ bẫy: (A) sai vì không có người. (B) sai vì màn hình máy chiếu màu trắng đang tắt.",
                        "3. Bẫy bị động tiếp diễn: (D) dùng 'is being wiped down' chỉ hành động đang lau dọn có người thực hiện -> SAI với tranh tĩnh."
                    ]
                },
                {
                    id: "p1_q03",
                    topic: "Cảnh & bối cảnh",
                    image: "assets/listening/part1/p1_sample_03_scene.webp",
                    audioScript: "Number 3. Look at the picture marked number 3 in your test book. (A) Benches have been placed along a walkway. (B) Boats are passing beneath a bridge. (C) Leaves are being swept into a pile. (D) Pedestrians are jogging in a group along the path.",
                    q: "Look at the picture and choose the statement that best describes what you see:",
                    options: [
                        "A. Benches have been placed along a walkway.",
                        "B. Boats are passing beneath a bridge.",
                        "C. Leaves are being swept into a pile.",
                        "D. Pedestrians are jogging in a group along the path."
                    ],
                    ans: 0,
                    steps: [
                        "1. Phân tích tranh phong cảnh: (A) 'Benches have been placed along a walkway' chỉ trạng thái tĩnh sẵn có -> ĐÚNG.",
                        "2. Loại trừ bẫy: (B) sai vì trên sông không có thuyền. (C) sai vì không ai quét lá. (D) sai vì không có người chạy bộ."
                    ]
                },
                {
                    id: "p1_q04",
                    topic: "Người & vật tương tác",
                    image: "assets/listening/part1/p1_sample_04_interaction.webp",
                    audioScript: "Number 4. Look at the picture marked number 4 in your test book. (A) Groceries are being loaded into a vehicle. (B) A customer is entering a PIN code on a keypad. (C) Shelves are being restocked with canned goods. (D) A cashier is handing a bag to a customer.",
                    q: "Look at the picture and choose the statement that best describes what you see:",
                    options: [
                        "A. Groceries are being loaded into a vehicle.",
                        "B. A customer is entering a PIN code on a keypad.",
                        "C. Shelves are being restocked with canned goods.",
                        "D. A cashier is handing a bag to a customer."
                    ],
                    ans: 3,
                    steps: [
                        "1. Phân tích tranh tương tác hai người: (D) 'A cashier is handing a bag to a customer' miêu tả chuẩn xác tương tác trọng tâm.",
                        "2. Loại trừ bẫy: (A) sai vì tại quầy thu ngân trong siêu thị, không phải xe hơi. (B) sai vì đang đón túi giấy, không phải bấm mã PIN. (C) sai vì không xếp đồ hộp."
                    ]
                },
                {
                    image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&w=800&q=80",
                    audioScript: "Look at the picture. A. A clerk is restocking grocery items on a shelf. B. A customer is paying at the cash register. C. Shopping carts are lined up by the entrance. D. Floor tiles are being mopped with soap.",
                    q: "🎧 [Part 1: Photographs] Chọn câu mô tả đúng hành động trong cửa hàng:",
                    options: [
                        "A. A clerk is restocking grocery items on a shelf.",
                        "B. A customer is paying at the cash register.",
                        "C. Shopping carts are lined up by the entrance.",
                        "D. Floor tiles are being mopped with soap."
                    ],
                    ans: 0,
                    steps: [
                        "1. Hành động nhân vật: Nhân viên đang xếp lại hàng hóa trên kệ.",
                        "2. Kết luận: Chọn A."
                    ]
                },
                {
                    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
                    audioScript: "Look at the picture. A. The dining table has been set with cutlery and glasses. B. Food is being served by the waitstaff. C. Customers are being seated at the booth. D. Dishes are being cleared from the surface.",
                    q: "🎧 [Part 1: Photographs] Chọn câu mô tả đúng bàn ăn trong nhà hàng:",
                    options: [
                        "A. The dining table has been set with cutlery and glasses.",
                        "B. Food is being served by the waitstaff.",
                        "C. Customers are being seated at the booth.",
                        "D. Dishes are being cleared from the surface."
                    ],
                    ans: 0,
                    steps: [
                        "1. Tranh bàn ăn chuẩn bị sẵn: (B), (C), (D) đều có bẫy 'being'.",
                        "2. Kết luận: Chọn A (The dining table has been set with cutlery and glasses)."
                    ]
                },
                {
                    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80",
                    audioScript: "Look at the picture. A. Workers are installing scaffolding on a building. B. Construction equipment is operating near a trench. C. Pedestrians are waiting at an intersection. D. An architect is reviewing blueprints at a desk.",
                    q: "🎧 [Part 1: Photographs] Chọn câu mô tả đúng công trường xây dựng:",
                    options: [
                        "A. Workers are installing scaffolding on a building.",
                        "B. Construction equipment is operating near a trench.",
                        "C. Pedestrians are waiting at an intersection.",
                        "D. An architect is reviewing blueprints at a desk."
                    ],
                    ans: 0,
                    steps: [
                        "1. Hành động và bối cảnh: Công nhân đang lắp giàn giáo trên tòa nhà đang xây dựng.",
                        "2. Loại trừ: B, C, D đều nhắc tới các hành động không diễn ra trong ảnh.",
                        "3. Kết luận: Chọn A (Workers are installing scaffolding on a building)."
                    ]
                }
            ],
            listening_part2: [
                {
                    audioScript: "When will the quarterly budget meeting take place? A. In Conference Room B. B. Next Tuesday at ten A.M. C. Yes, I met him yesterday.",
                    q: "🎧 [Part 2: Wh- Question] When will the quarterly budget meeting take place?",
                    options: [
                        "A. In Conference Room B.",
                        "B. Next Tuesday at 10:00 A.M.",
                        "C. Yes, I met him yesterday."
                    ],
                    ans: 1,
                    steps: [
                        "1. Từ để hỏi: 'When' (Khi nào) → Hỏi về mốc thời gian.",
                        "2. Loại trừ: A trả lời cho 'Where' (Ở đâu); C là câu trả lời Yes/No + bẫy đồng âm 'meeting / met'.",
                        "3. Kết luận: Chọn B (Next Tuesday at 10:00 A.M.)."
                    ]
                },
                {
                    audioScript: "Where did you put the revised employee handbooks? A. Yes, I revised them. B. On the shelf in the copy room. C. No later than Friday.",
                    q: "🎧 [Part 2: Wh- Question] Where did you put the revised employee handbooks?",
                    options: [
                        "A. Yes, I revised them.",
                        "B. On the shelf in the copy room.",
                        "C. No later than Friday."
                    ],
                    ans: 1,
                    steps: [
                        "1. Từ để hỏi: 'Where' (Ở đâu) → Hỏi về vị trí / địa điểm.",
                        "2. Loại trừ: A sai vì câu hỏi Wh- không trả lời Yes/No; C trả lời cho When.",
                        "3. Kết luận: Chọn B (On the shelf in the copy room)."
                    ]
                },
                {
                    audioScript: "Why was the client presentation postponed? A. At the main post office. B. Because the projector was being repaired. C. I bought a birthday present.",
                    q: "🎧 [Part 2: Wh- Question] Why was the client presentation postponed?",
                    options: [
                        "A. At the main post office.",
                        "B. Because the projector was being repaired.",
                        "C. I bought a birthday present."
                    ],
                    ans: 1,
                    steps: [
                        "1. Nhận diện câu hỏi: 'Why' (Tại sao buổi thuyết trình bị hoãn?).",
                        "2. Tránh bẫy đồng âm: Loại A (chứa từ 'post') và C (chứa từ 'present').",
                        "3. Kết luận: Chọn B (Vì máy chiếu đang được sửa chữa)."
                    ]
                },
                {
                    audioScript: "Would you like to review the sales figures before the conference? A. Sure, let's look over them now. B. The conference was last month. C. About twenty dollars.",
                    q: "🎧 [Part 2: Lựa chọn & Đề nghị] Would you like to review the sales figures before the conference?",
                    options: [
                        "A. Sure, let's look over them now.",
                        "B. The conference was last month.",
                        "C. About twenty dollars."
                    ],
                    ans: 0,
                    steps: [
                        "1. Lời đề nghị: 'Would you like to review...'.",
                        "2. Phản hồi phù hợp: Chọn A (Sure, let's look over them now - Chắc chắn rồi, cùng xem qua nhé)."
                    ]
                },
                {
                    audioScript: "The printer on the fourth floor seems to be jammed again. A. I already submitted my report. B. There is another one down the hall. C. Printing fifty copies.",
                    q: "🎧 [Part 2: Câu trần thuật] The printer on the fourth floor seems to be jammed again.",
                    options: [
                        "A. I already submitted my report.",
                        "B. There is another one down the hall.",
                        "C. Printing fifty copies."
                    ],
                    ans: 1,
                    steps: [
                        "1. Câu trần thuật thông báo máy in bị kẹt.",
                        "2. Hướng xử lý logic: B (Có một chiếc khác ở cuối hành lang) đưa ra giải pháp thay thế hợp lý nhất."
                    ]
                }
            ],
            listening: [],
            passtoeic_listening: [
                {
                    audioScript: "Why was the client presentation postponed? A. At the main post office. B. Because the projector was being repaired. C. I bought a birthday present.",
                    q: "🎧 [PassToeic Bẫy Đồng Âm] Why was the client presentation postponed?",
                    options: [
                        "A. At the main post office. (Bẫy đồng âm 'postponed' - 'post')",
                        "B. Because the projector was being repaired.",
                        "C. I bought a birthday present. (Bẫy đồng âm 'presentation' - 'present')"
                    ],
                    ans: 1,
                    steps: [
                        "1. Nhận diện câu hỏi: 'Why' (Tại sao buổi thuyết trình bị hoãn?).",
                        "2. Tránh bẫy đồng âm PassToeic: Loại ngay A (chứa từ 'post') và C (chứa từ 'present').",
                        "3. Kết luận: Chọn B (Vì máy chiếu đang được sửa chữa)."
                    ]
                }
            ],
            listening_part3: [
                {
                    audioScript: "Woman: Hi Daniel, did the supplier confirm the delivery date for the new office chairs? Man: Yes, they will arrive this Thursday morning, right before our client workshop.",
                    passage: "<strong>🎧 Transcript Part 3:</strong><br><strong>W:</strong> Hi Daniel, did the supplier confirm the delivery date for the new office chairs?<br><strong>M:</strong> Yes, they will arrive this Thursday morning, right before our client workshop.",
                    q: "When are the new office chairs scheduled to arrive?",
                    options: ["A. On Tuesday afternoon", "B. On Thursday morning", "C. Next Monday", "D. After the client workshop"],
                    ans: 1,
                    steps: [
                        "1. Từ khóa câu hỏi: 'When ... new office chairs scheduled to arrive'.",
                        "2. Nghe thông tin từ người đàn ông: 'they will arrive this Thursday morning'.",
                        "3. Kết luận: Chọn B."
                    ]
                }
            ],
            listening_part4: [
                {
                    audioScript: "Attention all passengers waiting at Gate 14. Due to a mechanical inspection, Flight 402 to Seattle will be delayed by thirty minutes.",
                    passage: "<strong>🎧 Transcript Part 4 (Airport Announcement):</strong><br>Attention all passengers waiting at Gate 14. Due to a mechanical inspection, Flight 402 to Seattle will be delayed by 30 minutes.",
                    q: "Why is Flight 402 delayed?",
                    options: ["A. Severe weather conditions", "B. A mechanical inspection", "C. Late arrival of the crew", "D. Gate reassignment"],
                    ans: 1,
                    steps: [
                        "1. Từ khóa câu hỏi: 'Why is Flight 402 delayed?'.",
                        "2. Bắt cụm chỉ nguyên nhân 'Due to a mechanical inspection' (Do kiểm tra kỹ thuật).",
                        "3. Kết luận: Chọn B."
                    ]
                }
            ],
            reading: [
                {
                    q: "[Part 5] Customers who purchase more than three items online are _______ for free express shipping.",
                    options: ["A. eligible", "B. eligibility", "C. eligibly", "D. eligibleness"],
                    ans: 0,
                    steps: [
                        "1. Vị trí chỗ trống: Đứng sau động từ to-be 'are' và trước giới từ 'for'.",
                        "2. Cấu trúc Collocation TOEIC: 'be eligible for + Noun/V-ing' (đủ điều kiện hưởng cái gì).",
                        "3. Kết luận: Chọn A (eligible)."
                    ]
                }
            ],
            reading_part6: [
                {
                    passage: "<strong>To:</strong> All Staff<br><strong>From:</strong> Human Resources<br><strong>Subject:</strong> Annual Health Checkup<br><br>Please be reminded that the annual medical examination will be held on November 12. All full-time employees are required to register for a time slot online. _______, please bring your employee ID card to the clinic on the 3rd floor.",
                    q: "Chọn từ/cụm từ nối phù hợp nhất điền vào chỗ trống trong email trên:",
                    options: ["A. However", "B. In addition", "C. Otherwise", "D. For instance"],
                    ans: 1,
                    steps: [
                        "1. Phân tích mạch văn: Câu trước yêu cầu đăng ký khung giờ online, câu sau nhắc mang theo thẻ nhân viên.",
                        "2. Xét nghĩa: Hai câu bổ sung thêm thông tin hướng dẫn cùng chiều.",
                        "3. Kết luận: Chọn B (In addition = Ngoài ra / Thêm vào đó)."
                    ]
                }
            ],
            reading_part7: [
                {
                    passage: "<strong>MEMORANDUM</strong><br><strong>To:</strong> Sales Department Staff<br><strong>From:</strong> Kevin Brooks, Facilities Manager<br><strong>Date:</strong> October 14<br>Starting this Saturday, the north parking garage will be closed for repainting and lighting upgrades. During this two-day period, employees may use the visitor parking lot on Elm Street at no cost.",
                    q: "According to the memo, where can employees park this weekend?",
                    options: [
                        "A. In the north parking garage",
                        "B. In the underground basement",
                        "C. In the visitor lot on Elm Street",
                        "D. Across from the train station"
                    ],
                    ans: 2,
                    steps: [
                        "1. Xác định từ khóa: 'where can employees park this weekend'.",
                        "2. Đối chiếu câu cuối bài đọc: 'During this two-day period, employees may use the visitor parking lot on Elm Street'.",
                        "3. Kết luận: Chọn C."
                    ]
                }
            ],
            mock: [
                {
                    q: "[Mock Test 2026 - Q101] The new accounting software has _______ reduced the time needed to process monthly payroll.",
                    options: ["A. significant", "B. significance", "C. significantly", "D. signify"],
                    ans: 2,
                    steps: [
                        "1. Vị trí chỗ trống: Nằm giữa trợ động từ 'has' và động từ chính 'reduced'.",
                        "2. Xét ngữ pháp: Cần một Trạng từ (Adverb) đuôi '-ly' bổ nghĩa cho động từ 'reduced'.",
                        "3. Kết luận: Chọn C (significantly)."
                    ]
                }
            ]
        };

        // 4. LUYỆN NGHE CHÍNH TẢ (DAILYDICTATION.COM) ENGINE - UNLIMITED LESSONS (CEFR A1 -> C2)
        // =========================================================================
        const dictationDatabase = {
            a1: {
                badge: 'DailyDictation · CEFR A1 (Sơ cấp)',
                lessons: [
                    {
                        title: 'Bài 1: Lời chào & Tự giới thiệu (A1 Starter)',
                        sentences: [
                            {
                                en: "Hello, my name is David and I am from California.",
                                ipa: "/həˈloʊ maɪ neɪm ɪz ˈdeɪvɪd ænd aɪ æm frʌm ˌkælɪˈfɔːrnjə/",
                                vi: "Xin chào, tôi tên là David và tôi đến từ California."
                            },
                            {
                                en: "Nice to meet you, welcome to our city.",
                                ipa: "/naɪs tuː miːt juː ˈwelkəm tuː ˈaʊər ˈsɪti/",
                                vi: "Rất vui được gặp bạn, chào mừng bạn đến với thành phố của chúng tôi."
                            },
                            {
                                en: "I have a small cat and she likes sleeping in the garden.",
                                ipa: "/aɪ hæv ə smɔːl kæt ænd ʃiː laɪks ˈsliːpɪŋ ɪn ðə ˈɡɑːrdn/",
                                vi: "Tôi có một chú mèo nhỏ và nó thích ngủ trong vườn."
                            },
                            {
                                en: "Where is the nearest bus station, please?",
                                ipa: "/wer ɪz ðə ˈnɪrɪst bʌs ˈsteɪʃn pliːz/",
                                vi: "Làm ơn cho tôi hỏi trạm xe buýt gần nhất ở đâu ạ?"
                            }
                        ]
                    },
                    {
                        title: 'Bài 2: Mua sắm & Thói quen hàng ngày (A1 Daily)',
                        sentences: [
                            {
                                en: "How much does a cup of green tea cost?",
                                ipa: "/haʊ mʌtʃ dʌz ə kʌp əv ɡriːn tiː kɔːst/",
                                vi: "Một tách trà xanh này giá bao nhiêu tiền vậy?"
                            },
                            {
                                en: "I usually wake up at six o'clock every morning.",
                                ipa: "/aɪ ˈjuːʒuəli weɪk ʌp æt sɪks əˈklɑːk ˈevri ˈmɔːrnɪŋ/",
                                vi: "Tôi thường thức dậy lúc sáu giờ mỗi buổi sáng."
                            },
                            {
                                en: "She drinks fresh milk and eats bread for breakfast.",
                                ipa: "/ʃiː drɪŋks freʃ mɪlk ænd iːts bred fɔːr ˈbrekfəst/",
                                vi: "Cô ấy uống sữa tươi và ăn bánh mì cho bữa sáng."
                            }
                        ]
                    }
                ]
            },
            a2: {
                badge: 'DailyDictation · CEFR A2 (Cơ bản)',
                lessons: [
                    {
                        title: 'Bài 1: Gọi món tại nhà hàng & Đi lại (A2 Routine)',
                        sentences: [
                            {
                                en: "Could we have a table for two near the window, please?",
                                ipa: "/kʊd wiː hæv ə ˈteɪbl fɔːr tuː nɪr ðə ˈwɪndoʊ pliːz/",
                                vi: "Làm ơn cho chúng tôi một bàn cho hai người gần cửa sổ được không?"
                            },
                            {
                                en: "The train to London departs from platform four in ten minutes.",
                                ipa: "/ðə treɪn tuː ˈlʌndən dɪˈpɑːrts frʌm ˈplætfɔːrm fɔːr ɪn ten ˈmɪnɪts/",
                                vi: "Chuyến tàu đi London sẽ khởi hành từ sân ga số bốn trong mười phút nữa."
                            },
                            {
                                en: "I forgot to bring my umbrella, so I got wet in the rain.",
                                ipa: "/aɪ fərˈɡɑːt tuː brɪŋ maɪ ʌmˈbrelə soʊ aɪ ɡɑːt wet ɪn ðə reɪn/",
                                vi: "Tôi quên mang theo ô nên đã bị ướt trong cơn mưa."
                            }
                        ]
                    },
                    {
                        title: 'Bài 2: Kế hoạch cuối tuần & Du lịch (A2 Travel)',
                        sentences: [
                            {
                                en: "We are planning to visit the history museum this Saturday afternoon.",
                                ipa: "/wiː ɑːr ˈplænɪŋ tuː ˈvɪzɪt ðə ˈhɪstri mjuˈziːəm ðɪs ˈsætərdeɪ ˌæftərˈnuːn/",
                                vi: "Chúng tôi đang lên kế hoạch đi tham quan bảo tàng lịch sử vào chiều thứ Bảy này."
                            },
                            {
                                en: "Can you recommend a quiet hotel near the city center?",
                                ipa: "/kæn juː ˌrekəˈmend ə ˈkwaɪət hoʊˈtel nɪr ðə ˈsɪti ˈsentər/",
                                vi: "Bạn có thể giới thiệu một khách sạn yên tĩnh gần trung tâm thành phố không?"
                            }
                        ]
                    }
                ]
            },
            b1: {
                badge: 'DailyDictation · CEFR B1 (Trung cấp TOEIC 500-650)',
                lessons: [
                    {
                        title: 'Bài 1: Lịch làm việc công sở & Đặt hẹn (B1 Workplace)',
                        sentences: [
                            {
                                en: "The marketing director would like to reschedule the presentation to next Tuesday.",
                                ipa: "/ðə ˈmɑːrkɪtɪŋ dəˈrektər wʊd laɪk tuː ˌriːˈskedʒuːl ðə ˌpreznˈteɪʃn tuː nekst ˈtuːzdeɪ/",
                                vi: "Giám đốc tiếp thị muốn dời lại buổi thuyết trình sang thứ Ba tuần sau."
                            },
                            {
                                en: "Please make sure that all invoices are submitted before the end of the month.",
                                ipa: "/pliːz meɪk ʃʊr ðæt ɔːl ˈɪnvɔɪsɪz ɑːr səbˈmɪtɪd bɪˈfɔːr ði end əv ðə mʌnθ/",
                                vi: "Vui lòng đảm bảo rằng tất cả hóa đơn được nộp trước khi hết tháng."
                            },
                            {
                                en: "Customer feedback indicates that the new software is very easy to navigate.",
                                ipa: "/ˈkʌstəmər ˈfiːdbæk ˈɪndɪkeɪts ðæt ðə nuː ˈsɔːftwer ɪz ˈveri ˈiːzi tuː ˈnævɪɡeɪt/",
                                vi: "Phản hồi từ khách hàng cho thấy phần mềm mới rất dễ điều hướng."
                            }
                        ]
                    }
                ]
            },
            b2: {
                badge: 'DailyDictation · CEFR B2 (Trung cao TOEIC 650-800)',
                lessons: [
                    {
                        title: 'Bài 1: Chiến lược kinh doanh & Đàm phán hợp đồng (B2 Professional)',
                        sentences: [
                            {
                                en: "Despite fluctuating market conditions, our quarterly revenue surpassed expectations by fifteen percent.",
                                ipa: "/dɪˈspaɪt ˈflʌktʃueɪtɪŋ ˈmɑːrkɪt kənˈdɪʃnz ˈaʊər ˈkwɔːrtərli ˈrevənuː sərˈpæst ˌekspekˈteɪʃnz baɪ ˌfɪfˈtiːn pərˈsent/",
                                vi: "Bất chấp điều kiện thị trường biến động, doanh thu hàng quý của chúng tôi đã vượt kỳ vọng 15%."
                            },
                            {
                                en: "Legal representatives from both firms are currently finalizing the non-disclosure agreement.",
                                ipa: "/ˈliːɡl ˌreprɪˈzentətɪvz frʌm boʊθ fɜːrmz ɑːr ˈkɜːrəntli ˈfaɪnəlaɪzɪŋ ðə nɑːn dɪˈskloʊʒər əˈɡriːmənt/",
                                vi: "Đại diện pháp lý của hai công ty hiện đang hoàn tất thỏa thuận không tiết lộ thông tin."
                            },
                            {
                                en: "Implementing eco-friendly packaging significantly reduced transportation costs and carbon emissions.",
                                ipa: "/ˈɪmplɪmentɪŋ ˌiːkoʊ ˈfrendli ˈpækɪdʒɪŋ sɪɡˈnɪfɪkəntli rɪˈduːst ˌtrænspərˈteɪʃn kɔːsts ænd ˈkɑːrbən ɪˈmɪʃnz/",
                                vi: "Việc áp dụng bao bì thân thiện với môi trường đã giúp giảm đáng kể chi phí vận chuyển và lượng phát thải carbon."
                            }
                        ]
                    }
                ]
            },
            c1: {
                badge: 'DailyDictation · CEFR C1 (Cao cấp TOEIC 800+)',
                lessons: [
                    {
                        title: 'Bài 1: Kinh tế vĩ mô & Điều hành cấp cao (C1 Advanced)',
                        sentences: [
                            {
                                en: "The monetary committee decided to raise benchmark interest rates to curb persistent inflationary pressures.",
                                ipa: "/ðə ˈmɑːnɪteri kəˈmɪti dɪˈsaɪdɪd tuː reɪz ˈbentʃmɑːrk ˈɪntrəst reɪts tuː kɜːrb pərˈsɪstənt ɪnˈfleɪʃəneri ˈpreʃərz/",
                                vi: "Ủy ban tiền tệ đã quyết định nâng lãi suất cơ bản nhằm kiềm chế áp lực lạm phát dai dẳng."
                            },
                            {
                                en: "Pioneering technological breakthroughs necessitates considerable venture capital alongside rigorous scientific validation.",
                                ipa: "/ˌpaɪəˈnɪrɪŋ ˌteknəˈlɑːdʒɪkl ˈbreɪkθruːz nəˈsesɪteɪts kənˈsɪdərəbl ˈventʃər ˈkæpɪtl əˈlɔːŋsaɪd ˈrɪɡərəs ˌsaɪənˈtɪfɪk ˌvælɪˈdeɪʃn/",
                                vi: "Những đột phá công nghệ tiên phong đòi hỏi nguồn vốn đầu tư mạo hiểm đáng kể cùng với quá trình thẩm định khoa học nghiêm ngặt."
                            }
                        ]
                    }
                ]
            },
            c2: {
                badge: 'DailyDictation · CEFR C2 (Thành thạo bản xứ)',
                lessons: [
                    {
                        title: 'Bài 1: Hùng biện, Triết luận & Diễn ngôn bản xứ (C2 Mastery)',
                        sentences: [
                            {
                                en: "The keynote speaker eloquently elucidated how paradoxical economic paradigms inadvertently exacerbate socioeconomic disparities.",
                                ipa: "/ðə ˈkiːnoʊt ˈspiːkər ˈeləkwəntli ɪˈluːsɪdeɪtɪd haʊ ˌpærəˈdɑːksɪkl ˌiːkəˈnɑːmɪk ˈpærədaɪmz ˌɪnədˈvɜːrtntli ɪɡˈzæsərbeɪt ˌsoʊsioʊˌekəˈnɑːmɪk dɪˈspærətiz/",
                                vi: "Diễn giả chính đã làm sáng tỏ một cách hùng hồn việc các mô hình kinh tế nghịch lý đã vô tình làm trầm trọng thêm sự bất bình đẳng kinh tế - xã hội."
                            },
                            {
                                en: "Far from being mere happenstance, their sustained preponderance stemmed from an unrelenting adherence to operational excellence.",
                                ipa: "/fɑːr frʌm ˈbiːɪŋ mɪr ˈhæpnhæns ðer səˈsteɪnd prɪˈpɑːndərəns stemd frʌm ən ˌʌnrɪˈlentɪŋ ədˈhɪrəns tuː ˌɑːpəˈreɪʃənl ˈeksələns/",
                                vi: "Hoàn toàn không phải sự may rủi ngẫu nhiên, ưu thế vượt trội bền vững của họ bắt nguồn từ sự tuân thủ không ngừng nghỉ đối với sự xuất sắc trong vận hành."
                            }
                        ]
                    }
                ]
            },
            toeic: {
                badge: 'TOEIC Listening Dictation',
                lessons: [
                    {
                        title: 'Bài 1: Đặt lịch họp & Thông báo công sở (TOEIC Part 2 & 3)',
                        sentences: [
                            {
                                en: "Could you please send me the updated sales report by Friday afternoon?",
                                ipa: "/kʊd juː pliːz send miː ði ʌpˈdeɪtɪd seɪlz rɪˈpɔːrt baɪ ˈfraɪdeɪ ˌæftərˈnuːn/",
                                vi: "Bạn có thể vui lòng gửi cho tôi báo cáo bán hàng đã cập nhật trước chiều thứ Sáu được không?"
                            },
                            {
                                en: "The quarterly board meeting has been postponed until next Wednesday.",
                                ipa: "/ðə ˈkwɔːrtərli bɔːrd ˈmiːtɪŋ hæz biːn poʊstˈpoʊnd ənˈtɪl nekst ˈwenzdeɪ/",
                                vi: "Cuộc họp hội đồng quản trị hàng quý đã bị hoãn lại cho đến thứ Tư tuần sau."
                            },
                            {
                                en: "All visitors must present a photo identification card at the security desk.",
                                ipa: "/ɔːl ˈvɪzɪtərz mʌst prɪˈzent ə ˈfoʊtoʊ aɪˌdentɪfɪˈkeɪʃn kɑːrd æt ðə sɪˈkjʊrəti desk/",
                                vi: "Tất cả khách tham quan phải xuất trình thẻ căn cước có ảnh tại bàn an ninh."
                            },
                            {
                                en: "We offer a ten percent discount on all bulk orders over fifty items.",
                                ipa: "/wiː ˈɔːfər ə ten pərˈsent ˈdɪskaʊnt ɑːn ɔːl bʌlk ˈɔːrdərz ˈoʊvər ˈfɪfti ˈaɪtəmz/",
                                vi: "Chúng tôi giảm giá 10% cho tất cả các đơn đặt hàng số lượng lớn trên 50 sản phẩm."
                            },
                            {
                                en: "Should you have any further questions, please contact our customer service department.",
                                ipa: "/ʃʊd juː hæv ˈeni ˈfɜːrðər ˈkwestʃənz pliːz ˈkɑːntækt ˈaʊər ˈkʌstəmər ˈsɜːrvɪs dɪˈpɑːrtmənt/",
                                vi: "Nếu bạn có bất kỳ câu hỏi nào thêm, vui lòng liên hệ bộ phận chăm sóc khách hàng của chúng tôi."
                            }
                        ]
                    },
                    {
                        title: 'Bài 2: Tuyển dụng Nhân sự & Phỏng vấn (TOEIC Part 3)',
                        sentences: [
                            {
                                en: "The human resources director will interview three candidates this afternoon.",
                                ipa: "/ðə ˈhjuːmən ˈriːsɔːrsɪz dəˈrektər wɪl ˈɪntərvjuː θriː ˈkændɪdeɪts ðɪs ˌæftərˈnuːn/",
                                vi: "Giám đốc nhân sự sẽ phỏng vấn ba ứng viên vào chiều nay."
                            },
                            {
                                en: "Applicants are required to submit two letters of recommendation with their resume.",
                                ipa: "/ˈæplɪkənts ɑːr rɪˈkwaɪərd tuː səbˈmɪt tuː ˈletərz əv ˌrekəmenˈdeɪʃn wɪð ðer ˈrezəmeɪ/",
                                vi: "Các ứng viên được yêu cầu nộp hai thư giới thiệu kèm theo sơ yếu lý lịch."
                            },
                            {
                                en: "New employees must attend the orientation session in Conference Room B.",
                                ipa: "/nuː ɪmˈplɔɪiːz mʌst əˈtend ði ˌɔːriənˈteɪʃn ˈseʃn ɪn ˈkɑːnfərəns ruːm biː/",
                                vi: "Nhân viên mới phải tham dự buổi định hướng tại Phòng Hội nghị B."
                            },
                            {
                                en: "Our company provides comprehensive health insurance and paid annual leave.",
                                ipa: "/ˈaʊər ˈkʌmpəni prəˈvaɪdz ˌkɑːmprɪˈhensɪv helθ ɪnˈʃʊrəns ænd peɪd ˈænjuəl liːv/",
                                vi: "Công ty chúng tôi cung cấp bảo hiểm y tế toàn diện và nghỉ phép năm có lương."
                            },
                            {
                                en: "Ms. Davis was promoted to regional sales manager after five years of dedicated service.",
                                ipa: "/mɪz ˈdeɪvɪs wəz prəˈmoʊtɪd tuː ˈriːdʒənl seɪlz ˈmænɪdʒər ˈæftər faɪv jɪrz əv ˈdedɪkeɪtɪd ˈsɜːrvɪs/",
                                vi: "Cô Davis đã được thăng chức lên quản lý bán hàng khu vực sau 5 năm cống hiến."
                            }
                        ]
                    },
                    {
                        title: 'Bài 3: Đặt vé máy bay, Khách sạn & Công tác (TOEIC Part 4)',
                        sentences: [
                            {
                                en: "Flight two zero four to Tokyo has been delayed due to severe weather conditions.",
                                ipa: "/flaɪt tuː ˈzɪroʊ fɔːr tuː ˈtoʊkioʊ hæz biːn dɪˈleɪd duː tuː sɪˈvɪr ˈweðər kənˈdɪʃnz/",
                                vi: "Chuyến bay 204 đi Tokyo đã bị hoãn do điều kiện thời tiết khắc nghiệt."
                            },
                            {
                                en: "Passengers with boarding passes in Group A may now proceed to Gate Twelve.",
                                ipa: "/ˈpæsɪndʒərz wɪð ˈbɔːrdɪŋ ˈpæsɪz ɪn ɡruːp eɪ meɪ naʊ prəˈsiːd tuː ɡeɪt twelv/",
                                vi: "Hành khách có thẻ lên máy bay thuộc Nhóm A hiện có thể di chuyển ra Cổng số 12."
                            },
                            {
                                en: "Complimentary shuttle buses run between the airport terminal and the hotel every twenty minutes.",
                                ipa: "/ˌkɑːmplɪˈmentri ˈʃʌtl ˈbʌsɪz rʌn bɪˈtwiːn ði ˈerpɔːrt ˈtɜːrmɪnl ænd ðə hoʊˈtel ˈevri ˈtwenti ˈmɪnɪts/",
                                vi: "Xe buýt đưa đón miễn phí chạy giữa nhà ga sân bay và khách sạn mỗi 20 phút."
                            },
                            {
                                en: "Please keep your receipt if you wish to claim travel expense reimbursement.",
                                ipa: "/pliːz kiːp jʊr rɪˈsiːt ɪf juː wɪʃ tuː kleɪm ˈtrævl ɪkˈspens ˌriːɪmˈbɜːrsmənt/",
                                vi: "Vui lòng giữ lại biên lai nếu bạn muốn yêu cầu hoàn trả chi phí đi công tác."
                            }
                        ]
                    },
                    {
                        title: 'Bài 4: Giao hàng, Kho bãi & Hóa đơn (TOEIC Logistics)',
                        sentences: [
                            {
                                en: "The replacement parts you ordered were shipped via express courier this morning.",
                                ipa: "/ðə rɪˈpleɪsmənt pɑːrts juː ˈɔːrdərd wɜːr ʃɪpt ˈvaɪə ɪkˈspres ˈkʊriər ðɪs ˈmɔːrnɪŋ/",
                                vi: "Các linh kiện thay thế bạn đặt đã được gửi qua chuyển phát nhanh vào sáng nay."
                            },
                            {
                                en: "We apologize for the billing error on your monthly statement.",
                                ipa: "/wiː əˈpɑːlədʒaɪz fɔːr ðə ˈbɪlɪŋ ˈerər ɑːn jʊr ˈmʌnθli ˈsteɪtmənt/",
                                vi: "Chúng tôi xin lỗi vì sai sót thanh toán trên bảng sao kê hàng tháng của bạn."
                            },
                            {
                                en: "All warehouse staff must wear protective helmets and safety vests at all times.",
                                ipa: "/ɔːl ˈwerhaʊs stæf mʌst wer prəˈtektɪv ˈhelmɪts ænd ˈseɪfti vests æt ɔːl taɪmz/",
                                vi: "Tất cả nhân viên kho phải đội mũ bảo hộ và mặc áo phản quang mọi lúc."
                            }
                        ]
                    }
                ]
            },
            stories: {
                badge: 'DailyDictation · Short Stories',
                lessons: [
                    {
                        title: 'Bài 1: A Cup of Coffee at the Train Station',
                        sentences: [
                            {
                                en: "Every morning, David buys a hot cup of coffee before catching the seven thirty train.",
                                ipa: "/ˈevri ˈmɔːrnɪŋ ˈdeɪvɪd baɪz ə hɑːt kʌp əv ˈkɔːfi bɪˈfɔːr ˈkætʃɪŋ ðə ˈsevn ˈθɜːrti treɪn/",
                                vi: "Mỗi buổi sáng, David đều mua một ly cà phê nóng trước khi bắt chuyến tàu lúc 7 giờ 30."
                            },
                            {
                                en: "One rainy Tuesday, he realized that he had left his wallet on the kitchen table.",
                                ipa: "/wʌn ˈreɪni ˈtuːzdeɪ hiː ˈriːəlaɪzd ðæt hiː hæd left hɪz ˈwɑːlɪt ɑːn ðə ˈkɪtʃɪn ˈteɪbl/",
                                vi: "Vào một ngày thứ Ba mưa tầm tã, anh nhận ra mình đã để quên ví trên bàn bếp."
                            },
                            {
                                en: "A kind stranger standing behind him smiled and paid for his morning coffee.",
                                ipa: "/ə kaɪnd ˈstreɪndʒər ˈstændɪŋ bɪˈhaɪnd hɪm smaɪld ænd peɪd fɔːr hɪz ˈmɔːrnɪŋ ˈkɔːfi/",
                                vi: "Một người lạ tốt bụng đứng phía sau anh đã mỉm cười và trả tiền cho ly cà phê sáng của anh."
                            }
                        ]
                    },
                    {
                        title: 'Bài 2: The Lost Puppy in the Park',
                        sentences: [
                            {
                                en: "While walking through the city park on Sunday, Anna heard a soft sound near the bushes.",
                                ipa: "/waɪl ˈwɔːkɪŋ θruː ðə ˈsɪti pɑːrk ɑːn ˈsʌndeɪ ˈænə hɜːrd ə sɔːft saʊnd nɪr ðə ˈbʊʃɪz/",
                                vi: "Khi đang đi dạo qua công viên thành phố vào Chủ nhật, Anna nghe thấy một âm thanh nhỏ gần bụi cây."
                            },
                            {
                                en: "She found a little golden puppy wearing a blue collar with a phone number on it.",
                                ipa: "/ʃiː faʊnd ə ˈlɪtl ˈɡoʊldən ˈpʌpi ˈwerɪŋ ə bluː ˈkɑːlər wɪð ə foʊn ˈnʌmbər ɑːn ɪt/",
                                vi: "Cô tìm thấy một chú chó con màu vàng đeo vòng cổ màu xanh có ghi số điện thoại trên đó."
                            },
                            {
                                en: "Within thirty minutes, the grateful owner arrived and thanked Anna warmly.",
                                ipa: "/wɪˈðɪn ˈθɜːrti ˈmɪnɪts ðə ˈɡreɪtfl ˈoʊnər əˈraɪvd ænd θæŋkt ˈænə ˈwɔːrmli/",
                                vi: "Trong vòng 30 phút, người chủ biết ơn đã tới nơi và cảm ơn Anna nồng nhiệt."
                            }
                        ]
                    }
                ]
            },
            daily: {
                badge: 'DailyDictation · Daily Conversations',
                lessons: [
                    {
                        title: 'Bài 1: Rescheduling an Appointment',
                        sentences: [
                            {
                                en: "I am calling to see if we could reschedule our dental appointment for tomorrow.",
                                ipa: "/aɪ æm ˈkɔːlɪŋ tuː siː ɪf wiː kʊd ˌriːˈskedʒuːl ˈaʊər ˈdentl əˈpɔɪntmənt fɔːr təˈmɔːroʊ/",
                                vi: "Tôi gọi để xem liệu chúng ta có thể dời lịch hẹn khám răng vào ngày mai được không."
                            },
                            {
                                en: "Dr. Miller has an opening at three o'clock on Thursday afternoon.",
                                ipa: "/ˈdɑːktər ˈmɪlər hæz ən ˈoʊpənɪŋ æt θriː əˈklɑːk ɑːn ˈθɜːrzdeɪ ˌæftərˈnuːn/",
                                vi: "Bác sĩ Miller có một khung giờ trống lúc 3 giờ chiều thứ Năm."
                            },
                            {
                                en: "That time works perfectly for me, so please put me down for Thursday.",
                                ipa: "/ðæt taɪm wɜːrks ˈpɜːrfɪktli fɔːr miː soʊ pliːz pʊt miː daʊn fɔːr ˈθɜːrzdeɪ/",
                                vi: "Thời gian đó hoàn toàn phù hợp với tôi, vì vậy vui lòng xếp lịch cho tôi vào thứ Năm nhé."
                            }
                        ]
                    },
                    {
                        title: 'Bài 2: Returning a Defective Jacket',
                        sentences: [
                            {
                                en: "Excuse me, I bought this winter jacket yesterday, but the zipper is broken.",
                                ipa: "/ɪkˈskjuːz miː aɪ bɔːt ðɪs ˈwɪntər ˈdʒækɪt ˈjestərdeɪ bʌt ðə ˈzɪpər ɪz ˈbroʊkən/",
                                vi: "Xin lỗi, tôi đã mua chiếc áo khoác mùa đông này hôm qua nhưng khóa kéo bị hỏng."
                            },
                            {
                                en: "Would you like a full refund or would you prefer to exchange it for a new one?",
                                ipa: "/wʊd juː laɪk ə fʊl ˈriːfʌnd ɔːr wʊd juː prɪˈfɜːr tuː ɪksˈtʃeɪndʒ ɪt fɔːr ə nuː wʌn/",
                                vi: "Bạn muốn được hoàn tiền toàn bộ hay muốn đổi sang một chiếc mới?"
                            }
                        ]
                    }
                ]
            },
            ielts: {
                badge: 'DailyDictation · IELTS Listening',
                lessons: [
                    {
                        title: 'Bài 1: University Library Orientation',
                        sentences: [
                            {
                                en: "Undergraduate students may borrow up to twelve books for a period of three weeks.",
                                ipa: "/ˌʌndərˈɡrædʒuət ˈstuːdnts meɪ ˈbɑːroʊ ʌp tuː twelv bʊks fɔːr ə ˈpɪriəd əv θriː wiːks/",
                                vi: "Sinh viên đại học có thể mượn tối đa 12 cuốn sách trong thời hạn 3 tuần."
                            },
                            {
                                en: "The digital archive is located on the third floor next to the computer lab.",
                                ipa: "/ðə ˈdɪdʒɪtl ˈɑːrkaɪv ɪz ˈloʊkeɪtɪd ɑːn ðə θɜːrd flɔːr nekst tuː ðə kəmˈpjuːtər læb/",
                                vi: "Kho lưu trữ kỹ thuật số nằm ở tầng ba cạnh phòng máy tính."
                            },
                            {
                                en: "Late returns will incur a fine of fifty cents per day for each overdue item.",
                                ipa: "/leɪt rɪˈtɜːrnz wɪl ɪnˈkɜːr ə faɪn əv ˈfɪfti sents pɜːr deɪ fɔːr iːtʃ ˌoʊvərˈduː ˈaɪtəm/",
                                vi: "Trả sách trễ sẽ chịu mức phạt 50 xu mỗi ngày cho từng cuốn quá hạn."
                            }
                        ]
                    }
                ]
            },
            ted: {
                badge: 'DailyDictation · TED Talks',
                lessons: [
                    {
                        title: 'Bài 1: The Power of Small Daily Habits',
                        sentences: [
                            {
                                en: "Improving by just one percent every day leads to remarkable long term results.",
                                ipa: "/ɪmˈpruːvɪŋ baɪ dʒʌst wʌn pərˈsent ˈevri deɪ liːdz tuː rɪˈmɑːrkəbl lɔːŋ tɜːrm rɪˈzʌlts/",
                                vi: "Chỉ cần tốt hơn 1% mỗi ngày sẽ dẫn đến những kết quả dài hạn đáng kinh ngạc."
                            },
                            {
                                en: "Consistency is far more important than intensity when learning a new language.",
                                ipa: "/kənˈsɪstənsi ɪz fɑːr mɔːr ɪmˈpɔːrtnt ðæn ɪnˈtensəti wen ˈlɜːrnɪŋ ə nuː ˈlæŋɡwɪdʒ/",
                                vi: "Sự kiên trì đều đặn quan trọng hơn rất nhiều so với cường độ cao nhất thời khi học một ngôn ngữ mới."
                            }
                        ]
                    }
                ]
            }
        };

        // Extra Infinite Sentence Bank to inject whenever user clicks "+ Nạp thêm 10 câu mới"
        const infiniteDictationPool = [
            { en: "Please review the attached contract and return a signed copy by tomorrow morning.", ipa: "/pliːz rɪˈvjuː ði əˈtætʃt ˈkɑːntrækt ænd rɪˈtɜːrn ə saɪnd ˈkɑːpi baɪ təˈmɔːroʊ ˈmɔːrnɪŋ/", vi: "Vui lòng xem lại hợp đồng đính kèm và gửi lại bản có chữ ký trước sáng mai." },
            { en: "The annual shareholders meeting will take place at the Grand Ballroom in December.", ipa: "/ði ˈænjuəl ˈʃerhoʊldərz ˈmiːtɪŋ wɪl teɪk pleɪs æt ðə ɡrænd ˈbɔːlruːm ɪn dɪˈsembər/", vi: "Cuộc họp cổ đông thường niên sẽ diễn ra tại phòng Khánh tiết Lớn vào tháng 12." },
            { en: "Due to road construction, commuters are advised to take an alternative route.", ipa: "/duː tuː roʊd kənˈstrʌkʃn kəˈmjuːtərz ɑːr ədˈvaɪzd tuː teɪk ən ɔːlˈtɜːrnətɪv ruːt/", vi: "Do công trình làm đường, người đi làm được khuyên nên đi tuyến đường thay thế." },
            { en: "All electronic devices must be switched to silent mode during the presentation.", ipa: "/ɔːl ɪˌlekˈtrɑːnɪk dɪˈvaɪsɪz mʌst biː swɪtʃt tuː ˈsaɪlənt moʊd ˈdʊrɪŋ ðə ˌpreznˈteɪʃn/", vi: "Tất cả thiết bị điện tử phải được chuyển sang chế độ im lặng trong suốt buổi thuyết trình." },
            { en: "Our customer support team is available twenty four hours a day, seven days a week.", ipa: "/ˈaʊər ˈkʌstəmər səˈpɔːrt tiːm ɪz əˈveɪləbl ˈtwenti fɔːr ˈaʊərz ə deɪ ˈsevn deɪz ə wiːk/", vi: "Đội ngũ hỗ trợ khách hàng của chúng tôi trực 24 giờ mỗi ngày, 7 ngày một tuần." },
            { en: "The new marketing campaign helped increase online sales by thirty five percent.", ipa: "/ðə nuː ˈmɑːrkɪtɪŋ kæmˈpeɪn helpt ɪnˈkriːs ˈɑːnlaɪn seɪlz baɪ ˈθɜːrti faɪv pərˈsent/", vi: "Chiến dịch tiếp thị mới đã giúp tăng doanh số trực tuyến thêm 35%." },
            { en: "Complimentary refreshments will be served in the lobby during the intermission.", ipa: "/ˌkɑːmplɪˈmentri rɪˈfreʃmənts wɪl biː sɜːrvd ɪn ðə ˈlɑːbi ˈdʊrɪŋ ði ˌɪntərˈmɪʃn/", vi: "Đồ ăn thức uống nhẹ miễn phí sẽ được phục vụ tại sảnh trong giờ nghỉ giải lao." },
            { en: "Employees who wish to work overtime must obtain prior approval from their supervisor.", ipa: "/ɪmˈplɔɪiːz huː wɪʃ tuː wɜːrk ˈoʊvərtaɪm mʌst əbˈteɪn ˈpraɪər əˈpruːvl frʌm ðer ˈsuːpərvaɪzər/", vi: "Nhân viên muốn làm thêm giờ phải có sự chấp thuận trước từ người giám sát." },
            { en: "The warranty covers any manufacturing defects for up to two years from the purchase date.", ipa: "/ðə ˈwɔːrənti ˈkʌvərz ˈeni ˌmænjuˈfæktʃərɪŋ ˈdiːfekts fɔːr ʌp tuː tuː jɪrz frʌm ðə ˈpɜːrtʃəs deɪt/", vi: "Chế độ bảo hành chi trả cho mọi lỗi sản xuất tối đa 2 năm kể từ ngày mua." },
            { en: "We would appreciate it if you could complete our short customer satisfaction survey.", ipa: "/wiː wʊd əˈpriːʃieɪt ɪt ɪf juː kʊd kəmˈpliːt ˈaʊər ʃɔːrt ˈkʌstəmər ˌsætɪsˈfækʃn ˈsɜːrveɪ/", vi: "Chúng tôi rất cảm kích nếu bạn có thể hoàn thành bản khảo sát ngắn về mức độ hài lòng của khách hàng." }
        ];

        let currentDictCat = 'a1';
        let currentDictLessonIdx = 0;
        let currentDictIdx = 0;
        let currentDictSpeed = 0.95;
        let revealedWordIndices = new Set();

        function getActiveDictationLesson() {
            const cat = dictationDatabase[currentDictCat] || dictationDatabase.a1;
            if (!cat || !cat.lessons || cat.lessons.length === 0) return null;
            if (currentDictLessonIdx >= cat.lessons.length) currentDictLessonIdx = 0;
            return cat.lessons[currentDictLessonIdx];
        }

        function selectDictationCategory(catKey, btnEl) {
            currentDictCat = catKey;
            currentDictLessonIdx = 0;
            currentDictIdx = 0;
            revealedWordIndices.clear();
            if (btnEl) {
                document.querySelectorAll('.dict-cat-btn').forEach(b => {
                    b.className = 'dict-cat-btn px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 text-xs font-bold hover:border-indigo-400 transition';
                });
                btnEl.className = 'dict-cat-btn px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-sm transition';
            }
            renderDictationWorkspace();
        }

        function selectDictationLesson(lessonIdx) {
            currentDictLessonIdx = lessonIdx;
            currentDictIdx = 0;
            revealedWordIndices.clear();
            renderDictationWorkspace();
            playCurrentDictationAudio();
        }

        function renderDictationLessonPills() {
            const bar = document.getElementById('dictationLessonPillsBar');
            if (!bar) return;
            const cat = dictationDatabase[currentDictCat];
            if (!cat || !cat.lessons) return;

            bar.innerHTML = cat.lessons.map((les, idx) => {
                const active = idx === currentDictLessonIdx;
                return `<button onclick="selectDictationLesson(${idx})" class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${active ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-indigo-50'}">
                    Bài ${idx + 1} (${les.sentences.length} câu)
                </button>`;
            }).join('');
        }

        function generateMoreDictationSentences() {
            const lesson = getActiveDictationLesson();
            if (!lesson) return;
            infiniteDictationPool.forEach(item => {
                if (!lesson.sentences.some(s => s.en === item.en)) {
                    lesson.sentences.push({ ...item });
                }
            });
            // Also generate dynamic variations if already added
            if (lesson.sentences.length > 12) {
                const n = lesson.sentences.length + 1;
                lesson.sentences.push({
                    en: `All department managers are requested to submit their budget proposals before the end of week ${n}.`,
                    ipa: `/ɔːl dɪˈpɑːrtmənt ˈmænɪdʒərz ɑːr rɪˈkwestɪd tuː səbˈmɪt ðer ˈbʌdʒɪt prəˈpoʊzlz/`,
                    vi: `Tất cả các trưởng bộ phận được yêu cầu nộp đề xuất ngân sách trước cuối tuần thứ ${n}.`
                });
            }
            renderDictationWorkspace();
            showToast(`⚡ Đã nạp thêm câu mới! Bài hiện tại có ${lesson.sentences.length} câu (Không giới hạn trong ngày).`);
        }

        function toggleCustomDictationCreator() {
            const box = document.getElementById('customDictationCreatorBox');
            if (box) box.classList.toggle('hidden');
        }

        function addCustomDictationSentenceToCurrentLesson() {
            const en = (document.getElementById('customDictEnInput')?.value || '').trim();
            const vi = (document.getElementById('customDictViInput')?.value || '').trim() || 'Câu tiếng Anh tự thêm để luyện nghe chép chính tả.';
            if (!en) {
                showToast('Vui lòng nhập câu tiếng Anh bạn muốn luyện nghe!');
                return;
            }
            const lesson = getActiveDictationLesson();
            if (!lesson) return;
            lesson.sentences.push({
                en: en,
                ipa: '/🔊 Phát âm chuẩn Web Speech API/',
                vi: vi
            });
            currentDictIdx = lesson.sentences.length - 1;
            revealedWordIndices.clear();
            document.getElementById('customDictEnInput').value = '';
            document.getElementById('customDictViInput').value = '';
            document.getElementById('customDictationCreatorBox').classList.add('hidden');
            renderDictationWorkspace();
            playCurrentDictationAudio();
            showToast('✨ Đã thêm câu mới vào danh sách và phát âm ngay!');
        }

        function setDictationSpeed(spd, btnEl) {
            currentDictSpeed = spd;
            document.querySelectorAll('.dict-spd-btn').forEach(b => {
                b.className = 'dict-spd-btn px-2.5 py-1 rounded-lg bg-white text-slate-600 text-xs font-bold border';
            });
            btnEl.className = 'dict-spd-btn px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-bold border border-indigo-600';
            playCurrentDictationAudio();
        }

        function cleanWord(w) {
            return w.toLowerCase().replace(/[^a-z0-9']/g, '');
        }

        function renderDictationWorkspace() {
            const cat = dictationDatabase[currentDictCat];
            const lesson = getActiveDictationLesson();
            if (!cat || !lesson || !lesson.sentences[currentDictIdx]) return;

            renderDictationLessonPills();

            const badgeEl = document.getElementById('dictationTopicBadge');
            const titleEl = document.getElementById('dictationLessonTitle');
            const counterEl = document.getElementById('dictationSentenceCounter');
            const inputEl = document.getElementById('dictationInput');
            const fbBoxEl = document.getElementById('dictationFeedbackBox');

            if (badgeEl) badgeEl.textContent = cat.badge;
            if (titleEl) titleEl.textContent = lesson.title;
            if (counterEl) counterEl.textContent = `Câu ${currentDictIdx + 1} / ${lesson.sentences.length}`;
            if (inputEl) inputEl.value = '';
            if (fbBoxEl) fbBoxEl.classList.add('hidden');

            renderDictationMaskedWords();
            renderDictationSidebarList();
        }

        function renderDictationMaskedWords() {
            const maskedContainer = document.getElementById('dictationMaskedWords');
            if (!maskedContainer) return;
            const lesson = getActiveDictationLesson();
            if (!lesson) return;
            const item = lesson.sentences[currentDictIdx];
            const words = item.en.split(' ');
            const inputEl = document.getElementById('dictationInput');
            const userTypedWords = (inputEl ? inputEl.value : '')
                .trim()
                .split(/\s+/)
                .map(w => cleanWord(w));

            const html = words.map((word, idx) => {
                const targetClean = cleanWord(word);
                const isMatched = userTypedWords.includes(targetClean) || revealedWordIndices.has(idx);
                if (isMatched) {
                    return `<span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-extrabold transition">${word}</span>`;
                } else {
                    const stars = '*'.repeat(Math.max(3, word.length));
                    return `<span class="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-700 text-xs font-mono tracking-widest">${stars}</span>`;
                }
            }).join('');

            maskedContainer.innerHTML = html;
        }

        function renderDictationSidebarList() {
            const lesson = getActiveDictationLesson();
            const listEl = document.getElementById('dictationSentenceListSidebar');
            if (!listEl || !lesson) return;
            listEl.innerHTML = lesson.sentences.map((s, idx) => {
                const active = idx === currentDictIdx;
                return `
                    <button onclick="currentDictIdx=${idx}; revealedWordIndices.clear(); renderDictationWorkspace(); playCurrentDictationAudio();" class="w-full text-left p-3 rounded-2xl border text-xs transition flex items-center justify-between ${active ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-extrabold' : 'bg-white dark:bg-slate-800 border-slate-200/80 text-slate-600 dark:text-slate-300 hover:border-indigo-300'}">
                        <span class="truncate pr-2">Câu ${idx + 1}: ${s.vi}</span>
                        <i class="fa-solid ${active ? 'fa-volume-high text-indigo-600' : 'fa-play text-slate-300'} text-xs shrink-0"></i>
                    </button>
                `;
            }).join('');
        }

        function handleDictationLiveTyping() {
            renderDictationMaskedWords();
        }

        function revealNextDictationWord() {
            const lesson = getActiveDictationLesson();
            if (!lesson) return;
            const words = lesson.sentences[currentDictIdx].en.split(' ');
            for (let i = 0; i < words.length; i++) {
                if (!revealedWordIndices.has(i)) {
                    revealedWordIndices.add(i);
                    break;
                }
            }
            renderDictationMaskedWords();
        }

        function playCurrentDictationAudio() {
            const lesson = getActiveDictationLesson();
            if (!lesson) return;
            const item = lesson.sentences[currentDictIdx];
            if (window.UniversalAudioEngine) {
                window.UniversalAudioEngine.setSpeed(currentDictSpeed);
                window.UniversalAudioEngine.speak(item.en, { rate: currentDictSpeed });
            } else if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(item.en);
                u.lang = 'en-US';
                u.rate = currentDictSpeed;
                window.speechSynthesis.speak(u);
            } else {
                showToast('Trình duyệt không hỗ trợ phát giọng nói.');
            }
        }

        function checkDictationSubmission() {
            const lesson = getActiveDictationLesson();
            if (!lesson) return;
            const item = lesson.sentences[currentDictIdx];
            const words = item.en.split(' ');
            words.forEach((_, idx) => revealedWordIndices.add(idx));
            renderDictationMaskedWords();

            const userRaw = (document.getElementById('dictationInput').value || '').trim();
            const isExact = cleanWord(userRaw) === cleanWord(item.en);

            state.dictationDone++;
            state.listenDone++;
            state.xp += 10;
            state.streak = Math.max(1, state.streak);
            document.getElementById('dictationDoneCount').textContent = `${state.dictationDone} câu`;
            updateDashboardMetrics();

            const fbBox = document.getElementById('dictationFeedbackBox');
            document.getElementById('dictationStatusLabel').textContent = isExact
                ? '🎉 Xuất sắc! Bạn đã nghe và gõ chính xác 100% (+10 XP)!'
                : '✨ Đã đối chiếu đáp án! Hãy xem kỹ phiên âm IPA và các từ được mở khóa (+10 XP):';
            document.getElementById('dictationFullEn').textContent = item.en;
            document.getElementById('dictationIpa').textContent = item.ipa;
            document.getElementById('dictationVi').textContent = `Dịch nghĩa: ${item.vi}`;
            fbBox.classList.remove('hidden');
            playCurrentDictationAudio();
            if (window.StudySync) {
                window.StudySync.broadcastLearning('DICTATION_PASSED', item.en.substring(0, 30) + '...', 10);
            }
        }

        function showFullDictationAnswer() {
            const lesson = getActiveDictationLesson();
            if (!lesson) return;
            const item = lesson.sentences[currentDictIdx];
            document.getElementById('dictationInput').value = item.en;
            checkDictationSubmission();
        }

        function nextDictationSentence() {
            const lesson = getActiveDictationLesson();
            if (!lesson) return;
            if (currentDictIdx < lesson.sentences.length - 1) {
                currentDictIdx++;
            } else {
                // Automatically advance to next lesson or generate more sentences so user is NEVER limited!
                const cat = dictationDatabase[currentDictCat];
                if (currentDictLessonIdx < cat.lessons.length - 1) {
                    currentDictLessonIdx++;
                    currentDictIdx = 0;
                    showToast(`🎧 Đã chuyển sang ${cat.lessons[currentDictLessonIdx].title}!`);
                } else {
                    generateMoreDictationSentences();
                    currentDictIdx++;
                }
            }
            revealedWordIndices.clear();
            renderDictationWorkspace();
            playCurrentDictationAudio();
        }

        function prevDictationSentence() {
            const lesson = getActiveDictationLesson();
            if (!lesson) return;
            currentDictIdx = (currentDictIdx - 1 + lesson.sentences.length) % lesson.sentences.length;
            revealedWordIndices.clear();
            renderDictationWorkspace();
            playCurrentDictationAudio();
        }

        function saveDictationToTakeNote() {
            const lesson = getActiveDictationLesson();
            if (!lesson) return;
            const item = lesson.sentences[currentDictIdx];
            appendSnippetToTakeNote(
                `[Nghe chính tả] ${lesson.title}`,
                'Ngữ pháp',
                `<p><strong>🎧 Câu nghe:</strong> ${item.en}</p><p><em>Phiên âm:</em> ${item.ipa}</p><p><em>Nghĩa:</em> ${item.vi}</p><hr>`
            );
        }

        // =========================================================================
        // 5. TỪ VỰNG TRONG PHIM (YOUGLISH.COM) ENGINE
        // =========================================================================
        const movieClipsDatabase = [
            {
                word: 'schedule',
                ipa: '🇺🇸 /ˈskedʒuːl/ · 🇬🇧 /ˈʃedjuːl/',
                meaning: '(n, v) Lịch trình, tiến độ, sắp xếp lịch hẹn',
                movie: 'SUITS (SEASON 2, EPISODE 4) · US ACCENT 🇺🇸',
                en: 'We are already behind <span class="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950">schedule</span>, so let\'s finalize the contract tonight.',
                rawEn: "We are already behind schedule, so let's finalize the contract tonight.",
                vi: 'Chúng ta đã bị trễ tiến độ rồi, vì vậy hãy chốt hợp đồng ngay tối nay nhé.',
                collocations: [
                    '• <strong>behind schedule:</strong> trễ tiến độ',
                    '• <strong>ahead of schedule:</strong> vượt trước tiến độ',
                    '• <strong>on a tight schedule:</strong> lịch trình dày đặc'
                ]
            },
            {
                word: 'negotiate',
                ipa: '🇺🇸 /nɪˈɡoʊʃieɪt/ · 🇬🇧 /nɪˈɡəʊʃieɪt/',
                meaning: '(v) Đàm phán, thương lượng (hợp đồng, mức lương)',
                movie: 'THE DEVIL WEARS PRADA · US ACCENT 🇺🇸',
                en: 'Our legal team is ready to <span class="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950">negotiate</span> better terms with the supplier.',
                rawEn: 'Our legal team is ready to negotiate better terms with the supplier.',
                vi: 'Đội ngũ pháp lý của chúng tôi đã sẵn sàng đàm phán các điều khoản tốt hơn với nhà cung cấp.',
                collocations: [
                    '• <strong>negotiate a contract:</strong> đàm phán hợp đồng',
                    '• <strong>negotiate with someone:</strong> thương lượng với ai',
                    '• <strong>open to negotiation:</strong> có thể thương lượng thêm'
                ]
            },
            {
                word: 'abide by',
                ipa: '🇺🇸 /əˈbaɪd baɪ/ · 🇬🇧 /əˈbaɪd baɪ/',
                meaning: '(phr.v) Tuân thủ nghiêm ngặt (luật lệ, thỏa thuận, quyết định)',
                movie: 'BILLIONS (SEASON 3) · BUSINESS DRAMA 🇺🇸',
                en: 'If you want to work here, you have to <span class="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950">abide by</span> the company\'s safety regulations.',
                rawEn: "If you want to work here, you have to abide by the company's safety regulations.",
                vi: 'Nếu bạn muốn làm việc ở đây, bạn phải tuân thủ các quy định an toàn của công ty.',
                collocations: [
                    '• <strong>abide by the rules:</strong> tuân thủ quy tắc',
                    '• <strong>abide by the agreement:</strong> tôn trọng thỏa thuận',
                    '• <strong>Đồng nghĩa TOEIC:</strong> comply with = adhere to'
                ]
            },
            {
                word: 'deadline',
                ipa: '🇺🇸 /ˈdedlaɪn/ · 🇬🇧 /ˈdedlaɪn/',
                meaning: '(n) Hạn chót hoàn thành công việc',
                movie: 'THE INTERN (2015) · ROBERT DE NIRO & ANNE HATHAWAY 🇺🇸',
                en: 'Can we extend the <span class="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950">deadline</span> for the marketing proposal until Monday?',
                rawEn: 'Can we extend the deadline for the marketing proposal until Monday?',
                vi: 'Chúng ta có thể gia hạn hạn chót cho bản đề xuất tiếp thị đến thứ Hai được không?',
                collocations: [
                    '• <strong>meet the deadline:</strong> kịp hạn chót',
                    '• <strong>miss the deadline:</strong> trễ hạn chót',
                    '• <strong>extend the deadline:</strong> gia hạn thêm'
                ]
            },
            {
                word: 'out of the blue',
                ipa: '🇺🇸 /aʊt əv ðə bluː/',
                meaning: '(idiom) Bất ngờ, đột ngột không báo trước',
                movie: 'FRIENDS (SEASON 5, EPISODE 12) · SITCOM 🇺🇸',
                en: 'She called me completely <span class="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950">out of the blue</span> and offered me the manager position!',
                rawEn: 'She called me completely out of the blue and offered me the manager position!',
                vi: 'Cô ấy bất ngờ gọi cho tôi không báo trước và đề nghị cho tôi vị trí quản lý!',
                collocations: [
                    '• <strong>appear out of the blue:</strong> xuất hiện hoàn toàn bất ngờ',
                    '• <strong>Đồng nghĩa:</strong> unexpectedly = all of a sudden'
                ]
            },
            {
                word: 'promotion',
                ipa: '🇺🇸 /prəˈmoʊʃn/ · 🇬🇧 /prəˈməʊʃn/',
                meaning: '(n) Sự thăng chức; chiến dịch khuyến mãi quảng bá',
                movie: 'THE OFFICE (SEASON 4) · US SITCOM 🇺🇸',
                en: 'Everyone congratulated Michael on his well-deserved <span class="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950">promotion</span> to Regional Director.',
                rawEn: 'Everyone congratulated Michael on his well-deserved promotion to Regional Director.',
                vi: 'Mọi người đều chúc mừng Michael vì sự thăng chức hoàn toàn xứng đáng lên Giám đốc Vùng.',
                collocations: [
                    '• <strong>get a promotion:</strong> được thăng chức',
                    '• <strong>sales promotion:</strong> chương trình khuyến mãi bán hàng'
                ]
            },
            {
                word: 'compromise',
                ipa: '🇺🇸 /ˈkɑːmprəmaɪz/ · 🇬🇧 /ˈkɒmprəmaɪz/',
                meaning: '(n, v) Sự thỏa hiệp, nhượng bộ lẫn nhau để đạt thỏa thuận',
                movie: 'TED TALKS · CHRIS VOSS ON NEGOTIATION 🎤',
                en: 'After three hours of discussion, both sides finally reached a <span class="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950">compromise</span>.',
                rawEn: 'After three hours of discussion, both sides finally reached a compromise.',
                vi: 'Sau ba giờ thảo luận, cả hai bên cuối cùng đã đạt được một sự thỏa hiệp.',
                collocations: [
                    '• <strong>reach a compromise:</strong> đạt được thỏa hiệp',
                    '• <strong>make a compromise:</strong> nhượng bộ'
                ]
            }
        ];

        let currentYgIdx = 0;
        let currentYgAccent = 'all';

        function renderYouGlishScene() {
            const clip = movieClipsDatabase[currentYgIdx];
            if (!clip) return;
            const setElText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
            const setElHtml = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };

            setElText('ygMovieTitle', clip.movie);
            setElText('ygClipCounter', `Cảnh phim ${currentYgIdx + 1} / ${movieClipsDatabase.length}`);
            setElHtml('ygSubtitleEn', `"${clip.en}"`);
            setElText('ygSubtitleVi', `"${clip.vi}"`);
            setElText('ygWordHeader', clip.word);
            setElText('ygWordIpa', clip.ipa);
            setElText('ygWordMeaning', clip.meaning);
            setElHtml('ygWordCollocations', clip.collocations.map(c => `<div>${c}</div>`).join(''));

            const extUrl = `https://youglish.com/pronounce/${encodeURIComponent(clip.word)}/english${currentYgAccent !== 'all' ? '/' + currentYgAccent : ''}`;
            const linkEl = document.getElementById('youglishExternalLink');
            if (linkEl) linkEl.href = extUrl;
        }

        function quickSelectYouGlish(word) {
            document.getElementById('youglishSearchInput').value = word;
            searchYouGlishWord();
        }

        function searchYouGlishWord() {
            const q = (document.getElementById('youglishSearchInput').value || 'schedule').trim();
            const foundIdx = movieClipsDatabase.findIndex(c => c.word.toLowerCase() === q.toLowerCase());
            if (foundIdx !== -1) {
                currentYgIdx = foundIdx;
            } else {
                // Dynamically create a custom movie scene for any English word the user searches!
                movieClipsDatabase.push({
                    word: q,
                    ipa: `🔊 Phát âm chuẩn bản xứ cho "${q}"`,
                    meaning: `Từ/cụm từ khóa tra cứu trực tiếp: "${q}"`,
                    movie: `YOUGLISH CINEMA ARCHIVE · ${currentYgAccent.toUpperCase()} ACCENT`,
                    en: `In business meetings, knowing how to use <span class="px-2 py-0.5 rounded-lg bg-amber-400 text-slate-950">${q}</span> naturally makes a great impression.`,
                    rawEn: `In business meetings, knowing how to use ${q} naturally makes a great impression.`,
                    vi: `Trong các cuộc họp kinh doanh, biết cách sử dụng cụm "${q}" một cách tự nhiên sẽ tạo ấn tượng rất tốt.`,
                    collocations: [
                        `• Bấm <strong>"Nghe thoại US/UK"</strong> hoặc mở trực tiếp trên <strong>YouGlish.com</strong> để xem hàng trăm video YouTube chứa từ <strong>${q}</strong>.`
                    ]
                });
                currentYgIdx = movieClipsDatabase.length - 1;
            }
            renderYouGlishScene();
            speakCurrentMovieScene('en-US');
        }

        function setYouGlishAccent(acc, btnEl) {
            currentYgAccent = acc;
            document.querySelectorAll('.yg-acc-btn').forEach(b => {
                b.className = 'yg-acc-btn px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-300';
            });
            btnEl.className = 'yg-acc-btn px-3 py-1.5 rounded-xl bg-rose-600 text-white';
            renderYouGlishScene();
            speakCurrentMovieScene(acc === 'uk' ? 'en-GB' : 'en-US');
        }

        function speakCurrentMovieScene(lang = 'en-US') {
            const clip = movieClipsDatabase[currentYgIdx];
            if (!clip || !clip.rawEn) return;
            if (window.UniversalAudioEngine) {
                window.UniversalAudioEngine.speak(clip.rawEn, { lang: lang, rate: 0.96 });
            } else if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(clip.rawEn);
                u.lang = lang;
                u.rate = 0.96;
                window.speechSynthesis.speak(u);
            }
        }

        function nextMovieClip() {
            currentYgIdx = (currentYgIdx + 1) % movieClipsDatabase.length;
            document.getElementById('youglishSearchInput').value = movieClipsDatabase[currentYgIdx].word;
            renderYouGlishScene();
            speakCurrentMovieScene('en-US');
        }

        function prevMovieClip() {
            currentYgIdx = (currentYgIdx - 1 + movieClipsDatabase.length) % movieClipsDatabase.length;
            document.getElementById('youglishSearchInput').value = movieClipsDatabase[currentYgIdx].word;
            renderYouGlishScene();
            speakCurrentMovieScene('en-US');
        }

        function loadEmbeddedYouGlishWidget() {
            const wrapper = document.getElementById('youglishEmbedWrapper');
            if (wrapper) wrapper.classList.remove('hidden');
            const inputEl = document.getElementById('youglishSearchInput');
            const q = (inputEl ? inputEl.value : 'schedule').trim();
            const widgetLink = document.getElementById('yg-widget-0');
            if (widgetLink) widgetLink.setAttribute('data-query', q);

            if (!document.getElementById('youglish-script')) {
                const s = document.createElement('script');
                s.id = 'youglish-script';
                s.src = 'https://youglish.com/public/emb/widget.js';
                s.async = true;
                document.body.appendChild(s);
            } else if (window.YG && window.YG.Widget) {
                showToast(`Đang tải cảnh phim cho từ "${q}"...`);
            }
            showToast('🎬 Đã kích hoạt khung Video YouGlish!');
        }

        function saveMovieWordToTakeNote() {
            const clip = movieClipsDatabase[currentYgIdx];
            appendSnippetToTakeNote(
                `[Từ vựng Phim] ${clip.word}`,
                'Từ vựng',
                `<p><strong>🎬 Từ vựng:</strong> <span style="background:#fef08a;padding:2px 6px;border-radius:4px;">${clip.word}</span> (${clip.ipa}) — ${clip.meaning}</p><p><strong>Câu thoại phim (${clip.movie}):</strong> "${clip.rawEn}"</p><p><em>Dịch:</em> "${clip.vi}"</p><hr>`
            );
        }

        // =========================================================================
        // 6. PASSTOEIC.VN BILINGUAL STORY READING MODAL
        // =========================================================================
        const passToeicStories = [
            {
                day: 'Ngày 1 · Sự cố phòng họp (Conference Room Mix-up)',
                storyHtml: `
                    <p class="leading-relaxed text-[14px]">Sáng thứ Hai tại tập đoàn Apex, Minh được giao nhiệm vụ chuẩn bị cho buổi <span onclick="speakText('quarterly presentation')" class="cursor-pointer px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-bold" title="Bấm để nghe">quarterly presentation (bài thuyết trình hàng quý) 🔊</span>. Tuy nhiên, khi các <span onclick="speakText('executives')" class="cursor-pointer px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">executives (ban giám đốc điều hành) 🔊</span> bước vào phòng 302, chiếc máy chiếu bất ngờ bị <span onclick="speakText('malfunction')" class="cursor-pointer px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">malfunction (trục trặc hỏng hóc) 🔊</span>.</p>
                    <p class="leading-relaxed text-[14px] mt-2">Không chút bối rối, Minh lập tức liên hệ bộ phận <span onclick="speakText('maintenance department')" class="cursor-pointer px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">maintenance department (phòng bảo trì) 🔊</span> và chuyển cuộc họp sang phòng hội thảo dự phòng chỉ trong 5 phút. Nhờ sự nhạy bén đó, bản <span onclick="speakText('proposal')" class="cursor-pointer px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">proposal (bản đề xuất dự án) 🔊</span> đã được thông qua suôn sẻ!</p>
                `,
                q: 'Từ "malfunction" trong câu chuyện trên đồng nghĩa với cụm nào trong đề thi TOEIC Part 7?',
                options: ['A. Work properly', 'B. Fail to operate correctly', 'C. Schedule in advance'],
                ans: 1
            },
            {
                day: 'Ngày 2 · Thương lượng hợp đồng (Negotiating the Contract)',
                storyHtml: `
                    <p class="leading-relaxed text-[14px]">Để chuẩn bị ra mắt dòng sản phẩm mới, phòng Thu mua cần tìm một <span onclick="speakText('reliable supplier')" class="cursor-pointer px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">reliable supplier (nhà cung cấp đáng tin cậy) 🔊</span>. Ban đầu, mức báo giá vượt quá <span onclick="speakText('budget allocation')" class="cursor-pointer px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">budget allocation (ngân sách được phân bổ) 🔊</span> tới 15%.</p>
                    <p class="leading-relaxed text-[14px] mt-2">Sau hai buổi đàm phán, nhà cung cấp đồng ý chiết khấu nếu công ty cam kết ký <span onclick="speakText('long-term agreement')" class="cursor-pointer px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">long-term agreement (hợp đồng dài hạn) 🔊</span> và thanh toán <span onclick="speakText('invoice')" class="cursor-pointer px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">invoice (hóa đơn) 🔊</span> trong vòng 10 ngày.</p>
                `,
                q: 'Điều kiện để nhà cung cấp giảm giá trong câu chuyện là gì?',
                options: ['A. Ký hợp đồng dài hạn (long-term agreement)', 'B. Hủy đơn hàng cũ', 'C. Thay đổi địa điểm giao hàng'],
                ans: 0
            },
            {
                day: 'Ngày 3 · Chuyến công tác đột xuất (Last-minute Business Trip)',
                storyHtml: `
                    <p class="leading-relaxed text-[14px]">Chiều thứ Sáu, Lan nhận được thông báo phải bay đi Singapore để tham dự <span onclick="speakText('annual trade fair')" class="cursor-pointer px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">annual trade fair (hội chợ thương mại thường niên) 🔊</span>. Cô nhanh chóng kiểm tra lại <span onclick="speakText('itinerary')" class="cursor-pointer px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">itinerary (lịch trình chuyến đi) 🔊</span> và đặt <span onclick="speakText('accommodation')" class="cursor-pointer px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">accommodation (chỗ ở khách sạn) 🔊</span> gần trung tâm hội nghị.</p>
                    <p class="leading-relaxed text-[14px] mt-2">Mọi chi phí di chuyển đều sẽ được công ty <span onclick="speakText('reimburse')" class="cursor-pointer px-1.5 py-0.5 rounded bg-orange-100 text-orange-900 font-bold">reimburse (hoàn trả chi phí) 🔊</span> sau khi cô nộp đầy đủ biên lai cho phòng Kế toán.</p>
                `,
                q: 'Động từ "reimburse" thường xuất hiện trong TOEIC mang nghĩa là gì?',
                options: ['A. Đặt cọc trước', 'B. Hoàn trả lại tiền chi phí công tác', 'C. Phạt vi phạm hợp đồng'],
                ans: 1
            }
        ];

        function openPassToeicStoryModal() {
            if (!currentUserAccount) {
                if (window.currentUserAccount) currentUserAccount = window.currentUserAccount;
                else if (typeof window.getCurrentUser === 'function') currentUserAccount = window.getCurrentUser();
            }
            if (!currentUserAccount) {
                currentUserAccount = { id: 'guest-' + Date.now(), name: 'Học viên', isGuest: true };
                window.currentUserAccount = currentUserAccount;
                try { localStorage.setItem('cung_dang_session_user', JSON.stringify(currentUserAccount)); } catch(e) {}
            }
            selectPassToeicStory(0);
            const m = document.getElementById('passToeicStoryModal');
            m.classList.remove('hidden');
            m.classList.add('flex');
        }

        function closePassToeicStoryModal() {
            const m = document.getElementById('passToeicStoryModal');
            m.classList.add('hidden');
            m.classList.remove('flex');
        }

        function selectPassToeicStory(idx) {
            [0, 1, 2].forEach(i => {
                const b = document.getElementById(`ptStoryBtn${i}`);
                if (b) b.className = i === idx ? 'px-3.5 py-1.5 rounded-xl bg-orange-600 text-white text-xs font-bold' : 'px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold';
            });
            const st = passToeicStories[idx];
            document.getElementById('passToeicStoryContent').innerHTML = `
                <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-slate-800">
                    <div class="text-xs font-extrabold text-orange-800 uppercase">${st.day} · Bấm vào các từ tô màu cam để nghe phát âm</div>
                    ${st.storyHtml}
                </div>
                <div class="space-y-2">
                    <div class="text-xs font-extrabold text-slate-800 dark:text-white">Câu hỏi ôn từ vựng: ${st.q}</div>
                    ${st.options.map((opt, i) => `
                        <button onclick="if(${i}===${st.ans}){this.classList.add('bg-emerald-100','border-emerald-500'); state.xp+=5; state.readDone+=2; updateDashboardMetrics(); showToast('🎉 Chính xác! Bạn vừa tích lũy thêm từ vựng PassToeic (+5 XP)!');}else{this.classList.add('bg-rose-100','border-rose-500');}" class="w-full text-left p-3 rounded-xl border border-slate-200 text-xs font-semibold hover:border-orange-400 transition">${opt}</button>
                    `).join('')}
                </div>
            `;
        }

        // =========================================================================
        // 7. QUYỂN SỔ TAKE NOTE (DIGITAL NOTEBOOK) ENGINE
        // =========================================================================
        const defaultTakeNotes = [
            {
                id: 'note-1',
                title: '📌 Công thức Ngữ pháp TOEIC 5 giây (PassToeic & TART)',
                category: 'Ngữ pháp',
                paper: 'paper-lined',
                updatedAt: 'Hôm nay · 09:30',
                content: `<h3><strong>1. Quy tắc cụm Danh từ (Noun Phrase):</strong></h3><ul><li>Mạo từ (<em>a, an, the</em>) / Tính từ sở hữu (<em>his, her, our, their</em>) + <strong>[Adv] + [Adj] + Noun</strong>.</li><li>Trước giới từ (<em>in, on, at, of, for, with</em>) nếu có chỗ trống đứng sau <em>the/a</em> thì 99% điền <strong>Danh từ</strong>.</li></ul><h3><strong>2. Rút gọn Mệnh đề quan hệ:</strong></h3><ul><li>Chủ động (có tân ngữ phía sau) ➔ Dùng <span style="background-color: rgb(254, 240, 138);"><strong>V-ing</strong></span></li><li>Bị động (có giới từ <em>by, in, at, to</em> phía sau) ➔ Dùng <span style="background-color: rgb(187, 247, 208);"><strong>V3/ed</strong></span></li></ul>`
            },
            {
                id: 'note-2',
                title: '🎬 Từ vựng học qua Phim (YouGlish) & Nghe chính tả',
                category: 'Từ vựng',
                paper: 'paper-dotted',
                updatedAt: 'Hôm nay · 10:15',
                content: `<h3><strong>Tổng hợp Collocation ăn điểm TOEIC:</strong></h3><ul><li><strong>abide by = comply with = adhere to:</strong> tuân thủ (quy định, hợp đồng)</li><li><strong>behind schedule:</strong> trễ tiến độ ≠ <strong>ahead of schedule:</strong> vượt tiến độ</li><li><strong>out of the blue:</strong> hoàn toàn bất ngờ</li><li><strong>reimburse (v) / reimbursement (n):</strong> hoàn trả chi phí công tác</li></ul>`
            }
        ];

        let takeNotesList = [];
        let activeNoteId = 'note-1';
        let currentNoteTagFilter = 'ALL';

        window.takeNotesList = takeNotesList;
        window.activeNoteId = activeNoteId;

        function initTakeNotes() {
            try {
                const raw = localStorage.getItem('cung_dang_take_notes_v1');
                if (raw) {
                    takeNotesList = JSON.parse(raw);
                } else {
                    takeNotesList = defaultTakeNotes;
                }
            } catch (e) {
                takeNotesList = defaultTakeNotes;
            }
            if (takeNotesList.length > 0) {
                activeNoteId = takeNotesList[0].id;
                window.activeNoteId = activeNoteId;
            }
            window.takeNotesList = takeNotesList;
            renderTakeNoteSidebarList();
            loadActiveTakeNoteIntoEditor();
        }

        function persistTakeNotes() {
            try {
                if (window.takeNotesList && Array.isArray(window.takeNotesList)) {
                    takeNotesList = window.takeNotesList;
                }
                if (window.activeNoteId) {
                    activeNoteId = window.activeNoteId;
                }
                window.takeNotesList = takeNotesList;
                window.activeNoteId = activeNoteId;
                localStorage.setItem('cung_dang_take_notes_v1', JSON.stringify(takeNotesList));
            } catch (e) {
                if (e && (e.name === 'QuotaExceededError' || e.code === 22)) {
                    if (typeof showToast === 'function') {
                        showToast('⚠️ Bộ nhớ ghi chú sắp đầy do ảnh chụp lớn! Hãy xuất PDF hoặc xóa bớt ảnh.');
                    }
                }
            }
        }

        function filterTakeNoteTag(tag, btnEl) {
            currentNoteTagFilter = tag;
            document.querySelectorAll('.tn-tag-btn').forEach(b => {
                b.className = 'tn-tag-btn px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold';
            });
            btnEl.className = 'tn-tag-btn px-2.5 py-1 rounded-lg bg-amber-600 text-white text-xs font-bold';
            renderTakeNoteSidebarList();
        }

        function renderTakeNoteSidebarList() {
            const listEl = document.getElementById('takeNotePagesList');
            if (!listEl) return;
            const q = (document.getElementById('takeNoteSearchInput')?.value || '').toLowerCase().trim();

            const filtered = takeNotesList.filter(n => {
                const matchTag = currentNoteTagFilter === 'ALL' || n.category === currentNoteTagFilter;
                const searchablePreview = (n.previewText || n.content.slice(0, 600)).toLowerCase();
                const matchQ = !q || n.title.toLowerCase().includes(q) || searchablePreview.includes(q);
                return matchTag && matchQ;
            });

            if (filtered.length === 0) {
                listEl.innerHTML = `<div class="text-center py-8 text-xs text-slate-400">Không tìm thấy trang ghi chú nào.</div>`;
                return;
            }

            listEl.innerHTML = filtered.map(n => {
                const isActive = n.id === activeNoteId;
                const plainPreview = (n.previewText || n.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()).slice(0, 68);
                return `
                    <div onclick="selectTakeNotePage('${n.id}')" class="cursor-pointer p-3.5 rounded-2xl border transition ${isActive ? 'bg-amber-50/90 border-amber-400 shadow-sm dark:bg-slate-800' : 'bg-white dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-700 hover:border-amber-300'}">
                        <div class="flex items-center justify-between gap-2 mb-1">
                            <span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-extrabold">${n.category}</span>
                            <span class="text-xs text-slate-400">${n.updatedAt}</span>
                        </div>
                        <div class="text-[13.5px] font-extrabold text-slate-900 dark:text-white truncate">${n.title || 'Trang ghi chú chưa đặt tên'}</div>
                        <div class="text-xs text-slate-500 truncate mt-0.5">${plainPreview || 'Trang giấy trống...'}</div>
                    </div>
                `;
            }).join('');
        }

        function selectTakeNotePage(id) {
            activeNoteId = id;
            window.activeNoteId = id;
            renderTakeNoteSidebarList();
            loadActiveTakeNoteIntoEditor();
        }

        function loadActiveTakeNoteIntoEditor() {
            const note = takeNotesList.find(n => n.id === activeNoteId);
            if (!note) return;

            // Đóng PDF Studio cũ để giải phóng bộ nhớ khi chuyển trang ghi chú
            if (window.PdfStudio && window.PdfStudio.pdfDoc) {
                window.PdfStudio.destroy();
                const studioWorkspace = document.getElementById('pdfStudioWorkspace');
                if (studioWorkspace) studioWorkspace.remove();
            }

            const titleInput = document.getElementById('takeNoteTitleInput');
            const catSelect = document.getElementById('takeNoteCategorySelect');
            const paperSelect = document.getElementById('takeNotePaperStyle');
            const paperEl = document.getElementById('takeNoteEditorPaper');
            const tsEl = document.getElementById('takeNoteTimestamp');

            if (titleInput) titleInput.value = note.title;
            if (catSelect) catSelect.value = note.category;
            if (paperSelect) paperSelect.value = note.paper || 'paper-lined';
            if (paperEl) {
                paperEl.className = `${note.paper || 'paper-lined'} w-full min-h-[480px] lg:min-h-[calc(100vh-270px)] pt-5 px-6 pb-6 rounded-2xl border border-amber-200/90 dark:border-slate-700 focus:outline-none text-[15px] text-slate-800 dark:text-slate-100 shadow-inner overflow-y-auto`;
                paperEl.innerHTML = note.content;
                if (window.TakeNoteHybridEditor) window.TakeNoteHybridEditor.sanitizeTakeNoteDom(paperEl);
            }
            if (tsEl) tsEl.textContent = `Cập nhật: ${note.updatedAt}`;
            renderAttachedFilesBar(note);
            updateTakeNoteWordCount();
            if (window.TakeNoteHybridEditor) window.TakeNoteHybridEditor.updateBreadcrumbs();
        }

        function renderAttachedFilesBar(note) {
            const bar = document.getElementById('takeNoteAttachedFilesBar');
            const listEl = document.getElementById('takeNoteAttachedFilesList');
            if (!bar || !listEl) return;

            const files = note.attachedFiles || [];
            if (files.length === 0) {
                bar.classList.add('hidden');
                listEl.innerHTML = '';
                return;
            }

            bar.classList.remove('hidden');
            listEl.innerHTML = files.map((f, idx) => `
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-slate-700 text-xs shadow-sm">
                    <span class="font-extrabold text-indigo-600">${f.badge}</span>
                    <span class="font-bold text-slate-800 dark:text-slate-200 max-w-[180px] truncate" title="${f.name}">${f.name}</span>
                    <span class="text-xs text-slate-400">(${f.sizeFormatted})</span>
                    ${f.isPdf || (f.badge && f.badge.includes('PDF'))
                        ? `<button onclick="openExistingPdfInStudio('${f.fileId || ''}', '${escapeHtmlText(f.name)}', '${f.blockId}')" class="text-xs font-extrabold text-rose-600 hover:underline" title="Mở trong PDF Studio tương tác">⚡ Mở PDF Studio</button>`
                        : `<button onclick="scrollToImportedDoc('${f.blockId}')" class="text-xs font-bold text-blue-600 hover:underline" title="Di chuyển tới nội dung file này">Xem & Sửa</button>`
                    }
                </div>
            `).join('');
        }

        function scrollToImportedDoc(blockId) {
            const el = document.getElementById(blockId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('ring-2', 'ring-amber-500');
                setTimeout(() => el.classList.remove('ring-2', 'ring-amber-500'), 2000);
            }
        }

        function formatByteSize(bytes) {
            if (!bytes || bytes < 1024) return (bytes || 0) + ' B';
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
        }

        function handleNoteDragOver(e) {
            e.preventDefault();
            e.stopPropagation();
            const banner = document.getElementById('takeNoteDropBanner');
            const paper = document.getElementById('takeNoteEditorPaper');
            if (banner) banner.classList.add('dropzone-active');
            if (paper) paper.classList.add('dropzone-active');
        }

        function handleNoteDragLeave(e) {
            e.preventDefault();
            e.stopPropagation();
            const banner = document.getElementById('takeNoteDropBanner');
            const paper = document.getElementById('takeNoteEditorPaper');
            if (banner) banner.classList.remove('dropzone-active');
            if (paper) paper.classList.remove('dropzone-active');
        }

        async function handleNoteFileDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            handleNoteDragLeave(e);
            const files = e.dataTransfer?.files;
            if (files && files.length > 0) {
                await processMultipleNoteFiles(Array.from(files));
            }
        }

        async function handleNoteFileSelect(e) {
            const files = e.target?.files;
            if (files && files.length > 0) {
                await processMultipleNoteFiles(Array.from(files));
                e.target.value = '';
            }
        }

        async function processMultipleNoteFiles(fileArray) {
            const badge = document.getElementById('noteFileProcessingBadge');
            if (badge) badge.classList.remove('hidden');

            for (const file of fileArray) {
                await importSingleFileIntoNote(file);
            }

            if (badge) badge.classList.add('hidden');
            saveCurrentTakeNote();
        }

        async function importSingleFileIntoNote(file) {
            const note = takeNotesList.find(n => n.id === activeNoteId);
            if (!note) return;
            if (!note.attachedFiles) note.attachedFiles = [];

            const fileName = file.name || 'Tai_lieu';
            const ext = (fileName.split('.').pop() || '').toLowerCase();
            const blockId = 'doc-block-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
            const sizeFormatted = formatByteSize(file.size);
            const editor = document.getElementById('takeNoteEditorPaper');

            // Update note title if it's a fresh blank note
            if (note.title === '📝 Trang ghi chú mới' || !note.title.trim()) {
                note.title = `📂 ${fileName}`;
                const titleInput = document.getElementById('takeNoteTitleInput');
                if (titleInput) titleInput.value = note.title;
                note.category = 'Tài liệu File';
                const catSelect = document.getElementById('takeNoteCategorySelect');
                if (catSelect) catSelect.value = 'Tài liệu File';
            }

            try {
                let badgeLabel = '📄 FILE';
                let extractedHtml = '';
                let pdfFileId = null;

                // 1. WORD (.docx & .doc) -> Full Editable HTML (Handles both modern .docx and legacy binary OLE2 .doc)
                if (ext === 'docx' || ext === 'doc') {
                    badgeLabel = '📘 WORD';
                    if (!window.mammoth && window.DocumentToolkit) {
                        await window.DocumentToolkit.ensureWordMammoth();
                    }
                    const arrayBuffer = await file.arrayBuffer();
                    extractedHtml = await parseWordFileToCleanHtml(arrayBuffer, ext, fileName);
                }
                // 2. PDF (.pdf) -> Chuyên biệt với Interactive PDF Studio & IndexedDB binary caching
                else if (ext === 'pdf' || file.type === 'application/pdf') {
                    badgeLabel = '📕 PDF';
                    if (!window.pdfjsLib && window.DocumentToolkit) {
                        await window.DocumentToolkit.ensurePdfJs();
                    }
                    pdfFileId = 'pdf-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
                    const arrayBuffer = await file.arrayBuffer();

                    // Lưu file vào IndexedDB (không làm tràn localStorage 5MB)
                    if (window.PdfStorage) {
                        await window.PdfStorage.save(pdfFileId, arrayBuffer);
                    }

                    // Tải document với PDF.js để lấy số trang
                    let numPages = 1;
                    try {
                        const pdfDoc = await window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer.slice(0)) }).promise;
                        numPages = pdfDoc.numPages;
                    } catch (e) {
                        console.warn('Cannot pre-read PDF pages count:', e);
                    }

                    // Mở trực tiếp trong PDF Studio workspace ở chế độ Studio
                    if (window.PdfStudio) {
                        setTimeout(() => {
                            window.PdfStudio.openPdf(arrayBuffer, {
                                noteId: activeNoteId,
                                fileName: fileName,
                                fileId: pdfFileId,
                                fileSizeFormatted: sizeFormatted,
                                blockId: blockId
                            });
                        }, 50);
                    }

                    // Tạo khối thẻ Card nhẹ nhàng trên trang giấy (chỉ vài trăm bytes, không chứa base64 làm hỏng localStorage)
                    extractedHtml = `
                        <div class="my-3 p-4 rounded-2xl bg-rose-50/80 dark:bg-slate-800 border-2 border-rose-200 dark:border-rose-900/60 shadow-xs select-none">
                            <div class="flex flex-wrap items-center justify-between gap-3">
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold text-base shadow-sm shrink-0">
                                        <i class="fa-solid fa-file-pdf"></i>
                                    </div>
                                    <div>
                                        <h4 class="font-bold text-sm text-slate-800 dark:text-slate-100">${escapeHtmlText(fileName)}</h4>
                                        <p class="text-xs text-slate-500 dark:text-slate-400">Tài liệu PDF • ${numPages} trang • ${sizeFormatted} • Đã nạp vào PDF Studio</p>
                                    </div>
                                </div>
                                <div class="flex flex-wrap items-center gap-2">
                                    <button onclick="openExistingPdfInStudio('${pdfFileId}', '${escapeHtmlText(fileName)}', '${blockId}')" class="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-sm flex items-center gap-1.5 transition">
                                        <i class="fa-solid fa-bolt"></i>
                                        <span>Mở trong PDF Studio</span>
                                    </button>
                                    <button onclick="PdfStudio && PdfStudio.exportPdf()" class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-rose-100 text-rose-700 dark:text-rose-300 border border-rose-200 text-xs font-bold transition">
                                        <i class="fa-solid fa-download mr-1"></i> Xuất PDF mới
                                    </button>
                                </div>
                            </div>
                            <div class="mt-3 pt-2.5 border-t border-rose-200/60 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
                                <p class="font-medium italic">💡 <strong>Mẹo:</strong> Tài liệu đang mở trong <strong>PDF Studio</strong> phía trên. Bạn có thể lật trang, phóng to, xoay trang, tô sáng (Highlight), thêm chữ mới, che nội dung cũ và quét chữ ảnh (OCR) mà không làm vỡ định dạng trang.</p>
                            </div>
                        </div>
                    `;
                }
                // 3. EXCEL / CSV (.xlsx, .xls, .csv) -> Interactive Editable Table via SheetJS
                else if (['xlsx', 'xls', 'csv'].includes(ext)) {
                    badgeLabel = '📗 EXCEL';
                    if (!window.XLSX && window.DocumentToolkit) {
                        await window.DocumentToolkit.ensureExcelSheetJs();
                    }
                    if (window.XLSX) {
                        const arrayBuffer = await file.arrayBuffer();
                        const workbook = window.XLSX.read(arrayBuffer, { type: 'array' });
                        let sheetsHtml = '';
                        workbook.SheetNames.forEach((sheetName) => {
                            const worksheet = workbook.Sheets[sheetName];
                            const tableHtml = window.XLSX.utils.sheet_to_html(worksheet, { editable: true });
                            sheetsHtml += `
                                <div class="my-3">
                                    <div class="text-xs font-extrabold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-t-lg border border-emerald-200">
                                        📊 Bảng tính (Sheet): ${sheetName} — Nhấn vào bất kỳ ô nào để chỉnh sửa số liệu
                                    </div>
                                    <div class="overflow-x-auto">${tableHtml}</div>
                                </div>
                            `;
                        });
                        extractedHtml = sheetsHtml;
                    }
                }
                // 4. IMAGES (.png, .jpg, .jpeg, .webp, .gif, .svg)
                else if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(ext) || file.type.startsWith('image/')) {
                    badgeLabel = '🖼️ ẢNH';
                    const dataUrl = await readFileAsDataURL(file);
                    extractedHtml = `
                        <div class="my-2 text-center">
                            <img src="${dataUrl}" alt="${fileName}" class="max-w-full h-auto rounded-xl border border-slate-200 mx-auto shadow-sm" style="max-height: 520px;" />
                            <p class="text-xs text-slate-500 mt-1.5">✍️ <em>Ghi chú cho ảnh "${fileName}": Nhập mô tả hoặc từ vựng cần nhớ tại đây...</em></p>
                        </div>
                    `;
                }
                // 5. AUDIO / VIDEO (.mp3, .wav, .ogg, .mp4, .webm)
                else if (file.type.startsWith('audio/') || file.type.startsWith('video/') || ['mp3', 'wav', 'ogg', 'mp4'].includes(ext)) {
                    badgeLabel = '🎧 MEDIA';
                    const blobUrl = URL.createObjectURL(file);
                    const isVideo = file.type.startsWith('video/') || ext === 'mp4';
                    extractedHtml = `
                        <div class="my-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200">
                            ${isVideo
                                ? `<video controls src="${blobUrl}" class="w-full max-h-[360px] rounded-lg"></video>`
                                : `<audio controls src="${blobUrl}" class="w-full"></audio>`
                            }
                            <p class="mt-2 text-xs font-semibold text-indigo-700">📝 Bản chép lời / Ghi chú nội dung nghe (Bạn có thể gõ trực tiếp vào đây):</p>
                            <p>Nhập nội dung bạn nghe được từ file <strong>${fileName}</strong>...</p>
                        </div>
                    `;
                }
                // 6. ANY TEXT / MARKDOWN / CODE / HTML / JSON / SUBTITLES (.txt, .md, .srt, .html, .js, .py, etc.)
                else {
                    badgeLabel = '📝 TEXT';
                    const rawText = await readFileAsText(file);
                    const safeHtml = escapeHtmlText(rawText)
                        .split(/\r\n|\r|\n/)
                        .map(line => line.trim() ? `<p>${line}</p>` : '<p><br></p>')
                        .join('');
                    extractedHtml = safeHtml || '<p><em>File trống hoặc chưa có ký tự văn bản.</em></p>';
                }

                // Append metadata record
                const attachedRecord = {
                    name: fileName,
                    sizeFormatted: sizeFormatted,
                    badge: badgeLabel,
                    blockId: blockId
                };
                if (pdfFileId) {
                    attachedRecord.isPdf = true;
                    attachedRecord.fileId = pdfFileId;
                }
                note.attachedFiles.push(attachedRecord);

                // Build Interactive Editable Document Container inside the Note Paper
                const documentSectionHtml = `
                    <div id="${blockId}" class="doc-imported-block">
                        <div contenteditable="false" class="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-3 border-b border-slate-200 dark:border-slate-700 select-none">
                            <div class="flex items-center gap-2">
                                <span class="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-xs font-extrabold">${badgeLabel}</span>
                                <strong class="text-sm text-slate-900 dark:text-white">${fileName}</strong>
                                <span class="text-xs text-slate-400">(${sizeFormatted})</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">✏️ Đọc & Chỉnh sửa trực tiếp</span>
                                <button onclick="removeImportedDocBlock('${blockId}')" class="px-2 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold">Xóa khối file</button>
                            </div>
                        </div>
                        <div class="imported-doc-editable-body space-y-2 text-[14.5px] leading-relaxed">
                            ${extractedHtml}
                        </div>
                    </div>
                    <p><br></p>
                `;

                editor.insertAdjacentHTML('beforeend', documentSectionHtml);
                renderAttachedFilesBar(note);
                const newBlockEl = document.getElementById(blockId);
                if (newBlockEl) {
                    newBlockEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
                showToast(`📂 Đã đọc hoàn chỉnh nội dung file "${fileName}"! Bạn có thể bấm vào chữ hoặc bảng để sửa trực tiếp.`);
            } catch (err) {
                console.error('File import error:', err);
                const fallbackId = 'doc-err-' + Date.now();
                editor.insertAdjacentHTML('beforeend', `
                    <div id="${fallbackId}" class="doc-imported-block">
                        <p><strong>📂 ${escapeHtmlText(fileName)} (${sizeFormatted})</strong></p>
                        <p class="text-xs text-rose-600">Không thể phân tích tự động cấu trúc nâng cao của file này (${escapeHtmlText(err.message || 'Lỗi định dạng')}). Bạn có thể nhập hoặc dán nội dung trực tiếp vào bên dưới:</p>
                        <p><br></p>
                    </div>
                `);
                showToast(`⚠️ File "${fileName}" có cấu trúc đặc biệt, đã tạo khung soạn thảo cho bạn.`);
            }
        }

        async function parseWordFileToCleanHtml(arrayBuffer, ext, fileName) {
            const bytes = new Uint8Array(arrayBuffer);

            // Case 1: Check if file has ZIP header (PK\x03\x04) -> Modern .docx format
            const isZipContainer = bytes.length > 4 &&
                bytes[0] === 0x50 && bytes[1] === 0x4B && bytes[2] === 0x03 && bytes[3] === 0x04;

            if (isZipContainer) {
                if (window.mammoth) {
                    try {
                        const result = await window.mammoth.convertToHtml(
                            { arrayBuffer: arrayBuffer },
                            {
                                styleMap: [
                                    "p[style-name='Title'] => h1:fresh",
                                    "p[style-name='Heading 1'] => h2:fresh",
                                    "p[style-name='Heading 2'] => h3:fresh",
                                    "u => u"
                                ]
                            }
                        );
                        if (result && result.value && result.value.trim()) {
                            return result.value;
                        }
                    } catch (mammothErr) {
                        console.warn('Mammoth fallback to direct XML parser:', mammothErr);
                    }
                }
                // Fallback direct XML extraction from word/document.xml using SheetJS CFB ZIP reader
                const xmlFallback = extractDocxXmlViaCFB(bytes);
                if (xmlFallback) return xmlFallback;
            }

            // Case 2: Check if file is HTML / XML / MHTML saved with .doc extension
            const headAscii = new TextDecoder('ascii', { fatal: false }).decode(bytes.subarray(0, Math.min(512, bytes.length)));
            if (
                headAscii.includes('<html') ||
                headAscii.includes('<HTML') ||
                headAscii.includes('<!DOCTYPE') ||
                headAscii.includes('<w:WordDocument') ||
                headAscii.includes('MIME-Version:')
            ) {
                const isUtf16Le = bytes[0] === 0xFF && bytes[1] === 0xFE;
                const fullHtml = new TextDecoder(isUtf16Le ? 'utf-16le' : 'utf-8', { fatal: false }).decode(bytes);
                const bodyMatch = fullHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
                return bodyMatch ? bodyMatch[1] : fullHtml;
            }

            // Case 3: Check if file is RTF saved with .doc extension
            if (headAscii.trimStart().startsWith('{\\rtf')) {
                return parseRtfBytesToHtml(bytes);
            }

            // Case 4: Legacy Microsoft Word 97-2003 Binary OLE2 Compound File (.doc starting with D0 CF 11 E0)
            return parseLegacyOle2WordDoc(bytes);
        }

        function extractDocxXmlViaCFB(bytes) {
            try {
                if (!window.XLSX || !window.XLSX.CFB) return '';
                const cfb = window.XLSX.CFB.read(bytes, { type: 'array' });
                const docXmlEntry = window.XLSX.CFB.find(cfb, 'word/document.xml');
                if (!docXmlEntry || !docXmlEntry.content) return '';
                const xmlStr = new TextDecoder('utf-8').decode(new Uint8Array(docXmlEntry.content));
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlStr, 'application/xml');
                const body = xmlDoc.getElementsByTagName('w:body')[0] || xmlDoc.documentElement;
                let htmlOut = '';

                Array.from(body.childNodes).forEach(node => {
                    if (node.nodeName === 'w:p') {
                        const texts = Array.from(node.getElementsByTagName('w:t')).map(t => t.textContent).join('');
                        if (texts.trim()) {
                            htmlOut += `<p>${escapeHtmlText(texts)}</p>`;
                        }
                    } else if (node.nodeName === 'w:tbl') {
                        const rows = Array.from(node.getElementsByTagName('w:tr'));
                        let tblHtml = '<table><tbody>';
                        rows.forEach((tr, rIdx) => {
                            tblHtml += '<tr>';
                            const cells = Array.from(tr.getElementsByTagName('w:tc'));
                            cells.forEach(tc => {
                                const cellText = Array.from(tc.getElementsByTagName('w:t')).map(t => t.textContent).join(' ');
                                const tag = rIdx === 0 ? 'th' : 'td';
                                tblHtml += `<${tag}>${escapeHtmlText(cellText)}</${tag}>`;
                            });
                            tblHtml += '</tr>';
                        });
                        tblHtml += '</tbody></table>';
                        htmlOut += tblHtml;
                    }
                });
                return htmlOut;
            } catch (e) {
                return '';
            }
        }

        function decodeCp1252Bytes(uint8Slice) {
            try {
                return new TextDecoder('windows-1252', { fatal: false }).decode(uint8Slice);
            } catch (e) {
                let s = '';
                for (let i = 0; i < uint8Slice.length; i++) {
                    s += String.fromCharCode(uint8Slice[i]);
                }
                return s;
            }
        }

        function parseLegacyOle2WordDoc(bytes) {
            let extractedText = '';

            // 1. Parse exact MS-DOC FIB & Clx Piece Table via SheetJS CFB reader
            if (window.XLSX && window.XLSX.CFB) {
                try {
                    const cfb = window.XLSX.CFB.read(bytes, { type: 'array' });
                    const wordEntry = window.XLSX.CFB.find(cfb, 'WordDocument');
                    if (wordEntry && wordEntry.content) {
                        const wordDocBuf = new Uint8Array(wordEntry.content);
                        const dv = new DataView(wordDocBuf.buffer, wordDocBuf.byteOffset, wordDocBuf.byteLength);
                        const wIdent = dv.getUint16(0, true);

                        if (wIdent === 0xA5EC && wordDocBuf.byteLength >= 0x01AA) {
                            const flags = dv.getUint16(0x000A, true);
                            const use1Table = (flags & 0x0200) !== 0;
                            const fcMin = dv.getUint32(0x0018, true);
                            const fcMac = dv.getUint32(0x001C, true);
                            const ccpText = dv.getInt32(0x004C, true);

                            // Dynamically locate fcClx and lcbClx in FIB
                            const csw = dv.getUint16(0x0020, true);
                            const offsetCslw = 0x0020 + 2 + csw * 2;
                            const cslw = dv.getUint16(offsetCslw, true);
                            const offsetCbRgFcLcb = offsetCslw + 2 + cslw * 4;
                            const fcClxOffset = offsetCbRgFcLcb + 2 + 33 * 8;

                            let fcClx = 0;
                            let lcbClx = 0;
                            if (fcClxOffset + 8 <= wordDocBuf.byteLength) {
                                fcClx = dv.getUint32(fcClxOffset, true);
                                lcbClx = dv.getUint32(fcClxOffset + 4, true);
                            }

                            const tableStreamName = use1Table ? '1Table' : '0Table';
                            const tableEntry = window.XLSX.CFB.find(cfb, tableStreamName) ||
                                               window.XLSX.CFB.find(cfb, '1Table') ||
                                               window.XLSX.CFB.find(cfb, '0Table');

                            if (tableEntry && tableEntry.content && lcbClx > 0) {
                                const tableBuf = new Uint8Array(tableEntry.content);
                                if (fcClx + lcbClx <= tableBuf.byteLength) {
                                    const clxBytes = tableBuf.subarray(fcClx, fcClx + lcbClx);
                                    let pos = 0;
                                    // Skip Prc records (clxt === 0x01)
                                    while (pos < clxBytes.length && clxBytes[pos] === 0x01) {
                                        const cbGrpprl = new DataView(clxBytes.buffer, clxBytes.byteOffset + pos + 1, 2).getUint16(0, true);
                                        pos += 3 + cbGrpprl;
                                    }
                                    // Read Pcdt record (clxt === 0x02)
                                    if (pos < clxBytes.length && clxBytes[pos] === 0x02) {
                                        const lcbPlcfPcd = new DataView(clxBytes.buffer, clxBytes.byteOffset + pos + 1, 4).getUint32(0, true);
                                        const plcfStart = pos + 5;
                                        const numPieces = Math.floor((lcbPlcfPcd - 4) / 12);
                                        const cpView = new DataView(clxBytes.buffer, clxBytes.byteOffset + plcfStart, lcbPlcfPcd);

                                        let pieceText = '';
                                        for (let i = 0; i < numPieces; i++) {
                                            const cpStart = cpView.getUint32(i * 4, true);
                                            const cpEnd = cpView.getUint32((i + 1) * 4, true);
                                            const charCount = cpEnd - cpStart;
                                            if (charCount <= 0 || charCount > 500000) continue;

                                            const pcdOffset = (numPieces + 1) * 4 + i * 8;
                                            const fcCompressed = cpView.getUint32(pcdOffset + 2, true);
                                            const isCompressed = (fcCompressed & 0x40000000) !== 0;

                                            if (isCompressed) {
                                                const byteOffset = (fcCompressed & 0x3FFFFFFF) >>> 1;
                                                const endOffset = Math.min(wordDocBuf.byteLength, byteOffset + charCount);
                                                if (byteOffset < endOffset) {
                                                    pieceText += decodeCp1252Bytes(wordDocBuf.subarray(byteOffset, endOffset));
                                                }
                                            } else {
                                                const byteOffset = (fcCompressed & 0x3FFFFFFF);
                                                const endOffset = Math.min(wordDocBuf.byteLength, byteOffset + charCount * 2);
                                                if (byteOffset < endOffset) {
                                                    pieceText += new TextDecoder('utf-16le', { fatal: false }).decode(
                                                        wordDocBuf.subarray(byteOffset, endOffset)
                                                    );
                                                }
                                            }
                                        }

                                        if (ccpText > 0 && pieceText.length > ccpText) {
                                            pieceText = pieceText.slice(0, ccpText);
                                        }
                                        extractedText = pieceText;
                                    }
                                }
                            }

                            // Fallback within WordDocument stream between fcMin and fcMac if Clx Piece Table was not used
                            if (!extractedText.trim() && fcMin > 0 && fcMac > fcMin && fcMac <= wordDocBuf.byteLength) {
                                extractedText = smartDecodeMixedWordBuffer(wordDocBuf.subarray(fcMin, fcMac));
                            }
                        }
                    }
                } catch (cfbErr) {
                    console.warn('OLE2 CFB parse fallback:', cfbErr);
                }
            }

            // 2. Fallback smart UTF-16LE / CP1252 scan if stream extraction returned empty
            if (!extractedText.trim()) {
                extractedText = smartDecodeMixedWordBuffer(bytes);
            }

            return formatMsDocTextToRichHtml(extractedText);
        }

        function smartDecodeMixedWordBuffer(buf) {
            // Detects UTF-16LE Vietnamese/Unicode runs vs 8-bit ASCII runs without leaking binary headers
            let out = '';
            let i = 0;
            while (i + 1 < buf.length) {
                const b0 = buf[i];
                const b1 = buf[i + 1];
                const code = b0 | (b1 << 8);
                const isValidViOrLatinUtf16 =
                    (code === 0x0007 || code === 0x0009 || code === 0x000A || code === 0x000D) ||
                    (code >= 0x0020 && code <= 0x007E) ||
                    (code >= 0x00A0 && code <= 0x024F) ||
                    (code >= 0x1E00 && code <= 0x1EFF) ||
                    (code >= 0x2000 && code <= 0x206F);

                if (isValidViOrLatinUtf16) {
                    let run = '';
                    let j = i;
                    while (j + 1 < buf.length) {
                        const c = buf[j] | (buf[j + 1] << 8);
                        if (
                            c === 0x0007 || c === 0x0009 || c === 0x000A || c === 0x000D ||
                            (c >= 0x0020 && c <= 0x007E) ||
                            (c >= 0x00A0 && c <= 0x024F) ||
                            (c >= 0x1E00 && c <= 0x1EFF) ||
                            (c >= 0x2000 && c <= 0x206F)
                        ) {
                            run += String.fromCharCode(c);
                            j += 2;
                        } else {
                            break;
                        }
                    }
                    if (run.trim().length >= 8) {
                        out += run + '\r';
                        i = j;
                        continue;
                    }
                }
                i += 2;
            }
            return out;
        }

        function formatMsDocTextToRichHtml(rawText) {
            if (!rawText || !rawText.trim()) {
                return '<p><em>Không tìm thấy văn bản trong file Word này.</em></p>';
            }

            // 1. Clean Word field codes (\x13 ... \x14 visible \x15)
            let cleaned = rawText
                .replace(/\x13[^\x14\x15]*\x14([^\x15]*)\x15/g, '$1')
                .replace(/\x13[^\x15]*\x15/g, '')
                .replace(/\x0B/g, '\n')
                .replace(/[\x00-\x06\x08\x0C\x0E-\x1F]/g, '');

            // 2. Reconstruct MS-DOC Tables (cells delimited by \x07, rows delimited by double \x07) and normal paragraphs (\r or \n)
            const htmlParts = [];
            let currentTableRows = [];

            function flushTable() {
                if (currentTableRows.length === 0) return;
                const maxCols = Math.max(...currentTableRows.map(r => r.length));
                let tbl = '<table class="w-full border-collapse my-3"><tbody>';
                currentTableRows.forEach((row, rIdx) => {
                    tbl += '<tr>';
                    for (let c = 0; c < maxCols; c++) {
                        const cellVal = (row[c] || '').trim();
                        const tag = rIdx === 0 ? 'th' : 'td';
                        const formattedCell = escapeHtmlText(cellVal).replace(/\r\n|\r|\n/g, '<br>');
                        tbl += `<${tag}>${formattedCell}</${tag}>`;
                    }
                    tbl += '</tr>';
                });
                tbl += '</tbody></table>';
                htmlParts.push(tbl);
                currentTableRows = [];
            }

            function renderNormalParagraph(paraText) {
                const trimmed = paraText.trim();
                if (!trimmed) return;
                // Filter out stray binary header artifacts like "bjbj" if any
                if (/^(bjbj|jbjb|\W+)$/i.test(trimmed) && trimmed.length < 12) return;

                // Split inline numbered sections if they were written without line breaks
                const isAllCapsHeading = trimmed.length <= 90 && trimmed === trimmed.toUpperCase() && /[A-ZÀ-Ỵ]/.test(trimmed);
                if (isAllCapsHeading) {
                    htmlParts.push(`<h2 class="text-base font-extrabold text-slate-900 dark:text-white mt-3 mb-1 text-center">${escapeHtmlText(trimmed)}</h2>`);
                } else if (/^(\d+\.|[IVX]+\.|Câu\s+\d+|Phần\s+\d+|Mục\s+\d+)/i.test(trimmed)) {
                    htmlParts.push(`<p class="font-semibold text-slate-900 dark:text-white mt-1.5">${escapeHtmlText(trimmed)}</p>`);
                } else {
                    htmlParts.push(`<p>${escapeHtmlText(trimmed)}</p>`);
                }
            }

            if (cleaned.includes('\x07')) {
                // Split by table row terminator (\x07 followed by optional \r/\n and another \x07)
                const rowBlocks = cleaned.split(/\x07[\r\n\s]*\x07/);

                rowBlocks.forEach((block) => {
                    if (!block.includes('\x07')) {
                        // Pure paragraphs after the last table row
                        flushTable();
                        block.split(/\r\n|\r|\n/).forEach(p => renderNormalParagraph(p));
                    } else {
                        const cells = block.split('\x07');
                        // The first segment (cells[0]) may contain normal paragraphs before the table starts!
                        if (currentTableRows.length === 0 && /[\r\n]/.test(cells[0])) {
                            const preLines = cells[0].split(/\r\n|\r|\n/);
                            const firstCellCandidate = preLines.pop();
                            preLines.forEach(p => renderNormalParagraph(p));
                            cells[0] = firstCellCandidate || '';
                        }
                        const cleanedCells = cells.map(c => c.trim());
                        if (cleanedCells.some(Boolean)) {
                            currentTableRows.push(cleanedCells);
                        }
                    }
                });
                flushTable();
            } else {
                cleaned.split(/\r\n|\r|\n/).forEach(p => renderNormalParagraph(p));
            }

            return htmlParts.join('\n') || '<p><em>File Word không có nội dung văn bản.</em></p>';
        }

        function parseRtfBytesToHtml(bytes) {
            const raw = decodeCp1252Bytes(bytes);
            const text = raw
                .replace(/\\par\b/g, '\n')
                .replace(/\\line\b/g, '\n')
                .replace(/\\tab\b/g, '\t')
                .replace(/\\u(-?\d+)\??/g, (_, code) => {
                    const c = parseInt(code, 10);
                    return String.fromCharCode(c < 0 ? c + 65536 : c);
                })
                .replace(/\\'([0-9a-fA-F]{2})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
                .replace(/\\[a-zA-Z]+\d*\s?/g, '')
                .replace(/[{}]/g, '');
            return formatMsDocTextToRichHtml(text);
        }

        async function loadPdfDocumentSafely(arrayBuffer) {
            const pdfParams = {
                data: new Uint8Array(arrayBuffer),
                cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
                cMapPacked: true,
                standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/standard_fonts/'
            };
            try {
                return await window.pdfjsLib.getDocument(pdfParams).promise;
            } catch (workerErr) {
                console.warn('Retrying PDF.js with disableWorker=true:', workerErr);
                return await window.pdfjsLib.getDocument({ ...pdfParams, disableWorker: true }).promise;
            }
        }

        function canvasToBlobUrl(canvas) {
            return new Promise((resolve) => {
                // Luôn sử dụng Data URL (Base64) để ảnh lưu trữ vĩnh viễn và đồng bộ nguyên vẹn sang điện thoại
                try {
                    resolve(canvas.toDataURL('image/jpeg', 0.85));
                } catch (e) {
                    resolve('');
                }
            });
        }

        async function parsePdfIntoEditableHtmlAndPages(file, blockId) {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await loadPdfDocumentSafely(arrayBuffer);
            const totalPages = pdf.numPages;

            let allPagesHtml = `
                <div contenteditable="false" class="p-3 mb-3 rounded-xl bg-rose-50/90 dark:bg-slate-800 border border-rose-200 dark:border-slate-700 text-xs text-rose-900 dark:text-rose-200 flex flex-wrap items-center justify-between gap-2">
                    <span>📕 <strong>Tài liệu PDF (${totalPages} trang):</strong> Đã hiển thị bản xem trang PDF gốc sắc nét kèm <strong>lớp văn bản tiếng Việt chỉnh sửa trực tiếp như Word</strong> ở mỗi trang.</span>
                    <button onclick="togglePdfVisualCanvases('${blockId}')" class="px-3 py-1 rounded-lg bg-white hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs shadow-sm transition">Ẩn/Hiện trang ảnh PDF gốc</button>
                </div>
            `;

            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const textContent = await page.getTextContent({
                    normalizeWhitespace: false,
                    disableCombineTextItems: false
                });

                // Extract positioned text items and sort top-to-bottom, left-to-right
                const rawItems = [];
                textContent.items.forEach(item => {
                    if (!item.str) return;
                    const tx = item.transform || [12, 0, 0, 12, 0, 0];
                    const x = tx[4] || 0;
                    const y = tx[5] || 0;
                    const fontSize = Math.hypot(tx[0], tx[1]) || Math.abs(tx[3]) || 12;
                    const width = item.width || (item.str.length * fontSize * 0.5);
                    rawItems.push({
                        str: item.str,
                        x: x,
                        y: y,
                        width: width,
                        fontSize: fontSize,
                        hasEOL: !!item.hasEOL
                    });
                });

                // Group items into visual lines based on Y coordinate tolerance
                const lines = [];
                rawItems.forEach(item => {
                    let targetLine = lines.find(l => Math.abs(l.y - item.y) <= Math.max(4.5, item.fontSize * 0.48));
                    if (!targetLine) {
                        targetLine = { y: item.y, fontSize: item.fontSize, items: [] };
                        lines.push(targetLine);
                    }
                    targetLine.items.push(item);
                });

                // Sort lines from top to bottom (descending Y in PDF coordinate space)
                lines.sort((a, b) => b.y - a.y);

                const reconstructedLines = lines.map(line => {
                    line.items.sort((a, b) => a.x - b.x);
                    let lineStr = '';
                    let prevEndX = null;

                    line.items.forEach((it) => {
                        if (prevEndX !== null) {
                            const gap = it.x - prevEndX;
                            const spaceThreshold = Math.max(1.8, it.fontSize * 0.18);
                            const colThreshold = Math.max(24, it.fontSize * 2.4);

                            if (gap > colThreshold) {
                                lineStr += '   \t   ';
                            } else if (gap > spaceThreshold && !lineStr.endsWith(' ') && !it.str.startsWith(' ')) {
                                lineStr += ' ';
                            }
                        }
                        lineStr += it.str;
                        prevEndX = it.x + it.width;
                    });

                    // Normalize Unicode NFC so decomposed Vietnamese diacritics merge cleanly
                    return lineStr.normalize ? lineStr.normalize('NFC').trim() : lineStr.trim();
                }).filter(Boolean);

                const editableParagraphs = reconstructedLines
                    .map(line => {
                        if (line.includes('\t')) {
                            const cols = line.split(/\t+/).map(c => `<td class="border border-slate-300 px-2.5 py-1">${escapeHtmlText(c.trim())}</td>`).join('');
                            return `<table class="w-full border-collapse my-1"><tbody><tr>${cols}</tr></tbody></table>`;
                        }
                        return `<p>${escapeHtmlText(line)}</p>`;
                    })
                    .join('');

                // Render high-res visual PDF page preview using lightweight Blob URL (up to 25 pages)
                let pagePreviewImgHtml = '';
                if (pageNum <= 25) {
                    const viewport = page.getViewport({ scale: 1.35 });
                    const tempCanvas = document.createElement('canvas');
                    const ctx = tempCanvas.getContext('2d');
                    tempCanvas.width = viewport.width;
                    tempCanvas.height = viewport.height;
                    await page.render({ canvasContext: ctx, viewport: viewport }).promise;
                    const pageBlobUrl = await canvasToBlobUrl(tempCanvas);
                    pagePreviewImgHtml = `
                        <div contenteditable="false" class="pdf-visual-preview my-2.5 text-center">
                            <img src="${pageBlobUrl}" alt="PDF Trang ${pageNum}" class="max-w-full h-auto rounded-xl border border-slate-300 mx-auto shadow-sm" style="max-height: 540px;" />
                        </div>
                    `;
                }

                allPagesHtml += `
                    <div class="pdf-page-card">
                        <div contenteditable="false" class="flex items-center justify-between text-xs font-extrabold text-slate-500 border-b border-slate-200 pb-1.5 mb-2">
                            <span>📄 TRANG ${pageNum} / ${totalPages}</span>
                            <span class="text-emerald-700">✏️ Bấm vào văn bản bên dưới để sửa chữ, tô dạ quang hoặc dịch nghĩa</span>
                        </div>
                        ${pagePreviewImgHtml}
                        <div class="pdf-editable-text-layer space-y-1.5 text-[14px] leading-relaxed pt-1">
                            ${editableParagraphs || '<p><em>(Trang PDF này là bản scan hình ảnh — Bạn có thể gõ ghi chú hoặc nội dung dịch trực tiếp tại đây...)</em></p>'}
                        </div>
                    </div>
                `;
            }

            return allPagesHtml;
        }

        function togglePdfVisualCanvases(blockId) {
            const container = document.getElementById(blockId);
            if (!container) return;
            container.querySelectorAll('.pdf-visual-preview').forEach(el => {
                el.classList.toggle('hidden');
            });
            showToast('👁️ Đã chuyển chế độ hiển thị ảnh gốc trang PDF!');
        }

        function removeImportedDocBlock(blockId) {
            const el = document.getElementById(blockId);
            if (el) el.remove();
            const note = takeNotesList.find(n => n.id === activeNoteId);
            if (note && note.attachedFiles) {
                const removedFile = note.attachedFiles.find(f => f.blockId === blockId);
                if (removedFile && removedFile.fileId && window.PdfStorage) {
                    window.PdfStorage.remove(removedFile.fileId).catch(() => {});
                }
                if (window.PdfStudio && window.PdfStudio.fileId === removedFile?.fileId) {
                    window.PdfStudio.closePdf();
                }
                note.attachedFiles = note.attachedFiles.filter(f => f.blockId !== blockId);
                renderAttachedFilesBar(note);
            }
            saveCurrentTakeNote();
            showToast('🗑️ Đã xóa khối tài liệu khỏi trang ghi chú.');
        }

        function readFileAsText(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result || '');
                reader.onerror = e => reject(e);
                reader.readAsText(file, 'UTF-8');
            });
        }

        function readFileAsDataURL(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result || '');
                reader.onerror = e => reject(e);
                reader.readAsDataURL(file);
            });
        }

        function escapeHtmlText(str) {
            return String(str || '')
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }

        function execNoteCmdWithArg(cmd, arg) {
            if (!arg) return;
            document.execCommand(cmd, false, arg);
            saveCurrentTakeNote();
        }

        function speakSelectedNoteText() {
            const sel = window.getSelection()?.toString().trim();
            const textToRead = sel || (document.getElementById('takeNoteEditorPaper')?.innerText || '').slice(0, 350).trim();
            if (!textToRead) {
                showToast('Hãy bôi đen một câu tiếng Anh hoặc nhập nội dung để nghe phát âm!');
                return;
            }
            speakText(textToRead);
            showToast('🔊 Đang đọc nội dung văn bản trong Sổ Take Note...');
        }

        function highlightSearchTermInDoc() {
            const term = (document.getElementById('docFindInput')?.value || '').trim();
            if (!term) {
                showToast('Vui lòng nhập từ khóa cần tìm trong tài liệu!');
                return;
            }
            if (window.find) {
                const found = window.find(term, false, false, true, false, false, false);
                if (found) {
                    document.execCommand('hiliteColor', false, '#fde047');
                    saveCurrentTakeNote();
                    showToast(`🔍 Đã tìm thấy và tô sáng "${term}"!`);
                } else {
                    showToast(`Không tìm thấy từ "${term}" trong trang hiện tại.`);
                }
            }
        }

        function exportCurrentNoteAsWord() {
            const note = takeNotesList.find(n => n.id === activeNoteId);
            if (!note) return;
            const editorHtml = document.getElementById('takeNoteEditorPaper')?.innerHTML || '';
            const wordDocContent = `
                <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
                <head><meta charset='utf-8'><title>${note.title}</title>
                <style>
                    body { font-family: 'Times New Roman', Arial, sans-serif; font-size: 13pt; line-height: 1.5; }
                    table { width: 100%; border-collapse: collapse; margin: 10px 0; }
                    th, td { border: 1px solid #333; padding: 6px 8px; }
                </style>
                </head>
                <body>
                    <h1>${note.title}</h1>
                    ${editorHtml}
                </body>
                </html>
            `;
            const blob = new Blob(['\ufeff', wordDocContent], { type: 'application/msword' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${note.title.replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_')}.doc`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('📘 Đã xuất trang ghi chú đã chỉnh sửa ra file Microsoft Word (.doc)!');
        }

        function convertTakeNoteHtmlToPdfContent(containerEl) {
            if (!containerEl) return [];

            // Clone container to sanitize without affecting live editor
            const clone = containerEl.cloneNode(true);

            // Xóa triệt để các thành phần UI không cần xuất ra PDF:
            // - Banners hướng dẫn, các nút "Ẩn/Hiện ảnh", "Bấm vào để sửa"
            // - Preview ảnh trang chụp của PDF scan (đã có lớp text tiếng Việt bên dưới)
            // - Các nút thao tác, inputs, script
            clone.querySelectorAll('[contenteditable="false"], button, input, select, textarea, script, style, .pdf-visual-preview').forEach(el => el.remove());

            // 1. Thử dùng thư viện html-to-pdfmake để giữ nguyên định dạng bảng, in đậm, in nghiêng, tiêu đề
            if (window.htmlToPdfmake) {
                try {
                    // Giới hạn kích thước ảnh nếu người dùng chèn ảnh riêng
                    clone.querySelectorAll('img').forEach(img => {
                        img.style.maxWidth = '460px';
                        img.style.maxHeight = '420px';
                    });

                    const parsed = window.htmlToPdfmake(clone.innerHTML, {
                        defaultStyles: {
                            p: { margin: [0, 2, 0, 4], lineHeight: 1.35 },
                            h1: { fontSize: 17, bold: true, margin: [0, 8, 0, 4], color: '#0f172a' },
                            h2: { fontSize: 14, bold: true, margin: [0, 6, 0, 3], color: '#1e293b' },
                            h3: { fontSize: 12, bold: true, margin: [0, 4, 0, 2], color: '#334155' },
                            table: { margin: [0, 6, 0, 8] },
                            th: { bold: true, fillColor: '#f1f5f9' }
                        }
                    });
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        return parsed;
                    }
                } catch (htmlErr) {
                    console.warn('htmlToPdfmake parsing fallback:', htmlErr);
                }
            }

            // 2. Dự phòng tốc độ cao: Tách từng đoạn văn bản tiếng Việt chuẩn xác
            const blocks = [];
            const paragraphs = clone.innerText ? clone.innerText.split(/\n+/) : [];
            paragraphs.forEach(p => {
                const trimmed = p.trim();
                if (!trimmed) return;
                blocks.push({
                    text: trimmed,
                    fontSize: 11,
                    lineHeight: 1.35,
                    margin: [0, 2, 0, 4]
                });
            });

            return blocks.length > 0 ? blocks : [{ text: 'Ghi chú trống.', italics: true, color: '#94a3b8' }];
        }

        async function exportCurrentNoteAsPdf() {
            const note = takeNotesList.find(n => n.id === activeNoteId);
            if (!note) {
                showToast('⚠️ Vui lòng chọn một trang ghi chú để xuất PDF!');
                return;
            }
            const paperEl = document.getElementById('takeNoteEditorPaper');
            if (!paperEl) return;

            showToast('⏳ Đang tạo file PDF trực tiếp...');

            try {
                if (window.DocumentToolkit && typeof window.DocumentToolkit.ensurePdfMake === 'function') {
                    await window.DocumentToolkit.ensurePdfMake();
                }
                // Đảm bảo nạp font Roboto hỗ trợ 100% tiếng Việt có dấu
                if (window.pdfMake) {
                    if (!window.pdfMake.vfs && window.vfs_fonts) {
                        window.pdfMake.vfs = window.vfs_fonts.pdfMake ? window.vfs_fonts.pdfMake.vfs : window.vfs_fonts;
                    }
                }

                if (!window.pdfMake || !window.pdfMake.vfs) {
                    throw new Error('Thư viện tạo PDF (pdfMake) chưa sẵn sàng.');
                }

                const safeBaseTitle = (note.title || 'Ghi_chu')
                    .trim()
                    .replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_')
                    .replace(/_+/g, '_');
                const pdfFileName = `${safeBaseTitle}.pdf`;

                const pdfBodyContent = convertTakeNoteHtmlToPdfContent(paperEl);

                const docDefinition = {
                    info: {
                        title: note.title || 'Ghi chú học tập',
                        author: 'Tôi đi đâu đó',
                        subject: 'Tài liệu & Ghi chú ôn thi TOEIC'
                    },
                    pageSize: 'A4',
                    pageMargins: [40, 48, 40, 48],
                    header: function(currentPage, pageCount) {
                        return {
                            text: `${note.title || 'Ghi chú'} — Tôi đi đâu đó`,
                            alignment: 'right',
                            fontSize: 8,
                            color: '#94a3b8',
                            margin: [40, 16, 40, 0]
                        };
                    },
                    footer: function(currentPage, pageCount) {
                        return {
                            text: `Trang ${currentPage} / ${pageCount}`,
                            alignment: 'center',
                            fontSize: 9,
                            color: '#64748b',
                            margin: [0, 14, 0, 0]
                        };
                    },
                    content: [
                        { text: note.title || 'Ghi chú', fontSize: 18, bold: true, color: '#0f172a', margin: [0, 0, 0, 4] },
                        {
                            text: `Danh mục: ${note.category || 'Tài liệu'} • Ngày cập nhật: ${note.updatedAt || 'Hôm nay'}`,
                            fontSize: 9,
                            color: '#64748b',
                            margin: [0, 0, 0, 8]
                        },
                        {
                            canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#cbd5e1' }],
                            margin: [0, 0, 0, 12]
                        },
                        ...(Array.isArray(pdfBodyContent) ? pdfBodyContent : [pdfBodyContent])
                    ],
                    defaultStyle: {
                        font: 'Roboto',
                        fontSize: 11,
                        lineHeight: 1.35,
                        color: '#1e293b'
                    }
                };

                const pdfDocGenerator = window.pdfMake.createPdf(docDefinition);
                pdfDocGenerator.getBlob((blob) => {
                    if (!blob) {
                        showToast('❌ Không thể tạo file PDF, vui lòng thử lại.');
                        return;
                    }
                    // Tải file trực tiếp qua thẻ download (giống hệt nút Xuất Word - hiện cửa sổ Lưu như)
                    const blobUrl = URL.createObjectURL(blob);
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.href = blobUrl;
                    downloadAnchor.download = pdfFileName;
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    setTimeout(() => {
                        document.body.removeChild(downloadAnchor);
                        URL.revokeObjectURL(blobUrl);
                    }, 500);
                    showToast(`📕 Đã xuất file PDF "${pdfFileName}" về máy thành công!`);
                });
            } catch (err) {
                console.error('Lỗi khi xuất PDF trực tiếp:', err);
                showToast('❌ Lỗi xuất PDF: ' + err.message);
            }
        }

        // Đảm bảo tương thích ngược nếu có lời gọi cũ
        function printCurrentNoteAsPdf() {
            return exportCurrentNoteAsPdf();
        }

        let takeNoteDebounceTimer = null;
        function saveCurrentTakeNote() {
            const note = takeNotesList.find(n => n.id === activeNoteId);
            if (!note) return;
            const paperEl = document.getElementById('takeNoteEditorPaper');
            if (window.TakeNoteHybridEditor && paperEl) {
                window.TakeNoteHybridEditor.sanitizeTakeNoteDom(paperEl);
            }
            note.title = document.getElementById('takeNoteTitleInput').value;
            note.category = document.getElementById('takeNoteCategorySelect').value;
            note.content = paperEl.innerHTML;
            note.previewText = (paperEl.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 160);
            const now = new Date();
            note.updatedAt = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            note.updatedAtMs = Date.now();
            persistTakeNotes();
            renderTakeNoteSidebarList();
            updateTakeNoteWordCount();
            if (window.TakeNoteHybridEditor) window.TakeNoteHybridEditor.updateBreadcrumbs();
            const statusEl = document.getElementById('noteAutoSaveStatus');
            if (statusEl) statusEl.textContent = `✓ Đã lưu lúc ${note.updatedAt}`;

            // Tự động đẩy đồng bộ lên server và phát sóng tới các thiết bị khác (Laptop ⇄ Điện thoại)
            clearTimeout(takeNoteDebounceTimer);
            takeNoteDebounceTimer = setTimeout(() => {
                if (window.StudySync) {
                    window.StudySync.broadcastLearning('TAKE_NOTE_SAVED', note.title, 5);
                }
                if (typeof saveCurrentUserProgressToServer === 'function') {
                    saveCurrentUserProgressToServer();
                }
            }, 600);
        }

        function updateTakeNoteWordCount() {
            const text = (document.getElementById('takeNoteEditorPaper')?.innerText || '').trim();
            const count = text ? text.split(/\s+/).length : 0;
            const el = document.getElementById('takeNoteWordCount');
            if (el) el.textContent = `${count} từ`;
        }

        function createNewTakeNotePage() {
            const newId = 'note-' + Date.now();
            takeNotesList.unshift({
                id: newId,
                title: '📝 Trang ghi chú mới',
                category: 'Ngữ pháp',
                paper: 'paper-lined',
                updatedAt: 'Vừa xong',
                updatedAtMs: Date.now(),
                content: '<p>Bắt đầu viết ghi chú của bạn tại đây...</p>'
            });
            activeNoteId = newId;
            persistTakeNotes();
            renderTakeNoteSidebarList();
            loadActiveTakeNoteIntoEditor();
            if (window.StudySync) {
                window.StudySync.broadcastLearning('TAKE_NOTE_CREATED', 'Trang mới', 5);
            }
            if (typeof saveCurrentUserProgressToServer === 'function') {
                saveCurrentUserProgressToServer();
            }
            showToast('📒 Đã tạo trang mới trong Sổ Take Note!');
        }

        function deleteCurrentTakeNote() {
            if (takeNotesList.length <= 1) {
                showToast('Sổ Take Note cần giữ lại ít nhất 1 trang!');
                return;
            }
            takeNotesList = takeNotesList.filter(n => n.id !== activeNoteId);
            activeNoteId = takeNotesList[0].id;
            persistTakeNotes();
            renderTakeNoteSidebarList();
            loadActiveTakeNoteIntoEditor();
            if (window.StudySync) {
                window.StudySync.broadcastLearning('TAKE_NOTE_DELETED', 'Đã xóa', 0);
            }
            if (typeof saveCurrentUserProgressToServer === 'function') {
                saveCurrentUserProgressToServer();
            }
            showToast('🗑️ Đã xóa trang ghi chú.');
        }

        function changeTakeNotePaperStyle(styleClass) {
            const note = takeNotesList.find(n => n.id === activeNoteId);
            if (note) note.paper = styleClass;
            loadActiveTakeNoteIntoEditor();
            persistTakeNotes();
        }

        function execNoteCmd(cmd) {
            document.execCommand(cmd, false, null);
            saveCurrentTakeNote();
        }

        function highlightNoteSelection(colorHex) {
            document.execCommand('hiliteColor', false, colorHex);
            saveCurrentTakeNote();
        }

        function insertNoteTemplate(type) {
            const editor = document.getElementById('takeNoteEditorPaper');
            if (type === 'checkbox') {
                editor.innerHTML += `<div>☑️ Cần ôn tập: ...</div>`;
            } else if (type === 'vocabtable') {
                editor.innerHTML += `
                    <table style="width:100%;border-collapse:collapse;margin:8px 0;font-size:13px;">
                        <tr style="background:#fef3c7;font-weight:bold;">
                            <td style="border:1px solid #cbd5e1;padding:6px;">Từ vựng</td>
                            <td style="border:1px solid #cbd5e1;padding:6px;">Phiên âm / Loại từ</td>
                            <td style="border:1px solid #cbd5e1;padding:6px;">Nghĩa & Collocation</td>
                        </tr>
                        <tr>
                            <td style="border:1px solid #cbd5e1;padding:6px;font-weight:bold;">negotiate</td>
                            <td style="border:1px solid #cbd5e1;padding:6px;">/nɪˈɡoʊʃieɪt/ (v)</td>
                            <td style="border:1px solid #cbd5e1;padding:6px;">đàm phán hợp đồng</td>
                        </tr>
                    </table><p></p>`;
            } else if (type === 'cornell') {
                editor.innerHTML += `
                    <div style="background:#eff6ff;border-left:4px solid #2563eb;padding:10px 14px;border-radius:8px;margin:8px 0;">
                        <strong>💡 Công thức / Mẹo giải nhanh:</strong><br>Ghi nội dung công thức cần nhớ vào đây...
                    </div><p></p>`;
            }
            saveCurrentTakeNote();
        }

        function appendSnippetToTakeNote(title, category, htmlSnippet) {
            const existing = takeNotesList.find(n => n.title === title);
            if (existing) {
                existing.content += htmlSnippet;
                activeNoteId = existing.id;
            } else {
                const newId = 'note-' + Date.now();
                takeNotesList.unshift({
                    id: newId,
                    title: title,
                    category: category,
                    paper: 'paper-lined',
                    updatedAt: 'Vừa xong',
                    content: htmlSnippet
                });
                activeNoteId = newId;
            }
            persistTakeNotes();
            renderTakeNoteSidebarList();
            loadActiveTakeNoteIntoEditor();
            showToast('📒 Đã lưu vào Quyển sổ Take Note của bạn!');
        }

        function exportCurrentNoteTxt() {
            const note = takeNotesList.find(n => n.id === activeNoteId);
            if (!note) return;
            const plainText = `${note.title}\nDanh mục: ${note.category}\n------------------------\n` +
                document.getElementById('takeNoteEditorPaper').innerText;
            const blob = new Blob([plainText], { type: 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${note.title.replace(/[^a-zA-Z0-9_\u00C0-\u1EF9]/g, '_')}.txt`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('📥 Đã tải file ghi chú (.txt) về máy!');
        }

        function openFullPartPracticeModal(partNum, mode = 'practice') {
            if (!currentUserAccount) {
                if (window.currentUserAccount) currentUserAccount = window.currentUserAccount;
                else if (typeof window.getCurrentUser === 'function') currentUserAccount = window.getCurrentUser();
            }
            if (!currentUserAccount) {
                currentUserAccount = { id: 'guest-' + Date.now(), name: 'Học viên', isGuest: true };
                window.currentUserAccount = currentUserAccount;
                try { localStorage.setItem('cung_dang_session_user', JSON.stringify(currentUserAccount)); } catch(e) {}
            }
            if (partNum >= 5 && window.ToeicReadingWorkstation) {
                const partCounts = { 5: 30, 6: 16, 7: 20 };
                window.ToeicReadingWorkstation.open({
                    part: partNum,
                    title: `Trọn vẹn TOEIC Part ${partNum} (${partCounts[partNum] || 20} câu chuẩn ETS)`,
                    count: partCounts[partNum] || 20
                });
                return;
            }
            if (window.FullPartPracticeEngine && typeof window.FullPartPracticeEngine.startPart === 'function') {
                window.FullPartPracticeEngine.startPart(partNum, mode);
                return;
            }
            const partCounts = { 1: 6, 2: 25, 3: 12, 4: 12, 5: 30, 6: 16, 7: 20 };
            const count = partCounts[partNum] || 20;
            const type = partNum <= 4 ? 'listening' : 'reading';
            const title = `Trọn vẹn TOEIC Part ${partNum} (${count} câu chuẩn ETS)`;
            startQuickQuiz(type, title, count);
        }

        let currentArenaEtsTest = 1;
        function setArenaEtsTest(num, btn) {
            currentArenaEtsTest = parseInt(num, 10) || 1;
            document.querySelectorAll('.arena-test-btn').forEach(b => {
                b.className = 'arena-test-btn py-1 px-1 rounded-lg text-xs font-bold border transition bg-white/70 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:border-rose-400 cursor-pointer';
            });
            if (btn) {
                btn.className = 'arena-test-btn py-1 px-1 rounded-lg text-xs font-bold border transition bg-rose-600 text-white border-rose-600 shadow-xs cursor-pointer';
            }
            const titleEl = document.getElementById('etsArenaTitle');
            if (titleEl) titleEl.textContent = `ETS 2026 - Test ${String(currentArenaEtsTest).padStart(2, '0')}`;
            const countEl = document.getElementById('etsArenaCountLabel');
            if (countEl) countEl.textContent = `Đề ${currentArenaEtsTest} / 10`;
            if (window.Ets2026Database) {
                window.Ets2026Database.selectTest(currentArenaEtsTest);
            }
        }

        async function startArenaEts(mode) {
            if (!window.Ets2026Database) return;
            if (mode === 'lc') {
                await window.Ets2026Database.startPractice('full_lc', currentArenaEtsTest);
            } else if (mode === 'rc') {
                await window.Ets2026Database.startPractice('full_rc', currentArenaEtsTest);
            } else if (mode === 'full') {
                await window.Ets2026Database.startPractice('full_test', currentArenaEtsTest);
            }
        }
        window.setArenaEtsTest = setArenaEtsTest;
        window.startArenaEts = startArenaEts;

        let activeQuizList = [];
        let activeQuizIndex = 0;
        let activeQuizType = 'grammar';
        let activeQuizMode = 'practice';
        let quizExamTimerInterval = null;
        let quizExamSecondsRemaining = 7200;
        let examUserAnswers = {};
        let initialQuizModalScrollAreaHtml = null;

        async function startQuickQuiz(type, title, count = 50, options = {}) {
            if (typeof count === 'object' && count !== null) {
                options = count;
                count = 50;
            }
            window.startQuickQuiz = startQuickQuiz;
            if (!currentUserAccount) {
                if (window.currentUserAccount) currentUserAccount = window.currentUserAccount;
                else if (typeof window.getCurrentUser === 'function') currentUserAccount = window.getCurrentUser();
            }
            if (!currentUserAccount) {
                currentUserAccount = { id: 'guest-' + Date.now(), name: 'Học viên', isGuest: true };
                window.currentUserAccount = currentUserAccount;
                try { localStorage.setItem('cung_dang_session_user', JSON.stringify(currentUserAccount)); } catch(e) {}
            }
            activeQuizType = type;
            let questionsPool = [];

            if (type === 'grammar') {
                const isGroupReview = title.includes('Ôn tập') || title.includes('Mini Test');
                if (!isGroupReview && window.GrammarEngine && window.grammarDatabase) {
                    const clean = title.trim().toLowerCase();
                    let matchedSlug = null;
                    if (window.grammarDatabase[clean]) {
                        matchedSlug = window.grammarDatabase[clean].slug;
                    } else {
                        for (const k of Object.keys(window.grammarDatabase)) {
                            const item = window.grammarDatabase[k];
                            if (clean.includes(k) || (item.title && (clean.includes(item.title.toLowerCase()) || item.title.toLowerCase().includes(clean)))) {
                                matchedSlug = item.slug;
                                break;
                            }
                        }
                    }
                    if (matchedSlug) {
                        GrammarEngine.navigateToPractice(matchedSlug);
                        return;
                    }
                }
                // Đảm bảo số lượng câu hỏi mặc định cho ngữ pháp luôn là 50 câu (trừ các bài ôn tập cụ thể như 15, 20, 30 câu)
                if (!count || count === 10) count = 50;
                if (isGroupReview && typeof grammarGroupsData !== 'undefined') {
                    const matchedGroup = grammarGroupsData.find(g => 
                        title.toLowerCase().includes(g.title.toLowerCase()) || 
                        g.title.toLowerCase().includes(title.toLowerCase()) ||
                        title.toLowerCase().includes(g.id.toLowerCase())
                    );
                    if (matchedGroup && window.grammarQuizBank) {
                        matchedGroup.topics.forEach(t => {
                            if (window.grammarQuizBank[t.title]) {
                                questionsPool.push(...window.grammarQuizBank[t.title]);
                            }
                        });
                    }
                }

                // Nếu là chuyên đề cụ thể
                if (questionsPool.length === 0 && window.grammarQuizBank) {
                    if (window.grammarQuizBank[title]) {
                        questionsPool = [...window.grammarQuizBank[title]];
                    } else {
                        for (let k in window.grammarQuizBank) {
                            if (title.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(title.toLowerCase())) {
                                questionsPool = [...window.grammarQuizBank[k]];
                                break;
                            }
                        }
                    }
                }

                // Nếu số câu trong pool vẫn ít hơn số lượng yêu cầu (20, 30, 50 câu),
                // lấy thêm từ toàn bộ ngân hàng câu hỏi ngữ pháp để người học luôn được luyện đúng số câu
                if (window.grammarQuizBank && questionsPool.length < count) {
                    const allGrammarQuestions = [];
                    for (let k in window.grammarQuizBank) {
                        allGrammarQuestions.push(...window.grammarQuizBank[k]);
                    }
                    for (let i = allGrammarQuestions.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [allGrammarQuestions[i], allGrammarQuestions[j]] = [allGrammarQuestions[j], allGrammarQuestions[i]];
                    }
                    for (let q of allGrammarQuestions) {
                        if (!questionsPool.some(existing => existing.q === q.q)) {
                            questionsPool.push(q);
                            if (questionsPool.length >= count) break;
                        }
                    }
                }
            } else if (type.startsWith('ets2026')) {
                const cleanTitle = title.toLowerCase();
                const isListening = type === 'ets2026_p1' || type === 'ets2026_p2' || type === 'ets2026_p3' || type === 'ets2026_p4' || type === 'ets2026_lc' || (type.includes('_p') && parseInt(type.split('_p')[1], 10) <= 4) || (cleanTitle.includes('listening') && !cleanTitle.includes('reading') && !cleanTitle.includes('full exam'));
                
                let testNum = 1;
                const matchTest = (type + ' ' + title).match(/(?:t|test)\s*0?(\d+)/i);
                if (matchTest) testNum = parseInt(matchTest[1], 10);
                else if (window.Ets2026Database) testNum = window.Ets2026Database.currentTestNum;

                if (window.Ets2026Database && !window.Ets2026Database.hasTest(testNum)) {
                    await window.Ets2026Database.loadTest(testNum);
                }

                if (isListening && window.ToeicListeningWorkstation) {
                    window.ToeicListeningWorkstation.open({ type, title, count, testNumber: testNum, isEts2026: true });
                    return;
                }

                const isReading = type.includes('p5') || type.includes('p6') || type.includes('p7') || type.includes('rc') || cleanTitle.includes('part 5') || cleanTitle.includes('part 6') || cleanTitle.includes('part 7') || cleanTitle.includes('reading');
                if (isReading && window.ToeicReadingWorkstation) {
                    let p = 5;
                    if (type.includes('p6') || cleanTitle.includes('part 6')) p = 6;
                    else if (type.includes('p7') || cleanTitle.includes('part 7')) p = 7;
                    window.ToeicReadingWorkstation.open({ part: p, isEts2026: true, testNum, title, count });
                    return;
                }

                if (window.Ets2026Database) {
                    if (type.includes('p5') || cleanTitle.includes('part 5')) {
                        questionsPool = window.Ets2026Database.getFlattenedPart(5, testNum);
                    } else if (type.includes('p6') || cleanTitle.includes('part 6')) {
                        questionsPool = window.Ets2026Database.getFlattenedPart(6, testNum);
                    } else if (type.includes('p7') || cleanTitle.includes('part 7')) {
                        questionsPool = window.Ets2026Database.getFlattenedPart(7, testNum);
                    } else if (type.includes('rc') || cleanTitle.includes('reading')) {
                        questionsPool = window.Ets2026Database.getFullReading(testNum);
                    } else if (type.includes('full') || cleanTitle.includes('200 câu') || count === 200) {
                        questionsPool = [
                            ...window.Ets2026Database.getFullListening(testNum),
                            ...window.Ets2026Database.getFullReading(testNum)
                        ];
                    } else {
                        questionsPool = window.Ets2026Database.getFullReading(testNum);
                    }
                }
            } else if (type === 'listening' || type.startsWith('listening')) {
                // Tích hợp Workstation 2 cột toàn màn hình (Chuẩn Study4 / Prep / ETS)
                if (window.ToeicListeningWorkstation) {
                    window.ToeicListeningWorkstation.open({ type, title, count });
                    return;
                }
                // Định tuyến thông minh theo Part nghe và Chủ đề từ ListeningDatabaseV2 (Chuẩn ETS 2026)
                if (window.ListeningDatabaseV2) {
                    const cleanTitle = title.toLowerCase();
                    if (type === 'listening_part1' || cleanTitle.includes('part 1')) {
                        const allP1 = window.ListeningDatabaseV2.getFlattenedQuestions(1);
                        if (cleanTitle.includes('người & vật') || cleanTitle.includes('người và vật') || cleanTitle.includes('tương tác')) {
                            questionsPool = allP1.filter(q => q.topic && (q.topic.includes('Người & vật') || q.topic.includes('người và vật') || q.topic.includes('tương tác')));
                        } else if (cleanTitle.includes('tả người') || cleanTitle.includes('người')) {
                            questionsPool = allP1.filter(q => q.topic && q.topic.includes('tả người'));
                        } else if (cleanTitle.includes('tả vật') || cleanTitle.includes('vật')) {
                            questionsPool = allP1.filter(q => q.topic && q.topic.includes('tả vật'));
                        } else if (cleanTitle.includes('cảnh') || cleanTitle.includes('bối cảnh')) {
                            questionsPool = allP1.filter(q => q.topic && (q.topic.includes('cảnh') || q.topic.includes('bối cảnh')));
                        }
                        if (questionsPool.length === 0) questionsPool = [...allP1];
                    } else if (type === 'listening_part2' || cleanTitle.includes('part 2')) {
                        const allP2 = window.ListeningDatabaseV2.getFlattenedQuestions(2);
                        if (cleanTitle.includes('wh-') || cleanTitle.includes('wh')) {
                            questionsPool = allP2.filter(q => ['who', 'where', 'when', 'why', 'how', 'what'].includes(q.question_type));
                        } else if (cleanTitle.includes('yes/no') || cleanTitle.includes('yes no')) {
                            questionsPool = allP2.filter(q => ['yes_no', 'tag_question', 'opinion'].includes(q.question_type) || q.q.match(/^(Is|Are|Do|Did|Has|Have|Can|Could|Will|Would)/i));
                        } else if (cleanTitle.includes('lựa chọn') || cleanTitle.includes('đề nghị')) {
                            questionsPool = allP2.filter(q => ['choice', 'offer'].includes(q.question_type) || q.q.toLowerCase().includes(' or ') || q.q.toLowerCase().includes('would you like'));
                        } else if (cleanTitle.includes('trần thuật')) {
                            questionsPool = allP2.filter(q => q.question_type === 'statement' || q.q.trim().endsWith('.'));
                        }
                        if (questionsPool.length === 0) questionsPool = [...allP2];
                    } else if (type === 'listening_part3' || cleanTitle.includes('part 3')) {
                        const allP3 = window.ListeningDatabaseV2.getFlattenedQuestions(3);
                        if (cleanTitle.includes('công sở') || cleanTitle.includes('nhân sự')) {
                            questionsPool = allP3.filter(q => [1, 3, 6, 9, 13].includes(q.setIndex));
                        } else if (cleanTitle.includes('mua sắm') || cleanTitle.includes('đặt hàng') || cleanTitle.includes('dịch vụ')) {
                            questionsPool = allP3.filter(q => [2, 5, 7].includes(q.setIndex));
                        } else if (cleanTitle.includes('du lịch') || cleanTitle.includes('di chuyển') || cleanTitle.includes('sự kiện')) {
                            questionsPool = allP3.filter(q => [4, 8].includes(q.setIndex));
                        } else if (cleanTitle.includes('ngụ ý') || cleanTitle.includes('bảng biểu')) {
                            questionsPool = allP3.filter(q => [10, 11, 12].includes(q.setIndex));
                        }
                        if (questionsPool.length === 0) questionsPool = [...allP3];
                    } else if (type === 'listening_part4' || cleanTitle.includes('part 4')) {
                        const allP4 = window.ListeningDatabaseV2.getFlattenedQuestions(4);
                        if (cleanTitle.includes('thông báo') || cleanTitle.includes('tin nhắn') || cleanTitle.includes('voicemail')) {
                            questionsPool = allP4.filter(q => [1, 2, 8].includes(q.setIndex));
                        } else if (cleanTitle.includes('quảng cáo') || cleanTitle.includes('giới thiệu')) {
                            questionsPool = allP4.filter(q => [3, 7].includes(q.setIndex));
                        } else if (cleanTitle.includes('phát biểu') || cleanTitle.includes('tour')) {
                            questionsPool = allP4.filter(q => [5, 6].includes(q.setIndex));
                        } else if (cleanTitle.includes('bản tin') || cleanTitle.includes('thời tiết') || cleanTitle.includes('giao thông')) {
                            questionsPool = allP4.filter(q => [4, 9, 10].includes(q.setIndex));
                        }
                        if (questionsPool.length === 0) questionsPool = [...allP4];
                    } else {
                        questionsPool = [...window.ListeningDatabaseV2.getAllMockTestQuestions()];
                    }
                } else if (type === 'listening_part1' || title.toLowerCase().includes('part 1')) {
                    questionsPool = [...quizQuestions.listening_part1];
                } else if (type === 'listening_part2' || title.toLowerCase().includes('part 2')) {
                    questionsPool = [...quizQuestions.listening_part2];
                } else if (type === 'listening_part3' || title.toLowerCase().includes('part 3')) {
                    questionsPool = [...(quizQuestions.listening_part3 || [])];
                } else if (type === 'listening_part4' || title.toLowerCase().includes('part 4')) {
                    questionsPool = [...(quizQuestions.listening_part4 || [])];
                } else if (quizQuestions[type] && quizQuestions[type].length > 0) {
                    questionsPool = [...quizQuestions[type]];
                } else {
                    questionsPool = [...quizQuestions.listening_part1];
                }
            } else if (type === 'reading' || type.startsWith('reading')) {
                // Tích hợp Workstation 2 cột toàn màn hình (Chuẩn Study4 / Prep / ETS 2019 / ETS 2026)
                if (window.ToeicReadingWorkstation) {
                    let p = 5;
                    const clean = title.toLowerCase();
                    if (type === 'reading_part6' || clean.includes('part 6')) p = 6;
                    else if (type === 'reading_part7' || clean.includes('part 7')) p = 7;
                    let topic = '';
                    if (clean.includes('từ loại')) topic = 'word_form';
                    else if (clean.includes('chia thì') || clean.includes('bị động')) topic = 'tenses_voice';
                    else if (clean.includes('giới từ') || clean.includes('liên từ')) topic = 'prep_conj';
                    else if (clean.includes('từ vựng') || clean.includes('ngữ cảnh')) topic = 'collocations';
                    else if (clean.includes('email') || clean.includes('thư tín')) topic = 'email_letter';
                    else if (clean.includes('thông báo') || clean.includes('memo')) topic = 'notice_memo';
                    else if (clean.includes('quảng cáo') || clean.includes('báo chí')) topic = 'ads_articles';
                    else if (clean.includes('điền câu')) topic = 'sentence_insertion';
                    else if (clean.includes('đoạn đơn') || clean.includes('single')) topic = 'single_passage';
                    else if (clean.includes('đoạn kép') || clean.includes('double')) topic = 'double_passage';
                    else if (clean.includes('đoạn ba') || clean.includes('triple')) topic = 'triple_passage';
                    else if (clean.includes('suy luận')) topic = 'inference_vocab';
                    window.ToeicReadingWorkstation.open({ part: p, topic, title, count });
                    return;
                }
                // Định tuyến thông minh theo Part đọc
                if (type === 'reading_part6' || title.toLowerCase().includes('part 6')) {
                    questionsPool = [...(quizQuestions.reading_part6 || quizQuestions.reading || [])];
                } else if (type === 'reading_part7' || title.toLowerCase().includes('part 7')) {
                    questionsPool = [...(quizQuestions.reading_part7 || quizQuestions.reading || [])];
                } else if (quizQuestions[type] && quizQuestions[type].length > 0) {
                    questionsPool = [...quizQuestions[type]];
                } else {
                    questionsPool = [...(quizQuestions.reading || [])];
                }
            } else {
                if (quizQuestions[type] && quizQuestions[type].length > 0) {
                    questionsPool = [...quizQuestions[type]];
                }
            }

            // Fallback an toàn nếu vẫn rỗng
            if (!questionsPool || questionsPool.length === 0) {
                questionsPool = quizQuestions[type] || quizQuestions.grammar || [];
            }

            // Shuffle ngẫu nhiên: Giữ nguyên tính toàn vẹn 3 câu theo Set cho Part 3 & 4
            // (Không shuffle đối với đề ETS 2026 chính thức để bảo toàn chuẩn số thứ tự câu 1-200)
            const isEtsOfficial = type && type.startsWith('ets2026');
            const isSetBasedListening = (type && (type.includes('part3') || type.includes('part4'))) || 
                                       (title && (title.toLowerCase().includes('part 3') || title.toLowerCase().includes('part 4')));
            if (isEtsOfficial) {
                // Giữ nguyên thứ tự câu hỏi chính thức chuẩn ETS
            } else if (isSetBasedListening) {
                const setsMap = new Map();
                questionsPool.forEach(q => {
                    const sId = q.setIndex || 1;
                    if (!setsMap.has(sId)) setsMap.set(sId, []);
                    setsMap.get(sId).push(q);
                });
                const setGroups = Array.from(setsMap.values());
                for (let i = setGroups.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [setGroups[i], setGroups[j]] = [setGroups[j], setGroups[i]];
                }
                questionsPool = setGroups.flat();
            } else {
                for (let i = questionsPool.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [questionsPool[i], questionsPool[j]] = [questionsPool[j], questionsPool[i]];
                }
            }

            activeQuizList = questionsPool.slice(0, count || questionsPool.length);
            activeQuizIndex = 0;

            const isExam = (options && options.mode === 'exam') ||
                           (type && (type.includes('full') || type.includes('exam'))) ||
                           (title && (title.includes('200 Câu') || title.includes('120 PHÚT') || title.includes('120 phút') || title.includes('Full Exam')));
            activeQuizMode = isExam ? 'exam' : 'practice';
            examUserAnswers = {};

            const scrollArea = document.getElementById('quizModalScrollArea');
            if (scrollArea) {
                if (!initialQuizModalScrollAreaHtml) {
                    initialQuizModalScrollAreaHtml = scrollArea.innerHTML;
                } else {
                    scrollArea.innerHTML = initialQuizModalScrollAreaHtml;
                }
            }

            if (quizExamTimerInterval) {
                clearInterval(quizExamTimerInterval);
                quizExamTimerInterval = null;
            }

            const timerContainer = document.getElementById('quizExamTimerContainer');
            const timerText = document.getElementById('quizExamTimerText');

            if (isExam) {
                const minutes = (options && options.durationMinutes) || 120;
                quizExamSecondsRemaining = minutes * 60;
                if (timerContainer) {
                    timerContainer.classList.remove('hidden');
                    timerContainer.classList.add('inline-flex');
                }
                const updateTimerDisplay = () => {
                    if (!timerText) return;
                    const m = Math.floor(quizExamSecondsRemaining / 60);
                    const s = quizExamSecondsRemaining % 60;
                    const mm = String(m).padStart(2, '0');
                    const ss = String(s).padStart(2, '0');
                    timerText.textContent = `${mm}:${ss}`;
                };
                updateTimerDisplay();

                quizExamTimerInterval = setInterval(() => {
                    quizExamSecondsRemaining--;
                    if (quizExamSecondsRemaining <= 0) {
                        clearInterval(quizExamTimerInterval);
                        quizExamTimerInterval = null;
                        finishExamQuiz(true);
                    } else {
                        updateTimerDisplay();
                    }
                }, 1000);

                document.getElementById('quizCategoryBadge').textContent = 'CHẾ ĐỘ THI THỬ MÔ PHỎNG ETS (120 PHÚT)';
                document.getElementById('quizCategoryBadge').className = 'px-2.5 py-0.5 rounded-full bg-rose-600 text-white text-xs font-black uppercase tracking-wider shadow-xs';
            } else {
                if (timerContainer) {
                    timerContainer.classList.add('hidden');
                    timerContainer.classList.remove('inline-flex');
                }
                document.getElementById('quizCategoryBadge').textContent = `${type.toUpperCase().replace('_', ' · ')} · ${activeQuizList.length} CÂU HỎI LUYỆN TẬP`;
                document.getElementById('quizCategoryBadge').className = 'px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 text-xs font-bold';
            }

            document.getElementById('quizModalTitle').textContent = title;

            renderQuizQuestion();
            const modal = document.getElementById('quizModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
        window.startQuickQuiz = startQuickQuiz;

        function renderQuizQuestion() {
            const item = activeQuizList[activeQuizIndex];
            document.getElementById('quizProgressLabel').textContent = `Câu hỏi ${activeQuizIndex + 1} / ${activeQuizList.length}`;

            const isPart1 = item.part === 1 || activeQuizType === 'listening_part1';
            const isPart2 = item.part === 2 || activeQuizType === 'listening_part2';

            if (isPart2) {
                document.getElementById('quizQuestionText').innerHTML = `
                    <div class="flex items-center gap-2 text-fuchsia-700 dark:text-fuchsia-300 font-bold text-xs sm:text-sm">
                        <i class="fa-solid fa-ear-listen animate-pulse text-base"></i>
                        <span>Lắng nghe câu hỏi và 3 câu phản hồi để chọn đáp án (A, B hoặc C):</span>
                    </div>
                `;
            } else if (isPart1) {
                document.getElementById('quizQuestionText').innerHTML = `
                    <div class="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold text-xs sm:text-sm">
                        <i class="fa-solid fa-headphones text-base"></i>
                        <span>Quan sát ảnh và lắng nghe 4 phương án (A, B, C, D) để chọn mô tả đúng:</span>
                    </div>
                `;
            } else {
                document.getElementById('quizQuestionText').textContent = item.q;
            }

            document.getElementById('quizExplanationBox').classList.add('hidden');

            // 1. Unified ToeicAudioPlayer Component
            const playerContainer = document.getElementById('quizToeicAudioPlayerContainer');
            if (item.audio_url || item.audioScript) {
                if (playerContainer) {
                    playerContainer.classList.remove('hidden');
                    if (!window._quizToeicPlayer && window.ToeicAudioPlayer) {
                        window._quizToeicPlayer = new window.ToeicAudioPlayer({
                            containerId: 'quizToeicAudioPlayerContainer',
                            mode: activeQuizMode,
                            onOptionSelect: (optIdx) => {
                                const btn = document.getElementById('quizOptionsContainer')?.children[optIdx];
                                if (btn && !btn.disabled) selectQuizAnswer(optIdx, btn);
                            },
                            onNextQuestion: () => {
                                nextQuizQuestion();
                            }
                        });
                    }
                    window._currentToeicAudioPlayer = window._quizToeicPlayer;
                    if (window._quizToeicPlayer) {
                        window._quizToeicPlayer.setMode(activeQuizMode);
                        window._quizToeicPlayer.render();
                        if (item.audio_url) {
                            window._quizToeicPlayer.load(item.audio_url, { autoPlay: false });
                        }
                        // Preload câu kế tiếp
                        if (activeQuizIndex < activeQuizList.length - 1 && activeQuizList[activeQuizIndex + 1]?.audio_url) {
                            window._quizToeicPlayer.preloadNext(activeQuizList[activeQuizIndex + 1].audio_url);
                        }
                    }
                }
            } else if (playerContainer) {
                playerContainer.classList.add('hidden');
                if (window._quizToeicPlayer) window._quizToeicPlayer.pause();
            }

            // 2. Graphic Table / Chart (Part 3/4)
            const graphicBox = document.getElementById('quizGraphicBox');
            if (graphicBox) {
                if (item.graphic) {
                    graphicBox.classList.remove('hidden');
                    graphicBox.innerHTML = `
                        <div class="p-3.5 rounded-2xl bg-teal-50/70 dark:bg-slate-800 border border-teal-200 dark:border-slate-700 space-y-2">
                            <div class="text-xs font-bold text-teal-900 dark:text-teal-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-table-cells"></i>
                                <span>${item.graphic.title || 'Bảng biểu đính kèm'}</span>
                            </div>
                            <div class="overflow-x-auto rounded-xl border border-teal-200/80 dark:border-slate-700">
                                <table class="w-full text-xs text-left">
                                    <thead class="bg-teal-100/70 dark:bg-slate-700 text-teal-950 dark:text-teal-200 uppercase text-xs font-bold">
                                        <tr>
                                            ${item.graphic.columns.map(c => `<th class="px-3 py-1.5">${c}</th>`).join('')}
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-teal-200/50 dark:divide-slate-700 bg-white dark:bg-slate-800">
                                        ${item.graphic.rows.map(r => `
                                            <tr class="hover:bg-teal-50/50 dark:hover:bg-slate-700/50">
                                                ${r.map(cell => `<td class="px-3 py-1.5 font-medium">${cell}</td>`).join('')}
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    `;
                } else {
                    graphicBox.classList.add('hidden');
                }
            }

            // 3. Reading Passage / Transcript Box (Ẩn transcript mặc định cho Listening trong lúc làm)
            const passageBox = document.getElementById('quizPassageBox');
            if (item.passage && !item.audio_url) {
                passageBox.innerHTML = item.passage;
                passageBox.classList.remove('hidden');
            } else {
                passageBox.classList.add('hidden');
            }

            // 4. Hiển thị ảnh cho Part 1 Photographs (Chuẩn TOEIC)
            const imgBox = document.getElementById('quizImageBox');
            const imgEl = document.getElementById('quizImageImg');
            if (item.image && imgBox && imgEl) {
                imgEl.onerror = () => {
                    if (item.topic && item.topic.includes('tả người')) imgEl.src = 'assets/listening/part1/p1_sample_01_person.webp';
                    else if (item.topic && item.topic.includes('tả vật')) imgEl.src = 'assets/listening/part1/p1_sample_02_object.webp';
                    else if (item.topic && (item.topic.includes('cảnh') || item.topic.includes('bối cảnh'))) imgEl.src = 'assets/listening/part1/p1_sample_03_scene.webp';
                    else imgEl.src = 'assets/listening/part1/p1_sample_04_interaction.webp';
                };
                imgEl.src = item.image;
                imgEl.alt = item.alt_text || 'Part 1 Photograph';
                imgBox.classList.remove('hidden');
            } else if (imgBox) {
                imgBox.classList.add('hidden');
            }

            // 5. Options
            const container = document.getElementById('quizOptionsContainer');
            container.innerHTML = '';

            item.options.forEach((opt, idx) => {
                const optLetter = ['A', 'B', 'C', 'D'][idx];
                const btn = document.createElement('button');
                btn.className = 'w-full text-left px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 font-semibold text-[13.5px] text-slate-700 dark:text-slate-200 transition flex items-center justify-between cursor-pointer';
                
                if (isPart1 || isPart2) {
                    btn.innerHTML = `
                        <div class="flex items-center gap-3">
                            <span class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white font-black text-sm flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-600">${optLetter}</span>
                            <span class="font-bold text-sm text-slate-800 dark:text-slate-200">Lựa chọn (${optLetter})</span>
                        </div>
                    `;
                } else {
                    btn.innerHTML = `<span>${opt}</span>`;
                }

                btn.onclick = () => selectQuizAnswer(idx, btn);
                container.appendChild(btn);
            });
        }

        function selectQuizAnswer(selectedIndex, btnEl) {
            const item = activeQuizList[activeQuizIndex];
            if (activeQuizMode === 'exam') {
                examUserAnswers[activeQuizIndex] = selectedIndex;
                const buttons = document.getElementById('quizOptionsContainer').children;
                for (let i = 0; i < buttons.length; i++) {
                    const b = buttons[i];
                    if (i === selectedIndex) {
                        b.className = 'w-full text-left px-4 py-3.5 rounded-2xl border-2 border-indigo-600 bg-indigo-50/80 dark:bg-slate-700/80 font-bold text-[13.5px] text-indigo-900 dark:text-white transition flex items-center justify-between cursor-pointer';
                    } else {
                        b.className = 'w-full text-left px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 font-semibold text-[13.5px] text-slate-700 dark:text-slate-200 transition flex items-center justify-between cursor-pointer opacity-70';
                    }
                }
                const exp = document.getElementById('quizExplanationBox');
                if (exp) exp.classList.add('hidden');
                return;
            }
            const isPart1 = item.part === 1 || activeQuizType === 'listening_part1';
            const isPart2 = item.part === 2 || activeQuizType === 'listening_part2';
            const buttons = document.getElementById('quizOptionsContainer').children;
            for (let b of buttons) {
                b.disabled = true;
            }

            state.totalAnswers++;
            const isCorrect = selectedIndex === item.ans;

            // Nếu là Part 1 hoặc Part 2: Sau khi trả lời, hiển thị lại toàn bộ câu chữ của từng phương án
            if (isPart1 || isPart2) {
                item.options.forEach((opt, idx) => {
                    const b = buttons[idx];
                    if (!b) return;
                    const optLetter = ['A', 'B', 'C', 'D'][idx];
                    const optIsCorrect = idx === item.ans;
                    const optIsSelected = idx === selectedIndex;

                    b.innerHTML = `
                        <div class="flex items-start gap-3 w-full">
                            <span class="w-7 h-7 rounded-lg ${optIsCorrect ? 'bg-emerald-600 text-white' : optIsSelected ? 'bg-rose-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'} font-black text-xs flex items-center justify-center shrink-0 mt-0.5">${optLetter}</span>
                            <span class="text-xs sm:text-[13.5px] leading-relaxed font-semibold">${opt}</span>
                        </div>
                        ${optIsCorrect ? '<i class="fa-solid fa-circle-check text-emerald-600 text-base shrink-0 ml-2"></i>' : (optIsSelected && !optIsCorrect ? '<i class="fa-solid fa-circle-xmark text-rose-600 text-base shrink-0 ml-2"></i>' : '')}
                    `;
                });

                if (isPart2) {
                    document.getElementById('quizQuestionText').innerHTML = `
                        <div class="space-y-1">
                            <div class="text-xs font-bold uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400 flex items-center gap-1.5">
                                <i class="fa-solid fa-volume-high"></i> Câu hỏi trong audio:
                            </div>
                            <div class="text-sm font-extrabold text-slate-900 dark:text-white">${item.q}</div>
                        </div>
                    `;
                } else if (isPart1) {
                    document.getElementById('quizQuestionText').innerHTML = `
                        <div class="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <i class="fa-solid fa-circle-check text-emerald-600"></i>
                            <span>Mô tả ảnh Part 1 (Đáp án đúng):</span>
                        </div>
                    `;
                }
            }

            if (isCorrect) {
                state.correctAnswers++;
                btnEl.classList.add('bg-emerald-50', 'border-emerald-500', 'text-emerald-800');
                if (!isPart1 && !isPart2) btnEl.innerHTML += `<i class="fa-solid fa-circle-check text-emerald-600"></i>`;
            } else {
                btnEl.classList.add('bg-rose-50', 'border-rose-500', 'text-rose-800');
                if (!isPart1 && !isPart2) btnEl.innerHTML += `<i class="fa-solid fa-circle-xmark text-rose-600"></i>`;
                if (buttons[item.ans]) {
                    buttons[item.ans].classList.add('bg-emerald-50', 'border-emerald-500', 'text-emerald-800');
                }
                if (window.ToeicListeningSRS && (item.part || activeQuizType?.startsWith('listening'))) {
                    window.ToeicListeningSRS.addQuestion(item);
                }
            }

            if (window.ListeningDashboard && (item.part || activeQuizType?.startsWith('listening'))) {
                window.ListeningDashboard.recordAnswer(item, isCorrect);
            }

            // Voice / Speaker Badge
            let speakerBadgeHtml = '';
            if (item.speakers && Array.isArray(item.speakers) && item.speakers.length > 1) {
                const badges = item.speakers.map(s => {
                    const sAcc = (s.accent || '').toUpperCase();
                    const flag = sAcc.includes('GB') || sAcc.includes('UK') ? '🇬🇧' :
                                 sAcc.includes('AU') ? '🇦🇺' :
                                 sAcc.includes('CA') ? '🇨🇦' : '🇺🇸';
                    return `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-300 dark:border-slate-600">${flag} ${s.name || s.role}</span>`;
                }).join(' ');
                speakerBadgeHtml = `<div class="flex items-center gap-1.5 flex-wrap">${badges}</div>`;
            } else {
                const sAcc = ((item.accent || (item.speakers && item.speakers[0]?.accent) || item.voice_name) || 'US').toUpperCase();
                const gen = item.gender || (item.voice_name?.includes('Jenny') || item.voice_name?.includes('Sonia') || item.voice_name?.includes('Natasha') || item.voice_name?.includes('Clara') || item.speakers?.[0]?.name?.includes('Jenny') || item.speakers?.[0]?.name?.includes('Sonia') ? 'Nữ' : 'Nam');
                const flag = sAcc.includes('GB') || sAcc.includes('UK') ? '🇬🇧' :
                             sAcc.includes('AU') ? '🇦🇺' :
                             sAcc.includes('CA') ? '🇨🇦' : '🇺🇸';
                const accName = sAcc.includes('GB') || sAcc.includes('UK') ? 'Anh' :
                                sAcc.includes('AU') ? 'Úc' :
                                sAcc.includes('CA') ? 'Canada' : 'Mỹ';
                const genName = gen === 'Female' || gen === 'Nữ' ? 'Nữ' : (gen === 'Male' || gen === 'Nam' ? 'Nam' : gen);
                if (item.audio_url || item.part || activeQuizType?.startsWith('listening')) {
                    speakerBadgeHtml = `<span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-200 dark:border-slate-600 shadow-xs" title="Giọng đọc chuẩn ETS">${flag} Giọng ${accName} (${genName})</span>`;
                }
            }

            // Rich Explanation with Trap Analysis & Evidence Quote
            const exp = document.getElementById('quizExplanationBox');
            const steps = item.steps || (item.explanation_vi ? [item.explanation_vi] : [item.explain || '']);
            const stepsHtml = steps.map(s => `<div class="py-0.5 leading-relaxed">• ${s}</div>`).join('');
            
            exp.innerHTML = `
                <div class="flex items-center justify-between gap-2 flex-wrap mb-1">
                    <div class="font-extrabold ${isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'} flex items-center gap-1.5 text-xs">
                        <i class="fa-solid ${isCorrect ? 'fa-circle-check text-emerald-500' : 'fa-lightbulb text-amber-500'}"></i>
                        <span>${isCorrect ? 'Chính xác (+10 XP)!' : 'Chưa đúng rồi!'} Phân tích đáp án chuẩn ETS:</span>
                    </div>
                    ${speakerBadgeHtml}
                </div>
                ${item.trap_type ? `
                    <div class="text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg">
                        ⚠️ Nhận diện bẫy: <span class="font-normal">${item.trap_type}</span>
                    </div>
                ` : ''}
                ${item.correct_reason ? `
                    <div class="text-xs text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-700 p-2.5 rounded-xl border border-slate-200 dark:border-slate-600">
                        <strong class="text-teal-700 dark:text-teal-300">📌 Căn cứ trong bài:</strong> "${item.correct_reason}"
                    </div>
                ` : ''}
                <div class="pl-1 space-y-0.5 text-xs text-slate-700 dark:text-slate-300">${stepsHtml}</div>
                ${item.transcript ? `
                    <div class="pt-1.5 border-t border-slate-200/80 dark:border-slate-700">
                        <button type="button" onclick="const tc = document.getElementById('quizTranscriptViewer'); if (tc) tc.classList.toggle('hidden');" class="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                            <i class="fa-solid fa-file-lines"></i>
                            <span>Xem toàn bộ Transcript & Dịch tiếng Việt</span>
                        </button>
                        <div id="quizTranscriptViewer" class="hidden mt-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                            <div><strong class="text-slate-900 dark:text-white">Transcript:</strong><br><span class="italic text-slate-700 dark:text-slate-300">${item.transcript.replace(/\n/g, '<br>')}</span></div>
                            ${item.translation_vi ? `<div><strong class="text-teal-700 dark:text-teal-300">Dịch tiếng Việt:</strong><br><span class="text-slate-600 dark:text-slate-400">${item.translation_vi.replace(/\n/g, '<br>')}</span></div>` : ''}
                        </div>
                    </div>
                ` : ''}
            `;
            exp.classList.remove('hidden');
        }

        function saveCurrentQuestionToNotebook() {
            const item = activeQuizList[activeQuizIndex];
            savedGrammarNotes.push({ q: item.q, ans: item.options[item.ans], step: (item.steps || [])[0] || '' });
            document.getElementById('grammarNotebookCount').textContent = savedGrammarNotes.length;
            const listEl = document.getElementById('grammarSavedList');
            if (listEl) {
                listEl.innerHTML = savedGrammarNotes.map((n, i) => `
                    <div class="p-3.5 rounded-2xl bg-purple-50/70 border border-purple-200 text-xs space-y-1">
                        <div class="font-bold text-slate-800">${i + 1}. ${n.q}</div>
                        <div class="text-emerald-700 font-bold">Đáp án: ${n.ans}</div>
                        <div class="text-slate-500">${n.step}</div>
                    </div>
                `).join('');
            }
            showToast('🔖 Đã lưu câu hỏi và giải thích vào Sổ tay cá nhân!');
        }

        function nextQuizQuestion() {
            if (activeQuizIndex < activeQuizList.length - 1) {
                activeQuizIndex++;
                renderQuizQuestion();
            } else {
                if (activeQuizMode === 'exam') {
                    finishExamQuiz(false);
                    return;
                }
                state.xp += 10;
                state.streak = Math.max(1, state.streak);
                state.studyMinutes += 5;

                if (activeQuizType === 'grammar') {
                    state.grammarDone += activeQuizList.length;
                    if (window.DailyTaskManager) window.DailyTaskManager.recordProgress('grammar', activeQuizList.length);
                }
                if (activeQuizType.startsWith('listening')) {
                    state.listenDone += activeQuizList.length;
                    if (window.DailyTaskManager) window.DailyTaskManager.recordProgress('listening', activeQuizList.length);
                }
                if (activeQuizType.startsWith('reading')) {
                    state.readDone += activeQuizList.length;
                    if (window.DailyTaskManager) window.DailyTaskManager.recordProgress('reading', activeQuizList.length);
                }
                if (activeQuizType === 'mock') {
                    state.mockDone = (state.mockDone || 0) + 1;
                    const bEl = document.getElementById('mockBestScore');
                    const lEl = document.getElementById('mockLatestScore');
                    const cEl = document.getElementById('mockCompletedCount');
                    if (bEl) bEl.textContent = '650';
                    if (lEl) lEl.textContent = '650';
                    if (cEl) cEl.textContent = `${state.mockDone} lượt`;
                }

                updateDashboardMetrics();
                closeQuizModal();

                // Đồng bộ đa thiết bị và lưu lên server
                if (window.StudySync) {
                    window.StudySync.broadcastLearning('QUIZ_COMPLETED', activeQuizType.toUpperCase(), 10);
                }
                if (typeof saveCurrentUserProgressToServer === 'function') {
                    saveCurrentUserProgressToServer();
                }

                showToast('🎉 Hoàn thành xuất sắc bài luyện! Bạn nhận được +10 XP!');
            }
        }

        function finishExamQuiz(isTimeUp = false) {
            if (quizExamTimerInterval) {
                clearInterval(quizExamTimerInterval);
                quizExamTimerInterval = null;
            }
            let correctLC = 0, totalLC = 0;
            let correctRC = 0, totalRC = 0;
            let totalCorrect = 0;

            activeQuizList.forEach((q, idx) => {
                const userAns = examUserAnswers[idx];
                const isPartLC = q.part ? q.part <= 4 : idx < 100;
                if (isPartLC) totalLC++; else totalRC++;
                if (userAns !== undefined && userAns === q.ans) {
                    totalCorrect++;
                    if (isPartLC) correctLC++; else correctRC++;
                }
            });

            // Ước tính điểm ETS theo bảng quy đổi chuẩn
            const lcScaled = totalLC > 0 ? Math.min(495, Math.max(5, Math.round((correctLC / totalLC) * 490) + 5)) : 5;
            const rcScaled = totalRC > 0 ? Math.min(495, Math.max(5, Math.round((correctRC / totalRC) * 490) + 5)) : 5;
            const totalScore = lcScaled + rcScaled;

            // Lưu lịch sử thi mô phỏng riêng biệt
            try {
                const history = JSON.parse(localStorage.getItem('toeic_exam_history') || '[]');
                history.unshift({
                    date: new Date().toISOString(),
                    title: document.getElementById('quizModalTitle').textContent,
                    totalQuestions: activeQuizList.length,
                    totalCorrect,
                    lcScaled,
                    rcScaled,
                    totalScore,
                    timeSpentSec: ((120 * 60) - quizExamSecondsRemaining)
                });
                localStorage.setItem('toeic_exam_history', JSON.stringify(history.slice(0, 50)));
            } catch(e) {}

            const timerContainer = document.getElementById('quizExamTimerContainer');
            if (timerContainer) {
                timerContainer.classList.add('hidden');
                timerContainer.classList.remove('inline-flex');
            }

            // Hiển thị bảng tổng kết điểm thi trong Modal
            const scrollArea = document.getElementById('quizModalScrollArea');
            if (scrollArea) {
                scrollArea.innerHTML = `
                    <div class="p-6 text-center space-y-5 animate-fadeIn">
                        <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto text-3xl shadow-lg">
                            <i class="fa-solid fa-trophy"></i>
                        </div>
                        <div class="space-y-1">
                            <h3 class="text-xl font-black text-slate-900 dark:text-white">${isTimeUp ? 'HẾT GIỜ THI! ĐÃ TỰ ĐỘNG THU BÀI' : 'HOÀN THÀNH BÀI THI THỬ MÔ PHỎNG 120 PHÚT'}</h3>
                            <p class="text-xs text-slate-500">Kết quả được chấm theo thang điểm chuẩn ETS 10 - 990 (Dữ liệu thi mô phỏng)</p>
                        </div>
                        <div class="p-5 rounded-2xl bg-slate-900 text-white space-y-3 max-w-md mx-auto">
                            <div class="text-xs uppercase tracking-wider text-slate-400 font-bold">Tổng điểm ước tính</div>
                            <div class="text-4xl font-black text-amber-300">${totalScore} <span class="text-lg font-normal text-slate-400">/ 990</span></div>
                            <div class="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                                <div>
                                    <div class="text-slate-400">Listening (${correctLC}/${totalLC})</div>
                                    <div class="text-lg font-black text-teal-300">${lcScaled} / 495</div>
                                </div>
                                <div>
                                    <div class="text-slate-400">Reading (${correctRC}/${totalRC})</div>
                                    <div class="text-lg font-black text-emerald-300">${rcScaled} / 495</div>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center justify-center gap-3 pt-2">
                            <button type="button" onclick="reviewExamQuestionsWithExplanations()" class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer">
                                <i class="fa-solid fa-magnifying-glass"></i> Xem giải thích chi tiết & Transcript
                            </button>
                            <button type="button" onclick="closeQuizModal()" class="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer">
                                Đóng lại
                            </button>
                        </div>
                    </div>
                `;
            }
        }
        window.finishExamQuiz = finishExamQuiz;

        function reviewExamQuestionsWithExplanations() {
            activeQuizMode = 'practice';
            const scrollArea = document.getElementById('quizModalScrollArea');
            if (scrollArea && initialQuizModalScrollAreaHtml) {
                scrollArea.innerHTML = initialQuizModalScrollAreaHtml;
            }
            activeQuizIndex = 0;
            renderQuizQuestion();
            const chosen = examUserAnswers[0];
            if (chosen !== undefined) {
                const btn = document.getElementById('quizOptionsContainer')?.children[chosen];
                if (btn) selectQuizAnswer(chosen, btn);
            }
        }
        window.reviewExamQuestionsWithExplanations = reviewExamQuestionsWithExplanations;

        function closeQuizModal() {
            if (quizExamTimerInterval) {
                clearInterval(quizExamTimerInterval);
                quizExamTimerInterval = null;
            }
            const timerContainer = document.getElementById('quizExamTimerContainer');
            if (timerContainer) {
                timerContainer.classList.add('hidden');
                timerContainer.classList.remove('inline-flex');
            }
            const modal = document.getElementById('quizModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            if (window._quizToeicPlayer) window._quizToeicPlayer.pause();
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        }

        function speakCurrentListeningQuestion() {
            if (window._quizToeicPlayer) {
                window._quizToeicPlayer.togglePlay();
                return;
            }
            const item = activeQuizList[activeQuizIndex];
            if (!item) return;
            const textToSpeak = item.audioScript || item.q;
            if (window.UniversalAudioEngine) {
                window.UniversalAudioEngine.speak(textToSpeak, { rate: 0.95 });
            } else if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(textToSpeak);
                utter.lang = 'en-US';
                utter.rate = 0.95;
                window.speechSynthesis.speak(utter);
            } else {
                showToast('Trình duyệt của bạn không hỗ trợ phát giọng nói.');
            }
        }

        // Flashcard Data & Logic (Upgraded with Collocation & Memory Tip)
        const vocabCards = [
            {
                word: 'access',
                phonetic: '/ˈækses/ · (n, v)',
                meaning: 'quyền truy cập, sự tiếp cận',
                example: '"Only authorized employees have access to the company database."',
                exampleVi: 'Chỉ nhân viên được ủy quyền mới có quyền truy cập cơ sở dữ liệu công ty.',
                collocation: 'have access to (có quyền truy cập vào)',
                tip: '“Access” là đi đến dữ liệu, tức là vào và sử dụng nó.'
            },
            {
                word: 'abide by',
                phonetic: '/əˈbaɪd baɪ/ · (v. phr)',
                meaning: 'tuân thủ, tôn trọng (hợp đồng, quy định)',
                example: '"Both parties agreed to abide by the terms of the contract."',
                exampleVi: 'Cả hai bên đã đồng ý tuân thủ các điều khoản của hợp đồng.',
                collocation: 'abide by the law / terms (tuân thủ luật / điều khoản)',
                tip: 'Đồng nghĩa với comply with và adhere to trong TOEIC Part 5 & 7.'
            },
            {
                word: 'agreement',
                phonetic: '/əˈɡriːmənt/ · (n)',
                meaning: 'hợp đồng, thỏa thuận, sự đồng ý',
                example: '"The landlord and tenant signed a two-year rental agreement."',
                exampleVi: 'Chủ nhà và người thuê đã ký hợp đồng thuê nhà thời hạn hai năm.',
                collocation: 'reach / sign an agreement (đạt được / ký thỏa thuận)',
                tip: 'Danh từ của động từ agree, nhưng đi được với mạo từ a/an khi mang nghĩa hợp đồng.'
            },
            {
                word: 'assurance',
                phonetic: '/əˈʃʊərəns/ · (n)',
                meaning: 'sự cam đoan, sự bảo đảm chắc chắn',
                example: '"The sales associate gave his assurance that the parts would arrive tomorrow."',
                exampleVi: 'Nhân viên bán hàng đã cam đoan rằng các linh kiện sẽ đến vào ngày mai.',
                collocation: 'give an assurance / quality assurance (đảm bảo chất lượng)',
                tip: 'Gốc từ “sure” (chắc chắn) → assurance là lời cam đoan chắc chắn.'
            }
        ];
        let currentDeckCards = [];
        let currentDeckName = 'Contracts';
        let fcIndex = 0;
        let learnedVocabItems = [];
        window.learnedVocabItems = learnedVocabItems;
        window.savedVocabItems = window.savedVocabItems || [];
        let savedVocabItems = window.savedVocabItems;

        window.addWordToSavedVocab = function(item) {
            if (!item || !item.word) return;
            const w = item.word.trim();
            if (!savedVocabItems.find(x => (x.word || '').toLowerCase() === w.toLowerCase())) {
                savedVocabItems.push({
                    word: w,
                    meaning: item.meaning || '',
                    phonetic: item.phonetic || '',
                    level: item.level || 'B1',
                    dateAdded: item.dateAdded || new Date().toLocaleDateString('vi-VN'),
                    sourceFile: item.sourceFile || 'Sổ tay cá nhân'
                });
                window.savedVocabItems = savedVocabItems;
                const badge = document.getElementById('savedWordsBadge');
                if (badge) badge.textContent = savedVocabItems.length;
                const sub = document.getElementById('savedVocabSub');
                if (sub) sub.textContent = `Đã lưu ${savedVocabItems.length} từ vựng`;
                if (typeof renderSavedVocabList === 'function') renderSavedVocabList();
                const uid = (currentUserAccount && currentUserAccount.id) ? currentUserAccount.id : (currentUserAccount && currentUserAccount.uid ? currentUserAccount.uid : 'guest');
                localStorage.setItem(`cung_dang_${uid}_saved_vocab_v1`, JSON.stringify(savedVocabItems));
            }
        };

        function openVocabFlashcardModal(deckName) {
            if (!currentUserAccount) {
                if (window.currentUserAccount) currentUserAccount = window.currentUserAccount;
                else if (typeof window.getCurrentUser === 'function') currentUserAccount = window.getCurrentUser();
            }
            if (!currentUserAccount) {
                currentUserAccount = { id: 'guest-' + Date.now(), name: 'Học viên', isGuest: true };
                window.currentUserAccount = currentUserAccount;
                try { localStorage.setItem('cung_dang_session_user', JSON.stringify(currentUserAccount)); } catch(e) {}
            }
            if (window.VocabularyEngine) {
                const slug = (deckName || 'contracts').toLowerCase().replace(/[^a-z0-9]+/g, '-');
                VocabularyEngine.navigateToStudy(slug);
                return;
            }
            currentDeckName = deckName;
            fcIndex = 0;
            document.getElementById('flashcardDeckTitle').textContent = `Bộ từ: ${deckName}`;

            // Load deck words from window.vocabDecksDatabase
            if (window.vocabDecksDatabase && window.vocabDecksDatabase[deckName]) {
                currentDeckCards = [...window.vocabDecksDatabase[deckName]];
            } else if (window.vocabDecksDatabase) {
                // Find matching by keyword
                let matched = null;
                for (let k in window.vocabDecksDatabase) {
                    if (deckName.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(deckName.toLowerCase())) {
                        matched = window.vocabDecksDatabase[k];
                        break;
                    }
                }
                currentDeckCards = matched ? [...matched] : [...(window.vocabDecksDatabase['Contracts'] || vocabCards)];
            } else {
                currentDeckCards = [...vocabCards];
            }

            renderFlashcard();
            const modal = document.getElementById('flashcardModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function renderFlashcard() {
            if (!currentDeckCards || currentDeckCards.length === 0) return;
            const item = currentDeckCards[fcIndex];
            const prog = document.getElementById('fcProgressLabel');
            if (prog) {
                prog.textContent = `Thẻ ${fcIndex + 1} / ${currentDeckCards.length}`;
            }
            document.getElementById('fcWord').textContent = item.word;
            document.getElementById('fcPhonetic').textContent = item.phonetic;
            document.getElementById('fcMeaning').textContent = item.meaning;
            document.getElementById('fcExample').textContent = item.example;
            document.getElementById('fcExampleVi').textContent = item.exampleVi;
            document.getElementById('fcCollocation').textContent = item.collocation || 'Đang cập nhật';
            document.getElementById('fcTip').textContent = item.tip || 'Nhớ kỹ từ loại và ví dụ ngữ cảnh';
        }

        function flipFlashcard() {
            speakVocabWord('en-US');
        }

        function speakVocabWord(lang = 'en-US') {
            if (!currentDeckCards || currentDeckCards.length === 0) return;
            const item = currentDeckCards[fcIndex];
            if (!item || !item.word) return;
            if (window.UniversalAudioEngine) {
                window.UniversalAudioEngine.speak(item.word, { lang: lang, rate: 0.9 });
            } else if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(item.word);
                u.lang = lang;
                u.rate = 0.9;
                window.speechSynthesis.speak(u);
            }
        }

        function bookmarkCurrentVocab() {
            if (!currentDeckCards || currentDeckCards.length === 0) return;
            const item = currentDeckCards[fcIndex];
            if (!savedVocabItems.find(x => x.word === item.word)) {
                savedVocabItems.push(item);
                const badge = document.getElementById('savedWordsBadge');
                if (badge) badge.textContent = savedVocabItems.length;
                const sub = document.getElementById('savedVocabSub');
                if (sub) sub.textContent = `Đã lưu ${savedVocabItems.length} từ vựng`;
            }
            showToast(`🔖 Đã lưu từ "${item.word}" vào Sổ tay từ vựng!`);
        }

        function prevFlashcard() {
            if (fcIndex > 0) {
                fcIndex--;
                renderFlashcard();
            } else {
                showToast('Đây là thẻ từ vựng đầu tiên trong bộ!');
            }
        }

        function nextFlashcard(remembered) {
            if (!currentDeckCards || currentDeckCards.length === 0) return;
            const item = currentDeckCards[fcIndex];
            if (remembered) {
                state.vocabLearned++;
                state.xp += 5;
                state.streak = Math.max(1, state.streak);
                state.studyMinutes += 1;
                if (!learnedVocabItems.find(x => x.word === item.word)) {
                    learnedVocabItems.push(item);
                }
                if (window.DailyTaskManager) window.DailyTaskManager.recordProgress('vocabNew', 1);
                const learnedBadge = document.getElementById('learnedWordsBadge');
                if (learnedBadge) learnedBadge.textContent = learnedVocabItems.length;
                const headerLearned = document.getElementById('vocabHeaderLearned');
                if (headerLearned) headerLearned.textContent = state.vocabLearned;
                updateDashboardMetrics();
                showToast(`✓ Đã thuộc: "${item.word}" (+5 XP)!`);
                if (window.StudySync) {
                    window.StudySync.broadcastLearning('FLASHCARD_LEARNED', item.word, 5);
                }
            } else {
                if (window.DailyTaskManager) window.DailyTaskManager.recordProgress('vocabReview', 1);
                showToast(`🔁 Đã đánh dấu cần ôn lại: "${item.word}"`);
            }

            if (fcIndex < currentDeckCards.length - 1) {
                fcIndex++;
                renderFlashcard();
            } else {
                state.xp += 15;
                updateDashboardMetrics();
                closeFlashcardModal();
                showToast(`🎉 Xuất sắc! Bạn đã hoàn thành toàn bộ ${currentDeckCards.length} từ trong bộ từ "${currentDeckName}"! (+15 XP)`);
            }
        }

        function closeFlashcardModal() {
            const modal = document.getElementById('flashcardModal');
            modal.classList.add('hidden');
            modal.classList.remove('flex');
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        }

        function renderLearnedVocabList() {
            const el = document.getElementById('learnedWordsListContainer');
            if (!el) return;
            if (learnedVocabItems.length === 0) {
                el.innerHTML = `<div class="col-span-2 text-center py-8 text-slate-400 text-xs">Bạn chưa đánh dấu thuộc từ nào. Hãy bấm "Học tiếp" để lật thẻ nhé!</div>`;
                return;
            }
            el.innerHTML = learnedVocabItems.map(w => `
                <div class="p-4 rounded-2xl bg-fuchsia-50/60 border border-fuchsia-200 flex items-start justify-between">
                    <div>
                        <div class="font-extrabold text-sm text-fuchsia-800">${w.word} <span class="text-xs font-normal text-slate-500">${w.phonetic}</span></div>
                        <div class="text-xs font-bold text-slate-700 mt-1">${w.meaning}</div>
                        <div class="text-xs text-slate-500 mt-0.5">Collocation: ${w.collocation}</div>
                    </div>
                    <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">Đã thuộc</span>
                </div>
            `).join('');
        }

        function renderSavedVocabList() {
            const el = document.getElementById('savedWordsListContainer');
            if (!el) return;
            if (!savedVocabItems || savedVocabItems.length === 0) {
                el.innerHTML = `<div class="col-span-1 md:col-span-2 text-center py-10 px-4 rounded-3xl bg-amber-50/40 dark:bg-slate-800/40 border border-dashed border-amber-200 dark:border-slate-700 text-slate-400 text-xs space-y-2">
                    <div class="text-3xl">📖</div>
                    <div class="font-bold text-slate-700 dark:text-slate-300">Sổ tay từ vựng hiện đang trống</div>
                    <p class="text-xs max-w-sm mx-auto">Bạn có thể quét tài liệu/sách ở mục "Học từ vựng", tích chọn các từ cần học hoặc bấm "Lưu từ" để hệ thống tự động ghi nhật ký ngày học!</p>
                </div>`;
                return;
            }

            // Nhóm từ theo Ngày học (dateAdded) và Nguồn tài liệu (sourceFile)
            const groups = {};
            savedVocabItems.forEach((w, origIdx) => {
                const date = w.dateAdded || 'Gần đây';
                const source = w.sourceFile || 'Sổ tay cá nhân';
                const groupKey = `${date}___${source}`;
                if (!groups[groupKey]) {
                    groups[groupKey] = {
                        date: date,
                        source: source,
                        groupKey: groupKey,
                        items: []
                    };
                }
                groups[groupKey].items.push({ ...w, origIdx: origIdx });
            });

            const groupKeys = Object.keys(groups);

            el.innerHTML = groupKeys.map(k => {
                const grp = groups[k];
                const count = grp.items.length;
                return `
                    <div class="col-span-1 md:col-span-2 bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-slate-200/90 dark:border-slate-700 shadow-2xs space-y-4">
                        <!-- Header nhóm ngày học & nguồn tài liệu -->
                        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center text-lg font-black shrink-0">
                                    📅
                                </div>
                                <div>
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <span class="text-xs sm:text-sm font-black text-slate-900 dark:text-white">
                                            Học ngày: ${grp.date}
                                        </span>
                                        <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">
                                            📁 ${grp.source}
                                        </span>
                                    </div>
                                    <div class="text-xs text-slate-400 font-bold mt-0.5">
                                        Đã ghi lại ${count} từ vựng
                                    </div>
                                </div>
                            </div>

                            <!-- 2 NÚT HỌC TRỰC TIẾP: 1 LÀ FLASHCARD, 2 LÀ LUYỆN PHẢN XẠ -->
                            <div class="flex items-center gap-2 w-full sm:w-auto">
                                <button type="button" onclick="startSavedVocabStudy('${grp.groupKey}', 'flashcard')"
                                    class="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95">
                                    <i class="fa-solid fa-clone text-xs"></i>
                                    <span>🃏 Học Flashcard (${count})</span>
                                </button>

                                <button type="button" onclick="startSavedVocabStudy('${grp.groupKey}', 'arena')"
                                    class="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black text-xs transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95">
                                    <i class="fa-solid fa-gamepad text-xs"></i>
                                    <span>⚡ Luyện phản xạ (${count})</span>
                                </button>
                            </div>
                        </div>

                        <!-- Danh sách từ trong nhóm -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            ${grp.items.map(w => `
                                <div class="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-slate-900/60 border border-amber-200/80 dark:border-slate-700 flex flex-col justify-between gap-2">
                                    <div class="flex items-start justify-between gap-2">
                                        <div>
                                            <div class="flex items-center gap-2">
                                                <span class="font-black text-sm text-amber-950 dark:text-amber-200">${escapeHtml(w.word)}</span>
                                                <button onclick="speakText('${escapeHtml(w.word.replace(/'/g, "\\'"))}', 'en-US')" class="w-6 h-6 rounded-lg bg-amber-200/80 hover:bg-amber-300 dark:bg-slate-700 text-amber-900 dark:text-amber-300 flex items-center justify-center transition cursor-pointer" title="Nghe phát âm">
                                                    <i class="fa-solid fa-volume-high text-xs"></i>
                                                </button>
                                            </div>
                                            <div class="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">${escapeHtml(w.phonetic || '/' + w.word + '/')}</div>
                                        </div>
                                        <div class="flex items-center gap-1">
                                            <span class="px-2 py-0.5 rounded-md text-xs font-black bg-white dark:bg-slate-800 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-slate-700">
                                                ${escapeHtml(w.level || 'B1')}
                                            </span>
                                            <button onclick="removeSavedVocabItem(${w.origIdx})" class="w-6 h-6 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-center text-xs transition cursor-pointer" title="Xóa từ khỏi sổ">
                                                <i class="fa-regular fa-trash-can text-xs"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <div class="text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white/70 dark:bg-slate-800/60 p-2 rounded-xl">
                                        ${escapeHtml(w.meaning || 'Từ vựng học tập')}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }).join('');
        }

        window.startSavedVocabStudy = function(groupKey, mode) {
            if (!Array.isArray(savedVocabItems)) return;
            const items = savedVocabItems.filter(item => {
                const date = item.dateAdded || 'Gần đây';
                const source = item.sourceFile || 'Sổ tay cá nhân';
                return `${date}___${source}` === groupKey;
            });
            if (items.length === 0) {
                showToast('Nhóm từ này hiện không có từ vựng nào!');
                return;
            }

            if (mode === 'flashcard') {
                if (window.VocabGameWorkstation && typeof window.VocabGameWorkstation.openFlashcardModal === 'function') {
                    window.VocabGameWorkstation.openFlashcardModal(items, `Sổ từ: ${items[0].dateAdded || 'Ngày học'}`);
                }
            } else if (mode === 'arena') {
                if (window.VocabGameWorkstation && typeof window.VocabGameWorkstation.launchArenaWithWords === 'function') {
                    window.VocabGameWorkstation.launchArenaWithWords(items, `Sổ từ: ${items[0].dateAdded || 'Ngày học'}`);
                }
            }
        };

        window.removeSavedVocabItem = function(idx) {
            if (!Array.isArray(savedVocabItems) || idx < 0 || idx >= savedVocabItems.length) return;
            const removed = savedVocabItems.splice(idx, 1);
            const uid = (currentUserAccount && currentUserAccount.id) ? currentUserAccount.id : (currentUserAccount && currentUserAccount.uid ? currentUserAccount.uid : 'guest');
            localStorage.setItem(`cung_dang_${uid}_saved_vocab_v1`, JSON.stringify(savedVocabItems));
            
            const badge = document.getElementById('savedWordsBadge');
            if (badge) badge.textContent = savedVocabItems.length;
            const sub = document.getElementById('savedVocabSub');
            if (sub) sub.textContent = `Đã lưu ${savedVocabItems.length} từ vựng`;
            renderSavedVocabList();
            showToast(`🗑️ Đã xóa "${removed[0]?.word}" khỏi Sổ tay từ vựng!`);
        };

        function addCustomSavedWord() {
            const w = document.getElementById('customWordInput').value.trim();
            const m = document.getElementById('customMeaningInput').value.trim();
            if (!w || !m) {
                showToast('Vui lòng nhập cả từ tiếng Anh và nghĩa tiếng Việt!');
                return;
            }
            savedVocabItems.push({ word: w, meaning: m });
            document.getElementById('customWordInput').value = '';
            document.getElementById('customMeaningInput').value = '';
            document.getElementById('savedWordsBadge').textContent = savedVocabItems.length;
            document.getElementById('savedVocabSub').textContent = `Đã lưu ${savedVocabItems.length} từ vựng`;
            renderSavedVocabList();
            showToast(`Đã thêm "${w}" vào Sổ tay từ vựng!`);
        }

        // =========================================================================
        // 3. ELLLO A1-B1 BASIC LISTENING MODAL & NEWS IN LEVELS READING MODAL
        // =========================================================================
        const ellloLessons = [
            {
                level: 'A1 · Daily Routine',
                title: 'Morning Coffee & Commute',
                script: 'Sarah: What time do you usually wake up, Mike? Mike: I wake up at 6:30 A.M. and take the subway to the office at 7:15.',
                vi: 'Sarah: Bạn thường thức dậy lúc mấy giờ hả Mike? Mike: Mình dậy lúc 6:30 sáng và đi tàu điện ngầm tới văn phòng lúc 7:15.',
                q: 'How does Mike go to his office?',
                options: ['A. By bus', 'B. By subway', 'C. On foot'],
                ans: 1
            },
            {
                level: 'A2 · Ordering Lunch',
                title: 'At the Company Cafeteria',
                script: 'Server: Would you like the grilled salmon or the chicken salad today? Customer: I will have the chicken salad and a bottle of mineral water, please.',
                vi: 'Phục vụ: Hôm nay bạn dùng cá hồi nướng hay salad gà? Khách: Cho mình phần salad gà và một chai nước khoáng nhé.',
                q: 'What does the customer order to drink?',
                options: ['A. Orange juice', 'B. Iced coffee', 'C. Mineral water'],
                ans: 2
            },
            {
                level: 'B1 · First Day at Work',
                title: 'New Employee Orientation',
                script: 'Manager: Welcome to the marketing department! Ms. Lin from HR will give you your security badge at 10:00 A.M. in Room 204.',
                vi: 'Quản lý: Chào mừng bạn đến phòng Tiếp thị! Cô Lin bên Nhân sự sẽ cấp thẻ an ninh cho bạn lúc 10 giờ sáng tại Phòng 204.',
                q: 'Where will the new employee receive the security badge?',
                options: ['A. In Room 204', 'B. At the front desk', 'C. In the cafeteria'],
                ans: 0
            }
        ];

        function openEllloModal() {
            if (!currentUserAccount) {
                if (window.currentUserAccount) currentUserAccount = window.currentUserAccount;
                else if (typeof window.getCurrentUser === 'function') currentUserAccount = window.getCurrentUser();
            }
            if (!currentUserAccount) {
                currentUserAccount = { id: 'guest-' + Date.now(), name: 'Học viên', isGuest: true };
                window.currentUserAccount = currentUserAccount;
                try { localStorage.setItem('cung_dang_session_user', JSON.stringify(currentUserAccount)); } catch(e) {}
            }
            selectEllloLesson(0);
            const m = document.getElementById('ellloModal');
            m.classList.remove('hidden');
            m.classList.add('flex');
        }

        function closeEllloModal() {
            const m = document.getElementById('ellloModal');
            m.classList.add('hidden');
            m.classList.remove('flex');
            if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        }

        function selectEllloLesson(idx) {
            [0, 1, 2].forEach(i => {
                const btn = document.getElementById(`ellloTab${i}`);
                if (btn) btn.className = i === idx ? 'px-3.5 py-1.5 rounded-xl bg-teal-600 text-white text-xs font-bold' : 'px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold';
            });
            const l = ellloLessons[idx];
            const box = document.getElementById('ellloLessonContent');
            box.innerHTML = `
                <div class="p-4 rounded-2xl bg-teal-50/80 border border-teal-200 flex items-center justify-between">
                    <div>
                        <div class="text-xs font-extrabold text-teal-900">${l.title} (${l.level})</div>
                        <div class="text-xs text-teal-700">Bấm nút loa để nghe hội thoại chậm rõ chữ</div>
                    </div>
                    <button onclick="speakText('${l.script.replace(/'/g, "\\'")}')" class="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold flex items-center gap-1.5 shadow">
                        <i class="fa-solid fa-volume-high"></i> Nghe Audio
                    </button>
                </div>
                <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div class="font-bold text-slate-800">Transcript:</div>
                    <p class="text-slate-700 leading-relaxed">${l.script}</p>
                    <p class="text-slate-500 italic">${l.vi}</p>
                </div>
                <div class="space-y-2">
                    <div class="text-xs font-extrabold text-slate-800">Câu hỏi kiểm tra: ${l.q}</div>
                    ${l.options.map((opt, i) => `
                        <button onclick="if(${i}===${l.ans}){this.classList.add('bg-emerald-100','border-emerald-500'); state.xp+=5; updateDashboardMetrics(); showToast('Chính xác! +5 XP');}else{this.classList.add('bg-rose-100','border-rose-500');}" class="w-full text-left p-3 rounded-xl border border-slate-200 text-xs font-semibold hover:border-teal-400 transition">${opt}</button>
                    `).join('')}
                </div>
            `;
        }

        function speakText(txt, lang = 'en-US') {
            if (!txt) return;
            const accent = (lang === 'en-GB' || lang === 'UK') ? 'UK' : 'US';
            const effectiveLang = accent === 'UK' ? 'en-GB' : 'en-US';
            if (window.AudioService && typeof window.AudioService.playWord === 'function') {
                window.AudioService.playWord(txt, accent, { lang: effectiveLang, rate: 0.95 });
            } else if (window.UniversalAudioEngine) {
                window.UniversalAudioEngine.speak(txt, { lang: effectiveLang, accent: accent, rate: 0.95 });
            } else if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const u = new SpeechSynthesisUtterance(txt);
                u.lang = effectiveLang;
                u.rate = 0.95;
                window.speechSynthesis.speak(u);
            }
        }

        // News in Levels Modal
        const newsLevelsData = {
            1: {
                title: 'Level 1 · Remote Work Grows in 2026',
                en: 'Many companies now let workers stay at home two days a week. Workers save time because they do not travel on busy roads. Companies also save money on office electricity.',
                vi: 'Nhiều công ty hiện cho phép nhân viên làm việc tại nhà 2 ngày mỗi tuần. Nhân viên tiết kiệm thời gian vì không phải đi lại trên đường đông đúc.',
                vocab: 'remote work (làm việc từ xa) · save time (tiết kiệm thời gian) · electricity (điện năng)'
            },
            2: {
                title: 'Level 2 · Hybrid Work Schedules Boost Productivity',
                en: 'A recent business survey shows that flexible hybrid schedules have increased employee satisfaction by 35%. Employees report fewer distractions and better work-life balance when telecommuting.',
                vi: 'Một khảo sát kinh doanh gần đây cho thấy lịch làm việc kết hợp linh hoạt đã làm tăng mức độ hài lòng của nhân viên thêm 35%.',
                vocab: 'hybrid schedule (lịch làm việc kết hợp) · productivity (năng suất) · telecommuting (làm việc từ xa)'
            },
            3: {
                title: 'Level 3 · Corporate Real Estate Adapts to Flexible Workforce Trends',
                en: 'Multinational corporations are increasingly downsizing traditional headquarters in favor of collaborative hub spaces. Analysts attribute this transition to sustained efficiency gains and reduced overhead expenses.',
                vi: 'Các tập đoàn đa quốc gia đang thu gọn trụ sở truyền thống để chuyển sang không gian làm việc chung nhằm tối ưu chi phí vận hành.',
                vocab: 'downsize (thu gọn quy mô) · headquarters (trụ sở chính) · overhead expenses (chi phí vận hành)'
            }
        };

        function openNewsInLevelsModal() {
            if (!currentUserAccount) {
                if (window.currentUserAccount) currentUserAccount = window.currentUserAccount;
                else if (typeof window.getCurrentUser === 'function') currentUserAccount = window.getCurrentUser();
            }
            if (!currentUserAccount) {
                currentUserAccount = { id: 'guest-' + Date.now(), name: 'Học viên', isGuest: true };
                window.currentUserAccount = currentUserAccount;
                try { localStorage.setItem('cung_dang_session_user', JSON.stringify(currentUserAccount)); } catch(e) {}
            }
            selectNewsLevel(1);
            const m = document.getElementById('newsModal');
            m.classList.remove('hidden');
            m.classList.add('flex');
        }

        function closeNewsInLevelsModal() {
            const m = document.getElementById('newsModal');
            m.classList.add('hidden');
            m.classList.remove('flex');
        }

        function selectNewsLevel(lvl) {
            [1, 2, 3].forEach(i => {
                const btn = document.getElementById(`newsLvl${i}`);
                if (btn) btn.className = i === lvl ? 'px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold' : 'px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold';
            });
            const d = newsLevelsData[lvl];
            document.getElementById('newsArticleContainer').innerHTML = `
                <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                    <div class="flex items-center justify-between">
                        <h4 class="text-sm font-extrabold text-emerald-950">${d.title}</h4>
                        <button onclick="speakText('${d.en.replace(/'/g, "\\'")}')" class="px-3 py-1 rounded-lg bg-white text-emerald-700 text-xs font-bold shadow-sm"><i class="fa-solid fa-volume-high mr-1"></i>Nghe bài báo</button>
                    </div>
                    <p class="text-[13.5px] text-slate-800 leading-relaxed font-medium">${d.en}</p>
                    <p class="text-xs text-slate-500 italic border-t border-emerald-200/60 pt-2">${d.vi}</p>
                </div>
                <div class="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
                    <strong class="text-amber-900">📌 Từ vựng trọng tâm trong bài:</strong>
                    <div class="text-slate-700 mt-1 font-semibold">${d.vocab}</div>
                </div>
                <div class="flex justify-end">
                    <button onclick="state.readDone+=3; state.xp+=5; updateDashboardMetrics(); closeNewsInLevelsModal(); showToast('📖 Đã hoàn thành bài đọc News in Levels (+5 XP)!');" class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold" aria-label="Đóng tin tức">Hoàn thành bài đọc (+5 XP)</button>
                </div>
            `;
        }

        let currentTheoryTopicTitle = '';
        function openTheoryModal(partTitle) {
            if (!currentUserAccount) {
                if (window.currentUserAccount) currentUserAccount = window.currentUserAccount;
                else if (typeof window.getCurrentUser === 'function') currentUserAccount = window.getCurrentUser();
            }
            if (!currentUserAccount) {
                currentUserAccount = { id: 'guest-' + Date.now(), name: 'Học viên', isGuest: true };
                window.currentUserAccount = currentUserAccount;
                try { localStorage.setItem('cung_dang_session_user', JSON.stringify(currentUserAccount)); } catch(e) {}
            }
            if (window.GrammarEngine && window.grammarDatabase) {
                const clean = partTitle.trim().toLowerCase();
                let matchedSlug = null;
                if (window.grammarDatabase[clean]) {
                    matchedSlug = window.grammarDatabase[clean].slug;
                } else {
                    for (const k of Object.keys(window.grammarDatabase)) {
                        const item = window.grammarDatabase[k];
                        if (clean.includes(k) || (item.title && (clean.includes(item.title.toLowerCase()) || item.title.toLowerCase().includes(clean)))) {
                            matchedSlug = item.slug;
                            break;
                        }
                    }
                }
                if (matchedSlug) {
                    GrammarEngine.navigateToTheory(matchedSlug);
                    return;
                }
            }
            currentTheoryTopicTitle = partTitle;
            const titleEl = document.getElementById('theoryModalTitle');
            const bodyEl = document.getElementById('theoryModalBody');
            titleEl.textContent = `Lý thuyết & Chiến thuật — ${partTitle}`;

            // Check if we have comprehensive theory in window.grammarTheoryDatabase
            let data = window.grammarTheoryDatabase ? window.grammarTheoryDatabase[partTitle] : null;
            if (!data && window.grammarTheoryDatabase) {
                for (let k in window.grammarTheoryDatabase) {
                    if (partTitle.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(partTitle.toLowerCase())) {
                        data = window.grammarTheoryDatabase[k];
                        break;
                    }
                }
            }

            if (data) {
                let html = `
                    <div class="mb-4">
                        <span class="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 text-xs font-extrabold uppercase border border-purple-200 dark:border-purple-800/60">${data.badge}</span>
                        <h4 class="text-[16px] font-extrabold text-slate-900 dark:text-white mt-1.5">${data.title}</h4>
                        <p class="text-[12.5px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">${data.overview}</p>
                    </div>
                `;

                data.sections.forEach(sec => {
                    if (sec.type === 'formula') {
                        html += `
                            <div class="p-3.5 sm:p-4 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/90 border border-indigo-200/80 dark:border-slate-700 space-y-2 mb-3">
                                <div class="font-extrabold text-indigo-950 dark:text-indigo-300 text-xs sm:text-[13.5px] flex items-center gap-1.5">
                                    <i class="fa-solid fa-square-root-variable text-indigo-600"></i>
                                    <span>${sec.heading}</span>
                                </div>
                                <div class="space-y-2 pt-1">
                                    ${sec.items.map(it => `
                                        <div class="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 shadow-xs">
                                            <div class="font-bold text-slate-800 dark:text-slate-100 text-xs">${it.title}</div>
                                            <div class="font-mono text-purple-700 dark:text-purple-300 font-bold text-xs my-1 p-1.5 rounded-lg bg-purple-50/60 dark:bg-purple-950/30 whitespace-pre-wrap">${it.formula}</div>
                                            <div class="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">${it.note}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    } else if (sec.type === 'signals') {
                        html += `
                            <div class="p-3.5 sm:p-4 rounded-2xl bg-teal-50/80 dark:bg-slate-800/90 border border-teal-200/80 dark:border-slate-700 space-y-2 mb-3">
                                <div class="font-extrabold text-teal-950 dark:text-teal-300 text-xs sm:text-[13.5px] flex items-center gap-1.5">
                                    <i class="fa-solid fa-bullseye text-teal-600"></i>
                                    <span>${sec.heading}</span>
                                </div>
                                <ul class="list-disc list-inside space-y-1.5 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
                                    ${sec.items.map(it => `<li>${it}</li>`).join('')}
                                </ul>
                            </div>
                        `;
                    } else if (sec.type === 'traps') {
                        html += `
                            <div class="p-3.5 sm:p-4 rounded-2xl bg-rose-50/80 dark:bg-slate-800/90 border border-rose-200/80 dark:border-slate-700 space-y-2 mb-3">
                                <div class="font-extrabold text-rose-950 dark:text-rose-300 text-xs sm:text-[13.5px] flex items-center gap-1.5">
                                    <i class="fa-solid fa-triangle-exclamation text-rose-600"></i>
                                    <span>${sec.heading}</span>
                                </div>
                                <div class="space-y-1.5 text-xs text-rose-950 dark:text-rose-200">
                                    ${sec.items.map(it => `<div class="p-2.5 rounded-xl bg-white/80 dark:bg-slate-900 border border-rose-100 dark:border-slate-800 font-medium leading-relaxed">⚠️ ${it}</div>`).join('')}
                                </div>
                            </div>
                        `;
                    } else if (sec.type === 'shortcut') {
                        html += `
                            <div class="p-3.5 sm:p-4 rounded-2xl bg-amber-50/90 dark:bg-slate-800/90 border border-amber-200/90 dark:border-slate-700 space-y-2 mb-3">
                                <div class="font-extrabold text-amber-950 dark:text-amber-300 text-xs sm:text-[13.5px] flex items-center gap-1.5">
                                    <i class="fa-solid fa-bolt text-amber-600"></i>
                                    <span>${sec.heading}</span>
                                </div>
                                <div class="space-y-1 text-xs text-amber-950 dark:text-amber-200 font-medium">
                                    ${sec.items.map(it => `<div class="flex items-start gap-2 py-0.5"><span class="text-amber-600 font-bold shrink-0">⚡</span><span class="leading-relaxed">${it}</span></div>`).join('')}
                                </div>
                            </div>
                        `;
                    } else if (sec.type === 'example') {
                        html += `
                            <div class="p-3.5 sm:p-4 rounded-2xl bg-emerald-50/80 dark:bg-slate-800/90 border border-emerald-200/80 dark:border-slate-700 space-y-2 mb-3">
                                <div class="font-extrabold text-emerald-950 dark:text-emerald-300 text-xs sm:text-[13.5px] flex items-center gap-1.5">
                                    <i class="fa-solid fa-file-pen text-emerald-600"></i>
                                    <span>${sec.heading}</span>
                                </div>
                                <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 text-xs space-y-2">
                                    <div class="font-bold text-slate-800 dark:text-slate-100 leading-snug">${sec.q}</div>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-600 dark:text-slate-300 text-xs font-semibold">
                                        ${sec.options.map(o => `<div class="p-1 rounded bg-slate-50 dark:bg-slate-800 px-2">${o}</div>`).join('')}
                                    </div>
                                    <div class="pt-1.5 border-t border-slate-100 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 font-extrabold">
                                        ✓ Đáp án đúng: ${sec.ans}
                                    </div>
                                    <div class="text-slate-600 dark:text-slate-400 text-xs leading-relaxed bg-emerald-50/50 dark:bg-slate-800/50 p-2 rounded-lg">
                                        💡 <strong>Giải thích 3 bước:</strong> ${sec.explain}
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                });

                bodyEl.innerHTML = html;
            } else {
                bodyEl.innerHTML = `
                    <div class="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2">
                        <div class="font-extrabold text-indigo-900">1. Phương pháp & Chiến thuật làm bài — ${partTitle}</div>
                        <p>Quan sát cấu trúc ngữ pháp tổng thể (Chủ ngữ - Vị ngữ - Tân ngữ), xác định vị trí chỗ trống để phân loại từ cần điền (Danh từ, Động từ, Tính từ hay Trạng từ). Tránh bẫy chia sai ngôi, bẫy mệnh đề thời gian và nhầm lẫn giữa liên từ và giới từ.</p>
                    </div>
                    <div class="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
                        <div class="font-extrabold text-emerald-900">2. Phương pháp giải nhanh trong 5 giây</div>
                        <p>• Nhìn trước chỗ trống: có mạo từ (a/an/the), tính từ sở hữu hoặc to be.<br>• Nhìn sau chỗ trống: có danh từ tân ngữ hay giới từ để chọn thể chủ động/bị động.</p>
                    </div>
                `;
            }

            const m = document.getElementById('theoryModal');
            m.classList.remove('hidden');
            m.classList.add('flex');
        }

        function closeTheoryModal() {
            const m = document.getElementById('theoryModal');
            m.classList.add('hidden');
            m.classList.remove('flex');
        }

        function saveCurrentTheoryToNote() {
            const data = window.grammarTheoryDatabase ? (window.grammarTheoryDatabase[currentTheoryTopicTitle] || null) : null;
            let noteContent = '';
            if (data) {
                noteContent = `# ${data.title}\n\n${data.overview}\n\n`;
                data.sections.forEach(s => {
                    noteContent += `## ${s.heading}\n`;
                    if (s.items) {
                        s.items.forEach(it => {
                            if (typeof it === 'string') {
                                noteContent += `- ${it}\n`;
                            } else {
                                noteContent += `- **${it.title}**: ${it.formula} (${it.note || ''})\n`;
                            }
                        });
                    }
                    if (s.q) {
                        noteContent += `Câu hỏi ví dụ: ${s.q}\nĐáp án: ${s.ans}\nGiải thích: ${s.explain}\n`;
                    }
                    noteContent += '\n';
                });
            } else {
                noteContent = document.getElementById('theoryModalBody').innerText;
            }

            takeNotesList.unshift({
                id: 'note_' + Date.now(),
                title: `Lý thuyết: ${currentTheoryTopicTitle}`,
                category: 'Ngữ pháp',
                content: noteContent,
                date: new Date().toLocaleDateString('vi-VN')
            });
            persistTakeNotes();
            renderTakeNoteSidebarList();
            state.xp += 5;
            updateDashboardMetrics();
            showToast(`🔖 Đã lưu toàn bộ lý thuyết "${currentTheoryTopicTitle}" vào Sổ Take Note (+5 XP)!`);
        }

        function startQuizFromTheory() {
            closeTheoryModal();
            startQuickQuiz('grammar', currentTheoryTopicTitle, 50);
        }

        // =========================================================================
        // DAILY TASKS MANAGER (NHIỆM VỤ HÔM NAY - THỰC TẾ THEO NGÀY, KHÔNG HARDCODE)
        // =========================================================================
        const DailyTaskManager = {
            defaultTargets: {
                grammar: 20,
                vocabReview: 10,
                vocabNew: 10,
                listening: 10,
                reading: 10
            },

            getTodayDateStr() {
                // Định dạng YYYY-MM-DD theo múi giờ Việt Nam (UTC+7)
                const now = new Date();
                const vnTime = new Date(now.getTime() + (7 * 3600 - now.getTimezoneOffset() * 60) * 1000);
                return vnTime.toISOString().slice(0, 10);
            },

            getStorageKey() {
                if (window.AuthSyncManager && typeof window.AuthSyncManager.getStorageKey === 'function') {
                    return `${window.AuthSyncManager.getStorageKey()}_daily_tasks`;
                }
                const uid = (currentUserAccount?.id || 'guest').replace(/[^a-zA-Z0-9_-]/g, '_');
                return `cung_dang_daily_tasks_${uid}`;
            },

            loadTasks() {
                const todayStr = this.getTodayDateStr();
                const key = this.getStorageKey();
                let data = null;
                try {
                    const raw = localStorage.getItem(key);
                    if (raw) data = JSON.parse(raw);
                } catch (e) {}

                // Nếu là người dùng mới, hoặc đã sang ngày mới -> Khởi tạo tất cả về 0 cho ngày hôm nay!
                if (!data || data.date !== todayStr || !data.tasks) {
                    data = {
                        date: todayStr,
                        tasks: {
                            grammar: { current: 0, target: this.defaultTargets.grammar, xp: 10 },
                            vocabReview: { current: 0, target: this.defaultTargets.vocabReview, xp: 10 },
                            vocabNew: { current: 0, target: this.defaultTargets.vocabNew, xp: 10 },
                            listening: { current: 0, target: this.defaultTargets.listening, xp: 10 },
                            reading: { current: 0, target: this.defaultTargets.reading, xp: 10 }
                        }
                    };
                    this.saveTasks(data);
                }
                return data;
            },

            saveTasks(data) {
                try {
                    const key = this.getStorageKey();
                    localStorage.setItem(key, JSON.stringify(data));
                } catch (e) {}
            },

            recordProgress(taskType, amount = 1) {
                const data = this.loadTasks();
                if (data.tasks && data.tasks[taskType]) {
                    const prevCurrent = data.tasks[taskType].current || 0;
                    const target = data.tasks[taskType].target || 10;
                    data.tasks[taskType].current = prevCurrent + amount;
                    this.saveTasks(data);
                    this.render();

                    // Khi nhiệm vụ chuyển từ chưa xong sang vừa hoàn thành -> Tặng XP thưởng
                    if (prevCurrent < target && data.tasks[taskType].current >= target) {
                        const earnedXp = data.tasks[taskType].xp || 10;
                        state.xp = (state.xp || 0) + earnedXp;
                        showToast(`🎉 Chúc mừng! Bạn vừa hoàn thành nhiệm vụ hôm nay và nhận thêm +${earnedXp} XP!`);
                        if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
                        if (typeof saveCurrentUserProgressToServer === 'function') saveCurrentUserProgressToServer();
                    }
                }
            },

            render() {
                const container = document.getElementById('dailyTasksContainer');
                if (!container) return;

                const data = this.loadTasks();
                const tasks = data.tasks || {};

                const taskConfigs = [
                    {
                        key: 'grammar',
                        title: `Luyện ngữ pháp (${tasks.grammar?.target || 20} câu)`,
                        icon: 'fa-book-open',
                        color: 'purple',
                        tab: 'ngu-phap',
                        desc: 'Luyện đề trắc nghiệm Part 5'
                    },
                    {
                        key: 'vocabReview',
                        title: `Ôn tập từ vựng (${tasks.vocabReview?.target || 10} từ)`,
                        icon: 'fa-rotate',
                        color: 'amber',
                        tab: 'tu-vung',
                        desc: 'Lật Flashcard ôn tập từ đã lưu'
                    },
                    {
                        key: 'vocabNew',
                        title: `Học từ vựng mới (${tasks.vocabNew?.target || 10} từ)`,
                        icon: 'fa-graduation-cap',
                        color: 'fuchsia',
                        tab: 'tu-vung',
                        desc: 'Mở rộng vốn từ vựng TOEIC'
                    },
                    {
                        key: 'listening',
                        title: `Luyện nghe (${tasks.listening?.target || 10} câu)`,
                        icon: 'fa-headphones',
                        color: 'teal',
                        tab: 'nghe',
                        desc: 'Luyện nghe tranh & hội thoại'
                    },
                    {
                        key: 'reading',
                        title: `Luyện đọc (${tasks.reading?.target || 10} câu)`,
                        icon: 'fa-file-lines',
                        color: 'blue',
                        tab: 'doc',
                        desc: 'Luyện đọc đoạn văn Part 6 - 7'
                    }
                ];

                let completedCount = 0;
                let earnedXpToday = 0;

                const colorThemes = {
                    purple: { bar: 'bg-purple-600', bgIcon: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300' },
                    amber: { bar: 'bg-amber-500', bgIcon: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300' },
                    fuchsia: { bar: 'bg-fuchsia-600', bgIcon: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-900/40 dark:text-fuchsia-300' },
                    teal: { bar: 'bg-teal-500', bgIcon: 'bg-teal-100 text-teal-600 dark:bg-teal-900/40 dark:text-teal-300' },
                    blue: { bar: 'bg-blue-600', bgIcon: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' }
                };

                const html = taskConfigs.map(cfg => {
                    const t = tasks[cfg.key] || { current: 0, target: 10, xp: 10 };
                    const current = Math.max(0, t.current || 0);
                    const target = Math.max(1, t.target || 10);
                    const isCompleted = current >= target;
                    const pct = Math.min(100, Math.round((current / target) * 100));

                    if (isCompleted) {
                        completedCount++;
                        earnedXpToday += (t.xp || 10);
                        return `
                            <div onclick="switchTab('${cfg.tab}')" class="cursor-pointer p-3 rounded-2xl bg-emerald-50/70 hover:bg-emerald-100/70 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between transition-all shadow-xs group">
                                <div class="flex items-center gap-2.5 font-extrabold text-slate-800 dark:text-slate-100 text-[13.5px]">
                                    <div class="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                        <i class="fa-solid ${cfg.icon} text-xs"></i>
                                    </div>
                                    <div>
                                        <span class="block">${cfg.title}</span>
                                        <span class="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Đã xong (${current}/${target})</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs flex items-center gap-1">
                                        <i class="fa-solid fa-check text-xs"></i>
                                        <span>+${t.xp} XP</span>
                                    </span>
                                </div>
                            </div>
                        `;
                    }

                    const theme = colorThemes[cfg.color] || colorThemes.purple;
                    return `
                        <div onclick="switchTab('${cfg.tab}')" class="cursor-pointer p-3 rounded-2xl bg-slate-50/70 hover:bg-white dark:bg-slate-800/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700 space-y-2 transition-all shadow-2xs hover:shadow-xs group">
                            <div class="flex items-center justify-between font-bold">
                                <div class="flex items-center gap-2.5 text-slate-800 dark:text-slate-200">
                                    <div class="w-7 h-7 rounded-xl ${theme.bgIcon} flex items-center justify-center shrink-0">
                                        <i class="fa-solid ${cfg.icon} text-xs"></i>
                                    </div>
                                    <div>
                                        <span class="font-extrabold text-[13.5px] block">${cfg.title}</span>
                                        <span class="text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">${cfg.desc} →</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-slate-500 dark:text-slate-400 font-bold text-xs">${current}/${target}</span>
                                    <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-extrabold text-xs">+${t.xp} XP</span>
                                </div>
                            </div>
                            <div class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div class="h-full ${theme.bar} rounded-full transition-all duration-500" style="width: ${pct}%"></div>
                            </div>
                        </div>
                    `;
                }).join('');

                container.innerHTML = html;

                // Cập nhật Subtitle: 0/5 nhiệm vụ đã xong
                const subTitle = document.getElementById('memberTasksSubtitle');
                if (subTitle) {
                    if (completedCount === 0) {
                        subTitle.textContent = '0/5 nhiệm vụ đã xong';
                    } else if (completedCount === 5) {
                        subTitle.textContent = '🎉 5/5 nhiệm vụ đã hoàn thành!';
                    } else {
                        subTitle.textContent = `${completedCount}/5 nhiệm vụ đã xong`;
                    }
                }

                // Cập nhật badge tổng XP
                const xpBadge = document.getElementById('memberTasksTotalXp');
                if (xpBadge) {
                    xpBadge.textContent = `+${earnedXpToday} XP`;
                    if (completedCount === 5) {
                        xpBadge.className = 'px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-extrabold';
                    } else if (completedCount > 0) {
                        xpBadge.className = 'px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-extrabold';
                    } else {
                        xpBadge.className = 'px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs font-extrabold';
                    }
                }
            }
        };
        
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
            if (prefixEl) prefixEl.textContent = `${greeting},`;

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
                    subTextEl.textContent = `Mục tiêu ${score} TOEIC · Còn ${daysRemaining} ngày ôn luyện tập trung`;
                }

                let diagResults = user?.diagnosticResults;
                if (!diagResults) {
                    try {
                        const guestDiag = localStorage.getItem('study_studio_guest_diagnostic') || localStorage.getItem('cung_dang_diagnostic_results');
                        if (guestDiag) diagResults = JSON.parse(guestDiag);
                    } catch(e) {}
                }

                if (diagResults) {
                    // TÍNH TOÁN ĐỘNG TỪ ROADMAP ENGINE: Tìm lỗ hổng yếu nhất của học viên
                    let weakestPillar = 'gap-part5-grammar';
                    let stageId = 2;
                    if (typeof PersonalizedRoadmapEngine !== 'undefined' && typeof PersonalizedRoadmapEngine.calculateNodeStates === 'function') {
                        try {
                            const res = PersonalizedRoadmapEngine.calculateNodeStates();
                            if (res && res.weakestPillarId) weakestPillar = res.weakestPillarId;
                            if (res && res.currentStageId) stageId = res.currentStageId;
                        } catch(e) {}
                    }

                    const lessonPresets = {
                        'gap-part12-listening': {
                            title: 'Part 1 & 2 — Bẫy Nghe hình ảnh & Đáp án Gián tiếp',
                            count: '15 câu hỏi trọng tâm',
                            time: '10 phút',
                            tab: 'nghe',
                            tag: 'Luyện nghe phản xạ',
                            smartTitle: 'Cải thiện phản xạ Part 1 & 2',
                            smartBody: 'AI phát hiện bạn hay phân vân bẫy Being vs Been trong tranh tĩnh và câu hỏi phủ định Part 2. Luyện tập ngay để tăng 40 điểm Listening.'
                        },
                        'gap-part34-paraphrase': {
                            title: 'Part 3 & 4 — Kỹ thuật Paraphrasing & Nắm bắt ý đồ người nói',
                            count: '12 câu hỏi hội thoại',
                            time: '12 phút',
                            tab: 'nghe',
                            tag: 'Kỹ thuật nghe hiểu',
                            smartTitle: 'Luyện kỹ thuật Paraphrasing Part 3-4',
                            smartBody: 'Từ đồng nghĩa chuyển đổi ngữ cảnh là bẫy lớn nhất của Part 3-4. Hoàn thành 1 bài luyện ngắn để nắm chắc phương pháp bắt keyword.'
                        },
                        'gap-part5-grammar': {
                            title: 'Part 5 — Nhận diện Hậu tố Từ loại & Bẫy liên từ cốt lõi',
                            count: '12 câu trắc nghiệm',
                            time: '8 phút',
                            tab: 'ngu-phap',
                            tag: 'Trọng tâm ngữ pháp',
                            smartTitle: 'Điểm cần cải thiện để tăng 50+ điểm',
                            smartBody: 'AI phân tích bạn hay nhầm lẫn giữa tính từ đuôi -ive / -al và danh từ trong Part 5. Luyện nhanh 8 câu bẫy kinh điển để khắc phục.'
                        },
                        'gap-part5-vocab': {
                            title: 'Part 5 — Từ vựng & Collocations Công sở Doanh nghiệp',
                            count: '15 cụm từ cố định',
                            time: '8 phút',
                            tab: 'tu-vung',
                            tag: 'Từ vựng & Cụm từ',
                            smartTitle: 'Mở rộng cụm từ cố định Part 5',
                            smartBody: 'Học ngay 15 collocations xuất hiện với tần suất 85% trong đề thi ETS 2026 để làm bài Part 5 trong 10 giây/câu.'
                        },
                        'gap-part6-insertion': {
                            title: 'Part 6 — Điền câu theo mạch logic & Liên từ chuyển ý',
                            count: '10 câu đoạn văn',
                            time: '10 phút',
                            tab: 'doc',
                            tag: 'Đọc hiểu logic',
                            smartTitle: 'Bẫy điền cả câu Part 6',
                            smartBody: 'Bẫy liên từ However, Therefore, In spite of thường làm mất điểm. Luyện 2 đoạn văn Part 6 để làm quen mạch logic.'
                        },
                        'gap-part7-multi': {
                            title: 'Part 7 — Đọc hiểu văn bản đơn & Chuỗi đa đoạn văn',
                            count: '10 câu hỏi Skimming',
                            time: '12 phút',
                            tab: 'doc',
                            tag: 'Kỹ năng Skimming / Scanning',
                            smartTitle: 'Kỹ thuật Skimming / Scanning Part 7',
                            smartBody: 'Tiết kiệm 15 phút làm bài Part 7 bằng kỹ thuật đọc quét thông tin chéo giữa email và hóa đơn đặt hàng.'
                        }
                    };

                    const activeLesson = lessonPresets[weakestPillar] || lessonPresets['gap-part5-grammar'];
                    const tagEl = document.getElementById('heroLessonTag');

                    if (badgeText) badgeText.textContent = `CHẶNG ${stageId} · BÀI HỌC TRỌNG TÂM ETS 2026`;
                    if (titleEl) titleEl.textContent = activeLesson.title;
                    if (countEl) countEl.textContent = activeLesson.count;
                    if (timeEl) timeEl.textContent = activeLesson.time;
                    if (tagEl) tagEl.textContent = activeLesson.tag || 'Trọng tâm lộ trình';
                    if (ctaText) ctaText.textContent = `Tiếp tục học ngay (~${activeLesson.time})`;
                    if (smartTitle) smartTitle.textContent = activeLesson.smartTitle;
                    if (smartBody) smartBody.textContent = activeLesson.smartBody;
                    if (smartBtnText) smartBtnText.textContent = 'Luyện tập trọng tâm ngay →';

                    window._heroNextTabTarget = activeLesson.tab;
                } else {
                    const tagEl = document.getElementById('heroLessonTag');
                    if (badgeText) badgeText.textContent = 'KHỞI ĐỘNG · BƯỚC 1 CỦA LỘ TRÌNH';
                    if (titleEl) titleEl.textContent = 'Bài Test Chẩn Đoán 28 Câu Chuẩn ETS 2026 (7 Part)';
                    if (countEl) countEl.textContent = '28 câu hỏi đa dạng';
                    if (timeEl) timeEl.textContent = '25 phút';
                    if (tagEl) tagEl.textContent = 'Khảo sát năng lực đầu vào';
                    if (ctaText) ctaText.textContent = 'Bắt đầu Test Chẩn Đoán (25 phút)';
                    if (smartTitle) smartTitle.textContent = 'Khảo sát năng lực ban đầu';
                    if (smartBody) smartBody.textContent = 'Bạn chưa làm bài kiểm tra chẩn đoán năng lực. Hãy làm bài test 28 câu chuẩn ETS để AI quét 6 lỗ hổng kiến thức và mở khóa lộ trình tự động.';
                    if (smartBtnText) smartBtnText.textContent = 'Làm bài kiểm tra đầu vào (25 phút) →';

                    window._heroNextTabTarget = 'diagnostic';
                }
            } else {
                let guestDiag = null;
                try {
                    const saved = localStorage.getItem('study_studio_guest_diagnostic') || localStorage.getItem('cung_dang_diagnostic_results');
                    if (saved) guestDiag = JSON.parse(saved);
                } catch(e) {}

                const tagEl = document.getElementById('heroLessonTag');
                if (nameEl) nameEl.textContent = 'bạn!';
                if (targetScoreEl) targetScoreEl.textContent = '--';
                if (examDateEl) examDateEl.textContent = 'Chưa đặt ngày thi';
                if (subTextEl) subTextEl.textContent = guestDiag ? 'Đã làm bài chẩn đoán. Đăng nhập để lưu vĩnh viễn lộ trình.' : 'Đăng nhập để lưu tiến độ và cá nhân hóa lộ trình học';
                if (badgeText) badgeText.textContent = 'KHỞI ĐỘNG · BƯỚC 1 CỦA LỘ TRÌNH';
                if (titleEl) titleEl.textContent = 'Bài Test Chẩn Đoán 28 Câu Chuẩn ETS 2026 (7 Part)';
                if (countEl) countEl.textContent = '28 câu hỏi đa dạng';
                if (timeEl) timeEl.textContent = '25 phút';
                if (tagEl) tagEl.textContent = 'Khảo sát năng lực đầu vào';
                if (ctaText) ctaText.textContent = 'Bắt đầu Test Chẩn Đoán (25 phút)';
                if (smartTitle) smartTitle.textContent = 'Khảo sát năng lực ban đầu';
                if (smartBody) smartBody.textContent = 'Bạn chưa làm bài kiểm tra chẩn đoán năng lực. Hãy làm bài test 28 câu chuẩn ETS để AI quét 6 lỗ hổng kiến thức và mở khóa lộ trình tự động.';
                if (smartBtnText) smartBtnText.textContent = 'Làm bài kiểm tra đầu vào (25 phút) →';
                const bubbleTextEl = document.getElementById('heroSoiMayBubbleText');
                if (bubbleTextEl) bubbleTextEl.textContent = 'Chào bạn! Hãy làm bài test chẩn đoán 25 phút để cùng Sói Mây xây lộ trình riêng nhé! 🎯';
                window._heroNextTabTarget = 'diagnostic';
            }
        };

        window.startHeroNextLesson = function() {
            if (window._heroNextTabTarget === 'diagnostic') {
                if (window.ToeicDiagnosticWorkstation && typeof window.ToeicDiagnosticWorkstation.open === 'function') {
                    window.ToeicDiagnosticWorkstation.open();
                    return;
                }
            }
            if (window._heroNextTabTarget && typeof switchTab === 'function') {
                switchTab(window._heroNextTabTarget);
                return;
            }
            if (typeof switchTab === 'function') {
                switchTab('ngu-phap');
            }
        };

        window.DailyTaskManager = DailyTaskManager;

        // Update UI metrics dynamically
        function updateDashboardMetrics() {
            const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
            const currentXp = state.xp || 0;
            const currentStreak = (currentUserAccount && currentUserAccount.streak !== undefined) ? currentUserAccount.streak : (state.streak || 0);

            setTxt('topXpText', `+${currentXp} XP`);
            setTxt('topStreakText', `${currentStreak} ngày`);
            setTxt('mobileTopXpText', `+${currentXp}`);
            setTxt('mobileTopStreakText', `${currentStreak}`);
            setTxt('streakCardTitle', `Streak ${currentStreak} ngày`);
            setTxt('leaderboardUserXp', `${currentXp} XP`);
            setTxt('todayPaceXp', `+${currentXp} XP`);

            const friCircle = document.getElementById('streak-day-4');
            if (friCircle) {
                if (currentStreak > 0) {
                    friCircle.className = 'w-8 h-8 rounded-full bg-orange-500 text-white border border-orange-300 flex items-center justify-center text-xs font-bold shadow-sm';
                    friCircle.innerHTML = '🔥';
                } else {
                    friCircle.className = 'w-8 h-8 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center text-xs font-bold';
                    friCircle.innerHTML = '5';
                }
            }

            // Vocab Metrics
            const vLearned = state.vocabLearned || 0;
            setTxt('dashVocabCount', vLearned);
            setTxt('dashVocabSub', vLearned > 0 ? `Đã học ${vLearned} từ mới tuần này` : 'Chưa học từ nào tuần này');
            setTxt('vocabHeaderLearned', vLearned);
            setTxt('learnedWordsBadge', vLearned);
            setTxt('ring-vocab-cnt', `${vLearned}/4514`);
            setTxt('ring-vocab-pct', `${Math.min(100, Math.round((vLearned / 4514) * 100))}%`);
            const taskBarVocab = document.getElementById('task-bar-vocab');
            if (taskBarVocab) taskBarVocab.style.width = `${Math.min(100, (vLearned / 10) * 100)}%`;
            setTxt('task-count-vocab', `${Math.min(10, vLearned)}/10`);

            // Accuracy Metrics
            const acc = (state.totalAnswers && state.totalAnswers > 0)
                ? Math.round((state.correctAnswers / state.totalAnswers) * 100)
                : 0;
            setTxt('dashAccuracyVal', acc);
            setTxt('grammarTotalPct', `${acc}%`);
            const dashAccuracyBar = document.getElementById('dashAccuracyBar');
            if (dashAccuracyBar) dashAccuracyBar.style.width = `${acc}%`;
            const grammarTotalBar = document.getElementById('grammarTotalBar');
            if (grammarTotalBar) grammarTotalBar.style.width = `${acc}%`;

            // Time Metrics
            const sMinutes = (currentUserAccount && currentUserAccount.studyMinutes !== undefined) ? currentUserAccount.studyMinutes : (state.studyMinutes || 0);
            setTxt('dashTimeVal', `${sMinutes}p`);
            setTxt('dashTimeSub', `Hôm nay: ${sMinutes} phút`);

            // Grammar Metrics
            const gDone = state.grammarDone || 0;
            setTxt('grammarDoneStat', gDone);
            setTxt('ring-grammar-cnt', `${gDone}/1500`);
            setTxt('ring-grammar-pct', `${Math.min(100, Math.round((gDone / 1500) * 100))}%`);
            const taskBarGrammar = document.getElementById('task-bar-grammar');
            if (taskBarGrammar) taskBarGrammar.style.width = `${Math.min(100, (gDone / 20) * 100)}%`;
            setTxt('task-count-grammar', `${Math.min(20, gDone)}/20`);

            // Listen Metrics
            const lDone = state.listenDone || 0;
            setTxt('listenDoneStat', `${lDone}/2100`);
            setTxt('ring-listen-cnt', `${lDone}/2100`);
            setTxt('ring-listen-pct', `${Math.min(100, Math.round((lDone / 2100) * 100))}%`);
            const taskBarListen = document.getElementById('task-bar-listen');
            if (taskBarListen) taskBarListen.style.width = `${Math.min(100, (lDone / 10) * 100)}%`;
            setTxt('task-count-listen', `${Math.min(10, lDone)}/10`);

            // Read Metrics
            const rDone = state.readDone || 0;
            setTxt('readDoneStat', `${rDone}/2100`);
            setTxt('ring-read-cnt', `${rDone}/2100`);
            setTxt('ring-read-pct', `${Math.min(100, Math.round((rDone / 2100) * 100))}%`);
            const taskBarRead = document.getElementById('task-bar-read');
            if (taskBarRead) taskBarRead.style.width = `${Math.min(100, (rDone / 10) * 100)}%`;
            setTxt('task-count-read', `${Math.min(10, rDone)}/10`);

            // Member Dashboard Summary Cards (5 thẻ Pastel chuẩn Ảnh 4)
            if (currentUserAccount) {
                setTxt('memberTargetScore', currentUserAccount.targetScore || '——');
                setTxt('memberExamDate', currentUserAccount.examDate ? `Thi: ${currentUserAccount.examDate}` : 'Thi: Chưa đặt');
            } else {
                setTxt('memberTargetScore', '——');
                setTxt('memberExamDate', 'Thi: Chưa đặt');
            }
            setTxt('memberVocabCount', vLearned);
            setTxt('memberVocabSub', vLearned > 0 ? `Đã học ${vLearned} từ mới tuần này` : 'Chưa học từ nào tuần này');

            if (state.totalAnswers && state.totalAnswers > 0) {
                const acc = Math.round((state.correctAnswers / state.totalAnswers) * 100);
                setTxt('memberAccuracyVal', acc);
                setTxt('memberAccuracySub', `Đã làm ${state.totalAnswers} câu`);
            } else {
                setTxt('memberAccuracyVal', '——');
                setTxt('memberAccuracySub', 'Làm bài để biết độ chính xác');
            }

            if (sMinutes > 0) {
                setTxt('memberStudyTime', `${sMinutes}p`);
                setTxt('memberStudyTimeSub', `Hôm nay: ${sMinutes} phút`);
            } else {
                setTxt('memberStudyTime', '——');
                setTxt('memberStudyTimeSub', 'Hôm nay: chưa học');
            }

            setTxt('sanhMemberStreakVal', `${currentStreak} ngày`);
            setTxt('sanhMemberStreakTitle', `Streak ${currentStreak} ngày`);

            // 1. Tính toán câu đúng / câu làm Ngữ pháp thực tế
            let gAnswered = 0;
            let gCorrect = 0;
            const currentUserId = (currentUserAccount && currentUserAccount.id) ? currentUserAccount.id : 'guest';
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    if (k && k.startsWith(`grammar_progress_${currentUserId}_`)) {
                        const raw = localStorage.getItem(k);
                        if (raw) {
                            const parsed = JSON.parse(raw);
                            if (parsed.questionStatusMap) {
                                const vals = Object.values(parsed.questionStatusMap);
                                gAnswered += vals.length;
                                gCorrect += vals.filter(v => v === 'correct').length;
                            }
                        }
                    }
                }
            } catch (e) {}
            if (gAnswered === 0 && (state.grammarDone || 0) > 0) {
                gAnswered = state.grammarDone;
                gCorrect = state.correctAnswers || state.grammarDone;
            }

            // 2. Tính toán Từ vựng thực tế
            const vAnswered = state.vocabTotalAnswers || (vLearned > 0 ? vLearned : 0);
            const vCorrect = state.vocabCorrectAnswers || vLearned;

            // Update 4 Horizontal Progress Bars for Skill Balance (Logic chuẩn Senior Tech Lead & Product Designer)
            const diag = (currentUserAccount && currentUserAccount.diagnosticResults) ? currentUserAccount.diagnosticResults : null;

            // 1. Luyện Nghe (Listening)
            const lProg = document.getElementById('skillAccuracyListenProgress');
            const lPct = document.getElementById('skillAccuracyListenPct');
            const lCount = document.getElementById('skillAccuracyListenCount');
            const lDetail = document.getElementById('skillAccuracyListenDetail');
            let listenProgWidth = 0;
            if (state.listenTotalAnswers && state.listenTotalAnswers > 0) {
                const correct = state.listenCorrectAnswers || 0;
                const total = state.listenTotalAnswers;
                const accPct = Math.min(100, Math.max(0, Math.round((correct / total) * 100)));
                if (lPct) lPct.textContent = `${accPct}%`;
                if (lCount) lCount.textContent = `${total}/2100 câu`;
                if (lDetail) lDetail.textContent = `Đã làm ${total} câu · Đúng ${correct}/${total} câu`;
                listenProgWidth = Math.min(100, Math.max(1, Math.round((total / 2100) * 100 * 5))); // Scale để trực quan nhưng vẫn minh bạch
            } else if (lDone > 0) {
                if (lPct) lPct.textContent = '100%';
                if (lCount) lCount.textContent = `${lDone}/2100 câu`;
                if (lDetail) lDetail.textContent = `Đã hoàn thành ${lDone} câu luyện nghe`;
                listenProgWidth = Math.min(100, Math.max(1, Math.round((lDone / 2100) * 100 * 5)));
            } else if (diag && diag.listening) {
                const diagPct = Math.round((diag.listening / 495) * 100);
                if (lPct) lPct.textContent = `${diagPct}%`;
                if (lCount) lCount.textContent = `${diag.listening}/495 điểm ETS`;
                if (lDetail) lDetail.textContent = `Năng lực dự báo: ${diag.listening} điểm Listening`;
                listenProgWidth = diagPct;
            } else {
                if (lPct) lPct.textContent = 'Chưa test';
                if (lCount) lCount.textContent = '0/2100 câu';
                if (lDetail) lDetail.textContent = 'Chưa làm bài kiểm tra nào';
                listenProgWidth = 0;
            }
            if (lProg) lProg.style.width = `${listenProgWidth}%`;

            // 2. Luyện Đọc (Reading)
            const rProg = document.getElementById('skillAccuracyReadProgress');
            const rPct = document.getElementById('skillAccuracyReadPct');
            const rCount = document.getElementById('skillAccuracyReadCount');
            const rDetail = document.getElementById('skillAccuracyReadDetail');
            let readProgWidth = 0;
            if (state.readTotalAnswers && state.readTotalAnswers > 0) {
                const correct = state.readCorrectAnswers || 0;
                const total = state.readTotalAnswers;
                const accPct = Math.min(100, Math.max(0, Math.round((correct / total) * 100)));
                if (rPct) rPct.textContent = `${accPct}%`;
                if (rCount) rCount.textContent = `${total}/2100 câu`;
                if (rDetail) rDetail.textContent = `Đã làm ${total} câu · Đúng ${correct}/${total} câu`;
                readProgWidth = Math.min(100, Math.max(1, Math.round((total / 2100) * 100 * 5)));
            } else if (rDone > 0) {
                if (rPct) rPct.textContent = '100%';
                if (rCount) rCount.textContent = `${rDone}/2100 câu`;
                if (rDetail) rDetail.textContent = `Đã hoàn thành ${rDone} câu luyện đọc`;
                readProgWidth = Math.min(100, Math.max(1, Math.round((rDone / 2100) * 100 * 5)));
            } else if (diag && diag.reading) {
                const diagPct = Math.round((diag.reading / 495) * 100);
                if (rPct) rPct.textContent = `${diagPct}%`;
                if (rCount) rCount.textContent = `${diag.reading}/495 điểm ETS`;
                if (rDetail) rDetail.textContent = `Năng lực dự báo: ${diag.reading} điểm Reading`;
                readProgWidth = diagPct;
            } else {
                if (rPct) rPct.textContent = 'Chưa test';
                if (rCount) rCount.textContent = '0/2100 câu';
                if (rDetail) rDetail.textContent = 'Chưa làm bài kiểm tra nào';
                readProgWidth = 0;
            }
            if (rProg) rProg.style.width = `${readProgWidth}%`;

            // 3. Ngữ pháp trọng tâm (Grammar)
            const gProg = document.getElementById('skillAccuracyGrammarProgress');
            const gPct = document.getElementById('skillAccuracyGrammarPct');
            const gCount = document.getElementById('skillAccuracyGrammarCount');
            const gDetail = document.getElementById('skillAccuracyGrammarDetail');
            let grammarProgWidth = 0;
            if (gAnswered > 0) {
                const safeCorrect = Math.min(gCorrect, gAnswered);
                const accPct = Math.min(100, Math.max(0, Math.round((safeCorrect / gAnswered) * 100)));
                if (gPct) gPct.textContent = `${accPct}%`;
                if (gCount) gCount.textContent = `${gAnswered}/1500 câu`;
                if (gDetail) gDetail.textContent = `Đã làm ${gAnswered} câu · Đúng ${safeCorrect}/${gAnswered} câu`;
                grammarProgWidth = Math.min(100, Math.max(1, Math.round((gAnswered / 1500) * 100 * 5)));
            } else if (diag && diag.reading) {
                const estPct = Math.round((diag.reading / 495) * 100);
                if (gPct) gPct.textContent = `${estPct}%`;
                if (gCount) gCount.textContent = 'Dự báo năng lực';
                if (gDetail) gDetail.textContent = `Ước lượng qua kỹ năng Đọc: ${estPct}%`;
                grammarProgWidth = estPct;
            } else {
                if (gPct) gPct.textContent = 'Chưa test';
                if (gCount) gCount.textContent = '0/1500 câu';
                if (gDetail) gDetail.textContent = 'Chưa làm câu ngữ pháp nào';
                grammarProgWidth = 0;
            }
            if (gProg) gProg.style.width = `${grammarProgWidth}%`;

            // 4. Kho Từ vựng cốt lõi (Vocabulary)
            const vProg = document.getElementById('skillAccuracyVocabProgress');
            const vPct = document.getElementById('skillAccuracyVocabPct');
            const vCount = document.getElementById('skillAccuracyVocabCount');
            const vDetail = document.getElementById('skillAccuracyVocabDetail');
            let vocabProgWidth = 0;
            if (vAnswered > 0) {
                const safeVCorrect = Math.min(vCorrect, vAnswered);
                const accPct = Math.min(100, Math.max(0, Math.round((safeVCorrect / vAnswered) * 100)));
                if (vPct) vPct.textContent = `${accPct}%`;
                if (vCount) vCount.textContent = `${vLearned}/4514 từ`;
                if (vDetail) vDetail.textContent = `Đã học ${vLearned} từ · Độ nhớ ${accPct}%`;
                vocabProgWidth = Math.min(100, Math.max(1, Math.round((vLearned / 500) * 100)));
            } else if (vLearned > 0) {
                if (vPct) vPct.textContent = '100%';
                if (vCount) vCount.textContent = `${vLearned}/4514 từ`;
                if (vDetail) vDetail.textContent = `Đã thuộc ${vLearned} từ vựng cốt lõi`;
                vocabProgWidth = Math.min(100, Math.max(1, Math.round((vLearned / 500) * 100)));
            } else {
                if (vPct) vPct.textContent = 'Chưa học';
                if (vCount) vCount.textContent = '0/4514 từ';
                if (vDetail) vDetail.textContent = 'Chưa học từ vựng nào';
                vocabProgWidth = 0;
            }
            if (vProg) vProg.style.width = `${vocabProgWidth}%`;

            if (window.EtsAdaptiveScorer && typeof window.EtsAdaptiveScorer.renderDashboardWidget === 'function') {
                window.EtsAdaptiveScorer.renderDashboardWidget();
            }

            if (typeof updateDashboardStudioHero === 'function') {
                updateDashboardStudioHero();
            }

            if (window.EtsAdaptiveScorer && typeof window.EtsAdaptiveScorer.renderDashboardWidget === 'function') {
                window.EtsAdaptiveScorer.renderDashboardWidget();
            }

            if (window.DailyTaskManager && typeof window.DailyTaskManager.render === 'function') {
                window.DailyTaskManager.render();
            }
        }

        // Target Modal Handlers
        function openTargetModal() {
            if (!currentUserAccount) {
                showToast('⚠️ Vui lòng đăng nhập hoặc tạo tài khoản để đặt mục tiêu cá nhân!');
                if (window.UserAuthEngine) window.UserAuthEngine.showForcedGatekeeper();
                return;
            }
            const inputScore = document.getElementById('inputTargetScore');
            const inputDate = document.getElementById('inputTargetDate');
            if (inputScore) inputScore.value = currentUserAccount.targetScore || '600';
            if (inputDate) inputDate.value = currentUserAccount.examDate || '20/12/2026';

            const m = document.getElementById('targetModal');
            if (m) {
                m.classList.remove('hidden');
                m.classList.add('flex');
            }
        }

        function saveTargetSettings() {
            const scoreInput = document.getElementById('inputTargetScore');
            const dateInput = document.getElementById('inputTargetDate');
            const score = (scoreInput && scoreInput.value) ? scoreInput.value.trim() : '600';
            const date = (dateInput && dateInput.value) ? dateInput.value.trim() : '20/12/2026';

            // 1. Cập nhật thẻ mục tiêu trên Sảnh hôm nay (Ảnh 4 & Ảnh 1)
            const scoreEl = document.getElementById('memberTargetScore');
            if (scoreEl) scoreEl.textContent = score || '——';
            const dateEl = document.getElementById('memberExamDate');
            if (dateEl) dateEl.textContent = date ? `Thi: ${date}` : 'Thi: Chưa đặt';

            // 2. Cập nhật các trường phụ trong trang cài đặt
            const profTarget = document.getElementById('profileTargetScoreInput');
            const profDate = document.getElementById('profileExamDateInput');
            if (profTarget) profTarget.value = score;
            if (profDate) profDate.value = date;

            const oldScore = document.getElementById('targetScoreVal');
            if (oldScore) oldScore.textContent = score;
            const oldDate = document.getElementById('targetDateVal');
            if (oldDate) oldDate.textContent = `Thi: ${date}`;

            // 3. Cập nhật tài khoản hiện tại và đồng bộ
            if (currentUserAccount) {
                currentUserAccount.targetScore = score;
                currentUserAccount.examDate = date;
                syncCurrentAccountState();

                // Lưu lên server qua /api/user/update-target
                fetch('/api/user/update-target', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ targetScore: score, examDate: date, userId: currentUserAccount.id })
                }).catch(err => console.warn('Lỗi lưu mục tiêu lên máy chủ:', err));
            }

            const m = document.getElementById('targetModal');
            if (m) {
                m.classList.add('hidden');
                m.classList.remove('flex');
            }
            showToast('🎯 Đã lưu mục tiêu điểm số và ngày thi!');
        }

        // =========================================================================
        // 8. PROFILE DROPDOWN, ACCOUNT PROFILE (IMAGE 3), SETTINGS (IMAGE 4) & MULTI-USER AUTH
        // =========================================================================
        const defaultAccountsList = [];
        let accountsDirectory = [];
        if (!currentUserAccount) currentUserAccount = null;
        if (!window.currentUserAccount) window.currentUserAccount = null;

        window.getCurrentUser = function() {
            if (currentUserAccount && currentUserAccount.id) {
                window.currentUserAccount = currentUserAccount;
                return currentUserAccount;
            }
            if (window.currentUserAccount && window.currentUserAccount.id) {
                currentUserAccount = window.currentUserAccount;
                return window.currentUserAccount;
            }
            try {
                const s = localStorage.getItem('cung_dang_session_user');
                if (s) {
                    const u = JSON.parse(s);
                    if (u && u.id) {
                        currentUserAccount = u;
                        window.currentUserAccount = u;
                        return u;
                    }
                }
            } catch(e) {}
            return null;
        };

        function renderStreakWeekDays(streakInfo) {
            const row = document.getElementById('memberStreakDaysRow');
            const title = document.getElementById('sanhMemberStreakTitle');
            const streakVal = document.getElementById('sanhMemberStreakVal');
            const streakCount = streakInfo?.streak !== undefined ? streakInfo.streak : ((currentUserAccount && currentUserAccount.streak !== undefined) ? currentUserAccount.streak : (state.streak || 0));

            if (title) title.textContent = `Streak ${streakCount} ngày`;
            if (streakVal) streakVal.textContent = `${streakCount} ngày`;

            if (!row) return;

            // Xây dựng 7 ngày trong tuần hiện tại (T2 -> CN)
            const todayIdx = (new Date().getDay() + 6) % 7; // 0 = T2, 6 = CN
            const weekDays = (streakInfo && Array.isArray(streakInfo.weekDays) && streakInfo.weekDays.length === 7)
                ? streakInfo.weekDays
                : [
                    { label: 'T2', active: streakCount >= (todayIdx >= 0 ? 1 : 0) },
                    { label: 'T3', active: streakCount >= (todayIdx >= 1 ? 2 : 0) },
                    { label: 'T4', active: streakCount >= (todayIdx >= 2 ? 3 : 0) },
                    { label: 'T5', active: streakCount >= (todayIdx >= 3 ? 4 : 0) },
                    { label: 'T6', active: streakCount >= (todayIdx >= 4 ? 5 : 0) },
                    { label: 'T7', active: streakCount >= (todayIdx >= 5 ? 6 : 0) },
                    { label: 'CN', active: streakCount >= (todayIdx >= 6 ? 7 : 0) }
                ];

            row.innerHTML = weekDays.map((d, idx) => {
                const isToday = idx === todayIdx;
                if (d.active) {
                    return `
                        <div class="flex flex-col items-center gap-0.5">
                            <div class="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] shadow-xs ${isToday ? 'ring-2 ring-amber-300 dark:ring-amber-600 font-bold' : ''}" title="${d.label}: Đã học liên tục">
                                <i class="fa-solid fa-fire text-[8.5px]"></i>
                            </div>
                            <span class="text-xs font-bold text-amber-700 dark:text-amber-400">${d.label}</span>
                        </div>
                    `;
                }
                return `
                    <div class="flex flex-col items-center gap-0.5">
                        <div class="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[9px] text-slate-400 ${isToday ? 'ring-2 ring-blue-400 dark:ring-blue-500 font-bold text-blue-600' : ''}" title="${d.label}: Chưa có hoạt động">
                            ${isToday ? '•' : ''}
                        </div>
                        <span class="text-xs font-semibold text-slate-400">${d.label}</span>
                    </div>
                `;
            }).join('');
        }
        window.renderStreakWeekDays = renderStreakWeekDays;

        function applyGuestStateToUI() {
            currentUserAccount = null;
            window.currentUserAccount = null;
            const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

            setTxt('userNameDisplay', 'Học viên!');
            setTxt('topUserName', 'Chưa đăng nhập');
            setTxt('dropdownUserName', 'Chưa đăng nhập');
            setTxt('dropdownUserEmail', 'Vui lòng đăng nhập để bắt đầu');
            setTxt('sanhGreetingPrefix', 'Chào bạn!');
            setTxt('sanhMemberGreetingName', 'Hãy đăng nhập để lưu tiến độ');
            setTxt('sanhMemberProfileName', 'Học viên');
            setTxt('sanhMemberDropdownEmail', 'Chưa đăng nhập');
            setTxt('mobileDropdownEmail', 'Chưa đăng nhập');
            setTxt('memberTargetScore', '——');
            setTxt('memberExamDate', 'Thi: Chưa đặt');
            setTxt('memberVocabCount', '0');
            setTxt('memberAccuracyVal', '——');
            setTxt('memberStudyTime', '——');
            setTxt('sanhMemberStreakVal', '0 ngày');
            setTxt('sanhMemberStreakTitle', 'Streak 0 ngày');
            setTxt('sanhMemberXpVal', '0 XP');
            setTxt('targetScoreVal', '——');
            setTxt('targetDateVal', 'Chưa đặt');

            renderStreakWeekDays({ streak: 0, weekDays: [] });
            if (window.DailyTaskManager && typeof window.DailyTaskManager.render === 'function') {
                window.DailyTaskManager.render();
            }

            const sanhAv = document.getElementById('sanhMemberAvatar');
            if (sanhAv) {
                sanhAv.textContent = '?';
                sanhAv.className = 'w-7 h-7 rounded-full bg-slate-400 text-white font-extrabold text-xs flex items-center justify-center ring-2 ring-slate-300/40';
            }
            const mobTopAv = document.getElementById('mobileTopAvatar');
            if (mobTopAv) {
                mobTopAv.innerHTML = '<span id="mobileTopAvatarText">?</span>';
                mobTopAv.className = 'w-8 h-8 rounded-full bg-slate-400 text-white font-bold text-xs flex items-center justify-center ring-2 ring-slate-400/50 cursor-pointer';
            }

            // Đảm bảo các ô hồ sơ trống trơn
            const nameIn = document.getElementById('profileFullNameInput');
            const emailIn = document.getElementById('profileEmailInput');
            const targetIn = document.getElementById('profileTargetScoreInput');
            const dateIn = document.getElementById('profileExamDateInput');
            if (nameIn) nameIn.value = '';
            if (emailIn) emailIn.value = '';
            if (targetIn) targetIn.value = '';
            if (dateIn) dateIn.value = '';

            const avatarPrev = document.getElementById('profileAvatarPreview');
            if (avatarPrev) {
                avatarPrev.innerHTML = '<i class="fa-solid fa-user"></i>';
                avatarPrev.className = 'w-20 h-20 rounded-full bg-blue-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-lg ring-4 ring-white dark:ring-slate-800 overflow-hidden cursor-pointer';
            }

            // Đảm bảo các ô đăng nhập trống trơn
            const loginEmailIn = document.getElementById('loginEmailInput');
            if (loginEmailIn) loginEmailIn.value = '';
            const loginPassIn = document.getElementById('loginPasswordInput');
            if (loginPassIn) loginPassIn.value = '';

            // Đặt tất cả chỉ số về 0 để không lẫn lộn với bất kỳ ai
            state.xp = 0;
            state.streak = 0;
            state.vocabLearned = 0;
            state.dictationDone = 0;
            state.grammarDone = 0;
            state.readDone = 0;
            state.listenDone = 0;
            state.studyMinutes = 0;
            learnedVocabItems = [];
            savedVocabItems = [];
            savedGrammarNotes = [];
            state.savedWords = [];

            updateDashboardMetrics();
            renderLearnedVocabList();
            renderSavedVocabList();
            renderAllVocabGroups();
            renderAllGrammarGroups();
            renderMultiAccountLists();
            if (typeof updateSanhAndSidebarVisibility === 'function') {
                updateSanhAndSidebarVisibility(false);
            }
        }

        function closeAllProfileDropdowns() {
            const m1 = document.getElementById('profileDropdownMenu');
            if (m1) m1.classList.add('hidden');
            const m2 = document.getElementById('sanhMemberProfileMenu');
            if (m2) m2.classList.add('hidden');
            const m3 = document.getElementById('mobileProfileMenu');
            if (m3) m3.classList.add('hidden');
            const bubble = document.getElementById('heroSoiMayBubble');
            if (bubble) bubble.classList.remove('invisible', 'opacity-0');
        }

        function toggleMemberProfileDropdown(e) {
            if (e) e.stopPropagation();
            const menu = document.getElementById('sanhMemberProfileMenu');
            if (menu) {
                const isOpening = menu.classList.contains('hidden');
                menu.classList.toggle('hidden');
                const bubble = document.getElementById('heroSoiMayBubble');
                if (bubble) {
                    if (isOpening) {
                        bubble.classList.add('invisible', 'opacity-0');
                    } else {
                        bubble.classList.remove('invisible', 'opacity-0');
                    }
                }
            }
        }

        function toggleProfileDropdown(e) {
            if (e) e.stopPropagation();
            const menu = document.getElementById('profileDropdownMenu');
            if (menu) menu.classList.toggle('hidden');
        }

        function toggleMobileProfileDropdown(e) {
            if (e) e.stopPropagation();
            const menu = document.getElementById('mobileProfileMenu');
            if (menu) menu.classList.toggle('hidden');
        }

        // Close profile dropdown when clicking outside
        document.addEventListener('click', function (e) {
            const w1 = document.getElementById('profileDropdownWrapper');
            const m1 = document.getElementById('profileDropdownMenu');
            if (w1 && m1 && !w1.contains(e.target)) {
                m1.classList.add('hidden');
            }

            const w2 = document.getElementById('sanhMemberDropdownWrapper');
            const m2 = document.getElementById('sanhMemberProfileMenu');
            if (w2 && m2 && !w2.contains(e.target)) {
                m2.classList.add('hidden');
                const bubble = document.getElementById('heroSoiMayBubble');
                if (bubble) bubble.classList.remove('invisible', 'opacity-0');
            }

            const w3 = document.getElementById('mobileProfileDropdownWrapper');
            const m3 = document.getElementById('mobileProfileMenu');
            if (w3 && m3 && !w3.contains(e.target)) {
                m3.classList.add('hidden');
            }
        });

        function openAccountProfileView() {
            closeAllProfileDropdowns();
            if (!currentUserAccount) {
                showToast('⚠️ Vui lòng đăng nhập hoặc tạo tài khoản để quản lý hồ sơ!');
                if (window.UserAuthEngine) window.UserAuthEngine.showForcedGatekeeper();
                return;
            }
            populateAccountProfileForm();
            switchTab('tai-khoan');
        }

        function openAccountSettingsView() {
            closeAllProfileDropdowns();
            if (!currentUserAccount) {
                showToast('⚠️ Vui lòng đăng nhập hoặc tạo tài khoản để cài đặt!');
                if (window.UserAuthEngine) window.UserAuthEngine.showForcedGatekeeper();
                return;
            }
            updateSettingsThemeButtonsUI();
            initBocBangSettingsGlobalUI();
            switchTab('cai-dat');
        }

        function saveBocBangSettingsFromGlobal() {
            const engine = document.getElementById('settingsSttEngineSelect')?.value || 'browser_transformers';
            const key = (document.getElementById('settingsGroqApiKeyInput')?.value || '').trim();
            localStorage.setItem('cd_stt_engine', engine);
            localStorage.setItem('cd_groq_api_key', key);
            if (window.ToeicBocBangStation && window.ToeicBocBangStation.instance) {
                window.ToeicBocBangStation.instance.activeEngine = engine;
                window.ToeicBocBangStation.instance.groqApiKey = key;
            }
            if (typeof showToast === 'function') showToast('✅ Đã lưu cấu hình AI Bóc Băng!');
        }

        function initBocBangSettingsGlobalUI() {
            const engine = localStorage.getItem('cd_stt_engine') || 'browser_transformers';
            const key = localStorage.getItem('cd_groq_api_key') || '';
            const sel = document.getElementById('settingsSttEngineSelect');
            const inp = document.getElementById('settingsGroqApiKeyInput');
            if (sel) sel.value = engine;
            if (inp) inp.value = key;
        }

        function populateAccountProfileForm() {
            const nameIn = document.getElementById('profileFullNameInput');
            const emailIn = document.getElementById('profileEmailInput');
            const examIn = document.getElementById('profileExamInput');
            const targetIn = document.getElementById('profileTargetScoreInput');
            const dateIn = document.getElementById('profileExamDateInput');

            if (!currentUserAccount) {
                if (nameIn) nameIn.value = '';
                if (emailIn) emailIn.value = '';
                if (targetIn) targetIn.value = '';
                if (dateIn) dateIn.value = '';
                return;
            }

            if (nameIn) nameIn.value = currentUserAccount.name || '';
            if (emailIn) emailIn.value = currentUserAccount.email || '';
            if (examIn) examIn.value = currentUserAccount.exam || 'TOEIC';
            if (targetIn) targetIn.value = currentUserAccount.targetScore || '600';
            if (dateIn) dateIn.value = currentUserAccount.examDate || '20/12/2026';
        }

        function saveAccountProfileChanges() {
            if (!currentUserAccount) {
                showToast('⚠️ Vui lòng đăng nhập để lưu thay đổi hồ sơ!');
                if (window.UserAuthEngine) window.UserAuthEngine.showForcedGatekeeper();
                return;
            }
            const nameVal = (document.getElementById('profileFullNameInput')?.value || '').trim();
            const emailVal = (document.getElementById('profileEmailInput')?.value || '').trim();
            const examVal = document.getElementById('profileExamInput')?.value || 'TOEIC';
            const scoreVal = document.getElementById('profileTargetScoreInput')?.value || '600';
            const dateVal = (document.getElementById('profileExamDateInput')?.value || '').trim() || '20/12/2026';

            if (!nameVal) {
                showToast('⚠️ Họ và tên không được để trống!');
                return;
            }

            currentUserAccount.name = nameVal;
            if (emailVal) currentUserAccount.email = emailVal;
            currentUserAccount.exam = examVal;
            currentUserAccount.targetScore = scoreVal;
            currentUserAccount.examDate = dateVal;

            applyCurrentAccountToUI();
            syncCurrentAccountState();
            showToast('💾 Đã lưu thay đổi hồ sơ tài khoản thành công!');
        }

        function updateAccountPassword() {
            const p1 = document.getElementById('settingsNewPassword')?.value || '';
            const p2 = document.getElementById('settingsConfirmPassword')?.value || '';
            if (!p1) {
                showToast('Vui lòng nhập mật khẩu mới!');
                return;
            }
            if (p1 !== p2) {
                showToast('Mật khẩu xác nhận không khớp. Vui lòng kiểm tra lại!');
                return;
            }
            currentUserAccount.password = p1;
            document.getElementById('settingsNewPassword').value = '';
            document.getElementById('settingsConfirmPassword').value = '';
            syncCurrentAccountState();
            showToast('🔒 Đã cập nhật mật khẩu cho tài khoản ' + currentUserAccount.email);
        }

        function setAppThemeMode(mode) {
            const htmlEl = document.documentElement;
            if (mode === 'dark') {
                htmlEl.classList.add('dark');
                document.getElementById('themeIcon').className = 'fa-solid fa-moon text-[15px] text-amber-300';
            } else {
                htmlEl.classList.remove('dark');
                document.getElementById('themeIcon').className = 'fa-regular fa-sun text-[15px]';
            }
            updateSettingsThemeButtonsUI();
        }

        function updateSettingsThemeButtonsUI() {
            const isDark = document.documentElement.classList.contains('dark');
            const lightBtn = document.getElementById('settingsThemeLightBtn');
            const darkBtn = document.getElementById('settingsThemeDarkBtn');
            if (!lightBtn || !darkBtn) return;
            if (isDark) {
                darkBtn.className = 'px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 transition';
                lightBtn.className = 'px-4 py-1.5 rounded-full text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition';
            } else {
                lightBtn.className = 'px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 transition';
                darkBtn.className = 'px-4 py-1.5 rounded-full text-slate-700 dark:text-slate-300 text-xs font-bold flex items-center gap-1.5 transition';
            }
        }

        function renderUserAvatarElement(el, account, options = {}) {
            if (!el) return;
            const avatar = account?.avatar || '/assets/mascot/may_avatar.png';
            const avatarColor = account?.avatarColor || 'bg-blue-600';
            const initial = (account?.name || 'U').trim().charAt(0).toUpperCase();
            const rank = account?.rankTier || 'diamond';

            // If RankAvatarFrames engine is loaded and frame is requested (default true)
            if (window.RankAvatarFrames && options.showFrame !== false) {
                const isProfile = el.id === 'profileAvatarPreview';
                const isHeader = el.id === 'sanhMemberAvatar' || el.id === 'mobileTopAvatar' || el.id === 'sanhMemberDropdownAvatar' || el.id === 'topUserAvatar';
                const size = options.size || (isProfile ? 88 : (isHeader ? 42 : 36));
                el.innerHTML = window.RankAvatarFrames.getSvg(rank, avatar, { size });
                el.className = el.className.replace(/\bbg-[a-z0-9-]+\b/g, '').replace('rounded-full', '').trim();
                el.classList.add('relative', 'flex', 'items-center', 'justify-center', 'shrink-0');
                return;
            }

            // Fallback if RankAvatarFrames not yet loaded
            el.innerHTML = '';
            el.className = el.className.replace(/\bbg-[a-z0-9-]+\b/g, '').trim();

            const isImg = avatar && (
                avatar.startsWith('data:image/') ||
                avatar.startsWith('http://') ||
                avatar.startsWith('https://') ||
                avatar.startsWith('/') ||
                avatar.includes('.png') ||
                avatar.includes('.jpg') ||
                avatar.includes('.jpeg') ||
                avatar.includes('.webp') ||
                avatar.includes('.svg')
            );

            if (isImg) {
                el.classList.add('bg-slate-100', 'overflow-hidden', 'relative');
                const img = document.createElement('img');
                img.src = avatar;
                img.alt = account?.name || 'avatar';
                img.className = 'w-full h-full object-cover rounded-full';
                img.referrerPolicy = 'no-referrer';
                img.onerror = function() {
                    this.remove();
                    el.classList.remove('bg-slate-100');
                    el.classList.add(avatarColor, 'overflow-hidden', 'flex', 'items-center', 'justify-center');
                    el.innerHTML = `<span class="select-none font-black text-white leading-none drop-shadow-xs">${initial}</span>`;
                };
                el.appendChild(img);
            } else if (avatar && avatar.length <= 4) { // Emoji mascot
                el.classList.add(avatarColor, 'overflow-hidden', 'flex', 'items-center', 'justify-center');
                el.innerHTML = `<span class="select-none leading-none">${avatar}</span>`;
            } else {
                el.classList.add(avatarColor, 'overflow-hidden', 'flex', 'items-center', 'justify-center');
                el.innerHTML = `<span class="select-none font-black text-white leading-none drop-shadow-xs">${initial}</span>`;
            }
        }

        function handleCustomAvatarUpload(event) {
            const file = event.target.files?.[0];
            if (!file) return;
            if (!file.type.startsWith('image/')) {
                showToast('Vui lòng chọn file hình ảnh hợp lệ (PNG, JPG, WEBP)!');
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                showToast('Ảnh quá lớn (> 2MB). Vui lòng chọn ảnh nhỏ hơn để tối ưu bộ nhớ!');
                return;
            }
            const reader = new FileReader();
            reader.onload = function(e) {
                if (!currentUserAccount) return;
                currentUserAccount.avatar = e.target.result;
                applyCurrentAccountToUI();
                syncCurrentAccountState();
                showToast('🎉 Đã cập nhật ảnh đại diện mới thành công!');
            };
            reader.readAsDataURL(file);
        }

        function selectPresetAvatar(val) {
            if (!currentUserAccount) return;
            currentUserAccount.avatar = val;
            applyCurrentAccountToUI();
            syncCurrentAccountState();
            if (val.startsWith('/') || val.includes('.')) {
                showToast('✨ Đã đổi avatar sang Linh vật Sói Mây!');
            } else {
                showToast(`✨ Đã đổi avatar sang linh vật ${val}!`);
            }
        }

        function selectColorAvatar(colorClass) {
            if (!currentUserAccount) return;
            currentUserAccount.avatarColor = colorClass;
            // Nếu đang dùng ảnh upload thì quay lại dùng chữ với màu này
            if (currentUserAccount.avatar && currentUserAccount.avatar.startsWith('data:image/')) {
                currentUserAccount.avatar = '';
            }
            applyCurrentAccountToUI();
            syncCurrentAccountState();
            showToast('🎨 Đã đổi màu sắc đại diện!');
        }

        function resetAvatarToDefault() {
            if (!currentUserAccount) return;
            currentUserAccount.avatar = '';
            currentUserAccount.avatarColor = 'bg-blue-600';
            applyCurrentAccountToUI();
            syncCurrentAccountState();
            showToast('🔄 Đã khôi phục avatar về chữ cái đầu!');
        }

        function applyCurrentAccountToUI() {
            if (!currentUserAccount) {
                if (typeof window.getCurrentUser === 'function') {
                    currentUserAccount = window.getCurrentUser();
                }
            }
            if (!currentUserAccount) {
                applyGuestStateToUI();
                return;
            }
            window.currentUserAccount = currentUserAccount;
            const initial = currentUserAccount.name.trim().charAt(0).toUpperCase();
            const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };

            setTxt('userNameDisplay', (currentUserAccount.name || 'Học viên') + '!');
            setTxt('topUserName', currentUserAccount.name || 'Tài khoản');
            setTxt('dropdownUserName', currentUserAccount.name || 'Tài khoản');
            setTxt('dropdownUserEmail', currentUserAccount.email || '');
            setTxt('targetScoreVal', currentUserAccount.targetScore || '600');
            setTxt('targetDateVal', `Thi: ${currentUserAccount.examDate || '20/12/2026'}`);

            // Ẩn nút đăng nhập, hiển thị profile dropdown
            const unauthBtn = document.getElementById('unauthLoginBtnGroup');
            const profWrapper = document.getElementById('profileDropdownWrapper');
            const mobUnauthBtn = document.getElementById('mobileUnauthLoginBtn');
            const mobTopAv = document.getElementById('mobileTopAvatar');

            if (unauthBtn) unauthBtn.classList.add('hidden');
            if (profWrapper) profWrapper.classList.remove('hidden');
            if (mobUnauthBtn) mobUnauthBtn.classList.add('hidden');
            if (mobTopAv) mobTopAv.classList.remove('hidden');

            // Cập nhật avatar đồng bộ khắp các vị trí
            renderUserAvatarElement(document.getElementById('sanhMemberAvatar'), currentUserAccount);
            renderUserAvatarElement(document.getElementById('sanhMemberDropdownAvatar'), currentUserAccount);
            renderUserAvatarElement(document.getElementById('topUserAvatar'), currentUserAccount);
            renderUserAvatarElement(document.getElementById('mobileTopAvatar'), currentUserAccount);
            renderUserAvatarElement(document.getElementById('profileAvatarPreview'), currentUserAccount);
            if (window.RankAvatarFrames && typeof window.RankAvatarFrames.updateHeaderAvatar === 'function') {
                window.RankAvatarFrames.updateHeaderAvatar(currentUserAccount);
            }

            state.xp = currentUserAccount.xp || 0;
            state.streak = currentUserAccount.streak || 0;
            state.vocabLearned = currentUserAccount.vocabLearned || 0;
            state.dictationDone = currentUserAccount.dictationDone || 0;

            populateAccountProfileForm();
            updateDashboardMetrics();
            renderMultiAccountLists();
            renderAllVocabGroups();
            renderAllGrammarGroups();
            renderLearnedVocabList();
            renderSavedVocabList();
            if (window.PersonalizedRoadmapEngine) {
                window.PersonalizedRoadmapEngine.renderRoadmapView();
            }

            // Cập nhật Sảnh Study Studio chuẩn Quiet Confidence
            setTxt('sanhMemberProfileName', currentUserAccount.name || 'Học viên');
            setTxt('memberTargetScore', currentUserAccount.targetScore || '600');
            setTxt('memberExamDate', currentUserAccount.examDate ? `Thi: ${currentUserAccount.examDate}` : 'Thi: 20/12/2026');
            setTxt('sanhMemberStreakVal', `${currentUserAccount.streak || 0} ngày`);
            setTxt('sanhMemberStreakTitle', `Streak ${currentUserAccount.streak || 0} ngày`);
            setTxt('sanhMemberXpVal', `+${currentUserAccount.xp || 0} XP`);
            setTxt('sanhMemberDropdownEmail', currentUserAccount.email || '');
            setTxt('mobileDropdownEmail', currentUserAccount.email || '');
            if (window.RankAvatarFrames && typeof window.RankAvatarFrames.updateHeaderAvatar === 'function') {
                window.RankAvatarFrames.updateHeaderAvatar(currentUserAccount);
            } else {
                renderUserAvatarElement(document.getElementById('sanhMemberAvatar'), currentUserAccount);
            }
            if (typeof renderStreakWeekDays === 'function') {
                renderStreakWeekDays({ streak: currentUserAccount.streak || state.streak || 0 });
            }
            if (typeof window.updateDashboardStudioHero === 'function') {
                window.updateDashboardStudioHero();
            }

            if (typeof updateSanhAndSidebarVisibility === 'function') {
                updateSanhAndSidebarVisibility(true);
            }
        }

        function syncCurrentAccountState() {
            if (!currentUserAccount) return;
            currentUserAccount.xp = state.xp;
            currentUserAccount.streak = state.streak;
            currentUserAccount.vocabLearned = state.vocabLearned;
            currentUserAccount.dictationDone = state.dictationDone;
            localStorage.setItem('cung_dang_session_user', JSON.stringify(currentUserAccount));
            renderMultiAccountLists();

            // Persist profile & avatar to backend so page refresh never loses it
            try {
                fetch('/api/user/profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        userId: currentUserAccount.id,
                        name: currentUserAccount.name,
                        avatar: currentUserAccount.avatar,
                        avatarColor: currentUserAccount.avatarColor,
                        rankTier: currentUserAccount.rankTier,
                        targetScore: currentUserAccount.targetScore,
                        examDate: currentUserAccount.examDate
                    })
                }).catch(() => {});
            } catch (e) {}

            if (window.syncAccountToCloud) {
                window.syncAccountToCloud(currentUserAccount);
            }
        }

        // =========================================================================
        // KÊNH ĐỒNG BỘ ĐĂNG NHẬP / ĐĂNG XUẤT ĐA TAB (BROADCAST CHANNEL)
        // =========================================================================
        const authBroadcastChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('cung_dang_auth_channel') : null;
        if (authBroadcastChannel) {
            authBroadcastChannel.onmessage = (evt) => {
                if (evt.data && evt.data.type === 'AUTH_LOGOUT') {
                    handleLogoutUser(false);
                } else if (evt.data && evt.data.type === 'AUTH_LOGIN') {
                    UserAuthEngine.init();
                }
            };
        }

        // =========================================================================
        // HỆ THỐNG XÁC THỰC THÀNH VIÊN & RÀ SOÁT TÀI KHOẢN (USER AUTH ENGINE)
        // =========================================================================
        const UserAuthEngine = {
            isGatekeeperActive: false,

            async init() {
                try {
                    const r = await fetch('/api/me', { credentials: 'include' });
                    if (r.ok) {
                        const res = await r.json();
                        if (res && res.success && res.user) {
                            currentUserAccount = res.user;
                            window.currentUserAccount = res.user;
                            try { localStorage.setItem('cung_dang_session_user', JSON.stringify(res.user)); } catch (e) {}
                            applyCurrentAccountToUI();
                            if (res.streakInfo) {
                                renderStreakWeekDays(res.streakInfo);
                            }
                            if (window.AuthSyncManager) {
                                window.AuthSyncManager.onAccountChange(res.user);
                            } else {
                                this.loadUserProgress();
                                if (window.StudySync) {
                                    window.StudySync.connectStream();
                                }
                            }
                            if (typeof updateSanhAndSidebarVisibility === 'function') {
                                updateSanhAndSidebarVisibility(true);
                            }
                            return;
                        }
                    }
                } catch (e) {
                    console.warn('[UserAuthEngine] Kiểm tra /api/me:', e.message);
                }

                // Nếu chưa có phiên nhưng có tài khoản đã lưu trong localStorage, thử khôi phục
                try {
                    const savedStr = localStorage.getItem('cung_dang_session_user');
                    if (savedStr) {
                        const savedUser = JSON.parse(savedStr);
                        if (savedUser && savedUser.id) {
                            const rRetry = await fetch(`/api/me?userId=${encodeURIComponent(savedUser.id)}`, { credentials: 'include' });
                            if (rRetry.ok) {
                                const resRetry = await rRetry.json();
                                if (resRetry && resRetry.success && resRetry.user) {
                                    currentUserAccount = resRetry.user;
                                    window.currentUserAccount = resRetry.user;
                                    applyCurrentAccountToUI();
                                    if (resRetry.streakInfo) renderStreakWeekDays(resRetry.streakInfo);
                                    if (typeof updateSanhAndSidebarVisibility === 'function') updateSanhAndSidebarVisibility(true);
                                    return;
                                }
                            }
                        }
                    }
                } catch (err) {}

                // Nếu chưa đăng nhập (401 / không có phiên)
                localStorage.removeItem('cung_dang_session_user');
                currentUserAccount = null;
                window.currentUserAccount = null;
                applyGuestStateToUI();
                if (typeof updateSanhAndSidebarVisibility === 'function') {
                    updateSanhAndSidebarVisibility(false);
                }
            },

            showForcedGatekeeper() {
                this.isGatekeeperActive = true;
                const m = document.getElementById('authModal');
                const closeBtn = document.getElementById('authModalCloseBtn');
                const notice = document.getElementById('authGatekeeperNotice');
                if (closeBtn) closeBtn.classList.remove('hidden');
                if (notice) notice.classList.remove('hidden');
                if (m) {
                    m.classList.remove('hidden');
                    m.classList.add('flex');
                }
                switchAuthModalTab('login');
                this.fetchServerUsers();
                if (typeof initGoogleIdentityServices === 'function') {
                    initGoogleIdentityServices();
                }
            },

            dismissGatekeeper() {
                this.isGatekeeperActive = false;
                const m = document.getElementById('authModal');
                const closeBtn = document.getElementById('authModalCloseBtn');
                const notice = document.getElementById('authGatekeeperNotice');
                if (closeBtn) closeBtn.classList.remove('hidden');
                if (notice) notice.classList.add('hidden');
                if (m) {
                    m.classList.add('hidden');
                    m.classList.remove('flex');
                }
            },

            fetchServerUsers() {
                fetch('/api/auth/users-list')
                    .then(r => r.json())
                    .then(res => {
                        if (res && res.users && Array.isArray(res.users)) {
                            accountsDirectory = res.users;
                            renderMultiAccountLists();
                        }
                    })
                    .catch(() => {});
            },

            loadUserProgress() {
                // Client không gửi userId - Server tự trích xuất từ phiên cookie an toàn
                fetch('/api/user/load-progress')
                    .then(r => {
                        if (!r.ok) throw new Error('Chưa đăng nhập hoặc lỗi phiên');
                        return r.json();
                    })
                    .then(res => {
                        if (res && res.success && res.data) {
                            const p = res.data;
                            if (p.state) {
                                state.xp = p.state.xp || 0;
                                state.streak = p.state.streak || 0;
                                state.vocabLearned = p.state.vocabLearned || 0;
                                state.dictationDone = p.state.dictationDone || 0;
                                state.grammarDone = p.state.grammarDone || 0;
                                state.readDone = p.state.readDone || 0;
                                state.listenDone = p.state.listenDone || 0;
                                state.studyMinutes = p.state.studyMinutes || 0;
                                state.totalAnswers = p.state.totalAnswers || 0;
                                state.correctAnswers = p.state.correctAnswers || 0;
                                state.listenTotalAnswers = p.state.listenTotalAnswers || 0;
                                state.listenCorrectAnswers = p.state.listenCorrectAnswers || 0;
                            }
                            if (currentUserAccount) {
                                if (p.targetScore) currentUserAccount.targetScore = p.targetScore;
                                if (p.examDate) currentUserAccount.examDate = p.examDate;
                            }
                            if (p.streakInfo) {
                                renderStreakWeekDays(p.streakInfo);
                            } else {
                                renderStreakWeekDays({ streak: state.streak, weekDays: [] });
                            }
                            // Tách biệt 100% dữ liệu từng người dùng: Gán trực tiếp, không gộp đè với tài khoản trước
                            learnedVocabItems = Array.isArray(p.learnedVocabItems) ? [...p.learnedVocabItems] : [];
                            savedVocabItems = Array.isArray(p.savedVocabItems) ? [...p.savedVocabItems] : [];
                            savedGrammarNotes = Array.isArray(p.savedGrammarNotes) ? [...p.savedGrammarNotes] : [];
                            state.savedWords = Array.isArray(p.savedWords) ? [...p.savedWords] : [];

                            if (Array.isArray(p.takeNotesList) && p.takeNotesList.length > 0) {
                                takeNotesList = [...p.takeNotesList];
                            } else {
                                const userName = currentUserAccount?.name || 'bạn';
                                takeNotesList = [{
                                    id: 'note-' + Date.now(),
                                    title: `📒 Sổ tay của ${userName}`,
                                    category: 'Ngữ pháp',
                                    paper: 'paper-lined',
                                    updatedAt: 'Vừa xong',
                                    updatedAtMs: Date.now(),
                                    content: `<p>Xin chào <strong>${userName}</strong>! Chúc bạn ôn thi đạt kết quả xuất sắc!</p><p>Ghi chú và từ vựng của bạn được lưu trữ riêng biệt và đồng bộ an toàn 100%.</p>`
                                }];
                            }
                            activeNoteId = takeNotesList[0].id;
                            persistTakeNotes();
                            renderTakeNoteSidebarList();
                            loadActiveTakeNoteIntoEditor();

                            const cntEl = document.getElementById('grammarNotebookCount');
                            if (cntEl) cntEl.textContent = savedGrammarNotes.length;

                            updateDashboardMetrics();
                            renderLearnedVocabList();
                            renderSavedVocabList();
                            renderAllVocabGroups();
                            renderAllGrammarGroups();
                            if (window.PersonalizedRoadmapEngine) {
                                window.PersonalizedRoadmapEngine.renderRoadmapView();
                            }
                            if (window.StudySync) {
                                window.StudySync.connectStream();
                            }
                        }
                    })
                    .catch(() => {});
            },

            saveUserProgress() {
                if (!currentUserAccount) return;
                const payload = {
                    data: {
                        state: {
                            xp: state.xp,
                            streak: state.streak,
                            vocabLearned: Math.max(state.vocabLearned, learnedVocabItems.length),
                            dictationDone: state.dictationDone,
                            grammarDone: state.grammarDone || 0,
                            readDone: state.readDone || 0,
                            listenDone: state.listenDone || 0,
                            studyMinutes: state.studyMinutes || 0,
                            totalAnswers: state.totalAnswers || 0,
                            correctAnswers: state.correctAnswers || 0,
                            listenTotalAnswers: state.listenTotalAnswers || 0,
                            listenCorrectAnswers: state.listenCorrectAnswers || 0
                        },
                        learnedVocabItems: learnedVocabItems,
                        savedVocabItems: savedVocabItems,
                        takeNotesList: takeNotesList,
                        savedGrammarNotes: savedGrammarNotes,
                        savedWords: state.savedWords || []
                    }
                };

                fetch('/api/user/save-progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                .then(r => r.json())
                .then(res => {
                    if (res && res.data && res.data.streakInfo) {
                        renderStreakWeekDays(res.data.streakInfo);
                    }
                })
                .catch(() => {});
            }
        };

        window.UserAuthEngine = UserAuthEngine;
        window.saveCurrentUserProgressToServer = () => UserAuthEngine.saveUserProgress();

        function checkRegisterPasswordMatching() {
            const p1 = document.getElementById('regPasswordInput')?.value || '';
            const p2 = document.getElementById('regConfirmPasswordInput')?.value || '';
            const notice = document.getElementById('regPasswordMatchNotice');
            if (!notice) return;

            if (!p2) {
                notice.textContent = '';
                return;
            }
            if (p1 === p2) {
                notice.innerHTML = '<span class="text-emerald-600 font-extrabold">✓ Mật khẩu khớp hoàn hảo!</span>';
            } else {
                notice.innerHTML = '<span class="text-rose-500 font-bold">✗ Mật khẩu xác nhận chưa khớp với mật khẩu trên</span>';
            }
        }

        function openAuthModal(defaultTab = 'login') {
            const menu = document.getElementById('profileDropdownMenu');
            if (menu) menu.classList.add('hidden');
            switchAuthModalTab(defaultTab);
            UserAuthEngine.fetchServerUsers();
            renderMultiAccountLists();
            initGoogleIdentityServices();
            const m = document.getElementById('authModal');
            if (m) {
                m.classList.remove('hidden');
                m.classList.add('flex');
            }
        }

        function toggleLoginPasswordEye() {
            const input = document.getElementById('loginPasswordInput');
            const icon = document.getElementById('loginPassEyeIcon');
            if (!input || !icon) return;
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        }

        function closeAuthModal() {
            UserAuthEngine.isGatekeeperActive = false;
            const m = document.getElementById('authModal');
            if (m) {
                m.classList.add('hidden');
                m.classList.remove('flex');
            }
        }

        function switchAuthModalTab(tab) {
            const panels = {
                'login': document.getElementById('authPanelLogin'),
                'register': document.getElementById('authPanelRegister'),
                'switch': document.getElementById('authPanelSwitch'),
                'forgot': document.getElementById('authPanelForgot')
            };

            Object.keys(panels).forEach(key => {
                if (panels[key]) {
                    panels[key].classList.toggle('hidden', key !== tab);
                }
            });

            // Cập nhật giao diện thanh chuyển tab hình viên thuốc chuẩn Ảnh 4
            const btnLogin = document.getElementById('authTabBtnLogin');
            const btnRegister = document.getElementById('authTabBtnRegister');
            if (btnLogin && btnRegister) {
                if (tab === 'login') {
                    btnLogin.className = 'w-1/2 py-2 rounded-full font-extrabold text-sm bg-white dark:bg-slate-900 text-blue-600 shadow-sm transition';
                    btnRegister.className = 'w-1/2 py-2 rounded-full font-bold text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white transition';
                } else if (tab === 'register') {
                    btnRegister.className = 'w-1/2 py-2 rounded-full font-extrabold text-sm bg-white dark:bg-slate-900 text-blue-600 shadow-sm transition';
                    btnLogin.className = 'w-1/2 py-2 rounded-full font-bold text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white transition';
                } else {
                    btnLogin.className = 'w-1/2 py-2 rounded-full font-bold text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white transition';
                    btnRegister.className = 'w-1/2 py-2 rounded-full font-bold text-sm text-slate-500 hover:text-slate-800 dark:hover:text-white transition';
                }
            }

            const modalTitle = document.getElementById('authModalTitle');
            const modalSubtitle = document.getElementById('authModalSubtitle');
            const modalIcon = document.getElementById('authModalIcon');

            if (tab === 'login') {
                if (modalTitle) modalTitle.textContent = 'Đăng nhập tài khoản';
                if (modalSubtitle) modalSubtitle.textContent = 'Nhập thông tin để vào học và đồng bộ tiến độ đa thiết bị';
                if (modalIcon) modalIcon.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i>';
                renderGoogleOfficialButtons();
            } else if (tab === 'register') {
                if (modalTitle) modalTitle.textContent = 'Đăng ký tài khoản mới';
                if (modalSubtitle) modalSubtitle.textContent = 'Khởi tạo tài khoản riêng để lưu từ vựng, điểm số và sổ tay';
                if (modalIcon) modalIcon.innerHTML = '<i class="fa-solid fa-user-plus"></i>';
                renderGoogleOfficialButtons();
            } else if (tab === 'switch') {
                if (modalTitle) modalTitle.textContent = 'Quản lý & Đổi tài khoản';
                if (modalSubtitle) modalSubtitle.textContent = 'Chạm vào tài khoản bất kỳ bên dưới để chuyển nhanh';
                if (modalIcon) modalIcon.innerHTML = '<i class="fa-solid fa-users"></i>';
            } else if (tab === 'forgot') {
                if (modalTitle) modalTitle.textContent = 'Khôi phục mật khẩu';
                if (modalSubtitle) modalSubtitle.textContent = 'Nhập email và mật khẩu mới để thiết lập lại tài khoản';
                if (modalIcon) modalIcon.innerHTML = '<i class="fa-solid fa-key"></i>';
            }

            // Ẩn các thông báo lỗi cũ khi chuyển tab
            const errLogin = document.getElementById('loginErrorAlert');
            const errReg = document.getElementById('regErrorAlert');
            const errForgot = document.getElementById('forgotErrorAlert');
            const succForgot = document.getElementById('forgotSuccessAlert');
            if (errLogin) errLogin.classList.add('hidden');
            if (errReg) errReg.classList.add('hidden');
            if (errForgot) errForgot.classList.add('hidden');
            if (succForgot) succForgot.classList.add('hidden');
        }

        function handleLoginSubmit() {
            const loginId = (document.getElementById('loginEmailInput')?.value || '').trim();
            const password = document.getElementById('loginPasswordInput')?.value || '';
            const errAlert = document.getElementById('loginErrorAlert');
            const errMsg = document.getElementById('loginErrorMsg');
            const successAlert = document.getElementById('loginSuccessAlert');
            const submitBtn = document.getElementById('loginSubmitBtn');

            if (errAlert) errAlert.classList.add('hidden');
            if (successAlert) successAlert.classList.add('hidden');

            if (!loginId) {
                if (errAlert && errMsg) {
                    errMsg.textContent = 'Vui lòng nhập Email hoặc Tên đăng nhập!';
                    errAlert.classList.remove('hidden');
                }
                return;
            }

            if (submitBtn) submitBtn.textContent = 'Đang xác thực...';

            fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ loginId, password })
            })
            .then(r => r.json())
            .then(res => {
                if (submitBtn) submitBtn.textContent = 'Đăng nhập vào học ngay →';
                if (!res.success) {
                    if (errAlert && errMsg) {
                        errMsg.textContent = res.error || 'Đăng nhập thất bại!';
                        errAlert.classList.remove('hidden');
                    }
                    showToast(res.error || 'Đăng nhập thất bại!');
                    return;
                }

                // Đăng nhập thành công!
                currentUserAccount = res.user;
                window.currentUserAccount = res.user;
                localStorage.setItem('cung_dang_session_user', JSON.stringify(res.user));
                if (authBroadcastChannel) {
                    authBroadcastChannel.postMessage({ type: 'AUTH_LOGIN' });
                }
                UserAuthEngine.dismissGatekeeper();
                applyCurrentAccountToUI();
                if (window.AuthSyncManager) {
                    window.AuthSyncManager.onAccountChange(res.user);
                } else {
                    UserAuthEngine.loadUserProgress();
                    if (window.StudySync) window.StudySync.connectStream();
                }
                if (typeof updateSanhAndSidebarVisibility === 'function') updateSanhAndSidebarVisibility(true);
                closeAuthModal();
                showToast(`👋 Chào mừng ${currentUserAccount.name} đã đăng nhập!`);
            })
            .catch(err => {
                if (submitBtn) submitBtn.textContent = 'Đăng nhập vào học ngay →';
                if (errAlert && errMsg) {
                    errMsg.textContent = 'Lỗi kết nối máy chủ: ' + err.message;
                    errAlert.classList.remove('hidden');
                }
            });
        }

        function handleRegisterSubmit() {
            const name = (document.getElementById('regNameInput')?.value || '').trim();
            const username = (document.getElementById('regUsernameInput')?.value || '').trim();
            const email = (document.getElementById('regEmailInput')?.value || '').trim();
            const password = document.getElementById('regPasswordInput')?.value || '';
            const confirmPassword = document.getElementById('regConfirmPasswordInput')?.value || '';
            const exam = document.getElementById('regExamInput')?.value || 'TOEIC';
            const target = document.getElementById('regTargetInput')?.value || '650';

            const errAlert = document.getElementById('regErrorAlert');
            const errMsg = document.getElementById('regErrorMsg');
            const submitBtn = document.getElementById('regSubmitBtn');

            if (errAlert) errAlert.classList.add('hidden');

            if (!name) {
                if (errAlert && errMsg) {
                    errMsg.textContent = 'Vui lòng nhập đầy đủ Họ và tên!';
                    errAlert.classList.remove('hidden');
                }
                return;
            }
            if (!username && !email) {
                if (errAlert && errMsg) {
                    errMsg.textContent = 'Vui lòng nhập Tên đăng nhập hoặc Email!';
                    errAlert.classList.remove('hidden');
                }
                return;
            }
            if (password.length < 6) {
                if (errAlert && errMsg) {
                    errMsg.textContent = 'Mật khẩu phải chứa ít nhất 6 ký tự!';
                    errAlert.classList.remove('hidden');
                }
                return;
            }
            if (password !== confirmPassword) {
                if (errAlert && errMsg) {
                    errMsg.textContent = 'Mật khẩu xác nhận không khớp! Vui lòng kiểm tra lại.';
                    errAlert.classList.remove('hidden');
                }
                return;
            }

            if (submitBtn) submitBtn.innerHTML = '<span>Đang khởi tạo tài khoản...</span>';

            fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    username,
                    email,
                    password,
                    confirmPassword,
                    exam,
                    targetScore: target
                })
            })
            .then(r => r.json())
            .then(res => {
                if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i><span>Tạo tài khoản & Đăng ký</span>';
                if (!res.success) {
                    if (errAlert && errMsg) {
                        errMsg.textContent = res.error || 'Đăng ký không thành công!';
                        errAlert.classList.remove('hidden');
                    }
                    showToast(res.error || 'Đăng ký không thành công!');
                    return;
                }

                // Đăng ký thành công! Chuyển về màn hình đăng nhập lại theo đúng yêu cầu
                switchAuthModalTab('login');
                const loginIn = document.getElementById('loginEmailInput');
                if (loginIn) loginIn.value = username || email;
                const passIn = document.getElementById('loginPasswordInput');
                if (passIn) {
                    passIn.value = '';
                    passIn.focus();
                }

                // Hiển thị thông báo thành công xanh rõ ràng
                const succAlert = document.getElementById('loginSuccessAlert');
                const succMsg = document.getElementById('loginSuccessMsg');
                if (succAlert && succMsg) {
                    succMsg.textContent = `🎉 Đăng ký thành công tài khoản "${res.user?.name || name}"! Vui lòng nhập mật khẩu để đăng nhập.`;
                    succAlert.classList.remove('hidden');
                }
                showToast(`🎉 Đăng ký tài khoản thành công! Vui lòng đăng nhập để bắt đầu học.`);
            })
            .catch(err => {
                if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i><span>Tạo tài khoản & Đăng ký</span>';
                if (errAlert && errMsg) {
                    errMsg.textContent = 'Lỗi kết nối máy chủ: ' + err.message;
                    errAlert.classList.remove('hidden');
                }
            });
        }

        // =========================================================================
        // ĐĂNG NHẬP GOOGLE IDENTITY SERVICES (GIS THẬT CHUẨN GOOGLE OAUTH)
        // =========================================================================
        let gsiClientInited = false;
        async function initGoogleIdentityServices() {
            try {
                let clientId = window.googleAuthClientId || '';
                if (!clientId) {
                    try {
                        const cfgRes = await fetch('/api/auth/config');
                        const cfg = await cfgRes.json();
                        clientId = (cfg.googleClientId || '').trim();
                        window.googleAuthClientId = clientId;
                    } catch (e) {}
                }

                const loginSec = document.getElementById('googleSignInSectionLogin');
                const regSec = document.getElementById('googleSignInSectionRegister');

                if (!clientId) {
                    // Yêu cầu c: Khi thiếu GOOGLE_CLIENT_ID: ẨN nút Google, chỉ hiện form email/mật khẩu. KHÔNG có bảng giả hay fallback đăng nhập nào.
                    if (loginSec) loginSec.classList.add('hidden');
                    if (regSec) regSec.classList.add('hidden');
                    return;
                }

                // Khi có GOOGLE_CLIENT_ID: Hiện khu vực Google ngay lập tức trên cả 2 tab
                if (loginSec) loginSec.classList.remove('hidden');
                if (regSec) regSec.classList.remove('hidden');

                if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
                    // Chờ thư viện GIS nạp xong và retry
                    if (!window._gisInitPoll) {
                        let attempts = 0;
                        window._gisInitPoll = setInterval(() => {
                            attempts++;
                            if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
                                clearInterval(window._gisInitPoll);
                                window._gisInitPoll = null;
                                initGoogleIdentityServices();
                            } else if (attempts >= 50) {
                                clearInterval(window._gisInitPoll);
                                window._gisInitPoll = null;
                            }
                        }, 100);
                    }
                    return;
                }

                if (!gsiClientInited) {
                    google.accounts.id.initialize({
                        client_id: clientId,
                        callback: handleGoogleCredentialResponse,
                        auto_select: false,
                        cancel_on_tap_outside: true
                    });
                    gsiClientInited = true;
                }
                renderGoogleOfficialButtons();
            } catch (err) {
                console.warn('[Google Auth] Lỗi khởi tạo GIS:', err);
            }
        }

        function renderGoogleOfficialButtons() {
            if (typeof google === 'undefined' || !google.accounts || !google.accounts.id || !window.googleAuthClientId) return;
            try {
                const loginContainer = document.getElementById('googleOfficialBtnContainerLogin');
                const customLoginBtn = document.getElementById('customGoogleSignInBtnLogin');
                if (loginContainer) {
                    loginContainer.innerHTML = '';
                    google.accounts.id.renderButton(loginContainer, {
                        type: 'standard',
                        shape: 'pill',
                        theme: 'outline',
                        text: 'continue_with',
                        size: 'large',
                        logo_alignment: 'left',
                        width: 320
                    });
                    loginContainer.classList.remove('hidden');
                    if (customLoginBtn) customLoginBtn.classList.add('hidden');
                }

                const regContainer = document.getElementById('googleOfficialBtnContainerRegister');
                const customRegBtn = document.getElementById('customGoogleSignInBtnRegister');
                if (regContainer) {
                    regContainer.innerHTML = '';
                    google.accounts.id.renderButton(regContainer, {
                        type: 'standard',
                        shape: 'pill',
                        theme: 'outline',
                        text: 'continue_with',
                        size: 'large',
                        logo_alignment: 'left',
                        width: 320
                    });
                    regContainer.classList.remove('hidden');
                    if (customRegBtn) customRegBtn.classList.add('hidden');
                }
            } catch (e) {
                console.warn('[Google Auth] Lỗi render nút Google:', e);
            }
        }
        window.renderGoogleOfficialButtons = renderGoogleOfficialButtons;

        async function handleGoogleCredentialResponse(response) {
            if (!response || !response.credential) {
                showToast('⚠️ Không nhận được mã xác thực từ Google!');
                return;
            }
            try {
                const res = await fetch('/api/auth/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ credential: response.credential })
                });
                const data = await res.json();
                if (data && data.success && data.user) {
                    currentUserAccount = data.user;
                    window.currentUserAccount = data.user;
                    try { localStorage.setItem('cung_dang_session_user', JSON.stringify(data.user)); } catch (e) {}
                    if (authBroadcastChannel) {
                        authBroadcastChannel.postMessage({ type: 'AUTH_LOGIN' });
                    }
                    UserAuthEngine.dismissGatekeeper();
                    applyCurrentAccountToUI();
                    if (window.AuthSyncManager) {
                        window.AuthSyncManager.onAccountChange(data.user);
                    } else {
                        UserAuthEngine.loadUserProgress();
                        if (window.StudySync) window.StudySync.connectStream();
                    }
                    if (typeof updateSanhAndSidebarVisibility === 'function') updateSanhAndSidebarVisibility(true);
                    closeAuthModal();
                    showToast(`🎉 Đăng nhập Google thành công! Xin chào ${data.user.name}.`);
                } else {
                    showToast('⚠️ Đăng nhập Google thất bại: ' + (data.error || 'Lỗi không xác định'));
                }
            } catch (err) {
                showToast('⚠️ Lỗi kết nối máy chủ Google Auth: ' + err.message);
            }
        }
        window.handleGoogleCredentialResponse = handleGoogleCredentialResponse;

        async function handleGoogleSignIn() {
            let clientId = window.googleAuthClientId || '';
            if (!clientId) {
                try {
                    const cfgRes = await fetch('/api/auth/config');
                    const cfg = await cfgRes.json();
                    clientId = (cfg.googleClientId || '').trim();
                    window.googleAuthClientId = clientId;
                } catch (e) {}
            }

            if (!clientId) {
                showToast('⚠️ Hệ thống chưa nhận được GOOGLE_CLIENT_ID từ biến môi trường. Vui lòng kiểm tra file .env hoặc cấu hình trên Render!');
                return;
            }

            if (typeof google === 'undefined' || !google.accounts || !google.accounts.id) {
                showToast('⚠️ Không thể tải thư viện Google Identity Services. Vui lòng kiểm tra kết nối mạng hoặc chặn quảng cáo!');
                return;
            }

            try {
                await initGoogleIdentityServices();
                google.accounts.id.prompt((notification) => {
                    if (notification.isNotDisplayed()) {
                        const reason = notification.getNotDisplayedReason();
                        console.warn('[Google Auth] One Tap không hiển thị:', reason);
                        renderGoogleOfficialButtons();
                        if (reason === 'unregistered_origin') {
                            showToast('⚠️ Origin trình duyệt hiện tại chưa được khai báo trong Google Cloud Console!');
                        }
                    } else if (notification.isDismissedMoment()) {
                        if (notification.getDismissedReason() !== 'credential_returned') {
                            renderGoogleOfficialButtons();
                        }
                    }
                });
            } catch (err) {
                console.warn('[Google Auth] Lỗi khởi chạy Google prompt:', err);
                renderGoogleOfficialButtons();
            }
        }
        window.handleGoogleSignIn = handleGoogleSignIn;

        function switchUserAccountById(accId) {
            const target = accountsDirectory.find(a => a.id === accId);
            if (!target) return;
            UserAuthEngine.saveUserProgress();
            currentUserAccount = target;
            localStorage.setItem('cung_dang_session_user', JSON.stringify(target));
            applyCurrentAccountToUI();
            if (window.AuthSyncManager) {
                window.AuthSyncManager.onAccountChange(target);
            } else {
                UserAuthEngine.loadUserProgress();
            }
            closeAuthModal();
            showToast(`🔄 Đã chuyển sang tài khoản: ${currentUserAccount.name}`);
        }

        async function handleLogoutUser(broadcast = true) {
            closeAllProfileDropdowns();
            
            // 1. Sao lưu tiến độ hiện tại lên server trước khi thoát (Bảo toàn dữ liệu)
            try { UserAuthEngine.saveUserProgress(); } catch (e) {}
            
            // 2. Gửi lệnh hủy phiên đăng nhập an toàn lên server
            try {
                await fetch('/api/auth/logout', { method: 'POST' });
            } catch (e) {}

            // 3. Tắt tự động đăng nhập Google One Tap
            if (typeof google !== 'undefined' && google.accounts && google.accounts.id) {
                try { google.accounts.id.disableAutoSelect(); } catch (e) {}
            }

            // 4. Đóng luồng kết nối Realtime SSE
            if (window.StudySync && typeof window.StudySync.disconnect === 'function') {
                window.StudySync.disconnect();
            }

            // 5. Đồng bộ đăng xuất giữa các tab trình duyệt
            if (broadcast && authBroadcastChannel) {
                authBroadcastChannel.postMessage({ type: 'AUTH_LOGOUT' });
            }

            // 6. Xóa session lưu trữ client & reset namespace qua AuthSyncManager
            if (window.AuthSyncManager) {
                window.AuthSyncManager.onLogout();
            }
            localStorage.removeItem('cung_dang_session_user');
            currentUserAccount = null;
            window.currentUserAccount = null;
            
            // 7. Khôi phục giao diện khách sạch sẽ
            applyGuestStateToUI();
            switchTab('hom-nay');
            if (typeof updateSanhAndSidebarVisibility === 'function') {
                updateSanhAndSidebarVisibility(false);
            }

            showToast('🔒 Đã đăng xuất an toàn! Đã quay về Sảnh chính.');
        }

        function renderMultiAccountLists() {
            const switchEl = document.getElementById('savedAccountsListContainer');
            const commEl = document.getElementById('communityMembersListContainer');
            const badgeEl = document.getElementById('communityTotalBadge');
            const onlineLabel = document.getElementById('onlineUsersCountLabel');

            if (badgeEl) badgeEl.textContent = `${accountsDirectory.length} học viên`;
            if (onlineLabel) onlineLabel.textContent = `${accountsDirectory.length} người đang học`;

            if (switchEl) {
                switchEl.innerHTML = accountsDirectory.map(acc => {
                    const isCurrent = acc.id === currentUserAccount?.id;
                    const init = acc.name.trim().charAt(0).toUpperCase();
                    return `
                        <div onclick="switchUserAccountById('${acc.id}')" class="cursor-pointer p-3.5 rounded-2xl border transition flex items-center justify-between ${isCurrent ? 'bg-blue-50/90 border-blue-400 dark:bg-slate-800' : 'bg-white dark:bg-slate-800/60 border-slate-200 hover:border-blue-300'}">
                            <div class="flex items-center gap-3">
                                <div class="w-10 h-10 rounded-full ${acc.avatarColor || 'bg-purple-700'} text-white font-extrabold text-sm flex items-center justify-center">${init}</div>
                                <div>
                                    <div class="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span>${acc.name}</span>
                                        ${isCurrent ? '<span class="px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs">Đang dùng</span>' : ''}
                                    </div>
                                    <div class="text-xs text-slate-500">${acc.email} · Mục tiêu ${acc.targetScore} ${acc.exam}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-xs font-extrabold text-rose-600">+${acc.xp || 0} XP</div>
                                <div class="text-xs text-orange-600 font-bold">🔥 ${acc.streak || 0} ngày</div>
                            </div>
                        </div>
                    `;
                }).join('');
            }

            if (commEl) {
                commEl.innerHTML = accountsDirectory.map(acc => {
                    const init = acc.name.trim().charAt(0).toUpperCase();
                    return `
                        <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="relative">
                                    <div class="w-10 h-10 rounded-full ${acc.avatarColor || 'bg-indigo-600'} text-white font-extrabold text-sm flex items-center justify-center">${init}</div>
                                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0"></span>
                                </div>
                                <div>
                                    <div class="text-xs font-extrabold text-slate-900 dark:text-white">${acc.name}</div>
                                    <div class="text-xs text-slate-500">${acc.email} · Đang luyện ${acc.exam} (${acc.targetScore} điểm)</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-extrabold">✨ ${acc.xp || 0} XP</span>
                                <button onclick="switchUserAccountById('${acc.id}')" class="px-3 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-600 text-xs font-bold">Vào TK này</button>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        }

        function openProfileModal() {
            openAccountProfileView();
        }

        function openFeedbackModal() {
            showToast('💬 Cảm ơn bạn! Hộp thư góp ý cho TART đã ghi nhận phản hồi.');
        }

        async function handleResetPasswordSubmit() {
            const email = (document.getElementById('forgotEmailInput')?.value || '').trim();
            const newPassword = document.getElementById('forgotNewPasswordInput')?.value || '';
            const errAlert = document.getElementById('forgotErrorAlert');
            const errMsg = document.getElementById('forgotErrorMsg');
            const successAlert = document.getElementById('forgotSuccessAlert');
            const successMsg = document.getElementById('forgotSuccessMsg');
            const submitBtn = document.getElementById('forgotSubmitBtn');

            if (errAlert) errAlert.classList.add('hidden');
            if (successAlert) successAlert.classList.add('hidden');

            if (!email) {
                if (errAlert && errMsg) {
                    errMsg.textContent = 'Vui lòng nhập địa chỉ email!';
                    errAlert.classList.remove('hidden');
                }
                return;
            }
            if (!newPassword || newPassword.length < 6) {
                if (errAlert && errMsg) {
                    errMsg.textContent = 'Mật khẩu mới phải có ít nhất 6 ký tự!';
                    errAlert.classList.remove('hidden');
                }
                return;
            }

            if (submitBtn) submitBtn.textContent = 'Đang xử lý...';

            try {
                const res = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, newPassword })
                });
                const data = await res.json();
                if (submitBtn) submitBtn.textContent = 'Cập nhật mật khẩu mới';
                if (!data.success) {
                    if (errAlert && errMsg) {
                        errMsg.textContent = data.error || 'Không thể đặt lại mật khẩu!';
                        errAlert.classList.remove('hidden');
                    }
                    return;
                }

                if (successAlert && successMsg) {
                    successMsg.textContent = data.message || 'Đặt lại mật khẩu thành công! Vui lòng đăng nhập.';
                    successAlert.classList.remove('hidden');
                }
                showToast('🎉 Đổi mật khẩu thành công! Vui lòng đăng nhập lại.');
                setTimeout(() => {
                    switchAuthModalTab('login');
                    const loginIn = document.getElementById('loginEmailInput');
                    if (loginIn) loginIn.value = email;
                    const passIn = document.getElementById('loginPasswordInput');
                    if (passIn) {
                        passIn.value = '';
                        passIn.focus();
                    }
                }, 1200);
            } catch (err) {
                if (submitBtn) submitBtn.textContent = 'Cập nhật mật khẩu mới';
                if (errAlert && errMsg) {
                    errMsg.textContent = 'Lỗi kết nối máy chủ: ' + err.message;
                    errAlert.classList.remove('hidden');
                }
            }
        }
        window.handleResetPasswordSubmit = handleResetPasswordSubmit;

        async function handleUserResetProgress() {
            if (!confirm('Bạn có chắc chắn muốn đặt lại toàn bộ tiến độ học tập về 0? Hành động này sẽ xóa điểm số, lịch sử làm đề và số phút đã học.')) {
                return;
            }
            try {
                const res = await fetch('/api/user/reset-progress', { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                    try {
                        localStorage.removeItem('toeic_exam_history');
                        localStorage.removeItem('user_study_stats');
                        localStorage.removeItem('toeic_diagnostic_v1');
                        localStorage.removeItem('ets_adaptive_diagnostic_result');
                        localStorage.removeItem('toeic_learning_progress');
                    } catch (e) {}
                    showToast('✅ Đã đặt lại toàn bộ tiến độ học tập!');
                    setTimeout(() => { window.location.reload(); }, 800);
                } else {
                    showToast('⚠️ Không thể đặt lại tiến độ: ' + (data.error || 'Lỗi không xác định'));
                }
            } catch (err) {
                showToast('⚠️ Lỗi kết nối: ' + err.message);
            }
        }
        window.handleUserResetProgress = handleUserResetProgress;

        async function handleUserDeleteAccount() {
            if (!confirm('CẢNH BÁO NGUY HIỂM: Bạn có chắc chắn muốn XÓA VĨNH VIỄN tài khoản và toàn bộ dữ liệu cá nhân không? Hành động này KHÔNG THỂ khôi phục!')) {
                return;
            }
            const secondConfirm = prompt('Nhập chữ "XOA" để xác nhận xóa tài khoản:');
            if (secondConfirm !== 'XOA') {
                showToast('Đã hủy thao tác xóa tài khoản.');
                return;
            }
            try {
                const res = await fetch('/api/auth/delete-account', { method: 'POST' });
                const data = await res.json();
                if (data.success) {
                    showToast('✅ Tài khoản đã được xóa hoàn toàn.');
                    handleLogoutUser(false);
                    try {
                        localStorage.clear();
                    } catch (e) {}
                    setTimeout(() => { window.location.reload(); }, 1000);
                } else {
                    showToast('⚠️ Không thể xóa tài khoản: ' + (data.error || 'Lỗi không xác định'));
                }
            } catch (err) {
                showToast('⚠️ Lỗi kết nối: ' + err.message);
            }
        }
        window.handleUserDeleteAccount = handleUserDeleteAccount;

        function openPrivacyPolicyModal() {
            const modal = document.getElementById('privacyPolicyModal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        }
        function closePrivacyPolicyModal() {
            const modal = document.getElementById('privacyPolicyModal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        }
        function openTermsOfServiceModal() {
            const modal = document.getElementById('termsOfServiceModal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.classList.add('flex');
            }
        }
        function closeTermsOfServiceModal() {
            const modal = document.getElementById('termsOfServiceModal');
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
            }
        }
        window.openPrivacyPolicyModal = openPrivacyPolicyModal;
        window.closePrivacyPolicyModal = closePrivacyPolicyModal;
        window.openTermsOfServiceModal = openTermsOfServiceModal;
        window.closeTermsOfServiceModal = closeTermsOfServiceModal;

        // =========================================================================
        // MỞ WEB TRÊN ĐIỆN THOẠI (MOBILE CONNECT VIA LAN IP & QR CODE)
        // =========================================================================
        function openMobileConnectModal() {
            const modal = document.getElementById('mobileConnectModal');
            if (!modal) return;
            // Tự động truy vấn IP mạng LAN mới nhất từ server
            fetch('/api/network-info')
                .then(r => r.json())
                .then(data => {
                    if (data && data.mobileUrl) {
                        const input = document.getElementById('mobileLanUrlInput');
                        if (input) input.value = data.mobileUrl;
                        const qrImg = document.getElementById('mobileQrCodeImg');
                        if (qrImg) qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(data.mobileUrl)}`;
                        const condEl = document.getElementById('mobileConnectConditionText');
                        if (condEl) {
                            if (data.isCloud) {
                                condEl.innerHTML = '<i class="fa-solid fa-shield-halved text-emerald-500 mr-1"></i> Truy cập trực tiếp qua kết nối HTTPS bảo mật (hoạt động trên cả 4G/5G và Wi-Fi).';
                            } else {
                                condEl.innerHTML = '⚡ Điều kiện: Điện thoại và Máy tính cùng kết nối vào một mạng Wi-Fi.';
                            }
                        }
                    }
                })
                .catch(() => {});
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeMobileConnectModal() {
            const modal = document.getElementById('mobileConnectModal');
            if (!modal) return;
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        function copyMobileLanUrl() {
            const input = document.getElementById('mobileLanUrlInput');
            if (!input) return;
            input.select();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(input.value).then(() => {
                    showToast('✅ Đã sao chép link điện thoại: ' + input.value);
                }).catch(() => {
                    showToast('📱 Link điện thoại: ' + input.value);
                });
            } else {
                document.execCommand('copy');
                showToast('✅ Đã sao chép: ' + input.value);
            }
        }

        function openSyncDetailsModal() {
            const modal = document.getElementById('syncDetailsModal');
            if (!modal) return;
            if (window.StudySync) window.StudySync.updateUIStatus();
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

        function closeSyncDetailsModal() {
            const modal = document.getElementById('syncDetailsModal');
            if (!modal) return;
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }

        // Search Filters
        function filterGrammarCards() {
            const q = document.getElementById('grammarSearchInput').value.toLowerCase();
            const cards = document.querySelectorAll('#grammarCardsGrid > div');
            cards.forEach(c => {
                const title = (c.getAttribute('data-title') || '').toLowerCase();
                c.style.display = title.includes(q) ? '' : 'none';
            });
        }

        function filterVocabDecks() {
            const q = document.getElementById('vocabSearchInput').value.toLowerCase();
            const cards = document.querySelectorAll('#vocabDecksGrid > div');
            cards.forEach(c => {
                const title = (c.getAttribute('data-deck') || '').toLowerCase();
                c.style.display = title.includes(q) ? '' : 'none';
            });
        }

        function filterMockSource(src, btnEl) {
            document.querySelectorAll('.mock-src-btn').forEach(b => {
                b.className = 'mock-src-btn px-3.5 py-1.5 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-white/60';
            });
            btnEl.className = 'mock-src-btn px-3.5 py-1.5 rounded-xl bg-white text-amber-900 shadow-sm';
            showToast(`Đang hiển thị bộ đề thi thử: ${src}`);
        }

        // =========================================================================
        // 10. TỪ ĐIỂN ANH - VIỆT & HỌ TỪ TOÀN DIỆN (DICTIONARY & WORD FAMILY ENGINE)
        // =========================================================================
        let currentDictLookupWord = 'economic';
        let dictAutocompleteTimer = null;

        if (typeof window.escapeHtml !== 'function') {
            window.escapeHtml = function(str) {
                if (str === null || str === undefined) return '';
                return String(str)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            };
        }

        function initDictionaryView() {
            renderDictHistoryChips();
            if (window.DictionaryEngine) {
                DictionaryEngine.init();
            }
            const container = document.getElementById('dictResultContainer');
            if (container && (!container.children.length || container.innerHTML.trim() === '')) {
                renderDictionaryResult(currentDictLookupWord || 'economic');
            }
        }

        function renderDictHistoryChips() {
            const container = document.getElementById('dictHistoryChips');
            const clearBtn = document.getElementById('dictClearHistoryBtn');
            if (!container) return;

            const history = window.DictHistoryManager ? DictHistoryManager.getHistory() : [];
            if (!history || history.length === 0) {
                // Hiển thị các từ gợi ý mẫu khi lịch sử trống
                const defaultSample = ['economic', 'require', 'contract', 'produce', 'compete', 'apply', 'negotiate', 'manage', 'succeed', 'hello'];
                container.innerHTML = defaultSample.map(w => `
                    <button onclick="quickLookupDictWord('${escapeHtml(w)}')" class="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold border border-sky-200 transition">
                        ${escapeHtml(w)}
                    </button>
                `).join('');
                if (clearBtn) clearBtn.classList.add('hidden');
                return;
            }

            container.innerHTML = history.map(w => `
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold border border-sky-200 text-xs transition">
                    <button onclick="quickLookupDictWord('${escapeHtml(w)}')" class="hover:underline">
                        ${escapeHtml(w)}
                    </button>
                    <button onclick="event.stopPropagation(); removeDictHistoryWord('${escapeHtml(w)}')" class="text-slate-400 hover:text-rose-600 transition" title="Xóa từ này khỏi lịch sử">
                        <i class="fa-solid fa-xmark text-xs"></i>
                    </button>
                </span>
            `).join('');

            if (clearBtn) clearBtn.classList.remove('hidden');
        }

        window.removeDictHistoryWord = removeDictHistoryWord;
        function removeDictHistoryWord(w) {
            if (window.DictHistoryManager) {
                DictHistoryManager.remove(w);
                renderDictHistoryChips();
            }
        }

        function clearDictHistory() {
            if (window.DictHistoryManager) {
                DictHistoryManager.clear();
                renderDictHistoryChips();
                showToast('🗑️ Đã làm sạch toàn bộ lịch sử tra từ!');
            }
        }

        function handleDictSearchInput(val) {
            clearTimeout(dictAutocompleteTimer);
            const dropdown = document.getElementById('dictAutocompleteDropdown');
            if (!dropdown) return;

            const text = (val || '').trim();
            if (text.length < 2) {
                dropdown.innerHTML = '';
                dropdown.classList.add('hidden');
                return;
            }

            dictAutocompleteTimer = setTimeout(() => {
                if (!window.DictionaryEngine) return;
                const matches = DictionaryEngine.getAutocompleteSuggestions(text);
                if (!matches || matches.length === 0) {
                    dropdown.innerHTML = '';
                    dropdown.classList.add('hidden');
                    return;
                }

                dropdown.innerHTML = matches.map(m => `
                    <div onclick="quickLookupDictWord('${escapeHtml(m.word)}')" class="px-4 py-2.5 hover:bg-sky-50 dark:hover:bg-slate-700 cursor-pointer flex items-center justify-between transition">
                        <div class="flex items-center gap-2">
                            <span class="font-extrabold text-slate-800 dark:text-white text-xs">${escapeHtml(m.word)}</span>
                            <span class="px-1.5 py-0.5 rounded text-xs font-bold bg-sky-100 text-sky-800">${escapeHtml(m.partOfSpeech)}</span>
                        </div>
                        <span class="text-xs text-slate-500 italic max-w-[200px] truncate">${escapeHtml(m.vi)}</span>
                    </div>
                `).join('');
                dropdown.classList.remove('hidden');
            }, 250);
        }

        function handleDictSearchKeyDown(event) {
            if (event.key === 'Enter') {
                const dropdown = document.getElementById('dictAutocompleteDropdown');
                if (dropdown) dropdown.classList.add('hidden');
                executeDictSearch();
            } else if (event.key === 'Escape') {
                const dropdown = document.getElementById('dictAutocompleteDropdown');
                if (dropdown) dropdown.classList.add('hidden');
            }
        }

        // Ẩn dropdown khi click ra ngoài
        document.addEventListener('click', function(e) {
            const input = document.getElementById('dictSearchInput');
            const dropdown = document.getElementById('dictAutocompleteDropdown');
            if (dropdown && !dropdown.contains(e.target) && e.target !== input) {
                dropdown.classList.add('hidden');
            }
        });

        async function renderDictionaryResult(inputWord) {
            const raw = (inputWord || 'economic').trim();
            currentDictLookupWord = raw;
            const container = document.getElementById('dictResultContainer');
            if (!container) return;

            // Đóng autocomplete dropdown
            const dropdown = document.getElementById('dictAutocompleteDropdown');
            if (dropdown) dropdown.classList.add('hidden');

            // Loading state
            container.innerHTML = `
                <div class="glass-panel rounded-[26px] p-8 text-center space-y-4 border-2 border-sky-200 animate-pulse">
                    <div class="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-slate-800 text-sky-600 dark:text-sky-400 flex items-center justify-center mx-auto text-xl animate-spin">
                        <i class="fa-solid fa-spinner"></i>
                    </div>
                    <div>
                        <h3 class="text-base font-extrabold text-slate-800 dark:text-white">Đang tra cứu từ điển toàn diện...</h3>
                        <p class="text-xs text-slate-500 mt-1">Đang tra cứu từ/cụm từ <strong>"${escapeHtml(raw)}"</strong> chuẩn TFLAT + Cambridge (song song Google GTX, FreeDict & Datamuse)...</p>
                    </div>
                </div>
            `;

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

            // 0. Trường hợp lỗi kết nối mạng (Dịch vụ bên ngoài hoặc backend chưa thể truy cập)
            if (entry && entry.networkError) {
                const queryStr = escapeHtml(entry?.query || raw);
                container.innerHTML = `
                    <div class="glass-panel rounded-[26px] p-8 text-center space-y-4 border-2 border-amber-200 dark:border-amber-900/50">
                        <div class="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center mx-auto text-2xl shadow-sm">
                            <i class="fa-solid fa-wifi"></i>
                        </div>
                        <div class="space-y-1">
                            <h4 class="text-base font-extrabold text-slate-800 dark:text-white">Không thể kết nối máy chủ tra cứu</h4>
                            <p class="text-xs text-slate-500 max-w-lg mx-auto">Hệ thống tạm thời không kết nối được dịch vụ từ điển trực tuyến để tra cứu "${queryStr}". Vui lòng kiểm tra lại kết nối mạng hoặc thử lại.</p>
                        </div>
                        <div class="pt-2">
                            <button type="button" onclick="renderDictionaryResult('${escapeHtml(raw)}')" class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition inline-flex items-center gap-1.5 cursor-pointer">
                                <i class="fa-solid fa-rotate-right"></i> Thử lại tra cứu
                            </button>
                        </div>
                    </div>
                `;
                return;
            }

            // 1. Trường hợp: Không tìm thấy từ (Chỉ xảy ra khi người dùng gõ chuỗi vô nghĩa như "asdfghjkl123")
            if (!entry || entry.notFound) {
                const queryStr = escapeHtml(entry?.query || raw);
                const suggestions = Array.isArray(entry?.suggestions) ? entry.suggestions.filter(s => s.toLowerCase() !== raw.toLowerCase()) : [];
                const suggestHtml = suggestions.length > 0 ? `
                    <div class="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 max-w-md mx-auto space-y-2 text-left">
                        <div class="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                            <i class="fa-solid fa-wand-magic-sparkles text-amber-600"></i> Ý bạn có phải là:
                        </div>
                        <div class="flex flex-wrap gap-2">
                            ${suggestions.map(s => `
                                <button onclick="quickLookupDictWord('${escapeHtml(s)}')" class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-amber-100 text-amber-900 dark:text-amber-200 font-extrabold text-xs border border-amber-300 shadow-sm transition flex items-center gap-1.5 cursor-pointer">
                                    <i class="fa-solid fa-arrow-right text-xs"></i>
                                    <span>${escapeHtml(s)}</span>
                                </button>
                            `).join('')}
                        </div>
                    </div>
                ` : '';

                container.innerHTML = `
                    <div class="glass-panel rounded-[26px] p-8 text-center space-y-4 border-2 border-rose-200">
                        <div class="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center mx-auto text-2xl shadow-sm">
                            <i class="fa-solid fa-circle-question"></i>
                        </div>
                        <div class="space-y-1">
                            <h4 class="text-base font-extrabold text-slate-800 dark:text-white">Không tìm thấy từ hoặc cụm từ "${queryStr}"</h4>
                            <p class="text-xs text-slate-500 max-w-lg mx-auto">Vui lòng kiểm tra lại chính tả hoặc thử các từ quen thuộc như: <em>imminent, eager, collaborate, head of state, happy new year...</em></p>
                        </div>
                        ${suggestHtml}
                    </div>
                `;
                return;
            }

            if (window.DictionaryEngine) {
                DictionaryEngine.currentEntry = entry;
            }

            const displayWord = entry.isReverseLookup ? (entry.englishTargetWord || entry.headword || entry.word || raw) : (entry.headword || entry.word || raw);
            const displayEnglishWord = entry.englishTargetWord || entry.headword || entry.word || raw;
            const mainMeaning = entry.isReverseLookup ? (entry.englishTargetWord || raw) : (entry.mainMeaning || entry.vi || entry.vietnameseMeaning || entry.definition || '');
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
                dictBlocksHtml = `
                    <div class="space-y-3 pt-2">
                        <div class="text-xs font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-1.5">
                            <i class="fa-solid fa-layer-group text-sky-600"></i> Từ loại & Chi tiết các nghĩa (TFLAT Standard):
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            ${dictBlocks.map(block => {
                                const pLower = (block.pos || '').toLowerCase();
                                let badgeColor = 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300';
                                if (pLower.includes('danh')) badgeColor = 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950 dark:text-purple-300';
                                else if (pLower.includes('động')) badgeColor = 'bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950 dark:text-teal-300';
                                else if (pLower.includes('tính')) badgeColor = 'bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950 dark:text-rose-300';
                                else if (pLower.includes('trạng')) badgeColor = 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950 dark:text-amber-300';

                                const blockTerms = Array.isArray(block.terms) ? block.terms : [];
                                const termsHtml = blockTerms.map(t => {
                                    if (entry.isReverseLookup) {
                                        return `<button onclick="quickLookupDictWord('${escapeHtml(t)}')" class="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 hover:bg-sky-100 text-sky-800 dark:text-sky-200 font-extrabold text-xs border border-slate-200 dark:border-slate-600 shadow-2xs transition cursor-pointer flex items-center gap-1"><span>${escapeHtml(t)}</span><i class="fa-solid fa-arrow-right text-xs text-sky-500"></i></button>`;
                                    }
                                    return `<span class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs border border-slate-200 dark:border-slate-600">${escapeHtml(t)}</span>`;
                                }).join('');

                                const blockEntries = Array.isArray(block.entries) ? block.entries : [];
                                const entriesHtml = blockEntries.slice(0, 4).map(e => `
                                    <div class="text-xs space-y-1 pt-1.5 border-t border-slate-100 dark:border-slate-700/60">
                                        <div class="font-extrabold text-slate-900 dark:text-white">• ${escapeHtml(e.meaning || '')}</div>
                                        ${Array.isArray(e.synonyms) && e.synonyms.length > 0 ? `
                                            <div class="flex flex-wrap items-center gap-1 text-xs">
                                                <span class="text-slate-400 font-medium">Đồng nghĩa:</span>
                                                ${e.synonyms.slice(0, 5).map(s => `
                                                    <button onclick="quickLookupDictWord('${escapeHtml(s)}')" class="text-sky-600 dark:text-sky-400 hover:underline font-semibold cursor-pointer">
                                                        ${escapeHtml(s)}
                                                    </button>
                                                `).join('<span class="text-slate-300">,</span> ')}
                                            </div>
                                        ` : ''}
                                    </div>
                                `).join('');

                                return `
                                    <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-2.5">
                                        <div class="flex items-center justify-between">
                                            <span class="px-2.5 py-0.5 rounded-full text-xs font-black uppercase border ${badgeColor}">
                                                ${escapeHtml(block.pos)}
                                            </span>
                                            ${block.baseForm ? `<span class="text-xs text-slate-400">Gốc: ${escapeHtml(block.baseForm)}</span>` : ''}
                                        </div>
                                        <div class="flex flex-wrap gap-1.5">
                                            ${termsHtml}
                                        </div>
                                        ${entriesHtml}
                                    </div>
                                `;
                            }).join('')}
                        </div>
                    </div>
                `;
            }

            // Word Family Matrix
            const wf = entry.wordFamily || {};
            const safeNoun = Array.isArray(wf.noun) ? wf.noun : [];
            const safeVerb = Array.isArray(wf.verb) ? wf.verb : [];
            const safeAdj = Array.isArray(wf.adj) ? wf.adj : [];
            const safeAdv = Array.isArray(wf.adv) ? wf.adv : [];

            const nounList = (safeNoun.length > 0)
                ? safeNoun.map(n => `<div class="p-2 rounded-xl bg-purple-50 dark:bg-slate-800 border border-purple-200"><button onclick="quickLookupDictWord('${escapeHtml(n.term || n)}')" class="font-extrabold text-purple-700 dark:text-purple-300 hover:underline text-left cursor-pointer">${escapeHtml(n.term || n)}</button><div class="text-xs text-slate-500">${escapeHtml(n.vi || n.term || n)}</div></div>`).join('')
                : `<div class="text-xs text-slate-400 italic">Không có dạng thông dụng</div>`;
            const verbList = (safeVerb.length > 0)
                ? safeVerb.map(v => `<div class="p-2 rounded-xl bg-teal-50 dark:bg-slate-800 border border-teal-200"><button onclick="quickLookupDictWord('${escapeHtml(v.term || v)}')" class="font-extrabold text-teal-700 dark:text-teal-300 hover:underline text-left cursor-pointer">${escapeHtml(v.term || v)}</button><div class="text-xs text-slate-500">${escapeHtml(v.vi || v.term || v)}</div></div>`).join('')
                : `<div class="text-xs text-slate-400 italic">Không có dạng thông dụng</div>`;
            const adjList = (safeAdj.length > 0)
                ? safeAdj.map(a => `<div class="p-2 rounded-xl bg-rose-50 dark:bg-slate-800 border border-rose-200"><button onclick="quickLookupDictWord('${escapeHtml(a.term || a)}')" class="font-extrabold text-rose-700 dark:text-rose-300 hover:underline text-left cursor-pointer">${escapeHtml(a.term || a)}</button><div class="text-xs text-slate-500">${escapeHtml(a.vi || a.term || a)}</div></div>`).join('')
                : `<div class="text-xs text-slate-400 italic">Không có dạng thông dụng</div>`;
            const advList = (safeAdv.length > 0)
                ? safeAdv.map(ad => `<div class="p-2 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200"><button onclick="quickLookupDictWord('${escapeHtml(ad.term || ad)}')" class="font-extrabold text-amber-800 dark:text-amber-300 hover:underline text-left cursor-pointer">${escapeHtml(ad.term || ad)}</button><div class="text-xs text-slate-500">${escapeHtml(ad.vi || ad.term || ad)}</div></div>`).join('')
                : `<div class="text-xs text-slate-400 italic">Không có dạng thông dụng</div>`;

            const hasWordFamily = safeNoun.length > 0 || safeVerb.length > 0 || safeAdj.length > 0 || safeAdv.length > 0;

            // Real-life Context Examples
            const examples = Array.isArray(entry.examples) ? entry.examples : [];
            const exHtml = (examples.length > 0)
                ? `
                    <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <div class="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                            <i class="fa-regular fa-comment-dots text-sky-600"></i> Ví dụ ngữ cảnh công sở & đề thi:
                        </div>
                        <div class="space-y-2">
                            ${examples.map(ex => `
                                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1">
                                    <div class="text-xs font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                                        <span>🇬🇧 "${escapeHtml(ex.en || '')}"</span>
                                        <button onclick="DictionaryEngine.speak('${escapeHtml(String(ex.en || '').replace(/'/g, "\\'"))}', 'en-US')" class="text-sky-600 hover:text-sky-800 text-xs cursor-pointer" title="Nghe câu ví dụ">
                                            <i class="fa-solid fa-volume-high"></i>
                                        </button>
                                    </div>
                                    <div class="text-xs text-slate-500 italic">🇻🇳 ${escapeHtml(ex.vi || '')}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `
                : '';

            // Synonyms pills
            const synonyms = Array.isArray(entry.synonyms) ? entry.synonyms : [];
            const synHtml = (synonyms.length > 0)
                ? synonyms.slice(0, 10).map(s => `<button onclick="quickLookupDictWord('${escapeHtml(s)}')" class="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition cursor-pointer">${escapeHtml(s)}</button>`).join('')
                : '';

            // Collocations & Idioms
            const collocations = Array.isArray(entry.collocations) ? entry.collocations : [];
            const collHtml = (collocations.length > 0)
                ? collocations.map(c => {
                    const phraseText = typeof c === 'string' ? c : (c.en || c.phrase || '');
                    const viText = typeof c === 'string' ? '' : (c.vi || '');
                    return `<li class="flex items-start gap-2 text-xs"><span class="text-sky-600 font-extrabold shrink-0">•</span><div><strong class="text-slate-900 dark:text-white cursor-pointer hover:underline" onclick="quickLookupDictWord('${escapeHtml(phraseText)}')">${escapeHtml(phraseText)}</strong>${viText ? `: <span class="text-slate-600 dark:text-slate-300 italic">${escapeHtml(viText)}</span>` : ''}</div></li>`;
                }).join('')
                : '';

            const quizHtml = window.DictionaryEngine ? DictionaryEngine.generateMiniQuiz(entry) : '';

            // RENDER TOÀN BỘ THẺ KẾT QUẢ ĐỒNG BỘ 10/10
            const alternatives = Array.isArray(entry.alternatives) ? entry.alternatives : [];

            container.innerHTML = `
                <div class="glass-panel rounded-[26px] p-6 space-y-5 border-2 border-sky-200 dark:border-slate-700 shadow-sm">
                    
                    <!-- Header Row: Title, Badges, Audio, Action Buttons -->
                    <div class="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                            <!-- Direction Badge -->
                            <div class="flex flex-wrap items-center gap-2 mb-2">
                                ${entry.isReverseLookup ? `
                                    <span class="px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950 dark:to-teal-950 text-emerald-900 dark:text-emerald-300 font-black text-xs flex items-center gap-1.5 shadow-2xs border border-emerald-300/80">
                                        <i class="fa-solid fa-arrow-right-arrow-left"></i> Việt ➔ Anh (TFLAT + Cambridge)
                                    </span>
                                ` : `
                                    <span class="px-3 py-1 rounded-full bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-sky-950 dark:to-indigo-950 text-sky-900 dark:text-sky-300 font-black text-xs flex items-center gap-1.5 shadow-2xs border border-sky-300/80">
                                        <i class="fa-solid fa-book-open"></i> Anh ➔ Việt (Cambridge + TFLAT)
                                    </span>
                                `}
                                <span class="px-2.5 py-0.5 rounded-full bg-sky-100 dark:bg-slate-800 text-sky-800 dark:text-sky-300 text-xs font-extrabold">${pos}</span>
                                <span class="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 text-xs font-bold">${examTag}</span>
                                ${entry.isBasicOffline ? `
                                    <span class="px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1" title="Kết quả từ kho từ vựng cốt lõi cục bộ, chưa nạp phần mở rộng trực tuyến">
                                        <i class="fa-solid fa-database text-xs"></i> Cơ bản offline (Chưa nạp phần bổ sung trực tuyến)
                                    </span>
                                ` : ''}
                                ${entry.isInflected ? `
                                    <span class="px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-900 dark:text-indigo-300 text-xs font-bold flex items-center gap-1">
                                        <i class="fa-solid fa-code-branch"></i> Từ gốc: <strong class="cursor-pointer hover:underline" onclick="quickLookupDictWord('${escapeHtml(entry.baseForm)}')">${escapeHtml(entry.baseForm)}</strong>
                                    </span>
                                ` : ''}
                            </div>

                            <!-- Big Word Title -->
                            <div class="flex flex-wrap items-baseline gap-3">
                                <h2 class="text-[32px] font-black text-slate-900 dark:text-white tracking-tight leading-none">${escapeHtml(displayWord)}</h2>
                                ${entry.isReverseLookup ? `
                                    <span class="text-xs font-bold text-slate-500">
                                        (Từ khóa tiếng Việt: <strong class="text-emerald-600 dark:text-emerald-400">"${escapeHtml(entry.query)}"</strong>)
                                    </span>
                                ` : ''}
                            </div>

                            <!-- US & UK Pronunciation Row -->
                            <div class="flex flex-wrap items-center gap-3 text-xs font-semibold mt-3">
                                <div class="flex items-center gap-1.5 text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-sky-200 dark:border-slate-700">
                                    <span>🇺🇸 US: <strong>${ipaUs}</strong></span>
                                    <button onclick="DictionaryEngine.speak('${escapeHtml(displayEnglishWord)}', 'en-US')" class="w-6 h-6 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center transition ml-1 cursor-pointer" title="Nghe phát âm chuẩn US">
                                        <i class="fa-solid fa-volume-high text-xs"></i>
                                    </button>
                                </div>
                                <div class="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-slate-700">
                                    <span>🇬🇧 UK: <strong>${ipaUk}</strong></span>
                                    <button onclick="DictionaryEngine.speak('${escapeHtml(displayEnglishWord)}', 'en-GB')" class="w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition ml-1 cursor-pointer" title="Nghe phát âm chuẩn UK">
                                        <i class="fa-solid fa-volume-high text-xs"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-wrap items-center gap-2">
                            <button onclick="saveDictWordToVocab('${escapeHtml(displayEnglishWord)}')" class="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-extrabold shadow-sm transition flex items-center gap-1.5 cursor-pointer">
                                <i class="fa-solid fa-plus"></i>
                                <span>Thêm vào thẻ từ vựng</span>
                            </button>
                            <button onclick="openWordCopyingInTakeNote('${escapeHtml(displayEnglishWord)}')" class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black shadow-sm transition flex items-center gap-1.5 cursor-pointer">
                                <i class="fa-solid fa-feather-pointed"></i>
                                <span>Luyện chép 10-30 lần</span>
                            </button>
                        </div>
                    </div>

                    <!-- Highlighted Core Meaning Card -->
                    <div class="p-4 rounded-2xl bg-gradient-to-r from-sky-50 via-blue-50/60 to-indigo-50/50 dark:from-slate-800/80 dark:to-slate-800/40 border-2 border-sky-300 dark:border-slate-700 space-y-2">
                        <div class="text-xs font-black uppercase text-sky-700 dark:text-sky-300 tracking-wider flex items-center gap-1.5">
                            <i class="fa-solid fa-star text-amber-500"></i> Nghĩa chính cốt lõi:
                        </div>
                        <div class="text-[22px] font-black text-slate-900 dark:text-white leading-snug">
                            ${entry.isReverseLookup ? '🇬🇧 ' + escapeHtml(entry.englishTargetWord) : '🇻🇳 ' + escapeHtml(mainMeaning)}
                        </div>
                        ${alternatives.length > 0 ? `
                            <div class="pt-2 border-t border-sky-200/60 dark:border-slate-700 flex flex-wrap items-center gap-1.5">
                                <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Các cách dịch thay thế / ngữ cảnh:</span>
                                ${alternatives.map(a => `
                                    <button onclick="quickLookupDictWord('${escapeHtml(a)}')" class="px-2.5 py-0.5 rounded-lg bg-white dark:bg-slate-700 text-sky-800 dark:text-sky-200 text-xs font-bold border border-sky-200 dark:border-slate-600 hover:border-sky-400 transition cursor-pointer">
                                        ${escapeHtml(a)}
                                    </button>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>

                    <!-- TOEIC Exam Note if available -->
                    ${entry.toeicNote ? `
                        <div class="p-3.5 rounded-2xl bg-amber-50/90 dark:bg-slate-800 border-l-4 border-l-amber-600 border border-amber-200 text-xs space-y-1 shadow-sm">
                            <div class="font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-triangle-exclamation text-amber-600"></i> BÍ KÍP BẪY TỪ LOẠI TOEIC PART 5 & 6:
                            </div>
                            <div class="text-slate-700 dark:text-slate-300 leading-relaxed font-medium">${escapeHtml(entry.toeicNote)}</div>
                        </div>
                    ` : ''}

                    <!-- Detailed POS Blocks (Danh từ, Động từ, Tính từ...) -->
                    ${dictBlocksHtml}

                    <!-- Synonyms Chips -->
                    ${synHtml ? `
                        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                            <div class="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-equals text-emerald-600"></i> Từ đồng nghĩa (Synonyms):
                            </div>
                            <div class="flex flex-wrap gap-1.5">${synHtml}</div>
                        </div>
                    ` : ''}

                    <!-- Word Family Matrix (Họ từ Noun - Verb - Adj - Adv) -->
                    ${hasWordFamily ? `
                        <div class="space-y-2 pt-2">
                            <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                <i class="fa-solid fa-sitemap text-sky-600"></i> Bảng Họ từ toàn diện (Word Family Matrix):
                            </h3>
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                <div class="glass-panel rounded-2xl p-3 space-y-2 border border-purple-200">
                                    <div class="text-xs font-black text-purple-700">🏷️ DANH TỪ (Noun)</div>
                                    <div class="space-y-1.5">${nounList}</div>
                                </div>
                                <div class="glass-panel rounded-2xl p-3 space-y-2 border border-teal-200">
                                    <div class="text-xs font-black text-teal-700">⚡ ĐỘNG TỪ (Verb)</div>
                                    <div class="space-y-1.5">${verbList}</div>
                                </div>
                                <div class="glass-panel rounded-2xl p-3 space-y-2 border border-rose-200">
                                    <div class="text-xs font-black text-rose-700">🎨 TÍNH TỪ (Adj)</div>
                                    <div class="space-y-1.5">${adjList}</div>
                                </div>
                                <div class="glass-panel rounded-2xl p-3 space-y-2 border border-amber-200">
                                    <div class="text-xs font-black text-amber-800">🚀 TRẠNG TỪ (Adv)</div>
                                    <div class="space-y-1.5">${advList}</div>
                                </div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- Collocations & Idioms if available -->
                    ${collHtml ? `
                        <div class="p-4 rounded-2xl bg-sky-50/60 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 space-y-2.5">
                            <div class="text-xs font-extrabold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-link text-sky-600"></i> Cụm từ Collocations hay gặp trong bài thi:
                            </div>
                            <ul class="space-y-2">${collHtml}</ul>
                        </div>
                    ` : ''}

                    <!-- Real-life Context Examples -->
                    ${exHtml}

                    <!-- Mini-Quiz Quick Check -->
                    ${quizHtml ? `
                        <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                            ${quizHtml}
                        </div>
                    ` : ''}

                    <!-- Footer Attribution -->
                    <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                        <div class="flex items-center gap-1.5">
                            <i class="fa-solid fa-shield-halved text-sky-500"></i>
                            <span>Dữ liệu mở: Google Translate GTX, Free Dictionary API (Cambridge/Oxford), Datamuse & Wiktionary.</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <button onclick="reportDictIssue('${escapeHtml(displayEnglishWord)}')" class="hover:text-sky-600 transition cursor-pointer">Báo lỗi / Góp ý dữ liệu</button>
                        </div>
                    </div>
                </div>
            `;
        }

        function executeDictSearch() {
            const input = document.getElementById('dictSearchInput');
            if (!input) return;
            const word = input.value.trim();
            if (!word) {
                showToast('Vui lòng nhập từ tiếng Anh hoặc tiếng Việt muốn tra cứu!');
                return;
            }
            renderDictionaryResult(word);
        }

        function quickLookupDictWord(word) {
            const input = document.getElementById('dictSearchInput');
            if (input) input.value = word;
            renderDictionaryResult(word);
        }

        function toggleDictSpeed() {
            if (window.DictionaryEngine && typeof window.DictionaryEngine.toggleAudioSpeed === 'function') {
                window.DictionaryEngine.toggleAudioSpeed();
            }
        }

        function speakDictWord(lang = 'en-US') {
            if (window.DictionaryEngine) {
                DictionaryEngine.speak(currentDictLookupWord, lang);
            } else {
                speakText(currentDictLookupWord, lang);
            }
        }

        function saveDictWordToVocab(word) {
            const w = word || currentDictLookupWord;
            const entry = window.DictionaryEngine?.currentEntry || null;
            const term = entry?.englishTargetWord || entry?.headword || w;
            const vi = entry?.mainMeaning || entry?.senses?.[0]?.meaningVi || entry?.vi || 'Từ vựng đã lưu';
            const ipa = entry?.ipa?.us || entry?.phonetic || '';

            if (!state.savedWords) state.savedWords = [];
            if (!state.savedWords.some(item => item.en.toLowerCase() === term.toLowerCase())) {
                state.savedWords.unshift({ en: term, vi: vi, ipa: ipa });
            }
            updateDashboardMetrics();
            showToast(`📌 Đã lưu từ "${term}" vào Sổ tay từ vựng (+5 XP)!`);
            if (window.StudySync) {
                window.StudySync.broadcastLearning('SAVED_VOCAB_WORD', term, 5);
            }
        }

        function openWordCopyingInTakeNote(word) {
            const target = word || currentDictLookupWord || 'hello';
            switchTab('take-note');
            switchTakeNoteSubMode('copying');
            const input = document.getElementById('tnTargetWordInput');
            if (input) input.value = target;
            startWordCopyingSession(target, currentCopyCount || 10);
            showToast(`✍️ Đã mở phiên luyện chép cho từ "${target}"!`);
        }

        function reportDictIssue(word) {
            const reason = prompt(`Nhập phản hồi hoặc đề xuất chỉnh sửa nghĩa cho từ "${word}":`, "Nghĩa tiếng Việt chưa sát ngữ cảnh công sở");
            if (reason && reason.trim()) {
                showToast(`📨 Cảm ơn bạn! Đã ghi nhận góp ý cho từ "${word}".`);
            }
        }

        // =========================================================================
        // WORD FAMILY EXPLORER IN VIEW-TU-VUNG
        // =========================================================================
        async function renderVocabFamilySearch(inputWord) {
            const word = (inputWord || 'economic').trim();
            const area = document.getElementById('vocabFamilyResultArea');
            if (!area) return;

            let info = window.lookupOrDeriveWordInfo ? window.lookupOrDeriveWordInfo(word) : null;
            if (!info && window.lookupWordOnlineAsync) {
                area.innerHTML = `<div class="p-6 text-center text-sky-600 font-bold animate-pulse"><i class="fa-solid fa-spinner animate-spin mr-2"></i>Đang tra cứu họ từ trực tuyến cho "${word}"...</div>`;
                info = await window.lookupWordOnlineAsync(word);
            }
            if (!info) {
                area.innerHTML = `<div class="p-6 text-center text-slate-500">Không tìm thấy thông tin họ từ cho "${word}".</div>`;
                return;
            }

            const wf = info.wordFamily || {};
            const nounStr = (wf.noun && wf.noun.length > 0) ? wf.noun.map(n => `<span class="px-2 py-0.5 rounded-lg bg-purple-100 text-purple-900 font-bold">${n.term} (${n.vi})</span>`).join(' ') : '—';
            const verbStr = (wf.verb && wf.verb.length > 0) ? wf.verb.map(v => `<span class="px-2 py-0.5 rounded-lg bg-teal-100 text-teal-900 font-bold">${v.term} (${v.vi})</span>`).join(' ') : '—';
            const adjStr = (wf.adj && wf.adj.length > 0) ? wf.adj.map(a => `<span class="px-2 py-0.5 rounded-lg bg-rose-100 text-rose-900 font-bold">${a.term} (${a.vi})</span>`).join(' ') : '—';
            const advStr = (wf.adv && wf.adv.length > 0) ? wf.adv.map(ad => `<span class="px-2 py-0.5 rounded-lg bg-amber-100 text-amber-900 font-bold">${ad.term} (${ad.vi})</span>`).join(' ') : '—';

            const collItems = (info.collocations || []).map(c => `<li>• <strong>${c.en}</strong>: <em>${c.vi}</em></li>`).join('');
            const idiomItems = (info.idioms || []).map(idm => `<li>★ <strong>${idm.en}</strong>: <em>${idm.vi}</em></li>`).join('');

            area.innerHTML = `
                <div class="rounded-2xl p-5 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800 border-2 border-sky-200 space-y-4">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div class="flex items-center gap-3">
                            <h3 class="text-2xl font-black text-slate-900 dark:text-white">${info.word}</h3>
                            <span class="text-xs font-bold text-sky-600">${info.phonetic}</span>
                            <span class="px-2.5 py-0.5 rounded-full bg-sky-200 text-sky-900 font-extrabold text-xs">${info.partOfSpeech}</span>
                        </div>
                        <button onclick="openWordCopyingInTakeNote('${info.word}')" class="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition">
                            <i class="fa-solid fa-feather-pointed"></i> Luyện chép 10-30 lần
                        </button>
                    </div>

                    <div class="text-sm font-bold text-slate-800 dark:text-slate-100">🇻🇳 ${info.vi}</div>

                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
                        <div class="p-3 rounded-xl bg-white dark:bg-slate-700 border border-purple-200 space-y-1">
                            <div class="font-extrabold text-purple-700 uppercase">🏷️ Danh từ (Noun)</div>
                            <div class="leading-relaxed">${nounStr}</div>
                        </div>
                        <div class="p-3 rounded-xl bg-white dark:bg-slate-700 border border-teal-200 space-y-1">
                            <div class="font-extrabold text-teal-700 uppercase">⚡ Động từ (Verb)</div>
                            <div class="leading-relaxed">${verbStr}</div>
                        </div>
                        <div class="p-3 rounded-xl bg-white dark:bg-slate-700 border border-rose-200 space-y-1">
                            <div class="font-extrabold text-rose-700 uppercase">🎨 Tính từ (Adj)</div>
                            <div class="leading-relaxed">${adjStr}</div>
                        </div>
                        <div class="p-3 rounded-xl bg-white dark:bg-slate-700 border border-amber-200 space-y-1">
                            <div class="font-extrabold text-amber-800 uppercase">🚀 Trạng từ (Adv)</div>
                            <div class="leading-relaxed">${advStr}</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                        <div class="p-3.5 rounded-xl bg-white dark:bg-slate-700 border border-sky-200 space-y-1.5">
                            <div class="font-extrabold text-sky-800 dark:text-sky-300">Collocations TOEIC:</div>
                            <ul class="space-y-1">${collItems || '<li>Chưa có dữ liệu</li>'}</ul>
                        </div>
                        <div class="p-3.5 rounded-xl bg-white dark:bg-slate-700 border border-amber-200 space-y-1.5">
                            <div class="font-extrabold text-amber-800 dark:text-amber-300">Thành ngữ & Cụm từ:</div>
                            <ul class="space-y-1">${idiomItems || '<li>Chưa có dữ liệu</li>'}</ul>
                        </div>
                    </div>
                </div>
            `;
        }

        // =========================================================================
        // 11. CONTEXTUAL VOCABULARY COPYING (CHÉP TỪ VỰNG 10 - 20 - 30 LẦN THEO NGỮ CẢNH)
        // =========================================================================
        let currentCopyCount = 10;
        let copyingSession = {
            word: 'hello',
            total: 10,
            currentIndex: 0,
            sentences: [],
            history: []
        };

        function switchTakeNoteSubMode(mode) {
            const editorEl = document.getElementById('tnEditorWorkspace');
            const copyingEl = document.getElementById('tnCopyingWorkspace');
            const editorBtn = document.getElementById('tnSubModeEditorBtn');
            const copyBtn = document.getElementById('tnSubModeCopyBtn');

            if (mode === 'copying') {
                if (editorEl) editorEl.classList.add('hidden');
                if (copyingEl) copyingEl.classList.remove('hidden');
                if (editorBtn) {
                    editorBtn.className = 'px-4 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-amber-50 text-slate-700 dark:text-slate-200 font-extrabold text-xs flex items-center gap-2 border border-amber-200/80 transition';
                }
                if (copyBtn) {
                    copyBtn.className = 'px-4 py-2 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow-sm flex items-center gap-2 transition';
                }
                if (!copyingSession.sentences || copyingSession.sentences.length === 0) {
                    startWordCopyingSession('hello', 10);
                }
            } else {
                if (editorEl) editorEl.classList.remove('hidden');
                if (copyingEl) copyingEl.classList.add('hidden');
                if (editorBtn) {
                    editorBtn.className = 'px-4 py-2 rounded-xl bg-amber-600 text-white font-extrabold text-xs shadow-sm flex items-center gap-2 transition';
                }
                if (copyBtn) {
                    copyBtn.className = 'px-4 py-2 rounded-xl bg-white dark:bg-slate-700 hover:bg-amber-50 text-slate-700 dark:text-slate-200 font-extrabold text-xs flex items-center gap-2 border border-amber-200/80 transition';
                }
            }
        }

        function selectCopyingCount(count, btnEl) {
            currentCopyCount = count;
            document.querySelectorAll('.tn-copy-count-btn').forEach(b => {
                b.className = 'tn-copy-count-btn px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border font-bold text-xs hover:border-amber-400 transition';
            });
            if (btnEl) {
                btnEl.className = 'tn-copy-count-btn px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs shadow-sm transition';
            }
            const currentWord = document.getElementById('tnTargetWordInput')?.value || copyingSession.word || 'hello';
            startWordCopyingSession(currentWord, count);
        }

        function startWordCopyingSessionFromInput() {
            const input = document.getElementById('tnTargetWordInput');
            const word = (input?.value || 'hello').trim();
            startWordCopyingSession(word, currentCopyCount);
        }

        function quickStartCopyingWord(word) {
            const input = document.getElementById('tnTargetWordInput');
            if (input) input.value = word;
            startWordCopyingSession(word, currentCopyCount);
        }

        function startWordCopyingSession(word, count = 10) {
            const w = (word || 'hello').trim();
            const total = Math.min(Math.max(count, 5), 30);
            const sentences = window.generateContextSentencesForWord ? window.generateContextSentencesForWord(w, total) : [];

            copyingSession = {
                word: w,
                total: total,
                currentIndex: 0,
                sentences: sentences,
                history: []
            };

            const victoryBox = document.getElementById('copyingVictoryBox');
            if (victoryBox) victoryBox.classList.add('hidden');
            const activeCard = document.getElementById('copyingActiveCard');
            if (activeCard) activeCard.classList.remove('hidden');

            renderCurrentCopyingCard();
            renderCopyingHistory();
            showToast(`🚀 Bắt đầu luyện chép từ "${w}" (${total} lần với ${total} ngữ cảnh độc lập)!`);
        }

        function renderCurrentCopyingCard() {
            if (!copyingSession.sentences || copyingSession.sentences.length === 0) return;
            const idx = copyingSession.currentIndex;
            const total = copyingSession.total;
            const current = copyingSession.sentences[idx];
            if (!current) return;

            const wordBadge = document.getElementById('copyingWordBadge');
            if (wordBadge) wordBadge.textContent = `TỪ: ${copyingSession.word.toUpperCase()}`;

            const grammarBadge = document.getElementById('copyingGrammarBadge');
            if (grammarBadge) grammarBadge.textContent = current.rule;

            const indexLabel = document.getElementById('copyingIndexLabel');
            if (indexLabel) indexLabel.textContent = `Lần chép ${idx + 1} / ${total}`;

            const pct = Math.round(((idx) / total) * 100);
            const progressPct = document.getElementById('copyingProgressPct');
            if (progressPct) progressPct.textContent = `${pct}%`;

            const progressBar = document.getElementById('copyingProgressBar');
            if (progressBar) progressBar.style.width = `${Math.max(pct, 5)}%`;

            // Highlight target word in prompt sentence
            const regex = new RegExp(`(${copyingSession.word})`, 'gi');
            const highlighted = current.sentence.replace(regex, '<span class="px-2 py-0.5 rounded-lg bg-amber-300 text-slate-900 font-black">$1</span>');
            const promptBox = document.getElementById('copyingPromptSentence');
            if (promptBox) promptBox.innerHTML = highlighted;

            const ruleExp = document.getElementById('copyingRuleExplanation');
            if (ruleExp) ruleExp.textContent = `Ngữ pháp áp dụng: ${current.rule}`;

            const inputBox = document.getElementById('copyingInputBox');
            if (inputBox) {
                inputBox.value = '';
                inputBox.focus();
            }

            const status = document.getElementById('copyingTypingStatus');
            if (status) status.textContent = `Đang gõ: 0 ký tự`;

            const feedback = document.getElementById('copyingFeedbackBox');
            if (feedback) feedback.classList.add('hidden');
        }

        function handleCopyingLiveTyping() {
            const input = document.getElementById('copyingInputBox');
            if (!input) return;
            const typed = input.value;
            const status = document.getElementById('copyingTypingStatus');
            if (status) status.textContent = `Đang gõ: ${typed.length} ký tự`;
        }

        function verifyCopyingSubmission() {
            const input = document.getElementById('copyingInputBox');
            if (!input) return;
            const typed = input.value.trim();
            const current = copyingSession.sentences[copyingSession.currentIndex];
            if (!current) return;

            const cleanTyped = typed.toLowerCase().replace(/[^a-z0-9]/g, '');
            const cleanTarget = current.sentence.toLowerCase().replace(/[^a-z0-9]/g, '');

            if (!typed) {
                showToast('Vui lòng gõ lại câu tiếng Anh mẫu ở trên!');
                return;
            }

            // Check match (allow minor punctuation tolerance)
            const isMatch = cleanTyped === cleanTarget || cleanTarget.includes(cleanTyped) && cleanTyped.length > cleanTarget.length * 0.85;

            if (isMatch) {
                const feedback = document.getElementById('copyingFeedbackBox');
                if (feedback) feedback.classList.remove('hidden');

                // Save to history
                copyingSession.history.unshift({
                    index: copyingSession.currentIndex + 1,
                    rule: current.rule,
                    sentence: current.sentence,
                    typed: typed,
                    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
                });

                state.xp += 5;
                updateDashboardMetrics();
                renderCopyingHistory();

                setTimeout(() => {
                    if (copyingSession.currentIndex + 1 < copyingSession.total) {
                        copyingSession.currentIndex++;
                        renderCurrentCopyingCard();
                    } else {
                        finishWordCopyingSession();
                    }
                }, 750);
            } else {
                showToast('Chưa khớp hoàn toàn với câu mẫu. Hãy kiểm tra lại chính tả hoặc bấm "Gợi ý điền nhanh"!');
            }
        }

        function fillCopyingHint() {
            const current = copyingSession.sentences[copyingSession.currentIndex];
            if (!current) return;
            const input = document.getElementById('copyingInputBox');
            if (input) {
                input.value = current.sentence;
                handleCopyingLiveTyping();
            }
        }

        function speakCurrentCopyingSentence() {
            const current = copyingSession.sentences[copyingSession.currentIndex];
            if (!current) return;
            speakText(current.sentence, 'en-US');
        }

        function prevCopyingSentence() {
            if (copyingSession.currentIndex > 0) {
                copyingSession.currentIndex--;
                renderCurrentCopyingCard();
            }
        }

        function skipCopyingSentence() {
            if (copyingSession.currentIndex + 1 < copyingSession.total) {
                copyingSession.currentIndex++;
                renderCurrentCopyingCard();
            } else {
                finishWordCopyingSession();
            }
        }

        function finishWordCopyingSession() {
            const activeCard = document.getElementById('copyingActiveCard');
            if (activeCard) activeCard.classList.add('hidden');

            const victoryBox = document.getElementById('copyingVictoryBox');
            if (victoryBox) victoryBox.classList.remove('hidden');

            const summary = document.getElementById('copyingVictorySummary');
            if (summary) {
                summary.textContent = `Bạn đã chép thành công ${copyingSession.total} lần từ vựng "${copyingSession.word}" trong ${copyingSession.total} cấu trúc ngữ pháp và ngữ cảnh độc lập (+50 XP)!`;
            }

            state.xp += 50;
            state.vocabLearned++;
            if (!learnedVocabItems.find(x => (x.word || '').toLowerCase() === (copyingSession.word || '').toLowerCase())) {
                learnedVocabItems.push({
                    word: copyingSession.word,
                    meaning: `Chép thành thạo ${copyingSession.total} lần ngữ cảnh`,
                    collocation: `Chép mẫu ${copyingSession.total} câu`,
                    phonetic: '',
                    learnedAt: new Date().toISOString()
                });
            }
            updateDashboardMetrics();
            renderLearnedVocabList();
            showToast(`🎉 Xuất sắc! Bạn đã hoàn thành trọn vẹn ${copyingSession.total} lần chép từ vựng (+50 XP)!`);
            if (window.StudySync) {
                window.StudySync.broadcastLearning('COPYING_COMPLETED', copyingSession.word, 50);
            }
        }

        function saveCopyingSessionToNotePage() {
            if (!copyingSession.sentences || copyingSession.sentences.length === 0) return;
            const newId = 'note-' + Date.now();
            const dateStr = new Date().toLocaleDateString('vi-VN');

            let rows = copyingSession.sentences.map((s, i) => `
                <div style="margin-bottom: 12px; padding: 10px; border-left: 3px solid #f59e0b; background: rgba(254, 243, 199, 0.4); border-radius: 8px;">
                    <div style="font-size: 11px; font-weight: bold; color: #92400e;">Lần chép ${i + 1} · ${s.rule}</div>
                    <div style="font-size: 14px; font-weight: 600; color: #1e293b; margin-top: 4px;">"${s.sentence}"</div>
                </div>
            `).join('');

            const contentHtml = `
                <h2>✍️ Sổ chép từ vựng: <strong style="color: #d97706;">${copyingSession.word}</strong> (${copyingSession.total} lần theo ngữ cảnh)</h2>
                <p><em>Hoàn thành ngày ${dateStr} · Phương pháp Contextual Repetition</em></p>
                <hr style="margin: 14px 0; border: none; border-top: 1px solid #e2e8f0;"/>
                ${rows}
            `;

            takeNotesList.unshift({
                id: newId,
                title: `✍️ Chép từ: ${copyingSession.word} (${copyingSession.total} lần ngữ cảnh)`,
                category: 'Từ vựng',
                paper: 'paper-lined',
                updatedAt: 'Vừa xong',
                content: contentHtml
            });

            activeNoteId = newId;
            persistTakeNotes();
            renderTakeNoteSidebarList();
            loadActiveTakeNoteIntoEditor();
            switchTakeNoteSubMode('editor');
            showToast(`🔖 Đã lưu toàn bộ ${copyingSession.total} câu chép vào trang Sổ Take Note mới!`);
        }

        function restartWordCopyingSession() {
            startWordCopyingSession(copyingSession.word, copyingSession.total);
        }

        function renderCopyingHistory() {
            const list = document.getElementById('copyingHistoryList');
            if (!list) return;
            if (!copyingSession.history || copyingSession.history.length === 0) {
                list.innerHTML = `<div class="p-4 text-center text-xs text-slate-400 italic">Chưa có câu nào được chép trong phiên này. Hãy bắt đầu gõ ở trên!</div>`;
                return;
            }

            list.innerHTML = copyingSession.history.map(item => `
                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-start justify-between gap-2 text-xs">
                    <div>
                        <div class="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                            <span>✓ Lần ${item.index}:</span>
                            <span class="text-slate-500 font-normal">(${item.rule})</span>
                        </div>
                        <div class="font-extrabold text-slate-900 dark:text-white mt-0.5">"${item.sentence}"</div>
                    </div>
                    <span class="text-xs text-slate-400 shrink-0">${item.time}</span>
                </div>
            `).join('');
        }

        // =========================================================================
        // PWA & SERVICE WORKER INSTALL ENGINE
        // =========================================================================
        let deferredPwaInstallPrompt = null;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPwaInstallPrompt = e;
            const installBtn = document.getElementById('pwaInstallPromptBtn');
            if (installBtn) installBtn.classList.remove('hidden');
        });

        function promptInstallPwaApp() {
            if (typeof window.triggerPwaInstallPrompt === 'function') {
                window.triggerPwaInstallPrompt();
                return;
            }
            if (deferredPwaInstallPrompt) {
                deferredPwaInstallPrompt.prompt();
                deferredPwaInstallPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        showToast('🎉 Đang cài đặt ứng dụng vào điện thoại!');
                    }
                    deferredPwaInstallPrompt = null;
                });
            } else if (typeof openIosPwaInstallModal === 'function') {
                openIosPwaInstallModal();
            } else {
                openMobileConnectModal();
            }
        }

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js?v=toididaudo_v19_celestial').then(reg => {
                    reg.update();
                }).catch((err) => {
                    console.log('SW registration note:', err.message);
                });
                if ('caches' in window) {
                    caches.keys().then(keys => {
                        keys.forEach(k => {
                            if (k !== 'study-studio-cache-v12-pastel-musicbox' && k !== 'study-studio-audio-offline-v1') {
                                console.log('[Client] Purging old cache:', k);
                                caches.delete(k);
                            }
                        });
                    });
                }
            });
        }

        // =========================================================================
        // REAL-TIME CROSS-DEVICE STUDY SYNC ENGINE (TỰ ĐỘNG HÓA ĐỒNG BỘ ĐA THIẾT BỊ)
        // =========================================================================
        const StudySync = {
            deviceId: '',
            deviceName: '',
            evtSource: null,
            isConnected: false,

            init() {
                // Khởi tạo định danh thiết bị độc nhất
                let savedId = localStorage.getItem('cung_dang_device_id');
                if (!savedId) {
                    savedId = 'dev-' + Math.random().toString(36).substring(2, 9) + '-' + Date.now();
                    localStorage.setItem('cung_dang_device_id', savedId);
                }
                this.deviceId = savedId;

                // Tự động nhận diện thiết bị
                const isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
                this.deviceName = isMobile ? 'Điện thoại' : 'Laptop';

                // Khôi phục dữ liệu đã học từ localStorage
                this.loadFromLocalStorage();

                // Kết nối luồng Server-Sent Events (SSE) để đồng bộ Realtime hai chiều
                this.connectStream();

                // Cập nhật nhãn trạng thái lên giao diện
                this.updateUIStatus();
            },

            loadFromLocalStorage() {
                try {
                    const uid = (currentUserAccount && currentUserAccount.id) ? currentUserAccount.id : 'guest';
                    const rawState = localStorage.getItem(`cung_dang_${uid}_study_state_v1`);
                    if (rawState) {
                        const parsed = JSON.parse(rawState);
                        if (parsed.xp > state.xp) state.xp = parsed.xp;
                        if (parsed.streak > state.streak) state.streak = parsed.streak;
                        if (parsed.vocabLearned > state.vocabLearned) state.vocabLearned = parsed.vocabLearned;
                        if (parsed.dictationDone > state.dictationDone) state.dictationDone = parsed.dictationDone;
                    }

                    const rawLearned = localStorage.getItem(`cung_dang_${uid}_learned_vocab_v1`);
                    if (rawLearned) {
                        const items = JSON.parse(rawLearned);
                        if (Array.isArray(items)) {
                            items.forEach(it => {
                                if (!learnedVocabItems.find(x => (x.word || '').toLowerCase() === (it.word || '').toLowerCase())) {
                                    learnedVocabItems.push(it);
                                }
                            });
                        }
                    }

                    const rawSaved = localStorage.getItem(`cung_dang_${uid}_saved_vocab_v1`);
                    if (rawSaved) {
                        const sItems = JSON.parse(rawSaved);
                        if (Array.isArray(sItems)) {
                            sItems.forEach(it => {
                                if (!savedVocabItems.find(x => (x.word || '').toLowerCase() === (it.word || '').toLowerCase())) {
                                    savedVocabItems.push(it);
                                }
                            });
                        }
                    }
                } catch (e) {
                    console.warn('Lỗi đọc dữ liệu học tập cục bộ:', e);
                }
            },

            saveToLocalStorage() {
                try {
                    const uid = (currentUserAccount && currentUserAccount.id) ? currentUserAccount.id : 'guest';
                    localStorage.setItem(`cung_dang_${uid}_study_state_v1`, JSON.stringify({
                        xp: state.xp,
                        streak: state.streak,
                        vocabLearned: Math.max(state.vocabLearned, learnedVocabItems.length),
                        dictationDone: state.dictationDone,
                        studyMinutes: state.studyMinutes
                    }));
                    localStorage.setItem(`cung_dang_${uid}_learned_vocab_v1`, JSON.stringify(learnedVocabItems));
                    localStorage.setItem(`cung_dang_${uid}_saved_vocab_v1`, JSON.stringify(savedVocabItems));
                } catch (e) {}
            },

            connectStream() {
                if (typeof EventSource === 'undefined') return;
                if (!currentUserAccount) {
                    if (this.evtSource) {
                        this.evtSource.close();
                        this.evtSource = null;
                    }
                    this.isConnected = false;
                    this.updateUIStatus();
                    return;
                }
                try {
                    if (this.evtSource) {
                        this.evtSource.close();
                        this.evtSource = null;
                    }
                    this.evtSource = new EventSource('/api/study-sync/stream');

                    this.evtSource.onopen = () => {
                        this.isConnected = true;
                        this.updateUIStatus();
                    };

                    this.evtSource.onmessage = (e) => {
                        try {
                            const payload = JSON.parse(e.data);
                            if (payload.type === 'INIT_STATE') {
                                const currentUid = currentUserAccount ? currentUserAccount.id : null;
                                if (!payload.userId || !currentUid || payload.userId === currentUid) {
                                    this.handleIncomingData(payload.data, false);
                                }
                            } else if (payload.type === 'SYNC_UPDATE') {
                                const currentUid = currentUserAccount ? currentUserAccount.id : null;
                                const isSameUser = !payload.userId || !currentUid || payload.userId === currentUid;
                                if (isSameUser && payload.senderDeviceId !== this.deviceId) {
                                    this.handleIncomingData(payload.data, true, payload);
                                }
                            }
                        } catch (err) {}
                    };

                    this.evtSource.onerror = () => {
                        this.isConnected = false;
                        this.updateUIStatus();
                    };
                } catch (e) {}
            },

            disconnect() {
                if (this.evtSource) {
                    this.evtSource.close();
                    this.evtSource = null;
                }
                this.isConnected = false;
                this.updateUIStatus();
            },

            handleIncomingData(data, isLiveUpdate = false, eventMeta = null) {
                if (!data) return;
                let hasChanges = false;

                // 1. Cập nhật XP & Metrics
                if (data.state) {
                    if (data.state.xp > state.xp) { state.xp = data.state.xp; hasChanges = true; }
                    if (data.state.streak > state.streak) { state.streak = data.state.streak; hasChanges = true; }
                    if (data.state.dictationDone > state.dictationDone) { state.dictationDone = data.state.dictationDone; hasChanges = true; }
                    if ((data.state.grammarDone || 0) > (state.grammarDone || 0)) { state.grammarDone = data.state.grammarDone; hasChanges = true; }
                    if ((data.state.readDone || 0) > (state.readDone || 0)) { state.readDone = data.state.readDone; hasChanges = true; }
                    if ((data.state.listenDone || 0) > (state.listenDone || 0)) { state.listenDone = data.state.listenDone; hasChanges = true; }
                    if ((data.state.studyMinutes || 0) > (state.studyMinutes || 0)) { state.studyMinutes = data.state.studyMinutes; hasChanges = true; }
                }

                // 2. Cập nhật danh sách từ vựng đã thuộc
                if (Array.isArray(data.learnedVocabItems)) {
                    data.learnedVocabItems.forEach(it => {
                        if (!learnedVocabItems.find(x => (x.word || '').toLowerCase() === (it.word || '').toLowerCase())) {
                            learnedVocabItems.push(it);
                            hasChanges = true;
                        }
                    });
                }
                state.vocabLearned = Math.max(state.vocabLearned, learnedVocabItems.length);

                // 3. Cập nhật danh sách từ vựng đã lưu
                if (Array.isArray(data.savedVocabItems)) {
                    data.savedVocabItems.forEach(it => {
                        if (!savedVocabItems.find(x => (x.word || '').toLowerCase() === (it.word || '').toLowerCase())) {
                            savedVocabItems.push(it);
                            hasChanges = true;
                        }
                    });
                }

                // 4. ĐỒNG BỘ TOÀN BỘ SỔ TAKE NOTE (Bao gồm hình ảnh base64, tài liệu đính kèm)
                if (Array.isArray(data.takeNotesList) && data.takeNotesList.length > 0) {
                    const map = new Map();
                    takeNotesList.forEach(n => map.set(n.id, n));
                    let notesChanged = false;
                    data.takeNotesList.forEach(inNote => {
                        const ex = map.get(inNote.id);
                        if (!ex || (inNote.updatedAtMs || 0) >= (ex.updatedAtMs || 0)) {
                            map.set(inNote.id, inNote);
                            notesChanged = true;
                        }
                    });
                    if (notesChanged) {
                        takeNotesList = Array.from(map.values());
                        persistTakeNotes();
                        renderTakeNoteSidebarList();
                        // Nếu trang ghi chú đang mở được cập nhật thì nạp lại nội dung ảnh và chữ vào trình soạn thảo
                        const active = takeNotesList.find(n => n.id === activeNoteId);
                        if (active) {
                            loadActiveTakeNoteIntoEditor();
                        }
                        hasChanges = true;
                    }
                }

                // 5. ĐỒNG BỘ CÂU HỎI NGỮ PHÁP ĐÃ LƯU
                if (Array.isArray(data.savedGrammarNotes)) {
                    let gramChanged = false;
                    data.savedGrammarNotes.forEach(gn => {
                        if (!savedGrammarNotes.find(x => x.q === gn.q)) {
                            savedGrammarNotes.push(gn);
                            gramChanged = true;
                        }
                    });
                    if (gramChanged) {
                        const countEl = document.getElementById('grammarNotebookCount');
                        if (countEl) countEl.textContent = savedGrammarNotes.length;
                        const listEl = document.getElementById('grammarSavedList');
                        if (listEl) {
                            listEl.innerHTML = savedGrammarNotes.map((n, i) => `
                                <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 text-xs">
                                    <div class="font-extrabold text-slate-900 dark:text-white">${i + 1}. ${n.q}</div>
                                    <div class="text-purple-600 font-bold mt-1">✓ Đáp án: ${n.ans}</div>
                                    <div class="text-slate-500 mt-0.5">${n.step}</div>
                                </div>
                            `).join('');
                        }
                        hasChanges = true;
                    }
                }

                // 6. ĐỒNG BỘ TỪ ĐIỂN ĐÃ LƯU
                if (Array.isArray(data.savedWords)) {
                    if (!state.savedWords) state.savedWords = [];
                    data.savedWords.forEach(sw => {
                        if (!state.savedWords.find(x => (x.en || '').toLowerCase() === (sw.en || '').toLowerCase())) {
                            state.savedWords.push(sw);
                            hasChanges = true;
                        }
                    });
                }

                if (hasChanges || isLiveUpdate) {
                    this.saveToLocalStorage();
                    updateDashboardMetrics();
                    renderLearnedVocabList();
                    renderSavedVocabList();

                    const learnedBadge = document.getElementById('learnedWordsBadge');
                    if (learnedBadge) learnedBadge.textContent = learnedVocabItems.length;
                    const headerLearned = document.getElementById('vocabHeaderLearned');
                    if (headerLearned) headerLearned.textContent = state.vocabLearned;
                    const dictationBadge = document.getElementById('dictationDoneCount');
                    if (dictationBadge) dictationBadge.textContent = `${state.dictationDone} câu`;
                }

                if (isLiveUpdate && eventMeta) {
                    this.playChime();
                    const senderName = eventMeta.senderDeviceName || 'Thiết bị khác';
                    const word = eventMeta.lastActionWord;
                    const xp = eventMeta.xpGained || 5;

                    let msg = `⚡ [${senderName}] vừa cập nhật "${word}" (+${xp} XP)! Thiết bị này đã tự động đồng bộ.`;
                    if (!word || word === 'Toàn bộ dữ liệu') {
                        msg = `⚡ [${senderName}] vừa đồng bộ bài học (+${xp} XP)! Đã tự động cập nhật.`;
                    }
                    showToast(msg);
                    this.flashSyncButton(senderName);
                }
            },

            broadcastLearning(action, lastActionWord = '', xpGained = 5) {
                this.saveToLocalStorage();
                updateDashboardMetrics();

                if (!currentUserAccount) return;

                const payload = {
                    deviceId: this.deviceId,
                    deviceName: this.deviceName,
                    action: action,
                    lastActionWord: lastActionWord,
                    xpGained: xpGained,
                    state: {
                        xp: state.xp,
                        vocabLearned: Math.max(state.vocabLearned, learnedVocabItems.length),
                        dictationDone: state.dictationDone,
                        grammarDone: state.grammarDone || 0,
                        readDone: state.readDone || 0,
                        listenDone: state.listenDone || 0,
                        studyMinutes: state.studyMinutes || 0
                    },
                    learnedVocabItems: learnedVocabItems,
                    savedVocabItems: savedVocabItems,
                    takeNotesList: takeNotesList,
                    savedGrammarNotes: savedGrammarNotes,
                    savedWords: state.savedWords || []
                };

                // Đẩy sang Local Server
                fetch('/api/study-sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                })
                .then(r => r.json())
                .then(res => {
                    if (res && res.data && res.data.streakInfo) {
                        renderStreakWeekDays(res.data.streakInfo);
                    }
                })
                .catch(() => {});
            },

            forcePullLatest() {
                if (!currentUserAccount) {
                    showToast('ℹ️ Vui lòng đăng nhập để đồng bộ tiến độ.');
                    return;
                }
                fetch('/api/study-sync')
                    .then(r => r.json())
                    .then(res => {
                        if (res && res.data) {
                            this.handleIncomingData(res.data, true, {
                                senderDeviceName: res.data.lastSourceDevice || 'Máy chủ',
                                lastActionWord: 'Toàn bộ dữ liệu',
                                xpGained: 0
                            });
                            if (res.data.streakInfo) {
                                renderStreakWeekDays(res.data.streakInfo);
                            }
                            showToast('✅ Đã kiểm tra và đồng bộ dữ liệu mới nhất!');
                        }
                    })
                    .catch(() => {
                        showToast('ℹ️ Đang hoạt động ở chế độ Offline.');
                    });
            },

            playChime() {
                try {
                    const ctx = new (window.AudioContext || window.webkitAudioContext)();
                    const osc1 = ctx.createOscillator();
                    const osc2 = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc1.type = 'sine'; osc2.type = 'sine';
                    osc1.frequency.setValueAtTime(587.33, ctx.currentTime);
                    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.1);
                    gain.gain.setValueAtTime(0.1, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
                    osc1.connect(gain); osc2.connect(gain); gain.connect(ctx.destination);
                    osc1.start(); osc2.start(ctx.currentTime + 0.1);
                    osc1.stop(ctx.currentTime + 0.1); osc2.stop(ctx.currentTime + 0.35);
                } catch(e) {}
            },

            flashSyncButton(fromDevice) {
                const btn = document.getElementById('topSyncStatusBtn');
                const txt = document.getElementById('topSyncStatusText');
                if (!btn) return;
                btn.classList.add('ring-2', 'ring-emerald-400', 'bg-emerald-100');
                if (txt) txt.textContent = `Vừa nhận từ ${fromDevice}!`;
                setTimeout(() => {
                    btn.classList.remove('ring-2', 'ring-emerald-400', 'bg-emerald-100');
                    if (txt) txt.textContent = 'Đồng bộ Realtime';
                }, 3500);
            },

            updateUIStatus() {
                const dot = document.getElementById('syncPulseDot');
                const txt = document.getElementById('topSyncStatusText');
                if (dot) dot.className = this.isConnected ? 'w-2 h-2 rounded-full bg-emerald-500 animate-pulse' : 'w-2 h-2 rounded-full bg-amber-400';
                if (txt) txt.textContent = this.isConnected ? 'Đồng bộ Realtime' : 'Đang kết nối';

                const modalDot = document.getElementById('modalSyncStatusDot');
                const modalLbl = document.getElementById('modalSyncStatusLabel');
                const modalBadge = document.getElementById('modalCurrentDeviceBadge');
                const modalCount = document.getElementById('modalSyncVocabCount');
                const modalXp = document.getElementById('modalSyncXpCount');
                const modalTime = document.getElementById('modalSyncLastTime');

                if (modalDot) modalDot.className = this.isConnected ? 'w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping' : 'w-2.5 h-2.5 rounded-full bg-amber-400';
                if (modalLbl) modalLbl.textContent = this.isConnected ? 'ĐANG KẾT NỐI REAL-TIME TỰ ĐỘNG' : 'CHẾ ĐỘ OFFLINE LOCAL';
                if (modalBadge) modalBadge.textContent = `Thiết bị này: ${this.deviceName}`;
                if (modalCount) modalCount.textContent = `${learnedVocabItems.length} từ`;
                if (modalXp) modalXp.textContent = `${state.xp} XP`;
                if (modalTime) modalTime.textContent = new Date().toLocaleTimeString('vi-VN');
            }
        };

        window.StudySync = StudySync;

        function initAllAppViews() {
            try {
                StudySync.init();
                renderAllMascots();
                renderAllGrammarGroups();
                renderAllVocabGroups();
                renderDictationWorkspace();
                renderYouGlishScene();
                initTakeNotes();
                applyCurrentAccountToUI();
                renderDictionaryResult('economic');
                updateDashboardMetrics();
                renderLearnedVocabList();
                renderSavedVocabList();

                // Khởi tạo Lộ trình cá nhân, Chẩn đoán lỗ hổng & Bẫy đề thi kinh điển
                if (window.PersonalizedRoadmapEngine) {
                    PersonalizedRoadmapEngine.renderRoadmapView();
                }
                if (window.EtsAdaptiveScorer) {
                    EtsAdaptiveScorer.renderDashboardWidget();
                }
                if (window.TOEICTrapsEngine) {
                    TOEICTrapsEngine.init();
                }
                if (window.ListeningDashboard) {
                    ListeningDashboard.renderStats();
                }

                // Đồng bộ theme icon Sáng / Tối
                const isDark = document.documentElement.classList.contains('dark');
                const themeIcon = document.getElementById('themeIcon');
                if (themeIcon) {
                    themeIcon.className = isDark ? 'fa-solid fa-moon text-[15px] text-amber-300' : 'fa-regular fa-sun text-[15px]';
                }
            } catch (err) {
                console.error('App views initialization warning:', err);
            }
        }
        window.initAllAppViews = initAllAppViews;

        function setupTakeNotePasteListener() {
            const paperEditor = document.getElementById('takeNoteEditorPaper');
            if (paperEditor && !paperEditor._pasteListenerAttached) {
                paperEditor._pasteListenerAttached = true;
                paperEditor.addEventListener('paste', function (e) {
                    const items = (e.clipboardData || e.originalEvent?.clipboardData)?.items;
                    if (items) {
                        for (const item of items) {
                            if (item.type.indexOf('image') !== -1) {
                                e.preventDefault();
                                const file = item.getAsFile();
                                const reader = new FileReader();
                                reader.onload = function (evt) {
                                    const dataUrl = evt.target.result;
                                    const imgHtml = `
                                        <div class="my-2 text-center">
                                            <img src="${dataUrl}" alt="Ảnh dán clipboard" class="max-w-full h-auto rounded-xl border border-slate-200 mx-auto shadow-sm" style="max-height: 520px;" />
                                            <p class="text-xs text-slate-500 mt-1 italic">📷 Ảnh chụp màn hình dán trực tiếp</p>
                                        </div><p><br></p>
                                    `;
                                    document.execCommand('insertHTML', false, imgHtml);
                                    saveCurrentTakeNote();
                                    showToast('🖼️ Đã dán ảnh vào Sổ Take Note và tự động đồng bộ!');
                                };
                                reader.readAsDataURL(file);
                                return;
                            }
                        }
                    }
                });
            }
        }

        // Lắng nghe phím Escape để đóng nhanh cửa sổ Auth Modal
        window.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' || e.key === 'Esc') {
                closeAuthModal();
            }
        });

        // Khởi chạy Gatekeeper & Master Views NGAY LẬP TỨC khi DOM sẵn sàng (Zero-delay)
        
        // =========================================================================
        // MOBILE EXPERIENCE ENGINE (iOS & Android Virtual Keyboard & AudioContext)
        // =========================================================================
        function initMobileExperience() {
            // 1. Unlock AudioContext trên thiết bị di động (Mobile Autoplay Restriction)
            const unlockAudio = () => {
                try {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (AudioContext) {
                        if (!window._globalAudioCtx) {
                            window._globalAudioCtx = new AudioContext();
                        }
                        if (window._globalAudioCtx.state === 'suspended') {
                            window._globalAudioCtx.resume();
                        }
                    }
                    if (window.VocabGameWorkstation && window.VocabGameWorkstation.audioCtx && window.VocabGameWorkstation.audioCtx.state === 'suspended') {
                        window.VocabGameWorkstation.audioCtx.resume();
                    }
                } catch (e) {}
                window.removeEventListener('touchstart', unlockAudio);
                window.removeEventListener('pointerdown', unlockAudio);
            };
            window.addEventListener('touchstart', unlockAudio, { passive: true });
            window.addEventListener('pointerdown', unlockAudio, { passive: true });

            // 2. VisualViewport & Virtual Keyboard Resize Manager (iOS & Android)
            const handleViewportChange = () => {
                if (!window.visualViewport) return;
                const vh = window.visualViewport.height;
                const totalH = window.innerHeight;
                const isKeyboard = vh < totalH * 0.78;
                
                document.documentElement.style.setProperty('--mobile-visual-height', `${vh}px`);
                document.body.classList.toggle('keyboard-open', isKeyboard);

                const nav = document.getElementById('mobileBottomNav');
                if (nav) {
                    nav.style.display = isKeyboard ? 'none' : '';
                }
            };

            if (window.visualViewport) {
                window.visualViewport.addEventListener('resize', handleViewportChange);
                window.visualViewport.addEventListener('scroll', handleViewportChange);
                handleViewportChange();
            }

            // Fallback cho trình duyệt cũ
            window.addEventListener('focusin', (e) => {
                const tag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
                if (tag === 'input' || tag === 'textarea') {
                    document.body.classList.add('keyboard-open');
                    const nav = document.getElementById('mobileBottomNav');
                    if (nav) nav.style.display = 'none';
                }
            });

            window.addEventListener('focusout', (e) => {
                setTimeout(() => {
                    const active = document.activeElement;
                    const tag = active && active.tagName ? active.tagName.toLowerCase() : '';
                    if (tag !== 'input' && tag !== 'textarea') {
                        document.body.classList.remove('keyboard-open');
                        const nav = document.getElementById('mobileBottomNav');
                        if (nav) nav.style.display = '';
                    }
                }, 150);
            });
        }
        if (typeof window !== 'undefined') {
            window.initMobileExperience = initMobileExperience;
        }
    
        function bootstrapApplication() {
            try { initMobileExperience(); } catch(e) {}
            // Dọn dẹp an toàn các khóa tiến độ ngữ pháp cũ chưa gắn userId (tránh hiển thị nhầm 2% từ dữ liệu cache cũ)
            try {
                for (let i = localStorage.length - 1; i >= 0; i--) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith('grammar_progress_') && !key.startsWith('grammar_progress_acc-') && !key.startsWith('grammar_progress_guest_')) {
                        localStorage.removeItem(key);
                    }
                }
            } catch (e) {}

            UserAuthEngine.init();
            initAllAppViews();
            setupTakeNotePasteListener();
            if (typeof updateSanhAndSidebarVisibility === 'function') {
                updateSanhAndSidebarVisibility(!!currentUserAccount);
            }
            if (typeof initSidebarState === 'function') {
                initSidebarState();
            }
            if (typeof initGoogleIdentityServices === 'function') {
                initGoogleIdentityServices();
            }
            if (window.DailyTaskManager && typeof window.DailyTaskManager.render === 'function') {
                window.DailyTaskManager.render();
            }
            try {
                const path = (window.location && window.location.pathname) || '';
                const initialHash = window.location.hash.replace('#', '');
                if (initialHash && typeof switchTab === 'function' && typeof tabConfig !== 'undefined' && tabConfig[initialHash]) {
                    switchTab(initialHash);
                } else if (path.includes('/study') || path.includes('/match') || path === '/vocabulary') {
                    if (window.VocabularyEngine && typeof window.VocabularyEngine.init === 'function') {
                        window.VocabularyEngine.init();
                    }
                    return;
                }
            } catch(e) {}
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bootstrapApplication);
        } else {
            bootstrapApplication();
        }

        // Safeguard trên window.onload trong trường hợp có tài nguyên trễ
        window.onload = function () {
            try {
                if (!currentUserAccount) {
                    UserAuthEngine.init();
                }
                setupTakeNotePasteListener();
                // Đảm bảo các view cốt lõi đã có nội dung
                const vocabGrid = document.getElementById('vocabModeCardsContainer');
                if (vocabGrid && !vocabGrid.children.length) {
                    renderAllVocabGroups();
                }
                const gramGrid = document.getElementById('grammarAllGroupsContainer');
                if (gramGrid && !gramGrid.children.length) {
                    renderAllGrammarGroups();
                }
            } catch (err) {
                console.error('Window onload safeguard warning:', err);
            }
        };