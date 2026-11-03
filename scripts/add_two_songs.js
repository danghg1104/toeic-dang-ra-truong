const { importYouTubeSong } = require('../lib/youtube-lyrics-service');
const fs = require('fs');
const path = require('path');

(async () => {
    const existing = require('../js/youtube-dictation-data.js');
    const newSongs = [
        { id: 'love-story-taylor-swift', title: 'Love Story', artist: 'Taylor Swift', youtubeId: '8xg3vE8Ie_E', level: 'A2', genre: 'Country Pop', bpm: 119, accent: 'Mỹ (US)', desc: 'Bản tình ca Romeo & Juliet bất hủ của Taylor Swift, ca từ trong sáng, dễ nghe dễ nhớ.' },
        { id: 'attention-charlie-puth', title: 'Attention', artist: 'Charlie Puth', youtubeId: 'nfs8NYg7yQM', level: 'B1', genre: 'Funk Pop', bpm: 100, accent: 'Mỹ (US)', desc: 'Giai điệu bassline lôi cuốn, giọng hát rõ từng phụ âm, rất tốt để luyện phản xạ nghe nhanh.' }
    ];

    for (const meta of newSongs) {
        if (!existing.some(s => s.id === meta.id)) {
            try {
                console.log(`Fetching ${meta.title}...`);
                const song = await importYouTubeSong(meta.youtubeId);
                if (song && song.lines && song.lines.length > 0) {
                    song.id = meta.id;
                    song.title = meta.title;
                    song.artist = meta.artist;
                    song.level = meta.level;
                    song.genre = meta.genre;
                    song.bpm = meta.bpm;
                    song.accent = meta.accent;
                    song.description = meta.desc;
                    song.lines = song.lines.filter(l => l.text && l.text.trim() !== '♪');
                    song.lines.forEach((l, i) => {
                        l.index = i + 1;
                        if (!l.vietsub) l.vietsub = l.text;
                    });
                    existing.push(song);
                    console.log(`✓ Added ${meta.title} (${song.lines.length} lines)`);
                }
            } catch (e) {
                console.error(`✗ Error adding ${meta.title}:`, e.message);
            }
        }
    }

    const fileContent = `/**
 * YOUTUBE LYRICS & VIDEO DICTATION DATA BANK
 * Dữ liệu bài hát & video chuẩn 100% thời gian thực đồng bộ từng giây từ LRCLIB & YouTube oEmbed
 * Phụ đề Vietsub song ngữ tự động và từ vựng trọng tâm.
 */

(function (window) {
    'use strict';

    window.YouTubeDictationData = ${JSON.stringify(existing, null, 4)};

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = window.YouTubeDictationData;
    }
})(typeof window !== 'undefined' ? window : global);
`;

    const p1 = path.join(__dirname, '../js/youtube-dictation-data.js');
    const p2 = path.join(__dirname, '../www/js/youtube-dictation-data.js');
    fs.writeFileSync(p1, fileContent, 'utf8');
    fs.writeFileSync(p2, fileContent, 'utf8');
    console.log(`Total songs now: ${existing.length}`);
})();
