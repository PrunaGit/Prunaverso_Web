import React, { useState } from 'react'
import CognitiveLensSelector from '../components/CognitiveLensSelector'

export default function CognitiveSciences() {
  const [selectedLens, setSelectedLens] = useState(null)

  const handleStartSession = () => {
    if (!selectedLens) {
      alert('Selecciona primero una lente cognitiva')
      return
    }
    
    // Aquí puedes navegar a la experiencia específica o guardar el estado
    alert(`Iniciando sesión con lente: ${selectedLens}`)
    // Por ejemplo: navigate('/session/start', { state: { cognitiveLens: selectedLens } })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <CognitiveLensSelector 
          selectedLens={selectedLens}
          onLensChange={setSelectedLens}
        />
        
        {selectedLens && (
          <div className="text-center mt-8">
            <button
              onClick={handleStartSession}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Iniciar Experiencia Cognitiva
            </button>
          </div>
        )}
        
        <div className="mt-12 text-center text-gray-400">
          <p className="text-sm">
            "El conocimiento surge de la interacción, no de la representación" - Enactivismo
          </p>
        </div>
      </div>
    </div>
  )
}