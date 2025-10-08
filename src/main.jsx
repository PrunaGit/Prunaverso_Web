import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import useRenderAlive from './hooks/useRenderAlive.jsx'

// 🎯 Componente wrapper que integra el sensor de render
function AppWithSensors() {
  // Hook que notifica al servidor cuando la UI está viva
  useRenderAlive()
  
  return <App />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppWithSensors />
  </StrictMode>,
)
