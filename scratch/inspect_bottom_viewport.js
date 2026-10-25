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

    // Authenticate
    await page.evaluate(() => {
        const user = { id: 'acc-g-1792730904332', email: 'danghg20008@gmail.com', name: 'Đăng', role: 'admin' };
        localStorage.setItem('cung_dang_session_user', JSON.stringify(user));
        window.currentUserAccount = user;
        window.switchTab('take-note');
    });
    await new Promise(r => setTimeout(r, 1000));

    // Scroll to the very bottom
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(r => setTimeout(r, 500));

    const scrollY = await page.evaluate(() => window.scrollY);
    console.log('Scrolled to bottom, window.scrollY =', scrollY);

    await page.screenshot({ path: 'scratch/scroll_bottom_take_note.png' });
    console.log('Saved scratch/scroll_bottom_take_note.png');

    // Also check what elements are visible in viewport when scrolled to bottom
    const visibleElements = await page.evaluate(() => {
        const rects = [];
        document.querySelectorAll('body *').forEach(el => {
            const r = el.getBoundingClientRect();
            const s = window.getComputedStyle(el);
            if (s.display === 'none' || s.visibility === 'hidden' || r.width === 0 || r.height === 0) return;
            // Check if inside viewport
            if (r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth) {
                if (el.children.length === 0 || el.innerText?.trim()) {
                    rects.push({
                        tag: el.tagName,
                        id: el.id,
                        cls: typeof el.className === 'string' ? el.className.slice(0, 40) : '',
                        top: r.top,
                        bottom: r.bottom,
                        height: r.height,
                        text: (el.innerText || '').slice(0, 50).replace(/\n/g, ' ')
                    });
                }
            }
        });
        return rects;
    });

    console.log('Visible elements at bottom:', visibleElements);

    await browser.close();
})();
