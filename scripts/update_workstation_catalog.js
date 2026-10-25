const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'dailydictation-workstation.js');
let content = fs.readFileSync(filePath, 'utf8');

const startMarker = '        // =========================================================================\n        // VIEW 1: CATALOG / TEST LIST (Ảnh 1, 2, 3)\n        // =========================================================================';
const endMarker = '        // =========================================================================\n        // VIEW 2: EXERCISE WORKSTATION (Ảnh 4)\n        // =========================================================================';

const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.error('Markers not found! start:', startIndex, 'end:', endIndex);
    process.exit(1);
}

const newCatalogSection = `        // =========================================================================
        // VIEW 1: CATALOG / TEST LIST (Ảnh 1, 2, 3)
        // =========================================================================
        renderCatalog() {
            const catView = document.getElementById('ddwCatalogView');
            if (!catView) return;

            const summary = window.DailyDictationDatabase ? window.DailyDictationDatabase.getSummary() : [];

            // Chuẩn hóa bộ lọc (Hỗ trợ cả 'Level A2', 'A2', 'All levels', v.v.)
            const cleanFilter = (this.filterLevel || 'All').replace(/^Level\s*/i, '').trim().toUpperCase();
            const q = (this.filterSearch || '').trim().toLowerCase();
            const isFiltering = (cleanFilter !== 'ALL' && cleanFilter !== '') || q !== '';

            // Đếm số lượng bài theo từng level trên toàn bộ 600 bài
            const globalLevelCounts = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 };
            summary.forEach(t => {
                t.lessons.forEach(l => {
                    const lLevel = (l.vocabLevel || 'B1').replace(/^Level\s*/i, '').trim().toUpperCase();
                    if (globalLevelCounts[lLevel] !== undefined) globalLevelCounts[lLevel]++;
                });
            });

            // Lọc theo search và level
            const filteredTests = summary.map(test => {
                const matchesLessons = test.lessons.filter(l => {
                    const cleanVocab = (l.vocabLevel || '').replace(/^Level\s*/i, '').trim().toUpperCase();
                    const matchLevel = cleanFilter === 'ALL' || cleanFilter === '' || cleanVocab === cleanFilter;

                    const matchSearch = !q || 
                        l.name.toLowerCase().includes(q) || 
                        l.topic.toLowerCase().includes(q) ||
                        cleanVocab.toLowerCase() === q ||
                        ('level ' + cleanVocab.toLowerCase()).includes(q) ||
                        test.title.toLowerCase().includes(q) ||
                        ('test ' + test.testNum).toLowerCase().includes(q) ||
                        (l.slug && l.slug.toLowerCase().includes(q));

                    return matchSearch && matchLevel;
                });
                return {
                    ...test,
                    filteredLessons: matchesLessons
                };
            }).filter(t => t.filteredLessons.length > 0);

            // Tự động mở tất cả accordion khớp khi người dùng đang tìm kiếm hoặc lọc level
            if (isFiltering) {
                filteredTests.forEach(t => this.openAccordions.add(t.testNum));
            }

            // Đếm tổng số bài khớp
            const totalMatches = filteredTests.reduce((acc, t) => acc + t.filteredLessons.length, 0);

            let html = \`
                <!-- Breadcrumb -->
                <nav class="text-xs font-semibold text-slate-400 dark:text-slate-500 mb-2">
                    <span class="hover:text-indigo-600 cursor-pointer">All topics</span>
                    <span class="mx-1.5">/</span>
                    <span class="text-slate-700 dark:text-slate-200">TOEIC Listening</span>
                </nav>

                <!-- Totoro Moonlight Listening Mascot Card (Ảnh 3: Totoro Ocarina Moonlight) -->
                <div class="rounded-3xl p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-xl flex flex-col sm:flex-row items-center gap-4 sm:gap-5 mb-4 overflow-hidden relative">
                    <div class="w-20 sm:w-24 aspect-[219/286] shrink-0 rounded-2xl overflow-hidden border border-indigo-400/40 shadow-lg relative bg-slate-800">
                        <img src="assets/mascot/totoro_listening_card.png" alt="Totoro Thổi Sáo Dưới Trăng (Ảnh 3)" class="w-full h-full object-cover filter brightness-105 hover:scale-105 transition-transform duration-300">
                    </div>
                    <div class="space-y-1 text-center sm:text-left flex-1 min-w-0">
                        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                            <span class="px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 text-[10px] font-black uppercase tracking-wider border border-indigo-400/30">Góc Luyện Nghe Studio Ghibli</span>
                            <span class="text-xs text-amber-300 font-bold">🌙 Totoro Thổi Sáo Dưới Ánh Trăng</span>
                        </div>
                        <h3 class="text-base sm:text-lg font-black text-white tracking-tight">
                            Luyện Đôi Tai Tinh Tường — Bắt Trọn Từng Âm Điệu & Nối Âm TOEIC
                        </h3>
                        <p class="text-xs text-slate-300 leading-relaxed">
                            Lắng nghe êm dịu, kiên trì chép chính tả mỗi ngày 15 phút cùng Totoro giúp bạn phản xạ tự nhiên với tốc độ nói thực tế của người bản xứ và xóa bỏ hoàn toàn nỗi sợ Part 1-4!
                        </p>
                    </div>
                </div>

                <!-- Top Header & Filter Bar (Chuẩn Ảnh 1, 2, 3) -->
                <div class="pb-3 border-b border-slate-200/80 dark:border-slate-800 space-y-3">
                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                TOEIC Listening
                            </h1>
                            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                                Luyện nghe chép chính tả chuẩn 30 Đề ETS & BestMyTest · 600 bài nghe đa giọng bản xứ (US, UK, AU, CA)
                            </p>
                        </div>

                        <!-- Search & Filter Controls -->
                        <div class="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                            <div class="relative">
                                <input type="text" id="ddwSearchInput" value="\${this.filterSearch}" placeholder="Tìm bài nghe, chủ đề..." 
                                    oninput="DailyDictationWorkstation.onSearchInput(this.value)"
                                    onkeydown="if(event.key==='Enter') DailyDictationWorkstation.applyFilters()"
                                    class="w-40 sm:w-56 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 shadow-2xs">
                            </div>
                            <select id="ddwLevelSelect" onchange="DailyDictationWorkstation.onLevelSelect(this.value)" 
                                class="px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 shadow-2xs">
                                <option value="All" \${cleanFilter === 'ALL' || cleanFilter === '' ? 'selected' : ''}>All levels (\${summary.reduce((a, t) => a + t.lessons.length, 0)})</option>
                                <option value="Level A1" \${cleanFilter === 'A1' ? 'selected' : ''}>Level A1 (\${globalLevelCounts.A1})</option>
                                <option value="Level A2" \${cleanFilter === 'A2' ? 'selected' : ''}>Level A2 (\${globalLevelCounts.A2})</option>
                                <option value="Level B1" \${cleanFilter === 'B1' ? 'selected' : ''}>Level B1 (\${globalLevelCounts.B1})</option>
                                <option value="Level B2" \${cleanFilter === 'B2' ? 'selected' : ''}>Level B2 (\${globalLevelCounts.B2})</option>
                                <option value="Level C1" \${cleanFilter === 'C1' ? 'selected' : ''}>Level C1 (\${globalLevelCounts.C1})</option>
                                <option value="Level C2" \${cleanFilter === 'C2' ? 'selected' : ''}>Level C2 (\${globalLevelCounts.C2})</option>
                            </select>
                            <button onclick="DailyDictationWorkstation.applyFilters()" class="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-2xs transition">
                                OK
                            </button>
                        </div>
                    </div>

                    <!-- Quick Level Filter Pills (Thanh lọc nhanh chuẩn CEFR) -->
                    <div class="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] pt-1">
                        <span class="text-xs text-slate-400 font-bold shrink-0 mr-1">
                            <i class="fa-solid fa-layer-group text-slate-400 mr-1"></i>Phân loại CEFR:
                        </span>
                        <button onclick="DailyDictationWorkstation.quickFilterLevel('All')" 
                            class="px-2.5 py-1 rounded-lg font-bold transition shrink-0 \${cleanFilter === 'ALL' || cleanFilter === '' ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}">
                            Tất cả (\${summary.reduce((a, t) => a + t.lessons.length, 0)})
                        </button>
                        <button onclick="DailyDictationWorkstation.quickFilterLevel('A1')" 
                            class="px-2.5 py-1 rounded-lg font-bold transition shrink-0 \${cleanFilter === 'A1' ? 'bg-emerald-600 text-white shadow-xs' : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800'}">
                            A1 (\${globalLevelCounts.A1})
                        </button>
                        <button onclick="DailyDictationWorkstation.quickFilterLevel('A2')" 
                            class="px-2.5 py-1 rounded-lg font-bold transition shrink-0 \${cleanFilter === 'A2' ? 'bg-teal-600 text-white shadow-xs' : 'bg-teal-50 hover:bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800'}">
                            A2 (\${globalLevelCounts.A2})
                        </button>
                        <button onclick="DailyDictationWorkstation.quickFilterLevel('B1')" 
                            class="px-2.5 py-1 rounded-lg font-bold transition shrink-0 \${cleanFilter === 'B1' ? 'bg-sky-600 text-white shadow-xs' : 'bg-sky-50 hover:bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-200/80 dark:border-sky-800'}">
                            B1 (\${globalLevelCounts.B1})
                        </button>
                        <button onclick="DailyDictationWorkstation.quickFilterLevel('B2')" 
                            class="px-2.5 py-1 rounded-lg font-bold transition shrink-0 \${cleanFilter === 'B2' ? 'bg-amber-600 text-white shadow-xs' : 'bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800'}">
                            B2 (\${globalLevelCounts.B2})
                        </button>
                        <button onclick="DailyDictationWorkstation.quickFilterLevel('C1')" 
                            class="px-2.5 py-1 rounded-lg font-bold transition shrink-0 \${cleanFilter === 'C1' ? 'bg-purple-600 text-white shadow-xs' : 'bg-purple-50 hover:bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800'}">
                            C1 (\${globalLevelCounts.C1})
                        </button>
                        <button onclick="DailyDictationWorkstation.quickFilterLevel('C2')" 
                            class="px-2.5 py-1 rounded-lg font-bold transition shrink-0 \${cleanFilter === 'C2' ? 'bg-rose-600 text-white shadow-xs' : 'bg-rose-50 hover:bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800'}">
                            C2 (\${globalLevelCounts.C2})
                        </button>
                        \${isFiltering ? \`
                            <button onclick="DailyDictationWorkstation.resetFilters()" 
                                class="px-2.5 py-1 rounded-lg font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 transition shrink-0 flex items-center gap-1">
                                <i class="fa-solid fa-xmark"></i> Xóa lọc
                            </button>
                        \` : ''}
                    </div>

                    \${isFiltering ? \`
                        <div class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2 pt-1">
                            <span>Đang hiển thị <strong>\${totalMatches}</strong> bài nghe phù hợp</span>
                            <span>•</span>
                            <span>\${filteredTests.length} Practice Tests</span>
                        </div>
                    \` : ''}
                </div>

                <!-- Practice Tests Accordion List (Chuẩn Ảnh 1, 2, 3) -->
                <div class="space-y-2.5 pt-2">
            \`;

            if (filteredTests.length === 0) {
                const searchDesc = q ? \`từ khóa "<strong>\${this.filterSearch}</strong>"\` : '';
                const levelDesc = (cleanFilter !== 'ALL' && cleanFilter !== '') ? \`cấp độ <strong>Level \${cleanFilter}</strong>\` : '';
                const combinedDesc = [searchDesc, levelDesc].filter(Boolean).join(' và ');

                html += \`
                    <div class="p-8 text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-500 text-sm">
                        <div class="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-400">
                            <i class="fa-solid fa-magnifying-glass text-lg"></i>
                        </div>
                        <p class="font-medium text-slate-700 dark:text-slate-300">
                            Không tìm thấy bài nghe nào phù hợp với \${combinedDesc || 'bộ lọc hiện tại'}.
                        </p>
                        <p class="text-xs text-slate-400 mt-1">
                            Hãy thử tìm với từ khóa khác hoặc xóa bộ lọc để hiển thị toàn bộ 600 bài nghe.
                        </p>
                        <button onclick="DailyDictationWorkstation.resetFilters()" class="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition">
                            <i class="fa-solid fa-rotate-left"></i> Xem tất cả bài nghe
                        </button>
                    </div>
                \`;
            } else {
                filteredTests.forEach(test => {
                    const isOpen = this.openAccordions.has(test.testNum);
                    html += \`
                        <div class="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 transition-all shadow-2xs">
                            <!-- Accordion Header -->
                            <button onclick="DailyDictationWorkstation.toggleAccordion(\${test.testNum})" 
                                class="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between text-left transition \${isOpen ? 'bg-sky-50/70 dark:bg-slate-800/80 border-b border-sky-100 dark:border-slate-800' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'}">
                                <div class="flex items-center gap-2">
                                    <span class="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                                        Practice Test \${test.testNum}
                                    </span>
                                    <span class="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                        (\${test.filteredLessons.length} lessons\${test.filteredLessons.length !== test.lessons.length ? \` / \${test.lessons.length}\` : ''})
                                    </span>
                                </div>
                                <span class="text-slate-400 text-sm transition-transform duration-200 \${isOpen ? 'rotate-180 text-sky-600' : ''}">
                                    <i class="fa-solid fa-chevron-down"></i>
                                </span>
                            </button>

                            <!-- Accordion Body: 3-column Grid (Ảnh 3) -->
                            <div class="\${isOpen ? 'block' : 'hidden'} p-3 sm:p-4 bg-slate-50/50 dark:bg-slate-950/40">
                                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    \${test.filteredLessons.map((lesson, idx) => {
                                        const lvl = (lesson.vocabLevel || 'B1').replace(/^Level\\s*/i, '').trim().toUpperCase();
                                        let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
                                        if (lvl === 'A1') {
                                            badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
                                        } else if (lvl === 'A2') {
                                            badgeClass = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800';
                                        } else if (lvl === 'B1') {
                                            badgeClass = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800';
                                        } else if (lvl === 'B2') {
                                            badgeClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
                                        } else if (lvl === 'C1') {
                                            badgeClass = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
                                        } else if (lvl === 'C2') {
                                            badgeClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
                                        }

                                        return \`
                                            <div onclick="DailyDictationWorkstation.openLesson(\${test.testNum}, '\${lesson.slug}')" 
                                                class="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200/90 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-600 hover:shadow-md transition cursor-pointer group flex items-start justify-between">
                                                <div class="space-y-1">
                                                    <div class="font-bold text-sm text-indigo-700 dark:text-indigo-400 group-hover:text-indigo-600 transition flex items-center gap-1.5">
                                                        <span>\${lesson.name}</span>
                                                    </div>
                                                    <div class="text-xs font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                                                        \${lesson.topic}
                                                    </div>
                                                    <div class="text-[11px] text-slate-400 flex items-center gap-1.5 flex-wrap">
                                                        <span>\${lesson.partsCount} parts</span>
                                                        <span>•</span>
                                                        <span class="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border \${badgeClass}">
                                                            Level \${lvl}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="text-slate-300 group-hover:text-indigo-500 transition pt-1">
                                                    <i class="fa-solid fa-circle-play text-lg"></i>
                                                </div>
                                            </div>
                                        \`;
                                    }).join('')}
                                </div>
                            </div>
                        </div>
                    \`;
                });
            }

            html += \`
                </div>

                <!-- Footer Apps / Branding like DailyDictation -->
                <div class="pt-8 pb-4 flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-200/60 dark:border-slate-800 gap-3">
                    <div>
                        Bản quyền bài nghe thuộc <strong>BestMyTest.com & ETS</strong> · Tích hợp chuyên sâu trên <strong>Cùng Đăng Ra Trường</strong>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10.5px]">
                            ✓ 30 Đề (600 Bài học: A1 · A2 · B1 · B2 · C1 · C2) sẵn sàng
                        </span>
                    </div>
                </div>
            \`;

            catView.innerHTML = html;
        }

        toggleAccordion(testNum) {
            if (this.openAccordions.has(testNum)) {
                this.openAccordions.delete(testNum);
            } else {
                this.openAccordions.add(testNum);
            }
            this.renderCatalog();
        }

        onSearchInput(val) {
            this.filterSearch = val;
            clearTimeout(this._searchDebounce);
            this._searchDebounce = setTimeout(() => {
                this.renderCatalog();
            }, 300);
        }

        onLevelSelect(val) {
            this.filterLevel = val;
            this.applyFilters();
        }

        quickFilterLevel(lvl) {
            this.filterLevel = lvl === 'All' ? 'All' : ('Level ' + lvl);
            this.applyFilters();
        }

        applyFilters() {
            const searchInput = document.getElementById('ddwSearchInput');
            if (searchInput) this.filterSearch = searchInput.value.trim();
            const levelSelect = document.getElementById('ddwLevelSelect');
            if (levelSelect) this.filterLevel = levelSelect.value;
            this.renderCatalog();
        }

        resetFilters() {
            this.filterSearch = '';
            this.filterLevel = 'All';
            this.renderCatalog();
        }

`;

content = content.slice(0, startIndex) + newCatalogSection + content.slice(endIndex);

// Also update line 630 in exercise header to show nice level badge
content = content.replace(
    `<span class="text-xs font-bold text-slate-500 dark:text-slate-400">\n                        Vocab level: \${lesson.vocabLevel.replace('Level ', '')}\n                    </span>`,
    `\${(() => {
        const lvl = (lesson.vocabLevel || 'B1').replace(/^Level\\s*/i, '').trim().toUpperCase();
        let badgeClass = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300';
        if (lvl === 'A1') badgeClass = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
        else if (lvl === 'A2') badgeClass = 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800';
        else if (lvl === 'B1') badgeClass = 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800';
        else if (lvl === 'B2') badgeClass = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
        else if (lvl === 'C1') badgeClass = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
        else if (lvl === 'C2') badgeClass = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
        return \`<span class="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold border \${badgeClass}">Level \${lvl}</span>\`;
    })()}`
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated js/dailydictation-workstation.js!');
