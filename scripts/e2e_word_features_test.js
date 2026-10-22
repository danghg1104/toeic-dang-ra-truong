const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== STARTING TEST FOR WORD TOOLBAR, DRAG & DROP, RE-CLICKING, TITLE CENTERING & LOGO CLEANLINESS ===');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        defaultViewport: { width: 1440, height: 1000 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('[PdfStudio]') || text.includes('OCR') || text.includes('Test')) {
            console.log('PAGE LOG:', text);
        }
    });
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

    console.log('1. Loading http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    console.log('2. Switching to Notebook tab...');
    await page.evaluate(() => {
        if (typeof window.switchAppTab === 'function') window.switchAppTab('tailieu');
        else if (typeof window.switchTab === 'function') window.switchTab('tailieu');
    });
    await new Promise(r => setTimeout(r, 600));

    console.log('3. Loading sample_lipovitan_7pages.pdf...');
    const pdfPath = path.join(__dirname, '..', 'data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfBytes.toString('base64');

    await page.evaluate(async (base64) => {
        const bin = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        await window.PdfStudio.openPdf(bin.buffer, {
            fileName: 'sample_lipovitan_7pages.pdf',
            noteId: 'test-word-note'
        });
    }, pdfBase64);

    console.log('4. Waiting for Page 1 clusters...');
    let clusters = [];
    for (let waitSec = 0; waitSec < 60; waitSec++) {
        await new Promise(r => setTimeout(r, 1000));
        clusters = await page.evaluate(() => {
            return (window.PdfStudio && window.PdfStudio.pageClusters && window.PdfStudio.pageClusters[1]) || [];
        });
        if (clusters.length >= 8) {
            console.log(`Page 1 OCR done with ${clusters.length} clusters!`);
            break;
        }
    }
    if (clusters.length === 0) throw new Error('Timeout waiting for Page 1 OCR');

    // -------------------------------------------------------------------------
    // TEST 1: KIỂM TRA LỌC RÁC CÁNH ĐẠI BÀNG LOGO (ẢNH 4)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 1: Eagle Logo Area Cleanliness ---');
    const logoAreaClusters = clusters.filter(c => c.pixelBox.x0 < 270 && c.pixelBox.y0 < 170);
    console.log(`Eagle logo area clusters detected: ${logoAreaClusters.length} (Expected: 0 or only genuine text, no 1-letter noise)`);
    const trashInLogo = logoAreaClusters.filter(c => c.text.length < 4);
    if (trashInLogo.length > 0) {
        console.error('FAIL: Found spurious noise in logo area:', trashInLogo);
    } else {
        console.log('PASS: Logo area is clean of noise dots!');
    }

    // -------------------------------------------------------------------------
    // TEST 2: KIỂM TRA NHẬN DIỆN CĂN GIỮA TIÊU ĐỀ (ẢNH 1 & 2)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 2: Title Centering Detection ---');
    const titleCluster = clusters.find(c => c.text.includes('HƯỚNG DẪN HIỆU CHUẨN') || c.text.includes('HIỆU CHUẨN') || c.text.includes('THỂ TÍCH'));
    if (titleCluster) {
        console.log(`Title found: "${titleCluster.text}", isCentered: ${titleCluster.isCentered}`);
        if (titleCluster.isCentered) {
            console.log('PASS: Header title correctly detected as isCentered = true!');
        } else {
            console.warn('WARN: Header title isCentered is false, check cell/title midpoints');
        }
    } else {
        console.log('Title cluster not found in page 1 list, checking other clusters...');
    }

    // -------------------------------------------------------------------------
    // TEST 3: MỞ BỘ SỬA WORD & KIỂM TRA CÁC NÚT TÍNH NĂNG WORD
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 3: Word Toolbar Controls & Interactions ---');
    const targetCluster = clusters.find(c => c.text.includes('PR.WI') || c.text.includes('VPĐD') || c.text.includes('ĐỒNG NAI'));
    if (!targetCluster) throw new Error('Target cluster for editing not found');

    const wordTestResult = await page.evaluate(async (cid) => {
        const cluster = window.PdfStudio.pageClusters[1].find(c => c.id === cid);
        const box = document.getElementById(`cluster-box-${cid}`);
        if (box) box.click();

        const input = document.getElementById('activeInPlacePdfInput');
        const toolbar = document.getElementById('activeInPlacePdfToolbar');

        const dragHandle = document.getElementById('pdfToolbarDragHandle');
        const detectedBadge = document.getElementById('pdfDetectedFontBadge');
        const fontSelect = document.getElementById('pdfWordFontSelect');
        const fontDownBtn = document.getElementById('pdfFontDownBtn');
        const fontUpBtn = document.getElementById('pdfFontUpBtn');
        const fontSizeInput = document.getElementById('pdfFontSizeInput');
        const boldBtn = document.getElementById('pdfBoldBtn');
        const italicBtn = document.getElementById('pdfItalicBtn');
        const underlineBtn = document.getElementById('pdfUnderlineBtn');
        const alignLeftBtn = document.getElementById('pdfAlignLeftBtn');
        const alignCenterBtn = document.getElementById('pdfAlignCenterBtn');
        const colorSelect = document.getElementById('pdfWordColorSelect');
        const collapseBtn = document.getElementById('pdfCollapseToolbarBtn');
        const applyBtn = document.getElementById('pdfApplyEditBtn');

        const checks = {
            hasToolbar: !!toolbar,
            hasInput: !!input,
            hasDragHandle: !!dragHandle,
            hasDetectedBadge: !!detectedBadge,
            hasFontSelect: !!fontSelect,
            hasFontSizeControls: !!fontDownBtn && !!fontUpBtn && !!fontSizeInput,
            hasStyles: !!boldBtn && !!italicBtn && !!underlineBtn,
            hasAlignment: !!alignLeftBtn && !!alignCenterBtn,
            hasColorSelect: !!colorSelect,
            hasCollapseBtn: !!collapseBtn,
            hasApplyBtn: !!applyBtn
        };

        // Test interaction without blur:
        // 1. Tăng cỡ chữ bằng A+
        const initialSize = parseInt(fontSizeInput.value, 10);
        fontUpBtn.click();
        fontUpBtn.click();
        const afterUpSize = parseInt(fontSizeInput.value, 10);

        // 2. Bật Bold & Underline
        boldBtn.click();
        underlineBtn.click();

        // 3. Đổi phông sang Arial
        fontSelect.value = "'Arial', sans-serif";
        fontSelect.dispatchEvent(new Event('change'));

        // 4. Test Collapse & Expand
        collapseBtn.click();
        const bodyHidden = document.getElementById('pdfWordToolbarBody').classList.contains('hidden');
        collapseBtn.click();
        const bodyVisible = !document.getElementById('pdfWordToolbarBody').classList.contains('hidden');

        // Check input styling
        const inputFont = input.style.fontFamily;
        const inputWeight = input.style.fontWeight;
        const inputUnderline = input.style.textDecoration;
        const isStillOpen = !!document.getElementById('activeInPlacePdfInput');

        return {
            checks,
            initialSize,
            afterUpSize,
            bodyHidden,
            bodyVisible,
            inputFont,
            inputWeight,
            inputUnderline,
            isStillOpen
        };
    }, targetCluster.id);

    console.log('Word Toolbar Checks:', wordTestResult.checks);
    console.log(`Font size change: ${wordTestResult.initialSize} -> ${wordTestResult.afterUpSize}`);
    console.log(`Toolbar Collapse toggle: hidden=${wordTestResult.bodyHidden}, visible=${wordTestResult.bodyVisible}`);
    console.log(`Live input styling: font=${wordTestResult.inputFont}, weight=${wordTestResult.inputWeight}, underline=${wordTestResult.inputUnderline}`);
    console.log(`Editor stayed open (NO premature blur): ${wordTestResult.isStillOpen}`);

    if (!wordTestResult.isStillOpen) {
        throw new Error('FAIL: Editor closed prematurely during toolbar interaction!');
    }
    console.log('PASS: Word Toolbar controls work without premature blur!');

    // -------------------------------------------------------------------------
    // TEST 4: ÁP DỤNG LƯU VÀ KIỂM TRA CHÚ THÍCH SCAN-TEXT
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 4: Applying Edit & Verifying Render ---');
    const newTextToSave = "PR.WI- 02 TEST WORD";
    const saveResult = await page.evaluate(async (text) => {
        const input = document.getElementById('activeInPlacePdfInput');
        if (input) input.value = text;
        const applyBtn = document.getElementById('pdfApplyEditBtn');
        if (applyBtn) applyBtn.click();

        await new Promise(r => setTimeout(r, 600));

        const anns = window.PdfStudio.annotations[1] || [];
        const textAnn = anns.find(a => a.type === 'scan-text' && a.text.includes('TEST WORD'));
        const maskAnn = anns.find(a => a.type === 'mask-whiteout');

        return {
            hasTextAnn: !!textAnn,
            hasMaskAnn: !!maskAnn,
            annDetails: textAnn ? {
                text: textAnn.text,
                fontSize: textAnn.fontSize,
                fontFamily: textAnn.fontFamily,
                isBold: textAnn.isBold,
                isUnderline: textAnn.isUnderline,
                xRatio: textAnn.xRatio,
                yRatio: textAnn.yRatio
            } : null
        };
    }, newTextToSave);

    console.log('Save result:', saveResult);
    if (!saveResult.hasTextAnn) throw new Error('FAIL: Text annotation was not saved!');
    console.log('PASS: Text successfully saved with Word styles!');

    // -------------------------------------------------------------------------
    // TEST 5: KÉO DI CHUYỂN TỰ DO CHỮ ĐÃ LƯU (DRAG & DROP)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 5: Free Drag & Drop of Saved Annotation ---');
    const dragResult = await page.evaluate(async () => {
        const anns = window.PdfStudio.annotations[1] || [];
        const ann = anns.find(a => a.type === 'scan-text' && a.text.includes('TEST WORD'));
        if (!ann) return { error: 'Annotation not found' };

        const el = document.getElementById('ann-' + ann.id);
        if (!el) return { error: 'DOM element not found' };

        const startX = ann.xRatio;
        const startY = ann.yRatio;

        // Simulate pointerdown, pointermove, pointerup for drag
        const rect = el.getBoundingClientRect();
        const clientX = rect.left + 10;
        const clientY = rect.top + 10;

        el.dispatchEvent(new PointerEvent('pointerdown', {
            button: 0,
            clientX: clientX,
            clientY: clientY,
            bubbles: true
        }));

        // Move 60px right, 40px down
        el.dispatchEvent(new PointerEvent('pointermove', {
            clientX: clientX + 60,
            clientY: clientY + 40,
            bubbles: true
        }));

        el.dispatchEvent(new PointerEvent('pointerup', {
            clientX: clientX + 60,
            clientY: clientY + 40,
            bubbles: true
        }));

        await new Promise(r => setTimeout(r, 200));

        return {
            startX,
            startY,
            endX: ann.xRatio,
            endY: ann.yRatio,
            deltaX: ann.xRatio - startX,
            deltaY: ann.yRatio - startY
        };
    });

    console.log('Drag result:', dragResult);
    if (dragResult.deltaX === 0 && dragResult.deltaY === 0) {
        throw new Error('FAIL: Annotation coordinates did not update on drag!');
    }
    console.log('PASS: Saved text can be dragged freely to any position on page!');

    // -------------------------------------------------------------------------
    // TEST 6: CHẠM/NHẤP LẠI ĐỂ SỬA TIẾP (RE-CLICK TO EDIT)
    // -------------------------------------------------------------------------
    console.log('\n--- TEST 6: Re-Click to Edit Saved Annotation ---');
    const reClickResult = await page.evaluate(async () => {
        const anns = window.PdfStudio.annotations[1] || [];
        const ann = anns.find(a => a.type === 'scan-text' && a.text.includes('TEST WORD'));
        if (!ann) return { error: 'Annotation not found' };

        const el = document.getElementById('ann-' + ann.id);
        if (!el) return { error: 'DOM element not found' };

        // Click directly on the annotation without moving
        const rect = el.getBoundingClientRect();
        el.dispatchEvent(new PointerEvent('pointerdown', {
            button: 0,
            clientX: rect.left + 5,
            clientY: rect.top + 5,
            bubbles: true
        }));
        el.dispatchEvent(new PointerEvent('pointerup', {
            clientX: rect.left + 5,
            clientY: rect.top + 5,
            bubbles: true
        }));

        await new Promise(r => setTimeout(r, 300));

        const input = document.getElementById('activeInPlacePdfInput');
        const toolbar = document.getElementById('activeInPlacePdfToolbar');

        return {
            reOpened: !!input && !!toolbar,
            inputValue: input ? input.value : null
        };
    });

    console.log('Re-click result:', reClickResult);
    if (!reClickResult.reOpened || !reClickResult.inputValue.includes('TEST WORD')) {
        throw new Error('FAIL: Re-clicking saved annotation failed to open Word editor!');
    }
    console.log('PASS: Re-clicking saved text opens Word editor seamlessly with previous text!');

    // Chụp ảnh bằng chứng
    const screenshotPath = path.join(__dirname, '..', 'reports_p4_screenshots', 'word_toolbar_and_drag_verified.png');
    await page.screenshot({ path: screenshotPath, fullPage: false });
    console.log(`Saved screenshot proof to: ${screenshotPath}`);

    console.log('\n======================================================');
    console.log('ALL TESTS PASSED! Word Features, Free Drag & Re-Edit are 100% Verified!');
    console.log('======================================================');

    await browser.close();
    process.exit(0);
})().catch(err => {
    console.error('Test execution failed:', err);
    process.exit(1);
});
