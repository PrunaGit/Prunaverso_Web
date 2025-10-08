import { useState, useEffect } from 'react';

/**
 * Hook para gestionar el sistema de interacciones
 */
const useInteractionSystem = () => {
  const [systemState, setSystemState] = useState({
    status: 'active',
    interactions: 0,
    lastInteraction: null
  });

  const registerInteraction = (type, data) => {
    setSystemState(prev => ({
      ...prev,
      interactions: prev.interactions + 1,
      lastInteraction: { type, data, timestamp: Date.now() }
    }));
  };

  const getContextualResponse = (input) => {
    return `Respuesta contextual para: ${input}`;
  };

  return {
    systemState,
    registerInteraction,
    getContextualResponse
  };
};

export default useInteractionSystem;