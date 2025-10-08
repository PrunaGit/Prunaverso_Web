import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Portal() {
  const [selectedArchetype, setSelectedArchetype] = useState(null)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // Cargar arquetipo seleccionado si existe
    try {
      const saved = localStorage.getItem('prunaverso_selected_archetype')
      if (saved) {
        setSelectedArchetype(JSON.parse(saved))
        setShowDetails(true)
      }
    } catch (error) {
      console.error('Error cargando arquetipo:', error)
    }

    // Actualizar reloj
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit'
    })
  }

  const startCognitiveSession = () => {
    if (selectedArchetype) {
      // Guardar timestamp de inicio de sesión
      const sessionData = {
        ...selectedArchetype,
        sessionStart: new Date().toISOString(),
        sessionId: Date.now()
      }
      localStorage.setItem('prunaverso_current_session', JSON.stringify(sessionData))
      
      alert(`🌟 Iniciando sesión cognitiva con arquetipo: ${selectedArchetype.arquetipo}\n\nRéplica: ${selectedArchetype.nombre}\n\nLa experiencia comenzará ahora...`)
    } else {
      alert('Primero debes seleccionar un arquetipo mental en la sección de Arquetipos.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 30%, #16213e 70%, #0f3460 100%)',
      color: 'white',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
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
          radial-gradient(circle at 25% 75%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
          radial-gradient(circle at 75% 25%, rgba(255, 119, 198, 0.15) 0%, transparent 50%)
        `,
        animation: 'pulse 6s ease-in-out infinite'
      }}></div>

      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '2rem',
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          zIndex: 10,
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.5rem'
          }}>
            🌌
          </div>
          <div>
            <h1 style={{ 
              fontSize: 'clamp(1.5rem, 4vw, 2rem)', 
              fontWeight: 'bold', 
              margin: 0,
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Portal Prunaverso
            </h1>
            <p style={{ 
              fontSize: '0.9rem', 
              opacity: 0.7, 
              margin: 0 
            }}>
              Interfaz Neural Cognitiva v2.0
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
            {formatTime(currentTime)}
          </div>
          <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
            Portal Activo
          </div>
        </div>
      </motion.header>

      {/* Contenido principal */}
      <div style={{ 
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        position: 'relative',
        zIndex: 10
      }}>

        {/* Estado del arquetipo */}
        {selectedArchetype && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(15px)',
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center'
            }}
          >
            <h2 style={{ 
              fontSize: '1.5rem', 
              marginBottom: '1rem',
              color: '#4ecdc4'
            }}>
              🧬 Arquetipo Mental Activo
            </h2>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '1.5rem',
                borderRadius: '15px'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                  {selectedArchetype.avatar || '👤'}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                  {selectedArchetype.arquetipo}
                </div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                  Réplica: {selectedArchetype.nombre}
                </div>
              </div>

              {selectedArchetype.lentes && selectedArchetype.lentes.length > 0 && (
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '1.5rem',
                  borderRadius: '15px'
                }}>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    🔍 Perspectivas Cognitivas
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                    {selectedArchetype.lentes.map((lens, i) => (
                      <span
                        key={i}
                        style={{
                          background: 'rgba(78, 205, 196, 0.3)',
                          padding: '0.3rem 0.8rem',
                          borderRadius: '15px',
                          fontSize: '0.8rem',
                          border: '1px solid rgba(78, 205, 196, 0.5)'
                        }}
                      >
                        {lens}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedArchetype.stats && (
                <div style={{
                  background: 'rgba(255,255,255,0.1)',
                  padding: '1.5rem',
                  borderRadius: '15px'
                }}>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    ⚔️ Stats RPG
                  </div>
                  <div style={{ fontSize: '0.8rem', textAlign: 'left' }}>
                    <div>⚡ Energía: {selectedArchetype.stats.energia}/10</div>
                    <div>🎨 Creatividad: {selectedArchetype.stats.creatividad}/10</div>
                    <div>🧠 Lógica: {selectedArchetype.stats.logica}/10</div>
                  </div>
                </div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={startCognitiveSession}
              style={{
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                border: 'none',
                padding: '1rem 2.5rem',
                borderRadius: '50px',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)'
              }}
            >
              🚀 INICIAR SESIÓN COGNITIVA
            </motion.button>
          </motion.div>
        )}

        {/* Sin arquetipo seleccionado */}
        {!selectedArchetype && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(15px)',
              padding: '3rem',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧬</div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
              No hay arquetipo mental seleccionado
            </h2>
            <p style={{ fontSize: '1rem', opacity: 0.8, marginBottom: '2rem', lineHeight: '1.6' }}>
              Para acceder al Portal completo, primero debes seleccionar un arquetipo mental<br />
              que definirá tu experiencia cognitiva en el Prunaverso.
            </p>
            <motion.a
              href="/characters"
              whileHover={{ scale: 1.05 }}
              style={{
                display: 'inline-block',
                background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
                padding: '1rem 2rem',
                borderRadius: '50px',
                color: 'white',
                textDecoration: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)'
              }}
            >
              🔍 SELECCIONAR ARQUETIPO MENTAL
            </motion.a>
          </motion.div>
        )}

        {/* Panel de funciones del portal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem'
          }}
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(15px)',
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onClick={() => window.location.href = '/characters'}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧬</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Arquetipos Mentales</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Explora y selecciona tu réplica cognitiva ideal
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(15px)',
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onClick={() => window.location.href = '/lens-atmosphere'}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔮</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Atmósfera Cognitiva</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Sincronización audio-visual para lentes cognitivas
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(15px)',
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onClick={() => window.location.href = '/test'}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🧪</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Laboratorio</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Experimentos y pruebas del sistema
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(15px)',
              padding: '2rem',
              borderRadius: '20px',
              border: '1px solid rgba(255,255,255,0.2)',
              textAlign: 'center',
              cursor: 'pointer'
            }}
            onClick={() => window.location.href = '/'}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🏠</div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Inicio</h3>
            <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
              Volver a la pantalla de bienvenida
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}