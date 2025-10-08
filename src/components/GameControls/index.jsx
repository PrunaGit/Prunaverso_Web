import React from 'react'
import { motion } from 'framer-motion'

/**
 * 🎮 CONTROLES GAMING - PlayStation & PC
 * 
 * Componente que muestra los controles disponibles para cada elemento interactivo
 */
export default function GameControls({ type = "default", keyboardKey, playstationButton, label }) {
  const getKeyboardIcon = (key) => {
    const keyMappings = {
      'ENTER': '⏎',
      'SPACE': '⎵',
      'ESC': 'Esc',
      'TAB': '⇥',
      'SHIFT': '⇧',
      'CTRL': 'Ctrl',
      'ALT': 'Alt',
      'UP': '↑',
      'DOWN': '↓',
      'LEFT': '←',
      'RIGHT': '→',
      'W': 'W',
      'A': 'A',
      'S': 'S',
      'D': 'D',
      '1': '1',
      '2': '2',
      '3': '3',
      '4': '4',
      'E': 'E',
      'Q': 'Q',
      'F': 'F',
      'R': 'R'
    }
    return keyMappings[key] || key
  }

  const getPlayStationIcon = (button) => {
    const buttonMappings = {
      'X': '✕',      // Cross
      'O': '○',      // Circle  
      'SQUARE': '□', // Square
      'TRIANGLE': '△', // Triangle
      'L1': 'L1',
      'L2': 'L2',
      'R1': 'R1',
      'R2': 'R2',
      'START': 'OPTIONS',
      'SELECT': 'SHARE',
      'DPAD_UP': '⬆',
      'DPAD_DOWN': '⬇',
      'DPAD_LEFT': '⬅',
      'DPAD_RIGHT': '➡',
      'LEFT_STICK': 'L3',
      'RIGHT_STICK': 'R3'
    }
    return buttonMappings[button] || button
  }

  const controlStyles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '0.85rem',
      opacity: 0.8,
      transition: 'all 0.3s ease'
    },
    button: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '4px',
      padding: '0.2rem 0.4rem',
      color: 'white',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      minWidth: '1.5rem',
      textAlign: 'center',
      backdropFilter: 'blur(5px)'
    },
    playstationButton: {
      background: 'rgba(0, 100, 255, 0.2)',
      border: '1px solid rgba(0, 100, 255, 0.5)',
      borderRadius: '50%',
      padding: '0.3rem',
      color: '#00a8ff',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      width: '1.8rem',
      height: '1.8rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(5px)'
    },
    label: {
      color: 'rgba(255, 255, 255, 0.9)',
      fontWeight: '500'
    }
  }

  return (
    <motion.div 
      style={controlStyles.container}
      whileHover={{ opacity: 1, scale: 1.05 }}
    >
      {/* Teclado PC */}
      {keyboardKey && (
        <div style={controlStyles.button}>
          {getKeyboardIcon(keyboardKey)}
        </div>
      )}
      
      {/* PlayStation Controller */}
      {playstationButton && (
        <div style={controlStyles.playstationButton}>
          {getPlayStationIcon(playstationButton)}
        </div>
      )}
      
      {/* Label */}
      {label && (
        <span style={controlStyles.label}>
          {label}
        </span>
      )}
    </motion.div>
  )
}

// Hook para manejar controles de teclado
export function useKeyboardControls(controls) {
  React.useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key.toUpperCase()
      
      // Buscar acción correspondiente
      const action = controls.find(control => 
        control.key === key || 
        control.key === event.code ||
        (control.key === 'ENTER' && event.key === 'Enter') ||
        (control.key === 'SPACE' && event.key === ' ')
      )
      
      if (action && action.action) {
        event.preventDefault()
        action.action()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [controls])
}

// Componente de ayuda de controles
export function ControlsHelp({ controls, visible = true }) {
  if (!visible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '2rem',
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '10px',
        padding: '1rem',
        maxWidth: '300px',
        zIndex: 1000
      }}
    >
      <div style={{ 
        color: 'white', 
        fontSize: '0.9rem', 
        fontWeight: 'bold', 
        marginBottom: '0.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        🎮 Controles
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {controls.map((control, index) => (
          <GameControls 
            key={index}
            keyboardKey={control.keyboard}
            playstationButton={control.playstation}
            label={control.label}
          />
        ))}
      </div>
    </motion.div>
  )
}