import React, { useEffect, useState } from 'react';
import { UnifiedRouter } from './components/UnifiedRouter.jsx';
import { initializePrunalgoritm } from './system-core/prunalgoritm.js';
import { uiLogger } from './system-core/logManager.js';
import atmosphereManager from './system-core/atmosphereManager.js';

export default function App() {
  const [isSystemReady, setIsSystemReady] = useState(false);
  const [initError, setInitError] = useState(null);

  console.log('🚀 App component loaded - Prunaverso OS v2.1.0 - Unificación Completa');

  // Inicializar sistema completo
  useEffect(() => {
    const initializeSystem = async () => {
      try {
        console.log('APP - Iniciando Prunaverso Web v2.1.0...');
        
        // Inicializar sistema core
        const success = await initializePrunalgoritm();
        
        if (success) {
          setIsSystemReady(true);
          console.log('APP - ✅ Sistema Prunaverso completamente inicializado');
          
          // Aplicar atmósfera inicial
          atmosphereManager.setAtmosphere('atmosphere-exploration');
          
        } else {
          throw new Error('Fallo en inicialización del sistema core');
        }
        
      } catch (error) {
        console.error('APP - Error crítico en inicialización:', error);
        setInitError(error.message);
        setIsSystemReady(false);
      }
    };

    initializeSystem();
  }, []);

  // Loading state mientras el sistema se inicializa
  if (!isSystemReady && !initError) {
    return React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
          color: '#ffffff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }
      },
      React.createElement(
        'div',
        { style: { textAlign: 'center', maxWidth: '400px', padding: '2rem' } },
        React.createElement(
          'div',
          {
            style: {
              fontSize: '4rem',
              marginBottom: '1rem',
              animation: 'pulse 2s infinite'
            }
          },
          '🧠'
        ),
        React.createElement(
          'h1',
          {
            style: {
              fontSize: '2rem',
              marginBottom: '1rem',
              color: '#6c5ce7'
            }
          },
          'Inicializando Prunaverso'
        ),
        React.createElement(
          'p',
          {
            style: {
              fontSize: '1rem',
              opacity: 0.8,
              marginBottom: '2rem'
            }
          },
          'Cargando Sistema Operativo Cognitivo v2.1.0...'
        ),
        React.createElement(
          'div',
          {
            style: {
              width: '100%',
              height: '4px',
              background: 'rgba(108, 92, 231, 0.2)',
              borderRadius: '2px',
              overflow: 'hidden'
            }
          },
          React.createElement(
            'div',
            {
              style: {
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, #6c5ce7, #a29bfe)',
                animation: 'loading-bar 2s infinite'
              }
            }
          )
        )
      ),
      React.createElement(
        'style',
        null,
        `
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes loading-bar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        `
      )
    );
  }

  // Error state
  if (initError) {
    return React.createElement(
      'div',
      {
        style: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #2d1b2d 0%, #442944 50%, #1a1a2e 100%)',
          color: '#ffffff',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        }
      },
      React.createElement(
        'div',
        { style: { textAlign: 'center', maxWidth: '500px', padding: '2rem' } },
        React.createElement(
          'div',
          { style: { fontSize: '3rem', marginBottom: '1rem' } },
          '⚠️'
        ),
        React.createElement(
          'h1',
          {
            style: {
              fontSize: '2rem',
              marginBottom: '1rem',
              color: '#ff6b6b'
            }
          },
          'Error de Inicialización'
        ),
        React.createElement(
          'p',
          {
            style: {
              fontSize: '1rem',
              opacity: 0.8,
              marginBottom: '2rem'
            }
          },
          `Error crítico: ${initError}`
        ),
        React.createElement(
          'button',
          {
            onClick: () => window.location.reload(),
            style: {
              padding: '12px 24px',
              background: '#6c5ce7',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1rem',
              cursor: 'pointer'
            }
          },
          'Reintentar Inicialización'
        )
      )
    );
  }

  // Sistema listo - renderizar aplicación principal
  return React.createElement(
    'div',
    { 
      id: 'prunaverso-app',
      className: 'prunaverso-unified-system',
      style: { minHeight: '100vh' }
    },
    React.createElement(UnifiedRouter)
  );
}
