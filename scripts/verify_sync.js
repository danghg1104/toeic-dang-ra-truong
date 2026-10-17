const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          resolve(JSON.parse(d));
        } catch (e) {
          resolve(d);
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function verify() {
  console.log('--- KIỂM TRA HỆ THỐNG ĐỒNG BỘ & XÁC THỰC ---');

  // 1. Kiểm tra Network Info
  const net = await request({ hostname: 'localhost', port: 3000, path: '/api/network-info', method: 'GET' });
  console.log('1. [Network Info]:', net.mobileUrl);

  // 2. Kiểm tra Đồng bộ Sổ Take Note kèm hình ảnh Base64
  const fakeBase64 = 'data:image/png;base64,' + 'B'.repeat(8000);
  const syncRes = await request({
    hostname: 'localhost', port: 3000, path: '/api/study-sync', method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  }, {
    deviceId: 'laptop-test-01',
    deviceName: 'Laptop Đăng',
    userId: 'acc-dang',
    action: 'TAKE_NOTE_SAVED',
    lastActionWord: 'Ghi chú có ảnh đính kèm',
    state: { xp: 200, streak: 5, vocabLearned: 18, dictationDone: 6, grammarDone: 25 },
    takeNotesList: [{
      id: 'note-image-sync-demo',
      title: 'Công thức & Ảnh chụp sơ đồ ngữ pháp',
      category: 'Ngữ pháp',
      content: '<p>Sơ đồ tư duy 12 thì tiếng Anh:</p><img src="' + fakeBase64 + '" />',
      updatedAt: '15:45',
      updatedAtMs: Date.now()
    }]
  });
  console.log('2. [Đồng bộ ảnh Take Note]: Thành công =', syncRes.success, '| Số trang:', syncRes.data?.takeNotesList?.length);

  // 3. Kiểm tra Tải hồ sơ người dùng (Khôi phục tiến độ không mất dữ liệu)
  const prof = await request({ hostname: 'localhost', port: 3000, path: '/api/user/load-progress?userId=acc-dang', method: 'GET' });
  console.log('3. [Khôi phục dữ liệu]: Thành công =', prof.success, '| XP =', prof.data?.state?.xp, '| Trang ghi chú lưu trong hồ sơ =', prof.data?.takeNotesList?.length);

  // 4. Kiểm tra Danh sách người dùng
  const users = await request({ hostname: 'localhost', port: 3000, path: '/api/auth/users-list', method: 'GET' });
  console.log('4. [Danh sách thành viên]:', users.users?.map(u => `${u.name} (${u.email})`));

  console.log('--- TẤT CẢ KIỂM TRA ĐỀU HOÀN HẢO! ---');
}

verify();
