// Service Worker – Meine Rezepte App
// Cache name includes version – change APP_VERSION in index.html to bust cache
const CACHE = 'rezepte-v2.0.0';
const FILES = ['./', './index.html'];

// Install: cache app files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())
  );
});

// Activate: delete old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: serve from cache, fall back to network
self.addEventListener('fetch', e => {
  // Only handle same-origin GET requests for the app shell
  if(e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // For navigation requests (index.html), always try network first
  if(e.request.mode === 'navigate'){
    e.respondWith(
      fetch(e.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return response;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }
  // For other requests: cache first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
