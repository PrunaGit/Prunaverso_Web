/**
 * ATMOSPHERE LENS MANAGER - GESTOR DE ATMÓSFERA COGNITIVA GLOBAL
 * 
 * Aplica filtros visuales globales que transforman toda la interfaz
 * según la lente cognitiva activa, creando inmersión total.
 * 
 * @version 2.0.0 - Efectos de Post-procesamiento Global
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribeToStateChanges, getActiveLens } from '../../system-core/cognitiveStateManager';

const AtmosphereLensManager = ({ children }) => {
  const [activeLens, setActiveLens] = useState(getActiveLens());
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [atmosphereIntensity, setAtmosphereIntensity] = useState(0.7);

  // 🔄 SUSCRIPCIÓN A CAMBIOS DE LENTE
  useEffect(() => {
    const unsubscribe = subscribeToStateChanges('lensChange', (event) => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setActiveLens(event.detail.newLens);
        setIsTransitioning(false);
      }, 300);
    });

    return unsubscribe;
  }, []);

  // 🎨 CONFIGURACIONES DE LENTES
  const lensConfigurations = {
    analytical: {
      name: 'ANÁLISIS LÓGICO',
      description: 'Modo de máxima claridad y estructura',
      
      // Efectos CSS
      filter: 'contrast(1.2) brightness(1.1) hue-rotate(180deg)',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
      backdropFilter: 'blur(0px)',
      
      // Variables CSS personalizadas
      cssVariables: {
        '--primary-color': '#00FFFF',
        '--secondary-color': '#0080FF',
        '--accent-color': '#FFFFFF',
        '--text-glow': '0 0 5px #00FFFF',
        '--border-glow': '0 0 10px rgba(0, 255, 255, 0.3)',
        '--font-weight': '400',
        '--letter-spacing': '0.5px',
        '--line-height': '1.4'
      },
      
      // Efectos de partículas
      particles: {
        type: 'grid',
        color: '#00FFFF',
        density: 20,
        movement: 'linear'
      },
      
      // Audio ambiente (futuro)
      ambientSound: '/data/audio/analytical-ambient.mp3'
    },

    emotional: {
      name: 'PERCEPCIÓN EMOCIONAL',
      description: 'Modo de intuición y sentimiento',
      
      filter: 'contrast(0.9) brightness(1.2) saturate(1.3) sepia(0.1)',
      background: 'linear-gradient(135deg, #2d1b00 0%, #4a3319 50%, #6b4423 100%)',
      backdropFilter: 'blur(1px)',
      
      cssVariables: {
        '--primary-color': '#FFB000',
        '--secondary-color': '#FF8000',
        '--accent-color': '#FFED4A',
        '--text-glow': '0 0 8px #FFB000',
        '--border-glow': '0 0 15px rgba(255, 176, 0, 0.4)',
        '--font-weight': '300',
        '--letter-spacing': '0.3px',
        '--line-height': '1.6'
      },
      
      particles: {
        type: 'organic',
        color: '#FFB000',
        density: 15,
        movement: 'flowing'
      },
      
      ambientSound: '/data/audio/emotional-ambient.mp3'
    },

    systemic: {
      name: 'VISIÓN SISTÉMICA',
      description: 'Modo de patrones y conexiones',
      
      filter: 'contrast(1.1) brightness(1.0) hue-rotate(90deg)',
      background: 'linear-gradient(135deg, #0a1a0a 0%, #1a2e1a 50%, #213e21 100%)',
      backdropFilter: 'blur(0.5px)',
      
      cssVariables: {
        '--primary-color': '#00FF80',
        '--secondary-color': '#00CC66',
        '--accent-color': '#80FFB0',
        '--text-glow': '0 0 6px #00FF80',
        '--border-glow': '0 0 12px rgba(0, 255, 128, 0.3)',
        '--font-weight': '400',
        '--letter-spacing': '0.4px',
        '--line-height': '1.5'
      },
      
      particles: {
        type: 'network',
        color: '#00FF80',
        density: 25,
        movement: 'connected'
      },
      
      ambientSound: '/data/audio/systemic-ambient.mp3'
    },

    transcendent: {
      name: 'CONSCIENCIA TRASCENDENTE',
      description: 'Modo de unidad y comprensión total',
      
      filter: 'contrast(1.0) brightness(1.3) saturate(1.1) hue-rotate(270deg)',
      background: 'linear-gradient(135deg, #1a0a1a 0%, #2e1a2e 50%, #3e213e 100%)',
      backdropFilter: 'blur(2px)',
      
      cssVariables: {
        '--primary-color': '#B866FF',
        '--secondary-color': '#9333FF',
        '--accent-color': '#E6D6FF',
        '--text-glow': '0 0 10px #B866FF',
        '--border-glow': '0 0 20px rgba(184, 102, 255, 0.4)',
        '--font-weight': '300',
        '--letter-spacing': '0.6px',
        '--line-height': '1.7'
      },
      
      particles: {
        type: 'ethereal',
        color: '#B866FF',
        density: 10,
        movement: 'floating'
      },
      
      ambientSound: '/data/audio/transcendent-ambient.mp3'
    }
  };

  const currentConfig = lensConfigurations[activeLens] || lensConfigurations.analytical;

  // 🎭 APLICAR VARIABLES CSS GLOBALES
  useEffect(() => {
    const root = document.documentElement;
    
    Object.entries(currentConfig.cssVariables).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });

    // Limpiar al desmontar
    return () => {
      Object.keys(currentConfig.cssVariables).forEach(property => {
        root.style.removeProperty(property);
      });
    };
  }, [currentConfig]);

  // 🌊 COMPONENTE DE PARTÍCULAS
  const ParticleSystem = ({ config }) => {
    const particleCount = config.density;
    
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {[...Array(particleCount)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute w-1 h-1 rounded-full opacity-20"
            style={{
              backgroundColor: config.color,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: config.movement === 'linear' ? [-10, 10] : 
                 config.movement === 'flowing' ? [-20, 20, -20] :
                 config.movement === 'connected' ? [-5, 5] :
                 [-30, 30, -30],
              y: config.movement === 'linear' ? [-10, 10] : 
                 config.movement === 'flowing' ? [-15, 15, -15] :
                 config.movement === 'floating' ? [-40, 40, -40] :
                 [-10, 10],
              opacity: [0.1, 0.3, 0.1],
              scale: [0.8, 1.2, 0.8]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    );
  };

  // 🌟 OVERLAY DE TRANSICIÓN
  const TransitionOverlay = () => (
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            background: `radial-gradient(circle, ${currentConfig.cssVariables['--primary-color']}20 0%, transparent 70%)`,
            backdropFilter: 'blur(3px)'
          }}
        >
          <div className="flex items-center justify-center h-full">
            <motion.div
              className="text-center font-mono"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.2, opacity: 0 }}
              style={{ color: currentConfig.cssVariables['--primary-color'] }}
            >
              <motion.div
                className="text-2xl font-bold mb-2"
                animate={{ 
                  textShadow: `0 0 20px ${currentConfig.cssVariables['--primary-color']}` 
                }}
              >
                {currentConfig.name}
              </motion.div>
              <div className="text-sm opacity-70">
                {currentConfig.description}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="relative min-h-screen">
      {/* 🎨 FONDO ATMOSFÉRICO */}
      <motion.div
        className="fixed inset-0 -z-10"
        style={{
          background: currentConfig.background,
          filter: currentConfig.filter,
          backdropFilter: currentConfig.backdropFilter
        }}
        animate={{
          opacity: atmosphereIntensity
        }}
        transition={{ duration: 1 }}
      />

      {/* ✨ SISTEMA DE PARTÍCULAS */}
      <ParticleSystem config={currentConfig.particles} />

      {/* 🔄 OVERLAY DE TRANSICIÓN */}
      <TransitionOverlay />

      {/* 🖼️ CONTENIDO PRINCIPAL CON EFECTOS */}
      <motion.div
        className="relative z-10"
        style={{
          fontFamily: activeLens === 'analytical' ? 'Consolas, monospace' : 
                     activeLens === 'emotional' ? 'Georgia, serif' :
                     activeLens === 'systemic' ? 'Helvetica, sans-serif' :
                     'Palatino, serif'
        }}
        animate={{
          filter: `brightness(${1 + (atmosphereIntensity * 0.1)})`
        }}
      >
        {children}
      </motion.div>

      {/* 🎛️ CONTROL DE INTENSIDAD (DEBUG) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 z-50 bg-black bg-opacity-50 p-2 rounded font-mono text-xs">
          <div style={{ color: currentConfig.cssVariables['--primary-color'] }}>
            LENS: {activeLens.toUpperCase()}
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={atmosphereIntensity}
            onChange={(e) => setAtmosphereIntensity(parseFloat(e.target.value))}
            className="w-20 mt-1"
          />
          <div style={{ color: currentConfig.cssVariables['--secondary-color'] }}>
            Intensidad: {Math.round(atmosphereIntensity * 100)}%
          </div>
        </div>
      )}

      {/* 📱 INDICADOR DE LENTE ACTIVA */}
      <motion.div
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 px-4 py-1 rounded-full font-mono text-xs"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 0.8 }}
        style={{
          background: `linear-gradient(90deg, transparent, ${currentConfig.cssVariables['--primary-color']}20, transparent)`,
          border: `1px solid ${currentConfig.cssVariables['--primary-color']}40`,
          backdropFilter: 'blur(10px)'
        }}
      >
        <span style={{ color: currentConfig.cssVariables['--primary-color'] }}>
          {currentConfig.name}
        </span>
      </motion.div>
    </div>
  );
};

export default AtmosphereLensManager;