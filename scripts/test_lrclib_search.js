const https = require('https');

function searchLrclib(query) {
  const url = `https://lrclib.net/api/search?q=${encodeURIComponent(query)}`;
  console.log('Searching:', url);
  https.get(url, { headers: { 'User-Agent': 'VocatypeApp/1.0 (https://localhost:3000)' } }, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      const list = JSON.parse(d);
      console.log('Search matches:', list.length);
      list.slice(0, 3).forEach(item => {
        console.log(`- ${item.trackName} by ${item.artistName} (Synced: ${!!item.syncedLyrics})`);
      });
    });
  });
}

searchLrclib('Until I Found You');
searchLrclib('Shape of You');
searchLrclib('Counting Stars');
