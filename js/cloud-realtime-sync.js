        import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
        import { getAuth, signInAnonymously, signInWithCustomToken } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
        import { getFirestore, doc, setDoc, collection, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

        (async function initCloudMultiUser() {
            try {
                if (typeof __firebase_config === 'undefined' || !__firebase_config) return;
                const firebaseConfig = JSON.parse(__firebase_config);
                const appId = typeof __app_id !== 'undefined' ? __app_id : 'cung-dang-ra-truong';
                const app = initializeApp(firebaseConfig);
                const auth = getAuth(app);
                const db = getFirestore(app);

                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }

                const user = auth.currentUser;
                if (!user) return;

                const membersCol = collection(db, 'artifacts', appId, 'public', 'data', 'study_members');

                window.syncAccountToCloud = async function (acc) {
                    if (!auth.currentUser || !acc) return;
                    try {
                        const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'study_members', acc.id);
                        await setDoc(docRef, {
                            id: acc.id,
                            name: acc.name,
                            email: acc.email,
                            exam: acc.exam || 'TOEIC',
                            targetScore: acc.targetScore || '600',
                            examDate: acc.examDate || '',
                            xp: acc.xp || 0,
                            streak: acc.streak || 0,
                            vocabLearned: acc.vocabLearned || 0,
                            dictationDone: acc.dictationDone || 0,
                            avatarColor: acc.avatarColor || 'bg-purple-700',
                            updatedAt: Date.now()
                        });
                    } catch (e) {
                        console.warn('Cloud sync warning:', e);
                    }
                };

                // Sync initial default account
                if (typeof currentUserAccount !== 'undefined' && currentUserAccount) {
                    window.syncAccountToCloud(currentUserAccount);
                }

                // Listen for all multi-user accounts in real time
                onSnapshot(
                    membersCol,
                    (snapshot) => {
                        snapshot.forEach((docSnap) => {
                            const data = docSnap.data();
                            if (!data || !data.id) return;
                            const idx = accountsDirectory.findIndex(a => a.id === data.id);
                            if (idx !== -1) {
                                accountsDirectory[idx] = { ...accountsDirectory[idx], ...data };
                            } else {
                                accountsDirectory.push(data);
                            }
                        });
                        renderMultiAccountLists();
                    },
                    (err) => {
                        console.warn('Realtime members listener error:', err);
                    }
                );
            } catch (e) {
                console.warn('Cloud multi-user setup skipped:', e);
            }
        })();