# Quote

> Used to display a quotation from a person or outside source, or to highlight a passage (a pull quote).
> **Tier:** 1 — CSS only
> **Also known as:** Pull quote, Block quote
> **Native element:** `<blockquote>` + `<cite>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<blockquote>` | `.fc-quote` | The quotation container |
| `text` | `<p>` | `.fc-quote__text` | The quoted passage |
| `attribution` | `<footer>` | `.fc-quote__attribution` | Citation wrapper (inside blockquote) |
| `cite` | `<cite>` | `.fc-quote__cite` | The source/speaker |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-quote-border` | `border-inline-start` (default) | `3px solid var(--ink)` |
| `--fc-quote-padding` | `padding-inline-start` | `var(--fc-space-4)` |
| `--fc-quote-font-size` | `font-size` on text | `inherit` |
| `--fc-quote-font-style` | `font-style` on text | `italic` |
| `--fc-quote-pull-font-size` | `font-size` for pull-quote variant | `clamp(1.25rem, 2vw + 0.5rem, 2rem)` |
| `--fc-quote-cite-size` | `font-size` on cite | `0.875rem` |
| `--fc-quote-cite-color` | `color` on cite | `var(--ink-muted)` |

---

## HTML — Classless

```html
<blockquote>
  <p>Most UI complexity is accidental, not essential.</p>
  <footer>— <cite>Foolscap PRD</cite></footer>
</blockquote>
```

---

## HTML — Class-based

```html
<!-- Default (left-bordered) -->
<blockquote class="fc-quote">
  <p class="fc-quote__text">Most UI complexity is accidental, not essential.</p>
  <footer class="fc-quote__attribution">
    — <cite class="fc-quote__cite">Foolscap PRD, 2026</cite>
  </footer>
</blockquote>

<!-- Pull quote (large, centered) -->
<blockquote class="fc-quote" data-variant="pull">
  <p class="fc-quote__text">"The page is paper; components are ink and rules."</p>
  <footer class="fc-quote__attribution">
    — <cite class="fc-quote__cite">Foolscap Design Principles</cite>
  </footer>
</blockquote>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | `<blockquote>` has no explicit ARIA role; treated as sectioning content |
| **Required attributes** | None beyond semantic HTML; if the quote is from an external source, use `cite` attribute on `<blockquote>` with the URL |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `default` · `pull` | `default`: left border rule, normal body size; `pull`: larger fluid type, centered, decorative quotation marks via `::before`/`::after` |

---

## Notes

- The `<footer>` inside `<blockquote>` is valid HTML and does not affect page landmark structure (it's a descendant of `<blockquote>`, not `<body>`).
- Decorative quotation marks in the pull-quote variant are CSS `::before`/`::after` content — `aria-hidden` is not needed as they are CSS, not HTML.
- `cite` attribute on `<blockquote>` should contain a URL when the source is online, for machine-readability.
