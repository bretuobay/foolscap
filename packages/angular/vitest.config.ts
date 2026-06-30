import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'angular',
    include: ['src/**/*.test.ts'],
    environment: 'jsdom',
  },
})
