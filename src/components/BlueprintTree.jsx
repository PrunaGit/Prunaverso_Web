import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BlueprintTree = ({ 
  sections, 
  categoryConfig, 
  onSectionSelect, 
  selectedSection 
}) => {
  const [hoveredSection, setHoveredSection] = useState(null);

  // Organizar secciones por categoría
  const sectionsByCategory = sections?.reduce((acc, section) => {
    const category = section.category || 'system';
    if (!acc[category]) acc[category] = [];
    acc[category].push(section);
    return acc;
  }, {}) || {};

  // Calcular posiciones en el árbol fractal
  const getNodePosition = (categoryIndex, sectionIndex, totalSections) => {
    const centerX = 50;
    const centerY = 50;
    const radius = 25 + (categoryIndex * 8);
    const angle = (sectionIndex * 2 * Math.PI) / totalSections;
    
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  // Obtener conexiones entre nodos
  const getConnections = () => {
    const connections = [];
    sections?.forEach(section => {
      section.connections?.forEach(connId => {
        const connectedSection = sections.find(s => s.id === connId);
        if (connectedSection) {
          connections.push({
            from: section.id,
            to: connId,
            active: selectedSection?.id === section.id || selectedSection?.id === connId
          });
        }
      });
    });
    return connections;
  };

  const connections = getConnections();

  return (
    <div className="relative w-full h-[600px] bg-black/20 border border-white/10 rounded-xl overflow-hidden">
      {/* Fondo de blueprint */}
      <div className="absolute inset-0 opacity-20">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="cyan" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="cyan" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="transparent"/>
            </radialGradient>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="50%" cy="50%" r="100" fill="url(#centerGlow)" />
        </svg>
      </div>

      {/* SVG para conexiones */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {connections.map((conn, index) => {
          const fromSection = sections?.find(s => s.id === conn.from);
          const toSection = sections?.find(s => s.id === conn.to);
          if (!fromSection || !toSection) return null;

          const fromCategoryIndex = Object.keys(sectionsByCategory).indexOf(fromSection.category || 'system');
          const fromSectionIndex = sectionsByCategory[fromSection.category || 'system']?.indexOf(fromSection) || 0;
          const fromTotal = sectionsByCategory[fromSection.category || 'system']?.length || 1;
          
          const toCategoryIndex = Object.keys(sectionsByCategory).indexOf(toSection.category || 'system');
          const toSectionIndex = sectionsByCategory[toSection.category || 'system']?.indexOf(toSection) || 0;
          const toTotal = sectionsByCategory[toSection.category || 'system']?.length || 1;

          const fromPos = getNodePosition(fromCategoryIndex, fromSectionIndex, fromTotal);
          const toPos = getNodePosition(toCategoryIndex, toSectionIndex, toTotal);

          return (
            <motion.line
              key={`${conn.from}-${conn.to}`}
              x1={`${fromPos.x}%`}
              y1={`${fromPos.y}%`}
              x2={`${toPos.x}%`}
              y2={`${toPos.y}%`}
              stroke={conn.active ? "#00ffff" : "#ffffff40"}
              strokeWidth={conn.active ? "2" : "1"}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.8 }}
              className={conn.active ? "drop-shadow-glow" : ""}
            />
          );
        })}
      </svg>

      {/* Nodos de secciones */}
      <div className="absolute inset-0 z-20">
        {Object.entries(sectionsByCategory).map(([category, categorySection], categoryIndex) => (
          <div key={category}>
            {categorySection.map((section, sectionIndex) => {
              const position = getNodePosition(categoryIndex, sectionIndex, categorySection.length);
              const categoryConfig_ = categoryConfig[category] || categoryConfig.system;
              const IconComponent = categoryConfig_.icon;
              const isSelected = selectedSection?.id === section.id;
              const isHovered = hoveredSection === section.id;

              return (
                <motion.div
                  key={section.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: categoryIndex * 0.2 + sectionIndex * 0.1 }}
                  whileHover={{ scale: 1.2 }}
                  onClick={() => onSectionSelect(section)}
                  onMouseEnter={() => setHoveredSection(section.id)}
                  onMouseLeave={() => setHoveredSection(null)}
                >
                  {/* Glow effect */}
                  {(isSelected || isHovered) && (
                    <motion.div
                      className="absolute inset-0 -m-4 bg-cyan-400/20 rounded-full blur-xl"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    />
                  )}

                  {/* Nodo principal */}
                  <div className={`relative w-16 h-16 rounded-full border-2 flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                    isSelected 
                      ? `border-cyan-400 bg-gradient-to-br ${categoryConfig_.color} shadow-lg shadow-cyan-400/50` 
                      : `border-white/40 bg-gradient-to-br ${categoryConfig_.color} bg-opacity-60`
                  }`}>
                    <IconComponent className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-white/80'}`} />
                  </div>

                  {/* Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: -70, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.8 }}
                        className="absolute left-1/2 transform -translate-x-1/2 bg-black/90 border border-white/20 rounded-lg p-3 backdrop-blur-sm z-30 min-w-48"
                      >
                        <h4 className="font-semibold text-white text-sm">{section.title}</h4>
                        <p className="text-gray-300 text-xs mt-1">{section.description}</p>
                        <div className={`inline-block px-2 py-1 rounded text-xs mt-2 bg-gradient-to-r ${categoryConfig_.color} text-white`}>
                          {categoryConfig_.label}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Centro del árbol */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        <motion.div
          className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full flex items-center justify-center border-2 border-white/40 backdrop-blur-sm"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-6 h-6 bg-white rounded-full opacity-80" />
        </motion.div>
      </div>

      {/* Leyenda */}
      <div className="absolute bottom-4 left-4 bg-black/60 border border-white/20 rounded-lg p-3 backdrop-blur-sm">
        <h4 className="text-white font-semibold text-sm mb-2">Categorías</h4>
        <div className="space-y-1">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const IconComponent = config.icon;
            return (
              <div key={key} className="flex items-center gap-2 text-xs">
                <div className={`w-4 h-4 rounded bg-gradient-to-br ${config.color} flex items-center justify-center`}>
                  <IconComponent className="w-2 h-2 text-white" />
                </div>
                <span className="text-gray-300">{config.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Controles */}
      <div className="absolute top-4 right-4 bg-black/60 border border-white/20 rounded-lg p-2 backdrop-blur-sm">
        <div className="text-white text-xs text-center">
          <div className="font-semibold">Vista Blueprint</div>
          <div className="text-gray-400 mt-1">Haz clic en los nodos</div>
        </div>
      </div>
    </div>
  );
};

export default BlueprintTree;