import { join } from 'node:path'
import { randomUUID } from 'node:crypto'
import type { StorybookConfig } from '@analogjs/storybook-angular'

const isStorybookPreview = (id: string) =>
  (id.split('?')[0]?.replace(/\\/g, '/') ?? '').endsWith('/.storybook/preview.ts')

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-a11y'],
  framework: {
    name: '@analogjs/storybook-angular',
    options: {
      // Analog JIT transformers crash when Angular 19 (TS 5.8) is mixed with TS 5.9 emit:
      // "Node Bundle did not pass test 'isSourceFile'". AOT for stories; JIT for static builds.
      jit: process.env.NODE_ENV === 'production',
      liveReload: process.env.NODE_ENV !== 'production',
    },
  },
  // Analog 1.22.5 does not await @storybook/angular's async core preset, so
  // Storybook 8.6.18's required websocket token is dropped (analog#2080).
  core: {
    channelOptions: {
      wsToken: randomUUID(),
    },
  },
  docs: {
    autodocs: 'tag',
  },
  async viteFinal(viteConfig) {
    const { mergeConfig, transformWithEsbuild } = await import('vite')
    const { readFile } = await import('node:fs/promises')

    // Analog compiles every .ts file and throws on preview.ts (CSS import + CJS folder).
    // Skip that file so Vite can emit it as ESM.
    for (const plugin of viteConfig.plugins?.flat(Infinity) ?? []) {
      if (
        plugin &&
        typeof plugin === 'object' &&
        'name' in plugin &&
        plugin.name === '@analogjs/vite-plugin-angular' &&
        'transform' in plugin &&
        typeof plugin.transform === 'function'
      ) {
        const originalTransform = plugin.transform
        plugin.transform = function transform(
          this: unknown,
          code: string,
          id: string,
          options?: unknown
        ) {
          if (isStorybookPreview(id)) {
            return
          }
          return originalTransform.call(this, code, id, options)
        }
      }
    }

    return mergeConfig(viteConfig, {
      cacheDir: join(process.cwd(), 'node_modules/.vite-storybook-angular'),
      plugins: [
        {
          name: 'foolscap-angular-preview-esm',
          enforce: 'post',
          async transform(_code: string, id: string) {
            if (!isStorybookPreview(id)) {
              return
            }

            const filename = id.split('?')[0]?.replace(/\\/g, '/') ?? id
            const source = await readFile(filename, 'utf8')
            return transformWithEsbuild(source, id, {
              loader: 'ts',
              format: 'esm',
              target: 'es2020',
            })
          },
        },
      ],
    })
  },
}

export default config
