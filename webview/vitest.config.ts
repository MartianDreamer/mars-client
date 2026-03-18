import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.js";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      // Use jsdom to support Svelte component testing
      environment: "jsdom",
      // Useful if you want to use global 'describe', 'it', 'expect'
      globals: true,
      // Path to your test files
      include: ["src/**/*.{test,spec}.{js,ts}"],
    },
  }),
);
