/**
 * @hook usePrunaLogger
 * @description Wrapper del sistema core de Log Manager.
 * Expone la interfaz de logging para la capa de presentación (React).
 * Mantiene el patrón de separación Lógica Core vs Presentación React.
 * 
 * @author Pruna - Sistema Cognitivo Prunaverso  
 * @version 2.1.0
 */

import { useEffect, useCallback } from 'react';
import logManager, { 
  LOG_LEVELS, 
  LOG_CATEGORIES,
  profileLogger,
  lensLogger,
  uiLogger,
  performanceLogger
} from '../system-core/logManager';

/**
 * Hook de React para sistema de logging centralizado
 * @param {Object} config - Configuración opcional del logger
 * @returns {Object} Interface de logging para React
 */
const usePrunaLogger = (config = {}) => {
  // Inicialización del hook: el core maneja el estado internamente
  // React solo se suscribe y expone la interface de logging.
  
  useEffect(() => {
    // Se ejecuta una sola vez al montar para asegurar la inicialización
    // del Logger Manager si no se ha hecho.
    if (!logManager.isLoggerReady()) {
      logManager.initializeLogger(config);
    }
  }, [config]);

  // Funciones de logging principales envueltas para React
  const log = useCallback({
    error: (category, ...args) => logManager.logError(category, ...args),
    warn: (category, ...args) => logManager.logWarn(category, ...args),  
    info: (category, ...args) => logManager.logInfo(category, ...args),
    debug: (category, ...args) => logManager.logDebug(category, ...args),
    trace: (category, ...args) => logManager.logTrace(category, ...args)
  }, []);

  // Helpers específicos del sistema
  const systemLoggers = useCallback({
    profile: profileLogger,
    lens: lensLogger,
    ui: uiLogger,
    performance: performanceLogger
  }, []);

  // Funciones de gestión del logger
  const management = useCallback({
    getHistory: logManager.getLogHistory,
    clearHistory: logManager.clearLogHistory,
    exportLogs: logManager.exportLogs,
    getStats: logManager.getLoggerStats,
    updateConfig: logManager.updateLoggerConfig,
    getConfig: logManager.getLoggerConfig
  }, []);

  // Performance helpers específicos para React
  const performance = useCallback({
    /**
     * Mide tiempo de render de componente
     * @param {string} componentName - Nombre del componente
     * @param {Function} renderFunction - Función a medir
     */
    measureRender: (componentName, renderFunction) => {
      const startTime = performance.now();
      const result = renderFunction();
      const endTime = performance.now();
      
      performanceLogger.debug(
        `Render time for ${componentName}: ${(endTime - startTime).toFixed(2)}ms`
      );
      
      return result;
    },

    /**
     * Registra mounted/unmounted de componente
     * @param {string} componentName - Nombre del componente
     * @param {boolean} mounted - Si está montado
     */
    logMount: (componentName, mounted) => {
      const action = mounted ? 'MOUNTED' : 'UNMOUNTED';
      uiLogger.debug(`Component ${componentName} ${action}`);
    },

    /**
     * Registra error de React
     * @param {Error} error - Error capturado
     * @param {string} componentName - Nombre del componente
     */
    logReactError: (error, componentName) => {
      uiLogger.error(`React Error in ${componentName}:`, error.message, error.stack);
    }
  }, []);

  // El hook de React simplemente expone los métodos y el estado
  // gestionado por el sistema core (logManager).
  return {
    // Estado del logger
    isReady: logManager.isLoggerReady(),
    
    // Funciones principales de logging
    log,
    
    // Helpers específicos del sistema
    system: systemLoggers,
    
    // Gestión del logger
    management,
    
    // Helpers de performance para React
    performance,
    
    // Constantes
    levels: LOG_LEVELS,
    categories: LOG_CATEGORIES,
    
    // Shortcuts para uso frecuente
    logError: (category, ...args) => log.error(category, ...args),
    logWarn: (category, ...args) => log.warn(category, ...args),
    logInfo: (category, ...args) => log.info(category, ...args),
    logDebug: (category, ...args) => log.debug(category, ...args),
    logTrace: (category, ...args) => log.trace(category, ...args)
  };
};

export default usePrunaLogger;