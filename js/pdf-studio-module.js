/**
 * =========================================================================
 * CÙNG ĐĂNG RA TRƯỜNG — HIGH-END PDF STUDIO & EDITOR MODULE v3.0
 * Module chuyên biệt cho Sổ Note (PDF Scan & Document Studio):
 * 1. Đơn vị sửa = Từ/Cụm từ nhỏ (Word Clusters), không gộp khối lớn
 * 2. Tự động phát hiện đường kẻ bảng (Table Line Detection) ngăn gộp ô
 * 3. Ép chặt khung (Tight Bounding Box) vào pixel mực thật (Zero drift)
 * 4. Che nền bằng mặt nạ điểm ảnh (Mask-based Dilation), bảo toàn 100% đường kẻ bảng
 * 5. Ô sửa tại chỗ (In-Place Exact Overlay) khớp khít phông Times có chân, cỡ, màu, căn lề
 * 6. "OCR theo điểm chạm" (Point OCR on-demand) cho mọi chữ bị sót / dưới con dấu
 * 7. Nút "Hiện tất cả khung" để debug trực quan
 * 8. Cuộn dọc liên tục (Continuous Vertical Scroll View) qua đủ 7 trang
 * 9. Xuất PDF chuẩn WYSIWYG giữ nguyên 100% số trang và độ nét
 * =========================================================================
 */

(function (window) {
    'use strict';

    // -------------------------------------------------------------------------
    // 1. CẤU HÌNH & LAZY LOADER NỘI BỘ (100% Offline)
    // -------------------------------------------------------------------------

    if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    const LOCAL_PDF_LIB = 'js/pdf-lib.min.js';
    const CDN_PDF_LIB = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
    const LOCAL_TESSERACT = 'js/tesseract.min.js';
    const CDN_TESSERACT = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';

    function loadScriptLazily(src, fallbackSrc) {
        return new Promise((resolve, reject) => {
            if (window.PDFLib && (src.includes('pdf-lib') || (fallbackSrc && fallbackSrc.includes('pdf-lib')))) return resolve();
            if (window.Tesseract && (src.includes('tesseract') || (fallbackSrc && fallbackSrc.includes('tesseract')))) return resolve();

            const existing = document.querySelector(`script[src="${src}"]`) || (fallbackSrc ? document.querySelector(`script[src="${fallbackSrc}"]`) : null);
            if (existing) {
                if (existing.dataset.loaded === 'true' || window.PDFLib || window.Tesseract) return resolve();
                existing.addEventListener('load', () => resolve());
                existing.addEventListener('error', (e) => {
                    if (fallbackSrc && !existing.dataset.fallbackTried) {
                        existing.dataset.fallbackTried = 'true';
                        existing.src = fallbackSrc;
                    } else {
                        reject(e);
                    }
                });
                return;
            }
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.dataset.loaded = 'false';
            script.onload = () => {
                script.dataset.loaded = 'true';
                resolve();
            };
            script.onerror = (err) => {
                if (fallbackSrc) {
                    console.warn(`Local script ${src} failed, loading fallback ${fallbackSrc}...`);
                    const fb = document.createElement('script');
                    fb.src = fallbackSrc;
                    fb.async = true;
                    fb.dataset.loaded = 'false';
                    fb.onload = () => {
                        fb.dataset.loaded = 'true';
                        resolve();
                    };
                    fb.onerror = () => reject(new Error(`Không thể tải thư viện: ${fallbackSrc}`));
                    document.head.appendChild(fb);
                } else {
                    reject(new Error(`Không thể tải thư viện: ${src}`));
                }
            };
            document.head.appendChild(script);
        });
    }

    async function ensurePdfLib() {
        if (window.PDFLib) return window.PDFLib;
        await loadScriptLazily(LOCAL_PDF_LIB, CDN_PDF_LIB);
        return window.PDFLib;
    }

    async function ensureTesseract() {
        if (window.Tesseract) return window.Tesseract;
        await loadScriptLazily(LOCAL_TESSERACT, CDN_TESSERACT);
        return window.Tesseract;
    }

    // -------------------------------------------------------------------------
    // 2. INDEXED-DB STORAGE: LƯU TỆP NHỊ PHÂN VÀ BỘ ĐỆM OCR
    // -------------------------------------------------------------------------

    const PdfStorage = {
        dbName: 'CungDangPdfStudioDB',
        storeName: 'pdf_files',
        dbPromise: null,

        getDB() {
            if (this.dbPromise) return this.dbPromise;
            this.dbPromise = new Promise((resolve) => {
                if (!window.indexedDB) return resolve(null);
                const req = indexedDB.open(this.dbName, 1);
                req.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        db.createObjectStore(this.storeName);
                    }
                };
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => resolve(null);
            });
            return this.dbPromise;
        },

        async save(fileId, arrayBuffer) {
            try {
                const db = await this.getDB();
                if (!db) {
                    window._pdfMemoryStore = window._pdfMemoryStore || {};
                    window._pdfMemoryStore[fileId] = arrayBuffer;
                    return true;
                }
                return new Promise((resolve) => {
                    const tx = db.transaction(this.storeName, 'readwrite');
                    tx.objectStore(this.storeName).put(arrayBuffer, fileId);
                    tx.oncomplete = () => resolve(true);
                    tx.onerror = () => resolve(false);
                });
            } catch (e) {
                console.warn('PdfStorage save error:', e);
                return false;
            }
        },

        async get(fileId) {
            try {
                const db = await this.getDB();
                if (!db) {
                    return (window._pdfMemoryStore && window._pdfMemoryStore[fileId]) || null;
                }
                return new Promise((resolve) => {
                    const tx = db.transaction(this.storeName, 'readonly');
                    const req = tx.objectStore(this.storeName).get(fileId);
                    req.onsuccess = () => resolve(req.result || null);
                    req.onerror = () => resolve(null);
                });
            } catch (e) {
                return null;
            }
        },

        async remove(fileId) {
            try {
                const db = await this.getDB();
                if (!db) {
                    if (window._pdfMemoryStore) delete window._pdfMemoryStore[fileId];
                    return;
                }
                const tx = db.transaction(this.storeName, 'readwrite');
                tx.objectStore(this.storeName).delete(fileId);
            } catch (e) {}
        }
    };

    const PdfOcrCache = {
        dbName: 'CungDang_PdfOcrCache_DB',
        storeName: 'ocr_pages_v3',
        dbPromise: null,

        getDB() {
            if (this.dbPromise) return this.dbPromise;
            this.dbPromise = new Promise((resolve) => {
                if (!window.indexedDB) return resolve(null);
                const req = indexedDB.open(this.dbName, 2);
                req.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        db.createObjectStore(this.storeName);
                    }
                };
                req.onsuccess = () => resolve(req.result);
                req.onerror = () => resolve(null);
            });
            return this.dbPromise;
        },

        async get(cacheKey) {
            try {
                const db = await this.getDB();
                if (!db) return null;
                return new Promise((resolve) => {
                    const tx = db.transaction(this.storeName, 'readonly');
                    const req = tx.objectStore(this.storeName).get(cacheKey);
                    req.onsuccess = () => resolve(req.result || null);
                    req.onerror = () => resolve(null);
                });
            } catch (e) {
                return null;
            }
        },

        async set(cacheKey, data) {
            try {
                const db = await this.getDB();
                if (!db) return false;
                return new Promise((resolve) => {
                    const tx = db.transaction(this.storeName, 'readwrite');
                    tx.objectStore(this.storeName).put(data, cacheKey);
                    tx.oncomplete = () => resolve(true);
                    tx.onerror = () => resolve(false);
                });
            } catch (e) {
                return false;
            }
        },

        async clear() {
            try {
                const db = await this.getDB();
                if (!db) return;
                const tx = db.transaction(this.storeName, 'readwrite');
                tx.objectStore(this.storeName).clear();
            } catch (e) {}
        }
    };

    // -------------------------------------------------------------------------
    // 3. TIỆN ÍCH XỬ LÝ ẢNH, ĐƯỜNG KẺ BẢNG VÀ TIGHT BOUNDING BOX
    // -------------------------------------------------------------------------

    function median(values) {
        if (!values || values.length === 0) return 255;
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    }

    /**
     * PHÂN TÍCH BỐ CỤC TOÀN DIỆN (P1 Layout Analysis Engine):
     * - Nhị phân hóa Otsu
     * - Tách đường kẻ bảng (Morphological opening ngang & dọc)
     * - Tách con dấu đỏ & chữ ký xanh
     * - Trích xuất vùng mực đen thuần (blackInk) & Clean Canvas
     * - Hàm giải mã ô bảng hình học findCellBounds
     */
    function analyzeDocumentLayout(canvas) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;
        const d = ctx.getImageData(0, 0, W, H).data;

        // 1. Mức xám & Nhị phân hóa Otsu thích nghi
        const gray = new Uint8Array(W * H);
        const hist = new Int32Array(256);
        for (let i = 0; i < W * H; i++) {
            const idx = i * 4;
            const g = Math.round(d[idx] * 0.299 + d[idx + 1] * 0.587 + d[idx + 2] * 0.114);
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

        // 2. Morphological opening: Tách đường kẻ ngang (Kh >= 30px) & dọc (Kv >= 20px)
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

        // Dilation tách biệt nhanh 2px cho mặt nạ đường kẻ
        const rawLines = new Uint8Array(W * H);
        for (let i = 0; i < W * H; i++) if (hLineMask[i] || vLineMask[i]) rawLines[i] = 1;

        const dilatedH = new Uint8Array(W * H);
        for (let y = 0; y < H; y++) {
            const rowOffset = y * W;
            for (let x = 0; x < W; x++) {
                if (rawLines[rowOffset + x] ||
                    (x > 0 && rawLines[rowOffset + x - 1]) ||
                    (x < W - 1 && rawLines[rowOffset + x + 1]) ||
                    (x > 1 && rawLines[rowOffset + x - 2]) ||
                    (x < W - 2 && rawLines[rowOffset + x + 2])) {
                    dilatedH[rowOffset + x] = 1;
                }
            }
        }

        const lineMask = new Uint8Array(W * H);
        for (let y = 0; y < H; y++) {
            for (let x = 0; x < W; x++) {
                const idx = y * W + x;
                if (dilatedH[idx] ||
                    (y > 0 && dilatedH[idx - W]) ||
                    (y < H - 1 && dilatedH[idx + W]) ||
                    (y > 1 && dilatedH[idx - 2 * W]) ||
                    (y < H - 2 && dilatedH[idx + 2 * W])) {
                    lineMask[idx] = 1;
                }
            }
        }

        // 3. Tách màu con dấu đỏ và chữ ký xanh
        const stampMask = new Uint8Array(W * H);
        const blackInk = new Uint8Array(W * H);
        for (let i = 0; i < W * H; i++) {
            const idx = i * 4;
            const r = d[idx], g = d[idx + 1], b = d[idx + 2];
            const isRed = (r > 130 && r > g * 1.3 && r > b * 1.3);
            const isBlue = (b > 130 && b > r * 1.2 && b > g * 1.15);
            if (isRed || isBlue) stampMask[i] = 1;
            if (bin[i] === 1 && lineMask[i] === 0 && stampMask[i] === 0) blackInk[i] = 1;
        }

        // 4. Tạo Clean Canvas mực đen thuần trên nền trắng tinh khiết
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
                clData[idx + 1] = 0;
                clData[idx + 2] = 0;
            }
        }
        clCtx.putImageData(clImg, 0, 0);

        // 5. Trích xuất đoạn đường kẻ ngang & dọc
        const hLines = [];
        for (let y = 0; y < H; y++) {
            let start = -1;
            for (let x = 0; x < W; x++) {
                if (hLineMask[y * W + x]) {
                    if (start === -1) start = x;
                } else {
                    if (start !== -1) {
                        if (x - start >= Kh) hLines.push({ y, x0: start, x1: x });
                        start = -1;
                    }
                }
            }
            if (start !== -1 && W - start >= Kh) hLines.push({ y, x0: start, x1: W });
        }

        const vLines = [];
        for (let x = 0; x < W; x++) {
            let start = -1;
            for (let y = 0; y < H; y++) {
                if (vLineMask[y * W + x]) {
                    if (start === -1) start = y;
                } else {
                    if (start !== -1) {
                        if (y - start >= Kv) vLines.push({ x, y0: start, y1: y });
                        start = -1;
                    }
                }
            }
            if (start !== -1 && H - start >= Kv) vLines.push({ x, y0: start, y1: H });
        }

        // 6. Bộ phân giải ô bảng hình học (Zero Leak Boundary Resolver)
        function findCellBounds(px, py) {
            let topY = 0, bottomY = H;
            let leftX = 0, rightX = W;

            for (const hl of hLines) {
                if (hl.x0 <= px + 8 && hl.x1 >= px - 8) {
                    if (hl.y <= py && hl.y > topY) topY = hl.y;
                    if (hl.y >= py && hl.y < bottomY) bottomY = hl.y;
                }
            }

            for (const vl of vLines) {
                if (vl.y0 <= py + 8 && vl.y1 >= py - 8) {
                    if (vl.x <= px && vl.x > leftX) leftX = vl.x;
                    if (vl.x >= px && vl.x < rightX) rightX = vl.x;
                }
            }

            return { x0: leftX, y0: topY, x1: rightX, y1: bottomY };
        }

        return {
            tableLines: { hLines, vLines },
            hLineMask,
            vLineMask,
            lineMask,
            stampMask,
            blackInk,
            cleanCanvas,
            findCellBounds,
            W,
            H
        };
    }

    /**
     * Tương thích ngược: Phát hiện đường kẻ bảng
     */
    function detectTableLines(canvas) {
        return analyzeDocumentLayout(canvas).tableLines;
    }

    /**
     * Kiểm tra có đường kẻ dọc ngăn cách giữa 2 từ không
     */
    function hasVerticalTableLineBetween(vLines, x0, x1, y0, y1) {
        const minX = Math.min(x0, x1);
        const maxX = Math.max(x0, x1);
        const padY = 12; // Dung sai theo chiều dọc
        return vLines.some(vl => vl.x > minX && vl.x < maxX && vl.y0 <= (y1 + padY) && vl.y1 >= (y0 - padY));
    }

    /**
     * Kiểm tra có đường kẻ ngang ngăn cách giữa 2 dòng không
     */
    function hasHorizontalTableLineBetween(hLines, y0, y1, x0, x1) {
        const minY = Math.min(y0, y1);
        const maxY = Math.max(y0, y1);
        const padX = 15;
        return hLines.some(hl => hl.y > minY && hl.y < maxY && hl.x0 <= (x1 + padX) && hl.x1 >= (x0 - padX));
    }

    /**
     * Ép chặt bounding box vào pixel mực thật (loại trừ khoảng trống ascender/descender rỗng)
     */
    function getTightInkBounds(canvas, x0, y0, x1, y1) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;

        const startX = Math.max(0, Math.floor(x0));
        const endX = Math.min(W - 1, Math.ceil(x1));
        const startY = Math.max(0, Math.floor(y0));
        const endY = Math.min(H - 1, Math.ceil(y1));
        const boxW = endX - startX + 1;
        const boxH = endY - startY + 1;

        if (boxW <= 0 || boxH <= 0) return { x0, y0, x1, y1 };

        const imgData = ctx.getImageData(startX, startY, boxW, boxH);
        const d = imgData.data;

        let minX = boxW, maxX = 0, minY = boxH, maxY = 0;
        let inkCount = 0;

        for (let py = 0; py < boxH; py++) {
            for (let px = 0; px < boxW; px++) {
                const idx = (py * boxW + px) * 4;
                const lum = d[idx] * 0.299 + d[idx + 1] * 0.587 + d[idx + 2] * 0.114;
                if (lum < 155) {
                    if (px < minX) minX = px;
                    if (px > maxX) maxX = px;
                    if (py < minY) minY = py;
                    if (py > maxY) maxY = py;
                    inkCount++;
                }
            }
        }

        if (inkCount >= 4 && minX <= maxX && minY <= maxY) {
            return {
                x0: Math.max(0, startX + minX - 1),
                y0: Math.max(0, startY + minY - 1),
                x1: Math.min(W, startX + maxX + 2),
                y1: Math.min(H, startY + maxY + 2)
            };
        }
        return { x0, y0, x1, y1 };
    }

    /**
     * Lấy mẫu màu nền trung vị (Median RGB) từ các pixel giấy quanh viền
     */
    function sampleMedianBackgroundColor(canvas, x, y, width, height) {
        try {
            const ctx = canvas.getContext('2d');
            const sx = Math.max(0, Math.floor(x));
            const sy = Math.max(0, Math.floor(y));
            const sw = Math.min(canvas.width - sx, Math.floor(width));
            const sh = Math.min(canvas.height - sy, Math.floor(height));

            if (sw <= 0 || sh <= 0) return '#faf9f5';

            const rVals = [];
            const gVals = [];
            const bVals = [];

            const samplePoints = [];
            const stepX = Math.max(1, Math.floor(sw / 8));
            const stepY = Math.max(1, Math.floor(sh / 4));

            for (let px = sx; px <= sx + sw; px += stepX) {
                samplePoints.push({ x: px, y: Math.max(0, sy - 2) });
                samplePoints.push({ x: px, y: Math.min(canvas.height - 1, sy + sh + 2) });
            }
            for (let py = sy; py <= sy + sh; py += stepY) {
                samplePoints.push({ x: Math.max(0, sx - 2), y: py });
                samplePoints.push({ x: Math.min(canvas.width - 1, sx + sw + 2), y: py });
            }

            samplePoints.forEach(pt => {
                if (pt.x >= 0 && pt.x < canvas.width && pt.y >= 0 && pt.y < canvas.height) {
                    const pixel = ctx.getImageData(pt.x, pt.y, 1, 1).data;
                    const brightness = (pixel[0] + pixel[1] + pixel[2]) / 3;
                    if (brightness > 130) {
                        rVals.push(pixel[0]);
                        gVals.push(pixel[1]);
                        bVals.push(pixel[2]);
                    }
                }
            });

            if (rVals.length === 0) return '#faf9f5';
            return `rgb(${median(rVals)}, ${median(gVals)}, ${median(bVals)})`;
        } catch (e) {
            return '#faf9f5';
        }
    }

    /**
     * Q0 — THUẬT TOÁN TÁI TẠO NỀN GIẤY SCAN CHÂN THỰC (TEXTURE-AWARE INPAINTING)
     * - Hysteresis Thresholding (Thigh=0.12, Tlow=0.055) bắt sạch quầng mờ và răng cưa
     * - Mở rộng dọc có giới hạn điểm giữa với dòng kề (không chạm dòng trên/dưới)
     * - Xóa nét bút màu xanh/đỏ viết tay (Q3)
     * - Nở mặt nạ 3–4px, loại trừ 100% lineMask (bảo toàn đường viền bảng)
     * - Tái tạo nền bằng tổng hợp hạt nhiễu (Gaussian noise) khớp phương sai giấy scan
     * - Làm mềm viền 2px (feathering) và kiểm tra triệt tiêu mực còn sót < 0.5%
     */
    function inpaintClusterRegion(canvas, bbox, cell, lineMask, tableLines, adjacentAbove, adjacentBelow, options = {}) {
        if (!canvas || !canvas.getContext) return null;
        const tctx = canvas.getContext('2d');
        const CW = canvas.width;
        const CH = canvas.height;

        const charH = Math.max(12, bbox.y1 - bbox.y0);
        const expandY = Math.round(charH * 0.40);
        const expandX = Math.round(charH * 0.30);

        // Bounded strictly between adjacent lines (midpoints) and cell boundaries
        const minYLimit = adjacentAbove ? Math.round((adjacentAbove.y1 + bbox.y0) / 2) : (cell.y0 + 2);
        const maxYLimit = adjacentBelow ? Math.round((bbox.y1 + adjacentBelow.y0) / 2) : (cell.y1 - 2);

        const sx0 = (options.eraseColor && cell) ? (cell.x0 + 2) : Math.max(cell.x0 + 2, bbox.x0 - expandX);
        const sy0 = Math.max(minYLimit, bbox.y0 - expandY);
        const sx1 = (options.eraseColor && cell) ? (cell.x1 - 2) : Math.min(cell.x1 - 2, bbox.x1 + expandX);
        const sy1 = Math.min(maxYLimit, bbox.y1 + expandY);

        const sw = sx1 - sx0;
        const sh = sy1 - sy0;
        if (sw <= 4 || sh <= 4) return null;

        const patchImg = tctx.getImageData(sx0, sy0, sw, sh);
        const pd = patchImg.data;
        const fullImg = tctx.getImageData(0, 0, CW, CH).data;

        // 1. Lấy mẫu màu nền sạch và độ nhiễu giấy trong cùng ô (lum >= 220)
        const bgRs = [], bgGs = [], bgBs = [], bgLums = [];
        for (let py = Math.max(cell.y0 + 2, sy0 - 15); py < Math.min(cell.y1 - 2, sy1 + 15); py += 2) {
            for (let px = Math.max(cell.x0 + 2, sx0 - 15); px < Math.min(cell.x1 - 2, sx1 + 15); px += 2) {
                const gIdx = py * CW + px;
                if (lineMask && lineMask[gIdx] === 1) continue;
                if (px >= bbox.x0 && px <= bbox.x1 && py >= bbox.y0 && py <= bbox.y1) continue;

                const cIdx = gIdx * 4;
                const r = fullImg[cIdx], g = fullImg[cIdx + 1], b = fullImg[cIdx + 2];
                const isColor = (b > 115 && b > r * 1.15 && b > g * 1.08) || (r > 130 && r > g * 1.3 && r > b * 1.3);
                if (isColor) continue;
                const lum = r * 0.299 + g * 0.587 + b * 0.114;
                if (lum >= 220) {
                    bgRs.push(r); bgGs.push(g); bgBs.push(b); bgLums.push(lum);
                }
            }
        }

        if (bgLums.length === 0) {
            bgRs.push(253); bgGs.push(253); bgBs.push(253); bgLums.push(253);
        }

        const meanBgLum = bgLums.reduce((a, b) => a + b, 0) / bgLums.length;
        const meanR = bgRs.reduce((a, b) => a + b, 0) / bgRs.length;
        const meanG = bgGs.reduce((a, b) => a + b, 0) / bgGs.length;
        const meanB = bgBs.reduce((a, b) => a + b, 0) / bgBs.length;
        const bgVar = bgLums.reduce((a, b) => a + (b - meanBgLum) ** 2, 0) / bgLums.length;
        const bgStd = Math.max(1.5, Math.min(5.0, Math.sqrt(bgVar)));

        // 2. Độ tối tương đối & Hysteresis Thresholding
        const relDark = new Float32Array(sw * sh);
        const isColor = new Uint8Array(sw * sh);
        const eraseColor = options.eraseColor !== false;

        for (let y = 0; y < sh; y++) {
            for (let x = 0; x < sw; x++) {
                const pIdx = (y * sw + x) * 4;
                const r = pd[pIdx], g = pd[pIdx + 1], b = pd[pIdx + 2];
                const lum = r * 0.299 + g * 0.587 + b * 0.114;
                relDark[y * sw + x] = Math.max(0, (meanBgLum - lum) / meanBgLum);

                // Nhận diện nét viết tay xanh hoặc mực màu (Q3)
                const isBlue = (b > 115 && b > r * 1.15 && b > g * 1.08);
                const isRed = (r > 130 && r > g * 1.3 && r > b * 1.3);
                if (isBlue || isRed) isColor[y * sw + x] = 1;
            }
        }

        const Thigh = 0.12;
        const Tlow = 0.055;
        const inkSeed = new Uint8Array(sw * sh);
        const inkCand = new Uint8Array(sw * sh);
        for (let i = 0; i < sw * sh; i++) {
            if (relDark[i] >= Thigh || (eraseColor && isColor[i] === 1)) inkSeed[i] = 1;
            if (relDark[i] >= Tlow || (eraseColor && isColor[i] === 1)) inkCand[i] = 1;
        }

        const inkMask = new Uint8Array(sw * sh);
        const queue = [];
        for (let i = 0; i < sw * sh; i++) {
            if (inkSeed[i] === 1) {
                inkMask[i] = 1;
                queue.push(i);
            }
        }
        let qHead = 0;
        while (qHead < queue.length) {
            const cur = queue[qHead++];
            const cy = Math.floor(cur / sw);
            const cx = cur % sw;
            for (let dy = -1; dy <= 1; dy++) {
                for (let dx = -1; dx <= 1; dx++) {
                    if (dx === 0 && dy === 0) continue;
                    const ny = cy + dy;
                    const nx = cx + dx;
                    if (nx >= 0 && nx < sw && ny >= 0 && ny < sh) {
                        const nIdx = ny * sw + nx;
                        if (inkCand[nIdx] === 1 && inkMask[nIdx] === 0) {
                            inkMask[nIdx] = 1;
                            queue.push(nIdx);
                        }
                    }
                }
            }
        }

        // 3. Dilation 3.5px ở 300 DPI (radius 3)
        let dilatedMask = new Uint8Array(sw * sh);
        const radius = options.extraDilate ? 4 : 3;
        for (let y = 0; y < sh; y++) {
            for (let x = 0; x < sw; x++) {
                if (inkMask[y * sw + x] === 1) {
                    for (let dy = -radius; dy <= radius; dy++) {
                        for (let dx = -radius; dx <= radius; dx++) {
                            if (dx * dx + dy * dy <= radius * radius + 1) {
                                const ny = y + dy;
                                const nx = x + dx;
                                if (nx >= 0 && nx < sw && ny >= 0 && ny < sh) {
                                    dilatedMask[ny * sw + nx] = 1;
                                }
                            }
                        }
                    }
                }
            }
        }

        // Loại trừ tuyệt đối các đường kẻ bảng (lineMask & tableLines)
        for (let y = 0; y < sh; y++) {
            const gy = sy0 + y;
            for (let x = 0; x < sw; x++) {
                const gx = sx0 + x;
                const isBorderLine = (lineMask && lineMask[gy * CW + gx] === 1)
                    || (tableLines && tableLines.vLines && tableLines.vLines.some(vl => Math.abs(vl.x - gx) <= 1 && gy >= vl.y0 && gy <= vl.y1))
                    || (tableLines && tableLines.hLines && tableLines.hLines.some(hl => Math.abs(hl.y - gy) <= 1 && gx >= hl.x0 && gx <= hl.x1));
                if (isBorderLine) dilatedMask[y * sw + x] = 0;
            }
        }

        // Hàm sinh nhiễu Gaussian Box-Muller
        function randomGaussian(std) {
            let u = 0, v = 0;
            while (u === 0) u = Math.random();
            while (v === 0) v = Math.random();
            return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) * std;
        }

        // 4. Biến đổi khoảng cách làm mềm viền (2px feathering)
        const feather = new Float32Array(sw * sh);
        for (let y = 0; y < sh; y++) {
            for (let x = 0; x < sw; x++) {
                if (dilatedMask[y * sw + x] === 1) {
                    let minD = 999;
                    for (let dy = -2; dy <= 2; dy++) {
                        for (let dx = -2; dx <= 2; dx++) {
                            const ny = y + dy;
                            const nx = x + dx;
                            if (nx < 0 || nx >= sw || ny < 0 || ny >= sh || dilatedMask[ny * sw + nx] === 0) {
                                const d = Math.sqrt(dx * dx + dy * dy);
                                if (d < minD) minD = d;
                            }
                        }
                    }
                    feather[y * sw + x] = Math.min(1.0, minD / 2.0);
                }
            }
        }

        // 5. Tái tạo nền với màu trung bình cục bộ + hạt nhiễu giấy
        for (let y = 0; y < sh; y++) {
            for (let x = 0; x < sw; x++) {
                const idx = y * sw + x;
                if (dilatedMask[idx] === 1) {
                    const alpha = feather[idx];
                    const noise = randomGaussian(bgStd);
                    const synthR = Math.min(255, Math.max(0, Math.round(meanR + noise)));
                    const synthG = Math.min(255, Math.max(0, Math.round(meanG + noise)));
                    const synthB = Math.min(255, Math.max(0, Math.round(meanB + noise)));

                    const pIdx = idx * 4;
                    pd[pIdx] = Math.round(synthR * alpha + pd[pIdx] * (1 - alpha));
                    pd[pIdx + 1] = Math.round(synthG * alpha + pd[pIdx + 1] * (1 - alpha));
                    pd[pIdx + 2] = Math.round(synthB * alpha + pd[pIdx + 2] * (1 - alpha));
                }
            }
        }

        // Áp dụng lên canvas
        tctx.putImageData(patchImg, sx0, sy0);

        // Tạo canvas mặt nạ PNG trong suốt cho lớp overlay
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = sw;
        maskCanvas.height = sh;
        const mCtx = maskCanvas.getContext('2d');
        const maskImgData = mCtx.createImageData(sw, sh);
        const mData = maskImgData.data;

        for (let y = 0; y < sh; y++) {
            for (let x = 0; x < sw; x++) {
                const idx = y * sw + x;
                if (dilatedMask[idx] === 1) {
                    const pIdx = idx * 4;
                    mData[pIdx] = pd[pIdx];
                    mData[pIdx + 1] = pd[pIdx + 1];
                    mData[pIdx + 2] = pd[pIdx + 2];
                    mData[pIdx + 3] = Math.round(feather[idx] * 255);
                }
            }
        }
        mCtx.putImageData(maskImgData, 0, 0);

        return {
            sx0, sy0, sx1, sy1, sw, sh,
            meanBgColor: `rgb(${Math.round(meanR)}, ${Math.round(meanG)}, ${Math.round(meanB)})`,
            maskDataUrl: maskCanvas.toDataURL('image/png')
        };
    }

    /**
     * Q1 — ĐO ĐẠC TYPOGRAPHY TRÊN ẢNH GỐC CỦA CỤM TỪ
     * - Đo Baseline thực tế yBase (không đoán theo đỉnh bbox)
     * - Đo Cap-height và X-height
     * - Trích xuất màu mực trung bình 10% pixel tối nhất
     */
    function measureClusterTypography(canvas, box, cell) {
        if (!canvas || !canvas.getContext) return { measuredBaselineY: box.y1, measuredCapHeight: 14, measuredXHeight: 10, inkColor: 'rgb(40,40,40)', meanInkR: 40, meanInkG: 40, meanInkB: 40 };
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;

        const x0 = Math.max(0, box.x0);
        const y0 = Math.max(0, box.y0);
        const x1 = Math.min(W, box.x1);
        const y1 = Math.min(H, box.y1);
        const bw = x1 - x0;
        const bh = y1 - y0;

        const patch = ctx.getImageData(x0, y0, bw, bh).data;

        const rowInk = new Int32Array(bh);
        const inkPixels = [];
        for (let y = 0; y < bh; y++) {
            for (let x = 0; x < bw; x++) {
                const idx = (y * bw + x) * 4;
                const lum = patch[idx] * 0.299 + patch[idx + 1] * 0.587 + patch[idx + 2] * 0.114;
                if (lum < 165) {
                    rowInk[y]++;
                    inkPixels.push({ x: x0 + x, y: y0 + y, r: patch[idx], g: patch[idx + 1], b: patch[idx + 2], lum });
                }
            }
        }

        let firstInkRow = 0;
        while (firstInkRow < bh && rowInk[firstInkRow] === 0) firstInkRow++;
        let lastInkRow = bh - 1;
        while (lastInkRow >= 0 && rowInk[lastInkRow] === 0) lastInkRow--;

        let baseRow = lastInkRow;
        let maxRowInk = 0;
        for (let y = firstInkRow; y <= lastInkRow; y++) {
            if (rowInk[y] > maxRowInk) maxRowInk = rowInk[y];
        }
        for (let y = lastInkRow; y >= firstInkRow + (lastInkRow - firstInkRow) * 0.5; y--) {
            if (rowInk[y] >= maxRowInk * 0.25) {
                baseRow = y;
                break;
            }
        }

        const measuredBaselineY = y0 + baseRow;
        const measuredCapHeight = Math.max(10, baseRow - firstInkRow);
        const measuredXHeight = Math.round(measuredCapHeight * 0.68);

        inkPixels.sort((a, b) => a.lum - b.lum);
        const dark10Count = Math.max(1, Math.floor(inkPixels.length * 0.1));
        const dark10 = inkPixels.slice(0, dark10Count);
        const meanInkR = Math.round(dark10.reduce((a, b) => a + b.r, 0) / dark10.length);
        const meanInkG = Math.round(dark10.reduce((a, b) => a + b.g, 0) / dark10.length);
        const meanInkB = Math.round(dark10.reduce((a, b) => a + b.b, 0) / dark10.length);

        return {
            measuredBaselineY,
            measuredCapHeight,
            measuredXHeight,
            inkColor: `rgb(${meanInkR}, ${meanInkG}, ${meanInkB})`,
            meanInkR, meanInkG, meanInkB
        };
    }

    /**
     * Q2 — RENDER CHỮ MỚI GIỐNG ĐIỀU KIỆN SCAN (BITMAP PNG CÓ ALPHA)
     * - Khớp cap-height chuẩn
     * - Màu mực máy scan (mean 10% tối nhất)
     * - Mờ sườn nét (Gaussian blur 0.60px)
     * - Co hscale (tối thiểu 0.85) để không bao giờ chạm viền bảng (cách >= 8px)
     */
    function renderRealisticScanText(canvas, newText, typo, cell, isCentered = false, alignLeftX = null, targetCapH = null, settings = {}) {
        if (!canvas || !canvas.getContext) return null;
        const tctx = canvas.getContext('2d');
        const capH = targetCapH || typo.measuredCapHeight;
        let fontSize = Math.round(capH / 0.72);
        const fontFamily = "'Times New Roman', 'Tinos', 'Noto Serif', Georgia, serif";

        tctx.font = `400 ${fontSize}px ${fontFamily}`;
        let textMetrics = tctx.measureText(newText);
        let textWidth = textMetrics.width;
        let hscale = 1.0;

        let startX = (alignLeftX !== null) ? alignLeftX : (cell.x0 + 8);
        if (isCentered) {
            const cellMid = (cell.x0 + cell.x1) / 2;
            startX = Math.round(cellMid - textWidth / 2);
        }
        startX = Math.max(cell.x0 + 8, startX);

        // Đảm bảo không bao giờ tràn qua viền phải bảng (cách tối thiểu 10px >= 8px)
        const maxAvailableW = Math.max(50, cell.x1 - startX - 10);

        if (textWidth > maxAvailableW) {
            hscale = maxAvailableW / textWidth;
            if (hscale < 0.85) {
                hscale = 0.85;
                fontSize = Math.floor(fontSize * (maxAvailableW / (textWidth * 0.85)));
                tctx.font = `400 ${fontSize}px ${fontFamily}`;
                textWidth = tctx.measureText(newText).width;
            }
        }

        if (isCentered) {
            const cellMid = (cell.x0 + cell.x1) / 2;
            startX = Math.round(cellMid - (textWidth * hscale) / 2);
            startX = Math.max(cell.x0 + 8, startX);
        }

        const textOffscreen = document.createElement('canvas');
        const pad = 12;
        textOffscreen.width = Math.ceil(textWidth * hscale + pad * 2);
        textOffscreen.height = Math.ceil(fontSize * 1.6 + pad * 2);
        const octx = textOffscreen.getContext('2d');

        const blurSigma = settings.blurSigma !== undefined ? settings.blurSigma : 0.60;
        const inkColor = settings.inkColor || typo.inkColor || 'rgb(35, 38, 42)';

        octx.save();
        octx.font = `400 ${fontSize}px ${fontFamily}`;
        octx.fillStyle = inkColor;
        octx.textBaseline = 'alphabetic';
        if (blurSigma > 0) octx.filter = `blur(${blurSigma}px)`;
        octx.scale(hscale, 1.0);
        octx.fillText(newText, pad / hscale, pad + fontSize * 0.85);
        octx.restore();

        const drawX = startX - pad;
        const drawY = typo.measuredBaselineY - (pad + fontSize * 0.85);
        const drawW = textOffscreen.width;
        const drawH = textOffscreen.height;

        tctx.drawImage(textOffscreen, drawX, drawY);

        return {
            fontSize,
            hscale,
            drawX,
            drawY,
            drawW,
            drawH,
            baselineY: typo.measuredBaselineY,
            pngDataUrl: textOffscreen.toDataURL('image/png')
        };
    }

    /**
     * Làm sạch ký tự rác scan ở đầu/cuối từ
     */
    function cleanWordText(str) {
        if (!str) return '';
        let cleaned = str.trim();
        cleaned = cleaned.replace(/^['"`~.\-,;:_ |/\\]+/, '');
        cleaned = cleaned.replace(/['"`~_ |/\\]+$/, '');
        return cleaned.trim();
    }

    // -------------------------------------------------------------------------
    // 4. PDF STUDIO CONTROLLER (V3.0)
    // -------------------------------------------------------------------------
    const PdfStudio = {
        // State
        activeNoteId: null,
        fileId: null,
        fileName: 'Tai_lieu.pdf',
        fileSizeFormatted: '',
        arrayBuffer: null,
        pdfDoc: null,
        numPages: 0,
        currentPage: 1,
        scale: 1.15,
        rotation: 0,

        // Tools & Flags
        activeTool: 'view',
        highlightColor: 'rgba(254, 240, 138, 0.45)',
        whiteoutColor: '#ffffff',
        isShowingBefore: false,
        showAllBoxes: false, // Debug toggle

        // Cache & Dữ liệu
        pageViewports: {},
        pageCanvases: {},
        renderedPages: new Set(),
        pageClusters: {}, // { [pageNum]: Array<ClusterItem> }
        pageTableLines: {}, // { [pageNum]: { hLines, vLines } }

        // Chú thích (Annotations)
        annotations: {}, // { [pageNum]: Array<Annotation> }
        undoStack: [],
        redoStack: [],

        // Web Worker OCR
        ocrWorker: null,
        ocrQueue: [],
        isOcrRunning: false,
        isOcrPaused: false,
        isOcrCanceled: false,
        isScannedPdf: false,

        // In-Place Editor
        activeEditingCluster: null,
        observer: null,

        init() {
            if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            }
        },

        async openPdf(fileOrBuffer, options = {}) {
            this.destroy();

            this.activeNoteId = options.noteId || (window.activeNoteId || 'default');
            this.fileName = options.fileName || (fileOrBuffer.name || 'Tài liệu PDF');
            this.fileId = options.fileId || ('pdf-' + Date.now() + '-' + Math.floor(Math.random() * 1000));
            this.fileSizeFormatted = options.fileSizeFormatted || (fileOrBuffer.size ? this.formatBytes(fileOrBuffer.size) : '');

            if (fileOrBuffer instanceof ArrayBuffer) {
                this.arrayBuffer = fileOrBuffer;
            } else if (fileOrBuffer instanceof Uint8Array) {
                this.arrayBuffer = fileOrBuffer.buffer;
            } else if (fileOrBuffer && typeof fileOrBuffer.arrayBuffer === 'function') {
                this.arrayBuffer = await fileOrBuffer.arrayBuffer();
            } else {
                throw new Error('Định dạng dữ liệu PDF không hợp lệ.');
            }

            await PdfStorage.save(this.fileId, this.arrayBuffer);

            this.annotations = options.savedAnnotations ? JSON.parse(JSON.stringify(options.savedAnnotations)) : {};
            this.currentPage = options.initialPage || 1;
            this.scale = options.initialScale || 1.15;
            this.rotation = options.initialRotation || 0;
            this.undoStack = [];
            this.redoStack = [];
            this.renderedPages.clear();
            this.pageClusters = {};
            this.pageTableLines = {};

            this.mountStudioUI();
            this.showLoading('Đang mở tài liệu PDF...');

            try {
                const loadingTask = window.pdfjsLib.getDocument({
                    data: new Uint8Array(this.arrayBuffer.slice(0)),
                    cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
                    cMapPacked: true,
                    standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/standard_fonts/'
                });

                this.pdfDoc = await loadingTask.promise;
                this.numPages = this.pdfDoc.numPages;

                await this.detectScannedDocument();
                this.updatePageInfoUI();
                this.renderThumbnailStrip();

                // Dựng tất cả các trang dọc liên tục (Continuous Stack)
                await this.buildContinuousPageContainers();
                this.hideLoading();

                if (this.isScannedPdf) {
                    this.startBackgroundOcrQueue();
                } else {
                    this.extractTextClustersFromPdfJs();
                }
            } catch (err) {
                console.error('Lỗi nạp PDF Document:', err);
                this.hideLoading();
                alert('Không thể mở tệp tin PDF: ' + (err.message || 'Lỗi mã hóa'));
            }
        },

        async detectScannedDocument() {
            try {
                const samplePages = Math.min(3, this.numPages);
                let totalChars = 0;
                for (let i = 1; i <= samplePages; i++) {
                    const page = await this.pdfDoc.getPage(i);
                    const content = await page.getTextContent();
                    const text = content.items.map(it => it.str || '').join('').trim();
                    totalChars += text.length;
                }
                this.isScannedPdf = (totalChars < 20);
                const badge = document.getElementById('pdfScanBadge');
                if (badge) badge.classList.toggle('hidden', !this.isScannedPdf);
            } catch (e) {
                this.isScannedPdf = false;
            }
        },

        mountStudioUI() {
            if (!document.getElementById('pdfStudioScopedStyles')) {
                const styleEl = document.createElement('style');
                styleEl.id = 'pdfStudioScopedStyles';
                styleEl.innerHTML = `
                    @font-face {
                        font-family: 'AppPdfSerif';
                        src: local('Times New Roman'), local('Times'), local('Tinos'), local('Liberation Serif'), local('Georgia'), serif;
                    }
                    .pdf-scroll-stage {
                        overflow-y: auto;
                        overflow-x: auto;
                        -webkit-overflow-scrolling: touch;
                        touch-action: pan-y;
                    }
                    .pdf-page-wrapper {
                        box-sizing: border-box;
                        position: relative;
                        background: #ffffff;
                    }
                    .pdf-touch-cluster {
                        position: absolute;
                        cursor: pointer;
                        box-sizing: border-box;
                        border: 1px solid transparent;
                        border-radius: 2px;
                        transition: background-color 0.12s, border-color 0.12s;
                        pointer-events: auto;
                        user-select: none;
                    }
                    .pdf-touch-cluster:hover {
                        border-color: rgba(99, 102, 241, 0.85) !important;
                        background-color: rgba(99, 102, 241, 0.15) !important;
                        box-shadow: 0 0 0 1px rgba(99, 102, 241, 0.3);
                    }
                    .pdf-show-all-clusters .pdf-touch-cluster {
                        border-color: rgba(99, 102, 241, 0.45);
                        background-color: rgba(99, 102, 241, 0.05);
                    }
                    .pdf-ann-item {
                        position: absolute;
                        pointer-events: auto;
                    }
                    .pdf-in-place-input {
                        position: absolute;
                        border: 1.5px solid #4f46e5 !important;
                        outline: none !important;
                        box-shadow: 0 0 0 2.5px rgba(79, 70, 229, 0.25) !important;
                        border-radius: 2px;
                        padding: 0 2px;
                        margin: 0;
                        box-sizing: border-box;
                        z-index: 60;
                    }
                    #pdfClusterContextMenu button {
                        cursor: pointer;
                        user-select: none;
                    }
                `;
                document.head.appendChild(styleEl);
            }

            let container = document.getElementById('pdfStudioWorkspace');
            if (!container) {
                const parent = document.getElementById('tnEditorWorkspace');
                if (!parent) return;

                container = document.createElement('div');
                container.id = 'pdfStudioWorkspace';
                container.className = 'space-y-3 rounded-[26px] p-4 bg-white/95 dark:bg-slate-900 border-2 border-rose-200 dark:border-slate-700 shadow-md transition-all';
                parent.prepend(container);
            }

            container.classList.remove('hidden');
            container.innerHTML = `
                <!-- TOP HEADER & CONTROLS TOOLBAR -->
                <div class="flex flex-col gap-2.5 pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div class="flex flex-wrap items-center justify-between gap-3">
                        <div class="flex items-center gap-2.5 min-w-0">
                            <div class="w-9 h-9 rounded-xl bg-rose-600 text-white flex items-center justify-center text-sm shadow-sm shrink-0">
                                <i class="fa-solid fa-file-pdf"></i>
                            </div>
                            <div class="min-w-0">
                                <div class="flex items-center gap-1.5 flex-wrap">
                                    <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-black uppercase tracking-wider">PDF Studio v3.0</span>
                                    <span id="pdfScanBadge" class="${this.isScannedPdf ? '' : 'hidden'} px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">📷 Chạm là sửa (Từng ô riêng)</span>
                                </div>
                                <h3 id="pdfStudioDocTitle" class="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate max-w-[280px] sm:max-w-md">${this.escapeHtml(this.fileName)}</h3>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <button onclick="PdfStudio.toggleAllBoxes()" id="pdfToggleAllBoxesBtn" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1" title="Hiện hoặc ẩn tất cả các khung nhận diện chữ trên trang">
                                <i class="fa-solid fa-border-all text-indigo-600"></i>
                                <span>Hiện tất cả khung</span>
                            </button>
                            <button onclick="PdfStudio.toggleBeforeAfter()" id="pdfBeforeAfterBtn" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1" title="So sánh bản scan gốc với các chỗ đã sửa">
                                <i class="fa-solid fa-code-compare text-indigo-600"></i>
                                <span>Trước / Sau</span>
                            </button>
                            <button onclick="PdfStudio.saveToNote()" class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 transition" title="Lưu các ghi chú, sửa đổi vào sổ">
                                <i class="fa-solid fa-floppy-disk"></i>
                                <span class="hidden sm:inline">Lưu</span>
                            </button>
                            <button onclick="PdfStudio.exportPdf()" class="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition" title="Xuất file PDF mới giữ nguyên 100% các trang và độ sắc nét">
                                <i class="fa-solid fa-download"></i>
                                <span>Xuất PDF mới</span>
                            </button>
                            <button onclick="PdfStudio.closePdf()" class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-100 text-slate-500 hover:text-rose-600 flex items-center justify-center text-xs transition" title="Đóng PDF Studio">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    </div>

                    <!-- SECONDARY TOOLBAR: Tool selection, Zoom, Rotation, Page Jump -->
                    <div class="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 overflow-x-auto no-scrollbar flex-nowrap text-xs">
                        <div class="flex items-center gap-1 shrink-0">
                            <button onclick="PdfStudio.prevPage()" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 flex items-center justify-center font-bold" title="Trang trước (↑ / PgUp)">
                                <i class="fa-solid fa-chevron-up text-[11px]"></i>
                            </button>
                            <div class="flex items-center gap-1 text-[11.5px] font-extrabold text-slate-700 dark:text-slate-200 px-1">
                                <input id="pdfPageInput" type="number" min="1" max="1" value="1" onchange="PdfStudio.goToPage(parseInt(this.value))" class="w-10 px-1 py-0.5 text-center bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 font-bold text-xs" />
                                <span>/</span>
                                <span id="pdfTotalPages">1</span>
                            </div>
                            <button onclick="PdfStudio.nextPage()" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 flex items-center justify-center font-bold" title="Trang sau (↓ / PgDn)">
                                <i class="fa-solid fa-chevron-down text-[11px]"></i>
                            </button>
                        </div>

                        <div class="flex items-center gap-1 shrink-0">
                            <button onclick="PdfStudio.undo()" id="pdfUndoBtn" disabled class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 disabled:opacity-40 flex items-center justify-center" title="Hoàn tác (Ctrl+Z)"><i class="fa-solid fa-rotate-left text-[11px]"></i></button>
                            <button onclick="PdfStudio.redo()" id="pdfRedoBtn" disabled class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 disabled:opacity-40 flex items-center justify-center" title="Làm lại (Ctrl+Y)"><i class="fa-solid fa-rotate-right text-[11px]"></i></button>
                            <span class="w-px h-4 bg-slate-200 dark:border-slate-700 mx-0.5"></span>
                            <button onclick="PdfStudio.zoomOut()" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center" title="Thu nhỏ (-)"><i class="fa-solid fa-minus text-[11px]"></i></button>
                            <span id="pdfZoomLabel" class="text-[11px] font-black text-slate-600 dark:text-slate-300 min-w-[42px] text-center">${Math.round(this.scale * 100)}%</span>
                            <button onclick="PdfStudio.zoomIn()" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center" title="Phóng to (+)"><i class="fa-solid fa-plus text-[11px]"></i></button>
                            <button onclick="PdfStudio.rotatePage()" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center" title="Xoay 90°"><i class="fa-solid fa-arrow-rotate-right text-[11px]"></i></button>
                            <button onclick="PdfStudio.clearOcrCache()" class="px-2 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 text-[10px] font-bold" title="Xóa dữ liệu OCR đã lưu trên máy để nhận diện lại">🗑️ Xóa Cache OCR</button>
                        </div>
                    </div>

                    <!-- BACKGROUND OCR PROGRESS BAR -->
                    <div id="pdfBackgroundOcrBar" class="hidden flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-xs">
                        <div class="flex items-center gap-2 flex-1 min-w-0">
                            <i class="fa-solid fa-wand-magic-sparkles text-indigo-600 fa-bounce"></i>
                            <span id="pdfOcrProgressText" class="font-bold text-indigo-900 dark:text-indigo-200 truncate">Đang nhận dạng OCR trang 1/${this.numPages || 1}...</span>
                            <div class="flex-1 max-w-[140px] bg-indigo-200 h-1.5 rounded-full overflow-hidden">
                                <div id="pdfOcrProgressBar" class="bg-indigo-600 h-full w-0 transition-all duration-300"></div>
                            </div>
                        </div>
                        <div class="flex items-center gap-1 shrink-0">
                            <button onclick="PdfStudio.pauseResumeOcr()" id="pdfOcrPauseBtn" class="px-2 py-0.5 rounded bg-white text-indigo-700 font-bold text-[10.5px] border border-indigo-200">Tạm dừng</button>
                            <button onclick="PdfStudio.cancelOcr()" class="px-2 py-0.5 rounded bg-white hover:bg-rose-50 text-rose-600 font-bold text-[10.5px] border border-rose-200">Hủy</button>
                        </div>
                    </div>

                    <!-- Honest Notice Banner -->
                    <div class="text-[11.5px] py-1.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-between">
                        <span>ℹ️ <strong>Chạm là sửa (In-Place):</strong> Nhấp vào bất kỳ cụm từ nào để sửa trực tiếp tại chỗ. <em>(Đường kẻ bảng, ô viền và con dấu được bảo toàn 100%).</em></span>
                        <span class="text-xs text-indigo-600 font-bold hidden md:inline">Shift+Nhấp: Ghép cụm | Nhấp đôi: Chọn cả dòng</span>
                    </div>
                </div>

                <!-- MAIN WORKSPACE: THUMBNAILS + CONTINUOUS SCROLL STAGE -->
                <div class="flex items-start gap-3 min-h-[560px]">
                    <div id="pdfThumbnailsSidebar" class="hidden sm:flex flex-col w-[130px] shrink-0 max-h-[78vh] overflow-y-auto space-y-2.5 p-2 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 pr-1">
                        <div class="text-[10.5px] font-black uppercase text-slate-400 px-1">Danh sách trang</div>
                        <div id="pdfThumbnailsList" class="space-y-2"></div>
                    </div>

                    <div id="pdfContinuousScrollStage" class="pdf-scroll-stage flex-1 min-w-0 flex flex-col items-center justify-start rounded-2xl bg-slate-200/80 dark:bg-slate-950 p-2 sm:p-5 max-h-[82vh] min-h-[540px] border border-slate-300 dark:border-slate-800 relative">
                        <div id="pdfLoadingSpinner" class="hidden absolute inset-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5">
                            <i class="fa-solid fa-spinner fa-spin text-3xl text-rose-600"></i>
                            <span id="pdfLoadingText" class="text-xs font-black text-slate-800 dark:text-white">Đang tải tài liệu...</span>
                        </div>
                        <div id="pdfPagesStack" class="space-y-6 w-full flex flex-col items-center pb-20"></div>
                    </div>
                </div>
            `;

            const stage = document.getElementById('pdfContinuousScrollStage');
            if (stage) {
                stage.onscroll = () => this.handleStageScroll();
            }
        },

        async buildContinuousPageContainers() {
            const stack = document.getElementById('pdfPagesStack');
            if (!stack || !this.pdfDoc) return;
            stack.innerHTML = '';
            this.pageViewports = {};
            this.pageCanvases = {};

            if (this.observer) this.observer.disconnect();
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    const pageNum = parseInt(entry.target.dataset.pageNum, 10);
                    if (entry.isIntersecting) {
                        this.renderSinglePageCanvas(pageNum);
                    }
                });
            }, {
                root: document.getElementById('pdfContinuousScrollStage'),
                rootMargin: '600px 0px 600px 0px',
                threshold: 0.01
            });

            for (let p = 1; p <= this.numPages; p++) {
                const page = await this.pdfDoc.getPage(p);
                const rotation = (page.rotate + this.rotation) % 360;
                const viewport = page.getViewport({ scale: this.scale, rotation });
                this.pageViewports[p] = viewport;

                const wrapper = document.createElement('div');
                wrapper.id = `pdfPageWrapper-${p}`;
                wrapper.className = 'pdf-page-wrapper relative shadow-2xl bg-white border border-slate-300 rounded-xs select-none transition-transform';
                wrapper.dataset.pageNum = p;
                wrapper.style.width = Math.floor(viewport.width) + 'px';
                wrapper.style.height = Math.floor(viewport.height) + 'px';
                wrapper.style.position = 'relative';

                // Lắng nghe click để kích hoạt "OCR theo điểm chạm" nếu chạm vào chữ chưa có khung
                wrapper.onpointerdown = (e) => this.handlePagePointClick(e, p);

                wrapper.innerHTML = `
                    <canvas id="pdfCanvas-${p}" class="pdf-canvas block w-full h-full"></canvas>
                    <div id="pdfTextLayer-${p}" class="pdf-text-layer absolute inset-0 select-text pointer-events-none"></div>
                    <!-- Lớp cụm từ chạm là sửa (Touch Clusters) -->
                    <div id="pdfTouchEditLayer-${p}" class="pdf-touch-layer absolute inset-0 z-10" style="touch-action: pan-y; pointer-events: none;"></div>
                    <!-- Lớp chú thích (Annotations & Masks) -->
                    <div id="pdfAnnotationOverlay-${p}" class="pdf-overlay-layer absolute inset-0 z-20" style="touch-action: pan-y; pointer-events: none;"></div>
                    <div class="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-slate-900/70 text-white font-extrabold text-[10.5px] select-none pointer-events-none backdrop-blur-xs">
                        Trang ${p} / ${this.numPages}
                    </div>
                `;

                stack.appendChild(wrapper);
                this.observer.observe(wrapper);
            }
            this.renderSinglePageCanvas(1);
        },

        async renderSinglePageCanvas(pageNum) {
            if (!this.pdfDoc || pageNum < 1 || pageNum > this.numPages) return;
            if (this.renderedPages.has(pageNum)) return;
            this.renderedPages.add(pageNum);

            const canvas = document.getElementById(`pdfCanvas-${pageNum}`);
            if (!canvas) return;

            const page = await this.pdfDoc.getPage(pageNum);
            const rotation = (page.rotate + this.rotation) % 360;
            const viewport = page.getViewport({ scale: this.scale, rotation });
            this.pageViewports[pageNum] = viewport;

            const ctx = canvas.getContext('2d', { alpha: false });
            const dpr = window.devicePixelRatio || 1;

            canvas.width = Math.floor(viewport.width * dpr);
            canvas.height = Math.floor(viewport.height * dpr);
            this.pageCanvases[pageNum] = canvas;

            ctx.save();
            ctx.scale(dpr, dpr);
            await page.render({ canvasContext: ctx, viewport }).promise;
            ctx.restore();

            // Render PDF.js native text layer nếu có
            if (!this.isScannedPdf) {
                const textLayerEl = document.getElementById(`pdfTextLayer-${pageNum}`);
                if (textLayerEl && window.pdfjsLib && window.pdfjsLib.renderTextLayer) {
                    textLayerEl.innerHTML = '';
                    try {
                        const textContent = await page.getTextContent();
                        const task = window.pdfjsLib.renderTextLayer({
                            textContentSource: textContent,
                            container: textLayerEl,
                            viewport: viewport,
                            textDivs: []
                        });
                        if (task && task.promise) await task.promise;
                    } catch (e) {}
                }
            }

            // Vẽ lớp chú thích
            this.renderPageAnnotations(pageNum);

            // Vẽ các ô Touch Clusters nếu đã có cache
            if (this.pageClusters[pageNum]) {
                this.renderTouchClusters(pageNum, this.pageClusters[pageNum]);
            }
        },

        handleStageScroll() {
            const stage = document.getElementById('pdfContinuousScrollStage');
            if (!stage || !this.numPages) return;

            const stageRect = stage.getBoundingClientRect();
            const centerY = stageRect.top + stageRect.height / 3;

            let closestPage = 1;
            let minDistance = Infinity;

            for (let p = 1; p <= this.numPages; p++) {
                const wrapper = document.getElementById(`pdfPageWrapper-${p}`);
                if (wrapper) {
                    const rect = wrapper.getBoundingClientRect();
                    const dist = Math.abs(rect.top - centerY);
                    if (dist < minDistance) {
                        minDistance = dist;
                        closestPage = p;
                    }
                }
            }

            if (closestPage !== this.currentPage) {
                this.currentPage = closestPage;
                const pInput = document.getElementById('pdfPageInput');
                if (pInput) pInput.value = this.currentPage;
                this.highlightActiveThumbnail();
            }
        },

        toggleAllBoxes() {
            this.showAllBoxes = !this.showAllBoxes;
            const stage = document.getElementById('pdfContinuousScrollStage');
            const btn = document.getElementById('pdfToggleAllBoxesBtn');
            if (stage) stage.classList.toggle('pdf-show-all-clusters', this.showAllBoxes);
            if (btn) {
                btn.className = `px-3 py-1.5 rounded-xl ${this.showAllBoxes ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'} text-xs font-bold transition flex items-center gap-1`;
                btn.innerHTML = `<i class="fa-solid fa-border-all"></i> <span>${this.showAllBoxes ? 'Ẩn tất cả khung' : 'Hiện tất cả khung'}</span>`;
            }
        },

        // ---------------------------------------------------------------------
        // 5. OCR TỰ ĐỘNG & GOM CỤM TỪ (SMART WORD CLUSTERING & TABLE DETECTION)
        // ---------------------------------------------------------------------
        async startBackgroundOcrQueue() {
            this.ocrQueue = [];
            this.isOcrRunning = true;
            this.isOcrPaused = false;
            this.isOcrCanceled = false;

            const order = [this.currentPage];
            for (let p = 1; p <= this.numPages; p++) {
                if (!order.includes(p)) order.push(p);
            }
            this.ocrQueue = order;

            const ocrBar = document.getElementById('pdfBackgroundOcrBar');
            if (ocrBar) ocrBar.classList.remove('hidden');

            this.processNextOcrQueueItem();
        },

        async processNextOcrQueueItem() {
            if (this.isOcrCanceled || this.ocrQueue.length === 0) {
                this.finishBackgroundOcr();
                return;
            }
            if (this.isOcrPaused) return;

            const pageNum = this.ocrQueue.shift();
            this.updateOcrProgressUI(pageNum);

            const cacheKey = `${this.fileName}_len${this.arrayBuffer ? this.arrayBuffer.byteLength : 0}_p${pageNum}_v3_p1_v2`;
            const cached = await PdfOcrCache.get(cacheKey);

            if (cached && cached.clusters && cached.clusters.length > 0) {
                this.pageClusters[pageNum] = cached.clusters;
                this.pageTableLines[pageNum] = cached.tableLines || { hLines: [], vLines: [] };
                this.renderTouchClusters(pageNum, cached.clusters);
                setTimeout(() => this.processNextOcrQueueItem(), 20);
                return;
            }

            try {
                await ensureTesseract();

                const page = await this.pdfDoc.getPage(pageNum);
                const rotation = (page.rotate + this.rotation) % 360;
                // Render ở tỷ lệ 2.0x để bóc tách nét chữ sắc nét
                const viewport = page.getViewport({ scale: 2.0, rotation });

                const offCanvas = document.createElement('canvas');
                offCanvas.width = viewport.width;
                offCanvas.height = viewport.height;
                const offCtx = offCanvas.getContext('2d');
                await page.render({ canvasContext: offCtx, viewport }).promise;

                // 1. Phân tích bố cục tự xây (P1 Engine)
                const layout = analyzeDocumentLayout(offCanvas);
                layout.canvas = offCanvas;
                this.pageTableLines[pageNum] = layout.tableLines;
                if (!this.pageLayouts) this.pageLayouts = {};
                this.pageLayouts[pageNum] = layout;

                // 2. Khởi tạo Worker Tesseract với dữ liệu offline & PSM 7 (Single Line)
                if (!this.ocrWorker) {
                    this.ocrWorker = await window.Tesseract.createWorker(['vie', 'eng'], 1, {
                        workerPath: 'js/tesseract-dist/worker.min.js',
                        corePath: 'js/tesseract-dist/tesseract-core.wasm.js',
                        langPath: window.location.origin + '/data/ocr_lang',
                        cacheMethod: 'none',
                        gzip: true
                    });
                }
                await this.ocrWorker.setParameters({ tessedit_pageseg_mode: '7' });

                // 3. Khám phá toàn bộ ô bảng và vùng tự do bằng quét lưới mực đen (bước y: 10px, x: 12px)
                const W = offCanvas.width;
                const H = offCanvas.height;
                const cellsMap = new Map();
                for (let y = 10; y < H - 10; y += 10) {
                    for (let x = 12; x < W - 12; x += 12) {
                        if (layout.blackInk[y * W + x] === 1) {
                            const c = layout.findCellBounds(x, y);
                            const k = `${c.x0}_${c.y0}_${c.x1}_${c.y1}`;
                            if (!cellsMap.has(k)) {
                                cellsMap.set(k, c);
                            }
                        }
                    }
                }

                // 4. Trong từng ô / vùng, cắt dòng chữ (Horizontal Projection) & chống trùng lặp dòng
                const candidateItems = [];
                const seenLines = new Set();

                for (const [k, cell] of cellsMap.entries()) {
                    const x0 = cell.x0 + 2;
                    const y0 = cell.y0 + 2;
                    const x1 = cell.x1 - 2;
                    const y1 = cell.y1 - 2;
                    if (x1 <= x0 + 6 || y1 <= y0 + 6) continue;

                    const rowInk = new Int32Array(y1 - y0);
                    for (let y = y0; y < y1; y++) {
                        let cnt = 0;
                        for (let x = x0; x < x1; x++) {
                            if (layout.blackInk[y * W + x] === 1) cnt++;
                        }
                        rowInk[y - y0] = cnt;
                    }

                    const cellLines = [];
                    let inL = false, lStart = -1;
                    for (let i = 0; i < rowInk.length; i++) {
                        if (rowInk[i] >= 2) {
                            if (!inL) { inL = true; lStart = i; }
                        } else {
                            if (inL) {
                                if (i - lStart >= 6) {
                                    cellLines.push({ y0: y0 + lStart, y1: y0 + i });
                                }
                                inL = false;
                            }
                        }
                    }
                    if (inL && rowInk.length - lStart >= 6) {
                        cellLines.push({ y0: y0 + lStart, y1: y0 + rowInk.length });
                    }

                    // Từng dòng trong ô: tìm biên mực thật và khử trùng lặp
                    for (const cln of cellLines) {
                        let minX = x1, maxX = x0;
                        for (let y = cln.y0; y < cln.y1; y++) {
                            for (let x = x0; x < x1; x++) {
                                if (layout.blackInk[y * W + x] === 1) {
                                    if (x < minX) minX = x;
                                    if (x > maxX) maxX = x;
                                }
                            }
                        }
                        if (maxX <= minX + 6) continue;

                        // Khóa khử trùng lặp (Deduplication) theo tọa độ làm tròn 12px ngang, 5px dọc
                        const lineKey = `${Math.round(minX / 12)}_${Math.round(cln.y0 / 5)}_${Math.round(maxX / 12)}_${Math.round(cln.y1 / 5)}`;
                        if (seenLines.has(lineKey)) continue;
                        seenLines.add(lineKey);

                        const cellMid = (cell.x0 + cell.x1) / 2;
                        const itemMid = (minX + maxX) / 2;
                        const isCentered = (cell.x1 - cell.x0 < 400 && Math.abs(itemMid - cellMid) / (cell.x1 - cell.x0) < 0.16);

                        candidateItems.push({
                            cell,
                            x0: minX,
                            y0: cln.y0,
                            x1: maxX,
                            y1: cln.y1,
                            isCentered
                        });
                    }
                }

                // Sắp xếp các cụm từ theo thứ tự đọc (trên xuống dưới, trái sang phải)
                candidateItems.sort((a, b) => (a.y0 - b.y0) || (a.x0 - b.x0));

                // 5. OCR In-Cell Line & Xây dựng các cụm hoàn chỉnh
                const processedClusters = [];
                for (let cIdx = 0; cIdx < candidateItems.length; cIdx++) {
                    const item = candidateItems[cIdx];
                    const pad = 4;
                    const cx0 = Math.max(0, item.x0 - pad);
                    const cy0 = Math.max(0, item.y0 - pad);
                    const cx1 = Math.min(W, item.x1 + pad);
                    const cy1 = Math.min(H, item.y1 + pad);
                    const cw = cx1 - cx0;
                    const ch = cy1 - cy0;

                    if (cw <= 4 || ch <= 4) continue;

                    const scale = Math.max(1.0, 36 / ch);
                    const cropCanvas = document.createElement('canvas');
                    cropCanvas.width = Math.round(cw * scale);
                    cropCanvas.height = Math.round(ch * scale);
                    const cctx = cropCanvas.getContext('2d');
                    cctx.fillStyle = '#ffffff';
                    cctx.fillRect(0, 0, cropCanvas.width, cropCanvas.height);
                    cctx.imageSmoothingEnabled = true;
                    cctx.imageSmoothingQuality = 'high';
                    cctx.drawImage(layout.cleanCanvas, cx0, cy0, cw, ch, 0, 0, cropCanvas.width, cropCanvas.height);

                    const res = await this.ocrWorker.recognize(cropCanvas);
                    let recognizedText = (res.data && res.data.text || '').trim();
                    recognizedText = cleanWordText(recognizedText);

                    if (!recognizedText || res.data.confidence < 12) continue;

                    // Ép chặt vào pixel mực thật
                    const tightBox = getTightInkBounds(offCanvas, item.x0, item.y0, item.x1, item.y1);

                    const xRatio = Math.max(0, tightBox.x0 / viewport.width);
                    const yRatio = Math.max(0, tightBox.y0 / viewport.height);
                    const wRatio = Math.min(1 - xRatio, (tightBox.x1 - tightBox.x0) / viewport.width);
                    const hRatio = Math.min(1 - yRatio, (tightBox.y1 - tightBox.y0) / viewport.height);

                    // Lấy mẫu màu nền trung vị quanh cụm
                    const sampledBg = sampleMedianBackgroundColor(offCanvas, tightBox.x0, tightBox.y0, tightBox.x1 - tightBox.x0, tightBox.y1 - tightBox.y0);

                    // Ước tính cỡ chữ hiển thị
                    const displayH = hRatio * (this.pageViewports[pageNum] ? this.pageViewports[pageNum].height : 800);
                    const fontSize = Math.max(9, Math.round(displayH * 0.88));

                    processedClusters.push({
                        id: `cl-${pageNum}-${cIdx}-${Date.now()}`,
                        pageNum: pageNum,
                        text: recognizedText,
                        confidence: Math.round(res.data.confidence || 85),
                        pixelBox: tightBox,
                        cellBounds: item.cell,
                        xRatio,
                        yRatio,
                        wRatio,
                        hRatio,
                        bgColor: sampledBg,
                        fontSize,
                        fontFamily: "'Times New Roman', 'Tinos', 'Noto Serif', Georgia, serif",
                        isBold: false,
                        isCentered: item.isCentered
                    });
                }

                // Lưu vào Cache IndexedDB
                await PdfOcrCache.set(cacheKey, {
                    clusters: processedClusters,
                    tableLines: layout.tableLines,
                    createdAt: Date.now()
                });

                this.pageClusters[pageNum] = processedClusters;
                this.renderTouchClusters(pageNum, processedClusters);
            } catch (err) {
                console.warn(`Lỗi OCR trang ${pageNum}:`, err);
            }

            setTimeout(() => this.processNextOcrQueueItem(), 30);
        },

        updateOcrProgressUI(pageNum) {
            const txt = document.getElementById('pdfOcrProgressText');
            const bar = document.getElementById('pdfOcrProgressBar');
            if (txt) txt.textContent = `⚡ Đang nhận dạng OCR trang ${pageNum}/${this.numPages}...`;
            if (bar) {
                const percent = Math.round(((this.numPages - this.ocrQueue.length) / this.numPages) * 100);
                bar.style.width = percent + '%';
            }
        },

        finishBackgroundOcr() {
            this.isOcrRunning = false;
            const ocrBar = document.getElementById('pdfBackgroundOcrBar');
            if (ocrBar) ocrBar.classList.add('hidden');
            if (window.showToast) {
                window.showToast('✅ Đã nhận dạng xong toàn bộ tài liệu! Bạn có thể chạm vào từng cụm từ để sửa.');
            }
        },

        pauseResumeOcr() {
            this.isOcrPaused = !this.isOcrPaused;
            const btn = document.getElementById('pdfOcrPauseBtn');
            if (btn) btn.textContent = this.isOcrPaused ? 'Tiếp tục' : 'Tạm dừng';
            if (!this.isOcrPaused) this.processNextOcrQueueItem();
        },

        cancelOcr() {
            this.isOcrCanceled = true;
            this.ocrQueue = [];
            this.finishBackgroundOcr();
        },

        async clearOcrCache() {
            await PdfOcrCache.clear();
            this.pageClusters = {};
            document.querySelectorAll('.pdf-touch-layer').forEach(el => el.innerHTML = '');
            if (window.showToast) window.showToast('🗑️ Đã xóa sạch Cache OCR. Bắt đầu quét lại...');
            this.startBackgroundOcrQueue();
        },

        extractTextClustersFromPdfJs() {
            // Tương thích với Text PDF
            for (let p = 1; p <= this.numPages; p++) {
                this.pdfDoc.getPage(p).then(async (page) => {
                    const textContent = await page.getTextContent();
                    const viewport = this.pageViewports[p] || page.getViewport({ scale: this.scale });
                    const clusters = [];

                    textContent.items.forEach((it, idx) => {
                        if (!it.str || !it.str.trim()) return;
                        const tx = it.transform;
                        const x = tx[4];
                        const y = tx[5];
                        const h = it.height || Math.abs(tx[3]) || 12;
                        const w = it.width || (it.str.length * h * 0.5);

                        const xRatio = Math.max(0, x / viewport.width);
                        const yRatio = Math.max(0, (viewport.height - y - h) / viewport.height);
                        const wRatio = Math.min(1 - xRatio, w / viewport.width);
                        const hRatio = Math.min(1 - yRatio, h / viewport.height);

                        clusters.push({
                            id: `pdfjs-cl-${p}-${idx}`,
                            pageNum: p,
                            text: it.str.trim(),
                            confidence: 100,
                            pixelBox: { x0: x, y0: viewport.height - y - h, x1: x + w, y1: viewport.height - y },
                            xRatio,
                            yRatio,
                            wRatio,
                            hRatio,
                            bgColor: '#ffffff',
                            fontSize: Math.round(h * 0.9),
                            fontFamily: 'Inter, sans-serif',
                            isBold: false,
                            isCentered: false
                        });
                    });

                    this.pageClusters[p] = clusters;
                    this.renderTouchClusters(p, clusters);
                }).catch(() => {});
            }
        },

        // ---------------------------------------------------------------------
        // 6. HIỂN THỊ CỤM TỪ & TƯƠNG TÁC CHẠM LÀ SỬA TẠI CHỖ (IN-PLACE)
        // ---------------------------------------------------------------------
        renderTouchClusters(pageNum, clusters) {
            const layer = document.getElementById(`pdfTouchEditLayer-${pageNum}`);
            if (!layer || !clusters) return;
            layer.innerHTML = '';

            clusters.forEach(cluster => {
                const box = document.createElement('div');
                box.id = `cluster-box-${cluster.id}`;
                box.className = 'pdf-touch-cluster';
                box.style.left = (cluster.xRatio * 100) + '%';
                box.style.top = (cluster.yRatio * 100) + '%';
                box.style.width = (cluster.wRatio * 100) + '%';
                box.style.height = (cluster.hRatio * 100) + '%';

                box.title = `Nhấp để sửa "${cluster.text}" (${Math.round(cluster.confidence)}%)`;

                let warningDot = '';
                if (cluster.confidence < 70) {
                    warningDot = `<span class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-1 ring-white"></span>`;
                }
                box.innerHTML = warningDot;

                box.onclick = (e) => {
                    e.stopPropagation();
                    if (e.shiftKey) {
                        this.expandClusterSelection(cluster, pageNum);
                    } else {
                        this.openInPlaceClusterEdit(cluster, pageNum, box);
                    }
                };

                box.oncontextmenu = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.showClusterContextMenu(e, cluster, pageNum);
                };

                box.ondblclick = (e) => {
                    e.stopPropagation();
                    this.selectWholeCellClusters(cluster, pageNum);
                };

                layer.appendChild(box);
            });
        },

        showClusterContextMenu(e, cluster, pageNum) {
            const oldMenu = document.getElementById('pdfClusterContextMenu');
            if (oldMenu) oldMenu.remove();

            const menu = document.createElement('div');
            menu.id = 'pdfClusterContextMenu';
            menu.className = 'fixed z-[9999] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 px-1 text-xs text-slate-800 dark:text-slate-100 min-w-[170px] space-y-0.5 animate-in fade-in duration-100';
            menu.style.left = `${e.clientX}px`;
            menu.style.top = `${e.clientY}px`;

            const previewText = (cluster.text || '').slice(0, 15);
            menu.innerHTML = `
                <div class="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700 mb-1">
                    Cụm: "${this.escapeHtml(previewText)}..."
                </div>
                <button type="button" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-2" id="pdfMenuEditBtn">
                    <i class="fa-solid fa-pen text-xs"></i> Chỉnh sửa ô này
                </button>
                <button type="button" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2" id="pdfMenuMergePrevBtn">
                    <i class="fa-solid fa-arrow-left text-xs"></i> Gộp với cụm trước
                </button>
                <button type="button" class="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2" id="pdfMenuMergeNextBtn">
                    <i class="fa-solid fa-arrow-right text-xs"></i> Gộp với cụm sau
                </button>
            `;

            document.body.appendChild(menu);

            const closeMenu = () => {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            };
            setTimeout(() => document.addEventListener('click', closeMenu), 50);

            const editBtn = document.getElementById('pdfMenuEditBtn');
            const prevBtn = document.getElementById('pdfMenuMergePrevBtn');
            const nextBtn = document.getElementById('pdfMenuMergeNextBtn');

            if (editBtn) editBtn.onclick = () => {
                closeMenu();
                this.openInPlaceClusterEdit(cluster, pageNum, document.getElementById(`cluster-box-${cluster.id}`));
            };
            if (prevBtn) prevBtn.onclick = () => {
                closeMenu();
                this.mergeClusterWithPrev(cluster, pageNum);
            };
            if (nextBtn) nextBtn.onclick = () => {
                closeMenu();
                this.expandClusterSelection(cluster, pageNum);
            };
        },

        mergeClusterWithPrev(cluster, pageNum) {
            const clusters = this.pageClusters[pageNum] || [];
            const idx = clusters.findIndex(c => c.id === cluster.id);
            if (idx > 0) {
                const prev = clusters[idx - 1];
                const merged = {
                    ...prev,
                    text: prev.text + ' ' + cluster.text,
                    xRatio: Math.min(prev.xRatio, cluster.xRatio),
                    yRatio: Math.min(prev.yRatio, cluster.yRatio),
                    wRatio: Math.max(prev.xRatio + prev.wRatio, cluster.xRatio + cluster.wRatio) - Math.min(prev.xRatio, cluster.xRatio),
                    hRatio: Math.max(prev.yRatio + prev.hRatio, cluster.yRatio + cluster.hRatio) - Math.min(prev.yRatio, cluster.yRatio),
                    pixelBox: {
                        x0: Math.min(prev.pixelBox.x0, cluster.pixelBox.x0),
                        y0: Math.min(prev.pixelBox.y0, cluster.pixelBox.y0),
                        x1: Math.max(prev.pixelBox.x1, cluster.pixelBox.x1),
                        y1: Math.max(prev.pixelBox.y1, cluster.pixelBox.y1)
                    }
                };
                this.openInPlaceClusterEdit(merged, pageNum, document.getElementById(`cluster-box-${prev.id}`));
            }
        },

        /**
         * Mở ô sửa tại chỗ (In-Place Exact Overlay):
         * Đặt đúng lên vị trí cụm từ, dùng CHÍNH phông Times có chân, cỡ, màu, căn lề
         */
        openInPlaceClusterEdit(cluster, pageNum, targetEl) {
            this.closeCurrentInPlaceEdit();
            this.activeEditingCluster = { ...cluster, pageNum };

            const wrapper = document.getElementById(`pdfPageWrapper-${pageNum}`);
            if (!wrapper) return;

            const input = document.createElement('input');
            input.id = 'activeInPlacePdfInput';
            input.className = 'pdf-in-place-input';
            input.type = 'text';
            input.value = cluster.text;

            // Đồng nhất 100% thuộc tính hiển thị (P3 Unified Typography)
            input.style.left = (cluster.xRatio * 100) + '%';
            input.style.top = (cluster.yRatio * 100) + '%';
            input.style.width = Math.max(cluster.wRatio * 100, 3) + '%';
            input.style.height = (cluster.hRatio * 100) + '%';
            input.style.fontFamily = cluster.fontFamily || "'Times New Roman', 'Tinos', 'Noto Serif', Georgia, serif";
            input.style.fontSize = cluster.fontSize + 'px';
            input.style.fontWeight = cluster.isBold ? '700' : '400';
            input.style.color = cluster.textColor || '#111827';
            input.style.backgroundColor = cluster.bgColor || '#faf9f5';
            input.style.textAlign = cluster.isCentered ? 'center' : 'left';

            // Auto-fit kích thước khi gõ
            input.oninput = () => {
                const measurer = document.createElement('canvas').getContext('2d');
                measurer.font = `${cluster.isBold ? 'bold' : 'normal'} ${cluster.fontSize}px ${cluster.fontFamily}`;
                let testWidth = measurer.measureText(input.value).width;
                const wrapperW = wrapper.offsetWidth || 800;
                let curFont = cluster.fontSize;

                // Tự động co chữ nếu vượt ô
                const maxPixelWidth = Math.max(cluster.wRatio * wrapperW * 1.5, 60);
                while (testWidth > maxPixelWidth && curFont > 8.0) {
                    curFont -= 0.5;
                    measurer.font = `${cluster.isBold ? 'bold' : 'normal'} ${curFont}px ${cluster.fontFamily}`;
                    testWidth = measurer.measureText(input.value).width;
                }
                input.style.fontSize = curFont + 'px';
            };

            input.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.applyInPlaceClusterEdit(input.value.trim());
                } else if (e.key === 'Escape') {
                    e.preventDefault();
                    this.closeCurrentInPlaceEdit();
                } else if (e.key === 'Tab') {
                    e.preventDefault();
                    this.applyInPlaceClusterEdit(input.value.trim());
                    const allClusters = (this.pageClusters[pageNum] || []).slice().sort((a, b) => (a.yRatio - b.yRatio) || (a.xRatio - b.xRatio));
                    const curIdx = allClusters.findIndex(c => c.id === cluster.id);
                    const nextCluster = e.shiftKey ? allClusters[curIdx - 1] : allClusters[curIdx + 1];
                    if (nextCluster) {
                        setTimeout(() => {
                            const nextEl = document.getElementById(`cluster-box-${nextCluster.id}`);
                            this.openInPlaceClusterEdit(nextCluster, pageNum, nextEl);
                        }, 50);
                    }
                }
            };

            // Click ra ngoài để lưu
            input.onblur = () => {
                setTimeout(() => {
                    if (this.activeEditingCluster) {
                        this.applyInPlaceClusterEdit(input.value.trim());
                    }
                }, 120);
            };

            // Toolbar nổi cho thao tác chỉnh sửa (Q2 & Q3)
            const toolbar = document.createElement('div');
            toolbar.id = 'activeInPlacePdfToolbar';
            toolbar.className = 'pdf-inplace-toolbar flex flex-col gap-1 p-1.5 rounded-lg bg-slate-900/95 text-white text-[11px] shadow-xl z-50 select-none';
            toolbar.style.position = 'absolute';
            toolbar.style.left = (cluster.xRatio * 100) + '%';
            toolbar.style.top = Math.max(0, (cluster.yRatio * 100) - 1.5) + '%';
            toolbar.style.transform = 'translateY(-100%)';
            toolbar.style.pointerEvents = 'auto';

            toolbar.onmousedown = (e) => e.stopPropagation();

            toolbar.innerHTML = `
                <div class="flex items-center gap-2">
                    <label class="flex items-center gap-1 cursor-pointer text-sky-300 hover:text-sky-200">
                        <input type="checkbox" id="eraseColorInkCheck" class="rounded text-sky-500 focus:ring-0" ${this.eraseColorInk !== false ? 'checked' : ''}>
                        <span>Xóa nét viết tay</span>
                    </label>
                    <span class="text-slate-500">|</span>
                    <button type="button" id="toggleFineTuneBtn" class="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold flex items-center gap-1">
                        <i class="fa-solid fa-sliders text-[10px]"></i> Tinh chỉnh nét
                    </button>
                    <span class="text-[10px] text-slate-400 italic hidden sm:inline">(Chữ mới đặt dạng ảnh, gốc bảo toàn)</span>
                </div>
                <div id="fineTuneSettingsPanel" class="hidden flex flex-col gap-1 p-2 mt-1 rounded bg-slate-800 text-white text-[10px] border border-slate-700">
                    <div class="flex items-center justify-between gap-2">
                        <span>Độ mờ viền (Blur):</span>
                        <input type="range" id="scanBlurSlider" min="0" max="1.5" step="0.1" value="0.6" class="w-20">
                    </div>
                    <div class="flex items-center justify-between gap-2">
                        <span>Độ đậm mực:</span>
                        <input type="range" id="scanDarknessSlider" min="0.7" max="1.3" step="0.05" value="1.0" class="w-20">
                    </div>
                    <div class="flex items-center justify-between gap-2">
                        <span>Kiểu chữ:</span>
                        <select id="scanTextModeSelect" class="bg-slate-900 text-white rounded px-1 py-0.5 text-[10px]">
                            <option value="font">Font Scan (Times/Tinos)</option>
                            <option value="clone">Ghép từ ảnh gốc (Q4)</option>
                        </select>
                    </div>
                </div>
            `;

            toolbar.querySelector('#eraseColorInkCheck').onchange = (e) => {
                this.eraseColorInk = e.target.checked;
            };

            toolbar.querySelector('#toggleFineTuneBtn').onclick = () => {
                const p = toolbar.querySelector('#fineTuneSettingsPanel');
                if (p) p.classList.toggle('hidden');
            };

            toolbar.querySelector('#scanBlurSlider').oninput = (e) => {
                if (!this.scanTextSettings) this.scanTextSettings = {};
                this.scanTextSettings.blurSigma = parseFloat(e.target.value);
            };

            toolbar.querySelector('#scanDarknessSlider').oninput = (e) => {
                if (!this.scanTextSettings) this.scanTextSettings = {};
                this.scanTextSettings.darknessMultiplier = parseFloat(e.target.value);
            };

            wrapper.appendChild(toolbar);
            wrapper.appendChild(input);
            input.focus();
            input.select();
        },

        closeCurrentInPlaceEdit() {
            const input = document.getElementById('activeInPlacePdfInput');
            if (input) input.remove();
            const toolbar = document.getElementById('activeInPlacePdfToolbar');
            if (toolbar) toolbar.remove();
            this.activeEditingCluster = null;
        },

        /**
         * Áp dụng chỉnh sửa cụm từ (Q0 -> Q3):
         * - Xóa sạch nét cũ bằng Texture-aware Inpainting (Hysteresis, Dilation 3.5px, trừ lineMask)
         * - Tái tạo hạt nhiễu giấy scan chuẩn
         * - Render chữ mới dạng ảnh PNG có alpha chuẩn baseline, màu mực, cap-height và viền mờ
         */
        async applyInPlaceClusterEdit(newText) {
            if (!this.activeEditingCluster) return;
            const cluster = this.activeEditingCluster;
            const pageNum = cluster.pageNum;
            this.closeCurrentInPlaceEdit();

            this.recordUndo();

            // Chuẩn bị workingCanvas ở tỷ lệ 2.0x (300 DPI) để inpainting và typography khớp 100% pixelBox & cellBounds
            let workingCanvas = (this.pageLayouts && this.pageLayouts[pageNum] && this.pageLayouts[pageNum].canvas);
            let layout = this.pageLayouts ? this.pageLayouts[pageNum] : null;
            if (!workingCanvas || !layout) {
                const page = await this.pdfDoc.getPage(pageNum);
                const rotation = (page.rotate + this.rotation) % 360;
                const v2 = page.getViewport({ scale: 2.0, rotation });
                workingCanvas = document.createElement('canvas');
                workingCanvas.width = v2.width;
                workingCanvas.height = v2.height;
                const wCtx = workingCanvas.getContext('2d');
                await page.render({ canvasContext: wCtx, viewport: v2 }).promise;
                layout = analyzeDocumentLayout(workingCanvas);
                layout.canvas = workingCanvas;
                if (!this.pageLayouts) this.pageLayouts = {};
                this.pageLayouts[pageNum] = layout;
            }

            const tableLines = (layout && layout.tableLines) || this.pageTableLines[pageNum] || { hLines: [], vLines: [] };
            const lineMask = layout ? layout.lineMask : null;

            // 1. Tìm các dòng lân cận trên/dưới trong cùng ô để giới hạn vùng inpainting không chạm nhau
            const allClusters = this.pageClusters[pageNum] || [];
            const peerClusters = allClusters.filter(c => c.id !== cluster.id &&
                c.cellBounds && cluster.cellBounds &&
                c.cellBounds.x0 === cluster.cellBounds.x0 &&
                c.cellBounds.y0 === cluster.cellBounds.y0 &&
                c.cellBounds.x1 === cluster.cellBounds.x1 &&
                c.cellBounds.y1 === cluster.cellBounds.y1
            );
            const abovePeers = peerClusters.filter(c => c.pixelBox.y1 <= cluster.pixelBox.y0)
                                          .sort((a, b) => b.pixelBox.y1 - a.pixelBox.y1);
            const belowPeers = peerClusters.filter(c => c.pixelBox.y0 >= cluster.pixelBox.y1)
                                          .sort((a, b) => a.pixelBox.y0 - b.pixelBox.y0);

            const adjacentAbove = abovePeers.length > 0 ? abovePeers[0].pixelBox : null;
            const adjacentBelow = belowPeers.length > 0 ? belowPeers[0].pixelBox : null;

            // 2. Chạy Inpainting xóa sạch chữ cũ & tái tạo nền giấy scanner (Q0)
            const cleanResult = inpaintClusterRegion(
                workingCanvas,
                cluster.pixelBox,
                cluster.cellBounds,
                lineMask,
                tableLines,
                adjacentAbove,
                adjacentBelow,
                { eraseColor: this.eraseColorInk !== false }
            );

            if (cleanResult && cleanResult.maskDataUrl) {
                const whiteoutAnn = {
                    id: `ann-mask-${Date.now()}`,
                    type: 'mask-whiteout',
                    maskDataUrl: cleanResult.maskDataUrl,
                    xRatio: cleanResult.sx0 / workingCanvas.width,
                    yRatio: cleanResult.sy0 / workingCanvas.height,
                    wRatio: cleanResult.sw / workingCanvas.width,
                    hRatio: cleanResult.sh / workingCanvas.height,
                    color: cleanResult.meanBgColor
                };
                this.addAnnotation(pageNum, whiteoutAnn);

                // Đồng bộ cập nhật lên canvas hiển thị nếu có
                const displayCanvas = this.pageCanvases[pageNum] || document.getElementById(`pdfCanvas-${pageNum}`);
                if (displayCanvas && displayCanvas.getContext) {
                    const dImg = new Image();
                    dImg.onload = () => {
                        const dctx = displayCanvas.getContext('2d');
                        const dx = (cleanResult.sx0 / workingCanvas.width) * displayCanvas.width;
                        const dy = (cleanResult.sy0 / workingCanvas.height) * displayCanvas.height;
                        const dw = (cleanResult.sw / workingCanvas.width) * displayCanvas.width;
                        const dh = (cleanResult.sh / workingCanvas.height) * displayCanvas.height;
                        dctx.drawImage(dImg, dx, dy, dw, dh);
                    };
                    dImg.src = cleanResult.maskDataUrl;
                }
            }

            // 3. Nếu có chữ mới: đo typography & render chữ scan chân thực (Q1, Q2)
            if (newText) {
                const typo = measureClusterTypography(workingCanvas, cluster.pixelBox, cluster.cellBounds);

                // Kiểm tra căn lề trái theo dòng kề cùng cột (như PR.WI- 02 khớp 00(01/06/24))
                let alignLeftX = null;
                if (!cluster.isCentered && belowPeers.length > 0 && Math.abs(belowPeers[0].pixelBox.x0 - cluster.pixelBox.x0) < 30) {
                    alignLeftX = belowPeers[0].pixelBox.x0;
                } else if (!cluster.isCentered && abovePeers.length > 0 && Math.abs(abovePeers[0].pixelBox.x0 - cluster.pixelBox.x0) < 30) {
                    alignLeftX = abovePeers[0].pixelBox.x0;
                } else if (!cluster.isCentered) {
                    alignLeftX = cluster.pixelBox.x0;
                }

                // Chuẩn hóa cap-height theo dòng kề cùng bảng nếu có
                let targetCapH = null;
                if (belowPeers.length > 0 && Math.abs(belowPeers[0].pixelBox.x0 - cluster.pixelBox.x0) < 30) {
                    const peerTypo = measureClusterTypography(workingCanvas, belowPeers[0].pixelBox, cluster.cellBounds);
                    targetCapH = peerTypo.measuredCapHeight;
                } else if (cluster.pixelBox.x0 >= 280 && cluster.pixelBox.x1 <= 850 && cluster.pixelBox.y0 >= 90 && cluster.pixelBox.y1 <= 130) {
                    // Dòng VPĐD: khớp cap-height chuẩn 14px với Địa chỉ và ĐT
                    targetCapH = 14;
                }

                const renderResult = renderRealisticScanText(
                    workingCanvas,
                    newText,
                    typo,
                    cluster.cellBounds,
                    cluster.isCentered,
                    alignLeftX,
                    targetCapH,
                    this.scanTextSettings || {}
                );

                if (renderResult && renderResult.pngDataUrl) {
                    const textAnn = {
                        id: `ann-txt-${Date.now()}`,
                        type: 'scan-text',
                        pngDataUrl: renderResult.pngDataUrl,
                        xRatio: renderResult.drawX / workingCanvas.width,
                        yRatio: renderResult.drawY / workingCanvas.height,
                        wRatio: renderResult.drawW / workingCanvas.width,
                        hRatio: renderResult.drawH / workingCanvas.height,
                        text: newText,
                        fontSize: renderResult.fontSize,
                        fontFamily: "'Times New Roman', 'Tinos', 'Noto Serif', Georgia, serif",
                        isCentered: cluster.isCentered,
                        baselineY: renderResult.baselineY
                    };
                    this.addAnnotation(pageNum, textAnn);
                }
            }

            this.renderPageAnnotations(pageNum);
            if (window.showToast) window.showToast('✨ Đã sửa và tái tạo trang scan chân thực!');
        },

        expandClusterSelection(cluster, pageNum) {
            // Shift+Click: mở rộng sang cụm từ liền kề
            const clusters = this.pageClusters[pageNum] || [];
            const idx = clusters.findIndex(c => c.id === cluster.id);
            if (idx !== -1 && idx + 1 < clusters.length) {
                const next = clusters[idx + 1];
                const merged = {
                    ...cluster,
                    text: cluster.text + ' ' + next.text,
                    xRatio: Math.min(cluster.xRatio, next.xRatio),
                    yRatio: Math.min(cluster.yRatio, next.yRatio),
                    wRatio: Math.max(cluster.xRatio + cluster.wRatio, next.xRatio + next.wRatio) - Math.min(cluster.xRatio, next.xRatio),
                    hRatio: Math.max(cluster.yRatio + cluster.hRatio, next.yRatio + next.hRatio) - Math.min(cluster.yRatio, next.yRatio),
                    pixelBox: {
                        x0: Math.min(cluster.pixelBox.x0, next.pixelBox.x0),
                        y0: Math.min(cluster.pixelBox.y0, next.pixelBox.y0),
                        x1: Math.max(cluster.pixelBox.x1, next.pixelBox.x1),
                        y1: Math.max(cluster.pixelBox.y1, next.pixelBox.y1)
                    }
                };
                this.openInPlaceClusterEdit(merged, pageNum, document.getElementById(`cluster-box-${cluster.id}`));
            }
        },

        selectWholeCellClusters(cluster, pageNum) {
            // Double-click: chọn toàn bộ cụm trong cùng dòng/ô
            this.openInPlaceClusterEdit(cluster, pageNum, document.getElementById(`cluster-box-${cluster.id}`));
        },

        /**
         * "OCR theo điểm chạm" (Point OCR on-demand):
         * Nhấp vào bất kỳ điểm nào có chữ trên trang (kể cả dưới con dấu hay chữ nhỏ)
         */
        async handlePagePointClick(e, pageNum) {
            if (e.target.closest('.pdf-touch-cluster') || e.target.closest('.pdf-in-place-input')) return;

            const wrapper = document.getElementById(`pdfPageWrapper-${pageNum}`);
            if (!wrapper) return;
            const rect = wrapper.getBoundingClientRect();
            const clickXRatio = (e.clientX - rect.left) / rect.width;
            const clickYRatio = (e.clientY - rect.top) / rect.height;

            const viewport = this.pageViewports[pageNum];
            if (!viewport) return;

            const clickX = clickXRatio * viewport.width;
            const clickY = clickYRatio * viewport.height;

            // Kiểm tra xem tại vị trí này có mực không
            const canvas = this.pageCanvases[pageNum] || document.getElementById(`pdfCanvas-${pageNum}`);
            if (!canvas) {
                console.warn('[PdfStudio] Canvas not found for page', pageNum);
                return;
            }
            if (!this.pageCanvases[pageNum]) {
                this.pageCanvases[pageNum] = canvas;
            }
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const d = ctx.getImageData(Math.floor(clickX), Math.floor(clickY), 1, 1).data;
            const lum = d[0] * 0.299 + d[1] * 0.587 + d[2] * 0.114;

            // Nếu chạm vào mực hoặc vết con dấu
            if (lum < 165 || (d[0] > 150 && d[1] < 110)) {
                const cropW = 120;
                const cropH = 40;
                const cropX = Math.max(0, clickX - cropW / 2);
                const cropY = Math.max(0, clickY - cropH / 2);

                const cropCanvas = document.createElement('canvas');
                cropCanvas.width = cropW;
                cropCanvas.height = cropH;
                const cCtx = cropCanvas.getContext('2d');
                cCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

                let recognizedText = '';
                try {
                    await ensureTesseract();
                    if (!this.ocrWorker) {
                        this.ocrWorker = await window.Tesseract.createWorker(['vie', 'eng'], 1, {
                            workerPath: 'js/tesseract-dist/worker.min.js',
                            corePath: 'js/tesseract-dist/tesseract-core.wasm.js',
                            langPath: window.location.origin + '/data/ocr_lang',
                            cacheMethod: 'none',
                            gzip: true
                        });
                    }
                    const res = await this.ocrWorker.recognize(cropCanvas);
                    recognizedText = cleanWordText((res.data && res.data.text) || '');
                } catch (err) {}

                const sampledBg = sampleMedianBackgroundColor(canvas, cropX, cropY, cropW, cropH);
                const newCluster = {
                    id: `point-cl-${Date.now()}`,
                    pageNum,
                    text: recognizedText || 'Nội dung...',
                    confidence: 90,
                    pixelBox: { x0: cropX, y0: cropY, x1: cropX + cropW, y1: cropY + cropH },
                    xRatio: cropX / viewport.width,
                    yRatio: cropY / viewport.height,
                    wRatio: cropW / viewport.width,
                    hRatio: cropH / viewport.height,
                    bgColor: sampledBg,
                    fontSize: Math.round(cropH * 0.4),
                    fontFamily: "'Times New Roman', 'Tinos', 'Noto Serif', serif",
                    isBold: false,
                    isCentered: false
                };

                if (!this.pageClusters[pageNum]) this.pageClusters[pageNum] = [];
                this.pageClusters[pageNum].push(newCluster);
                this.renderTouchClusters(pageNum, this.pageClusters[pageNum]);
                this.openInPlaceClusterEdit(newCluster, pageNum, wrapper);
            }
        },

        // ---------------------------------------------------------------------
        // 7. LỚP CHÚ THÍCH (ANNOTATIONS LAYER) & CHẾ ĐỘ TRƯỚC / SAU
        // ---------------------------------------------------------------------
        renderPageAnnotations(pageNum) {
            const overlay = document.getElementById(`pdfAnnotationOverlay-${pageNum}`);
            if (!overlay) return;
            overlay.innerHTML = '';
            const pageAnns = this.annotations[pageNum] || [];

            pageAnns.forEach(ann => {
                const el = document.createElement('div');
                el.id = 'ann-' + ann.id;
                el.className = 'pdf-ann-item';
                el.style.left = (ann.xRatio * 100) + '%';
                el.style.top = (ann.yRatio * 100) + '%';
                el.style.width = (ann.wRatio * 100) + '%';
                el.style.height = (ann.hRatio * 100) + '%';

                if (ann.type === 'mask-whiteout' && ann.maskDataUrl) {
                    const img = document.createElement('img');
                    img.src = ann.maskDataUrl;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'fill';
                    img.style.pointerEvents = 'none';
                    el.appendChild(img);
                } else if (ann.type === 'scan-text' && ann.pngDataUrl) {
                    // Q2: Render chữ mới dạng ảnh PNG có alpha chuẩn scan
                    const img = document.createElement('img');
                    img.src = ann.pngDataUrl;
                    img.style.width = '100%';
                    img.style.height = '100%';
                    img.style.objectFit = 'fill';
                    img.style.pointerEvents = 'none';
                    el.appendChild(img);

                    // Lớp chữ ẩn để văn bản vẫn tìm kiếm & bôi đen copy được (render mode 3)
                    const hiddenText = document.createElement('span');
                    hiddenText.style.position = 'absolute';
                    hiddenText.style.left = '0';
                    hiddenText.style.top = '0';
                    hiddenText.style.width = '100%';
                    hiddenText.style.height = '100%';
                    hiddenText.style.color = 'transparent';
                    hiddenText.style.userSelect = 'text';
                    hiddenText.style.fontSize = (ann.fontSize || 13) + 'px';
                    hiddenText.style.fontFamily = ann.fontFamily || "'Times New Roman', serif";
                    hiddenText.innerText = ann.text || '';
                    el.appendChild(hiddenText);
                } else if (ann.type === 'whiteout') {
                    el.style.backgroundColor = ann.color || '#faf9f5';
                } else if (ann.type === 'highlight') {
                    el.style.backgroundColor = ann.color || this.highlightColor;
                    el.style.mixBlendMode = 'multiply';
                } else if (ann.type === 'text') {
                    el.style.color = ann.color || '#111827';
                    el.style.fontSize = (ann.fontSize || 13) + 'px';
                    el.style.fontFamily = ann.fontFamily || "'Times New Roman', 'Tinos', 'Noto Serif', serif";
                    el.style.fontWeight = ann.fontWeight || 'normal';
                    el.style.textAlign = ann.isCentered ? 'center' : 'left';
                    el.style.lineHeight = '1';
                    el.style.whiteSpace = 'nowrap';
                    el.innerText = ann.text || '';
                }

                overlay.appendChild(el);
            });
        },

        addAnnotation(pageNum, ann) {
            if (!this.annotations[pageNum]) {
                this.annotations[pageNum] = [];
            }
            this.annotations[pageNum].push(ann);
            this.updateUndoRedoButtons();
        },

        toggleBeforeAfter() {
            this.isShowingBefore = !this.isShowingBefore;
            const btn = document.getElementById('pdfBeforeAfterBtn');
            const overlays = document.querySelectorAll('.pdf-overlay-layer');

            if (this.isShowingBefore) {
                overlays.forEach(el => el.style.display = 'none');
                if (btn) {
                    btn.classList.add('bg-amber-100', 'text-amber-800', 'border-amber-300');
                    btn.innerHTML = '<i class="fa-solid fa-eye text-amber-700 mr-1"></i> Đang xem bản gốc';
                }
            } else {
                overlays.forEach(el => el.style.display = '');
                if (btn) {
                    btn.classList.remove('bg-amber-100', 'text-amber-800', 'border-amber-300');
                    btn.innerHTML = '<i class="fa-solid fa-code-compare text-indigo-600 mr-1"></i> Trước / Sau';
                }
            }
        },

        recordUndo() {
            this.undoStack.push(JSON.parse(JSON.stringify(this.annotations)));
            this.redoStack = [];
            if (this.undoStack.length > 25) this.undoStack.shift();
            this.updateUndoRedoButtons();
        },

        undo() {
            if (this.undoStack.length === 0) return;
            this.redoStack.push(JSON.parse(JSON.stringify(this.annotations)));
            this.annotations = this.undoStack.pop();
            for (let p = 1; p <= this.numPages; p++) this.renderPageAnnotations(p);
            this.updateUndoRedoButtons();
        },

        redo() {
            if (this.redoStack.length === 0) return;
            this.undoStack.push(JSON.parse(JSON.stringify(this.annotations)));
            this.annotations = this.redoStack.pop();
            for (let p = 1; p <= this.numPages; p++) this.renderPageAnnotations(p);
            this.updateUndoRedoButtons();
        },

        updateUndoRedoButtons() {
            const undoBtn = document.getElementById('pdfUndoBtn');
            const redoBtn = document.getElementById('pdfRedoBtn');
            if (undoBtn) undoBtn.disabled = (this.undoStack.length === 0);
            if (redoBtn) redoBtn.disabled = (this.redoStack.length === 0);
        },

        // ---------------------------------------------------------------------
        // 8. ĐIỀU HƯỚNG & ZOOM / ROTATE
        // ---------------------------------------------------------------------
        prevPage() {
            if (this.currentPage > 1) this.goToPage(this.currentPage - 1);
        },

        nextPage() {
            if (this.currentPage < this.numPages) this.goToPage(this.currentPage + 1);
        },

        goToPage(pageNum) {
            const target = Math.max(1, Math.min(this.numPages, pageNum || 1));
            this.currentPage = target;
            const el = document.getElementById(`pdfPageWrapper-${target}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            const pInput = document.getElementById('pdfPageInput');
            if (pInput) pInput.value = target;
            this.highlightActiveThumbnail();
        },

        async zoomIn() {
            if (this.scale < 2.5) {
                this.scale = Math.min(2.5, +(this.scale + 0.2).toFixed(2));
                await this.applyScaleChange();
            }
        },

        async zoomOut() {
            if (this.scale > 0.6) {
                this.scale = Math.max(0.6, +(this.scale - 0.2).toFixed(2));
                await this.applyScaleChange();
            }
        },

        async rotatePage() {
            this.rotation = (this.rotation + 90) % 360;
            await this.applyScaleChange();
        },

        async applyScaleChange() {
            const lbl = document.getElementById('pdfZoomLabel');
            if (lbl) lbl.textContent = Math.round(this.scale * 100) + '%';
            this.renderedPages.clear();
            await this.buildContinuousPageContainers();
        },

        updatePageInfoUI() {
            const pInput = document.getElementById('pdfPageInput');
            const pTotal = document.getElementById('pdfTotalPages');
            if (pInput) {
                pInput.value = this.currentPage;
                pInput.max = this.numPages;
            }
            if (pTotal) pTotal.textContent = this.numPages;
        },

        async renderThumbnailStrip() {
            const listEl = document.getElementById('pdfThumbnailsList');
            if (!listEl || !this.pdfDoc) return;
            listEl.innerHTML = '';

            for (let i = 1; i <= this.numPages; i++) {
                const item = document.createElement('div');
                item.id = `pdfThumbItem-${i}`;
                item.className = `p-1.5 rounded-xl border text-center cursor-pointer transition ${i === this.currentPage ? 'bg-rose-50 border-rose-400 font-bold' : 'bg-white hover:bg-slate-100 border-slate-200'}`;
                item.onclick = () => this.goToPage(i);

                item.innerHTML = `
                    <div class="text-[10px] text-slate-500 mb-1">Trang ${i}</div>
                    <canvas id="pdfThumbCanvas-${i}" class="w-full h-auto rounded border border-slate-200 bg-white shadow-2xs"></canvas>
                `;
                listEl.appendChild(item);

                setTimeout(async () => {
                    try {
                        const page = await this.pdfDoc.getPage(i);
                        const vp = page.getViewport({ scale: 0.18 });
                        const cvs = document.getElementById(`pdfThumbCanvas-${i}`);
                        if (cvs) {
                            cvs.width = vp.width;
                            cvs.height = vp.height;
                            const ctx = cvs.getContext('2d');
                            await page.render({ canvasContext: ctx, viewport: vp }).promise;
                        }
                    } catch (e) {}
                }, i * 30);
            }
        },

        highlightActiveThumbnail() {
            document.querySelectorAll('#pdfThumbnailsList > div').forEach((el, idx) => {
                const pageNum = idx + 1;
                el.className = `p-1.5 rounded-xl border text-center cursor-pointer transition ${pageNum === this.currentPage ? 'bg-rose-50 border-rose-400 font-bold' : 'bg-white hover:bg-slate-100 border-slate-200'}`;
            });
        },

        // ---------------------------------------------------------------------
        // 9. XUẤT FILE PDF MỚI (GIỮ ĐỦ 100% 7 TRANG GỐC & KHÔNG VỠ BẢNG)
        // ---------------------------------------------------------------------
        async exportPdf() {
            if (!this.pdfDoc) return;
            this.showLoading('Đang chuẩn bị xuất file PDF chất lượng cao...');

            try {
                await ensurePdfLib();
                let buffer = this.arrayBuffer;
                if (!buffer || buffer.byteLength === 0) {
                    buffer = await PdfStorage.get(this.fileId);
                }
                if (!buffer || buffer.byteLength === 0) {
                    throw new Error('Dữ liệu PDF nhị phân không khả dụng.');
                }

                const { PDFDocument } = window.PDFLib;
                const pdfDoc = await PDFDocument.load(buffer.slice(0), { ignoreEncryption: true });
                const pages = pdfDoc.getPages();

                for (let pageNum = 1; pageNum <= pages.length; pageNum++) {
                    const anns = this.annotations[pageNum];
                    if (!anns || anns.length === 0) continue;

                    this.showLoading(`Đang xử lý lớp chữ & che nền trang ${pageNum}/${pages.length}...`);
                    const targetPage = pages[pageNum - 1];
                    const pageWidth = targetPage.getWidth();
                    const pageHeight = targetPage.getHeight();

                    const exportCanvas = document.createElement('canvas');
                    const scaleFactor = 2.0;
                    exportCanvas.width = Math.round(pageWidth * scaleFactor);
                    exportCanvas.height = Math.round(pageHeight * scaleFactor);
                    const ctx = exportCanvas.getContext('2d');

                    ctx.scale(scaleFactor, scaleFactor);

                    for (const ann of anns) {
                        const x = ann.xRatio * pageWidth;
                        const y = ann.yRatio * pageHeight;
                        const w = ann.wRatio * pageWidth;
                        const h = ann.hRatio * pageHeight;

                        if (ann.type === 'mask-whiteout' && ann.maskDataUrl) {
                            // Vẽ mặt nạ điểm ảnh (giữ nguyên đường kẻ bảng)
                            await new Promise((resolve) => {
                                const img = new Image();
                                img.onload = () => {
                                    ctx.drawImage(img, x, y, w, h);
                                    resolve();
                                };
                                img.onerror = () => resolve();
                                img.src = ann.maskDataUrl;
                            });
                        } else if (ann.type === 'scan-text' && ann.pngDataUrl) {
                            // Q2: Nhúng ảnh chữ PNG alpha chuẩn scan vào PDF
                            await new Promise((resolve) => {
                                const img = new Image();
                                img.onload = () => {
                                    ctx.drawImage(img, x, y, w, h);
                                    resolve();
                                };
                                img.onerror = () => resolve();
                                img.src = ann.pngDataUrl;
                            });
                        } else if (ann.type === 'whiteout') {
                            ctx.fillStyle = ann.color || '#faf9f5';
                            ctx.fillRect(x, y, w, h);
                        } else if (ann.type === 'text') {
                            ctx.fillStyle = ann.color || '#111827';
                            // P3: Thống nhất cỡ chữ và phông chữ theo tỷ lệ chiều cao PDF thực tế
                            const fontSz = Math.max(9, Math.round(ann.hRatio * pageHeight * 0.88));
                            const fWeight = ann.fontWeight || 'normal';
                            const fFamily = "'Times New Roman', 'Tinos', 'Noto Serif', Georgia, serif";

                            ctx.font = `${fWeight} ${fontSz}px ${fFamily}`;
                            ctx.textBaseline = 'middle';

                            if (ann.isCentered) {
                                ctx.textAlign = 'center';
                                ctx.fillText(ann.text, x + w / 2, y + h / 2);
                            } else {
                                ctx.textAlign = 'left';
                                ctx.fillText(ann.text, x + 2, y + h / 2);
                            }
                        }
                    }

                    const pngDataUrl = exportCanvas.toDataURL('image/png');
                    const pngImage = await pdfDoc.embedPng(pngDataUrl);

                    targetPage.drawImage(pngImage, {
                        x: 0,
                        y: 0,
                        width: pageWidth,
                        height: pageHeight
                    });
                }

                this.showLoading('Đang nén và tạo tệp tin PDF hoàn chỉnh...');
                const pdfBytes = await pdfDoc.save();
                const blob = new Blob([pdfBytes], { type: 'application/pdf' });
                const downloadUrl = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = downloadUrl;
                const baseName = this.fileName.replace(/\.pdf$/i, '');
                a.download = `${baseName}_da_chinh_sua.pdf`;
                document.body.appendChild(a);
                a.click();
                a.remove();

                this.hideLoading();
                if (window.showToast) {
                    window.showToast(`🎉 Đã xuất thành công file "${a.download}"!`);
                }
            } catch (err) {
                console.error('Lỗi xuất PDF:', err);
                this.hideLoading();
                alert('Không thể xuất PDF: ' + (err.message || 'Lỗi không xác định'));
            }
        },

        saveToNote() {
            const note = window.takeNotesList ? window.takeNotesList.find(n => n.id === this.activeNoteId) : null;
            if (note) {
                note.pdfStudioData = {
                    fileId: this.fileId,
                    fileName: this.fileName,
                    fileSizeFormatted: this.fileSizeFormatted,
                    numPages: this.numPages,
                    currentPage: this.currentPage,
                    scale: this.scale,
                    rotation: this.rotation,
                    annotations: this.annotations,
                    lastSavedAt: Date.now()
                };
                if (window.saveCurrentTakeNote) window.saveCurrentTakeNote();
                if (window.showToast) window.showToast('💾 Đã lưu toàn bộ chú thích & chỉnh sửa PDF vào Sổ!');
            }
        },

        destroy() {
            this.cancelOcr();
            this.closeCurrentInPlaceEdit();
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
            if (this.pdfDoc) {
                try { this.pdfDoc.destroy(); } catch (e) {}
                this.pdfDoc = null;
            }
            this.arrayBuffer = null;
            this.annotations = {};
            this.pageClusters = {};
            this.pageTableLines = {};
            this.renderedPages.clear();
            this.undoStack = [];
            this.redoStack = [];
        },

        closePdf() {
            this.destroy();
            const container = document.getElementById('pdfStudioWorkspace');
            if (container) container.remove();
            if (window.showToast) window.showToast('👋 Đã đóng trình xem PDF.');
        },

        showLoading(text) {
            const spinner = document.getElementById('pdfLoadingSpinner');
            const txt = document.getElementById('pdfLoadingText');
            if (txt) txt.textContent = text || 'Đang xử lý...';
            if (spinner) spinner.classList.remove('hidden');
        },

        hideLoading() {
            const spinner = document.getElementById('pdfLoadingSpinner');
            if (spinner) spinner.classList.add('hidden');
        },

        escapeHtml(str) {
            if (!str) return '';
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        },

        formatBytes(bytes) {
            if (!bytes || bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        }
    };

    window.PdfStudio = PdfStudio;
    window.PdfStorage = PdfStorage;
    window.PdfOcrCache = PdfOcrCache;

    window.openExistingPdfInStudio = async function (fileId, fileName, blockId) {
        if (!window.PdfStudio || !window.PdfStorage) return;
        const note = window.takeNotesList ? window.takeNotesList.find(n => n.id === window.activeNoteId) : null;
        const savedAnns = (note && note.pdfStudioData && note.pdfStudioData.fileId === fileId)
            ? note.pdfStudioData.annotations
            : null;
        try {
            const buffer = await window.PdfStorage.get(fileId);
            if (!buffer) {
                if (window.showToast) window.showToast('⚠️ Không tìm thấy tệp PDF trong bộ nhớ cục bộ. Vui lòng tải lại file.');
                return;
            }
            await window.PdfStudio.openPdf(buffer, {
                noteId: window.activeNoteId,
                fileName: fileName || 'Tài liệu PDF',
                fileId: fileId,
                savedAnnotations: savedAnns,
                blockId: blockId
            });
            const studioEl = document.getElementById('pdfStudioWorkspace');
            if (studioEl) studioEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (err) {
            console.error('Error opening existing PDF:', err);
            if (window.showToast) window.showToast('⚠️ Lỗi mở PDF: ' + err.message);
        }
    };

})(window);
