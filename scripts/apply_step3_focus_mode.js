const fs = require('fs');

// 1. Update index.html: Include js/study-focus-engine.js in head
let html = fs.readFileSync('index.html', 'utf8');

if (!html.includes('js/study-focus-engine.js')) {
  const targetScript = '<script src="js/auth-sync-manager.js?v=studystudio_20261029_step2_perfect"></script>';
  const newScript = targetScript + '\n    <script src="js/study-focus-engine.js?v=studystudio_20261029_step3_zen"></script>';
  html = html.replace(targetScript, newScript);
  console.log('1. Included study-focus-engine.js in index.html head!');
}

// 2. Add Focus button to toeicListeningWorkstation header in index.html
const tlwTarget = '<button type="button" id="tlwBtnExplanation"';
const tlwFocusBtn = `<button type="button" onclick="StudyFocusEngine.toggle('Phòng Luyện Nghe: ' + (document.getElementById('tlwTitle')?.textContent || 'Listening'))" class="px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 text-xs sm:text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer" title="Bật/Tắt Chế độ tập trung học sâu (Alt+Z)">
                    <i class="fa-solid fa-eye text-xs text-cyan-400"></i>
                    <span class="hidden sm:inline">Tập trung</span>
                </button>\n                ` + tlwTarget;

if (!html.includes('Phòng Luyện Nghe:') && html.includes(tlwTarget)) {
  html = html.replace(tlwTarget, tlwFocusBtn);
  console.log('2. Added Focus button to toeicListeningWorkstation header!');
}

// 3. Add Focus button to toeicReadingWorkstation header in index.html
const trwTarget = '<button type="button" id="trwBtnExplanation"';
const trwFocusBtn = `<button type="button" onclick="StudyFocusEngine.toggle('Phòng Luyện Đọc: ' + (document.getElementById('trwTitle')?.textContent || 'Reading'))" class="px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-cyan-300 text-xs sm:text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer" title="Bật/Tắt Chế độ tập trung học sâu (Alt+Z)">
                    <i class="fa-solid fa-eye text-xs text-cyan-400"></i>
                    <span class="hidden sm:inline">Tập trung</span>
                </button>\n                ` + trwTarget;

if (!html.includes('Phòng Luyện Đọc:') && html.includes(trwTarget)) {
  html = html.replace(trwTarget, trwFocusBtn);
  console.log('3. Added Focus button to toeicReadingWorkstation header!');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('index.html updated successfully!');

// 4. Update js/grammar-module.js: Add Focus Mode button to Grammar Practice toolbar
let grammarJs = fs.readFileSync('js/grammar-module.js', 'utf8');
const grammarTarget = '<button onclick="GrammarEngine.toggleTheoryDrawer(true)"';
const grammarFocusBtn = `<button type="button" onclick="StudyFocusEngine.toggle('Ngữ pháp: ' + (GrammarEngine.topic ? GrammarEngine.topic.title : 'Part 5'))" class="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer" title="Bật/Tắt Chế độ tập trung học sâu (Alt+Z)">
                                    <i class="fa-solid fa-eye text-[11px] text-amber-600 dark:text-amber-400"></i>
                                    <span>Tập trung</span>
                                </button>\n                                ` + grammarTarget;

if (!grammarJs.includes('Ngữ pháp: \' + (GrammarEngine.topic') && grammarJs.includes(grammarTarget)) {
  grammarJs = grammarJs.replace(grammarTarget, grammarFocusBtn);
  fs.writeFileSync('js/grammar-module.js', grammarJs, 'utf8');
  console.log('4. Added Focus button to Grammar Practice in grammar-module.js!');
}

// 5. Update js/vocabulary-module.js: Add Focus Mode button and sanitize Mẹo nhớ
let vocabJs = fs.readFileSync('js/vocabulary-module.js', 'utf8');
vocabJs = vocabJs.replace('Mẹo nhớ siêu tốc', 'Mẹo ghi nhớ liên tưởng (Mnemonic Hook)');
vocabJs = vocabJs.replace('💡 MẸO NHỚ SIÊU TỐC', '💡 MẸO GHI NHỚ LIÊN TƯỞNG');

const vocabTarget = '<button onclick="VocabularyEngine.toggleAutoPronounce()"';
const vocabFocusBtn = `<button type="button" onclick="StudyFocusEngine.toggle('Từ vựng: ' + (VocabularyEngine.currentTopic ? VocabularyEngine.currentTopic.name : 'Vocabulary'))" class="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer" title="Bật/Tắt Chế độ tập trung học sâu (Alt+Z)">
                                    <i class="fa-solid fa-eye text-[11px] text-amber-600 dark:text-amber-400"></i>
                                    <span>Tập trung</span>
                                </button>\n                            ` + vocabTarget;

if (!vocabJs.includes('Từ vựng: \' + (VocabularyEngine.currentTopic') && vocabJs.includes(vocabTarget)) {
  vocabJs = vocabJs.replace(vocabTarget, vocabFocusBtn);
}
fs.writeFileSync('js/vocabulary-module.js', vocabJs, 'utf8');
console.log('5. Updated vocabulary-module.js with Focus button and sanitized microcopy!');
