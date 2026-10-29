const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

console.log('🚀 Đang sửa triệt để logic thanh Cân bằng 4 kỹ năng (Zero-state = 0%, rõ nghĩa chính xác)...');

// 1. Sửa phụ đề của Thẻ Cân bằng 4 kỹ năng
content = content.replace(
  '<p class="text-xs text-slate-500 dark:text-slate-400">Độ hoàn thiện theo ngân hàng câu hỏi chuẩn ETS</p>',
  '<p class="text-xs text-slate-500 dark:text-slate-400">Tỷ lệ chính xác & Đánh giá năng lực theo chuẩn ETS</p>'
);

// 2. Thay thế toàn bộ khối tính toán của 4 thanh kỹ năng trong updateDashboardMetrics
const sIdx = content.indexOf("// Update 4 Horizontal Progress Bars for Skill Balance");
const eIdx = content.indexOf("if (typeof updateDashboardStudioHero === 'function')", sIdx);

if (sIdx === -1 || eIdx === -1) {
  console.error('ERROR: Không tìm thấy vị trí khối 4 thanh kỹ năng! sIdx:', sIdx, 'eIdx:', eIdx);
  process.exit(1);
}

const cleanSkillBarsLogic = `// Update 4 Horizontal Progress Bars for Skill Balance (Logic chuẩn Senior Tech Lead)
            const diag = (currentUserAccount && currentUserAccount.diagnosticResults) ? currentUserAccount.diagnosticResults : null;

            // 1. Luyện Nghe (Listening)
            const lProg = document.getElementById('skillAccuracyListenProgress');
            const lPct = document.getElementById('skillAccuracyListenPct');
            const lCount = document.getElementById('skillAccuracyListenCount');
            let listenPct = 0;
            if (diag && diag.listening) {
                listenPct = Math.min(100, Math.max(0, Math.round((diag.listening / 495) * 100)));
                if (lPct) lPct.textContent = \`\${listenPct}%\`;
                if (lCount) lCount.textContent = \`\${diag.listening}/495 điểm ETS\`;
            } else if (state.listenTotalAnswers && state.listenTotalAnswers > 0) {
                const correct = state.listenCorrectAnswers || 0;
                const total = state.listenTotalAnswers;
                listenPct = Math.min(100, Math.max(0, Math.round((correct / total) * 100)));
                if (lPct) lPct.textContent = \`\${listenPct}%\`;
                if (lCount) lCount.textContent = \`\${correct}/\${total} câu đúng\`;
            } else if (lDone > 0) {
                listenPct = 100;
                if (lPct) lPct.textContent = '100%';
                if (lCount) lCount.textContent = \`\${lDone}/\${lDone} câu đúng\`;
            } else {
                if (lPct) lPct.textContent = '--%';
                if (lCount) lCount.textContent = 'Chưa làm bài';
                listenPct = 0;
            }
            if (lProg) lProg.style.width = \`\${listenPct}%\`;

            // 2. Luyện Đọc (Reading)
            const rProg = document.getElementById('skillAccuracyReadProgress');
            const rPct = document.getElementById('skillAccuracyReadPct');
            const rCount = document.getElementById('skillAccuracyReadCount');
            let readPct = 0;
            if (diag && diag.reading) {
                readPct = Math.min(100, Math.max(0, Math.round((diag.reading / 495) * 100)));
                if (rPct) rPct.textContent = \`\${readPct}%\`;
                if (rCount) rCount.textContent = \`\${diag.reading}/495 điểm ETS\`;
            } else if (state.readTotalAnswers && state.readTotalAnswers > 0) {
                const correct = state.readCorrectAnswers || 0;
                const total = state.readTotalAnswers;
                readPct = Math.min(100, Math.max(0, Math.round((correct / total) * 100)));
                if (rPct) rPct.textContent = \`\${readPct}%\`;
                if (rCount) rCount.textContent = \`\${correct}/\${total} câu đúng\`;
            } else if (rDone > 0) {
                readPct = 100;
                if (rPct) rPct.textContent = '100%';
                if (rCount) rCount.textContent = \`\${rDone}/\${rDone} câu đúng\`;
            } else {
                if (rPct) rPct.textContent = '--%';
                if (rCount) rCount.textContent = 'Chưa làm bài';
                readPct = 0;
            }
            if (rProg) rProg.style.width = \`\${readPct}%\`;

            // 3. Ngữ pháp trọng tâm (Grammar)
            const gProg = document.getElementById('skillAccuracyGrammarProgress');
            const gPct = document.getElementById('skillAccuracyGrammarPct');
            const gCount = document.getElementById('skillAccuracyGrammarCount');
            let grammarPct = 0;
            if (gAnswered > 0) {
                const safeCorrect = Math.min(gCorrect, gAnswered);
                grammarPct = Math.min(100, Math.max(0, Math.round((safeCorrect / gAnswered) * 100)));
                if (gPct) gPct.textContent = \`\${grammarPct}%\`;
                if (gCount) gCount.textContent = \`\${safeCorrect}/\${gAnswered} câu đúng\`;
            } else if (diag && diag.reading) {
                grammarPct = Math.min(100, Math.max(0, Math.round((diag.reading / 495) * 100)));
                if (gPct) gPct.textContent = \`\${grammarPct}%\`;
                if (gCount) gCount.textContent = \`Ước lượng \${grammarPct}%\`;
            } else {
                if (gPct) gPct.textContent = '--%';
                if (gCount) gCount.textContent = 'Chưa làm bài';
                grammarPct = 0;
            }
            if (gProg) gProg.style.width = \`\${grammarPct}%\`;

            // 4. Kho Từ vựng cốt lõi (Vocabulary)
            const vProg = document.getElementById('skillAccuracyVocabProgress');
            const vPct = document.getElementById('skillAccuracyVocabPct');
            const vCount = document.getElementById('skillAccuracyVocabCount');
            let vocabPct = 0;
            if (vAnswered > 0) {
                const safeVCorrect = Math.min(vCorrect, vAnswered);
                vocabPct = Math.min(100, Math.max(0, Math.round((safeVCorrect / vAnswered) * 100)));
                if (vPct) vPct.textContent = \`\${vocabPct}%\`;
                if (vCount) vCount.textContent = \`\${safeVCorrect}/\${vAnswered} từ đúng\`;
            } else if (vLearned > 0) {
                vocabPct = Math.min(100, Math.max(0, Math.round((vLearned / 50) * 100)));
                if (vPct) vPct.textContent = \`\${vocabPct}%\`;
                if (vCount) vCount.textContent = \`\${vLearned} từ đã thuộc\`;
            } else if (diag && diag.totalScore) {
                vocabPct = Math.min(100, Math.max(0, Math.round((diag.totalScore / 990) * 100)));
                if (vPct) vPct.textContent = \`\${vocabPct}%\`;
                if (vCount) vCount.textContent = 'Chuẩn B1 (CEFR)';
            } else {
                if (vPct) vPct.textContent = '--%';
                if (vCount) vCount.textContent = 'Chưa học từ nào';
                vocabPct = 0;
            }
            if (vProg) vProg.style.width = \`\${vocabPct}%\`;

            `;

content = content.substring(0, sIdx) + cleanSkillBarsLogic + content.substring(eIdx);
fs.writeFileSync(indexPath, content, 'utf8');
console.log('SUCCESS: Đã chuẩn hóa 100% logic thanh kỹ năng! Zero-state là 0%, số liệu rõ ràng minh bạch.');
