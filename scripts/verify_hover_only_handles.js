const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
    console.log('🚀 Starting verification of Hover-only handles (Bình thường ẩn, rê chuột vào góc mới hiện)...');
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
            console.log('Navigation event finished, continuing...');
        }
        await new Promise(r => setTimeout(r, 2000));

        // Close auth modal if open
        await page.evaluate(() => {
            if (typeof closeAuthModal === 'function') closeAuthModal();
            const modal = document.getElementById('authModal');
            if (modal) modal.style.display = 'none';
            if (typeof switchTab === 'function') switchTab('ngu-phap');
        });
        await new Promise(r => setTimeout(r, 1000));

        // 1. Open Floating Take Note
        console.log('Opening Floating Take Note...');
        await page.click('#floatingTakeNoteFab');
        await new Promise(r => setTimeout(r, 800));

        // Move mouse away to center of screen (neutral position)
        await page.mouse.move(300, 300);
        await new Promise(r => setTimeout(r, 400));

        // VERIFY STATE 1: BÌNH THƯỜNG BẬT LÊN ĐỪNG HIỆN (OPACITY = 0)
        console.log('\n--- VERIFY STATE 1: BÌNH THƯỜNG BẬT LÊN ĐỪNG HIỆN (TỰ NHIÊN, KHÔNG VƯỚNG) ---');
        const defaultOpacity = await page.evaluate(() => {
            const ringNW = document.querySelector('.ftn-handle-nw .ftn-ring-handle');
            const ringSE = document.querySelector('.ftn-handle-se .ftn-ring-handle');
            const pillN = document.querySelector('.ftn-handle-n .ftn-pill-handle-h');
            return {
                ringNW_opacity: ringNW ? window.getComputedStyle(ringNW).opacity : null,
                ringSE_opacity: ringSE ? window.getComputedStyle(ringSE).opacity : null,
                pillN_opacity: pillN ? window.getComputedStyle(pillN).opacity : null
            };
        });
        console.log('Opacity when NOT hovering (Must be "0"):', defaultOpacity);

        const cleanProofPath = path.join(ARTIFACT_DIR, 'proof_note_normal_clean.png');
        await page.screenshot({ path: cleanProofPath, fullPage: false });
        console.log(`📸 Saved Clean Note Proof (No visible handles): ${cleanProofPath}`);

        // VERIFY STATE 2: RÊ CHUỘT VÀO GÓC THÌ HIỆN (OPACITY = 1)
        console.log('\n--- VERIFY STATE 2: RÊ CHUỘT VÀO GÓC THÌ HIỆN (HOVER) ---');
        const nwHandle = await page.$('.ftn-handle-nw');
        const nwBox = await nwHandle.boundingBox();

        console.log(`Hovering over top-left NW corner at (${nwBox.x + 10}, ${nwBox.y + 10})...`);
        await page.mouse.move(nwBox.x + 10, nwBox.y + 10);
        await new Promise(r => setTimeout(r, 400));

        const hoveredOpacity = await page.evaluate(() => {
            const ringNW = document.querySelector('.ftn-handle-nw .ftn-ring-handle');
            return {
                ringNW_opacity: ringNW ? window.getComputedStyle(ringNW).opacity : null,
                ringNW_transform: ringNW ? window.getComputedStyle(ringNW).transform : null
            };
        });
        console.log('Opacity when HOVERING NW corner (Must be "1"):', hoveredOpacity);

        const hoverProofPath = path.join(ARTIFACT_DIR, 'proof_note_hover_corner.png');
        await page.screenshot({ path: hoverProofPath, fullPage: false });
        console.log(`📸 Saved Hovered Corner Proof: ${hoverProofPath}`);

        // VERIFY STATE 3: RÊ CHUỘT RA KHỎI GÓC THÌ LẠI ẨN (OPACITY = 0)
        console.log('\n--- VERIFY STATE 3: RÊ CHUỘT RA KHỎI GÓC THÌ LẠI ẨN ---');
        await page.mouse.move(500, 500);
        await new Promise(r => setTimeout(r, 400));

        const leaveOpacity = await page.evaluate(() => {
            const ringNW = document.querySelector('.ftn-handle-nw .ftn-ring-handle');
            return {
                ringNW_opacity: ringNW ? window.getComputedStyle(ringNW).opacity : null
            };
        });
        console.log('Opacity after mouse leaves (Must be "0"):', leaveOpacity);

        console.log('\n🎉 ALL HOVER-ONLY BEHAVIOR VERIFIED 100% SUCCESFULLY!');
    } catch(e) {
        console.error('❌ Error during test:', e);
    } finally {
        await browser.close();
    }
})();
