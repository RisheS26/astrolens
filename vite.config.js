import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/ai-api': {
        target: 'https://ai.hackclub.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai-api/, '/proxy/v1')
      }
    }
  }
})
