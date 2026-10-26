const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function run() {
  console.log('🚀 Launching Chrome to test Học từ vựng (AI & Mini-game Totoro)...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1400,950']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 950 });

  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', err => console.error('BROWSER_ERROR:', err.message));

  console.log('🌐 Navigating to http://127.0.0.1:3000/ ...');
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForFunction(() => typeof window.switchTab === 'function', { timeout: 15000 });

  console.log('👤 Setting login user session & checking sidebar order...');
  const sidebarCheck = await page.evaluate(() => {
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

    // Verify sidebar order
    const bayDeThi = document.getElementById('nav-bay-de-thi');
    const hocTuVung = document.getElementById('nav-hoc-tu-vung');
    const ngheChinhTa = document.getElementById('nav-nghe-chinh-ta');

    let positionValid = false;
    if (bayDeThi && hocTuVung && ngheChinhTa) {
      const bayNext = bayDeThi.nextElementSibling === hocTuVung;
      const hocNext = hocTuVung.nextElementSibling === ngheChinhTa;
      positionValid = bayNext && hocNext;
    }

    return {
      hasBayDeThi: !!bayDeThi,
      hasHocTuVung: !!hocTuVung,
      hasNgheChinhTa: !!ngheChinhTa,
      positionValid: positionValid,
      hocTuVungText: hocTuVung ? hocTuVung.innerText.trim() : null
    };
  });

  console.log('Sidebar Check Result:', sidebarCheck);

  console.log('🔄 Switching tab to hoc-tu-vung...');
  await page.evaluate(() => {
    window.switchTab('hoc-tu-vung');
  });

  await new Promise(r => setTimeout(r, 1500));

  console.log('📸 1. Capturing Vocab Config Screen...');
  await page.screenshot({
    path: path.join(artifactDir, 'proof_vocab_config.png'),
    fullPage: false
  });

  console.log('🎯 2. Setting topic "Phim Ghibli", level "B2", count 10 & clicking Generate...');
  await page.evaluate(() => {
    if (window.VocabGameWorkstation) {
      window.VocabGameWorkstation.selectQuickTopic('Phim hoạt hình Ghibli');
      window.VocabGameWorkstation.selectLevel('B2');
      window.VocabGameWorkstation.selectCount(10);
      window.VocabGameWorkstation.generateVocab(true);
    }
  });

  console.log('⏳ Waiting for vocab generation & preview render...');
  await page.waitForFunction(() => {
    const container = document.getElementById('view-hoc-tu-vung');
    return container && container.innerText.includes('Bắt đầu màn chơi ngay');
  }, { timeout: 35000 });

  await new Promise(r => setTimeout(r, 1200));

  console.log('📸 2. Capturing Vocab Preview Screen...');
  await page.screenshot({
    path: path.join(artifactDir, 'proof_vocab_preview.png'),
    fullPage: false
  });

  console.log('🎮 3. Entering Game Arena...');
  await page.evaluate(() => {
    if (window.VocabGameWorkstation && typeof window.VocabGameWorkstation.startArena === 'function') {
      window.VocabGameWorkstation.startArena();
    }
  });

  await new Promise(r => setTimeout(r, 1200));

  console.log('📸 3. Capturing Game Arena Screen (Falling card, Totoro mascot)...');
  await page.screenshot({
    path: path.join(artifactDir, 'proof_vocab_arena.png'),
    fullPage: false
  });

  console.log('⌨️ 4. Simulating keyboard interactions: wrong key then correct letters...');
  const wordInfo = await page.evaluate(() => {
    if (window.VocabGameWorkstation && window.VocabGameWorkstation.currentWord) {
      return {
        word: window.VocabGameWorkstation.currentWord.word.toLowerCase(),
        meaning: window.VocabGameWorkstation.currentWord.meaning
      };
    }
    return null;
  });

  console.log('Current Target Word:', wordInfo);

  if (wordInfo && wordInfo.word) {
    const word = wordInfo.word;
    const char1 = word[1] || 'a';
    const wrongChar = char1 === 'z' ? 'x' : 'z';
    console.log(`Typing wrong key "${wrongChar}" (expected "${char1}")...`);
    await page.keyboard.press(`Key${wrongChar.toUpperCase()}`);
    await new Promise(r => setTimeout(r, 600));

    // Capture wrong key feedback (hint and shake)
    await page.screenshot({
      path: path.join(artifactDir, 'proof_vocab_wrong_key.png'),
      fullPage: false
    });

    // Now type remaining characters starting from index 1
    const remaining = word.slice(1);
    console.log(`Typing correct remaining letters "${remaining}"...`);
    for (const char of remaining) {
      if (/^[a-z]$/.test(char)) {
        await page.keyboard.press(`Key${char.toUpperCase()}`);
        await new Promise(r => setTimeout(r, 250));
      }
    }
  }

  await new Promise(r => setTimeout(r, 800));

  console.log('📸 4. Capturing Game Arena cleared word / playing state...');
  await page.screenshot({
    path: path.join(artifactDir, 'proof_vocab_playing.png'),
    fullPage: false
  });

  console.log('🎉 Verification completed successfully!');
  await browser.close();
}

run().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
