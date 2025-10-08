import React, { useState } from 'react'
import { AdaptiveText, AdaptiveTitle, AdaptiveParagraph } from '../components/AdaptiveText'
import { useCognitiveLens } from '../hooks/useCognitiveLens'

export default function PersonalityDemo() {
  const { cognitiveLens, userProfile } = useCognitiveLens()
  const [demoText, setDemoText] = useState("Este sistema utiliza una interfaz cognitiva avanzada para procesar datos de manera inteligente y crear experiencias personalizadas.")

  const demoTexts = [
    "Este sistema utiliza una interfaz cognitiva avanzada para procesar datos de manera inteligente y crear experiencias personalizadas.",
    "El algoritmo de aprendizaje adapta sus respuestas según el paradigma cognitivo del usuario.",
    "La inteligencia artificial genera contenido contextualizado basado en preferencias neuropsicológicas.",
    "Este proceso de transformación textual permite una comunicación más efectiva entre humano y máquina.",
    "La arquitectura del sistema facilita la personalización dinámica del contenido según perfiles cognitivos."
  ]

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <AdaptiveTitle level={1} className="text-3xl font-bold mb-6 text-center">
        Demo de Personalización Cognitiva
      </AdaptiveTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel de configuración */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">📖 Textos de Prueba</h3>
            <div className="space-y-2">
              {demoTexts.map((text, index) => (
                <button
                  key={index}
                  onClick={() => setDemoText(text)}
                  className={`w-full text-left p-3 rounded-md text-sm transition-colors ${
                    demoText === text 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {text.substring(0, 60)}...
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">🎭 Estado Actual</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Lente Cognitiva:</span>
                <span className="ml-2 font-medium">{cognitiveLens || 'Ninguna'}</span>
              </div>
              <div>
                <span className="text-gray-400">Personalidad:</span>
                <span className="ml-2 font-medium">
                  {Object.keys(userProfile).length > 0 ? 'Configurada' : 'Por defecto'}
                </span>
              </div>
              {Object.keys(userProfile).length > 0 && (
                <div className="mt-2 p-2 bg-gray-700 rounded text-xs">
                  {Object.entries(userProfile).map(([key, value]) => (
                    <div key={key}>{key}: {value}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Panel de resultados */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">📝 Texto Original</h3>
            <div className="p-3 bg-gray-700 rounded text-sm text-gray-300">
              {demoText}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">✨ Texto Transformado</h3>
            <div className="p-3 bg-gray-700 rounded text-sm">
              <AdaptiveText className="text-white leading-relaxed">
                {demoText}
              </AdaptiveText>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">🧪 Transformación Sin Personalidad</h3>
            <div className="p-3 bg-gray-700 rounded text-sm">
              <AdaptiveText usePersonality={false} className="text-gray-400 leading-relaxed">
                {demoText}
              </AdaptiveText>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-purple-900/30 border border-purple-500/30 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-purple-300">💡 Instrucciones</h3>
        <div className="text-sm text-purple-200 space-y-1">
          <p>1. Selecciona una lente cognitiva con el botón flotante 🧠</p>
          <p>2. Configura tu personalidad con el panel 🎭</p>
          <p>3. Cambia el grado académico con el selector 🎓</p>
          <p>4. Observa cómo el texto se transforma automáticamente</p>
          <p>5. Compara las diferentes transformaciones</p>
        </div>
      </div>
    </div>
  )
}