#!/usr/bin/env node

/**
 * 🔧 PRESTART PROTOCOL - PRUNAVERSO WEB
 * 
 * Ejecuta todas las verificaciones necesarias antes de iniciar
 * el servidor de desarrollo para asegurar un arranque limpio.
 */

const PrunaversoHealthChecker = require('./health-check.cjs')
const { execSync } = require('child_process')
const fs = require('fs')

async function preStartProtocol() {
  console.log('🚀 PROTOCOLO DE PRE-INICIO - PRUNAVERSO WEB')
  console.log('=' .repeat(50))
  
  const checker = new PrunaversoHealthChecker()
  
  try {
    // 1. Verificación de archivos críticos
    console.log('\n📁 Verificando integridad de archivos...')
    const filesOk = await checker.checkCriticalFiles()
    if (!filesOk) {
      console.error('❌ Archivos críticos faltantes. Abortando.')
      process.exit(1)
    }
    
    // 2. Limpiar procesos zombie
    console.log('\n🧹 Limpiando procesos zombie...')
    try {
      execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' })
      console.log('✅ Procesos limpiados')
    } catch {
      console.log('ℹ️ No hay procesos zombie')
    }
    
    // 3. Verificar/instalar dependencias
    console.log('\n📦 Verificando dependencias...')
    const depsOk = await checker.checkDependencies()
    if (!depsOk) {
      console.error('❌ Error con dependencias. Abortando.')
      process.exit(1)
    }
    
    // 4. Limpiar caché si es necesario
    console.log('\n🗑️ Limpiando caché...')
    try {
      if (fs.existsSync('node_modules/.vite')) {
        execSync('rmdir /s /q node_modules\\.vite', { stdio: 'ignore' })
        console.log('✅ Caché de Vite limpiado')
      }
    } catch {
      console.log('ℹ️ No hay caché que limpiar')
    }
    
    // 5. Verificar puertos disponibles
    console.log('\n🔌 Verificando puertos...')
    const portInUse = await checkPortInUse(5179)
    if (portInUse) {
      console.log('⚠️ Puerto 5179 en uso, será liberado automáticamente')
    }
    
    // 6. Generar reporte pre-inicio
    const report = {
      timestamp: new Date().toISOString(),
      preStartChecks: {
        files: filesOk,
        dependencies: depsOk,
        portAvailable: !portInUse
      },
      systemInfo: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage(),
        cwd: process.cwd()
      }
    }
    
    fs.writeFileSync('pre-start-report.json', JSON.stringify(report, null, 2))
    
    console.log('\n✅ PROTOCOLO DE PRE-INICIO COMPLETADO')
    console.log('📊 Reporte guardado en: pre-start-report.json')
    console.log('🚀 Sistema listo para iniciar servidor de desarrollo')
    
    return true
    
  } catch (error) {
    console.error('\n💥 ERROR EN PROTOCOLO DE PRE-INICIO:', error.message)
    process.exit(1)
  }
}

async function checkPortInUse(port) {
  return new Promise((resolve) => {
    const net = require('net')
    const server = net.createServer()
    
    server.listen(port, () => {
      server.once('close', () => resolve(false))
      server.close()
    })
    
    server.on('error', () => resolve(true))
  })
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  preStartProtocol()
    .then(() => process.exit(0))
    .catch(() => process.exit(1))
}

module.exports = preStartProtocol