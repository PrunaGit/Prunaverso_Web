import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACHIEVEMENT_RARITIES, ACHIEVEMENT_CATEGORIES } from '../../data/achievements';

/**
 * 🏆 AchievementNotification - Notificaciones de Logros
 * 
 * Muestra notificaciones animadas cuando el usuario desbloquea logros.
 * Diferentes estilos según la rareza del logro.
 */
const AchievementNotification = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    // Auto-close después de 5 segundos
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 500); // Tiempo para animación de salida
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!achievement) return null;

  const rarity = ACHIEVEMENT_RARITIES[achievement.rarity] || ACHIEVEMENT_RARITIES.common;
  const category = ACHIEVEMENT_CATEGORIES[achievement.category] || ACHIEVEMENT_CATEGORIES.exploration;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999]"
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            duration: 0.6 
          }}
        >
          <div 
            className={`
              relative bg-black/95 backdrop-blur-lg border-2 rounded-xl p-4 min-w-80 max-w-md
              shadow-2xl font-mono text-white overflow-hidden
              ${rarity.glow ? 'animate-pulse' : ''}
            `}
            style={{ 
              borderColor: rarity.color,
              boxShadow: rarity.glow ? `0 0 20px ${rarity.color}40` : 'none'
            }}
          >
            {/* Efectos de fondo */}
            {rarity.particles && (
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full"
                    style={{ backgroundColor: rarity.color }}
                    initial={{ 
                      x: Math.random() * 100 + '%', 
                      y: '100%',
                      opacity: 0.8
                    }}
                    animate={{ 
                      y: '-10%',
                      opacity: 0
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2
                    }}
                  />
                ))}
              </div>
            )}

            {/* Header del logro */}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  <span 
                    className="text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider"
                    style={{ 
                      backgroundColor: `${rarity.color}20`,
                      color: rarity.color,
                      border: `1px solid ${rarity.color}60`
                    }}
                  >
                    {rarity.name}
                  </span>
                </div>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-white transition-colors text-lg"
                >
                  ×
                </button>
              </div>

              {/* Título del logro */}
              <motion.h3 
                className="text-lg font-bold mb-1"
                style={{ color: rarity.color }}
                animate={rarity.special ? { 
                  textShadow: [
                    `0 0 5px ${rarity.color}`,
                    `0 0 20px ${rarity.color}`,
                    `0 0 5px ${rarity.color}`
                  ]
                } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🏆 ¡LOGRO DESBLOQUEADO!
              </motion.h3>

              <h4 className="text-xl font-bold text-white mb-2">
                {achievement.title}
              </h4>

              {/* Descripción */}
              <p className="text-gray-300 text-sm mb-3">
                {achievement.description}
              </p>

              {/* Recompensa XP */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Categoría:</span>
                  <span 
                    className="font-bold"
                    style={{ color: category.color || '#cyan' }}
                  >
                    {category.name}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-green-500/20 border border-green-500/50 rounded-lg px-3 py-1">
                  <span className="text-green-400 font-bold">+{achievement.xpReward}</span>
                  <span className="text-green-300 text-xs">XP</span>
                </div>
              </div>
            </div>

            {/* Barra de progreso temporal */}
            <motion.div 
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-white to-transparent"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: "linear" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * 🏆 AchievementManager - Gestor de Notificaciones de Logros
 * 
 * Componente contenedor que maneja múltiples notificaciones de logros.
 */
const AchievementManager = ({ achievements = [] }) => {
  const [visibleAchievements, setVisibleAchievements] = useState([]);

  useEffect(() => {
    // Agregar nuevos logros a la lista de visibles
    achievements.forEach(achievement => {
      if (!visibleAchievements.some(visible => visible.id === achievement.id)) {
        setVisibleAchievements(prev => [...prev, {
          ...achievement,
          timestamp: Date.now()
        }]);
      }
    });
  }, [achievements]);

  const removeAchievement = (achievementId) => {
    setVisibleAchievements(prev => 
      prev.filter(achievement => achievement.id !== achievementId)
    );
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      <AnimatePresence>
        {visibleAchievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ y: -100 * (index + 1) }}
            animate={{ y: 80 * index }}
            exit={{ y: -100 }}
            transition={{ duration: 0.5 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 pointer-events-auto"
          >
            <AchievementNotification
              achievement={achievement}
              onClose={() => removeAchievement(achievement.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AchievementManager;
export { AchievementNotification };