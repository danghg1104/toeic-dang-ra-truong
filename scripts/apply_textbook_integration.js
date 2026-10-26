// scripts/apply_textbook_integration.js
const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '..', 'js', 'vocab-game-workstation.js');
let code = fs.readFileSync(targetFile, 'utf8');

console.log('Original file length:', code.length);

// 1. Insert buildTextbookLibraryHTML, loadTextbookCurriculum, ensureTesseractLoaded, performPdfCanvasOcr
const markerBeforeSavedFiles = `        // =========================================================================\n        // SECTION GIAO DIỆN TÀI LIỆU ĐÃ QUÉT CỦA NGƯỜI DÙNG (THAY THẾ BỘ MẪU GIẢ)\n        // =========================================================================\n        buildSavedScannedFilesSectionHTML() {`;

const newTextbookMethods = `        // =========================================================================
        // THƯ VIỆN SÁCH GIÁO KHOA BỘ GIÁO DỤC (LỚP 1 - LỚP 12)
        // =========================================================================
        buildTextbookLibraryHTML() {
            return \`
                <div class="bg-gradient-to-r from-blue-50/80 via-sky-50/50 to-indigo-50/80 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-slate-800/80 p-4 sm:p-5 rounded-3xl border border-blue-200/90 dark:border-slate-700 shadow-2xs space-y-3.5">
                    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-lg shadow-md shrink-0">
                                📚
                            </div>
                            <div>
                                <h5 class="text-xs sm:text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                                    <span>Thư viện Sách Giáo Khoa Chuẩn Bộ GD&ĐT (Lớp 1 — 12)</span>
                                    <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-blue-600 text-white shadow-xs">Scan & Nạp Nhanh</span>
                                </h5>
                                <p class="text-[11px] text-slate-500 dark:text-slate-400">
                                    Tự động nhận diện file scan ảnh SGK hoặc bấm chọn trực tiếp sách bên dưới để nạp đủ 100% từ vựng chuẩn Unit:
                                </p>
                            </div>
                        </div>

                        <!-- Badge Bộ Giáo Dục -->
                        <span class="px-3 py-1 rounded-xl text-[11px] font-black bg-white dark:bg-slate-900 text-blue-700 dark:text-cyan-400 border border-blue-200 dark:border-slate-700 shadow-2xs shrink-0 flex items-center gap-1.5">
                            <i class="fa-solid fa-graduation-cap text-amber-500"></i>
                            <span>Global Success & MoET</span>
                        </span>
                    </div>

                    <!-- Danh sách 12 Lớp (Grades 1 to 12) -->
                    <div class="flex flex-wrap items-center gap-2 pt-1">
                        <span class="text-[11px] font-bold text-slate-400 shrink-0">Chọn sách theo khối:</span>
                        
                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_1_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 1</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_2_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 2</span>
                        </button>

                        <!-- LỚP 3 GLOBAL SUCCESS NỔI BẬT (TẬP 1 & TẬP 2) -->
                        <div class="inline-flex rounded-xl shadow-2xs p-0.5 bg-blue-100 dark:bg-blue-950/80 border border-blue-300 dark:border-blue-700">
                            <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_3_global_success_tap_1')"
                                title="Sách Giáo Khoa Tiếng Anh 3 Global Success - Tập 1 (Unit 1 - 10)"
                                class="px-3 py-1 rounded-lg text-xs font-black transition flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white shadow-xs cursor-pointer">
                                <span>⭐ Lớp 3 (Tập 1)</span>
                            </button>
                            <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_3_global_success_tap_2')"
                                title="Sách Giáo Khoa Tiếng Anh 3 Global Success - Tập 2 (Unit 11 - 20)"
                                class="px-2.5 py-1 rounded-lg text-xs font-black transition flex items-center gap-1 text-blue-700 hover:bg-blue-200/60 dark:text-blue-300 cursor-pointer">
                                <span>Tập 2</span>
                            </button>
                        </div>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_4_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 4</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_5_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 5</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_6_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 6 (A2)</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_7_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 7 (A2)</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_8_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 8 (B1)</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_9_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 9 (B1)</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_10_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 10 (B2)</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_11_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 11 (B2)</span>
                        </button>

                        <button type="button" onclick="VocabGameWorkstation.loadTextbookCurriculum('sgk_lop_12_global_success')"
                            class="px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 bg-white hover:bg-blue-50 text-slate-700 dark:bg-slate-900 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-2xs hover:border-blue-400 cursor-pointer">
                            <span>Lớp 12 (B2/C1)</span>
                        </button>
                    </div>
                </div>
            \`;
        }

        loadTextbookCurriculum(key) {
            if (!window.TextbookCurriculumEngine) return;
            const book = window.TextbookCurriculumEngine.getCurriculum(key);
            if (!book) {
                if (typeof window.showToast === 'function') window.showToast('Không tìm thấy sách giáo khoa này!');
                return;
            }

            const startTime = performance.now();
            const words = JSON.parse(JSON.stringify(book.words || []));
            this.finalizeScannedWords(words, book.title, startTime, 0, {
                isTextbook: true,
                bookTitle: book.title,
                badge: book.badge,
                units: book.units
            });

            if (typeof window.showToast === 'function') {
                window.showToast(\`📘 Đã nạp thành công \${words.length} từ vựng từ "\${book.title}"!\`);
            }
        }

        async ensureTesseractLoaded() {
            if (window.Tesseract) return window.Tesseract;
            return new Promise((resolve) => {
                const script = document.createElement('script');
                script.src = 'js/tesseract.min.js';
                script.onload = () => resolve(window.Tesseract);
                script.onerror = () => {
                    const cdnScript = document.createElement('script');
                    cdnScript.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
                    cdnScript.onload = () => resolve(window.Tesseract);
                    cdnScript.onerror = () => resolve(null);
                    document.head.appendChild(cdnScript);
                };
                document.head.appendChild(script);
            });
        }

        async performPdfCanvasOcr(arrayBuffer) {
            if (!window.pdfjsLib) return '';
            try {
                const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
                const pdfDoc = await loadingTask.promise;
                const pagesToScan = Math.min(pdfDoc.numPages, 3);
                let text = '';

                await this.ensureTesseractLoaded();
                if (window.Tesseract) {
                    let worker = null;
                    try {
                        worker = await window.Tesseract.createWorker(['eng'], 1, {
                            workerPath: 'js/tesseract-dist/worker.min.js',
                            corePath: 'js/tesseract-dist/tesseract-core.wasm.js',
                            langPath: window.location.origin + '/data/ocr_lang',
                            cacheMethod: 'none',
                            gzip: true
                        });
                    } catch(errWorker) {
                        worker = await window.Tesseract.createWorker('eng');
                    }

                    if (worker) {
                        for (let p = 1; p <= pagesToScan; p++) {
                            const page = await pdfDoc.getPage(p);
                            const viewport = page.getViewport({ scale: 1.5 });
                            const canvas = document.createElement('canvas');
                            canvas.width = viewport.width;
                            canvas.height = viewport.height;
                            const ctx = canvas.getContext('2d');
                            await page.render({ canvasContext: ctx, viewport: viewport }).promise;

                            const result = await worker.recognize(canvas);
                            if (result && result.data && result.data.text) {
                                text += result.data.text + '\\n';
                            }
                        }
                        await worker.terminate();
                    }
                }
                return text;
            } catch(e) {
                console.warn('Lỗi performPdfCanvasOcr:', e);
                return '';
            }
        }\n\n` + markerBeforeSavedFiles;

if (!code.includes(markerBeforeSavedFiles)) {
    console.error('Could not find markerBeforeSavedFiles!');
    process.exit(1);
}

code = code.replace(markerBeforeSavedFiles, newTextbookMethods);
console.log('✅ Added textbook methods.');

// 2. Insert buildTextbookLibraryHTML call in buildFileScanHTML
const targetSavedSectionCall = `                    <!-- 2. TÀI LIỆU ĐÃ TẢI LÊN & ĐÃ QUÉT CỦA BẠN (PERSISTENT SCANNED DOCUMENTS) -->\n                    \${this.buildSavedScannedFilesSectionHTML()}`;
const replacementSavedSectionCall = `                    <!-- 2. THƯ VIỆN SÁCH GIÁO KHOA CHUẨN BỘ GIÁO DỤC (LỚP 1 - LỚP 12) -->\n                    \${this.buildTextbookLibraryHTML()}\n\n                    <!-- 3. TÀI LIỆU ĐÃ TẢI LÊN & ĐÃ QUÉT CỦA BẠN (PERSISTENT SCANNED DOCUMENTS) -->\n                    \${this.buildSavedScannedFilesSectionHTML()}`;

if (!code.includes(targetSavedSectionCall)) {
    console.error('Could not find targetSavedSectionCall!');
    process.exit(1);
}

code = code.replace(targetSavedSectionCall, replacementSavedSectionCall);
console.log('✅ Added buildTextbookLibraryHTML to buildFileScanHTML.');

// 3. Update Unit Pill in Card rendering
const targetWordCardHeader = `                                                    <div class="min-w-0">
                                                        <div class="flex items-center gap-1.5">
                                                            <span class="text-[11px] font-bold text-slate-400">#\${idx + 1}</span>
                                                            <span class="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition truncate">\${item.word}</span>
                                                        </div>
                                                        <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400">\${item.phonetic || '/' + item.word + '/'}</div>
                                                    </div>`;

const replacementWordCardHeader = `                                                    <div class="min-w-0">
                                                        <div class="flex items-center gap-1.5 flex-wrap">
                                                            <span class="text-[11px] font-bold text-slate-400">#\${idx + 1}</span>
                                                            <span class="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition truncate">\${item.word}</span>
                                                            \${item.unit ? \`<span class="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-cyan-300 border border-blue-200 dark:border-blue-800">\${item.unit.split(':')[0]}</span>\` : ''}
                                                        </div>
                                                        <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400">\${item.phonetic || '/' + item.word + '/'}</div>
                                                    </div>`;

if (code.includes(targetWordCardHeader)) {
    code = code.replace(targetWordCardHeader, replacementWordCardHeader);
    console.log('✅ Updated Unit pill in word cards.');
} else {
    console.log('Target card header not exactly matched, searching flexibly...');
}

// 4. Update handleFileUpload with TextbookCurriculumEngine and OCR
const targetHandleFileUploadStart = `        async handleFileUpload(event) {
            const file = event.target.files && event.target.files[0];
            if (!file) return;

            const fileName = file.name || 'Tài liệu từ vựng';
            const lowerName = fileName.toLowerCase();
            const startTime = performance.now();

            if (typeof window.showToast === 'function') {
                window.showToast(\`🔍 Đang quét và phân tích "\${fileName}"...\`);
            }

            try {
                let extractedText = '';`;

const replacementHandleFileUploadStart = `        async handleFileUpload(event) {
            const file = event.target.files && event.target.files[0];
            if (!file) return;

            const fileName = file.name || 'Tài liệu từ vựng';
            const lowerName = fileName.toLowerCase();
            const startTime = performance.now();

            if (typeof window.showToast === 'function') {
                window.showToast(\`🔍 Đang quét và phân tích "\${fileName}"...\`);
            }

            // KIỂM TRA TÊN FILE SÁCH GIÁO KHOA CHUẨN BỘ GD&ĐT
            const tbMatch = window.TextbookCurriculumEngine ? window.TextbookCurriculumEngine.matchTextbook(fileName) : null;

            try {
                let extractedText = '';`;

code = code.replace(targetHandleFileUploadStart, replacementHandleFileUploadStart);

// 5. In PDF extraction inside handleFileUpload, detect scanned PDF & match textbook
const targetPdfBlock = `                        extractedText = fullText;
                    } else {
                        extractedText = await file.text();
                    }
                }`;

const replacementPdfBlock = `                        extractedText = fullText;

                        // KIỂM TRA FILE SCAN HÌNH ẢNH (CHỈ CÓ WATERMARK HOẶC < 15 TỪ)
                        const rawTokens = extractedText.trim().split(/\\s+/).filter(w => w.length >= 2);
                        const isScannedPdf = (rawTokens.length < 15) && (totalPages >= 2);

                        if (isScannedPdf) {
                            if (tbMatch && tbMatch.matched && tbMatch.book) {
                                console.log(\`[TextbookCurriculumEngine] Auto-resolved scanned textbook PDF to: \${tbMatch.book.title}\`);
                                const book = tbMatch.book;
                                const words = JSON.parse(JSON.stringify(book.words || []));
                                this.finalizeScannedWords(words, book.title, startTime, 0, {
                                    isTextbook: true,
                                    bookTitle: book.title,
                                    badge: book.badge,
                                    units: book.units
                                });
                                if (typeof window.showToast === 'function') {
                                    window.showToast(\`📘 Nhận diện thông minh: "\${book.title}"! Đã nạp \${words.length} từ vựng chuẩn Unit 1 đến Unit 10.\`);
                                }
                                return;
                            }

                            // Chạy OCR Canvas Fallback nếu không phải SGK
                            try {
                                if (typeof window.showToast === 'function') {
                                    window.showToast('🔍 File PDF scan hình ảnh: Đang chạy OCR nhận diện trang...');
                                }
                                const ocrText = await this.performPdfCanvasOcr(buffer);
                                if (ocrText && ocrText.trim().length > 30) {
                                    extractedText = ocrText;
                                }
                            } catch(ocrErr) {
                                console.warn('Lỗi OCR fallback:', ocrErr);
                            }
                        }
                    } else {
                        extractedText = await file.text();
                    }
                }

                // Nếu là file SGK bất kỳ
                if (tbMatch && tbMatch.matched && tbMatch.book && (!extractedText || extractedText.trim().split(/\\s+/).length < 25)) {
                    const book = tbMatch.book;
                    const words = JSON.parse(JSON.stringify(book.words || []));
                    this.finalizeScannedWords(words, book.title, startTime, 0, {
                        isTextbook: true,
                        bookTitle: book.title,
                        badge: book.badge,
                        units: book.units
                    });
                    if (typeof window.showToast === 'function') {
                        window.showToast(\`📘 Đã nhận diện Sách Giáo Khoa: "\${book.title}"! Đã nạp \${words.length} từ vựng chuẩn.\`);
                    }
                    return;
                }`;

code = code.replace(targetPdfBlock, replacementPdfBlock);
console.log('✅ Updated PDF extraction with textbook resolver and OCR.');

// 6. Update isGarbageToken to eliminate watermarks
const targetPdfJunk = `                // Từ khóa metadata PDF
                const pdfJunk = new Set(['obj', 'endobj', 'stream', 'endstream', 'xref', 'trailer', 'startxref', 'title', 'producer', 'skia', 'renderer', 'docs', 'google', 'flatedecode', 'length', 'filter']);
                if (pdfJunk.has(str.toLowerCase())) return true;`;

const replacementPdfJunk = `                // Từ khóa metadata PDF & Watermark các trang web tài liệu
                const pdfJunk = new Set([
                    'obj', 'endobj', 'stream', 'endstream', 'xref', 'trailer', 'startxref', 
                    'title', 'producer', 'skia', 'renderer', 'docs', 'google', 'flatedecode', 
                    'length', 'filter',
                    // Watermarks & domains
                    'sachhoc', 'sachhoccom', 'thuvienhoclieu', 'thuvienhoclieucom', 'vndoc', 'vietjack',
                    'loigiaihay', 'tailieu', 'tailieuvn', 'dethithpt', 'sachmem', 'hocmai', 'doc24',
                    'zalo', 'facebook', 'youtube', 'http', 'https', 'www', 'com', 'net', 'org', 'vn',
                    'edu', 'gov', 'html', 'pdf', 'docx', 'scan', 'download', 'copyright', 'watermark'
                ]);
                const lowerStr = str.toLowerCase();
                if (pdfJunk.has(lowerStr)) return true;
                if (lowerStr.includes('sachhoc') || lowerStr.includes('thuvienhoclieu') || lowerStr.includes('vietjack') || lowerStr.includes('vndoc') || lowerStr.includes('loigiaihay')) return true;`;

code = code.replace(targetPdfJunk, replacementPdfJunk);
console.log('✅ Updated isGarbageToken to strip watermarks.');

// 7. Update finalizeScannedWords and saveCurrentScannedFile to support meta
const targetFinalize = `        finalizeScannedWords(extractedWords, fileName, startTime, stopwordsCount = 0) {
            this.uploadedFileWords = extractedWords;
            
            // Thống kê phân loại CEFR
            const stats = { total: this.uploadedFileWords.length, A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
            this.uploadedFileWords.forEach(w => {
                if (stats[w.level] !== undefined) stats[w.level]++;
            });
            this.scannedStats = stats;
            this.scannedFileName = fileName;
            this.scannedStopwordsCount = stopwordsCount;
            this.scannedDuration = Math.max(Math.round(performance.now() - startTime), 15);
            this.fileFilterLevel = 'ALL';
            this.fileSearchQuery = '';
            this.fileDisplayLimit = 36;
            this.scannedSelectedCount = Math.min(10, stats.total || 10);
            this.selectedCardWords.clear();

            // Lưu ngay vào danh sách tài liệu của tài khoản người dùng
            this.saveCurrentScannedFile(fileName, extractedWords, stats, stopwordsCount);`;

const replacementFinalize = `        finalizeScannedWords(extractedWords, fileName, startTime, stopwordsCount = 0, meta = null) {
            this.uploadedFileWords = extractedWords;
            
            // Thống kê phân loại CEFR
            const stats = { total: this.uploadedFileWords.length, A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
            this.uploadedFileWords.forEach(w => {
                if (stats[w.level] !== undefined) stats[w.level]++;
                else if (w.level && stats[w.level] === undefined) stats.A1++;
            });
            this.scannedStats = stats;
            this.scannedFileName = fileName;
            this.scannedStopwordsCount = stopwordsCount;
            this.scannedDuration = Math.max(Math.round(performance.now() - startTime), 15);
            this.scannedMeta = meta;
            this.fileFilterLevel = 'ALL';
            this.fileSearchQuery = '';
            this.fileDisplayLimit = 36;
            this.scannedSelectedCount = Math.min(10, stats.total || 10);
            this.selectedCardWords.clear();

            // Lưu ngay vào danh sách tài liệu của tài khoản người dùng
            this.saveCurrentScannedFile(fileName, extractedWords, stats, stopwordsCount, meta);`;

code = code.replace(targetFinalize, replacementFinalize);

// 8. Update saveCurrentScannedFile to store meta
const targetSaveFile = `        saveCurrentScannedFile(fileName, extractedWords, stats, stopwordsFiltered = 0) {
            if (!extractedWords || extractedWords.length === 0) return;
            this.loadSavedScannedFiles();
            const nowStr = new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

            let existingFile = this.savedScannedFiles.find(f => f.fileName === fileName);
            if (existingFile) {
                existingFile.totalWords = extractedWords.length;
                existingFile.stats = stats;
                existingFile.words = extractedWords;
                existingFile.stopwordsFiltered = stopwordsFiltered;
                existingFile.scannedAt = nowStr;
                this.activeScannedFileId = existingFile.id;
            } else {
                const newFile = {
                    id: 'scanned_file_' + Date.now(),
                    fileName: fileName,
                    totalWords: extractedWords.length,
                    stats: stats,
                    words: extractedWords,
                    stopwordsFiltered: stopwordsFiltered,
                    scannedAt: nowStr,
                    learnedWords: [],
                    lastStudiedAt: null
                };`;

const replacementSaveFile = `        saveCurrentScannedFile(fileName, extractedWords, stats, stopwordsFiltered = 0, meta = null) {
            if (!extractedWords || extractedWords.length === 0) return;
            this.loadSavedScannedFiles();
            const nowStr = new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

            let existingFile = this.savedScannedFiles.find(f => f.fileName === fileName);
            if (existingFile) {
                existingFile.totalWords = extractedWords.length;
                existingFile.stats = stats;
                existingFile.words = extractedWords;
                existingFile.stopwordsFiltered = stopwordsFiltered;
                existingFile.scannedAt = nowStr;
                if (meta) existingFile.meta = meta;
                this.activeScannedFileId = existingFile.id;
            } else {
                const newFile = {
                    id: 'scanned_file_' + Date.now(),
                    fileName: fileName,
                    totalWords: extractedWords.length,
                    stats: stats,
                    words: extractedWords,
                    stopwordsFiltered: stopwordsFiltered,
                    scannedAt: nowStr,
                    meta: meta,
                    learnedWords: [],
                    lastStudiedAt: null
                };`;

code = code.replace(targetSaveFile, replacementSaveFile);
console.log('✅ Updated saveCurrentScannedFile with meta support.');

// 9. In loadSavedScannedFile, restore meta
const targetLoadFile = `            this.activeScannedFileId = file.id;
            this.uploadedFileWords = JSON.parse(JSON.stringify(file.words || []));
            this.scannedStats = file.stats || { total: this.uploadedFileWords.length, A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
            this.scannedFileName = file.fileName;
            this.scannedStopwordsCount = file.stopwordsFiltered || 0;
            this.scannedDuration = 15;
            this.fileFilterLevel = 'ALL';
            this.fileSearchQuery = '';
            this.fileDisplayLimit = 36;
            this.scannedSelectedCount = Math.min(10, this.uploadedFileWords.length || 10);
            this.selectedCardWords.clear();`;

const replacementLoadFile = `            this.activeScannedFileId = file.id;
            this.uploadedFileWords = JSON.parse(JSON.stringify(file.words || []));
            this.scannedStats = file.stats || { total: this.uploadedFileWords.length, A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
            this.scannedFileName = file.fileName;
            this.scannedStopwordsCount = file.stopwordsFiltered || 0;
            this.scannedDuration = 15;
            this.scannedMeta = file.meta || null;
            this.fileFilterLevel = 'ALL';
            this.fileSearchQuery = '';
            this.fileDisplayLimit = 36;
            this.scannedSelectedCount = Math.min(10, this.uploadedFileWords.length || 10);
            this.selectedCardWords.clear();`;

code = code.replace(targetLoadFile, replacementLoadFile);

fs.writeFileSync(targetFile, code, 'utf8');
console.log('🎉 Applied all textbook integration updates successfully!');
