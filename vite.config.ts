import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('@google/generative-ai')) return 'vendor-ai';
            if (id.includes('lucide-react')) return 'vendor-icons';
            if (id.includes('firebase')) return 'vendor-firebase';
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
          }
        },
      },
    },
  },
})
