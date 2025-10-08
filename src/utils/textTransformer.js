// Sistema de transformación textual global basado en lentes cognitivas y grados académicos

export const ACADEMIC_DEGREES = {
  'basic': { name: 'Básico', complexity: 1 },
  'intermediate': { name: 'Intermedio', complexity: 2 },
  'advanced': { name: 'Avanzado', complexity: 3 },
  'expert': { name: 'Experto', complexity: 4 },
  'researcher': { name: 'Investigador', complexity: 5 }
}

export const COGNITIVE_TRANSFORMATIONS = {
  psychology: {
    basic: {
      tone: 'empático',
      vocabulary: 'cotidiano',
      focus: 'emociones y experiencias personales',
      structure: 'narrativo'
    },
    intermediate: {
      tone: 'reflexivo',
      vocabulary: 'psicológico básico',
      focus: 'patrones de comportamiento',
      structure: 'descriptivo-analítico'
    },
    advanced: {
      tone: 'analítico',
      vocabulary: 'técnico psicológico',
      focus: 'procesos cognitivos y metacognición',
      structure: 'conceptual-sistemático'
    },
    expert: {
      tone: 'clínico',
      vocabulary: 'terminología especializada',
      focus: 'mecanismos neuropsicológicos',
      structure: 'diagnóstico-interventivo'
    },
    researcher: {
      tone: 'científico',
      vocabulary: 'metodológico-estadístico',
      focus: 'paradigmas y teorías',
      structure: 'hipotético-deductivo'
    }
  },
  neuroscience: {
    basic: {
      tone: 'divulgativo',
      vocabulary: 'analogías simples',
      focus: 'funciones cerebrales básicas',
      structure: 'causa-efecto'
    },
    intermediate: {
      tone: 'educativo',
      vocabulary: 'neurobiológico introductorio',
      focus: 'circuitos y neurotransmisores',
      structure: 'sistémico'
    },
    advanced: {
      tone: 'técnico',
      vocabulary: 'neuroanatómico específico',
      focus: 'plasticidad y conectividad',
      structure: 'mecanístico'
    },
    expert: {
      tone: 'especializado',
      vocabulary: 'neurofisiológico preciso',
      focus: 'oscilaciones y sincronía neural',
      structure: 'multiescalar'
    },
    researcher: {
      tone: 'experimental',
      vocabulary: 'metodológico-técnico',
      focus: 'paradigmas de investigación',
      structure: 'protocolario'
    }
  },
  ai: {
    basic: {
      tone: 'accesible',
      vocabulary: 'metáforas tecnológicas',
      focus: 'automatización y asistencia',
      structure: 'problema-solución'
    },
    intermediate: {
      tone: 'pragmático',
      vocabulary: 'programático básico',
      focus: 'algoritmos y datos',
      structure: 'input-proceso-output'
    },
    advanced: {
      tone: 'técnico',
      vocabulary: 'machine learning específico',
      focus: 'arquitecturas y optimización',
      structure: 'modular-jerárquico'
    },
    expert: {
      tone: 'especializado',
      vocabulary: 'deep learning avanzado',
      focus: 'embeddings y transformers',
      structure: 'arquitectural-distribucional'
    },
    researcher: {
      tone: 'investigativo',
      vocabulary: 'mathematical-computational',
      focus: 'teoría de la información',
      structure: 'formal-demostrativo'
    }
  },
  linguistics: {
    basic: {
      tone: 'conversacional',
      vocabulary: 'comunicativo directo',
      focus: 'significado y contexto',
      structure: 'dialógico'
    },
    intermediate: {
      tone: 'analítico',
      vocabulary: 'gramatical descriptivo',
      focus: 'estructura y función',
      structure: 'morfosintáctico'
    },
    advanced: {
      tone: 'teórico',
      vocabulary: 'lingüístico especializado',
      focus: 'pragmática y semántica',
      structure: 'formal-generativo'
    },
    expert: {
      tone: 'académico',
      vocabulary: 'metalingüístico',
      focus: 'teorías del lenguaje',
      structure: 'paradigmático'
    },
    researcher: {
      tone: 'científico',
      vocabulary: 'psicolingüístico-cognitivo',
      focus: 'adquisición y procesamiento',
      structure: 'experimental-empírico'
    }
  },
  philosophy: {
    basic: {
      tone: 'reflexivo',
      vocabulary: 'existencial cotidiano',
      focus: 'preguntas fundamentales',
      structure: 'interrogativo-exploratorio'
    },
    intermediate: {
      tone: 'conceptual',
      vocabulary: 'filosófico introductorio',
      focus: 'argumentación y lógica',
      structure: 'premisa-conclusión'
    },
    advanced: {
      tone: 'crítico',
      vocabulary: 'filosófico especializado',
      focus: 'sistemas de pensamiento',
      structure: 'dialéctico-sintético'
    },
    expert: {
      tone: 'erudito',
      vocabulary: 'tradiciones filosóficas',
      focus: 'ontología y epistemología',
      structure: 'hermenéutico-fenomenológico'
    },
    researcher: {
      tone: 'metafilosófico',
      vocabulary: 'analítico-formal',
      focus: 'metodología filosófica',
      structure: 'axiomático-deductivo'
    }
  },
  anthropology: {
    basic: {
      tone: 'narrativo',
      vocabulary: 'cultural descriptivo',
      focus: 'diversidad humana',
      structure: 'etnográfico-descriptivo'
    },
    intermediate: {
      tone: 'comparativo',
      vocabulary: 'antropológico básico',
      focus: 'patrones culturales',
      structure: 'cross-cultural'
    },
    advanced: {
      tone: 'analítico',
      vocabulary: 'antropológico especializado',
      focus: 'estructuras sociales',
      structure: 'funcional-estructural'
    },
    expert: {
      tone: 'teórico',
      vocabulary: 'antropológico académico',
      focus: 'teorías de la cultura',
      structure: 'interpretativo-simbólico'
    },
    researcher: {
      tone: 'etnográfico',
      vocabulary: 'metodológico-fieldwork',
      focus: 'métodos de investigación',
      structure: 'participativo-observacional'
    }
  }
}

// Transformador de texto principal
export function transformText(originalText, lens, degree = 'intermediate') {
  if (!lens || !COGNITIVE_TRANSFORMATIONS[lens]) return originalText
  
  const config = COGNITIVE_TRANSFORMATIONS[lens][degree] || COGNITIVE_TRANSFORMATIONS[lens]['intermediate']
  
  // Aplicar transformaciones según la configuración
  return applyTransformation(originalText, config, lens, degree)
}

function applyTransformation(text, config, lens, degree) {
  // Aplicar transformaciones específicas según la lente y grado
  let transformedText = text
  
  // Transformaciones por lente cognitiva
  switch(lens) {
    case 'psychology':
      transformedText = applyPsychologyTransform(text, config, degree)
      break
    case 'neuroscience':
      transformedText = applyNeuroscienceTransform(text, config, degree)
      break
    case 'ai':
      transformedText = applyAITransform(text, config, degree)
      break
    case 'linguistics':
      transformedText = applyLinguisticsTransform(text, config, degree)
      break
    case 'philosophy':
      transformedText = applyPhilosophyTransform(text, config, degree)
      break
    case 'anthropology':
      transformedText = applyAnthropologyTransform(text, config, degree)
      break
  }
  
  return transformedText
}

function applyPsychologyTransform(text, config, degree) {
  const transformations = {
    basic: {
      'sistema': 'proceso mental',
      'interfaz': 'forma de relacionarse',
      'usuario': 'persona',
      'datos': 'experiencias',
      'proceso': 'vivencia'
    },
    intermediate: {
      'sistema': 'estructura cognitiva',
      'interfaz': 'mecanismo de interacción',
      'usuario': 'sujeto cognitivo',
      'datos': 'información procesada',
      'proceso': 'función ejecutiva'
    },
    advanced: {
      'sistema': 'arquitectura cognitiva',
      'interfaz': 'protocolo de procesamiento',
      'usuario': 'agente cognitivo',
      'datos': 'representaciones mentales',
      'proceso': 'operación metacognitiva'
    },
    expert: {
      'sistema': 'red neuropsicológica',
      'interfaz': 'gateway atencional',
      'usuario': 'sistema cognitivo-conductual',
      'datos': 'contenidos mnémicos',
      'proceso': 'secuencia de control ejecutivo'
    },
    researcher: {
      'sistema': 'paradigma cognitivo-experimental',
      'interfaz': 'protocolo de medición',
      'usuario': 'sujeto experimental',
      'datos': 'variables dependientes',
      'proceso': 'manipulación experimental'
    }
  }
  
  return applyLexicalTransformations(text, transformations[degree] || transformations.intermediate)
}

function applyNeuroscienceTransform(text, config, degree) {
  const transformations = {
    basic: {
      'sistema': 'red neuronal',
      'interfaz': 'conexión cerebral',
      'usuario': 'cerebro',
      'datos': 'señales nerviosas',
      'proceso': 'actividad cerebral'
    },
    intermediate: {
      'sistema': 'circuito neuronal',
      'interfaz': 'sinapsis funcional',
      'usuario': 'corteza cerebral',
      'datos': 'potenciales de acción',
      'proceso': 'transmisión sináptica'
    },
    advanced: {
      'sistema': 'red neuronal distribuida',
      'interfaz': 'conectoma funcional',
      'usuario': 'sistema nervioso central',
      'datos': 'patrones de activación',
      'proceso': 'plasticidad sináptica'
    },
    expert: {
      'sistema': 'red de conectividad funcional',
      'interfaz': 'coupling neurovascular',
      'usuario': 'sistema neurocognitivo',
      'datos': 'oscilaciones neuronales',
      'proceso': 'sincronización cross-frequency'
    },
    researcher: {
      'sistema': 'modelo computacional neuronal',
      'interfaz': 'protocolo de neuroimagen',
      'usuario': 'sustrato neurobiológico',
      'datos': 'series temporales neuronales',
      'proceso': 'análisis de conectividad efectiva'
    }
  }
  
  return applyLexicalTransformations(text, transformations[degree] || transformations.intermediate)
}

function applyAITransform(text, config, degree) {
  const transformations = {
    basic: {
      'sistema': 'aplicación inteligente',
      'interfaz': 'chat automático',
      'usuario': 'humano colaborador',
      'datos': 'información procesada',
      'proceso': 'automatización'
    },
    intermediate: {
      'sistema': 'modelo de IA',
      'interfaz': 'API conversacional',
      'usuario': 'agente humano',
      'datos': 'dataset de entrenamiento',
      'proceso': 'algoritmo de aprendizaje'
    },
    advanced: {
      'sistema': 'arquitectura de deep learning',
      'interfaz': 'protocolo de inferencia',
      'usuario': 'operador del sistema',
      'datos': 'embeddings vectoriales',
      'proceso': 'forward pass optimizado'
    },
    expert: {
      'sistema': 'modelo transformer multimodal',
      'interfaz': 'attention mechanism',
      'usuario': 'human-in-the-loop operator',
      'datos': 'high-dimensional representations',
      'proceso': 'gradient-based optimization'
    },
    researcher: {
      'sistema': 'paradigma de inteligencia artificial general',
      'interfaz': 'protocolo de alineamiento',
      'usuario': 'investigador en IA safety',
      'datos': 'corpus de entrenamiento distributionally robust',
      'proceso': 'optimización multi-objetivo con constraints'
    }
  }
  
  return applyLexicalTransformations(text, transformations[degree] || transformations.intermediate)
}

function applyLinguisticsTransform(text, config, degree) {
  const transformations = {
    basic: {
      'sistema': 'forma de comunicarse',
      'interfaz': 'manera de hablar',
      'usuario': 'hablante',
      'datos': 'palabras y frases',
      'proceso': 'conversación'
    },
    intermediate: {
      'sistema': 'estructura discursiva',
      'interfaz': 'registro comunicativo',
      'usuario': 'interlocutor',
      'datos': 'unidades semánticas',
      'proceso': 'acto comunicativo'
    },
    advanced: {
      'sistema': 'sistema semiótico',
      'interfaz': 'competencia pragmática',
      'usuario': 'sujeto enunciador',
      'datos': 'estructuras proposicionales',
      'proceso': 'performance lingüística'
    },
    expert: {
      'sistema': 'aparato formal del discurso',
      'interfaz': 'competencia metapragmática',
      'usuario': 'sujeto de la enunciación',
      'datos': 'formas semántico-sintácticas',
      'proceso': 'actualización del sistema langue'
    },
    researcher: {
      'sistema': 'paradigma teórico-metodológico',
      'interfaz': 'protocolo de análisis discursivo',
      'usuario': 'informante/corpus',
      'datos': 'variables sociolingüísticas',
      'proceso': 'análisis de variación diastrática'
    }
  }
  
  return applyLexicalTransformations(text, transformations[degree] || transformations.intermediate)
}

function applyPhilosophyTransform(text, config, degree) {
  const transformations = {
    basic: {
      'sistema': 'forma de entender el mundo',
      'interfaz': 'manera de relacionarse',
      'usuario': 'ser consciente',
      'datos': 'conocimientos y creencias',
      'proceso': 'reflexión'
    },
    intermediate: {
      'sistema': 'marco conceptual',
      'interfaz': 'mediación racional',
      'usuario': 'sujeto pensante',
      'datos': 'proposiciones y argumentos',
      'proceso': 'razonamiento'
    },
    advanced: {
      'sistema': 'estructura ontológica',
      'interfaz': 'relación epistemológica',
      'usuario': 'sujeto trascendental',
      'datos': 'contenidos de conciencia',
      'proceso': 'síntesis categorial'
    },
    expert: {
      'sistema': 'horizonte de sentido',
      'interfaz': 'mediación dialéctica',
      'usuario': 'Dasein existencial',
      'datos': 'fenómenos de conciencia',
      'proceso': 'constitución trascendental'
    },
    researcher: {
      'sistema': 'paradigma onto-epistemológico',
      'interfaz': 'método fenomenológico',
      'usuario': 'sujeto de investigación filosófica',
      'datos': 'intuiciones eidéticas',
      'proceso': 'reducción fenomenológica'
    }
  }
  
  return applyLexicalTransformations(text, transformations[degree] || transformations.intermediate)
}

function applyAnthropologyTransform(text, config, degree) {
  const transformations = {
    basic: {
      'sistema': 'forma de vida',
      'interfaz': 'costumbres sociales',
      'usuario': 'miembro de la comunidad',
      'datos': 'tradiciones y prácticas',
      'proceso': 'actividad cultural'
    },
    intermediate: {
      'sistema': 'sistema cultural',
      'interfaz': 'prácticas sociales',
      'usuario': 'actor social',
      'datos': 'símbolos culturales',
      'proceso': 'reproducción cultural'
    },
    advanced: {
      'sistema': 'estructura sociocultural',
      'interfaz': 'mediación simbólica',
      'usuario': 'agente sociocultural',
      'datos': 'representaciones colectivas',
      'proceso': 'praxis sociocultural'
    },
    expert: {
      'sistema': 'campo sociocultural',
      'interfaz': 'habitus disposicional',
      'usuario': 'sujeto culturalmente situado',
      'datos': 'capital simbólico',
      'proceso': 'reproducción del campo'
    },
    researcher: {
      'sistema': 'modelo etnográfico-interpretativo',
      'interfaz': 'protocolo de trabajo de campo',
      'usuario': 'informante clave/comunidad estudiada',
      'datos': 'datos etnográficos thick description',
      'proceso': 'análisis cultural interpretativo'
    }
  }
  
  return applyLexicalTransformations(text, transformations[degree] || transformations.intermediate)
}

function applyLexicalTransformations(text, transformationMap) {
  let result = text
  Object.entries(transformationMap).forEach(([original, replacement]) => {
    const regex = new RegExp(`\\b${original}\\b`, 'gi')
    result = result.replace(regex, replacement)
  })
  return result
}