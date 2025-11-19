import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Permite conexões de qualquer IP (necessário para ngrok)
    port: 5173,
    cors: true,
    allowedHosts: [
      'symmetrical-sundrily-anjanette.ngrok-free.dev',
      'localhost',
      '127.0.0.1'
    ]
  }
})
