import { useState, useEffect, useCallback } from 'react';
import useVisitorProfile from '../useVisitorProfile';

/**
 * 🧠 useInteractionSystem - Sistema de Reacciones Vivas
 * 
 * Captura cada interacción del usuario y genera respuestas contextuales.
 * Cada acción tiene consecuencias visibles en el sistema.
 */
const useInteractionSystem = () => {
  const { profile, updateProfile } = useVisitorProfile();
  const [systemState, setSystemState] = useState({
    alertLevel: 'calm',
    lastInteraction: null,
    interactionCount: 0,
    cognitivePattern: 'exploring',
    atmosphereIntensity: 0.3,
    achievements: [],
    systemMessages: []
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

    // Efecto visual inmediato
    triggerVisualFeedback(interaction);
    
    return interaction;
  }, [profile, updateProfile, systemState]);

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

  // Feedback visual inmediato
  const triggerVisualFeedback = (interaction) => {
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
      createParticleEffect(interaction.target);
    }
  };

  // Crear efecto de partículas
  const createParticleEffect = (target) => {
    // Implementación de partículas para interacciones especiales
    console.log(`✨ Particle effect triggered for ${target}`);
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
    // Métodos de acción específicos
    onHover: (target, context) => registerInteraction('hover', target, context),
    onClick: (target, context) => registerInteraction('click', target, context),
    onKeyboard: (target, context) => registerInteraction('keyboard', target, context),
    onGamepad: (target, context) => registerInteraction('gamepad', target, context),
    onScroll: (target, context) => registerInteraction('scroll', target, context)
  };
};

export default useInteractionSystem;