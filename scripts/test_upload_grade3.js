const puppeteer = require('puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  
  // Switch to Vocab Game tab
  await page.evaluate(() => {
    if (window.switchTab) window.switchTab('vocab-game');
    if (window.VocabGameWorkstation) window.VocabGameWorkstation.switchIntakeMode('file');
  });
  await new Promise(r => setTimeout(r, 1000));
  
  const fileInput = await page.$('#vgFileInput');
  if (fileInput) {
    console.log('Found #vgFileInput! Uploading Grade 3 PDF...');
    await fileInput.uploadFile('C:\\Users\\Admin\\Downloads\\sách lớp 3\\thuvienhoclieu.com-SGK-Tieng-anh-3-Global-Success-Tap-1.pdf');
    // Wait for scanning to process (e.g. 15s)
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 1000));
      const stats = await page.evaluate(() => window.VocabGameWorkstation ? window.VocabGameWorkstation.scannedStats : null);
      if (stats && stats.total > 0) {
        console.log(`Scan completed at ${i+1}s:`, stats);
        break;
      }
    }
    const scannedStats = await page.evaluate(() => window.VocabGameWorkstation ? window.VocabGameWorkstation.scannedStats : null);
    const scannedWords = await page.evaluate(() => window.VocabGameWorkstation ? window.VocabGameWorkstation.uploadedFileWords : null);
    console.log('Result scannedStats:', scannedStats);
    console.log('Result scannedWords count:', scannedWords ? scannedWords.length : 0);
    if (scannedWords && scannedWords.length > 0) {
      console.log('Scanned words sample:', scannedWords.slice(0, 10));
    }
  } else {
    console.log('#vgFileInput not found!');
  }
  await browser.close();
})();
