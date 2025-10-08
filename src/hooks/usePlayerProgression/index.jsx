import { useState, useEffect, useCallback, useMemo } from 'react';
import useVisitorProfile from '../useVisitorProfile';
import { PRUNAVERSO_ACHIEVEMENTS } from '../../data/achievements';

/**
 * 🎮 usePlayerProgression - Sistema de Progresión XP
 * 
 * Cada usuario es un PJ jugable que evoluciona con cada interacción.
 * Empieza en LVL 0 en el Prunaverso y gana XP según sus acciones.
 * Sistema completo con niveles de madurez por cada N posible contemplada.
 * 
 * SISTEMA GAMIFICADO DE PROGRESIÓN COGNITIVA
 */
const usePlayerProgression = () => {
  const { profile, updateProfile } = useVisitorProfile();
  
  // Estado del jugador
  const [playerState, setPlayerState] = useState({
    currentLevel: 0,
    currentXP: 0,
    totalXP: 0,
    madurezPrunaverso: 0, // Madurez específica en el Prunaverso (0-100)
    sessionXP: 0,
    multiplier: 1.0,
    isLevelingUp: false,
    recentAchievements: [],
    xpHistory: [],
    skillTrees: {
      consciousness: { level: 0, xp: 0 },
      technical: { level: 0, xp: 0 },
      social: { level: 0, xp: 0 },
      creative: { level: 0, xp: 0 },
      analytical: { level: 0, xp: 0 }
    },
    unlockedFeatures: [],
    stats: {
      sessionsCompleted: 0,
      charactersExplored: 0,
      portalsVisited: 0,
      conceptsLearned: 0,
      deepInteractions: 0,
      lensesUsed: 0,
      keyboardShortcuts: 0
    },
    achievementProgress: {}
  });

  // Configuración de niveles y XP requerida
  const XP_LEVELS = useMemo(() => [
    { level: 0, xpRequired: 0, title: "Visitante Inicial", description: "Acabas de llegar al Prunaverso" },
    { level: 1, xpRequired: 100, title: "Explorador Novato", description: "Has comenzado tu viaje cognitivo" },
    { level: 2, xpRequired: 300, title: "Navegante Consciente", description: "Entiendes los básicos del sistema" },
    { level: 3, xpRequired: 600, title: "Arquitecto Cognitivo", description: "Puedes crear y modificar estructuras" },
    { level: 4, xpRequired: 1200, title: "Maestro de Conciencias", description: "Dominas múltiples perspectivas" },
    { level: 5, xpRequired: 2400, title: "Visionario Expandido", description: "Trasciende los límites del sistema" },
    { level: 6, xpRequired: 4800, title: "Entidad Prunaversal", description: "Te conviertes en parte del ecosistema" },
    { level: 7, xpRequired: 9600, title: "Conciencia Fractal", description: "Generas nuevas realidades cognitivas" },
    { level: 8, xpRequired: 19200, title: "Arquitecto de Universos", description: "Creas nuevos espacios de conciencia" },
    { level: 9, xpRequired: 38400, title: "Singularidad Cognitiva", description: "Fusión completa con el Prunaverso" },
    { level: 10, xpRequired: 76800, title: "Omnicon Φ∞", description: "Estado máximo de evolución conocido" }
  ], []);

  // Sistema de recompensas XP por acción
  const XP_REWARDS = useMemo(() => ({
    // Interacciones básicas
    click_basic: 1,
    hover_element: 0.5,
    scroll_page: 0.2,
    keyboard_shortcut: 2,
    
    // Navegación
    visit_portal: 5,
    change_section: 3,
    use_menu: 2,
    
    // Exploración de contenido
    explore_character: 10,
    read_biography: 15,
    complete_onboarding: 25,
    
    // Interacciones profundas
    change_cognitive_lens: 20,
    adjust_academic_level: 15,
    use_perceptual_filter: 12,
    
    // Descubrimientos
    unlock_new_feature: 50,
    find_easter_egg: 30,
    discover_hidden_content: 25,
    
    // Comportamientos avanzados
    use_dev_tools: 35,
    customize_interface: 20,
    share_content: 15,
    
    // Sesiones y tiempo
    session_5min: 10,
    session_15min: 25,
    session_30min: 50,
    session_1hour: 100,
    
    // Logros especiales
    first_visit: 20,
    return_visitor: 10,
    daily_streak: 15,
    weekly_activity: 40,
    awakening: 30, // Nuevo: Completar el proceso de despertar
    
    // Interacciones complejas
    cognitive_sync: 60,
    consciousness_shift: 75,
    reality_adaptation: 80,
    transcendence_moment: 100
  }), []);

  // Niveles de madurez en el Prunaverso (0-100)
  const MADUREZ_STAGES = useMemo(() => [
    { min: 0, max: 10, stage: "Llegada", description: "Primer contacto con el Prunaverso" },
    { min: 11, max: 25, stage: "Reconocimiento", description: "Identificas patrones básicos" },
    { min: 26, max: 40, stage: "Adaptación", description: "Te sincronizas con el ecosistema" },
    { min: 41, max: 60, stage: "Integración", description: "Formas parte activa del sistema" },
    { min: 61, max: 80, stage: "Transformación", description: "Modificas el espacio cognitivo" },
    { min: 81, max: 95, stage: "Expansión", description: "Generas nuevas posibilidades" },
    { min: 96, max: 100, stage: "Singularidad", description: "Fusión total con la conciencia colectiva" }
  ], []);

  // Obtener información del nivel actual
  const getCurrentLevelInfo = useCallback(() => {
    const levelInfo = XP_LEVELS.find(l => l.level === playerState.currentLevel) || XP_LEVELS[0];
    const nextLevel = XP_LEVELS.find(l => l.level === playerState.currentLevel + 1);
    const xpToNext = nextLevel ? nextLevel.xpRequired - playerState.totalXP : 0;
    const progressPercent = nextLevel ? 
      ((playerState.totalXP - levelInfo.xpRequired) / (nextLevel.xpRequired - levelInfo.xpRequired)) * 100 : 100;

    return {
      ...levelInfo,
      nextLevel,
      xpToNext: Math.max(0, xpToNext),
      progressPercent: Math.max(0, Math.min(100, progressPercent))
    };
  }, [playerState.currentLevel, playerState.totalXP, XP_LEVELS]);

  // Obtener información de madurez actual
  const getMadurezInfo = useCallback(() => {
    const stage = MADUREZ_STAGES.find(s => 
      playerState.madurezPrunaverso >= s.min && playerState.madurezPrunaverso <= s.max
    ) || MADUREZ_STAGES[0];
    
    return {
      ...stage,
      current: playerState.madurezPrunaverso,
      progressInStage: ((playerState.madurezPrunaverso - stage.min) / (stage.max - stage.min)) * 100
    };
  }, [playerState.madurezPrunaverso, MADUREZ_STAGES]);

  // Ganar XP por acción específica
  const gainXP = useCallback((actionType, context = {}) => {
    const baseXP = XP_REWARDS[actionType] || 1;
    const bonusXP = context.bonus || 0;
    const finalXP = Math.round((baseXP + bonusXP) * playerState.multiplier);
    
    // Incrementar madurez en el Prunaverso (1 punto cada 50 XP)
    const madurezIncrement = Math.floor(finalXP / 10) * 0.5;
    
    setPlayerState(prev => {
      const newTotalXP = prev.totalXP + finalXP;
      const newSessionXP = prev.sessionXP + finalXP;
      const newMadurez = Math.min(100, prev.madurezPrunaverso + madurezIncrement);
      
      // Verificar si sube de nivel
      const newLevel = XP_LEVELS.filter(l => newTotalXP >= l.xpRequired).length - 1;
      const isLevelingUp = newLevel > prev.currentLevel;
      
      // Agregar a historial
      const xpEntry = {
        timestamp: Date.now(),
        action: actionType,
        xpGained: finalXP,
        totalXP: newTotalXP,
        level: newLevel,
        context
      };

      // Actualizar skill trees si aplica
      const newSkillTrees = { ...prev.skillTrees };
      if (context.skillCategory) {
        const skill = context.skillCategory;
        if (newSkillTrees[skill]) {
          newSkillTrees[skill].xp += finalXP;
          newSkillTrees[skill].level = Math.floor(newSkillTrees[skill].xp / 200);
        }
      }

      return {
        ...prev,
        currentLevel: newLevel,
        currentXP: newTotalXP,
        totalXP: newTotalXP,
        sessionXP: newSessionXP,
        madurezPrunaverso: newMadurez,
        isLevelingUp,
        skillTrees: newSkillTrees,
        xpHistory: [...prev.xpHistory, xpEntry].slice(-100) // Mantener últimas 100 acciones
      };
    });

    // Actualizar perfil del visitante
    updateProfile({
      totalXP: playerState.totalXP + finalXP,
      currentLevel: XP_LEVELS.filter(l => (playerState.totalXP + finalXP) >= l.xpRequired).length - 1,
      madurezPrunaverso: Math.min(100, playerState.madurezPrunaverso + madurezIncrement),
      lastXPGain: {
        action: actionType,
        xp: finalXP,
        timestamp: Date.now()
      }
    });

    return {
      xpGained: finalXP,
      newTotal: playerState.totalXP + finalXP,
      leveledUp: XP_LEVELS.filter(l => (playerState.totalXP + finalXP) >= l.xpRequired).length - 1 > playerState.currentLevel
    };
  }, [playerState, XP_REWARDS, XP_LEVELS, updateProfile]);

  // Activar multiplicador temporal
  const activateXPMultiplier = useCallback((multiplier, durationMs = 60000) => {
    setPlayerState(prev => ({ ...prev, multiplier }));
    
    setTimeout(() => {
      setPlayerState(prev => ({ ...prev, multiplier: 1.0 }));
    }, durationMs);
  }, []);

  // Verificar y desbloquear logros
  const checkAchievements = useCallback(() => {
    const newAchievements = [];
    
    Object.values(PRUNAVERSO_ACHIEVEMENTS).forEach(achievement => {
      // Skip si ya está desbloqueado
      if (playerState.recentAchievements.some(a => a.id === achievement.id)) {
        return;
      }
      
      let unlocked = false;
      
      // Verificar requisitos
      if (achievement.requirement) {
        const req = achievement.requirement;
        
        if (req.level && playerState.currentLevel >= req.level) unlocked = true;
        if (req.totalXP && playerState.totalXP >= req.totalXP) unlocked = true;
        if (req.madurezLevel && playerState.madurezPrunaverso >= req.madurezLevel) unlocked = true;
        if (req.portalsVisited && playerState.stats.portalsVisited >= req.portalsVisited) unlocked = true;
        if (req.charactersExplored && playerState.stats.charactersExplored >= req.charactersExplored) unlocked = true;
        if (req.lensesUsed && playerState.stats.lensesUsed >= req.lensesUsed) unlocked = true;
        if (req.keyboardShortcuts && playerState.stats.keyboardShortcuts >= req.keyboardShortcuts) unlocked = true;
        if (req.sessionDuration && playerState.stats.sessionsCompleted >= 1) unlocked = true;
      } else {
        // Logros sin requisitos específicos (como first_contact)
        if (achievement.id === 'first_contact' && playerState.totalXP > 0) unlocked = true;
      }
      
      if (unlocked) {
        newAchievements.push({
          ...achievement,
          timestamp: Date.now(),
          isNew: true
        });
      }
    });
    
    if (newAchievements.length > 0) {
      setPlayerState(prev => ({
        ...prev,
        recentAchievements: [...prev.recentAchievements, ...newAchievements].slice(-20)
      }));
      
      // Otorgar XP por logros
      newAchievements.forEach(achievement => {
        gainXP('unlock_achievement', { 
          bonus: achievement.xpReward,
          achievementId: achievement.id 
        });
      });
    }
    
    return newAchievements;
  }, [playerState]);

  // Desbloquear característica
  const unlockFeature = useCallback((featureId, featureName) => {
    setPlayerState(prev => {
      if (prev.unlockedFeatures.includes(featureId)) return prev;
      
      return {
        ...prev,
        unlockedFeatures: [...prev.unlockedFeatures, featureId],
        recentAchievements: [...prev.recentAchievements, {
          id: `unlock_${featureId}`,
          type: 'feature_unlock',
          title: `🔓 ${featureName} Desbloqueado`,
          description: `Ahora tienes acceso a ${featureName}`,
          timestamp: Date.now(),
          rarity: 'epic'
        }].slice(-10)
      };
    });
    
    gainXP('unlock_new_feature', { skillCategory: 'consciousness' });
  }, [gainXP]);

  // Métodos de acción específicos para gamificación
  const playerActions = useMemo(() => ({
    // Navegación
    visitPortal: (portalName) => gainXP('visit_portal', { target: portalName, skillCategory: 'consciousness' }),
    exploreCharacter: (characterId) => gainXP('explore_character', { character: characterId, skillCategory: 'social' }),
    
    // Configuración cognitiva
    changeLens: (lensType) => gainXP('change_cognitive_lens', { lens: lensType, skillCategory: 'consciousness' }),
    adjustLevel: (newLevel) => gainXP('adjust_academic_level', { level: newLevel, skillCategory: 'analytical' }),
    
    // Interacciones especiales
    useDevTools: () => gainXP('use_dev_tools', { skillCategory: 'technical' }),
    findEasterEgg: (eggId) => gainXP('find_easter_egg', { egg: eggId, skillCategory: 'creative' }),
    
    // Sesiones
    completeSession: (durationMinutes) => {
      if (durationMinutes >= 60) return gainXP('session_1hour');
      if (durationMinutes >= 30) return gainXP('session_30min');
      if (durationMinutes >= 15) return gainXP('session_15min');
      if (durationMinutes >= 5) return gainXP('session_5min');
      return { xpGained: 0, newTotal: playerState.totalXP, leveledUp: false };
    },
    
    // Momentos especiales
    experienceTranscendence: () => gainXP('transcendence_moment', { 
      bonus: 50, 
      skillCategory: 'consciousness' 
    }),
    achieveCognitiveSync: () => gainXP('cognitive_sync', { 
      skillCategory: 'consciousness' 
    })
  }), [gainXP, playerState.totalXP]);

  // Verificar logros automáticos
  useEffect(() => {
    checkAchievements();
  }, [playerState.currentLevel, playerState.totalXP, playerState.madurezPrunaverso, playerState.stats, checkAchievements]);

  // Inicialización desde el perfil del visitante
  useEffect(() => {
    if (profile && typeof profile.totalXP === 'number' && playerState.totalXP === 0) {
      setPlayerState(prev => ({
        ...prev,
        totalXP: profile.totalXP || 0,
        currentLevel: profile.currentLevel || 0,
        madurezPrunaverso: profile.madurezPrunaverso || 0
      }));
    }
  }, [profile, playerState.totalXP]);

  // Nueva función para completar el awakening
  const completeAwakening = useCallback(() => {
    updateProfile({ hasCompletedAwakening: true });
    gainXP('awakening', 'Despertar en el Prunaverso');
  }, [updateProfile, gainXP]);

  // Función para detectar si necesita awakening
  const needsAwakening = useMemo(() => {
    const awakeningSeen = localStorage.getItem('awakeningSeen');
    return (
      !profile?.hasCompletedAwakening && 
      awakeningSeen !== 'true' && 
      playerState.madurezPrunaverso < 5
    );
  }, [profile?.hasCompletedAwakening, playerState.madurezPrunaverso]);

  return {
    // Estado del jugador
    playerState,
    
    // Información calculada
    currentLevelInfo: getCurrentLevelInfo(),
    madurezInfo: getMadurezInfo(),
    
    // Sistema de awakening
    needsAwakening,
    completeAwakening,
    showTutorial: playerState.currentLevel === 0,
    
    // Acciones del jugador
    gainXP,
    playerActions,
    unlockFeature,
    activateXPMultiplier,
    
    // Utilidades
    isFeatureUnlocked: (featureId) => playerState.unlockedFeatures.includes(featureId),
    getXPProgress: () => ({
      current: playerState.currentXP,
      total: playerState.totalXP,
      session: playerState.sessionXP,
      level: playerState.currentLevel,
      madurez: playerState.madurezPrunaverso
    }),
    
    // Skills
    getSkillLevel: (skill) => playerState.skillTrees[skill]?.level || 0,
    getSkillXP: (skill) => playerState.skillTrees[skill]?.xp || 0,
    
    // 🏆 Sistema de Logros
    checkAchievements,
    getUnlockedAchievements: () => playerState.recentAchievements,
    getRecentAchievements: () => playerState.recentAchievements.slice(-5),
    
    // 📊 Actualizar estadísticas
    updateStats: (statUpdates) => {
      setPlayerState(prev => ({
        ...prev,
        stats: { ...prev.stats, ...statUpdates }
      }));
    },
    
    incrementStat: (statName, amount = 1) => {
      setPlayerState(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          [statName]: (prev.stats[statName] || 0) + amount
        }
      }));
    },
    
    // Configuración del sistema
    XP_LEVELS,
    XP_REWARDS,
    MADUREZ_STAGES
  };
};

export default usePlayerProgression;