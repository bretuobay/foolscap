# Skip Link

> A visually hidden link at the top of the page that lets keyboard users jump straight to main content.
> **Tier:** 1 — CSS only
> **Also known as:** Skip navigation, Skip to content
> **Native element:** `<a href="#main">`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<a>` | `.fc-skip-link` | Visually hidden until focused |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-skip-link-bg` | `background-color` when visible | `var(--ink)` |
| `--fc-skip-link-color` | `color` when visible | `var(--paper)` |
| `--fc-skip-link-padding` | `padding` when visible | `var(--fc-space-2) var(--fc-space-4)` |
| `--fc-skip-link-z` | `z-index` | `9999` |

---

## HTML — Classless

```html
<!-- Place as the very first element inside <body> -->
<a href="#main-content">Skip to main content</a>

<header>…</header>
<main id="main-content" tabindex="-1">…</main>
```

---

## HTML — Class-based

```html
<a class="fc-skip-link" href="#main-content">Skip to main content</a>

<header class="fc-header">…</header>
<main id="main-content" tabindex="-1">
  <!-- page content -->
</main>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | [Skip Links (APG practice)](https://www.w3.org/WAI/WCAG21/Techniques/general/G1) |
| **Role(s)** | Native `<a>` — no additional role required |
| **Required attributes** | `href="#id"` pointing to an existing target; target must have `tabindex="-1"` if it's not natively focusable |
| **Contrast** | Visible state must meet WCAG 2.2 AA (4.5:1 minimum) |

---

## Notes

- The skip link is **visually hidden** (`position: absolute; left: -9999px`) at rest and becomes visible on `:focus` (moves to `position: fixed; top: 0; left: 0`).
- Must be the **first focusable element** on the page so keyboard users encounter it immediately.
- Target element (`id="main-content"`) needs `tabindex="-1"` so it receives focus from the link without being in the tab order itself.
- Multiple skip links are valid for complex pages (e.g. "Skip to navigation", "Skip to main content", "Skip to footer").
