import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, BookOpen, Map, Layers, Zap, Brain, Target, Settings, 
  Users, Palette, Code, ChevronRight, Home, ExternalLink, FileText,
  Cpu, Award, Gamepad2
} from 'lucide-react';

// Importar el GDD JSON directamente
import gddJsonData from '../../docs/prunaverso_gdd.json';

const GDDInteractive = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('overview'); // 'overview', 'blueprint', 'search'
  const [selectedSection, setSelectedSection] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  // Estructura del GDD para navegación
  const gddStructure = [
    {
      id: 'concept',
      title: 'Concepto Core',
      icon: <Target className="w-5 h-5" />,
      color: 'from-purple-500 to-blue-500',
      data: gddJsonData.gameDesignDocument.concept,
      description: 'La esencia del Prunaverso'
    },
    {
      id: 'features',
      title: 'Características',
      icon: <Gamepad2 className="w-5 h-5" />,
      color: 'from-blue-500 to-cyan-500',
      data: gddJsonData.gameDesignDocument.features,
      description: 'Sistemas y mecánicas principales'
    },
    {
      id: 'architecture',
      title: 'Arquitectura',
      icon: <Cpu className="w-5 h-5" />,
      color: 'from-cyan-500 to-green-500',
      data: gddJsonData.gameDesignDocument.architecture,
      description: 'Sistema Operativo Cognitivo'
    },
    {
      id: 'progression',
      title: 'Progresión',
      icon: <Award className="w-5 h-5" />,
      color: 'from-green-500 to-yellow-500',
      data: gddJsonData.gameDesignDocument.progression,
      description: 'Niveles y experiencia'
    },
    {
      id: 'ui',
      title: 'Interfaz',
      icon: <Layers className="w-5 h-5" />,
      color: 'from-yellow-500 to-orange-500',
      data: gddJsonData.gameDesignDocument.ui,
      description: 'HUD y elementos visuales'
    },
    {
      id: 'technology',
      title: 'Tecnología',
      icon: <FileText className="w-5 h-5" />,
      color: 'from-orange-500 to-red-500',
      data: gddJsonData.gameDesignDocument.technology,
      description: 'Stack técnico y herramientas'
    }
  ];

  // Función de búsqueda
  const searchInGDD = (query) => {
    if (!query.trim()) return [];
    
    const results = [];
    const searchTerm = query.toLowerCase();
    
    gddStructure.forEach(section => {
      const searchInObject = (obj, path = section.title) => {
        Object.entries(obj).forEach(([key, value]) => {
          if (typeof value === 'string' && value.toLowerCase().includes(searchTerm)) {
            results.push({
              section: section.id,
              sectionTitle: section.title,
              path: `${path} > ${key}`,
              content: value,
              key: key
            });
          } else if (typeof value === 'object' && value !== null) {
            searchInObject(value, `${path} > ${key}`);
          }
        });
      };
      
      if (section.data) {
        searchInObject(section.data);
      }
    });
    
    return results;
  };

  // Manejar búsqueda
  useEffect(() => {
    if (searchQuery) {
      setSearchResults(searchInGDD(searchQuery));
      setViewMode('search');
    } else {
      setSearchResults([]);
      if (viewMode === 'search') {
        setViewMode('overview');
      }
    }
  }, [searchQuery]);

  // Manejar sección desde URL
  useEffect(() => {
    if (sectionId) {
      setSelectedSection(sectionId);
      setViewMode('overview');
    }
  }, [sectionId]);

  const renderValue = (value, depth = 0) => {
    if (typeof value === 'string') {
      return (
        <div className="text-gray-300 text-sm leading-relaxed">
          {value}
        </div>
      );
    }
    
    if (Array.isArray(value)) {
      return (
        <div className="space-y-1">
          {value.map((item, index) => (
            <div key={index} className="flex items-center gap-2 text-gray-300 text-sm">
              <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
              {typeof item === 'string' ? item : JSON.stringify(item)}
            </div>
          ))}
        </div>
      );
    }
    
    if (typeof value === 'object' && value !== null) {
      return (
        <div className={`space-y-3 ${depth > 0 ? 'ml-4 border-l border-gray-700 pl-4' : ''}`}>
          {Object.entries(value).map(([key, val]) => (
            <div key={key}>
              <div className="text-cyan-400 font-semibold text-sm mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </div>
              {renderValue(val, depth + 1)}
            </div>
          ))}
        </div>
      );
    }
    
    return <div className="text-gray-400 text-sm">{String(value)}</div>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      {/* Header */}
      <div className="bg-black/40 backdrop-blur border-b border-purple-500/30 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <BookOpen className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  GDD Interactivo
                </h1>
                <p className="text-gray-400 text-sm">Game Design Document v{gddJsonData.gameDesignDocument.metadata.version}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/portal')}
                className="flex items-center gap-2 px-4 py-2 bg-black/40 rounded-lg text-gray-400 hover:text-white transition-all"
              >
                <Home className="w-4 h-4" />
                Portal
              </button>
              
              <div className="flex bg-black/40 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('overview')}
                  className={`px-4 py-2 rounded text-sm transition-all ${
                    viewMode === 'overview' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Vista General
                </button>
                <button
                  onClick={() => setViewMode('blueprint')}
                  className={`px-4 py-2 rounded text-sm transition-all ${
                    viewMode === 'blueprint' 
                      ? 'bg-purple-600 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Blueprint
                </button>
              </div>
            </div>
          </div>
          
          {/* Barra de búsqueda */}
          <div className="mt-4 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar en el GDD... (ej: 'HUD ASCII', 'niveles', 'sistema cognitivo')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-gray-600 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Vista de Búsqueda */}
          {viewMode === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-purple-400">
                Resultados para "{searchQuery}" ({searchResults.length})
              </h2>
              
              {searchResults.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No se encontraron resultados</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {searchResults.map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-black/40 rounded-lg p-4 border border-gray-700 hover:border-purple-500/50 transition-all cursor-pointer"
                      onClick={() => {
                        setSelectedSection(result.section);
                        setViewMode('overview');
                        setSearchQuery('');
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-purple-400 text-sm font-semibold">
                          {result.sectionTitle}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div className="text-cyan-400 text-sm">
                          {result.path}
                        </div>
                      </div>
                      <div className="mt-2 text-gray-300 text-sm line-clamp-3">
                        {result.content}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Vista General */}
          {viewMode === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Panel de navegación */}
              <div className="lg:col-span-1 space-y-4">
                <h2 className="text-xl font-semibold text-purple-400 mb-6">Secciones del GDD</h2>
                
                {gddStructure.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-black/40 rounded-lg border transition-all cursor-pointer ${
                      selectedSection === section.id 
                        ? 'border-purple-500 bg-purple-900/20' 
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${section.color}`}>
                          {section.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{section.title}</h3>
                          <p className="text-gray-400 text-sm">{section.description}</p>
                        </div>
                        <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${
                          selectedSection === section.id ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Panel de contenido */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  {selectedSection ? (
                    <motion.div
                      key={selectedSection}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-black/40 rounded-lg border border-gray-700 p-6"
                    >
                      {(() => {
                        const section = gddStructure.find(s => s.id === selectedSection);
                        return (
                          <div>
                            <div className="flex items-center gap-3 mb-6">
                              <div className={`p-3 rounded-lg bg-gradient-to-r ${section.color}`}>
                                {section.icon}
                              </div>
                              <div>
                                <h2 className="text-2xl font-bold text-white">{section.title}</h2>
                                <p className="text-gray-400">{section.description}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-6">
                              {section.data && renderValue(section.data)}
                            </div>
                          </div>
                        );
                      })()}
                    </motion.div>
                  ) : (
                    <motion.div
                      key="welcome"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="bg-black/40 rounded-lg border border-gray-700 p-12 text-center"
                    >
                      <Map className="w-16 h-16 mx-auto mb-6 text-purple-400" />
                      <h2 className="text-2xl font-bold text-white mb-4">
                        Explora el Game Design Document
                      </h2>
                      <p className="text-gray-400 max-w-md mx-auto">
                        Selecciona una sección para explorar la documentación completa del Prunaverso, 
                        o utiliza la búsqueda para encontrar información específica.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* Vista Blueprint */}
          {viewMode === 'blueprint' && (
            <motion.div
              key="blueprint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                  Architecture Blueprint
                </h2>
                <p className="text-gray-400">Vista jerárquica del sistema Prunaverso</p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gddStructure.map((section, index) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className={`bg-gradient-to-br ${section.color} p-0.5 rounded-xl`}>
                      <div className="bg-black/80 rounded-xl p-6 h-full">
                        <div className="flex items-center gap-3 mb-4">
                          {section.icon}
                          <h3 className="font-bold text-white">{section.title}</h3>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-4">{section.description}</p>
                        
                        <div className="space-y-2">
                          {section.data && Object.keys(section.data).slice(0, 3).map((key, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                              <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </div>
                          ))}
                          {section.data && Object.keys(section.data).length > 3 && (
                            <div className="text-xs text-gray-500">
                              +{Object.keys(section.data).length - 3} más...
                            </div>
                          )}
                        </div>
                        
                        <button
                          onClick={() => {
                            setSelectedSection(section.id);
                            setViewMode('overview');
                          }}
                          className="mt-4 w-full bg-white/10 hover:bg-white/20 rounded-lg py-2 text-sm text-white transition-all flex items-center justify-center gap-2"
                        >
                          Ver Detalles
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default GDDInteractive;