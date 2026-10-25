const https = require('https');
const fs = require('fs');

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

async function testFetchLessons() {
    const tests = JSON.parse(fs.readFileSync('scripts/parsed_toeic_tests.json', 'utf8'));
    const test1 = tests[0];
    console.log(`Testing fetch for Test 1 lessons (total ${test1.lessons.length})...`);
    
    const results = [];
    const t0 = Date.now();
    for (let i = 0; i < 5; i++) {
        const lesson = test1.lessons[i];
        const fullUrl = 'https://dailydictation.com' + lesson.url;
        const res = await fetchUrl(fullUrl);
        const match = res.data.match(/window\.appGlobals\s*=\s*(\{[\s\S]*?\});/);
        if (match) {
            const globals = JSON.parse(match[1]);
            results.push({
                lessonId: globals.lessonId,
                name: lesson.name,
                topic: lesson.topic,
                parts: globals.challenges.length,
                audioSrc: globals.audioSrc,
                challenges: globals.challenges.map(c => ({
                    id: c.id,
                    pos: c.position,
                    content: c.content,
                    audioSrc: c.audioSrc,
                    timeStart: c.timeStart,
                    timeEnd: c.timeEnd,
                    hint: c.hint,
                    solution: c.solution
                }))
            });
            console.log(`Fetched [${i+1}/5]: ${lesson.name} - ${lesson.topic} (${globals.challenges.length} parts) in ${Date.now() - t0}ms`);
        } else {
            console.log(`Failed to extract appGlobals for ${lesson.url}`);
        }
    }
    console.log('Sample lesson 1 challenges:', results[0].challenges.length);
}

testFetchLessons().catch(console.error);
