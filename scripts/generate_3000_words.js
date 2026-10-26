const fs = require('fs');

// Generate 3,000 vocabulary words with levels A1 - C2 for testing
const baseWords = [
  // A1
  'water - nước', 'house - ngôi nhà', 'book - quyển sách', 'happy - hạnh phúc', 'family - gia đình',
  'food - thức ăn', 'school - trường học', 'friend - bạn bè', 'money - tiền bạc', 'time - thời gian',
  // A2
  'travel - du lịch', 'flight - chuyến bay', 'ticket - vé', 'weather - thời tiết', 'airport - sân bay',
  'hotel - khách sạn', 'dinner - bữa tối', 'lunch - bữa trưa', 'holiday - kỳ nghỉ', 'vacation - kỳ nghỉ hè',
  // B1
  'convenient - thuận tiện', 'experience - kinh nghiệm', 'develop - phát triển', 'schedule - lịch trình',
  'environment - môi trường', 'improve - cải thiện', 'afford - đủ khả năng chi trả', 'budget - ngân sách',
  'colleague - đồng nghiệp', 'customer - khách hàng',
  // B2
  'negotiate - đàm phán', 'collaborate - cộng tác', 'innovative - đổi mới sáng tạo', 'sustainable - bền vững',
  'strategy - chiến lược', 'significant - đáng kể', 'implement - thi hành triển khai', 'allocate - phân bổ',
  'clarify - làm sáng tỏ', 'compensation - sự bồi thường',
  // C1
  'meticulous - tỉ mỉ cẩn trọng', 'prerequisite - điều kiện tiên quyết', 'ambiguous - mơ hồ đa nghĩa',
  'profound - sâu sắc uyên thâm', 'exacerbate - làm trầm trọng thêm', 'coherent - mạch lạc chặt chẽ',
  'inevitable - không thể tránh khỏi', 'intricate - tinh xảo phức tạp', 'lucrative - béo bở sinh lợi cao',
  'unprecedented - chưa từng có tiền lệ',
  // C2
  'serendipity - sự may mắn tình cờ', 'quintessential - tinh hoa điển hình', 'ubiquitous - phổ biến khắp nơi',
  'obfuscate - làm khó hiểu', 'idiosyncrasy - nét đặc thù phong cách', 'ephemeral - phù du sớm nở tối tàn',
  'magnanimous - rộng lượng hào hiệp', 'ostentatious - phô trương khoe khoang', 'panacea - liều thuốc vạn năng',
  'zeitgeist - tinh thần thời đại'
];

let all3000 = [];
for (let i = 0; i < 50; i++) {
  baseWords.forEach(w => {
    all3000.push(w + (i > 0 ? ` [v${i+1}]` : ''));
  });
}

fs.writeFileSync('scripts/test_3000_words.txt', all3000.join('\n'), 'utf8');
console.log('✅ Generated scripts/test_3000_words.txt with', all3000.length, 'words!');
