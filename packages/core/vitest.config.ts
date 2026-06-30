import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'core',
    include: ['src/**/*.test.ts'],
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      headless: true,
    },
  },
})
