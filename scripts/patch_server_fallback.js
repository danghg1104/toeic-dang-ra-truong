const fs = require('fs');
const path = require('path');

const serverFile = path.join(__dirname, '..', 'server.js');
let s = fs.readFileSync(serverFile, 'utf8');

const targetStr = `          let finalVi = viTranslation;
          if (!finalVi || !isActualVietnameseText(finalVi)) {
            finalVi = \`Thuật ngữ tiếng Anh: "\${queryToFetch}" (Bản dịch đang được cập nhật)\`;
          }`;

const replacementStr = `          let finalVi = viTranslation;
          if (!finalVi || !isActualVietnameseText(finalVi)) {
            // Nếu MyMemory không có bản dịch tiếng Việt chuẩn, chuyển sang Tier 3 AI / Tổng hợp ngôn ngữ học chuẩn xác
            return executeTier3Fallback();
          }`;

if (s.includes(targetStr)) {
  s = s.replace(targetStr, replacementStr);
  fs.writeFileSync(serverFile, s, 'utf8');
  console.log('✅ Successfully removed "(Bản dịch đang được cập nhật)" fallback from server.js');
} else {
  console.log('ℹ️ targetStr not found directly, checking normalized string...');
  const normS = s.replace(/\r\n/g, '\n');
  const normTarget = targetStr.replace(/\r\n/g, '\n');
  if (normS.includes(normTarget)) {
    const normRep = replacementStr.replace(/\r\n/g, '\n');
    const updated = normS.replace(normTarget, normRep);
    fs.writeFileSync(serverFile, updated.replace(/\n/g, '\r\n'), 'utf8');
    console.log('✅ Successfully replaced with normalized line endings');
  } else {
    console.warn('❌ Target string could not be matched.');
  }
}
