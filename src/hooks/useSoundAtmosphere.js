import { useEffect, useRef, useState } from 'react'
import { useCognitiveLens } from './useCognitiveLens'
import { getCombinedTheme } from '../styles/lensesTheme'

/**
 * 🎵 Hook para gestionar la atmósfera sonora sincronizada con respiración prunaversal
 */
export function useSoundAtmosphere() {
  const { cognitiveLenses } = useCognitiveLens()
  const [isBreathingEnabled, setIsBreathingEnabled] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  
  const audioContextRef = useRef(null)
  const oscillatorRef = useRef(null)
  const gainNodeRef = useRef(null)
  const animationFrameRef = useRef(null)
  const startTimeRef = useRef(null)

  // Mapeo de colores a frecuencias (Hz)
  const hueToFrequency = (hue) => {
    // Mapear 0-360° de hue a frecuencias 220-880 Hz (escala musical agradable)
    return 220 + (hue / 360) * 660
  }

  // Extraer hue del color primario de la lente
  const getHueFromColor = (color) => {
    // Convertir hex/rgb a HSL y extraer hue
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = color
    const computed = ctx.fillStyle
    
    // Simplificado: mapear colores conocidos a hues aproximados
    const colorToHue = {
      '#fbbf24': 45,   // psychology - amber
      '#3b82f6': 215,  // neuroscience - blue
      '#10b981': 160,  // biology - green
      '#8b5cf6': 270,  // ai - purple
      '#ef4444': 0,    // linguistics - red
      '#f59e0b': 40,   // philosophy - orange
      '#06b6d4': 190,  // art - cyan
      '#84cc16': 80    // science - lime
    }
    
    return colorToHue[color] || 200 // default blue
  }

  // Inicializar Audio Context
  const initializeAudio = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
      }

      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume()
      }

      return true
    } catch (error) {
      console.warn('Error inicializando audio:', error)
      return false
    }
  }

  // Crear oscilador y nodos de audio
  const createAudioNodes = (frequency) => {
    if (!audioContextRef.current) return null

    // Crear oscilador
    const oscillator = audioContextRef.current.createOscillator()
    oscillator.type = 'sine'
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime)

    // Crear nodo de ganancia para controlar volumen
    const gainNode = audioContextRef.current.createGain()
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime) // Volumen bajo inicial

    // Conectar nodos
    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)

    return { oscillator, gainNode }
  }

  // Ciclo de respiración (8 segundos)
  const updateBreathing = () => {
    if (!isBreathingEnabled || !gainNodeRef.current || !audioContextRef.current) return

    const currentTime = audioContextRef.current.currentTime
    if (!startTimeRef.current) {
      startTimeRef.current = currentTime
    }

    const elapsed = currentTime - startTimeRef.current
    
    // Ciclo de respiración de 8 segundos
    const breathingCycle = (2 * Math.PI / 8) * elapsed
    const breathing = 0.5 + 0.5 * Math.sin(breathingCycle)

    // Modular volumen del audio
    gainNodeRef.current.gain.setTargetAtTime(breathing * 0.15, currentTime, 0.5)

    // Modular filtros visuales del body
    const brightness = 0.9 + 0.1 * breathing
    const saturation = 1 + 0.1 * breathing
    document.body.style.filter = `brightness(${brightness}) saturate(${saturation})`

    // Continuar el ciclo
    animationFrameRef.current = requestAnimationFrame(updateBreathing)
  }

  // Iniciar atmósfera sonora
  const startSoundAtmosphere = async () => {
    const audioReady = await initializeAudio()
    if (!audioReady) return

    const theme = getCombinedTheme(cognitiveLenses)
    const hue = getHueFromColor(theme.color.primary)
    const frequency = hueToFrequency(hue)

    // Detener oscilador anterior si existe
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
    }

    // Crear nuevos nodos de audio
    const { oscillator, gainNode } = createAudioNodes(frequency)
    if (!oscillator || !gainNode) return

    oscillatorRef.current = oscillator
    gainNodeRef.current = gainNode

    // Iniciar oscilador
    oscillator.start()
    setIsPlaying(true)

    // Si la respiración está habilitada, iniciar ciclo
    if (isBreathingEnabled) {
      startTimeRef.current = null
      updateBreathing()
    }
  }

  // Detener atmósfera sonora
  const stopSoundAtmosphere = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop()
      oscillatorRef.current = null
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }

    // Resetear filtros visuales
    document.body.style.filter = ''
    
    setIsPlaying(false)
    startTimeRef.current = null
  }

  // Toggle respiración prunaversal
  const toggleBreathing = () => {
    setIsBreathingEnabled(prev => {
      const newState = !prev
      
      if (newState && isPlaying) {
        // Activar respiración
        startTimeRef.current = null
        updateBreathing()
      } else if (!newState) {
        // Desactivar respiración
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
          animationFrameRef.current = null
        }
        document.body.style.filter = ''
        
        // Mantener volumen base si el sonido sigue activo
        if (gainNodeRef.current && audioContextRef.current) {
          gainNodeRef.current.gain.setTargetAtTime(0.1, audioContextRef.current.currentTime, 0.5)
        }
      }
      
      return newState
    })
  }

  // Cambiar frecuencia cuando cambian las lentes (crossfade suave)
  useEffect(() => {
    if (isPlaying && oscillatorRef.current && audioContextRef.current) {
      const theme = getCombinedTheme(cognitiveLenses)
      const hue = getHueFromColor(theme.color.primary)
      const newFrequency = hueToFrequency(hue)
      
      // Crossfade suave de 3 segundos
      const currentTime = audioContextRef.current.currentTime
      oscillatorRef.current.frequency.setTargetAtTime(newFrequency, currentTime, 3.0)
    }
  }, [cognitiveLenses, isPlaying])

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopSoundAtmosphere()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  return {
    isBreathingEnabled,
    isPlaying,
    startSoundAtmosphere,
    stopSoundAtmosphere,
    toggleBreathing,
    currentFrequency: isPlaying ? hueToFrequency(getHueFromColor(getCombinedTheme(cognitiveLenses).color.primary)) : null
  }
}

// Export default para compatibilidad
export default useSoundAtmosphere