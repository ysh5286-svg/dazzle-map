const CACHE_NAME = 'dazzle-map-v4.6'; // 버전 업데이트 시 같이수정 >> index >> navigator.serviceWorker.register('./sw.js?v=4.0')

const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './common.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://code.jquery.com/jquery-3.7.1.min.js',
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('서비스 워커: 파일 캐싱 시작');
        // 개별 캐싱 (하나 실패해도 나머지 진행)
        return Promise.allSettled(
          urlsToCache.map(url => cache.add(url).catch(e => console.warn('캐시 실패:', url)))
        );
      })
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // 네이버 지도, 파이어베이스 등 외부 API는 캐시 제외 (항상 네트워크)
  if (url.includes('naver') ||
      url.includes('firestore') ||
      url.includes('firebase') ||
      url.includes('googleapis.com/identitytoolkit') ||
      url.includes('googleapis.com/securetoken')) {
    return;
  }

  // 🚀 Stale-While-Revalidate: 캐시 즉시 반환 + 백그라운드에서 최신 버전 업데이트
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // 정상 응답만 캐시 업데이트
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse); // 네트워크 실패 시 캐시 사용

        // 캐시가 있으면 즉시 반환 (빠른 로딩), 없으면 네트워크 대기
        return cachedResponse || fetchPromise;
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
        return self.clients.claim();
    }).then(() => {
        return self.clients.matchAll({ type: 'window' });
    }).then(clients => {
        clients.forEach(client => client.postMessage({ type: 'SW_UPDATED' }));
    })
  );
});