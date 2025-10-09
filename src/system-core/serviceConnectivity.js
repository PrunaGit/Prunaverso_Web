/**
 * @module serviceConnectivity
 * @description Módulo para verificar la conectividad con servicios externos.
 * Integra con serviceConfig para probar endpoints de manera asíncrona.
 * 
 * @author Pruna - Sistema Cognitivo Prunaverso
 * @version 2.1.0
 */

import serviceConfig from './serviceConfig.js';
import { uiLogger } from './logManager.js';

// ================================
// CONFIGURACIÓN DE CONECTIVIDAD
// ================================

/**
 * Configuración de timeouts para diferentes tipos de servicios
 */
const CONNECTIVITY_CONFIG = {
  timeout: {
    health: 3000,     // 3 segundos para health checks
    api: 5000,        // 5 segundos para API calls
    websocket: 2000   // 2 segundos para websockets
  },
  
  retries: {
    health: 2,
    api: 1,
    websocket: 1
  },
  
  intervals: {
    healthCheck: 10000  // 10 segundos entre health checks automáticos
  }
};

/**
 * Estados de conectividad
 */
export const CONNECTIVITY_STATUS = {
  UNKNOWN: 'unknown',
  CONNECTING: 'connecting',
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  ERROR: 'error'
};

// ================================
// ESTADO INTERNO
// ================================

let connectivityState = {
  characters: { status: CONNECTIVITY_STATUS.UNKNOWN, lastCheck: null, latency: null },
  api: { status: CONNECTIVITY_STATUS.UNKNOWN, lastCheck: null, latency: null },
  health: { status: CONNECTIVITY_STATUS.UNKNOWN, lastCheck: null, latency: null }
};

let healthCheckInterval = null;
let connectivityListeners = [];

// ================================
// FUNCIONES DE CONECTIVIDAD
// ================================

/**
 * Realiza una verificación de salud de un endpoint
 * @param {string} url - URL a verificar
 * @param {number} timeout - Timeout en millisegundos
 * @returns {Promise<Object>} Resultado de la verificación
 */
async function checkEndpoint(url, timeout = CONNECTIVITY_CONFIG.timeout.health) {
  const startTime = Date.now();
  
  try {
    uiLogger.logDebug('CONNECTIVITY', `Verificando endpoint: ${url}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    const latency = Date.now() - startTime;
    
    if (response.ok) {
      uiLogger.logDebug('CONNECTIVITY', `✅ Endpoint OK: ${url} (${latency}ms)`);
      return {
        status: CONNECTIVITY_STATUS.CONNECTED,
        latency,
        statusCode: response.status,
        timestamp: new Date().toISOString()
      };
    } else {
      uiLogger.logWarn('CONNECTIVITY', `⚠️ Endpoint responded with error: ${url} (${response.status})`);
      return {
        status: CONNECTIVITY_STATUS.ERROR,
        latency,
        statusCode: response.status,
        error: `HTTP ${response.status}`,
        timestamp: new Date().toISOString()
      };
    }
    
  } catch (error) {
    const latency = Date.now() - startTime;
    
    if (error.name === 'AbortError') {
      uiLogger.logWarn('CONNECTIVITY', `⏱️ Timeout verificando: ${url}`);
      return {
        status: CONNECTIVITY_STATUS.DISCONNECTED,
        latency,
        error: 'Timeout',
        timestamp: new Date().toISOString()
      };
    } else {
      uiLogger.logError('CONNECTIVITY', `❌ Error verificando ${url}:`, error);
      return {
        status: CONNECTIVITY_STATUS.ERROR,
        latency,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

/**
 * Verifica la conectividad del servicio de characters
 * @returns {Promise<Object>} Estado de conectividad
 */
export async function checkCharactersService() {
  const endpoints = serviceConfig.getEndpoints();
  const charactersUrl = `${endpoints.development.backend.characters.fullUrl}/api/characters`;
  
  connectivityState.characters = {
    ...connectivityState.characters,
    status: CONNECTIVITY_STATUS.CONNECTING
  };
  
  const result = await checkEndpoint(charactersUrl);
  
  connectivityState.characters = {
    ...result,
    lastCheck: result.timestamp,
    service: 'characters',
    url: charactersUrl
  };
  
  notifyConnectivityChange('characters', connectivityState.characters);
  return connectivityState.characters;
}

/**
 * Verifica la conectividad de la API general
 * @returns {Promise<Object>} Estado de conectividad
 */
export async function checkApiService() {
  const endpoints = serviceConfig.getEndpoints();
  const apiUrl = `${endpoints.development.backend.api.fullUrl}/ping`;
  
  connectivityState.api = {
    ...connectivityState.api,
    status: CONNECTIVITY_STATUS.CONNECTING
  };
  
  const result = await checkEndpoint(apiUrl);
  
  connectivityState.api = {
    ...result,
    lastCheck: result.timestamp,
    service: 'api',
    url: apiUrl
  };
  
  notifyConnectivityChange('api', connectivityState.api);
  return connectivityState.api;
}

/**
 * Verifica todos los servicios de manera concurrente
 * @returns {Promise<Object>} Estado de todos los servicios
 */
export async function checkAllServices() {
  uiLogger.logInfo('CONNECTIVITY', 'Verificando conectividad de todos los servicios...');
  
  try {
    const [charactersResult, apiResult] = await Promise.allSettled([
      checkCharactersService(),
      checkApiService()
    ]);
    
    const results = {
      characters: charactersResult.status === 'fulfilled' ? charactersResult.value : 
        { status: CONNECTIVITY_STATUS.ERROR, error: charactersResult.reason?.message },
      api: apiResult.status === 'fulfilled' ? apiResult.value :
        { status: CONNECTIVITY_STATUS.ERROR, error: apiResult.reason?.message },
      timestamp: new Date().toISOString()
    };
    
    uiLogger.logInfo('CONNECTIVITY', 'Verificación de servicios completada', results);
    return results;
    
  } catch (error) {
    uiLogger.logError('CONNECTIVITY', 'Error en verificación global de servicios:', error);
    return {
      characters: { status: CONNECTIVITY_STATUS.ERROR, error: error.message },
      api: { status: CONNECTIVITY_STATUS.ERROR, error: error.message },
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Inicia el monitoreo automático de servicios
 * @param {number} interval - Intervalo en millisegundos
 */
export function startHealthMonitoring(interval = CONNECTIVITY_CONFIG.intervals.healthCheck) {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
  
  uiLogger.logInfo('CONNECTIVITY', `Iniciando monitoreo de salud cada ${interval/1000} segundos`);
  
  healthCheckInterval = setInterval(async () => {
    await checkAllServices();
  }, interval);
  
  // Verificación inicial
  setTimeout(() => checkAllServices(), 1000);
}

/**
 * Detiene el monitoreo automático de servicios
 */
export function stopHealthMonitoring() {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
    healthCheckInterval = null;
    uiLogger.logInfo('CONNECTIVITY', 'Monitoreo de salud detenido');
  }
}

/**
 * Obtiene el estado actual de conectividad
 * @returns {Object} Estado de conectividad
 */
export function getConnectivityState() {
  return {
    ...connectivityState,
    isMonitoring: healthCheckInterval !== null,
    lastGlobalCheck: new Date().toISOString()
  };
}

/**
 * Notifica cambios de conectividad a los listeners
 * @param {string} service - Nombre del servicio
 * @param {Object} state - Nuevo estado
 */
function notifyConnectivityChange(service, state) {
  connectivityListeners.forEach(listener => {
    try {
      listener(service, state);
    } catch (error) {
      uiLogger.logError('CONNECTIVITY', 'Error en listener de conectividad:', error);
    }
  });
}

/**
 * Agrega un listener para cambios de conectividad
 * @param {Function} listener - Función listener
 * @returns {Function} Función para remover el listener
 */
export function addConnectivityListener(listener) {
  connectivityListeners.push(listener);
  
  return () => {
    const index = connectivityListeners.indexOf(listener);
    if (index !== -1) {
      connectivityListeners.splice(index, 1);
    }
  };
}

/**
 * Obtiene estadísticas de conectividad
 * @returns {Object} Estadísticas
 */
export function getConnectivityStats() {
  const services = Object.keys(connectivityState);
  const connected = services.filter(s => connectivityState[s].status === CONNECTIVITY_STATUS.CONNECTED).length;
  const errors = services.filter(s => connectivityState[s].status === CONNECTIVITY_STATUS.ERROR).length;
  
  return {
    totalServices: services.length,
    connected,
    errors,
    disconnected: services.length - connected - errors,
    overallHealth: connected / services.length,
    isMonitoring: healthCheckInterval !== null,
    listeners: connectivityListeners.length
  };
}

/**
 * Resetea el estado de conectividad
 */
export function resetConnectivityState() {
  uiLogger.logInfo('CONNECTIVITY', 'Reseteando estado de conectividad');
  
  Object.keys(connectivityState).forEach(service => {
    connectivityState[service] = {
      status: CONNECTIVITY_STATUS.UNKNOWN,
      lastCheck: null,
      latency: null
    };
  });
}

// ================================
// EXPORTACIÓN POR DEFECTO
// ================================

export default {
  // Verificación de servicios
  checkCharactersService,
  checkApiService,
  checkAllServices,
  
  // Monitoreo
  startHealthMonitoring,
  stopHealthMonitoring,
  
  // Estado
  getConnectivityState,
  getConnectivityStats,
  resetConnectivityState,
  
  // Listeners
  addConnectivityListener,
  
  // Constantes
  CONNECTIVITY_STATUS,
  CONNECTIVITY_CONFIG
};