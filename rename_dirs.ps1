$paths = @("src/app/features/infrastructure", "src/app/features/system", "src/app/features/tenant")
$dirs = Get-ChildItem -Path $paths -Recurse -Directory | Select-Object -ExpandProperty FullName | Sort-Object Length -Descending

foreach ($dirPath in $dirs) {
    $parent = Split-Path -Path $dirPath -Parent
    $name = Split-Path -Path $dirPath -Leaf
    
    # Check if name contains any uppercase letters
    if ($name -cmatch '[A-Z]') {
        $lowerName = $name.ToLower()
        $tempName = $lowerName + "_temp"
        
        Write-Host "Renaming $dirPath to $lowerName"
        
        # Rename to temp name first to handle Windows case-insensitivity
        Rename-Item -Path $dirPath -NewName $tempName -Force
        
        $tempPath = Join-Path -Path $parent -ChildPath $tempName
        # Rename to final lowercase name
        Rename-Item -Path $tempPath -NewName $lowerName -Force
    }
}
