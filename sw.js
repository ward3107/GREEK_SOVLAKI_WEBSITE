const VERSION = "pwa-v3-logo-fix";
const PRECACHE = `${VERSION}-precache`;
const RUNTIME  = `${VERSION}-runtime`;

const PRECACHE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/manifest.webmanifest",
  "/offline.html",
  "/styles.css",
  "/logo.jpg",
  "/images/app-logo.webp"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then((cache) => {
        return Promise.allSettled(
          PRECACHE_URLS.map(url =>
            cache.add(url).catch(err => {
              console.warn('[SW] Failed to cache:', url, err);
              return null;
            })
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((k) =>
        ((k.includes("-precache") || k.includes("-runtime")) && !k.startsWith(VERSION)) ? caches.delete(k) : null
      )))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(RUNTIME).then((cache) => cache.put(req, copy));
        return res;
      }).catch(() => caches.match(req))
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(req).then((res) => {
          // Only clone if the response is valid and can be cloned
          if (res && res.clone) {
            const responseClone = res.clone();
            caches.open(RUNTIME).then((cache) => cache.put(req, responseClone)).catch(() => {
              // Ignore cache errors
            });
          }
          return res;
        }).catch(() => {
          // Return offline page as last resort
          return caches.match("/offline.html") || new Response('Offline', { status: 503 });
        });
      })
    );
  }
});
