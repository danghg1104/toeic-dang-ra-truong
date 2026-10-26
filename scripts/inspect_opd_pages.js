const puppeteer = require('puppeteer-core');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));

    // Read the PDF using fetch or FileReader
    const pdfPath = 'c:\\Users\\Admin\\Downloads\\từ điển\\AMA Quang Ngai - The Oxford Picture Dictionary English-Vietnamese.PDF';
    const buffer = fs.readFileSync(pdfPath);
    console.log('Read file buffer:', (buffer.length / (1024*1024)).toFixed(2), 'MB');

    // Transfer buffer to browser and check pages with pdfjsLib
    const pageInspection = await page.evaluate(async (pdfBytesBase64) => {
      const binStr = atob(pdfBytesBase64);
      const len = binStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binStr.charCodeAt(i);
      }
      
      const pdf = await window.pdfjsLib.getDocument({ data: bytes }).promise;
      const numPages = pdf.numPages;
      const samples = [];
      
      // Sample first 15 pages and some index pages at the back (e.g. 210 to 238)
      const testPages = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 220, 225, 230, 235];
      for (const p of testPages) {
        if (p > numPages) continue;
        const page = await pdf.getPage(p);
        const textContent = await page.getTextContent();
        const text = textContent.items.map(it => it.str).join(' ');
        samples.push({ page: p, textLength: text.length, sample: text.slice(0, 300) });
      }
      return { numPages, samples };
    }, buffer.slice(0, 15 * 1024 * 1024).toString('base64')); // sample first 15MB

    console.log('Inspection result:', JSON.stringify(pageInspection, null, 2));
  } catch(e) {
    console.error('Error during inspection:', e);
  } finally {
    await browser.close();
  }
})();
