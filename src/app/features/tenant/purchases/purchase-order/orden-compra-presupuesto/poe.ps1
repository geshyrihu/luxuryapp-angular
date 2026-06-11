# Ruta base (puedes cambiarla si lo ejecutas desde otro lugar)
$basePath = "D:\repos\luxuryapp-api\LuxuryApp.Application\ModulsApp\RecursosHumanos"

# Archivo de salida
$outputFile = Join-Path $basePath "todos_los_cs.txt"

# Obtener todos los archivos .cs recursivamente
$csFiles = Get-ChildItem -Path $basePath -Filter "*.cs" -Recurse -File

# Si ya existe el archivo, lo eliminamos para empezar limpio
if (Test-Path $outputFile) {
  Remove-Item $outputFile
}

# Recorrer cada archivo y agregar su contenido al archivo de salida
foreach ($file in $csFiles) {
  # Agregar encabezado con la ruta relativa del archivo
  "`n========================================" | Out-File -FilePath $outputFile -Encoding UTF8 -Append
  "Archivo: $($file.FullName.Replace($basePath, ''))" | Out-File -FilePath $outputFile -Encoding UTF8 -Append
  "========================================`n" | Out-File -FilePath $outputFile -Encoding UTF8 -Append
    
  # Leer y escribir el contenido del archivo .cs
  Get-Content $file.FullName | Out-File -FilePath $outputFile -Encoding UTF8 -Append
}

Write-Host "✅ Proceso completado. Archivo generado: $outputFile" -ForegroundColor Green