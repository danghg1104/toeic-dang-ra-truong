const puppeteer = require('puppeteer-core');
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const delay = ms => new Promise(r => setTimeout(r, ms));

function findChromePath() {
    const commonPaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Users\\Admin\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe'
    ];
    for (const p of commonPaths) {
        if (fs.existsSync(p)) return p;
    }
    return null;
}

(async () => {
    console.log('--- Test: Celestial Artisan Theme Integration across all sections ---');
    const chromePath = findChromePath();
    if (!chromePath) {
        console.warn('Chrome executable not found. Skipping Puppeteer test.');
        process.exit(0);
    }

    const browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1280, height: 850 });
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
        await delay(1000);

        // 1. Verify Stylesheet Loaded
        const isCssLoaded = await page.evaluate(() => {
            const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
            return links.some(l => l.href.includes('celestial-artisan-theme.css'));
        });
        assert.ok(isCssLoaded, 'celestial-artisan-theme.css must be loaded in DOM');
        console.log('✓ 1. celestial-artisan-theme.css loaded successfully.');

        // 2. Check View 1: Tổng quan (Hom Nay)
        const homNayCheck = await page.evaluate(() => {
            const headerBar = document.getElementById('sanhTopHeaderBar');
            const mascotBox = document.getElementById('heroSoiMayContainer');
            const hasTape = mascotBox ? !!mascotBox.querySelector('.artisan-washi-tape') : false;
            return {
                headerDeckled: headerBar && headerBar.classList.contains('artisan-deckled-paper'),
                mascotPolaroid: mascotBox && mascotBox.classList.contains('artisan-polaroid'),
                hasTape
            };
        });
        assert.ok(homNayCheck.headerDeckled, 'sanhTopHeaderBar must have artisan-deckled-paper');
        assert.ok(homNayCheck.mascotPolaroid, 'heroSoiMayContainer must have artisan-polaroid');
        assert.ok(homNayCheck.hasTape, 'heroSoiMayContainer must have washi tape');
        console.log('✓ 2. View Tổng quan (Hôm nay) matches Celestial Artisan specifications.');

        // 3. Check View 2: Luyện nghe & Vinyl Turntable
        await page.evaluate(() => { if (typeof switchTab === 'function') switchTab('nghe'); });
        await delay(400);
        const vinylCheck = await page.evaluate(() => {
            const disc = document.getElementById('heroListeningVinylDisc');
            const tonearm = document.getElementById('heroListeningTonearm');
            return {
                hasDisc: !!disc && disc.classList.contains('artisan-vinyl-disc'),
                hasTonearm: !!tonearm
            };
        });
        assert.ok(vinylCheck.hasDisc, 'heroListeningVinylDisc must exist and have artisan-vinyl-disc');
        assert.ok(vinylCheck.hasTonearm, 'heroListeningTonearm must exist');
        console.log('✓ 3. View Luyện nghe: Vinyl turntable disc and tonearm present.');

        // 4. Check View 3: Luyện đọc
        await page.evaluate(() => { if (typeof switchTab === 'function') switchTab('doc'); });
        await delay(400);
        const readCheck = await page.evaluate(() => {
            const banner = document.querySelector('#view-doc .banner-reading');
            const mascot = document.getElementById('readingHeroOwl');
            return {
                bannerDeckled: banner && banner.classList.contains('artisan-deckled-paper'),
                mascotPolaroid: mascot && mascot.classList.contains('artisan-polaroid')
            };
        });
        assert.ok(readCheck.bannerDeckled, 'banner-reading must have artisan-deckled-paper');
        assert.ok(readCheck.mascotPolaroid, 'readingHeroOwl must have artisan-polaroid');
        console.log('✓ 4. View Luyện đọc: Deckled paper banner and Polaroid mascot verified.');

        // 5. Check View 4: Ngữ pháp
        await page.evaluate(() => { if (typeof switchTab === 'function') switchTab('ngu-phap'); });
        await delay(400);
        const grammarCheck = await page.evaluate(() => {
            const banner = document.querySelector('#view-ngu-phap .banner-grammar');
            return banner && banner.classList.contains('artisan-sashiko-border');
        });
        assert.ok(grammarCheck, 'banner-grammar must have artisan-sashiko-border');
        console.log('✓ 5. View Ngữ pháp: Sashiko stitch border verified.');

        // 6. Check View 5: Kho từ vựng
        await page.evaluate(() => { if (typeof switchTab === 'function') switchTab('tu-vung'); });
        await delay(400);
        const vocabCheck = await page.evaluate(() => {
            const cards = document.querySelectorAll('#view-tu-vung .artisan-deckled-paper');
            return cards.length >= 3;
        });
        assert.ok(vocabCheck, 'Kho từ vựng action cards must have artisan-deckled-paper');
        console.log('✓ 6. View Kho từ vựng: 3 artisan deckled paper cards verified.');

        // 7. Check View 6: Đấu trường PvP 1v1
        await page.evaluate(() => {
            if (typeof switchTab === 'function') switchTab('pvp-arena');
            if (window.PvPArenaClient) window.PvPArenaClient.renderInto('pvpArenaInlineContainer');
        });
        await delay(500);
        const pvpCheck = await page.evaluate(() => {
            const stage = document.querySelector('#pvpArenaInlineContainer .artisan-ocean-stage');
            return !!stage;
        });
        assert.ok(pvpCheck, 'PvP Arena container must have artisan-ocean-stage');
        console.log('✓ 7. View Đấu trường 1v1: Pinterest ocean wave stage verified.');

        // 8. Check View 7: Bẫy đề thi kinh điển
        await page.evaluate(() => { if (typeof switchTab === 'function') switchTab('bay-de-thi'); });
        await delay(400);
        const trapCheck = await page.evaluate(() => {
            const leftCol = document.querySelector('#view-bay-de-thi .artisan-caro-grid');
            return !!leftCol && leftCol.classList.contains('artisan-safety-pin-badge');
        });
        assert.ok(trapCheck, 'Bẫy đề thi left column must have artisan-caro-grid and safety pin badge');
        console.log('✓ 8. View Bẫy đề thi: Investigator memo board with caro grid and pin verified.');

        // 9. Take Desktop & Mobile Screenshots of the Remixed UI
        const artifactDir = path.resolve('C:/Users/Admin/.gemini/antigravity/brain/ed360126-cbd6-4e9c-92fb-38b43251e283');
        
        // Desktop screenshot
        await page.evaluate(() => { if (typeof switchTab === 'function') switchTab('hom-nay'); });
        await delay(500);
        const desktopShotPath = path.join(artifactDir, 'remixed_hom_nay_desktop_1280.png');
        await page.screenshot({ path: desktopShotPath, fullPage: false });
        console.log(`Saved screenshot: ${desktopShotPath}`);

        // Mobile screenshot (375x667)
        await page.setViewport({ width: 375, height: 667 });
        await delay(400);
        const mobileShotPath = path.join(artifactDir, 'remixed_hom_nay_mobile_375.png');
        await page.screenshot({ path: mobileShotPath, fullPage: false });
        console.log(`Saved screenshot: ${mobileShotPath}`);

        console.log('--- ALL CELESTIAL ARTISAN THEME TESTS PASSED (100%) ---');
    } finally {
        await browser.close();
    }
})();
