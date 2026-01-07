// sw.js
const CACHE_NAME = 'dazzle-map-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './common.js',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  // 기본적으로 네트워크 요청을 우선하되, 실패 시 캐시 사용 (Stale-while-revalidate 전략 등 변형 가능)
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});