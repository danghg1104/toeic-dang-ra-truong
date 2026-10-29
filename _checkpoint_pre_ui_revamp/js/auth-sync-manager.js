/**
 * =========================================================================
 * AUTH SYNC MANAGER - MULTI-ACCOUNT NAMESPACE ISOLATION & REALTIME SYNC
 * =========================================================================
 * - Đảm bảo mỗi tài khoản đăng nhập có 1 không gian dữ liệu độc lập tuyệt đối.
 * - Key LocalStorage: cungdang_data_${uid} (cungdang_data_guest cho khách).
 * - Tự động đồng bộ 2 chiều (Optimistic UI + Debounced Server Push + Realtime SSE).
 * - Tự động flush dữ liệu khi người dùng chuyển tab hoặc đóng trình duyệt.
 * - Theo dõi thời gian học thực tế (Active Study Tracker) tự động nhảy số phút.
 * =========================================================================
 */

(function (window) {
    'use strict';

    const AuthSyncManager = {
        debounceTimer: null,
        activeStudyTimer: null,
        lastActivityTimestamp: Date.now(),
        isSyncing: false,
        evtSource: null,

        // ---------------------------------------------------------------------
        // 1. NAMESPACE & STORAGE KEYS
        // ---------------------------------------------------------------------
        getUid() {
            if (window.currentUserAccount && window.currentUserAccount.id) {
                return String(window.currentUserAccount.id).replace(/[^a-zA-Z0-9_-]/g, '_');
            }
            return 'guest';
        },

        getStorageKey() {
            return `cungdang_data_${this.getUid()}`;
        },

        getTodayDateStr() {
            const now = new Date();
            const vnTime = new Date(now.getTime() + (7 * 3600 - now.getTimezoneOffset() * 60) * 1000);
            return vnTime.toISOString().slice(0, 10);
        },

        // ---------------------------------------------------------------------
        // 2. KHỞI TẠO STATE & DATA SCHEMA CHUẨN
        // ---------------------------------------------------------------------
        getDefaultDataSchema(account = null) {
            const today = this.getTodayDateStr();
            const acc = account || window.currentUserAccount || {};
            return {
                uid: acc.id || 'guest',
                profile: {
                    id: acc.id || 'guest',
                    name: acc.name || 'Học viên',
                    email: acc.email || '',
                    avatar: acc.avatar || '',
                    joinedDate: acc.createdAt || new Date().toISOString()
                },
                goals: {
                    targetScore: acc.targetScore || '600',
                    examDate: acc.examDate || '20/12/2026'
                },
                stats: {
                    xp: acc.xp || 0,
                    streak: acc.streak || 0,
                    vocabLearned: acc.vocabLearned || 0,
                    grammarDone: acc.grammarDone || 0,
                    listenDone: acc.listenDone || 0,
                    readDone: acc.readDone || 0,
                    dictationDone: acc.dictationDone || 0,
                    studyMinutes: acc.studyMinutes || 0,
                    correctAnswers: acc.correctAnswers || 0,
                    totalAnswers: acc.totalAnswers || 0,
                    listenTotalAnswers: acc.listenTotalAnswers || 0,
                    listenCorrectAnswers: acc.listenCorrectAnswers || 0,
                    activityDates: []
                },
                dailyMissions: {
                    date: today,
                    tasks: {
                        grammar: { current: 0, target: 20, xp: 10 },
                        vocabReview: { current: 0, target: 10, xp: 10 },
                        vocabNew: { current: 0, target: 10, xp: 10 },
                        listening: { current: 0, target: 10, xp: 10 },
                        reading: { current: 0, target: 10, xp: 10 }
                    }
                },
                skillAccuracy: {
                    grammar: { correct: acc.grammarDone || 0, total: acc.grammarDone || 0, maxTarget: 1500 },
                    vocab: { correct: 0, total: 0, maxTarget: 4514 },
                    listening: { correct: acc.listenDone || 0, total: acc.listenDone || 0, maxTarget: 2100 },
                    reading: { correct: 0, total: 0, maxTarget: 2100 }
                },
                learningData: {
                    learnedVocabItems: [],
                    savedVocabItems: [],
                    takeNotesList: [],
                    savedGrammarNotes: [],
                    savedWords: []
                },
                lastUpdated: Date.now()
            };
        },

        // Đọc dữ liệu local theo namespace của tài khoản hiện tại
        loadLocalData() {
            try {
                const key = this.getStorageKey();
                const raw = localStorage.getItem(key);
                if (raw) {
                    return JSON.parse(raw);
                }
            } catch (e) {
                console.warn('[AuthSyncManager] Lỗi đọc local data:', e);
            }
            return null;
        },

        // Lưu dữ liệu vào local namespace của tài khoản hiện tại
        saveLocalData(data) {
            try {
                const key = this.getStorageKey();
                localStorage.setItem(key, JSON.stringify(data));
            } catch (e) {
                console.warn('[AuthSyncManager] Lỗi ghi local data:', e);
            }
        },

        // ---------------------------------------------------------------------
        // 3. RESET TOÀN BỘ STATE TRÊN GIAO DIỆN (CHỐNG RÒ RỈ DỮ LIỆU KHI ĐỔI ACC)
        // ---------------------------------------------------------------------
        resetMemoryState() {
            if (window.state) {
                window.state.xp = 0;
                window.state.streak = 0;
                window.state.vocabLearned = 0;
                window.state.grammarDone = 0;
                window.state.listenDone = 0;
                window.state.readDone = 0;
                window.state.dictationDone = 0;
                window.state.studyMinutes = 0;
                window.state.correctAnswers = 0;
                window.state.totalAnswers = 0;
                window.state.listenTotalAnswers = 0;
                window.state.listenCorrectAnswers = 0;
                window.state.vocabTotalAnswers = 0;
                window.state.vocabCorrectAnswers = 0;
            }
            if (Array.isArray(window.learnedVocabItems)) window.learnedVocabItems.length = 0;
            if (Array.isArray(window.savedVocabItems)) window.savedVocabItems.length = 0;
            if (Array.isArray(window.savedGrammarNotes)) window.savedGrammarNotes.length = 0;
            if (Array.isArray(window.takeNotesList)) window.takeNotesList.length = 0;

            if (typeof window.updateDashboardMetrics === 'function') {
                window.updateDashboardMetrics();
            }
            if (window.DailyTaskManager && typeof window.DailyTaskManager.render === 'function') {
                window.DailyTaskManager.render();
            }
        },

        // ---------------------------------------------------------------------
        // 4. ÁP DỤNG DỮ LIỆU ĐÃ TẢI VÀO GLOBAL STATE & GIAO DIỆN
        // ---------------------------------------------------------------------
        applyDataToState(data) {
            if (!data) return;
            const s = data.stats || {};
            if (window.state) {
                window.state.xp = s.xp || 0;
                window.state.streak = s.streak || 0;
                window.state.vocabLearned = s.vocabLearned || 0;
                window.state.grammarDone = s.grammarDone || 0;
                window.state.listenDone = s.listenDone || 0;
                window.state.readDone = s.readDone || 0;
                window.state.dictationDone = s.dictationDone || 0;
                window.state.studyMinutes = s.studyMinutes || 0;
                window.state.correctAnswers = s.correctAnswers || 0;
                window.state.totalAnswers = s.totalAnswers || 0;
                window.state.listenTotalAnswers = s.listenTotalAnswers || 0;
                window.state.listenCorrectAnswers = s.listenCorrectAnswers || 0;
                window.state.vocabTotalAnswers = s.vocabTotalAnswers || 0;
                window.state.vocabCorrectAnswers = s.vocabCorrectAnswers || 0;
            }

            if (data.goals && window.currentUserAccount) {
                if (data.goals.targetScore) window.currentUserAccount.targetScore = data.goals.targetScore;
                if (data.goals.examDate) window.currentUserAccount.examDate = data.goals.examDate;
            }

            const ld = data.learningData || {};
            window.learnedVocabItems = Array.isArray(ld.learnedVocabItems) ? [...ld.learnedVocabItems] : [];
            window.savedVocabItems = Array.isArray(ld.savedVocabItems) ? [...ld.savedVocabItems] : [];
            window.savedGrammarNotes = Array.isArray(ld.savedGrammarNotes) ? [...ld.savedGrammarNotes] : [];

            if (Array.isArray(ld.takeNotesList) && ld.takeNotesList.length > 0) {
                window.takeNotesList = [...ld.takeNotesList];
                window.activeNoteId = ld.takeNotesList[0].id;
            } else {
                const name = window.currentUserAccount?.name || 'bạn';
                window.takeNotesList = [{
                    id: 'note-1',
                    title: `📝 Ghi chú Part 5 & Bẫy TOEIC 2026`,
                    category: 'Part 5 Bẫy',
                    paper: 'paper-lined',
                    updatedAt: 'Vừa xong',
                    updatedAtMs: Date.now(),
                    content: '<p><strong>[Mẹo Part 5]:</strong> Cẩn thận bẫy từ loại đuôi <em>-ive</em> (initiative, representative) là danh từ!</p>'
                }];
                window.activeNoteId = 'note-1';
            }

            // Đồng bộ DailyTaskManager
            if (data.dailyMissions && window.DailyTaskManager) {
                const todayStr = this.getTodayDateStr();
                if (data.dailyMissions.date === todayStr) {
                    window.DailyTaskManager.saveTasks(data.dailyMissions);
                }
            }

            // Cập nhật toàn bộ giao diện
            if (typeof window.persistTakeNotes === 'function') window.persistTakeNotes();
            if (typeof window.renderTakeNoteSidebarList === 'function') window.renderTakeNoteSidebarList();
            if (typeof window.loadActiveTakeNoteIntoEditor === 'function') window.loadActiveTakeNoteIntoEditor();
            if (typeof window.renderLearnedVocabList === 'function') window.renderLearnedVocabList();
            if (typeof window.renderSavedVocabList === 'function') window.renderSavedVocabList();
            if (typeof window.renderAllVocabGroups === 'function') window.renderAllVocabGroups();
            if (typeof window.renderAllGrammarGroups === 'function') window.renderAllGrammarGroups();
            if (window.PersonalizedRoadmapEngine) window.PersonalizedRoadmapEngine.renderRoadmapView();
            if (typeof window.updateDashboardMetrics === 'function') window.updateDashboardMetrics();
            if (window.DailyTaskManager && typeof window.DailyTaskManager.render === 'function') {
                window.DailyTaskManager.render();
            }
            if (window.FloatingTakeNote) {
                window.FloatingTakeNote.syncWithGlobalNotes();
                window.FloatingTakeNote.updateSelectorDropdown();
                window.FloatingTakeNote.loadActiveNote();
            }
        },

        // ---------------------------------------------------------------------
        // 5. CHUYỂN ĐỔI TÀI KHOẢN HOẶC ĐĂNG NHẬP (LẬP TỨC NẠP NAMESPACE MỚI)
        // ---------------------------------------------------------------------
        async onAccountChange(newAccount) {
            console.log(`[AuthSyncManager] Chuyển sang tài khoản: ${newAccount?.name} (${newAccount?.id})`);
            
            // 1. Ngắt kết nối stream cũ
            this.disconnectStream();

            // 2. Reset memory state để tránh rò rỉ dữ liệu
            this.resetMemoryState();

            // 3. Đặt account mới
            window.currentUserAccount = newAccount;

            // 4. Nạp dữ liệu local của tài khoản này ngay lập tức (0ms)
            let localData = this.loadLocalData();
            if (!localData) {
                localData = this.getDefaultDataSchema(newAccount);
                this.saveLocalData(localData);
            }
            this.applyDataToState(localData);

            // 5. Tải bản mới nhất từ Server/Cloud và hợp nhất
            await this.fetchAndMergeServerData();

            // 6. Kết nối stream Realtime cho account mới
            this.connectStream();
        },

        // ---------------------------------------------------------------------
        // 6. ĐĂNG XUẤT (RESET SẠCH SẼ VỀ GUEST)
        // ---------------------------------------------------------------------
        onLogout() {
            console.log('[AuthSyncManager] Đăng xuất tài khoản, chuyển về Guest.');
            this.flushSync();
            this.disconnectStream();
            this.resetMemoryState();
            window.currentUserAccount = null;

            let guestData = this.loadLocalData();
            if (!guestData) {
                guestData = this.getDefaultDataSchema({ id: 'guest', name: 'Khách' });
                this.saveLocalData(guestData);
            }
            this.applyDataToState(guestData);
        },

        // ---------------------------------------------------------------------
        // 7. THU THẬP FULL SNAPSHOT DỮ LIỆU ĐỂ LƯU
        // ---------------------------------------------------------------------
        collectCurrentSnapshot() {
            const today = this.getTodayDateStr();
            const acc = window.currentUserAccount || {};
            const s = window.state || {};
            const dailyData = window.DailyTaskManager ? window.DailyTaskManager.loadTasks() : null;

            return {
                uid: this.getUid(),
                profile: {
                    id: acc.id || 'guest',
                    name: acc.name || 'Học viên',
                    email: acc.email || '',
                    avatar: acc.avatar || '',
                    joinedDate: acc.createdAt || new Date().toISOString()
                },
                goals: {
                    targetScore: acc.targetScore || '600',
                    examDate: acc.examDate || '20/12/2026'
                },
                stats: {
                    xp: s.xp || 0,
                    streak: s.streak || 0,
                    vocabLearned: s.vocabLearned || 0,
                    grammarDone: s.grammarDone || 0,
                    listenDone: s.listenDone || 0,
                    readDone: s.readDone || 0,
                    dictationDone: s.dictationDone || 0,
                    studyMinutes: s.studyMinutes || 0,
                    correctAnswers: s.correctAnswers || 0,
                    totalAnswers: s.totalAnswers || 0,
                    listenTotalAnswers: s.listenTotalAnswers || 0,
                    listenCorrectAnswers: s.listenCorrectAnswers || 0,
                    vocabTotalAnswers: s.vocabTotalAnswers || 0,
                    vocabCorrectAnswers: s.vocabCorrectAnswers || 0
                },
                dailyMissions: dailyData || {
                    date: today,
                    tasks: {
                        grammar: { current: s.grammarDone || 0, target: 20, xp: 10 },
                        vocabReview: { current: 0, target: 10, xp: 10 },
                        vocabNew: { current: s.vocabLearned || 0, target: 10, xp: 10 },
                        listening: { current: s.listenDone || 0, target: 10, xp: 10 },
                        reading: { current: s.readDone || 0, target: 10, xp: 10 }
                    }
                },
                skillAccuracy: {
                    grammar: { correct: s.grammarDone || 0, total: Math.max(1, s.grammarDone || 0), maxTarget: 1500 },
                    vocab: { correct: s.vocabLearned || 0, total: s.vocabLearned || 0, maxTarget: 4514 },
                    listening: { correct: s.listenDone || 0, total: Math.max(1, s.listenDone || 0), maxTarget: 2100 },
                    reading: { correct: s.readDone || 0, total: Math.max(1, s.readDone || 0), maxTarget: 2100 }
                },
                learningData: {
                    learnedVocabItems: Array.isArray(window.learnedVocabItems) ? window.learnedVocabItems : [],
                    savedVocabItems: Array.isArray(window.savedVocabItems) ? window.savedVocabItems : [],
                    takeNotesList: Array.isArray(window.takeNotesList) ? window.takeNotesList : [],
                    savedGrammarNotes: Array.isArray(window.savedGrammarNotes) ? window.savedGrammarNotes : [],
                    savedWords: Array.isArray(window.state?.savedWords) ? window.state.savedWords : []
                },
                lastUpdated: Date.now()
            };
        },

        // ---------------------------------------------------------------------
        // 8. ACTION TRIGGERED SYNC (OPTIMISTIC LOCAL + DEBOUNCED CLOUD PUSH)
        // ---------------------------------------------------------------------
        saveUserData(partialData = {}) {
            // 1. Áp dụng ngay vào State nếu có
            if (partialData.goals && window.currentUserAccount) {
                if (partialData.goals.targetScore) window.currentUserAccount.targetScore = partialData.goals.targetScore;
                if (partialData.goals.examDate) window.currentUserAccount.examDate = partialData.goals.examDate;
            }
            if (partialData.stats && window.state) {
                Object.assign(window.state, partialData.stats);
            }

            // 2. Lưu tức thời vào LocalStorage theo namespace riêng
            const snapshot = this.collectCurrentSnapshot();
            this.saveLocalData(snapshot);

            // 3. Cập nhật Dashboard
            if (typeof window.updateDashboardMetrics === 'function') {
                window.updateDashboardMetrics();
            }

            // 4. Lên lịch đẩy lên Server (Debounce 1.5s)
            this.scheduleSync();
        },

        scheduleSync() {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.pushSyncToServer();
            }, 1500);
        },

        flushSync() {
            clearTimeout(this.debounceTimer);
            this.pushSyncToServer();
        },

        async pushSyncToServer() {
            if (this.isSyncing) return;
            const uid = this.getUid();
            if (uid === 'guest') return; // Không đẩy guest lên server nếu chưa đăng nhập

            this.isSyncing = true;
            try {
                const snapshot = this.collectCurrentSnapshot();
                const payload = {
                    userId: uid,
                    state: snapshot.stats,
                    learnedVocabItems: snapshot.learningData.learnedVocabItems,
                    savedVocabItems: snapshot.learningData.savedVocabItems,
                    takeNotesList: snapshot.learningData.takeNotesList,
                    savedGrammarNotes: snapshot.learningData.savedGrammarNotes,
                    savedWords: snapshot.learningData.savedWords,
                    dailyTasks: snapshot.dailyMissions,
                    goals: snapshot.goals,
                    timestamp: Date.now()
                };

                const res = await fetch('/api/study-sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const json = await res.json();
                    if (json && json.data) {
                        // Cập nhật streakInfo nếu server trả về
                        if (json.data.streakInfo && typeof window.renderStreakWeekDays === 'function') {
                            window.renderStreakWeekDays(json.data.streakInfo);
                        }
                    }
                }
            } catch (err) {
                console.warn('[AuthSyncManager] Offline mode: Dữ liệu đã lưu an toàn tại máy.');
            } finally {
                this.isSyncing = false;
            }
        },

        // ---------------------------------------------------------------------
        // 9. TẢI VÀ HỢP NHẤT DỮ LIỆU TỪ SERVER (PULL & MERGE)
        // ---------------------------------------------------------------------
        async fetchAndMergeServerData() {
            const uid = this.getUid();
            if (uid === 'guest') return;

            try {
                const res = await fetch(`/api/study-sync?userId=${encodeURIComponent(uid)}`, { credentials: 'include' });
                if (!res.ok) return;
                const json = await res.json();
                if (json && json.success && json.data) {
                    const cloudData = json.data;
                    const localData = this.loadLocalData() || this.getDefaultDataSchema();

                    // Hợp nhất dữ liệu: Lấy giá trị lớn nhất cho stats
                    const mergedStats = {
                        ...localData.stats,
                        xp: Math.max(localData.stats?.xp || 0, cloudData.state?.xp || 0),
                        streak: Math.max(localData.stats?.streak || 0, cloudData.state?.streak || 0),
                        vocabLearned: Math.max(localData.stats?.vocabLearned || 0, cloudData.state?.vocabLearned || 0),
                        grammarDone: Math.max(localData.stats?.grammarDone || 0, cloudData.state?.grammarDone || 0),
                        listenDone: Math.max(localData.stats?.listenDone || 0, cloudData.state?.listenDone || 0),
                        readDone: Math.max(localData.stats?.readDone || 0, cloudData.state?.readDone || 0),
                        dictationDone: Math.max(localData.stats?.dictationDone || 0, cloudData.state?.dictationDone || 0),
                        studyMinutes: Math.max(localData.stats?.studyMinutes || 0, cloudData.state?.studyMinutes || 0),
                        correctAnswers: Math.max(localData.stats?.correctAnswers || 0, cloudData.state?.correctAnswers || 0),
                        totalAnswers: Math.max(localData.stats?.totalAnswers || 0, cloudData.state?.totalAnswers || 0),
                        listenTotalAnswers: Math.max(localData.stats?.listenTotalAnswers || 0, cloudData.state?.listenTotalAnswers || 0),
                        listenCorrectAnswers: Math.max(localData.stats?.listenCorrectAnswers || 0, cloudData.state?.listenCorrectAnswers || 0),
                        vocabTotalAnswers: Math.max(localData.stats?.vocabTotalAnswers || 0, cloudData.state?.vocabTotalAnswers || 0),
                        vocabCorrectAnswers: Math.max(localData.stats?.vocabCorrectAnswers || 0, cloudData.state?.vocabCorrectAnswers || 0)
                    };

                    // Hợp nhất takeNotesList
                    const notesMap = new Map();
                    (cloudData.takeNotesList || []).forEach(n => notesMap.set(n.id, n));
                    (localData.learningData?.takeNotesList || []).forEach(n => {
                        if (!notesMap.has(n.id) || (n.updatedAtMs || 0) >= (notesMap.get(n.id).updatedAtMs || 0)) {
                            notesMap.set(n.id, n);
                        }
                    });

                    // Hợp nhất learnedVocabItems
                    const vocabMap = new Map();
                    (cloudData.learnedVocabItems || []).forEach(w => vocabMap.set((w.word || '').toLowerCase(), w));
                    (localData.learningData?.learnedVocabItems || []).forEach(w => vocabMap.set((w.word || '').toLowerCase(), w));

                    const finalData = {
                        ...localData,
                        goals: {
                            targetScore: cloudData.targetScore || localData.goals?.targetScore || '600',
                            examDate: cloudData.examDate || localData.goals?.examDate || '20/12/2026'
                        },
                        stats: mergedStats,
                        learningData: {
                            ...localData.learningData,
                            takeNotesList: Array.from(notesMap.values()),
                            learnedVocabItems: Array.from(vocabMap.values())
                        },
                        lastUpdated: Date.now()
                    };

                    this.saveLocalData(finalData);
                    this.applyDataToState(finalData);
                }
            } catch (err) {
                console.warn('[AuthSyncManager] Lỗi pull server data:', err);
            }
        },

        // ---------------------------------------------------------------------
        // 10. REALTIME SSE STREAM (CROSS-DEVICE SYNC TỰ ĐỘNG THEO UID)
        // ---------------------------------------------------------------------
        connectStream() {
            const uid = this.getUid();
            if (uid === 'guest') return;
            this.disconnectStream();

            try {
                this.evtSource = new EventSource('/api/study-sync/stream');
                this.evtSource.onmessage = (e) => {
                    if (!e.data) return;
                    try {
                        const payload = JSON.parse(e.data);
                        if (payload.type === 'SYNC_UPDATE' && payload.userId === uid && payload.data) {
                            console.log('🔄 [AuthSyncManager] Nhận cập nhật Realtime từ thiết bị khác.');
                            this.applyDataToState({
                                stats: payload.data.state,
                                goals: { targetScore: payload.data.targetScore, examDate: payload.data.examDate },
                                learningData: {
                                    takeNotesList: payload.data.takeNotesList,
                                    learnedVocabItems: payload.data.learnedVocabItems
                                }
                            });
                        }
                    } catch (err) {}
                };
            } catch (err) {
                console.warn('[AuthSyncManager] Không thể kết nối EventSource:', err);
            }
        },

        disconnectStream() {
            if (this.evtSource) {
                try { this.evtSource.close(); } catch (e) {}
                this.evtSource = null;
            }
        },

        // ---------------------------------------------------------------------
        // 11. ACTIVE STUDY TIME TRACKER (TỰ ĐỘNG TĂNG SỐ PHÚT HỌC KHI USER TƯƠNG TÁC)
        // ---------------------------------------------------------------------
        initActiveStudyTracker() {
            const markActivity = () => {
                this.lastActivityTimestamp = Date.now();
            };

            window.addEventListener('mousemove', markActivity, { passive: true });
            window.addEventListener('keydown', markActivity, { passive: true });
            window.addEventListener('click', markActivity, { passive: true });
            window.addEventListener('touchstart', markActivity, { passive: true });
            window.addEventListener('scroll', markActivity, { passive: true });

            // Cứ mỗi 60 giây, nếu người dùng có hoạt động trong vòng 2 phút qua -> Tăng 1 phút học
            clearInterval(this.activeStudyTimer);
            this.activeStudyTimer = setInterval(() => {
                const now = Date.now();
                if (now - this.lastActivityTimestamp < 120000 && !document.hidden) {
                    if (window.state) {
                        window.state.studyMinutes = (window.state.studyMinutes || 0) + 1;
                        if (typeof window.updateDashboardMetrics === 'function') {
                            window.updateDashboardMetrics();
                        }
                        this.saveUserData({ stats: { studyMinutes: window.state.studyMinutes } });
                    }
                }
            }, 60000);
        },

        // ---------------------------------------------------------------------
        // 12. KHỞI TẠO HỆ THỐNG
        // ---------------------------------------------------------------------
        init() {
            // Lắng nghe đóng tab hoặc ẩn trình duyệt để ép đẩy dữ liệu
            window.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.flushSync();
                }
            });
            window.addEventListener('beforeunload', () => {
                this.flushSync();
            });

            this.initActiveStudyTracker();
            console.log('🛡️ AuthSyncManager initialized successfully with Namespace Isolation.');
        }
    };

    window.AuthSyncManager = AuthSyncManager;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => AuthSyncManager.init());
    } else {
        AuthSyncManager.init();
    }
})(typeof window !== 'undefined' ? window : this);
