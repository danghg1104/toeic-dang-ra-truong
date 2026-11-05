const WebSocket = require('ws');
const assert = require('assert');
const http = require('http');

function postJson(urlPath, data, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify(data);
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: urlPath,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
        ...headers
      }
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function getJson(urlPath, headers = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: urlPath,
      method: 'GET',
      headers
    }, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  console.log('--- Test: PvP Friend Code & Real-Time Battle Invite ---');

  // 1. Verify User 1 (Huynh Dang) Friend Code via API
  console.log('Checking /api/me for Friend Code...');
  const meRes = await getJson('/api/me');
  assert.strictEqual(meRes.status, 200, '/api/me must return 200');
  assert.ok(meRes.data.user, 'Must return user object');
  console.log(`User ${meRes.data.user.name} has friendCode: ${meRes.data.user.friendCode}`);
  assert.strictEqual(meRes.data.user.friendCode, 'HD-7133', 'Huynh Dang must have exclusive friendCode HD-7133');

  // 1b. Test Friend Add API
  console.log('Testing /api/user/friends/add with code KT-2026 (Kiem Thu)...');
  const addRes = await postJson('/api/user/friends/add', { friendCode: 'KT-2026', userId: meRes.data.user.id });
  console.log('Add friend result:', addRes.data);
  assert.ok(addRes.data.success || addRes.data.error.includes('đã có'), 'Friend add must succeed or report already friend');

  const friendsListRes = await getJson(`/api/user/friends?userId=${meRes.data.user.id}`);
  assert.strictEqual(friendsListRes.status, 200);
  assert.ok(Array.isArray(friendsListRes.data.friends), 'Must return friends array');
  console.log(`Current friends count: ${friendsListRes.data.friends.length}`);

  // 2. Test WebSocket Friend Presence & Real-Time Invite between 2 players
  console.log('Testing WebSocket 1v1 Invite between Player A and Player B...');
  const wsA = new WebSocket('ws://localhost:3000/ws/pvp');
  const wsB = new WebSocket('ws://localhost:3000/ws/pvp');

  await Promise.all([
    new Promise(r => wsA.on('open', r)),
    new Promise(r => wsB.on('open', r))
  ]);

  const pA = { userId: 'player_a_' + Date.now(), name: 'Dang Master', friendCode: 'DM-9999' };
  const pB = { userId: 'player_b_' + Date.now(), name: 'Challenger Friend', friendCode: 'CF-8888' };

  const msgsA = [];
  const msgsB = [];
  wsA.on('message', raw => msgsA.push(JSON.parse(raw.toString())));
  wsB.on('message', raw => msgsB.push(JSON.parse(raw.toString())));

  // Register both
  wsA.send(JSON.stringify({ type: 'REGISTER_USER', ...pA }));
  wsB.send(JSON.stringify({ type: 'REGISTER_USER', ...pB }));

  await new Promise(r => setTimeout(r, 200));

  // Player A sends battle invite to Player B
  console.log(`Player A (${pA.name}) sending invite to Player B (${pB.userId})...`);
  wsA.send(JSON.stringify({
    type: 'INVITE_FRIEND',
    targetUserId: pB.userId,
    fromUser: {
      userId: pA.userId,
      username: pA.name,
      friendCode: pA.friendCode
    }
  }));

  // Wait for Player B to receive FRIEND_INVITATION
  let invitation = null;
  const startInviteWait = Date.now();
  while (!invitation && Date.now() - startInviteWait < 3000) {
    const inv = msgsB.find(m => m.type === 'FRIEND_INVITATION');
    if (inv) {
      invitation = inv;
      break;
    }
    await new Promise(r => setTimeout(r, 50));
  }

  assert.ok(invitation, 'Player B must receive FRIEND_INVITATION');
  console.log('Player B received FRIEND_INVITATION! InviteId:', invitation.inviteId);

  // Player B accepts the invite
  console.log('Player B accepting invite...');
  wsB.send(JSON.stringify({
    type: 'ACCEPT_INVITE',
    inviteId: invitation.inviteId,
    user: {
      userId: pB.userId,
      username: pB.name,
      friendCode: pB.friendCode
    }
  }));

  // Both players must receive MATCH_FOUND for the same matchId
  let matchA = null;
  let matchB = null;
  const startMatchWait = Date.now();
  while ((!matchA || !matchB) && Date.now() - startMatchWait < 3000) {
    if (!matchA) matchA = msgsA.find(m => m.type === 'MATCH_FOUND');
    if (!matchB) matchB = msgsB.find(m => m.type === 'MATCH_FOUND');
    await new Promise(r => setTimeout(r, 50));
  }

  assert.ok(matchA, 'Player A must receive MATCH_FOUND');
  assert.ok(matchB, 'Player B must receive MATCH_FOUND');
  assert.strictEqual(matchA.matchId, matchB.matchId, 'Both players must be in the same matchId');
  assert.strictEqual(matchA.isBotMatch, false, 'Invite match must be real 1v1 human match');
  console.log('✓ Both players matched in 1v1 battle:', matchA.matchId);

  wsA.close();
  wsB.close();
  console.log('✓ PASS: All friend code & invite scenarios passed!');
  process.exit(0);
})().catch(err => {
  console.error('Test Failed:', err.message);
  process.exit(1);
});
