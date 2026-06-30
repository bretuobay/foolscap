# Link

> A reference to a resource, either external (a different page) or internal (an element in the current document).
> **Tier:** 1 — CSS only
> **Also known as:** Anchor, Hyperlink
> **Native element:** `<a>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<a>` | `.fc-link` | Native anchor; `href` always required |
| `external-indicator` | `<span>` | `.fc-link__external` | Visually hidden text "(opens in new tab)" for screen readers |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-link-color` | `color` | `var(--ink)` |
| `--fc-link-decoration` | `text-decoration` | `underline` |
| `--fc-link-decoration-thickness` | `text-decoration-thickness` | `1px` |
| `--fc-link-decoration-offset` | `text-underline-offset` | `0.2em` |
| `--fc-link-color-hover` | `color` on `:hover` | `var(--ink)` |
| `--fc-link-decoration-hover` | `text-decoration` on `:hover` | `none` |

---

## HTML — Classless

```html
<!-- Internal link -->
<a href="/docs/getting-started">Getting started</a>

<!-- External link -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">
  Example site
  <span style="clip:rect(0 0 0 0);position:absolute;">(opens in new tab)</span>
</a>
```

---

## HTML — Class-based

```html
<!-- Default (underlined) -->
<a class="fc-link" href="/docs">Documentation</a>

<!-- Subtle (underline on hover only) -->
<a class="fc-link" href="/blog" data-variant="subtle">Blog</a>

<!-- Standalone (block-level link, e.g. navigation item) -->
<a class="fc-link" href="/about" data-variant="standalone">About us</a>

<!-- External -->
<a class="fc-link" href="https://example.com" target="_blank" rel="noopener noreferrer">
  Example site
  <span class="fc-link__external fc-visually-hidden">(opens in new tab)</span>
</a>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | Inherited (`<a href>` is implicit `link` role) |
| **Required attributes** | `href` always present; `target="_blank"` links must indicate this to screen readers via visually-hidden text or `aria-label`; `rel="noopener noreferrer"` on external links |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults); underline provides non-colour distinction per WCAG 1.4.1 |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `default` · `subtle` · `standalone` | `default`: always underlined; `subtle`: underline on hover only; `standalone`: block display, no underline, padding for hit area |

---

## Notes

- Never use `<a>` without `href`. A non-navigating interactive element is a `<button>`.
- The `standalone` variant is useful for navigation items and card-link patterns where underline would look wrong at display scale.
- External icon: optionally render an icon (`↗` or SVG) after the link text instead of (or alongside) the visually-hidden text.
