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
        // No necesitamos 'rewrite' aquí si tu backend espera las rutas con /api (ej. /api/disponibilidad)
      }
    }
  }
})