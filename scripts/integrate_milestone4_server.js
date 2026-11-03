const fs = require('fs');

const serverFile = 'server.js';
let content = fs.readFileSync(serverFile, 'utf8');

// 1. Thêm import PvP Arena và AI Engine vào đầu server.js
if (!content.includes('pvp-arena-server')) {
    const importBlock = `// Milestone 4: PvP WebSocket Server & AI Explanation Engine
const { setupPvPArenaWebSocket } = require('./lib/pvp-arena-server');
const { explainMistake } = require('./lib/ai-explanation-engine');
`;
    content = importBlock + content;
}

// 2. Thêm endpoint /api/ai/explain-mistake
if (!content.includes('/api/ai/explain-mistake')) {
    const targetAnchor = "if (reqPath === '/api/user/save-progress' && req.method === 'POST') {";
    const endpointBlock = `  // =========================================================================
  // ENDPOINT: AI "VÌ SAO EM SAI?" EXPLANATION GATEWAY (GEMINI 3.8 FLASH)
  // =========================================================================
  if (reqPath === '/api/ai/explain-mistake' && req.method === 'POST') {
    parseJsonBody(req, res, async payload => {
      try {
        const { question, userAnswer, correctAnswer, part, trapCategory } = payload || {};
        const result = await explainMistake({ question, userAnswer, correctAnswer, part, trapCategory });
        res.writeHead(200, {
          'Content-Type': 'application/json; charset=UTF-8',
          'Cache-Control': 'no-store, no-cache, must-revalidate, private',
          ...getCorsHeaders(req)
        });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, {
          'Content-Type': 'application/json; charset=UTF-8',
          ...getCorsHeaders(req)
        });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  `;
    content = content.replace(targetAnchor, endpointBlock + targetAnchor);
}

// 3. Khởi tạo setupPvPArenaWebSocket(server) ngay sau khi server.listen
if (!content.includes('setupPvPArenaWebSocket(server)')) {
    const serverListenAnchor = "server.listen(PORT, () => {";
    content = content.replace(serverListenAnchor, `setupPvPArenaWebSocket(server);\n\n${serverListenAnchor}`);
}

fs.writeFileSync(serverFile, content, 'utf8');
console.log('✅ Successfully integrated PvP Arena WebSocket & AI Explanation Gateway into server.js!');
