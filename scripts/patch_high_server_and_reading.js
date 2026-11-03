const fs = require('fs');

console.log('🚀 Patching server.js and reading workstation for HIGH severity defects...');

// 1. server.js - BUG-060: Bounded JSON body parsing for AI dictionary and vocab generation
let serverCode = fs.readFileSync('server.js', 'utf8');

if (serverCode.includes("req.on('data', chunk => body += chunk);")) {
    serverCode = serverCode.replace(
        /if \(reqPath === '\/api\/dictionary\/ai-generate'\) \{\s*let word = queryParams\.get\('word'\) \|\| '';\s*if \(req\.method === 'POST'\) \{\s*let body = '';\s*req\.on\('data', chunk => body \+= chunk\);\s*req\.on\('end', \(\) => \{\s*try \{\s*const parsed = JSON\.parse\(body\);\s*word = parsed\.word \|\| parsed\.query \|\| word;\s*\} catch\(e\) \{\}\s*const prep = DictionaryPreprocess\.processInput\(word\);\s*generateAITier3DictionaryEntry\(word, prep, \(err, aiEntry\) => \{\s*res\.writeHead\(200, \{\s*'Content-Type': 'application\/json; charset=UTF-8',\s*\.\.\.getCorsHeaders\(req\)\s*\}\);\s*res\.end\(JSON\.stringify\(\{ success: !!aiEntry, data: aiEntry \}\)\);\s*\}\);\s*\}\);\s*return;\s*\}/,
        `if (reqPath === '/api/dictionary/ai-generate') {
    let word = queryParams.get('word') || '';
    if (req.method === 'POST') {
      parseJsonBody(req, res, parsed => {
        word = (parsed && (parsed.word || parsed.query)) || word;
        const prep = DictionaryPreprocess.processInput(word);
        generateAITier3DictionaryEntry(word, prep, (err, aiEntry) => {
          res.writeHead(200, {
            'Content-Type': 'application/json; charset=UTF-8',
            ...getCorsHeaders(req)
          });
          res.end(JSON.stringify({ success: !!aiEntry, data: aiEntry }));
        });
      });
      return;
    }`
    );

    serverCode = serverCode.replace(
        /if \(reqPath === '\/api\/ai\/generate-vocab' && req\.method === 'POST'\) \{\s*let body = '';\s*req\.on\('data', chunk => body \+= chunk\);\s*req\.on\('end', \(\) => \{\s*let payload = \{\};\s*try \{ payload = JSON\.parse\(body\); \} catch\(e\) \{\}/,
        `if (reqPath === '/api/ai/generate-vocab' && req.method === 'POST') {
    parseJsonBody(req, res, payload => {
      payload = payload || {};`
    );
    serverCode = serverCode.replace(
        /res\.end\(JSON\.stringify\(result\)\);\s*\}\);\s*\}\);\s*return;\s*\}\s*\/\/ =========================================================================\s*\/\/ 6\. AUTHENTICATION/m,
        `res.end(JSON.stringify(result));
      });
    });
    return;
  }

  // =========================================================================
  // 6. AUTHENTICATION`
    );

    fs.writeFileSync('server.js', serverCode, 'utf8');
    console.log('✅ server.js patched with bounded parseJsonBody on all AI endpoints (BUG-060)');
}

// 2. Reading Workstation - BUG-033: Responsive mobile padding & visual viewport safe area
function patchReading(filePath) {
    if (fs.existsSync(filePath)) {
        let code = fs.readFileSync(filePath, 'utf8');
        if (!code.includes('pb-[calc(env(safe-area-inset-bottom,0px)+80px)]')) {
            code = code.replace(
                /<div class="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">/g,
                '<div class="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 pb-[calc(env(safe-area-inset-bottom,0px)+80px)] sm:pb-6">'
            );
            fs.writeFileSync(filePath, code, 'utf8');
            console.log(`✅ Patched ${filePath} with safe area padding (BUG-033)`);
        }
    }
}

patchReading('js/toeic-reading-workstation.js');
patchReading('www/js/toeic-reading-workstation.js');

console.log('🏁 High defects patch complete!');
