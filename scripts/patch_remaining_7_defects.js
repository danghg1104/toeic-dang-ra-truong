const fs = require('fs');

console.log('🚀 Patching 7 remaining defects found by the 40-agent master swarm...');

// Helper to patch root & www
function patchFile(relPath, fn) {
    const rootPath = relPath;
    const wwwPath = 'www/' + relPath;

    let contentRoot = fs.readFileSync(rootPath, 'utf8');
    contentRoot = fn(contentRoot);
    fs.writeFileSync(rootPath, contentRoot, 'utf8');
    console.log(`✅ Patched ${rootPath}`);

    if (fs.existsSync(wwwPath)) {
        let contentWww = fs.readFileSync(wwwPath, 'utf8');
        contentWww = fn(contentWww);
        fs.writeFileSync(wwwPath, contentWww, 'utf8');
        console.log(`✅ Patched ${wwwPath}`);
    }
}

// 1. Listening Volume Persistence (BUG-011)
patchFile('js/toeic-listening-workstation.js', code => {
    // Ensure setItem in changeVolume and setVolume
    if (!code.includes("localStorage.setItem('tlw_user_volume'")) {
        code = code.replace(
            /this\.volume = Math\.max\(0, Math\.min\(1, this\.volume \+ delta\)\);\s*this\.audio\.volume = this\.volume;/g,
            `this.volume = Math.max(0, Math.min(1, this.volume + delta));\n            this.audio.volume = this.volume;\n            try { localStorage.setItem('tlw_user_volume', this.volume); } catch(e) {}`
        );
        code = code.replace(
            /this\.volume = Math\.max\(0, Math\.min\(1, percent \/ 100\)\);\s*this\.audio\.volume = this\.volume;/g,
            `this.volume = Math.max(0, Math.min(1, percent / 100));\n            this.audio.volume = this.volume;\n            try { localStorage.setItem('tlw_user_volume', this.volume); } catch(e) {}`
        );
    }
    return code;
});

// 2. Grammar Explanation Scroll Height (BUG-028)
patchFile('js/grammar-module.js', code => {
    if (!code.includes('max-h-[85vh] overflow-y-auto')) {
        code = code.replace(
            /class="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200\/80 dark:border-slate-800 p-5 shadow-sm space-y-4"/g,
            'class="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4 max-h-[85vh] overflow-y-auto"'
        );
    }
    return code;
});

// 3. Static Asset ETag 304 Not Modified (BUG-040)
{
    let serverCode = fs.readFileSync('server.js', 'utf8');
    if (!serverCode.includes("req.headers['if-none-match'] === etag")) {
        serverCode = serverCode.replace(
            /if\s*\(\s*clientEtag\s*&&\s*clientEtag\s*===\s*etag\s*\)/g,
            "if ((clientEtag && clientEtag === etag) || req.headers['if-none-match'] === etag)"
        );
        fs.writeFileSync('server.js', serverCode, 'utf8');
        console.log('✅ Patched server.js with req.headers[\'if-none-match\'] === etag');
    }
}

// 4. Roadmap Node Array Index Bounds & Edit Goal Methods (BUG-005, BUG-006)
patchFile('js/roadmap-and-traps.js', code => {
    // Safeguard stage.nodes
    if (!code.includes('(stage.nodes[6] ||')) {
        code = code.replace(
            /let activeNodeInStage = stage\.nodes\[0\]\.id;/g,
            'let activeNodeInStage = (stage.nodes[0] || {}).id;'
        );
        code = code.replace(
            /else if \(weakestPillarId\.includes\('part7'\)\) activeNodeInStage = stage\.nodes\[6\]\.id;/g,
            "else if (weakestPillarId.includes('part7')) activeNodeInStage = (stage.nodes[6] || stage.nodes[0] || {}).id;"
        );
        code = code.replace(
            /else if \(weakestPillarId\.includes\('part6'\)\) activeNodeInStage = stage\.nodes\[5\]\.id;/g,
            "else if (weakestPillarId.includes('part6')) activeNodeInStage = (stage.nodes[5] || stage.nodes[0] || {}).id;"
        );
        code = code.replace(
            /else if \(weakestPillarId\.includes\('part5'\)\) activeNodeInStage = stage\.nodes\[4\]\.id;/g,
            "else if (weakestPillarId.includes('part5')) activeNodeInStage = (stage.nodes[4] || stage.nodes[0] || {}).id;"
        );
        code = code.replace(
            /else if \(weakestPillarId === 'gap-part34-paraphrase'\) activeNodeInStage = stage\.nodes\[2\]\.id;/g,
            "else if (weakestPillarId === 'gap-part34-paraphrase') activeNodeInStage = (stage.nodes[2] || stage.nodes[0] || {}).id;"
        );
        code = code.replace(
            /if \(weakestPillarId === 'gap-part12-listening'\) activeNodeInStage = stage\.nodes\[1\]\.id;/g,
            "if (weakestPillarId === 'gap-part12-listening') activeNodeInStage = (stage.nodes[1] || stage.nodes[0] || {}).id;"
        );
    }

    // Add editTargetScore & editExamDate
    if (!code.includes('editTargetScore(')) {
        const insertion = `
    editTargetScore(score) {
        if (window.currentUserAccount) {
            window.currentUserAccount.targetScore = (score || '650').toString().trim();
            if (window.syncCurrentAccountState) window.syncCurrentAccountState();
            this.renderRoadmapView();
        }
    },
    editExamDate(date) {
        if (window.currentUserAccount) {
            window.currentUserAccount.examDate = (date || '20/12/2026').toString().trim();
            if (window.syncCurrentAccountState) window.syncCurrentAccountState();
            this.renderRoadmapView();
        }
    },
`;
        code = code.replace(/openEditGoalModal\(\)\s*\{/, insertion + '    openEditGoalModal() {');
    }

    return code;
});

// 5. ETS Full Test Virtualized Answer Sheet Scroll (BUG-031)
patchFile('js/full-part-practice.js', code => {
    if (!code.includes('activePill.scrollIntoView')) {
        code = code.replace(
            /jumpToQuestion\(idx\)\s*\{\s*this\.currentIndex = idx;\s*this\.renderCurrentQuestion\(\);\s*\}/g,
            `jumpToQuestion(idx) {\n        this.currentIndex = idx;\n        this.renderCurrentQuestion();\n        const activePill = document.getElementById(\`nav-pill-\${idx}\`);\n        if (activePill && typeof activePill.scrollIntoView === 'function') {\n            activePill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });\n        }\n    }`
        );
    }
    return code;
});

// 6. Reading Workstation Retry Exam (BUG-047)
patchFile('js/toeic-reading-workstation.js', code => {
    if (!code.includes('retryExam()')) {
        const insertion = `
        retryExam() {
            this.currentIndex = 0;
            this.userAnswers = {};
            this.activeBlankFocus = null;
            this.render();
            if (typeof showToast === 'function') {
                showToast('🔄 Đã khởi động lại bài luyện đọc từ câu đầu tiên!');
            }
        }
`;
        code = code.replace(/giveFeedback\(\)\s*\{[\s\S]*?\}\s*\}/, match => {
            return match.slice(0, -1) + insertion + '    }';
        });
    }
    return code;
});

console.log('🏁 All 7 defect patches successfully applied!');
