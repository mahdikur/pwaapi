// Install SW
var CACHE_NAME = 'my-site-cache-v1';
var urlsToCache = [
  './',
  'fallback.json',
  './img/1.jpg',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css',
  './css/style.css',
  'https://code.jquery.com/jquery-3.5.1.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/js/bootstrap.bundle.min.js',
  './js/script.js',
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
        console.log('in install serviceworker... cache opened!');
        return cache.addAll(urlsToCache);
    })
  );
});


// Aktifkan SW
self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName){
            return cacheName != CACHE_NAME;
          }).map(function(cacheName){
              return caches.delete(cacheName);
          })
        );
      })
    );
});


// Pemakaian SW
self.addEventListener('fetch', function(event) {
    var request = event.request;
    var url     = new URL(request.url);

    // Pisahkan request API dan Internal
    if(url.origin === location.origin){
        event.respondWith(
            caches.match(request).then(function(response){
                return response || fetch(request);
            })
        )
    } else {
        event.respondWith(
            caches.open('products-cache').then(function(cache){
                return fetch(request).then(function(liveResponse){
                    cache.put(request, liveResponse.clone())
                    return liveResponse
                })
            }).catch(function(){
                return caches.match(request).then(function(response){
                    if(response) return response
                    return caches.match('fallback.json')
                })
            })
        )
    }
        
});   