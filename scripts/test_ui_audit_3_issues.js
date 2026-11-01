const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  console.log('Testing 3 UI issues on localhost:3000...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // ========================================================
  // TEST 1: Laptop/Desktop Sidebar Hamburger Toggle Button
  // ========================================================
  console.log('\n--- 1. Testing Desktop Sidebar Hamburger Toggle ---');
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await sleep(1500);

  const desktopBtnInfo = await page.evaluate(() => {
    const btn = document.getElementById('sidebarCollapseBtn');
    const reopen = document.getElementById('sidebarReopenBtn');
    const aside = document.getElementById('sidebarContainer');
    return {
      collapseBtnFound: !!btn,
      collapseBtnDisplay: btn ? window.getComputedStyle(btn).display : null,
      collapseBtnVisible: btn ? (btn.offsetWidth > 0 && btn.offsetHeight > 0) : false,
      reopenBtnDisplay: reopen ? window.getComputedStyle(reopen).display : null,
      sidebarWidth: aside ? aside.getBoundingClientRect().width : 0
    };
  });
  console.log('Desktop Initial State:', desktopBtnInfo);

  // Take screenshot of Desktop Sidebar Header showing the hamburger button
  const clipHeader = { x: 0, y: 0, width: 320, height: 160 };
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'proof_desktop_hamburger_visible.png'),
    clip: clipHeader
  });
  console.log('Saved proof_desktop_hamburger_visible.png');

  // Click collapse button
  console.log('Clicking collapse button...');
  await page.click('#sidebarCollapseBtn');
  await sleep(500);

  const collapsedState = await page.evaluate(() => {
    const btn = document.getElementById('sidebarCollapseBtn');
    const reopen = document.getElementById('sidebarReopenBtn');
    const aside = document.getElementById('sidebarContainer');
    return {
      sidebarWidth: aside ? aside.getBoundingClientRect().width : 0,
      collapseBtnDisplay: btn ? window.getComputedStyle(btn).display : null,
      reopenBtnDisplay: reopen ? window.getComputedStyle(reopen).display : null,
      reopenBtnVisible: reopen ? (reopen.offsetWidth > 0 && reopen.offsetHeight > 0) : false
    };
  });
  console.log('Collapsed State:', collapsedState);

  // Click reopen button
  console.log('Clicking reopen button...');
  await page.click('#sidebarReopenBtn');
  await sleep(500);

  const reopenedState = await page.evaluate(() => {
    const btn = document.getElementById('sidebarCollapseBtn');
    const reopen = document.getElementById('sidebarReopenBtn');
    const aside = document.getElementById('sidebarContainer');
    return {
      sidebarWidth: aside ? aside.getBoundingClientRect().width : 0,
      collapseBtnDisplay: btn ? window.getComputedStyle(btn).display : null,
      reopenBtnDisplay: reopen ? window.getComputedStyle(reopen).display : null
    };
  });
  console.log('Reopened State:', reopenedState);

  // ========================================================
  // TEST 2: Mobile - Mascot Not Covering "Cá nhân" Tab
  // ========================================================
  console.log('\n--- 2. Testing Mobile Mascot vs Cá Nhân Bottom Tab ---');
  await page.setViewport({ width: 390, height: 844 });
  await sleep(1000);

  const mobileNavMetrics = await page.evaluate(() => {
    const dock = document.getElementById('soiMayFloatingDock');
    const bottomNav = document.getElementById('mobileBottomNav');
    const caNhanBtn = bottomNav ? bottomNav.querySelector('button:last-child, a:last-child') : null;
    const dockRect = dock ? dock.getBoundingClientRect() : null;
    const navRect = bottomNav ? bottomNav.getBoundingClientRect() : null;
    const caNhanRect = caNhanBtn ? caNhanBtn.getBoundingClientRect() : null;

    let overlapsCaNhan = false;
    if (dockRect && caNhanRect) {
      overlapsCaNhan = !(
        dockRect.right < caNhanRect.left ||
        dockRect.left > caNhanRect.right ||
        dockRect.bottom < caNhanRect.top ||
        dockRect.top > caNhanRect.bottom
      );
    }

    return {
      dockFound: !!dock,
      dockBottom: dock ? window.getComputedStyle(dock).bottom : null,
      dockRect: dockRect ? { top: dockRect.top, bottom: dockRect.bottom, right: dockRect.right } : null,
      navRect: navRect ? { top: navRect.top, height: navRect.height } : null,
      overlapsCaNhan
    };
  });
  console.log('Mobile Nav vs Mascot:', mobileNavMetrics);

  // Screenshot bottom area
  const bottomClip = { x: 0, y: 844 - 180, width: 390, height: 180 };
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'proof_mobile_mascot_not_covering_personal.png'),
    clip: bottomClip
  });
  console.log('Saved proof_mobile_mascot_not_covering_personal.png');

  // ========================================================
  // TEST 3: Mobile Drawer Clean (No Greeting Card Cut-Through)
  // ========================================================
  console.log('\n--- 3. Testing Mobile Drawer Open (No Cut-Through) ---');
  // Click mobile hamburger to open drawer
  await page.evaluate(() => {
    if (typeof toggleMobileSidebar === 'function') toggleMobileSidebar();
  });
  await sleep(800);

  const drawerState = await page.evaluate(() => {
    const drawer = document.getElementById('sidebarContainer');
    const backdrop = document.getElementById('mobileDrawerBackdrop');
    const greetingCard = document.querySelector('#view-hom-nay > div');
    const floatingDock = document.getElementById('soiMayFloatingDock');
    
    return {
      drawerTransform: drawer ? window.getComputedStyle(drawer).transform : null,
      drawerZIndex: drawer ? window.getComputedStyle(drawer).zIndex : null,
      backdropVisible: backdrop ? !backdrop.classList.contains('hidden') : false,
      backdropZIndex: backdrop ? window.getComputedStyle(backdrop).zIndex : null,
      greetingCardZIndex: greetingCard ? window.getComputedStyle(greetingCard).zIndex : null,
      floatingDockDisplay: floatingDock ? window.getComputedStyle(floatingDock).display : null
    };
  });
  console.log('Drawer State on Mobile:', drawerState);

  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'proof_mobile_drawer_clean_no_cut.png'),
    fullPage: false
  });
  console.log('Saved proof_mobile_drawer_clean_no_cut.png');

  await browser.close();
  console.log('\nAll 3 UI tests finished successfully!');
})();
