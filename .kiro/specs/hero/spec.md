# Hero

> A large banner, usually one of the first items on a page, often containing a full-width image.
> **Tier:** 1 — CSS only
> **Also known as:** Jumbotron, Banner
> **Native element:** `<section>` or `<div>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<section>` | `.fc-hero` | Top-level wrapper; full-width |
| `media` | `<div>` | `.fc-hero__media` | Background image/video slot |
| `content` | `<div>` | `.fc-hero__content` | Foreground content overlay |
| `title` | `<h1>` | `.fc-hero__title` | Main heading (usually page h1) |
| `subtitle` | `<p>` | `.fc-hero__subtitle` | Supporting text |
| `actions` | `<div>` | `.fc-hero__actions` | Slot for buttons/links |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-hero-min-height` | `min-height` | `60vh` |
| `--fc-hero-padding` | `padding` on content | `var(--fc-space-8)` |
| `--fc-hero-overlay-opacity` | opacity of overlay between media and content | `0` (no overlay in paper default) |
| `--fc-hero-gap` | `gap` between title/subtitle/actions | `var(--fc-space-4)` |
| `--fc-hero-content-max-width` | `max-width` on content | `48rem` |

---

## HTML — Classless

```html
<section>
  <h1>The world's simplest design system</h1>
  <p>Paper-styled components for every framework.</p>
  <a href="/docs">Get started</a>
  <a href="/components">Browse components</a>
</section>
```

---

## HTML — Class-based

```html
<section class="fc-hero">
  <div class="fc-hero__media">
    <img src="/hero-bg.jpg" alt="" aria-hidden="true">
  </div>
  <div class="fc-hero__content">
    <h1 class="fc-hero__title">The world's simplest design system</h1>
    <p class="fc-hero__subtitle">Paper-styled, framework-agnostic, accessible by default.</p>
    <div class="fc-hero__actions">
      <a class="fc-button" href="/docs" data-variant="primary">Get started</a>
      <a class="fc-button" href="/components" data-variant="secondary">Browse components</a>
    </div>
  </div>
</section>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | `<section>` has `region` landmark if it has an accessible name (add `aria-labelledby` pointing to `fc-hero__title`) |
| **Required attributes** | Background media that is purely decorative should have `alt=""` and/or `aria-hidden="true"`; `aria-labelledby` if section landmark is desired |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults); ensure text overlaid on media images maintains sufficient contrast |

---

## Notes

- Background image is placed in `.fc-hero__media` (as `<img>` or CSS `background-image`); content sits in `.fc-hero__content` via CSS Grid overlay (both children in the same grid area).
- The paper theme defaults to no background image and no overlay — a clean typographic hero. The `--fc-hero-overlay-opacity` token supports image-behind-text use cases.
- Video backgrounds: use `<video autoplay muted loop playsinline aria-hidden="true">` in the media slot; respect `prefers-reduced-motion` by pausing the video.
