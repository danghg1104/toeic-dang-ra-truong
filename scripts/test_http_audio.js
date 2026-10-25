const http = require('http');

http.get('http://localhost:3000/audio/listening/part1/p1_q01.mp3', res => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Content-Type: ${res.headers['content-type']}`);
    console.log(`Content-Length: ${res.headers['content-length']}`);
    console.log(`ETag: ${res.headers['etag']}`);
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => {
        const total = Buffer.concat(chunks);
        console.log(`Downloaded ${total.length} bytes.`);
        console.log(`Matches expected 124796 bytes: ${total.length === 124796}`);
    });
}).on('error', err => {
    console.error('Request failed:', err.message);
});
