import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useVisitorProfile from '../../hooks/useVisitorProfile';
import InfoOrbital from '../../components/InfoOrbital';
import GameControls from '../../components/GameControls';

const PortalMain = () => {
  const navigate = useNavigate();
  const { profile, isLoading, triggerCognitiveEvolution } = useVisitorProfile();
  const [selectedOption, setSelectedOption] = useState(0);
  const [showingHelp, setShowingHelp] = useState(false);

  // Opciones del menú que se adaptan según el perfil cognitivo
  const getMenuOptions = () => {
    const baseOptions = [
      {
        id: 'explore_archetypes',
        title: 'Explorar Arquetipos',
        description: 'Descubre las diferentes personalidades del Prunaverso',
        icon: '🎭',
        path: '/arquetipos',
        level: 0,
        key: 'X' // PlayStation X
      },
      {
        id: 'character_selector',
        title: 'Selector de Personajes',
        description: 'Elige tu arquetipo para esta sesión',
        icon: '⚡',
        path: '/personajes',
        level: 0,
        key: 'O' // PlayStation O
      },
      {
        id: 'cognitive_lab',
        title: 'Laboratorio Cognitivo',
        description: 'Experimenta con diferentes lentes de percepción',
        icon: '🧠',
        path: '/laboratorio',
        level: 1,
        key: 'Square' // PlayStation Square
      }
    ];

    // Opciones avanzadas según nivel cognitivo
    if (profile?.cognitiveLevel >= 2) {
      baseOptions.push({
        id: 'vector_space',
        title: 'Espacio Vectorial',
        description: 'Navega el espacio multidimensional de arquetipos',
        icon: '📐',
        path: '/vectores',
        level: 2,
        key: 'Triangle' // PlayStation Triangle
      });
    }

    if (profile?.cognitiveLevel >= 3) {
      baseOptions.push({
        id: 'consciousness_network',
        title: 'Red de Conciencias',
        description: 'Conecta con otras inteligencias del Prunaverso',
        icon: '🌐',
        path: '/red',
        level: 3,
        key: 'L1' // PlayStation L1
      });
    }

    if (profile?.type === 'architect' || profile?.cognitiveLevel >= 4) {
      baseOptions.push({
        id: 'system_admin',
        title: 'Administración del Sistema',
        description: 'Acceso a la arquitectura interna del Prunaverso',
        icon: '⚙️',
        path: '/admin',
        level: 4,
        key: 'R1' // PlayStation R1
      });
    }

    return baseOptions.filter(option => 
      (profile?.cognitiveLevel || 0) >= option.level
    );
  };

  const menuOptions = getMenuOptions();

  // Control con teclado y gamepad
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch(e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          setSelectedOption(prev => 
            prev > 0 ? prev - 1 : menuOptions.length - 1
          );
          break;
        case 'arrowdown':
        case 's':
          setSelectedOption(prev => 
            prev < menuOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case 'enter':
        case ' ':
          handleOptionSelect(menuOptions[selectedOption]);
          break;
        case 'escape':
          setShowingHelp(!showingHelp);
          break;
        case 'i':
          setShowingHelp(!showingHelp);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [selectedOption, menuOptions.length, showingHelp]);

  const handleOptionSelect = (option) => {
    if (option.path) {
      // Trigger cognitive evolution si es apropiado
      if (option.level > (profile?.cognitiveLevel || 0)) {
        triggerCognitiveEvolution();
      }
      navigate(option.path);
    }
  };

  // Colores adaptativos según el perfil
  const getAdaptiveColors = () => {
    if (!profile) return {
      primary: 'from-blue-500 to-purple-600',
      secondary: 'from-purple-500 to-pink-500',
      accent: 'text-blue-400'
    };

    const colorSchemes = {
      newcomer: {
        primary: 'from-green-400 to-blue-500',
        secondary: 'from-blue-400 to-indigo-500',
        accent: 'text-green-400'
      },
      curious: {
        primary: 'from-yellow-400 to-orange-500',
        secondary: 'from-orange-400 to-red-500',
        accent: 'text-yellow-400'
      },
      ally: {
        primary: 'from-purple-500 to-pink-600',
        secondary: 'from-pink-500 to-red-500',
        accent: 'text-purple-400'
      },
      architect: {
        primary: 'from-cyan-400 to-blue-600',
        secondary: 'from-blue-500 to-indigo-600',
        accent: 'text-cyan-400'
      }
    };

    return colorSchemes[profile.type] || colorSchemes.newcomer;
  };

  const colors = getAdaptiveColors();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          className="text-2xl text-blue-400"
          animate={{
            opacity: [1, 0.5, 1],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Sincronizando conciencia...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Fondo dinámico */}
      <div className="absolute inset-0">
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${colors.primary} opacity-10`}
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 1, 0]
          }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className={`absolute inset-0 bg-gradient-to-tl ${colors.secondary} opacity-5`}
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [1, 0, 1]
          }}
          transition={{ duration: 25, repeat: Infinity }}
        />
      </div>

      {/* Header adaptativo */}
      <motion.header
        className="relative z-10 p-8 text-center"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
          Portal Principal
        </h1>
        <motion.div
          className={`text-xl ${colors.accent} mb-2`}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Bienvenido, {profile?.name || 'Explorador'}
        </motion.div>
        <div className="text-sm text-gray-400">
          Nivel Cognitivo: {profile?.cognitiveLevel || 0} | 
          Tipo: {profile?.type || 'newcomer'} | 
          Lente Activa: {profile?.activeLens || 'default'}
        </div>
      </motion.header>

      {/* Menú principal */}
      <main className="relative z-10 flex flex-col items-center justify-center px-8 py-12">
        <motion.div
          className="grid gap-6 max-w-4xl w-full"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {menuOptions.map((option, index) => (
            <motion.div
              key={option.id}
              className={`
                relative p-6 rounded-lg border transition-all duration-300 cursor-pointer
                ${selectedOption === index 
                  ? `border-purple-400 bg-purple-900/30 shadow-lg shadow-purple-500/20` 
                  : `border-gray-600 bg-gray-900/30 hover:border-gray-400`
                }
              `}
              onClick={() => handleOptionSelect(option)}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setSelectedOption(index)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{option.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {option.title}
                    </h3>
                    <p className="text-gray-300 text-sm">
                      {option.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="text-xs text-gray-400 px-2 py-1 bg-gray-800 rounded">
                    {option.key}
                  </span>
                  {option.level > 0 && (
                    <span className="text-xs text-blue-400 px-2 py-1 bg-blue-900/30 rounded">
                      Nivel {option.level}+
                    </span>
                  )}
                </div>
              </div>

              {/* Indicador de selección */}
              {selectedOption === index && (
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-500 rounded-l-lg"
                  layoutId="selection-indicator"
                />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* HUD cognitivo */}
        <motion.div
          className="mt-12 p-4 bg-gray-900/50 backdrop-blur rounded-lg border border-gray-600"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Estado Cognitivo</h4>
          <div className="flex space-x-6 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-400"></div>
              <span className="text-gray-400">Sistema: SISC activo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <span className="text-gray-400">Vector: [{profile?.vector?.join(', ') || '0,0,0'}]</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-purple-400"></div>
              <span className="text-gray-400">Checkpoints: {profile?.checkpoints?.length || 0}</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Controles de juego */}
      <GameControls />

      {/* Info Orbitales contextuales */}
      <AnimatePresence>
        {showingHelp && (
          <>
            <InfoOrbital 
              term="prunaverso"
              position="top-right"
              isVisible={showingHelp}
              onClose={() => setShowingHelp(false)}
            />
            <InfoOrbital 
              term="sisc"
              position="bottom-left"
              isVisible={showingHelp}
              onClose={() => setShowingHelp(false)}
            />
            <InfoOrbital 
              term="arquetipo"
              position="center"
              isVisible={showingHelp}
              onClose={() => setShowingHelp(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* Instrucciones de ayuda */}
      <motion.div
        className="absolute bottom-4 right-4 text-xs text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        Presiona [I] o [ESC] para ver información contextual
      </motion.div>
    </div>
  );
};

export default PortalMain;