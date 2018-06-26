self.addEventListener('install', function(e) {
  console.log('installing')
 e.waitUntil(
   caches.open('eid').then(function(cache) {
     return cache.addAll([
       'sw.js',
       'index.html',
       'index.css',
       'images/girl.png'
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