/* Minimal PWA Service Worker */
const VERSION = "pwa-v1";
const PRECACHE = `${VERSION}-precache`;
const RUNTIME = `${VERSION}-runtime`;

const PRECACHE_URLS = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-192-maskable.png",
  "/icons/icon-512-maskable.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PRECACHE).then((cache) => cache.addAll(PRECACHE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k.startsWith("pwa-") && !k.startsWith(VERSION)) ? caches.delete(k) : null))
    ).then(() => self.clients.claim())
  );
});

function isNavigationRequest(request) {
  return request.mode === "navigate" ||
    (request.method === "GET" && request.headers.get("accept") && request.headers.get("accept").includes("text/html"));
}

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Never cache non-GET
  if (req.method !== "GET") return;

  // HTML: NetworkFirst, fallback to offline
  if (isNavigationRequest(req)) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(RUNTIME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match("/offline.html")))
    );
    return;
  }

  const url = new URL(req.url);

  // Same-origin JS/CSS: StaleWhileRevalidate
  if (url.origin === self.location.origin && (url.pathname.endsWith(".js") || url.pathname.endsWith(".css"))) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req).then((res) => {
          caches.open(RUNTIME).then((cache) => cache.put(req, res.clone()));
          return res;
        });
        return cached || fetchPromise;
      })
    );
    return;
  }

  // Images/fonts: CacheFirst (runtime)
  if (/\.(png|jpg|jpeg|webp|svg|gif|ico|woff2?|ttf|otf)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(req).then((cached) =>
        cached || fetch(req).then((res) => {
          caches.open(RUNTIME).then((cache) => cache.put(req, res.clone()));
          return res;
        })
      )
    );
    return;
  }
});
