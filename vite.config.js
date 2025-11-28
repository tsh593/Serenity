import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  // Add this to handle environment variables better
  define: {
    'process.env': {}
  }
})