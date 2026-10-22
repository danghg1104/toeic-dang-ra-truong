const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer-core');

(async () => {
    console.log('=== TESTING CONNECTED COMPONENTS OF ~LINEMASK ===');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    const pdfPath = path.join(__dirname, '..', 'data', 'sample_documents', 'sample_lipovitan_7pages.pdf');
    const pdfBase64 = fs.readFileSync(pdfPath).toString('base64');

    const result = await page.evaluate(async (base64) => {
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

        // Grayscale & Otsu
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

        // Line detection (Horizontal >= 30px, Vertical >= 20px)
        const Kh = 30, Kv = 20;
        const hLineMask = new Uint8Array(W * H);
        const vLineMask = new Uint8Array(W * H);

        for (let y = 0; y < H; y++) {
            let run = 0;
            for (let x = 0; x < W; x++) {
                if (bin[y * W + x] === 1) run++;
                else {
                    if (run >= Kh) for (let rx = x - run; rx < x; rx++) hLineMask[y * W + rx] = 1;
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
                    if (run >= Kv) for (let ry = y - run; ry < y; ry++) vLineMask[ry * W + x] = 1;
                    run = 0;
                }
            }
            if (run >= Kv) for (let ry = H - run; ry < H; ry++) vLineMask[ry * W + x] = 1;
        }

        // Bridge tiny gaps in lines (1-2px)
        const lineMask = new Uint8Array(W * H);
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                const idx = y * W + x;
                if (hLineMask[idx] || vLineMask[idx]) lineMask[idx] = 1;
            }
        }

        // Dilate lineMask by 1px
        const dilatedLines = new Uint8Array(W * H);
        for (let y = 1; y < H - 1; y++) {
            for (let x = 1; x < W - 1; x++) {
                const idx = y * W + x;
                if (lineMask[idx] || lineMask[idx - 1] || lineMask[idx + 1] ||
                    lineMask[idx - W] || lineMask[idx + W]) {
                    dilatedLines[idx] = 1;
                }
            }
        }

        // Find connected components of ~dilatedLines (i.e. dilatedLines === 0)
        // To be memory efficient, we label components using BFS
        const labeled = new Int32Array(W * H);
        let currentLabel = 0;
        const components = [];

        // Add 1px border around page as line so floodfill doesn't leak out of page
        for (let x = 0; x < W; x++) {
            dilatedLines[x] = 1;
            dilatedLines[(H - 1) * W + x] = 1;
        }
        for (let y = 0; y < H; y++) {
            dilatedLines[y * W] = 1;
            dilatedLines[y * W + (W - 1)] = 1;
        }

        for (let y = 1; y < H - 1; y += 2) {
            for (let x = 1; x < W - 1; x += 2) {
                const idx = y * W + x;
                if (dilatedLines[idx] === 0 && labeled[idx] === 0) {
                    currentLabel++;
                    let minX = x, maxX = x, minY = y, maxY = y, area = 0;
                    const queue = [x, y];
                    labeled[idx] = currentLabel;
                    let head = 0;

                    while (head < queue.length) {
                        const qx = queue[head++];
                        const qy = queue[head++];
                        area++;
                        if (qx < minX) minX = qx;
                        if (qx > maxX) maxX = qx;
                        if (qy < minY) minY = qy;
                        if (qy > maxY) maxY = qy;

                        const neighbors = [
                            [qx - 1, qy], [qx + 1, qy],
                            [qx, qy - 1], [qx, qy + 1]
                        ];
                        for (let n = 0; n < 4; n++) {
                            const nx = neighbors[n][0];
                            const ny = neighbors[n][1];
                            if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
                                const nIdx = ny * W + nx;
                                if (dilatedLines[nIdx] === 0 && labeled[nIdx] === 0) {
                                    labeled[nIdx] = currentLabel;
                                    queue.push(nx, ny);
                                }
                            }
                        }
                    }

                    // Only keep regions with area >= 200px
                    if (area >= 200 && (maxX - minX >= 10) && (maxY - minY >= 8)) {
                        components.push({
                            label: currentLabel,
                            x0: minX, y0: minY, x1: maxX, y1: maxY,
                            w: maxX - minX, h: maxY - minY,
                            area
                        });
                    }
                }
            }
        }

        // Check key target points to see which component they fall into:
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

        const targetMatches = [];
        for (const t of targets) {
            const comp = components.find(c => t.x >= c.x0 && t.x <= c.x1 && t.y >= c.y0 && t.y <= c.y1);
            targetMatches.push({
                name: t.name,
                comp: comp ? { x0: comp.x0, y0: comp.y0, x1: comp.x1, y1: comp.y1, w: comp.w, h: comp.h } : null
            });
        }

        return {
            totalComponents: components.length,
            targetMatches
        };
    }, pdfBase64);

    console.log(JSON.stringify(result, null, 2));
    await browser.close();
})();
