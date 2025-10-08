import { useState, useEffect } from 'react';

/**
 * Hook para gestionar el perfil del visitante
 * Determina si es un visitante público o un desarrollador
 */
const useVisitorProfile = () => {
  const [profile, setProfile] = useState({
    type: 'visitor', // 'visitor', 'architect'
    isLoading: false,
    name: 'Visitante'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular carga del perfil
    const timer = setTimeout(() => {
      // Detectar si es modo dev por URL
      const urlParams = new URLSearchParams(window.location.search);
      const isDevMode = urlParams.get('dev') === 'true';
      
      setProfile({
        type: isDevMode ? 'architect' : 'visitor',
        isLoading: false,
        name: isDevMode ? 'Arquitecto' : 'Visitante'
      });
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return {
    profile,
    isLoading,
    setProfile
  };
};

export default useVisitorProfile;