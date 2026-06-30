# Heading

> A title or caption used to introduce a new section.
> **Tier:** 1 — CSS only
> **Also known as:** —
> **Native element:** `<h1>` – `<h6>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<h1>`–`<h6>` | `.fc-heading` | Semantic level set by element; visual size overridable via `data-level` |

---

## States & Data Attributes

| State | Attribute | Values | Carrier |
|-------|-----------|--------|---------|
| Visual size override | `data-level` | `1` · `2` · `3` · `4` · `5` · `6` | `root` |

> `data-level` decouples visual size from semantic heading level. E.g. `<h2 data-level="1">` renders at h1 size but has h2 semantics.

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-heading-1` | `font-size` (h1 / `[data-level="1"]`) | `clamp(2rem, 4vw + 1rem, 3.5rem)` |
| `--fc-heading-2` | `font-size` | `clamp(1.5rem, 3vw + 0.5rem, 2.5rem)` |
| `--fc-heading-3` | `font-size` | `clamp(1.25rem, 2vw + 0.5rem, 2rem)` |
| `--fc-heading-4` | `font-size` | `clamp(1.125rem, 1.5vw, 1.5rem)` |
| `--fc-heading-5` | `font-size` | `1.125rem` |
| `--fc-heading-6` | `font-size` | `1rem` |
| `--fc-heading-weight` | `font-weight` | `700` |
| `--fc-heading-line-height` | `line-height` | `1.2` |
| `--fc-heading-color` | `color` | `var(--ink)` |

---

## HTML — Classless

```html
<h1>Page title</h1>
<h2>Section heading</h2>
<h3>Subsection</h3>
```

---

## HTML — Class-based

```html
<!-- Normal usage: semantic level = visual size -->
<h2 class="fc-heading">Section heading</h2>

<!-- Visual size override: looks like h1, semantically h2 -->
<h2 class="fc-heading" data-level="1">Hero headline</h2>

<!-- Visually subtle heading -->
<h3 class="fc-heading" data-level="5">Small label heading</h3>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | Inherited implicit `heading` role with level from element |
| **Required attributes** | None; `data-level` is purely visual — semantic level comes from element choice |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Notes

- Always choose heading level based on document outline, not visual size. Use `data-level` to correct visual size independently.
- The fluid `clamp()` scale eliminates the need for breakpoint-specific heading overrides in most cases.
- Heading color defaults to `--ink`; section headings in lower-emphasis areas can use `--ink-muted` via CSS cascade.
