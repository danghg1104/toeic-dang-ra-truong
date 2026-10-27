const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// 1. Patch head links
const oldHead = `<link rel="manifest" href="manifest.json">
    <link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="icon-512.png">
    <link rel="apple-touch-icon" sizes="192x192" href="icon-192.png">
    <link rel="apple-touch-icon" sizes="512x512" href="icon-512.png">`;

const oldHeadCRLF = oldHead.replace(/\n/g, '\r\n');

const newHead = `<link rel="manifest" href="manifest.json?v=totoro_v12">
    <link rel="icon" type="image/x-icon" href="favicon.ico?v=totoro_v12">
    <link rel="icon" type="image/png" sizes="192x192" href="icon-totoro-192.png?v=totoro_v12">
    <link rel="icon" type="image/png" sizes="512x512" href="icon-totoro-512.png?v=totoro_v12">
    <link rel="apple-touch-icon" sizes="192x192" href="icon-totoro-192.png?v=totoro_v12">
    <link rel="apple-touch-icon" sizes="512x512" href="icon-totoro-512.png?v=totoro_v12">`;

if (html.includes(oldHead)) {
  html = html.replace(oldHead, newHead);
  console.log('Patched head links (LF)');
} else if (html.includes(oldHeadCRLF)) {
  html = html.replace(oldHeadCRLF, newHead.replace(/\n/g, '\r\n'));
  console.log('Patched head links (CRLF)');
} else {
  console.log('Could not find old head links directly, checking regex...');
  html = html.replace(/<link rel="manifest" href="[^"]*">[\s\S]*?<link rel="apple-touch-icon" sizes="512x512" href="[^"]*">/, newHead);
  console.log('Patched head links with regex');
}

// 2. Patch SW registration
const oldSW = `        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch((err) => {
                    console.log('SW registration note:', err.message);
                });
            });
        }`;

const oldSWCRLF = oldSW.replace(/\n/g, '\r\n');

const newSW = `        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js?v=totoro_v12').then(reg => {
                    reg.update();
                }).catch((err) => {
                    console.log('SW registration note:', err.message);
                });
                if ('caches' in window) {
                    caches.keys().then(keys => {
                        keys.forEach(k => {
                            if (!k.includes('v12-totoro')) {
                                console.log('[Client] Purging old cache:', k);
                                caches.delete(k);
                            }
                        });
                    });
                }
            });
        }`;

if (html.includes(oldSW)) {
  html = html.replace(oldSW, newSW);
  console.log('Patched SW registration (LF)');
} else if (html.includes(oldSWCRLF)) {
  html = html.replace(oldSWCRLF, newSW.replace(/\n/g, '\r\n'));
  console.log('Patched SW registration (CRLF)');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Updated index.html successfully!');
