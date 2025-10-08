import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useCognitiveLens from '../../hooks/useCognitiveLens'
import useVisitorProfile from '../../hooks/useVisitorProfile'
import prunaversalDictionary from '../../data/prunaversal_dictionary.json'

/**
 * 🪐 INFO ORBITAL - Portal Semántico Flotante
 * 
 * Componente universal que crea una (i) orbitando junto a cualquier elemento,
 * revelando el significado cognitivo contextual según las lentes activas.
 */
export default function InfoOrbital({ 
  term,
  content,
  size = 'sm',
  position = 'right',
  level = 'basic',
  className = '',
  style = {}
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [contextualContent, setContextualContent] = useState('')
  const { currentLens } = useCognitiveLens()
  const { profile, cognitiveState } = useVisitorProfile()

  // Generar contenido contextual según lente activa
  useEffect(() => {
    if (term && prunaversalDictionary.terms[term]) {
      const termData = prunaversalDictionary.terms[term]
      const lensKey = currentLens || profile?.currentLenses?.[0] || 'default'
      
      // Buscar definición específica para la lente activa
      const lensDefinition = termData.byLens?.[lensKey] || termData.byLens?.default
      const levelDefinition = termData.byLevel?.[cognitiveState?.level] || termData.byLevel?.[0]
      
      // Usar content prop como fallback
      const finalContent = lensDefinition || levelDefinition || termData.basic || content
      
      setContextualContent(finalContent)
    } else {
      setContextualContent(content || '')
    }
  }, [term, content, currentLens, profile, cognitiveState])

  // Configuración de colores según perfil cognitivo
  const getOrbitalColors = () => {
    if (!profile?.currentColors) {
      return {
        primary: '#00bcd4',
        secondary: '#4fc3f7',
        glow: '0 0 10px #00bcd4'
      }
    }
    
    const [primary, secondary] = profile.currentColors
    return {
      primary,
      secondary: secondary || primary,
      glow: `0 0 10px ${primary}`
    }
  }

  const colors = getOrbitalColors()
  
  // Tamaños según prop
  const sizes = {
    xs: { icon: '0.7rem', panel: '200px' },
    sm: { icon: '0.85rem', panel: '280px' },
    md: { icon: '1rem', panel: '320px' },
    lg: { icon: '1.2rem', panel: '380px' },
    xl: { icon: '1.5rem', panel: '450px' }
  }

  const currentSize = sizes[size]

  // Posicionamiento del panel
  const getPanelPosition = () => {
    const positions = {
      right: { left: '100%', marginLeft: '0.5rem' },
      left: { right: '100%', marginRight: '0.5rem' },
      top: { bottom: '100%', marginBottom: '0.5rem' },
      bottom: { top: '100%', marginTop: '0.5rem' },
      center: { left: '50%', transform: 'translateX(-50%)' }
    }
    return positions[position] || positions.right
  }

  const panelPosition = getPanelPosition()

  return (
    <div 
      className={`inline-block relative ${className}`}
      style={{ 
        ...style,
        display: 'inline-block',
        position: 'relative'
      }}
    >
      {/* Icono (i) orbital */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: currentSize.icon,
          height: currentSize.icon,
          marginLeft: position === 'right' ? '0.3rem' : '0',
          marginRight: position === 'left' ? '0.3rem' : '0',
          cursor: 'pointer',
          color: colors.primary,
          fontSize: currentSize.icon,
          fontWeight: 'bold',
          textShadow: colors.glow,
          filter: `drop-shadow(${colors.glow})`,
          transition: 'all 0.3s ease',
          zIndex: 10
        }}
        whileHover={{ 
          scale: 1.2,
          textShadow: `0 0 15px ${colors.primary}`,
          filter: `drop-shadow(0 0 15px ${colors.primary})`
        }}
        whileRotate={{
          rotate: isOpen ? 0 : 360,
          scale: isOpen ? 1.1 : 1
        }}
        transition={{
          rotate: { 
            duration: 8, 
            repeat: isOpen ? 0 : Infinity, 
            ease: "linear" 
          },
          scale: { duration: 0.3 }
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        ⓘ
      </motion.div>

      {/* Panel emergente contextual */}
      <AnimatePresence>
        {isOpen && contextualContent && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }}
            style={{
              position: 'absolute',
              ...panelPosition,
              width: currentSize.panel,
              background: `linear-gradient(135deg, 
                rgba(0, 0, 0, 0.9) 0%, 
                rgba(${colors.primary.replace('#', '')}, 0.1) 100%)`,
              backdropFilter: 'blur(15px)',
              border: `1px solid ${colors.primary}50`,
              borderRadius: '12px',
              padding: '1rem',
              color: 'white',
              fontSize: '0.85rem',
              lineHeight: '1.4',
              boxShadow: `
                0 8px 32px rgba(0, 0, 0, 0.3),
                0 0 20px ${colors.primary}30,
                inset 0 1px 0 rgba(255, 255, 255, 0.1)
              `,
              zIndex: 1000,
              maxHeight: '300px',
              overflowY: 'auto'
            }}
          >
            {/* Header del panel */}
            {term && (
              <div style={{
                borderBottom: `1px solid ${colors.primary}30`,
                paddingBottom: '0.5rem',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                color: colors.primary
              }}>
                🌀 {term.charAt(0).toUpperCase() + term.slice(1)}
              </div>
            )}

            {/* Contenido contextual */}
            <div 
              dangerouslySetInnerHTML={{ __html: contextualContent }}
              style={{
                color: 'rgba(255, 255, 255, 0.9)'
              }}
            />

            {/* Footer con lente activa */}
            {currentLens && (
              <div style={{
                borderTop: `1px solid ${colors.secondary}30`,
                paddingTop: '0.5rem',
                marginTop: '0.5rem',
                fontSize: '0.7rem',
                opacity: 0.7,
                textAlign: 'center',
                color: colors.secondary
              }}>
                Lente: {currentLens} • Nivel: {cognitiveState?.level || 0}
              </div>
            )}

            {/* Indicador de cierre */}
            <motion.div
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                width: '1rem',
                height: '1rem',
                borderRadius: '50%',
                background: `${colors.primary}20`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '0.7rem',
                color: colors.primary
              }}
              whileHover={{ background: `${colors.primary}40` }}
              onClick={(e) => {
                e.stopPropagation()
                setIsOpen(false)
              }}
            >
              ✕
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 🌟 Componente especializado para texto con info orbital
export function TextWithInfo({ children, term, content, ...props }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {children}
      <InfoOrbital term={term} content={content} {...props} />
    </span>
  )
}

// 🌌 Hook para usar el diccionario prunaversal
export function usePrunaversalTerm(term) {
  const { currentLens } = useCognitiveLens()
  const { profile, cognitiveState } = useVisitorProfile()
  
  if (!term || !prunaversalDictionary.terms[term]) {
    return null
  }
  
  const termData = prunaversalDictionary.terms[term]
  const lensKey = currentLens || profile?.currentLenses?.[0] || 'default'
  
  return {
    basic: termData.basic,
    contextual: termData.byLens?.[lensKey] || termData.byLens?.default,
    level: termData.byLevel?.[cognitiveState?.level] || termData.byLevel?.[0],
    examples: termData.examples,
    related: termData.related
  }
}