import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'css',
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
