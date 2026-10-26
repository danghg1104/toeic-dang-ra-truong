const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'vocab-game-workstation.js');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Thêm this.scannedSelectedCount = 10 vào constructor VocabGameWorkstation
if (!code.includes('this.scannedSelectedCount = 10;')) {
    code = code.replace(
        'this.fileFilterLevel = \'ALL\';',
        'this.fileFilterLevel = \'ALL\';\n            this.scannedSelectedCount = 10;'
    );
    console.log('✅ Đã thêm this.scannedSelectedCount = 10 vào constructor');
}

// 2. Thêm phương thức parseVocabLine vào VocabGameWorkstation
const parseVocabLineMethod = `
        parseVocabLine(line) {
            let clean = (line || '').trim();
            if (!clean) return null;

            // Bỏ qua tiêu đề bảng hoặc chú thích
            if (/^(stt|từ vựng|tu vung|danh sách|danh sach|bảng|page \\d+|trang \\d+)/i.test(clean)) return null;

            // 1. Loại bỏ số thứ tự ở đầu dòng nếu có (VD: '1 ', '1. ', '1) ')
            clean = clean.replace(/^\\d+[\\.\\)]?\\s+/, '');

            // 2. Tìm phiên âm /.../
            const slash1 = clean.indexOf('/');
            const slash2 = clean.lastIndexOf('/');
            if (slash1 !== -1 && slash2 > slash1) {
                let left = clean.slice(0, slash1).trim();
                let ipa = clean.slice(slash1, slash2 + 1).trim();
                let right = clean.slice(slash2 + 1).trim();

                // Tách word và part-of-speech từ left
                const posRegex = /\\s+(?:(?:adj|adv|prep|conj|pron|det|modal(?:\s+v)?|auxiliary(?:\s+v)?|n|v)\\.?\\s*(?:,\\s*)?|exclamation|prefix|suffix)+$/i;
                left = left.replace(/\\(also[^)]*\\)/i, '').replace(posRegex, '').trim();
                if (left.includes(',')) left = left.split(',')[0].trim();
                if (left.includes('(')) left = left.split('(')[0].trim();

                let meaning = right.replace(/^[,;\\s\\-\\:]+/, '').trim();
                if (left && /^[a-zA-Z\\s\\-']{2,40}$/.test(left)) {
                    return { word: left, phonetic: ipa, meaning };
                }
            }

            // 3. Phân tách theo dấu gạch ngang '-' hoặc hai chấm ':' hoặc tab '\\t'
            const sepMatch = clean.match(/^([a-zA-Z\\s\\-']{2,35})\\s*[-:\\t]\\s*(.+)$/);
            if (sepMatch) {
                return {
                    word: sepMatch[1].trim(),
                    phonetic: '/' + sepMatch[1].trim() + '/',
                    meaning: sepMatch[2].trim()
                };
            }

            // 4. Nếu là dòng tiếng Anh có tiếng Việt theo sau (không có dấu ngăn)
            const wordThenVi = clean.match(/^([a-zA-Z\\s\\-']{2,35})\\s+([à-ỹÀ-Ỹ].+)$/);
            if (wordThenVi) {
                return {
                    word: wordThenVi[1].trim(),
                    phonetic: '/' + wordThenVi[1].trim() + '/',
                    meaning: wordThenVi[2].trim()
                };
            }

            return null;
        }

        handleScannedCountSlider(val) {
            let num = parseInt(val, 10);
            const total = (this.uploadedFileWords && this.uploadedFileWords.length) || 50;
            if (isNaN(num) || num < 1) num = 1;
            if (num > total) num = total;
            this.scannedSelectedCount = num;
            this.renderInto();
        }
`;

// 3. Cập nhật handleFileUpload, processUploadedFileText và loadScannedIntoGame
// Tìm vị trí handleFileUpload
const handleFileUploadStart = code.lastIndexOf('async handleFileUpload(event) {');
const loadScannedIntoGameEnd = code.indexOf('// =========================================================================\n        // XỬ LÝ TỰ ĐIỀN TỪ', handleFileUploadStart);

if (handleFileUploadStart !== -1 && loadScannedIntoGameEnd !== -1) {
    const newFileMethods = `async handleFileUpload(event) {
            const file = event.target.files && event.target.files[0];
            if (!file) return;

            const fileName = file.name || 'Tài liệu từ vựng';
            const lowerName = fileName.toLowerCase();
            const startTime = performance.now();

            if (typeof window.showToast === 'function') {
                window.showToast(\`🔍 Đang quét và phân tích "\${fileName}"...\`);
            }

            try {
                let extractedText = '';

                // 1. Nếu là file .JSON
                if (lowerName.endsWith('.json')) {
                    const text = await file.text();
                    try {
                        const parsed = JSON.parse(text);
                        let extractedWords = [];
                        if (Array.isArray(parsed)) {
                            extractedWords = parsed.map(item => {
                                if (typeof item === 'string') {
                                    const w = item.trim();
                                    return { 
                                        word: w, 
                                        meaning: cefrEngine.lookupMeaning(w) || 'từ vựng học tập', 
                                        phonetic: \`/\${w}/\`, 
                                        level: cefrEngine.classify(w) 
                                    };
                                }
                                const w = (item.word || item.term || item.vocab || '').trim();
                                return {
                                    word: w,
                                    meaning: item.meaning || item.vi || item.def || cefrEngine.lookupMeaning(w) || 'từ vựng học tập',
                                    phonetic: item.phonetic || item.ipa || \`/\${w}/\`,
                                    level: item.level || cefrEngine.classify(w)
                                };
                            }).filter(x => x.word);
                        } else if (typeof parsed === 'object') {
                            extractedWords = Object.entries(parsed).map(([w, m]) => ({
                                word: w.trim(),
                                meaning: typeof m === 'string' ? m.trim() : (m.meaning || m.vi || cefrEngine.lookupMeaning(w.trim()) || 'từ vựng học tập'),
                                phonetic: (typeof m === 'object' && m.phonetic) || \`/\${w.trim()}/\`,
                                level: (typeof m === 'object' && m.level) || cefrEngine.classify(w.trim())
                            })).filter(x => x.word);
                        }
                        this.finalizeScannedWords(extractedWords, fileName, startTime, 0);
                        return;
                    } catch(e) {
                        extractedText = text;
                    }
                }

                // 2. Nếu là file .PDF (Dùng PDF.js trích xuất nguyên bản dòng chữ thực, loại bỏ sạch binary stream)
                else if (lowerName.endsWith('.pdf')) {
                    const buffer = await file.arrayBuffer();
                    if (window.pdfjsLib) {
                        if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
                            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                        }
                        const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
                        const pdfDoc = await loadingTask.promise;
                        let fullText = '';
                        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
                            const page = await pdfDoc.getPage(pageNum);
                            const textContent = await page.getTextContent();
                            let lastY = null;
                            let pageStr = '';
                            for (const item of textContent.items) {
                                if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
                                    pageStr += '\\n';
                                } else if (pageStr.length > 0 && !pageStr.endsWith('\\n') && !pageStr.endsWith(' ')) {
                                    pageStr += ' ';
                                }
                                pageStr += item.str;
                                lastY = item.transform[5];
                            }
                            fullText += pageStr + '\\n';
                        }
                        extractedText = fullText;
                    } else {
                        extractedText = await file.text();
                    }
                }

                // 3. Nếu là file .DOCX (Dùng Mammoth trích xuất văn bản sạch)
                else if (lowerName.endsWith('.docx')) {
                    const buffer = await file.arrayBuffer();
                    if (window.mammoth) {
                        const res = await window.mammoth.extractRawText({ arrayBuffer: buffer });
                        extractedText = res.value || '';
                    } else {
                        extractedText = await file.text();
                    }
                }

                // 4. Nếu là file .XLSX hoặc .XLS (Dùng SheetJS)
                else if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
                    const buffer = await file.arrayBuffer();
                    if (window.XLSX) {
                        const wb = window.XLSX.read(buffer, { type: 'array' });
                        let fullText = '';
                        wb.SheetNames.forEach(sheetName => {
                            fullText += window.XLSX.utils.sheet_to_txt(wb.Sheets[sheetName]) + '\\n';
                        });
                        extractedText = fullText;
                    } else {
                        extractedText = await file.text();
                    }
                }

                // 5. Mặc định (.TXT, .CSV, .TSV...)
                else {
                    extractedText = await file.text();
                }

                this.processUploadedFileText(extractedText, fileName, startTime);
            } catch(err) {
                console.error('Lỗi khi đọc file:', err);
                try {
                    const fallbackText = await file.text();
                    this.processUploadedFileText(fallbackText, fileName, startTime);
                } catch(e) {
                    if (typeof window.showToast === 'function') {
                        window.showToast('❌ Không thể trích xuất nội dung file này.');
                    }
                }
            }
        }

        processUploadedFileText(rawText, fileName = 'Tài liệu', startTime = null) {
            if (!rawText) return;
            if (!startTime) startTime = performance.now();

            const lines = rawText.split(/\\r?\\n/);
            const wordsMap = new Map();
            let rawTokenCount = 0;
            let stopwordsFiltered = 0;

            // Bộ lọc loại bỏ triệt để rác nhị phân, token stream PDF và ký tự rác
            const isGarbageToken = (str) => {
                if (!str || str.length < 2 || str.length > 35) return true;
                if (!/[a-zA-Z]/.test(str)) return true;
                if (/[0-9_#$@%^&*+=~\`<>{}\\[\\]\\\\]/.test(str)) return true;

                // Từ ngắn <= 6 ký tự nhưng không có nguyên âm nào
                if (str.length <= 6 && !/[aeiouyAEIOUY]/.test(str)) {
                    const validAbbr = new Set(['tv', 'cd', 'dvd', 'id', 'mr', 'ms', 'dr', 'ok', 'by', 'my']);
                    if (!validAbbr.has(str.toLowerCase())) return true;
                }

                // Chữ hoa lộn xộn ở giữa (như uLl, ptpM, xGL, woP, RnH, gCY, fVQ, HcD, VVq, hAUS, DRc)
                if (/[a-z][A-Z]/.test(str) && !/^[A-Z]+$/.test(str)) return true;

                // Từ khóa metadata PDF
                const pdfJunk = new Set(['obj', 'endobj', 'stream', 'endstream', 'xref', 'trailer', 'startxref', 'title', 'producer', 'skia', 'renderer', 'docs', 'google', 'flatedecode', 'length', 'filter']);
                if (pdfJunk.has(str.toLowerCase())) return true;

                // Tiêu đề bảng
                const headerJunk = new Set(['stt', 'từ vựng', 'tu vung', 'danh sách', 'danh sach', 'page', 'trang', 'nghĩa', 'nghia', 'phiên âm', 'phien am']);
                if (headerJunk.has(str.toLowerCase())) return true;

                return false;
            };

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;
                if (/^(stt|từ vựng|danh sách 3000|page \\d+|trang \\d+)/i.test(trimmed)) continue;

                // TH1: Dòng từ điển chuẩn hóa (Word + POS + Phonetic + Meaning)
                const parsed = this.parseVocabLine(trimmed);
                if (parsed && parsed.word && !isGarbageToken(parsed.word)) {
                    const cleanW = parsed.word.toLowerCase();
                    rawTokenCount++;
                    if (typeof STOPWORDS_SET !== 'undefined' && STOPWORDS_SET.has(cleanW) && cleanW.length <= 3 && !parsed.meaning) {
                        stopwordsFiltered++;
                        continue;
                    }
                    if (!wordsMap.has(cleanW)) {
                        wordsMap.set(cleanW, {
                            word: parsed.word,
                            meaning: parsed.meaning || cefrEngine.lookupMeaning(parsed.word) || 'từ vựng học tập',
                            phonetic: parsed.phonetic || cefrEngine.lookupIPA(parsed.word) || \`/\${parsed.word}/\`,
                            level: cefrEngine.classify(parsed.word)
                        });
                    } else if (parsed.meaning && wordsMap.get(cleanW).meaning === 'từ vựng học tập') {
                        wordsMap.get(cleanW).meaning = parsed.meaning;
                        if (parsed.phonetic) wordsMap.get(cleanW).phonetic = parsed.phonetic;
                    }
                    continue;
                }

                // TH2: Trích xuất các từ tiếng Anh từ đoạn văn tự do trong tài liệu
                const tokens = trimmed.match(/\\b[a-zA-Z]{2,30}(?:[-'][a-zA-Z]+)?\\b/g);
                if (tokens) {
                    for (const token of tokens) {
                        if (isGarbageToken(token)) continue;
                        rawTokenCount++;
                        const cleanW = token.toLowerCase();
                        if (typeof STOPWORDS_SET !== 'undefined' && STOPWORDS_SET.has(cleanW)) {
                            stopwordsFiltered++;
                            continue;
                        }
                        if (cleanW.length < 3 || cleanW.length > 22) continue;

                        if (!wordsMap.has(cleanW)) {
                            wordsMap.set(cleanW, {
                                word: token,
                                meaning: cefrEngine.lookupMeaning(token) || 'từ vựng học tập',
                                phonetic: cefrEngine.lookupIPA(token) || \`/\${token}/\`,
                                level: cefrEngine.classify(token)
                            });
                        }
                    }
                }
            }

            const extractedWords = Array.from(wordsMap.values());
            this.finalizeScannedWords(extractedWords, fileName, startTime, stopwordsFiltered);
        }

        finalizeScannedWords(extractedWords, fileName, startTime, stopwordsCount = 0) {
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

            if (typeof window.showToast === 'function') {
                window.showToast(\`🎉 Đã quét thành công \${stats.total} từ vựng từ "\${fileName}"!\`);
            }
            this.renderInto();
        }

        getSelectedFilteredCount() {
            if (!this.scannedStats) return 0;
            if (this.fileFilterLevel === 'ALL') return this.scannedStats.total;
            return this.scannedStats[this.fileFilterLevel] || 0;
        }

        loadScannedIntoGame() {
            let candidates = this.uploadedFileWords;
            if (this.fileFilterLevel !== 'ALL') {
                candidates = candidates.filter(w => w.level === this.fileFilterLevel);
            }
            if (candidates.length === 0) {
                if (typeof window.showToast === 'function') window.showToast('Không có từ nào trong level này!');
                return;
            }

            // Lấy đúng số lượng từ theo thanh kéo slider hoặc input (this.scannedSelectedCount)
            const countToLearn = Math.min(Math.max(parseInt(this.scannedSelectedCount, 10) || 10, 1), candidates.length);
            const shuffled = [...candidates].sort(() => 0.5 - Math.random());
            this.wordList = shuffled.slice(0, countToLearn);
            this.selectedTopic = \`File: \${this.scannedFileName || 'Quét'} (\${this.fileFilterLevel === 'ALL' ? 'Toàn bộ' : 'Level ' + this.fileFilterLevel})\`;
            this.selectedLevel = this.fileFilterLevel === 'ALL' ? 'B1' : this.fileFilterLevel;
            this.selectedCount = countToLearn;
            this.activeView = 'preview';
            this.renderInto();
        }
`;

    code = code.slice(0, handleFileUploadStart) + newFileMethods + parseVocabLineMethod + code.slice(loadScannedIntoGameEnd);
    console.log('✅ Đã cập nhật handleFileUpload, processUploadedFileText, parseVocabLine và loadScannedIntoGame');
} else {
    console.error('❌ Không tìm thấy vị trí handleFileUploadStart hoặc loadScannedIntoGameEnd');
}

// 4. Cập nhật giao diện buildFileScanHTML: Thêm Slider chọn số lượng từ giống ảnh 2 / ảnh 3
const searchTarget = '<!-- 4. THANH TÌM KIẾM TỪ VỰNG TRỰC TIẾP TRONG FILE -->';
const sliderHTML = `<!-- BỘ CHỌN SỐ LƯỢNG TỪ CHO MÀN CHƠI (SLIDER & QUICK CHIPS GIỐNG ẢNH 2 & ẢNH 3) -->
                            <div class="bg-slate-50/90 dark:bg-slate-800/60 p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 space-y-3.5">
                                <div class="flex items-center justify-between">
                                    <label class="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                                        <span class="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 flex items-center justify-center text-xs font-black">3</span>
                                        <span>Số lượng từ vựng cho một màn chơi</span>
                                    </label>
                                    <span class="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80">
                                        🌱 \${Math.min(this.scannedSelectedCount || 10, totalFiltered)} từ vựng
                                    </span>
                                </div>

                                <!-- Range Slider & Direct Input -->
                                <div class="flex items-center gap-4">
                                    <div class="relative flex-1 flex items-center">
                                        <input type="range" min="1" max="\${Math.min(50, totalFiltered)}" value="\${Math.min(this.scannedSelectedCount || 10, totalFiltered)}"
                                            oninput="VocabGameWorkstation.handleScannedCountSlider(this.value)"
                                            class="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600">
                                    </div>
                                    <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shrink-0">
                                        <input type="number" min="1" max="\${totalFiltered}" value="\${Math.min(this.scannedSelectedCount || 10, totalFiltered)}"
                                            onchange="VocabGameWorkstation.handleScannedCountSlider(this.value)"
                                            class="w-12 text-center text-xs font-black text-slate-900 dark:text-white bg-transparent outline-none">
                                        <span class="text-xs font-bold text-slate-400">từ</span>
                                    </div>
                                </div>

                                <!-- Quick Chips: 5, 10, 15, 17, 20, 25, 30, 50 -->
                                <div class="flex flex-wrap items-center gap-2 pt-1">
                                    <span class="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                                        <i class="fa-solid fa-bolt text-amber-500"></i> Chọn nhanh:
                                    </span>
                                    \${[5, 10, 15, 17, 20, 25, 30, 50].filter(cnt => cnt <= totalFiltered).map(cnt => \`
                                        <button type="button" onclick="VocabGameWorkstation.handleScannedCountSlider(\${cnt})"
                                            class="px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer \${(this.scannedSelectedCount || 10) === cnt ? 'bg-blue-600 text-white shadow-xs scale-105' : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'}\">
                                            \${cnt}
                                        </button>
                                    \`).join('')}
                                </div>
                            </div>\n\n                            `;

if (!code.includes('Số lượng từ vựng cho một màn chơi') || code.indexOf('Số lượng từ vựng cho một màn chơi') === code.lastIndexOf('Số lượng từ vựng cho một màn chơi')) {
    code = code.replace(searchTarget, sliderHTML + searchTarget);
    console.log('✅ Đã thêm Section 3 (Slider & Quick Chips) vào buildFileScanHTML');
}

// 5. Cập nhật nút bấm trong Header Card của buildFileScanHTML
code = code.replace(
    '<span>Nạp vào Gundam Arena & Bắn ngay (${this.getSelectedFilteredCount()} từ)</span>',
    '<span>Nạp vào Gundam Arena & Bắn ngay (${Math.min(this.scannedSelectedCount || 10, totalFiltered)} từ)</span>'
);

fs.writeFileSync(filePath, code, 'utf8');
console.log('🎉 Hoàn tất vá code vocab-game-workstation.js!');
