import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'docs'
  },

  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  server: {
    hmr: {
      overlay: true // This enables HMR overlay for displaying update messages
    }
  }
})
