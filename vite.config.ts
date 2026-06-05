import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    tailwindcss(),
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'inline',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        navigateFallbackDenylist: [/^\/mvp1\/.*$/],
        runtimeCaching: [
          {
            urlPattern: /^\/mvp1\/.*$/,
            handler: 'NetworkOnly',
          }
        ]
      },
      manifest: {
        name: 'Fredericksen App',
        short_name: 'Rick',
        description: 'Hub familiar',
        theme_color: '#c35050',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'rick.png',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('vue-router')) {
              return 'vendor-core'
            }
            if (id.includes('pinia')) {
              return 'vendor-store'
            }
            if (id.includes('axios')) {
              return 'vendor-network'
            }
            return 'vendor-utils'
          }
        }
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 5173,
    },
    watch: {
      usePolling: process.env.WATCHPACK_POLLING === 'true',
      ignored: ['**/node_modules/**', '**/.git/**']
    }
  }
})