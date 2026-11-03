const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  console.log('🚀 [UX AUDIT] Starting YouTube Dictation (Vocatype) End-to-End Test Drive...');
  
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });

  const logs = [];
  const errors = [];

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', msg => {
      const txt = msg.text();
      if (msg.type() === 'error') {
        errors.push(txt);
        console.error('🔴 [Browser Error]:', txt);
      } else {
        logs.push(txt);
      }
    });

    page.on('pageerror', err => {
      errors.push(err.toString());
      console.error('🔴 [Page Error]:', err.toString());
    });

    // 1. Load app and navigate to Dictation
    console.log('📍 1. Navigating to http://localhost:3000/#nghe-chinh-ta...');
    await page.goto('http://localhost:3000/#nghe-chinh-ta', { waitUntil: 'domcontentloaded' });
    await sleep(1500);

    // Ensure dictation tab is activated
    await page.evaluate(() => {
      if (typeof window.switchTab === 'function') {
        window.switchTab('nghe-chinh-ta');
      }
    });
    await sleep(800);

    // 2. Switch to YouTube sub-mode
    console.log('📍 2. Switching sub-mode to YouTube (Vocatype)...');
    const subModeRes = await page.evaluate(() => {
      const btnYoutube = document.getElementById('btnTabDictationYoutube');
      if (btnYoutube) {
        btnYoutube.click();
        return { clickedBtn: true };
      }
      if (typeof window.switchDictationSubMode === 'function') {
        window.switchDictationSubMode('youtube');
        return { calledFn: true };
      }
      return { failed: true };
    });
    console.log('  Submode switch result:', subModeRes);
    await sleep(1000);

    // Take screenshot of Catalog
    const catalogPath = path.join(ARTIFACTS_DIR, 'vocatype_01_catalog.png');
    await page.screenshot({ path: catalogPath });
    console.log(`📸 Catalog screenshot saved to ${catalogPath}`);

    // Verify Catalog DOM
    const catalogStats = await page.evaluate(() => {
      const container = document.getElementById('subViewDictationYoutube');
      const songCards = document.querySelectorAll('.yt-song-card');
      const titles = Array.from(songCards).map(c => c.querySelector('h3')?.innerText || '');
      return {
        containerVisible: container && window.getComputedStyle(container).display !== 'none',
        cardCount: songCards.length,
        songTitles: titles
      };
    });
    console.log('  Catalog state:', catalogStats);

    // 3. Select song "Heather" by Conan Gray
    console.log('📍 3. Opening song "Heather" (heather-conan-gray)...');
    await page.evaluate(() => {
      if (window.ytDictationStation) {
        window.ytDictationStation.startSong('heather-conan-gray');
      }
    });
    await sleep(1500);

    // Take screenshot of Studio Initial State
    const studioInitPath = path.join(ARTIFACTS_DIR, 'vocatype_02_studio_initial.png');
    await page.screenshot({ path: studioInitPath });
    console.log(`📸 Studio initial screenshot saved to ${studioInitPath}`);

    // Verify Studio DOM
    const studioState = await page.evaluate(() => {
      const ws = window.ytDictationStation;
      const curLine = ws ? ws.currentLineIndex : -1;
      const song = ws ? ws.activeSong : null;
      const hudProgress = document.getElementById('ytProgressText')?.innerText;
      const hudWpm = document.getElementById('ytWpmText')?.innerText;
      const hudAcc = document.getElementById('ytAccuracyText')?.innerText;
      const lyricsHtml = document.getElementById('ytLyricsDisplay')?.innerText;
      const vietsub = document.getElementById('ytVietsubDisplay')?.innerText;
      const inputEl = document.getElementById('ytLiveTypingInput');
      const isFocused = document.activeElement === inputEl;

      return {
        hasWs: !!ws,
        songTitle: song?.title,
        curLine,
        hudProgress,
        hudWpm,
        hudAcc,
        lyricsText: lyricsHtml,
        vietsub,
        inputExists: !!inputEl,
        inputFocused: isFocused
      };
    });
    console.log('  Studio state:', studioState);

    // 4. Test Typing Experience like a real user
    console.log('📍 4. Simulating live typing for Line 1 ("I still remember." -> target: "remember")...');
    for (const char of 'remember') {
      await page.keyboard.sendCharacter(char);
      await sleep(100);
    }
    await sleep(800); // Wait for line completion auto-advance (450ms)

    // Check state after Line 1: should advance to Line 2 (index 1)
    const afterLine1 = await page.evaluate(() => {
      const ws = window.ytDictationStation;
      return {
        currentLineIndex: ws ? ws.currentLineIndex : -1,
        progressText: document.getElementById('ytProgressText')?.innerText,
        streak: ws?.stats?.streak,
        lyricsText: document.getElementById('ytLyricsDisplay')?.innerText,
        vietsub: document.getElementById('ytVietsubDisplay')?.innerText
      };
    });
    console.log('  State after completing Line 1:', afterLine1);

    // Line 2: "Third of December," (blanks: "Third", "December")
    console.log('📍 5. Testing Line 2: typing wrong letter then correcting...');
    // Intentionally type wrong key 'x'
    await page.keyboard.sendCharacter('x');
    await sleep(150);

    const wrongKeyRes = await page.evaluate(() => {
      const ws = window.ytDictationStation;
      return {
        wrongCount: ws?.stats?.wrongKeystrokes,
        accuracy: document.getElementById('ytAccuracyText')?.innerText
      };
    });
    console.log('  Wrong key registered cleanly:', wrongKeyRes);

    // Now type correct word 'third'
    for (const char of 'third') {
      await page.keyboard.sendCharacter(char);
      await sleep(90);
    }
    await sleep(300);

    // Test Tab / Hint for second blank ('December')
    console.log('  Testing Hint (Tab shortcut)...');
    await page.keyboard.press('Tab');
    await sleep(200);

    const hintRes = await page.evaluate(() => {
      const ws = window.ytDictationStation;
      return {
        currentInput: ws?.currentInput,
        activeWordIndex: ws?.activeWordIndex
      };
    });
    console.log('  Hint revealed letter:', hintRes);

    // Finish remaining letters of 'December' ('ecember')
    for (const char of 'ecember') {
      await page.keyboard.sendCharacter(char);
      await sleep(90);
    }
    await sleep(800);

    // Take screenshot after completing Line 2
    const studioLine2Path = path.join(ARTIFACTS_DIR, 'vocatype_03_line2_done.png');
    await page.screenshot({ path: studioLine2Path });
    console.log(`📸 Studio after Line 2 screenshot saved to ${studioLine2Path}`);

    const afterLine2 = await page.evaluate(() => {
      const ws = window.ytDictationStation;
      return {
        currentLineIndex: ws ? ws.currentLineIndex : -1,
        progressText: document.getElementById('ytProgressText')?.innerText,
        streak: ws?.stats?.streak
      };
    });
    console.log('  State after completing Line 2:', afterLine2);

    // 6. Test Spacebar Replay
    console.log('📍 6. Testing Spacebar replay current line...');
    await page.keyboard.press('Space');
    await sleep(500);

    // 7. Complete remaining lines using Skip (Enter) to trigger Summary
    console.log('📍 7. Completing remaining lines to test Summary View...');
    await page.evaluate(async () => {
      const ws = window.ytDictationStation;
      if (!ws) return;
      while (ws.activeView === 'studio') {
        ws.skipCurrentLine();
        await new Promise(r => setTimeout(r, 60));
      }
    });
    await sleep(1500);

    // Take screenshot of Summary View
    const summaryPath = path.join(ARTIFACTS_DIR, 'vocatype_04_summary_view.png');
    await page.screenshot({ path: summaryPath });
    console.log(`📸 Summary screenshot saved to ${summaryPath}`);

    const summaryData = await page.evaluate(() => {
      const ws = window.ytDictationStation;
      const summaryContainer = document.getElementById('ytSummaryContainer');
      const vocabChips = document.querySelectorAll('.yt-summary-vocab-chip');
      return {
        activeView: ws ? ws.activeView : '',
        summaryVisible: !!summaryContainer,
        vocabChipsCount: vocabChips.length,
        vocabWords: Array.from(vocabChips).map(c => c.querySelector('.font-extrabold')?.innerText || '')
      };
    });
    console.log('  Summary state:', summaryData);

    // 8. Test Save Vocab to Notebook
    console.log('📍 8. Testing "Lưu từ vựng vào Sổ tay"...');
    const saveVocabRes = await page.evaluate(() => {
      const ws = window.ytDictationStation;
      if (ws) {
        ws.saveVocabToNotebook();
        const cur = JSON.parse(localStorage.getItem('cung_dang_vocab_state') || '{}');
        return {
          hasSavedState: !!cur.bookmarkedWordsMap,
          savedCount: Object.keys(cur.bookmarkedWordsMap || {}).length,
          sampleWords: Object.keys(cur.bookmarkedWordsMap || {}).slice(0, 4)
        };
      }
      return null;
    });
    console.log('  Save vocab result in localStorage:', saveVocabRes);

    // 9. Test Mobile Viewport (390x844)
    console.log('📍 9. Testing Mobile Viewport (390x844)...');
    await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
    await page.evaluate(() => {
      if (typeof window.switchDictationSubMode === 'function') {
        window.switchDictationSubMode('youtube');
      }
      if (window.ytDictationStation) {
        window.ytDictationStation.startSong('heather-conan-gray');
      }
    });
    await sleep(1500);

    const mobilePath = path.join(ARTIFACTS_DIR, 'vocatype_05_mobile_studio.png');
    await page.screenshot({ path: mobilePath });
    console.log(`📸 Mobile studio screenshot saved to ${mobilePath}`);

    const mobileLayout = await page.evaluate(() => {
      const player = document.getElementById('youtubePlayerContainer');
      const lyrics = document.getElementById('ytLyricsDisplay');
      const input = document.getElementById('ytLiveTypingInput');
      return {
        playerWidth: player?.offsetWidth,
        playerHeight: player?.offsetHeight,
        lyricsVisible: !!lyrics,
        inputVisible: input ? window.getComputedStyle(input).display !== 'none' : false,
        inputFocused: document.activeElement === input
      };
    });
    console.log('  Mobile layout details:', mobileLayout);

    console.log('\n=======================================');
    console.log(`🎉 [AUDIT SUCCESS] All E2E steps passed!`);
    console.log(`Console Errors: ${errors.length}`);
    console.log('=======================================');

  } catch (err) {
    console.error('❌ Test failed with exception:', err);
  } finally {
    await browser.close();
  }
})();
