const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'js', 'dictionary-engine.js');
let code = fs.readFileSync(targetPath, 'utf8');

const startMarker = '// Xử lý thông minh tiếng Việt không dấu';
const endMarker = 'const mainTrans = gtxData?.sentences';

const startIdx = code.indexOf(startMarker);
const endIdx = code.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
    console.error('Markers not found!');
    process.exit(1);
}

const newBlock = `// Xử lý thông minh tiếng Việt không dấu (vd: "con meo", "hanh phuc")
            // Chỉ kiểm tra khi Google phát hiện src là 'vi' HOẶC bản dịch en->vi bị lặp lại y hệt từ gốc (Google không dịch được)
            if (!isVi && gtxData) {
                const rawTrans = (gtxData.sentences?.[0]?.trans || '').trim();
                const isEchoed = rawTrans.toLowerCase() === cleanKey;
                if (gtxData.src === 'vi' || isEchoed) {
                    try {
                        const revUrl = \`https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&dt=bd&dt=ex&dt=md&dt=ss&dt=at&dj=1&q=\${encodeURIComponent(raw)}\`;
                        const revRes = await fetch(revUrl);
                        if (revRes.ok) {
                            const revData = await revRes.json();
                            const revTrans = (revData && revData.sentences?.[0]?.trans || '').trim();
                            if (revTrans && revTrans.toLowerCase() !== cleanKey) {
                                gtxData = revData;
                                isVi = true;
                                sl = 'vi';
                                tl = 'en';
                            }
                        }
                    } catch(e) {}
                }
            }

            `;

code = code.substring(0, startIdx) + newBlock + code.substring(endIdx);
code = code.replaceAll('ultimate_dict_cache_v4', 'ultimate_dict_cache_v5');
fs.writeFileSync(targetPath, code, 'utf8');
console.log('✅ Successfully updated auto-detect logic in js/dictionary-engine.js!');
