const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'js', 'vocab-game-workstation.js');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Cập nhật Falling Card HTML
const oldCardRegex = /<!-- Falling Word Card[\s\S]*?<\/div>\s*<\/div>\s*<!-- Cleared Word Floating Text -->/;
const newCardHTML = `<!-- Falling Word Card (Ô CHỮ RƠI BỰ VỪA ĐỦ - BALANCED MEDIUM) -->
                        <div id="vgFallingCard" 
                            class="absolute z-20 cursor-pointer select-none"
                            onclick="VocabGameWorkstation.speakWord(VocabGameWorkstation.currentWord.word)"
                            style="top: 10%; left: 50%; transform: translateX(-50%); padding: 8px 16px; border-radius: 10px; border: 1.8px dashed #f59e0b; background: rgba(26, 18, 11, 0.94); box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4); display: inline-flex; align-items: center; justify-content: center; box-sizing: border-box; backdrop-filter: blur(8px);">
                            
                            <!-- Card Sound Button Top-Right (22px x 22px) -->
                            <div onclick="event.stopPropagation(); VocabGameWorkstation.speakWord(VocabGameWorkstation.currentWord.word)" 
                                title="Nghe phát âm"
                                style="position: absolute; top: -8px; right: -8px; width: 22px; height: 22px; border-radius: 9999px; background: #f59e0b; color: #1e1b4b; display: flex; align-items: center; justify-content: center; font-size: 10px; cursor: pointer; box-shadow: 0 2px 5px rgba(0,0,0,0.6); z-index: 5;">
                                <i class="fa-solid fa-volume-high"></i>
                            </div>

                            <!-- Letters Unmasking Display (Duy nhất 1 hàng: chữ cái đầu & các dấu _) -->
                            <div id="vgLettersDisplay" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; line-height: 1;">
                                <!-- Rendered dynamically -->
                            </div>
                        </div>

                        <!-- Cleared Word Floating Text -->`;

content = content.replace(oldCardRegex, newCardHTML);

// 2. Cập nhật updateFallingCardUI
const oldUpdateUI = /updateFallingCardUI\(\) {[\s\S]*?progress\.style\.width = `\${Math\.max\(pct, 8\)}%`;\s*}\s*}/;
const newUpdateUI = `updateFallingCardUI() {
            const lettersDiv = document.getElementById('vgLettersDisplay');
            const card = document.getElementById('vgFallingCard');
            if (!lettersDiv || !this.currentWord) return;

            const word = this.currentWord.word.toLowerCase();
            
            // Khung bự vừa đủ (~1.5x so với bản nhỏ, nhỏ gọn hơn bản cũ):
            // Chiều rộng = padding (32px) + viền (4px) + (word.length * 15px) + ((word.length - 1) * 6px gap)
            const fixedWidthPx = 36 + (word.length * 15) + ((word.length - 1) * 6);
            if (card) {
                card.style.width = \`\${fixedWidthPx}px\`;
                card.style.height = '42px';
                card.style.padding = '8px 16px';
                card.style.borderRadius = '10px';
                card.style.border = '1.8px dashed #f59e0b';
                card.style.background = 'rgba(26, 18, 11, 0.94)';
                card.style.boxShadow = '0 6px 20px rgba(245, 158, 11, 0.4)';
            }

            let html = '';
            for (let i = 0; i < word.length; i++) {
                if (i === 0) {
                    // Chữ cái đầu tiên: font-size 21px, font-weight 700, màu vàng sáng
                    html += \`
                        <div style="position: relative; width: 15px; height: 22px; display: inline-flex; align-items: center; justify-content: center;">
                            <span style="font-size: 21px; font-weight: 700; color: #fbbf24; line-height: 1; text-shadow: 0 2px 8px rgba(251, 191, 36, 0.6);">\${word[0]}</span>
                        </div>
                    \`;
                } else if (i < this.typedLetters.length) {
                    // Ký tự đã gõ đúng tiếp theo: font-size 21px, font-weight 700, màu vàng sáng
                    const typedChar = this.typedLetters[i];
                    html += \`
                        <div style="position: relative; width: 15px; height: 22px; display: inline-flex; align-items: center; justify-content: center;">
                            <span style="font-size: 21px; font-weight: 700; color: #fbbf24; line-height: 1; text-shadow: 0 2px 8px rgba(251, 191, 36, 0.6);">\${typedChar}</span>
                        </div>
                    \`;
                } else if (i === this.typedLetters.length) {
                    // Ký tự tiếp theo cần gõ:
                    const hasHint = this.isMistake && this.mistakeHint;
                    html += \`
                        <div style="position: relative; width: 15px; height: 22px; display: inline-flex; align-items: center; justify-content: center;">
                            \${hasHint ? \`
                                <span style="position: absolute; top: -16px; font-size: 13px; font-weight: 800; color: #f87171; line-height: 1; text-shadow: 0 1px 4px rgba(0,0,0,0.9);">
                                    \${this.mistakeHint}
                                </span>
                            \` : ''}
                            <span style="display: block; width: 15px; height: 2.5px; background: \${hasHint ? '#ef4444' : '#f59e0b'}; border-radius: 1.5px; \${hasHint ? 'box-shadow: 0 0 8px #ef4444;' : 'box-shadow: 0 0 5px #f59e0b;'}"></span>
                        </div>
                    \`;
                } else {
                    // Các ký tự còn lại: vạch đơn mảnh rộng 15px, cao 2.5px, màu amber mờ
                    html += \`
                        <div style="position: relative; width: 15px; height: 22px; display: inline-flex; align-items: center; justify-content: center;">
                            <span style="display: block; width: 15px; height: 2.5px; background: rgba(245, 158, 11, 0.45); border-radius: 1.5px;"></span>
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

content = content.replace(oldUpdateUI, newUpdateUI);

// 3. Cập nhật processKeyInput: Nhấn phím nào cũng bắn đạn xanh bay vào ô chữ!
const oldProcessKey = /processKeyInput\(pressedChar\) {[\s\S]*?this\.updateFallingCardUI\(\);\s*}\s*}/;
const newProcessKey = `processKeyInput(pressedChar) {
            if (!this.currentWord) return;
            const word = this.currentWord.word.toLowerCase();

            const currentExpectedIdx = Math.max(this.typedLetters.length, 1);
            if (currentExpectedIdx >= word.length) return;

            const expectedChar = word[currentExpectedIdx];

            // =========================================================================
            // BẤT KỂ GÕ ĐÚNG HAY SAI: ĐỀU BẮN VIÊN ĐẠN XANH BAY VÀO Ô CHỮ!
            // =========================================================================
            this.playShootSound();
            this.triggerGundamRecoil();
            this.spawnShootProjectile();

            if (pressedChar === expectedChar) {
                // =====================================================
                // GÕ ĐÚNG KÝ TỰ!
                // =====================================================
                this.isMistake = false;
                this.mistakeHint = '';

                if (this.typedLetters.length === 0) {
                    this.typedLetters = word[0] + pressedChar;
                } else {
                    this.typedLetters += pressedChar;
                }

                this.correctCount++;
                this.updateFallingCardUI();

                if (this.typedLetters.length === word.length) {
                    this.handleWordCleared();
                }
            } else {
                // =====================================================
                // GÕ SAI KÝ TỰ!
                // =====================================================
                this.isMistake = true;
                this.mistakeHint = expectedChar;
                this.mistakeCount++;

                if (!this.mistakeWords.some(w => w.word === this.currentWord.word)) {
                    this.mistakeWords.push(this.currentWord);
                }

                this.playWrongSound();
                this.speakWord(this.currentWord.word);

                const card = document.getElementById('vgFallingCard');
                if (card) {
                    card.classList.add('animate-shake');
                    card.style.borderColor = '#ef4444';
                    setTimeout(() => {
                        if (card) {
                            card.classList.remove('animate-shake');
                            card.style.borderColor = '#f59e0b';
                        }
                    }, 400);
                }

                this.updateFallingCardUI();
            }
        }`;

content = content.replace(oldProcessKey, newProcessKey);

// 4. Cập nhật spawnShootProjectile: Tính toán toạ độ và khởi tạo viên đạn xanh
const oldSpawnProjectile = /spawnShootProjectile\(\) {[\s\S]*?progress: 0,\s*speed: [\d\.]+\s*}\);\s*}/;
const newSpawnProjectile = `spawnShootProjectile() {
            const canvas = document.getElementById('vgParticleCanvas');
            const card = document.getElementById('vgFallingCard');
            const arena = document.getElementById('vgArenaContainer');
            if (!canvas || !card) return;

            if (arena && (canvas.width !== arena.clientWidth || canvas.height !== arena.clientHeight)) {
                canvas.width = arena.clientWidth;
                canvas.height = arena.clientHeight;
            }

            const rect = canvas.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();

            const angleRad = (this.gundamAngle || 0) * (Math.PI / 180);
            const barrelLen = 78; // Chiều dài nòng Beam Rifle
            const startX = (rect.width / 2) + Math.sin(angleRad) * barrelLen;
            const startY = (rect.height - 75) - Math.cos(angleRad) * barrelLen;

            const targetX = cardRect.left - rect.left + (cardRect.width / 2);
            const targetY = cardRect.top - rect.top + (cardRect.height / 2);

            this.triggerGundamRecoil();

            // Chớp sáng đầu nòng súng Beam Rifle
            for (let m = 0; m < 8; m++) {
                this.particles.push({
                    x: startX + (Math.random() - 0.5) * 10,
                    y: startY + (Math.random() - 0.5) * 10,
                    vx: (Math.random() - 0.5) * 3 + Math.sin(angleRad) * 3.5,
                    vy: (Math.random() - 0.5) * 3 - Math.cos(angleRad) * 3.5,
                    radius: 3 + Math.random() * 3,
                    color: Math.random() > 0.3 ? '#00e5ff' : '#38bdf8',
                    alpha: 1,
                    decay: 0.08
                });
            }

            // Viên đạn xanh Beam Laser bay vào ô chữ
            this.projectiles.push({
                x: startX,
                y: startY,
                targetX: targetX,
                targetY: targetY,
                prevX: startX,
                prevY: startY,
                progress: 0,
                speed: 0.07 // Bay rõ nét và mượt mà ~250ms
            });
        }`;

content = content.replace(oldSpawnProjectile, newSpawnProjectile);

// 5. Cập nhật renderParticles: Vẽ viên đạn xanh đẹp mắt, rõ nét
const oldRenderParticles = /renderParticles\(\) {[\s\S]*?this\.projectiles\.splice\(i, 1\);\s*}/;
const newRenderParticles = `renderParticles() {
            const canvas = document.getElementById('vgParticleCanvas');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Vẽ Viên Đạn Xanh Beam Laser từ Gundam
            for (let i = this.projectiles.length - 1; i >= 0; i--) {
                const p = this.projectiles[i];
                p.prevX = p.x + (p.targetX - p.x) * p.progress;
                p.prevY = p.y + (p.targetY - p.y) * p.progress;

                p.progress += p.speed;

                const curX = p.x + (p.targetX - p.x) * Math.min(p.progress, 1);
                const curY = p.y + (p.targetY - p.y) * Math.min(p.progress, 1);

                // Tính góc bay của viên đạn
                const bulletAngle = Math.atan2(p.targetY - p.y, p.targetX - p.x);

                // Vệt tia lửa plasma xanh cyan phía sau đuôi đạn
                this.particles.push({
                    x: curX + (Math.random() - 0.5) * 6,
                    y: curY + (Math.random() - 0.5) * 6,
                    vx: (Math.random() - 0.5) * 1.5 - Math.cos(bulletAngle) * 2,
                    vy: (Math.random() - 0.5) * 1.5 - Math.sin(bulletAngle) * 2,
                    radius: 2 + Math.random() * 2.5,
                    color: Math.random() > 0.4 ? '#00e5ff' : '#38bdf8',
                    alpha: 0.9,
                    decay: 0.06
                });

                ctx.save();

                // Vệt sáng nối đuôi đạn (Beam Tracer Tail)
                ctx.beginPath();
                ctx.moveTo(p.prevX, p.prevY);
                ctx.lineTo(curX, curY);
                ctx.strokeStyle = '#00e5ff';
                ctx.lineWidth = 6;
                ctx.lineCap = 'round';
                ctx.shadowColor = '#00b4d8';
                ctx.shadowBlur = 18;
                ctx.stroke();

                // Viên đạn Beam Laser hình elip dài / viên đạn xanh
                ctx.translate(curX, curY);
                ctx.rotate(bulletAngle);

                // Lớp hào quang xanh neon bên ngoài
                ctx.beginPath();
                ctx.ellipse(0, 0, 14, 6, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#00e5ff';
                ctx.shadowColor = '#00f5ff';
                ctx.shadowBlur = 24;
                ctx.fill();

                // Lõi đạn xanh lam đậm hơn
                ctx.beginPath();
                ctx.ellipse(0, 0, 10, 4, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#38bdf8';
                ctx.fill();

                // Lõi năng lượng trắng sáng chói giữa tâm
                ctx.beginPath();
                ctx.ellipse(0, 0, 6, 2.5, 0, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.fill();

                ctx.restore();

                if (p.progress >= 1) {
                    // Đạn chạm đích vào ô chữ: Nổ chùm sao plasma xanh & vàng rực rỡ
                    for (let k = 0; k < 16; k++) {
                        const a = Math.random() * Math.PI * 2;
                        const spd = 2 + Math.random() * 5;
                        this.particles.push({
                            x: p.targetX,
                            y: p.targetY,
                            vx: Math.cos(a) * spd,
                            vy: Math.sin(a) * spd,
                            radius: 2.5 + Math.random() * 3,
                            color: Math.random() > 0.3 ? '#00e5ff' : (Math.random() > 0.5 ? '#38bdf8' : '#fde047'),
                            alpha: 1,
                            decay: 0.045
                        });
                    }
                    this.projectiles.splice(i, 1);
                }`;

content = content.replace(oldRenderParticles, newRenderParticles);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully updated card size and blue bullet animation in js/vocab-game-workstation.js!');
