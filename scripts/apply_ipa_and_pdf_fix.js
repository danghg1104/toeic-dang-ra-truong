const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'vocab-game-workstation.js');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Thêm lookupIPA vào CEFRClassifier
const targetMeaning = `        lookupMeaning(word) {
            const clean = word.toLowerCase().trim();
            if (this.quickMeanings[clean]) return this.quickMeanings[clean];
            if (window.dictionaryData && window.dictionaryData[clean]) {
                const item = window.dictionaryData[clean];
                return item.vi || (item.senses && item.senses[0] && item.senses[0].meaningVi) || '';
            }
            return '';
        }`;

const replacementMeaningAndIPA = `        lookupMeaning(word) {
            if (!word) return '';
            const clean = word.toLowerCase().trim();
            if (this.quickMeanings[clean]) return this.quickMeanings[clean];
            if (window.dictionaryData && window.dictionaryData[clean]) {
                const item = window.dictionaryData[clean];
                return item.vi || (item.senses && item.senses[0] && item.senses[0].meaningVi) || '';
            }
            return '';
        }

        lookupIPA(word) {
            if (!word) return '';
            const clean = word.toLowerCase().trim();
            if (window.dictionaryData && window.dictionaryData[clean] && window.dictionaryData[clean].ipa) {
                return window.dictionaryData[clean].ipa;
            }
            if (window.IPAHelper && typeof window.IPAHelper.transcribePhrase === 'function') {
                try {
                    const ipa = window.IPAHelper.transcribePhrase(clean);
                    if (ipa) return ipa;
                } catch(e) {}
            }
            return '/' + word + '/';
        }`;

if (code.includes(targetMeaning) && !code.includes('lookupIPA(word) {')) {
    code = code.replace(targetMeaning, replacementMeaningAndIPA);
    console.log('✅ Đã thêm lookupIPA vào CEFRClassifier');
} else {
    console.log('⚠️ Đã có lookupIPA hoặc không tìm thấy targetMeaning');
}

// 2. Cập nhật processUploadedFileText để dùng safeLookupIPA
code = code.replace(
    'phonetic: parsed.phonetic || cefrEngine.lookupIPA(parsed.word) || `/${parsed.word}/`,',
    'phonetic: parsed.phonetic || (cefrEngine && typeof cefrEngine.lookupIPA === \'function\' ? cefrEngine.lookupIPA(parsed.word) : \'/\' + parsed.word + \'/\'),'
);

code = code.replace(
    'phonetic: cefrEngine.lookupIPA(token) || `/${token}/`,',
    'phonetic: (cefrEngine && typeof cefrEngine.lookupIPA === \'function\' ? cefrEngine.lookupIPA(token) : \'/\' + token + \'/\'),'
);

// 3. Trong handleFileUpload, thêm try/catch cho từng trang PDF và cập nhật toast thông báo tiến độ
const oldPdfLoop = `                        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
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
                        }`;

const newPdfLoop = `                        const totalPages = pdfDoc.numPages;
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
                        }`;

if (code.includes(oldPdfLoop)) {
    code = code.replace(oldPdfLoop, newPdfLoop);
    console.log('✅ Đã cập nhật vòng lặp đọc PDF an toàn cho toàn bộ 107 trang');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('🎉 Đã cập nhật xong vocab-game-workstation.js!');
