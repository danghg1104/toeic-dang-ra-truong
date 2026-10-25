const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BRAIN_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('Launching Chrome to verify custom mascot placements...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // 1. Load Homepage -> Verify Logo (Ảnh 2 thay vào Logo Ảnh 1)
  console.log('1. Loading Homepage for Logo...');
  await page.goto('http://localhost:3000/#hom-nay', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await page.evaluate(() => {
    window.currentUserAccount = { id: 'admin_test', name: 'Đăng', email: 'dang@gmail.com' };
    localStorage.setItem('cung_dang_session_user', JSON.stringify(window.currentUserAccount));
    if (typeof renderAllMascots === 'function') renderAllMascots();
  });
  await sleep(1500);

  const logoEl = await page.$('aside a[href="#hom-nay"]');
  if (logoEl) {
    const logoPath = path.join(BRAIN_DIR, 'proof_user_fix_logo_forest.png');
    await logoEl.screenshot({ path: logoPath });
    console.log('Saved proof_user_fix_logo_forest.png');
  }

  // 2. Switch to Phần Nghe (Ảnh 3)
  console.log('2. Switching to Phần Nghe (nghe)...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('nghe');
  });
  await sleep(1500);

  const listeningHeader = await page.$('#view-nghe .banner-listening');
  if (listeningHeader) {
    const listeningPath = path.join(BRAIN_DIR, 'proof_user_fix_listening_ocarina.png');
    await listeningHeader.screenshot({ path: listeningPath });
    console.log('Saved proof_user_fix_listening_ocarina.png');
  }

  // 3. Switch to Phần Đọc (Ảnh 4)
  console.log('3. Switching to Phần Đọc (doc)...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('doc');
  });
  await sleep(1500);

  const readingHeader = await page.$('#view-doc .banner-reading');
  if (readingHeader) {
    const readingPath = path.join(BRAIN_DIR, 'proof_user_fix_reading_ghibli.png');
    await readingHeader.screenshot({ path: readingPath });
    console.log('Saved proof_user_fix_reading_ghibli.png');
  }

  // 4. Switch to Phần Thi Thử (Ảnh 5)
  console.log('4. Switching to Phần Thi Thử (thi-thu)...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('thi-thu');
  });
  await sleep(1500);

  const mockHeader = await page.$('#view-thi-thu .banner-mock');
  if (mockHeader) {
    const mockPath = path.join(BRAIN_DIR, 'proof_user_fix_mock_chibi_leaf.png');
    await mockHeader.screenshot({ path: mockPath });
    console.log('Saved proof_user_fix_mock_chibi_leaf.png');
  }

  await browser.close();
  console.log('All 4 mascot proofs captured successfully!');
}

run().catch(err => {
  console.error('Error during verification:', err);
  process.exit(1);
});
