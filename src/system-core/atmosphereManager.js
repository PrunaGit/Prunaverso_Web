/**
 * @module atmosphereManager
 * @description Sistema centralizado de gestión de atmósfera visual para el Prunaverso Web.
 * Centraliza la lógica de temas, colores, efectos visuales y estados atmosféricos.
 * Consume el estado del lensManager para determinar la presentación visual.
 * Mantiene la separación entre Core Logic (lensManager) y Presentation Logic (atmosphereManager).
 * 
 * @author Pruna - Sistema Cognitivo Prunaverso
 * @version 2.1.0
 */

import lensManager from './lensManager.js';
import { uiLogger } from './logManager.js';

// ================================
// CONFIGURACIÓN Y CONSTANTES
// ================================

/**
 * Temas atmosféricos disponibles
 */
export const ATMOSPHERE_THEMES = {
  // Temas por lente cognitiva
  AI: 'atmosphere-ai',
  PHILOSOPHY: 'atmosphere-philosophy',
  LINGUISTICS: 'atmosphere-linguistics',
  ANALYTICAL: 'atmosphere-analytical',
  EMOTIONAL: 'atmosphere-emotional',
  SYSTEMIC: 'atmosphere-systemic',
  TRANSCENDENT: 'atmosphere-transcendent',
  
  // Temas por estado del sistema
  EXPLORATION: 'atmosphere-exploration',
  ADMIN: 'atmosphere-admin',
  LEARNING: 'atmosphere-learning',
  CREATIVE: 'atmosphere-creative',
  
  // Temas especiales
  LOADING: 'atmosphere-loading',
  ERROR: 'atmosphere-error',
  MAINTENANCE: 'atmosphere-maintenance'
};

/**
 * Configuración de paletas de colores por tema
 */
const COLOR_PALETTES = {
  [ATMOSPHERE_THEMES.AI]: {
    primary: '#00ff88',
    secondary: '#00cc66',
    accent: '#33ffaa',
    background: '#0a0f0a',
    text: '#ffffff',
    gradient: 'linear-gradient(135deg, #0a0f0a 0%, #1a2f1a 100%)'
  },
  
  [ATMOSPHERE_THEMES.PHILOSOPHY]: {
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#a78bfa',
    background: '#1e1b4b',
    text: '#e0e7ff',
    gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)'
  },
  
  [ATMOSPHERE_THEMES.LINGUISTICS]: {
    primary: '#f59e0b',
    secondary: '#d97706',
    accent: '#fbbf24',
    background: '#451a03',
    text: '#fef3c7',
    gradient: 'linear-gradient(135deg, #451a03 0%, #92400e 100%)'
  },
  
  [ATMOSPHERE_THEMES.ANALYTICAL]: {
    primary: '#06b6d4',
    secondary: '#0891b2',
    accent: '#67e8f9',
    background: '#164e63',
    text: '#cffafe',
    gradient: 'linear-gradient(135deg, #164e63 0%, #0e7490 100%)'
  },
  
  [ATMOSPHERE_THEMES.EMOTIONAL]: {
    primary: '#ec4899',
    secondary: '#db2777',
    accent: '#f9a8d4',
    background: '#831843',
    text: '#fce7f3',
    gradient: 'linear-gradient(135deg, #831843 0%, #be185d 100%)'
  },
  
  [ATMOSPHERE_THEMES.SYSTEMIC]: {
    primary: '#10b981',
    secondary: '#059669',
    accent: '#6ee7b7',
    background: '#064e3b',
    text: '#d1fae5',
    gradient: 'linear-gradient(135deg, #064e3b 0%, #047857 100%)'
  },
  
  [ATMOSPHERE_THEMES.TRANSCENDENT]: {
    primary: '#a855f7',
    secondary: '#9333ea',
    accent: '#c4b5fd',
    background: '#581c87',
    text: '#f3e8ff',
    gradient: 'linear-gradient(135deg, #581c87 0%, #7c2d12 100%)'
  },
  
  [ATMOSPHERE_THEMES.EXPLORATION]: {
    primary: '#3b82f6',
    secondary: '#2563eb',
    accent: '#93c5fd',
    background: '#1e3a8a',
    text: '#dbeafe',
    gradient: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 100%)'
  },
  
  [ATMOSPHERE_THEMES.ADMIN]: {
    primary: '#ef4444',
    secondary: '#dc2626',
    accent: '#fca5a5',
    background: '#7f1d1d',
    text: '#fee2e2',
    gradient: 'linear-gradient(135deg, #7f1d1d 0%, #b91c1c 100%)'
  }
};

/**
 * Efectos atmosféricos por tema
 */
const ATMOSPHERE_EFFECTS = {
  [ATMOSPHERE_THEMES.AI]: {
    animation: 'pulse-soft',
    particles: 'digital-rain',
    blur: 'subtle',
    glow: 'green-glow'
  },
  
  [ATMOSPHERE_THEMES.PHILOSOPHY]: {
    animation: 'fade-in-out',
    particles: 'floating-thoughts',
    blur: 'dreamy',
    glow: 'purple-aura'
  },
  
  [ATMOSPHERE_THEMES.SYSTEMIC]: {
    animation: 'network-pulse',
    particles: 'connected-nodes',
    blur: 'none',
    glow: 'system-grid'
  },
  
  [ATMOSPHERE_THEMES.TRANSCENDENT]: {
    animation: 'ethereal-float',
    particles: 'cosmic-dust',
    blur: 'mystical',
    glow: 'rainbow-shift'
  }
};

// ================================
// ESTADO INTERNO
// ================================

let currentAtmosphere = ATMOSPHERE_THEMES.EXPLORATION;
let isInitialized = false;
let atmosphereHistory = [];

// ================================
// UTILIDADES INTERNAS
// ================================

/**
 * Mapea lente cognitiva a tema atmosférico
 * @param {string} lensType - Tipo de lente
 * @returns {string} Tema atmosférico correspondiente
 */
function mapLensToAtmosphere(lensType) {
  const mapping = {
    'ai': ATMOSPHERE_THEMES.AI,
    'philosophy': ATMOSPHERE_THEMES.PHILOSOPHY,
    'linguistics': ATMOSPHERE_THEMES.LINGUISTICS,
    'analytical': ATMOSPHERE_THEMES.ANALYTICAL,
    'emotional': ATMOSPHERE_THEMES.EMOTIONAL,
    'systemic': ATMOSPHERE_THEMES.SYSTEMIC,
    'transcendent': ATMOSPHERE_THEMES.TRANSCENDENT
  };
  
  return mapping[lensType] || ATMOSPHERE_THEMES.EXPLORATION;
}

/**
 * Mapea estado del sistema a tema atmosférico
 * @param {string} systemState - Estado del sistema
 * @returns {string} Tema atmosférico correspondiente
 */
function mapSystemStateToAtmosphere(systemState) {
  const mapping = {
    'EXPLORATION_MODE': ATMOSPHERE_THEMES.EXPLORATION,
    'ADMIN_MODE': ATMOSPHERE_THEMES.ADMIN,
    'LEARNING_MODE': ATMOSPHERE_THEMES.LEARNING,
    'CREATIVE_MODE': ATMOSPHERE_THEMES.CREATIVE
  };
  
  return mapping[systemState] || ATMOSPHERE_THEMES.EXPLORATION;
}

/**
 * Aplica CSS variables de manera dinámica
 * @param {Object} palette - Paleta de colores
 */
function applyCSSVariables(palette) {
  if (typeof document === 'undefined') return; // Server-side safety
  
  const root = document.documentElement;
  
  Object.entries(palette).forEach(([key, value]) => {
    root.style.setProperty(`--atmosphere-${key}`, value);
  });
  
  uiLogger.debug('CSS variables aplicadas:', palette);
}

/**
 * Aplica clases CSS de efectos
 * @param {Object} effects - Efectos atmosféricos
 */
function applyAtmosphereEffects(effects) {
  if (typeof document === 'undefined') return; // Server-side safety
  
  const body = document.body;
  
  // Remover clases de efectos anteriores
  body.classList.forEach(className => {
    if (className.startsWith('atmosphere-effect-')) {
      body.classList.remove(className);
    }
  });
  
  // Aplicar nuevos efectos
  Object.entries(effects).forEach(([type, effect]) => {
    if (effect && effect !== 'none') {
      body.classList.add(`atmosphere-effect-${effect}`);
    }
  });
  
  uiLogger.debug('Efectos atmosféricos aplicados:', effects);
}

// ================================
// FUNCIONES CORE DEL ATMOSPHERE MANAGER
// ================================

/**
 * Inicializa el sistema de atmósfera
 */
export function initialize() {
  if (isInitialized) {
    uiLogger.warn('AtmosphereManager ya inicializado, ignorando reinicialización');
    return;
  }
  
  uiLogger.info('Inicializando AtmosphereManager...');
  
  // Detectar atmósfera inicial basada en el lensManager
  updateAtmosphereFromLens();
  
  isInitialized = true;
  uiLogger.info('AtmosphereManager inicializado correctamente');
}

/**
 * Actualiza la atmósfera basada en el estado del lensManager
 */
export function updateAtmosphereFromLens() {
  if (!lensManager.isReady()) {
    uiLogger.warn('LensManager no está listo, usando atmósfera por defecto');
    setAtmosphere(ATMOSPHERE_THEMES.EXPLORATION);
    return;
  }
  
  const lensState = lensManager.getState();
  const currentLens = lensState.cognitiveLenses[0];
  const systemState = lensState.systemState;
  
  // Determinar atmósfera basada en prioridad: estado del sistema > lente cognitiva
  let newAtmosphere;
  
  if (systemState && systemState !== 'EXPLORATION_MODE') {
    newAtmosphere = mapSystemStateToAtmosphere(systemState);
    uiLogger.debug(`Atmósfera determinada por estado del sistema: ${systemState} -> ${newAtmosphere}`);
  } else if (currentLens) {
    newAtmosphere = mapLensToAtmosphere(currentLens);
    uiLogger.debug(`Atmósfera determinada por lente cognitiva: ${currentLens} -> ${newAtmosphere}`);
  } else {
    newAtmosphere = ATMOSPHERE_THEMES.EXPLORATION;
    uiLogger.debug('Usando atmósfera por defecto');
  }
  
  setAtmosphere(newAtmosphere);
}

/**
 * Establece una atmósfera específica
 * @param {string} atmosphereTheme - Tema atmosférico
 */
export function setAtmosphere(atmosphereTheme) {
  if (!Object.values(ATMOSPHERE_THEMES).includes(atmosphereTheme)) {
    uiLogger.error(`Tema atmosférico inválido: ${atmosphereTheme}`);
    return;
  }
  
  const previousAtmosphere = currentAtmosphere;
  currentAtmosphere = atmosphereTheme;
  
  // Guardar en historial
  atmosphereHistory.push({
    theme: atmosphereTheme,
    timestamp: new Date().toISOString(),
    previous: previousAtmosphere
  });
  
  // Mantener solo últimas 10 entradas
  if (atmosphereHistory.length > 10) {
    atmosphereHistory = atmosphereHistory.slice(-10);
  }
  
  // Aplicar cambios visuales
  applyAtmosphereChanges(atmosphereTheme);
  
  uiLogger.info(`Atmósfera cambiada: ${previousAtmosphere} -> ${atmosphereTheme}`);
}

/**
 * Aplica los cambios visuales de la atmósfera
 * @param {string} atmosphereTheme - Tema atmosférico
 */
function applyAtmosphereChanges(atmosphereTheme) {
  const palette = COLOR_PALETTES[atmosphereTheme];
  const effects = ATMOSPHERE_EFFECTS[atmosphereTheme];
  
  if (palette) {
    applyCSSVariables(palette);
  }
  
  if (effects) {
    applyAtmosphereEffects(effects);
  }
  
  // Despachar evento global para componentes que lo necesiten
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('atmosphereChange', {
      detail: {
        theme: atmosphereTheme,
        palette,
        effects
      }
    }));
  }
}

// ================================
// GETTERS Y ESTADO
// ================================

/**
 * Obtiene la atmósfera activa actual
 * @returns {string} Tema atmosférico actual
 */
export function getActiveAtmosphere() {
  return currentAtmosphere;
}

/**
 * Obtiene la paleta de colores de la atmósfera actual
 * @returns {Object} Paleta de colores
 */
export function getCurrentPalette() {
  return COLOR_PALETTES[currentAtmosphere] || COLOR_PALETTES[ATMOSPHERE_THEMES.EXPLORATION];
}

/**
 * Obtiene los efectos de la atmósfera actual
 * @returns {Object} Efectos atmosféricos
 */
export function getCurrentEffects() {
  return ATMOSPHERE_EFFECTS[currentAtmosphere] || {};
}

/**
 * Obtiene el historial de cambios atmosféricos
 * @returns {Array} Historial de cambios
 */
export function getAtmosphereHistory() {
  return [...atmosphereHistory];
}

/**
 * Verifica si el manager está inicializado
 * @returns {boolean} Estado de inicialización
 */
export function isReady() {
  return isInitialized;
}

/**
 * Obtiene estadísticas del atmosphere manager
 * @returns {Object} Estadísticas
 */
export function getStats() {
  return {
    isInitialized,
    currentAtmosphere,
    totalThemes: Object.keys(ATMOSPHERE_THEMES).length,
    historyEntries: atmosphereHistory.length,
    availableThemes: Object.values(ATMOSPHERE_THEMES),
    timestamp: new Date().toISOString()
  };
}

// ================================
// UTILIDADES ADICIONALES
// ================================

/**
 * Establece atmósfera temporal (se revierte automáticamente)
 * @param {string} atmosphereTheme - Tema temporal
 * @param {number} duration - Duración en ms
 */
export function setTemporaryAtmosphere(atmosphereTheme, duration = 5000) {
  const originalAtmosphere = currentAtmosphere;
  
  setAtmosphere(atmosphereTheme);
  
  setTimeout(() => {
    setAtmosphere(originalAtmosphere);
    uiLogger.debug(`Atmósfera temporal revertida a: ${originalAtmosphere}`);
  }, duration);
  
  uiLogger.info(`Atmósfera temporal establecida: ${atmosphereTheme} por ${duration}ms`);
}

/**
 * Refresca la atmósfera basada en el estado actual del lens
 */
export function refreshAtmosphere() {
  uiLogger.debug('Refrescando atmósfera...');
  updateAtmosphereFromLens();
}

/**
 * Resetea la atmósfera a valores por defecto
 */
export function reset() {
  uiLogger.info('Reseteando AtmosphereManager...');
  
  currentAtmosphere = ATMOSPHERE_THEMES.EXPLORATION;
  atmosphereHistory = [];
  
  applyAtmosphereChanges(currentAtmosphere);
  
  uiLogger.info('AtmosphereManager reseteado correctamente');
}

// ================================
// EXPORTACIÓN POR DEFECTO
// ================================

export default {
  // Inicialización
  initialize,
  isReady,
  
  // Control de atmósfera
  updateAtmosphereFromLens,
  setAtmosphere,
  setTemporaryAtmosphere,
  refreshAtmosphere,
  reset,
  
  // Getters
  getActiveAtmosphere,
  getCurrentPalette,
  getCurrentEffects,
  getAtmosphereHistory,
  getStats,
  
  // Constantes
  ATMOSPHERE_THEMES
};