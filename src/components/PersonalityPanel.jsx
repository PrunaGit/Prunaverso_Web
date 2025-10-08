import React, { useState } from 'react'
import { useCognitiveLens } from '../hooks/useCognitiveLens'
import { USER_PREFERENCES } from '../utils/personalizedTransformer'

export function PersonalityPanel() {
  const { userProfile, setUserProfile } = useCognitiveLens()
  const [isExpanded, setIsExpanded] = useState(false)

  const updateProfile = (category, value) => {
    setUserProfile(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const personalityCategories = [
    { key: 'narrativeStyle', name: '📖 Estilo Narrativo', options: USER_PREFERENCES.narrativeStyle },
    { key: 'emotionalTone', name: '💫 Tono Emocional', options: USER_PREFERENCES.emotionalTone },
    { key: 'conceptualComplexity', name: '🧠 Complejidad', options: USER_PREFERENCES.conceptualComplexity },
    { key: 'culturalReferences', name: '🌍 Referencias', options: USER_PREFERENCES.culturalReferences },
    { key: 'presentationFormat', name: '📋 Formato', options: USER_PREFERENCES.presentationFormat }
  ]

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}>
        {/* Personality Indicator */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium"
        >
          <span className="text-lg">🎭</span>
          <span>Personalidad</span>
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▲</span>
        </button>

        {/* Personality Panel */}
        {isExpanded && (
          <div className="absolute bottom-full mb-2 right-0 bg-white rounded-xl shadow-2xl border p-4 min-w-80 max-h-96 overflow-y-auto">
            <div className="text-sm font-bold text-gray-800 mb-3 text-center">
              🎭 PERSONALIDAD COGNITIVA
            </div>
            
            <div className="space-y-4">
              {personalityCategories.map((category) => (
                <div key={category.key} className="space-y-2">
                  <div className="text-xs font-semibold text-gray-600">
                    {category.name}
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {Object.entries(category.options).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => updateProfile(category.key, key)}
                        className={`text-left px-3 py-2 rounded-md transition-colors text-xs ${
                          userProfile[category.key] === key
                            ? 'bg-purple-100 text-purple-800 font-medium border-2 border-purple-300'
                            : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-3 mt-4">
              <div className="text-xs text-gray-500 text-center">
                La personalidad adapta todos los textos a tu estilo único
              </div>
              <button
                onClick={() => setUserProfile({})}
                className="w-full mt-2 text-xs text-gray-400 hover:text-gray-600 transition-colors"
              >
                Resetear personalidad
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente para mostrar la personalidad activa de forma sutil
export function PersonalityIndicator() {
  const { userProfile } = useCognitiveLens()
  
  const getPersonalityEmoji = () => {
    const style = userProfile.narrativeStyle
    const tone = userProfile.emotionalTone
    
    if (style === 'poetic' && tone === 'contemplative') return '🌙'
    if (style === 'storytelling' && tone === 'warm') return '🔥'
    if (style === 'scientific' && tone === 'neutral') return '🔬'
    if (style === 'playful' && tone === 'energetic') return '⚡'
    if (style === 'philosophical' && tone === 'contemplative') return '🧩'
    return '🎭'
  }

  const hasCustomization = Object.keys(userProfile).length > 0

  if (!hasCustomization) return null

  return (
    <div className="fixed top-20 right-4 z-30 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-md">
      <div className="flex items-center gap-2 text-xs">
        <span>{getPersonalityEmoji()}</span>
        <span className="text-gray-600">Personalizado</span>
      </div>
    </div>
  )
}