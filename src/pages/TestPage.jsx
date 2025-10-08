import React from 'react'

export default function TestPage() {
  return (
    <div style={{ 
      padding: '2rem',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🧪 PÁGINA DE PRUEBA</h1>
      <p>Si puedes ver esto, el routing funciona correctamente.</p>
      <div style={{ marginTop: '2rem' }}>
        <a href="/" style={{ color: '#fff', textDecoration: 'underline' }}>
          🏠 Volver al inicio
        </a>
        <br /><br />
        <a href="/characters" style={{ color: '#fff', textDecoration: 'underline' }}>
          🧬 Selector de personajes
        </a>
        <br /><br />
        <a href="/lens-atmosphere" style={{ color: '#fff', textDecoration: 'underline' }}>
          🌌 Atmósfera Prunaversal ¡NUEVO!
        </a>
      </div>
    </div>
  )
}