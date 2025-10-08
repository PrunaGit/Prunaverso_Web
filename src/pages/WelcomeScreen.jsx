import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import InfoOrb from '../components/InfoOrb'

export default function WelcomeScreen() {
  const navigate = useNavigate()
  const [savedProfiles, setSavedProfiles] = useState([])
  const [showOptions, setShowOptions] = useState(false)
  const [charactersCount, setCharactersCount] = useState(0)

  useEffect(() => {
    // Cargar perfiles guardados del localStorage
    const profiles = []
    const keys = Object.keys(localStorage)
    
    keys.forEach(key => {
      if (key.startsWith('prunaverso_profile_')) {
        try {
          const profile = JSON.parse(localStorage.getItem(key))
          profiles.push({
            id: key.replace('prunaverso_profile_', ''),
            name: profile.name || 'Perfil sin nombre',
            lastPlayed: profile.lastPlayed || 'Nunca',
            lenses: profile.lenses || [],
            ...profile
          })
        } catch (e) {
          console.warn('Error loading profile:', key, e)
        }
      }
    })
    
    setSavedProfiles(profiles)

    // Cargar contador de personajes disponibles
    const loadCharactersCount = async () => {
      try {
        const response = await fetch('/data/characters_database.json')
        const data = await response.json()
        setCharactersCount(data.total_personajes || 0)
      } catch (error) {
        console.log('Error cargando personajes:', error)
        setCharactersCount(0)
      }
    }

    loadCharactersCount()
    
    // Mostrar opciones después de la animación inicial
    setTimeout(() => setShowOptions(true), 2000)
  }, [])

  const handleNewPlayer = () => {
    // Opción 1: Setup completo desde cero con filtro perceptual
    localStorage.removeItem('prunaverso_cognitive_lenses')
    localStorage.removeItem('prunaverso_academic_degree')
    localStorage.removeItem('prunaverso_user_profile')
    localStorage.removeItem('prunaverso_active_profile')
    
    // Navegar al setup de nuevo jugador con configuración cognitiva
    navigate('/cognitive-setup')
  }

  const handleCharacterSelector = () => {
    // Opción 2: Elegir réplica cognitiva existente con filtros preconfigurados
    navigate('/cognitive-setup')
  }

  const handleExistingPlayer = (profile) => {
    // Cargar el perfil seleccionado
    localStorage.setItem('prunaverso_cognitive_lenses', JSON.stringify(profile.lenses || ['ai']))
    localStorage.setItem('prunaverso_academic_degree', profile.degree || 'researcher')
    localStorage.setItem('prunaverso_user_profile', JSON.stringify(profile.userProfile || {}))
    localStorage.setItem('prunaverso_active_profile', profile.id)
    
    // Actualizar última vez jugado
    const updatedProfile = {
      ...profile,
      lastPlayed: new Date().toISOString()
    }
    localStorage.setItem(`prunaverso_profile_${profile.id}`, JSON.stringify(updatedProfile))
    
    // Navegar al portal principal con filtros perceptuales activos
    navigate('/portal')
  }

  const handleGuestMode = () => {
    // Modo invitado con filtros básicos por defecto
    localStorage.setItem('prunaverso_cognitive_lenses', JSON.stringify(['philosophy']))
    localStorage.setItem('prunaverso_academic_degree', 'general')
    navigate('/portal')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-purple-900 text-white flex items-center justify-center overflow-hidden">
      {/* Efecto de partículas de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, -100],
              opacity: [0.3, 0, 0.3]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Título principal */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <h1 className="text-6xl md:text-8xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            PRUNAVERSO
            <InfoOrb topic="que-es-el-prunaverso" size={24} style={{marginLeft: '12px', verticalAlign: 'top'}} />
          </h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 0.5 }}
            className="h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto mb-8"
          />
        </motion.div>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="text-xl md:text-2xl mb-8 text-gray-300"
        >
          Portal de Navegación Cognitiva Interdisciplinaria
        </motion.p>

        {/* Opciones principales */}
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Nuevo Jugador */}
            <motion.button
              onClick={handleNewPlayer}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(34, 197, 94, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full max-w-md mx-auto block px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl font-bold text-lg shadow-lg transition-all duration-300"
            >
              🚀 CREAR PERFIL NUEVO
              <p className="text-sm font-normal mt-1 opacity-90">Configurar desde cero</p>
            </motion.button>

            {/* Selector de Réplicas Cognitivas */}
            <motion.button
              onClick={handleCharacterSelector}
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(147, 51, 234, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full max-w-md mx-auto block px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-bold text-lg shadow-lg transition-all duration-300"
            >
              🧬 RÉPLICAS COGNITIVAS
              <p className="text-sm font-normal mt-1 opacity-90">
                {charactersCount > 0 ? `${charactersCount} perfiles del Prunaverso` : 'Cargando perfiles...'}
              </p>
            </motion.button>

            {/* Ya he estado aquí antes */}
            {savedProfiles.length > 0 ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-300">Ya he estado aquí antes</h3>
                <div className="grid gap-3 max-w-md mx-auto">
                  {savedProfiles.map((profile, index) => (
                    <motion.button
                      key={profile.id}
                      onClick={() => handleExistingPlayer(profile)}
                      whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(147, 51, 234, 0.4)" }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="p-4 bg-purple-800/30 backdrop-blur border border-purple-500/30 rounded-lg text-left hover:bg-purple-700/40 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{profile.name}</p>
                          <p className="text-sm text-gray-400">
                            Lentes: {profile.lenses?.length || 0} activas
                          </p>
                          <p className="text-xs text-gray-500">
                            Última vez: {profile.lastPlayed !== 'Nunca' ? new Date(profile.lastPlayed).toLocaleDateString() : 'Nunca'}
                          </p>
                        </div>
                        <div className="text-2xl">👤</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-500 text-sm"
              >
                No hay perfiles guardados aún
              </motion.div>
            )}

            {/* Modo Invitado */}
            <motion.button
              onClick={handleGuestMode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 text-gray-400 border border-gray-600 rounded-lg hover:text-white hover:border-gray-400 transition-all duration-300"
            >
              🎭 Modo Invitado (sin guardar progreso)
            </motion.button>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500"
        >
          "No es una web. Es una interfaz-juego cognitivo."
        </motion.div>
      </div>
    </div>
  )
}