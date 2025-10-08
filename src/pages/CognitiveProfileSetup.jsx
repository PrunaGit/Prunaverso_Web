/**
 * 🧠 CONFIGURADOR DE PERFIL COGNITIVO
 * 
 * Componente para el setup inicial del usuario donde elige:
 * - Su nivel de experiencia (nuevo vs conocido)
 * - Sus lentes cognitivas principales
 * - Su grado académico/expertise
 * - Su estilo de interacción preferido
 * 
 * TODO EL CONTENIDO POSTERIOR SE FILTRA A TRAVÉS DE ESTAS ELECCIONES
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useCognitiveLens } from '../hooks/useCognitiveLens';
import { usePerceptualFilter } from '../hooks/usePerceptualFilter';
import InfoOrb from '../components/InfoOrb';

const COGNITIVE_LENS_CATEGORIES = {
  technical: {
    name: 'Técnica',
    icon: '⚙️',
    description: 'Lentes orientadas a sistemas, código y análisis técnico',
    lenses: [
      { id: 'ai', name: 'Inteligencia Artificial', icon: '🤖', description: 'Machine Learning, redes neuronales, algoritmos' },
      { id: 'data_science', name: 'Ciencia de Datos', icon: '📊', description: 'Análisis estadístico, visualización, patrones' },
      { id: 'cybersecurity', name: 'Ciberseguridad', icon: '🛡️', description: 'Seguridad digital, threats, protocolos' },
      { id: 'hacker', name: 'Hacker', icon: '💻', description: 'Exploración de sistemas, pensamiento lateral' }
    ]
  },
  humanistic: {
    name: 'Humanística',
    icon: '🎓',
    description: 'Lentes centradas en el pensamiento crítico y análisis conceptual',
    lenses: [
      { id: 'philosophy', name: 'Filosofía', icon: '🤔', description: 'Análisis ontológico, dialéctica, conceptos fundamentales' },
      { id: 'psychology', name: 'Psicología', icon: '🧠', description: 'Comportamiento, cognición, procesos mentales' },
      { id: 'linguistics', name: 'Lingüística', icon: '📝', description: 'Lenguaje, semántica, estructuras comunicativas' },
      { id: 'sociology', name: 'Sociología', icon: '👥', description: 'Dinámicas sociales, cultura, sistemas sociales' }
    ]
  },
  creative: {
    name: 'Creativa',
    icon: '🎨',
    description: 'Lentes para exploración estética y expresión artística',
    lenses: [
      { id: 'art', name: 'Arte Visual', icon: '🎨', description: 'Estética, composición, expresión visual' },
      { id: 'music', name: 'Música', icon: '🎵', description: 'Armonía, ritmo, composición sonora' },
      { id: 'literature', name: 'Literatura', icon: '📚', description: 'Narrativa, estilo, análisis literario' },
      { id: 'punk', name: 'Contracultura', icon: '🔥', description: 'Rebeldía creativa, anti-establishment' }
    ]
  },
  scientific: {
    name: 'Científica',
    icon: '🔬',
    description: 'Lentes para comprensión de fenómenos naturales y experimentación',
    lenses: [
      { id: 'physics', name: 'Física', icon: '⚛️', description: 'Leyes naturales, energía, materia' },
      { id: 'biology', name: 'Biología', icon: '🧬', description: 'Sistemas vivos, evolución, organismos' },
      { id: 'chemistry', name: 'Química', icon: '⚗️', description: 'Reacciones, moléculas, transformaciones' },
      { id: 'mystic', name: 'Misticismo', icon: '🔮', description: 'Espiritualidad, trascendencia, misterio' }
    ]
  }
};

const ACADEMIC_LEVELS = [
  { id: 'beginner', name: 'Explorador', icon: '🌱', description: 'Nuevo en estos temas, prefiero explicaciones simples' },
  { id: 'general', name: 'Generalista', icon: '🌿', description: 'Conozco lo básico, me gusta aprender más' },
  { id: 'bachelor', name: 'Especialista', icon: '🌳', description: 'Tengo formación académica en mis áreas de interés' },
  { id: 'master', name: 'Experto', icon: '🌲', description: 'Domino profundamente mis campos de conocimiento' },
  { id: 'phd', name: 'Investigador', icon: '🏔️', description: 'Investigo y desarrollo conocimiento avanzado' }
];

const USER_TYPES = [
  {
    id: 'new_explorer',
    name: 'Nuevo Explorador',
    icon: '🚀',
    description: 'Primera vez aquí, quiero descubrir qué es esto',
    defaultLenses: ['philosophy', 'art'],
    defaultAcademic: 'general'
  },
  {
    id: 'returning_visitor',
    name: 'Visitante Familiar',
    icon: '🔄',
    description: 'Ya he estado aquí antes, quiero continuar',
    defaultLenses: ['ai', 'philosophy'],
    defaultAcademic: 'bachelor'
  },
  {
    id: 'cognitive_replica',
    name: 'Réplica Cognitiva',
    icon: '🧬',
    description: 'Quiero experimentar como un personaje del Prunaverso',
    defaultLenses: ['ai', 'psychology', 'philosophy'],
    defaultAcademic: 'master'
  }
];

export default function CognitiveProfileSetup() {
  const navigate = useNavigate();
  const { setCognitiveLenses, setAcademicDegree, setUserProfile } = useCognitiveLens();
  const perceptualFilter = usePerceptualFilter();
  
  const [step, setStep] = useState('user_type'); // 'user_type', 'lenses', 'academic', 'confirmation'
  const [selectedUserType, setSelectedUserType] = useState(null);
  const [selectedLenses, setSelectedLenses] = useState([]);
  const [selectedAcademic, setSelectedAcademic] = useState('general');
  const [isGeneratingProfile, setIsGeneratingProfile] = useState(false);

  const handleUserTypeSelection = (userType) => {
    setSelectedUserType(userType);
    setSelectedLenses(userType.defaultLenses);
    setSelectedAcademic(userType.defaultAcademic);
    setStep('lenses');
  };

  const handleLensToggle = (lensId) => {
    setSelectedLenses(prev => {
      if (prev.includes(lensId)) {
        return prev.filter(id => id !== lensId);
      } else {
        return [...prev, lensId];
      }
    });
  };

  const handleAcademicSelection = (level) => {
    setSelectedAcademic(level);
    setStep('confirmation');
  };

  const handleProfileGeneration = async () => {
    setIsGeneratingProfile(true);
    
    // Guardar configuración en el sistema
    setCognitiveLenses(selectedLenses);
    setAcademicDegree(selectedAcademic);
    
    // Generar perfil de usuario personalizado
    const userProfile = {
      userType: selectedUserType.id,
      narrativeStyle: selectedLenses.includes('philosophy') ? 'philosophical' : 
                    selectedLenses.includes('ai') ? 'technical' :
                    selectedLenses.includes('art') ? 'aesthetic' : 'balanced',
      emotionalTone: selectedLenses.includes('punk') ? 'rebellious' :
                    selectedLenses.includes('mystic') ? 'mystical' :
                    selectedAcademic === 'phd' ? 'analytical' : 'contemplative',
      conceptualComplexity: selectedAcademic === 'phd' ? 'theoretical' :
                           selectedAcademic === 'master' ? 'interdisciplinary' :
                           selectedAcademic === 'bachelor' ? 'specialized' : 'accessible',
      culturalReferences: selectedLenses.includes('hacker') || selectedLenses.includes('punk') ? 'underground' : 'mainstream',
      presentationFormat: selectedLenses.includes('ai') || selectedLenses.includes('data_science') ? 'systematic' : 'network'
    };
    
    setUserProfile(userProfile);
    
    // Simular configuración del sistema
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Redirigir al portal principal
    navigate('/portal');
  };

  const renderUserTypeSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          ¿Cómo te encuentras hoy con el Prunaverso?
        </h2>
        <p className="text-gray-300">
          Tu elección determinará cómo percibes toda la información
        </p>
      </div>
      
      <div className="grid gap-4">
        {USER_TYPES.map(userType => (
          <motion.button
            key={userType.id}
            onClick={() => handleUserTypeSelection(userType)}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(147, 51, 234, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="p-6 bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-xl border border-purple-500/30 text-left hover:border-purple-400/50 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="text-4xl">{userType.icon}</div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-white">{userType.name}</h3>
                <p className="text-gray-300 mt-1">{userType.description}</p>
                <div className="flex gap-2 mt-2">
                  {userType.defaultLenses.map(lensId => {
                    const lens = Object.values(COGNITIVE_LENS_CATEGORIES)
                      .flatMap(cat => cat.lenses)
                      .find(l => l.id === lensId);
                    return lens ? (
                      <span key={lensId} className="text-xs bg-purple-600/30 px-2 py-1 rounded">
                        {lens.icon} {lens.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const renderLensSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Configura tus Lentes Cognitivas
          <InfoOrb topic="lentes-cognitivas" size={20} style={{marginLeft: '8px', verticalAlign: 'top'}} />
        </h2>
        <p className="text-gray-300">
          Elige las perspectivas a través de las cuales quieres percibir el contenido
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Seleccionadas: {selectedLenses.length} | Recomendado: 2-4 lentes
        </p>
      </div>

      {Object.entries(COGNITIVE_LENS_CATEGORIES).map(([categoryId, category]) => (
        <div key={categoryId} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
            {category.icon} {category.name}
            <span className="text-sm text-gray-400 font-normal">- {category.description}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {category.lenses.map(lens => (
              <motion.button
                key={lens.id}
                onClick={() => handleLensToggle(lens.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg border text-left transition-all duration-300 ${
                  selectedLenses.includes(lens.id)
                    ? 'bg-gradient-to-r from-purple-600/50 to-blue-600/50 border-purple-400 shadow-lg'
                    : 'bg-gray-800/50 border-gray-600 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{lens.icon}</span>
                  <div>
                    <h4 className="font-semibold text-white">{lens.name}</h4>
                    <p className="text-sm text-gray-300">{lens.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-between pt-6">
        <button
          onClick={() => setStep('user_type')}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Volver
        </button>
        <button
          onClick={() => setStep('academic')}
          disabled={selectedLenses.length === 0}
          className={`px-6 py-3 rounded-lg transition-colors ${
            selectedLenses.length > 0
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continuar →
        </button>
      </div>
    </motion.div>
  );

  const renderAcademicSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Nivel de Complejidad
        </h2>
        <p className="text-gray-300">
          ¿Qué nivel de profundidad prefieres en las explicaciones?
        </p>
      </div>

      <div className="grid gap-4">
        {ACADEMIC_LEVELS.map(level => (
          <motion.button
            key={level.id}
            onClick={() => handleAcademicSelection(level.id)}
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(147, 51, 234, 0.4)" }}
            whileTap={{ scale: 0.98 }}
            className={`p-6 rounded-xl border text-left transition-all duration-300 ${
              selectedAcademic === level.id
                ? 'bg-gradient-to-r from-green-600/50 to-blue-600/50 border-green-400'
                : 'bg-gray-800/50 border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl">{level.icon}</span>
              <div>
                <h3 className="text-xl font-semibold text-white">{level.name}</h3>
                <p className="text-gray-300 mt-1">{level.description}</p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={() => setStep('lenses')}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Volver
        </button>
      </div>
    </motion.div>
  );

  const renderConfirmation = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Configuración Lista
        </h2>
        <p className="text-gray-300">
          Tu perfil cognitivo ha sido configurado. Todo el contenido se adaptará a tu perspectiva.
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 rounded-xl p-6 border border-purple-500/30">
        <h3 className="text-xl font-semibold mb-4 text-white">Tu Perfil Cognitivo:</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-gray-200">Tipo de Usuario:</h4>
            <p className="text-gray-300">{selectedUserType?.icon} {selectedUserType?.name}</p>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-200">Lentes Activas:</h4>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedLenses.map(lensId => {
                const lens = Object.values(COGNITIVE_LENS_CATEGORIES)
                  .flatMap(cat => cat.lenses)
                  .find(l => l.id === lensId);
                return lens ? (
                  <span key={lensId} className="bg-purple-600/50 px-3 py-1 rounded-full text-sm">
                    {lens.icon} {lens.name}
                  </span>
                ) : null;
              })}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-200">Nivel de Complejidad:</h4>
            <p className="text-gray-300">
              {ACADEMIC_LEVELS.find(l => l.id === selectedAcademic)?.icon} {ACADEMIC_LEVELS.find(l => l.id === selectedAcademic)?.name}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-4">
        <p className="text-yellow-200 text-sm">
          💡 <strong>Importante:</strong> A partir de ahora, toda la información se presentará filtrada por tu perfil cognitivo. 
          Nunca verás el contenido "crudo" del Prunaverso - siempre lo percibirás a través de tus lentes elegidas.
        </p>
      </div>

      <div className="flex justify-between pt-6">
        <button
          onClick={() => setStep('academic')}
          className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          ← Ajustar
        </button>
        <motion.button
          onClick={handleProfileGeneration}
          disabled={isGeneratingProfile}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGeneratingProfile ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Calibrando Percepción...
            </span>
          ) : (
            '🚀 Entrar al Prunaverso'
          )}
        </motion.button>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-purple-900 text-white">
      {/* Efecto de partículas de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-20"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            }}
            animate={{ 
              y: [null, -100],
              opacity: [0.2, 0, 0.2]
            }}
            transition={{ 
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              PRUNAVERSO
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 mx-auto mb-4"></div>
            <p className="text-gray-400">Configuración de Perfil Cognitivo</p>
          </motion.div>

          {/* Progress indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-4">
              {['user_type', 'lenses', 'academic', 'confirmation'].map((stepName, index) => (
                <div key={stepName} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    step === stepName ? 'bg-purple-600 text-white' :
                    ['user_type', 'lenses', 'academic', 'confirmation'].indexOf(step) > index ? 'bg-green-600 text-white' :
                    'bg-gray-600 text-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  {index < 3 && <div className="w-8 h-1 bg-gray-600 mx-2"></div>}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {step === 'user_type' && renderUserTypeSelection()}
            {step === 'lenses' && renderLensSelection()}
            {step === 'academic' && renderAcademicSelection()}
            {step === 'confirmation' && renderConfirmation()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}