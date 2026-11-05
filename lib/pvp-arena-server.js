/**
 * =========================================================================
 * TOEIC VOCABULARY PVP 1V1 ARENA — REAL-TIME WEBSOCKET SERVER
 * =========================================================================
 * Đấu Trường Từ Vựng PvP 1v1 Thời Gian Thực (10 từ trong 60 giây):
 * - Hỗ trợ ghép trận người chơi thời gian thực (Human vs Human)
 * - Tự động ghép với Bot AI Sói Mây thông minh nếu hàng đợi chờ >= 5.0 giây (F22.5)
 * - Độ trễ trả lời Bot AI: 1.5s - 4.5s, độ chính xác động ~70-85%
 * - Ân hạn ngắt kết nối 5 giây (F22.B1) và hỗ trợ reconnect
 * - Đánh số thứ tự đơn điệu (seq) phân xử đồng thời (F22.B3)
 * - Đóng an toàn socket không thuộc /ws/pvp bằng socket.destroy()
 * - Mở rộng ngân hàng câu hỏi từ vựng từ lib/curated-vocab-bank.js
 * =========================================================================
 */

'use strict';

const { WebSocketServer, WebSocket } = require('ws');

// Ngân hàng câu hỏi đối kháng từ vựng thực chiến TOEIC (20 thẻ chuẩn ban đầu)
const BASE_PVP_VOCAB_BANK = [
    { word: 'postpone', phonetic: '/poʊstˈpoʊn/', meaning: 'hoãn lại, dời lịch', options: ['hủy bỏ hoàn toàn', 'hoãn lại, dời lịch', 'thúc đẩy nhanh', 'ký hợp đồng'], correctIndex: 1 },
    { word: 'reimburse', phonetic: '/ˌriː.ɪmˈbɝːs/', meaning: 'hoàn tiền, thanh toán lại', options: ['vay tiền ngân hàng', 'từ chối bồi thường', 'hoàn tiền, thanh toán lại', 'đầu tư mạo hiểm'], correctIndex: 2 },
    { word: 'mandatory', phonetic: '/ˈmæn.də.tɔːr.i/', meaning: 'bắt buộc theo quy định', options: ['tùy chọn', 'bắt buộc theo quy định', 'khuyến khích', 'tạm thời hoãn'], correctIndex: 1 },
    { word: 'negotiate', phonetic: '/nəˈɡoʊ.ʃi.eɪt/', meaning: 'đàm phán, thương lượng', options: ['đàm phán, thương lượng', 'chấm dứt hợp tác', 'ký biên bản phạt', 'tăng giá đơn phương'], correctIndex: 0 },
    { word: 'complimentary', phonetic: '/ˌkɑːm.pləˈmen.tər.i/', meaning: 'miễn phí (dịch vụ kèm theo)', options: ['đắt đỏ', 'tính phí bổ sung', 'miễn phí (dịch vụ kèm theo)', 'dành riêng VIP'], correctIndex: 2 },
    { word: 'agenda', phonetic: '/əˈdʒen.də/', meaning: 'chương trình nghị sự, lịch trình họp', options: ['hóa đơn thanh toán', 'chương trình nghị sự, lịch trình họp', 'hợp đồng lao động', 'biên bản xử phạt'], correctIndex: 1 },
    { word: 'feasible', phonetic: '/ˈfiː.zə.bəl/', meaning: 'khả thi, có thể thực hiện được', options: ['bất khả thi', 'khả thi, có thể thực hiện được', 'tốn kém chi phí', 'phức tạp rắc rối'], correctIndex: 1 },
    { word: 'substitute', phonetic: '/ˈsʌb.stə.tuːt/', meaning: 'người/vật thay thế', options: ['người bảo lãnh', 'khách hàng tiềm năng', 'người/vật thay thế', 'đối thủ cạnh tranh'], correctIndex: 2 },
    { word: 'fluctuate', phonetic: '/ˈflʌk.tʃu.eɪt/', meaning: 'dao động, biến động thất thường', options: ['giữ nguyên ổn định', 'dao động, biến động thất thường', 'tăng trưởng đều', 'phá sản ngừng hoạt động'], correctIndex: 1 },
    { word: 'itinerary', phonetic: '/aɪˈtɪn.ə.rer.i/', meaning: 'lịch trình chi tiết chuyến đi', options: ['vé máy bay khứ hồi', 'hộ chiếu thị thực', 'lịch trình chi tiết chuyến đi', 'hành lý ký gửi'], correctIndex: 2 },
    { word: 'lucrative', phonetic: '/ˈluː.krə.t̬ɪv/', meaning: 'sinh lợi cao, béo bở', options: ['sinh lợi cao, béo bở', 'thua lỗ nặng nề', 'rủi ro pháp lý', 'kém hấp dẫn'], correctIndex: 0 },
    { word: 'confidential', phonetic: '/ˌkɑːn.fəˈden.ʃəl/', meaning: 'tuyệt mật, bảo mật', options: ['công khai rộng rãi', 'tuyệt mật, bảo mật', 'quảng cáo nội bộ', 'chia sẻ tự do'], correctIndex: 1 },
    { word: 'apparel', phonetic: '/əˈpær.əl/', meaning: 'trang phục, quần áo may mặc', options: ['thiết bị điện tử', 'vật liệu xây dựng', 'trang phục, quần áo may mặc', 'đồ dùng văn phòng'], correctIndex: 2 },
    { word: 'expedite', phonetic: '/ˈek.spə.daɪt/', meaning: 'xúc tiến, đẩy nhanh tiến độ', options: ['trì hoãn thi công', 'xúc tiến, đẩy nhanh tiến độ', 'chấm dứt dự án', 'cắt giảm nhân lực'], correctIndex: 1 },
    { word: 'renovate', phonetic: '/ˈren.ə.veɪt/', meaning: 'cải tạo, nâng cấp công trình', options: ['phá dỡ bỏ hoang', 'cải tạo, nâng cấp công trình', 'bán đấu giá tài sản', 'thuê ngắn hạn'], correctIndex: 1 },
    { word: 'comply with', phonetic: '/kəmˈplaɪ wɪð/', meaning: 'tuân thủ theo quy định', options: ['chống đối, phản đối', 'tuân thủ theo quy định', 'lách luật, gian lận', 'bỏ qua tiêu chuẩn'], correctIndex: 1 },
    { word: 'prospective', phonetic: '/prəˈspek.tɪv/', meaning: 'tiềm năng, triển vọng tương lai', options: ['tiềm năng, triển vọng tương lai', 'đã hết hạn sử dụng', 'kém cỏi, thiếu năng lực', 'lỗi thời lạc hậu'], correctIndex: 0 },
    { word: 'incur', phonetic: '/ɪnˈkɝː/', meaning: 'gánh chịu, phát sinh (chi phí/khoản nợ)', options: ['tiết kiệm tích lũy', 'gánh chịu, phát sinh (chi phí/khoản nợ)', 'tài trợ miễn phí', 'hoàn trả đủ'], correctIndex: 1 },
    { word: 'stipulate', phonetic: '/ˈstɪp.jə.leɪt/', meaning: 'quy định rõ ràng trong điều khoản', options: ['quy định rõ ràng trong điều khoản', 'gợi ý tham khảo', 'tự ý chỉnh sửa', 'hủy bỏ cam kết'], correctIndex: 0 },
    { word: 'unanimous', phonetic: '/juːˈnæn.ə.məs/', meaning: 'nhất trí 100%, đồng thuận hoàn toàn', options: ['chia rẽ bất đồng', 'bỏ phiếu lại', 'nhất trí 100%, đồng thuận hoàn toàn', 'đa số phản đối'], correctIndex: 2 }
];

// Nạp và sinh câu hỏi mở rộng từ lib/curated-vocab-bank.js
const PVP_VOCAB_BANK = [...BASE_PVP_VOCAB_BANK];
try {
    const curatedBank = require('./curated-vocab-bank');
    const allWords = [];
    for (const topicKey of Object.keys(curatedBank)) {
        const topic = curatedBank[topicKey];
        if (topic && topic.words) {
            for (const lvl of Object.keys(topic.words)) {
                const list = topic.words[lvl];
                if (Array.isArray(list)) {
                    for (const item of list) {
                        if (item && item.word && item.meaning) {
                            allWords.push(item);
                        }
                    }
                }
            }
        }
    }

    if (allWords.length >= 10) {
        const meanings = allWords.map(w => w.meaning);
        for (let i = 0; i < Math.min(allWords.length, 300); i++) {
            const current = allWords[i];
            const distractors = [];
            while (distractors.length < 3) {
                const randMeaning = meanings[Math.floor(Math.random() * meanings.length)];
                if (randMeaning !== current.meaning && !distractors.includes(randMeaning)) {
                    distractors.push(randMeaning);
                }
            }
            const opts = [current.meaning, ...distractors].sort(() => Math.random() - 0.5);
            PVP_VOCAB_BANK.push({
                word: current.word,
                phonetic: current.phonetic || '/.../',
                meaning: current.meaning,
                options: opts,
                correctIndex: opts.indexOf(current.meaning)
            });
        }
    }
} catch (e) {
    console.warn('[PvP WS] curated-vocab-bank load note:', e.message);
}

function getRandomQuestions(count = 10) {
    const shuffled = [...PVP_VOCAB_BANK].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
}

class PvPArenaServer {
    constructor() {
        this.wss = null;
        this.waitingQueue = [];
        this.activeMatches = new Map();
        this.cleanupInterval = null;
        this.seq = 0; // Bộ đếm thứ tự đơn điệu giải quyết xung đột đồng thời (F22.B3)
        // Hệ thống phòng riêng và bạn bè tài khoản thật
        this.onlineUsers = new Map(); // userId -> { ws, userId, username, avatar, status }
        this.customRooms = new Map(); // roomCode -> { host: player, roomCode, createdAt }
        this.pendingInvites = new Map(); // inviteId -> { inviteId, inviter, targetUserId, createdAt }
    }

    init(server) {
        this.wss = new WebSocketServer({ noServer: true });

        server.on('upgrade', (request, socket, head) => {
            let url;
            try {
                url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
            } catch (e) {
                socket.destroy();
                return;
            }

            if (url.pathname === '/ws/pvp') {
                this.wss.handleUpgrade(request, socket, head, (ws) => {
                    this.wss.emit('connection', ws, request);
                });
            } else {
                // Đóng kết nối an toàn với các yêu cầu nâng cấp không hợp lệ
                socket.destroy();
            }
        });

        this.wss.on('connection', (ws) => {
            ws.isAlive = true;
            ws.on('pong', () => { ws.isAlive = true; });

            ws.on('message', (message) => {
                try {
                    const data = JSON.parse(message);
                    this.handleClientMessage(ws, data);
                } catch (err) {
                    // F22.B4: Bỏ qua message JSON hỏng mà không gây sập server
                    console.error('[PvP WS] Malformed JSON message ignored:', err.message);
                }
            });

            ws.on('close', () => {
                this.handleDisconnection(ws);
            });
        });

        // Heartbeat định kỳ 30 giây
        this.cleanupInterval = setInterval(() => {
            if (!this.wss) return;
            this.wss.clients.forEach((ws) => {
                if (!ws.isAlive) return ws.terminate();
                ws.isAlive = false;
                ws.ping();
            });
        }, 30000);

        console.log('⚔️ PvP Vocabulary Arena WebSocket Server mounted at /ws/pvp');
    }

    handleClientMessage(ws, data) {
        if (!data || !data.type) return;

        switch (data.type) {
            case 'REGISTER_USER':
                this.registerUser(ws, data);
                break;
            case 'GET_ONLINE_USERS':
                this.sendOnlineUsers(ws, data);
                break;
            case 'CREATE_ROOM':
                this.createCustomRoom(ws, data);
                break;
            case 'JOIN_ROOM':
                this.joinCustomRoom(ws, data);
                break;
            case 'CANCEL_ROOM':
                this.cancelCustomRoom(ws, data);
                break;
            case 'INVITE_FRIEND':
                this.inviteFriend(ws, data);
                break;
            case 'ACCEPT_INVITE':
                this.acceptInvite(ws, data);
                break;
            case 'REJECT_INVITE':
                this.rejectInvite(ws, data);
                break;
            case 'JOIN_QUEUE':
                this.enqueuePlayer(ws, data);
                break;
            case 'SUBMIT_ANSWER':
                this.processAnswer(ws, data);
                break;
            case 'LEAVE_MATCH':
                this.handlePlayerLeave(ws, data.matchId);
                break;
            case 'RECONNECT_MATCH':
                this.handlePlayerReconnect(ws, data);
                break;
            default:
                break;
        }
    }

    
    // =========================================================================
    // HỆ THỐNG PHÒNG RIÊNG VÀ KẾT BẠN THẬT (FRIENDS & CUSTOM ROOMS)
    // =========================================================================

    registerUser(ws, { userId, username, avatar, friendCode }) {
        if (!userId) userId = 'user_' + Date.now();
        ws.userId = userId;
        this.onlineUsers.set(userId, {
            ws,
            userId,
            username: username || 'Chiến Binh TOEIC',
            friendCode: friendCode || '',
            avatar: avatar || '/assets/mascot/soi_may_avt.png',
            status: 'IDLE',
            lastSeen: Date.now()
        });
        this.sendSafe(ws, { type: 'REGISTERED_OK', userId });
        this.broadcastOnlineUsers();
    }

    sendOnlineUsers(ws, { userId } = {}) {
        const uId = userId || ws.userId;
        const list = [];
        this.onlineUsers.forEach((u, id) => {
            if (id !== uId && u.ws && u.ws.readyState === WebSocket.OPEN) {
                list.push({
                    userId: u.userId,
                    username: u.username,
                    friendCode: u.friendCode || '',
                    avatar: u.avatar,
                    status: u.status
                });
            }
        });
        this.sendSafe(ws, { type: 'ONLINE_USERS_LIST', users: list });
    }

    broadcastOnlineUsers() {
        this.onlineUsers.forEach((u, uId) => {
            if (u.ws && u.ws.readyState === WebSocket.OPEN) {
                this.sendOnlineUsers(u.ws, { userId: uId });
            }
        });
    }

    createCustomRoom(ws, { userId, username, avatar }) {
        this.removeFromQueue(ws);
        const roomCode = Math.floor(100000 + Math.random() * 900000).toString();
        const hostPlayer = {
            ws,
            userId: userId || 'host_' + Date.now(),
            username: username || 'Chủ Phòng TOEIC',
            avatar: avatar || '/assets/mascot/soi_may_avt.png'
        };
        this.customRooms.set(roomCode, {
            host: hostPlayer,
            roomCode,
            createdAt: Date.now()
        });
        ws.hostedRoomCode = roomCode;

        this.sendSafe(ws, {
            type: 'ROOM_CREATED',
            roomCode,
            message: 'Phòng thi đã được tạo thành công! Chia sẻ mã này cho bạn bè để cùng đấu trí.'
        });
    }

    joinCustomRoom(ws, { roomCode, userId, username, avatar }) {
        if (!roomCode || !this.customRooms.has(roomCode)) {
            this.sendSafe(ws, {
                type: 'ROOM_JOIN_ERROR',
                message: 'Không tìm thấy phòng với mã "' + roomCode + '". Vui lòng kiểm tra lại.'
            });
            return;
        }

        const room = this.customRooms.get(roomCode);
        this.customRooms.delete(roomCode);
        if (room.host.ws) room.host.ws.hostedRoomCode = null;

        const p1 = room.host;
        const p2 = {
            ws,
            userId: userId || 'guest_' + Date.now(),
            username: username || 'Khách Thách Đấu',
            avatar: avatar || '/assets/mascot/soi_may_avt.png'
        };

        // Bắt đầu trận đấu 1v1 giữa 2 tài khoản thật
        this.createMatch(p1, p2, false);
    }

    cancelCustomRoom(ws, { roomCode }) {
        if (roomCode && this.customRooms.has(roomCode)) {
            this.customRooms.delete(roomCode);
        }
        if (ws.hostedRoomCode) ws.hostedRoomCode = null;
        this.sendSafe(ws, { type: 'ROOM_CANCELLED' });
    }

    inviteFriend(ws, { targetUserId, targetFriendCode, fromUser }) {
        let target = null;
        if (targetUserId) {
            target = this.onlineUsers.get(targetUserId);
        } else if (targetFriendCode) {
            const cleanCode = targetFriendCode.trim().toUpperCase();
            for (const u of this.onlineUsers.values()) {
                if (u.friendCode && u.friendCode.toUpperCase() === cleanCode) {
                    target = u;
                    break;
                }
            }
        }

        if (!target || !target.ws || target.ws.readyState !== WebSocket.OPEN) {
            this.sendSafe(ws, { type: 'INVITE_ERROR', message: 'Người bạn này hiện không trực tuyến.' });
            return;
        }
        if (target.status === 'IN_MATCH') {
            this.sendSafe(ws, { type: 'INVITE_ERROR', message: 'Bạn bè này đang trong trận đấu khác.' });
            return;
        }

        const inviteId = 'inv_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
        const inviterPlayer = {
            ws,
            userId: fromUser.userId,
            username: fromUser.username || 'Chiến Binh TOEIC',
            friendCode: fromUser.friendCode || '',
            avatar: fromUser.avatar || '/assets/mascot/soi_may_avt.png'
        };

        this.pendingInvites.set(inviteId, {
            inviteId,
            inviter: inviterPlayer,
            targetUserId: target.userId,
            createdAt: Date.now()
        });

        // Gửi lời mời thách đấu tới bạn bè
        this.sendSafe(target.ws, {
            type: 'FRIEND_INVITATION',
            inviteId,
            fromUser: {
                userId: inviterPlayer.userId,
                username: inviterPlayer.username,
                friendCode: inviterPlayer.friendCode,
                avatar: inviterPlayer.avatar
            }
        });

        this.sendSafe(ws, {
            type: 'INVITE_SENT',
            inviteId,
            targetUsername: target.username,
            targetFriendCode: target.friendCode,
            message: 'Đã gửi lời thách đấu tới ' + target.username + '. Chờ bạn phản hồi...'
        });
    }

    acceptInvite(ws, { inviteId, user }) {
        const invite = this.pendingInvites.get(inviteId);
        if (!invite) {
            this.sendSafe(ws, { type: 'INVITE_ERROR', message: 'Lời mời này đã hết hạn.' });
            return;
        }
        this.pendingInvites.delete(inviteId);

        const p1 = invite.inviter;
        const p2 = {
            ws,
            userId: user.userId,
            username: user.username,
            avatar: user.avatar
        };

        if (this.onlineUsers.has(p1.userId)) this.onlineUsers.get(p1.userId).status = 'IN_MATCH';
        if (this.onlineUsers.has(p2.userId)) this.onlineUsers.get(p2.userId).status = 'IN_MATCH';
        this.broadcastOnlineUsers();

        this.createMatch(p1, p2, false);
    }

    rejectInvite(ws, { inviteId, user }) {
        const invite = this.pendingInvites.get(inviteId);
        if (!invite) return;
        this.pendingInvites.delete(inviteId);

        if (invite.inviter.ws && invite.inviter.ws.readyState === WebSocket.OPEN) {
            this.sendSafe(invite.inviter.ws, {
                type: 'INVITE_REJECTED',
                byUsername: user.username || 'Bạn bè',
                message: (user.username || 'Bạn của bạn') + ' đã từ chối lời thách đấu.'
            });
        }
    }

    enqueuePlayer(ws, { userId, username, avatar }) {
        // Xóa người chơi khỏi hàng đợi cũ nếu đã tồn tại
        this.removeFromQueue(ws);

        const player = {
            ws,
            userId: userId || 'player_' + Date.now(),
            username: username || 'Chiến Binh TOEIC',
            avatar: avatar || '/assets/mascot/soi_may_avt.png',
            joinedAt: Date.now(),
            queueTimeout: null
        };

        this.waitingQueue.push(player);
        this.sendSafe(ws, { type: 'QUEUE_STATUS', status: 'SEARCHING_OPPONENT', queueSize: this.waitingQueue.length });

        // Nếu có từ 2 người trở lên trong hàng đợi -> Ghép trận người thật ngay lập tức
        if (this.waitingQueue.length >= 2) {
            const p1 = this.waitingQueue.shift();
            const p2 = this.waitingQueue.shift();

            if (p1.queueTimeout) { clearTimeout(p1.queueTimeout); p1.queueTimeout = null; }
            if (p2.queueTimeout) { clearTimeout(p2.queueTimeout); p2.queueTimeout = null; }

            this.createMatch(p1, p2, false);
            return;
        }

        // Hẹn giờ chính xác 5.0 giây (5000ms): Nếu không có người thật thì ghép với Bot AI Sói Mây (F22.5)
        player.queueTimeout = setTimeout(() => {
            const idx = this.waitingQueue.findIndex(p => p.ws === ws);
            if (idx !== -1) {
                const singlePlayer = this.waitingQueue.splice(idx, 1)[0];
                if (singlePlayer && singlePlayer.queueTimeout) {
                    clearTimeout(singlePlayer.queueTimeout);
                    singlePlayer.queueTimeout = null;
                }
                const botPlayer = {
                    ws: null,
                    isBot: true,
                    userId: 'bot_soi_may',
                    username: 'Sói Mây AI Bot 🐺',
                    avatar: '/assets/mascot/may_explorer.png'
                };
                this.createMatch(singlePlayer, botPlayer, true);
            }
        }, 5000);
    }

    removeFromQueue(ws) {
        const idx = this.waitingQueue.findIndex(p => p.ws === ws);
        if (idx !== -1) {
            const [player] = this.waitingQueue.splice(idx, 1);
            if (player && player.queueTimeout) {
                clearTimeout(player.queueTimeout);
                player.queueTimeout = null;
            }
        }
    }

    createMatch(p1, p2, isBotMatch) {
        const matchId = 'match_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
        const words = getRandomQuestions(10);

        const match = {
            matchId,
            duration: 60,
            remainingSeconds: 60,
            words,
            startedAt: Date.now(),
            isBotMatch,
            player1: {
                ...p1,
                score: 0,
                combo: 0,
                maxCombo: 0,
                currentIndex: 0,
                finished: false,
                reconnecting: false
            },
            player2: {
                ...p2,
                score: 0,
                combo: 0,
                maxCombo: 0,
                currentIndex: 0,
                finished: false,
                reconnecting: false
            },
            timer: null,
            botTimeout: null,
            disconnectGraceTimer: null
        };

        this.activeMatches.set(matchId, match);
        if (p1.ws) p1.ws.currentMatchId = matchId;
        if (p2.ws) p2.ws.currentMatchId = matchId;

        // Bắn tín hiệu MATCH_FOUND cho Player 1
        this.sendSafe(p1.ws, {
            type: 'MATCH_FOUND',
            matchId,
            duration: 60,
            words,
            isBotMatch: !!isBotMatch,
            me: { username: p1.username, avatar: p1.avatar },
            opponent: { username: p2.username, avatar: p2.avatar, isBot: !!p2.isBot }
        });

        // Bắn tín hiệu MATCH_FOUND cho Player 2 (nếu là người thật)
        if (!isBotMatch && p2.ws) {
            this.sendSafe(p2.ws, {
                type: 'MATCH_FOUND',
                matchId,
                duration: 60,
                words,
                isBotMatch: false,
                me: { username: p2.username, avatar: p2.avatar },
                opponent: { username: p1.username, avatar: p1.avatar, isBot: false }
            });
        }

        // Bắt đầu đếm ngược 60 giây và đồng bộ TICK_SYNC
        match.timer = setInterval(() => {
            match.remainingSeconds--;

            this.broadcastMatch(match, {
                type: 'TICK_SYNC',
                remainingSeconds: match.remainingSeconds
            });

            if (match.remainingSeconds <= 0) {
                this.endMatch(matchId, 'TIME_UP');
            }
        }, 1000);

        // Kích hoạt mô phỏng bot AI nếu là Bot Match
        if (isBotMatch) {
            this.startBotSimulation(match);
        }
    }

    startBotSimulation(match) {
        let botIndex = 0;
        const answerNextWord = () => {
            if (match.remainingSeconds <= 0 || !this.activeMatches.has(match.matchId) || botIndex >= 10) {
                return;
            }

            // Độ trễ Bot AI trả lời: 1.5s - 4.5s (1500 + Math.random() * 3000)
            const delay = 1500 + Math.random() * 3000;
            match.botTimeout = setTimeout(() => {
                if (match.remainingSeconds <= 0 || !this.activeMatches.has(match.matchId)) return;

                // Tỷ lệ chính xác động của Bot Sói Mây: ~70-85%
                const accuracy = 0.70 + Math.random() * 0.15;
                const isCorrect = Math.random() < accuracy;
                const currentWord = match.words[botIndex];
                if (!currentWord) return;

                if (isCorrect) {
                    match.player2.combo++;
                    if (match.player2.combo > match.player2.maxCombo) match.player2.maxCombo = match.player2.combo;
                    const comboMultiplier = match.player2.combo >= 5 ? 1.5 : (match.player2.combo >= 3 ? 1.2 : 1.0);
                    const speedBonus = Math.round(Math.max(10, 50 - (delay / 150)));
                    match.player2.score += Math.round((100 + speedBonus) * comboMultiplier);
                } else {
                    match.player2.combo = 0;
                }

                botIndex++;
                match.player2.currentIndex = botIndex;

                // Báo điểm cập nhật cho người chơi thật
                this.seq++;
                this.sendSafe(match.player1.ws, {
                    type: 'SCORE_UPDATE',
                    seq: this.seq,
                    myScore: match.player1.score,
                    myCombo: match.player1.combo,
                    opponentScore: match.player2.score,
                    opponentCombo: match.player2.combo,
                    opponentIndex: botIndex
                });

                if (botIndex >= 10) {
                    match.player2.finished = true;
                    if (match.player1.finished) {
                        this.endMatch(match.matchId, 'ALL_ANSWERED');
                    }
                } else {
                    answerNextWord();
                }
            }, delay);
        };

        answerNextWord();
    }

    processAnswer(ws, { matchId, wordIndex, answer, responseTimeMs }) {
        const match = this.activeMatches.get(matchId);
        if (!match || match.remainingSeconds <= 0) return;

        const isP1 = match.player1.ws === ws;
        const player = isP1 ? match.player1 : match.player2;
        if (!player) return;

        if (!player.answeredIndices) player.answeredIndices = new Set();
        if (player.answeredIndices.has(wordIndex)) {
            return; // Reject duplicate answer submission for same word
        }
        player.answeredIndices.add(wordIndex);

        const opponent = isP1 ? match.player2 : match.player1;

        const currentWord = match.words[wordIndex];
        if (!currentWord) return;

        const isCorrect = (answer === currentWord.correctIndex);

        if (isCorrect) {
            player.combo++;
            if (player.combo > player.maxCombo) player.maxCombo = player.combo;
            const comboMultiplier = player.combo >= 5 ? 1.5 : (player.combo >= 3 ? 1.2 : 1.0);
            const safeResponseTime = (typeof responseTimeMs === 'number' && !isNaN(responseTimeMs))
                ? Math.max(0, Math.min(10000, responseTimeMs))
                : 1500;
            const speedBonus = Math.max(0, Math.round(50 - (safeResponseTime / 200)));
            player.score += Math.round((100 + speedBonus) * comboMultiplier);
        } else {
            player.combo = 0;
        }

        player.currentIndex = wordIndex + 1;
        if (player.currentIndex >= 10) {
            player.finished = true;
        }

        // Tăng bộ đếm seq monotonic để phân xử xung đột đồng thời (F22.B3)
        this.seq++;
        const submissionSeq = this.seq;

        // Đồng bộ điểm số
        this.sendSafe(player.ws, {
            type: 'SCORE_UPDATE',
            seq: submissionSeq,
            myScore: player.score,
            myCombo: player.combo,
            opponentScore: opponent.score,
            opponentCombo: opponent.combo,
            opponentIndex: opponent.currentIndex
        });

        if (opponent.ws) {
            this.sendSafe(opponent.ws, {
                type: 'SCORE_UPDATE',
                seq: submissionSeq,
                myScore: opponent.score,
                myCombo: opponent.combo,
                opponentScore: player.score,
                opponentCombo: player.combo,
                opponentIndex: player.currentIndex
            });
        }

        // Nếu người chơi hoàn thành 10 câu trong trận đấu với Bot AI -> Hoàn tất bot ngay trong 400ms
        if (match.isBotMatch && player.finished) {
            if (match.botTimeout) clearTimeout(match.botTimeout);
            while (opponent.currentIndex < 10) {
                opponent.currentIndex++;
                if (Math.random() < 0.75) {
                    opponent.combo++;
                    opponent.score += Math.round(115 * (opponent.combo >= 3 ? 1.2 : 1.0));
                } else {
                    opponent.combo = 0;
                }
            }
            opponent.finished = true;
            this.sendSafe(player.ws, {
                type: 'SCORE_UPDATE',
                seq: ++this.seq,
                myScore: player.score,
                myCombo: player.combo,
                opponentScore: opponent.score,
                opponentCombo: opponent.combo,
                opponentIndex: 10
            });
            setTimeout(() => {
                this.endMatch(matchId, 'ALL_ANSWERED');
            }, 350);
            return;
        }

        // Nếu cả hai đều đã hoàn thành 10 câu -> Kết thúc trận đấu sớm
        if (match.player1.finished && match.player2.finished) {
            this.endMatch(matchId, 'ALL_ANSWERED');
        }
    }

    handlePlayerReconnect(ws, { matchId, userId }) {
        const match = this.activeMatches.get(matchId);
        if (!match) {
            this.sendSafe(ws, { type: 'ERROR', message: 'Match not found or already ended' });
            return;
        }

        const isP1 = match.player1.userId === userId;
        const isP2 = match.player2.userId === userId;
        if (!isP1 && !isP2) return;

        const player = isP1 ? match.player1 : match.player2;
        const opponent = isP1 ? match.player2 : match.player1;

        if (match.disconnectGraceTimer) {
            clearTimeout(match.disconnectGraceTimer);
            match.disconnectGraceTimer = null;
        }

        player.ws = ws;
        ws.currentMatchId = matchId;
        player.reconnecting = false;

        // Báo cho đối thủ biết đã kết nối lại
        if (opponent.ws) {
            this.sendSafe(opponent.ws, { type: 'OPPONENT_RECONNECTED', state: 'PLAYING' });
        }

        // Phục hồi lại trạng thái trận đấu cho người vừa kết nối lại
        this.sendSafe(ws, {
            type: 'RECONNECT_SUCCESS',
            matchId,
            words: match.words,
            currentIndex: player.currentIndex,
            myScore: player.score,
            myCombo: player.combo,
            opponentScore: opponent.score,
            opponentCombo: opponent.combo,
            remainingSeconds: match.remainingSeconds
        });
    }

    handleDisconnection(ws) {
        this.removeFromQueue(ws);

        if (ws.userId && this.onlineUsers.has(ws.userId)) {
            this.onlineUsers.delete(ws.userId);
            this.broadcastOnlineUsers();
        }
        if (ws.hostedRoomCode && this.customRooms.has(ws.hostedRoomCode)) {
            this.customRooms.delete(ws.hostedRoomCode);
        }

        if (ws.currentMatchId) {
            const matchId = ws.currentMatchId;
            const match = this.activeMatches.get(matchId);
            if (!match) return;

            // Nếu là trận đấu với Bot AI, hủy trận ngay lập tức khi người chơi thoát
            if (match.isBotMatch) {
                this.handlePlayerLeave(ws, matchId);
                return;
            }

            // Nếu là Human vs Human: Bật thời gian ân hạn 5 giây (F22.B1)
            const isP1 = match.player1.ws === ws;
            const leaver = isP1 ? match.player1 : match.player2;
            const remaining = isP1 ? match.player2 : match.player1;

            leaver.reconnecting = true;
            leaver.ws = null;

            if (remaining.ws) {
                this.sendSafe(remaining.ws, {
                    type: 'OPPONENT_DISCONNECTED',
                    state: 'RECONNECTING',
                    graceSeconds: 5
                });
            }

            // Nếu sau 5 giây không kết nối lại -> Đối thủ thắng mặc định (F22.B2)
            match.disconnectGraceTimer = setTimeout(() => {
                if (this.activeMatches.has(matchId)) {
                    if (remaining.ws) {
                        this.sendSafe(remaining.ws, {
                            type: 'MATCH_END',
                            reason: 'OPPONENT_DISCONNECTED',
                            result: 'VICTORY',
                            winner: 'YOU',
                            myScore: remaining.score,
                            opponentScore: leaver.score,
                            rankDelta: 25,
                            xpEarned: 50
                        });
                        remaining.ws.currentMatchId = null;
                    }
                    clearInterval(match.timer);
                    if (match.botTimeout) clearTimeout(match.botTimeout);
                    this.activeMatches.delete(matchId);
                }
            }, 5000);
        }
    }

    handlePlayerLeave(ws, matchId) {
        const match = this.activeMatches.get(matchId);
        if (!match) return;

        const isP1 = match.player1.ws === ws;
        const leaver = isP1 ? match.player1 : match.player2;
        const remaining = isP1 ? match.player2 : match.player1;

        if (remaining.ws) {
            this.sendSafe(remaining.ws, {
                type: 'MATCH_END',
                reason: 'OPPONENT_SURRENDERED',
                result: 'VICTORY',
                winner: 'YOU',
                myScore: remaining.score,
                opponentScore: leaver.score,
                rankDelta: 25,
                xpEarned: 50
            });
        }

        clearInterval(match.timer);
        if (match.botTimeout) clearTimeout(match.botTimeout);
        if (match.disconnectGraceTimer) clearTimeout(match.disconnectGraceTimer);
        this.activeMatches.delete(matchId);
    }

    endMatch(matchId, reason) {
        const match = this.activeMatches.get(matchId);
        if (!match) return;

        clearInterval(match.timer);
        if (match.botTimeout) clearTimeout(match.botTimeout);
        if (match.disconnectGraceTimer) clearTimeout(match.disconnectGraceTimer);

        const s1 = match.player1.score;
        const s2 = match.player2.score;

        let p1Result = 'DRAW';
        let p2Result = 'DRAW';
        let p1Delta = 5;
        let p2Delta = 5;

        if (s1 > s2) {
            p1Result = 'VICTORY';
            p2Result = 'DEFEAT';
            p1Delta = 25;
            p2Delta = -10;
        } else if (s2 > s1) {
            p1Result = 'DEFEAT';
            p2Result = 'VICTORY';
            p1Delta = -10;
            p2Delta = 25;
        }

        this.sendSafe(match.player1.ws, {
            type: 'MATCH_END',
            reason,
            result: p1Result,
            winner: s1 > s2 ? 'my' : (s2 > s1 ? 'opponent' : 'draw'),
            myScore: s1,
            opponentScore: s2,
            myMaxCombo: match.player1.maxCombo,
            rankDelta: p1Delta,
            xpEarned: p1Result === 'VICTORY' ? 50 : 20
        });

        if (match.player2.ws) {
            this.sendSafe(match.player2.ws, {
                type: 'MATCH_END',
                reason,
                result: p2Result,
                winner: s2 > s1 ? 'my' : (s1 > s2 ? 'opponent' : 'draw'),
                myScore: s2,
                opponentScore: s1,
                myMaxCombo: match.player2.maxCombo,
                rankDelta: p2Delta,
                xpEarned: p2Result === 'VICTORY' ? 50 : 20
            });
        }

        if (match.player1.ws) match.player1.ws.currentMatchId = null;
        if (match.player2.ws) match.player2.ws.currentMatchId = null;
        this.activeMatches.delete(matchId);
    }

    broadcastMatch(match, payload) {
        if (match.player1.ws) this.sendSafe(match.player1.ws, payload);
        if (match.player2.ws) this.sendSafe(match.player2.ws, payload);
    }

    sendSafe(ws, payload) {
        if (ws && ws.readyState === WebSocket.OPEN) {
            try {
                ws.send(JSON.stringify(payload));
            } catch (err) {
                console.error('[PvP WS] Send failed:', err.message);
            }
        }
    }
}

const pvpArenaServerInstance = new PvPArenaServer();

module.exports = {
    setupPvPArenaWebSocket: (server) => pvpArenaServerInstance.init(server),
    pvpArenaServerInstance,
    PVP_VOCAB_BANK
};
