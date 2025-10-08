#!/usr/bin/env powershell
# 🌍 WATCH DEPLOYMENT - Monitor GitHub Pages en tiempo real
# Monitorea el deployment hasta que esté activo

param(
    [int]$MaxChecks = 20,
    [int]$IntervalSeconds = 15
)

$URL = "https://prunagit.github.io/Prunaverso_Web/"
$CheckCount = 0
$StartTime = Get-Date

Write-Host "🚀 MONITOR DE DEPLOYMENT PRUNAVERSO WEB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔗 URL: $URL" -ForegroundColor White
Write-Host "⏱️  Inicio: $($StartTime.ToString('HH:mm:ss'))" -ForegroundColor White
Write-Host "🔄 Chequeando cada $IntervalSeconds segundos..." -ForegroundColor White
Write-Host ""

while ($CheckCount -lt $MaxChecks) {
    $CheckCount++
    $CurrentTime = Get-Date
    $ElapsedTime = $CurrentTime - $StartTime
    
    Write-Host "[$CheckCount/$MaxChecks] $(Get-Date -Format 'HH:mm:ss') - " -NoNewline -ForegroundColor Gray
    
    try {
        $Response = Invoke-WebRequest -Uri $URL -Method Head -TimeoutSec 10 -ErrorAction Stop
        
        Write-Host "🎉 ¡PRUNAVERSO ACTIVO!" -ForegroundColor Green
        Write-Host "✅ Status: $($Response.StatusCode)" -ForegroundColor Green
        Write-Host "⏱️  Tiempo total: $($ElapsedTime.ToString('mm\:ss'))" -ForegroundColor Green
        Write-Host ""
        Write-Host "🌍 El Prunaverso está VIVO en internet:" -ForegroundColor Cyan
        Write-Host "🔗 $URL" -ForegroundColor White
        Write-Host ""
        Write-Host "🚀 ¡Listo para la Fase II - HUD Prunaversales!" -ForegroundColor Magenta
        
        # Verificar algunas rutas importantes
        Write-Host ""
        Write-Host "🧪 Verificando rutas críticas..." -ForegroundColor Yellow
        
        $Routes = @(
            "/",
            "/data/characters_index.json",
            "/data/fractal_index.json"
        )
        
        foreach ($Route in $Routes) {
            try {
                $TestURL = $URL.TrimEnd('/') + $Route
                $TestResponse = Invoke-WebRequest -Uri $TestURL -Method Head -TimeoutSec 5 -ErrorAction Stop
                Write-Host "  ✅ $Route - OK" -ForegroundColor Green
            } catch {
                Write-Host "  ⚠️  $Route - Pendiente" -ForegroundColor Yellow
            }
        }
        
        exit 0
        
    } catch {
        Write-Host "⏳ Propagándose..." -ForegroundColor Yellow
        
        if ($CheckCount -eq $MaxChecks) {
            Write-Host ""
            Write-Host "🕐 Tiempo límite alcanzado ($($ElapsedTime.ToString('mm\:ss')))" -ForegroundColor Yellow
            Write-Host "🔍 GitHub Pages puede tardar hasta 10 minutos en la primera activación" -ForegroundColor White
            Write-Host "🌐 Verifica manualmente: $URL" -ForegroundColor White
            Write-Host "📊 GitHub Actions: https://github.com/PrunaGit/Prunaverso_Web/actions" -ForegroundColor White
        }
    }
    
    if ($CheckCount -lt $MaxChecks) {
        Start-Sleep -Seconds $IntervalSeconds
    }
}

Write-Host ""
Write-Host "🔚 Monitor finalizado" -ForegroundColor Gray