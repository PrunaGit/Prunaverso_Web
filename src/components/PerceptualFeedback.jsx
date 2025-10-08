/**
 * 🌌 SISTEMA DE FEEDBACK PERCEPTUAL
 * 
 * Componente que muestra al usuario cómo está siendo filtrada
 * toda la información del Prunaverso según su perfil cognitivo.
 * 
 * Funciona como un "monitor de traducción" en tiempo real.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePerceptualFilter } from '../hooks/usePerceptualFilter';
import { useCognitiveLens } from '../hooks/useCognitiveLens';

export default function PerceptualFeedback({ 
  position = 'bottom-right', 
  minimized = false,
  showDetails = false 
}) {
  const perceptualFilter = usePerceptualFilter();
  const { cognitiveLenses, academicDegree } = useCognitiveLens();
  const [isExpanded, setIsExpanded] = useState(!minimized);
  const [recentTranslations, setRecentTranslations] = useState([]);

  // Monitorear traducciones en tiempo real
  useEffect(() => {
    if (perceptualFilter.lastTranslation) {
      setRecentTranslations(prev => [
        {
          id: Date.now(),
          timestamp: new Date(),
          translation: perceptualFilter.lastTranslation,
          lenses: [...cognitiveLenses],
          academic: academicDegree
        },
        ...prev.slice(0, 4) // Mantener solo las últimas 5
      ]);
    }
  }, [perceptualFilter.lastTranslation, cognitiveLenses, academicDegree]);

  const filterStats = perceptualFilter.getFilterStats();

  const positionClasses = {
    'bottom-right': 'fixed bottom-4 right-4',
    'bottom-left': 'fixed bottom-4 left-4',
    'top-right': 'fixed top-4 right-4',
    'top-left': 'fixed top-4 left-4'
  };

  if (!perceptualFilter.isCalibrated) {
    return null; // No mostrar si no está calibrado
  }

  return (
    <div className={`${positionClasses[position]} z-50 max-w-sm`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-black/80 backdrop-blur-sm border border-purple-500/30 rounded-lg shadow-xl"
      >
        {/* Header del monitor */}
        <div className="flex items-center justify-between p-3 border-b border-purple-500/20">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-mono text-green-400">PERCEPTUAL_FILTER</span>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="p-3 space-y-3">
                {/* Estado actual del filtro */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-purple-300">FILTROS ACTIVOS</div>
                  <div className="flex flex-wrap gap-1">
                    {cognitiveLenses.map(lens => (
                      <span 
                        key={lens}
                        className="text-xs bg-purple-600/50 px-2 py-1 rounded-full"
                      >
                        {lens}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400">
                    Nivel: <span className="text-white">{academicDegree}</span>
                  </div>
                </div>

                {/* Estadísticas del filtro */}
                {filterStats.isCalibrated && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-blue-300">ESTADÍSTICAS</div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <div className="text-gray-400">Traducciones</div>
                        <div className="text-white">{filterStats.totalTranslations || 0}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Cache Hits</div>
                        <div className="text-white">{filterStats.cacheHits || 0}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Traducciones recientes */}
                {recentTranslations.length > 0 && showDetails && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-cyan-300">TRADUCCIONES RECIENTES</div>
                    <div className="space-y-1 max-h-32 overflow-y-auto">
                      {recentTranslations.map(item => (
                        <div key={item.id} className="text-xs bg-gray-800/50 p-2 rounded">
                          <div className="text-gray-300">
                            {item.timestamp.toLocaleTimeString()}
                          </div>
                          <div className="text-white text-xs truncate">
                            {item.translation?.translated?.presentation?.format || 'Traducción aplicada'}
                          </div>
                          <div className="text-gray-400 text-xs">
                            {item.lenses.join(' + ')} @ {item.academic}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Indicador de confianza */}
                {perceptualFilter.lastTranslation?.metadata && (
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-yellow-300">ÚLTIMA TRADUCCIÓN</div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Confianza</span>
                        <span className="text-white">
                          {Math.round((perceptualFilter.lastTranslation.metadata.translationConfidence || 0) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1">
                        <div 
                          className="bg-gradient-to-r from-green-400 to-blue-400 h-1 rounded-full transition-all duration-300"
                          style={{ 
                            width: `${(perceptualFilter.lastTranslation.metadata.translationConfidence || 0) * 100}%` 
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-400">
                        Lente primaria: {perceptualFilter.lastTranslation.metadata.primaryLens}
                      </div>
                    </div>
                  </div>
                )}

                {/* Advertencia sobre filtrado */}
                <div className="border-t border-purple-500/20 pt-2">
                  <div className="text-xs text-orange-300 bg-orange-900/20 p-2 rounded">
                    💡 Todo el contenido está siendo filtrado por tu perfil cognitivo
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

// Componente para mostrar el estado del filtro inline
export function PerceptualFilterBadge({ compact = false }) {
  const { cognitiveLenses, academicDegree } = useCognitiveLens();
  const perceptualFilter = usePerceptualFilter();

  if (!perceptualFilter.isCalibrated) {
    return (
      <div className="inline-flex items-center gap-2 px-2 py-1 bg-yellow-900/30 border border-yellow-600/30 rounded text-xs text-yellow-300">
        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        Sin calibrar
      </div>
    );
  }

  if (compact) {
    return (
      <div className="inline-flex items-center gap-1 px-2 py-1 bg-purple-900/30 border border-purple-600/30 rounded text-xs text-purple-300">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        {cognitiveLenses.length} filtros
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-900/30 border border-purple-600/30 rounded-full text-xs">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
      <span className="text-purple-300">Filtros:</span>
      <span className="text-white">{cognitiveLenses.join(' + ')}</span>
      <span className="text-gray-400">@{academicDegree}</span>
    </div>
  );
}

// Hook para componentes que quieren mostrar contenido filtrado con feedback
export function useContentWithPerceptualFeedback() {
  const perceptualFilter = usePerceptualFilter();
  const [showFeedback, setShowFeedback] = useState(false);

  const renderContentWithFeedback = (rawContent, contextualHints = {}) => {
    const perceived = perceptualFilter.perceiveContent(rawContent, contextualHints);
    
    return {
      content: perceived.content,
      isFiltered: perceived.isFiltered,
      metadata: perceived.metadata,
      feedbackComponent: perceived.isFiltered ? (
        <div className="text-xs text-gray-400 mt-2 flex items-center justify-between">
          <span>🔍 Contenido filtrado por tu perfil cognitivo</span>
          <button 
            onClick={() => setShowFeedback(!showFeedback)}
            className="text-purple-400 hover:text-purple-300"
          >
            {showFeedback ? 'Ocultar' : 'Ver'} filtros
          </button>
          {showFeedback && (
            <div className="absolute mt-6 p-2 bg-black/90 border border-purple-500/30 rounded text-xs">
              <div>Filtrado por: {perceived.filterSignature}</div>
              <div>Confianza: {Math.round((perceived.metadata?.translationConfidence || 0) * 100)}%</div>
            </div>
          )}
        </div>
      ) : null
    };
  };

  return { renderContentWithFeedback };
}