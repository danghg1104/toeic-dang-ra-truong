const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

const target = "const initialHash = window.location.hash.replace('#', '');";
const replacement = `const path = (window.location && window.location.pathname) || '';
                const initialHash = window.location.hash.replace('#', '');
                if (initialHash && typeof switchTab === 'function' && typeof tabConfig !== 'undefined' && tabConfig[initialHash]) {
                    switchTab(initialHash);
                } else if (path.includes('/study') || path.includes('/match') || path === '/vocabulary') {
                    if (window.VocabularyEngine && typeof window.VocabularyEngine.init === 'function') {
                        window.VocabularyEngine.init();
                    }
                    return;
                }`;

if (html.includes(target)) {
    // Find enclosing try block
    const sIdx = html.indexOf(target);
    const eIdx = html.indexOf('} catch(e) {}', sIdx);
    if (sIdx !== -1 && eIdx !== -1) {
        html = html.slice(0, sIdx) + replacement + '\n            ' + html.slice(eIdx);
        fs.writeFileSync(indexPath, html, 'utf8');
        console.log('✅ Đã cập nhật bootstrapApplication() chuẩn xác!');
    }
}
