import { defineConfig } from 'vite'
import viteConfig from './vite.config'

export default defineConfig({
  ...viteConfig,
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    deps: {
      inline: ['vitest-canvas-mock'],
    },
  },
})