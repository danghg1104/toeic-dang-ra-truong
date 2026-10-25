const https = require('https');
const fs = require('fs');

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const options = {
            hostname: u.hostname,
            path: u.pathname + u.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
                'Referer': 'https://dailydictation.com/'
            }
        };

        https.get(options, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                let redirectUrl = res.headers.location;
                if (!redirectUrl.startsWith('http')) {
                    redirectUrl = 'https://' + u.hostname + redirectUrl;
                }
                return resolve(fetchUrl(redirectUrl));
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, data }));
        }).on('error', reject);
    });
}

async function main() {
    console.log('Fetching https://dailydictation.com/exercises/toeic ...');
    const res = await fetchUrl('https://dailydictation.com/exercises/toeic');
    console.log('Status:', res.statusCode, 'Data length:', res.data.length);
    fs.writeFileSync('scripts/toeic_index.html', res.data);
    console.log('Saved to scripts/toeic_index.html');
}

main().catch(console.error);
