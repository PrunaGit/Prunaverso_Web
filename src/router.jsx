import React from "react"
import { createBrowserRouter } from "react-router-dom"
import CognitiveOnboarding from "./components/CognitiveOnboarding"
import PortalMain from "./pages/PortalMain"
import DevPortal from "./portals/dev"
import PublicPortal from "./portals/public"
import useVisitorProfile from "./hooks/useVisitorProfile"

// Componente que decide qué portal mostrar
const PortalSelector = () => {
  const { profile, isLoading } = useVisitorProfile()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-2xl text-blue-400 animate-pulse">
          Sincronizando conciencia...
        </div>
      </div>
    )
  }

  // Si es arquitecto o accede con parámetro dev, mostrar portal dev
  const isArchitect = profile?.type === 'architect'
  const forceDevMode = window.location.search.includes('dev=true')
  
  if (isArchitect || forceDevMode) {
    return React.createElement(DevPortal)
  }

  // Por defecto, mostrar portal público
  return React.createElement(PublicPortal)
}

const router = createBrowserRouter([
  {
    path: "/",
    element: React.createElement(PortalSelector)
  },
  {
    path: "/onboarding",
    element: React.createElement(CognitiveOnboarding)
  },
  {
    path: "/portal",
    element: React.createElement(PortalMain)
  },
  {
    path: "/dev",
    element: React.createElement(DevPortal)
  },
  {
    path: "/public", 
    element: React.createElement(PublicPortal)
  }
])

export default router
