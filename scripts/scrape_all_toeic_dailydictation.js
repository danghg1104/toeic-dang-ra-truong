const https = require('https');
const fs = require('fs');
const path = require('path');

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function fetchUrl(url, retries = 5, backoff = 2000) {
    return new Promise((resolve, reject) => {
        const u = new URL(url);
        const options = {
            hostname: u.hostname,
            path: u.pathname + u.search,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Referer': 'https://dailydictation.com/exercises/toeic',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9'
            },
            timeout: 15000
        };

        const req = https.get(options, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                let redirectUrl = res.headers.location;
                if (!redirectUrl.startsWith('http')) {
                    redirectUrl = 'https://' + u.hostname + redirectUrl;
                }
                return resolve(fetchUrl(redirectUrl, retries, backoff));
            }
            if (res.statusCode === 429) {
                if (retries > 0) {
                    console.log(`\n⏳ Rate limit (429) on ${url}. Sleeping ${backoff}ms before retry...`);
                    return sleep(backoff).then(() => resolve(fetchUrl(url, retries - 1, backoff * 1.5)));
                }
                return reject(new Error(`HTTP 429 (Rate Limit) exceeded on ${url}`));
            }
            if (res.statusCode !== 200) {
                if (retries > 0) {
                    return sleep(1000).then(() => resolve(fetchUrl(url, retries - 1, backoff)));
                }
                return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(data));
        });

        req.on('timeout', () => {
            req.destroy();
            if (retries > 0) {
                sleep(1000).then(() => resolve(fetchUrl(url, retries - 1, backoff)));
            } else {
                reject(new Error(`Timeout fetching ${url}`));
            }
        });

        req.on('error', (err) => {
            if (retries > 0) {
                sleep(1000).then(() => resolve(fetchUrl(url, retries - 1, backoff)));
            } else {
                reject(err);
            }
        });
    });
}

async function scrapeSingleTest(testObj, outDir) {
    const testFile = path.join(outDir, `test_${String(testObj.testNum).padStart(2, '0')}.json`);
    
    // Check if already completely scraped
    let existingLessons = [];
    if (fs.existsSync(testFile)) {
        try {
            const existing = JSON.parse(fs.readFileSync(testFile, 'utf8'));
            if (existing.lessons && existing.lessons.length === testObj.lessons.length) {
                console.log(`⚡ Practice Test ${testObj.testNum} already 100% cached (${existing.lessons.length}/20 lessons).`);
                return existing;
            }
            if (existing.lessons) {
                existingLessons = existing.lessons;
            }
        } catch (e) {}
    }

    console.log(`\n📥 Scraping Practice Test ${testObj.testNum} (${testObj.lessons.length} lessons, cached: ${existingLessons.length})...`);
    const lessonsData = [...existingLessons];
    const existingSlugs = new Set(existingLessons.map(l => l.slug));

    for (let i = 0; i < testObj.lessons.length; i++) {
        const item = testObj.lessons[i];
        if (existingSlugs.has(item.slug)) {
            process.stdout.write(`s`);
            continue;
        }

        const fullUrl = 'https://dailydictation.com' + item.url;
        let success = false;

        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                const html = await fetchUrl(fullUrl);
                const match = html.match(/window\.appGlobals\s*=\s*(\{[\s\S]*?\});/);
                if (match) {
                    const globals = JSON.parse(match[1]);
                    lessonsData.push({
                        lessonId: globals.lessonId,
                        slug: item.slug,
                        name: item.name,
                        topic: item.topic,
                        vocabLevel: item.vocabLevel,
                        partsCount: globals.challenges ? globals.challenges.length : item.parts,
                        audioSrc: globals.audioSrc,
                        challenges: (globals.challenges || []).map(c => ({
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
                    success = true;
                    break;
                }
            } catch (err) {
                console.error(`\nAttempt ${attempt+1} failed for ${item.name}: ${err.message}`);
                await sleep(2000);
            }
        }

        if (!success) {
            console.error(`\n❌ Failed to scrape lesson: ${item.name} (${item.url})`);
        }
        // Polite delay to avoid 429
        await sleep(400);
    }

    const result = {
        testNum: testObj.testNum,
        title: testObj.title,
        lessonCount: lessonsData.length,
        lessons: lessonsData
    };

    fs.writeFileSync(testFile, JSON.stringify(result, null, 2));
    console.log(`\n✅ Saved Practice Test ${testObj.testNum}: ${lessonsData.length} lessons.`);
    return result;
}

async function main() {
    console.log('🚀 Starting Full TOEIC DailyDictation Resilient Scraper...');
    const tests = JSON.parse(fs.readFileSync('scripts/parsed_toeic_tests.json', 'utf8'));
    const outDir = path.join(__dirname, '../data/dailydictation');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

    const allTests = [];
    const startTime = Date.now();

    for (let i = 0; i < tests.length; i++) {
        const testData = await scrapeSingleTest(tests[i], outDir);
        allTests.push(testData);
    }

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    console.log(`\n🎉 All ${allTests.length} Practice Tests ready in ${elapsed}s!`);

    // Compile into master summary
    const summary = allTests.map(t => ({
        testNum: t.testNum,
        title: t.title,
        lessonCount: t.lessons.length,
        lessons: t.lessons.map(l => ({
            lessonId: l.lessonId,
            slug: l.slug,
            name: l.name,
            topic: l.topic,
            vocabLevel: l.vocabLevel,
            partsCount: l.partsCount,
            audioSrc: l.audioSrc
        }))
    }));
    fs.writeFileSync(path.join(outDir, 'toeic_summary.json'), JSON.stringify(summary, null, 2));

    // Compile client-side database js/dailydictation-toeic-data.js
    console.log('📦 Compiling client-side database js/dailydictation-toeic-data.js ...');

    const jsContent = `/**
 * DAILYDICTATION TOEIC LISTENING COMPREHENSIVE DATABASE
 * Nguồn chính thức: https://dailydictation.com/exercises/toeic
 * Bản quyền audio: BestMyTest & ETS
 * Bao gồm 30 Practice Tests (600 Bài học Conversation & Short Talk)
 * Đa giọng chuẩn bản xứ: Mỹ (US), Anh (UK), Úc (AU), Canada (CA).
 */
(function(window) {
    'use strict';

    const TOEIC_DICTATION_SUMMARY = ${JSON.stringify(summary, null, 2)};
    
    // Cache bài học chi tiết theo testNum: { [testNum]: testData }
    const testDetailsCache = {};

    window.DailyDictationDatabase = {
        summary: TOEIC_DICTATION_SUMMARY,
        testsCache: testDetailsCache,

        getSummary() {
            return TOEIC_DICTATION_SUMMARY;
        },

        getTestSummary(testNum) {
            return TOEIC_DICTATION_SUMMARY.find(t => t.testNum === testNum);
        },

        async loadTest(testNum) {
            const num = parseInt(testNum, 10);
            if (testDetailsCache[num]) {
                return testDetailsCache[num];
            }
            try {
                const padNum = String(num).padStart(2, '0');
                const resp = await fetch('data/dailydictation/test_' + padNum + '.json?v=' + Date.now());
                if (!resp.ok) throw new Error('Failed to fetch test ' + padNum);
                const data = await resp.json();
                testDetailsCache[num] = data;
                return data;
            } catch (err) {
                console.error('DailyDictationDatabase.loadTest error:', err);
                return null;
            }
        },

        async getLesson(testNum, lessonIndexOrSlug) {
            const test = await this.loadTest(testNum);
            if (!test || !test.lessons) return null;
            if (typeof lessonIndexOrSlug === 'number' && lessonIndexOrSlug < test.lessons.length) {
                return test.lessons[lessonIndexOrSlug];
            }
            return test.lessons.find(l => l.slug === lessonIndexOrSlug || l.lessonId === lessonIndexOrSlug) || test.lessons[0];
        }
    };

})(typeof window !== 'undefined' ? window : global);
`;

    fs.writeFileSync(path.join(__dirname, '../js/dailydictation-toeic-data.js'), jsContent);
    console.log('✅ Created js/dailydictation-toeic-data.js successfully!');
}

main().catch(console.error);
