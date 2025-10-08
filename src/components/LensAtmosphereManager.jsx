import { useEffect } from 'react'
import { useCognitiveLens } from '../hooks/useCognitiveLens'
import { getCombinedTheme, LENS_ANIMATIONS } from '../styles/lensesTheme'
import { useSoundAtmosphere } from '../hooks/useSoundAtmosphere'

export function LensAtmosphereManager() {
  const { cognitiveLenses } = useCognitiveLens()
  const { 
    isBreathingEnabled, 
    isPlaying, 
    startSoundAtmosphere, 
    stopSoundAtmosphere, 
    toggleBreathing,
    currentFrequency
  } = useSoundAtmosphere()

  useEffect(() => {
    // Inyectar CSS de animaciones si no existe
    if (!document.getElementById('lens-animations')) {
      const style = document.createElement('style')
      style.id = 'lens-animations'
      style.textContent = LENS_ANIMATIONS
      document.head.appendChild(style)
    }

    // Obtener tema combinado
    const theme = getCombinedTheme(cognitiveLenses)
    const primaryLens = cognitiveLenses[0] || 'psychology'

    // Aplicar data-lens al body para CSS global
    document.body.dataset.lens = primaryLens
    document.body.dataset.lensCount = cognitiveLenses.length.toString()

    // Aplicar variables CSS customizadas
    const root = document.documentElement
    root.style.setProperty('--lens-primary', theme.color.primary)
    root.style.setProperty('--lens-secondary', theme.color.secondary)
    root.style.setProperty('--lens-accent', theme.color.accent)
    root.style.setProperty('--lens-bg', theme.color.background)
    root.style.setProperty('--lens-gradient', `linear-gradient(135deg, ${theme.color.primary}, ${theme.color.secondary})`)

    // Aplicar patrón de fondo si hay múltiples lentes
    if (cognitiveLenses.length > 1) {
      document.body.style.backgroundImage = theme.atmosphere.backgroundPattern
      document.body.style.backgroundSize = 'cover'
      document.body.style.backgroundAttachment = 'fixed'
    } else {
      document.body.style.backgroundImage = theme.atmosphere.backgroundPattern
      document.body.style.backgroundSize = '200% 200%'
      document.body.style.backgroundAttachment = 'fixed'
    }

    // Aplicar animación de fondo según el tipo
    const backgroundElements = document.querySelectorAll('.lens-background')
    backgroundElements.forEach(el => {
      el.className = `lens-background lens-${theme.animation.type}`
    })

    // Aplicar efectos a elementos interactivos
    const buttons = document.querySelectorAll('button, a, .interactive')
    buttons.forEach(el => {
      el.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      el.addEventListener('mouseenter', () => {
        el.style.boxShadow = `0 0 20px ${theme.color.primary}40`
        if (theme.animation.type === 'ripple') {
          el.classList.add('lens-ripple')
          setTimeout(() => el.classList.remove('lens-ripple'), 600)
        }
      })
      el.addEventListener('mouseleave', () => {
        el.style.boxShadow = ''
      })
    })

    // Notificación sutil de cambio de lente
    if (cognitiveLenses.length > 0) {
      showLensChangeNotification(theme, cognitiveLenses)
    }

    // Cleanup function
    return () => {
      // Remover event listeners si es necesario
      buttons.forEach(el => {
        el.style.boxShadow = ''
      })
    }
  }, [cognitiveLenses])

  return (
    <>
      {/* Widget de Control de Atmósfera Prunaversal */}
      <div className="fixed bottom-4 right-4 z-50 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg">
        <div className="text-white text-sm font-medium mb-3">
          🌌 Atmósfera Prunaversal
        </div>
        
        <div className="space-y-2">
          {/* Control de sonido */}
          <button
            onClick={isPlaying ? stopSoundAtmosphere : startSoundAtmosphere}
            className="w-full px-3 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isPlaying ? '🔇' : '🔊'} 
            {isPlaying ? 'Silenciar' : 'Activar Sonido'}
          </button>

          {/* Control de respiración */}
          <button
            onClick={toggleBreathing}
            disabled={!isPlaying}
            className={`w-full px-3 py-2 rounded-lg text-white text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
              isPlaying 
                ? (isBreathingEnabled 
                    ? 'bg-emerald-500/30 hover:bg-emerald-500/40' 
                    : 'bg-white/20 hover:bg-white/30'
                  )
                : 'bg-gray-500/20 cursor-not-allowed'
            }`}
          >
            {isBreathingEnabled ? '🫁' : '💨'} 
            Respiración {isBreathingEnabled ? 'ON' : 'OFF'}
          </button>

          {/* Indicador de frecuencia */}
          {currentFrequency && (
            <div className="text-white/70 text-xs text-center">
              {Math.round(currentFrequency)} Hz
            </div>
          )}
        </div>
      </div>
    </>
  ) // Este componente renderiza el widget de control
}

function showLensChangeNotification(theme, lenses) {
  // Crear notificación visual sutil
  const notification = document.createElement('div')
  notification.className = 'fixed top-20 right-4 z-50 px-4 py-2 rounded-lg text-white text-sm font-medium transition-all duration-500 transform translate-x-full'
  notification.style.backgroundColor = theme.color.primary
  notification.style.boxShadow = `0 4px 20px ${theme.color.primary}40`
  
  if (lenses.length === 1) {
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <span>${theme.emoji}</span>
        <span>Lente ${theme.name}</span>
      </div>
    `
  } else {
    notification.innerHTML = `
      <div class="flex items-center gap-2">
        <span>🔮</span>
        <span>${lenses.length} lentes activas</span>
      </div>
    `
  }

  document.body.appendChild(notification)

  // Animar entrada
  setTimeout(() => {
    notification.style.transform = 'translateX(0)'
  }, 100)

  // Animar salida
  setTimeout(() => {
    notification.style.transform = 'translateX(full)'
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification)
      }
    }, 500)
  }, 2000)
}

// Hook para aplicar efectos específicos de lente a componentes
export function useLensEffects() {
  const { cognitiveLenses } = useCognitiveLens()
  const theme = getCombinedTheme(cognitiveLenses)

  const applyLensEffect = (element, effectType = 'hover') => {
    if (!element) return

    switch (effectType) {
      case 'hover':
        element.addEventListener('mouseenter', () => {
          element.style.color = theme.color.primary
          element.style.textShadow = theme.atmosphere.textShadow
          if (theme.animation.type === 'wave') {
            element.classList.add('lens-wave')
          }
        })
        element.addEventListener('mouseleave', () => {
          element.style.color = ''
          element.style.textShadow = ''
          element.classList.remove('lens-wave')
        })
        break

      case 'focus':
        element.addEventListener('focus', () => {
          element.style.outline = `2px solid ${theme.color.primary}`
          element.style.outlineOffset = '2px'
        })
        element.addEventListener('blur', () => {
          element.style.outline = ''
          element.style.outlineOffset = ''
        })
        break

      case 'animate':
        element.classList.add(`lens-${theme.animation.type}`)
        break
    }
  }

  const getLensClasses = () => {
    return {
      text: `${theme.atmosphere.fontFamily} lens-transition`,
      button: `${theme.effects.buttons} lens-transition`,
      border: `${theme.effects.borders} lens-transition`,
      glow: `${theme.effects.glow}`,
      background: `bg-gradient-to-r ${theme.color.gradient}`
    }
  }

  return {
    theme,
    applyLensEffect,
    getLensClasses,
    isMultipleLenses: cognitiveLenses.length > 1
  }
}