import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    name: 'react',
    include: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
})
