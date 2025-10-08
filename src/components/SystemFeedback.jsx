import React from 'react';
import { motion } from 'framer-motion';

const SystemFeedback = ({ systemState }) => {
  return (
    <motion.div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
      <h3 className="text-green-400 font-semibold mb-2">Estado del Sistema</h3>
      <div className="text-gray-300 text-sm space-y-1">
        <p>Status: <span className="text-green-300">{systemState?.status || 'active'}</span></p>
        <p>Interacciones: <span className="text-cyan-300">{systemState?.interactions || 0}</span></p>
      </div>
    </motion.div>
  );
};

export default SystemFeedback;