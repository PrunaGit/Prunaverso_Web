import React from 'react'

export default function SessionStart() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">Iniciar Partida</h2>
      <p className="mt-2 text-gray-300">Aquí se inicializará la sesión y se crearán checkpoints.</p>
      <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => alert('Start session (not implemented)')}>Start</button>
    </div>
  )
}
