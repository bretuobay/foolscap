# Layout / Box

> The foundational layout primitive: a single element with consistent padding and optional border.
> **Tier:** 1 — CSS only
> **Also known as:** Box, Wrapper
> **Native element:** `<div>` (or any block element)

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-box` | Block container; single element |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-box-padding` | `padding` | `var(--fc-space-4)` |
| `--fc-box-border` | `border` | `1px solid var(--ink)` |
| `--fc-box-radius` | `border-radius` | `0` |
| `--fc-box-bg` | `background-color` | `transparent` |
| `--fc-box-color` | `color` | `inherit` |

---

## HTML — Classless

```html
<!-- No dedicated classless form; any block element acts as a box -->
<div>Content</div>
```

---

## HTML — Class-based

```html
<!-- Basic box with padding -->
<div class="fc-box">
  Content padded on all sides.
</div>

<!-- Box with border (inset) -->
<div class="fc-box" data-variant="inset">
  Inset box with visible border.
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | N/A — layout primitive |
| **Role(s)** | No ARIA role; purely structural |
| **Contrast** | Border vs background must meet 3:1 if the border conveys meaning |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `default` · `inset` | `default`: padding only; `inset`: padding + border |

---

## Notes

- Box is the base primitive. Stack, Inline, Grid, and Columns wrap Box-like containers to control child spacing.
- Override padding via inline `style` or utility classes rather than adding new variants — keep the API minimal.
