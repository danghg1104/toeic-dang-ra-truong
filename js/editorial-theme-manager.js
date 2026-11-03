/**
 * =========================================================================
 * EDITORIAL THEME & TYPOGRAPHY MANAGER (STUDY STUDIO 2026)
 * =========================================================================
 * Quản lý giao diện đọc "Giấy Tự Nhiên & Mực Trầm" (Warm Sand & Deep Indigo)
 * và bộ chuyển đổi phông chữ đề thi ETS Serif (EB Garamond) vs Modern Inter.
 * 
 * Bảng màu tiêu chuẩn:
 * - Nền Warm Sand: #F4EFEA
 * - Bề mặt thẻ Card: #FAF6F0
 * - Mực Deep Indigo: #161E2E
 * - Viền vi mảnh tự nhiên: #E3DDD5
 * 
 * Tuân thủ WCAG AAA về độ tương phản, triệt tiêu ánh sáng xanh gay gắt.
 * =========================================================================
 */

(function (window, document) {
    'use strict';

    class EditorialThemeManager {
        constructor() {
            this.STORAGE_KEY_THEME = 'study_editorial_theme';
            this.STORAGE_KEY_FONT = 'study_font_mode';

            // Trạng thái mặc định
            this._isEditorial = false;
            this._isFontSerif = false;

            this.init();
        }

        init() {
            try {
                // Đọc thiết lập lưu trữ
                const savedEditorial = localStorage.getItem(this.STORAGE_KEY_THEME);
                const savedFont = localStorage.getItem(this.STORAGE_KEY_FONT);

                this._isEditorial = (savedEditorial === 'true');
                this._isFontSerif = (savedFont === 'ets');

                // Áp dụng ngay vào DOM
                this._applyThemeClasses();
                this._applyFontClasses();

                // Gắn listener sau khi DOM sẵn sàng để cập nhật nút UI
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => this.syncUIControls());
                } else {
                    this.syncUIControls();
                }
            } catch (err) {
                console.warn('[EditorialThemeManager] Lỗi khởi tạo:', err);
            }
        }

        /**
         * Bật / tắt chế độ Warm Sand & Deep Indigo
         * @param {boolean} enabled 
         */
        setEditorial(enabled) {
            this._isEditorial = Boolean(enabled);
            try {
                localStorage.setItem(this.STORAGE_KEY_THEME, this._isEditorial ? 'true' : 'false');
            } catch (e) {}

            this._applyThemeClasses();
            this.syncUIControls();

            const msg = this._isEditorial 
                ? '📜 Đã bật giao diện Giấy Tự Nhiên & Mực Trầm (Warm Sand)'
                : '🎨 Đã quay lại giao diện tiêu chuẩn';
            if (typeof window.showToast === 'function') {
                window.showToast(msg);
            }
            return this._isEditorial;
        }

        /**
         * Chuyển đổi trạng thái Editorial Theme
         */
        toggleEditorial() {
            return this.setEditorial(!this._isEditorial);
        }

        /**
         * Kiểm tra có đang ở chế độ Editorial không
         */
        isEditorial() {
            return this._isEditorial;
        }

        /**
         * Đặt phông chữ hiển thị (true: ETS Serif, false: Inter Sans-serif)
         * @param {boolean} isSerif 
         */
        setFontSerif(isSerif) {
            this._isFontSerif = Boolean(isSerif);
            try {
                localStorage.setItem(this.STORAGE_KEY_FONT, this._isFontSerif ? 'ets' : 'inter');
            } catch (e) {}

            this._applyFontClasses();
            this.syncUIControls();

            const msg = this._isFontSerif
                ? '✒️ Đã chuyển sang phông đề thi ETS nguyên bản (EB Garamond / Times)'
                : '🔤 Đã chuyển sang phông hiện đại chống mỏi mắt (Inter Sans-serif)';
            if (typeof window.showToast === 'function') {
                window.showToast(msg);
            }
            return this._isFontSerif;
        }

        /**
         * Chuyển đổi qua lại giữa ETS Serif và Inter
         */
        toggleFont() {
            return this.setFontSerif(!this._isFontSerif);
        }

        /**
         * Kiểm tra có đang bật phông ETS Serif không
         */
        isFontSerif() {
            return this._isFontSerif;
        }

        _applyThemeClasses() {
            const root = document.documentElement;
            if (this._isEditorial) {
                root.classList.add('editorial');
            } else {
                root.classList.remove('editorial');
            }
        }

        _applyFontClasses() {
            const root = document.documentElement;
            if (this._isFontSerif) {
                root.classList.add('font-ets');
                root.classList.remove('font-inter');
            } else {
                root.classList.remove('font-ets');
                root.classList.add('font-inter');
            }
        }

        /**
         * Đồng bộ trạng thái visual của các nút gạt trên Header và Toolbars
         */
        syncUIControls() {
            // Nút Theme Editorial Desktop & Mobile
            const themeButtons = [
                document.getElementById('btnEditorialToggle'),
                document.getElementById('btnMobileEditorialToggle'),
                document.getElementById('btnFloatEditorialToggle')
            ];

            themeButtons.forEach(btn => {
                if (!btn) return;
                btn.setAttribute('aria-pressed', this._isEditorial ? 'true' : 'false');
                if (this._isEditorial) {
                    btn.classList.add('editorial-active', 'ring-2', 'ring-amber-500/60');
                    btn.setAttribute('title', 'Tắt chế độ Giấy Tự Nhiên Warm Sand');
                } else {
                    btn.classList.remove('editorial-active', 'ring-2', 'ring-amber-500/60');
                    btn.setAttribute('title', 'Bật chế độ Giấy Tự Nhiên & Mực Trầm (Warm Sand)');
                }
            });

            // Nút Font Switcher Desktop & Mobile
            const fontButtons = [
                document.getElementById('btnFontToggle'),
                document.getElementById('btnMobileFontToggle'),
                document.getElementById('btnFloatFontToggle')
            ];

            fontButtons.forEach(btn => {
                if (!btn) return;
                btn.setAttribute('aria-pressed', this._isFontSerif ? 'true' : 'false');
                const label = btn.querySelector('.font-mode-label');
                if (label) {
                    label.textContent = this._isFontSerif ? 'Serif ETS' : 'Inter Sans';
                }
                if (this._isFontSerif) {
                    btn.classList.add('font-serif-active', 'ring-2', 'ring-indigo-500/60');
                    btn.setAttribute('title', 'Đổi sang phông Inter Sans-serif');
                } else {
                    btn.classList.remove('font-serif-active', 'ring-2', 'ring-indigo-500/60');
                    btn.setAttribute('title', 'Đổi sang phông ETS Serif (EB Garamond)');
                }
            });
        }
    }

    // Khởi tạo Global Singleton
    window.EditorialThemeManager = new EditorialThemeManager();

})(window, document);
