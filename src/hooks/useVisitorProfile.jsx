import { useState, useEffect } from 'react';
import profileManager from '../system-core/profileManager.js';

/**
 * React Hook para gestión de perfiles de visitante
 * WRAPPER del sistema core - mantiene la interfaz React limpia
 * 
 * La lógica real está en src/system-core/profileManager.js
 * Este hook solo maneja el estado de React y las actualizaciones
 */
const useVisitorProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Usar el sistema core para cargar el perfil
        const loadedProfile = await profileManager.loadUserProfileAsync(300);
        
        if (mounted) {
          setProfile(loadedProfile);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
          setIsLoading(false);
          console.error('🚨 useVisitorProfile: Error cargando perfil:', err);
        }
      }
    };

    loadProfile();

    return () => {
      mounted = false;
    };
  }, []);

  // Funciones de utilidad que delegan al core
  const isArchitect = () => {
    return profileManager.isArchitect(profile);
  };

  const isVisitor = () => {
    return profileManager.isVisitor(profile);
  };

  const getCognitiveLenses = () => {
    return profileManager.getCognitiveLenses(profile);
  };

  const getPreferences = () => {
    return profileManager.getProfilePreferences(profile);
  };

  const forceRefresh = async () => {
    setIsLoading(true);
    const refreshedProfile = await profileManager.loadUserProfileAsync(100);
    setProfile(refreshedProfile);
    setIsLoading(false);
  };

  return {
    // Estado React
    profile,
    isLoading,
    error,
    
    // Utilidades (delegadas al core)
    isArchitect: isArchitect(),
    isVisitor: isVisitor(),
    cognitiveLenses: getCognitiveLenses(),
    preferences: getPreferences(),
    
    // Acciones
    setProfile,
    forceRefresh,
    
    // Core access (para casos avanzados)
    profileManager
  };
};

export default useVisitorProfile;