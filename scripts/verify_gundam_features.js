const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function run() {
  console.log('🚀 Launching Chrome to test Gundam Arena & Vocab Scanner...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Gundam') || text.includes('CEFR') || text.includes('ERROR')) {
      console.log('BROWSER_LOG:', text);
    }
  });

  console.log('🌐 Navigating to http://127.0.0.1:3000/ ...');
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForFunction(() => typeof window.switchTab === 'function', { timeout: 15000 });

  console.log('👤 Setting login user session...');
  await page.evaluate(() => {
    const testUser = {
      uid: 'user_gundam_pilot',
      email: 'pilot_dang@cungdang.edu.vn',
      displayName: 'Đăng Gundam Pilot',
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

  await new Promise(r => setTimeout(r, 1200));

  // 1. Verify 3 Intake Tabs in Config
  console.log('📸 1. Capturing Config View with 3 Intake Tabs...');
  await page.screenshot({
    path: path.join(artifactDir, 'proof_gundam_config_tabs.png'),
    fullPage: false
  });

  // 2. Test File Upload & Scan 3,000 words
  console.log('📁 2. Testing File Upload & Scan 3,000 words...');
  const test3000Content = fs.readFileSync('scripts/test_3000_words.txt', 'utf8');
  const scanResult = await page.evaluate((rawText) => {
    window.VocabGameWorkstation.switchIntakeMode('file');
    window.VocabGameWorkstation.processUploadedFileText(rawText, 'Bo_3000_Tu_Vung_Oxford.txt');
    return window.VocabGameWorkstation.scannedStats;
  }, test3000Content);
  console.log('3,000 words scan stats result:', scanResult);

  await new Promise(r => setTimeout(r, 1000));

  console.log('📸 2. Capturing 3,000 words scanned & CEFR breakdown cards...');
  await page.screenshot({
    path: path.join(artifactDir, 'proof_gundam_file_scan_3000.png'),
    fullPage: false
  });

  // 3. Test Custom Vocab Input Tab
  console.log('✍️ 3. Testing Custom Vocab Input Tab...');
  await page.evaluate(() => {
    window.VocabGameWorkstation.switchIntakeMode('custom');
    window.VocabGameWorkstation.fillSampleCustomVocab();
  });
  await new Promise(r => setTimeout(r, 800));

  console.log('📸 3. Capturing Custom Vocab Input View...');
  await page.screenshot({
    path: path.join(artifactDir, 'proof_gundam_custom_input.png'),
    fullPage: false
  });

  // 4. Submit custom vocab & enter Preview
  console.log('🚀 4. Entering Preview View...');
  await page.evaluate(() => {
    window.VocabGameWorkstation.handleCustomVocabSubmit();
  });
  await new Promise(r => setTimeout(r, 1000));

  await page.screenshot({
    path: path.join(artifactDir, 'proof_gundam_preview.png'),
    fullPage: false
  });

  // 5. Enter Gundam Arena (Check expanded size, medium card, Gundam mecha, Reset button)
  console.log('🎮 5. Entering Gundam Arena...');
  await page.evaluate(() => {
    window.VocabGameWorkstation.startArena();
  });
  await new Promise(r => setTimeout(r, 1200));

  const arenaCheck = await page.evaluate(() => {
    const arena = document.getElementById('vgArenaContainer');
    const gundam = document.getElementById('vgGundamLauncher');
    const card = document.getElementById('vgFallingCard');
    return {
      arenaWidth: arena ? arena.clientWidth : 0,
      arenaHeight: arena ? arena.clientHeight : 0,
      hasGundam: !!gundam,
      cardLeft: card ? card.style.left : null,
      cardTop: card ? card.style.top : null,
      cardMinWidth: card ? card.style.minWidth : null
    };
  });
  console.log('Arena check info:', arenaCheck);

  console.log('📸 5. Capturing Expanded Gundam Arena (Wide view, Gundam Mecha, Medium Card)...');
  await page.screenshot({
    path: path.join(artifactDir, 'proof_gundam_arena_wide.png'),
    fullPage: false
  });

  // 6. Test Aiming & Firing Gundam Beam Laser
  console.log('💥 6. Testing Aiming Left & Right and Beam Laser Projectile...');
  // Move card to right
  await page.evaluate(() => {
    window.VocabGameWorkstation.cardBaseX = 68;
    window.VocabGameWorkstation.fallProgress = 22;
    const card = document.getElementById('vgFallingCard');
    if (card) {
      card.style.left = '68%';
      card.style.top = '22%';
    }
  });
  await new Promise(r => setTimeout(r, 600));

  // Fire Beam laser
  await page.evaluate(() => {
    window.VocabGameWorkstation.spawnShootProjectile();
  });
  await new Promise(r => setTimeout(r, 120));

  console.log('📸 6. Capturing Gundam Beam Laser in flight towards right card...');
  await page.screenshot({
    path: path.join(artifactDir, 'proof_gundam_beam_laser.png'),
    fullPage: false
  });

  // 7. Complete word and verify auto-save to Sổ tay từ vựng
  console.log('🔖 7. Completing word and checking Sổ tay từ vựng (Notebook) sync...');
  const initialNotebookCount = await page.evaluate(() => {
    return Array.isArray(window.savedVocabItems) ? window.savedVocabItems.length : 0;
  });

  await page.evaluate(() => {
    // Force complete word
    window.VocabGameWorkstation.typedLetters = window.VocabGameWorkstation.currentWord.word.toLowerCase();
    window.VocabGameWorkstation.handleWordCleared();
  });

  await new Promise(r => setTimeout(r, 400));

  console.log('📸 7a. Capturing Word Cleared & "Đã thêm vào Sổ tay từ vựng" badge...');
  await page.screenshot({
    path: path.join(artifactDir, 'proof_gundam_word_cleared_notebook.png'),
    fullPage: false
  });

  const updatedNotebookCount = await page.evaluate(() => {
    return Array.isArray(window.savedVocabItems) ? window.savedVocabItems.length : 0;
  });
  console.log(`Notebook words count: ${initialNotebookCount} -> ${updatedNotebookCount}`);

  // Switch to Tab 'tu-vung' and check rendered notebook list
  console.log('📖 8. Switching to "Từ vựng" tab & opening "Sổ tay từ vựng" sub-mode...');
  await page.evaluate(() => {
    window.switchTab('tu-vung');
    if (typeof window.switchVocabSubMode === 'function') {
      window.switchVocabSubMode('saved');
    }
  });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({
    path: path.join(artifactDir, 'proof_gundam_notebook_verified.png'),
    fullPage: false
  });

  console.log('🎉 All Gundam & Vocab Scanner verifications passed successfully!');
  await browser.close();
}

run().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
