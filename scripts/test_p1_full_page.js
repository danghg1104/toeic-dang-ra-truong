const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== TESTING AUTOMATIC CELL & REGION DISCOVERY ON PAGE 1 ===');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    const pdfPath = path.join(__dirname, '..', 'data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');

    const evalResult = await page.evaluate(async (base64) => {
        if (!window.Tesseract) {
            await new Promise((res, rej) => {
                const s = document.createElement('script');
                s.src = 'js/tesseract.min.js';
                s.onload = res;
                s.onerror = rej;
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
        await worker.setParameters({ tessedit_pageseg_mode: '7' });

        const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const pdfDoc = await window.pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const page1 = await pdfDoc.getPage(1);
        const rotation = (page1.rotate || 0) % 360;
        const viewport = page1.getViewport({ scale: 2.0, rotation });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page1.render({ canvasContext: ctx, viewport }).promise;

        const W = canvas.width;
        const H = canvas.height;
        const d = ctx.getImageData(0, 0, W, H).data;

        // 1. Grayscale & Otsu
        const gray = new Uint8Array(W * H);
        const hist = new Int32Array(256);
        for (let i = 0; i < W * H; i++) {
            const idx = i * 4;
            const g = Math.round(d[idx] * 0.299 + d[idx+1] * 0.587 + d[idx+2] * 0.114);
            gray[i] = g;
            hist[g]++;
        }
        let total = W * H, sum = 0;
        for (let t = 0; t < 256; t++) sum += t * hist[t];
        let sumB = 0, wB = 0, wF = 0, varMax = 0, otsu = 160;
        for (let t = 0; t < 256; t++) {
            wB += hist[t];
            if (wB === 0) continue;
            wF = total - wB;
            if (wF === 0) break;
            sumB += t * hist[t];
            let mB = sumB / wB;
            let mF = (sum - sumB) / wF;
            let vb = wB * wF * (mB - mF) * (mB - mF);
            if (vb > varMax) { varMax = vb; otsu = t; }
        }

        const bin = new Uint8Array(W * H);
        for (let i = 0; i < W * H; i++) bin[i] = gray[i] < otsu ? 1 : 0;

        // 2. Line detection (Horizontal >= 30px, Vertical >= 20px)
        const Kh = 30, Kv = 20;
        const hLineMask = new Uint8Array(W * H);
        const vLineMask = new Uint8Array(W * H);

        for (let y = 0; y < H; y++) {
            let run = 0;
            for (let x = 0; x < W; x++) {
                if (bin[y * W + x] === 1) run++;
                else {
                    if (run >= Kh) {
                        for (let rx = x - run; rx < x; rx++) hLineMask[y * W + rx] = 1;
                    }
                    run = 0;
                }
            }
            if (run >= Kh) for (let rx = W - run; rx < W; rx++) hLineMask[y * W + rx] = 1;
        }

        for (let x = 0; x < W; x++) {
            let run = 0;
            for (let y = 0; y < H; y++) {
                if (bin[y * W + x] === 1) run++;
                else {
                    if (run >= Kv) {
                        for (let ry = y - run; ry < y; ry++) vLineMask[ry * W + x] = 1;
                    }
                    run = 0;
                }
            }
            if (run >= Kv) for (let ry = H - run; ry < H; ry++) vLineMask[ry * W + x] = 1;
        }

        // Dilate lineMask by 2px to thoroughly remove border pixels from blackInk
        const lineMask = new Uint8Array(W * H);
        const rad = 2;
        for (let y = rad; y < H - rad; y++) {
            for (let x = rad; x < W - rad; x++) {
                let hit = false;
                for (let dy = -rad; dy <= rad && !hit; dy++) {
                    for (let dx = -rad; dx <= rad && !hit; dx++) {
                        const idx = (y + dy) * W + (x + dx);
                        if (hLineMask[idx] || vLineMask[idx]) hit = true;
                    }
                }
                if (hit) lineMask[y * W + x] = 1;
            }
        }

        // 3. Stamp & Black Ink
        const stampMask = new Uint8Array(W * H);
        const blackInk = new Uint8Array(W * H);
        for (let i = 0; i < W * H; i++) {
            const idx = i * 4;
            const r = d[idx], g = d[idx+1], b = d[idx+2];
            const isRed = (r > 130 && r > g * 1.3 && r > b * 1.3);
            const isBlue = (b > 130 && b > r * 1.2 && b > g * 1.15);
            if (isRed || isBlue) stampMask[i] = 1;
            if (bin[i] === 1 && lineMask[i] === 0 && stampMask[i] === 0) blackInk[i] = 1;
        }

        // Extract Line Segments
        const hSegments = [];
        for (let y = 0; y < H; y++) {
            let start = -1;
            for (let x = 0; x < W; x++) {
                if (hLineMask[y * W + x]) {
                    if (start === -1) start = x;
                } else {
                    if (start !== -1) {
                        if (x - start >= Kh) hSegments.push({ y, x0: start, x1: x });
                        start = -1;
                    }
                }
            }
            if (start !== -1 && W - start >= Kh) hSegments.push({ y, x0: start, x1: W });
        }

        const vSegments = [];
        for (let x = 0; x < W; x++) {
            let start = -1;
            for (let y = 0; y < H; y++) {
                if (vLineMask[y * W + x]) {
                    if (start === -1) start = y;
                } else {
                    if (start !== -1) {
                        if (y - start >= Kv) vSegments.push({ x, y0: start, y1: y });
                        start = -1;
                    }
                }
            }
            if (start !== -1 && H - start >= Kv) vSegments.push({ x, y0: start, y1: H });
        }

        // Cell resolver for any coordinate (px, py)
        function findCellBounds(px, py) {
            let topY = 0, bottomY = H;
            let leftX = 0, rightX = W;

            for (const hl of hSegments) {
                if (hl.x0 <= px + 5 && hl.x1 >= px - 5) {
                    if (hl.y <= py && hl.y > topY) topY = hl.y;
                    if (hl.y >= py && hl.y < bottomY) bottomY = hl.y;
                }
            }

            for (const vl of vSegments) {
                if (vl.y0 <= py + 5 && vl.y1 >= py - 5) {
                    if (vl.x <= px && vl.x > leftX) leftX = vl.x;
                    if (vl.x >= px && vl.x < rightX) rightX = vl.x;
                }
            }

            return { x0: leftX, y0: topY, x1: rightX, y1: bottomY };
        }

        // Clean Canvas with pure black ink on white
        const cleanCanvas = document.createElement('canvas');
        cleanCanvas.width = W;
        cleanCanvas.height = H;
        const clCtx = cleanCanvas.getContext('2d');
        clCtx.fillStyle = '#ffffff';
        clCtx.fillRect(0, 0, W, H);
        const clImg = clCtx.getImageData(0, 0, W, H);
        const clData = clImg.data;
        for (let i = 0; i < W * H; i++) {
            if (blackInk[i] === 1) {
                const idx = i * 4;
                clData[idx] = 0;
                clData[idx+1] = 0;
                clData[idx+2] = 0;
            }
        }
        clCtx.putImageData(clImg, 0, 0);

        // Connected Components on Black Ink to discover ink blobs and assign to cells
        const visited = new Uint8Array(W * H);
        const inkBlobs = [];

        // Fast grid sampling (step 2) to find unvisited ink
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                const idx = y * W + x;
                if (blackInk[idx] === 1 && visited[idx] === 0) {
                    // BFS to find blob bounding box
                    let bMinX = x, bMaxX = x, bMinY = y, bMaxY = y, blobPixels = 0;
                    const queue = [x, y];
                    visited[idx] = 1;
                    let head = 0;

                    while (head < queue.length) {
                        const qx = queue[head++];
                        const qy = queue[head++];
                        blobPixels++;
                        if (qx < bMinX) bMinX = qx;
                        if (qx > bMaxX) bMaxX = qx;
                        if (qy < bMinY) bMinY = qy;
                        if (qy > bMaxY) bMaxY = qy;

                        // Check 4-neighbors
                        const neighbors = [
                            [qx - 1, qy], [qx + 1, qy],
                            [qx, qy - 1], [qx, qy + 1]
                        ];
                        for (let n = 0; n < 4; n++) {
                            const nx = neighbors[n][0];
                            const ny = neighbors[n][1];
                            if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
                                const nIdx = ny * W + nx;
                                if (blackInk[nIdx] === 1 && visited[nIdx] === 0) {
                                    visited[nIdx] = 1;
                                    queue.push(nx, ny);
                                }
                            }
                        }
                    }

                    // Ignore tiny single-pixel noise
                    if (blobPixels >= 6 && (bMaxX - bMinX >= 2 || bMaxY - bMinY >= 2)) {
                        inkBlobs.push({
                            x0: bMinX, y0: bMinY, x1: bMaxX, y1: bMaxY,
                            cx: Math.round((bMinX + bMaxX) / 2),
                            cy: Math.round((bMinY + bMaxY) / 2),
                            pixels: blobPixels
                        });
                    }
                }
            }
        }

        console.log(`Found ${inkBlobs.length} ink blobs`);

        // Group blobs by cell and then by horizontal line within cell
        const cellsMap = new Map();
        for (const blob of inkBlobs) {
            const cell = findCellBounds(blob.cx, blob.cy);
            const cellKey = `${cell.x0}_${cell.y0}_${cell.x1}_${cell.y1}`;
            if (!cellsMap.has(cellKey)) {
                cellsMap.set(cellKey, { cell, blobs: [] });
            }
            cellsMap.get(cellKey).blobs.push(blob);
        }

        console.log(`Partitioned into ${cellsMap.size} cells/regions`);

        // Within each cell, group blobs into visual lines, then cluster words
        const allClusters = [];

        for (const [cellKey, entry] of cellsMap.entries()) {
            const { cell, blobs } = entry;
            // Sort blobs top-to-bottom, left-to-right
            blobs.sort((a, b) => (a.y0 - b.y0) || (a.x0 - b.x0));

            // Cluster into lines: two blobs belong to same line if Y overlap >= 40% of height
            const cellLines = [];
            for (const blob of blobs) {
                let placed = false;
                for (const line of cellLines) {
                    const ref = line[0];
                    const overlapY = Math.min(blob.y1, ref.y1) - Math.max(blob.y0, ref.y0);
                    const minH = Math.min(blob.y1 - blob.y0, ref.y1 - ref.y0);
                    if (overlapY >= minH * 0.4) {
                        line.push(blob);
                        placed = true;
                        break;
                    }
                }
                if (!placed) cellLines.push([blob]);
            }

            // In each line, sort left-to-right and split into clusters if horizontal gap > 1.3 * charH
            for (const line of cellLines) {
                line.sort((a, b) => a.x0 - b.x0);

                let curCluster = [line[0]];
                for (let i = 1; i < line.length; i++) {
                    const prev = curCluster[curCluster.length - 1];
                    const curr = line[i];
                    const gap = curr.x0 - prev.x1;
                    const charH = (prev.y1 - prev.y0 + curr.y1 - curr.y0) / 2;

                    // If gap > 1.3 * charH or gap > 24px, split cluster
                    if (gap <= Math.max(24, charH * 1.3)) {
                        curCluster.push(curr);
                    } else {
                        // Save cluster
                        saveCluster(curCluster, cell);
                        curCluster = [curr];
                    }
                }
                if (curCluster.length > 0) saveCluster(curCluster, cell);
            }
        }

        function saveCluster(blobs, cell) {
            const x0 = Math.min(...blobs.map(b => b.x0));
            const y0 = Math.min(...blobs.map(b => b.y0));
            const x1 = Math.max(...blobs.map(b => b.x1));
            const y1 = Math.max(...blobs.map(b => b.y1));
            const totalPixels = blobs.reduce((s, b) => s + b.pixels, 0);

            // Filter out trivial specks
            if (totalPixels >= 10 && (x1 - x0 >= 4) && (y1 - y0 >= 4)) {
                allClusters.push({
                    cell,
                    box: { x0, y0, x1, y1 },
                    w: x1 - x0,
                    h: y1 - y0
                });
            }
        }

        console.log(`Generated ${allClusters.length} candidate text clusters`);

        // Check key clusters we care about:
        // 1. Doc. ID
        // 2. PR.WI-02
        // 3. Rev. No
        // 4. 00(01/06/24)
        // 5. VPĐD
        // 6. 4 Dates
        // Let's do OCR on these selected clusters to verify:
        const targets = [
            { name: 'Doc ID', x: 910, y: 52 },
            { name: 'PR.WI', x: 1020, y: 52 },
            { name: 'Rev No', x: 910, y: 80 },
            { name: '00(01/06/24)', x: 1020, y: 80 },
            { name: 'VPĐD line', x: 300, y: 105 },
            { name: 'Date 1', x: 170, y: 1420 },
            { name: 'Date 2', x: 420, y: 1420 },
            { name: 'Date 3', x: 670, y: 1420 },
            { name: 'Date 4', x: 920, y: 1420 }
        ];

        const targetResults = [];
        for (const t of targets) {
            // Find closest cluster
            const match = allClusters.find(c =>
                t.x >= c.box.x0 - 15 && t.x <= c.box.x1 + 15 &&
                t.y >= c.box.y0 - 10 && t.y <= c.box.y1 + 10
            );

            if (!match) {
                targetResults.push({ name: t.name, found: false });
                continue;
            }

            const pad = 4;
            const cx0 = Math.max(0, match.box.x0 - pad);
            const cy0 = Math.max(0, match.box.y0 - pad);
            const cx1 = Math.min(W, match.box.x1 + pad);
            const cy1 = Math.min(H, match.box.y1 + pad);
            const cw = cx1 - cx0;
            const ch = cy1 - cy0;

            const scale = Math.max(1.0, 36 / ch);
            const cropCanvas = document.createElement('canvas');
            cropCanvas.width = Math.round(cw * scale);
            cropCanvas.height = Math.round(ch * scale);
            const cctx = cropCanvas.getContext('2d');
            cctx.fillStyle = '#ffffff';
            cctx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);
            cctx.imageSmoothingEnabled = true;
            cctx.imageSmoothingQuality = 'high';
            cctx.drawImage(cleanCanvas, cx0, cy0, cw, ch, 0, 0, cropCanvas.width, cropCanvas.height);

            const res = await worker.recognize(cropCanvas);
            targetResults.push({
                name: t.name,
                found: true,
                cell: match.cell,
                box: match.box,
                text: (res.data && res.data.text || '').trim(),
                conf: Math.round(res.data.confidence)
            });
        }

        await worker.terminate();

        return {
            totalClusters: allClusters.length,
            targetResults
        };
    }, pdfBase64);

    console.log('=== RESULTS ===');
    console.log(JSON.stringify(evalResult, null, 2));

    await browser.close();
})();
