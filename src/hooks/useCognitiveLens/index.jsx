import React, { useState, useEffect } from 'react'

// Hook principal para gestionar lente cognitiva y grado académico
export function useCognitiveLens() {
  const [cognitiveLenses, setCognitiveLenses] = useState(() => {
    const saved = localStorage.getItem('prunaverso_cognitive_lenses')
    return saved ? JSON.parse(saved) : ['ai', 'philosophy', 'linguistics'] // Alex Pruna default
  })

  const [academicDegree, setAcademicDegree] = useState(() => {
    return localStorage.getItem('prunaverso_academic_degree') || 'researcher'
  })

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('prunaverso_user_profile')
    return saved ? JSON.parse(saved) : {
      narrativeStyle: 'philosophical',
      emotionalTone: 'contemplative',
      conceptualComplexity: 'interdisciplinary',
      culturalReferences: 'underground',
      presentationFormat: 'network'
    } // Alex Pruna default profile
  })

  const [activeProfile, setActiveProfile] = useState(() => {
    return localStorage.getItem('prunaverso_active_profile') || 'alex_pruna'
  })

  const [breathingMode, setBreathingMode] = useState(() => {
    return localStorage.getItem("pruna_breathing") === "1";
  });

  useEffect(() => {
    localStorage.setItem("pruna_breathing", breathingMode ? "1" : "0");
  }, [breathingMode]);

  const setCognitiveLensesWithPersistence = (newLenses) => {
    setCognitiveLenses(newLenses)
    localStorage.setItem('prunaverso_cognitive_lenses', JSON.stringify(newLenses))
    
    // Dispatch global event for other components
    window.dispatchEvent(new CustomEvent('cognitiveLensesChange', {
      detail: { lenses: newLenses, degree: academicDegree, profile: userProfile }
    }))
  }

  const setAcademicDegreeWithPersistence = (newDegree) => {
    setAcademicDegree(newDegree)
    localStorage.setItem('prunaverso_academic_degree', newDegree)
    
    // Dispatch global event for text retransformation
    window.dispatchEvent(new CustomEvent('academicDegreeChange', {
      detail: { lenses: cognitiveLenses, degree: newDegree }
    }))
  }

  const setUserProfileWithPersistence = (newProfile) => {
    setUserProfile(newProfile)
    localStorage.setItem('prunaverso_user_profile', JSON.stringify(newProfile))
    
    // Dispatch global event for personality change
    window.dispatchEvent(new CustomEvent('userProfileChange', {
      detail: { profile: newProfile, lenses: cognitiveLenses, degree: academicDegree }
    }))
  }

  const setActiveProfileWithPersistence = (profileId) => {
    setActiveProfile(profileId)
    localStorage.setItem('prunaverso_active_profile', profileId)
    
    // Dispatch global event for profile change
    window.dispatchEvent(new CustomEvent('activeProfileChange', {
      detail: { profileId }
    }))
  }

  return {
    cognitiveLenses,
    setCognitiveLenses: setCognitiveLensesWithPersistence,
    academicDegree,
    setAcademicDegree: setAcademicDegreeWithPersistence,
    userProfile,
    setUserProfile: setUserProfileWithPersistence,
    activeProfile,
    setActiveProfile: setActiveProfileWithPersistence,
    breathingMode,
    setBreathingMode,
    // Compatibilidad hacia atrás
    cognitiveLens: cognitiveLenses[0] || null,
    setCognitiveLens: (lens) => setCognitiveLensesWithPersistence(lens ? [lens] : [])
  }
}

// Hook de compatibilidad para componentes que solo necesitan la lente actual
export function useCurrentCognitiveLens() {
  const [currentLens, setCurrentLens] = useState(() => {
    return localStorage.getItem('prunaverso_cognitive_lens') || null
  })

  useEffect(() => {
    const handleLensChange = (event) => {
      setCurrentLens(event.detail.lens)
    }

    window.addEventListener('cognitiveLensChange', handleLensChange)
    return () => window.removeEventListener('cognitiveLensChange', handleLensChange)
  }, [])

  return currentLens
}

// Componente que adapta su comportamiento según la lente activa
export function CognitiveContextualizer({ children, lensAdaptations = {} }) {
  const currentLens = useCurrentCognitiveLens()
  
  // Aplicar adaptaciones específicas según la lente
  const adaptation = lensAdaptations[currentLens] || {}
  
  return (
    <div 
      className={adaptation.className || ''}
      style={adaptation.style || {}}
      data-cognitive-lens={currentLens}
    >
      {typeof children === 'function' ? children({ currentLens, adaptation }) : children}
    </div>
  )
}

// Componente para mostrar hints sutiles según la lente activa
export function CognitiveLensHint({ hints = {} }) {
  const currentLens = useCurrentCognitiveLens()
  const hint = hints[currentLens]
  
  if (!hint) return null
  
  return (
    <div className="text-xs text-gray-400 italic mb-2 px-2 py-1 bg-gray-800/30 rounded">
      💡 {hint}
    </div>
  )
}

// Export por defecto para compatibilidad
export default useCognitiveLens