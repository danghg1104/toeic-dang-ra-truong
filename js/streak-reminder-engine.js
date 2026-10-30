/**
 * =========================================================================
 * STREAK REMINDER & NOTIFICATION ENGINE (BƯỚC 4: NHẮC HỌC THÔNG MINH MOBILE)
 * =========================================================================
 * Thiết kế bởi Senior Product Designer kiêm Tech Lead:
 * 1. Web Notification API: Thông báo đẩy nhắc học bảo vệ chuỗi Streak hàng ngày.
 * 2. Smart Scheduling: Tự động kiểm tra lúc 20:00, nếu chưa hoàn thành nhiệm vụ ngày
 *    thì gửi thông báo động viên kèm hình ảnh Sói Mây.
 * 3. In-App Interactive Toast: Fallback hiển thị banner nhắc học khi không có quyền Notification.
 * =========================================================================
 */

(function (window, document) {
    'use strict';

    const STORAGE_KEY = 'soi_may_reminder_settings';

    class StreakReminderEngine {
        constructor() {
            this.settings = this.loadSettings();
            this.checkTimer = null;
            this.init();
        }

        loadSettings() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                return raw ? JSON.parse(raw) : {
                    enabled: true,
                    reminderHour: 20, // 20:00 tối
                    reminderMinute: 0,
                    lastNotifiedDate: null
                };
            } catch (e) {
                return { enabled: true, reminderHour: 20, reminderMinute: 0, lastNotifiedDate: null };
            }
        }

        saveSettings() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
            } catch (e) {}
        }

        async requestPermission() {
            if (!('Notification' in window)) {
                return 'unsupported';
            }
            if (Notification.permission === 'granted') {
                return 'granted';
            }
            try {
                const perm = await Notification.requestPermission();
                if (perm === 'granted') {
                    this.sendNotification(
                        'Thông báo Sói Mây đã sẵn sàng! 🐺',
                        'Sói Mây sẽ nhắc nhở bạn vào 20:00 mỗi tối để không bị đứt chuỗi Streak nhé!'
                    );
                }
                return perm;
            } catch (err) {
                return 'denied';
            }
        }

        init() {
            // Kiểm tra định kỳ mỗi 5 phút
            this.checkSchedule();
            this.checkTimer = setInterval(() => this.checkSchedule(), 5 * 60 * 1000);
            console.log('⏰ Streak Reminder Engine initialized. Daily reminder at', `${this.settings.reminderHour}:00`);
        }

        checkSchedule() {
            if (!this.settings.enabled) return;

            const now = new Date();
            const currentHour = now.getHours();
            const todayStr = now.toISOString().split('T')[0];

            // Nếu hôm nay đã gửi rồi thì không spam
            if (this.settings.lastNotifiedDate === todayStr) return;

            // Kiểm tra nếu đã đến giờ hẹn (từ reminderHour trở đi)
            if (currentHour >= this.settings.reminderHour) {
                // Kiểm tra xem người học đã học hôm nay chưa
                const state = window.state || {};
                const studyMinutes = state.studyMinutes || 0;
                const vocabLearned = state.vocabLearned || 0;

                if (studyMinutes === 0 && vocabLearned === 0) {
                    const streakCount = state.streak || 8;
                    this.sendNotification(
                        `Bảo toàn chuỗi Streak ${streakCount} ngày! 🔥`,
                        `Đăng ơi! Còn ít giờ nữa là qua ngày mới, vào lật nhanh 5 từ vựng cùng Sói Mây nhé! 🐺`
                    );
                    this.settings.lastNotifiedDate = todayStr;
                    this.saveSettings();
                }
            }
        }

        sendNotification(title, body) {
            // 1. Gửi qua hệ thống Notification của hệ điều hành / di động nếu được cấp quyền
            if ('Notification' in window && Notification.permission === 'granted') {
                try {
                    const notif = new Notification(title, {
                        body: body,
                        icon: 'assets/mascot/may_avatar.png',
                        badge: 'icon-192.png',
                        vibrate: [100, 50, 100],
                        data: { url: window.location.origin }
                    });
                    notif.onclick = () => {
                        window.focus();
                        if (typeof switchTab === 'function') switchTab('hom-nay');
                    };
                } catch (e) {
                    console.warn('[Reminder] ServiceWorker registration required for background push on this browser');
                }
            }

            // 2. Gửi qua Sói Mây Companion trong ứng dụng
            if (window.SoiMayCompanion) {
                window.SoiMayCompanion.encourage(body);
            }
        }

        // Tạo giao diện điều khiển Cài đặt Nhắc nhở để gắn vào Tab Cá nhân
        renderSettingsCard(containerEl) {
            if (!containerEl) return;
            containerEl.innerHTML = `
                <div class="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 space-y-3 shadow-xs">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center text-lg">
                                🔥
                            </div>
                            <div>
                                <h4 class="text-xs font-bold text-slate-900 dark:text-white">Nhắc học giữ Streak hàng ngày</h4>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400">Tự động báo giờ để không quên tích lũy XP</p>
                            </div>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" id="streakReminderToggle" ${this.settings.enabled ? 'checked' : ''} class="sr-only peer" onchange="window.StreakReminderEngine.toggleEnabled(this.checked)">
                            <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                        </label>
                    </div>

                    <div class="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                        <span class="text-slate-600 dark:text-slate-300 font-medium">Giờ thông báo mỗi tối:</span>
                        <select onchange="window.StreakReminderEngine.setHour(parseInt(this.value))" class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-slate-200">
                            <option value="19" ${this.settings.reminderHour === 19 ? 'selected' : ''}>19:00 (Sau bữa tối)</option>
                            <option value="20" ${this.settings.reminderHour === 20 ? 'selected' : ''}>20:00 (Giờ vàng học tập)</option>
                            <option value="21" ${this.settings.reminderHour === 21 ? 'selected' : ''}>21:00 (Trước khi ngủ)</option>
                            <option value="22" ${this.settings.reminderHour === 22 ? 'selected' : ''}>22:00 (Cú đêm)</option>
                        </select>
                    </div>

                    <button onclick="window.StreakReminderEngine.requestPermission()" class="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95">
                        <i class="fa-regular fa-bell text-xs text-blue-600"></i>
                        <span>Cho phép thông báo trên thiết bị này</span>
                    </button>
                </div>
            `;
        }

        toggleEnabled(enabled) {
            this.settings.enabled = enabled;
            this.saveSettings();
            if (enabled) {
                this.requestPermission();
            }
        }

        setHour(hour) {
            this.settings.reminderHour = hour;
            this.saveSettings();
        }
    }

    window.StreakReminderEngine = new StreakReminderEngine();

})(window, document);
