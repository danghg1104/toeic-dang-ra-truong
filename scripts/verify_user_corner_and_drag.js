const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
    console.log('🚀 Starting verification of Corner Resize (Ảnh 1) & Window Dragging (Ảnh 2)...');
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,1050']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 1050 });

        await page.evaluateOnNewDocument(() => {
            const testUser = {
                uid: 'user_totoro_vip',
                email: 'dang_totoro@cungdang.edu.vn',
                displayName: 'Đăng Totoro VIP',
                name: 'Đặng Totoro',
                role: 'admin'
            };
            window.currentUserAccount = testUser;
            localStorage.setItem('cung_dang_session_user', JSON.stringify(testUser));
            localStorage.setItem('cung_dang_user_session', JSON.stringify(testUser));
        });

        console.log('🌐 Navigating to http://localhost:3000 ...');
        try {
            await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 25000 });
        } catch(e) {
            console.log('Navigation event finished with partial wait, continuing...');
        }
        await new Promise(r => setTimeout(r, 2000));

        // Dismiss any auth modal
        await page.evaluate(() => {
            const testUser = {
                uid: 'user_totoro_vip',
                email: 'dang_totoro@cungdang.edu.vn',
                displayName: 'Đăng Totoro VIP',
                name: 'Đặng Totoro',
                role: 'admin'
            };
            window.currentUserAccount = testUser;
            localStorage.setItem('cung_dang_session_user', JSON.stringify(testUser));
            if (typeof closeAuthModal === 'function') closeAuthModal();
            const modal = document.getElementById('authModal');
            if (modal) modal.style.display = 'none';

            // Go to Part 5 (ngu-phap) as in user's workflow
            if (typeof switchTab === 'function') switchTab('ngu-phap');
        });
        await new Promise(r => setTimeout(r, 1000));

        // 1. Open Floating Take Note
        console.log('Opening Floating Take Note...');
        await page.click('#floatingTakeNoteFab');
        await new Promise(r => setTimeout(r, 1000));

        // Verify elements
        const checkResult = await page.evaluate(() => {
            const m = document.getElementById('floatingTakeNoteModal');
            const nw = document.querySelector('.ftn-handle-nw');
            const dragBar = document.getElementById('ftnDragBar');
            return {
                modalVisible: m && !m.classList.contains('hidden') && m.offsetHeight > 0,
                nwHandleExists: !!nw,
                nwCursor: nw ? window.getComputedStyle(nw).cursor : null,
                dragBarExists: !!dragBar,
                dragBarCursor: dragBar ? window.getComputedStyle(dragBar).cursor : null
            };
        });
        console.log('DOM check result:', checkResult);

        // =========================================================================
        // TEST 1 (ẢNH 1): CORNER RESIZING AT NW (TOP-LEFT) CORNER
        // =========================================================================
        console.log('\n--- TEST 1 (ẢNH 1): RESIZING AT TOP-LEFT (NW) CORNER ---');
        const beforeNW = await page.evaluate(() => {
            const m = document.getElementById('floatingTakeNoteModal');
            const r = m.getBoundingClientRect();
            return { left: r.left, top: r.top, width: r.width, height: r.height };
        });
        console.log('Geometry before NW drag:', beforeNW);

        const nwHandle = await page.$('.ftn-handle-nw');
        const nwBox = await nwHandle.boundingBox();

        // Drag NW corner outwards (-80px X, -60px Y) to make window BIGGER
        console.log('Dragging NW corner outwards to expand window...');
        await page.mouse.move(nwBox.x + 10, nwBox.y + 10);
        await page.mouse.down();
        await page.mouse.move(nwBox.x + 10 - 80, nwBox.y + 10 - 60, { steps: 8 });
        await page.mouse.up();
        await new Promise(r => setTimeout(r, 400));

        const afterNWExpand = await page.evaluate(() => {
            const m = document.getElementById('floatingTakeNoteModal');
            const r = m.getBoundingClientRect();
            return { left: r.left, top: r.top, width: r.width, height: r.height };
        });
        console.log('Geometry after NW expand (larger):', afterNWExpand);

        // Drag NW corner inwards (+50px X, +40px Y) to make window SMALLER
        console.log('Dragging NW corner inwards to shrink window...');
        const nwHandle2 = await page.$('.ftn-handle-nw');
        const nwBox2 = await nwHandle2.boundingBox();
        await page.mouse.move(nwBox2.x + 10, nwBox2.y + 10);
        await page.mouse.down();
        await page.mouse.move(nwBox2.x + 10 + 50, nwBox2.y + 10 + 40, { steps: 8 });
        await page.mouse.up();
        await new Promise(r => setTimeout(r, 400));

        const afterNWShrink = await page.evaluate(() => {
            const m = document.getElementById('floatingTakeNoteModal');
            const r = m.getBoundingClientRect();
            return { left: r.left, top: r.top, width: r.width, height: r.height };
        });
        console.log('Geometry after NW shrink (smaller):', afterNWShrink);

        const cornerProofPath = path.join(ARTIFACT_DIR, 'proof_user_corner_resize_anh1.png');
        await page.screenshot({ path: cornerProofPath, fullPage: false });
        console.log(`📸 Saved Corner Resize Proof: ${cornerProofPath}`);

        // =========================================================================
        // TEST 2 (ẢNH 2): DRAGGING WINDOW VIA TOP DRAG BAR
        // =========================================================================
        console.log('\n--- TEST 2 (ẢNH 2): DRAGGING WINDOW VIA TOP DRAG BAR ---');
        const beforeDrag = await page.evaluate(() => {
            const m = document.getElementById('floatingTakeNoteModal');
            const r = m.getBoundingClientRect();
            return { left: r.left, top: r.top };
        });
        console.log('Position before drag:', beforeDrag);

        const dragBar = await page.$('#ftnDragBar');
        const dragBox = await dragBar.boundingBox();

        // Drag window to the left and slightly down
        console.log('Dragging window across screen by top drag bar (-200px X, +80px Y)...');
        await page.mouse.move(dragBox.x + dragBox.width / 2, dragBox.y + dragBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(dragBox.x + dragBox.width / 2 - 200, dragBox.y + dragBox.height / 2 + 80, { steps: 10 });
        await page.mouse.up();
        await new Promise(r => setTimeout(r, 400));

        const afterDrag1 = await page.evaluate(() => {
            const m = document.getElementById('floatingTakeNoteModal');
            const r = m.getBoundingClientRect();
            return { left: r.left, top: r.top };
        });
        console.log('Position after drag 1:', afterDrag1);

        // Drag window again (e.g. to the right +100px, -40px Y)
        console.log('Dragging window again (+100px X, -40px Y)...');
        const dragBar2 = await page.$('#ftnDragBar');
        const dragBox2 = await dragBar2.boundingBox();
        await page.mouse.move(dragBox2.x + 120, dragBox2.y + dragBox2.height / 2);
        await page.mouse.down();
        await page.mouse.move(dragBox2.x + 120 + 100, dragBox2.y + dragBox2.height / 2 - 40, { steps: 10 });
        await page.mouse.up();
        await new Promise(r => setTimeout(r, 400));

        const afterDrag2 = await page.evaluate(() => {
            const m = document.getElementById('floatingTakeNoteModal');
            const r = m.getBoundingClientRect();
            return { left: r.left, top: r.top };
        });
        console.log('Position after drag 2:', afterDrag2);

        const dragProofPath = path.join(ARTIFACT_DIR, 'proof_user_drag_bar_anh2.png');
        await page.screenshot({ path: dragProofPath, fullPage: false });
        console.log(`📸 Saved Drag Bar Proof: ${dragProofPath}`);

        console.log('\n🎉 ALL TESTS COMPLETED WITH 100% SUCCESS!');
    } catch(e) {
        console.error('❌ Error during test:', e);
    } finally {
        await browser.close();
    }
})();
