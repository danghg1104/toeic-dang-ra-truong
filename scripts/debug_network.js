const puppeteer = require('puppeteer-core');
const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  page.on('response', res => {
    if (res.status() >= 400) {
      console.log(`HTTP ${res.status()} -> ${res.url()}`);
    }
  });
  await page.goto('http://localhost:3000/#nghe-chinh-ta', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 2000));
  await page.evaluate(() => {
    if (window.switchDictationSubMode) {
      window.switchDictationSubMode('youtube');
    }
  });
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
