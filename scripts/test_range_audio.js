const http = require('http');

const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/audio/listening/part1/p1_q01.mp3',
    headers: {
        'Range': 'bytes=0-1000'
    }
}, res => {
    console.log(`Status: ${res.statusCode} (Expected 206)`);
    console.log(`Content-Range: ${res.headers['content-range']}`);
    console.log(`Content-Length: ${res.headers['content-length']}`);
    const chunks = [];
    res.on('data', c => chunks.push(c));
    res.on('end', () => {
        const total = Buffer.concat(chunks);
        console.log(`Received ${total.length} bytes.`);
    });
});
req.on('error', console.error);
req.end();
