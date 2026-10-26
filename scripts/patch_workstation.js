const fs = require('fs');
const path = require('path');
const { CURATED_VOCAB_TOPICS } = require('../lib/vocab-ai-service');

const filePath = path.join(__dirname, '..', 'js', 'vocab-game-workstation.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Chèn CURATED_FRONTEND_TOPIC_BANK và hàm removeVietnameseDiacritics ngay trước class VocabGameWorkstation
const bankCode = `
    // =========================================================================
    // NGÂN HÀNG 8 CHỦ ĐỀ CHUẨN CEFR A1 - C2 TÍCH HỢP SẴN OFFLINE
    // =========================================================================
    function removeVietnameseDiacritics(str) {
        if (!str) return '';
        return str.normalize('NFD')
                  .replace(/[\\u0300-\\u036f]/g, '')
                  .replace(/đ/g, 'd')
                  .replace(/Đ/g, 'D')
                  .toLowerCase()
                  .trim();
    }

    const CURATED_FRONTEND_TOPIC_BANK = ${JSON.stringify(CURATED_VOCAB_TOPICS, null, 2)};
`;

if (!content.includes('CURATED_FRONTEND_TOPIC_BANK')) {
    content = content.replace(
        'class VocabGameWorkstation {',
        bankCode + '\n    class VocabGameWorkstation {'
    );
}

// 2. Sửa default selectedTopic và selectedLevel trong constructor
content = content.replace(
    /this\.selectedTopic\s*=\s*['"][^'"]+['"];\s*this\.selectedLevel\s*=\s*['"][^'"]+['"];/,
    "this.selectedTopic = 'Công nghệ';\n            this.selectedLevel = 'A1';"
);

// 3. Sửa topics và levels trong buildConfigHTML
const targetTopicsAndLevels = `            const topics = [
                { id: 'Công nghệ', icon: '💻', label: 'Công nghệ (Technology)' },
                { id: 'Du lịch', icon: '✈️', label: 'Du lịch (Travel)' },
                { id: 'Kinh tế & Doanh nghiệp', icon: '📈', label: 'Kinh tế (Business)' },
                { id: 'Phim hoạt hình Ghibli', icon: '🌳', label: 'Thế giới Totoro & Ghibli' },
                { id: 'Phỏng vấn xin việc', icon: '💼', label: 'Phỏng vấn (Job Interview)' },
                { id: 'Giao tiếp đời sống', icon: '☕', label: 'Giao tiếp (Daily Life)' },
                { id: 'Ẩm thực & Nhà hàng', icon: '🍕', label: 'Ẩm thực (Food & Dining)' },
                { id: 'Môi trường công sở', icon: '🏢', label: 'Công sở (Workplace)' }
            ];

            const levels = [
                { id: 'A1', sub: '(Sơ cấp)', score: '100 - 250' },
                { id: 'A2', sub: '(Cơ bản)', score: '255 - 450' },
                { id: 'B1', sub: '(Trung cấp)', score: '455 - 650' },
                { id: 'B2', sub: '(Trung cao cấp)', score: '655 - 800' },
                { id: 'C1', sub: '(Cao cấp)', score: '805 - 900' },
                { id: 'C2', sub: '(Thành thạo)', score: '905 - 990' }
            ];`;

content = content.replace(/const topics = \[[\s\S]*?const counts = \[10, 20, 30, 50\];/, targetTopicsAndLevels + '\n\n            const counts = [10, 20, 30, 50];');

// 4. Sửa nút chọn trình độ CEFR để hiển thị trọn vẹn (Sơ cấp), (Cơ bản), (Trung cấp), (Trung cao cấp), (Cao cấp), (Thành thạo)
const targetLevelButton = `<button onclick="VocabGameWorkstation.selectLevel('\${l.id}')"
                                        class="p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center gap-0.5 cursor-pointer \${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-102' : 'bg-slate-50/70 hover:bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'}">
                                        <div class="text-sm font-black">\${l.id}</div>
                                        <div class="text-[11px] font-semibold opacity-90 whitespace-nowrap">\${l.sub}</div>
                                        <div class="text-[10px] opacity-75 font-medium">\${l.score}</div>
                                    </button>`;

content = content.replace(
    /<button onclick="VocabGameWorkstation\.selectLevel\('\$\{l\.id\}'\)"[\s\S]*?<\/button>/,
    targetLevelButton
);

// 5. Thêm phương thức getCuratedWordsForTopicAndLevel
const helperMethod = `
        getCuratedWordsForTopicAndLevel(topicName, level, count) {
            const normLevel = (level || 'A1').toUpperCase().replace('LEVEL ', '').trim();
            const validLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(normLevel) ? normLevel : 'A1';
            const targetCount = Math.min(Math.max(parseInt(count, 10) || 10, 5), 50);

            const clean = (topicName || '').toLowerCase().trim();
            const cleanNorm = typeof removeVietnameseDiacritics === 'function' ? removeVietnameseDiacritics(clean) : clean;

            let topicData = null;
            for (const [key, data] of Object.entries(CURATED_FRONTEND_TOPIC_BANK)) {
                if (key === clean || key === cleanNorm) {
                    topicData = data;
                    break;
                }
                for (const alias of data.aliases) {
                    const aLower = alias.toLowerCase().trim();
                    const aNorm = typeof removeVietnameseDiacritics === 'function' ? removeVietnameseDiacritics(aLower) : aLower;
                    if (clean === aLower || cleanNorm === aNorm || clean.includes(aLower) || aLower.includes(clean) || cleanNorm.includes(aNorm) || aNorm.includes(cleanNorm)) {
                        topicData = data;
                        break;
                    }
                }
                if (topicData) break;
            }

            if (!topicData) topicData = CURATED_FRONTEND_TOPIC_BANK.technology;

            let pool = (topicData.words[validLevel] || []).slice();
            if (pool.length < targetCount) {
                const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
                const curIdx = levels.indexOf(validLevel);
                const adjacent = [
                    levels[curIdx + 1],
                    levels[curIdx - 1],
                    levels[curIdx + 2],
                    levels[curIdx - 2],
                    levels[curIdx + 3],
                    levels[curIdx - 3]
                ].filter(Boolean);

                for (const adj of adjacent) {
                    if (topicData.words[adj]) {
                        pool = pool.concat(topicData.words[adj]);
                        if (pool.length >= targetCount) break;
                    }
                }
            }

            const shuffled = pool.slice().sort(() => 0.5 - Math.random());
            return shuffled.slice(0, targetCount);
        }
`;

if (!content.includes('getCuratedWordsForTopicAndLevel(')) {
    content = content.replace(
        'async generateVocab(useAI = true) {',
        helperMethod + '\n        async generateVocab(useAI = true) {'
    );
}

// 6. Sửa generateVocab và loadSampleVocab
const newGenerateAndSample = `        async generateVocab(useAI = true) {
            const topicInput = document.getElementById('vgTopicInput');
            if (topicInput && topicInput.value.trim()) {
                this.selectedTopic = topicInput.value.trim();
            }

            const btn = document.getElementById('vgGenerateBtn');
            const originalHTML = btn ? btn.innerHTML : '';
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = \`
                    <span class="inline-block animate-spin mr-2"><i class="fa-solid fa-spinner"></i></span>
                    <span>Đang tạo bộ từ vựng cho \${this.selectedTopic}...</span>
                \`;
            }

            try {
                const response = await fetch('/api/ai/generate-vocab', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        topic: this.selectedTopic,
                        level: this.selectedLevel,
                        count: this.selectedCount
                    })
                });

                if (!response.ok) {
                    throw new Error(\`Server returned HTTP \${response.status}\`);
                }

                const data = await response.json();
                const returnedWords = (data && (data.words || data.vocabList)) || [];
                if (data && data.success && Array.isArray(returnedWords) && returnedWords.length > 0) {
                    // Lọc để đảm bảo TỪ MỚI 100% trong phiên học
                    const freshList = returnedWords.filter(item => !this.sessionUsedWords.has(item.word.toLowerCase()));
                    this.wordList = freshList.length >= 5 ? freshList : returnedWords;
                    
                    // Ghi nhận vào session
                    this.wordList.forEach(item => this.sessionUsedWords.add(item.word.toLowerCase()));

                    this.activeView = 'preview';
                    this.renderInto();
                } else {
                    throw new Error('Invalid vocab response format');
                }
            } catch (err) {
                console.warn('⚡ Using instant curated fallback vocabulary pool for topic:', this.selectedTopic, 'level:', this.selectedLevel, err.message);
                this.loadSampleVocab();
                this.activeView = 'preview';
                this.renderInto();
            } finally {
                if (btn) {
                    btn.disabled = false;
                    btn.innerHTML = originalHTML;
                }
            }
        }

        loadSampleVocab() {
            this.wordList = this.getCuratedWordsForTopicAndLevel(this.selectedTopic, this.selectedLevel, this.selectedCount);
            this.wordList.forEach(item => this.sessionUsedWords.add(item.word.toLowerCase()));
        }`;

content = content.replace(
    /async generateVocab\(useAI = true\) {[\s\S]*?this\.wordList\.forEach\(item => this\.sessionUsedWords\.add\(item\.word\.toLowerCase\(\)\);\s*}/,
    newGenerateAndSample
);

// 7. Sửa Falling Card HTML trong buildGameArenaHTML: loại bỏ vgCardPhonetic, thêm speaker 18x18px, padding 6px 12px, border-radius 8px
const newFallingCardHTML = `                        <!-- Falling Word Card (Ô CHỮ RƠI GỌN GÀNG THEO CHUẨN Ô CHỮ GỐC) -->
                        <div id="vgFallingCard" 
                            class="absolute z-20 cursor-pointer select-none"
                            onclick="VocabGameWorkstation.speakWord(VocabGameWorkstation.currentWord.word)"
                            style="top: 10%; left: 50%; transform: translateX(-50%); padding: 6px 12px; border-radius: 8px; border: 1.5px dashed #f59e0b; background: rgba(26, 18, 11, 0.94); box-shadow: 0 4px 16px rgba(245, 158, 11, 0.35); display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; backdrop-filter: blur(8px);">
                            
                            <!-- Card Sound Button Top-Right (18px x 18px) -->
                            <div onclick="event.stopPropagation(); VocabGameWorkstation.speakWord(VocabGameWorkstation.currentWord.word)" 
                                title="Nghe phát âm"
                                style="position: absolute; top: -7px; right: -7px; width: 18px; height: 18px; border-radius: 9999px; background: #f59e0b; color: #1e1b4b; display: flex; align-items: center; justify-content: center; font-size: 9px; cursor: pointer; box-shadow: 0 1px 3px rgba(0,0,0,0.6); z-index: 5;">
                                <i class="fa-solid fa-volume-high"></i>
                            </div>

                            <!-- Letters Unmasking Display (Duy nhất 1 hàng: chữ cái đầu & các dấu _) -->
                            <div id="vgLettersDisplay" style="display: inline-flex; align-items: center; justify-content: center; gap: 4px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; line-height: 1;">
                                <!-- Rendered dynamically -->
                            </div>
                        </div>`;

content = content.replace(
    /<!-- Falling Word Card[\s\S]*?<\/div>\s*<\/div>\s*<!-- Cleared Word Floating Text -->/,
    newFallingCardHTML + '\n\n                        <!-- Cleared Word Floating Text -->'
);

// 8. Sửa updateFallingCardUI: không có phonetics, font-size 15px font-weight 600, single underline 10px x 2px, gap 4px, width fixed
const newUpdateFallingCardUI = `        updateFallingCardUI() {
            const lettersDiv = document.getElementById('vgLettersDisplay');
            const card = document.getElementById('vgFallingCard');
            if (!lettersDiv || !this.currentWord) return;

            const word = this.currentWord.word.toLowerCase();
            
            // Khung giữ nguyên kích thước cố định từ lúc bắt đầu rơi cho đến khi gõ xong từ đó
            // Chiều rộng = padding (24px) + viền (3px) + (word.length * 10px) + ((word.length - 1) * 4px gap)
            const fixedWidthPx = 27 + (word.length * 10) + ((word.length - 1) * 4);
            if (card) {
                card.style.width = \`\${fixedWidthPx}px\`;
                card.style.height = '32px';
                card.style.padding = '6px 12px';
                card.style.borderRadius = '8px';
                card.style.border = '1.5px dashed #f59e0b';
                card.style.background = 'rgba(26, 18, 11, 0.94)';
                card.style.boxShadow = '0 4px 16px rgba(245, 158, 11, 0.35)';
            }

            let html = '';
            for (let i = 0; i < word.length; i++) {
                if (i === 0) {
                    // Chữ cái đầu tiên: font-size 15px, font-weight 600, màu vàng sáng
                    html += \`
                        <div style="position: relative; width: 10px; height: 16px; display: inline-flex; align-items: center; justify-content: center;">
                            <span style="font-size: 15px; font-weight: 600; color: #fbbf24; line-height: 1;">\${word[0]}</span>
                        </div>
                    \`;
                } else if (i < this.typedLetters.length) {
                    // Ký tự đã gõ đúng tiếp theo: font-size 15px, font-weight 600, màu vàng sáng
                    const typedChar = this.typedLetters[i];
                    html += \`
                        <div style="position: relative; width: 10px; height: 16px; display: inline-flex; align-items: center; justify-content: center;">
                            <span style="font-size: 15px; font-weight: 600; color: #fbbf24; line-height: 1;">\${typedChar}</span>
                        </div>
                    \`;
                } else if (i === this.typedLetters.length) {
                    // Ký tự tiếp theo cần gõ:
                    const hasHint = this.isMistake && this.mistakeHint;
                    html += \`
                        <div style="position: relative; width: 10px; height: 16px; display: inline-flex; align-items: center; justify-content: center;">
                            \${hasHint ? \`
                                <span style="position: absolute; top: -14px; font-size: 11px; font-weight: 700; color: #f87171; line-height: 1; text-shadow: 0 1px 3px rgba(0,0,0,0.9);">
                                    \${this.mistakeHint}
                                </span>
                            \` : ''}
                            <span style="display: block; width: 10px; height: 2px; background: \${hasHint ? '#ef4444' : '#f59e0b'}; border-radius: 1px; \${hasHint ? 'box-shadow: 0 0 6px #ef4444;' : 'box-shadow: 0 0 4px #f59e0b;'}"></span>
                        </div>
                    \`;
                } else {
                    // Các ký tự còn lại: vạch đơn mảnh rộng 10px, cao 2px, màu amber mờ
                    html += \`
                        <div style="position: relative; width: 10px; height: 16px; display: inline-flex; align-items: center; justify-content: center;">
                            <span style="display: block; width: 10px; height: 2px; background: rgba(245, 158, 11, 0.4); border-radius: 1px;"></span>
                        </div>
                    \`;
                }
            }

            lettersDiv.innerHTML = html;

            const counter = document.getElementById('vgCurrentCounter');
            if (counter) counter.textContent = this.currentIndex + 1;

            const progress = document.getElementById('vgProgressBarFill');
            if (progress && this.wordList.length > 0) {
                const pct = Math.round(((this.currentIndex) / this.wordList.length) * 100);
                progress.style.width = \`\${Math.max(pct, 8)}%\`;
            }
        }`;

content = content.replace(
    /updateFallingCardUI\(\) {[\s\S]*?progress\.style\.width = `\${Math\.max\(pct, 8\)}%`;\s*}\s*}/,
    newUpdateFallingCardUI
);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully patched js/vocab-game-workstation.js!');
