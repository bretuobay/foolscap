# Layout / Grid

> Places children in a CSS Grid with configurable columns and gap.
> **Tier:** 1 — CSS only
> **Also known as:** Grid, Auto grid
> **Native element:** `<div>` with `display: grid`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-grid` | CSS Grid container |
| `item` | any child | `.fc-grid__item` | Optional — use only when explicit column-span is needed |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-grid-columns` | `grid-template-columns` | `repeat(auto-fit, minmax(16rem, 1fr))` |
| `--fc-grid-gap` | `gap` | `var(--fc-space-4)` |
| `--fc-grid-align` | `align-items` | `start` |

---

## HTML — Classless

```html
<!-- No dedicated classless form -->
```

---

## HTML — Class-based

```html
<!-- Auto-fit grid (responsive by default) -->
<div class="fc-grid">
  <div class="fc-card">Card one</div>
  <div class="fc-card">Card two</div>
  <div class="fc-card">Card three</div>
  <div class="fc-card">Card four</div>
</div>

<!-- Fixed 3-column grid -->
<div class="fc-grid" style="--fc-grid-columns: repeat(3, 1fr)">
  <div>Column A</div>
  <div>Column B</div>
  <div>Column C</div>
</div>

<!-- Item spanning full width -->
<div class="fc-grid" style="--fc-grid-columns: repeat(12, 1fr)">
  <div class="fc-grid__item" style="grid-column: span 12">
    Full-width banner
  </div>
  <div class="fc-grid__item" style="grid-column: span 4">Sidebar</div>
  <div class="fc-grid__item" style="grid-column: span 8">Main content</div>
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

## Notes

- The default `repeat(auto-fit, minmax(16rem, 1fr))` creates a responsive grid that automatically adjusts column count as the container width changes — no media queries required.
- Override `--fc-grid-columns` for fixed layouts. For the classic 12-column grid, use `repeat(12, 1fr)` and set `grid-column: span N` on items.
- Use the Columns primitive when you need a two-column layout with a fixed secondary column width (e.g. sidebar + main).
