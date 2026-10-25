const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600 });

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { background: #f0f4f8; font-family: sans-serif; padding: 20px; }
      .box { display: inline-block; padding: 20px; margin: 10px; border-radius: 12px; }
      .white { background: #ffffff; border: 1px solid #ccc; }
      .cream { background: #f9f1dc; border: 2px solid #fbbf24; }
      .dark { background: #0f172a; }
      img { max-height: 150px; display: block; margin: auto; }
    </style>
  </head>
  <body>
    <h2>Totoro Crop on Different Backgrounds</h2>
    <div class="box white">
      <h4>White Background</h4>
      <img src="file:///C:/Users/Admin/.gemini/antigravity/brain/a08eff3b-945d-45ab-b5c1-5f5efd108058/debug_totoro_crop.png">
    </div>
    <div class="box cream">
      <h4>Cream Background (App Logo)</h4>
      <img src="file:///C:/Users/Admin/.gemini/antigravity/brain/a08eff3b-945d-45ab-b5c1-5f5efd108058/debug_totoro_crop.png">
    </div>
    <div class="box dark">
      <h4 style="color:white">Dark Background</h4>
      <img src="file:///C:/Users/Admin/.gemini/antigravity/brain/a08eff3b-945d-45ab-b5c1-5f5efd108058/debug_totoro_crop.png">
    </div>
  </body>
  </html>
  `;

  await page.setContent(htmlContent);
  const outPath = 'C:\\\\Users\\\\Admin\\\\.gemini\\\\antigravity\\\\brain\\\\a08eff3b-945d-45ab-b5c1-5f5efd108058\\\\proof_totoro_preview.png';
  await page.screenshot({ path: outPath });
  console.log('Saved proof preview to', outPath);

  await browser.close();
}

test().catch(console.error);
