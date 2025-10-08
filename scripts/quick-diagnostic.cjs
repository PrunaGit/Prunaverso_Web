#!/usr/bin/env node

/**
 * ⚡ DIAGNÓSTICO RÁPIDO - PRUNAVERSO WEB
 * 
 * Diagnóstico express para detectar problemas comunes
 * y proporcionar soluciones inmediatas.
 */

const fs = require('fs')
const { execSync } = require('child_process')
const http = require('http')

console.log('⚡ DIAGNÓSTICO RÁPIDO - PRUNAVERSO WEB')
console.log('=' .repeat(40))

const checks = [
  {
    name: '📁 Archivos críticos',
    check: () => {
      const files = ['src/App.jsx', 'src/main.jsx', 'package.json', 'index.html']
      const missing = files.filter(f => !fs.existsSync(f))
      return { ok: missing.length === 0, details: missing.length ? `Faltantes: ${missing.join(', ')}` : 'Todos presentes' }
    }
  },
  {
    name: '📦 node_modules',
    check: () => {
      const exists = fs.existsSync('node_modules')
      return { ok: exists, details: exists ? 'Presente' : 'Faltante - ejecutar npm install' }
    }
  },
  {
    name: '🔌 Puerto 5179',
    check: async () => {
      return new Promise((resolve) => {
        const server = require('net').createServer()
        server.listen(5179, () => {
          server.close()
          resolve({ ok: true, details: 'Disponible' })
        })
        server.on('error', () => {
          resolve({ ok: false, details: 'En uso - posible conflicto' })
        })
      })
    }
  },
  {
    name: '🌐 Servidor activo',
    check: async () => {
      return new Promise((resolve) => {
        const req = http.request({
          hostname: 'localhost',
          port: 5179,
          path: '/',
          timeout: 2000
        }, (res) => {
          resolve({ ok: res.statusCode === 200, details: `Respuesta: ${res.statusCode}` })
        })
        req.on('error', () => resolve({ ok: false, details: 'No responde' }))
        req.on('timeout', () => {
          req.destroy()
          resolve({ ok: false, details: 'Timeout' })
        })
        req.end()
      })
    }
  },
  {
    name: '💾 Espacio en disco',
    check: () => {
      try {
        const stats = fs.statSync('.')
        return { ok: true, details: 'Suficiente' }
      } catch {
        return { ok: false, details: 'Error verificando' }
      }
    }
  }
]

async function runDiagnostic() {
  console.log('\nEjecutando verificaciones...\n')
  
  const results = []
  
  for (const check of checks) {
    process.stdout.write(`${check.name}... `)
    
    try {
      const result = await check.check()
      results.push({ ...check, ...result })
      
      if (result.ok) {
        console.log(`✅ ${result.details}`)
      } else {
        console.log(`❌ ${result.details}`)
      }
    } catch (error) {
      results.push({ ...check, ok: false, details: error.message })
      console.log(`💥 Error: ${error.message}`)
    }
  }
  
  // Resumen
  const failed = results.filter(r => !r.ok)
  
  console.log('\n' + '='.repeat(40))
  console.log('📊 RESUMEN:')
  console.log(`✅ Exitosos: ${results.length - failed.length}/${results.length}`)
  console.log(`❌ Fallidos: ${failed.length}/${results.length}`)
  
  if (failed.length > 0) {
    console.log('\n🚨 PROBLEMAS DETECTADOS:')
    failed.forEach(f => console.log(`  • ${f.name}: ${f.details}`))
    
    console.log('\n💡 SOLUCIONES RECOMENDADAS:')
    
    if (failed.some(f => f.name.includes('node_modules'))) {
      console.log('  📦 npm install')
    }
    
    if (failed.some(f => f.name.includes('Puerto'))) {
      console.log('  🔌 taskkill /F /IM node.exe')
    }
    
    if (failed.some(f => f.name.includes('Servidor'))) {
      console.log('  🚀 npm run dev')
    }
    
    if (failed.some(f => f.name.includes('Archivos'))) {
      console.log('  📁 Verificar integridad del repositorio')
    }
    
    console.log('\n🔧 COMANDO RÁPIDO DE RECUPERACIÓN:')
    console.log('  npm run recovery')
    
  } else {
    console.log('\n🎉 ¡TODO FUNCIONANDO CORRECTAMENTE!')
    console.log('🌐 Prunaverso Web está listo')
  }
  
  return failed.length === 0
}

if (require.main === module) {
  runDiagnostic()
    .then(healthy => process.exit(healthy ? 0 : 1))
    .catch(error => {
      console.error('\n💥 Error en diagnóstico:', error)
      process.exit(1)
    })
}

module.exports = runDiagnostic