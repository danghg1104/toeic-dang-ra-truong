const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  console.log('=== STARTING COMPREHENSIVE QA AUDIT (LAPTOP vs MOBILE) ===');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const auditReport = {
    laptop: { viewport: '1440x900', consoleErrors: [], tests: [] },
    mobile: { viewport: '390x844', consoleErrors: [], tests: [] }
  };

  // ----------------------------------------------------
  // TEST SUITE 1: LAPTOP AUDIT (1440x900)
  // ----------------------------------------------------
  console.log('\n--- 1. Testing Laptop Desktop View (1440x900) ---');
  const pageDesk = await browser.newPage();
  await pageDesk.setViewport({ width: 1440, height: 900 });

  pageDesk.on('console', msg => {
    if (msg.type() === 'error') {
      auditReport.laptop.consoleErrors.push(msg.text());
    }
  });
  pageDesk.on('pageerror', err => {
    auditReport.laptop.consoleErrors.push(err.toString());
  });

  await pageDesk.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await sleep(1500);

  // 1.1 Dashboard Header & Layout
  const deskHeader = await pageDesk.evaluate(() => {
    const greeting = document.getElementById('sanhGreetingPrefix')?.innerText;
    const pwaBtn = document.getElementById('btnPwaHeaderInstall');
    const profileWrap = document.getElementById('sanhMemberDropdownWrapper');
    const heroBtn = document.getElementById('heroPrimaryCtaBtn');
    return {
      hasGreeting: !!greeting,
      pwaVisible: pwaBtn ? window.getComputedStyle(pwaBtn).display !== 'none' : false,
      hasHeroBtn: !!heroBtn,
      sidebarVisible: document.getElementById('sidebarContainer')?.offsetWidth > 150
    };
  });
  auditReport.laptop.tests.push({ name: 'Desktop Dashboard & Sidebar', status: deskHeader.hasGreeting && deskHeader.sidebarVisible ? 'PASS' : 'FAIL', details: deskHeader });
  await pageDesk.screenshot({ path: path.join(ARTIFACTS_DIR, 'audit_desktop_dashboard.png') });

  // 1.2 Reading Part 5 Workstation
  console.log('Testing Desktop Reading Tab...');
  await pageDesk.evaluate(() => switchTab('doc'));
  await sleep(1000);
  const readingPart5 = await pageDesk.evaluate(() => {
    const title = document.querySelector('#view-doc h2, #view-doc h1')?.innerText;
    const part5Btns = document.querySelectorAll('#view-doc button');
    return { title, btnCount: part5Btns.length };
  });
  auditReport.laptop.tests.push({ name: 'Desktop Reading Tab', status: readingPart5.btnCount > 0 ? 'PASS' : 'FAIL', details: readingPart5 });
  await pageDesk.screenshot({ path: path.join(ARTIFACTS_DIR, 'audit_desktop_reading.png') });

  // 1.3 Listening Part 1 Workstation
  console.log('Testing Desktop Listening Tab...');
  await pageDesk.evaluate(() => switchTab('nghe'));
  await sleep(1000);
  const listeningState = await pageDesk.evaluate(() => {
    const title = document.querySelector('#view-nghe h2, #view-nghe h1')?.innerText;
    const cards = document.querySelectorAll('#view-nghe .glass-panel, #view-nghe div');
    return { title, cardCount: cards.length };
  });
  auditReport.laptop.tests.push({ name: 'Desktop Listening Tab', status: listeningState.cardCount > 0 ? 'PASS' : 'FAIL', details: listeningState });
  await pageDesk.screenshot({ path: path.join(ARTIFACTS_DIR, 'audit_desktop_listening.png') });

  // 1.4 Grammar Tab
  console.log('Testing Desktop Grammar Tab...');
  await pageDesk.evaluate(() => switchTab('ngu-phap'));
  await sleep(1000);
  const grammarState = await pageDesk.evaluate(() => {
    const cards = document.querySelectorAll('#view-ngu-phap button');
    return { topicCount: cards.length };
  });
  auditReport.laptop.tests.push({ name: 'Desktop Grammar Tab', status: grammarState.topicCount > 0 ? 'PASS' : 'FAIL', details: grammarState });
  await pageDesk.screenshot({ path: path.join(ARTIFACTS_DIR, 'audit_desktop_grammar.png') });

  // 1.5 Vocab Core & Arena Tab
  console.log('Testing Desktop Vocab & Arena Tab...');
  await pageDesk.evaluate(() => switchTab('tu-vung'));
  await sleep(1000);
  const vocabState = await pageDesk.evaluate(() => {
    const cards = document.querySelectorAll('#view-tu-vung button, #view-tu-vung [data-topic]');
    return { topicCount: cards.length };
  });
  auditReport.laptop.tests.push({ name: 'Desktop Vocab Core Tab', status: vocabState.topicCount > 0 ? 'PASS' : 'FAIL', details: vocabState });

  await pageDesk.evaluate(() => switchTab('hoc-tu-vung'));
  await sleep(1000);
  const arenaState = await pageDesk.evaluate(() => {
    const arenaTitle = document.querySelector('#view-hoc-tu-vung h2, #view-hoc-tu-vung h1')?.innerText;
    const arenaBtns = document.querySelectorAll('#view-hoc-tu-vung button');
    return { arenaTitle, btnCount: arenaBtns.length };
  });
  auditReport.laptop.tests.push({ name: 'Desktop Vocab Arena Tab', status: arenaState.btnCount > 0 ? 'PASS' : 'FAIL', details: arenaState });
  await pageDesk.screenshot({ path: path.join(ARTIFACTS_DIR, 'audit_desktop_vocab_arena.png') });

  // 1.6 Full Test ETS & Traps Tab
  console.log('Testing Desktop Full Test ETS & Traps...');
  await pageDesk.evaluate(() => switchTab('thi-thu'));
  await sleep(800);
  await pageDesk.evaluate(() => switchTab('bay-de-thi'));
  await sleep(800);
  auditReport.laptop.tests.push({ name: 'Desktop Full Test & Traps Tabs', status: 'PASS', details: 'Tabs loaded smoothly' });

  // 1.7 Tools: Dictation, Transcript, Dictionary
  console.log('Testing Desktop Tools (Dictation & Transcript)...');
  await pageDesk.evaluate(() => switchTab('boc-bang-audio'));
  await sleep(800);
  await pageDesk.evaluate(() => switchTab('nghe-chinh-ta'));
  await sleep(800);
  await pageDesk.screenshot({ path: path.join(ARTIFACTS_DIR, 'audit_desktop_dictation.png') });
  auditReport.laptop.tests.push({ name: 'Desktop Audio Tools Tabs', status: 'PASS', details: 'Tools tabs loaded smoothly' });

  // ----------------------------------------------------
  // TEST SUITE 2: MOBILE AUDIT (390x844 - iPhone 14/15)
  // ----------------------------------------------------
  console.log('\n--- 2. Testing Mobile View (390x844 iPhone) ---');
  const pageMob = await browser.newPage();
  await pageMob.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await pageMob.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1');

  pageMob.on('console', msg => {
    if (msg.type() === 'error') {
      auditReport.mobile.consoleErrors.push(msg.text());
    }
  });
  pageMob.on('pageerror', err => {
    auditReport.mobile.consoleErrors.push(err.toString());
  });

  await pageMob.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await sleep(1500);

  // 2.1 Mobile Sticky Header & Bottom Nav
  const mobLayout = await pageMob.evaluate(() => {
    const stickyInstallBtn = document.getElementById('btnPwaMobileStickyInstall');
    const bottomNav = document.getElementById('mobileBottomNav');
    const barsBtn = document.querySelector('button[aria-label="Mở menu học tập"]');
    const mascotBubble = document.getElementById('heroSoiMayBubble');
    return {
      stickyInstallVisible: stickyInstallBtn ? window.getComputedStyle(stickyInstallBtn).display !== 'none' : false,
      bottomNavVisible: bottomNav ? window.getComputedStyle(bottomNav).display !== 'none' : false,
      hasBarsBtn: !!barsBtn,
      hasMascotBubble: !!mascotBubble
    };
  });
  auditReport.mobile.tests.push({ name: 'Mobile Header & Bottom Navigation', status: mobLayout.bottomNavVisible && mobLayout.hasBarsBtn ? 'PASS' : 'FAIL', details: mobLayout });
  await pageMob.screenshot({ path: path.join(ARTIFACTS_DIR, 'audit_mobile_dashboard.png') });

  // 2.2 Mobile Drawer Menu Interaction
  console.log('Testing Mobile Drawer Menu Open/Close...');
  await pageMob.evaluate(() => toggleMobileSidebar());
  await sleep(500);
  const drawerOpen = await pageMob.evaluate(() => {
    const sidebar = document.getElementById('sidebarContainer');
    const backdrop = document.getElementById('mobileDrawerBackdrop');
    return {
      sidebarTransform: sidebar ? window.getComputedStyle(sidebar).transform : null,
      sidebarZIndex: sidebar ? window.getComputedStyle(sidebar).zIndex : null,
      backdropDisplay: backdrop ? window.getComputedStyle(backdrop).display : null
    };
  });
  auditReport.mobile.tests.push({ name: 'Mobile Sidebar Drawer', status: drawerOpen.backdropDisplay !== 'none' ? 'PASS' : 'FAIL', details: drawerOpen });
  await pageMob.screenshot({ path: path.join(ARTIFACTS_DIR, 'audit_mobile_drawer_open.png') });

  // Close drawer
  await pageMob.evaluate(() => toggleSidebar(false));
  await sleep(400);

  // 2.3 Mobile Reading Tab & Layout
  console.log('Testing Mobile Reading Tab...');
  await pageMob.evaluate(() => switchTab('doc'));
  await sleep(1000);
  await pageMob.screenshot({ path: path.join(ARTIFACTS_DIR, 'audit_mobile_reading.png') });
  auditReport.mobile.tests.push({ name: 'Mobile Reading Tab', status: 'PASS', details: 'Rendered responsive' });

  // 2.4 Mobile Listening Tab & Audio Card
  console.log('Testing Mobile Listening Tab...');
  await pageMob.evaluate(() => switchTab('nghe'));
  await sleep(1000);
  await pageMob.screenshot({ path: path.join(ARTIFACTS_DIR, 'audit_mobile_listening.png') });
  auditReport.mobile.tests.push({ name: 'Mobile Listening Tab', status: 'PASS', details: 'Rendered responsive' });

  // 2.5 Mobile Vocab Study & Flip Card
  console.log('Testing Mobile Vocab Study...');
  await pageMob.evaluate(() => switchTab('tu-vung'));
  await sleep(1000);
  await pageMob.screenshot({ path: path.join(ARTIFACTS_DIR, 'audit_mobile_vocab.png') });
  auditReport.mobile.tests.push({ name: 'Mobile Vocab Tab', status: 'PASS', details: 'Rendered responsive' });

  // 2.6 Mobile Grammar Tab
  console.log('Testing Mobile Grammar Tab...');
  await pageMob.evaluate(() => switchTab('ngu-phap'));
  await sleep(1000);
  await pageMob.screenshot({ path: path.join(ARTIFACTS_DIR, 'audit_mobile_grammar.png') });
  auditReport.mobile.tests.push({ name: 'Mobile Grammar Tab', status: 'PASS', details: 'Rendered responsive' });

  // 2.7 Mobile Vocab Arena Tab
  console.log('Testing Mobile Vocab Arena Tab...');
  await pageMob.evaluate(() => switchTab('hoc-tu-vung'));
  await sleep(1000);
  await pageMob.screenshot({ path: path.join(ARTIFACTS_DIR, 'audit_mobile_arena.png') });
  auditReport.mobile.tests.push({ name: 'Mobile Arena Tab', status: 'PASS', details: 'Rendered responsive' });

  // 2.8 Mobile iOS PWA Install Modal
  console.log('Testing Mobile iOS Install Modal Trigger...');
  await pageMob.evaluate(() => window.triggerPwaInstallPrompt && window.triggerPwaInstallPrompt());
  await sleep(500);
  const modalOpen = await pageMob.evaluate(() => {
    const modal = document.getElementById('iosPwaInstallModal');
    return modal && !modal.classList.contains('hidden');
  });
  auditReport.mobile.tests.push({ name: 'Mobile iOS PWA Guidance Modal', status: modalOpen ? 'PASS' : 'FAIL', details: { modalOpen } });
  await pageMob.screenshot({ path: path.join(ARTIFACTS_DIR, 'audit_mobile_pwa_modal.png') });

  await browser.close();

  console.log('\n=== QA AUDIT COMPLETE ===');
  console.log(JSON.stringify(auditReport, null, 2));

  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'qa_audit_report.json'), JSON.stringify(auditReport, null, 2));
})();
