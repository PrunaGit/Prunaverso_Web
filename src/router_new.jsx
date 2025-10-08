import React from 'react'
import { createBrowserRouter } from 'react-router-dom'
import WelcomeScreenNew from './pages/WelcomeScreenNew'
import PortalNew from './PortalNew.jsx'
import SimplePortal from './SimplePortal'
import DebugTest from './pages/DebugTest'
import Architecture from './pages/Architecture'
import CognitiveSciences from './pages/CognitiveSciences'
import PersonalityDemo from './pages/PersonalityDemo'
import ProfileDemo from './pages/ProfileDemo'
import CharacterSelectorRPG from './pages/CharacterSelectorRPG'
import TestPage from './pages/TestPage'
import LensAtmosphereDemo from './pages/LensAtmosphereDemo'

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomeScreenNew />
  },
  {
    path: "/portal",
    element: <PortalNew />
  },
  {
    path: "/characters",
    element: <CharacterSelectorRPG />
  },
  {
    path: "/cognitive-sciences",
    element: <CognitiveSciences />
  },
  {
    path: "/personality-demo",
    element: <PersonalityDemo />
  },
  {
    path: "/profile-demo",
    element: <ProfileDemo />
  },
  {
    path: "/simple",
    element: <SimplePortal />
  },
  {
    path: "/lens-atmosphere",
    element: <LensAtmosphereDemo />
  },
  {
    path: "/test",
    element: <TestPage />
  },
  {
    path: "/debug",
    element: <DebugTest />
  },
  {
    path: "/architecture",
    element: <Architecture />
  }
])

export default router