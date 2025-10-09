/**
 * @module serviceConfig
 * @description Configuración centralizada de servicios y endpoints para el Prunaverso Web.
 * Maneja URLs de API, puertos, y configuraciones por ambiente (dev, staging, prod).
 * Mantiene la separación entre Core Logic y configuración de infraestructura.
 * 
 * @author Pruna - Sistema Cognitivo Prunaverso
 * @version 2.1.0
 */

// ================================
// CONFIGURACIÓN POR AMBIENTE
// ================================

/**
 * Ambientes disponibles
 */
export const ENVIRONMENTS = {
  DEVELOPMENT: 'development',
  STAGING: 'staging',
  PRODUCTION: 'production'
};

/**
 * Detecta el ambiente actual
 * @returns {string} Ambiente detectado
 */
function detectEnvironment() {
  // En desarrollo (localhost)
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    return ENVIRONMENTS.DEVELOPMENT;
  }
  
  // En GitHub Pages (producción)
  if (typeof window !== 'undefined' && window.location.hostname.includes('github.io')) {
    return ENVIRONMENTS.PRODUCTION;
  }
  
  // En staging (si tienes un dominio de staging)
  if (typeof window !== 'undefined' && window.location.hostname.includes('staging')) {
    return ENVIRONMENTS.STAGING;
  }
  
  // Por defecto, desarrollo
  return ENVIRONMENTS.DEVELOPMENT;
}

// ================================
// CONFIGURACIÓN DE SERVICIOS
// ================================

/**
 * Configuración de puertos y URLs por ambiente
 */
const SERVICE_CONFIG = {
  [ENVIRONMENTS.DEVELOPMENT]: {
    frontend: {
      protocol: 'http',
      host: 'localhost',
      port: 5179,
      basePath: '/Prunaverso_Web',
      fullUrl: 'http://localhost:5179/Prunaverso_Web'
    },
    backend: {
      characters: {
        protocol: 'http',
        host: 'localhost',
        port: 4001,
        basePath: '',
        fullUrl: 'http://localhost:4001'
      },
      api: {
        protocol: 'http',
        host: 'localhost',
        port: 4001,
        basePath: '/api',
        fullUrl: 'http://localhost:4001/api'
      }
    },
    static: {
      protocol: 'http',
      host: 'localhost',
      port: 8080,
      basePath: '',
      fullUrl: 'http://localhost:8080'
    }
  },
  
  [ENVIRONMENTS.STAGING]: {
    frontend: {
      protocol: 'https',
      host: 'staging.prunaverso.com',
      port: null,
      basePath: '',
      fullUrl: 'https://staging.prunaverso.com'
    },
    backend: {
      characters: {
        protocol: 'https',
        host: 'api-staging.prunaverso.com',
        port: null,
        basePath: '',
        fullUrl: 'https://api-staging.prunaverso.com'
      },
      api: {
        protocol: 'https',
        host: 'api-staging.prunaverso.com',
        port: null,
        basePath: '/api',
        fullUrl: 'https://api-staging.prunaverso.com/api'
      }
    }
  },
  
  [ENVIRONMENTS.PRODUCTION]: {
    frontend: {
      protocol: 'https',
      host: 'prunagit.github.io',
      port: null,
      basePath: '/Prunaverso_Web',
      fullUrl: 'https://prunagit.github.io/Prunaverso_Web'
    },
    backend: {
      characters: {
        protocol: 'https',
        host: 'api.prunaverso.com', // O tu API de producción
        port: null,
        basePath: '',
        fullUrl: 'https://api.prunaverso.com'
      },
      api: {
        protocol: 'https',
        host: 'api.prunaverso.com',
        port: null,
        basePath: '/api',
        fullUrl: 'https://api.prunaverso.com/api'
      }
    }
  }
};

// ================================
// ESTADO Y VARIABLES INTERNAS
// ================================

let currentEnvironment = detectEnvironment();
let currentConfig = SERVICE_CONFIG[currentEnvironment];

// ================================
// FUNCIONES PÚBLICAS
// ================================

/**
 * Obtiene el ambiente actual
 * @returns {string} Ambiente actual
 */
export function getCurrentEnvironment() {
  return currentEnvironment;
}

/**
 * Obtiene la configuración completa del ambiente actual
 * @returns {Object} Configuración actual
 */
export function getCurrentConfig() {
  return { ...currentConfig };
}

/**
 * Obtiene la URL del frontend
 * @returns {string} URL del frontend
 */
export function getFrontendUrl() {
  return currentConfig.frontend.fullUrl;
}

/**
 * Obtiene la URL del backend de characters
 * @returns {string} URL del backend de characters
 */
export function getCharactersApiUrl() {
  return currentConfig.backend.characters.fullUrl;
}

/**
 * Obtiene la URL base de la API
 * @returns {string} URL base de la API
 */
export function getApiBaseUrl() {
  return currentConfig.backend.api.fullUrl;
}

/**
 * Obtiene la URL del servidor estático
 * @returns {string} URL del servidor estático (si existe)
 */
export function getStaticServerUrl() {
  return currentConfig.static?.fullUrl || getFrontendUrl();
}

/**
 * Construye una URL completa para un endpoint específico
 * @param {string} service - Servicio (characters, api)
 * @param {string} endpoint - Endpoint específico
 * @returns {string} URL completa
 */
export function buildServiceUrl(service, endpoint = '') {
  const baseUrl = service === 'characters' 
    ? getCharactersApiUrl() 
    : getApiBaseUrl();
  
  // Asegurar que el endpoint empiece con /
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  return `${baseUrl}${cleanEndpoint}`;
}

/**
 * Construye URLs para recursos estáticos
 * @param {string} resourcePath - Ruta del recurso
 * @returns {string} URL completa del recurso
 */
export function buildAssetUrl(resourcePath) {
  const basePath = currentConfig.frontend.basePath;
  const cleanPath = resourcePath.startsWith('/') ? resourcePath : `/${resourcePath}`;
  
  return `${basePath}${cleanPath}`;
}

/**
 * Verifica si un servicio está disponible
 * @param {string} service - Servicio a verificar
 * @returns {Promise<boolean>} Si el servicio está disponible
 */
export async function isServiceAvailable(service) {
  try {
    const url = service === 'characters' ? getCharactersApiUrl() : getApiBaseUrl();
    
    // Hacer una petición HEAD o GET simple
    const response = await fetch(`${url}/health`, { 
      method: 'GET',
      timeout: 5000 
    });
    
    return response.ok;
  } catch (error) {
    console.warn(`Service ${service} not available:`, error.message);
    return false;
  }
}

/**
 * Cambia el ambiente manualmente (para testing)
 * @param {string} environment - Nuevo ambiente
 */
export function setEnvironment(environment) {
  if (Object.values(ENVIRONMENTS).includes(environment)) {
    currentEnvironment = environment;
    currentConfig = SERVICE_CONFIG[environment];
    console.log(`Environment changed to: ${environment}`);
  } else {
    console.error(`Invalid environment: ${environment}`);
  }
}

/**
 * Obtiene información de debugging del servicio
 * @returns {Object} Información de debugging
 */
export function getDebugInfo() {
  return {
    environment: currentEnvironment,
    frontend: currentConfig.frontend,
    backend: currentConfig.backend,
    detectedHostname: typeof window !== 'undefined' ? window.location.hostname : 'server-side',
    detectedProtocol: typeof window !== 'undefined' ? window.location.protocol : 'unknown'
  };
}

// ================================
// ENDPOINTS ESPECÍFICOS
// ================================

/**
 * Endpoints comunes del sistema
 */
export const ENDPOINTS = {
  // Characters API
  CHARACTERS: {
    LIST: '/characters',
    DETAIL: '/characters/:id',
    SEARCH: '/characters/search',
    CREATE: '/characters/create'
  },
  
  // System API
  SYSTEM: {
    HEALTH: '/health',
    STATUS: '/status',
    DIAGNOSTICS: '/diagnostics'
  },
  
  // Profile API
  PROFILE: {
    GET: '/profile',
    UPDATE: '/profile/update',
    RESET: '/profile/reset'
  },
  
  // Checkpoints
  CHECKPOINTS: {
    SAVE: '/checkpoints/save',
    LOAD: '/checkpoints/load',
    LIST: '/checkpoints/list'
  }
};

// ================================
// EXPORTACIÓN POR DEFECTO
// ================================

export default {
  // Environment
  getCurrentEnvironment,
  getCurrentConfig,
  setEnvironment,
  ENVIRONMENTS,
  
  // URLs
  getFrontendUrl,
  getCharactersApiUrl,
  getApiBaseUrl,
  getStaticServerUrl,
  buildServiceUrl,
  buildAssetUrl,
  
  // Health
  isServiceAvailable,
  getDebugInfo,
  
  // Constants
  ENDPOINTS
};