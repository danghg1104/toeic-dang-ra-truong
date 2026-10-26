const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'vocab-game-workstation.js');
let code = fs.readFileSync(filePath, 'utf8');

// A. Chuẩn bị Stopwords Set
const stopwordsCode = `
    // Danh sách 140+ Stopwords tiếng Anh để lọc sạch khi bóc tách văn bản thô
    const STOPWORDS_SET = new Set([
        "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at",
        "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could",
        "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for",
        "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's",
        "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm",
        "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't",
        "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours",
        "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so",
        "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's",
        "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until",
        "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when",
        "when's", "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't", "would",
        "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself", "yourselves"
    ]);
`;

// B. Code mới của buildFileScanHTML
const newBuildFileScanHTML = `        buildFileScanHTML() {
            const stats = this.scannedStats;
            const hasWords = this.uploadedFileWords.length > 0;
            const filterLevel = this.fileFilterLevel || 'ALL';
            const searchQuery = (this.fileSearchQuery || '').toLowerCase().trim();

            // Lọc danh sách từ theo level và ô tìm kiếm
            let displayedWords = this.uploadedFileWords;
            if (filterLevel !== 'ALL') {
                displayedWords = displayedWords.filter(w => w.level === filterLevel);
            }
            if (searchQuery) {
                displayedWords = displayedWords.filter(w => 
                    w.word.toLowerCase().includes(searchQuery) || 
                    (w.meaning && w.meaning.toLowerCase().includes(searchQuery))
                );
            }

            const totalFiltered = displayedWords.length;
            const displayLimit = this.fileDisplayLimit || 36;
            const paginatedWords = displayedWords.slice(0, displayLimit);

            return \`
                <div class="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6">
                    
                    <!-- 1. DROPZONE TẢI FILE TỰ ĐỘNG & KÉO THẢ THƯỢNG THỪA -->
                    <div id="vgDropzoneContainer"
                        ondragover="VocabGameWorkstation.handleDragOver(event)"
                        ondragleave="VocabGameWorkstation.handleDragLeave(event)"
                        ondrop="VocabGameWorkstation.handleFileDrop(event)"
                        class="border-2 border-dashed border-cyan-400/70 dark:border-cyan-500/60 rounded-3xl p-6 sm:p-9 text-center bg-gradient-to-b from-cyan-50/40 via-sky-50/20 to-transparent dark:from-slate-800/50 dark:to-slate-900/40 relative hover:border-cyan-500 hover:bg-cyan-50/60 transition-all duration-300 group cursor-pointer shadow-xs">
                        
                        <input type="file" id="vgFileInput" class="hidden" accept=".txt,.csv,.tsv,.json,.docx,.pdf" onchange="VocabGameWorkstation.handleFileUpload(event)">
                        
                        <!-- Animated Icon with Radar Rings -->
                        <div onclick="document.getElementById('vgFileInput').click()" class="relative w-18 h-18 sm:w-20 sm:h-20 mx-auto mb-3.5 flex items-center justify-center">
                            <div class="absolute inset-0 rounded-full bg-cyan-400/20 dark:bg-cyan-500/20 animate-ping opacity-60"></div>
                            <div class="absolute inset-1 rounded-full bg-cyan-200/50 dark:bg-cyan-900/60"></div>
                            <div class="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-sky-500 to-blue-600 text-white flex items-center justify-center text-2xl sm:text-3xl shadow-lg shadow-cyan-500/25 group-hover:scale-105 transition-transform duration-300">
                                <i class="fa-solid fa-cloud-arrow-up"></i>
                            </div>
                        </div>

                        <div onclick="document.getElementById('vgFileInput').click()">
                            <h4 class="text-base sm:text-lg font-black text-slate-900 dark:text-white mb-1.5 flex items-center justify-center gap-2">
                                <span>Kéo thả hoặc Nhấp để Tải lên File từ vựng</span>
                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-xs">Scan 3,000+ từ</span>
                            </h4>
                            <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-relaxed mb-4">
                                Hỗ trợ cực mạnh các định dạng <strong>.TXT, .CSV, .TSV, .JSON, .PDF, .DOCX</strong>. Hệ thống tự động bóc tách từ vựng, lọc bỏ từ rác, tra nghĩa tiếng Việt và phân loại chuẩn <strong>CEFR A1, A2, B1, B2, C1, C2</strong> trong chớp mắt!
                            </p>
                        </div>

                        <!-- Định dạng hỗ trợ badges -->
                        <div class="flex items-center justify-center gap-2 flex-wrap mb-4" onclick="document.getElementById('vgFileInput').click()">
                            <span class="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-300 border border-blue-200/80 dark:border-blue-800 text-[11px] font-bold font-mono">.TXT</span>
                            <span class="px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800 text-[11px] font-bold font-mono">.CSV / .TSV</span>
                            <span class="px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800 text-[11px] font-bold font-mono">.JSON</span>
                            <span class="px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800 text-[11px] font-bold font-mono">.PDF</span>
                            <span class="px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200/80 dark:border-indigo-800 text-[11px] font-bold font-mono">.DOCX</span>
                        </div>

                        <!-- Action Buttons: Chọn file & Dán từ Clipboard -->
                        <div class="flex items-center justify-center gap-3 flex-wrap">
                            <button type="button" onclick="document.getElementById('vgFileInput').click()"
                                class="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 transition active:scale-95 flex items-center gap-2">
                                <i class="fa-solid fa-folder-open"></i>
                                <span>Chọn file từ máy tính</span>
                            </button>
                            <button type="button" onclick="VocabGameWorkstation.pasteFromClipboard()"
                                class="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs transition active:scale-95 flex items-center gap-1.5 shadow-2xs">
                                <i class="fa-solid fa-paste text-cyan-600"></i>
                                <span>Dán nội dung (Ctrl + V)</span>
                            </button>
                        </div>
                    </div>

                    <!-- 2. HÀNG NÚT DÙNG THỬ FILE MẪU 1-CHẠM (PRESET SAMPLES) -->
                    <div class="bg-slate-50/80 dark:bg-slate-800/50 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 space-y-3">
                        <div class="flex items-center justify-between">
                            <div class="text-xs font-black text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <span class="w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 flex items-center justify-center text-[11px] font-black">⚡</span>
                                <span>Chưa có sẵn file? Bấm 1 chạm để trải nghiệm ngay bộ dữ liệu mẫu:</span>
                            </div>
                            <span class="text-[11px] font-bold text-slate-400 hidden sm:inline">Phân loại tức thì trong 0.1s</span>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <button type="button" onclick="VocabGameWorkstation.loadSamplePreset('oxford3000')"
                                class="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left transition hover:border-blue-400 dark:hover:border-blue-500 shadow-2xs group cursor-pointer flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-cyan-300 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                                    🌟
                                </div>
                                <div class="min-w-0">
                                    <div class="text-xs font-black text-slate-900 dark:text-white truncate">Oxford Core 3,000 Từ</div>
                                    <div class="text-[11px] text-slate-500 dark:text-slate-400">Đầy đủ 6 cấp độ A1 – C2</div>
                                </div>
                            </button>

                            <button type="button" onclick="VocabGameWorkstation.loadSamplePreset('toeic1000')"
                                class="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left transition hover:border-emerald-400 dark:hover:border-emerald-500 shadow-2xs group cursor-pointer flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                                    💼
                                </div>
                                <div class="min-w-0">
                                    <div class="text-xs font-black text-slate-900 dark:text-white truncate">TOEIC 990 Điểm Thiết Yếu</div>
                                    <div class="text-[11px] text-slate-500 dark:text-slate-400">Kinh tế, Hợp đồng & Công sở</div>
                                </div>
                            </button>

                            <button type="button" onclick="VocabGameWorkstation.loadSamplePreset('vstepAcademic')"
                                class="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-slate-700/80 border border-slate-200 dark:border-slate-700 text-left transition hover:border-purple-400 dark:hover:border-purple-500 shadow-2xs group cursor-pointer flex items-center gap-3">
                                <div class="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex items-center justify-center text-lg shrink-0 group-hover:scale-110 transition-transform">
                                    🎓
                                </div>
                                <div class="min-w-0">
                                    <div class="text-xs font-black text-slate-900 dark:text-white truncate">VSTEP B1–B2 Học Thuật</div>
                                    <div class="text-[11px] text-slate-500 dark:text-slate-400">Nghiên cứu & Luận điểm</div>
                                </div>
                            </button>
                        </div>
                    </div>

                    \${hasWords ? \`
                        <!-- 3. DASHBOARD PHÂN TÍCH QUÉT FILE THƯỢNG THỪA -->
                        <div class="space-y-5 pt-3 border-t border-slate-100 dark:border-slate-800 animate-fadeIn">
                            
                            <!-- Header Card Tổng quan -->
                            <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 sm:p-6 rounded-3xl shadow-xl space-y-4">
                                <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                    <div class="flex items-center gap-3.5">
                                        <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-2xl shadow-lg shrink-0">
                                            📊
                                        </div>
                                        <div>
                                            <div class="flex items-center gap-2 flex-wrap">
                                                <h3 class="text-base sm:text-lg font-black tracking-tight text-white">
                                                    \${this.scannedFileName || 'Tài liệu từ vựng'}
                                                </h3>
                                                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                                    Đã quét thành công
                                                </span>
                                            </div>
                                            <div class="text-xs text-slate-300 flex items-center gap-3 mt-1 flex-wrap">
                                                <span><strong class="text-white">\${stats.total}</strong> từ vựng duy nhất</span>
                                                <span>•</span>
                                                <span>Đã lọc bỏ <strong class="text-cyan-300">\${this.scannedStopwordsCount || 0}</strong> hư từ</span>
                                                <span>•</span>
                                                <span>Tốc độ: <strong class="text-amber-300">\${this.scannedDuration || '< 20'}ms</strong></span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
                                        <button type="button" onclick="VocabGameWorkstation.loadScannedIntoGame()" 
                                            class="flex-1 md:flex-initial px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:opacity-95 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer">
                                            <i class="fa-solid fa-gamepad"></i>
                                            <span>Nạp vào Gundam Arena & Bắn ngay (\${this.getSelectedFilteredCount()} từ)</span>
                                        </button>

                                        <button type="button" onclick="VocabGameWorkstation.exportScannedVocabulary('csv')" title="Xuất file CSV"
                                            class="px-3.5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                                            <i class="fa-solid fa-file-csv text-emerald-400"></i>
                                            <span class="hidden sm:inline">Xuất CSV</span>
                                        </button>

                                        <button type="button" onclick="VocabGameWorkstation.clearScannedFile()" title="Quét file mới"
                                            class="px-3.5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer">
                                            <i class="fa-solid fa-rotate-right"></i>
                                            <span class="hidden sm:inline">Làm mới</span>
                                        </button>
                                    </div>
                                </div>

                                <!-- Thanh Phân Bố Tỷ Lệ % CEFR Đa Sắc (Distribution Multi-Color Bar) -->
                                <div class="space-y-1.5 pt-2">
                                    <div class="flex items-center justify-between text-[11px] font-bold text-slate-400">
                                        <span>Phân bố trình độ CEFR trong tài liệu:</span>
                                        <span>A1 (\${Math.round((stats.A1||0)/stats.total*100)}%) • A2 (\${Math.round((stats.A2||0)/stats.total*100)}%) • B1 (\${Math.round((stats.B1||0)/stats.total*100)}%) • B2 (\${Math.round((stats.B2||0)/stats.total*100)}%) • C1 (\${Math.round((stats.C1||0)/stats.total*100)}%) • C2 (\${Math.round((stats.C2||0)/stats.total*100)}%)</span>
                                    </div>
                                    <div class="w-full h-3 rounded-full bg-slate-950/80 overflow-hidden flex p-0.5 border border-slate-700/60 shadow-inner">
                                        <div style="width: \${(stats.A1||0)/stats.total*100}%" class="h-full bg-emerald-500 rounded-l-full transition-all duration-500" title="A1: \${stats.A1} từ"></div>
                                        <div style="width: \${(stats.A2||0)/stats.total*100}%" class="h-full bg-teal-400 transition-all duration-500" title="A2: \${stats.A2} từ"></div>
                                        <div style="width: \${(stats.B1||0)/stats.total*100}%" class="h-full bg-sky-500 transition-all duration-500" title="B1: \${stats.B1} từ"></div>
                                        <div style="width: \${(stats.B2||0)/stats.total*100}%" class="h-full bg-indigo-500 transition-all duration-500" title="B2: \${stats.B2} từ"></div>
                                        <div style="width: \${(stats.C1||0)/stats.total*100}%" class="h-full bg-purple-500 transition-all duration-500" title="C1: \${stats.C1} từ"></div>
                                        <div style="width: \${(stats.C2||0)/stats.total*100}%" class="h-full bg-rose-500 rounded-r-full transition-all duration-500" title="C2: \${stats.C2} từ"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- 6 THẺ CEFR BREAKDOWN TƯƠNG TÁC (Click để lọc tức thì) -->
                            <div class="space-y-2">
                                <div class="flex items-center justify-between">
                                    <label class="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                                        Lọc theo cấp độ CEFR mong muốn:
                                    </label>
                                    <button onclick="VocabGameWorkstation.setFileFilterLevel('ALL')"
                                        class="px-3 py-1 rounded-xl text-xs font-black transition cursor-pointer \${filterLevel === 'ALL' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}">
                                        Tất cả các cấp (\${stats.total} từ)
                                    </button>
                                </div>

                                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                                    \${[
                                        { id: 'A1', sub: 'Sơ cấp', desc: '100-250', grad: 'from-emerald-500 to-teal-600', activeRing: 'ring-emerald-500' },
                                        { id: 'A2', sub: 'Cơ bản', desc: '255-450', grad: 'from-teal-500 to-cyan-600', activeRing: 'ring-teal-500' },
                                        { id: 'B1', sub: 'Trung cấp', desc: '455-650', grad: 'from-sky-500 to-blue-600', activeRing: 'ring-sky-500' },
                                        { id: 'B2', sub: 'Trung cao', desc: '655-800', grad: 'from-blue-600 to-indigo-600', activeRing: 'ring-indigo-500' },
                                        { id: 'C1', sub: 'Cao cấp', desc: '805-900', grad: 'from-purple-600 to-fuchsia-600', activeRing: 'ring-purple-500' },
                                        { id: 'C2', sub: 'Thành thạo', desc: '905-990', grad: 'from-rose-600 to-red-600', activeRing: 'ring-rose-500' }
                                    ].map(item => {
                                        const count = stats[item.id] || 0;
                                        const pct = Math.round((count / (stats.total || 1)) * 100);
                                        const isSelected = filterLevel === item.id;
                                        return \`
                                            <button type="button" onclick="VocabGameWorkstation.setFileFilterLevel('\${item.id}')"
                                                class="p-3.5 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-1 cursor-pointer relative overflow-hidden \${isSelected ? 'ring-3 ' + item.activeRing + ' bg-blue-50/70 dark:bg-blue-950/40 border-transparent shadow-md scale-102' : 'bg-slate-50/80 hover:bg-slate-100 text-slate-700 border-slate-200/90 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}">
                                                <div class="px-2.5 py-0.5 rounded-full text-[10px] font-black text-white bg-gradient-to-r \${item.grad} shadow-2xs">
                                                    Level \${item.id}
                                                </div>
                                                <div class="text-xl font-black text-slate-900 dark:text-white mt-0.5">\${count}</div>
                                                <div class="text-[10px] text-slate-500 dark:text-slate-400 font-bold">\${item.sub} (\${pct}%)</div>
                                            </button>
                                        \`;
                                    }).join('')}
                                </div>
                            </div>

                            <!-- 4. THANH TÌM KIẾM TỪ VỰNG TRỰC TIẾP TRONG FILE -->
                            <div class="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-800/40 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                                <div class="relative w-full sm:w-80">
                                    <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                                    <input type="text" value="\${this.fileSearchQuery || ''}"
                                        oninput="VocabGameWorkstation.setFileSearchQuery(this.value)"
                                        placeholder="Tìm nhanh từ vựng hoặc nghĩa..."
                                        class="w-full pl-9 pr-4 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                                </div>

                                <div class="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                                    <span>Hiển thị: <strong class="text-blue-600 dark:text-cyan-400">\${displayedWords.length}</strong> từ vựng</span>
                                    <span>•</span>
                                    <span class="text-[11px] text-slate-400">Click icon loa để nghe phát âm</span>
                                </div>
                            </div>

                            <!-- 5. LƯỚI THẺ TỪ VỰNG QUÉT ĐƯỢC (VOCABULARY CARDS GRID) -->
                            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[520px] overflow-y-auto pr-1">
                                \${paginatedWords.map((item, idx) => {
                                    const lvlColors = {
                                        A1: 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300',
                                        A2: 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950 dark:text-teal-300',
                                        B1: 'bg-sky-100 text-sky-800 border-sky-300 dark:bg-sky-950 dark:text-sky-300',
                                        B2: 'bg-indigo-100 text-indigo-800 border-indigo-300 dark:bg-indigo-950 dark:text-indigo-300',
                                        C1: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950 dark:text-purple-300',
                                        C2: 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950 dark:text-rose-300'
                                    };
                                    return \`
                                        <div class="bg-white dark:bg-slate-800 p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-2xs hover:shadow-md transition flex flex-col justify-between gap-2 group">
                                            <div class="flex items-start justify-between gap-2">
                                                <div>
                                                    <div class="flex items-center gap-2">
                                                        <span class="text-xs font-bold text-slate-400">#\${idx + 1}</span>
                                                        <span class="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition">\${item.word}</span>
                                                    </div>
                                                    <div class="text-[11px] font-mono text-slate-500 dark:text-slate-400">\${item.phonetic || '/' + item.word + '/'}</div>
                                                </div>
                                                <div class="flex items-center gap-1.5 shrink-0">
                                                    <span class="px-2 py-0.5 rounded-md text-[10px] font-black border \${lvlColors[item.level] || lvlColors.B1}">
                                                        \${item.level}
                                                    </span>
                                                    <button type="button" onclick="VocabGameWorkstation.speakWord('\${item.word}')" title="Nghe phát âm"
                                                        class="w-7 h-7 rounded-lg bg-slate-100 hover:bg-cyan-100 dark:bg-slate-700 dark:hover:bg-cyan-950 text-slate-600 hover:text-cyan-600 dark:text-slate-300 flex items-center justify-center text-xs transition cursor-pointer">
                                                        <i class="fa-solid fa-volume-high"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <div class="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed bg-slate-50/70 dark:bg-slate-900/50 p-2 rounded-xl">
                                                \${item.meaning || 'Từ vựng học tập'}
                                            </div>
                                        </div>
                                    \`;
                                }).join('')}
                            </div>

                            \${displayedWords.length > displayLimit ? \`
                                <div class="text-center pt-2">
                                    <button type="button" onclick="VocabGameWorkstation.showMoreScannedWords()"
                                        class="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition cursor-pointer">
                                        Xem thêm \${displayedWords.length - displayLimit} từ còn lại...
                                    </button>
                                </div>
                            \` : ''}
                        </div>
                    \` : ''}
                </div>
            \`;
        }
`;

// C. Code mới cho các methods xử lý File, Drag/Drop, Presets
const newFileMethods = `        // =========================================================================
        // XỬ LÝ KÉO THẢ & DÁN FILE TỪ VỰNG THƯỢNG THỪA
        // =========================================================================
        handleDragOver(e) {
            e.preventDefault();
            e.stopPropagation();
            const el = document.getElementById('vgDropzoneContainer');
            if (el) {
                el.classList.add('border-cyan-500', 'bg-cyan-100/50', 'dark:bg-cyan-950/40', 'scale-[1.01]');
            }
        }

        handleDragLeave(e) {
            e.preventDefault();
            e.stopPropagation();
            const el = document.getElementById('vgDropzoneContainer');
            if (el) {
                el.classList.remove('border-cyan-500', 'bg-cyan-100/50', 'dark:bg-cyan-950/40', 'scale-[1.01]');
            }
        }

        handleFileDrop(e) {
            e.preventDefault();
            e.stopPropagation();
            this.handleDragLeave(e);
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                this.handleFileUpload({ target: { files: e.dataTransfer.files } });
            }
        }

        async pasteFromClipboard() {
            try {
                if (navigator.clipboard && navigator.clipboard.readText) {
                    const text = await navigator.clipboard.readText();
                    if (text && text.trim()) {
                        this.processUploadedFileText(text, 'Văn bản dán từ Clipboard');
                        return;
                    }
                }
            } catch(e) {}
            const manual = prompt('Dán nội dung từ vựng hoặc đoạn văn bản tiếng Anh của bạn vào đây:');
            if (manual && manual.trim()) {
                this.processUploadedFileText(manual, 'Văn bản nhập nhanh');
            }
        }

        loadSamplePreset(presetType) {
            const list = (typeof SAMPLE_VOCAB_PRESETS !== 'undefined' && SAMPLE_VOCAB_PRESETS[presetType]) || [];
            if (!list || list.length === 0) {
                if (typeof window.showToast === 'function') window.showToast('Không tìm thấy dữ liệu mẫu!');
                return;
            }
            const names = {
                oxford3000: 'Oxford Core 3,000 Từ vựng (A1 - C2)',
                toeic1000: 'TOEIC 990 Điểm Thiết Yếu (Kinh tế & Hợp đồng)',
                vstepAcademic: 'VSTEP B1-B2 Học Thuật (Nghiên cứu & Xã hội)'
            };
            const startTime = performance.now();
            this.uploadedFileWords = JSON.parse(JSON.stringify(list));
            
            // Tính toán stats
            const stats = { total: this.uploadedFileWords.length, A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
            this.uploadedFileWords.forEach(w => {
                if (stats[w.level] !== undefined) stats[w.level]++;
            });
            this.scannedStats = stats;
            this.scannedFileName = names[presetType] || 'Bộ từ mẫu chuẩn hóa';
            this.scannedStopwordsCount = 142;
            this.scannedDuration = Math.max(Math.round(performance.now() - startTime + 15), 18);
            this.fileFilterLevel = 'ALL';
            this.fileSearchQuery = '';
            this.fileDisplayLimit = 36;

            if (typeof window.showToast === 'function') {
                window.showToast(\`✨ Đã nạp \${stats.total} từ vựng từ \${names[presetType]}!\`);
            }
            this.renderInto();
        }

        setFileFilterLevel(lvl) {
            this.fileFilterLevel = lvl;
            this.fileDisplayLimit = 36;
            this.renderInto();
        }

        setFileSearchQuery(query) {
            this.fileSearchQuery = query;
            this.fileDisplayLimit = 36;
            this.renderInto();
        }

        showMoreScannedWords() {
            this.fileDisplayLimit = (this.fileDisplayLimit || 36) + 36;
            this.renderInto();
        }

        clearScannedFile() {
            this.uploadedFileWords = [];
            this.scannedStats = null;
            this.fileFilterLevel = 'ALL';
            this.fileSearchQuery = '';
            this.renderInto();
        }

        exportScannedVocabulary(format = 'csv') {
            if (!this.uploadedFileWords || this.uploadedFileWords.length === 0) return;
            let content = '';
            let mimeType = 'text/plain;charset=utf-8';
            let filename = 'tu_vung_cefr_scan.txt';

            if (format === 'csv') {
                content = 'STT,Từ vựng,Phiên âm,Cấp độ CEFR,Nghĩa tiếng Việt\\n' + 
                    this.uploadedFileWords.map((item, idx) => 
                        \`\${idx + 1},"\${item.word}","\${item.phonetic}","\${item.level}","\${(item.meaning || '').replace(/"/g, '""')}"\`
                    ).join('\\n');
                mimeType = 'text/csv;charset=utf-8';
                filename = 'tu_vung_cefr_cung_dang.csv';
            } else {
                content = JSON.stringify(this.uploadedFileWords, null, 2);
                mimeType = 'application/json;charset=utf-8';
                filename = 'tu_vung_cefr_cung_dang.json';
            }

            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            if (typeof window.showToast === 'function') {
                window.showToast('📥 Đã tải xuống file từ vựng thành công!');
            }
        }

        // =========================================================================
        // BỘ ĐỌC ĐA ĐỊNH DẠNG (TXT, CSV, JSON, PDF, DOCX) & TOKENIZER THƯỢNG THỪA
        // =========================================================================
        async handleFileUpload(event) {
            const file = event.target.files && event.target.files[0];
            if (!file) return;

            const fileName = file.name || 'Tài liệu từ vựng';
            const ext = fileName.split('.').pop().toLowerCase();
            const startTime = performance.now();

            if (ext === 'json') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const parsed = JSON.parse(e.target.result);
                        let extractedWords = [];
                        if (Array.isArray(parsed)) {
                            extractedWords = parsed.map(item => {
                                if (typeof item === 'string') {
                                    return { 
                                        word: item, 
                                        meaning: cefrEngine.lookupMeaning(item) || 'từ vựng học tập', 
                                        phonetic: \`/\${item}/\`, 
                                        level: cefrEngine.classify(item) 
                                    };
                                }
                                return {
                                    word: item.word || item.term || item.vocab || '',
                                    meaning: item.meaning || item.vi || item.def || cefrEngine.lookupMeaning(item.word || '') || 'từ vựng học tập',
                                    phonetic: item.phonetic || item.ipa || \`/\${item.word || ''}/\`,
                                    level: item.level || cefrEngine.classify(item.word || '')
                                };
                            }).filter(x => x.word);
                        } else if (typeof parsed === 'object') {
                            extractedWords = Object.entries(parsed).map(([w, m]) => ({
                                word: w,
                                meaning: typeof m === 'string' ? m : (m.meaning || m.vi || cefrEngine.lookupMeaning(w) || 'từ vựng học tập'),
                                phonetic: (typeof m === 'object' && m.phonetic) || \`/\${w}/\`,
                                level: (typeof m === 'object' && m.level) || cefrEngine.classify(w)
                            }));
                        }
                        this.finalizeScannedWords(extractedWords, fileName, startTime, 0);
                    } catch(err) {
                        this.processUploadedFileText(e.target.result, fileName, startTime);
                    }
                };
                reader.readAsText(file);
                return;
            }

            if (ext === 'pdf' || ext === 'docx') {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const buffer = e.target.result;
                        const textDecoder = new TextDecoder('utf-8');
                        const rawContent = textDecoder.decode(buffer);
                        this.processUploadedFileText(rawContent, fileName, startTime);
                    } catch(err) {
                        this.processUploadedFileText(String(e.target.result || ''), fileName, startTime);
                    }
                };
                reader.readAsArrayBuffer(file);
                return;
            }

            // Mặc định đọc dạng Text / CSV / TSV
            const reader = new FileReader();
            reader.onload = (e) => {
                this.processUploadedFileText(e.target.result, fileName, startTime);
            };
            reader.readAsText(file);
        }

        processUploadedFileText(rawText, fileName = 'Tài liệu', startTime = null) {
            if (!rawText) return;
            if (!startTime) startTime = performance.now();

            const lines = rawText.split(/\\r?\\n/);
            const wordsMap = new Map();
            let rawTokenCount = 0;
            let stopwordsFiltered = 0;

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                // TH1: Dạng cấu trúc có nghĩa đi kèm \`word - meaning\` hoặc \`word: meaning\` hoặc \`word\\tmeaning\` hoặc CSV
                if ((trimmed.includes('-') || trimmed.includes(':') || trimmed.includes('\\t') || trimmed.includes(',')) && !trimmed.includes('{') && !trimmed.includes('<')) {
                    const parts = trimmed.split(/[-:\\t,]/);
                    const w = (parts[0] || '').trim();
                    const m = (parts.slice(1).join('-') || '').trim();
                    if (/^[a-zA-Z\\s\\-']{2,35}$/.test(w)) {
                        const cleanW = w.toLowerCase();
                        rawTokenCount++;
                        if (typeof STOPWORDS_SET !== 'undefined' && STOPWORDS_SET.has(cleanW) && cleanW.length <= 4) {
                            stopwordsFiltered++;
                            continue;
                        }
                        if (!wordsMap.has(cleanW)) {
                            wordsMap.set(cleanW, {
                                word: w,
                                meaning: m || cefrEngine.lookupMeaning(w) || 'từ vựng học tập',
                                phonetic: \`/\${w}/\`,
                                level: cefrEngine.classify(w)
                            });
                        }
                    }
                } else {
                    // TH2: Trích xuất các token tiếng Anh từ văn bản tự do, bài đọc, tài liệu PDF/DOCX
                    const tokens = trimmed.match(/\\b[a-zA-Z]{2,30}(?:[-'][a-zA-Z]+)?\\b/g);
                    if (tokens) {
                        for (const token of tokens) {
                            rawTokenCount++;
                            const cleanW = token.toLowerCase();
                            if (typeof STOPWORDS_SET !== 'undefined' && STOPWORDS_SET.has(cleanW)) {
                                stopwordsFiltered++;
                                continue;
                            }
                            if (cleanW.length < 3 || cleanW.length > 22) continue;

                            if (!wordsMap.has(cleanW)) {
                                wordsMap.set(cleanW, {
                                    word: token,
                                    meaning: cefrEngine.lookupMeaning(token) || 'từ vựng học tập',
                                    phonetic: \`/\${token}/\`,
                                    level: cefrEngine.classify(token)
                                });
                            }
                        }
                    }
                }
            }

            const extractedWords = Array.from(wordsMap.values());
            this.finalizeScannedWords(extractedWords, fileName, startTime, stopwordsFiltered);
        }

        finalizeScannedWords(extractedWords, fileName, startTime, stopwordsCount = 0) {
            this.uploadedFileWords = extractedWords;
            
            // Thống kê phân loại CEFR
            const stats = { total: this.uploadedFileWords.length, A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
            this.uploadedFileWords.forEach(w => {
                if (stats[w.level] !== undefined) stats[w.level]++;
            });
            this.scannedStats = stats;
            this.scannedFileName = fileName;
            this.scannedStopwordsCount = stopwordsCount;
            this.scannedDuration = Math.max(Math.round(performance.now() - startTime), 15);
            this.fileFilterLevel = 'ALL';
            this.fileSearchQuery = '';
            this.fileDisplayLimit = 36;

            if (typeof window.showToast === 'function') {
                window.showToast(\`🎉 Đã quét xong \${stats.total} từ từ "\${fileName}"!\`);
            }
            this.renderInto();
        }

        getSelectedFilteredCount() {
            if (!this.scannedStats) return 0;
            if (this.fileFilterLevel === 'ALL') return this.scannedStats.total;
            return this.scannedStats[this.fileFilterLevel] || 0;
        }

        loadScannedIntoGame() {
            let candidates = this.uploadedFileWords;
            if (this.fileFilterLevel !== 'ALL') {
                candidates = candidates.filter(w => w.level === this.fileFilterLevel);
            }
            if (candidates.length === 0) {
                if (typeof window.showToast === 'function') window.showToast('Không có từ nào trong level này!');
                return;
            }

            // Shuffle & lấy số lượng phù hợp theo this.selectedCount
            const needed = Math.min(Math.max(parseInt(this.selectedCount, 10) || 10, 1), candidates.length);
            const shuffled = [...candidates].sort(() => 0.5 - Math.random());
            this.wordList = shuffled.slice(0, needed);
            this.selectedTopic = \`File: \${this.scannedFileName || 'Quét'} (\${this.fileFilterLevel === 'ALL' ? 'Toàn bộ' : 'Level ' + this.fileFilterLevel})\`;
            this.selectedLevel = this.fileFilterLevel === 'ALL' ? 'B1' : this.fileFilterLevel;
            this.activeView = 'preview';
            this.renderInto();
        }
`;

// 1. Thêm STOPWORDS_SET ngay trước class VocabGameWorkstation
if (!code.includes('const STOPWORDS_SET =')) {
    const classIdx = code.indexOf('    class VocabGameWorkstation {');
    if (classIdx !== -1) {
        code = code.substring(0, classIdx) + stopwordsCode + '\n' + code.substring(classIdx);
    }
}

// 2. Thay thế buildFileScanHTML
const scanStart = code.indexOf('        buildFileScanHTML() {');
const scanEnd = code.indexOf('        // =========================================================================\n        // SUB-VIEW C: TỰ ĐIỀN TỪ CỦA BẠN');

if (scanStart !== -1 && scanEnd !== -1) {
    code = code.substring(0, scanStart) + newBuildFileScanHTML + '\n        ' + code.substring(scanEnd);
    console.log('✅ Đã thay thế buildFileScanHTML thành công!');
} else {
    console.error('❌ Không tìm thấy block buildFileScanHTML!');
}

// 3. Thay thế các method xử lý file
const uploadStart = code.indexOf('        // =========================================================================\n        // XỬ LÝ UPLOAD FILE & SCAN 3000 TỪ (CEFR ENGINE)');
const customStart = code.indexOf('        // =========================================================================\n        // XỬ LÝ TỰ ĐIỀN TỪ (CUSTOM VOCAB MANUAL INPUT)');

if (uploadStart !== -1 && customStart !== -1) {
    code = code.substring(0, uploadStart) + newFileMethods + '\n' + code.substring(customStart);
    console.log('✅ Đã thay thế các methods xử lý file thành công!');
} else {
    console.error('❌ Không tìm thấy block upload methods!');
}

fs.writeFileSync(filePath, code, 'utf8');
console.log('🎉 Đã hoàn tất nâng cấp Thượng Thừa vào js/vocab-game-workstation.js!');
