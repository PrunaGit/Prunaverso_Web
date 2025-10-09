# 🧠 PRUNAVERSO DEV SESSION INIT – 10_10_25
# Copia y pega este bloque completo en PowerShell de VSCode

cd "C:\Users\pruna\Documents\GITHUB\Prunaverso_Web"
Write-Host "🌌 Iniciando PRUNAVERSO v6 – 10_10_25" -ForegroundColor Cyan
git pull origin main
npm run dev

# Después de que inicie el servidor (30 segundos), ejecuta en otra terminal:
# node scripts/save_checkpoint_server.cjs

# URLs disponibles:
# 🔗 http://localhost:5173/ (desarrollo)
# 🌐 https://prunagit.github.io/Prunaverso_Web/ (público)

Write-Host "✅ Sistema listo - URL: http://localhost:5173/" -ForegroundColor Green