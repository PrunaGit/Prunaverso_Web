import React, { useState, useEffect } from 'react'

// Función para calcular arquetipo basado en métricas cognitivas
const calculateArchetype = (metrics) => {
  if (!metrics) return { type: 'Desconocido', description: 'Perfil no disponible', emoji: '❓', color: '#64748b' }
  
  const V = metrics.V?.valor || 0
  const EX_x = metrics.EX_x?.valor || 0
  const EX_y = metrics.EX_y?.valor || 0
  const EY_x = metrics.EY_x?.valor || 0
  const EY_y = metrics.EY_y?.valor || 0
  const R = metrics.R?.valor || 0
  const D = metrics.D?.valor || 0
  const Di = metrics.Di?.valor || 0
  
  // Calculamos índices principales
  const exploracion_externa = (EX_x + EX_y) / 2
  const exploracion_interna = (EY_x + EY_y) / 2
  const creatividad = D
  const logica = R
  const energia = V
  const orden = Di
  
  // Clasificación de arquetipos basada en la ecuación primaria del Prunaverso
  if (exploracion_externa > 7 && creatividad > 6) {
    return { 
      type: 'Visionario Explorador', 
      description: 'Mente expansiva que conecta mundos externos con ideas innovadoras',
      emoji: '🌟',
      color: '#ff6b6b'
    }
  } else if (logica > 6 && orden > 5) {
    return { 
      type: 'Arquitecto Mental', 
      description: 'Constructor sistemático de estructuras cognitivas complejas',
      emoji: '🏗️',
      color: '#4ecdc4'
    }
  } else if (exploracion_interna > 6 && creatividad > 5) {
    return { 
      type: 'Chamán Digital', 
      description: 'Navegante de realidades internas con visión transformadora',
      emoji: '🔮',
      color: '#a855f7'
    }
  } else if (energia > 6 && exploracion_externa > 5) {
    return { 
      type: 'Catalizador Social', 
      description: 'Energía dinámica que acelera procesos y conexiones',
      emoji: '⚡',
      color: '#f59e0b'
    }
  } else if (logica > 5 && exploracion_interna > 5) {
    return { 
      type: 'Analista Profundo', 
      description: 'Mente analítica que desentraña patrones ocultos',
      emoji: '🔬',
      color: '#06b6d4'
    }
  } else if (creatividad > 7) {
    return { 
      type: 'Artista Cognitivo', 
      description: 'Creador de nuevas formas de percepción y expresión',
      emoji: '🎨',
      color: '#ec4899'
    }
  } else {
    return { 
      type: 'Equilibrista Mental', 
      description: 'Perfil balanceado con capacidades versátiles',
      emoji: '⚖️',
      color: '#64748b'
    }
  }
}

// Función para calcular stats RPG
const calculateRPGStats = (metrics) => {
  if (!metrics) return null
  
  const V = metrics.V?.valor || 0
  const EX_x = metrics.EX_x?.valor || 0
  const EX_y = metrics.EX_y?.valor || 0
  const EY_x = metrics.EY_x?.valor || 0
  const EY_y = metrics.EY_y?.valor || 0
  const R = metrics.R?.valor || 0
  const D = metrics.D?.valor || 0
  const Di = metrics.Di?.valor || 0
  const M = metrics.M?.valor || 0
  
  return {
    // Stats principales (0-10)
    energia: Math.round(V),
    exploracion: Math.round((EX_x + EX_y + EY_x + EY_y) / 4),
    creatividad: Math.round(D),
    logica: Math.round(R),
    memoria: Math.round(M),
    disciplina: Math.round(Di),
    
    // Stats derivados
    adaptabilidad: Math.round((D + V) / 2),
    profundidad: Math.round((EY_x + EY_y + R) / 3),
    carisma: Math.round((V + EX_x + EX_y) / 3)
  }
}

export default function CharacterSelectorRPG() {
  const [characters, setCharacters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [advancedView, setAdvancedView] = useState(false)
  const [selectedCharacter, setSelectedCharacter] = useState(null)

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        console.log('🔍 Cargando personajes...')
        const response = await fetch('/data/characters_database.json')
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const data = await response.json()
        console.log('✅ Personajes cargados:', data)
        
        setCharacters(data.personajes || [])
        setLoading(false)
      } catch (err) {
        console.error('❌ Error cargando personajes:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    loadCharacters()
  }, [])

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1>🔍 Cargando Arquetipos Mentales...</h1>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '3px solid rgba(255,255,255,0.3)',
            borderTop: '3px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto'
          }}></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        padding: '2rem'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '600px' }}>
          <h1>❌ Error Cargando Arquetipos</h1>
          <p style={{ backgroundColor: 'rgba(255,0,0,0.2)', padding: '1rem', borderRadius: '10px' }}>
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '1rem 2rem',
              backgroundColor: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            🔄 Reintentar
          </button>
          <br /><br />
          <a href="/" style={{ color: 'white', textDecoration: 'underline' }}>
            ← Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '1rem',
      boxSizing: 'border-box'
    }}>
      <div style={{ 
        width: '100%',
        maxWidth: '1200px', 
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '3rem',
          width: '100%',
          padding: '0 1rem'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(1.8rem, 5vw, 3rem)', 
            marginBottom: '1rem',
            textShadow: '0 0 20px rgba(255,255,255,0.5)',
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            lineHeight: '1.2'
          }}>
            🧬 ARQUETIPOS MENTALES DEL PRUNAVERSO
          </h1>
          <p style={{ 
            fontSize: '1.3rem', 
            opacity: 0.9,
            marginBottom: '1rem'
          }}>
            Selecciona tu réplica cognitiva basada en la ecuación primaria de clasificación de almas
          </p>
          <div style={{
            display: 'inline-block',
            background: 'rgba(255,255,255,0.2)',
            padding: '0.5rem 1rem',
            borderRadius: '20px',
            marginBottom: '1rem'
          }}>
            📊 {characters.length} arquetipos disponibles
          </div>
          <br />
          
          {/* Toggle Vista Avanzada */}
          <div style={{ margin: '1rem 0' }}>
            <button
              onClick={() => setAdvancedView(!advancedView)}
              style={{
                background: advancedView 
                  ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' 
                  : 'rgba(255,255,255,0.2)',
                border: 'none',
                padding: '0.8rem 1.5rem',
                borderRadius: '25px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: 'bold',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                boxShadow: advancedView ? '0 0 20px rgba(255,107,107,0.5)' : 'none'
              }}
            >
              {advancedView ? '🎮 Vista Casual' : '⚔️ Vista Avanzada RPG'}
            </button>
          </div>
          
          <a href="/" style={{ 
            color: 'rgba(255,255,255,0.8)', 
            textDecoration: 'underline',
            fontSize: '1rem',
            transition: 'color 0.3s ease'
          }}>
            ← Volver al menú principal
          </a>
        </div>

        {/* Lista de Personajes */}
        <div style={{ 
          display: 'grid',
          gridTemplateColumns: advancedView 
            ? 'repeat(auto-fit, minmax(400px, 1fr))' 
            : 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(1rem, 3vw, 2rem)',
          width: '100%',
          padding: '0 1rem'
        }}>
          {characters.map((character, index) => {
            const archetype = calculateArchetype(character.cognitive_metrics)
            const rpgStats = calculateRPGStats(character.cognitive_metrics)
            
            return (
              <div
                key={character.id || index}
                style={{
                  background: advancedView 
                    ? `linear-gradient(135deg, ${archetype.color}15, rgba(255,255,255,0.1))`
                    : 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '15px',
                  padding: 'clamp(1rem, 3vw, 2rem)',
                  backdropFilter: 'blur(10px)',
                  border: advancedView 
                    ? `2px solid ${archetype.color}` 
                    : '1px solid rgba(255, 255, 255, 0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: advancedView ? 'clamp(500px, 60vh, 700px)' : 'clamp(350px, 40vh, 500px)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)'
                  e.currentTarget.style.boxShadow = `0 10px 30px ${archetype.color}30`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
                onClick={() => {
                  if (advancedView) {
                    setSelectedCharacter(selectedCharacter === character.id ? null : character.id)
                  } else {
                    // Selección casual - ir directo al portal
                    const selectedArchetype = {
                      id: character.id,
                      nombre: character.nombre,
                      arquetipo: archetype.type,
                      avatar: character.avatar,
                      lentes: character.perfil_cognitivo?.lentes_dominantes || [],
                      neurodivergencia: character.perfil_cognitivo?.neurodivergencia || 'no especificada'
                    }
                    
                    localStorage.setItem('prunaverso_selected_archetype', JSON.stringify(selectedArchetype))
                    
                    const confirmation = confirm(
                      `🌟 Has elegido el arquetipo "${archetype.type}"\n\n` +
                      `👤 Réplica: ${character.nombre}\n` +
                      `🔍 Perspectivas: ${character.perfil_cognitivo?.lentes_dominantes?.join(', ') || 'ninguna'}\n` +
                      `🧠 Perfil: ${character.perfil_cognitivo?.neurodivergencia || 'no especificada'}\n\n` +
                      `¿Continuar al Portal del Prunaverso?`
                    )
                    
                    if (confirmation) {
                      window.location.href = '/portal'
                    }
                  }
                }}
              >
                {/* Vista Casual */}
                {!advancedView && (
                  <>
                    {/* Avatar y Arquetipo */}
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <div style={{ 
                        fontSize: 'clamp(3rem, 8vw, 4rem)', 
                        marginBottom: '0.5rem'
                      }}>
                        {archetype.emoji}
                      </div>
                      <h3 style={{ 
                        margin: '0 0 0.5rem 0', 
                        fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                        background: `linear-gradient(45deg, ${archetype.color}, #ffffff)`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: '1.3'
                      }}>
                        {archetype.type}
                      </h3>
                      <div style={{ 
                        fontSize: '1rem',
                        color: 'rgba(255,255,255,0.9)',
                        marginBottom: '0.5rem'
                      }}>
                        {character.nombre}
                      </div>
                      <div style={{
                        fontSize: '0.9rem',
                        opacity: 0.7,
                        fontStyle: 'italic'
                      }}>
                        {archetype.description}
                      </div>
                    </div>

                    {/* Lentes Cognitivas Resumidas */}
                    {character.perfil_cognitivo?.lentes_dominantes && (
                      <div style={{ marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                          {character.perfil_cognitivo.lentes_dominantes.slice(0, 3).map((lens, i) => (
                            <span
                              key={i}
                              style={{
                                background: `${archetype.color}30`,
                                padding: '0.3rem 0.8rem',
                                borderRadius: '15px',
                                fontSize: '0.8rem',
                                border: `1px solid ${archetype.color}60`
                              }}
                            >
                              {lens}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Vista Avanzada RPG */}
                {advancedView && (
                  <>
                    {/* Header RPG */}
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        marginBottom: '1rem'
                      }}>
                        <span style={{ fontSize: '2.5rem', marginRight: '1rem' }}>{archetype.emoji}</span>
                        <div style={{ textAlign: 'left' }}>
                          <h3 style={{ 
                            margin: '0', 
                            fontSize: '1.3rem',
                            color: archetype.color
                          }}>
                            {archetype.type}
                          </h3>
                          <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                            {character.nombre}
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        opacity: 0.7, 
                        fontStyle: 'italic',
                        marginBottom: '1rem'
                      }}>
                        {archetype.description}
                      </div>
                    </div>

                    {/* Stats RPG */}
                    {rpgStats && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ 
                          margin: '0 0 1rem 0', 
                          fontSize: '1rem',
                          color: archetype.color
                        }}>
                          ⚔️ Atributos Cognitivos
                        </h4>
                        <div style={{ 
                          display: 'grid',
                          gridTemplateColumns: 'repeat(2, 1fr)',
                          gap: '0.8rem',
                          fontSize: '0.85rem'
                        }}>
                          {[
                            { key: 'energia', label: 'Energía', icon: '⚡' },
                            { key: 'creatividad', label: 'Creatividad', icon: '🎨' },
                            { key: 'logica', label: 'Lógica', icon: '🧠' },
                            { key: 'exploracion', label: 'Exploración', icon: '🔍' },
                            { key: 'memoria', label: 'Memoria', icon: '💾' },
                            { key: 'disciplina', label: 'Disciplina', icon: '🎯' }
                          ].map(stat => (
                            <div key={stat.key} style={{ 
                              display: 'flex', 
                              alignItems: 'center',
                              justifyContent: 'space-between'
                            }}>
                              <span style={{ opacity: 0.9 }}>
                                {stat.icon} {stat.label}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{
                                  width: '60px',
                                  height: '8px',
                                  background: 'rgba(255,255,255,0.2)',
                                  borderRadius: '4px',
                                  overflow: 'hidden',
                                  marginRight: '0.5rem'
                                }}>
                                  <div style={{
                                    width: `${(rpgStats[stat.key] / 10) * 100}%`,
                                    height: '100%',
                                    background: `linear-gradient(90deg, ${archetype.color}, ${archetype.color}cc)`,
                                    borderRadius: '4px'
                                  }}></div>
                                </div>
                                <span style={{ 
                                  minWidth: '20px', 
                                  textAlign: 'right',
                                  fontWeight: 'bold',
                                  color: archetype.color
                                }}>
                                  {rpgStats[stat.key]}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Lentes Cognitivas */}
                    {character.perfil_cognitivo?.lentes_dominantes && (
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ 
                          margin: '0 0 0.8rem 0', 
                          fontSize: '1rem',
                          color: archetype.color
                        }}>
                          🔍 Perspectivas Dominantes
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {character.perfil_cognitivo.lentes_dominantes.map((lens, i) => (
                            <span
                              key={i}
                              style={{
                                background: `${archetype.color}20`,
                                padding: '0.4rem 0.8rem',
                                borderRadius: '12px',
                                fontSize: '0.75rem',
                                border: `1px solid ${archetype.color}40`,
                                textTransform: 'capitalize'
                              }}
                            >
                              {lens}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Info Expandida */}
                    {selectedCharacter === character.id && (
                      <div style={{ 
                        background: 'rgba(0,0,0,0.3)',
                        padding: '1rem',
                        borderRadius: '10px',
                        fontSize: '0.85rem',
                        marginTop: '1rem'
                      }}>
                        <h4 style={{ margin: '0 0 0.8rem 0', color: archetype.color }}>
                          📊 Detalles Avanzados
                        </h4>
                        
                        {/* Pros y Contras */}
                        <div style={{ marginBottom: '1rem' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                              <strong style={{ color: '#10b981' }}>✅ Fortalezas:</strong>
                              <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem', fontSize: '0.8rem' }}>
                                <li>Alta {rpgStats.creatividad > 6 ? 'creatividad' : rpgStats.logica > 6 ? 'lógica' : 'adaptabilidad'}</li>
                                <li>Perspectiva {character.perfil_cognitivo?.lentes_dominantes?.[0] || 'única'}</li>
                                <li>Capacidad de {rpgStats.exploracion > 6 ? 'exploración' : 'análisis'}</li>
                              </ul>
                            </div>
                            <div>
                              <strong style={{ color: '#ef4444' }}>⚠️ Áreas de mejora:</strong>
                              <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem', fontSize: '0.8rem' }}>
                                <li>{rpgStats.disciplina < 4 ? 'Disciplina baja' : 'Estructura organizativa'}</li>
                                <li>{rpgStats.memoria < 4 ? 'Memoria limitada' : 'Procesamiento secuencial'}</li>
                                <li>Balance energético</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Características Cognitivas */}
                        {character.perfil_cognitivo?.caracteristicas && (
                          <div style={{ marginBottom: '1rem' }}>
                            <strong>🧠 Perfil Cognitivo:</strong>
                            <ul style={{ margin: '0.5rem 0', paddingLeft: '1.2rem' }}>
                              {character.perfil_cognitivo.caracteristicas.slice(0, 3).map((car, i) => (
                                <li key={i} style={{ marginBottom: '0.3rem', opacity: 0.9, fontSize: '0.8rem' }}>
                                  {car}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Neurodivergencia */}
                        {character.perfil_cognitivo?.neurodivergencia && character.perfil_cognitivo.neurodivergencia !== 'no especificada' && (
                          <div style={{ marginBottom: '1rem' }}>
                            <strong>🧬 Neurodivergencia:</strong> {character.perfil_cognitivo.neurodivergencia}
                          </div>
                        )}

                        {/* Botón de selección */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            const selectedArchetype = {
                              id: character.id,
                              nombre: character.nombre,
                              arquetipo: archetype.type,
                              avatar: character.avatar,
                              stats: rpgStats,
                              lentes: character.perfil_cognitivo?.lentes_dominantes || [],
                              neurodivergencia: character.perfil_cognitivo?.neurodivergencia || 'no especificada'
                            }
                            
                            localStorage.setItem('prunaverso_selected_archetype', JSON.stringify(selectedArchetype))
                            
                            const confirmation = confirm(
                              `⚔️ CONFIGURACIÓN AVANZADA ACTIVADA\n\n` +
                              `🌟 Arquetipo: ${archetype.type}\n` +
                              `👤 Réplica: ${character.nombre}\n` +
                              `⚡ Energía: ${rpgStats.energia}/10\n` +
                              `🎨 Creatividad: ${rpgStats.creatividad}/10\n` +
                              `🧠 Lógica: ${rpgStats.logica}/10\n\n` +
                              `¿Iniciar experiencia Prunaverso con esta configuración?`
                            )
                            
                            if (confirmation) {
                              window.location.href = '/portal'
                            }
                          }}
                          style={{
                            background: `linear-gradient(45deg, ${archetype.color}, ${archetype.color}cc)`,
                            border: 'none',
                            padding: '0.8rem 1.5rem',
                            borderRadius: '20px',
                            color: 'white',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            width: '100%'
                          }}
                        >
                          ⚔️ SELECCIONAR ARQUETIPO
                        </button>
                      </div>
                    )}

                    {/* Indicador de click para más info */}
                    {selectedCharacter !== character.id && (
                      <div style={{ 
                        textAlign: 'center', 
                        marginTop: 'auto',
                        paddingTop: '1rem',
                        opacity: 0.6,
                        fontSize: '0.8rem'
                      }}>
                        👆 Click para ver pros/contras y configuración avanzada
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '4rem',
          padding: 'clamp(2rem, 5vw, 3rem) 1rem',
          borderTop: '1px solid rgba(255,255,255,0.2)',
          background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.3))',
          width: '100%'
        }}>
          <div style={{ 
            fontSize: 'clamp(1rem, 3vw, 1.1rem)', 
            marginBottom: '1rem',
            background: 'linear-gradient(45deg, #ffd700, #ffb700)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold',
            lineHeight: '1.3'
          }}>
            🌟 Tu arquetipo mental será tu guía en el Prunaverso
          </div>
          <p style={{ 
            fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)', 
            opacity: 0.8,
            maxWidth: '600px',
            margin: '0 auto 1.5rem auto',
            lineHeight: '1.6',
            padding: '0 1rem'
          }}>
            Cada arquetipo está basado en la ecuación primaria de clasificación de almas del Prunaverso.
            En vista casual: selección rápida. En vista avanzada: configuración detallada estilo RPG.
          </p>
          <p style={{ 
            opacity: 0.6, 
            fontSize: 'clamp(0.7rem, 2vw, 0.8rem)'
          }}>
            🎮 Prunaverso - Sistema de Arquetipos Cognitivos v2.0
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Media queries para mejorar responsividad */
        @media (max-width: 768px) {
          .character-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }

        @media (max-width: 480px) {
          .character-card {
            padding: 1rem !important;
            min-height: 300px !important;
          }
        }

        /* Mejoras para dispositivos táctiles */
        @media (hover: none) {
          .character-card:hover {
            transform: none !important;
          }
          .character-card:active {
            transform: scale(0.98) !important;
            transition: transform 0.1s ease !important;
          }
        }
      `}</style>
    </div>
  )
}