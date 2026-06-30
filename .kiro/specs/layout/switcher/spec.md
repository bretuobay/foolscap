# Switcher

> A flex layout that displays items horizontally until they would become too narrow, then wraps them all to a vertical stack simultaneously.
> **Tier:** 1 — CSS only
> **Also known as:** —
> **Native element:** —

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-switcher` | Flex container that switches layout at threshold |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-switcher-threshold` | `flex-basis` threshold for wrapping | `30rem` |
| `--fc-switcher-gap` | `gap` between children | `var(--fc-space-4, 1rem)` |
| `--fc-switcher-limit` | max number of items per row (optional) | unset |

---

## HTML — Classless

```html
<!-- No classless equivalent; use the class-based form -->
<div class="fc-switcher">
  <div>Item A</div>
  <div>Item B</div>
  <div>Item C</div>
</div>
```

---

## HTML — Class-based

```html
<div class="fc-switcher" style="--fc-switcher-threshold: 24rem; --fc-switcher-gap: 1.5rem;">
  <div>First column</div>
  <div>Second column</div>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | Inherited from children |
| **Required attributes** | None |
| **Contrast** | N/A — layout only |

---

## Notes

- The key CSS: `flex-wrap: wrap` + `flex-basis: calc((var(--fc-switcher-threshold) - 100%) * 999)` on children — this makes all children wrap simultaneously at the threshold rather than one at a time (the "switcher" trick from Every Layout)
- Wrap threshold is based on the *container* width, not the viewport — container-query-aware by nature
- Combine with `fc-switcher__limit` utility if you want to cap columns (set `max-width` on each child)
