const { importYouTubeSong } = require('../lib/youtube-lyrics-service');
const fs = require('fs');
const path = require('path');

(async () => {
    const songs = [
        { 
            id: 'heather-conan-gray',
            title: 'Heather', 
            artist: 'Conan Gray', 
            youtubeId: '24u3NoPvgMw', 
            level: 'B1', 
            genre: 'Indie Pop', 
            bpm: 102,
            accent: 'Mỹ (US)',
            description: 'Bản hit acoustic chạm tới triệu trái tim của Conan Gray. Ca từ sâu lắng về tình yêu đơn phương.'
        },
        { 
            id: 'until-i-found-you',
            title: 'Until I Found You', 
            artist: 'Stephen Sanchez', 
            youtubeId: 'GxldQ9eX2wo', 
            level: 'A2', 
            genre: 'Retro Ballad', 
            bpm: 100,
            accent: 'Mỹ (US)',
            description: 'Giai điệu hoài niệm phong cách thập niên 60s, phát âm tròn vành rõ chữ rất dễ nghe.'
        },
        { 
            id: 'perfect-ed-sheeran',
            title: 'Perfect', 
            artist: 'Ed Sheeran', 
            youtubeId: '2Vv-BfVoq4g', 
            level: 'A2', 
            genre: 'Romantic Pop', 
            bpm: 95,
            accent: 'Anh (UK)',
            description: 'Tuyệt phẩm lãng mạn kinh điển của Ed Sheeran, thích hợp luyện nối âm và ngữ điệu chuẩn Anh-Anh.'
        },
        { 
            id: 'counting-stars-onerepublic',
            title: 'Counting Stars', 
            artist: 'OneRepublic', 
            youtubeId: 'hT_nvWreIhg', 
            level: 'B2', 
            genre: 'Pop Rock', 
            bpm: 122,
            accent: 'Mỹ (US)',
            description: 'Giai điệu dồn dập bắt tai, thử thách phản xạ gõ phím tốc độ cao và nhận diện âm tiết lướt.'
        },
        { 
            id: 'someone-like-you-adele',
            title: 'Someone Like You', 
            artist: 'Adele', 
            youtubeId: 'hLQl3WQQoQ0', 
            level: 'B1', 
            genre: 'Soul / Piano', 
            bpm: 68,
            accent: 'Anh (UK)',
            description: 'Giọng hát nội lực của Adele trên nền piano mộc, rất rõ chữ và giàu cảm xúc.'
        },
        { 
            id: 'believer-imagine-dragons',
            title: 'Believer', 
            artist: 'Imagine Dragons', 
            youtubeId: '7wtfhZwyrcc', 
            level: 'B2', 
            genre: 'Alternative / Rock', 
            bpm: 125,
            accent: 'Mỹ (US)',
            description: 'Năng lượng bùng nổ, nhịp trống dồn dập giúp tăng cường phản xạ nghe bắt từ ngữ mạnh mẽ.'
        },
        { 
            id: 'shape-of-you-ed-sheeran',
            title: 'Shape of You', 
            artist: 'Ed Sheeran', 
            youtubeId: 'JGwWNGJdvx8', 
            level: 'B1', 
            genre: 'Dance Pop', 
            bpm: 96,
            accent: 'Anh (UK)',
            description: 'Bản hit tỷ view thế giới với nhịp marimba bắt tai, luyện nghe nối âm và ngữ pháp đời thường.'
        },
        { 
            id: 'a-thousand-years-christina-perri',
            title: 'A Thousand Years', 
            artist: 'Christina Perri', 
            youtubeId: 'rtOvBOTyX00', 
            level: 'A2', 
            genre: 'Cinematic Ballad', 
            bpm: 139,
            accent: 'Mỹ (US)',
            description: 'Nhạc phim Twilight bất hủ, lời bài hát trong trẻo chậm rãi, cực kỳ thích hợp cho người mới bắt đầu.'
        }
    ];

    const results = [];
    for (const s of songs) {
        try {
            console.log(`Fetching ${s.title} (${s.youtubeId})...`);
            const imported = await importYouTubeSong(s.youtubeId);
            if (imported && imported.lines && imported.lines.length > 0) {
                // Giữ lại id, level, genre, bpm, description chuẩn
                imported.id = s.id;
                imported.title = s.title;
                imported.artist = s.artist;
                imported.level = s.level;
                imported.genre = s.genre;
                imported.bpm = s.bpm;
                imported.accent = s.accent;
                imported.description = s.description;

                // Lọc bỏ các dòng chỉ là nốt nhạc ♪ hoặc trống
                imported.lines = imported.lines.filter(l => l.text && l.text.trim() !== '♪' && l.text.trim() !== '');
                // Gán lại index tuần tự
                imported.lines.forEach((l, idx) => { l.index = idx + 1; });

                results.push(imported);
                console.log(`✓ ${s.title}: ${imported.lines.length} lines, first line at ${imported.lines[0].start}s: "${imported.lines[0].text}"`);
            } else {
                console.log(`✗ ${s.title}: no lines`);
            }
        } catch (e) {
            console.error(`✗ ${s.title} error:`, e.message);
        }
    }

    console.log(`\nTotal successfully fetched: ${results.length}/${songs.length}`);

    // Ghi vào file js/youtube-dictation-data.js và www/js/youtube-dictation-data.js
    const fileContent = `/**
 * YOUTUBE LYRICS & VIDEO DICTATION DATA BANK
 * Dữ liệu bài hát & video chuẩn 100% thời gian thực đồng bộ từng giây từ LRCLIB & YouTube oEmbed
 * Hỗ trợ 2 chế độ: Chép lời (hiện chữ) & Nghe tự gõ (che chữ) với Auto A-B Looper
 */

(function (window) {
    'use strict';

    window.YouTubeDictationData = ${JSON.stringify(results, null, 4)};

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = window.YouTubeDictationData;
    }
})(typeof window !== 'undefined' ? window : global);
`;

    const p1 = path.join(__dirname, '../js/youtube-dictation-data.js');
    const p2 = path.join(__dirname, '../www/js/youtube-dictation-data.js');
    fs.writeFileSync(p1, fileContent, 'utf8');
    fs.writeFileSync(p2, fileContent, 'utf8');
    console.log(`Successfully wrote ${results.length} songs to ${p1} and ${p2}`);
})();

