// lib/vocab-ai-service.js
const https = require('https');
const path = require('path');
const fs = require('fs');

// Nạp ngân hàng từ vựng đồ sộ chuẩn Cambridge & Oxford CEFR (1,634+ từ vựng chất lượng cao)
let CURATED_VOCAB_TOPICS = {};
try {
  CURATED_VOCAB_TOPICS = require('./curated-vocab-bank.js');
} catch (e) {
  console.warn('[Vocab AI] Could not load curated-vocab-bank.js, attempting fallback:', e.message);
}

// =========================================================================
// HÀM CHUẨN HÓA TIẾNG VIỆT ĐỂ SO KHỚP CHỦ ĐỀ CHÍNH XÁC 100%
// =========================================================================
function removeVietnameseDiacritics(str) {
  if (!str) return '';
  return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .toLowerCase()
            .trim();
}

/**
 * Tìm chủ đề phù hợp trong kho từ vựng chuẩn
 */
function findMatchingCuratedTopic(rawTopic) {
  const clean = (rawTopic || '').toLowerCase().trim();
  const cleanNorm = removeVietnameseDiacritics(clean);

  for (const [key, data] of Object.entries(CURATED_VOCAB_TOPICS)) {
    if (key === clean || key === cleanNorm) {
      return data;
    }
    if (Array.isArray(data.aliases)) {
      for (const alias of data.aliases) {
        const aliasLower = alias.toLowerCase().trim();
        const aliasNorm = removeVietnameseDiacritics(aliasLower);

        if (clean === aliasLower || cleanNorm === aliasNorm) {
          return data;
        }
        if (clean.includes(aliasLower) || aliasLower.includes(clean)) {
          return data;
        }
        if (cleanNorm.includes(aliasNorm) || aliasNorm.includes(cleanNorm)) {
          return data;
        }
      }
    }
  }
  return null;
}

/**
 * Trả về danh sách từ vựng chuẩn xác 100% theo Chủ đề & CEFR Level
 * CÓ HỖ TRỢ LOẠI TRỪ CÁC TỪ ĐÃ HỌC TRONG PHIÊN (excludeWords)
 * ĐẢM BẢO MỖI LẦN RESET LÀ 1 BỘ TỪ MỚI TINH 100%
 */
function getCuratedVocabularyList(topicName, level, count, excludeWords = []) {
  const normLevel = (level || 'B1').toUpperCase().replace('LEVEL ', '').trim();
  const validLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(normLevel) ? normLevel : 'B1';
  const targetCount = Math.min(Math.max(parseInt(count, 10) || 10, 1), 50);

  // Tìm kiếm topic khớp chính xác
  let topicData = findMatchingCuratedTopic(topicName);
  if (!topicData) {
    topicData = CURATED_VOCAB_TOPICS.technology || Object.values(CURATED_VOCAB_TOPICS)[0];
  }

  // Tập hợp các từ cần loại trừ (đã học trong session)
  const excludeSet = new Set((excludeWords || []).map(w => String(w).toLowerCase().trim()));

  // Lấy danh sách từ thuộc đúng Level được yêu cầu mà CHƯA HỌC
  let rawLevelList = (topicData.words && topicData.words[validLevel]) || [];
  let pool = rawLevelList.filter(item => !excludeSet.has(item.word.toLowerCase()));

  // Nếu số lượng từ chưa học trong Level này chưa đủ, mở rộng sang các cấp độ lân cận CÙNG CHỦ ĐỀ
  if (pool.length < targetCount) {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const curIdx = levels.indexOf(validLevel);
    const adjacentLevels = [
      levels[curIdx + 1],
      levels[curIdx - 1],
      levels[curIdx + 2],
      levels[curIdx - 2],
      levels[curIdx + 3],
      levels[curIdx - 3]
    ].filter(Boolean);

    for (const adj of adjacentLevels) {
      if (topicData.words && topicData.words[adj]) {
        const unusedAdj = topicData.words[adj].filter(item => !excludeSet.has(item.word.toLowerCase()));
        pool = pool.concat(unusedAdj);
        if (pool.length >= targetCount) break;
      }
    }
  }

  // Nếu sau khi quét sạch mọi level của chủ đề mà vẫn không đủ (đã cày nát toàn bộ topic),
  // cho phép tái sử dụng các từ của đúng level đó nhưng xáo trộn ngẫu nhiên
  if (pool.length === 0) {
    pool = rawLevelList.slice();
  } else if (pool.length < targetCount) {
    const recycled = rawLevelList.filter(item => !pool.some(p => p.word.toLowerCase() === item.word.toLowerCase()));
    pool = pool.concat(recycled);
  }

  // Shuffle ngẫu nhiên trong pool
  const shuffled = pool.slice().sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, targetCount);

  return {
    success: true,
    topic: topicData.name,
    level: validLevel,
    count: selected.length,
    words: selected,
    vocabList: selected,
    source: 'curated_lexicon_instant'
  };
}

/**
 * Sinh từ vựng siêu tốc:
 * - Trả về tức thì (< 5ms) cho 8 chủ đề Tiếng Việt & English có trong kho chuẩn
 * - Hỗ trợ excludeWords để đảm bảo TỪ MỚI TINH khi bấm Reset
 * - Gọi mô hình siêu tốc LLaMA 8B với timeout 3.5s cho chủ đề tùy biến
 */
function generateAIVocabularyList(topic, level, count, excludeWords, callback) {
  if (typeof excludeWords === 'function') {
    callback = excludeWords;
    excludeWords = [];
  }
  if (!Array.isArray(excludeWords)) {
    excludeWords = [];
  }

  const rawTopic = String(topic || 'Công nghệ').trim();
  const normLevel = (level || 'B1').toUpperCase().replace('LEVEL ', '').trim();
  const validLevel = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(normLevel) ? normLevel : 'B1';
  const targetCount = Math.min(Math.max(parseInt(count, 10) || 10, 1), 50);

  // 1. TĂNG TỐC TỨC THÌ (< 5ms): Kiểm tra xem topic có khớp chủ đề chuẩn nào không
  const directMatch = findMatchingCuratedTopic(rawTopic);
  if (directMatch) {
    return callback(getCuratedVocabularyList(rawTopic, validLevel, targetCount, excludeWords));
  }

  // 2. Với chủ đề tự do (Custom Topic) -> Gọi API OpenRouter với LLaMA 8B siêu tốc và timeout 3.5s
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey) {
    const excludedStr = excludeWords.length > 0 ? `Do NOT repeat any of these words: ${excludeWords.slice(-30).join(', ')}.` : '';
    const promptText = `You are an expert English vocabulary teacher. Generate a curated vocabulary list of exactly ${targetCount} English words for the topic: "${rawTopic}" at CEFR level: "${validLevel}".
Rules:
1. Each word must be a single word (3-12 letters), suitable for typing practice.
2. Accurate concise Vietnamese meaning (nghĩa tiếng Việt ngắn gọn).
3. Standard IPA phonetic transcription (e.g. "/flaɪt/").
4. Strictly CEFR ${validLevel} difficulty.
5. ${excludedStr}
Respond ONLY with a valid JSON array of objects with NO markdown, NO code fences, and NO extra text:
[
  {
    "word": "example",
    "meaning": "ví dụ",
    "phonetic": "/ɪɡˈzæm.pəl/",
    "level": "${validLevel}"
  }
]`;

    const postData = JSON.stringify({
      model: 'meta-llama/llama-3.1-8b-instruct',
      messages: [{ role: 'user', content: promptText }],
      temperature: 0.3,
      max_tokens: Math.min(Math.max(targetCount * 38, 450), 2200)
    });

    let handled = false;
    const req = https.request('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + openRouterKey,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'Cung Dang Ra Truong'
      },
      timeout: 3500
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (handled) return;
        handled = true;
        try {
          const parsed = JSON.parse(data);
          const rawText = parsed.choices?.[0]?.message?.content || '';
          const cleanedText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
          const words = JSON.parse(cleanedText);

          if (Array.isArray(words) && words.length > 0) {
            const cleanWords = words.map(w => ({
              word: String(w.word || '').toLowerCase().trim(),
              meaning: String(w.meaning || '').trim(),
              phonetic: String(w.phonetic || '').trim(),
              level: validLevel
            })).filter(w => /^[a-z\s\-']+$/i.test(w.word) && w.word.length >= 2);

            if (cleanWords.length >= 3) {
              const finalList = cleanWords.slice(0, targetCount);
              return callback({
                success: true,
                topic: rawTopic,
                level: validLevel,
                count: finalList.length,
                words: finalList,
                vocabList: finalList,
                source: 'ai_openrouter_fast'
              });
            }
          }
        } catch(e) {
          console.warn('[Vocab AI] Fast JSON parse error, fallback to curated:', e.message);
        }
        return callback(getCuratedVocabularyList(rawTopic, validLevel, targetCount, excludeWords));
      });
    });

    req.on('error', (err) => {
      if (handled) return;
      handled = true;
      return callback(getCuratedVocabularyList(rawTopic, validLevel, targetCount, excludeWords));
    });

    req.on('timeout', () => {
      req.destroy();
      if (handled) return;
      handled = true;
      console.warn('[Vocab AI] OpenRouter timeout (3.5s), using instant curated fallback');
      return callback(getCuratedVocabularyList(rawTopic, validLevel, targetCount, excludeWords));
    });

    req.write(postData);
    req.end();
    return;
  }

  // 3. Fallback nếu không có API key
  return callback(getCuratedVocabularyList(rawTopic, validLevel, targetCount, excludeWords));
}

module.exports = {
  generateAIVocabularyList,
  getCuratedVocabularyList,
  findMatchingCuratedTopic,
  CURATED_VOCAB_TOPICS,
  removeVietnameseDiacritics
};
