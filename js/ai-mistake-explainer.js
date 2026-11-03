/**
 * =========================================================================
 * AI "VÌ SAO EM SAI?" EXPLANATION MODAL & CLIENT HELPER
 * =========================================================================
 * Phân tích lỗi sai tâm lý sinh viên bằng Gemini 3.8 Flash (3-Tier Fallback):
 * - Vạch trần tâm lý vì sao chọn sai (bẫy đồng âm, nhìn thấy từ quen là bấm vội)
 * - Đưa ra "thần chú" khắc phục bẫy ETS ngắn gọn
 * =========================================================================
 */

(function (window, document) {
    'use strict';

    class AiMistakeExplainerClass {
        constructor() {
            this.modalId = 'aiMistakeExplainerModal';
        }

        createModalDOM() {
            if (document.getElementById(this.modalId)) return;

            const modal = document.createElement('div');
            modal.id = this.modalId;
            modal.className = 'fixed inset-0 z-[11500] hidden flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-md transition-all duration-300';
            modal.innerHTML = `
                <div class="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-slate-900 to-purple-950 text-white rounded-3xl border border-purple-500/40 shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                    <!-- Top Header -->
                    <div class="p-4 sm:p-5 border-b border-purple-500/20 flex items-center justify-between bg-slate-950/60">
                        <div class="flex items-center gap-2.5">
                            <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-md text-lg">
                                🤖
                            </div>
                            <div>
                                <h3 class="text-base font-black text-white flex items-center gap-2">
                                    Gia Sư AI: Vì Sao Em Sai?
                                    <span class="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-bold uppercase tracking-wider" id="aiProviderBadge">
                                        Gemini 3.8 Flash
                                    </span>
                                </h3>
                                <p class="text-xs text-slate-400">Bắt đúng tâm lý · Vạch trần bẫy ETS · Hài hước dễ nhớ</p>
                            </div>
                        </div>
                        <button onclick="window.AiMistakeExplainer.close()" class="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition cursor-pointer">
                            <i class="fa-solid fa-xmark text-sm"></i>
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                        <!-- Question Recap -->
                        <div class="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5 text-xs text-slate-300">
                            <div class="font-bold text-white flex items-center gap-2">
                                <span class="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-black uppercase" id="aiExplPart">
                                    Part 5
                                </span>
                                <span id="aiExplTrap" class="text-amber-300">Bẫy Ngữ Pháp</span>
                            </div>
                            <p class="text-slate-200 italic line-clamp-3" id="aiExplQuestion">Nội dung câu hỏi...</p>
                            <div class="flex items-center gap-4 pt-1 font-semibold text-[11px]">
                                <span class="text-rose-400" id="aiExplUserAnswer">Em chọn: A</span>
                                <span class="text-emerald-400" id="aiExplCorrectAnswer">Đáp án đúng: C</span>
                            </div>
                        </div>

                        <!-- Mascot & AI Answer Box -->
                        <div class="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-purple-900/30 via-indigo-900/20 to-slate-900/40 border border-purple-500/30 relative">
                            <div id="aiExplLoading" class="flex items-center justify-center py-6 gap-2 text-xs font-bold text-purple-300">
                                <span class="w-2 h-2 rounded-full bg-purple-400 animate-ping"></span>
                                <span>Gia sư Sói Mây đang phân tích tâm lý của em...</span>
                            </div>
                            <div id="aiExplContent" class="hidden text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2">
                                <!-- Explanation text -->
                            </div>
                        </div>
                    </div>

                    <!-- Footer Action -->
                    <div class="p-4 border-t border-purple-500/20 bg-slate-950/40 flex items-center justify-between">
                        <span class="text-[11px] text-slate-400 flex items-center gap-1">
                            💡 <span>Tip: Đọc kỹ thần chú để không mất điểm oan!</span>
                        </span>
                        <button onclick="window.AiMistakeExplainer.close()" class="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition cursor-pointer">
                            Đã Hiểu, Cảm Ơn Thầy!
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }

        async explain({ question, userAnswer, correctAnswer, part = 5, trapCategory = 'Bẫy tử huyệt' }) {
            this.createModalDOM();
            const modal = document.getElementById(this.modalId);
            if (modal) modal.classList.remove('hidden');

            const partEl = document.getElementById('aiExplPart');
            const trapEl = document.getElementById('aiExplTrap');
            const qEl = document.getElementById('aiExplQuestion');
            const uaEl = document.getElementById('aiExplUserAnswer');
            const caEl = document.getElementById('aiExplCorrectAnswer');
            const loadingEl = document.getElementById('aiExplLoading');
            const contentEl = document.getElementById('aiExplContent');
            const badgeEl = document.getElementById('aiProviderBadge');

            if (partEl) partEl.textContent = `Part ${part}`;
            if (trapEl) trapEl.textContent = trapCategory;
            if (qEl) qEl.textContent = question || 'Câu hỏi luyện tập';
            if (uaEl) uaEl.textContent = `Em chọn (Sai): ${userAnswer}`;
            if (caEl) caEl.textContent = `Đáp án đúng: ${correctAnswer}`;

            if (loadingEl) loadingEl.classList.remove('hidden');
            if (contentEl) {
                contentEl.classList.add('hidden');
                contentEl.innerHTML = '';
            }

            try {
                const res = await fetch('/api/ai/explain-mistake', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ question, userAnswer, correctAnswer, part, trapCategory })
                });

                const data = await res.json();
                if (loadingEl) loadingEl.classList.add('hidden');
                if (contentEl) {
                    contentEl.classList.remove('hidden');
                    const text = data.explanation || 'Không lấy được lời giải thích lúc này.';
                    contentEl.innerHTML = text.replace(/\n/g, '<br>');
                }
                if (badgeEl && data.provider) {
                    badgeEl.textContent = data.provider === 'gemini-3.8-flash' ? 'Gemini 3.8 Flash ⚡' :
                                          data.provider === 'openrouter' ? 'OpenRouter AI 🌐' : 'Sói Mây Offline 🛡️';
                }
            } catch (err) {
                if (loadingEl) loadingEl.classList.add('hidden');
                if (contentEl) {
                    contentEl.classList.remove('hidden');
                    contentEl.textContent = 'Ối dồi ôi! Mạng hơi chập chờn nhưng lời khuyên của Sói Mây là: Câu này em đọc vội quá nên bắt nhầm keyword lừa rồi, bình tĩnh đọc kỹ từng phương án nhé!';
                }
            }
        }

        close() {
            const modal = document.getElementById(this.modalId);
            if (modal) modal.classList.add('hidden');
        }
    }

    window.AiMistakeExplainer = new AiMistakeExplainerClass();
    window.askAiWhyWrong = (args) => window.AiMistakeExplainer.explain(args);

})(window, document);
