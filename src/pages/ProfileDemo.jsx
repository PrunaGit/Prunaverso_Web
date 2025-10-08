import React, { useState } from 'react'
import { AdaptiveText, AdaptiveTitle, AdaptiveParagraph } from '../components/AdaptiveText'
import { useCognitiveLens } from '../hooks/useCognitiveLens'
import { getAllAvailableProfiles, applyProfile } from '../utils/userProfiles'

export default function ProfileDemo() {
  const { cognitiveLenses, userProfile, activeProfile } = useCognitiveLens()
  const [demoText, setDemoText] = useState("El sistema de inteligencia artificial procesa datos complejos para generar respuestas contextualmente relevantes mediante algoritmos adaptativos.")

  const profiles = getAllAvailableProfiles()
  const currentProfile = profiles.find(p => p.id === activeProfile) || profiles[0]

  const demoTexts = [
    "El sistema de inteligencia artificial procesa datos complejos para generar respuestas contextualmente relevantes mediante algoritmos adaptativos.",
    "La interfaz permite al usuario interactuar con el proceso de manera intuitiva y eficiente.",
    "Los algoritmos de aprendizaje automático analizan patrones en los datos para optimizar el rendimiento.",
    "Esta tecnología facilita la comunicación entre humanos y máquinas de forma natural.",
    "El paradigma cognitivo influye en cómo percibimos y procesamos la información del entorno."
  ]

  const testProfile = (profileId) => {
    applyProfile(profileId)
    // Forzar re-render después de un breve delay para mostrar el cambio
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('forceUpdate'))
    }, 100)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <AdaptiveTitle level={1} className="text-3xl font-bold mb-6 text-center">
        Demo de Perfiles Predefinidos
      </AdaptiveTitle>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel de Perfil Actual */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">👤 Perfil Activo</h3>
            <div className={`p-4 rounded-lg bg-gradient-to-r ${currentProfile.color} text-white mb-3`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{currentProfile.emoji}</span>
                <div>
                  <div className="font-bold">{currentProfile.name}</div>
                  {currentProfile.isDefault && (
                    <div className="text-xs opacity-75">Canal Base del Prunaverso</div>
                  )}
                </div>
              </div>
              <p className="text-sm opacity-90">{currentProfile.description}</p>
            </div>
            
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-400">Lentes Activas:</span>
                <div className="flex gap-1 mt-1">
                  {cognitiveLenses.map(lens => (
                    <span key={lens} className="bg-gray-700 px-2 py-1 rounded text-xs">
                      {lens}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-gray-400">Personalidad:</span>
                <div className="text-xs mt-1 space-y-1">
                  {Object.entries(userProfile).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span>{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">📖 Textos de Prueba</h3>
            <div className="space-y-2">
              {demoTexts.map((text, index) => (
                <button
                  key={index}
                  onClick={() => setDemoText(text)}
                  className={`w-full text-left p-2 rounded text-xs transition-colors ${
                    demoText === text 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {text.substring(0, 50)}...
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel de Transformación */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">📝 Texto Original</h3>
            <div className="p-3 bg-gray-700 rounded text-sm text-gray-300 leading-relaxed">
              {demoText}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">✨ Transformación Actual</h3>
            <div className="p-3 bg-gray-700 rounded text-sm leading-relaxed">
              <AdaptiveText className="text-white">
                {demoText}
              </AdaptiveText>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">🎭 Sin Personalidad</h3>
            <div className="p-3 bg-gray-700 rounded text-sm leading-relaxed">
              <AdaptiveText usePersonality={false} className="text-gray-400">
                {demoText}
              </AdaptiveText>
            </div>
          </div>
        </div>

        {/* Panel de Perfiles */}
        <div className="space-y-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-3">🎭 Probar Perfiles</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {profiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => testProfile(profile.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    activeProfile === profile.id
                      ? `bg-gradient-to-r ${profile.color} text-white shadow-md`
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{profile.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{profile.name}</span>
                        {profile.isDefault && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-1 py-0.5 rounded">
                            BASE
                          </span>
                        )}
                      </div>
                      <p className="text-xs opacity-75 mt-1">{profile.description}</p>
                      
                      {/* Lentes del perfil */}
                      <div className="flex gap-1 mt-1">
                        {profile.cognitiveLenses.map((lensId) => {
                          const lensEmojis = {
                            psychology: '🧠', neuroscience: '⚡', ai: '🤖',
                            linguistics: '💬', philosophy: '🧩', anthropology: '🌍'
                          }
                          return (
                            <span key={lensId} className="text-xs" title={lensId}>
                              {lensEmojis[lensId]}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-purple-900/30 border border-purple-500/30 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-purple-300">💡 Sistema de Canales Cognitivos</h3>
        <div className="text-sm text-purple-200 space-y-2">
          <p><strong>🎭 Canal Base Alex Pruna:</strong> Perspectiva fundacional del Prunaverso con enfoque filosófico-tecnológico</p>
          <p><strong>🔄 Selección Múltiple:</strong> Combina hasta 6 lentes cognitivas simultáneamente</p>
          <p><strong>👥 Perfiles Predefinidos:</strong> Configuraciones optimizadas para diferentes tipos de usuarios</p>
          <p><strong>⚡ Transformación Instantánea:</strong> Todo el contenido se adapta automáticamente al perfil activo</p>
          <p><strong>🧠 Persistencia:</strong> Tu configuración se mantiene entre sesiones</p>
        </div>
        
        <div className="mt-4 p-4 bg-purple-800/30 rounded-lg">
          <div className="text-xs text-purple-300 font-semibold mb-2">INSTRUCCIONES:</div>
          <ol className="text-xs text-purple-200 space-y-1 list-decimal list-inside">
            <li>Selecciona un perfil predefinido de la lista</li>
            <li>Observa cómo cambia la transformación del texto</li>
            <li>Usa el selector flotante para modificar lentes individuales</li>
            <li>Ajusta la personalidad con el panel lateral</li>
            <li>Experimenta con diferentes combinaciones</li>
          </ol>
        </div>
      </div>
    </div>
  )
}