import { createTsupConfig } from '@foolscap/tsup-config'

export default createTsupConfig({
  entry: ['src/index.ts'],
  external: [
    'react',
    'react-dom',
    '@web-loom/foolscap-core',
    '@web-loom/foolscap-css',
    '@web-loom/foolscap-tokens',
  ],
})
