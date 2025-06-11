import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      'taskmanager.loca.lt', // LocalTunnel domain
      '103.181.40.96', // Your public IP
    ],
  },
})