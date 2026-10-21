const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== STARTING COMPLETE E2E PDF SCAN TEST ===');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    page.on('console', msg => {
        const text = msg.text();
        if (text.includes('OCR') || text.includes('PDF') || text.includes('Cluster') || text.includes('sửa')) {
            console.log('BROWSER LOG:', text);
        }
    });

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    // 1. Switch to Take-Note tab
    console.log('Step 1: Switching to Take Note tab...');
    await page.evaluate(() => {
        if (typeof switchTab === 'function') switchTab('take-note');
    });
    await new Promise(r => setTimeout(r, 600));

    // 2. Open PDF file
    console.log('Step 2: Loading sample_lipovitan_7pages.pdf...');
    const pdfPath = path.join(__dirname, '..', 'data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');

    await page.evaluate(async (base64) => {
        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        await window.PdfStudio.openPdf(bytes.buffer, {
            fileName: 'sample_lipovitan_7pages.pdf',
            noteId: 'e2e-test-note'
        });
    }, pdfBase64);

    // 3. Wait for OCR on Page 1
    console.log('Step 3: Waiting for Page 1 OCR and clustering...');
    let clustersReady = false;
    for (let attempt = 0; attempt < 40; attempt++) {
        await new Promise(r => setTimeout(r, 1000));
        clustersReady = await page.evaluate(() => {
            const cls = (window.PdfStudio && window.PdfStudio.pageClusters && window.PdfStudio.pageClusters[1]) || [];
            return cls.length > 10;
        });
        if (clustersReady) {
            console.log(`Page 1 clusters ready at second ${attempt + 1}!`);
            break;
        }
    }

    // 4. Verify Clusters on Page 1
    console.log('Step 4: Verifying clusters on Page 1...');
    const clusterReport = await page.evaluate(() => {
        const clusters = window.PdfStudio.pageClusters[1] || [];
        const soanThao = clusters.filter(c => c.text.includes('Soạn') || c.text.includes('thảo'));
        const kiemTra = clusters.filter(c => c.text.includes('Kiểm') || c.text.includes('tra'));
        const pheDuyet = clusters.filter(c => c.text.includes('Phê') || c.text.includes('duyệt'));
        const docId = clusters.filter(c => c.text.includes('Doc') || c.text.includes('ID'));
        const revNo = clusters.filter(c => c.text.includes('Rev'));
        const prWi = clusters.filter(c => c.text.includes('PR') || c.text.includes('WI'));
        const dateVer = clusters.filter(c => c.text.includes('01/06'));

        return {
            totalClusters: clusters.length,
            soanThao: soanThao.map(c => ({ text: c.text, xRatio: c.xRatio, yRatio: c.yRatio, isCentered: c.isCentered })),
            kiemTra: kiemTra.map(c => ({ text: c.text, xRatio: c.xRatio, yRatio: c.yRatio, isCentered: c.isCentered })),
            pheDuyet: pheDuyet.map(c => ({ text: c.text, xRatio: c.xRatio, yRatio: c.yRatio })),
            docId: docId.map(c => ({ text: c.text, xRatio: c.xRatio })),
            revNo: revNo.map(c => ({ text: c.text, xRatio: c.xRatio })),
            prWi: prWi.map(c => ({ text: c.text, xRatio: c.xRatio })),
            dateVer: dateVer.map(c => ({ text: c.text, xRatio: c.xRatio }))
        };
    });

    console.log('Cluster Report:', JSON.stringify(clusterReport, null, 2));

    // Turn on "Hiện tất cả khung"
    await page.evaluate(() => {
        if (!window.PdfStudio.showAllBoxes) window.PdfStudio.toggleAllBoxes();
    });
    await new Promise(r => setTimeout(r, 400));

    // Screenshot BEFORE editing
    const screenBeforePath = path.join(__dirname, '..', 'screenshot_before_edit.png');
    await page.screenshot({ path: screenBeforePath, fullPage: false });
    console.log(`Saved screenshot before edit: ${screenBeforePath}`);

    // 5. Test Editing "Soạn thảo"
    console.log('Step 5: Testing In-Place Editing for "Soạn thảo"...');
    const editResult = await page.evaluate(() => {
        const clusters = window.PdfStudio.pageClusters[1] || [];
        const stCluster = clusters.find(c => c.text.includes('Soạn') || c.text.includes('thảo'));
        if (!stCluster) return { success: false, error: 'Cluster "Soạn thảo" not found' };

        const targetEl = document.getElementById(`cluster-box-${stCluster.id}`);
        window.PdfStudio.openInPlaceClusterEdit(stCluster, 1, targetEl);

        const input = document.getElementById('activeInPlacePdfInput');
        if (!input) return { success: false, error: 'Input element not created' };

        return {
            success: true,
            clusterText: stCluster.text,
            inputValue: input.value,
            fontFamily: input.style.fontFamily,
            fontSize: input.style.fontSize,
            textAlign: input.style.textAlign,
            backgroundColor: input.style.backgroundColor
        };
    });
    console.log('Soạn thảo Edit Setup Result:', editResult);

    // Screenshot DURING editing "Soạn thảo"
    const screenDuringPath = path.join(__dirname, '..', 'screenshot_during_edit_soanthao.png');
    await page.screenshot({ path: screenDuringPath, fullPage: false });
    console.log(`Saved screenshot during edit: ${screenDuringPath}`);

    // Type new text "Soạn thảo mới" and apply
    await page.evaluate(() => {
        const input = document.getElementById('activeInPlacePdfInput');
        if (input) {
            input.value = 'Soạn thảo mới';
            window.PdfStudio.applyInPlaceClusterEdit('Soạn thảo mới');
        }
    });
    await new Promise(r => setTimeout(r, 400));

    // 6. Test Editing "PR.WI- 02" or "00(01/06/24)"
    console.log('Step 6: Testing In-Place Editing for PR.WI / Rev. No...');
    await page.evaluate(() => {
        const clusters = window.PdfStudio.pageClusters[1] || [];
        const prCluster = clusters.find(c => c.text.includes('PR') || c.text.includes('WI') || c.text.includes('01/06') || c.text.includes('Rev'));
        if (prCluster) {
            const el = document.getElementById(`cluster-box-${prCluster.id}`);
            window.PdfStudio.openInPlaceClusterEdit(prCluster, 1, el);
            const input = document.getElementById('activeInPlacePdfInput');
            if (input) {
                input.value = 'PR.WI- 03';
                window.PdfStudio.applyInPlaceClusterEdit('PR.WI- 03');
            }
        }
    });
    await new Promise(r => setTimeout(r, 400));

    // 7. Test Editing "Phê duyệt" under the stamp
    console.log('Step 7: Testing Editing for "Phê duyệt" under the red stamp...');
    const pheDuyetEdited = await page.evaluate(() => {
        const clusters = window.PdfStudio.pageClusters[1] || [];
        const pdCluster = clusters.find(c => c.text.includes('Phê') || c.text.includes('duyệt'));
        if (pdCluster) {
            const el = document.getElementById(`cluster-box-${pdCluster.id}`);
            window.PdfStudio.openInPlaceClusterEdit(pdCluster, 1, el);
            const input = document.getElementById('activeInPlacePdfInput');
            if (input) {
                input.value = 'Đã Phê Duyệt';
                window.PdfStudio.applyInPlaceClusterEdit('Đã Phê Duyệt');
                return true;
            }
        }
        return false;
    });
    console.log('Phê duyệt edit applied:', pheDuyetEdited);
    await new Promise(r => setTimeout(r, 400));

    // Screenshot AFTER edits
    const screenAfterPath = path.join(__dirname, '..', 'screenshot_after_edits.png');
    await page.screenshot({ path: screenAfterPath, fullPage: false });
    console.log(`Saved screenshot after edits: ${screenAfterPath}`);

    // 8. Test Export PDF
    console.log('Step 8: Testing Export PDF...');
    const exportCheck = await page.evaluate(async () => {
        try {
            await window.PdfStudio.exportPdf();
            return { exported: true };
        } catch (e) {
            return { exported: false, error: e.message };
        }
    });
    console.log('Export check:', exportCheck);

    // 9. Verify Other Modules Integrity
    console.log('Step 9: Verifying non-regression of Word, Excel, TXT, Grammar, Vocab...');
    const modulesHealth = await page.evaluate(() => {
        return {
            hasGrammarEngine: typeof window.GrammarEngine !== 'undefined',
            hasVocabularyEngine: typeof window.VocabularyEngine !== 'undefined',
            hasAudioEngine: typeof window.AudioEngine !== 'undefined',
            hasXLSX: typeof window.XLSX !== 'undefined'
        };
    });
    console.log('Modules Health:', modulesHealth);

    await browser.close();
    console.log('=== COMPLETE E2E TEST FINISHED SUCCESSFULLY ===');
})();
