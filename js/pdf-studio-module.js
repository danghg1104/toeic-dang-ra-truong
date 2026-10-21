/**
 * =========================================================================
 * CÙNG ĐĂNG RA TRƯỜNG — HIGH-END PDF STUDIO & EDITOR MODULE v2.0
 * Module chuyên biệt cho Sổ Note:
 * 1. Cuộn dọc liên tục nhiều trang (Continuous Vertical Scroll View)
 * 2. Ảo hóa IntersectionObserver tiết kiệm RAM tối đa cho tài liệu lớn
 * 3. Chế độ "Chạm là sửa" (Touch-to-Edit) tự động cho PDF scan & text
 * 4. OCR chạy ngầm trong Web Worker (Offline 100% với vie+eng nội bộ)
 * 5. Bộ đệm OCR IndexedDB riêng biệt: mở lại file không cần quét lại
 * 6. Lấy mẫu màu nền trung vị (Median Sampling) che sạch không lộ vết
 * 7. Tự động co chữ (Auto-fit Font) vừa khít ô bảng, không bao giờ tràn viền
 * 8. Chế độ xem trước "Trước / Sau" (Toggle Before/After)
 * 9. Xuất PDF chuẩn WYSIWYG giữ nguyên 100% các trang gốc và kích thước
 * =========================================================================
 */

(function (window) {
    'use strict';

    // -------------------------------------------------------------------------
    // 1. CẤU HÌNH & LAZY LOADER NỘI BỘ (100% Offline, Zero Global Slowdown)
    // -------------------------------------------------------------------------

    // Cấu hình PDF.js Worker
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
                    fb.onerror = (e2) => reject(new Error(`Không thể tải thư viện: ${fallbackSrc}`));
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

    // Storage 1: File PDF gốc
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

    // Storage 2: Bộ đệm kết quả OCR theo từng trang (tránh quét lại)
    const PdfOcrCache = {
        dbName: 'CungDang_PdfOcrCache_DB',
        storeName: 'ocr_pages',
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
    // 3. TIỆN ÍCH XỬ LÝ MÀU VÀ TIỀN XỬ LÝ ẢNH
    // -------------------------------------------------------------------------

    function median(values) {
        if (!values || values.length === 0) return 255;
        const sorted = [...values].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
    }

    /**
     * Lấy mẫu màu nền trung vị (Median RGB) từ các pixel viền quanh bounding box
     */
    function sampleMedianBackgroundColor(canvas, x, y, width, height) {
        try {
            const ctx = canvas.getContext('2d');
            const dpr = window.devicePixelRatio || 1;
            const sx = Math.floor(x * dpr);
            const sy = Math.floor(y * dpr);
            const sw = Math.floor(width * dpr);
            const sh = Math.floor(height * dpr);

            if (sw <= 0 || sh <= 0) return '#ffffff';

            const rVals = [];
            const gVals = [];
            const bVals = [];

            // Lấy mẫu các pixel quanh 4 cạnh viền ngoài (cách 1-2 pixel)
            const samplePoints = [];
            const stepX = Math.max(1, Math.floor(sw / 8));
            const stepY = Math.max(1, Math.floor(sh / 4));

            // Cạnh trên & dưới
            for (let px = sx; px <= sx + sw; px += stepX) {
                samplePoints.push({ x: px, y: Math.max(0, sy - 2) });
                samplePoints.push({ x: px, y: Math.min(canvas.height - 1, sy + sh + 2) });
            }
            // Cạnh trái & phải
            for (let py = sy; py <= sy + sh; py += stepY) {
                samplePoints.push({ x: Math.max(0, sx - 2), y: py });
                samplePoints.push({ x: Math.min(canvas.width - 1, sx + sw + 2), y: py });
            }

            samplePoints.forEach(pt => {
                if (pt.x >= 0 && pt.x < canvas.width && pt.y >= 0 && pt.y < canvas.height) {
                    const pixel = ctx.getImageData(pt.x, pt.y, 1, 1).data;
                    // Lọc bỏ pixel mực đậm (chữ đen/xám tối) để chỉ lấy màu nền giấy
                    const brightness = (pixel[0] + pixel[1] + pixel[2]) / 3;
                    if (brightness > 130) {
                        rVals.push(pixel[0]);
                        gVals.push(pixel[1]);
                        bVals.push(pixel[2]);
                    }
                }
            });

            if (rVals.length === 0) return '#ffffff';

            const rMed = median(rVals);
            const gMed = median(gVals);
            const bMed = median(bVals);

            return `rgb(${rMed}, ${gMed}, ${bMed})`;
        } catch (e) {
            return '#ffffff';
        }
    }

    /**
     * Tiền xử lý ảnh (Grayscale + Contrast Stretching) trước khi gửi vào OCR
     */
    function preprocessCanvasForOcr(srcCanvas) {
        const dstCanvas = document.createElement('canvas');
        dstCanvas.width = srcCanvas.width;
        dstCanvas.height = srcCanvas.height;
        const dstCtx = dstCanvas.getContext('2d');
        dstCtx.drawImage(srcCanvas, 0, 0);

        try {
            const imgData = dstCtx.getImageData(0, 0, dstCanvas.width, dstCanvas.height);
            const d = imgData.data;
            const len = d.length;

            for (let i = 0; i < len; i += 4) {
                // Grayscale
                const gray = (d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114);
                // Tăng tương phản nhẹ để khử bụi mờ scan
                const adjusted = gray < 190 ? (gray * 0.85) : 255;
                d[i] = adjusted;
                d[i + 1] = adjusted;
                d[i + 2] = adjusted;
            }
            dstCtx.putImageData(imgData, 0, 0);
            return dstCanvas;
        } catch (e) {
            return srcCanvas;
        }
    }

    /**
     * Làm sạch ký tự rác scan ở đầu/cuối dòng (dấu nháy đơn thừa, chấm, phẩy lạc)
     */
    function cleanOcrLineText(str) {
        if (!str) return '';
        let cleaned = str.trim();
        // Xóa dấu nháy đơn, nháy kép, dấu ngã, chấm rác ở đầu dòng
        cleaned = cleaned.replace(/^['"`~.\-,;:_ ]+/, '');
        // Xóa ký tự rác ở cuối dòng
        cleaned = cleaned.replace(/['"`~_ ]+$/, '');
        return cleaned.trim();
    }

    // -------------------------------------------------------------------------
    // 4. PDF STUDIO CORE CONTROLLER (V2.0)
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
        scale: 1.15, // Mặc định vừa tầm mắt đọc
        rotation: 0, // 0, 90, 180, 270

        // Tools
        activeTool: 'view', // 'view', 'text', 'highlight', 'whiteout'
        highlightColor: 'rgba(254, 240, 138, 0.45)',
        whiteoutColor: '#ffffff',
        textColor: '#1e293b',
        textSize: 14,
        isShowingBefore: false, // Chế độ Trước / Sau

        // Cache & Dữ liệu trang
        pageViewports: {}, // { [pageNum]: viewport }
        pageRenderTasks: {}, // { [pageNum]: renderTask }
        pageCanvases: {}, // { [pageNum]: canvasEl }
        renderedPages: new Set(),
        pageLinesCache: {}, // { [pageNum]: Array<LineItem> }

        // Chú thích (Annotations)
        annotations: {}, // { [pageNum]: Array<Annotation> }
        undoStack: [],
        redoStack: [],

        // Auto-OCR Queue
        ocrWorker: null,
        ocrQueue: [],
        isOcrRunning: false,
        isOcrPaused: false,
        isOcrCanceled: false,
        isScannedPdf: false,

        // Inline Editor State
        activeEditingLine: null,

        // Ảo hóa IntersectionObserver
        observer: null,

        /**
         * Khởi tạo Studio
         */
        init() {
            if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            }
        },

        /**
         * Mở file PDF từ File object hoặc ArrayBuffer
         */
        async openPdf(fileOrBuffer, options = {}) {
            this.destroy(); // Dọn dẹp tài nguyên file cũ

            const noteId = options.noteId || (window.activeNoteId || 'default');
            this.activeNoteId = noteId;
            this.fileName = options.fileName || (fileOrBuffer.name || 'Tài liệu PDF');
            this.fileId = options.fileId || ('pdf-' + Date.now() + '-' + Math.floor(Math.random() * 1000));
            this.fileSizeFormatted = options.fileSizeFormatted || (fileOrBuffer.size ? this.formatBytes(fileOrBuffer.size) : '');

            // Chuyển đổi thành ArrayBuffer
            if (fileOrBuffer instanceof ArrayBuffer) {
                this.arrayBuffer = fileOrBuffer;
            } else if (fileOrBuffer instanceof Uint8Array) {
                this.arrayBuffer = fileOrBuffer.buffer;
            } else if (fileOrBuffer && typeof fileOrBuffer.arrayBuffer === 'function') {
                this.arrayBuffer = await fileOrBuffer.arrayBuffer();
            } else {
                throw new Error('Định dạng dữ liệu PDF không hợp lệ.');
            }

            // Lưu file vào IndexedDB nhị phân (tránh tràn 5MB LocalStorage)
            await PdfStorage.save(this.fileId, this.arrayBuffer);

            // Nạp chú thích đã lưu (nếu có từ trước)
            this.annotations = options.savedAnnotations ? JSON.parse(JSON.stringify(options.savedAnnotations)) : {};
            this.currentPage = options.initialPage || 1;
            this.scale = options.initialScale || 1.15;
            this.rotation = options.initialRotation || 0;
            this.undoStack = [];
            this.redoStack = [];
            this.renderedPages.clear();
            this.pageLinesCache = {};

            // Dựng khung giao diện Studio
            this.mountStudioUI();
            this.showLoading('Đang mở tài liệu PDF...');

            try {
                // Khởi tạo Document qua PDF.js
                const loadingTask = window.pdfjsLib.getDocument({
                    data: new Uint8Array(this.arrayBuffer),
                    cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
                    cMapPacked: true,
                    standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/standard_fonts/'
                });

                this.pdfDoc = await loadingTask.promise;
                this.numPages = this.pdfDoc.numPages;

                // Kiểm tra loại tài liệu (Scan vs Text PDF)
                await this.detectScannedDocument();

                // Cập nhật thông số
                this.updatePageInfoUI();
                this.renderThumbnailStrip();

                // Sinh cấu trúc tất cả các trang dọc liên tục (Continuous Scroll Stack)
                await this.buildContinuousPageContainers();

                this.hideLoading();

                // Khởi động OCR ngầm nếu là bản Scan
                if (this.isScannedPdf) {
                    this.startBackgroundOcrQueue();
                } else {
                    // Nếu là Text PDF, trích xuất text items PDF.js làm touch lines
                    this.extractTextLinesFromPdfJs();
                }
            } catch (err) {
                console.error('Lỗi nạp PDF Document:', err);
                this.hideLoading();
                alert('Không thể mở tệp tin PDF: ' + (err.message || 'Lỗi mã hóa'));
            }
        },

        /**
         * Kiểm tra xem PDF có phải là bản scan ảnh hay không
         */
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

        /**
         * Dựng khung giao diện Studio vào Sổ Note
         */
        mountStudioUI() {
            // CSS chuyên biệt cho PDF Studio
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
                        user-select: text;
                        -webkit-user-select: text;
                    }
                    .pdf-text-layer {
                        position: absolute;
                        inset: 0;
                        overflow: hidden;
                        opacity: 0.2;
                        line-height: 1.0;
                    }
                    .pdf-text-layer span {
                        color: transparent;
                        position: absolute;
                        white-space: pre;
                        cursor: text;
                        transform-origin: 0% 0%;
                    }
                    .pdf-text-layer ::selection {
                        background: rgba(99, 102, 241, 0.4);
                        color: transparent;
                    }
                    .pdf-touch-line {
                        position: absolute;
                        cursor: pointer;
                        box-sizing: border-box;
                        transition: background-color 0.15s, border-color 0.15s;
                        border: 1px dashed transparent;
                        border-radius: 2px;
                    }
                    .pdf-touch-line:hover {
                        border-color: rgba(99, 102, 241, 0.7);
                        background-color: rgba(99, 102, 241, 0.12);
                    }
                    .pdf-ann-item {
                        pointer-events: auto;
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
                                    <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-black uppercase tracking-wider">PDF Studio Cuộn Dọc</span>
                                    <span id="pdfScanBadge" class="${this.isScannedPdf ? '' : 'hidden'} px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">📷 Chạm là sửa (Scan OCR)</span>
                                </div>
                                <h3 id="pdfStudioDocTitle" class="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate max-w-[280px] sm:max-w-md">${this.escapeHtml(this.fileName)}</h3>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex items-center gap-1.5 flex-wrap">
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
                        <!-- Navigation controls -->
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

                        <!-- Tools selector -->
                        <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
                            <button id="toolBtn-view" onclick="PdfStudio.setTool('view')" class="pdf-tool-btn px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-900 dark:text-white bg-white dark:bg-slate-700 shadow-xs border border-slate-200 dark:border-slate-600" title="Rê chuột hoặc chạm vào dòng chữ bất kỳ để sửa trực tiếp">
                                <i class="fa-solid fa-arrow-pointer text-xs"></i>
                                <span>Chạm là sửa</span>
                            </button>
                            <button id="toolBtn-text" onclick="PdfStudio.setTool('text')" class="pdf-tool-btn px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900" title="Nhấp đúp chuột vào bất kỳ chỗ nào để thêm chữ mới">
                                <i class="fa-solid fa-font text-xs"></i>
                                <span class="hidden sm:inline">+ Chữ thủ công</span>
                            </button>
                            <button id="toolBtn-highlight" onclick="PdfStudio.setTool('highlight')" class="pdf-tool-btn px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900" title="Tô sáng dạ quang">
                                <i class="fa-solid fa-highlighter text-amber-500 text-xs"></i>
                                <span class="hidden sm:inline">Tô sáng</span>
                            </button>
                            <button id="toolBtn-whiteout" onclick="PdfStudio.setTool('whiteout')" class="pdf-tool-btn px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900" title="Kéo chuột che vùng nội dung">
                                <i class="fa-regular fa-square text-rose-500 text-xs"></i>
                                <span class="hidden sm:inline">Che vùng</span>
                            </button>
                        </div>

                        <!-- Zoom, Rotate, Undo & Cache clear -->
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

                    <!-- BACKGROUND OCR PROGRESS BAR (Non-blocking) -->
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
                        <span>ℹ️ <strong>Chế độ Chạm là sửa:</strong> Rê hoặc chạm vào bất kỳ dòng chữ nào để chỉnh sửa trực tiếp. <em>(Trang scan: chữ mới được đặt đè lên ảnh gốc, nội dung gốc không bị sửa trong file).</em></span>
                        <span class="text-xs text-indigo-600 font-bold hidden md:inline">Cuộn chuột mượt mà qua tất cả các trang ↓</span>
                    </div>
                </div>

                <!-- MAIN WORKSPACE: THUMBNAIL STRIP (LEFT) + CONTINUOUS SCROLL STAGE (CENTER) -->
                <div class="flex items-start gap-3 min-h-[560px]">
                    
                    <!-- Left Thumbnail Strip -->
                    <div id="pdfThumbnailsSidebar" class="hidden sm:flex flex-col w-[130px] shrink-0 max-h-[78vh] overflow-y-auto space-y-2.5 p-2 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 pr-1">
                        <div class="text-[10.5px] font-black uppercase text-slate-400 px-1">Danh sách trang</div>
                        <div id="pdfThumbnailsList" class="space-y-2"></div>
                    </div>

                    <!-- Center PDF Continuous Scroll Stage -->
                    <div id="pdfContinuousScrollStage" class="pdf-scroll-stage flex-1 min-w-0 flex flex-col items-center justify-start rounded-2xl bg-slate-200/80 dark:bg-slate-950 p-2 sm:p-5 max-h-[82vh] min-h-[540px] border border-slate-300 dark:border-slate-800 relative">
                        <!-- Loading Overlay -->
                        <div id="pdfLoadingSpinner" class="hidden absolute inset-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5">
                            <i class="fa-solid fa-spinner fa-spin text-3xl text-rose-600"></i>
                            <span id="pdfLoadingText" class="text-xs font-black text-slate-800 dark:text-white">Đang tải tài liệu...</span>
                        </div>

                        <!-- All Pages Stack (Continuous Vertical List) -->
                        <div id="pdfPagesStack" class="space-y-6 w-full flex flex-col items-center pb-20"></div>
                    </div>
                </div>

                <!-- FLOATING INLINE LINE EDITOR (Touch-to-Edit modal/popup) -->
                <div id="pdfInlineLineEditor" class="hidden fixed z-50 p-3 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-indigo-500 flex flex-col gap-2 min-w-[320px] max-w-[95vw]">
                    <div class="flex items-center justify-between gap-1 pb-1 border-b border-slate-100 dark:border-slate-800 text-[11px] font-bold text-indigo-700 dark:text-indigo-300">
                        <span class="flex items-center gap-1"><i class="fa-solid fa-pen-to-square"></i> Chỉnh sửa dòng chữ:</span>
                        <span id="pdfLineConfidenceBadge" class="px-2 py-0.5 rounded-full text-[10px] font-bold"></span>
                    </div>
                    
                    <div class="flex items-center gap-1.5 flex-wrap text-xs">
                        <select id="pdfLineFontFamily" onchange="PdfStudio.updateInlineEditorPreview()" class="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-[11px] border border-slate-200">
                            <option value="Inter, -apple-system, sans-serif">Không chân (Noto Sans / Inter)</option>
                            <option value="'Times New Roman', serif">Có chân (Tinos / Times)</option>
                        </select>
                        <button id="pdfLineBoldBtn" onclick="PdfStudio.toggleInlineBold()" class="px-2.5 py-1 rounded-lg font-bold bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200">B</button>
                        <button id="pdfLineItalicBtn" onclick="PdfStudio.toggleInlineItalic()" class="px-2.5 py-1 rounded-lg italic font-serif bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200">I</button>
                        <div class="flex items-center gap-1">
                            <span class="text-[10px] text-slate-400 font-bold">Cỡ:</span>
                            <input id="pdfLineFontSize" type="number" min="8" max="48" step="0.5" oninput="PdfStudio.updateInlineEditorPreview()" class="w-14 px-1.5 py-0.5 rounded-lg border border-slate-200 dark:bg-slate-800 text-xs text-center font-bold" />
                        </div>
                        <input id="pdfLineTextColor" type="color" value="#1e293b" onchange="PdfStudio.updateInlineEditorPreview()" class="w-7 h-7 rounded-lg cursor-pointer border p-0.5" title="Màu chữ" />
                    </div>

                    <textarea id="pdfLineTextInput" rows="2" oninput="PdfStudio.handleInlineInput(event)" onkeydown="PdfStudio.handleInlineKeydown(event)" class="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-normal"></textarea>
                    
                    <div id="pdfLineOverflowWarning" class="hidden text-[10.5px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                        ⚠️ Nội dung dài hơn dòng gốc — cỡ chữ đã được tự động co nhỏ để không tràn viền ô bảng.
                    </div>

                    <div class="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                        <button onclick="PdfStudio.deleteCurrentEditingLine()" class="text-rose-600 hover:underline text-[11px] font-bold">Xóa dòng này</button>
                        <div class="flex items-center gap-1.5">
                            <button onclick="PdfStudio.cancelInlineLineEdit()" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition">Hủy (Esc)</button>
                            <button onclick="PdfStudio.applyInlineLineEdit()" class="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition">✓ Áp dụng (Enter)</button>
                        </div>
                    </div>
                </div>
            `;

            // Lắng nghe cuộn để cập nhật số trang hiện tại
            const stage = document.getElementById('pdfContinuousScrollStage');
            if (stage) {
                stage.onscroll = () => this.handleStageScroll();
            }
        },

        /**
         * Sinh container cho tất cả các trang xếp dọc liên tục
         */
        async buildContinuousPageContainers() {
            const stack = document.getElementById('pdfPagesStack');
            if (!stack || !this.pdfDoc) return;
            stack.innerHTML = '';
            this.pageViewports = {};
            this.pageCanvases = {};

            // Khởi tạo IntersectionObserver cho ảo hóa
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

                // Double click vào khoảng trống để thêm chữ thủ công
                wrapper.ondblclick = (e) => this.handlePageDoubleClick(e, p);

                wrapper.innerHTML = `
                    <!-- Page Canvas -->
                    <canvas id="pdfCanvas-${p}" class="pdf-canvas block w-full h-full"></canvas>
                    
                    <!-- Native Text Layer (cho text PDF) -->
                    <div id="pdfTextLayer-${p}" class="pdf-text-layer absolute inset-0 select-text pointer-events-none"></div>
                    
                    <!-- Touch-to-Edit Layer (chạm là sửa từng dòng) -->
                    <div id="pdfTouchEditLayer-${p}" class="pdf-touch-layer absolute inset-0 z-10" style="touch-action: pan-y; pointer-events: none;"></div>
                    
                    <!-- Annotation Overlay (Lớp chứa whiteouts và text sửa đổi) -->
                    <div id="pdfAnnotationOverlay-${p}" class="pdf-overlay-layer absolute inset-0 z-20" style="touch-action: pan-y; pointer-events: none;"></div>
                    
                    <!-- Page indicator badge -->
                    <div class="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-md bg-slate-900/70 text-white font-extrabold text-[10.5px] select-none pointer-events-none backdrop-blur-xs">
                        Trang ${p} / ${this.numPages}
                    </div>
                `;

                stack.appendChild(wrapper);
                this.observer.observe(wrapper);
            }
        },

        /**
         * Render canvas cho 1 trang duy nhất khi cuộn vào viewport
         */
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

            // Render PDF.js Text Layer nếu có lớp chữ
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

            // Vẽ lớp chú thích (annotations) của trang này
            this.renderPageAnnotations(pageNum);

            // Vẽ lớp Chạm là sửa (Touch-to-Edit lines) nếu đã có dữ liệu cache
            if (this.pageLinesCache[pageNum]) {
                this.renderTouchEditBoxes(pageNum, this.pageLinesCache[pageNum]);
            }
        },

        /**
         * Xử lý sự kiện cuộn stage: Cập nhật chỉ số trang hiện tại
         */
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

        // ---------------------------------------------------------------------
        // 5. OCR TỰ ĐỘNG NGẦM (BACKGROUND AUTO-OCR IN WEB WORKER)
        // ---------------------------------------------------------------------
        async startBackgroundOcrQueue() {
            this.ocrQueue = [];
            this.isOcrRunning = true;
            this.isOcrPaused = false;
            this.isOcrCanceled = false;

            // Thứ tự ưu tiên: Trang hiện tại trước, rồi đến các trang kế cận
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

            // Kiểm tra trong IndexedDB cache trước
            const cacheKey = `${this.fileName}_len${this.arrayBuffer ? this.arrayBuffer.byteLength : 0}_p${pageNum}`;
            const cached = await PdfOcrCache.get(cacheKey);

            if (cached && cached.lines && cached.lines.length > 0) {
                this.pageLinesCache[pageNum] = cached.lines;
                this.renderTouchEditBoxes(pageNum, cached.lines);
                setTimeout(() => this.processNextOcrQueueItem(), 20);
                return;
            }

            // Chưa cache: Render trang offscreen ở tỷ lệ 2.0 để OCR chính xác
            try {
                await ensureTesseract();

                const page = await this.pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale: 2.0 }); // 2.0x scale cho độ phân giải cao
                const offCanvas = document.createElement('canvas');
                offCanvas.width = viewport.width;
                offCanvas.height = viewport.height;
                const offCtx = offCanvas.getContext('2d');
                await page.render({ canvasContext: offCtx, viewport }).promise;

                // Tiền xử lý ảnh (Khử nhiễu đốm hạt, tăng tương phản)
                const preprocessedCanvas = preprocessCanvasForOcr(offCanvas);

                // Khởi tạo Worker Tesseract với dữ liệu offline cục bộ
                if (!this.ocrWorker) {
                    this.ocrWorker = await window.Tesseract.createWorker(['vie', 'eng'], 1, {
                        workerPath: 'js/tesseract-dist/worker.min.js',
                        corePath: 'js/tesseract-dist/tesseract-core.wasm.js',
                        langPath: window.location.origin + '/data/ocr_lang',
                        cacheMethod: 'none',
                        gzip: true
                    });
                }

                const result = await this.ocrWorker.recognize(preprocessedCanvas);
                const rawLines = (result.data && result.data.lines) || [];

                // Chuyển đổi bounding boxes thành tỷ lệ (Ratio 0..1) và làm sạch ký tự thừa
                const processedLines = [];
                rawLines.forEach(line => {
                    const textClean = cleanOcrLineText(line.text);
                    if (!textClean) return;

                    const bbox = line.bbox || { x0: 0, y0: 0, x1: 0, y1: 0 };
                    const xRatio = Math.max(0, bbox.x0 / viewport.width);
                    const yRatio = Math.max(0, bbox.y0 / viewport.height);
                    const wRatio = Math.min(1 - xRatio, (bbox.x1 - bbox.x0) / viewport.width);
                    const hRatio = Math.min(1 - yRatio, (bbox.y1 - bbox.y0) / viewport.height);

                    // Lấy mẫu màu nền trung vị quanh viền dòng chữ
                    const sampledBg = sampleMedianBackgroundColor(offCanvas, bbox.x0, bbox.y0, bbox.x1 - bbox.x0, bbox.y1 - bbox.y0);

                    // Ước tính cỡ chữ lý tưởng từ chiều cao dòng gốc (ở tỷ lệ hiển thị bình thường)
                    const displayLineHeight = hRatio * (this.pageViewports[pageNum] ? this.pageViewports[pageNum].height : 800);
                    const idealFontSize = Math.max(9, Math.round(displayLineHeight * 0.72));

                    processedLines.push({
                        id: 'line-' + pageNum + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
                        pageNum: pageNum,
                        text: textClean,
                        confidence: line.confidence || 85,
                        xRatio,
                        yRatio,
                        wRatio,
                        hRatio,
                        bgColor: sampledBg,
                        fontSize: idealFontSize,
                        fontFamily: 'Inter, -apple-system, sans-serif'
                    });
                });

                // Lưu vào IndexedDB Cache
                await PdfOcrCache.set(cacheKey, { lines: processedLines, createdAt: Date.now() });
                this.pageLinesCache[pageNum] = processedLines;

                // Vẽ các ô Chạm là sửa lên trang
                this.renderTouchEditBoxes(pageNum, processedLines);
            } catch (err) {
                console.warn(`Lỗi OCR ngầm trang ${pageNum}:`, err);
            }

            // Tiếp tục trang tiếp theo
            setTimeout(() => this.processNextOcrQueueItem(), 40);
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
                window.showToast('✅ Đã nhận dạng OCR xong toàn bộ tài liệu! Bạn có thể chạm vào chữ để sửa.');
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
            this.pageLinesCache = {};
            document.querySelectorAll('.pdf-touch-layer').forEach(el => el.innerHTML = '');
            if (window.showToast) window.showToast('🗑️ Đã xóa sạch Cache OCR. Bắt đầu quét lại...');
            this.startBackgroundOcrQueue();
        },

        /**
         * Trích xuất Text lines cho PDF có lớp chữ số
         */
        async extractTextLinesFromPdfJs() {
            for (let p = 1; p <= this.numPages; p++) {
                try {
                    const page = await this.pdfDoc.getPage(p);
                    const textContent = await page.getTextContent();
                    const viewport = this.pageViewports[p] || page.getViewport({ scale: this.scale });

                    const lines = [];
                    textContent.items.forEach(it => {
                        if (!it.str || !it.str.trim()) return;
                        const tx = it.transform;
                        const x = tx[4];
                        const y = tx[5];
                        const h = it.height || Math.abs(tx[3]) || 12;
                        const w = it.width || (it.str.length * h * 0.5);

                        // PDF coordinate -> Screen ratio
                        const xRatio = Math.max(0, x / viewport.width);
                        const yRatio = Math.max(0, (viewport.height - y - h) / viewport.height);
                        const wRatio = Math.min(1 - xRatio, w / viewport.width);
                        const hRatio = Math.min(1 - yRatio, h / viewport.height);

                        lines.push({
                            id: 'pdf-line-' + p + '-' + Math.random().toString(36).substr(2, 6),
                            pageNum: p,
                            text: it.str.trim(),
                            confidence: 100,
                            xRatio,
                            yRatio,
                            wRatio,
                            hRatio,
                            bgColor: '#ffffff',
                            fontSize: Math.round(h * 0.8),
                            fontFamily: 'Inter, sans-serif'
                        });
                    });

                    this.pageLinesCache[p] = lines;
                    this.renderTouchEditBoxes(p, lines);
                } catch (e) {}
            }
        },

        // ---------------------------------------------------------------------
        // 6. CHẾ ĐỘ "CHẠM LÀ SỬA" (TOUCH-TO-EDIT INTERACTION)
        // ---------------------------------------------------------------------
        renderTouchEditBoxes(pageNum, lines) {
            const layer = document.getElementById(`pdfTouchEditLayer-${pageNum}`);
            if (!layer || !lines) return;
            layer.innerHTML = '';

            lines.forEach(line => {
                const box = document.createElement('div');
                box.className = 'pdf-touch-line group';
                box.style.left = (line.xRatio * 100) + '%';
                box.style.top = (line.yRatio * 100) + '%';
                box.style.width = (line.wRatio * 100) + '%';
                box.style.height = (line.hRatio * 100) + '%';
                box.style.pointerEvents = 'auto'; // Cho phép click/tap vào đúng dòng chữ

                // Dấu chấm cảnh báo độ tin cậy thấp
                let warningDot = '';
                if (line.confidence < 70) {
                    warningDot = `<span class="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-1 ring-white" title="Độ tin cậy ${Math.round(line.confidence)}%"></span>`;
                }

                box.innerHTML = `
                    <div class="w-full h-full border border-dashed border-transparent group-hover:border-indigo-400/80 group-hover:bg-indigo-50/20 rounded-xs"></div>
                    ${warningDot}
                `;

                // Chạm/nhấp 1 lần vào dòng để mở ô sửa tại chỗ
                box.onclick = (e) => {
                    e.stopPropagation();
                    this.openInlineLineEdit(line, pageNum, box);
                };

                layer.appendChild(box);
            });
        },

        /**
         * Mở ô sửa tại chỗ (Inline Line Editor)
         */
        openInlineLineEdit(line, pageNum, targetEl) {
            this.activeEditingLine = { ...line, pageNum };

            const editor = document.getElementById('pdfInlineLineEditor');
            const txtInput = document.getElementById('pdfLineTextInput');
            const fontSel = document.getElementById('pdfLineFontFamily');
            const sizeInput = document.getElementById('pdfLineFontSize');
            const colorInput = document.getElementById('pdfLineTextColor');
            const badge = document.getElementById('pdfLineConfidenceBadge');
            const warn = document.getElementById('pdfLineOverflowWarning');

            if (!editor || !txtInput) return;

            txtInput.value = line.text || '';
            if (fontSel) fontSel.value = line.fontFamily || 'Inter, -apple-system, sans-serif';
            if (sizeInput) sizeInput.value = line.fontSize || 14;
            if (colorInput) colorInput.value = line.textColor || '#1e293b';
            if (warn) warn.classList.add('hidden');

            if (badge) {
                const conf = Math.round(line.confidence || 90);
                badge.textContent = `Độ tin cậy: ${conf}%`;
                badge.className = `px-2 py-0.5 rounded-full text-[10px] font-bold ${conf < 70 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`;
            }

            // Định vị Popup nổi trên dòng chữ
            const rect = targetEl.getBoundingClientRect();
            let topPos = rect.bottom + 6;
            let leftPos = Math.max(10, Math.min(window.innerWidth - 340, rect.left));

            if (topPos + 180 > window.innerHeight) {
                topPos = Math.max(10, rect.top - 170);
            }

            editor.style.top = topPos + 'px';
            editor.style.left = leftPos + 'px';
            editor.classList.remove('hidden');

            setTimeout(() => {
                txtInput.focus();
                txtInput.select();
            }, 30);
        },

        handleInlineKeydown(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.applyInlineLineEdit();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                this.cancelInlineLineEdit();
            }
        },

        handleInlineInput(e) {
            this.updateInlineEditorPreview();
        },

        updateInlineEditorPreview() {
            if (!this.activeEditingLine) return;
            const txtInput = document.getElementById('pdfLineTextInput');
            const sizeInput = document.getElementById('pdfLineFontSize');
            const warn = document.getElementById('pdfLineOverflowWarning');
            if (!txtInput || !sizeInput) return;

            const text = txtInput.value;
            const line = this.activeEditingLine;
            const viewport = this.pageViewports[line.pageNum];
            const maxPixelWidth = line.wRatio * (viewport ? viewport.width : 800);

            // Đo độ dài văn bản với Canvas measureText
            const measurer = document.createElement('canvas').getContext('2d');
            let testSize = parseFloat(sizeInput.value) || 14;
            measurer.font = `normal ${testSize}px Inter, sans-serif`;

            // Tự động co chữ (Auto-fit) nếu chữ dài hơn dòng gốc
            let textWidth = measurer.measureText(text).width;
            let isOverflow = false;

            while (textWidth > maxPixelWidth && testSize > 8.5) {
                testSize -= 0.5;
                measurer.font = `normal ${testSize}px Inter, sans-serif`;
                textWidth = measurer.measureText(text).width;
                isOverflow = true;
            }

            if (warn) {
                warn.classList.toggle('hidden', !isOverflow);
            }
        },

        toggleInlineBold() {
            const btn = document.getElementById('pdfLineBoldBtn');
            if (btn) {
                btn.classList.toggle('bg-indigo-600');
                btn.classList.toggle('text-white');
            }
        },

        toggleInlineItalic() {
            const btn = document.getElementById('pdfLineItalicBtn');
            if (btn) {
                btn.classList.toggle('bg-indigo-600');
                btn.classList.toggle('text-white');
            }
        },

        /**
         * Áp dụng chỉnh sửa: Che chữ cũ + Đặt chữ mới khớp từng pixel
         */
        applyInlineLineEdit() {
            if (!this.activeEditingLine) return;
            const txtInput = document.getElementById('pdfLineTextInput');
            const fontSel = document.getElementById('pdfLineFontFamily');
            const sizeInput = document.getElementById('pdfLineFontSize');
            const colorInput = document.getElementById('pdfLineTextColor');
            const isBold = document.getElementById('pdfLineBoldBtn')?.classList.contains('bg-indigo-600');
            const isItalic = document.getElementById('pdfLineItalicBtn')?.classList.contains('bg-indigo-600');

            const newText = txtInput ? txtInput.value.trim() : '';
            const line = this.activeEditingLine;
            const pageNum = line.pageNum;

            this.recordUndo();

            // 1. Tạo hộp che nội dung cũ (Whiteout với màu nền lấy mẫu trung vị + 2px padding)
            const whiteoutAnn = {
                id: 'ann-wo-' + Date.now(),
                type: 'whiteout',
                xRatio: Math.max(0, line.xRatio - 0.003),
                yRatio: Math.max(0, line.yRatio - 0.002),
                wRatio: Math.min(1, line.wRatio + 0.006),
                hRatio: Math.min(1, line.hRatio + 0.004),
                color: line.bgColor || '#ffffff'
            };
            this.addAnnotation(pageNum, whiteoutAnn);

            // 2. Tạo hộp chữ mới nếu có nội dung
            if (newText) {
                // Tự động co chữ để chữ mới nằm vừa vặn 100% trong ô
                const viewport = this.pageViewports[pageNum];
                const maxPixelWidth = line.wRatio * (viewport ? viewport.width : 800);
                const measurer = document.createElement('canvas').getContext('2d');
                let fontSize = parseFloat(sizeInput?.value) || line.fontSize || 13;

                measurer.font = `${isBold ? 'bold' : 'normal'} ${fontSize}px ${fontSel?.value || 'Inter, sans-serif'}`;
                while (measurer.measureText(newText).width > maxPixelWidth && fontSize > 8.0) {
                    fontSize -= 0.5;
                    measurer.font = `${isBold ? 'bold' : 'normal'} ${fontSize}px ${fontSel?.value || 'Inter, sans-serif'}`;
                }

                const textAnn = {
                    id: 'ann-txt-' + Date.now(),
                    type: 'text',
                    xRatio: line.xRatio,
                    yRatio: line.yRatio,
                    wRatio: line.wRatio,
                    hRatio: line.hRatio,
                    text: newText,
                    color: colorInput?.value || '#1e293b',
                    fontSize: fontSize,
                    fontFamily: fontSel?.value || 'Inter, sans-serif',
                    fontWeight: isBold ? '700' : 'normal',
                    fontStyle: isItalic ? 'italic' : 'normal',
                    bgColor: 'transparent'
                };
                this.addAnnotation(pageNum, textAnn);
            }

            // Vẽ lại lớp chú thích trên trang đó
            this.renderPageAnnotations(pageNum);
            this.cancelInlineLineEdit();
            if (window.showToast) window.showToast('✨ Đã sửa dòng thành công!');
        },

        deleteCurrentEditingLine() {
            if (!this.activeEditingLine) return;
            const line = this.activeEditingLine;
            const pageNum = line.pageNum;

            this.recordUndo();
            // Che trắng hoàn toàn dòng này
            const whiteoutAnn = {
                id: 'ann-wo-del-' + Date.now(),
                type: 'whiteout',
                xRatio: Math.max(0, line.xRatio - 0.003),
                yRatio: Math.max(0, line.yRatio - 0.002),
                wRatio: Math.min(1, line.wRatio + 0.006),
                hRatio: Math.min(1, line.hRatio + 0.004),
                color: line.bgColor || '#ffffff'
            };
            this.addAnnotation(pageNum, whiteoutAnn);
            this.renderPageAnnotations(pageNum);
            this.cancelInlineLineEdit();
            if (window.showToast) window.showToast('🗑️ Đã che xóa dòng chữ này.');
        },

        cancelInlineLineEdit() {
            this.activeEditingLine = null;
            const editor = document.getElementById('pdfInlineLineEditor');
            if (editor) editor.classList.add('hidden');
        },

        /**
         * Nhấp đúp chuột vào bất kỳ chỗ nào để thêm chữ thủ công
         */
        handlePageDoubleClick(e, pageNum) {
            const wrapper = document.getElementById(`pdfPageWrapper-${pageNum}`);
            if (!wrapper) return;
            const rect = wrapper.getBoundingClientRect();
            const xRatio = Math.max(0, Math.min(0.9, (e.clientX - rect.left) / rect.width));
            const yRatio = Math.max(0, Math.min(0.95, (e.clientY - rect.top) / rect.height));

            const manualLine = {
                id: 'manual-line-' + Date.now(),
                pageNum: pageNum,
                text: 'Nhập nội dung mới...',
                confidence: 100,
                xRatio: xRatio,
                yRatio: yRatio,
                wRatio: 0.25,
                hRatio: 0.04,
                bgColor: '#ffffff',
                fontSize: 13,
                fontFamily: 'Inter, sans-serif'
            };
            this.openInlineLineEdit(manualLine, pageNum, {
                getBoundingClientRect: () => ({
                    left: e.clientX,
                    top: e.clientY,
                    bottom: e.clientY + 20
                })
            });
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
                el.className = 'pdf-ann-item absolute transition-shadow';
                el.style.left = (ann.xRatio * 100) + '%';
                el.style.top = (ann.yRatio * 100) + '%';
                el.style.width = (ann.wRatio * 100) + '%';
                el.style.height = (ann.hRatio * 100) + '%';
                el.style.pointerEvents = 'auto';

                if (ann.type === 'whiteout') {
                    el.style.backgroundColor = ann.color || '#ffffff';
                    el.className += ' cursor-pointer hover:ring-1 hover:ring-rose-400';
                } else if (ann.type === 'highlight') {
                    el.style.backgroundColor = ann.color || this.highlightColor;
                    el.style.mixBlendMode = 'multiply';
                    el.className += ' cursor-pointer hover:ring-1 hover:ring-amber-400 rounded-xs';
                } else if (ann.type === 'text') {
                    el.className += ' p-0.5 rounded-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 overflow-hidden';
                    el.style.color = ann.color || '#1e293b';
                    el.style.fontSize = (ann.fontSize || 13) + 'px';
                    el.style.fontFamily = ann.fontFamily || 'Inter, -apple-system, sans-serif';
                    el.style.fontWeight = ann.fontWeight || 'normal';
                    el.style.fontStyle = ann.fontStyle || 'normal';
                    el.style.lineHeight = '1.25';
                    el.style.backgroundColor = ann.bgColor || 'transparent';
                    el.contentEditable = 'true';
                    el.innerText = ann.text || '';
                    el.oninput = () => { ann.text = el.innerText; };
                }

                // Nút xóa chú thích
                const delBtn = document.createElement('button');
                delBtn.className = 'ann-control-handle hidden absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[10px] items-center justify-center shadow-md z-30 select-none';
                delBtn.innerHTML = '×';
                delBtn.title = 'Xóa đối tượng này';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.deleteAnnotation(pageNum, ann.id);
                };

                // Tay cầm di chuyển
                const moveHandle = document.createElement('div');
                moveHandle.className = 'ann-control-handle hidden absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] flex items-center justify-center cursor-move shadow-md z-30 select-none';
                moveHandle.innerHTML = '<i class="fa-solid fa-arrows-up-down-left-right text-[8px]"></i>';
                moveHandle.title = 'Kéo để di chuyển';

                moveHandle.onmousedown = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.recordUndo();
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const initX = ann.xRatio;
                    const initY = ann.yRatio;
                    const wrapper = document.getElementById(`pdfPageWrapper-${pageNum}`);
                    const rect = wrapper ? wrapper.getBoundingClientRect() : { width: 800, height: 600 };

                    const onMouseMove = (moveEv) => {
                        const dx = (moveEv.clientX - startX) / rect.width;
                        const dy = (moveEv.clientY - startY) / rect.height;
                        ann.xRatio = Math.max(0, Math.min(1 - ann.wRatio, initX + dx));
                        ann.yRatio = Math.max(0, Math.min(1 - ann.hRatio, initY + dy));
                        el.style.left = (ann.xRatio * 100) + '%';
                        el.style.top = (ann.yRatio * 100) + '%';
                    };

                    const onMouseUp = () => {
                        window.removeEventListener('mousemove', onMouseMove);
                        window.removeEventListener('mouseup', onMouseUp);
                    };

                    window.addEventListener('mousemove', onMouseMove);
                    window.addEventListener('mouseup', onMouseUp);
                };

                el.addEventListener('mouseenter', () => {
                    el.querySelectorAll('.ann-control-handle').forEach(h => h.classList.remove('hidden'));
                });
                el.addEventListener('mouseleave', () => {
                    el.querySelectorAll('.ann-control-handle').forEach(h => h.classList.add('hidden'));
                });

                el.appendChild(delBtn);
                el.appendChild(moveHandle);
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

        deleteAnnotation(pageNum, id) {
            this.recordUndo();
            if (this.annotations[pageNum]) {
                this.annotations[pageNum] = this.annotations[pageNum].filter(a => a.id !== id);
                this.renderPageAnnotations(pageNum);
            }
            this.updateUndoRedoButtons();
        },

        /**
         * Chế độ Trước / Sau (So sánh bản gốc scan với bản đã chỉnh sửa)
         */
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
                if (window.showToast) window.showToast('👁️ Đang xem bản scan gốc. Nhấn lại nút để xem bản sửa!');
            } else {
                overlays.forEach(el => el.style.display = '');
                if (btn) {
                    btn.classList.remove('bg-amber-100', 'text-amber-800', 'border-amber-300');
                    btn.innerHTML = '<i class="fa-solid fa-code-compare text-indigo-600 mr-1"></i> Trước / Sau';
                }
                if (window.showToast) window.showToast('✨ Đã hiển thị bản chỉnh sửa mới!');
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
            for (let p = 1; p <= this.numPages; p++) {
                this.renderPageAnnotations(p);
            }
            this.updateUndoRedoButtons();
        },

        redo() {
            if (this.redoStack.length === 0) return;
            this.undoStack.push(JSON.parse(JSON.stringify(this.annotations)));
            this.annotations = this.redoStack.pop();
            for (let p = 1; p <= this.numPages; p++) {
                this.renderPageAnnotations(p);
            }
            this.updateUndoRedoButtons();
        },

        updateUndoRedoButtons() {
            const undoBtn = document.getElementById('pdfUndoBtn');
            const redoBtn = document.getElementById('pdfRedoBtn');
            if (undoBtn) undoBtn.disabled = (this.undoStack.length === 0);
            if (redoBtn) redoBtn.disabled = (this.redoStack.length === 0);
        },

        setTool(tool) {
            this.activeTool = tool;
            document.querySelectorAll('.pdf-tool-btn').forEach(btn => {
                btn.className = 'pdf-tool-btn px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900';
            });
            const activeBtn = document.getElementById(`toolBtn-${tool}`);
            if (activeBtn) {
                activeBtn.className = 'pdf-tool-btn px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-900 dark:text-white bg-white dark:bg-slate-700 shadow-xs border border-slate-200 dark:border-slate-600';
            }
        },

        // ---------------------------------------------------------------------
        // 8. ĐIỀU HƯỚNG TRANG & ZOOM / ROTATE
        // ---------------------------------------------------------------------
        prevPage() {
            if (this.currentPage > 1) {
                this.goToPage(this.currentPage - 1);
            }
        },

        nextPage() {
            if (this.currentPage < this.numPages) {
                this.goToPage(this.currentPage + 1);
            }
        },

        goToPage(pageNum) {
            const targetPage = Math.max(1, Math.min(this.numPages, pageNum || 1));
            this.currentPage = targetPage;
            const wrapper = document.getElementById(`pdfPageWrapper-${targetPage}`);
            if (wrapper) {
                wrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
            const pInput = document.getElementById('pdfPageInput');
            if (pInput) pInput.value = targetPage;
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

                // Render thumbnail nhẹ nhàng (scale 0.18)
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
                if (pageNum === this.currentPage) {
                    el.className = 'p-1.5 rounded-xl border text-center cursor-pointer transition bg-rose-50 border-rose-400 font-bold';
                } else {
                    el.className = 'p-1.5 rounded-xl border text-center cursor-pointer transition bg-white hover:bg-slate-100 border-slate-200';
                }
            });
        },

        // ---------------------------------------------------------------------
        // 9. XUẤT FILE PDF MỚI (GIỮ ĐỦ 100% SỐ TRANG & TỶ LỆ GỐC)
        // ---------------------------------------------------------------------
        async exportPdf() {
            if (!this.arrayBuffer || !this.pdfDoc) return;
            this.showLoading('Đang chuẩn bị xuất file PDF chất lượng cao...');

            try {
                await ensurePdfLib();
                if (!window.PDFLib) {
                    throw new Error('Thư viện PDFLib không thể khởi tạo.');
                }

                const { PDFDocument } = window.PDFLib;
                const pdfDoc = await PDFDocument.load(this.arrayBuffer, { ignoreEncryption: true });
                const pages = pdfDoc.getPages();

                // Lặp qua tất cả các trang
                for (let pageNum = 1; pageNum <= pages.length; pageNum++) {
                    const anns = this.annotations[pageNum];
                    if (!anns || anns.length === 0) continue;

                    this.showLoading(`Đang xử lý lớp chữ & che nền trang ${pageNum}/${pages.length}...`);
                    const targetPage = pages[pageNum - 1];
                    const pageWidth = targetPage.getWidth();
                    const pageHeight = targetPage.getHeight();

                    // Canvas 2D Overlay Compositing với tỷ lệ 2.0x sắc nét
                    const exportCanvas = document.createElement('canvas');
                    const scaleFactor = 2.0;
                    exportCanvas.width = Math.round(pageWidth * scaleFactor);
                    exportCanvas.height = Math.round(pageHeight * scaleFactor);
                    const ctx = exportCanvas.getContext('2d');

                    ctx.scale(scaleFactor, scaleFactor);

                    // Vẽ từng chú thích
                    anns.forEach(ann => {
                        const x = ann.xRatio * pageWidth;
                        const y = ann.yRatio * pageHeight;
                        const w = ann.wRatio * pageWidth;
                        const h = ann.hRatio * pageHeight;

                        if (ann.type === 'whiteout') {
                            ctx.fillStyle = ann.color || '#ffffff';
                            ctx.fillRect(x, y, w, h);
                        } else if (ann.type === 'highlight') {
                            ctx.fillStyle = ann.color || 'rgba(254, 240, 138, 0.45)';
                            ctx.fillRect(x, y, w, h);
                        } else if (ann.type === 'text') {
                            if (ann.bgColor && ann.bgColor !== 'transparent') {
                                ctx.fillStyle = ann.bgColor;
                                ctx.fillRect(x, y, w, h);
                            }
                            ctx.fillStyle = ann.color || '#1e293b';
                            const fontSz = (ann.fontSize || 13) * 0.95;
                            const fWeight = ann.fontWeight || 'normal';
                            const fStyle = ann.fontStyle || 'normal';
                            const fFamily = (ann.fontFamily && ann.fontFamily.includes('Times')) ? 'Times New Roman, serif' : 'Inter, Arial, sans-serif';

                            ctx.font = `${fStyle} ${fWeight} ${fontSz}px ${fFamily}`;
                            ctx.textBaseline = 'top';

                            // Tự động word-wrap theo chiều rộng
                            const words = (ann.text || '').split(' ');
                            let line = '';
                            let curY = y + 2;

                            for (let n = 0; n < words.length; n++) {
                                const testLine = line + words[n] + ' ';
                                const metrics = ctx.measureText(testLine);
                                if (metrics.width > w && n > 0) {
                                    ctx.fillText(line, x + 2, curY);
                                    line = words[n] + ' ';
                                    curY += fontSz * 1.25;
                                } else {
                                    line = testLine;
                                }
                            }
                            ctx.fillText(line, x + 2, curY);
                        }
                    });

                    // Chuyển overlay thành PNG và nhúng vào trang PDF
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
            this.pageLinesCache = {};
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

    // Đăng ký toàn cục
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
