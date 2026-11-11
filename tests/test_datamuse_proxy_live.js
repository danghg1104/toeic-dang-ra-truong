'use strict';
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const net = require('net');
const http = require('http');
const { spawn } = require('child_process');

const projectRoot = path.resolve(__dirname, '..');
const serverPath = path.join(projectRoot, 'server.js');
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'toeic-datamuse-smoke-'));

function getPort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

function get(port, route, origin) {
  return new Promise((resolve, reject) => {
    const headers = origin ? { Origin: origin } : {};
    const req = http.get({ hostname: '127.0.0.1', port, path: route, headers }, res => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => resolve({
        status: res.statusCode,
        headers: res.headers,
        body: Buffer.concat(chunks).toString('utf8')
      }));
    });
    req.on('error', reject);
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  fs.writeFileSync(path.join(tempDir, 'users_database.json'), '[]');
  fs.writeFileSync(path.join(tempDir, 'sessions_database.json'), '{}');
  fs.writeFileSync(path.join(tempDir, 'study_sync_store.json'), '{}');

  const port = await getPort();
  const child = spawn(process.execPath, [serverPath], {
    cwd: projectRoot,
    env: { ...process.env, PORT: String(port), DATA_DIR: tempDir, HTTPS_PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe']
  });
  let output = '';
  child.stdout.on('data', data => { output += data.toString(); });
  child.stderr.on('data', data => { output += data.toString(); });

  try {
    let healthy = false;
    for (let i = 0; i < 60; i++) {
      try {
        const health = await get(port, '/health');
        if (health.status === 200) { healthy = true; break; }
      } catch (e) {}
      await delay(150);
    }
    assert.ok(healthy, 'local server did not start');

    const route = '/api/datamuse/words?ml=business&md=fpd&max=5';
    const first = await get(port, route);
    assert.strictEqual(first.status, 200, first.body);
    const words = JSON.parse(first.body);
    assert.ok(Array.isArray(words) && words.length > 0, 'Datamuse should return word results');
    assert.ok(first.headers['cache-control'].includes('max-age=300'));

    const second = await get(port, route);
    assert.strictEqual(second.status, 200);
    assert.deepStrictEqual(JSON.parse(second.body), words);

    const suggestions = await get(port, '/api/datamuse/sug?s=busines');
    assert.strictEqual(suggestions.status, 200, suggestions.body);
    assert.ok(Array.isArray(JSON.parse(suggestions.body)));

    const blockedOrigin = await get(port, route, 'https://attacker.example');
    assert.strictEqual(blockedOrigin.status, 403);

    console.log(JSON.stringify({
      result: 'PASS',
      wordsReturned: words.length,
      cacheControl: first.headers['cache-control'],
      suggestionsReturned: JSON.parse(suggestions.body).length,
      untrustedOriginBlocked: blockedOrigin.status === 403
    }, null, 2));
  } finally {
    child.kill();
    await delay(100);
    fs.rmSync(tempDir, { recursive: true, force: true });
    if (child.exitCode !== null && child.exitCode !== 0) console.error(output.slice(-3000));
  }
})().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
