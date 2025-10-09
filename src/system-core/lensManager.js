/**
 * @module lensManager
 * @description Sistema centralizado de gestión del Lente Cognitivo para el Prunaverso Web.
 * Centraliza toda la lógica de estado atmosférico, lentes cognitivas, perfiles de usuario,
 * y configuraciones de presentación. Mantiene la separación entre Core Logic y React Presentation Layer.
 * 
 * @author Pruna - Sistema Cognitivo Prunaverso
 * @version 2.1.0
 */

import { lensLogger } from './logManager.js';

// ================================
// CONFIGURACIÓN Y CONSTANTES
// ================================

/**
 * Lentes cognitivas disponibles
 */
export const COGNITIVE_LENSES = {
  AI: 'ai',
  PHILOSOPHY: 'philosophy',
  LINGUISTICS: 'linguistics',
  ANALYTICAL: 'analytical',
  EMOTIONAL: 'emotional',
  SYSTEMIC: 'systemic',
  TRANSCENDENT: 'transcendent'
};

/**
 * Grados académicos disponibles
 */
export const ACADEMIC_DEGREES = {
  STUDENT: 'student',
  RESEARCHER: 'researcher',
  PROFESSOR: 'professor',
  EXPERT: 'expert',
  MASTER: 'master',
  OMNICON: 'omnicon'
};

/**
 * Modos de respiración del sistema
 */
export const BREATHING_MODES = {
  ACTIVE: true,
  INACTIVE: false
};

/**
 * Estados del sistema
 */
export const SYSTEM_STATES = {
  EXPLORATION_MODE: 'EXPLORATION_MODE',
  ADMIN_MODE: 'ADMIN_MODE',
  LEARNING_MODE: 'LEARNING_MODE',
  CREATIVE_MODE: 'CREATIVE_MODE'
};

/**
 * Configuración por defecto (Alex Pruna default)
 */
const DEFAULT_CONFIG = {
  cognitiveLenses: ['ai', 'philosophy', 'linguistics'],
  academicDegree: 'researcher',
  userProfile: {
    narrativeStyle: 'philosophical',
    emotionalTone: 'contemplative',
    conceptualComplexity: 'interdisciplinary',
    culturalReferences: 'underground',
    presentationFormat: 'network'
  },
  activeProfile: 'alex_pruna',
  breathingMode: false,
  systemState: 'EXPLORATION_MODE',
  cognitiveIntensity: 50
};

// ================================
// ESTADO INTERNO
// ================================

/**
 * Estado actual del lens manager
 */
let currentState = { ...DEFAULT_CONFIG };
let isInitialized = false;
let coreReady = false;

// ================================
// PERSISTENCIA LOCAL
// ================================

/**
 * Claves de localStorage para persistencia
 */
const STORAGE_KEYS = {
  COGNITIVE_LENSES: 'prunaverso_cognitive_lenses',
  ACADEMIC_DEGREE: 'prunaverso_academic_degree',
  USER_PROFILE: 'prunaverso_user_profile',
  ACTIVE_PROFILE: 'prunaverso_active_profile',
  BREATHING_MODE: 'pruna_breathing',
  SYSTEM_STATE: 'prunaverso_system_state',
  COGNITIVE_INTENSITY: 'prunaverso_cognitive_intensity'
};

/**
 * Carga estado desde localStorage
 * @returns {Object} Estado cargado
 */
function loadStateFromStorage() {
  try {
    const savedLenses = localStorage.getItem(STORAGE_KEYS.COGNITIVE_LENSES);
    const savedDegree = localStorage.getItem(STORAGE_KEYS.ACADEMIC_DEGREE);
    const savedProfile = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    const savedActiveProfile = localStorage.getItem(STORAGE_KEYS.ACTIVE_PROFILE);
    const savedBreathing = localStorage.getItem(STORAGE_KEYS.BREATHING_MODE);
    const savedSystemState = localStorage.getItem(STORAGE_KEYS.SYSTEM_STATE);
    const savedIntensity = localStorage.getItem(STORAGE_KEYS.COGNITIVE_INTENSITY);

    return {
      cognitiveLenses: savedLenses ? JSON.parse(savedLenses) : DEFAULT_CONFIG.cognitiveLenses,
      academicDegree: savedDegree || DEFAULT_CONFIG.academicDegree,
      userProfile: savedProfile ? JSON.parse(savedProfile) : DEFAULT_CONFIG.userProfile,
      activeProfile: savedActiveProfile || DEFAULT_CONFIG.activeProfile,
      breathingMode: savedBreathing === "1",
      systemState: savedSystemState || DEFAULT_CONFIG.systemState,
      cognitiveIntensity: savedIntensity ? parseInt(savedIntensity) : DEFAULT_CONFIG.cognitiveIntensity
    };
  } catch (error) {
    lensLogger.warn('Error cargando estado desde localStorage:', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Guarda estado en localStorage
 * @param {Object} state - Estado a guardar
 */
function saveStateToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEYS.COGNITIVE_LENSES, JSON.stringify(state.cognitiveLenses));
    localStorage.setItem(STORAGE_KEYS.ACADEMIC_DEGREE, state.academicDegree);
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(state.userProfile));
    localStorage.setItem(STORAGE_KEYS.ACTIVE_PROFILE, state.activeProfile);
    localStorage.setItem(STORAGE_KEYS.BREATHING_MODE, state.breathingMode ? "1" : "0");
    localStorage.setItem(STORAGE_KEYS.SYSTEM_STATE, state.systemState);
    localStorage.setItem(STORAGE_KEYS.COGNITIVE_INTENSITY, state.cognitiveIntensity.toString());
  } catch (error) {
    lensLogger.error('Error guardando estado en localStorage:', error);
  }
}

// ================================
// EVENTOS DEL SISTEMA
// ================================

/**
 * Despacha evento global de cambio de lente
 * @param {Object} detail - Detalles del evento
 */
function dispatchLensEvent(eventType, detail) {
  try {
    window.dispatchEvent(new CustomEvent(eventType, { detail }));
    lensLogger.debug(`Evento despachado: ${eventType}`, detail);
  } catch (error) {
    lensLogger.error(`Error despachando evento ${eventType}:`, error);
  }
}

// ================================
// FUNCIONES CORE DEL LENS MANAGER
// ================================

/**
 * Inicializa el sistema de lentes
 * @param {Object} customConfig - Configuración personalizada
 */
export function initialize(customConfig = {}) {
  if (isInitialized) {
    lensLogger.warn('LensManager ya inicializado, ignorando reinicialización');
    return;
  }

  lensLogger.info('Inicializando LensManager...');

  // Cargar estado persistente
  const persistedState = loadStateFromStorage();
  
  // Merge con configuración personalizada
  currentState = { 
    ...DEFAULT_CONFIG, 
    ...persistedState, 
    ...customConfig 
  };

  // Guardar estado inicial
  saveStateToStorage(currentState);

  isInitialized = true;
  
  lensLogger.info('LensManager inicializado correctamente');
  lensLogger.debug('Estado inicial:', currentState);
}

/**
 * Obtiene el estado actual completo
 * @returns {Object} Estado actual
 */
export function getState() {
  return { ...currentState };
}

/**
 * Actualiza el estado del sistema
 * @param {Object} newState - Nuevo estado (parcial)
 */
export function setState(newState) {
  const previousState = { ...currentState };
  currentState = { ...currentState, ...newState };
  
  // Persistir cambios
  saveStateToStorage(currentState);
  
  lensLogger.debug('Estado actualizado:', {
    previous: previousState,
    new: currentState,
    changes: newState
  });

  // Despachar eventos específicos según lo que cambió
  if (newState.cognitiveLenses) {
    dispatchLensEvent('cognitiveLensesChange', {
      lenses: currentState.cognitiveLenses,
      degree: currentState.academicDegree,
      profile: currentState.userProfile
    });
  }

  if (newState.academicDegree) {
    dispatchLensEvent('academicDegreeChange', {
      lenses: currentState.cognitiveLenses,
      degree: currentState.academicDegree
    });
  }

  if (newState.userProfile) {
    dispatchLensEvent('userProfileChange', {
      profile: currentState.userProfile,
      lenses: currentState.cognitiveLenses,
      degree: currentState.academicDegree
    });
  }

  if (newState.activeProfile) {
    dispatchLensEvent('activeProfileChange', {
      profileId: currentState.activeProfile
    });
  }
}

/**
 * Actualiza las lentes cognitivas
 * @param {Array} newLenses - Nuevas lentes
 */
export function setCognitiveLenses(newLenses) {
  if (!Array.isArray(newLenses)) {
    lensLogger.error('setCognitiveLenses: newLenses debe ser un array');
    return;
  }

  setState({ cognitiveLenses: newLenses });
  lensLogger.info('Lentes cognitivas actualizadas:', newLenses);
}

/**
 * Actualiza el grado académico
 * @param {string} newDegree - Nuevo grado
 */
export function setAcademicDegree(newDegree) {
  if (!Object.values(ACADEMIC_DEGREES).includes(newDegree)) {
    lensLogger.warn('Grado académico no reconocido:', newDegree);
  }

  setState({ academicDegree: newDegree });
  lensLogger.info('Grado académico actualizado:', newDegree);
}

/**
 * Actualiza el perfil de usuario
 * @param {Object} newProfile - Nuevo perfil
 */
export function setUserProfile(newProfile) {
  setState({ userProfile: newProfile });
  lensLogger.info('Perfil de usuario actualizado:', newProfile);
}

/**
 * Actualiza el perfil activo
 * @param {string} profileId - ID del perfil
 */
export function setActiveProfile(profileId) {
  setState({ activeProfile: profileId });
  lensLogger.info('Perfil activo actualizado:', profileId);
}

/**
 * Actualiza el modo de respiración
 * @param {boolean} enabled - Si está habilitado
 */
export function setBreathingMode(enabled) {
  setState({ breathingMode: enabled });
  lensLogger.info('Modo respiración actualizado:', enabled);
}

/**
 * Actualiza la intensidad cognitiva
 * @param {number} intensity - Intensidad (0-100)
 */
export function setCognitiveIntensity(intensity) {
  const clampedIntensity = Math.max(0, Math.min(100, intensity));
  setState({ cognitiveIntensity: clampedIntensity });
  lensLogger.info('Intensidad cognitiva actualizada:', clampedIntensity);
}

// ================================
// GETTERS ESPECÍFICOS
// ================================

/**
 * Obtiene la lente cognitiva principal
 * @returns {string} Lente principal
 */
export function getCurrentLens() {
  return currentState.cognitiveLenses[0] || null;
}

/**
 * Obtiene todas las lentes cognitivas
 * @returns {Array} Array de lentes
 */
export function getCognitiveLenses() {
  return [...currentState.cognitiveLenses];
}

/**
 * Obtiene el grado académico actual
 * @returns {string} Grado académico
 */
export function getAcademicDegree() {
  return currentState.academicDegree;
}

/**
 * Obtiene el perfil de usuario actual
 * @returns {Object} Perfil de usuario
 */
export function getUserProfile() {
  return { ...currentState.userProfile };
}

/**
 * Obtiene el perfil activo
 * @returns {string} ID del perfil activo
 */
export function getActiveProfile() {
  return currentState.activeProfile;
}

/**
 * Obtiene el modo de respiración
 * @returns {boolean} Estado del modo respiración
 */
export function getBreathingMode() {
  return currentState.breathingMode;
}

/**
 * Obtiene la intensidad cognitiva
 * @returns {number} Intensidad actual
 */
export function getCognitiveIntensity() {
  return currentState.cognitiveIntensity;
}

// ================================
// FUNCIONES DE ESTADO
// ================================

/**
 * Verifica si el sistema está inicializado
 * @returns {boolean} Estado de inicialización
 */
export function isReady() {
  return isInitialized;
}

/**
 * Notifica que el core está listo
 * @param {boolean} ready - Estado del core
 */
export function onCoreReady(ready) {
  coreReady = ready;
  lensLogger.info('Core system ready notification received:', ready);
}

/**
 * Obtiene estadísticas del lens manager
 * @returns {Object} Estadísticas
 */
export function getStats() {
  return {
    isInitialized,
    coreReady,
    currentLensCount: currentState.cognitiveLenses.length,
    activeProfile: currentState.activeProfile,
    systemState: currentState.systemState,
    cognitiveIntensity: currentState.cognitiveIntensity,
    timestamp: new Date().toISOString()
  };
}

/**
 * Resetea el estado a valores por defecto
 */
export function reset() {
  lensLogger.info('Reseteando LensManager a valores por defecto...');
  
  currentState = { ...DEFAULT_CONFIG };
  saveStateToStorage(currentState);
  
  // Despachar eventos de reset
  dispatchLensEvent('lensManagerReset', { state: currentState });
  
  lensLogger.info('LensManager reseteado correctamente');
}

// ================================
// COMPATIBILIDAD HACIA ATRÁS
// ================================

/**
 * Función de compatibilidad para componentes legacy
 * @param {string} lens - Lente individual
 */
export function setCognitiveLens(lens) {
  setCognitiveLenses(lens ? [lens] : []);
}

// ================================
// EXPORTACIÓN POR DEFECTO
// ================================

export default {
  // Inicialización
  initialize,
  isReady,
  onCoreReady,

  // Estado principal
  getState,
  setState,

  // Setters específicos
  setCognitiveLenses,
  setAcademicDegree,
  setUserProfile,
  setActiveProfile,
  setBreathingMode,
  setCognitiveIntensity,

  // Getters específicos
  getCurrentLens,
  getCognitiveLenses,
  getAcademicDegree,
  getUserProfile,
  getActiveProfile,
  getBreathingMode,
  getCognitiveIntensity,

  // Utilidades
  getStats,
  reset,

  // Compatibilidad
  setCognitiveLens,

  // Constantes
  COGNITIVE_LENSES,
  ACADEMIC_DEGREES,
  BREATHING_MODES,
  SYSTEM_STATES
};