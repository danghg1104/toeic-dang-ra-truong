const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9222;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function getJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Spawning Chrome...');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-background-networking'
  ]);

  chromeProcess.on('error', (err) => console.error('Chrome spawn error:', err));

  // Wait for debugging port
  let targets;
  for (let i = 0; i < 30; i++) {
    await sleep(300);
    try {
      targets = await getJson(`http://127.0.0.1:${PORT}/json/list`);
      if (targets && targets.length > 0) break;
    } catch (e) {}
  }

  if (!targets || targets.length === 0) {
    // create a target
    const newTarget = await getJson(`http://127.0.0.1:${PORT}/json/new?http://localhost:3000/#nghe`);
    targets = [newTarget];
  }

  const pageTarget = targets.find(t => t.type === 'page') || targets[0];
  console.log('Connecting to target:', pageTarget.title, pageTarget.webSocketDebuggerUrl);

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);

  let msgId = 1;
  const callbacks = new Map();

  ws.on('message', (data) => {
    const res = JSON.parse(data);
    if (res.id && callbacks.has(res.id)) {
      const cb = callbacks.get(res.id);
      callbacks.delete(res.id);
      if (res.error) cb.reject(res.error);
      else cb.resolve(res.result);
    }
  });

  await new Promise(resolve => ws.on('open', resolve));

  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      callbacks.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');
  await send('DOM.enable');

  console.log('Navigating to http://localhost:3000/#nghe...');
  await send('Page.navigate', { url: 'http://localhost:3000/#nghe' });
  await sleep(2000);

  // Set mock user so login modal doesn't block
  await send('Runtime.evaluate', {
    expression: `
      localStorage.setItem('cung_dang_session_user', JSON.stringify({
        id: 'acc-test-senior',
        name: 'Nguyễn Văn Đăng',
        email: 'dang.test@toeic.edu.vn',
        targetScore: 850
      }));
      window.currentUserAccount = {
        id: 'acc-test-senior',
        name: 'Nguyễn Văn Đăng',
        targetScore: 850
      };
      if (typeof switchTab === 'function') {
        switchTab('nghe');
      }
    `
  });
  await sleep(1000);

  const viewports = [
    { width: 1920, height: 1080, name: '1920' },
    { width: 1366, height: 768, name: '1366' },
    { width: 768, height: 1024, name: '768' },
    { width: 360, height: 800, name: '360' }
  ];

  const brainDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

  for (const vp of viewports) {
    console.log(`Setting viewport ${vp.name} (${vp.width}x${vp.height})...`);
    await send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 1,
      mobile: vp.width < 768
    });
    await sleep(600);

    // Verify DOM structure in browser
    const domCheck = await send('Runtime.evaluate', {
      expression: `
        (function() {
          const viewNghe = document.getElementById('view-nghe');
          const viewHomNay = document.getElementById('view-hom-nay');
          const sidebar = document.getElementById('appSidebar') || document.querySelector('aside');
          const part1Cards = document.querySelectorAll('#part1-topics-container .listening-topic-card');
          const priorityDash = document.getElementById('listeningPriorityDashboard');
          const mockArena = document.getElementById('listeningMockTestArena');
          const p2El = document.querySelector('#view-nghe > div:nth-of-type(6)');
          const fab = document.querySelector('.ai-tutor-fab');

          let sidebarRight = 0;
          if (sidebar) {
            const sbRect = sidebar.getBoundingClientRect();
            sidebarRight = sbRect.right;
          }

          let p2Left = 0;
          let p2Width = 0;
          if (p2El) {
            const p2Rect = p2El.getBoundingClientRect();
            p2Left = p2Rect.left;
            p2Width = p2Rect.width;
          }

          let fabRect = { width: 0, height: 0, right: 0, bottom: 0 };
          if (fab) {
            const r = fab.getBoundingClientRect();
            fabRect = { width: Math.round(r.width), height: Math.round(r.height), right: Math.round(r.right), bottom: Math.round(r.bottom) };
          }

          return {
            ngheHidden: viewNghe ? viewNghe.classList.contains('hidden') : null,
            homNayHidden: viewHomNay ? viewHomNay.classList.contains('hidden') : null,
            part1CardsCount: part1Cards.length,
            priorityDashHasContent: priorityDash && priorityDash.children.length > 0,
            mockArenaHasContent: mockArena && mockArena.children.length > 0,
            sidebarRight: Math.round(sidebarRight),
            p2Left: Math.round(p2Left),
            p2Width: Math.round(p2Width),
            overlapWithSidebar: p2Left < sidebarRight && sidebarRight > 0,
            fabRect
          };
        })()
      `,
      returnByValue: true
    });

    console.log(`DOM Check at ${vp.name}px:`, JSON.stringify(domCheck.result.value, null, 2));

    // Capture screenshot of Listening page
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const shotPath = path.join(brainDir, `test_listening_layout_${vp.name}.png`);
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot: ${shotPath}`);
  }

  // Also test switching back to Home tab to confirm no Part 2-4 leakage into Home
  console.log('Testing switch to Home tab...');
  await send('Runtime.evaluate', {
    expression: `
      if (typeof switchTab === 'function') switchTab('hom-nay');
    `
  });
  await sleep(600);

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1366,
    height: 768,
    deviceScaleFactor: 1,
    mobile: false
  });
  await sleep(400);

  const homeDomCheck = await send('Runtime.evaluate', {
    expression: `
      (function() {
        const viewNghe = document.getElementById('view-nghe');
        const viewHomNay = document.getElementById('view-hom-nay');
        const visiblePartsOutsideNghe = document.querySelectorAll('body > [id*="part"], main > div > [id*="part"]');
        return {
          ngheHidden: viewNghe ? viewNghe.classList.contains('hidden') : null,
          homNayHidden: viewHomNay ? viewHomNay.classList.contains('hidden') : null,
          leakedPartsCount: visiblePartsOutsideNghe.length
        };
      })()
    `,
    returnByValue: true
  });
  console.log('Home tab DOM Check (1366px):', JSON.stringify(homeDomCheck.result.value, null, 2));

  const homeShot = await send('Page.captureScreenshot', { format: 'png' });
  const homeShotPath = path.join(brainDir, 'test_home_no_leakage_1366.png');
  fs.writeFileSync(homeShotPath, Buffer.from(homeShot.data, 'base64'));
  console.log(`Saved Home tab screenshot: ${homeShotPath}`);

  ws.close();
  chromeProcess.kill();
  console.log('All tests completed successfully!');
}

run().catch(err => {
  console.error('Test script error:', err);
  process.exit(1);
});
