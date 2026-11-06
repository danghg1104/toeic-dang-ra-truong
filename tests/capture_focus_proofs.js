const puppeteer = require('puppeteer-core');
const path = require('path');

const delay = ms => new Promise(r => setTimeout(r, ms));
const artifactDir = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/ed360126-cbd6-4e9c-92fb-38b43251e283');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 900 });
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
        await delay(800);

        // 1. Capture Listening with Aqua Turntable
        await page.evaluate(() => { if (typeof switchTab === 'function') switchTab('nghe'); });
        await delay(600);
        await page.screenshot({ path: path.join(artifactDir, 'proof_listening_turntable.png'), clip: { x: 260, y: 70, width: 980, height: 260 } });
        console.log('✓ Saved proof_listening_turntable.png');

        // 2. Capture Bẫy đề thi with Retro Camera Sticker & Safety pin
        await page.evaluate(() => { if (typeof switchTab === 'function') switchTab('bay-de-thi'); });
        await delay(600);
        await page.screenshot({ path: path.join(artifactDir, 'proof_trap_camera_sticker.png'), clip: { x: 260, y: 70, width: 980, height: 500 } });
        console.log('✓ Saved proof_trap_camera_sticker.png');

        // 3. Switch to PvP Arena and simulate match view to capture VS badge and Logo
        await page.evaluate(() => {
            if (typeof switchTab === 'function') switchTab('pvp-arena');
            if (window.PvPArenaClient) {
                window.PvPArenaClient.renderInto('pvpArenaInlineContainer');
            }
        });
        await delay(600);
        await page.screenshot({ path: path.join(artifactDir, 'proof_pvp_arena_lobby.png'), clip: { x: 260, y: 70, width: 980, height: 600 } });
        console.log('✓ Saved proof_pvp_arena_lobby.png');

        console.log('ALL FOCUS PROOFS CAPTURED SUCCESSFULLY!');
    } finally {
        await browser.close();
    }
})();
