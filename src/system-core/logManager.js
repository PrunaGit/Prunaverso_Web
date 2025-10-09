/**
 * @module logManager
 * @description Sistema centralizado de logging para el Prunaverso Web.
 * Centraliza toda la lógica de registro, debugging y monitoreo del sistema.
 * Mantiene la separación entre Core Logic y React Presentation Layer.
 * 
 * @author Pruna - Sistema Cognitivo Prunaverso
 * @version 2.1.0
 */

// ================================
// CONFIGURACIÓN Y CONSTANTES
// ================================

/**
 * Niveles de logging disponibles
 */
export const LOG_LEVELS = {
  ERROR: 0,
  WARN: 1,
  INFO: 2,
  DEBUG: 3,
  TRACE: 4
};

/**
 * Categorías de sistema para logging
 */
export const LOG_CATEGORIES = {
  SYSTEM: 'SYSTEM',
  PROFILE: 'PROFILE',
  LENS: 'LENS',
  UI: 'UI',
  API: 'API',
  PERFORMANCE: 'PERFORMANCE',
  COGNITIVE: 'COGNITIVE',
  DEBUG: 'DEBUG'
};

/**
 * Configuración del logger
 */
const DEFAULT_CONFIG = {
  level: LOG_LEVELS.INFO,
  enableConsole: true,
  enableStorage: false,
  maxStorageEntries: 1000,
  prefix: '🧠 PRUNAVERSO',
  timestamp: true,
  colors: {
    ERROR: '🔴',
    WARN: '🟡',
    INFO: '🔵',
    DEBUG: '🟣',
    TRACE: '⚪'
  }
};

// ================================
// ESTADO INTERNO
// ================================

let loggerConfig = { ...DEFAULT_CONFIG };
let logHistory = [];
let isInitialized = false;

// ================================
// UTILIDADES INTERNAS
// ================================

/**
 * Formatea timestamp para logging
 * @returns {string} Timestamp formateado
 */
function formatTimestamp() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

/**
 * Genera el prefijo completo del log
 * @param {string} level - Nivel del log
 * @param {string} category - Categoría del log
 * @returns {string} Prefijo formateado
 */
function generatePrefix(level, category) {
  const levelIcon = loggerConfig.colors[level] || '⚫';
  const timestamp = loggerConfig.timestamp ? `[${formatTimestamp()}]` : '';
  return `${levelIcon} ${loggerConfig.prefix} ${timestamp} [${category}]`;
}

/**
 * Verifica si el nivel debe ser loggeado
 * @param {number} level - Nivel a verificar
 * @returns {boolean} Si debe loggearse
 */
function shouldLog(level) {
  return level <= loggerConfig.level;
}

/**
 * Almacena log en el historial
 * @param {string} level - Nivel del log
 * @param {string} category - Categoría
 * @param {Array} args - Argumentos del log
 */
function storeLog(level, category, args) {
  if (!loggerConfig.enableStorage) return;
  
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    category,
    message: args.map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' ')
  };
  
  logHistory.push(entry);
  
  // Mantener límite de entradas
  if (logHistory.length > loggerConfig.maxStorageEntries) {
    logHistory = logHistory.slice(-loggerConfig.maxStorageEntries);
  }
}

// ================================
// FUNCIONES DE LOGGING CORE
// ================================

/**
 * Log de error (nivel más alto)
 * @param {string} category - Categoría del log
 * @param {...any} args - Argumentos a loggear
 */
export function logError(category, ...args) {
  if (!shouldLog(LOG_LEVELS.ERROR)) return;
  
  const prefix = generatePrefix('ERROR', category);
  
  if (loggerConfig.enableConsole) {
    console.error(prefix, ...args);
  }
  
  storeLog('ERROR', category, args);
}

/**
 * Log de warning
 * @param {string} category - Categoría del log
 * @param {...any} args - Argumentos a loggear
 */
export function logWarn(category, ...args) {
  if (!shouldLog(LOG_LEVELS.WARN)) return;
  
  const prefix = generatePrefix('WARN', category);
  
  if (loggerConfig.enableConsole) {
    console.warn(prefix, ...args);
  }
  
  storeLog('WARN', category, args);
}

/**
 * Log de información (nivel por defecto)
 * @param {string} category - Categoría del log
 * @param {...any} args - Argumentos a loggear
 */
export function logInfo(category, ...args) {
  if (!shouldLog(LOG_LEVELS.INFO)) return;
  
  const prefix = generatePrefix('INFO', category);
  
  if (loggerConfig.enableConsole) {
    console.log(prefix, ...args);
  }
  
  storeLog('INFO', category, args);
}

/**
 * Log de debug
 * @param {string} category - Categoría del log
 * @param {...any} args - Argumentos a loggear
 */
export function logDebug(category, ...args) {
  if (!shouldLog(LOG_LEVELS.DEBUG)) return;
  
  const prefix = generatePrefix('DEBUG', category);
  
  if (loggerConfig.enableConsole) {
    console.log(prefix, ...args);
  }
  
  storeLog('DEBUG', category, args);
}

/**
 * Log de trace (nivel más bajo)
 * @param {string} category - Categoría del log
 * @param {...any} args - Argumentos a loggear
 */
export function logTrace(category, ...args) {
  if (!shouldLog(LOG_LEVELS.TRACE)) return;
  
  const prefix = generatePrefix('TRACE', category);
  
  if (loggerConfig.enableConsole) {
    console.log(prefix, ...args);
  }
  
  storeLog('TRACE', category, args);
}

// ================================
// FUNCIONES DE GESTIÓN
// ================================

/**
 * Inicializa el sistema de logging
 * @param {Object} customConfig - Configuración personalizada
 */
export function initializeLogger(customConfig = {}) {
  if (isInitialized) {
    logWarn(LOG_CATEGORIES.SYSTEM, 'Logger ya inicializado, ignorando reinicialización');
    return;
  }
  
  // Merge de configuración
  loggerConfig = { ...DEFAULT_CONFIG, ...customConfig };
  
  // Limpiar historial
  logHistory = [];
  
  isInitialized = true;
  
  logInfo(LOG_CATEGORIES.SYSTEM, 'LogManager inicializado correctamente');
  logDebug(LOG_CATEGORIES.SYSTEM, 'Configuración:', loggerConfig);
}

/**
 * Actualiza la configuración del logger
 * @param {Object} newConfig - Nueva configuración
 */
export function updateLoggerConfig(newConfig) {
  const previousConfig = { ...loggerConfig };
  loggerConfig = { ...loggerConfig, ...newConfig };
  
  logInfo(LOG_CATEGORIES.SYSTEM, 'Configuración de logger actualizada');
  logDebug(LOG_CATEGORIES.DEBUG, 'Configuración anterior:', previousConfig);
  logDebug(LOG_CATEGORIES.DEBUG, 'Nueva configuración:', loggerConfig);
}

/**
 * Obtiene el historial de logs
 * @param {string} filterCategory - Categoría para filtrar (opcional)
 * @param {string} filterLevel - Nivel para filtrar (opcional)
 * @returns {Array} Array de entradas de log
 */
export function getLogHistory(filterCategory = null, filterLevel = null) {
  let filtered = [...logHistory];
  
  if (filterCategory) {
    filtered = filtered.filter(entry => entry.category === filterCategory);
  }
  
  if (filterLevel) {
    filtered = filtered.filter(entry => entry.level === filterLevel);
  }
  
  return filtered;
}

/**
 * Limpia el historial de logs
 */
export function clearLogHistory() {
  const previousCount = logHistory.length;
  logHistory = [];
  logInfo(LOG_CATEGORIES.SYSTEM, `Historial de logs limpiado (${previousCount} entradas eliminadas)`);
}

/**
 * Exporta logs como JSON
 * @returns {string} Logs en formato JSON
 */
export function exportLogs() {
  const exportData = {
    timestamp: new Date().toISOString(),
    config: loggerConfig,
    logs: logHistory,
    summary: {
      totalEntries: logHistory.length,
      categories: [...new Set(logHistory.map(l => l.category))],
      levels: [...new Set(logHistory.map(l => l.level))]
    }
  };
  
  logInfo(LOG_CATEGORIES.SYSTEM, `Logs exportados (${logHistory.length} entradas)`);
  return JSON.stringify(exportData, null, 2);
}

// ================================
// FUNCIONES DE ESTADO
// ================================

/**
 * Verifica si el logger está inicializado
 * @returns {boolean} Estado de inicialización
 */
export function isLoggerReady() {
  return isInitialized;
}

/**
 * Obtiene la configuración actual
 * @returns {Object} Configuración actual
 */
export function getLoggerConfig() {
  return { ...loggerConfig };
}

/**
 * Obtiene estadísticas del logger
 * @returns {Object} Estadísticas
 */
export function getLoggerStats() {
  const categoryCounts = {};
  const levelCounts = {};
  
  logHistory.forEach(entry => {
    categoryCounts[entry.category] = (categoryCounts[entry.category] || 0) + 1;
    levelCounts[entry.level] = (levelCounts[entry.level] || 0) + 1;
  });
  
  return {
    totalEntries: logHistory.length,
    isInitialized,
    config: loggerConfig,
    categoryCounts,
    levelCounts,
    oldestEntry: logHistory[0]?.timestamp,
    newestEntry: logHistory[logHistory.length - 1]?.timestamp
  };
}

// ================================
// HELPERS ESPECÍFICOS DEL SISTEMA
// ================================

/**
 * Log específico para el sistema de perfiles
 * @param {string} level - Nivel del log
 * @param {...any} args - Argumentos
 */
export const profileLogger = {
  error: (...args) => logError(LOG_CATEGORIES.PROFILE, ...args),
  warn: (...args) => logWarn(LOG_CATEGORIES.PROFILE, ...args),
  info: (...args) => logInfo(LOG_CATEGORIES.PROFILE, ...args),
  debug: (...args) => logDebug(LOG_CATEGORIES.PROFILE, ...args),
  trace: (...args) => logTrace(LOG_CATEGORIES.PROFILE, ...args)
};

/**
 * Log específico para el sistema de lentes
 * @param {string} level - Nivel del log
 * @param {...any} args - Argumentos
 */
export const lensLogger = {
  error: (...args) => logError(LOG_CATEGORIES.LENS, ...args),
  warn: (...args) => logWarn(LOG_CATEGORIES.LENS, ...args),
  info: (...args) => logInfo(LOG_CATEGORIES.LENS, ...args),
  debug: (...args) => logDebug(LOG_CATEGORIES.LENS, ...args),
  trace: (...args) => logTrace(LOG_CATEGORIES.LENS, ...args)
};

/**
 * Log específico para el sistema UI
 * @param {string} level - Nivel del log
 * @param {...any} args - Argumentos
 */
export const uiLogger = {
  error: (...args) => logError(LOG_CATEGORIES.UI, ...args),
  warn: (...args) => logWarn(LOG_CATEGORIES.UI, ...args),
  info: (...args) => logInfo(LOG_CATEGORIES.UI, ...args),
  debug: (...args) => logDebug(LOG_CATEGORIES.UI, ...args),
  trace: (...args) => logTrace(LOG_CATEGORIES.UI, ...args)
};

/**
 * Log específico para performance
 * @param {string} level - Nivel del log
 * @param {...any} args - Argumentos
 */
export const performanceLogger = {
  error: (...args) => logError(LOG_CATEGORIES.PERFORMANCE, ...args),
  warn: (...args) => logWarn(LOG_CATEGORIES.PERFORMANCE, ...args),
  info: (...args) => logInfo(LOG_CATEGORIES.PERFORMANCE, ...args),
  debug: (...args) => logDebug(LOG_CATEGORIES.PERFORMANCE, ...args),
  trace: (...args) => logTrace(LOG_CATEGORIES.PERFORMANCE, ...args)
};

// ================================
// EXPORTACIÓN POR DEFECTO
// ================================

export default {
  // Inicialización
  initializeLogger,
  isLoggerReady,
  
  // Configuración
  updateLoggerConfig,
  getLoggerConfig,
  
  // Logging principal
  logError,
  logWarn,
  logInfo,
  logDebug,
  logTrace,
  
  // Gestión de historial
  getLogHistory,
  clearLogHistory,
  exportLogs,
  
  // Estadísticas
  getLoggerStats,
  
  // Helpers específicos
  profileLogger,
  lensLogger,
  uiLogger,
  performanceLogger,
  
  // Constantes
  LOG_LEVELS,
  LOG_CATEGORIES
};