import type { Options } from 'tsup'

export interface TsupConfigOptions {
  /** Entry point(s). */
  entry: string | string[]
  /** Packages to mark as external (not bundled into output). */
  external?: string[]
  /**
   * Enable code splitting for ESM output.
   * Only useful for packages with multiple entry points sharing code.
   * Default: false
   */
  splitting?: boolean
}

/**
 * Shared tsup config factory for all Foolscap TypeScript packages.
 * Outputs dual ESM (.js) and CJS (.cjs) with TypeScript declarations.
 */
export function createTsupConfig(options: TsupConfigOptions): Options {
  return {
    entry: Array.isArray(options.entry) ? options.entry : [options.entry],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    sourcemap: true,
    splitting: options.splitting ?? false,
    treeshake: true,
    external: options.external ?? [],
    outDir: 'dist',
  }
}
