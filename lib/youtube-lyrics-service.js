/**
 * YOUTUBE & MUSIC LYRICS IMPORT SERVICE
 * Tự động bóc tách thông tin YouTube (oEmbed) & nạp Synchronized Lyrics chuẩn từng giây (LRCLIB API)
 * Phục vụ tính năng luyện nghe chép chính tả mọi bài hát trên YouTube
 */

const https = require('https');

function httpGet(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'VocatypeApp/1.0 (https://localhost:3000; study english platform)'
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
            if (text && !text.startsWith('[') && !text.startsWith('作词') && !text.startsWith('作曲')) {
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
        if (end - start > 12.0) end = start + 6.0;

        // Lấy 1 - 3 từ khuyết làm blank cho chế độ thử thách
        const cleanWords = cur.text.split(/\s+/).map(w => w.replace(/[^a-zA-Z]/g, '')).filter(w => w.length >= 3);
        const blanks = cleanWords.slice(0, Math.min(3, Math.max(1, Math.floor(cleanWords.length / 2))));

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
    let videoId = (input || '').trim();
    if (videoId.includes('v=')) {
        videoId = videoId.split('v=')[1].split('&')[0];
    } else if (videoId.includes('youtu.be/')) {
        videoId = videoId.split('youtu.be/')[1].split('?')[0];
    } else if (videoId.includes('embed/')) {
        videoId = videoId.split('embed/')[1].split('?')[0];
    } else if (videoId.includes('shorts/')) {
        videoId = videoId.split('shorts/')[1].split('?')[0];
    }

    if (!videoId || videoId.length < 5) {
        throw new Error('Link YouTube không hợp lệ! Vui lòng kiểm tra lại đường dẫn.');
    }

    // 1. Lấy thông tin video từ YouTube oEmbed
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const oembedRes = await httpGet(oembedUrl);
    if (!oembedRes.data || !oembedRes.data.title) {
        throw new Error('Không thể tìm thấy video trên YouTube hoặc video bị đặt chế độ riêng tư.');
    }

    const rawTitle = oembedRes.data.title;
    const authorName = oembedRes.data.author_name || '';
    const thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    // Làm sạch tiêu đề video
    let cleanTitle = rawTitle
        .replace(/\s*[\(\[](official\s*(music\s*video|audio|video|lyric\s*video|video\s*lyrics|hd|4k|mv)?|lyrics?|visualizer)[\)\]]/gi, '')
        .replace(/\|\s*.*$/gi, '')
        .trim();

    let artist = authorName.replace(/VEVO|Official|Topic/gi, '').trim();
    let track = cleanTitle;

    if (cleanTitle.includes(' - ')) {
        const parts = cleanTitle.split(' - ');
        artist = parts[0].trim();
        track = parts[1].trim();
    } else if (cleanTitle.includes('-')) {
        const parts = cleanTitle.split('-');
        artist = parts[0].trim();
        track = parts[1].trim();
    }

    // 2. Tìm lyrics đồng bộ thời gian từ LRCLIB
    let lrcData = null;
    const directRes = await httpGet(`https://lrclib.net/api/get?artist_name=${encodeURIComponent(artist)}&track_name=${encodeURIComponent(track)}`);
    if (directRes.data && directRes.data.syncedLyrics) {
        lrcData = directRes.data;
    } else {
        const searchRes = await httpGet(`https://lrclib.net/api/search?q=${encodeURIComponent(track + ' ' + artist)}`);
        if (Array.isArray(searchRes.data) && searchRes.data.length > 0) {
            lrcData = searchRes.data.find(item => !!item.syncedLyrics) || searchRes.data[0];
        }
    }

    let lines = [];
    if (lrcData && lrcData.syncedLyrics) {
        lines = parseLrc(lrcData.syncedLyrics);
    } else {
        // Fallback: nếu không có lời đồng bộ LRC, tạo khung luyện cơ bản
        lines = [
            {
                index: 1,
                start: 0.0,
                end: 8.0,
                text: 'Listen to the music and type what you hear.',
                vietsub: 'Lắng nghe giai điệu và gõ lời bài hát bạn nghe được.',
                blanks: ['Listen', 'music', 'hear']
            }
        ];
    }

    // Trích xuất từ vựng trọng tâm từ các từ dài
    // Tự động dịch Vietsub cho từng câu hát
    try {
        const chunkSize = 5;
        for (let i = 0; i < lines.length; i += chunkSize) {
            const chunk = lines.slice(i, i + chunkSize);
            await Promise.all(chunk.map(async line => {
                if (!line.vietsub && line.text && line.text.trim() !== '♪') {
                    line.vietsub = await translateText(line.text);
                }
            }));
            await new Promise(r => setTimeout(r, 40));
        }
    } catch (e) {}

    const vocabList = [];
    const seen = new Set();
    for (const line of lines) {
        const words = line.text.split(/\s+/).map(w => w.replace(/[^a-zA-Z]/g, '')).filter(w => w.length >= 6);
        for (const w of words) {
            const lower = w.toLowerCase();
            if (!seen.has(lower) && vocabList.length < 6) {
                seen.add(lower);
                vocabList.push({ word: lower, ipa: '', meaning: 'Từ vựng trong bài hát' });
            }
        }
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
        vocabFocus: vocabList
    };
}

async function searchSongs(query) {
    if (!query || !query.trim()) return [];
    const searchRes = await httpGet(`https://lrclib.net/api/search?q=${encodeURIComponent(query.trim())}`);
    if (!Array.isArray(searchRes.data)) return [];

    return searchRes.data.filter(item => !!item.syncedLyrics).slice(0, 8).map(item => ({
        id: 'lrc-' + item.id,
        title: item.trackName,
        artist: item.artistName,
        duration: item.duration,
        hasSynced: !!item.syncedLyrics
    }));
}

const translationCache = new Map();

async function translateText(text) {
    if (!text || !text.trim() || text.trim() === '♪') return '';
    const clean = text.trim();
    if (translationCache.has(clean)) return translationCache.get(clean);

    try {
        const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(clean) + '&langpair=en|vi';
        const res = await httpGet(url);
        if (res && res.data && res.data.responseData && res.data.responseData.translatedText) {
            const translated = res.data.responseData.translatedText;
            translationCache.set(clean, translated);
            return translated;
        }
    } catch (e) {}

    translationCache.set(clean, clean);
    return clean;
}

module.exports = {
    importYouTubeSong,
    searchSongs,
    parseLrc,
    translateText
};
