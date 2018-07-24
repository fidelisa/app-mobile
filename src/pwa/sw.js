var CACHE_NAME = '<%= uuid %>_<%= new Date().getTime() %>';
var urlsToCache = [
  'index.html',
  'css/style.css',
  'js/app.bundle.js'
];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(event) {
	// Destroy the cache
	event.waitUntil(
    caches.keys().then(function(cacheNames) {
		  return Promise.all(
        cacheNames.map(function(cacheName) {
			    if(cacheName !== CACHE_NAME) {
				    return caches.delete(cacheName);
			    }
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
        return response || fetch(event.request);
    })
  );
});