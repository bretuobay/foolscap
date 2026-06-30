# Separator

> A separator between two elements, usually a horizontal line.
> **Tier:** 1 — CSS only
> **Also known as:** Divider, Horizontal rule, Vertical rule
> **Native element:** `<hr>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<hr>` (decorative) or `<div role="separator">` (structural) | `.fc-separator` | Single element |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-separator-color` | `border-color` / `background-color` | `var(--ink)` at `0.15` opacity |
| `--fc-separator-thickness` | `border-width` / `height` | `1px` |
| `--fc-separator-margin` | `margin-block` | `var(--fc-space-4)` |

---

## HTML — Classless

```html
<!-- Horizontal (default) — decorative -->
<hr>

<!-- Within a nav or toolbar — semantic separator -->
<div role="separator" aria-orientation="horizontal"></div>
```

---

## HTML — Class-based

```html
<!-- Horizontal -->
<hr class="fc-separator">

<!-- Vertical (for inline contexts: toolbars, breadcrumbs) -->
<hr class="fc-separator" data-orientation="vertical" aria-orientation="vertical">
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | `<hr>` has implicit `separator` role; `role="separator"` for `<div>` usage |
| **Required attributes** | `aria-orientation="vertical"` when used as a vertical divider |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-orientation` | `horizontal` (default) · `vertical` | Changes `width`/`height` axis; vertical uses `height: 100%` or explicit height |

---

## Notes

- `<hr>` is the correct element for a thematic break in flow content. For visual-only dividers with no semantic meaning, use `aria-hidden="true"` on the `<hr>`.
- Vertical separators are typically used inside flex containers (toolbars, nav bars) with an explicit `height` set.
