import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCognitiveLens } from '../hooks/useCognitiveLens'
import { getAllAvailableProfiles, applyProfile } from '../utils/userProfiles'

export function ProfileSelector() {
  const [isExpanded, setIsExpanded] = useState(false)
  const { activeProfile, setActiveProfile } = useCognitiveLens()
  
  const profiles = getAllAvailableProfiles()
  const currentProfile = profiles.find(p => p.id === activeProfile) || profiles[0]

  const handleProfileSelect = (profileId) => {
    const profile = applyProfile(profileId)
    setActiveProfile(profileId)
    setIsExpanded(false)
    
    // Notificación visual
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Perfil activado: ${profile.name}`, {
        body: profile.description,
        icon: '/favicon.ico'
      })
    }
  }

  return (
    <div className="fixed top-4 left-4 z-40">
      <div className={`transition-all duration-300 ${isExpanded ? 'opacity-100' : 'opacity-80 hover:opacity-100'}`}>
        {/* Profile Indicator */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`flex items-center gap-3 bg-gradient-to-r ${currentProfile.color} text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-medium min-w-40`}
        >
          <span className="text-lg">{currentProfile.emoji}</span>
          <div className="flex flex-col items-start">
            <span className="font-semibold">{currentProfile.name}</span>
            {currentProfile.isDefault && <span className="text-xs opacity-75">Canal Base</span>}
          </div>
          <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
        </button>

        {/* Profile Selection Panel */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-2xl border p-4 min-w-96 max-h-96 overflow-y-auto"
          >
            <div className="text-sm font-bold text-gray-800 mb-3 text-center">
              🎭 SELECCIONAR PERFIL COGNITIVO
            </div>
            
            <div className="space-y-2">
              {profiles.map((profile) => (
                <motion.button
                  key={profile.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProfileSelect(profile.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all ${
                    activeProfile === profile.id
                      ? `bg-gradient-to-r ${profile.color} text-white shadow-md`
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{profile.emoji}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{profile.name}</span>
                        {profile.isDefault && (
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            BASE
                          </span>
                        )}
                        {profile.isCustom && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                            CUSTOM
                          </span>
                        )}
                      </div>
                      <p className="text-xs opacity-75 mt-1">{profile.description}</p>
                      
                      {/* Mostrar lentes cognitivas del perfil */}
                      <div className="flex gap-1 mt-2">
                        {profile.cognitiveLenses.map((lensId) => {
                          const lensEmojis = {
                            psychology: '🧠',
                            neuroscience: '⚡',
                            ai: '🤖',
                            linguistics: '💬',
                            philosophy: '🧩',
                            anthropology: '🌍'
                          }
                          return (
                            <span key={lensId} className="text-xs" title={lensId}>
                              {lensEmojis[lensId]}
                            </span>
                          )
                        })}
                      </div>
                    </div>
                    {activeProfile === profile.id && (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="border-t pt-3 mt-4">
              <div className="text-xs text-gray-500 text-center mb-2">
                Los perfiles combinan lentes cognitivas + personalidad + grado académico
              </div>
              <button
                onClick={() => {
                  // Resetear a perfil base Alex Pruna
                  handleProfileSelect('alex_pruna')
                }}
                className="w-full text-xs text-purple-600 hover:text-purple-800 transition-colors font-medium"
              >
                🔄 Volver al Canal Base (Alex Pruna)
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

// Indicador compacto del perfil activo
export function ProfileIndicator() {
  const { activeProfile } = useCognitiveLens()
  const profiles = getAllAvailableProfiles()
  const currentProfile = profiles.find(p => p.id === activeProfile) || profiles[0]

  return (
    <div className="fixed top-4 right-4 z-30">
      <div className={`bg-gradient-to-r ${currentProfile.color} text-white px-3 py-1 rounded-full shadow-md text-xs font-medium`}>
        <span className="mr-2">{currentProfile.emoji}</span>
        {currentProfile.isDefault && 'Canal Base: '}
        {currentProfile.name}
      </div>
    </div>
  )
}