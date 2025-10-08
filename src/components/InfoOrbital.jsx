import React from 'react';
import { motion } from 'framer-motion';

/**
 * Componente InfoOrbital - Placeholder para información orbital
 */
const InfoOrbital = ({ title, content, className = "" }) => {
  return (
    <motion.div
      className={`bg-purple-900/20 border border-purple-500/30 rounded-lg p-4 ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <h3 className="text-purple-400 font-semibold mb-2">{title}</h3>
      <p className="text-gray-300 text-sm">{content}</p>
    </motion.div>
  );
};

export default InfoOrbital;