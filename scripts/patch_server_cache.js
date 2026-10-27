const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const target = "    const isNoCache = isHtml || ext === '.js' || ext === '.json' || ext === '.css';\n    const cacheControlHeader = isNoCache ? 'no-cache, no-store, must-revalidate' : 'public, max-age=86400, stale-while-revalidate=604800';";

const targetCRLF = "    const isNoCache = isHtml || ext === '.js' || ext === '.json' || ext === '.css';\r\n    const cacheControlHeader = isNoCache ? 'no-cache, no-store, must-revalidate' : 'public, max-age=86400, stale-while-revalidate=604800';";

const replacement = "    const isIconOrManifest = filePath.includes('icon') || ext === '.ico' || filePath.includes('manifest.json');\n    const isNoCache = isHtml || ext === '.js' || ext === '.json' || ext === '.css' || isIconOrManifest;\n    const cacheControlHeader = isNoCache ? 'no-cache, no-store, must-revalidate' : 'public, max-age=86400, stale-while-revalidate=604800';";

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('server.js', code, 'utf8');
  console.log('Patched server.js (LF)');
} else if (code.includes(targetCRLF)) {
  code = code.replace(targetCRLF, replacement.replace(/\n/g, '\r\n'));
  fs.writeFileSync('server.js', code, 'utf8');
  console.log('Patched server.js (CRLF)');
} else {
  console.error('Target not found in server.js');
}
