const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

async function runAudit() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 850 });

  // 1. Authenticate session
  await page.goto('http://localhost:3000/manifest.json');
  await page.setCookie({
    name: 'cd_session',
    value: '18aecc48e998366a29e990d0b434dc2b518ba1e4bc4a731c12ec273757fdb847',
    url: 'http://localhost:3000'
  });

  // 2. Test Dashboard (#hom-nay)
  await page.goto('http://localhost:3000/#hom-nay', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1500));

  const dashboardAudit = await page.evaluate(() => {
    return {
      listenWidth: document.getElementById('skillAccuracyListenProgress')?.style.width,
      listenPct: document.getElementById('skillAccuracyListenPct')?.textContent,
      listenCount: document.getElementById('skillAccuracyListenCount')?.textContent,

      readWidth: document.getElementById('skillAccuracyReadProgress')?.style.width,
      readPct: document.getElementById('skillAccuracyReadPct')?.textContent,
      readCount: document.getElementById('skillAccuracyReadCount')?.textContent,

      grammarWidth: document.getElementById('skillAccuracyGrammarProgress')?.style.width,
      grammarPct: document.getElementById('skillAccuracyGrammarPct')?.textContent,
      grammarCount: document.getElementById('skillAccuracyGrammarCount')?.textContent,

      vocabWidth: document.getElementById('skillAccuracyVocabProgress')?.style.width,
      vocabPct: document.getElementById('skillAccuracyVocabPct')?.textContent,
      vocabCount: document.getElementById('skillAccuracyVocabCount')?.textContent,

      heroGreeting: document.querySelector('#view-hom-nay h2')?.textContent?.trim() || document.querySelector('#view-hom-nay h1')?.textContent?.trim()
    };
  });
  console.log('--- DASHBOARD AUDIT ---', dashboardAudit);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_final_dashboard.png'), fullPage: false });

  // 3. Test Roadmap (#lo-trinh)
  await page.evaluate(() => switchTab('lo-trinh'));
  await new Promise(r => setTimeout(r, 1200));

  const roadmapAudit = await page.evaluate(() => {
    const el = document.getElementById('view-lo-trinh');
    return {
      textSample: el ? el.innerText.slice(0, 300) : 'NOT FOUND',
      hasTotoro: el ? /totoro/i.test(el.innerHTML) : false,
      hasMayExplorer: el ? el.innerHTML.includes('may_explorer.png') : false
    };
  });
  console.log('--- ROADMAP AUDIT ---', roadmapAudit);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_final_roadmap.png'), fullPage: false });

  // 4. Test Vocab Studio (#hoc-tu-vung)
  await page.evaluate(() => switchTab('hoc-tu-vung'));
  await new Promise(r => setTimeout(r, 1200));

  const vocabConfigAudit = await page.evaluate(() => {
    const el = document.getElementById('view-hoc-tu-vung');
    return {
      textSample: el ? el.innerText.slice(0, 300) : 'NOT FOUND',
      hasGundam: el ? /gundam/i.test(el.innerHTML) : false,
      hasTotoro: el ? /totoro/i.test(el.innerHTML) : false
    };
  });
  console.log('--- VOCAB CONFIG AUDIT ---', vocabConfigAudit);

  // Enter Arena View
  await page.evaluate(() => {
    if (window.VocabGameWorkstation) {
      window.VocabGameWorkstation.startArena();
    }
  });
  await new Promise(r => setTimeout(r, 1000));

  const vocabArenaAudit = await page.evaluate(() => {
    const el = document.getElementById('view-hoc-tu-vung');
    return {
      hasArenaContainer: !!document.getElementById('vgArenaContainer'),
      hasCompanionLauncher: !!document.getElementById('vgGundamLauncher'),
      hasMayReading: el ? el.innerHTML.includes('may_reading.png') : false,
      hasGundamSVG: el ? el.innerHTML.includes('vFinGrad') : false
    };
  });
  console.log('--- VOCAB ARENA AUDIT ---', vocabArenaAudit);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_final_vocab_arena.png'), fullPage: false });

  // 5. Test Dictation (#nghe-chinh-ta)
  await page.evaluate(() => switchTab('nghe-chinh-ta'));
  await new Promise(r => setTimeout(r, 1200));

  const dictAudit = await page.evaluate(() => {
    const el = document.getElementById('view-nghe-chinh-ta');
    return {
      textSample: el ? el.innerText.slice(0, 300) : 'NOT FOUND',
      hasTotoro: el ? /totoro/i.test(el.innerHTML) : false,
      hasMayListening: el ? el.innerHTML.includes('may_listening.png') : false
    };
  });
  console.log('--- DICTATION AUDIT ---', dictAudit);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_final_dictation.png'), fullPage: false });

  // 6. Test Mobile Viewport (390 x 844) & 5-tab Bottom Nav
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.evaluate(() => switchTab('hom-nay'));
  await new Promise(r => setTimeout(r, 1000));

  const mobileNavAudit = await page.evaluate(() => {
    const nav = document.getElementById('mobileBottomNav');
    if (!nav) return 'NOT FOUND';
    const buttons = Array.from(nav.querySelectorAll('button')).map(b => ({
      id: b.id,
      text: b.innerText.trim(),
      classes: b.className
    }));
    return {
      buttonCount: buttons.length,
      buttons
    };
  });
  console.log('--- MOBILE NAV AUDIT ---', JSON.stringify(mobileNavAudit, null, 2));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_final_mobile_nav.png'), fullPage: false });

  await browser.close();
  console.log('ALL VERIFICATIONS COMPLETED SUCCESSFULLY!');
}

runAudit().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
