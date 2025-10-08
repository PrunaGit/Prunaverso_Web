import React from 'react';
import { motion } from 'framer-motion';

export const SmartButton = ({ children, onClick, className = "", variant = "default" }) => {
  const baseClasses = "px-4 py-2 rounded transition-all";
  const variants = {
    default: "bg-blue-600/20 border border-blue-500/50 text-blue-300 hover:bg-blue-600/30",
    primary: "bg-purple-600/20 border border-purple-500/50 text-purple-300 hover:bg-purple-600/30",
    danger: "bg-red-600/20 border border-red-500/50 text-red-300 hover:bg-red-600/30"
  };

  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {children}
    </motion.button>
  );
};

export const SmartInput = ({ placeholder, value, onChange, className = "" }) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`bg-black/40 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none ${className}`}
    />
  );
};

export const SmartGamepadButton = ({ icon, label, onClick, active = false }) => {
  return (
    <motion.button
      className={`p-3 rounded-lg border transition-all ${
        active 
          ? 'bg-cyan-600/30 border-cyan-400 text-cyan-300' 
          : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:border-gray-500'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="text-xl mb-1">{icon}</div>
      <div className="text-xs">{label}</div>
    </motion.button>
  );
};