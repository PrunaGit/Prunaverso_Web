import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, Map } from 'lucide-react';

const GDDSearchBar = ({ 
  searchQuery, 
  onSearchChange, 
  onViewModeChange 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
      {/* Barra de búsqueda principal */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar en GDD... (ej: HUD, lentes, progresión)"
          className="block w-full pl-10 pr-4 py-3 bg-black/30 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
        />
        
        {/* Indicador de búsqueda activa */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <button
              onClick={() => onSearchChange('')}
              className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </motion.div>
        )}
      </div>

      {/* Filtros rápidos */}
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSearchChange('HUD')}
          className="px-3 py-2 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-600/30 transition-colors text-sm"
        >
          HUD
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSearchChange('lentes')}
          className="px-3 py-2 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-300 hover:bg-purple-600/30 transition-colors text-sm"
        >
          Lentes
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSearchChange('progresión')}
          className="px-3 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-600/30 transition-colors text-sm"
        >
          Progresión
        </motion.button>
      </div>
    </div>
  );
};

export default GDDSearchBar;