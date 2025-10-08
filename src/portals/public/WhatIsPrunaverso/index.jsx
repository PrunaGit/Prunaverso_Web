import React from 'react';
import { motion } from 'framer-motion';
import useVisitorProfile from '../../../hooks/useVisitorProfile';
import meta from './meta.json';

/**
 * 🌌 ¿QUÉ ES EL PRUNAVERSO?
 * 
 * Nodo auto-adaptativo que se explica según la conciencia del observador.
 * La respuesta cambia según el rol, lente cognitiva y nivel del usuario.
 */
const WhatIsPrunaverso = () => {
  const { profile } = useVisitorProfile();
  
  // Determinar qué mensaje mostrar según el perfil
  const getAdaptiveMessage = () => {
    const role = profile?.type || 'visitor';
    const lens = profile?.activeLens || 'default';
    
    // Prioridad: lente específica > rol específico > mensaje por defecto
    return meta.lenses[lens] || meta.roles[role] || meta.default;
  };

  const message = getAdaptiveMessage();
  const isArchitect = profile?.type === 'architect';

  return (
    <div className="p-8 text-center max-w-4xl mx-auto">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Título principal */}
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
        >
          ¿Qué es el Prunaverso?
        </motion.h1>

        {/* Mensaje adaptativo principal */}
        <motion.p 
          className="text-xl md:text-2xl text-gray-300 leading-relaxed mb-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {message}
        </motion.p>

        {/* Visual central - Reacciona al perfil */}
        <motion.div
          className="relative w-64 h-64 mx-auto mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.6, type: "spring" }}
        >
          {/* Núcleo central */}
          <div className="absolute inset-1/2 w-8 h-8 -ml-4 -mt-4 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full shadow-lg"></div>
          
          {/* Órbitas */}
          {[1, 2, 3].map((orbit) => (
            <motion.div
              key={orbit}
              className={`absolute inset-0 border border-gray-600/30 rounded-full`}
              style={{
                margin: `${20 * orbit}px`,
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 10 + orbit * 5,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              {/* Nodos orbitales */}
              {Array.from({ length: orbit * 2 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${(360 / (orbit * 2)) * i}deg) translateX(${80 + orbit * 20}px) translateY(-50%)`,
                  }}
                ></div>
              ))}
            </motion.div>
          ))}
        </motion.div>

        {/* Características clave */}
        <motion.div 
          className="grid md:grid-cols-3 gap-6 text-left"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="p-4 bg-white/5 backdrop-blur rounded-lg border border-white/10">
            <div className="text-2xl mb-2">🧠</div>
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Adaptativo</h3>
            <p className="text-gray-400 text-sm">
              Se ajusta a tu forma única de pensar y explorar
            </p>
          </div>
          
          <div className="p-4 bg-white/5 backdrop-blur rounded-lg border border-white/10">
            <div className="text-2xl mb-2">🌐</div>
            <h3 className="text-lg font-semibold text-cyan-400 mb-2">Conectivo</h3>
            <p className="text-gray-400 text-sm">
              Red de mentes explorando juntas nuevas perspectivas
            </p>
          </div>
          
          <div className="p-4 bg-white/5 backdrop-blur rounded-lg border border-white/10">
            <div className="text-2xl mb-2">🚀</div>
            <h3 className="text-lg font-semibold text-pink-400 mb-2">Evolutivo</h3>
            <p className="text-gray-400 text-sm">
              Crece y se transforma con cada nueva conciencia
            </p>
          </div>
        </motion.div>

        {/* Información específica para arquitectos */}
        {isArchitect && (
          <motion.div 
            className="mt-8 p-4 bg-green-900/20 border border-green-700 rounded-lg"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            <div className="text-green-400 text-sm font-mono">
              [ARCHITECT MODE] Sistema fractal auto-organizativo • {meta.stats?.modules || 5} módulos activos • 
              Profundidad cognitiva: {meta.stats?.cognitive_depth || 3}
            </div>
          </motion.div>
        )}

        {/* CTA adaptativo */}
        <motion.div 
          className="mt-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <motion.button
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-semibold rounded-full shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(139, 92, 246, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = profile?.type === 'architect' ? '/dev' : '/onboarding'}
          >
            {profile?.type === 'architect' ? '🛰️ Entrar al Kernel' : '🌌 Explorar tu Mente'}
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default WhatIsPrunaverso;