const fs = require('fs');
const testCode = fs.readFileSync('tests/test_new_user_requests.js', 'utf8');
console.log(testCode);
