/**
 * @module routerManager
 * @description Sistema centralizado de gestión de rutas para el Prunaverso Web.
 * Centraliza la configuración de rutas, navegación y gestión de estado de URL.
 * Integra con el atmosphereManager para aplicar temas por ruta.
 * Mantiene la separación entre Core Logic y Navigation Logic.
 * 
 * @author Pruna - Sistema Cognitivo Prunaverso
 * @version 2.1.0
 */

import { uiLogger } from './logManager.js';
import atmosphereManager from './atmosphereManager.js';
import serviceConfig from './serviceConfig.js';

// ================================
// CONFIGURACIÓN Y CONSTANTES
// ================================

/**
 * Definición de rutas del sistema
 */
export const ROUTES = {
  // Rutas principales
  HOME: {
    path: '/',
    name: 'Home',
    title: 'Prunaverso - Portal Cognitivo',
    atmosphere: 'atmosphere-exploration',
    requiresAuth: false,
    meta: {
      description: 'Portal principal del sistema cognitivo Prunaverso',
      keywords: 'prunaverso, cognitivo, portal, bienvenida'
    }
  },

  // Portal y navegación principal  
  PORTAL: {
    path: '/portal',
    name: 'Portal',
    title: 'Portal Cognitivo - Prunaverso',
    atmosphere: 'atmosphere-systemic',
    requiresAuth: false,
    meta: {
      description: 'Portal principal de navegación del Prunaverso',
      keywords: 'portal, navegación, sistema'
    }
  },

  AWAKENING: {
    path: '/awakening',
    name: 'Awakening',
    title: 'Despertar Cognitivo - Prunaverso',
    atmosphere: 'atmosphere-transcendent',
    requiresAuth: false,
    meta: {
      description: 'Proceso de despertar y onboarding cognitivo',
      keywords: 'despertar, onboarding, inicio'
    }
  },

  // Selección y gestión de arquetipos
  SELECTOR: {
    path: '/selector',
    name: 'Selector',
    title: 'Selector de Arquetipos - Prunaverso',
    atmosphere: 'atmosphere-creative',
    requiresAuth: false,
    meta: {
      description: 'Selección y configuración de arquetipos RPG',
      keywords: 'arquetipos, rpg, personajes, selector'
    }
  },

  CHARACTER_DETAIL: {
    path: '/character/:id',
    name: 'CharacterDetail',
    title: 'Detalle del Arquetipo - Prunaverso',
    atmosphere: 'atmosphere-emotional',
    requiresAuth: false,
    meta: {
      description: 'Detalle y configuración de arquetipo específico',
      keywords: 'arquetipo, detalle, configuración'
    }
  },

  // Sistemas de diagnóstico y monitoreo
  DIAGNOSTICS: {
    path: '/diagnostics',
    name: 'Diagnostics',
    title: 'Diagnóstico del Sistema - Prunaverso',
    atmosphere: 'atmosphere-analytical',
    requiresAuth: false,
    meta: {
      description: 'Diagnóstico y monitoreo del sistema',
      keywords: 'diagnóstico, sistema, monitoreo'
    }
  },

  MONITOR: {
    path: '/monitor',
    name: 'Monitor',
    title: 'Monitor del Sistema - Prunaverso',
    atmosphere: 'atmosphere-analytical',
    requiresAuth: false,
    meta: {
      description: 'Panel de monitoreo en tiempo real',
      keywords: 'monitor, tiempo real, sistema'
    }
  },

  // Experiencias interactivas
  ATMOSPHERE: {
    path: '/atmosphere',
    name: 'Atmosphere',
    title: 'Experiencia Atmosférica - Prunaverso',
    atmosphere: 'atmosphere-emotional',
    requiresAuth: false,
    meta: {
      description: 'Experiencia atmosférica inmersiva',
      keywords: 'atmósfera, experiencia, inmersiva'
    }
  },

  // Configuración y ajustes
  SETTINGS: {
    path: '/settings',
    name: 'Settings',
    title: 'Configuración - Prunaverso',
    atmosphere: 'atmosphere-systemic',
    requiresAuth: false,
    meta: {
      description: 'Configuración del sistema y preferencias',
      keywords: 'configuración, ajustes, preferencias'
    }
  },

  // Admin y desarrollo
  ADMIN: {
    path: '/admin',
    name: 'Admin',
    title: 'Panel de Administración - Prunaverso',
    atmosphere: 'atmosphere-admin',
    requiresAuth: true,
    meta: {
      description: 'Panel de administración del sistema',
      keywords: 'admin, administración, desarrollo'
    }
  },

  // Rutas de error
  NOT_FOUND: {
    path: '/404',
    name: 'NotFound',
    title: 'Página no encontrada - Prunaverso',
    atmosphere: 'atmosphere-error',
    requiresAuth: false,
    meta: {
      description: 'Página no encontrada',
      keywords: '404, error, no encontrado'
    }
  }
};

/**
 * Grupos de rutas por categoría
 */
export const ROUTE_GROUPS = {
  MAIN: ['HOME', 'PORTAL', 'AWAKENING'],
  INTERACTION: ['SELECTOR', 'CHARACTER_DETAIL', 'ATMOSPHERE'],
  SYSTEM: ['DIAGNOSTICS', 'MONITOR', 'SETTINGS'],
  ADMIN: ['ADMIN'],
  ERROR: ['NOT_FOUND']
};

/**
 * Configuración de navegación
 */
const NAVIGATION_CONFIG = {
  // Configuración de historial
  historyType: 'browser', // 'browser', 'hash', 'memory'
  
  // Transiciones
  enableTransitions: true,
  transitionDuration: 300,
  
  // Scroll behavior
  scrollToTop: true,
  scrollBehavior: 'smooth',
  
  // Meta tags
  updateDocumentTitle: true,
  updateMetaTags: true,
  
  // Analytics y tracking
  enableTracking: false,
  trackPageViews: true
};

// ================================
// ESTADO INTERNO
// ================================

let currentRoute = null;
let navigationHistory = [];
let isInitialized = false;
let routeChangeListeners = [];

// ================================
// UTILIDADES INTERNAS
// ================================

/**
 * Normaliza una ruta para comparación
 * @param {string} path - Ruta a normalizar
 * @returns {string} Ruta normalizada
 */
function normalizePath(path) {
  return path.replace(/\/+/g, '/').replace(/\/$/, '') || '/';
}

/**
 * Extrae parámetros de una ruta dinámica
 * @param {string} pattern - Patrón de ruta (ej: /user/:id)
 * @param {string} path - Ruta actual (ej: /user/123)
 * @returns {Object} Parámetros extraídos
 */
function extractParams(pattern, path) {
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');
  const params = {};
  
  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    if (patternPart.startsWith(':')) {
      const paramName = patternPart.slice(1);
      params[paramName] = pathParts[i];
    }
  }
  
  return params;
}

/**
 * Verifica si una ruta coincide con un patrón
 * @param {string} pattern - Patrón de ruta
 * @param {string} path - Ruta a verificar
 * @returns {boolean} Si coincide
 */
function matchesPattern(pattern, path) {
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');
  
  if (patternParts.length !== pathParts.length) {
    return false;
  }
  
  return patternParts.every((part, i) => {
    return part.startsWith(':') || part === pathParts[i];
  });
}

/**
 * Encuentra la definición de ruta para un path
 * @param {string} path - Path a buscar
 * @returns {Object|null} Definición de ruta encontrada
 */
function findRouteByPath(path) {
  const normalizedPath = normalizePath(path);
  
  // Buscar coincidencia exacta primero
  for (const [key, route] of Object.entries(ROUTES)) {
    if (route.path === normalizedPath) {
      return { key, ...route };
    }
  }
  
  // Buscar coincidencia con parámetros
  for (const [key, route] of Object.entries(ROUTES)) {
    if (matchesPattern(route.path, normalizedPath)) {
      return { 
        key, 
        ...route, 
        params: extractParams(route.path, normalizedPath)
      };
    }
  }
  
  return null;
}

/**
 * Actualiza meta tags del documento
 * @param {Object} route - Definición de ruta
 */
function updateDocumentMeta(route) {
  if (typeof document === 'undefined') return; // Server-side safety
  
  if (NAVIGATION_CONFIG.updateDocumentTitle) {
    document.title = route.title;
  }
  
  if (NAVIGATION_CONFIG.updateMetaTags && route.meta) {
    // Actualizar description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', route.meta.description);
    
    // Actualizar keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', route.meta.keywords);
  }
}

/**
 * Maneja el scroll en cambio de ruta
 */
function handleScrollBehavior() {
  if (typeof window === 'undefined') return; // Server-side safety
  
  if (NAVIGATION_CONFIG.scrollToTop) {
    if (NAVIGATION_CONFIG.scrollBehavior === 'smooth') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo(0, 0);
    }
  }
}

// ================================
// FUNCIONES CORE DEL ROUTER MANAGER
// ================================

/**
 * Inicializa el sistema de rutas
 */
export function initialize() {
  if (isInitialized) {
    uiLogger.warn('RouterManager ya inicializado, ignorando reinicialización');
    return;
  }
  
  uiLogger.info('Inicializando RouterManager...');
  
  // Detectar ruta inicial
  const initialPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  navigateToPath(initialPath, { replace: true, silent: true });
  
  // Configurar listener de popstate para navegación del navegador
  if (typeof window !== 'undefined') {
    window.addEventListener('popstate', handlePopState);
  }
  
  isInitialized = true;
  uiLogger.info('RouterManager inicializado correctamente');
}

/**
 * Navega a una ruta específica
 * @param {string} path - Ruta de destino
 * @param {Object} options - Opciones de navegación
 */
export function navigateToPath(path, options = {}) {
  const {
    replace = false,
    silent = false,
    state = null
  } = options;
  
  const normalizedPath = normalizePath(path);
  const route = findRouteByPath(normalizedPath);
  
  if (!route) {
    uiLogger.warn(`Ruta no encontrada: ${normalizedPath}, redirigiendo a 404`);
    navigateToPath('/404', { replace: true });
    return;
  }
  
  // Verificar autenticación si es requerida
  if (route.requiresAuth) {
    // TODO: Implementar verificación de autenticación
    uiLogger.debug('Ruta requiere autenticación:', route.name);
  }
  
  const previousRoute = currentRoute;
  currentRoute = route;
  
  // Actualizar historial de navegación
  const historyEntry = {
    route: route,
    timestamp: new Date().toISOString(),
    referrer: previousRoute?.name || null
  };
  
  navigationHistory.push(historyEntry);
  
  // Mantener solo últimas 50 entradas
  if (navigationHistory.length > 50) {
    navigationHistory = navigationHistory.slice(-50);
  }
  
  // Actualizar URL del navegador
  if (typeof window !== 'undefined' && !silent) {
    const url = serviceConfig.buildAssetUrl(normalizedPath);
    if (replace) {
      window.history.replaceState(state, '', url);
    } else {
      window.history.pushState(state, '', url);
    }
  }
  
  // Aplicar atmósfera de la ruta
  if (route.atmosphere) {
    atmosphereManager.setAtmosphere(route.atmosphere);
  }
  
  // Actualizar meta tags
  updateDocumentMeta(route);
  
  // Manejar scroll
  if (!silent) {
    handleScrollBehavior();
  }
  
  // Notificar a listeners
  notifyRouteChange(route, previousRoute);
  
  uiLogger.info(`Navegación completada: ${previousRoute?.name || 'inicial'} -> ${route.name}`);
}

/**
 * Navega a una ruta por nombre
 * @param {string} routeName - Nombre de la ruta
 * @param {Object} params - Parámetros para la ruta
 * @param {Object} options - Opciones de navegación
 */
export function navigateToRoute(routeName, params = {}, options = {}) {
  const route = ROUTES[routeName];
  
  if (!route) {
    uiLogger.error(`Ruta no encontrada: ${routeName}`);
    return;
  }
  
  let path = route.path;
  
  // Reemplazar parámetros en la ruta
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  
  navigateToPath(path, options);
}

/**
 * Maneja el evento popstate del navegador
 * @param {PopStateEvent} event - Evento popstate
 */
function handlePopState(event) {
  const path = window.location.pathname;
  navigateToPath(path, { silent: true });
}

/**
 * Notifica cambio de ruta a los listeners
 * @param {Object} newRoute - Nueva ruta
 * @param {Object} previousRoute - Ruta anterior
 */
function notifyRouteChange(newRoute, previousRoute) {
  routeChangeListeners.forEach(listener => {
    try {
      listener(newRoute, previousRoute);
    } catch (error) {
      uiLogger.error('Error en listener de cambio de ruta:', error);
    }
  });
  
  // Despachar evento global
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('routeChange', {
      detail: { newRoute, previousRoute }
    }));
  }
}

// ================================
// GESTIÓN DE LISTENERS Y ESTADO
// ================================

/**
 * Agrega un listener para cambios de ruta
 * @param {Function} listener - Función listener
 * @returns {Function} Función para remover el listener
 */
export function addRouteChangeListener(listener) {
  routeChangeListeners.push(listener);
  
  return () => {
    const index = routeChangeListeners.indexOf(listener);
    if (index !== -1) {
      routeChangeListeners.splice(index, 1);
    }
  };
}

/**
 * Obtiene la ruta actual
 * @returns {Object|null} Ruta actual
 */
export function getCurrentRoute() {
  return currentRoute ? { ...currentRoute } : null;
}

/**
 * Obtiene el historial de navegación
 * @param {number} limit - Límite de entradas
 * @returns {Array} Historial de navegación
 */
export function getNavigationHistory(limit = 10) {
  return navigationHistory.slice(-limit);
}

/**
 * Verifica si una ruta está activa
 * @param {string} routeName - Nombre de la ruta
 * @returns {boolean} Si la ruta está activa
 */
export function isRouteActive(routeName) {
  return currentRoute?.key === routeName;
}

/**
 * Construye una URL para una ruta
 * @param {string} routeName - Nombre de la ruta
 * @param {Object} params - Parámetros de la ruta
 * @returns {string} URL construida
 */
export function buildRouteUrl(routeName, params = {}) {
  const route = ROUTES[routeName];
  
  if (!route) {
    uiLogger.error(`Ruta no encontrada: ${routeName}`);
    return '/';
  }
  
  let path = route.path;
  
  Object.entries(params).forEach(([key, value]) => {
    path = path.replace(`:${key}`, value);
  });
  
  return serviceConfig.buildAssetUrl(path);
}

// ================================
// UTILIDADES ADICIONALES
// ================================

/**
 * Volver a la ruta anterior
 */
export function goBack() {
  if (typeof window !== 'undefined') {
    window.history.back();
  }
}

/**
 * Ir hacia adelante en el historial
 */
export function goForward() {
  if (typeof window !== 'undefined') {
    window.history.forward();
  }
}

/**
 * Recargar la ruta actual
 */
export function refresh() {
  if (currentRoute) {
    navigateToPath(currentRoute.path, { replace: true });
  }
}

/**
 * Verifica si el manager está inicializado
 * @returns {boolean} Estado de inicialización
 */
export function isReady() {
  return isInitialized;
}

/**
 * Obtiene estadísticas del router
 * @returns {Object} Estadísticas
 */
export function getStats() {
  return {
    isInitialized,
    currentRoute: currentRoute?.name || null,
    totalRoutes: Object.keys(ROUTES).length,
    historyEntries: navigationHistory.length,
    listeners: routeChangeListeners.length,
    timestamp: new Date().toISOString()
  };
}

/**
 * Resetea el estado del router
 */
export function reset() {
  uiLogger.info('Reseteando RouterManager...');
  
  currentRoute = null;
  navigationHistory = [];
  routeChangeListeners = [];
  
  uiLogger.info('RouterManager reseteado correctamente');
}

// ================================
// EXPORTACIÓN POR DEFECTO
// ================================

export default {
  // Inicialización
  initialize,
  isReady,
  
  // Navegación
  navigateToPath,
  navigateToRoute,
  goBack,
  goForward,
  refresh,
  
  // Estado
  getCurrentRoute,
  getNavigationHistory,
  isRouteActive,
  buildRouteUrl,
  
  // Listeners
  addRouteChangeListener,
  
  // Utilidades
  getStats,
  reset,
  
  // Constantes
  ROUTES,
  ROUTE_GROUPS
};