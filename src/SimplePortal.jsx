import React from 'react'

export default function SimplePortal() {
  console.log('🏠 SimplePortal loaded successfully')
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: '#00ff00' }}>✅ Prunaverso Portal - MODO SIMPLE</h1>
      <p>Si ves esto, React está funcionando correctamente.</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>🔗 Enlaces de prueba:</h2>
        <ul>
          <li><a href="/debug" style={{color: '#00aaff'}}>🔧 Debug Test</a></li>
          <li><a href="/system-test" style={{color: '#00aaff'}}>🧪 System Test</a></li>
          <li><a href="/architecture" style={{color: '#00aaff'}}>🧩 Architecture</a></li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#333', borderRadius: '5px' }}>
        <p><strong>Timestamp:</strong> {new Date().toISOString()}</p>
        <p><strong>Port:</strong> {window.location.port}</p>
        <p><strong>URL:</strong> {window.location.href}</p>
      </div>
    </div>
  )
}