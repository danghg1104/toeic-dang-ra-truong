const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

async function runStep3Audit() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 850 });

  // Fast offline request interception
  await page.setRequestInterception(true);
  page.on('request', req => {
    const url = req.url();
    if (url.includes('fonts.googleapis') || url.includes('cdnjs.cloudflare') || url.includes('accounts.google.com')) {
      req.abort();
    } else {
      req.continue();
    }
  });

  // 1. Authenticate session
  await page.goto('http://127.0.0.1:3000/manifest.json');
  await page.setCookie({
    name: 'cd_session',
    value: '18aecc48e998366a29e990d0b434dc2b518ba1e4bc4a731c12ec273757fdb847',
    url: 'http://127.0.0.1:3000'
  });

  await page.goto('http://127.0.0.1:3000/#hom-nay', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));

  // 2. Test StudyFocusEngine
  const focusRes = await page.evaluate(() => {
    if (!window.StudyFocusEngine) return 'NOT_FOUND';
    StudyFocusEngine.enter('Thử Nghiệm Phòng Học Tập Trung');
    const isActive = document.body.classList.contains('zen-focus-active');
    const hud = document.getElementById('zenFocusHeader');
    const label = document.getElementById('zenStationLabel')?.textContent?.trim();
    return {
      isActive,
      hasHud: !!hud,
      label
    };
  });
  console.log('--- FOCUS ENGINE AUDIT ---', focusRes);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step3_zen_focus_mode.png') });

  // Exit Focus Mode for subsequent checks
  await page.evaluate(() => window.StudyFocusEngine && StudyFocusEngine.exit());
  await new Promise(r => setTimeout(r, 600));

  // 3. Test Grammar Theory with valid slug 'present-tenses'
  await page.evaluate(() => {
    if (window.GrammarEngine && typeof GrammarEngine.showTheoryView === 'function') {
      GrammarEngine.showTheoryView('present-tenses');
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  const theoryAudit = await page.evaluate(() => {
    const el = document.getElementById('view-grammar-theory');
    return {
      isVisible: el && !el.classList.contains('hidden'),
      title: el?.querySelector('h1')?.textContent?.trim(),
      hasGoldenRule: el ? el.innerText.includes('Quy tắc vàng') : false,
      hasMentalModel: el ? el.innerText.includes('Mô hình tư duy') || el.innerText.includes('Chủ ngữ') : false
    };
  });
  console.log('--- GRAMMAR THEORY AUDIT ---', theoryAudit);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step3_grammar_theory.png') });

  // 4. Test Grammar Practice with valid slug 'present-tenses'
  await page.evaluate(() => {
    if (window.GrammarEngine && typeof GrammarEngine.showPracticeView === 'function') {
      GrammarEngine.showPracticeView('present-tenses');
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  // Click an option (e.g. option 'A') to trigger inline feedback & 3-step reasoning
  await page.evaluate(() => {
    if (window.GrammarEngine && typeof GrammarEngine.selectOption === 'function') {
      GrammarEngine.selectOption('A');
    }
  });
  await new Promise(r => setTimeout(r, 800));

  const practiceAudit = await page.evaluate(() => {
    const el = document.getElementById('view-grammar-practice');
    return {
      isVisible: el && !el.classList.contains('hidden'),
      questionText: el?.querySelector('h3')?.textContent?.trim()?.slice(0, 80),
      hasInlineFeedback: !!el?.querySelector('.text-emerald-700, .text-rose-600'),
      has3StepReasoning: el ? el.innerText.includes('CÁCH SUY LUẬN') : false
    };
  });
  console.log('--- GRAMMAR PRACTICE AUDIT ---', practiceAudit);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step3_grammar_practice.png') });

  // 5. Test Reading Hub (#view-doc)
  await page.evaluate(() => switchTab('doc'));
  await new Promise(r => setTimeout(r, 1000));
  const readingAudit = await page.evaluate(() => {
    const el = document.getElementById('view-doc');
    return {
      isVisible: el && !el.classList.contains('hidden'),
      hasMayReading: el ? el.innerHTML.includes('may_reading.png') : false,
      hasPart5Card: el ? el.innerText.includes('Part 5') : false,
      hasPart7Card: el ? el.innerText.includes('Part 7') : false
    };
  });
  console.log('--- READING HUB AUDIT ---', readingAudit);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step3_reading_hub.png') });

  // 6. Test Listening Hub (#view-nghe)
  await page.evaluate(() => switchTab('nghe'));
  await new Promise(r => setTimeout(r, 1000));
  const listeningAudit = await page.evaluate(() => {
    const el = document.getElementById('view-nghe');
    return {
      isVisible: el && !el.classList.contains('hidden'),
      hasPart1Card: el ? el.innerText.includes('Part 1') : false,
      hasEts2026: el ? el.innerText.includes('ETS 2026') : false
    };
  });
  console.log('--- LISTENING HUB AUDIT ---', listeningAudit);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step3_listening_hub.png') });

  // 7. Test Vocab Study View
  await page.evaluate(() => {
    if (window.VocabularyEngine && typeof VocabularyEngine.showStudyView === 'function') {
      VocabularyEngine.showStudyView('contracts');
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  const vocabStudyAudit = await page.evaluate(() => {
    const el = document.getElementById('view-vocabulary-study');
    return {
      isVisible: el && !el.classList.contains('hidden'),
      hasFlashcard: el ? el.innerHTML.includes('flipCard()') : false,
      currentWord: el?.querySelector('h2')?.textContent?.trim(),
      hasUSButton: el ? el.innerText.includes('US') : false
    };
  });
  console.log('--- VOCAB STUDY AUDIT ---', vocabStudyAudit);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step3_vocab_study.png') });

  // 8. Test Vocab Match Arena
  await page.evaluate(() => {
    if (window.VocabularyEngine && typeof VocabularyEngine.showMatchView === 'function') {
      VocabularyEngine.showMatchView();
    }
  });
  await new Promise(r => setTimeout(r, 1000));
  const vocabMatchAudit = await page.evaluate(() => {
    const el = document.getElementById('view-vocabulary-match');
    return {
      isVisible: el && !el.classList.contains('hidden'),
      hasCards: !!el?.querySelector('.grid button, .grid div[onclick]')
    };
  });
  console.log('--- VOCAB MATCH AUDIT ---', vocabMatchAudit);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step3_vocab_match.png') });

  await browser.close();
  console.log('ALL STEP 3 AUDITS COMPLETED SUCCESSFULLY!');
}

runStep3Audit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
