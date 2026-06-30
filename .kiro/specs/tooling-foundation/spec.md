# Tooling Foundation

> Bootstrap the Foolscap monorepo from an empty git-initialized directory.
> **Phase:** 0.1 — Monorepo scaffold (no component source code)
> **Audience:** AI coding agents (Claude, Kiro, Codex)

---

## 1 — Overview and Scope

### What this spec covers

- Root pnpm workspace and Turborepo pipeline
- Five shared tooling packages (TypeScript config, ESLint, Prettier, tsup config, Vite config)
- Six publishable package stubs with correct `package.json`, tsconfig, build config, and empty `src/index.ts`
- Vitest workspace (unit + browser mode)
- Tokens CSS build pipeline (custom Node.js script)

### What is out of scope

- `apps/` directory (playground, docs) — separate spec
- Any component implementations or token values — Phase 0.2 onwards
- Publishing configuration, Changesets, CI pipelines

### Naming conventions (enforce throughout)

| Scope | Use | Published? |
|---|---|---|
| `@foolscap/` | Private tooling packages only | Never |
| `@web-loom/` | All publishable packages | Yes |
| CSS class prefix | `fc-` | — |
| CSS token prefix | `--fc-` | — |

---

## 2 — Prerequisites

```
Node.js >= 20.0.0
pnpm   >= 9.0.0
```

Both are enforced via `engines` in the root `package.json` and `.npmrc` `engine-strict=true`. The repo does not boot without these versions.

---

## 3 — Repository Layout

Produce this exact directory tree. Every file listed must exist after implementation.

```
foolscap/
├── .npmrc
├── .prettierrc.json
├── .prettierignore
├── .gitignore
├── eslint.config.js
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── vitest.workspace.ts
│
├── tooling/
│   ├── typescript/               ← @foolscap/tsconfig (private)
│   │   ├── package.json
│   │   └── base.json
│   ├── eslint/                   ← @foolscap/eslint-config (private)
│   │   ├── package.json
│   │   └── index.js
│   ├── prettier/                 ← @foolscap/prettier-config (private)
│   │   ├── package.json
│   │   └── prettier.json
│   ├── tsup/                     ← @foolscap/tsup-config (private)
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       └── index.ts
│   └── vite/                     ← @foolscap/vite-config (private)
│       ├── package.json
│       ├── tsconfig.json
│       └── src/
│           └── index.ts
│
└── packages/
    ├── tokens/                   ← @web-loom/foolscap-tokens
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tsup.config.ts
    │   ├── vitest.config.ts
    │   ├── scripts/
    │   │   └── build-css.mjs
    │   └── src/
    │       └── index.ts
    ├── css/                      ← @web-loom/foolscap-css
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── vite.config.ts
    │   ├── postcss.config.js
    │   ├── vitest.config.ts
    │   └── src/
    │       ├── index.ts
    │       └── index.css
    ├── core/                     ← @web-loom/foolscap-core
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tsup.config.ts
    │   ├── vitest.config.ts
    │   └── src/
    │       └── index.ts
    ├── react/                    ← @web-loom/foolscap-react
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tsup.config.ts
    │   ├── vitest.config.ts
    │   └── src/
    │       └── index.ts
    ├── vue/                      ← @web-loom/foolscap-vue
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── tsup.config.ts
    │   ├── vitest.config.ts
    │   └── src/
    │       └── index.ts
    └── angular/                  ← @web-loom/foolscap-angular
        ├── package.json
        ├── tsconfig.json
        ├── tsup.config.ts
        ├── vitest.config.ts
        └── src/
            └── index.ts
```

---

## 4 — Dependency Manifest

Use these exact semver ranges. Do not install unlisted packages.

### Root `devDependencies`

| Package | Version | Notes |
|---|---|---|
| `turbo` | `^2.3.0` | Turborepo 2.x — uses `tasks`, not `pipeline` |
| `typescript` | `^5.7.0` | Required for `moduleResolution: bundler` |
| `prettier` | `^3.4.0` | |
| `eslint` | `^9.18.0` | ESLint 9 flat config |
| `vitest` | `^2.2.0` | Workspace runner at root |
| `@foolscap/eslint-config` | `workspace:*` | |
| `@foolscap/prettier-config` | `workspace:*` | |
| `@foolscap/tsconfig` | `workspace:*` | |

### `tooling/eslint/` devDependencies

| Package | Version |
|---|---|
| `eslint` | `^9.18.0` |
| `typescript-eslint` | `^8.20.0` |
| `typescript` | `^5.7.0` |

### `tooling/tsup/` devDependencies

| Package | Version |
|---|---|
| `tsup` | `^8.3.0` |
| `typescript` | `^5.7.0` |
| `@foolscap/tsconfig` | `workspace:*` |

### `tooling/vite/` devDependencies

| Package | Version |
|---|---|
| `vite` | `^6.0.0` |
| `typescript` | `^5.7.0` |
| `@foolscap/tsconfig` | `workspace:*` |

### `packages/tokens/` devDependencies

| Package | Version |
|---|---|
| `tsup` | `^8.3.0` |
| `vitest` | `^2.2.0` |
| `typescript` | `^5.7.0` |
| `@foolscap/tsconfig` | `workspace:*` |
| `@foolscap/tsup-config` | `workspace:*` |

### `packages/css/` devDependencies

| Package | Version |
|---|---|
| `vite` | `^6.0.0` |
| `postcss` | `^8.4.0` |
| `postcss-nesting` | `^13.0.0` |
| `autoprefixer` | `^10.4.0` |
| `cssnano` | `^7.0.0` |
| `vitest` | `^2.2.0` |
| `typescript` | `^5.7.0` |
| `@foolscap/tsconfig` | `workspace:*` |
| `@foolscap/vite-config` | `workspace:*` |

### `packages/core/` dependencies

| Package | Version | Field |
|---|---|---|
| `@web-loom/store-core` | `^0.5.4` | `dependencies` |
| `@floating-ui/dom` | `^1.6.0` | `dependencies` |

### `packages/core/` devDependencies

| Package | Version |
|---|---|
| `tsup` | `^8.3.0` |
| `vitest` | `^2.2.0` |
| `@vitest/browser` | `^2.2.0` |
| `playwright` | `^1.45.0` |
| `typescript` | `^5.7.0` |
| `@foolscap/tsconfig` | `workspace:*` |
| `@foolscap/tsup-config` | `workspace:*` |

### `packages/react/` peerDependencies + devDependencies

| Package | Version | Field |
|---|---|---|
| `react` | `>=18` | `peerDependencies` |
| `react-dom` | `>=18` | `peerDependencies` |
| `@web-loom/foolscap-core` | `workspace:*` | `dependencies` |
| `@web-loom/foolscap-css` | `workspace:*` | `dependencies` |
| `@web-loom/foolscap-tokens` | `workspace:*` | `dependencies` |
| `react` | `^18.3.0` | `devDependencies` |
| `react-dom` | `^18.3.0` | `devDependencies` |
| `@types/react` | `^18.3.0` | `devDependencies` |
| `@types/react-dom` | `^18.3.0` | `devDependencies` |
| `@testing-library/react` | `^16.0.0` | `devDependencies` |
| `@vitejs/plugin-react` | `^4.3.0` | `devDependencies` |
| `jsdom` | `^25.0.0` | `devDependencies` |
| `tsup` | `^8.3.0` | `devDependencies` |
| `vitest` | `^2.2.0` | `devDependencies` |
| `typescript` | `^5.7.0` | `devDependencies` |
| `@foolscap/tsconfig` | `workspace:*` | `devDependencies` |
| `@foolscap/tsup-config` | `workspace:*` | `devDependencies` |

### `packages/vue/` peerDependencies + devDependencies

| Package | Version | Field |
|---|---|---|
| `vue` | `>=3.4` | `peerDependencies` |
| `@web-loom/foolscap-core` | `workspace:*` | `dependencies` |
| `vue` | `^3.5.0` | `devDependencies` |
| `jsdom` | `^25.0.0` | `devDependencies` |
| `tsup` | `^8.3.0` | `devDependencies` |
| `vitest` | `^2.2.0` | `devDependencies` |
| `typescript` | `^5.7.0` | `devDependencies` |
| `@foolscap/tsconfig` | `workspace:*` | `devDependencies` |
| `@foolscap/tsup-config` | `workspace:*` | `devDependencies` |

### `packages/angular/` peerDependencies + devDependencies

| Package | Version | Field |
|---|---|---|
| `@angular/core` | `>=17` | `peerDependencies` |
| `@angular/common` | `>=17` | `peerDependencies` |
| `@web-loom/foolscap-core` | `workspace:*` | `dependencies` |
| `@angular/core` | `^18.0.0` | `devDependencies` |
| `@angular/common` | `^18.0.0` | `devDependencies` |
| `zone.js` | `^0.14.0` | `devDependencies` |
| `jsdom` | `^25.0.0` | `devDependencies` |
| `tsup` | `^8.3.0` | `devDependencies` |
| `vitest` | `^2.2.0` | `devDependencies` |
| `typescript` | `^5.7.0` | `devDependencies` |
| `@foolscap/tsconfig` | `workspace:*` | `devDependencies` |
| `@foolscap/tsup-config` | `workspace:*` | `devDependencies` |

---

## 5 — Root Configuration Files

### `pnpm-workspace.yaml`

```yaml
packages:
  - 'packages/*'
  - 'tooling/*'
```

No `apps/*` — this spec does not scaffold apps.

### `package.json`

```json
{
  "name": "foolscap",
  "private": true,
  "version": "0.0.0",
  "packageManager": "pnpm@9.15.0",
  "engines": {
    "node": ">=20.0.0",
    "pnpm": ">=9.0.0"
  },
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "test": "turbo test",
    "lint": "turbo lint",
    "typecheck": "turbo typecheck",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "devDependencies": {
    "@foolscap/eslint-config": "workspace:*",
    "@foolscap/prettier-config": "workspace:*",
    "@foolscap/tsconfig": "workspace:*",
    "eslint": "^9.18.0",
    "prettier": "^3.4.0",
    "turbo": "^2.3.0",
    "typescript": "^5.7.0",
    "vitest": "^2.2.0"
  },
  "prettier": "@foolscap/prettier-config"
}
```

### `turbo.json`

> **Critical:** Turborepo 2.x uses `"tasks"`, not `"pipeline"`. Using `"pipeline"` is a v1 syntax error in v2.

```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "lint": {
      "outputs": []
    },
    "typecheck": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

**Why each `dependsOn`:**
- `build: ["^build"]` — wait for all workspace dependency builds to finish before building this package. The caret (`^`) means "all deps of this package."
- `test: ["^build"]` — tests that import from workspace packages need those packages' `dist/` to exist.
- `typecheck: ["^build"]` — TypeScript needs `.d.ts` files in `dist/` of upstream packages to resolve types.
- `dev` — no `dependsOn`; watchers start in parallel.
- `lint` — no `dependsOn`; ESLint works on source files only.

### `.npmrc`

```ini
engine-strict=true
shamefully-hoist=false
```

### `.gitignore`

```
node_modules/
dist/
.turbo/
coverage/
*.local
.DS_Store
```

### `.prettierrc.json`

```json
"@foolscap/prettier-config"
```

Prettier resolves this string to the exported `prettier.json` from `@foolscap/prettier-config`.

### `.prettierignore`

```
dist/
node_modules/
pnpm-lock.yaml
*.d.ts
```

### Root `eslint.config.js`

```js
import base from '@foolscap/eslint-config'
import tseslint from 'typescript-eslint'

export default tseslint.config(...base, {
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

### `vitest.workspace.ts`

```ts
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  './packages/tokens/vitest.config.ts',
  './packages/css/vitest.config.ts',
  './packages/core/vitest.config.ts',
  './packages/react/vitest.config.ts',
  './packages/vue/vitest.config.ts',
  './packages/angular/vitest.config.ts',
])
```

---

## 6 — Tooling Packages

### 6.1 `tooling/typescript/` — `@foolscap/tsconfig`

**`package.json`:**
```json
{
  "name": "@foolscap/tsconfig",
  "version": "0.0.0",
  "private": true,
  "license": "MIT",
  "files": ["base.json"]
}
```

No scripts, no dependencies, no `exports`. TypeScript resolves `extends` fields by file path, not package exports.

**`base.json`:**
```json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "verbatimModuleSyntax": true,
    "isolatedModules": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "allowSyntheticDefaultImports": true
  }
}
```

**Why these options:**

| Option | Reason |
|---|---|
| `moduleResolution: "bundler"` | Matches what esbuild (tsup) and Vite actually do: allows bare specifiers, `.ts` extensions in imports, index-less imports |
| `verbatimModuleSyntax: true` | Forces `import type` for type-only imports. Required when `isolatedModules: true` so esbuild can strip types safely without full program analysis |
| `isolatedModules: true` | Each file must be independently compilable. Required for esbuild, which processes files one at a time |
| `skipLibCheck: true` | Avoids spurious errors from conflicting types in `node_modules` |

**`noEmit` is intentionally absent. See Section 6.1.1.**

#### 6.1.1 — The `noEmit` vs `dts: true` rule

> **This is a common agent mistake. Read carefully.**

`tsc --declaration` and `tsc --noEmit` are mutually exclusive. TypeScript raises **TS5053** if both are present. tsup's `dts: true` internally invokes `tsc --declaration --emitDeclarationOnly`. If the tsconfig it reads has `"noEmit": true`, the dts step fails.

**Rule: never add `"noEmit": true` to any `tsconfig.json` in this repository.**

The `typecheck` script in every package uses the CLI flag `tsc --noEmit`, which overrides at invocation time without affecting tsup's dts pass:

```json
"typecheck": "tsc --noEmit"
```

---

### 6.2 `tooling/eslint/` — `@foolscap/eslint-config`

**`package.json`:**
```json
{
  "name": "@foolscap/eslint-config",
  "version": "0.0.0",
  "private": true,
  "license": "MIT",
  "type": "module",
  "exports": {
    ".": "./index.js"
  },
  "devDependencies": {
    "eslint": "^9.18.0",
    "typescript-eslint": "^8.20.0"
  },
  "peerDependencies": {
    "eslint": "^9.0.0",
    "typescript-eslint": "^8.0.0"
  }
}
```

**`index.js`:**
```js
import tseslint from 'typescript-eslint'

export const base = tseslint.config(
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.d.ts'],
  },
  ...tseslint.configs.strict,
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  }
)

export default base
```

Uses `tseslint.configs.strict` (not `strictTypeChecked`) — no `parserOptions.project` needed in the shared base. Type-checked rules are added per-package when type information is available.

**Per-package `eslint.config.js`** (place this file at each package root):
```js
import base from '@foolscap/eslint-config'
import tseslint from 'typescript-eslint'

export default tseslint.config(...base, {
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

---

### 6.3 `tooling/prettier/` — `@foolscap/prettier-config`

**`package.json`:**
```json
{
  "name": "@foolscap/prettier-config",
  "version": "0.0.0",
  "private": true,
  "license": "MIT",
  "exports": {
    ".": "./prettier.json"
  },
  "peerDependencies": {
    "prettier": "^3.0.0"
  }
}
```

**`prettier.json`:**
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

---

### 6.4 `tooling/tsup/` — `@foolscap/tsup-config`

**`package.json`:**
```json
{
  "name": "@foolscap/tsup-config",
  "version": "0.0.0",
  "private": true,
  "license": "MIT",
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts"
    }
  },
  "devDependencies": {
    "@foolscap/tsconfig": "workspace:*",
    "tsup": "^8.3.0",
    "typescript": "^5.7.0"
  },
  "peerDependencies": {
    "tsup": "^8.0.0"
  }
}
```

The export points to `./src/index.ts` directly — no build step needed. Consuming packages resolve this via `moduleResolution: bundler`.

**`tsconfig.json`:**
```json
{
  "extends": "@foolscap/tsconfig/base.json",
  "compilerOptions": {
    "rootDir": "src"
  },
  "include": ["src"]
}
```

**`src/index.ts`:**
```ts
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
```

**Why these tsup defaults:**

| Option | Reason |
|---|---|
| `format: ['esm', 'cjs']` | Modern bundlers consume ESM via `exports["import"]`; legacy tooling and Node scripts consume CJS via `exports["require"]` |
| `dts: true` | Generates `.d.ts` declarations via a separate tsc pass (`--declaration --emitDeclarationOnly`) |
| `clean: true` | Deletes `dist/` before each build; prevents stale artifacts |
| `sourcemap: true` | Source maps for debugging in consuming applications |
| `splitting: false` | Single entry points don't need splitting; enabling it creates unnecessary chunk files |
| `treeshake: true` | Removes unused exports at build time |

---

### 6.5 `tooling/vite/` — `@foolscap/vite-config`

**`package.json`:**
```json
{
  "name": "@foolscap/vite-config",
  "version": "0.0.0",
  "private": true,
  "license": "MIT",
  "type": "module",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "types": "./src/index.ts"
    }
  },
  "devDependencies": {
    "@foolscap/tsconfig": "workspace:*",
    "vite": "^6.0.0",
    "typescript": "^5.7.0"
  },
  "peerDependencies": {
    "vite": "^6.0.0"
  }
}
```

**`tsconfig.json`:**
```json
{
  "extends": "@foolscap/tsconfig/base.json",
  "compilerOptions": {
    "rootDir": "src"
  },
  "include": ["src"]
}
```

**`src/index.ts`:**
```ts
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
 * Processes CSS through PostCSS (configured via postcss.config.js in the consuming package)
 * and outputs a single stylesheet. Not intended for TypeScript library packages.
 */
export function createCssPackageConfig(
  options: CssPackageConfigOptions = {}
): UserConfig {
  const {
    entry = 'src/index.ts',
    outDir = 'dist',
    cssFileName = 'style.css',
  } = options

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
```

---

## 7 — Package Stubs

### Common patterns

**`package.json` scripts** (all TS packages):
```json
{
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  }
}
```

**`package.json` exports map** (all TS packages except tokens and css):
```json
{
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "src"]
}
```

With `"type": "module"`, tsup outputs `dist/index.js` (ESM) and `dist/index.cjs` (CJS).

**`tsconfig.json`** (standard pattern):
```json
{
  "extends": "@foolscap/tsconfig/base.json",
  "include": ["src", "tsup.config.ts", "vitest.config.ts"]
}
```

> **Do not set `rootDir`** in package tsconfigs. `tsup.config.ts` and `vitest.config.ts` live at the package root, not inside `src/`. Setting `rootDir: "src"` causes TS error TS6059 ("not under rootDir") for those files. Since tsup owns compilation output and tsc only runs `--noEmit`, `rootDir` is unnecessary — TypeScript infers the common root automatically.

**`tsup.config.ts`** (standard pattern):
```ts
import { createTsupConfig } from '@foolscap/tsup-config'
export default createTsupConfig({ entry: ['src/index.ts'] })
```

**`src/index.ts`** stub (standard pattern):
```ts
export {}
```

---

### 7.1 `packages/tokens/` — `@web-loom/foolscap-tokens`

Two build steps: `tsup` produces the JS/TS output; `node scripts/build-css.mjs` produces `dist/tokens.css`.

**`package.json`:**
```json
{
  "name": "@web-loom/foolscap-tokens",
  "version": "0.0.0",
  "license": "MIT",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    },
    "./css": "./dist/tokens.css"
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsup && node scripts/build-css.mjs",
    "dev": "tsup --watch",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:setup": "echo 'No setup required'"
  },
  "devDependencies": {
    "@foolscap/tsconfig": "workspace:*",
    "@foolscap/tsup-config": "workspace:*",
    "tsup": "^8.3.0",
    "vitest": "^2.2.0",
    "typescript": "^5.7.0"
  }
}
```

**`tsup.config.ts`:**
```ts
import { createTsupConfig } from '@foolscap/tsup-config'
export default createTsupConfig({ entry: ['src/index.ts'] })
```

**`vitest.config.ts`:**
```ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    name: 'tokens',
    include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs'],
    environment: 'node',
  },
})
```

**`src/index.ts`** stub (token name exports — populated in Phase 0.2):
```ts
// Token name exports: maps semantic names to their CSS custom property strings.
// Allows TypeScript consumers to reference tokens without magic strings.
// Phase 0.2 populates this file with all token exports.
export {}
```

---

### 7.2 `packages/css/` — `@web-loom/foolscap-css`

CSS-only package. No TypeScript exports. Vite handles the PostCSS pipeline.

**`package.json`:**
```json
{
  "name": "@web-loom/foolscap-css",
  "version": "0.0.0",
  "license": "MIT",
  "type": "module",
  "exports": {
    ".": "./dist/foolscap.css",
    "./foolscap.css": "./dist/foolscap.css"
  },
  "style": "./dist/foolscap.css",
  "files": ["dist"],
  "scripts": {
    "build": "vite build",
    "dev": "vite build --watch",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "devDependencies": {
    "@foolscap/tsconfig": "workspace:*",
    "@foolscap/vite-config": "workspace:*",
    "autoprefixer": "^10.4.0",
    "cssnano": "^7.0.0",
    "postcss": "^8.4.0",
    "postcss-nesting": "^13.0.0",
    "vite": "^6.0.0",
    "vitest": "^2.2.0",
    "typescript": "^5.7.0"
  }
}
```

**`vite.config.ts`:**
```ts
import { createCssPackageConfig } from '@foolscap/vite-config'
export default createCssPackageConfig({
  entry: 'src/index.ts',
  cssFileName: 'foolscap.css',
})
```

**`postcss.config.js`:**
```js
import postcssNesting from 'postcss-nesting'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

export default {
  plugins: [
    postcssNesting(),
    autoprefixer(),
    ...(process.env.NODE_ENV === 'production' ? [cssnano()] : []),
  ],
}
```

**`tsconfig.json`:**
```json
{
  "extends": "@foolscap/tsconfig/base.json",
  "compilerOptions": {
    "rootDir": "."
  },
  "include": ["src/index.ts", "vite.config.ts", "postcss.config.js"]
}
```

**`vitest.config.ts`:**
```ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    name: 'css',
    include: ['src/**/*.test.ts'],
    environment: 'node',
  },
})
```

**`src/index.ts`:**
```ts
import './index.css'
```

**`src/index.css`:**
```css
/* Foolscap CSS entry point */
/* Phase 1 imports all CSS layers here */
```

---

### 7.3 `packages/core/` — `@web-loom/foolscap-core`

Uses real browser tests (Playwright/Chromium). jsdom cannot implement `<dialog>.showModal()`, the Popover API, or reliable `document.activeElement` across shadow boundaries.

**`package.json`:**
```json
{
  "name": "@web-loom/foolscap-core",
  "version": "0.0.0",
  "license": "MIT",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:setup": "playwright install chromium"
  },
  "dependencies": {
    "@web-loom/store-core": "^0.5.4",
    "@floating-ui/dom": "^1.6.0"
  },
  "devDependencies": {
    "@foolscap/tsconfig": "workspace:*",
    "@foolscap/tsup-config": "workspace:*",
    "@vitest/browser": "^2.2.0",
    "playwright": "^1.45.0",
    "tsup": "^8.3.0",
    "vitest": "^2.2.0",
    "typescript": "^5.7.0"
  }
}
```

**`tsup.config.ts`:**
```ts
import { createTsupConfig } from '@foolscap/tsup-config'
export default createTsupConfig({
  entry: ['src/index.ts'],
  external: ['@web-loom/store-core', '@floating-ui/dom'],
})
```

**`vitest.config.ts`:**
```ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    name: 'core',
    include: ['src/**/*.test.ts'],
    browser: {
      enabled: true,
      name: 'chromium',
      provider: 'playwright',
      headless: true,
    },
  },
})
```

---

### 7.4 `packages/react/` — `@web-loom/foolscap-react`

**`package.json`:**
```json
{
  "name": "@web-loom/foolscap-react",
  "version": "0.0.0",
  "license": "MIT",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18"
  },
  "dependencies": {
    "@web-loom/foolscap-core": "workspace:*",
    "@web-loom/foolscap-css": "workspace:*",
    "@web-loom/foolscap-tokens": "workspace:*"
  },
  "devDependencies": {
    "@foolscap/tsconfig": "workspace:*",
    "@foolscap/tsup-config": "workspace:*",
    "@testing-library/react": "^16.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.0",
    "jsdom": "^25.0.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "tsup": "^8.3.0",
    "vitest": "^2.2.0",
    "typescript": "^5.7.0"
  }
}
```

**`tsconfig.json`** (adds `jsx` option):
```json
{
  "extends": "@foolscap/tsconfig/base.json",
  "compilerOptions": {
    "rootDir": "src",
    "jsx": "react-jsx"
  },
  "include": ["src", "tsup.config.ts"]
}
```

**`tsup.config.ts`:**
```ts
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
```

**`vitest.config.ts`:**
```ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    name: 'react',
    include: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
    environment: 'jsdom',
  },
})
```

---

### 7.5 `packages/vue/` — `@web-loom/foolscap-vue`

**`package.json`:**
```json
{
  "name": "@web-loom/foolscap-vue",
  "version": "0.0.0",
  "license": "MIT",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "peerDependencies": {
    "vue": ">=3.4"
  },
  "dependencies": {
    "@web-loom/foolscap-core": "workspace:*"
  },
  "devDependencies": {
    "@foolscap/tsconfig": "workspace:*",
    "@foolscap/tsup-config": "workspace:*",
    "jsdom": "^25.0.0",
    "vue": "^3.5.0",
    "tsup": "^8.3.0",
    "vitest": "^2.2.0",
    "typescript": "^5.7.0"
  }
}
```

**`tsconfig.json`:**
```json
{
  "extends": "@foolscap/tsconfig/base.json",
  "compilerOptions": {
    "rootDir": "src",
    "jsx": "preserve"
  },
  "include": ["src", "tsup.config.ts"]
}
```

**`tsup.config.ts`:**
```ts
import { createTsupConfig } from '@foolscap/tsup-config'
export default createTsupConfig({
  entry: ['src/index.ts'],
  external: ['vue', '@web-loom/foolscap-core'],
})
```

**`vitest.config.ts`:**
```ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    name: 'vue',
    include: ['src/**/*.test.ts'],
    environment: 'jsdom',
  },
})
```

> **Phase 4 note:** When Vue SFCs (`.vue` files) are added, tsup must be extended with `esbuild-plugin-vue3`, or `packages/vue/` must be switched to Vite library mode (same pattern as `packages/css/`). This decision is deferred to Phase 4.

---

### 7.6 `packages/angular/` — `@web-loom/foolscap-angular`

**`package.json`:**
```json
{
  "name": "@web-loom/foolscap-angular",
  "version": "0.0.0",
  "license": "MIT",
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "types": "./dist/index.d.ts"
    }
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": ["dist", "src"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "peerDependencies": {
    "@angular/core": ">=17",
    "@angular/common": ">=17"
  },
  "dependencies": {
    "@web-loom/foolscap-core": "workspace:*"
  },
  "devDependencies": {
    "@foolscap/tsconfig": "workspace:*",
    "@foolscap/tsup-config": "workspace:*",
    "@angular/common": "^18.0.0",
    "@angular/core": "^18.0.0",
    "jsdom": "^25.0.0",
    "zone.js": "^0.14.0",
    "tsup": "^8.3.0",
    "vitest": "^2.2.0",
    "typescript": "^5.7.0"
  }
}
```

**`tsconfig.json`:**
```json
{
  "extends": "@foolscap/tsconfig/base.json",
  "compilerOptions": {
    "rootDir": "src",
    "useDefineForClassFields": false,
    "experimentalDecorators": false
  },
  "include": ["src", "tsup.config.ts"]
}
```

`useDefineForClassFields: false` — required for Angular's class field initialization semantics.
`experimentalDecorators: false` — Angular 17+ uses the TC39 stage 3 decorator spec, which esbuild supports natively.

**`tsup.config.ts`:**
```ts
import { createTsupConfig } from '@foolscap/tsup-config'
export default createTsupConfig({
  entry: ['src/index.ts'],
  external: ['@angular/core', '@angular/common', '@web-loom/foolscap-core'],
})
```

**`vitest.config.ts`:**
```ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    name: 'angular',
    include: ['src/**/*.test.ts'],
    environment: 'jsdom',
  },
})
```

> **Phase 4 note:** Angular's Ivy compiler (`ngtsc`) is not invoked at stub stage — tsup compiles plain TypeScript only. Full Angular component compilation (decorators, component factories) is addressed in Phase 4. Options to evaluate then: `ng-packagr`, or staying with tsup if all code avoids Ivy-compiled decorators.

---

## 8 — Tokens CSS Build Script

**Location:** `packages/tokens/scripts/build-css.mjs`

**Why a custom script and not Style Dictionary v4:** Foolscap's token values are flat CSS strings (hex colors, rem values, ms durations). There are no cross-token references (e.g., `{color.ink}`). Style Dictionary's overhead — file format config, transform pipelines, platform definitions — is not justified. If token files gain cross-references in a future phase, migrate to Style Dictionary v4 at that point.

**`packages/tokens/scripts/build-css.mjs`:**
```js
#!/usr/bin/env node
/**
 * Build script: converts W3C Design Token JSON files → CSS custom properties.
 * Output: packages/tokens/dist/tokens.css
 *
 * Token format: { "token-name": { "$value": "...", "$type": "color|dimension|..." } }
 * Output format: :root { --fc-token-name: value; }
 *
 * Zero external dependencies. Requires Node >= 20.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(__dirname, '..')
const SRC_DIR = resolve(PKG_ROOT, 'src')
const OUT_DIR = resolve(PKG_ROOT, 'dist')
const OUT_FILE = resolve(OUT_DIR, 'tokens.css')

/** Token files to process, in order. Order determines CSS variable declaration order. */
const TOKEN_FILES = [
  'palette.tokens.json',
  'spacing.tokens.json',
  'typography.tokens.json',
  'motion.tokens.json',
  'radius.tokens.json',
  'shadow.tokens.json',
]

function processTokenFile(filePath) {
  const raw = readFileSync(filePath, 'utf8')
  const tokens = JSON.parse(raw)
  const lines = []

  for (const [name, token] of Object.entries(tokens)) {
    if (typeof token !== 'object' || !('$value' in token)) {
      console.warn(`Skipping invalid token entry: ${name}`)
      continue
    }
    lines.push(`  --fc-${name}: ${token.$value};`)
  }

  return lines
}

function build() {
  mkdirSync(OUT_DIR, { recursive: true })

  const allLines = []
  for (const fileName of TOKEN_FILES) {
    const filePath = resolve(SRC_DIR, fileName)
    try {
      const lines = processTokenFile(filePath)
      allLines.push(`  /* ${fileName} */`, ...lines, '')
    } catch (err) {
      if (err.code === 'ENOENT') {
        // Token file doesn't exist yet — skipped silently during Phase 0 scaffolding.
        // Phase 0.2 adds the actual token files.
        continue
      }
      throw err
    }
  }

  const css = [
    '/* Auto-generated — do not edit. Run: node scripts/build-css.mjs */',
    ':root {',
    ...allLines,
    '}',
    '',
  ].join('\n')

  writeFileSync(OUT_FILE, css, 'utf8')
  console.log(`Tokens CSS written to: ${OUT_FILE}`)
}

build()
```

---

## 9 — Bootstrap Sequence

Execute in this order. Each step depends on the previous.

1. **Verify prerequisites:** `node --version` (>= 20), `pnpm --version` (>= 9)
2. **Create directory tree** from Section 3
3. **Write files in dependency order:**
   a. Root files: `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.npmrc`, `.gitignore`, `.prettierrc.json`, `.prettierignore`, root `eslint.config.js`, `vitest.workspace.ts`
   b. Tooling packages (no inter-dependencies): all files in `tooling/typescript/`, `tooling/eslint/`, `tooling/prettier/`, `tooling/tsup/`, `tooling/vite/`
   c. Package stubs: all files in `packages/tokens/`, `packages/css/`, `packages/core/`, `packages/react/`, `packages/vue/`, `packages/angular/`
   d. Per-package `eslint.config.js` files
4. **Install dependencies:** `pnpm install`
5. **Install Playwright:** `pnpm exec playwright install chromium` (required for `packages/core/` browser tests)
6. **Run acceptance criteria** (Section 10)

---

## 10 — Acceptance Criteria

Run these checks after bootstrap. All must pass before Phase 0.2 begins.

```
SETUP
[ ] pnpm install exits 0 with no errors
[ ] No dependency resolution conflicts in pnpm output
[ ] pnpm why @web-loom/store-core shows zero transitive dependencies

FORMAT
[ ] pnpm format:check exits 0 (all generated files are correctly formatted)

LINT
[ ] pnpm lint (turbo lint) exits 0 across all packages

TYPECHECK
[ ] pnpm typecheck (turbo typecheck) exits 0 across all packages
[ ] No TS5053 error ("noEmit cannot be specified with declaration") in typecheck output
[ ] Running tsc --noEmit from each packages/* directory individually exits 0

BUILD
[ ] pnpm build (turbo build) exits 0
[ ] packages/tokens/dist/index.js  — exists, valid ESM
[ ] packages/tokens/dist/index.cjs — exists, valid CJS
[ ] packages/tokens/dist/index.d.ts — exists
[ ] packages/tokens/dist/tokens.css — exists, contains ":root {" (empty block is acceptable at stub stage)
[ ] packages/css/dist/foolscap.css — exists
[ ] packages/core/dist/index.js    — exists
[ ] packages/core/dist/index.cjs   — exists
[ ] packages/core/dist/index.d.ts  — exists
[ ] packages/react/dist/index.js   — exists
[ ] packages/vue/dist/index.js     — exists
[ ] packages/angular/dist/index.js — exists
[ ] All TS packages have corresponding .cjs and .d.ts files
[ ] Running pnpm build a second time shows all packages cached (FULL TURBO output)

TEST
[ ] pnpm test (turbo test) exits 0 (0 test files, 0 failures — stubs have no tests yet)
[ ] packages/core test output references "chromium" (confirms browser mode is active)

STRUCTURAL INVARIANTS
[ ] No packages/* package.json has "noEmit": true in any tsconfig.json
[ ] turbo.json uses "tasks" key (not "pipeline")
[ ] Every TS package exports map has both "import" and "require" conditions
[ ] packages/css exports map has no "import"/"require" — CSS file only
[ ] No tooling/ package has a "dependencies" field (only devDependencies)
[ ] No packages/* runtime dependency imports from tooling/ packages
```
