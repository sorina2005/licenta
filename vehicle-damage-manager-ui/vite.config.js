import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true, // Fortam Vite sa verifice schimbarile activ
    },
    host: true, // Necesar pentru ca Docker sa poata mapa portul
    strictPort: true,
    port: 5173,
  }
})
