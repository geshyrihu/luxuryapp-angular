# ============================================================
# MIGRATION SCRIPT: Legacy CustomButton -> WebButtonLabel
# ============================================================
# Processes all .ts and .html files in src/app/features/
# Excludes: legacy/, *.spec.ts, *.test.ts
# ============================================================

# ----- MIGRATION MAP -----
# Legacy -> New mappings for both HTML selectors and TS class names
# Format: @{ LegacyClass = "NewClass"; LegacySelector = "NewSelector"; LegacyFile = "NewFile" }
# ============================================================

$migrations = @(
    @{ Selector = 'custom-button-save'; Component = 'CustomButtonSave'; NewSelector = 'il-button-save'; NewComponent = 'WebButtonLabelSave'; NewFile = 'button-save' },
    @{ Selector = 'custom-button-edit'; Component = 'CustomButtonEdit'; NewSelector = 'il-button-edit'; NewComponent = 'WebButtonLabelEdit'; NewFile = 'button-edit' },
    @{ Selector = 'custom-button-delete'; Component = 'CustomButtonDelete'; NewSelector = 'il-button-delete'; NewComponent = 'WebButtonLabelDelete'; NewFile = 'button-delete' },
    @{ Selector = 'custom-button-add'; Component = 'CustomButtonAdd'; NewSelector = 'il-button-add'; NewComponent = 'WebButtonLabelAdd'; NewFile = 'button-add' },
    @{ Selector = 'custom-button-item'; Component = 'CustomButtonItem'; NewSelector = 'il-button-item'; NewComponent = 'WebButtonLabelItem'; NewFile = 'button-item' },
    @{ Selector = 'custom-button-download'; Component = 'CustomButtonDownload'; NewSelector = 'il-button-download'; NewComponent = 'WebButtonLabelDownload'; NewFile = 'button-download' },
    @{ Selector = 'custom-button-confirm'; Component = 'CustomButtonConfirm'; NewSelector = 'il-button-confirm'; NewComponent = 'WebButtonLabelConfirm'; NewFile = 'button-confirm' },
    @{ Selector = 'custom-button-view-pdf'; Component = 'CustomButtonViewPdf'; NewSelector = 'il-button-view-pdf'; NewComponent = 'WebButtonLabelViewPdf'; NewFile = 'button-view-pdf' },
    @{ Selector = 'custom-button-send-email'; Component = 'CustomButtonSendEmail'; NewSelector = 'il-button-send-email'; NewComponent = 'WebButtonLabelSendEmail'; NewFile = 'button-send-email' },
    @{ Selector = 'custom-button-tracking'; Component = 'CustomButtonTracking'; NewSelector = 'il-button-tracking'; NewComponent = 'WebButtonLabelTracking'; NewFile = 'button-tracking' },
    @{ Selector = 'custom-button-active-desactive'; Component = 'CustomButtonActiveDesactive'; NewSelector = 'il-button-active-desactive'; NewComponent = 'WebButtonLabelActiveDesactive'; NewFile = 'button-active-desactive' },
    @{ Selector = 'custom-button'; Component = 'CustomButton'; NewSelector = 'il-button'; NewComponent = 'WebButtonLabel'; NewFile = 'button' }
)

# Files to exclude
$excludePatterns = @('**/legacy/**', '*.spec.ts', '*.test.ts')

# Get all .ts and .html files in features directory
$tsFiles = Get-ChildItem -Recurse -Filter "*.ts" -LiteralPath "src/app/features" | Where-Object {
    $skip = $false
    foreach ($pattern in $excludePatterns) {
        if ($_.FullName -like $pattern) { $skip = $true; break }
        if ($_.Name -like $pattern) { $skip = $true; break }
    }
    -not $skip
}

$htmlFiles = Get-ChildItem -Recurse -Filter "*.html" -LiteralPath "src/app/features" | Where-Object {
    $skip = $false
    foreach ($pattern in $excludePatterns) {
        if ($_.FullName -like $pattern) { $skip = $true; break }
        if ($_.Name -like $pattern) { $skip = $true; break }
    }
    -not $skip
}

Write-Host "Found $($tsFiles.Count) .ts files and $($htmlFiles.Count) .html files to process"

# ==========================================
# STEP 1: Migrate .ts files
# ==========================================
$tsChanged = 0
foreach ($file in $tsFiles) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    $hasChanges = $false
    
    # Check if file contains any legacy references
    if ($content -match 'custom-button|buttons/legacy') {
        foreach ($m in $migrations) {
            # 1. Replace full import path: "src/app/core/components/buttons/legacy/buttons/custom-button-xxx"
            $oldImport = "src/app/core/components/buttons/legacy/buttons/$($m.Selector)"
            $newImport = "src/app/core/components/buttons/web/label/$($m.NewFile)"
            $content = $content -replace [regex]::Escape($oldImport), $newImport
            
            # 2. Replace class name in import statement
            $oldClass = "$($m.Component)"
            $newClass = "$($m.NewComponent)"
            $content = $content -replace [regex]::Escape($oldClass), $newClass
            
            # Also handle the "from ...legacy/buttons" barrel import pattern
            # e.g., } from "src/app/core/components/buttons/legacy/buttons";
            # This needs special handling for inline templates too
            if ($content -match 'from "src/app/core/components/buttons/legacy/buttons"') {
                # This barrel import exports multiple things; handle individually
            }
        }
        
        if ($content -ne $original) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            $tsChanged++
            Write-Host "  MIGRATED TS: $($file.FullName)"
        }
    }
}

Write-Host "
Migrated $tsChanged .ts files"

# ==========================================
# STEP 2: Migrate .html files
# ==========================================
$htmlChanged = 0
foreach ($file in $htmlFiles) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    $hasChanges = $false
    
    if ($content -match 'custom-button') {
        foreach ($m in $migrations) {
            # Replace opening tags: <custom-button-xxx ...> or <custom-button-xxx/>
            $oldOpen = "<$($m.Selector)"
            $newOpen = "<$($m.NewSelector)"
            $content = $content -replace [regex]::Escape($oldOpen), $newOpen
            
            # Replace closing tags: </custom-button-xxx>
            $oldClose = "</$($m.Selector)>"
            $newClose = "</$($m.NewSelector)>"
            $content = $content -replace [regex]::Escape($oldClose), $newClose
        }
        
        # Remove showLabelOnDesktop attribute (not supported in new components)
        $content = $content -replace '\s*\[?showLabelOnDesktop\]?\s*=\s*"[^"]*"', ''
        $content = $content -replace '\s*\[?showLabelOnDesktop\]?\s*=\s*\'[^\']*\'', ''
        
        if ($content -ne $original) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
            $htmlChanged++
            Write-Host "  MIGRATED HTML: $($file.FullName)"
        }
    }
}

Write-Host "
Migrated $htmlChanged .html files"
Write-Host "
Migration complete!"