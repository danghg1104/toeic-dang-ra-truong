const fs = require('fs');

// 1. Fix lib/pvp-arena-server.js
let pvp = fs.readFileSync('lib/pvp-arena-server.js', 'utf8');

// A. Sanitize responseTimeMs
const oldSpeedBonus = `            const comboMultiplier = player.combo >= 5 ? 1.5 : (player.combo >= 3 ? 1.2 : 1.0);
            const speedBonus = Math.max(0, Math.round(50 - (responseTimeMs / 200)));
            player.score += Math.round((100 + speedBonus) * comboMultiplier);`;

const newSpeedBonus = `            const comboMultiplier = player.combo >= 5 ? 1.5 : (player.combo >= 3 ? 1.2 : 1.0);
            const safeResponseTime = (typeof responseTimeMs === 'number' && !isNaN(responseTimeMs))
                ? Math.max(0, Math.min(10000, responseTimeMs))
                : 1500;
            const speedBonus = Math.max(0, Math.round(50 - (safeResponseTime / 200)));
            player.score += Math.round((100 + speedBonus) * comboMultiplier);`;

if (pvp.includes(oldSpeedBonus)) {
    pvp = pvp.replace(oldSpeedBonus, newSpeedBonus);
    console.log('✅ Updated responseTimeMs sanitization in lib/pvp-arena-server.js');
} else {
    console.warn('⚠️ Could not find exact oldSpeedBonus pattern in lib/pvp-arena-server.js');
}

// B. Fix duplicate MATCH_END on forfeit
const oldGraceBlock = `            // Nếu sau 5 giây không kết nối lại -> Đối thủ thắng mặc định (F22.B2)
            match.disconnectGraceTimer = setTimeout(() => {
                if (this.activeMatches.has(matchId)) {
                    if (remaining.ws) {
                        this.sendSafe(remaining.ws, {
                            type: 'MATCH_END',
                            reason: 'OPPONENT_DISCONNECTED',
                            result: 'VICTORY',
                            winner: 'YOU',
                            myScore: remaining.score,
                            opponentScore: leaver.score,
                            rankDelta: 25,
                            xpEarned: 50
                        });
                    }
                    this.endMatch(matchId, 'OPPONENT_DISCONNECTED');
                }
            }, 5000);`;

const newGraceBlock = `            // Nếu sau 5 giây không kết nối lại -> Đối thủ thắng mặc định (F22.B2)
            match.disconnectGraceTimer = setTimeout(() => {
                if (this.activeMatches.has(matchId)) {
                    if (remaining.ws) {
                        this.sendSafe(remaining.ws, {
                            type: 'MATCH_END',
                            reason: 'OPPONENT_DISCONNECTED',
                            result: 'VICTORY',
                            winner: 'YOU',
                            myScore: remaining.score,
                            opponentScore: leaver.score,
                            rankDelta: 25,
                            xpEarned: 50
                        });
                        remaining.ws.currentMatchId = null;
                    }
                    clearInterval(match.timer);
                    if (match.botTimeout) clearTimeout(match.botTimeout);
                    this.activeMatches.delete(matchId);
                }
            }, 5000);`;

if (pvp.includes(oldGraceBlock)) {
    pvp = pvp.replace(oldGraceBlock, newGraceBlock);
    console.log('✅ Fixed duplicate MATCH_END forfeit in lib/pvp-arena-server.js');
} else {
    console.warn('⚠️ Could not find exact oldGraceBlock pattern in lib/pvp-arena-server.js');
}

fs.writeFileSync('lib/pvp-arena-server.js', pvp, 'utf8');
if (fs.existsSync('www/lib/pvp-arena-server.js')) {
    fs.writeFileSync('www/lib/pvp-arena-server.js', pvp, 'utf8');
}

// 2. Fix lib/ai-explanation-engine.js
let ai = fs.readFileSync('lib/ai-explanation-engine.js', 'utf8');

// Insert TRAP_TENSE_EXP if not present
if (!ai.includes('const TRAP_TENSE_EXP')) {
    const insertPos = ai.indexOf('const OFFLINE_TRAP_EXPLANATIONS = {');
    const tenseDef = `const TRAP_TENSE_EXP = (q, ua, ca) =>
\`1. 🎭 TIẾNG LÒNG SINH VIÊN: Thấy trạng từ thời gian là vội vàng chọn thì trong quá khứ hoặc hiện tại theo quán tính mà quên xét sự hòa hợp chủ vị!
2. 🕳️ BÓC MẼ BẪY ETS: Bẫy chia thì động từ (Verb Tense & Agreement Trap). ETS lồng ghép trạng từ gây nhiễu để đánh lừa thì của câu hoặc chia sai số ít/số nhiều.
3. 🎯 VÌ SAO ĐÚNG: Động từ "\${ca || 'has completed'}" chia đúng thì và hòa hợp hoàn hảo với chủ ngữ của mệnh đề chính.
4. ⚡ MẸO 3 GIÂY: Xác định chủ ngữ chính và mốc thời gian trước khi chọn dạng chia động từ!\`;\n\n`;
    ai = ai.slice(0, insertPos) + tenseDef + ai.slice(insertPos);
    console.log('✅ Added TRAP_TENSE_EXP definition in lib/ai-explanation-engine.js');
}

// Update OFFLINE_TRAP_EXPLANATIONS with missing aliases
const oldTrapMap = `    // TRAP-03
    'TRAP-03': TRAP_03_EXP,
    'P12-SOUND': TRAP_03_EXP,
    'trap-part2-same-sound': TRAP_03_EXP,`;

const newTrapMap = `    // TRAP-03
    'TRAP-03': TRAP_03_EXP,
    'P12-SOUND': TRAP_03_EXP,
    'P2-HOMOPHONE': TRAP_03_EXP,
    'P2-OVERLAP': TRAP_03_EXP,
    'trap-part2-same-sound': TRAP_03_EXP,`;

const oldTrap06 = `    // TRAP-06
    'TRAP-06': TRAP_06_EXP,
    'P3-REVERSAL': TRAP_06_EXP,
    'trap-part3-last-minute-change': TRAP_06_EXP,
    'trap-part3-distractor-swap': TRAP_06_EXP,`;

const newTrap06 = `    // TRAP-06
    'TRAP-06': TRAP_06_EXP,
    'P3-REVERSAL': TRAP_06_EXP,
    'P34-REVERSAL': TRAP_06_EXP,
    'P34-DISTRACTOR': TRAP_06_EXP,
    'trap-part3-last-minute-change': TRAP_06_EXP,
    'trap-part3-distractor-swap': TRAP_06_EXP,`;

const oldTrap09 = `    // TRAP-09
    'TRAP-09': TRAP_09_EXP,
    'P5-POS': TRAP_09_EXP,
    'trap-part5-word-form': TRAP_09_EXP,
    'trap-part5-confusing-vocab': TRAP_09_EXP,`;

const newTrap09 = `    // TRAP-09
    'TRAP-09': TRAP_09_EXP,
    'P5-POS': TRAP_09_EXP,
    'P5-WORDFORM': TRAP_09_EXP,
    'P5-TENSE': TRAP_TENSE_EXP,
    'trap-part5-word-form': TRAP_09_EXP,
    'trap-part5-confusing-vocab': TRAP_09_EXP,`;

ai = ai.replace(oldTrapMap, newTrapMap)
       .replace(oldTrap06, newTrap06)
       .replace(oldTrap09, newTrap09);

fs.writeFileSync('lib/ai-explanation-engine.js', ai, 'utf8');
if (fs.existsSync('www/lib/ai-explanation-engine.js')) {
    fs.writeFileSync('www/lib/ai-explanation-engine.js', ai, 'utf8');
}
console.log('✅ Updated OFFLINE_TRAP_EXPLANATIONS aliases in lib/ai-explanation-engine.js');
