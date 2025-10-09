import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import atmosphereManager from "../system-core/atmosphereManager.js";

export default function PrunaversoLauncher() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [status, setStatus] = useState("⏳ Verificando sistemas...");
  const [systemHealth, setSystemHealth] = useState({
    backend: false,
    frontend: true,
    cognitive: false
  });

  useEffect(() => {
    atmosphereManager.setAtmosphere("cosmic");
    
    // Timer para reloj cósmico
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // Verificación de sistemas
    const checkSystems = async () => {
      try {
        // Verificar backend
        const backendCheck = await fetch("/api/ping").catch(() => null);
        const backendOk = backendCheck?.ok;
        
        // Verificar sistema cognitivo (localStorage y managers)
        const cognitiveCheck = window.localStorage && 
          typeof atmosphereManager?.setAtmosphere === 'function';
        
        setSystemHealth({
          backend: backendOk,
          frontend: true,
          cognitive: cognitiveCheck
        });

        if (backendOk && cognitiveCheck) {
          setStatus("🟢 Sistemas Prunaversales Activos");
        } else if (cognitiveCheck) {
          setStatus("🟠 Sistema Cognitivo Activo (sin backend)");
        } else {
          setStatus("🔴 Modo de emergencia local");
        }
      } catch (error) {
        console.log("Sistema check:", error);
        setStatus("🔴 Conexión local sin backend");
      }
    };
    
    // Delay inicial para efectos visuales
    setTimeout(checkSystems, 1500);
    
    return () => clearInterval(timer);
  }, []);

  const options = [
    { 
      label: "🧠 Portal Cognitivo", 
      path: "/welcome", 
      color: "from-purple-600 to-indigo-500",
      description: "Entrada principal al metaverso" 
    },
    { 
      label: "🔮 Laboratorio de Diagnósticos", 
      path: "/diagnostics", 
      color: "from-pink-500 to-purple-500",
      description: "Estado del sistema en tiempo real"
    },
    { 
      label: "👥 Explorar Arquetipos", 
      path: "/selector", 
      color: "from-blue-500 to-cyan-400",
      description: "Galería de entidades cognitivas"
    },
    { 
      label: "🚀 Despertar Inmediato", 
      path: "/awakening", 
      color: "from-indigo-500 to-fuchsia-500",
      description: "Experiencia narrativa principal"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white overflow-hidden relative">
      
      {/* Fondo animado - partículas estelares */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: [null, -100]
            }}
            transition={{
              duration: Math.random() * 8 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut"
            }}
          />
        ))}
      </div>

      {/* Header Principal */}
      <motion.div
        initial={{ opacity: 0, y: -40, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="mb-12 relative z-10"
      >
        <motion.h1 
          className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-2xl mb-4"
          animate={{ 
            textShadow: [
              "0 0 20px rgba(147, 51, 234, 0.5)",
              "0 0 40px rgba(147, 51, 234, 0.8)",
              "0 0 20px rgba(147, 51, 234, 0.5)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ✦ PRUNAVERSO ✦
        </motion.h1>
        
        <motion.p 
          className="text-yellow-300 font-semibold text-xl mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          Portal de Arquetipos Cognitivos Interactivos
        </motion.p>
        
        <motion.p 
          className="text-purple-200 mt-4 max-w-2xl mx-auto text-sm md:text-base leading-relaxed px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          Explora la diversidad cognitiva a través de réplicas mentales y experiencias evolutivas
          basadas en la ecuación primaria de clasificación del alma.
        </motion.p>
      </motion.div>

      {/* Grid de Opciones Principales */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 px-4 max-w-4xl"
      >
        {options.map((opt, i) => (
          <motion.button
            key={i}
            onClick={() => navigate(opt.path)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + i * 0.1, duration: 0.5 }}
            whileHover={{ 
              scale: 1.05, 
              y: -5,
              boxShadow: "0 20px 40px rgba(147, 51, 234, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
            className={`group px-8 py-6 bg-gradient-to-r ${opt.color} rounded-2xl font-semibold text-lg shadow-xl transition-all duration-300 hover:shadow-2xl border border-white/10 hover:border-white/30`}
          >
            <div className="text-xl mb-2 group-hover:scale-110 transition-transform duration-200">
              {opt.label}
            </div>
            <div className="text-sm opacity-80 group-hover:opacity-100 transition-opacity duration-200">
              {opt.description}
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Estado del Sistema */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="flex flex-col items-center space-y-2 mb-8"
      >
        <div className="text-purple-300 text-lg font-medium">
          {time.toLocaleTimeString('es-ES', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          })} — {status}
        </div>
        
        <div className="flex space-x-4 text-xs">
          <span className={`px-2 py-1 rounded ${systemHealth.frontend ? 'bg-green-700' : 'bg-red-700'}`}>
            Frontend {systemHealth.frontend ? '✓' : '✗'}
          </span>
          <span className={`px-2 py-1 rounded ${systemHealth.backend ? 'bg-green-700' : 'bg-yellow-700'}`}>
            Backend {systemHealth.backend ? '✓' : '~'}
          </span>
          <span className={`px-2 py-1 rounded ${systemHealth.cognitive ? 'bg-green-700' : 'bg-red-700'}`}>
            Cognitivo {systemHealth.cognitive ? '✓' : '✗'}
          </span>
        </div>
      </motion.div>

      {/* Acciones Rápidas */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="flex flex-wrap justify-center gap-4 text-sm mb-8"
      >
        <button
          onClick={() => navigate("/menu")}
          className="px-4 py-2 bg-purple-700/50 hover:bg-purple-600/50 rounded-xl transition-colors duration-200"
        >
          🎮 Menú de Juego
        </button>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-700/50 hover:bg-indigo-600/50 rounded-xl transition-colors duration-200"
        >
          🔄 Reiniciar Portal
        </button>
        <button
          onClick={() => navigate("/admin")}
          className="px-4 py-2 bg-red-700/50 hover:bg-red-600/50 rounded-xl transition-colors duration-200"
        >
          🛠️ Admin
        </button>
      </motion.div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-6 text-xs text-purple-400 text-center px-4"
      >
        <div>Prunaverso System v2.2.0 • Cognitive Architecture • Neural Simulation</div>
        <div className="mt-1">Sistema Operativo Cognitivo • Gestión de Arquetipos Mentales</div>
      </motion.footer>
    </div>
  );
}