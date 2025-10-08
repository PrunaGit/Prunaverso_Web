import { RouterProvider } from 'react-router-dom'
import router from './router'
import LensAtmosphereManager from './components/LensAtmosphereManagerSimple'
import Heartbeat from './components/Heartbeat'

export default function App() {
  console.log('🚀 App component loaded')
  
  return (
    <>
      <LensAtmosphereManager />
      <Heartbeat />
      <RouterProvider router={router} />
    </>
  )
}
