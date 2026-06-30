# Layout / Stack

> Arranges children in a vertical (or horizontal) stack with consistent spacing between them.
> **Tier:** 1 — CSS only
> **Also known as:** Stack, Vertical stack, Flex column
> **Native element:** `<div>` with `display: flex; flex-direction: column`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-stack` | Flex column container |
| `item` | any child | — | Direct children receive spacing via `gap` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-stack-gap` | `gap` | `var(--fc-space-4)` |
| `--fc-stack-align` | `align-items` | `stretch` |

---

## HTML — Classless

```html
<!-- No dedicated classless form; use class-based for intentional stacking -->
```

---

## HTML — Class-based

```html
<!-- Vertical stack (default) -->
<div class="fc-stack">
  <div class="fc-box">Item one</div>
  <div class="fc-box">Item two</div>
  <div class="fc-box">Item three</div>
</div>

<!-- Tighter gap -->
<div class="fc-stack" style="--fc-stack-gap: var(--fc-space-2)">
  <p>Paragraph one</p>
  <p>Paragraph two</p>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | N/A — layout primitive |
| **Role(s)** | No ARIA role; structural only |
| **Contrast** | N/A |

---

## Variants & Modifiers

| Property | Effect |
|----------|--------|
| `--fc-stack-gap` | Controls spacing between children |
| `--fc-stack-align` | Controls cross-axis alignment (`flex-start`, `center`, `stretch`) |

---

## Notes

- Stack uses `gap` (not margins) so spacing is uniform and there's no "last child" special-casing.
- For horizontal stacking, use the Inline primitive.
- Recursive stacks (nested) each receive their own `--fc-stack-gap` which can be overridden independently.
