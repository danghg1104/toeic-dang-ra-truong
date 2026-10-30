const fs = require('fs');
const path = require('path');

const vocabFile = path.join(__dirname, '..', 'js', 'vocabulary-module.js');
let code = fs.readFileSync(vocabFile, 'utf8');

console.log('🚀 Đang tích hợp Touch Swipe Ergonomics & Sói Mây Companion vào js/vocabulary-module.js...');

// 1. Thêm phương thức attachTouchSwipeListener vào VocabularyEngine
const touchSwipeMethod = `
        // =========================================================================
        // TOUCH SWIPE GESTURE ERGONOMICS (VUỐT CHẠM CẢM ỨNG DI ĐỘNG & TABLET)
        // =========================================================================
        attachTouchSwipeListener() {
            const flipper = document.getElementById('flashcard3DFlipper');
            if (!flipper || flipper._touchSwipeAttached) return;
            flipper._touchSwipeAttached = true;

            let startX = 0;
            let startY = 0;
            let currentDx = 0;
            let isDragging = false;

            flipper.addEventListener('touchstart', (e) => {
                if (e.touches.length !== 1) return;
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
                currentDx = 0;
                isDragging = true;
                flipper.style.transition = 'none';
            }, { passive: true });

            flipper.addEventListener('touchmove', (e) => {
                if (!isDragging || e.touches.length !== 1) return;
                const x = e.touches[0].clientX;
                const y = e.touches[0].clientY;
                const dx = x - startX;
                const dy = y - startY;

                // Chỉ kích hoạt hiệu ứng vuốt ngang khi chuyển động ngang chiếm ưu thế
                if (Math.abs(dx) > Math.abs(dy)) {
                    currentDx = dx;
                    const tilt = dx * 0.05;
                    const baseRot = this.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
                    flipper.style.transform = \`\${baseRot} translateX(\${dx * 0.45}px) rotateZ(\${tilt}deg)\`;
                }
            }, { passive: true });

            flipper.addEventListener('touchend', () => {
                if (!isDragging) return;
                isDragging = false;
                flipper.style.transition = 'transform 0.45s cubic-bezier(0.34, 1.4, 0.64, 1)';

                const baseRot = this.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';

                if (currentDx > 75) {
                    // Vuốt sang phải -> ĐÃ THUỘC TỪ (+5 XP)
                    flipper.style.transform = \`\${baseRot} translateX(320px) rotateZ(16deg)\`;
                    setTimeout(() => {
                        this.markMastered();
                    }, 220);
                } else if (currentDx < -75) {
                    // Vuốt sang trái -> CHƯA THUỘC TỪ (CẦN ÔN LẠI)
                    flipper.style.transform = \`\${baseRot} translateX(-320px) rotateZ(-16deg)\`;
                    setTimeout(() => {
                        this.markUnmastered();
                    }, 220);
                } else {
                    // Trả về vị trí cân bằng
                    flipper.style.transform = baseRot;
                }
            });
        },
`;

// Chèn touchSwipeMethod trước flipCard()
const flipCardMarker = "        flipCard() {";
if (code.includes(flipCardMarker)) {
    code = code.replace(flipCardMarker, touchSwipeMethod + '\n' + flipCardMarker);
}

// 2. Kích hoạt attachTouchSwipeListener trong renderStudyWorkspace
const renderStudyMarker = "container.innerHTML = `";
const renderStudyEndMarker = "        renderActiveStudyTabContent(w) {";

// Tìm vị trí kết thúc gán innerHTML của renderStudyWorkspace
const sIdx = code.indexOf(renderStudyMarker);
if (sIdx !== -1) {
    const eIdx = code.indexOf(renderStudyEndMarker, sIdx);
    if (eIdx !== -1) {
        // Chèn trước renderActiveStudyTabContent
        const hookCall = `
            if (this.activeStudyTab === 'word') {
                setTimeout(() => this.attachTouchSwipeListener(), 50);
            }
        },

`;
        // Thay thế dấu đóng ngoặc nhọn của renderStudyWorkspace
        const lastBrace = code.lastIndexOf('},', eIdx);
        if (lastBrace !== -1) {
            code = code.slice(0, lastBrace) + hookCall + code.slice(eIdx);
        }
    }
}

// 3. Cập nhật markMastered và markUnmastered với SoiMayCompanion và EtsAdaptiveScorer
const oldMarkMastered = `        markMastered() {
            const w = this.currentWords[this.currentWordIndex];
            this.masteredWordsMap[w.id] = true;
            this.saveState();
            this.playFeedbackAudio(true);

            if (window.state) {
                window.state.xp = (window.state.xp || 0) + 5;
                window.state.vocabLearned = (window.state.vocabLearned || 0) + 1;
                if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
            }

            showToast(\`✨ Đã ghi nhận thuộc từ: "\${w.word}" (+5 XP)\`);
            setTimeout(() => this.nextWord(), 400);
        },

        markUnmastered() {
            const w = this.currentWords[this.currentWordIndex];
            this.masteredWordsMap[w.id] = false;
            this.saveState();
            showToast(\`Đã lưu từ "\${w.word}" vào danh sách cần luyện lại!\`);
            this.nextWord();
        },`;

const newMarkMastered = `        markMastered() {
            const w = this.currentWords[this.currentWordIndex];
            this.masteredWordsMap[w.id] = true;
            this.saveState();
            this.playFeedbackAudio(true);

            if (window.state) {
                window.state.xp = (window.state.xp || 0) + 5;
                window.state.vocabLearned = (window.state.vocabLearned || 0) + 1;
                if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
            }

            if (window.SoiMayCompanion) {
                window.SoiMayCompanion.celebrate(\`Tuyệt vời! Thuộc từ "\${w.word}" (+5 XP)!\`);
            } else if (typeof showToast === 'function') {
                showToast(\`✨ Đã ghi nhận thuộc từ: "\${w.word}" (+5 XP)\`);
            }

            if (window.EtsAdaptiveScorer && typeof window.EtsAdaptiveScorer.renderDashboardWidget === 'function') {
                window.EtsAdaptiveScorer.renderDashboardWidget();
            }

            setTimeout(() => this.nextWord(), 400);
        },

        markUnmastered() {
            const w = this.currentWords[this.currentWordIndex];
            this.masteredWordsMap[w.id] = false;
            this.saveState();

            if (window.SoiMayCompanion) {
                window.SoiMayCompanion.encourage(\`Đừng lo! Sói Mây đã note lại từ "\${w.word}" để ôn lại!\`);
            } else if (typeof showToast === 'function') {
                showToast(\`Đã lưu từ "\${w.word}" vào danh sách cần luyện lại!\`);
            }

            this.nextWord();
        },`;

// Normalize line endings
const normCode = code.replace(/\r\n/g, '\n');
const normOld = oldMarkMastered.replace(/\r\n/g, '\n');
if (normCode.includes(normOld)) {
    code = normCode.replace(normOld, newMarkMastered);
    console.log('✅ Đã kết nối SoiMayCompanion và EtsAdaptiveScorer vào markMastered/markUnmastered!');
} else {
    console.warn('⚠️ Không tìm thấy oldMarkMastered');
}

fs.writeFileSync(vocabFile, code, 'utf8');
console.log('🎉 Hoàn tất nâng cấp js/vocabulary-module.js!');
