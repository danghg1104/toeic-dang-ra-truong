const fs = require('fs');
const puppeteer = require('c:/Users/Admin/Documents/antigravity/noble-franklin/node_modules/puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

(async () => {
    const browser = await puppeteer.launch({
        executablePath,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    await page.setCookie({
        name: 'cd_session',
        value: '045bd5f723d5594d813fd43698acc239a32f26e419ddd9a0a367200f498d25a9',
        domain: 'localhost',
        path: '/'
    });

    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));

    // Check tabs
    const tabs = ['hom-nay', 'take-note', 'ngu-phap', 'tu-vung', 'nghe', 'doc'];
    for (const tab of tabs) {
        await page.evaluate((t) => {
            if (typeof window.switchTab === 'function') window.switchTab(t);
        }, tab);
        await new Promise(r => setTimeout(r, 500));

        const scrollInfo = await page.evaluate(() => {
            const body = document.body;
            const doc = document.documentElement;
            const scrollHeight = Math.max(body.scrollHeight, doc.scrollHeight);
            const clientHeight = window.innerHeight;
            
            // Find elements that extend far down or have large bottom margin/padding
            const allElements = Array.from(document.querySelectorAll('*'));
            const bottoms = allElements
                .map(el => {
                    const rect = el.getBoundingClientRect();
                    const style = window.getComputedStyle(el);
                    if (style.display === 'none' || style.visibility === 'hidden') return null;
                    return {
                        tag: el.tagName,
                        id: el.id,
                        className: el.className ? (typeof el.className === 'string' ? el.className.slice(0, 50) : '') : '',
                        top: rect.top + window.scrollY,
                        bottom: rect.bottom + window.scrollY,
                        height: rect.height,
                        paddingBottom: style.paddingBottom,
                        marginBottom: style.marginBottom
                    };
                })
                .filter(Boolean)
                .sort((a, b) => b.bottom - a.bottom)
                .slice(0, 5);

            return {
                scrollHeight,
                clientHeight,
                ratio: scrollHeight / clientHeight,
                bottoms
            };
        });

        console.log(`Tab: ${tab}`, scrollInfo);
    }

    await browser.close();
})();
