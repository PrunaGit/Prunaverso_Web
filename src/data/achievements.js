/**
 * 🏆 Sistema de Logros del Prunaverso
 * 
 * Logros específicos que reconocen la evolución cognitiva del usuario
 * en su viaje a través del ecosistema Prunaversal.
 */

export const PRUNAVERSO_ACHIEVEMENTS = {
  // 🚀 Primeros pasos
  first_contact: {
    id: 'first_contact',
    title: '🛸 Primer Contacto',
    description: 'Has iniciado tu viaje en el Prunaverso',
    rarity: 'common',
    xpReward: 20,
    category: 'exploration'
  },

  portal_explorer: {
    id: 'portal_explorer',
    title: '🌌 Explorador de Portales',
    description: 'Has visitado 3 portales diferentes',
    rarity: 'uncommon',
    xpReward: 50,
    category: 'exploration',
    requirement: { portalsVisited: 3 }
  },

  character_collector: {
    id: 'character_collector',
    title: '🎭 Coleccionista de Conciencias',
    description: 'Has explorado 10 personajes diferentes',
    rarity: 'rare',
    xpReward: 100,
    category: 'social',
    requirement: { charactersExplored: 10 }
  },

  // 🧠 Evolución cognitiva
  lens_master: {
    id: 'lens_master',
    title: '🔮 Maestro de Lentes',
    description: 'Has experimentado con 5 lentes cognitivas diferentes',
    rarity: 'epic',
    xpReward: 150,
    category: 'consciousness',
    requirement: { lensesUsed: 5 }
  },

  filter_adept: {
    id: 'filter_adept',
    title: '🎯 Adepto Perceptual',
    description: 'Has calibrado perfectamente tu filtro perceptual',
    rarity: 'legendary',
    xpReward: 200,
    category: 'consciousness',
    requirement: { perceptualCalibration: 'perfect' }
  },

  // 🎮 Interacción avanzada
  power_user: {
    id: 'power_user',
    title: '⚡ Usuario Avanzado',
    description: 'Has usado 20 atajos de teclado',
    rarity: 'rare',
    xpReward: 75,
    category: 'technical',
    requirement: { keyboardShortcuts: 20 }
  },

  gamepad_master: {
    id: 'gamepad_master',
    title: '🎮 Maestro del Control',
    description: 'Has completado una sesión completa usando solo gamepad',
    rarity: 'epic',
    xpReward: 125,
    category: 'creative',
    requirement: { gamepadSession: true }
  },

  dev_portal_hacker: {
    id: 'dev_portal_hacker',
    title: '🔧 Hacker del Sistema',
    description: 'Has accedido al portal de desarrollo',
    rarity: 'legendary',
    xpReward: 300,
    category: 'technical',
    requirement: { devPortalAccess: true }
  },

  // 🌟 Madurez y transcendencia
  madurez_novice: {
    id: 'madurez_novice',
    title: '🌱 Novato Consciente',
    description: 'Has alcanzado 25% de madurez en el Prunaverso',
    rarity: 'common',
    xpReward: 50,
    category: 'consciousness',
    requirement: { madurezLevel: 25 }
  },

  madurez_adept: {
    id: 'madurez_adept',
    title: '🧠 Adepto Prunaversal',
    description: 'Has alcanzado 50% de madurez en el Prunaverso',
    rarity: 'rare',
    xpReward: 150,
    category: 'consciousness',
    requirement: { madurezLevel: 50 }
  },

  madurez_master: {
    id: 'madurez_master',
    title: '🌟 Maestro de la Conciencia',
    description: 'Has alcanzado 75% de madurez en el Prunaverso',
    rarity: 'epic',
    xpReward: 300,
    category: 'consciousness',
    requirement: { madurezLevel: 75 }
  },

  madurez_transcendent: {
    id: 'madurez_transcendent',
    title: '✨ Entidad Trascendente',
    description: 'Has alcanzado 95% de madurez en el Prunaverso',
    rarity: 'mythic',
    xpReward: 500,
    category: 'consciousness',
    requirement: { madurezLevel: 95 }
  },

  // 🏆 Logros de tiempo y dedicación
  session_warrior: {
    id: 'session_warrior',
    title: '⏰ Guerrero de Sesión',
    description: 'Has completado una sesión de 1 hora',
    rarity: 'uncommon',
    xpReward: 100,
    category: 'dedication',
    requirement: { sessionDuration: 60 }
  },

  daily_visitor: {
    id: 'daily_visitor',
    title: '📅 Visitante Diario',
    description: 'Has visitado el Prunaverso 7 días consecutivos',
    rarity: 'rare',
    xpReward: 200,
    category: 'dedication',
    requirement: { dailyStreak: 7 }
  },

  xp_collector: {
    id: 'xp_collector',
    title: '💎 Coleccionista de Experiencia',
    description: 'Has acumulado 1000 XP total',
    rarity: 'epic',
    xpReward: 250,
    category: 'progression',
    requirement: { totalXP: 1000 }
  },

  // 🔮 Logros especiales y easter eggs
  konami_code: {
    id: 'konami_code',
    title: '🕹️ Código Konami',
    description: 'Has descubierto el código secreto clásico',
    rarity: 'legendary',
    xpReward: 300,
    category: 'secret',
    requirement: { konamiCode: true }
  },

  consciousness_sync: {
    id: 'consciousness_sync',
    title: '🌀 Sincronización de Conciencia',
    description: 'Has logrado una sincronización perfecta con el sistema',
    rarity: 'mythic',
    xpReward: 500,
    category: 'transcendence',
    requirement: { consciousnessSync: true }
  },

  reality_shifter: {
    id: 'reality_shifter',
    title: '🔄 Cambiador de Realidad',
    description: 'Has alterado la percepción de la realidad del sistema',
    rarity: 'divine',
    xpReward: 1000,
    category: 'transcendence',
    requirement: { realityShift: true }
  },

  // 🌌 Logros de nivel
  level_5_visionary: {
    id: 'level_5_visionary',
    title: '👁️ Visionario Expandido',
    description: 'Has alcanzado el nivel 5: Visionario Expandido',
    rarity: 'legendary',
    xpReward: 400,
    category: 'progression',
    requirement: { level: 5 }
  },

  level_10_omnicon: {
    id: 'level_10_omnicon',
    title: '∞ Omnicon Φ∞',
    description: 'Has alcanzado el estado máximo: Omnicon Φ∞',
    rarity: 'divine',
    xpReward: 1000,
    category: 'transcendence',
    requirement: { level: 10 }
  }
};

// Categorías de logros con colores y estilos
export const ACHIEVEMENT_CATEGORIES = {
  exploration: {
    name: 'Exploración',
    color: 'cyan',
    icon: '🌌',
    description: 'Descubrir nuevos espacios y portales'
  },
  social: {
    name: 'Social',
    color: 'purple',
    icon: '👥',
    description: 'Interactuar con personajes y conciencias'
  },
  consciousness: {
    name: 'Conciencia',
    color: 'gold',
    icon: '🧠',
    description: 'Evolución y expansión cognitiva'
  },
  technical: {
    name: 'Técnico',
    color: 'green',
    icon: '⚙️',
    description: 'Dominio de herramientas avanzadas'
  },
  creative: {
    name: 'Creativo',
    color: 'pink',
    icon: '🎨',
    description: 'Expresión e innovación'
  },
  dedication: {
    name: 'Dedicación',
    color: 'orange',
    icon: '🔥',
    description: 'Compromiso y persistencia'
  },
  progression: {
    name: 'Progresión',
    color: 'blue',
    icon: '📈',
    description: 'Avance y desarrollo'
  },
  secret: {
    name: 'Secreto',
    color: 'red',
    icon: '🔐',
    description: 'Descubrimientos ocultos'
  },
  transcendence: {
    name: 'Trascendencia',
    color: 'white',
    icon: '✨',
    description: 'Momentos de iluminación'
  }
};

// Rareza de logros con colores y efectos
export const ACHIEVEMENT_RARITIES = {
  common: {
    name: 'Común',
    color: '#9CA3AF',
    glow: false,
    particles: false
  },
  uncommon: {
    name: 'Poco Común',
    color: '#10B981',
    glow: true,
    particles: false
  },
  rare: {
    name: 'Raro',
    color: '#3B82F6',
    glow: true,
    particles: true
  },
  epic: {
    name: 'Épico',
    color: '#8B5CF6',
    glow: true,
    particles: true
  },
  legendary: {
    name: 'Legendario',
    color: '#F59E0B',
    glow: true,
    particles: true
  },
  mythic: {
    name: 'Mítico',
    color: '#EF4444',
    glow: true,
    particles: true
  },
  divine: {
    name: 'Divino',
    color: '#FFFFFF',
    glow: true,
    particles: true,
    special: true
  }
};

export default PRUNAVERSO_ACHIEVEMENTS;