import React, { Suspense, lazy } from "react"
import { createBrowserRouter } from "react-router-dom"
import CognitiveOnboarding from "./components/CognitiveOnboarding"
import CognitiveProfileSetup from "./pages/CognitiveProfileSetup"
import WelcomeScreen from "./pages/WelcomeScreen"
import AwakeningIntro from "./pages/AwakeningIntro"

// Lazy loading para componentes grandes
const PlayerEvolution = lazy(() => import("./pages/PlayerEvolution"))
const GDDInteractive = lazy(() => import("./pages/GDDInteractive"))
const DevPortal = lazy(() => import("./portals/dev"))
const PublicPortal = lazy(() => import("./portals/public"))
const useVisitorProfile = lazy(() => import("./hooks/useVisitorProfile"))

// Loading component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-2xl text-blue-400 animate-pulse">
      Cargando módulo cognitivo...
    </div>
  </div>
)

// Componente que decide qué portal mostrar
const PortalSelector = () => {
  const [profile, setProfile] = React.useState(null)
  const [isLoading, setIsLoading] = React.useState(true)

  React.useEffect(() => {
    // Cargar perfil de forma asíncrona
    setTimeout(() => {
      setProfile({ type: 'user' })
      setIsLoading(false)
    }, 100)
  }, [])

  if (isLoading) {
    return React.createElement(LoadingSpinner)
  }

  // Si es arquitecto o accede con parámetro dev, mostrar portal dev
  const isArchitect = profile?.type === 'architect'
  const forceDevMode = window.location.search.includes('dev=true')
  
  if (isArchitect || forceDevMode) {
    return React.createElement(Suspense, 
      { fallback: React.createElement(LoadingSpinner) },
      React.createElement(DevPortal)
    )
  }

  // Por defecto, mostrar portal público
  return React.createElement(Suspense,
    { fallback: React.createElement(LoadingSpinner) },
    React.createElement(PublicPortal)
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: React.createElement(WelcomeScreen)
  },
  {
    path: "/cognitive-setup",
    element: React.createElement(CognitiveProfileSetup)
  },
  {
    path: "/onboarding",
    element: React.createElement(CognitiveOnboarding)
  },
  {
    path: "/awakening",
    element: React.createElement(AwakeningIntro)
  },
  {
    path: "/player-evolution",
    element: React.createElement(Suspense, 
      { fallback: React.createElement(LoadingSpinner) },
      React.createElement(PlayerEvolution)
    )
  },
  {
    path: "/evolution",
    element: React.createElement(Suspense, 
      { fallback: React.createElement(LoadingSpinner) },
      React.createElement(PlayerEvolution)
    )
  },
  {
    path: "/gdd",
    element: React.createElement(Suspense, 
      { fallback: React.createElement(LoadingSpinner) },
      React.createElement(GDDInteractive)
    )
  },
  {
    path: "/gdd/:sectionId",
    element: React.createElement(Suspense, 
      { fallback: React.createElement(LoadingSpinner) },
      React.createElement(GDDInteractive)
    )
  },
  {
    path: "/portal",
    element: React.createElement(PortalSelector)
  },
  {
    path: "/dev",
    element: React.createElement(Suspense, 
      { fallback: React.createElement(LoadingSpinner) },
      React.createElement(DevPortal)
    )
  },
  {
    path: "/public", 
    element: React.createElement(Suspense, 
      { fallback: React.createElement(LoadingSpinner) },
      React.createElement(PublicPortal)
    )
  }
], {
  basename: "/Prunaverso_Web"
})

export default router
