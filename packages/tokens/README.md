# `@web-loom/foolscap-tokens`

The design-token foundation for Foolscap. It keeps palette, spacing, typography, motion, radius, and shadow decisions in W3C-style JSON sources and builds them into TypeScript exports and CSS custom properties.

This package is currently consumed as part of the Foolscap workspace rather than as a published registry release.

## Usage

Import the generated variables when using tokens without the full Foolscap stylesheet:

```css
@import '@web-loom/foolscap-tokens/css';

.notice {
  padding: var(--fc-space-4);
  color: var(--fc-ink);
  background: var(--fc-paper-raised);
  border-radius: var(--fc-radius-md);
}
```

The default values are declared on `:root`. Override them after the import to apply a theme:

```css
:root {
  --fc-paper: #fffdf7;
  --fc-ink: #171717;
  --fc-font-sans: Inter, system-ui, sans-serif;
}
```

TypeScript exports contain the custom-property names, which is useful when setting tokens from code:

```ts
import { ink, space4 } from '@web-loom/foolscap-tokens'

document.documentElement.style.setProperty(ink, '#171717')
document.documentElement.style.setProperty(space4, '1rem')
```

## Source and output

- `src/*.tokens.json` contains the editable token values.
- `src/index.ts` exports typed CSS custom-property names.
- `dist/tokens.css` is generated; do not edit it directly.

The full [`@web-loom/foolscap-css`](../css/README.md) stylesheet already includes these variables.

## Development

From the repository root:

```sh
pnpm --filter @web-loom/foolscap-tokens build
pnpm --filter @web-loom/foolscap-tokens test
pnpm --filter @web-loom/foolscap-tokens lint
pnpm --filter @web-loom/foolscap-tokens typecheck
```

The build compiles the TypeScript entry point and regenerates `dist/tokens.css` from the JSON sources.

[Back to the workspace guide](../../README.md)
