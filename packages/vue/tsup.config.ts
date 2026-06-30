import { createTsupConfig } from '@foolscap/tsup-config'

export default createTsupConfig({
  entry: ['src/index.ts'],
  external: ['vue', '@web-loom/foolscap-core'],
})
