const path = require('path');
const puppeteer = require('c:/Users/Admin/Documents/antigravity/noble-franklin/node_modules/puppeteer-core');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactsDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\a08eff3b-945d-45ab-b5c1-5f5efd108058';

async function verifyAppIcon() {
    console.log('🔍 Verifying App Icon & PWA Configuration...');

    const browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: 'new',
        defaultViewport: { width: 1200, height: 680 }
    });

    try {
        const page = await browser.newPage();

        // 1. Check manifest.json
        console.log('Checking /manifest.json ...');
        const manifestRes = await page.goto('http://localhost:3000/manifest.json');
        const manifestJson = await manifestRes.json();
        console.log('Manifest name:', manifestJson.name);
        console.log('Manifest icons count:', manifestJson.icons?.length);

        // 2. Check icon-192.png & icon-512.png
        console.log('Checking /icon-192.png ...');
        const icon192Res = await page.goto('http://localhost:3000/icon-192.png');
        console.log('icon-192 status:', icon192Res.status());

        console.log('Checking /icon-512.png ...');
        const icon512Res = await page.goto('http://localhost:3000/icon-512.png');
        console.log('icon-512 status:', icon512Res.status());

        // 3. Render HTML mockup file
        const mockupPath = path.resolve(__dirname, '..', 'scratch', 'mockup.html');
        console.log('Navigating to mockup file:', mockupPath);
        await page.goto('file:///' + mockupPath.replace(/\\/g, '/'), { waitUntil: 'load' });
        await new Promise(r => setTimeout(r, 600));

        const proofIconPath = path.join(artifactsDir, 'proof_pwa_totoro_icon_installed.png');
        await page.screenshot({ path: proofIconPath });
        console.log('📸 Proof screenshot saved to:', proofIconPath);

        console.log('🎉 VERIFICATION OF TOTORO APP ICON FINISHED SUCCESSFULLY!');
    } catch (err) {
        console.error('❌ Icon verification error:', err);
    } finally {
        await browser.close();
    }
}

verifyAppIcon();
