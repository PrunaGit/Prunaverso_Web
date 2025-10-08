import React from 'react'
import { useCognitiveLens } from '../hooks/useCognitiveLens'

export default function SystemTest() {
  const { cognitiveLenses, setCognitiveLenses, academicDegree, userProfile } = useCognitiveLens()

  const testLensChange = () => {
    setCognitiveLenses(['psychology'])
    console.log('Lenses changed to psychology')
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🔧 Sistema de Diagnóstico</h1>
      
      <div className="space-y-6">
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Estado Actual del Sistema</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Lentes Cognitivas:</strong> {JSON.stringify(cognitiveLenses)}</p>
            <p><strong>Grado Académico:</strong> {academicDegree}</p>
            <p><strong>Perfil de Usuario:</strong> {JSON.stringify(userProfile, null, 2)}</p>
          </div>
        </div>

        <div className="bg-blue-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Test de Funcionalidad</h2>
          <button 
            onClick={testLensChange}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            🧠 Cambiar a Psicología
          </button>
        </div>

        <div className="bg-green-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Navegación</h2>
          <div className="space-y-2">
            <a href="/#/" className="block text-blue-600 hover:underline">🏠 Portal Principal</a>
            <a href="/#/cognitive-sciences" className="block text-blue-600 hover:underline">🧠 Ciencias Cognitivas</a>
            <a href="/#/personality-demo" className="block text-blue-600 hover:underline">🎭 Demo Personalidad</a>
            <a href="/#/profile-demo" className="block text-blue-600 hover:underline">👥 Demo Perfiles</a>
            <a href="/#/lens-atmosphere" className="block text-blue-600 hover:underline">🎨 Demo Atmosférico</a>
          </div>
        </div>

        <div className="bg-yellow-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Diagnóstico Técnico</h2>
          <div className="space-y-1 text-sm">
            <p>✅ Hook useCognitiveLens: {typeof useCognitiveLens === 'function' ? 'OK' : 'ERROR'}</p>
            <p>✅ LocalStorage: {typeof localStorage !== 'undefined' ? 'OK' : 'ERROR'}</p>
            <p>✅ React Router: {window.location.hash ? 'Usando Hash Router' : 'Browser Router'}</p>
            <p>✅ Ubicación actual: {window.location.href}</p>
          </div>
        </div>
      </div>
    </div>
  )
}