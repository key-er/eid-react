self.addEventListener('install', function(e) {
  console.log('installing')
 e.waitUntil(
   caches.open('eid').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/index.css',
       '/images/girl.png',
       '/bundle.js',
       '/index.js'
     ]);
   })
 );
});

self.addEventListener('fetch', function(e) {
  console.log(e.request.url);
  console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(function(response) {
      return response || fetch(e.request);
    })
  );
});