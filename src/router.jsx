import React from "react"
import { createBrowserRouter } from "react-router-dom"
import CognitiveOnboarding from "./components/CognitiveOnboarding"
import CognitiveProfileSetup from "./pages/CognitiveProfileSetup"
import WelcomeScreen from "./pages/WelcomeScreen"
import AwakeningIntro from "./pages/AwakeningIntro"
import PlayerEvolution from "./pages/PlayerEvolution"
import GDDInteractive from "./pages/GDDInteractive"
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
    element: React.createElement(PlayerEvolution)
  },
  {
    path: "/evolution",
    element: React.createElement(PlayerEvolution)
  },
  {
    path: "/gdd",
    element: React.createElement(GDDInteractive)
  },
  {
    path: "/gdd/:sectionId",
    element: React.createElement(GDDInteractive)
  },
  {
    path: "/portal",
    element: React.createElement(PortalSelector)
  },
  {
    path: "/dev",
    element: React.createElement(DevPortal)
  },
  {
    path: "/public", 
    element: React.createElement(PublicPortal)
  },
  {
    path: "/gdd",
    element: React.createElement(GDDInteractive)
  },
  {
    path: "/gdd/:sectionId",
    element: React.createElement(GDDInteractive)
  }
])

export default router
