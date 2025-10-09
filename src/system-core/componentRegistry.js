/**
 * @module ComponentRegistry
 * @description Registro centralizado de componentes modulares del Prunaverso.
 * Implementa el patrón de Registro de Componentes para mantener la coherencia
 * sistémica y facilitar la gestión modular de la interfaz.
 * 
 * @author Pruna - Sistema Cognitivo Prunaverso
 * @version 2.1.0
 */

import React, { Suspense, lazy } from 'react';
import { uiLogger } from '../system-core/logManager.js';

// ================================
// COMPONENTES PRINCIPALES (Eager Loading)
// ================================

// Componentes críticos que se cargan inmediatamente
import WelcomeScreen from '../pages/WelcomeScreen.jsx';
import PrunaversoLauncher from '../pages/PrunaversoLauncher.jsx';
import MonitorPanel from '../components/MonitorPanel.jsx';

// ================================
// COMPONENTES LAZY (Dynamic Loading)
// ================================

// Páginas principales
const CharacterSelectorRPG = lazy(() => import('../pages/CharacterSelectorRPG.jsx'));
const AwakeningIntro = lazy(() => import('../pages/AwakeningIntro.jsx'));

// Nuevas páginas del flujo de entrada
const IdentificationScreen = lazy(() => import('../pages/IdentificationScreen.jsx'));
const MainMenu = lazy(() => import('../pages/MainMenu.jsx'));

// Componentes especializados
const SystemDiagnostics = lazy(() => import('../components/Specialized/SystemDiagnostics.jsx'));

// Crear componentes placeholder para los que no existen aún
const createPlaceholder = (name) => {
  return () => React.createElement(
    'div',
    { 
      style: {
        padding: '2rem',
        textAlign: 'center',
        background: 'var(--color-surface-primary, #1a1a2e)',
        color: 'var(--color-text-primary, #ffffff)',
        borderRadius: '8px',
        margin: '1rem'
      }
    },
    React.createElement('h2', null, name),
    React.createElement('p', null, 'Este componente está en desarrollo.')
  );
};

// ================================
// CONFIGURACIÓN DE COMPONENTES
// ================================

/**
 * Configuración de componentes con metadata
 */
const COMPONENT_CONFIG = {
  // Páginas principales
  LAUNCHER: {
    component: PrunaversoLauncher,
    name: 'PrunaversoLauncher',
    category: 'page',
    loadType: 'eager',
    description: 'Launcher unificado del ecosistema Prunaverso',
    route: 'LAUNCHER',
    atmosphere: 'atmosphere-cosmic'
  },

  WELCOME: {
    component: WelcomeScreen,
    name: 'WelcomeScreen',
    category: 'page',
    loadType: 'eager',
    description: 'Pantalla de bienvenida principal del Prunaverso',
    route: 'WELCOME',
    atmosphere: 'atmosphere-mystic'
  },

  IDENTIFICATION: {
    component: IdentificationScreen,
    name: 'IdentificationScreen',
    category: 'page',
    loadType: 'lazy',
    description: 'Pantalla de identificación y selección de perfil',
    route: 'IDENTIFY',
    atmosphere: 'atmosphere-exploratory'
  },

  MAIN_MENU: {
    component: MainMenu,
    name: 'MainMenu',
    category: 'page',
    loadType: 'lazy',
    description: 'Menú principal del juego y portal de acceso',
    route: 'MENU',
    atmosphere: 'atmosphere-collaborative'
  },

  CHARACTER_SELECTOR: {
    component: CharacterSelectorRPG,
    name: 'CharacterSelectorRPG',
    category: 'page',
    loadType: 'lazy',
    description: 'Selector de arquetipos RPG',
    route: 'SELECTOR',
    atmosphere: 'atmosphere-creative'
  },

  AWAKENING_INTRO: {
    component: AwakeningIntro,
    name: 'AwakeningIntro',
    category: 'page',
    loadType: 'lazy',
    description: 'Proceso de despertar cognitivo',
    route: 'AWAKENING',
    atmosphere: 'atmosphere-transcendent'
  },

  // Componentes de sistema
  MONITOR_PANEL: {
    component: MonitorPanel,
    name: 'MonitorPanel',
    category: 'system',
    loadType: 'eager',
    description: 'Panel de monitoreo del sistema',
    props: {
      showTitle: true,
      enableRefresh: true
    }
  },

  SYSTEM_DIAGNOSTICS: {
    component: SystemDiagnostics,
    name: 'SystemDiagnostics',
    category: 'system',
    loadType: 'lazy',
    description: 'Panel completo de diagnóstico sistémico',
    route: 'DIAGNOSTICS'
  },

  COGNITIVE_PANEL: {
    component: createPlaceholder('Panel Cognitivo'),
    name: 'CognitivePanel',
    category: 'cognitive',
    loadType: 'eager',
    description: 'Panel de estado cognitivo'
  },

  // Componentes de interfaz
  NAVIGATION_BAR: {
    component: createPlaceholder('Barra de Navegación'),
    name: 'NavigationBar',
    category: 'ui',
    loadType: 'eager',
    description: 'Barra de navegación principal'
  },

  FOOTER: {
    component: createPlaceholder('Pie de Página'),
    name: 'Footer',
    category: 'ui',
    loadType: 'eager',
    description: 'Pie de página del sistema'
  }
};

/**
 * Categorías de componentes
 */
export const COMPONENT_CATEGORIES = {
  PAGE: 'page',
  SYSTEM: 'system',
  COGNITIVE: 'cognitive',
  UI: 'ui',
  INTERACTIVE: 'interactive'
};

/**
 * Tipos de carga
 */
export const LOAD_TYPES = {
  EAGER: 'eager',
  LAZY: 'lazy'
};

// ================================
// ESTADO DEL REGISTRO
// ================================

let componentRegistry = { ...COMPONENT_CONFIG };
let loadingStates = {};
let componentErrors = {};

// ================================
// FUNCIONES CORE DEL REGISTRO
// ================================

/**
 * Registra un nuevo componente en el sistema
 * @param {string} key - Clave única del componente
 * @param {Object} config - Configuración del componente
 */
export function registerComponent(key, config) {
  const {
    component,
    name,
    category = 'ui',
    loadType = 'lazy',
    description = '',
    route = null,
    atmosphere = null,
    props = {}
  } = config;

  if (!component) {
    uiLogger.logError('REGISTRY', `Componente requerido para registrar: ${key}`);
    return false;
  }

  componentRegistry[key] = {
    component,
    name: name || key,
    category,
    loadType,
    description,
    route,
    atmosphere,
    props,
    registeredAt: new Date().toISOString()
  };

  uiLogger.logInfo('REGISTRY', `Componente registrado: ${key} (${category})`);
  return true;
}

/**
 * Obtiene un componente del registro
 * @param {string} key - Clave del componente
 * @returns {Object|null} Configuración del componente
 */
export function getComponent(key) {
  const config = componentRegistry[key];
  
  if (!config) {
    uiLogger.logWarn('REGISTRY', `Componente no encontrado: ${key}`);
    return null;
  }

  return { ...config };
}

/**
 * Renderiza un componente con manejo de errores y loading
 * @param {string} key - Clave del componente
 * @param {Object} props - Props adicionales
 * @returns {JSX.Element} Componente renderizado
 */
export function renderComponent(key, props = {}) {
  const config = getComponent(key);
  
  if (!config) {
    return React.createElement(ErrorFallback, { 
      error: `Componente no encontrado: ${key}` 
    });
  }

  const Component = config.component;
  const mergedProps = { ...config.props, ...props };

  // Manejar componentes lazy
  if (config.loadType === 'lazy') {
    return React.createElement(
      Suspense,
      { 
        fallback: React.createElement(LoadingFallback, { 
          componentName: config.name 
        })
      },
      React.createElement(Component, mergedProps)
    );
  }

  // Componentes eager
  try {
    return React.createElement(Component, mergedProps);
  } catch (error) {
    uiLogger.logError('REGISTRY', `Error renderizando ${key}:`, error);
    return React.createElement(ErrorFallback, { 
      error: error.message,
      componentName: config.name 
    });
  }
}

/**
 * Componente de carga por defecto
 */
function LoadingFallback({ componentName }) {
  return React.createElement(
    'div',
    { 
      className: 'component-loading',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--color-surface-primary, #1a1a2e)',
        color: 'var(--color-text-primary, #ffffff)',
        borderRadius: '8px',
        border: '1px solid var(--color-border-primary, #333)',
        minHeight: '120px'
      }
    },
    React.createElement(
      'div',
      { style: { textAlign: 'center' } },
      React.createElement(
        'div',
        { 
          style: {
            animation: 'pulse 2s infinite',
            fontSize: '1.5rem',
            marginBottom: '0.5rem'
          }
        },
        '🧠'
      ),
      React.createElement(
        'p',
        { 
          style: { 
            margin: 0,
            fontSize: '0.9rem',
            opacity: 0.8
          }
        },
        `Cargando ${componentName}...`
      )
    )
  );
}

/**
 * Componente de error por defecto
 */
function ErrorFallback({ error, componentName = 'Componente' }) {
  return React.createElement(
    'div',
    { 
      className: 'component-error',
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        background: 'var(--color-error-surface, #2a1d1d)',
        color: 'var(--color-error-text, #ff6b6b)',
        borderRadius: '8px',
        border: '1px solid var(--color-error-border, #ff6b6b)',
        minHeight: '120px'
      }
    },
    React.createElement(
      'div',
      { style: { textAlign: 'center' } },
      React.createElement(
        'div',
        { 
          style: {
            fontSize: '1.5rem',
            marginBottom: '0.5rem'
          }
        },
        '⚠️'
      ),
      React.createElement(
        'h3',
        { 
          style: { 
            margin: '0 0 0.5rem 0',
            fontSize: '1rem'
          }
        },
        `Error en ${componentName}`
      ),
      React.createElement(
        'p',
        { 
          style: { 
            margin: 0,
            fontSize: '0.8rem',
            opacity: 0.8
          }
        },
        error
      )
    )
  );
}

// ================================
// FUNCIONES DE CONSULTA
// ================================

/**
 * Obtiene componentes por categoría
 * @param {string} category - Categoría a filtrar
 * @returns {Array} Lista de componentes
 */
export function getComponentsByCategory(category) {
  return Object.entries(componentRegistry)
    .filter(([key, config]) => config.category === category)
    .map(([key, config]) => ({ key, ...config }));
}

/**
 * Obtiene componentes por tipo de carga
 * @param {string} loadType - Tipo de carga
 * @returns {Array} Lista de componentes
 */
export function getComponentsByLoadType(loadType) {
  return Object.entries(componentRegistry)
    .filter(([key, config]) => config.loadType === loadType)
    .map(([key, config]) => ({ key, ...config }));
}

/**
 * Obtiene componentes asociados a una ruta
 * @param {string} route - Nombre de la ruta
 * @returns {Array} Lista de componentes
 */
export function getComponentsByRoute(route) {
  return Object.entries(componentRegistry)
    .filter(([key, config]) => config.route === route)
    .map(([key, config]) => ({ key, ...config }));
}

/**
 * Verifica si un componente existe
 * @param {string} key - Clave del componente
 * @returns {boolean} Si existe
 */
export function hasComponent(key) {
  return key in componentRegistry;
}

/**
 * Lista todas las claves de componentes
 * @returns {Array} Lista de claves
 */
export function getComponentKeys() {
  return Object.keys(componentRegistry);
}

/**
 * Obtiene estadísticas del registro
 * @returns {Object} Estadísticas
 */
export function getRegistryStats() {
  const components = Object.values(componentRegistry);
  
  const stats = {
    total: components.length,
    byCategory: {},
    byLoadType: {},
    withRoutes: 0,
    withAtmosphere: 0
  };

  components.forEach(config => {
    // Por categoría
    stats.byCategory[config.category] = (stats.byCategory[config.category] || 0) + 1;
    
    // Por tipo de carga
    stats.byLoadType[config.loadType] = (stats.byLoadType[config.loadType] || 0) + 1;
    
    // Con rutas
    if (config.route) stats.withRoutes++;
    
    // Con atmósfera
    if (config.atmosphere) stats.withAtmosphere++;
  });

  return stats;
}

// ================================
// FUNCIONES DE MANTENIMIENTO
// ================================

/**
 * Elimina un componente del registro
 * @param {string} key - Clave del componente
 * @returns {boolean} Éxito de la operación
 */
export function unregisterComponent(key) {
  if (!(key in componentRegistry)) {
    uiLogger.logWarn('REGISTRY', `Intento de eliminar componente inexistente: ${key}`);
    return false;
  }

  delete componentRegistry[key];
  delete loadingStates[key];
  delete componentErrors[key];

  uiLogger.logInfo('REGISTRY', `Componente eliminado del registro: ${key}`);
  return true;
}

/**
 * Limpia el registro de componentes
 */
export function clearRegistry() {
  const count = Object.keys(componentRegistry).length;
  
  componentRegistry = {};
  loadingStates = {};
  componentErrors = {};

  uiLogger.logInfo('REGISTRY', `Registro limpiado: ${count} componentes eliminados`);
}

/**
 * Restaura la configuración por defecto
 */
export function resetToDefaults() {
  componentRegistry = { ...COMPONENT_CONFIG };
  loadingStates = {};
  componentErrors = {};

  uiLogger.logInfo('REGISTRY', 'Registro restaurado a configuración por defecto');
}

// ================================
// EXPORTACIÓN POR DEFECTO
// ================================

export default {
  // Gestión de componentes
  registerComponent,
  getComponent,
  renderComponent,
  hasComponent,
  unregisterComponent,
  
  // Consultas
  getComponentsByCategory,
  getComponentsByLoadType,
  getComponentsByRoute,
  getComponentKeys,
  getRegistryStats,
  
  // Mantenimiento
  clearRegistry,
  resetToDefaults,
  
  // Constantes
  COMPONENT_CATEGORIES,
  LOAD_TYPES,
  
  // Componentes de fallback
  LoadingFallback,
  ErrorFallback
};