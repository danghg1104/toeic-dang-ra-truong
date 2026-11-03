const fs = require('fs');

console.log('=== UPGRADING POMODORO WITH CUSTOM TIME CONTROLS ===');

// 1. UPDATE js/web-audio-micro-engine.js
let engine = fs.readFileSync('js/web-audio-micro-engine.js', 'utf8');

// 1.1 Support customSeconds in startPomodoro
const oldStartPomodoro = `        startPomodoro(mode = 'work', onTick = null, onComplete = null) {
            this.stopPomodoro();

            this.pomodoroMode = mode;
            this.pomodoroTotal = (mode === 'break') ? (5 * 60) : (25 * 60);
            this.pomodoroRemaining = this.pomodoroTotal;`;

const newStartPomodoro = `        startPomodoro(mode = 'work', onTick = null, onComplete = null, customSeconds = null) {
            this.stopPomodoro();

            this.pomodoroMode = mode;
            if (typeof customSeconds === 'number' && customSeconds > 0) {
                this.pomodoroTotal = Math.round(customSeconds);
            } else {
                this.pomodoroTotal = (mode === 'break') ? (5 * 60) : (25 * 60);
            }
            this.pomodoroRemaining = this.pomodoroTotal;`;

if (engine.includes(oldStartPomodoro)) {
    engine = engine.replace(oldStartPomodoro, newStartPomodoro);
    console.log('✅ Added customSeconds support to startPomodoro');
}

// 1.2 Add addPomodoroSeconds and setPomodoroSeconds methods
const addMethods = `        /**
         * Thêm/bớt giây trực tiếp vào phiên Pomodoro đang chạy hoặc tạm dừng
         * @param {number} deltaSeconds - Số giây cộng thêm (+300s = 5p, -60s = 1p)
         */
        addPomodoroSeconds(deltaSeconds) {
            this.pomodoroRemaining = Math.max(0, this.pomodoroRemaining + deltaSeconds);
            this.pomodoroTotal = Math.max(this.pomodoroTotal, this.pomodoroRemaining);
            const formatted = this._formatSeconds(this.pomodoroRemaining);
            if (typeof this._pomodoroOnTick === 'function') {
                this._pomodoroOnTick({
                    remainingSeconds: this.pomodoroRemaining,
                    totalSeconds: this.pomodoroTotal,
                    formattedTime: formatted,
                    mode: this.pomodoroMode,
                    isRunning: this.pomodoroIsRunning
                });
            }
        },

        /**
         * Thiết lập thời lượng Pomodoro tùy chỉnh khi chưa chạy
         * @param {number} totalSeconds
         */
        setPomodoroSeconds(totalSeconds) {
            this.pomodoroTotal = Math.max(10, Math.round(totalSeconds));
            this.pomodoroRemaining = this.pomodoroTotal;
            const formatted = this._formatSeconds(this.pomodoroRemaining);
            if (typeof this._pomodoroOnTick === 'function') {
                this._pomodoroOnTick({
                    remainingSeconds: this.pomodoroRemaining,
                    totalSeconds: this.pomodoroTotal,
                    formattedTime: formatted,
                    mode: this.pomodoroMode,
                    isRunning: this.pomodoroIsRunning
                });
            }
        },
`;

if (!engine.includes('addPomodoroSeconds')) {
    engine = engine.replace('pausePomodoro() {', `${addMethods}\n        pausePomodoro() {`);
    console.log('✅ Added addPomodoroSeconds and setPomodoroSeconds to WebAudioMicroEngine');
}

fs.writeFileSync('js/web-audio-micro-engine.js', engine, 'utf8');

// 2. UPDATE index.html (Pomodoro Modal UI & Logic)
let html = fs.readFileSync('index.html', 'utf8');

// 2.1 Replace Countdown Display and add Time Stepper & Presets in index.html
const oldDisplayBlock = `            <!-- Large Countdown Display -->
            <div class="my-6 text-center">
                <div id="pomodoroCountdownDisplay" class="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                    25:00
                </div>
                <div id="pomodoroModeStatusText" class="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Sẵn sàng tập trung cao độ</span>
                </div>
            </div>`;

const newDisplayBlock = `            <!-- Large Countdown Display -->
            <div class="my-5 text-center">
                <div id="pomodoroCountdownDisplay" class="text-5xl sm:text-6xl font-black text-slate-900 dark:text-white tracking-tight font-mono drop-shadow-xs">
                    25:00
                </div>
                <div id="pomodoroModeStatusText" class="text-xs font-bold text-slate-500 dark:text-slate-400 mt-2 flex items-center justify-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                    <span>Sẵn sàng tập trung cao độ</span>
                </div>
            </div>

            <!-- Bộ Điều Chỉnh Thời Gian Tùy Ý (Quick Stepper & Presets) -->
            <div class="mb-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-2.5">
                <div class="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                    <span class="flex items-center gap-1.5"><i class="fa-solid fa-sliders text-rose-500"></i> Điều chỉnh thời gian:</span>
                    <span id="pomoDurationLabel" class="text-rose-600 dark:text-rose-400 font-extrabold font-mono">25 phút</span>
                </div>
                
                <!-- Quick Stepper Controls -->
                <div class="flex items-center justify-center gap-2">
                    <button type="button" onclick="adjustPomodoroMinutes(-5)" class="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 transition shadow-2xs cursor-pointer active:scale-95" title="Giảm 5 phút">
                        -5p
                    </button>
                    <button type="button" onclick="adjustPomodoroMinutes(-1)" class="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 transition shadow-2xs cursor-pointer active:scale-95" title="Giảm 1 phút">
                        -1p
                    </button>
                    <div class="flex items-center gap-1 px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 shadow-inner">
                        <input type="number" id="pomoCustomMinutesInput" min="1" max="180" value="25" oninput="onPomodoroCustomInputChange(this.value)" class="w-12 text-center text-sm font-black text-slate-900 dark:text-white bg-transparent focus:outline-none">
                        <span class="text-xs text-slate-400 font-bold">phút</span>
                    </div>
                    <button type="button" onclick="adjustPomodoroMinutes(+1)" class="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 transition shadow-2xs cursor-pointer active:scale-95" title="Tăng 1 phút">
                        +1p
                    </button>
                    <button type="button" onclick="adjustPomodoroMinutes(+5)" class="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-650 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 transition shadow-2xs cursor-pointer active:scale-95" title="Tăng 5 phút">
                        +5p
                    </button>
                </div>

                <!-- Presets Bar -->
                <div class="grid grid-cols-5 gap-1.5 pt-1">
                    <button type="button" onclick="setPomodoroMinutes(15)" id="pomoPreset15" class="py-1 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 border border-slate-200 dark:border-slate-600 transition text-center cursor-pointer">15p</button>
                    <button type="button" onclick="setPomodoroMinutes(25)" id="pomoPreset25" class="py-1 rounded-xl text-[11px] font-extrabold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 transition text-center cursor-pointer shadow-xs">25p</button>
                    <button type="button" onclick="setPomodoroMinutes(30)" id="pomoPreset30" class="py-1 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 border border-slate-200 dark:border-slate-600 transition text-center cursor-pointer">30p</button>
                    <button type="button" onclick="setPomodoroMinutes(45)" id="pomoPreset45" class="py-1 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 border border-slate-200 dark:border-slate-600 transition text-center cursor-pointer">45p</button>
                    <button type="button" onclick="setPomodoroMinutes(60)" id="pomoPreset60" class="py-1 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 border border-slate-200 dark:border-slate-600 transition text-center cursor-pointer">60p</button>
                </div>
            </div>`;

if (html.includes(oldDisplayBlock)) {
    html = html.replace(oldDisplayBlock, newDisplayBlock);
    console.log('✅ Injected Pomodoro time stepper and presets into index.html');
}

// 2.2 Update Pomodoro JS script in index.html to support customizable duration
const oldPomoJsStart = `        (function() {
            let currentPomoMode = 'work';
            let currentAmbient = 'lofi';
            let isPomodoroPaused = false;`;

const newPomoJsStart = `        (function() {
            let currentPomoMode = 'work';
            let currentAmbient = 'lofi';
            let isPomodoroPaused = false;
            let customWorkMinutes = 25;

            window.adjustPomodoroMinutes = function(delta) {
                const newMins = Math.max(1, Math.min(180, customWorkMinutes + delta));
                window.setPomodoroMinutes(newMins);
            };

            window.setPomodoroMinutes = function(mins) {
                customWorkMinutes = Math.max(1, Math.min(180, parseInt(mins) || 25));
                const input = document.getElementById('pomoCustomMinutesInput');
                if (input) input.value = customWorkMinutes;
                const label = document.getElementById('pomoDurationLabel');
                if (label) label.textContent = customWorkMinutes + ' phút';

                // Highlight active preset
                [15, 25, 30, 45, 60].forEach(m => {
                    const btn = document.getElementById('pomoPreset' + m);
                    if (btn) {
                        if (m === customWorkMinutes) {
                            btn.className = 'py-1 rounded-xl text-[11px] font-extrabold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 transition text-center cursor-pointer shadow-xs';
                        } else {
                            btn.className = 'py-1 rounded-xl text-[11px] font-bold bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-rose-600 border border-slate-200 dark:border-slate-600 transition text-center cursor-pointer';
                        }
                    }
                });

                // Update display if not running
                if (window.WebAudioMicroEngine && !window.WebAudioMicroEngine.pomodoroIsRunning) {
                    const sec = customWorkMinutes * 60;
                    const mm = String(Math.floor(sec / 60)).padStart(2, '0');
                    const ss = String(sec % 60).padStart(2, '0');
                    const disp = document.getElementById('pomodoroCountdownDisplay');
                    const quick = document.getElementById('quickPomodoroTimeDisplay');
                    if (disp) disp.textContent = \`\${mm}:\${ss}\`;
                    if (quick) quick.textContent = \`\${mm}:\${ss}\`;
                    window.WebAudioMicroEngine.setPomodoroSeconds(sec);
                } else if (window.WebAudioMicroEngine && window.WebAudioMicroEngine.pomodoroIsRunning) {
                    // Nếu đang chạy và bấm nút chỉnh, cộng/trừ trực tiếp
                    const deltaSec = (customWorkMinutes * 60) - window.WebAudioMicroEngine.pomodoroRemaining;
                    if (deltaSec !== 0) {
                        window.WebAudioMicroEngine.addPomodoroSeconds(deltaSec);
                        if (typeof showToast === 'function') {
                            showToast(\`⏱️ Đã điều chỉnh phiên học sang \${customWorkMinutes} phút!\`);
                        }
                    }
                }
            };

            window.onPomodoroCustomInputChange = function(val) {
                const parsed = parseInt(val);
                if (parsed && parsed >= 1 && parsed <= 180) {
                    window.setPomodoroMinutes(parsed);
                }
            };`;

if (html.includes(oldPomoJsStart)) {
    html = html.replace(oldPomoJsStart, newPomoJsStart);
    console.log('✅ Added setPomodoroMinutes and adjustPomodoroMinutes functions');
}

// 2.3 Ensure startPomodoro uses customWorkMinutes in work mode
const oldPomoCall = `window.WebAudioMicroEngine.startPomodoro(currentPomoMode, ({ formattedTime }) => {`;
const newPomoCall = `const durationSeconds = (currentPomoMode === 'work') ? (customWorkMinutes * 60) : null;
                            window.WebAudioMicroEngine.startPomodoro(currentPomoMode, ({ formattedTime }) => {`;

if (html.includes(oldPomoCall)) {
    html = html.replace(
        `window.WebAudioMicroEngine.startPomodoro(currentPomoMode, ({ formattedTime }) => {`,
        `const durationSeconds = (currentPomoMode === 'work') ? (customWorkMinutes * 60) : null;
                            window.WebAudioMicroEngine.startPomodoro(currentPomoMode, ({ formattedTime }) => {`
    );
    // And pass durationSeconds
    html = html.replace(
        `window.WebAudioMicroEngine.startPomodoro(currentPomoMode, ({ formattedTime }) => {`,
        `window.WebAudioMicroEngine.startPomodoro(currentPomoMode, ({ formattedTime }) => {`
    );
}

// In handlePomodoroStart, pass custom duration
const oldStartCall = `window.WebAudioMicroEngine.startPomodoro(currentPomoMode, ({ formattedTime }) => {
                                const d = document.getElementById('pomodoroCountdownDisplay');
                                const q = document.getElementById('quickPomodoroTimeDisplay');
                                if (d) d.textContent = formattedTime;
                                if (q) q.textContent = formattedTime;
                            }, () => {
                                isPomodoroPaused = false;
                                if (startBtn) startBtn.classList.remove('hidden');
                                if (pauseBtn) pauseBtn.classList.add('hidden');
                            });`;

const newStartCall = `const customSec = (currentPomoMode === 'work') ? (customWorkMinutes * 60) : null;
                            window.WebAudioMicroEngine.startPomodoro(currentPomoMode, ({ formattedTime }) => {
                                const d = document.getElementById('pomodoroCountdownDisplay');
                                const q = document.getElementById('quickPomodoroTimeDisplay');
                                if (d) d.textContent = formattedTime;
                                if (q) q.textContent = formattedTime;
                            }, () => {
                                isPomodoroPaused = false;
                                if (startBtn) startBtn.classList.remove('hidden');
                                if (pauseBtn) pauseBtn.classList.add('hidden');
                            }, customSec);`;

if (html.includes(oldStartCall)) {
    html = html.replace(oldStartCall, newStartCall);
    console.log('✅ Passed customSec to startPomodoro in handlePomodoroStart');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('🎉 Pomodoro custom time upgrade complete!');
