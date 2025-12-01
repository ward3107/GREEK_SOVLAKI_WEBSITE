const CACHE_NAME = 'greek-souvlaki-wow-v26';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/animations.css',
  '/accessibility-widget.css',
  '/theme-christmas.css',
  '/script.js',
  '/toggles.js',
  '/scroll-button.js',
  '/translations-new.js',
  '/wow-animations.js',
  '/accessibility-widget.js',
  '/cookie-consent.js',
  '/cookie-consent.css',
  '/theme-manager.js',
  '/pwa-install.js',
  '/storage-utils.js',
  '/restaurant-logo.jpg',
  '/en.json',
  '/he.json',
  '/ar.json',
  '/ru.json',
  '/legal-he.json',
  '/privacy.html',
  '/terms.html',
  '/accessibility.html',
  '/404.html'
];

// Install event - cache files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200) {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(event.request, responseToCache);
          });

        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Handle messages from the client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
