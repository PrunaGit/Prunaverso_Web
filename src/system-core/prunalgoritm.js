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
 * @version 2.1.0 - Evolution Build con Router Manager
 * @author Alex Pruna
 */

import profileManager from './profileManager.js';
import lensManager from './lensManager.js';
import logManager from './logManager.js';
import atmosphereManager from './atmosphereManager.js';
import serviceConfig from './serviceConfig.js';
import routerManager from './routerManager.js';

// 🧠 CONSTANTES DEL SISTEMA COGNITIVO
const COGNITIVE_STATES = {
  TRANSCENDENT: { id: 5, name: 'Trascendente', threshold: 85, atmosphere: 'transcendent' },
  SYSTEMIC: { id: 4, name: 'Sistémico', threshold: 70, atmosphere: 'systemic' },
  CREATIVE: { id: 3, name: 'Creativo', threshold: 55, atmosphere: 'creative' },
  EMOTIONAL: { id: 2, name: 'Emocional', threshold: 35, atmosphere: 'emotional' },
  ANALYTICAL: { id: 1, name: 'Analítico', threshold: 0, atmosphere: 'analytical' }
};

const PROGRESSION_MULTIPLIERS = {
  'Arquitecto': { base: 1.5, cognitiveBonus: 0.3 },
  'Colaborador': { base: 1.2, cognitiveBonus: 0.2 },
  'Visitante': { base: 1.0, cognitiveBonus: 0.1 }
};

// 🎯 VARIABLES DE ESTADO GLOBAL
let isSystemReady = false;
let lastUpdateTimestamp = null;

// 🔄 FUNCIONES DE CÁLCULO COGNITIVO

/**
 * @function calculateCognitiveState
 * @description Calcula el estado cognitivo basado en múltiples factores
 * @param {Object} input - Parámetros de entrada
 * @returns {Object} Estado cognitivo calculado
 */
export const calculateCognitiveState = (input) => {
  const { eutimia = 50, vitalidad = 50, focus = 50, creativity = 50 } = input;
  
  // Calcular intensidad cognitiva usando fórmula mejorada
  const cognitiveIntensity = Math.round(
    (eutimia * 0.3) + 
    (vitalidad * 0.25) + 
    (focus * 0.25) + 
    (creativity * 0.2)
  );
  
  // Determinar estado cognitivo
  const state = Object.values(COGNITIVE_STATES)
    .reverse()
    .find(state => cognitiveIntensity >= state.threshold) || COGNITIVE_STATES.ANALYTICAL;
  
  logManager.logDebug('COGNITIVE', `Estado calculado: ${state.name} (intensidad: ${cognitiveIntensity})`);
  
  return {
    intensity: cognitiveIntensity,
    state: state.name,
    stateId: state.id,
    atmosphere: state.atmosphere,
    factors: { eutimia, vitalidad, focus, creativity }
  };
};

/**
 * @function calculateEutimiaProgression
 * @description Calcula la progresión de eutimia basada en actividades
 * @param {Object} activity - Actividad realizada
 * @param {Object} currentProfile - Perfil actual del usuario
 * @returns {number} Incremento de eutimia
 */
export const calculateEutimiaProgression = (activity, currentProfile) => {
  const baseValue = activity.eutimiaImpact || 5;
  const multiplier = PROGRESSION_MULTIPLIERS[currentProfile.type] || PROGRESSION_MULTIPLIERS['Visitante'];
  
  let progression = baseValue * multiplier.base;
  
  // Bonus por sintonía cognitiva
  if (activity.cognitiveAlignment === currentProfile.preferredLens) {
    progression *= (1 + multiplier.cognitiveBonus);
  }
  
  logManager.logDebug('PROGRESSION', `Eutimia calculada: ${progression} (base: ${baseValue}, tipo: ${currentProfile.type})`);
  
  return Math.round(progression);
};

/**
 * @function calculateVitalityDecay
 * @description Calcula la degradación natural de vitalidad
 * @param {number} currentVitality - Vitalidad actual
 * @param {number} hoursInactive - Horas de inactividad
 * @returns {number} Vitalidad después del decay
 */
export const calculateVitalityDecay = (currentVitality, hoursInactive) => {
  // Función de decay exponencial suave
  const decayRate = 0.02; // 2% por hora base
  const decay = currentVitality * (1 - Math.pow(1 - decayRate, hoursInactive));
  
  const newVitality = Math.max(10, Math.round(currentVitality - decay));
  
  logManager.logDebug('VITALITY', `Decay aplicado: ${currentVitality} -> ${newVitality} (${hoursInactive}h inactivas)`);
  
  return newVitality;
};

/**
 * @function predictCognitiveEvolution
 * @description Predice la evolución cognitiva futura
 * @param {Object} currentState - Estado actual
 * @param {Array} plannedActivities - Actividades planificadas
 * @returns {Object} Predicción de evolución
 */
export const predictCognitiveEvolution = (currentState, plannedActivities = []) => {
  let projectedEutimia = currentState.eutimia;
  let projectedVitality = currentState.vitalidad;
  
  // Simular actividades planificadas
  plannedActivities.forEach(activity => {
    projectedEutimia += calculateEutimiaProgression(activity, currentState.profile);
    projectedVitality = Math.min(100, projectedVitality + (activity.vitalityImpact || 3));
  });
  
  // Aplicar límites
  projectedEutimia = Math.min(100, Math.max(0, projectedEutimia));
  projectedVitality = Math.min(100, Math.max(10, projectedVitality));
  
  const projectedCognitive = calculateCognitiveState({
    eutimia: projectedEutimia,
    vitalidad: projectedVitality,
    focus: currentState.focus,
    creativity: currentState.creativity
  });
  
  return {
    current: currentState,
    projected: {
      eutimia: projectedEutimia,
      vitalidad: projectedVitality,
      cognitive: projectedCognitive
    },
    improvement: projectedCognitive.intensity - currentState.cognitiveIntensity,
    activities: plannedActivities.length
  };
};

// 🚀 FUNCIÓN DE INICIALIZACIÓN MAESTRA

/**
 * @function initializePrunalgoritm
 * @description Inicializa todos los subsistemas del core en secuencia optimizada
 * @returns {Promise<boolean>} Éxito de la inicialización
 */
export const initializePrunalgoritm = async () => {
  try {
    logManager.logInfo('SYSTEM', '🚀 Iniciando PRUNALGORITM - Sistema Operativo Cognitivo v2.1.0');
    
    // 1. Verificar dependencias críticas
    if (!profileManager || !lensManager || !logManager) {
      throw new Error('Dependencias críticas no disponibles');
    }
    
    // 2. Cargar perfil de usuario
    logManager.logInfo('SYSTEM', 'Cargando perfil de usuario...');
    await profileManager.loadUserProfile();
    
    const currentProfile = profileManager.getCurrentProfile();
    if (!currentProfile) {
      throw new Error('No se pudo cargar el perfil de usuario');
    }
    
    // 3. Configurar logging específico según tipo de usuario
    const isCollaborator = profileManager.isArchitect() || currentProfile.type === 'Colaborador';
    const nickname = currentProfile.name || 'Usuario';
    
    if (isCollaborator) {
      logManager.logInfo('SYSTEM', `Colaborador detectado: ${nickname}. Configurando modo administrador.`);
      
      // Configurar estado inicial especial para colaboradores
      lensManager.setState({
        systemState: 'ADMIN_MODE',
        activeLens: 'systemic',
        cognitiveIntensity: 85
      });
      
      // Configurar logging extendido para colaboradores
      logManager.updateLoggerConfig({
        level: logManager.LOG_LEVELS.DEBUG,
        enableStorage: true
      });
    } else {
      logManager.logInfo('SYSTEM', 'Visitante detectado. Configurando modo exploración.');
      
      // Estado inicial para visitantes
      lensManager.setState({
        systemState: 'EXPLORATION_MODE',
        activeLens: 'emotional',
        cognitiveIntensity: 45
      });
    }

    // 4. Configurar servicios
    logManager.logInfo('SYSTEM', 'Configurando sistema de servicios...');
    // serviceConfig se auto-configura al importarse
    logManager.logInfo('SYSTEM', `Ambiente detectado: ${serviceConfig.getCurrentEnvironment()}`);
    
    // 5. Inicializar router
    logManager.logInfo('SYSTEM', 'Inicializando sistema de rutas...');
    routerManager.initialize();
    
    // 6. Sincronizar atmósfera con el estado de lentes
    logManager.logInfo('SYSTEM', 'Conectando atmósfera con lentes cognitivas...');
    atmosphereManager.updateAtmosphereFromLens();

    // 7. Marcar el sistema como listo
    isSystemReady = true;
    lastUpdateTimestamp = new Date().toISOString();
    
    // 8. Notificar a los managers que el core está listo
    lensManager.onCoreReady?.(isSystemReady);
    
    logManager.logInfo('SYSTEM', '✅ Inicialización del PRUNALGORITM completada. Coherencia Sistémica establecida con 5 managers.');
    logManager.logDebug('SYSTEM', 'Sistemas activos:', {
      profileManager: profileManager.getCurrentProfile().name,
      lensManager: lensManager.getState().activeLens,
      logManager: logManager.isLoggerReady(),
      atmosphereManager: atmosphereManager.getActiveAtmosphere(),
      routerManager: routerManager.getStats()
    });

    return true;
    
  } catch (error) {
    logManager.logError('SYSTEM', 'Error en inicialización del PRUNALGORITM:', error);
    return false;
  }
};

/**
 * @function getSystemStatus
 * @description Obtiene el estado actual de todos los subsistemas
 * @returns {Object} Estado completo del sistema
 */
export const getSystemStatus = () => {
  return {
    isReady: isSystemReady,
    lastUpdate: lastUpdateTimestamp,
    systems: {
      profile: {
        ready: profileManager.getCurrentProfile() !== null,
        currentProfile: profileManager.getCurrentProfile()?.name,
        userType: profileManager.getCurrentProfile()?.type
      },
      lens: {
        ready: lensManager.isReady(),
        currentLens: lensManager.getState().activeLens,
        systemState: lensManager.getState().systemState
      },
      logging: {
        ready: logManager.isLoggerReady(),
        totalLogs: logManager.getLoggerStats().totalEntries,
        config: logManager.getLoggerConfig().level
      },
      atmosphere: {
        ready: atmosphereManager.isReady(),
        currentTheme: atmosphereManager.getActiveAtmosphere(),
        palette: atmosphereManager.getCurrentPalette()
      },
      services: {
        ready: serviceConfig.isConfigured(),
        environment: serviceConfig.getCurrentEnvironment(),
        endpoints: Object.keys(serviceConfig.getEndpoints()).length
      },
      router: {
        ready: routerManager.isReady(),
        currentRoute: routerManager.getCurrentRoute()?.name,
        historyEntries: routerManager.getStats().historyEntries
      }
    },
    timestamp: new Date().toISOString()
  };
};

/**
 * @function updateCognitiveState
 * @description Actualiza el estado cognitivo del sistema
 * @param {Object} newFactors - Nuevos factores cognitivos
 */
export const updateCognitiveState = (newFactors) => {
  const cognitiveState = calculateCognitiveState(newFactors);
  
  // Actualizar lensManager con el nuevo estado
  lensManager.setState({
    cognitiveIntensity: cognitiveState.intensity,
    activeLens: cognitiveState.atmosphere
  });
  
  // Sincronizar atmósfera
  atmosphereManager.updateAtmosphereFromLens();
  
  logManager.logInfo('COGNITIVE', `Estado cognitivo actualizado: ${cognitiveState.state} (${cognitiveState.intensity})`);
  
  lastUpdateTimestamp = new Date().toISOString();
};

// Exportaciones por defecto
export default {
  // Inicialización
  initializePrunalgoritm,
  getSystemStatus,
  
  // Cálculos cognitivos
  calculateCognitiveState,
  calculateEutimiaProgression,
  calculateVitalityDecay,
  predictCognitiveEvolution,
  updateCognitiveState,
  
  // Estado
  isReady: () => isSystemReady,
  
  // Constantes
  COGNITIVE_STATES,
  PROGRESSION_MULTIPLIERS
};