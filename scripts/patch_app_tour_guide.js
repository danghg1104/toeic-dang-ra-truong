const fs = require('fs');

const path = 'js/app-tour-guide.js';
let content = fs.readFileSync(path, 'utf8');

// Update steps definitions
const oldStepsStart = '            this.steps = [';
const oldStepsEnd = '            this._bindKeyboardEvents();';

const stepsStartIdx = content.indexOf(oldStepsStart);
const stepsEndIdx = content.indexOf(oldStepsEnd);

if (stepsStartIdx !== -1 && stepsEndIdx !== -1) {
    const newStepsCode = `            this.steps = [
                {
                    title: 'Bảng Màu Giấy Tự Nhiên & Phông ETS',
                    targetSelector: '#studyEnvironmentControls, #btnEditorialToggle, #btnFontToggle',
                    fallbackSelector: '#sanhTopHeaderBar',
                    content: 'Chuyển đổi giao diện <b>Giấy Cát Ấm (Warm Sand)</b> triệt tiêu ánh sáng xanh, cùng phông thi <b>ETS Serif (EB Garamond)</b> chân thực.',
                    mascotText: 'Chào bạn! Cùng Sói Mây khám phá bảo bối tăng tốc điểm số nhé! 🐺✨',
                    placement: 'bottom'
                },
                {
                    title: 'Lộ Trình S-Curve 6 Chặng Cá Nhân Hóa',
                    targetSelector: '#nav-lo-trinh, #sidebarNav, #sidebarContainer',
                    fallbackSelector: '#sidebarContainer',
                    content: 'Hệ thống tự động phân bổ bài học từng ngày theo <b>S-Curve 6 chặng</b>, bám sát bộ đề thi chuẩn ETS 2026.',
                    mascotText: 'Mỗi ngày hoàn thành 1 viên nang là chắc suất tăng điểm! 📈',
                    placement: 'right'
                },
                {
                    title: 'Trạm Luyện Đề & Bài Học Trọng Tâm',
                    targetSelector: '#heroActionCardContainer, #heroPrimaryCtaBtn',
                    fallbackSelector: '#heroActionCardContainer',
                    content: 'Trải nghiệm giao diện thi thực chiến: Luyện nghe song ngữ, đọc hiểu Part 7 và bôi đen bất kỳ từ nào để <b>tra từ điển tức thì</b>.',
                    mascotText: 'Không bao giờ phải chuyển tab làm ngắt mạch tư duy! 💡',
                    placement: 'bottom'
                },
                {
                    title: 'Bộ Công Cụ Luyện Thi Siêu Tốc 2026',
                    targetSelector: '#quickStudyToolsContainer, #nav-tu-vung',
                    fallbackSelector: '#heroActionCardContainer',
                    content: 'Học nhanh với <b>Flashcard 3D vuốt Tinder FSRS v5</b>, Trạm 180s, Cheat Sheet 1 trang và Tài liệu thực chiến Part 6-7.',
                    mascotText: 'Ôn tập từ vựng chuẩn 80/20 với thuật toán giãn cách thông minh! 🗂️',
                    placement: 'top'
                },
                {
                    title: 'Đồng Hồ Pomodoro & Âm Nền Tập Trung',
                    targetSelector: '#btnQuickPomodoroLaunch, #tourTargetPomodoro',
                    fallbackSelector: '#sanhTopHeaderBar',
                    content: 'Tùy chỉnh thời gian học sâu 25 phút, tích hợp 3 kênh âm nền: Lo-fi thư giãn, Tiếng mưa hiên nhà và Quán cà phê yên tĩnh.',
                    mascotText: 'Tập trung sâu kết hợp âm nền giúp não bộ nhớ từ vựng lâu gấp 3 lần! 🎧',
                    placement: 'bottom'
                }
            ];

`;
    content = content.slice(0, stepsStartIdx) + newStepsCode + content.slice(stepsEndIdx);
}

// Update positioning in _renderSpotlight
const oldPosStart = '            // Calculate Popover Position';
const oldPosEnd = '            popover.style.left = `${popLeft}px`;\n            popover.style.top = `${popTop}px`;';

const posStartIdx = content.indexOf(oldPosStart);
const posEndIdx = content.indexOf(oldPosEnd);

if (posStartIdx !== -1 && posEndIdx !== -1) {
    const newPosCode = `            // Calculate Popover Position with Full Placement Direction Support
            popover.style.display = 'block';
            popover.style.zIndex = '9999999';
            const popW = Math.min(window.innerWidth - 32, 420);
            const popH = popover.offsetHeight || 260;

            const placement = step.placement || 'bottom';
            let popLeft = 16;
            let popTop = 20;

            if (placement === 'right') {
                popLeft = rect.left + rect.width + 16;
                popTop = rect.top + rect.height / 2 - popH / 2;
                if (popLeft + popW > window.innerWidth - 16) {
                    popLeft = Math.max(16, rect.left + rect.width / 2 - popW / 2);
                    popTop = rect.top + rect.height + 16;
                }
            } else if (placement === 'left') {
                popLeft = rect.left - popW - 16;
                popTop = rect.top + rect.height / 2 - popH / 2;
                if (popLeft < 16) {
                    popLeft = Math.max(16, rect.left + rect.width / 2 - popW / 2);
                    popTop = rect.top + rect.height + 16;
                }
            } else if (placement === 'top') {
                popLeft = rect.left + rect.width / 2 - popW / 2;
                popTop = rect.top - popH - 16;
                if (popTop < 20) {
                    popTop = rect.top + rect.height + 16;
                }
            } else { // 'bottom'
                popLeft = rect.left + rect.width / 2 - popW / 2;
                popTop = rect.top + rect.height + 16;
            }

            // Keep within viewport boundaries
            popLeft = Math.max(16, Math.min(window.innerWidth - popW - 16, popLeft));
            popTop = Math.max(20, Math.min(window.innerHeight - popH - 20, popTop));

            // Prevent popover from overlapping the top header bar
            const headerEl = document.getElementById('sanhTopHeaderBar');
            if (headerEl && placement === 'bottom') {
                const headerBox = headerEl.getBoundingClientRect();
                if (rect.top <= headerBox.bottom && popTop < headerBox.bottom + 12) {
                    popTop = headerBox.bottom + 14;
                }
            }

            popover.style.left = \`\${popLeft}px\`;
            popover.style.top = \`\${popTop}px\`;`;
    content = content.slice(0, posStartIdx) + newPosCode + content.slice(posEndIdx + oldPosEnd.length);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Successfully optimized AppTourGuide in js/app-tour-guide.js');
