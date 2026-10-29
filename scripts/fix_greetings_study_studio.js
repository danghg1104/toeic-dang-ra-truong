const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

console.log('🚀 Bắt đầu làm sạch lời chào và đồng bộ Study Studio 100%...');

// 1. Thay thế khối lời chào cũ trong applyCurrentAccountToUI
const oldCurrentAccountGreetings = `            // Cập nhật các trường hiển thị ở Sảnh Thành viên (Chuẩn 100% Ảnh đính kèm)
            setTxt('sanhGreetingPrefix', 'Cố gắng nhé bạn ơi,');
            setTxt('sanhMemberGreetingName', (currentUserAccount.name || 'bạn') + '! 👏');
            setTxt('sanhMemberProfileName', currentUserAccount.name || 'Học viên');
            setTxt('memberTargetScore', currentUserAccount.targetScore || '——');
            setTxt('memberExamDate', currentUserAccount.examDate ? \`Thi: \${currentUserAccount.examDate}\` : 'Thi: Chưa đặt');
            setTxt('sanhMemberStreakVal', \`\${currentUserAccount.streak || 0} ngày\`);
            setTxt('sanhMemberStreakTitle', \`Streak \${currentUserAccount.streak || 0} ngày\`);
            setTxt('sanhMemberXpVal', \`+\${currentUserAccount.xp || 0} XP\`);
            setTxt('sanhMemberDropdownEmail', currentUserAccount.email || '');
            setTxt('mobileDropdownEmail', currentUserAccount.email || '');
            renderUserAvatarElement(document.getElementById('sanhMemberAvatar'), currentUserAccount);`;

const newCurrentAccountGreetings = `            // Cập nhật Sảnh Study Studio chuẩn Quiet Confidence (loại bỏ hoàn toàn emoji và văn phong trẻ con)
            setTxt('sanhMemberProfileName', currentUserAccount.name || 'Học viên');
            setTxt('memberTargetScore', currentUserAccount.targetScore || '600');
            setTxt('memberExamDate', currentUserAccount.examDate ? \`Thi: \${currentUserAccount.examDate}\` : 'Thi: 20/12/2026');
            setTxt('sanhMemberStreakVal', \`\${currentUserAccount.streak || 0} ngày\`);
            setTxt('sanhMemberStreakTitle', \`Streak \${currentUserAccount.streak || 0} ngày\`);
            setTxt('sanhMemberXpVal', \`+\${currentUserAccount.xp || 0} XP\`);
            setTxt('sanhMemberDropdownEmail', currentUserAccount.email || '');
            setTxt('mobileDropdownEmail', currentUserAccount.email || '');
            renderUserAvatarElement(document.getElementById('sanhMemberAvatar'), currentUserAccount);
            if (typeof renderStreakWeekDays === 'function') {
                renderStreakWeekDays({ streak: currentUserAccount.streak || state.streak || 0 });
            }
            if (typeof window.updateDashboardStudioHero === 'function') {
                window.updateDashboardStudioHero();
            }`;

if (content.includes(oldCurrentAccountGreetings)) {
  content = content.replace(oldCurrentAccountGreetings, newCurrentAccountGreetings);
  console.log('✓ 1. Đã cập nhật applyCurrentAccountToUI sang Study Studio!');
} else {
  console.warn('⚠️ Không tìm thấy oldCurrentAccountGreetings chính xác, kiểm tra lại...');
}

// 2. Cập nhật applyGuestStateToUI
const oldGuestGreetings = `            setTxt('sanhGreetingPrefix', 'Chào bạn!');
            setTxt('sanhMemberGreetingName', 'Hãy đăng nhập để lưu tiến độ');`;

const newGuestGreetings = `            if (typeof window.updateDashboardStudioHero === 'function') {
                window.updateDashboardStudioHero();
            }`;

if (content.includes(oldGuestGreetings)) {
  content = content.replace(oldGuestGreetings, newGuestGreetings);
  console.log('✓ 2. Đã cập nhật applyGuestStateToUI sang Study Studio!');
}

// 3. Rà soát bất kỳ chuỗi emoji trẻ con hoặc slogan nào còn sót lại
content = content.replace(/Cố gắng nhé bạn ơi,/g, 'Chào bạn,');
content = content.replace(/! 👏/g, '');

fs.writeFileSync(indexPath, content, 'utf8');
console.log('🎉 Đã lưu index.html thành công!');
