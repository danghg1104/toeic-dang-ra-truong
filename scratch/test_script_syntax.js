        // Application State
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

        // Cute Orange Tabby Cat hanging on a wooden branch with a Blue Bird on its head (matching Image 2)
        function getOwlSVG(variant = 'wave') {
            let badgeLabel = '';
            if (variant === 'grammar') badgeLabel = 'GRAMMAR';
            else if (variant === 'listening') badgeLabel = 'LISTEN';
            else if (variant === 'reading') badgeLabel = 'READING';
            else if (variant === 'mock') badgeLabel = 'MOCK 600+';

            return `
            <svg viewBox="0 0 140 150" class="w-full h-full overflow-visible" fill="none" xmlns="http://www.w3.org/2000/svg">
                <!-- Soft Circular Warm Halo -->
                <circle cx="70" cy="74" r="56" fill="#F9F1DC" opacity="0.85"/>
                <!-- Long Hanging Striped Tail -->
                <path d="M55 92 C52 112, 51 130, 54 143 C59 146, 67 145, 69 140 C69 124, 68 106, 67 92 Z" fill="#F38B2A"/>
                <path d="M54 100 H68 M53 109 H68 M53 118 H69 M53 127 H69 M54 136 H68" stroke="#D9532F" stroke-width="5" stroke-linecap="round"/>

                <!-- Chubby Orange Cat Body Hanging Below Branch -->
                <path d="M45 60 L93 59 L88 101 C86 106, 73 106, 66 101 C57 105, 46 103, 43 95 Z" fill="#F59223"/>
                <!-- Darker Watercolor Belly Patch -->
                <ellipse cx="77" cy="84" rx="11" ry="16" fill="#E07318" opacity="0.65"/>

                <!-- Side Tabby Stripes -->
                <path d="M45 69 H53 M44 77 H52" stroke="#D9532F" stroke-width="4" stroke-linecap="round"/>
                <path d="M83 68 H91 M83 76 H91 M84 84 H90" stroke="#D9532F" stroke-width="4" stroke-linecap="round"/>

                <!-- White Dangling Hind Paws -->
                <path d="M43 92 C41 102, 46 108, 52 106 C56 104, 56 98, 54 93 Z" fill="#FFFDF9" stroke="#0D3166" stroke-width="2"/>
                <path d="M75 98 C77 108, 84 111, 89 107 C92 103, 91 97, 89 93 Z" fill="#FFFDF9" stroke="#0D3166" stroke-width="2"/>

                <!-- Cat Head Peeking Over Branch -->
                <path d="M49 50 C47 34, 50 24, 50 19 L59 26 C65 24, 73 24, 79 26 L88 19 C89 25, 92 35, 89 50 Z" fill="#F59223"/>
                <!-- Inner White Ears -->
                <polygon points="51,22 50,29 56,27" fill="#FFFDF9"/>
                <polygon points="87,22 88,29 82,27" fill="#FFFDF9"/>

                <!-- Forehead Tabby Stripes -->
                <path d="M64 25 V31 M69.5 24 V31 M75 25 V31" stroke="#D9532F" stroke-width="3.2" stroke-linecap="round"/>

                <!-- Big Expressive Dark-Navy Eyes with White Rim -->
                <circle cx="59.5" cy="37.5" r="7.5" fill="#FFFDF9"/>
                <circle cx="59.5" cy="37.5" r="5.8" fill="#0D3166"/>
                <circle cx="79" cy="37.5" r="7.5" fill="#FFFDF9"/>
                <circle cx="79" cy="37.5" r="5.8" fill="#0D3166"/>

                <!-- Tiny Pink Nose & Pouty Mouth -->
                <ellipse cx="69.2" cy="41.2" rx="2.5" ry="1.7" fill="#E11D48"/>
                <path d="M66.2 44.5 L69.2 42.6 L72.2 44.5" stroke="#0D3166" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>

                <!-- Horizontal White Wooden Branch with Sketch Wood Grain -->
                <path d="M8 49 H132 L127 60 L13 62 Z" fill="#FAF5E8"/>
                <path d="M8 49 H132 M13 62 L127 60 L114 64" stroke="#0D3166" stroke-width="2.2" stroke-linecap="round"/>
                <path d="M18 54 Q35 58 49 53 M78 56 Q95 52 112 57" stroke="#0D3166" stroke-width="1.2" opacity="0.65" fill="none"/>

                <!-- White Front Paws Gripping Branch -->
                <ellipse cx="48" cy="50" rx="8.5" ry="6" fill="#FFFDF9" stroke="#0D3166" stroke-width="1.8"/>
                <path d="M46 53.5 V55.5 M49.5 53.5 V55.5" stroke="#0D3166" stroke-width="1.4" stroke-linecap="round"/>
                <ellipse cx="91" cy="50" rx="8" ry="5.8" fill="#FFFDF9" stroke="#0D3166" stroke-width="1.8"/>
                <path d="M89 53.5 V55.5 M92.5 53.5 V55.5" stroke="#0D3166" stroke-width="1.4" stroke-linecap="round"/>

                <!-- Tiny Blue Bird Perched on Top of Cat's Head -->
                <line x1="68.5" y1="20" x2="68.5" y2="25" stroke="#0D3166" stroke-width="1.5"/>
                <line x1="72" y1="20" x2="72" y2="25" stroke="#0D3166" stroke-width="1.5"/>
                <ellipse cx="70.2" cy="14" rx="6.2" ry="6.8" fill="#0891B2"/>
                <circle cx="68" cy="12" r="2" fill="#FFFDF9"/>
                <circle cx="68" cy="12" r="1" fill="#0D3166"/>
                <circle cx="72.5" cy="12" r="2" fill="#FFFDF9"/>
                <circle cx="72.5" cy="12" r="1" fill="#0D3166"/>
                <polygon points="69,13.8 71.5,13.8 70.2,16" fill="#F97316"/>

                ${badgeLabel ? `
                <rect x="44" y="72" width="50" height="15" rx="7.5" fill="#FFFDF9" stroke="#0D3166" stroke-width="1.5"/>
                <text x="69" y="82" text-anchor="middle" fill="#0D3166" font-size="7.5" font-weight="800">${badgeLabel}</text>
                ` : ''}
            </svg>`;
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
                mascotText: 'Cùng Đăng chinh phục tiếng Anh mỗi ngày!',
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
                mascotText: 'Cùng Đăng chinh phục ngữ pháp & PassToeic!',
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
                mascotText: 'Cùng Đăng học từ mới mỗi ngày nhé!',
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
                mascotText: 'Cùng Đăng luyện nghe đều mỗi ngày!',
                feedbackText: 'Ghi chú mẹo nghe',
                owlVariant: 'listening'
            },
            'doc': {
                activeClass: 'nav-active-read',
                mascotText: 'Cùng Đăng đọc hiểu tốt hơn mỗi ngày!',
                feedbackText: 'Ghi chú từ vựng bài đọc',
                owlVariant: 'reading'
            },
            'thi-thu': {
                activeClass: 'nav-active-mock',
                mascotText: 'Cùng Đăng giữ phong độ trước ngày thi!',
                feedbackText: 'Ghi chú lỗi sai đề thi',
                owlVariant: 'mock'
            },
            'bay-de-thi': {
                activeClass: 'nav-active-traps',
                mascotText: 'Nắm chắc bẫy đề thi kinh điển 2023 - 2027!',
                feedbackText: 'Ghi chú bẫy hay sai',
                owlVariant: 'mock'
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

        function switchTab(tabId) {
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

            // Nếu khách chưa đăng nhập mà bấm vào các tab học chuyên sâu -> gợi ý đăng nhập để bảo toàn tiến độ
            if (!currentUserAccount && tabId !== 'hom-nay') {
                openAuthModal('login');
                showToast('🔒 Vui lòng đăng nhập hoặc tạo tài khoản để học chuyên sâu!');
                return;
            }

            state.currentTab = tabId;
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
            if (tabId === 'nghe' && window.ListeningDashboard) {
                ListeningDashboard.renderStats();
            }
            if (tabId === 'luyen-nghe-chinh-ta' && typeof renderDictationWorkspace === 'function') {
                renderDictationWorkspace();
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

            // Đồng bộ trạng thái sáng đèn trên Thanh điều hướng đáy Điện thoại (Mobile Bottom Nav)
            document.querySelectorAll('.mob-nav-item').forEach(btn => {
                btn.className = 'mob-nav-item flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 dark:text-slate-400 font-semibold transition';
            });
            const activeMobBtn = document.getElementById(`mob-nav-${tabId}`) || document.getElementById('mob-nav-more');
            if (activeMobBtn) {
                activeMobBtn.className = 'mob-nav-item flex flex-col items-center justify-center py-1 rounded-xl text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-slate-800 font-extrabold transition';
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
                if (sanhGuestLoginBtn) sanhGuestLoginBtn.classList.add('hidden');
                if (sanhDropdownWrapper) sanhDropdownWrapper.classList.remove('hidden');
            } else {
                if (mobileTopAvatar) mobileTopAvatar.classList.add('hidden');
                if (mobileUnauthBtn) mobileUnauthBtn.classList.remove('hidden');
                if (sanhGuestLoginBtn) sanhGuestLoginBtn.classList.remove('hidden');
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
                    if (reopenBtn) reopenBtn.classList.add('hidden');
                    if (collapseBtn) {
                        collapseBtn.setAttribute('aria-expanded', 'true');
                        collapseBtn.setAttribute('aria-label', 'Thu gọn thanh bên');
                    }
                } else {
                    aside.classList.add('sb-collapsed');
                    aside.setAttribute('inert', '');
                    if (main) main.classList.add('sb-main-collapsed');
                    if (reopenBtn) {
                        reopenBtn.classList.remove('hidden');
                        reopenBtn.setAttribute('aria-expanded', 'false');
                        reopenBtn.setAttribute('aria-label', 'Mở thanh bên');
                    }
                    if (collapseBtn) {
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
                    if (reopenBtn) reopenBtn.classList.add('hidden');
                    if (collapseBtn) collapseBtn.setAttribute('aria-expanded', 'true');
                } else {
                    aside.classList.add('-translate-x-full');
                    aside.setAttribute('inert', '');
                    if (backdrop) backdrop.classList.add('hidden');
                    document.body.classList.remove('overflow-hidden'); // Mở khóa cuộn nền khi đóng
                    if (reopenBtn) {
                        reopenBtn.classList.remove('hidden');
                        reopenBtn.setAttribute('aria-expanded', 'false');
                        reopenBtn.setAttribute('aria-label', 'Mở thanh bên');
                    }
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
        });

        // Dark / Light Theme Toggle
        function toggleDarkMode() {
            const htmlEl = document.documentElement;
            htmlEl.classList.toggle('dark');
            const icon = document.getElementById('themeIcon');
            if (htmlEl.classList.contains('dark')) {
                icon.className = 'fa-solid fa-moon text-[15px] text-amber-300';
                showToast('Đã chuyển sang giao diện Tối 🌙');
            } else {
                icon.className = 'fa-regular fa-sun text-[15px]';
                showToast('Đã chuyển sang giao diện Sáng ☀️');
            }
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
                        levelBadge = '<span class="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">🌱 0-500</span>';
                    } else if (t.level === '600+') {
                        levelBadge = '<span class="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold border border-indigo-200">🚀 600+</span>';
                    } else {
                        levelBadge = '<span class="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-extrabold border border-amber-200">👑 800+</span>';
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
                                <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">${tagsText}</span>
                                ${levelBadge}
                            </div>
                        </div>
                        <div class="my-3">
                            <div class="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1.5">
                                <span>Tiến độ chính xác</span>
                                <span class="text-purple-600 font-bold">${pct}% (${correctCount}/${totalQ})</span>
                            </div>
                            <div class="w-full h-1.5 bg-slate-200/80 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300" style="width: ${pct}%"></div>
                            </div>
                        </div>
                        <div class="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                            <span class="text-[11.5px] font-medium text-slate-500">${answeredCount}/${totalQ} câu</span>
                            <div class="flex items-center gap-1.5">
                                <button onclick="GrammarEngine.navigateToTheory('${slug}')" class="px-2.5 py-1.5 rounded-full bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold transition" title="Xem lý thuyết chuyên sâu">Lý thuyết</button>
                                <button onclick="GrammarEngine.navigateToPractice('${slug}')" class="px-3.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-[11.5px] font-bold flex items-center gap-1 shadow-sm transition" title="Luyện ngay ${totalQ} câu">
                                    <span>Luyện ngay</span>
                                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
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
                                    <span class="px-2 py-0.5 rounded-full ${group.badgeColor || 'bg-purple-100 text-purple-700'} text-[10px] font-bold">${group.badge || 'Trọng tâm'}</span>
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
                                <p class="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed my-2">
                                    Luyện câu hỏi ngẫu nhiên từ các chủ đề trong <strong class="text-slate-800 dark:text-white">${group.title}</strong>.
                                </p>
                                <div class="flex items-center gap-2 pt-1">
                                    <button onclick="startQuickQuiz('grammar', 'Ôn tập 20 câu: ${group.title.replace(/'/g, "\\'")}', 20)" class="px-3 py-1.5 rounded-full bg-purple-600 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm">
                                        <i class="fa-solid fa-check text-[9px]"></i> 20 câu
                                    </button>
                                    <button onclick="startQuickQuiz('grammar', 'Ôn tập 30 câu: ${group.title.replace(/'/g, "\\'")}', 30)" class="px-3 py-1.5 rounded-full bg-white text-slate-700 text-[11px] font-bold border border-purple-100 hover:bg-purple-50">30 câu</button>
                                    <button onclick="startQuickQuiz('grammar', 'Ôn tập 50 câu: ${group.title.replace(/'/g, "\\'")}', 50)" class="px-3 py-1.5 rounded-full bg-white text-slate-700 text-[11px] font-bold border border-purple-100 hover:bg-purple-50">50 câu</button>
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
                                    <span class="px-2.5 py-1 rounded-full bg-white text-slate-700 text-[10.5px] font-bold shadow-sm">TOEIC</span>
                                </div>
                                <p class="text-[11.5px] text-slate-600 dark:text-slate-300 leading-relaxed my-2">
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

            const inactiveClass = 'pb-2.5 border-b-2 border-transparent text-slate-600 dark:text-slate-400 hover:text-purple-600 font-semibold text-[13px] flex items-center gap-2';
            const activeClass = 'pb-2.5 border-b-2 border-purple-600 text-purple-700 dark:text-purple-400 font-bold text-[13px] flex items-center gap-2';

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
                    const matchSearch = !searchQ || deckName.toLowerCase().includes(searchQ) || grp.groupName.toLowerCase().includes(searchQ);
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

                    let statusBadge = '<span class="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold">Mới</span>';
                    if (isMastered) {
                        statusBadge = '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">✓ Đã thuộc 100%</span>';
                    } else if (isStudying) {
                        statusBadge = `<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">Đang học ${deckPct}%</span>`;
                    }

                    // Level Tier Badge
                    const dTier = vocabDeckTiers[deckName] || 'tier_600';
                    let tierBadge = '<span class="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 text-[10px] font-extrabold">🚀 600+ Cốt lõi Ra trường</span>';
                    if (dTier === 'tier_0_500') {
                        tierBadge = '<span class="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 text-[10px] font-extrabold">🌱 0 - 500 Căn bản & Mất gốc</span>';
                    } else if (dTier === 'tier_800') {
                        tierBadge = '<span class="px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 text-[10px] font-extrabold">👑 800+ Điểm cao & Học thuật</span>';
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
                                <div class="flex items-center justify-between text-[11px] font-medium text-slate-500 mb-1.5">
                                    <span>Tiến độ đã học</span>
                                    <span class="text-indigo-600 font-bold">${deckPct}%</span>
                                </div>
                                <div class="w-full h-1.5 bg-slate-200/80 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-300" style="width: ${deckPct}%"></div>
                                </div>
                            </div>
                            <div class="flex items-center justify-between pt-1">
                                <span class="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10.5px] font-semibold">
                                    <i class="fa-solid fa-layer-group mr-1 text-slate-400"></i>${learnedCount}/${totalInDeck} từ
                                </span>
                                <button onclick="event.stopPropagation(); if(window.VocabularyEngine){ VocabularyEngine.navigateToStudy('${topicSlug}'); } else { openVocabFlashcardModal('${safeDeckName}'); }" class="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white text-[11.5px] font-bold flex items-center gap-1.5 shadow-sm transition">
                                    <span>Học bài</span>
                                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
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
                            <span class="text-xs font-medium text-slate-500 ml-1">${filteredDecks.length} bộ từ</span>
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
                    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
                    audioScript: "Look at the picture. A. She is typing on a laptop. B. She is pouring a cup of coffee. C. She is boarding a train. D. She is hanging a calendar on the wall.",
                    q: "🎧 [Part 1: Photographs] Nghe băng đọc và chọn câu mô tả đúng nhất bức tranh người phụ nữ tại bàn làm việc:",
                    options: [
                        "A. She is typing on a laptop.",
                        "B. She is pouring a cup of coffee.",
                        "C. She is boarding a train.",
                        "D. She is hanging a calendar on the wall."
                    ],
                    ans: 0,
                    steps: [
                        "1. Phân tích hành động: Nhân vật đang nhìn màn hình và gõ phím tại bàn làm việc.",
                        "2. Loại trừ bẫy: B, C, D nhắc tới các vật không xuất hiện trong khung hình.",
                        "3. Kết luận: Chọn A (She is typing on a laptop)."
                    ]
                },
                {
                    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
                    audioScript: "Look at the picture. A. Colleagues are gathered around a table. B. They are packing boxes for moving. C. An employee is presenting on a chalkboard. D. The office furniture is being repainted.",
                    q: "🎧 [Part 1: Photographs] Nghe băng đọc và chọn câu mô tả đúng nhất bức tranh nhóm đồng nghiệp:",
                    options: [
                        "A. Colleagues are gathered around a table.",
                        "B. They are packing boxes for moving.",
                        "C. An employee is presenting on a chalkboard.",
                        "D. The office furniture is being repainted."
                    ],
                    ans: 0,
                    steps: [
                        "1. Bối cảnh: Các đồng nghiệp đang ngồi thảo luận quanh bàn.",
                        "2. Loại trừ: B, C, D đều nhắc tới các hành động không có thật trong hình.",
                        "3. Kết luận: Chọn A."
                    ]
                },
                {
                    image: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
                    audioScript: "Look at the picture. A. Vehicles are being parked along the curb. B. Some cars are parked next to the sidewalk. C. A driver is repairing an engine. D. Traffic is being directed by an officer.",
                    q: "🎧 [Part 1: Photographs] Chọn câu mô tả đúng bức tranh đường phố tĩnh:",
                    options: [
                        "A. Vehicles are being parked along the curb.",
                        "B. Some cars are parked next to the sidewalk.",
                        "C. A driver is repairing an engine.",
                        "D. Traffic is being directed by an officer."
                    ],
                    ans: 1,
                    steps: [
                        "1. Tranh tĩnh không người: Bẫy (A) dùng 'being parked' diễn tả hành động đang đỗ -> SAI.",
                        "2. Trạng thái tĩnh: (B) 'are parked' mô tả xe đã đỗ sẵn -> ĐÚNG.",
                        "3. Kết luận: Chọn B."
                    ]
                },
                {
                    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=800&q=80",
                    audioScript: "Look at the picture. A. Cyclists are riding across a bridge. B. Bicycles have been secured to a metal rack. C. A mechanic is assembling bicycle pedals. D. Helmets are hanging from the handlebars.",
                    q: "🎧 [Part 1: Photographs] Chọn câu mô tả đúng nhất hình ảnh xe đạp ven đường:",
                    options: [
                        "A. Cyclists are riding across a bridge.",
                        "B. Bicycles have been secured to a metal rack.",
                        "C. A mechanic is assembling bicycle pedals.",
                        "D. Helmets are hanging from the handlebars."
                    ],
                    ans: 1,
                    steps: [
                        "1. Tranh không có người lái xe: Loại A và C.",
                        "2. Trạng thái tĩnh: Bicycles have been secured to a metal rack (Xe đạp đã được dựng vào giá).",
                        "3. Kết luận: Chọn B."
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
                        <i class="fa-solid ${active ? 'fa-volume-high text-indigo-600' : 'fa-play text-slate-300'} text-[11px] shrink-0"></i>
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
                showToast('⚠️ Vui lòng đăng nhập để đọc truyện chêm từ vựng!');
                if (window.UserAuthEngine) window.UserAuthEngine.showForcedGatekeeper();
                return;
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
            }
            renderTakeNoteSidebarList();
            loadActiveTakeNoteIntoEditor();
        }

        function persistTakeNotes() {
            try {
                localStorage.setItem('cung_dang_take_notes_v1', JSON.stringify(takeNotesList));
            } catch (e) {}
        }

        function filterTakeNoteTag(tag, btnEl) {
            currentNoteTagFilter = tag;
            document.querySelectorAll('.tn-tag-btn').forEach(b => {
                b.className = 'tn-tag-btn px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-bold';
            });
            btnEl.className = 'tn-tag-btn px-2.5 py-1 rounded-lg bg-amber-600 text-white text-[11px] font-bold';
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
                            <span class="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-extrabold">${n.category}</span>
                            <span class="text-[10px] text-slate-400">${n.updatedAt}</span>
                        </div>
                        <div class="text-[13px] font-extrabold text-slate-900 dark:text-white truncate">${n.title || 'Trang ghi chú chưa đặt tên'}</div>
                        <div class="text-[11px] text-slate-500 truncate mt-0.5">${plainPreview || 'Trang giấy trống...'}</div>
                    </div>
                `;
            }).join('');
        }

        function selectTakeNotePage(id) {
            activeNoteId = id;
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
                    <span class="text-[10px] text-slate-400">(${f.sizeFormatted})</span>
                    ${f.isPdf || (f.badge && f.badge.includes('PDF'))
                        ? `<button onclick="openExistingPdfInStudio('${f.fileId || ''}', '${escapeHtmlText(f.name)}', '${f.blockId}')" class="text-[11px] font-extrabold text-rose-600 hover:underline" title="Mở trong PDF Studio tương tác">⚡ Mở PDF Studio</button>`
                        : `<button onclick="scrollToImportedDoc('${f.blockId}')" class="text-[11px] font-bold text-blue-600 hover:underline" title="Di chuyển tới nội dung file này">Xem & Sửa</button>`
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
                    const arrayBuffer = await file.arrayBuffer();
                    extractedHtml = await parseWordFileToCleanHtml(arrayBuffer, ext, fileName);
                }
                // 2. PDF (.pdf) -> Chuyên biệt với Interactive PDF Studio & IndexedDB binary caching
                else if (ext === 'pdf' || file.type === 'application/pdf') {
                    badgeLabel = '📕 PDF';
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
                else if (['xlsx', 'xls', 'csv'].includes(ext) && window.XLSX) {
                    badgeLabel = '📗 EXCEL';
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
                                <span class="px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-900 text-[11px] font-extrabold">${badgeLabel}</span>
                                <strong class="text-sm text-slate-900 dark:text-white">${fileName}</strong>
                                <span class="text-[11px] text-slate-400">(${sizeFormatted})</span>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">✏️ Đọc & Chỉnh sửa trực tiếp</span>
                                <button onclick="removeImportedDocBlock('${blockId}')" class="px-2 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 text-[11px] font-bold">Xóa khối file</button>
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
                    <button onclick="togglePdfVisualCanvases('${blockId}')" class="px-3 py-1 rounded-lg bg-white hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-[11px] shadow-sm transition">Ẩn/Hiện trang ảnh PDF gốc</button>
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
                        <div contenteditable="false" class="flex items-center justify-between text-[11px] font-extrabold text-slate-500 border-b border-slate-200 pb-1.5 mb-2">
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
                        author: 'Cùng Đăng ra trường',
                        subject: 'Tài liệu & Ghi chú ôn thi TOEIC'
                    },
                    pageSize: 'A4',
                    pageMargins: [40, 48, 40, 48],
                    header: function(currentPage, pageCount) {
                        return {
                            text: `${note.title || 'Ghi chú'} — Cùng Đăng ra trường`,
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

        function openFullPartPracticeModal(partNum) {
            if (!currentUserAccount) {
                showToast('⚠️ Vui lòng đăng nhập hoặc tạo tài khoản để làm trọn vẹn Part ' + partNum + '!');
                if (window.UserAuthEngine) window.UserAuthEngine.showForcedGatekeeper();
                return;
            }
            const partCounts = { 1: 6, 2: 25, 3: 12, 4: 12, 5: 30, 6: 16, 7: 20 };
            const count = partCounts[partNum] || 20;
            const type = partNum <= 4 ? 'listening' : 'reading';
            const title = `Trọn vẹn TOEIC Part ${partNum} (${count} câu chuẩn ETS)`;
            startQuickQuiz(type, title, count);
        }

        let activeQuizList = [];
        let activeQuizIndex = 0;
        let activeQuizType = 'grammar';

        function startQuickQuiz(type, title, count = 50) {
            if (!currentUserAccount) {
                if (window.currentUserAccount) currentUserAccount = window.currentUserAccount;
                else if (typeof window.getCurrentUser === 'function') currentUserAccount = window.getCurrentUser();
            }
            if (!currentUserAccount) {
                showToast('⚠️ Vui lòng đăng nhập hoặc tạo tài khoản để làm bài kiểm tra!');
                if (window.UserAuthEngine) window.UserAuthEngine.showForcedGatekeeper();
                return;
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
            } else if (type === 'listening' || type.startsWith('listening')) {
                // Định tuyến thông minh theo Part nghe từ ListeningDatabaseV2 (Chuẩn ETS 2026)
                if (window.ListeningDatabaseV2) {
                    if (type === 'listening_part1' || title.toLowerCase().includes('part 1')) {
                        questionsPool = [...window.ListeningDatabaseV2.getFlattenedQuestions(1)];
                    } else if (type === 'listening_part2' || title.toLowerCase().includes('part 2')) {
                        questionsPool = [...window.ListeningDatabaseV2.getFlattenedQuestions(2)];
                    } else if (type === 'listening_part3' || title.toLowerCase().includes('part 3')) {
                        questionsPool = [...window.ListeningDatabaseV2.getFlattenedQuestions(3)];
                    } else if (type === 'listening_part4' || title.toLowerCase().includes('part 4')) {
                        questionsPool = [...window.ListeningDatabaseV2.getFlattenedQuestions(4)];
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

            // Shuffle ngẫu nhiên
            for (let i = questionsPool.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [questionsPool[i], questionsPool[j]] = [questionsPool[j], questionsPool[i]];
            }

            activeQuizList = questionsPool.slice(0, count);
            activeQuizIndex = 0;

            document.getElementById('quizModalTitle').textContent = title;
            document.getElementById('quizCategoryBadge').textContent = `${type.toUpperCase().replace('_', ' · ')} · ${activeQuizList.length} CÂU HỎI THỰC CHIẾN`;

            renderQuizQuestion();
            const modal = document.getElementById('quizModal');
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }

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
                            mode: 'practice',
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
                                    <thead class="bg-teal-100/70 dark:bg-slate-700 text-teal-950 dark:text-teal-200 uppercase text-[10px] font-bold">
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
                btn.className = 'w-full text-left px-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-400 font-semibold text-[13px] text-slate-700 dark:text-slate-200 transition flex items-center justify-between cursor-pointer';
                
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
                            <span class="text-xs sm:text-[13px] leading-relaxed font-semibold">${opt}</span>
                        </div>
                        ${optIsCorrect ? '<i class="fa-solid fa-circle-check text-emerald-600 text-base shrink-0 ml-2"></i>' : (optIsSelected && !optIsCorrect ? '<i class="fa-solid fa-circle-xmark text-rose-600 text-base shrink-0 ml-2"></i>' : '')}
                    `;
                });

                if (isPart2) {
                    document.getElementById('quizQuestionText').innerHTML = `
                        <div class="space-y-1">
                            <div class="text-[11px] font-bold uppercase tracking-wider text-fuchsia-600 dark:text-fuchsia-400 flex items-center gap-1.5">
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

            // Rich Explanation with Trap Analysis & Evidence Quote
            const exp = document.getElementById('quizExplanationBox');
            const steps = item.steps || (item.explanation_vi ? [item.explanation_vi] : [item.explain || '']);
            const stepsHtml = steps.map(s => `<div class="py-0.5 leading-relaxed">• ${s}</div>`).join('');
            
            exp.innerHTML = `
                <div class="font-extrabold ${isCorrect ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'} flex items-center gap-1.5 text-xs">
                    <i class="fa-solid ${isCorrect ? 'fa-circle-check text-emerald-500' : 'fa-lightbulb text-amber-500'}"></i>
                    <span>${isCorrect ? 'Chính xác (+10 XP)!' : 'Chưa đúng rồi!'} Phân tích đáp án chuẩn ETS:</span>
                </div>
                ${item.trap_type ? `
                    <div class="text-[11px] font-bold text-amber-800 dark:text-amber-300 bg-amber-100/60 dark:bg-amber-950/40 px-2.5 py-1 rounded-lg">
                        ⚠️ Nhận diện bẫy: <span class="font-normal">${item.trap_type}</span>
                    </div>
                ` : ''}
                ${item.correct_reason ? `
                    <div class="text-[11.5px] text-slate-700 dark:text-slate-300 bg-white/80 dark:bg-slate-700 p-2.5 rounded-xl border border-slate-200 dark:border-slate-600">
                        <strong class="text-teal-700 dark:text-teal-300">📌 Căn cứ trong bài:</strong> "${item.correct_reason}"
                    </div>
                ` : ''}
                <div class="pl-1 space-y-0.5 text-xs text-slate-700 dark:text-slate-300">${stepsHtml}</div>
                ${item.transcript ? `
                    <div class="pt-1.5 border-t border-slate-200/80 dark:border-slate-700">
                        <button type="button" onclick="const tc = document.getElementById('quizTranscriptViewer'); if (tc) tc.classList.toggle('hidden');" class="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
                            <i class="fa-solid fa-file-lines"></i>
                            <span>Xem toàn bộ Transcript & Dịch tiếng Việt</span>
                        </button>
                        <div id="quizTranscriptViewer" class="hidden mt-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11.5px] space-y-2">
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

        function closeQuizModal() {
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
        let savedVocabItems = [];

        function openVocabFlashcardModal(deckName) {
            if (!currentUserAccount) {
                showToast('⚠️ Vui lòng đăng nhập hoặc tạo tài khoản để học từ vựng Flashcard!');
                if (window.UserAuthEngine) window.UserAuthEngine.showForcedGatekeeper();
                return;
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
                        <div class="text-[11px] text-slate-500 mt-0.5">Collocation: ${w.collocation}</div>
                    </div>
                    <span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Đã thuộc</span>
                </div>
            `).join('');
        }

        function renderSavedVocabList() {
            const el = document.getElementById('savedWordsListContainer');
            if (!el) return;
            if (savedVocabItems.length === 0) {
                el.innerHTML = `<div class="col-span-2 text-center py-8 text-slate-400 text-xs">Sổ tay hiện đang trống. Bạn có thể bấm "Lưu từ" khi học Flashcard hoặc thêm từ mới ở trên.</div>`;
                return;
            }
            el.innerHTML = savedVocabItems.map(w => `
                <div class="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start justify-between gap-3">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="font-extrabold text-sm text-amber-900">${escapeHtml(w.word)}</span>
                            <button onclick="speakText('${escapeHtml(w.word.replace(/'/g, "\\'"))}', 'en-US')" class="w-6 h-6 rounded-full bg-amber-200 hover:bg-amber-300 text-amber-900 flex items-center justify-center transition" title="Nghe phát âm chuẩn">
                                <i class="fa-solid fa-volume-high text-[10px]"></i>
                            </button>
                        </div>
                        <div class="text-xs font-semibold text-slate-700 mt-1">${escapeHtml(w.meaning)}</div>
                    </div>
                    <span class="text-amber-600 text-xs shrink-0">🔖</span>
                </div>
            `).join('');
        }

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
                showToast('⚠️ Vui lòng đăng nhập hoặc tạo tài khoản để luyện nghe hội thoại thực tế!');
                if (window.UserAuthEngine) window.UserAuthEngine.showForcedGatekeeper();
                return;
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
                        <div class="text-[11px] text-teal-700">Bấm nút loa để nghe hội thoại chậm rõ chữ</div>
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
                showToast('⚠️ Vui lòng đăng nhập hoặc tạo tài khoản để đọc tin tức theo cấp độ!');
                if (window.UserAuthEngine) window.UserAuthEngine.showForcedGatekeeper();
                return;
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
                    <button onclick="state.readDone+=3; state.xp+=5; updateDashboardMetrics(); closeNewsInLevelsModal(); showToast('📖 Đã hoàn thành bài đọc News in Levels (+5 XP)!');" class="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">Hoàn thành bài đọc (+5 XP)</button>
                </div>
            `;
        }

        let currentTheoryTopicTitle = '';
        function openTheoryModal(partTitle) {
            if (!currentUserAccount) {
                showToast('⚠️ Vui lòng đăng nhập hoặc tạo tài khoản để xem lý thuyết & mẹo thi!');
                if (window.UserAuthEngine) window.UserAuthEngine.showForcedGatekeeper();
                return;
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
                        <span class="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 text-[10.5px] font-extrabold uppercase border border-purple-200 dark:border-purple-800/60">${data.badge}</span>
                        <h4 class="text-[16px] font-extrabold text-slate-900 dark:text-white mt-1.5">${data.title}</h4>
                        <p class="text-[12.5px] text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">${data.overview}</p>
                    </div>
                `;

                data.sections.forEach(sec => {
                    if (sec.type === 'formula') {
                        html += `
                            <div class="p-3.5 sm:p-4 rounded-2xl bg-indigo-50/80 dark:bg-slate-800/90 border border-indigo-200/80 dark:border-slate-700 space-y-2 mb-3">
                                <div class="font-extrabold text-indigo-950 dark:text-indigo-300 text-xs sm:text-[13px] flex items-center gap-1.5">
                                    <i class="fa-solid fa-square-root-variable text-indigo-600"></i>
                                    <span>${sec.heading}</span>
                                </div>
                                <div class="space-y-2 pt-1">
                                    ${sec.items.map(it => `
                                        <div class="p-2.5 sm:p-3 rounded-xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 shadow-xs">
                                            <div class="font-bold text-slate-800 dark:text-slate-100 text-xs">${it.title}</div>
                                            <div class="font-mono text-purple-700 dark:text-purple-300 font-bold text-[11.5px] my-1 p-1.5 rounded-lg bg-purple-50/60 dark:bg-purple-950/30 whitespace-pre-wrap">${it.formula}</div>
                                            <div class="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">${it.note}</div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                        `;
                    } else if (sec.type === 'signals') {
                        html += `
                            <div class="p-3.5 sm:p-4 rounded-2xl bg-teal-50/80 dark:bg-slate-800/90 border border-teal-200/80 dark:border-slate-700 space-y-2 mb-3">
                                <div class="font-extrabold text-teal-950 dark:text-teal-300 text-xs sm:text-[13px] flex items-center gap-1.5">
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
                                <div class="font-extrabold text-rose-950 dark:text-rose-300 text-xs sm:text-[13px] flex items-center gap-1.5">
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
                                <div class="font-extrabold text-amber-950 dark:text-amber-300 text-xs sm:text-[13px] flex items-center gap-1.5">
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
                                <div class="font-extrabold text-emerald-950 dark:text-emerald-300 text-xs sm:text-[13px] flex items-center gap-1.5">
                                    <i class="fa-solid fa-file-pen text-emerald-600"></i>
                                    <span>${sec.heading}</span>
                                </div>
                                <div class="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-slate-800 text-xs space-y-2">
                                    <div class="font-bold text-slate-800 dark:text-slate-100 leading-snug">${sec.q}</div>
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-600 dark:text-slate-300 text-[11.5px] font-semibold">
                                        ${sec.options.map(o => `<div class="p-1 rounded bg-slate-50 dark:bg-slate-800 px-2">${o}</div>`).join('')}
                                    </div>
                                    <div class="pt-1.5 border-t border-slate-100 dark:border-slate-800 text-emerald-700 dark:text-emerald-400 font-extrabold">
                                        ✓ Đáp án đúng: ${sec.ans}
                                    </div>
                                    <div class="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed bg-emerald-50/50 dark:bg-slate-800/50 p-2 rounded-lg">
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
                                <div class="flex items-center gap-2.5 font-extrabold text-slate-800 dark:text-slate-100 text-[13px]">
                                    <div class="w-7 h-7 rounded-xl bg-emerald-100 dark:bg-emerald-900/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                        <i class="fa-solid ${cfg.icon} text-xs"></i>
                                    </div>
                                    <div>
                                        <span class="block">${cfg.title}</span>
                                        <span class="text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400">Đã xong (${current}/${target})</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-extrabold text-[11px] flex items-center gap-1">
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
                                        <span class="font-extrabold text-[13px] block">${cfg.title}</span>
                                        <span class="text-[10.5px] font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">${cfg.desc} →</span>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <span class="text-slate-500 dark:text-slate-400 font-bold text-xs">${current}/${target}</span>
                                    <span class="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-extrabold text-[10.5px]">+${t.xp} XP</span>
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
        window.DailyTaskManager = DailyTaskManager;

        // Update UI metrics dynamically
        function updateDashboardMetrics() {
            const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
            const currentXp = state.xp || 0;
            const currentStreak = state.streak || 0;

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
            const sMinutes = state.studyMinutes || 0;
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

            // 4 Gauges Độ chính xác kỹ năng (Chuẩn Ảnh 2 - Hiển thị số liệu thật, không viết cứng số liệu ảnh)
            // 1. Ngữ pháp
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

            const gCircle = document.getElementById('skillAccuracyGrammarCircle');
            const gPct = document.getElementById('skillAccuracyGrammarPct');
            const gCount = document.getElementById('skillAccuracyGrammarCount');
            if (gAnswered > 0) {
                const gPctVal = Math.round((gCorrect / gAnswered) * 100);
                if (gPct) {
                    gPct.textContent = `${gPctVal}%`;
                    gPct.className = 'text-xs font-black text-purple-700 dark:text-purple-300';
                }
                if (gCircle) {
                    gCircle.className = 'relative w-14 h-14 rounded-full flex items-center justify-center bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-300 dark:border-purple-700 shadow-xs';
                }
                if (gCount) gCount.textContent = `${gAnswered}/1500`;
            } else {
                if (gPct) {
                    gPct.textContent = '——';
                    gPct.className = 'text-xs font-bold text-slate-400';
                }
                if (gCircle) {
                    gCircle.className = 'relative w-14 h-14 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700';
                }
                if (gCount) gCount.textContent = '0/1500';
            }

            // 2. Từ vựng
            const vCircle = document.getElementById('skillAccuracyVocabCircle');
            const vPct = document.getElementById('skillAccuracyVocabPct');
            const vCount = document.getElementById('skillAccuracyVocabCount');
            const vAnswered = state.vocabTotalAnswers || (vLearned > 0 ? vLearned : 0);
            const vCorrect = state.vocabCorrectAnswers || vLearned;
            if (vAnswered > 0) {
                const vPctVal = Math.round((vCorrect / vAnswered) * 100);
                if (vPct) {
                    vPct.textContent = `${vPctVal}%`;
                    vPct.className = 'text-xs font-black text-fuchsia-700 dark:text-fuchsia-300';
                }
                if (vCircle) {
                    vCircle.className = 'relative w-14 h-14 rounded-full flex items-center justify-center bg-fuchsia-50 dark:bg-fuchsia-950/40 border-2 border-fuchsia-300 dark:border-fuchsia-700 shadow-xs';
                }
                if (vCount) vCount.textContent = `${vAnswered}/4514`;
            } else {
                if (vPct) {
                    vPct.textContent = '——';
                    vPct.className = 'text-xs font-bold text-slate-400';
                }
                if (vCircle) {
                    vCircle.className = 'relative w-14 h-14 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700';
                }
                if (vCount) vCount.textContent = '0/4514';
            }

            // 3. Nghe
            const lCircle = document.getElementById('skillAccuracyListenCircle');
            const lPct = document.getElementById('skillAccuracyListenPct');
            const lCount = document.getElementById('skillAccuracyListenCount');
            if (lDone > 0) {
                const lPctVal = state.listenTotalAnswers ? Math.round((state.listenCorrectAnswers / state.listenTotalAnswers) * 100) : 100;
                if (lPct) {
                    lPct.textContent = `${lPctVal}%`;
                    lPct.className = 'text-xs font-black text-amber-700 dark:text-amber-300';
                }
                if (lCircle) {
                    lCircle.className = 'relative w-14 h-14 rounded-full flex items-center justify-center bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 shadow-xs';
                }
                if (lCount) lCount.textContent = `${lDone}/2100`;
            } else {
                if (lPct) {
                    lPct.textContent = '——';
                    lPct.className = 'text-xs font-bold text-slate-400';
                }
                if (lCircle) {
                    lCircle.className = 'relative w-14 h-14 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700';
                }
                if (lCount) lCount.textContent = '0/2100';
            }

            // 4. Đọc
            const rCircle = document.getElementById('skillAccuracyReadCircle');
            const rPct = document.getElementById('skillAccuracyReadPct');
            const rCount = document.getElementById('skillAccuracyReadCount');
            if (rDone > 0) {
                const rPctVal = state.readTotalAnswers ? Math.round((state.readCorrectAnswers / state.readTotalAnswers) * 100) : 100;
                if (rPct) {
                    rPct.textContent = `${rPctVal}%`;
                    rPct.className = 'text-xs font-black text-emerald-700 dark:text-emerald-300';
                }
                if (rCircle) {
                    rCircle.className = 'relative w-14 h-14 rounded-full flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-300 dark:border-emerald-700 shadow-xs';
                }
                if (rCount) rCount.textContent = `${rDone}/2100`;
            } else {
                if (rPct) {
                    rPct.textContent = '——';
                    rPct.className = 'text-xs font-bold text-slate-400';
                }
                if (rCircle) {
                    rCircle.className = 'relative w-14 h-14 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700';
                }
                if (rCount) rCount.textContent = '0/2100';
            }

            // Cập nhật danh sách nhiệm vụ hôm nay theo tiến độ thực tế
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
        let currentUserAccount = null;
        window.currentUserAccount = null;

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
            const streakCount = streakInfo?.streak || 0;

            if (title) title.textContent = `Streak ${streakCount} ngày`;
            if (streakVal) streakVal.textContent = `${streakCount} ngày`;

            const encourBody = document.getElementById('mascotEncouragementBody');
            if (encourBody) {
                if (streakCount > 0) {
                    encourBody.textContent = `Tiến độ ${streakCount} ngày liên tiếp giúp khả năng ghi nhớ từ vựng tăng 3.4 lần so với học dồn vào cuối tuần.`;
                } else {
                    encourBody.textContent = 'Duy trì học đều đặn mỗi ngày giúp khả năng ghi nhớ từ vựng tăng 3.4 lần so với học dồn vào cuối tuần.';
                }
            }

            if (!row) return;
            const weekDays = (streakInfo && Array.isArray(streakInfo.weekDays) && streakInfo.weekDays.length === 7)
                ? streakInfo.weekDays
                : [
                    { label: 'T2', active: false },
                    { label: 'T3', active: false },
                    { label: 'T4', active: false },
                    { label: 'T5', active: false },
                    { label: 'T6', active: false },
                    { label: 'T7', active: false },
                    { label: 'CN', active: false }
                ];

            row.innerHTML = weekDays.map(d => {
                if (d.active) {
                    return `
                        <div class="flex flex-col items-center gap-1">
                            <div class="w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs shadow-md shadow-orange-500/30" title="${d.label} - Đã học">
                                🔥
                            </div>
                            <span class="text-[10px] font-extrabold text-orange-600">${d.label}</span>
                        </div>
                    `;
                }
                return `
                    <div class="flex flex-col items-center gap-1">
                        <div class="w-7 h-7 rounded-full bg-slate-200/90 dark:bg-slate-700 flex items-center justify-center text-xs" title="${d.label} - Chưa học"></div>
                        <span class="text-[10px] font-bold text-slate-500">${d.label}</span>
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
        }

        function toggleMemberProfileDropdown(e) {
            if (e) e.stopPropagation();
            const menu = document.getElementById('sanhMemberProfileMenu');
            if (menu) menu.classList.toggle('hidden');
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
            switchTab('cai-dat');
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

        function renderUserAvatarElement(el, account) {
            if (!el) return;
            const avatar = account?.avatar || '';
            const avatarColor = account?.avatarColor || 'bg-blue-600';
            const initial = (account?.name || 'U').trim().charAt(0).toUpperCase();

            // Clear previous children
            el.innerHTML = '';
            
            // Remove any old background colors to avoid conflicts
            el.className = el.className.replace(/\bbg-[a-z0-9-]+\b/g, '').trim();

            if (avatar.startsWith('data:image/') || avatar.startsWith('http://') || avatar.startsWith('https://')) {
                el.classList.add('bg-slate-100', 'overflow-hidden');
                el.innerHTML = `<img src="${avatar}" class="w-full h-full object-cover rounded-full" alt="avatar">`;
            } else if (avatar && avatar.length <= 4) { // Emoji mascot
                el.classList.add(avatarColor, 'overflow-hidden', 'flex', 'items-center', 'justify-center');
                el.innerHTML = `<span class="select-none leading-none">${avatar}</span>`;
            } else {
                el.classList.add(avatarColor, 'overflow-hidden', 'flex', 'items-center', 'justify-center');
                el.innerHTML = `<span class="select-none font-extrabold leading-none">${initial}</span>`;
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

        function selectPresetAvatar(emoji) {
            if (!currentUserAccount) return;
            currentUserAccount.avatar = emoji;
            applyCurrentAccountToUI();
            syncCurrentAccountState();
            showToast(`✨ Đã đổi avatar sang linh vật ${emoji}!`);
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
            renderUserAvatarElement(document.getElementById('topUserAvatar'), currentUserAccount);
            renderUserAvatarElement(document.getElementById('mobileTopAvatar'), currentUserAccount);
            renderUserAvatarElement(document.getElementById('profileAvatarPreview'), currentUserAccount);

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

            // Cập nhật các trường hiển thị ở Sảnh Thành viên (Chuẩn 100% Ảnh đính kèm)
            setTxt('sanhGreetingPrefix', 'Cố gắng nhé bạn ơi,');
            setTxt('sanhMemberGreetingName', (currentUserAccount.name || 'bạn') + '! 👏');
            setTxt('sanhMemberProfileName', currentUserAccount.name || 'Học viên');
            setTxt('memberTargetScore', currentUserAccount.targetScore || '——');
            setTxt('memberExamDate', currentUserAccount.examDate ? `Thi: ${currentUserAccount.examDate}` : 'Thi: Chưa đặt');
            setTxt('sanhMemberStreakVal', `${currentUserAccount.streak || 0} ngày`);
            setTxt('sanhMemberStreakTitle', `Streak ${currentUserAccount.streak || 0} ngày`);
            setTxt('sanhMemberXpVal', `+${currentUserAccount.xp || 0} XP`);
            setTxt('sanhMemberDropdownEmail', currentUserAccount.email || '');
            setTxt('mobileDropdownEmail', currentUserAccount.email || '');
            renderUserAvatarElement(document.getElementById('sanhMemberAvatar'), currentUserAccount);

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
                            this.loadUserProgress();
                            if (window.StudySync) {
                                window.StudySync.connectStream();
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
                            studyMinutes: state.studyMinutes || 0
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
                'switch': document.getElementById('authPanelSwitch')
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
            }

            // Ẩn các thông báo lỗi cũ khi chuyển tab
            const errLogin = document.getElementById('loginErrorAlert');
            const errReg = document.getElementById('regErrorAlert');
            if (errLogin) errLogin.classList.add('hidden');
            if (errReg) errReg.classList.add('hidden');
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
                UserAuthEngine.loadUserProgress();
                if (window.StudySync) window.StudySync.connectStream();
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
                    UserAuthEngine.loadUserProgress();
                    if (window.StudySync) window.StudySync.connectStream();
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
            UserAuthEngine.loadUserProgress();
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

            // 6. Xóa session lưu trữ client
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
                                        ${isCurrent ? '<span class="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px]">Đang dùng</span>' : ''}
                                    </div>
                                    <div class="text-[11px] text-slate-500">${acc.email} · Mục tiêu ${acc.targetScore} ${acc.exam}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="text-xs font-extrabold text-rose-600">+${acc.xp || 0} XP</div>
                                <div class="text-[10.5px] text-orange-600 font-bold">🔥 ${acc.streak || 0} ngày</div>
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
                                    <div class="text-[11px] text-slate-500">${acc.email} · Đang luyện ${acc.exam} (${acc.targetScore} điểm)</div>
                                </div>
                            </div>
                            <div class="flex items-center gap-2">
                                <span class="px-2.5 py-1 rounded-full bg-rose-50 text-rose-600 text-[11px] font-extrabold">✨ ${acc.xp || 0} XP</span>
                                <button onclick="switchUserAccountById('${acc.id}')" class="px-3 py-1 rounded-xl bg-slate-100 hover:bg-blue-50 text-blue-600 text-[11px] font-bold">Vào TK này</button>
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
                        <i class="fa-solid fa-xmark text-[10px]"></i>
                    </button>
                </span>
            `).join('');

            if (clearBtn) clearBtn.classList.remove('hidden');
        }

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
                            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">${escapeHtml(m.partOfSpeech)}</span>
                        </div>
                        <span class="text-[11px] text-slate-500 italic max-w-[200px] truncate">${escapeHtml(m.vi)}</span>
                    </div>
                `).join('');
                dropdown.classList.remove('hidden');
            }, 120);
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
                        <p class="text-xs text-slate-500 mt-1">Đang phân tích từ/cụm từ <strong>"${escapeHtml(raw)}"</strong>, đối chiếu IPA chuẩn US/UK, từ loại và ma trận họ từ.</p>
                    </div>
                </div>
            `;

            let entry = null;
            if (window.DictionaryEngine) {
                entry = await DictionaryEngine.lookupWord(raw);
            } else if (window.lookupWordOnlineAsync) {
                entry = await window.lookupWordOnlineAsync(raw);
            }

            // Cập nhật lại thanh lịch sử
            renderDictHistoryChips();

            // 1. Trường hợp: Không tìm thấy từ (Not Found) & Gợi ý gõ sai
            if (!entry || entry.notFound) {
                const queryStr = escapeHtml(entry?.query || raw);
                const suggestions = entry?.suggestions || [];
                const suggestHtml = suggestions.length > 0 ? `
                    <div class="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 max-w-md mx-auto space-y-2 text-left">
                        <div class="text-xs font-black text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                            <i class="fa-solid fa-wand-magic-sparkles text-amber-600"></i> Ý bạn có phải là:
                        </div>
                        <div class="flex flex-wrap gap-2">
                            ${suggestions.map(s => `
                                <button onclick="quickLookupDictWord('${escapeHtml(s)}')" class="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-amber-100 text-amber-900 dark:text-amber-200 font-extrabold text-xs border border-amber-300 shadow-sm transition flex items-center gap-1.5">
                                    <i class="fa-solid fa-arrow-right text-[10px]"></i>
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
                            <p class="text-xs text-slate-500 max-w-lg mx-auto">Vui lòng kiểm tra lại chính tả hoặc thử các từ quen thuộc như: <em>economic, require, contract, produce, negotiate, strategy...</em></p>
                        </div>
                        ${suggestHtml}
                    </div>
                `;
                return;
            }

            // 2. Trường hợp: Tra ngược tiếng Việt sang tiếng Anh (Reverse Lookup)
            if (entry.isReverseLookup) {
                const results = entry.results || [];
                const queryStr = escapeHtml(entry.query);

                if (results.length === 0) {
                    container.innerHTML = `
                        <div class="glass-panel rounded-[26px] p-8 text-center space-y-3 border-2 border-sky-200">
                            <div class="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto text-xl">
                                <i class="fa-solid fa-language"></i>
                            </div>
                            <h4 class="text-base font-extrabold text-slate-800 dark:text-white">Không tìm thấy từ tiếng Anh tương ứng cho "${queryStr}"</h4>
                            <p class="text-xs text-slate-500">Hãy thử nhập từ khóa ngắn gọn hơn (VD: "hợp đồng", "kinh tế", "yêu cầu", "kết quả"...)</p>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = `
                    <div class="glass-panel rounded-[26px] p-6 space-y-4 border-2 border-sky-200">
                        <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                            <div class="flex items-center gap-2.5">
                                <span class="w-8 h-8 rounded-xl bg-sky-600 text-white flex items-center justify-center text-sm font-bold">🇻🇳 ➔ 🇬🇧</span>
                                <div>
                                    <h3 class="text-base font-extrabold text-slate-900 dark:text-white">Kết quả tra ngược tiếng Việt cho: "${queryStr}"</h3>
                                    <p class="text-[11px] text-slate-500">Tìm thấy ${results.length} từ vựng tiếng Anh tương ứng trong từ điển</p>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                            ${results.map(r => `
                                <div class="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-sky-300 shadow-sm space-y-2 transition flex flex-col justify-between">
                                    <div>
                                        <div class="flex items-center justify-between gap-2">
                                            <div class="flex items-center gap-2">
                                                <span class="text-lg font-black text-slate-900 dark:text-white">${escapeHtml(r.headword || r.word)}</span>
                                                <span class="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 text-[10px] font-extrabold">${escapeHtml(r.partOfSpeech)}</span>
                                            </div>
                                            <button onclick="DictionaryEngine.speak('${escapeHtml(r.headword || r.word)}', 'en-US')" class="text-sky-600 hover:text-sky-800 text-xs" title="Nghe phát âm">
                                                <i class="fa-solid fa-volume-high"></i>
                                            </button>
                                        </div>
                                        <div class="text-xs text-sky-700 dark:text-sky-400 font-semibold mt-0.5">
                                            IPA: ${escapeHtml(r.ipa?.us || r.phonetic || '')}
                                        </div>
                                        <div class="text-xs text-slate-700 dark:text-slate-300 font-medium mt-1.5 leading-snug">
                                            🇻🇳 ${(r.senses?.[0]?.meaningVi || r.vi || '').slice(0, 90)}
                                        </div>
                                    </div>
                                    <div class="pt-2 border-t border-slate-100 dark:border-slate-700 flex justify-end">
                                        <button onclick="quickLookupDictWord('${escapeHtml(r.headword || r.word)}')" class="px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm">
                                            <span>Tra chi tiết họ từ</span>
                                            <i class="fa-solid fa-arrow-right text-[10px]"></i>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
                return;
            }

            // 3. Trường hợp: Hiển thị mục từ chuẩn hóa (WordEntry)
            if (window.DictionaryEngine) {
                DictionaryEngine.currentEntry = entry;
            }

            const headword = escapeHtml(entry.headword || entry.word);
            currentDictLookupWord = entry.headword || entry.word;
            const pos = escapeHtml(entry.partOfSpeech || 'General Vocabulary');

            // Khử sạch lỗi hiển thị IPA thô bằng IPAHelper (chuẩn hóa ngữ âm học chuẩn quốc tế)
            let rawIpaUs = entry.ipa?.us || entry.phonetic || '';
            let rawIpaUk = entry.ipa?.uk || entry.ipaUk || rawIpaUs;
            if (window.IPAHelper) {
                rawIpaUs = window.IPAHelper.sanitizeIpaString(rawIpaUs, entry.headword || entry.word, 'US');
                rawIpaUk = window.IPAHelper.sanitizeIpaString(rawIpaUk, entry.headword || entry.word, 'UK') || rawIpaUs;
            }
            const ipaUs = escapeHtml(rawIpaUs);
            const ipaUk = escapeHtml(rawIpaUk);

            // Đăng ký URL audio gốc cho AudioService nếu có
            if (window.AudioService && entry.audio) {
                window.AudioService.registerAudioSources(entry.headword || entry.word, entry.audio);
            }
            const coreVi = escapeHtml(entry.senses?.[0]?.meaningVi || entry.vi || '');
            const coreDef = escapeHtml(entry.senses?.[0]?.defEn || entry.definition || '');
            const examTag = escapeHtml(entry.lists?.[0] || entry.examTag || 'TOEIC / VSTEP');

            // Banner nhận diện từ dính liền (Auto-segmentation banner: vd "headsofstate" -> "heads of state")
            let segmentBanner = '';
            if (entry.flags?.isSegmented || (entry.segmentedWord && entry.segmentedWord.toLowerCase() !== raw.toLowerCase())) {
                const segWord = escapeHtml(entry.segmentedWord || entry.headword);
                segmentBanner = `
                    <div class="p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:bg-slate-800 border-l-4 border-indigo-600 border border-indigo-200 text-xs flex items-center justify-between gap-3 shadow-sm mb-3">
                        <div class="flex items-center gap-2">
                            <span class="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                                <i class="fa-solid fa-wand-magic-sparkles"></i>
                            </span>
                            <div>
                                <span class="text-slate-600 dark:text-slate-300 font-medium">Đã tự động nhận diện từ dính liền:</span>
                                <strong class="text-indigo-900 dark:text-indigo-300 text-sm ml-1">"${escapeHtml(entry.originalQuery || raw)}"</strong>
                                <span class="text-slate-500 mx-1.5 font-bold">➔</span>
                                <strong class="text-indigo-700 dark:text-indigo-200 text-sm">"${segWord}"</strong>
                            </div>
                        </div>
                        <span class="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-900 text-[10px] font-black uppercase tracking-wider shrink-0">Auto-Segmented</span>
                    </div>
                `;
            }

            // Banner chuyển hướng Lemma nếu có (e.g. went -> go, heads of state -> head of state)
            let lemmaBanner = '';
            if (entry.flags?.isLemmaRedirect) {
                const searchQ = escapeHtml(entry.searchedQuery || raw);
                const matchedNote = escapeHtml(entry.matchedForm || 'Biến thể ngữ pháp');
                lemmaBanner = `
                    <div class="p-3.5 rounded-2xl bg-sky-50 dark:bg-slate-800 border-l-4 border-sky-600 border border-sky-200 text-xs flex items-center justify-between gap-3 shadow-sm mb-3">
                        <div class="flex items-center gap-2">
                            <span class="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center text-xs font-black shrink-0">
                                <i class="fa-solid fa-code-branch"></i>
                            </span>
                            <div>
                                <span class="text-slate-600 dark:text-slate-300 font-medium">Đang hiển thị cho từ gốc:</span>
                                <strong class="text-sky-700 dark:text-sky-300 text-sm ml-1">${headword}</strong>
                                <span class="text-slate-500 dark:text-slate-400 italic ml-1">(${matchedNote})</span>
                            </div>
                        </div>
                        <span class="px-2 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-bold shrink-0">Lemmatized: "${searchQ}"</span>
                    </div>
                `;
            }

            // Word Family Matrix: Chuẩn hóa hỗ trợ cả Array of objects VÀ Object of strings ({ noun: "...", verb: "..." })
            const rawWf = entry.wordFamily || {};
            const parseWfCol = (col) => {
                if (!col) return [];
                if (Array.isArray(col)) return col;
                if (typeof col === 'string') {
                    if (col.trim() === '-' || !col.trim()) return [];
                    return col.split(',').map(s => {
                        const t = s.trim();
                        const m = t.match(/^([^(]+)(\((.+)\))?$/);
                        if (m) {
                            return { term: m[1].trim(), vi: m[3] ? m[3].trim() : '' };
                        }
                        return { term: t, vi: '' };
                    }).filter(x => x.term);
                }
                return [];
            };

            const wf = {
                noun: parseWfCol(rawWf.noun),
                verb: parseWfCol(rawWf.verb),
                adj: parseWfCol(rawWf.adj || rawWf.adjective),
                adv: parseWfCol(rawWf.adv || rawWf.adverb)
            };
            const nounList = (wf.noun && wf.noun.length > 0)
                ? wf.noun.map(n => `<div class="p-2 rounded-xl bg-purple-50 dark:bg-slate-800 border border-purple-200"><button onclick="quickLookupDictWord('${escapeHtml(n.term)}')" class="font-extrabold text-purple-700 dark:text-purple-300 hover:underline text-left">${escapeHtml(n.term)}</button><div class="text-[11px] text-slate-500">${escapeHtml(n.vi || n.term)}</div></div>`).join('')
                : `<div class="text-xs text-slate-400 italic">Không có dạng thông dụng</div>`;

            const verbList = (wf.verb && wf.verb.length > 0)
                ? wf.verb.map(v => `<div class="p-2 rounded-xl bg-teal-50 dark:bg-slate-800 border border-teal-200"><button onclick="quickLookupDictWord('${escapeHtml(v.term)}')" class="font-extrabold text-teal-700 dark:text-teal-300 hover:underline text-left">${escapeHtml(v.term)}</button><div class="text-[11px] text-slate-500">${escapeHtml(v.vi || v.term)}</div></div>`).join('')
                : `<div class="text-xs text-slate-400 italic">Không có dạng thông dụng</div>`;

            const adjList = (wf.adj && wf.adj.length > 0)
                ? wf.adj.map(a => `<div class="p-2 rounded-xl bg-rose-50 dark:bg-slate-800 border border-rose-200"><button onclick="quickLookupDictWord('${escapeHtml(a.term)}')" class="font-extrabold text-rose-700 dark:text-rose-300 hover:underline text-left">${escapeHtml(a.term)}</button><div class="text-[11px] text-slate-500">${escapeHtml(a.vi || a.term)}</div></div>`).join('')
                : `<div class="text-xs text-slate-400 italic">Không có dạng thông dụng</div>`;

            const advList = (wf.adv && wf.adv.length > 0)
                ? wf.adv.map(ad => `<div class="p-2 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200"><button onclick="quickLookupDictWord('${escapeHtml(ad.term)}')" class="font-extrabold text-amber-800 dark:text-amber-300 hover:underline text-left">${escapeHtml(ad.term)}</button><div class="text-[11px] text-slate-500">${escapeHtml(ad.vi || ad.term)}</div></div>`).join('')
                : `<div class="text-xs text-slate-400 italic">Không có dạng thông dụng</div>`;

            // Synonyms & Antonyms
            const synHtml = (entry.synonyms && entry.synonyms.length > 0)
                ? entry.synonyms.map(s => `<button onclick="quickLookupDictWord('${escapeHtml(s)}')" class="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold hover:bg-emerald-100 transition">${escapeHtml(s)}</button>`).join('')
                : `<span class="text-xs text-slate-400">Đang cập nhật</span>`;

            const antHtml = (entry.antonyms && entry.antonyms.length > 0)
                ? entry.antonyms.map(a => `<button onclick="quickLookupDictWord('${escapeHtml(a)}')" class="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 text-xs font-bold hover:bg-rose-100 transition">${escapeHtml(a)}</button>`).join('')
                : `<span class="text-xs text-slate-400">Đang cập nhật</span>`;

            // Collocations & Idioms (Hỗ trợ cả mảng chuỗi VÀ mảng object)
            const collHtml = (entry.collocations && entry.collocations.length > 0)
                ? entry.collocations.map(c => {
                    const phraseText = typeof c === 'string' ? c : (c.en || c.phrase || '');
                    const viText = typeof c === 'string' ? `Cụm từ với "${headword}"` : (c.vi || '');
                    return `
                    <li class="flex items-start gap-2 text-xs">
                        <span class="text-sky-600 font-extrabold shrink-0">•</span>
                        <div>
                            <strong class="text-slate-900 dark:text-white">${escapeHtml(phraseText)}</strong>${viText ? `: <span class="text-slate-600 dark:text-slate-300 italic">${escapeHtml(viText)}</span>` : ''}
                        </div>
                    </li>
                    `;
                }).join('')
                : `<li class="text-xs text-slate-400">Chưa có dữ liệu collocation</li>`;

            const idiomHtml = (entry.idioms && entry.idioms.length > 0)
                ? entry.idioms.map(idm => {
                    const phraseText = typeof idm === 'string' ? idm : (idm.en || idm.phrase || '');
                    const viText = typeof idm === 'string' ? `Thành ngữ với "${headword}"` : (idm.vi || '');
                    return `
                    <li class="flex items-start gap-2 text-xs">
                        <span class="text-amber-600 font-extrabold shrink-0">★</span>
                        <div>
                            <strong class="text-amber-900 dark:text-amber-300">${escapeHtml(phraseText)}</strong>${viText ? `: <span class="text-slate-600 dark:text-slate-300 italic">${escapeHtml(viText)}</span>` : ''}
                        </div>
                    </li>
                    `;
                }).join('')
                : `<li class="text-xs text-slate-400">Không có thành ngữ đặc biệt</li>`;

            // Context Examples
            const examples = entry.senses?.[0]?.examples || entry.examples || [];
            const exHtml = (examples && examples.length > 0)
                ? examples.map(ex => `
                    <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-1">
                        <div class="text-xs font-extrabold text-slate-900 dark:text-white flex items-center justify-between">
                            <span>🇬🇧 "${escapeHtml(ex.en)}"</span>
                            <button onclick="DictionaryEngine.speak('${escapeHtml(ex.en.replace(/'/g, "\\'"))}', 'en-US')" class="text-sky-600 hover:text-sky-800 text-xs" title="Nghe câu ví dụ">
                                <i class="fa-solid fa-volume-high"></i>
                            </button>
                        </div>
                        <div class="text-[11.5px] text-slate-500 italic">🇻🇳 ${escapeHtml(ex.vi)}</div>
                    </div>
                `).join('')
                : '';

            // Mini-Quiz Component
            const quizHtml = window.DictionaryEngine ? DictionaryEngine.generateMiniQuiz(entry) : '';

            // Render Full Card
            container.innerHTML = `
                ${segmentBanner}
                ${lemmaBanner}

                <!-- Main Header Card -->
                <div class="glass-panel rounded-[26px] p-6 space-y-5 border-2 border-sky-200 shadow-sm">
                    <div class="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div>
                            <div class="flex flex-wrap items-center gap-2.5">
                                <h2 class="text-[30px] font-black text-slate-900 dark:text-white tracking-tight">${headword}</h2>
                                <span class="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-xs font-extrabold">${pos}</span>
                                <span class="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">${examTag}</span>
                                ${entry.flags?.isAiGenerated ? `<span class="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100 text-indigo-900 text-xs font-black border border-indigo-200 shadow-xs flex items-center gap-1"><i class="fa-solid fa-brain text-purple-600 text-[11px]"></i><span>AI Enhanced Entry</span></span>` : ''}
                            </div>
                            
                            <!-- US & UK Pronunciation Row -->
                            <div class="flex flex-wrap items-center gap-4 text-xs font-semibold mt-2">
                                <div class="flex items-center gap-1.5 text-sky-800 dark:text-sky-300 bg-sky-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-sky-200 dark:border-slate-700">
                                    <span>🇺🇸 US: <strong>${ipaUs}</strong></span>
                                    <button onclick="DictionaryEngine.speak('${headword}', 'en-US')" class="w-6 h-6 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center transition ml-1" title="Nghe giọng Mỹ">
                                        <i class="fa-solid fa-volume-high text-[10px]"></i>
                                    </button>
                                </div>
                                <div class="flex items-center gap-1.5 text-indigo-800 dark:text-indigo-300 bg-indigo-50 dark:bg-slate-800 px-3 py-1.5 rounded-xl border border-indigo-200 dark:border-slate-700">
                                    <span>🇬🇧 UK: <strong>${ipaUk}</strong></span>
                                    <button onclick="DictionaryEngine.speak('${headword}', 'en-GB')" class="w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition ml-1" title="Nghe giọng Anh">
                                        <i class="fa-solid fa-volume-high text-[10px]"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex flex-wrap items-center gap-2">
                            <button onclick="openWordCopyingInTakeNote('${headword}')" class="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold shadow-sm transition flex items-center gap-1.5">
                                <i class="fa-solid fa-feather-pointed"></i> Luyện chép từ này 10-30 lần trong Take Note
                            </button>
                            <button onclick="saveDictWordToVocab('${headword}')" class="px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 text-xs font-bold transition flex items-center gap-1">
                                <i class="fa-regular fa-bookmark"></i> Lưu từ vào Sổ
                            </button>
                            <button onclick="reportDictIssue('${headword}')" class="px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-bold transition" title="Báo lỗi hoặc đề xuất cải tiến nghĩa">
                                <i class="fa-regular fa-flag"></i> Góp ý
                            </button>
                        </div>
                    </div>

                    <!-- Meaning -->
                    <div class="space-y-1.5">
                        <div class="text-xs font-bold text-slate-400 uppercase tracking-wider">Nghĩa tiếng Việt cốt lõi:</div>
                        <div class="text-[18px] font-extrabold text-slate-900 dark:text-white leading-snug">
                            🇻🇳 ${coreVi}
                        </div>
                        <div class="text-xs text-slate-500 italic">
                            🇬🇧 ${coreDef}
                        </div>
                        ${(entry.definitions && entry.definitions.length > 1) ? `
                            <div class="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                                <div class="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Các định nghĩa & ngữ cảnh mở rộng:</div>
                                <div class="space-y-2">
                                    ${entry.definitions.slice(1).map(d => `
                                        <div class="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                                            <div class="font-bold text-slate-800 dark:text-white">🇻🇳 ${escapeHtml(d.vi)}</div>
                                            <div class="text-slate-500 italic text-[11px]">🇬🇧 ${escapeHtml(d.en)}</div>
                                            ${d.exampleEn ? `<div class="text-[11px] text-sky-700 dark:text-sky-300 font-medium">VD: "${escapeHtml(d.exampleEn)}"</div>` : ''}
                                        </div>
                                    `).join('')}
                                </div>
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

                    <!-- 4 Word Family Columns (Họ từ Noun - Verb - Adj - Adv) -->
                    <div class="space-y-2 pt-2">
                        <h3 class="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                            <i class="fa-solid fa-sitemap text-sky-600"></i> Bảng Họ từ toàn diện (Word Family Matrix):
                        </h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <!-- Noun -->
                            <div class="glass-panel rounded-2xl p-3 space-y-2 border border-purple-200">
                                <div class="text-xs font-black text-purple-700 flex items-center justify-between">
                                    <span>🏷️ DANH TỪ (Noun)</span>
                                </div>
                                <div class="space-y-1.5">${nounList}</div>
                            </div>
                            <!-- Verb -->
                            <div class="glass-panel rounded-2xl p-3 space-y-2 border border-teal-200">
                                <div class="text-xs font-black text-teal-700 flex items-center justify-between">
                                    <span>⚡ ĐỘNG TỪ (Verb)</span>
                                </div>
                                <div class="space-y-1.5">${verbList}</div>
                            </div>
                            <!-- Adj -->
                            <div class="glass-panel rounded-2xl p-3 space-y-2 border border-rose-200">
                                <div class="text-xs font-black text-rose-700 flex items-center justify-between">
                                    <span>🎨 TÍNH TỪ (Adj)</span>
                                </div>
                                <div class="space-y-1.5">${adjList}</div>
                            </div>
                            <!-- Adv -->
                            <div class="glass-panel rounded-2xl p-3 space-y-2 border border-amber-200">
                                <div class="text-xs font-black text-amber-800 flex items-center justify-between">
                                    <span>🚀 TRẠNG TỪ (Adv)</span>
                                </div>
                                <div class="space-y-1.5">${advList}</div>
                            </div>
                        </div>
                    </div>

                    <!-- Synonyms & Antonyms -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                            <div class="text-xs font-extrabold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-equals text-emerald-600"></i> Từ đồng nghĩa (Synonyms):
                            </div>
                            <div class="flex flex-wrap gap-1.5">${synHtml}</div>
                        </div>

                        <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                            <div class="text-xs font-extrabold text-rose-800 dark:text-rose-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-not-equal text-rose-600"></i> Từ trái nghĩa (Antonyms):
                            </div>
                            <div class="flex flex-wrap gap-1.5">${antHtml}</div>
                        </div>
                    </div>

                    <!-- Collocations & Idioms -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        <div class="p-4 rounded-2xl bg-sky-50/60 dark:bg-slate-800 border border-sky-200 dark:border-slate-700 space-y-2.5">
                            <div class="text-xs font-extrabold text-sky-900 dark:text-sky-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-link text-sky-600"></i> Cụm từ Collocations hay gặp trong bài thi:
                            </div>
                            <ul class="space-y-2">${collHtml}</ul>
                        </div>

                        <div class="p-4 rounded-2xl bg-amber-50/60 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 space-y-2.5">
                            <div class="text-xs font-extrabold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                                <i class="fa-solid fa-lightbulb text-amber-600"></i> Thành ngữ Idioms & Cụm diễn đạt:
                            </div>
                            <ul class="space-y-2">${idiomHtml}</ul>
                        </div>
                    </div>

                    <!-- Real-life Context Examples -->
                    ${exHtml ? `
                        <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <div class="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                                <i class="fa-regular fa-comment-dots text-sky-600"></i> Ví dụ ngữ cảnh công sở & đề thi:
                            </div>
                            <div class="space-y-2">${exHtml}</div>
                        </div>
                    ` : ''}

                    <!-- Mini-Quiz Quick Check -->
                    ${quizHtml ? `
                        <div class="pt-2 border-t border-slate-100 dark:border-slate-800">
                            ${quizHtml}
                        </div>
                    ` : ''}

                    <!-- Open Source Attribution Footer -->
                    <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                        <div class="flex items-center gap-1.5">
                            <i class="fa-solid fa-shield-halved text-sky-500"></i>
                            <span>Dữ liệu mở: Wiktionary (CC BY-SA 3.0), WordNet 3.0 (Princeton), Tatoeba Project (CC BY 2.0 FR).</span>
                        </div>
                        <div class="flex items-center gap-3">
                            <button onclick="reportDictIssue('${headword}')" class="hover:text-sky-600 transition">Báo lỗi / Góp ý dữ liệu</button>
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
            const term = entry?.headword || w;
            const vi = entry?.senses?.[0]?.meaningVi || entry?.vi || 'Từ vựng đã lưu';
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
                    <span class="text-[10px] text-slate-400 shrink-0">${item.time}</span>
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
            if (deferredPwaInstallPrompt) {
                deferredPwaInstallPrompt.prompt();
                deferredPwaInstallPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        showToast('🎉 Đang cài đặt ứng dụng vào điện thoại!');
                    }
                    deferredPwaInstallPrompt = null;
                });
            } else {
                openMobileConnectModal();
            }
        }

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch((err) => {
                    console.log('SW registration note:', err.message);
                });
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
                if (window.TOEICTrapsEngine) {
                    TOEICTrapsEngine.init();
                }
                if (window.ListeningDashboard) {
                    ListeningDashboard.renderStats();
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
        function bootstrapApplication() {
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
                const initialHash = window.location.hash.replace('#', '');
                if (initialHash && typeof switchTab === 'function' && typeof tabConfig !== 'undefined' && tabConfig[initialHash]) {
                    switchTab(initialHash);
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