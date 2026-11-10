// Service Worker cho ứng dụng "Tôi Đi Đâu Đó" (Study Studio 2026) - Offline Audio & Dynamic Caching
const CACHE_NAME = 'study-studio-cache-v22-android-offline-audio';
const AUDIO_CACHE_NAME = 'study-studio-audio-offline-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/favicon.ico',
  '/app.ico',
  '/assets/mascot/may_avatar.png',
  '/assets/mascot/may_reading.png',
  '/assets/theme/aqua_vinyl_turntable.png',
  '/assets/theme/genz_retro_camera_sticker.png',
  '/assets/theme/moodboard_starry_clouds.jpg',
  '/assets/theme/moodboard_ocean_waves_ukiyo.jpg',
  '/assets/theme/moodboard_scrapbook_paper.jpg',
  '/assets/theme/moodboard_denim_sashiko.jpg',
  '/assets/theme/vintage_ocean_waves_bg.jpg',
  '/css/app.bundle.css',
  '/js/vendor/canvas-confetti.min.js',
  '/js/editorial-theme-manager.js',
  '/js/web-audio-micro-engine.js',
  '/js/app-tour-guide.js'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[SW] Cache prefetch warning:', err);
      });
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
          return cachedResponse || new Response('Offline audio not available', { status: 503 });
        });
      })
    );
    return;
  }

  // 2. NETWORK-FIRST VỚI CACHE FALLBACK CHO HTML, JS, CSS, MANIFEST, ICONS
  // Đảm bảo luôn lấy mã nguồn mới nhất khi online, và vẫn mở được ứng dụng khi offline
  const isCoreAsset = (
    event.request.headers.get('accept')?.includes('text/html') ||
    url.pathname === '/' ||
    url.pathname.endsWith('.html') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.includes('manifest.json') ||
    url.pathname.includes('icon') ||
    url.pathname.endsWith('.ico')
  );

  if (isCoreAsset) {
    event.respondWith(
      fetch(event.request, { cache: 'no-cache' })
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const resClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, resClone);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Khi offline, tìm trong cache
          const cached = await caches.match(event.request);
          if (cached) return cached;
          if (event.request.headers.get('accept')?.includes('text/html')) {
            const rootCached = await caches.match('/');
            if (rootCached) return rootCached;
          }
          return new Response('Ứng dụng đang ngoại tuyến (Offline mode).', { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
        })
    );
    return;
  }

  // 3. API endpoints: Không cache để giữ realtime
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 4. Các tài nguyên tĩnh khác: Cache-first
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;
      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const resClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, resClone);
          });
        }
        return networkResponse;
      });
    })
  );
});
