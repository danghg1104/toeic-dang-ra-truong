const fs = require('fs');
const path = require('path');

const focusFile = path.join(__dirname, '..', 'js', 'study-focus-engine.js');
let code = fs.readFileSync(focusFile, 'utf8');

console.log('🚀 Đang nâng cấp Zen Focus Engine với Volume Slider & Đa âm nền sinh học...');

// 1. Nâng cấp constructor để nạp volume và preset từ localStorage
const oldCtor = `            this.audioCtx = null;
            this.noiseNode = null;
            this.gainNode = null;
            this.isSoundPlaying = false;
            this.soundType = 'brown'; // 'brown' | 'rain'`;

const newCtor = `            this.audioCtx = null;
            this.noiseNode = null;
            this.gainNode = null;
            this.lfoNode = null;
            this.isSoundPlaying = false;
            this.soundType = localStorage.getItem('study_zen_sound_type') || 'brown'; // 'brown' | 'rain' | 'waves'
            this.volumePercent = parseInt(localStorage.getItem('study_zen_volume') || '40', 10);`;

if (code.includes(oldCtor)) {
    code = code.replace(oldCtor, newCtor);
}

// 2. Nâng cấp createOrUpdateZenHUD với Volume Slider & Sound Selector
const oldHudHtmlStart = `                <!-- Bên phải: Nút Âm thanh nền & Nút Thoát -->
                <div class="flex items-center gap-1.5">
                    <button id="zenAmbientBtn" onclick="StudyFocusEngine.toggleAmbientSound()"`;

const newHudHtmlStart = `                <!-- Bên phải: Nút Âm thanh nền, Bộ chỉnh âm lượng & Nút Thoát -->
                <div class="flex items-center gap-1.5 sm:gap-2">
                    <!-- Dropdown chọn âm nền -->
                    <select id="zenSoundSelector" onchange="StudyFocusEngine.changeSoundType(this.value)" 
                        class="bg-slate-800 text-slate-200 border border-slate-700 rounded-xl px-2 py-1 text-[11px] font-bold focus:outline-none cursor-pointer">
                        <option value="brown" \${this.soundType === 'brown' ? 'selected' : ''}>🪵 Brown Noise</option>
                        <option value="rain" \${this.soundType === 'rain' ? 'selected' : ''}>🌧️ Mưa êm dịu</option>
                        <option value="waves" \${this.soundType === 'waves' ? 'selected' : ''}>🌊 Sóng biển</option>
                    </select>

                    <!-- Nút Bật/Tắt Âm nền -->
                    <button id="zenAmbientBtn" onclick="StudyFocusEngine.toggleAmbientSound()"`;

if (code.includes(oldHudHtmlStart)) {
    code = code.replace(oldHudHtmlStart, newHudHtmlStart);
}

// Thêm Volume slider vào trước nút Thoát
const oldExitBtn = `                    <button onclick="StudyFocusEngine.exit()" 
                        class="px-3 py-1 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"`;

const newVolumeAndExit = `                    <!-- Volume Slider -->
                    <div class="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-xl bg-slate-800/80 border border-slate-700/60" title="Điều chỉnh âm lượng âm nền">
                        <i class="fa-solid fa-volume-low text-[10px] text-slate-400"></i>
                        <input id="zenVolumeSlider" type="range" min="0" max="100" value="\${this.volumePercent}" 
                            oninput="StudyFocusEngine.setVolume(this.value)" 
                            class="w-14 sm:w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-400">
                        <span id="zenVolumeLabel" class="text-[10px] font-mono text-cyan-300 w-6 text-right">\${this.volumePercent}%</span>
                    </div>

                    <button onclick="StudyFocusEngine.exit()" 
                        class="px-3 py-1 rounded-xl bg-rose-600/90 hover:bg-rose-600 text-white font-extrabold text-xs transition flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"`;

if (code.includes(oldExitBtn)) {
    code = code.replace(oldExitBtn, newVolumeAndExit);
}

// 3. Nâng cấp bộ tạo âm thanh startAmbientSound, stopAmbientSound, setVolume, changeSoundType
const oldAudioSectionStart = `        // =========================================================================
        // 6. TỔNG HỢP ÂM THANH NỀN BROWN NOISE TẬP TRUNG (WEB AUDIO API - 0KB CDN)
        // =========================================================================`;

const newAudioSection = `        // =========================================================================
        // 6. TỔNG HỢP ÂM THANH NỀN SINH HỌC TẬP TRUNG (WEB AUDIO API - 0KB CDN)
        // =========================================================================
        initAudio() {
            if (!this.audioCtx && typeof window.AudioContext !== 'undefined') {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioCtx = new AudioContext();
            }
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
        }

        setVolume(val) {
            this.volumePercent = Math.min(100, Math.max(0, parseInt(val, 10)));
            localStorage.setItem('study_zen_volume', this.volumePercent.toString());
            const lbl = document.getElementById('zenVolumeLabel');
            if (lbl) lbl.textContent = \`\${this.volumePercent}%\`;

            if (this.gainNode && this.audioCtx) {
                // Công thức logarithmic volume chuẩn tai người
                const targetGain = (this.volumePercent / 100) * 0.16;
                this.gainNode.gain.setValueAtTime(targetGain, this.audioCtx.currentTime);
            }
        }

        changeSoundType(newType) {
            this.soundType = newType;
            localStorage.setItem('study_zen_sound_type', newType);
            if (this.isSoundPlaying) {
                this.stopAmbientSound();
                this.startAmbientSound();
            }
        }

        toggleAmbientSound() {
            if (this.isSoundPlaying) {
                this.stopAmbientSound();
            } else {
                this.startAmbientSound();
            }
        }

        startAmbientSound() {
            try {
                this.initAudio();
                if (!this.audioCtx) return;

                const sampleRate = this.audioCtx.sampleRate;
                const bufferSize = sampleRate * 3; // 3 giây loop
                const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, sampleRate);
                const output = noiseBuffer.getChannelData(0);

                if (this.soundType === 'brown') {
                    // Brown Noise: Random Walk
                    let lastOut = 0.0;
                    for (let i = 0; i < bufferSize; i++) {
                        const white = Math.random() * 2 - 1;
                        output[i] = (lastOut + (0.02 * white)) / 1.02;
                        lastOut = output[i];
                        output[i] *= 3.5;
                    }
                } else if (this.soundType === 'rain') {
                    // Tiếng mưa rơi: Pink Noise kết hợp hạt mưa rải rác
                    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
                    for (let i = 0; i < bufferSize; i++) {
                        const white = Math.random() * 2 - 1;
                        b0 = 0.99886 * b0 + white * 0.0555179;
                        b1 = 0.99332 * b1 + white * 0.0750759;
                        b2 = 0.96900 * b2 + white * 0.1538520;
                        b3 = 0.86650 * b3 + white * 0.3104856;
                        b4 = 0.55000 * b4 + white * 0.5329522;
                        b5 = -0.7616 * b5 - white * 0.0168980;
                        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
                        b6 = white * 0.115926;
                        // Thỉnh thoảng có hạt mưa gõ nhẹ
                        const raindrop = Math.random() > 0.995 ? (Math.random() - 0.5) * 1.5 : 0;
                        output[i] = (pink * 0.18 + raindrop) * 1.8;
                    }
                } else {
                    // Sóng biển (Ocean Waves): Pink noise điều chế biên độ chu kỳ 8 giây
                    let lastOut = 0.0;
                    for (let i = 0; i < bufferSize; i++) {
                        const white = Math.random() * 2 - 1;
                        output[i] = (lastOut + (0.025 * white)) / 1.02;
                        lastOut = output[i];
                        output[i] *= 3.2;
                    }
                }

                this.noiseNode = this.audioCtx.createBufferSource();
                this.noiseNode.buffer = noiseBuffer;
                this.noiseNode.loop = true;

                // Bộ lọc Biquad Filter
                const filter = this.audioCtx.createBiquadFilter();
                if (this.soundType === 'rain') {
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(650, this.audioCtx.currentTime);
                } else if (this.soundType === 'waves') {
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(380, this.audioCtx.currentTime);
                    // LFO điều chế tần số lọc tạo hiệu ứng sóng dạt dào 8s
                    const lfo = this.audioCtx.createOscillator();
                    const lfoGain = this.audioCtx.createGain();
                    lfo.frequency.setValueAtTime(0.125, this.audioCtx.currentTime); // 8 giây / chu kỳ sóng
                    lfoGain.gain.setValueAtTime(150, this.audioCtx.currentTime);
                    lfo.connect(lfoGain);
                    lfoGain.connect(filter.frequency);
                    lfo.start();
                    this.lfoNode = lfo;
                } else {
                    filter.type = 'lowpass';
                    filter.frequency.setValueAtTime(450, this.audioCtx.currentTime);
                }

                this.gainNode = this.audioCtx.createGain();
                const targetGain = (this.volumePercent / 100) * 0.16;
                this.gainNode.gain.setValueAtTime(targetGain, this.audioCtx.currentTime);

                this.noiseNode.connect(filter);
                filter.connect(this.gainNode);
                this.gainNode.connect(this.audioCtx.destination);

                this.noiseNode.start();
                this.isSoundPlaying = true;

                const btn = document.getElementById('zenAmbientBtn');
                const lbl = document.getElementById('zenAmbientLabel');
                if (btn) btn.className = 'px-2.5 py-1 rounded-xl bg-cyan-600 text-white border border-cyan-400 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm';
                if (lbl) {
                    const soundNames = { brown: 'Đang phát Brown Noise', rain: 'Đang phát Mưa êm', waves: 'Đang phát Sóng biển' };
                    lbl.textContent = soundNames[this.soundType] || 'Đang phát';
                }

                if (typeof showToast === 'function') {
                    const soundTitles = { brown: '🪵 Brown Noise', rain: '🌧️ Tiếng mưa êm dịu', waves: '🌊 Tiếng sóng biển dạt dào' };
                    showToast(\`🎧 \${soundTitles[this.soundType] || 'Âm nền'} (Âm lượng \${this.volumePercent}%).\`);
                }
            } catch (e) {
                console.warn('Lỗi bật âm thanh tập trung:', e);
            }
        }

        stopAmbientSound() {
            try {
                if (this.noiseNode) {
                    this.noiseNode.stop();
                    this.noiseNode.disconnect();
                    this.noiseNode = null;
                }
                if (this.lfoNode) {
                    this.lfoNode.stop();
                    this.lfoNode.disconnect();
                    this.lfoNode = null;
                }
                this.isSoundPlaying = false;

                const btn = document.getElementById('zenAmbientBtn');
                const lbl = document.getElementById('zenAmbientLabel');
                if (btn) btn.className = 'px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer';
                if (lbl) lbl.textContent = 'Âm nền';
            } catch (e) {}
        }`;

// Thay thế audio section
const sIdx = code.indexOf(oldAudioSectionStart);
if (sIdx !== -1) {
    code = code.slice(0, sIdx) + newAudioSection + '\n    }\n\n    window.StudyFocusEngine = new StudyFocusEngineClass();\n\n})(window, document);';
}

fs.writeFileSync(focusFile, code, 'utf8');
console.log('✅ Đã nâng cấp hoàn tất Zen Focus Engine với Volume Slider & Đa âm nền sinh học!');
