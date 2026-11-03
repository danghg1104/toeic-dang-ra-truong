const https = require('https');

function httpGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on('error', reject);
  });
}

function parseLrc(lrcText) {
  const lines = [];
  const rawLines = (lrcText || '').split(/\r?\n/);
  const timeRegex = /\[(\d{2}):(\d{2})\.?(\d{2,3})?\](.*)/;

  const temp = [];
  for (const raw of rawLines) {
    const match = timeRegex.exec(raw.trim());
    if (match) {
      const min = parseInt(match[1], 10);
      const sec = parseInt(match[2], 10);
      const ms = match[3] ? (match[3].length === 2 ? parseInt(match[3], 10) * 10 : parseInt(match[3], 10)) : 0;
      const timeInSec = min * 60 + sec + ms / 1000;
      const text = match[4].trim();
      if (text) {
        temp.push({ time: Math.round(timeInSec * 10) / 10, text });
      }
    }
  }

  for (let i = 0; i < temp.length; i++) {
    const cur = temp[i];
    const next = temp[i + 1];
    const start = cur.time;
    let end = next ? next.time : start + 4.5;
    if (end <= start) end = start + 3.0;
    if (end - start > 10.0) end = start + 6.0;

    // Pick 1-3 blanks for dictation
    const words = cur.text.split(/\s+/).map(w => w.replace(/[^a-zA-Z]/g, '')).filter(w => w.length >= 3);
    const blanks = words.slice(0, Math.min(3, Math.max(1, Math.floor(words.length / 2))));

    lines.push({
      index: i + 1,
      start: Math.round(start * 10) / 10,
      end: Math.round(end * 10) / 10,
      text: cur.text,
      vietsub: '',
      blanks: blanks
    });
  }

  return lines;
}

async function importYouTubeSong(input) {
  let videoId = input.trim();
  if (input.includes('v=')) {
    videoId = input.split('v=')[1].split('&')[0];
  } else if (input.includes('youtu.be/')) {
    videoId = input.split('youtu.be/')[1].split('?')[0];
  } else if (input.includes('embed/')) {
    videoId = input.split('embed/')[1].split('?')[0];
  }

  console.log(`Processing Video ID: ${videoId}...`);

  // 1. Fetch oEmbed
  const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
  const oembedRes = await httpGet(oembedUrl);
  if (!oembedRes.data || !oembedRes.data.title) {
    throw new Error('Không thể lấy thông tin video YouTube này.');
  }

  const rawTitle = oembedRes.data.title;
  const authorName = oembedRes.data.author_name || '';
  const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  console.log(`Title: "${rawTitle}", Author: "${authorName}"`);

  // Clean title
  let cleanTitle = rawTitle
    .replace(/\s*[\(\[](official\s*(music\s*video|audio|video|lyric\s*video|video\s*lyrics|hd|4k)?|lyrics?)[\)\]]/gi, '')
    .replace(/\|\s*.*$/gi, '')
    .trim();

  let artist = authorName.replace(/VEVO|Official/gi, '').trim();
  let track = cleanTitle;

  if (cleanTitle.includes('-')) {
    const parts = cleanTitle.split('-');
    artist = parts[0].trim();
    track = parts[1].trim();
  }

  console.log(`Clean query -> Artist: "${artist}", Track: "${track}"`);

  // 2. Fetch lyrics from LRCLIB
  let lrcData = null;
  const directRes = await httpGet(`https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(track)}`);
  if (directRes.data && directRes.data.syncedLyrics) {
    lrcData = directRes.data;
  } else {
    // Search fallback
    const searchRes = await httpGet(`https://lrclib.net/api/search?q=${encodeURIComponent(track + ' ' + artist)}`);
    if (Array.isArray(searchRes.data) && searchRes.data.length > 0) {
      lrcData = searchRes.data.find(item => !!item.syncedLyrics) || searchRes.data[0];
    }
  }

  let lines = [];
  if (lrcData && lrcData.syncedLyrics) {
    lines = parseLrc(lrcData.syncedLyrics);
    console.log(`✅ Lấy thành công ${lines.length} câu hát khớp từng giây!`);
  } else {
    console.log(`⚠️ Không tìm thấy lời đồng bộ, tạo dòng nghe mẫu.`);
    lines = [
      {
        index: 1,
        start: 0,
        end: 10,
        text: 'Listen carefully and type the lyrics you hear.',
        vietsub: 'Lắng nghe giai điệu và gõ những từ bạn nghe được.',
        blanks: ['Listen', 'carefully', 'lyrics']
      }
    ];
  }

  return {
    id: 'yt-' + videoId,
    title: track,
    artist: artist || authorName,
    youtubeId: videoId,
    thumbnail: thumbnail,
    level: 'B1',
    genre: 'YouTube Music',
    accent: 'US / UK',
    description: `Bài hát "${track}" của ${artist}. Luyện nghe chép chính tả trực tiếp từ YouTube.`,
    lines: lines,
    vocabFocus: lines.slice(0, 5).flatMap(l => (l.blanks || []).slice(0, 1)).map(w => ({ word: w, ipa: '', meaning: '' }))
  };
}

(async () => {
  try {
    const song = await importYouTubeSong('https://www.youtube.com/watch?v=24u3NoPvgMw');
    console.log('\nFinal Song Object Generated:');
    console.log({
      id: song.id,
      title: song.title,
      artist: song.artist,
      youtubeId: song.youtubeId,
      linesCount: song.lines.length,
      sampleLine: song.lines[0]
    });
  } catch (e) {
    console.error('Error:', e);
  }
})();
