const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

console.log('🚀 Đang chuẩn hóa độ chính xác và clamp 0-100% cho 4 thanh Kỹ năng...');

const oldProgBlock = `            // 3. Ngữ pháp (Grammar)
            const gProg = document.getElementById('skillAccuracyGrammarProgress');
            const gPct = document.getElementById('skillAccuracyGrammarPct');
            const gCount = document.getElementById('skillAccuracyGrammarCount');
            let grammarPct = 0;
            if (gAnswered > 0) {
                grammarPct = Math.round((gCorrect / gAnswered) * 100);
                if (gPct) gPct.textContent = \`\${grammarPct}%\`;
                if (gCount) gCount.textContent = \`\${gAnswered}/1500 câu\`;
            } else if (diag && diag.reading) {
                grammarPct = Math.min(100, Math.round((diag.reading / 495) * 100) + 5);
                if (gPct) gPct.textContent = \`\${grammarPct}%\`;
                if (gCount) gCount.textContent = \`Ước lượng \${grammarPct}%\`;
            } else {
                if (gPct) gPct.textContent = 'Chưa test';
                if (gCount) gCount.textContent = '0/1500 câu';
            }
            if (gProg) gProg.style.width = \`\${grammarPct > 0 ? grammarPct : 8}%\`;

            // 4. Từ vựng (Vocabulary)
            const vProg = document.getElementById('skillAccuracyVocabProgress');
            const vPct = document.getElementById('skillAccuracyVocabPct');
            const vCount = document.getElementById('skillAccuracyVocabCount');
            let vocabPct = 0;
            if (vAnswered > 0) {
                vocabPct = Math.round((vCorrect / vAnswered) * 100);
                if (vPct) vPct.textContent = \`\${vocabPct}%\`;
                if (vCount) vCount.textContent = \`\${vAnswered}/4514 từ\`;
            } else if (vLearned > 0) {
                vocabPct = Math.min(100, Math.round((vLearned / 50) * 100));
                if (vPct) vPct.textContent = \`\${vocabPct}%\`;
                if (vCount) vCount.textContent = \`\${vLearned} từ đã học\`;
            } else if (diag && diag.totalScore) {
                vocabPct = Math.min(100, Math.round((diag.totalScore / 990) * 100));
                if (vPct) vPct.textContent = \`\${vocabPct}%\`;
                if (vCount) vCount.textContent = \`Chuẩn B1 (CEFR)\`;
            } else {
                if (vPct) vPct.textContent = 'Chưa học';
                if (vCount) vCount.textContent = '0/4514 từ';
            }
            if (vProg) vProg.style.width = \`\${vocabPct > 0 ? vocabPct : 8}%\`;`;

const newProgBlock = `            // 3. Ngữ pháp (Grammar)
            const gProg = document.getElementById('skillAccuracyGrammarProgress');
            const gPct = document.getElementById('skillAccuracyGrammarPct');
            const gCount = document.getElementById('skillAccuracyGrammarCount');
            let grammarPct = 0;
            if (gAnswered > 0) {
                const safeCorrect = Math.min(gCorrect, gAnswered);
                grammarPct = Math.min(100, Math.max(0, Math.round((safeCorrect / gAnswered) * 100)));
                if (gPct) gPct.textContent = \`\${grammarPct}%\`;
                if (gCount) gCount.textContent = \`\${gAnswered}/1500 câu\`;
            } else if (diag && diag.reading) {
                grammarPct = Math.min(100, Math.max(0, Math.round((diag.reading / 495) * 100) + 5));
                if (gPct) gPct.textContent = \`\${grammarPct}%\`;
                if (gCount) gCount.textContent = \`Ước lượng \${grammarPct}%\`;
            } else {
                if (gPct) gPct.textContent = 'Chưa test';
                if (gCount) gCount.textContent = '0/1500 câu';
            }
            if (gProg) gProg.style.width = \`\${grammarPct > 0 ? grammarPct : 8}%\`;

            // 4. Từ vựng (Vocabulary)
            const vProg = document.getElementById('skillAccuracyVocabProgress');
            const vPct = document.getElementById('skillAccuracyVocabPct');
            const vCount = document.getElementById('skillAccuracyVocabCount');
            let vocabPct = 0;
            if (vAnswered > 0) {
                const safeVCorrect = Math.min(vCorrect, vAnswered);
                vocabPct = Math.min(100, Math.max(0, Math.round((safeVCorrect / vAnswered) * 100)));
                if (vPct) vPct.textContent = \`\${vocabPct}%\`;
                if (vCount) vCount.textContent = \`\${vAnswered}/4514 từ\`;
            } else if (vLearned > 0) {
                vocabPct = Math.min(100, Math.max(0, Math.round((vLearned / 50) * 100)));
                if (vPct) vPct.textContent = \`\${vocabPct}%\`;
                if (vCount) vCount.textContent = \`\${vLearned} từ đã học\`;
            } else if (diag && diag.totalScore) {
                vocabPct = Math.min(100, Math.max(0, Math.round((diag.totalScore / 990) * 100)));
                if (vPct) vPct.textContent = \`\${vocabPct}%\`;
                if (vCount) vCount.textContent = \`Chuẩn B1 (CEFR)\`;
            } else {
                if (vPct) vPct.textContent = 'Chưa học';
                if (vCount) vCount.textContent = '0/4514 từ';
            }
            if (vProg) vProg.style.width = \`\${vocabPct > 0 ? vocabPct : 8}%\`;`;

if (content.includes(oldProgBlock)) {
  content = content.replace(oldProgBlock, newProgBlock);
  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('SUCCESS: Clamped and normalized grammar and vocab progress bars!');
} else {
  console.error('ERROR: Could not find oldProgBlock in index.html!');
  process.exit(1);
}
