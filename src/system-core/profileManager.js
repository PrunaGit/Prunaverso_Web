/**
 * PRUNAVERSO SYSTEM CORE - PROFILE MANAGER
 * ========================================
 * 
 * Gestión centralizada del estado cognitivo del usuario.
 * Consolida la lógica de perfiles dispersa en hooks y utils.
 * 
 * Responsabilidades:
 * - Detección de tipo de usuario (visitor/architect)
 * - Gestión de perfiles predefinidos
 * - Estado cognitivo y configuración de lentes
 * - Persistencia de preferencias
 */

// ================================
// TIPOS Y CONFIGURACIONES BASE
// ================================

export const USER_TYPES = {
  VISITOR: 'visitor',
  ARCHITECT: 'architect'
};

export const PROFILE_STATES = {
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error'
};

// ================================
// PERFILES PREDEFINIDOS
// ================================

export const PREDEFINED_PROFILES = {
  // Perfil base - Alex Pruna
  'alex_pruna': {
    id: 'alex_pruna',
    name: 'Alex Pruna',
    emoji: '👨‍💻',
    description: 'Creador del Prunaverso - Perspectiva fundacional',
    type: USER_TYPES.ARCHITECT,
    cognitiveLenses: ['ai', 'philosophy', 'linguistics'],
    preferences: {
      narrativeStyle: 'philosophical',
      emotionalTone: 'contemplative',
      conceptualComplexity: 'interdisciplinary',
      culturalReferences: 'underground',
      presentationFormat: 'network'
    },
    academicDegree: 'researcher',
    isDefault: true,
    color: 'from-purple-600 to-blue-600'
  },
  
  // Visitante genérico
  'visitor_default': {
    id: 'visitor_default',
    name: 'Visitante',
    emoji: '👁️',
    description: 'Explorador del Prunaverso - Primera inmersión',
    type: USER_TYPES.VISITOR,
    cognitiveLenses: ['general'],
    preferences: {
      narrativeStyle: 'accessible',
      emotionalTone: 'curious',
      conceptualComplexity: 'introductory',
      culturalReferences: 'universal',
      presentationFormat: 'guided'
    },
    academicDegree: 'explorer',
    isDefault: false,
    color: 'from-blue-400 to-cyan-400'
  },

  // Científica Cognitiva
  'maria_cognitive_scientist': {
    id: 'maria_cognitive_scientist',
    name: 'María - Científica Cognitiva',
    emoji: '🧠',
    description: 'Especialista en neurociencia y psicología experimental',
    type: USER_TYPES.ARCHITECT,
    cognitiveLenses: ['neuroscience', 'psychology'],
    preferences: {
      narrativeStyle: 'scientific',
      emotionalTone: 'neutral',
      conceptualComplexity: 'complex',
      culturalReferences: 'academic',
      presentationFormat: 'linear'
    },
    academicDegree: 'expert',
    color: 'from-blue-500 to-purple-500'
  },

  // Lingüista
  'carlos_linguist': {
    id: 'carlos_linguist',
    name: 'Carlos - Lingüista',
    emoji: '💬',
    description: 'Experto en análisis del discurso y pragmática',
    type: USER_TYPES.ARCHITECT,
    cognitiveLenses: ['linguistics', 'anthropology', 'philosophy'],
    preferences: {
      narrativeStyle: 'conversational',
      emotionalTone: 'warm',
      conceptualComplexity: 'complex',
      culturalReferences: 'international',
      presentationFormat: 'spiral'
    },
    academicDegree: 'expert',
    color: 'from-green-500 to-blue-500'
  }
};

// ================================
// ESTADO INTERNO DEL SISTEMA
// ================================

let currentProfile = null;
let profileState = PROFILE_STATES.LOADING;
let profileLoadStartTime = null;

// ================================
// LÓGICA DE DETECCIÓN Y CARGA
// ================================

/**
 * Detecta el tipo de usuario basado en contexto
 * @returns {Object} Información de detección
 */
export function detectUserContext() {
  const detection = {
    isDevMode: false,
    urlParams: {},
    timestamp: new Date().toISOString()
  };

  // Detectar parámetros de URL
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    detection.urlParams = Object.fromEntries(urlParams.entries());
    detection.isDevMode = urlParams.get('dev') === 'true';
    detection.forceProfile = urlParams.get('profile');
  }

  // Detectar contexto de desarrollo
  if (typeof process !== 'undefined') {
    detection.isDevelopment = process.env.NODE_ENV === 'development';
  }

  return detection;
}

/**
 * Carga el perfil apropiado basado en contexto
 * @param {Object} context - Contexto de detección
 * @returns {Object} Perfil cargado
 */
export function loadUserProfile(context = null) {
  if (!context) {
    context = detectUserContext();
  }

  profileLoadStartTime = Date.now();
  profileState = PROFILE_STATES.LOADING;

  // Forzar perfil específico si se especifica
  if (context.forceProfile && PREDEFINED_PROFILES[context.forceProfile]) {
    currentProfile = { ...PREDEFINED_PROFILES[context.forceProfile] };
    profileState = PROFILE_STATES.READY;
    return currentProfile;
  }

  // Modo desarrollador
  if (context.isDevMode) {
    currentProfile = { ...PREDEFINED_PROFILES.alex_pruna };
    profileState = PROFILE_STATES.READY;
    return currentProfile;
  }

  // Visitante por defecto
  currentProfile = { ...PREDEFINED_PROFILES.visitor_default };
  profileState = PROFILE_STATES.READY;
  return currentProfile;
}

/**
 * Simula carga asíncrona del perfil
 * @param {number} delay - Delay en ms
 * @returns {Promise<Object>} Perfil cargado
 */
export async function loadUserProfileAsync(delay = 500) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const context = detectUserContext();
      const profile = loadUserProfile(context);
      resolve(profile);
    }, delay);
  });
}

// ================================
// GESTIÓN DE ESTADO
// ================================

/**
 * Obtiene el perfil actual
 * @returns {Object|null} Perfil actual
 */
export function getCurrentProfile() {
  return currentProfile;
}

/**
 * Obtiene el estado del perfil
 * @returns {string} Estado actual
 */
export function getProfileState() {
  return profileState;
}

/**
 * Verifica si el perfil está cargando
 * @returns {boolean}
 */
export function isProfileLoading() {
  return profileState === PROFILE_STATES.LOADING;
}

/**
 * Obtiene métricas de carga del perfil
 * @returns {Object} Métricas
 */
export function getProfileMetrics() {
  return {
    loadStartTime: profileLoadStartTime,
    loadDuration: profileLoadStartTime ? Date.now() - profileLoadStartTime : null,
    state: profileState,
    profileId: currentProfile?.id || null
  };
}

// ================================
// UTILIDADES DE PERFIL
// ================================

/**
 * Verifica si el usuario es arquitecto
 * @param {Object} profile - Perfil a verificar (opcional)
 * @returns {boolean}
 */
export function isArchitect(profile = currentProfile) {
  return profile?.type === USER_TYPES.ARCHITECT;
}

/**
 * Verifica si el usuario es visitante
 * @param {Object} profile - Perfil a verificar (opcional)
 * @returns {boolean}
 */
export function isVisitor(profile = currentProfile) {
  return profile?.type === USER_TYPES.VISITOR;
}

/**
 * Obtiene las lentes cognitivas del perfil
 * @param {Object} profile - Perfil (opcional)
 * @returns {Array} Array de lentes
 */
export function getCognitiveLenses(profile = currentProfile) {
  return profile?.cognitiveLenses || ['general'];
}

/**
 * Obtiene las preferencias del perfil
 * @param {Object} profile - Perfil (opcional)
 * @returns {Object} Preferencias
 */
export function getProfilePreferences(profile = currentProfile) {
  return profile?.preferences || {};
}

// ================================
// INICIALIZACIÓN
// ================================

/**
 * Inicializa el sistema de perfiles
 * @returns {Object} Estado inicial
 */
export function initializeProfileSystem() {
  console.log('🧠 ProfileManager: Inicializando sistema de perfiles...');
  
  const context = detectUserContext();
  console.log('🔍 ProfileManager: Contexto detectado:', context);
  
  const profile = loadUserProfile(context);
  console.log('👤 ProfileManager: Perfil cargado:', profile.name, profile.type);
  
  return {
    profile,
    context,
    state: profileState,
    metrics: getProfileMetrics()
  };
}

// Autoexportar funciones principales para importación directa
export default {
  // Core functions
  initializeProfileSystem,
  loadUserProfile,
  loadUserProfileAsync,
  detectUserContext,
  
  // State management
  getCurrentProfile,
  getProfileState,
  isProfileLoading,
  getProfileMetrics,
  
  // Profile utilities
  isArchitect,
  isVisitor,
  getCognitiveLenses,
  getProfilePreferences,
  
  // Constants
  USER_TYPES,
  PROFILE_STATES,
  PREDEFINED_PROFILES
};