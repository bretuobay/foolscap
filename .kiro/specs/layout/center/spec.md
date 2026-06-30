# Center

> Horizontally centers content within the viewport or a parent, with a maximum width and fluid side padding.
> **Tier:** 1 — CSS only
> **Also known as:** —
> **Native element:** —

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-center` | Centers its children horizontally |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-center-max` | `max-width` | `65ch` |
| `--fc-center-padding` | inline padding (left/right) | `var(--fc-space-4, 1rem)` |

---

## HTML — Classless

```html
<!-- No classless equivalent -->
<div class="fc-center">
  <p>This content is centered with a max-width.</p>
</div>
```

---

## HTML — Class-based

```html
<div class="fc-center" style="--fc-center-max: 80ch;">
  <article>Article content with comfortable line length.</article>
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

- CSS: `max-width: var(--fc-center-max)` + `margin-inline: auto` + `padding-inline: var(--fc-center-padding)`
- Default `65ch` is chosen for optimal reading line length (Bringhurst guideline: 45–75 characters)
- Differs from `Container` in that Center is for content centering (e.g. prose, forms); Container is the full-page responsive wrapper
- Androgynous to nesting: a Center inside a Center still respects its own max-width
