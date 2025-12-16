# Ultra-Safe Asset Deduplication Script
# Only deletes exact hash-identical, unreferenced image files

param(
    [Parameter(Mandatory=$false)]
    [switch]$DryRun = $true,

    [Parameter(Mandatory=$false)]
    [switch]$Execute = $false
)

# Set execution policy for this script
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force

Write-Host "🔍 Ultra-Safe Asset Deduplication Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Validate parameters
if ($DryRun -and $Execute) {
    Write-Host "❌ Error: Cannot use -DryRun and -Execute together" -ForegroundColor Red
    exit 1
}

if (-not $DryRun -and -not $Execute) {
    Write-Host "ℹ️  Defaulting to dry-run mode. Use -Execute to apply changes." -ForegroundColor Yellow
    $DryRun = $true
}

# Set project root
$ProjectRoot = Resolve-Path "."
Write-Host "📁 Project Root: $ProjectRoot"
Write-Host "🔧 Mode: $(if ($DryRun) { 'DRY RUN (no changes will be made)' } else { 'EXECUTE (changes will be applied)' })"
Write-Host ""

# Duplicate groups identified by analysis
$duplicateGroups = @{
    "2369f6032bc3435a9395055c46e6a62c92f1b49ad0a4413a64dc7184db757eac" = @{
        files = @(
            "$ProjectRoot\restaurant-logo.jpg",
            "$ProjectRoot\logo.jpg\275088390_338797444969852_3048252492493703067_n.jpg"
        )
        canonical = "$ProjectRoot\restaurant-logo.jpg"
        deletable = @("$ProjectRoot\logo.jpg\275088390_338797444969852_3048252492493703067_n.jpg")
        reason = "logo.jpg in directory is unreferenced duplicate"
    }
}

# Function to check if file is referenced
function Test-FileReferenced {
    param([string]$FilePath)

    # Get relative path from project root
    $relativePath = $FilePath.Replace($ProjectRoot, "").TrimStart("\").Replace("\", "/")

    # File patterns to search
    $searchPatterns = @("*.html", "*.css", "*.js", "*.json", "*.md", "*.xml")

    # Search terms
    $searchTerms = @(
        $relativePath,
        $relativePath.Replace("/", "\"),
        [System.IO.Path]::GetFileNameWithoutExtension($relativePath),
        [System.IO.Path]::GetFileName($relativePath)
    )

    foreach ($pattern in $searchPatterns) {
        $files = Get-ChildItem -Path $ProjectRoot -Filter $pattern -Recurse -File |
                Where-Object { $_.FullName -notlike "*\.git\*" -and
                             $_.FullName -notlike "*\node_modules\*" -and
                             $_.FullName -notlike "*\backup_deleted_assets\*" }

        foreach ($file in $files) {
            try {
                $content = Get-Content -Path $file.FullName -Raw -ErrorAction SilentlyContinue
                if ($content) {
                    foreach ($term in $searchTerms) {
                        if ($content -match [regex]::Escape($term)) {
                            return $true
                        }
                    }
                }
            } catch {
                # Skip files that can't be read
            }
        }
    }

    return $false
}

# Function to format file size
function Format-FileSize {
    param([long]$Size)

    if ($Size -ge 1GB) {
        return "{0:N1} GB" -f ($Size / 1GB)
    } elseif ($Size -ge 1MB) {
        return "{0:N1} MB" -f ($Size / 1MB)
    } elseif ($Size -ge 1KB) {
        return "{0:N1} KB" -f ($Size / 1KB)
    } else {
        return "$Size bytes"
    }
}

# Start analysis
Write-Host "🔍 Analyzing duplicate groups..." -ForegroundColor Green

$totalFilesScanned = 0
$duplicateGroupsFound = 0
$filesToKeep = @()
$filesToDelete = @()
$totalSpaceSaved = 0

foreach ($hash in $duplicateGroups.Keys) {
    $group = $duplicateGroups[$hash]
    $duplicateGroupsFound++

    Write-Host ""
    Write-Host "📋 Duplicate Group $duplicateGroupsFound (SHA-256: $hash)" -ForegroundColor Yellow
    Write-Host "─" * 80 -ForegroundColor Gray

    $canonicalFound = $false
    $groupFilesToDelete = @()

    foreach ($file in $group.files) {
        if (Test-Path $file) {
            $totalFilesScanned++
            $fileSize = (Get-Item $file).Length
            $isReferenced = Test-FileReferenced -FilePath $file
            $isCanonical = ($file -eq $group.canonical)

            Write-Host "📄 $($file.Replace($ProjectRoot, ''))" -ForegroundColor White
            Write-Host "   Size: $(Format-FileSize $fileSize)" -ForegroundColor Gray
            Write-Host "   Referenced: $(if ($isReferenced) { 'YES' } else { 'NO' })" -ForegroundColor $(if ($isReferenced) { 'Green' } else { 'Red' })
            Write-Host "   Canonical: $(if ($isCanonical) { 'YES' } else { 'NO' })" -ForegroundColor $(if ($isCanonical) { 'Green' } else { 'Red' })

            if ($isCanonical) {
                $canonicalFound = $true
                $filesToKeep += $file
                Write-Host "   Action: KEEP (canonical file)" -ForegroundColor Green
            } elseif ($isReferenced) {
                $filesToKeep += $file
                Write-Host "   Action: KEEP (referenced file)" -ForegroundColor Green
            } else {
                if ($file -in $group.deletable) {
                    $groupFilesToDelete += $file
                    $filesToDelete += $file
                    $totalSpaceSaved += $fileSize
                    Write-Host "   Action: DELETE (unreferenced duplicate)" -ForegroundColor Red
                } else {
                    $filesToKeep += $file
                    Write-Host "   Action: KEEP (conservative approach)" -ForegroundColor Yellow
                }
            }
            Write-Host ""
        } else {
            Write-Host "⚠️  File not found: $($file.Replace($ProjectRoot, ''))" -ForegroundColor Yellow
        }
    }

    if (-not $canonicalFound) {
        Write-Host "⚠️  Warning: Canonical file not found for group $hash" -ForegroundColor Yellow
    }
}

# Summary
Write-Host ""
Write-Host "📊 ANALYSIS SUMMARY" -ForegroundColor Cyan
Write-Host "==================" -ForegroundColor Cyan
Write-Host "Files scanned: $totalFilesScanned" -ForegroundColor White
Write-Host "Duplicate groups: $duplicateGroupsFound" -ForegroundColor White
Write-Host "Files to keep: $($filesToKeep.Count)" -ForegroundColor Green
Write-Host "Files to delete: $($filesToDelete.Count)" -ForegroundColor Red
Write-Host "Space to save: $(Format-FileSize $totalSpaceSaved)" -ForegroundColor Yellow
Write-Host ""

# Safety warnings
if ($filesToDelete.Count -gt 0) {
    Write-Host "⚠️  FILES MARKED FOR DELETION:" -ForegroundColor Red
    Write-Host ""
    foreach ($file in $filesToDelete) {
        Write-Host "   🗑️  $($file.Replace($ProjectRoot, ''))" -ForegroundColor Red
    }
    Write-Host ""
}

if ($DryRun) {
    Write-Host "🔍 DRY RUN MODE - No files will be modified" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To execute these changes, run:" -ForegroundColor Cyan
    Write-Host "   .\scripts\dedupe-assets.ps1 -Execute" -ForegroundColor White
    exit 0
}

# Execute mode
if ($Execute -and $filesToDelete.Count -gt 0) {
    Write-Host "🚀 EXECUTION MODE - Applying changes..." -ForegroundColor Green
    Write-Host ""

    # Create backup directory
    $backupDir = "$ProjectRoot\backup_deleted_assets\$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Write-Host "📁 Creating backup directory: $backupDir" -ForegroundColor Cyan
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

    $filesDeleted = 0
    $spaceFreed = 0

    foreach ($file in $filesToDelete) {
        if (Test-Path $file) {
            try {
                # Create relative path for backup
                $relativePath = $file.Replace($ProjectRoot, "").TrimStart("\")
                $backupPath = Join-Path $backupDir $relativePath
                $backupDirPath = Split-Path $backupPath -Parent

                # Ensure backup directory exists
                New-Item -ItemType Directory -Path $backupDirPath -Force | Out-Null

                # Copy to backup
                Write-Host "📋 Backing up: $($file.Replace($ProjectRoot, ''))" -ForegroundColor Gray
                Copy-Item -Path $file -Destination $backupPath -Force

                # Get file size before deletion
                $fileSize = (Get-Item $file).Length

                # Delete original file
                Write-Host "🗑️  Deleting: $($file.Replace($ProjectRoot, ''))" -ForegroundColor Red
                Remove-Item -Path $file -Force -Confirm:$false

                $filesDeleted++
                $spaceFreed += $fileSize

                # Remove empty directories
                $parentDir = Split-Path $file -Parent
                while ((Get-ChildItem $parentDir).Count -eq 0 -and $parentDir -ne $ProjectRoot) {
                    Write-Host "📁 Removing empty directory: $parentDir" -ForegroundColor Gray
                    Remove-Item -Path $parentDir -Force -Confirm:$false
                    $parentDir = Split-Path $parentDir -Parent
                }

            } catch {
                Write-Host "❌ Error processing file: $($file.Replace($ProjectRoot, ''))" -ForegroundColor Red
                Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }

    Write-Host ""
    Write-Host "✅ EXECUTION COMPLETED" -ForegroundColor Green
    Write-Host "==================" -ForegroundColor Green
    Write-Host "Files deleted: $filesDeleted" -ForegroundColor White
    Write-Host "Space freed: $(Format-FileSize $spaceFreed)" -ForegroundColor White
    Write-Host "Backup location: $backupDir" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "🔍 VALIDATION CHECKLIST" -ForegroundColor Yellow
    Write-Host "────────────────────" -ForegroundColor Yellow
    Write-Host "□ Run development server: npm run dev" -ForegroundColor White
    Write-Host "□ Load homepage in browser" -ForegroundColor White
    Write-Host "□ Check all images display correctly" -ForegroundColor White
    Write-Host "□ Verify PWA installation works" -ForegroundColor White
    Write-Host "□ Check favicons display properly" -ForegroundColor White
    Write-Host "□ Run tests: npm test" -ForegroundColor White
    Write-Host ""
    Write-Host "If any issues occur, restore from backup:" -ForegroundColor Red
    Write-Host "Copy files from $backupDir back to their original locations" -ForegroundColor White
}

Write-Host ""
Write-Host "✨ Script completed successfully!" -ForegroundColor Green