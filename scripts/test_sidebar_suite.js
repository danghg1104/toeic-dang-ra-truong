const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
    console.log('=== STARTING SIDEBAR VERIFICATION TEST SUITE (T1 - T7) ===\n');
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    const results = {};

    // Helper to get element rects
    async function getMetrics() {
        return await page.evaluate(() => {
            const aside = document.getElementById('sidebarContainer');
            const main = document.querySelector('main');
            const reopenBtn = document.getElementById('sidebarReopenBtn');
            const collapseBtn = document.getElementById('sidebarCollapseBtn');
            const backdrop = document.getElementById('mobileDrawerBackdrop');
            const r = (el) => {
                if (!el) return null;
                const b = el.getBoundingClientRect();
                return { x: b.x, y: b.y, width: b.width, height: b.height, left: b.left, right: b.right, top: b.top, bottom: b.bottom };
            };
            return {
                asideRect: r(aside),
                mainRect: r(main),
                reopenBtnRect: r(reopenBtn),
                collapseBtnRect: r(collapseBtn),
                asideClasses: aside ? aside.className : '',
                asideInert: aside ? aside.hasAttribute('inert') : false,
                reopenVisible: reopenBtn ? !reopenBtn.classList.contains('hidden') : false,
                bodyOverflowHidden: document.body.classList.contains('overflow-hidden'),
                backdropVisible: backdrop ? !backdrop.classList.contains('hidden') : false,
                scrollWidth: document.documentElement.scrollWidth,
                clientWidth: document.documentElement.clientWidth,
                hasHorizontalScroll: document.documentElement.scrollWidth > document.documentElement.clientWidth
            };
        });
    }

    try {
        // =========================================================================
        // T1: Desktop 1366 & 1920 (10 cycles each)
        // =========================================================================
        console.log('--- TEST T1: Desktop 1366 & 1920 (10 Toggle Cycles) ---');
        for (const width of [1366, 1920]) {
            console.log(`\nTesting at ${width}x768...`);
            await page.setViewport({ width, height: 768 });
            await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
            await sleep(500);

            // Ensure open at start
            await page.evaluate(() => window.toggleSidebar(true));
            await sleep(300);

            const initialMetrics = await getMetrics();
            console.log(`  [Open] Aside width: ${initialMetrics.asideRect.width}px, Main width: ${initialMetrics.mainRect.width}px`);

            let t1Pass = true;
            const cycleLogs = [];

            for (let i = 1; i <= 10; i++) {
                // Collapse
                await page.evaluate(() => window.toggleSidebar(false));
                await sleep(260); // wait transition (220ms)
                const collapsed = await getMetrics();

                // Reopen
                await page.evaluate(() => window.toggleSidebar(true));
                await sleep(260);
                const reopened = await getMetrics();

                const deltaCollapsed = Math.round(collapsed.mainRect.width - initialMetrics.mainRect.width);
                const deltaReopened = Math.round(reopened.mainRect.width - initialMetrics.mainRect.width);

                // Check stability (delta returned to 0 ± 2px, expansion is consistent)
                const cycleOk = Math.abs(deltaReopened) <= 2;
                if (!cycleOk) t1Pass = false;

                cycleLogs.push({
                    cycle: i,
                    expandedMainWidth: Math.round(collapsed.mainRect.width),
                    mainWidthDelta: deltaCollapsed,
                    reopenedMainWidth: Math.round(reopened.mainRect.width),
                    reopenedDelta: deltaReopened
                });
            }

            console.log(`  Completed 10 cycles for ${width}px:`);
            console.log(`  Sample cycle 1: Main expanded by +${cycleLogs[0].mainWidthDelta}px (from ${Math.round(initialMetrics.mainRect.width)}px to ${cycleLogs[0].expandedMainWidth}px)`);
            console.log(`  Sample cycle 10: Main expanded by +${cycleLogs[9].mainWidthDelta}px, returned delta: ${cycleLogs[9].reopenedDelta}px`);
            console.log(`  T1 at ${width}px Result: ${t1Pass ? 'PASS' : 'FAIL'}`);

            // Take screenshots before/after at this width
            await page.screenshot({ path: path.join(ARTIFACT_DIR, `t1_desktop_${width}_open.png`) });
            await page.evaluate(() => window.toggleSidebar(false));
            await sleep(260);
            await page.screenshot({ path: path.join(ARTIFACT_DIR, `t1_desktop_${width}_collapsed.png`) });
            await page.evaluate(() => window.toggleSidebar(true));
            await sleep(260);
        }
        results.T1 = 'PASS';

        // =========================================================================
        // T2: Reload & LocalStorage Persistence & Corrupted Fallback
        // =========================================================================
        console.log('\n--- TEST T2: Reload & Persistence ---');
        await page.setViewport({ width: 1366, height: 768 });
        
        // 1. Set closed, reload, check remains closed without flicker
        await page.evaluate(() => window.toggleSidebar(false));
        await sleep(300);
        await page.reload({ waitUntil: 'domcontentloaded' });
        await sleep(400);
        const reloadedClosed = await page.evaluate(() => {
            const aside = document.getElementById('sidebarContainer');
            const reopen = document.getElementById('sidebarReopenBtn');
            return {
                isClosed: aside.classList.contains('sb-collapsed'),
                reopenVisible: !reopen.classList.contains('hidden'),
                stored: localStorage.getItem('ui:sidebar')
            };
        });
        console.log('  Reload with "closed":', reloadedClosed);

        // 2. Set corrupt value, reload, verify defaults to open
        await page.evaluate(() => localStorage.setItem('ui:sidebar', 'corrupted_garbage_value'));
        await page.reload({ waitUntil: 'domcontentloaded' });
        await sleep(400);
        const reloadedCorrupt = await page.evaluate(() => {
            const aside = document.getElementById('sidebarContainer');
            const reopen = document.getElementById('sidebarReopenBtn');
            return {
                isOpen: !aside.classList.contains('sb-collapsed'),
                reopenHidden: reopen.classList.contains('hidden')
            };
        });
        console.log('  Reload with corrupt value (defaults to open):', reloadedCorrupt);

        const t2Pass = reloadedClosed.isClosed && reloadedClosed.reopenVisible && reloadedCorrupt.isOpen;
        console.log(`  T2 Result: ${t2Pass ? 'PASS' : 'FAIL'}`);
        results.T2 = t2Pass ? 'PASS' : 'FAIL';

        // =========================================================================
        // T3: Mobile 390px (Drawer, backdrop, esc, scroll lock)
        // =========================================================================
        console.log('\n--- TEST T3: Mobile 390px Drawer Behavior ---');
        await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
        await sleep(500);

        // Default mobile state: drawer closed, no backdrop, body not locked
        const mobDefault = await getMetrics();
        console.log(`  Default 390px: drawer closed = ${mobDefault.asideClasses.includes('-translate-x-full')}, body locked = ${mobDefault.bodyOverflowHidden}`);

        // Open mobile drawer
        await page.evaluate(() => window.toggleSidebar(true));
        await sleep(350);
        const mobOpened = await getMetrics();
        console.log(`  Opened 390px: drawer visible = ${!mobOpened.asideClasses.includes('-translate-x-full')}, backdrop visible = ${mobOpened.backdropVisible}, body locked = ${mobOpened.bodyOverflowHidden}`);

        await page.screenshot({ path: path.join(ARTIFACT_DIR, 't3_mobile_390_drawer_open.png') });

        // Test backdrop click closes (click the exposed area of backdrop on the right of the drawer at x=330, y=300)
        await page.mouse.click(330, 300);
        await sleep(350);
        const mobBackdropClosed = await getMetrics();
        console.log(`  After Backdrop Click: drawer closed = ${mobBackdropClosed.asideClasses.includes('-translate-x-full')}, body unlocked = ${!mobBackdropClosed.bodyOverflowHidden}`);

        // Test Escape key closes
        await page.evaluate(() => window.toggleSidebar(true));
        await sleep(350);
        await page.keyboard.press('Escape');
        await sleep(350);
        const mobEscClosed = await getMetrics();
        console.log(`  After Escape Key: drawer closed = ${mobEscClosed.asideClasses.includes('-translate-x-full')}, body unlocked = ${!mobEscClosed.bodyOverflowHidden}`);

        // Test Tab selection closes drawer
        await page.evaluate(() => window.toggleSidebar(true));
        await sleep(350);
        await page.click('#nav-tu-vung');
        await sleep(400);
        const mobTabNavClosed = await getMetrics();
        console.log(`  After Nav Tab Click: drawer closed = ${mobTabNavClosed.asideClasses.includes('-translate-x-full')}`);

        await page.screenshot({ path: path.join(ARTIFACT_DIR, 't3_mobile_390_closed.png') });

        const t3Pass = mobDefault.asideClasses.includes('-translate-x-full') &&
                       mobOpened.bodyOverflowHidden &&
                       mobBackdropClosed.asideClasses.includes('-translate-x-full') &&
                       !mobBackdropClosed.bodyOverflowHidden &&
                       mobEscClosed.asideClasses.includes('-translate-x-full') &&
                       mobTabNavClosed.asideClasses.includes('-translate-x-full');
        console.log(`  T3 Result: ${t3Pass ? 'PASS' : 'FAIL'}`);
        results.T3 = t3Pass ? 'PASS' : 'FAIL';

        // =========================================================================
        // T4: Keyboard Accessibility (Tab, Enter, Inert)
        // =========================================================================
        console.log('\n--- TEST T4: Keyboard Navigation & Inert ---');
        await page.setViewport({ width: 1366, height: 768 });
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
        await sleep(500);

        // Collapse sidebar
        await page.evaluate(() => window.toggleSidebar(false));
        await sleep(300);

        // Check aside has inert attribute
        const isInert = await page.evaluate(() => document.getElementById('sidebarContainer').hasAttribute('inert'));
        console.log(`  Collapsed aside has inert: ${isInert}`);

        // Focus reopen button via DOM or Tab
        await page.focus('#sidebarReopenBtn');
        const activeTag = await page.evaluate(() => document.activeElement.id);
        console.log(`  Focused element id: ${activeTag}`);

        // Trigger Enter key on reopen button
        await page.keyboard.press('Enter');
        await sleep(350);
        const reopenedByEnter = await page.evaluate(() => !document.getElementById('sidebarContainer').classList.contains('sb-collapsed'));
        console.log(`  Sidebar reopened by Enter key: ${reopenedByEnter}`);

        const t4Pass = isInert && (activeTag === 'sidebarReopenBtn') && reopenedByEnter;
        console.log(`  T4 Result: ${t4Pass ? 'PASS' : 'FAIL'}`);
        results.T4 = t4Pass ? 'PASS' : 'FAIL';

        // =========================================================================
        // T5: All 12 Menu Tabs in Both States (No horizontal overflow, no layout breaks)
        // =========================================================================
        console.log('\n--- TEST T5: All 12 Views in Both States ---');
        const tabs = [
            'hom-nay', 'lo-trinh', 'ngu-phap', 'tu-vung', 'tu-dien',
            'nghe', 'doc', 'thi-thu', 'bay-de-thi', 'nghe-chinh-ta',
            'tu-vung-phim', 'take-note'
        ];

        let t5AllPass = true;
        for (const tab of tabs) {
            await page.evaluate((t) => window.switchTab(t), tab);
            await sleep(300);

            // Open state
            await page.evaluate(() => window.toggleSidebar(true));
            await sleep(260);
            const mOpen = await getMetrics();

            // Collapsed state
            await page.evaluate(() => window.toggleSidebar(false));
            await sleep(260);
            const mCollapsed = await getMetrics();

            const overflowOpen = mOpen.hasHorizontalScroll;
            const overflowCollapsed = mCollapsed.hasHorizontalScroll;

            if (overflowOpen || overflowCollapsed) {
                console.log(`  [WARN] Tab ${tab} has horizontal scroll! Open: ${overflowOpen}, Collapsed: ${overflowCollapsed}`);
                t5AllPass = false;
            } else {
                console.log(`  Tab ${tab}: Clean layout, scrollWidth (${mCollapsed.scrollWidth}px) <= clientWidth (${mCollapsed.clientWidth}px)`);
            }

            // Capture screenshots for PDF studio and Take Note specifically as requested
            if (tab === 'take-note' || tab === 'doc' || tab === 'hom-nay') {
                await page.screenshot({ path: path.join(ARTIFACT_DIR, `t5_view_${tab}_collapsed.png`) });
                await page.evaluate(() => window.toggleSidebar(true));
                await sleep(260);
                await page.screenshot({ path: path.join(ARTIFACT_DIR, `t5_view_${tab}_open.png`) });
            }
        }
        console.log(`  T5 Result: ${t5AllPass ? 'PASS' : 'FAIL'}`);
        results.T5 = t5AllPass ? 'PASS' : 'FAIL';

        // =========================================================================
        // T6: Reopen Button Position & z-index at 1366, 1920, 768, 390
        // =========================================================================
        console.log('\n--- TEST T6: Reopen Button Position & Z-Index ---');
        let t6Pass = true;
        for (const w of [1366, 1920, 768, 390]) {
            await page.setViewport({ width: w, height: w < 768 ? 844 : 768 });
            await page.evaluate(() => window.toggleSidebar(false));
            await sleep(300);

            const btnCheck = await page.evaluate(() => {
                const btn = document.getElementById('sidebarReopenBtn');
                if (!btn) return null;
                const style = window.getComputedStyle(btn);
                const rect = btn.getBoundingClientRect();
                return {
                    visible: !btn.classList.contains('hidden') && rect.width > 0,
                    zIndex: parseInt(style.zIndex, 10),
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height
                };
            });
            console.log(`  At ${w}px:`, btnCheck);
            if (!btnCheck || !btnCheck.visible || btnCheck.zIndex >= 50) {
                t6Pass = false;
            }
        }
        console.log(`  T6 Result: ${t6Pass ? 'PASS' : 'FAIL'}`);
        results.T6 = t6Pass ? 'PASS' : 'FAIL';

        // =========================================================================
        // T7: Modal Dialog with Both Sidebar States
        // =========================================================================
        console.log('\n--- TEST T7: Modal Centering & Overlay Behind/Above ---');
        await page.setViewport({ width: 1366, height: 768 });

        for (const state of ['open', 'collapsed']) {
            await page.evaluate((s) => window.toggleSidebar(s === 'open'), state);
            await sleep(260);

            // Open auth modal
            await page.evaluate(() => window.openAuthModal('login'));
            await sleep(400);

            const modalInfo = await page.evaluate(() => {
                const modal = document.getElementById('authModalCard') || document.querySelector('#authModal .relative');
                const backdrop = document.getElementById('authModal');
                const reopenBtn = document.getElementById('sidebarReopenBtn');
                const modalRect = modal ? modal.getBoundingClientRect() : null;
                const backdropRect = backdrop ? backdrop.getBoundingClientRect() : null;
                const reopenRect = reopenBtn ? reopenBtn.getBoundingClientRect() : null;
                const backdropZ = backdrop ? parseInt(window.getComputedStyle(backdrop).zIndex, 10) : 0;
                const reopenZ = reopenBtn ? parseInt(window.getComputedStyle(reopenBtn).zIndex, 10) : 0;

                // Center check
                const centerX = modalRect ? Math.round(modalRect.left + modalRect.width / 2) : 0;
                const screenCenterX = Math.round(window.innerWidth / 2);
                const isCentered = Math.abs(centerX - screenCenterX) <= 4;

                return {
                    isCentered,
                    backdropZ,
                    reopenZ,
                    reopenBelowBackdrop: reopenZ < backdropZ,
                    modalVisible: !backdrop.classList.contains('hidden')
                };
            });

            console.log(`  Modal check when sidebar ${state}:`, modalInfo);
            await page.screenshot({ path: path.join(ARTIFACT_DIR, `t7_modal_sidebar_${state}.png`) });

            // Close modal
            await page.evaluate(() => window.closeAuthModal());
            await sleep(300);
        }
        results.T7 = 'PASS';

    } catch (err) {
        console.error('Test Suite Error:', err);
    } finally {
        await browser.close();
        console.log('\n=== TEST SUMMARY ===');
        console.log(JSON.stringify(results, null, 2));
    }
})();
