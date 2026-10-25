const fs = require('fs');
let s = fs.readFileSync('js/ets2026-data.js', 'utf8');

const target1 = `            // Full Reading (100 câu)
            if (pStr === 'full_rc' || pStr === 'rc' || pStr === 'reading') {
                if (typeof window.startQuickQuiz === 'function') {
                    window.startQuickQuiz(\`ets2026_t\${num}_rc\`, \`ETS 2026 Test \${num} - Full Reading (100 câu)\`, 100);
                }
                return;
            }`;

const repl1 = `            // Full Reading (100 câu)
            if (pStr === 'full_rc' || pStr === 'rc' || pStr === 'reading') {
                if (window.ToeicReadingWorkstation) {
                    window.ToeicReadingWorkstation.open({
                        isEts2026: true,
                        testNum: num,
                        part: 5,
                        title: \`ETS 2026 - Test \${num} - Full Reading (100 câu)\`
                    });
                } else if (typeof window.startQuickQuiz === 'function') {
                    window.startQuickQuiz(\`ets2026_t\${num}_rc\`, \`ETS 2026 Test \${num} - Full Reading (100 câu)\`, 100);
                }
                return;
            }`;

const target2 = `            } else if (p >= 5 && p <= 7) {
                if (typeof window.startQuickQuiz === 'function') {
                    const count = p === 5 ? 30 : p === 6 ? 16 : 54;
                    window.startQuickQuiz(\`ets2026_t\${num}_p\${p}\`, \`ETS 2026 Test \${num} - Part \${p}\`, count);
                }
            }`;

const repl2 = `            } else if (p >= 5 && p <= 7) {
                if (window.ToeicReadingWorkstation) {
                    window.ToeicReadingWorkstation.open({
                        isEts2026: true,
                        testNum: num,
                        part: p,
                        title: \`ETS 2026 - Test \${num} - Part \${p}\`
                    });
                } else if (typeof window.startQuickQuiz === 'function') {
                    const count = p === 5 ? 30 : p === 6 ? 16 : 54;
                    window.startQuickQuiz(\`ets2026_t\${num}_p\${p}\`, \`ETS 2026 Test \${num} - Part \${p}\`, count);
                }
            }`;

s = s.replace(target1.replace(/\r?\n/g, '\r\n'), repl1.replace(/\r?\n/g, '\r\n'));
s = s.replace(target2.replace(/\r?\n/g, '\r\n'), repl2.replace(/\r?\n/g, '\r\n'));
fs.writeFileSync('js/ets2026-data.js', s, 'utf8');
console.log('Successfully updated js/ets2026-data.js!');
