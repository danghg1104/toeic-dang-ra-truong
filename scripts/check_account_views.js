const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');
console.log('view-tai-khoan:', content.includes('id="view-tai-khoan"'));
console.log('view-cai-dat:', content.includes('id="view-cai-dat"'));
console.log('openAccountModal:', content.includes('function openAccountModal'));
