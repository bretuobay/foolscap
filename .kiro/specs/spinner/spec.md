# Spinner

> A rotating animation that indicates an indeterminate loading state.
> **Tier:** 1 — CSS only
> **Also known as:** Loading indicator, Activity indicator, Throbber
> **Native element:** `<span>` (decorative SVG or CSS animation)

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<span>` | `.fc-spinner` | Houses animation; carries size via `data-size` |
| `svg` | `<svg>` | `.fc-spinner__svg` | Rotating circle arc; `aria-hidden="true"` |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Size | `data-size` | `sm` · `md` (default) · `lg` | `root` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-spinner-size-sm` | `width` + `height` | `1rem` |
| `--fc-spinner-size-md` | `width` + `height` | `1.5rem` |
| `--fc-spinner-size-lg` | `width` + `height` | `2.5rem` |
| `--fc-spinner-color` | `stroke` on SVG arc | `var(--ink)` |
| `--fc-spinner-track-color` | `stroke` on background circle | `var(--grey-200)` |
| `--fc-spinner-stroke-width` | `stroke-width` | `2` |
| `--fc-spinner-duration` | animation duration | `0.75s` |

---

## HTML — Classless

```html
<!-- No classless equivalent; use class-based markup -->
```

---

## HTML — Class-based

```html
<!-- Default (md) -->
<span class="fc-spinner" role="status" aria-label="Loading">
  <svg class="fc-spinner__svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <circle cx="12" cy="12" r="10" fill="none"
            stroke="var(--fc-spinner-track-color, #e0e0e0)"
            stroke-width="2"/>
    <circle cx="12" cy="12" r="10" fill="none"
            stroke="var(--fc-spinner-color, #1A1A1A)"
            stroke-width="2"
            stroke-dasharray="31.4"
            stroke-dashoffset="21"
            stroke-linecap="round"/>
  </svg>
</span>

<!-- Small spinner inside a button -->
<button class="fc-button" disabled aria-busy="true">
  <span class="fc-spinner" data-size="sm" aria-hidden="true">
    <svg class="fc-spinner__svg" viewBox="0 0 24 24" focusable="false">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor"
              stroke-width="2" stroke-dasharray="31.4" stroke-dashoffset="21"
              stroke-linecap="round"/>
    </svg>
  </span>
  Saving…
</button>

<!-- Page-level loading state -->
<div role="status" aria-live="polite" aria-label="Loading content">
  <span class="fc-spinner" data-size="lg" aria-hidden="true">
    <svg class="fc-spinner__svg" viewBox="0 0 24 24" focusable="false">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor"
              stroke-width="2" stroke-dasharray="31.4" stroke-dashoffset="21"
              stroke-linecap="round"/>
    </svg>
  </span>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | Standalone spinner: `role="status"` with `aria-label="Loading"`; inline (inside button): `aria-hidden="true"` on spinner, `aria-busy="true"` on the button |
| **Required attributes** | `aria-label` or `aria-labelledby` when spinner is the sole loading indicator; SVG must have `aria-hidden="true"` |
| **Contrast** | Spinner stroke vs background must meet WCAG 2.2 AA non-text contrast (3:1) |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-size` | `sm` · `md` · `lg` | Maps to CSS custom property for `width`/`height` |

---

## Notes

- The CSS `@keyframes` animation rotates the SVG: `transform: rotate(360deg)` on the inner SVG element. Disable with `prefers-reduced-motion: reduce` (optionally show a static pulse via `opacity` instead).
- For a spinner paired with skeleton loaders, use one `role="status"` element announcing "Loading" to screen readers — not one per skeleton block.
- Do not use Spinner for long-running deterministic operations; use Progress Bar instead.
