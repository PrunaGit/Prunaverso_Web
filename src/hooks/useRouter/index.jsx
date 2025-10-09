/**
 * @module useRouter
 * @description Hook de React para integración con routerManager del sistema core.
 * Proporciona funcionalidades de navegación y estado de ruta para componentes React.
 * Mantiene la separación entre Core Logic (routerManager) y React Presentation Layer.
 * 
 * @author Pruna - Sistema Cognitivo Prunaverso
 * @version 2.1.0
 */

import { useState, useEffect, useCallback } from 'react';
import routerManager from '../system-core/routerManager.js';
import { uiLogger } from '../system-core/logManager.js';

/**
 * Hook personalizado para gestión de navegación y estado de rutas
 * @returns {Object} Objeto con estado y funciones de navegación
 */
export function useRouter() {
  // Estado local del hook
  const [currentRoute, setCurrentRoute] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [navigationHistory, setNavigationHistory] = useState([]);
  const [isRouterReady, setIsRouterReady] = useState(false);

  // Sincronizar estado inicial
  useEffect(() => {
    const initializeHook = () => {
      if (routerManager.isReady()) {
        setIsRouterReady(true);
        setCurrentRoute(routerManager.getCurrentRoute());
        setNavigationHistory(routerManager.getNavigationHistory(5));
        uiLogger.logDebug('HOOK', 'useRouter inicializado con ruta:', routerManager.getCurrentRoute()?.name);
      } else {
        // Esperar a que el router esté listo
        setTimeout(initializeHook, 100);
      }
    };

    initializeHook();
  }, []);

  // Listener para cambios de ruta
  useEffect(() => {
    if (!isRouterReady) return;

    const handleRouteChange = (newRoute, previousRoute) => {
      uiLogger.logDebug('HOOK', `Cambio de ruta detectado: ${previousRoute?.name || 'null'} -> ${newRoute?.name}`);
      
      setCurrentRoute(newRoute);
      setNavigationHistory(routerManager.getNavigationHistory(5));
      setIsNavigating(false);
    };

    // Agregar listener al routerManager
    const removeListener = routerManager.addRouteChangeListener(handleRouteChange);

    return () => {
      removeListener();
    };
  }, [isRouterReady]);

  // Función de navegación por path
  const navigateToPath = useCallback((path, options = {}) => {
    if (!isRouterReady) {
      uiLogger.logWarn('HOOK', 'Router no está listo, navegación cancelada');
      return;
    }

    setIsNavigating(true);
    
    try {
      routerManager.navigateToPath(path, options);
      uiLogger.logInfo('HOOK', `Navegación iniciada hacia: ${path}`);
    } catch (error) {
      uiLogger.logError('HOOK', 'Error en navegación:', error);
      setIsNavigating(false);
    }
  }, [isRouterReady]);

  // Función de navegación por nombre de ruta
  const navigateToRoute = useCallback((routeName, params = {}, options = {}) => {
    if (!isRouterReady) {
      uiLogger.logWarn('HOOK', 'Router no está listo, navegación cancelada');
      return;
    }

    setIsNavigating(true);
    
    try {
      routerManager.navigateToRoute(routeName, params, options);
      uiLogger.logInfo('HOOK', `Navegación iniciada hacia ruta: ${routeName}`, params);
    } catch (error) {
      uiLogger.logError('HOOK', 'Error en navegación por ruta:', error);
      setIsNavigating(false);
    }
  }, [isRouterReady]);

  // Función para ir atrás
  const goBack = useCallback(() => {
    if (!isRouterReady) return;
    
    setIsNavigating(true);
    routerManager.goBack();
    uiLogger.logInfo('HOOK', 'Navegación hacia atrás');
  }, [isRouterReady]);

  // Función para ir adelante
  const goForward = useCallback(() => {
    if (!isRouterReady) return;
    
    setIsNavigating(true);
    routerManager.goForward();
    uiLogger.logInfo('HOOK', 'Navegación hacia adelante');
  }, [isRouterReady]);

  // Función para recargar ruta actual
  const refresh = useCallback(() => {
    if (!isRouterReady) return;
    
    setIsNavigating(true);
    routerManager.refresh();
    uiLogger.logInfo('HOOK', 'Recargando ruta actual');
  }, [isRouterReady]);

  // Función para verificar si una ruta está activa
  const isRouteActive = useCallback((routeName) => {
    if (!isRouterReady) return false;
    return routerManager.isRouteActive(routeName);
  }, [isRouterReady, currentRoute]);

  // Función para construir URL de ruta
  const buildRouteUrl = useCallback((routeName, params = {}) => {
    if (!isRouterReady) return '/';
    return routerManager.buildRouteUrl(routeName, params);
  }, [isRouterReady]);

  // Función para obtener parámetros de la ruta actual
  const getRouteParams = useCallback(() => {
    return currentRoute?.params || {};
  }, [currentRoute]);

  // Función para obtener query string (si existe)
  const getQueryParams = useCallback(() => {
    if (typeof window === 'undefined') return {};
    
    const urlParams = new URLSearchParams(window.location.search);
    const params = {};
    
    for (const [key, value] of urlParams.entries()) {
      params[key] = value;
    }
    
    return params;
  }, []);

  // Retornar API del hook
  return {
    // Estado
    currentRoute,
    isNavigating,
    navigationHistory,
    isReady: isRouterReady,
    
    // Información de ruta
    routeName: currentRoute?.name || null,
    routePath: currentRoute?.path || null,
    routeTitle: currentRoute?.title || null,
    routeParams: getRouteParams(),
    queryParams: getQueryParams(),
    
    // Funciones de navegación
    navigateToPath,
    navigateToRoute,
    goBack,
    goForward,
    refresh,
    
    // Utilidades
    isRouteActive,
    buildRouteUrl,
    
    // Acceso directo a constantes
    ROUTES: routerManager.ROUTES,
    ROUTE_GROUPS: routerManager.ROUTE_GROUPS
  };
}

/**
 * Hook simplificado para navegación básica
 * @returns {Object} Funciones básicas de navegación
 */
export function useNavigation() {
  const { navigateToPath, navigateToRoute, goBack, isReady } = useRouter();
  
  return {
    navigate: navigateToPath,
    navigateToRoute,
    goBack,
    isReady
  };
}

/**
 * Hook para información de ruta actual
 * @returns {Object} Información de la ruta actual
 */
export function useCurrentRoute() {
  const { 
    currentRoute, 
    routeName, 
    routePath, 
    routeTitle, 
    routeParams, 
    queryParams,
    isReady 
  } = useRouter();
  
  return {
    route: currentRoute,
    name: routeName,
    path: routePath,
    title: routeTitle,
    params: routeParams,
    query: queryParams,
    isReady
  };
}

/**
 * Hook para verificar rutas activas
 * @param {string} routeName - Nombre de la ruta a verificar
 * @returns {boolean} Si la ruta está activa
 */
export function useActiveRoute(routeName) {
  const { isRouteActive, isReady } = useRouter();
  
  if (!isReady) return false;
  return isRouteActive(routeName);
}

/**
 * Hook para construcción de URLs
 * @returns {Function} Función para construir URLs
 */
export function useRouteBuilder() {
  const { buildRouteUrl, isReady } = useRouter();
  
  return useCallback((routeName, params = {}) => {
    if (!isReady) return '/';
    return buildRouteUrl(routeName, params);
  }, [buildRouteUrl, isReady]);
}

export default useRouter;