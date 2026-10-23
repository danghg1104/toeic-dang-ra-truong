const fs = require('fs');
const data = JSON.parse(fs.readFileSync('scripts/d0_baseline_results.json', 'utf8'));

let md = '| STT | Từ test | Nhóm test | Tìm thấy | IPA | Nghĩa Việt | Họ từ | Ví dụ | Collocations | Phản hồi | Đánh giá hiện trạng |\n';
md += '|:---:|---|---|:---:|:---:|---|:---:|:---:|:---:|:---:|---|\n';

data.forEach((d, idx) => {
  let cat = '1. Từ gốc';
  if (idx >= 10 && idx < 18) cat = '2. Biến thể';
  else if (idx >= 18 && idx < 21) cat = '3. Bất quy tắc';
  else if (idx >= 21 && idx < 24) cat = '4. Gõ sai';
  else if (idx >= 24 && idx < 27) cat = '5. Cụm từ';
  else if (idx >= 27 && idx < 35) cat = '6. Đầu vào lạ';
  else if (idx >= 35) cat = '7. TOEIC thông dụng';

  const ipaOk = d.ipa ? '`' + d.ipa + '`' : '❌ Trống';
  const viShort = (d.vi || 'Trống').slice(0, 32).replace(/[\r\n|]/g, ' ') + (d.vi && d.vi.length > 32 ? '...' : '');
  const foundOk = d.found ? '✅' : '❌';
  
  let issue = 'Khớp mẫu tĩnh nội bộ';
  if (d.xssTriggered || d.query.includes('<img')) issue = '⚠️ LỖ HỔNG XSS (alert(1) được kích hoạt)';
  else if (d.query === 'xyzzyq') issue = '⚠️ Bịa từ & bịa IPA (từ vô nghĩa vẫn tạo entry)';
  else if (d.query === 'went') issue = '⚠️ Dịch sai nghĩa ("được phép bay vào"), không lemmatize về "go"';
  else if (d.query === 'children') issue = '⚠️ Không lemmatize về "child", họ từ = 0';
  else if (d.query === 'better') issue = '⚠️ Không lemmatize về "good/well"';
  else if (['recieve', 'negociate', 'managment'].includes(d.query)) issue = '⚠️ Gõ sai vẫn tạo entry rác, không gợi ý "Ý bạn là...?"';
  else if (d.query === 'kết quả') issue = '⚠️ Nhập tiếng Việt nhưng bị coi là collocation tiếng Anh, không tra ngược';
  else if (['carry out', 'in charge of', 'look forward to'].includes(d.query)) issue = '⚠️ Cụm từ thiếu IPA, họ từ = 0, ví dụ templated cứng';
  else if (idx >= 10 && idx < 18) issue = 'Chưa hiển thị rõ lemma gốc ("Đang hiển thị cho require...")';
  else if (idx >= 35) issue = 'Tra online qua MyMemory/FreeDict (dịch máy thô, thiếu collocations)';

  const safeQuery = d.query.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  md += `| ${idx + 1} | \`${safeQuery}\` | ${cat} | ${foundOk} | ${ipaOk} | ${viShort} | ${d.wordFamilyCount} | ${d.exampleCount} | ${d.collocationCount} | ${d.responseTime} ms | ${issue} |\n`;
});

fs.writeFileSync('scripts/d0_baseline_table.md', md, 'utf8');
console.log('Markdown table generated successfully! Total rows:', data.length);
