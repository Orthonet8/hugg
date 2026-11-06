import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const appUrl = env.VITE_APP_URL || 'http://127.0.0.1:8000'

  return {
    base: '/landing/',
    plugins: [react()],
    server: {
      host: true,
      proxy: {
        '/api': {
          target: appUrl,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: '../server/public/landing',
      emptyOutDir: true,
    },
  }
})
