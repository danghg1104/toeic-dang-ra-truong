// scripts/verify_reset_puppeteer.js
const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  console.log('🚀 Starting Puppeteer Verification for Vocab Reset...');
  const browser = await puppeteer.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // Navigate to app
    console.log('Navigating to http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

    // Login if modal open
    await page.evaluate(() => {
      const modal = document.getElementById('loginModal');
      if (modal && !modal.classList.contains('hidden') && getComputedStyle(modal).display !== 'none') {
        const u = document.getElementById('loginUsername');
        const p = document.getElementById('loginPassword');
        if (u) u.value = 'admin';
        if (p) p.value = 'admin123';
        const btn = document.getElementById('loginSubmitBtn');
        if (btn) btn.click();
      }
    });
    await new Promise(r => setTimeout(r, 1500));

    // Open Vocab Game Workstation
    console.log('Switching to "Học từ vựng" tab...');
    await page.evaluate(() => {
      if (typeof switchTab === 'function') switchTab('hoc-tu-vung');
    });
    await new Promise(r => setTimeout(r, 1000));

    // Configure: Topic "Công nghệ", Level "A2", Count 15
    console.log('Configuring Topic "Công nghệ", Level "A2", Count 15...');
    await page.evaluate(() => {
      VocabGameWorkstation.selectQuickTopic('Công nghệ', 'technology');
      VocabGameWorkstation.selectLevel('A2');
      VocabGameWorkstation.selectCount(15);
    });
    await new Promise(r => setTimeout(r, 600));

    // Generate initial vocab (Round 1)
    console.log('Generating initial vocab (Round 1)...');
    await page.evaluate(async () => {
      await VocabGameWorkstation.generateVocab(true);
    });
    await new Promise(r => setTimeout(r, 1500));

    // Extract Round 1 words
    const round1Words = await page.evaluate(() => {
      return VocabGameWorkstation.wordList.map(w => w.word);
    });
    console.log('👉 Round 1 Words (Count: ' + round1Words.length + '):', round1Words);

    const artifactDir = path.join(process.env.USERPROFILE || 'C:\\Users\\Admin', '.gemini', 'antigravity', 'brain', 'a08eff3b-945d-45ab-b5c1-5f5efd108058');
    const shot1 = path.join(artifactDir, 'proof_round1_congnghe_a2.png');
    await page.screenshot({ path: shot1, fullPage: false });
    console.log(`📸 Screenshot saved: ${shot1}`);

    // Click Reset (Round 2)
    console.log('\n🔄 Clicking "Đổi từ mới (Reset)" for Round 2...');
    await page.evaluate(async () => {
      await VocabGameWorkstation.resetSessionWords();
    });
    await new Promise(r => setTimeout(r, 1500));

    const round2Words = await page.evaluate(() => {
      return VocabGameWorkstation.wordList.map(w => w.word);
    });
    console.log('👉 Round 2 Words (Count: ' + round2Words.length + '):', round2Words);

    const shot2 = path.join(artifactDir, 'proof_round2_reset_brand_new_words.png');
    await page.screenshot({ path: shot2, fullPage: false });
    console.log(`📸 Screenshot saved: ${shot2}`);

    const overlap12 = round2Words.filter(w => round1Words.includes(w));
    console.log('🔍 Overlap Round 1 vs Round 2:', overlap12.length, overlap12);

    // Click Reset AGAIN (Round 3)
    console.log('\n🔄 Clicking "Đổi từ mới (Reset)" for Round 3...');
    await page.evaluate(async () => {
      await VocabGameWorkstation.resetSessionWords();
    });
    await new Promise(r => setTimeout(r, 1500));

    const round3Words = await page.evaluate(() => {
      return VocabGameWorkstation.wordList.map(w => w.word);
    });
    console.log('👉 Round 3 Words (Count: ' + round3Words.length + '):', round3Words);

    const shot3 = path.join(artifactDir, 'proof_round3_reset_again.png');
    await page.screenshot({ path: shot3, fullPage: false });
    console.log(`📸 Screenshot saved: ${shot3}`);

    const seenSoFar = new Set([...round1Words, ...round2Words]);
    const overlap3 = round3Words.filter(w => seenSoFar.has(w));
    console.log('🔍 Overlap Round 3 vs (1+2):', overlap3.length, overlap3);

    // Final Assertion
    if (overlap12.length === 0 && overlap3.length === 0) {
      console.log('\n🌟 100% SUCCESS! Zero duplicates across resets! Brand new words every time!');
    } else {
      console.warn('\n⚠️ Overlap detected:', { overlap12, overlap3 });
    }

  } catch (err) {
    console.error('❌ Puppeteer error:', err);
  } finally {
    await browser.close();
  }
})();
