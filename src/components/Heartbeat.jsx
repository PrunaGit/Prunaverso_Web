import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * 🫀 HEARTBEAT VISUAL - UI-Level Sensor
 * 
 * Componente React siempre visible que confirma si el motor simbólico
 * está realmente vivo mediante pings cada 3 segundos.
 */
export default function Heartbeat() {
  const [status, setStatus] = useState('unknown') // 'alive', 'dead', 'unknown'
  const [lastPing, setLastPing] = useState(null)
  const [details, setDetails] = useState('')

  useEffect(() => {
    let intervalId
    
    const ping = async () => {
      try {
        const response = await fetch('/api/ping', {
          method: 'GET',
          timeout: 2000
        })
        
        if (response.ok) {
          const data = await response.json()
          setStatus('alive')
          setLastPing(new Date().toLocaleTimeString())
          setDetails(`Server OK - ${data.t || 'no timestamp'}`)
        } else {
          setStatus('dead')
          setDetails(`HTTP ${response.status}`)
        }
      } catch (error) {
        setStatus('dead')
        setDetails(error.message || 'Connection failed')
      }
    }

    // Ping inicial
    ping()
    
    // Ping cada 3 segundos
    intervalId = setInterval(ping, 3000)

    return () => {
      if (intervalId) clearInterval(intervalId)
    }
  }, [])

  const getStatusIcon = () => {
    switch (status) {
      case 'alive': return '🟢'
      case 'dead': return '🔴'
      default: return '🟡'
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case 'alive': return '#10B981' // green-500
      case 'dead': return '#EF4444'  // red-500
      default: return '#F59E0B'       // amber-500
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed bottom-4 right-4 z-50"
    >
      <motion.div
        className="flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl px-3 py-2 text-sm"
        style={{ borderColor: getStatusColor() }}
        whileHover={{ scale: 1.05 }}
        animate={{
          boxShadow: status === 'alive' 
            ? `0 0 20px ${getStatusColor()}40`
            : `0 0 10px ${getStatusColor()}20`
        }}
      >
        <motion.span
          className="text-lg"
          animate={status === 'alive' ? {
            scale: [1, 1.2, 1],
            transition: { repeat: Infinity, duration: 2 }
          } : {}}
        >
          {getStatusIcon()}
        </motion.span>
        
        <div className="flex flex-col">
          <motion.span 
            className="font-mono text-white/90"
            style={{ color: getStatusColor() }}
          >
            {status === 'alive' ? 'MOTOR VIVO' : 
             status === 'dead' ? 'MOTOR MUERTO' : 'DETECTANDO...'}
          </motion.span>
          
          <AnimatePresence>
            {lastPing && (
              <motion.span 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs text-white/60 font-mono"
              >
                {lastPing}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
      
      {/* Tooltip con detalles */}
      <AnimatePresence>
        {details && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full right-0 mb-2 bg-black/90 text-white/80 text-xs px-2 py-1 rounded border border-white/10 font-mono whitespace-nowrap"
          >
            {details}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}