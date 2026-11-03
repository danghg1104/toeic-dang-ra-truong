const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

(async () => {
    console.log('🚀 Testing Rewind Sync & Wide Studio UI/UX...');
    const browser = await puppeteer.launch({
        executablePath: EDGE_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 });

    try {
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

        // Navigate to YouTube Dictation
        await page.evaluate(() => {
            if (typeof window.switchTab === 'function') window.switchTab('nghe-chinh-ta');
            if (typeof window.switchDictationSubMode === 'function') window.switchDictationSubMode('youtube');
        });
        await new Promise(r => setTimeout(r, 600));

        // Start Until I Found You
        console.log('1. Starting Until I Found You...');
        await page.evaluate(() => {
            window.YouTubeDictationWorkstation.startSong('until-i-found-you');
        });
        await new Promise(r => setTimeout(r, 1200));

        // Collapse Sidebar to match user screenshot 2
        await page.evaluate(() => {
            const toggleBtn = document.querySelector('button[onclick*="toggleSidebar"]');
            if (toggleBtn) toggleBtn.click();
            const sidebar = document.getElementById('appSidebar');
            if (sidebar) sidebar.classList.add('-translate-x-full');
        });
        await new Promise(r => setTimeout(r, 400));

        // Jump to sentence 4 (like in user screenshot)
        console.log('2. Jumping to sentence 4 (index 3: "I\'ll never let you go again")...');
        await page.evaluate(() => {
            window.YouTubeDictationWorkstation.jumpToLine(3);
        });
        await new Promise(r => setTimeout(r, 600));

        const stateAtLine4 = await page.evaluate(() => {
            const ws = window.YouTubeDictationWorkstation;
            return {
                currentIndex: ws.currentLineIndex,
                lineText: ws.activeSong.lines[ws.currentLineIndex]?.text,
                vietsub: document.getElementById('ytVietsubDisplay')?.innerText
            };
        });
        console.log('✓ State at sentence 4:', stateAtLine4);

        // 3. NOW TEST REWINDING (TUA LẠI) TO 0:12 (12 seconds)
        console.log('3. Rewinding video to 12.0s (0:12 - "Georgia, wrap me up in all your")...');
        await page.evaluate(() => {
            const ws = window.YouTubeDictationWorkstation;
            // Giả lập player time nhảy về 12.0s
            if (ws.ytPlayer && typeof ws.ytPlayer.getCurrentTime === 'function') {
                ws.ytPlayer.getCurrentTime = () => 12.0;
            }
            // Kích hoạt đồng bộ thời gian tua lại
            ws.checkAndSyncTime();
        });
        await new Promise(r => setTimeout(r, 400));

        const stateAfterRewind = await page.evaluate(() => {
            const ws = window.YouTubeDictationWorkstation;
            return {
                currentIndex: ws.currentLineIndex,
                lineText: ws.activeSong.lines[ws.currentLineIndex]?.text,
                vietsub: document.getElementById('ytVietsubDisplay')?.innerText,
                dotsCount: document.querySelectorAll('.yt-sentence-dot').length
            };
        });
        console.log('✓ State AFTER REWIND to 12s:', stateAfterRewind);

        if (stateAfterRewind.currentIndex !== 3 && stateAfterRewind.lineText.includes('Georgia')) {
            console.log('✅ REWIND SYNC PASSED! Lyrics successfully jumped back to Georgia matching video!');
        } else {
            console.error('❌ Rewind sync did not jump back:', stateAfterRewind);
        }

        await page.screenshot({ path: path.join(artifactDir, 'ux_06_rewound_to_012.png') });
        console.log('Saved screenshot ux_06_rewound_to_012.png');

        // 4. Test clicking on sentence dot navigation
        console.log('4. Testing Sentence Progress Dot Navigation (Click dot 9: "Georgia, pulled me in")...');
        await page.evaluate(() => {
            window.YouTubeDictationWorkstation.jumpToLine(9);
        });
        await new Promise(r => setTimeout(r, 500));

        const stateAfterDotClick = await page.evaluate(() => {
            const ws = window.YouTubeDictationWorkstation;
            const activeDot = document.querySelectorAll('.yt-sentence-dot')[ws.currentLineIndex];
            return {
                currentIndex: ws.currentLineIndex,
                lineText: ws.activeSong.lines[ws.currentLineIndex]?.text,
                dotClasses: activeDot?.className
            };
        });
        console.log('✓ State after dot click:', stateAfterDotClick);

        await page.screenshot({ path: path.join(artifactDir, 'ux_07_sentence_nav_active.png') });
        console.log('Saved screenshot ux_07_sentence_nav_active.png');

        // Check overall dimensions and ergonomics
        const dimensions = await page.evaluate(() => {
            const player = document.getElementById('youtubePlayerContainer');
            const pRect = player?.parentElement?.getBoundingClientRect();
            const input = document.getElementById('ytLiveTypingInput');
            const inRect = input?.getBoundingClientRect();
            const canvas = document.getElementById('ytSilkWaveCanvas');
            const cRect = canvas?.getBoundingClientRect();

            return {
                videoWidth: Math.round(pRect?.width || 0),
                videoHeight: Math.round(pRect?.height || 0),
                silkWaveWidth: Math.round(cRect?.width || 0),
                inputBottom: Math.round(inRect?.bottom || 0),
                windowHeight: window.innerHeight
            };
        });
        console.log('✓ Studio Dimensions & Balance:', dimensions);

        await page.screenshot({ path: path.join(artifactDir, 'ux_08_wide_studio_overview.png') });
        console.log('Saved screenshot ux_08_wide_studio_overview.png');

    } catch (e) {
        console.error('Error during test:', e);
    } finally {
        await browser.close();
    }
})();
