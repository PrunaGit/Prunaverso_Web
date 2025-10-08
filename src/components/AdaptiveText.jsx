import React from 'react'
import { personalizedTransform } from '../utils/personalizedTransformer'
import { transformText } from '../utils/textTransformer'
import { useCognitiveLens } from '../hooks/useCognitiveLens'

// Componente para texto que se transforma automáticamente
export function AdaptiveText({ children, className = '', tag = 'span', usePersonality = true, ...props }) {
  const { cognitiveLenses, academicDegree, userProfile } = useCognitiveLens()
  
  // Si children es un string, aplicar transformación
  const transformedText = typeof children === 'string' 
    ? (usePersonality && Object.keys(userProfile).length > 0
        ? personalizedTransform(children, cognitiveLenses, { ...userProfile, academicDegree })
        : transformText(children, cognitiveLenses[0] || 'psychology', academicDegree))
    : children

  // Crear el elemento dinámicamente según el tag
  const Tag = tag

  return (
    <Tag className={className} {...props}>
      {transformedText}
    </Tag>
  )
}

// Hook para transformar texto manualmente
export function useTextTransform() {
  const { cognitiveLenses, academicDegree, userProfile } = useCognitiveLens()
  
  return (text, usePersonality = true) => {
    if (usePersonality && Object.keys(userProfile).length > 0) {
      return personalizedTransform(text, cognitiveLenses, { ...userProfile, academicDegree })
    }
    return transformText(text, cognitiveLenses[0] || 'psychology', academicDegree)
  }
}

// Componente para títulos adaptativos
export function AdaptiveTitle({ children, level = 1, className = '', ...props }) {
  const Tag = `h${level}`
  return (
    <AdaptiveText tag={Tag} className={className} {...props}>
      {children}
    </AdaptiveText>
  )
}

// Componente para párrafos adaptativos
export function AdaptiveParagraph({ children, className = '', ...props }) {
  return (
    <AdaptiveText tag="p" className={className} {...props}>
      {children}
    </AdaptiveText>
  )
}

// Componente para botones adaptativos
export function AdaptiveButton({ children, className = '', ...props }) {
  return (
    <AdaptiveText tag="button" className={className} {...props}>
      {children}
    </AdaptiveText>
  )
}

// HOC para hacer cualquier componente adaptativo
export function withAdaptiveText(WrappedComponent) {
  return function AdaptiveWrapper(props) {
    const transform = useTextTransform()
    
    // Pasar la función de transformación como prop
    return <WrappedComponent {...props} transformText={transform} />
  }
}