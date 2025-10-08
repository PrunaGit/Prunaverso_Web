/**
 * 📚 WIKI DEL PRUNAVERSO - CENTRO DE CONOCIMIENTO COMPLETO
 * 
 * Sistema de navegación integral que integra toda la base de conocimiento:
 * - 31 personajes minados del repositorio fuente
 * - 33,100 conceptos identificados
 * - Relaciones y meta-información estructurada
 * - Búsqueda semántica avanzada
 * - Visualizaciones interactivas
 * - Timeline del universo Prunaversal
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrunaversoKnowledge } from '../hooks/usePrunaversoKnowledge';
import useInteractionSystem from '../hooks/useInteractionSystem';
import PrunaversoKnowledgeSearch from '../components/PrunaversoKnowledgeSearch';

const Wiki = () => {
  const knowledge = usePrunaversoKnowledge();
  const { registerInteraction } = useInteractionSystem();
  const [activeSection, setActiveSection] = useState('overview');
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // grid, list, timeline, map
  const [filters, setFilters] = useState({
    category: 'all',
    status: 'all',
    hasAvatar: false
  });

  // Cargar estadísticas del conocimiento
  const [stats, setStats] = useState(null);
  useEffect(() => {
    if (knowledge.isInitialized) {
      setStats(knowledge.knowledgeStats);
    }
  }, [knowledge.isInitialized]);

  // Secciones principales del Wiki
  const sections = [
    { id: 'overview', title: '🌌 Resumen General', icon: '📊' },
    { id: 'characters', title: '👥 Personajes', icon: '🎭' },
    { id: 'concepts', title: '💭 Conceptos', icon: '🧠' },
    { id: 'relationships', title: '🔗 Relaciones', icon: '🌐' },
    { id: 'timeline', title: '⏰ Timeline', icon: '📅' },
    { id: 'categories', title: '📂 Categorías', icon: '🗂️' },
    { id: 'search', title: '🔍 Búsqueda Avanzada', icon: '🎯' }
  ];

  // Obtener personajes organizados por categoría
  const charactersByCategory = useMemo(() => {
    if (!knowledge.isInitialized) return {};
    
    const characters = knowledge.getCharacters();
    const categorized = {};
    
    Object.entries(characters).forEach(([key, character]) => {
      const category = character.category || 'sin_categoria';
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push({ key, ...character });
    });
    
    return categorized;
  }, [knowledge.isInitialized]);

  // Filtrar personajes según criterios
  const filteredCharacters = useMemo(() => {
    if (!knowledge.isInitialized) return [];
    
    const characters = knowledge.getCharacters();
    let filtered = Object.entries(characters).map(([key, char]) => ({ key, ...char }));
    
    // Filtro por categoría
    if (filters.category !== 'all') {
      filtered = filtered.filter(char => char.category === filters.category);
    }
    
    // Filtro por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(char => 
        char.name?.toLowerCase().includes(query) ||
        char.key.toLowerCase().includes(query) ||
        char.raw_data?.alias?.some(alias => alias.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [knowledge.isInitialized, filters, searchQuery]);

  // Obtener conceptos principales
  const topConcepts = useMemo(() => {
    if (!knowledge.isInitialized) return [];
    
    const concepts = knowledge.getConcepts();
    return Object.entries(concepts)
      .slice(0, 20)
      .map(([key, concept]) => ({ key, concept }));
  }, [knowledge.isInitialized]);

  // Manejar selección de sección
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
    registerInteraction({
      type: 'click',
      target: `wiki_section_${sectionId}`,
      context: { section: sectionId, timestamp: Date.now() }
    });
  };

  // Manejar selección de personaje
  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    registerInteraction({
      type: 'click',
      target: `wiki_character_${character.key}`,
      context: { character: character.name, category: character.category }
    });
  };

  // Renderizar vista de resumen general
  const renderOverview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Personajes', value: stats?.characters || 0, icon: '👥', color: 'text-blue-400' },
          { label: 'Conceptos', value: stats?.concepts?.toLocaleString() || 0, icon: '💭', color: 'text-purple-400' },
          { label: 'Relaciones', value: stats?.relationships || 0, icon: '🔗', color: 'text-green-400' },
          { label: 'Nodos Totales', value: stats?.totalNodes?.toLocaleString() || 0, icon: '🌐', color: 'text-orange-400' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-sm text-gray-400">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Categorías de personajes */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">📂 Categorías de Personajes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(charactersByCategory).map(([category, characters]) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/30 rounded-lg p-4 border border-gray-700/30 hover:border-purple-500/50 cursor-pointer"
              onClick={() => {
                setActiveSection('characters');
                setFilters(prev => ({ ...prev, category }));
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-purple-300 capitalize">{category.replace('_', ' ')}</h4>
                <span className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-sm">
                  {characters.length}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                {characters.slice(0, 3).map(char => char.name).join(', ')}
                {characters.length > 3 && '...'}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Personajes destacados */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">⭐ Personajes Destacados</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(charactersByCategory)
            .flat()
            .filter(char => char.category === 'nucleo_central' || char.category === 'nucleo_cercano')
            .slice(0, 6)
            .map((character, index) => (
              <motion.div
                key={character.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 rounded-lg p-4 border border-gray-700/50 hover:border-blue-500/50 cursor-pointer"
                onClick={() => handleCharacterSelect(character)}
              >
                <div className="text-lg font-semibold text-white mb-2">{character.name}</div>
                <div className="text-sm text-gray-400 mb-2 capitalize">
                  {character.category?.replace('_', ' ')}
                </div>
                {character.raw_data?.alias && (
                  <div className="text-xs text-purple-300">
                    {character.raw_data.alias.slice(0, 2).join(', ')}
                  </div>
                )}
                {character.raw_data?.estado && (
                  <div className="text-xs text-green-400 mt-1">
                    Estado: {character.raw_data.estado}
                  </div>
                )}
              </motion.div>
            ))}
        </div>
      </div>
    </motion.div>
  );

  // Renderizar vista de personajes
  const renderCharacters = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Controles de filtrado */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Categoría:</label>
          <select
            value={filters.category}
            onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm"
          >
            <option value="all">Todas</option>
            {Object.keys(charactersByCategory).map(category => (
              <option key={category} value={category}>
                {category.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-400">Vista:</label>
          <div className="flex gap-1">
            {['grid', 'list'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded text-sm ${
                  viewMode === mode 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {mode === 'grid' ? '🔲' : '📋'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Buscar personajes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm"
          />
        </div>
      </div>

      {/* Lista de personajes */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
          : 'space-y-2'
        }
      `}>
        {filteredCharacters.map((character, index) => (
          <motion.div
            key={character.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: viewMode === 'grid' ? 1.03 : 1.01 }}
            className={`
              bg-gray-800/50 rounded-lg border border-gray-700/50 hover:border-purple-500/50 cursor-pointer
              ${viewMode === 'grid' ? 'p-4' : 'p-3 flex items-center gap-4'}
            `}
            onClick={() => handleCharacterSelect(character)}
          >
            {viewMode === 'grid' ? (
              <>
                <div className="text-lg font-semibold text-white mb-2">{character.name}</div>
                <div className="text-sm text-gray-400 mb-2 capitalize">
                  {character.category?.replace('_', ' ')}
                </div>
                {character.raw_data?.alias && (
                  <div className="text-xs text-purple-300 mb-2">
                    {character.raw_data.alias.slice(0, 2).join(', ')}
                  </div>
                )}
                {character.raw_data?.estado && (
                  <div className="text-xs text-green-400">
                    {character.raw_data.estado}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex-1">
                  <div className="font-semibold text-white">{character.name}</div>
                  <div className="text-sm text-gray-400 capitalize">
                    {character.category?.replace('_', ' ')}
                  </div>
                </div>
                {character.raw_data?.alias && (
                  <div className="text-xs text-purple-300">
                    {character.raw_data.alias[0]}
                  </div>
                )}
                {character.raw_data?.estado && (
                  <div className="text-xs text-green-400">
                    {character.raw_data.estado}
                  </div>
                )}
              </>
            )}
          </motion.div>
        ))}
      </div>

      {filteredCharacters.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No se encontraron personajes con los filtros aplicados.
        </div>
      )}
    </motion.div>
  );

  // Renderizar vista de conceptos
  const renderConcepts = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-bold text-white mb-4">💭 Conceptos Clave del Prunaverso</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {topConcepts.map((concept, index) => (
          <motion.div
            key={concept.key}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            className="bg-blue-900/20 rounded-lg p-3 border border-blue-500/30 hover:border-blue-400/50 cursor-pointer"
          >
            <div className="font-medium text-blue-300">{concept.key}</div>
            {typeof concept.concept === 'string' && (
              <div className="text-sm text-gray-400 mt-1 truncate">
                {concept.concept.substring(0, 100)}...
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {knowledge.isInitialized && (
        <div className="text-center mt-6">
          <div className="text-sm text-gray-400">
            Mostrando 20 de {Object.keys(knowledge.getConcepts()).length.toLocaleString()} conceptos totales
          </div>
        </div>
      )}
    </motion.div>
  );

  // Renderizar búsqueda avanzada
  const renderAdvancedSearch = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h3 className="text-xl font-bold text-white mb-4">🔍 Búsqueda Avanzada</h3>
      <div className="max-w-2xl mx-auto">
        <PrunaversoKnowledgeSearch />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-gray-800/30 rounded-lg p-4">
          <h4 className="font-semibold text-purple-300 mb-3">💡 Sugerencias de Búsqueda</h4>
          <div className="space-y-2 text-sm">
            {['Alex Pruna', 'Kael', 'Clara CCH', 'Ana Ruiz', 'Cristóbal A1073', 'Xavi Roura'].map(suggestion => (
              <button
                key={suggestion}
                onClick={() => setSearchQuery(suggestion)}
                className="block w-full text-left px-3 py-2 bg-gray-700/50 rounded hover:bg-gray-600/50 text-gray-300"
              >
                👤 {suggestion}
              </button>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-800/30 rounded-lg p-4">
          <h4 className="font-semibold text-blue-300 mb-3">🏷️ Búsqueda por Categoría</h4>
          <div className="space-y-2 text-sm">
            {Object.keys(charactersByCategory).map(category => (
              <button
                key={category}
                onClick={() => {
                  setActiveSection('characters');
                  setFilters(prev => ({ ...prev, category }));
                }}
                className="block w-full text-left px-3 py-2 bg-gray-700/50 rounded hover:bg-gray-600/50 text-gray-300 capitalize"
              >
                📂 {category.replace('_', ' ')} ({charactersByCategory[category]?.length || 0})
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Renderizar contenido según la sección activa
  const renderContent = () => {
    if (!knowledge.isInitialized) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin text-4xl mb-4">🌌</div>
            <div className="text-white">Cargando base de conocimiento del Prunaverso...</div>
            <div className="text-sm text-gray-400 mt-2">Esto puede tomar unos momentos</div>
          </div>
        </div>
      );
    }

    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'characters':
        return renderCharacters();
      case 'concepts':
        return renderConcepts();
      case 'search':
        return renderAdvancedSearch();
      case 'relationships':
        return (
          <div className="text-center py-8 text-gray-400">
            🔗 Sistema de relaciones en desarrollo...
          </div>
        );
      case 'timeline':
        return (
          <div className="text-center py-8 text-gray-400">
            ⏰ Timeline del Prunaverso en desarrollo...
          </div>
        );
      case 'categories':
        return (
          <div className="text-center py-8 text-gray-400">
            📂 Vista de categorías detallada en desarrollo...
          </div>
        );
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-blue-900/30 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            📚 Wiki del Prunaverso
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Centro de conocimiento completo con {stats?.characters || 0} personajes, 
            {' '}{stats?.concepts?.toLocaleString() || 0} conceptos y toda la sabiduría del universo Prunaversal.
          </p>
        </motion.div>

        {/* Navegación de secciones */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {sections.map((section) => (
            <motion.button
              key={section.id}
              onClick={() => handleSectionChange(section.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all duration-200
                ${activeSection === section.id
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-600/50'
                }
              `}
            >
              <span className="mr-2">{section.icon}</span>
              {section.title}
            </motion.button>
          ))}
        </motion.div>

        {/* Contenido principal */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-900/30 rounded-xl p-6 backdrop-blur-sm border border-gray-700/30"
        >
          {renderContent()}
        </motion.div>

        {/* Modal de detalle de personaje */}
        <AnimatePresence>
          {selectedCharacter && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedCharacter(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gray-900 rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-700"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-white">{selectedCharacter.name}</h3>
                  <button
                    onClick={() => setSelectedCharacter(null)}
                    className="text-gray-400 hover:text-white text-xl"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-purple-300 mb-2">📂 Información Básica</h4>
                    <div className="bg-gray-800/50 rounded p-3 text-sm">
                      <div><span className="text-gray-400">Categoría:</span> <span className="text-white capitalize">{selectedCharacter.category?.replace('_', ' ')}</span></div>
                      <div><span className="text-gray-400">Clave:</span> <span className="text-white">{selectedCharacter.key}</span></div>
                      {selectedCharacter.raw_data?.estado && (
                        <div><span className="text-gray-400">Estado:</span> <span className="text-green-400">{selectedCharacter.raw_data.estado}</span></div>
                      )}
                    </div>
                  </div>

                  {selectedCharacter.raw_data?.alias && (
                    <div>
                      <h4 className="font-semibold text-blue-300 mb-2">🏷️ Alias</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCharacter.raw_data.alias.map((alias, index) => (
                          <span key={index} className="bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-sm">
                            {alias}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCharacter.raw_data?.atributos && (
                    <div>
                      <h4 className="font-semibold text-orange-300 mb-2">⚡ Atributos</h4>
                      <div className="bg-gray-800/50 rounded p-3">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                          {Object.entries(selectedCharacter.raw_data.atributos).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-400">{key}:</span>
                              <span className="text-orange-300 font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold text-gray-300 mb-2">🔧 Datos Técnicos</h4>
                    <div className="bg-gray-800/50 rounded p-3 text-xs">
                      <div><span className="text-gray-400">Archivo fuente:</span></div>
                      <div className="text-gray-500 break-all">{selectedCharacter.source_file}</div>
                      <div className="mt-2"><span className="text-gray-400">Última actualización:</span> <span className="text-gray-300">{selectedCharacter.last_updated}</span></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Wiki;
