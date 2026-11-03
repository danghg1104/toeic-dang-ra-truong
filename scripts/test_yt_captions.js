const https = require('https');
const zlib = require('zlib');

function fetchBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Encoding': 'gzip, deflate, br'
      }
    }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        let buffer = Buffer.concat(chunks);
        const encoding = res.headers['content-encoding'];
        if (encoding === 'gzip') buffer = zlib.gunzipSync(buffer);
        else if (encoding === 'deflate') buffer = zlib.inflateSync(buffer);
        else if (encoding === 'br') buffer = zlib.brotliDecompressSync(buffer);
        resolve({ status: res.statusCode, headers: res.headers, text: buffer.toString('utf8') });
      });
    }).on('error', reject);
  });
}

(async () => {
  const pageRes = await fetchBuffer('https://www.youtube.com/watch?v=24u3NoPvgMw');
  const idx = pageRes.text.indexOf('"captionTracks":');
  if (idx !== -1) {
    let startIdx = pageRes.text.indexOf('[', idx);
    let depth = 0, endIdx = -1;
    for (let i = startIdx; i < pageRes.text.length; i++) {
      if (pageRes.text[i] === '[') depth++;
      else if (pageRes.text[i] === ']') {
        depth--;
        if (depth === 0) { endIdx = i; break; }
      }
    }
    const tracks = JSON.parse(pageRes.text.substring(startIdx, endIdx + 1));
    const en = tracks.find(t => t.languageCode === 'en') || tracks[0];
    console.log('Fetching timedtext from:', en.baseUrl);
    const subRes = await fetchBuffer(en.baseUrl);
    console.log('Sub status:', subRes.status, 'Length:', subRes.text.length);
    console.log('Preview:', subRes.text.substring(0, 300));
    
    // Parse XML
    const xmlRegex = /<text start="([\d\.]+)" dur="([\d\.]+)"[^>]*>([\s\S]*?)<\/text>/g;
    let m;
    const lines = [];
    while ((m = xmlRegex.exec(subRes.text)) !== null) {
      const t = m[3].replace(/&amp;/g, '&').replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/<[^>]+>/g, '').trim();
      if (t) lines.push({ start: parseFloat(m[1]), end: Math.round((parseFloat(m[1]) + parseFloat(m[2])) * 10) / 10, text: t });
    }
    console.log('Total extracted lines:', lines.length);
    console.log('First 5 extracted lines:', lines.slice(0, 5));
  }
})();
