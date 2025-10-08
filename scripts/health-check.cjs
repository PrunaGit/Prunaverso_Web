#!/usr/bin/env node

/**
 * 🏥 PROTOCOLO DE VERIFICACIÓN DE SALUD - PRUNAVERSO WEB
 * 
 * Verifica todas las condiciones críticas para evitar páginas en blanco
 * y errores de conexión. Ejecuta autorecuperación cuando es necesario.
 */

const fs = require('fs')
const path = require('path')
const { execSync, spawn } = require('child_process')
const http = require('http')

// Configuración
const CONFIG = {
  DEV_PORT: 5179,
  PROD_PORT: 3000,
  HEALTH_TIMEOUT: 5000,
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000,
  CRITICAL_FILES: [
    'src/App.jsx',
    'src/main.jsx',
    'src/router.jsx',
    'package.json',
    'vite.config.js',
    'index.html'
  ],
  CRITICAL_ROUTES: [
    '/',
    '/portal',
    '/characters',
    '/arquetipos'
  ]
}

class PrunaversoHealthChecker {
  constructor() {
    this.logs = []
    this.startTime = Date.now()
  }

  log(level, message, details = null) {
    const timestamp = new Date().toISOString()
    const logEntry = { timestamp, level, message, details }
    this.logs.push(logEntry)
    
    const colorCode = {
      'INFO': '\x1b[36m',
      'WARN': '\x1b[33m', 
      'ERROR': '\x1b[31m',
      'SUCCESS': '\x1b[32m'
    }[level] || '\x1b[0m'
    
    console.log(`${colorCode}[${timestamp}] ${level}: ${message}\x1b[0m`)
    if (details) console.log(`  📄 Details:`, details)
  }

  // ✅ Verificar archivos críticos
  async checkCriticalFiles() {
    this.log('INFO', '🔍 Verificando archivos críticos...')
    
    const missing = []
    const corrupted = []
    
    for (const file of CONFIG.CRITICAL_FILES) {
      const filePath = path.join(process.cwd(), file)
      
      if (!fs.existsSync(filePath)) {
        missing.push(file)
        continue
      }
      
      try {
        const content = fs.readFileSync(filePath, 'utf8')
        
        // Verificaciones específicas por tipo de archivo
        if (file.endsWith('.jsx') || file.endsWith('.js')) {
          if (content.includes('import') && !content.includes('export')) {
            corrupted.push(`${file}: Sin exports`)
          }
        }
        
        if (file === 'package.json') {
          JSON.parse(content) // Verificar JSON válido
        }
        
      } catch (error) {
        corrupted.push(`${file}: ${error.message}`)
      }
    }
    
    if (missing.length > 0) {
      this.log('ERROR', 'Archivos críticos faltantes', missing)
      return false
    }
    
    if (corrupted.length > 0) {
      this.log('WARN', 'Archivos potencialmente corruptos', corrupted)
    }
    
    this.log('SUCCESS', '✅ Archivos críticos verificados')
    return true
  }

  // 🔌 Verificar dependencias
  async checkDependencies() {
    this.log('INFO', '📦 Verificando dependencias...')
    
    try {
      // Verificar node_modules
      if (!fs.existsSync('node_modules')) {
        this.log('WARN', 'node_modules no encontrado, instalando...')
        execSync('npm install', { stdio: 'inherit' })
      }
      
      // Verificar dependencias críticas
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
      const criticalDeps = ['react', 'vite', 'framer-motion']
      
      for (const dep of criticalDeps) {
        const depPath = path.join('node_modules', dep)
        if (!fs.existsSync(depPath)) {
          this.log('WARN', `Dependencia crítica faltante: ${dep}, instalando...`)
          execSync(`npm install ${dep}`, { stdio: 'inherit' })
        }
      }
      
      this.log('SUCCESS', '✅ Dependencias verificadas')
      return true
      
    } catch (error) {
      this.log('ERROR', 'Error verificando dependencias', error.message)
      return false
    }
  }

  // 🌐 Verificar conectividad del servidor
  async checkServerHealth(port = CONFIG.DEV_PORT) {
    this.log('INFO', `🌐 Verificando servidor en puerto ${port}...`)
    
    return new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: port,
        path: '/',
        method: 'GET',
        timeout: CONFIG.HEALTH_TIMEOUT
      }, (res) => {
        if (res.statusCode === 200) {
          this.log('SUCCESS', `✅ Servidor respondiendo en puerto ${port}`)
          resolve(true)
        } else {
          this.log('WARN', `Servidor respondió con código ${res.statusCode}`)
          resolve(false)
        }
      })
      
      req.on('error', (error) => {
        this.log('WARN', `Error conectando al servidor: ${error.message}`)
        resolve(false)
      })
      
      req.on('timeout', () => {
        this.log('WARN', 'Timeout conectando al servidor')
        req.destroy()
        resolve(false)
      })
      
      req.end()
    })
  }

  // 🔄 Verificar rutas críticas
  async checkCriticalRoutes(port = CONFIG.DEV_PORT) {
    this.log('INFO', '🛣️ Verificando rutas críticas...')
    
    const failedRoutes = []
    
    for (const route of CONFIG.CRITICAL_ROUTES) {
      try {
        const isHealthy = await this.checkRoute(port, route)
        if (!isHealthy) {
          failedRoutes.push(route)
        }
      } catch (error) {
        failedRoutes.push(route)
        this.log('WARN', `Error verificando ruta ${route}`, error.message)
      }
    }
    
    if (failedRoutes.length > 0) {
      this.log('WARN', 'Rutas con problemas', failedRoutes)
      return false
    }
    
    this.log('SUCCESS', '✅ Todas las rutas críticas funcionando')
    return true
  }

  async checkRoute(port, route) {
    return new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: port,
        path: route,
        method: 'GET',
        timeout: CONFIG.HEALTH_TIMEOUT
      }, (res) => {
        resolve(res.statusCode === 200)
      })
      
      req.on('error', () => resolve(false))
      req.on('timeout', () => {
        req.destroy()
        resolve(false)
      })
      
      req.end()
    })
  }

  // 🚀 Autorecuperación del servidor
  async recoverServer() {
    this.log('INFO', '🚑 Iniciando autorecuperación del servidor...')
    
    try {
      // 1. Limpiar procesos zombie
      this.log('INFO', 'Limpiando procesos zombie...')
      try {
        execSync('taskkill /F /IM node.exe', { stdio: 'ignore' })
      } catch {} // Ignorar si no hay procesos
      
      // 2. Limpiar caché
      this.log('INFO', 'Limpiando caché...')
      try {
        execSync('rmdir /s /q node_modules\\.vite', { stdio: 'ignore' })
      } catch {} // Ignorar si no existe
      
      // 3. Reinstalar dependencias si es necesario
      const depsOk = await this.checkDependencies()
      if (!depsOk) {
        this.log('INFO', 'Reinstalando dependencias...')
        execSync('npm ci', { stdio: 'inherit' })
      }
      
      // 4. Iniciar servidor
      this.log('INFO', 'Iniciando servidor de desarrollo...')
      const serverProcess = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        detached: true
      })
      
      // 5. Esperar a que el servidor esté listo
      await this.waitForServer()
      
      this.log('SUCCESS', '✅ Servidor recuperado exitosamente')
      return true
      
    } catch (error) {
      this.log('ERROR', 'Error en autorecuperación', error.message)
      return false
    }
  }

  async waitForServer(maxWait = 30000) {
    const startTime = Date.now()
    
    while (Date.now() - startTime < maxWait) {
      const isHealthy = await this.checkServerHealth()
      if (isHealthy) return true
      
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    return false
  }

  // 📊 Ejecutar verificación completa
  async runFullCheck() {
    this.log('INFO', '🏥 Iniciando verificación completa de salud...')
    
    const results = {
      files: await this.checkCriticalFiles(),
      dependencies: await this.checkDependencies(),
      server: await this.checkServerHealth(),
      routes: false
    }
    
    if (results.server) {
      results.routes = await this.checkCriticalRoutes()
    }
    
    const allHealthy = Object.values(results).every(Boolean)
    
    if (allHealthy) {
      this.log('SUCCESS', '🎉 Sistema completamente saludable')
      return { healthy: true, results }
    } else {
      this.log('WARN', '⚠️ Sistema requiere atención', results)
      
      // Intentar autorecuperación si el servidor no responde
      if (!results.server) {
        const recovered = await this.recoverServer()
        if (recovered) {
          results.server = true
          results.routes = await this.checkCriticalRoutes()
        }
      }
      
      return { healthy: results.server && results.routes, results }
    }
  }

  // 📋 Generar reporte
  generateReport() {
    const duration = Date.now() - this.startTime
    
    return {
      timestamp: new Date().toISOString(),
      duration: `${duration}ms`,
      logs: this.logs,
      summary: {
        total_checks: this.logs.length,
        errors: this.logs.filter(l => l.level === 'ERROR').length,
        warnings: this.logs.filter(l => l.level === 'WARN').length,
        successes: this.logs.filter(l => l.level === 'SUCCESS').length
      }
    }
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const checker = new PrunaversoHealthChecker()
  
  checker.runFullCheck()
    .then(result => {
      const report = checker.generateReport()
      
      // Guardar reporte
      fs.writeFileSync(
        'health-report.json', 
        JSON.stringify(report, null, 2)
      )
      
      console.log('\n📊 Reporte guardado en: health-report.json')
      process.exit(result.healthy ? 0 : 1)
    })
    .catch(error => {
      console.error('💥 Error fatal en verificación:', error)
      process.exit(1)
    })
}

module.exports = PrunaversoHealthChecker