import { RouterProvider, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import router from './router'
import AtmosphereLensManager from './components/AtmosphereLensManager'
import HUDCognitivo from './components/HUDCognitivo'
import Heartbeat from './components/Heartbeat'
import PlayerProgressionHUD from './components/PlayerProgressionHUD'
import AchievementManager from './components/AchievementManager'
import DevTestPanel from './components/DevTestPanel'
import usePlayerProgression from './hooks/usePlayerProgression'
import { initializeCognitiveSystem } from './system-core/cognitiveStateManager'

export default function App() {
  console.log('🚀 App component loaded - Prunaverso OS v2.0')
  
  const { getRecentAchievements, needsAwakening } = usePlayerProgression();
  const recentAchievements = getRecentAchievements();
  
  // Inicializar sistema cognitivo
  useEffect(() => {
    console.log('🧠 Inicializando Sistema Operativo Cognitivo...');
    initializeCognitiveSystem();
  }, []);
  
  // Redirigir a awakening si es necesario
  useEffect(() => {
    if (needsAwakening && window.location.pathname === '/') {
      window.location.href = '/awakening';
    }
  }, [needsAwakening]);
  
  return (
    <AtmosphereLensManager>
      <Heartbeat />
      <HUDCognitivo position="top-right" />
      <PlayerProgressionHUD position="bottom-right" compact={true} />
      <AchievementManager achievements={recentAchievements} />
      <DevTestPanel />
      <RouterProvider router={router} />
    </AtmosphereLensManager>
  )
}
