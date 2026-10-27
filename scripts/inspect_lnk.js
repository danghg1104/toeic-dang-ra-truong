const fs = require('fs');
const path = require('path');

const files = [
  'C:/Users/Admin/Desktop/Tiệm Phim - Xem Phim Vietsub, Thuyết Minh Online Chất Lượng Cao.lnk',
  'C:/Users/Admin/Desktop/Freelancer Việt Nam - Lựa chọn số 1 của doanh nghiệp - vLance.vn.lnk'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    const buf = fs.readFileSync(f);
    console.log('FILE:', f, 'size:', buf.length);
    // Find strings in buffer
    const str = buf.toString('utf16le');
    const matches = str.match(/[\w\.\:\/\\\-\s]{4,}/g) || [];
    console.log('UTF16 Strings:', matches.filter(m => m.includes('http') || m.includes('.exe') || m.includes('app') || m.includes('Profile') || m.includes('Browser')).slice(0, 5));
    const str8 = buf.toString('utf8');
    const matches8 = str8.match(/[\w\.\:\/\\\-\s]{4,}/g) || [];
    console.log('UTF8 Strings:', matches8.filter(m => m.includes('http') || m.includes('.exe') || m.includes('app') || m.includes('Profile') || m.includes('Browser')).slice(0, 5));
  }
});
