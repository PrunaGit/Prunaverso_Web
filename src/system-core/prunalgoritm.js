/**
 * PRUNALGORITM - NÚCLEO DEL SISTEMA OPERATIVO COGNITIVO
 * 
 * Este módulo contiene la lógica fundamental del Prunaverso:
 * - Cálculo de estados cognitivos
 * - Transiciones entre niveles de consciencia
 * - Algoritmos de vitalidad y eutimia
 * - Mecánicas de evolución del perfil
 * - Orquestación de sistemas core
 * 
 * @version 2.0.0 - Evolution Build
 * @author Alex Pruna
 */

import profileManager from './profileManager.js';

// 🧠 CONSTANTES DEL SISTEMA COGNITIVO
export const COGNITIVE_CONSTANTS = {
  MAX_VITALIDAD: 100,
  MAX_EUTIMIA: 100,
  MAX_CARGA: 100,
  
  // Umbrales de transición
  AWAKENING_THRESHOLD: 5,
  EVOLUTION_THRESHOLD: 25,
  TRANSCENDENCE_THRESHOLD: 85,
  
  // Factores de decaimiento
  VITALIDAD_DECAY: 0.1,
  EUTIMIA_RECOVERY: 0.3,
  CARGA_ACCUMULATION: 0.15
};

// 🌐 INTEGRACIÓN DE SISTEMAS CORE
export const CORE_SYSTEMS = {
  profileManager,
  // lensManager se agregará en el siguiente paso
  // achievementSystem ya existe
};

// 🔄 FUNCIÓN PRINCIPAL DEL PRUNALGORITM
export const calculateCognitiveState = (currentState, interactions, timeElapsed) => {
  const {
    vitalidad = 50,
    eutimia = 50,
    carga = 0,
    maturity = 0,
    level = 0
  } = currentState;

  // Calcular nuevos valores basados en interacciones
  const newVitalidad = calculateVitalidad(vitalidad, interactions, timeElapsed);
  const newEutimia = calculateEutimia(eutimia, interactions, timeElapsed);
  const newCarga = calculateCarga(carga, interactions, timeElapsed);
  
  // Determinar evolución de madurez
  const newMaturity = calculateMaturity(maturity, interactions, level);
  const newLevel = determineLevel(newMaturity, level);

  return {
    vitalidad: Math.max(0, Math.min(100, newVitalidad)),
    eutimia: Math.max(0, Math.min(100, newEutimia)),
    carga: Math.max(0, Math.min(100, newCarga)),
    maturity: Math.max(0, Math.min(100, newMaturity)),
    level: newLevel,
    
    // Estado derivado
    cognitiveCoherence: calculateCoherence(newVitalidad, newEutimia, newCarga),
    evolutionReadiness: calculateEvolutionReadiness(newMaturity, newLevel),
    systemStability: calculateSystemStability(newVitalidad, newEutimia, newCarga)
  };
};

// 🌱 CÁLCULO DE VITALIDAD
const calculateVitalidad = (current, interactions, timeElapsed) => {
  let vitalidad = current;
  
  // Decaimiento temporal natural
  vitalidad -= (timeElapsed / 1000) * COGNITIVE_CONSTANTS.VITALIDAD_DECAY;
  
  // Incrementos por interacciones
  interactions.forEach(interaction => {
    switch (interaction.type) {
      case 'character_interaction':
        vitalidad += 2;
        break;
      case 'lens_change':
        vitalidad += 1.5;
        break;
      case 'knowledge_discovery':
        vitalidad += 3;
        break;
      case 'system_exploration':
        vitalidad += 1;
        break;
      default:
        vitalidad += 0.5;
    }
  });
  
  return vitalidad;
};

// 😊 CÁLCULO DE EUTIMIA
const calculateEutimia = (current, interactions, timeElapsed) => {
  let eutimia = current;
  
  // Recuperación natural gradual
  eutimia += (timeElapsed / 1000) * COGNITIVE_CONSTANTS.EUTIMIA_RECOVERY;
  
  // Modulación por tipo de interacción
  interactions.forEach(interaction => {
    switch (interaction.type) {
      case 'positive_feedback':
        eutimia += 5;
        break;
      case 'achievement_unlock':
        eutimia += 8;
        break;
      case 'social_connection':
        eutimia += 3;
        break;
      case 'cognitive_breakthrough':
        eutimia += 10;
        break;
      case 'frustration_event':
        eutimia -= 2;
        break;
    }
  });
  
  return eutimia;
};

// ⚡ CÁLCULO DE CARGA COGNITIVA
const calculateCarga = (current, interactions, timeElapsed) => {
  let carga = current;
  
  // Acumulación por actividad intensa
  const intensityFactor = interactions.length * COGNITIVE_CONSTANTS.CARGA_ACCUMULATION;
  carga += intensityFactor;
  
  // Reducción gradual en reposo
  if (interactions.length === 0) {
    carga -= (timeElapsed / 1000) * 0.2;
  }
  
  return carga;
};

// 🎓 CÁLCULO DE MADUREZ COGNITIVA
const calculateMaturity = (current, interactions, level) => {
  let maturity = current;
  
  // Incremento base por experiencia
  const experienceGain = interactions.reduce((acc, interaction) => {
    const weights = {
      'deep_reflection': 2.0,
      'system_understanding': 1.5,
      'pattern_recognition': 1.2,
      'meta_cognition': 2.5,
      'knowledge_synthesis': 1.8
    };
    
    return acc + (weights[interaction.type] || 0.5);
  }, 0);
  
  // Factor de nivel para acelerar o desacelerar crecimiento
  const levelMultiplier = 1 + (level * 0.1);
  
  return maturity + (experienceGain * levelMultiplier);
};

// 📊 DETERMINACIÓN DE NIVEL
const determineLevel = (maturity, currentLevel) => {
  const levelThresholds = [0, 5, 15, 30, 50, 75, 100];
  
  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (maturity >= levelThresholds[i]) {
      return Math.max(currentLevel, i); // Solo permitir ascensos
    }
  }
  
  return currentLevel;
};

// 🔗 COHERENCIA COGNITIVA
const calculateCoherence = (vitalidad, eutimia, carga) => {
  // La coherencia es alta cuando vitalidad y eutimia son altas, y carga es baja
  const vitEutBalance = (vitalidad + eutimia) / 2;
  const cargaPenalty = carga * 0.3;
  
  return Math.max(0, vitEutBalance - cargaPenalty);
};

// 🚀 PREPARACIÓN PARA EVOLUCIÓN
const calculateEvolutionReadiness = (maturity, level) => {
  const nextLevelThreshold = [5, 15, 30, 50, 75, 100][level] || 100;
  const progress = Math.min(100, (maturity / nextLevelThreshold) * 100);
  
  return {
    percentage: progress,
    ready: progress >= 95,
    nextThreshold: nextLevelThreshold
  };
};

// ⚖️ ESTABILIDAD DEL SISTEMA
const calculateSystemStability = (vitalidad, eutimia, carga) => {
  // Estabilidad basada en el balance entre componentes
  const variance = Math.abs(vitalidad - eutimia) + carga;
  const baseStability = 100 - variance;
  
  return Math.max(0, Math.min(100, baseStability));
};

// 🎯 FUNCIONES DE UTILIDAD PARA COMPONENTES
export const getStateDescription = (state) => {
  const { vitalidad, eutimia, carga, cognitiveCoherence } = state;
  
  if (cognitiveCoherence > 80) return "🌟 Estado Óptimo";
  if (cognitiveCoherence > 60) return "✨ Estado Estable";
  if (cognitiveCoherence > 40) return "⚡ Estado Activo";
  if (cognitiveCoherence > 20) return "🔄 Estado Inestable";
  return "⚠️ Estado Crítico";
};

export const getLevelName = (level) => {
  const names = [
    "Visitante Inicial",
    "Explorador Curioso", 
    "Navegante Cognitivo",
    "Analista Sistémico",
    "Arquitecto Mental",
    "Maestro de Lentes",
    "Omnicon Φ∞"
  ];
  
  return names[level] || "Estado Desconocido";
};

// 🎨 CONFIGURACIÓN DE LENTES COGNITIVAS
export const applyLensFilter = (rawData, lensType) => {
  const filters = {
    analytical: (data) => ({
      ...data,
      emphasis: 'logic',
      colorScheme: 'cyan',
      dataDisplay: 'detailed'
    }),
    
    emotional: (data) => ({
      ...data,
      emphasis: 'feeling',
      colorScheme: 'amber',
      dataDisplay: 'intuitive'
    }),
    
    systemic: (data) => ({
      ...data,
      emphasis: 'patterns',
      colorScheme: 'green',
      dataDisplay: 'network'
    }),
    
    transcendent: (data) => ({
      ...data,
      emphasis: 'unity',
      colorScheme: 'violet',
      dataDisplay: 'holistic'
    })
  };
  
  return filters[lensType] ? filters[lensType](rawData) : rawData;
};