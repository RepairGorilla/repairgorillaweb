var staticCacheName = 'cmb-v7';

var filesToCache = [
  '/skeleton',
  '/index.html',
  '/manifest.json',
  '/moment.js',
  '/pagebuild/moto.css',
  '/scripts/jquery-3.2.1.min.js',
  '/menu/menu-func.js',
  '/menu/logo-func.js',
  '/chat/chat-func.js',
  '/chat/chat-window.css',
  '/uploads/20180324110640/20200413235236intro_cmb_imaget.png',
  '/uploads/20180324110640/20200325025649screenshot_cmb2-1.png'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('fame-') &&
                 cacheName != staticCacheName;
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      event.respondWith(caches.match('/skeleton'));
      return;
    }
  }
 
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});