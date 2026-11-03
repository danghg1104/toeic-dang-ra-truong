const https = require('https');

function httpGet(url) {
    return new Promise((resolve) => {
        https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });
}

(async () => {
    const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent('I still remember, third of December') + '&langpair=en|vi';
    https.get(url, { headers: { 'User-Agent': 'VocatypeApp/1.0' } }, res => {
        let d = '';
        res.on('data', c => d += c);
        res.on('end', () => {
            console.log('STATUS:', res.statusCode);
            console.log('DATA:', d.substring(0, 300));
            try {
                const parsed = JSON.parse(d);
                console.log('TRANSLATED:', parsed.responseData.translatedText);
            } catch (e) {
                console.error(e);
            }
        });
    });
})();
