import { createTsupConfig } from '@foolscap/tsup-config'

export default createTsupConfig({
  entry: ['src/index.ts'],
  external: ['@web-loom/store-core', '@floating-ui/dom'],
})
