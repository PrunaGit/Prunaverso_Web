// Sistema de perfiles predefinidos y selección múltiple de lentes cognitivas

export const USER_PROFILES = {
  // Perfil base - Alex Pruna
  'alex_pruna': {
    name: 'Alex Pruna',
    emoji: '👨‍💻',
    description: 'Creador del Prunaverso - Perspectiva fundacional',
    cognitiveLenses: ['ai', 'philosophy', 'linguistics'],
    userProfile: {
      narrativeStyle: 'philosophical',
      emotionalTone: 'contemplative',
      conceptualComplexity: 'interdisciplinary',
      culturalReferences: 'underground',
      presentationFormat: 'network'
    },
    academicDegree: 'researcher',
    isDefault: true,
    color: 'from-purple-600 to-blue-600'
  },
  
  // Perfiles de amigos/colaboradores predefinidos
  'maria_cognitive_scientist': {
    name: 'María - Científica Cognitiva',
    emoji: '🧠',
    description: 'Especialista en neurociencia y psicología experimental',
    cognitiveLenses: ['neuroscience', 'psychology'],
    userProfile: {
      narrativeStyle: 'scientific',
      emotionalTone: 'neutral',
      conceptualComplexity: 'complex',
      culturalReferences: 'academic',
      presentationFormat: 'linear'
    },
    academicDegree: 'expert',
    color: 'from-blue-500 to-purple-500'
  },

  'carlos_linguist': {
    name: 'Carlos - Lingüista',
    emoji: '💬',
    description: 'Experto en análisis del discurso y pragmática',
    cognitiveLenses: ['linguistics', 'anthropology', 'philosophy'],
    userProfile: {
      narrativeStyle: 'conversational',
      emotionalTone: 'warm',
      conceptualComplexity: 'complex',
      culturalReferences: 'international',
      presentationFormat: 'spiral'
    },
    academicDegree: 'expert',
    color: 'from-orange-500 to-yellow-500'
  },

  'sofia_ai_researcher': {
    name: 'Sofía - IA Research',
    emoji: '🤖',
    description: 'Investigadora en machine learning y NLP',
    cognitiveLenses: ['ai', 'neuroscience', 'linguistics'],
    userProfile: {
      narrativeStyle: 'technical',
      emotionalTone: 'energetic',
      conceptualComplexity: 'cutting-edge',
      culturalReferences: 'contemporary',
      presentationFormat: 'modular'
    },
    academicDegree: 'researcher',
    color: 'from-green-500 to-teal-500'
  },

  'diego_philosopher': {
    name: 'Diego - Filósofo',
    emoji: '🧩',
    description: 'Especialista en filosofía de la mente y epistemología',
    cognitiveLenses: ['philosophy', 'psychology', 'anthropology'],
    userProfile: {
      narrativeStyle: 'philosophical',
      emotionalTone: 'contemplative',
      conceptualComplexity: 'complex',
      culturalReferences: 'classic',
      presentationFormat: 'spiral'
    },
    academicDegree: 'expert',
    color: 'from-indigo-500 to-purple-500'
  },

  'ana_anthropologist': {
    name: 'Ana - Antropóloga',
    emoji: '🌍',
    description: 'Etnógrafa digital y estudios culturales',
    cognitiveLenses: ['anthropology', 'linguistics', 'psychology'],
    userProfile: {
      narrativeStyle: 'storytelling',
      emotionalTone: 'warm',
      conceptualComplexity: 'moderate',
      culturalReferences: 'international',
      presentationFormat: 'network'
    },
    academicDegree: 'advanced',
    color: 'from-yellow-500 to-orange-500'
  },

  'user_beginner': {
    name: 'Usuario Principiante',
    emoji: '🌱',
    description: 'Perfil para usuarios nuevos en el sistema',
    cognitiveLenses: ['psychology'],
    userProfile: {
      narrativeStyle: 'conversational',
      emotionalTone: 'warm',
      conceptualComplexity: 'simple',
      culturalReferences: 'pop',
      presentationFormat: 'linear'
    },
    academicDegree: 'basic',
    color: 'from-green-400 to-blue-400'
  },

  'curious_explorer': {
    name: 'Explorador Curioso',
    emoji: '🚀',
    description: 'Para usuarios que quieren experimentar todo',
    cognitiveLenses: ['ai', 'neuroscience', 'philosophy'],
    userProfile: {
      narrativeStyle: 'playful',
      emotionalTone: 'energetic',
      conceptualComplexity: 'moderate',
      culturalReferences: 'contemporary',
      presentationFormat: 'experimental'
    },
    academicDegree: 'intermediate',
    color: 'from-pink-500 to-purple-500'
  }
}

// Funciones para gestión de perfiles
export function getProfileById(profileId) {
  return USER_PROFILES[profileId] || USER_PROFILES['alex_pruna']
}

export function getDefaultProfile() {
  return USER_PROFILES['alex_pruna']
}

export function getAllProfiles() {
  return Object.entries(USER_PROFILES).map(([id, profile]) => ({
    id,
    ...profile
  }))
}

// Función para aplicar un perfil completo
export function applyProfile(profileId) {
  const profile = getProfileById(profileId)
  
  // Guardar en localStorage
  localStorage.setItem('prunaverso_active_profile', profileId)
  localStorage.setItem('prunaverso_cognitive_lenses', JSON.stringify(profile.cognitiveLenses))
  localStorage.setItem('prunaverso_user_profile', JSON.stringify(profile.userProfile))
  localStorage.setItem('prunaverso_academic_degree', profile.academicDegree)
  
  // Disparar eventos globales
  window.dispatchEvent(new CustomEvent('profileChange', {
    detail: { 
      profileId,
      profile,
      lenses: profile.cognitiveLenses,
      userProfile: profile.userProfile,
      academicDegree: profile.academicDegree
    }
  }))
  
  return profile
}

// Función para crear perfil personalizado
export function createCustomProfile(name, config) {
  const customId = `custom_${Date.now()}`
  const customProfile = {
    name,
    emoji: '⭐',
    description: 'Perfil personalizado',
    ...config,
    isCustom: true,
    color: 'from-gray-500 to-gray-600'
  }
  
  // Guardar en localStorage (persistencia local)
  const customProfiles = JSON.parse(localStorage.getItem('prunaverso_custom_profiles') || '{}')
  customProfiles[customId] = customProfile
  localStorage.setItem('prunaverso_custom_profiles', JSON.stringify(customProfiles))
  
  return { id: customId, ...customProfile }
}

// Función para obtener perfiles personalizados
export function getCustomProfiles() {
  return JSON.parse(localStorage.getItem('prunaverso_custom_profiles') || '{}')
}

// Combinar perfiles predefinidos y personalizados
export function getAllAvailableProfiles() {
  const predefined = getAllProfiles()
  const custom = Object.entries(getCustomProfiles()).map(([id, profile]) => ({
    id,
    ...profile
  }))
  
  return [...predefined, ...custom]
}