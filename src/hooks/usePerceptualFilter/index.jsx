/**
 * 🌌 SISTEMA DE PERCEPCIÓN FILTRADA PRUNAVERSAL
 * 
 * Este hook traduce automáticamente TODA la información del Prunaverso 
 * al prisma cognitivo elegido por el usuario. El usuario nunca ve
 * el contenido "crudo" - siempre lo percibe filtrado.
 * 
 * SECUENCIA DE PERCEPCIÓN:
 * 1. Usuario entra → Elige "nuevo" o "conocido"
 * 2. Sistema detecta/aplica lente cognitiva
 * 3. TODO el contenido se traduce automáticamente
 * 4. Usuario solo percibe SU versión de la realidad
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { usePrunaversoKnowledge } from '../usePrunaversoKnowledge';
import { useCognitiveLens } from '../useCognitiveLens';

// 🧠 MAPAS DE TRADUCCIÓN COGNITIVA
const COGNITIVE_TRANSLATION_MAPS = {
  // LENTES TÉCNICAS
  'ai': {
    narrativeStyle: 'technical_precision',
    terminology: 'machine_learning',
    complexity: 'algorithmic',
    metaphors: 'computational',
    examples: 'code_based',
    tone: 'analytical'
  },
  'data_science': {
    narrativeStyle: 'statistical_analysis',
    terminology: 'data_driven',
    complexity: 'mathematical',
    metaphors: 'statistical',
    examples: 'dataset_based',
    tone: 'empirical'
  },
  'cybersecurity': {
    narrativeStyle: 'threat_modeling',
    terminology: 'security_focused',
    complexity: 'systematic',
    metaphors: 'defensive',
    examples: 'attack_scenarios',
    tone: 'paranoid_protective'
  },

  // LENTES HUMANÍSTICAS
  'philosophy': {
    narrativeStyle: 'dialectical',
    terminology: 'conceptual',
    complexity: 'ontological',
    metaphors: 'existential',
    examples: 'thought_experiments',
    tone: 'contemplative'
  },
  'psychology': {
    narrativeStyle: 'behavioral_analysis',
    terminology: 'psychological',
    complexity: 'cognitive_emotional',
    metaphors: 'mental_processes',
    examples: 'case_studies',
    tone: 'empathetic_analytical'
  },
  'linguistics': {
    narrativeStyle: 'semantic_analysis',
    terminology: 'linguistic',
    complexity: 'grammatical',
    metaphors: 'language_structures',
    examples: 'usage_patterns',
    tone: 'descriptive'
  },

  // LENTES CREATIVAS
  'art': {
    narrativeStyle: 'aesthetic_exploration',
    terminology: 'artistic',
    complexity: 'symbolic',
    metaphors: 'visual_sensory',
    examples: 'artistic_works',
    tone: 'expressive'
  },
  'music': {
    narrativeStyle: 'harmonic_flow',
    terminology: 'musical',
    complexity: 'rhythmic',
    metaphors: 'auditory',
    examples: 'compositions',
    tone: 'melodic'
  },
  'literature': {
    narrativeStyle: 'narrative_literary',
    terminology: 'literary',
    complexity: 'poetic',
    metaphors: 'storytelling',
    examples: 'literary_works',
    tone: 'lyrical'
  },

  // LENTES CIENTÍFICAS
  'physics': {
    narrativeStyle: 'physical_laws',
    terminology: 'scientific',
    complexity: 'mathematical_physics',
    metaphors: 'forces_energy',
    examples: 'experiments',
    tone: 'precise_theoretical'
  },
  'biology': {
    narrativeStyle: 'evolutionary',
    terminology: 'biological',
    complexity: 'systems_thinking',
    metaphors: 'organic_living',
    examples: 'natural_phenomena',
    tone: 'observational'
  },
  'chemistry': {
    narrativeStyle: 'molecular_interactions',
    terminology: 'chemical',
    complexity: 'molecular',
    metaphors: 'reactions_bonds',
    examples: 'chemical_processes',
    tone: 'experimental'
  },

  // LENTES SOCIALES
  'sociology': {
    narrativeStyle: 'social_dynamics',
    terminology: 'sociological',
    complexity: 'systemic_social',
    metaphors: 'group_dynamics',
    examples: 'social_phenomena',
    tone: 'observational_critical'
  },
  'anthropology': {
    narrativeStyle: 'cultural_analysis',
    terminology: 'anthropological',
    complexity: 'cultural',
    metaphors: 'tribal_cultural',
    examples: 'cultural_practices',
    tone: 'ethnographic'
  },
  'economics': {
    narrativeStyle: 'market_analysis',
    terminology: 'economic',
    complexity: 'systemic_financial',
    metaphors: 'market_forces',
    examples: 'economic_models',
    tone: 'analytical_pragmatic'
  },

  // LENTES UNDERGROUND/ALTERNATIVAS
  'hacker': {
    narrativeStyle: 'exploit_discovery',
    terminology: 'underground_tech',
    complexity: 'system_penetration',
    metaphors: 'digital_rebellion',
    examples: 'hack_scenarios',
    tone: 'rebellious_clever'
  },
  'punk': {
    narrativeStyle: 'anti_establishment',
    terminology: 'counter_culture',
    complexity: 'raw_authentic',
    metaphors: 'resistance',
    examples: 'rebellion_stories',
    tone: 'aggressive_authentic'
  },
  'mystic': {
    narrativeStyle: 'spiritual_journey',
    terminology: 'esoteric',
    complexity: 'mystical',
    metaphors: 'transcendent',
    examples: 'spiritual_practices',
    tone: 'mystical_profound'
  }
};

// 🎓 ADAPTACIONES POR GRADO ACADÉMICO
const ACADEMIC_ADAPTATIONS = {
  'phd': {
    complexity_multiplier: 1.5,
    detail_level: 'exhaustive',
    reference_style: 'academic_citations',
    explanation_depth: 'theoretical_foundations'
  },
  'master': {
    complexity_multiplier: 1.2,
    detail_level: 'comprehensive',
    reference_style: 'professional_sources',
    explanation_depth: 'practical_applications'
  },
  'bachelor': {
    complexity_multiplier: 1.0,
    detail_level: 'standard',
    reference_style: 'accessible_sources',
    explanation_depth: 'conceptual_understanding'
  },
  'general': {
    complexity_multiplier: 0.7,
    detail_level: 'simplified',
    reference_style: 'popular_culture',
    explanation_depth: 'practical_examples'
  },
  'beginner': {
    complexity_multiplier: 0.5,
    detail_level: 'basic',
    reference_style: 'everyday_analogies',
    explanation_depth: 'step_by_step'
  }
};

class PerceptualFilter {
  constructor() {
    this.translationCache = new Map();
    this.activeFilters = [];
    this.contextMemory = [];
  }

  // 🔄 TRADUCCIÓN PRINCIPAL DE CONTENIDO
  translateContent(rawContent, targetLenses, academicLevel, contextualHints = {}) {
    const cacheKey = this._generateCacheKey(rawContent, targetLenses, academicLevel);
    
    if (this.translationCache.has(cacheKey)) {
      return this.translationCache.get(cacheKey);
    }

    const primaryLens = targetLenses[0] || 'philosophy';
    const secondaryLenses = targetLenses.slice(1);
    
    const translation = this._performTranslation(
      rawContent, 
      primaryLens, 
      secondaryLenses, 
      academicLevel,
      contextualHints
    );

    this.translationCache.set(cacheKey, translation);
    return translation;
  }

  _performTranslation(content, primaryLens, secondaryLenses, academicLevel, context) {
    const lensConfig = COGNITIVE_TRANSLATION_MAPS[primaryLens] || COGNITIVE_TRANSLATION_MAPS['philosophy'];
    const academicConfig = ACADEMIC_ADAPTATIONS[academicLevel] || ACADEMIC_ADAPTATIONS['general'];
    
    // 1. ANÁLISIS DE CONTENIDO CRUDO
    const contentAnalysis = this._analyzeContent(content);
    
    // 2. APLICAR LENTE PRIMARIA
    let translatedContent = this._applyPrimaryLens(contentAnalysis, lensConfig);
    
    // 3. APLICAR LENTES SECUNDARIAS
    if (secondaryLenses.length > 0) {
      translatedContent = this._applySecondaryLenses(translatedContent, secondaryLenses);
    }
    
    // 4. AJUSTAR COMPLEJIDAD ACADÉMICA
    translatedContent = this._adjustAcademicComplexity(translatedContent, academicConfig);
    
    // 5. CONTEXTO SITUACIONAL
    translatedContent = this._applyContextualAdaptations(translatedContent, context);
    
    return {
      translated: translatedContent,
      metadata: {
        primaryLens,
        secondaryLenses,
        academicLevel,
        complexity: academicConfig.complexity_multiplier,
        translationConfidence: this._calculateConfidence(content, translatedContent),
        adaptationMarkers: this._getAdaptationMarkers(lensConfig, academicConfig)
      }
    };
  }

  _analyzeContent(content) {
    // Análisis semántico del contenido crudo
    const analysis = {
      type: this._detectContentType(content),
      concepts: this._extractConcepts(content),
      entities: this._extractEntities(content),
      relationships: this._extractRelationships(content),
      emotional_tone: this._detectEmotionalTone(content),
      complexity_level: this._assessComplexity(content)
    };
    
    return analysis;
  }

  _applyPrimaryLens(analysis, lensConfig) {
    const { narrativeStyle, terminology, complexity, metaphors, examples, tone } = lensConfig;
    
    let adapted = analysis;
    
    // Adaptar narrativa según la lente
    switch(narrativeStyle) {
      case 'technical_precision':
        adapted.presentation = this._technicalPresentation(analysis);
        break;
      case 'dialectical':
        adapted.presentation = this._philosophicalPresentation(analysis);
        break;
      case 'aesthetic_exploration':
        adapted.presentation = this._artisticPresentation(analysis);
        break;
      case 'social_dynamics':
        adapted.presentation = this._sociologicalPresentation(analysis);
        break;
      default:
        adapted.presentation = this._defaultPresentation(analysis);
    }
    
    // Traducir terminología
    adapted.vocabulary = this._translateTerminology(analysis.concepts, terminology);
    
    // Adaptar metáforas
    adapted.metaphors = this._adaptMetaphors(analysis.relationships, metaphors);
    
    // Ajustar tono
    adapted.tone = tone;
    
    return adapted;
  }

  _technicalPresentation(analysis) {
    return {
      format: 'structured_documentation',
      sections: ['overview', 'implementation', 'parameters', 'examples', 'references'],
      style: 'code_documentation',
      visual_aids: ['diagrams', 'flowcharts', 'code_snippets']
    };
  }

  _philosophicalPresentation(analysis) {
    return {
      format: 'dialectical_exploration',
      sections: ['thesis', 'antithesis', 'synthesis', 'implications'],
      style: 'socratic_dialogue',
      visual_aids: ['concept_maps', 'thought_experiments']
    };
  }

  _artisticPresentation(analysis) {
    return {
      format: 'aesthetic_journey',
      sections: ['inspiration', 'creation', 'interpretation', 'resonance'],
      style: 'expressive_narrative',
      visual_aids: ['mood_boards', 'color_palettes', 'artistic_examples']
    };
  }

  _sociologicalPresentation(analysis) {
    return {
      format: 'social_analysis',
      sections: ['context', 'dynamics', 'patterns', 'implications'],
      style: 'ethnographic_observation',
      visual_aids: ['social_graphs', 'interaction_patterns', 'cultural_maps']
    };
  }

  _defaultPresentation(analysis) {
    return {
      format: 'balanced_exploration',
      sections: ['introduction', 'development', 'examples', 'conclusion'],
      style: 'accessible_narrative',
      visual_aids: ['illustrations', 'examples', 'summaries']
    };
  }

  _translateTerminology(concepts, targetTerminology) {
    // Traducir conceptos del Prunaverso a terminología específica de la lente
    const translations = new Map();
    
    concepts.forEach(concept => {
      switch(targetTerminology) {
        case 'machine_learning':
          translations.set(concept, this._mlTerminology(concept));
          break;
        case 'psychological':
          translations.set(concept, this._psychologyTerminology(concept));
          break;
        case 'artistic':
          translations.set(concept, this._artisticTerminology(concept));
          break;
        default:
          translations.set(concept, concept);
      }
    });
    
    return translations;
  }

  _mlTerminology(concept) {
    const mlTranslations = {
      'conciencia': 'neural_network_consciousness',
      'personalidad': 'behavioral_model',
      'relaciones': 'graph_neural_networks',
      'evolución': 'adaptive_learning',
      'creatividad': 'generative_algorithms',
      'identidad': 'unique_feature_vector',
      'memoria': 'persistent_state',
      'aprendizaje': 'training_optimization'
    };
    
    return mlTranslations[concept] || `ml_${concept}`;
  }

  _psychologyTerminology(concept) {
    const psychTranslations = {
      'conciencia': 'self_awareness',
      'personalidad': 'personality_traits',
      'relaciones': 'interpersonal_dynamics',
      'evolución': 'psychological_development',
      'creatividad': 'creative_cognition',
      'identidad': 'self_concept',
      'memoria': 'episodic_memory',
      'aprendizaje': 'cognitive_adaptation'
    };
    
    return psychTranslations[concept] || `psych_${concept}`;
  }

  _artisticTerminology(concept) {
    const artTranslations = {
      'conciencia': 'aesthetic_awareness',
      'personalidad': 'artistic_style',
      'relaciones': 'compositional_harmony',
      'evolución': 'creative_evolution',
      'creatividad': 'artistic_expression',
      'identidad': 'visual_identity',
      'memoria': 'cultural_memory',
      'aprendizaje': 'artistic_growth'
    };
    
    return artTranslations[concept] || `art_${concept}`;
  }

  _generateCacheKey(content, lenses, academic) {
    const contentHash = this._simpleHash(content);
    const lensKey = lenses.join('_');
    return `${contentHash}_${lensKey}_${academic}`;
  }

  _simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  _detectContentType(content) {
    if (typeof content === 'object') {
      if (content.name && content.category) return 'character';
      if (content.description && content.type) return 'concept';
      return 'structured_data';
    }
    return 'text';
  }

  _extractConcepts(content) {
    // Extracción básica de conceptos clave
    const concepts = [];
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    
    // Conceptos básicos del Prunaverso
    const prunaversoConcepts = [
      'conciencia', 'personalidad', 'relaciones', 'evolución', 
      'creatividad', 'identidad', 'memoria', 'aprendizaje'
    ];
    
    prunaversoConcepts.forEach(concept => {
      if (text.toLowerCase().includes(concept)) {
        concepts.push(concept);
      }
    });
    
    return concepts;
  }

  _extractEntities(content) {
    // Extracción de entidades (personajes, lugares, etc.)
    return [];
  }

  _extractRelationships(content) {
    // Extracción de relaciones entre conceptos
    return [];
  }

  _detectEmotionalTone(content) {
    // Detección básica de tono emocional
    return 'neutral';
  }

  _assessComplexity(content) {
    // Evaluación de complejidad del contenido
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    if (text.length < 100) return 'simple';
    if (text.length < 500) return 'moderate';
    return 'complex';
  }

  _calculateConfidence(original, translated) {
    // Cálculo de confianza en la traducción
    return 0.85; // Placeholder
  }

  _getAdaptationMarkers(lensConfig, academicConfig) {
    return {
      lens_applied: lensConfig.terminology,
      academic_level: academicConfig.detail_level,
      complexity_adjusted: academicConfig.complexity_multiplier
    };
  }
}

// Instancia singleton del filtro perceptual
const perceptualFilter = new PerceptualFilter();

export const usePerceptualFilter = () => {
  const knowledge = usePrunaversoKnowledge();
  const { cognitiveLenses, academicDegree, userProfile } = useCognitiveLens();
  
  const [filterState, setFilterState] = useState({
    isActive: false,
    currentTranslation: null,
    translationStats: {
      totalTranslations: 0,
      cacheHits: 0,
      avgConfidence: 0
    }
  });

  // 🌟 MÉTODO PRINCIPAL: PERCIBIR CONTENIDO
  const perceiveContent = useCallback((rawContent, contextualHints = {}) => {
    if (!knowledge.isInitialized || !cognitiveLenses.length) {
      return {
        content: rawContent,
        isFiltered: false,
        message: "🔄 Calibrando percepción..."
      };
    }

    const translation = perceptualFilter.translateContent(
      rawContent,
      cognitiveLenses,
      academicDegree,
      contextualHints
    );

    setFilterState(prev => ({
      ...prev,
      isActive: true,
      currentTranslation: translation,
      translationStats: {
        totalTranslations: prev.translationStats.totalTranslations + 1,
        cacheHits: prev.translationStats.cacheHits + (translation.fromCache ? 1 : 0),
        avgConfidence: (prev.translationStats.avgConfidence + translation.metadata.translationConfidence) / 2
      }
    }));

    return {
      content: translation.translated,
      isFiltered: true,
      metadata: translation.metadata,
      originalContent: rawContent,
      filterSignature: `${cognitiveLenses.join('+')}@${academicDegree}`
    };
  }, [knowledge.isInitialized, cognitiveLenses, academicDegree]);

  // 🔍 PERCIBIR PERSONAJE DEL PRUNAVERSO
  const perceiveCharacter = useCallback((characterKey) => {
    if (!knowledge.isInitialized) return null;
    
    const character = knowledge.findCharacter(characterKey);
    if (!character) return null;

    return perceiveContent(character.data, { type: 'character', key: characterKey });
  }, [knowledge, perceiveContent]);

  // 💭 PERCIBIR CONCEPTO DEL PRUNAVERSO
  const perceiveConcept = useCallback((conceptKey) => {
    if (!knowledge.isInitialized) return null;
    
    const concepts = knowledge.findConcepts(conceptKey);
    if (!concepts.length) return null;

    return perceiveContent(concepts[0], { type: 'concept', key: conceptKey });
  }, [knowledge, perceiveContent]);

  // 🎯 GENERAR RESPUESTA CONTEXTUAL FILTRADA
  const generateFilteredResponse = useCallback((query, interactionType = 'general') => {
    if (!knowledge.isInitialized) {
      return "🌌 Sincronizando con la matriz perceptual...";
    }

    const rawResponse = knowledge.getContextualResponse(query, interactionType);
    const filteredResponse = perceiveContent(rawResponse.text, {
      type: 'response',
      interaction: interactionType,
      confidence: rawResponse.confidence
    });

    return filteredResponse.content;
  }, [knowledge, perceiveContent]);

  // 📊 ESTADÍSTICAS DEL FILTRO
  const getFilterStats = useCallback(() => {
    return {
      ...filterState.translationStats,
      activeFilters: cognitiveLenses,
      academicLevel: academicDegree,
      isCalibrated: knowledge.isInitialized && cognitiveLenses.length > 0
    };
  }, [filterState, cognitiveLenses, academicDegree, knowledge.isInitialized]);

  return {
    // Estado del filtro
    isActive: filterState.isActive,
    isCalibrated: knowledge.isInitialized && cognitiveLenses.length > 0,
    
    // Métodos de percepción
    perceiveContent,
    perceiveCharacter,
    perceiveConcept,
    generateFilteredResponse,
    
    // Información del filtro
    getFilterStats,
    currentLenses: cognitiveLenses,
    academicLevel: academicDegree,
    
    // Metadatos de la última traducción
    lastTranslation: filterState.currentTranslation
  };
};

export default usePerceptualFilter;