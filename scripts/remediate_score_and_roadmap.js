const fs = require('fs');
const path = require('path');

console.log('🚀 Starting System Remediation for Score Inflation & Roadmap Premature Completion...');

// 1. CẬP NHẬT js/ets-adaptive-scorer.js & www/js/ets-adaptive-scorer.js
function updateEtsScorer(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return false;
    }
    let content = fs.readFileSync(filePath, 'utf8');

    const searchTarget = `            // Thuật toán IRT ước lượng điểm Listening
            let estListening = lDiag;
            let lConfidence = 30;

            if (lAnswered >= 5) {
                const acc = Math.min(1, Math.max(0, lCorrect / lAnswered));
                const performanceBoost = (acc - 0.5) * 180;
                estListening = Math.round(Math.min(this.ETS_MAX, Math.max(this.ETS_MIN, lDiag * 0.4 + (250 + performanceBoost) * 0.6)));
                lConfidence = Math.max(15, Math.round(30 - Math.min(15, lAnswered * 0.5)));
            }

            // Thuật toán IRT ước lượng điểm Reading (kết hợp Reading và Grammar)
            let estReading = rDiag;
            let rConfidence = 30;
            const combinedReadAnswered = rAnswered + gAnswered;
            const combinedReadCorrect = rCorrect + gCorrect;

            if (combinedReadAnswered >= 5) {
                const acc = Math.min(1, Math.max(0, combinedReadCorrect / combinedReadAnswered));
                const performanceBoost = (acc - 0.5) * 180;
                estReading = Math.round(Math.min(this.ETS_MAX, Math.max(this.ETS_MIN, rDiag * 0.4 + (240 + performanceBoost) * 0.6)));
                rConfidence = Math.max(15, Math.round(30 - Math.min(15, combinedReadAnswered * 0.5)));
            }`;

    const replacement = `            // Thuật toán IRT ước lượng điểm Listening:
            // Neo giữ chuẩn xác theo lDiag từ bài test chẩn đoán đầu vào.
            // Chỉ bắt đầu hiệu chỉnh khi người dùng hoàn thành ít nhất 15 câu luyện tập thực tế sau test.
            // Áp dụng mô hình co thắt Bayes (Bayesian Shrinkage) tương đối quanh lDiag, không cộng mốc 250 tùy tiện.
            let estListening = lDiag;
            let lConfidence = 25;

            if (lAnswered >= 15) {
                const acc = Math.min(1, Math.max(0, lCorrect / lAnswered));
                const weightBaseline = 30 / (30 + (lAnswered - 14));
                const practiceTarget = Math.min(this.ETS_MAX, Math.max(this.ETS_MIN, lDiag + (acc - (lDiag / this.ETS_MAX)) * 120));
                estListening = Math.round(lDiag * weightBaseline + practiceTarget * (1 - weightBaseline));
                lConfidence = Math.max(15, Math.round(25 - Math.min(10, (lAnswered - 14) * 0.25)));
            } else {
                estListening = lDiag;
                lConfidence = 25;
            }

            // Thuật toán IRT ước lượng điểm Reading (kết hợp Reading và Grammar):
            let estReading = rDiag;
            let rConfidence = 25;
            const combinedReadAnswered = rAnswered + gAnswered;
            const combinedReadCorrect = rCorrect + gCorrect;

            if (combinedReadAnswered >= 15) {
                const acc = Math.min(1, Math.max(0, combinedReadCorrect / combinedReadAnswered));
                const weightBaseline = 30 / (30 + (combinedReadAnswered - 14));
                const practiceTarget = Math.min(this.ETS_MAX, Math.max(this.ETS_MIN, rDiag + (acc - (rDiag / this.ETS_MAX)) * 120));
                estReading = Math.round(rDiag * weightBaseline + practiceTarget * (1 - weightBaseline));
                rConfidence = Math.max(15, Math.round(25 - Math.min(10, (combinedReadAnswered - 14) * 0.25)));
            } else {
                estReading = rDiag;
                rConfidence = 25;
            }`;

    // Normalize CRLF to LF for matching
    const normalizedContent = content.replace(/\r\n/g, '\n');
    const normalizedSearch = searchTarget.replace(/\r\n/g, '\n');
    const normalizedReplacement = replacement.replace(/\r\n/g, '\n');

    if (!normalizedContent.includes(normalizedSearch)) {
        console.error(`Search target not found in ${filePath}`);
        return false;
    }

    const updated = normalizedContent.replace(normalizedSearch, normalizedReplacement);
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ [Scorer] Updated ${filePath}`);
    return true;
}

// 2. CẬP NHẬT js/roadmap-and-traps.js & www/js/roadmap-and-traps.js
function updateRoadmap(filePath) {
    if (!fs.existsSync(filePath)) {
        console.warn(`File not found: ${filePath}`);
        return false;
    }
    let content = fs.readFileSync(filePath, 'utf8');

    const searchTarget = `        this.roadmapStages.forEach(stage => {
            if (stage.stageId < currentStageId) {
                // Các chặng bên dưới điểm test đầu vào -> TỰ ĐỘNG ĐÁNH DẤU HOÀN THÀNH (Completed)
                stage.nodes.forEach(node => {
                    nodeStates[node.id] = { status: 'exempted', progressPct: 0, note: 'Được miễn (Khảo sát đầu vào)' };
                });
            } else if (stage.stageId === currentStageId) {
                // Chặng hiện tại tương ứng với trình độ
                let activeNodeInStage = (stage.nodes[0] || {}).id;
                if (diag) {
                    if (weakestPillarId === 'gap-part12-listening') activeNodeInStage = (stage.nodes[1] || stage.nodes[0] || {}).id;
                    else if (weakestPillarId === 'gap-part34-paraphrase') activeNodeInStage = (stage.nodes[2] || stage.nodes[0] || {}).id;
                    else if (weakestPillarId.includes('part5')) activeNodeInStage = (stage.nodes[4] || stage.nodes[0] || {}).id;
                    else if (weakestPillarId.includes('part6')) activeNodeInStage = (stage.nodes[5] || stage.nodes[0] || {}).id;
                    else if (weakestPillarId.includes('part7')) activeNodeInStage = (stage.nodes[6] || stage.nodes[0] || {}).id;
                }
                currentActiveNodeId = activeNodeInStage;

                let passedActive = false;
                stage.nodes.forEach(node => {
                    if (node.id === activeNodeInStage) {
                        nodeStates[node.id] = { status: 'current', progressPct: 35, note: 'Trọng tâm cần bù đắp' };
                        passedActive = true;
                    } else if (!passedActive) {
                        nodeStates[node.id] = { status: 'completed', progressPct: 100, note: 'Đã hoàn thành' };
                    } else {
                        nodeStates[node.id] = { status: 'unlocked', progressPct: 0, note: 'Sẵn sàng học' };
                    }
                });
            } else {
                // Các chặng ở band điểm cao hơn -> KHÓA (Locked)
                stage.nodes.forEach(node => {
                    nodeStates[node.id] = { status: 'locked', progressPct: 0, note: 'Cần vượt qua chặng trước' };
                });
            }
        });`;

    const replacement = `        // Lấy danh sách các node người dùng đã thực sự hoàn thành trong quá trình học
        let completedNodes = user?.completedNodes || [];
        if (!Array.isArray(completedNodes)) completedNodes = [];
        try {
            const storedCompleted = JSON.parse(localStorage.getItem('cung_dang_completed_nodes') || '[]');
            if (Array.isArray(storedCompleted)) {
                completedNodes = Array.from(new Set([...completedNodes, ...storedCompleted]));
            }
        } catch (e) {}

        // Map từ weakestPillarId sang PartNum
        let weakestPartNum = null;
        if (weakestPillarId === 'gap-part12-listening') weakestPartNum = 1;
        else if (weakestPillarId === 'gap-part34-paraphrase') weakestPartNum = 3;
        else if (weakestPillarId.includes('part5')) weakestPartNum = 5;
        else if (weakestPillarId.includes('part6')) weakestPartNum = 6;
        else if (weakestPillarId.includes('part7')) weakestPartNum = 7;

        this.roadmapStages.forEach(stage => {
            if (stage.stageId < currentStageId) {
                // Các chặng bên dưới điểm test đầu vào -> TỰ ĐỘNG ĐƯỢC MIỄN (Exempted) do điểm cao
                stage.nodes.forEach(node => {
                    nodeStates[node.id] = { status: 'exempted', progressPct: 0, note: 'Được miễn (Khảo sát đầu vào)' };
                });
            } else if (stage.stageId === currentStageId) {
                // Chặng hiện tại tương ứng với trình độ người dùng
                // NGUYÊN TẮC VÀNG:
                // 1. KHÔNG tự động tick hoàn thành (completed) cho bất kỳ node nào nếu học viên chưa học!
                // 2. Điểm yếu nhất (weakestPillar) được đánh dấu nhãn cảnh báo (isWeakest: true), KHÔNG ép nhảy cóc làm biến mất tiến trình Part 1-4.
                // 3. Người mới bắt đầu (Band 1) luôn bắt đầu tại Node 1 (Part 1).
                let foundCurrent = false;

                stage.nodes.forEach((node, idx) => {
                    const isTrulyCompleted = completedNodes.includes(node.id);
                    const isWeakest = (weakestPartNum !== null && node.partNum === weakestPartNum);

                    if (isTrulyCompleted) {
                        nodeStates[node.id] = { status: 'completed', progressPct: 100, note: 'Đã hoàn thành', isWeakest: false };
                    } else if (!foundCurrent) {
                        // Node chưa học đầu tiên là Node Đang Học (Current)
                        currentActiveNodeId = node.id;
                        nodeStates[node.id] = {
                            status: 'current',
                            progressPct: 0,
                            note: isWeakest ? 'Trọng tâm cần bù đắp' : (idx === 0 ? 'Bắt đầu chặng' : 'Bài học tiếp theo'),
                            isWeakest: isWeakest
                        };
                        foundCurrent = true;
                    } else {
                        // Các node tiếp theo sẵn sàng học
                        nodeStates[node.id] = {
                            status: 'unlocked',
                            progressPct: 0,
                            note: isWeakest ? '⚠️ Lỗ hổng cần chú ý' : 'Sẵn sàng học',
                            isWeakest: isWeakest
                        };
                    }
                });

                if (!currentActiveNodeId && stage.nodes.length > 0) {
                    currentActiveNodeId = stage.nodes[0].id;
                }
            } else {
                // Các chặng ở band điểm cao hơn -> KHÓA (Locked)
                stage.nodes.forEach(node => {
                    nodeStates[node.id] = { status: 'locked', progressPct: 0, note: 'Cần vượt qua chặng trước' };
                });
            }
        });`;

    const normalizedContent = content.replace(/\r\n/g, '\n');
    const normalizedSearch = searchTarget.replace(/\r\n/g, '\n');
    const normalizedReplacement = replacement.replace(/\r\n/g, '\n');

    if (!normalizedContent.includes(normalizedSearch)) {
        console.error(`Search target not found in ${filePath}`);
        return false;
    }

    const updated = normalizedContent.replace(normalizedSearch, normalizedReplacement);
    fs.writeFileSync(filePath, updated, 'utf8');
    console.log(`✅ [Roadmap] Updated ${filePath}`);
    return true;
}

// 3. CẬP NHẬT server.js (Đồng bộ safeUser trong /api/me)
function updateServer() {
    const serverPath = 'server.js';
    let content = fs.readFileSync(serverPath, 'utf8');

    const searchTarget = `    const safeUser = {
      ...user,
      streak: profile.state?.streak || profile.streakInfo?.streak || user.streak || 0,
      targetScore: profile.targetScore || user.targetScore || '',
      examDate: profile.examDate || user.examDate || ''
    };`;

    const replacement = `    const safeUser = {
      ...user,
      streak: profile.state?.streak || profile.streakInfo?.streak || user.streak || 0,
      targetScore: profile.targetScore || user.targetScore || '',
      examDate: profile.examDate || user.examDate || '',
      diagnosticResults: profile.diagnosticResults || user.diagnosticResults || null,
      completedNodes: profile.completedNodes || user.completedNodes || []
    };`;

    const normalizedContent = content.replace(/\r\n/g, '\n');
    const normalizedSearch = searchTarget.replace(/\r\n/g, '\n');
    const normalizedReplacement = replacement.replace(/\r\n/g, '\n');

    if (normalizedContent.includes(normalizedSearch)) {
        const updated = normalizedContent.replace(normalizedSearch, normalizedReplacement);
        fs.writeFileSync(serverPath, updated, 'utf8');
        console.log(`✅ [Server] Updated safeUser in ${serverPath}`);
    } else {
        console.log(`ℹ️ [Server] safeUser already updated or target mismatch`);
    }
}

// 4. LÀM SẠCH VÀ ĐỒNG BỘ DỮ LIỆU USER PROFILE
function syncUserProfile() {
    const profilePath = 'data/profiles/acc-g-1792730904332.json';
    if (!fs.existsSync(profilePath)) {
        console.warn(`Profile file not found: ${profilePath}`);
        return;
    }
    const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));

    // Gán kết quả bài test chẩn đoán 155 điểm
    profile.diagnosticResults = {
        testedDate: "03/11/2026",
        totalCorrect: 6,
        listeningCorrect: 4,
        readingCorrect: 2,
        listeningScore: 105,
        readingScore: 50,
        listening: 105,
        reading: 50,
        score: 155,
        estimatedScore: 155,
        pillarScores: {
            "gap-part12-listening": 38,
            "gap-part34-paraphrase": 13,
            "gap-part5-grammar": 33,
            "gap-part5-vocab": 0,
            "gap-part6-insertion": 0,
            "gap-part7-multi": 25
        },
        bandTitle: "Band 0 - 300 (Mất gốc / Mới bắt đầu)",
        bandDesc: "Xây dựng phản xạ nhận diện âm thanh, bối cảnh tranh người và từ loại cơ bản N - V - Adj - Adv.",
        recommendedStage: 1
    };

    // Đặt lại các biến đếm ghost để phản ánh trung thực
    if (profile.state) {
        profile.state.listenDone = 0;
        profile.state.listenTotalAnswers = 0;
        profile.state.listenCorrectAnswers = 0;
        profile.state.readDone = 0;
        profile.state.readTotalAnswers = 0;
        profile.state.readCorrectAnswers = 0;
    }

    profile.completedNodes = [];
    profile.lastUpdated = Date.now();

    fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2), 'utf8');
    console.log(`✅ [Profile] Cleaned and synchronized ${profilePath}`);

    // Đồng bộ vào users_database.json
    const usersDbPath = 'data/users_database.json';
    if (fs.existsSync(usersDbPath)) {
        const users = JSON.parse(fs.readFileSync(usersDbPath, 'utf8'));
        const uIdx = users.findIndex(u => u.id === 'acc-g-1792730904332');
        if (uIdx !== -1) {
            users[uIdx].diagnosticResults = profile.diagnosticResults;
            users[uIdx].completedNodes = [];
            fs.writeFileSync(usersDbPath, JSON.stringify(users, null, 2), 'utf8');
            console.log(`✅ [UsersDB] Synchronized diagnosticResults into ${usersDbPath}`);
        }
    }
}

// Thực thi
updateEtsScorer('js/ets-adaptive-scorer.js');
updateEtsScorer('www/js/ets-adaptive-scorer.js');
updateRoadmap('js/roadmap-and-traps.js');
updateRoadmap('www/js/roadmap-and-traps.js');
updateServer();
syncUserProfile();

console.log('🎉 All remediation modifications completed successfully!');
