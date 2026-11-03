const puppeteer = require('puppeteer-core');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

(async () => {
    console.log('Testing YouTube Import Modal Flow...');
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

        // Open Import Modal
        console.log('Opening Import Modal...');
        await page.evaluate(() => {
            window.YouTubeDictationWorkstation.openImportModal();
        });
        await new Promise(r => setTimeout(r, 400));

        // Fill URL and submit
        console.log('Submitting YouTube URL: STAY...');
        await page.evaluate(() => {
            const inp = document.getElementById('ytImportInputUrl');
            if (inp) inp.value = 'https://www.youtube.com/watch?v=kTJczUoc26U';
        });

        await page.evaluate(() => {
            window.YouTubeDictationWorkstation.submitImportYouTube();
        });

        // Wait for import to complete and start song
        console.log('Waiting for song to load...');
        await new Promise(r => setTimeout(r, 3500));

        const activeInfo = await page.evaluate(() => {
            const ws = window.YouTubeDictationWorkstation;
            return {
                title: ws.activeSong ? ws.activeSong.title : null,
                artist: ws.activeSong ? ws.activeSong.artist : null,
                linesCount: ws.activeSong ? ws.activeSong.lines.length : 0,
                activeView: ws.activeView,
                vietsub: document.getElementById('ytVietsubDisplay')?.innerText || ''
            };
        });

        console.log('Imported & Loaded song:', activeInfo);

        await page.screenshot({ path: path.join(artifactDir, 'ux_05_imported_stay.png') });
        console.log('Saved screenshot ux_05_imported_stay.png');

    } catch (e) {
        console.error('Error during import flow test:', e);
    } finally {
        await browser.close();
    }
})();
