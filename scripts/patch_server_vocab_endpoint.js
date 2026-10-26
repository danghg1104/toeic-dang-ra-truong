const fs = require('fs');
const path = require('path');

const serverFile = path.join(__dirname, '..', 'server.js');
let s = fs.readFileSync(serverFile, 'utf8');

// 1. Add require
if (!s.includes('vocab-ai-service')) {
  s = s.replace(
    /const IPAHelper = require\(path\.join\(__dirname, 'lib', 'dictionary', 'ipa-helper\.js'\)\);\r?\n/,
    "const IPAHelper = require(path.join(__dirname, 'lib', 'dictionary', 'ipa-helper.js'));\r\nconst VocabAIService = require(path.join(__dirname, 'lib', 'vocab-ai-service.js'));\r\n"
  );
}

// 2. Add endpoint
const targetEndpointMarker = /  \/\/ =========================================================================\r?\n  \/\/ API REALTIME ĐỒNG BỘ HỌC TẬP LAPTOP ⇄ ĐIỆN THOẠI/;

const newRoute = `  // 5c. Endpoint AI Sinh Bộ Từ Vựng Theo Chủ Đề & Mức Độ CEFR (Học Từ Vựng Totoro)
  if (reqPath === '/api/ai/generate-vocab' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      let payload = {};
      try { payload = JSON.parse(body); } catch(e) {}
      const topic = payload.topic || 'Du lịch';
      const level = payload.level || 'B1';
      const count = parseInt(payload.count, 10) || 10;

      VocabAIService.generateAIVocabularyList(topic, level, count, (result) => {
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=UTF-8',
          ...getCorsHeaders(req)
        });
        res.end(JSON.stringify(result));
      });
    });
    return;
  }

  // =========================================================================
  // API REALTIME ĐỒNG BỘ HỌC TẬP LAPTOP ⇄ ĐIỆN THOẠI`;

if (!s.includes('/api/ai/generate-vocab')) {
  s = s.replace(targetEndpointMarker, newRoute);
}

fs.writeFileSync(serverFile, s, 'utf8');
console.log('Successfully patched server.js with VocabAIService and /api/ai/generate-vocab!');
