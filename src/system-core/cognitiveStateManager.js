/**
 * COGNITIVE STATE MANAGER - GESTOR DE ESTADOS DEL SISTEMA OPERATIVO COGNITIVO
 * 
 * Maneja las transiciones de estado, persistencia y sincronización
 * entre los diferentes módulos del Prunaverso.
 * 
 * @version 1.0.0
 */

import { calculateCognitiveState, getLevelName, getStateDescription } from './prunalgoritm.js';
import { achievementSystem } from './achievementSystem.js';

// 🧠 ESTADO GLOBAL DEL SISTEMA
let globalCognitiveState = {
  vitalidad: 50,
  eutimia: 50,
  carga: 0,
  maturity: 0,
  level: 0,
  lastUpdate: Date.now(),
  sessionStart: Date.now(),
  
  // Estados derivados
  cognitiveCoherence: 50,
  evolutionReadiness: { percentage: 0, ready: false },
  systemStability: 50,
  
  // Historial de interacciones
  interactionHistory: [],
  
  // Configuración activa
  activeLens: 'analytical',
  preferences: {}
};

// 📊 EVENTOS DEL SISTEMA
const systemEvents = new EventTarget();

// 🔄 ACTUALIZADOR PRINCIPAL
export const updateCognitiveState = (interactions = []) => {
  const now = Date.now();
  const timeElapsed = now - globalCognitiveState.lastUpdate;
  
  // Calcular nuevo estado usando el Prunalgoritm
  const newState = calculateCognitiveState(
    globalCognitiveState,
    interactions,
    timeElapsed
  );
  
  // Actualizar estado global
  const previousState = { ...globalCognitiveState };
  globalCognitiveState = {
    ...globalCognitiveState,
    ...newState,
    lastUpdate: now,
    interactionHistory: [
      ...globalCognitiveState.interactionHistory.slice(-50), // Mantener últimas 50
      ...interactions.map(interaction => ({
        ...interaction,
        timestamp: now
      }))
    ]
  };
  
  // Detectar cambios significativos
  detectStateTransitions(previousState, globalCognitiveState);
  
  // Verificar logros después de actualizar el estado
  const newAchievements = achievementSystem.checkAchievements({
    ...globalCognitiveState,
    sessionTime: Math.round((now - sessionStartTime) / 1000 / 60), // en minutos
    awakeningSeen: localStorage.getItem('awakeningSeen') === 'true',
    portalVisits: parseInt(localStorage.getItem('portalVisits') || '0'),
    mindModulesExplored: parseInt(localStorage.getItem('mindModulesExplored') || '0'),
    hudActivated: localStorage.getItem('hudActivated') === 'true',
    lensesUsed: parseInt(localStorage.getItem('lensesUsed') || '0'),
    customArchetypeCreated: localStorage.getItem('customArchetypeCreated') === 'true'
  });
  
  // Si hay nuevos logros, actualizar el XP
  if (newAchievements.length > 0) {
    const bonusXP = newAchievements.reduce((total, achievement) => total + achievement.xpReward, 0);
    globalCognitiveState = {
      ...globalCognitiveState,
      ...calculateCognitiveState(
        globalCognitiveState.vitalidad,
        globalCognitiveState.eutimia, 
        globalCognitiveState.carga,
        globalCognitiveState.coherencia,
        globalCognitiveState.totalXP + bonusXP
      )
    };
  }
  
  // Persistir estado
  persistState();
  
  // Emitir evento de actualización
  systemEvents.dispatchEvent(new CustomEvent('stateUpdate', {
    detail: { previousState, newState: globalCognitiveState }
  }));
  
  return globalCognitiveState;
};

// 🎯 DETECCIÓN DE TRANSICIONES IMPORTANTES
const detectStateTransitions = (previous, current) => {
  // Cambio de nivel
  if (current.level > previous.level) {
    systemEvents.dispatchEvent(new CustomEvent('levelUp', {
      detail: { 
        previousLevel: previous.level, 
        newLevel: current.level,
        timestamp: Date.now()
      }
    }));
  }
  
  // Estado crítico de vitalidad
  if (current.vitalidad < 20 && previous.vitalidad >= 20) {
    systemEvents.dispatchEvent(new CustomEvent('lowVitality', {
      detail: { vitalidad: current.vitalidad }
    }));
  }
  
  // Sobrecarga cognitiva
  if (current.carga > 80 && previous.carga <= 80) {
    systemEvents.dispatchEvent(new CustomEvent('cognitiveOverload', {
      detail: { carga: current.carga }
    }));
  }
  
  // Estado de flujo óptimo
  if (current.cognitiveCoherence > 85 && previous.cognitiveCoherence <= 85) {
    systemEvents.dispatchEvent(new CustomEvent('flowState', {
      detail: { coherence: current.cognitiveCoherence }
    }));
  }
  
  // Preparado para evolución
  if (current.evolutionReadiness.ready && !previous.evolutionReadiness.ready) {
    systemEvents.dispatchEvent(new CustomEvent('evolutionReady', {
      detail: { maturity: current.maturity, level: current.level }
    }));
  }
};

// 💾 PERSISTENCIA DEL ESTADO
const persistState = () => {
  try {
    const stateToSave = {
      ...globalCognitiveState,
      interactionHistory: globalCognitiveState.interactionHistory.slice(-20) // Solo últimas 20
    };
    
    localStorage.setItem('prunaverso_cognitive_state', JSON.stringify(stateToSave));
  } catch (error) {
    console.warn('No se pudo persistir el estado cognitivo:', error);
  }
};

// 📤 CARGA DEL ESTADO PERSISTIDO
export const loadPersistedState = () => {
  try {
    const saved = localStorage.getItem('prunaverso_cognitive_state');
    if (saved) {
      const parsedState = JSON.parse(saved);
      
      // Validar que el estado no sea muy antiguo
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 días
      if (Date.now() - parsedState.lastUpdate < maxAge) {
        globalCognitiveState = {
          ...globalCognitiveState,
          ...parsedState,
          sessionStart: Date.now() // Nueva sesión
        };
        
        return true;
      }
    }
  } catch (error) {
    console.warn('Error cargando estado persistido:', error);
  }
  
  return false;
};

// 🎮 FUNCIONES DE INTERACCIÓN PARA COMPONENTES
export const registerInteraction = (type, data = {}) => {
  const interaction = {
    type,
    data,
    timestamp: Date.now()
  };
  
  updateCognitiveState([interaction]);
};

export const registerMultipleInteractions = (interactions) => {
  updateCognitiveState(interactions);
};

// 📡 SUSCRIPCIÓN A EVENTOS
export const subscribeToStateChanges = (eventType, callback) => {
  systemEvents.addEventListener(eventType, callback);
  
  // Retornar función de cleanup
  return () => systemEvents.removeEventListener(eventType, callback);
};

// 🔍 GETTERS DEL ESTADO
export const getCurrentState = () => ({ ...globalCognitiveState });

export const getStateSlice = (keys) => {
  const slice = {};
  keys.forEach(key => {
    if (key in globalCognitiveState) {
      slice[key] = globalCognitiveState[key];
    }
  });
  return slice;
};

export const getSessionMetrics = () => {
  const now = Date.now();
  const sessionDuration = now - globalCognitiveState.sessionStart;
  
  return {
    duration: sessionDuration,
    interactionsCount: globalCognitiveState.interactionHistory.length,
    averageCoherence: calculateAverageCoherence(),
    peakVitalidad: getPeakValue('vitalidad'),
    evolutionProgress: globalCognitiveState.evolutionReadiness.percentage
  };
};

// 📈 MÉTRICAS DERIVADAS
const calculateAverageCoherence = () => {
  // Simplificado - en una implementación real calcularíamos el promedio histórico
  return globalCognitiveState.cognitiveCoherence;
};

const getPeakValue = (metric) => {
  // Simplificado - en una implementación real buscaríamos en el historial
  return globalCognitiveState[metric];
};

// 🎨 CONFIGURACIÓN DE LENTES
export const setActiveLens = (lensType) => {
  const previousLens = globalCognitiveState.activeLens;
  globalCognitiveState.activeLens = lensType;
  
  // Registrar cambio de lente como interacción
  registerInteraction('lens_change', {
    from: previousLens,
    to: lensType
  });
  
  // Emitir evento específico
  systemEvents.dispatchEvent(new CustomEvent('lensChange', {
    detail: { previousLens, newLens: lensType }
  }));
};

export const getActiveLens = () => globalCognitiveState.activeLens;

// 🔄 RESET Y DEPURACIÓN
export const resetCognitiveState = () => {
  globalCognitiveState = {
    vitalidad: 50,
    eutimia: 50,
    carga: 0,
    maturity: 0,
    level: 0,
    lastUpdate: Date.now(),
    sessionStart: Date.now(),
    
    cognitiveCoherence: 50,
    evolutionReadiness: { percentage: 0, ready: false },
    systemStability: 50,
    
    interactionHistory: [],
    activeLens: 'analytical',
    preferences: {}
  };
  
  persistState();
  
  systemEvents.dispatchEvent(new CustomEvent('stateReset', {
    detail: { timestamp: Date.now() }
  }));
};

// 🐛 FUNCIONES DE DEBUG
export const getDebugInfo = () => {
  return {
    state: globalCognitiveState,
    constants: COGNITIVE_CONSTANTS,
    metrics: getSessionMetrics(),
    events: systemEvents
  };
};

// 🚀 INICIALIZACIÓN
export const initializeCognitiveSystem = () => {
  // Cargar estado persistido si existe
  const loaded = loadPersistedState();
  
  if (!loaded) {
    console.log('🧠 Inicializando nuevo estado cognitivo');
  } else {
    console.log('🔄 Estado cognitivo restaurado');
  }
  
  // Configurar auto-guardado cada 30 segundos
  setInterval(persistState, 30000);
  
  return globalCognitiveState;
};

// 📤 EXPORTAR MANAGER PRINCIPAL
export const cognitiveStateManager = {
  getCurrentState,
  updateCognitiveState,
  getLevelProgressData,
  getSessionReport,
  initializeCognitiveSystem
};