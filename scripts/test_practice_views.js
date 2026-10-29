const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

async function testPracticeViews() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 850 });

  // Authenticate session
  await page.goto('http://localhost:3000/manifest.json');
  await page.setCookie({
    name: 'cd_session',
    value: '18aecc48e998366a29e990d0b434dc2b518ba1e4bc4a731c12ec273757fdb847',
    url: 'http://localhost:3000'
  });

  await page.goto('http://localhost:3000/#hom-nay', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  // 1. Test Grammar Hub
  await page.evaluate(() => switchTab('ngu-phap'));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_view_ngu_phap.png') });
  console.log('1. Captured Grammar Hub');

  // 2. Test Grammar Theory
  const theoryRes = await page.evaluate(() => {
    if (window.GrammarEngine && typeof GrammarEngine.showTheoryView === 'function') {
      GrammarEngine.showTheoryView('noun-suffix');
      return 'CALLED';
    }
    return 'NO_GRAMMAR_ENGINE';
  });
  console.log('2. Grammar Theory Call:', theoryRes);
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_grammar_theory.png') });

  // 3. Test Grammar Practice
  const practiceRes = await page.evaluate(() => {
    if (window.GrammarEngine && typeof GrammarEngine.showPracticeView === 'function') {
      GrammarEngine.showPracticeView('noun-suffix');
      return 'CALLED';
    }
    return 'NO_GRAMMAR_ENGINE';
  });
  console.log('3. Grammar Practice Call:', practiceRes);
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_grammar_practice.png') });

  // 4. Test Reading Hub (#view-doc)
  await page.evaluate(() => switchTab('doc'));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_view_doc.png') });
  console.log('4. Captured Reading Hub');

  // 5. Test Listening Hub (#view-nghe)
  await page.evaluate(() => switchTab('nghe'));
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_view_nghe.png') });
  console.log('5. Captured Listening Hub');

  // 6. Test Vocab Study View
  const vocabStudyRes = await page.evaluate(() => {
    if (window.VocabularyEngine && typeof VocabularyEngine.showStudyView === 'function') {
      VocabularyEngine.showStudyView('contracts');
      return 'CALLED';
    }
    return 'NO_VOCAB_ENGINE';
  });
  console.log('6. Vocab Study Call:', vocabStudyRes);
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_vocab_study.png') });

  // 7. Test Vocab Match Arena
  const vocabMatchRes = await page.evaluate(() => {
    if (window.VocabularyEngine && typeof VocabularyEngine.showMatchView === 'function') {
      VocabularyEngine.showMatchView();
      return 'CALLED';
    }
    return 'NO_VOCAB_ENGINE';
  });
  console.log('7. Vocab Match Call:', vocabMatchRes);
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'test_vocab_match.png') });

  await browser.close();
  console.log('TEST COMPLETED SUCCESSFULLY!');
}

testPracticeViews().catch(console.error);
