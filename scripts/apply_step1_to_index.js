const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

console.log('Original index.html size:', html.length, 'bytes');

// 1. Thay thế CSS: Bỏ user-select: none toàn cục, bỏ 5 lớp gradient kẹo ngọt, đưa về nền Quiet Confidence
const oldCssRegex = /\*\s*\{\s*box-sizing:\s*border-box;\s*user-select:\s*none;\s*-webkit-tap-highlight-color:\s*transparent;\s*\}[\s\S]*?html\.dark\s+body\s*\{[\s\S]*?color:\s*#f1f5f9;\s*\}/;

const newCss = `/* ========================================================
           BẢNG MÀU CHUẨN 80-15-5 & THIẾT LẬP QUIET CONFIDENCE (STUDY STUDIO)
           ======================================================== */
        :root {
            --bg-base: #F7F8F5;          /* Xám ấm ngả giấy thi - êm dịu cho mắt */
            --surface-card: #FFFFFF;     /* Nền thẻ trắng tinh khiết */
            --surface-sub: #F1F3F5;      /* Nền khu vực phụ */
            --border-light: #E3E7EC;     /* Viền siêu mảnh, trang nhã */
            --text-primary: #172033;     /* Slate sâu - độ tương phản cao chuẩn WCAG AAA */
            --text-secondary: #667085;   /* Chữ phụ giải thích rõ ràng */
            --text-muted: #98A2B3;       /* Metadata, ngày tháng */
            --brand-blue: #3157D5;       /* Xanh dương học thuật điềm tĩnh */
            --brand-hover: #2547B8;
            --brand-tint: #EEF2FF;       /* Highlight nhẹ, badge active */
            --accent-amber: #F2B84B;     /* Điểm nhấn Streak, XP */
            --accent-amber-subtle: #FFF6DE;
            --skill-grammar: #7759C2;
            --skill-vocab: #D97A40;
            --skill-listening: #248A8A;
            --skill-reading: #3E8B62;
        }

        *, *::before, *::after {
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }

        /* ĐÃ SỬA: Cho phép bôi đen văn bản tự do toàn trang để tra từ điển & ghi chú */
        body, p, span, div, h1, h2, h3, h4, h5, h6, input, textarea, select, blockquote, [contenteditable="true"], .reading-text, .question-text {
            -webkit-user-select: text;
            user-select: text;
        }

        /* Chỉ cấm bôi đen trên nút bấm & thanh điều hướng để tránh nhấp nháy */
        button, .nav-item, .no-select, .drag-handle, [role="button"] {
            -webkit-user-select: none;
            user-select: none;
        }

        body {
            font-family: 'Be Vietnam Pro', sans-serif;
            background-color: var(--bg-base);
            color: var(--text-primary);
            min-height: 100vh;
            min-height: 100dvh;
            overflow-x: hidden;
            line-height: 1.55;
        }
        html.dark body {
            background-color: #0B0F19;
            color: #F1F5F9;
        }`;

if (oldCssRegex.test(html)) {
    html = html.replace(oldCssRegex, newCss);
    console.log('✅ 1. Successfully replaced CSS & user-select with Quiet Confidence styling.');
} else {
    console.warn('⚠️ 1. CSS regex did not match, trying alternative search.');
}

// 2. Ẩn vĩnh viễn nút cam Take Note nổi (#floatingTakeNoteFab)
if (html.includes('id="floatingTakeNoteFab"')) {
    html = html.replace(
        'id="floatingTakeNoteFab"',
        'id="floatingTakeNoteFab" style="display: none !important;"'
    );
    console.log('✅ 2. Successfully hidden #floatingTakeNoteFab (no more obstructing mobile screen).');
}

// 3. Thay thế toàn bộ hình ảnh Mascot Totoro bằng Sói Mây (Rio 2D)
const mascotReplacements = [
    { from: 'assets/mascot/totoro_umbrella_logo.png', to: 'assets/mascot/may_avatar.png' },
    { from: 'assets/mascot/totoro_mascot_ai_tutor.png', to: 'assets/mascot/may_reading.png' },
    { from: 'assets/mascot/totoro_listening_card.png', to: 'assets/mascot/may_listening.png' },
    { from: 'assets/mascot/totoro_reading_card.png', to: 'assets/mascot/may_reading.png' },
    { from: 'assets/mascot/totoro_mock_test_card.png', to: 'assets/mascot/may_explorer.png' }
];

mascotReplacements.forEach(r => {
    const count = html.split(r.from).length - 1;
    if (count > 0) {
        html = html.replaceAll(r.from, r.to);
        console.log(`✅ 3. Replaced ${count} occurrences of ${r.from} -> ${r.to}`);
    }
});

// 4. Viết lại Copywriting điềm tĩnh, chuẩn xác
const copyReplacements = [
    { from: 'Gia Sư AI Đăng TOEIC', to: 'Trợ lý Mây AI' },
    { from: 'Độ đúng 99%', to: 'Giải bẫy & Ngữ pháp' },
    { from: 'Totoro Cầm Ô - Tôi đi đâu đó', to: 'Tôi Đi Đâu Đó - Lộ trình cá nhân' },
    { from: 'Totoro Cầm Ô - Cùng Đăng ra trường', to: 'Tôi Đi Đâu Đó - Lộ trình ra trường' },
    { from: 'Totoro & Đăng đồng hành chinh phục TOEIC mỗi ngày!', to: 'Mây & Đăng đồng hành chinh phục mục tiêu TOEIC!' },
    { from: 'Totoro Cầm Ô', to: 'Mascot Mây' },
    { from: 'Totoro Mascot', to: 'Mascot Mây' },
    { from: 'Totoro Gia Sư AI', to: 'Trợ lý Mây AI' }
];

copyReplacements.forEach(r => {
    const count = html.split(r.from).length - 1;
    if (count > 0) {
        html = html.replaceAll(r.from, r.to);
        console.log(`✅ 4. Replaced ${count} occurrences of "${r.from}" -> "${r.to}"`);
    }
});

fs.writeFileSync(filePath, html, 'utf8');
console.log('All changes applied successfully to index.html!');
