import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // VS Code extensions run in Node.js
    environment: 'node', 
    include: ['src/**/*.spec.ts'],
    // Mocking 'vscode' module is usually necessary 
    // unless you use @vscode/test-electron for integration tests
    deps: {
      interopDefault: true,
    },
  },
});