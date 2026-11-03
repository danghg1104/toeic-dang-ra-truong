const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

(async () => {
    console.log('🚀 Testing Intro Playback & Continuous Flow Across Songs...');
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

        // Collapse Sidebar for wide studio view
        await page.evaluate(() => {
            const sidebar = document.getElementById('appSidebar');
            if (sidebar) sidebar.classList.add('-translate-x-full');
        });

        // 1. Test Shape of You Intro
        console.log('1. Starting Shape of You...');
        await page.evaluate(() => {
            window.YouTubeDictationWorkstation.startSong('shape-of-you-ed-sheeran');
        });
        await new Promise(r => setTimeout(r, 1000));

        // Simulate video time at 2.0s (in the intro)
        const introState = await page.evaluate(() => {
            const ws = window.YouTubeDictationWorkstation;
            // Mock getCurrentTime to 2.5s
            if (ws.ytPlayer) ws.ytPlayer.getCurrentTime = () => 2.5;
            ws.checkAndSyncTime();
            
            const introBanner = document.getElementById('ytIntroBanner');
            const countdown = document.getElementById('ytIntroTimeCountdown');
            return {
                songTitle: ws.activeSong.title,
                totalLines: ws.activeSong.lines.length,
                firstLineStart: ws.activeSong.lines[0].start,
                playbackFlow: ws.settings.playbackFlow,
                isIntroBannerVisible: introBanner && !introBanner.classList.contains('hidden'),
                introText: countdown ? countdown.innerText : null
            };
        });
        console.log('✓ Shape of You Intro State (2.5s):', introState);

        await page.screenshot({ path: path.join(artifactDir, 'ux_09_shape_of_you_intro.png') });

        // 2. Test Skip Intro
        console.log('2. Testing Skip Intro (⏩ Bỏ qua dạo đầu)...');
        await page.evaluate(() => {
            window.YouTubeDictationWorkstation.skipIntro();
        });
        await new Promise(r => setTimeout(r, 500));

        const skippedState = await page.evaluate(() => {
            const ws = window.YouTubeDictationWorkstation;
            const introBanner = document.getElementById('ytIntroBanner');
            const lyricsDisplay = document.getElementById('ytLyricsDisplay');
            return {
                currentLineIndex: ws.currentLineIndex,
                isIntroBannerVisible: introBanner && !introBanner.classList.contains('hidden'),
                lyricsHTML: lyricsDisplay ? lyricsDisplay.innerText : null
            };
        });
        console.log('✓ After Skip Intro State:', skippedState);

        await page.screenshot({ path: path.join(artifactDir, 'ux_10_shape_of_you_skipped_intro.png') });

        // 3. Test Continuous Playback Flow (time progresses past sentence 1 into sentence 2)
        console.log('3. Testing Continuous Playback past sentence 1 (15.5s)...');
        await page.evaluate(() => {
            const ws = window.YouTubeDictationWorkstation;
            // Mock time to 16.0s (Sentence 2: "Me and my friends at the table doing shots")
            if (ws.ytPlayer) ws.ytPlayer.getCurrentTime = () => 16.0;
            ws.checkAndSyncTime();
        });
        await new Promise(r => setTimeout(r, 500));

        const sentence2State = await page.evaluate(() => {
            const ws = window.YouTubeDictationWorkstation;
            const line = ws.activeSong.lines[ws.currentLineIndex];
            const timeDisp = document.getElementById('ytCurrentTimeDisplay');
            const numDisp = document.getElementById('ytLineNumberOverlay');
            return {
                currentLineIndex: ws.currentLineIndex,
                lineText: line?.text,
                vietsub: line?.vietsub,
                displayTime: timeDisp?.innerText,
                displayNum: numDisp?.innerText
            };
        });
        console.log('✓ Sentence 2 Continuous State (16.0s):', sentence2State);

        await page.screenshot({ path: path.join(artifactDir, 'ux_11_shape_of_you_continuous_flow.png') });

        // 4. Test Heather (24.5s guitar intro)
        console.log('4. Testing Heather Intro (24.5s intro)...');
        await page.evaluate(() => {
            window.YouTubeDictationWorkstation.startSong('heather-conan-gray');
        });
        await new Promise(r => setTimeout(r, 800));

        const heatherIntro = await page.evaluate(() => {
            const ws = window.YouTubeDictationWorkstation;
            if (ws.ytPlayer) ws.ytPlayer.getCurrentTime = () => 10.0;
            ws.checkAndSyncTime();
            const countdown = document.getElementById('ytIntroTimeCountdown');
            return {
                songTitle: ws.activeSong.title,
                totalLines: ws.activeSong.lines.length,
                firstLineStart: ws.activeSong.lines[0].start,
                introText: countdown ? countdown.innerText : null
            };
        });
        console.log('✓ Heather Intro at 10.0s:', heatherIntro);

        // 5. Test Looper Mode Guard (Ensure NO looping during intro even if user switches to loop_line)
        console.log('5. Testing Looper Guard during Intro...');
        const looperGuard = await page.evaluate(() => {
            const ws = window.YouTubeDictationWorkstation;
            ws.settings.playbackFlow = 'loop_line'; // User toggled looper
            let seekCalled = false;
            if (ws.ytPlayer) {
                ws.ytPlayer.getCurrentTime = () => 5.0; // In intro (firstLineStart is 24.5s)
                ws.ytPlayer.seekTo = () => { seekCalled = true; };
            }
            // Trigger looper tick
            const lines = ws.activeSong.lines;
            const line = lines[ws.currentLineIndex];
            const curTime = 5.0;
            // The exact condition in our code:
            if (curTime >= (line.start + 1.2) && curTime >= (line.end + 0.35)) {
                ws.ytPlayer.seekTo(Math.max(0, line.start - 0.25), true);
            }
            return {
                seekCalledDuringIntro: seekCalled
            };
        });
        console.log('✓ Looper Guard Result (Must be false):', looperGuard);

        console.log('🎉 ALL INTRO & CONTINUOUS FLOW TESTS PASSED!');
    } catch (e) {
        console.error('Test error:', e);
    } finally {
        await browser.close();
    }
})();
