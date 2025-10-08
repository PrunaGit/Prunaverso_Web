// Sistema de diseño emocional para lentes cognitivas

export const COGNITIVE_LENS_THEMES = {
  psychology: {
    name: 'Psicología',
    emoji: '🧠',
    color: {
      primary: '#fbbf24',
      secondary: '#f59e0b',
      accent: '#d97706',
      background: 'rgba(251, 191, 36, 0.1)',
      gradient: 'from-amber-400 to-orange-500'
    },
    animation: {
      type: 'breathe',
      duration: '4s',
      easing: 'ease-in-out'
    },
    atmosphere: {
      sensation: 'Calidez, introspección, autocontrol',
      symbol: 'Pulso respiratorio lento',
      fontFamily: 'font-serif',
      textShadow: '0 0 20px rgba(251, 191, 36, 0.3)',
      backgroundPattern: 'radial-gradient(circle at 50% 50%, rgba(251, 191, 36, 0.05) 0%, transparent 70%)'
    },
    effects: {
      buttons: 'hover:shadow-amber-400/50',
      text: 'selection:bg-amber-200',
      borders: 'border-amber-300',
      glow: 'drop-shadow-lg drop-shadow-amber-400/20'
    }
  },

  neuroscience: {
    name: 'Neurociencia',
    emoji: '⚡',
    color: {
      primary: '#3b82f6',
      secondary: '#2563eb',
      accent: '#1d4ed8',
      background: 'rgba(59, 130, 246, 0.1)',
      gradient: 'from-blue-500 to-indigo-600'
    },
    animation: {
      type: 'ripple',
      duration: '0.6s',
      easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    },
    atmosphere: {
      sensation: 'Activación sináptica, flujo de energía',
      symbol: 'Destellos en interactivos',
      fontFamily: 'font-sans',
      textShadow: '0 0 10px rgba(59, 130, 246, 0.4)',
      backgroundPattern: 'conic-gradient(from 0deg at 50% 50%, rgba(59, 130, 246, 0.1) 0deg, transparent 60deg, rgba(59, 130, 246, 0.05) 120deg, transparent 180deg)'
    },
    effects: {
      buttons: 'hover:shadow-blue-400/50 active:shadow-blue-500/70',
      text: 'selection:bg-blue-200',
      borders: 'border-blue-300',
      glow: 'drop-shadow-lg drop-shadow-blue-400/30'
    }
  },

  ai: {
    name: 'IA Computacional',
    emoji: '🤖',
    color: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#047857',
      background: 'rgba(16, 185, 129, 0.1)',
      gradient: 'from-emerald-500 to-teal-600'
    },
    animation: {
      type: 'glitch',
      duration: '0.3s',
      easing: 'steps(4, jump-start)'
    },
    atmosphere: {
      sensation: 'Precisión, cálculo, lógica emergente',
      symbol: 'Scanlines y glitch',
      fontFamily: 'font-mono',
      textShadow: '0 0 8px rgba(16, 185, 129, 0.5)',
      backgroundPattern: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(16, 185, 129, 0.03) 2px, rgba(16, 185, 129, 0.03) 4px)'
    },
    effects: {
      buttons: 'hover:shadow-emerald-400/50 transition-all duration-75',
      text: 'selection:bg-emerald-200 font-mono',
      borders: 'border-emerald-300',
      glow: 'drop-shadow-lg drop-shadow-emerald-400/25'
    }
  },

  linguistics: {
    name: 'Lingüística',
    emoji: '💬',
    color: {
      primary: '#ec4899',
      secondary: '#db2777',
      accent: '#be185d',
      background: 'rgba(236, 72, 153, 0.1)',
      gradient: 'from-pink-500 to-rose-500'
    },
    animation: {
      type: 'wave',
      duration: '2s',
      easing: 'ease-in-out'
    },
    atmosphere: {
      sensation: 'Comunicación, resonancia semántica',
      symbol: 'Ondas en textos',
      fontFamily: 'font-sans',
      textShadow: '2px 2px 8px rgba(236, 72, 153, 0.3)',
      backgroundPattern: 'radial-gradient(ellipse at top left, rgba(236, 72, 153, 0.05) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(236, 72, 153, 0.03) 0%, transparent 50%)'
    },
    effects: {
      buttons: 'hover:shadow-pink-400/50',
      text: 'selection:bg-pink-200',
      borders: 'border-pink-300',
      glow: 'drop-shadow-lg drop-shadow-pink-400/25'
    }
  },

  philosophy: {
    name: 'Filosofía',
    emoji: '🧩',
    color: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#6d28d9',
      background: 'rgba(139, 92, 246, 0.1)',
      gradient: 'from-violet-500 to-purple-600'
    },
    animation: {
      type: 'blur-fade',
      duration: '3s',
      easing: 'ease-in-out'
    },
    atmosphere: {
      sensation: 'Contemplación, ambigüedad, reflexión',
      symbol: 'Niebla y opacidad variable',
      fontFamily: 'font-serif',
      textShadow: '0 0 15px rgba(139, 92, 246, 0.4)',
      backgroundPattern: 'radial-gradient(circle at 30% 20%, rgba(139, 92, 246, 0.08) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 60%)'
    },
    effects: {
      buttons: 'hover:shadow-violet-400/50',
      text: 'selection:bg-violet-200',
      borders: 'border-violet-300',
      glow: 'drop-shadow-lg drop-shadow-violet-400/30'
    }
  },

  anthropology: {
    name: 'Antropología',
    emoji: '🌍',
    color: {
      primary: '#92400e',
      secondary: '#78350f',
      accent: '#451a03',
      background: 'rgba(146, 64, 14, 0.1)',
      gradient: 'from-amber-800 to-orange-900'
    },
    animation: {
      type: 'parallax-drift',
      duration: '8s',
      easing: 'linear'
    },
    atmosphere: {
      sensation: 'Conexión con contexto y tribu',
      symbol: 'Motivos geométricos orgánicos',
      fontFamily: 'font-sans',
      textShadow: '1px 1px 6px rgba(146, 64, 14, 0.4)',
      backgroundPattern: 'repeating-conic-gradient(from 0deg at 50% 50%, rgba(146, 64, 14, 0.02) 0deg, transparent 30deg, rgba(146, 64, 14, 0.04) 60deg, transparent 90deg)'
    },
    effects: {
      buttons: 'hover:shadow-amber-800/50',
      text: 'selection:bg-amber-100',
      borders: 'border-amber-800/30',
      glow: 'drop-shadow-lg drop-shadow-amber-800/20'
    }
  }
}

// Función para obtener el tema de una lente
export function getLensTheme(lensId) {
  return COGNITIVE_LENS_THEMES[lensId] || COGNITIVE_LENS_THEMES.psychology
}

// Función para combinar temas de múltiples lentes
export function getCombinedTheme(lensIds = []) {
  if (lensIds.length === 0) return COGNITIVE_LENS_THEMES.psychology
  if (lensIds.length === 1) return getLensTheme(lensIds[0])
  
  // Para múltiples lentes, crear un tema híbrido
  const primaryLens = getLensTheme(lensIds[0])
  const secondaryLenses = lensIds.slice(1).map(id => getLensTheme(id))
  
  return {
    ...primaryLens,
    name: `Híbrido: ${lensIds.length} lentes`,
    color: {
      ...primaryLens.color,
      gradient: `from-${primaryLens.color.primary} via-${secondaryLenses[0]?.color.primary || primaryLens.color.secondary} to-${secondaryLenses[1]?.color.primary || primaryLens.color.accent}`
    },
    atmosphere: {
      ...primaryLens.atmosphere,
      sensation: `Perspectiva múltiple: ${primaryLens.atmosphere.sensation}`,
      symbol: `Combinación de ${lensIds.length} enfoques`,
      backgroundPattern: `
        ${primaryLens.atmosphere.backgroundPattern},
        ${secondaryLenses[0]?.atmosphere.backgroundPattern || ''},
        ${secondaryLenses[1]?.atmosphere.backgroundPattern || ''}
      `.replace(/,\s*,/g, ',').replace(/,\s*$/, '')
    }
  }
}

// CSS personalizado para animaciones
export const LENS_ANIMATIONS = `
  @keyframes breathe {
    0%, 100% { 
      opacity: 0.8; 
      transform: scale(1); 
    }
    50% { 
      opacity: 1; 
      transform: scale(1.02); 
    }
  }

  @keyframes ripple {
    0% { 
      box-shadow: 0 0 0 0 var(--lens-color, #3b82f6); 
    }
    70% { 
      box-shadow: 0 0 0 10px transparent; 
    }
    100% { 
      box-shadow: 0 0 0 0 transparent; 
    }
  }

  @keyframes glitch {
    0% { 
      transform: translateX(0); 
      filter: hue-rotate(0deg); 
    }
    20% { 
      transform: translateX(-2px); 
      filter: hue-rotate(90deg); 
    }
    40% { 
      transform: translateX(2px); 
      filter: hue-rotate(180deg); 
    }
    60% { 
      transform: translateX(-1px); 
      filter: hue-rotate(270deg); 
    }
    80% { 
      transform: translateX(1px); 
      filter: hue-rotate(360deg); 
    }
    100% { 
      transform: translateX(0); 
      filter: hue-rotate(0deg); 
    }
  }

  @keyframes wave {
    0%, 100% { 
      transform: translateY(0px) rotateZ(0deg); 
    }
    25% { 
      transform: translateY(-2px) rotateZ(0.5deg); 
    }
    50% { 
      transform: translateY(0px) rotateZ(0deg); 
    }
    75% { 
      transform: translateY(2px) rotateZ(-0.5deg); 
    }
  }

  @keyframes blur-fade {
    0%, 100% { 
      filter: blur(0px); 
      opacity: 1; 
    }
    50% { 
      filter: blur(1px); 
      opacity: 0.8; 
    }
  }

  @keyframes parallax-drift {
    0% { 
      background-position: 0% 0%; 
    }
    100% { 
      background-position: 100% 100%; 
    }
  }

  /* Clases de animación para aplicar dinámicamente */
  .lens-breathe { animation: breathe 4s ease-in-out infinite; }
  .lens-ripple { animation: ripple 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94); }
  .lens-glitch { animation: glitch 0.3s steps(4, jump-start); }
  .lens-wave { animation: wave 2s ease-in-out infinite; }
  .lens-blur-fade { animation: blur-fade 3s ease-in-out infinite; }
  .lens-parallax-drift { animation: parallax-drift 8s linear infinite; }

  /* Efectos globales por lente */
  [data-lens="psychology"] {
    --lens-primary: #fbbf24;
    --lens-bg: rgba(251, 191, 36, 0.05);
  }

  [data-lens="neuroscience"] {
    --lens-primary: #3b82f6;
    --lens-bg: rgba(59, 130, 246, 0.05);
  }

  [data-lens="ai"] {
    --lens-primary: #10b981;
    --lens-bg: rgba(16, 185, 129, 0.05);
  }

  [data-lens="linguistics"] {
    --lens-primary: #ec4899;
    --lens-bg: rgba(236, 72, 153, 0.05);
  }

  [data-lens="philosophy"] {
    --lens-primary: #8b5cf6;
    --lens-bg: rgba(139, 92, 246, 0.05);
  }

  [data-lens="anthropology"] {
    --lens-primary: #92400e;
    --lens-bg: rgba(146, 64, 14, 0.05);
  }

  /* Efectos de transición global */
  body {
    transition: background-color 0.5s ease-in-out, color 0.3s ease-in-out;
  }

  .lens-transition {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`