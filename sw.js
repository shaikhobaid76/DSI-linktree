const CACHE_NAME = 'interiox-cache';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/images/logo.png',
  '/images/bg7.png',
  '/images/favicon.ico',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,600;14..32,700&family=Playfair+Display:wght@700&family=Poppins:wght@500;600&display=swap'
];

// INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );

  return self.clients.claim();
});

// FETCH (AUTO UPDATE)
self.addEventListener('fetch', event => {

  event.respondWith(

    fetch(event.request)
      .then(networkResponse => {

        return caches.open(CACHE_NAME).then(cache => {

          cache.put(event.request, networkResponse.clone());

          return networkResponse;

        });

      })
      .catch(() => {

        return caches.match(event.request);

      })

  );

});