import { RouterProvider } from 'react-router-dom'
import router from './router'
import LensAtmosphereManager from './components/LensAtmosphereManagerSimple'
import Heartbeat from './components/Heartbeat'
import HUDAscii from './components/HUDAscii'
import PlayerProgressionHUD from './components/PlayerProgressionHUD'
import AchievementManager from './components/AchievementManager'
import usePlayerProgression from './hooks/usePlayerProgression'

export default function App() {
  console.log('🚀 App component loaded')
  
  const { getRecentAchievements } = usePlayerProgression();
  const recentAchievements = getRecentAchievements();
  
  return (
    <>
      <LensAtmosphereManager />
      <Heartbeat />
      <HUDAscii />
      <PlayerProgressionHUD position="bottom-right" compact={true} />
      <AchievementManager achievements={recentAchievements} />
      <RouterProvider router={router} />
    </>
  )
}
