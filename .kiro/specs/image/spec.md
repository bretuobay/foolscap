# Image

> An element for embedding images.
> **Tier:** 1 — CSS only
> **Also known as:** Picture
> **Native element:** `<img>` (or `<figure>` + `<figcaption>`)

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<figure>` | `.fc-image` | Optional; use when caption is present |
| `img` | `<img>` | `.fc-image__img` | The image itself; always required |
| `caption` | `<figcaption>` | `.fc-image__caption` | Optional caption text |

> For a bare image with no caption, use `<img class="fc-image__img">` directly without the `<figure>` wrapper.

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-image-radius` | `border-radius` on img | `0` |
| `--fc-image-border` | `border` on img | `none` |
| `--fc-image-caption-size` | `font-size` on caption | `0.875rem` |
| `--fc-image-caption-color` | `color` on caption | `var(--ink-muted)` |
| `--fc-image-caption-gap` | `margin-top` on caption | `var(--fc-space-2)` |

---

## HTML — Classless

```html
<!-- Simple image -->
<img src="/photo.jpg" alt="A description of the photo" loading="lazy" width="800" height="600">

<!-- With caption -->
<figure>
  <img src="/photo.jpg" alt="A description of the photo" loading="lazy" width="800" height="600">
  <figcaption>Caption text goes here.</figcaption>
</figure>
```

---

## HTML — Class-based

```html
<!-- Simple image -->
<img class="fc-image__img" src="/photo.jpg" alt="A description of the photo"
     loading="lazy" width="800" height="600">

<!-- With caption -->
<figure class="fc-image">
  <img class="fc-image__img" src="/photo.jpg" alt="A description of the photo"
       loading="lazy" width="800" height="600">
  <figcaption class="fc-image__caption">Photo by Jane Smith, 2024.</figcaption>
</figure>

<!-- Framed variant -->
<figure class="fc-image" data-variant="framed">
  <img class="fc-image__img" src="/photo.jpg" alt="..." loading="lazy" width="800" height="600">
</figure>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | `<img>` has implicit `img` role; `<figure>` is neutral |
| **Required attributes** | `alt` on every `<img>` (empty `alt=""` for decorative images) |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `default` · `framed` | `framed`: hairline border + small padding around image |

---

## Notes

- Always include `width` and `height` attributes to prevent layout shift (CLS).
- Use `loading="lazy"` for images below the fold; `loading="eager"` for above-the-fold hero images.
- Use with the AspectRatio layout primitive (`fc-aspect-ratio`) to enforce a fixed ratio before image loads.
- For responsive images, use `<picture>` + `srcset`; the `.fc-image__img` class applies to the `<img>` inside `<picture>`.
