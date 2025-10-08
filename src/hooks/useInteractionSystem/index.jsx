import { useState, useEffect, useCallback } from 'react';
import useVisitorProfile from '../useVisitorProfile';
import { usePrunaversoKnowledge } from '../usePrunaversoKnowledge';
import { usePerceptualFilter } from '../usePerceptualFilter';
import usePlayerProgression from '../usePlayerProgression';

/**
 * 🧠 useInteractionSystem - Sistema de Reacciones Vivas
 * 
 * Captura cada interacción del usuario y genera respuestas contextuales.
 * Cada acción tiene consecuencias visibles en el sistema.
 * AHORA CON CONOCIMIENTO COMPLETO DEL PRUNAVERSO INTEGRADO.
 * 🌌 CON FILTRO PERCEPTUAL: EL USUARIO NUNCA VE CONTENIDO CRUDO
 * 🎮 CON SISTEMA DE PROGRESIÓN XP: CADA INTERACCIÓN GENERA EXPERIENCIA
 */
const useInteractionSystem = () => {
  const { profile, updateProfile } = useVisitorProfile();
  const knowledge = usePrunaversoKnowledge();
  const perceptualFilter = usePerceptualFilter();
  const { gainXP, playerActions, currentLevelInfo, playerState } = usePlayerProgression();
  const [systemState, setSystemState] = useState({
    alertLevel: 'calm',
    lastInteraction: null,
    interactionCount: 0,
    cognitivePattern: 'exploring',
    atmosphereIntensity: 0.3,
    achievements: [],
    systemMessages: [],
    knowledgeIntegrated: false,
    perceptualFilterActive: false,
    xpSystemActive: false
  });

  // Registrar cada interacción con contexto completo
  const registerInteraction = useCallback((type, target, context = {}) => {
    const timestamp = Date.now();
    const interaction = {
      type, // 'click', 'hover', 'keyboard', 'gamepad'
      target, // elemento objetivo
      timestamp,
      context, // datos adicionales
      sessionTime: timestamp - (profile.sessionStart || timestamp)
    };

    setSystemState(prev => {
      const newCount = prev.interactionCount + 1;
      const newPattern = analyzePattern(interaction, prev, newCount);
      const newAchievements = checkAchievements(interaction, prev, newCount);
      const newMessages = generateSystemMessages(interaction, newPattern);
      
      return {
        ...prev,
        lastInteraction: interaction,
        interactionCount: newCount,
        cognitivePattern: newPattern,
        atmosphereIntensity: calculateAtmosphere(interaction, newPattern),
        achievements: [...prev.achievements, ...newAchievements],
        systemMessages: [...prev.systemMessages.slice(-5), ...newMessages].slice(-10),
        alertLevel: calculateAlertLevel(interaction, newPattern)
      };
    });

    // Actualizar perfil del visitante con nueva información
    updateProfile({
      lastActivity: timestamp,
      totalInteractions: (profile.totalInteractions || 0) + 1,
      preferredInteractionType: getPreferredType(type, profile),
      cognitiveSignals: [...(profile.cognitiveSignals || []), {
        type,
        target,
        timestamp,
        pattern: analyzePattern(interaction, systemState, systemState.interactionCount + 1)
      }].slice(-20) // Mantener solo las últimas 20
    });

    // Efectos inmediatos: XP y feedback visual
    const xpResult = handleXPGain(interaction, newPattern);
    triggerVisualFeedback(interaction, xpResult);
    
    return interaction;
  }, [profile, updateProfile, systemState, gainXP]);

  // 🎮 Manejo de XP por interacción
  const handleXPGain = (interaction, pattern) => {
    const { type, target, context } = interaction;
    
    // Mapeo de interacciones a acciones XP
    let xpAction = 'click_basic';
    let xpContext = { ...context };
    
    switch (type) {
      case 'click':
        if (target.includes('character')) {
          xpAction = 'explore_character';
          xpContext.skillCategory = 'social';
        } else if (target.includes('portal')) {
          xpAction = 'visit_portal';
          xpContext.skillCategory = 'consciousness';
        } else if (target.includes('dev') || target.includes('console')) {
          xpAction = 'use_dev_tools';
          xpContext.skillCategory = 'technical';
        } else {
          xpAction = 'click_basic';
        }
        break;
        
      case 'hover':
        xpAction = 'hover_element';
        break;
        
      case 'keyboard':
        if (context.shortcut) {
          xpAction = 'keyboard_shortcut';
          xpContext.skillCategory = 'technical';
        }
        break;
        
      case 'gamepad':
        xpAction = 'click_basic';
        xpContext.bonus = 1; // Bonus por usar gamepad
        xpContext.skillCategory = 'creative';
        break;
        
      case 'scroll':
        xpAction = 'scroll_page';
        break;
    }
    
    // Bonus por patrón cognitivo
    if (pattern === 'power_user') xpContext.bonus = (xpContext.bonus || 0) + 2;
    if (pattern === 'rapid_explorer') xpContext.bonus = (xpContext.bonus || 0) + 1;
    if (pattern === 'contemplative') xpContext.bonus = (xpContext.bonus || 0) + 3;
    
    // Ganar XP
    return gainXP(xpAction, xpContext);
  };

  // Analizar patrones cognitivos del usuario
  const analyzePattern = (interaction, state, count) => {
    const { type, target, context } = interaction;
    
    // Patrones basados en comportamiento
    if (count < 5) return 'initial_exploration';
    if (type === 'keyboard' && context.shortcut) return 'power_user';
    if (type === 'gamepad') return 'gaming_focused';
    if (target.includes('dev') || target.includes('console')) return 'technical_minded';
    if (target.includes('character') || target.includes('story')) return 'narrative_focused';
    if (state.lastInteraction && (interaction.timestamp - state.lastInteraction.timestamp) < 200) {
      return 'rapid_explorer';
    }
    if (context.dwellTime > 3000) return 'contemplative';
    
    return state.cognitivePattern || 'balanced_explorer';
  };

  // Sistema de logros en tiempo real
  const checkAchievements = (interaction, state, count) => {
    const achievements = [];
    
    if (count === 1) achievements.push({
      id: 'first_contact',
      title: '🛸 First Contact',
      description: 'Welcome to the Prunaverso',
      timestamp: interaction.timestamp,
      rarity: 'common'
    });
    
    if (count === 10) achievements.push({
      id: 'explorer',
      title: '🔍 Digital Explorer',
      description: '10 interactions completed',
      timestamp: interaction.timestamp,
      rarity: 'uncommon'
    });
    
    if (interaction.type === 'gamepad') achievements.push({
      id: 'gamer_detected',
      title: '🎮 Gaming Spirit',
      description: 'Controller user detected',
      timestamp: interaction.timestamp,
      rarity: 'rare'
    });
    
    if (interaction.target.includes('dev') && state.cognitivePattern !== 'technical_minded') {
      achievements.push({
        id: 'dev_portal_discovery',
        title: '🔧 System Architect',
        description: 'Dev portal accessed',
        timestamp: interaction.timestamp,
        rarity: 'epic'
      });
    }
    
    return achievements.filter(ach => 
      !state.achievements.some(existing => existing.id === ach.id)
    );
  };

  // Generar mensajes del sistema
  const generateSystemMessages = (interaction, pattern) => {
    const messages = [];
    
    // 🌌 INTEGRACIÓN DEL CONOCIMIENTO PRUNAVERSAL CON FILTRO PERCEPTUAL
    if (knowledge.isInitialized && perceptualFilter.isCalibrated) {
      // NUNCA mostrar contenido crudo - siempre filtrado por percepción del usuario
      const filteredResponse = perceptualFilter.generateFilteredResponse(
        interaction.target || interaction.context?.element || '', 
        interaction.type
      );
      
      if (filteredResponse) {
        messages.push({
          type: 'prunaverso_filtered',
          content: filteredResponse,
          timestamp: interaction.timestamp,
          priority: 'success',
          filterSignature: `${perceptualFilter.currentLenses.join('+')}@${perceptualFilter.academicLevel}`,
          isPerceptuallyAdapted: true,
          rawContentHidden: true
        });
      }
    } else if (knowledge.isInitialized && !perceptualFilter.isCalibrated) {
      // Modo de calibración - usuario necesita configurar su percepción
      messages.push({
        type: 'calibration_required',
        content: '🔧 Sistema detectado. Configurando filtros perceptuales para tu perfil cognitivo...',
        timestamp: interaction.timestamp,
        priority: 'warning',
        needsCalibration: true
      });
    }
    
    // Mensajes de patrón cognitivo (complementarios)
    switch (pattern) {
      case 'power_user':
        messages.push({
          type: 'system',
          content: '⚡ Keyboard shortcuts detected. System optimizing for power user experience.',
          timestamp: interaction.timestamp,
          priority: 'info'
        });
        break;
        
      case 'gaming_focused':
        messages.push({
          type: 'system',
          content: '🎮 Gaming controls active. Enhanced navigation mode enabled.',
          timestamp: interaction.timestamp,
          priority: 'info'
        });
        break;
        
      case 'technical_minded':
        messages.push({
          type: 'system',
          content: '🛠️ Technical interface detected. Advanced features unlocked.',
          timestamp: interaction.timestamp,
          priority: 'success'
        });
        break;
        
      case 'rapid_explorer':
        messages.push({
          type: 'system',
          content: '🚀 Rapid exploration mode. System adapting response time.',
          timestamp: interaction.timestamp,
          priority: 'warning'
        });
        break;
    }
    
    // Mensaje especial cuando el conocimiento se inicializa
    if (knowledge.isInitialized && !systemState.knowledgeIntegrated) {
      const knowledgeStats = knowledge.knowledgeStats || {};
      const filteredMessage = perceptualFilter.isCalibrated 
        ? perceptualFilter.generateFilteredResponse(
            `Sistema de conocimiento integrado: ${knowledgeStats.characters || 0} entidades, ${knowledgeStats.concepts || 0} conceptos disponibles`,
            'system_integration'
          )
        : `🧠 Conocimiento Prunaversal integrado: ${knowledgeStats.characters || 0} personajes, ${knowledgeStats.concepts || 0} conceptos disponibles.`;
      
      messages.push({
        type: 'knowledge_init',
        content: filteredMessage,
        timestamp: interaction.timestamp,
        priority: 'success',
        isPerceptuallyAdapted: perceptualFilter.isCalibrated
      });
      
      setSystemState(prev => ({ ...prev, knowledgeIntegrated: true }));
    }
    
    // Mensaje especial cuando el filtro perceptual se activa
    if (perceptualFilter.isCalibrated && !systemState.perceptualFilterActive) {
      const filterStats = perceptualFilter.getFilterStats();
      messages.push({
        type: 'perceptual_filter_active',
        content: `🎯 Filtros perceptuales calibrados: ${filterStats.activeFilters.join(' + ')} | Nivel: ${filterStats.academicLevel}`,
        timestamp: interaction.timestamp,
        priority: 'info',
        filterInfo: filterStats
      });
      
      setSystemState(prev => ({ ...prev, perceptualFilterActive: true }));
    }
    
    // 🎮 Mensaje especial cuando el sistema XP se activa
    if (playerState.totalXP > 0 && !systemState.xpSystemActive) {
      messages.push({
        type: 'xp_system_active',
        content: `🎮 Sistema de Progresión Activo | Nivel: ${playerState.currentLevel} | XP: ${playerState.totalXP} | Madurez: ${Math.round(playerState.madurezPrunaverso)}%`,
        timestamp: interaction.timestamp,
        priority: 'success',
        playerInfo: {
          level: playerState.currentLevel,
          xp: playerState.totalXP,
          madurez: playerState.madurezPrunaverso,
          title: currentLevelInfo.title
        }
      });
      
      setSystemState(prev => ({ ...prev, xpSystemActive: true }));
    }
    
    // Mensajes de milestone XP
    if (playerState.isLevelingUp) {
      messages.push({
        type: 'level_up',
        content: `🚀 ¡NIVEL ${playerState.currentLevel}! Has alcanzado: ${currentLevelInfo.title}`,
        timestamp: interaction.timestamp,
        priority: 'epic',
        levelInfo: currentLevelInfo
      });
    }
    
    return messages;
  };

  // Calcular intensidad atmosférica
  const calculateAtmosphere = (interaction, pattern) => {
    let intensity = 0.3; // Base
    
    switch (pattern) {
      case 'technical_minded': intensity = 0.8; break;
      case 'gaming_focused': intensity = 0.9; break;
      case 'rapid_explorer': intensity = 0.7; break;
      case 'contemplative': intensity = 0.2; break;
      default: intensity = 0.5;
    }
    
    return Math.min(intensity, 1.0);
  };

  // Calcular nivel de alerta del sistema
  const calculateAlertLevel = (interaction, pattern) => {
    if (pattern === 'rapid_explorer') return 'high';
    if (pattern === 'technical_minded') return 'elevated';
    if (pattern === 'gaming_focused') return 'active';
    return 'calm';
  };

  // Feedback visual inmediato con información XP
  const triggerVisualFeedback = (interaction, xpResult) => {
    // Crear efecto visual en el elemento
    const element = document.querySelector(`[data-interaction-target="${interaction.target}"]`);
    if (element) {
      element.style.transform = 'scale(1.05)';
      element.style.transition = 'transform 0.1s ease';
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, 100);
    }
    
    // Efecto de partículas si es gamepad
    if (interaction.type === 'gamepad') {
      createParticleEffect(interaction.target, xpResult);
    }
    
    // Mostrar XP ganado si es significativo
    if (xpResult && xpResult.xpGained > 5) {
      showXPFloatingText(xpResult.xpGained, interaction.target);
    }
  };

  // Crear efecto de partículas con información XP
  const createParticleEffect = (target, xpResult) => {
    console.log(`✨ Particle effect triggered for ${target} (+${xpResult?.xpGained || 0} XP)`);
  };

  // Mostrar texto flotante de XP
  const showXPFloatingText = (xpAmount, target) => {
    const element = document.querySelector(`[data-interaction-target="${target}"]`) || document.body;
    const floatingText = document.createElement('div');
    floatingText.innerHTML = `+${xpAmount} XP`;
    floatingText.style.cssText = `
      position: absolute;
      color: #00ff88;
      font-weight: bold;
      font-size: 14px;
      pointer-events: none;
      z-index: 9999;
      animation: floatUp 2s ease-out forwards;
    `;
    
    // Agregar animación CSS si no existe
    if (!document.querySelector('#xp-float-animation')) {
      const style = document.createElement('style');
      style.id = 'xp-float-animation';
      style.textContent = `
        @keyframes floatUp {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-50px); }
        }
      `;
      document.head.appendChild(style);
    }
    
    const rect = element.getBoundingClientRect();
    floatingText.style.left = `${rect.right + 10}px`;
    floatingText.style.top = `${rect.top}px`;
    
    document.body.appendChild(floatingText);
    setTimeout(() => floatingText.remove(), 2000);
  };

  // Determinar tipo de interacción preferido
  const getPreferredType = (currentType, profile) => {
    const history = profile.interactionHistory || [];
    const types = [...history, currentType];
    const counts = types.reduce((acc, type) => {
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  };

  // Método para obtener respuesta contextual a cualquier interacción
  const getContextualResponse = (element, action) => {
    const pattern = systemState.cognitivePattern;
    const responses = {
      'technical_minded': {
        'console': 'Terminal access granted. Execute commands with confidence.',
        'monitor': 'System metrics visible. All parameters within nominal range.',
        'character': 'Character data structure accessible via API endpoints.'
      },
      'narrative_focused': {
        'character': 'This character has deep stories to tell. Each interaction reveals more.',
        'story': 'The narrative web grows with each exploration. What calls to you?',
        'portal': 'Portals shift based on your curiosity. What reality will you choose?'
      },
      'gaming_focused': {
        'button': '🎮 Action registered. Combo counter active.',
        'navigation': '⚡ Speed boost available. Press △ for advanced moves.',
        'achievement': '🏆 New achievement unlocked! Progress saved.'
      }
    };
    
    return responses[pattern]?.[element] || `System responding to ${action} on ${element}`;
  };

  // Método para simular evolución del sistema
  const evolveSystem = () => {
    setSystemState(prev => ({
      ...prev,
      systemMessages: [...prev.systemMessages, {
        type: 'evolution',
        content: '🧬 System consciousness evolving based on interaction patterns...',
        timestamp: Date.now(),
        priority: 'info'
      }]
    }));
  };

  // Efecto para evolución automática
  useEffect(() => {
    if (systemState.interactionCount > 0 && systemState.interactionCount % 25 === 0) {
      evolveSystem();
    }
  }, [systemState.interactionCount]);

  return {
    systemState,
    registerInteraction,
    getContextualResponse,
    profile,
    
    // 🎮 Sistema de Progresión XP
    playerState,
    currentLevelInfo,
    xpProgress: {
      level: playerState.currentLevel,
      xp: playerState.totalXP,
      madurez: playerState.madurezPrunaverso,
      sessionXP: playerState.sessionXP
    },
    playerActions,
    
    // Métodos de acción específicos
    onHover: (target, context) => registerInteraction('hover', target, context),
    onClick: (target, context) => registerInteraction('click', target, context),
    onKeyboard: (target, context) => registerInteraction('keyboard', target, context),
    onGamepad: (target, context) => registerInteraction('gamepad', target, context),
    onScroll: (target, context) => registerInteraction('scroll', target, context),
    
    // 🎮 Acciones específicas de progresión
    onExploreCharacter: (characterId) => playerActions.exploreCharacter(characterId),
    onVisitPortal: (portalName) => playerActions.visitPortal(portalName),
    onChangeLens: (lensType) => playerActions.changeLens(lensType),
    onUseDevTools: () => playerActions.useDevTools(),
    onCompleteSession: (minutes) => playerActions.completeSession(minutes)
  };
};

export default useInteractionSystem;