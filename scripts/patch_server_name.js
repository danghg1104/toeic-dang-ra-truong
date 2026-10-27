const fs = require('fs');

let code = fs.readFileSync('server.js', 'utf8');

code = code.replace(
  "Gia Sư AI Luyện Thi TOEIC & Tiếng Anh chuyên sâu trong ứng dụng 'Cùng Đăng Ra Trường'",
  "Gia Sư AI Luyện Thi TOEIC & Tiếng Anh chuyên sâu trong ứng dụng 'Tôi Đi Đâu Đó'"
);

code = code.replace(
  "message: 'Đăng ký tài khoản thành công! Chào mừng bạn gia nhập Cùng Đăng Ra Trường.'",
  "message: 'Đăng ký tài khoản thành công! Chào mừng bạn gia nhập Tôi Đi Đâu Đó.'"
);

code = code.replace(
  "💻 Truy cập Web trên Máy tính: http://localhost:${PORT}",
  "💻 Truy cập Web Tôi Đi Đâu Đó trên Máy tính: http://localhost:${PORT}"
);

fs.writeFileSync('server.js', code, 'utf8');
console.log('Updated server.js branding successfully!');
