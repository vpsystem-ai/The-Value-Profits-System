import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Tomt prefix: også variabler uden VITE_. De bruges kun her i konfigurationen
  // til at nå backenden under udvikling — intet af det når klienten.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        // Bet365-tallene. Under udvikling går vi uden om Vercel-funktionen og
        // rammer web-app'ens endpoint direkte; nøglen sættes på her, så den
        // aldrig passerer browseren. I produktion er det api/bet365.js.
        '/api/bet365': {
          target: env.VPP_API_ORIGIN || 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (p) =>
            p.replace(/^\/api\/bet365/, '/api/public/bet365-performance'),
          configure: (proxy) => {
            proxy.on('proxyReq', (req) => {
              if (env.PUBLIC_STATS_API_KEY) {
                req.setHeader('x-api-key', env.PUBLIC_STATS_API_KEY)
              }
            })
          },
        },
        // Videresend øvrige API-kald til en lokalt kørende funktion under
        // udvikling. I produktion håndterer Vercel /api/* direkte.
        '/api': {
          target: env.API_PROXY_TARGET || 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  }
})
