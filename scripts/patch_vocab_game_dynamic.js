const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'js', 'vocab-game-workstation.js');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Update generateVocab
const genMarker = 'async generateVocab(useAI = true) {';
const genEndMarker = 'loadSampleVocab() {';

const genIdx = code.indexOf(genMarker);
const genEndIdx = code.indexOf(genEndMarker);

if (genIdx === -1 || genEndIdx === -1) {
    console.error('generateVocab markers not found!');
    process.exit(1);
}

const newGenFunction = `async generateVocab(useAI = true) {
            const topicInput = document.getElementById('vgTopicInput');
            if (topicInput && topicInput.value.trim()) {
                this.selectedTopic = topicInput.value.trim();
            }

            // Nếu người dùng chọn "Chơi nhanh với bộ từ mẫu có sẵn" (useAI = false)
            if (!useAI) {
                this.loadSampleVocab();
                this.activeView = 'preview';
                this.renderInto();
                return;
            }

            const btn = document.getElementById('vgGenerateBtn');
            const originalHTML = btn ? btn.innerHTML : '';
            if (btn) {
                btn.disabled = true;
                btn.innerHTML = \`
                    <span class="inline-block animate-spin mr-2"><i class="fa-solid fa-spinner"></i></span>
                    <span>Đang tạo bộ từ vựng \${escapeHtml(this.selectedTopic)} (A1-C2)...</span>
                \`;
            }

            try {
                // ƯU TIÊN 1: DYNAMIC TOPIC VOCAB ENGINE (Datamuse 250 từ + Phân loại CEFR + Google GTX + FreeDict IPA)
                if (window.DynamicTopicVocabEngine && typeof window.DynamicTopicVocabEngine.generateDynamicVocab === 'function') {
                    const dynamicWords = await window.DynamicTopicVocabEngine.generateDynamicVocab(
                        this.selectedTopic,
                        this.selectedLevel,
                        this.selectedCount
                    );

                    if (Array.isArray(dynamicWords) && dynamicWords.length > 0) {
                        this.wordList = dynamicWords;
                        this.wordList.forEach(item => this.sessionUsedWords.add(item.word.toLowerCase()));
                        this.activeView = 'preview';
                        this.renderInto();
                        return;
                    }
                }

                // ƯU TIÊN 2: AI BACKEND API NẾU CÓ
                const response = await fetch('/api/ai/generate-vocab', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        topic: this.selectedTopic,
                        level: this.selectedLevel,
                        count: this.selectedCount,
                        excludeWords: Array.from(this.sessionUsedWords || [])
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    const returnedWords = (data && (data.words || data.vocabList)) || [];
                    if (Array.isArray(returnedWords) && returnedWords.length > 0) {
                        const needed = Math.min(Math.max(parseInt(this.selectedCount, 10) || 10, 1), 50);
                        const freshList = returnedWords.filter(item => !this.sessionUsedWords.has(item.word.toLowerCase()));
                        const pool = freshList.length >= needed ? freshList : returnedWords;
                        this.wordList = pool.slice(0, needed);
                        this.wordList.forEach(item => this.sessionUsedWords.add(item.word.toLowerCase()));
                        this.activeView = 'preview';
                        this.renderInto();
                        return;
                    }
                }

                throw new Error('Fallback to curated topic bank');
            } catch (err) {
                console.warn('⚡ Using instant curated fallback vocabulary pool:', err.message);
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

        `;

code = code.substring(0, genIdx) + newGenFunction + code.substring(genEndIdx);

// 2. Update speakWord for US & UK audio support
const speakMarker = 'speakWord(word) {';
const speakIdx = code.indexOf(speakMarker);
if (speakIdx !== -1) {
    const speakEndMarker = '// =========================================================================\r\n        // TỰ ĐỘNG LƯU VÀO SỔ TAY TỪ VỰNG TRONG PHẦN "TỪ VỰNG"';
    const altEndMarker = '// =========================================================================\n        // TỰ ĐỘNG LƯU VÀO SỔ TAY TỪ VỰNG TRONG PHẦN "TỪ VỰNG"';
    let speakEndIdx = code.indexOf(speakEndMarker, speakIdx);
    if (speakEndIdx === -1) speakEndIdx = code.indexOf(altEndMarker, speakIdx);

    if (speakEndIdx !== -1) {
        const newSpeak = `speakWord(word, lang = 'en-US') {
            if (!word) return;
            const clean = word.trim();
            const accent = (lang === 'en-GB' || lang === 'UK') ? 'UK' : 'US';
            const effLang = accent === 'UK' ? 'en-GB' : 'en-US';

            // Ưu tiên 1: AudioService nếu có nguồn phát âm chuẩn
            if (window.AudioService && typeof window.AudioService.speakWord === 'function') {
                window.AudioService.speakWord(clean, accent);
                return;
            }

            // Ưu tiên 2: Web Speech API chuẩn giọng US / UK
            if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(clean);
                utter.lang = effLang;
                utter.rate = 0.9;
                utter.pitch = 1.0;
                window.speechSynthesis.speak(utter);
                return;
            }

            const audio = new Audio(\`/api/tts?text=\${encodeURIComponent(clean)}&accent=\${accent}&lang=\${effLang}\`);
            audio.play().catch(() => {});
        }

        `;
        code = code.substring(0, speakIdx) + newSpeak + code.substring(speakEndIdx);
    }
}

fs.writeFileSync(targetPath, code, 'utf8');
console.log('✅ Successfully patched VocabGameWorkstation in js/vocab-game-workstation.js!');
