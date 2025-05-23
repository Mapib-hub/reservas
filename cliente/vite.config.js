import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    host: true, // Para que sea accesible en tu red local
    proxy: {
      // Redirige las solicitudes de /api al servidor backend
      '/api': {
        target: 'http://localhost:3000', // Asegúrate que esta sea la URL de tu backend Express
        changeOrigin: true, // Necesario para vhosts y para que el backend reciba el host correcto
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[Vite Proxy Debug] Original URL: ${req.url}`);
            console.log(`[Vite Proxy Debug] Path enviado al backend: ${proxyReq.path}`);
          });
          proxy.on('error', (err, req, res) => {
            console.error('[Vite Proxy Debug] Error:', err);
          });
        }
      }
    }
  }
})