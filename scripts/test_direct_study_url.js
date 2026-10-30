const path = require('path');
const puppeteer = require('puppeteer-core');

const ARTIFACT_DIR = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/ed360126-cbd6-4e9c-92fb-38b43251e283');

async function testDirectStudyUrl() {
  console.log('🚀 Đang kiểm tra trực tiếp URL http://127.0.0.1:3000/vocabulary/contracts/study ...');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  await page.setRequestInterception(true);
  page.on('request', req => {
    const u = req.url();
    if (u.includes('fonts.googleapis') || u.includes('cdnjs.cloudflare') || u.includes('accounts.google.com')) {
      req.abort();
    } else {
      req.continue();
    }
  });

  page.on('pageerror', err => console.log('🔴 PAGE ERROR:', err.message));
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.setCookie({
    name: 'cd_session',
    value: '18aecc48e998366a29e990d0b434dc2b518ba1e4bc4a731c12ec273757fdb847',
    domain: '127.0.0.1',
    path: '/'
  });

  console.log('Đang mở trang URL trực tiếp...');
  await page.goto('http://127.0.0.1:3000/vocabulary/contracts/study', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));

  const check = await page.evaluate(() => {
    const studyView = document.getElementById('view-vocabulary-study');
    const flipper = document.getElementById('flashcard3DFlipper');
    const homNayView = document.getElementById('view-hom-nay');
    return {
      title: document.title,
      isStudyViewVisible: studyView ? !studyView.classList.contains('hidden') : false,
      isHomNayHidden: homNayView ? homNayView.classList.contains('hidden') : false,
      hasFlipper: !!flipper,
      flipperTransform: flipper?.style.transform
    };
  });
  console.log('Trạng thái DOM:', check);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_vocabulary_contracts_study_fixed.png') });
  console.log('📸 Đã chụp proof_vocabulary_contracts_study_fixed.png');

  await browser.close();
  console.log('🎉 Hoàn thành kiểm tra URL trực tiếp!');
}

testDirectStudyUrl().catch(err => {
  console.error('LỖI TEST:', err);
  process.exit(1);
});
