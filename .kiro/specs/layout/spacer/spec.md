# Spacer

> An explicit spacing element for inserting a fixed amount of whitespace when the Stack's gap or layout primitives' gap tokens are not sufficient.
> **Tier:** 1 — CSS only
> **Also known as:** —
> **Native element:** —

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-spacer` | `aria-hidden="true"`; block-level space insert |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-spacer-size` | `block-size` (height) in block flow; `inline-size` (width) in inline flow | `var(--fc-space-4, 1rem)` |

---

## HTML — Classless

```html
<!-- No classless equivalent -->
<div class="fc-spacer" aria-hidden="true"></div>
```

---

## HTML — Class-based

```html
<!-- 2rem vertical space -->
<div class="fc-spacer" aria-hidden="true" style="--fc-spacer-size: 2rem;"></div>

<!-- Named size via data-size -->
<div class="fc-spacer" aria-hidden="true" data-size="lg"></div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | `aria-hidden="true"` — always hidden from assistive technology |
| **Required attributes** | `aria-hidden="true"` |
| **Contrast** | N/A — invisible element |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-size` | `xs` · `sm` · `md` · `lg` · `xl` | Maps to spacing scale tokens (e.g. 0.25rem, 0.5rem, 1rem, 2rem, 4rem) |
| `data-axis` | `block` (default) · `inline` | Block: vertical space. Inline: horizontal space (used in flex/grid rows) |

---

## Notes

- **Prefer `gap` on Stack, Inline, Grid, or Columns** over Spacer — Spacer is the escape hatch for one-off spacing needs that layout primitives can't cleanly handle
- CSS: `display: block; block-size: var(--fc-spacer-size)` for block axis; `display: inline-block; inline-size: var(--fc-spacer-size)` for inline axis
- `aria-hidden="true"` is mandatory — the element has no semantic meaning and must be invisible to screen readers
- Avoid using Spacer inside flex/grid containers where `gap` achieves the same result more robustly
