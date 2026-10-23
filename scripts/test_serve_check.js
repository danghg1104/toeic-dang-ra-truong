const http = require('http');
http.get('http://localhost:3000/', (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
        console.log('Server status:', res.statusCode);
        console.log('googleSignInSectionLogin has hidden class:', data.includes('id="googleSignInSectionLogin" class="hidden"'));
        console.log('googleSignInSectionLogin present in DOM:', data.includes('id="googleSignInSectionLogin"'));
        console.log('googleSignInSectionRegister has hidden class:', data.includes('id="googleSignInSectionRegister" class="hidden"'));
        console.log('googleSignInSectionRegister present in DOM:', data.includes('id="googleSignInSectionRegister"'));
    });
});
