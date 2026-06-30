import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'react',
    include: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
    environment: 'jsdom',
  },
})
