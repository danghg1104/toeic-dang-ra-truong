const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('--- Testing Table Line Detection & Clustering on Page 1 ---');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    page.on('console', msg => console.log('BROWSER:', msg.text()));
    page.on('pageerror', err => console.error('PAGE ERROR:', err.message));

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    const pdfPath = path.join(__dirname, '..', 'data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');

    const result = await page.evaluate(async (base64) => {
        // Load tesseract if needed
        if (typeof window.PdfStudio !== 'undefined') {
            await window.PdfStudio.init();
        }

        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        const pdfDoc = await window.pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const page1 = await pdfDoc.getPage(1);
        const viewport = page1.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page1.render({ canvasContext: ctx, viewport }).promise;

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;
        const W = canvas.width;
        const H = canvas.height;

        console.log(`Canvas rendered: ${W}x${H}`);

        // 1. Detect vertical and horizontal table lines
        const vLines = [];
        const hLines = [];

        // Sample horizontal lines
        for (let y = 0; y < H; y += 2) {
            let runStart = -1;
            for (let x = 0; x < W; x++) {
                const idx = (y * W + x) * 4;
                const lum = data[idx] * 0.299 + data[idx+1] * 0.587 + data[idx+2] * 0.114;
                if (lum < 130) {
                    if (runStart === -1) runStart = x;
                } else {
                    if (runStart !== -1) {
                        if (x - runStart >= 40) {
                            hLines.push({ y, x0: runStart, x1: x });
                        }
                        runStart = -1;
                    }
                }
            }
        }

        // Sample vertical lines
        for (let x = 0; x < W; x += 2) {
            let runStart = -1;
            for (let y = 0; y < H; y++) {
                const idx = (y * W + x) * 4;
                const lum = data[idx] * 0.299 + data[idx+1] * 0.587 + data[idx+2] * 0.114;
                if (lum < 130) {
                    if (runStart === -1) runStart = y;
                } else {
                    if (runStart !== -1) {
                        if (y - runStart >= 30) {
                            vLines.push({ x, y0: runStart, y1: y });
                        }
                        runStart = -1;
                    }
                }
            }
        }

        console.log(`Detected: ${hLines.length} horizontal segments, ${vLines.length} vertical segments.`);

        // Now run Tesseract
        // Ensure Tesseract library
        if (!window.Tesseract) {
            await new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'js/tesseract.min.js';
                s.onload = resolve;
                s.onerror = reject;
                document.head.appendChild(s);
            });
        }

        const worker = await window.Tesseract.createWorker(['vie', 'eng'], 1, {
            workerPath: 'js/tesseract-dist/worker.min.js',
            corePath: 'js/tesseract-dist/tesseract-core.wasm.js',
            langPath: window.location.origin + '/data/ocr_lang',
            cacheMethod: 'none',
            gzip: true
        });

        console.log('Worker ready, recognizing...');
        const ocr = await worker.recognize(canvas);
        const rawWords = (ocr.data && ocr.data.words) || [];
        console.log(`OCR returned ${rawWords.length} words.`);

        // Helper: check if vertical line is between x0 and x1 within [y0, y1]
        function hasVLineBetween(x0, x1, y0, y1) {
            const minX = Math.min(x0, x1);
            const maxX = Math.max(x0, x1);
            return vLines.some(vl => vl.x > minX && vl.x < maxX && vl.y0 <= y1 && vl.y1 >= y0);
        }

        // Helper: check if horizontal line is between y0 and y1 within [x0, x1]
        function hasHLineBetween(y0, y1, x0, x1) {
            const minY = Math.min(y0, y1);
            const maxY = Math.max(y0, y1);
            return hLines.some(hl => hl.y > minY && hl.y < maxY && hl.x0 <= x1 && hl.x1 >= x0);
        }

        // Sort words top-to-bottom
        const words = rawWords.filter(w => w.text && w.text.trim().length > 0).map(w => ({
            text: w.text.trim(),
            confidence: w.confidence,
            bbox: w.bbox
        }));
        words.sort((a, b) => (a.bbox.y0 - b.bbox.y0) || (a.bbox.x0 - b.bbox.x0));

        // Group into lines
        const visualLines = [];
        words.forEach(word => {
            let placed = false;
            for (let line of visualLines) {
                const ref = line[0];
                const overlapY = Math.min(word.bbox.y1, ref.bbox.y1) - Math.max(word.bbox.y0, ref.bbox.y0);
                const minH = Math.min(word.bbox.y1 - word.bbox.y0, ref.bbox.y1 - ref.bbox.y0);
                if (overlapY >= minH * 0.45 && !hasHLineBetween(ref.bbox.y0, word.bbox.y0, Math.min(ref.bbox.x0, word.bbox.x0), Math.max(ref.bbox.x1, word.bbox.x1))) {
                    line.push(word);
                    placed = true;
                    break;
                }
            }
            if (!placed) visualLines.push([word]);
        });

        // For each line, sort words by x0 and cluster
        const clusters = [];
        visualLines.forEach(line => {
            line.sort((a, b) => a.bbox.x0 - b.bbox.x0);
            let currentCluster = [line[0]];

            for (let i = 1; i < line.length; i++) {
                const prev = currentCluster[currentCluster.length - 1];
                const curr = line[i];
                const gap = curr.bbox.x0 - prev.bbox.x1;
                const charH = (prev.bbox.y1 - prev.bbox.y0 + curr.bbox.y1 - curr.bbox.y0) / 2;
                const vLineExists = hasVLineBetween(prev.bbox.x1, curr.bbox.x0, Math.min(prev.bbox.y0, curr.bbox.y0), Math.max(prev.bbox.y1, curr.bbox.y1));

                if (gap <= charH * 1.35 && !vLineExists) {
                    currentCluster.push(curr);
                } else {
                    clusters.push(currentCluster);
                    currentCluster = [curr];
                }
            }
            if (currentCluster.length > 0) clusters.push(currentCluster);
        });

        const formattedClusters = clusters.map(c => {
            const text = c.map(w => w.text).join(' ');
            const x0 = Math.min(...c.map(w => w.bbox.x0));
            const y0 = Math.min(...c.map(w => w.bbox.y0));
            const x1 = Math.max(...c.map(w => w.bbox.x1));
            const y1 = Math.max(...c.map(w => w.bbox.y1));
            return { text, x0, y0, x1, y1 };
        });

        await worker.terminate();

        // Find key phrases
        const soanThaoClusters = formattedClusters.filter(c => c.text.includes('Soạn') || c.text.includes('thảo') || c.text.includes('Kiểm') || c.text.includes('tra') || c.text.includes('Phê') || c.text.includes('duyệt'));
        const docIdClusters = formattedClusters.filter(c => c.text.includes('Doc') || c.text.includes('ID') || c.text.includes('Rev') || c.text.includes('PR') || c.text.includes('WI') || c.text.includes('01/06'));

        return {
            totalClusters: formattedClusters.length,
            soanThaoClusters,
            docIdClusters
        };
    }, pdfBase64);

    console.log('--- CLUSTERING RESULT ---');
    console.log('Total clusters:', result.totalClusters);
    console.log('Soạn thảo / Kiểm tra / Phê duyệt clusters:');
    console.log(JSON.stringify(result.soanThaoClusters, null, 2));
    console.log('Doc. ID / Rev. No clusters:');
    console.log(JSON.stringify(result.docIdClusters, null, 2));

    await browser.close();
    console.log('--- Test Completed Successfully ---');
})();
