/**
 * @hook useCognitiveLens  
 * @description Wrapper del sistema core de Lens Manager.
 * Expone la interfaz de lentes cognitivas para la capa de presentación (React).
 * Mantiene el patrón de separación Lógica Core vs Presentación React.
 * 
 * @author Pruna - Sistema Cognitivo Prunaverso
 * @version 2.1.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import lensManager from '../../system-core/lensManager';

// Hook principal para gestionar lente cognitiva y grado académico
export function useCognitiveLens() {
  // Estados locales de React que se sincronizan con el core
  const [localState, setLocalState] = useState(() => lensManager.getState());

  // Inicialización del hook: el core maneja el estado internamente
  // React solo se suscribe a los cambios.
  useEffect(() => {
    // Se ejecuta una sola vez al montar para asegurar la inicialización
    // del Manager si no se ha hecho.
    if (!lensManager.isReady()) {
      lensManager.initialize();
    }
    
    // Sincronizar estado inicial
    setLocalState(lensManager.getState());
  }, []);

  // Funciones wrapper que delegan al core y actualizan estado local
  const setCognitiveLensesWithPersistence = useCallback((newLenses) => {
    lensManager.setCognitiveLenses(newLenses);
    setLocalState(lensManager.getState());
  }, []);

  const setAcademicDegreeWithPersistence = useCallback((newDegree) => {
    lensManager.setAcademicDegree(newDegree);
    setLocalState(lensManager.getState());
  }, []);

  const setUserProfileWithPersistence = useCallback((newProfile) => {
    lensManager.setUserProfile(newProfile);
    setLocalState(lensManager.getState());
  }, []);

  const setActiveProfileWithPersistence = useCallback((profileId) => {
    lensManager.setActiveProfile(profileId);
    setLocalState(lensManager.getState());
  }, []);

  const setBreathingModeWrapper = useCallback((enabled) => {
    lensManager.setBreathingMode(enabled);
    setLocalState(lensManager.getState());
  }, []);

  // Exponer la interfaz React manteniendo compatibilidad
  return {
    // Estado desde el core
    cognitiveLenses: localState.cognitiveLenses,
    academicDegree: localState.academicDegree,
    userProfile: localState.userProfile,
    activeProfile: localState.activeProfile,
    breathingMode: localState.breathingMode,
    
    // Setters que delegan al core
    setCognitiveLenses: setCognitiveLensesWithPersistence,
    setAcademicDegree: setAcademicDegreeWithPersistence,
    setUserProfile: setUserProfileWithPersistence,
    setActiveProfile: setActiveProfileWithPersistence,
    setBreathingMode: setBreathingModeWrapper,
    
    // Compatibilidad hacia atrás
    cognitiveLens: localState.cognitiveLenses[0] || null,
    setCognitiveLens: (lens) => setCognitiveLensesWithPersistence(lens ? [lens] : [])
  };
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