const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

console.log('🚀 Bắt đầu loại bỏ hoàn toàn khối redeclaration cũ trong updateDashboardMetrics...');

const sIdx = content.indexOf("// 4 Gauges Độ chính xác kỹ năng (Chuẩn Ảnh 2 - Hiển thị số liệu thật, không viết cứng số liệu ảnh)");
const eIdx = content.indexOf("// Update 4 Horizontal Progress Bars for Skill Balance (Lấy điểm chẩn đoán thông minh)", sIdx);

if (sIdx === -1 || eIdx === -1) {
  console.error('ERROR: Could not find boundaries! sIdx:', sIdx, 'eIdx:', eIdx);
  process.exit(1);
}

// Giữ lại phần tính toán số câu đúng gAnswered / gCorrect cho Ngữ pháp (vì thanh tiến độ ngữ pháp cần)
const cleanBlock = `// 1. Tính toán câu đúng / câu làm Ngữ pháp thực tế
            let gAnswered = 0;
            let gCorrect = 0;
            const currentUserId = (currentUserAccount && currentUserAccount.id) ? currentUserAccount.id : 'guest';
            try {
                for (let i = 0; i < localStorage.length; i++) {
                    const k = localStorage.key(i);
                    if (k && k.startsWith(\`grammar_progress_\${currentUserId}_\`)) {
                        const raw = localStorage.getItem(k);
                        if (raw) {
                            const parsed = JSON.parse(raw);
                            if (parsed.questionStatusMap) {
                                const vals = Object.values(parsed.questionStatusMap);
                                gAnswered += vals.length;
                                gCorrect += vals.filter(v => v === 'correct').length;
                            }
                        }
                    }
                }
            } catch (e) {}
            if (gAnswered === 0 && (state.grammarDone || 0) > 0) {
                gAnswered = state.grammarDone;
                gCorrect = state.correctAnswers || state.grammarDone;
            }

            // 2. Tính toán Từ vựng thực tế
            const vAnswered = state.vocabTotalAnswers || (vLearned > 0 ? vLearned : 0);
            const vCorrect = state.vocabCorrectAnswers || vLearned;

            `;

content = content.substring(0, sIdx) + cleanBlock + content.substring(eIdx);
fs.writeFileSync(indexPath, content, 'utf8');
console.log('SUCCESS: Removed duplicate redeclarations in updateDashboardMetrics!');
