# List

> Used for grouping a collection of related items (unordered, ordered, or description lists).
> **Tier:** 1 — CSS only
> **Also known as:** —
> **Native element:** `<ul>`, `<ol>`, or `<dl>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<ul>` / `<ol>` / `<dl>` | `.fc-list` | Element chosen by semantic type |
| `item` | `<li>` | `.fc-list__item` | For `<ul>` and `<ol>` |
| `term` | `<dt>` | `.fc-list__term` | For `<dl>` |
| `detail` | `<dd>` | `.fc-list__detail` | For `<dl>` |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-list-gap` | `margin-block` between items | `var(--fc-space-2)` |
| `--fc-list-padding-start` | `padding-inline-start` | `1.5em` |
| `--fc-list-marker-color` | `color` of `::marker` | `var(--ink)` |
| `--fc-list-term-weight` | `font-weight` on `<dt>` | `600` |
| `--fc-list-detail-indent` | `padding-inline-start` on `<dd>` | `var(--fc-space-4)` |

---

## HTML — Classless

```html
<!-- Unordered -->
<ul>
  <li>First item</li>
  <li>Second item</li>
  <li>Third item</li>
</ul>

<!-- Ordered -->
<ol>
  <li>Step one</li>
  <li>Step two</li>
</ol>

<!-- Description list -->
<dl>
  <dt>Term</dt>
  <dd>Definition or description</dd>
</dl>
```

---

## HTML — Class-based

```html
<!-- Bulleted (default) -->
<ul class="fc-list">
  <li class="fc-list__item">First item</li>
  <li class="fc-list__item">Second item</li>
</ul>

<!-- Numbered -->
<ol class="fc-list" data-variant="numbered">
  <li class="fc-list__item">Step one</li>
  <li class="fc-list__item">Step two</li>
</ol>

<!-- Plain (no markers) -->
<ul class="fc-list" data-variant="plain">
  <li class="fc-list__item">Navigation item</li>
  <li class="fc-list__item">Another item</li>
</ul>

<!-- Description list -->
<dl class="fc-list" data-variant="description">
  <dt class="fc-list__term">Author</dt>
  <dd class="fc-list__detail">Ada Lovelace</dd>
  <dt class="fc-list__term">Published</dt>
  <dd class="fc-list__detail">1843</dd>
</dl>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | `<ul>` → `list`, `<ol>` → `list`, `<dl>` → inherited; note: `list-style: none` removes the implicit list role in Safari — add `role="list"` if markers are hidden |
| **Required attributes** | Add `role="list"` on `<ul>`/`<ol>` when using `data-variant="plain"` (Safari list role removal) |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Variants & Modifiers

| Attribute | Values | Effect |
|-----------|--------|--------|
| `data-variant` | `bulleted` (default) · `numbered` · `plain` · `description` | `plain`: removes list markers and padding; `description`: applies term/detail layout |

---

## Notes

- `plain` variant: use for navigation lists, tag lists, or any list where bullets are unwanted. Always add `role="list"` to prevent Safari removing the semantic role.
- Nested lists: inner `<ul>` / `<ol>` inside `<li>` are styled recursively by the classless layer.
