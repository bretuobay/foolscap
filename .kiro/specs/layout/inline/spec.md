# Layout / Inline

> Arranges children horizontally with wrapping and consistent spacing — ideal for tag lists, button groups, and inline elements.
> **Tier:** 1 — CSS only
> **Also known as:** Inline, Cluster, Flex row
> **Native element:** `<div>` with `display: flex; flex-wrap: wrap`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-inline` | Flex-wrap row container |
| `item` | any child | — | Direct children flow inline with wrapping |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-inline-gap` | `gap` | `var(--fc-space-2)` |
| `--fc-inline-align` | `align-items` | `center` |
| `--fc-inline-justify` | `justify-content` | `flex-start` |

---

## HTML — Classless

```html
<!-- No dedicated classless form -->
```

---

## HTML — Class-based

```html
<!-- Tag cloud -->
<div class="fc-inline">
  <span class="fc-badge">Accessibility</span>
  <span class="fc-badge">CSS</span>
  <span class="fc-badge">Headless UI</span>
  <span class="fc-badge">Paper</span>
</div>

<!-- Button row -->
<div class="fc-inline" style="--fc-inline-gap: var(--fc-space-3)">
  <button class="fc-button" data-variant="primary">Save</button>
  <button class="fc-button" data-variant="secondary">Cancel</button>
</div>

<!-- Right-aligned (end-justified) -->
<div class="fc-inline" style="--fc-inline-justify: flex-end">
  <button class="fc-button" data-variant="ghost">Back</button>
  <button class="fc-button" data-variant="primary">Next</button>
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

- Inline wraps by default (`flex-wrap: wrap`); use `flex-wrap: nowrap` via inline style for non-wrapping rows like navigation bars.
- Default `align-items: center` vertically centres items of different heights.
- For interactive inline groups (radio buttons styled as pills, toolbar buttons), wrap in an appropriate ARIA role (`role="group"`, `role="toolbar"`) at the semantic layer.
