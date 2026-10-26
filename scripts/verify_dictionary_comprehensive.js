const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function testDictionary() {
  console.log('🚀 Starting Puppeteer to verify dictionary upgrades...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,950']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 950 });

  console.log('Navigating to http://localhost:3000 ...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

  // Setup authenticated user and switch tab
  console.log('Setting authenticated session and switching to tu-dien...');
  await page.evaluate(() => {
    const testUser = {
      uid: 'user_totoro_vip',
      email: 'dang_totoro@cungdang.edu.vn',
      displayName: 'Đăng Totoro',
      name: 'Đặng Totoro',
      role: 'admin'
    };
    window.currentUserAccount = testUser;
    localStorage.setItem('cung_dang_session_user', JSON.stringify(testUser));

    if (typeof closeAuthModal === 'function') closeAuthModal();
    const modal = document.getElementById('authModal');
    if (modal) {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
      modal.style.display = 'none';
    }

    // Now switchTab will succeed because currentUserAccount is truthy!
    window.switchTab('tu-dien');
  });

  await new Promise(r => setTimeout(r, 1200));

  const wordsToTest = [
    { word: 'curios', shotName: 'proof_dict_curios.png' },
    { word: 'supreme leaders', shotName: 'proof_dict_supreme_leaders.png' },
    { word: 'head of state meeting', shotName: 'proof_dict_head_of_state_meeting.png' },
    { word: 'lease', shotName: 'proof_dict_lease.png' }
  ];

  for (const item of wordsToTest) {
    console.log(`\n🔍 Testing lookup for "${item.word}"...`);
    const result = await page.evaluate(async (w) => {
      const input = document.getElementById('dictSearchInput');
      if (input) input.value = w;
      if (typeof renderDictionaryResult === 'function') {
        await renderDictionaryResult(w);
      }
      await new Promise(r => setTimeout(r, 600));
      const container = document.getElementById('dictResultContainer');
      const text = container ? container.innerText : '';
      const isNotFound = text.includes('Không tìm thấy từ hoặc cụm từ');
      return { text: text.substring(0, 300), isNotFound };
    }, item.word);

    console.log(`Result for "${item.word}": isNotFound = ${result.isNotFound}`);
    console.log(`Preview: ${result.text.replace(/\n+/g, ' ')}`);

    // Ensure dictResultContainer is scrolled into full view
    await page.evaluate(() => {
      const el = document.getElementById('dictResultContainer');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await new Promise(r => setTimeout(r, 500));

    const shotPath = path.join(ARTIFACT_DIR, item.shotName);
    await page.screenshot({ path: shotPath });
    console.log(`📸 Saved screenshot to: ${shotPath}`);
  }

  await browser.close();
  console.log('\n🎉 Verification completed successfully!');
}

testDictionary().catch(err => {
  console.error('❌ Verification failed:', err);
  process.exit(1);
});
