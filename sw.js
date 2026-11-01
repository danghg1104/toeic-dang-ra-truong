// Service Worker cho ứng dụng "Tôi Đi Đâu Đó" (Study Studio 2026) - Offline Audio & Dynamic Caching
const CACHE_NAME = 'study-studio-cache-v5-phase4-modular';
const AUDIO_CACHE_NAME = 'study-studio-audio-offline-v1';

const ASSETS_TO_CACHE = [
  '/manifest.json?v=toididaudo_v15',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.ico',
  '/app.ico'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {});
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME && key !== AUDIO_CACHE_NAME) {
            console.log('[SW] Deleting stale cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;

  // 1. XỬ LÝ AUDIO NGOẠI TUYẾN (Offline Audio Cache)
  const isAudio = url.pathname.endsWith('.mp3') || url.pathname.endsWith('.wav') || url.pathname.endsWith('.ogg');
  if (isAudio) {
    event.respondWith(
      caches.open(AUDIO_CACHE_NAME).then(async (audioCache) => {
        const cachedResponse = await audioCache.match(event.request);
        if (cachedResponse) {
          // Trả về file đã tải offline ngay lập tức
          return cachedResponse;
        }
        // Chưa lưu offline -> Tải online từ server
        return fetch(event.request).catch(async () => {
          // Khi mất mạng, thử tìm fallback trong cache
          return cachedResponse || new Response('Offline audio not available', { status: 503 });
        });
      })
    );
    return;
  }

  // 2. KHÔNG DÙNG CACHE CHO HTML, JS, CSS, MANIFEST, ICONS VÀ API (Luôn lấy mã nguồn mới nhất từ server)
  if (
    event.request.headers.get('accept')?.includes('text/html') ||
    url.pathname === '/' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.includes('manifest.json') ||
    url.pathname.includes('icon') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(fetch(event.request, { cache: 'no-cache' }));
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, resClone);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
