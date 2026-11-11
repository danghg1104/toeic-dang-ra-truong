'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn, spawnSync } = require('child_process');
const net = require('net');
const puppeteer = require('puppeteer-core');

const ROOT = path.resolve(__dirname, '..');
const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function freePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

function get(port, route) {
  return new Promise((resolve, reject) => {
    const req = require('http').get({ hostname: '127.0.0.1', port, path: route }, res => {
      res.resume();
      res.on('end', () => resolve(res.statusCode));
    });
    req.on('error', reject);
  });
}

async function waitForServer(port, child) {
  for (let i = 0; i < 60; i++) {
    if (child.exitCode !== null) throw new Error('Server exited before ready: ' + child.exitCode);
    try {
      if (await get(port, '/health') === 200) return;
    } catch (e) {}
    await delay(150);
  }
  throw new Error('Local server did not start');
}

(async () => {
  if (!fs.existsSync(EDGE)) throw new Error('Microsoft Edge executable not found');
  const tempData = fs.mkdtempSync(path.join(os.tmpdir(), 'toeic-mobile-smoke-'));
  fs.writeFileSync(path.join(tempData, 'users_database.json'), '[]');
  fs.writeFileSync(path.join(tempData, 'sessions_database.json'), '{}');
  fs.writeFileSync(path.join(tempData, 'study_sync_store.json'), '{}');

  const port = await freePort();
  const child = spawn(process.execPath, [path.join(ROOT, 'server.js')], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(port), DATA_DIR: tempData, HTTPS_PORT: '0' },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let serverLog = '';
  child.stdout.on('data', chunk => { serverLog += chunk.toString(); });
  child.stderr.on('data', chunk => { serverLog += chunk.toString(); });

  let browser;
  try {
    await waitForServer(port, child);
    browser = await puppeteer.launch({
      executablePath: EDGE,
      headless: true,
      args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--disable-features=Translate']
    });

    const reports = [];
    for (const viewport of [
      { name: 'desktop', width: 1365, height: 900, isMobile: false },
      { name: 'mobile', width: 375, height: 812, isMobile: true },
      { name: 'mobile-small', width: 320, height: 720, isMobile: true }
    ]) {
      const page = await browser.newPage();
      await page.setViewport({
        width: viewport.width,
        height: viewport.height,
        deviceScaleFactor: 1,
        isMobile: viewport.isMobile,
        hasTouch: viewport.isMobile
      });
      page.setDefaultNavigationTimeout(25000);

      const pageErrors = [];
      const consoleErrors = [];
      const failedRequests = [];
      page.on('pageerror', error => pageErrors.push(error.message));
      page.on('console', msg => {
        if (msg.type() === 'error') consoleErrors.push(msg.text().slice(0, 260));
      });
      page.on('requestfailed', req => {
        const failure = req.failure();
        const url = req.url();
        if (!url.includes('accounts.google.com') && !url.includes('googleapis.com') &&
            !url.includes('fonts.googleapis.com') && !url.includes('fontawesome')) {
          failedRequests.push({ url: url.slice(0, 120), error: failure?.errorText || 'unknown' });
        }
      });

      const response = await page.goto('http://127.0.0.1:' + port + '/', { waitUntil: 'domcontentloaded' });
      await delay(9000);

      const measure = () => page.evaluate(() => {
        const doc = document.documentElement;
        const isVisible = el => {
          const style = getComputedStyle(el);
          const rect = el.getBoundingClientRect();
          const intersectsViewport = rect.right > 0 && rect.left < innerWidth && rect.bottom > 0 && rect.top < innerHeight;
          return rect.width > 0 && rect.height > 0 && intersectsViewport &&
            style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity || 1) > 0;
        };
        const controls = Array.from(document.querySelectorAll(
          'button,a[href],input,select,textarea,[role="button"],[onclick]'
        )).filter(isVisible);
        const small = controls.map(el => {
          const r = el.getBoundingClientRect();
          const label = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') ||
            el.getAttribute('placeholder') || el.id || el.className || el.tagName).toString().replace(/\s+/g, ' ').slice(0, 90);
          return { tag: el.tagName.toLowerCase(), width: Math.round(r.width), height: Math.round(r.height), label };
        });
        const overflow = Array.from(document.body.querySelectorAll('*')).map(el => {
          const r = el.getBoundingClientRect();
          const s = getComputedStyle(el);
          if (!r.width || !r.height || s.display === 'none' || s.visibility === 'hidden' ||
              r.right <= 0 || r.left >= innerWidth) return null;
          if (r.right <= innerWidth + 1 || r.left >= -1) return null;
          return { tag: el.tagName.toLowerCase(), id: el.id, cls: String(el.className || '').toString().slice(0, 80),
            left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) };
        }).filter(Boolean).slice(0, 12);
        return {
          viewportWidth: innerWidth,
          documentWidth: doc.scrollWidth,
          bodyScrollWidth: document.body.scrollWidth,
          horizontalOverflow: doc.scrollWidth > innerWidth + 1,
          visibleControls: controls.length,
          below44: small.filter(x => x.width < 44 || x.height < 44).length,
          below24: small.filter(x => x.width < 24 || x.height < 24).length,
          smallExamples: small.filter(x => x.width < 44 || x.height < 44).slice(0, 12),
          overflowElements: overflow,
          hasMainContent: !!document.querySelector('main, #app, #home, #dashboard, [id*="view-home"]')
        };
      });
      const metrics = await measure();
      let drawerMetrics = null;
      if (viewport.isMobile) {
        await page.evaluate(() => document.querySelector('#mobileStickyTopHeader [aria-label="Mở menu học tập"]')?.click());
        await delay(450);
        drawerMetrics = await measure();
        await page.evaluate(() => document.querySelector('#sidebarContainer [aria-label="Đóng menu"]')?.click());
        await delay(250);
      }

      reports.push({
        viewport: viewport.name,
        httpStatus: response?.status() || null,
        metrics,
        drawerMetrics,
        pageErrors: pageErrors.slice(0, 10),
        consoleErrors: consoleErrors.slice(0, 12),
        failedRequests: failedRequests.slice(0, 8)
      });
      await page.close();
    }

    console.log(JSON.stringify({ result: 'BROWSER_SMOKE_COMPLETE', reports }, null, 2));
  } finally {
    if (browser) await browser.close().catch(() => {});
    child.kill();
    await delay(150);
    fs.rmSync(tempData, { recursive: true, force: true });
    if (child.exitCode !== null && child.exitCode !== 0) console.error(serverLog.slice(-2500));
  }
})().catch(error => {
  console.error(error.stack || error);
  process.exitCode = 1;
});
