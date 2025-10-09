import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import useVisitorProfile from '../../hooks/useVisitorProfile'
import archetypesData from '../../system-core/schemas/archetypes.json'

/**
 * 🌀 ONBOARDING COGNITIVO - PRUNAVERSO
 * 
 * Primera interfaz que calibra la conciencia del visitante
 * y configura su experiencia adaptativa en el metaverso.
 */
export default function CognitiveOnboarding() {
  const navigate = useNavigate()
  const { profile, evolveProfile, setArchetype, isNewcomer } = useVisitorProfile()
  const [step, setStep] = useState('welcome')
  const [selectedArchetype, setSelectedArchetype] = useState(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [breathingPhase, setBreathingPhase] = useState(0)

  // Animación de respiración del fondo
  useEffect(() => {
    const breathingTimer = setInterval(() => {
      setBreathingPhase(prev => (prev + 1) % 100)
    }, 50)
    return () => clearInterval(breathingTimer)
  }, [])

  // Auto-skip si no es newcomer
  useEffect(() => {
    if (!isNewcomer && profile) {
      setTimeout(() => navigate('/portal'), 1000)
    }
  }, [isNewcomer, profile, navigate])

  const handlePathChoice = async (pathType) => {
    setIsTransitioning(true)
    
    switch(pathType) {
      case 'curious':
        evolveProfile('curious')
        setTimeout(() => navigate('/portal'), 1500)
        break
        
      case 'archetype':
        setStep('archetype-selection')
        setIsTransitioning(false)
        break
        
      case 'create':
        evolveProfile('architect', { 
          lenses: ['systems', 'consciousness', 'ai'],
          tone: 'technical',
          complexity: 'high'
        })
        setTimeout(() => navigate('/creator'), 1500)
        break
        
      default:
        evolveProfile('curious')
        setTimeout(() => navigate('/portal'), 1500)
    }
  }

  const handleArchetypeSelection = (archetype) => {
    setSelectedArchetype(archetype)
    setArchetype(archetype)
    setIsTransitioning(true)
    
    // Configurar lentes y tono según el arquetipo
    const archetypeConfig = {
      lenses: archetype.lenses,
      tone: 'narrative',
      colors: [archetypesData.auralFrequencies[archetype.aura].hex, '#ffffff'],
      aura: archetype.aura
    }
    
    evolveProfile('role_player', archetypeConfig)
    
    setTimeout(() => navigate('/portal'), 2000)
  }

  const getRecommendedArchetypes = () => {
    return archetypesData.baseArchetypes.filter(arch => 
      archetypesData.cognitiveProfiles.curious.recommendedArchetypes.includes(arch.id)
    )
  }

  if (!isNewcomer) {
    return (
      <motion.div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f0f23, #1a1a2e)',
          color: 'white'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ textAlign: 'center' }}
        >
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🌀</div>
          <div>Bienvenido de vuelta al Prunaverso...</div>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(circle at center, 
        rgba(${15 + breathingPhase * 0.1}, ${15 + breathingPhase * 0.1}, ${35 + breathingPhase * 0.2}, 1) 0%, 
        rgba(${26}, ${26}, ${46}, 1) 100%)`,
      color: 'white',
      fontFamily: '"Segoe UI", system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Efectos de fondo */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 40%, rgba(120, 200, 255, 0.05) 0%, transparent 50%)
        `,
        opacity: Math.sin(breathingPhase * 0.1) * 0.3 + 0.7
      }} />

      <AnimatePresence mode="wait">
        {step === 'welcome' && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', maxWidth: '600px' }}
          >
            {/* Logo/Símbolo principal */}
            <motion.div
              animate={{ 
                rotateY: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                rotateY: { duration: 10, repeat: Infinity, ease: "linear" },
                scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
              }}
              style={{ 
                fontSize: '4rem', 
                marginBottom: '2rem',
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textShadow: '0 0 20px rgba(255, 107, 107, 0.3)'
              }}
            >
              🌀
            </motion.div>

            {/* Título */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                fontWeight: '300',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #fff, #e0e0e0)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Bienvenido al Prunaverso
            </motion.h1>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                fontSize: '1.2rem',
                opacity: 0.8,
                marginBottom: '3rem',
                lineHeight: '1.6'
              }}
            >
              Un metaverso que se adapta a tu conciencia
              <br />
              <span style={{ fontSize: '0.9rem', opacity: 0.6 }}>
                El sistema calibrará tu experiencia según tu apertura cognitiva
              </span>
            </motion.p>

            {/* Opciones de entrada */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
                alignItems: 'center'
              }}
            >
              {/* Opción 1: Entrar sin saber */}
              <motion.button
                onClick={() => handlePathChoice('curious')}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: '0 20px 40px rgba(74, 144, 226, 0.3)',
                  background: 'linear-gradient(135deg, #4a90e2, #7ed321)'
                }}
                whileTap={{ scale: 0.98 }}
                disabled={isTransitioning}
                style={{
                  background: 'rgba(74, 144, 226, 0.2)',
                  border: '2px solid rgba(74, 144, 226, 0.5)',
                  borderRadius: '25px',
                  padding: '1.2rem 2.5rem',
                  color: 'white',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  minWidth: '280px'
                }}
              >
                🔍 Entrar sin saber
                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.3rem' }}>
                  Exploración guiada y adaptativa
                </div>
              </motion.button>

              {/* Opción 2: Elegir arquetipo */}
              <motion.button
                onClick={() => handlePathChoice('archetype')}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(255, 107, 107, 0.3)',
                  background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)'
                }}
                whileTap={{ scale: 0.98 }}
                disabled={isTransitioning}
                style={{
                  background: 'rgba(255, 107, 107, 0.2)',
                  border: '2px solid rgba(255, 107, 107, 0.5)',
                  borderRadius: '25px',
                  padding: '1.2rem 2.5rem',
                  color: 'white',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  minWidth: '280px'
                }}
              >
                🧬 Despertar como arquetipo
                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.3rem' }}>
                  Elige tu identidad cognitiva
                </div>
              </motion.button>

              {/* Opción 3: Modo creador */}
              <motion.button
                onClick={() => handlePathChoice('create')}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 40px rgba(156, 39, 176, 0.3)',
                  background: 'linear-gradient(135deg, #9c27b0, #673ab7)'
                }}
                whileTap={{ scale: 0.98 }}
                disabled={isTransitioning}
                style={{
                  background: 'rgba(156, 39, 176, 0.2)',
                  border: '2px solid rgba(156, 39, 176, 0.5)',
                  borderRadius: '25px',
                  padding: '1.2rem 2.5rem',
                  color: 'white',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  minWidth: '280px'
                }}
              >
                🛠️ Entrar como arquitecto
                <div style={{ fontSize: '0.8rem', opacity: 0.7, marginTop: '0.3rem' }}>
                  Crear y modificar el metaverso
                </div>
              </motion.button>
            </motion.div>
          </motion.div>
        )}

        {step === 'archetype-selection' && (
          <motion.div
            key="archetype"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.6 }}
            style={{ 
              textAlign: 'center', 
              maxWidth: '800px',
              width: '100%'
            }}
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                fontSize: '2.5rem',
                marginBottom: '1rem',
                background: 'linear-gradient(135deg, #ff6b6b, #4ecdc4)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent'
              }}
            >
              Elige tu Arquetipo Cognitivo
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                fontSize: '1.1rem',
                opacity: 0.8,
                marginBottom: '2rem'
              }}
            >
              Cada arquetipo configura una experiencia única del Prunaverso
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                maxWidth: '900px'
              }}
            >
              {getRecommendedArchetypes().map((archetype, index) => (
                <motion.div
                  key={archetype.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: `0 15px 30px ${archetypesData.auralFrequencies[archetype.aura].hex}30`
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleArchetypeSelection(archetype)}
                  style={{
                    background: `linear-gradient(135deg, ${archetypesData.auralFrequencies[archetype.aura].hex}20, rgba(255,255,255,0.05))`,
                    border: `2px solid ${archetypesData.auralFrequencies[archetype.aura].hex}50`,
                    borderRadius: '15px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    backdropFilter: 'blur(10px)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ 
                    fontSize: '2rem', 
                    marginBottom: '0.5rem',
                    color: archetypesData.auralFrequencies[archetype.aura].hex
                  }}>
                    {archetype.name.includes('Ϟ') ? '⚡' : 
                     archetype.name.includes('Ψ') ? '🏗️' : 
                     archetype.name.includes('Φ') ? '🧭' : 
                     archetype.name.includes('Ω') ? '📖' : '🌟'}
                  </div>
                  
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    marginBottom: '0.5rem',
                    color: 'white'
                  }}>
                    {archetype.name}
                  </h3>
                  
                  <p style={{
                    fontSize: '0.9rem',
                    opacity: 0.8,
                    marginBottom: '0.5rem',
                    lineHeight: '1.4'
                  }}>
                    {archetype.description}
                  </p>
                  
                  <div style={{
                    fontSize: '0.8rem',
                    fontStyle: 'italic',
                    opacity: 0.7,
                    color: archetypesData.auralFrequencies[archetype.aura].hex
                  }}>
                    "{archetype.entryPhrase}"
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              onClick={() => setStep('welcome')}
              style={{
                marginTop: '2rem',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '10px',
                padding: '0.8rem 1.5rem',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              ← Volver a opciones principales
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Indicador de transición */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
            }}
            style={{ 
              fontSize: '3rem',
              filter: 'drop-shadow(0 0 20px rgba(255, 107, 107, 0.7))'
            }}
          >
            🌀
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}