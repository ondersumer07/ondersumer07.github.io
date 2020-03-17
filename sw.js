// const cacheName = 'offline-vinematik';
// const staticAssets = [
//   './',
//   './offline.html',
//   './css/offline.css',
// ];
//
// self.addEventListener('install', async e => {
//   const cache = await caches.open(cacheName);
//   await cache.addAll(staticAssets);
//   return self.skipWaiting();
// });
//
// self.addEventListener('activate', e => {
//   self.clients.claim();
// });
//
// self.addEventListener('fetch', async e => {
//   const req = e.request;
//   const url = new URL(req.url);
//
//   if (url.origin === location.origin) {
//     e.respondWith(cacheFirst(req));
//   } else {
//     e.respondWith(networkAndCache(req));
//   }
// });
//
// async function cacheFirst(req) {
//   const cache = await caches.open(cacheName);
//   const cached = await cache.match(req);
//   return cached || fetch(req);
// }
//
// async function networkAndCache(req) {
//   const cache = await caches.open(cacheName);
//   try {
//     const fresh = await fetch(req);
//     await cache.put(req, fresh.clone());
//     return fresh;
//   } catch (e) {
//     const cached = await cache.match(req);
//     return cached;
//   }
// }

//CACHING FILES//
const filesToCache = [
  './',
  './offline.html',
  './css/offline.css',
];

const staticCacheName = 'pages-cache-v1';

self.addEventListener('install', event => {
  console.log('Attempting to install service worker and cache static assets');
  event.waitUntil(
    caches.open(staticCacheName)
    .then(cache => {
      return cache.addAll(filesToCache);
    })
  );
});

//LOADING FILES WHEN OFFLINE//
self.addEventListener('fetch', event => {
  console.log('Fetch event for ', event.request.url);
  event.respondWith(
    caches.match(event.request)
    .then(response => {
      if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
      }
      console.log('Network request for ', event.request.url);
      return fetch(event.request)

        .then(response => {
          // TODO 5 - Respond with custom 404 page
          return caches.open(staticCacheName).then(cache => {
            cache.put(event.request.url, response.clone());
            return response;
          });
        });


    }).catch(error => {
      console.log('Error, ', error);
      return caches.match('./offline.html');

      // TODO 6 - Respond with custom offline page

    })
  );
});
