import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Ensure react-router-dom is pre-bundled and not externalized during SSR builds
  optimizeDeps: {
    include: ['react-router-dom'],
  },
  ssr: {
    noExternal: ['react-router-dom'],
  },
})
