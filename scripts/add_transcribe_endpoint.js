const fs = require('fs');

let content = fs.readFileSync('server.js', 'utf8');
const anchor = "if (reqPath === '/api/me' && req.method === 'GET') {";

if (!content.includes(anchor)) {
  console.error('Anchor not found in server.js');
  process.exit(1);
}

const endpointCode = `  // =========================================================================
  // API: CLOUD SPEECH-TO-TEXT (GROQ WHISPER LARGE V3 TURBO / GEMINI)
  // =========================================================================
  if (reqPath === '/api/transcribe-cloud' && req.method === 'POST') {
    parseJsonBody(req, res, async payload => {
      const { audioBase64, mimeType, filename, apiKey, engine } = payload || {};
      if (!audioBase64) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
        return res.end(JSON.stringify({ success: false, error: 'Thiếu dữ liệu âm thanh audioBase64' }));
      }

      const groqKey = (apiKey || process.env.GROQ_API_KEY || '').trim();
      if (groqKey) {
        try {
          const buffer = Buffer.from(audioBase64, 'base64');
          const boundary = '----WebKitFormBoundary' + crypto.randomBytes(16).toString('hex');
          const ext = (filename && path.extname(filename)) || '.mp3';
          const fileMime = mimeType || 'audio/mpeg';

          const preFile = Buffer.from(
            \`--\${boundary}\\r\\nContent-Disposition: form-data; name="file"; filename="audio\${ext}"\\r\\nContent-Type: \${fileMime}\\r\\n\\r\\n\`
          );
          const postFile = Buffer.from(
            \`\\r\\n--\${boundary}\\r\\nContent-Disposition: form-data; name="model"\\r\\n\\r\\nwhisper-large-v3-turbo\` +
            \`\\r\\n--\${boundary}\\r\\nContent-Disposition: form-data; name="response_format"\\r\\n\\r\\nverbose_json\` +
            \`\\r\\n--\${boundary}\\r\\nContent-Disposition: form-data; name="temperature"\\r\\n\\r\\n0\` +
            \`\\r\\n--\${boundary}--\r\n\`
          );
          const fullBody = Buffer.concat([preFile, buffer, postFile]);

          const groqReq = https.request('https://api.groq.com/openai/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              'Authorization': \`Bearer \${groqKey}\`,
              'Content-Type': \`multipart/form-data; boundary=\${boundary}\`,
              'Content-Length': fullBody.length
            }
          }, groqRes => {
            let resData = '';
            groqRes.on('data', chunk => resData += chunk);
            groqRes.on('end', () => {
              try {
                const parsed = JSON.parse(resData);
                if (groqRes.statusCode === 200) {
                  res.writeHead(200, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
                  return res.end(JSON.stringify({
                    success: true,
                    engine: 'groq-whisper-large-v3-turbo',
                    text: parsed.text || '',
                    segments: (parsed.segments || []).map((s, idx) => ({
                      id: idx + 1,
                      start: s.start,
                      end: s.end,
                      text: (s.text || '').trim()
                    }))
                  }));
                } else {
                  res.writeHead(groqRes.statusCode || 500, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
                  return res.end(JSON.stringify({ success: false, error: parsed.error?.message || 'Lỗi Groq API' }));
                }
              } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
                return res.end(JSON.stringify({ success: false, error: 'Parse response error: ' + e.message }));
              }
            });
          });

          groqReq.on('error', err => {
            res.writeHead(500, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
            return res.end(JSON.stringify({ success: false, error: 'Groq connection error: ' + err.message }));
          });

          groqReq.write(fullBody);
          groqReq.end();
          return;
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
          return res.end(JSON.stringify({ success: false, error: err.message }));
        }
      }

      res.writeHead(400, { 'Content-Type': 'application/json; charset=UTF-8', ...getCorsHeaders(req) });
      return res.end(JSON.stringify({
        success: false,
        error: 'Chưa có Groq API Key. Vui lòng nhập Key trong phần Cài Đặt AI hoặc chọn mô hình Whisper chạy trực tiếp trên trình duyệt.'
      }));
    });
    return;
  }

  `;

content = content.replace(anchor, endpointCode + anchor);
fs.writeFileSync('server.js', content, 'utf8');
console.log('Successfully updated server.js!');
