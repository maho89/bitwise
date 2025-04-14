import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import Vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Vuetify(),
    vueDevTools(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://apiserv.bitwise.ge/Api/',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
