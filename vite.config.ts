import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split large third-party libraries into their own long-lived chunks so
        // app changes don't bust the vendor cache, and no single chunk balloons.
        // (recharts stays out of the main bundle and only loads with the admin
        // dashboard that imports it.)
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-vendor'))
            return 'recharts'
          if (id.includes('@mui') || id.includes('@emotion')) return 'mui'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('@tanstack')) return 'query'
          if (id.includes('react-router') || id.includes('react-redux') || id.includes('@reduxjs'))
            return 'router-redux'
          if (id.includes('/react/') || id.includes('/react-dom/') || id.includes('/scheduler/'))
            return 'react'
          return 'vendor'
        },
      },
    },
  },
})
