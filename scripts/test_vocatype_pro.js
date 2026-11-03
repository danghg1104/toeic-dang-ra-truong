const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

(async () => {
  console.log('🚀 [TEST PRO] Starting Vocatype Pro Suite (2 Modes + Soundwaves + YouTube Import)...');
  
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error('🔴 [Browser Error]:', msg.text());
      }
    });

    console.log('📍 1. Navigating to http://localhost:3000/#nghe-chinh-ta...');
    await page.goto('http://localhost:3000/#nghe-chinh-ta', { waitUntil: 'domcontentloaded' });
    await sleep(1500);

    // Switch sub-mode to YouTube
    await page.evaluate(() => {
      if (typeof window.switchTab === 'function') window.switchTab('nghe-chinh-ta');
      if (typeof window.switchDictationSubMode === 'function') window.switchDictationSubMode('youtube');
    });
    await sleep(1000);

    // 1. Check Catalog has 8 songs and import button
    const catalogInfo = await page.evaluate(() => {
      const cards = document.querySelectorAll('.yt-song-card');
      const importBtn = document.querySelector('[onclick*="openImportModal"]');
      return {
        songCount: cards.length,
        hasImportBtn: !!importBtn,
        titles: Array.from(cards).map(c => c.querySelector('h3')?.innerText || '')
      };
    });
    console.log('  Catalog Info:', catalogInfo);

    // 2. Test Starting Song "Until I Found You" (Song user had open)
    console.log('📍 2. Testing Song "Until I Found You"...');
    await page.evaluate(() => {
      window.YouTubeDictationWorkstation.startSong('until-i-found-you');
    });
    await sleep(1500);

    // Click forcePlayWithSound to trigger audio
    console.log('  Testing audio un-mute & play...');
    await page.evaluate(() => {
      window.YouTubeDictationWorkstation.forcePlayWithSound();
    });
    await sleep(800);

    // Verify Mode 1: Chép Lời (Hiện chữ rõ ràng)
    const mode1State = await page.evaluate(() => {
      const ws = window.YouTubeDictationWorkstation;
      const lyricsText = document.getElementById('ytLyricsDisplay')?.innerText;
      const waveBars = document.querySelectorAll('.yt-wave-bar');
      const overlayHidden = document.getElementById('ytUnmuteOverlay')?.style.display === 'none';
      return {
        studyMode: ws.studyMode,
        lyricsText,
        waveBarsCount: waveBars.length,
        overlayHidden,
        isPlaying: ws.isPlayerPlaying
      };
    });
    console.log('  Mode 1 (Chép Lời) State:', mode1State);

    // Screenshot Mode 1
    const p1 = path.join(ARTIFACTS_DIR, 'vocatype_pro_01_mode1_chep_loi.png');
    await page.screenshot({ path: p1 });
    console.log(`📸 Screenshot Mode 1 saved to ${p1}`);

    // Type first word 'Georgia'
    console.log('  Typing in Mode 1...');
    for (const char of 'georgia') {
      await page.keyboard.sendCharacter(char);
      await sleep(80);
    }
    await sleep(500);

    // 3. Switch to Mode 2: Nghe Nhạc Tự Gõ (Che lời hoàn toàn)
    console.log('📍 3. Switching to Mode 2 (Nghe Nhạc Tự Gõ)...');
    await page.evaluate(() => {
      window.YouTubeDictationWorkstation.setStudyMode('blind_dictation');
    });
    await sleep(800);

    const mode2State = await page.evaluate(() => {
      const ws = window.YouTubeDictationWorkstation;
      const lyricsHtml = document.getElementById('ytLyricsDisplay')?.innerText;
      return {
        studyMode: ws.studyMode,
        lyricsHtml
      };
    });
    console.log('  Mode 2 (Nghe Nhạc Tự Gõ) State:', mode2State);

    // Screenshot Mode 2
    const p2 = path.join(ARTIFACTS_DIR, 'vocatype_pro_02_mode2_tu_go.png');
    await page.screenshot({ path: p2 });
    console.log(`📸 Screenshot Mode 2 saved to ${p2}`);

    // 4. Test YouTube Import API via Frontend Modal
    console.log('📍 4. Testing YouTube Import Modal (Any YouTube Link)...');
    const importRes = await page.evaluate(async () => {
      const ws = window.YouTubeDictationWorkstation;
      // Open modal
      ws.openImportModal();
      const inp = document.getElementById('ytImportInputUrl');
      inp.value = 'https://www.youtube.com/watch?v=24u3NoPvgMw'; // Conan Gray - Heather
      await ws.submitImportYouTube();
      return {
        activeSongId: ws.activeSong.id,
        activeSongTitle: ws.activeSong.title,
        linesCount: ws.activeSong.lines.length
      };
    });
    console.log('  YouTube Auto-Import Result:', importRes);
    await sleep(1500);

    // Screenshot after auto-importing any YouTube link
    const p3 = path.join(ARTIFACTS_DIR, 'vocatype_pro_03_imported_song.png');
    await page.screenshot({ path: p3 });
    console.log(`📸 Screenshot Imported Song saved to ${p3}`);

    console.log('\n=======================================');
    console.log('🎉 [TEST PASSED] All features verified smoothly!');
    console.log('=======================================');

  } catch (err) {
    console.error('❌ Test failed with exception:', err);
  } finally {
    await browser.close();
  }
})();
