import { useEffect, useRef } from 'react'

/**
 * 🎯 RENDER SENSOR - DOM Feedback Hook
 * 
 * Hook global que notifica al backend cuando la interfaz
 * ha sido montada y es visible para el usuario.
 */
export default function useRenderAlive() {
  const hasNotified = useRef(false)

  useEffect(() => {
    // Solo notificar una vez por sesión
    if (hasNotified.current) return

    const notifyRenderAlive = async () => {
      try {
        // Esperar a que el DOM esté completamente renderizado
        await new Promise(resolve => setTimeout(resolve, 100))
        
        // Verificar que el root element está presente y visible
        const rootElement = document.getElementById('root')
        if (!rootElement || !rootElement.children.length) {
          console.warn('🔴 useRenderAlive: Root element not ready')
          return
        }

        // Notificar al servidor que la UI está viva
        const response = await fetch('/api/render-alive', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            timestamp: Date.now(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            viewport: {
              width: window.innerWidth,
              height: window.innerHeight
            },
            elementCount: document.querySelectorAll('*').length
          })
        })

        if (response.ok) {
          console.log('🟢 Render Alive: UI successfully reported to server')
          hasNotified.current = true
        } else {
          console.warn('🔴 Render Alive: Server response not OK:', response.status)
        }
      } catch (error) {
        console.warn('🔴 Render Alive: Failed to notify server:', error.message)
      }
    }

    // Notificar después del primer render
    const timeoutId = setTimeout(notifyRenderAlive, 500)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [])

  // Hook para re-notificar manualmente si es necesario
  const renotify = async () => {
    hasNotified.current = false
    const timeoutId = setTimeout(async () => {
      await notifyRenderAlive()
    }, 100)
    return () => clearTimeout(timeoutId)
  }

  return {
    hasNotified: hasNotified.current,
    renotify
  }
}