#!/usr/bin/env node

/**
 * 🔍 DIAGNÓSTICO UNIFICADO - PRUNAVERSO WEB
 * 
 * Script CLI que verifica ambos planos:
 * - Servidor backend (endpoints /api/*)
 * - Interfaz frontend (DOM + React)
 */

const http = require('http')
const https = require('https')
const fs = require('fs')

console.log('🔍 DIAGNÓSTICO UNIFICADO - PRUNAVERSO WEB')
console.log('=' .repeat(50))

const PORTS_TO_CHECK = [5173, 5174, 5175, 5179, 5180, 5185, 5190]
let activePort = null
let serverActive = false
let uiActive = false

/**
 * Función para hacer peticiones HTTP con timeout
 */
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const timeout = options.timeout || 5000
    const urlObj = new URL(url)
    const client = urlObj.protocol === 'https:' ? https : http
    
    const req = client.get(url, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }))
    })
    
    req.setTimeout(timeout, () => {
      req.destroy()
      reject(new Error(`Timeout after ${timeout}ms`))
    })
    
    req.on('error', (err) => {
      reject(err)
    })
  })
}

/**
 * 1. Detectar puerto activo del servidor
 */
async function detectActivePort() {
  console.log('🔌 Paso 1: Detectando puerto activo...')
  
  for (const port of PORTS_TO_CHECK) {
    try {
      const response = await makeRequest(`http://localhost:${port}`, { timeout: 2000 })
      if (response.status === 200) {
        activePort = port
        console.log(`   ✅ Puerto ${port} responde (HTTP ${response.status})`)
        return port
      }
    } catch (error) {
      // Silencioso, seguir probando
    }
  }
  
  console.log('   ❌ Ningún puerto encontrado activo')
  return null
}

/**
 * 2. Verificar HTML y presencia del root
 */
async function checkUIStructure() {
  if (!activePort) return false
  
  console.log('🌐 Paso 2: Verificando estructura de la UI...')
  
  try {
    const response = await makeRequest(`http://localhost:${activePort}`)
    
    if (response.status !== 200) {
      console.log(`   ❌ HTML no accesible (HTTP ${response.status})`)
      return false
    }
    
    const html = response.data
    
    // Verificar elementos críticos
    const hasRoot = html.includes('<div id="root">') || html.includes('id="root"')
    const hasReact = html.includes('react') || html.includes('React')
    const hasVite = html.includes('vite') || html.includes('@vite')
    
    console.log(`   📄 HTML obtenido: ${html.length} caracteres`)
    console.log(`   🎯 Root element: ${hasRoot ? '✅' : '❌'}`)
    console.log(`   ⚛️  React detectado: ${hasReact ? '✅' : '❌'}`)
    console.log(`   ⚡ Vite detectado: ${hasVite ? '✅' : '❌'}`)
    
    if (!hasRoot) {
      console.log('   ⚠️  Sin <div id="root"> - UI probablemente no funcional')
      return false
    }
    
    console.log('   ✅ Estructura HTML correcta')
    return true
    
  } catch (error) {
    console.log(`   ❌ Error obteniendo HTML: ${error.message}`)
    return false
  }
}

/**
 * 3. Verificar endpoints del servidor
 */
async function checkServerEndpoints() {
  if (!activePort) return false
  
  console.log('🔗 Paso 3: Verificando endpoints del servidor...')
  
  const endpoints = [
    { path: '/api/ping', name: 'Ping' },
    { path: '/api/render-alive', name: 'Render Alive', method: 'POST' },
    { path: '/api/characters', name: 'Characters' }
  ]
  
  let endpointsWorking = 0
  
  for (const endpoint of endpoints) {
    try {
      const url = `http://localhost:${activePort}${endpoint.path}`
      
      if (endpoint.method === 'POST') {
        // Para POST, usar fetch simulation
        const response = await makeRequest(url, { timeout: 3000 })
        console.log(`   📍 ${endpoint.name}: ✅ (${response.status})`)
        endpointsWorking++
      } else {
        const response = await makeRequest(url, { timeout: 3000 })
        if (response.status === 200) {
          console.log(`   📍 ${endpoint.name}: ✅ (${response.status})`)
          endpointsWorking++
        } else {
          console.log(`   📍 ${endpoint.name}: ⚠️  (${response.status})`)
        }
      }
    } catch (error) {
      console.log(`   📍 ${endpoint.name}: ❌ (${error.message})`)
    }
  }
  
  const allWorking = endpointsWorking === endpoints.length
  console.log(`   🎯 Endpoints funcionando: ${endpointsWorking}/${endpoints.length}`)
  
  return endpointsWorking > 0
}

/**
 * 4. Diagnóstico final
 */
async function finalDiagnosis() {
  console.log('')
  console.log('📊 DIAGNÓSTICO FINAL')
  console.log('=' .repeat(30))
  
  if (!activePort) {
    console.log('🔴 ESTADO: SERVIDOR COMPLETAMENTE INACTIVO')
    console.log('')
    console.log('💡 SOLUCIÓN RECOMENDADA:')
    console.log('   1. cd c:\\Users\\pruna\\Documents\\GITHUB\\Prunaverso_Web')
    console.log('   2. npm run dev -- --port 5185')
    console.log('')
    return false
  }
  
  console.log(`🟢 Puerto activo encontrado: ${activePort}`)
  
  if (serverActive && uiActive) {
    console.log('🟢 ESTADO: ENTORNO COMPLETAMENTE PERCEPTIVO')
    console.log(`📍 URL: http://localhost:${activePort}`)
    console.log('🎯 Todo funcionando correctamente')
  } else if (serverActive && !uiActive) {
    console.log('🟡 ESTADO: SERVIDOR ACTIVO, INTERFAZ NO PERCEPTIBLE')
    console.log('⚠️  El servidor responde pero la UI puede tener problemas')
    console.log('')
    console.log('💡 SOLUCIONES:')
    console.log('   • Verificar consola del navegador (F12)')
    console.log('   • Limpiar caché: Ctrl+Shift+R')
    console.log('   • Reiniciar servidor: npm run dev')
  } else if (!serverActive && uiActive) {
    console.log('🟡 ESTADO: INTERFAZ ACTIVA, SERVIDOR NO PERCEPTIBLE')
    console.log('⚠️  La página carga pero los endpoints no responden')
    console.log('')
    console.log('💡 SOLUCIONES:')
    console.log('   • Verificar que el servidor backend esté iniciado')
    console.log('   • Ejecutar: npm run serve-characters')
  } else {
    console.log('🔴 ESTADO: PROBLEMAS EN AMBOS PLANOS')
    console.log('❌ Ni servidor ni interfaz están completamente funcionales')
    console.log('')
    console.log('💡 SOLUCIÓN COMPLETA:')
    console.log('   1. Matar procesos: Get-Process node | Stop-Process -Force')
    console.log('   2. Limpiar caché: Remove-Item -Recurse -Force .\\.vite')
    console.log('   3. Reiniciar: npm run dev -- --port 5185')
  }
  
  console.log('')
  return serverActive && uiActive
}

/**
 * Ejecución principal
 */
async function main() {
  try {
    // Paso 1: Detectar puerto
    activePort = await detectActivePort()
    
    // Paso 2: Verificar UI
    uiActive = await checkUIStructure()
    
    // Paso 3: Verificar servidor
    serverActive = await checkServerEndpoints()
    
    // Paso 4: Diagnóstico final
    const isHealthy = await finalDiagnosis()
    
    process.exit(isHealthy ? 0 : 1)
    
  } catch (error) {
    console.error('💥 Error durante el diagnóstico:', error.message)
    process.exit(1)
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  main()
}