# PowerShell verification script for "Greek Souvlaki" website fixes
# Run from the project root:
#   powershell -ExecutionPolicy Bypass -File .\verify-fixes.ps1
# or paste into terminal directly (it will run as-is).

$ErrorActionPreference = "Stop"

function Write-Section($title) {
  Write-Host ""
  Write-Host "====================" -ForegroundColor Cyan
  Write-Host $title -ForegroundColor Cyan
  Write-Host "====================" -ForegroundColor Cyan
}

function Write-Pass($msg) { Write-Host "[PASS] $msg" -ForegroundColor Green }
function Write-Fail($msg) { Write-Host "[FAIL] $msg" -ForegroundColor Red }
function Write-Warn($msg) { Write-Host "[WARN] $msg" -ForegroundColor Yellow }

function Find-Text($pattern, $include=@("*.html","*.js","*.css","*.json","*.md"), $excludeDirs=@("node_modules",".git","dist","build",".next",".cache")) {
  $items = Get-ChildItem -Recurse -File -Include $include -ErrorAction SilentlyContinue |
    Where-Object {
      $full = $_.FullName
      foreach ($d in $excludeDirs) {
        if ($full -match "\\$d\\") { return $false }
      }
      return $true
    }

  $hits = @()
  foreach ($f in $items) {
    try {
      $m = Select-String -Path $f.FullName -Pattern $pattern -AllMatches -Encoding UTF8 -ErrorAction SilentlyContinue
      if ($m) { $hits += $m }
    } catch { }
  }
  return $hits
}

function Resolve-ProjectPath($p) {
  if ([string]::IsNullOrWhiteSpace($p)) { return $null }
  # Remove query/hash from manifest icon paths if present
  $clean = $p.Split("?")[0].Split("#")[0]
  # Normalize leading slash
  if ($clean.StartsWith("/")) { $clean = $clean.Substring(1) }
  return Join-Path (Get-Location) $clean
}

$failCount = 0
$warnCount = 0

Write-Section "0) Project quick check"
$root = Get-Location
Write-Host "Project root: $root"
$top = Get-ChildItem -Force | Select-Object Name, Mode
$top | Format-Table -AutoSize

Write-Section "1) Accessibility - <img> alt checks (basic)"
# Note: This is a heuristic check (HTML parsing in PS is hard). It flags likely misses.
$imgLines = Find-Text -pattern "<img\b" -include @("*.html")
$missingAlt = @()
$emptyAlt = @()

foreach ($hit in $imgLines) {
  $line = $hit.Line
  # missing alt attribute at all
  if ($line -match "<img\b" -and $line -notmatch "\balt\s*=") {
    $missingAlt += $hit
  }
  # alt="" explicitly
  if ($line -match "\balt\s*=\s*""\s*""") {
    $emptyAlt += $hit
  }
}

if ($missingAlt.Count -eq 0) { Write-Pass "No <img> lines missing alt attribute (heuristic)." }
else {
  Write-Fail "Found <img> lines missing alt attribute: $($missingAlt.Count)"
  $failCount++
  $missingAlt | Select-Object Path, LineNumber, Line | Format-Table -AutoSize
}

# Empty alt isn't always wrong, so warn unless you confirm decorative
if ($emptyAlt.Count -eq 0) { Write-Pass "No alt=\"\" found." }
else {
  Write-Warn "Found alt=\"\" occurrences (OK only if decorative): $($emptyAlt.Count)"
  $warnCount++
  $emptyAlt | Select-Object Path, LineNumber, Line | Format-Table -AutoSize
}

Write-Section "2) Security - CSP checks"
$cspUnsafe = Find-Text -pattern "Content-Security-Policy|content-security-policy|unsafe-inline" -include @("*.html","*.js","*.md","*.json")
$unsafeInlineScript = $cspUnsafe | Where-Object { $_.Line -match "unsafe-inline" }

if ($unsafeInlineScript.Count -eq 0) { Write-Pass "No 'unsafe-inline' detected in CSP-related lines." }
else {
  Write-Fail "Detected 'unsafe-inline' (CSP risk): $($unsafeInlineScript.Count)"
  $failCount++
  $unsafeInlineScript | Select-Object Path, LineNumber, Line | Format-Table -AutoSize
}

Write-Section "3) Security - innerHTML usage (XSS risk)"
$innerHtmlHits = Find-Text -pattern "\.innerHTML\s*=" -include @("*.js","*.html")
if ($innerHtmlHits.Count -eq 0) { Write-Pass "No .innerHTML= assignments found." }
else {
  Write-Fail "Found .innerHTML= assignments (review/sanitize): $($innerHtmlHits.Count)"
  $failCount++
  $innerHtmlHits | Select-Object Path, LineNumber, Line | Format-Table -AutoSize
}

Write-Section "4) HTTPS - hardcoded http://"
$httpHits = Find-Text -pattern "http://" -include @("*.html","*.js","*.css","*.json","*.md")
if ($httpHits.Count -eq 0) { Write-Pass "No hardcoded http:// found." }
else {
  Write-Fail "Found hardcoded http:// (should be https:// or relative): $($httpHits.Count)"
  $failCount++
  $httpHits | Select-Object Path, LineNumber, Line | Format-Table -AutoSize
}

Write-Section "5) Console logging (should be gated by DEBUG)"
$consoleLogs = Find-Text -pattern "console\.log\(" -include @("*.js")
if ($consoleLogs.Count -eq 0) {
  Write-Pass "No console.log found."
} else {
  # Try to detect a DEBUG gate nearby (heuristic: file contains DEBUG definition)
  $debugDefs = Find-Text -pattern "\bDEBUG\b\s*=" -include @("*.js")
  if ($debugDefs.Count -gt 0) {
    Write-Warn "console.log found ($($consoleLogs.Count)) but DEBUG flag exists somewhere. Confirm logs are gated."
    $warnCount++
  } else {
    Write-Fail "console.log found ($($consoleLogs.Count)) and no DEBUG flag detected."
    $failCount++
  }
  $consoleLogs | Select-Object Path, LineNumber, Line | Format-Table -AutoSize
}

Write-Section "6) Duplicate Lightbox check (index.html)"
if (Test-Path ".\index.html") {
  $lightboxHits = Select-String -Path ".\index.html" -Pattern "lightbox|modal" -AllMatches -Encoding UTF8 -ErrorAction SilentlyContinue
  if ($lightboxHits) {
    # Heuristic: count repeated IDs for common modal patterns
    $indexContent = Get-Content ".\index.html" -Raw -Encoding UTF8
    $idMatches = [regex]::Matches($indexContent, 'id\s*=\s*"(lightbox[^"]*|modal[^"]*)"', "IgnoreCase")
    $idCounts = @{}
    foreach ($m in $idMatches) {
      $id = $m.Groups[1].Value.ToLower()
      if (-not $idCounts.ContainsKey($id)) { $idCounts[$id] = 0 }
      $idCounts[$id]++
    }
    $dupes = $idCounts.GetEnumerator() | Where-Object { $_.Value -gt 1 } | Sort-Object Value -Descending
    if ($dupes.Count -eq 0) { Write-Pass "No duplicate lightbox/modal IDs detected (heuristic)." }
    else {
      Write-Fail "Duplicate lightbox/modal IDs detected (likely duplicate modals):"
      $failCount++
      $dupes | Format-Table -AutoSize
    }
  } else {
    Write-Warn "No lightbox/modal keywords found in index.html (maybe renamed)."
    $warnCount++
  }
} else {
  Write-Warn "index.html not found at project root."
  $warnCount++
}

Write-Section "7) PWA manifest icon files exist"
if (Test-Path ".\manifest.json") {
  $manifestRaw = Get-Content ".\manifest.json" -Raw -Encoding UTF8
  try {
    $manifest = $manifestRaw | ConvertFrom-Json
    if ($manifest.icons -and $manifest.icons.Count -gt 0) {
      $missingIcons = @()
      foreach ($icon in $manifest.icons) {
        $src = $icon.src
        $p = Resolve-ProjectPath $src
        if (-not (Test-Path $p)) {
          $missingIcons += [PSCustomObject]@{ src=$src; resolved=$p }
        }
      }
      if ($missingIcons.Count -eq 0) { Write-Pass "All manifest icons exist on disk." }
      else {
        Write-Fail "Missing manifest icon files: $($missingIcons.Count)"
        $failCount++
        $missingIcons | Format-Table -AutoSize
      }
    } else {
      Write-Warn "manifest.json has no icons array (or it's empty)."
      $warnCount++
    }
  } catch {
    Write-Fail "manifest.json is not valid JSON or cannot be parsed."
    $failCount++
  }
} else {
  Write-Warn "manifest.json not found at project root."
  $warnCount++
}

Write-Section "8) server.js validation (basic heuristic)"
if (Test-Path ".\server.js") {
  $serverHits = Select-String -Path ".\server.js" -Pattern "path\.normalize|path\.resolve|sanitize|validation|allowlist|whitelist" -AllMatches -Encoding UTF8 -ErrorAction SilentlyContinue
  if ($serverHits) {
    Write-Pass "server.js contains path normalization/validation-related code (review manually)."
    $serverHits | Select-Object Path, LineNumber, Line | Format-Table -AutoSize
  } else {
    Write-Fail "server.js present but no obvious path validation keywords found (possible traversal risk)."
    $failCount++
  }
} else {
  Write-Warn "server.js not found at project root (skip server validation check)."
  $warnCount++
}

Write-Section "9) Optional: run Node audit script if present"
if (Test-Path ".\scripts\audit.js") {
  try {
    Write-Host "Running: node .\scripts\audit.js" -ForegroundColor Cyan
    node .\scripts\audit.js
    Write-Pass "scripts/audit.js executed (review output above)."
  } catch {
    Write-Fail "scripts/audit.js failed to run: $($_.Exception.Message)"
    $failCount++
  }
} else {
  Write-Warn "No scripts/audit.js found (ok)."
  $warnCount++
}

Write-Section "FINAL RESULT"
if ($failCount -eq 0) {
  Write-Pass "SAFE TO DEPLOY: YES (with $warnCount warnings to review)"
} else {
  Write-Fail "SAFE TO DEPLOY: NO (Failures: $failCount, Warnings: $warnCount)"
}

exit $failCount
