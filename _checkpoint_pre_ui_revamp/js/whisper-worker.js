/**
 * Web Worker for Whisper AI Speech-to-Text (Transformers.js)
 * Chạy ngầm trong luồng riêng (Background Worker) - 0% GIẬT LAG MAIN THREAD!
 * Hỗ trợ bóc băng file dài (>10 phút) bằng kỹ thuật Dynamic 30s Chunking chuẩn OpenAI Whisper.
 */

let transcriber = null;

function formatTime(sec) {
    const s = Math.floor(sec || 0);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`;
}

self.onmessage = async (e) => {
    const { action, audioData, id } = e.data;
    if (action === 'transcribe') {
        try {
            self.postMessage({ type: 'progress', percent: 5, text: 'Đang khởi động luồng ngầm AI...' });

            const { pipeline, env } = await import('https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2');
            env.allowLocalModels = false;
            env.useBrowserCache = true;

            self.postMessage({ type: 'progress', percent: 15, text: 'Đang kết nối mô hình Whisper AI...' });

            if (!transcriber) {
                transcriber = await pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', {
                    quantized: true,
                    progress_callback: (prog) => {
                        if (prog.status === 'progress' && prog.total) {
                            const pct = Math.min(30, 15 + Math.round((prog.loaded / prog.total) * 15));
                            self.postMessage({ type: 'progress', percent: pct, text: `Đang nạp mô hình AI (${pct}%)...` });
                        }
                    }
                });
            }

            const SAMPLE_RATE = 16000;
            const totalSamples = audioData.length;
            const totalDuration = totalSamples / SAMPLE_RATE;

            self.postMessage({ 
                type: 'progress', 
                percent: 30, 
                text: `Đã nạp mô hình! Bắt đầu bóc băng file ${formatTime(totalDuration)}...` 
            });

            const CHUNK_DURATION = 30; // 30 giây mỗi đoạn theo chuẩn Whisper
            const CHUNK_SIZE = SAMPLE_RATE * CHUNK_DURATION;
            const totalChunks = Math.max(1, Math.ceil(totalSamples / CHUNK_SIZE));

            let allChunks = [];
            let fullTextParts = [];

            for (let i = 0; i < totalChunks; i++) {
                const startSample = i * CHUNK_SIZE;
                const endSample = Math.min(totalSamples, (i + 1) * CHUNK_SIZE);
                const chunkAudio = audioData.subarray(startSample, endSample);

                // Bỏ qua đoạn đuôi quá ngắn < 0.3s (nhiễu hoặc click)
                if (chunkAudio.length < SAMPLE_RATE * 0.3) {
                    continue;
                }

                const chunkStartTime = i * CHUNK_DURATION;
                const chunkEndTime = chunkStartTime + (chunkAudio.length / SAMPLE_RATE);

                const chunkPct = 30 + Math.round(((i + 0.1) / totalChunks) * 58);
                self.postMessage({
                    type: 'progress',
                    percent: chunkPct,
                    text: `Đang bóc băng đoạn ${i + 1}/${totalChunks} [${formatTime(chunkStartTime)} - ${formatTime(chunkEndTime)}]... (${chunkPct}%)`
                });

                // Nhận diện từng đoạn 30 giây với Whisper
                const chunkOutput = await transcriber(chunkAudio, {
                    return_timestamps: true
                });

                const chunkText = (chunkOutput.text || '').trim();
                if (chunkText && chunkText !== '[BLANK_AUDIO]') {
                    fullTextParts.push(chunkText);
                }

                if (chunkOutput.chunks && Array.isArray(chunkOutput.chunks) && chunkOutput.chunks.length > 0) {
                    chunkOutput.chunks.forEach(c => {
                        const segText = (c.text || '').trim();
                        if (!segText || segText === '[BLANK_AUDIO]') return;
                        const rawStart = Array.isArray(c.timestamp) ? c.timestamp[0] : 0;
                        const rawEnd = Array.isArray(c.timestamp) ? c.timestamp[1] : (c.timestamp || 2);
                        
                        // Tránh duplicate hallucination
                        if (allChunks.length > 0) {
                            const last = allChunks[allChunks.length - 1];
                            if (last.text.toLowerCase() === segText.toLowerCase() && Math.abs(last.timestamp[1] - (chunkStartTime + rawStart)) < 0.5) {
                                return;
                            }
                        }

                        allChunks.push({
                            text: segText,
                            timestamp: [
                                parseFloat((chunkStartTime + (rawStart || 0)).toFixed(1)),
                                parseFloat((chunkStartTime + (rawEnd || 2)).toFixed(1))
                            ]
                        });
                    });
                } else if (chunkText && chunkText !== '[BLANK_AUDIO]') {
                    allChunks.push({
                        text: chunkText,
                        timestamp: [parseFloat(chunkStartTime.toFixed(1)), parseFloat(chunkEndTime.toFixed(1))]
                    });
                }

                // Nhường event loop 10ms để gửi message tức thì cho main thread
                await new Promise(r => setTimeout(r, 10));
            }

            self.postMessage({ type: 'progress', percent: 90, text: 'Hoàn tất bóc băng, đang chuẩn hóa văn bản...' });

            self.postMessage({
                type: 'success',
                output: {
                    text: fullTextParts.join(' '),
                    chunks: allChunks
                },
                id
            });

        } catch (err) {
            self.postMessage({ type: 'error', error: err.message || String(err), id });
        }
    }
};
