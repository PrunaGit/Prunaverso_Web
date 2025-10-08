import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useVisitorProfile from '../../hooks/useVisitorProfile';
import useInteractionSystem from '../../hooks/useInteractionSystem';
import GameControls from '../../components/GameControls';
import SystemFeedback from '../../components/SystemFeedback';
import { SmartButton, SmartInput, SmartGamepadButton } from '../../components/SmartInteractives';

/**
 * 🛰️ PORTAL DEV - KERNEL PRUNAVERSAL
 * 
 * Interfaz de control y monitoreo para arquitectos del sistema.
 * HUD avanzado con acceso directo a la estructura interna.
 */
const DevPortal = () => {
  const { profile } = useVisitorProfile();
  const { systemState, registerInteraction, getContextualResponse } = useInteractionSystem();
  const [activeModule, setActiveModule] = useState('console');
  const [systemStats, setSystemStats] = useState({
    modules: 5,
    connections: 12,
    cognitive_depth: 3,
    uptime: '00:42:13'
  });
  const [consoleOutput, setConsoleOutput] = useState([
    '🌌 Prunaverso Dev Terminal initialized',
    '🔗 All systems operational',
    '🧠 Cognitive patterns monitoring active'
  ]);
  const [commandHistory, setCommandHistory] = useState([]);

  // Simular datos del sistema en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemStats(prev => ({
        ...prev,
        uptime: calculateUptime(),
        connections: prev.connections + Math.floor(Math.random() * 3 - 1),
        cognitive_depth: Math.max(1, prev.cognitive_depth + (Math.random() - 0.5))
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Sistema de comandos inteligente
  const executeCommand = (command) => {
    const timestamp = new Date().toLocaleTimeString();
    const interaction = registerInteraction('command', command, { timestamp });
    
    setCommandHistory(prev => [...prev.slice(-10), { command, timestamp, interaction }]);
    
    // Respuestas contextuales inteligentes
    const responses = {
      'status': () => [
        `💫 System Status: ${systemState.alertLevel.toUpperCase()}`,
        `🧠 Cognitive Pattern: ${systemState.cognitivePattern}`,
        `⚡ Interactions: ${systemState.interactionCount}`,
        `🌟 Atmosphere: ${Math.round(systemState.atmosphereIntensity * 100)}%`
      ],
      'users': () => [
        `👤 Current User: ${profile.detectedType || 'Unknown'}`,
        `📊 Session Time: ${Math.round((Date.now() - (profile.sessionStart || Date.now())) / 1000)}s`,
        `🎯 Preferred Interaction: ${profile.preferredInteractionType || 'detecting...'}`
      ],
      'help': () => [
        '📋 Available Commands:',
        '  status    - System status report',
        '  users     - User analytics',
        '  monitor   - Real-time metrics',
        '  characters - Character database',
        '  deploy    - Deployment status',
        '  clear     - Clear console'
      ],
      'monitor': () => [
        `📈 Real-time Metrics:`,
        `  Build: successful`,
        `  Deploy: active`,
        `  Health: ${systemStats.connections > 10 ? 'optimal' : 'degraded'}`,
        `  Response: ${Math.round(Math.random() * 50 + 50)}ms`
      ],
      'characters': () => [
        '👥 Character Database:',
        `  Total Characters: ${Math.floor(Math.random() * 20 + 50)}`,
        `  Active Profiles: ${Math.floor(Math.random() * 10 + 5)}`,
        `  Relationships: ${Math.floor(Math.random() * 100 + 200)} mapped`
      ],
      'deploy': () => [
        '🚀 Deployment Status:',
        '  GitHub Pages: ✅ Active',
        '  Build Time: 3.2s',
        '  Bundle Size: 140KB',
        '  Last Deploy: Just now'
      ],
      'clear': () => {
        setConsoleOutput([]);
        return ['Console cleared.'];
      }
    };

    const response = responses[command.toLowerCase()] || (() => [
      `❓ Unknown command: ${command}`,
      `💡 Type 'help' for available commands`,
      `🤖 AI Suggestion: ${getContextualResponse(command, 'command')}`
    ]);

    const output = response();
    setConsoleOutput(prev => [...prev, `$ ${command}`, ...output, '']);
  };

  const calculateUptime = () => {
    const start = Date.now();
    const elapsed = Math.floor((start % (24 * 60 * 60 * 1000)) / 1000);
    const hours = Math.floor(elapsed / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((elapsed % 3600) / 60).toString().padStart(2, '0');
    const seconds = (elapsed % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const modules = [
    { id: 'console', name: 'CONSOLE', icon: '⚡', status: 'active' },
    { id: 'monitor', name: 'MONITOR', icon: '📊', status: 'active' },
    { id: 'vectors', name: 'VECTORS', icon: '📐', status: 'running' },
    { id: 'neural', name: 'NEURAL', icon: '🧠', status: 'learning' },
    { id: 'quantum', name: 'QUANTUM', icon: '⚛️', status: 'standby' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: 'text-green-400',
      running: 'text-blue-400', 
      learning: 'text-purple-400',
      standby: 'text-yellow-400'
    };
    return colors[status] || 'text-gray-400';
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono overflow-hidden">
      {/* Matriz de fondo */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="w-full h-px bg-green-500 mb-8" style={{
            animation: `scroll ${2 + i * 0.1}s linear infinite`,
            transform: `translateY(${i * 30}px)`
          }} />
        ))}
      </div>

      {/* Header del Kernel */}
      <motion.header 
        className="relative z-10 border-b border-green-700 p-4"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">
              ╔══ KERNEL PRUNAVERSAL v1.0.0 ══╗
            </h1>
            <p className="text-sm text-green-600">
              ARCHITECT: {profile?.name || 'UNKNOWN'} | UPTIME: {systemStats.uptime}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">SYSTEM STATUS</div>
            <div className="text-green-400">◉ OPERATIONAL</div>
          </div>
        </div>
      </motion.header>

      <div className="flex h-full">
        {/* Panel lateral - Módulos */}
        <motion.aside 
          className="w-64 border-r border-green-700 p-4"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-cyan-400 mb-4 font-bold">╔═ MODULES ═╗</h3>
          {modules.map((module, index) => (
            <SmartButton
              key={module.id}
              target={`module_${module.id}`}
              onClick={() => setActiveModule(module.id)}
              className={`w-full p-2 mb-2 text-left border border-gray-700 rounded transition-all
                ${activeModule === module.id ? 'bg-green-900/30 border-green-400' : 'hover:border-green-600'}
              `}
            >
              <div className="flex items-center justify-between">
                <span>{module.icon} {module.name}</span>
                <span className={`text-xs ${getStatusColor(module.status)}`}>
                  ● {module.status.toUpperCase()}
                </span>
              </div>
            </SmartButton>
          ))}

          {/* Stats del sistema */}
          <div className="mt-8 p-3 border border-gray-700 rounded">
            <h4 className="text-cyan-400 mb-2">STATS</h4>
            <div className="text-xs space-y-1">
              <div>MODULES: {systemStats.modules}</div>
              <div>CONNECTIONS: {systemStats.connections}</div>
              <div>DEPTH: {systemStats.cognitive_depth}</div>
              <div>VECTOR: [{profile?.vector?.join(',') || '0,0,0'}]</div>
            </div>
          </div>
        </motion.aside>

        {/* Área principal - Consola */}
        <main className="flex-1 p-4">
          <motion.div 
            className="h-full border border-green-700 rounded p-4 bg-black/50"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-cyan-400 font-bold">
                ╔═ {modules.find(m => m.id === activeModule)?.name} INTERFACE ═╗
              </h2>
              <div className="text-xs text-gray-500">
                {new Date().toLocaleTimeString()}
              </div>
            </div>

            <div className="h-full overflow-auto">
              {activeModule === 'console' && (
                <div className="space-y-2 text-sm">
                  {/* Output del console */}
                  <div className="bg-black/50 p-3 rounded border border-gray-700 font-mono text-xs max-h-60 overflow-auto">
                    {consoleOutput.map((line, index) => (
                      <div key={index} className={`
                        ${line.startsWith('$') ? 'text-cyan-400' : 
                          line.startsWith('✅') ? 'text-green-400' :
                          line.startsWith('❓') ? 'text-red-400' :
                          line.startsWith('💡') ? 'text-yellow-400' :
                          'text-gray-300'}
                      `}>
                        {line}
                      </div>
                    ))}
                  </div>
                  
                  {/* Input inteligente del terminal */}
                  <div className="flex items-center space-x-2">
                    <span className="text-cyan-400 font-mono text-sm">$</span>
                    <SmartInput
                      target="console_command"
                      placeholder="Type command... (help for available commands)"
                      onInputChange={(e, interaction) => {
                        if (e.key === 'Enter') {
                          const command = e.target.value.trim();
                          if (command) {
                            executeCommand(command);
                            e.target.value = '';
                          }
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const command = e.target.value.trim();
                          if (command) {
                            executeCommand(command);
                            e.target.value = '';
                          }
                        }
                      }}
                      className="flex-1"
                    />
                  </div>
                  
                  {/* Quick commands */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {['status', 'users', 'monitor', 'help'].map(cmd => (
                      <SmartButton
                        key={cmd}
                        target={`quick_cmd_${cmd}`}
                        onClick={() => executeCommand(cmd)}
                        className="text-xs px-2 py-1"
                      >
                        {cmd}
                      </SmartButton>
                    ))}
                  </div>
                  
                  {/* Gaming commands */}
                  <div className="mt-4 space-y-1">
                    <div className="text-gray-400 text-xs">🎮 Gaming Commands:</div>
                    <div className="flex flex-wrap gap-2">
                      <SmartGamepadButton psButton="×" pcKey="Enter" action={() => executeCommand('status')}>
                        Status
                      </SmartGamepadButton>
                      <SmartGamepadButton psButton="○" pcKey="Esc" action={() => executeCommand('clear')}>
                        Clear
                      </SmartGamepadButton>
                    </div>
                  </div>
                </div>
              )}

              {activeModule === 'monitor' && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-gray-700 p-3 rounded">
                    <h4 className="text-cyan-400 mb-2">COGNITIVE LOAD</h4>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div className="bg-green-400 h-2 rounded-full w-3/4"></div>
                    </div>
                    <div className="text-xs mt-1">75% utilization</div>
                  </div>
                  <div className="border border-gray-700 p-3 rounded">
                    <h4 className="text-cyan-400 mb-2">PORTAL TRAFFIC</h4>
                    <div className="text-2xl text-green-400">42</div>
                    <div className="text-xs">active sessions</div>
                  </div>
                </div>
              )}

              {activeModule === 'vectors' && (
                <div className="text-center">
                  <div className="text-6xl text-cyan-400 mb-4">📐</div>
                  <div className="text-lg">VECTOR SPACE NAVIGATOR</div>
                  <div className="text-sm text-gray-500 mt-2">
                    Mapping {systemStats.connections} dimensional relationships
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>

      {/* Sistema de Feedback en Tiempo Real */}
      <SystemFeedback />

      {/* Controls gaming para arquitectos */}
      <GameControls />

      <style jsx>{`
        @keyframes scroll {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100vw); }
        }
      `}</style>
    </div>
  );
};

export default DevPortal;