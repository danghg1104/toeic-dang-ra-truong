const fs = require('fs');
const rdb = fs.readFileSync('js/reading-practice-database.js', 'utf8');
const m = rdb.match(/"setId":\s*"([^"]*_p7_[^"]*)"/g);
console.log('Sample P7 setIds:', m ? m.slice(0, 15) : 'none');
