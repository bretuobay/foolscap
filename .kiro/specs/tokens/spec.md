# Tokens

> Populate `@web-loom/foolscap-tokens` with the Foolscap visual language.
> **Phase:** 0.2 — Design tokens
> **Depends on:** `tooling-foundation` spec (package already scaffolded)
> **Blocks:** All CSS work (Phase 1+)

---

## 1 — Overview

This spec populates `packages/tokens/src/` with six W3C Design Token JSON files and updates `src/index.ts` with typed TypeScript token name exports. Running `pnpm build` in the package then produces:

- `dist/tokens.css` — all tokens as `--fc-*` CSS custom properties on `:root`
- `dist/index.js` + `dist/index.cjs` + `dist/index.d.ts` — typed token name exports

**The tokens package is the single source of visual truth.** Every colour, size, space, and motion value in the system references a `--fc-*` variable. No component CSS ever hard-codes a value that belongs here.

---

## 2 — Token Files

Create all six files under `packages/tokens/src/`. The build script (`scripts/build-css.mjs`) reads them in the order listed below — that order determines CSS variable declaration order in `dist/tokens.css`.

---

### 2.1 `palette.tokens.json`

The paper aesthetic: warm off-white surfaces, near-black ink, one grey ramp. No accent hue.

```json
{
  "paper":        { "$value": "#FBFBF9", "$type": "color" },
  "paper-raised": { "$value": "#FFFFFF", "$type": "color" },
  "ink":          { "$value": "#1A1A1A", "$type": "color" },
  "ink-muted":    { "$value": "#5C5C5C", "$type": "color" },
  "grey-100":     { "$value": "#F5F5F5", "$type": "color" },
  "grey-200":     { "$value": "#E5E5E5", "$type": "color" },
  "grey-300":     { "$value": "#D4D4D4", "$type": "color" },
  "grey-400":     { "$value": "#A3A3A3", "$type": "color" },
  "grey-500":     { "$value": "#737373", "$type": "color" },
  "grey-600":     { "$value": "#525252", "$type": "color" },
  "grey-700":     { "$value": "#404040", "$type": "color" },
  "grey-800":     { "$value": "#262626", "$type": "color" },
  "grey-900":     { "$value": "#171717", "$type": "color" }
}
```

**Semantic roles:**

| Token | Role |
|---|---|
| `--fc-paper` | Page / surface background |
| `--fc-paper-raised` | Cards, overlays — one step above the page |
| `--fc-ink` | Primary text, borders, icons |
| `--fc-ink-muted` | Secondary text, placeholders |
| `--fc-grey-100` – `--fc-grey-300` | Borders, dividers, disabled states |
| `--fc-grey-400` – `--fc-grey-600` | Loading / skeleton states |
| `--fc-grey-700` – `--fc-grey-900` | High-contrast text on light backgrounds |

---

### 2.2 `spacing.tokens.json`

4 px base grid, T-shirt scale. Values are `rem` (relative to browser default 16 px root).

```json
{
  "space-1":  { "$value": "0.25rem", "$type": "dimension" },
  "space-2":  { "$value": "0.5rem",  "$type": "dimension" },
  "space-3":  { "$value": "0.75rem", "$type": "dimension" },
  "space-4":  { "$value": "1rem",    "$type": "dimension" },
  "space-5":  { "$value": "1.25rem", "$type": "dimension" },
  "space-6":  { "$value": "1.5rem",  "$type": "dimension" },
  "space-8":  { "$value": "2rem",    "$type": "dimension" },
  "space-10": { "$value": "2.5rem",  "$type": "dimension" },
  "space-12": { "$value": "3rem",    "$type": "dimension" },
  "space-16": { "$value": "4rem",    "$type": "dimension" },
  "space-20": { "$value": "5rem",    "$type": "dimension" },
  "space-24": { "$value": "6rem",    "$type": "dimension" }
}
```

**Pixel equivalents at 16 px root:** 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48 · 64 · 80 · 96 px.

---

### 2.3 `typography.tokens.json`

Fluid type scale via `clamp(min, preferred, max)`. Font family stacks. Line heights. Font weights.

```json
{
  "font-sans":  { "$value": "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", "$type": "fontFamily" },
  "font-serif": { "$value": "Georgia, 'Times New Roman', Times, serif", "$type": "fontFamily" },
  "font-mono":  { "$value": "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace", "$type": "fontFamily" },

  "text-xs":   { "$value": "clamp(0.75rem, 0.71rem + 0.18vw, 0.875rem)",  "$type": "dimension" },
  "text-sm":   { "$value": "clamp(0.875rem, 0.83rem + 0.22vw, 1rem)",     "$type": "dimension" },
  "text-base": { "$value": "clamp(1rem, 0.95rem + 0.25vw, 1.125rem)",     "$type": "dimension" },
  "text-lg":   { "$value": "clamp(1.125rem, 1.06rem + 0.33vw, 1.25rem)", "$type": "dimension" },
  "text-xl":   { "$value": "clamp(1.25rem, 1.14rem + 0.54vw, 1.5rem)",   "$type": "dimension" },
  "text-2xl":  { "$value": "clamp(1.5rem, 1.32rem + 0.89vw, 1.875rem)",  "$type": "dimension" },
  "text-3xl":  { "$value": "clamp(1.875rem, 1.55rem + 1.61vw, 2.25rem)", "$type": "dimension" },
  "text-4xl":  { "$value": "clamp(2.25rem, 1.77rem + 2.41vw, 3rem)",     "$type": "dimension" },
  "text-5xl":  { "$value": "clamp(3rem, 2.25rem + 3.75vw, 4.5rem)",      "$type": "dimension" },

  "leading-tight":   { "$value": "1.25", "$type": "number" },
  "leading-normal":  { "$value": "1.5",  "$type": "number" },
  "leading-relaxed": { "$value": "1.75", "$type": "number" },

  "font-normal":   { "$value": "400", "$type": "fontWeight" },
  "font-medium":   { "$value": "500", "$type": "fontWeight" },
  "font-semibold": { "$value": "600", "$type": "fontWeight" },
  "font-bold":     { "$value": "700", "$type": "fontWeight" }
}
```

**Scale rationale:** Minor third (1.2) ratio at base 1 rem, clamped between a tight mobile floor and a comfortable desktop ceiling. The `preferred` value uses `vw` to interpolate fluidly across the viewport width range 320 px – 1280 px.

**Font family decisions (PRD §8.3):**
- `font-sans` — system stack; reads as "native" on every OS
- `font-serif` — Georgia; the editorial default for body copy; swappable via token override
- `font-mono` — `ui-monospace` first (macOS/iOS native), then cross-platform fallbacks

---

### 2.4 `motion.tokens.json`

Minimal, functional motion. All transitions in the system use one of the two duration tokens.

```json
{
  "duration-fast": { "$value": "120ms", "$type": "duration" },
  "duration-base": { "$value": "200ms", "$type": "duration" },

  "easing-standard": { "$value": "cubic-bezier(0.4, 0, 0.2, 1)", "$type": "cubicBezier" },
  "easing-enter":    { "$value": "cubic-bezier(0, 0, 0.2, 1)",   "$type": "cubicBezier" },
  "easing-exit":     { "$value": "cubic-bezier(0.4, 0, 1, 1)",   "$type": "cubicBezier" }
}
```

**Usage guide:**

| Token | Use |
|---|---|
| `duration-fast` | Micro-interactions: hover states, focus rings, toggles |
| `duration-base` | Panel transitions: modals opening, drawers sliding, toasts appearing |
| `easing-standard` | Elements that move within the screen (shared) |
| `easing-enter` | Elements entering the screen (decelerate to rest) |
| `easing-exit` | Elements leaving the screen (accelerate away) |

All CSS transitions using these tokens must be wrapped in `@media (prefers-reduced-motion: reduce) { transition: none; animation: none; }`.

---

### 2.5 `radius.tokens.json`

Foolscap defaults to sharp corners (`radius-sm` or no radius). Rounding is opt-in.

```json
{
  "radius-none": { "$value": "0",      "$type": "dimension" },
  "radius-sm":   { "$value": "2px",    "$type": "dimension" },
  "radius-md":   { "$value": "4px",    "$type": "dimension" },
  "radius-lg":   { "$value": "8px",    "$type": "dimension" },
  "radius-xl":   { "$value": "12px",   "$type": "dimension" },
  "radius-full": { "$value": "9999px", "$type": "dimension" }
}
```

---

### 2.6 `shadow.tokens.json`

Hairline rules only. No heavy drop shadows — elevation is communicated with thin borders and offset, not shadow.

```json
{
  "shadow-hairline": { "$value": "0 0 0 1px rgb(26 26 26 / 0.1)", "$type": "shadow" },
  "shadow-raised":   { "$value": "0 1px 3px rgb(0 0 0 / 0.08)",  "$type": "shadow" }
}
```

**Shadow semantics:**
- `shadow-hairline` — default border treatment for interactive elements (inputs, cards, buttons in secondary/ghost variants). 1 px inset ring using `--fc-ink` at 10% opacity.
- `shadow-raised` — lifts an overlay element (modal, popover, tooltip) one step above the surface. Deliberately subtle.

> **Note:** Values use the modern `rgb(R G B / A)` syntax rather than `rgba()`. This is valid CSS3 and widely supported. The shadow values encode the ink colour (`#1A1A1A` = `rgb(26 26 26)`) directly rather than referencing `--fc-ink` — CSS custom properties cannot be used inside token JSON values since the build script outputs them as static strings.

---

## 3 — TypeScript Token Name Exports

Replace the stub in `packages/tokens/src/index.ts` with the full export list. These are typed `const` strings mapping human-readable names to their CSS custom property names.

**Purpose:** TypeScript consumers can write `el.style.setProperty(tokens.ink, '#000')` instead of the magic string `'--fc-ink'`. IDE autocomplete covers the entire token surface.

```ts
// Palette
export const paper       = '--fc-paper'       as const
export const paperRaised = '--fc-paper-raised' as const
export const ink         = '--fc-ink'         as const
export const inkMuted    = '--fc-ink-muted'   as const
export const grey100     = '--fc-grey-100'    as const
export const grey200     = '--fc-grey-200'    as const
export const grey300     = '--fc-grey-300'    as const
export const grey400     = '--fc-grey-400'    as const
export const grey500     = '--fc-grey-500'    as const
export const grey600     = '--fc-grey-600'    as const
export const grey700     = '--fc-grey-700'    as const
export const grey800     = '--fc-grey-800'    as const
export const grey900     = '--fc-grey-900'    as const

// Spacing
export const space1  = '--fc-space-1'  as const
export const space2  = '--fc-space-2'  as const
export const space3  = '--fc-space-3'  as const
export const space4  = '--fc-space-4'  as const
export const space5  = '--fc-space-5'  as const
export const space6  = '--fc-space-6'  as const
export const space8  = '--fc-space-8'  as const
export const space10 = '--fc-space-10' as const
export const space12 = '--fc-space-12' as const
export const space16 = '--fc-space-16' as const
export const space20 = '--fc-space-20' as const
export const space24 = '--fc-space-24' as const

// Typography — font families
export const fontSans  = '--fc-font-sans'  as const
export const fontSerif = '--fc-font-serif' as const
export const fontMono  = '--fc-font-mono'  as const

// Typography — type scale
export const textXs   = '--fc-text-xs'   as const
export const textSm   = '--fc-text-sm'   as const
export const textBase = '--fc-text-base' as const
export const textLg   = '--fc-text-lg'   as const
export const textXl   = '--fc-text-xl'   as const
export const text2xl  = '--fc-text-2xl'  as const
export const text3xl  = '--fc-text-3xl'  as const
export const text4xl  = '--fc-text-4xl'  as const
export const text5xl  = '--fc-text-5xl'  as const

// Typography — line heights
export const leadingTight   = '--fc-leading-tight'   as const
export const leadingNormal  = '--fc-leading-normal'  as const
export const leadingRelaxed = '--fc-leading-relaxed' as const

// Typography — font weights
export const fontNormal   = '--fc-font-normal'   as const
export const fontMedium   = '--fc-font-medium'   as const
export const fontSemibold = '--fc-font-semibold' as const
export const fontBold     = '--fc-font-bold'     as const

// Motion
export const durationFast = '--fc-duration-fast' as const
export const durationBase = '--fc-duration-base' as const
export const easingStandard = '--fc-easing-standard' as const
export const easingEnter    = '--fc-easing-enter'    as const
export const easingExit     = '--fc-easing-exit'     as const

// Radius
export const radiusNone = '--fc-radius-none' as const
export const radiusSm   = '--fc-radius-sm'   as const
export const radiusMd   = '--fc-radius-md'   as const
export const radiusLg   = '--fc-radius-lg'   as const
export const radiusXl   = '--fc-radius-xl'   as const
export const radiusFull = '--fc-radius-full' as const

// Shadow
export const shadowHairline = '--fc-shadow-hairline' as const
export const shadowRaised   = '--fc-shadow-raised'   as const
```

---

## 4 — Expected Build Outputs

After running `pnpm build` in `packages/tokens/`, the following files must exist:

### `dist/tokens.css`

A single `:root { }` block. Excerpt showing the expected format:

```css
/* Auto-generated — do not edit. Run: node scripts/build-css.mjs */
:root {
  /* palette.tokens.json */
  --fc-paper: #FBFBF9;
  --fc-paper-raised: #FFFFFF;
  --fc-ink: #1A1A1A;
  --fc-ink-muted: #5C5C5C;
  --fc-grey-100: #F5F5F5;
  /* ... remaining palette tokens ... */

  /* spacing.tokens.json */
  --fc-space-1: 0.25rem;
  --fc-space-2: 0.5rem;
  /* ... */

  /* typography.tokens.json */
  --fc-font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --fc-font-serif: Georgia, 'Times New Roman', Times, serif;
  --fc-font-mono: ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, monospace;
  --fc-text-xs: clamp(0.75rem, 0.71rem + 0.18vw, 0.875rem);
  /* ... */

  /* motion.tokens.json */
  --fc-duration-fast: 120ms;
  --fc-duration-base: 200ms;
  --fc-easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
  /* ... */

  /* radius.tokens.json */
  --fc-radius-none: 0;
  --fc-radius-sm: 2px;
  /* ... */

  /* shadow.tokens.json */
  --fc-shadow-hairline: 0 0 0 1px rgb(26 26 26 / 0.1);
  --fc-shadow-raised: 0 1px 3px rgb(0 0 0 / 0.08);
}
```

### `dist/index.js` / `dist/index.cjs` / `dist/index.d.ts`

Typed ESM and CJS exports of all token name constants. Consumers import:
```ts
import { ink, paper, space4 } from '@web-loom/foolscap-tokens'
// ink === '--fc-ink'
// paper === '--fc-paper'
// space4 === '--fc-space-4'
```

---

## 5 — Tests

Create `packages/tokens/src/tokens.test.ts`. Tests verify the build outputs are correct and internally consistent.

```ts
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'
import * as tokens from './index'

const css = readFileSync(resolve(__dirname, '../dist/tokens.css'), 'utf8')

describe('tokens.css', () => {
  it('contains a :root block', () => {
    expect(css).toContain(':root {')
  })

  it('outputs the core palette variables', () => {
    expect(css).toContain('--fc-paper: #FBFBF9')
    expect(css).toContain('--fc-paper-raised: #FFFFFF')
    expect(css).toContain('--fc-ink: #1A1A1A')
    expect(css).toContain('--fc-ink-muted: #5C5C5C')
  })

  it('outputs all grey scale variables', () => {
    for (const n of [100, 200, 300, 400, 500, 600, 700, 800, 900]) {
      expect(css).toContain(`--fc-grey-${n}:`)
    }
  })

  it('outputs spacing variables', () => {
    expect(css).toContain('--fc-space-1: 0.25rem')
    expect(css).toContain('--fc-space-4: 1rem')
    expect(css).toContain('--fc-space-16: 4rem')
  })

  it('outputs fluid type scale with clamp()', () => {
    expect(css).toContain('--fc-text-base: clamp(')
    expect(css).toContain('--fc-text-5xl: clamp(')
  })

  it('outputs font family stacks', () => {
    expect(css).toContain('--fc-font-sans:')
    expect(css).toContain('--fc-font-serif:')
    expect(css).toContain('--fc-font-mono:')
  })

  it('outputs motion tokens', () => {
    expect(css).toContain('--fc-duration-fast: 120ms')
    expect(css).toContain('--fc-duration-base: 200ms')
    expect(css).toContain('--fc-easing-standard: cubic-bezier(')
  })

  it('outputs radius tokens', () => {
    expect(css).toContain('--fc-radius-sm: 2px')
    expect(css).toContain('--fc-radius-full: 9999px')
  })

  it('outputs shadow tokens', () => {
    expect(css).toContain('--fc-shadow-hairline:')
    expect(css).toContain('--fc-shadow-raised:')
  })

  it('contains no hard-coded hex values outside of palette section', () => {
    // Split out the palette section; remaining lines must not contain raw hex colors
    const lines = css.split('\n')
    const paletteEnd = lines.findIndex((l) => l.includes('spacing.tokens.json'))
    const nonPaletteLines = lines.slice(paletteEnd)
    const hexPattern = /#[0-9A-Fa-f]{3,6}\b/
    const violations = nonPaletteLines.filter(
      (l) => hexPattern.test(l) && !l.trim().startsWith('/*')
    )
    expect(violations).toEqual([])
  })

  it('all --fc-* variables use the correct prefix', () => {
    const varDeclarations = css.match(/--[a-z][a-z0-9-]*:/g) ?? []
    const nonFc = varDeclarations.filter((v) => !v.startsWith('--fc-'))
    expect(nonFc).toEqual([])
  })
})

describe('token name exports', () => {
  it('exports match their CSS variable name', () => {
    // Each exported constant must equal '--fc-' + its camelCase-to-kebab-case name
    expect(tokens.paper).toBe('--fc-paper')
    expect(tokens.paperRaised).toBe('--fc-paper-raised')
    expect(tokens.ink).toBe('--fc-ink')
    expect(tokens.inkMuted).toBe('--fc-ink-muted')
    expect(tokens.space4).toBe('--fc-space-4')
    expect(tokens.textBase).toBe('--fc-text-base')
    expect(tokens.durationFast).toBe('--fc-duration-fast')
    expect(tokens.radiusFull).toBe('--fc-radius-full')
    expect(tokens.shadowHairline).toBe('--fc-shadow-hairline')
  })

  it('all exports are strings starting with --fc-', () => {
    for (const [key, value] of Object.entries(tokens)) {
      expect(typeof value, `token "${key}"`).toBe('string')
      expect(value, `token "${key}"`).toMatch(/^--fc-/)
    }
  })
})
```

> **Note:** The CSS tests read from `../dist/tokens.css` — run `pnpm build` before `pnpm test` in this package. In Turborepo the `test` task has `dependsOn: ["^build"]` which handles this automatically when running from the root.

---

## 6 — Inverted Mode (reference, not implemented here)

The PRD (§8.5) specifies an opt-in dark/inverted mode as a future token set. When implemented (Phase 5), it is a second token file — `palette-inverted.tokens.json` — that swaps `paper` and `ink` values and is compiled to a `:root[data-theme="dark"]` block in a separate `dist/tokens-dark.css`.

**Do not implement inverted mode in this phase.** The token naming and structure chosen here must be compatible with a future inversion, which the current choices satisfy (no semantic names encode "light" or "dark").

---

## 7 — Acceptance Criteria

```
TOKEN FILES
[ ] packages/tokens/src/palette.tokens.json    exists and is valid JSON
[ ] packages/tokens/src/spacing.tokens.json    exists and is valid JSON
[ ] packages/tokens/src/typography.tokens.json exists and is valid JSON
[ ] packages/tokens/src/motion.tokens.json     exists and is valid JSON
[ ] packages/tokens/src/radius.tokens.json     exists and is valid JSON
[ ] packages/tokens/src/shadow.tokens.json     exists and is valid JSON
[ ] packages/tokens/src/index.ts is populated (no longer exports {})
[ ] packages/tokens/src/tokens.test.ts exists

BUILD
[ ] pnpm --filter @web-loom/foolscap-tokens build exits 0
[ ] packages/tokens/dist/tokens.css exists
[ ] packages/tokens/dist/tokens.css starts with "/* Auto-generated"
[ ] packages/tokens/dist/tokens.css contains :root {
[ ] packages/tokens/dist/tokens.css contains --fc-paper: #FBFBF9
[ ] packages/tokens/dist/tokens.css contains --fc-ink: #1A1A1A
[ ] packages/tokens/dist/tokens.css contains --fc-text-base: clamp(
[ ] packages/tokens/dist/tokens.css contains --fc-duration-fast: 120ms
[ ] packages/tokens/dist/tokens.css contains --fc-shadow-hairline:
[ ] packages/tokens/dist/index.js  exists (ESM)
[ ] packages/tokens/dist/index.cjs exists (CJS)
[ ] packages/tokens/dist/index.d.ts exists (types)

CORRECTNESS
[ ] No CSS variable outside the palette section contains a raw hex value (#xxxxxx)
[ ] All CSS variables in tokens.css start with --fc-
[ ] Total variable count in tokens.css: 13 palette + 12 spacing + 17 typography + 5 motion + 6 radius + 2 shadow = 55 variables

TYPECHECK
[ ] tsc --noEmit from packages/tokens/ exits 0

TESTS
[ ] pnpm --filter @web-loom/foolscap-tokens test exits 0
[ ] All test assertions in tokens.test.ts pass (build must run first)
```
