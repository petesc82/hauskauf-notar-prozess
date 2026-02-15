import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/hauskauf-notar-prozess/',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Quest León: Due Diligence',
        short_name: 'Quest León',
        description: 'Simulación de proceso de compra inmobiliaria',
        theme_color: '#1e293b',
        background_color: '#0f172a',
        display: 'standalone',
        start_url: '/hauskauf-notar-prozess/',
        scope: '/hauskauf-notar-prozess/',
        orientation: 'portrait',
        icons: [
          {
            src: 'https://picsum.photos/192/192',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'https://picsum.photos/512/512',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ]
});