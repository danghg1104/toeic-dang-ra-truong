const fs = require('fs');

const file = 'js/vocab-game-workstation.js';
let code = fs.readFileSync(file, 'utf8');

code = code.replace('// VIEW 3: GAME ARENA (ĐẤU TRƯỜNG VŨ TRỤ GUNDAM RỘNG RÃI & KHUNG CỠ TRUNG)', '// VIEW 3: GAME ARENA (STUDIO LUYỆN PHẢN XẠ TỪ VỰNG TỐC ĐỘ)');
code = code.replace('// Theme 3: Không gian Xanh Lơ Gundam HUD', '// Theme 3: Không gian Deep Slate Focus Studio');
code = code.replace('// 1. Vẽ Viên Đạn Xanh Beam Laser từ Gundam', '// 1. Vẽ Luồng Sáng Phản Xạ từ Sói Mây');
code = code.replace('// GUNDAM XOAY NÒNG NGẮM MƯỢT MÀ THEO VỊ TRÍ THẺ TỪ (ẢNH 1 & ẢNH 3)', '// SÓI MÂY XOAY THEO VỊ TRÍ THẺ TỪ RƠI');
code = code.replace('// Gundam xoay ngắm mượt mà theo vị trí thẻ từ rơi', '// Sói Mây xoay mượt mà theo vị trí thẻ từ rơi');

fs.writeFileSync(file, code, 'utf8');
console.log('Sanitized internal comments in vocab-game-workstation.js');
