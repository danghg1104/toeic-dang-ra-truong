const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = fs.existsSync('C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe')
  ? 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
  : 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  console.log('🚀 Đang khởi động Chrome để chụp màn hình kiểm chứng trực tiếp...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  
  // Fake login user session
  await page.evaluateOnNewDocument(() => {
    const testUser = {
      id: 'acc-g-1792730904332',
      uid: 'acc-g-1792730904332',
      displayName: 'Huynh Dang',
      email: 'danghg1104@gmail.com',
      photoURL: 'assets/mascot/may_avatar.png',
      targetScore: 600,
      examDate: '20/12/2026',
      daysRemaining: 52,
      studyMinutes: 16
    };
    localStorage.setItem('cung_dang_session_user', JSON.stringify(testUser));
    window.currentUserAccount = testUser;
  });

  // 1. Dashboard #hom-nay
  console.log('1. Chụp trang Hôm nay (Dashboard + Sidebar nhóm)...');
  await page.goto('http://localhost:3000/#hom-nay', { waitUntil: 'networkidle2', timeout: 20000 });
  await sleep(1500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step1_dashboard.png'), fullPage: false });

  // 2. Lộ trình #lo-trinh
  console.log('2. Chụp trang Lộ trình cá nhân...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('lo-trinh');
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step1_roadmap.png'), fullPage: false });

  // 3. Luyện nghe chính tả #nghe-chinh-ta
  console.log('3. Chụp trang Luyện nghe chính tả...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('nghe-chinh-ta');
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step1_dictation.png'), fullPage: false });

  // 4. Đấu trường từ vựng #hoc-tu-vung
  console.log('4. Chụp trang Đấu trường từ vựng...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('hoc-tu-vung');
  });
  await sleep(1500);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step1_vocab_arena.png'), fullPage: false });

  await browser.close();
  console.log('🎉 Đã hoàn thành chụp 4 ảnh kiểm chứng vào thư mục artifact!');
}

run().catch(err => {
  console.error('Lỗi khi chụp màn hình kiểm chứng:', err);
  process.exit(1);
});
