import { useState } from 'react';

/**
 * Hook para gestionar el conocimiento del Prunaverso
 */
export const usePrunaversoKnowledge = () => {
  const [knowledge, setKnowledge] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchKnowledge = async (query) => {
    setIsLoading(true);
    // Simular búsqueda
    setTimeout(() => {
      setKnowledge([
        { id: 1, title: 'Concepto Prunaversal', content: `Resultado de búsqueda para: ${query}` }
      ]);
      setIsLoading(false);
    }, 1000);
  };

  return {
    knowledge,
    isLoading,
    searchKnowledge
  };
};