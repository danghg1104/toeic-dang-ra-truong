const fs = require('fs');
const songs = require('../js/youtube-dictation-data.js');

console.log(`Loaded ${songs.length} songs`);

// Format clean output
const fileContent = `/**
 * VOCATYPE PRO - BỘ SƯU TẬP BÀI HÁT YOUTUBE ĐƯỢC TUYỂN CHỌN
 * Đồng bộ câu hát tự nhiên theo nhịp điệu (phrases 3.5s - 6.5s)
 * 100% Vietsub chuẩn xác, hỗ trợ luyện nghe chép chính tả & tự gõ
 */
const YOUTUBE_DICTATION_SONGS = ${JSON.stringify(songs, null, 4)};

if (typeof window !== 'undefined') {
    window.YouTubeDictationData = YOUTUBE_DICTATION_SONGS;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = YOUTUBE_DICTATION_SONGS;
}
`;

fs.writeFileSync('js/youtube-dictation-data.js', fileContent, 'utf8');
if (fs.existsSync('www/js')) {
    fs.writeFileSync('www/js/youtube-dictation-data.js', fileContent, 'utf8');
}
console.log('Successfully wrote clean unified youtube-dictation-data.js!');
