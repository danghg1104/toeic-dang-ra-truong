const { importYouTubeSong } = require('../lib/youtube-lyrics-service');
const fs = require('fs');
const path = require('path');
const https = require('https');

function translateText(text) {
    return new Promise((resolve) => {
        if (!text || !text.trim() || text.trim() === '♪' || text.trim() === '(Oh)') {
            return resolve('');
        }
        const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text.trim()) + '&langpair=en|vi';
        https.get(url, { headers: { 'User-Agent': 'VocatypeApp/1.0' } }, res => {
            let d = '';
            res.on('data', c => d += c);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(d);
                    const t = parsed && parsed.responseData ? parsed.responseData.translatedText : '';
                    resolve(t || text);
                } catch (e) {
                    resolve(text);
                }
            });
        }).on('error', () => resolve(text));
    });
}

const targetSongs = [
    { id: 'heather-conan-gray', title: 'Heather', artist: 'Conan Gray', youtubeId: '24u3NoPvgMw', level: 'B1', genre: 'Indie Pop', bpm: 102, accent: 'Mỹ (US)' },
    { id: 'until-i-found-you', title: 'Until I Found You', artist: 'Stephen Sanchez', youtubeId: 'GxldQ9eX2wo', level: 'A2', genre: 'Retro Ballad', bpm: 100, accent: 'Mỹ (US)' },
    { id: 'perfect-ed-sheeran', title: 'Perfect', artist: 'Ed Sheeran', youtubeId: '2Vv-BfVoq4g', level: 'A2', genre: 'Romantic Pop', bpm: 95, accent: 'Anh (UK)' },
    { id: 'counting-stars-onerepublic', title: 'Counting Stars', artist: 'OneRepublic', youtubeId: 'hT_nvWreIhg', level: 'B2', genre: 'Pop Rock', bpm: 122, accent: 'Mỹ (US)' },
    { id: 'someone-like-you-adele', title: 'Someone Like You', artist: 'Adele', youtubeId: 'hLQl3WQQoQ0', level: 'B1', genre: 'Soul / Piano', bpm: 68, accent: 'Anh (UK)' },
    { id: 'believer-imagine-dragons', title: 'Believer', artist: 'Imagine Dragons', youtubeId: '7wtfhZwyrcc', level: 'B2', genre: 'Alternative / Rock', bpm: 125, accent: 'Mỹ (US)' },
    { id: 'shape-of-you-ed-sheeran', title: 'Shape of You', artist: 'Ed Sheeran', youtubeId: 'JGwWNGJdvx8', level: 'B1', genre: 'Dance Pop', bpm: 96, accent: 'Anh (UK)' },
    { id: 'a-thousand-years-christina-perri', title: 'A Thousand Years', artist: 'Christina Perri', youtubeId: 'rtOvBOTyX00', level: 'A2', genre: 'Cinematic Ballad', bpm: 139, accent: 'Mỹ (US)' },
    { id: 'love-story-taylor-swift', title: 'Love Story', artist: 'Taylor Swift', youtubeId: '8xg3vE8Ie_E', level: 'A2', genre: 'Country Pop', bpm: 119, accent: 'Mỹ (US)' },
    { id: 'attention-charlie-puth', title: 'Attention', artist: 'Charlie Puth', youtubeId: 'nfs8NYg7yQM', level: 'B1', genre: 'Funk Pop', bpm: 100, accent: 'Mỹ (US)' },
    { id: 'memories-maroon-5', title: 'Memories', artist: 'Maroon 5', youtubeId: 'SlPhMPnQ58k', level: 'A2', genre: 'Acoustic Pop', bpm: 91, accent: 'Mỹ (US)' },
    { id: 'lovely-billie-eilish', title: 'Lovely', artist: 'Billie Eilish ft. Khalid', youtubeId: 'V1Pl8CzNzCw', level: 'B1', genre: 'Chamber Pop', bpm: 115, accent: 'Mỹ (US)' },
    { id: 'stay-the-kid-laroi', title: 'STAY', artist: 'The Kid LAROI & Justin Bieber', youtubeId: 'KTZ-y85Erus', level: 'B1', genre: 'Synth-Pop', bpm: 170, accent: 'Mỹ / Úc' },
    { id: 'see-you-again-charlie-puth', title: 'See You Again', artist: 'Wiz Khalifa ft. Charlie Puth', youtubeId: 'RgKAFK5djSk', level: 'B1', genre: 'Hip Hop / Ballad', bpm: 80, accent: 'Mỹ (US)' }
];

(async () => {
    console.log(`Starting catalog expansion for ${targetSongs.length} songs...`);
    const existing = require('../js/youtube-dictation-data.js') || [];
    const existingMap = new Map();
    existing.forEach(s => existingMap.set(s.id, s));

    const finalSongs = [];

    for (const meta of targetSongs) {
        try {
            console.log(`Processing: ${meta.title}...`);
            if (existingMap.has(meta.id)) {
                const ex = existingMap.get(meta.id);
                // Đảm bảo các line đều có vietsub
                for (let i = 0; i < ex.lines.length; i++) {
                    const l = ex.lines[i];
                    if (!l.vietsub || l.vietsub.startsWith('Giai điệu:')) {
                        console.log(`  Translating line ${l.index}: ${l.text}`);
                        l.vietsub = await translateText(l.text);
                        await new Promise(r => setTimeout(r, 80));
                    }
                }
                finalSongs.push(ex);
                console.log(`✓ ${meta.title} (existing, ${ex.lines.length} lines, Vietsub OK)`);
                continue;
            }

            // Bài mới: import từ YouTube lyrics service
            const imported = await importYouTubeSong(meta.youtubeId);
            if (imported && imported.lines && imported.lines.length > 0) {
                imported.id = meta.id;
                imported.title = meta.title;
                imported.artist = meta.artist;
                imported.level = meta.level;
                imported.genre = meta.genre;
                imported.bpm = meta.bpm;
                imported.accent = meta.accent;
                imported.description = `Bản hit "${meta.title}" của ${meta.artist}. Luyện nghe chép lời chuẩn xác từng câu hát.`;

                imported.lines = imported.lines.filter(l => l.text && l.text.trim() !== '♪' && l.text.trim() !== '');
                imported.lines.forEach((l, idx) => { l.index = idx + 1; });

                // Dịch Vietsub cho từng line
                for (let i = 0; i < imported.lines.length; i++) {
                    const l = imported.lines[i];
                    l.vietsub = await translateText(l.text);
                    await new Promise(r => setTimeout(r, 70));
                }

                finalSongs.push(imported);
                console.log(`✓ ${meta.title} (NEW, ${imported.lines.length} lines + Vietsub OK)`);
            } else {
                console.warn(`✗ ${meta.title}: no lines found`);
            }
        } catch (e) {
            console.error(`✗ Error on ${meta.title}:`, e.message);
        }
    }

    console.log(`\nCatalog ready with ${finalSongs.length} songs.`);
    const fileContent = `/**
 * YOUTUBE LYRICS & VIDEO DICTATION DATA BANK
 * Dữ liệu bài hát & video chuẩn 100% thời gian thực đồng bộ từng giây từ LRCLIB & YouTube oEmbed
 * Phụ đề Vietsub song ngữ tự động và từ vựng trọng tâm.
 */

(function (window) {
    'use strict';

    window.YouTubeDictationData = ${JSON.stringify(finalSongs, null, 4)};

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = window.YouTubeDictationData;
    }
})(typeof window !== 'undefined' ? window : global);
`;

    const p1 = path.join(__dirname, '../js/youtube-dictation-data.js');
    const p2 = path.join(__dirname, '../www/js/youtube-dictation-data.js');
    fs.writeFileSync(p1, fileContent, 'utf8');
    fs.writeFileSync(p2, fileContent, 'utf8');
    console.log('Successfully saved expanded catalog to js/ and www/js/!');
})();
