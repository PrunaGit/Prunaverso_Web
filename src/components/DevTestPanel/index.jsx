import React from 'react';
import { motion } from 'framer-motion';

const DevTestPanel = ({ onResetAwakening, onResetProgress, onSimulateNewUser }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleResetAwakening = () => {
    localStorage.removeItem('awakeningSeen');
    localStorage.removeItem('prunaverso_visitor_profile');
    window.location.reload();
  };

  const handleResetProgress = () => {
    localStorage.removeItem('prunaverso_player_progression');
    window.location.reload();
  };

  const handleSimulateNewUser = () => {
    localStorage.clear();
    window.location.href = '/awakening';
  };

  if (process.env.NODE_ENV === 'production') {
    return null; // No mostrar en producción
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed top-4 right-4 z-50"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-gray-800/90 text-white px-3 py-2 rounded-lg text-sm font-mono backdrop-blur-sm border border-gray-600"
      >
        🧪 DEV
      </motion.button>

      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-12 right-0 bg-gray-800/95 backdrop-blur-sm rounded-lg p-4 min-w-64 border border-gray-600"
        >
          <h3 className="text-white text-sm font-bold mb-3">🎮 Panel de Pruebas</h3>
          
          <div className="space-y-2">
            <button
              onClick={handleSimulateNewUser}
              className="w-full text-left px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm transition-colors"
            >
              🌌 Simular Nuevo Visitante
            </button>
            
            <button
              onClick={handleResetAwakening}
              className="w-full text-left px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
            >
              🔄 Reset Awakening
            </button>
            
            <button
              onClick={handleResetProgress}
              className="w-full text-left px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded text-sm transition-colors"
            >
              📊 Reset Progreso XP
            </button>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            Solo visible en desarrollo
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DevTestPanel;