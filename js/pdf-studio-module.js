/**
 * =========================================================================
 * CÙNG ĐĂNG RA TRƯỜNG — HIGH-END PDF STUDIO & EDITOR MODULE
 * Module chuyên biệt cho Sổ Note: Đọc, Chỉnh sửa, OCR & Xuất PDF hoàn chỉnh
 * 
 * Tính năng chính:
 * 1. Hiển thị PDF trực tiếp (Interactive Canvas Viewer + Page Thumbnails)
 * 2. Hỗ trợ tài liệu nhiều trang: Chuyển trang, phóng to, thu nhỏ, xoay 90/180/270
 * 3. Chỉnh sửa PDF có lớp văn bản: Chọn text, thêm chữ, tô sáng, che nội dung cũ, chèn ảnh
 * 4. Hỗ trợ PDF scan / ảnh: Tích hợp OCR nhận dạng tiếng Việt có dấu & tiếng Anh
 * 5. Lưu & Xuất PDF mới (.pdf): Giữ nguyên số trang, kích thước, bố cục và lớp sửa đổi
 * 6. Quản lý bộ nhớ tối ưu: IndexedDB lưu trữ nhị phân, giải phóng tài nguyên sạch sẽ
 * =========================================================================
 */

(function (window) {
    'use strict';

    // -------------------------------------------------------------------------
    // 1. CẤU HÌNH & LAZY LOADER CHO THƯ VIỆN BỔ TRỢ (Zero Global Slowdown)
    // -------------------------------------------------------------------------

    // Cấu hình PDF.js Worker an toàn
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
                if (existing.dataset.loaded === 'true') return resolve();
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
                    fb.onerror = (e2) => reject(new Error(`Không thể tải thư viện bổ trợ: ${fallbackSrc}`));
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
    // 2. INDEXED-DB STORAGE: LƯU FILE PDF AN TOÀN (Tránh đầy 5MB LocalStorage)
    // -------------------------------------------------------------------------
    const PdfStorage = {
        dbName: 'CungDangPdfStudioDB',
        storeName: 'pdf_files',
        dbPromise: null,

        getDB() {
            if (this.dbPromise) return this.dbPromise;
            this.dbPromise = new Promise((resolve, reject) => {
                if (!window.indexedDB) {
                    return resolve(null); // Fallback memory
                }
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
                    return window._pdfMemoryStore ? window._pdfMemoryStore[fileId] : null;
                }
                return new Promise((resolve) => {
                    const tx = db.transaction(this.storeName, 'readonly');
                    const req = tx.objectStore(this.storeName).get(fileId);
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => resolve(null);
                });
            } catch (e) {
                console.warn('PdfStorage get error:', e);
                return null;
            }
        },

        async remove(fileId) {
            try {
                const db = await this.getDB();
                if (db) {
                    const tx = db.transaction(this.storeName, 'readwrite');
                    tx.objectStore(this.storeName).delete(fileId);
                }
                if (window._pdfMemoryStore) delete window._pdfMemoryStore[fileId];
            } catch (e) {}
        }
    };

    // -------------------------------------------------------------------------
    // 3. PDF STUDIO CORE CONTROLLER
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
        scale: 1.25,
        rotation: 0, // 0, 90, 180, 270

        // Tools: 'view', 'text', 'highlight', 'whiteout', 'image', 'ocr', 'select'
        activeTool: 'view',
        highlightColor: 'rgba(254, 240, 138, 0.45)', // Vàng dạ quang
        whiteoutColor: '#ffffff',
        textColor: '#1e293b',
        textSize: 16,

        // Data & Undo
        annotations: {}, // { [pageNum]: Array<Annotation> }
        undoStack: [],
        redoStack: [],
        selectedAnnotationId: null,

        // Drawing state
        isDrawing: false,
        dragStart: null,
        activeBoxDraft: null,

        // UI references
        containerEl: null,
        canvasEl: null,
        overlayEl: null,
        textLayerEl: null,

        // Flag: Scanned document detection
        isScannedPdf: false,

        /**
         * Khởi tạo và gắn Studio vào Sổ Note
         */
        init() {
            // Đảm bảo PDF.js worker luôn sẵn sàng
            if (window.pdfjsLib && !window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            }
        },

        /**
         * Mở file PDF từ File object hoặc ArrayBuffer
         */
        async openPdf(fileOrBuffer, options = {}) {
            this.destroy(); // Giải phóng file cũ tránh rò rỉ bộ nhớ

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

            // Lưu trữ ArrayBuffer vào IndexedDB
            await PdfStorage.save(this.fileId, this.arrayBuffer);

            // Nạp chú thích đã lưu (nếu có từ trước)
            this.annotations = options.savedAnnotations ? JSON.parse(JSON.stringify(options.savedAnnotations)) : {};
            this.currentPage = options.initialPage || 1;
            this.scale = options.initialScale || 1.25;
            this.rotation = options.initialRotation || 0;
            this.undoStack = [];
            this.redoStack = [];

            // Hiển thị khung Studio
            this.mountStudioUI();
            this.showLoading('Đang tải tài liệu PDF...');

            try {
                // Tải document với PDF.js
                const loadingTask = window.pdfjsLib.getDocument({
                    data: new Uint8Array(this.arrayBuffer),
                    cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
                    cMapPacked: true,
                    standardFontDataUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/standard_fonts/'
                });

                this.pdfDoc = await loadingTask.promise;
                this.numPages = this.pdfDoc.numPages;

                // Kiểm tra xem PDF có lớp văn bản hay là bản scan hình ảnh
                await this.detectScannedDocument();

                // Cập nhật thông số trang
                this.updatePageInfoUI();
                this.renderThumbnailStrip();

                // Vẽ trang hiện tại
                await this.renderPage(this.currentPage);
                this.hideLoading();

                if (this.isScannedPdf) {
                    this.showBannerNotice('📷 <strong>Phát hiện PDF scan / ảnh:</strong> Trang không có sẵn lớp văn bản. Bạn có thể bấm nút <strong>"🔍 Nhận dạng OCR"</strong> để quét chữ tiếng Việt có dấu và chỉnh sửa trực tiếp!');
                } else {
                    this.showBannerNotice('📄 <strong>PDF chuẩn:</strong> Bạn có thể chọn chữ, tô sáng, đặt chữ mới hoặc che nội dung cũ rồi xuất file PDF mới.');
                }
            } catch (err) {
                console.error('Lỗi khởi tạo PDF Document:', err);
                this.hideLoading();
                this.showErrorNotice(`Không thể mở file PDF: ${err.message || 'Lỗi mã hóa hoặc định dạng không hỗ trợ'}.`);
            }
        },

        /**
         * Mở lại PDF từ IndexedDB storage theo fileId
         */
        async openFromStorage(fileId, options = {}) {
            this.showLoading('Đang mở lại tài liệu PDF từ bộ nhớ đệm...');
            try {
                const buffer = await PdfStorage.get(fileId);
                if (!buffer) {
                    throw new Error('Không tìm thấy dữ liệu tệp PDF trong bộ nhớ cục bộ. Vui lòng tải lại file.');
                }
                await this.openPdf(buffer, {
                    ...options,
                    fileId: fileId,
                    fileName: options.fileName || 'Tài liệu PDF',
                    savedAnnotations: options.savedAnnotations || options.annotations,
                    initialPage: options.initialPage || options.currentPage || 1,
                    initialScale: options.initialScale || options.scale || 1.25,
                    initialRotation: options.initialRotation || options.rotation || 0
                });
            } catch (err) {
                this.hideLoading();
                if (window.showToast) window.showToast('⚠️ ' + err.message);
                console.error('Failed to open PDF from storage:', err);
            }
        },

        /**
         * Kiểm tra xem PDF có phải là tài liệu scan không (ít hoặc không có text item)
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
                this.isScannedPdf = (totalChars < 15);
            } catch (e) {
                this.isScannedPdf = false;
            }
        },

        /**
         * Render giao diện Studio hoàn chỉnh vào trang Sổ Note
         */
        mountStudioUI() {
            if (!document.getElementById('pdfStudioScopedStyles')) {
                const styleEl = document.createElement('style');
                styleEl.id = 'pdfStudioScopedStyles';
                styleEl.innerHTML = `
                    .pdf-text-layer {
                        position: absolute;
                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        overflow: hidden;
                        opacity: 0.25;
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
                                    <span class="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 text-[10px] font-black uppercase tracking-wider">PDF Studio Chuyên Sâu</span>
                                    <span id="pdfScanBadge" class="${this.isScannedPdf ? '' : 'hidden'} px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-black">📷 Bản Scan (Hỗ trợ OCR)</span>
                                </div>
                                <h3 id="pdfStudioDocTitle" class="text-sm sm:text-base font-black text-slate-900 dark:text-white truncate max-w-[280px] sm:max-w-md">${this.escapeHtml(this.fileName)}</h3>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex items-center gap-1.5 flex-wrap">
                            <button onclick="PdfStudio.saveToNote()" class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center gap-1 transition" title="Lưu các ghi chú, tô sáng vào sổ">
                                <i class="fa-solid fa-floppy-disk"></i>
                                <span class="hidden sm:inline">Lưu sửa đổi</span>
                            </button>
                            <button onclick="PdfStudio.exportPdf()" class="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition" title="Tải về file PDF mới đã bao gồm chữ và tô màu của bạn">
                                <i class="fa-solid fa-download"></i>
                                <span>Xuất PDF mới</span>
                            </button>
                            <button onclick="PdfStudio.extractAllTextToNote()" class="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-50 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-700 flex items-center gap-1 transition" title="Chuyển toàn bộ nội dung PDF thành văn bản vào Sổ Note">
                                <i class="fa-solid fa-file-lines text-indigo-600"></i>
                                <span class="hidden md:inline">Trích sang Sổ</span>
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
                            <button onclick="PdfStudio.prevPage()" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 flex items-center justify-center font-bold" title="Trang trước (←)">
                                <i class="fa-solid fa-chevron-left text-[11px]"></i>
                            </button>
                            <div class="flex items-center gap-1 text-[11.5px] font-extrabold text-slate-700 dark:text-slate-200 px-1">
                                <input id="pdfPageInput" type="number" min="1" max="1" value="1" onchange="PdfStudio.goToPage(parseInt(this.value, 10))" class="w-10 text-center py-0.5 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-black text-xs">
                                <span>/ <span id="pdfTotalPages">1</span></span>
                            </div>
                            <button onclick="PdfStudio.nextPage()" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50 flex items-center justify-center font-bold" title="Trang sau (→)">
                                <i class="fa-solid fa-chevron-right text-[11px]"></i>
                            </button>
                        </div>

                        <!-- Tools selector -->
                        <div class="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0">
                            <button id="toolBtn-view" onclick="PdfStudio.setTool('view')" class="pdf-tool-btn px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-700 shadow-xs" title="Xem và chọn chữ trên trang PDF">
                                <i class="fa-solid fa-arrow-pointer text-xs"></i>
                                <span class="hidden sm:inline">Chọn & Xem</span>
                            </button>
                            <button id="toolBtn-text" onclick="PdfStudio.setTool('text')" class="pdf-tool-btn px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900" title="Bấm vào trang để thêm chữ tiếng Việt">
                                <i class="fa-solid fa-font text-xs"></i>
                                <span class="hidden sm:inline">+ Chữ</span>
                            </button>
                            <button id="toolBtn-highlight" onclick="PdfStudio.setTool('highlight')" class="pdf-tool-btn px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900" title="Kéo chuột để tô dạ quang">
                                <i class="fa-solid fa-highlighter text-amber-500 text-xs"></i>
                                <span class="hidden sm:inline">Tô sáng</span>
                            </button>
                            <button id="toolBtn-whiteout" onclick="PdfStudio.setTool('whiteout')" class="pdf-tool-btn px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900" title="Kéo chuột để che/xóa nội dung cũ rồi đặt nội dung mới">
                                <i class="fa-regular fa-square text-rose-500 text-xs"></i>
                                <span class="hidden sm:inline">Che nội dung</span>
                            </button>
                            <button id="toolBtn-ocr" onclick="PdfStudio.setTool('ocr')" class="pdf-tool-btn px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-slate-900" title="Nhận dạng chữ tiếng Việt/tiếng Anh từ trang ảnh scan">
                                <i class="fa-solid fa-eye text-indigo-500 text-xs"></i>
                                <span>OCR Quét chữ</span>
                            </button>
                        </div>

                        <!-- Zoom, Rotate & Undo -->
                        <div class="flex items-center gap-1 shrink-0">
                            <button onclick="PdfStudio.undo()" id="pdfUndoBtn" disabled class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 disabled:opacity-40 flex items-center justify-center" title="Hoàn tác"><i class="fa-solid fa-rotate-left text-[11px]"></i></button>
                            <button onclick="PdfStudio.redo()" id="pdfRedoBtn" disabled class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 disabled:opacity-40 flex items-center justify-center" title="Làm lại"><i class="fa-solid fa-rotate-right text-[11px]"></i></button>
                            <span class="w-px h-4 bg-slate-200 dark:border-slate-700 mx-0.5"></span>
                            <button onclick="PdfStudio.zoomOut()" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center" title="Thu nhỏ (-)"><i class="fa-solid fa-minus text-[11px]"></i></button>
                            <span id="pdfZoomLabel" class="text-[11px] font-black text-slate-600 dark:text-slate-300 min-w-[42px] text-center">125%</span>
                            <button onclick="PdfStudio.zoomIn()" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center" title="Phóng to (+)"><i class="fa-solid fa-plus text-[11px]"></i></button>
                            <button onclick="PdfStudio.rotatePage()" class="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center" title="Xoay 90°"><i class="fa-solid fa-arrow-rotate-right text-[11px]"></i></button>
                        </div>
                    </div>

                    <!-- Contextual Banner Notification -->
                    <div id="pdfStudioNotice" class="hidden text-xs py-1.5 px-3 rounded-xl bg-amber-50 dark:bg-slate-800 border border-amber-200/80 dark:border-slate-700 text-amber-900 dark:text-amber-200 flex items-center justify-between">
                        <span id="pdfStudioNoticeText"></span>
                        <button onclick="document.getElementById('pdfStudioNotice').classList.add('hidden')" class="text-amber-700 hover:text-amber-900 ml-2">×</button>
                    </div>

                    <!-- ACTIVE TOOL OPTIONS PANEL (Color picker, font size, quick tips) -->
                    <div id="pdfToolOptionsBar" class="hidden flex-wrap items-center gap-3 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                        <div id="pdfTextOptions" class="hidden flex items-center gap-2">
                            <span class="font-bold text-slate-600 dark:text-slate-300">Cỡ chữ:</span>
                            <select id="pdfFontSizeSelect" onchange="PdfStudio.textSize = parseInt(this.value, 10)" class="px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold">
                                <option value="12">12px</option>
                                <option value="14">14px</option>
                                <option value="16" selected>16px</option>
                                <option value="20">20px</option>
                                <option value="24">24px</option>
                                <option value="32">32px</option>
                            </select>
                            <span class="font-bold text-slate-600 dark:text-slate-300 ml-2">Màu:</span>
                            <input id="pdfTextColorInput" type="color" value="#1e293b" onchange="PdfStudio.textColor = this.value" class="w-6 h-6 rounded-md border-0 p-0 cursor-pointer">
                            <span class="text-slate-500 text-[11px] italic ml-2">👉 Bấm vào trang PDF để đặt hộp chữ và gõ tiếng Việt.</span>
                        </div>

                        <div id="pdfHighlightOptions" class="hidden flex items-center gap-2">
                            <span class="font-bold text-slate-600 dark:text-slate-300">Màu tô:</span>
                            <button onclick="PdfStudio.setHighlightColor('rgba(254, 240, 138, 0.45)', this)" class="w-6 h-6 rounded-full bg-yellow-300 border-2 border-yellow-500 ring-2 ring-yellow-400"></button>
                            <button onclick="PdfStudio.setHighlightColor('rgba(251, 207, 232, 0.45)', this)" class="w-6 h-6 rounded-full bg-pink-300 border border-pink-400"></button>
                            <button onclick="PdfStudio.setHighlightColor('rgba(187, 247, 208, 0.45)', this)" class="w-6 h-6 rounded-full bg-green-300 border border-green-400"></button>
                            <button onclick="PdfStudio.setHighlightColor('rgba(191, 219, 254, 0.45)', this)" class="w-6 h-6 rounded-full bg-blue-300 border border-blue-400"></button>
                            <span class="text-slate-500 text-[11px] italic ml-2">👉 Kéo chuột tạo vùng chữ nhật để tô dạ quang.</span>
                        </div>

                        <div id="pdfWhiteoutOptions" class="hidden flex items-center gap-2">
                            <span class="font-bold text-slate-600 dark:text-slate-300">Che nội dung cũ:</span>
                            <span class="text-slate-500 text-[11px] italic">👉 Kéo chuột khoanh vùng để che/xóa nội dung cũ bằng màu trắng tinh. Sau đó bạn có thể dùng công cụ [+ Chữ] để đặt chữ mới lên trên vị trí đó.</span>
                        </div>

                        <div id="pdfOcrOptions" class="hidden flex flex-wrap items-center justify-between w-full gap-2">
                            <div class="flex items-center gap-2">
                                <span class="font-extrabold text-indigo-700 dark:text-indigo-400">🔍 Chế độ OCR:</span>
                                <span class="text-slate-600 dark:text-slate-300">Hỗ trợ nhận dạng chữ <strong>tiếng Việt có dấu + tiếng Anh</strong></span>
                            </div>
                            <div class="flex items-center gap-2">
                                <button onclick="PdfStudio.runFullPageOcr()" class="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs flex items-center gap-1 transition">
                                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                                    <span>Quét OCR Toàn Trang ${this.currentPage}</span>
                                </button>
                                <span class="text-slate-400">hoặc kéo chuột chọn vùng cần quét</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- MAIN WORKSPACE: THUMBNAIL STRIP (LEFT) + PDF STAGE (CENTER) -->
                <div class="flex items-start gap-3 min-h-[560px]">
                    
                    <!-- Left Thumbnail Strip (Collapsible) -->
                    <div id="pdfThumbnailsSidebar" class="hidden sm:flex flex-col w-[130px] shrink-0 max-h-[640px] overflow-y-auto space-y-2.5 p-2 rounded-2xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 pr-1">
                        <div class="text-[10.5px] font-black uppercase text-slate-400 px-1">Danh sách trang</div>
                        <div id="pdfThumbnailsList" class="space-y-2"></div>
                    </div>

                    <!-- Center PDF Canvas Stage -->
                    <div class="flex-1 min-w-0 flex flex-col items-center justify-start rounded-2xl bg-slate-200/70 dark:bg-slate-950 p-2 sm:p-4 overflow-auto max-h-[680px] border border-slate-300 dark:border-slate-800 relative select-none">
                        
                        <!-- Loading Overlay -->
                        <div id="pdfLoadingSpinner" class="hidden absolute inset-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5">
                            <i class="fa-solid fa-spinner fa-spin text-3xl text-rose-600"></i>
                            <span id="pdfLoadingText" class="text-xs font-black text-slate-800 dark:text-white">Đang xử lý trang PDF...</span>
                        </div>

                        <!-- PDF Page Presentation Wrapper -->
                        <div id="pdfPageWrapper" class="relative shadow-2xl bg-white border border-slate-300 rounded-sm overflow-hidden" style="display: inline-block;">
                            <!-- PDF Background Canvas -->
                            <canvas id="pdfRenderingCanvas" class="block"></canvas>
                            
                            <!-- PDF Text Layer for Native Text Selection -->
                            <div id="pdfTextLayer" class="pdf-text-layer absolute inset-0 pointer-events-auto select-text"></div>
                            
                            <!-- Interactive Annotation Overlay Layer (Text boxes, highlights, whiteouts) -->
                            <div id="pdfAnnotationOverlay" class="absolute inset-0 z-20 pointer-events-auto overflow-hidden"></div>
                        </div>
                    </div>
                </div>

                <!-- OCR RESULT MODAL / SLIDE-IN PANEL -->
                <div id="pdfOcrResultModal" class="hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div class="w-full max-w-xl rounded-3xl bg-white dark:bg-slate-900 p-5 shadow-2xl border border-slate-200 dark:border-slate-700 space-y-3.5">
                        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                            <div class="flex items-center gap-2">
                                <span class="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold"><i class="fa-solid fa-eye"></i></span>
                                <h4 class="font-black text-sm text-slate-900 dark:text-white">Kết quả nhận dạng chữ OCR (Tiếng Việt & Tiếng Anh)</h4>
                            </div>
                            <button onclick="document.getElementById('pdfOcrResultModal').classList.add('hidden')" class="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center text-xs">×</button>
                        </div>

                        <div>
                            <label class="block text-[11px] font-bold text-slate-500 mb-1">Bạn có thể chỉnh sửa lại văn bản nhận dạng bên dưới trước khi áp dụng:</label>
                            <textarea id="pdfOcrOutputTextarea" rows="6" class="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium text-xs leading-relaxed focus:outline-none focus:border-indigo-500"></textarea>
                        </div>

                        <div class="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                            <button onclick="PdfStudio.copyOcrText()" class="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1">
                                <i class="fa-regular fa-copy"></i>
                                <span>Sao chép chữ</span>
                            </button>
                            <div class="flex items-center gap-2">
                                <button onclick="PdfStudio.applyOcrReplace()" class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-sm transition flex items-center gap-1.5" title="Tự động che vùng cũ và đặt hộp chữ mới tại vị trí này">
                                    <i class="fa-solid fa-stamp"></i>
                                    <span>Che vùng cũ & Đặt chữ mới</span>
                                </button>
                                <button onclick="PdfStudio.insertOcrIntoNotePaper()" class="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition flex items-center gap-1">
                                    <i class="fa-solid fa-plus"></i>
                                    <span>Chèn vào Sổ Note</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            this.containerEl = container;
            this.canvasEl = document.getElementById('pdfRenderingCanvas');
            this.overlayEl = document.getElementById('pdfAnnotationOverlay');
            this.textLayerEl = document.getElementById('pdfTextLayer');

            this.attachOverlayEventListeners();
        },

        /**
         * Lắng nghe sự kiện chuột trên lớp phủ (Annotation Layer)
         */
        attachOverlayEventListeners() {
            if (!this.overlayEl) return;

            this.overlayEl.onmousedown = (e) => this.handleOverlayMouseDown(e);
            window.addEventListener('mousemove', (e) => this.handleOverlayMouseMove(e));
            window.addEventListener('mouseup', (e) => this.handleOverlayMouseUp(e));
        },

        /**
         * Render một trang PDF xác định lên Canvas & Text Layer
         */
        async renderPage(pageNum) {
            if (!this.pdfDoc || pageNum < 1 || pageNum > this.numPages) return;
            this.currentPage = pageNum;
            this.updatePageInfoUI();

            const page = await this.pdfDoc.getPage(pageNum);
            const rotation = (page.rotate + this.rotation) % 360;
            const viewport = page.getViewport({ scale: this.scale, rotation: rotation });

            const canvas = this.canvasEl;
            const ctx = canvas.getContext('2d', { alpha: false });
            const dpr = window.devicePixelRatio || 1;

            canvas.width = Math.floor(viewport.width * dpr);
            canvas.height = Math.floor(viewport.height * dpr);
            canvas.style.width = Math.floor(viewport.width) + 'px';
            canvas.style.height = Math.floor(viewport.height) + 'px';

            ctx.save();
            ctx.scale(dpr, dpr);

            const renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            await page.render(renderContext).promise;
            ctx.restore();

            // Kích thước container trang
            const wrapper = document.getElementById('pdfPageWrapper');
            if (wrapper) {
                wrapper.style.width = Math.floor(viewport.width) + 'px';
                wrapper.style.height = Math.floor(viewport.height) + 'px';
            }

            // Render Text Layer cho phép chọn và sao chép chữ trực tiếp trên PDF
            if (this.textLayerEl) {
                this.textLayerEl.innerHTML = '';
                this.textLayerEl.style.width = Math.floor(viewport.width) + 'px';
                this.textLayerEl.style.height = Math.floor(viewport.height) + 'px';
                try {
                    const textContent = await page.getTextContent();
                    if (window.pdfjsLib && window.pdfjsLib.renderTextLayer) {
                        const task = window.pdfjsLib.renderTextLayer({
                            textContentSource: textContent,
                            container: this.textLayerEl,
                            viewport: viewport,
                            textDivs: []
                        });
                        if (task && task.promise) await task.promise;
                    }
                } catch (e) {
                    console.warn('Text layer render notice:', e);
                }
            }

            // Vẽ lớp chú thích (Annotations)
            this.renderPageAnnotations(pageNum, viewport);

            // Cập nhật trạng thái thumbnail active
            this.highlightActiveThumbnail();
        },

        /**
         * Vẽ lại toàn bộ chú thích (Text, Highlight, Whiteout) trên trang hiện tại
         */
        renderPageAnnotations(pageNum, viewport) {
            if (!this.overlayEl) return;
            this.overlayEl.innerHTML = '';
            const pageAnns = this.annotations[pageNum] || [];

            pageAnns.forEach((ann) => {
                const el = document.createElement('div');
                el.id = 'ann-' + ann.id;
                el.className = 'absolute transition-shadow';
                el.style.left = (ann.xRatio * 100) + '%';
                el.style.top = (ann.yRatio * 100) + '%';
                el.style.width = (ann.wRatio * 100) + '%';
                el.style.height = (ann.hRatio * 100) + '%';

                if (ann.type === 'highlight') {
                    el.style.backgroundColor = ann.color || this.highlightColor;
                    el.style.mixBlendMode = 'multiply';
                    el.className += ' cursor-pointer hover:ring-1 hover:ring-amber-400 rounded-xs';
                } else if (ann.type === 'whiteout') {
                    el.style.backgroundColor = ann.color || '#ffffff';
                    el.style.boxShadow = '0 0 1px rgba(0,0,0,0.15)';
                    el.className += ' cursor-pointer hover:ring-1 hover:ring-rose-400';
                } else if (ann.type === 'text') {
                    el.className += ' p-1 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 overflow-hidden';
                    el.style.color = ann.color || this.textColor;
                    el.style.fontSize = (ann.fontSize || this.textSize) + 'px';
                    el.style.fontFamily = ann.fontFamily || 'Inter, system-ui, sans-serif';
                    el.style.fontWeight = '700';
                    el.style.lineHeight = '1.25';
                    el.style.backgroundColor = ann.bgColor || 'transparent';
                    el.contentEditable = 'true';
                    el.innerText = ann.text || '';
                    el.oninput = () => {
                        ann.text = el.innerText;
                    };
                }

                // Nút xóa chú thích
                const delBtn = document.createElement('button');
                delBtn.className = 'ann-control-handle hidden absolute -top-2.5 -right-2.5 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[10px] items-center justify-center shadow-md z-30 select-none';
                delBtn.innerHTML = '×';
                delBtn.title = 'Xóa đối tượng này';
                delBtn.onclick = (e) => {
                    e.stopPropagation();
                    this.deleteAnnotation(ann.id);
                };

                // Tay cầm di chuyển (Move Handle)
                const moveHandle = document.createElement('div');
                moveHandle.className = 'ann-control-handle hidden absolute -top-2.5 -left-2.5 w-5 h-5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] flex items-center justify-center cursor-move shadow-md z-30 select-none';
                moveHandle.innerHTML = '<i class="fa-solid fa-arrows-up-down-left-right text-[8px]"></i>';
                moveHandle.title = 'Kéo để di chuyển vị trí';

                moveHandle.onmousedown = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.recordUndo();
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const initXRatio = ann.xRatio;
                    const initYRatio = ann.yRatio;
                    const rect = this.overlayEl.getBoundingClientRect();

                    const onMouseMove = (moveEv) => {
                        const dx = (moveEv.clientX - startX) / rect.width;
                        const dy = (moveEv.clientY - startY) / rect.height;
                        ann.xRatio = Math.max(0, Math.min(1 - ann.wRatio, initXRatio + dx));
                        ann.yRatio = Math.max(0, Math.min(1 - ann.hRatio, initYRatio + dy));
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

                // Tay cầm đổi kích thước (Resize Handle)
                const resizeHandle = document.createElement('div');
                resizeHandle.className = 'ann-control-handle hidden absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[8px] flex items-center justify-center cursor-se-resize shadow-md z-30 select-none';
                resizeHandle.innerHTML = '⤡';
                resizeHandle.title = 'Kéo để thay đổi kích thước';

                resizeHandle.onmousedown = (e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    this.recordUndo();
                    const startX = e.clientX;
                    const startY = e.clientY;
                    const initWRatio = ann.wRatio;
                    const initHRatio = ann.hRatio;
                    const rect = this.overlayEl.getBoundingClientRect();

                    const onMouseMove = (moveEv) => {
                        const dw = (moveEv.clientX - startX) / rect.width;
                        const dh = (moveEv.clientY - startY) / rect.height;
                        ann.wRatio = Math.max(0.02, Math.min(1 - ann.xRatio, initWRatio + dw));
                        ann.hRatio = Math.max(0.015, Math.min(1 - ann.yRatio, initHRatio + dh));
                        el.style.width = (ann.wRatio * 100) + '%';
                        el.style.height = (ann.hRatio * 100) + '%';
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
                el.appendChild(resizeHandle);

                this.overlayEl.appendChild(el);
            });
        },

        /**
         * Xử lý chuột mousedown để vẽ vùng hoặc thêm chữ
         */
        handleOverlayMouseDown(e) {
            if (this.activeTool === 'view') return;

            const rect = this.overlayEl.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xRatio = Math.max(0, Math.min(1, x / rect.width));
            const yRatio = Math.max(0, Math.min(1, y / rect.height));

            // Tool: THÊM CHỮ
            if (this.activeTool === 'text') {
                const newAnn = {
                    id: 'ann-' + Date.now(),
                    type: 'text',
                    xRatio: xRatio,
                    yRatio: yRatio,
                    wRatio: 0.35,
                    hRatio: 0.08,
                    text: 'Ghi chú văn bản...',
                    color: this.textColor,
                    fontSize: this.textSize,
                    fontFamily: 'Inter, system-ui, sans-serif'
                };
                this.recordUndo();
                this.addAnnotation(newAnn);
                this.renderPageAnnotations(this.currentPage);
                
                // Tự động focus vào chữ vừa tạo
                setTimeout(() => {
                    const el = document.getElementById('ann-' + newAnn.id);
                    if (el) {
                        el.focus();
                        const range = document.createRange();
                        range.selectNodeContents(el);
                        const sel = window.getSelection();
                        sel.removeAllRanges();
                        sel.addRange(range);
                    }
                }, 50);
                return;
            }

            // Tool: TÔ SÁNG, CHE NỘI DUNG, HOẶC OCR QUÉT VÙNG
            if (['highlight', 'whiteout', 'ocr'].includes(this.activeTool)) {
                this.isDrawing = true;
                this.dragStart = { xRatio, yRatio, pxX: x, pxY: y };

                // Tạo khung nháp
                this.activeBoxDraft = document.createElement('div');
                this.activeBoxDraft.className = 'absolute border-2 pointer-events-none z-30';
                if (this.activeTool === 'highlight') {
                    this.activeBoxDraft.className += ' border-amber-500 bg-yellow-200/40';
                } else if (this.activeTool === 'whiteout') {
                    this.activeBoxDraft.className += ' border-rose-500 bg-white/80';
                } else if (this.activeTool === 'ocr') {
                    this.activeBoxDraft.className += ' border-indigo-600 bg-indigo-500/20 border-dashed';
                }
                this.activeBoxDraft.style.left = x + 'px';
                this.activeBoxDraft.style.top = y + 'px';
                this.activeBoxDraft.style.width = '0px';
                this.activeBoxDraft.style.height = '0px';
                this.overlayEl.appendChild(this.activeBoxDraft);
            }
        },

        handleOverlayMouseMove(e) {
            if (!this.isDrawing || !this.dragStart || !this.activeBoxDraft) return;
            const rect = this.overlayEl.getBoundingClientRect();
            const curX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
            const curY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

            const left = Math.min(this.dragStart.pxX, curX);
            const top = Math.min(this.dragStart.pxY, curY);
            const width = Math.abs(curX - this.dragStart.pxX);
            const height = Math.abs(curY - this.dragStart.pxY);

            this.activeBoxDraft.style.left = left + 'px';
            this.activeBoxDraft.style.top = top + 'px';
            this.activeBoxDraft.style.width = width + 'px';
            this.activeBoxDraft.style.height = height + 'px';
        },

        async handleOverlayMouseUp(e) {
            if (!this.isDrawing || !this.dragStart) return;
            this.isDrawing = false;

            const rect = this.overlayEl.getBoundingClientRect();
            const curX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
            const curY = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

            const xRatio = Math.min(this.dragStart.pxX, curX) / rect.width;
            const yRatio = Math.min(this.dragStart.pxY, curY) / rect.height;
            const wRatio = Math.abs(curX - this.dragStart.pxX) / rect.width;
            const hRatio = Math.abs(curY - this.dragStart.pxY) / rect.height;

            if (this.activeBoxDraft) {
                this.activeBoxDraft.remove();
                this.activeBoxDraft = null;
            }

            // Nếu vùng quá nhỏ coi như vô tình click
            if (wRatio < 0.01 || hRatio < 0.01) return;

            // Xử lý OCR quét theo vùng chọn
            if (this.activeTool === 'ocr') {
                this.runRegionOcr({ xRatio, yRatio, wRatio, hRatio });
                return;
            }

            // Thêm Annotation mới
            const newAnn = {
                id: 'ann-' + Date.now(),
                type: this.activeTool,
                xRatio,
                yRatio,
                wRatio,
                hRatio,
                color: this.activeTool === 'whiteout' ? this.whiteoutColor : this.highlightColor
            };

            this.recordUndo();
            this.addAnnotation(newAnn);
            this.renderPageAnnotations(this.currentPage);
        },

        addAnnotation(ann) {
            if (!this.annotations[this.currentPage]) {
                this.annotations[this.currentPage] = [];
            }
            this.annotations[this.currentPage].push(ann);
            this.updateUndoRedoButtons();
        },

        deleteAnnotation(id) {
            this.recordUndo();
            const list = this.annotations[this.currentPage] || [];
            this.annotations[this.currentPage] = list.filter(a => a.id !== id);
            this.renderPageAnnotations(this.currentPage);
            this.updateUndoRedoButtons();
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
            this.renderPageAnnotations(this.currentPage);
            this.updateUndoRedoButtons();
        },

        redo() {
            if (this.redoStack.length === 0) return;
            this.undoStack.push(JSON.parse(JSON.stringify(this.annotations)));
            this.annotations = this.redoStack.pop();
            this.renderPageAnnotations(this.currentPage);
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

            // Options Bar
            const bar = document.getElementById('pdfToolOptionsBar');
            const textOpts = document.getElementById('pdfTextOptions');
            const hlOpts = document.getElementById('pdfHighlightOptions');
            const woOpts = document.getElementById('pdfWhiteoutOptions');
            const ocrOpts = document.getElementById('pdfOcrOptions');

            if (bar) bar.classList.toggle('hidden', tool === 'view');
            if (textOpts) textOpts.classList.toggle('hidden', tool !== 'text');
            if (hlOpts) hlOpts.classList.toggle('hidden', tool !== 'highlight');
            if (woOpts) woOpts.classList.toggle('hidden', tool !== 'whiteout');
            if (ocrOpts) ocrOpts.classList.toggle('hidden', tool !== 'ocr');

            // Cập nhật con trỏ chuột và chuyển đổi lớp tương tác (Text Selection vs Drawing)
            if (this.overlayEl) {
                if (tool === 'text') this.overlayEl.style.cursor = 'text';
                else if (tool === 'highlight' || tool === 'whiteout' || tool === 'ocr') this.overlayEl.style.cursor = 'crosshair';
                else this.overlayEl.style.cursor = 'default';

                if (tool === 'view') {
                    if (this.textLayerEl) this.textLayerEl.style.pointerEvents = 'auto';
                    this.overlayEl.style.pointerEvents = 'none';
                } else {
                    if (this.textLayerEl) this.textLayerEl.style.pointerEvents = 'none';
                    this.overlayEl.style.pointerEvents = 'auto';
                }
            }
        },

        setHighlightColor(color, btn) {
            this.highlightColor = color;
            btn.parentElement.querySelectorAll('button').forEach(b => b.classList.remove('ring-2', 'ring-yellow-400'));
            btn.classList.add('ring-2', 'ring-yellow-400');
        },

        // ---------------------------------------------------------------------
        // 4. ĐIỀU HƯỚNG TRANG & ZOOM / ROTATE
        // ---------------------------------------------------------------------
        prevPage() {
            if (this.currentPage > 1) {
                this.renderPage(this.currentPage - 1);
            }
        },

        nextPage() {
            if (this.currentPage < this.numPages) {
                this.renderPage(this.currentPage + 1);
            }
        },

        goToPage(pageNum) {
            const page = Math.max(1, Math.min(this.numPages, pageNum || 1));
            this.renderPage(page);
        },

        zoomIn() {
            if (this.scale < 3.0) {
                this.scale = Math.min(3.0, +(this.scale + 0.25).toFixed(2));
                this.updateZoomLabel();
                this.renderPage(this.currentPage);
            }
        },

        zoomOut() {
            if (this.scale > 0.5) {
                this.scale = Math.max(0.5, +(this.scale - 0.25).toFixed(2));
                this.updateZoomLabel();
                this.renderPage(this.currentPage);
            }
        },

        rotatePage() {
            this.rotation = (this.rotation + 90) % 360;
            this.renderPage(this.currentPage);
        },

        updateZoomLabel() {
            const lbl = document.getElementById('pdfZoomLabel');
            if (lbl) lbl.textContent = Math.round(this.scale * 100) + '%';
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

        /**
         * Render thanh thumbnail các trang bên trái
         */
        async renderThumbnailStrip() {
            const listEl = document.getElementById('pdfThumbnailsList');
            if (!listEl || !this.pdfDoc) return;
            listEl.innerHTML = '';

            const maxThumbnails = Math.min(30, this.numPages);
            for (let i = 1; i <= maxThumbnails; i++) {
                const item = document.createElement('div');
                item.id = `pdf-thumb-${i}`;
                item.className = 'cursor-pointer p-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-center hover:border-rose-400 transition';
                item.onclick = () => this.renderPage(i);

                const thumbCanvas = document.createElement('canvas');
                thumbCanvas.className = 'w-full h-auto rounded shadow-xs mx-auto block';
                item.appendChild(thumbCanvas);

                const label = document.createElement('div');
                label.className = 'text-[10px] font-bold text-slate-500 mt-1';
                label.textContent = `Trang ${i}`;
                item.appendChild(label);

                listEl.appendChild(item);

                // Render thumbnail async
                this.renderSingleThumbnail(i, thumbCanvas);
            }
            this.highlightActiveThumbnail();
        },

        async renderSingleThumbnail(pageNum, canvas) {
            try {
                const page = await this.pdfDoc.getPage(pageNum);
                const viewport = page.getViewport({ scale: 0.25 });
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                const ctx = canvas.getContext('2d');
                await page.render({ canvasContext: ctx, viewport }).promise;
            } catch (e) {}
        },

        highlightActiveThumbnail() {
            document.querySelectorAll('#pdfThumbnailsList > div').forEach(el => {
                el.classList.remove('ring-2', 'ring-rose-500', 'border-rose-500');
            });
            const active = document.getElementById(`pdf-thumb-${this.currentPage}`);
            if (active) {
                active.classList.add('ring-2', 'ring-rose-500', 'border-rose-500');
                active.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        },

        // ---------------------------------------------------------------------
        // 5. TÍCH HỢP OCR NHẬN DẠNG CHỮ SCAN (TIẾNG VIỆT & TIẾNG ANH)
        // ---------------------------------------------------------------------
        async runFullPageOcr() {
            if (!this.canvasEl) return;
            this.showLoading('Đang khởi động trí tuệ nhân tạo OCR tiếng Việt...');
            try {
                await ensureTesseract();
                this.showLoading('Đang nhận dạng chữ trên toàn bộ trang...');

                const worker = await window.Tesseract.createWorker('vie+eng');
                const ret = await worker.recognize(this.canvasEl);
                await worker.terminate();

                this.hideLoading();
                this.showOcrResult(ret.data.text || 'Không nhận dạng được văn bản nào trên trang này.', null);
            } catch (err) {
                console.error('OCR error:', err);
                this.hideLoading();
                alert('Không thể thực hiện OCR: ' + (err.message || 'Lỗi mạng tải mô hình nhận diện'));
            }
        },

        async runRegionOcr(region) {
            if (!this.canvasEl) return;
            this.showLoading('Đang xử lý vùng chọn và nhận dạng OCR tiếng Việt...');
            try {
                await ensureTesseract();

                // Cắt ảnh vùng chọn từ Canvas
                const cropCanvas = document.createElement('canvas');
                const ctx = cropCanvas.getContext('2d');
                const dpr = window.devicePixelRatio || 1;

                const sx = region.xRatio * this.canvasEl.width;
                const sy = region.yRatio * this.canvasEl.height;
                const sw = region.wRatio * this.canvasEl.width;
                const sh = region.hRatio * this.canvasEl.height;

                cropCanvas.width = sw;
                cropCanvas.height = sh;
                ctx.drawImage(this.canvasEl, sx, sy, sw, sh, 0, 0, sw, sh);

                this.showLoading('Đang đọc chữ trong vùng đã chọn...');
                const worker = await window.Tesseract.createWorker('vie+eng');
                const ret = await worker.recognize(cropCanvas);
                await worker.terminate();

                this.hideLoading();
                this.showOcrResult(ret.data.text || '', region);
            } catch (err) {
                console.error('OCR Region error:', err);
                this.hideLoading();
                alert('Lỗi nhận diện vùng chọn: ' + err.message);
            }
        },

        showOcrResult(text, region) {
            this.lastOcrRegion = region;
            const modal = document.getElementById('pdfOcrResultModal');
            const textarea = document.getElementById('pdfOcrOutputTextarea');
            if (textarea) textarea.value = text.trim();
            if (modal) modal.classList.remove('hidden');
        },

        copyOcrText() {
            const textarea = document.getElementById('pdfOcrOutputTextarea');
            if (textarea) {
                navigator.clipboard.writeText(textarea.value);
                if (window.showToast) window.showToast('📋 Đã sao chép văn bản nhận dạng vào Clipboard!');
            }
        },

        applyOcrReplace() {
            const textarea = document.getElementById('pdfOcrOutputTextarea');
            const text = textarea ? textarea.value.trim() : '';
            if (!text) return;

            const region = this.lastOcrRegion || { xRatio: 0.1, yRatio: 0.2, wRatio: 0.8, hRatio: 0.15 };

            this.recordUndo();

            // 1. Tạo hộp che nội dung cũ
            const whiteoutAnn = {
                id: 'ann-wo-' + Date.now(),
                type: 'whiteout',
                xRatio: region.xRatio,
                yRatio: region.yRatio,
                wRatio: region.wRatio,
                hRatio: region.hRatio,
                color: '#ffffff'
            };
            this.addAnnotation(whiteoutAnn);

            // 2. Tạo hộp văn bản mới ngay tại vị trí đó
            const textAnn = {
                id: 'ann-txt-' + Date.now(),
                type: 'text',
                xRatio: region.xRatio,
                yRatio: region.yRatio,
                wRatio: region.wRatio,
                hRatio: region.hRatio,
                text: text,
                color: '#1e293b',
                fontSize: 15,
                fontFamily: 'Inter, system-ui, sans-serif'
            };
            this.addAnnotation(textAnn);

            this.renderPageAnnotations(this.currentPage);
            document.getElementById('pdfOcrResultModal').classList.add('hidden');
            if (window.showToast) window.showToast('✨ Đã che nội dung scan cũ và thay thế bằng văn bản mới!');
        },

        insertOcrIntoNotePaper() {
            const textarea = document.getElementById('pdfOcrOutputTextarea');
            const text = textarea ? textarea.value.trim() : '';
            if (!text) return;

            const paper = document.getElementById('takeNoteEditorPaper');
            if (paper) {
                const safeHtml = this.escapeHtml(text)
                    .split('\n')
                    .map(l => `<p>${l || '<br>'}</p>`)
                    .join('');

                paper.insertAdjacentHTML('beforeend', `
                    <div class="my-3 p-3 rounded-xl bg-indigo-50/70 dark:bg-slate-800 border border-indigo-200">
                        <strong class="text-xs text-indigo-800 dark:text-indigo-300">🔍 Văn bản nhận dạng OCR (Trang ${this.currentPage}):</strong>
                        <div class="mt-1.5 text-sm">${safeHtml}</div>
                    </div>
                `);
                if (window.saveCurrentTakeNote) window.saveCurrentTakeNote();
                if (window.showToast) window.showToast('📝 Đã chèn nội dung OCR vào Sổ Note!');
            }
            document.getElementById('pdfOcrResultModal').classList.add('hidden');
        },

        // ---------------------------------------------------------------------
        // 6. XUẤT FILE PDF MỚI (pdf-lib & Canvas Overlay Compositing)
        // Bảo tồn nguyên vẹn 100% trang, vector, font và hỗ trợ tiếng Việt có dấu
        // ---------------------------------------------------------------------
        async exportPdf() {
            if (!this.arrayBuffer || !this.pdfDoc) return;
            this.showLoading('Đang chuẩn bị xuất file PDF chất lượng cao...');

            try {
                // Tải pdf-lib an toàn từ local hoặc CDN
                await ensurePdfLib();
                if (!window.PDFLib) {
                    throw new Error('Thư viện PDFLib không thể khởi tạo.');
                }

                const { PDFDocument } = window.PDFLib;
                const pdfDoc = await PDFDocument.load(this.arrayBuffer, { ignoreEncryption: true });
                const pages = pdfDoc.getPages();

                // Lặp qua các trang có chú thích để vẽ lớp phủ
                for (let pageNum = 1; pageNum <= pages.length; pageNum++) {
                    const anns = this.annotations[pageNum];
                    if (!anns || anns.length === 0) continue;

                    this.showLoading(`Đang xử lý lớp chữ & tô sáng trang ${pageNum}/${pages.length}...`);
                    const targetPage = pages[pageNum - 1];
                    const pageWidth = targetPage.getWidth();
                    const pageHeight = targetPage.getHeight();

                    // Tạo một High-Resolution Canvas cho lớp chú thích
                    const exportCanvas = document.createElement('canvas');
                    const scaleFactor = 2.0; // 2x scale cho độ sắc nét cao
                    exportCanvas.width = Math.round(pageWidth * scaleFactor);
                    exportCanvas.height = Math.round(pageHeight * scaleFactor);
                    const ctx = exportCanvas.getContext('2d');

                    ctx.scale(scaleFactor, scaleFactor);

                    // Vẽ từng annotation
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
                            const fontSize = (ann.fontSize || 16) * 0.9;
                            ctx.font = `bold ${fontSize}px Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
                            ctx.textBaseline = 'top';

                            // Word-wrap hỗ trợ tiếng Việt có dấu
                            const lines = this.wrapTextLines(ctx, ann.text || '', w);
                            let curY = y + 2;
                            lines.forEach(line => {
                                ctx.fillText(line, x + 2, curY);
                                curY += fontSize * 1.28;
                            });
                        }
                    });

                    // Chuyển canvas thành PNG và nhúng vào trang pdf-lib
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

                // Kích hoạt tải về máy
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

        wrapTextLines(ctx, text, maxWidth) {
            const paragraphs = text.split('\n');
            const lines = [];
            paragraphs.forEach(p => {
                const words = p.split(' ');
                let currentLine = '';
                words.forEach(w => {
                    const testLine = currentLine ? currentLine + ' ' + w : w;
                    const testWidth = ctx.measureText(testLine).width;
                    if (testWidth > maxWidth && currentLine) {
                        lines.push(currentLine);
                        currentLine = w;
                    } else {
                        currentLine = testLine;
                    }
                });
                if (currentLine) lines.push(currentLine);
            });
            return lines;
        },

        /**
         * Trích xuất văn bản vào Sổ Note paper thông thường
         */
        async extractAllTextToNote() {
            if (!this.pdfDoc) return;
            this.showLoading('Đang trích xuất toàn bộ văn bản từ PDF...');
            try {
                let fullTextHtml = '';
                for (let i = 1; i <= this.numPages; i++) {
                    const page = await this.pdfDoc.getPage(i);
                    const content = await page.getTextContent();
                    const pageText = content.items.map(it => it.str || '').join(' ').trim();
                    if (pageText) {
                        fullTextHtml += `<h4 class="font-extrabold text-xs text-rose-700 mt-2">📄 TRANG ${i}:</h4><p>${this.escapeHtml(pageText)}</p>`;
                    }
                }

                const paper = document.getElementById('takeNoteEditorPaper');
                if (paper) {
                    paper.insertAdjacentHTML('beforeend', `
                        <div class="my-4 p-4 rounded-2xl bg-rose-50/70 dark:bg-slate-800 border border-rose-200">
                            <strong class="text-sm text-rose-800 dark:text-rose-300">📕 Trích xuất văn bản: ${this.escapeHtml(this.fileName)}</strong>
                            <div class="mt-2 space-y-2 text-xs leading-relaxed">${fullTextHtml || '<p><em>(Tài liệu không có lớp văn bản số, là bản scan)</em></p>'}</div>
                        </div>
                    `);
                    if (window.saveCurrentTakeNote) window.saveCurrentTakeNote();
                    if (window.showToast) window.showToast('✅ Đã trích xuất văn bản sang Sổ Note!');
                }
                this.hideLoading();
            } catch (e) {
                this.hideLoading();
                alert('Không thể trích xuất văn bản: ' + e.message);
            }
        },

        /**
         * Lưu trạng thái chú thích vào Note hiện tại
         */
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

        /**
         * Đóng PDF Studio và giải phóng bộ nhớ
         */
        destroy() {
            if (this.pdfDoc) {
                try { this.pdfDoc.destroy(); } catch (e) {}
                this.pdfDoc = null;
            }
            this.arrayBuffer = null;
            this.annotations = {};
            this.undoStack = [];
            this.redoStack = [];
            if (this.canvasEl) {
                const ctx = this.canvasEl.getContext('2d');
                if (ctx) ctx.clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
            }
            if (this.overlayEl) this.overlayEl.innerHTML = '';
        },

        closePdf() {
            this.destroy();
            const container = document.getElementById('pdfStudioWorkspace');
            if (container) container.remove();
            if (window.showToast) window.showToast('👋 Đã đóng trình xem PDF.');
        },

        // Helper UI
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

        showBannerNotice(html) {
            const el = document.getElementById('pdfStudioNotice');
            const txt = document.getElementById('pdfStudioNoticeText');
            if (el && txt) {
                txt.innerHTML = html;
                el.classList.remove('hidden');
            }
        },

        showErrorNotice(msg) {
            this.showBannerNotice(`<span class="text-rose-600 font-bold">⚠️ ${this.escapeHtml(msg)}</span>`);
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
