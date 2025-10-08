import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, AreaChart, Area } from 'recharts';
import { Brain, Target, Zap, Puzzle, TrendingUp, Award, Star, Layers, Activity, Clock, BarChart3, CircuitBoard } from 'lucide-react';

// Importar el sistema cognitivo
import { calculateCognitiveState, getLevelName, getStateDescription } from '../system-core/prunalgoritm';
import { cognitiveStateManager } from '../system-core/cognitiveStateManager';
import { achievementSystem } from '../system-core/achievementSystem';

const PlayerEvolution = () => {
  const [cognitiveData, setCognitiveData] = useState({
    vitalidad: 50,
    eutimia: 50,
    carga: 50,
    coherencia: 50,
    nivel: 0,
    xp: 0,
    sessionTime: 0
  });
  
  const [achievements, setAchievements] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [timelineData, setTimelineData] = useState([]);
  const [viewMode, setViewMode] = useState('radar'); // 'radar', 'timeline', 'fractal', 'achievements'

  // Cargar datos del sistema cognitivo y logros
  useEffect(() => {
    const loadCognitiveData = () => {
      const state = cognitiveStateManager.getCurrentState();
      const userAchievements = achievementSystem.getUserAchievements();
      const sessionStart = localStorage.getItem('sessionStartTime');
      const sessionTime = sessionStart ? (Date.now() - parseInt(sessionStart)) / 1000 / 60 : 0; // en minutos

      setCognitiveData({
        vitalidad: state.vitalidad || 50,
        eutimia: state.eutimia || 50,
        carga: state.carga || 50,
        coherencia: state.coherencia || 50,
        nivel: state.nivel || 0,
        xp: state.totalXP || 0,
        sessionTime: Math.round(sessionTime)
      });

      // Cargar y establecer logros reales del sistema
      const realAchievements = achievementSystem.getAllAchievements().map(achievement => ({
        ...achievement,
        unlocked: achievementSystem.unlockedAchievements.has(achievement.id)
      }));
      setAchievements(realAchievements);

      // Generar datos de timeline (simulado por ahora)
      generateTimelineData(state);
    };

    loadCognitiveData();

    // Suscribirse a cambios del estado cognitivo
    const unsubscribe = cognitiveStateManager.subscribeToStateChanges(loadCognitiveData);

    // Actualizar cada 30 segundos
    const interval = setInterval(loadCognitiveData, 30000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const generateTimelineData = (state) => {
    // Generar datos de progreso temporal (esto se podría mejorar con datos reales)
    const timeline = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      timeline.push({
        date: date.toLocaleDateString(),
        xp: Math.max(0, (state.totalXP || 0) - (i * 50) + Math.random() * 100),
        vitalidad: Math.max(0, (state.vitalidad || 50) - (i * 5) + Math.random() * 20),
        coherencia: Math.max(0, (state.coherencia || 50) - (i * 3) + Math.random() * 15)
      });
    }
    
    setTimelineData(timeline);
  };

  // Preparar datos para el radar chart
  const radarData = [
    {
      branch: 'Consciousness',
      value: cognitiveData.eutimia,
      maxValue: 100,
      description: 'Equilibrio emocional y claridad mental',
      icon: <Brain className="w-5 h-5" />
    },
    {
      branch: 'Technical', 
      value: cognitiveData.carga,
      maxValue: 100,
      description: 'Intensidad de procesamiento cognitivo',
      icon: <CircuitBoard className="w-5 h-5" />
    },
    {
      branch: 'Social',
      value: Math.min(100, cognitiveData.coherencia + 10),
      maxValue: 100,
      description: 'Capacidad de conexión y comunicación',
      icon: <Target className="w-5 h-5" />
    },
    {
      branch: 'Creative',
      value: cognitiveData.vitalidad,
      maxValue: 100,
      description: 'Energía mental y motivación creativa',
      icon: <Zap className="w-5 h-5" />
    },
    {
      branch: 'Analytical',
      value: cognitiveData.coherencia,
      maxValue: 100,
      description: 'Consistencia de comprensión y análisis',
      icon: <Puzzle className="w-5 h-5" />
    }
  ];

  // Logros reales del sistema
  const displayAchievements = achievements.slice(0, 8); // Mostrar primeros 8

  const getRarityColor = (rarity) => {
    const colors = {
      'Común': 'text-gray-400 border-gray-400/30',
      'Raro': 'text-blue-400 border-blue-400/30',
      'Épico': 'text-purple-400 border-purple-400/30',
      'Legendario': 'text-yellow-400 border-yellow-400/30',
      'Mítico': 'text-red-400 border-red-400/30',
      'Divino': 'text-cyan-400 border-cyan-400/30',
      'Φ': 'text-white border-white/30'
    };
    return colors[rarity] || colors['Común'];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-2">
          🧬 Panel de Evolución Cognitiva
        </h1>
        <p className="text-gray-300 text-lg">
          {getLevelName(cognitiveData.nivel)} - {getStateDescription(cognitiveData)}
        </p>
        <div className="flex justify-center items-center gap-4 mt-4 text-sm text-gray-400">
          <span>Nivel {cognitiveData.nivel}</span>
          <span>•</span>
          <span>{cognitiveData.xp} XP</span>
          <span>•</span>
          <span>{cognitiveData.sessionTime}min sesión</span>
        </div>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-center mb-8">
        <div className="flex bg-black/40 rounded-lg p-1">
          {[
            { id: 'radar', label: 'Radar', icon: <Activity className="w-4 h-4" /> },
            { id: 'timeline', label: 'Timeline', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'fractal', label: 'Fractal', icon: <Layers className="w-4 h-4" /> },
            { id: 'achievements', label: 'Logros', icon: <Award className="w-4 h-4" /> }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => setViewMode(mode.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                viewMode === mode.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {mode.icon}
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {viewMode === 'radar' && (
          <motion.div
            key="radar"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* Radar Chart */}
            <div className="bg-black/40 rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Perfil Cognitivo
              </h3>
              
              <ResponsiveContainer width="100%" height={400}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#374151" />
                  <PolarAngleAxis dataKey="branch" tick={{ fill: '#D1D5DB', fontSize: 12 }} />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 100]} 
                    tick={{ fill: '#9CA3AF', fontSize: 10 }}
                  />
                  <Radar
                    name="Nivel Actual"
                    dataKey="value"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
              
              <div className="mt-4 text-center text-gray-400 text-sm">
                Haz clic en una rama para ver detalles
              </div>
            </div>

            {/* Branch Details */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                Ramas Cognitivas
              </h3>
              
              {radarData.map((branch, index) => (
                <motion.div
                  key={branch.branch}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-black/40 rounded-lg p-4 border transition-all duration-200 cursor-pointer ${
                    selectedBranch === branch.branch
                      ? 'border-purple-400/60 bg-purple-900/20'
                      : 'border-gray-600/30 hover:border-gray-500/50'
                  }`}
                  onClick={() => setSelectedBranch(selectedBranch === branch.branch ? null : branch.branch)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-purple-400">
                        {branch.icon}
                      </div>
                      <h4 className="font-semibold text-white">{branch.branch}</h4>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-bold">{branch.value}</div>
                      <div className="text-gray-400 text-sm">/ 100</div>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                    <motion.div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${branch.value}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.8 }}
                    />
                  </div>
                  
                  {selectedBranch === branch.branch && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-gray-300 text-sm mt-3 pt-3 border-t border-gray-600"
                    >
                      {branch.description}
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {viewMode === 'timeline' && (
          <motion.div
            key="timeline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-black/40 rounded-xl p-6 border border-purple-500/20"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Evolución Temporal
            </h3>
            
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={timelineData}>
                <defs>
                  <linearGradient id="colorXP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorVitalidad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #4B5563',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Area type="monotone" dataKey="xp" stackId="1" stroke="#8B5CF6" fill="url(#colorXP)" />
                <Area type="monotone" dataKey="vitalidad" stackId="2" stroke="#10B981" fill="url(#colorVitalidad)" />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>
        )}

        {viewMode === 'fractal' && (
          <motion.div
            key="fractal"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="bg-black/40 rounded-xl p-8 border border-purple-500/20 text-center"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              🧬 Visualización Fractal Cognitiva
            </h3>
            
            {/* Fractal visual representativo */}
            <div className="relative mx-auto w-80 h-80 mb-6">
              <motion.div
                className="absolute inset-0 border-2 border-purple-500/50 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-4 border-2 border-blue-500/50 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-8 border-2 border-green-500/50 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-12 border-2 border-yellow-500/50 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold text-white">{cognitiveData.nivel}</div>
                  <div className="text-sm text-gray-300">Nivel</div>
                  <div className="text-lg text-purple-400 mt-2">{Math.round((cognitiveData.vitalidad + cognitiveData.eutimia + cognitiveData.carga + cognitiveData.coherencia) / 4)}%</div>
                  <div className="text-xs text-gray-400">Madurez</div>
                </div>
              </div>
            </div>
            
            <p className="text-gray-300 max-w-2xl mx-auto">
              El fractal cognitivo representa la interconexión de tus capacidades mentales. 
              Cada anillo simboliza una dimensión de tu evolución en el Prunaverso.
            </p>
          </motion.div>
        )}

        {viewMode === 'achievements' && (
          <motion.div
            key="achievements"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <Star className="w-5 h-5" />
              Logros Desbloqueados
            </h3>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-black/40 rounded-lg p-4 border transition-all duration-200 ${
                    achievement.unlocked
                      ? `${getRarityColor(achievement.rarity)} bg-gradient-to-br from-purple-900/20 to-blue-900/20`
                      : 'border-gray-600/30 opacity-50 grayscale'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">{achievement.title}</h4>
                      <p className="text-gray-300 text-sm mb-2">{achievement.description}</p>
                      <div className={`inline-block px-2 py-1 rounded text-xs border ${getRarityColor(achievement.rarity)}`}>
                        {achievement.rarity}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="text-center text-gray-400 mt-8">
              <p>🎯 Total: {achievements.length} logros desbloqueados</p>
              <p className="text-sm mt-2">Explora el sistema cognitivo para desbloquear más</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PlayerEvolution;