const puppeteer = require('puppeteer-core');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
    console.log('🔍 Auditing Lộ Trình Cá Nhân (view-lo-trinh)...');
    const browser = await puppeteer.launch({
        executablePath: EDGE_PATH,
        headless: 'new',
        args: ['--no-sandbox']
    });
    const page = await browser.newPage();

    try {
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

        // Switch to roadmap tab
        await page.evaluate(() => {
            window.switchTab('lo-trinh');
        });
        await new Promise(r => setTimeout(r, 800));

        const state = await page.evaluate(() => {
            const container = document.getElementById('view-lo-trinh');
            const ws = window.PersonalizedRoadmapEngine;
            return {
                containerExists: !!container,
                containerHidden: container ? container.classList.contains('hidden') : null,
                htmlLength: container ? container.innerHTML.length : 0,
                daysRemaining: ws ? ws.calculateDaysRemaining() : null,
                readinessScore: ws ? ws.calculateReadinessScore() : null
            };
        });

        console.log('✓ Roadmap Rendered State:', state);
    } catch (e) {
        console.error('Roadmap error:', e);
    } finally {
        await browser.close();
    }
})();
