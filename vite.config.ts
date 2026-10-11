import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
  base: "/Live-Football-World-Cup-scoreboard/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    globals: true,
    exclude: [
      "node_modules",
      "dist",
      "e2e/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
});
