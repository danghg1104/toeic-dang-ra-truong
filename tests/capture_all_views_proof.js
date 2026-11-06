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
        await page.setViewport({ width: 1280, height: 850 });
        await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2' });
        await delay(800);

        // 1. Capture View Hôm nay (Tổng quan)
        await page.screenshot({ path: path.join(artifactDir, 'remixed_view_hom_nay.png') });
        console.log('✓ 1. Captured remixed_view_hom_nay.png');

        // 2. Capture View Lộ trình cá nhân
        await page.evaluate(() => { if (typeof switchTab === 'function') switchTab('lo-trinh'); });
        await delay(600);
        await page.screenshot({ path: path.join(artifactDir, 'remixed_view_lo_trinh.png') });
        console.log('✓ 2. Captured remixed_view_lo_trinh.png');

        // 3. Capture View Luyện nghe
        await page.evaluate(() => { if (typeof switchTab === 'function') switchTab('nghe'); });
        await delay(600);
        await page.screenshot({ path: path.join(artifactDir, 'remixed_view_nghe.png') });
        console.log('✓ 3. Captured remixed_view_nghe.png');

        // 4. Capture View Đấu trường PvP 1v1
        await page.evaluate(() => {
            if (typeof switchTab === 'function') switchTab('pvp-arena');
            if (window.PvPArenaClient) window.PvPArenaClient.renderInto('pvpArenaInlineContainer');
        });
        await delay(600);
        await page.screenshot({ path: path.join(artifactDir, 'remixed_view_pvp_arena.png') });
        console.log('✓ 4. Captured remixed_view_pvp_arena.png');

        // 5. Mobile view Hôm nay (375x667)
        await page.setViewport({ width: 375, height: 667 });
        await page.evaluate(() => { if (typeof switchTab === 'function') switchTab('hom-nay'); });
        await delay(500);
        await page.screenshot({ path: path.join(artifactDir, 'remixed_mobile_hom_nay.png') });
        console.log('✓ 5. Captured remixed_mobile_hom_nay.png');

        console.log('ALL SCREENSHOTS CAPTURED WITH BEAUTIFUL ARTISAN THEME!');
    } finally {
        await browser.close();
    }
})();
