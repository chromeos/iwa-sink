import { defineConfig } from 'vite'
import fs from 'fs'
import injectHTML from 'vite-plugin-html-inject'

export default defineConfig({
  plugins: [
    injectHTML()
  ],
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