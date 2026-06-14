$replacements = @{
    'ðŸ""Œ' = '🔌'
    'âœ…' = '✅'
    'âŒ' = '❌'
    'â³' = '⏳'
    'ðŸ›‘' = '🛑'
    'ðŸ¤' = '🤝'
    'ðŸ"' = '👋'
}

$files = Get-ChildItem -Path "src" -Recurse -File
$count = 0

foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        $original = $content
        $modified = $false

        foreach ($badEmoji in $replacements.Keys) {
            if ($content.Contains($badEmoji)) {
                $content = $content.Replace($badEmoji, $replacements[$badEmoji])
                $modified = $true
            }
        }

        if ($modified) {
            [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
            Write-Host "FIXED: $($file.FullName)" -ForegroundColor Green
            $count++
        }
    } catch {
        Write-Host "ERROR reading $($file.FullName): $_" -ForegroundColor Red
    }
}

Write-Host "`nTotal archivos reparados: $count" -ForegroundColor Cyan