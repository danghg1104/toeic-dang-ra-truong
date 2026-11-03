const https = require('https');

function fetchLrclib(track, artist) {
  const url = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(track)}`;
  console.log('Fetching:', url);
  https.get(url, { headers: { 'User-Agent': 'VocatypeApp/1.0 (https://localhost:3000)' } }, res => {
    console.log('HTTP Status:', res.statusCode);
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      try {
        const json = JSON.parse(d);
        console.log('Title:', json.trackName, 'Artist:', json.artistName);
        console.log('Has synced lyrics:', !!json.syncedLyrics);
        if (json.syncedLyrics) {
          const lines = json.syncedLyrics.split('\n').filter(l => l.trim()).slice(0, 10);
          console.log('First 10 synced lines:\n', lines.join('\n'));
        }
      } catch(e) {
        console.error('Error parsing:', e.message, d.substring(0, 100));
      }
    });
  }).on('error', e => console.error('Request error:', e.message));
}

fetchLrclib('Heather', 'Conan Gray');
