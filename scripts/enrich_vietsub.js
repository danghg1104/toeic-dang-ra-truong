const fs = require('fs');
const path = require('path');

const p1 = path.join(__dirname, '../js/youtube-dictation-data.js');
const songs = require(p1);

// Bổ sung Vietsub chuẩn xác và thơ mộng cho từng bài hát nổi tiếng
const vietsubMap = {
    'heather-conan-gray': {
        1: 'Em vẫn nhớ như in ngày mùng 3 tháng 12, khi em mặc chiếc áo len của anh.',
        2: 'Anh bảo em mặc chiếc áo ấy còn đẹp hơn cả khi anh mặc.',
        3: 'Giá như anh biết được em đã từng thích anh nhiều đến nhường nào.',
        4: 'Nhưng ánh mắt anh giờ đây chỉ mải dõi theo khi cô ấy...',
        5: '...bước ngang qua.',
        6: 'Cô ấy thật đẹp, hình bóng khiến ai cũng phải ngẩn ngơ ngắm nhìn.',
        7: 'Rực rỡ và tươi sáng hơn cả bầu trời xanh biếc.',
        8: 'Cô ấy hớp trọn tâm trí anh, trong khi cõi lòng em đang vỡ vụn.',
        9: 'Cớ sao anh lại chẳng bao giờ trao em một nụ hôn?',
        10: 'Em thậm chí còn chẳng xinh đẹp bằng một nửa của cô ấy.',
        11: 'Anh trao cô ấy chiếc áo len của mình, dẫu nó chỉ là sợi vải polyester tầm thường.',
        12: 'Thế nhưng anh lại thích cô ấy hơn em.',
        13: 'Ước gì em có thể là Heather.',
        14: 'Em đứng nhìn cô ấy sánh bước bên anh, bàn tay đan chặt lấy tay anh.',
        15: 'Anh khoác tay qua bờ vai cô ấy, còn lòng em đang dần lạnh ngắt.',
        16: 'Nhưng làm sao em có thể ghét cô ấy được chứ? Cô ấy thuần khiết tựa thiên thần.',
        17: 'Nhưng rồi em lại thầm ước giá như cô ấy biến mất khi...',
        18: '...cô ấy bước qua.',
        19: 'Một vẻ đẹp khiến ai cũng phải đắm say ngắm nhìn.',
        20: 'Rực rỡ hơn cả vòm trời trong xanh.',
        21: 'Cô ấy hoàn toàn mê hoặc anh, trong khi tim em đang chết lặng.',
        22: 'Vì sao anh lại không một lần hôn em?',
        23: 'Bởi em đâu xinh đẹp bằng một góc của cô ấy.',
        24: 'Anh trao cô ấy chiếc áo của mình, dẫu chỉ là vải polyester đơn sơ.',
        25: 'Thế nhưng anh lại yêu cô ấy nhiều hơn.',
        26: 'Ước gì em được là Heather.',
        27: '(Ôi...)',
        28: 'Ước chi em là Heather.',
        29: '(Ôi...)',
        30: 'Ước gì em được là Heather.',
        31: 'Cớ sao anh chẳng hề yêu em?',
        32: 'Em đâu thể nào rạng ngời như cô ấy.',
        33: 'Anh trao cô ấy áo len của anh, dẫu chỉ là sợi vải tầm thường.',
        34: 'Nhưng trong mắt anh, cô ấy là tất cả.',
        35: 'Ước gì em là Heather...'
    },
    'until-i-found-you': {
        1: 'Georgia ơi, hãy ôm trọn lấy anh trong vòng tay em...',
        2: 'Anh muốn có em trong vòng tay này.',
        3: 'Ôi, xin hãy để anh được ôm lấy em.',
        4: 'Anh sẽ không bao giờ để lạc mất em thêm một lần nào nữa.',
        5: 'Ôi, anh đã từng tự nhủ với lòng...',
        6: '"Rằng anh sẽ chẳng bao giờ yêu ai thêm lần nào nữa cho đến khi gặp được nàng"',
        7: 'Anh đã nói: "Anh sẽ chẳng trao tim mình trừ khi người đó chính là em"',
        8: 'Anh từng lạc lối giữa màn đêm tăm tối, nhưng rồi anh đã tìm thấy nàng.',
        9: 'Anh đã tìm thấy em.',
        10: 'Georgia đã kéo anh lại gần bên em.',
        11: 'Anh lại khát khao được yêu em thêm một lần nữa.',
        12: 'Khi em ngã xuống, anh đã kịp dang tay đỡ lấy em.',
        13: 'Anh thề sẽ không bao giờ để mất em như những lỗi lầm xưa cũ.',
        14: 'Ôi, anh từng nói với chính mình...',
        15: '"Rằng anh sẽ không bao giờ mở lòng yêu ai cho tới khi tìm thấy nàng"',
        16: 'Anh đã bảo: "Anh sẽ chẳng rung động trước bất kỳ ai ngoài em"',
        17: 'Anh từng chìm đắm trong bóng tối, nhưng rồi anh đã gặp được nàng.',
        18: 'Anh đã tìm thấy em.',
        19: 'Anh sẽ không bao giờ yêu thêm ai cho đến khi anh tìm thấy em.',
        20: 'Trái tim anh chỉ thuộc về duy nhất một mình em mà thôi.',
        21: 'Màn đêm tăm tối đã tan biến kể từ ngày anh gặp được em.',
        22: 'Anh đã tìm thấy em rồi.'
    },
    'perfect-ed-sheeran': {
        1: 'Anh đã tìm thấy một tình yêu đích thực dành riêng cho mình.',
        2: 'Em hỡi, hãy cứ mở lòng và đi theo tiếng gọi của con tim.',
        3: 'Hãy nghe theo sự dẫn lối của anh.',
        4: 'Anh đã tìm thấy một cô gái, xinh đẹp và ngọt ngào biết bao.',
        5: 'Anh chưa từng nghĩ rằng em chính là người bấy lâu nay anh tìm kiếm.',
        6: 'Bởi vì thuở ấy chúng mình chỉ là những đứa trẻ ngây thơ chưa hiểu chữ tình.',
        7: 'Chẳng hề hay biết tình yêu thực sự là gì.',
        8: 'Giờ đây anh sẽ không bao giờ buông tay em đâu.',
        9: 'Em yêu ơi, hãy cứ trao anh nụ hôn chậm rãi.',
        10: 'Trái tim em là tất cả những gì anh gìn giữ.',
        11: 'Và trong ánh mắt em, em cũng đang nắm giữ trái tim anh.'
    }
};

for (const song of songs) {
    const map = vietsubMap[song.id];
    if (map) {
        for (const line of song.lines) {
            if (map[line.index]) {
                line.vietsub = map[line.index];
            }
        }
    } else {
        // Fallback vietsub nếu chưa có
        for (const line of song.lines) {
            if (!line.vietsub) {
                line.vietsub = `Giai điệu: "${line.text}"`;
            }
        }
    }
}

const fileContent = `/**
 * YOUTUBE LYRICS & VIDEO DICTATION DATA BANK
 * Dữ liệu bài hát & video chuẩn 100% thời gian thực đồng bộ từng giây từ LRCLIB & YouTube oEmbed
 * Kèm phụ đề Vietsub ngữ cảnh và danh sách từ vựng trọng tâm.
 */

(function (window) {
    'use strict';

    window.YouTubeDictationData = ${JSON.stringify(songs, null, 4)};

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = window.YouTubeDictationData;
    }
})(typeof window !== 'undefined' ? window : global);
`;

fs.writeFileSync(p1, fileContent, 'utf8');
const p2 = path.join(__dirname, '../www/js/youtube-dictation-data.js');
fs.writeFileSync(p2, fileContent, 'utf8');
console.log('Successfully enriched Vietsub for songs in both js/ and www/js/!');
