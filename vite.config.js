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
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            motion: ['framer-motion']
          }
        }
      }
    }
  };
});
