const puppeteer = require('puppeteer-core');
const path = require('path');

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function run() {
  console.log('🚀 Running gun rotation & golden bullet capture script...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1400,950']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 950 });

  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForFunction(() => typeof window.switchTab === 'function', { timeout: 15000 });

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

  await new Promise(r => setTimeout(r, 1000));

  // Quick generate
  await page.evaluate(() => {
    if (window.VocabGameWorkstation) {
      window.VocabGameWorkstation.selectQuickTopic('Du lịch (Travel)');
      window.VocabGameWorkstation.selectLevel('B1');
      window.VocabGameWorkstation.selectCount(10);
      window.VocabGameWorkstation.generateVocab(true);
    }
  });

  await page.waitForFunction(() => {
    const container = document.getElementById('view-hoc-tu-vung');
    return container && container.innerText.includes('Bắt đầu màn chơi ngay');
  }, { timeout: 10000 });

  // Enter arena
  await page.evaluate(() => {
    window.VocabGameWorkstation.startArena();
  });

  await new Promise(r => setTimeout(r, 800));

  // Scenario 1: Force card to left (30%) & let gun smoothly track left
  console.log('🎯 Aiming to Left...');
  await page.evaluate(() => {
    window.VocabGameWorkstation.cardBaseX = 30;
    window.VocabGameWorkstation.fallProgress = 20;
    const card = document.getElementById('vgFallingCard');
    if (card) {
      card.style.left = '30%';
      card.style.top = '20%';
    }
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({
    path: path.join(artifactDir, 'proof_vocab_gun_aim_left.png'),
    fullPage: false
  });

  // Scenario 2: Force card to right (70%) & let gun smoothly track right
  console.log('🎯 Aiming to Right...');
  await page.evaluate(() => {
    window.VocabGameWorkstation.cardBaseX = 70;
    window.VocabGameWorkstation.fallProgress = 25;
    const card = document.getElementById('vgFallingCard');
    if (card) {
      card.style.left = '70%';
      card.style.top = '25%';
    }
  });
  await new Promise(r => setTimeout(r, 700));

  await page.screenshot({
    path: path.join(artifactDir, 'proof_vocab_gun_aim_right.png'),
    fullPage: false
  });

  // Scenario 3: Fire golden bullet and capture it mid-flight
  console.log('💥 Firing golden bullet towards the right...');
  await page.evaluate(() => {
    window.VocabGameWorkstation.spawnShootProjectile();
  });
  // Wait 120ms to let bullet travel midway
  await new Promise(r => setTimeout(r, 130));

  await page.screenshot({
    path: path.join(artifactDir, 'proof_vocab_golden_bullet_midflight.png'),
    fullPage: false
  });

  console.log('✅ Finished capture successfully!');
  await browser.close();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
