import React from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, ArrowLeft, ArrowRight, Brain, Target } from 'lucide-react';

const GDDViewerModal = ({ 
  section, 
  categoryConfig, 
  onClose, 
  onNavigate, 
  allSections 
}) => {
  if (!section) return null;

  const category = categoryConfig[section.category] || categoryConfig.system;
  const IconComponent = category.icon;

  // Obtener secciones relacionadas
  const relatedSections = allSections?.filter(s => 
    s.id !== section.id && (
      section.connections?.includes(s.id) ||
      s.connections?.includes(section.id) ||
      s.category === section.category
    )
  ).slice(0, 4) || [];

  // Navegación entre secciones
  const currentIndex = allSections?.findIndex(s => s.id === section.id) || 0;
  const prevSection = allSections?.[currentIndex - 1];
  const nextSection = allSections?.[currentIndex + 1];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gradient-to-br from-gray-900 to-blue-900 border border-white/20 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-white/10 p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`p-3 bg-gradient-to-br ${category.color} rounded-lg shadow-lg`}>
                <IconComponent className="w-8 h-8 text-white" />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{section.title}</h2>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full bg-gradient-to-r ${category.color} text-white`}>
                    {category.label}
                  </span>
                  <span className="text-gray-400 text-sm">ID: {section.id}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navegación */}
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={() => prevSection && onNavigate(prevSection)}
              disabled={!prevSection}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                prevSection 
                  ? 'border-white/20 text-white hover:bg-white/10' 
                  : 'border-gray-600 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            <div className="text-center text-gray-400 text-sm">
              {currentIndex + 1} de {allSections?.length || 0}
            </div>

            <button
              onClick={() => nextSection && onNavigate(nextSection)}
              disabled={!nextSection}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                nextSection 
                  ? 'border-white/20 text-white hover:bg-white/10' 
                  : 'border-gray-600 text-gray-500 cursor-not-allowed'
              }`}
            >
              <span className="hidden sm:inline">Siguiente</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Descripción */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Descripción</h3>
            <p className="text-gray-300 leading-relaxed">{section.description}</p>
          </div>

          {/* Contenido detallado */}
          {section.content && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Contenido</h3>
              <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">{section.content}</p>
              </div>
            </div>
          )}

          {/* Keywords */}
          {section.keywords && section.keywords.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Palabras Clave</h3>
              <div className="flex flex-wrap gap-2">
                {section.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-white/10 text-gray-300 rounded-full border border-white/20 text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Conexiones */}
          {section.connections && section.connections.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <ExternalLink className="w-5 h-5" />
                Secciones Relacionadas
              </h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {section.connections.map(connId => {
                  const connectedSection = allSections?.find(s => s.id === connId);
                  if (!connectedSection) return null;
                  
                  const connCategory = categoryConfig[connectedSection.category] || categoryConfig.system;
                  const ConnIconComponent = connCategory.icon;

                  return (
                    <motion.button
                      key={connId}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onNavigate(connectedSection)}
                      className="flex items-center gap-3 p-3 bg-black/30 border border-white/10 rounded-lg hover:border-white/30 transition-colors text-left"
                    >
                      <div className={`p-2 bg-gradient-to-br ${connCategory.color} rounded`}>
                        <ConnIconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">{connectedSection.title}</div>
                        <div className="text-gray-400 text-xs">{connCategory.label}</div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {relatedSections.length > 0 && (
          <div className="border-t border-white/10 p-6">
            <h3 className="text-lg font-semibold text-white mb-3">Explorar Más</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {relatedSections.map(relatedSection => {
                const relCategory = categoryConfig[relatedSection.category] || categoryConfig.system;
                const RelIconComponent = relCategory.icon;

                return (
                  <motion.button
                    key={relatedSection.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onNavigate(relatedSection)}
                    className="flex flex-col items-center gap-2 p-3 bg-black/30 border border-white/10 rounded-lg hover:border-white/30 transition-colors"
                  >
                    <div className={`p-2 bg-gradient-to-br ${relCategory.color} rounded`}>
                      <RelIconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-center">
                      <div className="text-white font-medium text-sm">{relatedSection.title}</div>
                      <div className="text-gray-400 text-xs">{relCategory.label}</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GDDViewerModal;