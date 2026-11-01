const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  console.log('Testing iOS PWA Install Experience...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  
  // Emulate iPhone 15 Pro viewport & User Agent
  await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true });
  await page.setUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1');

  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
  await sleep(1500);

  // 1. Check if "Tải App" buttons are visible on iPhone
  const buttonInfo = await page.evaluate(() => {
    const stickyBtn = document.getElementById('btnPwaMobileStickyInstall');
    const headerBtn = document.getElementById('btnPwaHeaderInstall');
    return {
      stickyBtn: {
        found: !!stickyBtn,
        display: stickyBtn ? window.getComputedStyle(stickyBtn).display : null,
        visible: stickyBtn ? (stickyBtn.offsetWidth > 0 && stickyBtn.offsetHeight > 0) : false,
        text: stickyBtn ? stickyBtn.innerText.trim() : null
      },
      headerBtn: {
        found: !!headerBtn,
        display: headerBtn ? window.getComputedStyle(headerBtn).display : null,
        visible: headerBtn ? (headerBtn.offsetWidth > 0 && headerBtn.offsetHeight > 0) : false,
        text: headerBtn ? headerBtn.innerText.trim() : null
      }
    };
  });
  console.log('iOS "Tải App" Button States:', JSON.stringify(buttonInfo, null, 2));

  // Screenshot top header area on iPhone
  const headerClip = { x: 0, y: 0, width: 393, height: 280 };
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'proof_ios_install_button_visible.png'),
    clip: headerClip
  });
  console.log('Saved proof_ios_install_button_visible.png');

  // 2. Click "Tải App" button to trigger iOS modal
  console.log('Tapping "Tải App" sticky button on iPhone...');
  await page.click('#btnPwaMobileStickyInstall');
  await sleep(600);

  // Check if iOS Modal is open
  const modalInfo = await page.evaluate(() => {
    const modal = document.getElementById('iosPwaInstallModal');
    return {
      found: !!modal,
      display: modal ? window.getComputedStyle(modal).display : null,
      visible: modal ? (!modal.classList.contains('hidden') && modal.offsetWidth > 0) : false,
      title: modal ? modal.querySelector('h3').innerText : null,
      stepsCount: modal ? modal.querySelectorAll('.py-4 > div').length : 0
    };
  });
  console.log('iOS Install Modal State:', JSON.stringify(modalInfo, null, 2));

  // Screenshot full screen with iOS modal
  await page.screenshot({
    path: path.join(ARTIFACTS_DIR, 'proof_ios_install_modal_open.png'),
    fullPage: false
  });
  console.log('Saved proof_ios_install_modal_open.png');

  await browser.close();
  console.log('iOS PWA test complete!');
})();
