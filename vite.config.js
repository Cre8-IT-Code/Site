// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: "./insights/rum.js",
      output: {
        entryFileNames: "insights.bundle.js",
        format: "iife", // Important: so everything is exposed on `window`
        name: "InsightsBundle",
      },
    },
  },
});
