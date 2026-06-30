# Container

> The primary responsive page-width wrapper: constrains content to a maximum width and adds consistent fluid side padding across the responsive range.
> **Tier:** 1 — CSS only
> **Also known as:** —
> **Native element:** —

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-container` | Max-width + centered + fluid padding |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-container-max` | `max-width` | `72rem` (≈ 1152px) |
| `--fc-container-padding` | `padding-inline` | `clamp(1rem, 5vw, 3rem)` |

---

## HTML — Classless

```html
<!-- No classless equivalent; use the class -->
<div class="fc-container">
  <main>Page content</main>
</div>
```

---

## HTML — Class-based

```html
<!-- Default container -->
<div class="fc-container">
  <section>…</section>
</div>

<!-- Wider variant -->
<div class="fc-container" style="--fc-container-max: 90rem;">
  <section>…</section>
</div>

<!-- Narrow (prose) variant — combine with Center -->
<div class="fc-container">
  <div class="fc-center">
    <article>…</article>
  </div>
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

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-size` | `sm` · `md` (default) · `lg` · `full` | Maps to named max-width tokens: sm=48rem, md=72rem, lg=90rem, full=100% |

---

## Notes

- CSS: `max-width: var(--fc-container-max)` + `margin-inline: auto` + `padding-inline: var(--fc-container-padding)`
- `clamp(1rem, 5vw, 3rem)` for padding gives fluid side gutters — narrows on mobile without a breakpoint
- Differs from `Center`: Container is the full-page outer wrapper; Center is for constraining reading-width content within a section
- Full-bleed sections inside a Container: use negative margin trick or a sibling element outside the Container, not a child
