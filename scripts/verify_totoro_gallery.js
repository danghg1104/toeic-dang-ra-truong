const puppeteer = require('puppeteer-core');
const path = require('path');

async function test() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 800 });

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body {
        background: #f1f5f9;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        padding: 30px;
        color: #1e293b;
      }
      h2 { margin-bottom: 20px; font-weight: 800; }
      .grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 20px;
      }
      .card {
        background: white;
        border-radius: 16px;
        padding: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.06);
        text-align: center;
      }
      .card h4 { margin: 8px 0; font-size: 14px; }
      .img-wrap {
        height: 160px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(circle, #f8fafc 0%, #e2e8f0 100%);
        border-radius: 12px;
        overflow: hidden;
        padding: 10px;
      }
      .img-wrap.dark {
        background: #0f172a;
      }
      .img-wrap.cream {
        background: #f9f1dc;
      }
      img {
        max-height: 100%;
        max-width: 100%;
        object-fit: contain;
      }
    </style>
  </head>
  <body>
    <h2>Bộ Nhận Diện Totoro Sau Khi Tách Nền & Tối Ưu Hóa</h2>
    <div class="grid">
      <div class="card">
        <div class="img-wrap cream">
          <img src="file:///C:/Users/Admin/.gemini/antigravity/brain/a08eff3b-945d-45ab-b5c1-5f5efd108058/totoro_sidebar_logo_badge.png">
        </div>
        <h4>Hình 4: Logo Sidebar Badge</h4>
        <p style="font-size:12px;color:#64748b;">Nền kem #f9f1dc viền vàng</p>
      </div>

      <div class="card">
        <div class="img-wrap cream">
          <img src="file:///C:/Users/Admin/.gemini/antigravity/brain/a08eff3b-945d-45ab-b5c1-5f5efd108058/totoro_mascot_ai_tutor.png">
        </div>
        <h4>Hình 5: Mascot AI Tutor</h4>
        <p style="font-size:12px;color:#64748b;">Totoro toàn thân trong suốt</p>
      </div>

      <div class="card">
        <div class="img-wrap">
          <img src="file:///C:/Users/Admin/.gemini/antigravity/brain/a08eff3b-945d-45ab-b5c1-5f5efd108058/totoro_trio_stacked.png">
        </div>
        <h4>Hình 1: Totoro 3 Tầng</h4>
        <p style="font-size:12px;color:#64748b;">Gắn vào Lộ Trình S-Curve</p>
      </div>

      <div class="card">
        <div class="img-wrap">
          <img src="file:///C:/Users/Admin/.gemini/antigravity/brain/a08eff3b-945d-45ab-b5c1-5f5efd108058/totoro_ocarina_moon.png">
        </div>
        <h4>Hình 2: Totoro Thổi Sáo Ocarina</h4>
        <p style="font-size:12px;color:#64748b;">Gắn vào Trạm Luyện Nghe</p>
      </div>
    </div>
  </body>
  </html>
  `;

  await page.setContent(htmlContent);
  const outPath = 'C:\\\\Users\\\\Admin\\\\.gemini\\\\antigravity\\\\brain\\\\a08eff3b-945d-45ab-b5c1-5f5efd108058\\\\proof_totoro_assets_gallery.png';
  await page.screenshot({ path: outPath });
  console.log('Saved gallery proof to', outPath);

  await browser.close();
}

test().catch(console.error);
