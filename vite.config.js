import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'  // Necesario para rutas

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  //base: '/Proyecto-Eyes-Settings/', // ESTA LÍNEA ES CRUCIAL
  server: {
    port: 5173
  },
  resolve: {
    alias: {
      // ========== FEATURES ==========
      '@auth': path.resolve(__dirname, './src/app/features/auth'),
      '@compras': path.resolve(__dirname, './src/app/features/compras'),
      '@configuracion': path.resolve(__dirname, './src/app/features/configuración'),
      '@dashboard': path.resolve(__dirname, './src/app/features/dashboard'),
      '@home': path.resolve(__dirname, './src/app/features/home'),
      '@purchases': path.resolve(__dirname, './src/app/features/purchases'),
      '@sales': path.resolve(__dirname, './src/app/features/sales'),
      '@security': path.resolve(__dirname, './src/app/features/security'),
      '@seguridad': path.resolve(__dirname, './src/app/features/seguridad'),
      
      // ========== EJEMPLO PARA AGREGAR MÁS ALIAS ==========
      // Copia esta línea, cambia @nombre y la ruta:
      // '@nombre': path.resolve(__dirname, './src/ruta/hacia/la/carpeta'),
      //
      // Ejemplo: si quisieras agregar un alias para components:
      // '@components': path.resolve(__dirname, './src/app/components'),

      
    }
  }
})



