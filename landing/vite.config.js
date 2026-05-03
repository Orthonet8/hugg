import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/landing/',
  plugins: [react()],
  server: {
    host: true,
  },
  build: {
    outDir: '../server/public/landing',
    emptyOutDir: true,
  },
})
