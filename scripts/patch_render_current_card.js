const fs = require('fs');

const path = 'js/tinder-flashcards-3d.js';
let content = fs.readFileSync(path, 'utf8');

const targetStart = '      this.containerEl.innerHTML = `\n        <div class="flashcard-stage">';
const targetEnd = '      this.cardEl = document.getElementById(\'activeTinderCard\');';

const startIdx = content.indexOf(targetStart);
const endIdx = content.indexOf(targetEnd, startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const replacement = `      const progressPercent = Math.round(((this.currentIndex + 1) / this.deck.length) * 100);

      this.containerEl.innerHTML = \`
        <div class="flashcard-stage">
          <div id="activeTinderCard" class="flashcard-card">
            <!-- Front Face -->
            <div class="flashcard-face flashcard-front bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 justify-between shadow-xl">
              <!-- Badges for visual swipe cues -->
              <div class="swipe-badge-thuoc" id="badgeThuoc">ĐÃ THUỘC ✓</div>
              <div class="swipe-badge-chua" id="badgeChua">CHƯA THUỘC ✕</div>

              <!-- Top Bar & Progress -->
              <div>
                <div class="flex items-center justify-between mb-2">
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase border \${tierBadgeClass}">
                    \${tier}
                  </span>
                  <span class="text-xs font-mono text-slate-500 dark:text-slate-400 font-bold">
                    \${this.currentIndex + 1} / \${this.deck.length}
                  </span>
                </div>
                <div class="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div class="bg-indigo-600 h-full rounded-full transition-all duration-300" style="width: \${progressPercent}%"></div>
                </div>
              </div>

              <!-- Center Word Info -->
              <div class="text-center my-auto py-3 space-y-2">
                <div class="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  \${word}
                </div>
                <div class="flex items-center justify-center gap-2">
                  <span class="text-sm font-mono text-indigo-600 dark:text-indigo-400 font-bold">\${ipa}</span>
                  <span class="text-xs text-slate-400 italic font-semibold">(\${pos})</span>
                </div>
                \${collocation ? \`
                  <div class="pt-1.5">
                    <span class="inline-block px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      Collocation: <strong class="text-indigo-600 dark:text-indigo-400">\${collocation}</strong>
                    </span>
                  </div>
                \` : ''}
              </div>

              <!-- Bottom Interactive Action Buttons -->
              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div class="flex items-center justify-between gap-2">
                  <button type="button" onclick="event.stopPropagation(); window.tinderFlashcardsInstance && window.tinderFlashcardsInstance.swipe('left')" class="flex-1 py-2.5 px-2 rounded-xl bg-rose-50 hover:bg-rose-100 active:scale-95 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs" title="Chưa thuộc (Hoặc vuốt sang trái)">
                    <span>✕ Chưa thuộc</span>
                  </button>
                  <button type="button" onclick="event.stopPropagation(); window.tinderFlashcardsInstance && window.tinderFlashcardsInstance.flip()" class="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs" title="Chạm để lật mặt sau">
                    <span>🔄 Lật nghĩa</span>
                  </button>
                  <button type="button" onclick="event.stopPropagation(); window.tinderFlashcardsInstance && window.tinderFlashcardsInstance.swipe('right')" class="flex-1 py-2.5 px-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs" title="Đã thuộc (Hoặc vuốt sang phải)">
                    <span>✓ Đã thuộc</span>
                  </button>
                </div>
                <div class="text-[10px] text-slate-400 text-center font-medium">
                  👈 Vuốt trái = Chưa thuộc · 👉 Vuốt phải = Đã thuộc
                </div>
              </div>
            </div>

            <!-- Back Face -->
            <div class="flashcard-face flashcard-back bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 justify-between shadow-xl">
              <!-- Top Bar -->
              <div>
                <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-2">
                  <div class="flex items-center gap-2">
                    <span class="text-base font-black text-indigo-600 dark:text-indigo-400">\${word}</span>
                    <span class="text-xs text-slate-400 font-mono">\${ipa}</span>
                  </div>
                  <span class="text-xs font-mono text-slate-400 font-semibold">
                    Mặt sau
                  </span>
                </div>
              </div>

              <!-- Meaning & Context -->
              <div class="space-y-3 my-auto text-left">
                <div>
                  <div class="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Nghĩa tiếng Việt</div>
                  <div class="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">\${meaning}</div>
                </div>

                <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                  <div class="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold uppercase">Ví dụ đề thi ETS</div>
                  <div class="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">\${example}</div>
                  \${exampleVi ? \`<div class="text-slate-500 italic text-[11px] pt-1 border-t border-slate-200/50 dark:border-slate-700/50">\${exampleVi}</div>\` : ''}
                </div>
              </div>

              <!-- Back Action Bar -->
              <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <button type="button" onclick="event.stopPropagation(); window.tinderFlashcardsInstance && window.tinderFlashcardsInstance.swipe('left')" class="flex-1 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 active:scale-95 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs">
                  <span>✕ Chưa thuộc</span>
                </button>
                <button type="button" onclick="event.stopPropagation(); window.tinderFlashcardsInstance && window.tinderFlashcardsInstance.flip()" class="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-95 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs">
                  <span>🔄 Lật lại</span>
                </button>
                <button type="button" onclick="event.stopPropagation(); window.tinderFlashcardsInstance && window.tinderFlashcardsInstance.swipe('right')" class="flex-1 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs">
                  <span>✓ Đã thuộc</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      \`;

`;
  content = content.slice(0, startIdx) + replacement + content.slice(endIdx);
  fs.writeFileSync(path, content, 'utf8');
  console.log('Successfully updated renderCurrentCard in js/tinder-flashcards-3d.js');
} else {
  console.error('Could not find slice boundaries for renderCurrentCard');
}
