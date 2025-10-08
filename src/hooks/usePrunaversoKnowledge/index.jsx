/**
 * 🌌 PRUNAVERSO KNOWLEDGE SYSTEM
 * Sistema completo de conocimiento del Prunaverso integrado
 * Conecta las bases de datos minadas con el sistema interactivo
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

class PrunaversoKnowledgeEngine {
  constructor() {
    this.knowledgeBase = {
      characters: {},
      concepts: {},
      relationships: {},
      metaInfo: {},
      index: {}
    };
    this.initialized = false;
    this.loadingPromise = null;
  }

  async initialize() {
    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = this._loadKnowledgeBases();
    return this.loadingPromise;
  }

  async _loadKnowledgeBases() {
    try {
      console.log('🧠 Cargando bases de conocimiento del Prunaverso...');
      
      const responses = await Promise.all([
        fetch('/data/knowledge/characters.json'),
        fetch('/data/knowledge/concepts.json'),
        fetch('/data/knowledge/relationships.json'),
        fetch('/data/knowledge/meta_info.json'),
        fetch('/data/knowledge/knowledge_index.json')
      ]);

      const [characters, concepts, relationships, metaInfo, index] = await Promise.all(
        responses.map(r => r.json())
      );

      this.knowledgeBase = {
        characters,
        concepts,
        relationships,
        metaInfo,
        index
      };

      this.initialized = true;
      console.log('✅ Conocimiento Prunaversal cargado:', {
        characters: Object.keys(characters).length,
        concepts: Object.keys(concepts).length,
        relationships: Object.keys(relationships).length,
        metaInfo: Object.keys(metaInfo).length
      });

      return this.knowledgeBase;
    } catch (error) {
      console.error('❌ Error cargando conocimiento:', error);
      throw error;
    }
  }

  // 🔍 BÚSQUEDA INTELIGENTE DE PERSONAJES
  findCharacter(query) {
    if (!this.initialized) return null;

    const normalizedQuery = query.toLowerCase().trim();
    const characters = this.knowledgeBase.characters;
    
    // Búsqueda exacta por clave
    let found = characters[normalizedQuery];
    if (found) return { key: normalizedQuery, data: found };

    // Búsqueda por nombre
    for (const [key, char] of Object.entries(characters)) {
      if (char.name?.toLowerCase().includes(normalizedQuery)) {
        return { key, data: char };
      }
    }

    // Búsqueda por alias
    for (const [key, char] of Object.entries(characters)) {
      if (char.raw_data?.alias?.some(alias => 
        alias.toLowerCase().includes(normalizedQuery)
      )) {
        return { key, data: char };
      }
    }

    return null;
  }

  // 🧠 ANÁLISIS CONTEXTUAL DE CONCEPTOS
  findConcepts(query) {
    if (!this.initialized) return [];

    const normalizedQuery = query.toLowerCase();
    const concepts = this.knowledgeBase.concepts;
    const matches = [];

    for (const [key, concept] of Object.entries(concepts)) {
      if (key.toLowerCase().includes(normalizedQuery) || 
          concept.toLowerCase().includes(normalizedQuery)) {
        matches.push({ key, concept });
      }
    }

    return matches.slice(0, 10); // Limitar resultados
  }

  // 🔗 MAPEO DE RELACIONES
  getCharacterRelationships(characterKey) {
    if (!this.initialized) return [];

    const character = this.knowledgeBase.characters[characterKey];
    if (!character) return [];

    return character.relationships || [];
  }

  // 🌟 GENERACIÓN DE RESPUESTAS CONTEXTUALES
  generateContextualResponse(query, interactionType = 'general') {
    if (!this.initialized) {
      return {
        text: "🌌 Inicializando conexión con el conocimiento Prunaversal...",
        confidence: 0.1,
        sources: []
      };
    }

    const character = this.findCharacter(query);
    const concepts = this.findConcepts(query);
    
    if (character) {
      return this._generateCharacterResponse(character, interactionType);
    }

    if (concepts.length > 0) {
      return this._generateConceptResponse(concepts, interactionType);
    }

    return this._generateFallbackResponse(query, interactionType);
  }

  _generateCharacterResponse(character, interactionType) {
    const { data } = character;
    const name = data.name || 'Entidad Desconocida';
    const category = data.category || 'sin_categoria';
    const aliases = data.raw_data?.alias || [];

    let responseText = "";
    let confidence = 0.9;

    switch (interactionType) {
      case 'click':
        responseText = `🎯 Has activado la resonancia con ${name}`;
        if (aliases.length > 0) {
          responseText += ` (${aliases[0]})`;
        }
        responseText += `. Pertenece al ${category} del Prunaverso.`;
        break;
        
      case 'hover':
        responseText = `✨ Detectando presencia de ${name}...`;
        if (data.raw_data?.atributos) {
          const attrs = Object.keys(data.raw_data.atributos);
          responseText += ` Atributos activos: ${attrs.slice(0, 3).join(', ')}.`;
        }
        break;
        
      case 'gamepad':
        responseText = `🎮 Conexión gaming establecida con ${name}`;
        if (data.raw_data?.estado) {
          responseText += ` [Estado: ${data.raw_data.estado}]`;
        }
        break;
        
      default:
        responseText = `🌌 ${name} forma parte del núcleo ${category} del Prunaverso.`;
        if (aliases.length > 0) {
          responseText += ` También conocido como: ${aliases.join(', ')}.`;
        }
    }

    return {
      text: responseText,
      confidence,
      sources: [character.key],
      characterData: data
    };
  }

  _generateConceptResponse(concepts, interactionType) {
    const primaryConcept = concepts[0];
    let responseText = "";
    let confidence = 0.7;

    switch (interactionType) {
      case 'click':
        responseText = `🧠 Concepto "${primaryConcept.key}" activado en el sistema cognitivo.`;
        break;
        
      case 'hover':
        responseText = `💭 Explorando concepto: ${primaryConcept.key}`;
        break;
        
      default:
        responseText = `🔍 Encontré ${concepts.length} referencias a "${primaryConcept.key}" en el Prunaverso.`;
    }

    if (concepts.length > 1) {
      responseText += ` Conceptos relacionados: ${concepts.slice(1, 3).map(c => c.key).join(', ')}.`;
    }

    return {
      text: responseText,
      confidence,
      sources: concepts.map(c => c.key),
      conceptData: concepts
    };
  }

  _generateFallbackResponse(query, interactionType) {
    const responses = {
      click: [
        `🎯 Acción registrada: "${query}". Analizando resonancia Prunaversal...`,
        `⚡ Click detectado. Buscando conexiones con "${query}" en el multiverso...`,
        `🌟 Interacción capturada. El Prunaverso responde a "${query}"...`
      ],
      hover: [
        `✨ Presencia detectada cerca de "${query}". Calibrando sensores...`,
        `🔮 Energía sutil percibida en "${query}". Estableciendo resonancia...`,
        `💫 Movimiento registrado sobre "${query}". Sistema reactivo activado...`
      ],
      gamepad: [
        `🎮 Control gaming activado para "${query}". Configurando respuesta táctil...`,
        `🕹️ Input de gamepad recibido en "${query}". Sincronizando feedback...`,
        `🎯 Comando gaming procesado: "${query}". Sistema respondiendo...`
      ],
      default: [
        `🌌 "${query}" resuena en las frecuencias del Prunaverso...`,
        `🧠 Procesando "${query}" a través de la matriz cognitiva...`,
        `⚡ El sistema detecta patrones relacionados con "${query}"...`
      ]
    };

    const options = responses[interactionType] || responses.default;
    const randomResponse = options[Math.floor(Math.random() * options.length)];

    return {
      text: randomResponse,
      confidence: 0.5,
      sources: [],
      isSpeculative: true
    };
  }

  // 📊 ESTADÍSTICAS DEL CONOCIMIENTO
  getKnowledgeStats() {
    if (!this.initialized) return null;

    return {
      characters: Object.keys(this.knowledgeBase.characters).length,
      concepts: Object.keys(this.knowledgeBase.concepts).length,
      relationships: Object.keys(this.knowledgeBase.relationships).length,
      metaInfo: Object.keys(this.knowledgeBase.metaInfo).length,
      totalNodes: Object.keys(this.knowledgeBase.characters).length + 
                  Object.keys(this.knowledgeBase.concepts).length
    };
  }

  // 🎯 RECOMENDACIONES INTELIGENTES
  getSmartSuggestions(currentContext = '') {
    if (!this.initialized) return [];

    const characters = Object.keys(this.knowledgeBase.characters);
    const suggestions = [];

    // Personajes principales del núcleo central
    const coreCharacters = characters.filter(key => {
      const char = this.knowledgeBase.characters[key];
      return char.category === 'nucleo_central' || char.category === 'nucleo_cercano';
    });

    suggestions.push(...coreCharacters.slice(0, 3).map(key => ({
      type: 'character',
      key,
      name: this.knowledgeBase.characters[key].name,
      suggestion: `Explorar ${this.knowledgeBase.characters[key].name}`
    })));

    // Conceptos relevantes
    const conceptKeys = Object.keys(this.knowledgeBase.concepts);
    suggestions.push(...conceptKeys.slice(0, 2).map(key => ({
      type: 'concept',
      key,
      suggestion: `Investigar concepto: ${key}`
    })));

    return suggestions;
  }
}

// Instancia singleton del motor de conocimiento
const knowledgeEngine = new PrunaversoKnowledgeEngine();

export const usePrunaversoKnowledge = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [knowledgeStats, setKnowledgeStats] = useState(null);

  // Inicialización automática
  useEffect(() => {
    const initializeKnowledge = async () => {
      if (knowledgeEngine.initialized) {
        setIsInitialized(true);
        setKnowledgeStats(knowledgeEngine.getKnowledgeStats());
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        await knowledgeEngine.initialize();
        setIsInitialized(true);
        setKnowledgeStats(knowledgeEngine.getKnowledgeStats());
      } catch (err) {
        setError(err.message);
        console.error('❌ Error inicializando conocimiento Prunaversal:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeKnowledge();
  }, []);

  // 🔍 BÚSQUEDA DE PERSONAJES
  const findCharacter = useCallback((query) => {
    return knowledgeEngine.findCharacter(query);
  }, [isInitialized]);

  // 🧠 BÚSQUEDA DE CONCEPTOS
  const findConcepts = useCallback((query) => {
    return knowledgeEngine.findConcepts(query);
  }, [isInitialized]);

  // 🌟 RESPUESTA CONTEXTUAL INTELIGENTE
  const getContextualResponse = useCallback((query, interactionType = 'general') => {
    return knowledgeEngine.generateContextualResponse(query, interactionType);
  }, [isInitialized]);

  // 🔗 RELACIONES DE PERSONAJE
  const getCharacterRelationships = useCallback((characterKey) => {
    return knowledgeEngine.getCharacterRelationships(characterKey);
  }, [isInitialized]);

  // 🎯 SUGERENCIAS INTELIGENTES
  const getSmartSuggestions = useCallback((context) => {
    return knowledgeEngine.getSmartSuggestions(context);
  }, [isInitialized]);

  // 📋 API COMPLETA
  const api = useMemo(() => ({
    // Estado
    isInitialized,
    isLoading,
    error,
    knowledgeStats,
    
    // Métodos de búsqueda
    findCharacter,
    findConcepts,
    getCharacterRelationships,
    
    // Respuestas inteligentes
    getContextualResponse,
    getSmartSuggestions,
    
    // Acceso directo a bases de datos
    getCharacters: () => knowledgeEngine.knowledgeBase.characters,
    getConcepts: () => knowledgeEngine.knowledgeBase.concepts,
    getRelationships: () => knowledgeEngine.knowledgeBase.relationships,
    getMetaInfo: () => knowledgeEngine.knowledgeBase.metaInfo,
    getIndex: () => knowledgeEngine.knowledgeBase.index
  }), [
    isInitialized,
    isLoading,
    error,
    knowledgeStats,
    findCharacter,
    findConcepts,
    getCharacterRelationships,
    getContextualResponse,
    getSmartSuggestions
  ]);

  return api;
};

export default usePrunaversoKnowledge;