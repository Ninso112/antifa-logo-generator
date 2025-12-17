// Service Worker for Antifa Sticker Generator
const CACHE_NAME = 'antifa-sticker-generator-v0.89';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Only cache same-origin requests
function shouldCache(request) {
  const url = new URL(request.url);
  return url.origin === self.location.origin;
}

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch(() => {
        // Silent fail - app will still work without cache
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Only cache same-origin requests
  if (!shouldCache(event.request)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request).then((response) => {
        // Only cache successful responses from same origin
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        // Return offline fallback for document requests
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
        return new Response('', { status: 408, statusText: 'Request Timeout' });
      });
    })
  );
});
