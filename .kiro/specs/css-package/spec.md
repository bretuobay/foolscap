# CSS Package

> Build `@web-loom/foolscap-css` — the paper skin.
> **Phase:** 1 (1.1 → 1.5)
> **Depends on:** `tokens` spec (`@web-loom/foolscap-tokens` built and `dist/tokens.css` present)
> **Blocks:** React adapter (Phase 3)

---

## 1 — Overview

`@web-loom/foolscap-css` ships two things:

1. **`dist/foolscap.css`** — a single droppable stylesheet. Drop it in a `<link>` tag and raw semantic HTML looks finished. No JavaScript, no build step, no classes required (classless mode).
2. **`dist/components/[name].css`** — individual per-component CSS files for consumers who want to tree-shake and import only what they use.

The package has no JavaScript exports. It is pure CSS processed through PostCSS (nesting → autoprefix → minify in production).

### Current scaffold state

The following are already in place and must **not** be recreated:

- `package.json` — correct exports map, Vite build scripts, PostCSS devDependencies
- `vite.config.ts` — using `createCssPackageConfig` factory
- `postcss.config.js` — nesting + autoprefixer + cssnano (prod)
- `tsconfig.json`, `vitest.config.ts`, `eslint.config.js`
- `src/index.ts` — side-effect import of `index.css`
- `src/index.css` — stub with `@layer foolscap`

This spec covers what still needs to be built: the full source directory, all CSS files, the per-component build script, the token lint rule, and tests.

---

## 2 — Source Directory Structure

Produce this exact layout under `packages/css/src/`:

```
src/
├── index.ts              ← already exists (do not modify)
├── index.css             ← entry point — @import everything in order
├── tokens.css            ← re-exports tokens from @web-loom/foolscap-tokens
├── reset.css             ← minimal opinionated reset
├── classless/
│   ├── base.css          ← :root defaults, body
│   ├── typography.css    ← h1–h6, p, inline text elements
│   ├── forms.css         ← input, textarea, select, button, fieldset, label
│   ├── tables.css        ← table, thead, tbody, tr, th, td
│   ├── media.css         ← img, video, figure, figcaption
│   └── layout.css        ← main, section, article, nav, header, footer, aside
└── components/
    ├── alert.css
    ├── avatar.css
    ├── badge.css
    ├── breadcrumbs.css
    ├── button.css
    ├── button-group.css
    ├── card.css
    ├── checkbox.css
    ├── color-picker.css
    ├── date-input.css
    ├── empty-state.css
    ├── fieldset.css
    ├── file.css
    ├── footer.css
    ├── header.css
    ├── heading.css
    ├── hero.css
    ├── icon.css
    ├── image.css
    ├── label.css
    ├── link.css
    ├── list.css
    ├── progress-bar.css
    ├── quote.css
    ├── radio-button.css
    ├── search-input.css
    ├── separator.css
    ├── skeleton.css
    ├── skip-link.css
    ├── slider.css
    ├── spinner.css
    ├── table.css
    ├── text-input.css
    ├── textarea.css
    ├── video.css
    ├── visually-hidden.css
    └── layout/
        ├── aspect-ratio.css
        ├── box.css
        ├── center.css
        ├── columns.css
        ├── container.css
        ├── cover.css
        ├── grid.css
        ├── inline.css
        ├── sidebar.css
        ├── spacer.css
        ├── stack.css
        └── switcher.css
```

Also create one build script:

```
scripts/
└── build-components.mjs   ← processes each src/components/**/*.css through PostCSS individually
```

---

## 3 — CSS Layer Strategy

All styles in this package use CSS cascade layers. This lets consumers override Foolscap styles with ordinary un-layered CSS — no `!important` needed, no specificity battles.

### Layer declaration order

`src/index.css` must declare layers in this exact order before any `@import`:

```css
@layer foolscap.reset, foolscap.classless, foolscap.components;
```

Declaring them upfront fixes their cascade priority: reset < classless < components. Later-declared layers win within the `foolscap` namespace.

### Layer assignment

| Layer | Used by | Wins over |
|---|---|---|
| `foolscap.reset` | `reset.css` | Nothing |
| `foolscap.classless` | All `classless/*.css` files | reset |
| `foolscap.components` | All `components/*.css` files | classless |

Un-layered consumer CSS wins over all three automatically.

### Each CSS file wraps its rules

```css
/* reset.css */
@layer foolscap.reset {
  /* rules here */
}

/* classless/typography.css */
@layer foolscap.classless {
  /* rules here */
}

/* components/button.css */
@layer foolscap.components {
  /* rules here */
}
```

---

## 4 — Token Usage Rules

> **These rules apply to every CSS file in this package without exception.**

1. **No hard-coded colour values.** Use `var(--fc-paper)`, `var(--fc-ink)`, `var(--fc-grey-300)`, etc.
2. **No hard-coded spacing values.** Use `var(--fc-space-4)`, `var(--fc-space-2)`, etc.
3. **No hard-coded font sizes.** Use `var(--fc-text-base)`, `var(--fc-text-sm)`, etc.
4. **No hard-coded `font-weight` values.** Use `var(--fc-font-normal)`, `var(--fc-font-bold)`, etc.
5. **No hard-coded transition durations or easing values.** Use `var(--fc-duration-fast)`, `var(--fc-easing-standard)`, etc.
6. **No hard-coded border-radius values.** Use `var(--fc-radius-sm)`, etc.
7. **No hard-coded box-shadow values.** Use `var(--fc-shadow-hairline)`, `var(--fc-shadow-raised)`.

**Permitted hard-coded values:**
- `0` (zero — no unit needed)
- `1px` (border widths — the one structural value without a token)
- `100%`, `auto`, `none`, `inherit`, `currentColor` (CSS keywords)
- Unitless ratios for `line-height`, `opacity`, `flex-grow`, `z-index`
- `44px` / `2.75rem` as a minimum touch target size (WCAG requirement — no token for this intentionally)

**Component-local tokens** (optional): components may define their own `--fc-[component]-*` custom properties as overridable knobs, defaulting to global tokens:

```css
.fc-button {
  --fc-button-padding-x: var(--fc-space-4);
  --fc-button-padding-y: var(--fc-space-2);
  padding: var(--fc-button-padding-y) var(--fc-button-padding-x);
}
```

This pattern lets consumers tweak a component without forking its CSS.

---

## 5 — CSS Writing Conventions

### Naming

| Concept | Pattern | Example |
|---|---|---|
| Component root | `.fc-[name]` | `.fc-button` |
| Component part | `.fc-[name]__[part]` | `.fc-button__label` |
| State | `[data-state="value"]` | `[data-state="loading"]` |
| Variant | `[data-variant="value"]` | `[data-variant="primary"]` |
| Size | `[data-size="value"]` | `[data-size="sm"]` |
| Disabled | `:disabled` (native) or `[aria-disabled="true"]` | — |

Never use modifier classes (`.fc-button--primary`). Only `data-*` attributes for state and variant — this is the BEM part/element pattern without the modifier class.

### Nesting

Use CSS nesting (`postcss-nesting` processes it). Keep nesting shallow — two levels max.

```css
.fc-button {
  /* root styles */

  & .fc-button__label {
    /* part styles */
  }

  &[data-variant="ghost"] {
    /* variant styles */
  }

  &:hover {
    /* state styles */
  }

  &:disabled,
  &[aria-disabled="true"] {
    /* disabled styles */
  }
}
```

### Motion

Every `transition` and `animation` must be paired with a `prefers-reduced-motion` override:

```css
.fc-spinner {
  animation: spin var(--fc-duration-base) var(--fc-easing-standard) infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}
```

### Focus rings

Use the two-shadow focus ring technique (visible on both light and dark backgrounds):

```css
&:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 2px var(--fc-paper),
    0 0 0 4px var(--fc-ink);
}
```

Never use `outline: none` without replacing it with a visible alternative.

### Minimum touch targets

Interactive elements must meet 44×44 px minimum (WCAG 2.5.5):

```css
.fc-button {
  min-height: 2.75rem; /* 44px at default root font size */
  min-width: 2.75rem;
}
```

---

## 6 — Phase 1.1: Core Files

### `src/tokens.css`

Imports the compiled token stylesheet from `@web-loom/foolscap-tokens`. This makes `--fc-*` variables available to all downstream CSS via the same bundle.

```css
@import '@web-loom/foolscap-tokens/css';
```

> **Note:** Vite resolves `@import` with bare specifiers from `node_modules` automatically. PostCSS `postcss-import` is not needed — Vite's CSS preprocessor handles it.

### `src/reset.css`

Minimal opinionated reset. Only what's needed to establish the paper baseline — not a full browser reset.

```css
@layer foolscap.reset {
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    -webkit-text-size-adjust: 100%;
    tab-size: 4;
  }

  body {
    min-height: 100svh;
    line-height: var(--fc-leading-normal);
    font-family: var(--fc-font-serif);
    font-size: var(--fc-text-base);
    color: var(--fc-ink);
    background-color: var(--fc-paper);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  input,
  button,
  textarea,
  select {
    font: inherit;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }
}
```

### `src/index.css`

Replace the current stub. This is the single entry point — it controls import order.

```css
/* Layer declaration — order is intentional and must not change */
@layer foolscap.reset, foolscap.classless, foolscap.components;

/* 1. Token variables */
@import './tokens.css';

/* 2. Reset */
@import './reset.css';

/* 3. Classless layer */
@import './classless/base.css';
@import './classless/typography.css';
@import './classless/forms.css';
@import './classless/tables.css';
@import './classless/media.css';
@import './classless/layout.css';

/* 4. Component layer — Tier 1 components */
@import './components/heading.css';
@import './components/label.css';
@import './components/link.css';
@import './components/badge.css';
@import './components/quote.css';
@import './components/list.css';
@import './components/separator.css';
@import './components/alert.css';
@import './components/spinner.css';
@import './components/skeleton.css';
@import './components/progress-bar.css';
@import './components/empty-state.css';
@import './components/button.css';
@import './components/button-group.css';
@import './components/skip-link.css';
@import './components/text-input.css';
@import './components/textarea.css';
@import './components/search-input.css';
@import './components/checkbox.css';
@import './components/radio-button.css';
@import './components/date-input.css';
@import './components/color-picker.css';
@import './components/slider.css';
@import './components/fieldset.css';
@import './components/file.css';
@import './components/card.css';
@import './components/avatar.css';
@import './components/icon.css';
@import './components/image.css';
@import './components/table.css';
@import './components/hero.css';
@import './components/header.css';
@import './components/footer.css';
@import './components/visually-hidden.css';
@import './components/breadcrumbs.css';
@import './components/video.css';

/* 5. Layout primitives */
@import './components/layout/box.css';
@import './components/layout/stack.css';
@import './components/layout/inline.css';
@import './components/layout/grid.css';
@import './components/layout/columns.css';
@import './components/layout/sidebar.css';
@import './components/layout/switcher.css';
@import './components/layout/center.css';
@import './components/layout/cover.css';
@import './components/layout/container.css';
@import './components/layout/aspect-ratio.css';
@import './components/layout/spacer.css';
```

---

## 7 — Phase 1.2: Classless Layer

These files style raw semantic HTML elements. No `.fc-` classes. A page that only links `foolscap.css` and uses standard HTML looks finished without any class attributes.

### `src/classless/base.css`

```css
@layer foolscap.classless {
  :root {
    color-scheme: light;
  }
}
```

### `src/classless/typography.css`

```css
@layer foolscap.classless {
  h1, h2, h3, h4, h5, h6 {
    font-family: var(--fc-font-serif);
    font-weight: var(--fc-font-bold);
    line-height: var(--fc-leading-tight);
    color: var(--fc-ink);
  }

  h1 { font-size: var(--fc-text-5xl); }
  h2 { font-size: var(--fc-text-4xl); }
  h3 { font-size: var(--fc-text-3xl); }
  h4 { font-size: var(--fc-text-2xl); }
  h5 { font-size: var(--fc-text-xl); }
  h6 { font-size: var(--fc-text-lg); }

  p {
    max-width: 68ch;
    line-height: var(--fc-leading-relaxed);
  }

  strong, b { font-weight: var(--fc-font-bold); }
  em, i     { font-style: italic; }
  small     { font-size: var(--fc-text-sm); }

  a {
    color: var(--fc-ink);
    text-decoration: underline;
    text-underline-offset: 0.2em;

    &:hover {
      text-decoration-thickness: 2px;
    }

    &:focus-visible {
      outline: none;
      box-shadow:
        0 0 0 2px var(--fc-paper),
        0 0 0 4px var(--fc-ink);
      border-radius: var(--fc-radius-sm);
    }
  }

  code, kbd, samp {
    font-family: var(--fc-font-mono);
    font-size: 0.9em;
    background-color: var(--fc-grey-100);
    padding: 0.1em 0.35em;
    border-radius: var(--fc-radius-sm);
  }

  pre {
    font-family: var(--fc-font-mono);
    font-size: var(--fc-text-sm);
    background-color: var(--fc-grey-100);
    padding: var(--fc-space-4);
    border-radius: var(--fc-radius-md);
    overflow-x: auto;
    line-height: var(--fc-leading-relaxed);

    & code {
      background: none;
      padding: 0;
      font-size: inherit;
      border-radius: 0;
    }
  }

  blockquote {
    border-left: 2px solid var(--fc-ink);
    padding-left: var(--fc-space-4);
    color: var(--fc-ink-muted);
    font-style: italic;
  }

  abbr[title] {
    text-decoration: underline dotted;
    cursor: help;
  }

  mark {
    background-color: var(--fc-grey-200);
    color: var(--fc-ink);
    padding: 0.1em 0.2em;
  }

  hr {
    border: none;
    border-top: 1px solid var(--fc-grey-200);
    margin-block: var(--fc-space-6);
  }
}
```

### `src/classless/forms.css`

```css
@layer foolscap.classless {
  input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="color"]),
  textarea,
  select {
    display: block;
    width: 100%;
    padding: var(--fc-space-2) var(--fc-space-3);
    font-family: var(--fc-font-sans);
    font-size: var(--fc-text-base);
    color: var(--fc-ink);
    background-color: var(--fc-paper-raised);
    border: 1px solid var(--fc-grey-300);
    border-radius: var(--fc-radius-sm);
    transition: border-color var(--fc-duration-fast) var(--fc-easing-standard),
                box-shadow var(--fc-duration-fast) var(--fc-easing-standard);
    min-height: 2.75rem;

    &:focus-visible {
      outline: none;
      border-color: var(--fc-ink);
      box-shadow:
        0 0 0 2px var(--fc-paper),
        0 0 0 4px var(--fc-ink);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background-color: var(--fc-grey-100);
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  textarea {
    resize: vertical;
    min-height: calc(var(--fc-text-base) * var(--fc-leading-relaxed) * 4 + var(--fc-space-4));
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%231A1A1A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right var(--fc-space-3) center;
    padding-right: var(--fc-space-8);
  }

  label {
    display: block;
    font-size: var(--fc-text-sm);
    font-weight: var(--fc-font-medium);
    color: var(--fc-ink);
    margin-bottom: var(--fc-space-1);
  }

  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--fc-space-2);
    padding: var(--fc-space-2) var(--fc-space-4);
    min-height: 2.75rem;
    font-family: var(--fc-font-sans);
    font-size: var(--fc-text-base);
    font-weight: var(--fc-font-medium);
    color: var(--fc-paper);
    background-color: var(--fc-ink);
    border: 1px solid var(--fc-ink);
    border-radius: var(--fc-radius-sm);
    cursor: pointer;
    transition: opacity var(--fc-duration-fast) var(--fc-easing-standard);

    &:hover {
      opacity: 0.85;
    }

    &:focus-visible {
      outline: none;
      box-shadow:
        0 0 0 2px var(--fc-paper),
        0 0 0 4px var(--fc-ink);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    @media (prefers-reduced-motion: reduce) {
      transition: none;
    }
  }

  fieldset {
    border: 1px solid var(--fc-grey-200);
    border-radius: var(--fc-radius-md);
    padding: var(--fc-space-4);
  }

  legend {
    padding-inline: var(--fc-space-2);
    font-size: var(--fc-text-sm);
    font-weight: var(--fc-font-medium);
    color: var(--fc-ink-muted);
  }
}
```

### `src/classless/tables.css`

```css
@layer foolscap.classless {
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--fc-text-sm);
  }

  th,
  td {
    padding: var(--fc-space-2) var(--fc-space-3);
    text-align: left;
    border-bottom: 1px solid var(--fc-grey-200);
  }

  th {
    font-weight: var(--fc-font-semibold);
    color: var(--fc-ink);
    background-color: var(--fc-grey-100);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:nth-child(even) {
    background-color: var(--fc-grey-100);
  }
}
```

### `src/classless/media.css`

```css
@layer foolscap.classless {
  img,
  video {
    max-width: 100%;
    height: auto;
    display: block;
  }

  figure {
    margin: 0;
  }

  figcaption {
    font-size: var(--fc-text-sm);
    color: var(--fc-ink-muted);
    margin-top: var(--fc-space-2);
  }
}
```

### `src/classless/layout.css`

```css
@layer foolscap.classless {
  body {
    display: flex;
    flex-direction: column;
  }

  main {
    width: 100%;
    max-width: 72rem;
    margin-inline: auto;
    padding-inline: var(--fc-space-4);
    flex: 1;
  }

  /* Stack spacing: direct block children of these elements get top margin */
  main > * + *,
  article > * + *,
  section > * + * {
    margin-top: var(--fc-space-6);
  }

  nav ul {
    list-style: none;
  }
}
```

---

## 8 — Phase 1.3: Component CSS

Each file under `src/components/` must follow the conventions in Section 5. Each component spec at `.kiro/specs/[name]/spec.md` defines:

- The exact anatomy (parts and their class names)
- The states and data attributes
- Component-specific design tokens
- The classless HTML and class-based HTML markup

**Read the individual spec before writing each component's CSS.** The information below is the implementation summary — not a replacement for the spec.

### Global component CSS rule

Every component file opens and closes with its layer wrapper:

```css
@layer foolscap.components {
  /* all rules for this component */
}
```

---

### Batch A — Typography & display

**`heading.css`** — `.fc-heading`

Size is driven by the element's semantic level by default. `data-level` attribute decouples visual size from semantic level (e.g. `<h2 data-level="1">` renders at h1 size).

Key rules: font-serif, font-bold, leading-tight. Map h1–h6 element selectors AND `[data-level="1–6"]` selectors to the type scale tokens.

**`label.css`** — `.fc-label`

Small, medium-weight text. Required field indicator via `[data-required="true"]::after` content `" *"` in ink-muted colour.

**`link.css`** — `.fc-link`

Underline with `text-underline-offset`. External links (`[target="_blank"]`) get a trailing `↗` indicator via `::after`. Visited state uses `ink-muted`.

**`badge.css`** — `.fc-badge`

Inline pill. Three variants via `data-variant`:
- `default` (or omitted): ink background, paper text
- `outline`: transparent background, ink border and text
- `subtle`: grey-100 background, ink text

**`quote.css`** — `.fc-quote`

Wraps `<blockquote>`. Default: left border in ink, italic text, ink-muted colour. `data-variant="pull"`: larger text, centered, no left border — used for editorial pull quotes.

**`list.css`** — `.fc-list`

Wraps `<ul>` or `<ol>`. `data-variant`:
- `bulleted`: custom bullet using `::before`, ink colour
- `numbered`: decimal counter via `counter-reset`/`counter-increment`
- `plain`: no list markers, no left padding

**`separator.css`** — `.fc-separator`

Renders as `<hr>` or a `<div role="separator">`. `data-orientation`:
- `horizontal` (default): full-width 1px border-top in grey-200
- `vertical`: 1px border-left in grey-200, full height

---

### Batch B — Feedback & status

**`alert.css`** — `.fc-alert`

Parts: `root`, `icon`, `title`, `description`, `close`. Four variants via `data-variant`:
- `info`: grey-100 background, grey-700 icon
- `success`: hairline left border in grey-700 (no colour — system is black/white)
- `warning`: same pattern with bolder border
- `error`: ink border, ink background strip on left

Since the system has no accent colours, variants are distinguished by border weight and background tone, not hue.

**`spinner.css`** — `.fc-spinner`

A circular CSS animation. Uses `border` with one transparent side and `animation: spin` rotating 360°. Respects `prefers-reduced-motion: reduce` (hide or freeze). Sized via `data-size` using em units so it scales with surrounding text.

```css
@keyframes fc-spin {
  to { transform: rotate(360deg); }
}
```

Keyframe must be declared outside the `@layer` block — place it at the top of the file before the `@layer` wrapper.

**`skeleton.css`** — `.fc-skeleton`

Grey shimmer using a `background-image: linear-gradient(...)` animation (`@keyframes fc-shimmer`). Uses grey-200 as base, grey-100 as highlight pass. `prefers-reduced-motion`: replace animation with a static grey-200 background.

**`progress-bar.css`** — `.fc-progress-bar`

Wraps native `<progress>`. Must style both the `::-webkit-progress-bar` / `::-webkit-progress-value` (WebKit) and `appearance: none` + pseudo-element approach (Firefox). Track: grey-200. Fill: ink.

**`empty-state.css`** — `.fc-empty-state`

Parts: `root`, `icon`, `title`, `description`, `actions`. Centered flex-column layout. Icon is grey-400, title is ink at text-xl, description is ink-muted.

---

### Batch C — Actions

**`button.css`** — `.fc-button`

Parts: `root`, `icon-start`, `label`, `icon-end`.

Four variants via `data-variant`:
- `primary` (default): ink background, paper text
- `secondary`: paper-raised background, ink border and text
- `ghost`: transparent background, no border, ink text; shows border on hover
- `danger`: ink background (same as primary — no red in this system); differentiated by `aria-label` or context, not colour

Three sizes via `data-size`: `sm` (text-sm, space-2/space-3), `md` (default), `lg` (text-lg, space-3/space-6).

`data-state="loading"`: show a spinner inline, set `aria-disabled="true"`, prevent pointer events. The spinner is injected as `::before` using the same CSS animation as `fc-spinner`.

**`button-group.css`** — `.fc-button-group`

Horizontal flex row. Child `.fc-button` elements share borders — collapse adjacent borders:
- All children except first: `border-left: none`
- All children except first: `border-radius: 0` on left side
- All children except last: `border-radius: 0` on right side
- First child: `border-radius` on left side only
- Last child: `border-radius` on right side only

**`skip-link.css`** — `.fc-skip-link`

Visually hidden until focused. Position: fixed, top-left. On `:focus-visible`: become visible with ink background, paper text, high z-index. Used for keyboard navigation accessibility.

---

### Batch D — Form inputs

All form input components share these baseline rules:
- Background: `paper-raised`
- Border: `1px solid grey-300`
- Border on focus: `1px solid ink` + focus ring
- Border on error (`[data-state="error"]`): `1px solid ink` with bolder visual treatment
- Disabled: `opacity: 0.5`, `cursor: not-allowed`, `grey-100` background
- Min-height: `2.75rem` (44px touch target)
- Font: `font-sans`, `text-base`, `ink` colour
- Transition: `border-color` and `box-shadow` at `duration-fast`

**`text-input.css`** — `.fc-text-input`

Parts: `root` (wrapper `<div>`), `input` (`<input>`), `label` (`<label>`), `hint` (help text `<span>`), `error` (`<span role="alert">`).

States via `data-state` on `root`: `error`, `success`, `disabled`.

**`textarea.css`** — `.fc-textarea`

Same as text-input but `resize: vertical`. Include a note: auto-grow requires JavaScript (not part of CSS package).

**`search-input.css`** — `.fc-search-input`

Text input with a search icon slot (`__icon-start`) and a clear button slot (`__clear`, hidden when input is empty via `[data-empty="true"] .fc-search-input__clear { display: none }`).

**`checkbox.css`** — `.fc-checkbox`

Custom-styled `<input type="checkbox">`. Use `appearance: none` on the input, then style it with `::before` for the checkmark (using a CSS path or `clip-path`). Indeterminate state via `:indeterminate` pseudo-class — show a horizontal dash.

**`radio-button.css`** — `.fc-radio-button`

Same approach as checkbox but circular. `:checked` shows a filled inner circle via `::before`.

**`date-input.css`** — `.fc-date-input`

Styles native `<input type="date">`. Apply text-input styles to the outer element. Suppress the native calendar icon in WebKit (`input[type="date"]::-webkit-calendar-picker-indicator`) and replace with a custom icon slot.

**`color-picker.css`** — `.fc-color-picker`

Parts: `root`, `swatch` (the colour preview), `input` (native `<input type="color">`). The native input is visually hidden; the `swatch` displays the current colour via `background-color` (set via inline style by JS or directly). Clicking the swatch triggers the hidden input.

**`slider.css`** — `.fc-slider`

Styles `<input type="range">`. Use `appearance: none`. Track: thin grey-200 line. Thumb: circular ink-coloured circle, no border-radius trick needed — use `border-radius: var(--fc-radius-full)`. Must style both `::-webkit-slider-*` and `::-moz-range-*` pseudo-elements.

**`fieldset.css`** — `.fc-fieldset`

Wrapper for groups of related inputs. Parts: `root` (`<fieldset>`), `legend` (`<legend>`), `content`. Styled border from `shadow-hairline`, generous padding with `space-4`.

**`file.css`** — `.fc-file`

A visual chip representing a selected file — not the file picker itself. Parts: `root`, `icon`, `name`, `size`, `remove`. Displays as an inline-flex row with grey-100 background, ink text, remove button on the right.

---

### Batch E — Content & layout

**`card.css`** — `.fc-card`

Parts: `root`, `header`, `body`, `footer`, `media`. Background `paper-raised`, `shadow-hairline` border, `radius-md`. Header and footer have a `border-bottom`/`border-top` in `grey-200`. Media part is flush to the card edges (negative margin trick or `overflow: hidden` on root).

**`avatar.css`** — `.fc-avatar`

Circular image container. Parts: `root`, `image`, `initials`. When image fails or is absent, `__initials` shows the user's initials on grey-200 background. Sizes via `data-size`: `sm` (32px), `md` (40px, default), `lg` (56px).

**`icon.css`** — `.fc-icon`

Inline-flex wrapper for SVG icons. `aria-hidden="true"` is the default state (decorative icons). Sizes via `data-size`: uses `em` units so the icon scales with surrounding text. `color: currentColor` so the icon inherits text colour.

**`image.css`** — `.fc-image`

Parts: `root` (wrapper), `img`. Maintains aspect ratio via `aspect-ratio` CSS property. `object-fit: cover` on the `<img>`. Optional `data-ratio` attribute values: `"1/1"`, `"4/3"`, `"16/9"`, `"3/2"`.

**`table.css`** — `.fc-table`

Parts: `root` (scroll wrapper `<div>`), `table` (`<table>`). The scroll wrapper has `overflow-x: auto` for responsive behaviour. `aria-sort="ascending"` / `aria-sort="descending"` on `<th>` elements show sort direction indicators via `::after`.

**`hero.css`** — `.fc-hero`

Parts: `root`, `content`, `media`. Full-width section. Content is centered within a max-width container. Media (background image or visual) is positioned absolutely behind content.

**`header.css`** — `.fc-header`

Parts: `root`, `brand`, `nav`, `actions`. Horizontal flex row. Border-bottom hairline. Sticky positioning optional via `data-sticky="true"`. Background `paper` with `backdrop-filter: blur` when sticky.

**`footer.css`** — `.fc-footer`

Parts: `root`, `nav`, `legal`. Border-top hairline. Legal text in `ink-muted`, `text-sm`.

**`visually-hidden.css`** — `.fc-visually-hidden`

The standard accessible hiding technique — visible to screen readers, invisible to sighted users. Uses `clip-path` method (more reliable than the old `clip` approach):

```css
.fc-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border-width: 0;
}
```

---

### Batch F — Utility & loading

**`breadcrumbs.css`** — `.fc-breadcrumbs`

Parts: `root` (`<nav>`), `list` (`<ol>`), `item` (`<li>`), `link` (`<a>`), `separator`. Separators are CSS-generated via `::after` on each item except last: content `"/"` or a chevron SVG in ink-muted colour.

**`video.css`** — `.fc-video`

Parts: `root`, `media` (`<video>`), `controls` (slot for custom controls overlay). `<video>` is `width: 100%; height: auto`. Custom controls slot is absolutely positioned at the bottom with a linear-gradient scrim.

---

## 9 — Phase 1.4: Layout Primitives

Layout primitives are composable CSS utilities. Each is a single class that sets up a layout context. They contain no colour, typography, or visual design — only structural CSS (display, flex, grid, gap, padding).

All layout primitives use **component-local tokens** for their key parameters, allowing per-instance customisation via inline `style` attributes:

```html
<div class="fc-stack" style="--fc-stack-gap: var(--fc-space-8)">...</div>
```

Reference `.kiro/specs/layout/*/spec.md` for each primitive's exact API.

### `layout/stack.css` — `.fc-stack`

Vertical flex column with gap.

```css
@layer foolscap.components {
  .fc-stack {
    --fc-stack-gap: var(--fc-space-4);
    display: flex;
    flex-direction: column;
    gap: var(--fc-stack-gap);
  }
}
```

Also applied automatically in the classless layer to `main > *`, `section > *`, `article > *` children (see `classless/layout.css`).

### `layout/inline.css` — `.fc-inline`

Horizontal wrapping flex row (cluster pattern).

```css
@layer foolscap.components {
  .fc-inline {
    --fc-inline-gap: var(--fc-space-3);
    --fc-inline-justify: flex-start;
    display: flex;
    flex-wrap: wrap;
    gap: var(--fc-inline-gap);
    justify-content: var(--fc-inline-justify);
  }
}
```

### `layout/box.css` — `.fc-box`

Padding wrapper with optional border.

```css
@layer foolscap.components {
  .fc-box {
    --fc-box-padding: var(--fc-space-4);
    --fc-box-border: none;
    --fc-box-radius: 0;
    padding: var(--fc-box-padding);
    border: var(--fc-box-border);
    border-radius: var(--fc-box-radius);
  }
}
```

### `layout/grid.css` — `.fc-grid`

Auto-fill CSS Grid. Column minimum width is configurable.

```css
@layer foolscap.components {
  .fc-grid {
    --fc-grid-min: 16rem;
    --fc-grid-gap: var(--fc-space-4);
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(var(--fc-grid-min), 1fr));
    gap: var(--fc-grid-gap);
  }
}
```

### `layout/columns.css` — `.fc-columns`

Fixed column count grid.

```css
@layer foolscap.components {
  .fc-columns {
    --fc-columns-count: 2;
    --fc-columns-gap: var(--fc-space-4);
    display: grid;
    grid-template-columns: repeat(var(--fc-columns-count), 1fr);
    gap: var(--fc-columns-gap);
  }
}
```

### `layout/sidebar.css` — `.fc-sidebar`

Two-column layout: one flexible main area, one fixed-width sidebar. Stacks vertically when the main area drops below a threshold.

```css
@layer foolscap.components {
  .fc-sidebar {
    --fc-sidebar-width: 20rem;
    --fc-sidebar-gap: var(--fc-space-6);
    --fc-sidebar-threshold: 30rem;
    display: flex;
    flex-wrap: wrap;
    gap: var(--fc-sidebar-gap);

    & > :first-child {
      flex-basis: var(--fc-sidebar-width);
      flex-grow: 1;
    }

    & > :last-child {
      flex-basis: 0;
      flex-grow: 999;
      min-width: var(--fc-sidebar-threshold);
    }
  }
}
```

### `layout/switcher.css` — `.fc-switcher`

Horizontal row that switches to vertical stack below a threshold.

```css
@layer foolscap.components {
  .fc-switcher {
    --fc-switcher-threshold: 30rem;
    --fc-switcher-gap: var(--fc-space-4);
    display: flex;
    flex-wrap: wrap;
    gap: var(--fc-switcher-gap);

    & > * {
      flex-basis: calc((var(--fc-switcher-threshold) - 100%) * 999);
      flex-grow: 1;
    }
  }
}
```

### `layout/center.css` — `.fc-center`

Horizontal centering with a max reading width.

```css
@layer foolscap.components {
  .fc-center {
    --fc-center-max: 68ch;
    --fc-center-padding: var(--fc-space-4);
    box-sizing: content-box;
    max-width: var(--fc-center-max);
    margin-inline: auto;
    padding-inline: var(--fc-center-padding);
  }
}
```

### `layout/cover.css` — `.fc-cover`

Full-height flex column with a centred principal element.

```css
@layer foolscap.components {
  .fc-cover {
    --fc-cover-min-height: 100svh;
    --fc-cover-padding: var(--fc-space-4);
    display: flex;
    flex-direction: column;
    min-height: var(--fc-cover-min-height);
    padding: var(--fc-cover-padding);

    & > * {
      margin-block: auto;
    }

    & > :first-child:not(:only-child) {
      margin-block-start: 0;
    }

    & > :last-child:not(:only-child) {
      margin-block-end: 0;
    }
  }
}
```

### `layout/container.css` — `.fc-container`

Page-width wrapper with fluid horizontal padding.

```css
@layer foolscap.components {
  .fc-container {
    --fc-container-max: 80rem;
    width: 100%;
    max-width: var(--fc-container-max);
    margin-inline: auto;
    padding-inline: clamp(var(--fc-space-4), 5vw, var(--fc-space-12));
  }
}
```

### `layout/aspect-ratio.css` — `.fc-aspect-ratio`

Aspect ratio wrapper. Media child fills the box.

```css
@layer foolscap.components {
  .fc-aspect-ratio {
    --fc-aspect-ratio: 16 / 9;
    aspect-ratio: var(--fc-aspect-ratio);
    overflow: hidden;

    & > * {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
```

### `layout/spacer.css` — `.fc-spacer`

Explicit spacing primitive. `aria-hidden="true"` must be set in HTML.

```css
@layer foolscap.components {
  .fc-spacer {
    --fc-spacer-size: var(--fc-space-4);
    --fc-spacer-axis: block;
    flex-shrink: 0;
  }

  .fc-spacer[data-axis="block"] {
    display: block;
    height: var(--fc-spacer-size);
  }

  .fc-spacer[data-axis="inline"] {
    display: inline-block;
    width: var(--fc-spacer-size);
  }
}
```

---

## 10 — Phase 1.5: Per-Component Build + Token Lint

### Per-component build script

Add `packages/css/scripts/build-components.mjs`. This processes each component CSS source file individually through the same PostCSS pipeline and writes the output to `dist/components/`.

```js
#!/usr/bin/env node
/**
 * Processes each src/components/**\/*.css file through PostCSS individually,
 * outputting to dist/components/ for tree-shakeable per-component imports.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { globSync } from 'node:fs'    // Node 22+ built-in glob; see note below
import { resolve, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import postcssNesting from 'postcss-nesting'
import autoprefixer from 'autoprefixer'

// Note: globSync is available in Node 22+.
// For Node 20 compatibility, use: import { globSync } from 'glob' (add 'glob' as devDep)
// or replace with a manual recursive readdir.

const __dirname = dirname(fileURLToPath(import.meta.url))
const PKG_ROOT = resolve(__dirname, '..')
const SRC_COMPONENTS = resolve(PKG_ROOT, 'src', 'components')
const OUT_COMPONENTS = resolve(PKG_ROOT, 'dist', 'components')

const isProduction = process.env.NODE_ENV === 'production'

const plugins = [
  postcssNesting(),
  autoprefixer(),
  ...(isProduction ? [(await import('cssnano')).default()] : []),
]

const cssFiles = globSync('**/*.css', { cwd: SRC_COMPONENTS })

for (const file of cssFiles) {
  const src = resolve(SRC_COMPONENTS, file)
  const out = resolve(OUT_COMPONENTS, file)

  mkdirSync(dirname(out), { recursive: true })

  const css = readFileSync(src, 'utf8')
  const result = await postcss(plugins).process(css, { from: src, to: out })

  writeFileSync(out, result.css, 'utf8')
  if (result.map) {
    writeFileSync(`${out}.map`, result.map.toString(), 'utf8')
  }
}

console.log(`Component CSS written to: ${OUT_COMPONENTS}`)
```

Update `package.json` `build` script:

```json
{
  "scripts": {
    "build": "vite build && node scripts/build-components.mjs"
  }
}
```

Update `package.json` `exports` to expose component subpaths:

```json
{
  "exports": {
    ".": "./dist/foolscap.css",
    "./foolscap.css": "./dist/foolscap.css",
    "./components/*": "./dist/components/*"
  }
}
```

> **Node 20 compatibility note:** `globSync` from `node:fs` requires Node 22+. For Node 20, either install `glob` as a devDependency (`pnpm add -D glob --filter @web-loom/foolscap-css`) and use `import { globSync } from 'glob'`, or replace the glob with a manual recursive directory walk using `readdirSync`.

### Token enforcement

Add a PostCSS plugin that warns (development) or errors (CI) when a component CSS file contains a hard-coded value that should be a token reference. Add to `postcss.config.js`:

```js
// postcss.config.js — add the enforcement plugin
function tokenEnforcement() {
  return {
    postcssPlugin: 'postcss-foolscap-token-enforcement',
    Declaration(decl) {
      const colorProps = ['color', 'background', 'background-color', 'border-color',
        'outline-color', 'fill', 'stroke', 'box-shadow', 'text-decoration-color']
      const spaceProps = ['margin', 'padding', 'gap', 'top', 'right', 'bottom', 'left',
        'width', 'height', 'max-width', 'min-width', 'max-height', 'min-height']

      if (colorProps.some(p => decl.prop.includes(p))) {
        const hexPattern = /#[0-9A-Fa-f]{3,8}\b/
        if (hexPattern.test(decl.value)) {
          decl.warn(decl.source?.start
            ? `Hard-coded colour '${decl.value}' in ${decl.prop}. Use a --fc-* token.`
            : `Hard-coded colour in ${decl.prop}. Use a --fc-* token.`
          )
        }
      }
    },
  }
}
tokenEnforcement.postcssPlugin = 'postcss-foolscap-token-enforcement'
```

---

## 11 — Build Outputs

After `pnpm build` in `packages/css/`:

```
dist/
├── foolscap.css              ← combined bundle (tokens + reset + classless + all components)
└── components/
    ├── alert.css
    ├── avatar.css
    ├── badge.css
    ├── ... (one per component file)
    └── layout/
        ├── box.css
        ├── stack.css
        └── ... (one per layout primitive)
```

---

## 12 — Tests

`packages/css/src/css.test.ts` — verify the build output:

```ts
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, it, expect } from 'vitest'

const dist = resolve(__dirname, '../dist')
const css = readFileSync(resolve(dist, 'foolscap.css'), 'utf8')

describe('foolscap.css bundle', () => {
  it('contains the layer declaration', () => {
    expect(css).toContain('@layer foolscap.reset, foolscap.classless, foolscap.components')
  })

  it('contains token custom properties via @import', () => {
    expect(css).toContain('--fc-paper')
    expect(css).toContain('--fc-ink')
  })

  it('contains classless typography rules', () => {
    expect(css).toMatch(/h1\s*\{/)
    expect(css).toMatch(/h2\s*\{/)
  })

  it('contains component rules', () => {
    expect(css).toContain('.fc-button')
    expect(css).toContain('.fc-card')
    expect(css).toContain('.fc-stack')
  })

  it('contains no hard-coded hex colours outside palette section', () => {
    const hexPattern = /#[0-9A-Fa-f]{6}\b/g
    const matches = css.match(hexPattern) ?? []
    // Only the token values themselves (from tokens.css) are allowed hex values
    // After PostCSS processes @import, token values appear in :root — these are expected
    // Non-:root hex values indicate a violation
    const rootBlock = css.match(/:root\s*\{[^}]+\}/s)?.[0] ?? ''
    const outsideRoot = css.replace(rootBlock, '')
    const violations = (outsideRoot.match(hexPattern) ?? [])
    expect(violations).toEqual([])
  })
})

describe('per-component CSS files', () => {
  const components = [
    'button', 'card', 'badge', 'alert', 'spinner', 'stack', 'container',
  ]

  for (const name of components) {
    it(`dist/components/${name}.css exists`, () => {
      expect(existsSync(resolve(dist, `components/${name}.css`))).toBe(true)
    })
  }

  it('dist/components/layout/stack.css exists', () => {
    expect(existsSync(resolve(dist, 'components/layout/stack.css'))).toBe(true)
  })
})
```

---

## 13 — Acceptance Criteria

```
SOURCE FILES
[ ] src/tokens.css exists and contains @import '@web-loom/foolscap-tokens/css'
[ ] src/reset.css exists with @layer foolscap.reset wrapper
[ ] src/index.css contains the three-layer declaration as its first non-comment line
[ ] src/index.css imports all 37 component files and 12 layout primitive files
[ ] All 6 classless/*.css files exist
[ ] All 37 src/components/*.css files exist
[ ] All 12 src/components/layout/*.css files exist
[ ] scripts/build-components.mjs exists

BUILD
[ ] pnpm --filter @web-loom/foolscap-css build exits 0
[ ] dist/foolscap.css exists and is non-empty
[ ] dist/foolscap.css contains ':root {' (token variables from @import)
[ ] dist/foolscap.css contains '@layer' declarations
[ ] dist/foolscap.css contains '.fc-button'
[ ] dist/foolscap.css contains '.fc-stack'
[ ] dist/components/button.css exists
[ ] dist/components/card.css exists
[ ] dist/components/layout/stack.css exists
[ ] dist/components/layout/container.css exists

CORRECTNESS
[ ] No hex colour values appear outside the :root token block in dist/foolscap.css
[ ] All CSS variables used in component files start with --fc-
[ ] Every animated component has @media (prefers-reduced-motion: reduce) override
[ ] spinner.css has @keyframes fc-spin declared outside the @layer block

TESTS
[ ] src/css.test.ts exists
[ ] pnpm --filter @web-loom/foolscap-css test exits 0 (requires build first)

MANUAL VERIFICATION
[ ] Create a bare HTML file, link dist/foolscap.css, write semantic HTML (h1, p, button, table, input) — it should look finished with no classes
[ ] Add class="fc-button" data-variant="primary" to a button — primary variant should apply
[ ] Add class="fc-stack" to a div containing several elements — they should stack with gap
```
