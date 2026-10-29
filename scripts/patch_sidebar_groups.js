const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const oldNavPattern = /<nav class="space-y-1">[\s\S]*?<\/nav>/;

const newNavHTML = `<nav class="space-y-3" id="sidebarNav">
                        <!-- NHÓM 1: HÔM NAY -->
                        <div class="space-y-0.5">
                            <div class="px-3 pt-1 pb-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sidebar-text">
                                Hôm nay
                            </div>
                            <button onclick="switchTab('hom-nay')" id="nav-hom-nay" class="nav-item nav-active-home w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-house text-[14px] w-5 text-center text-blue-600 dark:text-blue-400"></i>
                                <span class="sidebar-text">Tổng quan</span>
                            </button>
                            <button onclick="switchTab('lo-trinh')" id="nav-lo-trinh" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-map-location-dot text-[14px] w-5 text-center text-emerald-600 dark:text-emerald-400"></i>
                                <span class="sidebar-text">Lộ trình cá nhân</span>
                                <span id="urgentRushBadge" class="hidden ml-auto px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10.5px] font-bold">GẤP</span>
                            </button>
                        </div>

                        <!-- NHÓM 2: LUYỆN TẬP KỸ NĂNG -->
                        <div class="space-y-0.5">
                            <div class="px-3 pt-1.5 pb-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sidebar-text">
                                Luyện tập kỹ năng
                            </div>
                            <button onclick="switchTab('nghe')" id="nav-nghe" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-headphones text-[14px] w-5 text-center text-teal-600 dark:text-teal-400"></i>
                                <span class="sidebar-text">Luyện Nghe (Listening)</span>
                            </button>
                            <button onclick="switchTab('doc')" id="nav-doc" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-regular fa-file-lines text-[14px] w-5 text-center text-green-600 dark:text-green-400"></i>
                                <span class="sidebar-text">Luyện Đọc (Reading)</span>
                            </button>
                            <button onclick="switchTab('ngu-phap')" id="nav-ngu-phap" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-book-open text-[14px] w-5 text-center text-purple-600 dark:text-purple-400"></i>
                                <span class="sidebar-text">Ngữ pháp trọng tâm</span>
                            </button>
                            <button onclick="switchTab('tu-vung')" id="nav-tu-vung" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-spell-check text-[14px] w-5 text-center text-amber-600 dark:text-amber-400"></i>
                                <span class="sidebar-text">Kho Từ vựng cốt lõi</span>
                            </button>
                            <button onclick="switchTab('hoc-tu-vung')" id="nav-hoc-tu-vung" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-gamepad text-[14px] w-5 text-center text-indigo-600 dark:text-indigo-400"></i>
                                <span class="sidebar-text">Đấu trường Từ vựng</span>
                            </button>
                        </div>

                        <!-- NHÓM 3: KIỂM TRA & BẪY ĐỀ -->
                        <div class="space-y-0.5">
                            <div class="px-3 pt-1.5 pb-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sidebar-text">
                                Kiểm tra & Đề thi
                            </div>
                            <button onclick="switchTab('thi-thu')" id="nav-thi-thu" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-bolt text-[14px] w-5 text-center text-amber-500"></i>
                                <span class="sidebar-text">Thi thử Full Test ETS</span>
                            </button>
                            <button onclick="switchTab('bay-de-thi')" id="nav-bay-de-thi" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-triangle-exclamation text-[14px] w-5 text-center text-rose-500"></i>
                                <span class="sidebar-text">Bộ bẫy đề kinh điển</span>
                            </button>
                        </div>

                        <!-- NHÓM 4: CÔNG CỤ HỖ TRỢ -->
                        <div class="space-y-0.5">
                            <div class="px-3 pt-1.5 pb-1 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider sidebar-text">
                                Công cụ hỗ trợ
                            </div>
                            <button onclick="switchTab('boc-bang-audio')" id="nav-boc-bang-audio" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-file-audio text-[14px] w-5 text-center text-teal-600 dark:text-teal-400"></i>
                                <span class="sidebar-text">Trạm Bóc băng file nghe</span>
                            </button>
                            <button onclick="switchTab('nghe-chinh-ta')" id="nav-nghe-chinh-ta" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-keyboard text-[14px] w-5 text-center text-indigo-600 dark:text-indigo-400"></i>
                                <span class="sidebar-text">Luyện nghe chép chính tả</span>
                            </button>
                            <button onclick="switchTab('tu-vung-phim')" id="nav-tu-vung-phim" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-clapperboard text-[14px] w-5 text-center text-rose-600 dark:text-rose-400"></i>
                                <span class="sidebar-text">Từ vựng qua video</span>
                            </button>
                            <button onclick="switchTab('take-note')" id="nav-take-note" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-book-bookmark text-[14px] w-5 text-center text-amber-600 dark:text-amber-400"></i>
                                <span class="sidebar-text">Sổ Take Note & Lưu file</span>
                            </button>
                            <button onclick="switchTab('tu-dien')" id="nav-tu-dien" class="nav-item w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-[13.5px] font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                                <i class="fa-solid fa-book-atlas text-[14px] w-5 text-center text-sky-600 dark:text-sky-400"></i>
                                <span class="sidebar-text">Từ điển Anh - Việt</span>
                            </button>
                        </div>
                    </nav>`;

if (oldNavPattern.test(content)) {
  content = content.replace(oldNavPattern, newNavHTML);
  // Also remove the old "HỌC TẬP" header above nav
  content = content.replace(/<!-- Section Label -->\s*<div class="px-2\.5 mb-2 text-\[11px\] font-bold tracking-wider text-slate-500 dark:text-slate-400 uppercase sidebar-text">\s*H.*?T.*?P\s*<\/div>/i, '');
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('✓ Đã cập nhật thành công Sidebar phân 4 nhóm rõ ràng!');
} else {
  console.error('❌ Không tìm thấy pattern nav cũ trong index.html');
}
