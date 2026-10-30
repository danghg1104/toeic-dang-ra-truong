const fs = require('fs');
const path = require('path');

const vocabPath = path.join(__dirname, '..', 'js', 'vocabulary-module.js');
let code = fs.readFileSync(vocabPath, 'utf8');

const oldHide = `        hideAllViews() {
            const allTabs = ['hom-nay', 'lo-trinh', 'ngu-phap', 'grammar-theory', 'grammar-practice', 'tu-vung', 'tu-dien', 'nghe', 'doc', 'thi-thu', 'bay-de-thi', 'nghe-chinh-ta', 'tu-vung-phim', 'take-note', 'tai-khoan', 'cai-dat'];
            allTabs.forEach(id => {
                const el = document.getElementById(\`view-\${id}\`);
                if (el) el.classList.add('hidden');
            });
            const vs = document.getElementById('view-vocabulary-study');
            if (vs) vs.classList.add('hidden');
            const vm = document.getElementById('view-vocabulary-match');
            if (vm) vm.classList.add('hidden');
        },`;

const newHide = `        hideAllViews() {
            document.querySelectorAll('[id^="view-"]').forEach(el => {
                el.classList.add('hidden');
            });
        },`;

if (code.includes(oldHide)) {
    code = code.replace(oldHide, newHide);
    fs.writeFileSync(vocabPath, code, 'utf8');
    console.log('✅ Đã cập nhật hideAllViews() thành công!');
} else {
    // Try normalized line endings
    const normalizedCode = code.replace(/\r\n/g, '\n');
    const normalizedOldHide = oldHide.replace(/\r\n/g, '\n');
    if (normalizedCode.includes(normalizedOldHide)) {
        const replaced = normalizedCode.replace(normalizedOldHide, newHide);
        fs.writeFileSync(vocabPath, replaced, 'utf8');
        console.log('✅ Đã cập nhật hideAllViews() (normalized) thành công!');
    } else {
        console.warn('⚠️ Không tìm thấy oldHide');
    }
}
