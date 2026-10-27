const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Meta apple title & page title & manifest link
html = html.replace(
  '<meta name="apple-mobile-web-app-title" content="Đăng Ra Trường">',
  '<meta name="apple-mobile-web-app-title" content="Tôi Đi Đâu Đó">'
);

html = html.replace(
  '<title>Cùng Đăng ra trường — Luyện thi TOEIC & VSTEP online miễn phí</title>',
  '<title>Tôi đi đâu đó — Luyện thi TOEIC & VSTEP online miễn phí</title>'
);

html = html.replace(
  'href="manifest.json?v=totoro_v12"',
  'href="manifest.json?v=toididaudo_v13"'
);

html = html.replace(
  "navigator.serviceWorker.register('/sw.js?v=totoro_v12')",
  "navigator.serviceWorker.register('/sw.js?v=toididaudo_v13')"
);

// 2. Mobile Brand Header
html = html.replace(
  'title="Totoro Cầm Ô - Cùng Đăng ra trường">',
  'title="Totoro Cầm Ô - Tôi đi đâu đó">'
);

// Replace mobile brand title
html = html.replace(
  `<div class="text-[11px] font-extrabold bg-gradient-to-r from-orange-600 to-indigo-700 bg-clip-text text-transparent">Cùng Đăng</div>\n                    <div class="text-[13.5px] font-extrabold text-slate-900 dark:text-white tracking-tight truncate">ra trường</div>`,
  `<div class="text-[11px] font-extrabold bg-gradient-to-r from-orange-600 to-indigo-700 bg-clip-text text-transparent">Tôi đi</div>\n                    <div class="text-[13.5px] font-extrabold text-slate-900 dark:text-white tracking-tight truncate">đâu đó</div>`
);

// 3. Desktop Brand Header
html = html.replace(
  `<div class="text-[15px] font-extrabold bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-700 bg-clip-text text-transparent">Cùng Đăng</div>\n                            <div class="text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight">ra trường</div>`,
  `<div class="text-[15px] font-extrabold bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-700 bg-clip-text text-transparent">Tôi đi</div>\n                            <div class="text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight">đâu đó</div>`
);

// In case CRLF was present
html = html.replace(
  `<div class="text-[11px] font-extrabold bg-gradient-to-r from-orange-600 to-indigo-700 bg-clip-text text-transparent">Cùng Đăng</div>\r\n                    <div class="text-[13.5px] font-extrabold text-slate-900 dark:text-white tracking-tight truncate">ra trường</div>`,
  `<div class="text-[11px] font-extrabold bg-gradient-to-r from-orange-600 to-indigo-700 bg-clip-text text-transparent">Tôi đi</div>\r\n                    <div class="text-[13.5px] font-extrabold text-slate-900 dark:text-white tracking-tight truncate">đâu đó</div>`
);

html = html.replace(
  `<div class="text-[15px] font-extrabold bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-700 bg-clip-text text-transparent">Cùng Đăng</div>\r\n                            <div class="text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight">ra trường</div>`,
  `<div class="text-[15px] font-extrabold bg-gradient-to-r from-orange-600 via-amber-600 to-indigo-700 bg-clip-text text-transparent">Tôi đi</div>\r\n                            <div class="text-[17px] font-extrabold text-slate-900 dark:text-white tracking-tight">đâu đó</div>`
);

// 4. Install card
html = html.replace(
  '<h2>Cài đặt ứng dụng Cùng Đăng Ra Trường</h2>',
  '<h2>Cài đặt ứng dụng Tôi Đi Đâu Đó</h2>'
);

// 5. Mascot texts
html = html.replace(
  "mascotText: 'Cùng Đăng chinh phục tiếng Anh mỗi ngày!'",
  "mascotText: 'Tôi Đi Đâu Đó chinh phục tiếng Anh mỗi ngày!'"
);
html = html.replace(
  "mascotText: 'Cùng Đăng chinh phục ngữ pháp & PassToeic!'",
  "mascotText: 'Tôi Đi Đâu Đó chinh phục ngữ pháp & PassToeic!'"
);
html = html.replace(
  "mascotText: 'Cùng Đăng học từ mới mỗi ngày nhé!'",
  "mascotText: 'Tôi Đi Đâu Đó học từ mới mỗi ngày nhé!'"
);
html = html.replace(
  "mascotText: 'Cùng Đăng luyện nghe đều mỗi ngày!'",
  "mascotText: 'Tôi Đi Đâu Đó luyện nghe đều mỗi ngày!'"
);
html = html.replace(
  "mascotText: 'Cùng Đăng đọc hiểu tốt hơn mỗi ngày!'",
  "mascotText: 'Tôi Đi Đâu Đó đọc hiểu tốt hơn mỗi ngày!'"
);
html = html.replace(
  "mascotText: 'Cùng Đăng giữ phong độ trước ngày thi!'",
  "mascotText: 'Tôi Đi Đâu Đó giữ phong độ trước ngày thi!'"
);

// 6. PDF Take Note export
html = html.replace(
  "author: 'Cùng Đăng ra trường'",
  "author: 'Tôi đi đâu đó'"
);
html = html.replace(
  "`${note.title || 'Ghi chú'} — Cùng Đăng ra trường`",
  "`${note.title || 'Ghi chú'} — Tôi đi đâu đó`"
);

fs.writeFileSync('index.html', html, 'utf8');
console.log('Successfully updated index.html branding to "Tôi đi đâu đó"!');
