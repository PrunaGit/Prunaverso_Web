import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import useInteractionSystem from '../../hooks/useInteractionSystem';

/**
 * 🎯 SmartButton - Botón que reacciona inteligentemente
 * 
 * Cada botón aprende del usuario y adapta su comportamiento.
 */
const SmartButton = ({ 
  children, 
  onClick, 
  target, 
  type = 'primary',
  learning = true,
  ...props 
}) => {
  const { registerInteraction, getContextualResponse, systemState } = useInteractionSystem();
  const [interactionHistory, setInteractionHistory] = useState([]);
  const [confidence, setConfidence] = useState(0.5);
  const buttonRef = useRef(null);

  // Manejar hover inteligente
  const handleHover = (isHovering) => {
    if (isHovering) {
      const hoverTime = Date.now();
      registerInteraction('hover', target, { startTime: hoverTime });
      
      // Mostrar tooltip contextual
      if (buttonRef.current) {
        const response = getContextualResponse(target, 'hover');
        buttonRef.current.setAttribute('title', response);
      }
    }
  };

  // Manejar click inteligente
  const handleClick = (event) => {
    const clickData = {
      timestamp: Date.now(),
      position: { x: event.clientX, y: event.clientY },
      modifiers: {
        ctrl: event.ctrlKey,
        shift: event.shiftKey,
        alt: event.altKey
      }
    };

    // Registrar interacción
    const interaction = registerInteraction('click', target, clickData);
    
    // Actualizar historial de interacciones
    setInteractionHistory(prev => [...prev.slice(-5), interaction]);
    
    // Calcular confianza basada en patrones
    if (learning) {
      const newConfidence = calculateConfidence(interactionHistory);
      setConfidence(newConfidence);
    }

    // Ejecutar callback original
    if (onClick) {
      onClick(event, interaction);
    }
  };

  // Calcular confianza del botón basada en uso
  const calculateConfidence = (history) => {
    if (history.length === 0) return 0.5;
    
    const recentInteractions = history.slice(-3);
    const avgResponseTime = recentInteractions.reduce((acc, curr, index) => {
      if (index === 0) return acc;
      return acc + (curr.timestamp - recentInteractions[index - 1].timestamp);
    }, 0) / Math.max(recentInteractions.length - 1, 1);
    
    // Confianza alta si el usuario usa el botón de forma consistente
    if (avgResponseTime < 2000) return Math.min(confidence + 0.1, 1.0);
    if (avgResponseTime > 10000) return Math.max(confidence - 0.05, 0.1);
    
    return confidence;
  };

  // Estilos adaptativos basados en el patrón cognitivo
  const getAdaptiveStyles = () => {
    const pattern = systemState.cognitivePattern;
    const baseStyles = 'px-4 py-2 rounded-lg font-medium transition-all duration-300 relative overflow-hidden';
    
    const patternStyles = {
      technical_minded: 'bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30',
      gaming_focused: 'bg-green-800 hover:bg-green-700 text-green-300 border border-green-500/30',
      narrative_focused: 'bg-purple-800 hover:bg-purple-700 text-purple-300 border border-purple-500/30',
      rapid_explorer: 'bg-yellow-800 hover:bg-yellow-700 text-yellow-300 border border-yellow-500/30',
      contemplative: 'bg-blue-800 hover:bg-blue-700 text-blue-300 border border-blue-500/30'
    };

    return `${baseStyles} ${patternStyles[pattern] || patternStyles.technical_minded}`;
  };

  // Efectos de confianza
  const confidenceEffects = {
    scale: 1 + (confidence - 0.5) * 0.1,
    brightness: 0.8 + confidence * 0.4,
    glow: confidence > 0.8 ? '0 0 20px rgba(100, 255, 100, 0.3)' : 'none'
  };

  return (
    <motion.button
      ref={buttonRef}
      className={getAdaptiveStyles()}
      onClick={handleClick}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      data-interaction-target={target}
      animate={{
        scale: confidenceEffects.scale,
        filter: `brightness(${confidenceEffects.brightness})`,
        boxShadow: confidenceEffects.glow
      }}
      whileHover={{ 
        scale: confidenceEffects.scale * 1.05,
        filter: `brightness(${confidenceEffects.brightness * 1.2})`
      }}
      whileTap={{ scale: confidenceEffects.scale * 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      {...props}
    >
      {/* Indicador de confianza */}
      <motion.div
        className="absolute top-0 left-0 h-1 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
        initial={{ width: "50%" }}
        animate={{ width: `${confidence * 100}%` }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Contenido del botón */}
      <span className="relative z-10 flex items-center space-x-2">
        {children}
        
        {/* Indicador de interacciones */}
        {interactionHistory.length > 0 && (
          <span className="text-xs opacity-60">
            ({interactionHistory.length})
          </span>
        )}
      </span>
      
      {/* Efecto de click */}
      <motion.div
        className="absolute inset-0 bg-white/20 rounded-lg"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

/**
 * 🔍 SmartInput - Input que aprende del usuario
 */
const SmartInput = ({ target, onInputChange, placeholder, ...props }) => {
  const { registerInteraction, systemState } = useInteractionSystem();
  const [inputHistory, setInputHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const handleInput = (event) => {
    const value = event.target.value;
    const interaction = registerInteraction('input', target, { 
      value, 
      length: value.length,
      keyType: 'text'
    });
    
    // Generar sugerencias inteligentes
    generateSuggestions(value);
    
    if (onInputChange) {
      onInputChange(event, interaction);
    }
  };

  const generateSuggestions = (value) => {
    // Sugerencias basadas en el patrón cognitivo
    const pattern = systemState.cognitivePattern;
    const contextualSuggestions = {
      technical_minded: ['console.log', 'function', 'import', 'export'],
      narrative_focused: ['Once upon a time', 'The story begins', 'Character development'],
      gaming_focused: ['achievement', 'level up', 'high score', 'combo']
    };
    
    if (value.length > 2) {
      const relevant = contextualSuggestions[pattern] || [];
      setSuggestions(relevant.filter(s => s.toLowerCase().includes(value.toLowerCase())));
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="relative">
      <motion.input
        className="w-full px-4 py-2 bg-slate-800/80 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors"
        onChange={handleInput}
        data-interaction-target={target}
        placeholder={placeholder}
        whileFocus={{ scale: 1.02 }}
        {...props}
      />
      
      {/* Sugerencias */}
      {suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-gray-600 rounded-lg shadow-lg z-10"
        >
          {suggestions.slice(0, 3).map((suggestion, index) => (
            <div
              key={index}
              className="px-4 py-2 hover:bg-slate-700 cursor-pointer text-sm text-gray-300"
              onClick={() => {
                // Auto-completar
                const event = { target: { value: suggestion } };
                handleInput(event);
              }}
            >
              {suggestion}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

/**
 * 🎮 SmartGamepadButton - Botón específico para gamepad
 */
const SmartGamepadButton = ({ psButton, pcKey, action, children }) => {
  const { registerInteraction, systemState } = useInteractionSystem();
  
  const handleGamepadAction = () => {
    registerInteraction('gamepad', `${psButton}_${action}`, {
      psButton,
      pcKey,
      action,
      timestamp: Date.now()
    });
    
    // Ejecutar acción
    if (typeof action === 'function') {
      action();
    }
  };

  return (
    <SmartButton
      target={`gamepad_${psButton}`}
      onClick={handleGamepadAction}
      type="gaming"
    >
      <span className="flex items-center space-x-2">
        <span className="text-xs bg-blue-600 px-2 py-1 rounded">{psButton}</span>
        <span className="text-xs bg-gray-600 px-2 py-1 rounded">{pcKey}</span>
        <span>{children}</span>
      </span>
    </SmartButton>
  );
};

export { SmartButton, SmartInput, SmartGamepadButton };