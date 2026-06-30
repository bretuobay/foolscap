# AspectRatio / Frame

> Enforces a fixed aspect ratio on its child element (image, video, map, embed), preventing layout shift during load.
> **Tier:** 1 — CSS only
> **Also known as:** Frame
> **Native element:** —

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-aspect-ratio` | Sets the aspect ratio constraint |
| `media` | `<img>` · `<video>` · `<iframe>` | `.fc-aspect-ratio__media` | Fills the constrained box (`object-fit: cover`) |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-aspect-ratio` | `aspect-ratio` on root | `16 / 9` |
| `--fc-aspect-fit` | `object-fit` on media | `cover` |

---

## HTML — Classless

```html
<!-- No classless equivalent -->
<div class="fc-aspect-ratio">
  <img src="photo.jpg" alt="Landscape" class="fc-aspect-ratio__media" />
</div>
```

---

## HTML — Class-based

```html
<!-- 16:9 video thumbnail -->
<div class="fc-aspect-ratio" style="--fc-aspect-ratio: 16 / 9;">
  <img src="thumbnail.jpg" alt="Video title" class="fc-aspect-ratio__media" />
</div>

<!-- Square avatar crop -->
<div class="fc-aspect-ratio" style="--fc-aspect-ratio: 1 / 1; --fc-aspect-fit: cover;">
  <img src="avatar.jpg" alt="User name" class="fc-aspect-ratio__media" />
</div>

<!-- 4:3 embedded video -->
<div class="fc-aspect-ratio" style="--fc-aspect-ratio: 4 / 3;">
  <iframe src="…" title="Embedded video" class="fc-aspect-ratio__media"></iframe>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | Inherited from media child (`<img>` alt, `<iframe>` title) |
| **Required attributes** | `alt` on `<img>`; `title` on `<iframe>` |
| **Contrast** | N/A — layout only |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `--fc-aspect-ratio` | Any valid CSS ratio e.g. `1/1`, `4/3`, `16/9`, `21/9` | Sets the constrained ratio |
| `--fc-aspect-fit` | `cover` · `contain` · `fill` | Maps to `object-fit` on the media child |

---

## Notes

- CSS: `aspect-ratio: var(--fc-aspect-ratio)` on root + `width: 100%; height: 100%; object-fit: var(--fc-aspect-fit)` on media child
- `aspect-ratio` is widely supported (all modern browsers); no padding-top hack needed
- For `<iframe>` embeds (which ignore `object-fit`), use `width: 100%; height: 100%` on the iframe — the root's `aspect-ratio` constrains it
- Prevents cumulative layout shift (CLS) when images load, which improves Core Web Vitals
