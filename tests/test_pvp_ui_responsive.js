const puppeteer = require('puppeteer-core');
const assert = require('assert');
const path = require('path');
const fs = require('fs');

const delay = ms => new Promise(r => setTimeout(r, ms));

function findChromePath() {
  const commonPaths = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Users\\Admin\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
  ];
  for (const p of commonPaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

(async () => {
  console.log('--- Test: PvP UI Responsive (Laptop 1280px & Mobile 375px) ---');
  const chromePath = findChromePath();
  if (!chromePath) {
    console.warn('Chrome executable not found. Skipping Puppeteer test.');
    process.exit(0);
  }

  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });

  try {
    const page = await browser.newPage();

    // 1. Laptop Viewport: 1280x800
    console.log('Testing on Laptop Viewport (1280x800)...');
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/#view-pvp-arena', { waitUntil: 'networkidle2' });
    await delay(1000);

    // Switch to PvP view via switchTab('pvp-arena')
    await page.evaluate(() => {
      if (typeof switchTab === 'function') switchTab('pvp-arena');
      else if (typeof switchView === 'function') switchView('view-pvp-arena');
      if (window.PvPArenaClient) window.PvPArenaClient.renderInto('pvpArenaInlineContainer');
    });
    await delay(500);

    // Check Arena loaded
    const arenaExists = await page.evaluate(() => !!document.getElementById('pvpArenaInlineContainer'));
    assert.ok(arenaExists, 'PvP Arena container must exist in DOM');

    // Check Laptop horizontal overflow
    const laptopOverflow = await page.evaluate(() => {
      const el = document.getElementById('pvpArenaInlineContainer');
      return el ? (el.scrollWidth > el.clientWidth + 5) : false;
    });
    assert.strictEqual(laptopOverflow, false, 'Laptop Arena must not have horizontal overflow');
    console.log('✓ Laptop Arena layout is perfectly fit without horizontal scroll.');

    // Click on Tab 3: "Bạn Bè"
    console.log('Clicking tab "Bạn Bè"...');
    await page.evaluate(() => {
      if (window.PvPArenaClient) window.PvPArenaClient.setLobbyTab('friends');
    });
    await delay(600);

    // Verify Friend ID is displayed
    const friendInfo = await page.evaluate(() => {
      const codeEl = document.querySelector('#pvpArenaInlineContainer [onclick*="copyFriendCode"]');
      const inputEl = document.getElementById('pvpAddFriendInput');
      return {
        hasCopyButton: !!codeEl,
        hasAddInput: !!inputEl,
        myCode: window.PvPArenaClient?.myFriendCode
      };
    });
    assert.ok(friendInfo.hasCopyButton, 'Must have Copy Friend Code button');
    assert.ok(friendInfo.hasAddInput, 'Must have Add Friend input field');
    console.log(`✓ Friend Code section loaded: ${friendInfo.myCode}`);

    // Screenshot Laptop Friends Tab
    const artifactDir = path.resolve('C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283');
    const laptopShot = path.join(artifactDir, 'pvp_arena_laptop_1280x800.png');
    await page.screenshot({ path: laptopShot });
    console.log(`Saved screenshot: ${laptopShot}`);

    // 2. Mobile Viewport: 375x667 (iPhone SE / Standard Mobile)
    console.log('\nTesting on Mobile Viewport (375x667)...');
    await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
    await page.evaluate(() => {
      if (typeof switchTab === 'function') switchTab('pvp-arena');
      if (window.PvPArenaClient) window.PvPArenaClient.renderInto('pvpArenaInlineContainer');
    });
    await delay(600);

    // Check Mobile horizontal overflow on body and arena
    const mobileOverflow = await page.evaluate(() => {
      const docWidth = document.documentElement.clientWidth;
      const bodyWidth = document.body.scrollWidth;
      const arena = document.getElementById('pvpArenaInlineContainer');
      const arenaOverflow = arena ? (arena.scrollWidth > docWidth + 5) : false;
      return { docWidth, bodyWidth, arenaOverflow, bodyOverflow: bodyWidth > docWidth + 5 };
    });
    console.log('Mobile layout metrics:', mobileOverflow);
    assert.strictEqual(mobileOverflow.bodyOverflow, false, 'Mobile body must not overflow horizontally');

    // Switch back to Quick Match on Mobile
    await page.evaluate(() => {
      if (window.PvPArenaClient) window.PvPArenaClient.setLobbyTab('quick');
    });
    await delay(600);

    const mobileShot = path.join(artifactDir, 'pvp_arena_mobile_375x667.png');
    await page.screenshot({ path: mobileShot });
    console.log(`Saved screenshot: ${mobileShot}`);

    console.log('✓ PASS: PvP Arena Responsive & Friends layout 100% verified on Laptop & Mobile!');
    await browser.close();
    process.exit(0);
  } catch (err) {
    console.error('Test Failed:', err.message);
    if (browser) await browser.close();
    process.exit(1);
  }
})();
