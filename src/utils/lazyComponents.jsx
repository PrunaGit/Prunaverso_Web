// Utilidades para lazy loading y code splitting
import { lazy } from 'react'

// Lazy loading con error boundary
export const lazyWithPreload = (importFunc) => {
  const Component = lazy(importFunc)
  Component.preload = importFunc
  return Component
}

// Componente de loading optimizado
export const OptimizedLoader = ({ message = "Cargando..." }) => (
  <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-purple-950 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <div className="text-xl text-blue-300 animate-pulse">
        {message}
      </div>
      <div className="text-sm text-blue-500/70">
        Inicializando módulo cognitivo...
      </div>
    </div>
  </div>
)

// Preload de componentes críticos
export const preloadCriticalComponents = () => {
  // Precargar componentes que probablemente se van a usar
  if (typeof window !== 'undefined') {
    // Preload después de que la página principal esté cargada
    setTimeout(() => {
      import('../pages/PlayerEvolution.jsx')
      import('../portals/public/index.jsx')
    }, 2000)
  }
}