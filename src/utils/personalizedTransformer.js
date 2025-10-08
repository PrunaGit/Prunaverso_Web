// Sistema de transformación textual personalizada híbrida

export const USER_PREFERENCES = {
  // Estilos narrativos
  narrativeStyle: {
    'storytelling': 'Narrativo como cuento',
    'scientific': 'Científico y estructurado',
    'conversational': 'Conversacional y directo',
    'poetic': 'Poético y metafórico',
    'technical': 'Técnico y preciso',
    'philosophical': 'Filosófico y reflexivo'
  },
  
  // Tono emocional
  emotionalTone: {
    'warm': 'Cálido y empático',
    'neutral': 'Neutral y objetivo',
    'energetic': 'Energético y motivador',
    'contemplative': 'Contemplativo y profundo',
    'playful': 'Juguetón y creativo',
    'serious': 'Serio y formal'
  },
  
  // Nivel de complejidad conceptual
  conceptualComplexity: {
    'simple': 'Conceptos simples y directos',
    'moderate': 'Complejidad moderada',
    'complex': 'Conceptos complejos',
    'interdisciplinary': 'Interdisciplinario',
    'cutting-edge': 'Vanguardia teórica'
  },
  
  // Referencias culturales
  culturalReferences: {
    'pop': 'Cultura popular',
    'classic': 'Referencias clásicas',
    'contemporary': 'Contemporáneo',
    'academic': 'Académico tradicional',
    'underground': 'Contracultura',
    'international': 'Multicultural'
  },
  
  // Formato de presentación
  presentationFormat: {
    'linear': 'Lineal y secuencial',
    'modular': 'Modular y fragmentado',
    'spiral': 'Espiral y recursivo',
    'network': 'Red de conexiones',
    'experimental': 'Experimental y no convencional'
  }
}

export const COGNITIVE_PERSONALITY_MATRIX = {
  psychology: {
    storytelling: 'Explora la psique a través de narrativas personales y casos reales',
    scientific: 'Analiza procesos mentales con rigor metodológico',
    conversational: 'Habla de la mente como si fuera terapia amigable',
    poetic: 'Describe la consciencia como paisajes internos',
    technical: 'Disecciona mecanismos cognitivos con precisión clínica',
    philosophical: 'Reflexiona sobre la naturaleza de la experiencia subjetiva'
  },
  
  neuroscience: {
    storytelling: 'Cuenta la historia de cómo el cerebro crea realidad',
    scientific: 'Presenta evidencia experimental sobre función cerebral',
    conversational: 'Explica neuronas como si fueran personajes en conversación',
    poetic: 'Describe redes neuronales como sinfonías eléctricas',
    technical: 'Analiza circuitos neuronales con precisión arquitectónica',
    philosophical: 'Contempla cómo la materia genera consciencia'
  },
  
  ai: {
    storytelling: 'Narra la evolución de la inteligencia artificial',
    scientific: 'Presenta algoritmos como experimentos reproducibles',
    conversational: 'Habla con la IA como colaborador creativo',
    poetic: 'Describe código como poesía computacional',
    technical: 'Optimiza arquitecturas con precisión matemática',
    philosophical: 'Reflexiona sobre la naturaleza de la inteligencia'
  },
  
  linguistics: {
    storytelling: 'Cuenta cómo las palabras crean mundos',
    scientific: 'Analiza estructuras del lenguaje experimentalmente',
    conversational: 'Juega con el lenguaje en diálogo vivo',
    poetic: 'Celebra la musicalidad y ritmo de las palabras',
    technical: 'Disecciona gramática con precisión formal',
    philosophical: 'Contempla cómo el lenguaje moldea pensamiento'
  },
  
  philosophy: {
    storytelling: 'Narra grandes preguntas a través de parábolas',
    scientific: 'Construye argumentos con lógica rigurosa',
    conversational: 'Dialoga socráticamente sobre verdades',
    poetic: 'Expresa ideas abstractas en metáforas vividas',
    technical: 'Desarrolla sistemas conceptuales precisos',
    philosophical: 'Se sumerge en reflexión pura sobre el ser'
  },
  
  anthropology: {
    storytelling: 'Relata culturas a través de etnografías vividas',
    scientific: 'Compara sociedades con método comparativo',
    conversational: 'Comparte culturas como intercambio personal',
    poetic: 'Describe rituales como danzas de significado',
    technical: 'Analiza estructuras sociales sistemáticamente',
    philosophical: 'Reflexiona sobre la diversidad de formas de vida'
  }
}

export const MOOD_TRANSFORMATIONS = {
  warm: {
    prefixes: ['Imagina que', 'Siéntete bienvenido a', 'Acompáñame mientras'],
    connectors: ['y entonces', 'de manera cálida', 'con cariño'],
    suffixes: ['¿no te parece fascinante?', 'esto puede resonar contigo', 'como una invitación personal']
  },
  
  energetic: {
    prefixes: ['¡Descubre!', '¡Exploremos!', '¡Sumérgete!'],
    connectors: ['¡y además!', 'dinámicamente', '¡con energía!'],
    suffixes: ['¡Esto cambia todo!', '¡Es revolucionario!', '¡Vamos más allá!']
  },
  
  contemplative: {
    prefixes: ['Considera profundamente', 'Reflexiona sobre', 'Contempla cómo'],
    connectors: ['pausadamente', 'en silencio interior', 'meditando sobre'],
    suffixes: ['merece una pausa reflexiva', 'invita a la contemplación', 'sugiere profundidades ocultas']
  },
  
  playful: {
    prefixes: ['Juguemos con', 'Imaginemos que', '¿Y si pudiéramos?'],
    connectors: ['traviesamente', 'con picardía', 'juguetonamente'],
    suffixes: ['¿no es deliciosamente absurdo?', '¡qué aventura más divertida!', 'como un juego cósmico']
  }
}

// Función principal de transformación personalizada
export function personalizedTransform(text, cognitiveLensesOrSingle, userProfile = {}) {
  // Compatibilidad: convertir a array si es string
  const cognitiveLenses = Array.isArray(cognitiveLensesOrSingle) 
    ? cognitiveLensesOrSingle 
    : (cognitiveLensesOrSingle ? [cognitiveLensesOrSingle] : [])
  
  const {
    narrativeStyle = 'conversational',
    emotionalTone = 'warm',
    conceptualComplexity = 'moderate',
    culturalReferences = 'contemporary',
    presentationFormat = 'linear',
    academicDegree = 'intermediate'
  } = userProfile

  // Si no hay lentes, devolver texto original
  if (cognitiveLenses.length === 0) return text
  
  let transformedText = text
  
  // 1. Aplicar transformaciones de cada lente cognitiva
  cognitiveLenses.forEach((lens, index) => {
    transformedText = applyCognitiveNarrativeTransform(
      transformedText, 
      lens, 
      narrativeStyle,
      index === 0 // Solo aplicar prefijo en la primera lente
    )
  })
  
  // 2. Aplicar tono emocional
  transformedText = applyEmotionalTone(transformedText, emotionalTone)
  
  // 3. Ajustar complejidad
  transformedText = adjustComplexity(transformedText, conceptualComplexity, academicDegree)
  
  // 4. Añadir referencias culturales
  transformedText = addCulturalContext(transformedText, culturalReferences)
  
  // 5. Formatear presentación
  transformedText = formatPresentation(transformedText, presentationFormat)
  
  // 6. Si hay múltiples lentes, añadir indicador
  if (cognitiveLenses.length > 1) {
    transformedText = `[${cognitiveLenses.length} perspectivas] ${transformedText}`
  }
  
  return transformedText
}

function applyCognitiveNarrativeTransform(text, lens, style, addPrefix = true) {
  if (!COGNITIVE_PERSONALITY_MATRIX[lens] || !COGNITIVE_PERSONALITY_MATRIX[lens][style]) {
    return text
  }
  
  const transformation = COGNITIVE_PERSONALITY_MATRIX[lens][style]
  
  // Aplicar el contexto narrativo como prefijo conceptual solo si addPrefix es true
  if (addPrefix) {
    return `${transformation}: ${text}`
  } else {
    // Para lentes adicionales, solo influir en el vocabulario
    return applyLensInfluence(text, lens)
  }
}

// Nueva función para influencia sutil de lentes adicionales
function applyLensInfluence(text, lens) {
  const influenceMap = {
    psychology: { 'datos': 'experiencias', 'sistema': 'proceso mental' },
    neuroscience: { 'información': 'señales neuronales', 'proceso': 'actividad cerebral' },
    ai: { 'análisis': 'procesamiento algorítmico', 'respuesta': 'output optimizado' },
    linguistics: { 'comunicación': 'acto discursivo', 'mensaje': 'unidad semántica' },
    philosophy: { 'problema': 'cuestión ontológica', 'solución': 'síntesis conceptual' },
    anthropology: { 'comportamiento': 'práctica cultural', 'grupo': 'comunidad simbólica' }
  }
  
  return applyLexicalTransformations(text, influenceMap[lens] || {})
}

function applyEmotionalTone(text, tone) {
  if (!MOOD_TRANSFORMATIONS[tone]) return text
  
  const mood = MOOD_TRANSFORMATIONS[tone]
  const prefix = mood.prefixes[Math.floor(Math.random() * mood.prefixes.length)]
  const suffix = mood.suffixes[Math.floor(Math.random() * mood.suffixes.length)]
  
  return `${prefix} ${text.toLowerCase()} ${suffix}`
}

function adjustComplexity(text, complexity, academicDegree) {
  const complexityMap = {
    simple: {
      'interfaz': 'manera de comunicarse',
      'sistema': 'conjunto organizado',
      'algoritmo': 'serie de pasos',
      'paradigma': 'forma de ver las cosas'
    },
    moderate: {
      'interfaz': 'canal de interacción',
      'sistema': 'estructura integrada',
      'algoritmo': 'proceso sistemático',
      'paradigma': 'marco conceptual'
    },
    complex: {
      'interfaz': 'protocolo de comunicación multidimensional',
      'sistema': 'arquitectura emergente autoorganizada',
      'algoritmo': 'heurística computacional adaptativa',
      'paradigma': 'matriz epistémico-ontológica'
    },
    interdisciplinary: {
      'interfaz': 'boundary object transdisciplinario',
      'sistema': 'red compleja adaptatova multiescalar',
      'algoritmo': 'procedimiento metacognitivo recursivo',
      'paradigma': 'framework post-disciplinario emergente'
    }
  }
  
  return applyLexicalTransformations(text, complexityMap[complexity] || {})
}

function addCulturalContext(text, cultural) {
  const culturalFrameworks = {
    pop: {
      context: 'Como en tu serie favorita',
      metaphors: ['como Netflix para la mente', 'modo streaming cerebral', 'binge-watching cognitivo']
    },
    classic: {
      context: 'En la tradición de los grandes pensadores',
      metaphors: ['como una sinfonía de Beethoven', 'arquitectura renacentista mental', 'biblioteca de Alejandría personal']
    },
    contemporary: {
      context: 'En nuestro mundo hiperconectado',
      metaphors: ['ecosistema digital', 'realidad aumentada cognitiva', 'cloud computing mental']
    },
    underground: {
      context: 'Más allá de lo convencional',
      metaphors: ['hackeo cognitivo', 'glitch en la matriz', 'underground mental']
    }
  }
  
  const framework = culturalFrameworks[cultural]
  if (!framework) return text
  
  const metaphor = framework.metaphors[Math.floor(Math.random() * framework.metaphors.length)]
  return `${framework.context}, ${text} (${metaphor})`
}

function formatPresentation(text, format) {
  switch(format) {
    case 'modular':
      return `🧩 MÓDULO: ${text}`
    case 'spiral':
      return `🌀 ITERACIÓN: ${text} ↻ conecta con lo anterior`
    case 'network':
      return `🕸️ NODO: ${text} ⟷ múltiples conexiones`
    case 'experimental':
      return `⚡ EXPERIMENTO: ${text} [modo laboratorio]`
    default:
      return text
  }
}

function applyLexicalTransformations(text, transformationMap) {
  let result = text
  Object.entries(transformationMap).forEach(([original, replacement]) => {
    const regex = new RegExp(`\\b${original}\\b`, 'gi')
    result = result.replace(regex, replacement)
  })
  return result
}