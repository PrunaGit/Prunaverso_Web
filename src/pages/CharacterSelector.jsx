import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CharacterSelector() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCharacter, setSelectedCharacter] = useState(null)
  const [filterLens, setFilterLens] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadCharacters()
  }, [])

  const loadCharacters = async () => {
    try {
      const response = await fetch('/data/characters_database.json')
      const data = await response.json()
      setCharacters(data.personajes || [])
      setLoading(false)
    } catch (error) {
      console.error('Error cargando personajes:', error)
      setLoading(false)
    }
  }

  const filteredCharacters = characters.filter(char => {
    const matchesSearch = char.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLens = filterLens === 'all' || 
      char.perfil_cognitivo?.lentes_dominantes?.includes(filterLens)
    return matchesSearch && matchesLens
  })

  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character)
    
    // Guardar perfil seleccionado en localStorage
    const profile = {
      id: character.id,
      name: character.nombre,
      lenses: character.perfil_cognitivo?.lentes_dominantes || ['ai'],
      degree: 'researcher',
      userProfile: character.metricas_cognitivas || {},
      lastPlayed: new Date().toISOString(),
      character: character
    }
    
    localStorage.setItem(`prunaverso_profile_${character.id}`, JSON.stringify(profile))
    localStorage.setItem('prunaverso_active_profile', character.id)
    
    // Aplicar configuración cognitiva
    localStorage.setItem('prunaverso_cognitive_lenses', JSON.stringify(profile.lenses))
    
    // Navegar al portal
    setTimeout(() => {
      window.location.href = '/portal'
    }, 1500)
  }

  const getCognitiveBadgeColor = (lens) => {
    const colors = {
      ai: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      psychology: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
      neuroscience: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
      linguistics: 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30',
      philosophy: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      anthropology: 'bg-teal-500/20 text-teal-300 border-teal-500/30'
    }
    return colors[lens] || 'bg-gray-500/20 text-gray-300 border-gray-500/30'
  }

  const getMetricColor = (value) => {
    if (value >= 8) return 'text-green-400'
    if (value >= 6) return 'text-yellow-400'
    if (value >= 4) return 'text-orange-400'
    return 'text-red-400'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando réplicas cognitivas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Header */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
            🧬 Selector de Réplicas Cognitivas
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Elige un perfil cognitivo para explorar el Prunaverso desde su perspectiva única. 
            Cada personaje tiene patrones mentales, lentes dominantes y métricas específicas.
          </p>
        </motion.header>

        {/* Filtros */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex flex-wrap gap-4 justify-center"
        >
          {/* Búsqueda */}
          <input
            type="text"
            placeholder="Buscar personaje..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
          />
          
          {/* Filtro por lente */}
          <select
            value={filterLens}
            onChange={(e) => setFilterLens(e.target.value)}
            className="px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg focus:border-purple-500 focus:outline-none"
          >
            <option value="all">Todas las lentes</option>
            <option value="ai">🤖 IA</option>
            <option value="psychology">🧠 Psicología</option>
            <option value="neuroscience">⚡ Neurociencia</option>
            <option value="linguistics">💬 Lingüística</option>
            <option value="philosophy">🧩 Filosofía</option>
            <option value="anthropology">🌍 Antropología</option>
          </select>
        </motion.div>

        {/* Grid de personajes */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredCharacters.map((character, index) => (
            <motion.div
              key={character.id + index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectCharacter(character)}
              className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-6 cursor-pointer hover:bg-gray-700/50 transition-all duration-300"
            >
              {/* Avatar y nombre */}
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{character.avatar}</div>
                <h3 className="text-lg font-semibold">{character.nombre}</h3>
                <p className="text-sm text-gray-400">{character.edad ? `${character.edad} años` : ''}</p>
                <p className="text-xs text-gray-500">{character.idioma}</p>
              </div>

              {/* Lentes cognitivas */}
              <div className="mb-4">
                <p className="text-xs text-gray-400 mb-2">Lentes dominantes:</p>
                <div className="flex flex-wrap gap-1">
                  {character.perfil_cognitivo?.lentes_dominantes?.map(lens => (
                    <span 
                      key={lens}
                      className={`px-2 py-1 text-xs rounded border ${getCognitiveBadgeColor(lens)}`}
                    >
                      {lens}
                    </span>
                  ))}
                </div>
              </div>

              {/* Métricas cognitivas */}
              {character.metricas_cognitivas && Object.keys(character.metricas_cognitivas).length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">Métricas RPG:</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {Object.entries(character.metricas_cognitivas).slice(0, 6).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="text-gray-500">{key}:</span>
                        <span className={getMetricColor(value)}>{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Neurodivergencia */}
              {character.perfil_cognitivo?.neurodivergencia && (
                <div className="mb-4">
                  <p className="text-xs text-gray-400">Neurotipo:</p>
                  <p className="text-xs text-purple-300">{character.perfil_cognitivo.neurodivergencia}</p>
                </div>
              )}

              {/* Contexto */}
              {character.contexto?.rol && (
                <div>
                  <p className="text-xs text-gray-400">Rol:</p>
                  <p className="text-xs text-gray-300">{character.contexto.rol}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Estadísticas */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          <p>{filteredCharacters.length} réplicas cognitivas disponibles</p>
          <a href="/" className="text-purple-400 hover:text-purple-300 mt-2 inline-block">
            ← Volver a la bienvenida
          </a>
        </motion.div>
      </div>

      {/* Modal de selección */}
      <AnimatePresence>
        {selectedCharacter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 rounded-xl p-8 max-w-md mx-4"
            >
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedCharacter.avatar}</div>
                <h3 className="text-2xl font-bold mb-2">{selectedCharacter.nombre}</h3>
                <p className="text-gray-300 mb-6">
                  Cargando perfil cognitivo...
                </p>
                <div className="animate-pulse flex space-x-1 justify-center">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animation-delay-200"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animation-delay-400"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}