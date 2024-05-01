// Import the `path` module from the "path" package
import path from "path";

// Import the `react` plugin from the "@vitejs/plugin-react" package
import react from "@vitejs/plugin-react";

// Import the `defineConfig` function from the "vite" package
import { defineConfig } from "vite";

// Export the default configuration for your Vite project
export default defineConfig({
  // Define the plugins to be used in your Vite project
  plugins: [react()],

  // Configure the `resolve` option. This option tells Vite how to resolve module imports.
  resolve: {
    // Define aliases for commonly used paths. Here, we are creating an alias named "@" that resolves to the "src" directory.
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
