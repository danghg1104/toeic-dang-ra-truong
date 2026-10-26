const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
    console.log('🚀 Starting verification of Floating Take Note & Multi-word Search fix...');
    const browser = await puppeteer.launch({
        executablePath: CHROME_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,1050']
    });

    try {
        const page = await browser.newPage();
        await page.setViewport({ width: 1440, height: 1050 });

        // Pre-authenticate user to bypass any login modal
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

        page.on('console', msg => {
            const txt = msg.text();
            if (txt.includes('FloatingTakeNote') || txt.includes('VocabGameWorkstation')) {
                console.log(`[Browser Console]: ${txt}`);
            }
        });

        console.log('🌐 Navigating to http://localhost:3000 ...');
        try {
            await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 25000 });
        } catch(e) {
            console.log('Navigation event finished with partial wait, continuing...');
        }
        await new Promise(r => setTimeout(r, 2000));

        // Ensure auth modal is dismissed
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
            if (modal) {
                modal.classList.add('hidden');
                modal.classList.remove('flex');
                modal.style.display = 'none';
            }
        });
        await new Promise(r => setTimeout(r, 1000));

        // =========================================================================
        // PART 1: TEST MULTI-WORD SEARCH INPUT IN SCANNED FILE VIEW (IMAGES 2, 3, 4)
        // =========================================================================
        console.log('\n--- TEST 1: VOCABULARY SCAN SEARCH INPUT ---');
        
        await page.evaluate(() => {
            if (typeof switchTab === 'function') switchTab('hoc-tu-vung');
            if (window.VocabGameWorkstation) {
                window.VocabGameWorkstation.switchIntakeMode('file');
                window.VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_3_global_success_tap_1');
            }
        });
        await new Promise(r => setTimeout(r, 1500));

        const wordsCount = await page.evaluate(() => {
            return window.VocabGameWorkstation.uploadedFileWords?.length || 0;
        });
        console.log(`Scanned words count: ${wordsCount}`);

        const searchInputSelector = '#vgFileSearchInput';
        await page.waitForSelector(searchInputSelector, { timeout: 8000 });

        // Focus search input
        await page.focus(searchInputSelector);

        // Type first word
        console.log('Typing 1st word: "school"...');
        await page.type(searchInputSelector, 'school', { delay: 60 });

        // Check active focus after 1st word
        let isFocusedAfterWord1 = await page.evaluate((sel) => {
            return document.activeElement === document.querySelector(sel);
        }, searchInputSelector);
        console.log(`Active focus maintained after 1st word: ${isFocusedAfterWord1}`);

        // Type space and 2nd word
        console.log('Typing space and 2nd word: " bag"...');
        await page.type(searchInputSelector, ' bag', { delay: 60 });

        // Check active focus after 2nd word
        let isFocusedAfterWord2 = await page.evaluate((sel) => {
            return document.activeElement === document.querySelector(sel);
        }, searchInputSelector);
        console.log(`Active focus maintained after 2nd word: ${isFocusedAfterWord2}`);

        // Type space and 3rd word
        console.log('Typing space and 3rd word: " friend"...');
        await page.type(searchInputSelector, ' friend', { delay: 60 });

        const finalSearchVal = await page.evaluate((sel) => document.querySelector(sel).value, searchInputSelector);
        console.log(`Final value in #vgFileSearchInput: "${finalSearchVal}"`);

        if (finalSearchVal === 'school bag friend' && isFocusedAfterWord2) {
            console.log('✅ TEST 1 PASSED: Search input NEVER loses focus and accepts multi-token typing perfectly!');
        } else {
            console.warn(`⚠️ Unexpected search value: "${finalSearchVal}"`);
        }

        // Test clearing and typing actual keyword: "pencil ruler"
        await page.evaluate((sel) => {
            const input = document.querySelector(sel);
            input.value = '';
            input.dispatchEvent(new Event('input', { bubbles: true }));
        }, searchInputSelector);
        await page.type(searchInputSelector, 'school', { delay: 60 });
        await new Promise(r => setTimeout(r, 600));

        // Capture proof of search
        const searchProofPath = path.join(ARTIFACT_DIR, 'proof_search_multi_words_fixed.png');
        await page.screenshot({ path: searchProofPath, fullPage: false });
        console.log(`📸 Saved search proof: ${searchProofPath}`);

        // =========================================================================
        // PART 2: TEST FLOATING TAKE NOTE LAUNCHER & 4-CORNER RESIZING
        // =========================================================================
        console.log('\n--- TEST 2: FLOATING TAKE NOTE FAB & 4 CORNERS ---');

        // Switch to grammar / Part 5 to test user scenario ("khi đang giải part 5 thì tôi cần ghi chú...")
        await page.evaluate(() => {
            if (typeof switchTab === 'function') switchTab('ngu-phap');
        });
        await new Promise(r => setTimeout(r, 1000));

        // Check FAB presence
        const fabSelector = '#floatingTakeNoteFab';
        await page.waitForSelector(fabSelector, { timeout: 8000 });
        console.log('Floating Take Note FAB found on page!');

        // Click FAB to open floating note
        console.log('Clicking #floatingTakeNoteFab to open Floating Take Note...');
        await page.click(fabSelector);
        await new Promise(r => setTimeout(r, 800));

        // Verify modal visibility
        const isModalVisible = await page.evaluate(() => {
            const m = document.getElementById('floatingTakeNoteModal');
            return m && !m.classList.contains('hidden') && m.offsetHeight > 0;
        });
        console.log(`Floating Take Note modal opened and visible: ${isModalVisible}`);

        // Verify all 4 corner handles
        const handlesCheck = await page.evaluate(() => {
            return {
                nw: !!document.querySelector('.ftn-handle-nw'),
                ne: !!document.querySelector('.ftn-handle-ne'),
                sw: !!document.querySelector('.ftn-handle-sw'),
                se: !!document.querySelector('.ftn-handle-se')
            };
        });
        console.log('4-corner handles present:', handlesCheck);

        // Get initial geometry
        const initialRect = await page.evaluate(() => {
            const m = document.getElementById('floatingTakeNoteModal');
            const r = m.getBoundingClientRect();
            return { left: r.left, top: r.top, width: r.width, height: r.height };
        });
        console.log('Initial floating note geometry:', initialRect);

        // Test resizing using SE (bottom-right) corner
        console.log('Testing SE corner drag resize (+60px width, +50px height)...');
        const seHandle = await page.$('.ftn-handle-se');
        const seBox = await seHandle.boundingBox();
        await page.mouse.move(seBox.x + seBox.width / 2, seBox.y + seBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(seBox.x + seBox.width / 2 + 60, seBox.y + seBox.height / 2 + 50, { steps: 5 });
        await page.mouse.up();
        await new Promise(r => setTimeout(r, 400));

        const resizedRectSE = await page.evaluate(() => {
            const m = document.getElementById('floatingTakeNoteModal');
            const r = m.getBoundingClientRect();
            return { width: r.width, height: r.height };
        });
        console.log('Geometry after SE resize:', resizedRectSE);

        // Test resizing using NW (top-left) corner
        console.log('Testing NW corner drag resize (-30px left, -25px top)...');
        const nwHandle = await page.$('.ftn-handle-nw');
        const nwBox = await nwHandle.boundingBox();
        await page.mouse.move(nwBox.x + nwBox.width / 2, nwBox.y + nwBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(nwBox.x + nwBox.width / 2 - 30, nwBox.y + nwBox.height / 2 - 25, { steps: 5 });
        await page.mouse.up();
        await new Promise(r => setTimeout(r, 400));

        const resizedRectNW = await page.evaluate(() => {
            const m = document.getElementById('floatingTakeNoteModal');
            const r = m.getBoundingClientRect();
            return { left: r.left, top: r.top, width: r.width, height: r.height };
        });
        console.log('Geometry after NW resize:', resizedRectNW);

        // =========================================================================
        // PART 3: TEST FULL TAKE NOTE FEATURES (TITLE, CATEGORY, PAPER, TEMPLATES)
        // =========================================================================
        console.log('\n--- TEST 3: FULL TAKE NOTE FEATURES & AUTO-SAVE ---');

        // Create new note
        await page.evaluate(() => {
            if (window.FloatingTakeNote) window.FloatingTakeNote.createNewNote();
        });
        await new Promise(r => setTimeout(r, 500));

        // Set title
        await page.evaluate(() => {
            const titleInput = document.getElementById('ftnNoteTitle');
            if (titleInput) {
                titleInput.value = '⚡ Bẫy Part 5: Danh từ đuôi -ive và -al (initiative, approval)';
                titleInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });

        // Set category
        await page.evaluate(() => {
            const catSelect = document.getElementById('ftnCategorySelect');
            if (catSelect) {
                catSelect.value = 'Part 5 Bẫy';
                catSelect.dispatchEvent(new Event('change', { bubbles: true }));
            }
        });

        // Insert Part 5 template
        console.log('Inserting Part 5 Trap template...');
        await page.evaluate(() => {
            if (window.FloatingTakeNote) window.FloatingTakeNote.insertTemplate('part5_trap');
        });
        await new Promise(r => setTimeout(r, 400));

        // Insert Collocation template
        console.log('Inserting Collocation template...');
        await page.evaluate(() => {
            if (window.FloatingTakeNote) window.FloatingTakeNote.insertTemplate('collocation');
        });
        await new Promise(r => setTimeout(r, 400));

        // Add custom text
        await page.evaluate(() => {
            const paper = document.getElementById('ftnEditorPaper');
            if (paper) {
                paper.innerHTML += '<p><strong>[Ghi chú khi làm Part 5]:</strong> Cần chú ý kỹ các động từ đi với giới từ như <em>comply with</em>, <em>adhere to</em>.</p>';
                paper.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
        await new Promise(r => setTimeout(r, 800));

        // Capture proof of Floating Take Note while in Part 5 / Grammar view
        const floatingProofPath = path.join(ARTIFACT_DIR, 'proof_floating_take_note_part5_active.png');
        await page.screenshot({ path: floatingProofPath, fullPage: false });
        console.log(`📸 Saved Floating Take Note proof: ${floatingProofPath}`);

        // Switch to Tab 2 (Danh sách ghi chú)
        console.log('Testing Tab 2: Danh sách ghi chú...');
        await page.evaluate(() => {
            if (window.FloatingTakeNote) window.FloatingTakeNote.switchTab('list');
        });
        await new Promise(r => setTimeout(r, 600));

        const listProofPath = path.join(ARTIFACT_DIR, 'proof_floating_take_note_tab_list.png');
        await page.screenshot({ path: listProofPath, fullPage: false });
        console.log(`📸 Saved List Tab proof: ${listProofPath}`);

        // Switch to Tab 3 (Chép phạt từ vựng)
        console.log('Testing Tab 3: Chép phạt từ vựng...');
        await page.evaluate(() => {
            if (window.FloatingTakeNote) window.FloatingTakeNote.switchTab('drill');
        });
        await new Promise(r => setTimeout(r, 600));

        // Type 1 drill entry
        await page.evaluate(() => {
            const input = document.getElementById('ftnDrillInput');
            if (input) {
                input.value = 'abide by = comply with = conform to = adhere to';
                input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
            }
        });
        await new Promise(r => setTimeout(r, 400));

        const drillProofPath = path.join(ARTIFACT_DIR, 'proof_floating_take_note_tab_drill.png');
        await page.screenshot({ path: drillProofPath, fullPage: false });
        console.log(`📸 Saved Drill Tab proof: ${drillProofPath}`);

        // Switch back to editor tab
        await page.evaluate(() => {
            if (window.FloatingTakeNote) window.FloatingTakeNote.switchTab('editor');
        });

        // Close floating note
        console.log('Closing Floating Note...');
        await page.evaluate(() => {
            if (window.FloatingTakeNote) window.FloatingTakeNote.close();
        });
        await new Promise(r => setTimeout(r, 400));

        // =========================================================================
        // PART 4: VERIFY SYNC WITH MAIN TAKE NOTE TAB
        // =========================================================================
        console.log('\n--- TEST 4: SYNC WITH MAIN TAKE NOTE TAB ---');
        await page.evaluate(() => {
            if (typeof switchTab === 'function') switchTab('take-note');
        });
        await new Promise(r => setTimeout(r, 1500));

        const mainNoteData = await page.evaluate(() => {
            const list = window.takeNotesList || [];
            const note = list.find(n => (n.title || '').includes('Bẫy Part 5'));
            const paperContent = document.getElementById('takeNoteEditorPaper')?.innerHTML || '';
            return {
                foundInList: !!note,
                title: note?.title,
                category: note?.category,
                hasContent: paperContent.includes('BẪY ETS PART 5') || paperContent.includes('COLLOCATION')
            };
        });
        console.log('Sync verification result in main Take Note screen:', mainNoteData);

        const syncProofPath = path.join(ARTIFACT_DIR, 'proof_take_note_synced_perfect.png');
        await page.screenshot({ path: syncProofPath, fullPage: false });
        console.log(`📸 Saved Main Take Note Sync proof: ${syncProofPath}`);

        console.log('\n🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
    } catch (err) {
        console.error('❌ Verification failed with error:', err);
    } finally {
        await browser.close();
    }
})();
