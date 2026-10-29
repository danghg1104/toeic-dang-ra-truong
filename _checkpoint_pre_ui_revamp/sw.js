// Service Worker cho ứng dụng "Tôi Đi Đâu Đó" (V13 Totoro - Tôi Đi Đâu Đó 2026)
const CACHE_NAME = 'toi-di-dau-do-cache-v13-2026';
const ASSETS_TO_CACHE = [
  '/manifest.json?v=toididaudo_v13',
  '/icon-totoro-192.png',
  '/icon-totoro-512.png',
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
          if (key !== CACHE_NAME) {
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

  // TUYỆT ĐỐI KHÔNG DÙNG CACHE CHO HTML, JS, CSS, MANIFEST, ICONS VÀ API (Luôn lấy mã nguồn mới nhất từ server)
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
