const puppeteer = require('puppeteer-core');
const path = require('path');

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function run() {
  console.log('🚀 Khởi chạy Chrome kiểm tra Khung thẻ từ vừa vặn & Viên đạn xanh...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  console.log('🌐 Truy cập http://127.0.0.1:3000/ ...');
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForFunction(() => typeof window.switchTab === 'function', { timeout: 15000 });

  // Đăng nhập session & Chuyển tab
  await page.evaluate(() => {
    const testUser = {
      uid: 'user_totoro_vip',
      email: 'dang_totoro@cungdang.edu.vn',
      displayName: 'Đăng Totoro',
      photoURL: 'assets/mascot/totoro_umbrella_logo.png'
    };
    window.currentUserAccount = testUser;
    localStorage.setItem('cung_dang_session_user', JSON.stringify(testUser));
    if (typeof window.closeAuthModal === 'function') window.closeAuthModal();
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      modal.style.display = 'none';
    }
    window.switchTab('hoc-tu-vung');
  });
  await new Promise(r => setTimeout(r, 800));

  // Chọn chủ đề Công nghệ A1 & vào game
  console.log('💻 Chọn Công nghệ A1 & Vào Arena...');
  await page.evaluate(() => {
    if (window.VocabGameWorkstation) {
      window.VocabGameWorkstation.selectTopic('Công nghệ');
      window.VocabGameWorkstation.selectLevel('A1');
      window.VocabGameWorkstation.selectCount(10);
      window.VocabGameWorkstation.loadSampleVocab();
      window.VocabGameWorkstation.startArena();
    }
  });
  await new Promise(r => setTimeout(r, 600));

  // Kiểm tra kích thước khung mới
  const cardStats = await page.evaluate(() => {
    const card = document.getElementById('vgFallingCard');
    const letters = document.getElementById('vgLettersDisplay');
    const speaker = card ? card.querySelector('div[onclick*="speakWord"]') : null;
    const firstLetterEl = letters ? letters.querySelector('span') : null;
    const word = window.VocabGameWorkstation ? window.VocabGameWorkstation.currentWord : null;

    return {
      currentWord: word ? word.word : null,
      cardWidth: card ? card.style.width : null,
      cardHeight: card ? card.style.height : null,
      cardPadding: card ? card.style.padding : null,
      speakerSize: speaker ? `${speaker.offsetWidth}px x ${speaker.offsetHeight}px` : null,
      letterFontSize: firstLetterEl ? window.getComputedStyle(firstLetterEl).fontSize : null,
      letterFontWeight: firstLetterEl ? window.getComputedStyle(firstLetterEl).fontWeight : null,
      underlineWidth: letters ? letters.children[1]?.querySelector('span')?.style?.width : null
    };
  });
  console.log('📊 Kích thước khung ô chữ rơi mới:', cardStats);

  await page.screenshot({
    path: path.join(artifactDir, 'proof_larger_card_balanced.png'),
    fullPage: false
  });
  console.log('📸 Đã chụp ảnh khung ô chữ rơi bự vừa đủ:', 'proof_larger_card_balanced.png');

  // Kiểm tra: Bấm phím SAI -> Vẫn bắn đạn xanh!
  console.log('🔴 Thử bấm phím SAI (Z) xem đạn xanh có bay ra không...');
  await page.keyboard.press('KeyZ');
  // Chờ 80ms để đạn đang bay giữa đường
  await new Promise(r => setTimeout(r, 80));

  const bulletMidflightWrong = await page.evaluate(() => {
    const ws = window.VocabGameWorkstation;
    return {
      projectilesCount: ws.projectiles.length,
      projectileInfo: ws.projectiles[0] ? {
        progress: ws.projectiles[0].progress.toFixed(2),
        startX: ws.projectiles[0].x.toFixed(1),
        startY: ws.projectiles[0].y.toFixed(1),
        targetX: ws.projectiles[0].targetX.toFixed(1),
        targetY: ws.projectiles[0].targetY.toFixed(1)
      } : null,
      particlesCount: ws.particles.length,
      isMistake: ws.isMistake
    };
  });
  console.log('💥 Trạng thái đạn xanh khi bấm phím SAI:', bulletMidflightWrong);

  await page.screenshot({
    path: path.join(artifactDir, 'proof_blue_bullet_flying_on_wrong_key.png'),
    fullPage: false
  });
  console.log('📸 Đã chụp ảnh viên đạn xanh bay khi bấm phím SAI:', 'proof_blue_bullet_flying_on_wrong_key.png');

  // Chờ đạn chạm đích
  await new Promise(r => setTimeout(r, 300));

  // Kiểm tra: Bấm phím ĐÚNG -> Cũng bắn đạn xanh!
  console.log('🟢 Thử bấm phím ĐÚNG xem đạn xanh có bay ra không...');
  if (cardStats.currentWord && cardStats.currentWord.length > 1) {
    const correctChar = cardStats.currentWord[1].toUpperCase();
    await page.keyboard.press(`Key${correctChar}`);
    await new Promise(r => setTimeout(r, 90));

    const bulletMidflightCorrect = await page.evaluate(() => {
      const ws = window.VocabGameWorkstation;
      return {
        projectilesCount: ws.projectiles.length,
        projectileInfo: ws.projectiles[0] ? {
          progress: ws.projectiles[0].progress.toFixed(2),
          startX: ws.projectiles[0].x.toFixed(1),
          startY: ws.projectiles[0].y.toFixed(1)
        } : null,
        typedLetters: ws.typedLetters
      };
    });
    console.log('💥 Trạng thái đạn xanh khi bấm phím ĐÚNG:', bulletMidflightCorrect);

    await page.screenshot({
      path: path.join(artifactDir, 'proof_blue_bullet_flying_on_correct_key.png'),
      fullPage: false
    });
    console.log('📸 Đã chụp ảnh viên đạn xanh bay khi bấm phím ĐÚNG:', 'proof_blue_bullet_flying_on_correct_key.png');
  }

  await browser.close();
  console.log('🎉 Hoàn thành kiểm tra Khung bự vừa vặn & Đạn xanh bắn mọi phím!');
}

run().catch(err => {
  console.error('Lỗi kiểm tra:', err);
  process.exit(1);
});
