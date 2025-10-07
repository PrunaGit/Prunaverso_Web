import React from 'react'
import { motion } from 'framer-motion'

const Button = ({ children, onClick, variant = 'primary' }) => (
  <button
    onClick={onClick}
    className={`px-6 py-3 rounded-lg font-semibold shadow-md transition-transform active:scale-95 focus:outline-none ${
      variant === 'primary'
        ? 'bg-gradient-to-r from-purple-600 to-indigo-500 text-white'
        : 'bg-white text-gray-800 border'
    }`}
  >
    {children}
  </button>
)

export default function Portal() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white flex items-center justify-center">
      <div className="w-full max-w-4xl p-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-8"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeOpacity="0.18" strokeWidth="1.5" />
              <path d="M4 12c2-4 6-8 12-8" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" />
            </svg>
          </div>

          <div>
            <h1 className="text-3xl font-bold">Prunaverso — Portal v0.06</h1>
            <p className="text-sm text-gray-300">No es una web. Es una interfaz-juego cognitivo.</p>
          </div>
        </motion.header>

        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.section whileHover={{ scale: 1.02 }} className="p-6 rounded-xl bg-black/30 border border-white/6">
            <h2 className="text-xl font-semibold mb-3">Iniciar Partida</h2>
            <p className="text-sm text-gray-300 mb-4">Arranca la simulación narrativa personalizada. Guarda checkpoints y genera HUD dinámico.</p>
            <div className="flex gap-3">
              <Button variant="primary">Iniciar</Button>
              <Button onClick={() => alert('Cargar partida: no implementado')} variant="secondary">Cargar</Button>
            </div>
          </motion.section>

          <motion.section whileHover={{ scale: 1.02 }} className="p-6 rounded-xl bg-black/30 border border-white/6">
            <h2 className="text-xl font-semibold mb-3">Seleccionar Personaje</h2>
            <p className="text-sm text-gray-300 mb-4">Elige un avatar cognitivo o crea un nuevo vector fractal.</p>
            <div className="grid grid-cols-2 gap-3">
              <Button onClick={() => alert('Seleccionado TF13')} variant="primary">TF13 — El Traductor</Button>
              <Button onClick={() => alert('Seleccionado B1066')} variant="primary">B1066 — El Líder</Button>
              <Button onClick={() => alert('Seleccionado Kernel')} variant="primary">Kernel — El Arquitecto</Button>
              <Button onClick={() => alert('Nuevo Vector...')} variant="secondary">Nuevo Vector</Button>
            </div>
          </motion.section>

          <motion.section whileHover={{ scale: 1.02 }} className="p-6 rounded-xl bg-black/30 border border-white/6">
            <h2 className="text-xl font-semibold mb-3">Opciones / Ajustes</h2>
            <p className="text-sm text-gray-300 mb-4">Configura canal cognitivo, HUD, idioma y dificultad.</p>
            <div className="flex flex-col gap-3">
              <Button onClick={() => alert('Abrir ajustes')}>Abrir Ajustes</Button>
            </div>
          </motion.section>

          <motion.section whileHover={{ scale: 1.02 }} className="p-6 rounded-xl bg-black/30 border border-white/6">
            <h2 className="text-xl font-semibold mb-3">Wiki / Archivos del Sistema</h2>
            <p className="text-sm text-gray-300 mb-4">Accede al Diccionario Prunaversal, logs y cronología de versiones.</p>
            <div className="flex gap-3">
              <Button onClick={() => alert('Abrir Wiki')}>Abrir Wiki</Button>
              <Button onClick={() => alert('Abrir Logs')} variant="secondary">Logs</Button>
            </div>
          </motion.section>
        </main>

        <footer className="mt-8 text-center text-sm text-gray-400">
          <div>© Prunaverso — Kernel Log: v0.06</div>
          <div className="mt-2">“El jugador y el sistema fueron uno.”</div>
        </footer>
      </div>
    </div>
  )
}
