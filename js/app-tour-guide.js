/**
 * =========================================================================
 * APP TOUR GUIDE ONBOARDING (STUDY STUDIO 2026 - R1 FEATURE F1)
 * =========================================================================
 * Hướng dẫn từng bước (Spotlight Tour) làm quen tính năng cho học viên mới:
 * - Trạm 1: Bảng màu Editorial Warm Sand & Đổi Phông ETS Serif chống mỏi mắt.
 * - Trạm 2: Lộ trình S-Curve 6 chặng & Ngân hàng đề thi ETS 2026.
 * - Trạm 3: Trạm làm việc 2 cột Luyện Nghe / Đọc & Tra từ điển 1 chạm.
 * - Trạm 4: Thẻ từ vựng 3D & Thuật toán lặp lại ngắt quãng FSRS v5.
 * - Trạm 5: Đồng hồ Pomodoro 25/5 & 3 Kênh âm thanh nền tập trung sâu.
 * =========================================================================
 */

(function (window, document) {
    'use strict';

    class AppTourGuideClass {
        constructor() {
            this.STORAGE_KEY = 'toeic_app_tour_completed';
            this.currentStep = 0;
            this.isActive = false;

            this.steps = [
                {
                    title: 'Bảng Màu Giấy Tự Nhiên & Phông ETS',
                    targetSelector: '#studyEnvironmentControls, #btnEditorialToggle, #btnFontToggle',
                    fallbackSelector: '#sanhTopHeaderBar',
                    content: 'Chuyển đổi giao diện <b>Giấy Cát Ấm (Warm Sand)</b> triệt tiêu ánh sáng xanh, cùng phông thi <b>ETS Serif (EB Garamond)</b> chân thực.',
                    mascotText: 'Chào bạn! Cùng Sói Mây khám phá bảo bối tăng tốc điểm số nhé! 🐺✨',
                    placement: 'bottom'
                },
                {
                    title: 'Lộ Trình S-Curve 6 Chặng Cá Nhân Hóa',
                    targetSelector: '#nav-lo-trinh, #sidebarNav, #sidebarContainer',
                    fallbackSelector: '#sidebarContainer',
                    content: 'Hệ thống tự động phân bổ bài học từng ngày theo <b>S-Curve 6 chặng</b>, bám sát bộ đề thi chuẩn ETS 2026.',
                    mascotText: 'Mỗi ngày hoàn thành 1 viên nang là chắc suất tăng điểm! 📈',
                    placement: 'right'
                },
                {
                    title: 'Trạm Luyện Đề & Bài Học Trọng Tâm',
                    targetSelector: '#heroActionCardContainer, #heroPrimaryCtaBtn',
                    fallbackSelector: '#heroActionCardContainer',
                    content: 'Trải nghiệm giao diện thi thực chiến: Luyện nghe song ngữ, đọc hiểu Part 7 và bôi đen bất kỳ từ nào để <b>tra từ điển tức thì</b>.',
                    mascotText: 'Không bao giờ phải chuyển tab làm ngắt mạch tư duy! 💡',
                    placement: 'bottom'
                },
                {
                    title: 'Bộ Công Cụ Luyện Thi Siêu Tốc 2026',
                    targetSelector: '#quickStudyToolsContainer, #nav-tu-vung',
                    fallbackSelector: '#heroActionCardContainer',
                    content: 'Học nhanh với <b>Flashcard 3D vuốt Tinder FSRS v5</b>, Trạm 180s, Cheat Sheet 1 trang và Tài liệu thực chiến Part 6-7.',
                    mascotText: 'Ôn tập từ vựng chuẩn 80/20 với thuật toán giãn cách thông minh! 🗂️',
                    placement: 'top'
                },
                {
                    title: 'Đồng Hồ Pomodoro & Âm Nền Tập Trung',
                    targetSelector: '#btnQuickPomodoroLaunch, #tourTargetPomodoro',
                    fallbackSelector: '#sanhTopHeaderBar',
                    content: 'Tùy chỉnh thời gian học sâu 25 phút, tích hợp 3 kênh âm nền: Lo-fi thư giãn, Tiếng mưa hiên nhà và Quán cà phê yên tĩnh.',
                    mascotText: 'Tập trung sâu kết hợp âm nền giúp não bộ nhớ từ vựng lâu gấp 3 lần! 🎧',
                    placement: 'bottom'
                }
            ];

            this._bindKeyboardEvents();
        }

        /**
         * Bắt đầu Tour Guide
         * @param {boolean} force - Bỏ qua kiểm tra đã hoàn thành trước đó
         */
        start(force = false) {
            if (!force && this.isCompleted()) {
                console.log('AppTourGuide: Đã hoàn thành trước đó.');
                return;
            }

            this.currentStep = 0;
            this.isActive = true;
            this._createTourDOM();
            this._showStep(this.currentStep);

            if (window.WebAudioMicroEngine) {
                window.WebAudioMicroEngine.playDing();
            }
        }

        isCompleted() {
            try {
                return localStorage.getItem(this.STORAGE_KEY) === 'true';
            } catch (e) {
                return false;
            }
        }

        reset() {
            try {
                localStorage.removeItem(this.STORAGE_KEY);
            } catch (e) {}
            this.currentStep = 0;
            if (typeof window.showToast === 'function') {
                window.showToast('Đã đặt lại Tour Hướng Dẫn! Sẵn sàng khởi động lại.');
            }
        }

        next() {
            if (!this.isActive) return;
            if (this.currentStep < this.steps.length - 1) {
                this.currentStep++;
                this._showStep(this.currentStep);
                if (window.WebAudioMicroEngine) {
                    window.WebAudioMicroEngine.playDing();
                }
            } else {
                this.end(true);
            }
        }

        prev() {
            if (!this.isActive) return;
            if (this.currentStep > 0) {
                this.currentStep--;
                this._showStep(this.currentStep);
            }
        }

        goToStep(idx) {
            if (!this.isActive) return;
            if (idx >= 0 && idx < this.steps.length) {
                this.currentStep = idx;
                this._showStep(this.currentStep);
            }
        }

        end(completed = true) {
            this.isActive = false;
            if (completed) {
                try {
                    localStorage.setItem(this.STORAGE_KEY, 'true');
                } catch (e) {}
                if (window.WebAudioMicroEngine) {
                    window.WebAudioMicroEngine.fireConfetti();
                }
                if (typeof window.showToast === 'function') {
                    window.showToast('🎉 Chúc mừng bạn đã hoàn thành Tour làm quen ứng dụng!');
                }
            }

            this._removeTourDOM();
        }

        // =========================================================================
        // DOM GENERATION & POSITIONING ENGINE
        // =========================================================================

        _createTourDOM() {
            this._removeTourDOM();

            // Backdrop Container
            const root = document.createElement('div');
            root.id = 'appTourGuideRoot';
            root.className = 'fixed inset-0 pointer-events-auto transition-opacity duration-300';
            root.style.cssText = 'position: fixed !important; inset: 0 !important; z-index: 9999990 !important; pointer-events: auto !important;';
            root.innerHTML = `
                <!-- Dark SVG Spotlight Mask -->
                <svg id="tourGuideSvgMask" class="fixed inset-0 w-full h-full pointer-events-none" style="z-index: 9999991 !important;">
                    <defs>
                        <mask id="tourSpotlightHole">
                            <rect width="100%" height="100%" fill="white" />
                            <rect id="tourCutoutRect" x="0" y="0" width="0" height="0" rx="16" fill="black" />
                        </mask>
                    </defs>
                    <rect width="100%" height="100%" fill="rgba(15, 23, 42, 0.78)" mask="url(#tourSpotlightHole)" style="pointer-events: auto; cursor: pointer;" onclick="window.AppTourGuide && window.AppTourGuide.end(false)" title="Bấm ra ngoài để đóng hướng dẫn" />
                </svg>

                <!-- Glowing Highlight Ring around target -->
                <div id="tourHighlightRing" class="fixed pointer-events-none rounded-2xl ring-4 ring-amber-400/80 shadow-[0_0_25px_rgba(251,191,36,0.5)] transition-all duration-300" style="z-index: 9999992 !important; display: none;"></div>

                <!-- Floating Popover Card -->
                <div id="tourPopoverCard" class="fixed w-[92vw] max-w-[420px] bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-2xl border border-slate-200 dark:border-slate-800 transition-all duration-300" style="z-index: 9999999 !important; display: none;">
                    <!-- Card Header -->
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div class="flex items-center gap-2.5">
                            <div class="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-extrabold text-xs flex items-center justify-center border border-amber-200/80 dark:border-amber-900/50">
                                <span id="tourStepIndicator">1/5</span>
                            </div>
                            <h3 id="tourStepTitle" class="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">...</h3>
                        </div>
                        <button onclick="window.AppTourGuide && window.AppTourGuide.end(false)" class="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition cursor-pointer" aria-label="Bỏ qua tour">
                            <i class="fa-solid fa-xmark text-xs"></i>
                        </button>
                    </div>

                    <!-- Mascot Advice Box -->
                    <div class="my-3 p-3 rounded-2xl bg-amber-50/90 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/40 flex items-start gap-2.5">
                        <div class="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center shrink-0 text-base">
                            🐺
                        </div>
                        <p id="tourMascotText" class="text-xs font-semibold text-amber-950 dark:text-amber-200 leading-snug">...</p>
                    </div>

                    <!-- Step Detailed Content -->
                    <div id="tourStepContent" class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">...</div>

                    <!-- Navigation Footer -->
                    <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                        <button id="tourPrevBtn" onclick="window.AppTourGuide && window.AppTourGuide.prev()" class="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
                            Quay lại
                        </button>
                        <div class="flex items-center gap-2">
                            <button onclick="window.AppTourGuide && window.AppTourGuide.end(false)" class="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-600 transition cursor-pointer">
                                Bỏ qua
                            </button>
                            <button id="tourNextBtn" onclick="window.AppTourGuide && window.AppTourGuide.next()" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition cursor-pointer">
                                Tiếp theo ➔
                            </button>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(root);

            // Re-align on resize
            this._resizeHandler = () => {
                if (this.isActive) this._showStep(this.currentStep);
            };
            if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
                window.addEventListener('resize', this._resizeHandler, { passive: true });
            }
        }

        _removeTourDOM() {
            const root = document.getElementById('appTourGuideRoot');
            if (root && typeof root.remove === 'function') {
                root.remove();
            }
            if (this._resizeHandler) {
                if (typeof window !== 'undefined' && typeof window.removeEventListener === 'function') {
                    window.removeEventListener('resize', this._resizeHandler);
                }
                this._resizeHandler = null;
            }
        }

        _showStep(index) {
            const step = this.steps[index];
            if (!step) return;

            // Tìm element mục tiêu
            let targetEl = null;
            const selectors = step.targetSelector.split(',').map(s => s.trim());
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el && el.offsetParent !== null) {
                    targetEl = el;
                    break;
                }
            }

            if (!targetEl && step.fallbackSelector) {
                targetEl = document.querySelector(step.fallbackSelector);
            }

            // Scroll target into view
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
            }

            setTimeout(() => {
                this._renderSpotlight(targetEl, step, index);
            }, 150);
        }

        _renderSpotlight(targetEl, step, index) {
            if (!this.isActive) return;
            const cutoutRect = document.getElementById('tourCutoutRect');
            const highlightRing = document.getElementById('tourHighlightRing');
            const popover = document.getElementById('tourPopoverCard');

            if (!cutoutRect || !highlightRing || !popover) return;

            let rect = {
                left: window.innerWidth / 2 - 150,
                top: window.innerHeight / 2 - 100,
                width: 300,
                height: 200
            };

            if (targetEl) {
                const b = targetEl.getBoundingClientRect();
                const pad = 8;
                rect = {
                    left: Math.max(8, b.left - pad),
                    top: Math.max(8, b.top - pad),
                    width: b.width + pad * 2,
                    height: b.height + pad * 2
                };
            }

            // Cutout SVG mask
            cutoutRect.setAttribute('x', rect.left);
            cutoutRect.setAttribute('y', rect.top);
            cutoutRect.setAttribute('width', rect.width);
            cutoutRect.setAttribute('height', rect.height);
            cutoutRect.setAttribute('rx', '18');

            // Highlight Ring
            highlightRing.style.display = 'block';
            highlightRing.style.left = `${rect.left}px`;
            highlightRing.style.top = `${rect.top}px`;
            highlightRing.style.width = `${rect.width}px`;
            highlightRing.style.height = `${rect.height}px`;

            // Update Card Content
            document.getElementById('tourStepIndicator').textContent = `${index + 1}/${this.steps.length}`;
            document.getElementById('tourStepTitle').textContent = step.title;
            document.getElementById('tourMascotText').textContent = step.mascotText;
            document.getElementById('tourStepContent').innerHTML = step.content;

            const prevBtn = document.getElementById('tourPrevBtn');
            const nextBtn = document.getElementById('tourNextBtn');

            if (index === 0) {
                prevBtn.style.visibility = 'hidden';
            } else {
                prevBtn.style.visibility = 'visible';
            }

            if (index === this.steps.length - 1) {
                nextBtn.innerHTML = 'Bắt đầu học ngay 🚀';
                nextBtn.className = 'px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-md shadow-emerald-500/20 active:scale-95 transition cursor-pointer';
            } else {
                nextBtn.innerHTML = 'Tiếp theo ➔';
                nextBtn.className = 'px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition cursor-pointer';
            }

            // Calculate Popover Position with Full Placement Direction Support
            popover.style.display = 'block';
            popover.style.zIndex = '9999999';
            const popW = Math.min(window.innerWidth - 32, 420);
            const popH = popover.offsetHeight || 260;

            const placement = step.placement || 'bottom';
            let popLeft = 16;
            let popTop = 20;

            if (placement === 'right') {
                popLeft = rect.left + rect.width + 16;
                popTop = rect.top + rect.height / 2 - popH / 2;
                if (popLeft + popW > window.innerWidth - 16) {
                    popLeft = Math.max(16, rect.left + rect.width / 2 - popW / 2);
                    popTop = rect.top + rect.height + 16;
                }
            } else if (placement === 'left') {
                popLeft = rect.left - popW - 16;
                popTop = rect.top + rect.height / 2 - popH / 2;
                if (popLeft < 16) {
                    popLeft = Math.max(16, rect.left + rect.width / 2 - popW / 2);
                    popTop = rect.top + rect.height + 16;
                }
            } else if (placement === 'top') {
                popLeft = rect.left + rect.width / 2 - popW / 2;
                popTop = rect.top - popH - 16;
                if (popTop < 20) {
                    popTop = rect.top + rect.height + 16;
                }
            } else { // 'bottom'
                popLeft = rect.left + rect.width / 2 - popW / 2;
                popTop = rect.top + rect.height + 16;
            }

            // Keep within viewport boundaries
            popLeft = Math.max(16, Math.min(window.innerWidth - popW - 16, popLeft));
            popTop = Math.max(20, Math.min(window.innerHeight - popH - 20, popTop));

            // Prevent popover from overlapping the top header bar
            const headerEl = document.getElementById('sanhTopHeaderBar');
            if (headerEl && placement === 'bottom') {
                const headerBox = headerEl.getBoundingClientRect();
                if (rect.top <= headerBox.bottom && popTop < headerBox.bottom + 12) {
                    popTop = headerBox.bottom + 14;
                }
            }

            popover.style.left = `${popLeft}px`;
            popover.style.top = `${popTop}px`;
        }

        _bindKeyboardEvents() {
            if (typeof window === 'undefined' || typeof window.addEventListener !== 'function') return;
            window.addEventListener('keydown', (e) => {
                if (!this.isActive) return;
                if (e.key === 'ArrowRight' || e.key === 'Enter') {
                    this.next();
                } else if (e.key === 'ArrowLeft') {
                    this.prev();
                } else if (e.key === 'Escape') {
                    this.end(false);
                }
            });
        }
    }

    // Khởi tạo Global Singleton
    window.AppTourGuide = new AppTourGuideClass();

})(window, document);
