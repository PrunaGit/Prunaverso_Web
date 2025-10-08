/**
 * 🌌 PRUNAVERSO KNOWLEDGE DISPLAY
 * Componente especializado para mostrar información del conocimiento Prunaversal
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PrunaversoKnowledgeDisplay = ({ message, onClose }) => {
  if (!message || message.type !== 'prunaverso') return null;

  const { content, confidence, sources, characterData, conceptData, isSpeculative } = message;

  const getConfidenceColor = (conf) => {
    if (conf >= 0.8) return 'text-green-400';
    if (conf >= 0.6) return 'text-yellow-400';
    return 'text-blue-400';
  };

  const getConfidenceIcon = (conf) => {
    if (conf >= 0.8) return '🎯';
    if (conf >= 0.6) return '✨';
    return '🔮';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm"
    >
      {/* Header con icono de confianza */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🌌</span>
          <span className="text-purple-300 font-medium">Conocimiento Prunaversal</span>
          <span className={`text-sm ${getConfidenceColor(confidence)}`}>
            {getConfidenceIcon(confidence)} {Math.round(confidence * 100)}%
          </span>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Contenido principal */}
      <div className="mb-3">
        <p className="text-gray-100 leading-relaxed">{content}</p>
        {isSpeculative && (
          <p className="text-yellow-400/70 text-sm mt-2 italic">
            ⚠️ Respuesta especulativa - basada en patrones del sistema
          </p>
        )}
      </div>

      {/* Información del personaje si está disponible */}
      {characterData && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-black/20 rounded p-3 mb-3"
        >
          <div className="text-purple-300 text-sm font-medium mb-2">📋 Información del Personaje:</div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-400">Nombre:</span>
              <span className="text-white ml-2">{characterData.name}</span>
            </div>
            <div>
              <span className="text-gray-400">Categoría:</span>
              <span className="text-white ml-2">{characterData.category || 'N/A'}</span>
            </div>
            {characterData.raw_data?.alias && characterData.raw_data.alias.length > 0 && (
              <div className="col-span-2">
                <span className="text-gray-400">Alias:</span>
                <span className="text-white ml-2">{characterData.raw_data.alias.join(', ')}</span>
              </div>
            )}
            {characterData.raw_data?.estado && (
              <div className="col-span-2">
                <span className="text-gray-400">Estado:</span>
                <span className="text-green-400 ml-2">{characterData.raw_data.estado}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Información de conceptos si está disponible */}
      {conceptData && conceptData.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-black/20 rounded p-3 mb-3"
        >
          <div className="text-blue-300 text-sm font-medium mb-2">🧠 Conceptos Relacionados:</div>
          <div className="flex flex-wrap gap-2">
            {conceptData.slice(0, 5).map((concept, index) => (
              <span 
                key={index}
                className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs border border-blue-500/30"
              >
                {concept.key}
              </span>
            ))}
            {conceptData.length > 5 && (
              <span className="text-gray-400 text-xs">
                +{conceptData.length - 5} más...
              </span>
            )}
          </div>
        </motion.div>
      )}

      {/* Fuentes */}
      {sources && sources.length > 0 && (
        <div className="text-xs text-gray-400">
          <span>📚 Fuentes: </span>
          {sources.slice(0, 3).join(', ')}
          {sources.length > 3 && ` +${sources.length - 3} más`}
        </div>
      )}
    </motion.div>
  );
};

export default PrunaversoKnowledgeDisplay;