import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

const PrunaversoKnowledgeSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    if (query.trim()) {
      onSearch?.(query);
    }
  };

  return (
    <motion.div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
      <h3 className="text-purple-400 font-semibold mb-3">Búsqueda de Conocimiento</h3>
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar en el conocimiento prunaversal..."
          className="flex-1 bg-black/40 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-purple-600/20 border border-purple-500/50 rounded px-3 py-2 text-purple-300 hover:bg-purple-600/30"
        >
          <Search className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default PrunaversoKnowledgeSearch;