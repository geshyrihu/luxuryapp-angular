$paths = @(
    "src/app/features/infrastructure",
    "src/app/features/system",
    "src/app/features/tenant"
)

foreach ($rootPath in $paths) {
    $fullRoot = Resolve-Path $rootPath -ErrorAction SilentlyContinue
    if ($null -ne $fullRoot) {
        Write-Host "Processing root: $($fullRoot.Path)"
        
        # Get all subdirectories
        $dirs = Get-ChildItem -Path $fullRoot.Path -Recurse -Directory | Select-Object -ExpandProperty FullName
        # Include the root itself
        $dirs += $fullRoot.Path
        
        # Sort by length descending to process deepest children first
        $sortedDirs = $dirs | Sort-Object -Property { $_.Length } -Descending
        
        foreach ($dir in $sortedDirs) {
            $item = Get-Item $dir
            $oldName = $item.Name
            $newName = $oldName.ToLower()
            
            if ($oldName -cne $newName) {
                $parent = Split-Path $dir
                $tempName = $newName + "_temp_" + [Guid]::NewGuid().ToString().Substring(0,8)
                $tempPath = Join-Path $parent $tempName
                $finalPath = Join-Path $parent $newName
                
                Write-Host "Renaming '$dir' to '$newName'"
                
                # Double rename to bypass Windows case-insensitivity
                Rename-Item -Path $dir -NewName $tempName -Force
                Rename-Item -Path $tempPath -NewName $newName -Force
            }
        }
    } else {
        Write-Warning "Root path not found: $rootPath"
    }
}
