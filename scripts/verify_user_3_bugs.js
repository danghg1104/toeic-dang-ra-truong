const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
    console.log('=== STARTING 3-BUG VERIFICATION TEST ===');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--window-size=1280,1024']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 1024 });

    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('[PdfStudio]') || text.includes('Error') || text.includes('BUG')) {
            console.log('[Browser Console]', text);
        }
    });

    await page.goto('http://localhost:3000');
    await page.evaluate(() => {
        if (typeof window.switchAppTab === 'function') window.switchAppTab('tailieu');
    });

    // 1. Load sample 7-page PDF
    const pdfPath = path.join('data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBytes = fs.readFileSync(pdfPath);
    console.log('1. Loading PDF...');
    await page.evaluate(async (b64) => {
        const bin = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        await window.PdfStudio.openPdf(bin.buffer, { fileName: 'test_verify.pdf', noteId: 'test-v3' });
    }, pdfBytes.toString('base64'));

    // Wait for Page 1 OCR clusters
    console.log('2. Waiting for page 1 clusters...');
    let clusters = [];
    for (let i = 0; i < 60; i++) {
        await new Promise(r => setTimeout(r, 1000));
        clusters = await page.evaluate(() => (window.PdfStudio && window.PdfStudio.pageClusters && window.PdfStudio.pageClusters[1]) || []);
        if (i % 5 === 0) {
            console.log(`Waiting... elapsed: ${i}s, clusters: ${clusters.length}`);
            if (clusters.length > 0) {
                console.log('Sample texts:', clusters.slice(0, 5).map(c => c.text).join(' | '));
            }
        }
        if (clusters.some(c => c.text.includes('PR.WI') || c.text.includes('WI-') || c.text.includes('PR.'))) break;
    }

    const prwiCluster = clusters.find(c => c.text.includes('PR.WI') || c.text.includes('WI-') || c.text.includes('PR.'));
    console.log('PR.WI cluster found:', prwiCluster ? prwiCluster.text : 'NO');
    if (!prwiCluster) {
        console.log('All clusters found:', clusters.map(c => `[${c.text}]`).join(', '));
        throw new Error('PR.WI cluster not found in OCR result!');
    }

    // -------------------------------------------------------------
    // TEST 1: Click on PR.WI-02 cluster box
    // -------------------------------------------------------------
    console.log('\n--- TEST 1: Clicking PR.WI-02 cluster ---');
    const t1 = await page.evaluate(async (cid) => {
        const box = document.getElementById(`cluster-box-${cid}`);
        if (!box) return { error: 'cluster-box not in DOM' };
        box.click();
        const input = document.getElementById('activeInPlacePdfInput');
        return {
            hasInput: !!input,
            val: input ? input.value : null
        };
    }, prwiCluster.id);

    console.log('Test 1 Click Result:', t1);
    if (!t1.val || !t1.val.includes('PR.WI')) {
        throw new Error(`Test 1 Failed: Expected PR.WI input, got: "${t1.val}"`);
    }
    console.log('✓ TEST 1 PASSED: Clicking PR.WI opens PR.WI editor (NOT Doc. ID)!');

    // -------------------------------------------------------------
    // TEST 2: Increasing Font Size to 17 and checking input box expansion
    // -------------------------------------------------------------
    console.log('\n--- TEST 2: Font Size Increase & Input Box Sizing ---');
    const t2 = await page.evaluate(async () => {
        const fsInput = document.getElementById('pdfFontSizeInput');
        const input = document.getElementById('activeInPlacePdfInput');
        if (!fsInput || !input) return { error: 'Missing toolbar elements' };

        // Set font size to 17
        fsInput.value = '17';
        fsInput.dispatchEvent(new Event('input', { bubbles: true }));

        // Also test with long Vietnamese text with accents
        input.value = "CÔNG TY TNHH TAISHO VIỆT NAM (SỬA THỬ)";
        input.dispatchEvent(new Event('input', { bubbles: true }));

        return {
            fontSize: input.style.fontSize,
            styleWidth: input.style.width,
            styleHeight: input.style.height,
            lineHeight: input.style.lineHeight,
            padding: input.style.padding
        };
    });

    console.log('Test 2 Result:', t2);
    const heightVal = parseInt(t2.styleHeight, 10);
    if (isNaN(heightVal) || heightVal < 32) {
        throw new Error(`Test 2 Failed: Height too small (${t2.styleHeight}), accents will be cut off!`);
    }
    console.log('✓ TEST 2 PASSED: Input box adapts height and width for 17px Vietnamese accents!');

    // -------------------------------------------------------------
    // TEST 3: Font Rendering on Canvas / Annotation Scaling (No Shrinking)
    // -------------------------------------------------------------
    console.log('\n--- TEST 3: Applying In-Place Edit & Measuring Output Size ---');
    const t3 = await page.evaluate(async () => {
        // Reset text to PR.WI- 024 and font size 14
        const fsInput = document.getElementById('pdfFontSizeInput');
        const input = document.getElementById('activeInPlacePdfInput');
        fsInput.value = '14';
        fsInput.dispatchEvent(new Event('input', { bubbles: true }));

        input.value = "PR.WI- 024";
        const applyBtn = document.getElementById('pdfApplyEditBtn');
        applyBtn.click();

        // Chờ annotation được áp dụng
        for (let i = 0; i < 20; i++) {
            await new Promise(r => setTimeout(r, 200));
            const anns = window.PdfStudio.annotations[1] || [];
            if (anns.some(a => a.type === 'scan-text')) break;
        }

        const anns = window.PdfStudio.annotations[1] || [];
        const textAnn = anns.find(a => a.type === 'scan-text');

        // Find the newly rendered scan-text annotation in DOM
        const annEl = document.querySelector('.pdf-ann-text');
        const img = annEl ? annEl.querySelector('img') : null;
        const wrapper = document.getElementById('pdfPageWrapper-1');
        const wrapperH = (wrapper && wrapper.offsetHeight) || 1100;
        const renderedHeightPx = textAnn ? Math.round(textAnn.hRatio * wrapperH) : 0;

        return {
            hasAnn: !!annEl,
            hasImg: !!img,
            textAnnStored: !!textAnn,
            fontSize: textAnn ? textAnn.fontSize : null,
            renderedHeightPx
        };
    });

    console.log('Test 3 Result:', t3);
    // On screen, at 14px font size with 1.6 line height and padding, rendered height should be >= 20px
    if (t3.renderedHeightPx < 20) {
        throw new Error(`Test 3 Failed: Rendered text is shrunk! Screen height is only ${t3.renderedHeightPx}px!`);
    }
    console.log(`✓ TEST 3 PASSED: Rendered text height on screen is ${t3.renderedHeightPx}px (solid, crisp size, NOT shrunk)!`);

    // -------------------------------------------------------------
    // TEST 4: Proximity Click Fallback (Clicking near PR.WI but outside bbox)
    // -------------------------------------------------------------
    console.log('\n--- TEST 4: Proximity Click Handling ---');
    const t4 = await page.evaluate(async (prwi) => {
        // Close any open edit
        window.PdfStudio.closeCurrentInPlaceEdit();

        // Simulate click slightly above PR.WI in wrapper (e.g. y slightly above prwi.yRatio)
        const wrapper = document.getElementById('pdfPageWrapper-1');
        const fakeEvent = {
            clickXRatio: prwi.xRatio + prwi.wRatio * 0.5,
            clickYRatio: Math.max(0, prwi.yRatio - 0.005),
            target: wrapper
        };

        await window.PdfStudio.handlePagePointClick(fakeEvent, 1);
        const input = document.getElementById('activeInPlacePdfInput');
        return {
            opened: !!input,
            val: input ? input.value : null
        };
    }, prwiCluster);

    console.log('Test 4 Result:', t4);
    if (!t4.val || !t4.val.includes('PR.WI')) {
        throw new Error(`Test 4 Failed: Expected PR.WI from proximity click, got: "${t4.val}"`);
    }
    console.log('✓ TEST 4 PASSED: Proximity click accurately snapped to PR.WI (never Doc. ID)!');

    // Take screenshot for artifact
    const screenshotPath = 'reports_p4_screenshots/verified_3_bugs_fixed.png';
    await page.screenshot({ path: screenshotPath });
    console.log('Saved verification screenshot to', screenshotPath);

    await browser.close();
    console.log('\n=== ALL 4 USER BUG VERIFICATION TESTS PASSED SUCCESSFULLY! ===');
})();
