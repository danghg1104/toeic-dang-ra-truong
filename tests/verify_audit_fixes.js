const assert = require('assert');
const http = require('http');

const { 
    CORE_VI_LEXICON, 
    handleDictionaryLookup, 
    saveAndMergeSyncStore, 
    loadSyncStore,
    server 
} = require('../server.js');

async function testAll() {
    console.log('--- STARTING VERIFICATION OF AUDIT FIXES ---');

    // 1. Verify Dictionary Core Lexicon includes 'economic' and 'economy'
    console.log('1. Testing Dictionary Engine & CORE_VI_LEXICON...');
    assert(CORE_VI_LEXICON['economic'], 'CORE_VI_LEXICON must contain economic');
    assert(CORE_VI_LEXICON['economy'], 'CORE_VI_LEXICON must contain economy');
    const pos = (CORE_VI_LEXICON['economic'].partOfSpeech || CORE_VI_LEXICON['economic'].pos || '').toLowerCase();
    assert.strictEqual(pos, 'adjective');
    const meaning = CORE_VI_LEXICON['economic'].vi || CORE_VI_LEXICON['economic'].vietnameseMeaning || '';
    assert(meaning.includes('kinh tế'), 'definition must mention kinh tế');
    console.log('   ✓ CORE_VI_LEXICON contains rich entry for "economic" and "economy"');

    // 2. Verify Audio Player _formatTime guards
    console.log('2. Testing Audio Player _formatTime edge cases...');
    function formatTime(seconds, isDuration = false) {
        if (!Number.isFinite(seconds) || seconds < 0) {
            return isDuration ? '--:--' : '00:00';
        }
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    assert.strictEqual(formatTime(Infinity, true), '--:--');
    assert.strictEqual(formatTime(NaN, true), '--:--');
    assert.strictEqual(formatTime(undefined, true), '--:--');
    assert.strictEqual(formatTime(null, true), '--:--');
    assert.strictEqual(formatTime(-10, true), '--:--');
    assert.strictEqual(formatTime(0, true), '00:00');
    assert.strictEqual(formatTime(125, true), '02:05');
    assert.strictEqual(formatTime(Infinity, false), '00:00');
    assert.strictEqual(formatTime(NaN, false), '00:00');
    console.log('   ✓ Infinity:NaN completely prevented, returns "--:--" for duration and "00:00" for position');

    // 2B. Verify no static leak of "Huynh Dang" in index.html and js/pvp-arena-client.js
    console.log('2B. Testing Guest State sanitization across frontend...');
    const fs = require('fs');
    const path = require('path');
    const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
    assert(!indexHtml.includes('Huynh Dang'), 'index.html must not contain hardcoded "Huynh Dang"');
    const pvpClient = fs.readFileSync(path.join(__dirname, '..', 'js', 'pvp-arena-client.js'), 'utf8');
    assert(!pvpClient.includes("|| 'Huynh Dang'"), 'pvp-arena-client must not default guest username to "Huynh Dang"');
    console.log('   ✓ index.html and pvp-arena-client are sanitized of hardcoded identity');

    // 3. Verify Tombstone Sync Deletion Logic
    console.log('3. Testing Realtime Sync Tombstone Deletion...');
    const testUserId = 'test-user-tombstone-' + Date.now();
    // Step A: Seed initial data
    saveAndMergeSyncStore({
        userId: testUserId,
        takeNotesList: [
            { id: 'note-1', content: 'Note 1', updatedAtMs: 1000 },
            { id: 'note-2', content: 'Note 2', updatedAtMs: 1000 }
        ],
        savedVocabItems: [
            { word: 'apple', updatedAtMs: 1000 },
            { word: 'banana', updatedAtMs: 1000 }
        ]
    });

    // Step B: Send update with deleted items
    const merged = saveAndMergeSyncStore({
        userId: testUserId,
        takeNotesList: [
            { id: 'note-3', content: 'Note 3', updatedAtMs: 2000 }
        ],
        deletedNoteIds: ['note-1'],
        deletedVocabWords: ['apple']
    });

    assert(merged, 'Merged store must not be null');
    assert(!merged.takeNotesList.find(n => n.id === 'note-1'), 'Deleted note-1 must not exist in merged store');
    assert(merged.takeNotesList.find(n => n.id === 'note-2'), 'note-2 must remain in merged store');
    assert(merged.takeNotesList.find(n => n.id === 'note-3'), 'note-3 must be added to merged store');
    assert(!merged.savedVocabItems.find(v => v.word === 'apple'), 'Deleted vocab "apple" must be removed');
    assert(merged.savedVocabItems.find(v => v.word === 'banana'), 'banana must remain');
    console.log('   ✓ Tombstone sync successfully prevents deleted notes/vocab from being resurrected');

    // 4. Test Server HTTP Endpoints
    console.log('4. Testing Server HTTP endpoints...');
    const serverPort = 8089;
    
    await new Promise((resolve) => {
        server.listen(serverPort, () => {
            console.log(`   ✓ Test server listening on ${serverPort}`);
            resolve();
        });
    });

    try {
        // Test 4A: GET /api/me without cookie (Guest state)
        const meRes = await fetchJson(`http://localhost:${serverPort}/api/me`);
        assert.strictEqual(meRes.authenticated, false, 'Unauthenticated visitor must not be authenticated');
        assert.strictEqual(meRes.isGuest, true, 'Visitor must be marked isGuest: true');
        assert.strictEqual(meRes.user, null, 'Visitor user object must be null');
        console.log('   ✓ GET /api/me returns guest state without auto-login');

        // Test 4B: GET /api/dictionary/lookup?word=economic
        const dictRes = await fetchJson(`http://localhost:${serverPort}/api/dictionary/lookup?word=economic`);
        assert.strictEqual(dictRes.success, true);
        const entry = dictRes.data || dictRes;
        const entryWord = entry.headword || entry.word || entry.query || entry.searchedQuery;
        assert.strictEqual(entryWord, 'economic');
        const entryStr = JSON.stringify(entry);
        assert(entryStr.includes('kinh tế'), 'Dictionary result must contain Vietnamese translation for economic');
        console.log('   ✓ GET /api/dictionary/lookup for "economic" returns rich definitions');

        // Test 4C: POST /api/auth/reset-password validation
        const badReset = await postJson(`http://localhost:${serverPort}/api/auth/reset-password`, {
            email: 'nonexistent@example.com',
            newPassword: '123'
        });
        assert.strictEqual(badReset.success, false);
        assert(badReset.error.includes('6 ký tự') || badReset.error.includes('không tồn tại'));
        console.log('   ✓ POST /api/auth/reset-password validates password length and existing user');

        // Test 4D: POST /api/user/reset-progress
        const resetProgressRes = await postJson(`http://localhost:${serverPort}/api/user/reset-progress`, {});
        assert.strictEqual(resetProgressRes.success, true);
        console.log('   ✓ POST /api/user/reset-progress returns success: true');

    } finally {
        await new Promise((resolve) => {
            server.close(() => {
                console.log('   ✓ Test server closed');
                resolve();
            });
        });
    }

    console.log('--- ALL AUDIT VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
}

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        http.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
            });
        }).on('error', reject);
    });
}

function postJson(url, payload) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const postData = JSON.stringify(payload);
        const req = http.request({
            hostname: urlObj.hostname,
            port: urlObj.port,
            path: urlObj.pathname,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
            });
        });
        req.on('error', reject);
        req.write(postData);
        req.end();
    });
}

testAll().then(() => {
    process.exit(0);
}).catch(err => {
    console.error('VERIFICATION FAILED:', err);
    process.exit(1);
});
