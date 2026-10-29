const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
const content = fs.readFileSync(indexPath, 'utf8');

const sIdx = content.indexOf('window.updateDashboardStudioHero = function() {');
const eIdx = content.indexOf('window.DailyTaskManager = DailyTaskManager;');

if (sIdx === -1 || eIdx === -1) {
  console.error('ERROR: Could not find start or end index! sIdx:', sIdx, 'eIdx:', eIdx);
  process.exit(1);
}

const newHeroBlock = `window.updateDashboardStudioHero = function() {
            const user = (typeof PersonalizedRoadmapEngine !== 'undefined') ? PersonalizedRoadmapEngine.getActiveUser() : currentUserAccount;
            const hour = new Date().getHours();
            let greeting = 'Chào bạn';
            if (hour >= 4 && hour < 12) greeting = 'Chào buổi sáng';
            else if (hour >= 12 && hour < 18) greeting = 'Chào buổi chiều';
            else greeting = 'Chào buổi tối';

            const prefixEl = document.getElementById('sanhGreetingPrefix');
            if (prefixEl) prefixEl.textContent = \`\${greeting},\`;

            const nameEl = document.getElementById('sanhMemberGreetingName');
            const targetScoreEl = document.getElementById('memberTargetScore');
            const examDateEl = document.getElementById('memberExamDate');
            const subTextEl = document.getElementById('sanhHeaderSubText');

            const titleEl = document.getElementById('heroLessonTitle');
            const badgeText = document.getElementById('heroLessonBadgeText');
            const countEl = document.getElementById('heroLessonCount');
            const timeEl = document.getElementById('heroLessonTime');
            const ctaText = document.getElementById('heroPrimaryCtaText');
            const smartTitle = document.getElementById('smartRecommendationTitle');
            const smartBody = document.getElementById('smartRecommendationBody');
            const smartBtnText = document.getElementById('smartRecommendationBtnText');

            if (user && user.id) {
                const displayName = user.name || user.displayName || 'Huỳnh Đăng';
                if (nameEl) nameEl.textContent = displayName;
                const score = user.targetScore || 600;
                if (targetScoreEl) targetScoreEl.textContent = score;

                let daysRemaining = 52;
                if (typeof PersonalizedRoadmapEngine !== 'undefined' && typeof PersonalizedRoadmapEngine.calculateDaysRemaining === 'function') {
                    daysRemaining = PersonalizedRoadmapEngine.calculateDaysRemaining() || 52;
                }
                if (subTextEl) {
                    subTextEl.textContent = \`Mục tiêu \${score} TOEIC · Còn \${daysRemaining} ngày ôn luyện tập trung\`;
                }

                if (user.diagnosticResults) {
                    // TÍNH TOÁN ĐỘNG TỪ ROADMAP ENGINE: Tìm lỗ hổng yếu nhất của học viên
                    let weakestPillar = 'gap-part5-grammar';
                    let stageId = 2;
                    if (typeof PersonalizedRoadmapEngine !== 'undefined' && typeof PersonalizedRoadmapEngine.calculateNodeStates === 'function') {
                        try {
                            const res = PersonalizedRoadmapEngine.calculateNodeStates();
                            if (res && res.weakestPillarId) weakestPillar = res.weakestPillarId;
                            if (res && res.currentStageId) stageId = res.currentStageId;
                        } catch(e) {}
                    }

                    const lessonPresets = {
                        'gap-part12-listening': {
                            title: 'Chặng 1: Part 1 & 2 — Bẫy Nghe hình ảnh & Đáp án Gián tiếp',
                            count: '15 câu hỏi trọng tâm',
                            time: '10 phút',
                            tab: 'nghe',
                            smartTitle: 'Cải thiện phản xạ Part 1 & 2',
                            smartBody: 'AI phát hiện bạn hay phân vân bẫy Being vs Been trong tranh tĩnh và câu hỏi phủ định Part 2. Luyện tập ngay để tăng 40 điểm Listening.'
                        },
                        'gap-part34-paraphrase': {
                            title: 'Chặng 3: Part 3 & 4 — Kỹ thuật Paraphrasing & Nắm bắt ý đồ người nói',
                            count: '12 câu hỏi hội thoại',
                            time: '12 phút',
                            tab: 'nghe',
                            smartTitle: 'Luyện kỹ thuật Paraphrasing Part 3-4',
                            smartBody: 'Từ đồng nghĩa chuyển đổi ngữ cảnh là bẫy lớn nhất của Part 3-4. Hoàn thành 1 bài luyện ngắn để nắm chắc phương pháp bắt keyword.'
                        },
                        'gap-part5-grammar': {
                            title: 'Chặng 2: Part 5 — Nhận diện Hậu tố Từ loại & Bẫy liên từ cốt lõi',
                            count: '12 câu trắc nghiệm',
                            time: '8 phút',
                            tab: 'ngu-phap',
                            smartTitle: 'Điểm cần cải thiện để tăng 50+ điểm',
                            smartBody: 'AI phân tích bạn hay nhầm lẫn giữa tính từ đuôi -ive / -al và danh từ trong Part 5. Luyện nhanh 8 câu bẫy kinh điển để khắc phục.'
                        },
                        'gap-part5-vocab': {
                            title: 'Chặng 3: Part 5 — Từ vựng & Collocations Công sở Doanh nghiệp',
                            count: '15 cụm từ cố định',
                            time: '8 phút',
                            tab: 'tu-vung',
                            smartTitle: 'Mở rộng cụm từ cố định Part 5',
                            smartBody: 'Học ngay 15 collocations xuất hiện với tần suất 85% trong đề thi ETS 2026 để làm bài Part 5 trong 10 giây/câu.'
                        },
                        'gap-part6-insertion': {
                            title: 'Chặng 4: Part 6 — Điền câu theo mạch logic & Liên từ chuyển ý',
                            count: '10 câu đoạn văn',
                            time: '10 phút',
                            tab: 'doc',
                            smartTitle: 'Bẫy điền cả câu Part 6',
                            smartBody: 'Bẫy liên từ However, Therefore, In spite of thường làm mất điểm. Luyện 2 đoạn văn Part 6 để làm quen mạch logic.'
                        },
                        'gap-part7-multi': {
                            title: 'Chặng 5: Part 7 — Đọc hiểu văn bản đơn & Chuỗi đa đoạn văn',
                            count: '10 câu hỏi Skimming',
                            time: '12 phút',
                            tab: 'doc',
                            smartTitle: 'Kỹ thuật Skimming / Scanning Part 7',
                            smartBody: 'Tiết kiệm 15 phút làm bài Part 7 bằng kỹ thuật đọc quét thông tin chéo giữa email và hóa đơn đặt hàng.'
                        }
                    };

                    const activeLesson = lessonPresets[weakestPillar] || lessonPresets['gap-part5-grammar'];

                    if (badgeText) badgeText.textContent = \`CHẶNG \${stageId} · BÀI HỌC TRỌNG TÂM ETS 2026\`;
                    if (titleEl) titleEl.textContent = activeLesson.title;
                    if (countEl) countEl.innerHTML = \`<i class="fa-regular fa-circle-question text-blue-500"></i> <strong>\${activeLesson.count}</strong>\`;
                    if (timeEl) timeEl.innerHTML = \`<i class="fa-regular fa-clock text-amber-500"></i> Khoảng <strong>\${activeLesson.time}</strong>\`;
                    if (ctaText) ctaText.textContent = \`Tiếp tục học ngay (~\${activeLesson.time})\`;
                    if (smartTitle) smartTitle.textContent = activeLesson.smartTitle;
                    if (smartBody) smartBody.textContent = activeLesson.smartBody;
                    if (smartBtnText) smartBtnText.textContent = 'Luyện tập trọng tâm ngay →';

                    window._heroNextTabTarget = activeLesson.tab;
                } else {
                    if (badgeText) badgeText.textContent = 'KHỞI ĐỘNG · BƯỚC 1 CỦA LỘ TRÌNH';
                    if (titleEl) titleEl.textContent = 'Bài Test Chẩn Đoán 28 Câu Chuẩn ETS 2026 (7 Part)';
                    if (countEl) countEl.innerHTML = '<i class="fa-regular fa-circle-question text-blue-500"></i> <strong>28 câu hỏi đa dạng</strong>';
                    if (timeEl) timeEl.innerHTML = '<i class="fa-regular fa-clock text-amber-500"></i> Khoảng <strong>25 phút</strong>';
                    if (ctaText) ctaText.textContent = 'Bắt đầu Test Chẩn Đoán (25 phút)';
                    if (smartTitle) smartTitle.textContent = 'Khảo sát năng lực ban đầu';
                    if (smartBody) smartBody.textContent = 'Bạn chưa làm bài kiểm tra chẩn đoán năng lực. Hãy làm bài test 28 câu chuẩn ETS để AI quét 6 lỗ hổng kiến thức và mở khóa lộ trình tự động.';
                    if (smartBtnText) smartBtnText.textContent = 'Làm bài kiểm tra đầu vào (25 phút) →';

                    window._heroNextTabTarget = 'diagnostic';
                }
            } else {
                if (subTextEl) subTextEl.textContent = 'Đăng nhập để lưu tiến độ và cá nhân hóa lộ trình ETS 2026';
            }
        };

        window.startHeroNextLesson = function() {
            if (window._heroNextTabTarget === 'diagnostic') {
                if (window.ToeicDiagnosticWorkstation && typeof window.ToeicDiagnosticWorkstation.open === 'function') {
                    window.ToeicDiagnosticWorkstation.open();
                    return;
                }
            }
            if (window._heroNextTabTarget && typeof switchTab === 'function') {
                switchTab(window._heroNextTabTarget);
                return;
            }
            if (typeof switchTab === 'function') {
                switchTab('ngu-phap');
            }
        };

        `;

const updatedContent = content.substring(0, sIdx) + newHeroBlock + content.substring(eIdx);
fs.writeFileSync(indexPath, updatedContent, 'utf8');
console.log('SUCCESS: Updated updateDashboardStudioHero with dynamic roadmap integration!');
