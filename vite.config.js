import { defineConfig } from 'vite'
import fs from 'fs'

export default defineConfig({
  server: {
    port: 5193,
    strictPort: true,
    https: {
      key: fs.readFileSync('./certs/localhost-key.pem'),
      cert: fs.readFileSync('./certs/localhost.pem'),
    },
    hmr: {
      protocol: 'wss',
      host: 'localhost',
      clientPort: 5193,
    }
  },
})