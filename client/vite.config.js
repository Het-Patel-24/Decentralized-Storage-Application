// Converted from .ts to .js: TypeScript type annotations removed, file renamed

import { defineConfig } from "vite"; // kept same: ES Module syntax is fine
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(), // Conditional plugin inclusion remains unchanged
  ].filter(Boolean), // Filters out `false` if not in development
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
