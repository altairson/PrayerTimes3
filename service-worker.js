// Define the files to be cached

const cacheName = 'my-app-cache';
const filesToCache = [
  '/',
  '/index.html',
  '/css/main.css',
  '/js/main.js',
  '/jquery/jquery.min.js',
  '/media/mosque_croped.png'
];

// Install the service worker and cache the app's resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName)
      .then(function(cache) {
        return cache.addAll(filesToCache);
      })
  );
});

// Serve cached content when offline
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});