# Footer

> Appearing at the bottom of a page or section, used for copyright/legal information or links to related content.
> **Tier:** 1 — CSS only
> **Also known as:** —
> **Native element:** `<footer>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<footer>` | `.fc-footer` | Page-level or section-level footer |
| `nav` | `<nav>` | `.fc-footer__nav` | Optional navigation links area |
| `legal` | `<p>` | `.fc-footer__legal` | Copyright/legal text |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-footer-padding` | `padding` | `var(--fc-space-6) var(--fc-space-4)` |
| `--fc-footer-border` | `border-top` | `1px solid var(--ink)` |
| `--fc-footer-font-size` | `font-size` | `0.875rem` |
| `--fc-footer-color` | `color` | `var(--ink-muted)` |
| `--fc-footer-gap` | `gap` between sections | `var(--fc-space-4)` |

---

## HTML — Classless

```html
<footer>
  <nav aria-label="Footer navigation">
    <a href="/about">About</a>
    <a href="/privacy">Privacy</a>
    <a href="/terms">Terms</a>
  </nav>
  <p>&copy; 2026 Baobab Solutions. All rights reserved.</p>
</footer>
```

---

## HTML — Class-based

```html
<footer class="fc-footer">
  <nav class="fc-footer__nav" aria-label="Footer navigation">
    <a href="/about">About</a>
    <a href="/privacy">Privacy</a>
    <a href="/terms">Terms</a>
  </nav>
  <p class="fc-footer__legal">&copy; 2026 Baobab Solutions. All rights reserved.</p>
</footer>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | `<footer>` has implicit `contentinfo` landmark (when page-level); `role="contentinfo"` not needed |
| **Required attributes** | `aria-label` on `<nav>` if multiple nav landmarks are present on the page |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Notes

- Use only one `<footer role="contentinfo">` (i.e. `<footer>` as a direct descendant of `<body>`) per page for the page footer. Section-level footers inside `<article>` or `<section>` do not carry the `contentinfo` landmark.
- For complex footers with multiple columns, use the Columns or Grid layout primitive inside `fc-footer`.
- Sitemap-style footers (many links in columns) are composed of this component plus a Grid layout primitive.
