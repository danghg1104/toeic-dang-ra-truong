const https = require('https');
const fs = require('fs');
const path = require('path');

function fetchUrl(url) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const options = {
            hostname: u.hostname,
            path: u.pathname + u.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Referer': 'https://dailydictation.com/exercises/toeic'
            }
        };

        https.get(options, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                let redirectUrl = res.headers.location;
                if (!redirectUrl.startsWith('http')) {
                    redirectUrl = 'https://' + u.hostname + redirectUrl;
                }
                return resolve(fetchUrl(redirectUrl));
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, data }));
        }).on('error', reject);
    });
}

async function scrapeTest(testObj) {
    const lessonsData = [];
    console.log(`Scraping ${testObj.title} (${testObj.lessons.length} lessons)...`);

    for (let i = 0; i < testObj.lessons.length; i++) {
        const item = testObj.lessons[i];
        const fullUrl = 'https://dailydictation.com' + item.url;
        try {
            const res = await fetchUrl(fullUrl);
            const match = res.data.match(/window\.appGlobals\s*=\s*(\{[\s\S]*?\});/);
            if (match) {
                const globals = JSON.parse(match[1]);
                lessonsData.push({
                    lessonId: globals.lessonId,
                    slug: item.slug,
                    name: item.name,
                    topic: item.topic,
                    vocabLevel: item.vocabLevel,
                    partsCount: globals.challenges.length,
                    audioSrc: globals.audioSrc,
                    challenges: globals.challenges.map(c => ({
                        id: c.id,
                        pos: c.position,
                        content: c.content,
                        audioSrc: c.audioSrc,
                        timeStart: c.timeStart,
                        timeEnd: c.timeEnd,
                        hint: c.hint || (c.hints && c.hints.length ? c.hints[0] : null),
                        solution: c.solution,
                        jsonContent: c.jsonContent
                    }))
                });
                process.stdout.write(`.`);
            } else {
                console.error(`\nFailed globals for: ${item.url}`);
            }
        } catch (err) {
            console.error(`\nError fetching ${item.url}:`, err.message);
        }
        // Small gentle delay
        await new Promise(r => setTimeout(r, 60));
    }
    console.log(`\nCompleted ${testObj.title}: ${lessonsData.length} lessons extracted.`);
    return {
        testNum: testObj.testNum,
        title: testObj.title,
        lessons: lessonsData
    };
}

async function main() {
    const tests = JSON.parse(fs.readFileSync('scripts/parsed_toeic_tests.json', 'utf8'));
    const outDir = path.join(__dirname, '../data/dailydictation');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    // Scrape Test 1
    const t1Data = await scrapeTest(tests[0]);
    fs.writeFileSync(path.join(outDir, 'test_1.json'), JSON.stringify(t1Data, null, 2));
    console.log('Saved test_1.json successfully!');
}

main().catch(console.error);
