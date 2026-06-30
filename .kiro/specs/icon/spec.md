# Icon

> A graphic symbol designed to visually indicate the purpose of an interface element.
> **Tier:** 1 — CSS only
> **Also known as:** —
> **Native element:** `<svg>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<svg>` | `.fc-icon` | Inline SVG; sized via token |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-icon-size-sm` | `width` + `height` when `data-size="sm"` | `1rem` |
| `--fc-icon-size-md` | `width` + `height` when `data-size="md"` | `1.25rem` |
| `--fc-icon-size-lg` | `width` + `height` when `data-size="lg"` | `1.5rem` |
| `--fc-icon-color` | `color` (currentColor) | `currentColor` |

---

## HTML — Classless

```html
<!-- Decorative: hidden from assistive technology -->
<svg aria-hidden="true" focusable="false" width="20" height="20">
  <use href="/icons.svg#chevron-right"></use>
</svg>

<!-- Meaningful standalone icon -->
<span role="img" aria-label="Settings">
  <svg aria-hidden="true" focusable="false" width="20" height="20">
    <use href="/icons.svg#settings"></use>
  </svg>
</span>
```

---

## HTML — Class-based

```html
<!-- Decorative icon (inside a labelled button) -->
<button class="fc-button" type="button" aria-label="Close">
  <svg class="fc-icon" data-size="md" aria-hidden="true" focusable="false">
    <use href="/icons.svg#x"></use>
  </svg>
</button>

<!-- Meaningful standalone icon -->
<span role="img" aria-label="Warning">
  <svg class="fc-icon" data-size="lg" aria-hidden="true" focusable="false">
    <use href="/icons.svg#warning"></use>
  </svg>
</span>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | `aria-hidden="true"` on all SVGs (decorative and meaningful); meaningful icons use a surrounding `<span role="img" aria-label="...">` |
| **Required attributes** | `aria-hidden="true"` and `focusable="false"` on every `<svg>`; accessible name on the surrounding element when icon is meaningful |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-size` | `sm` · `md` (default) · `lg` | Sets width/height via token |

---

## Notes

- Foolscap does not ship an icon set in v1. The `fc-icon` class styles an `<svg>` slot; any SVG icon library (Lucide, Heroicons, Phosphor, etc.) can be used.
- `currentColor` means the icon inherits its color from CSS `color` on the parent — no explicit color token needed.
- Always set `focusable="false"` on SVGs in IE11/Edge legacy to prevent unexpected focus on the SVG element.
