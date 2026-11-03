const fs = require('fs');

console.log('=== UPGRADING PVP ARENA CLIENT (ROOMS, MULTIPLAYER & FRIENDS) ===');

let client = fs.readFileSync('js/pvp-arena-client.js', 'utf8');

// 1. Add new properties to constructor
const oldCtor = `            this.missedWords = []; // Danh sách từ làm sai trong trận đấu
            this.inlineContainerId = null;
        }`;

const newCtor = `            this.missedWords = []; // Danh sách từ làm sai trong trận đấu
            this.inlineContainerId = null;
            this.currentTab = 'quick'; // 'quick' | 'room' | 'friends'
            this.onlineUsersList = [];
            this.currentRoomCode = null;
            this.activeInvite = null;
        }`;

if (client.includes(oldCtor)) {
    client = client.replace(oldCtor, newCtor);
    console.log('✅ Added currentTab, onlineUsersList, currentRoomCode to PvPArenaClient constructor');
}

// 2. Add WebSocket message types to handleServerMessage
const oldMsgSwitch = `        handleServerMessage(data) {
            switch (data.type) {
                case 'MATCH_FOUND':
                    this.onMatchFound(data);
                    break;`;

const newMsgSwitch = `        handleServerMessage(data) {
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
                    break;`;

if (client.includes(oldMsgSwitch)) {
    client = client.replace(oldMsgSwitch, newMsgSwitch);
    console.log('✅ Added handlers for room and friend messages in handleServerMessage');
}

// 3. Update connectWebSocket to auto-register user on connect
const oldWsOpen = `                this.ws.onopen = () => {
                    const user = window.currentUserAccount || {};
                    this.ws.send(JSON.stringify({
                        type: 'JOIN_QUEUE',
                        userId: user.id || 'guest_' + Date.now(),
                        username: user.name || 'Chiến Binh TOEIC',
                        avatar: user.avatar || '/assets/mascot/soi_may_avt.png'
                    }));
                };`;

const newWsOpen = `                this.ws.onopen = () => {
                    const user = window.currentUserAccount || {};
                    const uId = user.id || 'guest_' + Date.now();
                    const uName = user.name || 'Chiến Binh TOEIC';
                    const uAvt = user.avatar || '/assets/mascot/soi_may_avt.png';

                    // Đăng ký danh tính lên máy chủ
                    this.ws.send(JSON.stringify({
                        type: 'REGISTER_USER',
                        userId: uId,
                        username: uName,
                        avatar: uAvt
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
                };`;

if (client.includes(oldWsOpen)) {
    client = client.replace(oldWsOpen, newWsOpen);
    console.log('✅ Updated connectWebSocket to cleanly register user & support custom actions');
}

// 4. Replace renderIdleView with comprehensive 3-tab UI and helper functions
const oldIdleStart = `        renderIdleView() {
            const body = this.getBodyContainer();
            if (!body) return;

            const user = window.currentUserAccount || {};
            const username = user.name || 'Chiến Binh TOEIC';
            const avatar = user.avatar || '/assets/mascot/soi_may_avt.png';`;

const oldIdleEnd = `                    <!-- Action Button -->
                    <div>
                        <button onclick="window.PvPArenaClient.startMatchmaking()" class="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                            <i class="fa-solid fa-play mr-2"></i> Ghép Trận Ngay (Tìm Đối Thủ)
                        </button>
                    </div>
                </div>
            \`;
        }`;

const newIdleBlock = `        setLobbyTab(tab) {
            this.currentTab = tab;
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                this.connectWebSocket();
            } else if (tab === 'friends') {
                const user = window.currentUserAccount || {};
                this.ws.send(JSON.stringify({ type: 'GET_ONLINE_USERS', userId: user.id || 'guest' }));
            }
            this.renderIdleView();
        }

        renderIdleView() {
            const body = this.getBodyContainer();
            if (!body) return;

            // Đảm bảo WS được kết nối để đồng bộ trạng thái trực tuyến
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                this.connectWebSocket();
            }

            const user = window.currentUserAccount || {};
            const username = user.name || 'Chiến Binh TOEIC';
            const avatar = user.avatar || '/assets/mascot/soi_may_avt.png';

            const activeTabClass = 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 shadow-md font-black';
            const inactiveTabClass = 'text-slate-400 hover:text-white hover:bg-slate-800/60 font-bold';

            body.innerHTML = \`
                <div class="space-y-5 py-2">
                    <!-- Tab Selector Navigation -->
                    <div class="grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-slate-950/70 border border-slate-800">
                        <button onclick="window.PvPArenaClient.setLobbyTab('quick')" class="py-2.5 px-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 \${this.currentTab === 'quick' ? activeTabClass : inactiveTabClass}">
                            <i class="fa-solid fa-bolt"></i>
                            <span>Ghép Nhanh</span>
                        </button>
                        <button onclick="window.PvPArenaClient.setLobbyTab('room')" class="py-2.5 px-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 \${this.currentTab === 'room' ? activeTabClass : inactiveTabClass}">
                            <i class="fa-solid fa-door-open"></i>
                            <span>Phòng Riêng</span>
                        </button>
                        <button onclick="window.PvPArenaClient.setLobbyTab('friends')" class="py-2.5 px-3 rounded-xl text-xs transition cursor-pointer flex items-center justify-center gap-1.5 \${this.currentTab === 'friends' ? activeTabClass : inactiveTabClass}">
                            <i class="fa-solid fa-users"></i>
                            <span>Bạn Bè & Online (\${this.onlineUsersList.length})</span>
                        </button>
                    </div>

                    <!-- TAB 1: QUICK MATCH -->
                    \${this.currentTab === 'quick' ? \`
                        <div class="space-y-5 text-center py-2">
                            <!-- Banner Showcase -->
                            <div class="relative max-w-sm mx-auto p-5 rounded-3xl bg-gradient-to-tr from-indigo-900/40 via-purple-900/30 to-amber-900/20 border border-indigo-400/30 shadow-xl space-y-3">
                                <div class="w-16 h-16 mx-auto rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-inner animate-bounce">
                                    🏆
                                </div>
                                <div class="space-y-1">
                                    <h4 class="text-lg font-black text-white">So Tài Phản Xạ 60 Giây</h4>
                                    <p class="text-xs text-slate-300 leading-relaxed">
                                        Đua tốc độ giải 10 từ vựng với các bạn học trực tuyến hoặc luyện phản xạ cùng <strong>Sói Mây AI</strong>!
                                    </p>
                                </div>
                                <div class="flex items-center justify-center gap-4 text-xs font-bold text-slate-300 pt-2 border-t border-indigo-500/20">
                                    <div class="flex items-center gap-1.5 text-amber-400">
                                        <i class="fa-solid fa-bolt"></i>
                                        <span>10 Từ / Trận</span>
                                    </div>
                                    <div class="flex items-center gap-1.5 text-emerald-400">
                                        <i class="fa-solid fa-award"></i>
                                        <span>Thắng: +25 Điểm & +50 XP</span>
                                    </div>
                                </div>
                            </div>

                            <!-- User Profile Quick Card -->
                            <div class="flex items-center justify-center gap-3 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800 max-w-xs mx-auto">
                                <img src="\${avatar}" alt="\${username}" class="w-9 h-9 rounded-xl object-cover border border-amber-400/50">
                                <div class="text-left">
                                    <span class="block text-xs font-bold text-white">\${username}</span>
                                    <span class="block text-[11px] font-semibold text-amber-400">🏅 Rank: Cao Thủ FSRS</span>
                                </div>
                            </div>

                            <!-- Action Button -->
                            <div>
                                <button onclick="window.PvPArenaClient.startMatchmaking()" class="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-600 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg shadow-orange-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer">
                                    <i class="fa-solid fa-play mr-2"></i> Ghép Trận Ngẫu Nhiên
                                </button>
                            </div>
                        </div>
                    \` : ''}

                    <!-- TAB 2: CUSTOM ROOM (MÃ PHÒNG RIÊNG CHO BẠN BÈ) -->
                    \${this.currentTab === 'room' ? \`
                        <div class="space-y-5 text-center py-2">
                            \${this.currentRoomCode ? \`
                                <!-- Đang Chờ Trong Phòng -->
                                <div class="p-6 rounded-3xl bg-slate-950/80 border border-amber-500/40 shadow-2xl max-w-md mx-auto space-y-4">
                                    <div class="flex items-center justify-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
                                        <span class="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping"></span>
                                        <span>Phòng Thi Đấu Riêng</span>
                                    </div>
                                    <div class="text-4xl sm:text-5xl font-black font-mono tracking-widest text-amber-300 bg-slate-900 py-3.5 px-6 rounded-2xl border border-amber-400/30 select-all">
                                        \${this.currentRoomCode}
                                    </div>
                                    <p class="text-xs text-slate-300 leading-relaxed">
                                        Hãy gửi mã này hoặc đường dẫn cho bạn bè để vào phòng đấu 1v1 ngay lập tức!
                                    </p>
                                    <div class="flex items-center justify-center gap-2 pt-1">
                                        <button onclick="window.PvPArenaClient.copyRoomCode()" class="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95">
                                            <i class="fa-regular fa-copy"></i>
                                            <span>Sao chép mã</span>
                                        </button>
                                        <button onclick="window.PvPArenaClient.copyRoomLink()" class="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95">
                                            <i class="fa-solid fa-link"></i>
                                            <span>Sao chép Link</span>
                                        </button>
                                    </div>
                                    <div class="pt-3 border-t border-slate-800">
                                        <button onclick="window.PvPArenaClient.cancelRoom()" class="text-xs text-rose-400 hover:text-rose-300 font-semibold cursor-pointer">
                                            ✕ Hủy phòng thi này
                                        </button>
                                    </div>
                                </div>
                            \` : \`
                                <!-- Chưa Tạo Phòng: Cho phép tạo hoặc vào phòng -->
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto text-left">
                                    <!-- Cột 1: Tạo phòng mới -->
                                    <div class="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-4">
                                        <div class="space-y-2">
                                            <div class="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-lg font-black border border-amber-400/30">
                                                <i class="fa-solid fa-plus"></i>
                                            </div>
                                            <h5 class="text-sm font-extrabold text-white">Tạo Phòng Mới</h5>
                                            <p class="text-[11.5px] text-slate-400 leading-relaxed">
                                                Hệ thống tạo mã 6 chữ số độc quyền. Bạn gửi mã này cho bạn bè để cùng vào thi đấu.
                                            </p>
                                        </div>
                                        <button onclick="window.PvPArenaClient.createRoom()" class="w-full py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider transition cursor-pointer shadow-md active:scale-95 text-center">
                                            🏠 Tạo Phòng Ngay
                                        </button>
                                    </div>

                                    <!-- Cột 2: Vào bằng mã phòng -->
                                    <div class="p-5 rounded-3xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between space-y-4">
                                        <div class="space-y-2">
                                            <div class="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-lg font-black border border-indigo-400/30">
                                                <i class="fa-solid fa-right-to-bracket"></i>
                                            </div>
                                            <h5 class="text-sm font-extrabold text-white">Vào Bằng Mã Phòng</h5>
                                            <p class="text-[11.5px] text-slate-400 leading-relaxed">
                                                Nhập mã phòng do bạn bè chia sẻ để bắt đầu màn đấu đối kháng 1v1.
                                            </p>
                                        </div>
                                        <div class="space-y-2">
                                            <input type="text" id="pvpJoinRoomInput" placeholder="Ví dụ: 849201" maxlength="10" class="w-full py-2 px-3 text-center text-sm font-mono font-black text-white bg-slate-900 border border-slate-700 rounded-xl focus:border-indigo-400 focus:outline-none uppercase">
                                            <button onclick="window.PvPArenaClient.joinRoom(document.getElementById('pvpJoinRoomInput').value)" class="w-full py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-md active:scale-95 text-center">
                                                Vào Trận Đấu ➔
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            \`}
                        </div>
                    \` : ''}

                    <!-- TAB 3: FRIENDS & ONLINE ACCOUNTS (TÀI KHOẢN KHÁCH THẬT) -->
                    \${this.currentTab === 'friends' ? \`
                        <div class="space-y-4 py-2">
                            <div class="flex items-center justify-between text-xs text-slate-400 px-1">
                                <span>Bạn học TOEIC đang trực tuyến trên hệ thống:</span>
                                <button onclick="window.PvPArenaClient.refreshOnlineList()" class="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer">
                                    <i class="fa-solid fa-rotate text-[11px]"></i> Làm mới
                                </button>
                            </div>

                            \${this.onlineUsersList.length === 0 ? \`
                                <div class="p-8 rounded-3xl bg-slate-950/50 border border-slate-800 text-center space-y-3 max-w-md mx-auto">
                                    <div class="text-3xl">👥</div>
                                    <h5 class="text-sm font-bold text-white">Hiện chưa có bạn học nào khác đang online</h5>
                                    <p class="text-xs text-slate-400 leading-relaxed">
                                        Mẹo: Bạn có thể mở một <strong>cửa sổ ẩn danh (Incognito)</strong> hoặc đăng nhập tài khoản khác trên máy tính/điện thoại để đấu 1v1 cùng nhau! Hoặc dùng tab <b>Phòng Riêng</b> để gửi link cho bạn bè.
                                    </p>
                                </div>
                            \` : \`
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                                    \${this.onlineUsersList.map(u => \`
                                        <div class="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between gap-3 shadow-xs">
                                            <div class="flex items-center gap-3 overflow-hidden">
                                                <div class="relative w-10 h-10 shrink-0">
                                                    <img src="\${u.avatar || '/assets/mascot/soi_may_avt.png'}" class="w-full h-full rounded-xl object-cover border border-slate-700">
                                                    <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full \${u.status === 'IN_MATCH' ? 'bg-amber-500' : 'bg-emerald-500'} border-2 border-slate-900"></span>
                                                </div>
                                                <div class="truncate">
                                                    <div class="text-xs font-bold text-white truncate">\${u.username}</div>
                                                    <span class="text-[10px] font-semibold text-slate-400">
                                                        \${u.status === 'IN_MATCH' ? '⚔️ Đang đấu' : '🟢 Sẵn sàng'}
                                                    </span>
                                                </div>
                                            </div>
                                            <button onclick="window.PvPArenaClient.inviteUser('\${u.userId}', '\${u.username}')" \${u.status === 'IN_MATCH' ? 'disabled' : ''} class="px-3 py-1.5 rounded-xl text-xs font-bold \${u.status === 'IN_MATCH' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white shadow-xs cursor-pointer active:scale-95'} transition shrink-0">
                                                ⚔️ Thách đấu
                                            </button>
                                        </div>
                                    \`).join('')}
                                </div>
                            \`}
                        </div>
                    \` : ''}
                </div>
            \`;
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
            const link = location.origin + '/#pvp_room=' + this.currentRoomCode;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(link);
                if (typeof showToast === 'function') showToast('🔗 Đã sao chép liên kết mời bạn!');
            } else {
                prompt('Sao chép link mời bạn:', link);
            }
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

        inviteUser(targetUserId, targetUsername) {
            if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
                this.connectWebSocket();
                setTimeout(() => this.inviteUser(targetUserId, targetUsername), 600);
                return;
            }
            const user = window.currentUserAccount || {};
            this.ws.send(JSON.stringify({
                type: 'INVITE_FRIEND',
                targetUserId,
                fromUser: {
                    userId: user.id || 'guest_' + Date.now(),
                    username: user.name || 'Chiến Binh TOEIC',
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

            // Xóa lời mời cũ nếu có
            const oldBox = document.getElementById('pvpIncomingInviteModal');
            if (oldBox) oldBox.remove();

            const inviteModal = document.createElement('div');
            inviteModal.id = 'pvpIncomingInviteModal';
            inviteModal.className = 'fixed top-5 right-5 z-[99999] max-w-sm w-full bg-slate-900 border-2 border-amber-400 text-white rounded-3xl p-4 shadow-2xl animate-bounce';
            inviteModal.innerHTML = \`
                <div class="flex items-start gap-3">
                    <img src="\${fromUser.avatar || '/assets/mascot/soi_may_avt.png'}" class="w-12 h-12 rounded-2xl object-cover border border-amber-400">
                    <div class="flex-1 min-w-0">
                        <div class="text-[11px] font-black text-amber-400 uppercase tracking-wider">Lời Thách Đấu PvP 1v1!</div>
                        <div class="text-sm font-extrabold text-white truncate">\${fromUser.username || 'Bạn học'}</div>
                        <p class="text-xs text-slate-300 mt-0.5">Muốn so tài 10 từ vựng phản xạ 60s cùng bạn!</p>
                        <div class="flex items-center gap-2 mt-3">
                            <button onclick="window.PvPArenaClient.acceptInvite('\${inviteId}')" class="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black transition cursor-pointer shadow-sm active:scale-95">
                                ✓ Chấp nhận
                            </button>
                            <button onclick="window.PvPArenaClient.rejectInvite('\${inviteId}')" class="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition cursor-pointer">
                                Từ chối
                            </button>
                        </div>
                    </div>
                </div>
            \`;
            document.body.appendChild(inviteModal);

            // Tự động đóng sau 15 giây nếu không phản hồi
            setTimeout(() => {
                if (document.getElementById('pvpIncomingInviteModal')) {
                    document.getElementById('pvpIncomingInviteModal').remove();
                }
            }, 15000);
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
        }`;

if (client.includes(oldIdleStart)) {
    const startIdx = client.indexOf(oldIdleStart);
    const endIdx = client.indexOf(oldIdleEnd);
    if (startIdx !== -1 && endIdx !== -1) {
        const fullOld = client.substring(startIdx, endIdx + oldIdleEnd.length);
        client = client.replace(fullOld, newIdleBlock);
        console.log('✅ Replaced renderIdleView with full 3-tab custom room & friends implementation');
    }
}

// 5. Check URL hash on init for #pvp_room=XYZ
const oldInit = `        init() {
            this.ensureStyles();
            this.createModalDOM();
        }`;

const newInit = `        init() {
            this.ensureStyles();
            this.createModalDOM();
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
        }`;

if (client.includes(oldInit)) {
    client = client.replace(oldInit, newInit);
    console.log('✅ Added auto-join deep-linking from #pvp_room=CODE in init');
}

fs.writeFileSync('js/pvp-arena-client.js', client, 'utf8');
console.log('🎉 PvP Client-side upgrades complete!');
