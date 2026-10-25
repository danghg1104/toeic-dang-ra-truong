const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function runVerification() {
  console.log('Launching Chrome via puppeteer-core...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1400,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

  console.log('Navigating to http://127.0.0.1:3000/ ...');
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForFunction(() => typeof window.switchTab === 'function' && typeof window.DailyDictationWorkstation !== 'undefined', { timeout: 15000 });

  // Set user login state and switch to DailyDictation Tab
  console.log('Setting login session and switching to nghe-chinh-ta tab...');
  await page.evaluate(() => {
    const testUser = {
      uid: 'user_test_demo',
      email: 'demo@cungdang.edu.vn',
      displayName: 'Học viên Ghibli',
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
    window.switchTab('nghe-chinh-ta');
  });

  await new Promise(r => setTimeout(r, 1200));

  // 1. Initial All levels view
  console.log('1. Capturing initial catalog view (All 600 lessons)...');
  await page.screenshot({ path: path.join(artifactDir, 'proof_dictation_catalog_all.png'), fullPage: false });

  // 2. Test Level A1
  console.log('2. Testing Level A1 (88 lessons)...');
  await page.evaluate(() => {
    window.DailyDictationWorkstation.quickFilterLevel('A1');
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, 'proof_dictation_level_a1.png'), fullPage: false });

  // 3. Test Level A2
  console.log('3. Testing Level A2 (178 lessons - User Ảnh 1 & 4 Fix)...');
  await page.evaluate(() => {
    window.DailyDictationWorkstation.quickFilterLevel('A2');
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, 'proof_dictation_level_a2.png'), fullPage: false });

  // 4. Test Level B1
  console.log('4. Testing Level B1 (146 lessons)...');
  await page.evaluate(() => {
    window.DailyDictationWorkstation.quickFilterLevel('B1');
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, 'proof_dictation_level_b1.png'), fullPage: false });

  // 5. Test Level B2
  console.log('5. Testing Level B2 (114 lessons)...');
  await page.evaluate(() => {
    window.DailyDictationWorkstation.quickFilterLevel('B2');
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, 'proof_dictation_level_b2.png'), fullPage: false });

  // 6. Test Level C1
  console.log('6. Testing Level C1 (51 lessons)...');
  await page.evaluate(() => {
    window.DailyDictationWorkstation.quickFilterLevel('C1');
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, 'proof_dictation_level_c1.png'), fullPage: false });

  // 7. Test Level C2
  console.log('7. Testing Level C2 (23 lessons)...');
  await page.evaluate(() => {
    window.DailyDictationWorkstation.quickFilterLevel('C2');
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, 'proof_dictation_level_c2.png'), fullPage: false });

  // 8. Test Search Query: 'copier'
  console.log('8. Testing Search Query "copier"...');
  await page.evaluate(() => {
    window.DailyDictationWorkstation.resetFilters();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.evaluate(() => {
    const input = document.getElementById('ddwSearchInput');
    if (input) {
      input.value = 'copier';
      window.DailyDictationWorkstation.onSearchInput('copier');
      window.DailyDictationWorkstation.applyFilters();
    }
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(artifactDir, 'proof_dictation_search_copier.png'), fullPage: false });

  // 9. Open Exercise Workstation
  console.log('9. Opening Exercise Workstation for Practice Test 1, conversation-1.1481...');
  await page.evaluate(() => {
    window.DailyDictationWorkstation.openLesson(1, 'conversation-1.1481');
  });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(artifactDir, 'proof_dictation_exercise.png'), fullPage: false });

  await browser.close();
  console.log('Verification completed successfully! All 9 screenshots saved in artifacts.');
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
