/**
 * @module UnifiedRouter
 * @description Router unificado que integra routerManager (core) con React Router DOM.
 * Proporciona navegación SPA con manejo de estado centralizado y components dinámicos.
 * Mantiene la coherencia entre Core Logic y React Presentation Layer.
 * 
 * @author Pruna - Sistema Cognitivo Prunaverso
 * @version 2.1.0
 */

import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import routerManager, { ROUTES } from '../system-core/routerManager.js';
import componentRegistry from '../system-core/componentRegistry.js';
import atmosphereManager from '../system-core/atmosphereManager.js';
import { uiLogger } from '../system-core/logManager.js';

/**
 * Componente de página dinámica que integra atmosphere y component registry
 */
function DynamicPageComponent({ routeKey, fallbackComponent = null }) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializePage = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Obtener configuración de ruta
        const route = ROUTES[routeKey];
        if (!route) {
          throw new Error(`Ruta no encontrada: ${routeKey}`);
        }

        // Aplicar atmósfera de la ruta
        if (route.atmosphere) {
          atmosphereManager.setAtmosphere(route.atmosphere);
          uiLogger.logDebug('ROUTER', `Atmósfera aplicada: ${route.atmosphere} para ruta ${routeKey}`);
        }

        // Log de navegación
        uiLogger.logInfo('ROUTER', `Página cargada: ${route.name} (${route.path})`);

        setIsLoading(false);
      } catch (err) {
        uiLogger.logError('ROUTER', `Error cargando página ${routeKey}:`, err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initializePage();
  }, [routeKey]);

  // Estado de carga
  if (isLoading) {
    return componentRegistry.LoadingFallback({ 
      componentName: `Página ${routeKey}` 
    });
  }

  // Estado de error
  if (error) {
    return componentRegistry.ErrorFallback({ 
      error, 
      componentName: `Página ${routeKey}` 
    });
  }

  // Buscar componente en el registry
  const components = componentRegistry.getComponentsByRoute(routeKey);
  
  if (components.length > 0) {
    // Usar primer componente encontrado
    const componentKey = components[0].key;
    return componentRegistry.renderComponent(componentKey);
  }

  // Fallback component si se proporciona
  if (fallbackComponent) {
    return React.createElement(fallbackComponent);
  }

  // Componente por defecto si no se encuentra nada
  return React.createElement(
    'div',
    { 
      className: 'page-placeholder',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--color-text-secondary, #ccc)'
      }
    },
    React.createElement('div', null,
      React.createElement('h2', null, `Página ${routeKey}`),
      React.createElement('p', null, 'Esta página está en desarrollo.')
    )
  );
}

/**
 * Componente de ruta 404
 */
function NotFoundPage() {
  useEffect(() => {
    atmosphereManager.setAtmosphere('atmosphere-error');
    uiLogger.logWarn('ROUTER', 'Página 404 cargada');
  }, []);

  return React.createElement(
    'div',
    { 
      className: 'not-found-page',
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        padding: '2rem',
        textAlign: 'center',
        color: 'var(--color-text-primary, #fff)'
      }
    },
    React.createElement('div', null,
      React.createElement(
        'div',
        { style: { fontSize: '4rem', marginBottom: '1rem' } },
        '🌌'
      ),
      React.createElement(
        'h1',
        { style: { fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--color-accent-primary, #6c5ce7)' } },
        'Territorio Inexplorado'
      ),
      React.createElement(
        'p',
        { style: { fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.8 } },
        'Esta región del Prunaverso aún no ha sido cartografiada.'
      ),
      React.createElement(
        'button',
        {
          onClick: () => routerManager.navigateToPath('/'),
          style: {
            padding: '12px 24px',
            background: 'var(--color-accent-primary, #6c5ce7)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          },
          onMouseOver: (e) => { e.target.style.transform = 'scale(1.05)' },
          onMouseOut: (e) => { e.target.style.transform = 'scale(1)' }
        },
        'Volver al Portal Principal'
      )
    )
  );
}

/**
 * Wrapper de ruta que integra con routerManager
 */
function RouteWrapper({ children, routeKey }) {
  useEffect(() => {
    // Notificar al routerManager sobre el cambio de ruta
    const route = ROUTES[routeKey];
    if (route) {
      // Sincronizar estado del router manager
      routerManager.navigateToPath(route.path, { silent: true });
    }
  }, [routeKey]);

  return children;
}

/**
 * Componente principal del router unificado
 */
export function UnifiedRouter() {
  const [isRouterReady, setIsRouterReady] = useState(false);

  useEffect(() => {
    // Verificar si routerManager está listo
    const checkRouterReady = () => {
      if (routerManager.isReady()) {
        setIsRouterReady(true);
        uiLogger.logInfo('ROUTER', 'UnifiedRouter inicializado correctamente');
      } else {
        // Reintentar en 100ms
        setTimeout(checkRouterReady, 100);
      }
    };

    checkRouterReady();
  }, []);

  // Loading state mientras el router se inicializa
  if (!isRouterReady) {
    return componentRegistry.LoadingFallback({ 
      componentName: 'Sistema de Navegación' 
    });
  }

  return React.createElement(
    HashRouter,
    null,
    React.createElement(
      Routes,
      null,
      
      // Ruta principal
      React.createElement(Route, {
        path: '/',
        element: React.createElement(RouteWrapper, 
          { routeKey: 'HOME' },
          React.createElement(DynamicPageComponent, { routeKey: 'HOME' })
        )
      }),

      // Portal principal
      React.createElement(Route, {
        path: '/portal',
        element: React.createElement(RouteWrapper, 
          { routeKey: 'PORTAL' },
          React.createElement(DynamicPageComponent, { routeKey: 'PORTAL' })
        )
      }),

      // Proceso de despertar
      React.createElement(Route, {
        path: '/awakening',
        element: React.createElement(RouteWrapper, 
          { routeKey: 'AWAKENING' },
          React.createElement(DynamicPageComponent, { routeKey: 'AWAKENING' })
        )
      }),

      // Selector de arquetipos
      React.createElement(Route, {
        path: '/selector',
        element: React.createElement(RouteWrapper, 
          { routeKey: 'SELECTOR' },
          React.createElement(DynamicPageComponent, { routeKey: 'SELECTOR' })
        )
      }),

      // Detalle de arquetipo con parámetro
      React.createElement(Route, {
        path: '/character/:id',
        element: React.createElement(RouteWrapper, 
          { routeKey: 'CHARACTER_DETAIL' },
          React.createElement(DynamicPageComponent, { routeKey: 'CHARACTER_DETAIL' })
        )
      }),

      // Diagnóstico del sistema
      React.createElement(Route, {
        path: '/diagnostics',
        element: React.createElement(RouteWrapper, 
          { routeKey: 'DIAGNOSTICS' },
          React.createElement(DynamicPageComponent, { routeKey: 'DIAGNOSTICS' })
        )
      }),

      // Monitor del sistema
      React.createElement(Route, {
        path: '/monitor',
        element: React.createElement(RouteWrapper, 
          { routeKey: 'MONITOR' },
          React.createElement(DynamicPageComponent, { routeKey: 'MONITOR' })
        )
      }),

      // Experiencia atmosférica
      React.createElement(Route, {
        path: '/atmosphere',
        element: React.createElement(RouteWrapper, 
          { routeKey: 'ATMOSPHERE' },
          React.createElement(DynamicPageComponent, { routeKey: 'ATMOSPHERE' })
        )
      }),

      // Configuración
      React.createElement(Route, {
        path: '/settings',
        element: React.createElement(RouteWrapper, 
          { routeKey: 'SETTINGS' },
          React.createElement(DynamicPageComponent, { routeKey: 'SETTINGS' })
        )
      }),

      // Panel de administración
      React.createElement(Route, {
        path: '/admin',
        element: React.createElement(RouteWrapper, 
          { routeKey: 'ADMIN' },
          React.createElement(DynamicPageComponent, { routeKey: 'ADMIN' })
        )
      }),

      // Página 404
      React.createElement(Route, {
        path: '/404',
        element: React.createElement(RouteWrapper, 
          { routeKey: 'NOT_FOUND' },
          React.createElement(NotFoundPage)
        )
      }),

      // Redirección catch-all a 404
      React.createElement(Route, {
        path: '*',
        element: React.createElement(Navigate, { 
          to: '/404', 
          replace: true 
        })
      })
    )
  );
}

/**
 * HOC para componentes que necesitan información de ruta
 */
export function withRouterInfo(WrappedComponent) {
  return function RouterInfoWrapper(props) {
    const [currentRoute, setCurrentRoute] = useState(null);

    useEffect(() => {
      // Sincronizar con routerManager
      const updateRoute = () => {
        setCurrentRoute(routerManager.getCurrentRoute());
      };

      // Actualización inicial
      updateRoute();

      // Listener para cambios
      const removeListener = routerManager.addRouteChangeListener(updateRoute);

      return removeListener;
    }, []);

    return React.createElement(WrappedComponent, {
      ...props,
      currentRoute,
      routerReady: routerManager.isReady()
    });
  };
}

/**
 * Componente de enlace personalizado que integra con routerManager
 */
export function RouterLink({ to, routeName, params = {}, children, className, style, ...props }) {
  const handleClick = (e) => {
    e.preventDefault();
    
    if (routeName) {
      routerManager.navigateToRoute(routeName, params);
    } else if (to) {
      routerManager.navigateToPath(to);
    }
  };

  // Construir href basado en routeName o to
  let href = '#/';
  if (routeName) {
    href = '#' + routerManager.buildRouteUrl(routeName, params);
  } else if (to) {
    href = '#' + to;
  }

  return React.createElement(
    'a',
    {
      href,
      onClick: handleClick,
      className,
      style,
      ...props
    },
    children
  );
}

export default UnifiedRouter;