# Button Group

> A wrapper for multiple, related buttons.
> **Tier:** 1 — CSS only
> **Also known as:** Toolbar
> **Native element:** `<div>` with `role="group"`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-button-group` | `role="group"` + `aria-label` |

> Children are Button components; no additional wrapper parts.

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-button-group-gap` | `gap` (spaced variant) | `var(--fc-space-2)` |

---

## HTML — Classless

```html
<div role="group" aria-label="Text formatting">
  <button type="button">Bold</button>
  <button type="button">Italic</button>
  <button type="button">Underline</button>
</div>
```

---

## HTML — Class-based

```html
<!-- Spaced (default) -->
<div class="fc-button-group" role="group" aria-label="Text formatting">
  <button class="fc-button" type="button" data-variant="secondary">Bold</button>
  <button class="fc-button" type="button" data-variant="secondary">Italic</button>
  <button class="fc-button" type="button" data-variant="secondary">Underline</button>
</div>

<!-- Attached variant: buttons share borders, no gap -->
<div class="fc-button-group" role="group" aria-label="View" data-variant="attached">
  <button class="fc-button" type="button" data-variant="secondary">List</button>
  <button class="fc-button" type="button" data-variant="secondary">Grid</button>
</div>

<!-- Vertical -->
<div class="fc-button-group" role="group" aria-label="Actions" data-orientation="vertical">
  <button class="fc-button" type="button" data-variant="secondary">Edit</button>
  <button class="fc-button" type="button" data-variant="secondary">Delete</button>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern (uses `role="group"`) |
| **Role(s)** | `role="group"` on root |
| **Required attributes** | `aria-label` or `aria-labelledby` on root to name the group |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `spaced` (default) · `attached` | `spaced`: buttons separated by gap; `attached`: buttons share hairline borders, no gap, adjacent radii collapsed |
| `data-orientation` | `horizontal` (default) · `vertical` | Changes flex direction |

---

## Notes

- For toolbar patterns with keyboard roving-tabindex, upgrade to Tier 3 (not needed for simple grouped buttons with independent actions).
- `attached` variant: use CSS `:not(:first-child)` to remove the left border and `:not(:last-child)/:not(:first-child)` to remove `border-radius` on inner edges.
