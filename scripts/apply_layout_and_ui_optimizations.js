const fs = require('fs');

// =========================================================================
// 1. UPDATE index.html
// =========================================================================
let html = fs.readFileSync('index.html', 'utf8');

// 1.1 Scope font-ets so UI shell never shifts
const oldFontEtsCss = `        :root.font-ets body,
        html.font-ets body,
        html.font-ets .reading-text,
        html.font-ets .question-text,
        html.font-ets #heroLessonTitle,
        html.font-ets .dict-meaning {
            font-family: 'EB Garamond', 'Times New Roman', Garamond, Georgia, serif !important;
            letter-spacing: 0.01em;
        }`;

const newFontEtsCss = `        /* Phông ETS Serif chỉ áp dụng cho nội dung bài đọc, câu hỏi, đề thi và tra từ */
        html.font-ets .reading-text,
        html.font-ets .question-text,
        html.font-ets .exam-passage,
        html.font-ets .test-passage,
        html.font-ets .passage-content,
        html.font-ets .exam-question,
        html.font-ets .dict-meaning,
        html.font-ets .karaoke-text,
        html.font-ets .cheat-sheet-content,
        html.font-ets .reading-passage,
        html.font-ets .workstation-fullscreen-modal .question-stem,
        html.font-ets .workstation-fullscreen-modal .option-text {
            font-family: 'EB Garamond', 'Times New Roman', Garamond, Georgia, serif !important;
            letter-spacing: 0.01em;
            line-height: 1.6;
        }

        /* Giữ toàn bộ UI Shell (nút bấm, badge, thanh tiêu đề, menu) ổn định bằng font Sans-serif để không bao giờ bị nhảy/dời layout */
        html.font-ets button,
        html.font-ets nav,
        html.font-ets aside,
        html.font-ets #sanhTopHeaderBar,
        html.font-ets .nav-item,
        html.font-ets .sidebar-text,
        html.font-ets .btn,
        html.font-ets input,
        html.font-ets select,
        html.font-ets .badge,
        html.font-ets #heroLessonTitle,
        html.font-ets h1, html.font-ets h2, html.font-ets h3, html.font-ets h4 {
            font-family: 'Inter', 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, sans-serif !important;
            letter-spacing: -0.01em;
        }`;

if (html.includes(oldFontEtsCss)) {
    html = html.replace(oldFontEtsCss, newFontEtsCss);
    console.log('✅ Scoped font-ets in index.html to prevent layout shift');
} else {
    console.warn('⚠️ Could not find exact oldFontEtsCss');
}

// 1.2 Modal z-index rules
const oldModalCss = `        /* Workstations, Test & Practice Modals: Phải luôn có z-index tối thượng (10000) đè lên toàn bộ Header, Dashboard và Sidebar */
        #toeicDiagnosticWorkstation,
        #toeicListeningWorkstation,
        #toeicReadingWorkstation,
        #fullPartPracticeModal,
        #diagResultModal,
        #aiTutorModal,
        #vgFlashcardModal,
        .workstation-fullscreen-modal {
            z-index: 10000 !important;
        }`;

const newModalCss = `        /* Workstations, Test & Practice Modals: Phải luôn có z-index tối thượng (10000) đè lên toàn bộ Header, Dashboard và Sidebar */
        #toeicDiagnosticWorkstation,
        #toeicListeningWorkstation,
        #toeicReadingWorkstation,
        #fullPartPracticeModal,
        #diagResultModal,
        #aiTutorModal,
        #vgFlashcardModal,
        #toeicRadarAnalyticsModal,
        #toeicTrapHeatMatrixModal,
        #toeicAdaptiveTestModal,
        #toeicCapsuleStationModal,
        #tinderFlashcardModal,
        #authenticDocumentModal,
        #onePageCheatSheetModal,
        .workstation-fullscreen-modal {
            z-index: 10000 !important;
        }`;

if (html.includes(oldModalCss)) {
    html = html.replace(oldModalCss, newModalCss);
    console.log('✅ Added all modal IDs to z-index: 10000 in index.html');
}

// 1.3 Fix Tour Guide button in header to be clear and accessible
const oldTourBtn = `<button id="btnStartTourGuide" onclick="window.AppTourGuide && window.AppTourGuide.start(true)" class="w-8 h-8 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 text-sky-600 dark:text-sky-300 border border-sky-200/70 dark:border-slate-700 flex items-center justify-center transition active:scale-95 cursor-pointer" title="Hướng dẫn làm quen ứng dụng (Tour Guide)">
                            <i class="fa-solid fa-eye text-xs"></i>
                        </button>`;

const newTourBtn = `<button id="btnStartTourGuide" onclick="window.AppTourGuide && window.AppTourGuide.start(true)" class="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-sky-200/80 dark:border-slate-700 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition active:scale-95 cursor-pointer" title="Hướng dẫn làm quen ứng dụng (Tour Guide)">
                            <i class="fa-solid fa-compass text-sky-500"></i>
                            <span>Hướng dẫn</span>
                        </button>`;

if (html.includes(oldTourBtn)) {
    html = html.replace(oldTourBtn, newTourBtn);
    console.log('✅ Replaced obscure eye icon with clear "Hướng dẫn" button');
}

// 1.4 Make sidebar buttons close drawer on click
html = html.replace(
    `onclick="window.openAdaptiveTestModal && window.openAdaptiveTestModal()" id="nav-adaptive-test"`,
    `onclick="if(typeof toggleSidebar==='function')toggleSidebar(false); window.openAdaptiveTestModal && window.openAdaptiveTestModal()" id="nav-adaptive-test"`
);
html = html.replace(
    `onclick="window.openTrapHeatMatrixModal && window.openTrapHeatMatrixModal()" id="nav-trap-matrix"`,
    `onclick="if(typeof toggleSidebar==='function')toggleSidebar(false); window.openTrapHeatMatrixModal && window.openTrapHeatMatrixModal()" id="nav-trap-matrix"`
);
html = html.replace(
    `onclick="window.openRadarAnalyticsModal && window.openRadarAnalyticsModal()" id="nav-radar-analytics"`,
    `onclick="if(typeof toggleSidebar==='function')toggleSidebar(false); window.openRadarAnalyticsModal && window.openRadarAnalyticsModal()" id="nav-radar-analytics"`
);

// 1.5 Solid backdrop for radar, trap, adaptive modals
html = html.replace(
    `id="toeicRadarAnalyticsModal" class="hidden fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"`,
    `id="toeicRadarAnalyticsModal" class="hidden fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto" style="z-index: 10000 !important;"`
);
html = html.replace(
    `id="toeicTrapHeatMatrixModal" class="hidden fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"`,
    `id="toeicTrapHeatMatrixModal" class="hidden fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto" style="z-index: 10000 !important;"`
);
html = html.replace(
    `id="toeicAdaptiveTestModal" class="hidden fixed inset-0 z-[10000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto"`,
    `id="toeicAdaptiveTestModal" class="hidden fixed inset-0 bg-slate-950/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto" style="z-index: 10000 !important;"`
);

// 1.6 Modal controllers: auto close drawer and prevent background scroll
const oldRadarOpen = `            window.openRadarAnalyticsModal = function() {
                const modal = document.getElementById('toeicRadarAnalyticsModal');
                if (!modal) return;
                modal.classList.remove('hidden');`;

const newRadarOpen = `            window.openRadarAnalyticsModal = function() {
                if (typeof toggleSidebar === 'function') toggleSidebar(false);
                document.body.classList.add('overflow-hidden');
                const modal = document.getElementById('toeicRadarAnalyticsModal');
                if (!modal) return;
                modal.classList.remove('hidden');`;

if (html.includes(oldRadarOpen)) {
    html = html.replace(oldRadarOpen, newRadarOpen);
    console.log('✅ Added auto-close sidebar to openRadarAnalyticsModal');
}

const oldRadarClose = `            window.closeRadarAnalyticsModal = function() {
                const modal = document.getElementById('toeicRadarAnalyticsModal');
                if (modal) modal.classList.add('hidden');
            };`;

const newRadarClose = `            window.closeRadarAnalyticsModal = function() {
                document.body.classList.remove('overflow-hidden');
                const modal = document.getElementById('toeicRadarAnalyticsModal');
                if (modal) modal.classList.add('hidden');
            };`;

if (html.includes(oldRadarClose)) {
    html = html.replace(oldRadarClose, newRadarClose);
    console.log('✅ Added overflow-hidden cleanup to closeRadarAnalyticsModal');
}

fs.writeFileSync('index.html', html, 'utf8');
if (fs.existsSync('www/index.html')) {
    fs.writeFileSync('www/index.html', html, 'utf8');
}
console.log('✅ Synced index.html and www/index.html');

// =========================================================================
// 2. UPDATE js/toeic-diagnostic-workstation.js (Collapsible Instructions)
// =========================================================================
let diag = fs.readFileSync('js/toeic-diagnostic-workstation.js', 'utf8');

const oldDiagInstr = `                        <!-- Listening Instructions -->
                        <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                            <strong class="text-slate-900 dark:text-white block mb-1">🎧 Hướng dẫn làm bài Part 1:</strong>
                            Nghe 4 câu mô tả (A), (B), (C), (D) về bức tranh. Chọn câu mô tả CHÍNH XÁC NHẤT những gì đang diễn ra trong tranh. Bấm nút Play trên thanh audio để nghe.
                        </div>`;

const newDiagInstr = `                        <!-- Listening Instructions (Compact & Collapsible) -->
                        <details class="rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-medium group transition">
                            <summary class="p-2.5 px-3 flex items-center justify-between cursor-pointer list-none font-bold text-slate-800 dark:text-slate-200 hover:text-blue-600 select-none">
                                <span class="flex items-center gap-1.5"><i class="fa-solid fa-circle-info text-blue-500"></i> Hướng dẫn làm bài Part 1</span>
                                <i class="fa-solid fa-chevron-down text-[10px] text-slate-400 group-open:rotate-180 transition-transform"></i>
                            </summary>
                            <div class="px-3 pb-2.5 pt-0 text-[11.5px] leading-relaxed text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700/50 mt-1">
                                Nghe 4 câu mô tả (A), (B), (C), (D) về bức tranh. Chọn câu mô tả CHÍNH XÁC NHẤT những gì đang diễn ra trong tranh. Bấm nút Play trên thanh audio để nghe.
                            </div>
                        </details>`;

if (diag.includes(oldDiagInstr)) {
    diag = diag.replace(oldDiagInstr, newDiagInstr);
    fs.writeFileSync('js/toeic-diagnostic-workstation.js', diag, 'utf8');
    if (fs.existsSync('www/js/toeic-diagnostic-workstation.js')) {
        fs.writeFileSync('www/js/toeic-diagnostic-workstation.js', diag, 'utf8');
    }
    console.log('✅ Made Part 1 instructions compact and collapsible in diagnostic workstation');
}

// =========================================================================
// 3. UPDATE js/app-tour-guide.js (Refined UX, Backdrop Click & Positioning)
// =========================================================================
let tour = fs.readFileSync('js/app-tour-guide.js', 'utf8');

// Allow backdrop click to close
const oldSvgMask = `<rect width="100%" height="100%" fill="rgba(15, 23, 42, 0.78)" mask="url(#tourSpotlightHole)" />`;
const newSvgMask = `<rect width="100%" height="100%" fill="rgba(15, 23, 42, 0.78)" mask="url(#tourSpotlightHole)" style="pointer-events: auto; cursor: pointer;" onclick="window.AppTourGuide && window.AppTourGuide.end(false)" title="Bấm ra ngoài để đóng hướng dẫn" />`;

if (tour.includes(oldSvgMask)) {
    tour = tour.replace(oldSvgMask, newSvgMask);
    console.log('✅ Added click outside to dismiss in app-tour-guide.js');
}

fs.writeFileSync('js/app-tour-guide.js', tour, 'utf8');
if (fs.existsSync('www/js/app-tour-guide.js')) {
    fs.writeFileSync('www/js/app-tour-guide.js', tour, 'utf8');
}
console.log('✅ Synced app-tour-guide.js');

console.log('🎉 ALL LAYOUT AND UI OPTIMIZATIONS COMPLETED!');
