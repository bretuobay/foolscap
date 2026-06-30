import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  './packages/tokens/vitest.config.ts',
  './packages/css/vitest.config.ts',
  './packages/core/vitest.config.ts',
  './packages/react/vitest.config.ts',
  './packages/vue/vitest.config.ts',
  './packages/angular/vitest.config.ts',
])
