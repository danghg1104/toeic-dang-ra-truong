const fs = require('fs');
const path = require('path');

function replaceInFile(relPath, replacements) {
    const fullPath = path.join(__dirname, '..', relPath);
    if (!fs.existsSync(fullPath)) {
        console.warn('File not found:', relPath);
        return;
    }
    let content = fs.readFileSync(fullPath, 'utf8');
    let total = 0;
    replacements.forEach(r => {
        let count = 0;
        if (typeof r.from === 'string') {
            count = content.split(r.from).length - 1;
            if (count > 0) {
                content = content.replaceAll(r.from, r.to);
                total += count;
            }
        } else if (r.from instanceof RegExp) {
            const matches = content.match(r.from);
            if (matches) {
                count = matches.length;
                content = content.replace(r.from, r.to);
                total += count;
            }
        }
        if (count > 0) {
            console.log(`  [${relPath}] Replaced (${count}): "${r.from.toString().slice(0, 40)}..." -> "${r.to.toString().slice(0, 40)}..."`);
        }
    });
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Done ${relPath}: ${total} total replacements.`);
}

console.log('=== 1. WIPING TOTORO FROM ALL JS MODULES ===');

// 1. roadmap-and-traps.js (Ảnh 1)
replaceInFile('js/roadmap-and-traps.js', [
    { from: 'assets/mascot/totoro_trio_stacked.png', to: 'assets/mascot/may_explorer.png' },
    { from: '3 Chú Totoro Vượt Mốc 990', to: 'Sói Mây Thám Hiểm Lộ Trình 990' },
    { from: 'Bộ 3 Totoro Đồng Hành Vượt 6 Chặng Bản Đồ S-Curve', to: 'Hành Trình Sói Mây Vượt 6 Chặng Chinh Phục 990 TOEIC' },
    { from: 'Totoro Trắng (Chặng 1-2):', to: 'Chặng Khởi Động (Chặng 1-2):' },
    { from: 'Totoro Xanh (Chặng 3-4):', to: 'Chặng Tăng Tốc (Chặng 3-4):' },
    { from: 'Totoro Xám Lớn (Chặng 5-6):', to: 'Chặng Bứt Phá (Chặng 5-6):' }
]);

// 2. dailydictation-workstation.js (Ảnh 2)
replaceInFile('js/dailydictation-workstation.js', [
    { from: 'assets/mascot/totoro_listening_card.png', to: 'assets/mascot/may_listening.png' },
    { from: 'Totoro Thổi Sáo Dưới Trăng (Ảnh 3)', to: 'Sói Mây Kiểm Âm Phòng Lab' },
    { from: 'Góc Luyện Nghe Studio Ghibli', to: 'Trạm Luyện Nghe Kiểm Âm' },
    { from: '🌙 Totoro Thổi Sáo Dưới Ánh Trăng', to: '🎧 Sói Mây Đồng Hành Bóc Băng & Dictation' },
    { from: 'Lắng nghe êm dịu, kiên trì chép chính tả mỗi ngày 15 phút cùng Totoro giúp bạn phản xạ tự nhiên với tốc độ nói thực tế của người bản xứ và xóa bỏ hoàn toàn nỗi sợ Part 1-4!', to: 'Lắng nghe chủ động, kiên trì chép chính tả mỗi ngày 15 phút cùng Trợ lý Mây giúp bạn phản xạ tự nhiên với tốc độ nói thực tế của người bản xứ và xóa bỏ hoàn toàn nỗi sợ Part 1-4!' }
]);

// 3. vocab-game-workstation.js (Ảnh 3)
replaceInFile('js/vocab-game-workstation.js', [
    { from: 'assets/mascot/totoro_listening_card.png', to: 'assets/mascot/may_reading.png' },
    { from: "id: 'Phim hoạt hình Ghibli', icon: '🌳', label: 'Thế giới Totoro & Ghibli'", to: "id: 'Thám hiểm & Du lịch', icon: '🧭', label: 'Thám hiểm & Du lịch (Travel & Adventure)'" },
    { from: 'Thế giới Totoro & Ghibli', to: 'Thám hiểm & Du lịch' },
    { from: 'Totoro Style', to: 'Study Studio Style' }
]);

// 4. curated-vocab-bank.js
replaceInFile('js/curated-vocab-bank.js', [
    { from: 'Thế giới Totoro & Ghibli (Fantasy & Magic)', to: 'Thám hiểm & Đời sống (Travel & Lifestyle)' },
    { from: 'thế giới totoro & ghibli', to: 'tham hiem & doi song' },
    { from: 'the gioi totoro & ghibli', to: 'tham hiem & doi song' },
    { from: 'mềm mại êm ái như bụng Totoro', to: 'mềm mại êm ái như bộ lông sói tuyết' },
    { from: 'chiếc ô che mưa của Totoro', to: 'chiếc khăn quàng ấm áp của Sói Mây' },
    { from: 'quả sồi thơm nức Totoro thích', to: 'bình nước tiếp sức của Sói Mây' }
]);

// 5. dynamic-topic-vocab-engine.js
replaceInFile('js/dynamic-topic-vocab-engine.js', [
    { from: "'thế giới totoro & ghibli': 'nature fantasy forest anime magic spirit animation'", to: "'tham hiem & doi song': 'travel adventure journey exploration nature backpack'" },
    { from: "'phim hoạt hình ghibli': 'nature fantasy forest anime magic spirit animation'", to: "'du lich & tham hiem': 'travel adventure journey exploration nature backpack'" }
]);

// 6. floating-take-note.js
replaceInFile('js/floating-take-note.js', [
    { from: 'TOTORO THEME', to: 'STUDY STUDIO THEME' }
]);

console.log('\n=== 2. POLISHING INDEX.HTML (WHITE CARDS, GROUPED SIDEBAR, TYPOGRAPHY) ===');

const indexPath = path.join(__dirname, '..', 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// A. Trắng hóa 5 thẻ thống kê (Xóa sạch màu pastel kẹo ngọt)
const oldStatCardCss = /\.stat-card-blue\s*\{[\s\S]*?html\.dark\s+\.tasks-card-bg\s*\{[\s\S]*?\}/;
const newStatCardCss = `/* Dashboard Top Stat Cards - Unified Clean White (Quiet Confidence) */
        .stat-card-blue,
        .stat-card-green,
        .stat-card-purple,
        .stat-card-pink,
        .stat-card-streak,
        .tasks-card-bg {
            background: #FFFFFF !important;
            border: 1px solid #E3E7EC !important;
            box-shadow: 0 1px 3px rgba(16, 24, 40, 0.05) !important;
        }
        html.dark .stat-card-blue,
        html.dark .stat-card-green,
        html.dark .stat-card-purple,
        html.dark .stat-card-pink,
        html.dark .stat-card-streak,
        html.dark .tasks-card-bg {
            background: #111827 !important;
            border: 1px solid #1F2937 !important;
            box-shadow: none !important;
        }`;

if (oldStatCardCss.test(indexHtml)) {
    indexHtml = indexHtml.replace(oldStatCardCss, newStatCardCss);
    console.log('✅ Updated stat card CSS to clean white Quiet Confidence.');
} else {
    console.warn('⚠️ oldStatCardCss regex did not match.');
}

// B. Gom Sidebar Desktop từ 14 mục phẳng về 4 nhóm tư duy
const oldNavBlock = `<nav class="space-y-1">
                        <button onclick="switchTab('hom-nay')" id="nav-hom-nay" class="nav-item nav-active-home w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] text-blue-700 dark:text-blue-400">
                            <i class="fa-solid fa-house text-[15px] w-5 text-center"></i>
                            <span class="sidebar-text">Hôm nay</span>
                        </button>

                        <button onclick="switchTab('lo-trinh')" id="nav-lo-trinh" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-50/70 dark:hover:bg-slate-800">
                            <i class="fa-solid fa-map-location-dot text-[15px] w-5 text-center text-emerald-600 dark:text-emerald-400"></i>
                            <span class="sidebar-text">Lộ trình cá nhân</span>
                        </button>

                        <!-- Học từ vựng (AI & Mini-game Totoro - Đặt ngay dưới Lộ trình cá nhân) -->
                        <button onclick="switchTab('hoc-tu-vung')" id="nav-hoc-tu-vung" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-slate-800">
                            <i class="fa-solid fa-gamepad text-[15px] w-5 text-center text-emerald-600 dark:text-emerald-400"></i>
                            <span class="sidebar-text">Học từ vựng</span>
                        </button>

                        <button onclick="switchTab('ngu-phap')" id="nav-ngu-phap" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-50/70 dark:hover:bg-slate-800">
                            <i class="fa-solid fa-book-open text-[15px] w-5 text-center text-purple-600 dark:text-purple-400"></i>
                            <span class="sidebar-text">Ngữ pháp</span>
                        </button>

                        <button onclick="switchTab('tu-vung')" id="nav-tu-vung" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-fuchsia-700 dark:text-fuchsia-300 hover:bg-fuchsia-50/70 dark:hover:bg-slate-800">
                            <i class="fa-solid fa-font text-[15px] w-5 text-center text-fuchsia-600 dark:text-fuchsia-400"></i>
                            <span class="sidebar-text">Từ vựng</span>
                        </button>

                        <!-- TỪ ĐIỂN ANH - VIỆT TOÀN DIỆN (10.000+ từ + Oxford + Cambridge) -->
                        <button onclick="switchTab('tu-dien')" id="nav-tu-dien" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-sky-700 dark:text-sky-300 hover:bg-sky-50/70 dark:hover:bg-slate-800">
                            <i class="fa-solid fa-spell-check text-[15px] w-5 text-center text-sky-600 dark:text-sky-400"></i>
                            <span class="sidebar-text">Từ điển Anh - Việt</span>
                        </button>

                        <button onclick="switchTab('nghe')" id="nav-nghe" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-teal-700 dark:text-teal-300 hover:bg-teal-50/70 dark:hover:bg-slate-800">
                            <i class="fa-solid fa-headphones text-[15px] w-5 text-center text-teal-600 dark:text-teal-400"></i>
                            <span class="sidebar-text">Nghe</span>
                        </button>

                        <button onclick="switchTab('doc')" id="nav-doc" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-emerald-800 dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-slate-800">
                            <i class="fa-solid fa-book text-[15px] w-5 text-center text-emerald-600 dark:text-emerald-400"></i>
                            <span class="sidebar-text">Đọc</span>
                        </button>

                        <button onclick="switchTab('thi-thu')" id="nav-thi-thu" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-amber-800 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-slate-800">
                            <i class="fa-solid fa-bolt text-[15px] w-5 text-center text-amber-500"></i>
                            <span class="sidebar-text">Thi thử</span>
                        </button>

                        <button onclick="switchTab('bay-de')" id="nav-bay-de" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50/70 dark:hover:bg-slate-800">
                            <i class="fa-solid fa-triangle-exclamation text-[15px] w-5 text-center text-rose-500"></i>
                            <span class="sidebar-text">Bẫy đề kinh điển</span>
                        </button>

                        <!-- BÓC BĂNG FILE NGHE (Audio to Transcript & Answer Key 100%) -->
                        <button onclick="switchTab('boc-bang')" id="nav-boc-bang" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-teal-800 dark:text-teal-200 hover:bg-teal-50 dark:hover:bg-slate-800">
                            <i class="fa-solid fa-file-audio text-[15px] w-5 text-center text-teal-600 dark:text-teal-400"></i>
                            <span class="sidebar-text">Bóc băng file nghe</span>
                        </button>

                        <!-- DAILY DICTATION (Luyện Nghe Chép Chính Tả 30 Đề ETS & BestMyTest) -->
                        <button onclick="switchTab('chinh-ta')" id="nav-chinh-ta" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50/70 dark:hover:bg-slate-800">
                            <i class="fa-solid fa-keyboard text-[15px] w-5 text-center text-indigo-600 dark:text-indigo-400"></i>
                            <span class="sidebar-text">Luyện nghe chính tả</span>
                        </button>

                        <!-- TỪ VỰNG TRONG PHIM (YOUGLISH FOR TOEIC) -->
                        <button onclick="switchTab('tu-vung-phim')" id="nav-tu-vung-phim" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-50/70 dark:hover:bg-slate-800">
                            <i class="fa-solid fa-clapperboard text-[15px] w-5 text-center text-rose-500"></i>
                            <span class="sidebar-text">Từ vựng trong phim</span>
                        </button>

                        <!-- SỔ TAKE NOTE TOÀN NĂNG -->
                        <button onclick="switchTab('take-note')" id="nav-take-note" class="nav-item w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-[13.5px] font-semibold text-amber-900 dark:text-amber-200 hover:bg-amber-50 dark:hover:bg-slate-800">
                            <i class="fa-solid fa-book-bookmark text-[15px] w-5 text-center text-amber-600 dark:text-amber-400"></i>
                            <span class="sidebar-text">Sổ Take Note</span>
                        </button>
                    </nav>`;

const newNavBlock = `<nav class="space-y-3">
                        <!-- NHÓM 1: HÔM NAY -->
                        <div>
                            <div class="px-3 pb-1 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase sidebar-text">Hôm nay</div>
                            <div class="space-y-0.5">
                                <button onclick="switchTab('hom-nay')" id="nav-hom-nay" class="nav-item nav-active-home w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] text-blue-700 dark:text-blue-400">
                                    <i class="fa-solid fa-house text-[15px] w-5 text-center"></i>
                                    <span class="sidebar-text">Tổng quan</span>
                                </button>
                                <button onclick="switchTab('lo-trinh')" id="nav-lo-trinh" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <i class="fa-solid fa-map-location-dot text-[15px] w-5 text-center text-emerald-600 dark:text-emerald-400"></i>
                                    <span class="sidebar-text">Lộ trình của tôi</span>
                                </button>
                            </div>
                        </div>

                        <!-- NHÓM 2: LUYỆN TẬP -->
                        <div>
                            <div class="px-3 pb-1 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase sidebar-text">Luyện tập</div>
                            <div class="space-y-0.5">
                                <button onclick="switchTab('nghe')" id="nav-nghe" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <i class="fa-solid fa-headphones text-[15px] w-5 text-center text-teal-600 dark:text-teal-400"></i>
                                    <span class="sidebar-text">Luyện Nghe (Part 1–4)</span>
                                </button>
                                <button onclick="switchTab('doc')" id="nav-doc" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <i class="fa-solid fa-book-open text-[15px] w-5 text-center text-emerald-600 dark:text-emerald-400"></i>
                                    <span class="sidebar-text">Luyện Đọc (Part 5–7)</span>
                                </button>
                                <button onclick="switchTab('ngu-phap')" id="nav-ngu-phap" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <i class="fa-solid fa-spell-check text-[15px] w-5 text-center text-purple-600 dark:text-purple-400"></i>
                                    <span class="sidebar-text">Ngữ pháp trọng tâm</span>
                                </button>
                                <button onclick="switchTab('tu-vung')" id="nav-tu-vung" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <i class="fa-solid fa-layer-group text-[15px] w-5 text-center text-fuchsia-600 dark:text-fuchsia-400"></i>
                                    <span class="sidebar-text">Kho Từ vựng</span>
                                </button>
                                <button onclick="switchTab('hoc-tu-vung')" id="nav-hoc-tu-vung" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <i class="fa-solid fa-gamepad text-[15px] w-5 text-center text-indigo-500"></i>
                                    <span class="sidebar-text">Đấu trường Từ vựng</span>
                                </button>
                            </div>
                        </div>

                        <!-- NHÓM 3: KIỂM TRA -->
                        <div>
                            <div class="px-3 pb-1 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase sidebar-text">Kiểm tra</div>
                            <div class="space-y-0.5">
                                <button onclick="switchTab('thi-thu')" id="nav-thi-thu" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <i class="fa-solid fa-stopwatch text-[15px] w-5 text-center text-amber-500"></i>
                                    <span class="sidebar-text">Thi thử Full Test</span>
                                </button>
                                <button onclick="switchTab('bay-de')" id="nav-bay-de" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <i class="fa-solid fa-shield-halved text-[15px] w-5 text-center text-rose-500"></i>
                                    <span class="sidebar-text">Bộ bẫy đề kinh điển</span>
                                </button>
                            </div>
                        </div>

                        <!-- NHÓM 4: CÔNG CỤ HỖ TRỢ -->
                        <div>
                            <div class="px-3 pb-1 text-[11px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase sidebar-text">Công cụ hỗ trợ</div>
                            <div class="space-y-0.5">
                                <button onclick="switchTab('boc-bang')" id="nav-boc-bang" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <i class="fa-solid fa-microphone-lines text-[15px] w-5 text-center text-teal-600 dark:text-teal-400"></i>
                                    <span class="sidebar-text">Trạm Bóc băng file nghe</span>
                                </button>
                                <button onclick="switchTab('chinh-ta')" id="nav-chinh-ta" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <i class="fa-solid fa-keyboard text-[15px] w-5 text-center text-indigo-600 dark:text-indigo-400"></i>
                                    <span class="sidebar-text">Nghe chép chính tả</span>
                                </button>
                                <button onclick="switchTab('take-note')" id="nav-take-note" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <i class="fa-solid fa-book-bookmark text-[15px] w-5 text-center text-amber-600 dark:text-amber-400"></i>
                                    <span class="sidebar-text">Sổ Take Note & File</span>
                                </button>
                                <button onclick="switchTab('tu-dien')" id="nav-tu-dien" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                                    <i class="fa-solid fa-magnifying-glass text-[15px] w-5 text-center text-sky-600 dark:text-sky-400"></i>
                                    <span class="sidebar-text">Từ điển Anh - Việt</span>
                                </button>
                            </div>
                        </div>
                    </nav>`;

if (indexHtml.includes(oldNavBlock)) {
    indexHtml = indexHtml.replace(oldNavBlock, newNavBlock);
    console.log('✅ Replaced Sidebar navigation with 4 logical groups.');
} else {
    console.warn('⚠️ oldNavBlock did not match exactly, searching flexible.');
}

// C. Dọn nốt chữ li ti <12px ở các khối vòng tròn kỹ năng
indexHtml = indexHtml.replaceAll('text-[9px]', 'text-xs');
indexHtml = indexHtml.replaceAll('text-[9.5px]', 'text-xs');
indexHtml = indexHtml.replaceAll('text-[10px]', 'text-xs');

fs.writeFileSync(indexPath, indexHtml, 'utf8');
console.log('Finished updating index.html!');
