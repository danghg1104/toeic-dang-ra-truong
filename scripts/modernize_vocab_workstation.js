const fs = require('fs');

const file = 'js/vocab-game-workstation.js';
let code = fs.readFileSync(file, 'utf8');

// 1. Modernize Audio Sound: playShootSound -> double-sine harmonic chime
const oldSoundRegex = /\/\/ Gundam Sci-Fi Beam Rifle Laser Shot Sound[\s\S]*?playShootSound\(\) \{[\s\S]*?osc\.start\(now\);\s*osc\.stop\(now \+ 0\.12\);\s*\} catch\(e\) \{\}\s*\}/;

const newSoundCode = `// Focus Study Reflex Chime (Web Audio API - C6/E6 Harmonic Chime)
        playShootSound() {
            if (!this.soundEnabled) return;
            try {
                this.initAudio();
                if (!this.audioCtx) return;
                const now = this.audioCtx.currentTime;

                const osc1 = this.audioCtx.createOscillator();
                const osc2 = this.audioCtx.createOscillator();
                const gain = this.audioCtx.createGain();

                osc1.type = 'sine';
                osc2.type = 'sine';
                osc1.frequency.setValueAtTime(523.25, now);
                osc1.frequency.exponentialRampToValueAtTime(1046.5, now + 0.1);
                osc2.frequency.setValueAtTime(659.25, now);
                osc2.frequency.exponentialRampToValueAtTime(1318.5, now + 0.1);

                gain.gain.setValueAtTime(0.18, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

                osc1.connect(gain);
                osc2.connect(gain);
                gain.connect(this.audioCtx.destination);

                osc1.start(now);
                osc2.start(now);
                osc1.stop(now + 0.32);
                osc2.stop(now + 0.32);
            } catch(e) {}
        }`;

if (oldSoundRegex.test(code)) {
  code = code.replace(oldSoundRegex, newSoundCode);
  console.log('1. playShootSound modernized to harmonic chime!');
} else {
  console.warn('1. Could not match oldSoundRegex!');
}

// 2. Modernize HUD lines in Game Arena
const oldHudRegex = /<!-- Gundam Space Battlefield HUD Lines & Stars -->[\s\S]*?RADAR LOCK: STANDBY<\/div>[\s\S]*?MOBILE SUIT: RX-78 BEAM ARMED<\/div>\s*<\/div>/;

const newHudCode = `<!-- Focus Studio Background HUD & Ambient Stars -->
                        <div class="absolute inset-0 pointer-events-none opacity-40">
                            <!-- Background Subtle Stars -->
                            <div class="absolute w-1.5 h-1.5 rounded-full bg-cyan-300 blur-[0.5px] animate-pulse" style="top: 15%; left: 12%;"></div>
                            <div class="absolute w-2 h-2 rounded-full bg-blue-400 blur-[1px] animate-pulse" style="top: 35%; left: 85%; animation-delay: 1.2s;"></div>
                            <div class="absolute w-1.5 h-1.5 rounded-full bg-amber-200 blur-[0.5px] animate-pulse" style="top: 60%; left: 20%; animation-delay: 2s;"></div>
                            <div class="absolute w-1 h-1 rounded-full bg-cyan-200 blur-[0.5px] animate-pulse" style="top: 25%; left: 70%; animation-delay: 0.7s;"></div>
                            
                            <!-- Focus Studio HUD Indicator -->
                            <div class="absolute top-4 left-4 text-cyan-400/60 font-mono text-[10px] tracking-wider">FOCUS STUDIO: SPEED SPELLING</div>
                            <div class="absolute top-4 right-4 text-cyan-400/60 font-mono text-[10px] tracking-wider">CEFR ANALYZER: ACTIVE</div>
                            <div class="absolute bottom-4 left-4 text-amber-400/50 font-mono text-[10px] tracking-wider">STUDY COMPANION: SÓI MÂY</div>
                        </div>`;

if (oldHudRegex.test(code)) {
  code = code.replace(oldHudRegex, newHudCode);
  console.log('2. HUD lines updated to Focus Studio!');
} else {
  console.warn('2. Could not match oldHudRegex!');
}

// 3. Replace Gundam Mecha SVG with Sói Mây Studio Focus Companion Platform
const oldLauncherRegex = /<!-- Bottom Launcher: GUNDAM MOBILE SUIT RX-78 MECHA \(ẢNH 1 & ẢNH 3\) -->[\s\S]*?<div id="vgGundamWrapper"[\s\S]*?<\/svg>\s*<\/div>\s*<\/div>/;

const newLauncherCode = `<!-- Bottom Focus Companion: SÓI MÂY STUDY STUDIO COMPANION -->
                        <div class="absolute bottom-3 left-0 right-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                            
                            <!-- Studio Companion Platform (Cử động xoay theo vị trí chữ rơi & thở nhẹ) -->
                            <div id="vgGundamWrapper" class="relative flex flex-col items-center justify-center pointer-events-none mb-2">
                                <div id="vgGundamLauncher" 
                                    class="relative flex flex-col items-center justify-center pointer-events-none transition-transform duration-150"
                                    style="width: 130px; height: 130px; transform-origin: 50% 85%; will-change: transform;">
                                    
                                    <!-- Halo Ambient Glow -->
                                    <div class="absolute inset-0 rounded-full bg-gradient-to-t from-blue-500/20 via-cyan-400/10 to-transparent blur-md"></div>
                                    
                                    <!-- Sói Mây Focus Mascot Avatar -->
                                    <div class="relative w-24 h-24 rounded-2xl bg-slate-900/85 border-2 border-cyan-400/60 p-1.5 shadow-[0_0_25px_rgba(56,189,248,0.35)] flex items-center justify-center overflow-hidden">
                                        <img src="assets/mascot/may_reading.png" alt="Sói Mây Studio" class="w-full h-full object-contain filter drop-shadow">
                                        <div class="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-t from-slate-950 to-transparent"></div>
                                    </div>
                                    
                                    <!-- Focus Indicator Quill Tip -->
                                    <div class="mt-1 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-cyan-500/50 shadow-sm">
                                        <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                                        <span class="text-[10px] font-extrabold text-cyan-300 uppercase tracking-wider font-mono">SÓI MÂY</span>
                                    </div>
                                </div>
                            </div>`;

if (oldLauncherRegex.test(code)) {
  code = code.replace(oldLauncherRegex, newLauncherCode);
  console.log('3. Bottom launcher replaced with Sói Mây Study Companion!');
} else {
  console.warn('3. Could not match oldLauncherRegex!');
}

// 4. Update Microcopy caption below Progress Bar
code = code.replace(
  'Gõ trực tiếp chữ cái trên bàn phím • [Space/Tab] để nghe lại âm chuẩn',
  'Gõ trực tiếp chữ cái trên bàn phím (A-Z) • Phím [Space/Tab] để nghe lại phát âm'
);

// 5. Update header comments in vocab-game-workstation.js
code = code.replace(
  '// GUNDAM VOCABULARY ARENA WORKSTATION & CEFR SCANNER (CÙNG ĐĂNG RA TRƯỜNG)',
  '// VOCABULARY STUDIO & SPEED REFLEX WORKSTATION (STUDY STUDIO 2026)'
);
code = code.replace(
  '// - Mobile Suit Gundam Mecha Launcher (Cử động xoay nòng ngắm mượt & Bắn chùm Beam Laser)',
  '// - Sói Mây Focus Companion (Cử động xoay theo từ rơi & Tia phản xạ tri thức)'
);
code = code.replace(
  '// - Đấu trường Game Arena mở rộng to, rộng rãi, chuẩn không gian vũ trụ Gundam',
  '// - Studio luyện phản xạ chính tả & tốc độ gõ chuẩn EdTech 2026'
);

// 6. Update spawnShootProjectile colors and description
code = code.replace('const barrelLen = 78; // Chiều dài nòng Beam Rifle', 'const barrelLen = 50; // Khoảng cách từ Sói Mây');
code = code.replace('// Chớp sáng đầu nòng súng Beam Rifle', '// Chớp sáng hạt năng lượng tri thức');
code = code.replace('// Viên đạn xanh Beam Laser bay vào ô chữ', '// Luồng sáng phản xạ bay vào ô chữ');

fs.writeFileSync(file, code, 'utf8');
console.log('js/vocab-game-workstation.js modernized successfully!');
