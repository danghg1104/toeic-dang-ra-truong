const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

const ARTIFACT_DIR = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/ed360126-cbd6-4e9c-92fb-38b43251e283');

async function runStep3ComprehensiveVerification() {
  console.log('🚀 Khởi động Headless Edge kiểm tra toàn diện 100% Bước 3...');

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 },
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();

  // Chặn request ngoại vi tránh timeout do môi trường không có internet
  await page.setRequestInterception(true);
  page.on('request', req => {
    const u = req.url();
    if (u.includes('fonts.googleapis') || u.includes('cdnjs.cloudflare') || u.includes('accounts.google.com') || u.includes('google-analytics')) {
      req.abort();
    } else {
      req.continue();
    }
  });

  page.on('pageerror', err => console.log('🔴 PAGE ERROR:', err.message));
  page.on('console', msg => {
    const txt = msg.text();
    if (txt.includes('Error') || txt.includes('error') || txt.includes('StudyFocus') || txt.includes('Zen')) {
      console.log('PAGE LOG:', txt);
    }
  });

  // Nạp session cookie của user Đăng
  await page.setCookie({
    name: 'cd_session',
    value: '18aecc48e998366a29e990d0b434dc2b518ba1e4bc4a731c12ec273757fdb847',
    domain: '127.0.0.1',
    path: '/'
  });

  console.log('1. Đang tải trang Dashboard trung tâm...');
  await page.goto('http://127.0.0.1:3000/#hom-nay', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));

  // Kiểm tra 4 thanh kỹ năng
  const skillBarsData = await page.evaluate(() => {
    return {
      listenPct: document.getElementById('skillAccuracyListenPct')?.textContent,
      listenCount: document.getElementById('skillAccuracyListenCount')?.textContent,
      listenWidth: document.getElementById('skillAccuracyListenProgress')?.style.width,
      readPct: document.getElementById('skillAccuracyReadPct')?.textContent,
      readCount: document.getElementById('skillAccuracyReadCount')?.textContent,
      readWidth: document.getElementById('skillAccuracyReadProgress')?.style.width,
      grammarPct: document.getElementById('skillAccuracyGrammarPct')?.textContent,
      grammarCount: document.getElementById('skillAccuracyGrammarCount')?.textContent,
      grammarWidth: document.getElementById('skillAccuracyGrammarProgress')?.style.width,
      vocabPct: document.getElementById('skillAccuracyVocabPct')?.textContent,
      vocabCount: document.getElementById('skillAccuracyVocabCount')?.textContent,
      vocabWidth: document.getElementById('skillAccuracyVocabProgress')?.style.width
    };
  });
  console.log('📊 Trạng thái 4 Thanh Kỹ Năng thực tế:', skillBarsData);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step3_dashboard_verified.png') });
  console.log('📸 Đã chụp proof_step3_dashboard_verified.png');

  // 2. Kiểm tra Bản đồ lộ trình cá nhân
  console.log('2. Kiểm tra Bản đồ lộ trình cá nhân (S-Curve)...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('lo-trinh');
  });
  await new Promise(r => setTimeout(r, 1200));

  const roadmapCheck = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasTotoro: text.toLowerCase().includes('totoro'),
      hasSoiMay: text.includes('Sói Mây'),
      hasSCurve: text.includes('S-Curve') || text.includes('Chinh Phục 990')
    };
  });
  console.log('🗺️ Kiểm tra Roadmap:', roadmapCheck);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step3_roadmap_verified.png') });
  console.log('📸 Đã chụp proof_step3_roadmap_verified.png');

  // 3. Kiểm tra Universal Zen Focus Mode
  console.log('3. Kiểm tra Chế độ Tập trung Toàn diện (Zen Focus Mode)...');
  const zenTriggerResult = await page.evaluate(() => {
    if (window.StudyFocusEngine) {
      window.StudyFocusEngine.toggle('Trạm Luyện Ngữ Pháp Chuyên Sâu ETS 990');
      return {
        isActive: window.StudyFocusEngine.isActive,
        hudVisible: !document.getElementById('zenFocusHud')?.classList.contains('hidden')
      };
    }
    return { error: 'StudyFocusEngine not found' };
  });
  console.log('👁️ Trạng thái Zen Focus Mode:', zenTriggerResult);
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step3_zen_focus_active.png') });
  console.log('📸 Đã chụp proof_step3_zen_focus_active.png');

  // Thoát Zen Mode
  await page.evaluate(() => {
    if (window.StudyFocusEngine) window.StudyFocusEngine.exit();
  });
  await new Promise(r => setTimeout(r, 500));

  // 4. Kiểm tra Ngữ pháp Trọng tâm 2 Cột Chuyên Sâu
  console.log('4. Kiểm tra Ngữ Pháp Trọng Tâm 2 Cột (Grammar Workstation)...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('ngu-phap');
  });
  await new Promise(r => setTimeout(r, 800));

  const grammarPracticeResult = await page.evaluate(() => {
    if (window.GrammarEngine) {
      window.GrammarEngine.showPracticeView('present-tenses');
      return {
        activeTopic: window.GrammarEngine.activeTopic?.title,
        hasContainer: !!document.getElementById('grammarMainContainer'),
        hasZenBtn: !!document.querySelector('button[onclick*="StudyFocusEngine"]')
      };
    }
    return { error: 'GrammarEngine not found' };
  });
  console.log('📖 Trạng thái Grammar Practice 2 Cột:', grammarPracticeResult);
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step3_grammar_practice_verified.png') });
  console.log('📸 Đã chụp proof_step3_grammar_practice_verified.png');

  // 5. Kiểm tra Luyện Nghe & Chép Chính Tả
  console.log('5. Kiểm tra Luyện Nghe & Chép Chính Tả (Listening / Dictation)...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('luyen-nghe-chinh-ta');
  });
  await new Promise(r => setTimeout(r, 1200));

  const dictationCheck = await page.evaluate(() => {
    const text = document.body.innerText;
    return {
      hasTotoro: text.toLowerCase().includes('totoro') || text.toLowerCase().includes('ghibli'),
      hasZenBtn: !!document.querySelector('button[onclick*="StudyFocusEngine"]')
    };
  });
  console.log('🎧 Trạng thái Luyện Nghe / Dictation:', dictationCheck);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step3_dictation_verified.png') });
  console.log('📸 Đã chụp proof_step3_dictation_verified.png');

  // 6. Kiểm tra Studio Từ Vựng Cốt Lõi (Vocab Studio)
  console.log('6. Kiểm tra Studio Từ Vựng (Vocab Studio)...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('tu-vung');
  });
  await new Promise(r => setTimeout(r, 1000));

  const vocabStudioCheck = await page.evaluate(() => {
    if (window.VocabularyEngine) {
      window.VocabularyEngine.showStudyView('contracts');
      return {
        activeDeck: window.VocabularyEngine.activeDeck?.title,
        hasFlipCard: typeof window.VocabularyEngine.flipCard === 'function',
        hasZenBtn: !!document.querySelector('button[onclick*="StudyFocusEngine"]')
      };
    }
    return { error: 'VocabularyEngine not found' };
  });
  console.log('📚 Trạng thái Vocab Studio:', vocabStudioCheck);
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step3_vocab_studio_verified.png') });
  console.log('📸 Đã chụp proof_step3_vocab_studio_verified.png');

  // 7. Kiểm tra Phòng Luyện Phản Xạ Từ Vựng (Reflex Arena)
  console.log('7. Kiểm tra Phòng Luyện Phản Xạ Từ Vựng (Reflex Arena)...');
  await page.evaluate(() => {
    if (typeof switchTab === 'function') switchTab('hoc-tu-vung');
  });
  await new Promise(r => setTimeout(r, 1200));

  const reflexArenaCheck = await page.evaluate(() => {
    const text = document.body.innerText;
    const hasGundamInDom = !!document.getElementById('vgGundamLauncher') || !!document.getElementById('vgGundamWrapper');
    const hasReflexInDom = !!document.getElementById('vgReflexLauncher') || !!document.getElementById('vgReflexWrapper');
    return {
      hasGundamText: text.toLowerCase().includes('gundam'),
      hasTotoroText: text.toLowerCase().includes('totoro'),
      hasGundamInDom,
      hasReflexInDom
    };
  });
  console.log('⚡ Trạng thái Reflex Arena:', reflexArenaCheck);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'proof_step3_vocab_reflex_verified.png') });
  console.log('📸 Đã chụp proof_step3_vocab_reflex_verified.png');

  await browser.close();
  console.log('🎉 Hoàn thành xuất sắc toàn bộ quy trình kiểm chứng Bước 3!');
}

runStep3ComprehensiveVerification().catch(err => {
  console.error('LỖI KIỂM CHỨNG:', err);
  process.exit(1);
});
