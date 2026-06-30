# Visually Hidden

> Hides content visually while keeping it accessible to screen readers.
> **Tier:** 1 — CSS only
> **Also known as:** SR-only, Screen-reader-only, Visually hidden
> **Native element:** `<span>` (or any inline element)

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<span>` (or `<p>`, `<div>`) | `.fc-visually-hidden` | Single-class utility; no sub-parts |

---

## Design Tokens

No design tokens — this is a pure CSS utility with fixed position offscreen values.

---

## HTML — Classless

```html
<!-- No classless equivalent; this is a CSS utility class -->
```

---

## HTML — Class-based

```html
<!-- Supplementary label for an icon button -->
<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true" focusable="false"><!-- × icon --></svg>
  <span class="fc-visually-hidden">Close</span>
</button>

<!-- Announce loading state to AT without visual element -->
<div role="status" aria-live="polite">
  <span class="fc-visually-hidden">Content loaded.</span>
</div>

<!-- Skip link visible only on focus -->
<a class="fc-skip-link" href="#main">
  <span class="fc-visually-hidden">Skip to main content</span>
</a>

<!-- Column header with text label for AT on icon-only column -->
<th scope="col">
  <span aria-hidden="true">↕</span>
  <span class="fc-visually-hidden">Sort</span>
</th>
```

---

## CSS Implementation

```css
.fc-visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | Core utility — used across all APG patterns |
| **Role(s)** | No ARIA role; the element remains in the accessibility tree and is read by screen readers |
| **Required attributes** | None |
| **Contrast** | N/A — visually hidden content is not displayed |

---

## Notes

- **Do not use** `display: none` or `visibility: hidden` — these remove elements from the accessibility tree entirely.
- **Do not use** `opacity: 0` alone — the element remains visible to pointer events.
- **Do not use** `text-indent: -9999px` — can cause performance issues with RTL layouts and long lines.
- The canonical implementation above is the accepted pattern across Bootstrap, Tailwind, GOV.UK, and WCAG Techniques.
- For elements that should be visible on keyboard focus (skip links, focus-visible helpers), combine with a `:focus` override: `position: static; width: auto; height: auto; overflow: visible; clip: auto; white-space: normal;`
