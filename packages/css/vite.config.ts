import { createCssPackageConfig } from '@foolscap/vite-config'

export default createCssPackageConfig({
  entry: 'src/index.ts',
  cssFileName: 'foolscap.css',
})
