const http = require('http');

http.get('http://localhost:3000', res => {
  console.log('HTTP GET / status code:', res.statusCode);
  let html = '';
  res.on('data', c => html += c);
  res.on('end', () => {
    console.log('Contains view-lo-trinh:', html.includes('id="view-lo-trinh"'));
    console.log('Contains view-bay-de-thi:', html.includes('id="view-bay-de-thi"'));
    console.log('Contains aiTutorModal:', html.includes('id="aiTutorModal"'));
    console.log('Contains toeic-traps-data.js:', html.includes('toeic-traps-data.js'));
    console.log('Contains roadmap-and-traps.js:', html.includes('roadmap-and-traps.js'));
    console.log('Server verification complete!');
  });
}).on('error', err => console.error('Server GET error:', err));
