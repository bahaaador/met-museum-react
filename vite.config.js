import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./src"),
      '@components': path.resolve(__dirname, "./src/components"),
      '@store': path.resolve(__dirname, "./src/Store"),
      '@utils': path.resolve(__dirname, "./src/utils"),
      '@api': path.resolve(__dirname, "./src/api"),
    },
  },
  publicDir: 'src/assets',
});