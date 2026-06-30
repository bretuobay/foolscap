# Skeleton

> A placeholder layout for content that hasn't yet loaded, usually grey boxes.
> **Tier:** 1 — CSS only
> **Also known as:** Skeleton loader
> **Native element:** `<div aria-hidden="true">`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-skeleton` | `aria-hidden="true"` always; hidden from AT |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Variant shape | `data-variant` | `text` · `heading` · `block` · `circle` | `root` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-skeleton-bg` | `background-color` (base) | `var(--grey-200)` |
| `--fc-skeleton-shimmer-color` | shimmer highlight color | `var(--grey-100)` |
| `--fc-skeleton-radius` | `border-radius` | `0` |
| `--fc-skeleton-duration` | animation duration | `1.5s` |
| `--fc-skeleton-height-text` | height for text variant | `1em` |
| `--fc-skeleton-height-heading` | height for heading variant | `1.5em` |
| `--fc-skeleton-circle-size` | size for circle variant | `2.5rem` |

---

## HTML — Classless

```html
<!-- No classless equivalent: skeleton is a CSS utility only -->
<!-- Use class-based markup; always aria-hidden -->
```

---

## HTML — Class-based

```html
<!-- Text line placeholder -->
<div class="fc-skeleton" data-variant="text" aria-hidden="true" style="width: 80%;"></div>

<!-- Heading placeholder -->
<div class="fc-skeleton" data-variant="heading" aria-hidden="true" style="width: 60%;"></div>

<!-- Block placeholder (e.g. image) -->
<div class="fc-skeleton" data-variant="block" aria-hidden="true"
     style="width: 100%; height: 12rem;"></div>

<!-- Circle placeholder (e.g. avatar) -->
<div class="fc-skeleton" data-variant="circle" aria-hidden="true"></div>

<!-- Compound skeleton (card placeholder) -->
<div aria-hidden="true">
  <div class="fc-skeleton" data-variant="block" style="height: 10rem;"></div>
  <div class="fc-skeleton" data-variant="heading" style="width: 70%; margin-top: 1rem;"></div>
  <div class="fc-skeleton" data-variant="text" style="width: 90%;"></div>
  <div class="fc-skeleton" data-variant="text" style="width: 75%;"></div>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | `aria-hidden="true"` on all skeleton elements — they are invisible to screen readers |
| **Required attributes** | `aria-hidden="true"` always; provide a status announcement via `role="status"` on a separate element (e.g. `<div role="status" class="fc-visually-hidden">Loading…</div>`) |
| **Contrast** | N/A — skeleton is a placeholder; grey-on-grey is intentional |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `text` · `heading` · `block` · `circle` | Controls preset height and border-radius |

---

## Notes

- The shimmer animation uses a CSS `linear-gradient` sweep via `@keyframes` on `background-position`. Disable with `prefers-reduced-motion: reduce` (use a static grey fill instead).
- Width is always set by the caller via inline `style` or a utility class — skeleton does not have an intrinsic width.
- Announce loading state to screen readers separately (e.g. `aria-live="polite"` region or `role="status"` element); never rely on skeleton visibility for AT communication.
