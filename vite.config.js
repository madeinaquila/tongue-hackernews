import { defineConfig } from 'vite';

export default defineConfig({
  // Root is the project folder
  root: '.',

  // Build output
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },

  // Vitest configuration
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    coverage: {
      reporter: ['text', 'html'],
      include: ['src/js/**/*.js'],
    },
  },
});
