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

    // Upload the PDF to test extraction
    await page.evaluate(() => {
      if (window.switchTab) window.switchTab('vocab-game');
      if (window.VocabGameWorkstation) window.VocabGameWorkstation.switchIntakeMode('file');
    });
    await new Promise(r => setTimeout(r, 800));

    const fileInput = await page.$('#vgFileInput');
    if (fileInput) {
      console.log('Uploading The Oxford Picture Dictionary English-Vietnamese.PDF...');
      await fileInput.uploadFile('c:\\Users\\Admin\\Downloads\\từ điển\\AMA Quang Ngai - The Oxford Picture Dictionary English-Vietnamese.PDF');

      // Check extraction progress
      for (let i = 0; i < 30; i++) {
        await new Promise(r => setTimeout(r, 2000));
        const res = await page.evaluate(() => {
          return {
            stats: window.VocabGameWorkstation ? window.VocabGameWorkstation.scannedStats : null,
            wordsCount: window.VocabGameWorkstation ? window.VocabGameWorkstation.uploadedFileWords.length : 0,
            fileName: window.VocabGameWorkstation ? window.VocabGameWorkstation.scannedFileName : ''
          };
        });
        console.log(`[${(i+1)*2}s]`, res);
        if (res.wordsCount > 0) {
          console.log('Sample extracted words:', await page.evaluate(() => window.VocabGameWorkstation.uploadedFileWords.slice(0, 15)));
          break;
        }
      }
    }
  } catch(e) {
    console.error('Error:', e);
  } finally {
    await browser.close();
  }
})();
