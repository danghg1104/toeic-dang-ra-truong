'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const http = require('http');
const net = require('net');
const { spawn } = require('child_process');
const WebSocket = require('ws');

const projectRoot = path.resolve(__dirname, '..');
const serverPath = path.join(projectRoot, 'server.js');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getFreePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

function request(port, urlPath, method, cookie, body, origin) {
  return new Promise((resolve, reject) => {
    const payload = body === undefined ? null : Buffer.from(JSON.stringify(body));
    const headers = {};
    if (cookie) headers.Cookie = cookie;
    if (payload) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = payload.length;
    }
    if (origin) headers.Origin = origin;

    const req = http.request({
      hostname: '127.0.0.1',
      port,
      path: urlPath,
      method: method || 'GET',
      headers
    }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString('utf8');
        let data = null;
        try { data = JSON.parse(raw); } catch (e) {}
        resolve({ status: res.statusCode, headers: res.headers, data, raw });
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function waitForHealth(port, child) {
  for (let i = 0; i < 60; i++) {
    if (child.exitCode !== null) throw new Error('Server exited early with code ' + child.exitCode);
    try {
      const result = await request(port, '/health', 'GET');
      if (result.status === 200) return;
    } catch (e) {}
    await delay(150);
  }
  throw new Error('Server healthcheck did not become ready');
}

function connectWs(url, cookie, origin) {
  return new Promise((resolve, reject) => {
    const headers = cookie ? { Cookie: cookie } : {};
    if (origin) headers.Origin = origin;
    const ws = new WebSocket(url, { headers });
    const messages = [];
    ws.on('message', raw => {
      try { messages.push(JSON.parse(raw.toString())); } catch (e) {}
    });
    ws.once('open', () => resolve({ ws, messages }));
    ws.once('unexpected-response', (req, res) => resolve({ status: res.statusCode, ws, messages }));
    ws.once('error', err => {
      if (ws.readyState === WebSocket.CLOSED) {
        // The HTTP status is asserted through unexpected-response when available.
      } else {
        reject(err);
      }
    });
  });
}

async function waitForMessage(messages, type, timeoutMs = 3000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const found = messages.find(item => item.type === type);
    if (found) return found;
    await delay(20);
  }
  throw new Error('Timed out waiting for WebSocket message ' + type);
}

(async () => {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'toeic-security-regression-'));
  const dataDir = path.join(tempRoot, 'data');
  const profilesDir = path.join(dataDir, 'profiles');
  fs.mkdirSync(profilesDir, { recursive: true });

  const now = Date.now();
  const tokenA = 'synthetic-session-token-a';
  const tokenB = 'synthetic-session-token-b';
  const legacyToken = 'synthetic-legacy-session-token';

  const users = [
    {
      id: 'test-user-a',
      name: 'Test User A',
      username: 'testa',
      email: 'test-a@example.test',
      friendCode: 'TA-1001',
      avatar: '/assets/mascot/soi_may_avt.png'
    },
    {
      id: 'test-user-b',
      name: 'Test User B',
      username: 'testb',
      email: 'test-b@example.test',
      friendCode: 'TB-2002',
      avatar: '/assets/mascot/soi_may_avt.png'
    }
  ];

  fs.writeFileSync(path.join(dataDir, 'users_database.json'), JSON.stringify(users, null, 2));
  fs.writeFileSync(path.join(dataDir, 'sessions_database.json'), JSON.stringify({
    [tokenA]: { userId: 'test-user-a', version: 2, createdAt: new Date(now).toISOString(), expiresAt: now + 3600000 },
    [tokenB]: { userId: 'test-user-b', version: 2, createdAt: new Date(now).toISOString(), expiresAt: now + 3600000 },
    [legacyToken]: { userId: 'test-user-a', createdAt: new Date(now).toISOString(), expiresAt: now + 3600000 }
  }, null, 2));
  fs.writeFileSync(path.join(dataDir, 'study_sync_store.json'), JSON.stringify({ synthetic: true }));
  fs.writeFileSync(path.join(profilesDir, 'test-user-a.json'), JSON.stringify({ userId: 'test-user-a', friends: [], state: { xp: 7 } }));
  fs.writeFileSync(path.join(profilesDir, 'test-user-b.json'), JSON.stringify({ userId: 'test-user-b', friends: [], state: { xp: 9 } }));

  const port = await getFreePort();
  const child = spawn(process.execPath, [serverPath], {
    cwd: projectRoot,
    env: {
      ...process.env,
      PORT: String(port),
      DATA_DIR: dataDir,
      NODE_ENV: 'test',
      RENDER_EXTERNAL_URL: '',
      APP_URL: '',
      APP_ORIGIN: '',
      HTTPS_PORT: '0'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let serverOutput = '';
  child.stdout.on('data', chunk => { serverOutput += chunk.toString(); });
  child.stderr.on('data', chunk => { serverOutput += chunk.toString(); });

  const cookieA = 'cd_session=' + tokenA;
  const cookieB = 'cd_session=' + tokenB;

  try {
    await waitForHealth(port, child);

    console.log('1) Public static routes remain available.');
    assert.strictEqual((await request(port, '/', 'GET')).status, 200);
    assert.strictEqual((await request(port, '/index.html', 'GET')).status, 200);
    assert.strictEqual((await request(port, '/css/app.bundle.css', 'GET')).status, 200);
    assert.strictEqual((await request(port, '/js/pvp-arena-client.js', 'GET')).status, 200);
    assert.strictEqual((await request(port, '/assets/mascot/may_avatar.png', 'GET')).status, 200);
    const mascotCache = await request(port, '/assets/mascot/may_avatar.png', 'HEAD');
    assert.strictEqual(mascotCache.status, 200);
    assert.ok(mascotCache.headers['cache-control'].includes('no-cache'), 'optimized mascot must revalidate cached copies');
    const serviceWorker = await request(port, '/sw.js', 'GET');
    assert.strictEqual(serviceWorker.status, 200);
    assert.ok(serviceWorker.raw.includes('study-studio-cache-v24-security-reading-assets'));
    assert.ok(!/<script[^>]+src=["'][^"']*reading-practice-database\.js/i.test((await request(port, '/', 'GET')).raw),
      'large Reading database must not load from the initial HTML');

    console.log('2) Private project files and user stores are not served.');
    const blockedPaths = [
      '/data/users_database.json',
      '/data/sessions_database.json',
      '/data/study_sync_store.json',
      '/data/profiles/test-user-a.json',
      '/data/dictionary_cache.json',
      '/data/listening_database_v2.json',
      '/data/cleaned_extracted_passages.json',
      '/data/curated_vocab_topics.json',
      '/data/dailydictation/test_01.json',
      '/public/data/users_database.json',
      '/public/data/sessions_database.json',
      '/public/data/profiles/test-user-a.json',
      '/public/data/ets2026_raw/test.pdf',
      '/data/ets2026_raw/ETS%202026%20READING%20TEST%201-%20KEY.pdf',
      '/data_backup_pre_auth/users_database.json',
      '/server.js',
      '/package.json',
      '/.env',
      '/.git/config',
      '/lib/pvp-arena-server.js',
      '/tests/test_pvp_friends_system.js',
      '/scripts/audit_passages.js'
    ];
    for (const p of blockedPaths) {
      const result = await request(port, p, 'HEAD');
      assert.strictEqual(result.status, 404, p + ' must be hidden (received ' + result.status + ')');
    }

    console.log('2b) Only explicitly approved browser learning assets remain public.');
    const publicDataPaths = [
      '/data/dictionary_lexicon.json',
      '/data/dictionary_lemmas.json',
      '/data/ets2026/test01_full.json',
      '/data/ocr_lang/eng.traineddata.gz',
      '/data/ocr_lang/vie.traineddata.gz'
    ];
    for (const p of publicDataPaths) {
      const result = await request(port, p, 'HEAD');
      assert.strictEqual(result.status, 200, p + ' must remain available (received ' + result.status + ')');
    }

    console.log('3) Caller-supplied userId cannot authenticate REST routes.');
    const meSpoof = await request(port, '/api/me?userId=test-user-a', 'GET');
    assert.strictEqual(meSpoof.status, 200);
    assert.strictEqual(meSpoof.data.authenticated, false);
    assert.strictEqual(meSpoof.data.user, null);

    const unauthenticatedCases = [
      ['/api/user/load-progress?userId=test-user-a', 'GET', undefined],
      ['/api/user/friends?userId=test-user-a', 'GET', undefined],
      ['/api/user/friends/add', 'POST', { userId: 'test-user-a', friendCode: 'TB-2002' }],
      ['/api/user/friends/remove', 'POST', { userId: 'test-user-a', friendId: 'test-user-b' }],
      ['/api/user/save-progress', 'POST', { userId: 'test-user-a', data: { state: { xp: 999 } } }],
      ['/api/user/profile', 'POST', { id: 'test-user-a', name: 'Spoofed' }],
      ['/api/user/record-activity', 'POST', { userId: 'test-user-a' }],
      ['/api/user/update-target', 'POST', { userId: 'test-user-a', targetScore: '990' }],
      ['/api/user/reset-progress', 'POST', { userId: 'test-user-a' }],
      ['/api/auth/delete-account', 'POST', { userId: 'test-user-a' }]
    ];
    for (const [url, method, body] of unauthenticatedCases) {
      const result = await request(port, url, method, null, body);
      assert.strictEqual(result.status, 401, url + ' must require a valid session');
    }

    console.log('4) Session schema version rejects legacy tokens.');
    const legacyMe = await request(port, '/api/me', 'GET', 'cd_session=' + legacyToken);
    assert.strictEqual(legacyMe.data.authenticated, false);

    console.log('5) A valid cookie identifies the account; client IDs are ignored.');
    const meA = await request(port, '/api/me?userId=test-user-b', 'GET', cookieA);
    assert.strictEqual(meA.status, 200);
    assert.strictEqual(meA.data.user.id, 'test-user-a');
    assert.strictEqual(meA.data.user.name, 'Test User A');

    const friendsBefore = await request(port, '/api/user/friends', 'GET', cookieA);
    assert.strictEqual(friendsBefore.status, 200);
    assert.deepStrictEqual(friendsBefore.data.friends, []);

    const addFriend = await request(port, '/api/user/friends/add', 'POST', cookieA, {
      userId: 'test-user-b',
      friendCode: 'TB-2002'
    });
    assert.strictEqual(addFriend.status, 200);
    assert.strictEqual(addFriend.data.success, true);

    const friendsAfter = await request(port, '/api/user/friends', 'GET', cookieA);
    assert.strictEqual(friendsAfter.data.friends.length, 1);
    assert.strictEqual(friendsAfter.data.friends[0].id, 'test-user-b');

    const removeFriend = await request(port, '/api/user/friends/remove', 'POST', cookieA, {
      userId: 'test-user-b',
      friendId: 'test-user-b'
    });
    assert.strictEqual(removeFriend.status, 200);
    const friendsFinal = await request(port, '/api/user/friends', 'GET', cookieA);
    assert.strictEqual(friendsFinal.data.friends.length, 0);

    console.log('6) Datamuse proxy rejects arbitrary upstream paths and invalid parameters.');
    const datamuseBadParam = await request(port, '/api/datamuse/words?ml=business&url=https://attacker.example', 'GET');
    assert.strictEqual(datamuseBadParam.status, 400);
    const datamuseBadLimit = await request(port, '/api/datamuse/words?ml=business&max=9999', 'GET');
    assert.strictEqual(datamuseBadLimit.status, 400);
    const datamuseWrongMethod = await request(port, '/api/datamuse/words?ml=business', 'POST');
    assert.strictEqual(datamuseWrongMethod.status, 405);

    console.log('7) CORS rejects an untrusted cross-origin browser request.');
    const cors = await request(port, '/api/me', 'GET', cookieA, undefined, 'https://attacker.example');
    assert.strictEqual(cors.status, 403);
    assert.strictEqual(cors.headers['access-control-allow-origin'], undefined);

    console.log('7) PvP WebSocket requires an authenticated session.');
    const wsUrl = 'ws://127.0.0.1:' + port + '/ws/pvp';
    const unauthWs = await connectWs(wsUrl, null);
    assert.strictEqual(unauthWs.status, 401);
    const crossOriginWs = await connectWs(wsUrl, cookieA, 'https://attacker.example');
    assert.strictEqual(crossOriginWs.status, 403);

    console.log('8) PvP identity and invitation participants are bound to server sessions.');
    const clientA = await connectWs(wsUrl, cookieA);
    const clientB = await connectWs(wsUrl, cookieB);
    assert.ok(clientA.ws && clientA.ws.readyState === WebSocket.OPEN);
    assert.ok(clientB.ws && clientB.ws.readyState === WebSocket.OPEN);

    await waitForMessage(clientA.messages, 'REGISTERED_OK');
    await waitForMessage(clientB.messages, 'REGISTERED_OK');

    clientA.ws.send(JSON.stringify({
      type: 'REGISTER_USER',
      userId: 'spoof-user-c',
      username: 'Imposter',
      avatar: '/evil.png',
      friendCode: 'XX-9999'
    }));
    await delay(80);
    const ackA = clientA.messages.filter(x => x.type === 'REGISTERED_OK').pop();
    assert.strictEqual(ackA.userId, 'test-user-a');

    clientA.ws.send(JSON.stringify({
      type: 'INVITE_FRIEND',
      targetUserId: 'test-user-b',
      fromUser: { userId: 'spoof-user-c', username: 'Imposter', friendCode: 'XX-9999' }
    }));
    const invitation = await waitForMessage(clientB.messages, 'FRIEND_INVITATION');
    assert.strictEqual(invitation.fromUser.userId, 'test-user-a');
    assert.strictEqual(invitation.fromUser.username, 'Test User A');

    clientB.ws.send(JSON.stringify({
      type: 'ACCEPT_INVITE',
      inviteId: invitation.inviteId,
      user: { userId: 'spoof-user-c', username: 'Imposter' }
    }));
    const matchA = await waitForMessage(clientA.messages, 'MATCH_FOUND');
    const matchB = await waitForMessage(clientB.messages, 'MATCH_FOUND');
    assert.strictEqual(matchA.matchId, matchB.matchId);
    assert.strictEqual(matchA.me.username, 'Test User A');
    assert.strictEqual(matchB.me.username, 'Test User B');
    assert.strictEqual(matchA.opponent.username, 'Test User B');
    assert.strictEqual(matchB.opponent.username, 'Test User A');

    clientA.ws.close();
    clientB.ws.close();
    await delay(100);

    console.log('PASS: private-file, REST auth, session rotation, CORS and PvP identity regression checks passed.');
  } finally {
    try { child.kill(); } catch (e) {}
    await delay(100);
    fs.rmSync(tempRoot, { recursive: true, force: true });
    if (child.exitCode !== null && child.exitCode !== 0) {
      console.error(serverOutput.slice(-4000));
    }
  }
})().catch(err => {
  console.error('SECURITY REGRESSION TEST FAILED:', err.stack || err.message);
  process.exitCode = 1;
});
