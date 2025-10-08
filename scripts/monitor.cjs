#!/usr/bin/env node

/**
 * 👁️ MONITOR CONTINUO - PRUNAVERSO WEB
 * 
 * Monitorea constantemente la salud del sistema y ejecuta 
 * autorecuperación automática cuando detecta problemas.
 */

const PrunaversoHealthChecker = require('./health-check.js')
const fs = require('fs')

class PrunaversoContinuousMonitor {
  constructor(options = {}) {
    this.checker = new PrunaversoHealthChecker()
    this.config = {
      interval: options.interval || 30000, // 30 segundos
      maxFailures: options.maxFailures || 3,
      alertWebhook: options.alertWebhook || null,
      logFile: options.logFile || 'monitor.log',
      ...options
    }
    
    this.consecutiveFailures = 0
    this.isRunning = false
    this.stats = {
      startTime: Date.now(),
      totalChecks: 0,
      totalFailures: 0,
      recoveryAttempts: 0,
      lastHealthyTime: Date.now()
    }
  }

  log(level, message, details = null) {
    const timestamp = new Date().toISOString()
    const logEntry = `[${timestamp}] ${level}: ${message}\n`
    
    // Escribir a archivo
    fs.appendFileSync(this.config.logFile, logEntry)
    
    // Escribir a consola
    console.log(logEntry.trim())
    if (details) console.log('  📄 Details:', details)
  }

  async start() {
    if (this.isRunning) {
      this.log('WARN', 'Monitor ya está ejecutándose')
      return
    }

    this.isRunning = true
    this.log('INFO', `🚀 Monitor iniciado (intervalo: ${this.config.interval}ms)`)
    
    // Verificación inicial
    await this.performCheck()
    
    // Configurar intervalo
    this.intervalId = setInterval(() => {
      this.performCheck()
    }, this.config.interval)

    // Configurar manejadores de señales
    process.on('SIGINT', () => this.stop())
    process.on('SIGTERM', () => this.stop())
  }

  async performCheck() {
    this.stats.totalChecks++
    
    try {
      const result = await this.checker.runFullCheck()
      
      if (result.healthy) {
        this.consecutiveFailures = 0
        this.stats.lastHealthyTime = Date.now()
        this.log('INFO', '✅ Sistema saludable')
      } else {
        this.consecutiveFailures++
        this.stats.totalFailures++
        
        this.log('WARN', `⚠️ Sistema no saludable (fallos consecutivos: ${this.consecutiveFailures})`)
        
        // Intentar recuperación automática
        if (this.consecutiveFailures >= 2) {
          await this.attemptRecovery()
        }
        
        // Alerta crítica
        if (this.consecutiveFailures >= this.config.maxFailures) {
          await this.sendCriticalAlert()
        }
      }
      
      // Guardar estadísticas
      this.saveStats()
      
    } catch (error) {
      this.log('ERROR', 'Error en verificación', error.message)
      this.consecutiveFailures++
      this.stats.totalFailures++
    }
  }

  async attemptRecovery() {
    this.log('INFO', '🚑 Intentando recuperación automática...')
    this.stats.recoveryAttempts++
    
    try {
      const recovered = await this.checker.recoverServer()
      
      if (recovered) {
        this.log('SUCCESS', '✅ Recuperación exitosa')
        this.consecutiveFailures = 0
        this.stats.lastHealthyTime = Date.now()
      } else {
        this.log('ERROR', '❌ Recuperación falló')
      }
      
    } catch (error) {
      this.log('ERROR', 'Error en recuperación', error.message)
    }
  }

  async sendCriticalAlert() {
    const alertData = {
      severity: 'CRITICAL',
      message: `Prunaverso Web está experimentando fallos críticos`,
      consecutiveFailures: this.consecutiveFailures,
      stats: this.stats,
      timestamp: new Date().toISOString()
    }
    
    this.log('ERROR', '🚨 ALERTA CRÍTICA: Sistema inestable', alertData)
    
    // Enviar webhook si está configurado
    if (this.config.alertWebhook) {
      try {
        const response = await fetch(this.config.alertWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(alertData)
        })
        
        if (response.ok) {
          this.log('INFO', '📨 Alerta enviada exitosamente')
        }
      } catch (error) {
        this.log('WARN', 'Error enviando alerta', error.message)
      }
    }
  }

  saveStats() {
    const uptime = Date.now() - this.stats.startTime
    const detailedStats = {
      ...this.stats,
      uptime: `${Math.floor(uptime / 1000)}s`,
      healthPercentage: this.stats.totalChecks > 0 
        ? ((this.stats.totalChecks - this.stats.totalFailures) / this.stats.totalChecks * 100).toFixed(2)
        : 100,
      lastCheck: new Date().toISOString()
    }
    
    fs.writeFileSync('monitor-stats.json', JSON.stringify(detailedStats, null, 2))
  }

  stop() {
    if (!this.isRunning) return
    
    this.isRunning = false
    
    if (this.intervalId) {
      clearInterval(this.intervalId)
    }
    
    this.log('INFO', '🛑 Monitor detenido')
    this.saveStats()
    
    process.exit(0)
  }

  getStatus() {
    const uptime = Date.now() - this.stats.startTime
    const timeSinceLastHealthy = Date.now() - this.stats.lastHealthyTime
    
    return {
      running: this.isRunning,
      uptime: Math.floor(uptime / 1000),
      consecutiveFailures: this.consecutiveFailures,
      timeSinceLastHealthy: Math.floor(timeSinceLastHealthy / 1000),
      stats: this.stats
    }
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  const monitor = new PrunaversoContinuousMonitor({
    interval: process.env.MONITOR_INTERVAL || 30000,
    maxFailures: process.env.MAX_FAILURES || 3
  })
  
  monitor.start().catch(error => {
    console.error('💥 Error fatal en monitor:', error)
    process.exit(1)
  })
}

module.exports = PrunaversoContinuousMonitor