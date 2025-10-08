import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCognitiveLens } from '../hooks/useCognitiveLens'

const COGNITIVE_LENSES = [
  { id: 'psychology', emoji: '🧠', name: 'Psicología', color: 'bg-blue-500' },
  { id: 'neuroscience', emoji: '⚡', name: 'Neurociencia', color: 'bg-purple-500' },
  { id: 'ai', emoji: '🤖', name: 'IA', color: 'bg-green-500' },
  { id: 'linguistics', emoji: '💬', name: 'Lingüística', color: 'bg-orange-500' },
  { id: 'philosophy', emoji: '🧩', name: 'Filosofía', color: 'bg-indigo-500' },
  { id: 'anthropology', emoji: '🌍', name: 'Antropología', color: 'bg-yellow-500' }
]

export function FloatingCognitiveLens() {
  const [isOpen, setIsOpen] = useState(false)
  const { cognitiveLenses, setCognitiveLenses, breathingMode, setBreathingMode } = useCognitiveLens()
  const [position, setPosition] = useState({ x: 20, y: 20 })
  const [isDragging, setIsDragging] = useState(false)

  // Convertir a array si no lo es
  const activeLenses = Array.isArray(cognitiveLenses) ? cognitiveLenses : (cognitiveLenses ? [cognitiveLenses] : [])
  
  const handleLensToggle = (lensId) => {
    const newLenses = activeLenses.includes(lensId)
      ? activeLenses.filter(id => id !== lensId)
      : [...activeLenses, lensId]
    
    setCognitiveLenses(newLenses)
  }

  const getDisplayInfo = () => {
    if (activeLenses.length === 0) {
      return { emoji: '🔄', text: 'Sin lentes', color: 'bg-gray-600' }
    }
    if (activeLenses.length === 1) {
      const lens = COGNITIVE_LENSES.find(l => l.id === activeLenses[0])
      return { emoji: lens?.emoji || '🔄', text: lens?.name || 'Lente', color: lens?.color || 'bg-gray-600' }
    }
    return { 
      emoji: '🔮', 
      text: `${activeLenses.length} lentes`, 
      color: 'bg-gradient-to-r from-purple-500 to-pink-500' 
    }
  }

  const displayInfo = getDisplayInfo()

  return (
    <div className="fixed z-50" style={{ left: position.x, top: position.y }}>
      {/* Botón principal - siempre visible */}
      <motion.div
        drag
        dragMomentum={false}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(e, info) => {
          setIsDragging(false)
          setPosition(prev => ({
            x: Math.max(0, Math.min(window.innerWidth - 60, prev.x + info.offset.x)),
            y: Math.max(0, Math.min(window.innerHeight - 60, prev.y + info.offset.y))
          }))
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`
          w-12 h-12 rounded-full cursor-pointer shadow-lg border-2 border-white/20
          flex items-center justify-center text-lg font-bold text-white
          ${displayInfo.color}
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
        `}
        onClick={() => !isDragging && setIsOpen(!isOpen)}
        title={`Lentes activas: ${displayInfo.text}`}
      >
        {displayInfo.emoji}
        {activeLenses.length > 1 && (
          <span className="absolute -top-1 -right-1 bg-white text-gray-800 text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {activeLenses.length}
          </span>
        )}
      </motion.div>

      {/* Panel expandido */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            className="absolute top-14 left-0 bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-xl border border-white/10 p-4 min-w-64"
          >
            <div className="text-xs font-semibold text-gray-300 mb-3 text-center">
              LENTES COGNITIVAS MÚLTIPLES
            </div>
            
            <div className="space-y-2">
              {COGNITIVE_LENSES.map((lens) => {
                const isActive = activeLenses.includes(lens.id)
                return (
                  <motion.button
                    key={lens.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleLensToggle(lens.id)}
                    className={`
                      w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left
                      ${isActive 
                        ? lens.color + ' text-white shadow-md' 
                        : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'}
                    `}
                  >
                    <span className="text-lg">{lens.emoji}</span>
                    <span className="text-sm font-medium flex-1">{lens.name}</span>
                    <div className="flex items-center gap-1">
                      {isActive && <span className="text-xs">●</span>}
                      <div className={`w-4 h-4 rounded border-2 ${
                        isActive ? 'bg-white border-white' : 'border-gray-400'
                      }`}>
                        {isActive && (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-xs text-gray-800">✓</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.button>
                )
              })}
            </div>

            <div className="border-t border-white/10 mt-3 pt-3 space-y-2">
              <button
                onClick={() => setCognitiveLenses(COGNITIVE_LENSES.map(l => l.id))}
                className="w-full text-xs text-blue-400 hover:text-blue-200 transition-colors"
              >
                Seleccionar todas
              </button>
              <button
                onClick={() => setCognitiveLenses([])}
                className="w-full text-xs text-gray-400 hover:text-gray-200 transition-colors"
              >
                Limpiar selección
              </button>
              <label className="flex items-center gap-2 mt-3 text-sm opacity-90 cursor-pointer">
                <input
                  type="checkbox"
                  checked={breathingMode}
                  onChange={(e) => setBreathingMode(e.target.checked)}
                  className="rounded"
                />
                <span className="text-gray-300">Respiración Prunaversal</span>
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicadores sutiles para múltiples lentes */}
      {activeLenses.length > 0 && !isOpen && (
        <div className="absolute -bottom-1 -right-1 flex gap-1">
          {activeLenses.slice(0, 3).map((lensId, index) => {
            const lens = COGNITIVE_LENSES.find(l => l.id === lensId)
            return (
              <motion.div
                key={lensId}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`w-2 h-2 rounded-full ${lens?.color || 'bg-gray-400'} border border-white`}
                style={{ zIndex: 10 - index }}
              />
            )
          })}
          {activeLenses.length > 3 && (
            <div className="w-2 h-2 rounded-full bg-white text-gray-800 flex items-center justify-center text-xs font-bold border border-gray-300">
              +
            </div>
          )}
        </div>
      )}

      {/* Tooltip flotante */}
      {activeLenses.length > 0 && !isOpen && !isDragging && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute left-14 top-2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
        >
          {activeLenses.length === 1 
            ? COGNITIVE_LENSES.find(l => l.id === activeLenses[0])?.name
            : `${activeLenses.length} lentes activas`}
        </motion.div>
      )}
    </div>
  )
}