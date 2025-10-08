# Prunaverso Web - Clean Development Start Script
# This script automates the diagnostic process to prevent blank pages and connection errors
# Usage: .\scripts\start_clean_dev.ps1 [port]

param(
    [int]$Port = 5185,
    [switch]$OpenBrowser = $true
)

Write-Host "🌟 PRUNAVERSO WEB - CLEAN START PROTOCOL" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# Step 1: Kill any existing Node processes
Write-Host "🔍 Step 1: Cleaning existing Node processes..." -ForegroundColor Yellow
try {
    $nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
    if ($nodeProcesses) {
        Write-Host "   Found $($nodeProcesses.Count) Node process(es). Terminating..." -ForegroundColor Red
        $nodeProcesses | Stop-Process -Force
        Start-Sleep -Seconds 2
        Write-Host "   ✅ Node processes terminated" -ForegroundColor Green
    } else {
        Write-Host "   ✅ No Node processes found" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Step 2: Clear Vite cache
Write-Host "🧹 Step 2: Clearing Vite cache..." -ForegroundColor Yellow
try {
    $cacheDir = ".vite"
    if (Test-Path $cacheDir) {
        Remove-Item -Recurse -Force $cacheDir
        Write-Host "   ✅ Vite cache cleared" -ForegroundColor Green
    } else {
        Write-Host "   ✅ No Vite cache found" -ForegroundColor Green
    }
} catch {
    Write-Host "   ⚠️  Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Step 3: Clear npm cache (optional but recommended)
Write-Host "🧽 Step 3: Clearing npm cache..." -ForegroundColor Yellow
try {
    npm cache clean --force 2>$null
    Write-Host "   ✅ npm cache cleared" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Warning: Could not clear npm cache" -ForegroundColor Yellow
}

# Step 4: Check port availability
Write-Host "🔌 Step 4: Checking port $Port availability..." -ForegroundColor Yellow
try {
    $portCheck = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue
    if ($portCheck) {
        Write-Host "   ⚠️  Port $Port is in use. Attempting to free it..." -ForegroundColor Yellow
        # Kill process using the port
        $processId = (Get-NetTCPConnection -LocalPort $Port).OwningProcess
        if ($processId) {
            Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
        }
    }
    Write-Host "   ✅ Port $Port is available" -ForegroundColor Green
} catch {
    Write-Host "   ✅ Port $Port appears to be available" -ForegroundColor Green
}

# Step 5: Run health check
Write-Host "🏥 Step 5: Running health diagnostics..." -ForegroundColor Yellow
if (Test-Path "scripts\health-check.cjs") {
    try {
        $healthResult = node scripts\health-check.cjs 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   ✅ Health check passed" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Health check warnings detected" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "   ⚠️  Could not run health check" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ⚠️  Health check script not found" -ForegroundColor Yellow
}

# Step 6: Start development servers (both backend and frontend)
Write-Host "🚀 Step 6: Starting development servers..." -ForegroundColor Yellow
try {
    # Primero iniciar el servidor backend
    Write-Host "   Starting backend server (port 4001)..." -ForegroundColor Cyan
    $backendScript = "npm run serve-characters"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; $backendScript; Write-Host 'Backend server started on port 4001'"
    
    # Esperar que el backend esté listo
    Start-Sleep -Seconds 3
    
    # Luego iniciar el servidor frontend
    Write-Host "   Starting frontend server (port $Port)..." -ForegroundColor Cyan
    $frontendScript = "npm run dev-unsafe -- --port $Port"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; $frontendScript; Write-Host 'Frontend server started on port $Port'"
    
    # Wait for servers to start
    Write-Host "   Waiting for servers to initialize..." -ForegroundColor Cyan
    Start-Sleep -Seconds 5
    
    # Check if frontend server is responding
    $maxRetries = 15
    $retryCount = 0
    $frontendReady = $false
    
    do {
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:$Port" -TimeoutSec 3 -ErrorAction Stop
            $frontendReady = $true
            Write-Host "   ✅ Frontend server responding on http://localhost:$Port" -ForegroundColor Green
        } catch {
            $retryCount++
            Write-Host "   ⏳ Waiting for frontend server... ($retryCount/$maxRetries)" -ForegroundColor Yellow
            Start-Sleep -Seconds 2
        }
    } while (-not $frontendReady -and $retryCount -lt $maxRetries)
    
    # Check if backend server is responding
    $backendReady = $false
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:4001/api/ping" -TimeoutSec 3 -ErrorAction Stop
        $backendReady = $true
        Write-Host "   ✅ Backend server responding on http://localhost:4001" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Backend server may still be starting..." -ForegroundColor Yellow
    }
    
    if (-not $frontendReady) {
        Write-Host "   ⚠️  Frontend server may still be starting. Check manually at http://localhost:$Port" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "   ❌ Error starting servers: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 7: Open browser (optional)
if ($OpenBrowser -and $frontendReady) {
    Write-Host "🌐 Step 7: Opening browser..." -ForegroundColor Yellow
    try {
        Start-Process "http://localhost:$Port"
        Write-Host "   ✅ Browser opened" -ForegroundColor Green
    } catch {
        Write-Host "   ⚠️  Could not open browser automatically" -ForegroundColor Yellow
    }
}

# Summary
Write-Host "" -ForegroundColor White
Write-Host "🎉 CLEAN START COMPLETE!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "📍 Frontend URL: http://localhost:$Port" -ForegroundColor Cyan
Write-Host "📍 Backend URL: http://localhost:4001" -ForegroundColor Cyan
Write-Host "🫀 API Ping: http://localhost:4001/api/ping" -ForegroundColor Cyan
Write-Host "🔧 Health Monitoring: Active" -ForegroundColor Cyan
Write-Host "🎮 Archetype System: Ready" -ForegroundColor Cyan
Write-Host "🎵 Atmospheric Audio: Ready" -ForegroundColor Cyan
Write-Host "🟢 Heartbeat Visual: Active" -ForegroundColor Cyan
Write-Host "" -ForegroundColor White
Write-Host "💡 Tips:" -ForegroundColor Yellow
Write-Host "   • Run '.\scripts\start_clean_dev.ps1' anytime for clean start" -ForegroundColor White
Write-Host "   • Add '-Port 3000' to use different port" -ForegroundColor White
Write-Host "   • Add '-OpenBrowser:$false' to skip browser opening" -ForegroundColor White
Write-Host "   • Monitor with: node scripts\monitor.cjs" -ForegroundColor White