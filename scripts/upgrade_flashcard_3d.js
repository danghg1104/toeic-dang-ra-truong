const fs = require('fs');
const path = require('path');

const vocabFile = path.join(__dirname, '..', 'js', 'vocabulary-module.js');
let code = fs.readFileSync(vocabFile, 'utf8');

console.log('🚀 Đang nâng cấp Flashcard 3D True GPU Transform cho js/vocabulary-module.js...');

// 1. Nâng cấp renderTabWordHtml
const oldRenderTabWordStart = "// TAB 1: 3D FLASHCARD (LẬT THẺ TRỰC QUAN)";
const oldRenderTabWordEnd = "// TAB 2: BÀI HỌC SÂU ĐA TẦNG (DEEP LEARNING WALKTHROUGH)";

const sIdx = code.indexOf(oldRenderTabWordStart);
const eIdx = code.indexOf(oldRenderTabWordEnd, sIdx);

if (sIdx === -1 || eIdx === -1) {
    console.error('ERROR: Không tìm thấy renderTabWordHtml block!', { sIdx, eIdx });
    process.exit(1);
}

const newRenderTabWordBlock = `// TAB 1: 3D FLASHCARD (LẬT THẺ TRỰC QUAN - TRUE GPU 3D ACCELERATED)
        renderTabWordHtml(w) {
            const isFlipped = this.isFlipped;
            const primaryExample = (w.examples && w.examples[0]) ? w.examples[0] : { en: 'This term is widely used in business communication.', vi: 'Thuật ngữ này được dùng phổ biến trong giao tiếp công sở.' };

            return \`
                <!-- Flashcard 3D Perspective Stage -->
                <div class="flex flex-col items-center justify-center min-h-[440px] max-w-xl mx-auto" style="perspective: 1200px; -webkit-perspective: 1200px;">
                    <!-- 3D Card Flipper Object -->
                    <div id="flashcard3DFlipper" 
                        class="w-full relative cursor-pointer select-none"
                        style="min-height: 440px; transform-style: preserve-3d; -webkit-transform-style: preserve-3d; transition: transform 0.5s cubic-bezier(0.34, 1.4, 0.64, 1); will-change: transform; transform: \${isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};"
                        onclick="VocabularyEngine.flipCard()">
                        
                        <!-- ============================================== -->
                        <!-- 1. MẶT TRƯỚC (FRONT FACE - ENGLISH & AUDIO)    -->
                        <!-- ============================================== -->
                        <div class="absolute inset-0 w-full h-full rounded-3xl border-2 border-indigo-100 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50/50 to-indigo-50/30 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 p-7 sm:p-9 shadow-xl flex flex-col justify-between"
                            style="backface-visibility: hidden; -webkit-backface-visibility: hidden; transform: rotateY(0deg);">
                            
                            <!-- Front Header -->
                            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                <div class="flex items-center gap-2">
                                    <span class="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-extrabold text-[11px] uppercase tracking-wider border border-indigo-200/80 dark:border-indigo-800">
                                        \${w.type || 'Word'}
                                    </span>
                                    <span class="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-bold text-[10px]">
                                        ETS 2026 Core
                                    </span>
                                </div>
                                <span class="text-xs text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1.5 animate-pulse">
                                    <i class="fa-solid fa-arrows-rotate text-[11px]"></i>
                                    <span>Chạm để lật</span>
                                </span>
                            </div>

                            <!-- Front Core: Headword & IPA -->
                            <div class="py-6 text-center my-auto space-y-3">
                                <h2 class="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight drop-shadow-xs">
                                    \${w.word}
                                </h2>
                                <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                    <span>US \${w.ipaUS || ''}</span>
                                    <span class="text-slate-300 dark:text-slate-600">•</span>
                                    <span>UK \${w.ipaUK || ''}</span>
                                </div>

                                <!-- Audio Pronunciation Buttons -->
                                <div class="flex items-center justify-center gap-3 pt-2" onclick="event.stopPropagation()">
                                    <button type="button" onclick="VocabularyEngine.speakWord('\${w.word}', 'US')" class="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-indigo-300 border border-indigo-200 dark:border-slate-700 text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-2xs">
                                        <i class="fa-solid fa-volume-high text-xs text-indigo-600 dark:text-indigo-400"></i>
                                        <span>US (Mỹ)</span>
                                    </button>
                                    <button type="button" onclick="VocabularyEngine.speakWord('\${w.word}', 'UK')" class="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-slate-800 dark:hover:bg-slate-750 dark:text-indigo-300 border border-indigo-200 dark:border-slate-700 text-xs font-bold flex items-center gap-2 transition active:scale-95 shadow-2xs">
                                        <i class="fa-solid fa-volume-high text-xs text-indigo-600 dark:text-indigo-400"></i>
                                        <span>UK (Anh)</span>
                                    </button>
                                </div>
                            </div>

                            <!-- Front Footer: Tip & Action Button -->
                            <div class="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-col items-center gap-3">
                                <div class="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                                    <img src="assets/mascot/may_reading.png" alt="Sói Mây" class="w-4 h-4 object-contain">
                                    <span>Sói Mây: Ghi nhớ phát âm trước khi lật xem nghĩa tiếng Việt</span>
                                </div>
                                <button type="button" onclick="VocabularyEngine.flipCard()" class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md shadow-indigo-500/25 flex items-center gap-2 transition active:scale-95 cursor-pointer">
                                    <i class="fa-solid fa-repeat"></i>
                                    <span>Lật thẻ xem nghĩa (Phím Space)</span>
                                </button>
                            </div>
                        </div>

                        <!-- ============================================== -->
                        <!-- 2. MẶT SAU (BACK FACE - MEANING, EX & HOOK)    -->
                        <!-- ============================================== -->
                        <div class="absolute inset-0 w-full h-full rounded-3xl border-2 border-indigo-200 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/95 via-white to-purple-50/90 dark:from-slate-900 dark:via-slate-850 dark:to-indigo-950/40 p-6 sm:p-8 shadow-xl flex flex-col justify-between overflow-y-auto custom-scrollbar"
                            style="backface-visibility: hidden; -webkit-backface-visibility: hidden; transform: rotateY(180deg);">
                            
                            <!-- Back Header -->
                            <div class="flex items-center justify-between pb-2 border-b border-indigo-100 dark:border-slate-800">
                                <div class="flex items-center gap-2">
                                    <span class="text-sm font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-wider">\${w.word}</span>
                                    <span class="text-xs text-slate-400">\${w.type ? '(' + w.type + ')' : ''}</span>
                                </div>
                                <span class="px-3.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-black shadow-xs">
                                    \${w.vietnameseMeaning}
                                </span>
                            </div>

                            <!-- Back Content Blocks -->
                            <div class="space-y-3 py-3 text-left">
                                <!-- Định nghĩa chuẩn -->
                                <div class="p-3 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-indigo-100 dark:border-slate-700/80 shadow-2xs space-y-1">
                                    <div class="text-[10.5px] font-black uppercase text-indigo-700 dark:text-indigo-300 tracking-wider">Định nghĩa Cambridge:</div>
                                    <p class="text-xs text-slate-700 dark:text-slate-300 italic leading-relaxed">\${w.englishDefinition}</p>
                                </div>

                                <!-- Ví dụ ngữ cảnh ETS -->
                                <div class="p-3 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-emerald-100 dark:border-slate-700/80 shadow-2xs space-y-1">
                                    <div class="text-[10.5px] font-black uppercase text-emerald-700 dark:text-emerald-300 tracking-wider">Ví dụ ngữ cảnh công sở:</div>
                                    <p class="text-xs font-bold text-slate-800 dark:text-white leading-relaxed">\${primaryExample.en}</p>
                                    <p class="text-[11.5px] text-slate-600 dark:text-slate-400">\${primaryExample.vi}</p>
                                </div>

                                <!-- Mẹo ghi nhớ Mnemonic Hook -->
                                <div class="p-2.5 rounded-2xl bg-amber-50/90 dark:bg-slate-800/90 border border-amber-200/70 dark:border-slate-700 text-xs text-amber-900 dark:text-amber-300 font-semibold flex items-start gap-2 shadow-2xs">
                                    <span class="text-amber-500 text-sm shrink-0">💡</span>
                                    <div class="leading-relaxed">
                                        <strong class="font-bold text-amber-800 dark:text-amber-200">Mẹo ghi nhớ liên tưởng:</strong> \${w.memoryHook || 'Liên hệ từ vựng với văn cảnh hợp đồng và công việc hàng ngày.'}
                                    </div>
                                </div>
                            </div>

                            <!-- Back Footer: Flip Back Button -->
                            <div class="pt-2 border-t border-indigo-100 dark:border-slate-800 text-center" onclick="event.stopPropagation()">
                                <button type="button" onclick="VocabularyEngine.flipCard()" class="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-750 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs inline-flex items-center gap-1.5 transition active:scale-95 cursor-pointer">
                                    <i class="fa-solid fa-arrow-rotate-left"></i>
                                    <span>Lật lại mặt trước (Space)</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            \`;
        },

        `;

code = code.slice(0, sIdx) + newRenderTabWordBlock + code.slice(eIdx);

// 2. Nâng cấp hàm flipCard() để chạy GPU Transform mà KHÔNG render lại toàn bộ DOM
const oldFlipBlock = `        flipCard() {
            this.isFlipped = !this.isFlipped;
            this.renderStudyWorkspace();
            this.playFlipSound();
        },`;

const newFlipBlock = `        flipCard() {
            this.isFlipped = !this.isFlipped;
            const flipper = document.getElementById('flashcard3DFlipper');
            if (flipper) {
                flipper.style.transform = this.isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
            } else {
                this.renderStudyWorkspace();
            }
            this.playFlipSound();
        },`;

if (code.includes(oldFlipBlock)) {
    code = code.replace(oldFlipBlock, newFlipBlock);
    console.log('✅ Đã thay thế hàm flipCard() sang GPU-only transform!');
} else {
    console.warn('⚠️ Không tìm thấy oldFlipBlock chính xác, đang kiểm tra thủ công...');
}

fs.writeFileSync(vocabFile, code, 'utf8');
console.log('🎉 Đã hoàn tất nâng cấp Flashcard 3D True GPU Transform!');
