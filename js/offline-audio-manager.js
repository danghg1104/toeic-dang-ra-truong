/**
 * =========================================================================
 * OFFLINE AUDIO MANAGER & STORAGE ENGINE (BƯỚC 4: HỖ TRỢ NGOẠI TUYẾN MOBILE)
 * =========================================================================
 * Thiết kế bởi Senior Product Designer kiêm Tech Lead:
 * 1. Selective Offline Caching: Tải và lưu các bài nghe TOEIC vào Cache Storage.
 * 2. Offline Status Banner: Tự động cảnh báo và chuyển sang chế độ ngoại tuyến khi mất 4G/Wi-Fi.
 * 3. Storage Quota Management: Hiển thị dung lượng đã tải và cho phép xóa bộ nhớ khi cần.
 * =========================================================================
 */

(function (window, document) {
    'use strict';

    const CACHE_NAME = 'study-studio-audio-offline-v1';
    const STORAGE_KEY = 'saved_offline_audios_manifest';

    class OfflineAudioManager {
        constructor() {
            this.savedManifest = this.loadManifest();
            this.isOnline = navigator.onLine !== false;
            this.initListeners();
            this.injectStyles();
            console.log('📦 Offline Audio Manager initialized. Total offline tracks:', Object.keys(this.savedManifest).length);
        }

        loadManifest() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                return raw ? JSON.parse(raw) : {};
            } catch (e) {
                return {};
            }
        }

        saveManifest() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.savedManifest));
            } catch (e) {}
        }

        injectStyles() {
            if (document.getElementById('offline-audio-styles')) return;
            const style = document.createElement('style');
            style.id = 'offline-audio-styles';
            style.textContent = `
                #offlineNetworkBanner {
                    position: fixed;
                    top: 12px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 9999;
                    animation: slideDownToast 0.3s ease-out;
                }
                @keyframes slideDownToast {
                    from { transform: translate(-50%, -100%); opacity: 0; }
                    to { transform: translate(-50%, 0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }

        initListeners() {
            window.addEventListener('online', () => {
                this.isOnline = true;
                this.showNetworkToast(true);
            });
            window.addEventListener('offline', () => {
                this.isOnline = false;
                this.showNetworkToast(false);
            });
        }

        showNetworkToast(online) {
            const existing = document.getElementById('offlineNetworkBanner');
            if (existing) existing.remove();

            const banner = document.createElement('div');
            banner.id = 'offlineNetworkBanner';
            if (online) {
                banner.className = 'px-4 py-2 rounded-2xl bg-emerald-600 text-white font-bold text-xs shadow-xl flex items-center gap-2 border border-emerald-400/50';
                banner.innerHTML = `
                    <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    <span>Đã khôi phục kết nối Internet! Đồng bộ tiến độ...</span>
                `;
            } else {
                banner.className = 'px-4 py-2.5 rounded-2xl bg-amber-600 text-white font-bold text-xs shadow-xl flex items-center gap-2 border border-amber-400/50';
                banner.innerHTML = `
                    <span>📶</span>
                    <span>Đang ở Chế độ Ngoại Tuyến (Offline). Các bài nghe đã tải vẫn hoạt động mượt mà!</span>
                `;
            }

            document.body.appendChild(banner);
            setTimeout(() => banner.remove(), 4000);
        }

        async isCached(url) {
            if (!url) return false;
            if (this.savedManifest[url]) return true;
            if (!('caches' in window)) return false;
            try {
                const cache = await caches.open(CACHE_NAME);
                const match = await cache.match(url);
                return !!match;
            } catch (e) {
                return false;
            }
        }

        async downloadAudio(url, title = 'Bài nghe TOEIC', onProgress = null) {
            if (!('caches' in window)) {
                alert('Trình duyệt không hỗ trợ Cache ngoại tuyến.');
                return false;
            }

            try {
                if (onProgress) onProgress('Đang kết nối...');
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);

                const cache = await caches.open(CACHE_NAME);
                await cache.put(url, response.clone());

                this.savedManifest[url] = {
                    title: title,
                    savedAt: new Date().toISOString(),
                    size: response.headers.get('content-length') || 0
                };
                this.saveManifest();

                if (window.SoiMayCompanion) {
                    window.SoiMayCompanion.celebrate(`Đã lưu ngoại tuyến: ${title} 🎧`);
                }
                if ('vibrate' in navigator) navigator.vibrate(20);

                return true;
            } catch (err) {
                console.error('[OfflineAudioManager] Lỗi tải audio:', err);
                alert(`Không thể tải bài nghe: ${err.message}`);
                return false;
            }
        }

        async removeAudio(url) {
            if (!('caches' in window)) return;
            try {
                const cache = await caches.open(CACHE_NAME);
                await cache.delete(url);
                delete this.savedManifest[url];
                this.saveManifest();
                return true;
            } catch (e) {
                return false;
            }
        }

        // Tạo nút tải ngoại tuyến gắn vào thanh audio player
        createDownloadButton(audioUrl, title, containerEl) {
            if (!containerEl) return;
            const btn = document.createElement('button');
            btn.className = 'px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95 text-slate-700 dark:text-slate-200';
            
            const updateUI = async () => {
                const cached = await this.isCached(audioUrl);
                if (cached) {
                    btn.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-500"></i><span class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Đã lưu offline</span>`;
                    btn.onclick = async (e) => {
                        e.stopPropagation();
                        if (confirm(`Bạn muốn xóa bài nghe "${title}" khỏi bộ nhớ ngoại tuyến?`)) {
                            await this.removeAudio(audioUrl);
                            updateUI();
                        }
                    };
                } else {
                    btn.innerHTML = `<i class="fa-solid fa-cloud-arrow-down text-sky-500"></i><span class="text-[11px]">Tải offline</span>`;
                    btn.onclick = async (e) => {
                        e.stopPropagation();
                        btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin text-sky-500"></i><span class="text-[11px]">Đang tải...</span>`;
                        await this.downloadAudio(audioUrl, title);
                        updateUI();
                    };
                }
            };

            updateUI();
            containerEl.appendChild(btn);
        }
    }

    window.OfflineAudioManager = new OfflineAudioManager();

})(window, document);
