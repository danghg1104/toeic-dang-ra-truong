const fs = require('fs');
const path = require('path');

const serverFile = path.join(__dirname, '..', 'server.js');
let content = fs.readFileSync(serverFile, 'utf8');

const sIdx = content.indexOf('function getSession(token) {');
const eIdx = content.indexOf('function deleteSession(token) {', sIdx);

if (sIdx === -1 || eIdx === -1) {
  console.error('Cannot find getSession boundaries!');
  process.exit(1);
}

const newGetSession = `function getSession(token) {
  if (!token) return null;
  const sessions = loadSessionsDatabase();
  let session = sessions[token];
  if (!session) {
    try {
      if (fs.existsSync(SESSIONS_FILE)) {
        const fileData = JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf8'));
        if (fileData && fileData[token]) {
          memorySessions[token] = fileData[token];
          session = fileData[token];
        }
      }
    } catch (e) {}
  }
  if (!session) return null;
  if (session.expiresAt && session.expiresAt < Date.now()) {
    deleteSession(token);
    return null;
  }
  return session;
}

`;

content = content.substring(0, sIdx) + newGetSession + content.substring(eIdx);
fs.writeFileSync(serverFile, content, 'utf8');
console.log('SUCCESS: Updated getSession in server.js!');
