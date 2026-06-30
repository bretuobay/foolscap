import { createTsupConfig } from '@foolscap/tsup-config'

export default createTsupConfig({
  entry: ['src/index.ts'],
  external: ['@angular/core', '@angular/common', '@web-loom/foolscap-core'],
})
