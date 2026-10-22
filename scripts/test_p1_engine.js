const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== P1 LAYOUT ANALYSIS & SEGMENTATION TEST ===');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1400,900']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });

    page.on('console', msg => console.log('BROWSER:', msg.text()));
    page.on('pageerror', err => console.error('BROWSER ERROR:', err.message));

    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    const pdfPath = path.join(__dirname, '..', 'data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');

    const result = await page.evaluate(async (base64) => {
        // Ensure Tesseract library loaded
        if (!window.Tesseract) {
            await new Promise((resolve, reject) => {
                const s = document.createElement('script');
                s.src = 'js/tesseract.min.js';
                s.onload = resolve;
                s.onerror = reject;
                document.head.appendChild(s);
            });
        }

        const binary = atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

        const pdfDoc = await window.pdfjsLib.getDocument({ data: bytes.slice(0) }).promise;
        const page1 = await pdfDoc.getPage(1);
        const rotation = (page1.rotate || 0) % 360;
        const scale = 2.0;
        const viewport = page1.getViewport({ scale, rotation });

        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        await page1.render({ canvasContext: ctx, viewport }).promise;

        const W = canvas.width;
        const H = canvas.height;
        const imgData = ctx.getImageData(0, 0, W, H);
        const d = imgData.data;

        console.log(`Rendered page 1: ${W}x${H}, rotation: ${rotation}`);

        // --- BƯỚC 1: OTSU ADAPTIVE BINARIZATION ---
        const gray = new Uint8Array(W * H);
        const hist = new Int32Array(256);
        for (let i = 0; i < W * H; i++) {
            const idx = i * 4;
            const g = Math.round(d[idx] * 0.299 + d[idx + 1] * 0.587 + d[idx + 2] * 0.114);
            gray[i] = g;
            hist[g]++;
        }

        // Otsu threshold
        let total = W * H;
        let sum = 0;
        for (let t = 0; t < 256; t++) sum += t * hist[t];
        let sumB = 0;
        let wB = 0;
        let wF = 0;
        let varMax = 0;
        let otsuThreshold = 140;

        for (let t = 0; t < 256; t++) {
            wB += hist[t];
            if (wB === 0) continue;
            wF = total - wB;
            if (wF === 0) break;
            sumB += t * hist[t];
            let mB = sumB / wB;
            let mF = (sum - sumB) / wF;
            let varBetween = wB * wF * (mB - mF) * (mB - mF);
            if (varBetween > varMax) {
                varMax = varBetween;
                otsuThreshold = t;
            }
        }
        console.log(`Otsu threshold: ${otsuThreshold}`);

        // Binary: 1 = dark pixel, 0 = background
        const binImg = new Uint8Array(W * H);
        for (let i = 0; i < W * H; i++) {
            binImg[i] = gray[i] < otsuThreshold ? 1 : 0;
        }

        // --- BƯỚC 2: TÁCH ĐƯỜNG KẺ BẢNG BẰNG MORPHOLOGICAL OPENING ---
        const Kh = Math.round(W * 0.03); // ~35px horizontal
        const Kv = Math.round(H * 0.025); // ~30px vertical
        console.log(`Morphological kernels: Kh=${Kh}, Kv=${Kv}`);

        const hLines = new Uint8Array(W * H);
        const vLines = new Uint8Array(W * H);

        // Horizontal opening: run of 1s >= Kh
        for (let y = 0; y < H; y++) {
            let runStart = -1;
            for (let x = 0; x < W; x++) {
                const idx = y * W + x;
                if (binImg[idx] === 1) {
                    if (runStart === -1) runStart = x;
                } else {
                    if (runStart !== -1) {
                        if (x - runStart >= Kh) {
                            for (let rx = runStart; rx < x; rx++) hLines[y * W + rx] = 1;
                        }
                        runStart = -1;
                    }
                }
            }
            if (runStart !== -1 && (W - runStart >= Kh)) {
                for (let rx = runStart; rx < W; rx++) hLines[y * W + rx] = 1;
            }
        }

        // Vertical opening: run of 1s >= Kv
        for (let x = 0; x < W; x++) {
            let runStart = -1;
            for (let y = 0; y < H; y++) {
                const idx = y * W + x;
                if (binImg[idx] === 1) {
                    if (runStart === -1) runStart = y;
                } else {
                    if (runStart !== -1) {
                        if (y - runStart >= Kv) {
                            for (let ry = runStart; ry < y; ry++) vLines[ry * W + x] = 1;
                        }
                        runStart = -1;
                    }
                }
            }
            if (runStart !== -1 && (H - runStart >= Kv)) {
                for (let ry = runStart; ry < H; ry++) vLines[ry * W + x] = 1;
            }
        }

        // LineMask = hLines | vLines, dilated 1px
        const lineMask = new Uint8Array(W * H);
        for (let i = 0; i < W * H; i++) {
            if (hLines[i] === 1 || vLines[i] === 1) lineMask[i] = 1;
        }

        // --- BƯỚC 3: TÁCH CON DẤU ĐỎ VÀ CHỮ KÝ XANH (HSV) ---
        const stampMask = new Uint8Array(W * H);
        const blackInk = new Uint8Array(W * H);

        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                const i = y * W + x;
                const idx = i * 4;
                const r = d[idx], g = d[idx + 1], b = d[idx + 2];

                // Check red stamp (Hue red / magenta)
                const isRedStamp = (r > 140 && r > g * 1.35 && r > b * 1.35);
                const isBlueInk = (b > 140 && b > r * 1.25 && b > g * 1.15);

                if (isRedStamp || isBlueInk) {
                    stampMask[i] = 1;
                }

                // Black ink = binary dark pixel, NOT line, NOT stamp
                if (binImg[i] === 1 && lineMask[i] === 0 && stampMask[i] === 0) {
                    blackInk[i] = 1;
                }
            }
        }

        // --- BƯỚC 4: CHIA Ô BẢNG (CONNECTED COMPONENTS CỦA VÙNG TRẮNG ĐƯỢC BAO BỞI LINEMASK) ---
        // Downsample grid for fast cell flood-fill (downscale factor = 2)
        const dw = Math.floor(W / 2);
        const dh = Math.floor(H / 2);
        const grid = new Uint8Array(dw * dh);
        for (let dy = 0; dy < dh; dy++) {
            for (let dx = 0; dx < dw; dx++) {
                const gx = dx * 2;
                const gy = dy * 2;
                grid[dy * dw + dx] = lineMask[gy * W + gx];
            }
        }

        const visited = new Uint8Array(dw * dh);
        const cells = [];

        for (let y = 0; y < dh; y++) {
            for (let x = 0; x < dw; x++) {
                const idx = y * dw + x;
                if (grid[idx] === 0 && visited[idx] === 0) {
                    // Flood fill to find cell bounds
                    let minX = x, maxX = x, minY = y, maxY = y;
                    let area = 0;
                    const queue = [idx];
                    visited[idx] = 1;

                    while (queue.length > 0) {
                        const cur = queue.pop();
                        const cx = cur % dw;
                        const cy = Math.floor(cur / dw);
                        area++;

                        if (cx < minX) minX = cx;
                        if (cx > maxX) maxX = cx;
                        if (cy < minY) minY = cy;
                        if (cy > maxY) maxY = cy;

                        // 4 neighbors
                        const neighbors = [
                            cy > 0 ? (cy - 1) * dw + cx : -1,
                            cy < dh - 1 ? (cy + 1) * dw + cx : -1,
                            cx > 0 ? cy * dw + (cx - 1) : -1,
                            cx < dw - 1 ? cy * dw + (cx + 1) : -1
                        ];

                        for (const n of neighbors) {
                            if (n !== -1 && grid[n] === 0 && visited[n] === 0) {
                                visited[n] = 1;
                                queue.push(n);
                            }
                        }
                    }

                    // Convert back to full resolution
                    const cellW = (maxX - minX + 1) * 2;
                    const cellH = (maxY - minY + 1) * 2;

                    // Filter out very small spots or outer page border
                    if (cellW >= 40 && cellH >= 15 && area >= 80 && cellW < W * 0.98) {
                        cells.push({
                            id: `cell-${cells.length}`,
                            x0: minX * 2,
                            y0: minY * 2,
                            x1: Math.min(W, (maxX + 1) * 2),
                            y1: Math.min(H, (maxY + 1) * 2),
                            w: cellW,
                            h: cellH
                        });
                    }
                }
            }
        }

        console.log(`Found ${cells.length} discrete table cells on Page 1!`);

        // --- BƯỚC 5: TÁCH DÒNG & GOM CỤM TỪ TRONG MỖI Ô ĐỘC LẬP ---
        const cellResults = [];

        cells.forEach(cell => {
            // Count black ink pixels in cell
            const cellInk = [];
            for (let cy = cell.y0; cy < cell.y1; cy++) {
                for (let cx = cell.x0; cx < cell.x1; cx++) {
                    if (blackInk[cy * W + cx] === 1) {
                        cellInk.push({ x: cx, y: cy });
                    }
                }
            }

            if (cellInk.length < 8) return; // Empty cell

            // Horizontal projection in cell to find text lines
            const cellH = cell.y1 - cell.y0;
            const projY = new Int32Array(cellH);
            cellInk.forEach(pt => {
                projY[pt.y - cell.y0]++;
            });

            // Find line intervals
            const lines = [];
            let lineStart = -1;
            for (let ly = 0; ly < cellH; ly++) {
                if (projY[ly] >= 3) {
                    if (lineStart === -1) lineStart = ly;
                } else {
                    if (lineStart !== -1) {
                        if (ly - lineStart >= 6) {
                            lines.push({
                                y0: cell.y0 + lineStart,
                                y1: cell.y0 + ly
                            });
                        }
                        lineStart = -1;
                    }
                }
            }
            if (lineStart !== -1 && (cellH - lineStart >= 6)) {
                lines.push({ y0: cell.y0 + lineStart, y1: cell.y1 });
            }

            // In each line, find horizontal word clusters
            lines.forEach((line, lIdx) => {
                const lineInk = cellInk.filter(pt => pt.y >= line.y0 && pt.y <= line.y1);
                if (lineInk.length < 8) return;

                const minX = Math.min(...lineInk.map(pt => pt.x));
                const maxX = Math.max(...lineInk.map(pt => pt.x));
                const lineW = maxX - minX + 1;
                const projX = new Int32Array(lineW);
                lineInk.forEach(pt => {
                    projX[pt.x - minX]++;
                });

                // Cluster words separated by space > 0.35 * lineHeight
                const lineH = line.y1 - line.y0;
                const spaceThreshold = Math.max(4, Math.round(lineH * 0.35));
                const clusters = [];
                let wordStart = -1;
                let lastInkX = -1;

                for (let lx = 0; lx < lineW; lx++) {
                    const globalX = minX + lx;
                    if (projX[lx] >= 1) {
                        if (wordStart === -1) wordStart = globalX;
                        lastInkX = globalX;
                    } else {
                        if (wordStart !== -1 && (globalX - lastInkX >= spaceThreshold * 3)) {
                            // End of cluster
                            clusters.push({
                                x0: wordStart,
                                y0: line.y0,
                                x1: lastInkX,
                                y1: line.y1
                            });
                            wordStart = -1;
                        }
                    }
                }
                if (wordStart !== -1) {
                    clusters.push({
                        x0: wordStart,
                        y0: line.y0,
                        x1: lastInkX,
                        y1: line.y1
                    });
                }

                cellResults.push({
                    cellId: cell.id,
                    cellBounds: { x0: cell.x0, y0: cell.y0, x1: cell.x1, y1: cell.y1 },
                    clusters: clusters.map(c => ({
                        x0: c.x0,
                        y0: c.y0,
                        x1: c.x1,
                        y1: c.y1,
                        xRatio: c.x0 / W,
                        yRatio: c.y0 / H,
                        wRatio: (c.x1 - c.x0) / W,
                        hRatio: (c.y1 - c.y0) / H
                    }))
                });
            });
        });

        // Test date row cells: check cells near y ~ 1400 (where the 4 dates are)
        const dateCells = cellResults.filter(cr => cr.cellBounds.y0 > 1300 && cr.cellBounds.y1 < 1550);
        // Test header cells: check cells near y ~ 50..200 (where Doc ID, Rev No are)
        const headerCells = cellResults.filter(cr => cr.cellBounds.y0 < 300 && cr.cellBounds.x0 > 700);

        return {
            totalCells: cells.length,
            totalCellLinesWithInk: cellResults.length,
            dateCellsCount: dateCells.length,
            dateCells: dateCells.map(dc => ({ cellBounds: dc.cellBounds, clusters: dc.clusters })),
            headerCellsCount: headerCells.length,
            headerCells: headerCells.map(hc => ({ cellBounds: hc.cellBounds, clusters: hc.clusters }))
        };
    }, pdfBase64);

    console.log('=== P1 TEST RESULT ===');
    console.log('Total cells found:', result.totalCells);
    console.log('Total cell text lines:', result.totalCellLinesWithInk);
    console.log('Date cells count (should be 4!):', result.dateCellsCount);
    console.log('Date cells:', JSON.stringify(result.dateCells, null, 2));
    console.log('Header cells (Doc ID, Rev No, etc.):', JSON.stringify(result.headerCells, null, 2));

    await browser.close();
    console.log('=== TEST COMPLETED ===');
})();
