// Service Worker for Antifa Sticker Generator
const CACHE_NAME = 'antifa-sticker-generator-v0.91';
const OFFLINE_URL = './index.html';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch(() => {
        // Silent fail - app will still work without cache
      })
  );
  // No skipWaiting() here: the page asks the user first and then posts
  // SKIP_WAITING, so an update never swaps files under an open editor.
});

// Let the page trigger activation of a waiting worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      ))
      // claim() must be awaited inside waitUntil - returning it from the
      // listener does nothing.
      .then(() => self.clients.claim())
  );
});

function putInCache(request, response) {
  return caches.open(CACHE_NAME).then((cache) => cache.put(request, response));
}

function isCacheable(response) {
  return response && response.status === 200 && response.type === 'basic';
}

// Fetch event
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle same-origin GET requests
  if (request.method !== 'GET') return;
  if (new URL(request.url).origin !== self.location.origin) return;

  // Documents: network first, so a deployed update shows up on the next
  // visit instead of being pinned to whatever was cached first.
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (isCacheable(response)) {
            const copy = response.clone();
            event.waitUntil(putInCache(request, copy));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match(OFFLINE_URL)))
    );
    return;
  }

  // Everything else: serve from cache, refresh it in the background
  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((response) => {
          if (isCacheable(response)) {
            const copy = response.clone();
            event.waitUntil(putInCache(request, copy));
          }
          return response;
        })
        .catch(() => cached || new Response('', { status: 504, statusText: 'Gateway Timeout' }));

      return cached || networkFetch;
    })
  );
});
