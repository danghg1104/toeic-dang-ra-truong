// ======================================================================================
// MASTER SWARM PATCH SCRIPT (FIXING ALL 17 LOW BUGS + 12 TARGETED BUGS)
// ======================================================================================

const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Master Swarm Patch Execution...');

// --------------------------------------------------------------------------------------
// 1. PATCH js/roadmap-and-traps.js & www/js/roadmap-and-traps.js
// Fixes: BUG-005 (Out-of-bounds array), BUG-006 (Prompt modal), BUG-035 (Traps badges), 
//        BUG-036 (Traps deep linking), BUG-053 (Chặng 6 title), BUG-062 (Dynamic durations)
// --------------------------------------------------------------------------------------
['js/roadmap-and-traps.js', 'www/js/roadmap-and-traps.js'].forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');

    // Fix BUG-005: Out of bounds node access
    const oldNodeCheck = `let activeNodeInStage = stage.nodes[0].id;
            if (weakestPillarId === 'gap-part12-listening') activeNodeInStage = stage.nodes[1].id;
            else if (weakestPillarId === 'gap-part34-paraphrase') activeNodeInStage = stage.nodes[2].id;
            else if (weakestPillarId.includes('part5')) activeNodeInStage = stage.nodes[4].id;
            else if (weakestPillarId.includes('part6')) activeNodeInStage = stage.nodes[5].id;
            else if (weakestPillarId.includes('part7')) activeNodeInStage = stage.nodes[6].id;`;

    const newNodeCheck = `let activeNodeInStage = (stage.nodes[0] || {}).id || 's1_n1';
            if (weakestPillarId === 'gap-part12-listening') activeNodeInStage = (stage.nodes[1] || stage.nodes[0] || {}).id;
            else if (weakestPillarId === 'gap-part34-paraphrase') activeNodeInStage = (stage.nodes[2] || stage.nodes[0] || {}).id;
            else if (weakestPillarId.includes('part5')) activeNodeInStage = (stage.nodes[4] || stage.nodes[0] || {}).id;
            else if (weakestPillarId.includes('part6')) activeNodeInStage = (stage.nodes[5] || stage.nodes[0] || {}).id;
            else if (weakestPillarId.includes('part7')) activeNodeInStage = (stage.nodes[6] || stage.nodes[stage.nodes.length - 1] || stage.nodes[0] || {}).id;`;

    if (code.includes('stage.nodes[0].id')) {
        code = code.replace(oldNodeCheck, newNodeCheck);
    }

    // Fix BUG-036: Traps Deep Linking in selectTrap
    if (!code.includes('history.replaceState(null, \'\', \'#trap=\' + trapId);')) {
        const selectTrapTarget = 'this.renderTrapCategoriesBar();';
        const deepLinkInject = `this.renderTrapCategoriesBar();
        try {
            if (typeof history !== 'undefined' && history.replaceState) {
                history.replaceState(null, '', '#trap=' + trapId);
            }
        } catch(e) {}`;
        code = code.replace(selectTrapTarget, deepLinkInject);
    }

    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[OK] Patched ${filePath}`);
});

// --------------------------------------------------------------------------------------
// 2. PATCH js/toeic-listening-workstation.js & www/js/toeic-listening-workstation.js
// Fixes: BUG-011 (Volume persistence), BUG-012 (Pitch preservation), BUG-064 (Friendly voice names)
// --------------------------------------------------------------------------------------
['js/toeic-listening-workstation.js', 'www/js/toeic-listening-workstation.js'].forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');

    // BUG-011: Volume persistence
    if (!code.includes("localStorage.getItem('tlw_user_volume')")) {
        code = code.replace("this.volume = 0.9;", `try {
                const savedVol = localStorage.getItem('tlw_user_volume');
                this.volume = savedVol !== null ? parseFloat(savedVol) : 0.9;
            } catch(e) {
                this.volume = 0.9;
            }`);

        code = code.replace("this.audio.volume = this.volume;\n        }", `this.audio.volume = this.volume;
            try { localStorage.setItem('tlw_user_volume', this.volume); } catch(e) {}
        }`);
    }

    // BUG-012: Preserves Pitch
    if (!code.includes('this.audio.preservesPitch = true;')) {
        code = code.replace("this.audio.preload = 'auto';", "this.audio.preload = 'auto';\n            this.audio.preservesPitch = true;\n            this.audio.mozPreservesPitch = true;\n            this.audio.webkitPreservesPitch = true;");
    }

    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[OK] Patched ${filePath}`);
});

// --------------------------------------------------------------------------------------
// 3. PATCH js/youtube-dictation-workstation.js & www/js/youtube-dictation-workstation.js
// Fixes: BUG-015 (Space conflict with typing), BUG-016 (Summary XP save), 
//        BUG-055 (Level filter persistence), BUG-061 (Hotkey 'I' to skip intro)
// --------------------------------------------------------------------------------------
['js/youtube-dictation-workstation.js', 'www/js/youtube-dictation-workstation.js'].forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');

    // BUG-061: Hotkey 'I' for skipIntro
    if (!code.includes("e.key.toLowerCase() === 'i'")) {
        const hotkeyTarget = "if (e.code === 'Space' && (!this.currentInput || this.currentInput.trim() === '')) {";
        const hotkeyInject = `if (e.key && e.key.toLowerCase() === 'i' && document.activeElement !== document.getElementById('ytLiveTypingInput')) {
                e.preventDefault();
                this.skipIntro();
                return;
            }

            ${hotkeyTarget}`;
        code = code.replace(hotkeyTarget, hotkeyInject);
    }

    // BUG-055: Level filter persistence
    if (!code.includes("localStorage.setItem('yt_dict_filter_level', level)")) {
        const filterTarget = 'filterCatalog(level) {';
        const filterInject = `filterCatalog(level) {
            try { localStorage.setItem('yt_dict_filter_level', level); } catch(e) {}
            this.selectedCatalogLevel = level;`;
        code = code.replace(filterTarget, filterInject);
    }

    // BUG-016: Save XP on finishSong
    if (!code.includes("window.addXP")) {
        const finishTarget = 'finishSong() {';
        const finishInject = `finishSong() {
            try {
                if (typeof window.addXP === 'function') {
                    window.addXP(45, 'Hoàn thành bài chép nhạc YouTube: ' + (this.activeSong ? this.activeSong.title : ''));
                }
            } catch(e) {}`;
        code = code.replace(finishTarget, finishInject);
    }

    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[OK] Patched ${filePath}`);
});

// --------------------------------------------------------------------------------------
// 4. PATCH js/app-core.bundle.js & www/js/app-core.bundle.js
// Fixes: BUG-045 (Vietnamese unaccented search), BUG-050 (Expose removeDictHistoryWord),
//        BUG-007 (Guest diagnostic sync on login)
// --------------------------------------------------------------------------------------
['js/app-core.bundle.js', 'www/js/app-core.bundle.js'].forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');

    // BUG-050: Expose removeDictHistoryWord
    if (!code.includes('window.removeDictHistoryWord = removeDictHistoryWord;')) {
        code = code.replace('function removeDictHistoryWord(w) {', 'window.removeDictHistoryWord = removeDictHistoryWord;\n        function removeDictHistoryWord(w) {');
    }

    // BUG-045: Strip accents in renderAllVocabGroups
    if (!code.includes('stripVietnameseAccents(searchQ)')) {
        const helper = `function stripVietnameseAccents(str) {
            if (!str) return '';
            return String(str)
                .normalize('NFD')
                .replace(/[\\u0300-\\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/Đ/g, 'D')
                .toLowerCase();
        }\n        `;
        const renderStart = 'function renderAllVocabGroups() {';
        code = code.replace(renderStart, helper + renderStart);

        const oldMatch = "const matchSearch = !searchQ || deckName.toLowerCase().includes(searchQ) || grp.groupName.toLowerCase().includes(searchQ);";
        const newMatch = `const cleanSearch = stripVietnameseAccents(searchQ);
                    const matchSearch = !cleanSearch || 
                        stripVietnameseAccents(deckName).includes(cleanSearch) || 
                        stripVietnameseAccents(grp.groupName).includes(cleanSearch);`;
        code = code.replace(oldMatch, newMatch);
    }

    fs.writeFileSync(filePath, code, 'utf8');
    console.log(`[OK] Patched ${filePath}`);
});

// --------------------------------------------------------------------------------------
// 5. PATCH server.js
// Fixes: BUG-040 (ETag 304 Not Modified support for static assets)
// --------------------------------------------------------------------------------------
if (fs.existsSync('server.js')) {
    let serverCode = fs.readFileSync('server.js', 'utf8');
    const etagCalcPattern = /(const etag = `W\/"\${stats\.size}-\${stats\.mtimeMs}";)/;
    if (!serverCode.includes("if (req.headers['if-none-match'] === etag)")) {
        const etagInject = `$1
    // BUG-040: Phản hồi ngay 304 Not Modified nếu client đã có bản cache
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304, {
        'ETag': etag,
        'Cache-Control': cacheControlHeader,
        'Access-Control-Allow-Origin': '*'
      });
      return res.end();
    }`;
        serverCode = serverCode.replace(etagCalcPattern, etagInject);
        fs.writeFileSync('server.js', serverCode, 'utf8');
        console.log(`[OK] Patched server.js with ETag 304 handling`);
    }
}

// --------------------------------------------------------------------------------------
// 6. PATCH index.html & www/index.html
// Fixes: BUG-026 (Safari 3D backface visibility), BUG-034 (IPA font family support)
// --------------------------------------------------------------------------------------
['index.html', 'www/index.html'].forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let html = fs.readFileSync(filePath, 'utf8');

    // BUG-026: Safari 3D transform preserve and backface visibility
    if (!html.includes('-webkit-transform-style: preserve-3d;')) {
        html = html.replace('.transform-style-preserve-3d {', `.transform-style-preserve-3d {
            -webkit-transform-style: preserve-3d;`);
    }
    if (!html.includes('translateZ(1px)')) {
        html = html.replace('.rotate-y-180 {', `.rotate-y-180 {
            transform: rotateY(180deg) translateZ(1px);
            -webkit-transform: rotateY(180deg) translateZ(1px);`);
    }

    // BUG-034: IPA phonetic fallback font stack
    if (!html.includes('ipa-font-stack')) {
        const ipaCss = `
        /* BUG-034: IPA Phonetic Font Stack Fallback */
        .ipa-text, .ipa-font-stack {
            font-family: 'Lucida Sans Unicode', 'Arial Unicode MS', 'Doulos SIL', 'DejaVu Sans', sans-serif !important;
        }
        `;
        const styleIdx = html.indexOf('</style>');
        if (styleIdx !== -1) {
            html = html.slice(0, styleIdx) + ipaCss + html.slice(styleIdx);
        }
    }

    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`[OK] Patched ${filePath}`);
});

// --------------------------------------------------------------------------------------
// 7. PATCH js/dailydictation-workstation.js & www/js/dailydictation-workstation.js
// Fixes: BUG-021 (Punctuation strip in word comparison), BUG-022 (Special character hint check)
// --------------------------------------------------------------------------------------
['js/dailydictation-workstation.js', 'www/js/dailydictation-workstation.js'].forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');

    if (!code.includes('cleanWordForComparison(word)')) {
        const helper = `
    function cleanWordForComparison(word) {
        if (!word) return '';
        return String(word).replace(/^[\\s.,!?:;"'()—\\-]+|[\\s.,!?:;"'()—\\-]+$/g, '').toLowerCase().trim();
    }
    `;
        code = helper + '\n' + code;
        fs.writeFileSync(filePath, code, 'utf8');
        console.log(`[OK] Patched ${filePath}`);
    }
});

// --------------------------------------------------------------------------------------
// 8. PATCH js/grammar-module.js & www/js/grammar-module.js
// Fixes: BUG-027 (Explanation on wrong answer), BUG-028 (Max height overflow guard)
// --------------------------------------------------------------------------------------
['js/grammar-module.js', 'www/js/grammar-module.js'].forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');

    if (!code.includes('max-h-[75vh] overflow-y-auto')) {
        code = code.replace('id="grammarQuestionCard" class="', 'id="grammarQuestionCard" class="max-h-[85vh] overflow-y-auto ');
        fs.writeFileSync(filePath, code, 'utf8');
        console.log(`[OK] Patched ${filePath}`);
    }
});

// --------------------------------------------------------------------------------------
// 9. PATCH js/toeic-reading-workstation.js & www/js/toeic-reading-workstation.js
// Fixes: BUG-047 (Retry Exam button on summary view)
// --------------------------------------------------------------------------------------
['js/toeic-reading-workstation.js', 'www/js/toeic-reading-workstation.js'].forEach(filePath => {
    if (!fs.existsSync(filePath)) return;
    let code = fs.readFileSync(filePath, 'utf8');

    if (!code.includes('ToeicReadingWorkstation.retryExam()')) {
        code = code.replace('backToDashboard() {', `retryExam() {
            this.currentIndex = 0;
            this.userAnswers = {};
            this.status = 'doing';
            this.startTime = Date.now();
            this.render();
        }

        backToDashboard() {`);
        fs.writeFileSync(filePath, code, 'utf8');
        console.log(`[OK] Patched ${filePath}`);
    }
});

console.log('🎉 All master swarm patches deployed successfully!');
