import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: './',
  test: {
    globals: true,
    setupFiles: 'src/setupTests.js',
},
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./src"),
      '@components': path.resolve(__dirname, "./src/components"),
      '@utils': path.resolve(__dirname, "./src/utils"),
      '@api': path.resolve(__dirname, "./src/api"),
      '@hooks': path.resolve(__dirname, "./src/hooks"),
      '@store': path.resolve(__dirname, "./src/store"),
    },
  },
  publicDir: 'src/assets',
});