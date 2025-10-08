import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, ExternalLink, Zap } from 'lucide-react';

const GDDSectionCard = ({ 
  section, 
  categoryConfig, 
  onSelect, 
  activeConnections = [], 
  delay = 0 
}) => {
  const category = categoryConfig[section.category] || categoryConfig.system;
  const IconComponent = category.icon;
  const isConnected = activeConnections.includes(section.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02, y: -5 }}
      className={`relative group cursor-pointer ${
        isConnected ? 'ring-2 ring-cyan-400 ring-opacity-50' : ''
      }`}
      onClick={() => onSelect(section)}
    >
      {/* Indicador de conexión */}
      {isConnected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 z-10"
        >
          <div className="w-4 h-4 bg-cyan-400 rounded-full flex items-center justify-center">
            <Zap className="w-2 h-2 text-gray-900" />
          </div>
        </motion.div>
      )}

      <div className="relative h-full bg-black/40 border border-white/20 rounded-lg p-6 backdrop-blur-sm overflow-hidden group-hover:border-white/40 transition-all duration-300">
        {/* Fondo gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
        
        {/* Header */}
        <div className="relative z-10 flex items-start justify-between mb-4">
          <div className={`p-3 bg-gradient-to-br ${category.color} rounded-lg shadow-lg`}>
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${category.color} text-white`}>
              {category.label}
            </span>
            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* Contenido */}
        <div className="relative z-10">
          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
            {section.title}
          </h3>
          
          <p className="text-gray-300 text-sm mb-4 line-clamp-3">
            {section.description}
          </p>

          {/* Keywords */}
          {section.keywords && section.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {section.keywords.slice(0, 3).map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-white/10 text-gray-300 rounded border border-white/20"
                >
                  {keyword}
                </span>
              ))}
              {section.keywords.length > 3 && (
                <span className="px-2 py-1 text-xs text-gray-400">
                  +{section.keywords.length - 3} más
                </span>
              )}
            </div>
          )}

          {/* Conexiones */}
          {section.connections && section.connections.length > 0 && (
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ExternalLink className="w-3 h-3" />
              <span>{section.connections.length} conexiones</span>
            </div>
          )}
        </div>

        {/* Efecto hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/0 to-cyan-500/0 group-hover:from-cyan-500/5 group-hover:to-transparent transition-all duration-300" />
      </div>
    </motion.div>
  );
};

export default GDDSectionCard;