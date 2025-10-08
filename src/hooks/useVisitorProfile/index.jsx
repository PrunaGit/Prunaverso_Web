import { useState, useEffect } from 'react'
import userProfiles from '../../data/userProfiles.json'

/**
 * 🧠 HOOK DE PERFIL COGNITIVO ADAPTATIVO - SISC
 * 
 * Sistema de Identidad y Sintonización Cognitiva del Prunaverso.
 * Motor que detecta, calibra y adapta la experiencia según el visitante.
 */

const VISITOR_TYPES = {
  NEWCOMER: 'newcomer',      // Primera visita, curioso
  CURIOUS: 'curious',        // Explorador activo
  ALLY: 'ally',              // Persona conocida/colaborador
  ROLE_PLAYER: 'role_player', // Quiere crear/elegir personaje
  ARCHITECT: 'architect',     // Creador de submundos
  EXPLORER: 'explorer',       // Navegante avanzado
  MYSTIC: 'mystic'           // Usuario profundo del sistema
}

const COGNITIVE_LEVELS = {
  0: 'RECIBIDO',      // Entrada inicial
  1: 'CONEXIÓN',      // Primera interacción
  2: 'RESONANCIA',    // Múltiples interacciones
  3: 'INTEGRACIÓN',   // Guardó insights
  4: 'SINCRONÍA',     // Uso avanzado
  5: 'PRUNAVERSO'     // Estado pleno
}

const LENS_PROFILES = {
  newcomer: {
    lenses: ['psychology'],
    tone: 'didactic',
    speed: 'slow',
    complexity: 'simple',
    colors: ['#4a90e2', '#7ed321'],
    aura: 'azul_suave'
  },
  curious: {
    lenses: ['psychology', 'philosophy'],
    tone: 'exploratory',
    speed: 'medium',
    complexity: 'moderate',
    colors: ['#9013fe', '#50e3c2'],
    aura: 'violeta_curioso'
  },
  ally: {
    lenses: ['ai', 'consciousness', 'anthropology'],
    tone: 'collaborative',
    speed: 'fast',
    complexity: 'high',
    colors: ['#ff6b6b', '#4ecdc4'],
    aura: 'dorado_aliado'
  },
  role_player: {
    lenses: ['mythology', 'psychology', 'linguistics'],
    tone: 'narrative',
    speed: 'medium',
    complexity: 'adaptive',
    colors: ['#e74c3c', '#f39c12'],
    aura: 'rojo_narrativo'
  },
  architect: {
    lenses: ['systems', 'ai', 'philosophy', 'consciousness'],
    tone: 'technical',
    speed: 'variable',
    complexity: 'maximum',
    colors: ['#2c3e50', '#ecf0f1'],
    aura: 'plata_arquitecto'
  }
}

// 🔍 FUNCIONES DE RECONOCIMIENTO DE USUARIOS CONOCIDOS
const identifyKnownUser = () => {
  // 1. Buscar en localStorage
  const savedIdentity = localStorage.getItem('prunaverso_user_identity')
  if (savedIdentity && userProfiles.knownProfiles[savedIdentity]) {
    return userProfiles.knownProfiles[savedIdentity]
  }

  // 2. Buscar por parámetros URL
  const urlParams = new URLSearchParams(window.location.search)
  const userParam = urlParams.get('user')
  if (userParam && userProfiles.recognitionPatterns.byNickname[userParam.toLowerCase()]) {
    const profileId = userProfiles.recognitionPatterns.byNickname[userParam.toLowerCase()]
    return userProfiles.knownProfiles[profileId]
  }

  // Ya no usar prompt - será manejado por el componente de interfaz
  return null
}

const checkKnownUserByNickname = (nickname) => {
  if (!nickname) return null;
  
  const lowerNick = nickname.toLowerCase();
  if (userProfiles.recognitionPatterns.byNickname[lowerNick]) {
    const profileId = userProfiles.recognitionPatterns.byNickname[lowerNick];
    const knownProfile = userProfiles.knownProfiles[profileId];
    
    // Guardar identidad para futuras sesiones
    localStorage.setItem('prunaverso_user_identity', profileId);
    
    return knownProfile;
  }
  
  return null;
};

const createProfileFromKnownUser = (knownUser) => {
  return {
    type: knownUser.type,
    ...knownUser.cognitiveProfile,
    archetype: knownUser.archetype,
    nickname: knownUser.nickname,
    permissions: knownUser.permissions,
    isKnownUser: true,
    knownUserId: knownUser.id,
    createdAt: Date.now(),
    lastLogin: Date.now()
  }
}

export default function useVisitorProfile() {
  const [profile, setProfile] = useState(null)
  const [level, setLevel] = useState(0)
  const [sessionMetrics, setSessionMetrics] = useState({
    lensChanges: 0,
    charactersInteracted: 0,
    insightsSaved: 0,
    timeSpent: 0,
    lastVisit: null
  })

  // Inicializar perfil con reconocimiento de usuarios conocidos
  useEffect(() => {
    const savedProfile = localStorage.getItem('prunaverso_profile')
    const savedLevel = localStorage.getItem('prunaverso_level')
    const savedMetrics = localStorage.getItem('prunaverso_metrics')

    if (savedProfile) {
      // Usuario existente
      setProfile(JSON.parse(savedProfile))
      setLevel(parseInt(savedLevel) || 0)
      setSessionMetrics(JSON.parse(savedMetrics) || sessionMetrics)
    } else {
      // Buscar usuario conocido primero
      const knownUser = identifyKnownUser()
      
      if (knownUser) {
        // Usuario conocido detectado
        const knownProfile = createProfileFromKnownUser(knownUser)
        setProfile(knownProfile)
        setLevel(knownUser.permissions.level)
        
        // Mostrar mensaje de bienvenida
        if (knownUser.entryMessages && knownUser.entryMessages.length > 0) {
          const randomMessage = knownUser.entryMessages[Math.floor(Math.random() * knownUser.entryMessages.length)]
          console.log(`🌀 ${randomMessage}`)
        }
      } else {
        // Nuevo visitante - perfil mínimo
        const newProfile = {
          type: VISITOR_TYPES.NEWCOMER,
          ...LENS_PROFILES.newcomer,
          createdAt: Date.now(),
          nickname: null,
          archetype: null,
          isKnownUser: false
        }
        setProfile(newProfile)
      }
    }

    // Timer para medir tiempo de sesión
    const startTime = Date.now()
    return () => {
      const sessionTime = Date.now() - startTime
      setSessionMetrics(prev => ({
        ...prev,
        timeSpent: prev.timeSpent + sessionTime
      }))
    }
  }, [])

  // Guardar cambios en localStorage
  useEffect(() => {
    if (profile) {
      localStorage.setItem('prunaverso_profile', JSON.stringify(profile))
      localStorage.setItem('prunaverso_level', level.toString())
      localStorage.setItem('prunaverso_metrics', JSON.stringify(sessionMetrics))
    }
  }, [profile, level, sessionMetrics])

  // Funciones de evolución del perfil
  const evolveProfile = (newType, customConfig = {}) => {
    const baseConfig = LENS_PROFILES[newType] || LENS_PROFILES.curious
    
    setProfile(prev => ({
      ...prev,
      type: newType,
      ...baseConfig,
      ...customConfig,
      lastEvolution: Date.now()
    }))

    // Incrementar nivel automáticamente en ciertos cambios
    if (newType !== VISITOR_TYPES.NEWCOMER && level === 0) {
      setLevel(1)
    }
  }

  const setArchetype = (archetype) => {
    setProfile(prev => ({
      ...prev,
      archetype,
      type: VISITOR_TYPES.ROLE_PLAYER
    }))
    
    // Trigger level up si es primera vez que elige archetype
    if (!profile?.archetype) {
      incrementLevel()
    }
  }

  const incrementLevel = () => {
    const newLevel = Math.min(level + 1, 5)
    setLevel(newLevel)
    
    // Expandir lentes según nivel
    if (newLevel >= 2 && profile) {
      setProfile(prev => ({
        ...prev,
        lenses: [...new Set([...prev.lenses, 'consciousness', 'systems'])],
        complexity: newLevel >= 3 ? 'high' : prev.complexity
      }))
    }
  }

  const trackInteraction = (type, data = {}) => {
    setSessionMetrics(prev => ({
      ...prev,
      [`${type}Count`]: (prev[`${type}Count`] || 0) + 1,
      lastInteraction: { type, data, timestamp: Date.now() }
    }))

    // Auto-evolución basada en métricas
    if (type === 'lensChange' && sessionMetrics.lensChanges >= 2 && level < 2) {
      incrementLevel()
    }
    
    if (type === 'characterInteraction' && sessionMetrics.charactersInteracted >= 3 && level < 3) {
      incrementLevel()
    }
  }

  const resetProfile = () => {
    localStorage.removeItem('prunaverso_profile')
    localStorage.removeItem('prunaverso_level')
    localStorage.removeItem('prunaverso_metrics')
    
    setProfile({
      type: VISITOR_TYPES.NEWCOMER,
      ...LENS_PROFILES.newcomer,
      createdAt: Date.now()
    })
    setLevel(0)
    setSessionMetrics({
      lensChanges: 0,
      charactersInteracted: 0,
      insightsSaved: 0,
      timeSpent: 0
    })
  }

  const activateKnownUserProfile = (nickname) => {
    const knownUser = checkKnownUserByNickname(nickname);
    if (knownUser) {
      const knownProfile = createProfileFromKnownUser(knownUser);
      setProfile(knownProfile);
      setLevel(knownUser.permissions.level);
      
      // Mostrar mensaje de bienvenida
      if (knownUser.entryMessages && knownUser.entryMessages.length > 0) {
        const randomMessage = knownUser.entryMessages[Math.floor(Math.random() * knownUser.entryMessages.length)];
        console.log(`🌀 ${randomMessage}`);
      }
      
      return knownProfile;
    }
    return null;
  };

  // Estado cognitivo actual
  const cognitiveState = {
    level,
    levelName: COGNITIVE_LEVELS[level],
    canAccessAdvanced: level >= 2,
    canCreateArchetypes: level >= 3,
    canModifySystem: level >= 4,
    isFullyAwakened: level >= 5
  }

  return {
    // Estado actual
    profile,
    level,
    cognitiveState,
    sessionMetrics,
    
    // Acciones
    evolveProfile,
    setArchetype,
    incrementLevel,
    trackInteraction,
    resetProfile,
    checkKnownUser: checkKnownUserByNickname,
    activateKnownUserProfile,
    
    // Helpers
    isNewcomer: profile?.type === VISITOR_TYPES.NEWCOMER,
    isReturning: profile?.lastVisit && (Date.now() - profile.lastVisit) < 86400000, // 24h
    hasArchetype: !!profile?.archetype,
    
    // Configuración visual actual
    currentLenses: profile?.lenses || [],
    currentTone: profile?.tone || 'didactic',
    currentColors: profile?.colors || ['#4a90e2', '#7ed321'],
    currentAura: profile?.aura || 'azul_suave'
  }
}