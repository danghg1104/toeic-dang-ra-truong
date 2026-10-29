const fs = require('fs');

// 1. Update js/vocab-game-workstation.js
let vgw = fs.readFileSync('js/vocab-game-workstation.js', 'utf8');
const vgwTarget = '<button onclick="VocabGameWorkstation.exitToConfig()"';
const vgwFocusBtn = `<button onclick="window.StudyFocusEngine && StudyFocusEngine.toggle('Vocabulary Studio: ' + (VocabGameWorkstation.selectedTopic || 'Reflex'))" 
                            class="px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer mr-2"
                            title="Bật/Tắt Chế độ tập trung học sâu (Alt+Z)">
                            <i class="fa-solid fa-eye text-cyan-400 text-xs"></i>
                            <span class="hidden sm:inline">Tập trung</span>
                        </button>\n                        ` + vgwTarget;

if (!vgw.includes('Vocabulary Studio: \' + (VocabGameWorkstation') && vgw.includes(vgwTarget)) {
  vgw = vgw.replace(vgwTarget, vgwFocusBtn);
  fs.writeFileSync('js/vocab-game-workstation.js', vgw, 'utf8');
  console.log('1. Added Focus button to vocab-game-workstation.js');
}

// 2. Update js/dailydictation-workstation.js
let ddw = fs.readFileSync('js/dailydictation-workstation.js', 'utf8');
const ddwTarget = '<div class="flex items-center border-b border-slate-200 dark:border-slate-800 mb-0">';
const ddwReplacement = `<div class="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 mb-0">
                    <div class="flex items-center">`;
const ddwTabEnd = `</button>
                </div>`;

const ddwReplacementEnd = `</button>
                    </div>
                    <button onclick="window.StudyFocusEngine && StudyFocusEngine.toggle('Chép chính tả: ' + (DailyDictationWorkstation.activeLesson ? DailyDictationWorkstation.activeLesson.name : 'Listening'))" 
                        class="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs mb-1 cursor-pointer"
                        title="Bật/Tắt Chế độ tập trung học sâu (Alt+Z)">
                        <i class="fa-solid fa-eye text-amber-600 dark:text-amber-400 text-xs"></i>
                        <span class="hidden sm:inline">Tập trung</span>
                    </button>
                </div>`;

if (ddw.includes(ddwTarget) && !ddw.includes('Chép chính tả: \' + (DailyDictationWorkstation')) {
  ddw = ddw.replace(ddwTarget, ddwReplacement);
  // replace the first closing of tabs
  const idx = ddw.indexOf(ddwTabEnd);
  if (idx !== -1) {
    ddw = ddw.substring(0, idx) + ddwReplacementEnd + ddw.substring(idx + ddwTabEnd.length);
    fs.writeFileSync('js/dailydictation-workstation.js', ddw, 'utf8');
    console.log('2. Added Focus button to dailydictation-workstation.js');
  }
}

console.log('Focus buttons integrated successfully!');
