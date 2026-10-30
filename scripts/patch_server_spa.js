const fs = require('fs');
const path = require('path');

const serverFile = path.join(__dirname, '..', 'server.js');
let code = fs.readFileSync(serverFile, 'utf8');

const oldStaticBlock = `  // =========================================================================
  // PHỤC VỤ CÁC FILE TĨNH (STATIC FILES)
  // =========================================================================
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  let filePath = path.join(PUBLIC_DIR, reqPath);
  const publicPath = path.join(PUBLIC_DIR, 'public', reqPath);
  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    filePath = publicPath;
  }

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      filePath = path.join(PUBLIC_DIR, 'index.html');
      stats = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
      if (!stats) {
        res.writeHead(404);
        res.end('404 Not Found');
        return;
      }
    }`;

const newStaticBlock = `  // =========================================================================
  // PHỤC VỤ CÁC FILE TĨNH (STATIC FILES) & SPA DEEP ROUTING
  // =========================================================================
  if (reqPath === '/' || reqPath === '') reqPath = '/index.html';

  let filePath = path.join(PUBLIC_DIR, reqPath);
  const publicPath = path.join(PUBLIC_DIR, 'public', reqPath);
  if (fs.existsSync(publicPath) && fs.statSync(publicPath).isFile()) {
    filePath = publicPath;
  }

  // Khắc phục trường hợp nested route yêu cầu tài nguyên tĩnh nhưng bị lồng tiền tố route (VD: /vocabulary/contracts/js/...)
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    const staticFolderMatch = reqPath.match(/\\/(js|css|assets|data|public|vendor|audio)\\/(.+)$/i);
    if (staticFolderMatch) {
      const candidatePath = path.join(PUBLIC_DIR, staticFolderMatch[1], staticFolderMatch[2]);
      if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
        filePath = candidatePath;
      }
    } else {
      const baseName = path.basename(reqPath);
      if (['favicon.ico', 'manifest.json', 'icon-192.png', 'icon-512.png', 'app.ico', 'sw.js'].includes(baseName)) {
        const candidatePath = path.join(PUBLIC_DIR, baseName);
        if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
          filePath = candidatePath;
        }
      }
    }
  }

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('403 Forbidden');
    return;
  }

  const reqExt = path.extname(reqPath).toLowerCase();
  const isStaticAssetReq = reqExt && reqExt !== '.html';

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Nếu là yêu cầu file tĩnh mà không tồn tại, trả về 404 (KHÔNG trả về index.html gây lỗi MIME / SyntaxError)
      if (isStaticAssetReq) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=UTF-8' });
        res.end('404 Not Found');
        return;
      }

      // Ngược lại, đây là SPA route (như /vocabulary/contracts/study, /lo-trinh, etc.), trả về index.html
      filePath = path.join(PUBLIC_DIR, 'index.html');
      stats = fs.existsSync(filePath) ? fs.statSync(filePath) : null;
      if (!stats) {
        res.writeHead(404);
        res.end('404 Not Found');
        return;
      }
    }`;

// Normalize line endings for replacement
const normCode = code.replace(/\r\n/g, '\n');
const normOld = oldStaticBlock.replace(/\r\n/g, '\n');

if (normCode.includes(normOld)) {
    const updated = normCode.replace(normOld, newStaticBlock);
    fs.writeFileSync(serverFile, updated, 'utf8');
    console.log('✅ Đã cập nhật server.js với SPA Deep Routing & Static Asset Normalization!');
} else {
    console.error('❌ Không tìm thấy oldStaticBlock trong server.js');
    process.exit(1);
}
