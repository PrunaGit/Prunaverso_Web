/**
 * 🔍 PRUNAVERSO KNOWLEDGE SEARCH
 * Buscador inteligente del conocimiento Prunaversal
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrunaversoKnowledge } from '../../hooks/usePrunaversoKnowledge';
import useInteractionSystem from '../../hooks/useInteractionSystem';

const PrunaversoKnowledgeSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const knowledge = usePrunaversoKnowledge();
  const { registerInteraction } = useInteractionSystem();
  const searchInputRef = useRef(null);

  // Cargar sugerencias iniciales
  useEffect(() => {
    if (knowledge.isInitialized) {
      const smartSuggestions = knowledge.getSmartSuggestions();
      setSuggestions(smartSuggestions);
    }
  }, [knowledge.isInitialized]);

  // Búsqueda en tiempo real
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults(null);
      return;
    }

    const searchTimer = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [query, knowledge.isInitialized]);

  const performSearch = async (searchQuery) => {
    if (!knowledge.isInitialized) return;

    setIsSearching(true);
    
    try {
      const character = knowledge.findCharacter(searchQuery);
      const concepts = knowledge.findConcepts(searchQuery);
      const contextualResponse = knowledge.getContextualResponse(searchQuery, 'search');

      setResults({
        character,
        concepts: concepts.slice(0, 5),
        contextualResponse,
        query: searchQuery
      });

      // Registrar interacción de búsqueda
      registerInteraction({
        type: 'search',
        target: 'knowledge_search',
        context: { query: searchQuery, resultsFound: !!(character || concepts.length > 0) }
      });

    } catch (error) {
      console.error('Error en búsqueda:', error);
      setResults(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name || suggestion.suggestion || suggestion.key);
    setIsOpen(true);
    searchInputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setQuery('');
      setResults(null);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Input de Búsqueda */}
      <div className="relative">
        <motion.input
          ref={searchInputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="🔍 Buscar en el Prunaverso..."
          className="w-full bg-black/40 border border-purple-500/30 rounded-lg px-4 py-2 pl-10 
                     text-white placeholder-gray-400 focus:border-purple-400 focus:outline-none
                     backdrop-blur-sm transition-all duration-200"
          whileFocus={{ scale: 1.02 }}
        />
        
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <span className="text-purple-400">🌌</span>
        </div>

        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full"
            />
          </div>
        )}
      </div>

      {/* Panel de Resultados */}
      <AnimatePresence>
        {isOpen && (query.length > 0 || suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-black/90 border border-purple-500/30 
                       rounded-lg backdrop-blur-md z-50 max-h-96 overflow-y-auto"
          >
            {/* Resultados de Búsqueda */}
            {results && (
              <div className="p-4">
                {/* Respuesta Contextual */}
                {results.contextualResponse && (
                  <div className="mb-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="text-purple-300 text-sm font-medium mb-2">🧠 Respuesta del Sistema:</div>
                    <p className="text-gray-100 text-sm">{results.contextualResponse.text}</p>
                    <div className="text-xs text-gray-400 mt-2">
                      Confianza: {Math.round(results.contextualResponse.confidence * 100)}%
                    </div>
                  </div>
                )}

                {/* Personaje Encontrado */}
                {results.character && (
                  <div className="mb-4 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-green-300 text-sm font-medium mb-2">👤 Personaje:</div>
                    <div className="text-white font-medium">{results.character.data.name}</div>
                    <div className="text-gray-300 text-sm">Categoría: {results.character.data.category}</div>
                    {results.character.data.raw_data?.alias && (
                      <div className="text-gray-400 text-xs mt-1">
                        Alias: {results.character.data.raw_data.alias.join(', ')}
                      </div>
                    )}
                  </div>
                )}

                {/* Conceptos Encontrados */}
                {results.concepts.length > 0 && (
                  <div className="mb-4">
                    <div className="text-blue-300 text-sm font-medium mb-2">💭 Conceptos:</div>
                    <div className="space-y-1">
                      {results.concepts.map((concept, index) => (
                        <div 
                          key={index}
                          className="text-gray-300 text-xs bg-blue-500/10 rounded px-2 py-1 border border-blue-500/20"
                        >
                          {concept.key}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sin Resultados */}
                {!results.character && results.concepts.length === 0 && (
                  <div className="text-gray-400 text-sm text-center py-2">
                    🔍 No se encontraron resultados específicos para "{results.query}"
                  </div>
                )}
              </div>
            )}

            {/* Sugerencias */}
            {!results && suggestions.length > 0 && (
              <div className="p-4">
                <div className="text-gray-300 text-sm font-medium mb-3">💡 Sugerencias:</div>
                <div className="space-y-2">
                  {suggestions.slice(0, 6).map((suggestion, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full text-left p-2 bg-gray-800/50 hover:bg-gray-700/50 
                                 rounded text-sm text-gray-300 hover:text-white transition-colors
                                 border border-gray-600/30 hover:border-gray-500/50"
                    >
                      <span className="text-purple-400 mr-2">
                        {suggestion.type === 'character' ? '👤' : '💭'}
                      </span>
                      {suggestion.suggestion}
                    </motion.button>
                  ))}
                </div>
              </div>
            )}

            {/* Estadísticas */}
            {knowledge.knowledgeStats && (
              <div className="border-t border-gray-600/30 p-3">
                <div className="text-xs text-gray-400 text-center">
                  📊 Base de conocimiento: {knowledge.knowledgeStats.characters} personajes, 
                  {' '}{knowledge.knowledgeStats.concepts} conceptos
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay para cerrar */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default PrunaversoKnowledgeSearch;