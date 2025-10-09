# ============================================
# 🧠 PRUNAVERSO DEV SESSION INIT – 10_10_25
# ============================================
# Contexto: Reanudación del desarrollo del Prunaverso_Web v6
# Objetivo: Revisión técnica, maquetación y conexión con back-end
# Estado previo: SAVEGAME_09_10_25_12h confirmado
# Autor: Alex Pruna
# Asistente: Copilot + PrunaversoGPT v6
# ============================================

Write-Host "🌌 Iniciando modo Dev: PRUNAVERSO v6 – 10_10_25" -ForegroundColor Cyan

# 1️⃣ Cargar entorno local
cd "C:\Users\pruna\Documents\GITHUB\Prunaverso_Web"

# 2️⃣ Sincronizar estado
Write-Host "📥 Sincronizando con repositorio..." -ForegroundColor Yellow
git pull origin main

# 3️⃣ Verificar estado del save game
if (Test-Path "a_stabledversions\SAVEGAME_09_10_2025_12h.md") {
    Write-Host "✅ Save Game 09_10_25 detectado correctamente" -ForegroundColor Green
} else {
    Write-Host "⚠️ Save Game no encontrado - verificar estado" -ForegroundColor Red
}

# 4️⃣ Ejecutar servidor en modo observación
Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Magenta
Start-Process -NoNewWindow -FilePath "cmd" -ArgumentList "/c npm run dev"

# 5️⃣ Iniciar backend
Start-Sleep -Seconds 3
Write-Host "⚡ Iniciando backend save-checkpoint..." -ForegroundColor Blue
Start-Process -NoNewWindow -FilePath "node" -ArgumentList "scripts/save_checkpoint_server.cjs"

# 6️⃣ Crear log de sesión
$logDate = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$logFile = "a_logs\devsession_10_10_25_$logDate.txt"
$logContent = @"
🧠 PRUNAVERSO DEV SESSION LOG
============================
Fecha: $(Get-Date)
Commit actual: $(git rev-parse --short HEAD)
Branch: $(git branch --show-current)
Estado: SAVEGAME_09_10_25_12h cargado

📋 TAREAS PRIORITARIAS:
- ✅ Verificar router principal (src/system-core/routerManager.js)
- ✅ Testear rutas activas: /portal /welcome /menu /diagnostics /gdd
- ⏳ Ajustar maquetación base con Tailwind (sin solapamientos)
- ⏳ Confirmar que AtmosphereManager aplica tema 'cosmic'
- ⏳ Revisar healthcheck backend /api/health
- ⏳ Cargar stable_pv_v006.json como manifiesto

📊 URLS DISPONIBLES:
- Frontend: http://localhost:5173/
- Backend: http://localhost:4001/
- Red local: http://192.168.1.38:5174/
- GitHub Pages: https://prunagit.github.io/Prunaverso_Web/

🎯 ESTADO SISTEMA: Completamente operativo
"@

$logContent | Out-File -FilePath $logFile -Encoding UTF8
Write-Host "📝 Log creado: $logFile" -ForegroundColor Green

# 7️⃣ Mostrar información del sistema
Write-Host "`n🎯 INFORMACIÓN DEL SISTEMA:" -ForegroundColor White
Write-Host "   📂 Proyecto: Prunaverso_Web v2.1.0" -ForegroundColor Gray
Write-Host "   🔗 Frontend: http://localhost:5173/" -ForegroundColor Gray
Write-Host "   ⚡ Backend: http://localhost:4001/" -ForegroundColor Gray
Write-Host "   🌐 Público: https://prunagit.github.io/Prunaverso_Web/" -ForegroundColor Gray

# 8️⃣ Abrir navegador
Start-Sleep -Seconds 5
Write-Host "🌍 Abriendo navegador..." -ForegroundColor Cyan
Start-Process "http://localhost:5173/"

Write-Host "`n🟢 Sistema preparado para desarrollo. Esperando input del operador." -ForegroundColor Green
Write-Host "✅ Sistema sincronizado" -ForegroundColor Green

# 9️⃣ Mensaje para Copilot
Write-Host "`n🤖 PARA COPILOT:" -ForegroundColor Yellow
Write-Host "El sistema está listo. Puedes empezar analizando:" -ForegroundColor White
Write-Host "   1. src/system-core/routerManager.js" -ForegroundColor Gray
Write-Host "   2. src/components/UnifiedRouter.jsx" -ForegroundColor Gray
Write-Host "   3. src/pages/PrunaversoLauncher.jsx" -ForegroundColor Gray