const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testRenderLive() {
  console.log('Connecting to https://toeic-dang-ra-truong.onrender.com/...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') console.log('Console Error on Render:', msg.text());
  });

  try {
    // 1. Test Reading Part 5 on Render
    console.log('1. Testing Reading Part 5 on Render...');
    await page.goto('https://toeic-dang-ra-truong.onrender.com/', { waitUntil: 'networkidle2', timeout: 45000 });
    await sleep(2000);

    // Switch to Reading tab
    await page.evaluate(() => {
      if (typeof window.switchAppTab === 'function') {
        window.switchAppTab('luyen-doc');
      }
    });
    await sleep(2000);

    // Open Part 5 workstation
    await page.evaluate(() => {
      if (window.ToeicReadingWorkstation) {
        window.ToeicReadingWorkstation.open({ part: 5, title: 'Part 5 - Incomplete Sentences (Full 30 câu)', count: 30 });
      }
    });
    await sleep(2500);

    const readingMetrics = await page.evaluate(() => {
      const modal = document.getElementById('toeicReadingWorkstation');
      const questionEl = document.querySelector('#rwQuestionText, #rwQuestionNumber, .rw-question-body');
      const counterEl = document.querySelector('#rwHeaderCounter, #rwQuestionProgress');
      return {
        modalVisible: modal ? !modal.classList.contains('hidden') : false,
        modalDisplay: modal ? window.getComputedStyle(modal).display : null,
        totalItems: window.ToeicReadingWorkstation ? (window.ToeicReadingWorkstation.items ? window.ToeicReadingWorkstation.items.length : 0) : 0,
        counter: counterEl ? counterEl.innerText : null,
        hasQuestion: questionEl ? questionEl.innerText.substring(0, 50) : null
      };
    });
    console.log('Reading Part 5 on Render:', readingMetrics);

    const readingShotPath = path.join(ARTIFACTS_DIR, 'proof_render_reading_part5.png');
    await page.screenshot({ path: readingShotPath, fullPage: false });
    console.log('Saved Reading screenshot:', readingShotPath);

    // Close reading modal
    await page.evaluate(() => {
      if (window.ToeicReadingWorkstation) {
        window.ToeicReadingWorkstation.close();
      }
    });
    await sleep(1000);

    // 2. Test Vocab Study (/vocabulary/contracts/study) on Render
    console.log('\n2. Testing Vocab Study (/vocabulary/contracts/study) on Render...');
    await page.goto('https://toeic-dang-ra-truong.onrender.com/vocabulary/contracts/study', { waitUntil: 'networkidle2', timeout: 45000 });
    await sleep(2500);

    const vocabMetrics = await page.evaluate(() => {
      const wordRail = document.querySelector('.lg\\:col-span-3, [class*="col-span-3"]');
      const flashcardCol = document.querySelector('.lg\\:col-span-9, [class*="col-span-9"]');
      const flashcard = document.querySelector('#vocabStudyFlashcard, .max-w-xl');
      return {
        wordRailWidth: wordRail ? wordRail.getBoundingClientRect().width : null,
        flashcardColWidth: flashcardCol ? flashcardCol.getBoundingClientRect().width : null,
        flashcardWidth: flashcard ? flashcard.getBoundingClientRect().width : null
      };
    });
    console.log('Vocab Study metrics on Render:', vocabMetrics);

    const vocabShotPath = path.join(ARTIFACTS_DIR, 'proof_render_vocab_study.png');
    await page.screenshot({ path: vocabShotPath, fullPage: false });
    console.log('Saved Vocab screenshot:', vocabShotPath);

    // 3. Test Vocab Arena on Render
    console.log('\n3. Testing Vocab Arena on Render...');
    await page.goto('https://toeic-dang-ra-truong.onrender.com/', { waitUntil: 'networkidle2', timeout: 45000 });
    await sleep(2000);

    await page.evaluate(() => {
      if (typeof window.switchAppTab === 'function') {
        window.switchAppTab('dau-truong-tu-vung');
      }
    });
    await sleep(2000);

    // Enter custom words and start arena
    await page.evaluate(() => {
      if (window.VocabGameWorkstation) {
        window.VocabGameWorkstation.switchIntakeMode('custom');
      }
    });
    await sleep(1000);

    await page.evaluate(() => {
      const area = document.getElementById('vgCustomInputArea');
      if (area) {
        area.value = 'negotiate - đàm phán, thương lượng\nsustainable - bền vững\ninnovative - đổi mới sáng tạo';
      }
      window.VocabGameWorkstation.handleCustomVocabSubmit();
    });
    await sleep(1000);

    // Click start button
    await page.evaluate(() => {
      if (window.VocabGameWorkstation) {
        window.VocabGameWorkstation.startArena();
      }
    });
    await sleep(2000);

    const arenaMetrics = await page.evaluate(() => {
      const container = document.getElementById('vgArenaContainer');
      const card = document.getElementById('vgFallingCard');
      const mascot = document.getElementById('vgReflexWrapper');
      return {
        arenaFound: !!container,
        arenaHeight: container ? container.getBoundingClientRect().height : 0,
        cardFound: !!card,
        cardTop: card ? card.style.top : null,
        mascotFound: !!mascot,
        currentWord: window.VocabGameWorkstation ? (window.VocabGameWorkstation.currentWord ? window.VocabGameWorkstation.currentWord.word : null) : null
      };
    });
    console.log('Vocab Arena metrics on Render:', arenaMetrics);

    const arenaShotPath = path.join(ARTIFACTS_DIR, 'proof_render_vocab_arena.png');
    await page.screenshot({ path: arenaShotPath, fullPage: false });
    console.log('Saved Arena screenshot:', arenaShotPath);

  } catch (err) {
    console.error('Error during Render test:', err);
  } finally {
    await browser.close();
    console.log('Render live test complete!');
  }
}

testRenderLive();
