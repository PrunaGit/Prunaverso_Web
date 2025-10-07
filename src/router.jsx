import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Portal from './Portal'
import SessionStart from './pages/SessionStart'
import CharacterSelect from './pages/CharacterSelect'
import Wiki from './pages/Wiki'
import Credits from './pages/Credits'
import MonitorPanel from './components/MonitorPanel'
import PrunaversoPanel from './PrunaversoPanel'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portal />} />
        <Route path="/session/start" element={<SessionStart />} />
        <Route path="/character" element={<CharacterSelect />} />
        <Route path="/wiki" element={<Wiki />} />
        <Route path="/credits" element={<Credits />} />
        <Route path="/monitor" element={<MonitorPanel src="/data/monitor-latest.json" poll={4000} />} />
        <Route path="/old-panel" element={<PrunaversoPanel />} />
      </Routes>
    </BrowserRouter>
  )
}
