const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// 1. Thêm <base href="/"> vào <head> nếu chưa có
if (!html.includes('<base href="/">')) {
    html = html.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n    <base href="/">');
    console.log('✅ Đã thêm <base href="/"> vào <head> của index.html');
} else {
    console.log('ℹ️ <base href="/"> đã tồn tại');
}

// 2. Cải thiện bootstrapApplication để hỗ trợ cả pathname SPA routes
const oldBootstrapHash = `            try {
                const initialHash = window.location.hash.replace('#', '');
                if (initialHash && typeof switchTab === 'function' && typeof tabConfig !== 'undefined' && tabConfig[initialHash]) {
                    switchTab(initialHash);
                }
            } catch(e) {}`;

const newBootstrapHash = `            try {
                const path = (window.location && window.location.pathname) || '';
                const initialHash = window.location.hash.replace('#', '');
                if (initialHash && typeof switchTab === 'function' && typeof tabConfig !== 'undefined' && tabConfig[initialHash]) {
                    switchTab(initialHash);
                } else if (path.includes('/study') || path.includes('/match') || path === '/vocabulary') {
                    if (window.VocabularyEngine && typeof window.VocabularyEngine.init === 'function') {
                        window.VocabularyEngine.init();
                    }
                }
            } catch(e) {}`;

if (html.includes(oldBootstrapHash)) {
    html = html.replace(oldBootstrapHash, newBootstrapHash);
    console.log('✅ Đã cập nhật bootstrapApplication() hỗ trợ pathname routing');
} else {
    console.log('ℹ️ Không tìm thấy oldBootstrapHash chính xác');
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('🎉 Đã cập nhật index.html thành công!');
