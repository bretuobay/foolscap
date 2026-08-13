import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'vue',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
})
