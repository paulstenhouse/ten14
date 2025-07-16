import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Always serve index.html for any route (SPA routing)
    middlewareMode: false,
    fs: {
      strict: false,
    },
  },
})