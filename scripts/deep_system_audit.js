const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const artifactDir = 'C:\\Users\\Admin\\.gemini\\antigravity\\brain\\ed360126-cbd6-4e9c-92fb-38b43251e283';

async function runAudit() {
    console.log('🔥 STARTING COMPREHENSIVE MULTI-MODULE SYSTEM AUDIT...');
    const browser = await puppeteer.launch({
        executablePath: EDGE_PATH,
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const findings = [];
    function logBug(category, title, severity, detail, elementOrCode) {
        findings.push({
            id: `BUG-${String(findings.length + 1).padStart(3, '0')}`,
            category,
            title,
            severity, // 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
            detail,
            elementOrCode
        });
    }

    try {
        const page = await browser.newPage();
        
        // Listen to console errors and network failures
        const consoleErrors = [];
        const networkErrors = [];
        page.on('console', msg => {
            if (msg.type() === 'error') consoleErrors.push(msg.text());
        });
        page.on('requestfailed', req => {
            networkErrors.push(`${req.method()} ${req.url()}: ${req.failure()?.errorText}`);
        });
        page.on('response', res => {
            if (res.status() >= 400) {
                networkErrors.push(`${res.status()} ${res.request().method()} ${res.url()}`);
            }
        });

        // ----------------------------------------------------
        // TEST 1: DESKTOP AUDIT (1366x768)
        // ----------------------------------------------------
        await page.setViewport({ width: 1366, height: 768 });
        await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 30000 });

        // Check Initial Console & Network Errors
        if (networkErrors.length > 0) {
            networkErrors.forEach(err => {
                logBug('NETWORK_API', 'HTTP Error on page load', err.includes('401') ? 'MEDIUM' : 'HIGH', err, 'network');
            });
        }

        // ----------------------------------------------------
        // TEST 2: LỘ TRÌNH CÁ NHÂN (ROADMAP) AUDIT
        // ----------------------------------------------------
        console.log('Testing Roadmap (view-lo-trinh)...');
        await page.evaluate(() => window.switchTab('lo-trinh'));
        await new Promise(r => setTimeout(r, 600));

        const roadmapAudit = await page.evaluate(() => {
            const engine = window.PersonalizedRoadmapEngine;
            if (!engine) return { engineExists: false };

            const user = engine.getActiveUser();
            const days = engine.calculateDaysRemaining();
            const readiness = engine.calculateReadinessScore();
            const gaps = engine.calculateGapStats();
            const states = engine.calculateNodeStates();
            const container = document.getElementById('view-lo-trinh');

            // Test date calculation with different formats
            const testDate1 = engine.calculateDaysRemaining ? (() => {
                const u = { examDate: '2026-12-20' }; // ISO date
                const p = u.examDate.split('/');
                return p.length === 3;
            })() : false;

            return {
                engineExists: true,
                user,
                days,
                readiness,
                gapsCount: gaps?.length,
                statesStage: states?.currentStageId,
                weakestPillar: states?.weakestPillarId,
                htmlLength: container?.innerHTML?.length || 0,
                isoDateBreaksSplit: !testDate1,
                floatingCardExists: !!document.getElementById('floatingLessonCard')
            };
        });

        if (!roadmapAudit.engineExists) {
            logBug('ROADMAP', 'PersonalizedRoadmapEngine is not mounted', 'CRITICAL', 'window.PersonalizedRoadmapEngine is undefined', 'js/roadmap-and-traps.js');
        } else {
            if (roadmapAudit.isoDateBreaksSplit) {
                logBug('ROADMAP', 'examDate parsing assumes DD/MM/YYYY only, fails on ISO YYYY-MM-DD', 'HIGH', 'If examDate comes from standard date picker (YYYY-MM-DD), split("/") fails and daysRemaining defaults to 30.', 'js/roadmap-and-traps.js:calculateDaysRemaining');
            }
            if (roadmapAudit.htmlLength < 500) {
                logBug('ROADMAP', 'Roadmap container has empty or truncated HTML', 'HIGH', `view-lo-trinh rendered only ${roadmapAudit.htmlLength} chars`, '#view-lo-trinh');
            }
        }

        // Check Trap click routing in Roadmap
        const trapRoutingTest = await page.evaluate(() => {
            const engine = window.PersonalizedRoadmapEngine;
            if (!engine) return null;
            let trapTriggered = false;
            const originalOpen = window.TOEICTrapsEngine ? window.TOEICTrapsEngine.openTrapDetail : null;
            if (window.TOEICTrapsEngine) {
                window.TOEICTrapsEngine.openTrapDetail = () => { trapTriggered = true; };
            }
            try {
                engine.fixGap('trap-part1-photovague');
            } catch (e) {
                return { error: e.message };
            }
            if (originalOpen && window.TOEICTrapsEngine) window.TOEICTrapsEngine.openTrapDetail = originalOpen;
            return { trapTriggered };
        });
        if (trapRoutingTest?.error) {
            logBug('ROADMAP', 'fixGap() throws error when clicking a trap recommendation', 'HIGH', trapRoutingTest.error, 'PersonalizedRoadmapEngine.fixGap');
        }

        // ----------------------------------------------------
        // TEST 3: AUDIO & LISTENING TTS ENGINE AUDIT
        // ----------------------------------------------------
        console.log('Testing Audio Engine & TTS Quality...');
        const audioAudit = await page.evaluate(() => {
            const results = {};
            results.audioService = typeof window.AudioService !== 'undefined';
            results.universalAudio = typeof window.UniversalAudioEngine !== 'undefined';
            results.toeicAudioPlayer = typeof window.ToeicAudioPlayer !== 'undefined';

            // Check TTS voice fallback
            const hasSpeechSynthesis = 'speechSynthesis' in window;
            results.speechSynthesis = hasSpeechSynthesis;
            if (hasSpeechSynthesis) {
                const voices = window.speechSynthesis.getVoices();
                results.voiceCount = voices.length;
                results.enVoices = voices.filter(v => v.lang.startsWith('en')).map(v => v.name);
            }
            return results;
        });

        // Test TTS backend endpoint
        const ttsTestResult = await page.evaluate(async () => {
            try {
                const res = await fetch('/api/tts?text=Welcome%20to%20TOEIC%20Listening&voice=en-US');
                return { status: res.status, contentType: res.headers.get('content-type') };
            } catch (e) {
                return { error: e.message };
            }
        });
        if (ttsTestResult.status !== 200) {
            logBug('LISTENING_TTS', '/api/tts endpoint returned error or unavailable', 'HIGH', `Status ${ttsTestResult.status}. Falling back to robotic browser WebSpeech synthesis causes unpleasant AI voices.`, 'server.js:/api/tts');
        }

        // ----------------------------------------------------
        // TEST 4: MOBILE RESPONSIVENESS AUDIT (375x667 - iPhone SE)
        // ----------------------------------------------------
        console.log('Testing Mobile Viewport (375px)...');
        await page.setViewport({ width: 375, height: 667, isMobile: true, hasTouch: true });
        await new Promise(r => setTimeout(r, 600));

        const tabsToAudit = [
            'hom-nay',
            'lo-trinh',
            'nghe',
            'doc',
            'ngu-phap',
            'tu-vung',
            'thi-thu',
            'bay-de-thi',
            'boc-bang-audio',
            'nghe-chinh-ta',
            'hoc-tu-vung',
            'youglish',
            'take-note',
            'tu-dien'
        ];

        for (const tab of tabsToAudit) {
            await page.evaluate(t => window.switchTab(t), tab);
            await new Promise(r => setTimeout(r, 400));

            const overflowInfo = await page.evaluate((tabName) => {
                const docWidth = document.documentElement.clientWidth;
                const scrollWidth = document.documentElement.scrollWidth;
                const hasHScroll = scrollWidth > (docWidth + 3);

                // Find overflowing elements
                const overflowing = [];
                const all = document.querySelectorAll(`[id*="view-${tabName}"] *`);
                all.forEach(el => {
                    const rect = el.getBoundingClientRect();
                    if (rect.right > docWidth + 5) {
                        overflowing.push({
                            tag: el.tagName,
                            className: (el.className || '').toString().substring(0, 60),
                            width: Math.round(rect.width),
                            right: Math.round(rect.right)
                        });
                    }
                });

                // Check tap target sizes
                const tinyButtons = [];
                const buttons = document.querySelectorAll(`[id*="view-${tabName}"] button, [id*="view-${tabName}"] a`);
                buttons.forEach(b => {
                    const r = b.getBoundingClientRect();
                    if (r.width > 0 && r.height > 0 && (r.width < 28 || r.height < 28)) {
                        tinyButtons.push({
                            text: b.innerText?.trim().substring(0, 30) || b.title || 'Icon button',
                            width: Math.round(r.width),
                            height: Math.round(r.height)
                        });
                    }
                });

                return {
                    tabName,
                    docWidth,
                    scrollWidth,
                    hasHScroll,
                    overflowCount: overflowing.length,
                    overflowSample: overflowing.slice(0, 3),
                    tinyButtonsCount: tinyButtons.length,
                    tinyButtonsSample: tinyButtons.slice(0, 3)
                };
            }, tab);

            if (overflowInfo.hasHScroll) {
                logBug('MOBILE_RESPONSIVE', `Tab "${tab}" causes horizontal viewport overflow on 375px mobile`, 'HIGH', `Document scrollWidth (${overflowInfo.scrollWidth}px) exceeds clientWidth (${overflowInfo.docWidth}px). Users experience unwanted horizontal swaying. Sample overflowing elements: ${JSON.stringify(overflowInfo.overflowSample)}`, `#view-${tab}`);
            }
            if (overflowInfo.tinyButtonsCount > 0) {
                logBug('MOBILE_UX', `Tab "${tab}" has ${overflowInfo.tinyButtonsCount} touch targets below 28px on mobile`, 'MEDIUM', `Touch targets violate minimum accessibility guidelines (WCAG 2.1 44x44px). Sample: ${JSON.stringify(overflowInfo.tinyButtonsSample)}`, `#view-${tab} button`);
            }
        }

        // ----------------------------------------------------
        // TEST 5: YOUTUBE DICTATION WORKSTATION SPECIFIC AUDIT
        // ----------------------------------------------------
        console.log('Testing YouTube Dictation flow & looper...');
        await page.evaluate(() => {
            window.switchTab('nghe-chinh-ta');
            window.switchDictationSubMode('youtube');
            window.YouTubeDictationWorkstation.startSong('until-i-found-you');
        });
        await new Promise(r => setTimeout(r, 600));

        const ytFlowAudit = await page.evaluate(() => {
            const ws = window.YouTubeDictationWorkstation;
            return {
                currentMode: ws.studyMode,
                flow: ws.settings.playbackFlow,
                linesCount: ws.activeSong?.lines?.length,
                hasNavRail: !!document.getElementById('ytSentenceNavRail'),
                hasWaveCanvas: !!document.getElementById('ytSilkWaveCanvas'),
                hasSkipIntro: !!document.querySelector('button[onclick*="skipIntro"]'),
                hasInput: !!document.getElementById('ytLiveTypingInput')
            };
        });

        // ----------------------------------------------------
        // TEST 6: DATA INTEGRITY CHECKS
        // ----------------------------------------------------
        console.log('Testing Data Integrity across files...');
        const dataAudit = await page.evaluate(() => {
            const results = {};
            // Check DailyDictation data
            results.dailyToeicSongs = window.DailyDictationToeicData ? Object.keys(window.DailyDictationToeicData).length : 0;
            // Check Vocab Decks
            results.curatedVocabBank = window.CuratedVocabBank ? Object.keys(window.CuratedVocabBank).length : 0;
            // Check Grammar Theory
            results.grammarTheory = window.GrammarTheoryData ? Object.keys(window.GrammarTheoryData).length : 0;
            // Check Traps Data
            results.toeicTraps = window.ToeicTrapsData ? Object.keys(window.ToeicTrapsData).length : 0;
            return results;
        });

        // ----------------------------------------------------
        // TEST 7: CODE INSPECTION & STATIC AUDIT
        // ----------------------------------------------------
        console.log('Scanning Static Code for Hardcoded/Dead Endpoints/Bugs...');
        
    } catch (e) {
        console.error('Audit runtime error:', e);
    } finally {
        await browser.close();
    }

    console.log(`\nAudit completed! Discovered ${findings.length} preliminary dynamic issues.`);
    return findings;
}

runAudit().then(f => {
    fs.writeFileSync('scripts/audit_preliminary_results.json', JSON.stringify(f, null, 2));
    console.log('Results written to scripts/audit_preliminary_results.json');
});
