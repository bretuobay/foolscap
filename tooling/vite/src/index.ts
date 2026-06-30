import { defineConfig, type UserConfig } from 'vite'

export interface CssPackageConfigOptions {
  /** Entry TS file that imports root CSS. Default: 'src/index.ts' */
  entry?: string
  /** Output directory. Default: 'dist' */
  outDir?: string
  /** Output CSS filename. Default: 'style.css' */
  cssFileName?: string
}

/**
 * Vite config factory for packages/css/ only.
 * Processes CSS through PostCSS and outputs a single stylesheet.
 */
export function createCssPackageConfig(options: CssPackageConfigOptions = {}): UserConfig {
  const { entry = 'src/index.ts', outDir = 'dist', cssFileName = 'style.css' } = options

  return defineConfig({
    build: {
      lib: {
        entry,
        formats: ['es'],
        fileName: () => 'index',
      },
      outDir,
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) =>
            assetInfo.name?.endsWith('.css') ? cssFileName : '[name][extname]',
        },
      },
    },
  })
}
