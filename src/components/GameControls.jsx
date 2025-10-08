import React from 'react';
import { motion } from 'framer-motion';

const GameControls = ({ onAction }) => {
  return (
    <motion.div className="bg-black/40 rounded-lg p-4">
      <h3 className="text-cyan-400 font-semibold mb-3">Controles del Sistema</h3>
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => onAction?.('reset')}
          className="bg-red-600/20 border border-red-500/50 rounded px-3 py-2 text-red-300 hover:bg-red-600/30"
        >
          Reset
        </button>
        <button 
          onClick={() => onAction?.('scan')}
          className="bg-blue-600/20 border border-blue-500/50 rounded px-3 py-2 text-blue-300 hover:bg-blue-600/30"
        >
          Scan
        </button>
      </div>
    </motion.div>
  );
};

export default GameControls;