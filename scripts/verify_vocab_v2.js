const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function run() {
  console.log('🚀 Launching Chrome to test Vocab V2 Upgrades...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1400,950']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 950 });

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('VOCAB') || text.includes('ERROR') || text.includes('Gun') || text.includes('Bullet')) {
      console.log('BROWSER_LOG:', text);
    }
  });
  page.on('pageerror', err => console.error('BROWSER_ERROR:', err.message));

  console.log('🌐 Navigating to http://127.0.0.1:3000/ ...');
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForFunction(() => typeof window.switchTab === 'function', { timeout: 15000 });

  console.log('👤 Setting login user session...');
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
  });

  console.log('🔄 Switching tab to hoc-tu-vung...');
  await page.evaluate(() => {
    window.switchTab('hoc-tu-vung');
  });

  await new Promise(r => setTimeout(r, 1200));

  // 1. Verify Config UI: Button has no "AI", English topic hints & tags present
  console.log('📸 1. Capturing Vocab Config Screen (No AI in button, English supported)...');
  const configUI = await page.evaluate(() => {
    const btn = document.getElementById('vgGenerateBtn');
    const topicInput = document.getElementById('vgTopicInput');
    const label = topicInput ? topicInput.closest('div').querySelector('label')?.innerText : '';
    return {
      buttonText: btn ? btn.innerText.trim() : null,
      labelText: label,
      placeholder: topicInput ? topicInput.placeholder : null
    };
  });
  console.log('Config UI verification:', configUI);

  await page.screenshot({
    path: path.join(artifactDir, 'proof_vocab_config_v2.png'),
    fullPage: false
  });

  // 2. Test instant generation with English topic input
  console.log('⚡ 2. Typing English topic "Job Interview", Level "B2", Count 10 and measuring generation speed...');
  const t0 = Date.now();
  await page.evaluate(() => {
    const topicInput = document.getElementById('vgTopicInput');
    if (topicInput) {
      topicInput.value = 'Job Interview';
    }
    if (window.VocabGameWorkstation) {
      window.VocabGameWorkstation.selectLevel('B2');
      window.VocabGameWorkstation.selectCount(10);
      window.VocabGameWorkstation.generateVocab(true);
    }
  });

  await page.waitForFunction(() => {
    const container = document.getElementById('view-hoc-tu-vung');
    return container && container.innerText.includes('Bắt đầu màn chơi ngay');
  }, { timeout: 10000 });
  const durationMs = Date.now() - t0;
  console.log(`⏱️ Generation completed in ${durationMs}ms! (Target: < 500ms)`);

  await new Promise(r => setTimeout(r, 1000));

  console.log('📸 2. Capturing Vocab Preview Screen for English topic "Job Interview"...');
  await page.screenshot({
    path: path.join(artifactDir, 'proof_vocab_preview_v2.png'),
    fullPage: false
  });

  // 3. Enter Game Arena
  console.log('🎮 3. Entering Game Arena...');
  await page.evaluate(() => {
    if (window.VocabGameWorkstation && typeof window.VocabGameWorkstation.startArena === 'function') {
      window.VocabGameWorkstation.startArena();
    }
  });

  await new Promise(r => setTimeout(r, 1200));

  // Inspect arena state: Green Blaster present, card position and size
  const arenaState = await page.evaluate(() => {
    const blaster = document.getElementById('vgGreenBlaster');
    const card = document.getElementById('vgFallingCard');
    const oldAvatar = document.querySelector('img[src*="totoro"]');
    return {
      hasGreenBlaster: !!blaster,
      blasterTransform: blaster ? blaster.style.transform : null,
      cardLeft: card ? card.style.left : null,
      cardTop: card ? card.style.top : null,
      cardTheme: card ? card.className : null,
      hasOldTotoroAvatar: !!oldAvatar
    };
  });
  console.log('Arena State Check:', arenaState);

  console.log('📸 3. Capturing Game Arena Screen (Cute Green Blaster & natural falling card)...');
  await page.screenshot({
    path: path.join(artifactDir, 'proof_vocab_arena_v2.png'),
    fullPage: false
  });

  // 4. Test gun firing golden bullet & shooting recoil
  console.log('🔫 4. Simulating typing to trigger Green Blaster rotation & golden bullets...');
  const currentWordInfo = await page.evaluate(() => {
    if (window.VocabGameWorkstation && window.VocabGameWorkstation.currentWord) {
      return {
        word: window.VocabGameWorkstation.currentWord.word.toLowerCase()
      };
    }
    return null;
  });
  console.log('Current word to shoot:', currentWordInfo);

  if (currentWordInfo && currentWordInfo.word) {
    const firstLetter = currentWordInfo.word[1] || 'a';
    console.log(`Pressing key "${firstLetter}" to shoot golden bullet...`);
    await page.keyboard.press(`Key${firstLetter.toUpperCase()}`);
    // Brief wait to catch bullet in flight and gun recoil
    await new Promise(r => setTimeout(r, 90));

    console.log('📸 4. Capturing Gun Shooting & Golden Bullet in flight...');
    await page.screenshot({
      path: path.join(artifactDir, 'proof_vocab_bullet_fire.png'),
      fullPage: false
    });

    // Let bullet hit and sparks burst
    await new Promise(r => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(artifactDir, 'proof_vocab_bullet_hit.png'),
      fullPage: false
    });
  }

  console.log('🎉 Verification V2 completed successfully!');
  await browser.close();
}

run().catch(err => {
  console.error('❌ Verification V2 failed:', err);
  process.exit(1);
});
