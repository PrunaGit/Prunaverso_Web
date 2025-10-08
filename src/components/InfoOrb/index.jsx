import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Book, Lightbulb, Settings, Users, Star } from 'lucide-react';

const InfoOrb = ({ 
  title, 
  content, 
  filePath, 
  onClose, 
  type = 'knowledge',
  position = 'center' 
}) => {
  const [displayContent, setDisplayContent] = useState(content);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (filePath && !content) {
      setIsLoading(true);
      // En un caso real, aquí cargaríamos el archivo
      // Por ahora usamos el content pasado
      setIsLoading(false);
    }
  }, [filePath, content]);

  const getIcon = () => {
    switch (type) {
      case 'knowledge': return <Book className="w-6 h-6" />;
      case 'insight': return <Lightbulb className="w-6 h-6" />;
      case 'system': return <Settings className="w-6 h-6" />;
      case 'social': return <Users className="w-6 h-6" />;
      case 'achievement': return <Star className="w-6 h-6" />;
      default: return <Book className="w-6 h-6" />;
    }
  };

  const getColorScheme = () => {
    switch (type) {
      case 'knowledge': return 'from-blue-500 to-cyan-500';
      case 'insight': return 'from-yellow-500 to-orange-500';
      case 'system': return 'from-gray-500 to-slate-500';
      case 'social': return 'from-green-500 to-emerald-500';
      case 'achievement': return 'from-purple-500 to-pink-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-2xl w-full max-h-[80vh] overflow-hidden"
        >
          {/* Orbe principal */}
          <div className="relative bg-gradient-to-br from-slate-800 via-slate-900 to-black border border-white/20 rounded-2xl shadow-2xl">
            
            {/* Header con icono y título */}
            <div className={`flex items-center justify-between p-6 bg-gradient-to-r ${getColorScheme()} text-white rounded-t-2xl`}>
              <div className="flex items-center space-x-3">
                {getIcon()}
                <h2 className="text-xl font-bold">{title}</h2>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full"
                  />
                </div>
              ) : (
                <div className="text-gray-100 leading-relaxed space-y-4">
                  {typeof displayContent === 'string' ? (
                    <div className="whitespace-pre-wrap">{displayContent}</div>
                  ) : (
                    displayContent
                  )}
                </div>
              )}
            </div>

            {/* Footer opcional */}
            <div className="px-6 pb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className={`w-full py-3 bg-gradient-to-r ${getColorScheme()} text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300`}
              >
                Continuar exploración
              </motion.button>
            </div>
          </div>

          {/* Efecto de partículas */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }, (_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/40 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InfoOrb;