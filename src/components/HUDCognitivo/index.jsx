/**
 * HUD COGNITIVO AVANZADO - INTERFAZ DEL SISTEMA OPERATIVO COGNITIVO
 * 
 * Implementa la estética terminal/HUD con tipografía monoespaciada,
 * paleta monocromática y efectos de inmersión visual.
 * 
 * @version 2.0.0 - Integración con Prunalgoritm
 */

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  getCurrentState, 
  subscribeToStateChanges,
  getSessionMetrics,
  registerInteraction 
} from '../../system-core/cognitiveStateManager';
import { getStateDescription, getLevelName } from '../../system-core/prunalgoritm';

const HUDCognitivo = ({ 
  position = 'top-right',
  minimized = false,
  lensMode = 'analytical',
  className = ''
}) => {
  const [cognitiveState, setCognitiveState] = useState(getCurrentState());
  const [sessionMetrics, setSessionMetrics] = useState(getSessionMetrics());
  const [glitchEffect, setGlitchEffect] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // 🔄 SUSCRIPCIÓN A CAMBIOS DE ESTADO
  useEffect(() => {
    const unsubscribeState = subscribeToStateChanges('stateUpdate', (event) => {
      setCognitiveState(event.detail.newState);
      setSessionMetrics(getSessionMetrics());
    });

    const unsubscribeLevelUp = subscribeToStateChanges('levelUp', () => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 2000);
    });

    const unsubscribeOverload = subscribeToStateChanges('cognitiveOverload', () => {
      setGlitchEffect(true);
      setTimeout(() => setGlitchEffect(false), 1000);
    });

    return () => {
      unsubscribeState();
      unsubscribeLevelUp();
      unsubscribeOverload();
    };
  }, []);

  // 🎨 CONFIGURACIÓN DE LENTE VISUAL
  const lensConfig = useMemo(() => {
    const configs = {
      analytical: {
        primaryColor: '#00FFFF',
        secondaryColor: '#0080FF', 
        accentColor: '#FFFFFF',
        glowColor: 'rgba(0, 255, 255, 0.3)',
        prefix: '[ANLT]',
        suffix: '::',
        charset: '▓▒░'
      },
      emotional: {
        primaryColor: '#FFB000',
        secondaryColor: '#FF8000',
        accentColor: '#FFED4A',
        glowColor: 'rgba(255, 176, 0, 0.3)',
        prefix: '{EMOT}',
        suffix: '~',
        charset: '♦♢♧'
      },
      systemic: {
        primaryColor: '#00FF80',
        secondaryColor: '#00CC66',
        accentColor: '#80FFB0',
        glowColor: 'rgba(0, 255, 128, 0.3)',
        prefix: '<SYS>',
        suffix: '»',
        charset: '▲▼◆'
      },
      transcendent: {
        primaryColor: '#B866FF',
        secondaryColor: '#9333FF',
        accentColor: '#E6D6FF',
        glowColor: 'rgba(184, 102, 255, 0.3)',
        prefix: '∞PHI∞',
        suffix: '∾',
        charset: '◊○●'
      }
    };
    
    return configs[lensMode] || configs.analytical;
  }, [lensMode]);

  // 📊 GENERACIÓN DE BARRAS ASCII
  const generateBar = (value, maxValue = 100, width = 20) => {
    const filled = Math.round((value / maxValue) * width);
    const empty = width - filled;
    
    return '█'.repeat(filled) + '░'.repeat(empty);
  };

  // 🎯 FORMATEO DE VALORES
  const formatValue = (value, decimals = 0) => {
    return Number(value).toFixed(decimals).padStart(5, ' ');
  };

  // ⚡ EFECTOS VISUALES
  const getGlitchStyle = () => {
    if (!glitchEffect) return {};
    
    return {
      textShadow: `
        2px 0 ${lensConfig.primaryColor},
        -2px 0 ${lensConfig.secondaryColor},
        0 2px ${lensConfig.accentColor}
      `,
      animation: 'glitch 0.3s ease-in-out'
    };
  };

  // 🖼️ COMPONENTE PRINCIPAL
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: position.includes('right') ? 50 : -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: position.includes('right') ? 50 : -50 }}
          className={`
            fixed ${position.includes('top') ? 'top-4' : 'bottom-4'} 
            ${position.includes('right') ? 'right-4' : 'left-4'}
            z-50 font-mono text-sm select-none
            ${className}
          `}
          style={{
            fontFamily: 'Consolas, Fira Code, Monaco, monospace',
            letterSpacing: '0.5px'
          }}
        >
          {/* 🎮 PANEL PRINCIPAL */}
          <motion.div
            className="bg-black border-2 p-4 rounded-lg backdrop-blur-sm"
            style={{
              borderColor: lensConfig.primaryColor,
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              boxShadow: `0 0 20px ${lensConfig.glowColor}`,
              ...getGlitchStyle()
            }}
            whileHover={{ scale: 1.02 }}
            onClick={() => registerInteraction('hud_interaction')}
          >
            
            {/* 📡 HEADER */}
            <div className="border-b pb-2 mb-3" style={{ borderColor: lensConfig.secondaryColor }}>
              <div className="flex items-center justify-between">
                <span style={{ color: lensConfig.primaryColor }} className="font-bold">
                  {lensConfig.prefix} PRUNAVERSO OS
                </span>
                <div className="flex items-center space-x-2">
                  <span style={{ color: lensConfig.accentColor }} className="text-xs">
                    LVL{cognitiveState.level.toString().padStart(2, '0')}
                  </span>
                  <motion.div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: lensConfig.primaryColor }}
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
              </div>
            </div>

            {/* 🧠 ESTADO COGNITIVO PRINCIPAL */}
            <div className="space-y-2">
              
              {/* Vitalidad */}
              <div className="flex items-center">
                <span style={{ color: lensConfig.secondaryColor }} className="w-12">
                  VIT{lensConfig.suffix}
                </span>
                <div className="flex-1 mx-2">
                  <div 
                    className="font-bold"
                    style={{ 
                      color: cognitiveState.vitalidad > 60 ? lensConfig.primaryColor : 
                             cognitiveState.vitalidad > 30 ? lensConfig.secondaryColor : '#FF4444'
                    }}
                  >
                    {generateBar(cognitiveState.vitalidad)}
                  </div>
                </div>
                <span style={{ color: lensConfig.accentColor }} className="w-12 text-right">
                  {formatValue(cognitiveState.vitalidad, 1)}%
                </span>
              </div>

              {/* Eutimia */}
              <div className="flex items-center">
                <span style={{ color: lensConfig.secondaryColor }} className="w-12">
                  EUT{lensConfig.suffix}
                </span>
                <div className="flex-1 mx-2">
                  <div 
                    className="font-bold"
                    style={{ 
                      color: cognitiveState.eutimia > 60 ? lensConfig.primaryColor : 
                             cognitiveState.eutimia > 30 ? lensConfig.secondaryColor : '#FF4444'
                    }}
                  >
                    {generateBar(cognitiveState.eutimia)}
                  </div>
                </div>
                <span style={{ color: lensConfig.accentColor }} className="w-12 text-right">
                  {formatValue(cognitiveState.eutimia, 1)}%
                </span>
              </div>

              {/* Carga */}
              <div className="flex items-center">
                <span style={{ color: lensConfig.secondaryColor }} className="w-12">
                  CGC{lensConfig.suffix}
                </span>
                <div className="flex-1 mx-2">
                  <div 
                    className="font-bold"
                    style={{ 
                      color: cognitiveState.carga < 30 ? lensConfig.primaryColor :
                             cognitiveState.carga < 70 ? lensConfig.secondaryColor : '#FF4444'
                    }}
                  >
                    {generateBar(cognitiveState.carga)}
                  </div>
                </div>
                <span style={{ color: lensConfig.accentColor }} className="w-12 text-right">
                  {formatValue(cognitiveState.carga, 1)}%
                </span>
              </div>
            </div>

            {/* 📈 ESTADO DERIVADO */}
            <div className="border-t pt-2 mt-3 space-y-1" style={{ borderColor: lensConfig.secondaryColor }}>
              
              {/* Coherencia */}
              <div className="flex justify-between items-center">
                <span style={{ color: lensConfig.secondaryColor }} className="text-xs">
                  COHERENCIA:
                </span>
                <span style={{ color: lensConfig.primaryColor }} className="text-xs font-bold">
                  {formatValue(cognitiveState.cognitiveCoherence, 1)}% 
                  {lensConfig.charset[Math.floor(cognitiveState.cognitiveCoherence / 33)]}
                </span>
              </div>

              {/* Nivel y Descripción */}
              <div className="flex justify-between items-center">
                <span style={{ color: lensConfig.secondaryColor }} className="text-xs">
                  ESTADO:
                </span>
                <span style={{ color: lensConfig.accentColor }} className="text-xs">
                  {getStateDescription(cognitiveState)}
                </span>
              </div>

              {/* Evolución */}
              {cognitiveState.evolutionReadiness.percentage > 0 && (
                <div className="flex justify-between items-center">
                  <span style={{ color: lensConfig.secondaryColor }} className="text-xs">
                    EVOLUCIÓN:
                  </span>
                  <span 
                    style={{ 
                      color: cognitiveState.evolutionReadiness.ready ? 
                        lensConfig.primaryColor : lensConfig.accentColor 
                    }} 
                    className="text-xs font-bold"
                  >
                    {formatValue(cognitiveState.evolutionReadiness.percentage, 0)}%
                    {cognitiveState.evolutionReadiness.ready ? ' ⚡READY' : ''}
                  </span>
                </div>
              )}
            </div>

            {/* 🕒 MÉTRICAS DE SESIÓN (Si no está minimizado) */}
            {!minimized && (
              <div className="border-t pt-2 mt-3" style={{ borderColor: lensConfig.secondaryColor }}>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between">
                    <span style={{ color: lensConfig.secondaryColor }}>
                      SESIÓN:
                    </span>
                    <span style={{ color: lensConfig.accentColor }}>
                      {Math.floor(sessionMetrics.duration / 60000)}m
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: lensConfig.secondaryColor }}>
                      INTERACCIONES:
                    </span>
                    <span style={{ color: lensConfig.accentColor }}>
                      {sessionMetrics.interactionsCount}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* 🎛️ CONTROLES MINIMALES */}
          <motion.div
            className="mt-2 flex justify-end space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            whileHover={{ opacity: 1 }}
          >
            <button
              onClick={() => setIsVisible(false)}
              className="text-xs opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: lensConfig.secondaryColor }}
              title="Ocultar HUD"
            >
              [X]
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HUDCognitivo;