import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 8080,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    },
    host: true, // Optional: allows Vite to listen on all interfaces
    allowedHosts: [
      '62514830-aa12-464b-9a7e-8081a1929aa4.lovableproject.com'
    ]
  },
  optimizeDeps: {
    force: true,
    disabled: false
  }
});