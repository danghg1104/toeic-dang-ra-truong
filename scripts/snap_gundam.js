const puppeteer = require('puppeteer-core');
const path = require('path');

async function run() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600 });
  const filePath = 'file:///' + path.resolve('scripts/test_gundam_svg.html').replace(/\\/g, '/');
  await page.goto(filePath);
  await new Promise(r => setTimeout(r, 600));

  const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';
  await page.screenshot({
    path: path.join(artifactDir, 'preview_gundam_svg.png')
  });

  console.log('Snapped preview_gundam_svg.png');
  await browser.close();
}

run().catch(console.error);
