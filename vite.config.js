import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Para desarrollo local, usar base '/'
  // Para producción/GitHub Pages, usar '/Prunaverso_Web/'
  const base = mode === 'dev' ? '/' : '/Prunaverso_Web/';
  
  return {
    base,
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5179,
      strictPort: false,
      proxy: {
        '/api': {
          target: 'http://localhost:4001',
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks: {
            // Core React
            'react-core': ['react', 'react-dom'],
            'react-router': ['react-router-dom'],
            
            // UI Libraries
            'ui-motion': ['framer-motion'],
            'ui-charts': ['recharts'],
            
            // Sistema Cognitivo - Solo archivos JS
            'cognitive-system': [
              './src/system-core/cognitiveStateManager.js',
              './src/system-core/achievementSystem.js',
              './src/system-core/prunalgoritm.js'
            ]
          }
        }
      }
    }
  };
});
