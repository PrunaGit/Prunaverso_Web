import React from 'react'
import { useLensEffects } from './LensAtmosphereManager'

// Componente de texto con efectos de lente automáticos
export function LensText({ children, className = '', effectType = 'hover', animate = false, ...props }) {
  const { theme, getLensClasses } = useLensEffects()
  const lensClasses = getLensClasses()

  const combinedClassName = `
    ${lensClasses.text} 
    ${animate ? `lens-${theme.animation.type}` : ''} 
    ${className}
  `.trim()

  return (
    <span 
      className={combinedClassName}
      style={{
        color: theme.color.primary,
        textShadow: animate ? theme.atmosphere.textShadow : undefined
      }}
      {...props}
    >
      {children}
    </span>
  )
}

// Botón con efectos de lente
export function LensButton({ children, className = '', variant = 'primary', ...props }) {
  const { theme, getLensClasses } = useLensEffects()
  const lensClasses = getLensClasses()

  const baseClasses = variant === 'primary' 
    ? `${lensClasses.background} text-white px-4 py-2 rounded-lg font-medium`
    : `border ${lensClasses.border} text-gray-700 px-4 py-2 rounded-lg font-medium bg-white`

  const combinedClassName = `
    ${baseClasses}
    ${lensClasses.button}
    ${lensClasses.glow}
    ${className}
  `.trim()

  return (
    <button 
      className={combinedClassName}
      style={{
        '--lens-color': theme.color.primary
      }}
      {...props}
    >
      {children}
    </button>
  )
}

// Contenedor con fondo de lente
export function LensContainer({ children, className = '', glowing = false, ...props }) {
  const { theme, isMultipleLenses } = useLensEffects()

  const containerStyle = {
    backgroundColor: theme.color.background,
    borderColor: theme.color.primary + '30',
    boxShadow: glowing ? `0 0 30px ${theme.color.primary}20` : undefined,
    backgroundImage: isMultipleLenses ? theme.atmosphere.backgroundPattern : undefined
  }

  return (
    <div 
      className={`border lens-transition ${className}`}
      style={containerStyle}
      {...props}
    >
      {children}
    </div>
  )
}

// Card con efectos de lente completos
export function LensCard({ children, title, className = '', animated = true, ...props }) {
  const { theme, getLensClasses } = useLensEffects()
  const lensClasses = getLensClasses()

  return (
    <div 
      className={`
        p-6 rounded-xl border ${lensClasses.border} 
        ${animated ? `lens-${theme.animation.type}` : ''} 
        lens-transition bg-white/80 backdrop-blur-sm
        ${className}
      `}
      style={{
        backgroundColor: theme.color.background,
        borderColor: theme.color.primary + '40',
        boxShadow: `0 4px 20px ${theme.color.primary}10`
      }}
      {...props}
    >
      {title && (
        <h3 className={`text-lg font-semibold mb-3 ${lensClasses.text}`} style={{color: theme.color.primary}}>
          {title}
        </h3>
      )}
      {children}
    </div>
  )
}

// Badge con estilo de lente
export function LensBadge({ children, className = '', pulse = false, ...props }) {
  const { theme } = useLensEffects()

  return (
    <span 
      className={`
        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
        ${pulse ? 'lens-breathe' : ''}
        ${className}
      `}
      style={{
        backgroundColor: theme.color.primary,
        color: 'white',
        boxShadow: `0 2px 8px ${theme.color.primary}40`
      }}
      {...props}
    >
      {children}
    </span>
  )
}

// Input con efectos de lente
export function LensInput({ className = '', ...props }) {
  const { theme, getLensClasses } = useLensEffects()
  const lensClasses = getLensClasses()

  return (
    <input 
      className={`
        px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 lens-transition
        ${lensClasses.border}
        ${className}
      `}
      style={{
        '--tw-ring-color': theme.color.primary + '50',
        borderColor: theme.color.primary + '30'
      }}
      {...props}
    />
  )
}

// Separator con gradiente de lente
export function LensSeparator({ className = '', orientation = 'horizontal' }) {
  const { theme } = useLensEffects()

  const isHorizontal = orientation === 'horizontal'

  return (
    <div 
      className={`
        ${isHorizontal ? 'h-px w-full' : 'w-px h-full'}
        ${className}
      `}
      style={{
        background: `linear-gradient(${isHorizontal ? '90deg' : '0deg'}, 
          transparent, 
          ${theme.color.primary}60, 
          transparent
        )`
      }}
    />
  )
}

// Loading spinner con colores de lente
export function LensSpinner({ size = 'md', className = '' }) {
  const { theme } = useLensEffects()
  
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  return (
    <div 
      className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-transparent ${className}`}
      style={{
        borderTopColor: theme.color.primary,
        borderRightColor: theme.color.secondary + '40'
      }}
    />
  )
}