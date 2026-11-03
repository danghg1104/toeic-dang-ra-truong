const fs = require('fs');

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

['js/vocab-game-workstation.js', 'www/js/vocab-game-workstation.js'].forEach(filePath => {
    let code = fs.readFileSync(filePath, 'utf8');
    if (!code.includes('handleKeypadTouch(key)')) {
        const target = '        exitToConfig() {';
        if (code.includes(target)) {
            code = code.replace(target, mobileMethods + '\n' + target);
            fs.writeFileSync(filePath, code, 'utf8');
            console.log(`[SUCCESS] Injected mobile methods into ${filePath}`);
        } else {
            console.log(`[FAIL] Target exitToConfig() not found in ${filePath}`);
        }
    } else {
        console.log(`[SKIP] Already present in ${filePath}`);
    }
});
