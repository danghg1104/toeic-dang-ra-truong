const fs = require('fs');
const path = require('path');
const puppeteer = require('c:/Users/Admin/Documents/antigravity/noble-franklin/node_modules/puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

(async () => {
    console.log('🚀 Running Comprehensive Verification for Bottom Space Fix & Performance...');
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
    await new Promise(r => setTimeout(r, 1500));

    // Authenticate
    await page.evaluate(() => {
        const user = { id: 'acc-g-1792730904332', email: 'danghg20008@gmail.com', name: 'Đăng', role: 'admin' };
        localStorage.setItem('cung_dang_session_user', JSON.stringify(user));
        window.currentUserAccount = user;
        const authModal = document.getElementById('authModal');
        if (authModal) authModal.classList.add('hidden');
        window.switchTab('take-note');
    });
    await new Promise(r => setTimeout(r, 1000));

    // 1. Measure Take Note Tab with sidebar open
    const takeNoteOpen = await page.evaluate(() => {
        return {
            scrollHeight: document.body.scrollHeight,
            innerHeight: window.innerHeight,
            ratio: document.body.scrollHeight / window.innerHeight,
            asideHeight: document.getElementById('sidebarContainer')?.getBoundingClientRect().height,
            mainHeight: document.querySelector('main')?.getBoundingClientRect().height
        };
    });
    console.log('Take Note (Sidebar Open):', takeNoteOpen);

    // 2. Measure Take Note Tab with sidebar collapsed
    await page.evaluate(() => {
        window.toggleSidebar(false);
    });
    await new Promise(r => setTimeout(r, 500));

    const takeNoteCollapsed = await page.evaluate(() => {
        return {
            scrollHeight: document.body.scrollHeight,
            innerHeight: window.innerHeight,
            ratio: document.body.scrollHeight / window.innerHeight
        };
    });
    console.log('Take Note (Sidebar Collapsed):', takeNoteCollapsed);

    // 3. Scroll to the bottom and check if any empty desert is visible
    await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });
    await new Promise(r => setTimeout(r, 500));

    const scrollY = await page.evaluate(() => window.scrollY);
    console.log('Window scrollY at bottom:', scrollY);

    // Capture screenshot of the bottom of Take Note
    const shot1 = path.join(artifactDir, 'test_fixed_bottom_take_note.png');
    await page.screenshot({ path: shot1 });
    console.log('📸 Captured:', shot1);

    // 4. Test Home Dashboard Tab
    await page.evaluate(() => {
        window.toggleSidebar(true);
        window.switchTab('hom-nay');
    });
    await new Promise(r => setTimeout(r, 1000));

    const homeStats = await page.evaluate(() => {
        return {
            scrollHeight: document.body.scrollHeight,
            innerHeight: window.innerHeight,
            ratio: document.body.scrollHeight / window.innerHeight
        };
    });
    console.log('Home Dashboard:', homeStats);

    const shot2 = path.join(artifactDir, 'test_fixed_bottom_home.png');
    await page.screenshot({ path: shot2 });
    console.log('📸 Captured:', shot2);

    await browser.close();
    console.log('🎉 Verification Complete!');
})();
