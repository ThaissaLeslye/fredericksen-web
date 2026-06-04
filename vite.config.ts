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
        short_name: 'Fredericksen',
        description: 'Plataforma segura de gerenciamento de saúde animal',
        theme_color: '#c35050',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'favicon.ico',
            sizes: '64x64 32x32 24x24 16x16',
            type: 'image/x-icon'
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