# Breadcrumbs

> A list of links showing the location of the current page in the navigational hierarchy.
> **Tier:** 1 — CSS only
> **Also known as:** Breadcrumb trail
> **Native element:** `<nav>` + `<ol>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<nav>` | `.fc-breadcrumbs` | `aria-label="Breadcrumb"` |
| `list` | `<ol>` | `.fc-breadcrumbs__list` | Ordered; list-style none |
| `item` | `<li>` | `.fc-breadcrumbs__item` | Each crumb |
| `link` | `<a>` | `.fc-breadcrumbs__link` | Navigation link; omitted on current page |
| `current` | `<span>` | `.fc-breadcrumbs__current` | Current page; not a link |
| `separator` | `<span>` | `.fc-breadcrumbs__separator` | `aria-hidden="true"` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-breadcrumbs-gap` | `gap` on list | `var(--fc-space-2)` |
| `--fc-breadcrumbs-separator` | `content` on separator | `"/"` (CSS-inserted alternative) |
| `--fc-breadcrumbs-font-size` | `font-size` | `0.875rem` |
| `--fc-breadcrumbs-color-current` | `color` on current | `var(--ink-muted)` |

---

## HTML — Classless

```html
<nav aria-label="Breadcrumb">
  <ol>
    <li><a href="/">Home</a></li>
    <li><a href="/docs">Docs</a></li>
    <li><span aria-current="page">Getting started</span></li>
  </ol>
</nav>
```

---

## HTML — Class-based

```html
<nav class="fc-breadcrumbs" aria-label="Breadcrumb">
  <ol class="fc-breadcrumbs__list">
    <li class="fc-breadcrumbs__item">
      <a class="fc-breadcrumbs__link" href="/">Home</a>
      <span class="fc-breadcrumbs__separator" aria-hidden="true">/</span>
    </li>
    <li class="fc-breadcrumbs__item">
      <a class="fc-breadcrumbs__link" href="/docs">Docs</a>
      <span class="fc-breadcrumbs__separator" aria-hidden="true">/</span>
    </li>
    <li class="fc-breadcrumbs__item">
      <span class="fc-breadcrumbs__current" aria-current="page">Getting started</span>
    </li>
  </ol>
</nav>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Breadcrumb](https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/) |
| **Role(s)** | `<nav>` provides landmark; `<ol>` is implicit `list` |
| **Required attributes** | `aria-label="Breadcrumb"` on `<nav>`; `aria-current="page"` on the current item |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Notes

- Separators can be CSS-generated via `::after` on `.fc-breadcrumbs__item:not(:last-child)` to avoid repetitive HTML; the explicit `<span aria-hidden="true">` is also valid and more portable.
- Do not wrap the current page text in `<a>` — linking to the current page is redundant and confusing.
- Truncation for long trails (show first + last, collapse middle) requires JS and is a Tier 3 extension.
