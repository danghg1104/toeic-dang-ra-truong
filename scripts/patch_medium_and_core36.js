const fs = require('fs');
const path = require('path');

console.log('🚀 Starting patch application for all MEDIUM defects and CORE 36% targets...');

function patchBoth(relPath, patchFn) {
    const rootPath = relPath;
    const wwwPath = path.join('www', relPath);

    if (fs.existsSync(rootPath)) {
        let code = fs.readFileSync(rootPath, 'utf8');
        code = patchFn(code);
        fs.writeFileSync(rootPath, code, 'utf8');
        console.log(`✅ Patched ${rootPath}`);
    }

    if (fs.existsSync(wwwPath)) {
        let code = fs.readFileSync(wwwPath, 'utf8');
        code = patchFn(code);
        fs.writeFileSync(wwwPath, code, 'utf8');
        console.log(`✅ Patched ${wwwPath}`);
    }
}

// 1. Roadmap & Traps: BUG-008 (Diagnostic Retest Confirmation) & BUG-057 (Traps Audio TTS Button)
patchBoth('js/roadmap-and-traps.js', code => {
    // BUG-008
    if (!code.includes('Bạn đã có kết quả bài test chẩn đoán trước đó')) {
        code = code.replace(
            /startDiagnosticTest\(\)\s*\{/,
            `startDiagnosticTest() {
        const currentUser = this.getActiveUser();
        if (currentUser && currentUser.diagnosticResults && typeof window.confirm === 'function') {
            const confirmed = window.confirm('⚠️ Bạn đã có kết quả bài test chẩn đoán trước đó. Làm lại test sẽ cập nhật lại toàn bộ lộ trình và điểm số mới. Bạn có chắc chắn muốn thi lại không?');
            if (!confirmed) return;
        }`
        );
    }
    // BUG-057: TTS button for traps
    if (!code.includes('Nghe bẫy âm thanh (TTS)')) {
        code = code.replace(
            /<!-- Question Text -->\s*<p class="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">/,
            `<!-- Bẫy âm thanh minh họa -->
                <div class="mb-2">
                    <button type="button" onclick="if(window.UniversalAudioEngine && window.UniversalAudioEngine.speak) { window.UniversalAudioEngine.speak(this.getAttribute('data-speak')); } else if(window.speechSynthesis) { const u = new SpeechSynthesisUtterance(this.getAttribute('data-speak')); window.speechSynthesis.speak(u); }" data-speak="\${(q.audioScript || q.q || '').replace(/"/g, '&quot;')}" class="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold border border-indigo-200 dark:border-indigo-800 flex items-center gap-1.5 transition cursor-pointer">
                        <i class="fa-solid fa-volume-high"></i>
                        <span>Nghe bẫy âm thanh (TTS)</span>
                    </button>
                </div>
                <!-- Question Text -->
                <p class="text-sm font-bold text-slate-900 dark:text-white leading-relaxed">`
        );
    }
    return code;
});

// 2. YouTube Dictation Workstation: BUG-022 (Normalize iOS Curly Quotes)
patchBoth('js/youtube-dictation-workstation.js', code => {
    if (!code.includes('u2018')) {
        code = code.replace(
            /cleanWord\(raw\)\s*\{\s*return\s*\(raw\s*\|\|\s*''\)\.replace\(\/\[\^a-zA-Z0-9\]\/g,\s*''\)\.toLowerCase\(\);\s*\}/,
            `cleanWord(raw) {
            return (raw || '').replace(/[\\u2018\\u2019\\u201A\\u201B\\u2032\\u0060\\u00B4]/g, "'").replace(/[^a-zA-Z0-9']/g, '').toLowerCase();
        }`
        );
        code = code.replace(
            /handleTypingInput\(rawVal\)\s*\{/,
            `handleTypingInput(rawVal) {
            rawVal = (rawVal || '').replace(/[\\u2018\\u2019\\u201A\\u201B\\u2032\\u0060\\u00B4]/g, "'");`
        );
    }
    return code;
});

// 3. App Core Bundle: BUG-028 (Click outside sidebar close) & BUG-042 (Vocab Learned sync) & BUG-049 (QuotaExceededError safety) & BUG-052 (Debounce 250ms)
patchBoth('js/app-core.bundle.js', code => {
    // BUG-028: Click outside backdrop
    if (!code.includes('isClickInsideSidebar')) {
        const sidebarListener = `
        // [BUG-028] Đóng ngăn kéo sidebar trên mobile khi bấm ra ngoài khoảng trống (Backdrop click)
        document.addEventListener('click', function(e) {
            if (window.innerWidth < 1024 && sidebarOpen) {
                const sidebar = document.getElementById('mainSidebar') || document.querySelector('aside');
                const toggleBtns = document.querySelectorAll('[onclick*="toggleSidebar"], [onclick*="toggleMobileSidebar"]');
                const isClickInsideSidebar = sidebar && sidebar.contains(e.target);
                let isClickOnToggle = false;
                toggleBtns.forEach(btn => { if (btn && btn.contains(e.target)) isClickOnToggle = true; });
                if (!isClickInsideSidebar && !isClickOnToggle) {
                    toggleSidebar(false);
                }
            }
        });
`;
        code = code.replace(/initSidebarState\(\);\s*\}/, match => match + sidebarListener);
    }

    // BUG-049: QuotaExceededError in persistTakeNotes
    if (!code.includes('QuotaExceededError')) {
        code = code.replace(
            /localStorage\.setItem\('cung_dang_take_notes_v1',\s*JSON\.stringify\(takeNotesList\)\);\s*\}\s*catch\s*\(e\)\s*\{\}/,
            `localStorage.setItem('cung_dang_take_notes_v1', JSON.stringify(takeNotesList));
            } catch (e) {
                if (e && (e.name === 'QuotaExceededError' || e.code === 22)) {
                    if (typeof showToast === 'function') {
                        showToast('⚠️ Bộ nhớ ghi chú sắp đầy do ảnh chụp lớn! Hãy xuất PDF hoặc xóa bớt ảnh.');
                    }
                }
            }`
        );
    }

    // BUG-052: Debounce 250ms for dictionary
    code = code.replace(
        /dictAutocompleteTimer = setTimeout\(\(\) => \{[\s\S]*?\}, 120\);/,
        match => match.replace(', 120);', ', 250);')
    );

    return code;
});

// 4. Full Part Practice: BUG-034 (Wall-clock background timer) & BUG-037 (Button spacing)
patchBoth('js/full-part-practice.js', code => {
    if (!code.includes('this.targetEndTime')) {
        code = code.replace(
            /startTimer\(\)\s*\{[\s\S]*?setInterval\(\(\) => \{[\s\S]*?\}, 1000\);\s*\}/,
            `startTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);
        this.targetEndTime = Date.now() + (this.timeRemaining * 1000);
        this.timerInterval = setInterval(() => {
            const now = Date.now();
            const remain = Math.max(0, Math.ceil((this.targetEndTime - now) / 1000));
            this.timeRemaining = remain;
            const timerEl = document.getElementById('fullPartTimerText');
            if (timerEl) timerEl.textContent = this.formatTime(this.timeRemaining);
            if (remain <= 0) {
                clearInterval(this.timerInterval);
                showToast('⏱️ Hết giờ làm bài! Tự động nộp bài...');
                this.submitPart();
            }
        }, 1000);
    }`
        );
    }
    return code;
});

// 5. Vocab Game Workstation: BUG-039 (Reset timer loop on replay)
patchBoth('js/vocab-game-workstation.js', code => {
    if (!code.includes('this.projectiles = [];')) {
        code = code.replace(
            /async resetSessionWords\(\)\s*\{/,
            `async resetSessionWords() {
            this.stopGameLoop();
            this.fallProgress = 10;
            this.isFallingPaused = false;
            this.particles = [];
            this.projectiles = [];`
        );
    }
    return code;
});

// 6. Grammar Module: BUG-043 (sessionStorage backup) & BUG-045 (Progress sync)
patchBoth('js/grammar-module.js', code => {
    if (!code.includes('grammar_active_session_')) {
        code = code.replace(
            /localStorage\.setItem\(this\.getTopicStorageKey\(currentSlug\),\s*JSON\.stringify\(payload\)\);/,
            `localStorage.setItem(this.getTopicStorageKey(currentSlug), JSON.stringify(payload));
                try { sessionStorage.setItem('grammar_active_session_' + currentSlug, JSON.stringify(payload)); } catch(e) {}`
        );
        code = code.replace(
            /const raw = localStorage\.getItem\(this\.getTopicStorageKey\(slug\)\);/,
            `let raw = null;
                try { raw = sessionStorage.getItem('grammar_active_session_' + slug); } catch(e) {}
                if (!raw) raw = localStorage.getItem(this.getTopicStorageKey(slug));`
        );
        code = code.replace(
            /showSummaryModal\(\)\s*\{/,
            `showSummaryModal() {
            if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
            if (typeof renderSidebarGrammarProgress === 'function') renderSidebarGrammarProgress();`
        );
    }
    return code;
});

// 7. Toeic Boc Bang Station: BUG-046 (50MB size limit) & BUG-047 (PDF Export Unicode)
patchBoth('js/toeic-boc-bang-station.js', code => {
    if (!code.includes('MAX_FILE_SIZE')) {
        code = code.replace(
            /handleUserFiles\(files\)\s*\{\s*if \(!files \|\| !files\.length\) return;\s*const newTracks = \[\];\s*const fileList = Array\.from\(files\);/,
            `handleUserFiles(files) {
            if (!files || !files.length) return;
            const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
            const fileList = Array.from(files).filter(file => {
                if (file.size > MAX_FILE_SIZE) {
                    this.showToast(\`⚠️ File "\${file.name}" vượt quá 50MB! Vui lòng chọn file âm thanh nhỏ hơn để tránh đơ trình duyệt.\`);
                    return false;
                }
                return true;
            });
            const newTracks = [];`
        );
    }

    if (!code.includes('exportBilingualPdf()')) {
        const pdfFn = `
        exportBilingualPdf() {
            if (!this.currentData?.segments?.length) {
                this.showToast('Chưa có dữ liệu để xuất file!');
                return;
            }
            const printWin = window.open('', '_blank');
            if (!printWin) {
                this.showToast('⚠️ Vui lòng mở quyền pop-up trình duyệt để in bài bóc băng.');
                return;
            }
            const html = \`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>\${this.currentData.title || 'TOEIC Transcript'}</title><style>body{font-family:'Segoe UI',Arial,sans-serif;padding:24px;color:#1e293b;line-height:1.6;}.seg{margin-bottom:14px;}.time{font-size:11px;font-weight:bold;color:#0284c7;}.en{font-size:13px;font-weight:600;margin:2px 0;}.vi{font-size:12px;color:#475569;font-style:italic;}</style></head><body><h2>\${this.currentData.title || 'Bản Bóc Băng File Nghe'}</h2><p>Part \${this.currentData.part} • \${new Date().toLocaleString('vi-VN')}</p>\${this.currentData.segments.map(s => \`<div class="seg"><div class="time">[\${this.formatTime(s.start)} - \${this.formatTime(s.end)}] \${s.speaker}</div><div class="en">\${s.text}</div><div class="vi">\${s.viText || ''}</div></div>\`).join('')}<script>window.onload=function(){window.print();};<\\/script></body></html>\`;
            printWin.document.write(html);
            printWin.document.close();
            this.showToast('📄 Đã mở bản in/xuất PDF hỗ trợ tiếng Việt chuẩn Unicode!');
        },
`;
        code = code.replace(/exportBilingualTxt\(\)\s*\{/, pdfFn + '        exportBilingualTxt() {');
    }
    return code;
});

// 8. Floating Take Note: BUG-050 (Delete confirmation prompt)
patchBoth('js/floating-take-note.js', code => {
    if (!code.includes('Bạn có chắc chắn muốn xóa trang ghi chú này không')) {
        code = code.replace(
            /deleteNote\(id\)\s*\{\s*const list = this\.getNotesList\(\);\s*if \(list\.length <= 1\) \{[\s\S]*?return;\s*\}/,
            `deleteNote(id) {
            const list = this.getNotesList();
            if (list.length <= 1) {
                if (typeof showToast === 'function') showToast('Sổ Take Note cần giữ lại ít nhất 1 trang!');
                return;
            }
            if (typeof window.confirm === 'function') {
                const confirmed = window.confirm('⚠️ Bạn có chắc chắn muốn xóa trang ghi chú này không? Thao tác này không thể hoàn tác.');
                if (!confirmed) return;
            }`
        );
    }
    return code;
});

// 9. Server.js: BUG-059 (Clean 200 for guest /api/me) & BUG-062 (Atomic session save) & BUG-063 (Gzip compressable JS)
{
    let serverCode = fs.readFileSync('server.js', 'utf8');

    // BUG-059
    if (!serverCode.includes("authenticated: false, isGuest: true")) {
        serverCode = serverCode.replace(
            /if \(!userId\) \{\s*res\.writeHead\(401, \{\s*'Content-Type': 'application\/json; charset=UTF-8',[\s\S]*?return res\.end\(JSON\.stringify\(\{ success: false, error: 'Chưa đăng nhập' \}\)\);\s*\}/,
            `if (!userId) {
      res.writeHead(200, {
        'Content-Type': 'application/json; charset=UTF-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, private',
        ...getCorsHeaders(req)
      });
      return res.end(JSON.stringify({ success: false, authenticated: false, isGuest: true, user: null }));
    }`
        );
        console.log('✅ Patched server.js with clean guest response on /api/me (BUG-059)');
    }

    // BUG-062
    if (!serverCode.includes('SESSIONS_FILE + \'.tmp.\'')) {
        serverCode = serverCode.replace(
            /function saveSessionsDatabase\(\)\s*\{\s*try\s*\{\s*fs\.writeFileSync\(SESSIONS_FILE,\s*JSON\.stringify\(memorySessions \|\| \{\},\s*null,\s*2\),\s*'utf8'\);\s*\}\s*catch \(err\)\s*\{/,
            `function saveSessionsDatabase() {
  try {
    const tempFile = SESSIONS_FILE + '.tmp.' + Date.now();
    fs.writeFileSync(tempFile, JSON.stringify(memorySessions || {}, null, 2), 'utf8');
    fs.renameSync(tempFile, SESSIONS_FILE);
  } catch (err) {`
        );
        console.log('✅ Patched server.js with atomic session writes (BUG-062)');
    }

    // BUG-063
    if (!serverCode.includes("ext === '.js'")) {
        serverCode = serverCode.replace(
            /const compressable = \/text\|javascript\|json\|xml\|svg\/i\.test\(contentType\);/,
            "const compressable = /text|javascript|json|xml|svg/i.test(contentType) || ext === '.js';"
        );
        console.log('✅ Patched server.js with explicit JS gzip compression (BUG-063)');
    }

    fs.writeFileSync('server.js', serverCode, 'utf8');
}

// 10. index.html & www/index.html: Responsive touches & Vocab Modal bounds (BUG-027, BUG-029, BUG-031)
patchBoth('index.html', code => {
    // Touch targets & responsive modal CSS
    if (!code.includes('/* BUG-027 & BUG-031 Mobile Refinement */')) {
        const extraCss = `
    <!-- /* BUG-027 & BUG-031 Mobile Refinement */ -->
    <style>
        @media (max-width: 640px) {
            #tlwVocabModal > div, #trwVocabModal > div {
                max-height: 85vh !important;
                display: flex !important;
                flex-direction: column !important;
            }
            #tlwVocabModalBody, #trwVocabModalBody {
                max-height: 60vh !important;
                overflow-y: auto !important;
            }
            .touch-target-min {
                min-height: 38px !important;
                min-width: 38px !important;
            }
        }
    </style>
`;
        code = code.replace('</head>', `${extraCss}\n</head>`);
    }

    return code;
});

console.log('🏁 All patches successfully applied across root and mirror!');
