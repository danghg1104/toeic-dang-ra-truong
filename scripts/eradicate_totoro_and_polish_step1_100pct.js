const fs = require('fs');
const path = require('path');

console.log('🚀 Bắt đầu chiến dịch: Triệt để xóa bỏ 100% Totoro & Hoàn thiện trọn vẹn Bước 1 (Study Studio)...');

// =========================================================================
// BƯỚC 1: GHI ĐÈ TẤT CẢ FILE VẬT LÝ TOTORO TRONG ASSETS/ BẰNG SÓI MÂY (DEFENSIVE SHIELD)
// =========================================================================
console.log('--- 1. Ghi đè file vật lý Totoro bằng ảnh Sói Mây (Rio) ---');

const mascotDirs = [
  path.join(__dirname, '..', 'assets', 'mascot'),
  path.join(__dirname, '..', 'public', 'assets', 'mascot'),
  path.join(__dirname, '..', 'www', 'assets', 'mascot')
];

const mayAvatar = path.join(__dirname, '..', 'assets', 'mascot', 'may_avatar.png');
const mayReading = path.join(__dirname, '..', 'assets', 'mascot', 'may_reading.png');
const mayListening = path.join(__dirname, '..', 'assets', 'mascot', 'may_listening.png');
const mayExplorer = path.join(__dirname, '..', 'assets', 'mascot', 'may_explorer.png');
const mayResting = path.join(__dirname, '..', 'assets', 'mascot', 'may_resting.png');

const assetOverrides = {
  'totoro_avatar_clean.png': mayAvatar,
  'totoro_forest_logo.png': mayAvatar,
  'totoro_sidebar_logo_badge.png': mayAvatar,
  'totoro_umbrella_full.png': mayAvatar,
  'totoro_umbrella_logo.png': mayAvatar,
  'totoro_umbrella_square.png': mayAvatar,
  'totoro_ghibli_full_transparent.png': mayAvatar,
  'totoro_ghibli_totoro_only.png': mayAvatar,
  'totoro_mascot_ai_tutor.png': mayReading,
  'totoro_reading_card.png': mayReading,
  'totoro_reading_hero.png': mayReading,
  'totoro_listening_card.png': mayListening,
  'totoro_listening_hero.png': mayListening,
  'totoro_ocarina_moon.png': mayListening,
  'totoro_trio_stacked.png': mayExplorer,
  'totoro_mock_test_card.png': mayExplorer,
  'totoro_mock_test_hero.png': mayExplorer,
  'totoro_forest_sleeping_full.png': mayResting
};

for (const dir of mascotDirs) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  for (const [targetName, sourcePath] of Object.entries(assetOverrides)) {
    if (fs.existsSync(sourcePath)) {
      const destPath = path.join(dir, targetName);
      fs.copyFileSync(sourcePath, destPath);
    }
  }
}
console.log('✓ Đã ghi đè toàn bộ file vật lý totoro_*.png thành ảnh Sói Mây tương ứng!');

// =========================================================================
// BƯỚC 2: QUÉT VÀ THAY THẾ CHỦ ĐỀ GHIBLI/TOTORO TRONG DATA VÀ LIB
// =========================================================================
console.log('--- 2. Thanh lọc dữ liệu từ vựng & lexicon ---');

// 2a. data/curated_vocab_topics.json
const topicsPath = path.join(__dirname, '..', 'data', 'curated_vocab_topics.json');
if (fs.existsSync(topicsPath)) {
  let content = fs.readFileSync(topicsPath, 'utf8');
  content = content.replace(/"name":\s*"Thế giới Totoro & Ghibli \(Fantasy & Magic\)"/g, '"name": "Thám hiểm & Đời sống (Travel & Lifestyle)"');
  content = content.replace(/"thế giới totoro & ghibli"/g, '"thám hiểm & đời sống"');
  content = content.replace(/"the gioi totoro & ghibli"/g, '"tham hiem & doi song"');
  content = content.replace(/"totoro"/g, '"khám phá"');
  content = content.replace(/"ghibli"/g, '"du lịch"');
  content = content.replace(/mềm mại êm ái như bụng Totoro/g, 'mềm mại, êm ái tự nhiên');
  content = content.replace(/chiếc ô che mưa của Totoro/g, 'chiếc ô che mưa tiện lợi');
  content = content.replace(/quả sồi thơm nức Totoro thích/g, 'quả sồi rừng tự nhiên');
  fs.writeFileSync(topicsPath, content, 'utf8');
  console.log('✓ Đã cập nhật data/curated_vocab_topics.json');
}

// 2b. lib/curated-vocab-bank.js
const libVocabPath = path.join(__dirname, '..', 'lib', 'curated-vocab-bank.js');
if (fs.existsSync(libVocabPath)) {
  let content = fs.readFileSync(libVocabPath, 'utf8');
  content = content.replace(/"name":\s*"Thế giới Totoro & Ghibli \(Fantasy & Magic\)"/g, '"name": "Thám hiểm & Đời sống (Travel & Lifestyle)"');
  content = content.replace(/"thế giới totoro & ghibli"/g, '"thám hiểm & đời sống"');
  content = content.replace(/"the gioi totoro & ghibli"/g, '"tham hiem & doi song"');
  content = content.replace(/"totoro"/g, '"khám phá"');
  content = content.replace(/"ghibli"/g, '"du lịch"');
  content = content.replace(/mềm mại êm ái như bụng Totoro/g, 'mềm mại, êm ái tự nhiên');
  content = content.replace(/chiếc ô che mưa của Totoro/g, 'chiếc ô che mưa tiện lợi');
  content = content.replace(/quả sồi thơm nức Totoro thích/g, 'quả sồi rừng tự nhiên');
  fs.writeFileSync(libVocabPath, content, 'utf8');
  console.log('✓ Đã cập nhật lib/curated-vocab-bank.js');
}

// 2c. js/curated-vocab-bank.js
const jsVocabPath = path.join(__dirname, '..', 'js', 'curated-vocab-bank.js');
if (fs.existsSync(jsVocabPath)) {
  let content = fs.readFileSync(jsVocabPath, 'utf8');
  content = content.replace(/"name":\s*"Thế giới Totoro & Ghibli \(Fantasy & Magic\)"/g, '"name": "Thám hiểm & Đời sống (Travel & Lifestyle)"');
  content = content.replace(/"thế giới totoro & ghibli"/g, '"thám hiểm & đời sống"');
  content = content.replace(/"the gioi totoro & ghibli"/g, '"tham hiem & doi song"');
  content = content.replace(/"totoro"/g, '"khám phá"');
  content = content.replace(/"ghibli"/g, '"du lịch"');
  content = content.replace(/mềm mại êm ái như bụng Totoro/g, 'mềm mại, êm ái tự nhiên');
  content = content.replace(/chiếc ô che mưa của Totoro/g, 'chiếc ô che mưa tiện lợi');
  content = content.replace(/quả sồi thơm nức Totoro thích/g, 'quả sồi rừng tự nhiên');
  fs.writeFileSync(jsVocabPath, content, 'utf8');
  console.log('✓ Đã cập nhật js/curated-vocab-bank.js');
}

// 2d. data/dictionary_lexicon.json
const dictPath = path.join(__dirname, '..', 'data', 'dictionary_lexicon.json');
if (fs.existsSync(dictPath)) {
  console.log('  Đang xử lý data/dictionary_lexicon.json...');
  let content = fs.readFileSync(dictPath, 'utf8');
  content = content.replace(/Topic: Thế giới Totoro & Ghibli \(Fantasy & Magic\)/g, 'Topic: Thám hiểm & Đời sống (Travel & Lifestyle)');
  fs.writeFileSync(dictPath, content, 'utf8');
  console.log('✓ Đã cập nhật data/dictionary_lexicon.json');
}

// =========================================================================
// BƯỚC 3: CẬP NHẬT MANIFEST.JSON VÀ SW.JS
// =========================================================================
console.log('--- 3. Cập nhật Manifest và Service Worker ---');

const manifestPath = path.join(__dirname, '..', 'manifest.json');
if (fs.existsSync(manifestPath)) {
  let content = fs.readFileSync(manifestPath, 'utf8');
  content = content.replace(/\/icon-totoro-192\.png\?v=[^"']+/g, '/icon-192.png?v=studystudio_20261029');
  content = content.replace(/\/icon-totoro-512\.png\?v=[^"']+/g, '/icon-512.png?v=studystudio_20261029');
  content = content.replace(/\/icon-totoro-maskable-512\.png\?v=[^"']+/g, '/icon-512.png?v=studystudio_20261029');
  content = content.replace(/\/icon-192\.png\?v=[^"']+/g, '/icon-192.png?v=studystudio_20261029');
  content = content.replace(/\/icon-512\.png\?v=[^"']+/g, '/icon-512.png?v=studystudio_20261029');
  fs.writeFileSync(manifestPath, content, 'utf8');
  console.log('✓ Đã cập nhật manifest.json');
}

const swPath = path.join(__dirname, '..', 'sw.js');
if (fs.existsSync(swPath)) {
  let content = fs.readFileSync(swPath, 'utf8');
  content = content.replace(/toi-di-dau-do-cache-v13-2026/g, 'study-studio-cache-v1-2026');
  content = content.replace(/\(V13 Totoro - Tôi Đi Đâu Đó 2026\)/g, '(Study Studio 2026)');
  content = content.replace(/'\/icon-totoro-192\.png',?/g, '');
  content = content.replace(/'\/icon-totoro-512\.png',?/g, '');
  fs.writeFileSync(swPath, content, 'utf8');
  console.log('✓ Đã cập nhật sw.js');
}

// =========================================================================
// BƯỚC 4: CẬP NHẬT SERVER.JS
// =========================================================================
const serverPath = path.join(__dirname, '..', 'server.js');
if (fs.existsSync(serverPath)) {
  let content = fs.readFileSync(serverPath, 'utf8');
  content = content.replace(/\(Học Từ Vựng Totoro\)/g, '(Đấu Trường Từ Vựng Sói Mây)');
  fs.writeFileSync(serverPath, content, 'utf8');
  console.log('✓ Đã cập nhật server.js');
}

// =========================================================================
// BƯỚC 5: TÁI CẤU TRÚC SIDEBAR & BUMP VERSION CACHE TOÀN BỘ SCRIPT TRONG INDEX.HTML
// =========================================================================
console.log('--- 5. Tái cấu trúc Sidebar & Bump Cache Version trong index.html ---');

const indexPath = path.join(__dirname, '..', 'index.html');
if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');

  // 5a. Icons trong <head>
  content = content.replace(/href="favicon\.ico\?v=[^"']+"/g, 'href="favicon.ico?v=studystudio_20261029"');
  content = content.replace(/href="icon-totoro-192\.png\?v=[^"']+"/g, 'href="icon-192.png?v=studystudio_20261029"');
  content = content.replace(/href="icon-totoro-512\.png\?v=[^"']+"/g, 'href="icon-512.png?v=studystudio_20261029"');
  content = content.replace(/href="icon-192\.png\?v=[^"']+"/g, 'href="icon-192.png?v=studystudio_20261029"');
  content = content.replace(/href="icon-512\.png\?v=[^"']+"/g, 'href="icon-512.png?v=studystudio_20261029"');

  // 5b. Bump cache version cho tất cả local script
  const scriptRegex = /<script src="(js\/[^"?]+)(?:\?[^"]*)?"><\/script>/g;
  content = content.replace(scriptRegex, '<script src="$1?v=studystudio_20261029_step1"></script>');

  // 5c. Dọn sạch các alt và text Totoro còn sót
  content = content.replace(/alt="Totoro[^"]*"/g, 'alt="Mascot Sói Mây"');
  content = content.replace(/mascotText:\s*'Luyện gõ từ vựng & nghe phát âm cùng Totoro!'/g, "mascotText: 'Luyện gõ từ vựng & nghe phát âm cùng Sói Mây!'");
  content = content.replace(/<!-- VIEW HỌC TỪ VỰNG \(AI & MINI-GAME TOTORO\) -->/g, '<!-- VIEW ĐẤU TRƯỜNG TỪ VỰNG (AI & MINI-GAME SÓI MÂY) -->');
  content = content.replace(/'\/sw\.js\?v=totoro_v12'/g, "'/sw.js?v=studystudio_20261029'");
  content = content.replace(/if \(!k\.includes\('v12-totoro'\)\)/g, "if (!k.includes('studystudio_20261029'))");

  // 5d. TÁI CẤU TRÚC TOÀN BỘ SIDEBAR NAVIGATION THÀNH 4 NHÓM RÕ RÀNG
  const sidebarStartTag = '<nav class="space-y-1.5" id="sidebarNav">';
  const sidebarEndTag = '</nav>';
  const startIndex = content.indexOf(sidebarStartTag);
  const endIndex = content.indexOf(sidebarEndTag, startIndex);

  if (startIndex !== -1 && endIndex !== -1) {
    const newSidebarHTML = `<nav class="space-y-4" id="sidebarNav">
                        <!-- NHÓM 1: HÔM NAY -->
                        <div class="space-y-1">
                            <div class="px-3 pt-1 pb-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sidebar-text">
                                Hôm nay
                            </div>
                            <button onclick="switchTab('hom-nay')" id="nav-hom-nay" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-house text-[15px] w-5 text-center text-blue-600 dark:text-blue-400"></i>
                                <span class="sidebar-text">Tổng quan</span>
                            </button>
                            <button onclick="switchTab('lo-trinh')" id="nav-lo-trinh" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-map-location-dot text-[15px] w-5 text-center text-emerald-600 dark:text-emerald-400"></i>
                                <span class="sidebar-text">Lộ trình của tôi</span>
                                <span id="urgentRushBadge" class="hidden ml-auto px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[11px] font-bold">GẤP</span>
                            </button>
                        </div>

                        <!-- NHÓM 2: LUYỆN TẬP KỸ NĂNG -->
                        <div class="space-y-1">
                            <div class="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sidebar-text">
                                Luyện tập kỹ năng
                            </div>
                            <button onclick="switchTab('nghe')" id="nav-nghe" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-headphones text-[15px] w-5 text-center text-teal-600 dark:text-teal-400"></i>
                                <span class="sidebar-text">Luyện Nghe (Listening)</span>
                            </button>
                            <button onclick="switchTab('doc')" id="nav-doc" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-regular fa-file-lines text-[15px] w-5 text-center text-green-600 dark:text-green-400"></i>
                                <span class="sidebar-text">Luyện Đọc (Reading)</span>
                            </button>
                            <button onclick="switchTab('ngu-phap')" id="nav-ngu-phap" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-book-open text-[15px] w-5 text-center text-purple-600 dark:text-purple-400"></i>
                                <span class="sidebar-text">Ngữ pháp trọng tâm</span>
                            </button>
                            <button onclick="switchTab('tu-vung')" id="nav-tu-vung" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-spell-check text-[15px] w-5 text-center text-amber-600 dark:text-amber-400"></i>
                                <span class="sidebar-text">Kho Từ vựng cốt lõi</span>
                            </button>
                            <button onclick="switchTab('hoc-tu-vung')" id="nav-hoc-tu-vung" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-gamepad text-[15px] w-5 text-center text-indigo-600 dark:text-indigo-400"></i>
                                <span class="sidebar-text">Đấu trường Từ vựng</span>
                            </button>
                        </div>

                        <!-- NHÓM 3: KIỂM TRA & BẪY ĐỀ -->
                        <div class="space-y-1">
                            <div class="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sidebar-text">
                                Kiểm tra & Đề thi
                            </div>
                            <button onclick="switchTab('thi-thu')" id="nav-thi-thu" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-bolt text-[15px] w-5 text-center text-amber-500"></i>
                                <span class="sidebar-text">Thi thử Full Test ETS</span>
                            </button>
                            <button onclick="switchTab('bay-de-thi')" id="nav-bay-de-thi" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-triangle-exclamation text-[15px] w-5 text-center text-rose-500"></i>
                                <span class="sidebar-text">Bộ bẫy đề kinh điển</span>
                            </button>
                        </div>

                        <!-- NHÓM 4: CÔNG CỤ HỖ TRỢ -->
                        <div class="space-y-1">
                            <div class="px-3 pt-2 pb-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sidebar-text">
                                Công cụ hỗ trợ
                            </div>
                            <button onclick="switchTab('boc-bang-audio')" id="nav-boc-bang-audio" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-file-audio text-[15px] w-5 text-center text-teal-600 dark:text-teal-400"></i>
                                <span class="sidebar-text">Trạm Bóc băng file nghe</span>
                            </button>
                            <button onclick="switchTab('nghe-chinh-ta')" id="nav-nghe-chinh-ta" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-keyboard text-[15px] w-5 text-center text-indigo-600 dark:text-indigo-400"></i>
                                <span class="sidebar-text">Luyện nghe chép chính tả</span>
                            </button>
                            <button onclick="switchTab('tu-vung-phim')" id="nav-tu-vung-phim" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-clapperboard text-[15px] w-5 text-center text-rose-600 dark:text-rose-400"></i>
                                <span class="sidebar-text">Từ vựng qua video</span>
                            </button>
                            <button onclick="switchTab('take-note')" id="nav-take-note" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-book-bookmark text-[15px] w-5 text-center text-amber-600 dark:text-amber-400"></i>
                                <span class="sidebar-text">Sổ Take Note & Lưu file</span>
                            </button>
                            <button onclick="switchTab('tu-dien')" id="nav-tu-dien" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-book-atlas text-[15px] w-5 text-center text-sky-600 dark:text-sky-400"></i>
                                <span class="sidebar-text">Từ điển Anh - Việt</span>
                            </button>
                        </div>
                    </nav>`;
    content = content.substring(0, startIndex) + newSidebarHTML + content.substring(endIndex + sidebarEndTag.length);
    console.log('✓ Đã tái cấu trúc Sidebar thành 4 nhóm rõ ràng, chuẩn phong cách Quiet Confidence!');
  }

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('✓ Đã cập nhật index.html');
}

// =========================================================================
// BƯỚC 6: ĐỒNG BỘ TOÀN BỘ SANG THƯ MỤC WWW/
// =========================================================================
console.log('--- 6. Đồng bộ sang www/ ---');
const wwwDir = path.join(__dirname, '..', 'www');
if (!fs.existsSync(wwwDir)) fs.mkdirSync(wwwDir, { recursive: true });

const rootFilesToCopy = ['index.html', 'manifest.json', 'sw.js', 'favicon.ico', 'app.ico', 'icon-192.png', 'icon-512.png'];
for (const file of rootFilesToCopy) {
  const src = path.join(__dirname, '..', file);
  const dest = path.join(wwwDir, file);
  if (fs.existsSync(src)) fs.copyFileSync(src, dest);
}

if (fs.existsSync(path.join(__dirname, '..', 'js'))) {
  fs.cpSync(path.join(__dirname, '..', 'js'), path.join(wwwDir, 'js'), { recursive: true });
}
if (fs.existsSync(path.join(__dirname, '..', 'css'))) {
  fs.cpSync(path.join(__dirname, '..', 'css'), path.join(wwwDir, 'css'), { recursive: true });
}
if (fs.existsSync(path.join(__dirname, '..', 'assets'))) {
  fs.cpSync(path.join(__dirname, '..', 'assets'), path.join(wwwDir, 'assets'), { recursive: true });
}

console.log('✓ Hoàn tất đồng bộ toàn bộ assets sang www/!');
