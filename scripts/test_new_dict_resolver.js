const puppeteer = require('puppeteer-core');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        headless: 'new'
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');

    const testQueries = [
        'imminent',
        'eager',
        'head of state',
        'happy new year',
        'went',
        'running',
        'hạnh phúc',
        'con meo'
    ];

    const results = await page.evaluate(async (queries) => {
        const VIETNAMESE_REGEX = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;

        async function resolveWord(rawQuery) {
            const raw = String(rawQuery || '').trim().replace(/\s+/g, ' ');
            const isVi = VIETNAMESE_REGEX.test(raw);
            let sl = isVi ? 'vi' : 'en';
            let tl = isVi ? 'en' : 'vi';

            // 1. Google Translate GTX API with dj=1
            const gtxUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&dt=bd&dt=ex&dt=md&dt=ss&dt=at&dj=1&q=${encodeURIComponent(raw)}`;
            let gtxRes = null;
            try {
                const r = await fetch(gtxUrl);
                if (r.ok) gtxRes = await r.json();
            } catch(e) {}

            // Unaccented Vietnamese check
            if (!isVi && gtxRes && gtxRes.src === 'vi') {
                sl = 'vi';
                tl = 'en';
                try {
                    const r2 = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=en&dt=t&dt=bd&dt=ex&dt=md&dt=ss&dt=at&dj=1&q=${encodeURIComponent(raw)}`);
                    if (r2.ok) gtxRes = await r2.json();
                } catch(e) {}
            }

            const mainTrans = gtxRes?.sentences?.map(s => s.trans).join('') || '';
            const isReverseLookup = sl === 'vi';
            const englishWord = isReverseLookup ? mainTrans.toLowerCase().trim() : raw.toLowerCase();

            // 2. Free Dictionary API
            let freeDictData = null;
            if (englishWord && !englishWord.includes(' ')) {
                try {
                    const fdRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(englishWord)}`);
                    if (fdRes.ok) freeDictData = await fdRes.json();
                } catch(e) {}

                // If not found, check base_form from GTX dict
                if (!freeDictData && gtxRes?.dict?.[0]?.base_form) {
                    const bf = gtxRes.dict[0].base_form;
                    try {
                        const fdRes2 = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(bf)}`);
                        if (fdRes2.ok) freeDictData = await fdRes2.json();
                    } catch(e) {}
                }
            }

            // 3. Datamuse API
            let datamuseWords = [];
            if (englishWord && !englishWord.includes(' ')) {
                try {
                    const dmRes = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(englishWord)}&md=dpf&max=6`);
                    if (dmRes.ok) datamuseWords = await dmRes.json();
                } catch(e) {}
            }

            return {
                query: raw,
                isReverseLookup,
                mainTrans,
                englishWord,
                hasDict: !!(gtxRes?.dict && gtxRes.dict.length > 0),
                dictPos: gtxRes?.dict?.map(d => d.pos),
                hasFreeDict: !!(freeDictData && freeDictData.length > 0),
                ipa: freeDictData?.[0]?.phonetic || freeDictData?.[0]?.phonetics?.find(p=>p.text)?.text || '',
                audio: freeDictData?.[0]?.phonetics?.find(p=>p.audio)?.audio || '',
                datamuseCount: datamuseWords.length
            };
        }

        const out = [];
        for (const q of queries) {
            out.push(await resolveWord(q));
        }
        return out;
    }, testQueries);

    console.log('RESULTS:');
    results.forEach(r => {
        console.log(`[${r.query}] -> ${r.isReverseLookup ? 'VI->EN' : 'EN->VI'}: "${r.mainTrans}" | EN: "${r.englishWord}" | IPA: "${r.ipa}" | Audio: ${!!r.audio} | Dict POS: ${JSON.stringify(r.dictPos)}`);
    });

    await browser.close();
})();
