const fs = require('fs');
const path = require('path');

const targetFile = path.join(__dirname, '../js/vocab-game-workstation.js');
let code = fs.readFileSync(targetFile, 'utf8');

// 1. ADD isGarbageTokenStatic AND enrichUploadedWordsIfNeeded BEFORE handleFileUpload
const searchMarker1 = '        // BỘ ĐỌC ĐA ĐỊNH DẠNG (TXT, CSV, JSON, PDF, DOCX) & TOKENIZER THƯỢNG THỪA';

const newHelpers = `        isGarbageTokenStatic(str) {
            if (!str || typeof str !== 'string') return true;
            const s = str.trim();
            if (s.length < 2 || s.length > 35) return true;
            if (!/[a-zA-Z]/.test(s)) return true;
            if (/[0-9_#$@%^&*+=~><{}\\[\\]\\\\]/.test(s)) return true;

            // Loại bỏ casing dị tật do rác nhị phân / stream PDF (như KUe, CUg, DNroa, VUs, jAn, jQu, nuuw...)
            if (!/^(?:[a-z]{2,30}|[A-Z][a-z]{1,29}|[A-Z]{2,6}|[a-zA-Z]{2,15}-[a-zA-Z]{2,15})$/.test(s)) {
                return true;
            }

            // Từ ngắn <= 6 ký tự nhưng không có nguyên âm nào
            if (s.length <= 6 && !/[aeiouyAEIOUY]/.test(s)) {
                const validAbbr = new Set(['tv', 'cd', 'dvd', 'id', 'mr', 'ms', 'dr', 'ok', 'by', 'my']);
                if (!validAbbr.has(s.toLowerCase())) return true;
            }

            // Metadata PDF, HTML, website watermarks & column headers
            const junkSet = new Set([
                'obj', 'endobj', 'stream', 'endstream', 'xref', 'trailer', 'startxref', 
                'title', 'producer', 'skia', 'renderer', 'docs', 'google', 'flatedecode', 
                'length', 'filter', 'linearized', 'columns', 'predictor', 'encrypt', 'index',
                'info', 'prev', 'root', 'size', 'type', 'catalog', 'pages', 'marked', 'count',
                'kids', 'parent', 'resources', 'xobject', 'contents', 'rotate', 'subtype',
                'image', 'width', 'height', 'word', 'words', 'pronounce', 'meaning', 'meanings',
                'stt', 'unit', 'lesson', 'project', 'review', 'skills', 'activity', 'exercise',
                'workbook', 'textbook', 'glossary', 'oxford', 'effortlessenglishclub',
                'sachhoc', 'sachhoccom', 'thuvienhoclieu', 'thuvienhoclieucom', 'vndoc', 'vietjack',
                'loigiaihay', 'tailieu', 'tailieuvn', 'dethithpt', 'sachmem', 'hocmai', 'doc24',
                'zalo', 'facebook', 'youtube', 'http', 'https', 'www', 'com', 'net', 'org', 'vn',
                'edu', 'gov', 'html', 'pdf', 'docx', 'scan', 'download', 'copyright', 'watermark'
            ]);
            const lowerStr = s.toLowerCase();
            if (junkSet.has(lowerStr)) return true;
            if (lowerStr.includes('sachhoc') || lowerStr.includes('thuvienhoclieu') || lowerStr.includes('vietjack') || lowerStr.includes('vndoc') || lowerStr.includes('loigiaihay')) return true;

            return false;
        },

        async enrichUploadedWordsIfNeeded(words) {
            if (!Array.isArray(words) || words.length === 0) return;

            const missingMeaningWords = [];
            for (const item of words) {
                if (!item || !item.word) continue;
                const w = item.word.trim();
                const lw = w.toLowerCase();

                // 1. Chuẩn hóa phiên âm IPA thật (loại bỏ hoàn toàn dạng /word/)
                if (!item.phonetic || item.phonetic === \`/\${w}/\` || item.phonetic === \`/\${lw}/\`) {
                    if (window.IPAHelper && typeof window.IPAHelper.transcribePhrase === 'function') {
                        item.phonetic = window.IPAHelper.transcribePhrase(w, 'US');
                    } else if (this.cefrEngine && typeof this.cefrEngine.lookupIPA === 'function') {
                        item.phonetic = this.cefrEngine.lookupIPA(w);
                    }
                }

                // 2. Kiểm tra nghĩa tiếng Việt thực tế
                let m = (item.meaning || '').trim();
                if (!m || m.toLowerCase() === 'từ vựng học tập' || m.toLowerCase() === 'từ vựng của bạn') {
                    m = '';
                    if (window.DictionaryEngine && window.DictionaryEngine.lexicon && window.DictionaryEngine.lexicon[lw] && window.DictionaryEngine.lexicon[lw].vietnameseMeaning) {
                        m = window.DictionaryEngine.lexicon[lw].vietnameseMeaning;
                    } else if (this.cefrEngine && typeof this.cefrEngine.lookupMeaning === 'function') {
                        const cm = this.cefrEngine.lookupMeaning(w);
                        if (cm && cm.toLowerCase() !== 'từ vựng học tập') m = cm;
                    } else if (window.dictionaryData && window.dictionaryData[lw] && window.dictionaryData[lw].vi) {
                        m = window.dictionaryData[lw].vi;
                    }

                    if (m) {
                        item.meaning = m;
                    } else {
                        missingMeaningWords.push(item);
                    }
                }
            }

            // 3. Batch dịch các từ còn thiếu nghĩa qua Google GTX API (25 từ/lần)
            if (missingMeaningWords.length > 0) {
                const CHUNK_SIZE = 25;
                for (let i = 0; i < missingMeaningWords.length; i += CHUNK_SIZE) {
                    const chunk = missingMeaningWords.slice(i, i + CHUNK_SIZE);
                    const text = chunk.map(x => x.word).join('\\n');
                    try {
                        const url = \`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=\${encodeURIComponent(text)}\`;
                        const r = await fetch(url);
                        if (r.ok) {
                            const data = await r.json();
                            if (Array.isArray(data && data[0])) {
                                const translated = data[0].map(x => x[0]).join('').split('\\n');
                                chunk.forEach((item, idx) => {
                                    const trans = (translated[idx] || '').trim();
                                    if (trans && trans.toLowerCase() !== item.word.toLowerCase()) {
                                        item.meaning = trans;
                                    } else {
                                        item.meaning = \`Thuộc cấp độ \${item.level || 'tiếng Anh'}\`;
                                    }
                                });
                            }
                        }
                    } catch(e) {
                        console.warn('Enrich uploaded words translation fallback:', e);
                        chunk.forEach(item => {
                            if (!item.meaning || item.meaning === 'từ vựng học tập') {
                                item.meaning = \`Thuộc cấp độ \${item.level || 'tiếng Anh'}\`;
                            }
                        });
                    }
                }
            }
        },

        // BỘ ĐỌC ĐA ĐỊNH DẠNG (TXT, CSV, JSON, PDF, DOCX) & TOKENIZER THƯỢNG THỪA`;

if (!code.includes('isGarbageTokenStatic(')) {
    code = code.replace(searchMarker1, newHelpers);
}

// 2. REWRITE handleFileUpload AND processUploadedFileText
// We will replace the whole block from "async handleFileUpload(event) {" to before "finalizeScannedWords("
const handleUploadRegex = /async handleFileUpload\(event\)\s*\{[\s\S]*?processUploadedFileText\(rawText, fileName = 'Tài liệu', startTime = null\)\s*\{[\s\S]*?const extractedWords = Array\.from\(wordsMap\.values\(\)\);[\s\S]*?this\.finalizeScannedWords\(extractedWords, fileName, startTime, stopwordsFiltered\);\s*\}/;

const newHandleAndProcess = `async handleFileUpload(event) {
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
                let extractedText = '';

                // 1. File .JSON
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
                                        meaning: '', 
                                        phonetic: '', 
                                        level: cefrEngine.classify(w) 
                                    };
                                }
                                const w = (item.word || item.term || item.vocab || '').trim();
                                return {
                                    word: w,
                                    meaning: item.meaning || item.vi || item.def || '',
                                    phonetic: item.phonetic || item.ipa || '',
                                    level: item.level || cefrEngine.classify(w)
                                };
                            }).filter(x => x.word);
                        } else if (typeof parsed === 'object') {
                            extractedWords = Object.entries(parsed).map(([w, m]) => ({
                                word: w.trim(),
                                meaning: typeof m === 'string' ? m.trim() : (m.meaning || m.vi || ''),
                                phonetic: (typeof m === 'object' && m.phonetic) || '',
                                level: (typeof m === 'object' && m.level) || cefrEngine.classify(w.trim())
                            })).filter(x => x.word);
                        }
                        await this.enrichUploadedWordsIfNeeded(extractedWords);
                        this.finalizeScannedWords(extractedWords, fileName, startTime, 0);
                        return;
                    } catch(e) {
                        extractedText = text;
                    }
                }

                // 2. File .PDF (Trích xuất văn bản thực qua PDF.js, tuyệt đối không fallback sang file.text() nhị phân)
                else if (lowerName.endsWith('.pdf')) {
                    const buffer = await file.arrayBuffer();
                    if (window.pdfjsLib) {
                        if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
                            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                        }
                        const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(buffer) });
                        const pdfDoc = await loadingTask.promise;
                        let fullText = '';
                        const totalPages = pdfDoc.numPages;
                        for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                            try {
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
                            } catch(errPage) {
                                console.warn('Bỏ qua trang lỗi:', pageNum, errPage);
                            }
                        }
                        extractedText = fullText;

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
                        throw new Error('Thư viện PDF.js chưa sẵn sàng.');
                    }
                }

                // 3. File .DOCX / .DOC
                else if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) {
                    const buffer = await file.arrayBuffer();
                    if (window.mammoth) {
                        const res = await window.mammoth.extractRawText({ arrayBuffer: buffer });
                        extractedText = res.value || '';
                    } else {
                        extractedText = await file.text();
                    }
                }

                // 4. File .XLSX / .XLS
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

                // Kiểm tra nếu là file SGK bất kỳ
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
                }

                await this.processUploadedFileText(extractedText, fileName, startTime);
            } catch(err) {
                console.error('Lỗi khi đọc file:', err);
                if (typeof window.showToast === 'function') {
                    window.showToast('❌ Không thể trích xuất nội dung file này: ' + err.message);
                }
            }
        }

        async processUploadedFileText(rawText, fileName = 'Tài liệu', startTime = null) {
            if (!rawText) return;
            if (!startTime) startTime = performance.now();

            const lines = rawText.split(/\\r?\\n/);
            const wordsMap = new Map();
            let rawTokenCount = 0;
            let stopwordsFiltered = 0;

            const isGarbage = (str) => this.isGarbageTokenStatic(str);

            for (let line of lines) {
                let trimmed = line.trim();
                if (!trimmed) continue;
                if (/^(no\\b|word\\b|type\\b|pronounce\\b|meaning\\b|stt|từ vựng|danh sách|page \\d+|trang \\d+|unit \\d+|lesson \\d+|review \\d+|oxford|http)/i.test(trimmed)) continue;

                // Loại bỏ tên người đối thoại trong sách giáo khoa
                trimmed = trimmed.replace(/^(?:[A-Z][a-zA-Z\\s]{1,15}|Teacher|Student|Tom|Peter|Mary|Linda|Tony|Mai|Nam|Phong|Lan|Hoa)\\s*:\\s*/i, '');

                // TH1: Dòng từ điển chuẩn hóa (Word + POS + Phonetic + Meaning)
                const parsed = this.parseVocabLine(trimmed);
                if (parsed && parsed.word && !isGarbage(parsed.word)) {
                    const cleanW = parsed.word.toLowerCase();
                    rawTokenCount++;
                    if (typeof STOPWORDS_SET !== 'undefined' && STOPWORDS_SET.has(cleanW) && cleanW.length <= 3 && !parsed.meaning) {
                        stopwordsFiltered++;
                        continue;
                    }
                    if (!wordsMap.has(cleanW)) {
                        wordsMap.set(cleanW, {
                            word: parsed.word,
                            meaning: parsed.meaning || '',
                            phonetic: parsed.phonetic || '',
                            level: cefrEngine.classify(parsed.word)
                        });
                    } else if (parsed.meaning && (!wordsMap.get(cleanW).meaning || wordsMap.get(cleanW).meaning === 'từ vựng học tập')) {
                        wordsMap.get(cleanW).meaning = parsed.meaning;
                        if (parsed.phonetic) wordsMap.get(cleanW).phonetic = parsed.phonetic;
                    }
                    continue;
                }

                // TH2: Trích xuất các từ tiếng Anh từ đoạn văn tự do, sách giáo khoa (Lớp 1 - 12)
                const tokens = trimmed.match(/\\b[a-zA-Z]{2,30}(?:[-'][a-zA-Z]+)?\\b/g);
                if (tokens) {
                    for (const rawToken of tokens) {
                        const token = rawToken.replace(/^['"]+|['"]+$/g, '').trim();
                        if (isGarbage(token)) continue;
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
                                meaning: '',
                                phonetic: '',
                                level: cefrEngine.classify(token)
                            });
                        }
                    }
                }
            }

            const extractedWords = Array.from(wordsMap.values());
            // Làm giàu toàn diện nghĩa tiếng Việt & IPA thật, tuyệt đối không để "từ vựng học tập"
            await this.enrichUploadedWordsIfNeeded(extractedWords);
            this.finalizeScannedWords(extractedWords, fileName, startTime, stopwordsFiltered);
        }`;

code = code.replace(handleUploadRegex, newHandleAndProcess);

// 3. REWRITE parseVocabLine
const parseLineRegex = /parseVocabLine\(line\)\s*\{[\s\S]*?return null;\s*\}/;
const newParseVocabLine = `parseVocabLine(line) {
            let clean = (line || '').trim();
            if (!clean) return null;

            // Bỏ qua tiêu đề bảng hoặc chú thích
            if (/^(no\\b|word\\b|type\\b|pronounce\\b|meaning\\b|stt\\b|từ vựng|tu vung|danh sách|danh sach|bảng|page \\d+|trang \\d+|oxford|http)/i.test(clean)) return null;

            // 1. Loại bỏ số thứ tự ở đầu dòng nếu có (VD: '1 ', '1. ', '1) ')
            clean = clean.replace(/^\\d+[\\.\\)]?\\s+/, '');

            // 2. Tìm phiên âm /.../
            const slash1 = clean.indexOf('/');
            const slash2 = clean.lastIndexOf('/');
            if (slash1 !== -1 && slash2 > slash1) {
                let left = clean.slice(0, slash1).trim();
                let ipa = clean.slice(slash1, slash2 + 1).trim();
                let right = clean.slice(slash2 + 1).trim();

                const posRegex = /\\s+(?:(?:adj|adv|prep|conj|pron|det|modal(?:s+v)?|auxiliary(?:s+v)?|n|v)\\.?\\s*(?:,\\s*)?|exclamation|prefix|suffix)+$/i;
                left = left.replace(/\\(also[^)]*\\)/i, '').replace(posRegex, '').trim();
                if (left.includes(',')) left = left.split(',')[0].trim();
                if (left.includes('(')) left = left.split('(')[0].trim();

                let meaning = right.replace(/^[,;\\s\\-\\:]+/, '').trim();
                if (left && /^[a-zA-Z\\s'-]{1,40}$/.test(left)) {
                    return { word: left, phonetic: ipa, meaning };
                }
            }

            // 3. Tabular format không có dấu gạch chéo / (như Oxford 3000: 'abandon v ə'bændən bỏ, từ bỏ')
            const POS_WORDS = new Set(['n', 'v', 'adj', 'adv', 'prep', 'pron', 'det', 'conj', 'modal', 'auxiliary', 'exclamation', 'prefix', 'suffix']);
            const tokens = clean.split(/\\s+/);
            if (tokens.length >= 3) {
                const word = tokens[0];
                let idx = 1;
                while (idx < tokens.length && POS_WORDS.has(tokens[idx].replace(/[,\.]/g, '').toLowerCase())) {
                    idx++;
                }
                if (idx > 1 && idx < tokens.length) {
                    const candidatePhonetic = tokens[idx];
                    let phonetic = '';
                    let meaningStart = idx;
                    const hasViAccent = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(candidatePhonetic);
                    if (!hasViAccent && (/[\\/'əæʌɔɑɪʊ:,]/.test(candidatePhonetic) || (idx + 1 < tokens.length && !POS_WORDS.has(candidatePhonetic.toLowerCase())))) {
                        phonetic = candidatePhonetic.startsWith('/') ? candidatePhonetic : '/' + candidatePhonetic + '/';
                        meaningStart = idx + 1;
                    }
                    const meaning = tokens.slice(meaningStart).join(' ').trim();
                    if (word && meaning && /^[a-zA-Z\\s'-]{1,35}$/.test(word)) {
                        return { word, phonetic, meaning };
                    }
                }
            }

            // 4. Phân tách theo dấu gạch ngang '-' hoặc hai chấm ':' hoặc tab '\\t'
            const sepMatch = clean.match(/^([a-zA-Z\\s'-]{1,35})\\s*[-:\\t]\\s*(.+)$/);
            if (sepMatch) {
                return {
                    word: sepMatch[1].trim(),
                    phonetic: '',
                    meaning: sepMatch[2].trim()
                };
            }

            // 5. Nếu là dòng tiếng Anh có tiếng Việt theo sau (không có dấu ngăn)
            const wordThenVi = clean.match(/^([a-zA-Z\\s'-]{1,35})\\s+([à-ỹÀ-Ỹ].+)$/);
            if (wordThenVi) {
                return {
                    word: wordThenVi[1].trim(),
                    phonetic: '',
                    meaning: wordThenVi[2].trim()
                };
            }

            return null;
        }`;

code = code.replace(parseLineRegex, newParseVocabLine);

// 4. REPLACE REMAINING 'Từ vựng học tập' OR 'từ vựng học tập' FALLBACKS
code = code.replace(/\$\{item\.meaning \|\| 'Từ vựng học tập'\}/g, "\${item.meaning || (item.level ? 'Từ vựng cấp độ ' + item.level : 'Từ vựng tiếng Anh')}");
code = code.replace(/\$\{item\.meaning \|\| 'từ vựng học tập'\}/g, "\${item.meaning || (item.level ? 'Từ vựng cấp độ ' + item.level : 'Từ vựng tiếng Anh')}");
code = code.replace(/meaning: item\.meaning \|\| 'từ vựng học tập'/g, "meaning: item.meaning || (item.level ? 'Từ vựng cấp độ ' + item.level : 'Từ vựng tiếng Anh')");
code = code.replace(/meaning: w\.meaning \|\| 'từ vựng học tập'/g, "meaning: w.meaning || (w.level ? 'Từ vựng cấp độ ' + w.level : 'Từ vựng tiếng Anh')");

// 5. UPDATE restoreLastActiveScannedFile TO CLEAN UP OLD CORRUPTED SAVED SCANS
const restoreMarker = '            if (target && target.words && target.words.length > 0) {';
const newRestoreBlock = `            if (target && target.words && target.words.length > 0) {
                // Tự động phát hiện và làm sạch file bị dính rác nhị phân cũ (nuuw, ovh, cug, vus...)
                const hasCorrupted = target.words.some(w => (w.word || '').toLowerCase() === 'nuuw' || (w.word || '').toLowerCase() === 'ovh' || (w.word || '').toLowerCase() === 'cug');
                if (hasCorrupted) {
                    target.words = target.words.filter(w => !this.isGarbageTokenStatic(w.word));
                    target.totalWords = target.words.length;
                    if (target.stats) target.stats.total = target.words.length;
                    this.saveSavedScannedFiles();
                }

                // Tự động dịch và làm giàu nếu từ bị dính nhãn 'từ vựng học tập' cũ
                const hasFakeMeanings = target.words.some(w => (w.meaning || '').toLowerCase() === 'từ vựng học tập');
                if (hasFakeMeanings) {
                    this.enrichUploadedWordsIfNeeded(target.words).then(() => {
                        this.saveSavedScannedFiles();
                        if (this.currentIntakeMode === 'file') this.renderInto();
                    }).catch(() => {});
                }`;

code = code.replace(restoreMarker, newRestoreBlock);

fs.writeFileSync(targetFile, code, 'utf8');
console.log('✅ Successfully patched js/vocab-game-workstation.js!');
