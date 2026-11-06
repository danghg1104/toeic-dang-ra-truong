/**
 * =========================================================================
 * TOEIC VOCABULARY PVP 1V1 ARENA — CLIENT ENGINE & UI CONTROLLER
 * =========================================================================
 * Đấu Trường Từ Vựng PvP 1v1 Thời Gian Thực (10 từ trong 60 giây):
 * - Kết nối WebSocket tới /ws/pvp (Tự động fallback bot thông minh nếu offline)
 * - Đếm ngược 60s nhấp nháy đỏ khẩn cấp khi còn <= 10 giây
 * - Nút đáp án rung lắc khi chọn sai (@keyframes shake) & âm thanh WebAudio ("ding!" nốt E6 khi đúng)
 * - Thu thập danh sách từ làm sai (missedWords) & kích hoạt AI "Vì sao em sai?" (F25 / T3.18)
 * - Hỗ trợ cả hai chế độ: Modal Overlay (open()) và Nhúng trực tiếp trong trang (renderInto())
 * =========================================================================
 */

(function (window, document) {
    'use strict';

    class PvPArenaClientClass {
        constructor() {
            this.ws = null;
            this.currentMatch = null;
            this.currentQuestionIndex = 0;
            this.myScore = 0;
            this.opponentScore = 0;
            this.myCombo = 0;
            this.opponentCombo = 0;
            this.remainingSeconds = 60;
            this.questionStartTime = 0;
            this.state = 'IDLE'; // IDLE | QUEUE | MATCH_FOUND | PLAYING | RESULT
            this.soundEngine = window.WebAudioMicroEngine || null;
            this.soundEnabled = true;
            this.missedWords = []; // Danh sách từ làm sai trong trận đấu
            this.inlineContainerId = null;
            this.currentTab = 'quick'; // 'quick' | 'room' | 'friends'
            this.onlineUsersList = [];
            this.friendsList = [];
            this.myFriendCode = 'HD-7133';
            this.currentRoomCode = null;
            this.activeInvite = null;
        }

        init() {
            this.ensureStyles();
            this.createModalDOM();
            this.loadFriendsList();
            try {
                if (location.hash && location.hash.includes('pvp_room=')) {
                    const match = location.hash.match(/pvp_room=([A-Za-z0-9]+)/);
                    if (match && match[1]) {
                        setTimeout(() => {
                            this.open();
                            this.setLobbyTab('room');
                            this.joinRoom(match[1]);
                        }, 800);
                    }
                }
            } catch (e) {}
        }

        ensureStyles() {
            if (document.getElementById('pvpArenaStyles')) return;
            const style = document.createElement('style');
            style.id = 'pvpArenaStyles';
            style.textContent = `
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    20%, 60% { transform: translateX(-6px); }
                    40%, 80% { transform: translateX(6px); }
                }
                .animate-shake {
                    animation: shake 0.4s ease-in-out !important;
                }
                @keyframes urgentPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.08); opacity: 0.85; }
                }
                .timer-urgent {
                    color: #f87171 !important;
                    background-color: rgba(239, 68, 68, 0.25) !important;
                    border: 1px solid rgba(239, 68, 68, 0.5) !important;
                    animation: urgentPulse 0.8s infinite ease-in-out !important;
                }
                @keyframes vsFireGlow {
                    0%, 100% {
                        box-shadow: 0 0 20px rgba(245, 158, 11, 0.4), inset 0 0 15px rgba(239, 68, 68, 0.3);
                        border-color: rgba(251, 191, 36, 0.8);
                    }
                    50% {
                        box-shadow: 0 0 35px rgba(245, 158, 11, 0.8), inset 0 0 25px rgba(239, 68, 68, 0.6);
                        border-color: rgba(254, 240, 138, 1);
                    }
                }
                .vs-fire-glow {
                    animation: vsFireGlow 2.2s infinite ease-in-out;
                }
            `;
            document.head.appendChild(style);
        }

        getBodyContainer() {
            if (this.inlineContainerId) {
                const el = document.getElementById(this.inlineContainerId);
                if (el) return el;
            }
            return document.getElementById('pvpArenaBody');
        }

        createModalDOM() {
            if (document.getElementById('pvpArenaModal')) return;

            const modal = document.createElement('div');
            modal.id = 'pvpArenaModal';
            modal.className = 'fixed inset-0 z-[11000] hidden flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md transition-all duration-300';
            modal.innerHTML = `
                <div class="relative w-full max-w-4xl bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl border border-indigo-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] artisan-ocean-stage">
                    <!-- Header -->
                    <div class="p-4 sm:p-5 border-b border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 bg-slate-950/70">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 p-[2px] shadow-lg shadow-orange-500/30 ring-2 ring-amber-400/25 flex items-center justify-center shrink-0">
                                <div class="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                                    <svg class="w-5 h-5 text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.85)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="4" y1="20" x2="20" y2="4"></line>
                                        <line x1="4" y1="4" x2="20" y2="20"></line>
                                        <polyline points="14 4 20 4 20 10"></polyline>
                                        <polyline points="4 14 4 20 10 20"></polyline>
                                        <circle cx="12" cy="12" r="2" fill="#FBBF24" stroke="none"></circle>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <h3 class="text-base sm:text-lg font-black tracking-tight text-white">
                                        Đấu Trường Từ Vựng 1v1
                                    </h3>
                                    <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                        Online Realtime
                                    </span>
                                </div>
                                <p class="text-xs text-slate-400 mt-0.5">10 từ vựng ETS 2026 · So tài phản xạ 60 giây trực tiếp giữa người với người</p>
                            </div>
                        </div>
                        <div class="flex items-center gap-2">
                            <button onclick="window.PvPArenaClient.copyPublicOnlineLink()" class="px-3 py-1.5 rounded-xl bg-indigo-600/60 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-400/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95" title="Sao chép link web để gửi bạn bè trên điện thoại / máy tính khác">
                                <i class="fa-solid fa-share-nodes text-xs"></i>
                                <span class="hidden sm:inline">Mời bạn đấu online</span>
                            </button>
                            <button onclick="window.PvPArenaClient.toggleSound()" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center text-xs transition cursor-pointer" title="Bật/Tắt âm thanh trận đấu">
                                <i class="fa-solid pvp-sound-icon ${this.soundEnabled ? 'fa-volume-high text-amber-400' : 'fa-volume-xmark text-slate-500'}"></i>
                            </button>
                            <button onclick="window.PvPArenaClient.close()" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition cursor-pointer" title="Đóng cửa sổ">
                                <i class="fa-solid fa-xmark text-sm"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Dynamic Body Container -->
                    <div id="pvpArenaBody" class="p-4 sm:p-6 flex-1 overflow-y-auto">
                        <!-- Rendered dynamically -->
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        renderInto(containerId = 'pvpArenaInlineContainer') {
            this.ensureStyles();
            const container = document.getElementById(containerId);
            if (!container) return;

            container.innerHTML = `
                <div class="relative w-full max-w-4xl mx-auto bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white rounded-3xl border border-indigo-500/40 shadow-2xl overflow-hidden flex flex-col min-h-[620px] artisan-ocean-stage">
                    <!-- Header Bar -->
                    <div class="p-4 sm:p-6 border-b border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 bg-slate-950/70 backdrop-blur-md">
                        <div class="flex items-center gap-3">
                            <div class="w-10 sm:w-12 h-10 sm:h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 p-[2px] shadow-lg shadow-orange-500/30 ring-2 sm:ring-4 ring-amber-400/25 flex items-center justify-center shrink-0">
                                <div class="w-full h-full rounded-[14px] bg-slate-950 flex items-center justify-center">
                                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.85)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                                        <line x1="4" y1="20" x2="20" y2="4"></line>
                                        <line x1="4" y1="4" x2="20" y2="20"></line>
                                        <polyline points="14 4 20 4 20 10"></polyline>
                                        <polyline points="4 14 4 20 10 20"></polyline>
                                        <circle cx="12" cy="12" r="2" fill="#FBBF24" stroke="none"></circle>
                                    </svg>
                                </div>
                            </div>
                            <div>
                                <div class="flex items-center gap-2 flex-wrap">
                                    <h3 class="text-lg sm:text-xl font-black tracking-tight text-white">
                                        Đấu Trường Từ Vựng 1v1
                                    </h3>
                                    <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1">
                                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                        Online Realtime
                                    </span>
                                </div>
                                <p class="text-xs text-slate-400 mt-0.5">10 từ vựng ETS 2026 · So tài phản xạ 60 giây trực tiếp giữa người với người</p>
                            </div>
                        </div>

                        <!-- Top Right Tools (Online Share & Sound Toggle) -->
                        <div class="flex items-center gap-2">
                            <button onclick="window.PvPArenaClient.copyPublicOnlineLink()" class="px-3 py-1.5 rounded-xl bg-indigo-600/60 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-400/40 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95" title="Sao chép link web để gửi bạn bè trên điện thoại / máy tính khác">
                                <i class="fa-solid fa-share-nodes text-xs"></i>
                                <span>Mời bạn đấu online</span>
                            </button>
                            <button onclick="window.PvPArenaClient.toggleSound()" class="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center text-xs transition cursor-pointer" title="Bật/Tắt âm thanh trận đấu">
                                <i class="fa-solid pvp-sound-icon ${this.soundEnabled ? 'fa-volume-high text-amber-400' : 'fa-volume-xmark text-slate-500'}"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Dynamic Body Container -->
                    <div id="pvpArenaInlineBody" class="p-4 sm:p-6 md:p-8 flex-1 overflow-y-auto">
                        <!-- Rendered dynamically -->
                    </div>
                </div>
            `;

            this.inlineContainerId = 'pvpArenaInlineBody';
            this.renderIdleView();
        }

        open() {
            this.inlineContainerId = null;
            this.createModalDOM();
            const modal = document.getElementById('pvpArenaModal');
            if (modal) modal.classList.remove('hidden');
            this.state = 'IDLE';
            this.renderIdleView();
        }

        close() {
            if (this.state === 'QUEUE' || this.state === 'PLAYING') {
                if (this.ws && this.currentMatch) {
                    try {
                        this.ws.send(JSON.stringify({ type: 'LEAVE_MATCH', matchId: this.currentMatch.matchId }));
                    } catch (e) {}
                }
            }
            if (this.ws) {
                try { this.ws.close(); } catch (e) {}
                this.ws = null;
            }
            const modal = document.getElementById('pvpArenaModal');
            if (modal) modal.classList.add('hidden');
            this.state = 'IDLE';
        }

        async loadFriendsList() {
            try {
                const user = window.currentUserAccount || {};
                const uId = user.id ? `?userId=${encodeURIComponent(user.id)}` : '';
                const res = await fetch(`/api/user/friends${uId}`, { credentials: 'include' });
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        this.friendsList = data.friends || [];
                        if (data.myFriendCode) this.myFriendCode = data.myFriendCode;
                    }
                }
            } catch (e) {
                console.warn('[PvP Client] loadFriendsList note:', e.message);
            }
        }

        copyFriendCode() {
            const code = this.myFriendCode || 'HD-7133';
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(code);
                if (typeof showToast === 'function') {
                    showToast('✨ Đã sao chép Mã Friend ID: ' + code + ' (Gửi mã này cho bạn bè)');
                }
            } else {
                prompt('Mã Friend ID của bạn:', code);
            }
        }

        async addFriend(code) {
            if (!code || !code.trim()) {
                if (typeof showToast === 'function') showToast('⚠️ Vui lòng nhập mã bạn bè!');
                else alert('Vui lòng nhập mã bạn bè!');
                return;
            }
            try {
                const user = window.currentUserAccount || {};
                const res = await fetch('/api/user/friends/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ friendCode: code.trim(), userId: user.id })
                });
                const data = await res.json();
                if (data.success) {
                    if (typeof showToast === 'function') showToast('🎉 ' + data.message);
                    await this.loadFriendsList();
                    this.renderIdleView();
                } else {
                    if (typeof showToast === 'function') showToast('⚠️ ' + (data.error || 'Không thể kết bạn'));
                    else alert(data.error);
                }
            } catch (e) {
                if (typeof showToast === 'function') showToast('⚠️ Lỗi kết nối: ' + e.message);
            }
        }

        async removeFriend(friendId, friendName) {
            if (!confirm(`Bạn có chắc muốn hủy kết bạn với ${friendName || 'người này'}?`)) return;
            try {
                const user = window.currentUserAccount || {};
                const res = await fetch('/api/user/friends/remove', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ friendId, userId: user.id })
                });
                const data = await res.json();
                if (data.success) {
                    if (typeof showToast === 'function') showToast('Đã xóa khỏi danh sách bạn bè.');
                    await this.loadFriendsList();
                    this.renderIdleView();
                }
            } catch (e) {
                console.error('Lỗi xóa bạn bè:', e);
            }
        }

        setLobbyTab(tab) {
            this.currentTab = tab;
            if (tab === 'friends') {
                this.loadFriendsList().then(() => this.renderIdleView());
            }
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                this.connectWebSocket();
            } else if (tab === 'friends') {
                const user = window.currentUserAccount || {};
                this.ws.send(JSON.stringify({ type: 'GET_ONLINE_USERS', userId: user.id || 'guest' }));
            }
            this.renderIdleView();
        }

        getPublicAppUrl() {
            if (typeof location !== 'undefined' && location.origin && !location.origin.includes('localhost') && !location.origin.includes('127.0.0.1')) {
                return location.origin;
            }
            return 'https://toeic-dang-ra-truong.onrender.com';
        }

        toggleSound() {
            this.soundEnabled = !this.soundEnabled;
            if (typeof showToast === 'function') {
                showToast(this.soundEnabled ? '🔊 Đã bật âm thanh đấu trường' : '🔇 Đã tắt âm thanh đấu trường');
            }
            const soundIcons = document.querySelectorAll('.pvp-sound-icon');
            soundIcons.forEach(icon => {
                icon.className = `fa-solid pvp-sound-icon ${this.soundEnabled ? 'fa-volume-high text-amber-400' : 'fa-volume-xmark text-slate-500'}`;
            });
        }

        copyPublicOnlineLink() {
            const url = this.getPublicAppUrl();
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url);
                if (typeof showToast === 'function') {
                    showToast('🔗 Đã sao chép link trực tuyến! Gửi cho bạn bè trên điện thoại hoặc máy khác để đấu 1v1 ngay.');
                }
            } else {
                prompt('Sao chép link web trực tuyến:', url);
            }
        }

        renderIdleView() {
            const body = this.getBodyContainer();
            if (!body) return;

            // Đảm bảo WS được kết nối để đồng bộ trạng thái trực tuyến
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                this.connectWebSocket();
            }

            let user = window.currentUserAccount;
            if (!user && typeof window.getCurrentUser === 'function') {
                user = window.getCurrentUser();
            }
            if (!user) {
                try {
                    const saved = localStorage.getItem('cung_dang_session_user');
                    if (saved) user = JSON.parse(saved);
                } catch(e) {}
            }
            user = user || {};
            const username = user.name || 'Huynh Dang';
            const initial = (username.trim()[0] || 'H').toUpperCase();
            const avatar = user.avatar || '/assets/mascot/may_avatar.png';

            const activeTabClass = 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-600 text-slate-950 shadow-lg shadow-orange-500/25 font-black scale-[1.02]';
            const inactiveTabClass = 'text-slate-400 hover:text-white hover:bg-slate-800/60 font-bold';

            body.innerHTML = `
                <div class="space-y-4 sm:space-y-5 py-1">
                    <!-- Tab Selector Navigation -->
                    <div class="grid grid-cols-3 gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-md">
                        <button onclick="window.PvPArenaClient.setLobbyTab('quick')" class="py-2.5 px-2 sm:px-3 rounded-xl text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${this.currentTab === 'quick' ? activeTabClass : inactiveTabClass}">
                            <i class="fa-solid fa-bolt text-sm"></i>
                            <span>Ghép Nhanh</span>
                        </button>
                        <button onclick="window.PvPArenaClient.setLobbyTab('room')" class="py-2.5 px-2 sm:px-3 rounded-xl text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${this.currentTab === 'room' ? activeTabClass : inactiveTabClass}">
                            <i class="fa-solid fa-door-open text-sm"></i>
                            <span>Phòng Riêng</span>
                        </button>
                        <button onclick="window.PvPArenaClient.setLobbyTab('friends')" class="py-2.5 px-2 sm:px-3 rounded-xl text-xs sm:text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${this.currentTab === 'friends' ? activeTabClass : inactiveTabClass}">
                            <i class="fa-solid fa-users text-sm"></i>
                            <span>Bạn Bè (${this.onlineUsersList.length})</span>
                        </button>
                    </div>

                    <!-- TAB 1: QUICK MATCH (SÀN ĐẤU ĐỐI KHÁNG 1V1 SIÊU CHUYÊN NGHIỆP) -->
                    ${this.currentTab === 'quick' ? `
                        <div class="space-y-4 sm:space-y-5 py-1">
                            <!-- Real-time Online Network Ribbon -->
                            <div class="flex flex-wrap items-center justify-between gap-2.5 px-4 py-2.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs">
                                <div class="flex items-center gap-2">
                                    <span class="relative flex h-2.5 w-2.5">
                                        <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                    </span>
                                    <span class="text-slate-300 font-bold">Máy chủ PvP Realtime:</span>
                                    <span class="text-emerald-400 font-extrabold flex items-center gap-1">
                                        Đang hoạt động · Sẵn sàng đấu online
                                    </span>
                                </div>
                                <div class="flex items-center gap-2 ml-auto">
                                    <button onclick="window.PvPArenaClient.copyPublicOnlineLink()" class="px-3 py-1.5 rounded-xl bg-indigo-600/60 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-400/30 text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95">
                                        <i class="fa-solid fa-share-nodes"></i>
                                        <span>Chia sẻ link đấu</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Versus Arena Stage (Sàn Đấu Đối Kháng 1v1 Đối Xứng) -->
                            <div class="relative p-3.5 sm:p-6 rounded-3xl bg-gradient-to-b from-slate-950/90 via-slate-900/90 to-indigo-950/50 border border-indigo-500/30 shadow-2xl overflow-hidden">
                                <div class="absolute -top-20 -left-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
                                <div class="absolute -bottom-20 -right-20 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>

                                <div class="relative grid grid-cols-7 md:grid-cols-11 gap-1.5 sm:gap-4 items-center">
                                    <!-- Player 1 Card (Bạn) -->
                                    <div class="col-span-3 md:col-span-5 p-2.5 sm:p-4 rounded-2xl bg-slate-900/90 border border-amber-500/30 flex flex-col items-center text-center shadow-lg relative group hover:border-amber-400/60 transition">
                                        <div class="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[9px] sm:text-[10px] font-black uppercase tracking-wider border border-amber-500/30 mb-1">
                                            Player 1 (Bạn)
                                        </div>
                                        <div class="relative my-1.5 sm:my-2">
                                            <div class="w-12 h-12 sm:w-20 sm:h-20 rounded-2xl ring-2 sm:ring-4 ring-amber-400/40 overflow-hidden shadow-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-800 flex items-center justify-center text-lg sm:text-2xl font-black text-white">
                                                ${user && user.avatar && !user.avatar.includes('soi_may_avt') ? `
                                                    <img src="${user.avatar}" alt="${username}" onerror="this.remove()" class="w-full h-full object-cover">
                                                ` : `
                                                    <span class="text-xl sm:text-3xl font-black text-white drop-shadow">${initial}</span>
                                                `}
                                            </div>
                                            <span class="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-[9px] sm:text-[10px] text-white font-black" title="Sẵn sàng">
                                                ✓
                                            </span>
                                        </div>
                                        <h4 class="text-xs sm:text-base font-black text-white truncate max-w-full">${username}</h4>
                                        <div class="mt-1 flex flex-wrap items-center justify-center gap-1">
                                            <span class="px-1.5 sm:px-2 py-0.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[9px] sm:text-[10px] font-black">
                                                🏅 Cao Thủ FSRS
                                            </span>
                                            <span class="hidden sm:inline-block px-2 py-0.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[10px] font-black">
                                                ⚡ 1,250 PTS
                                            </span>
                                        </div>
                                        <div class="mt-2.5 w-full pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-slate-400">
                                            <span class="text-amber-400">🔥 1 ngày</span>
                                            <span class="text-emerald-400">🎯 88%</span>
                                        </div>
                                    </div>

                                    <!-- Center VS Badge (Fixed: Scaled, zero clipping, aesthetic battle emblem) -->
                                    <div class="col-span-1 md:col-span-1 flex flex-col items-center justify-center my-0.5 md:my-0 select-none">
                                        <div class="relative flex flex-col items-center justify-center">
                                            <div class="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-600 blur-sm opacity-60 animate-pulse"></div>
                                            <div class="relative w-11 h-11 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-300 via-orange-500 to-red-600 p-[2px] shadow-2xl flex items-center justify-center border border-amber-200/90 vs-fire-glow">
                                                <div class="w-full h-full rounded-[10px] sm:rounded-[14px] bg-slate-950/95 flex flex-col items-center justify-center text-center px-1">
                                                    <span class="text-sm sm:text-xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-orange-400 leading-none filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">VS</span>
                                                    <span class="text-[8px] sm:text-[10px] font-black uppercase text-amber-400/90 tracking-wider leading-none mt-0.5">1v1</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="mt-1 px-2 py-0.5 rounded-full bg-slate-950/90 border border-amber-400/40 shadow-xs flex items-center justify-center">
                                            <span class="text-[8px] sm:text-[9.5px] font-black font-mono text-amber-300 tracking-wider leading-none">60s</span>
                                        </div>
                                    </div>

                                    <!-- Player 2 Card (Đối thủ slot) -->
                                    <div class="col-span-3 md:col-span-5 p-2.5 sm:p-4 rounded-2xl bg-slate-900/80 border border-indigo-500/30 flex flex-col items-center text-center shadow-lg relative group hover:border-indigo-400/60 transition">
                                        <div class="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[9px] sm:text-[10px] font-black uppercase tracking-wider border border-indigo-500/30 mb-1">
                                            Player 2 (Đối thủ)
                                        </div>
                                        <div class="relative my-1.5 sm:my-2">
                                            <div class="w-12 h-12 sm:w-20 sm:h-20 rounded-2xl border-2 border-dashed border-indigo-400/50 flex items-center justify-center bg-slate-950/60 text-lg sm:text-2xl text-indigo-400 shadow-inner">
                                                <i class="fa-solid fa-gamepad animate-pulse"></i>
                                            </div>
                                            <span class="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-indigo-500 border-2 border-slate-900 flex items-center justify-center text-[9px] sm:text-[10px] text-white font-black" title="Chờ ghép cặp">
                                                ?
                                            </span>
                                        </div>
                                        <h4 class="text-xs sm:text-base font-black text-slate-200 truncate max-w-full">Đối Thủ Toàn Cầu</h4>
                                        <div class="mt-1 flex flex-wrap items-center justify-center gap-1">
                                            <span class="px-1.5 sm:px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 text-[9px] sm:text-[10px] font-bold">
                                                🌐 Tự động
                                            </span>
                                            <span class="hidden sm:inline-block px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-400/30 text-[10px] font-bold">
                                                🐺 Sói Mây Fallback
                                            </span>
                                        </div>
                                        <div class="mt-2.5 w-full pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-slate-400">
                                            <span class="text-indigo-400">⚡ Tức thì</span>
                                            <span class="text-cyan-400">🎮 Online</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- 3 Value Cards (Format Rules & Rewards) -->
                            <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-2.5">
                                <div class="p-3 sm:p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 sm:gap-3">
                                    <div class="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs sm:text-sm font-black shrink-0 border border-amber-400/30">
                                        <i class="fa-solid fa-stopwatch"></i>
                                    </div>
                                    <div>
                                        <h6 class="text-xs font-black text-white">60 Giây Phản Xạ</h6>
                                        <p class="text-[11px] text-slate-400 leading-tight mt-0.5">Tốc độ cao, đúng liên tiếp kích hoạt Combo x2, x3 để nhân đôi điểm số!</p>
                                    </div>
                                </div>
                                <div class="p-3 sm:p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 sm:gap-3">
                                    <div class="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs sm:text-sm font-black shrink-0 border border-indigo-400/30">
                                        <i class="fa-solid fa-book-sparkles"></i>
                                    </div>
                                    <div>
                                        <h6 class="text-xs font-black text-white">10 Từ ETS 2026</h6>
                                        <p class="text-[11px] text-slate-400 leading-tight mt-0.5">Trích chọn từ ngân hàng đề thi chuẩn, 4 phương án phản xạ từ loại và ngữ nghĩa.</p>
                                    </div>
                                </div>
                                <div class="p-3 sm:p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-2.5 sm:gap-3">
                                    <div class="w-8 sm:w-9 h-8 sm:h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs sm:text-sm font-black shrink-0 border border-emerald-400/30">
                                        <i class="fa-solid fa-trophy"></i>
                                    </div>
                                    <div>
                                        <h6 class="text-xs font-black text-white">Rank & AI Soi Lỗi</h6>
                                        <p class="text-[11px] text-slate-400 leading-tight mt-0.5">Thắng nhận +25 Rank & +50 XP. Mọi từ làm sai được kích hoạt giải thích AI tức thì.</p>
                                    </div>
                                </div>
                            </div>

                            <!-- Big Prominent CTA Button -->
                            <div class="text-center pt-1">
                                <button onclick="window.PvPArenaClient.startMatchmaking()" class="w-full max-w-md mx-auto py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 hover:from-amber-300 hover:to-red-500 text-slate-950 font-black text-sm sm:text-base uppercase tracking-wider shadow-2xl shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5">
                                    <i class="fa-solid fa-bolt-lightning text-lg"></i>
                                    <span>Bắt Đầu Tìm Trận 1v1 Ngay</span>
                                </button>
                                <p class="text-xs text-slate-400 mt-2 sm:mt-2.5">
                                    💡 Muốn thi đấu riêng với bạn bè? Chọn tab <button onclick="window.PvPArenaClient.setLobbyTab('room')" class="text-amber-400 hover:underline font-bold cursor-pointer">Phòng Riêng</button> để tạo mã 6 số chia sẻ!
                                </p>
                            </div>
                        </div>
                    ` : ''}

                    <!-- TAB 2: CUSTOM ROOM (MÃ PHÒNG RIÊNG CHO BẠN BÈ) -->
                    ${this.currentTab === 'room' ? `
                        <div class="space-y-4 sm:space-y-5 text-center py-1">
                            ${this.currentRoomCode ? `
                                <!-- Đang Chờ Trong Phòng -->
                                <div class="p-6 rounded-3xl bg-slate-950/90 border-2 border-amber-500/50 shadow-2xl max-w-md mx-auto space-y-4">
                                    <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-black uppercase tracking-wider">
                                        <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                                        <span>Phòng Thi Đấu Riêng Sẵn Sàng</span>
                                    </div>
                                    <div class="space-y-1">
                                        <span class="text-xs font-bold text-slate-400 uppercase">Mã PIN Tham Gia</span>
                                        <div class="text-4xl sm:text-5xl font-black font-mono tracking-widest text-amber-300 bg-slate-900 py-3.5 px-6 rounded-2xl border border-amber-400/40 select-all shadow-inner">
                                            ${this.currentRoomCode}
                                        </div>
                                    </div>
                                    <p class="text-xs text-slate-300 leading-relaxed">
                                        Gửi mã này hoặc copy link bên dưới gửi qua Zalo / Messenger để bạn bè vào phòng đấu 1v1 ngay lập tức:
                                    </p>
                                    <div class="grid grid-cols-2 gap-2.5 pt-1">
                                        <button onclick="window.PvPArenaClient.copyRoomCode()" class="py-3 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95">
                                            <i class="fa-regular fa-copy"></i>
                                            <span>Sao chép mã</span>
                                        </button>
                                        <button onclick="window.PvPArenaClient.copyRoomLink()" class="py-3 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md active:scale-95">
                                            <i class="fa-solid fa-link"></i>
                                            <span>Sao chép Link Mời</span>
                                        </button>
                                    </div>
                                    <!-- Public Online Link Display Box -->
                                    <div class="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-left space-y-1">
                                        <div class="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                                            <span>🌐 Link trực tiếp qua Internet:</span>
                                            <span class="text-emerald-400 font-extrabold">Online sẵn sàng</span>
                                        </div>
                                        <div class="text-[11.5px] font-mono text-indigo-300 truncate select-all">
                                            ${this.getPublicAppUrl()}/#pvp_room=${this.currentRoomCode}
                                        </div>
                                    </div>
                                    <div class="pt-2 border-t border-slate-800">
                                        <button onclick="window.PvPArenaClient.cancelRoom()" class="text-xs text-rose-400 hover:text-rose-300 font-bold cursor-pointer">
                                            ✕ Hủy phòng thi đấu này
                                        </button>
                                    </div>
                                </div>
                            ` : `
                                <!-- Chưa Tạo Phòng: Cho phép tạo hoặc vào phòng -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl mx-auto text-left">
                                    <!-- Cột 1: Tạo phòng mới -->
                                    <div class="p-5 sm:p-6 rounded-3xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-amber-400/40 transition">
                                        <div class="space-y-2">
                                            <div class="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-black border border-amber-400/30">
                                                <i class="fa-solid fa-plus"></i>
                                            </div>
                                            <h5 class="text-base font-extrabold text-white">Tạo Phòng Mới</h5>
                                            <p class="text-xs text-slate-400 leading-relaxed">
                                                Hệ thống tạo mã 6 chữ số độc quyền. Bạn gửi mã hoặc link này cho bạn bè trên điện thoại hoặc máy khác để cùng vào thi đấu.
                                            </p>
                                        </div>
                                        <button onclick="window.PvPArenaClient.createRoom()" class="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg active:scale-95 text-center">
                                            🏠 Tạo Phòng Ngay
                                        </button>
                                    </div>

                                    <!-- Cột 2: Vào bằng mã phòng -->
                                    <div class="p-5 sm:p-6 rounded-3xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-400/40 transition">
                                        <div class="space-y-2">
                                            <div class="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl font-black border border-indigo-400/30">
                                                <i class="fa-solid fa-right-to-bracket"></i>
                                            </div>
                                            <h5 class="text-base font-extrabold text-white">Vào Bằng Mã Phòng</h5>
                                            <p class="text-xs text-slate-400 leading-relaxed">
                                                Nhập mã PIN 6 chữ số do bạn bè chia sẻ để bắt đầu màn đấu đối kháng 1v1 trực tiếp.
                                            </p>
                                        </div>
                                        <div class="space-y-2.5">
                                            <input type="text" id="pvpJoinRoomInput" placeholder="Ví dụ: 849201" maxlength="10" class="w-full py-2.5 px-3 text-center text-base font-mono font-black text-white bg-slate-900 border border-slate-700 rounded-xl focus:border-indigo-400 focus:outline-none uppercase">
                                            <button onclick="window.PvPArenaClient.joinRoom(document.getElementById('pvpJoinRoomInput').value)" class="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-lg active:scale-95 text-center">
                                                Vào Trận Đấu ➔
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            `}
                        </div>
                    ` : ''}

                    <!-- TAB 3: BẠN BÈ & THÁCH ĐẤU 1V1 (FRIEND CODE & LIVE PRESENCE) -->
                    ${this.currentTab === 'friends' ? `
                        <div class="space-y-4 py-1">
                            <!-- Section 1: Thẻ Mã Friend ID Của Tôi -->
                            <div class="p-4 sm:p-5 rounded-3xl bg-slate-950/80 border border-amber-400/30 shadow-lg relative overflow-hidden">
                                <div class="absolute -top-10 -right-10 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
                                <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 relative z-10">
                                    <div class="space-y-1">
                                        <div class="flex items-center gap-2">
                                            <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                                            <span class="text-xs font-black uppercase text-amber-400 tracking-wider">Mã Friend ID Của Bạn</span>
                                        </div>
                                        <div class="flex items-center gap-2 pt-0.5">
                                            <span class="px-4 py-1.5 rounded-xl bg-slate-900 border border-amber-400/50 text-amber-300 font-mono font-black text-lg sm:text-xl tracking-wider shadow-inner select-all">
                                                ${this.myFriendCode || 'HD-7133'}
                                            </span>
                                            <button onclick="window.PvPArenaClient.copyFriendCode()" class="py-2 px-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-md active:scale-95">
                                                <i class="fa-regular fa-copy"></i>
                                                <span>Sao chép mã</span>
                                            </button>
                                        </div>
                                        <p class="text-[11px] text-slate-400 pt-0.5 leading-snug">
                                            Chia sẻ mã này để bạn bè kết bạn và gửi lời mời đấu 1v1 trực tiếp bất cứ lúc nào.
                                        </p>
                                    </div>
                                    <div class="shrink-0 flex items-center gap-2">
                                        <button onclick="window.PvPArenaClient.refreshFriendsList()" class="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer flex items-center gap-1.5">
                                            <i class="fa-solid fa-rotate text-[11px]"></i>
                                            <span>Làm mới</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <!-- Section 2: Ô Nhập Mã Để Kết Bạn -->
                            <div class="p-3.5 sm:p-4 rounded-2xl bg-slate-950/70 border border-slate-800 shadow-md">
                                <span class="block text-xs font-extrabold text-white mb-2">Thêm Bạn Bè Mới Bằng Mã ID:</span>
                                <div class="flex items-center gap-2">
                                    <div class="relative flex-1">
                                        <i class="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs"></i>
                                        <input type="text" id="pvpAddFriendInput" placeholder="Nhập mã bạn bè (Ví dụ: KT-2026 hoặc HD-7133)..." 
                                            class="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-amber-400 text-white font-mono text-xs sm:text-sm uppercase placeholder-slate-500 focus:outline-none transition">
                                    </div>
                                    <button onclick="window.PvPArenaClient.addFriend(document.getElementById('pvpAddFriendInput').value)" 
                                        class="py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shrink-0 cursor-pointer shadow-md active:scale-95 transition">
                                        + Kết Bạn
                                    </button>
                                </div>
                            </div>

                            <!-- Section 3: Danh Sách Bạn Bè Đã Kết Bạn -->
                            <div class="space-y-2.5">
                                <div class="flex items-center justify-between text-xs text-slate-300 px-1 font-bold">
                                    <span>Danh sách bạn bè (${this.friendsList.length}):</span>
                                    <span class="text-emerald-400 font-extrabold">
                                        ${this.friendsList.filter(f => f.isOnline || this.onlineUsersList.some(u => u.userId === f.id || (u.friendCode && u.friendCode === f.friendCode))).length} Đang Online
                                    </span>
                                </div>

                                ${this.friendsList.length === 0 ? `
                                    <div class="p-8 rounded-3xl bg-slate-950/50 border border-slate-800/80 text-center space-y-3 max-w-md mx-auto">
                                        <div class="text-3xl">🤝</div>
                                        <h5 class="text-sm font-bold text-white">Chưa có bạn bè nào trong danh bạ</h5>
                                        <p class="text-xs text-slate-400 leading-relaxed">
                                            Nhập mã Friend ID của bạn học ở trên hoặc gửi mã <strong>${this.myFriendCode}</strong> cho bạn bè để kết nối cùng học tập và so tài!
                                        </p>
                                    </div>
                                ` : `
                                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        ${this.friendsList.map(f => {
                                            const isOnline = f.isOnline || this.onlineUsersList.some(u => u.userId === f.id || (u.friendCode && u.friendCode === f.friendCode));
                                            const liveUser = this.onlineUsersList.find(u => u.userId === f.id || (u.friendCode && u.friendCode === f.friendCode));
                                            const status = liveUser ? liveUser.status : (isOnline ? 'IDLE' : 'OFFLINE');
                                            const initial = (f.name ? f.name.trim()[0] : 'B').toUpperCase();
                                            return `
                                                <div class="p-3.5 rounded-2xl bg-slate-950/75 border border-slate-800 hover:border-amber-400/40 flex items-center justify-between gap-3 shadow-sm transition">
                                                    <div class="flex items-center gap-3 overflow-hidden min-w-0">
                                                        <div class="relative w-10 h-10 shrink-0">
                                                            <div class="w-full h-full rounded-xl ${f.avatarColor || 'bg-indigo-600'} flex items-center justify-center text-white font-bold text-sm">
                                                                ${f.avatar ? `<img src="${f.avatar}" onerror="this.remove()" class="w-full h-full rounded-xl object-cover">` : initial}
                                                            </div>
                                                            <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full ${status === 'IN_MATCH' ? 'bg-amber-500' : (isOnline ? 'bg-emerald-500' : 'bg-slate-600')} border-2 border-slate-900"></span>
                                                        </div>
                                                        <div class="truncate">
                                                            <div class="flex items-center gap-1.5">
                                                                <span class="text-xs font-bold text-white truncate">${f.name || f.username}</span>
                                                                <span class="px-1.5 py-0.2 rounded bg-slate-800 text-amber-300 font-mono text-[9.5px] font-bold shrink-0">${f.friendCode || ''}</span>
                                                            </div>
                                                            <span class="text-[10px] font-semibold ${isOnline ? 'text-emerald-400' : 'text-slate-400'}">
                                                                ${status === 'IN_MATCH' ? '⚔️ Đang trong trận' : (isOnline ? '🟢 Đang Online' : '⚪ Ngoại tuyến')}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div class="flex items-center gap-1.5 shrink-0">
                                                        ${isOnline && status !== 'IN_MATCH' ? `
                                                            <button onclick="window.PvPArenaClient.inviteUser('${f.id}', '${f.name}', '${f.friendCode}')" 
                                                                class="px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 text-slate-950 shadow-xs cursor-pointer hover:scale-105 active:scale-95 transition">
                                                                ⚔️ Mời Đấu
                                                            </button>
                                                        ` : `
                                                            <button disabled class="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed">
                                                                ${status === 'IN_MATCH' ? 'Đang đấu' : 'Ngoại tuyến'}
                                                            </button>
                                                        `}
                                                        <button onclick="window.PvPArenaClient.removeFriend('${f.id}', '${f.name}')" class="w-7 h-7 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 flex items-center justify-center transition cursor-pointer" title="Xóa bạn bè">
                                                            <i class="fa-solid fa-xmark text-xs"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                `}
                            </div>
                        </div>
                    ` : ''}
                </div>
            `;
        }

        createRoom() {
            const user = window.currentUserAccount || {};
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                this._pendingWsAction = 'CREATE_ROOM';
                this.connectWebSocket();
            } else {
                this.ws.send(JSON.stringify({
                    type: 'CREATE_ROOM',
                    userId: user.id || 'guest_' + Date.now(),
                    username: user.name || 'Chủ Phòng TOEIC',
                    avatar: user.avatar || '/assets/mascot/soi_may_avt.png'
                }));
            }
        }

        joinRoom(code) {
            if (!code || !code.trim()) {
                alert('Vui lòng nhập mã phòng hợp lệ!');
                return;
            }
            const cleanCode = code.trim().toUpperCase();
            const user = window.currentUserAccount || {};
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                this._pendingWsAction = { type: 'JOIN_ROOM', roomCode: cleanCode };
                this.connectWebSocket();
            } else {
                this.ws.send(JSON.stringify({
                    type: 'JOIN_ROOM',
                    roomCode: cleanCode,
                    userId: user.id || 'guest_' + Date.now(),
                    username: user.name || 'Bạn Học TOEIC',
                    avatar: user.avatar || '/assets/mascot/soi_may_avt.png'
                }));
            }
        }

        cancelRoom() {
            if (this.ws && this.currentRoomCode) {
                this.ws.send(JSON.stringify({
                    type: 'CANCEL_ROOM',
                    roomCode: this.currentRoomCode
                }));
            }
            this.currentRoomCode = null;
            this.renderIdleView();
        }

        copyRoomCode() {
            if (!this.currentRoomCode) return;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(this.currentRoomCode);
                if (typeof showToast === 'function') showToast('📋 Đã sao chép mã phòng: ' + this.currentRoomCode);
            } else {
                prompt('Sao chép mã phòng:', this.currentRoomCode);
            }
        }

        copyRoomLink() {
            if (!this.currentRoomCode) return;
            const link = this.getPublicAppUrl() + '/#pvp_room=' + this.currentRoomCode;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(link);
                if (typeof showToast === 'function') showToast('🔗 Đã sao chép liên kết mời bạn: ' + link);
            } else {
                prompt('Sao chép link mời bạn:', link);
            }
        }

        async refreshFriendsList() {
            await this.loadFriendsList();
            this.refreshOnlineList();
        }

        refreshOnlineList() {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                const user = window.currentUserAccount || {};
                this.ws.send(JSON.stringify({ type: 'GET_ONLINE_USERS', userId: user.id || 'guest' }));
                if (typeof showToast === 'function') showToast('🔄 Đang cập nhật danh sách bạn bè...');
            } else {
                this.connectWebSocket();
            }
        }

        inviteUser(targetUserId, targetUsername, targetFriendCode = '') {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                this.connectWebSocket();
                setTimeout(() => this.inviteUser(targetUserId, targetUsername, targetFriendCode), 600);
                return;
            }
            const user = window.currentUserAccount || {};
            this.ws.send(JSON.stringify({
                type: 'INVITE_FRIEND',
                targetUserId,
                targetFriendCode,
                fromUser: {
                    userId: user.id || 'guest_' + Date.now(),
                    username: user.name || 'Chiến Binh TOEIC',
                    friendCode: this.myFriendCode || user.friendCode || 'HD-7133',
                    avatar: user.avatar || '/assets/mascot/soi_may_avt.png'
                }
            }));
            if (typeof showToast === 'function') {
                showToast('⚔️ Đang gửi lời thách đấu tới ' + targetUsername + '...');
            }
        }

        showIncomingInvite(data) {
            const fromUser = data.fromUser || {};
            const inviteId = data.inviteId;

            // Âm thanh chuông báo mời đấu (E6 ding!)
            if (this.soundEnabled) {
                try {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;
                    if (AudioCtx) {
                        const ctx = new AudioCtx();
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(880, ctx.currentTime);
                        osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
                        gain.gain.setValueAtTime(0.25, ctx.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start();
                        osc.stop(ctx.currentTime + 0.4);
                    }
                } catch (e) {}
            }

            // Xóa lời mời cũ nếu có
            const oldBox = document.getElementById('pvpIncomingInviteModal');
            if (oldBox) oldBox.remove();

            const inviteModal = document.createElement('div');
            inviteModal.id = 'pvpIncomingInviteModal';
            inviteModal.className = 'fixed top-4 right-4 sm:right-6 z-[99999] max-w-sm w-[92vw] sm:w-full bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 border-2 border-amber-400/90 text-white rounded-3xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(245,158,11,0.35)] animate-bounce';
            inviteModal.innerHTML = `
                <div class="flex items-start gap-3">
                    <div class="relative w-12 h-12 shrink-0">
                        <img src="${fromUser.avatar || '/assets/mascot/soimay_reading_square.png'}" onerror="this.src='/assets/mascot/may_reading.png'" class="w-full h-full rounded-2xl object-cover border-2 border-amber-400">
                        <span class="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950"></span>
                    </div>
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <span class="text-[10.5px] font-black text-amber-400 uppercase tracking-wider">✨ Thách Đấu 1v1</span>
                            ${fromUser.friendCode ? `<span class="px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 font-mono text-[10px] font-bold">${fromUser.friendCode}</span>` : ''}
                        </div>
                        <div class="text-sm font-extrabold text-white truncate mt-0.5">${fromUser.username || 'Bạn học'}</div>
                        <p class="text-xs text-slate-300 mt-1 leading-snug">Vừa mời bạn vào so tài 10 từ vựng phản xạ 60 giây!</p>
                        <div class="flex items-center gap-2 mt-3.5">
                            <button onclick="window.PvPArenaClient.acceptInvite('${inviteId}')" class="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-black transition cursor-pointer shadow-md active:scale-95 flex items-center gap-1.5">
                                <span>⚔️ Chấp nhận</span>
                            </button>
                            <button onclick="window.PvPArenaClient.rejectInvite('${inviteId}')" class="px-3.5 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer">
                                Từ chối
                            </button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(inviteModal);

            // Tự động đóng sau 18 giây nếu không phản hồi
            setTimeout(() => {
                if (document.getElementById('pvpIncomingInviteModal')) {
                    document.getElementById('pvpIncomingInviteModal').remove();
                }
            }, 18000);
        }

        acceptInvite(inviteId) {
            const modal = document.getElementById('pvpIncomingInviteModal');
            if (modal) modal.remove();

            this.open();
            const user = window.currentUserAccount || {};
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    type: 'ACCEPT_INVITE',
                    inviteId,
                    user: {
                        userId: user.id || 'guest_' + Date.now(),
                        username: user.name || 'Chiến Binh TOEIC',
                        avatar: user.avatar || '/assets/mascot/soi_may_avt.png'
                    }
                }));
            }
        }

        rejectInvite(inviteId) {
            const modal = document.getElementById('pvpIncomingInviteModal');
            if (modal) modal.remove();

            const user = window.currentUserAccount || {};
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    type: 'REJECT_INVITE',
                    inviteId,
                    user: { username: user.name || 'Bạn học' }
                }));
            }
        }

        startMatchmaking() {
            this.state = 'QUEUE';
            this.renderQueueView();
            this.connectWebSocket();
        }

        renderQueueView() {
            const body = this.getBodyContainer();
            if (!body) return;

            body.innerHTML = `
                <div class="space-y-8 text-center py-8">
                    <!-- Radar Search Animation -->
                    <div class="relative w-36 h-36 mx-auto flex items-center justify-center">
                        <div class="absolute inset-0 rounded-full border-2 border-amber-500/40 animate-ping"></div>
                        <div class="absolute inset-4 rounded-full border-2 border-indigo-400/50 animate-pulse"></div>
                        <div class="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-3xl text-white shadow-xl">
                            <i class="fa-solid fa-magnifying-glass animate-spin" style="animation-duration: 3s;"></i>
                        </div>
                    </div>

                    <div class="space-y-2">
                        <h4 class="text-lg font-black text-white">Đang Quét Đối Thủ Trực Tuyến...</h4>
                        <p class="text-xs text-slate-400 max-w-sm mx-auto">Đang tìm bạn học phù hợp trong phòng thi TOEIC. Tự động ghép đối thủ Sói Mây AI sau 5 giây nếu không có người thật.</p>
                    </div>

                    <button onclick="window.PvPArenaClient.renderIdleView()" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition cursor-pointer">
                        Hủy Ghép Trận
                    </button>
                </div>
            `;
        }

        connectWebSocket() {
            const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
            const wsUrl = `${protocol}//${location.host}/ws/pvp`;

            try {
                this.ws = new WebSocket(wsUrl);

                this.ws.onopen = () => {
                    const user = window.currentUserAccount || {};
                    const uId = user.id || 'guest_' + Date.now();
                    const uName = user.name || 'Chiến Binh TOEIC';
                    const uAvt = user.avatar || '/assets/mascot/soi_may_avt.png';

                    // Đăng ký danh tính lên máy chủ
                    this.ws.send(JSON.stringify({
                        type: 'REGISTER_USER',
                        userId: uId,
                        username: uName,
                        avatar: uAvt,
                        friendCode: this.myFriendCode || user.friendCode || 'HD-7133'
                    }));

                    // Yêu cầu danh sách bạn bè trực tuyến
                    this.ws.send(JSON.stringify({ type: 'GET_ONLINE_USERS', userId: uId }));

                    if (this._pendingWsAction === 'QUEUE') {
                        this.ws.send(JSON.stringify({
                            type: 'JOIN_QUEUE',
                            userId: uId,
                            username: uName,
                            avatar: uAvt
                        }));
                        this._pendingWsAction = null;
                    } else if (this._pendingWsAction === 'CREATE_ROOM') {
                        this.ws.send(JSON.stringify({
                            type: 'CREATE_ROOM',
                            userId: uId,
                            username: uName,
                            avatar: uAvt
                        }));
                        this._pendingWsAction = null;
                    } else if (this._pendingWsAction && this._pendingWsAction.type === 'JOIN_ROOM') {
                        this.ws.send(JSON.stringify({
                            type: 'JOIN_ROOM',
                            roomCode: this._pendingWsAction.roomCode,
                            userId: uId,
                            username: uName,
                            avatar: uAvt
                        }));
                        this._pendingWsAction = null;
                    }
                };

                this.ws.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data);
                        this.handleServerMessage(data);
                    } catch (e) {
                        console.error('[PvP Client] Message parse error:', e);
                    }
                };

                this.ws.onerror = () => {
                    this.fallbackLocalBotMatch();
                };

                this.ws.onclose = () => {
                    if (this.state === 'PLAYING') {
                        console.warn('[PvP Client] WS Closed during game.');
                    }
                };
            } catch (err) {
                console.warn('[PvP Client] WS connection failed, using fallback bot:', err.message);
                this.fallbackLocalBotMatch();
            }
        }

        fallbackLocalBotMatch() {
            setTimeout(() => {
                const sampleWords = [
                    { word: 'postpone', phonetic: '/poʊstˈpoʊn/', meaning: 'hoãn lại, dời lịch', options: ['hủy bỏ hoàn toàn', 'hoãn lại, dời lịch', 'thúc đẩy nhanh', 'ký hợp đồng'], correctIndex: 1 },
                    { word: 'reimburse', phonetic: '/ˌriː.ɪmˈbɝːs/', meaning: 'hoàn tiền, thanh toán lại', options: ['vay tiền ngân hàng', 'từ chối bồi thường', 'hoàn tiền, thanh toán lại', 'đầu tư mạo hiểm'], correctIndex: 2 },
                    { word: 'mandatory', phonetic: '/ˈmæn.də.tɔːr.i/', meaning: 'bắt buộc theo quy định', options: ['tùy chọn', 'bắt buộc theo quy định', 'khuyến khích', 'tạm thời hoãn'], correctIndex: 1 },
                    { word: 'negotiate', phonetic: '/nəˈɡoʊ.ʃi.eɪt/', meaning: 'đàm phán, thương lượng', options: ['đàm phán, thương lượng', 'chấm dứt hợp tác', 'ký biên bản phạt', 'tăng giá đơn phương'], correctIndex: 0 },
                    { word: 'complimentary', phonetic: '/ˌkɑːm.pləˈmen.tər.i/', meaning: 'miễn phí (dịch vụ kèm theo)', options: ['đắt đỏ', 'tính phí bổ sung', 'miễn phí (dịch vụ kèm theo)', 'dành riêng VIP'], correctIndex: 2 }
                ];
                this.handleServerMessage({
                    type: 'MATCH_FOUND',
                    matchId: 'local_bot_' + Date.now(),
                    duration: 60,
                    words: sampleWords,
                    me: { username: 'Bạn' },
                    opponent: { username: 'Sói Mây AI Bot 🐺', isBot: true }
                });
            }, 1500);
        }

        handleServerMessage(data) {
            switch (data.type) {
                case 'ONLINE_USERS_LIST':
                    this.onlineUsersList = data.users || [];
                    if (this.currentTab === 'friends' && this.state === 'IDLE') {
                        this.renderIdleView();
                    }
                    break;
                case 'ROOM_CREATED':
                    this.currentRoomCode = data.roomCode;
                    this.renderIdleView();
                    if (typeof showToast === 'function') showToast('🏠 Phòng ' + data.roomCode + ' đã được tạo!');
                    break;
                case 'ROOM_ERROR':
                    alert('⚠️ ' + (data.message || 'Lỗi phòng thi'));
                    this.currentRoomCode = null;
                    this.renderIdleView();
                    break;
                case 'ROOM_CANCELLED':
                    this.currentRoomCode = null;
                    this.renderIdleView();
                    break;
                case 'FRIEND_INVITATION':
                    this.showIncomingInvite(data);
                    break;
                case 'INVITE_SENT':
                    if (typeof showToast === 'function') showToast('✉️ ' + (data.message || 'Đã gửi lời mời thách đấu!'));
                    break;
                case 'INVITE_REJECTED':
                    alert('👋 ' + (data.message || 'Bạn của bạn đã từ chối lời thách đấu.'));
                    break;
                case 'INVITE_ERROR':
                    alert('⚠️ ' + (data.message || 'Không thể gửi lời mời.'));
                    break;
                case 'MATCH_FOUND':
                    this.onMatchFound(data);
                    break;
                case 'TICK_SYNC':
                    this.onTickSync(data.remainingSeconds);
                    break;
                case 'SCORE_UPDATE':
                    this.onScoreUpdate(data);
                    break;
                case 'MATCH_END':
                    this.onMatchEnd(data);
                    break;
                default:
                    break;
            }
        }

        onMatchFound(data) {
            this.state = 'MATCH_FOUND';
            this.currentMatch = data;
            this.currentQuestionIndex = 0;
            this.myScore = 0;
            this.opponentScore = 0;
            this.myCombo = 0;
            this.opponentCombo = 0;
            this.remainingSeconds = data.duration || 60;
            this.missedWords = []; // Reset danh sách từ làm sai cho trận mới

            const body = this.getBodyContainer();
            if (!body) return;

            body.innerHTML = `
                <div class="space-y-6 text-center py-6 animate-in zoom-in-95 duration-300">
                    <span class="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black uppercase tracking-wider">
                        ⚡ ĐÃ TÌM THẤY ĐỐI THỦ!
                    </span>

                    <!-- Faceoff Verses -->
                    <div class="flex items-center justify-around max-w-md mx-auto py-4">
                        <div class="space-y-2 text-center">
                            <div class="w-16 h-16 mx-auto rounded-2xl bg-indigo-600/30 border-2 border-indigo-400 p-1 flex items-center justify-center">
                                <i class="fa-solid fa-user-astronaut text-2xl text-indigo-300"></i>
                            </div>
                            <span class="block text-xs font-black text-white">${data.me?.username || 'Bạn'}</span>
                            <span class="text-[10px] text-indigo-400 font-bold">Người Thách Đấu</span>
                        </div>

                        <div class="text-3xl font-black text-amber-400 italic animate-pulse">VS</div>

                        <div class="space-y-2 text-center">
                            <div class="w-16 h-16 mx-auto rounded-2xl bg-red-600/30 border-2 border-red-400 p-1 flex items-center justify-center">
                                <i class="fa-solid fa-robot text-2xl text-red-300"></i>
                            </div>
                            <span class="block text-xs font-black text-white">${data.opponent?.username || 'Đối Thủ'}</span>
                            <span class="text-[10px] text-red-400 font-bold">${data.opponent?.isBot ? 'Bot Thông Minh' : 'Sinh Viên'}</span>
                        </div>
                    </div>

                    <div class="text-3xl font-black text-amber-300" id="pvpMatchCountdown">Trận đấu bắt đầu sau 3...</div>
                </div>
            `;

            let cd = 3;
            const cdTimer = setInterval(() => {
                cd--;
                const el = document.getElementById('pvpMatchCountdown');
                if (el) el.textContent = `Trận đấu bắt đầu sau ${cd}...`;
                if (cd <= 0) {
                    clearInterval(cdTimer);
                    this.state = 'PLAYING';
                    this.renderGameView();
                }
            }, 1000);
        }

        renderGameView() {
            const body = this.getBodyContainer();
            if (!body || !this.currentMatch) return;

            const currentWord = this.currentMatch.words[this.currentQuestionIndex];
            if (!currentWord) return;

            this.questionStartTime = Date.now();

            body.innerHTML = `
                <div class="space-y-5">
                    <!-- Battle HUD Header -->
                    <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                        <!-- My Score & Combo -->
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/50 flex items-center justify-center font-black text-white text-sm">
                                ${this.currentQuestionIndex + 1}/10
                            </div>
                            <div>
                                <span class="block text-[10px] font-bold uppercase text-slate-400">Điểm Của Bạn</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-xl font-black text-white" id="pvpMyScore">${this.myScore}</span>
                                    <span class="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black ${this.myCombo >= 2 ? '' : 'hidden'}" id="pvpMyCombo">
                                        🔥 x${this.myCombo}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Countdown Timer 60s -->
                        <div class="text-center">
                            <span class="block text-[10px] font-bold text-slate-400 uppercase">Thời Gian</span>
                            <div class="text-xl font-mono text-amber-300 font-bold transition-all duration-300" id="pvpCountdown">
                                ${this.remainingSeconds}s
                            </div>
                        </div>

                        <!-- Opponent Score -->
                        <div class="flex items-center gap-3 text-right">
                            <div>
                                <span class="block text-[10px] font-bold uppercase text-slate-400">${this.currentMatch.opponent?.username || 'Đối Thủ'}</span>
                                <div class="flex items-center justify-end gap-2">
                                    <span class="px-1.5 py-0.5 rounded-md bg-red-500/20 text-red-300 text-[10px] font-black ${this.opponentCombo >= 2 ? '' : 'hidden'}" id="pvpOpponentCombo">
                                        🔥 x${this.opponentCombo}
                                    </span>
                                    <span class="text-xl font-black text-slate-300" id="pvpOpponentScore">${this.opponentScore}</span>
                                </div>
                            </div>
                            <div class="w-10 h-10 rounded-xl bg-red-600/30 border border-red-400/50 flex items-center justify-center font-black text-white text-sm">
                                ⚔️
                            </div>
                        </div>
                    </div>

                    <!-- Progress Comparison Bar -->
                    <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                        <div id="pvpMyProgressBar" class="h-full bg-indigo-500 transition-all duration-300" style="width: 50%;"></div>
                        <div id="pvpOpponentProgressBar" class="h-full bg-red-500 transition-all duration-300" style="width: 50%;"></div>
                    </div>

                    <!-- Vocabulary Battle Card -->
                    <div class="p-6 rounded-3xl bg-slate-900/90 border-2 border-indigo-500/30 text-center space-y-2 relative shadow-lg">
                        <button onclick="window.PvPArenaClient.speakWord('${currentWord.word}')" class="absolute top-4 right-4 w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 text-indigo-400 hover:text-white flex items-center justify-center transition cursor-pointer">
                            <i class="fa-solid fa-volume-high text-sm"></i>
                        </button>
                        <h2 class="text-2xl sm:text-3xl font-black tracking-wide text-white capitalize">${currentWord.word}</h2>
                        <span class="inline-block text-xs font-semibold text-slate-400 font-mono">${currentWord.phonetic}</span>
                        <p class="text-xs text-indigo-300 font-bold pt-1">Hãy chọn nghĩa tiếng Việt chính xác nhất:</p>
                    </div>

                    <!-- 4 Options Grid -->
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3" id="pvpOptionsGrid">
                        ${currentWord.options.map((opt, idx) => `
                            <button onclick="window.PvPArenaClient.selectAnswer(${idx})" 
                                class="pvp-opt-btn p-3.5 sm:p-4 rounded-2xl bg-slate-900/80 hover:bg-indigo-900/40 border border-slate-700/80 hover:border-indigo-400 text-left text-xs sm:text-sm font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-3 active:scale-[0.98]">
                                <span class="w-6 h-6 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-black text-indigo-400 shrink-0">
                                    ${String.fromCharCode(65 + idx)}
                                </span>
                                <span class="flex-1">${opt}</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        speakWord(word) {
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(word);
                utterance.lang = 'en-US';
                utterance.rate = 0.95;
                window.speechSynthesis.speak(utterance);
            }
        }

        selectAnswer(selectedIndex) {
            if (this.state !== 'PLAYING') return;

            const responseTimeMs = Date.now() - this.questionStartTime;
            const currentWord = this.currentMatch.words[this.currentQuestionIndex];
            const isCorrect = (selectedIndex === currentWord.correctIndex);

            // Highlight buttons
            const btns = document.querySelectorAll('.pvp-opt-btn');
            btns.forEach((btn, idx) => {
                btn.disabled = true;
                if (idx === currentWord.correctIndex) {
                    btn.classList.add('bg-emerald-600', 'border-emerald-400', 'text-white');
                } else if (idx === selectedIndex) {
                    btn.classList.add('bg-rose-600', 'border-rose-400', 'text-white', 'animate-shake');
                }
            });

            // Âm thanh phản hồi Web Audio ("ding!" nốt E6 khi đúng)
            if (isCorrect && this.soundEnabled) {
                if (window.WebAudioMicroEngine && typeof window.WebAudioMicroEngine.playDing === 'function') {
                    window.WebAudioMicroEngine.playDing();
                } else {
                    try {
                        const AudioCtx = window.AudioContext || window.webkitAudioContext;
                        if (AudioCtx) {
                            const ctx = new AudioCtx();
                            const osc = ctx.createOscillator();
                            const gain = ctx.createGain();
                            osc.type = 'sine';
                            osc.frequency.setValueAtTime(1318.51, ctx.currentTime);
                            gain.gain.setValueAtTime(0.3, ctx.currentTime);
                            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                            osc.connect(gain);
                            gain.connect(ctx.destination);
                            osc.start();
                            osc.stop(ctx.currentTime + 0.3);
                        }
                    } catch (e) {}
                }
            } else {
                // Thu thập từ làm sai để phân tích qua AI "Vì sao em sai?" (T3.18)
                this.missedWords.push({
                    word: currentWord.word,
                    phonetic: currentWord.phonetic || '',
                    userChoice: currentWord.options[selectedIndex] || 'Lựa chọn sai',
                    correctChoice: currentWord.options[currentWord.correctIndex] || currentWord.meaning,
                    trap: 'Bẫy từ vựng cốt lõi TOEIC'
                });
            }

            // Gửi đáp án lên WebSocket
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                this.ws.send(JSON.stringify({
                    type: 'SUBMIT_ANSWER',
                    matchId: this.currentMatch.matchId,
                    wordIndex: this.currentQuestionIndex,
                    answer: selectedIndex,
                    responseTimeMs
                }));
            } else {
                // Client simulation fallback
                if (isCorrect) {
                    this.myCombo++;
                    this.myScore += 100 + Math.max(0, 50 - Math.round(responseTimeMs / 200));
                } else {
                    this.myCombo = 0;
                }
            }

            // Chuyển sang câu tiếp theo sau 450ms
            setTimeout(() => {
                this.currentQuestionIndex++;
                if (this.currentQuestionIndex < 10) {
                    this.renderGameView();
                } else {
                    this.renderWaitingOpponent();
                }
            }, 450);
        }

        renderWaitingOpponent() {
            const body = this.getBodyContainer();
            if (!body) return;

            const total = (this.myScore + this.opponentScore) || 1;
            const myPct = Math.round((this.myScore / total) * 100);

            body.innerHTML = `
                <div class="space-y-5 animate-fadeIn">
                    <!-- Battle HUD Header (Preserved) -->
                    <div class="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-xl bg-emerald-600/30 border border-emerald-400/50 flex items-center justify-center font-black text-emerald-300 text-sm">
                                10/10
                            </div>
                            <div>
                                <span class="block text-[10px] font-bold uppercase text-emerald-400">🏁 ĐÃ VỀ ĐÍCH</span>
                                <div class="flex items-center gap-2">
                                    <span class="text-xl font-black text-white" id="pvpMyScore">${this.myScore}</span>
                                    <span class="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-black ${this.myCombo >= 2 ? '' : 'hidden'}" id="pvpMyCombo">
                                        🔥 x${this.myCombo}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Countdown Timer -->
                        <div class="text-center">
                            <span class="block text-[10px] font-bold text-slate-400 uppercase">Đồng Bộ</span>
                            <div class="text-xl font-mono text-amber-300 font-bold transition-all duration-300" id="pvpCountdown">
                                ${this.remainingSeconds}s
                            </div>
                        </div>

                        <!-- Opponent Score -->
                        <div class="flex items-center gap-3 text-right">
                            <div>
                                <span class="block text-[10px] font-bold uppercase text-slate-400">${this.currentMatch?.opponent?.username || 'Đối Thủ'}</span>
                                <div class="flex items-center justify-end gap-2">
                                    <span class="px-1.5 py-0.5 rounded-md bg-red-500/20 text-red-300 text-[10px] font-black ${this.opponentCombo >= 2 ? '' : 'hidden'}" id="pvpOpponentCombo">
                                        🔥 x${this.opponentCombo}
                                    </span>
                                    <span class="text-xl font-black text-slate-300" id="pvpOpponentScore">${this.opponentScore}</span>
                                </div>
                            </div>
                            <div class="w-10 h-10 rounded-xl bg-red-600/30 border border-red-400/50 flex items-center justify-center font-black text-white text-sm">
                                ⚔️
                            </div>
                        </div>
                    </div>

                    <!-- Progress Comparison Bar -->
                    <div class="w-full h-2 rounded-full bg-slate-800 overflow-hidden flex">
                        <div id="pvpMyProgressBar" class="h-full bg-indigo-500 transition-all duration-300" style="width: ${myPct}%;"></div>
                        <div id="pvpOpponentProgressBar" class="h-full bg-red-500 transition-all duration-300" style="width: ${100 - myPct}%;"></div>
                    </div>

                    <!-- Non-destructive Waiting Card -->
                    <div class="p-8 rounded-3xl bg-slate-900/85 border-2 border-indigo-500/30 text-center space-y-4 shadow-xl">
                        <div class="w-14 h-14 mx-auto rounded-2xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center text-2xl text-amber-300 animate-pulse">
                            <i class="fa-solid fa-flag-checkered"></i>
                        </div>
                        <div class="space-y-1">
                            <h4 class="text-lg font-black text-white">Bạn Đã Hoàn Thành Cả 10 Câu!</h4>
                            <p class="text-xs text-slate-300">Đang đồng bộ kết quả trực tiếp với đối thủ...</p>
                        </div>
                        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-700/50 text-xs text-indigo-300">
                            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            <span>Trực tiếp • Sẵn sàng công bố bảng điểm</span>
                        </div>
                    </div>
                </div>
            `;
        }

        onTickSync(seconds) {
            this.remainingSeconds = seconds;
            const el = document.getElementById('pvpCountdown');
            if (el) {
                el.textContent = `${seconds}s`;
                // Hiệu ứng nhấp nháy đỏ khẩn cấp khi còn <= 10 giây
                if (seconds <= 10) {
                    el.className = 'text-xl font-mono font-bold px-3 py-1 rounded-xl timer-urgent shadow-lg shadow-red-500/20';
                } else {
                    el.className = 'text-xl font-mono text-amber-300 font-bold';
                }
            }
        }

        onScoreUpdate({ myScore, myCombo, opponentScore, opponentCombo }) {
            this.myScore = myScore;
            this.myCombo = myCombo;
            this.opponentScore = opponentScore;
            this.opponentCombo = opponentCombo;

            const myScoreEl = document.getElementById('pvpMyScore');
            const oppScoreEl = document.getElementById('pvpOpponentScore');
            const myComboEl = document.getElementById('pvpMyCombo');
            const oppComboEl = document.getElementById('pvpOpponentCombo');

            if (myScoreEl) myScoreEl.textContent = myScore;
            if (oppScoreEl) oppScoreEl.textContent = opponentScore;
            if (myComboEl) {
                myComboEl.textContent = `🔥 x${myCombo}`;
                myComboEl.classList.toggle('hidden', myCombo < 2);
            }
            if (oppComboEl) {
                oppComboEl.textContent = `🔥 x${opponentCombo}`;
                oppComboEl.classList.toggle('hidden', opponentCombo < 2);
            }

            // Cập nhật thanh tỉ lệ đối đầu
            const total = (myScore + opponentScore) || 1;
            const myPct = Math.round((myScore / total) * 100);
            const myBar = document.getElementById('pvpMyProgressBar');
            const oppBar = document.getElementById('pvpOpponentProgressBar');
            if (myBar) myBar.style.width = `${myPct}%`;
            if (oppBar) oppBar.style.width = `${100 - myPct}%`;
        }

        onMatchEnd(data) {
            this.state = 'RESULT';
            const body = this.getBodyContainer();
            if (!body) return;

            const isVictory = (data.result === 'VICTORY' || data.winner === 'my' || data.winner === 'YOU');
            const isDraw = (data.result === 'DRAW' || data.winner === 'draw');

            if (isVictory && window.WebAudioMicroEngine) {
                window.WebAudioMicroEngine.fireConfetti();
                window.WebAudioMicroEngine.playComboCheer(5);
            }

            // HTML hiển thị danh sách từ trả lời sai (missedWords) kèm nút [💡 Vì sao em sai?]
            let missedWordsHtml = '';
            if (this.missedWords && this.missedWords.length > 0) {
                missedWordsHtml = `
                    <div class="mt-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800 text-left space-y-3">
                        <div class="flex items-center justify-between">
                            <span class="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                                Từ Vựng Cần Rút Kinh Nghiệm (${this.missedWords.length} từ sai)
                            </span>
                            <span class="text-[10px] text-slate-500">Bấm xem AI bóc mẽ bẫy</span>
                        </div>
                        <div class="space-y-2">
                            ${this.missedWords.map((item, idx) => `
                                <div class="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center justify-between gap-3 text-xs">
                                    <div>
                                        <div class="font-extrabold text-white flex items-center gap-2">
                                            <span>${item.word}</span>
                                            <span class="text-[11px] font-normal text-slate-400 font-mono">${item.phonetic}</span>
                                        </div>
                                        <div class="text-[11px] text-slate-400 mt-0.5">
                                            <span class="text-rose-400">Em chọn: "${item.userChoice}"</span> · 
                                            <span class="text-emerald-400">Đúng: "${item.correctChoice}"</span>
                                        </div>
                                    </div>
                                    <button onclick="window.PvPArenaClient.explainMissedWord(${idx})" 
                                        class="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600 text-purple-300 hover:text-white border border-purple-500/40 text-[11px] font-bold flex items-center gap-1.5 transition cursor-pointer shrink-0">
                                        <span>💡 Vì sao em sai?</span>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }

            body.innerHTML = `
                <div class="space-y-6 text-center py-6 animate-in zoom-in-95 duration-300">
                    <div class="w-24 h-24 mx-auto rounded-3xl ${isVictory ? 'bg-amber-500/20 border-2 border-amber-400' : isDraw ? 'bg-indigo-500/20 border-2 border-indigo-400' : 'bg-slate-800 border-2 border-slate-600'} flex items-center justify-center text-5xl shadow-xl">
                        ${isVictory ? '👑' : isDraw ? '🤝' : '🛡️'}
                    </div>

                    <div class="space-y-1">
                        <h3 class="text-2xl font-black ${isVictory ? 'text-amber-300' : isDraw ? 'text-indigo-300' : 'text-slate-300'}">
                            ${isVictory ? 'CHIẾN THẮNG TUYỆT ĐỐI!' : isDraw ? 'TRẬN ĐẤU HÒA ĐIỂM!' : 'CHƯA ĐẠT KẾT QUẢ TỐT NHẤT'}
                        </h3>
                        <p class="text-xs text-slate-400">
                            ${isVictory ? 'Tốc độ phản xạ và độ chính xác của bạn vượt trội đối thủ!' : 'Cuộc đấu cân tài cân sức giữa hai chiến binh TOEIC!'}
                        </p>
                    </div>

                    <!-- Final Scores Display -->
                    <div class="grid grid-cols-2 gap-4 max-w-sm mx-auto p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
                        <div class="text-center">
                            <span class="block text-[11px] font-bold text-indigo-400">Điểm Của Bạn</span>
                            <span class="text-3xl font-black text-white">${data.myScore || this.myScore}</span>
                        </div>
                        <div class="text-center border-l border-slate-800">
                            <span class="block text-[11px] font-bold text-red-400">Đối Thủ</span>
                            <span class="text-3xl font-black text-slate-300">${data.opponentScore || this.opponentScore}</span>
                        </div>
                    </div>

                    <!-- Rewards Pill -->
                    <div class="flex items-center justify-center gap-4 text-xs font-bold">
                        <span class="px-3.5 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            🏅 Điểm Rank: ${data.rankDelta >= 0 ? '+' : ''}${data.rankDelta || 25}
                        </span>
                        <span class="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            ⚡ Thưởng: +${data.xpEarned || 50} XP
                        </span>
                    </div>

                    <!-- Missed Words Section with AI Explanations -->
                    ${missedWordsHtml}

                    <!-- Actions -->
                    <div class="flex items-center justify-center gap-3 pt-2">
                        <button onclick="window.PvPArenaClient.startMatchmaking()" class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-black text-xs uppercase tracking-wider hover:scale-105 transition shadow cursor-pointer">
                            Đấu Trận Khác
                        </button>
                        <button onclick="window.PvPArenaClient.close()" class="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition cursor-pointer">
                            Đóng
                        </button>
                    </div>
                </div>
            `;
        }

        explainMissedWord(idx) {
            const item = this.missedWords[idx];
            if (!item) return;

            if (window.AiMistakeExplainer && typeof window.AiMistakeExplainer.explain === 'function') {
                window.AiMistakeExplainer.explain({
                    question: `Từ vựng TOEIC: "${item.word}" (${item.phonetic}). Nghĩa chính xác là "${item.correctChoice}", nhưng em lại chọn nhầm phương án "${item.userChoice}".`,
                    userAnswer: item.userChoice,
                    correctAnswer: item.correctChoice,
                    part: 5,
                    trapCategory: 'TRAP-09'
                });
            } else if (typeof window.askAiWhyWrong === 'function') {
                window.askAiWhyWrong({
                    question: `Từ vựng TOEIC: "${item.word}" (${item.phonetic}). Nghĩa chính xác là "${item.correctChoice}", nhưng em lại chọn nhầm phương án "${item.userChoice}".`,
                    userAnswer: item.userChoice,
                    correctAnswer: item.correctChoice,
                    part: 5,
                    trapCategory: 'TRAP-09'
                });
            }
        }
    }

    window.PvPArenaClient = new PvPArenaClientClass();

    document.addEventListener('DOMContentLoaded', () => {
        window.PvPArenaClient.init();
    });

})(window, document);
