const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const USER_PDF_PATH = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058\\.user_uploaded\\media_1792988151579_f44c1b65.pdf';

(async () => {
    console.log('🚀 Đang kiểm tra tốc độ parse 107 trang PDF bằng PDF.js...');
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new',
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto('http://127.0.0.1:3000/', { waitUntil: 'domcontentloaded' });

    // Đọc buffer của file
    const buffer = fs.readFileSync(USER_PDF_PATH);
    const base64Data = buffer.toString('base64');

    console.log('📄 Đã load file vào buffer, gửi vào browser để parse thử...');
    const result = await page.evaluate(async (b64) => {
        const binaryStr = atob(b64);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
        }

        const t0 = performance.now();
        if (!window.pdfjsLib.GlobalWorkerOptions.workerSrc) {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        const loadingTask = window.pdfjsLib.getDocument({ data: bytes });
        const pdfDoc = await loadingTask.promise;
        const numPages = pdfDoc.numPages;
        console.log('Số trang PDF:', numPages);

        let fullText = '';
        // Thử parse 10 trang đầu
        const samplePages = Math.min(numPages, 10);
        for (let pageNum = 1; pageNum <= samplePages; pageNum++) {
            const page = await pdfDoc.getPage(pageNum);
            const textContent = await page.getTextContent();
            let lastY = null;
            let pageStr = '';
            for (const item of textContent.items) {
                if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
                    pageStr += '\n';
                } else if (pageStr.length > 0 && !pageStr.endsWith('\n') && !pageStr.endsWith(' ')) {
                    pageStr += ' ';
                }
                pageStr += item.str;
                lastY = item.transform[5];
            }
            fullText += pageStr + '\n';
        }
        const t1 = performance.now();
        return {
            numPages,
            samplePages,
            durationMs: Math.round(t1 - t0),
            first500Chars: fullText.slice(0, 500)
        };
    }, base64Data);

    console.log('Kết quả parse thử:', result);
    await browser.close();
})();
