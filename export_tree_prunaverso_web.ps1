# ==============================================
#  export_tree_prunaverso_web.ps1
#  Autor: Alex Pruna
#  Funcion: Exporta el arbol completo del repositorio Prunaverso_Web
#           a un archivo .txt con timestamp
# ==============================================

# Ruta origen (repositorio)
$rootPath = "C:\Users\pruna\Documents\GITHUB\Prunaverso_Web"

# Ruta destino (carpeta donde guardar los trees)
$treesPath = Join-Path $rootPath "trees"

# Timestamp con formato YYYYMMDD_HHMM
$timestamp = Get-Date -Format "yyyyMMdd_HHmm"

# Nombre del archivo resultante
$outputFile = Join-Path $treesPath ("tree_" + $timestamp + ".txt")

# Crear carpeta de destino si no existe
if (!(Test-Path $treesPath)) {
    New-Item -ItemType Directory -Force -Path $treesPath | Out-Null
}

# Encabezado del archivo
"Tree generado: $timestamp" | Out-File $outputFile -Encoding utf8

# Recorrer todo el arbol de archivos y carpetas
Get-ChildItem -Path $rootPath -Recurse -Force | ForEach-Object {
    $indent = " " * ($_.FullName.Replace($rootPath, "").Split("\").Count - 1)
    $entryType = if ($_.PSIsContainer) { "/" } else { "" }
    $line = "$indent$($_.Name)$entryType"
    Add-Content -Path $outputFile -Value $line
}

# Mensaje de confirmacion
Write-Host "Arbol exportado con exito en:"
Write-Host "   $outputFile"
