import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import usePlayerProgression from '../hooks/usePlayerProgression';
import useCognitiveLens from '../hooks/useCognitiveLens';
import useVisitorProfile from '../hooks/useVisitorProfile';
import InfoOrb from '../components/InfoOrb';

const AwakeningIntro = () => {
  const navigate = useNavigate();
  const { playerLevel, maturity, completeAwakening } = usePlayerProgression();
  const { currentLens } = useCognitiveLens();
  const { profile, checkKnownUser, activateKnownUserProfile } = useVisitorProfile();
  
  const [currentPhase, setCurrentPhase] = useState('detection');
  const [selectedPath, setSelectedPath] = useState(null);
  const [showInfoOrb, setShowInfoOrb] = useState(false);
  const [collaboratorInput, setCollaboratorInput] = useState('');

  useEffect(() => {
    // Si ya ha pasado por el despertar, redirigir
    const awakeningSeen = localStorage.getItem('awakeningSeen');
    if (awakeningSeen === 'true' || maturity >= 5) {
      navigate('/');
      return;
    }

    // Secuencia de activación mejorada según el guion
    const sequence = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCurrentPhase('scanning');
      await new Promise(resolve => setTimeout(resolve, 2500));
      setCurrentPhase('identified');
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCurrentPhase('protocol');
      await new Promise(resolve => setTimeout(resolve, 3000));
      setCurrentPhase('system-speaks');
      await new Promise(resolve => setTimeout(resolve, 2500));
      setCurrentPhase('dialogue');
    };

    sequence();
  }, [navigate, maturity]);

  const handlePathChoice = (path) => {
    setSelectedPath(path);
    
    if (path === 'what-is-prunaverso') {
      setShowInfoOrb(true);
    } else if (path === 'why-xp') {
      // Activar tutorial XP
      setCurrentPhase('xp-explanation');
    }
  };

  const handleCollaboratorResponse = (response) => {
    if (response === 'yes') {
      setCurrentPhase('collaborator-input');
    } else if (response === 'no') {
      setCurrentPhase('dialogue');
    } else if (response === 'specific') {
      setCurrentPhase('collaborator-input');
    }
  };

  const handleCollaboratorSubmit = () => {
    if (collaboratorInput.trim()) {
      const result = activateKnownUserProfile(collaboratorInput.trim());
      if (result) {
        // Usuario conocido encontrado y perfil actualizado
        setCurrentPhase('collaborator-welcome');
      } else {
        // No es un colaborador conocido, continuar como visitante
        setCurrentPhase('dialogue');
      }
    } else {
      setCurrentPhase('dialogue');
    }
  };

  const completeAwakeningProcess = () => {
    localStorage.setItem('awakeningSeen', 'true');
    completeAwakening();
    navigate('/');
  };

  const getAdaptiveText = (text) => {
    // Adapta el tono según la lente cognitiva activa
    const adaptations = {
      'technical': text.replace(/tranquilo/gi, 'sin errores').replace(/simbólico/gi, 'algorítmico'),
      'poetic': text.replace(/protocolo/gi, 'ritual').replace(/sistema/gi, 'cosmos'),
      'analytical': text.replace(/consciencia/gi, 'cognición').replace(/simbólico/gi, 'semántico'),
      'mystical': text.replace(/digital/gi, 'etérico').replace(/laboratorio/gi, 'templo'),
      'playful': text.replace(/protocolo/gi, 'juego').replace(/consciencia/gi, 'aventura')
    };
    
    return adaptations[currentLens] || text;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Partículas de fondo */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        
        <AnimatePresence mode="wait">
          {currentPhase === 'detection' && (
            <motion.div
              key="detection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="text-green-400 font-mono text-lg mb-4">
                🧭 Detectando señal cognitiva...
              </div>
              <motion.div
                className="w-32 h-1 bg-green-400/30 mx-auto"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1 }}
              />
            </motion.div>
          )}

          {currentPhase === 'scanning' && (
            <motion.div
              key="scanning"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <div className="text-cyan-400 font-mono text-xl mb-6">
                "Nuevo visitante identificado."
              </div>
              <div className="text-gray-300 font-mono text-sm space-y-2">
                <div>Sin registros previos.</div>
                <div>Nivel: {playerLevel}</div>
                <div>Madurez prunaversal: {Math.round(maturity)}%</div>
              </div>
              <motion.div
                className="mt-4 text-purple-400 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Iniciando protocolo de orientación simbólica...
              </motion.div>
            </motion.div>
          )}

          {currentPhase === 'identified' && (
            <motion.div
              key="identified"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center"
            >
              <div className="text-purple-400 font-mono text-lg">
                "Iniciando protocolo de orientación simbólica."
              </div>
            </motion.div>
          )}

          {currentPhase === 'protocol' && (
            <motion.div
              key="protocol"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center max-w-2xl"
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="text-white text-xl mb-8 leading-relaxed"
              >
                � <span className="text-blue-400 font-semibold">[Protocolo Activado]</span>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-100 text-lg leading-relaxed space-y-4"
              >
                <p>
                  {getAdaptiveText("Protocolo de orientación simbólica iniciado.")}
                </p>
                <p>
                  {getAdaptiveText("Preparando interfaz cognitiva...")}
                </p>
              </motion.div>
            </motion.div>
          )}

          {currentPhase === 'system-speaks' && (
            <motion.div
              key="system-speaks"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center max-w-3xl"
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                className="text-white text-2xl mb-8 leading-relaxed"
              >
                🧠 <span className="text-blue-400 font-semibold">[El sistema te habla:]</span>
              </motion.div>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-gray-100 text-xl leading-relaxed space-y-6"
              >
                <p className="text-green-400 font-semibold">
                  "Tranquilo, no estás en un videojuego."
                </p>
                <p>
                  {getAdaptiveText("Aunque... todo juego serio comienza con una pregunta.")}
                </p>
              </motion.div>
            </motion.div>
          )}

          {currentPhase === 'collaborator-check' && (
            <motion.div
              key="collaborator-check"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-white text-xl mb-12 leading-relaxed"
              >
                🤝 <span className="text-cyan-400 font-semibold">[Sistema de reconocimiento:]</span>
                <br />
                <span className="text-lg">¿Eres un colaborador del Prunaverso?</span>
              </motion.div>

              <div className="grid md:grid-cols-3 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(34, 197, 94, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCollaboratorResponse('yes')}
                  className="p-4 border border-green-400/30 rounded-lg transition-all duration-300 hover:border-green-400/60"
                >
                  <div className="text-green-400 text-lg font-semibold mb-2">
                    ✅ Sí
                  </div>
                  <div className="text-gray-300 text-sm">
                    Soy parte del equipo
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCollaboratorResponse('no')}
                  className="p-4 border border-red-400/30 rounded-lg transition-all duration-300 hover:border-red-400/60"
                >
                  <div className="text-red-400 text-lg font-semibold mb-2">
                    ❌ No
                  </div>
                  <div className="text-gray-300 text-sm">
                    Soy un visitante
                  </div>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(139, 92, 246, 0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCollaboratorResponse('specific')}
                  className="p-4 border border-purple-400/30 rounded-lg transition-all duration-300 hover:border-purple-400/60"
                >
                  <div className="text-purple-400 text-lg font-semibold mb-2">
                    🎭 Específico
                  </div>
                  <div className="text-gray-300 text-sm">
                    Tengo un nickname
                  </div>
                </motion.button>
              </div>
            </motion.div>
          )}

          {currentPhase === 'collaborator-input' && (
            <motion.div
              key="collaborator-input"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-2xl"
            >
              <motion.div
                className="text-white text-lg mb-8 leading-relaxed"
              >
                🔐 <span className="text-purple-400 font-semibold">Escribe tu nickname:</span>
              </motion.div>

              <div className="space-y-6">
                <motion.input
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  type="text"
                  value={collaboratorInput}
                  onChange={(e) => setCollaboratorInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCollaboratorSubmit()}
                  className="w-full max-w-md mx-auto block px-4 py-3 bg-gray-800/50 border border-purple-400/30 rounded-lg text-white text-center text-lg focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                  placeholder="Ejemplo: Pruna, Ana, etc."
                  autoFocus
                />

                <div className="flex gap-4 justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCollaboratorSubmit}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300"
                  >
                    Verificar
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPhase('dialogue')}
                    className="px-6 py-2 border border-gray-400/30 text-gray-300 rounded-lg hover:border-gray-400/60 transition-all duration-300"
                  >
                    Saltar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {currentPhase === 'collaborator-welcome' && (
            <motion.div
              key="collaborator-welcome"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center max-w-2xl"
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-white text-xl mb-8 leading-relaxed"
              >
                🌟 <span className="text-yellow-400 font-semibold">¡Bienvenido de vuelta!</span>
                <br />
                <span className="text-lg">Tu perfil ha sido reconocido.</span>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={completeAwakeningProcess}
                className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300"
              >
                Acceder al Prunaverso 🚀
              </motion.button>
            </motion.div>
          )}

          {currentPhase === 'dialogue' && (
            <motion.div
              key="dialogue"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center max-w-4xl"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 }}
                className="text-white text-xl mb-8 leading-relaxed"
              >
                💭 <span className="text-purple-400 font-semibold">[¿Cuál te resulta más intrigante?]</span>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <motion.button
                  onClick={() => handlePathChoice('what-is-prunaverso')}
                  className="relative group bg-black/40 border border-purple-500/30 rounded-lg p-6 hover:border-purple-400/60 transition-all duration-300 hover:bg-purple-900/20"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="text-purple-300 text-lg mb-3 font-semibold">
                    🌌 ¿Qué es el Prunaverso?
                  </div>
                  <div className="text-gray-300 text-sm">
                    Descubre la naturaleza de este espacio cognitivo
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>

                <motion.button
                  onClick={() => handlePathChoice('why-xp')}
                  className="relative group bg-black/40 border border-blue-500/30 rounded-lg p-6 hover:border-blue-400/60 transition-all duration-300 hover:bg-blue-900/20"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <div className="text-blue-300 text-lg mb-3 font-semibold">
                    � ¿Por qué tengo barras de XP?
                  </div>
                  <div className="text-gray-300 text-sm">
                    Comprende el sistema de métricas cognitivas
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-green-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-8 text-gray-400 text-sm"
              >
                🤖 <em>El momento de metaconsciencia ha llegado...</em>
              </motion.div>
            </motion.div>
          )}

          {currentPhase === 'xp-explanation' && (
            <motion.div
              key="xp-explanation"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl"
            >
              <motion.div
                className="text-white text-lg leading-relaxed space-y-6 mb-8"
              >
                <p className="text-green-400 text-xl font-semibold">
                  "Porque en este espacio, el aprendizaje se mide como evolución."
                </p>
                <p>
                  {getAdaptiveText("Cada descubrimiento, cada click, cada insight... te otorga energía simbólica (XP).")}
                </p>
                <p>
                  {getAdaptiveText("No acumulas puntos, sino consciencia.")}
                </p>
                <p className="text-cyan-400 font-semibold">
                  {getAdaptiveText("Tu HUD no es un marcador, es un espejo.")}
                </p>
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={completeAwakeningProcess}
                className="px-8 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-cyan-600 transition-all duration-300"
              >
                Comenzar mi evolución 🚀
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* InfoOrb para explicación del Prunaverso */}
        {showInfoOrb && (
          <InfoOrb
            title="¿Qué es el Prunaverso?"
            content="El Prunaverso es un laboratorio digital de consciencia. Cada interacción aquí tiene peso simbólico y deja huella. No vienes a mirar — vienes a reconocerte en una red de significado."
            onClose={() => {
              setShowInfoOrb(false);
              completeAwakeningProcess();
            }}
            type="knowledge"
          />
        )}
      </div>

      {/* Audio ambiental (opcional) */}
      <audio autoPlay loop className="hidden">
        <source src="/data/audio/awakening-ambient.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
};

export default AwakeningIntro;