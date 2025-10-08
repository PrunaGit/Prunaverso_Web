import React from 'react'

export default function DebugTest() {
  console.log('🔧 DebugTest component loaded successfully')
  
  return (
    <div className="p-8 bg-green-100 text-green-800">
      <h1 className="text-2xl font-bold">✅ Debug Test Page</h1>
      <p>Si ves esto, React está funcionando correctamente.</p>
      <div className="mt-4">
        <p>Timestamp: {new Date().toISOString()}</p>
        <p>Port: {window.location.port}</p>
        <p>URL: {window.location.href}</p>
      </div>
    </div>
  )
}