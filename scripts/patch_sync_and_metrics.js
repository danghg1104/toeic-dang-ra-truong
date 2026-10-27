const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// 1. Update server.js
const serverFile = path.join(rootDir, 'server.js');
let serverCode = fs.readFileSync(serverFile, 'utf8');

const oldServerMerge = `  // Hợp nhất metrics state (lấy giá trị lớn nhất)
  if (incoming.state) {
    merged.state = {
      xp: Math.max(current.state?.xp || 0, incoming.state.xp || 0),
      vocabLearned: Math.max(current.state?.vocabLearned || 0, incoming.state.vocabLearned || 0),
      dictationDone: Math.max(current.state?.dictationDone || 0, incoming.state.dictationDone || 0),
      grammarDone: Math.max(current.state?.grammarDone || 0, incoming.state.grammarDone || 0),
      readDone: Math.max(current.state?.readDone || 0, incoming.state.readDone || 0),
      listenDone: Math.max(current.state?.listenDone || 0, incoming.state.listenDone || 0),
      studyMinutes: Math.max(current.state?.studyMinutes || 0, incoming.state.studyMinutes || 0)
    };
  }`;

const newServerMerge = `  // Hợp nhất metrics state (lấy giá trị lớn nhất)
  if (incoming.state) {
    merged.state = {
      xp: Math.max(current.state?.xp || 0, incoming.state.xp || 0),
      vocabLearned: Math.max(current.state?.vocabLearned || 0, incoming.state.vocabLearned || 0),
      dictationDone: Math.max(current.state?.dictationDone || 0, incoming.state.dictationDone || 0),
      grammarDone: Math.max(current.state?.grammarDone || 0, incoming.state.grammarDone || 0),
      readDone: Math.max(current.state?.readDone || 0, incoming.state.readDone || 0),
      listenDone: Math.max(current.state?.listenDone || 0, incoming.state.listenDone || 0),
      studyMinutes: Math.max(current.state?.studyMinutes || 0, incoming.state.studyMinutes || 0),
      totalAnswers: Math.max(current.state?.totalAnswers || 0, incoming.state.totalAnswers || 0),
      correctAnswers: Math.max(current.state?.correctAnswers || 0, incoming.state.correctAnswers || 0),
      listenTotalAnswers: Math.max(current.state?.listenTotalAnswers || 0, incoming.state.listenTotalAnswers || 0),
      listenCorrectAnswers: Math.max(current.state?.listenCorrectAnswers || 0, incoming.state.listenCorrectAnswers || 0),
      vocabTotalAnswers: Math.max(current.state?.vocabTotalAnswers || 0, incoming.state.vocabTotalAnswers || 0),
      vocabCorrectAnswers: Math.max(current.state?.vocabCorrectAnswers || 0, incoming.state.vocabCorrectAnswers || 0)
    };
  }

  if (incoming.targetScore || incoming.goals?.targetScore) {
    merged.targetScore = incoming.targetScore || incoming.goals?.targetScore;
  }
  if (incoming.examDate || incoming.goals?.examDate) {
    merged.examDate = incoming.examDate || incoming.goals?.examDate;
  }`;

// Normalize CRLF for matching
const normServerCode = serverCode.replace(/\r\n/g, '\n');
const normOldServerMerge = oldServerMerge.replace(/\r\n/g, '\n');
if (normServerCode.includes(normOldServerMerge)) {
    const updatedNorm = normServerCode.replace(normOldServerMerge, newServerMerge);
    // restore CRLF if original had CRLF
    fs.writeFileSync(serverFile, serverCode.includes('\r\n') ? updatedNorm.replace(/\n/g, '\r\n') : updatedNorm, 'utf8');
    console.log('✓ server.js updated successfully!');
} else {
    console.warn('⚠ Could not find oldServerMerge in server.js');
}

// 2. Update js/toeic-reading-workstation.js
const readingFile = path.join(rootDir, 'js', 'toeic-reading-workstation.js');
let readingCode = fs.readFileSync(readingFile, 'utf8');
const oldReadingCheck = `            const isCorrect = targetItem && optIdx === targetItem.ans;
            this.answeredState[qId] = { checked: true, isCorrect, selectedIndex: optIdx };

            // Ghi nhận tích lũy vào Daily Tasks nếu đúng
            if (isCorrect && window.DailyTaskTracker) {
                window.DailyTaskTracker.recordProgress('reading', 1);
            }`;

const newReadingCheck = `            const isCorrect = targetItem && optIdx === targetItem.ans;
            this.answeredState[qId] = { checked: true, isCorrect, selectedIndex: optIdx };

            // Ghi nhận tích lũy vào State chung & Daily Tasks & AuthSyncManager
            if (window.state) {
                window.state.totalAnswers = (window.state.totalAnswers || 0) + 1;
                if (this.part === 5) {
                    window.state.grammarDone = (window.state.grammarDone || 0) + 1;
                    window.state.grammarTotalAnswers = (window.state.grammarTotalAnswers || 0) + 1;
                    if (isCorrect) {
                        window.state.grammarCorrectAnswers = (window.state.grammarCorrectAnswers || 0) + 1;
                    }
                    if (window.DailyTaskManager) {
                        window.DailyTaskManager.recordProgress('grammar', 1);
                    }
                } else {
                    window.state.readDone = (window.state.readDone || 0) + 1;
                    window.state.readTotalAnswers = (window.state.readTotalAnswers || 0) + 1;
                    if (isCorrect) {
                        window.state.readCorrectAnswers = (window.state.readCorrectAnswers || 0) + 1;
                    }
                    if (window.DailyTaskManager) {
                        window.DailyTaskManager.recordProgress('reading', 1);
                    }
                }

                if (isCorrect) {
                    window.state.correctAnswers = (window.state.correctAnswers || 0) + 1;
                    window.state.xp = (window.state.xp || 0) + 5;
                }

                if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
                if (window.AuthSyncManager) {
                    window.AuthSyncManager.saveUserData();
                } else if (typeof saveCurrentUserProgressToServer === 'function') {
                    saveCurrentUserProgressToServer();
                }
            }`;

const normReadingCode = readingCode.replace(/\r\n/g, '\n');
const normOldReadingCheck = oldReadingCheck.replace(/\r\n/g, '\n');
if (normReadingCode.includes(normOldReadingCheck)) {
    const updatedNorm = normReadingCode.replace(normOldReadingCheck, newReadingCheck);
    fs.writeFileSync(readingFile, readingCode.includes('\r\n') ? updatedNorm.replace(/\n/g, '\r\n') : updatedNorm, 'utf8');
    console.log('✓ js/toeic-reading-workstation.js updated successfully!');
} else {
    console.warn('⚠ Could not find oldReadingCheck in toeic-reading-workstation.js');
}

// 3. Update js/toeic-listening-workstation.js
const listeningFile = path.join(rootDir, 'js', 'toeic-listening-workstation.js');
let listeningCode = fs.readFileSync(listeningFile, 'utf8');
const oldListenState = `            // Ghi nhận điểm số & XP vào state chung
            if (window.state) {
                window.state.totalAnswers = (window.state.totalAnswers || 0) + 1;
                if (isCorrect) {
                    window.state.correctAnswers = (window.state.correctAnswers || 0) + 1;
                    window.state.xp = (window.state.xp || 0) + 10;
                }
                if (window.DailyTaskManager) {
                    window.DailyTaskManager.recordProgress('listening', 1);
                }
                if (window.ToeicListeningSRS && !isCorrect) {
                    window.ToeicListeningSRS.addQuestion(qItem);
                }
            }`;

const newListenState = `            // Ghi nhận điểm số & XP vào state chung
            if (window.state) {
                window.state.totalAnswers = (window.state.totalAnswers || 0) + 1;
                window.state.listenDone = (window.state.listenDone || 0) + 1;
                window.state.listenTotalAnswers = (window.state.listenTotalAnswers || 0) + 1;
                if (isCorrect) {
                    window.state.correctAnswers = (window.state.correctAnswers || 0) + 1;
                    window.state.listenCorrectAnswers = (window.state.listenCorrectAnswers || 0) + 1;
                    window.state.xp = (window.state.xp || 0) + 10;
                }
                if (window.DailyTaskManager) {
                    window.DailyTaskManager.recordProgress('listening', 1);
                }
                if (window.ToeicListeningSRS && !isCorrect) {
                    window.ToeicListeningSRS.addQuestion(qItem);
                }
                if (typeof updateDashboardMetrics === 'function') updateDashboardMetrics();
                if (window.AuthSyncManager) {
                    window.AuthSyncManager.saveUserData();
                } else if (typeof saveCurrentUserProgressToServer === 'function') {
                    saveCurrentUserProgressToServer();
                }
            }`;

const normListeningCode = listeningCode.replace(/\r\n/g, '\n');
const normOldListenState = oldListenState.replace(/\r\n/g, '\n');
if (normListeningCode.includes(normOldListenState)) {
    const updatedNorm = normListeningCode.replace(normOldListenState, newListenState);
    fs.writeFileSync(listeningFile, listeningCode.includes('\r\n') ? updatedNorm.replace(/\n/g, '\r\n') : updatedNorm, 'utf8');
    console.log('✓ js/toeic-listening-workstation.js updated successfully!');
} else {
    console.warn('⚠ Could not find oldListenState in toeic-listening-workstation.js');
}

// 4. Update index.html
const indexFile = path.join(rootDir, 'index.html');
let indexCode = fs.readFileSync(indexFile, 'utf8');
let normIndex = indexCode.replace(/\r\n/g, '\n');

// 4a. Add auth-sync-manager.js script tag
if (!normIndex.includes('js/auth-sync-manager.js')) {
    const targetScript = `<script src="js/floating-take-note.js?v=20261026_07"></script>`;
    const replacementScript = `<script src="js/floating-take-note.js?v=20261026_07"></script>\n    <script src="js/auth-sync-manager.js?v=20261027_01"></script>`;
    normIndex = normIndex.replace(targetScript, replacementScript);
    console.log('✓ index.html: added auth-sync-manager.js script tag');
}

// 4b. Wire AuthSyncManager into UserAuthEngine.init()
const oldAuthInitSuccess = `                            currentUserAccount = res.user;
                            window.currentUserAccount = res.user;
                            try { localStorage.setItem('cung_dang_session_user', JSON.stringify(res.user)); } catch (e) {}
                            applyCurrentAccountToUI();
                            if (res.streakInfo) {
                                renderStreakWeekDays(res.streakInfo);
                            }
                            this.loadUserProgress();
                            if (window.StudySync) {
                                window.StudySync.connectStream();
                            }`;

const newAuthInitSuccess = `                            currentUserAccount = res.user;
                            window.currentUserAccount = res.user;
                            try { localStorage.setItem('cung_dang_session_user', JSON.stringify(res.user)); } catch (e) {}
                            applyCurrentAccountToUI();
                            if (res.streakInfo) {
                                renderStreakWeekDays(res.streakInfo);
                            }
                            if (window.AuthSyncManager) {
                                window.AuthSyncManager.onAccountChange(res.user);
                            } else {
                                this.loadUserProgress();
                                if (window.StudySync) {
                                    window.StudySync.connectStream();
                                }
                            }`;

if (normIndex.includes(oldAuthInitSuccess)) {
    normIndex = normIndex.replace(oldAuthInitSuccess, newAuthInitSuccess);
    console.log('✓ index.html: wired AuthSyncManager into UserAuthEngine.init()');
}

// 4c. Wire AuthSyncManager into handleLoginSubmit()
const oldLoginSuccess = `                // Đăng nhập thành công!
                currentUserAccount = res.user;
                window.currentUserAccount = res.user;
                localStorage.setItem('cung_dang_session_user', JSON.stringify(res.user));
                if (authBroadcastChannel) {
                    authBroadcastChannel.postMessage({ type: 'AUTH_LOGIN' });
                }
                UserAuthEngine.dismissGatekeeper();
                applyCurrentAccountToUI();
                UserAuthEngine.loadUserProgress();
                if (window.StudySync) window.StudySync.connectStream();`;

const newLoginSuccess = `                // Đăng nhập thành công!
                currentUserAccount = res.user;
                window.currentUserAccount = res.user;
                localStorage.setItem('cung_dang_session_user', JSON.stringify(res.user));
                if (authBroadcastChannel) {
                    authBroadcastChannel.postMessage({ type: 'AUTH_LOGIN' });
                }
                UserAuthEngine.dismissGatekeeper();
                applyCurrentAccountToUI();
                if (window.AuthSyncManager) {
                    window.AuthSyncManager.onAccountChange(res.user);
                } else {
                    UserAuthEngine.loadUserProgress();
                    if (window.StudySync) window.StudySync.connectStream();
                }`;

if (normIndex.includes(oldLoginSuccess)) {
    normIndex = normIndex.replace(oldLoginSuccess, newLoginSuccess);
    console.log('✓ index.html: wired AuthSyncManager into handleLoginSubmit()');
}

// 4d. Wire AuthSyncManager into handleGoogleCredentialResponse()
const oldGoogleSuccess = `                    currentUserAccount = data.user;
                    window.currentUserAccount = data.user;
                    try { localStorage.setItem('cung_dang_session_user', JSON.stringify(data.user)); } catch (e) {}
                    if (authBroadcastChannel) {
                        authBroadcastChannel.postMessage({ type: 'AUTH_LOGIN' });
                    }
                    UserAuthEngine.dismissGatekeeper();
                    applyCurrentAccountToUI();
                    UserAuthEngine.loadUserProgress();
                    if (window.StudySync) window.StudySync.connectStream();`;

const newGoogleSuccess = `                    currentUserAccount = data.user;
                    window.currentUserAccount = data.user;
                    try { localStorage.setItem('cung_dang_session_user', JSON.stringify(data.user)); } catch (e) {}
                    if (authBroadcastChannel) {
                        authBroadcastChannel.postMessage({ type: 'AUTH_LOGIN' });
                    }
                    UserAuthEngine.dismissGatekeeper();
                    applyCurrentAccountToUI();
                    if (window.AuthSyncManager) {
                        window.AuthSyncManager.onAccountChange(data.user);
                    } else {
                        UserAuthEngine.loadUserProgress();
                        if (window.StudySync) window.StudySync.connectStream();
                    }`;

if (normIndex.includes(oldGoogleSuccess)) {
    normIndex = normIndex.replace(oldGoogleSuccess, newGoogleSuccess);
    console.log('✓ index.html: wired AuthSyncManager into handleGoogleCredentialResponse()');
}

// 4e. Wire AuthSyncManager into switchUserAccountById()
const oldSwitchAcc = `        function switchUserAccountById(accId) {
            const target = accountsDirectory.find(a => a.id === accId);
            if (!target) return;
            UserAuthEngine.saveUserProgress();
            currentUserAccount = target;
            localStorage.setItem('cung_dang_session_user', JSON.stringify(target));
            applyCurrentAccountToUI();
            UserAuthEngine.loadUserProgress();
            closeAuthModal();
            showToast(\`🔄 Đã chuyển sang tài khoản: \${currentUserAccount.name}\`);
        }`;

const newSwitchAcc = `        function switchUserAccountById(accId) {
            const target = accountsDirectory.find(a => a.id === accId);
            if (!target) return;
            UserAuthEngine.saveUserProgress();
            currentUserAccount = target;
            localStorage.setItem('cung_dang_session_user', JSON.stringify(target));
            applyCurrentAccountToUI();
            if (window.AuthSyncManager) {
                window.AuthSyncManager.onAccountChange(target);
            } else {
                UserAuthEngine.loadUserProgress();
            }
            closeAuthModal();
            showToast(\`🔄 Đã chuyển sang tài khoản: \${currentUserAccount.name}\`);
        }`;

if (normIndex.includes(oldSwitchAcc)) {
    normIndex = normIndex.replace(oldSwitchAcc, newSwitchAcc);
    console.log('✓ index.html: wired AuthSyncManager into switchUserAccountById()');
}

// 4f. Wire AuthSyncManager into handleLogoutUser()
const oldLogoutCall = `            // 6. Xóa session lưu trữ client
            localStorage.removeItem('cung_dang_session_user');
            currentUserAccount = null;
            window.currentUserAccount = null;`;

const newLogoutCall = `            // 6. Xóa session lưu trữ client & reset namespace qua AuthSyncManager
            if (window.AuthSyncManager) {
                window.AuthSyncManager.onLogout();
            }
            localStorage.removeItem('cung_dang_session_user');
            currentUserAccount = null;
            window.currentUserAccount = null;`;

if (normIndex.includes(oldLogoutCall)) {
    normIndex = normIndex.replace(oldLogoutCall, newLogoutCall);
    console.log('✓ index.html: wired AuthSyncManager into handleLogoutUser()');
}

// 4g. Wire DailyTaskManager to use AuthSyncManager storage key
const oldDailyStorageKey = `            getStorageKey() {
                const uid = (currentUserAccount?.id || 'guest').replace(/[^a-zA-Z0-9_-]/g, '_');
                return \`cung_dang_daily_tasks_\${uid}\`;
            },`;

const newDailyStorageKey = `            getStorageKey() {
                if (window.AuthSyncManager && typeof window.AuthSyncManager.getStorageKey === 'function') {
                    return \`\${window.AuthSyncManager.getStorageKey()}_daily_tasks\`;
                }
                const uid = (currentUserAccount?.id || 'guest').replace(/[^a-zA-Z0-9_-]/g, '_');
                return \`cung_dang_daily_tasks_\${uid}\`;
            },`;

if (normIndex.includes(oldDailyStorageKey)) {
    normIndex = normIndex.replace(oldDailyStorageKey, newDailyStorageKey);
    console.log('✓ index.html: wired DailyTaskManager to use AuthSyncManager storage key');
}

fs.writeFileSync(indexFile, indexCode.includes('\r\n') ? normIndex.replace(/\n/g, '\r\n') : normIndex, 'utf8');
console.log('All patches executed successfully.');
