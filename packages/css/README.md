# `@web-loom/foolscap-css`

The portable visual layer for Foolscap. It provides token defaults, a small reset, classless styles for semantic HTML, layout primitives, and the component classes used by every framework adapter.

This package is currently consumed as part of the Foolscap workspace rather than as a published registry release.

## Usage

Import the complete stylesheet once near an application's entry point:

```ts
import '@web-loom/foolscap-css/foolscap.css'
```

Plain semantic HTML receives the classless foundation:

```html
<main>
  <h1>Project notes</h1>
  <p>Quiet defaults with no component runtime.</p>
  <button type="button">Continue</button>
</main>
```

Use explicit component classes when you need a component contract or variants:

```html
<button class="fc-button" data-variant="ghost" data-size="sm" type="button">
  <span class="fc-button__label">Cancel</span>
</button>
```

Individual component styles are available through the component export path:

```css
@import '@web-loom/foolscap-tokens/css';
@import '@web-loom/foolscap-css/components/button.css';
```

Component-only imports need the token variables and any reset or classless behavior your application requires. The complete stylesheet is the recommended default.

## Cascade and theming

The bundle declares three ordered layers:

```css
@layer foolscap.reset, foolscap.classless, foolscap.components;
```

Customize the design through token or component custom properties after the import:

```css
:root {
  --fc-paper: #fffdf7;
  --fc-ink: #171717;
}

.checkout-action {
  --fc-button-radius: var(--fc-radius-none);
}
```

See [`@web-loom/foolscap-tokens`](../tokens/README.md) for the token source and standalone token import.

## Development

From the repository root:

```sh
pnpm --filter @web-loom/foolscap-css build
pnpm --filter @web-loom/foolscap-css test
pnpm --filter @web-loom/foolscap-css lint
pnpm --filter @web-loom/foolscap-css typecheck
```

The build creates the complete `dist/foolscap.css` bundle and copies individual component styles to `dist/components/`.

[Back to the workspace guide](../../README.md)
