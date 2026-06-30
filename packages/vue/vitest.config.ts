import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'vue',
    include: ['src/**/*.test.ts'],
    environment: 'jsdom',
  },
})
