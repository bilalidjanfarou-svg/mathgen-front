import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// En dev, les appels /api sont redirigés vers Django (port 8000) : pas de CORS à configurer.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": { target: "http://localhost:8000", changeOrigin: true } },
  },
});
