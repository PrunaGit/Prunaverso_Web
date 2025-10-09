import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import useVisitorProfile from "../hooks/useVisitorProfile";
import atmosphereManager from "../system-core/atmosphereManager.js";
import { useEffect } from "react";

export default function IdentificationScreen() {
  const navigate = useNavigate();
  const { setProfile } = useVisitorProfile();

  useEffect(() => {
    atmosphereManager.setAtmosphere("exploratory");
  }, []);

  const selectProfile = (type) => {
    setProfile(type);
    
    // Configurar atmósfera específica según el perfil
    switch(type) {
      case "alex":
        atmosphereManager.setAtmosphere("developer");
        break;
      case "friend":
        atmosphereManager.setAtmosphere("collaborative");
        break;
      case "visitor":
        atmosphereManager.setAtmosphere("welcoming");
        break;
      default:
        atmosphereManager.setAtmosphere("neutral");
    }
    
    navigate("/menu");
  };

  const cards = [
    {
      id: "alex",
      title: "👨‍💻 Soy Alex Pruna",
      description: "Canal base del Prunaverso. Modo desarrollador y creador con acceso completo a herramientas avanzadas.",
      gradient: "from-purple-600 to-indigo-600",
      hoverGradient: "from-purple-500 to-indigo-500"
    },
    {
      id: "friend",
      title: "🤝 Soy un amigo del Prunaverso",
      description: "Modo explorador colaborativo. Acceso a herramientas cognitivas, personajes y funciones de juego.",
      gradient: "from-blue-600 to-teal-600",
      hoverGradient: "from-blue-500 to-teal-500"
    },
    {
      id: "visitor",
      title: "🌟 Soy un visitante curioso",
      description: "Modo guiado y educativo. Ideal para primeros pasos dentro del metaverso con introducción progresiva.",
      gradient: "from-emerald-600 to-cyan-600",
      hoverGradient: "from-emerald-500 to-cyan-500"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-6 relative overflow-hidden">
      {/* Efectos de fondo */}
      <div className="absolute inset-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: 0
            }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center mb-12"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent"
        >
          ¿Quién eres dentro del Prunaverso?
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-lg text-purple-200 max-w-2xl mx-auto"
        >
          Tu identidad determinará las herramientas, lentes cognitivas y experiencias disponibles
        </motion.p>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        {cards.map((card, i) => (
          <motion.div
            key={card.id}
            onClick={() => selectProfile(card.id)}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.1, duration: 0.5 }}
            whileHover={{ 
              scale: 1.05, 
              y: -10,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.95 }}
            className={`cursor-pointer bg-gradient-to-br ${card.gradient} hover:bg-gradient-to-br hover:${card.hoverGradient} rounded-2xl p-8 backdrop-blur-sm shadow-xl transition-all duration-300 border border-white/10 hover:border-white/20 hover:shadow-2xl`}
          >
            <motion.h3 
              className="text-2xl font-bold mb-4 text-white"
              whileHover={{ scale: 1.05 }}
            >
              {card.title}
            </motion.h3>
            <p className="text-white/90 leading-relaxed">
              {card.description}
            </p>
            
            <motion.div
              className="mt-6 text-center"
              whileHover={{ scale: 1.1 }}
            >
              <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium">
                Seleccionar identidad
              </span>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="mt-12 text-center"
      >
        <button
          onClick={() => navigate("/welcome")}
          className="text-purple-300 hover:text-white transition-colors duration-200 underline"
        >
          ← Volver a la bienvenida
        </button>
      </motion.div>
    </div>
  );
}