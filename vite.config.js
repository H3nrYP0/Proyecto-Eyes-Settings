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
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.(js|jsx)$/,
    exclude: []
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json'],
    alias: {
      // ========== FEATURES ==========
      '@auth': path.resolve(__dirname, './src/features/auth'),
      '@compras': path.resolve(__dirname, './src/features/compras'),
      '@configuracion': path.resolve(__dirname, './src/features/configuración'),
      '@dashboard': path.resolve(__dirname, './src/features/dashboard'),
      '@home': path.resolve(__dirname, './src/features/home'),
      '@purchases': path.resolve(__dirname, './src/features/purchases'),
      '@sales': path.resolve(__dirname, './src/features/sales'),
      '@seguridad': path.resolve(__dirname, './src/features/seguridad'),
      '@servicios': path.resolve(__dirname, './src/features/servicios'),

      // ========== LIB ==========
      '@lib': path.resolve(__dirname, './src/lib'),

      // ========== SHARED ==========
      '@shared': path.resolve(__dirname, './src/shared'),
      
      // ========== COMPONENTS ==========
      '@components': path.resolve(__dirname, './src/components'),
      
      // ========== EJEMPLO PARA AGREGAR MÁS ALIAS ==========
      // Copia esta línea, cambia @nombre y la ruta:
      // '@nombre': path.resolve(__dirname, './src/ruta/hacia/la/carpeta'),
      //
      // Ejemplo: si quisieras agregar un alias para components:
      // '@components': path.resolve(__dirname, './src/app/components'),

      
    }
  }
})
