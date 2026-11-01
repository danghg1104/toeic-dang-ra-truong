const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  console.log('Testing interactive modals on Desktop...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await sleep(1500);

  // Switch to Reading
  await page.evaluate(() => switchTab('doc'));
  await sleep(800);

  // Click Part 5 (30 cau)
  console.log('Opening Reading Part 5 Workstation...');
  await page.evaluate(() => {
    if (window.ToeicReadingWorkstation) {
      window.ToeicReadingWorkstation.open({ part: 5, count: 30, title: 'Part 5 - Incomplete Sentences (30 câu)' });
    }
  });
  await sleep(1000);

  const p5ModalState = await page.evaluate(() => {
    const modal = document.getElementById('toeicReadingWorkstation');
    const title = document.getElementById('trwTitle')?.innerText;
    const qCount = document.querySelectorAll('#trwQuestionsList .trw-q-card, .question-card, #trwQuestionsContainer > div').length;
    return {
      isOpen: modal ? !modal.classList.contains('hidden') : false,
      title,
      qCount
    };
  });
  console.log('Reading Part 5 Modal State:', p5ModalState);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'audit_reading_p5_modal_open.png') });

  // Close modal
  await page.evaluate(() => {
    if (window.ToeicReadingWorkstation) window.ToeicReadingWorkstation.close();
  });
  await sleep(500);

  // Switch to Listening
  console.log('Opening Listening Part 1 Workstation...');
  await page.evaluate(() => switchTab('nghe'));
  await sleep(800);

  await page.evaluate(() => {
    if (typeof openFullPartPracticeModal === 'function') {
      openFullPartPracticeModal(1);
    }
  });
  await sleep(1000);

  const p1ModalState = await page.evaluate(() => {
    const modal = document.getElementById('fullPartPracticeModal');
    const audio = modal ? modal.querySelector('audio') : null;
    const title = modal ? modal.querySelector('h3, h2, h1')?.innerText : null;
    return {
      isOpen: modal ? !modal.classList.contains('hidden') : false,
      title,
      hasAudio: !!audio
    };
  });
  console.log('Listening Part 1 Modal State:', p1ModalState);
  await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'audit_listening_p1_modal_open.png') });

  await browser.close();
  console.log('Modal tests complete!');
})();
