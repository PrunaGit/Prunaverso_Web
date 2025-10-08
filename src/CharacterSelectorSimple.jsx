import React from 'react'

export default function CharacterSelectorSimple() {
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
        🧬 Arquetipos Mentales
      </h1>
      <p style={{ 
        fontSize: '1.2rem', 
        marginBottom: '2rem',
        textAlign: 'center',
        opacity: 0.8
      }}>
        Selector de arquetipos funcionando correctamente
      </p>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a 
          href="/" 
          style={{
            background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            padding: '1rem 2rem',
            borderRadius: '25px',
            color: 'white',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: 'bold'
          }}
        >
          🏠 Inicio
        </a>
        <a 
          href="/portal" 
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
          🚀 Portal
        </a>
      </div>
    </div>
  )
}