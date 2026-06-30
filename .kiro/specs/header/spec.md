# Header

> An element across the top of all pages, usually containing the site name and main navigation.
> **Tier:** 1 — CSS only (Navigation inside is Tier 3)
> **Also known as:** —
> **Native element:** `<header>`

---

## Anatomy

| Part | Element | Class | Notes |
|------|---------|-------|-------|
| `root` | `<header>` | `.fc-header` | Page-level header |
| `brand` | `<a>` | `.fc-header__brand` | Logo or site name; links to home |
| `nav` | `<div>` | `.fc-header__nav` | Slot for Navigation component |
| `actions` | `<div>` | `.fc-header__actions` | Slot for search, account, buttons |

---

## Design Tokens

| Token | CSS Property | Default |
|-------|-------------|---------|
| `--fc-header-height` | `min-height` | `3.5rem` |
| `--fc-header-padding` | `padding-inline` | `var(--fc-space-4)` |
| `--fc-header-border` | `border-bottom` | `1px solid var(--ink)` |
| `--fc-header-bg` | `background-color` | `var(--paper)` |
| `--fc-header-gap` | `gap` between sections | `var(--fc-space-4)` |

---

## HTML — Classless

```html
<header>
  <a href="/">Foolscap</a>
  <nav aria-label="Main">
    <a href="/docs">Docs</a>
    <a href="/components">Components</a>
    <a href="/about">About</a>
  </nav>
</header>
```

---

## HTML — Class-based

```html
<header class="fc-header">
  <a class="fc-header__brand" href="/">
    <img src="/logo.svg" alt="Foolscap" width="120" height="32">
  </a>
  <div class="fc-header__nav">
    <!-- Navigation component goes here -->
    <nav aria-label="Main">
      <a href="/docs">Docs</a>
      <a href="/components">Components</a>
    </nav>
  </div>
  <div class="fc-header__actions">
    <a class="fc-button" href="/login" data-variant="secondary" data-size="sm">Sign in</a>
    <a class="fc-button" href="/signup" data-variant="primary" data-size="sm">Get started</a>
  </div>
</header>
```

---

## Accessibility

| | |
|---|---|
| **ARIA Pattern** | No specific APG pattern |
| **Role(s)** | `<header>` has implicit `banner` landmark (page-level) |
| **Required attributes** | `aria-label` on `<nav>` if multiple nav elements present |
| **Contrast** | Meets WCAG 2.2 AA (ink-on-paper defaults) |

---

## Notes

- One `<header>` as a direct descendant of `<body>` acts as the `banner` landmark; nested `<header>` elements inside `<article>`/`<section>` do not.
- Sticky/fixed behaviour: add `position: sticky; top: 0; z-index: var(--fc-z-header)` via a utility class or custom CSS; not part of the default spec.
- Mobile responsive collapse (hamburger menu): handled by the Navigation component (Tier 3), not by Header itself.
