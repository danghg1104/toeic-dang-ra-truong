/**
 * =========================================================================
 * MODULE HỌC & LUYỆN TẬP NGỮ PHÁP CHUYÊN SÂU (HIGH-END EDTECH STANDARD)
 * Kiến trúc theo chuẩn EdTech hiện đại & PassToeic.vn
 * 
 * Hỗ trợ Dynamic Routing & Dynamic Data Store cho 35+ Chuyên đề Ngữ pháp
 * - Màn hình 1: Lý thuyết Chuyên sâu & Chiến thuật (/grammar/[topic-slug])
 * - Màn hình 2: Đấu trường Luyện tập 2 Cột chuẩn thi (/grammar/[topic-slug]/practice)
 * - Quản lý State độc lập theo slug trong localStorage (grammar_progress_${slug})
 * - 404 Empty State bảo vệ khi slug không tồn tại (Không fallback âm thầm)
 * =========================================================================
 */

(function () {
    /**
     * Bộ lọc làm sạch công thức ngữ pháp: Loại bỏ hoàn toàn ký hiệu LaTeX ($...$, \text{}, \mathbf{}, v.v.)
     * Hiển thị chuẩn xác công thức tiếng Anh rõ nét, thanh lịch theo đúng EdTech UI.
     */
    function cleanFormula(str) {
        if (!str || typeof str !== 'string') return str || '';
        let s = str;
        s = s.replace(/\\rightarrow/g, ' → ');
        s = s.replace(/\\leftarrow/g, ' ← ');
        s = s.replace(/V_\{?ed\}?/gi, 'V-ed');
        s = s.replace(/V_\{?bare\}?/gi, 'V (bare)');
        s = s.replace(/V_\{?inf\}?/gi, 'V (inf)');
        s = s.replace(/V_\{?3\}?/g, 'V3');
        s = s.replace(/V_\{?2\}?/g, 'V2');
        s = s.replace(/V_\{([^}]+)\}/g, 'V ($1)');
        let prev;
        do {
            prev = s;
            s = s.replace(/\\(?:text|mathbf|textbf|mathit)\{([^{}]+)\}/g, '$1');
        } while (s !== prev);
        s = s.replace(/V_\{([^}]+)\}/g, 'V ($1)');
        s = s.replace(/\\\s/g, ' ');
        s = s.replace(/\\-/g, '-');
        s = s.replace(/\\/g, '');
        s = s.replace(/(^|[^0-9$])\$([^\d$])/g, '$1$2');
        s = s.replace(/([^\d$])\$(?=[^0-9$]|$)/g, '$1');
        s = s.replace(/^\$(?!\d)/, '');
        s = s.replace(/(?<!\d)\$$/, '');
        s = s.replace(/\$(?!\d)/g, '');
        return s.replace(/\s+/g, ' ').trim();
    }
    window.cleanGrammarFormula = cleanFormula;

    /**
     * Helper sinh bộ 50 câu hỏi cho từng chuyên đề dựa trên dữ liệu lý thuyết
     */
    function buildTopicQuestions(topic) {
        if (!topic) return [];
        const baseQuestions = (topic.questions || []).map((q, idx) => ({
            id: q.id || (idx + 1),
            part: q.part || 5,
            instruction: q.instruction || (topic.targetTags ? topic.targetTags.join(' · ') + ' Part 5' : 'CHỌN ĐÁP ÁN ĐÚNG ĐỂ HOÀN THÀNH CÂU'),
            questionText: q.questionText || q.question || '',
            translationVi: q.translationVi || q.vietnameseTranslation || '',
            options: (q.options || []).map(opt => ({
                key: opt.key,
                text: opt.text,
                inlineExplanation: opt.inlineExplanation || opt.explanation || ''
            })),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation || '',
            reasoning: {
                step1_slotAnalysis: q.threeStepReasoning ? q.threeStepReasoning.step1 : (q.reasoning ? q.reasoning.step1_slotAnalysis : 'Phân tích thành phần ngữ pháp và vị trí của chỗ trống trong câu.'),
                step2_tenseAnalysis: {
                    text: q.threeStepReasoning ? q.threeStepReasoning.step2 : (q.reasoning && q.reasoning.step2_tenseAnalysis ? q.reasoning.step2_tenseAnalysis.text : 'Xác định dấu hiệu ngữ cảnh, thì và dạng thức phù hợp.'),
                    eliminatedKeys: (q.reasoning && q.reasoning.step2_tenseAnalysis && q.reasoning.step2_tenseAnalysis.eliminatedKeys) || []
                },
                step3_subjectVerbAgreement: {
                    text: q.threeStepReasoning ? q.threeStepReasoning.step3 : (q.reasoning && q.reasoning.step3_subjectVerbAgreement ? q.reasoning.step3_subjectVerbAgreement.text : 'Áp dụng quy tắc vàng và chốt phương án chính xác nhất.'),
                    eliminatedKeys: (q.reasoning && q.reasoning.step3_subjectVerbAgreement && q.reasoning.step3_subjectVerbAgreement.eliminatedKeys) || []
                },
                finalConclusion: q.explanation || 'Đáp án chính xác được xác định rõ ràng qua 3 bước suy luận.'
            },
            recapNote: q.recapNote || (topic.goldenRule ? topic.goldenRule.note : topic.description)
        }));

        const targetCount = topic.totalQuestions || 50;
        if (baseQuestions.length >= targetCount) {
            return baseQuestions.slice(0, targetCount);
        }

        // Tạo thêm câu hỏi dựa trên examples, traps và formulas của chính topic đó
        const extraQuestions = [];
        const examples = topic.examples || [];
        const traps = topic.traps || [];
        const formulas = (topic.goldenRule && topic.goldenRule.formulas) || [];

        const startId = baseQuestions.length + 1;
        for (let i = startId; i <= targetCount; i++) {
            const exIndex = (i - startId) % Math.max(1, examples.length);
            const trapIndex = (i - startId) % Math.max(1, traps.length);
            const ex = examples[exIndex] || {
                sentenceEn: 'The company management regularly reviews our operational standards to ensure maximum compliance.',
                sentenceVi: 'Ban quản lý công ty thường xuyên rà soát các tiêu chuẩn vận hành để đảm bảo tính tuân thủ tối đa.',
                highlightRule: topic.title
            };
            const trap = traps[trapIndex] || {
                title: 'Bẫy đề thi điển hình',
                explanation: 'Cần chú ý sự hòa hợp và dấu hiệu nhận biết.',
                wrongExample: 'incorrect usage',
                rightExample: 'correct usage'
            };

            // Tạo câu hỏi thực hành dựa trên ví dụ của chuyên đề
            let qText = ex.sentenceEn || ex.en || '';
            const words = qText.split(' ');
            let targetWord = 'reviews';
            if (words.length > 5) {
                // Đục lỗ một động từ/từ khóa chính
                const targetIdx = Math.min(3, words.length - 2);
                targetWord = words[targetIdx].replace(/[.,]/g, '');
                words[targetIdx] = '_______';
                qText = words.join(' ');
            } else {
                qText = `All staff members must _______ the regulations outlined in the ${topic.title.toLowerCase()}.`;
                targetWord = 'observe';
            }

            const optA = targetWord;
            const optB = targetWord.endsWith('s') ? targetWord.slice(0, -1) : targetWord + 's';
            const optC = targetWord + 'ing';
            const optD = targetWord + 'ed';

            extraQuestions.push({
                id: i,
                part: 5,
                instruction: `CHUYÊN ĐỀ: ${topic.title.toUpperCase()}`,
                questionText: `[${i}/${targetCount}] ${qText}`,
                translationVi: ex.sentenceVi || ex.vi || `Câu hỏi áp dụng chuyên đề ${topic.title}.`,
                options: [
                    { key: 'A', text: optA, inlineExplanation: `Chính xác! Áp dụng đúng quy tắc cốt lõi của ${topic.title}.` },
                    { key: 'B', text: optB, inlineExplanation: `Chưa đúng dạng thức ngữ pháp cho chủ ngữ và ngữ cảnh này.` },
                    { key: 'C', text: optC, inlineExplanation: `Dạng đuôi -ing không phù hợp với vị trí động từ chính này.` },
                    { key: 'D', text: optD, inlineExplanation: `Sai thì hoặc sai dạng thức biến đổi.` }
                ],
                correctAnswer: 'A',
                explanation: `Áp dụng quy tắc ${topic.title}: ${trap.explanation || (topic.goldenRule && topic.goldenRule.note) || ''}`,
                reasoning: {
                    step1_slotAnalysis: `Vị trí chỗ trống cần từ loại và hình thái phù hợp trong cấu trúc của "${topic.title}".`,
                    step2_tenseAnalysis: {
                        text: `Xét ngữ cảnh: ${trap.title}. Chú ý phân biệt dạng chuẩn với dạng bẫy đề thi.`,
                        eliminatedKeys: ['C', 'D']
                    },
                    step3_subjectVerbAgreement: {
                        text: `Đối chiếu chủ ngữ và cấu trúc liên kết ➔ chọn dạng thức chính xác nhất (${optA}).`,
                        eliminatedKeys: ['B']
                    },
                    finalConclusion: `Đáp án A (${optA}) hoàn thiện câu chính xác theo đúng chuẩn ETS/VSTEP.`
                },
                recapNote: `${topic.title}: ${topic.goldenRule ? topic.goldenRule.note : 'Thực hành đều đặn để ghi nhớ sâu sắc.'}`
            });
        }

        return [...baseQuestions, ...extraQuestions];
    }

    // =========================================================================
    // STATE MANAGEMENT ENGINE
    // =========================================================================
    const GrammarEngine = {
        activeSlug: null,
        topic: null,
        questions: [],
        currentQuestionIndex: 0,
        selectedOption: null,
        isAnswered: false,
        isBilingual: false,
        instantExplainEnabled: true,
        isTheoryDrawerOpen: false,
        isQuestionMapOpen: false,
        questionStatusMap: {}, // id -> 'correct' | 'incorrect'
        savedBookmarks: {
            topics: [],
            questions: [],
            formulas: []
        },
        isNotFound: false,
        missingSlug: '',

        init() {
            this.loadGlobalBookmarks();
            this.setupPopstateListener();
            this.setupKeyboardListener();

            // Phân tích route hiện tại
            this.handleCurrentRoute(false);

            console.log('⚡ GrammarEngine initialized successfully with Dynamic Routing & Store.');
        },

        setupKeyboardListener() {
            window.addEventListener('keydown', (e) => {
                const vp = document.getElementById('view-grammar-practice');
                if (!vp || vp.classList.contains('hidden')) return;

                if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

                const key = (e.key || '').toUpperCase();
                if (['A', 'B', 'C', 'D'].includes(key)) {
                    this.selectOption(key);
                } else if (e.key === 'ArrowRight' || e.key === 'Enter') {
                    if (this.isAnswered) this.nextQuestion();
                } else if (e.key === 'ArrowLeft') {
                    this.prevQuestion();
                }
            });
        },

        loadGlobalBookmarks() {
            try {
                const b = localStorage.getItem('grammar_saved_bookmarks');
                if (b) {
                    const parsed = JSON.parse(b);
                    if (parsed.topics) this.savedBookmarks.topics = parsed.topics;
                    if (parsed.questions) this.savedBookmarks.questions = parsed.questions;
                    if (parsed.formulas) this.savedBookmarks.formulas = parsed.formulas;
                }
            } catch (e) {}
        },

        saveGlobalBookmarks() {
            try {
                localStorage.setItem('grammar_saved_bookmarks', JSON.stringify(this.savedBookmarks));
            } catch (e) {}
        },

        getTopicStorageKey(slug) {
            const userId = (window.currentUserAccount && window.currentUserAccount.id) ? window.currentUserAccount.id : 'guest';
            return `grammar_progress_${userId}_${slug}`;
        },

        loadTopicState(slug) {
            this.questionStatusMap = {};
            this.currentQuestionIndex = 0;
            this.selectedOption = null;
            this.isAnswered = false;

            if (!slug) return;
            try {
                const raw = localStorage.getItem(this.getTopicStorageKey(slug));
                if (raw) {
                    const parsed = JSON.parse(raw);
                    if (parsed.questionStatusMap) this.questionStatusMap = parsed.questionStatusMap;
                    if (typeof parsed.currentQuestionIndex === 'number') this.currentQuestionIndex = parsed.currentQuestionIndex;
                }
            } catch (e) {}
        },

        saveTopicState(slug) {
            const currentSlug = slug || this.activeSlug;
            if (!currentSlug) return;
            try {
                const payload = {
                    questionStatusMap: this.questionStatusMap,
                    currentQuestionIndex: this.currentQuestionIndex,
                    lastUpdated: Date.now()
                };
                localStorage.setItem(this.getTopicStorageKey(currentSlug), JSON.stringify(payload));
            } catch (e) {}
        },

        setupPopstateListener() {
            window.addEventListener('popstate', () => {
                this.handleCurrentRoute(false);
            });
        },

        // =========================================================================
        // ROUTE PARSING & VIEW ROUTER
        // =========================================================================
        parseRoute() {
            const path = (window.location && window.location.pathname) || '';
            const matchPractice = path.match(/^\/grammar\/([^/]+)\/practice\/?$/);
            if (matchPractice) {
                return { view: 'practice', slug: matchPractice[1] };
            }
            const matchTheory = path.match(/^\/grammar\/([^/]+)\/?$/);
            if (matchTheory) {
                return { view: 'theory', slug: matchTheory[1] };
            }
            if (path === '/grammar' || path === '/grammar/' || (window.location && window.location.hash === '#grammar')) {
                return { view: 'list' };
            }
            return null;
        },

        handleCurrentRoute(shouldScroll = true) {
            const route = this.parseRoute();
            if (!route) return;

            if (route.view === 'practice') {
                this.loadTopic(route.slug);
                this.showPracticeView(route.slug, shouldScroll);
            } else if (route.view === 'theory') {
                this.loadTopic(route.slug);
                this.showTheoryView(route.slug, shouldScroll);
            } else if (route.view === 'list') {
                this.navigateBackToTopics();
            }
        },

        loadTopic(slug) {
            if (!slug) {
                this.isNotFound = true;
                this.missingSlug = '';
                this.topic = null;
                this.questions = [];
                return false;
            }

            const cleanSlug = slug.trim().toLowerCase();
            let topicData = null;

            if (typeof window.getGrammarTopic === 'function') {
                topicData = window.getGrammarTopic(cleanSlug);
            } else if (window.grammarDatabase && window.grammarDatabase[cleanSlug]) {
                topicData = window.grammarDatabase[cleanSlug];
            }

            if (!topicData) {
                this.isNotFound = true;
                this.missingSlug = cleanSlug;
                this.topic = null;
                this.questions = [];
                this.activeSlug = cleanSlug;
                return false;
            }

            this.isNotFound = false;
            this.missingSlug = '';
            this.activeSlug = cleanSlug;
            this.topic = topicData;
            this.loadTopicState(cleanSlug);
            this.questions = buildTopicQuestions(topicData);
            return true;
        },

        navigateToTheory(slug) {
            const targetSlug = slug || 'present-tenses';
            try {
                window.history.pushState({ view: 'grammar-theory', slug: targetSlug }, '', `/grammar/${targetSlug}`);
            } catch (e) {}
            this.loadTopic(targetSlug);
            this.showTheoryView(targetSlug, true);
        },

        navigateToPractice(slug) {
            const targetSlug = slug || 'present-tenses';
            try {
                window.history.pushState({ view: 'grammar-practice', slug: targetSlug }, '', `/grammar/${targetSlug}/practice`);
            } catch (e) {}
            this.loadTopic(targetSlug);
            this.showPracticeView(targetSlug, true);
        },

        navigateBackToTopics() {
            try {
                window.history.pushState({}, '', '/grammar');
            } catch (e) {}
            this.hideAllGrammarViews();
            if (typeof switchTab === 'function') {
                switchTab('ngu-phap');
            } else {
                const el = document.getElementById('view-ngu-phap');
                if (el) el.classList.remove('hidden');
            }
            this.highlightSidebar();
            if (typeof renderAllGrammarGroups === 'function') {
                renderAllGrammarGroups();
            }
        },

        showTheoryView(slug, shouldScroll = true) {
            if (slug && (!this.topic || this.activeSlug !== slug)) {
                this.loadTopic(slug);
            }
            this.hideAllGrammarViews();
            const view = document.getElementById('view-grammar-theory');
            if (view) {
                view.classList.remove('hidden');
                if (this.isNotFound) {
                    this.renderNotFoundView(view);
                } else {
                    this.renderTheoryView();
                }
            }
            this.highlightSidebar();
            if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        showPracticeView(slug, shouldScroll = true) {
            if (slug && (!this.topic || this.activeSlug !== slug)) {
                this.loadTopic(slug);
            }
            this.hideAllGrammarViews();
            const view = document.getElementById('view-grammar-practice');
            if (view) {
                view.classList.remove('hidden');
                if (this.isNotFound) {
                    this.renderNotFoundView(view);
                } else {
                    this.renderPracticeView();
                }
            }
            this.highlightSidebar();
            if (shouldScroll) window.scrollTo({ top: 0, behavior: 'smooth' });
        },

        hideAllGrammarViews() {
            const allTabs = ['hom-nay', 'lo-trinh', 'ngu-phap', 'tu-vung', 'tu-dien', 'nghe', 'doc', 'thi-thu', 'bay-de-thi', 'nghe-chinh-ta', 'tu-vung-phim', 'take-note', 'tai-khoan', 'cai-dat'];
            allTabs.forEach(id => {
                const el = document.getElementById(`view-${id}`);
                if (el) el.classList.add('hidden');
            });
            const vt = document.getElementById('view-grammar-theory');
            if (vt) vt.classList.add('hidden');
            const vp = document.getElementById('view-grammar-practice');
            if (vp) vp.classList.add('hidden');
        },

        highlightSidebar() {
            document.querySelectorAll('[id^="nav-"]').forEach(el => {
                el.classList.remove(
                    'nav-active-home',
                    'nav-active-roadmap',
                    'nav-active-grammar',
                    'nav-active-vocab',
                    'nav-active-dict',
                    'nav-active-listen',
                    'nav-active-read',
                    'nav-active-mock',
                    'nav-active-traps',
                    'nav-active-dictation',
                    'nav-active-youglish',
                    'nav-active-note'
                );
            });
            const navEl = document.getElementById('nav-ngu-phap');
            if (navEl) {
                navEl.classList.add('nav-active-grammar');
            }
        },

        // =========================================================================
        // MÀN HÌNH 404 EMPTY STATE BẢO VỆ (KHÔNG FALLBACK ÂM THẦM)
        // =========================================================================
        renderNotFoundView(container) {
            container.innerHTML = `
                <div class="py-12 px-4 max-w-xl mx-auto">
                    <div class="glass-panel rounded-3xl p-8 sm:p-12 text-center border border-white/60 dark:border-slate-800 shadow-md space-y-5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
                        <div class="w-20 h-20 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-500 mx-auto flex items-center justify-center text-3xl shadow-inner border border-rose-200 dark:border-rose-800">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <div>
                            <span class="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-extrabold uppercase tracking-wide">404 - Không tìm thấy</span>
                            <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-2.5">Chuyên đề không tồn tại</h2>
                            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                                Đường dẫn <code class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-purple-700 dark:text-purple-300 font-mono text-xs font-bold">/grammar/${this.missingSlug || 'unknown'}</code> chưa có trong hệ thống hoặc đã được cập nhật.
                            </p>
                        </div>
                        <div class="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <button onclick="GrammarEngine.navigateBackToTopics()" class="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition">
                                <i class="fa-solid fa-arrow-left"></i>
                                <span>Quay lại kho ngữ pháp</span>
                            </button>
                            <button onclick="GrammarEngine.navigateToTheory('present-tenses')" class="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-xs transition">
                                <span>Học Các thì hiện tại ➔</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        },

        // =========================================================================
        // MÀN HÌNH 1: RENDER TRANG LÝ THUYẾT CHUYÊN SÂU (/grammar/[slug])
        // =========================================================================
        renderTheoryView() {
            const container = document.getElementById('view-grammar-theory');
            if (!container || !this.topic) return;

            const t = this.topic;
            const isBookmarked = this.savedBookmarks.topics.includes(t.slug);
            const correctCount = Object.values(this.questionStatusMap).filter(v => v === 'correct').length;
            const totalCount = this.questions.length;

            // Normalize Mental Model Steps
            const flowSteps = t.mentalModel ? (t.mentalModel.flowSteps || t.mentalModel.steps || []) : [];
            const mentalModelExplanation = (t.mentalModel && t.mentalModel.explanation) || t.description;

            // Normalize Level Badge
            let levelBadgeHtml = '';
            if (t.level === '0-500') {
                levelBadgeHtml = '<span class="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">🌱 0 - 500 Căn bản</span>';
            } else if (t.level === '600+') {
                levelBadgeHtml = '<span class="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-black">🚀 600+ Ra trường</span>';
            } else {
                levelBadgeHtml = '<span class="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-black">👑 800+ Nâng cao</span>';
            }

            // Normalize Usage Comparison
            let usageLeftHtml = '';
            let usageRightHtml = '';
            if (t.usageComparison) {
                if (t.usageComparison.leftBox && t.usageComparison.rightBox) {
                    const lb = t.usageComparison.leftBox;
                    const rb = t.usageComparison.rightBox;
                    usageLeftHtml = `
                        <div class="p-3.5 rounded-2xl bg-purple-50/70 dark:bg-slate-800 border border-purple-200/70 dark:border-slate-700 space-y-1.5">
                            <div class="text-xs font-black text-purple-900 dark:text-purple-300 flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-purple-600"></span>
                                <span>${lb.title}:</span>
                            </div>
                            <ul class="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                                ${(lb.items || []).map(it => `<li>${it}</li>`).join('')}
                            </ul>
                            ${lb.note ? `<div class="text-[10.5px] text-purple-700 dark:text-purple-400 italic pt-1">${lb.note}</div>` : ''}
                        </div>
                    `;
                    usageRightHtml = `
                        <div class="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-slate-800 border border-emerald-200/70 dark:border-slate-700 space-y-1.5">
                            <div class="text-xs font-black text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                                <span>${rb.title}:</span>
                            </div>
                            <ul class="text-[11.5px] font-medium text-slate-700 dark:text-slate-300 space-y-1 list-disc list-inside">
                                ${(rb.items || []).map(it => `<li>${it}</li>`).join('')}
                            </ul>
                            ${rb.note ? `<div class="text-[10.5px] text-emerald-700 dark:text-emerald-400 italic pt-1">${rb.note}</div>` : ''}
                        </div>
                    `;
                } else if (t.usageComparison.singular && t.usageComparison.plural) {
                    const sg = t.usageComparison.singular;
                    const pl = t.usageComparison.plural;
                    usageLeftHtml = `
                        <div class="p-3 rounded-2xl bg-purple-50/70 dark:bg-slate-800 border border-purple-200/70 dark:border-slate-700 space-y-1">
                            <div class="text-xs font-black text-purple-800 dark:text-purple-300 flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-purple-600"></span>
                                <span>${sg.title}:</span>
                            </div>
                            <div class="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                                ${(sg.subjects || []).join(', ')} ➔ <strong class="text-purple-700 dark:text-purple-300">${sg.rule || ''}</strong>
                            </div>
                        </div>
                    `;
                    usageRightHtml = `
                        <div class="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800 border border-emerald-200/70 dark:border-slate-700 space-y-1">
                            <div class="text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-emerald-600"></span>
                                <span>${pl.title}:</span>
                            </div>
                            <div class="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300">
                                ${(pl.subjects || []).join(', ')} ➔ <strong class="text-emerald-700 dark:text-emerald-300">${pl.rule || ''}</strong>
                            </div>
                        </div>
                    `;
                }
            }

            container.innerHTML = `
                <div class="space-y-6 pb-28">
                    <!-- 3.1. BREADCRUMBS & ACTIONS HEADER -->
                    <div class="glass-panel rounded-3xl p-5 sm:p-6 border border-white/60 dark:border-slate-800 shadow-sm">
                        <!-- Breadcrumbs -->
                        <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3 overflow-x-auto">
                            <button onclick="switchTab('hom-nay')" class="hover:text-purple-600 transition">Trang chủ</button>
                            <i class="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
                            <button onclick="GrammarEngine.navigateBackToTopics()" class="hover:text-purple-600 transition">Ngữ pháp</button>
                            <i class="fa-solid fa-chevron-right text-[9px] text-slate-400"></i>
                            <span class="text-purple-700 dark:text-purple-400 font-bold">${t.title}</span>
                        </div>

                        <!-- Title, Tags & Action Buttons -->
                        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <div class="flex flex-wrap items-center gap-2.5">
                                    <h1 class="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">${t.title}</h1>
                                    ${(t.targetTags || []).map(tag => `
                                        <span class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-extrabold border border-slate-200/80 dark:border-slate-700">${tag}</span>
                                    `).join('')}
                                    ${levelBadgeHtml}
                                </div>
                                <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-2xl leading-relaxed">${t.description}</p>
                            </div>

                            <div class="flex items-center gap-2.5 shrink-0">
                                <button onclick="GrammarEngine.toggleTopicBookmark('${t.slug}')" class="px-3.5 py-2.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1.5 shadow-xs">
                                    <i class="${isBookmarked ? 'fa-solid' : 'fa-regular'} fa-bookmark text-purple-600"></i>
                                    <span>Sổ tay</span>
                                    <span class="px-1.5 py-0.2 rounded-full bg-purple-100 text-purple-700 text-[10px] font-extrabold">${this.savedBookmarks.topics.length}</span>
                                </button>
                                <button onclick="GrammarEngine.navigateToPractice('${t.slug}')" class="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] transition">
                                    <i class="fa-solid fa-bolt text-amber-300"></i>
                                    <span>Luyện tập ngay (${totalCount} câu) ➔</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- 3.2. TOP HERO SECTION (3 THẺ NGANG) -->
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <!-- Card 1: Quy tắc vàng (Hero Card) -->
                        <div class="md:col-span-5 rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-indigo-50/90 via-purple-50/60 to-white dark:from-slate-850 dark:to-slate-900 border border-purple-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                            <div>
                                <div class="flex items-center gap-2 text-purple-700 dark:text-purple-300 text-xs font-black uppercase tracking-wider mb-2">
                                    <i class="fa-solid fa-quote-left text-base text-purple-600"></i>
                                    <span>${cleanFormula(t.goldenRule ? t.goldenRule.title : 'Quy tắc vàng cốt lõi:')}</span>
                                </div>
                                <div class="space-y-2 my-3">
                                    ${(t.goldenRule && t.goldenRule.formulas ? t.goldenRule.formulas : []).map(f => `
                                        <div class="p-3 rounded-2xl bg-white/90 dark:bg-slate-800 border border-purple-100 dark:border-slate-700 text-xs sm:text-sm font-black text-purple-900 dark:text-purple-200 shadow-xs flex items-center justify-between">
                                            <span>${cleanFormula(f)}</span>
                                            <span class="text-[10px] text-purple-500 font-semibold px-2 py-0.5 rounded-md bg-purple-50 dark:bg-slate-700">Công thức</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <p class="text-[12px] text-slate-600 dark:text-slate-300 italic pt-2 border-t border-purple-100 dark:border-slate-700/80">
                                "${cleanFormula(t.goldenRule ? t.goldenRule.note : '')}"
                            </p>
                        </div>

                        <!-- Card 2: Mẹo nhớ nhanh -->
                        <div class="md:col-span-4 rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-amber-50/90 via-yellow-50/50 to-white dark:from-slate-850 dark:to-slate-900 border border-amber-200/80 dark:border-slate-700 shadow-sm flex flex-col justify-between">
                            <div>
                                <div class="flex items-center gap-2 text-amber-800 dark:text-amber-300 text-xs font-black uppercase tracking-wider mb-2">
                                    <i class="fa-solid fa-lightbulb text-base text-amber-500"></i>
                                    <span>Mẹo nhớ nhanh & Phản xạ:</span>
                                </div>
                                <div class="space-y-2.5 my-3">
                                    ${(t.quickTips || []).map(tip => `
                                        <div class="p-2.5 rounded-2xl bg-white/90 dark:bg-slate-800 border border-amber-100 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-start gap-2 shadow-xs">
                                            <span class="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 text-[10px]">✔</span>
                                            <span class="leading-tight pt-0.5">${tip}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="text-[11.5px] font-semibold text-amber-700 dark:text-amber-400">
                                💡 Chú ý bẫy đề thi và các ngoại lệ thường gặp trong Part 5 & VSTEP.
                            </div>
                        </div>

                        <!-- Card 3: Mascot & Mascot Tip -->
                        <div class="md:col-span-3 rounded-3xl p-5 bg-gradient-to-br from-purple-100/80 via-pink-50/60 to-white dark:from-slate-850 dark:to-slate-900 border border-purple-200/80 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div class="absolute -top-3 -right-3 text-amber-400 text-2xl animate-spin-slow">✨</div>
                            <div class="w-20 h-20 mb-2 mascot-float flex items-center justify-center">
                                ${typeof getOwlSVG === 'function' ? getOwlSVG('grammar') : '<div class="text-4xl">🦉</div>'}
                            </div>
                            <h3 class="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">Cú Đăng Tip</h3>
                            <p class="text-[11px] font-semibold text-purple-700 dark:text-purple-300 mt-1 leading-snug px-1">
                                ${t.mascotTip || 'Nắm chắc bản chất ➔ Không bao giờ sợ bẫy đề!'}
                            </p>
                            <span class="mt-2.5 px-3 py-1 rounded-full bg-purple-600 text-white text-[10px] font-extrabold shadow-sm">+${totalCount} XP khi hoàn thành</span>
                        </div>
                    </div>

                    <!-- 3.3. MIDDLE SECTION: TƯ DUY & HỆ THỐNG HOÁ (3 CỘT) -->
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <!-- Cột 1: Mental Model -->
                        <div class="glass-panel rounded-3xl p-5 border border-white/60 dark:border-slate-800 space-y-3.5 shadow-sm">
                            <div class="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-xs font-black uppercase">
                                <i class="fa-solid fa-brain text-indigo-600 text-sm"></i>
                                <span>Mental Model (Mô hình tư duy)</span>
                            </div>
                            <div class="p-3 rounded-2xl bg-indigo-50/70 dark:bg-slate-800 text-xs font-bold text-indigo-900 dark:text-indigo-200 text-center border border-indigo-100 dark:border-slate-700">
                                [Nhận diện tín hiệu] ➔ [Khóa công thức]
                            </div>
                            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                ${mentalModelExplanation}
                            </p>
                            <div class="space-y-1.5 pt-1">
                                ${flowSteps.map(s => `
                                    <div class="text-[11.5px] font-semibold text-slate-700 dark:text-slate-300 flex items-start gap-2">
                                        <span class="w-4 h-4 rounded-full bg-indigo-600 text-white text-[9px] flex items-center justify-center shrink-0 mt-0.5">${s.step || '•'}</span>
                                        <span><strong>${s.label ? s.label + ': ' : ''}</strong>${s.action || s}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Cột 2: Công thức nhanh (Quick Cheat Sheet) -->
                        <div class="glass-panel rounded-3xl p-5 border border-white/60 dark:border-slate-800 space-y-3.5 shadow-sm">
                            <div class="flex items-center gap-2 text-purple-700 dark:text-purple-300 text-xs font-black uppercase">
                                <i class="fa-solid fa-bolt text-purple-600 text-sm"></i>
                                <span>Công thức nhanh (Cheat Sheet)</span>
                            </div>
                            <div class="space-y-2">
                                ${(t.quickFormulas || []).map(f => {
                                    const fid = f.id || f.formula;
                                    const isSaved = GrammarEngine.savedBookmarks.formulas.includes(fid);
                                    return `
                                        <div class="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between">
                                            <span>${cleanFormula(f.formula)}</span>
                                            <button onclick="GrammarEngine.toggleFormulaBookmark('${fid}')" class="text-slate-400 hover:text-purple-600 transition" title="Lưu công thức">
                                                <i class="${isSaved ? 'fa-solid text-purple-600' : 'fa-regular'} fa-bookmark text-xs"></i>
                                            </button>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                            <p class="text-[11px] text-slate-400 italic">Nhấn biểu tượng bookmark để lưu vào Sổ tay công thức cá nhân.</p>
                        </div>

                        <!-- Cột 3: Cách dùng thực chiến -->
                        <div class="glass-panel rounded-3xl p-5 border border-white/60 dark:border-slate-800 space-y-3 shadow-sm">
                            <div class="flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase">
                                <i class="fa-solid fa-scale-balanced text-emerald-600 text-sm"></i>
                                <span>Cách dùng thực chiến</span>
                            </div>
                            ${usageLeftHtml}
                            ${usageRightHtml}
                        </div>
                    </div>

                    <!-- 3.4. BOTTOM SECTION: BẪY THƯỜNG GẶP & VÍ DỤ THỰC TẾ -->
                    <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <!-- Khối Trái: Bẫy thường gặp trong đề thi -->
                        <div class="md:col-span-6 rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-amber-50/60 via-orange-50/30 to-white dark:from-slate-850 dark:to-slate-900 border border-amber-200/80 dark:border-slate-700 shadow-sm space-y-3.5">
                            <div class="flex items-center justify-between pb-2 border-b border-amber-200/60 dark:border-slate-700">
                                <div class="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-black text-sm uppercase">
                                    <i class="fa-solid fa-triangle-exclamation text-rose-500"></i>
                                    <span>⚠️ Bẫy thường gặp trong đề thi</span>
                                </div>
                                <span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-extrabold">${(t.traps || []).length} bẫy kinh điển</span>
                            </div>

                            <div class="space-y-3">
                                ${(t.traps || []).map((trap, idx) => `
                                    <div class="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-800 border border-amber-100 dark:border-slate-700 space-y-1.5 shadow-xs">
                                        <div class="text-xs font-black text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                                            <span class="w-4 h-4 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-[10px]">✕</span>
                                            <span>Bẫy ${trap.id || idx + 1}: ${trap.title}</span>
                                        </div>
                                        <p class="text-[12px] text-slate-600 dark:text-slate-300 leading-relaxed">${trap.explanation}</p>
                                        <div class="text-[11px] font-medium space-y-0.5 pt-1">
                                            <div class="text-rose-600 dark:text-rose-400 line-through">❌ ${trap.wrongExample || trap.incorrectExample || ''}</div>
                                            <div class="text-emerald-600 dark:text-emerald-400 font-bold">✔ ${trap.rightExample || trap.correctExample || ''}</div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <!-- Khối Phải: Ví dụ thực tế công sở TOEIC / VSTEP -->
                        <div class="md:col-span-6 rounded-3xl p-5 sm:p-6 bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-3.5">
                            <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
                                <div class="flex items-center gap-2 text-slate-900 dark:text-white font-black text-sm uppercase">
                                    <i class="fa-solid fa-wand-magic-sparkles text-purple-600"></i>
                                    <span>✨ Ví dụ thực tế</span>
                                </div>
                                <span class="text-xs text-slate-400 font-semibold">Ngữ cảnh công sở chuẩn ETS</span>
                            </div>

                            <div class="space-y-3">
                                ${(t.examples || []).map(ex => {
                                    const enText = ex.sentenceEn || ex.en || '';
                                    const viText = ex.sentenceVi || ex.vi || '';
                                    const tagText = ex.highlightRule || ex.tenseTag || t.title;
                                    return `
                                        <div class="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 space-y-1.5">
                                            <div class="flex items-start justify-between gap-2">
                                                <p class="text-xs sm:text-[13px] font-black text-slate-900 dark:text-white leading-snug">${enText}</p>
                                                <div class="flex items-center gap-1 shrink-0">
                                                    <button onclick="GrammarEngine.speakText('${enText.replace(/'/g, "\\'")}')" class="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 flex items-center justify-center text-xs transition" title="Nghe phát âm">
                                                        <i class="fa-solid fa-volume-high text-[10px]"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            <p class="text-[11.5px] text-slate-600 dark:text-slate-300">${viText}</p>
                                            <span class="inline-block px-2 py-0.5 rounded-md bg-purple-100/70 dark:bg-slate-700 text-purple-700 dark:text-purple-300 text-[10px] font-bold">${tagText}</span>
                                        </div>
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- BOTTOM FLOATING STICKY BAR -->
                <div class="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-3.5 shadow-2xl flex flex-wrap items-center justify-between gap-3">
                    <div class="flex items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span>📖 Chủ điểm: <strong class="text-purple-600">${t.title}</strong></span>
                        <span class="hidden sm:inline">|</span>
                        <span>🎯 Luyện tập: <strong class="text-purple-600">${totalCount} câu</strong> (Đúng: ${correctCount})</span>
                        <span class="hidden md:inline">|</span>
                        <span class="hidden md:inline">🔖 Sổ tay: <strong class="text-purple-600">${this.savedBookmarks.topics.length} mục đã lưu</strong></span>
                    </div>

                    <div class="flex items-center gap-3">
                        <span class="hidden lg:inline text-xs text-slate-500 font-medium">Sẵn sàng chinh phục bộ câu hỏi thực chiến?</span>
                        <button onclick="GrammarEngine.navigateToPractice('${t.slug}')" class="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-500/25 flex items-center gap-2 hover:scale-105 active:scale-95 transition">
                            <span>Luyện ngay ➔</span>
                        </button>
                    </div>
                </div>
            `;
        },

        // =========================================================================
        // MÀN HÌNH 2: RENDER ĐẤU TRƯỜNG LUYỆN TẬP 2 CỘT (/grammar/[slug]/practice)
        // =========================================================================
        renderPracticeView() {
            const container = document.getElementById('view-grammar-practice');
            if (!container || !this.topic) return;

            const q = this.questions[this.currentQuestionIndex] || this.questions[0];
            const total = this.questions.length;
            const progressPct = total > 0 ? Math.round(((this.currentQuestionIndex + 1) / total) * 100) : 0;
            const correctCount = Object.values(this.questionStatusMap).filter(v => v === 'correct').length;
            const selectedOpt = this.selectedOption;
            const isAnswered = this.isAnswered;
            const isBookmarked = q ? this.savedBookmarks.questions.includes(q.id) : false;

            container.innerHTML = `
                <div class="space-y-4 pb-16">
                    <!-- 4.1. TOP NAVIGATION & ACTION TOOLBAR -->
                    <div class="glass-panel rounded-3xl p-4 sm:p-5 border border-white/60 dark:border-slate-800 shadow-sm space-y-3">
                        <div class="flex flex-wrap items-center justify-between gap-3">
                            <!-- Back & Title & Progress Status -->
                            <div class="flex items-center gap-3">
                                <button onclick="GrammarEngine.navigateToTheory('${this.topic.slug}')" class="w-9 h-9 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-purple-50 hover:text-purple-600 flex items-center justify-center transition shadow-xs" title="Quay lại lý thuyết">
                                    <i class="fa-solid fa-arrow-left text-xs"></i>
                                </button>
                                <div>
                                    <div class="text-[11px] text-slate-400 font-bold uppercase tracking-wider">${this.topic.title}</div>
                                    <h2 class="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                                        Câu ${this.currentQuestionIndex + 1}/${total} · <span class="text-emerald-600 dark:text-emerald-400 font-extrabold">Đúng: ${correctCount}</span>
                                    </h2>
                                </div>
                            </div>

                            <!-- Utility Buttons Toolbar -->
                            <div class="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                <button onclick="GrammarEngine.toggleTheoryDrawer(true)" class="px-3 py-1.5 rounded-xl bg-purple-50 dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-slate-700 text-xs font-bold hover:bg-purple-100 flex items-center gap-1.5 transition">
                                    <i class="fa-solid fa-book-open text-[11px]"></i>
                                    <span>Lý thuyết</span>
                                </button>
                                <button onclick="GrammarEngine.toggleBilingual()" class="px-2.5 py-1.5 rounded-xl ${this.isBilingual ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'} text-xs font-bold transition" title="Bật/Tắt song ngữ">
                                    <i class="fa-solid fa-globe text-[11px]"></i>
                                    <span class="hidden sm:inline">Song ngữ</span>
                                </button>
                                <button onclick="GrammarEngine.toggleInstantExplain()" class="px-2.5 py-1.5 rounded-xl ${this.instantExplainEnabled ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60' : 'bg-slate-100 text-slate-500'} text-xs font-bold transition" title="Bật/Tắt giải thích ngay">
                                    <i class="fa-solid fa-lightbulb text-[11px]"></i>
                                    <span class="hidden sm:inline">Giải thích</span>
                                </button>
                                <button onclick="GrammarEngine.toggleQuestionBookmark(${q.id})" class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-purple-600 flex items-center justify-center transition" title="Đánh dấu câu hỏi">
                                    <i class="${isBookmarked ? 'fa-solid text-purple-600' : 'fa-regular'} fa-bookmark text-xs"></i>
                                </button>
                                <button onclick="showToast('🚩 Đã ghi nhận báo lỗi nội dung câu hỏi!')" class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 flex items-center justify-center transition" title="Báo lỗi câu này">
                                    <i class="fa-regular fa-flag text-xs"></i>
                                </button>
                                <button onclick="GrammarEngine.openQuestionMap()" class="px-3 py-1.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition">
                                    <i class="fa-solid fa-table-cells text-[10px]"></i>
                                    <span>Bản đồ (${total})</span>
                                </button>
                            </div>
                        </div>

                        <!-- Progress Bar (Tím bo tròn) -->
                        <div class="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300" style="width: ${progressPct}%"></div>
                        </div>
                    </div>

                    <!-- 4.2. LAYOUT 2 CỘT ĐỐI XỨNG (SPLIT WORKSPACE 60/40) -->
                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                        <!-- ============================================== -->
                        <!-- CỘT TRÁI: ĐỀ BÀI & IN-LINE OPTION FEEDBACK (7 CỘT) -->
                        <!-- ============================================== -->
                        <div class="lg:col-span-7 rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-sm space-y-5">
                            <!-- Badge phân loại -->
                            <div>
                                <span class="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800 text-[11px] font-black tracking-wide uppercase">
                                    ${q.instruction || 'CHỌN ĐÁP ÁN ĐÚNG'}
                                </span>
                            </div>

                            <!-- Nội dung câu hỏi có gạch chân -->
                            <div class="space-y-2">
                                <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                                    ${this.formatQuestionText(q.questionText)}
                                </h3>
                                ${this.isBilingual && q.translationVi ? `
                                    <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 italic border border-slate-100 dark:border-slate-700">
                                        🌐 Dịch nghĩa: ${q.translationVi}
                                    </div>
                                ` : ''}
                            </div>

                            <!-- 4 Đáp án A, B, C, D với In-line Option Feedback -->
                            <div class="space-y-3 pt-1">
                                ${(q.options || []).map(opt => {
                                    const isChosen = selectedOpt === opt.key;
                                    const isCorrect = opt.key === q.correctAnswer;
                                    let cardClass = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-400 cursor-pointer';
                                    let circleClass = 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200';
                                    let statusIcon = opt.key;
                                    let inlineFeedbackHtml = '';

                                    if (isAnswered) {
                                        if (isChosen && !isCorrect) {
                                            cardClass = 'border-2 border-rose-500 bg-rose-50/60 dark:bg-rose-950/40';
                                            circleClass = 'bg-rose-500 text-white';
                                            statusIcon = '<i class="fa-solid fa-xmark"></i>';
                                            inlineFeedbackHtml = `
                                                <div class="text-[11.5px] font-semibold text-rose-600 dark:text-rose-400 pt-1.5 border-t border-rose-200/60 dark:border-rose-900 flex items-start gap-1.5">
                                                    <span>✕</span>
                                                    <span>${opt.inlineExplanation}</span>
                                                </div>
                                            `;
                                        } else if (isCorrect) {
                                            cardClass = 'border-2 border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40';
                                            circleClass = 'bg-emerald-500 text-white';
                                            statusIcon = '<i class="fa-solid fa-check"></i>';
                                            inlineFeedbackHtml = `
                                                <div class="text-[11.5px] font-semibold text-emerald-700 dark:text-emerald-400 pt-1.5 border-t border-emerald-200/60 dark:border-emerald-900 flex items-start gap-1.5">
                                                    <span>✔</span>
                                                    <span>${opt.inlineExplanation}</span>
                                                </div>
                                            `;
                                        } else {
                                            cardClass = 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 opacity-65';
                                            inlineFeedbackHtml = `
                                                <div class="text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-700">
                                                    ${opt.inlineExplanation}
                                                </div>
                                            `;
                                        }
                                    }

                                    return `
                                        <div onclick="GrammarEngine.selectOption('${opt.key}')" class="p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 shadow-xs space-y-1.5 ${cardClass}">
                                            <div class="flex items-center gap-3">
                                                <div class="w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 transition ${circleClass}">
                                                    ${statusIcon}
                                                </div>
                                                <div class="text-sm font-bold text-slate-800 dark:text-slate-100 flex-1">
                                                    ${opt.text}
                                                </div>
                                            </div>
                                            ${inlineFeedbackHtml}
                                        </div>
                                    `;
                                }).join('')}
                            </div>

                            <!-- Footer Navigation Buttons -->
                            <div class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                                <button onclick="GrammarEngine.prevQuestion()" ${this.currentQuestionIndex === 0 ? 'disabled' : ''} class="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition disabled:opacity-40 disabled:pointer-events-none flex items-center gap-1.5">
                                    <i class="fa-solid fa-chevron-left text-[10px]"></i>
                                    <span>Câu trước</span>
                                </button>
                                
                                <div class="text-xs text-slate-400 font-semibold hidden sm:block">
                                    Phím tắt: <kbd class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">A</kbd> <kbd class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">B</kbd> <kbd class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">C</kbd> <kbd class="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px]">D</kbd>
                                </div>

                                <button onclick="GrammarEngine.nextQuestion()" class="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold text-xs shadow-md shadow-purple-500/20 flex items-center gap-1.5 transition">
                                    <span>${this.currentQuestionIndex === total - 1 ? 'Xem tổng kết ➔' : 'Câu tiếp theo'}</span>
                                    <i class="fa-solid fa-chevron-right text-[10px]"></i>
                                </button>
                            </div>
                        </div>

                        <!-- ============================================== -->
                        <!-- CỘT PHẢI: BỘ NÃO SUY LUẬN & PHÂN TÍCH (5 CỘT)  -->
                        <!-- ============================================== -->
                        <div class="lg:col-span-5 space-y-4">
                            ${!isAnswered ? `
                                <!-- Trạng thái 1: Khi chưa chọn đáp án -->
                                <div class="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm flex flex-col items-center justify-center text-center min-h-[360px] space-y-3">
                                    <div class="w-16 h-16 rounded-full bg-amber-50 dark:bg-slate-800 text-amber-500 flex items-center justify-center text-2xl shadow-inner">
                                        💡
                                    </div>
                                    <h4 class="text-sm font-black text-slate-800 dark:text-slate-200">Hướng dẫn suy luận</h4>
                                    <p class="text-xs text-slate-400 dark:text-slate-400 max-w-xs leading-relaxed">
                                        Hãy tự tư duy và chọn 1 đáp án ở cột bên trái để kích hoạt quy trình bóc tách suy luận 3 bước chi tiết.
                                    </p>
                                    <div class="p-3 rounded-2xl bg-purple-50/70 dark:bg-slate-800 text-[11px] font-bold text-purple-700 dark:text-purple-300 border border-purple-100 dark:border-slate-700">
                                        🧠 Tư duy trước ➔ Khắc sâu kiến thức
                                    </div>
                                </div>
                            ` : `
                                <!-- Trạng thái 2: Ngay sau khi chọn đáp án -->
                                <div class="space-y-4">
                                    <!-- Status Header Banner -->
                                    <div class="p-4 rounded-3xl ${selectedOpt === q.correctAnswer ? 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 dark:bg-slate-800' : 'bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200 dark:bg-slate-800'} flex items-center justify-between shadow-xs">
                                        <div class="flex items-center gap-2 font-black text-sm">
                                            ${selectedOpt === q.correctAnswer ? `
                                                <span class="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs">✔</span>
                                                <span class="text-emerald-800 dark:text-emerald-300">Chính xác</span>
                                            ` : `
                                                <span class="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs">✕</span>
                                                <span class="text-rose-800 dark:text-rose-300">Chưa đúng</span>
                                            `}
                                        </div>
                                        <span class="px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-black text-slate-800 dark:text-white shadow-xs">
                                            Đáp án: <strong class="text-emerald-600">${q.correctAnswer}</strong>
                                        </span>
                                    </div>

                                    <!-- Block CÁCH SUY LUẬN (Tư duy 3 bước chuẩn giáo viên luyện thi) -->
                                    <div class="rounded-3xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-800 p-5 shadow-sm space-y-4">
                                        <div class="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-700 text-purple-700 dark:text-purple-400 font-black text-xs uppercase tracking-wider">
                                            <i class="fa-solid fa-list-check text-sm"></i>
                                            <span>CÁCH SUY LUẬN (3 BƯỚC)</span>
                                        </div>

                                        <!-- Bước 1 -->
                                        <div class="space-y-1">
                                            <div class="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                <span class="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-extrabold">1</span>
                                                <span>Bước 1: Phân tích chỗ trống</span>
                                            </div>
                                            <p class="text-xs text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                                                ${q.reasoning ? q.reasoning.step1_slotAnalysis : ''}
                                            </p>
                                        </div>

                                        <!-- Bước 2 -->
                                        <div class="space-y-1">
                                            <div class="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                <span class="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-extrabold">2</span>
                                                <span>Bước 2: Dấu hiệu nhận biết & Loại trừ</span>
                                            </div>
                                            <p class="text-xs text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                                                ${q.reasoning && q.reasoning.step2_tenseAnalysis ? q.reasoning.step2_tenseAnalysis.text : ''}
                                            </p>
                                            ${q.reasoning && q.reasoning.step2_tenseAnalysis && q.reasoning.step2_tenseAnalysis.eliminatedKeys && q.reasoning.step2_tenseAnalysis.eliminatedKeys.length > 0 ? `
                                                <div class="pl-6 flex items-center gap-1.5 pt-0.5">
                                                    ${q.reasoning.step2_tenseAnalysis.eliminatedKeys.map(k => `
                                                        <span class="px-2 py-0.5 rounded-md bg-rose-100 text-rose-700 text-[10.5px] font-bold">Loại ${k}</span>
                                                    `).join('')}
                                                </div>
                                            ` : ''}
                                        </div>

                                        <!-- Bước 3 -->
                                        <div class="space-y-1">
                                            <div class="text-xs font-black text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                <span class="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[10px] font-extrabold">3</span>
                                                <span>Bước 3: Chốt phương án</span>
                                            </div>
                                            <p class="text-xs text-slate-600 dark:text-slate-300 pl-6 leading-relaxed">
                                                ${q.reasoning && q.reasoning.step3_subjectVerbAgreement ? q.reasoning.step3_subjectVerbAgreement.text : ''}
                                            </p>
                                        </div>

                                        <!-- Dòng kết luận -->
                                        <div class="p-3 rounded-2xl bg-emerald-50/70 dark:bg-slate-800 border border-emerald-200/70 dark:border-slate-700 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                                            <span>✔</span>
                                            <span>${cleanFormula(q.reasoning ? q.reasoning.finalConclusion : q.explanation)}</span>
                                        </div>
                                    </div>

                                    <!-- Block NGỮ PHÁP CẦN NHỚ -->
                                    <div class="rounded-3xl p-5 bg-gradient-to-br from-purple-50 via-indigo-50 to-white dark:from-slate-850 dark:to-slate-900 border border-purple-200/80 dark:border-slate-700 shadow-sm space-y-2">
                                        <div class="flex items-center justify-between">
                                            <div class="text-xs font-black text-purple-900 dark:text-purple-300 flex items-center gap-1.5 uppercase">
                                                <i class="fa-solid fa-bookmark text-purple-600"></i>
                                                <span>NGỮ PHÁP CẦN NHỚ</span>
                                            </div>
                                            <button onclick="GrammarEngine.toggleTheoryDrawer(true)" class="text-[11px] font-bold text-purple-600 hover:underline flex items-center gap-1">
                                                <span>📖 Xem lý thuyết đầy đủ</span>
                                                <i class="fa-solid fa-chevron-right text-[8px]"></i>
                                            </button>
                                        </div>
                                        <p class="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                                            ${cleanFormula(q.recapNote || (this.topic.goldenRule ? this.topic.goldenRule.note : ''))}
                                        </p>
                                    </div>
                                </div>
                            `}
                        </div>
                    </div>
                </div>

                <!-- SLIDE-OVER DRAWER LÝ THUYẾT (Tóm tắt nhanh) -->
                ${this.renderTheoryDrawerHtml()}

                <!-- MODAL BẢN ĐỒ CÂU -->
                ${this.renderQuestionMapModalHtml()}
            `;
        },

        formatQuestionText(text) {
            if (!text) return '';
            return text.replace(/_{3,}/g, '<span class="inline-block px-4 py-0.5 border-b-2 border-purple-600 text-purple-600 font-black">_____</span>');
        },

        // =========================================================================
        // TƯƠNG TÁC CHỌN ĐÁP ÁN & ĐIỀU HƯỚNG CÂU HỎI
        // =========================================================================
        selectOption(key) {
            if (this.isAnswered) return;
            const q = this.questions[this.currentQuestionIndex];
            if (!q) return;

            this.selectedOption = key;
            this.isAnswered = true;

            const isCorrect = key === q.correctAnswer;
            this.questionStatusMap[q.id] = isCorrect ? 'correct' : 'incorrect';
            this.saveTopicState();

            // Cập nhật XP/Stats hệ thống
            if (isCorrect && window.state) {
                window.state.xp = (window.state.xp || 0) + 10;
                window.state.grammarDone = (window.state.grammarDone || 0) + 1;
                if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
            }

            this.playFeedbackAudio(isCorrect);
            this.renderPracticeView();
        },

        nextQuestion() {
            if (this.currentQuestionIndex < this.questions.length - 1) {
                this.currentQuestionIndex++;
                this.selectedOption = null;
                this.isAnswered = false;
                this.saveTopicState();
                this.renderPracticeView();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                this.showSummaryModal();
            }
        },

        prevQuestion() {
            if (this.currentQuestionIndex > 0) {
                this.currentQuestionIndex--;
                this.selectedOption = null;
                this.isAnswered = false;
                this.saveTopicState();
                this.renderPracticeView();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        jumpToQuestion(index) {
            if (index >= 0 && index < this.questions.length) {
                this.currentQuestionIndex = index;
                this.selectedOption = null;
                this.isAnswered = false;
                this.closeQuestionMap();
                this.saveTopicState();
                this.renderPracticeView();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        },

        // =========================================================================
        // UTILITY TOGGLES: DRAWER, BILINGUAL, BOOKMARK, MAP
        // =========================================================================
        toggleBilingual() {
            this.isBilingual = !this.isBilingual;
            this.renderPracticeView();
            if (typeof showToast === 'function') {
                showToast(this.isBilingual ? '🌐 Đã bật hiển thị song ngữ' : '🌐 Đã tắt song ngữ');
            }
        },

        toggleInstantExplain() {
            this.instantExplainEnabled = !this.instantExplainEnabled;
            this.renderPracticeView();
            if (typeof showToast === 'function') {
                showToast(this.instantExplainEnabled ? '💡 Đã bật giải thích ngay' : '💡 Đã tắt giải thích ngay');
            }
        },

        toggleTheoryDrawer(open) {
            this.isTheoryDrawerOpen = open;
            const drawer = document.getElementById('theorySlideOverDrawer');
            const backdrop = document.getElementById('theoryDrawerBackdrop');
            if (drawer && backdrop) {
                if (open) {
                    backdrop.classList.remove('hidden');
                    drawer.classList.remove('translate-x-full');
                } else {
                    drawer.classList.add('translate-x-full');
                    setTimeout(() => backdrop.classList.add('hidden'), 250);
                }
            }
        },

        openQuestionMap() {
            this.isQuestionMapOpen = true;
            const modal = document.getElementById('questionMapModal');
            if (modal) modal.classList.remove('hidden');
        },

        closeQuestionMap() {
            this.isQuestionMapOpen = false;
            const modal = document.getElementById('questionMapModal');
            if (modal) modal.classList.add('hidden');
        },

        toggleTopicBookmark(slug) {
            const idx = this.savedBookmarks.topics.indexOf(slug);
            if (idx >= 0) {
                this.savedBookmarks.topics.splice(idx, 1);
                if (typeof showToast === 'function') showToast('🔖 Đã bỏ lưu chủ điểm khỏi Sổ tay');
            } else {
                this.savedBookmarks.topics.push(slug);
                if (typeof showToast === 'function') showToast('🔖 Đã lưu chủ điểm vào Sổ tay học tập!');
            }
            this.saveGlobalBookmarks();
            this.renderTheoryView();
        },

        toggleQuestionBookmark(qid) {
            const idx = this.savedBookmarks.questions.indexOf(qid);
            if (idx >= 0) {
                this.savedBookmarks.questions.splice(idx, 1);
                if (typeof showToast === 'function') showToast('🔖 Đã bỏ lưu câu hỏi');
            } else {
                this.savedBookmarks.questions.push(qid);
                if (typeof showToast === 'function') showToast('🔖 Đã lưu câu hỏi vào Sổ tay!');
            }
            this.saveGlobalBookmarks();
            this.renderPracticeView();
        },

        toggleFormulaBookmark(fid) {
            const idx = this.savedBookmarks.formulas.indexOf(fid);
            if (idx >= 0) {
                this.savedBookmarks.formulas.splice(idx, 1);
                if (typeof showToast === 'function') showToast('🔖 Đã bỏ lưu công thức');
            } else {
                this.savedBookmarks.formulas.push(fid);
                if (typeof showToast === 'function') showToast('🔖 Đã lưu công thức vào Sổ tay!');
            }
            this.saveGlobalBookmarks();
            this.renderTheoryView();
        },

        speakText(text) {
            try {
                if ('speechSynthesis' in window) {
                    window.speechSynthesis.cancel();
                    const u = new SpeechSynthesisUtterance(text);
                    u.lang = 'en-US';
                    u.rate = 0.9;
                    window.speechSynthesis.speak(u);
                }
            } catch (e) {}
        },

        playFeedbackAudio(isCorrect) {
            try {
                const ctx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                if (isCorrect) {
                    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.15);
                    gain.gain.setValueAtTime(0.12, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.3);
                } else {
                    osc.frequency.setValueAtTime(261.63, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(196.00, ctx.currentTime + 0.2);
                    gain.gain.setValueAtTime(0.12, ctx.currentTime);
                    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
                    osc.start(ctx.currentTime);
                    osc.stop(ctx.currentTime + 0.3);
                }
            } catch (e) {}
        },

        renderTheoryDrawerHtml() {
            if (!this.topic) return '';
            const t = this.topic;
            return `
                <div id="theoryDrawerBackdrop" onclick="GrammarEngine.toggleTheoryDrawer(false)" class="hidden fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 transition-opacity"></div>
                <div id="theorySlideOverDrawer" class="translate-x-full fixed inset-y-0 right-0 max-w-md w-full bg-white dark:bg-slate-900 z-50 shadow-2xl p-6 overflow-y-auto transition-transform duration-300 ease-in-out border-l border-slate-200 dark:border-slate-800 space-y-5">
                    <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div class="flex items-center gap-2">
                            <i class="fa-solid fa-book-open text-purple-600 text-sm"></i>
                            <h3 class="font-black text-slate-900 dark:text-white text-base">Tóm tắt: ${t.title}</h3>
                        </div>
                        <button onclick="GrammarEngine.toggleTheoryDrawer(false)" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 flex items-center justify-center transition">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </div>

                    <div class="space-y-4 text-xs">
                        <!-- Quy tắc vàng -->
                        <div class="p-4 rounded-2xl bg-purple-50 dark:bg-slate-800 border border-purple-200/80 dark:border-slate-700 space-y-2">
                            <div class="font-black text-purple-900 dark:text-purple-300 text-xs uppercase">${cleanFormula(t.goldenRule ? t.goldenRule.title : 'Quy tắc vàng')}</div>
                            <div class="font-extrabold text-sm text-purple-800 dark:text-purple-200">
                                ${(t.goldenRule && t.goldenRule.formulas ? t.goldenRule.formulas.map(cleanFormula).join(' | ') : '')}
                            </div>
                            <p class="text-slate-600 dark:text-slate-300">${cleanFormula(t.goldenRule ? t.goldenRule.note : '')}</p>
                        </div>

                        <!-- Mẹo nhớ nhanh -->
                        <div class="space-y-2">
                            <div class="font-black text-slate-900 dark:text-white text-xs uppercase">Mẹo nhớ nhanh:</div>
                            <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 leading-relaxed space-y-1">
                                ${(t.quickTips || []).map(tip => `<div>• ${cleanFormula(tip)}</div>`).join('')}
                            </div>
                        </div>

                        <!-- Bẫy đề thi -->
                        <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-amber-200 dark:border-slate-700 text-amber-900 dark:text-amber-200 space-y-1">
                            <div class="font-black text-xs uppercase text-amber-800 dark:text-amber-300">⚠️ Bẫy đề thi:</div>
                            ${(t.traps || []).slice(0, 2).map(trap => `
                                <div class="text-[11px] leading-relaxed pt-1">
                                    <strong>${trap.title}:</strong> ${trap.explanation}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        },

        renderQuestionMapModalHtml() {
            const total = this.questions.length;
            let cells = '';
            for (let i = 0; i < total; i++) {
                const qid = this.questions[i].id;
                const status = this.questionStatusMap[qid];
                const isCurrent = i === this.currentQuestionIndex;
                let bg = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700';
                if (status === 'correct') {
                    bg = 'bg-emerald-500 text-white border-emerald-600 font-extrabold';
                } else if (status === 'incorrect') {
                    bg = 'bg-rose-500 text-white border-rose-600 font-extrabold';
                }
                const ring = isCurrent ? 'ring-2 ring-purple-600 ring-offset-2' : '';
                cells += `
                    <button onclick="GrammarEngine.jumpToQuestion(${i})" class="w-10 h-10 rounded-xl border flex items-center justify-center text-xs font-bold transition hover:scale-110 ${bg} ${ring}">
                        ${i + 1}
                    </button>
                `;
            }

            return `
                <div id="questionMapModal" class="hidden fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                    <div class="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                        <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                            <div>
                                <h3 class="font-black text-slate-900 dark:text-white text-base">Bản đồ câu hỏi</h3>
                                <p class="text-xs text-slate-500">Nhấn vào số câu để chuyển nhanh đến câu đó</p>
                            </div>
                            <button onclick="GrammarEngine.closeQuestionMap()" class="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 flex items-center justify-center">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>

                        <!-- Chú thích màu sắc -->
                        <div class="flex items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-emerald-500"></span> Đúng</span>
                            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-rose-500"></span> Sai</span>
                            <span class="flex items-center gap-1.5"><span class="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700"></span> Chưa làm</span>
                        </div>

                        <!-- Grid các câu -->
                        <div class="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-[360px] overflow-y-auto p-1">
                            ${cells}
                        </div>
                    </div>
                </div>
            `;
        },

        showSummaryModal() {
            const correctCount = Object.values(this.questionStatusMap).filter(v => v === 'correct').length;
            const total = this.questions.length;
            const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

            if (typeof showToast === 'function') {
                showToast(`🎉 Chúc mừng! Bạn đã hoàn thành bài luyện tập ${this.topic.title} với kết quả ${correctCount}/${total} (${pct}%)`);
            }
            setTimeout(() => {
                this.navigateToTheory(this.topic.slug);
            }, 1800);
        }
    };

    // Export ra global window
    window.GrammarEngine = GrammarEngine;

    // Tự động khởi chạy khi DOM sẵn sàng
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => GrammarEngine.init());
    } else {
        GrammarEngine.init();
    }
})();
