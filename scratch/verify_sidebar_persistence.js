const fs = require('fs');
const path = require('path');
const puppeteer = require('c:/Users/Admin/Documents/antigravity/noble-franklin/node_modules/puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const executablePath = fs.existsSync(chromePath) ? chromePath : edgePath;

const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

(async () => {
    console.log('🚀 Running Sidebar Persistence Verification...');
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
    });

    // 1. Check Initial State on Desktop
    const state1 = await page.evaluate(() => {
        const aside = document.getElementById('sidebarContainer');
        const reopenBtn = document.getElementById('sidebarReopenBtn');
        return {
            sidebarOpen: window.sidebarOpen,
            asideCollapsed: aside?.classList.contains('sb-collapsed'),
            asideOffsetWidth: aside?.offsetWidth,
            reopenHidden: reopenBtn?.classList.contains('hidden'),
            storage: localStorage.getItem('ui:sidebar')
        };
    });
    console.log('1. Initial Sidebar State:', state1);
    if (state1.asideCollapsed || state1.asideOffsetWidth === 0) {
        throw new Error('Sidebar should be open and pinned initially on desktop!');
    }

    // 2. Click "Ngữ pháp" tab
    console.log('2. 👉 Switching to "Ngữ pháp" tab...');
    await page.evaluate(() => {
        window.switchTab('ngu-phap');
    });
    await new Promise(r => setTimeout(r, 800));

    const state2 = await page.evaluate(() => {
        const aside = document.getElementById('sidebarContainer');
        const reopenBtn = document.getElementById('sidebarReopenBtn');
        const viewNguPhap = document.getElementById('view-ngu-phap');
        return {
            sidebarOpen: window.sidebarOpen,
            asideCollapsed: aside?.classList.contains('sb-collapsed'),
            asideOffsetWidth: aside?.offsetWidth,
            reopenHidden: reopenBtn?.classList.contains('hidden'),
            viewActive: !viewNguPhap?.classList.contains('hidden'),
            storage: localStorage.getItem('ui:sidebar')
        };
    });
    console.log('2. After switching to Ngữ pháp:', state2);
    if (state2.asideCollapsed || state2.asideOffsetWidth === 0 || !state2.reopenHidden || !state2.viewActive) {
        throw new Error('Sidebar was unexpectedly collapsed after switching to Ngữ pháp!');
    }

    const screenshotNguPhap = path.join(artifactDir, 'test_sidebar_fixed_ngu_phap.png');
    await page.screenshot({ path: screenshotNguPhap });
    console.log(`📸 Screenshot saved: ${screenshotNguPhap}`);

    // 3. Switch to "Từ vựng" tab
    console.log('3. 👉 Switching to "Từ vựng" tab...');
    await page.evaluate(() => {
        window.switchTab('tu-vung');
    });
    await new Promise(r => setTimeout(r, 800));

    const state3 = await page.evaluate(() => {
        const aside = document.getElementById('sidebarContainer');
        const reopenBtn = document.getElementById('sidebarReopenBtn');
        return {
            sidebarOpen: window.sidebarOpen,
            asideCollapsed: aside?.classList.contains('sb-collapsed'),
            asideOffsetWidth: aside?.offsetWidth,
            reopenHidden: reopenBtn?.classList.contains('hidden')
        };
    });
    console.log('3. After switching to Từ vựng:', state3);
    if (state3.asideCollapsed || state3.asideOffsetWidth === 0) {
        throw new Error('Sidebar collapsed after switching to Từ vựng!');
    }

    // 4. Switch to "Take Note" tab
    console.log('4. 👉 Switching to "Take Note" tab...');
    await page.evaluate(() => {
        window.switchTab('take-note');
    });
    await new Promise(r => setTimeout(r, 800));

    const state4 = await page.evaluate(() => {
        const aside = document.getElementById('sidebarContainer');
        const reopenBtn = document.getElementById('sidebarReopenBtn');
        return {
            sidebarOpen: window.sidebarOpen,
            asideCollapsed: aside?.classList.contains('sb-collapsed'),
            asideOffsetWidth: aside?.offsetWidth,
            reopenHidden: reopenBtn?.classList.contains('hidden')
        };
    });
    console.log('4. After switching to Take Note:', state4);
    if (state4.asideCollapsed || state4.asideOffsetWidth === 0) {
        throw new Error('Sidebar collapsed after switching to Take Note!');
    }

    // 5. Manual collapse via 3-bar button (#sidebarCollapseBtn)
    console.log('5. 👉 Testing MANUAL collapse via 3-bar button...');
    await page.click('#sidebarCollapseBtn');
    await new Promise(r => setTimeout(r, 500));

    const state5 = await page.evaluate(() => {
        const aside = document.getElementById('sidebarContainer');
        const reopenBtn = document.getElementById('sidebarReopenBtn');
        return {
            sidebarOpen: window.sidebarOpen,
            asideCollapsed: aside?.classList.contains('sb-collapsed'),
            reopenVisible: !reopenBtn?.classList.contains('hidden'),
            storage: localStorage.getItem('ui:sidebar')
        };
    });
    console.log('5. After manual collapse:', state5);
    if (!state5.asideCollapsed || !state5.reopenVisible || state5.storage !== 'closed') {
        throw new Error('Manual collapse failed!');
    }

    // 6. Manual reopen via 3-bar button (#sidebarReopenBtn)
    console.log('6. 👉 Testing MANUAL reopen via 3-bar button...');
    await page.click('#sidebarReopenBtn');
    await new Promise(r => setTimeout(r, 500));

    const state6 = await page.evaluate(() => {
        const aside = document.getElementById('sidebarContainer');
        const reopenBtn = document.getElementById('sidebarReopenBtn');
        return {
            sidebarOpen: window.sidebarOpen,
            asideCollapsed: aside?.classList.contains('sb-collapsed'),
            asideOffsetWidth: aside?.offsetWidth,
            reopenHidden: reopenBtn?.classList.contains('hidden'),
            storage: localStorage.getItem('ui:sidebar')
        };
    });
    console.log('6. After manual reopen:', state6);
    if (state6.asideCollapsed || state6.asideOffsetWidth === 0 || !state6.reopenHidden || state6.storage !== 'open') {
        throw new Error('Manual reopen failed!');
    }

    const screenshotPinnedFinal = path.join(artifactDir, 'test_fixed_sidebar_pinned.png');
    await page.screenshot({ path: screenshotPinnedFinal });
    console.log(`📸 Final Screenshot saved: ${screenshotPinnedFinal}`);

    await browser.close();
    console.log('✅ ALL TESTS PASSED: Sidebar is 100% fixed & manual toggle works perfectly!');
})();
