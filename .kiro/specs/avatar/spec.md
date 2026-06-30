# Avatar

> A graphical representation of a user: usually a photo, illustration, or initial.
> **Tier:** 1 — CSS only
> **Also known as:** —
> **Native element:** `<img>` (image) or `<span>` (initials fallback)

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<span>` | `.fc-avatar` | Sizing wrapper |
| `image` | `<img>` | `.fc-avatar__image` | Hidden via CSS if broken; `alt` required |
| `fallback` | `<span>` | `.fc-avatar__fallback` | Initials or icon; shown when image absent or broken |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-avatar-size` | `width` + `height` | `2.5rem` |
| `--fc-avatar-radius` | `border-radius` | `50%` (circle) |
| `--fc-avatar-border` | `border` | `1px solid var(--grey-200)` |
| `--fc-avatar-bg` | `background-color` on fallback | `var(--grey-100)` |
| `--fc-avatar-font-size` | `font-size` on fallback | `0.75em` |

---

## HTML — Classless

```html
<img src="/path/to/photo.jpg" alt="Ada Lovelace" width="40" height="40"
     style="border-radius:50%; width:2.5rem; height:2.5rem; object-fit:cover;">
```

---

## HTML — Class-based

```html
<!-- With image -->
<span class="fc-avatar" data-size="md">
  <img class="fc-avatar__image" src="/path/to/photo.jpg" alt="Ada Lovelace">
  <span class="fc-avatar__fallback" aria-hidden="true">AL</span>
</span>

<!-- Initials only (no image) -->
<span class="fc-avatar" data-size="md" data-variant="square">
  <span class="fc-avatar__fallback" aria-label="Ada Lovelace">AL</span>
</span>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | `<img>` carries implicit `img` role |
| **Required attributes** | `alt` on `<img>` (empty `alt=""` if purely decorative; meaningful description otherwise) |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `circle` (default) · `square` | Sets `--fc-avatar-radius` to `50%` or `var(--fc-radius-sm)` |
| `data-size` | `sm` · `md` · `lg` | Overrides `--fc-avatar-size` (1.5rem / 2.5rem / 4rem) |

---

## Notes

- Image fallback: when `<img>` fails to load, use CSS `color: transparent` on the image and `display: flex` on root to surface the fallback `<span>`. A small inline script setting `onerror` can also toggle a class.
- For groups of avatars (stacked overlap), wrap in a `<ul>` with list styling removed; spacing via negative margin on items.
- Initials truncation: max 2 characters; component does not auto-compute initials — caller supplies them.
