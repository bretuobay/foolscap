# Badge

> A small label appearing inside or in proximity to another component, representing a status, property, or metadata.
> **Tier:** 1 — CSS only
> **Also known as:** Tag, Label, Chip
> **Native element:** `<span>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<span>` | `.fc-badge` | Single element; inline |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-badge-padding` | `padding` | `0.125em 0.5em` |
| `--fc-badge-font-size` | `font-size` | `0.75rem` |
| `--fc-badge-radius` | `border-radius` | `0.25em` |
| `--fc-badge-border` | `border` | `1px solid var(--ink)` |
| `--fc-badge-bg` | `background-color` | `var(--ink)` |
| `--fc-badge-color` | `color` | `var(--paper)` |

---

## HTML — Classless

```html
<span>New</span>
```

---

## HTML — Class-based

```html
<!-- Default (filled) -->
<span class="fc-badge">New</span>

<!-- Outline variant, small -->
<span class="fc-badge" data-variant="outline" data-size="sm">Beta</span>

<!-- Subtle -->
<span class="fc-badge" data-variant="subtle">Archived</span>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | Inherited (`<span>` is inline text) |
| **Required attributes** | None beyond semantic HTML; if badge conveys status not visible in surrounding context, add `aria-label` or a visually-hidden description on the parent |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `default` · `outline` · `subtle` | `default`: ink bg, paper text; `outline`: transparent bg, ink border+text; `subtle`: grey-100 bg, ink text |
| `data-size` | `sm` · `md` | `sm`: 0.6875rem font; `md` (default): 0.75rem font |

---

## Notes

- Badge is inline-only; wrap in a `<div>` or use flex/grid on the parent to position it relative to another element (e.g. top-right corner of an avatar).
- No interactive version in Tier 1; interactive badges (dismissible chips) require a button inside and are out of scope at this tier.
