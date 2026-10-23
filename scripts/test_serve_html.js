const http = require('http');
http.get('http://localhost:3000/index.html', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log('1. Includes googleSignInSectionRegister:', data.includes('googleSignInSectionRegister'));
        console.log('2. Includes HOẶC ĐIỀN THÔNG TIN BÊN DƯỚI:', data.includes('HOẶC ĐIỀN THÔNG TIN BÊN DƯỚI'));
        console.log('3. Data length:', data.length);
    });
});
