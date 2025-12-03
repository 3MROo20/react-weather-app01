import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,  // allow mobile testing on local network
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://api.weatherapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: "dist",
  }
})


