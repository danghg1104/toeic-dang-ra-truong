// ======================================================================================
// SCRIPT PATCH CHO VOCAB GAME WORKSTATION & MOBILE KEYBOARD VIRTUAL EXPERIENCES
// ======================================================================================

const fs = require('fs');
const path = require('path');

function patchVocabWorkstation(filePath) {
    if (!fs.existsSync(filePath)) {
        console.log(`[SKIP] File not found: ${filePath}`);
        return;
    }

    let code = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Cập nhật buildGameArenaHTML để thêm mobile input và thumb keypad
    // Tìm vị trí của vgArenaContainer
    const oldArenaPattern = /<div id="vgArenaContainer"[\s\S]*?style="[^"]*background:[^"]*">/;
    const newArenaReplacement = `<div id="vgArenaContainer" 
                        onclick="VocabGameWorkstation.focusMobileInput()"
                        class="w-full rounded-2xl sm:rounded-3xl relative overflow-hidden shadow-2xl select-none transition-all duration-200 cursor-pointer"
                        style="height: clamp(380px, 60vh, 680px); min-height: 340px; max-height: 82vh; background: radial-gradient(circle at 50% 25%, #0f172a 0%, #090d16 55%, #020408 100%);">
                        
                        <!-- Mobile Hidden Typing Input Bridge (Bàn phím ảo iOS / Android) -->
                        <input type="text" id="vgMobileInput" 
                            autocomplete="off" autocorrect="off" autocapitalize="none" spellcheck="false"
                            inputmode="text" enterkeyhint="next"
                            style="position: absolute; top: 0; left: 0; width: 1px; height: 1px; opacity: 0; pointer-events: auto; z-index: 10;" />`;

    if (oldArenaPattern.test(code)) {
        code = code.replace(oldArenaPattern, newArenaReplacement);
        modified = true;
        console.log(`[OK] Injected vgMobileInput and responsive vgArenaContainer into ${filePath}`);
    }

    // 2. Thêm Mobile Control Panel & On-Screen Thumb Keypad dưới vgArenaContainer
    const oldEndArenaPattern = /(<div class="text-\[10px\] font-bold text-slate-400 mt-1 flex items-center gap-1\.5">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>)/;
    
    const mobilePanelHTML = `
                    <!-- ============================================================ -->
                    <!-- MOBILE VIRTUAL KEYBOARD BAR & THUMB CONTROLS (iOS & Android) -->
                    <!-- ============================================================ -->
                    <div id="vgMobileControlPanel" class="mt-3 flex flex-col gap-2 select-none">
                        <!-- Action Bar: Tap to Focus OS Keyboard, Hint, Audio, Toggle Keypad -->
                        <div class="flex items-center justify-between gap-2 p-1.5 sm:p-2 rounded-2xl bg-slate-900/90 border border-cyan-500/30 backdrop-blur-md shadow-lg">
                            <!-- Tap to Focus Native Virtual Keyboard (Gboard / iOS Safari) -->
                            <button type="button" onclick="event.stopPropagation(); VocabGameWorkstation.focusMobileInput();" 
                                    class="flex-1 min-h-[44px] py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600/90 to-cyan-600/90 hover:from-blue-600 hover:to-cyan-600 active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition shadow-sm cursor-pointer">
                                <i class="fa-solid fa-keyboard text-cyan-300 animate-pulse"></i>
                                <span id="vgMobileInputStatus">Chạm để gõ phím ảo</span>
                            </button>

                            <!-- Audio Repeat Button (≥44px) -->
                            <button type="button" onclick="event.stopPropagation(); VocabGameWorkstation.speakWord(VocabGameWorkstation.currentWord ? VocabGameWorkstation.currentWord.word : '');" 
                                    title="Nghe lại phát âm từ vựng"
                                    class="min-w-[44px] min-h-[44px] p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center justify-center cursor-pointer active:scale-95 shadow-sm">
                                <i class="fa-solid fa-volume-high text-base"></i>
                            </button>

                            <!-- Hint 1 Letter Button (≥44px) -->
                            <button type="button" onclick="event.stopPropagation(); VocabGameWorkstation.giveHintLetter();" 
                                    title="Gợi ý 1 chữ cái tiếp theo"
                                    class="min-w-[44px] min-h-[44px] px-3 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm">
                                <i class="fa-solid fa-lightbulb text-amber-400"></i>
                                <span class="text-xs font-bold">Gợi ý</span>
                            </button>

                            <!-- Toggle On-screen Thumb Keypad Button (≥44px) -->
                            <button type="button" onclick="event.stopPropagation(); VocabGameWorkstation.toggleThumbKeypad();" 
                                    id="btnToggleThumbKeypad"
                                    title="Bật/Tắt Bàn phím cảm ứng ngón cái"
                                    class="min-w-[44px] min-h-[44px] px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm">
                                <i class="fa-solid fa-gamepad text-indigo-400 text-sm"></i>
                                <span class="hidden sm:inline text-xs font-bold">Phím cảm ứng</span>
                            </button>
                        </div>

                        <!-- On-Screen Thumb Keypad (QWERTY layout, optimized for mobile thumb gaming) -->
                        <div id="vgThumbKeypad" class="hidden flex flex-col gap-1.5 p-2 sm:p-2.5 rounded-2xl bg-slate-950/95 border border-cyan-500/30 shadow-2xl select-none touch-manipulation">
                            <!-- Row 1: QWERTYUIOP -->
                            <div class="flex items-center justify-center gap-1 sm:gap-1.5">
                                \${['Q','W','E','R','T','Y','U','I','O','P'].map(k => \`
                                    <button type="button" onclick="event.stopPropagation(); VocabGameWorkstation.handleKeypadTouch('\${k}');" 
                                            class="flex-1 max-w-[36px] sm:max-w-[44px] h-10 sm:h-11 rounded-lg bg-slate-800/90 hover:bg-cyan-600/60 active:bg-cyan-500 active:scale-90 text-white font-black text-xs sm:text-sm border border-slate-700/80 transition-all flex items-center justify-center cursor-pointer shadow-xs">
                                        \${k}
                                    </button>
                                \`).join('')}
                            </div>
                            <!-- Row 2: ASDFGHJKL -->
                            <div class="flex items-center justify-center gap-1 sm:gap-1.5 px-2">
                                \${['A','S','D','F','G','H','J','K','L'].map(k => \`
                                    <button type="button" onclick="event.stopPropagation(); VocabGameWorkstation.handleKeypadTouch('\${k}');" 
                                            class="flex-1 max-w-[36px] sm:max-w-[44px] h-10 sm:h-11 rounded-lg bg-slate-800/90 hover:bg-cyan-600/60 active:bg-cyan-500 active:scale-90 text-white font-black text-xs sm:text-sm border border-slate-700/80 transition-all flex items-center justify-center cursor-pointer shadow-xs">
                                        \${k}
                                    </button>
                                \`).join('')}
                            </div>
                            <!-- Row 3: Hint, ZXCVBNM, Audio -->
                            <div class="flex items-center justify-center gap-1 sm:gap-1.5">
                                <button type="button" onclick="event.stopPropagation(); VocabGameWorkstation.giveHintLetter();" 
                                        class="px-2.5 h-10 sm:h-11 rounded-lg bg-amber-500/25 active:bg-amber-500 active:scale-90 text-amber-300 font-bold text-xs border border-amber-500/50 flex items-center justify-center gap-1 cursor-pointer">
                                    <i class="fa-solid fa-lightbulb"></i>
                                </button>
                                \${['Z','X','C','V','B','N','M'].map(k => \`
                                    <button type="button" onclick="event.stopPropagation(); VocabGameWorkstation.handleKeypadTouch('\${k}');" 
                                            class="flex-1 max-w-[36px] sm:max-w-[44px] h-10 sm:h-11 rounded-lg bg-slate-800/90 hover:bg-cyan-600/60 active:bg-cyan-500 active:scale-90 text-white font-black text-xs sm:text-sm border border-slate-700/80 transition-all flex items-center justify-center cursor-pointer shadow-xs">
                                        \${k}
                                    </button>
                                \`).join('')}
                                <button type="button" onclick="event.stopPropagation(); VocabGameWorkstation.speakWord(VocabGameWorkstation.currentWord ? VocabGameWorkstation.currentWord.word : '');" 
                                        class="px-2.5 h-10 sm:h-11 rounded-lg bg-cyan-500/25 active:bg-cyan-500 active:scale-90 text-cyan-300 font-bold text-xs border border-cyan-500/50 flex items-center justify-center gap-1 cursor-pointer">
                                    <i class="fa-solid fa-volume-high"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            \`;`;

    if (!code.includes('id="vgMobileControlPanel"') && oldEndArenaPattern.test(code)) {
        code = code.replace(oldEndArenaPattern, (match) => {
            // Cắt phần </div></div></div> cuối
            const trimmed = match.replace(/<\/div>\s*<\/div>\s*<\/div>$/, '');
            return trimmed + '</div>\n' + mobilePanelHTML;
        });
        modified = true;
        console.log(`[OK] Injected vgMobileControlPanel into ${filePath}`);
    }

    // 3. Cập nhật attachGlobalKeydown & detachGlobalKeydown để bind input ảo mobile
    const oldAttachCode = `        attachGlobalKeydown() {
            this.detachGlobalKeydown();
            window.addEventListener('keydown', this.handleGlobalKeyDown);
        }

        detachGlobalKeydown() {
            window.removeEventListener('keydown', this.handleGlobalKeyDown);
        }`;

    const newAttachCode = `        attachGlobalKeydown() {
            this.detachGlobalKeydown();
            window.addEventListener('keydown', this.handleGlobalKeyDown);

            // BIND SỰ KIỆN CHO MOBILE VIRTUAL KEYBOARD
            const mobileInput = document.getElementById('vgMobileInput');
            if (mobileInput) {
                this._boundMobileInputHandler = (e) => {
                    const val = mobileInput.value;
                    if (!val) return;
                    const char = val.slice(-1).toLowerCase();
                    mobileInput.value = '';
                    if (/^[a-zA-Z]$/.test(char)) {
                        this.processKeyInput(char);
                    }
                };
                this._boundCompositionHandler = (e) => {
                    const data = e.data;
                    if (data) {
                        const char = data.slice(-1).toLowerCase();
                        mobileInput.value = '';
                        if (/^[a-zA-Z]$/.test(char)) {
                            this.processKeyInput(char);
                        }
                    }
                };
                mobileInput.addEventListener('input', this._boundMobileInputHandler);
                mobileInput.addEventListener('compositionend', this._boundCompositionHandler);
            }
        }

        detachGlobalKeydown() {
            window.removeEventListener('keydown', this.handleGlobalKeyDown);
            const mobileInput = document.getElementById('vgMobileInput');
            if (mobileInput && this._boundMobileInputHandler) {
                mobileInput.removeEventListener('input', this._boundMobileInputHandler);
                mobileInput.removeEventListener('compositionend', this._boundCompositionHandler);
                this._boundMobileInputHandler = null;
                this._boundCompositionHandler = null;
            }
        }`;

    if (code.includes(oldAttachCode)) {
        code = code.replace(oldAttachCode, newAttachCode);
        modified = true;
        console.log(`[OK] Upgraded attachGlobalKeydown with mobile input listeners in ${filePath}`);
    }

    // 4. Cập nhật handleGlobalKeyDown để không chặn khi activeElement là vgMobileInput
    const oldKeydownCheck = `            const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
            if (activeTag === 'input' || activeTag === 'textarea') return;`;

    const newKeydownCheck = `            const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
            const activeId = document.activeElement ? document.activeElement.id : '';
            // Cho phép phím đi qua nếu đang focus vào ô input ảo mobile vgMobileInput
            if (activeTag === 'input' || activeTag === 'textarea') {
                if (activeId !== 'vgMobileInput') return;
            }`;

    if (code.includes(oldKeydownCheck)) {
        code = code.replace(oldKeydownCheck, newKeydownCheck);
        modified = true;
        console.log(`[OK] Upgraded handleGlobalKeyDown check in ${filePath}`);
    }

    // 5. Thêm các hàm điều khiển mobile vào class VocabGameWorkstation
    const mobileMethods = `
        // =========================================================================
        // MOBILE VIRTUAL KEYBOARD & TOUCH CONTROLS (iOS & Android)
        // =========================================================================
        focusMobileInput() {
            const inp = document.getElementById('vgMobileInput');
            if (inp) {
                try {
                    inp.focus({ preventScroll: true });
                } catch(e) {
                    inp.focus();
                }
                const status = document.getElementById('vgMobileInputStatus');
                if (status) {
                    status.textContent = 'Bàn phím sẵn sàng • Gõ ngay!';
                    setTimeout(() => {
                        if (status) status.textContent = 'Chạm để gõ phím ảo';
                    }, 4000);
                }
            }
        }

        giveHintLetter() {
            if (!this.currentWord) return;
            const word = this.currentWord.word.toLowerCase();
            const nextIdx = Math.max(this.typedLetters.length, 1);
            if (nextIdx < word.length) {
                const expectedChar = word[nextIdx];
                this.processKeyInput(expectedChar);
            }
        }

        toggleThumbKeypad() {
            const keypad = document.getElementById('vgThumbKeypad');
            const btn = document.getElementById('btnToggleThumbKeypad');
            if (keypad) {
                const isHidden = keypad.classList.contains('hidden');
                keypad.classList.toggle('hidden', !isHidden);
                if (btn) {
                    btn.classList.toggle('bg-indigo-600', isHidden);
                    btn.classList.toggle('text-white', isHidden);
                    btn.classList.toggle('bg-slate-800', !isHidden);
                }
            }
        }

        handleKeypadTouch(key) {
            if (!key || typeof key !== 'string') return;
            if ('vibrate' in navigator) {
                try { navigator.vibrate(12); } catch(e) {}
            }
            this.processKeyInput(key.toLowerCase());
        }
`;

    if (!code.includes('focusMobileInput()')) {
        // Chèn trước exitToConfig
        const insertTarget = '        exitToConfig() {';
        if (code.includes(insertTarget)) {
            code = code.replace(insertTarget, mobileMethods + '\n' + insertTarget);
            modified = true;
            console.log(`[OK] Injected mobile helper methods in ${filePath}`);
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, code, 'utf8');
        console.log(`[SUCCESS] File patched successfully: ${filePath}`);
    } else {
        console.log(`[INFO] No changes needed or already patched: ${filePath}`);
    }
}

// Chạy patch cho cả js/ và www/js/
patchVocabWorkstation(path.join(__dirname, '..', 'js', 'vocab-game-workstation.js'));
patchVocabWorkstation(path.join(__dirname, '..', 'www', 'js', 'vocab-game-workstation.js'));
console.log('Done patching Vocab Workstations.');
