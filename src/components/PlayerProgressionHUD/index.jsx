import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, RotateCcw } from 'lucide-react';
import usePlayerProgression from '../../hooks/usePlayerProgression';

/**
 * 🎮 PlayerProgressionHUD - Interfaz de Progresión del Jugador
 * 
 * Muestra en tiempo real el progreso XP, nivel, madurez y logros.
 * Interfaz gamificada que hace visible la evolución del usuario.
 */
const PlayerProgressionHUD = ({ position = 'top-right', compact = false }) => {
  const {
    playerState,
    currentLevelInfo,
    madurezInfo,
    getXPProgress
  } = usePlayerProgression();

  const [isExpanded, setIsExpanded] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showXPGain, setShowXPGain] = useState(null);
  const [showSettings, setShowSettings] = useState(false);

  const progress = getXPProgress();

  // Función para reiniciar la experiencia
  const handleResetExperience = () => {
    if (window.confirm('¿Quieres volver a vivir la experiencia de despertar en el Prunaverso desde el principio?')) {
      localStorage.removeItem('awakeningSeen');
      localStorage.removeItem('prunaverso_visitor_profile');
      localStorage.removeItem('prunaverso_player_progression');
      window.location.href = '/awakening';
    }
  };

  // Efectos de nivel subido
  useEffect(() => {
    if (playerState.isLevelingUp) {
      setShowLevelUp(true);
      const timer = setTimeout(() => setShowLevelUp(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [playerState.isLevelingUp]);

  // Mostrar ganancia de XP
  useEffect(() => {
    const lastEntry = playerState.xpHistory[playerState.xpHistory.length - 1];
    if (lastEntry && Date.now() - lastEntry.timestamp < 2000) {
      setShowXPGain(lastEntry);
      const timer = setTimeout(() => setShowXPGain(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [playerState.xpHistory]);

  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  };

  if (compact) {
    return (
      <motion.div
        className={`fixed ${positionStyles[position]} z-50`}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-black/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-3 text-cyan-100 font-mono text-sm">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400">LVL {progress.level}</span>
            <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 transition-all duration-500"
                style={{ width: `${currentLevelInfo.progressPercent}%` }}
              />
            </div>
            <span className="text-xs">{progress.total} XP</span>
          </div>
          
          <div className="flex items-center gap-1 mt-1">
            <span className="text-purple-400 text-xs">Madurez:</span>
            <div className="w-12 h-0.5 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 transition-all duration-500"
                style={{ width: `${playerState.madurezPrunaverso}%` }}
              />
            </div>
            <span className="text-xs">{Math.round(playerState.madurezPrunaverso)}%</span>
          </div>
        </div>

        {/* Efectos de ganancia XP */}
        <AnimatePresence>
          {showXPGain && (
            <motion.div
              className="absolute -top-8 left-1/2 transform -translate-x-1/2"
              initial={{ opacity: 0, y: 0, scale: 1 }}
              animate={{ opacity: 1, y: -20, scale: 1.2 }}
              exit={{ opacity: 0, y: -40, scale: 0.8 }}
              transition={{ duration: 2 }}
            >
              <div className="bg-green-500/90 text-white px-2 py-1 rounded text-xs font-bold">
                +{showXPGain.xpGained} XP
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`fixed ${positionStyles[position]} z-50`}
      initial={{ opacity: 0, x: position.includes('right') ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div 
        className={`bg-black/90 backdrop-blur-md border border-cyan-400/50 rounded-xl text-cyan-100 font-mono transition-all duration-300 ${
          isExpanded ? 'w-80' : 'w-64'
        }`}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Header con información principal */}
        <div className="p-4 border-b border-cyan-400/30">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-cyan-400">
                {currentLevelInfo.title}
              </h3>
              <p className="text-xs text-cyan-300/70">
                Nivel {progress.level} • {progress.total} XP Total
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <div className="text-2xl font-bold text-cyan-400">
                  {progress.level}
                </div>
                <div className="text-xs text-cyan-300/70">LVL</div>
              </div>
              
              {/* Botón de configuración */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                <Settings size={16} />
              </motion.button>
            </div>
          </div>

          {/* Panel de configuración */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 pt-3 border-t border-cyan-400/20"
              >
                <button
                  onClick={handleResetExperience}
                  className="flex items-center space-x-2 w-full p-2 text-sm text-cyan-300 hover:text-white hover:bg-cyan-400/10 rounded transition-colors"
                >
                  <RotateCcw size={14} />
                  <span>Revivir despertar inicial</span>
                </button>
                <p className="text-xs text-cyan-300/50 mt-1 px-2">
                  Vuelve a experimentar tu primer contacto con el Prunaverso
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Barra de progreso nivel */}
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progreso al siguiente nivel</span>
              <span>{currentLevelInfo.xpToNext} XP restante</span>
            </div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-cyan-400 to-blue-400"
                initial={{ width: 0 }}
                animate={{ width: `${currentLevelInfo.progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>

        {/* Información expandida */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              {/* Madurez en el Prunaverso */}
              <div className="p-4 border-b border-cyan-400/20">
                <h4 className="text-sm font-bold text-purple-400 mb-2">
                  Madurez Prunaversal
                </h4>
                <div className="flex justify-between text-xs mb-1">
                  <span>{madurezInfo.stage}</span>
                  <span>{Math.round(playerState.madurezPrunaverso)}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${playerState.madurezPrunaverso}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  />
                </div>
                <p className="text-xs text-purple-300/70 mt-1">
                  {madurezInfo.description}
                </p>
              </div>

              {/* Skill Trees */}
              <div className="p-4 border-b border-cyan-400/20">
                <h4 className="text-sm font-bold text-cyan-400 mb-2">
                  Habilidades Cognitivas
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(playerState.skillTrees).map(([skill, data]) => (
                    <div key={skill} className="flex items-center gap-1">
                      <span className="capitalize text-cyan-300">
                        {skill.charAt(0).toUpperCase() + skill.slice(1)}:
                      </span>
                      <span className="text-cyan-400 font-bold">
                        {data.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estadísticas de sesión */}
              <div className="p-4 border-b border-cyan-400/20">
                <h4 className="text-sm font-bold text-green-400 mb-2">
                  Sesión Actual
                </h4>
                <div className="flex justify-between text-xs">
                  <span>XP Ganado:</span>
                  <span className="text-green-400 font-bold">
                    +{progress.session} XP
                  </span>
                </div>
                {playerState.multiplier > 1.0 && (
                  <div className="flex justify-between text-xs mt-1">
                    <span>Multiplicador:</span>
                    <span className="text-yellow-400 font-bold">
                      x{playerState.multiplier.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>

              {/* Logros recientes */}
              {playerState.recentAchievements.length > 0 && (
                <div className="p-4">
                  <h4 className="text-sm font-bold text-yellow-400 mb-2">
                    Logros Recientes
                  </h4>
                  <div className="space-y-1 max-h-20 overflow-y-auto">
                    {playerState.recentAchievements.slice(-3).map((achievement, idx) => (
                      <div key={achievement.id} className="text-xs p-1 bg-yellow-900/20 rounded">
                        <div className="text-yellow-400 font-bold">
                          {achievement.title}
                        </div>
                        <div className="text-yellow-300/70">
                          {achievement.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Efectos especiales */}
        <AnimatePresence>
          {showLevelUp && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-cyan-400/20 rounded-xl"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 3 }}
            >
              <div className="text-center">
                <motion.div
                  className="text-3xl font-bold text-cyan-400"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: 2 }}
                >
                  ¡NIVEL {progress.level}!
                </motion.div>
                <div className="text-sm text-cyan-300">
                  {currentLevelInfo.title}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Efectos de ganancia XP */}
        <AnimatePresence>
          {showXPGain && (
            <motion.div
              className="absolute -top-8 right-4"
              initial={{ opacity: 0, y: 0, scale: 1 }}
              animate={{ opacity: 1, y: -30, scale: 1.2 }}
              exit={{ opacity: 0, y: -60, scale: 0.8 }}
              transition={{ duration: 2 }}
            >
              <div className="bg-green-500/90 text-white px-3 py-1 rounded-lg font-bold shadow-lg">
                +{showXPGain.xpGained} XP
                <div className="text-xs opacity-80">
                  {showXPGain.action.replace(/_/g, ' ')}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PlayerProgressionHUD;