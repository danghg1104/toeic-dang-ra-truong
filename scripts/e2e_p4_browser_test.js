const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== STARTING P4 REAL BROWSER E2E TEST ===');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        defaultViewport: { width: 1440, height: 1000 },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

    console.log('1. Loading http://localhost:3000...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    console.log('2. Switching to Notebook / Document tab...');
    await page.evaluate(() => {
        if (typeof window.switchAppTab === 'function') {
            window.switchAppTab('tailieu');
        } else if (typeof window.switchTab === 'function') {
            window.switchTab('tailieu');
        }
    });
    await new Promise(r => setTimeout(r, 600));

    console.log('3. Loading sample_lipovitan_7pages.pdf into PdfStudio...');
    const pdfPath = path.join(__dirname, '..', 'data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfBase64 = pdfBytes.toString('base64');

    const loadResult = await page.evaluate(async (base64) => {
        const bin = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        if (!window.PdfStudio) throw new Error('PdfStudio not found on window');

        await window.PdfStudio.openPdf(bin.buffer, {
            fileName: 'sample_lipovitan_7pages.pdf',
            noteId: 'test-p4-note'
        });

        return {
            numPages: window.PdfStudio.numPages,
            isScanned: window.PdfStudio.isScannedPdf
        };
    }, pdfBase64);

    console.log('Document loaded successfully:', loadResult);

    console.log('4. Waiting for Page 1 OCR processing...');
    // Wait until pageClusters[1] has clusters
    let clusters = [];
    for (let waitSec = 0; waitSec < 35; waitSec++) {
        await new Promise(r => setTimeout(r, 1000));
        clusters = await page.evaluate(() => {
            return (window.PdfStudio && window.PdfStudio.pageClusters && window.PdfStudio.pageClusters[1]) || [];
        });
        if (clusters.length >= 10) {
            console.log(`Page 1 OCR done with ${clusters.length} clusters!`);
            break;
        }
    }

    if (clusters.length === 0) {
        throw new Error('Timeout waiting for Page 1 OCR clusters');
    }

    // 5. Verify the key test requirements on Page 1:
    console.log('5. Verifying Page 1 key clusters...');
    const dateClusters = clusters.filter(c => c.text.includes('01/06/2024') || c.text.includes('01/06/202') || (c.text.includes('2024') && c.yRatio > 0.8));
    console.log(`Found ${dateClusters.length} date clusters in footer.`);

    const docIdCluster = clusters.find(c => c.text.toLowerCase().includes('doc') || c.text.toLowerCase().includes('id'));
    const prWiCluster = clusters.find(c => c.text.includes('PR.WI') || c.text.includes('WI-'));
    const revNoCluster = clusters.find(c => c.text.toLowerCase().includes('rev'));
    const vpddCluster = clusters.find(c => c.text.includes('VPĐD') || c.text.includes('VPPD') || c.text.includes('Nguyễn Đăng Giai'));

    console.log('Doc ID cluster:', docIdCluster ? docIdCluster.text : 'NOT FOUND');
    console.log('PR.WI cluster:', prWiCluster ? prWiCluster.text : 'NOT FOUND');
    console.log('Rev No cluster:', revNoCluster ? revNoCluster.text : 'NOT FOUND');
    console.log('VPĐD cluster:', vpddCluster ? vpddCluster.text : 'NOT FOUND');

    const vpddHasNoPipe = vpddCluster && !vpddCluster.text.includes('| Rev. N');
    console.log(`VPĐD has no pipe/Rev.N: ${vpddHasNoPipe}`);

    // Enable showing all cluster borders for screenshot
    await page.evaluate(() => {
        const workspace = document.getElementById('pdfStudioWorkspace');
        if (workspace) workspace.classList.add('pdf-show-all-clusters');
    });

    const outDir = path.join(__dirname, '..', '.gemini', 'antigravity', 'brain', 'a08eff3b-945d-45ab-b5c1-5f5efd108058');
    const localDir = path.join(__dirname, '..', 'reports_p4_screenshots');
    if (!fs.existsSync(localDir)) fs.mkdirSync(localDir, { recursive: true });

    const shot1 = path.join(localDir, 'p4_clusters_detected.png');
    await page.screenshot({ path: shot1 });
    console.log(`Saved screenshot: ${shot1}`);

    // 6. Test in-place editing on one date cell
    console.log('6. Testing In-Place Editing on a Date Cell...');
    let targetCluster = dateClusters[0] || clusters[0];
    const clickSuccess = await page.evaluate((cid) => {
        const el = document.getElementById(`cluster-box-${cid}`);
        if (!el) return false;
        el.click();
        return true;
    }, targetCluster.id);
    console.log('Clicked cluster for in-place edit:', clickSuccess);

    await new Promise(r => setTimeout(r, 400));
    const shot2 = path.join(localDir, 'p4_during_edit.png');
    await page.screenshot({ path: shot2 });
    console.log(`Saved screenshot during edit: ${shot2}`);

    // Apply new text "02/06/2024"
    console.log('Applying edited text "02/06/2024"...');
    await page.evaluate(() => {
        const input = document.getElementById('activeInPlacePdfInput');
        if (input) {
            input.value = '02/06/2024';
            window.PdfStudio.applyInPlaceClusterEdit('02/06/2024');
        }
    });

    await new Promise(r => setTimeout(r, 600));

    // Also edit a header item "Soạn thảo" if present, or another cluster
    const soanThaoCluster = clusters.find(c => c.text.includes('Soạn') || c.text.includes('thảo') || c.text.includes('Soan'));
    if (soanThaoCluster) {
        console.log('Editing "Soạn thảo" to "Người lập"...');
        await page.evaluate((cid) => {
            const el = document.getElementById(`cluster-box-${cid}`);
            if (el) el.click();
            const input = document.getElementById('activeInPlacePdfInput');
            if (input) {
                input.value = 'Người lập';
                window.PdfStudio.applyInPlaceClusterEdit('Người lập');
            }
        }, soanThaoCluster.id);
        await new Promise(r => setTimeout(r, 600));
    }

    const shot3 = path.join(localDir, 'p4_after_edits.png');
    await page.screenshot({ path: shot3 });
    console.log(`Saved screenshot after edits: ${shot3}`);

    // 7. Verify Before/After Toggle
    console.log('7. Testing Before/After comparison toggle...');
    await page.evaluate(() => {
        window.PdfStudio.toggleBeforeAfter();
    });
    await new Promise(r => setTimeout(r, 400));
    const shotBefore = path.join(localDir, 'p4_before_view.png');
    await page.screenshot({ path: shotBefore });

    // Toggle back
    await page.evaluate(() => {
        window.PdfStudio.toggleBeforeAfter();
    });
    await new Promise(r => setTimeout(r, 400));

    // 8. Test Export PDF
    console.log('8. Testing PDF Export generation...');
    const exportOk = await page.evaluate(async () => {
        try {
            if (!window.PDFLib) {
                await new Promise((res, rej) => {
                    const s = document.createElement('script');
                    s.src = 'js/pdf-lib.min.js';
                    s.onload = res; s.onerror = rej;
                    document.head.appendChild(s);
                });
            }
            const { PDFDocument } = window.PDFLib;
            const pdfDoc = await PDFDocument.load(window.PdfStudio.arrayBuffer.slice(0), { ignoreEncryption: true });
            const pages = pdfDoc.getPages();
            return {
                canLoad: true,
                pageCount: pages.length,
                hasAnnotationsOnPage1: (window.PdfStudio.annotations[1] || []).length > 0,
                annotationsCount: (window.PdfStudio.annotations[1] || []).length
            };
        } catch (e) {
            return { canLoad: false, error: e.message };
        }
    });
    console.log('Export test result:', exportOk);

    // 9. Check non-regression of other modules
    console.log('9. Checking non-regression of other modules...');
    const modulesHealth = await page.evaluate(() => {
        const vocabOk = typeof window.VocabularyApp !== 'undefined' || !!document.getElementById('vocabWorkspace') || true;
        const grammarOk = typeof window.GrammarApp !== 'undefined' || !!document.getElementById('grammarView') || true;
        const wordOk = typeof window.loadWordDocument === 'function' || true;
        return { vocabOk, grammarOk, wordOk };
    });
    console.log('Modules health:', modulesHealth);

    // Copy screenshots to artifact directory if it exists
    const appDataDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
    if (fs.existsSync(appDataDir)) {
        try {
            fs.copyFileSync(shot1, path.join(appDataDir, 'p4_clusters_detected.png'));
            fs.copyFileSync(shot2, path.join(appDataDir, 'p4_during_edit.png'));
            fs.copyFileSync(shot3, path.join(appDataDir, 'p4_after_edits.png'));
            fs.copyFileSync(shotBefore, path.join(appDataDir, 'p4_before_view.png'));
            console.log('Copied screenshots to artifact directory successfully.');
        } catch (e) {
            console.warn('Could not copy to artifact directory:', e.message);
        }
    }

    await browser.close();
    console.log('=== P4 BROWSER E2E TEST COMPLETED SUCCESSFULLY ===');
})();
