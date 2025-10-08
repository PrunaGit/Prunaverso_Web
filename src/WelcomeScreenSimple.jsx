import React from 'react'

export default function WelcomeScreenSimple() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 30%, #16213e 70%, #0f3460 100%)',
      color: 'white',
      fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ 
        fontSize: '3rem', 
        marginBottom: '1rem',
        textAlign: 'center'
      }}>
        🌌 Bienvenido al Prunaverso
      </h1>
      <p style={{ 
        fontSize: '1.2rem', 
        marginBottom: '2rem',
        textAlign: 'center',
        opacity: 0.8,
        maxWidth: '600px',
        lineHeight: '1.6'
      }}>
        Portal de Arquetipos Cognitivos Interactivos<br/>
        Explora la diversidad cognitiva a través de réplicas mentales basadas en<br/>
        la ecuación primaria de clasificación de almas del Prunaverso
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '2rem' }}>
        <a 
          href="/arquetipos" 
          style={{
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            padding: '1.5rem 3rem',
            borderRadius: '25px',
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)',
            transform: 'scale(1)',
            transition: 'all 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          🧬 EXPLORAR ARQUETIPOS MENTALES
        </a>
      </div>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a 
          href="/characters" 
          style={{
            background: 'linear-gradient(45deg, #4ecdc4, #45b7d1)',
            padding: '1rem 2rem',
            borderRadius: '25px',
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          🎮 Selector RPG
        </a>
        <a 
          href="/portal" 
          style={{
            background: 'linear-gradient(45deg, #45b7d1, #96c93d)',
            padding: '1rem 2rem',
            borderRadius: '25px',
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          🚀 Portal Principal
        </a>
      </div>
    </div>
  )
}