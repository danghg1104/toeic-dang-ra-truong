const fs = require('fs');

console.log('=== UPGRADING PVP VOCABULARY ARENA: MULTIPLAYER & REAL FRIENDS ===');

// =========================================================================
// 1. UPDATE lib/pvp-arena-server.js
// =========================================================================
let serverCode = fs.readFileSync('lib/pvp-arena-server.js', 'utf8');

// 1.1 Add onlineUsers, customRooms, pendingInvites to constructor
const oldConstructor = `        this.waitingQueue = [];
        this.activeMatches = new Map();
        this.cleanupInterval = null;
        this.seq = 0; // Bộ đếm thứ tự đơn điệu giải quyết xung đột đồng thời (F22.B3)`;

const newConstructor = `        this.waitingQueue = [];
        this.activeMatches = new Map();
        this.cleanupInterval = null;
        this.seq = 0; // Bộ đếm thứ tự đơn điệu giải quyết xung đột đồng thời (F22.B3)
        // Hệ thống phòng riêng và bạn bè tài khoản thật
        this.onlineUsers = new Map(); // userId -> { ws, userId, username, avatar, status }
        this.customRooms = new Map(); // roomCode -> { host: player, roomCode, createdAt }
        this.pendingInvites = new Map(); // inviteId -> { inviteId, inviter, targetUserId, createdAt }`;

if (serverCode.includes(oldConstructor)) {
    serverCode = serverCode.replace(oldConstructor, newConstructor);
    console.log('✅ Added onlineUsers, customRooms, and pendingInvites to server constructor');
}

// 1.2 Add switch cases in handleClientMessage
const oldSwitch = `        switch (data.type) {
            case 'JOIN_QUEUE':
                this.enqueuePlayer(ws, data);
                break;`;

const newSwitch = `        switch (data.type) {
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
                break;`;

if (serverCode.includes(oldSwitch)) {
    serverCode = serverCode.replace(oldSwitch, newSwitch);
    console.log('✅ Added new message handlers to handleClientMessage in server');
}

// 1.3 Add implementation methods for rooms and friends
const newServerMethods = `
    // =========================================================================
    // HỆ THỐNG PHÒNG RIÊNG VÀ KẾT BẠN THẬT (FRIENDS & CUSTOM ROOMS)
    // =========================================================================

    registerUser(ws, { userId, username, avatar }) {
        if (!userId) userId = 'user_' + Date.now();
        ws.userId = userId;
        this.onlineUsers.set(userId, {
            ws,
            userId,
            username: username || 'Chiến Binh TOEIC',
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
            roomCode,
            host: hostPlayer,
            createdAt: Date.now()
        });
        ws.hostedRoomCode = roomCode;
        if (this.onlineUsers.has(hostPlayer.userId)) {
            this.onlineUsers.get(hostPlayer.userId).status = 'IN_ROOM';
            this.broadcastOnlineUsers();
        }
        this.sendSafe(ws, {
            type: 'ROOM_CREATED',
            roomCode,
            message: 'Phòng riêng đã được tạo. Hãy gửi mã phòng hoặc link cho bạn bè!'
        });
    }

    joinCustomRoom(ws, { roomCode, userId, username, avatar }) {
        this.removeFromQueue(ws);
        const code = (roomCode || '').toString().trim();
        const room = this.customRooms.get(code);
        if (!room) {
            this.sendSafe(ws, {
                type: 'ROOM_ERROR',
                message: 'Mã phòng ' + code + ' không tồn tại hoặc đã hết hạn!'
            });
            return;
        }

        if (room.host.userId === userId) {
            this.sendSafe(ws, {
                type: 'ROOM_ERROR',
                message: 'Bạn là chủ phòng này, đang đợi bạn bè tham gia!'
            });
            return;
        }

        // Xóa phòng và ghép trận người thật ngay lập tức!
        this.customRooms.delete(code);
        const p1 = room.host;
        const p2 = {
            ws,
            userId: userId || 'player_' + Date.now(),
            username: username || 'Bạn Học TOEIC',
            avatar: avatar || '/assets/mascot/soi_may_avt.png'
        };

        if (this.onlineUsers.has(p1.userId)) this.onlineUsers.get(p1.userId).status = 'IN_MATCH';
        if (this.onlineUsers.has(p2.userId)) this.onlineUsers.get(p2.userId).status = 'IN_MATCH';
        this.broadcastOnlineUsers();

        this.createMatch(p1, p2, false);
    }

    cancelCustomRoom(ws, { roomCode, userId } = {}) {
        if (roomCode && this.customRooms.has(roomCode)) {
            this.customRooms.delete(roomCode);
        }
        if (ws.hostedRoomCode) {
            this.customRooms.delete(ws.hostedRoomCode);
            ws.hostedRoomCode = null;
        }
        const uId = userId || ws.userId;
        if (uId && this.onlineUsers.has(uId)) {
            this.onlineUsers.get(uId).status = 'IDLE';
            this.broadcastOnlineUsers();
        }
        this.sendSafe(ws, { type: 'ROOM_CANCELLED' });
    }

    inviteFriend(ws, { targetUserId, fromUser }) {
        const target = this.onlineUsers.get(targetUserId);
        if (!target || !target.ws || target.ws.readyState !== WebSocket.OPEN) {
            this.sendSafe(ws, { type: 'INVITE_ERROR', message: 'Bạn bè này hiện không trực tuyến.' });
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
            avatar: fromUser.avatar || '/assets/mascot/soi_may_avt.png'
        };

        this.pendingInvites.set(inviteId, {
            inviteId,
            inviter: inviterPlayer,
            targetUserId,
            createdAt: Date.now()
        });

        // Gửi lời mời thách đấu tới bạn bè
        this.sendSafe(target.ws, {
            type: 'FRIEND_INVITATION',
            inviteId,
            fromUser: {
                userId: inviterPlayer.userId,
                username: inviterPlayer.username,
                avatar: inviterPlayer.avatar
            }
        });

        this.sendSafe(ws, {
            type: 'INVITE_SENT',
            inviteId,
            targetUsername: target.username,
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
`;

if (!serverCode.includes('registerUser(ws,')) {
    serverCode = serverCode.replace('enqueuePlayer(ws, { userId, username, avatar }) {', `${newServerMethods}\n    enqueuePlayer(ws, { userId, username, avatar }) {`);
    console.log('✅ Injected room and friend handling methods into PvPArenaServer');
}

// 1.4 Update handleDisconnection to clean up onlineUsers and customRooms
const oldDiscon = `        this.removeFromQueue(ws);

        if (ws.currentMatchId) {`;

const newDiscon = `        this.removeFromQueue(ws);

        if (ws.userId && this.onlineUsers.has(ws.userId)) {
            this.onlineUsers.delete(ws.userId);
            this.broadcastOnlineUsers();
        }
        if (ws.hostedRoomCode && this.customRooms.has(ws.hostedRoomCode)) {
            this.customRooms.delete(ws.hostedRoomCode);
        }

        if (ws.currentMatchId) {`;

if (serverCode.includes(oldDiscon)) {
    serverCode = serverCode.replace(oldDiscon, newDiscon);
    console.log('✅ Added onlineUsers & hostedRoomCode cleanup to handleDisconnection');
}

// 1.5 Update endMatch to reset user status to IDLE
const oldEndMatch = `            if (match.player1.ws) match.player1.ws.currentMatchId = null;
            if (match.player2.ws) match.player2.ws.currentMatchId = null;
            this.activeMatches.delete(matchId);`;

const newEndMatch = `            if (match.player1.ws) match.player1.ws.currentMatchId = null;
            if (match.player2.ws) match.player2.ws.currentMatchId = null;
            if (match.player1.userId && this.onlineUsers.has(match.player1.userId)) {
                this.onlineUsers.get(match.player1.userId).status = 'IDLE';
            }
            if (match.player2.userId && this.onlineUsers.has(match.player2.userId)) {
                this.onlineUsers.get(match.player2.userId).status = 'IDLE';
            }
            this.broadcastOnlineUsers();
            this.activeMatches.delete(matchId);`;

if (serverCode.includes(oldEndMatch)) {
    serverCode = serverCode.replace(oldEndMatch, newEndMatch);
    console.log('✅ Added online user status reset to IDLE in endMatch');
}

fs.writeFileSync('lib/pvp-arena-server.js', serverCode, 'utf8');
console.log('🎉 Server-side PvP friend and custom room upgrades complete!');
