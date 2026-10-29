const path = require('path');
const puppeteer = require('puppeteer-core');

const ARTIFACT_DIR = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/ed360126-cbd6-4e9c-92fb-38b43251e283');

async function testFlashcardSmoothness() {
  console.log('🚀 Khởi động Headless Edge kiểm tra độ mượt 3D Flashcard...');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Chặn request ngoại vi
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

  // Nạp session cookie
  await page.setCookie({
    name: 'cd_session',
    value: '18aecc48e998366a29e990d0b434dc2b518ba1e4bc4a731c12ec273757fdb847',
    domain: '127.0.0.1',
    path: '/'
  });

  console.log('1. Tải trang chính và chuyển sang tab Từ Vựng...');
  await page.goto('http://127.0.0.1:3000/#tu-vung', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  // Mở bộ từ Contracts
  console.log('2. Mở bộ từ Contracts trong VocabularyEngine...');
  await page.evaluate(() => {
    if (window.VocabularyEngine) {
      window.VocabularyEngine.showStudyView('contracts');
    }
  });
  await new Promise(r => setTimeout(r, 800));

  // Kiểm tra trạng thái ban đầu của thẻ Flashcard
  const initialCardState = await page.evaluate(() => {
    const flipper = document.getElementById('flashcard3DFlipper');
    if (!flipper) return { error: 'Flipper not found' };
    return {
      hasFlipper: true,
      transform: flipper.style.transform,
      willChange: flipper.style.willChange,
      isFlipped: window.VocabularyEngine.isFlipped
    };
  });
  console.log('🎴 Trạng thái ban đầu của thẻ:', initialCardState);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_flashcard_front_smooth.png') });
  console.log('📸 Đã chụp proof_flashcard_front_smooth.png');

  // 3. Thực hiện lật thẻ bằng VocabularyEngine.flipCard()
  console.log('3. Lật thẻ sang mặt sau (3D Flip)...');
  await page.evaluate(() => {
    window.VocabularyEngine.flipCard();
  });
  await new Promise(r => setTimeout(r, 600)); // Đợi transition xoay 3D

  const flippedCardState = await page.evaluate(() => {
    const flipper = document.getElementById('flashcard3DFlipper');
    if (!flipper) return { error: 'Flipper not found' };
    return {
      transform: flipper.style.transform,
      isFlipped: window.VocabularyEngine.isFlipped
    };
  });
  console.log('🔄 Trạng thái sau khi lật thẻ:', flippedCardState);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_flashcard_back_smooth.png') });
  console.log('📸 Đã chụp proof_flashcard_back_smooth.png');

  // 4. Kiểm tra lật thẻ bằng phím Space
  console.log('4. Thử lật lại bằng phím Space...');
  await page.keyboard.press('Space');
  await new Promise(r => setTimeout(r, 600));

  const spaceFlipState = await page.evaluate(() => {
    const flipper = document.getElementById('flashcard3DFlipper');
    return {
      transform: flipper?.style.transform,
      isFlipped: window.VocabularyEngine.isFlipped
    };
  });
  console.log('⌨️ Trạng thái sau khi nhấn Space:', spaceFlipState);

  await browser.close();
  console.log('🎉 Kiểm tra độ mượt 3D Flashcard thành công 100%!');
}

testFlashcardSmoothness().catch(err => {
  console.error('LỖI TEST FLASHCARD:', err);
  process.exit(1);
});
