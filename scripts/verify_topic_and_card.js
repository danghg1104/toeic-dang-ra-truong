const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function run() {
  console.log('🚀 Khởi chạy Chrome kiểm tra Topic & Khung ô chữ rơi...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,1000']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1000 });

  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Vocab') || text.includes('CEFR') || text.includes('Error')) {
      console.log('BROWSER_LOG:', text);
    }
  });

  console.log('🌐 Truy cập http://127.0.0.1:3000/ ...');
  await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForFunction(() => typeof window.switchTab === 'function', { timeout: 15000 });

  // 1. Chuyển sang tab Học từ vựng & đóng auth modal
  console.log('📌 Chuyển sang tab Học từ vựng...');
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

  // 2. Kiểm tra các nút trình độ CEFR: hiển thị đầy đủ (Sơ cấp), (Cơ bản), (Trung cấp), (Trung cao cấp), (Cao cấp), (Thành thạo)
  console.log('🔍 Kiểm tra nhãn nút trình độ CEFR...');
  const cefrLabels = await page.evaluate(() => {
    const container = document.getElementById('view-hoc-tu-vung');
    const buttons = container ? Array.from(container.querySelectorAll('button[onclick*="selectLevel"]')) : [];
    return buttons.map(b => b.innerText.replace(/\n/g, ' '));
  });
  console.log('CEFR Buttons Text:', cefrLabels);

  // 3. Chọn chủ đề Công nghệ và trình độ A1
  console.log('💻 Chọn chủ đề Công nghệ và trình độ A1...');
  await page.evaluate(() => {
    if (window.VocabGameWorkstation) {
      window.VocabGameWorkstation.selectTopic('Công nghệ');
      window.VocabGameWorkstation.selectLevel('A1');
      window.VocabGameWorkstation.selectCount(10);
    }
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({
    path: path.join(artifactDir, 'proof_config_tech_a1_full_cefr.png'),
    fullPage: false
  });
  console.log('📸 Đã chụp ảnh màn hình cấu hình:', 'proof_config_tech_a1_full_cefr.png');

  // 4. Nhấp nút "Tạo bộ từ & Học ngay"
  console.log('⚡ Nhấp nút "Tạo bộ từ & Học ngay"...');
  await page.evaluate(() => {
    const btn = document.getElementById('vgGenerateBtn');
    if (btn) btn.click();
    else if (window.VocabGameWorkstation) window.VocabGameWorkstation.generateVocab(true);
  });

  // Chờ xem trước bộ từ
  await new Promise(r => setTimeout(r, 1200));

  // Kiểm tra danh sách từ trả về
  const previewWords = await page.evaluate(() => {
    if (window.VocabGameWorkstation && window.VocabGameWorkstation.wordList) {
      return window.VocabGameWorkstation.wordList.map(w => ({
        word: w.word,
        meaning: w.meaning,
        level: w.level
      }));
    }
    return [];
  });
  console.log('Preview Words count:', previewWords.length);
  console.log('Sample words:', previewWords.slice(0, 5));

  await page.screenshot({
    path: path.join(artifactDir, 'proof_preview_tech_a1_words.png'),
    fullPage: false
  });
  console.log('📸 Đã chụp ảnh preview từ vựng Công nghệ A1:', 'proof_preview_tech_a1_words.png');

  // 5. Bắt đầu màn chơi ngay
  console.log('🎮 Bắt đầu màn chơi Gundam Arena...');
  await page.evaluate(() => {
    if (window.VocabGameWorkstation) {
      window.VocabGameWorkstation.startArena();
    }
  });
  await new Promise(r => setTimeout(r, 800));

  // 6. Kiểm tra khung thẻ từ rơi #vgFallingCard:
  // - Không có dòng #vgCardPhonetic
  // - Duy nhất 1 hàng chữ cái đầu và các dấu _
  // - Padding 6px 12px, border-radius 8px, viền 1.5px dashed #f59e0b
  // - Font-size 15px, font-weight 600
  // - Loa 18px x 18px
  const cardInspection = await page.evaluate(() => {
    const card = document.getElementById('vgFallingCard');
    const letters = document.getElementById('vgLettersDisplay');
    const phonetic = document.getElementById('vgCardPhonetic');
    const speaker = card ? card.querySelector('div[onclick*="speakWord"]') : null;
    const currentWord = window.VocabGameWorkstation ? window.VocabGameWorkstation.currentWord : null;

    let speakerW = speaker ? speaker.offsetWidth : 0;
    let speakerH = speaker ? speaker.offsetHeight : 0;
    let cardRect = card ? card.getBoundingClientRect() : null;
    let cardStyle = card ? window.getComputedStyle(card) : null;
    let firstLetterEl = letters ? letters.querySelector('span') : null;
    let firstLetterStyle = firstLetterEl ? window.getComputedStyle(firstLetterEl) : null;

    return {
      hasPhoneticTag: !!phonetic,
      currentWord: currentWord ? currentWord.word : null,
      cardWidth: card ? card.style.width : null,
      cardHeight: card ? card.style.height : null,
      cardPadding: card ? card.style.padding : null,
      cardBorder: card ? card.style.border : null,
      cardBorderRadius: card ? card.style.borderRadius : null,
      speakerSize: `${speakerW}px x ${speakerH}px`,
      letterFontSize: firstLetterStyle ? firstLetterStyle.fontSize : null,
      letterFontWeight: firstLetterStyle ? firstLetterStyle.fontWeight : null,
      slotCount: letters ? letters.children.length : 0
    };
  });
  console.log('Card Inspection Results:', cardInspection);

  await page.screenshot({
    path: path.join(artifactDir, 'proof_compact_falling_card_arena.png'),
    fullPage: false
  });
  console.log('📸 Đã chụp ảnh đấu trường với khung thẻ từ thu nhỏ gọn gàng:', 'proof_compact_falling_card_arena.png');

  // 7. Thử gõ ký tự đúng và gõ ký tự sai để kiểm tra cố định kích thước khung
  console.log('⌨️ Thử gõ 1 ký tự sai để kiểm tra gợi ý đỏ...');
  await page.keyboard.press('KeyZ');
  await new Promise(r => setTimeout(r, 400));

  const afterMistakeInspection = await page.evaluate(() => {
    const card = document.getElementById('vgFallingCard');
    return {
      width: card ? card.style.width : null,
      isMistake: window.VocabGameWorkstation ? window.VocabGameWorkstation.isMistake : null,
      hint: window.VocabGameWorkstation ? window.VocabGameWorkstation.mistakeHint : null
    };
  });
  console.log('After Mistake Inspection:', afterMistakeInspection);

  await page.screenshot({
    path: path.join(artifactDir, 'proof_card_mistake_hint.png'),
    fullPage: false
  });
  console.log('📸 Đã chụp ảnh khi gõ sai có gợi ý ký tự đỏ:', 'proof_card_mistake_hint.png');

  // Gõ ký tự đúng
  console.log('⌨️ Gõ ký tự đúng tiếp theo...');
  if (cardInspection.currentWord && cardInspection.currentWord.length > 1) {
    const nextChar = cardInspection.currentWord[1].toUpperCase();
    await page.keyboard.press(`Key${nextChar}`);
    await new Promise(r => setTimeout(r, 400));
  }

  const afterCorrectInspection = await page.evaluate(() => {
    const card = document.getElementById('vgFallingCard');
    return {
      width: card ? card.style.width : null,
      typedLetters: window.VocabGameWorkstation ? window.VocabGameWorkstation.typedLetters : null
    };
  });
  console.log('After Correct Inspection:', afterCorrectInspection);

  await page.screenshot({
    path: path.join(artifactDir, 'proof_card_typing_fixed_width.png'),
    fullPage: false
  });
  console.log('📸 Đã chụp ảnh khi gõ đúng chiều rộng khung cố định:', 'proof_card_typing_fixed_width.png');

  await browser.close();
  console.log('✅ Hoàn thành toàn bộ kiểm tra Puppeteer!');
}

run().catch(err => {
  console.error('Lỗi kiểm tra:', err);
  process.exit(1);
});
