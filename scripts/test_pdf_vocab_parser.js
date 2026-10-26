const sampleOcrText = `
Danh sách 3000 từ vựng TOEIC
STT Từ vựng
1 abandon v. /ə'bændən/ bỏ, từ bỏ
2 abandoned adj. /ə'bændənd/ bị bỏ rơi, bị ruồng bỏ
3 ability n. /ə'biliti/ khả năng, năng lực
4 able adj. /'eibl/ có năng lực, có tài
5 unable adj. /'ʌn'eibl/ không có năng lực, không có tài
6 about adv., prep. /ə'baut/ khoảng, về
7 above prep., adv. /ə'bʌv/ ở trên, lên trên
8 abroad adv. /ə'brɔ:d/ ở, ra nước ngoài, ngoài trời
9 absence n. /'æbsəns/ sự vắng mặt
10 absent adj. /'æbsənt/ vắng mặt, nghỉ
11 absolute adj. /'æbsəlu:t/ tuyệt đối, hoàn toàn
12 absolutely adv. /'æbsəlu:tli/ tuyệt đối, hoàn toàn
13 absorb v. /əb'sɔ:b/ thu hút, hấp thu, lôi cuốn
14 abuse n., v. /ə'bju:s/ lộng hành, lạm dụng
15 academic adj. /,ækə'demik/ thuộc học viện, ĐH, viện hàn lâm
16 accent n. /'æksənt/ trọng âm, dấu trọng âm
17 accept v. /ək'sept/ chấp nhận, chấp thuận
18 acceptable adj. /ək'septəbl/ có thể chấp nhận, chấp thuận
19 unacceptable adj. /'ʌnək'septəbl/
20 access n. /'ækses/ lối, cửa, đường vào
21 accident n. /'æksidənt/ tai nạn, rủi ro
22 by accident
23 accidental adj. /,æksi'dentl/ tình cờ, bất ngờ
24 accidentally adv. /,æksi'dentəli/ tình cờ, ngẫu nhiên
25 accommodation n. /ə,kɔmə'deiʃn/ sự thích nghi, điều tiết
26 accompany v. /ə'kʌmpəni/ đi theo, đi cùng, kèm theo
27 according to prep. /ə'kɔ:diɳ/ theo, y theo
28 account n., v. /ə'kaunt/ tài khoản, kế toán; tính toán, tính đến
29 accurate adj. /'ækjurit/ đúng đắn, chính xác, xác đáng
30 accurately adv. /'ækjuritli/ đúng đắn, chính xác
44 actor, actress n. /'æktə/ /'æktris/ diễn viên
47 advertisement /əd'və:tismənt/ quảng cáo
70 advertisement (also ad, advert) n. /əd'və:tismənt/
101 alcoholic adj., n. /,ælkə'hɔlik/ rượu; người nghiện rượu
105 all right adj., adv., exclamation /'ɔ:l'rait/ tốt, ổn, khỏe mạnh; được
`;

function parseLine(line) {
    let clean = line.trim();
    if (!clean) return null;
    if (/^(STT|Từ vựng|Danh sách|Page|Trang)/i.test(clean)) return null;

    clean = clean.replace(/^\d+[\.\)]?\s+/, '');
    const slash1 = clean.indexOf('/');
    const slash2 = clean.lastIndexOf('/');
    if (slash1 !== -1 && slash2 > slash1) {
        let left = clean.slice(0, slash1).trim();
        let ipa = clean.slice(slash1, slash2 + 1).trim();
        let right = clean.slice(slash2 + 1).trim();

        const posRegex = /\s+(?:(?:adj|adv|prep|conj|pron|det|modal(?:\s+v)?|n|v|auxiliary(?:\s+v)?)\.?\s*(?:,\s*)?|exclamation|prefix|suffix)+$/i;
        left = left.replace(/\(also[^)]*\)/i, '').replace(posRegex, '').trim();
        if (left.includes(',')) left = left.split(',')[0].trim();
        if (left.includes('(')) left = left.split('(')[0].trim();

        let meaning = right.replace(/^[,;\s\-:]+/, '').trim();
        if (left && /^[a-zA-Z\s\-']{2,40}$/.test(left)) {
            return { word: left, phonetic: ipa, meaning };
        }
    }

    const sepMatch = clean.match(/^([a-zA-Z\s\-']{2,35})\s*[-:\t]\s*(.+)$/);
    if (sepMatch) {
        return {
            word: sepMatch[1].trim(),
            phonetic: '/' + sepMatch[1].trim() + '/',
            meaning: sepMatch[2].trim()
        };
    }

    const wordMatch = clean.match(/^([a-zA-Z\s\-']{2,35})/);
    if (wordMatch) {
        const w = wordMatch[1].trim();
        const rest = clean.slice(wordMatch[0].length).trim();
        return {
            word: w,
            phonetic: '/' + w + '/',
            meaning: rest
        };
    }

    return null;
}

const lines = sampleOcrText.split('\n');
const results = lines.map(parseLine).filter(Boolean);
console.log('Total extracted words:', results.length);
console.log('Sample parsed results:');
results.slice(0, 10).forEach(r => console.log(' -', r.word, '->', r.phonetic, '->', r.meaning));
