import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useVisitorProfile from '../../hooks/useVisitorProfile';
import InfoOrbital from '../../components/InfoOrbital';
import WhatIsPrunaverso from './WhatIsPrunaverso';

/**
 * 🌍 PORTAL PÚBLICO - EXPERIENCIA NARRATIVA
 * 
 * Interfaz accesible y guiada para visitantes externos.
 * Enfoque en la exploración cognitiva y el descubrimiento.
 */
const PublicPortal = () => {
  const { profile } = useVisitorProfile();
  const [currentView, setCurrentView] = useState('welcome');
  const [showHelp, setShowHelp] = useState(false);

  const views = [
    { id: 'welcome', title: '¿Qué es el Prunaverso?', icon: '🌌' },
    { id: 'explore', title: 'Explorar Arquetipos', icon: '🎭' },
    { id: 'journey', title: 'Iniciar Viaje', icon: '🚀' },
    { id: 'learn', title: 'Aprender Más', icon: '📚' }
  ];

  const getViewContent = () => {
    switch(currentView) {
      case 'welcome':
        return <WhatIsPrunaverso />;
      case 'explore':
        return (
          <div className="text-center p-8">
            <h2 className="text-3xl font-bold text-purple-400 mb-4">Arquetipos Cognitivos</h2>
            <p className="text-gray-300 mb-6">
              Descubre los diferentes tipos de mente que habitan el Prunaverso
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {['🧠 Neuroartista', '🔬 Investigador', '🎭 Empático', '⚙️ Arquitecto', '🌟 Visionario', '🎨 Creativo'].map((archetype, i) => (
                <motion.div
                  key={i}
                  className="p-4 bg-purple-900/20 rounded-lg border border-purple-600/30 hover:border-purple-400 cursor-pointer"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl mb-2">{archetype.split(' ')[0]}</div>
                  <div className="text-sm text-gray-300">{archetype.split(' ')[1]}</div>
                </motion.div>
              ))}
            </div>
          </div>
        );
      case 'journey':
        return (
          <div className="text-center p-8">
            <h2 className="text-3xl font-bold text-blue-400 mb-4">Tu Viaje Cognitivo</h2>
            <p className="text-gray-300 mb-8">
              Cada mente es única. Inicia tu exploración personalizada.
            </p>
            <motion.button
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/onboarding'}
            >
              Comenzar Exploración 🚀
            </motion.button>
          </div>
        );
      case 'learn':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">Sobre el Prunaverso</h2>
            <div className="max-w-4xl mx-auto space-y-6 text-gray-300">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-green-900/20 rounded-lg">
                  <h3 className="text-xl font-semibold text-green-400 mb-3">🧠 Cognición Adaptativa</h3>
                  <p>El Prunaverso se adapta a tu forma única de pensar, creando una experiencia personalizada que evoluciona contigo.</p>
                </div>
                <div className="p-6 bg-blue-900/20 rounded-lg">
                  <h3 className="text-xl font-semibold text-blue-400 mb-3">🌐 Red de Conciencias</h3>
                  <p>Conecta con otras mentes explorando diferentes perspectivas y formas de entender el mundo.</p>
                </div>
                <div className="p-6 bg-purple-900/20 rounded-lg">
                  <h3 className="text-xl font-semibold text-purple-400 mb-3">🎭 Arquetipos Vivos</h3>
                  <p>Cada arquetipo es una personalidad completa con su propia forma de ver y experimentar la realidad.</p>
                </div>
                <div className="p-6 bg-pink-900/20 rounded-lg">
                  <h3 className="text-xl font-semibold text-pink-400 mb-3">🚀 Evolución Continua</h3>
                  <p>Tu perfil cognitivo crece y se refina con cada interacción, creando una experiencia siempre nueva.</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <WhatIsPrunaverso />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Fondo animado sutil */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent"></div>
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header minimalista */}
      <motion.header 
        className="relative z-10 p-6 text-center"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent mb-2">
          Prunaverso
        </h1>
        <p className="text-gray-300 text-lg">
          {profile?.name ? `Bienvenido de vuelta, ${profile.name}` : 'Explora tu universo cognitivo'}
        </p>
      </motion.header>

      {/* Navegación */}
      <nav className="relative z-10 p-6">
        <div className="flex justify-center space-x-2 md:space-x-4 flex-wrap">
          {views.map((view) => (
            <motion.button
              key={view.id}
              className={`px-4 py-2 rounded-full text-sm md:text-base transition-all ${
                currentView === view.id
                  ? 'bg-purple-600 text-white shadow-lg'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
              onClick={() => setCurrentView(view.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="mr-2">{view.icon}</span>
              {view.title}
            </motion.button>
          ))}
        </div>
      </nav>

      {/* Contenido principal */}
      <main className="relative z-10 min-h-[60vh]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {getViewContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Info Orbitales para ayuda contextual */}
      <AnimatePresence>
        {showHelp && (
          <>
            <InfoOrbital 
              term="prunaverso"
              position="top-right"
              isVisible={showHelp}
              onClose={() => setShowHelp(false)}
            />
            <InfoOrbital 
              term="arquetipo"
              position="bottom-left"
              isVisible={showHelp}
              onClose={() => setShowHelp(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Botón de ayuda flotante */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-lg z-20"
        onClick={() => setShowHelp(!showHelp)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          boxShadow: showHelp 
            ? "0 0 20px rgba(168, 85, 247, 0.6)" 
            : "0 4px 20px rgba(0, 0, 0, 0.3)"
        }}
      >
        <span className="text-xl">{showHelp ? '×' : 'ⓘ'}</span>
      </motion.button>

      {/* Footer minimalista */}
      <footer className="relative z-10 p-6 text-center text-gray-500 text-sm">
        <p>Construido con conciencia • Diseñado para expandir mentes</p>
      </footer>
    </div>
  );
};

export default PublicPortal;