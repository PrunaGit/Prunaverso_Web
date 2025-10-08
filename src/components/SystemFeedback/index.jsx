import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useInteractionSystem from '../../hooks/useInteractionSystem';
import PrunaversoKnowledgeDisplay from '../PrunaversoKnowledgeDisplay';

/**
 * 🌌 SystemFeedback - Feedback Visual en Tiempo Real
 * 
 * Muestra todas las reacciones del sistema a las interacciones del usuario.
 * Hace visible el "pensamiento" del Prunaverso.
 * AHORA CON INTEGRACIÓN DE CONOCIMIENTO PRUNAVERSAL.
 */
const SystemFeedback = () => {
  const { systemState, profile } = useInteractionSystem();
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [pulseIntensity, setPulseIntensity] = useState(0.3);

  // Gestionar mensajes visibles
  useEffect(() => {
    setVisibleMessages(systemState.systemMessages.slice(-3));
    setPulseIntensity(systemState.atmosphereIntensity);
  }, [systemState.systemMessages, systemState.atmosphereIntensity]);

  // Colores según el nivel de alerta
  const alertColors = {
    calm: 'rgba(100, 255, 100, 0.3)',
    active: 'rgba(255, 255, 100, 0.5)',
    elevated: 'rgba(255, 150, 100, 0.6)',
    high: 'rgba(255, 100, 100, 0.7)'
  };

  // Estilo del patrón cognitivo
  const patternStyles = {
    technical_minded: 'border-l-4 border-cyan-400 bg-slate-900/80',
    narrative_focused: 'border-l-4 border-purple-400 bg-purple-900/80',
    gaming_focused: 'border-l-4 border-green-400 bg-green-900/80',
    rapid_explorer: 'border-l-4 border-yellow-400 bg-yellow-900/80',
    contemplative: 'border-l-4 border-blue-400 bg-blue-900/80',
    exploring: 'border-l-4 border-gray-400 bg-gray-900/80'
  };

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm space-y-3">
      {/* Indicador de Estado del Sistema */}
      <motion.div
        className="bg-black/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700"
        style={{
          boxShadow: `0 0 20px ${alertColors[systemState.alertLevel]}`
        }}
        animate={{
          scale: [1, 1 + pulseIntensity * 0.1, 1],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">SYSTEM STATUS</span>
          <motion.div
            className={`w-3 h-3 rounded-full`}
            style={{ backgroundColor: alertColors[systemState.alertLevel] }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
        
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-300">Interactions:</span>
            <span className="text-white font-mono">{systemState.interactionCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Pattern:</span>
            <span className="text-cyan-300 capitalize">
              {systemState.cognitivePattern.replace('_', ' ')}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Alert Level:</span>
            <span className={`capitalize ${
              systemState.alertLevel === 'high' ? 'text-red-400' :
              systemState.alertLevel === 'elevated' ? 'text-orange-400' :
              systemState.alertLevel === 'active' ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {systemState.alertLevel}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Mensajes del Sistema */}
      <AnimatePresence>
        {visibleMessages.map((message, index) => {
          // Renderizado especial para mensajes del conocimiento Prunaversal
          if (message.type === 'prunaverso') {
            return (
              <PrunaversoKnowledgeDisplay
                key={`${message.timestamp}-${index}`}
                message={message}
              />
            );
          }

          // Renderizado normal para otros mensajes
          return (
            <motion.div
              key={`${message.timestamp}-${index}`}
              initial={{ opacity: 0, x: 300, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 300, scale: 0.8 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30,
                delay: index * 0.1 
              }}
              className={`p-3 rounded-lg text-sm ${patternStyles[systemState.cognitivePattern]} backdrop-blur-sm`}
            >
              <div className="flex items-start space-x-2">
                <span className="text-xs opacity-60 mt-0.5">
                  {new Date(message.timestamp).toLocaleTimeString().slice(0, 5)}
                </span>
                <span className="text-white leading-relaxed">
                  {message.content}
                </span>
                {/* Indicador especial para tipos de mensaje */}
                {message.type === 'knowledge_init' && (
                  <span className="text-purple-400 text-xs">🧠</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Achievements Recientes */}
      <AnimatePresence>
        {systemState.achievements.slice(-1).map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="bg-gradient-to-r from-yellow-600/90 to-orange-600/90 backdrop-blur-sm rounded-lg p-4 border border-yellow-500/50"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{achievement.title.split(' ')[0]}</span>
              <div>
                <div className="text-white font-semibold text-sm">
                  {achievement.title.slice(2)}
                </div>
                <div className="text-yellow-200 text-xs">
                  {achievement.description}
                </div>
                <div className="text-yellow-300 text-xs capitalize">
                  {achievement.rarity} • Just unlocked
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Último Comando/Interacción */}
      {systemState.lastInteraction && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          className="bg-black/70 backdrop-blur-sm rounded-lg p-2 border border-gray-600"
        >
          <div className="text-xs space-y-1">
            <div className="text-gray-400">LAST ACTION</div>
            <div className="font-mono text-green-400">
              {systemState.lastInteraction.type.toUpperCase()} → {systemState.lastInteraction.target}
            </div>
            <div className="text-gray-500">
              {new Date(systemState.lastInteraction.timestamp).toLocaleTimeString()}
            </div>
          </div>
        </motion.div>
      )}

      {/* Indicador de Atmosfera */}
      <motion.div
        className="h-2 bg-gray-800 rounded-full overflow-hidden"
        animate={{ opacity: pulseIntensity }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
          animate={{ width: `${pulseIntensity * 100}%` }}
          transition={{ duration: 0.5 }}
        />
        <div className="text-xs text-center text-gray-400 mt-1">
          Atmosphere: {Math.round(pulseIntensity * 100)}%
        </div>
      </motion.div>
    </div>
  );
};

export default SystemFeedback;