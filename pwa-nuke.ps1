param(
  # Preview only (shows what it will delete/change)
  [switch]$WhatIf
)

$ErrorActionPreference = "Stop"

function Backup-File($path) {
  if (Test-Path $path) {
    $stamp = Get-Date -Format "yyyyMMdd_HHmmss"
    Copy-Item $path "$path.bak_$stamp" -Force
  }
}

function Safe-Read($path) {
  try { return Get-Content $path -Raw -ErrorAction Stop } catch { return $null }
}

function Safe-Write($path, $content) {
  Set-Content -Path $path -Value $content -Encoding UTF8
}

Write-Host "=== PWA NUKE ==="
Write-Host "Preview only (WhatIf): $WhatIf"
Write-Host ""

# Exclude big/vendor dirs
$excludePathRegex = "\\node_modules\\|\\\.git\\|\\dist\\|\\build\\|\\out\\|\\\.next\\|\\coverage\\"

# --------- A) DELETE PWA FILES ---------
Write-Host "=== A) Deleting PWA files (core + tests/debug) ==="

$deleteNamePatterns = @(
  # Core PWA
  "manifest.json",
  "manifest.webmanifest",
  "*.webmanifest",
  "service-worker.js",
  "serviceworker.js",
  "sw.js",
  "firebase-messaging-sw.js",
  "workbox-*.js",
  "offline.html",
  "offline.htm",

  # Your PWA experiments/tests/debug (based on your audit)
  "*pwa*.html",
  "*pwa*.js",
  "force-install.html",
  "minimal-pwa.html",
  "pwa-check.html",
  "pwa-test-report.html",
  "test-pwa*.html",
  "test-pwa*.js",
  "debug-test.html",

  # Common extras
  "*serviceworker*.*"
)

$deleteIconPatterns = @(
  "apple-touch-icon*.png",
  "android-chrome-*.png",
  "mstile-*.png",
  "safari-pinned-tab.svg"
)

$targets = @()

foreach ($pat in $deleteNamePatterns) {
  $targets += Get-ChildItem -Path . -Recurse -Force -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like $pat -and ($_.FullName -notmatch $excludePathRegex) }
}

foreach ($pat in $deleteIconPatterns) {
  $targets += Get-ChildItem -Path . -Recurse -Force -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -like $pat -and ($_.FullName -notmatch $excludePathRegex) }
}

# Candidate folders that are often PWA-related
$pwaFolders = Get-ChildItem -Path . -Recurse -Force -Directory -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -match "^(icons|pwa|pwabuilder)$" -and ($_.FullName -notmatch $excludePathRegex) }

foreach ($d in $pwaFolders) {
  $hasPwa = Get-ChildItem -Path $d.FullName -Recurse -Force -File -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -match "(manifest|webmanifest|sw\.js|service-worker|workbox|apple-touch-icon|android-chrome|pwa)" } |
    Select-Object -First 1
  if ($hasPwa) { $targets += $d }
}

$targets = $targets | Sort-Object FullName -Unique

Write-Host "--- Targets ---"
if ($targets.Count -eq 0) {
  Write-Host "(none found)"
} else {
  $targets | ForEach-Object { Write-Host $_.FullName }
}

if (-not $WhatIf) {
  Write-Host ""
  Write-Host "--- Deleting (files get backups) ---"
  foreach ($t in $targets) {
    if ($t.PSIsContainer) {
      Write-Host "Remove folder: $($t.FullName)"
      Remove-Item $t.FullName -Recurse -Force -ErrorAction SilentlyContinue
    } else {
      Write-Host "Backup+Remove: $($t.FullName)"
      Backup-File $t.FullName
      Remove-Item $t.FullName -Force -ErrorAction SilentlyContinue
    }
  }
} else {
  Write-Host ""
  Write-Host "PREVIEW ONLY: No deletions performed."
}

# --------- B) PATCH index.html (remove manifest link + SW registration snippet) ---------
Write-Host ""
Write-Host "=== B) Patching index.html (remove manifest + SW register) ==="

$indexFiles = Get-ChildItem -Path . -Recurse -Force -File -ErrorAction SilentlyContinue |
  Where-Object { $_.Name -ieq "index.html" -and ($_.FullName -notmatch $excludePathRegex) }

if ($indexFiles.Count -eq 0) {
  Write-Host "No index.html found."
} else {
  foreach ($idx in $indexFiles) {
    $path = $idx.FullName
    $html = Safe-Read $path
    if ($null -eq $html) { continue }

    $original = $html

    # Remove manifest link
    $html = [regex]::Replace($html, '\s*<link[^>]*rel=["'']manifest["''][^>]*>\s*', "`r`n", "IgnoreCase")

    # Remove any <meta name="theme-color"...> (optional, since it's PWA-ish)
    $html = [regex]::Replace($html, '\s*<meta[^>]*name=["'']theme-color["''][^>]*>\s*', "`r`n", "IgnoreCase")

    # Remove inline service worker registration script blocks (best-effort)
    $html = [regex]::Replace(
      $html,
      '<script[^>]*>[\s\S]*?(navigator\.serviceWorker|serviceWorker\.register)[\s\S]*?<\/script>',
      '',
      "IgnoreCase"
    )

    if ($html -ne $original) {
      Write-Host "Will patch: $path"
      if (-not $WhatIf) {
        Backup-File $path
        Safe-Write $path $html
        Write-Host "Patched: $path"
      }
    } else {
      Write-Host "No PWA tags/snippets found in: $path"
    }
  }
}

# --------- C) PATCH js/index-scripts.js (remove SW register lines) ---------
Write-Host ""
Write-Host "=== C) Patching js/index-scripts.js (remove serviceWorker.register) ==="

$jsTargets = @(
  ".\js\index-scripts.js"
) | Where-Object { Test-Path $_ }

if ($jsTargets.Count -eq 0) {
  Write-Host "No .\js\index-scripts.js found at expected path."
} else {
  foreach ($j in $jsTargets) {
    $content = Safe-Read $j
    if ($null -eq $content) { continue }

    $original = $content

    # Remove lines containing service worker registration
    $content = ($content -split "`r?`n") |
      Where-Object { $_ -notmatch "navigator\.serviceWorker|serviceWorker\.register" } |
      ForEach-Object { $_ } |
      Out-String

    if ($content -ne $original) {
      Write-Host "Will patch: $j"
      if (-not $WhatIf) {
        Backup-File $j
        Safe-Write $j $content
        Write-Host "Patched: $j"
      }
    } else {
      Write-Host "No SW registration lines found in: $j"
    }
  }
}

Write-Host ""
Write-Host "=== DONE ==="
Write-Host "After running (real mode), also do Chrome cleanup:"
Write-Host "DevTools -> Application -> Service Workers -> Unregister"
Write-Host "DevTools -> Application -> Storage -> Clear site data"
