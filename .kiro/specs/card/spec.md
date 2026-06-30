# Card

> A container for content representing a single entity, e.g. a contact, article, or task.
> **Tier:** 1 — CSS only
> **Also known as:** Tile
> **Native element:** `<article>` (preferred) or `<div>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<article>` | `.fc-card` | Use `<div>` when not a standalone entity |
| `media` | `<div>` | `.fc-card__media` | Optional image/video area |
| `header` | `<div>` | `.fc-card__header` | Optional top section (title, meta) |
| `body` | `<div>` | `.fc-card__body` | Main content area |
| `footer` | `<div>` | `.fc-card__footer` | Optional bottom section (actions, metadata) |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-card-padding` | `padding` on header/body/footer | `var(--fc-space-4)` |
| `--fc-card-radius` | `border-radius` | `0` |
| `--fc-card-border` | `border` | `1px solid var(--ink)` |
| `--fc-card-bg` | `background-color` | `var(--paper-raised)` |
| `--fc-card-shadow` | `box-shadow` | `none` |
| `--fc-card-gap` | `gap` between internal sections | `0` |

---

## HTML — Classless

```html
<article>
  <img src="/img/cover.jpg" alt="Article cover">
  <h2>Card title</h2>
  <p>A brief description of the card content.</p>
  <a href="/article">Read more</a>
</article>
```

---

## HTML — Class-based

```html
<article class="fc-card" data-variant="default">
  <div class="fc-card__media">
    <img src="/img/cover.jpg" alt="Article cover">
  </div>
  <div class="fc-card__header">
    <h2>Card title</h2>
    <span class="fc-badge">New</span>
  </div>
  <div class="fc-card__body">
    <p>A brief description of the card content.</p>
  </div>
  <div class="fc-card__footer">
    <a class="fc-button" href="/article" data-variant="ghost">Read more</a>
  </div>
</article>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | `<article>` has implicit `article` role (landmark in context); `<div>` is neutral |
| **Required attributes** | If the entire card is clickable, use a single `<a>` wrapping the card or an `::after` pseudo-element link overlay; never nest multiple interactive elements inside a single link |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `default` · `flat` · `elevated` | `default`: hairline border; `flat`: no border, no shadow; `elevated`: subtle shadow via `--fc-card-shadow` |

---

## Notes

- Clickable cards: prefer a single prominent `<a>` in the footer over making the whole card a link — improves screen reader experience. If the whole card must be clickable, use the "stretched link" pattern (`::after` pseudo-element absolutely positioned).
- Media area (`fc-card__media`) uses `aspect-ratio` via the AspectRatio layout primitive by default.
- Card does not set its own width; it fills its grid/flex container. Use the Grid or Columns layout primitive to arrange cards.
