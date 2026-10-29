const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'index.html');
let content = fs.readFileSync(indexPath, 'utf8');

const sIdx = content.indexOf("// Cập nhật các trường hiển thị ở Sảnh Thành viên (Chuẩn 100% Ảnh đính kèm)");
const eIdx = content.indexOf("if (typeof updateSanhAndSidebarVisibility === 'function') {", sIdx);

if (sIdx === -1 || eIdx === -1) {
  console.error('ERROR: Could not locate snippet boundaries in applyCurrentAccountToUI! sIdx:', sIdx, 'eIdx:', eIdx);
  process.exit(1);
}

const replacement = `// Cập nhật Sảnh Study Studio chuẩn Quiet Confidence
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
            }

            `;

content = content.substring(0, sIdx) + replacement + content.substring(eIdx);
fs.writeFileSync(indexPath, content, 'utf8');
console.log('SUCCESS: applyCurrentAccountToUI updated with Study Studio logic!');
