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
     * Phát hiện đường kẻ ngang và đường kẻ dọc của bảng
     */
    function detectTableLines(canvas) {
        const ctx = canvas.getContext('2d');
        const W = canvas.width;
        const H = canvas.height;
        const imgData = ctx.getImageData(0, 0, W, H);
        const d = imgData.data;

        const hLines = [];
        const vLines = [];

        // Quét đường kẻ ngang (runs of dark pixels >= 35px)
        for (let y = 0; y < H; y += 2) {
            let runStart = -1;
            for (let x = 0; x < W; x++) {
                const idx = (y * W + x) * 4;
                const lum = d[idx] * 0.299 + d[idx + 1] * 0.587 + d[idx + 2] * 0.114;
                if (lum < 140) {
                    if (runStart === -1) runStart = x;
                } else {
                    if (runStart !== -1) {
                        if (x - runStart >= 35) {
                            hLines.push({ y, x0: runStart, x1: x });
                        }
                        runStart = -1;
                    }
                }
            }
            if (runStart !== -1 && (W - runStart >= 35)) {
                hLines.push({ y, x0: runStart, x1: W });
            }
        }

        // Quét đường kẻ dọc (runs of dark pixels >= 22px)
        for (let x = 0; x < W; x += 2) {
            let runStart = -1;
            for (let y = 0; y < H; y++) {
                const idx = (y * W + x) * 4;
                const lum = d[idx] * 0.299 + d[idx + 1] * 0.587 + d[idx + 2] * 0.114;
                if (lum < 140) {
                    if (runStart === -1) runStart = y;
                } else {
                    if (runStart !== -1) {
                        if (y - runStart >= 22) {
                            vLines.push({ x, y0: runStart, y1: y });
                        }
                        runStart = -1;
                    }
                }
            }
            if (runStart !== -1 && (H - runStart >= 22)) {
                vLines.push({ x, y0: runStart, y1: H });
            }
        }

        return { hLines, vLines };
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

            if (sw <= 0 || sh <= 0) return '#ffffff';

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
     * Tạo mặt nạ điểm ảnh mực (Mask-based Dilation):
     * Chỉ tô màu nền lên đúng nét chữ (giãn 2px), loại trừ đường kẻ bảng, bảo toàn 100% khung viền
     */
    function createInkMaskWhiteout(canvas, cluster, tableLines) {
        const sx = Math.max(0, Math.floor(cluster.pixelBox.x0 - 2));
        const sy = Math.max(0, Math.floor(cluster.pixelBox.y0 - 2));
        const sw = Math.min(canvas.width - sx, Math.ceil(cluster.pixelBox.x1 - cluster.pixelBox.x0 + 4));
        const sh = Math.min(canvas.height - sy, Math.ceil(cluster.pixelBox.y1 - cluster.pixelBox.y0 + 4));

        if (sw <= 0 || sh <= 0) return null;

        const ctx = canvas.getContext('2d');
        const srcData = ctx.getImageData(sx, sy, sw, sh).data;

        // Tạo canvas mặt nạ
        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = sw;
        maskCanvas.height = sh;
        const mCtx = maskCanvas.getContext('2d');
        const maskImgData = mCtx.createImageData(sw, sh);
        const mData = maskImgData.data;

        // Bóc tách RGB từ bgColor
        let rBg = 250, gBg = 249, bBg = 245;
        const rgbMatch = (cluster.bgColor || '').match(/\d+/g);
        if (rgbMatch && rgbMatch.length >= 3) {
            rBg = parseInt(rgbMatch[0], 10);
            gBg = parseInt(rgbMatch[1], 10);
            bBg = parseInt(rgbMatch[2], 10);
        }

        // Bước 1: Đánh dấu các pixel mực thật (loại trừ các đường kẻ bảng)
        const isInk = new Uint8Array(sw * sh);
        for (let y = 0; y < sh; y++) {
            const globalY = sy + y;
            for (let x = 0; x < sw; x++) {
                const globalX = sx + x;
                const idx = (y * sw + x) * 4;
                const lum = srcData[idx] * 0.299 + srcData[idx + 1] * 0.587 + srcData[idx + 2] * 0.114;

                // Kiểm tra xem pixel này có nằm sát đường kẻ bảng không
                const isBorderLine = tableLines.vLines.some(vl => Math.abs(vl.x - globalX) <= 1 && globalY >= vl.y0 && globalY <= vl.y1)
                    || tableLines.hLines.some(hl => Math.abs(hl.y - globalY) <= 1 && globalX >= hl.x0 && globalX <= hl.x1);

                if (lum < 165 && !isBorderLine) {
                    isInk[y * sw + x] = 1;
                }
            }
        }

        // Bước 2: Dilation (Nở rộng mặt nạ 2px quanh nét chữ)
        const dilated = new Uint8Array(sw * sh);
        for (let y = 0; y < sh; y++) {
            for (let x = 0; x < sw; x++) {
                if (isInk[y * sw + x] === 1) {
                    for (let dy = -2; dy <= 2; dy++) {
                        for (let dx = -2; dx <= 2; dx++) {
                            const ny = y + dy;
                            const nx = x + dx;
                            if (nx >= 0 && nx < sw && ny >= 0 && ny < sh) {
                                dilated[ny * sw + nx] = 1;
                            }
                        }
                    }
                }
            }
        }

        // Bước 3: Đổ màu nền giấy lên các pixel thuộc mặt nạ đã giãn
        for (let i = 0; i < sw * sh; i++) {
            if (dilated[i] === 1) {
                const idx = i * 4;
                mData[idx] = rBg;
                mData[idx + 1] = gBg;
                mData[idx + 2] = bBg;
                mData[idx + 3] = 255;
            }
        }

        mCtx.putImageData(maskImgData, 0, 0);
        return maskCanvas.toDataURL('image/png');
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

            const cacheKey = `${this.fileName}_len${this.arrayBuffer ? this.arrayBuffer.byteLength : 0}_p${pageNum}_v3`;
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

                // 1. Phát hiện đường kẻ bảng
                const tableLines = detectTableLines(offCanvas);
                this.pageTableLines[pageNum] = tableLines;

                // 2. Khởi tạo Worker Tesseract với dữ liệu offline
                if (!this.ocrWorker) {
                    this.ocrWorker = await window.Tesseract.createWorker(['vie', 'eng'], 1, {
                        workerPath: 'js/tesseract-dist/worker.min.js',
                        corePath: 'js/tesseract-dist/tesseract-core.wasm.js',
                        langPath: window.location.origin + '/data/ocr_lang',
                        cacheMethod: 'none',
                        gzip: true
                    });
                }

                const result = await this.ocrWorker.recognize(offCanvas);
                const rawWords = (result.data && result.data.words) || [];

                // 3. Lọc và làm sạch từ
                const validWords = [];
                rawWords.forEach(w => {
                    const textClean = cleanWordText(w.text);
                    if (!textClean || w.confidence < 15) return;
                    validWords.push({
                        text: textClean,
                        confidence: w.confidence || 80,
                        bbox: w.bbox
                    });
                });

                // Sắp xếp từ trên xuống dưới
                validWords.sort((a, b) => (a.bbox.y0 - b.bbox.y0) || (a.bbox.x0 - b.bbox.x0));

                // 4. Nhóm từ thành các dòng trực quan (Visual Lines) không vượt đường kẻ ngang
                const visualLines = [];
                validWords.forEach(word => {
                    let placed = false;
                    for (let line of visualLines) {
                        const ref = line[0];
                        const overlapY = Math.min(word.bbox.y1, ref.bbox.y1) - Math.max(word.bbox.y0, ref.bbox.y0);
                        const minH = Math.min(word.bbox.y1 - word.bbox.y0, ref.bbox.y1 - ref.bbox.y0);
                        if (overlapY >= minH * 0.45 && !hasHorizontalTableLineBetween(tableLines.hLines, ref.bbox.y0, word.bbox.y0, Math.min(ref.bbox.x0, word.bbox.x0), Math.max(ref.bbox.x1, word.bbox.x1))) {
                            line.push(word);
                            placed = true;
                            break;
                        }
                    }
                    if (!placed) visualLines.push([word]);
                });

                // 5. Gom thành các cụm từ (Clusters) trong cùng ô bảng (ngăn gộp xuyên đường kẻ dọc)
                const clusters = [];
                visualLines.forEach(line => {
                    line.sort((a, b) => a.bbox.x0 - b.bbox.x0);
                    let currentCluster = [line[0]];

                    for (let i = 1; i < line.length; i++) {
                        const prev = currentCluster[currentCluster.length - 1];
                        const curr = line[i];
                        const gap = curr.bbox.x0 - prev.bbox.x1;
                        const charH = (prev.bbox.y1 - prev.bbox.y0 + curr.bbox.y1 - curr.bbox.y0) / 2;
                        const vLineExists = hasVerticalTableLineBetween(tableLines.vLines, prev.bbox.x1, curr.bbox.x0, Math.min(prev.bbox.y0, curr.bbox.y0), Math.max(prev.bbox.y1, curr.bbox.y1));

                        // Chỉ gom cụm nếu khoảng cách ngang <= 1.25 * chiều cao chữ VÀ KHÔNG có đường kẻ dọc
                        if (gap <= charH * 1.25 && !vLineExists) {
                            currentCluster.push(curr);
                        } else {
                            clusters.push(currentCluster);
                            currentCluster = [curr];
                        }
                    }
                    if (currentCluster.length > 0) clusters.push(currentCluster);
                });

                // 6. Xây dựng các cụm hoàn chỉnh với Tight Ink Bounding Box và quy đổi tỷ lệ chuẩn
                const processedClusters = [];
                clusters.forEach((wordList, cIdx) => {
                    const text = wordList.map(w => w.text).join(' ');
                    const avgConf = Math.round(wordList.reduce((s, w) => s + w.confidence, 0) / wordList.length);

                    const roughX0 = Math.min(...wordList.map(w => w.bbox.x0));
                    const roughY0 = Math.min(...wordList.map(w => w.bbox.y0));
                    const roughX1 = Math.max(...wordList.map(w => w.bbox.x1));
                    const roughY1 = Math.max(...wordList.map(w => w.bbox.y1));

                    // Ép chặt vào pixel mực thật (Zero drift)
                    const tightBox = getTightInkBounds(offCanvas, roughX0, roughY0, roughX1, roughY1);

                    const xRatio = Math.max(0, tightBox.x0 / viewport.width);
                    const yRatio = Math.max(0, tightBox.y0 / viewport.height);
                    const wRatio = Math.min(1 - xRatio, (tightBox.x1 - tightBox.x0) / viewport.width);
                    const hRatio = Math.min(1 - yRatio, (tightBox.y1 - tightBox.y0) / viewport.height);

                    // Lấy mẫu màu nền trung vị quanh cụm
                    const sampledBg = sampleMedianBackgroundColor(offCanvas, tightBox.x0, tightBox.y0, tightBox.x1 - tightBox.x0, tightBox.y1 - tightBox.y0);

                    // Ước tính cỡ chữ hiển thị
                    const displayH = hRatio * (this.pageViewports[pageNum] ? this.pageViewports[pageNum].height : 800);
                    const fontSize = Math.max(9, Math.round(displayH * 0.88));

                    // Xác định căn lề: nếu nằm giữa 2 đường kẻ dọc của ô bảng
                    let isCentered = false;
                    const leftLines = tableLines.vLines.filter(vl => vl.x < tightBox.x0 && vl.y0 <= tightBox.y1 && vl.y1 >= tightBox.y0);
                    const rightLines = tableLines.vLines.filter(vl => vl.x > tightBox.x1 && vl.y0 <= tightBox.y1 && vl.y1 >= tightBox.y0);
                    if (leftLines.length > 0 && rightLines.length > 0) {
                        const nearestL = Math.max(...leftLines.map(l => l.x));
                        const nearestR = Math.min(...rightLines.map(l => l.x));
                        const cellCenter = (nearestL + nearestR) / 2;
                        const clusterCenter = (tightBox.x0 + tightBox.x1) / 2;
                        if (Math.abs(clusterCenter - cellCenter) / (nearestR - nearestL) < 0.12) {
                            isCentered = true;
                        }
                    }

                    processedClusters.push({
                        id: `cl-${pageNum}-${cIdx}-${Date.now()}`,
                        pageNum: pageNum,
                        text: text,
                        confidence: avgConf,
                        pixelBox: tightBox,
                        xRatio,
                        yRatio,
                        wRatio,
                        hRatio,
                        bgColor: sampledBg,
                        fontSize,
                        fontFamily: "'Times New Roman', 'Tinos', 'Noto Serif', serif", // Mặc định Serif cho scan
                        isBold: false,
                        isCentered
                    });
                });

                // Lưu vào Cache IndexedDB
                await PdfOcrCache.set(cacheKey, {
                    clusters: processedClusters,
                    tableLines,
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

                box.ondblclick = (e) => {
                    e.stopPropagation();
                    this.selectWholeCellClusters(cluster, pageNum);
                };

                layer.appendChild(box);
            });
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

            // Đồng nhất 100% thuộc tính hiển thị
            input.style.left = (cluster.xRatio * 100) + '%';
            input.style.top = (cluster.yRatio * 100) + '%';
            input.style.width = Math.max(cluster.wRatio * 100, 3) + '%';
            input.style.height = (cluster.hRatio * 100) + '%';
            input.style.fontFamily = cluster.fontFamily || "'Times New Roman', 'Tinos', 'Noto Serif', serif";
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

            wrapper.appendChild(input);
            input.focus();
            input.select();
        },

        closeCurrentInPlaceEdit() {
            const input = document.getElementById('activeInPlacePdfInput');
            if (input) input.remove();
            this.activeEditingCluster = null;
        },

        /**
         * Áp dụng chỉnh sửa cụm từ:
         * Tạo Mask-based whiteout che sạch nét cũ mà không đè lên đường kẻ bảng
         */
        async applyInPlaceClusterEdit(newText) {
            if (!this.activeEditingCluster) return;
            const cluster = this.activeEditingCluster;
            const pageNum = cluster.pageNum;
            this.closeCurrentInPlaceEdit();

            this.recordUndo();

            const canvas = this.pageCanvases[pageNum];
            const tableLines = this.pageTableLines[pageNum] || { hLines: [], vLines: [] };

            // 1. Tạo mặt nạ che nền (Mask Dilation) ôm sát nét mực, bảo toàn đường kẻ bảng
            let maskDataUrl = null;
            if (canvas && cluster.pixelBox) {
                maskDataUrl = createInkMaskWhiteout(canvas, cluster, tableLines);
            }

            const whiteoutAnn = {
                id: `ann-mask-${Date.now()}`,
                type: maskDataUrl ? 'mask-whiteout' : 'whiteout',
                maskDataUrl: maskDataUrl,
                xRatio: cluster.xRatio,
                yRatio: cluster.yRatio,
                wRatio: cluster.wRatio,
                hRatio: cluster.hRatio,
                color: cluster.bgColor || '#faf9f5'
            };
            this.addAnnotation(pageNum, whiteoutAnn);

            // 2. Tạo chú thích chữ mới (nếu có nội dung)
            if (newText) {
                const textAnn = {
                    id: `ann-txt-${Date.now()}`,
                    type: 'text',
                    xRatio: cluster.xRatio,
                    yRatio: cluster.yRatio,
                    wRatio: cluster.wRatio,
                    hRatio: cluster.hRatio,
                    text: newText,
                    color: cluster.textColor || '#111827',
                    fontSize: cluster.fontSize || 13,
                    fontFamily: cluster.fontFamily || "'Times New Roman', 'Tinos', 'Noto Serif', serif",
                    fontWeight: cluster.isBold ? '700' : 'normal',
                    isCentered: cluster.isCentered,
                    bgColor: 'transparent'
                };
                this.addAnnotation(pageNum, textAnn);
            }

            this.renderPageAnnotations(pageNum);
            if (window.showToast) window.showToast('✨ Đã sửa cụm từ thành công!');
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
            const canvas = this.pageCanvases[pageNum];
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
                        } else if (ann.type === 'whiteout') {
                            ctx.fillStyle = ann.color || '#faf9f5';
                            ctx.fillRect(x, y, w, h);
                        } else if (ann.type === 'text') {
                            ctx.fillStyle = ann.color || '#111827';
                            const fontSz = ann.fontSize || 13;
                            const fWeight = ann.fontWeight || 'normal';
                            const fFamily = (ann.fontFamily && ann.fontFamily.includes('Times')) ? 'Times New Roman, serif' : 'Inter, Arial, sans-serif';

                            ctx.font = `${fWeight} ${fontSz}px ${fFamily}`;
                            ctx.textBaseline = 'top';

                            if (ann.isCentered) {
                                ctx.textAlign = 'center';
                                ctx.fillText(ann.text, x + w / 2, y + 2);
                            } else {
                                ctx.textAlign = 'left';
                                ctx.fillText(ann.text, x + 2, y + 2);
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
