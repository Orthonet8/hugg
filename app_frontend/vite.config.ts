import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const appUrl = env.VITE_APP_URL || "http://127.0.0.1:8000";

  return {
    base: "/app/",
    plugins: [react(), tailwindcss()],
    server: {
      host: true,
      proxy: {
        "/api": {
          target: appUrl,
          changeOrigin: true,
        },
        "/auth": {
          target: appUrl,
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: "../server/public/app",
      emptyOutDir: true,
    },
  };
});
