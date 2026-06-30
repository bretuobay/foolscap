# Layout / Columns

> Splits content into a fixed number of equal columns using CSS multi-column layout.
> **Tier:** 1 — CSS only
> **Also known as:** Columns, Multi-column, Column layout
> **Native element:** `<div>` with `column-count` or `columns`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-columns` | Multi-column container |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-columns-count` | `column-count` | `2` |
| `--fc-columns-gap` | `column-gap` | `var(--fc-space-6)` |
| `--fc-columns-rule` | `column-rule` | `none` |
| `--fc-columns-min-width` | `column-width` (fluid variant) | `16rem` |

---

## HTML — Classless

```html
<!-- No dedicated classless form -->
```

---

## HTML — Class-based

```html
<!-- Two equal columns (default) -->
<div class="fc-columns">
  <p>First column content flows here automatically.</p>
  <p>It wraps naturally across the column boundary.</p>
</div>

<!-- Three columns with rule -->
<div class="fc-columns" style="--fc-columns-count: 3; --fc-columns-rule: 1px solid var(--ink)">
  <p>Column text one.</p>
  <p>Column text two.</p>
  <p>Column text three.</p>
</div>

<!-- Fluid columns (set width, browser decides count) -->
<div class="fc-columns" style="column-count: auto; --fc-columns-min-width: 20rem">
  <p>Fluid column A.</p>
  <p>Fluid column B.</p>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | N/A — layout primitive |
| **Role(s)** | No ARIA role; structural only |
| **Contrast** | Column rule must meet 3:1 if it conveys meaning |

---

## Notes

- CSS multi-column flows content sequentially across columns (like a newspaper). For independently scrollable or independently controlled side-by-side panels, use Grid or Sidebar instead.
- Avoid placing interactive components that span columns (e.g. a form spanning both columns) — `column-span: all` can cause reflow issues and is not supported in Firefox inside multi-column flex containers.
- For a two-column layout with a fixed-width sidebar, use the Sidebar layout primitive instead.
