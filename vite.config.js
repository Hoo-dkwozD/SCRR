import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // relative paths so it works under https://<user>.github.io/<repo>/
  plugins: [react()],
  build: {
    // Keep CSS readable by older phones (e.g. 1st-gen iPhone SE, capped at iOS 15),
    // so `max-height` media queries aren't rewritten to range syntax (Safari 16.4+).
    cssTarget: ['safari15', 'chrome100'],
  },
})
