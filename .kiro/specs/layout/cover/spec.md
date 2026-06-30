# Cover

> A full-height section that vertically centers a primary element, with optional header and footer slots pinned to the top and bottom.
> **Tier:** 1 — CSS only
> **Also known as:** —
> **Native element:** —

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<div>` | `.fc-cover` | Full-height flex column container |
| `header` | `<div>` | `.fc-cover__header` | Optional top-pinned slot |
| `centered` | `<div>` | `.fc-cover__centered` | The element that gets vertically centered (`margin-block: auto`) |
| `footer` | `<div>` | `.fc-cover__footer` | Optional bottom-pinned slot |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-cover-min-height` | `min-height` on root | `100svh` |
| `--fc-cover-padding` | `padding` on root | `var(--fc-space-4, 1rem)` |
| `--fc-cover-gap` | `gap` between sections | `var(--fc-space-4, 1rem)` |

---

## HTML — Classless

```html
<!-- No classless equivalent -->
<div class="fc-cover">
  <div class="fc-cover__centered">
    <h1>Centered hero content</h1>
  </div>
</div>
```

---

## HTML — Class-based

```html
<div class="fc-cover" style="--fc-cover-min-height: 100svh;">
  <header class="fc-cover__header">
    <nav><!-- site nav --></nav>
  </header>
  <div class="fc-cover__centered">
    <h1>Welcome to Foolscap</h1>
    <p>The world's simplest design system.</p>
  </div>
  <footer class="fc-cover__footer">
    <p>Scroll to explore</p>
  </footer>
</div>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | Inherited from children |
| **Required attributes** | None |
| **Contrast** | N/A — layout only |

---

## Notes

- CSS: `display: flex; flex-direction: column; min-height: var(--fc-cover-min-height); padding: var(--fc-cover-padding)`; centered child gets `margin-block: auto`
- `100svh` (small viewport height) is preferred over `100vh` on mobile to account for browser chrome
- The centered element can be anything — a hero section, a login form, a 404 message
- Header and footer slots are optional; if absent, the centered element is truly centered; if present, they are pinned and the centered element takes remaining space
