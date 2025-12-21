param(
  [string]$WebRoot = ".",
  [string]$AppName = "Greek Souvlaki",
  [string]$ShortName = "Souvlaki",
  [string]$ThemeColor = "#0f172a"
)

$ErrorActionPreference = "Stop"

function Backup-File($path) {
  if (Test-Path $path) {
    $stamp = Get-Date -Format "yyyyMMdd_HHmmss"
    Copy-Item $path "$path.bak_$stamp" -Force
  }
}
function Ensure-Dir($path) {
  if (!(Test-Path $path)) { New-Item -ItemType Directory -Path $path | Out-Null }
}
function Must-Exist($path, $label) {
  if (!(Test-Path $path)) { throw "$label not found: $path" }
}

$root = (Resolve-Path $WebRoot).Path
Write-Host "=== PWA CSP-SAFE INSTALL ==="
Write-Host "WebRoot: $root"
Write-Host ""

$indexPath = Join-Path $root "index.html"
Must-Exist $indexPath "index.html"

Ensure-Dir (Join-Path $root "icons")

$iconFiles = @(
  (Join-Path $root "icons\icon-192.png"),
  (Join-Path $root "icons\icon-512.png"),
  (Join-Path $root "icons\icon-192-maskable.png"),
  (Join-Path $root "icons\icon-512-maskable.png")
)
foreach ($i in $iconFiles) {
  if (!(Test-Path $i)) { [IO.File]::WriteAllBytes($i, [byte[]](0..255)) }
}

$manifestPath = Join-Path $root "manifest.webmanifest"
$manifest = @"
{
  "name": "$AppName",
  "short_name": "$ShortName",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "$ThemeColor",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/icons/icon-192-maskable.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/icons/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
"@
Backup-File $manifestPath
Set-Content -Path $manifestPath -Value $manifest -Encoding UTF8
Write-Host "Created: $manifestPath"

$swPath = Join-Path $root "sw.js"
$sw = @'
const VERSION = "pwa-clean-v1";
const PRECACHE = `${VERSION}-precache`;
const RUNTIME  = `${VERSION}-runtime`;

const PRECACHE_URLS = [
  "/",
  "/manifest.webmanifest",
  "/pwa-register.js",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-192-maskable.png",
  "/icons/icon-512-maskable.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
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
        const fetchPromise = fetch(req).then((res) => {
          caches.open(RUNTIME).then((cache) => cache.put(req, res.clone()));
          return res;
        });
        return cached || fetchPromise;
      })
    );
  }
});
'@
Backup-File $swPath
Set-Content -Path $swPath -Value $sw -Encoding UTF8
Write-Host "Created: $swPath"

$regPath = Join-Path $root "pwa-register.js"
$reg = @'
(function () {
  if (!("serviceWorker" in navigator)) return;

  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/sw.js", { scope: "/" })
      .then(function (reg) { console.log("[PWA] SW registered:", reg.scope); })
      .catch(function (err) { console.warn("[PWA] SW registration failed:", err); });
  });
})();
'@
Backup-File $regPath
Set-Content -Path $regPath -Value $reg -Encoding UTF8
Write-Host "Created: $regPath"

Backup-File $indexPath
$html = Get-Content $indexPath -Raw

$html = [regex]::Replace($html, '\s*<link[^>]*rel=["'']manifest["''][^>]*>\s*', "`r`n", "IgnoreCase")
$html = [regex]::Replace($html, '\s*<script[^>]*src=["''][^"'']*(pwa[^"'']*\.js)["''][^>]*>\s*</script>\s*', "`r`n", "IgnoreCase")
$html = [regex]::Replace($html, '<script[^>]*>[\s\S]*?(navigator\.serviceWorker|serviceWorker\.register)[\s\S]*?</script>', '', "IgnoreCase")

if ($html -notmatch 'rel=["'']manifest["'']') {
  $html = $html -replace "(<head[^>]*>)", "`$1`r`n  <link rel=`"manifest`" href=`"/manifest.webmanifest`">"
}
if ($html -notmatch 'name=["'']theme-color["'']') {
  $html = $html -replace "(<head[^>]*>)", "`$1`r`n  <meta name=`"theme-color`" content=`"$ThemeColor`">"
}
if ($html -notmatch "pwa-register\.js") {
  $html = $html -replace "</body>", "  <script src=`"/pwa-register.js`"></script>`r`n</body>"
}

Set-Content -Path $indexPath -Value $html -Encoding UTF8
Write-Host "Patched: $indexPath"

Write-Host ""
Write-Host "=== DONE ==="
Write-Host "Test URLs:"
Write-Host "  http://localhost:8000/manifest.webmanifest"
Write-Host "  http://localhost:8000/sw.js"
Write-Host "  http://localhost:8000/pwa-register.js"
