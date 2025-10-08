import React, { useState } from 'react'
import { motion } from 'framer-motion'

const COGNITIVE_LENSES = [
  {
    id: 'psychology',
    name: '🧠 Psicología',
    subtitle: 'Agencia y Automatización',
    description: 'Explora patrones de control consciente vs. flujo automático. Transición del "yo ejecuto" al "yo orquesto".',
    color: 'from-blue-500 to-cyan-400',
    keywords: ['flow', 'agencia', 'control', 'transferencia procedimental']
  },
  {
    id: 'neuroscience', 
    name: '⚡ Neurociencia',
    subtitle: 'Estados de Flow Distribuido',
    description: 'Optimiza dinámicas atencionales. Del cerebro operador al cerebro sintético en sincronía.',
    color: 'from-purple-500 to-pink-400',
    keywords: ['dopamina', 'corteza prefrontal', 'estriado ventral', 'sincronización']
  },
  {
    id: 'ai',
    name: '🤖 Inteligencia Artificial', 
    subtitle: 'Programación Conversacional',
    description: 'De manipular código a mentorear agentes. Meta-programación través del diálogo.',
    color: 'from-green-500 to-emerald-400',
    keywords: ['meta-programación', 'agentes', 'modelado', 'intención']
  },
  {
    id: 'linguistics',
    name: '💬 Lingüística',
    subtitle: 'Lenguaje Performativo',
    description: 'El verbo se vuelve acción directa. Sintaxis que produce semántica viva y ejecutable.',
    color: 'from-orange-500 to-red-400', 
    keywords: ['performativo', 'Austin', 'actos de habla', 'materialización']
  },
  {
    id: 'philosophy',
    name: '🧩 Filosofía',
    subtitle: 'Relaciones Dialógicas',
    description: 'Umbral ontológico. Herramienta → colaborador. Conocimiento como campo compartido.',
    color: 'from-indigo-500 to-purple-400',
    keywords: ['enactivismo', 'dialógico', 'ontología', 'campo compartido']
  },
  {
    id: 'anthropology',
    name: '🌍 Antropología',
    subtitle: 'Homo Symbioticus',
    description: 'Rito de paso post-tecnológico. Tribu cognitiva expandida más allá de lo humano.',
    color: 'from-yellow-500 to-orange-400',
    keywords: ['simbiosis', 'rito de paso', 'cultura', 'homo symbioticus']
  }
]

export default function CognitiveLensSelector({ selectedLens, onLensChange }) {
  const [expanded, setExpanded] = useState(null)

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Navegador de Ciencias Cognitivas</h2>
        <p className="text-gray-400">Elige la lente desde la cual explorar el Prunaverso</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COGNITIVE_LENSES.map((lens) => (
          <motion.div
            key={lens.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative p-6 rounded-xl cursor-pointer transition-all duration-300
              ${selectedLens === lens.id 
                ? 'ring-2 ring-white/50 bg-gradient-to-br ' + lens.color + ' text-white' 
                : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300'}
            `}
            onClick={() => {
              onLensChange?.(lens.id)
              setExpanded(expanded === lens.id ? null : lens.id)
            }}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="text-2xl">{lens.name.split(' ')[0]}</div>
              <div>
                <h3 className="font-semibold text-lg">{lens.name.split(' ').slice(1).join(' ')}</h3>
                <p className="text-sm opacity-80">{lens.subtitle}</p>
              </div>
            </div>

            <p className="text-sm mb-4 leading-relaxed">{lens.description}</p>

            {expanded === lens.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-white/20 pt-3"
              >
                <div className="flex flex-wrap gap-1">
                  {lens.keywords.map(keyword => (
                    <span 
                      key={keyword}
                      className="px-2 py-1 bg-black/20 rounded text-xs"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {selectedLens === lens.id && (
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {selectedLens && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 p-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl"
        >
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">
              Lente Activa: {COGNITIVE_LENSES.find(l => l.id === selectedLens)?.name}
            </h3>
            <p className="text-gray-300 mb-4">
              Tu sesión será modulada desde esta perspectiva cognitiva
            </p>
            <button 
              onClick={() => onLensChange?.(null)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
            >
              Limpiar selección
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}