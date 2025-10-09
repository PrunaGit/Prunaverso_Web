import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useVisitorProfile from "../hooks/useVisitorProfile";
import { useCognitiveLens } from "../hooks/useCognitiveLens";
import atmosphereManager from "../system-core/atmosphereManager.js";
import { useEffect, useState } from "react";

export default function MainMenu() {
  const navigate = useNavigate();
  const { profile } = useVisitorProfile();
  const { activeLenses } = useCognitiveLens();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentAtmosphere, setCurrentAtmosphere] = useState("initializing");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    
    // Obtener atmósfera actual
    setCurrentAtmosphere(atmosphereManager.getCurrentAtmosphere() || "neutral");
    
    return () => clearInterval(timer);
  }, []);

  const getProfileDisplay = () => {
    switch(profile) {
      case "alex": return "Alex Pruna (Desarrollador)";
      case "friend": return "Amigo del Prunaverso";
      case "visitor": return "Visitante Curioso";
      default: return "Identidad Indefinida";
    }
  };

  const getProfileOptions = () => {
    const baseOptions = [
      { path: "/awakening", label: "🔮 Modo Prunaversal", description: "Experiencia narrativa principal" },
      { path: "/diagnostics", label: "⚙️ Diagnósticos", description: "Estado del sistema cognitivo" },
    ];

    const profileSpecific = {
      alex: [
        { path: "/characters", label: "👥 Gestión de Personajes", description: "Herramientas de desarrollo" },
        { path: "/gdd", label: "📜 GDD Interactivo", description: "Documento de diseño del juego" },
        { path: "/player-evolution", label: "🧠 Evolución Cognitiva", description: "Sistema de progresión" },
        { path: "/logs", label: "📊 Logs del Sistema", description: "Monitoreo avanzado" },
      ],
      friend: [
        { path: "/characters", label: "👥 Explorar Personajes", description: "Galería de entidades" },
        { path: "/player-evolution", label: "🧠 Evolución Cognitiva", description: "Tu progreso personal" },
        { path: "/gdd", label: "📜 Lore del Prunaverso", description: "Historia y documentación" },
      ],
      visitor: [
        { path: "/characters", label: "👥 Conocer Personajes", description: "Introducción guiada" },
        { path: "/tutorial", label: "🎓 Tutorial Interactivo", description: "Aprende los fundamentos" },
        { path: "/about", label: "ℹ️ Sobre el Prunaverso", description: "¿Qué es este lugar?" },
      ]
    };

    return [...(profileSpecific[profile] || profileSpecific.visitor), ...baseOptions];
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Fondo animado dinámico */}
      <div className="absolute inset-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: window.innerHeight + 10
            }}
            animate={{ 
              y: -10,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 8 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
        className="z-10 max-w-6xl w-full px-6"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-indigo-300 bg-clip-text text-transparent">
            Portal del <span className="text-purple-300">Prunaverso</span>
          </h1>
          
          <div className="text-purple-200 space-y-2">
            <p className="text-lg">
              <span className="font-semibold text-white">{getProfileDisplay()}</span>
            </p>
            {activeLenses?.length > 0 && (
              <p className="text-sm">
                Lentes activas: <span className="text-purple-300">{activeLenses.join(", ")}</span>
              </p>
            )}
            <p className="text-sm text-purple-400">
              Atmósfera: {currentAtmosphere} • {currentTime.toLocaleTimeString()}
            </p>
          </div>
        </motion.div>

        {/* Opciones principales */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {getProfileOptions().map((option, i) => (
            <motion.button
              key={option.path}
              onClick={() => navigate(option.path)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.5 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                boxShadow: "0 20px 40px rgba(147, 51, 234, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="group p-6 bg-white/10 hover:bg-white/20 rounded-2xl font-medium backdrop-blur-sm shadow-lg border border-white/10 hover:border-purple-400/50 transition-all duration-300 text-left"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-200">
                {option.label}
              </div>
              <div className="text-sm text-purple-200 group-hover:text-white transition-colors duration-200">
                {option.description}
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Acciones rápidas */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate("/welcome")}
            className="px-4 py-2 text-sm bg-purple-700/50 hover:bg-purple-600/50 rounded-xl transition-colors duration-200"
          >
            🔄 Cambiar identidad
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm bg-indigo-700/50 hover:bg-indigo-600/50 rounded-xl transition-colors duration-200"
          >
            🔁 Reiniciar sistema
          </button>
          {profile === "alex" && (
            <button
              onClick={() => navigate("/admin")}
              className="px-4 py-2 text-sm bg-red-700/50 hover:bg-red-600/50 rounded-xl transition-colors duration-200"
            >
              🛠️ Panel de administración
            </button>
          )}
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-4 text-sm text-purple-400"
      >
        Sistema Operativo Cognitivo v2.1.0 — Estado: {currentAtmosphere || "Inicializando"}
      </motion.div>
    </div>
  );
}