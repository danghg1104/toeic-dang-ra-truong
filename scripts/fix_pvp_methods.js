const fs = require('fs');

console.log('=== FIXING PVP SERVER METHODS INJECTION ===');
let serverCode = fs.readFileSync('lib/pvp-arena-server.js', 'utf8');

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

    inviteFriend(ws, { targetUserId, fromUser }) {
        const target = this.onlineUsers.get(targetUserId);
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

// Check if registerUser method definition already exists
if (!serverCode.includes('registerUser(ws, { userId, username, avatar }) {')) {
    serverCode = serverCode.replace('enqueuePlayer(ws, { userId, username, avatar }) {', `${newServerMethods}\n    enqueuePlayer(ws, { userId, username, avatar }) {`);
    console.log('✅ Injected all friend and custom room methods into PvPArenaServer class');
} else {
    console.log('ℹ️ registerUser method already present');
}

fs.writeFileSync('lib/pvp-arena-server.js', serverCode, 'utf8');
if (fs.existsSync('www/lib/pvp-arena-server.js')) {
    fs.writeFileSync('www/lib/pvp-arena-server.js', serverCode, 'utf8');
    console.log('✅ Synchronized to www/lib/pvp-arena-server.js');
}
console.log('🎉 Fix complete!');
